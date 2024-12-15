import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { drawArrow, drawWheelWithBorders } from "./drawer";

/**
 * Option interface
 * @param text - Text to display
 * @param styles - Styles for the option
 */
export interface Option {
	text: string;
	styles?: {
		backgroundColor?: string | CanvasGradient | CanvasPattern;
		borderWidth?: number;
		borderColor?: string | CanvasGradient | CanvasPattern;
		textColor?: string | CanvasGradient | CanvasPattern;
	};
}

/**
 * SpinWheel component props
 * @param options - Array of options
 * @param startSpin - Start spinning the wheel
 * @param styles - Styles for the wheel
 * @param spinTime - Time to spin the wheel
 * @param spinCount - Number of spins
 * @param OnSpinCompleted - Callback function when spinning is completed
 * @returns SpinWheel component
 */
export interface SpinWheelProp {
	options: Option[];
	startSpin: boolean;
	styles?: {
		size?: number;
		segmentColors?: string[] | CanvasGradient[] | CanvasPattern[];
		textColor?: string | CanvasGradient | CanvasPattern;
		textAlign?: CanvasTextAlign;
		borderWidth?: number;
		borderColor?: string | CanvasGradient | CanvasPattern;
		centerCircleColor?: string | CanvasGradient | CanvasPattern;
		arrowColor?: string | CanvasGradient | CanvasPattern;
	};
	spinTime?: number;
	spinCount?: number;
	OnSpinCompleted?: (option: Option) => void;
}

export function SpinWheel({
	options,
	startSpin = false,
	styles,
	spinTime = 5000,
	spinCount = 10,
	OnSpinCompleted,
}: SpinWheelProp) {
	const [isSpinning, setIsSpinning] = useState(false);
	const [rotation, setRotation] = useState(0);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const arrowCanvasRef = useRef<HTMLCanvasElement>(null);
	const totalRotation = useMemo(() => spinCount * 360, [spinCount]);
	const anglePerOption = useMemo(() => 360 / options.length, [options.length]);
	const SpinnerSize = styles?.size || 400;

	const calculateFinalRotation = useCallback(
		(winningIndex: number) => {
			const optionToGo =
				360 -
				(winningIndex !== options.length ? anglePerOption * winningIndex : 0);
			return { finalRotation: totalRotation + optionToGo, optionToGo };
		},
		[anglePerOption, options.length, totalRotation],
	);

	const handleSpinClick = () => {
		setIsSpinning(true);

		const winningIndex = Math.floor(Math.random() * options.length);

		const { finalRotation, optionToGo } = calculateFinalRotation(winningIndex);
		setRotation(finalRotation);

		setTimeout(() => {
			setRotation(optionToGo);
			setIsSpinning(false);
			OnSpinCompleted?.(options[winningIndex] as Option);
		}, spinTime);
	};

	useEffect(() => {
		const canvas = canvasRef.current;
		const arrowCanvas = arrowCanvasRef.current;
		if (canvas) drawWheelWithBorders(canvas, options, rotation, styles);
		if (arrowCanvas) drawArrow(arrowCanvas, styles);
	}, [options, styles]);

	useEffect(() => {
		if (startSpin && !isSpinning) handleSpinClick();
	}, [startSpin]);

	return (
		<div
			style={{
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<div
				style={{
					position: "relative",
					width: SpinnerSize,
					height: SpinnerSize,
				}}
			>
				<canvas
					ref={canvasRef}
					width={SpinnerSize}
					height={SpinnerSize}
					style={{
						transition: isSpinning
							? `transform ${spinTime / 1000}s ease-out`
							: "none",
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
					}}
				/>
				<canvas
					ref={arrowCanvasRef}
					width={SpinnerSize}
					height={SpinnerSize}
					style={{
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						pointerEvents: "none",
					}}
				/>
			</div>
		</div>
	);
}
