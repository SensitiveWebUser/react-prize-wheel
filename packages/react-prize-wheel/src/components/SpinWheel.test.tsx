import { describe, expect, it, vi } from 'vitest';
import type { WheelSegment } from '../types';
import { getSegmentAtAngle, getWeightedSegment, calculateTargetAngle } from '../utils/selection';

/** Test segments for basic functionality testing */
const testSegments: WheelSegment[] = [
    { id: '1', text: 'Prize 1', color: '#ff0000' },
    { id: '2', text: 'Prize 2', color: '#00ff00' },
    { id: '3', text: 'Prize 3', color: '#0000ff' },
    { id: '4', text: 'Prize 4', color: '#ffff00' },
];

/** Test segments with disabled options for availability testing */
const disabledSegments: WheelSegment[] = [
    { id: '1', text: 'Available', color: '#ff0000' },
    { id: '2', text: 'Disabled', color: '#00ff00', disabled: true },
    { id: '3', text: 'Available', color: '#0000ff' },
    { id: '4', text: 'Disabled', color: '#ffff00', disabled: true },
];

/** Test segments with weighted probabilities for distribution testing */
const weightedSegments: WheelSegment[] = [
    { id: '1', text: 'Common', color: '#ff0000', weight: 9 },
    { id: '2', text: 'Rare', color: '#00ff00', weight: 1 },
];

