# Forge

Helper functions for creating dynamic database instances.

## Overview

Forge provides functions for creating database instances with dynamic property access for collections.

## Functions

### forgeValthera

```typescript
function forgeValthera<T extends string>(target: ValtheraCompatible)
```

Creates a proxy that allows accessing collections as properties.

### forgeTypedValthera

```typescript
function forgeTypedValthera<T extends Record<string, Data>>(target: ValtheraCompatible)
```

Creates a typed proxy for accessing collections as properties.