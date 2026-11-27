import type { APIRoute } from 'astro';

// Crawlers asked to stay off the whole site. Search engines (Googlebot, Bingbot)
// and link-preview bots (LinkedIn, Slack, Facebook) are not listed, so they stay allowed.
// robots.txt is a request: well-behaved crawlers honor it, others ignore it.
const BLOCKED_CRAWLERS = [
    // AI model training
    'GPTBot',
    'ClaudeBot',
    'anthropic-ai',
    'CCBot',
    'Google-Extended',
    'Applebot-Extended',
    'meta-externalagent',
    'FacebookBot',
    'Bytespider',
    'Amazonbot',
    'cohere-ai',
    'cohere-training-data-crawler',
    'AI2Bot',
    'Diffbot',
    'omgili',
    'ImagesiftBot',
    'Timpibot',
    // SEO and backlink tools
    'AhrefsBot',
    'SemrushBot',
    'MJ12bot',
    'DotBot',
    'BLEXBot',
    'DataForSeoBot',
    'Barkrowler',
];

export const GET: APIRoute = ({ site }) => {
    const sitemap = new URL(`${import.meta.env.BASE_URL.replace(/^\//, '').replace(/\/$/, '')}/sitemap-index.xml`.replace(/^\//, ''), site).href;
    const lines = [
        ...BLOCKED_CRAWLERS.map(agent => `User-agent: ${agent}`),
        'Disallow: /',
        '',
        'User-agent: *',
        'Allow: /',
        '',
        `Sitemap: ${sitemap}`,
    ];
    return new Response(`${lines.join('\n')}\n`, { headers: { 'Content-Type': 'text/plain' } });
};
