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

    describe('Session.start() method', () => {
        it('should start the session with the current timestamp when called with no arguments, and update session status', () => {
            let startedSession = new Session('test').start();

            expect(startedSession.getStatus()).toBe(Constants.SESSION_STATUS_ACTIVE);
            expect(startedSession.getInitTimestamp()).toEqual(jasmine.any(Number));
        });
        it('should start the session with the provided timestamp, and update session status', () => {
            let ts = Date.now();

            let startedSession = new Session('test').start(ts);

            expect(startedSession.getInitTimestamp()).toBe(ts);
            expect(startedSession.getStatus()).toBe(Constants.SESSION_STATUS_ACTIVE);
        });
        it('should throw an error if the session status is not created', () => {
            let startedSession = new Session('test', Date.now());
            expect(startedSession.getStatus()).not.toBe(Constants.SESSION_STATUS_CREATED);
            expect(startedSession.start).toThrowError();

            let completedSession = startedSession.complete();
            expect(startedSession.getStatus()).not.toBe(Constants.SESSION_STATUS_CREATED);
            expect(startedSession.start).toThrowError();
        });
    });

    describe('Session.complete() method', () => {
        it('should throw an error if the session status is not active', () => {
            let createdSession = new Session('test');
            expect(createdSession.getStatus()).not.toBe(Constants.SESSION_STATUS_ACTIVE);
            expect(createdSession.complete).toThrowError();

            let completedSession = createdSession.start().complete();
            expect(completedSession.getStatus()).not.toBe(Constants.SESSION_STATUS_ACTIVE);
            expect(completedSession.complete).toThrowError();
        });
        it('should complete the session with the current timestamp when called with no arguments, and update session status', () => {
            let completedSession = new Session('test', Date.now()).complete();

            expect(completedSession.getEndTimestamp()).toEqual(jasmine.any(Number));
            expect(completedSession.getStatus()).toBe(Constants.SESSION_STATUS_COMPLETE);
        });
        it('should complete the session with the provided timestamp, and update session status', () => {
            let ts = Date.now();
            let completedSession = new Session('test', Date.now()).complete(ts);

            expect(completedSession.getEndTimestamp()).toEqual(ts);
            expect(completedSession.getStatus()).toBe(Constants.SESSION_STATUS_COMPLETE);
        });
    });
});