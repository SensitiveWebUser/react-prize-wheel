import { useState } from "react";
import { SpinWheel, Option } from "../dist";

function App() {
	const [spin, setSpin] = useState(false);
	const [winningOption, setWinningOption] = useState<Option | null>(null);
	const [options, setOptions] = useState<Option[]>([
		{ text: "Option 0" },
		{ text: "Option 1" },
		{ text: "Option 2" },
		{ text: "Option 3" },
		{ text: "Option 4" },
		{ text: "Option 5" },
	]);
	return (
		<div>
			<SpinWheel
				options={options}
				startSpin={spin}
				styles={{
					size: 600,
				}}
				spinTime={1000}
				OnSpinCompleted={(option: Option) => {
					setSpin(false);
					//setOptions(options.filter((o) => o !== option));
					setWinningOption(option);
					console.log("Option selected: ", option);
				}}
			/>
			<button onClick={() => setSpin(true)}>Spin</button>
			{winningOption && (
				<div>
					<h1>Winner: {winningOption.text}</h1>
					<p>Option index: {options.indexOf(winningOption)}</p>
					<p>Options left: {options.length}</p>
				</div>
			)}
		</div>
	);
}

export default App;
