import { Callable } from "../../../record/callable";
import { baseValidator } from "../../../utils/pValidators/baseValidator";
type PromptTemplateArgs = {
    inputVariables?: string[];
    template: string;
};

export abstract class pTemplateBase {

    private inputVariables: string[];
    private template: string;

    constructor(args: PromptTemplateArgs) {
        this.inputVariables= args.inputVariables? args.inputVariables : [];
        this.template = args.template;
    }

    async format(values: { [key: string]: string }): Promise<string> {
        let formattedTemplate = this.template;
        
        for (const variable of this.inputVariables) {
            const value = values[variable];
            if (value) {
                formattedTemplate = formattedTemplate.replace(`{${variable}}`, value);
            }
        }

        return formattedTemplate;
    }
}

