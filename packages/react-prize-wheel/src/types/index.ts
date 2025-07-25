/**
 * Represents a single segment of the wheel
 * 
 * @since 2025-07-25
 * @interface WheelSegment
 */
export interface WheelSegment {
  /** Unique identifier for the segment */
  id: string;
  /** Display text for the segment */
  text: string;
  /** Background color of the segment */
  color: string;
  /** Text color (optional, defaults to contrast color) */
  textColor?: string;
  /** Weight for probability calculation (optional, defaults to 1) */
  weight?: number;
  /** Border color (optional) */
  borderColor?: string;
  /** Border width in pixels (optional) */
  borderWidth?: number;
  /** Whether this segment is disabled (optional) */
  disabled?: boolean;
}

/**
 * Result of a spin operation
 * 
 * @since 2025-07-25
 * @interface SpinResult
 */
export interface SpinResult {
  /** The selected segment */
  segment: WheelSegment;
  /** Index of the selected segment */
  index: number;
  /** Final rotation angle in degrees */
  angle: number;
  /** Duration of the spin in milliseconds */
  duration: number;
  /** Timestamp when the spin completed */
  timestamp: number;
}

/**
 * Animation configuration
 */
export interface AnimationConfig {
  /** Duration of the spin animation in milliseconds */
  duration: number;
  /** CSS easing function */
  easing: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
  /** Number of complete rotations before landing */
  spins: number;
}

/**
 * Pointer configuration
 */
export interface PointerConfig {
  /** Style of the pointer */
  style: 'arrow' | 'triangle' | 'circle';
  /** Color of the pointer */
  color: string;
  /** Size of the pointer in pixels */
  size: number;
  /** Position of the pointer */
  position: 'top' | 'right' | 'bottom' | 'left';
}

/**
 * Theme configuration for the wheel
 */
export interface WheelTheme {
  /** Background color */
  background: string;
  /** Border color */
  border: string;
  /** Text color for UI elements */
  text: string;
}

/**
 * Main props for the SpinWheel component
 * 
 * @since 2025-07-25
 * @interface SpinWheelProps
 */
export interface SpinWheelProps {
  /** Array of segments to display on the wheel */
  segments: WheelSegment[];
  /** Size of the wheel in pixels (default: 400) */
  size?: number;
  /** Callback when spin completes */
  onSpinComplete?: (result: SpinResult) => void;
  /** Callback when spin starts */
  onSpinStart?: () => void;
  /** Animation configuration */
  animation?: Partial<AnimationConfig>;
  /** Pointer configuration */
  pointer?: Partial<PointerConfig>;
  /** Theme configuration */
  theme?: Partial<WheelTheme>;
  /** Whether the wheel is disabled */
  disabled?: boolean;
  /** Custom CSS class name */
  className?: string;
  /** Custom inline styles */
  style?: { [key: string]: string | number; };
  /** Whether to show the spin button (default: true) */
  showSpinButton?: boolean;
  /** Custom spin button text */
  spinButtonText?: string;
  /** Predefined result for testing */
  predefinedResult?: number | string;
}

/**
 * Internal state interface for wheel animation and status tracking
 *
 * @description Represents the current state of the spinning wheel including
 * rotation position, animation status, and timing information. Used internally
 * by the useSpinWheel hook for state management.
 * 
 * @since 2025-07-25
 * @interface WheelState
 */
export interface WheelState {
  /** Current rotation angle in degrees */
  rotation: number;
  /** Whether the wheel is currently spinning/animating */
  isSpinning: boolean;
  /** Result of the last completed spin, null if no spin completed */
  lastResult: SpinResult | null;
  /** Timestamp when the current animation started */
  animationStartTime: number;
  /** Current animation progress as a value between 0 and 1 */
  progress: number;
}
