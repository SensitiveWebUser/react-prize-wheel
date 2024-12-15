import React from "react";
import { SpinWheel, Option } from "../../dist";

interface WheelDisplayProps {
	options: Option[];
	spin: boolean;
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
	OnSpinCompleted: (option: Option) => void;
	setSpin: (value: boolean) => void;
}

const WheelDisplay: React.FC<WheelDisplayProps> = ({
	options,
	spin,
	wheelStyles,
	spinTime,
	spinCount,
	OnSpinCompleted,
	setSpin,
}) => {
	return (
		<div>
			<SpinWheel
				options={options}
				startSpin={spin}
				styles={wheelStyles}
				spinTime={spinTime}
				spinCount={spinCount}
				OnSpinCompleted={OnSpinCompleted}
			/>
			<button
				onClick={() => setSpin(true)}
				style={{
					marginTop: "20px",
					padding: "10px 20px",
					backgroundColor: spin ? "#ccc" : "#4CAF50",
					color: "white",
					border: "none",
					borderRadius: "5px",
					cursor: spin ? "not-allowed" : "pointer",
				}}
				disabled={spin}
			>
				{spin ? "Spinning..." : "Spin"}
			</button>
		</div>
	);
};

export default WheelDisplay;
