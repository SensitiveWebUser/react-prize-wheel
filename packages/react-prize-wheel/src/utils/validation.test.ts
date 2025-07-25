import { describe, expect, it } from 'vitest';
import type { WheelSegment } from '../types';
import { sanitizeText, validateColor, validateSegments } from '../utils/validation';

describe('Validation Utils', () => {
  describe('sanitizeText', () => {
    it('should remove dangerous characters', () => {
      expect(sanitizeText('<script>alert("xss")</script>')).toBe('scriptalert(xss)/script');
      expect(sanitizeText('Safe text')).toBe('Safe text');
      expect(sanitizeText('Text & symbols')).toBe('Text  symbols');
    });

    it('should handle non-string inputs', () => {
      expect(sanitizeText(null as unknown as string)).toBe('');
      expect(sanitizeText(undefined as unknown as string)).toBe('');
      expect(sanitizeText(123 as unknown as string)).toBe('');
    });

    it('should limit text length', () => {
      const longText = 'a'.repeat(200);
      expect(sanitizeText(longText)).toHaveLength(100);
    });
  });

  describe('validateColor', () => {
    it('should accept valid hex colors', () => {
      expect(validateColor('#ff0000')).toBe(true);
      expect(validateColor('#f00')).toBe(true);
    });

    it('should accept valid rgb/rgba colors', () => {
      expect(validateColor('rgb(255, 0, 0)')).toBe(true);
      expect(validateColor('rgba(255, 0, 0, 0.5)')).toBe(true);
    });

    it('should reject invalid colors', () => {
      expect(validateColor('invalid-color')).toBe(false);
      expect(validateColor('#gggggg')).toBe(false);
      expect(validateColor('')).toBe(false);
    });

    it('should handle non-string inputs', () => {
      expect(validateColor(null as unknown as string)).toBe(false);
      expect(validateColor(undefined as unknown as string)).toBe(false);
    });
  });

  describe('validateSegments', () => {
    const validSegments: WheelSegment[] = [
      { id: '1', text: 'Prize 1', color: '#ff0000' },
      { id: '2', text: 'Prize 2', color: '#00ff00' },
    ];

    it('should accept valid segments', () => {
      const result = validateSegments(validSegments);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject non-array inputs', () => {
      const result = validateSegments(null as unknown as WheelSegment[]);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Segments must be a valid array');
    });

    it('should require at least 2 segments', () => {
      const result = validateSegments([validSegments[0]]);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Wheel must have at least 2 segments');
    });

    it('should limit maximum segments', () => {
      const tooManySegments = Array(101).fill(validSegments[0]);
      const result = validateSegments(tooManySegments);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Wheel cannot have more than 100 segments');
    });

    it('should detect duplicate IDs', () => {
      const duplicateSegments = [
        { id: '1', text: 'Prize 1', color: '#ff0000' },
        { id: '1', text: 'Prize 2', color: '#00ff00' },
      ];
      const result = validateSegments(duplicateSegments);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(error => error.includes('Duplicate segment IDs'))).toBe(true);
    });
  });
});
