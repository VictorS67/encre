import { expect, jest, test } from '@jest/globals';
import { basePromptTemplate } from '../base';
import { variableValidator } from '../../../../utils/promptTemplateValidator/variableValidator';


test('formatTemplate returns correct string', () => {
    const promptTemplate = new basePromptTemplate({
        template: "{greeting}, {name}!",
        inputVariables: ["greeting", "name"],
    });
    const formattedString = promptTemplate.formatTemplate({ greeting: "Hello", name: "World" });
    expect(formattedString).toBe("Hello, World!");
});

test('formatTemplate with empty template string', () => {
    const promptTemplate = new basePromptTemplate({
        template: "",
        inputVariables: ["greeting", "name"]
    });
    const formattedString = promptTemplate.formatTemplate({ greeting: "Hello", name: "Alice" });
    expect(formattedString).toBe("");
});

test('formatTemplate with undefined input variables', () => {
    const promptTemplate = new basePromptTemplate({
        template: "{greeting}, {name}!",
        inputVariables: ["greeting", "name"]
    });
    const formattedString = promptTemplate.formatTemplate();
    expect(formattedString).toBe("");
});

test('formatTemplate with extra unused variables', () => {
    const promptTemplate = new basePromptTemplate({
        template: "Hello, {name}!",
        inputVariables: ["name"]
    });
    const formattedString = promptTemplate.formatTemplate({ name: "Bob", age: 30 });
    expect(formattedString).toBe("Hello, Bob!");
});

test('formatTemplate with missing required variables', () => {
    const promptTemplate = new basePromptTemplate({
        template: "{greeting}, {name}!",
        inputVariables: ["greeting", "name"]
    });
    expect(() => {
        promptTemplate.formatTemplate({ greeting: "Hello" });
    }).toThrow(Error);
});

test('addPrefix and addSuffix methods', () => {
    const promptTemplate = new basePromptTemplate({
        template: "{name}",
        inputVariables: ["name"]
    });
    promptTemplate.addPrefix("Hello, ");
    promptTemplate.addSuffix("!");
    const formattedString = promptTemplate.formatTemplate({ name: "Alice" });
    expect(formattedString).toBe("Hello, Alice!");
});