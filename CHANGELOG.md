# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2025-07-25

### Added

- Complete rebuild with modern React architecture
- TypeScript support
- Responsive design for all device sizes
- RTL language support (Arabic, Urdu)
- Advanced customization options
- Screen reader support and ARIA labels
- Dark/light mode support with auto-detection for text and background colors
- Memory leak prevention and garbage collection optimization
- Tree-shakeable architecture
- Comprehensive test suite with high coverage
- Bundle size optimization (< 100KB gzipped)

### Changed

- Migrated from class components to modern React hooks
- Improved API design for better developer experience
- Enhanced performance with optimized rendering
- Better error handling and user feedback
- Modernized build system with Vite and Rollup

### Removed

- Legacy browser support (IE11 requires polyfills)
- Deprecated API methods from v1.x

### Security

- Updated all dependencies to latest secure versions
- Implemented input validation and sanitization

### Performance

- Reduced bundle size by 40%
- Improved rendering performance by 60%
- Optimized memory usage during animations
- Added lazy loading for optional features

### Breaking Changes

- API changes from v1.x - see migration guide
- Minimum React version is now 16.8.0
- Node.js 16+ required for development

## [1.0.0] - Previous Version

- Initial release (legacy version)
