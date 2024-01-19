import { Callable, CallableConfig } from "../../../record/callable";
import { variableValidator } from "../../../utils/promptTemplateValidator/variableValidator";
import { BaseEvent, BaseEventParams } from "../../base";
export interface PromptTemplateParams extends BaseEventParams {
    /**
     * Clearly declare the input variables inside the template
     */
    inputVariables?: string[] | undefined;

    /**
     * the template string
     */
    template?: string | "";

    validator?: variableValidator | undefined;

    partialVariables?: string[] | undefined;
}

export class basePromptTemplate <
    CallInput = Record<string,any>,
    CallOutput = string,
    CallOptions extends CallableConfig = CallableConfig,
  >
  extends BaseEvent<CallInput, CallOutput, CallOptions>
  implements PromptTemplateParams
  {
    _namespace: string[];
    inputVariables?: string[] | undefined;
    template?: string | "";
    validator?: variableValidator | undefined;
    partialVariables?: string[] | undefined;

    constructor(fields?: Partial<PromptTemplateParams>){
        super(fields ?? {});
        this.inputVariables = fields?.inputVariables ?? this.inputVariables;
        this.template = fields?.template ?? this.template;
        this.validator = fields?.validator ?? this.validator;
        this.partialVariables = fields?.partialVariables ?? this.partialVariables;
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

    private validateInput(input: Record<string, any>): boolean{
        if (this.validator) {
            const validationResult = this.validator.validate(input);
            if (!validationResult.isValid) {
                // throw new Error(validationResult.errorMessage);
                return false;
            }
        }
        return true;
    }

    public addPrefix(prefix: string): void {
        if (this.template) {
            this.template = `${prefix}${this.template}`;
        } else {
            this.template = prefix;
        }
    }

    // Method to add a suffix to the template
    public addSuffix(suffix: string): void {
        if (this.template) {
            this.template += suffix;
        } else {
            this.template = suffix;
        }
    }
//    // Override the invoke method from Callable
//    async invoke(input: CallInput, options?: Partial<CallOptions>): Promise<CallOutput> {
//     // Convert CallInput to Record<string, string>
//     const inputRecord: Record<string, string> = this.convertToRecord(input);

//     // Call formatTemplate with the converted input
//     return this.formatTemplate(inputRecord);
// }

// // // Helper method to convert CallInput to Record<string, string>
// private convertToRecord(input: CallInput): Record<string, string> {
//     const record: Record<string, string> = {};
//     for (const key in input) {
//         if (input.hasOwnProperty(key)) {
//             // Assuming all values in input are string or can be converted to string
//             record[key] = String(input[key]);
//         }
//     }
//     return record;
// }
    public formatTemplate(inputValues?: Record<string, string>): string {
        if (inputValues == undefined){
            return "";
        }
        if (!this.validateInput(inputValues)){
            throw new Error("the validation for inputValue failed");
        }
        let formattedTemplate = this.template || "";
       // Iterate through each input variable and replace placeholders with actual values
        this.inputVariables?.forEach(variable => {
            if (inputValues.hasOwnProperty(variable)) {
                const regex = new RegExp(`\\{${variable}\\}`, 'g');
                formattedTemplate = formattedTemplate.replace(regex, inputValues[variable]);
            } else {
                // If a required variable is missing in the input, throw an error
                throw new Error(`Missing value for variable '${variable}'`);
            }
        }); 

        return formattedTemplate;
    }
  }


