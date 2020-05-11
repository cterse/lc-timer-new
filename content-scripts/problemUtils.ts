import { Constants } from "./Constants";
import { Problem, ProblemBuilder } from "./Problem";

export function extractProblemCode(): number {
    return Number($( Constants.PROBLEM_TITLE_SELECTOR ).text().split('.')[0].trim());
}

export function extractProblemName(): string {
    return $( Constants.PROBLEM_TITLE_SELECTOR ).text().split('.')[1].trim();
}

export function extractProblemUrl(): URL {
    return new URL(location.href);
}
