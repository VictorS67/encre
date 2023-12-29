import { Callable, CallableConfig } from "../../../record/callable";
import { baseValidator } from "../../../utils/pValidators/baseValidator";
import { BaseEvent, BaseEventParams } from "../../base";
export interface PromptTemplateParams extends BaseEventParams {
    /**
     * Clearly declare the input variables inside the template
     */
    inputVariables?: string[];

    /**
     * the template string
     */
    template?: string | "";

    validators?: baseValidator | undefined;
}

export abstract class basePromptTemplate <
    CallInput = PromptTemplateParams,
    CallOutput = string[],
    CallOptions extends CallableConfig = CallableConfig,
  >
  extends BaseEvent<CallInput, CallOutput, CallOptions>
  implements PromptTemplateParams
  {
    inputVariables?: string[] | undefined;
    template?: string | "";

    constructor(fields?: Partial<PromptTemplateParams>){
        super(fields ?? {});
        this.inputVariables = fields?.inputVariables ?? this.inputVariables;
        this.template = fields?.template ?? this.template;

        if (this.template && this.inputVariables) {
            this.checkInputVariables(this.template, this.inputVariables);
        }
    }
    /**
     * To validate whether the inputVariables is valid
     * @param template 
     * @param inputVariables 
     */
    private checkInputVariables(template: string, inputVariables: string[]): void {
        const variablePattern = /\{([^}]+)\}/g;
        let match: RegExpExecArray | null;
        const foundVariables: Set<string> = new Set();

        while ((match = variablePattern.exec(template)) !== null) {
            foundVariables.add(match[1]);
        }

        inputVariables.forEach(variable => {
            if (!foundVariables.has(variable)) {
                throw new Error(`Variable '${variable}' is declared but not used in the template.`);
            }
        });
    }
  }


