import React, { useEffect, useMemo, useRef } from 'react';
import { useSpinWheel } from '../hooks/useSpinWheel';
import type { PointerConfig, SpinWheelProps, WheelTheme } from '../types';
import { calculateSegmentAngles, getContrastColor } from '../utils/validation';

/**
 * SpinWheel - A customizable prize wheel component
 *
 * @description Creates an interactive spinning wheel with segments that can be customized
 * with different colors, weights, and text. Supports animation configuration, themes,
 * and various pointer styles. Uses HTML5 Canvas for optimal performance.
 *
 * @since 2025-07-25
 * @version 1.0.0
 * 
 * @example
 * ```tsx
 * const segments = [
 *   { id: '1', text: 'Prize 1', color: '#ff6b6b' },
 *   { id: '2', text: 'Prize 2', color: '#4ecdc4' },
 * ];
 *
 * <SpinWheel
 *   segments={segments}
 *   size={400}
 *   onSpinComplete={(result) => console.log('Winner:', result.segment.text)}
 * />
 * ```
 *
 * @param props - Configuration props for the spin wheel
 * @returns JSX element rendering the interactive spin wheel
 */
export function SpinWheel({
  segments,
  size = 400,
  onSpinComplete,
  onSpinStart,
  theme = {},
  animation = {},
  pointer = {},
  disabled = false,
  className = '',
  style = {},
  showSpinButton = true,
  spinButtonText = 'SPIN',
  predefinedResult,
}: SpinWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const defaultTheme: WheelTheme = {
    background: '#ffffff',
    border: '#dee2e6',
    text: '#212529',
    ...theme,
  };

  const defaultPointer: PointerConfig = React.useMemo(
    () => ({
      style: 'arrow',
      color: '#ff0000',
      size: 20,
      position: 'top',
      ...pointer,
    }),
    [pointer]
  );

  const { rotation, isSpinning, lastResult, isValid, validationErrors, spin } = useSpinWheel({
    segments,
    animation,
    pointerPosition: defaultPointer.position,
    ...(onSpinStart && { onSpinStart }),
    ...(onSpinComplete && { onSpinComplete }),
    disabled,
    ...(predefinedResult !== undefined && { predefinedResult }),
  });

  const segmentAngles = useMemo(() => {
    return calculateSegmentAngles(segments);
  }, [segments]);

  /**
   * Draws the pointer/indicator on the wheel
   * 
   * @param ctx - Canvas 2D rendering context
   * @param centerX - Center X coordinate of the wheel
   * @param centerY - Center Y coordinate of the wheel  
   * @param radius - Radius of the wheel
   */
  const drawPointer = React.useCallback(
    (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number) => {
      const { style, color, size: pointerSize, position } = defaultPointer;

      ctx.save();
      ctx.translate(centerX, centerY);

      switch (position) {
        case 'right':
          ctx.rotate(Math.PI / 2);
          break;
        case 'bottom':
          ctx.rotate(Math.PI);
          break;
        case 'left':
          ctx.rotate(-Math.PI / 2);
          break;
      }

      const pointerY = -(radius + 10);

      ctx.beginPath();
      ctx.fillStyle = color;

      switch (style) {
        case 'arrow':
          // Arrow pointing toward the wheel (tip at pointerY + pointerSize)
          ctx.moveTo(0, pointerY + pointerSize);
          ctx.lineTo(-pointerSize / 4, pointerY + pointerSize * 2 / 3);
          ctx.lineTo(-pointerSize / 8, pointerY + pointerSize * 2 / 3);
          ctx.lineTo(-pointerSize / 8, pointerY);
          ctx.lineTo(pointerSize / 8, pointerY);
          ctx.lineTo(pointerSize / 8, pointerY + pointerSize * 2 / 3);
          ctx.lineTo(pointerSize / 4, pointerY + pointerSize * 2 / 3);
          ctx.lineTo(0, pointerY + pointerSize);
          break;
        case 'triangle':
          // Triangle pointing toward the wheel (tip at pointerY + pointerSize)
          ctx.moveTo(0, pointerY + pointerSize);
          ctx.lineTo(-pointerSize / 2, pointerY);
          ctx.lineTo(pointerSize / 2, pointerY);
          ctx.lineTo(0, pointerY + pointerSize);
          break;
        case 'circle':
          ctx.arc(0, pointerY + pointerSize / 2, pointerSize / 2, 0, 2 * Math.PI);
          break;
      }

      ctx.closePath();
      ctx.fill();
      ctx.restore();
    },
    [defaultPointer]
  );

  /**
   * Wraps text to fit within segment boundaries with proper line breaks
   * 
   * @param ctx - Canvas 2D rendering context
   * @param text - Text content to wrap
   * @param x - X coordinate for text positioning
   * @param y - Y coordinate for text positioning
   * @param maxWidth - Maximum width allowed for text
   * @param lineHeight - Height between text lines
   */
  const wrapText = React.useCallback(
    (
      ctx: CanvasRenderingContext2D,
      text: string,
      x: number,
      y: number,
      maxWidth: number,
      lineHeight: number
    ) => {
      const words = text.split(' ');
      let line = '';
      const lines: string[] = [];

      for (let n = 0; n < words.length; n++) {
        const testLine = `${line + words[n]} `;
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;

        if (testWidth > maxWidth && n > 0) {
          lines.push(line);
          line = `${words[n]} `;
        } else {
          line = testLine;
        }
      }
      lines.push(line);

      const startY = y - ((lines.length - 1) * lineHeight) / 2;
      lines.forEach((line, index) => {
        ctx.fillText(line.trim(), x, startY + index * lineHeight);
      });
    },
    []
  );

  /**
   * Renders the complete wheel with all segments, text, and pointer
   * 
   * @description Draws the wheel to the canvas including all segments with their colors,
   * text labels, borders, and the pointer indicator. Handles text positioning and
   * rotation to match the segment layout.
   */
  const drawWheel = React.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isValid) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = (size - 40) / 2;

    ctx.clearRect(0, 0, size, size);

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((rotation * Math.PI) / 180);

    let currentAngle = 0;

    segments.forEach((segment, index) => {
      const segmentAngle = segmentAngles[index]!;
      const segmentAngleRad = (segmentAngle * Math.PI) / 180;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, currentAngle, currentAngle + segmentAngleRad);
      ctx.closePath();

      ctx.fillStyle = segment.color;
      ctx.fill();

      if (segment.borderColor && segment.borderWidth) {
        ctx.strokeStyle = segment.borderColor;
        ctx.lineWidth = segment.borderWidth;
        ctx.stroke();
      }

      const textAngle = currentAngle + segmentAngleRad / 2;
      const textRadius = radius * 0.7;
      const textX = Math.cos(textAngle) * textRadius;
      const textY = Math.sin(textAngle) * textRadius;

      ctx.save();
      ctx.translate(textX, textY);
      ctx.rotate(textAngle + Math.PI / 2);

      const fontSize = Math.min(16, radius / segments.length);
      ctx.font = `bold ${fontSize}px Arial, sans-serif`;
      ctx.fillStyle = segment.textColor || getContrastColor(segment.color);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const maxWidth = radius * 0.4;
      wrapText(ctx, segment.text, 0, 0, maxWidth, fontSize * 1.2);

      ctx.restore();

      currentAngle += segmentAngleRad;
    });

    ctx.restore();

    drawPointer(ctx, centerX, centerY, radius);
  }, [size, isValid, rotation, segments, segmentAngles, drawPointer, wrapText]);

  useEffect(() => {
    drawWheel();
  }, [drawWheel]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = size;
    canvas.height = size;

    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    drawWheel();
  }, [size, drawWheel]);

  if (!isValid) {
    return (
      <div className={`spin-wheel-error ${className}`} style={style}>
        <p>Invalid wheel configuration:</p>
        <ul>
          {validationErrors.map(error => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`spin-wheel-container ${className}`}
      style={{
        display: 'inline-block',
        textAlign: 'center',
        userSelect: 'none',
        ...style,
      }}
    >
      <button
        type="button"
        className="spin-wheel"
        style={{
          position: 'relative',
          display: 'inline-block',
          background: defaultTheme.background,
          borderRadius: '50%',
          border: `2px solid ${defaultTheme.border}`,
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1,
          padding: 0,
        }}
        onClick={!disabled && !isSpinning ? spin : undefined}
        disabled={disabled || isSpinning}
        aria-label="Spin the wheel"
      >
        <canvas
          ref={canvasRef}
          style={{
            display: 'block',
            borderRadius: '50%',
          }}
        />

        {showSpinButton && (
          <button
            type="button"
            className="spin-wheel-button"
            onClick={spin}
            disabled={disabled || isSpinning}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              cursor: disabled || isSpinning ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              opacity: disabled || isSpinning ? 0.6 : 1,
              zIndex: 10,
            }}
          >
            {isSpinning ? 'Spinning...' : spinButtonText}
          </button>
        )}
      </button>

      {lastResult && !isSpinning && (
        <div
          className="spin-wheel-result"
          style={{
            marginTop: '16px',
            padding: '12px',
            backgroundColor: defaultTheme.background,
            border: `1px solid ${defaultTheme.border}`,
            borderRadius: '8px',
            color: defaultTheme.text,
          }}
        >
          <strong>Result: </strong>
          {lastResult.segment.text}
        </div>
      )}
    </div>
  );
}