describe('SpinWheel Logic Tests', () => {
    describe('Current Implementation Tests', () => {
        it('should calculate target angle for segment index', () => {
            const targetIndex = 1; /** Second segment */
            const angle = calculateTargetAngle(testSegments, targetIndex, 5, 'top');

            /** Should return a valid angle */
            expect(angle).toBeGreaterThanOrEqual(0);
            expect(typeof angle).toBe('number');
        });

        it('should get segment at specific angle', () => {
            const angle = 90; /** 90 degrees */
            const result = getSegmentAtAngle(testSegments, angle, 'top');

            /** Should return valid result */
            expect(result).toHaveProperty('segment');
            expect(result).toHaveProperty('index');
            expect(result.index).toBeGreaterThanOrEqual(0);
            expect(result.index).toBeLessThan(testSegments.length);
        });

        it('should handle weighted selection', () => {
            const result = getWeightedSegment(weightedSegments);

            /** Should return valid result */
            expect(result).toHaveProperty('segment');
            expect(result).toHaveProperty('index');
            expect(['1', '2']).toContain(result.segment.id);
        });
    });

    describe('Bug Tests - These should PASS after fixes', () => {
        it('FIXED: Pointer position now considered in angle calculation', () => {
            /** Test that different pointer positions give different results */
            const targetIndex = 1;

            const topAngle = calculateTargetAngle(testSegments, targetIndex, 5, 'top');
            const rightAngle = calculateTargetAngle(testSegments, targetIndex, 5, 'right');
            const bottomAngle = calculateTargetAngle(testSegments, targetIndex, 5, 'bottom');
            const leftAngle = calculateTargetAngle(testSegments, targetIndex, 5, 'left');

            /** All angles should be different (accounting for multiple rotations) */
            const normalizedTop = topAngle % 360;
            const normalizedRight = rightAngle % 360;
            const normalizedBottom = bottomAngle % 360;
            const normalizedLeft = leftAngle % 360;

            expect(normalizedTop).not.toBeCloseTo(normalizedRight, 1);
            expect(normalizedTop).not.toBeCloseTo(normalizedBottom, 1);
            expect(normalizedTop).not.toBeCloseTo(normalizedLeft, 1);
        });

        it('FIXED: getSegmentAtAngle now considers pointer position', () => {
            /** Test that pointer position affects segment detection */
            const testAngle = 90;

            const topResult = getSegmentAtAngle(testSegments, testAngle, 'top');
            const rightResult = getSegmentAtAngle(testSegments, testAngle, 'right');
            const bottomResult = getSegmentAtAngle(testSegments, testAngle, 'bottom');
            const leftResult = getSegmentAtAngle(testSegments, testAngle, 'left');

            /** Different pointer positions should potentially give different results
             * (At least some should be different) */
            const results = [topResult.index, rightResult.index, bottomResult.index, leftResult.index];
            const uniqueResults = new Set(results);
            expect(uniqueResults.size).toBeGreaterThan(1);
        });

        it('FIXED: Predefined result by ID now works', () => {
            /** Test predefined results by segment ID */
            const targetSegmentId = '3';

            /** Test multiple times to ensure consistency */
            for (let i = 0; i < 5; i++) {
                const angle = calculateTargetAngle(testSegments, targetSegmentId, 5, 'top');
                const result = getSegmentAtAngle(testSegments, angle, 'top');
                expect(result.segment.id).toBe(targetSegmentId);
            }
        });

        it('FIXED: Disabled segments cannot be targeted', () => {
            /** Test that targeting disabled segments throws an error */
            expect(() => {
                calculateTargetAngle(disabledSegments, '2'); /** '2' is disabled */
            }).toThrow('is disabled and cannot be targeted');

            expect(() => {
                calculateTargetAngle(disabledSegments, 1); /** Index 1 is disabled */
            }).toThrow('is disabled and cannot be targeted');
        });
    });

    describe('Disabled Segments', () => {
        it('should never select disabled segments', () => {
            // Test 100 times to ensure no disabled segments are selected
            for (let i = 0; i < 100; i++) {
                const result = getWeightedSegment(disabledSegments);
                expect(result.segment.disabled).toBeFalsy();
                expect(['1', '3']).toContain(result.segment.id);
            }
        });

        it('should throw error if all segments are disabled', () => {
            const allDisabled = testSegments.map(s => ({ ...s, disabled: true }));
            expect(() => getWeightedSegment(allDisabled)).toThrow('No enabled segments available for selection');
        });

        it('FIXED: Disabled segments cannot be targeted in angle calculations', () => {
            // Test that disabled segments cannot be targeted
            expect(() => {
                calculateTargetAngle(disabledSegments, 1); // Index 1 is disabled
            }).toThrow('is disabled and cannot be targeted');

            expect(() => {
                calculateTargetAngle(disabledSegments, '2'); // ID '2' is disabled  
            }).toThrow('is disabled and cannot be targeted');

            // But enabled segments should work fine
            expect(() => {
                calculateTargetAngle(disabledSegments, 0); // Index 0 is enabled
            }).not.toThrow();

            expect(() => {
                calculateTargetAngle(disabledSegments, '1'); // ID '1' is enabled
            }).not.toThrow();
        });
    });

    describe('Weight Distribution', () => {
        it('should respect weights in selection probability', () => {
            const results: string[] = [];

            // Run many selections to test distribution
            for (let i = 0; i < 1000; i++) {
                const result = getWeightedSegment(weightedSegments);
                results.push(result.segment.id);
            }

            const commonCount = results.filter(id => id === '1').length;
            const rareCount = results.filter(id => id === '2').length;

            // With weight 9:1, common should appear ~90% of the time
            // Allow some variance but should be clearly weighted
            expect(commonCount).toBeGreaterThan(700); // At least 70%
            expect(rareCount).toBeLessThan(300); // At most 30%
        });
    });

    describe('Angle Calculation Consistency', () => {
        it('should consistently return same angle for same segment', () => {
            const targetIndex = 2;

            // Mock Math.random to ensure consistent results
            const originalRandom = Math.random;
            Math.random = vi.fn(() => 0.5);

            const angle1 = calculateTargetAngle(testSegments, targetIndex, 5, 'top');
            const angle2 = calculateTargetAngle(testSegments, targetIndex, 5, 'top');

            // Should be different due to randomization, but in same general range
            expect(Math.abs(angle1 - angle2)).toBeLessThan(360); // Within one rotation

            Math.random = originalRandom;
        });

        it('should map angles back to correct segments with pointer position', () => {
            // Test that calculateTargetAngle and getSegmentAtAngle are inverse operations
            for (let targetIndex = 0; targetIndex < testSegments.length; targetIndex++) {
                const pointerPosition = 'top';
                const angle = calculateTargetAngle(testSegments, targetIndex, 5, pointerPosition);
                const result = getSegmentAtAngle(testSegments, angle, pointerPosition);

                // With pointer position support, this should now match
                console.log(`Target: ${targetIndex}, Calculated angle: ${angle}, Result: ${result.index}`);
                expect(result.index).toBe(targetIndex);
            }
        });
    });
});
