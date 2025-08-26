# ActionsBase

The base class for database actions that defines the interface for all database operations.

## Overview

ActionsBase provides the abstract foundation for implementing database operations. All concrete implementations should extend this class and implement its methods.

See also:
- [CustomActionsBase](custom.md) - An implementation of this base class
- [ValtheraClass](../db/valthera.md) - The main database class that uses actions

## Methods

- `init(...args: any[])` - Initialize the database action
- `getCollections()` - Get all collection names
- `ensureCollection(config: VQuery)` - Ensure a collection exists
- `issetCollection(config: VQuery)` - Check if a collection exists
- `add(config: VQuery)` - Add data to a collection
- `find(config: VQuery)` - Find data in a collection
- `findOne(config: VQuery)` - Find a single item in a collection
- `update(config: VQuery)` - Update data in a collection
- `updateOne(config: VQuery)` - Update a single item in a collection
- `remove(config: VQuery)` - Remove data from a collection
- `removeOne(config: VQuery)` - Remove a single item from a collection
- `removeCollection(config: VQuery)` - Remove a collection
- `updateOneOrAdd(config: VQuery)` - Update an item or add it if it doesn't exist