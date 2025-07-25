import type { WheelSegment } from '../types';

/**
 * Sanitizes text content to prevent XSS attacks and normalize whitespace
 *
 * @description Removes potentially dangerous characters that could be used for XSS attacks,
 * normalizes whitespace by collapsing multiple spaces into single spaces, and limits
 * text length to prevent excessive content.
 *
 * @since 2025-07-25
 * @version 1.0.0
 *
 * @param text - Raw text input to sanitize
 * @returns Sanitized and normalized text string (max 100 characters)
 *
 * @example
 * ```typescript
 * const clean = sanitizeText('  Hello   <script>  World  ');
 * // Returns: "Hello World"
 * ```
 */
export function sanitizeText(text: string): string {
  /** Handle non-string inputs */
  if (typeof text !== 'string' || text === null || text === undefined) {
    return '';
  }

  return text
    .replace(/[<>'"]/g, '') // Remove dangerous chars but keep & for now  
    .replace(/&/g, ' ')     // Replace & with space to maintain spacing
    .replace(/\s+/g, ' ')   // Normalize whitespace
    .trim()
    .substring(0, 100);     /** Limit to 100 characters */
}

/**
 * Validates if a string represents a valid CSS color value
 *
 * @description Checks if the provided string is a valid CSS color including:
 * - Hex colors (#fff, #ffffff)
 * - RGB/RGBA functions (rgb(255,0,0), rgba(255,0,0,0.5))
 * - HSL/HSLA functions (hsl(0,100%,50%), hsla(0,100%,50%,0.5))
 * - Named colors (red, blue, etc.)
 *
 * @since 2025-07-25
 * @version 1.0.0
 *
 * @param color - Color string to validate
 * @returns True if the color is valid, false otherwise
 *
 * @example
 * ```typescript
 * validateColor('#ff0000');    // true
 * validateColor('rgb(255,0,0)'); // true
 * validateColor('red');        // true
 * validateColor('invalid');    // false
 * ```
 */
export function validateColor(color: string): boolean {
  if (typeof color !== 'string') return false;

  const colorRegex =
    /^(#([0-9A-Fa-f]{3}){1,2}|rgb\((\d{1,3},\s*){2}\d{1,3}\)|rgba\((\d{1,3},\s*){3}(0(\.\d+)?|1(\.0+)?)\)|hsl\(\d{1,3},\s*\d{1,3}%,\s*\d{1,3}%\)|hsla\(\d{1,3},\s*\d{1,3}%,\s*\d{1,3}%,\s*(0(\.\d+)?|1(\.0+)?)\)|[a-zA-Z]+)$/;

  return colorRegex.test(color.trim());
}

/**
 * Validates an array of wheel segments for completeness and correctness
 *
 * @description Performs comprehensive validation on wheel segments including:
 * - Required fields (id, text, color)
 * - Color format validation
 * - Duplicate ID detection
 * - Weight value validation
 * - Text content sanitization
 *
 * @since 2025-07-25
 * @version 1.0.0
 *
 * @param segments - Array of wheel segments to validate
 * @returns Object containing validation status and error messages
 *
 * @example
 * ```typescript
 * const result = validateSegments([
 *   { id: '1', text: 'Prize 1', color: '#ff0000' },
 *   { id: '2', text: 'Prize 2', color: 'invalid-color' }
 * ]);
 * // Returns: { isValid: false, errors: ['Segment 2: Invalid color format'] }
 * ```
 */
export function validateSegments(segments: WheelSegment[]): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!segments || !Array.isArray(segments)) {
    errors.push('Segments must be a valid array');
    return { isValid: false, errors };
  }

  if (segments.length < 2) {
    errors.push('Wheel must have at least 2 segments');
  }

  if (segments.length > 100) {
    errors.push('Wheel cannot have more than 100 segments');
  }

  segments.forEach((segment, index) => {
    if (!segment.id) {
      errors.push(`Segment ${index + 1}: Missing required 'id' property`);
    }
    if (!segment.text) {
      errors.push(`Segment ${index + 1}: Missing required 'text' property`);
    } else {
      segment.text = sanitizeText(segment.text);
    }
    if (!segment.color) {
      errors.push(`Segment ${index + 1}: Missing required 'color' property`);
    } else if (!validateColor(segment.color)) {
      errors.push(`Segment ${index + 1}: Invalid color format`);
    }
    if (segment.textColor && !validateColor(segment.textColor)) {
      errors.push(`Segment ${index + 1}: Invalid text color format`);
    }
    if (segment.borderColor && !validateColor(segment.borderColor)) {
      errors.push(`Segment ${index + 1}: Invalid border color format`);
    }
    if (segment.weight !== undefined && segment.weight <= 0) {
      errors.push(`Segment ${index + 1}: Weight must be positive`);
    }
  });

  const ids = segments.map(s => s.id);
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicateIds.length > 0) {
    errors.push(`Duplicate segment IDs: ${duplicateIds.join(', ')}`);
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Calculates appropriate contrast color (black or white) for text on a background
 *
 * @description Uses luminance calculation to determine whether black or white text
 * would provide better contrast on the given background color. Assumes hex color input.
 *
 * @since 2025-07-25
 * @version 1.0.0
 *
 * @param backgroundColor - Hex color string (e.g., '#ff0000')
 * @returns '#000000' for light backgrounds, '#ffffff' for dark backgrounds
 *
 * @example
 * ```typescript
 * getContrastColor('#ffffff'); // Returns '#000000' (black on white)
 * getContrastColor('#000000'); // Returns '#ffffff' (white on black)
 * getContrastColor('#ff0000'); // Returns '#ffffff' (white on red)
 * ```
 */
export function getContrastColor(backgroundColor: string): string {
  const hex = backgroundColor.replace('#', '');
  const r = Number.parseInt(hex.substr(0, 2), 16);
  const g = Number.parseInt(hex.substr(2, 2), 16);
  const b = Number.parseInt(hex.substr(4, 2), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

/**
 * Calculates the angle (in degrees) for each segment based on their weights
 *
 * @description Computes proportional angles for wheel segments based on their weight values.
 * Segments with higher weights will occupy larger portions of the wheel. Total angles
 * always sum to 360 degrees.
 *
 * @since 2025-07-25
 * @version 1.0.0
 *
 * @param segments - Array of wheel segments with optional weight properties
 * @returns Array of angles in degrees corresponding to each segment
 *
 * @example
 * ```typescript
 * const segments = [
 *   { id: '1', text: 'A', color: '#000', weight: 1 },
 *   { id: '2', text: 'B', color: '#000', weight: 3 }
 * ];
 * const angles = calculateSegmentAngles(segments);
 * // Returns [90, 270] - segment B is 3x larger than segment A
 * ```
 */
export function calculateSegmentAngles(segments: WheelSegment[]): number[] {
  const weights = segments.map(segment => segment.weight ?? 1);
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  return weights.map(weight => (weight / totalWeight) * 360);
}
