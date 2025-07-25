import { type SpinResult, SpinWheel, type WheelSegment } from '@sensitiveweb/react-prize-wheel';
import { useState } from 'react';
import { Documentation } from './components/Documentation';

// Basic segments for standard wheel
const basicSegments: WheelSegment[] = [
  { id: '1', text: 'Prize 1', color: '#ff6b6b' },
  { id: '2', text: 'Prize 2', color: '#4ecdc4' },
  { id: '3', text: 'Prize 3', color: '#45b7d1' },
  { id: '4', text: 'Prize 4', color: '#96ceb4' },
  { id: '5', text: 'Prize 5', color: '#feca57' },
  { id: '6', text: 'Prize 6', color: '#ff9ff3' },
];

// Weighted probability segments
const weightedSegments: WheelSegment[] = [
  { id: '1', text: '🎁 Gift Card ($50)', color: '#e74c3c', weight: 2, textColor: '#ffffff' },
  { id: '2', text: '🏆 Trophy', color: '#f39c12', weight: 1, textColor: '#ffffff' },
  { id: '3', text: '💎 Diamond Ring', color: '#9b59b6', weight: 0.2, textColor: '#ffffff' },
  { id: '4', text: '🎪 Circus Ticket', color: '#3498db', weight: 4, textColor: '#ffffff' },
  { id: '5', text: '🍕 Free Pizza', color: '#e67e22', weight: 3, textColor: '#ffffff' },
  { id: '6', text: '🎮 Game Console', color: '#27ae60', weight: 0.1, textColor: '#ffffff' },
];

// Stylized segments with borders and custom styling
const styledSegments: WheelSegment[] = [
  {
    id: '1',
    text: 'GOLD',
    color: '#ffd700',
    textColor: '#333',
    borderColor: '#ffb300',
    borderWidth: 3,
    weight: 1
  },
  {
    id: '2',
    text: 'SILVER',
    color: '#c0c0c0',
    textColor: '#333',
    borderColor: '#a0a0a0',
    borderWidth: 3,
    weight: 2
  },
  {
    id: '3',
    text: 'BRONZE',
    color: '#cd7f32',
    textColor: '#fff',
    borderColor: '#8b4513',
    borderWidth: 3,
    weight: 3
  },
  {
    id: '4',
    text: 'PLATINUM',
    color: '#e5e4e2',
    textColor: '#333',
    borderColor: '#bbb',
    borderWidth: 3,
    weight: 0.5
  },
];

// Segments with disabled options
const disabledSegments: WheelSegment[] = [
  { id: '1', text: 'Available', color: '#28a745', textColor: '#fff' },
  { id: '2', text: 'Sold Out', color: '#6c757d', textColor: '#fff', disabled: true },
  { id: '3', text: 'Available', color: '#17a2b8', textColor: '#fff' },
  { id: '4', text: 'Coming Soon', color: '#ffc107', textColor: '#333', disabled: true },
  { id: '5', text: 'Available', color: '#dc3545', textColor: '#fff' },
  { id: '6', text: 'Available', color: '#6f42c1', textColor: '#fff' },
];

// Large segment set for testing performance
const manySegments: WheelSegment[] = Array.from({ length: 20 }, (_, i) => ({
  id: `${i + 1}`,
  text: `Option ${i + 1}`,
  color: `hsl(${(i * 360) / 20}, 70%, 60%)`,
  textColor: '#fff',
  weight: Math.random() * 3 + 0.5,
}));

