interface Problem {
    code: number;
    name: string;
    url: URL;
    sessions_list: Array<Session>;
}

interface Session {
    s_id: string;
    s_init_ts: number;
    s_status: string;
    s_end_ts: number;
}

export const constants = {
    STORAGE_PROBLEM_COLLECTION: "problem_collection_obj",
    PROBLEM_TITLE_SELECTOR: "div[data-cy=question-title]",
    SUBMIT_BUTTON_SELECTOR: "button[data-cy=submit-code-btn]",
    SUBMISSION_SUCCESS_DIV_CLASS_SELECTOR: ".success__3Ai7",
    PROBLEM_STATUS_ACTIVE: "active",
    PROBLEM_STATUS_COMPLETE: "complete",
    SESSION_STATUS_ACTIVE: "active",
    SESSION_STATUS_COMPLETE: "complete",
};

function extractProblemCode(): number {
    return Number($( constants.PROBLEM_TITLE_SELECTOR ).text().split('.')[0].trim());
}

function extractProblemName(): string {
    return $( constants.PROBLEM_TITLE_SELECTOR ).text().split('.')[1].trim();
}

function extractProblemUrl(): URL {
    return new URL(location.href);
}
