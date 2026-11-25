// Shared streaming reader for lessons and the jumping game. Credentials stay on the server.
(() => {
  'use strict';
  function create({isEnabled = () => true} = {}) {
    const MINIMAX_TTS_ENDPOINT = '/.netlify/functions/speech';
    const MINIMAX_TTS_LIMIT = 64 * 1024 * 1024;
    const MINIMAX_SAMPLE_RATE = 32000;

    class MiniMaxProbeError extends Error {}

    class MiniMaxSseParser {
      constructor(onData) {
        this.onData = onData;
        this.line = '';
        this.data = [];
        this.cr = false;
      }
      push(text) {
        for (const ch of text) {
          if (this.cr) {
            this.cr = false;
            if (ch === '\n') continue;
          }
          if (ch === '\r' || ch === '\n') {
            this.consumeLine();
            this.cr = ch === '\r';
          } else {
            this.line += ch;
          }
        }
      }
      consumeLine() {
        const line = this.line;
        this.line = '';
        if (line === '') {
          this.dispatch();
          return;
        }
        if (line.startsWith(':')) return;
        const split = line.indexOf(':');
        const field = split < 0 ? line : line.slice(0, split);
        let value = split < 0 ? '' : line.slice(split + 1);
        if (value.startsWith(' ')) value = value.slice(1);
        if (field === 'data') this.data.push(value);
      }
      dispatch() {
        if (this.data.length) {
          const data = this.data.join('\n');
          this.data = [];
          this.onData(data);
        }
      }
      end() {
        if (this.line) this.consumeLine();
        this.dispatch();
      }
    }

    class MiniMaxPcmDecoder {
      constructor() {
        this.pendingByte = null;
      }
      decode(bytes) {
        let data = bytes;
        if (this.pendingByte !== null) {
          data = new Uint8Array(bytes.length + 1);
          data[0] = this.pendingByte;
          data.set(bytes, 1);
        }
        this.pendingByte = data.length % 2 ? data[data.length - 1] : null;
        const samples = new Float32Array(Math.floor(data.length / 2));
        const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
        for (let i = 0; i < samples.length; i++) {
          samples[i] = view.getInt16(i * 2, true) / 32768;
        }
        return samples;
      }
    }

    function mmHexBytes(hex) {
      if (typeof hex !== 'string' || hex.length % 2 || !/^[0-9a-f]*$/i.test(hex)) {
        throw new MiniMaxProbeError('非法音频 hex 数据');
      }
      if (hex.length / 2 > MINIMAX_TTS_LIMIT) {
        throw new MiniMaxProbeError('单包音频超过 64 MiB 限制');
      }
      const bytes = new Uint8Array(hex.length / 2);
      for (let i = 0; i < bytes.length; i++) {
        bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
      }
      return bytes;
    }

    function mmHasPrefix(bytes, chunks) {
      let offset = 0;
      for (const chunk of chunks) {
        for (const value of chunk) {
          if (bytes[offset++] !== value) return false;
        }
      }
      return true;
    }

    let activeMmController = null;
    let activeMmPlayer = null;

    class MiniMaxPcmPlayer {
      constructor(context, onStopCallback) {
        this.context = context;
        this.decoder = new MiniMaxPcmDecoder();
        this.next = 0;
        this.nodes = new Set();
        this.endedInput = false;
        this.closed = false;
        this.onStopCallback = onStopCallback;
      }
      append(bytes, rate, record, elapsed) {
        if (this.closed) return;
        const samples = this.decoder.decode(bytes);
        if (!samples.length) return;
        const buffer = this.context.createBuffer(1, samples.length, rate);
        buffer.copyToChannel(samples, 0);
        const source = this.context.createBufferSource();
        source.buffer = buffer;
        source.connect(this.context.destination);
        const when = Math.max(this.context.currentTime + 0.035, this.next);
        if (record && record.firstPlaybackScheduledMs === null && elapsed) {
          record.firstPlaybackScheduledMs = elapsed();
        }
        source.onended = () => {
          this.nodes.delete(source);
          source.disconnect();
          this.maybeClose();
        };
        this.nodes.add(source);
        source.start(when);
        this.next = when + buffer.duration;
      }
      finish() {
        this.endedInput = true;
        this.maybeClose();
      }
      maybeClose() {
        if (this.endedInput && !this.nodes.size) this.stop();
      }
      stop() {
        if (this.closed) return;
        this.closed = true;
        this.nodes.forEach((source) => {
          source.onended = null;
          try {
            source.stop();
            source.disconnect();
          } catch (_) {}
        });
        this.nodes.clear();
        this.context.close().catch(() => {});
        if (activeMmPlayer === this) activeMmPlayer = null;
        if (this.onStopCallback) this.onStopCallback();
      }
    }

    function isMiniMaxSpeaking() {
      return Boolean(activeMmController || (activeMmPlayer && !activeMmPlayer.closed));
    }

    function stopActiveMiniMaxTts() {
      if (activeMmController) {
        try { activeMmController.abort(); } catch (_) {}
        activeMmController = null;
      }
      if (activeMmPlayer) {
        activeMmPlayer.stop();
        activeMmPlayer = null;
      }
    }

    async function measureMiniMaxTts(config, hooks = {}) {
      const t0 = performance.now();
      const elapsed = () => Math.round((performance.now() - t0) * 10) / 10;
      const result = {
        startedAt: new Date().toISOString(),
        state: 'running',
        error: null,
        request: {
          endpoint: MINIMAX_TTS_ENDPOINT,
          stream: true,
          sampleRate: config.sampleRate || 32000,
          format: 'pcm',
          channels: 1
        },
        textChars: Array.from(config.text).length,
        headersMs: null,
        firstAudioMs: null,
        lastAudioMs: null,
        finishMs: null,
        bodyEndMs: null,
        firstPlaybackScheduledMs: null,
        audioBytes: 0,
        audioChunks: 0,
        ignoredAggregateBytes: 0,
        httpStatus: null,
        transport: null,
        reads: [],
        events: [],
        warnings: [],
        rawChunks: []
      };
      const notify = () => { if (hooks.onChange) hooks.onChange(result); };
      const chunks = result.rawChunks;
      let reader, readIndex = 0, arrival = 0, wireBytes = 0;

      function accept(packet) {
        if (!packet || typeof packet !== 'object') throw new MiniMaxProbeError('响应不是有效对象');
        const code = packet.base_resp?.status_code;
        if (code !== undefined && Number(code) !== 0) {
          throw new MiniMaxProbeError(`MiniMax 业务错误 ${Number(code)}（${packet.base_resp?.status_msg || '1004 通常为鉴权失败'}）`);
        }
        const data = packet.data;
        if (!data) return;
        const status = data.status == null ? null : Number(data.status);
        const raw = data.audio ? mmHexBytes(data.audio) : new Uint8Array(0);
        let audio = raw, ignored = 0;
        if (status === 2 && result.audioBytes && raw.length >= result.audioBytes && mmHasPrefix(raw, chunks)) {
          ignored = result.audioBytes;
          audio = raw.slice(ignored);
          result.ignoredAggregateBytes += ignored;
        }
        if (result.audioBytes + audio.length > MINIMAX_TTS_LIMIT) {
          throw new MiniMaxProbeError('音频累计超过 64 MiB 限制');
        }
        if (audio.length) {
          if (result.firstAudioMs === null) result.firstAudioMs = arrival;
          result.lastAudioMs = arrival;
          result.audioBytes += audio.length;
          result.audioChunks++;
          chunks.push(audio);
          if (hooks.onAudio) hooks.onAudio(audio, result, elapsed);
        }
        result.events.push({ atMs: arrival, readIndex, status, audioBytes: audio.length, ignoredBytes: ignored });
        if (status === 2 && result.finishMs === null) result.finishMs = arrival;
        notify();
      }

      try {
        const body = {text: config.text};
        if (config.lang === 'en-US') body.language = 'en';
        const response = await fetch(MINIMAX_TTS_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'same-origin',
          cache: 'no-store',
          referrerPolicy: 'no-referrer',
          redirect: 'error',
          body: JSON.stringify(body),
          signal: config.signal
        });
        result.headersMs = elapsed();
        result.httpStatus = response.status;
        if (!response.ok) {
          await response.body?.cancel();
          throw new MiniMaxProbeError(`HTTP ${response.status}，语音服务暂时不可用。`);
        }
        if (!response.body) throw new MiniMaxProbeError('浏览器没有提供可读响应流');
        result.transport = (response.headers.get('content-type') || '').includes('text/event-stream') ? 'sse' : 'json';
        notify();

        const decoder = new TextDecoder();
        const parser = new MiniMaxSseParser((data) => {
          if (data.trim() === '[DONE]' || !data.trim()) return;
          let packet;
          try { packet = JSON.parse(data); } catch (_) { throw new MiniMaxProbeError('SSE 中的 JSON 无法解析'); }
          accept(packet);
        });
        let json = '';
        reader = response.body.getReader();
        while (true) {
          if (config.signal?.aborted) throw new MiniMaxProbeError('请求已取消');
          const { value, done } = await reader.read();
          if (config.signal?.aborted) throw new MiniMaxProbeError('请求已取消');
          if (done) break;
          if (!value.length) continue;
          arrival = elapsed();
          readIndex++;
          wireBytes += value.length;
          result.reads.push({ atMs: arrival, bytes: value.length, index: readIndex });
          const text = decoder.decode(value, { stream: true });
          if (result.transport === 'sse') parser.push(text);
          else json += text;
          notify();
        }
        result.bodyEndMs = elapsed();
        if (result.transport === 'sse') {
          parser.push(decoder.decode());
          parser.end();
        } else {
          json += decoder.decode();
          arrival = elapsed();
          let parsed;
          try { parsed = JSON.parse(json); } catch (_) { throw new MiniMaxProbeError('响应不是有效 JSON / SSE'); }
          if (Array.isArray(parsed)) parsed.forEach(accept);
          else accept(parsed);
        }
        if (result.finishMs === null) throw new MiniMaxProbeError('未收到合成结束标记 status=2');
        if (!result.audioBytes) throw new MiniMaxProbeError('合成结束但没有有效音频');
        result.state = 'completed';
      } catch (error) {
        result.state = config.signal?.aborted ? 'cancelled' : 'error';
        result.error = config.signal?.aborted
          ? '已停止语音请求'
          : (error instanceof MiniMaxProbeError ? error.message : '语音服务暂时不可用，请稍后重试');
        if (reader) {
          try { await reader.cancel(); } catch (_) {}
        }
      } finally {
        if (reader) reader.releaseLock();
        result.requestEndMs = elapsed();
        notify();
      }
      return result;
    }

    function fallbackNativeSpeak(cleanText, lang = 'zh-CN') {
      try {
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const utter = new SpeechSynthesisUtterance(cleanText);
          utter.lang = lang;
          utter.rate = lang === 'en-US' ? 0.88 : 0.95;
          utter.pitch = lang === 'en-US' ? 1.06 : 1;
          if (lang === 'en-US') {
            const voices = window.speechSynthesis.getVoices();
            const enVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Samantha') || v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('US'))) || voices.find(v => v.lang.startsWith('en'));
            if (enVoice) utter.voice = enVoice;
          } else {
            const voices = window.speechSynthesis.getVoices?.() || [];
            const chinese = voices.filter(v => /^zh[-_](CN|Hans)/i.test(v.lang) || /普通话|Mandarin/i.test(v.name));
            const teacher = chinese.find(v => /Ting[- ]?ting|Xiao[xX]iao|Xiao[yY]i|Xiao[xX]uan|Xiao[zZ]hen|婷婷|晓晓|晓伊|晓萱|晓甄/i.test(v.name)) || chinese[0];
            if (teacher) utter.voice = teacher;
          }
          window.speechSynthesis.speak(utter);
        }
      } catch (e) {}
    }

    async function speakViaMiniMaxOrFallback(rawText, lang = 'zh-CN', onTelemetry = null) {
      if (!isEnabled() && !onTelemetry) return;
      const clean = String(rawText || '')
        .replace(/[□❓]/g, lang === 'en-US' ? 'blank' : '几')
        .replace(/÷/g, lang === 'en-US' ? ' divided by ' : '除以')
        .replace(/×/g, lang === 'en-US' ? ' times ' : '乘')
        .replace(/(\d+)\s*[-−]\s*(\d+)/g, lang === 'en-US' ? '$1 minus $2' : '$1减$2')
        .replace(/\+/g, lang === 'en-US' ? ' plus ' : '加')
        .replace(/=/g, lang === 'en-US' ? ' equals ' : '等于')
        .replace(/[🌟🎯🧮🌸🧠📜🔍🎵🦊🎋📖✍️🐸🦁🍎💬❓👕🔊🎬✨🧭🍊🔥🏆👑🌱]/g, '')
        .trim();
      if (!clean) return;

      // Cancel any ongoing native or MiniMax speech
      try { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); } catch (_) {}
      stopActiveMiniMaxTts();

      const controller = new AbortController();
      activeMmController = controller;

      let player = null;
      try {
        const AudioContextType = window.AudioContext || window.webkitAudioContext;
        player = new MiniMaxPcmPlayer(new AudioContextType());
        activeMmPlayer = player;
        await player.context.resume();
      } catch (_) {
        if (player) player.stop();
        player = null;
        if (activeMmController === controller) activeMmController = null;
        fallbackNativeSpeak(clean, lang);
        return;
      }
      if (controller.signal.aborted) {
        player?.stop();
        return;
      }

      const result = await measureMiniMaxTts(
        {
          sampleRate: MINIMAX_SAMPLE_RATE,
          text: clean,
          lang,
          signal: controller.signal
        },
        {
          onChange: (r) => {
            if (onTelemetry) onTelemetry(r);
          },
          onAudio: (bytes, r, elapsed) => {
            if (player) {
              try {
                player.append(bytes, MINIMAX_SAMPLE_RATE, r, elapsed);
              } catch (_) {
                player.stop();
              }
            }
          }
        }
      );

      if (activeMmController === controller) {
        activeMmController = null;
      }

      if (result.state === 'completed') {
        if (player) player.finish();
      } else {
        if (player) player.stop();
        if (result.state === 'error' && !onTelemetry) {
          // Graceful fallback to browser speech if MiniMax fails during normal quiz reading
          fallbackNativeSpeak(clean, lang);
        }
      }
      return result;
    }


    return {
      speak: speakViaMiniMaxOrFallback,
      stop() {
        stopActiveMiniMaxTts();
        try {window.speechSynthesis?.cancel();} catch (_) {}
      },
      isSpeaking: isMiniMaxSpeaking,
      measure: measureMiniMaxTts,
      nativeSpeak: fallbackNativeSpeak
    };
  }
  window.PandaSpeech = {create};
})();
