import { Callable, CallableConfig } from "../../record/callable";

type ValidationFunction = (input: any) => boolean;
type ValidationResult = { isValid: boolean; errorMessage?: string };

interface ValidatorRules {
    default?: ValidationFunction;
    specific?: { [key: string]: ValidationFunction };
    exclude?: string[];
}

export class baseValidator {
    private rules: ValidatorRules;
    private validatableVariables: Set<string>;
    constructor(validatableVariables: string[], rules: ValidatorRules = {}) {
        this.validatableVariables = new Set(validatableVariables);
        this.rules = rules;
    }
    
    //get the attributes of baseValidator class
    getAttributes(): object {
        return {
            validatableVariables: Array.from(this.validatableVariables),
            rules: this.rules,
        };
    }

    private hasDefaultRule(key: string): boolean | undefined {
        return this.rules.default && !this.rules.exclude?.includes(key);
    }

     // Function to add a variable to the exclude list
     addExcludeVariable(variable: string): void {
        if (!this.rules.exclude) {
            this.rules.exclude = [];
        }
        if (!this.rules.exclude.includes(variable)) {
            this.rules.exclude.push(variable);
        }
    }

    // Function to remove a variable from the exclude list
    removeExcludeVariable(variable: string): void {
        if (this.rules.exclude) {
            this.rules.exclude = this.rules.exclude.filter(v => v !== variable);
        }
    }

    // Adds a new specific validation rule
    addSpecificRule(key: string, validationFunction: ValidationFunction): void {
        if (!this.validatableVariables.has(key)) {
            throw new Error(`Rule addition failed: '${key}' is not a validatable variable.`);
        }
        if (this.rules.specific?.[key]) {
            throw new Error(`Conflict detected: A rule for '${key}' conflicts with another specific rule.`);
        }
        if (this.hasDefaultRule(key)) {
            throw new Error(`Conflict detected: A rule for '${key}' conflicts with a default rule.`);
        }
        if (!this.rules.specific) {
            this.rules.specific = {};
        }
        this.rules.specific[key] = validationFunction;
    }

    // Function to remove a specific rule for a given variable
    removeSpecificRule(variable: string): void {
        if (!this.rules.specific || !this.rules.specific[variable]) {
            throw new Error(`No specific rule exists for variable '${variable}'`);
        }

        delete this.rules.specific[variable];
    }

    // Validates a given input object based on the added rules
    validate(input: Record<string, any>): ValidationResult {
        for (const key in input) {
            if (this.rules.exclude?.includes(key)) {
                continue;
            }

            const specificRule = this.rules.specific?.[key];
            const ruleToApply = specificRule || this.rules.default;

            if (ruleToApply && !ruleToApply(input[key])) {
                return { isValid: false, errorMessage: `Validation failed for ${key}` };
            }
        }
        return { isValid: true };
    }
}

