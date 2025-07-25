import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { AnimationConfig, SpinResult, WheelSegment, WheelState } from '../types';
import { calculateTargetAngle, getSegmentAtAngle, getWeightedSegment } from '../utils/selection';
import { validateSegments } from '../utils/validation';

/**
 * Configuration options for the useSpinWheel hook
 */
interface UseSpinWheelOptions {
  /** Array of wheel segments to display */
  segments: WheelSegment[];
  /** Animation configuration (duration, easing, spins) */
  animation?: Partial<AnimationConfig>;
  /** Callback triggered when spin starts */
  onSpinStart?: () => void;
  /** Callback triggered when spin completes with result */
  onSpinComplete?: (result: SpinResult) => void;
  /** Whether the wheel is disabled */
  disabled?: boolean;
  /** Predefined result for testing (segment index or ID) */
  predefinedResult?: number | string;
}

/**
 * React hook for managing spin wheel state and animations
 *
 * @description Provides all the logic needed for a spinning wheel including:
 * - State management (rotation, spinning status, results)
 * - Animation with customizable easing and duration
 * - Weighted random selection with validation
 * - Segment validation and error handling
 *
 * @example
 * ```tsx
 * const { rotation, isSpinning, spin, lastResult } = useSpinWheel({
 *   segments: [
 *     { id: '1', text: 'Prize 1', color: '#ff0000' },
 *     { id: '2', text: 'Prize 2', color: '#00ff00' }
 *   ],
 *   onSpinComplete: (result) => console.log('Winner:', result.segment.text)
 * });
 * ```
 *
 * @param options - Configuration options for the wheel behavior
 * @returns Object containing wheel state, validation results, and control functions
 */

export function useSpinWheel({
  segments,
  animation = {},
  onSpinStart,
  onSpinComplete,
  disabled = false,
  predefinedResult,
}: UseSpinWheelOptions) {
  const defaultAnimation: AnimationConfig = useMemo(
    () => ({
      duration: 3000,
      easing: 'ease-out',
      spins: 5,
      ...animation,
    }),
    [animation]
  );

  const [state, setState] = useState<WheelState>({
    rotation: 0,
    isSpinning: false,
    lastResult: null,
    animationStartTime: 0,
    progress: 0,
  });

  const animationFrameRef = useRef<number>();
  const startTimeRef = useRef<number>(0);
  const startRotationRef = useRef<number>(0);
  const targetRotationRef = useRef<number>(0);

  const validation = validateSegments(segments);

  /**
   * Calculates the target segment for the spin result
   * @description Determines which segment should be selected based on predefined result
   * or weighted random selection. Handles both segment ID strings and numeric indices.
   * @returns Object containing target segment and its index
   */
  const calculateTarget = useCallback(() => {
    if (predefinedResult !== undefined) {
      if (typeof predefinedResult === 'string') {
        const targetIndex = segments.findIndex(s => s.id === predefinedResult);
        if (targetIndex !== -1) {
          return { targetIndex, targetSegment: segments[targetIndex]! };
        }
      } else if (
        typeof predefinedResult === 'number' &&
        predefinedResult >= 0 &&
        predefinedResult < segments.length
      ) {
        return {
          targetIndex: predefinedResult,
          targetSegment: segments[predefinedResult]!,
        };
      }
    }

    const selection = getWeightedSegment(segments);
    return {
      targetIndex: selection.index,
      targetSegment: selection.segment,
    };
  }, [segments, predefinedResult]);

  /**
   * Applies easing function to animation progress
   * @param progress - Animation progress value between 0 and 1
   * @param easing - Type of easing function to apply
   * @returns Eased progress value
   */
  const applyEasing = useCallback((progress: number, easing: string): number => {
    switch (easing) {
      case 'linear':
        return progress;
      case 'ease-in':
        return progress * progress;
      case 'ease-out':
        return 1 - (1 - progress) ** 2;
      case 'ease-in-out':
        return progress < 0.5 ? 2 * progress * progress : 1 - (-2 * progress + 2) ** 2 / 2;
      default:
        return progress;
    }
  }, []);

  /**
   * Animation frame function that handles the spinning animation
   * @param currentTime - Current timestamp from requestAnimationFrame
   * @description Updates wheel rotation using easing functions and manages animation lifecycle.
   * Triggers completion callback when animation finishes and calculates final result.
   */
  const animate = useCallback(
    (currentTime: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = currentTime;
      }

      const elapsed = currentTime - startTimeRef.current;
      const progress = Math.min(elapsed / defaultAnimation.duration, 1);

      const easedProgress = applyEasing(progress, defaultAnimation.easing);

      const rotationDelta = targetRotationRef.current - startRotationRef.current;
      const currentRotation = startRotationRef.current + rotationDelta * easedProgress;

      setState(prevState => ({
        ...prevState,
        rotation: currentRotation,
        progress: progress,
      }));

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        const finalAngle = currentRotation % 360;
        const result = getSegmentAtAngle(segments, finalAngle);

        const spinResult: SpinResult = {
          segment: result.segment,
          index: result.index,
          angle: finalAngle,
          duration: elapsed,
          timestamp: Date.now(),
        };

        setState(prevState => ({
          ...prevState,
          isSpinning: false,
          lastResult: spinResult,
          rotation: currentRotation,
        }));

        onSpinComplete?.(spinResult);
      }
    },
    [defaultAnimation, segments, onSpinComplete, applyEasing]
  );

  /**
   * Initiates a spin of the wheel
   * @description Starts the spinning animation by calculating target rotation,
   * setting up animation parameters, and beginning the animation loop.
   * Handles disabled state and validation checks.
   */
  const spin = useCallback(() => {
    if (disabled || state.isSpinning || !validation.isValid) {
      return;
    }

    const { targetIndex } = calculateTarget();
    const targetAngle = calculateTargetAngle(segments, targetIndex, defaultAnimation.spins);

    startTimeRef.current = 0;
    startRotationRef.current = state.rotation;
    targetRotationRef.current = state.rotation + targetAngle;

    setState(prevState => ({
      ...prevState,
      isSpinning: true,
      animationStartTime: Date.now(),
      progress: 0,
    }));

    onSpinStart?.();
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [
    disabled,
    state.isSpinning,
    state.rotation,
    validation.isValid,
    calculateTarget,
    segments,
    defaultAnimation,
    onSpinStart,
    animate,
  ]);

  /**
   * Stops the current animation and cleans up animation frame
   * @description Cancels any running animation frame to prevent memory leaks
   * and ensure proper cleanup when component unmounts or animation is interrupted.
   */
  const stopAnimation = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = undefined;
    }
  }, []);

  /**
   * Resets the wheel to its initial state
   * @description Stops any running animation and resets all state values
   * including rotation, spinning status, and last result.
   */
  const reset = useCallback(() => {
    stopAnimation();
    setState({
      rotation: 0,
      isSpinning: false,
      lastResult: null,
      animationStartTime: 0,
      progress: 0,
    });
  }, [stopAnimation]);

  useEffect(() => {
    return () => {
      stopAnimation();
    };
  }, [stopAnimation]);

  return {
    rotation: state.rotation,
    isSpinning: state.isSpinning,
    lastResult: state.lastResult,
    progress: state.progress,
    isValid: validation.isValid,
    validationErrors: validation.errors,
    spin,
    reset,
    animationConfig: defaultAnimation,
  };
}
