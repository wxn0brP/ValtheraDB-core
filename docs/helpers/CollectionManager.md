# CollectionManager

A helper class for managing operations on a specific collection.

## Overview

CollectionManager provides a convenient interface for performing operations on a specific database collection. It wraps the ValtheraClass methods with the collection name pre-filled.

Related documentation:
- [ValtheraClass](../db/valthera.md) - The main database class
- [ActionsBase](../base/actions.md) - The base class for database actions

## Constructor

```typescript
new CollectionManager<D = Data>(private db: ValtheraCompatible, private collection: string)
```

## Methods

All methods are similar to those in ValtheraClass but with the collection parameter pre-filled:

- `add<T = Data>(data: Arg<T & D>, id_gen: boolean = true)`
- `find<T = Data>(search: Search<T & D> = {}, context: VContext = {}, options: DbFindOpts<T & Data> = {}, findOpts: FindOpts<T & Data> = {})`
- `findOne<T = Data>(search: Search<T & D> = {}, context: VContext = {}, findOpts: FindOpts<T & Data> = {})`
- `update<T = Data>(search: Search<T & D>, updater: Updater<T & D>, context: VContext = {})`
- `updateOne<T = Data>(search: Search<T & D>, updater: Updater<T & D>, context: VContext = {})`
- `remove<T = Data>(search: Search<T & D>, context: VContext = {})`
- `removeOne<T = Data>(search: Search<T & D>, context: VContext = {})`
- `updateOneOrAdd<T = Data>(search: Search<T & D>, updater: Updater<T & D>, add_arg: Arg<T & D> = {}, context: VContext = {}, id_gen: boolean = true)`