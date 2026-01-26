//@ts-check

// import './array-methods'
import './v2/array-methods'

function assert(condition: boolean, message: string, input: any, expected: any, got?:any): void {
    console.log(`\x1b[1m\x1b[33mRunning Test:\x1b[0m ${message.replace('Failed: ', 'Test:')}`);
    if (!condition) {
        console.error('\x1b[31mTest Failed!\x1b[0m');
        console.error('Input:', JSON.stringify(input));
        console.error('Expected:', JSON.stringify(expected));
        got && console.error('Got:', JSON.stringify(got));
        throw new Error(message);
    } else {
        console.log('\x1b[32mTest Passed!\x1b[0m');
        console.log('Input:', JSON.stringify(input));
        console.log('Expected:', JSON.stringify(expected));
    }
}

function testMyMap() {
    console.log('Testing Array.prototype.myMap...');

    // Test 1: Apply the callback to each element and return a new array
    const arr1 = [1, 2, 3];
    const result1 = arr1.myMap((x) => x * 2);
    assert(
        JSON.stringify(result1) === JSON.stringify([2, 4, 6]),
        'Map should apply callback to each element',
        arr1,
        [2, 4, 6],
        result1
    );

    // Test 2: Pass the correct arguments to the callback
    const arr2 = [1];
    arr2.myMap((value, index, array) => {
        assert(value === 1, 'Map callback should receive correct value', value, 1);
        assert(index === 0, 'Map callback should receive correct index', index, 0);
        assert(array === arr2, 'Map callback should receive original array', array);
    });

    // Test 3: Do not mutate the original array
    const arr3 = [1, 2, 3];
    arr3.myMap((x) => x * 2);
    assert(
        JSON.stringify(arr3) === JSON.stringify([1, 2, 3]),
        'Map should not mutate original array',
        arr3,
        [1, 2, 3]
    );

    console.log('Array.prototype.myMap tests passed!');
}

function testMyFilter() {
    console.log('Testing Array.prototype.myFilter...');

    // Test 1: Filter elements based on the callback condition
    const arr1 = [1, 2, 3, 4];
    const result1 = arr1.myFilter((x) => x % 2 === 0);
    assert(
        JSON.stringify(result1) === JSON.stringify([2, 4]),
        'Filter should return elements that pass the condition',
        arr1,
        [2, 4],
        result1
    );

    // Test 2: Pass the correct arguments to the callback
    const arr2 = [1];
    arr2.myFilter((value, index, array) => {
        assert(value === 1, 'Filter callback should receive correct value', value, 1);
        assert(index === 0, 'Filter callback should receive correct index', index, 0);
        assert(array === arr2, 'Filter callback should receive original array', array, arr2);
        return true;
    });

    // Test 3: Do not mutate the original array
    const arr3 = [1, 2, 3];
    arr3.myFilter((x) => x > 1);
    assert(
        JSON.stringify(arr3) === JSON.stringify([1, 2, 3]),
        'Filter should not mutate original array',
        arr3,
        [1, 2, 3]
    );

    console.log('Array.prototype.myFilter tests passed!');
}

function testMyReduce() {
    console.log('Testing Array.prototype.myReduce...');

    // Test 1: Reduce the array to a single value
    const arr1 = [1, 2, 3, 4];
    const result1 = arr1.myReduce((acc, curr) => acc + curr, 0);
    assert(
        result1 === 10,
        'Reduce should sum all elements correctly',
        arr1,
        10
    );

    // Test 2: Use the first element as the initial value if none is provided
    const arr2 = [1, 2, 3];
    const result2 = arr2.myReduce((acc, curr) => acc + curr);
    assert(
        result2 === 6,
        'Reduce should work without initial value',
        arr2,
        6
    );

    // Test 3: Pass the correct arguments to the callback
    const arr3 = [1, 2];
    arr3.myReduce((acc, curr, index, array) => {
        if (index === 1) {
            assert(acc === 1, 'Reduce callback should receive correct accumulator', acc, 1);
            assert(curr === 2, 'Reduce callback should receive correct current value', curr, 2);
            assert(array === arr3, 'Reduce callback should receive original array', array, arr3);
        }
        return acc + curr;
    });

    // Test 4: Do not mutate the original array
    const arr4 = [1, 2, 3];
    arr4.myReduce((acc, curr) => acc + curr, 0);
    assert(
        JSON.stringify(arr4) === JSON.stringify([1, 2, 3]),
        'Reduce should not mutate original array',
        arr4,
        [1, 2, 3]
    );

    console.log('Array.prototype.myReduce tests passed!');
}

// Run all tests
testMyMap();
testMyFilter();
testMyReduce();