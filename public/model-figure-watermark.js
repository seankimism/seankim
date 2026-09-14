// Attribution for the original model figures. This does not prevent copying.
// Call after each plot redraw; canvas coordinates use the viewer's CSS-pixel transform.
(() => {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  const NAME = 'Sean Kim';
  const SITE = 'seankimism.github.io/seankim';
  const ANGLE = -22;

  function layout(width, height) {
    const landscape = width >= height;
    const columns = width < 420 ? [0.5] : landscape ? [0.22, 0.5, 0.78] : [0.3, 0.7];
    const rows = landscape ? [0.26, 0.68] : [0.2, 0.5, 0.8];
    const size = Math.max(12, Math.min(width, height) * 0.035);
    return {positions: rows.flatMap(y => columns.map(x => [x * width, y * height])), size};
  }

  function svg(target, bounds) {
    target.querySelector(':scope > [data-model-watermark]')?.remove();
    const width = bounds.right - bounds.left, height = bounds.bottom - bounds.top;
    if (!(width > 0 && height > 0)) return;
    const group = document.createElementNS(NS, 'g');
    group.setAttribute('data-model-watermark', '');
    group.setAttribute('aria-hidden', 'true');
    group.setAttribute('pointer-events', 'none');
    group.setAttribute('fill', '#334155');
    group.setAttribute('fill-opacity', '0.12');
    group.setAttribute('stroke', '#ffffff');
    group.setAttribute('stroke-opacity', '0.25');
    group.setAttribute('stroke-width', '1');
    group.setAttribute('paint-order', 'stroke');
    group.setAttribute('font-family', 'Arial, sans-serif');
    group.setAttribute('text-anchor', 'middle');
    const {positions, size} = layout(width, height);
    for (const [x, y] of positions) {
      const label = document.createElementNS(NS, 'g');
      label.setAttribute('transform', `translate(${bounds.left + x} ${bounds.top + y}) rotate(${ANGLE})`);
      for (const [text, fontSize, baseline, weight] of [[NAME, size, 0, '600'], [SITE, Math.max(7, size * 0.55), size * 0.9, '400']]) {
        const node = document.createElementNS(NS, 'text');
        node.setAttribute('x', '0');
        node.setAttribute('y', String(baseline));
        node.setAttribute('font-size', String(fontSize));
        node.setAttribute('font-weight', weight);
        // Viewer axis-label CSS also targets SVG text; retain the attribution style.
        node.style.fontSize = `${fontSize}px`;
        node.style.fontWeight = weight;
        node.style.fill = '#334155';
        node.textContent = text;
        label.append(node);
      }
      group.append(label);
    }
    target.append(group);
  }

  function canvas(context, width, height) {
    if (!context || !(width > 0 && height > 0)) return;
    const {positions, size} = layout(width, height);
    context.save();
    context.globalAlpha = 1;
    context.globalCompositeOperation = 'source-over';
    context.textAlign = 'center';
    context.textBaseline = 'alphabetic';
    context.fillStyle = 'rgba(51,65,85,0.12)';
    context.strokeStyle = 'rgba(255,255,255,0.25)';
    context.lineWidth = 1;
    context.lineJoin = 'round';
    for (const [x, y] of positions) {
      context.save();
      context.translate(x, y);
      context.rotate(ANGLE * Math.PI / 180);
      context.font = `600 ${size}px Arial, sans-serif`;
      context.strokeText(NAME, 0, 0);
      context.fillText(NAME, 0, 0);
      context.font = `400 ${Math.max(7, size * 0.55)}px Arial, sans-serif`;
      context.strokeText(SITE, 0, size * 0.9);
      context.fillText(SITE, 0, size * 0.9);
      context.restore();
    }
    context.restore();
  }

  window.ModelFigureWatermark = Object.freeze({svg, canvas});
})();
