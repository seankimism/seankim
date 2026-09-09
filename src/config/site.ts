import type { SiteConfig, ThemeConfig, SettingsConfig, AnalyticsConfig } from "../types";

export const SITE: SiteConfig = {
    website: "https://seankimism.github.io/",
    author: 'Byumsu “Sean” Kim',
    desc: "Sean Kim works across upstream bioprocess development, process analytical technology, computational modeling, and tissue engineering.",
    title: "Sean Kim",
    ogImage: "",
    postPerPage: 5,
    favicon: "/favicon.svg",
    lang: "en",
};
export const THEME_CONFIG: ThemeConfig = {
    lightAndDark: true,
    themeLight: "light_default",
    themeDark: "dark_default",
};
export const SETTINGS: SettingsConfig = {
    showTagsInNavbar: false,
    showRSSInFooter: false,
    addDevToolsInProduction: false,
};
export const ANALYTICS: AnalyticsConfig = {
    ga4Id: "",
    umami: { websiteId: "10da1a39-df97-4527-93d6-603c889bee35", src: "https://cloud.umami.is/script.js" },
};
