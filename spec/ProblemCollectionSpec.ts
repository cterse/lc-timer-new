import { ProblemCollection, ChromeStorageResult } from "../content-scripts/ProblemCollection";
import { Problem } from "../content-scripts/Problem";

xdescribe('Problem Collection Test Suite:', () => {
    var chromeStorageResult: ChromeStorageResult = {
        "problem_collection_obj": {
            "1": {
                "code": "1",
                "name": "Two Sum",
                "sessions_list": [
                    {
                        "s_end_ts": 1589722179631,
                        "s_id": "1-1",
                        "s_init_ts": 1589713308402,
                        "s_status": "complete"
                    },
                    {
                        "s_end_ts": null,
                        "s_id": "1-2",
                        "s_init_ts": 1589722199101,
                        "s_status": "active"
                    }
                ],
                "url": "https://leetcode.com/problems/two-sum/"
            },
            "2": {
                "code": "2",
                "name": "Add Two Numbers",
                "sessions_list": [
                    {
                        "s_end_ts": null,
                        "s_id": "2-1",
                        "s_init_ts": 1589722073646,
                        "s_status": "active"
                    }
                ],
                "url": "https://leetcode.com/problems/add-two-numbers/"
            },
            "3": {
                "code": "3",
                "name": "Longest Substring Without Repeating Characters",
                "sessions_list": [
                    {
                        "s_end_ts": null,
                        "s_id": "3-1",
                        "s_init_ts": 1589722076278,
                        "s_status": "active"
                    }
                ],
                "url": "https://leetcode.com/problems/longest-substring-without-repeating-characters/"
            }
        }
    }
    
    describe('ProblemCollection constructor', () => {
        it('should set problem collection object to empty object when called with no args', () => {
            let pc = new ProblemCollection();
            
            expect(pc.getProblemCollectionObject()).toEqual({});
        });

        it('should extract collection to problem collection object to empty object when called with ChromeStorageResult arg', () => {
            let pc = new ProblemCollection(chromeStorageResult);

            expect(pc.getProblemCollectionObject()).toEqual(chromeStorageResult.problem_collection_obj);
        });
    });

});