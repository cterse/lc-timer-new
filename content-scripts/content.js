/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./content-scripts/NewProblemContentScript.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./content-scripts/Constants.ts":
/*!**************************************!*\
  !*** ./content-scripts/Constants.ts ***!
  \**************************************/
/*! exports provided: Constants */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Constants", function() { return Constants; });
var Constants = /** @class */ (function () {
    function Constants() {
    }
    Constants.STORAGE_PROBLEM_COLLECTION = "problem_collection_obj";
    Constants.PROBLEM_TITLE_SELECTOR = "div[data-cy=question-title]";
    Constants.SUBMIT_BUTTON_SELECTOR = "button[data-cy=submit-code-btn]";
    Constants.SUBMISSION_SUCCESS_DIV_CLASS_SELECTOR = ".success__3Ai7";
    Constants.PROBLEM_STATUS_ACTIVE = "active";
    Constants.PROBLEM_STATUS_COMPLETE = "complete";
    Constants.PROBLEM_STATUS_CREATED = "created"; // when a problem is created but has no associated sessions.
    Constants.SESSION_STATUS_ACTIVE = "active";
    Constants.SESSION_STATUS_COMPLETE = "complete";
    Constants.SESSION_STATUS_CREATED = "created";
    return Constants;
}());



/***/ }),

/***/ "./content-scripts/NewProblemContentScript.ts":
/*!****************************************************!*\
  !*** ./content-scripts/NewProblemContentScript.ts ***!
  \****************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Constants */ "./content-scripts/Constants.ts");
/* harmony import */ var _ProblemCollection__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ProblemCollection */ "./content-scripts/ProblemCollection.ts");
/* harmony import */ var _ProblemUtils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ProblemUtils */ "./content-scripts/ProblemUtils.ts");



var pageInitInterval = setInterval(setupMonitoringScript, 100);
function setupMonitoringScript() {
    if ($(_Constants__WEBPACK_IMPORTED_MODULE_0__["Constants"].PROBLEM_TITLE_SELECTOR).length) {
        clearInterval(pageInitInterval);
        chrome.storage.sync.get([_Constants__WEBPACK_IMPORTED_MODULE_0__["Constants"].STORAGE_PROBLEM_COLLECTION], function (result) {
            var _a;
            if (!result) {
                console.error("lc-timer-new:problem-content : Error getting result from sync.");
                return null;
            }
            var problemUtils = new _ProblemUtils__WEBPACK_IMPORTED_MODULE_2__["ProblemUtils"]();
            var problemsCollection = new _ProblemCollection__WEBPACK_IMPORTED_MODULE_1__["ProblemCollection"](result);
            var currentProblemCode = problemUtils.extractProblemCode();
            var storageUpdated = false;
            var currentTime = Date.now();
            if (!problemsCollection.getProblem(currentProblemCode)) {
                console.debug("lc-timer-new:problem-content : Problem does not exist in storage, adding it.");
                var problem = problemUtils.createProblemFromContext().start(currentTime);
                problemsCollection.addProblem(problem);
                storageUpdated = true;
            }
            else {
                var problem = problemsCollection.getProblem(currentProblemCode);
                if (problem === null || problem === void 0 ? void 0 : problem.isComplete()) {
                    console.debug("lc-timer:problem-content : Completed problem exists, starting a new session.");
                    problem.startNewSession(currentTime);
                    storageUpdated = true;
                }
                else {
                    console.debug("lc-timer:problem=content : Problem already active.");
                }
            }
            if (storageUpdated) {
                chrome.storage.sync.set((_a = {}, _a[_Constants__WEBPACK_IMPORTED_MODULE_0__["Constants"].STORAGE_PROBLEM_COLLECTION] = problemsCollection, _a), function () {
                    console.debug("lc-timer:problem-content : set data to storage.");
                    console.dir(problemsCollection);
                });
            }
        });
    }
}


/***/ }),

/***/ "./content-scripts/Problem.ts":
/*!************************************!*\
  !*** ./content-scripts/Problem.ts ***!
  \************************************/
