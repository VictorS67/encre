import { expect, jest, test } from '@jest/globals';
import { BasePromptTemplate } from '../base';
import { variableValidator } from '../../../../utils/promptTemplateValidator/variableValidator';
test('declare not exist input variables', async () =>{
    const inputVariables = ['usedVariable', 'unusedVariable'];
    const template = 'This is a template with {{usedVariable}}';
    expect(() =>{
        new BasePromptTemplate({
            template: template,
            inputVariables: inputVariables
        })
    }).toThrow('Variable \'unusedVariable\' is declared but not used in the template.');
});
test('validator', async() => {
    const isString = (s) => typeof s === 'string';
    let validator;
    validator = new variableValidator(['name']);
    validator.addSpecificRule('name', isString);
    const promptTemplate = new BasePromptTemplate({
        template: "{{name}}",
        inputVariables: ["name"],
        validator:validator
    });
    await expect(promptTemplate.invoke({'name': 1})).rejects.toThrow("the validation for inputValue failed");
});
test('addPrefix and addSuffix methods', async () => {
    const promptTemplate = new BasePromptTemplate({
        template: "{{name}}",
        inputVariables: ["name"]
    });
    promptTemplate.addPrefix("Hello, ");
    promptTemplate.addSuffix("!");
    const formattedString = await promptTemplate.invoke({ name: "Alice" });
    expect(formattedString).toBe("Hello, Alice!");
});
test('addPrefix and addSuffix methods', async () => {
    const promptTemplate = new BasePromptTemplate({
        template: "{{name}}",
        inputVariables: ["name"]
    });
    promptTemplate.addPrefix("Hello, ");
    promptTemplate.addSuffix("!");
    const formattedString = await promptTemplate.invoke({ name: "Alice" });
    expect(formattedString).toBe("Hello, Alice!");
});