# @wxn0brp/db-core

Core runtime for [ValtheraDB](https://github.com/wxn0brP/ValtheraDB). This package contains the shared database logic that the higher-level Valthera packages build on.

It is usually not something you install directly unless you are:

- building a custom storage adapter
- extending the lower-level database runtime
- working on Valthera itself

## Install

```bash
npm install @wxn0brp/db-core
```

## What It Provides

- collection and document primitives
- query and update operators
- relation handling
- shared types used by the Valthera packages

## Package Note

If you are building an application, you probably want `@wxn0brp/db` instead of this package. `db-core` is the internal foundation.

## Documentation

See [typedoc](https://wxn0brp.github.io/ValtheraDB-core/).

## Contributing

Contributions are welcome! Please submit pull requests or open issues on GitHub.

## License

MIT. See [LICENSE](LICENSE).
