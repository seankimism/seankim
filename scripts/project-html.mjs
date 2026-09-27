export const basePrefix = base => base === '/' ? '' : `/${base.replace(/^\/+|\/+$/g, '')}`;

export function tags(html, name) {
  return [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'gi'))].map(match =>
    Object.fromEntries([...match[0].matchAll(/([\w-]+)\s*=\s*(["'])(.*?)\2/g)]
      .map(([, key, , value]) => [key.toLowerCase(), value])));
}

// Detail pages wrap their study cards in an outer article; inspect the cards.
export const articles = html => [...html.matchAll(/<article\b[^>]*>(?:(?!<article\b)[\s\S])*?<\/article>/gi)]
  .map(([article]) => article);
export const hasLink = (html, href) => tags(html, 'a').some(tag => tag.href === href);