/*! exports provided: Problem */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Problem", function() { return Problem; });
/* harmony import */ var _Session__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Session */ "./content-scripts/Session.ts");
/* harmony import */ var _Constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Constants */ "./content-scripts/Constants.ts");


var Problem = /** @class */ (function () {
    function Problem(code, name, url, sessionList) {
        if (sessionList === void 0) { sessionList = []; }
        this.code = code;
        this.name = name;
        this.url = url;
        this.sessionsList = sessionList;
    }
    Problem.prototype.start = function (startTimestamp) {
        if (startTimestamp === void 0) { startTimestamp = Date.now(); }
        if (this.getStatus() !== _Constants__WEBPACK_IMPORTED_MODULE_1__["Constants"].PROBLEM_STATUS_CREATED)
            throw new Error("Attempt to start a " + this.getStatus() + " problem");
        return this.startNewSession(startTimestamp);
    };
    Problem.prototype.startNewSession = function (startTimestamp) {
        if (startTimestamp === void 0) { startTimestamp = Date.now(); }
        var newSession = new _Session__WEBPACK_IMPORTED_MODULE_0__["Session"](this.getNewSessionId()).start(startTimestamp);
        return this.addSession(newSession);
    };
    Problem.prototype.getNewSessionId = function () {
        return this.code + '-' + (this.sessionsList.length + 1).toString();
    };
    Problem.prototype.addSession = function (session) {
        this.sessionsList.push(session);
        return this;
    };
    Problem.prototype.getStatus = function () {
        var _a, _b;
        return (_b = (_a = this.getLatestSession()) === null || _a === void 0 ? void 0 : _a.status) !== null && _b !== void 0 ? _b : _Constants__WEBPACK_IMPORTED_MODULE_1__["Constants"].PROBLEM_STATUS_CREATED;
    };
    Problem.prototype.getLatestSession = function () {
        return this.sessionsList[this.sessionsList.length - 1];
    };
    Problem.prototype.isComplete = function () {
        return this.getStatus() === _Constants__WEBPACK_IMPORTED_MODULE_1__["Constants"].PROBLEM_STATUS_COMPLETE;
    };
    Problem.prototype.isActive = function () {
        return this.getStatus() === _Constants__WEBPACK_IMPORTED_MODULE_1__["Constants"].PROBLEM_STATUS_ACTIVE;
    };
    return Problem;
}());



/***/ }),

/***/ "./content-scripts/ProblemCollection.ts":
/*!**********************************************!*\
  !*** ./content-scripts/ProblemCollection.ts ***!
  \**********************************************/
/*! exports provided: ProblemCollection */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProblemCollection", function() { return ProblemCollection; });
/* harmony import */ var _Constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Constants */ "./content-scripts/Constants.ts");

var ProblemCollection = /** @class */ (function () {
    function ProblemCollection(storageResult) {
        var _a;
        this.activeProblemCount = 0;
        this.completeProblemCount = 0;
        this.totalProblemCount = 0;
        this.problemCollectionObject = (_a = storageResult === null || storageResult === void 0 ? void 0 : storageResult[_Constants__WEBPACK_IMPORTED_MODULE_0__["Constants"].STORAGE_PROBLEM_COLLECTION]) !== null && _a !== void 0 ? _a : {};
        this.updateProblemCount();
    }
    ProblemCollection.prototype.getProblem = function (problemCode) {
        return JSON.parse(this.problemCollectionObject[problemCode]);
    };
    ProblemCollection.prototype.addProblem = function (problem) {
        this.problemCollectionObject[problem.code] = JSON.stringify(problem);
        this.updateProblemCount();
        return problem;
    };
    ProblemCollection.prototype.removeProblem = function (problemCode) {
        var deletedProblem = this.problemCollectionObject[problemCode];
        delete this.problemCollectionObject[problemCode];
        this.updateProblemCount();
        return JSON.parse(deletedProblem);
    };
    ProblemCollection.prototype.updateProblemCount = function () {
        var activeCount = 0, completeCount = 0, total = 0;
        for (var key in this.problemCollectionObject) {
            if (!this.problemCollectionObject.hasOwnProperty(key))
                continue;
            var problem = JSON.parse(this.problemCollectionObject[key]);
            if (problem.getStatus() === _Constants__WEBPACK_IMPORTED_MODULE_0__["Constants"].PROBLEM_STATUS_ACTIVE)
                activeCount++;
            if (problem.getStatus() === _Constants__WEBPACK_IMPORTED_MODULE_0__["Constants"].PROBLEM_STATUS_COMPLETE)
                completeCount++;
            total++;
        }
        this.activeProblemCount = activeCount;
        this.completeProblemCount = completeCount;
        this.totalProblemCount = total;
    };
    ProblemCollection.prototype.getActiveProblemCount = function () {
        return this.activeProblemCount;
    };
    ProblemCollection.prototype.getCompleteProblemCount = function () {
        return this.completeProblemCount;
    };
    ProblemCollection.prototype.getTotalProblemCount = function () {
        return this.totalProblemCount;
    };
    return ProblemCollection;
}());



