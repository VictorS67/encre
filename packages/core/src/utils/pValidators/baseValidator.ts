import { Callable, CallableConfig } from "../../record/callable";

type ValidationFunction = (input: any) => boolean;
type ValidationResult = { isValid: boolean; errorMessage?: string };

interface ValidatorRules {
    default?: ValidationFunction;
    specific?: { [key: string]: ValidationFunction };
    exclude?: string[];
}

class Validator {
    private rules: ValidatorRules;

    constructor(rules: ValidatorRules = {}) {
        this.rules = rules;
    }

    // Adds a new specific validation rule
    addRule(key: string, validationFunction: ValidationFunction): void {
        if (!this.rules.specific) {
            this.rules.specific = {};
        }
        this.rules.specific[key] = validationFunction;
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
