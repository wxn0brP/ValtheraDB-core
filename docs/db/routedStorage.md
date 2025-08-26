# RoutedStorage

A database router that directs operations to different backends based on rules.

## Overview

RoutedStorage allows you to route database operations to different backend implementations based on matching rules. This is useful for scenarios like sharding or using different storage engines for different collections.

## Types

### MatchRule

```typescript
type MatchRule = string | RegExp | ((query: VQuery) => boolean);
```

A rule for matching queries to backends.

### RouteEntry

```typescript
interface RouteEntry {
    match: MatchRule;
    backends: ActionsBase[];
}
```

A routing rule that defines which backends should handle queries that match the rule.

## Class: RoutedStorage

Extends ActionsBase to provide routing functionality.

### Constructor

```typescript
new RoutedStorage(rules: RouteEntry[], defaultBackend: ActionsBase | ActionsBase[])
```

### Methods

- `_matchBackends(config: VQuery): ActionsBase[]` - Determine which backends match a query
- `_withAll<T>(config: VQuery, fn: (b: ActionsBase) => Promise<T>, gather = false): Promise<T>` - Execute a function on all matching backends
- `_withFirst<T>(config: VQuery, fn: (b: ActionsBase) => Promise<T>): Promise<T>` - Execute a function on the first matching backend
- All standard ActionsBase methods implemented to route to appropriate backends