export enum Language {
    DUTCH = "nl",
    ENGLISH = "en",
}

import { persisted } from "svelte-persisted-store";

export const selectedLanguage = persisted("selectedLanguage", "nl");
