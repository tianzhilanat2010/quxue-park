// 会动的科普小实验室引擎（12 个定制实时交互 Canvas 动画）

window.EncyclopediaLabs = (() => {
  let rafId = null;

  function stop() {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  function makeCanvas(host) {
    host.innerHTML = '';
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    host.appendChild(canvas);
    return { canvas, ctx: canvas.getContext('2d') };
  }

  function start(labType, host, controlsHost) {
    stop();
    controlsHost.innerHTML = '';
    const { canvas, ctx } = makeCanvas(host);
    const W = canvas.width, H = canvas.height;
    let t = 0;

    // 1. 地球剥洋葱分层实验
    if (labType === 'earth-layers') {
      const layers = [
        { name: '地壳', depth: '0～35 km', temp: '约 20℃～400℃', r: 170, color: '#2b8a57', desc: '高山、海洋与家园都在这层薄外壳上' },
        { name: '地幔', depth: '35～2900 km', temp: '约 1000℃～3700℃', r: 138, color: '#d9480f', desc: '炙热黏稠的岩石缓慢对流，推动板块漂移' },
        { name: '液态外核', depth: '2900～5150 km', temp: '约 4000℃～5000℃', r: 86, color: '#f59f00', desc: '液态铁镍像巨型发电机，制造地球磁场' },
        { name: '固态内核', depth: '5150～6371 km', temp: '约 5500℃+', r: 44, color: '#fff3bf', desc: '比太阳表面还烫的实心金属核心！' }
      ];
      let activeIdx = 0;
      let peel = 1; // 0=完整地球, 1=切开90度
      const btns = layers.map((l, idx) => {
        const b = document.createElement('button');
        b.className = 'lab-btn' + (idx === 0 ? ' active' : '');
        b.textContent = l.name;
        b.onclick = () => {
          activeIdx = idx;
          btns.forEach((x, i) => x.classList.toggle('active', i === idx));
        };
        controlsHost.appendChild(b);
        return b;
      });
      const toggle = document.createElement('button');
      toggle.className = 'lab-btn';
      toggle.textContent = '🍉 切开 / 合上地球';
      toggle.onclick = () => { peel = peel ? 0 : 1; };
      controlsHost.appendChild(toggle);

      const loop = () => {
        t += 0.025;
        ctx.fillStyle = '#071b16';
        ctx.fillRect(0, 0, W, H);
        // 星空
        for (let i = 0; i < 32; i++) {
          const sx = (i * 89 + 20) % W, sy = (i * 53 + 17) % H;
          ctx.fillStyle = `rgba(246,223,158,${0.3 + 0.6 * Math.abs(Math.sin(t + i))})`;
          ctx.beginPath(); ctx.arc(sx, sy, i % 4 === 0 ? 2.2 : 1.2, 0, Math.PI * 2); ctx.fill();
        }
        const cx = 235, cy = 240;
        // 大气光晕
        const glow = ctx.createRadialGradient(cx, cy, 150, cx, cy, 200);
        glow.addColorStop(0, 'rgba(72,202,228,0.45)');
        glow.addColorStop(1, 'rgba(72,202,228,0)');
        ctx.fillStyle = glow;
        ctx.beginPath(); ctx.arc(cx, cy, 200, 0, Math.PI * 2); ctx.fill();

        // 完整海洋地球底
        ctx.fillStyle = '#1971c2';
        ctx.beginPath(); ctx.arc(cx, cy, 170, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#2f9e44';
        ctx.beginPath(); ctx.ellipse(cx - 65, cy - 30, 56, 42, 0.3, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(cx - 25, cy + 70, 48, 36, -0.2, 0, Math.PI * 2); ctx.fill();

        if (peel) {
          // 右上90度剖面分层
          layers.forEach((l, i) => {
            const isSel = i === activeIdx;
            const pulse = isSel ? Math.sin(t * 5) * 4 : 0;
            ctx.fillStyle = l.color;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.arc(cx, cy, l.r + pulse, -Math.PI / 2, 0);
            ctx.closePath();
            ctx.fill();
            if (isSel) {
              ctx.strokeStyle = '#ffffff';
              ctx.lineWidth = 3;
              ctx.stroke();
            }
          });
          // 地幔流动小火点
          for (let k = 0; k < 6; k++) {
            const ang = -Math.PI / 2 + ((t * 0.4 + k * 0.25) % 1) * (Math.PI / 2);
            const rr = 112 + Math.sin(t * 3 + k) * 8;
            ctx.fillStyle = 'rgba(255,224,102,0.85)';
            ctx.beginPath(); ctx.arc(cx + Math.cos(ang) * rr, cy + Math.sin(ang) * rr, 4, 0, Math.PI * 2); ctx.fill();
          }
        }
        // 右侧数据仪表盘
        const cur = layers[activeIdx];
        ctx.fillStyle = 'rgba(12, 38, 31, 0.9)';
        ctx.strokeStyle = '#e7c574';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.roundRect(425, 115, 195, 240, 16); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#f6df9e';
        ctx.font = 'bold 22px sans-serif';
        ctx.fillText(cur.name, 444, 155);
        ctx.fillStyle = '#fff';
        ctx.font = '14px sans-serif';
        ctx.fillText('深度：' + cur.depth, 444, 192);
        ctx.fillStyle = '#ffa94d';
        ctx.fillText('温度：' + cur.temp, 444, 222);
        ctx.fillStyle = '#d8f5a2';
        wrapText(ctx, cur.desc, 444, 260, 162, 22);

        rafId = requestAnimationFrame(loop);
      };
      loop();
      return;
    }

    // 2. 火山压力喷发模拟器
    if (labType === 'volcano') {
      let pressure = 45;
      let erupting = 0;
      const particles = [];
      controlsHost.innerHTML = `<label style="display:flex;align-items:center;gap:8px;font-weight:700;">岩浆压力：<input id="vPress" type="range" min="15" max="100" value="45" /></label>`;
      const btn = document.createElement('button');
      btn.className = 'lab-btn active';
      btn.textContent = '🔥 触发大喷发！';
      btn.onclick = () => { erupting = 120; pressure = 100; document.getElementById('vPress').value = 100; };
      controlsHost.appendChild(btn);
      document.getElementById('vPress').oninput = (e) => { pressure = +e.target.value; };

      const loop = () => {
        t += 0.04;
        if (erupting > 0) erupting--;
        const intensity = erupting > 0 ? 1 : pressure / 100;
        const shake = intensity > 0.7 ? Math.sin(t * 40) * 3 * intensity : 0;

        const g = ctx.createLinearGradient(0, 0, 0, H);
        g.addColorStop(0, '#4dabf7'); g.addColorStop(1, '#d0ebff');
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

        ctx.save(); ctx.translate(shake, 0);
        // 喷发颗粒
        if (intensity > 0.45 && Math.random() < intensity * 0.85) {
          particles.push({
            x: 320 + (Math.random() - 0.5) * 28,
            y: 162,
            vx: (Math.random() - 0.5) * (4 + intensity * 5),
            vy: -(4 + Math.random() * 6 * intensity),
            life: 1,
            smoke: Math.random() < 0.35
          });
        }
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.vx; p.y += p.vy;
          p.vy += p.smoke ? -0.04 : 0.22;
          p.life -= 0.016;
          if (p.life <= 0) { particles.splice(i, 1); continue; }
          ctx.fillStyle = p.smoke
            ? `rgba(210,210,215,${p.life * 0.7})`
            : `rgba(255,${Math.floor(180 * p.life)},20,${p.life})`;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.smoke ? 24 * (1.2 - p.life) : 7 * p.life + 2, 0, Math.PI * 2); ctx.fill();
        }
        // 地下与山体剖面
        ctx.fillStyle = '#795548'; ctx.fillRect(60, 345, 520, 105);
        ctx.fillStyle = '#4e342e'; ctx.fillRect(60, 395, 520, 55);
        ctx.fillStyle = '#40916c';
        ctx.beginPath(); ctx.moveTo(60, 345); ctx.lineTo(285, 165); ctx.lineTo(355, 165); ctx.lineTo(580, 345); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#6d5d53';
        ctx.beginPath(); ctx.moveTo(210, 345); ctx.lineTo(300, 165); ctx.lineTo(340, 165); ctx.lineTo(430, 345); ctx.closePath(); ctx.fill();

        // 岩浆房与上升通道
        const mg = ctx.createRadialGradient(320, 395, 10, 320, 395, 76);
        mg.addColorStop(0, '#fff3bf'); mg.addColorStop(0.5, '#fd7e14'); mg.addColorStop(1, '#c92a2a');
        ctx.fillStyle = mg;
        ctx.beginPath(); ctx.ellipse(320, 398, 78 + Math.sin(t * 4) * 4, 46, 0, 0, Math.PI * 2); ctx.fill();

        const rise = 60 + intensity * 172;
        ctx.fillStyle = '#ff6b00';
        ctx.fillRect(306, 395 - rise, 28, rise);
        ctx.fillStyle = '#ffd43b';
        ctx.fillRect(313, 395 - rise, 14, rise);
        ctx.restore();

        ctx.fillStyle = '#0c261f'; ctx.font = 'bold 16px sans-serif';
        ctx.fillText(`当前压力：${pressure}%  ${intensity > 0.75 ? '🌋 正在猛烈喷发！' : '⏳ 岩浆正在蓄力上升'}`, 18, 32);
        rafId = requestAnimationFrame(loop);
      };
      loop();
      return;
    }

    // 3. 树叶光合作用小工厂
    if (labType === 'leaf') {
      let hasSun = true, hasWater = true;
      const bSun = document.createElement('button');
      bSun.className = 'lab-btn active'; bSun.textContent = '☀️ 阳光：开启';
      bSun.onclick = () => { hasSun = !hasSun; bSun.classList.toggle('active', hasSun); bSun.textContent = hasSun ? '☀️ 阳光：开启' : '☁️ 阳光：关闭'; };
      const bWat = document.createElement('button');
      bWat.className = 'lab-btn active'; bWat.textContent = '💧 浇水：充足';
      bWat.onclick = () => { hasWater = !hasWater; bWat.classList.toggle('active', hasWater); bWat.textContent = hasWater ? '💧 浇水：充足' : '🏜️ 浇水：缺水'; };
      controlsHost.append(bSun, bWat);

      const loop = () => {
        t += 0.03;
        const active = hasSun && hasWater;
        ctx.fillStyle = hasSun ? '#e7f5ff' : '#343a40';
        ctx.fillRect(0, 0, W, H);
        // 太阳
        if (hasSun) {
          ctx.fillStyle = '#ffd43b';
          ctx.beginPath(); ctx.arc(95, 72, 38 + Math.sin(t * 3) * 3, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = 'rgba(255,212,59,0.55)'; ctx.lineWidth = 4;
          for (let i = 0; i < 4; i++) {
            ctx.beginPath(); ctx.moveTo(125 + i * 18, 105); ctx.lineTo(220 + i * 65, 225); ctx.stroke();
          }
        }
        // 叶片剖面大块
        ctx.fillStyle = '#2b8a3e';
        ctx.beginPath(); ctx.roundRect(120, 210, 400, 175, 24); ctx.fill();
        // 栅栏细胞 + 叶绿体
        for (let i = 0; i < 9; i++) {
          ctx.fillStyle = active ? '#69db7c' : '#5c940d';
          ctx.beginPath(); ctx.roundRect(142 + i * 40, 232, 32, 68, 8); ctx.fill();
          ctx.fillStyle = active ? '#fff3bf' : '#2b8a3e';
          for (let c = 0; c < 3; c++) {
            ctx.beginPath(); ctx.arc(158 + i * 40, 248 + c * 18 + Math.sin(t * 4 + i + c) * 2, 4.5, 0, Math.PI * 2); ctx.fill();
          }
        }
        // 叶脉输水管
        ctx.fillStyle = '#1864ab';
        ctx.beginPath(); ctx.arc(320, 336, 30, 0, Math.PI * 2); ctx.fill();
        if (hasWater) {
          for (let w = 0; w < 5; w++) {
            const wy = 450 - ((t * 55 + w * 28) % 120);
            ctx.fillStyle = '#339af0';
            ctx.beginPath(); ctx.arc(320 + Math.sin(w) * 10, wy, 6, 0, Math.PI * 2); ctx.fill();
          }
        }
        // 释放氧气泡泡
        if (active) {
          for (let o = 0; o < 8; o++) {
            const oy = 210 - ((t * 42 + o * 26) % 165);
            const ox = 170 + o * 44 + Math.sin(t * 2 + o) * 10;
            ctx.fillStyle = 'rgba(56, 217, 169, 0.85)';
            ctx.beginPath(); ctx.arc(ox, oy, 13, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#fff'; ctx.font = 'bold 11px sans-serif'; ctx.fillText('O₂', ox - 8, oy + 4);
          }
        }
        ctx.fillStyle = hasSun ? '#0c261f' : '#f8f9fa';
        ctx.font = 'bold 17px sans-serif';
        ctx.fillText(active ? '✅ 光合工厂全速运转：正在源源不断制造氧气 O₂ 和养分！' : '⏸️ 缺少阳光或水分，树叶小工厂暂时休息啦', 24, 445);
        rafId = requestAnimationFrame(loop);
      };
      loop();
      return;
    }

    // 4. 恐龙身长对比与漫步
    if (labType === 'dino') {
      const dinos = [
        { name: '霸王龙', len: 12, color: '#37b24d', desc: '身长约 12 米，相当于 9 个二年级小朋友头尾相连！' },
        { name: '三角龙', len: 9, color: '#e8590c', desc: '身长约 9 米，头上三只巨角是抵御霸王龙的盾牌！' },
        { name: '腕龙', len: 22, color: '#1c7ed6', desc: '身长约 22 米，脖子一伸能轻松吃到 4 层楼高的树叶！' }
      ];
      let sel = 0;
      const btns = dinos.map((d, i) => {
        const b = document.createElement('button');
        b.className = 'lab-btn' + (i === 0 ? ' active' : '');
        b.textContent = d.name;
        b.onclick = () => { sel = i; btns.forEach((x, idx) => x.classList.toggle('active', idx === i)); };
        controlsHost.appendChild(b);
        return b;
      });
      const loop = () => {
        t += 0.06;
        const d = dinos[sel];
        ctx.fillStyle = '#fff9db'; ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = '#b2f2bb'; ctx.fillRect(0, 340, W, 140);
        // 尺子刻度
        ctx.strokeStyle = '#adb5bd'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(40, 355); ctx.lineTo(600, 355); ctx.stroke();
        // 小朋友剪影（1.3米参考）
        ctx.fillStyle = '#f03e3e';
        ctx.beginPath(); ctx.arc(85, 300, 10, 0, Math.PI * 2); ctx.fill();
        ctx.fillRect(79, 311, 12, 29);
        ctx.fillStyle = '#212529'; ctx.font = 'bold 13px sans-serif'; ctx.fillText('小朋友 1.3m', 50, 380);
        // 动态恐龙轮廓按比例绘制
        const scale = (d.len / 22) * 390 + 80;
        const bob = Math.abs(Math.sin(t)) * 8;
        ctx.fillStyle = d.color;
        // 身体+尾巴+长颈/大头
        ctx.beginPath(); ctx.ellipse(220 + scale * 0.45, 255 - bob, scale * 0.25, 48, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.moveTo(220 + scale * 0.25, 245 - bob); ctx.lineTo(150, 255 - Math.sin(t) * 14); ctx.lineTo(220 + scale * 0.25, 285 - bob); ctx.fill();
        const headY = sel === 2 ? 120 - bob : 190 - bob;
        ctx.lineWidth = sel === 2 ? 24 : 30; ctx.strokeStyle = d.color; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(220 + scale * 0.62, 245 - bob); ctx.lineTo(220 + scale * 0.78, headY); ctx.stroke();
        ctx.beginPath(); ctx.ellipse(220 + scale * 0.84, headY, 34, 22, 0, 0, Math.PI * 2); ctx.fill();
        // 迈步双腿
        ctx.fillRect(220 + scale * 0.36 + Math.sin(t) * 14, 285, 20, 56);
        ctx.fillRect(220 + scale * 0.48 - Math.sin(t) * 14, 285, 20, 56);
        // 信息标语
        ctx.fillStyle = '#0c261f'; ctx.font = 'bold 20px sans-serif';
        ctx.fillText(`${d.name} · 身长约 ${d.len} 米`, 28, 46);
        ctx.font = '15px sans-serif'; ctx.fillStyle = '#495057';
        ctx.fillText(d.desc, 28, 76);
        rafId = requestAnimationFrame(loop);
      };
      loop();
      return;
    }

    // 5. 蝴蝶破茧四阶段变身
    if (labType === 'butterfly') {
      const stages = ['1. 树叶上的卵', '2. 贪吃毛毛虫', '3. 神奇变身蛹', '4. 破茧成凤蝶'];
      let st = 3;
      const btns = stages.map((s, i) => {
        const b = document.createElement('button');
        b.className = 'lab-btn' + (i === st ? ' active' : '');
        b.textContent = s;
        b.onclick = () => { st = i; btns.forEach((x, idx) => x.classList.toggle('active', idx === i)); };
        controlsHost.appendChild(b);
        return b;
      });
      const loop = () => {
        t += 0.08;
        ctx.fillStyle = '#f4fce3'; ctx.fillRect(0, 0, W, H);
        // 树枝与绿叶
        ctx.strokeStyle = '#795548'; ctx.lineWidth = 10; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(80, 350); ctx.quadraticCurveTo(320, 290, 560, 340); ctx.stroke();
        ctx.fillStyle = '#51cf66';
        ctx.beginPath(); ctx.ellipse(320, 312, 110, 42, -0.1, 0, Math.PI * 2); ctx.fill();

        if (st === 0) {
          for (let i = 0; i < 5; i++) {
            ctx.fillStyle = '#ffe066';
            ctx.beginPath(); ctx.arc(285 + i * 18, 305 + Math.sin(t + i) * 1.5, 8, 0, Math.PI * 2); ctx.fill();
          }
        } else if (st === 1) {
          for (let i = 0; i < 7; i++) {
            const cx = 240 + i * 24;
            const cy = 285 - Math.sin(t * 1.5 + i * 0.7) * 10;
            ctx.fillStyle = i % 2 === 0 ? '#82c91e' : '#a9e34b';
            ctx.beginPath(); ctx.arc(cx, cy, 17, 0, Math.PI * 2); ctx.fill();
          }
          ctx.fillStyle = '#212529'; ctx.beginPath(); ctx.arc(392, 278, 4, 0, Math.PI * 2); ctx.fill();
        } else if (st === 2) {
          ctx.save(); ctx.translate(320, 315); ctx.rotate(Math.sin(t * 0.6) * 0.08);
          ctx.fillStyle = '#94d82d';
          ctx.beginPath(); ctx.ellipse(0, 45, 24, 48, 0, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = '#f59f00'; ctx.lineWidth = 3; ctx.stroke();
          ctx.restore();
        } else {
          const flap = 0.25 + 0.75 * Math.abs(Math.cos(t));
          const bx = 320 + Math.sin(t * 0.4) * 50, by = 185 + Math.cos(t * 0.8) * 24;
          [-1, 1].forEach(side => {
            ctx.save(); ctx.translate(bx, by); ctx.scale(side * flap, 1);
            ctx.fillStyle = '#1c7ed6'; ctx.beginPath(); ctx.ellipse(54, -16, 60, 38, -0.2, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#fcc419'; ctx.beginPath(); ctx.ellipse(50, -16, 32, 20, -0.2, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#1971c2'; ctx.beginPath(); ctx.ellipse(42, 28, 42, 30, 0.2, 0, Math.PI * 2); ctx.fill();
            ctx.restore();
          });
          ctx.fillStyle = '#212529'; ctx.beginPath(); ctx.ellipse(bx, by + 4, 7, 36, 0, 0, Math.PI * 2); ctx.fill();
        }
        ctx.fillStyle = '#2b8a3e'; ctx.font = 'bold 20px sans-serif';
        ctx.fillText('当前阶段：' + stages[st], 28, 44);
        rafId = requestAnimationFrame(loop);
      };
      loop();
      return;
    }

    // 6. 水循环与六角魔法雪花
    if (labType === 'water-cycle') {
      let seed = 1;
      const btn = document.createElement('button');
      btn.className = 'lab-btn active';
      btn.textContent = '❄️ 生成一片新六角雪花';
      btn.onclick = () => { seed++; };
      controlsHost.appendChild(btn);

      const loop = () => {
        t += 0.03;
        const g = ctx.createLinearGradient(0, 0, 0, H);
        g.addColorStop(0, '#0b2545'); g.addColorStop(1, '#1e6091');
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
        // 旋转放大六角雪花
        ctx.save();
        ctx.translate(320, 230);
        ctx.rotate(t * 0.25);
        ctx.strokeStyle = '#e7f5ff';
        ctx.lineCap = 'round';
        const branches = 6;
        for (let b = 0; b < branches; b++) {
          ctx.save();
          ctx.rotate((b * Math.PI * 2) / branches);
          ctx.lineWidth = 5;
          ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -145); ctx.stroke();
          for (let k = 1; k <= 4; k++) {
            const y = -k * 30;
            const len = 18 + ((seed * 17 + k * 23) % 32);
            ctx.lineWidth = 3;
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(-len, y - len * 0.65); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(len, y - len * 0.65); ctx.stroke();
          }
          ctx.restore();
        }
        ctx.restore();
        ctx.fillStyle = '#fff'; ctx.font = 'bold 18px sans-serif';
        ctx.fillText(`❄️ 第 #${seed} 号六角冰晶雪花（6 瓣完美对称）`, 24, 38);
        ctx.font = '14px sans-serif'; ctx.fillStyle = '#a5d8ff';
        ctx.fillText('水蒸气在 0℃ 以下高空围绕微尘结晶，长出独一无二的六角花纹', 24, 448);
        rafId = requestAnimationFrame(loop);
      };
      loop();
      return;
    }

    // 7. 太阳系八大行星实时公转仪
    if (labType === 'solar-system') {
      let speed = 1;
      [1, 4, 12].forEach(sp => {
        const b = document.createElement('button');
        b.className = 'lab-btn' + (sp === 1 ? ' active' : '');
        b.textContent = sp + '× 公转速度';
        b.onclick = () => {
          speed = sp;
          controlsHost.querySelectorAll('.lab-btn').forEach(x => x.classList.remove('active'));
          b.classList.add('active');
        };
        controlsHost.appendChild(b);
      });
      const planets = [
        { name: '水', r: 42, sz: 5, sp: 2.8, c: '#adb5bd' },
        { name: '金', r: 62, sz: 7, sp: 2.1, c: '#f59f00' },
        { name: '地', r: 86, sz: 8, sp: 1.5, c: '#339af0' },
        { name: '火', r: 108, sz: 6, sp: 1.15, c: '#fa5252' },
        { name: '木', r: 142, sz: 15, sp: 0.65, c: '#e8a87c' },
        { name: '土', r: 176, sz: 12, sp: 0.45, c: '#f6d55c', ring: true },
        { name: '天', r: 204, sz: 9, sp: 0.3, c: '#66d9e8' },
        { name: '海', r: 226, sz: 9, sp: 0.22, c: '#3b5bdb' }
      ];
      const loop = () => {
        t += 0.012 * speed;
        ctx.fillStyle = '#070b1e'; ctx.fillRect(0, 0, W, H);
        const cx = W / 2, cy = H / 2;
        // 太阳
        const sg = ctx.createRadialGradient(cx, cy, 4, cx, cy, 34);
        sg.addColorStop(0, '#fff9db'); sg.addColorStop(0.5, '#fcc419'); sg.addColorStop(1, 'rgba(253,126,20,0)');
        ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(cx, cy, 34, 0, Math.PI * 2); ctx.fill();

        planets.forEach((p, idx) => {
          ctx.strokeStyle = 'rgba(255,255,255,0.14)'; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.arc(cx, cy, p.r, 0, Math.PI * 2); ctx.stroke();
          const ang = t * p.sp + idx * 1.1;
          const px = cx + Math.cos(ang) * p.r, py = cy + Math.sin(ang) * p.r;
          if (p.ring) {
            ctx.strokeStyle = 'rgba(246,213,92,0.75)'; ctx.lineWidth = 3;
            ctx.beginPath(); ctx.ellipse(px, py, 22, 8, 0.35, 0, Math.PI * 2); ctx.stroke();
          }
          ctx.fillStyle = p.c; ctx.beginPath(); ctx.arc(px, py, p.sz, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#fff'; ctx.font = '11px sans-serif'; ctx.fillText(p.name, px + p.sz + 3, py + 4);
        });
        rafId = requestAnimationFrame(loop);
      };
      loop();
      return;
    }

    // 8. 火箭倒计时发射模拟器
    if (labType === 'rocket') {
      let launched = false, alt = 0;
      const btn = document.createElement('button');
      btn.className = 'lab-btn active';
      btn.textContent = '🚀 点火发射！';
      btn.onclick = () => { launched = true; alt = 0; };
      const reset = document.createElement('button');
      reset.className = 'lab-btn';
      reset.textContent = '🔄 回到发射台';
      reset.onclick = () => { launched = false; alt = 0; };
      controlsHost.append(btn, reset);

      const loop = () => {
        t += 0.05;
        if (launched && alt < 360) alt += 2.6 + alt * 0.02;
        const skyProgress = Math.min(1, alt / 260);
        const r = Math.floor(40 * (1 - skyProgress) + 6 * skyProgress);
        const g = Math.floor(140 * (1 - skyProgress) + 12 * skyProgress);
        const b = Math.floor(220 * (1 - skyProgress) + 34 * skyProgress);
        ctx.fillStyle = `rgb(${r},${g},${b})`; ctx.fillRect(0, 0, W, H);

        if (skyProgress > 0.3) {
          for (let s = 0; s < 35; s++) {
            ctx.fillStyle = `rgba(255,255,255,${skyProgress * 0.85})`;
            ctx.beginPath(); ctx.arc((s * 71) % W, (s * 43) % H, 1.8, 0, Math.PI * 2); ctx.fill();
          }
        }
        // 地面随高度下移
        const groundY = 400 + alt * 1.4;
        if (groundY < H + 80) {
          ctx.fillStyle = '#51cf66'; ctx.fillRect(0, groundY, W, 120);
          ctx.fillStyle = '#495057'; ctx.fillRect(220, groundY - 10, 200, 16);
        }
        const ry = Math.max(170, 330 - alt * 0.65);
        const shake = launched && alt < 80 ? Math.sin(t * 45) * 3 : 0;
        const rx = 320 + shake;
        if (launched) {
          const fl = 45 + Math.sin(t * 35) * 14;
          ctx.fillStyle = '#ff6b00';
          ctx.beginPath(); ctx.moveTo(rx - 18, ry + 56); ctx.lineTo(rx, ry + 56 + fl); ctx.lineTo(rx + 18, ry + 56); ctx.fill();
          ctx.fillStyle = '#ffd43b';
          ctx.beginPath(); ctx.moveTo(rx - 9, ry + 56); ctx.lineTo(rx, ry + 56 + fl * 0.68); ctx.lineTo(rx + 9, ry + 56); ctx.fill();
        }
        // 箭体
        ctx.fillStyle = '#f8f9fa'; ctx.fillRect(rx - 18, ry - 48, 36, 104);
        ctx.fillStyle = '#e03131';
        ctx.beginPath(); ctx.moveTo(rx - 18, ry - 48); ctx.lineTo(rx, ry - 86); ctx.lineTo(rx + 18, ry - 48); ctx.fill();
        ctx.fillRect(rx - 18, ry - 26, 36, 14);
        // 助推器（高空自动分离！）
        const sep = alt > 140 ? (alt - 140) * 0.8 : 0;
        ctx.fillStyle = '#e03131';
        ctx.fillRect(rx - 32 - sep, ry + 10 + sep * 1.2, 12, 46);
        ctx.fillRect(rx + 20 + sep, ry + 10 + sep * 1.2, 12, 46);

        ctx.fillStyle = '#fff'; ctx.font = 'bold 17px sans-serif';
        const km = Math.floor(alt * 1.1);
        ctx.fillText(launched ? `飞行高度：${km} 千米 ${alt > 140 ? '✨ 助推器已成功分离！' : '🔥 引擎全速推进中'}` : '准备就绪：点击“点火发射”送飞船上太空！', 22, 36);
        rafId = requestAnimationFrame(loop);
      };
      loop();
      return;
    }

    // 9. 心脏跳动与血液循环
    if (labType === 'heart') {
      let bpm = 75;
      const bRest = document.createElement('button');
      bRest.className = 'lab-btn active'; bRest.textContent = '😌 安静休息（75次/分）';
      const bRun = document.createElement('button');
      bRun.className = 'lab-btn'; bRun.textContent = '🏃 快乐跑步（140次/分）';
      bRest.onclick = () => { bpm = 75; bRest.classList.add('active'); bRun.classList.remove('active'); };
      bRun.onclick = () => { bpm = 140; bRun.classList.add('active'); bRest.classList.remove('active'); };
      controlsHost.append(bRest, bRun);

      const loop = () => {
        t += (bpm / 60) * 0.016 * Math.PI * 2;
        const beat = 1 + 0.11 * Math.pow(Math.max(0, Math.sin(t)), 4);
        ctx.fillStyle = '#fff5f5'; ctx.fillRect(0, 0, W, H);
        // 循环血管轨道
        ctx.strokeStyle = '#ff6b6b'; ctx.lineWidth = 14;
        ctx.beginPath(); ctx.ellipse(440, 245, 130, 120, 0, -Math.PI / 2, Math.PI / 2); ctx.stroke();
        ctx.strokeStyle = '#339af0'; ctx.lineWidth = 14;
        ctx.beginPath(); ctx.ellipse(200, 245, 130, 120, 0, Math.PI / 2, Math.PI * 1.5); ctx.stroke();
        // 流动的红/蓝血细胞
        for (let i = 0; i < 8; i++) {
          const ph = ((t * 0.15 + i / 8) % 1);
          const aR = -Math.PI / 2 + ph * Math.PI;
          ctx.fillStyle = '#c92a2a';
          ctx.beginPath(); ctx.arc(440 + Math.cos(aR) * 130, 245 + Math.sin(aR) * 120, 7, 0, Math.PI * 2); ctx.fill();
          const aB = Math.PI / 2 + ph * Math.PI;
          ctx.fillStyle = '#1864ab';
          ctx.beginPath(); ctx.arc(200 + Math.cos(aB) * 130, 245 + Math.sin(aB) * 120, 7, 0, Math.PI * 2); ctx.fill();
        }
        // 跳动的心脏
        ctx.save(); ctx.translate(320, 245); ctx.scale(beat, beat);
        ctx.fillStyle = '#e03131';
        ctx.beginPath();
        ctx.moveTo(0, 68);
        ctx.bezierCurveTo(-90, 10, -85, -75, 0, -28);
        ctx.bezierCurveTo(85, -75, 90, 10, 0, 68);
        ctx.fill();
        ctx.restore();
        ctx.fillStyle = '#c92a2a'; ctx.font = 'bold 18px sans-serif';
        ctx.fillText(`❤️ 当前心率：${bpm} 次/分钟  （红：含氧动脉血 | 蓝：回流静脉血）`, 22, 38);
        rafId = requestAnimationFrame(loop);
      };
      loop();
      return;
    }

    // 10. 万里长城烽火传信
    if (labType === 'great-wall') {
      let lit = [false, false, false, false];
      let relayStep = -1;
      const btn = document.createElement('button');
      btn.className = 'lab-btn active';
      btn.textContent = '🔥 点燃第一座烽火台！';
      btn.onclick = () => { lit = [true, false, false, false]; relayStep = 0; };
      controlsHost.appendChild(btn);

      const towers = [[110, 310], [255, 250], [405, 215], [540, 165]];
      const loop = () => {
        t += 0.05;
        if (relayStep >= 0 && Math.floor(t) % 2 === 0) {
          const next = Math.min(3, Math.floor(relayStep));
          lit[next] = true;
          relayStep += 0.03;
        }
        const g = ctx.createLinearGradient(0, 0, 0, H);
        g.addColorStop(0, '#ffd8a8'); g.addColorStop(1, '#fff4e6');
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
        // 群山与城墙
        ctx.fillStyle = '#2b8a3e';
        ctx.beginPath(); ctx.moveTo(0, 480); ctx.lineTo(0, 340); ctx.lineTo(140, 290); ctx.lineTo(310, 235); ctx.lineTo(540, 165); ctx.lineTo(640, 220); ctx.lineTo(640, 480); ctx.fill();
        ctx.strokeStyle = '#adb5bd'; ctx.lineWidth = 14;
        ctx.beginPath(); towers.forEach(([x, y], i) => i ? ctx.lineTo(x, y + 18) : ctx.moveTo(x, y + 18)); ctx.stroke();

        towers.forEach(([x, y], i) => {
          ctx.fillStyle = '#868e96'; ctx.fillRect(x - 22, y - 16, 44, 42);
          ctx.fillStyle = '#495057'; ctx.fillRect(x - 24, y - 22, 48, 8);
          if (lit[i]) {
            ctx.fillStyle = '#ff6b00';
            ctx.beginPath(); ctx.arc(x, y - 30, 12 + Math.sin(t * 8 + i) * 3, 0, Math.PI * 2); ctx.fill();
            for (let s = 0; s < 4; s++) {
              const sy = y - 42 - ((t * 28 + s * 22) % 90);
              ctx.fillStyle = 'rgba(120,120,120,0.55)';
              ctx.beginPath(); ctx.arc(x + Math.sin(t + s) * 8, sy, 10 + s * 4, 0, Math.PI * 2); ctx.fill();
            }
          }
        });
        const count = lit.filter(Boolean).length;
        ctx.fillStyle = '#5c2b0e'; ctx.font = 'bold 18px sans-serif';
        ctx.fillText(count ? `🔥 烽火接力中：已点亮 ${count}/4 座烽火台，军情飞速传向千里外！` : '点击按钮点燃第一座烽火台，看看古代怎么飞速传信！', 20, 38);
        rafId = requestAnimationFrame(loop);
      };
      loop();
      return;
    }

    // 11. 京剧变脸大师
    if (labType === 'peking-opera') {
      const masks = [
        { name: '红脸 · 关羽', bg: '#c92a2a', accent: '#fff', trait: '代表：忠义勇敢、赤胆忠心！' },
        { name: '黑脸 · 包拯', bg: '#212529', accent: '#f8f9fa', trait: '代表：正直无私、刚烈豪爽！' },
        { name: '金脸 · 孙悟空', bg: '#f59f00', accent: '#e03131', trait: '代表：神通广大、机智神仙！' },
        { name: '白脸 · 曹操', bg: '#f1f3f5', accent: '#343a40', trait: '代表：多疑奸诈、工于心计！' }
      ];
      let idx = 0, flip = 1;
      const btn = document.createElement('button');
      btn.className = 'lab-btn active';
      btn.textContent = '✨ 刷！变脸！';
      btn.onclick = () => { idx = (idx + 1) % masks.length; flip = 0.05; };
      controlsHost.appendChild(btn);

      const loop = () => {
        if (flip < 1) flip = Math.min(1, flip + 0.09);
        const m = masks[idx];
        ctx.fillStyle = '#fff4e6'; ctx.fillRect(0, 0, W, H);
        ctx.save();
        ctx.translate(320, 235);
        ctx.scale(flip, 1);
        ctx.fillStyle = m.bg;
        ctx.beginPath(); ctx.ellipse(0, 0, 108, 134, 0, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#d9480f'; ctx.lineWidth = 4; ctx.stroke();
        // 经典眉眼纹饰
        ctx.strokeStyle = m.accent; ctx.lineWidth = 10; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(-66, -28); ctx.quadraticCurveTo(-30, -56, -12, -16); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(66, -28); ctx.quadraticCurveTo(30, -56, 12, -16); ctx.stroke();
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.ellipse(-38, -14, 18, 10, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(38, -14, 18, 10, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#111';
        ctx.beginPath(); ctx.arc(-38, -14, 6, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(38, -14, 6, 0, Math.PI * 2); ctx.fill();
        // 胡须/嘴
        ctx.fillStyle = '#e8590c';
        ctx.beginPath(); ctx.ellipse(0, 56, 28, 11, 0, 0, Math.PI * 2); ctx.fill();
        ctx.restore();

        ctx.fillStyle = '#7c2d12'; ctx.font = 'bold 22px sans-serif';
        ctx.fillText(m.name, 26, 44);
        ctx.font = '16px sans-serif';
        ctx.fillText(m.trait, 26, 446);
        rafId = requestAnimationFrame(loop);
      };
      loop();
      return;
    }

    // 12. 复兴号高铁空气动力学演示
    if (labType === 'highspeed-train') {
      let sleek = true;
      const b1 = document.createElement('button');
      b1.className = 'lab-btn active'; b1.textContent = '🚄 复兴号流线车头（350 km/h）';
      const b2 = document.createElement('button');
      b2.className = 'lab-btn'; b2.textContent = '🚃 传统平头车厢（120 km/h）';
      b1.onclick = () => { sleek = true; b1.classList.add('active'); b2.classList.remove('active'); };
      b2.onclick = () => { sleek = false; b2.classList.add('active'); b1.classList.remove('active'); };
      controlsHost.append(b1, b2);

      const loop = () => {
        t += sleek ? 0.16 : 0.06;
        ctx.fillStyle = '#d0ebff'; ctx.fillRect(0, 0, W, H);
        // 流动空气流线
        for (let i = 0; i < 6; i++) {
          const y = 145 + i * 28;
          ctx.strokeStyle = sleek ? 'rgba(16, 152, 173, 0.75)' : 'rgba(224, 49, 49, 0.65)';
          ctx.lineWidth = 3;
          ctx.beginPath();
          for (let x = 0; x <= W; x += 18) {
            const wave = sleek ? Math.sin(x * 0.02 + t) * 4 : (x > 210 && x < 290 ? Math.sin(x * 0.15 + t * 2) * 18 : 0);
            const lift = x > 220 && y > 190 ? -42 : 0;
            if (x === 0) ctx.moveTo(x, y + wave);
            else ctx.lineTo(x, y + wave + lift * (sleek ? 0.55 : 0.9));
          }
          ctx.stroke();
        }
        // 高架桥与铁轨
        ctx.fillStyle = '#868e96'; ctx.fillRect(0, 325, W, 22);
        ctx.fillStyle = '#adb5bd';
        for (let p = 0; p < 5; p++) {
          const px = ((p * 160 - t * 45) % (W + 160) + W + 160) % (W + 160) - 80;
          ctx.fillRect(px, 347, 26, 133);
        }
        // 列车
        ctx.fillStyle = '#f8f9fa';
        ctx.beginPath();
        if (sleek) {
          ctx.moveTo(640, 235); ctx.lineTo(310, 235);
          ctx.quadraticCurveTo(215, 240, 175, 315);
          ctx.lineTo(640, 315);
        } else {
          ctx.rect(225, 235, 415, 80);
        }
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#c92a2a'; ctx.fillRect(sleek ? 220 : 225, 276, 420, 14);

        ctx.fillStyle = '#0c261f'; ctx.font = 'bold 18px sans-serif';
        ctx.fillText(sleek ? '🚄 流线型车头：气流顺滑贴合，阻力小，轻松飙到 350 km/h！' : '🚃 平头车厢：迎面撞出大漩涡，风阻大得多！', 20, 38);
        rafId = requestAnimationFrame(loop);
      };
      loop();
    }
  }

  function wrapText(ctx, text, x, y, maxW, lh) {
    let line = '';
    for (const ch of text) {
      const test = line + ch;
      if (ctx.measureText(test).width > maxW) {
        ctx.fillText(line, x, y);
        line = ch;
        y += lh;
      } else line = test;
    }
    if (line) ctx.fillText(line, x, y);
  }

  // 为非 GIF 词条绘制高颜值手绘风格静态卡片封面（DataURL），确保开箱即用零破图
  function makePosterDataURL(entry) {
    const c = document.createElement('canvas');
    c.width = 480; c.height = 360;
    const ctx = c.getContext('2d');
    const palettes = {
      earth: ['#114b37', '#2b8a57', '#d8f5a2'],
      science: ['#0b1d45', '#1c4e9c', '#74c0fc'],
      society: ['#5c2b0e', '#c2591a', '#ffd8a8'],
      culture: ['#5c1230', '#b4235a', '#fcc2d7']
    };
    const [c1, c2, c3] = palettes[entry.volume] || palettes.earth;
    const g = ctx.createLinearGradient(0, 0, 480, 360);
    g.addColorStop(0, c1); g.addColorStop(1, c2);
    ctx.fillStyle = g; ctx.fillRect(0, 0, 480, 360);
    // 装饰光环与百科虚线框
    ctx.strokeStyle = 'rgba(231,197,116,0.45)'; ctx.lineWidth = 2;
    ctx.strokeRect(16, 16, 448, 328);
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.beginPath(); ctx.arc(240, 165, 92, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = c3; ctx.setLineDash([6, 6]);
    ctx.beginPath(); ctx.arc(240, 165, 114, 0, Math.PI * 2); ctx.stroke();
    ctx.setLineDash([]);
    // 中心主题徽标
    ctx.font = '86px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(entry.emoji, 240, 168);
    ctx.fillStyle = '#fdfaf2'; ctx.font = 'bold 24px sans-serif';
    ctx.fillText(entry.title, 240, 294);
    ctx.fillStyle = c3; ctx.font = '14px sans-serif';
    ctx.fillText(`《中国儿童百科全书 · ${entry.volumeName}》`, 240, 324);
    return c.toDataURL('image/png');
  }

  return { start, stop, makePosterDataURL };
})();
