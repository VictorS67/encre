import { expect, test, jest} from '@jest/globals';
import { stringify } from 'yaml';
import {
    Embeddings,
    EmbeddingsParams
} from '../base.js';


class TestEmbeddings extends Embeddings{
    async embedDocuments(documents: string[]): Promise<number[][]> {
        const listOfDocuments: number[][]  = [];
        for (const document of documents){
            listOfDocuments.push(await this.embedQuery(document));
        }
        return listOfDocuments;
    }

    async embedQuery(document: string): Promise<number[]> {
        return [Math.random(), Math.random()];
    }
}


test('two methods running ok', async () => {
   const documents = ["hello", "goodbye", "test", "its has been a pleasure"]
   // Empty parameters for initializing TestEmbeddings =
   const test = new TestEmbeddings({})
   const methodSpy = jest.spyOn(test, 'embedQuery');
   const resultsPromise = test.embedDocuments(documents)
   const results = await resultsPromise;
   // test whether there are four [X, y] values
   expect(results.length  == documents.length)
   expect(Array.isArray(results)).toBe(true); 
   // test whetehr there are 2 elements in first element
   for (const result of results) {
        expect(Array.isArray(result)).toBe(true); // Check if each element is an array
        expect(result).toHaveLength(2); // Check if each element has a length of 2
    }
   // test whether the method has been called
   expect(methodSpy).toHaveBeenCalled();
})