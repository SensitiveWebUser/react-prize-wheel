import React from "react";
import SliderInput from "./SliderInput";

interface SpinWheelCustomiserProps {
	wheelStyles: {
		size: number;
		segmentColors: string[];
		textColor: string;
		textAlign: CanvasTextAlign;
		borderWidth: number;
		borderColor: string;
		centerCircleColor: string;
		arrowColor: string;
	};
	spinTime: number;
	spinCount: number;
	handleStyleChange: (
		e:
			| React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
			| { target: { name: string; value: number } },
	) => void;
	setSpinTime: (value: number) => void;
	setSpinCount: (value: number) => void;
}

const SpinWheelCustomiser: React.FC<SpinWheelCustomiserProps> = ({
	wheelStyles,
	spinTime,
	spinCount,
	handleStyleChange,
	setSpinTime,
	setSpinCount,
}) => {
	return (
		<div className="slider-panel">
			<h2>Customize Wheel</h2>
			<SliderInput
				label="Size"
				type="range"
				min={100}
				max={1000}
				value={wheelStyles.size}
				name="size"
				onChange={handleStyleChange}
			/>
			<SliderInput
				label="Text Color"
				type="color"
				value={wheelStyles.textColor}
				name="textColor"
				onChange={handleStyleChange}
			/>
			<SliderInput
				label="Text Align"
				type="select"
				options={["center", "left", "right"]}
				value={wheelStyles.textAlign}
				name="textAlign"
				onChange={handleStyleChange}
			/>
			<SliderInput
				label="Border Width"
				type="range"
				min={0}
				max={20}
				value={wheelStyles.borderWidth}
				name="borderWidth"
				onChange={handleStyleChange}
			/>
			<SliderInput
				label="Border Color"
				type="color"
				value={wheelStyles.borderColor}
				name="borderColor"
				onChange={handleStyleChange}
			/>
			<SliderInput
				label="Center Circle Color"
				type="color"
				value={wheelStyles.centerCircleColor}
				name="centerCircleColor"
				onChange={handleStyleChange}
			/>
			<SliderInput
				label="Arrow Color"
				type="color"
				value={wheelStyles.arrowColor}
				name="arrowColor"
				onChange={handleStyleChange}
			/>
			<SliderInput
				label="Spin Time (ms)"
				type="range"
				min={1000}
				max={10000}
				value={spinTime}
				name="spinTime"
				onChange={(e) => setSpinTime(parseInt(e.target.value))}
			/>
			<SliderInput
				label="Spin Count"
				type="range"
				min={1}
				max={20}
				value={spinCount}
				name="spinCount"
				onChange={(e) => setSpinCount(parseInt(e.target.value))}
			/>
		</div>
	);
};

export default SpinWheelCustomiser;
