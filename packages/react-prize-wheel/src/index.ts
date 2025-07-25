/**
 * @fileoverview React Prize Wheel - A customizable, performant spinning wheel component
 *
 * @description This library provides a complete solution for creating interactive prize wheels
 * in React applications. Features include:
 * - Customizable segments with colors, text, and weights
 * - Smooth animations with configurable easing
 * - Weighted probability system for fair/unfair distributions
 * - Accessible and responsive design
 * - TypeScript support with comprehensive type definitions
 *
 * @author SensitiveWebUser
 * @since 2025-07-25
 * @version 1.0.0
 *
 * @example
 * ```tsx
 * import { SpinWheel } from '@sensitiveweb/react-prize-wheel';
 *
 * const segments = [
 *   { id: '1', text: 'Prize 1', color: '#ff6b6b' },
 *   { id: '2', text: 'Prize 2', color: '#4ecdc4' }
 * ];
 *
 * function App() {
 *   return (
 *     <SpinWheel
 *       segments={segments}
 *       onSpinComplete={(result) => console.log('Winner:', result)}
 *     />
 *   );
 * }
 * ```
 */

/** Main component export */
export { SpinWheel } from './components/SpinWheel';

/** Hook export for advanced usage */
export { useSpinWheel } from './hooks/useSpinWheel';

/** Type definitions for TypeScript users */
export type {
  AnimationConfig,
  PointerConfig,
  SpinResult,
  SpinWheelProps,
  WheelSegment,
  WheelTheme,
} from './types';

/** Utility functions for custom implementations */
export {
  calculateTargetAngle,
  getSegmentAtAngle,
  getWeightedSegment,
} from './utils/selection';

/** Library version */
export const VERSION = '1.0.0';
