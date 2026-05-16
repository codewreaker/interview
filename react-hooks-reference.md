# React Component Internals — Deep Reference
> Authored in the spirit of [react.dev/reference/react/hooks](https://react.dev/reference/react/hooks)  
> Audience: Senior Software Engineers

---

## Table of Contents
1. [What Are React Hooks?](#what-are-react-hooks)
2. [How Does useEffect Work?](#how-does-useeffect-work)
3. [State Management — Conceptual Model](#state-management--conceptual-model)
4. [How State Management Works in React](#how-state-management-works-in-react)
5. [Routing — TanStack Router & React-Redux](#routing--tanstack-router--react-redux)
6. [Significance of React Fragment](#significance-of-react-fragment)
7. [Purpose of the useState Hook](#purpose-of-the-usestate-hook)

---

## What Are React Hooks?

Hooks are **functions that let you "hook into" React's internal fiber tree and scheduler from within a function component**. Prior to React 16.8 (Feb 2019), stateful logic was only possible in class components via `this.state` and lifecycle methods. Hooks eliminated that dichotomy.

### The Rules (and Why They Exist)

```js
// ✅ Valid
function MyComponent() {
  const [count, setCount] = useState(0); // top-level, unconditional
}

// ❌ Invalid — conditional hook call breaks the linked-list ordering
function MyComponent({ flag }) {
  if (flag) {
    const [count, setCount] = useState(0);
  }
}
```

React tracks hooks via a **singly-linked list** stored on the fiber node (`fiber.memoizedState`). Each call to a hook during render appends a new node. On re-renders, React walks this list in order and pairs each call with its stored node. A conditional or loop-driven hook call shifts the list, causing React to read the wrong state for subsequent hooks — hence the "only call hooks at the top level" rule.

### Built-in Hook Categories

| Category | Hooks |
|---|---|
| **State** | `useState`, `useReducer` |
| **Context** | `useContext` |
| **Refs** | `useRef`, `useImperativeHandle` |
| **Effects** | `useEffect`, `useLayoutEffect`, `useInsertionEffect` |
| **Performance** | `useMemo`, `useCallback`, `useTransition`, `useDeferredValue` |
| **React 19+** | `use`, `useOptimistic`, `useActionState`, `useFormStatus` |

### Internals: Where Hooks Live

Each fiber node has a `memoizedState` property. For function components, this is a linked list:

```
fiber.memoizedState →
  { memoizedState: 0, queue: {...}, next: → }   // useState(0)
  { memoizedState: undefined, deps: [...], next: → } // useEffect(...)
  { memoizedState: ref, next: null }             // useRef(...)
```

The `ReactCurrentDispatcher` is swapped between two implementations:
- **`HooksDispatcherOnMount`** — first render, creates nodes
- **`HooksDispatcherOnUpdate`** — re-renders, reads existing nodes

This swap is how React enforces hooks-in-render constraints at the engine level.

---

## How Does useEffect Work?

`useEffect` schedules a **side effect to run after the browser has painted** — it is asynchronous relative to the render phase.

```js
useEffect(() => {
  // setup
  const sub = eventBus.subscribe(handler);

  return () => {
    // cleanup — runs before next effect or unmount
    sub.unsubscribe();
  };
}, [dependency]);
```

### The Render → Commit → Effect Pipeline

```
render phase    → React calls your component, diffs the vDOM (pure, no side effects)
commit phase    → React mutates the real DOM (synchronous)
  ├─ BeforeMutation
  ├─ Mutation       ← DOM updates applied here
  └─ Layout         ← useLayoutEffect fires here (sync, blocks paint)
paint           → Browser paints the updated pixels
passive effects → useEffect fires here (async, after paint)
```

The `useEffect` callback is queued as a **passive effect** and dispatched via `MessageChannel` or `setTimeout(fn, 0)` — it never blocks the paint.

### Dependency Array — Shallow Equality

React uses `Object.is` (not deep equality) to compare deps between renders:

```js
// Re-runs every render — object identity changes each time
useEffect(() => { ... }, [{ id: 1 }]); // ❌ new reference each render

// Stable ref
const options = useMemo(() => ({ id: 1 }), []);
useEffect(() => { ... }, [options]); // ✅
```

### Dependency Array Variants

| Signature | Behaviour |
|---|---|
| `useEffect(fn)` | Runs after every render |
| `useEffect(fn, [])` | Runs once after mount |
| `useEffect(fn, [a, b])` | Runs when `a` or `b` change (Object.is) |

### Cleanup Is Not Optional — It's the Contract

React 18 Strict Mode **double-invokes effects** in development (mount → unmount → remount) to surface missing cleanup. If your effect is not idempotent across this cycle, you have a bug.

```js
useEffect(() => {
  const id = setInterval(tick, 1000);
  return () => clearInterval(id); // required — not optional
}, []);
```

### useLayoutEffect vs useEffect

| | `useLayoutEffect` | `useEffect` |
|---|---|---|
| Timing | After DOM mutation, before paint | After paint |
| Blocks paint? | Yes | No |
| Use case | Reading layout (scrollHeight, getBoundingClientRect) | Data fetching, subscriptions, logging |
| SSR | Warns (no DOM on server) | Safe |

---

## State Management — Conceptual Model

State in React is **a snapshot per render**. Each render call captures its own closure over that render's state values.

```js
function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setTimeout(() => {
      // This closure captured `count` at the time of this render
      console.log(count); // always logs the value at click time, not "current"
    }, 3000);
  }
}
```

This is the **stale closure problem** — a direct consequence of React's snapshot model. The fix is to use the functional update form or a ref:

```js
setCount(prev => prev + 1); // reads from the queue, not the closure
```

### React's State Update Queue

Calling `setState` does not immediately mutate state. It **enqueues an update** on the fiber's update queue and schedules a re-render via the scheduler. Multiple `setState` calls within one event handler are **batched** (as of React 18, automatic batching applies everywhere, including `setTimeout` and Promises).

```js
// React 18: all three are batched into a single re-render
setTimeout(() => {
  setA(1);
  setB(2);
  setC(3);
}, 0);
```

Prior to React 18, batching only occurred inside React event handlers. In 17 and below, the `setTimeout` example above would trigger three separate re-renders.

---

## How State Management Works in React

### Local State — useState / useReducer

For co-located component state. `useReducer` is preferred when:
- State transitions are complex
- Next state depends on multiple sub-values
- You want to dispatch explicit actions (easier to trace/test)

```js
const [state, dispatch] = useReducer(reducer, initialState);

function reducer(state, action) {
  switch (action.type) {
    case 'increment': return { count: state.count + 1 };
    case 'reset':     return initialState;
    default:          throw new Error(`Unknown action: ${action.type}`);
  }
}
```

Internally, `useReducer` is the primitive — `useState` is implemented on top of it.

### Lifting State & Context

React's unidirectional data flow means shared state must live at the **lowest common ancestor (LCA)**. When prop drilling becomes untenable, `useContext` provides a subscription mechanism:

```js
const ThemeContext = createContext('light');

// Provider sets the value
<ThemeContext.Provider value="dark">
  <DeepChild />
</ThemeContext.Provider>

// Consumer reads it — re-renders when context value changes
function DeepChild() {
  const theme = useContext(ThemeContext);
}
```

**Pitfall**: Every consumer re-renders when the context value changes, even if the relevant slice didn't change. Mitigate with memoization or context splitting.

### External Stores — useSyncExternalStore

Introduced in React 18 to safely subscribe to external (non-React) state stores without tearing in concurrent mode:

```js
const snapshot = useSyncExternalStore(
  store.subscribe,    // (callback) => unsubscribe fn
  store.getSnapshot,  // () => currentValue (must be stable/cached)
  store.getServerSnapshot // for SSR
);
```

Redux, Zustand, Jotai, and Valtio all use this hook (or its shim) under the hood as of their React 18-compatible releases.

### Redux Architecture (Brief Internals)

Redux is a **predictable state container** built on three principles: single source of truth, state is read-only, changes via pure functions.

```
Action dispatched
  → Middleware pipeline (thunk, saga, RTK Query)
  → Root reducer (combineReducers → slice reducers)
  → New state tree (structural sharing via Immer in RTK)
  → useSyncExternalStore notifies subscribers
  → Re-render only components whose selected slice changed
```

`react-redux`'s `useSelector` adds a further optimisation: it runs the selector on every store update but **bails out of re-render if the result is referentially equal** to the previous one (using `===` by default, or a custom comparator).

### Zustand / Jotai / Valtio — Modern Alternatives

| Library | Model | Granularity | SSR |
|---|---|---|---|
| **Zustand** | Single store, selector-based | Selector slice | ✅ |
| **Jotai** | Atomic (bottom-up) | Per-atom | ✅ |
| **Valtio** | Proxy-based mutable | Tracked property | Partial |
| **Redux Toolkit** | Flux, slice-based | useSelector | ✅ |

---

## Routing — TanStack Router & React-Redux

### How Client-Side Routing Works

The browser's `History API` (`pushState`, `replaceState`, `popstate`) lets JavaScript update the URL without a page reload. React routers intercept navigation, match the new URL against a route tree, and render the matched component subtree.

```
URL change
  → history.pushState (or popstate event)
  → Router re-matches route tree
  → React re-renders matched route components
  → Scroll restoration, data loaders, transitions
```

### TanStack Router (v1) — Type-Safe Routing

TanStack Router is a **fully type-safe** router with first-class support for:
- **File-based routing** (like Next.js App Router) or code-based
- **Loaders** that co-locate data fetching with routes
- **Search param validation** via Zod schemas
- **Pending states**, error boundaries, and transitions per-route

```ts
// Route definition
const userRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/users/$userId',
  validateSearch: z.object({ tab: z.enum(['profile', 'activity']).optional() }),
  loader: async ({ params }) => fetchUser(params.userId),
  component: UserPage,
});

// In component — fully typed
function UserPage() {
  const { userId } = useParams({ from: userRoute.id });
  const user = useLoaderData({ from: userRoute.id });
  const { tab } = useSearch({ from: userRoute.id });
}
```

The router's type system derives all param, search, and loader types directly from route definitions — no runtime overhead, no type assertions.

### React Router v6 — Comparison

React Router v6 uses a `<Routes>`/`<Route>` JSX-based tree and recently added loader/action patterns (Remix-influenced). Less type-safe out of the box but simpler for smaller apps.

### Redux with Routing

`react-redux` is orthogonal to routing — it manages application state, not URL state. The two interact when:
- Route changes trigger store actions (e.g., reset paginated data)
- Store state influences navigation (e.g., redirect on auth failure)

```js
// Dispatch on route change via TanStack Router's onEnter
const route = createRoute({
  onEnter: () => store.dispatch(resetPageState()),
});

// Programmatic navigation from a thunk
export const logout = createAsyncThunk('auth/logout', async (_, { dispatch }) => {
  await api.logout();
  dispatch(resetUser());
  router.navigate({ to: '/login' });
});
```

---

## Significance of React Fragment

`React.Fragment` (shorthand `<>...</>`) lets you **return multiple elements from a component without adding an extra DOM node**.

### Why It Matters Beyond Aesthetics

**1. Preserves CSS layout contracts**

```jsx
// ❌ Wrapping div breaks flexbox/grid parent relationships
function Columns() {
  return (
    <div>          {/* extra div disrupts table-row or flex layout */}
      <td>One</td>
      <td>Two</td>
    </div>
  );
}

// ✅ Fragment — no DOM node inserted
function Columns() {
  return (
    <>
      <td>One</td>
      <td>Two</td>
    </>
  );
}
```

**2. Valid HTML structure**

Certain elements have strict parent-child rules (`<table>`, `<ul>`, `<dl>`). Inserting a `<div>` wrapper produces invalid HTML and can cause hydration mismatches in SSR.

**3. Keyed Fragments for lists**

The shorthand `<>` cannot accept a `key` prop. Use the explicit form when rendering lists:

```jsx
items.map(item => (
  <React.Fragment key={item.id}>
    <dt>{item.term}</dt>
    <dd>{item.description}</dd>
  </React.Fragment>
));
```

**4. Reduced DOM depth = performance**

Every extra DOM node has a memory cost and participates in layout/paint calculations. At scale (virtualized lists, deep trees), eliminating unnecessary wrappers reduces layout thrashing.

### Internals

A Fragment is a fiber with type `Symbol(react.fragment)`. During reconciliation, React processes its children directly and never creates a DOM node for it. It's purely a **grouping construct in the virtual DOM** — zero runtime cost relative to inlining those children.

---

## Purpose of the useState Hook

`useState` is the foundational primitive for **local, synchronous, re-render-triggering state** within a function component.

```js
const [state, setState] = useState(initialValue);
```

### What It Actually Does

1. On **mount**: Allocates a new node in the fiber's `memoizedState` linked list. Stores `initialValue` (or the result of the initializer function, if one is passed).
2. On **update**: `setState(newValue)` enqueues an update, schedules a re-render. On the next render pass, React reads the queued value from the fiber node and returns it as `state`.
3. **Bailout**: If `Object.is(state, newValue)` is true, React bails out — no re-render, no children re-rendered.

### Lazy Initialization

Pass a function to avoid re-computing expensive initial values on every render:

```js
// ❌ parsedData() is called on every render, result discarded after first
const [data, setData] = useState(parsedData());

// ✅ parsedData() called once on mount only
const [data, setData] = useState(() => parsedData());
```

### Functional Updates — Why They Exist

```js
// Problematic in concurrent mode or async contexts
setCount(count + 1); // `count` is the closure value — may be stale

// Safe — receives the guaranteed latest state from the queue
setCount(prev => prev + 1);
```

React may re-run your render function multiple times in concurrent mode (Suspense, transitions). Functional updates guarantee you're always working from the latest committed value.

### Batching and the Update Queue

Multiple `setState` calls in the same synchronous block are batched by React's scheduler. The updates are applied in order to produce a single new state value before re-rendering:

```js
// Both updates are batched — only one re-render
function handleClick() {
  setFirstName('Jane');
  setLastName('Doe');
}
```

In React 18, this automatic batching extends to `setTimeout`, Promises, and native event handlers — previously only React synthetic events were batched.

### When to Reach for useReducer Instead

Prefer `useReducer` when:
- Multiple state values are always updated together (avoid split-brain)
- Transitions are named and need to be logged/traced
- The next state is derived from multiple prior values

```js
// useState gets unwieldy
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState(null);
const [data, setData] = useState(null);

// useReducer — single atomic transition
const [state, dispatch] = useReducer(fetchReducer, { status: 'idle', data: null, error: null });
```

---

## Quick Reference — Hook Execution Order in a Render

```
1. React calls your component function
2. useState/useReducer  → reads memoizedState[n], returns [value, setter]
3. useContext           → reads current context value (subscribes)
4. useRef              → returns stable { current } object
5. useMemo             → recomputes if deps changed, else returns cached
6. useCallback         → returns stable function ref if deps unchanged
7. useEffect           → registers passive effect (runs after paint)
8. useLayoutEffect     → registers layout effect (runs after DOM, before paint)
9. Component returns JSX → React diffs against previous fiber tree
10. Commit phase       → DOM mutations applied
11. useLayoutEffect cleanup → previous layout effects cleaned up
12. useLayoutEffect setup  → new layout effects run
13. Browser paint
14. useEffect cleanup  → previous passive effects cleaned up
15. useEffect setup    → new passive effects run
```

---

*Based on React 18.x / React 19 internals. Source: [react.dev](https://react.dev), [github.com/facebook/react](https://github.com/facebook/react)*
