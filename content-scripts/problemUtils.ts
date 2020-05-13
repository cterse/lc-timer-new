import { Constants } from "./Constants";
import { Problem } from "./Problem";

export class ProblemUtils {
    extractProblemCode(): number {
        return Number($( Constants.PROBLEM_TITLE_SELECTOR ).text().split('.')[0].trim());
    }
    
    private extractProblemName(): string {
        return $( Constants.PROBLEM_TITLE_SELECTOR ).text().split('.')[1].trim();
    }
    
    private extractProblemUrl(): URL {
        return new URL(location.href);
    }
    
    createProblemFromContext(): Problem {
        return new Problem(this.extractProblemCode(), this.extractProblemName(), this.extractProblemUrl(), []);
    }
}
