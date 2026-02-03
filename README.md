# 🎯 Interview Prep Suite

A comprehensive collection of coding interview questions, challenges, and study materials for JavaScript/TypeScript and React interviews.

## 📁 Repository Structure

```
interview/
├── interview-suite/           # Main coding challenges & projects
│   ├── src/                   # Challenge implementations
│   │   ├── array-methods.ts   # Array prototype methods
│   │   ├── deepcopy.ts        # Deep cloning algorithms
│   │   ├── flatten.ts         # Array/object flattening
│   │   ├── histogram.ts       # Bloomberg-style histogram
│   │   ├── closures.ts        # Closure exercises
│   │   ├── debounce.ts        # Debounce implementation
│   │   ├── merge-intervals.ts # Interval merging
│   │   ├── clock.ts           # Clock implementation
│   │   ├── stock-ticker/      # 📈 Real-time stock ticker (React)
│   │   ├── redux-sample/      # 🔄 Redux Toolkit example
│   │   └── recursive-react/   # 🌳 Recursive file explorer (React)
│   └── tests/                 # Test suites for all challenges
├── javascript-interview-flash.html      # JS concepts cheat sheet
└── javascript-interview-flash-v3.html   # Enhanced cheat sheet
```

## 🚀 Getting Started

### Prerequisites
- [Bun](https://bun.sh/) (recommended) or Node.js 18+

### Installation

```bash
cd interview-suite
bun install
```

### Run Tests

```bash
# Run all tests
bun test

# Run specific test file
bun test tests/array-methods.test.ts

# Watch mode
bun test --watch
```

### Grade Your Solutions

```bash
bun run grade
```

## 📝 Coding Challenges

### Core JavaScript

| Challenge | Description | Difficulty |
|-----------|-------------|------------|
| **Array Methods** | Implement `myMap`, `myFilter`, `myReduce` | ⭐⭐ |
| **Deep Copy** | Deep clone objects, arrays, primitives | ⭐⭐ |
| **Flatten** | Flatten nested arrays and objects | ⭐⭐ |
| **Histogram** | Count points in buckets (Bloomberg) | ⭐⭐⭐ |
| **Debounce** | Implement debounce utility | ⭐⭐ |
| **Closures** | Closure-based exercises | ⭐⭐ |
| **Merge Intervals** | Merge overlapping intervals | ⭐⭐⭐ |

### React Projects

| Project | Description | Key Concepts |
|---------|-------------|--------------|
| **Stock Ticker** | Real-time stock price dashboard | WebSockets, state management, performance |
| **Recursive React** | File explorer with nested folders | Recursion, tree structures, TypeScript |
| **Redux Sample** | Counter app with Redux Toolkit | Redux, async thunks, slices |

## 🏃 Running React Projects

### Stock Ticker
```bash
cd interview-suite/src/stock-ticker
bun install
bun dev
```

### Recursive File Explorer
```bash
cd interview-suite/src/recursive-react
bun install
bun dev      # Start dev server
bun test     # Run component tests
```

### Redux Sample
```bash
cd interview-suite/src/redux-sample
bun install
bun dev
```

## 📚 Study Materials

- **JavaScript Flash Sheet** - Open `javascript-interview-flash.html` in browser for quick JS reference
- **Frontend System Design Guide** - See `interview-suite/src/stock-ticker/frontend-system-design-guide.md` for the RADIO framework

## 🎯 Interview Topics Covered

### JavaScript Fundamentals
- Closures & Scope
- Prototypes & `this`
- Array methods (map, filter, reduce)
- Async/Await & Promises
- Event Loop

### Data Structures & Algorithms
- Arrays & Objects
- Recursion
- Tree traversal
- Interval problems

### React & Frontend
- Component composition
- Recursive components
- State management (useState, Redux)
- Performance optimization (memo, useCallback)
- Real-time data handling
- TypeScript integration

### System Design
- Real-time dashboards
- WebSocket vs Polling
- State architecture
- Component hierarchy

## 🧪 Test-Driven Development

All challenges include comprehensive test suites. The recommended workflow:

1. Read the challenge requirements in the source file
2. Run the tests to see what's failing
3. Implement the solution
4. Run tests again to verify
5. Run `bun run grade` for final score

## 📄 License

ISC
