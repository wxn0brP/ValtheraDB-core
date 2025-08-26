# CustomFileCpu

A file-based CPU implementation for database operations.

## Overview

CustomFileCpu implements the FileCpu interface to provide file-based storage operations. It uses provided readFile and writeFile functions to interact with the file system.

See also:
- [FileCpu](types/fileCpu.md) - The interface this class implements
- [CustomActionsBase](base/custom.md) - Class that uses this CPU

## Constructor

```typescript
new CustomFileCpu(readFile: ReadFile, writeFile: WriteFile)
```

## Methods

- `add(file: string, data: Data): Promise<void>` - Add data to a file
- `find(file: string, arg: Search, context: VContext = {}, findOpts: FindOpts = {}): Promise<any[] | false>` - Find entries in a file
- `findOne(file: string, arg: Search, context: VContext = {}, findOpts: FindOpts = {}): Promise<any | false>` - Find one entry in a file
- `remove(file: string, one: boolean, arg: Search, context: VContext = {}): Promise<boolean>` - Remove entries from a file
- `update(file: string, one: boolean, arg: Search, updater: Updater, context: VContext = {}): Promise<boolean>` - Update entries in a file