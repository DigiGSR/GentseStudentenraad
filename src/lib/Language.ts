export enum Language {
    DUTCH = "nl",
    ENGLISH = "en",
}

import { persisted, type Persisted } from "svelte-persisted-store";

export const selectedLanguage: Persisted<"nl" | "en"> = persisted("selectedLanguage", "nl");
