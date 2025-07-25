import type { WheelSegment } from '../types';

/**
 * Selects a segment based on weighted probability distribution
 *
 * @description Uses weighted random selection to choose a segment from the provided array.
 * Segments with higher weights have a proportionally higher chance of being selected.
 * Automatically filters out disabled segments before selection.
 *
 * @since 2025-07-25
 * @version 1.0.0
 *
 * @param segments - Array of wheel segments to choose from
 * @returns Object containing the selected segment and its original index
 * @throws {Error} When segments array is empty or no enabled segments exist
 *
 * @example
 * ```typescript
 * const segments = [
 *   { id: '1', text: 'Common', color: '#000', weight: 3 },
 *   { id: '2', text: 'Rare', color: '#000', weight: 1 }
 * ];
 * const result = getWeightedSegment(segments);
 * // 'Common' has 75% chance, 'Rare' has 25% chance
 * ```
 */
export function getWeightedSegment(segments: WheelSegment[]): {
  segment: WheelSegment;
  index: number;
} {
  if (segments.length === 0) {
    throw new Error('Cannot select from empty segments array');
  }

  const enabledSegments = segments.filter(segment => !segment.disabled);

  if (enabledSegments.length === 0) {
    throw new Error('No enabled segments available for selection');
  }

  const totalWeight = enabledSegments.reduce((sum, segment) => {
    return sum + (segment.weight ?? 1);
  }, 0);

  if (totalWeight <= 0) {
    const randomIndex = Math.floor(Math.random() * enabledSegments.length);
    const selectedSegment = enabledSegments[randomIndex]!;
    return {
      segment: selectedSegment,
      index: segments.indexOf(selectedSegment),
    };
  }

  const randomWeight = Math.random() * totalWeight;

  let currentWeight = 0;
  for (const segment of enabledSegments) {
    currentWeight += segment.weight ?? 1;

    if (randomWeight <= currentWeight) {
      return {
        segment,
        index: segments.indexOf(segment),
      };
    }
  }

  const fallbackSegment = enabledSegments[enabledSegments.length - 1]!;
  return {
    segment: fallbackSegment,
    index: segments.indexOf(fallbackSegment),
  };
}

/**
 * Calculates the final rotation angle to land on a specific segment
 *
 * @description Computes the rotation angle needed for the wheel to stop at a target segment.
 * Includes multiple full rotations plus a randomized offset within the target segment
 * to make the result appear natural and unpredictable. Supports pointer positioning
 * and predefined results by ID.
 *
 * @since 2025-07-25
 * @version 1.0.0
 *
 * @param segments - Array of wheel segments
 * @param targetIndexOrId - Index of the target segment or segment ID
 * @param spins - Number of full rotations to perform (default: 5)
 * @param pointerPosition - Position of the pointer ('top', 'right', 'bottom', 'left')
 * @returns Total rotation angle in degrees
 *
 * @example
 * ```typescript
 * const angle = calculateTargetAngle(segments, 2, 3, 'top');
 * // Returns angle for 3 full spins + rotation to segment 2 with top pointer
 * ```
 */
