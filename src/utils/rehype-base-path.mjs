// Emit stable public URLs before Astro's client router parses the next page.
// Raw HTML is still unparsed when Astro runs custom rehype plugins.
export default function rehypeBasePath({ base = '/' } = {}) {
  const prefix = base.replace(/\/+$/, '');
  const withBase = value => {
    if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) return value;
    if (value === prefix || value.startsWith(`${prefix}/`)) return value;
    return `${prefix}${value}`;
  };

  return tree => {
    if (!prefix) return;
    const visit = node => {
      if (node.type === 'raw') {
        node.value = node.value.replace(
          /(\b(?:href|src|poster)\s*=\s*)(["'])(\/(?!\/)[^"']*)\2/gi,
          (_, attribute, quote, value) => `${attribute}${quote}${withBase(value)}${quote}`,
        );
      }
      if (node.type === 'element' && node.properties) {
        for (const attribute of ['href', 'src', 'poster']) {
          if (attribute in node.properties) node.properties[attribute] = withBase(node.properties[attribute]);
        }
      }
      node.children?.forEach(visit);
    };
    visit(tree);
  };
}
