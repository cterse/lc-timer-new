import { Constants } from "./Constants";

export class Session {
    id: string;
    initTimestamp: number;
    status: string;
    endTimestamp: number;

    constructor(id: string, init_ts: number, status: string, end_ts: number) {
        this.id = id;
        this.initTimestamp = init_ts;
        this.endTimestamp = end_ts;
        this.status = status;
    }

}
