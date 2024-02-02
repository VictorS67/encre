import { expect, jest, test } from '@jest/globals';
import { basePromptTemplate } from '../base';
import { variableValidator } from '../../../../utils/promptTemplateValidator/variableValidator';
test('declare not exist input variables', async () =>{
    const inputVariables = ['usedVariable', 'unusedVariable'];
    const template = 'This is a template with {{usedVariable}}';
    expect(() =>{
        new basePromptTemplate({
            template: template,
            inputVariables: inputVariables
        })
    }).toThrow('Variable \'unusedVariable\' is declared but not used in the template.');
});
// test('validator', async() => {
//     const isString = (s) => typeof s === 'string';
//     let validator;
//     validator = new variableValidator(['name']);
//     validator.addSpecificRule('name', isString);
//     const promptTemplate = new basePromptTemplate({
//         template: "{name}",
//         inputVariables: ["name"]
//         validator:validatot
//     });
//     await expect(promptTemplate.invoke({'name': 1})).rejects.toThrow("the validation for inputValue failed");
// });
test('addPrefix and addSuffix methods', async () => {
    const promptTemplate = new basePromptTemplate({
        template: "{{name}}",
        inputVariables: ["name"]
    });
    promptTemplate.addPrefix("Hello, ");
    promptTemplate.addSuffix("!");
    const formattedString = await promptTemplate.invoke({ name: "Alice" });
    expect(formattedString).toBe("Hello, Alice!");
});
test('addPrefix and addSuffix methods', async () => {
    const promptTemplate = new basePromptTemplate({
        template: "{{name}}",
        inputVariables: ["name"]
    });
    promptTemplate.addPrefix("Hello, ");
    promptTemplate.addSuffix("!");
    const formattedString = await promptTemplate.invoke({ name: "Alice" });
    expect(formattedString).toBe("Hello, Alice!");
});