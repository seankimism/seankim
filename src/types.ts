export interface SiteConfig {
    website: string;
    author: string;
    desc: string;
    title: string;
    favicon: string;
}

export interface SeoConfig {
    /** Default Open Graph image, root-relative; 1200x630 recommended. */
    image: string;
    imageWidth: number;
    imageHeight: number;
    imageAlt: string;
    jobTitle: string;
    /** Profile URLs that identify the same person (schema.org sameAs). */
    sameAs: string[];
    knowsAbout: string[];
    /** Content of the google-site-verification meta tag; empty disables it. */
    googleSiteVerification: string;
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
