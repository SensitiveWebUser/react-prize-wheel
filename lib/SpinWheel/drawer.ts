import type { Option, SpinWheelProp } from ".";

const DEFAULT_TEXT_COLOR = "#FFFFFF" as const;
const DEFAULT_CENTER_CIRCLE_COLOR = "#E34234" as const;
const DEFAULT_ARROW_COLOR = "#E34234" as const;
const DEFAULT_BORDER_COLOUR = "#1d211e" as const;
const DEFAULT_SEGMENT_COLORS = ["#a20a04", "#1d211e"] as const;
const DEFAULT_TEXT_SCALE = 0.0925 as const;
const DEFAULT_TEXT_ALIGN = "right" as const;
const DEFAULT_TEXT_CHARACTER_LIMIT = 14 as const;
const DEFAULT_BORDER_WIDTH = 2.5 as const;
const DEFAULT_SCALE = 2 as const;

export const drawWheelWithBorders = (
	canvas: HTMLCanvasElement,
	options: Option[],
	rotation: number,
	styles?: SpinWheelProp["styles"],
) => {
	const { width, height } = canvas;
	const centerX = width / DEFAULT_SCALE;
	const centerY = height / DEFAULT_SCALE;

	const angleStep = (DEFAULT_SCALE * Math.PI) / options.length;

	drawWheel(canvas, options, rotation, centerX, centerY, angleStep, styles);
	drawBorders(canvas, options, rotation, centerX, centerY, angleStep, styles);
};

const drawWheel = (
	canvas: HTMLCanvasElement,
	options: Option[],
	rotation: number,
	centerX: number,
	centerY: number,
	angleStep: number,
	styles?: SpinWheelProp["styles"],
) => {
	const ctx = canvas.getContext("2d");
	if (!ctx) return;

	const radius = Math.min(centerX, centerY);

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.save();
	ctx.translate(centerX, centerY);
	ctx.rotate((rotation - 90) * (Math.PI / 180) - angleStep / DEFAULT_SCALE);
	ctx.translate(-centerX, -centerY);

	ctx.textAlign = styles?.textAlign || DEFAULT_TEXT_ALIGN;
	ctx.font = `${radius * DEFAULT_TEXT_SCALE}px Arial`;

	drawOptions(ctx, options, centerX, centerY, radius, angleStep, styles);
	ctx.restore();

	drawCenterCircle(ctx, centerX, centerY, radius, styles);
	ctx.restore();
};

const drawBorders = (
	canvas: HTMLCanvasElement,
	options: Option[],
	rotation: number,
	centerX: number,
	centerY: number,
	angleStep: number,
	styles?: SpinWheelProp["styles"],
) => {
	const ctx = canvas.getContext("2d");
	if (!ctx) return;

	const radius =
		Math.min(centerX, centerY) -
		(styles?.borderWidth || DEFAULT_BORDER_WIDTH) / 2;

	ctx.save();
	ctx.translate(centerX, centerY);
	ctx.rotate((rotation - 90) * (Math.PI / 180) - angleStep / DEFAULT_SCALE);
	ctx.translate(-centerX, -centerY);

	ctx.beginPath();
	ctx.arc(centerX, centerY, radius, 0, DEFAULT_SCALE * Math.PI);
	ctx.lineWidth = styles?.borderWidth || DEFAULT_BORDER_WIDTH;
	ctx.strokeStyle = styles?.borderColor || DEFAULT_BORDER_COLOUR;
	ctx.stroke();

	// Draw borders around each option
	options.forEach((option, index) => {
		const startAngle = index * angleStep;
		const endAngle = startAngle + angleStep;

		ctx.beginPath();
		ctx.moveTo(centerX, centerY);
		ctx.arc(centerX, centerY, radius, startAngle, endAngle);
		ctx.lineWidth =
			option.styles?.borderWidth || styles?.borderWidth || DEFAULT_BORDER_WIDTH;
		ctx.strokeStyle =
			option.styles?.borderColor ||
			styles?.borderColor ||
			DEFAULT_BORDER_COLOUR;
		ctx.stroke();
	});

	drawCenterCircle(ctx, centerX, centerY, radius, styles);

	ctx.restore();
};

const drawOptions = (
	ctx: CanvasRenderingContext2D,
	options: Option[],
	centerX: number,
	centerY: number,
	radius: number,
	angleStep: number,
	styles?: SpinWheelProp["styles"],
) => {
	const segmentColors =
		styles?.segmentColors && styles.segmentColors.length >= 2
			? styles.segmentColors
			: DEFAULT_SEGMENT_COLORS;

	options.forEach((option, index) => {
		const startAngle = index * angleStep;
		const endAngle = startAngle + angleStep;

		ctx.save();
		ctx.beginPath();
		ctx.moveTo(centerX, centerY);
		ctx.arc(centerX, centerY, radius, startAngle, endAngle);
		ctx.fillStyle =
			option.styles?.backgroundColor ||
			(segmentColors[index % segmentColors.length] as
				| string
				| CanvasGradient
				| CanvasPattern);
		ctx.fill();
		ctx.stroke();

		ctx.translate(centerX, centerY);
		ctx.rotate(startAngle + angleStep / DEFAULT_SCALE);

		ctx.fillStyle =
			option.styles?.textColor || styles?.textColor || DEFAULT_TEXT_COLOR;
		ctx.fillText(
			option.text.length > DEFAULT_TEXT_CHARACTER_LIMIT
				? option.text.slice(0, DEFAULT_TEXT_CHARACTER_LIMIT) + "..."
				: option.text,
			radius - 10,
			10,
		);
		ctx.restore();
	});
};

const drawCenterCircle = (
	ctx: CanvasRenderingContext2D,
	centerX: number,
	centerY: number,
	radius: number,
	styles?: SpinWheelProp["styles"],
) => {
	ctx.save();
	ctx.fillStyle = styles?.centerCircleColor || DEFAULT_CENTER_CIRCLE_COLOR;
	ctx.lineWidth = styles?.borderWidth || DEFAULT_BORDER_WIDTH;
	ctx.strokeStyle = styles?.borderColor || DEFAULT_BORDER_COLOUR;

	ctx.beginPath();
	ctx.arc(centerX, centerY, radius * 0.1, 0, DEFAULT_SCALE * Math.PI);
	ctx.fill();
	ctx.stroke();
	ctx.restore();
};

export const drawArrow = (
	canvas: HTMLCanvasElement,
	styles?: SpinWheelProp["styles"],
) => {
	const ctx = canvas.getContext("2d");
	if (!ctx) return;

	const { width } = canvas;
	const centerX = width / DEFAULT_SCALE;
	const arrowSize = (styles?.size || 400) / 20;

	ctx.save();
	ctx.fillStyle = styles?.arrowColor || DEFAULT_ARROW_COLOR;
	ctx.lineWidth = styles?.borderWidth || DEFAULT_BORDER_WIDTH;
	ctx.strokeStyle = styles?.borderColor || DEFAULT_BORDER_COLOUR;

	ctx.beginPath();
	ctx.moveTo(centerX, arrowSize);
	ctx.lineTo(centerX - arrowSize / DEFAULT_SCALE, 0);
	ctx.lineTo(centerX + arrowSize / DEFAULT_SCALE, 0);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
	ctx.restore();
};
