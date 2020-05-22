import { Constants } from "./Constants";
import { Session } from "./Session";

export interface ChromeStorageSession {
    [Constants.STORAGE_SESSION_ID]: string;
    [Constants.STORAGE_SESSION_INIT_TS]?: number;
    [Constants.STORAGE_SESSION_END_TS]?: number;
    [Constants.STORAGE_SESSION_STATUS]: string;
}

export interface ChromeStorageProblem {
    [Constants.STORAGE_PROBLEM_CODE]: number;
    [Constants.STORAGE_PROBLEM_NAME]: string;
    [Constants.STORAGE_PROBLEM_URL]: string;
    [Constants.STORAGE_PROBLEM_SESSION_LIST]: Array<ChromeStorageSession>;
}

export interface ChromeStorageProblemCollection {
    [key: string]: ChromeStorageProblem
}

export interface ChromeStorageResult {
    [Constants.STORAGE_PROBLEM_COLLECTION]: ChromeStorageProblemCollection;
}
