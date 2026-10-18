function third(a, b, ratio) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const c = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.PI - 2 * Math.atan(ratio);
  const h = Math.sin(angle) * c / 2;
  const c_0 = (1 - Math.cos(angle)) * c / 2;
  return {
    x: a.x + c_0 / c * dx - h / c * dy,
    y: a.y + c_0 / c * dy + h / c * dx,
  };
}

function processLine(lines, bbox, bl, br, depth, ratio) {
  const tl = { x: bl.x + bl.y - br.y, y: bl.y + br.x - bl.x };
  const tr = { x: br.x + bl.y - br.y, y: br.y + br.x - bl.x };

  let line = `<polygon points="`;
  for (const p of [bl, br, tr, tl]) {
    bbox.minX = Math.min(bbox.minX, p.x);
    bbox.maxX = Math.max(bbox.maxX, p.x);
    bbox.minY = Math.min(bbox.minY, p.y);
    bbox.maxY = Math.max(bbox.maxY, p.y);
    line += `${p.x.toFixed(2)},${p.y.toFixed(2)} `;
  }
  line += `" fill="transparent" stroke="#00C100" stroke-width="2"/>`;
  lines.push(line);

  if (depth > 0) {
    const c = third(tl, tr, ratio);
    processLine(lines, bbox, tl, c, depth - 1, ratio);
    processLine(lines, bbox, c, tr, depth - 1, ratio);
  }
}

function pythagoreanTree(ratio, count) {
  const lines = [];
  const bbox = { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity };
  const bl = { x: 0, y: 0 };
  const br = { x: 200, y: 0 };
  processLine(lines, bbox, bl, br, count, ratio);

  const pad = 5;
  const vx = bbox.minX - pad;
  const vy = bbox.minY - pad;
  const vw = bbox.maxX - bbox.minX + 2 * pad;
  const vh = bbox.maxY - bbox.minY + 2 * pad;

  const svg = [`<svg viewBox="${vx} ${-vy - vh} ${vw} ${vh}" xmlns="http://www.w3.org/2000/svg">`];
  svg.push(`<g transform="scale(1,-1)">`);
  svg.push(...lines);
  svg.push('</g>');
  svg.push('</svg>');
  return svg.join('\n');
}

const left = document.getElementById('btn-left');
const right = document.getElementById('btn-right');
const twistLabel = document.getElementById('twist');
const container = document.getElementById('tree-container');

let twist = 0;
function update() {
  if (twist >= 0) {
    const ratio = 1 + twist / 10;
    container.innerHTML = pythagoreanTree(ratio, 12);
    twistLabel.textContent = `1.0 : ${ratio.toFixed(1)}`;
  } else {
    const ratio = 1 - twist / 10;
    container.innerHTML = pythagoreanTree(1 / ratio, 12);
    twistLabel.textContent = `${ratio.toFixed(1)} : 1.0`;
  }
}

left.addEventListener('click', () => {
  twist = Math.max(-40, twist - 1);
  update();
});

right.addEventListener('click', () => {
  twist = Math.min(40, twist + 1);
  update();
});

update();
