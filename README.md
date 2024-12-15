# React Prize Wheel

![Wheel GIF](wheel.gif)

## Overview

The React Prize Wheel is a customizable and interactive spinning wheel component built with React and TypeScript. It allows you to create a prize wheel with various options and spin it to select a random prize.

## Getting Started

To run the project locally, follow these steps:

1. Clone the repository:
    ```bash
    git clone https://github.com/SensitiveWebUser/react-prize-wheel.git
    cd react-prize-wheel
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Start the development server:
    ```bash
    npm run dev
    ```

4. Open your browser and navigate to `http://localhost:3000` to see the application in action.

## NPM Package

You can find the React Prize Wheel package on NPM [here](https://www.npmjs.com/package/react-prize-wheel).

To install the package, use one of the following commands:

### npm
```bash
npm install react-prize-wheel
```

### yarn
```bash
yarn add react-prize-wheel
```

### pnpm
```bash
pnpm add react-prize-wheel
```

## Usage

To use the SpinWheel component in your project, import it and provide the necessary props:

```tsx
import { SpinWheel, SpinWheelProp, Option } from "react-prize-wheel";

const options: Option[] = [
  { text: "Prize 1" },
  { text: "Prize 2" },
  { text: "Prize 3" },
  // Add more options as needed
];

const handleSpinCompleted = (option: Option) => {
  console.log("Spin completed! You won:", option.text);
};

const App = () => (
  <SpinWheel
    options={options}
    startSpin={true}
    spinTime={5000}
    spinCount={10}
    onSpinCompleted={handleSpinCompleted}
  />
);

export default App;
```

## Object Types

### SpinWheel Props

The `SpinWheel` component accepts the following props:

| Property         | Type       | Description                                      |
|------------------|------------|--------------------------------------------------|
| `options`        | `Option[]` | Array of options to be displayed on the wheel.   |
| `startSpin`      | `boolean`  | Whether to start spinning the wheel.             |
| `styles`         | `object`   | Custom styles for the wheel and its segments. (optional) |
| `spinTime`       | `number`   | Duration of the spin animation in milliseconds. (optional) |
| `spinCount`      | `number`   | Number of spins before stopping. (optional)     |
| `onSpinCompleted`| `(option: Option) => void` | Callback function to be called when spin ends. (optional) |

### SpinWheel Styles

The `styles` object defines the appearance of the SpinWheel:

| Property           | Type             | Description                                      |
|--------------------|------------------|--------------------------------------------------|
| `size`             | `number`         | Diameter of the wheel in pixels.                |
| `segmentColors`    | `(string | CanvasGradient | CanvasPattern)[]` | Array of colors for each segment.               |
| `textColor`        | `string | CanvasGradient | CanvasPattern` | Color of the text on the wheel.                 |
| `textAlign`        | `CanvasTextAlign`| Text alignment on the wheel.                    |
| `borderWidth`      | `number`         | Width of the border around the wheel.           |
| `borderColor`      | `string | CanvasGradient | CanvasPattern` | Color of the border around the wheel.           |
| `centerCircleColor`| `string | CanvasGradient | CanvasPattern` | Color of the center circle.                     |
| `arrowColor`       | `string | CanvasGradient | CanvasPattern` | Color of the arrow.                             |

### Option

The `Option` type defines the structure of each option on the wheel:

| Property   | Type     | Description                      |
|------------|----------|----------------------------------|
| `text`     | `string` | The text to be displayed.        |
| `styles`   | `object` | Custom styles for the option. (optional) |

## Option Styles

The `styles` object defines the appearance of the option:

| Property           | Type     | Description                      |
|--------------------|----------|----------------------------------|
| `textColor`        | `string | CanvasGradient | CanvasPattern` | Color of the text.               |
| `textSize`         | `number` | Font size of the text.           |
| `backgroundColor`  | `string | CanvasGradient | CanvasPattern` | Background color of the option.  |
| `borderColor`      | `string | CanvasGradient | CanvasPattern` | Border color of the option.      |
| `borderWidth`      | `number` | Border width of the option.      |

### Styling Examples

You can customize the appearance of the SpinWheel by providing a `styles` object. Here are some examples:

```tsx
const wheelStyles = {
  size: 400,
  segmentColors: ["#FF5733", "#33FF57", "#3357FF"],
  textColor: "#FFFFFF",
  textAlign: "center" as CanvasTextAlign,
  borderWidth: 2,
  borderColor: "#000000",
  centerCircleColor: "#FFD700",
  arrowColor: "#FF0000",
};

<SpinWheel
  options={options}
  startSpin={true}
  styles={wheelStyles}
  spinTime={5000}
  spinCount={10}
  onSpinCompleted={handleSpinCompleted}
/>
```

For more details, refer to the `SpinWheel` component in the `lib/SpinWheel` file.

## License

This project has no license and will be reviewed for best practices. Feel free to use it in your projects and modify it as needed.
