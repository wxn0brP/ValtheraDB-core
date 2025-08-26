# Relation

A helper for managing relationships between collections.

## Overview

Relation provides functionality for working with related data across collections, including one-to-one, one-to-many, and many-to-many relationships.

## Class: Relation

### Constructor

```typescript
new Relation(dbs: RelationTypes.DBS)
```

### Methods

- `findOne(path: RelationTypes.Path, search: Search, relations: RelationTypes.Relation, select?: string[][] | Record<string, any>)` - Find a single item with its related data
- `find(path: RelationTypes.Path, search: Search, relations: RelationTypes.Relation, select?: string[][] | Record<string, any>, findOpts: DbFindOpts = {})` - Find items with their related data