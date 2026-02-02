# Frontend System Design - Interview Preparation Guide

## 🎯 What Interviewers Look For

1. **Problem Decomposition** - Breaking down large problems into smaller, manageable pieces
2. **Trade-off Analysis** - Understanding pros/cons of different approaches
3. **Scalability Thinking** - How does your solution handle growth?
4. **Communication** - Explaining your thought process clearly

---

## 📐 Frontend System Design Framework (RADIO)

### **R** - Requirements Clarification
- Functional requirements (what features?)
- Non-functional requirements (performance, scale, accessibility)
- Who are the users? How many concurrent users?
- What devices/browsers need support?

### **A** - Architecture / High-Level Design
- Component hierarchy
- State management strategy
- Data flow (unidirectional vs bidirectional)
- API design / Backend communication

### **D** - Data Model
- What data structures?
- Client-side storage (memory, localStorage, IndexedDB)
- Caching strategy
- Data normalization

### **I** - Interface Definition (API Design)
- Component props/interfaces
- API contracts
- Event handling
- Error states

### **O** - Optimizations & Deep Dives
- Performance optimizations
- Accessibility (a11y)
- Internationalization (i18n)
- Security considerations

---

## 🏗️ Common Frontend System Design Questions

### 1. **Real-Time Dashboard (Like Your Stock Ticker!)**
```
Key Concepts:
├── WebSocket vs Polling vs Server-Sent Events
├── Efficient DOM updates (Virtual DOM, keyed updates)
├── Data structures for O(1) lookups (Map, Set)
├── Throttling/Debouncing updates
├── Memory management (subscription cleanup)
└── Optimistic UI updates
```

### 2. **Design Twitter/Facebook Feed**
```
Key Concepts:
├── Infinite scroll / Virtualization
├── Pagination strategies (cursor vs offset)
├── Caching & cache invalidation
├── Real-time updates (new posts)
├── Image lazy loading
└── Offline support
```

### 3. **Design Autocomplete/Typeahead**
```
Key Concepts:
├── Debouncing API calls
├── Caching previous results
├── Keyboard navigation
├── Race conditions (out-of-order responses)
├── Highlighting matches
└── Accessibility (ARIA)
```

### 4. **Design a Chat Application**
```
Key Concepts:
├── WebSocket connection management
├── Message ordering & timestamps
├── Optimistic updates
├── Offline queue
├── Read receipts
├── Presence indicators
└── Message persistence
```

### 5. **Design Image Gallery/Carousel**
```
Key Concepts:
├── Lazy loading
├── Preloading adjacent images
├── Touch gestures
├── Responsive images (srcset)
├── Memory management
└── Animation performance
```

---

## 🔑 Key Concepts to Master

### 1. State Management

```javascript
// When to use different approaches:

// Local State (useState/component state)
// - UI state (modals, form inputs)
// - Data scoped to single component

// Lifted State / Context
// - Shared between few components
// - Not frequently updated

// Global State (Redux, Zustand, etc.)
// - Shared across many components
// - Complex update logic
// - Time-travel debugging needed

// Server State (React Query, SWR)
// - Data from APIs
// - Caching, refetching, synchronization
```

### 2. Performance Optimization Patterns

```javascript
// 1. Virtualization - Only render visible items
// Libraries: react-window, react-virtualized
// Use case: Long lists (1000+ items)

// 2. Memoization
const MemoizedComponent = React.memo(Component);
const memoizedValue = useMemo(() => expensiveCalc(), [deps]);
const memoizedCallback = useCallback(() => {}, [deps]);

// 3. Code Splitting
const LazyComponent = React.lazy(() => import('./Heavy'));

// 4. Debouncing & Throttling
const debouncedSearch = debounce(search, 300);
const throttledScroll = throttle(onScroll, 100);

// 5. Web Workers for heavy computation
const worker = new Worker('heavy-calc.js');
```

### 3. Data Structures for Frontend

```javascript
// Map - O(1) lookup, maintains insertion order
const cache = new Map();
cache.set('key', value);
cache.get('key'); // O(1)

// Set - O(1) membership check
const selected = new Set();
selected.add(id);
selected.has(id); // O(1)

// WeakMap/WeakSet - Garbage collection friendly
const metadata = new WeakMap();
metadata.set(domNode, { clicks: 0 });

// When to use what:
// Array - Ordered data, iteration
// Object - Static keys, JSON serialization
// Map - Dynamic keys, frequent updates, size tracking
// Set - Unique values, membership checks
```

### 4. Real-Time Communication

```javascript
// WebSocket - Bidirectional, persistent connection
const ws = new WebSocket('wss://api.example.com');
ws.onmessage = (event) => handleData(JSON.parse(event.data));

// Server-Sent Events (SSE) - Server to client only
const sse = new EventSource('/api/stream');
sse.onmessage = (event) => handleData(JSON.parse(event.data));

// Polling - Simple but less efficient
setInterval(async () => {
  const data = await fetch('/api/data');
  handleData(await data.json());
}, 5000);

// Comparison:
// WebSocket: Chat, games, collaborative editing
// SSE: Notifications, live feeds, dashboards
// Polling: Simple cases, fallback strategy
```

### 5. Caching Strategies

