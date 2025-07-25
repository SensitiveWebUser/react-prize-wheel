# React Prize Wheel

A simple, performant React prize wheel component for creating interactive spinning wheels.

[![npm version](https://badge.fury.io/js/%40sensitiveweb%2Freact-prize-wheel.svg)](https://badge.fury.io/js/%40sensitiveweb%2Freact-prize-wheel)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@sensitiveweb/react-prize-wheel)](https://bundlephobia.com/package/@sensitiveweb/react-prize-wheel)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)

## ✨ Features

- 🎯 **High Performance**: 60fps animations with Canvas rendering
- 📱 **Responsive**: Works seamlessly on desktop, tablet, and mobile
- 🎨 **Customizable**: Extensive styling and configuration options
- 🔧 **TypeScript**: Full TypeScript support
- 📦 **Lightweight**: < 50KB gzipped
- 🧪 **Well Tested**: Comprehensive test coverage

## 🚀 Quick Start

### Installation

```bash
npm install @sensitiveweb/react-prize-wheel
# or
yarn add @sensitiveweb/react-prize-wheel
```

### Basic Usage

```tsx
import React from 'react';
import { SpinWheel } from '@sensitiveweb/react-prize-wheel';

const segments = [
  { id: '1', text: 'Prize 1', color: '#ff6b6b' },
  { id: '2', text: 'Prize 2', color: '#4ecdc4' },
  { id: '3', text: 'Prize 3', color: '#45b7d1' },
  { id: '4', text: 'Prize 4', color: '#96ceb4' },
  { id: '5', text: 'Prize 5', color: '#feca57' },
  { id: '6', text: 'Prize 6', color: '#ff9ff3' },
];

function App() {
  const handleSpinComplete = (result) => {
    console.log('Winner:', result);
  };

  return (
    <SpinWheel
      segments={segments}
      onSpinComplete={handleSpinComplete}
      size={400}
    />
  );
}
```

## 📖 API Reference

### SpinWheelProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `segments` | `WheelSegment[]` | - | Array of segments to display |
| `size` | `number` | `400` | Size of the wheel in pixels |
| `onSpinComplete` | `(result: SpinResult) => void` | - | Callback when spin completes |
| `onSpinStart` | `() => void` | - | Callback when spin starts |
| `animation` | `Partial<AnimationConfig>` | - | Animation configuration |
| `pointer` | `Partial<PointerConfig>` | - | Pointer configuration |
| `theme` | `Partial<WheelTheme>` | - | Theme configuration |
| `disabled` | `boolean` | `false` | Whether the wheel is disabled |
| `showSpinButton` | `boolean` | `true` | Whether to show the spin button |
| `spinButtonText` | `string` | `'SPIN'` | Custom spin button text |
| `predefinedResult` | `number \| string` | - | Predefined result for testing |

### WheelSegment

```tsx
interface WheelSegment {
  id: string;              // Unique identifier
  text: string;            // Display text
  color: string;           // Background color
  textColor?: string;      // Text color (auto-calculated if not provided)
  weight?: number;         // Probability weight (default: 1)
  borderColor?: string;    // Border color
  borderWidth?: number;    // Border width in pixels
  disabled?: boolean;      // Whether segment is disabled
}
```

### SpinResult

```tsx
interface SpinResult {
  segment: WheelSegment;   // The selected segment
  index: number;           // Index of the selected segment
  angle: number;           // Final rotation angle
  duration: number;        // Duration of the spin
  timestamp: number;       // Timestamp when completed
}
```

## 🎨 Customization

### Weighted Segments

```tsx
const weightedSegments = [
  { id: '1', text: 'Common Prize', color: '#e74c3c', weight: 3 },
  { id: '2', text: 'Rare Prize', color: '#f39c12', weight: 1 },
  { id: '3', text: 'Epic Prize', color: '#9b59b6', weight: 0.5 },
];
```

### Animation Configuration

```tsx
<SpinWheel
  segments={segments}
  animation={{
    duration: 4000,        // 4 seconds
    easing: 'ease-out',    // CSS easing function
    spins: 8,              // Number of rotations
  }}
/>
```

### Pointer Customization

```tsx
<SpinWheel
  segments={segments}
  pointer={{
    style: 'arrow',        // 'arrow', 'triangle', 'circle'
    color: '#e74c3c',     // Pointer color
    size: 25,             // Size in pixels
    position: 'top',      // 'top', 'right', 'bottom', 'left'
  }}
/>
```

### Theme Configuration

```tsx
<SpinWheel
  segments={segments}
  theme={{
    background: '#ffffff', // Wheel background
    border: '#dee2e6',     // Border color
    text: '#212529',       // Text color
  }}
/>
```

## 🧪 Testing

To use a predefined result for testing:

```tsx
// By segment ID
<SpinWheel segments={segments} predefinedResult="segment-id" />

// By segment index
<SpinWheel segments={segments} predefinedResult={2} />
```

## 📊 Performance

- **Bundle Size**: < 50KB gzipped
- **Animation**: 60fps with Canvas rendering
- **Memory**: Optimized for minimal memory usage
- **Mobile**: Touch-friendly and responsive

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

MIT © [SensitiveWebUser](https://github.com/SensitiveWebUser)

## 🆘 Support

- [GitHub Issues](https://github.com/SensitiveWebUser/react-prize-wheel/issues)
- [Demo](https://sensitiveweb.github.io/react-prize-wheel)

---

Made with ❤️ by the SensitiveWeb team
