# React Prize Wheel Workspace

A comprehensive monorepo for the React Prize Wheel component library and demo application.

## 🏗️ Project Structure

This project uses a monorepo structure with pnpm workspaces:

```
├── packages/
│   ├── react-prize-wheel/     # Core component library
│   └── demo/                  # Demo application
├── package.json               # Workspace configuration
├── pnpm-workspace.yaml       # pnpm workspace config
├── biome.json                # Code formatting & linting
└── README.md                 # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 16.0.0
- pnpm >= 8.0.0

### Installation

```bash
# Clone the repository
git clone https://github.com/SensitiveWebUser/react-prize-wheel.git
cd react-prize-wheel

# Install dependencies
pnpm install
```

### Development

```bash
# Start the demo application
pnpm run dev:demo

# Build the library
pnpm run build:lib

# Run tests
pnpm test

# Lint and format code
pnpm run check
pnpm run check:fix
```

## 📦 Packages

### @sensitiveweb/react-prize-wheel

The core React component library for creating interactive spinning wheels.

**Key Features:**

- 🎯 High Performance: 60fps animations with Canvas rendering
- 📱 Responsive: Works on desktop, tablet, and mobile
- 🎨 Customizable: Extensive styling options
- 🔧 TypeScript: Full type safety
- 📦 Lightweight: < 50KB gzipped

### Demo Application

A comprehensive demo showcasing all features of the React Prize Wheel component.

## 🛠️ Development Scripts

| Command | Description |
|---------|-------------|
| `pnpm run build` | Build the library package |
| `pnpm run build:lib` | Build library only |
| `pnpm run build:demo` | Build demo only |
| `pnpm run dev:lib` | Start library in watch mode |
| `pnpm run dev:demo` | Start demo development server |
| `pnpm test` | Run tests |
| `pnpm run lint` | Run linter |
| `pnpm run format` | Format code |
| `pnpm run check` | Run all checks (lint + format) |
| `pnpm run check:fix` | Fix all auto-fixable issues |

## 🧪 Testing

The project uses Vitest for testing with comprehensive coverage:

```bash
# Run tests
pnpm test

# Run tests with coverage
pnpm run test:coverage
```

## 🔧 Code Quality

This project uses [Biome](https://biomejs.dev/) for:

- Code formatting
- Linting
- Import organization

Configuration is in `biome.json`.

## 📝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make changes and add tests
4. Run quality checks: `pnpm run check`
5. Commit changes: `git commit -am 'Add my feature'`
6. Push to branch: `git push origin feature/my-feature`
7. Submit a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Support

- 📧 Email: [Create an issue](https://github.com/SensitiveWebUser/react-prize-wheel/issues)
- 🐛 Bug Reports: [GitHub Issues](https://github.com/SensitiveWebUser/react-prize-wheel/issues)
- 💡 Feature Requests: [GitHub Discussions](https://github.com/SensitiveWebUser/react-prize-wheel/discussions)
