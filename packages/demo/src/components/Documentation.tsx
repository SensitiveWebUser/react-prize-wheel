export function Documentation() {
    return (
        <div className="documentation">
            <h2>📚 API Documentation & Examples</h2>

            <div className="doc-section">
                <h3>Basic Usage</h3>
                <pre className="code-block">
                    {`import { SpinWheel } from '@sensitiveweb/react-prize-wheel';

const segments = [
  { id: '1', text: 'Prize 1', color: '#ff6b6b' },
  { id: '2', text: 'Prize 2', color: '#4ecdc4' },
];

function App() {
  return (
    <SpinWheel
      segments={segments}
      onSpinComplete={(result) => console.log(result)}
    />
  );
}`}
                </pre>
            </div>

            <div className="doc-section">
                <h3>Weighted Segments</h3>
                <pre className="code-block">
                    {`const weightedSegments = [
  { 
    id: '1', 
    text: 'Common Prize', 
    color: '#28a745',
    weight: 3 // 60% chance
  },
  { 
    id: '2', 
    text: 'Rare Prize', 
    color: '#dc3545',
    weight: 1 // 20% chance
  },
  { 
    id: '3', 
    text: 'Epic Prize', 
    color: '#6f42c1',
    weight: 1 // 20% chance
  }
];`}
                </pre>
            </div>

            <div className="doc-section">
                <h3>Custom Styling with Borders</h3>
                <pre className="code-block">
                    {`const styledSegments = [
  {
    id: '1',
    text: 'GOLD',
    color: '#ffd700',
    textColor: '#333',
    borderColor: '#ffb300',
    borderWidth: 5 // Border thickness in pixels
  }
];`}
                </pre>
            </div>

            <div className="doc-section">
                <h3>Configuration Options</h3>
                <pre className="code-block">
                    {`<SpinWheel
  segments={segments}
  size={400}
  animation={{
    duration: 3000,
    easing: 'ease-out',
    spins: 5
  }}
  onSpinComplete={(result) => {
    console.log('Winner:', result.segment.text);
  }}
  onSpinStart={() => {
    console.log('Spin started!');
  }}
/>`}
                </pre>
            </div>

            <div className="props-table">
                <h3>Key Props</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Prop</th>
                            <th>Type</th>
                            <th>Default</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>segments</td>
                            <td>WheelSegment[]</td>
                            <td>required</td>
                            <td>Array of segments to display</td>
                        </tr>
                        <tr>
                            <td>size</td>
                            <td>number</td>
                            <td>400</td>
                            <td>Wheel diameter in pixels</td>
                        </tr>
                        <tr>
                            <td>animation.duration</td>
                            <td>number</td>
                            <td>3000</td>
                            <td>Animation duration in milliseconds</td>
                        </tr>
                        <tr>
                            <td>animation.spins</td>
                            <td>number</td>
                            <td>5</td>
                            <td>Number of full rotations</td>
                        </tr>
                        <tr>
                            <td>segment.weight</td>
                            <td>number</td>
                            <td>1</td>
                            <td>Probability weight (higher = more likely)</td>
                        </tr>
                        <tr>
                            <td>segment.borderWidth</td>
                            <td>number</td>
                            <td>0</td>
                            <td>Border thickness in pixels</td>
                        </tr>
                        <tr>
                            <td>segment.disabled</td>
                            <td>boolean</td>
                            <td>false</td>
                            <td>Exclude segment from selection</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}