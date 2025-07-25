import type { WheelSegment } from '../types';

/**
 * Selects a segment based on weighted probability distribution
 *
 * @description Uses weighted random selection to choose a segment from the provided array.
 * Segments with higher weights have a proportionally higher chance of being selected.
 * Automatically filters out disabled segments before selection.
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
 * to make the result appear natural and unpredictable.
 *
 * @param segments - Array of wheel segments
 * @param targetIndex - Index of the target segment to land on
 * @param spins - Number of full rotations to perform (default: 5)
 * @returns Total rotation angle in degrees
 *
 * @example
 * ```typescript
 * const angle = calculateTargetAngle(segments, 2, 3);
 * // Returns angle for 3 full spins + rotation to segment 2
 * ```
 */
export function calculateTargetAngle(
  segments: WheelSegment[],
  targetIndex: number,
  spins = 5
): number {
  const weights = segments.map(segment => segment.weight ?? 1);
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);

  let currentAngle = 0;
  for (let i = 0; i < targetIndex; i++) {
    const segmentAngle = (weights[i]! / totalWeight) * 360;
    currentAngle += segmentAngle;
  }

  const targetSegmentAngle = (weights[targetIndex]! / totalWeight) * 360;
  const centerAngle = currentAngle + targetSegmentAngle / 2;

  const randomOffset = (Math.random() - 0.5) * targetSegmentAngle * 0.8;
  return spins * 360 + centerAngle + randomOffset;
}

/**
 * Determines which segment is positioned at a given rotation angle
 *
 * @description Calculates which segment is under the pointer at a specific wheel rotation.
 * Takes into account the wheel's coordinate system and pointer position to determine
 * the correct segment. Used to calculate final results after spinning.
 *
 * @param segments - Array of wheel segments
 * @param angle - Current rotation angle in degrees
 * @returns Object containing the segment at the given angle and its index
 *
 * @example
 * ```typescript
 * const result = getSegmentAtAngle(segments, 45);
 * // Returns the segment positioned at 45° rotation
 * ```
 */
export function getSegmentAtAngle(
  segments: WheelSegment[],
  angle: number
): {
  segment: WheelSegment;
  index: number;
} {
  let normalizedAngle = ((angle % 360) + 360) % 360;

  normalizedAngle = (270 - normalizedAngle + 360) % 360;

  const weights = segments.map(segment => segment.weight ?? 1);
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);

  let currentAngle = 0;

  for (let i = 0; i < segments.length; i++) {
    const segmentAngle = (weights[i]! / totalWeight) * 360;
    const segmentEndAngle = currentAngle + segmentAngle;

    if (normalizedAngle >= currentAngle && normalizedAngle < segmentEndAngle) {
      return {
        segment: segments[i]!,
        index: i,
      };
    }

    currentAngle = segmentEndAngle;
  }

  return {
    segment: segments[segments.length - 1]!,
    index: segments.length - 1,
  };
}
