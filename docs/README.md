# Documentation Index

## Overview

This documentation covers the core modules of the database system.

## Table of Contents

- [Index (Main Exports)](index.md)
- [Base Classes](#base-classes)
  - [ActionsBase](base/actions.md) - Base class for database actions
  - [CustomActionsBase](base/custom.md) - Extended actions with implementations
- [Database Implementations](#database-implementations)
  - [ValtheraClass](db/valthera.md) - Main database class
  - [ValtheraMemory](db/memory.md) - In-memory database
  - [RoutedStorage](db/routedStorage.md) - Database router
- [Core Components](#core-components)
  - [CustomFileCpu](customFileCpu.md) - File-based operations
  - [CollectionManager](helpers/CollectionManager.md) - Collection operations helper
  - [Executor](helpers/executor.md) - Operation queuing system
  - [Relation](helpers/relation.md) - Relationship management
- [Helpers](#helpers)
  - [Forge](helpers/forge.md) - Dynamic instance creation
  - [GenId](helpers/gen.md) - ID generation
  - [UpdateOneOrAdd](helpers/updateOneOrAdd.md) - Update or add helper
- [Types](types/index.md) - Type definitions
- [Utilities](utils/index.md) - Utility functions

Each module documentation provides an overview of its purpose, API, and usage patterns.