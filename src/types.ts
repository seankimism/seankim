export interface SiteConfig {
    website: string;
    author: string;
    desc: string;
    title: string;
    favicon: string;
}

export interface ThemeConfig {
    lightAndDark: boolean;
    themeLight: string;
    themeDark: string;
}

export interface AnalyticsConfig {
    ga4Id?: string;
    umami?: { websiteId: string; src: string };
}

export interface NavLink {
    href: string;
    label: string;
    isActive: boolean;
}

export interface SocialLink {
    name: string;
    href: string;
    linkTitle: string;
    isActive: boolean;
}

export interface PageConfig {
    title: string;
    subtitle: string;
    isActive: boolean;
}

export type PagesConfig = Record<string, PageConfig>;

export interface ThemeColors {
    background: string;
    foreground: string;
    accent: string;
    muted: string;
    border: string;
    surface: string;
}

export interface Theme extends ThemeColors {
    isDark: boolean;
}

export type ThemeName = string;
