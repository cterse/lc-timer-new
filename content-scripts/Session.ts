import { Constants } from "./Constants";
import { Problem } from "./Problem";
import { ChromeStorageSession } from "./ChromeStorageTypes";

export class Session {
    private id: string;
    private initTimestamp?: number;
    private status: string;
    private endTimestamp?: number;

    constructor(id: string, startTimestamp?: number, endTimestamp?: number) {
        this.id = id;
        this.initTimestamp = startTimestamp ?? undefined;
        this.endTimestamp = endTimestamp ?? undefined;
        this.status = this.updateStatus();
    }

    getId(): string {
        return this.id;
    }

    getInitTimestamp(): number | undefined {
        return this.initTimestamp;
    }

    getEndTimestamp(): number | undefined {
        return this.endTimestamp;
    }

    getStatus(): string {
        return this.status;
    }

    start(startTimestamp: number = Date.now()): Session {
        if (this.status !== Constants.SESSION_STATUS_CREATED) throw new Error("Attempt to start a "+this.status+" session");

        this.initTimestamp = startTimestamp;
        this.updateStatus();
        
        return this;
    }

    complete(stopTimestamp: number = Date.now()): Session {
        if (this.status !== Constants.SESSION_STATUS_ACTIVE) throw new Error("Attemp to complete a "+this.status+" session");

        this.endTimestamp = stopTimestamp;
        this.updateStatus();

        return this;
    }

    private updateStatus(): string {
        if (this.endTimestamp && this.initTimestamp) this.status = Constants.SESSION_STATUS_COMPLETE;
        else if (this.initTimestamp) this.status = Constants.SESSION_STATUS_ACTIVE;
        else this.status = Constants.SESSION_STATUS_CREATED;

        return this.status;
    }

    getChromeSession(): ChromeStorageSession {
        

        return null;
    }
}
