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

export { SpinWheel } from './components/SpinWheel';

export { useSpinWheel } from './hooks/useSpinWheel';

export type {
  AnimationConfig,
  PointerConfig,
  SpinResult,
  SpinWheelProps,
  WheelSegment,
  WheelTheme,
} from './types';

export {
  calculateTargetAngle,
  getSegmentAtAngle,
  getWeightedSegment,
} from './utils/selection';

export const VERSION = '1.0.0';
