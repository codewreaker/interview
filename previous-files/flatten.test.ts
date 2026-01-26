//import { flatten } from "./flatten";
import { flatten } from "./v2/flatten";

function assert(condition: boolean, message: string, input: any, expected: any, got?:any): void {
    console.log(`\x1b[1m\x1b[33mRunning Test:\x1b[0m ${message.replace('Failed: ', 'Test:')}`);
    if (!condition) {
        console.error('\x1b[31mTest Failed!\x1b[0m');
        console.error('Input:', JSON.stringify(input));
        console.error('Expected:', JSON.stringify(expected));
        got &&  console.error('Got:', JSON.stringify(got));
        throw new Error(message);
    } else {
        console.log('\x1b[32mTest Passed!\x1b[0m');
        console.log('Input:', JSON.stringify(input));
        console.log('Expected:', JSON.stringify(expected));
        got &&  console.log('Got:', JSON.stringify(got));
    }
}

function testFlatten() {
    console.log('\x1b[1m\x1b[34mStarting Flatten Function Tests...\x1b[0m');

    // Test: flattens a nested array
    const input1 = [1, [2, [3, 4], 5], 6];
    const output1 = [1, 2, 3, 4, 5, 6];
    assert(JSON.stringify(flatten(input1)) === JSON.stringify(output1), 'Failed: Flattens a nested array', input1, output1, flatten(input1));

    // Test: handles already flat arrays
    const input2 = [1, 2, 3];
    const output2 = [1, 2, 3];
    assert(JSON.stringify(flatten(input2)) === JSON.stringify(output2), 'Failed: Handles already flat arrays', input2, output2, flatten(input2));

    // Test: handles empty arrays
    const input3: any[] = [];
    const output3: any[] = [];
    assert(JSON.stringify(flatten(input3)) === JSON.stringify(output3), 'Failed: Handles empty arrays', input3, output3);

    // Test: handles deeply nested arrays
    const input4 = [1, [2, [3, [4, [5]]]]];
    const output4 = [1, 2, 3, 4, 5];
    assert(JSON.stringify(flatten(input4)) === JSON.stringify(output4), 'Failed: Handles deeply nested arrays', input4, output4);

    // Test: flattens an array of objects
    const input5 = [{ a: 1 }, [{ b: 2 }, { c: 3 }], { d: 4 }];
    const output5 = [{ a: 1 }, { b: 2 }, { c: 3 }, { d: 4 }];
    assert(JSON.stringify(flatten(input5)) === JSON.stringify(output5), 'Failed: Flattens an array of objects', input5, output5);

    // Test: flattens an object with array values
    const input6 = [{ a: [1, 2] }, [{ b: [3, 4] }], { c: [5] }];
    const output6 = [{ a: [1, 2] }, { b: [3, 4] }, { c: [5] }];
    assert(JSON.stringify(flatten(input6)) === JSON.stringify(output6), 'Failed: Flattens an object with array values', input6, output6);

    // Additional Test: handles mixed data types
    const input7 = [1, "string", [true, [null, undefined]], { key: "value" }];
    const output7 = [1, "string", true, null, undefined, { key: "value" }];
    assert(JSON.stringify(flatten(input7)) === JSON.stringify(output7), 'Failed: Handles mixed data types', input7, output7);

    // Additional Test: handles arrays with no nested elements
    const input8 = [1, 2, 3, 4, 5];
    const output8 = [1, 2, 3, 4, 5];
    assert(JSON.stringify(flatten(input8)) === JSON.stringify(output8), 'Failed: Handles arrays with no nested elements', input8, output8);

    // Additional Test: handles deeply nested empty arrays
    const input9 = [1, [2, [], [3, [4, []]]]];
    const output9 = [1, 2, 3, 4];
    assert(JSON.stringify(flatten(input9)) === JSON.stringify(output9), 'Failed: Handles deeply nested empty arrays', input9, output9);

    // Additional Test: handles arrays with only empty arrays
    const input10 = [[], [[]], [[[]]]];
    const output10: any[] = [];
    assert(JSON.stringify(flatten(input10)) === JSON.stringify(output10), 'Failed: Handles arrays with only empty arrays', input10, output10);
}
testFlatten();
console.log('All tests passed!');