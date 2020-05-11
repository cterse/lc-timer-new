import { Session } from "./Session";

export class Problem {
    code: number;
    name: string;
    url: URL;
    sessionsList: Array<Session>;

    constructor({ code, name, url, sessionList }: { code: number; name: string; url: URL; sessionList: Array<Session>; }) {
        this.code = code;
        this.name = name;
        this.url = url;
        this.sessionsList = sessionList;
    }

    startProblem(startTimestamp: number = Date.now()): Problem {
        
    }

}

export class ProblemBuilder {
    private _code: number = -1;
    private _name: string = null;
    private _url: URL = null;
    private _sessionsList: Array<Session> = null;

    setCode(code: number): ProblemBuilder {
        this._code = code;
        return this;
    }

    setName(name: string): ProblemBuilder {
        this._name = name;
        return this;
    }

    setUrl(url: URL): ProblemBuilder {
        this._url = url;
        return this;
    }

    setSessionsList(list: Array<Session>): ProblemBuilder {
        this._sessionsList = list;
        return this;
    }

    build(): Problem {
        return new Problem({ code: this._code, name: this._name, url: this._url, sessionList: this._sessionsList });
    }
}