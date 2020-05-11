var Problem = /** @class */ (function () {
    function Problem(code, name, url, sessionList) {
        if (sessionList === void 0) { sessionList = null; }
        this.code = code;
        this.name = name;
        this.url = url;
        this.sessionsList = sessionList;
    }
    return Problem;
}());
export { Problem };
var ProblemBuilder = /** @class */ (function () {
    function ProblemBuilder() {
        this._code = -1;
        this._name = null;
        this._url = null;
        this._sessionsList = null;
    }
    ProblemBuilder.prototype.setCode = function (code) {
        this._code = code;
        return this;
    };
    ProblemBuilder.prototype.setName = function (name) {
        this._name = name;
        return this;
    };
    ProblemBuilder.prototype.setUrl = function (url) {
        this._url = url;
        return this;
    };
    ProblemBuilder.prototype.setSessionsList = function (list) {
        this._sessionsList = list;
        return this;
    };
    ProblemBuilder.prototype.build = function () {
        return new Problem(this._code, this._name, this._url, this._sessionsList);
    };
    return ProblemBuilder;
}());
export { ProblemBuilder };