/***/ }),

/***/ "./content-scripts/ProblemUtils.ts":
/*!*****************************************!*\
  !*** ./content-scripts/ProblemUtils.ts ***!
  \*****************************************/
/*! exports provided: ProblemUtils */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProblemUtils", function() { return ProblemUtils; });
/* harmony import */ var _Constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Constants */ "./content-scripts/Constants.ts");
/* harmony import */ var _Problem__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Problem */ "./content-scripts/Problem.ts");


var ProblemUtils = /** @class */ (function () {
    function ProblemUtils() {
    }
    ProblemUtils.prototype.extractProblemCode = function () {
        return Number($(_Constants__WEBPACK_IMPORTED_MODULE_0__["Constants"].PROBLEM_TITLE_SELECTOR).text().split('.')[0].trim());
    };
    ProblemUtils.prototype.extractProblemName = function () {
        return $(_Constants__WEBPACK_IMPORTED_MODULE_0__["Constants"].PROBLEM_TITLE_SELECTOR).text().split('.')[1].trim();
    };
    ProblemUtils.prototype.extractProblemUrl = function () {
        return new URL(location.href);
    };
    ProblemUtils.prototype.createProblemFromContext = function () {
        return new _Problem__WEBPACK_IMPORTED_MODULE_1__["Problem"](this.extractProblemCode(), this.extractProblemName(), this.extractProblemUrl(), []);
    };
    return ProblemUtils;
}());



/***/ }),

/***/ "./content-scripts/Session.ts":
/*!************************************!*\
  !*** ./content-scripts/Session.ts ***!
  \************************************/
/*! exports provided: Session */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Session", function() { return Session; });
/* harmony import */ var _Constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Constants */ "./content-scripts/Constants.ts");

var Session = /** @class */ (function () {
    function Session(id) {
        this.id = id;
        this.status = _Constants__WEBPACK_IMPORTED_MODULE_0__["Constants"].SESSION_STATUS_CREATED;
    }
    Session.prototype.setStatus = function () {
        if (this.endTimestamp)
            return _Constants__WEBPACK_IMPORTED_MODULE_0__["Constants"].SESSION_STATUS_COMPLETE;
        else if (this.initTimestamp)
            return _Constants__WEBPACK_IMPORTED_MODULE_0__["Constants"].SESSION_STATUS_ACTIVE;
        else
            return _Constants__WEBPACK_IMPORTED_MODULE_0__["Constants"].SESSION_STATUS_CREATED;
    };
    Session.prototype.start = function (startTimestamp) {
        if (startTimestamp === void 0) { startTimestamp = Date.now(); }
        if (this.status !== _Constants__WEBPACK_IMPORTED_MODULE_0__["Constants"].SESSION_STATUS_CREATED)
            throw new Error("Attempt to start a " + this.status + " session");
        this.initTimestamp = startTimestamp;
        this.status = _Constants__WEBPACK_IMPORTED_MODULE_0__["Constants"].SESSION_STATUS_ACTIVE;
        return this;
    };
    return Session;
}());



/***/ })

/******/ });