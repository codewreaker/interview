//import { deepcopy } from './deepcopy';
import { deepcopy } from './v2/deepcopy';

function assert(condition: boolean, message: string): void {
    console.log(`\x1b[1m\x1b[33mRunning Test:\x1b[0m ${message.replace('Failed: ', 'Test:')}`);
    if (!condition) {
        throw new Error(message);
    }
}


function testDeepcopy() {
    console.log('\x1b[1m\x1b[34mStarting Deep Copy Tests...\x1b[0m');
    // Test primitive values
    assert(deepcopy(42) === 42, 'Failed: Primitive number');
    assert(deepcopy('hello') === 'hello', 'Failed: Primitive string');
    assert(deepcopy(true) === true, 'Failed: Primitive boolean');
    assert(deepcopy(null) === null, 'Failed: Primitive null');
    assert(deepcopy(undefined) === undefined, 'Failed: Primitive undefined');

    // Test arrays
    const array = [1, 2, 3, [4, 5]];
    const arrayCopy = deepcopy(array);
    assert(JSON.stringify(arrayCopy) === JSON.stringify(array), 'Failed: Array deep copy');
    assert(arrayCopy !== array, 'Failed: Array reference equality');
    assert(arrayCopy[3] !== array[3], 'Failed: Nested array reference equality');

    // Test objects
    const obj = { a: 1, b: { c: 2, d: 3 } };
    const objCopy = deepcopy(obj);
    assert(JSON.stringify(objCopy) === JSON.stringify(obj), 'Failed: Object deep copy');
    assert(objCopy !== obj, 'Failed: Object reference equality');
    assert(objCopy.b !== obj.b, 'Failed: Nested object reference equality');


    // Test functions
    const func = function () { return 42; };
    const funcCopy = deepcopy(func);
    assert(funcCopy === func, 'Failed: Function copy');
}

testDeepcopy();
console.log('All tests passed!');