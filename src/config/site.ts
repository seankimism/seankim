import type { SiteConfig, SeoConfig, ThemeConfig, AnalyticsConfig } from "../types";

export const SITE: SiteConfig = {
    website: "https://seankimism.github.io/",
    author: 'Byumsu “Sean” Kim',
    desc: "Byumsu “Sean” Kim is a bioprocess engineer specializing in upstream process development, process analytical technology, computational modeling, and tissue engineering.",
    title: "Sean Kim",
    favicon: "/favicon.svg",
};
export const SEO: SeoConfig = {
    image: "/images/social-card.png",
    imageWidth: 1200,
    imageHeight: 630,
    imageAlt: "Byumsu “Sean” Kim, bioprocess engineer: upstream process development, digital twins, and tissue engineering.",
    jobTitle: "Bioprocess Engineer",
    sameAs: [
        "https://www.linkedin.com/in/byumsukim",
        "https://scholar.google.com/citations?user=WE92tgwAAAAJ",
        "https://github.com/seankimism",
    ],
    knowsAbout: ["Bioprocess development", "Upstream cell culture", "Process analytical technology", "Bioreactor scale-up", "Digital twins", "Cartilage tissue engineering", "Biomechanics"],
    googleSiteVerification: "_k0GbZlBugSEW4kkCvH0oA9K9VWCdxyb8pCO4mV6Gk8",
};
export const THEME_CONFIG: ThemeConfig = {
    lightAndDark: true,
    themeLight: "light_default",
    themeDark: "dark_default",
};
export const ANALYTICS: AnalyticsConfig = {
    ga4Id: "",
    umami: { websiteId: "10da1a39-df97-4527-93d6-603c889bee35", src: "https://cloud.umami.is/script.js" },
};
