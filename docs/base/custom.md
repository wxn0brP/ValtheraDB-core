# CustomActionsBase

An extended implementation of ActionsBase that provides concrete implementations for common database operations.

## Overview

CustomActionsBase extends ActionsBase and provides implementations for standard CRUD operations using a file-based CPU (CustomFileCpu). It's designed to work with file-based storage systems.

## Methods

- `add({ collection, data, id_gen = true }: VQuery)` - Add a new entry to the specified collection
- `find(query: VQuery)` - Find entries based on search criteria
- `findOne({ collection, search, context = {}, findOpts = {} }: VQuery)` - Find the first matching entry
- `update({ collection, search, updater, context = {} }: VQuery)` - Update entries based on search criteria
- `updateOne({ collection, search, updater, context = {} }: VQuery)` - Update the first matching entry
- `remove({ collection, search, context = {} }: VQuery)` - Remove entries based on search criteria
- `removeOne({ collection, search, context = {} }: VQuery)` - Remove the first matching entry