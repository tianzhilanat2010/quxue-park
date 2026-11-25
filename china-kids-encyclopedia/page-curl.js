/* Connected rows of inextensible paper. Compatible with the project's classic scripts. */
(() => {
  function makeCurl(width, height, columns, rows, direction) {
    const segment = width / columns;
    return function curl(progress, positions) {
      const lift = Math.sin(Math.PI * progress);
      for (let row = 0; row <= rows; row++) {
        const vertical = row / rows;
        const phase = Math.max(0, Math.min(1, progress + (vertical - 0.5) * 0.135 * lift));
        const hinge = Math.PI * phase * phase * (3 - 2 * phase);
        const y = (0.5 - vertical) * height;
        let x = 0;
        let z = 0;
        for (let column = 0; column <= columns; column++) {
          const index = (row * (columns + 1) + (direction === 1 ? column : columns - column)) * 3;
          positions[index] = x * direction;
          positions[index + 1] = y;
          positions[index + 2] = z;
          if (column < columns) {
            const outward = (column + 0.5) / columns;
            const bend = lift * (2.05 * outward ** 2.15 - 0.46);
            const angle = Math.max(0, Math.min(Math.PI, hinge + bend));
            x += Math.cos(angle) * segment;
            z += Math.sin(angle) * segment;
          }
        }
      }
    };
  }

  if (typeof module === 'object' && module.exports) module.exports = { makeCurl };
  else window.BookCurl = { makeCurl };
})();
