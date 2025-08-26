# ValtheraMemory

In-memory database implementation.

## Overview

ValtheraMemory is a database implementation that stores data in memory using a Map. It's useful for testing or temporary data storage.

## Classes

### MemoryAction

Extends CustomActionsBase to provide in-memory storage operations.

- Uses a Map to store collections in memory
- Provides implementations for all required database operations

### ValtheraMemory

Main class that wraps MemoryAction for use as a database.

### createMemoryValthera

Factory function to create a pre-populated in-memory database.

```typescript
createMemoryValthera<T extends Record<string, Data[]>>(data?: T)
```