export function calculateTargetAngle(
  segments: WheelSegment[],
  targetIndexOrId: number | string,
  spins = 5,
  pointerPosition: 'top' | 'right' | 'bottom' | 'left' = 'top'
): number {
  /** Find target index */
  let targetIndex: number;
  if (typeof targetIndexOrId === 'string') {
    /** Find by ID */
    targetIndex = segments.findIndex(segment => segment.id === targetIndexOrId);
    if (targetIndex === -1) {
      throw new Error(`Segment with ID "${targetIndexOrId}" not found`);
    }
  } else {
    /** Use provided index */
    targetIndex = targetIndexOrId;
    if (targetIndex < 0 || targetIndex >= segments.length) {
      throw new Error(`Target index ${targetIndex} is out of bounds`);
    }
  }

  /** Check if target segment is disabled - this should be handled by caller */
  if (segments[targetIndex]?.disabled) {
    throw new Error(`Target segment is disabled and cannot be targeted`);
  }

  const weights = segments.map(segment => segment.weight ?? 1);
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);

  let currentAngle = 0;
  for (let i = 0; i < targetIndex; i++) {
    const segmentAngle = (weights[i]! / totalWeight) * 360;
    currentAngle += segmentAngle;
  }

  const targetSegmentAngle = (weights[targetIndex]! / totalWeight) * 360;
  const centerAngle = currentAngle + targetSegmentAngle / 2;

  /** Adjust for pointer position - add because we're setting where the wheel should stop */
  const pointerOffset = getPointerOffset(pointerPosition);
  const adjustedAngle = (centerAngle + pointerOffset) % 360;

  const randomOffset = (Math.random() - 0.5) * targetSegmentAngle * 0.8;
  return spins * 360 + adjustedAngle + randomOffset;
}

/**
 * Gets the angle offset for different pointer positions
 * 
 * @param position - Pointer position ('top', 'right', 'bottom', 'left')
 * @returns Angle offset in degrees
 */
function getPointerOffset(position: 'top' | 'right' | 'bottom' | 'left'): number {
  switch (position) {
    case 'top': return 0;      // No offset, pointer at top (12 o'clock)
    case 'right': return 90;   // 90° offset, pointer at right (3 o'clock)  
    case 'bottom': return 180; // 180° offset, pointer at bottom (6 o'clock)
    case 'left': return 270;   // 270° offset, pointer at left (9 o'clock)
    default: return 0;
  }
}

/**
 * Determines which segment is positioned at a given rotation angle
 *
 * @description Calculates which segment is under the pointer at a specific wheel rotation.
 * Takes into account the wheel's coordinate system and pointer position to determine
 * the correct segment. Used to calculate final results after spinning.
 *
 * @since 2025-07-25
 * @version 1.0.0
 *
 * @param segments - Array of wheel segments
 * @param angle - Current rotation angle in degrees
 * @param pointerPosition - Position of the pointer ('top', 'right', 'bottom', 'left')
 * @returns Object containing the segment at the given angle and its index
 *
 * @example
 * ```typescript
 * const result = getSegmentAtAngle(segments, 45, 'top');
 * // Returns the segment positioned at 45° rotation with top pointer
 * ```
 */
export function getSegmentAtAngle(
  segments: WheelSegment[],
  angle: number,
  pointerPosition: 'top' | 'right' | 'bottom' | 'left' = 'top'
): {
  segment: WheelSegment;
  index: number;
} {
  let normalizedAngle = ((angle % 360) + 360) % 360;

  /** Adjust for pointer position - subtract because we're finding what's under the pointer */
  const pointerOffset = getPointerOffset(pointerPosition);
  normalizedAngle = (normalizedAngle - pointerOffset + 360) % 360;

  /** Convert to wheel coordinate system (0° at top, clockwise) */
  normalizedAngle = (270 - normalizedAngle + 360) % 360;

  const weights = segments.map(segment => segment.weight ?? 1);
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);

  let currentAngle = 0;
  let selectedSegment: WheelSegment | null = null;
  let selectedIndex = -1;

  for (let i = 0; i < segments.length; i++) {
    const segmentAngle = (weights[i]! / totalWeight) * 360;
    const segmentEndAngle = currentAngle + segmentAngle;

    if (normalizedAngle >= currentAngle && normalizedAngle < segmentEndAngle) {
      selectedSegment = segments[i]!;
      selectedIndex = i;
      break;
    }

    currentAngle = segmentEndAngle;
  }

  /** If no segment found, default to last segment */
  if (selectedSegment === null) {
    selectedSegment = segments[segments.length - 1]!;
    selectedIndex = segments.length - 1;
  }

  return {
    segment: selectedSegment,
    index: selectedIndex,
  };
}
