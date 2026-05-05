# Interview Questions - Quick Reference

## File Organization

### Algorithmic Questions (TypeScript)
```
src/
├── two-sum.ts                    ← Two sum problem
├── reverse-linked-list.ts        ← Reverse linked list
├── random-data-structure.ts      ← O(1) insert/remove/getRandom
├── is-balanced-tree.ts           ← Check if tree is balanced
├── rate-limiter.ts               ← Rate limiter implementation
└── ip-address-validation.ts      ← IP address from digits

tests/
├── two-sum.test.ts
├── reverse-linked-list.test.ts
├── random-data-structure.test.ts
├── is-balanced-tree.test.ts
├── rate-limiter.test.ts
└── ip-address-validation.test.ts
```

### React Questions (React/TypeScript)
```
src/
└── hooks/
    └── useLocalStorage.ts        ← Custom localStorage hook

src/
└── react-interviews/
    ├── FormValidation.tsx        ← Form with real-time validation
    ├── UserDataFetcher.tsx       ← Data fetching with error handling
    └── TodoApp.tsx               ← Full-featured Todo application

tests/
├── useLocalStorage.test.ts
├── FormValidation.test.tsx
├── UserDataFetcher.test.tsx
└── TodoApp.test.tsx
```

## Questions Summary

| # | Question | Difficulty | Topics | Time |
|---|----------|-----------|--------|------|
| 1 | Two Sum | Easy | Hash Maps, Arrays | 15 min |
| 2 | Reverse Linked List | Easy | Linked Lists, Pointers | 15 min |
| 3 | Random O(1) Data Structure | Medium | Hash Maps, Arrays, Design | 30 min |
| 4 | Balanced Binary Tree | Easy | Trees, DFS, Recursion | 20 min |
| 5 | Rate Limiter | Medium | Design, Algorithms | 30 min |
| 6 | IP Address Validation | Medium | Backtracking, Strings | 25 min |
| 7 | useLocalStorage Hook | Medium | React Hooks, APIs | 30 min |
| 8 | Form Validation | Medium | React, State, Validation | 35 min |
| 9 | Data Fetching | Easy | React, Effects, Async | 25 min |
| 10 | Todo App | Hard | React, State Mgmt, CRUD | 45 min |

## Quick Access

### By Difficulty Level

**Easy** (Start here)
- `two-sum.ts` - Classic hash map problem
- `reverse-linked-list.ts` - Fundamental linked list operation
- `is-balanced-tree.ts` - Tree traversal basics
- `UserDataFetcher.tsx` - Basic React patterns

**Medium** (Next)
- `random-data-structure.ts` - Creative problem-solving
- `rate-limiter.ts` - System design
- `ip-address-validation.ts` - Backtracking
- `useLocalStorage.ts` - React hooks fundamentals
- `FormValidation.tsx` - Real-world component

**Hard** (Challenge)
- `TodoApp.tsx` - Full application with complex state

### By Topic

**Data Structures**
- Arrays & Hash Maps: `two-sum.ts`
- Linked Lists: `reverse-linked-list.ts`
- Custom Structures: `random-data-structure.ts`
- Trees: `is-balanced-tree.ts`

**Algorithms**
- Backtracking: `ip-address-validation.ts`
- Design Patterns: `rate-limiter.ts`
- DFS/BFS: `is-balanced-tree.ts`

**React**
- Hooks: `useLocalStorage.ts`
- Forms: `FormValidation.tsx`
- Effects: `UserDataFetcher.tsx`
- State Management: `TodoApp.tsx`

## Test Statistics

- **Total Test Files**: 10
- **Total Test Cases**: 100+
- **Test Framework**: Bun (with jest-style assertions)
- **Coverage**: Comprehensive edge case coverage

## Running the Tests

```bash
# Run all tests
bun test

# Run tests for specific question
bun test tests/two-sum.test.ts

# Run with coverage
bun test --coverage

# Watch mode for development
bun test --watch
```

## Implementation Workflow

For each question:

1. **Read** - Study the problem statement and requirements
2. **Understand** - Review test cases and examples
3. **Implement** - Write your solution
4. **Test** - Run tests with `bun test tests/[name].test.ts`
5. **Reference** - Uncomment solution to check approach
6. **Comment** - Comment out solution for practice

## Key Concepts Reference

### Hash Maps / Sets
- Constant time lookup: O(1) average
- Useful for `two-sum`, `random-data-structure`

### Linked Lists
- Sequential data structure with pointers
- Key operation: `reverse-linked-list`

### Trees
- Hierarchical data structure
- Key concept: `is-balanced-tree` uses DFS

### Backtracking
- Try all possibilities recursively
- Used in: `ip-address-validation`

### React Hooks
- `useState` - Component state
- `useEffect` - Side effects
- `useCallback` - Memoized callbacks
- `useMemo` - Memoized values
- Custom hooks - Reusable logic

### Design Patterns
- Rate limiting: Sliding window, Token bucket
- Fetching: Loading/Error/Success states
- Forms: Controlled components, Validation

## Interview Preparation Checklist

- [ ] Implement all 10 questions
- [ ] Pass all test cases
- [ ] Understand time/space complexity
- [ ] Write clean, readable code
- [ ] Handle edge cases
- [ ] Explain your approach
- [ ] Discuss trade-offs
- [ ] Consider alternative solutions

## Tips for Success

1. **Understand** before implementing
2. **Start simple** then optimize
3. **Test** edge cases thoroughly
4. **Explain** your reasoning aloud
5. **Refactor** for readability
6. **Practice** multiple times
7. **Time yourself** under interview conditions
8. **Review** solutions and patterns

---

**Total Questions**: 10
**Total Test Cases**: 100+
**Estimated Study Time**: 8-12 hours for full mastery
**Difficulty Progression**: Easy → Medium → Hard

Good luck with your interview preparation! 🚀
