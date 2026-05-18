# Interview Questions Collection

This directory contains a comprehensive collection of interview questions covering various software engineering topics. Each question includes detailed requirements, test cases, and commented-out solutions.

## Table of Contents

### Algorithmic Questions
1. [Two Sum](#two-sum)
2. [Reverse a Linked List](#reverse-a-linked-list)
3. [Random Data Structure with O(1) Operations](#random-data-structure-with-o1-operations)
4. [Balanced Binary Tree](#balanced-binary-tree)
5. [Rate Limiter](#rate-limiter)
6. [IP Address Validation](#ip-address-validation)

### React Questions
7. [Custom Hook: useLocalStorage](#custom-hook-uselocalstorage)
8. [Form Validation Component](#form-validation-component)
9. [Data Fetching Component](#data-fetching-component)
10. [Todo App](#todo-app)

---

## Algorithmic Questions

### Two Sum

**File**: `src/two-sum.ts` | **Tests**: `tests/two-sum.test.ts`

**Problem**: Given an array of integers, find the two numbers that add up to a specific target.

**Key Concepts**:
- Hash Maps / Dictionaries
- Time Complexity: O(n)
- Space Complexity: O(n)

**Example**:
```
Input: nums = [2, 7, 11, 15], target = 9
Output: [0, 1]  // indices where nums[0] + nums[1] = 9
```

**Solution Approach** (commented out):
- Use a hash map to store values seen so far
- For each number, calculate complement = target - current
- Check if complement exists in hash map
- Return indices when found

---

### Reverse a Linked List

**File**: `src/reverse-linked-list.ts` | **Tests**: `tests/reverse-linked-list.test.ts`

**Problem**: Implement a function that reverses a linked list in-place.

**Key Concepts**:
- Linked List manipulation
- Three-pointer technique
- Time Complexity: O(n)
- Space Complexity: O(1)

**Example**:
```
Input:  1 -> 2 -> 3 -> 4 -> 5 -> null
Output: 5 -> 4 -> 3 -> 2 -> 1 -> null
```

**Solution Approach** (commented out):
- Use three pointers: prev, current, next
- Iterate through the list
- Reverse direction of links by updating current.next = prev
- Move pointers forward

---

### Random Data Structure with O(1) Operations

**File**: `src/random-data-structure.ts` | **Tests**: `tests/random-data-structure.test.ts`

**Problem**: Design a data structure supporting insert, remove, and getRandom operations in O(1) time.

**Key Concepts**:
- Hash Maps and Arrays combined
- Trade-offs between data structures
- Random selection with equal probability

**Operations**:
- `insert(val: number): boolean` - Returns false if value exists
- `remove(val: number): boolean` - Returns false if value doesn't exist
- `getRandom(): number` - Return random element with uniform distribution

**Solution Approach** (commented out):
- Combine Array (for random access) and Map (for lookup)
- Use Map to store value -> index mapping
- Swap removed element with last element
- Remove last element from array

---

### Balanced Binary Tree

**File**: `src/is-balanced-tree.ts` | **Tests**: `tests/is-balanced-tree.test.ts`

**Problem**: Determine if a binary tree is balanced (depth of subtrees never differs by more than 1).

**Key Concepts**:
- Binary Tree traversal
- Depth-First Search (DFS)
- Post-order traversal
- Time Complexity: O(n)
- Space Complexity: O(h) where h is height

**Solution Approach** (commented out):
- Use DFS to check height and balance condition
- Return -1 if subtree is unbalanced
- Check if left and right heights differ by more than 1
- Return height of balanced subtree

---

### Rate Limiter

**File**: `src/rate-limiter.ts` | **Tests**: `tests/rate-limiter.test.ts`

**Problem**: Design a rate limiter that allows at most N requests per minute for each user.

**Key Concepts**:
- Sliding window algorithm
- Token bucket algorithm
- Time-based tracking
- User-based quota management

**Two Implementations**:
1. **Sliding Window**: Track exact timestamps of requests
   - Accurate but uses more memory
   - Better for short windows

2. **Token Bucket**: Allows bursts up to limit
   - More scalable
   - Better for distributed systems

**Solution Approach** (commented out):
- Maintain array of request timestamps per user
- Remove timestamps outside window on each request
- Check if count < maxRequests before allowing
- Add current timestamp to array

---

### IP Address Validation

**File**: `src/ip-address-validation.ts` | **Tests**: `tests/ip-address-validation.test.ts`

**Problem**: Given a string of digits, return all valid IP addresses that can be formed.

**Key Concepts**:
- Backtracking algorithm
- String manipulation
- Validation rules
- Time Complexity: O(3^4) = O(81)

**Validation Rules**:
- Each part must be 0-255
- No leading zeros (except "0" itself)
- Must form exactly 4 parts

**Example**:
```
Input: "25525511135"
Output: ["255.255.11.135", "255.255.111.35"]
```

**Solution Approach** (commented out):
- Use backtracking to try all combinations
- For each position, try taking 1-3 characters
- Validate each part before recursing
- When 4 parts formed and all digits used, add to result

---

## React Questions

### Custom Hook: useLocalStorage

**File**: `src/hooks/useLocalStorage.ts` | **Tests**: `tests/useLocalStorage.test.ts`

**Problem**: Create a custom React hook for convenient localStorage interaction.

**Key Concepts**:
- React hooks (useState, useEffect, useCallback)
- localStorage API
- JSON serialization
- Event listeners across tabs
- SSR handling

**API**:
```typescript
const [value, setValue, removeValue] = useLocalStorage<T>(key, initialValue);
```

**Features**:
- Automatic serialization/deserialization
- Sync across tabs/windows via storage events
- Handles corrupted data gracefully
- Works with SSR (no window errors)
- Memory leak prevention

**Solution Approach** (commented out):
- Initialize state from localStorage
- Create setter that updates both state and localStorage
- Listen for storage changes from other tabs
- Handle JSON parse errors
- Cleanup event listeners

---

### Form Validation Component

**File**: `src/react-interviews/FormValidation.tsx` | **Tests**: `tests/FormValidation.test.tsx`

**Problem**: Create a controlled form component with real-time validation.

**Key Concepts**:
- Controlled components
- React hooks (useState, useEffect, useCallback, useMemo)
- Form validation
- Error handling
- Accessibility

**Features**:
- Email validation
- Password validation (min 8 chars)
- Password confirmation
- Optional age field
- Real-time error display
- Submit button disabled state
- Accessibility features (ARIA)

**Validation Rules**:
- Email: required, valid format
- Password: required, min 8 characters
- Confirm Password: must match password
- Age: optional, >= 18 if provided

**Solution Approach** (commented out):
- Use useState for form data, errors, and touched fields
- Create validation functions for each field
- Track touched fields to show errors appropriately
- Disable submit button when form invalid
- Show success message on valid submission

---

### Data Fetching Component

**File**: `src/react-interviews/UserDataFetcher.tsx` | **Tests**: `tests/UserDataFetcher.test.tsx`

**Problem**: Create a component that fetches data with loading and error states.

**Key Concepts**:
- useEffect for side effects
- Async/await patterns
- Loading and error state management
- Memory leak prevention
- Retry logic

**Features**:
- Fetches user data from API
- Loading state display
- Error handling with retry
- Retry count display
- Cleanup on unmount
- Handles component unmounting during fetch

**Solution Approach** (commented out):
- Use useEffect to trigger fetch on mount/prop change
- Use isMounted flag to prevent state updates after unmount
- Track loading and error states
- Display appropriate UI based on state
- Implement retry with counter

---

### Todo App

**File**: `src/react-interviews/TodoApp.tsx` | **Tests**: `tests/TodoApp.test.tsx`

**Problem**: Build a complete Todo application with CRUD operations.

**Key Concepts**:
- Component composition
- State management
- Props and TypeScript interfaces
- List rendering with keys
- useMemo and useCallback optimization
- Filter and search functionality

**Features**:
- Add new todos
- Mark as complete/incomplete
- Edit existing todos
- Delete todos
- Filter (All, Active, Completed)
- Show statistics (total, active, completed)
- In-place list editing

**CRUD Operations**:
- **Create**: Add new todo via form
- **Read**: Display todos in list
- **Update**: Edit todo text, toggle completion status
- **Delete**: Remove todo

**Follow-up Questions**:
- Optimization for large lists (React.memo, useMemo)
- Integration with async storage (database)
- State management with Redux/Context API
- Undo/redo functionality
- Sorting and priority levels
- Due dates and reminders

**Solution Approach** (commented out):
- Use useState for todos, input, filter, and edit state
- Create callbacks for add, toggle, delete, edit operations
- Use useMemo for filtered todos based on filter
- Calculate stats with useMemo
- Render list with proper keys

---

## Running Tests

All test files use Bun test framework. To run tests:

```bash
# Run all tests
bun test

# Run specific test file
bun test tests/two-sum.test.ts

# Run tests in watch mode
bun test --watch
```

## Implementation Guide

Each question file contains:

1. **Detailed Problem Statement** - Objective and requirements
2. **TypeScript Interfaces** - Type definitions for the problem
3. **Stub Function** - Empty function to implement
4. **Commented Solution** - Complete implementation as reference
5. **Helper Functions** - Utilities for testing/validation

To implement a question:

1. Read the problem statement and requirements
2. Study the test cases in the corresponding test file
3. Implement the solution in the source file
4. Uncomment the solution to verify test passage
5. Comment out the solution again to present as exercise

## Complexity Cheat Sheet

### Time Complexity (Worst Case)
- O(1) - Constant
- O(log n) - Binary search
- O(n) - Linear search
- O(n log n) - Efficient sorting
- O(n²) - Bubble/insertion sort
- O(n³) - Triple nested loops
- O(2ⁿ) - Exponential/recursive
- O(n!) - Permutations

### Space Complexity
- O(1) - Constant space
- O(n) - Linear space
- O(log n) - Recursion depth
- O(n²) - 2D array

---

## Interview Tips

1. **Ask clarifying questions** - Understand the full problem before coding
2. **Discuss trade-offs** - Time vs space, readability vs optimization
3. **Start with brute force** - Then optimize
4. **Test edge cases** - Empty, single, large datasets, negatives
5. **Explain your approach** - Think aloud during the interview
6. **Consider alternative solutions** - Show problem-solving flexibility
7. **Optimize for readability** - Clean code is important
8. **Handle errors gracefully** - Don't assume perfect input

---

## Additional Resources

- [LeetCode](https://leetcode.com/) - Practice coding problems
- [HackerRank](https://www.hackerrank.com/) - Coding challenges
- [JavaScript.info](https://javascript.info/) - JavaScript fundamentals
- [React Documentation](https://react.dev/) - React best practices
- [Big O Notation](https://www.bigocheatsheet.com/) - Complexity analysis
