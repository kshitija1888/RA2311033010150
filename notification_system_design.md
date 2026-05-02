# Stage 1 — Notification System Design

## Priority Inbox Algorithm

### Problem
Students lose track of important campus notifications due to high volume. A Priority Inbox should surface the top `n` most important unread notifications first.

### Priority Scoring

Priority is determined by a **weighted composite score**:

```
score = type_weight * 1000 + recency_score
```

**Type weights (descending importance):**
| Type      | Weight |
|-----------|--------|
| Placement | 3      |
| Result    | 2      |
| Event     | 1      |

**Recency score:** Unix timestamp (epoch seconds) — more recent = higher score.

### Why this works
- Placement notifications (jobs/internships) are highest urgency: missing them has direct career impact.
- Result notifications (exams/evaluations) are high urgency: time-sensitive academic impact.
- Events (fests, talks) are lower priority: usually have more lead time.
- Within the same type, newest notifications appear first, ensuring freshness.

### Implementation (TypeScript)

```typescript
const PRIORITY_WEIGHT = { Placement: 3, Result: 2, Event: 1 };

function getPriorityScore(n: Notification): number {
  const typeWeight = PRIORITY_WEIGHT[n.Type] * 1_000_000;
  const recency = new Date(n.Timestamp).getTime();
  return typeWeight + recency;
}

function getTopN(notifications: Notification[], n: number): Notification[] {
  return [...notifications]
    .sort((a, b) => getPriorityScore(b) - getPriorityScore(a))
    .slice(0, n);
}
```

### Maintaining Top-N Efficiently as New Notifications Arrive

**Challenge:** New notifications stream in continuously. Re-sorting all N items on every update is O(k log k).

**Efficient approach — Min-Heap of size N:**
- Maintain a min-heap (priority queue) of the top `n` items keyed by score.
- On new notification arrival:
  1. Compute its score.
  2. If heap size < n → push directly.
  3. Else if score > heap.min → pop the minimum, push the new one.
  4. Else → discard (not in top N).

This gives **O(log n) per insertion**, far better than re-sorting.

```typescript
// Pseudocode
class MinHeap<T> { ... }

const topN = new MinHeap<Notification>(compareFn, maxSize = 10);

function onNewNotification(n: Notification) {
  const score = getPriorityScore(n);
  topN.pushOrReplace(n, score);
}
```

**Result:** Always O(log n) updates, O(n) reads — optimal for a real-time streaming scenario.

---

## Stage 2 — Frontend Architecture

### Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **UI:** Material UI v5
- **HTTP:** Axios
- **State:** React hooks (useState, useEffect, useCallback)

### Component Architecture

```
App
├── AuthSetup            # Token / credential entry
└── HomePage
    ├── AppBar           # Header with unread badge, refresh, logout
    ├── PriorityInbox    # Top 3 priority notifications
    ├── FilterBar        # Toggle filter by type + mark-all-read
    ├── NotificationList # Paginated notification cards
    │   └── NotificationCard (×n)
    └── PaginationControls
```

### Key Design Decisions

1. **Read/Unread state** is tracked client-side in a `Set<string>` of read IDs. New notifications (not in set) get a colored left border and unread dot. This avoids an extra backend endpoint.

2. **Filter resets page to 1** to avoid stale results when switching types.

3. **Auth** supports both token paste (for registered users) and full credential auth flow.

4. **Responsive** via MUI `Container`, `Box`, `flexWrap`, and `useMediaQuery` (AppBar collapses on mobile).

5. **No fake data** — all data fetched live from `http://20.207.122.201/evaluation-service/notifications`.
