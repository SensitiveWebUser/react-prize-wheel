import { useState } from "react";
import { Option } from "react-prize-wheel";
import WheelDisplay from "./components/WheelDisplay";
import SpinWheelCustomiser from "./components/SpinWheelCustomiser";

function App() {
	const [spin, setSpin] = useState(false);
	const [options, setOptions] = useState<Option[]>([
		{ text: "Option 0" },
		{ text: "Option 1" },
		{ text: "Option 2" },
		{ text: "Option 3" },
		{ text: "Option 4" },
		{ text: "Option 5" },
	]);
	const [wheelStyles, setWheelStyles] = useState({
		size: 600,
		segmentColors: [
			"#FF0000",
			"#00FF00",
			"#0000FF",
			"#FFFF00",
			"#FF00FF",
			"#00FFFF",
		],
		textColor: "#000000",
		textAlign: "right" as CanvasTextAlign,
		borderWidth: 2,
		borderColor: "#000000",
		centerCircleColor: "#FFFFFF",
		arrowColor: "#000000",
	});
	const [spinTime, setSpinTime] = useState(1000);
	const [spinCount, setSpinCount] = useState(10);
	const [winningHistory, setWinningHistory] = useState<Option[]>([]);

	const handleStyleChange = (
		e:
			| React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
			| { target: { name: string; value: number } },
	) => {
		const { name, value } = e.target;
		setWheelStyles((prevStyles) => ({
			...prevStyles,
			[name]:
				name === "size" || name === "borderWidth"
					? parseInt(value as string)
					: value,
		}));
	};

	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "flex-start",
			}}
		>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
				}}
			>
				<WheelDisplay
					options={options}
					spin={spin}
					wheelStyles={wheelStyles}
					spinTime={spinTime}
					spinCount={spinCount}
					OnSpinCompleted={(option: Option) => {
						setSpin(false);
						setWinningHistory((prevHistory) => [...prevHistory, option]);
						console.log("Option selected: ", option);
					}}
					setSpin={setSpin}
				/>
				<SpinWheelCustomiser
					wheelStyles={wheelStyles}
					spinTime={spinTime}
					spinCount={spinCount}
					handleStyleChange={handleStyleChange}
					setSpinTime={setSpinTime}
					setSpinCount={setSpinCount}
				/>
			</div>
			<div style={{ marginLeft: "20px", maxWidth: "200px" }}>
				<h3>Winning History</h3>
				<ul>
					{winningHistory.map((option, index) => (
						<li key={index}>{option.text}</li>
					))}
				</ul>
			</div>
		</div>
	);
}

export default App;
