import { describe, expect, it } from 'vitest';
import type { WheelSegment } from '../types';
import { calculateTargetAngle, getSegmentAtAngle, getWeightedSegment } from '../utils/selection';

describe('Selection Utils', () => {
  const sampleSegments: WheelSegment[] = [
    { id: '1', text: 'Prize 1', color: '#ff0000', weight: 1 },
    { id: '2', text: 'Prize 2', color: '#00ff00', weight: 2 },
    { id: '3', text: 'Prize 3', color: '#0000ff', weight: 1 },
  ];

  describe('getWeightedSegment', () => {
    it('should throw error for empty segments', () => {
      expect(() => getWeightedSegment([])).toThrow('Cannot select from empty segments array');
    });

    it('should throw error when all segments are disabled', () => {
      const disabledSegments = sampleSegments.map(s => ({ ...s, disabled: true }));
      expect(() => getWeightedSegment(disabledSegments)).toThrow(
        'No enabled segments available for selection'
      );
    });

    it('should return a valid segment and index', () => {
      const result = getWeightedSegment(sampleSegments);
      expect(result.segment).toBeDefined();
      expect(result.index).toBeGreaterThanOrEqual(0);
      expect(result.index).toBeLessThan(sampleSegments.length);
    });

    it('should exclude disabled segments', () => {
      const segmentsWithDisabled = [
        ...sampleSegments,
        { id: '4', text: 'Disabled', color: '#000000', disabled: true },
      ];
      const result = getWeightedSegment(segmentsWithDisabled);
      expect(result.segment.disabled).not.toBe(true);
    });
  });

  describe('calculateTargetAngle', () => {
    it('should return a positive angle', () => {
      const angle = calculateTargetAngle(sampleSegments, 0);
      expect(angle).toBeGreaterThan(0);
    });

    it('should include multiple rotations', () => {
      const angle = calculateTargetAngle(sampleSegments, 0, 5);
      expect(angle).toBeGreaterThan(5 * 360);
    });
  });

  describe('getSegmentAtAngle', () => {
    it('should return a valid segment for any angle', () => {
      const result = getSegmentAtAngle(sampleSegments, 45);
      expect(result.segment).toBeDefined();
      expect(result.index).toBeGreaterThanOrEqual(0);
      expect(result.index).toBeLessThan(sampleSegments.length);
    });

    it('should handle angles over 360 degrees', () => {
      const result1 = getSegmentAtAngle(sampleSegments, 45);
      const result2 = getSegmentAtAngle(sampleSegments, 45 + 360);
      expect(result1.index).toBe(result2.index);
    });

    it('should handle negative angles', () => {
      const result = getSegmentAtAngle(sampleSegments, -45);
      expect(result.segment).toBeDefined();
      expect(result.index).toBeGreaterThanOrEqual(0);
    });
  });
});
