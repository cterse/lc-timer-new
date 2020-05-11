import { Constants } from "./Constants";
export function extractProblemCode() {
    return Number($(Constants.PROBLEM_TITLE_SELECTOR).text().split('.')[0].trim());
}
export function extractProblemName() {
    return $(Constants.PROBLEM_TITLE_SELECTOR).text().split('.')[1].trim();
}
export function extractProblemUrl() {
    return new URL(location.href);
}
