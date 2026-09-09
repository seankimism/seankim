import type { SocialLink } from "../types";
export const SOCIALS: SocialLink[] = [
    { name: "LinkedIn", href: "https://www.linkedin.com/in/byumsukim", linkTitle: "Sean Kim on LinkedIn", isActive: true },
    { name: "Google Scholar", href: "https://bit.ly/GScholarKim", linkTitle: "Sean Kim on Google Scholar", isActive: true },
    { name: "Github", href: "https://github.com/seankimism", linkTitle: "Sean Kim on GitHub", isActive: true },
    { name: "Mail", href: "mailto:bk525@cornell.edu", linkTitle: "Email Sean Kim", isActive: true },
];
export const SOCIAL_ICONS: Record<string, string> = {
    Github: "Github", Mail: "Mail", LinkedIn: "LinkedIn", "Google Scholar": "GoogleScholar",
};
