# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] (2026-02-07)

### Changed

- Bumped package version to `1.0.1`
- Updated dependency `yup` from `^0.32.11` to `^1.0.0`
- Updated `@types/node` in playground from `^20` to `^24.0.0`
- Updated Node.js version in CI workflows (`test` and `publish`) from `22` to `24`
- Updated devcontainer image from `javascript-node:22` to `javascript-node:24`
- Removed `push` trigger from Renovate workflow, leaving only scheduled runs

## [1.0.0] (2026-02-06)

### Added

- Custom checkbox list field for Strapi v5 Content Type Builder
- Multi-select interface with intuitive checkbox-based selection
- Flexible configuration for defining custom option lists per field instance
- Native integration with Strapi's Content Type Builder
- Full TypeScript support for type-safe development
- Playground environment for development and testing
- Watch mode for active development with automatic rebuilds
- Plugin linker support for local development workflow

### Documentation

- Comprehensive README with installation and usage instructions
- Development setup guide for contributors
- MIT License

[1.0.0]: https://code.popov.link/valentineus/strapi-plugin-checkbox-list/releases/tag/v1.0.0
[1.0.1]: https://code.popov.link/valentineus/strapi-plugin-checkbox-list/releases/tag/v1.0.1
