# Contributing 🤝

This project uses [Conventional Commits](https://www.conventionalcommits.org/) for automated versioning and releases. When making commits, please follow this format:

- `feat:` for new features (triggers minor version bump)
- `fix:` for bug fixes (triggers patch version bump)
- `BREAKING CHANGE:` for breaking changes (triggers major version bump)
- `docs:`, `style:`, `refactor:`, `test:`, `chore:` for other changes (no version bump)

Examples:

```text
feat: add support for new login form
fix: resolve virtual keyboard detection issue
docs: update installation instructions
```

Releases are automatically created when changes are pushed to the main branch using semantic-release.
