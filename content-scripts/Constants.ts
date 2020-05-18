export class Constants {
    static readonly STORAGE_PROBLEM_COLLECTION = "problem_collection_obj";

    static PROBLEM_TITLE_SELECTOR = "div[data-cy=question-title]";

    static SUBMIT_BUTTON_SELECTOR = "button[data-cy=submit-code-btn]";

    static SUBMISSION_SUCCESS_DIV_CLASS_SELECTOR = ".success__3Ai7";

    static PROBLEM_STATUS_ACTIVE = "active";

    static PROBLEM_STATUS_COMPLETE = "complete";

    static PROBLEM_STATUS_CREATED = "created";  // when a problem is created but has no associated sessions.

    static SESSION_STATUS_ACTIVE = "active";
    
    static SESSION_STATUS_COMPLETE = "complete";

    static SESSION_STATUS_CREATED = "created";

    static readonly STORAGE_PROBLEM_CODE = "code";
    static readonly STORAGE_PROBLEM_NAME = "name";
    static readonly STORAGE_PROBLEM_URL = "url";
    static readonly STORAGE_PROBLEM_SESSION_LIST = "session_list";

    static readonly STORAGE_SESSION_ID = "s_id";
    static readonly STORAGE_SESSION_INIT_TS = "s_init_ts";
    static readonly STORAGE_SESSION_END_TS = "s_end_ts";
    static readonly STORAGE_SESSION_STATUS = "s_status";
}
