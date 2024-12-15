import React, { useState } from "react";

interface SliderInputProps {
	label: string;
	type: "range" | "color" | "select";
	min?: number;
	max?: number;
	value: number | string;
	name: string;
	options?: string[];
	onChange: (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => void;
}

const SliderInput: React.FC<SliderInputProps> = ({
	label,
	type,
	min,
	max,
	value,
	name,
	options,
	onChange,
}) => {
	const [showAdvanced, setShowAdvanced] = useState(false);

	return (
		<label style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
			{label}:
			{type === "select" ? (
				<select name={name} value={value} onChange={onChange}>
					{options?.map((option) => (
						<option key={option} value={option}>
							{option}
						</option>
					))}
				</select>
			) : (
				<div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
					<input
						type={type}
						min={min}
						max={max}
						value={value}
						name={name}
						onChange={onChange}
						style={{ flex: 1, marginBottom: "4px" }}
					/>
					{type === "range" && (
						<div
							style={{ display: "flex", flexDirection: "column", gap: "4px" }}
						>
							<button
								type="button"
								onClick={() => setShowAdvanced(!showAdvanced)}
								style={{
									background: "none",
									border: "none",
									color: "blue",
									cursor: "pointer",
									padding: "0",
									alignSelf: "flex-start",
								}}
							>
								Advanced
							</button>
							{showAdvanced && (
								<input
									type="number"
									min={min}
									max={max}
									value={value}
									name={name}
									onChange={onChange}
									style={{ width: "100px" }}
								/>
							)}
						</div>
					)}
				</div>
			)}
		</label>
	);
};

export default SliderInput;
