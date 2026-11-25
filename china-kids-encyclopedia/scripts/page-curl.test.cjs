const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const browser = { window: {} };
vm.runInNewContext(fs.readFileSync(require.resolve('../page-curl.js'), 'utf8'), browser);
const { makeCurl } = browser.window.BookCurl;

const width = 510;
const height = 620;
const columns = 48;
const rows = 12;
const size = (columns + 1) * (rows + 1) * 3;
const position = (sheet, row, column) => sheet.slice(3 * (row * (columns + 1) + column), 3 * (row * (columns + 1) + column + 1));
const curl = (direction, progress) => {
  const sheet = new Float32Array(size);
  makeCurl(width, height, columns, rows, direction)(progress, sheet);
  return sheet;
};

test('the front starts flat and the back lands flat on the opposite leaf', () => {
  for (const direction of [1, -1]) {
    const outer = direction === 1 ? columns : 0;
    for (const row of [0, rows / 2, rows]) {
      assert.ok(Math.abs(position(curl(direction, 0), row, outer)[0] - width * direction) < 0.01);
      assert.ok(Math.abs(position(curl(direction, 1), row, outer)[0] + width * direction) < 0.01);
      assert.ok(Math.abs(position(curl(direction, 1), row, outer)[2]) < 0.01);
    }
  }
});

test('the spine stays attached and paper length does not grow while turning', () => {
  const sheet = curl(1, 0.43);
  for (let row = 0; row <= rows; row++) {
    const spine = position(sheet, row, 0);
    assert.ok(Math.abs(spine[0]) < 0.001 && Math.abs(spine[2]) < 0.001);
    let length = 0;
    for (let column = 1; column <= columns; column++) {
      const a = position(sheet, row, column - 1);
      const b = position(sheet, row, column);
      length += Math.hypot(...b.map((value, axis) => value - a[axis]));
      assert.ok(b[2] >= -0.001);
    }
    assert.ok(Math.abs(length - width) < 0.025);
  }
});

test('the outside edge lifts and bends differently along the diagonal', () => {
  const sheet = curl(1, 0.34);
  const top = position(sheet, 0, columns);
  const bottom = position(sheet, rows, columns);
  assert.ok(top[2] > width * 0.4);
  assert.ok(Math.abs(top[0] - bottom[0]) > width * 0.1);
  const prev = curl(-1, 0.34);
  assert.ok(Math.abs(position(prev, 0, 0)[0] + top[0]) < 0.001);
});
