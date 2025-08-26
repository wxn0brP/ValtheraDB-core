# ValtheraClass

The main database class that provides a unified interface for database operations.

## Overview

ValtheraClass is the primary interface for interacting with databases. It provides methods for all standard CRUD operations and manages execution through an executor queue.

Related documentation:
- [ActionsBase](../base/actions.md) - The base class for database actions
- [CollectionManager](../helpers/CollectionManager.md) - Helper for collection-specific operations
- [Executor](../helpers/executor.md) - Operation queuing system

## Constructor

```typescript
new ValtheraClass(options: DbOpts = {})
```

## Properties

- `dbAction: ActionsBase` - The database action implementation
- `executor: executorC` - The operation executor
- `emiter: VEE` - Event emitter for database events
- `version` - The version of the database

## Methods

- `init(...args: any[])` - Initialize the database
- `execute<T>(name: DbActionsFns, query: VQuery)` - Execute a database action
- `c<T = Data>(collection: string): CollectionManager<T>` - Create a CollectionManager for a collection
- `getCollections()` - Get all collection names
- `ensureCollection(collection: string)` - Ensure a collection exists
- `issetCollection(collection: string)` - Check if a collection exists
- Standard CRUD operations:
  - `add`
  - `find`
  - `findOne`
  - `update`
  - `updateOne`
  - `remove`
  - `removeOne`
  - `updateOneOrAdd`
  - `removeCollection`