import { Session } from "../content-scripts/Session";
import { Constants } from "../content-scripts/Constants";

describe('Session Test Suite', () => {
    describe('Session constructor', () => {
        it('should create a session with provided ID and status = created', () => {
            let session = new Session("1-1");

            expect(session.getId()).toBe("1-1");
            expect(session.getStatus()).toBe(Constants.SESSION_STATUS_CREATED);
        });
    });

    describe('Session.updateStatus() method', () => {
        it('should update session status to created if session has no init and end timestamps', () => {
            let sessionStatus = new Session('test').getStatus();

            expect(sessionStatus).toBe(Constants.SESSION_STATUS_CREATED);
        });
        it('should update session status to active if session has init and no end timestamp', () => {
            let sessionStatus = new Session('test', Date.now()).getStatus();

            expect(sessionStatus).toBe(Constants.SESSION_STATUS_ACTIVE);
        });
        it('should update session status to complete if session has both init and end timestamps', () => {
            let sessionStatus = new Session('test', Date.now(), Date.now() + 100000).getStatus();

            expect(sessionStatus).toBe(Constants.SESSION_STATUS_COMPLETE);
        });
    });

    describe('Session.start() method', () => {
        it('should start a session with the current timestamp when called with no arguments, and update session status');
        it('should start a session with the provided timestamp, and update session status');
    });
});