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
    CallInput extends Record<string, any>,
    CallOutput extends string,
    CallOptions extends CallableConfig = CallableConfig,
  >
  extends BaseEvent<Record<string,any>, string, CallOptions>
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
            this.isInputExists(this.template, this.inputVariables);
        }
    }
    /**
     * To validate whether the inputVariables is valid
     * @param template
     * @param inputVariables 
     */
    private isInputExists(template: string, inputVariables: string[]): void {
        const variablePattern = /\{\{([^}]+)\}\}/g;
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

    private validateInput(input: CallInput): boolean{
        if (this.validator) {
            const validationResult = this.validator.validate(input);
            if (!validationResult.isValid) {
                // throw new Error(validationResult.errorMessage);
                return false;
            }
        }
        return true;
    }

    public getTemplate() : string{
        if (!this.template){
            return "";
        }
        return this.template;
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

    async invoke(input: CallInput, options?: Partial<CallOptions>): Promise<CallOutput> {
        // log('invoke called');
        if (!this.validateInput(input)){
            // log('not valid');
            throw new Error("the validation for inputValue failed");
        } 
        
        let formattedTemplate = this.template || "";
        // Iterate through each input variable and replace placeholders with actual values
         this.inputVariables?.forEach(async variable => {
             if (variable in input) {
                const regex = new RegExp(`\\{\\{${variable}\\}\\}`, 'g');
                 formattedTemplate = formattedTemplate.replace(regex, input[variable]);
             } else {
                 // If a required variable is missing in the input, throw an error
                 throw new Error(`Missing value for variable '${variable}'`);
             }
         }); 
         return formattedTemplate as CallOutput;
    }
  }