```javascript
// 1. In-Memory Cache (fastest, volatile)
const cache = new Map();

// 2. Session Storage (per tab, survives refresh)
sessionStorage.setItem('key', JSON.stringify(data));

// 3. Local Storage (persistent, 5-10MB limit)
localStorage.setItem('key', JSON.stringify(data));

// 4. IndexedDB (large data, async, indexed)
const db = await openDB('my-db', 1);
await db.put('store', data);

// 5. Service Worker Cache (offline support)
caches.open('v1').then(cache => cache.add('/api/data'));

// Cache Invalidation Strategies:
// - Time-based (TTL)
// - Version-based (ETags)
// - Event-based (WebSocket notifications)
```

---

## 📊 Estimation & Numbers to Know

```
Latency Numbers:
├── L1 cache: 1ns
├── L2 cache: 4ns
├── RAM: 100ns
├── SSD read: 150μs
├── Network roundtrip (same region): 0.5ms
├── Network roundtrip (cross-region): 150ms
└── HDD seek: 10ms

Web Performance Budgets:
├── Time to Interactive: < 3s (mobile)
├── First Contentful Paint: < 1.8s
├── Largest Contentful Paint: < 2.5s
├── Cumulative Layout Shift: < 0.1
├── First Input Delay: < 100ms
├── JavaScript bundle: < 200KB (compressed)
└── Images: < 200KB per image (optimize!)

DOM Performance:
├── Reflow/Layout: Expensive (avoid)
├── Repaint: Moderate
├── Composite: Cheap (transforms, opacity)
├── Virtual list threshold: 100+ items
└── Batch DOM updates (requestAnimationFrame)
```

---

## 🎨 Sample System Design Answer Structure

### Example: "Design a Real-Time Stock Ticker"

**1. Clarify Requirements (2 min)**
```
Q: How many stocks? 
A: Assume 50-100 stocks

Q: Update frequency?
A: Every 100ms-1s per stock

Q: Features needed?
A: Display, sort, filter, subscribe/unsubscribe
```

**2. High-Level Architecture (5 min)**
```
┌─────────────────────────────────────────────────┐
│                    Browser                       │
├─────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐              │
│  │  UI Layer   │  │   State     │              │
│  │  (React)    │◄─┤   (Map)     │              │
│  └─────────────┘  └──────▲──────┘              │
│                          │                      │
│  ┌─────────────────────────────────────┐       │
│  │        WebSocket Manager             │       │
│  │  - Connection handling               │       │
│  │  - Reconnection logic                │       │
│  │  - Message parsing                   │       │
│  └─────────────────▲───────────────────┘       │
└────────────────────┼────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │    WebSocket Server     │
        │   (Stock Data Stream)   │
        └─────────────────────────┘
```

**3. Data Model (3 min)**
```javascript
// Stock data structure
interface Stock {
  ticker: string;      // Primary key
  price: number;
  change: number;
  changePercent: number;
  timestamp: number;   // For sorting
  volume?: number;
}

// State structure - Use Map for O(1) updates
const stocksMap = new Map<string, Stock>();

// Why Map?
// - O(1) lookup/update by ticker
// - Maintains insertion order
// - Easy iteration with .values()
```

**4. Key Components (5 min)**
```
Components:
├── StockTable
│   ├── TableHeader (sortable columns)
│   └── TableBody
│       └── StockRow (keyed by ticker)
├── SubscriptionControls
│   ├── TickerInput
│   ├── SubscribeButton
│   └── UnsubscribeButton
└── ConnectionStatus
```

**5. Optimizations (5 min)**
```
1. Efficient Updates
   - Update only changed rows (key by ticker)
   - Use CSS animations for flash effect
   - Batch rapid updates with requestAnimationFrame

2. Memory Management
   - Clean up subscriptions on unmount
   - Limit stored history
   - Use WeakMap for DOM references

3. Network Optimization
   - WebSocket with reconnection
   - Fallback to polling if needed
   - Compress messages (binary protocol)

4. Render Optimization
   - Virtualize if 100+ rows
   - Debounce sort operations
   - Use CSS transforms for animations
```

---

## 🚀 Practice Questions

1. **Design Instagram Feed**
2. **Design Google Docs (Collaborative Editing)**
3. **Design a Poll Widget**
4. **Design Spotify's Player UI**
5. **Design an E-commerce Product Page**
6. **Design a Notification System**
7. **Design a Calendar Application**
8. **Design a Kanban Board (Trello)**

---

## 📚 Resources

- [Frontend Interview Handbook](https://www.frontendinterviewhandbook.com/)
- [GreatFrontend System Design](https://www.greatfrontend.com/system-design)
- [Designing Data-Intensive Applications](https://dataintensive.net/) (book)
- [web.dev Performance](https://web.dev/performance/)

---

## ✅ Pre-Interview Checklist

- [ ] Can explain trade-offs between different state management solutions
- [ ] Know when to use WebSocket vs SSE vs Polling
- [ ] Understand virtual scrolling and when it's needed
- [ ] Can estimate latency and set performance budgets
- [ ] Know common caching strategies and invalidation
- [ ] Comfortable with accessibility basics (ARIA, keyboard nav)
- [ ] Can draw architecture diagrams
- [ ] Practice talking through solutions out loud

Good luck with your next interview! 🎉