function App() {
  const [lastResult, setLastResult] = useState<SpinResult | null>(null);
  const [currentSegments, setCurrentSegments] = useState(basicSegments);
  const [wheelSize, setWheelSize] = useState(400);
  const [animationDuration, setAnimationDuration] = useState(3000);
  const [spinCount, setSpinCount] = useState(5);
  const [selectedDemo, setSelectedDemo] = useState('basic');
  const [pointerStyle, setPointerStyle] = useState<'arrow' | 'triangle' | 'circle'>('arrow');
  const [pointerPosition, setPointerPosition] = useState<'top' | 'right' | 'bottom' | 'left'>('top');
  const [animationEasing, setAnimationEasing] = useState<'linear' | 'ease-in' | 'ease-out' | 'ease-in-out'>('ease-out');
  const [predefinedResult, setPredefinedResult] = useState<string>('');
  const [wheelTheme, setWheelTheme] = useState({
    background: '#ffffff',
    border: '#dee2e6',
    text: '#212529',
  });

  const handleSpinComplete = (result: SpinResult) => {
    setLastResult(result);
    console.log('Spin result:', result);
  };

  const handleSpinStart = () => {
    console.log('Spin started!');
    setLastResult(null);
  };

  const switchToDemo = (demoType: string) => {
    setSelectedDemo(demoType);
    setLastResult(null);
    setPredefinedResult('');

    switch (demoType) {
      case 'basic':
        setCurrentSegments(basicSegments);
        break;
      case 'weighted':
        setCurrentSegments(weightedSegments);
        break;
      case 'styled':
        setCurrentSegments(styledSegments);
        break;
      case 'disabled':
        setCurrentSegments(disabledSegments);
        break;
      case 'many':
        setCurrentSegments(manySegments);
        break;
      default:
        setCurrentSegments(basicSegments);
    }
  };

  const getDemoDescription = () => {
    switch (selectedDemo) {
      case 'basic':
        return 'Simple wheel with equal probability for all segments';
      case 'weighted':
        return 'Segments with different weights affect probability (check the weight values below)';
      case 'styled':
        return 'Custom styling with borders, text colors, and different weights';
      case 'disabled':
        return 'Some segments are disabled and cannot be selected';
      case 'many':
        return 'Performance test with 20 segments and random weights';
      default:
        return '';
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>🎡 React Prize Wheel Demo</h1>
        <p>Showcase of all features and capabilities</p>
      </header>

      <main className="main">
        {/* Demo Selection */}
        <div className="demo-selector">
          <h2>Choose a Demo</h2>
          <div className="demo-buttons">
            <button
              type="button"
              onClick={() => switchToDemo('basic')}
              className={`btn ${selectedDemo === 'basic' ? 'btn-primary' : 'btn-outline'}`}
            >
              Basic Wheel
            </button>
            <button
              type="button"
              onClick={() => switchToDemo('weighted')}
              className={`btn ${selectedDemo === 'weighted' ? 'btn-primary' : 'btn-outline'}`}
            >
              Weighted Probability
            </button>
            <button
              type="button"
              onClick={() => switchToDemo('styled')}
              className={`btn ${selectedDemo === 'styled' ? 'btn-primary' : 'btn-outline'}`}
            >
              Custom Styling
            </button>
            <button
              type="button"
              onClick={() => switchToDemo('disabled')}
              className={`btn ${selectedDemo === 'disabled' ? 'btn-primary' : 'btn-outline'}`}
            >
              Disabled Segments
            </button>
            <button
              type="button"
              onClick={() => switchToDemo('many')}
              className={`btn ${selectedDemo === 'many' ? 'btn-primary' : 'btn-outline'}`}
            >
              Many Segments
            </button>
          </div>
          <p className="demo-description">{getDemoDescription()}</p>
        </div>

        {/* Main Wheel */}
        <div className="wheel-container">
          <SpinWheel
            segments={currentSegments}
            size={wheelSize}
            onSpinComplete={handleSpinComplete}
            onSpinStart={handleSpinStart}
            animation={{
              duration: animationDuration,
              easing: animationEasing,
              spins: spinCount,
            }}
            pointer={{
              style: pointerStyle,
              color: '#e74c3c',
              size: 25,
              position: pointerPosition,
            }}
            theme={wheelTheme}
            showSpinButton={true}
            spinButtonText="SPIN TO WIN!"
            predefinedResult={predefinedResult || undefined}
          />
        </div>

        {/* Configuration Controls */}
        <div className="controls">
          {/* Wheel Size */}
          <div className="control-group">
            <h3>Wheel Size</h3>
            <input
              type="range"
              min="200"
              max="600"
              value={wheelSize}
              onChange={e => setWheelSize(Number(e.target.value))}
            />
            <span>{wheelSize}px</span>
          </div>

          {/* Animation Settings */}
          <div className="control-group">
            <h3>Animation Duration</h3>
            <input
              type="range"
              min="1000"
              max="6000"
              step="500"
              value={animationDuration}
              onChange={e => setAnimationDuration(Number(e.target.value))}
            />
            <span>{animationDuration}ms</span>
          </div>

          <div className="control-group">
            <h3>Spin Count</h3>
            <input
              type="range"
              min="2"
              max="10"
              value={spinCount}
              onChange={e => setSpinCount(Number(e.target.value))}
            />
            <span>{spinCount} rotations</span>
          </div>

          <div className="control-group">
            <h3>Animation Easing</h3>
            <select
              value={animationEasing}
              onChange={e => setAnimationEasing(e.target.value as 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out')}
            >
              <option value="linear">Linear</option>
              <option value="ease-in">Ease In</option>
              <option value="ease-out">Ease Out</option>
              <option value="ease-in-out">Ease In-Out</option>
            </select>
          </div>

          {/* Pointer Settings */}
          <div className="control-group">
            <h3>Pointer Style</h3>
            <select
              value={pointerStyle}
              onChange={e => setPointerStyle(e.target.value as 'arrow' | 'triangle' | 'circle')}
            >
              <option value="arrow">Arrow</option>
              <option value="triangle">Triangle</option>
              <option value="circle">Circle</option>
            </select>
          </div>

          <div className="control-group">
            <h3>Pointer Position</h3>
            <select
              value={pointerPosition}
              onChange={e => setPointerPosition(e.target.value as 'top' | 'right' | 'bottom' | 'left')}
            >
              <option value="top">Top</option>
              <option value="right">Right</option>
              <option value="bottom">Bottom</option>
              <option value="left">Left</option>
            </select>
          </div>

          {/* Theme Settings */}
          <div className="control-group">
            <h3>Background Color</h3>
            <input
              type="color"
              value={wheelTheme.background}
              onChange={e => setWheelTheme(prev => ({ ...prev, background: e.target.value }))}
            />
          </div>

          <div className="control-group">
            <h3>Border Color</h3>
            <input
              type="color"
              value={wheelTheme.border}
              onChange={e => setWheelTheme(prev => ({ ...prev, border: e.target.value }))}
            />
          </div>

          {/* Testing Features */}
          <div className="control-group">
            <h3>Predefined Result (Testing)</h3>
            <select
              value={predefinedResult}
              onChange={e => setPredefinedResult(e.target.value)}
            >
              <option value="">Random (Normal)</option>
              {currentSegments.map((segment) => (
                <option key={segment.id} value={segment.id}>
                  {segment.text} (ID: {segment.id})
                </option>
              ))}
            </select>
            <small>Forces the wheel to land on a specific segment</small>
          </div>
        </div>

        {/* Results Display */}
        {lastResult && (
          <div className="result">
            <h3>🎉 Last Result</h3>
            <div className="result-details">
              <p><strong>Winner:</strong> {lastResult.segment.text}</p>
              <p><strong>Segment ID:</strong> {lastResult.segment.id}</p>
              <p><strong>Final Angle:</strong> {lastResult.angle.toFixed(2)}°</p>
              <p><strong>Duration:</strong> {lastResult.duration.toFixed(0)}ms</p>
              <p><strong>Weight:</strong> {lastResult.segment.weight || 1}</p>
              <p><strong>Timestamp:</strong> {new Date(lastResult.timestamp).toLocaleTimeString()}</p>
            </div>
          </div>
        )}

        {/* Segments Information */}
        <div className="segments-info">
          <h3>Current Segments</h3>
          <div className="segments-grid">
            {currentSegments.map((segment) => (
              <div
                key={segment.id}
                className={`segment-card ${segment.disabled ? 'disabled' : ''}`}
                style={{ backgroundColor: segment.color }}
              >
                <span style={{ color: segment.textColor || '#ffffff' }}>
                  {segment.text}
                </span>
                <div className="segment-details">
                  <small>ID: {segment.id}</small>
                  {segment.weight !== 1 && segment.weight !== undefined && (
                    <small>Weight: {segment.weight}</small>
                  )}
                  {segment.disabled && <small>DISABLED</small>}
                  {segment.borderColor && <small>Border: {segment.borderColor}</small>}
                </div>
              </div>
            ))}
          </div>
          <div className="probability-info">
            <h4>Probability Distribution</h4>
            <div className="probability-grid">
              {currentSegments
                .filter(s => !s.disabled)
                .map(segment => {
                  const totalWeight = currentSegments
                    .filter(s => !s.disabled)
                    .reduce((sum, s) => sum + (s.weight || 1), 0);
                  const probability = ((segment.weight || 1) / totalWeight * 100).toFixed(1);
                  return (
                    <div key={segment.id} className="probability-item">
                      <span>{segment.text}</span>
                      <span>{probability}%</span>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Feature Showcase */}
        <div className="features-showcase">
          <h3>✨ Package Features</h3>
          <div className="features-grid">
            <div className="feature-card">
              <h4>🎯 Weighted Probability</h4>
              <p>Configure different weights for segments to control win probability</p>
            </div>
            <div className="feature-card">
              <h4>🎨 Custom Styling</h4>
              <p>Full control over colors, borders, text styling, and themes</p>
            </div>
            <div className="feature-card">
              <h4>⚙️ Animation Control</h4>
              <p>Customizable duration, easing, and rotation count</p>
            </div>
            <div className="feature-card">
              <h4>📍 Pointer Options</h4>
              <p>Multiple pointer styles and positions</p>
            </div>
            <div className="feature-card">
              <h4>🚫 Disabled Segments</h4>
              <p>Exclude certain segments from selection</p>
            </div>
            <div className="feature-card">
              <h4>🧪 Testing Support</h4>
              <p>Predefined results for testing and demos</p>
            </div>
            <div className="feature-card">
              <h4>⚡ Performance</h4>
              <p>Smooth animations with many segments</p>
            </div>
            <div className="feature-card">
              <h4>♿ Accessibility</h4>
              <p>Screen reader support and keyboard navigation</p>
            </div>
          </div>
        </div>

        {/* Documentation */}
        <Documentation />
      </main>

      <footer className="footer">
        <p>
          Built with{' '}
          <a
            href="https://github.com/SensitiveWebUser/react-prize-wheel"
            target="_blank"
            rel="noopener noreferrer"
          >
            @sensitiveweb/react-prize-wheel
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
