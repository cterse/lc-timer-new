var Session = /** @class */ (function () {
    function Session(id, init_ts, status, end_ts) {
        if (end_ts === void 0) { end_ts = null; }
        this.id = id;
        this.initTimestamp = init_ts;
        this.endTimestamp = end_ts;
        this.status = status;
    }
    return Session;
}());
export { Session };
