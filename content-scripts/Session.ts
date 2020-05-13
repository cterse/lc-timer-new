import { Constants } from "./Constants";
import { Problem } from "./Problem";

export class Session {
    id: string;
    initTimestamp?: number;
    status: string;
    endTimestamp?: number;

    constructor(id: string) {
        this.id = id;
        this.status = Constants.SESSION_STATUS_CREATED;
    }

    setStatus(): string {
        if (this.endTimestamp) return Constants.SESSION_STATUS_COMPLETE;
        else if (this.initTimestamp) return Constants.SESSION_STATUS_ACTIVE;
        else return Constants.SESSION_STATUS_CREATED;
    }

    start(startTimestamp: number = Date.now()): Session {
        if (this.status !== Constants.SESSION_STATUS_CREATED) throw new Error("Attempt to start a "+this.status+" session");

        this.initTimestamp = startTimestamp;
        this.status = Constants.SESSION_STATUS_ACTIVE;
        return this;
    }

}
