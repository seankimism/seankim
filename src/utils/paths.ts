/** Keep internal links working on both user sites and GitHub project sites. */
export function withBase(path: string = "/"): string {
    return `${import.meta.env.BASE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}
