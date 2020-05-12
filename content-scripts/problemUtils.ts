import { Constants } from "./Constants";
import { Problem, ProblemBuilder } from "./Problem";

export class ProblemUtils {
    private extractProblemCode(): number {
        return Number($( Constants.PROBLEM_TITLE_SELECTOR ).text().split('.')[0].trim());
    }
    
    private extractProblemName(): string {
        return $( Constants.PROBLEM_TITLE_SELECTOR ).text().split('.')[1].trim();
    }
    
    private extractProblemUrl(): URL {
        return new URL(location.href);
    }
    
    createProblemFromContext(): Problem {
        let problemCode = this.extractProblemCode();
        if (!problemCode) {
            console.error("ProblemUtils:createProblemFromContext :: error generating problem id");
            return null;
        }
    
        return new Problem(problemCode, this.extractProblemName(), this.extractProblemUrl(), []);
    }
}
