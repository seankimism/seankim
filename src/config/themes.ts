import type { Theme, ThemeColors, ThemeName } from "../types/themes";

export { type Theme, type ThemeName, type ThemeColors };

export const THEMES: Record<string, Theme> = {
    light_default: {
        background: "#ffffff",
        foreground: "#192c36",
        accent: "#236775",
        muted: "#576770",
        border: "#dce4e8",
        surface: "#f4f7f8",
        isDark: false,
    },
    dark_default: {
        background: "#141e26",
        foreground: "#e5edf1",
        accent: "#83cbd3",
        muted: "#a9bbc5",
        border: "#344752",
        surface: "#1a2933",
        isDark: true,
    },
    light_notepad: {
        isDark: false,
        background: '#fdf8e9',
        surface: '#fdf8e9',
        foreground: '#29231c',
        muted: '#736658',
        border: '#eaddc6',
        accent: '#b84c30',
    },
    dark_notepad: {
        isDark: true,
        background: '#241f1c',
        surface: '#241f1c',
        foreground: '#e6dfd3',
        muted: '#8a7d71',
        border: '#3d342d',
        accent: '#d97757',
    }
};