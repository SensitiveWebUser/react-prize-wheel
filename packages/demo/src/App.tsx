import { type SpinResult, SpinWheel, type WheelSegment } from '@sensitiveweb/react-prize-wheel';
import { useState } from 'react';
import { Documentation } from './components/Documentation';

/**
 * Basic segments with equal probability for standard wheel demonstration
 */
const basicSegments: WheelSegment[] = [
  { id: '1', text: 'Prize 1', color: '#ff6b6b' },
  { id: '2', text: 'Prize 2', color: '#4ecdc4' },
  { id: '3', text: 'Prize 3', color: '#45b7d1' },
  { id: '4', text: 'Prize 4', color: '#96ceb4' },
  { id: '5', text: 'Prize 5', color: '#feca57' },
  { id: '6', text: 'Prize 6', color: '#ff9ff3' },
];

/**
 * Weighted probability segments demonstrating different likelihood ratios
 */
const weightedSegments: WheelSegment[] = [
  { id: '1', text: '🎁 Gift Card ($50)', color: '#e74c3c', weight: 2, textColor: '#ffffff' },
  { id: '2', text: '🏆 Trophy', color: '#f39c12', weight: 1, textColor: '#ffffff' },
  { id: '3', text: '💎 Diamond Ring', color: '#9b59b6', weight: 0.2, textColor: '#ffffff' },
  { id: '4', text: '🎪 Circus Ticket', color: '#3498db', weight: 4, textColor: '#ffffff' },
  { id: '5', text: '🍕 Free Pizza', color: '#e67e22', weight: 3, textColor: '#ffffff' },
  { id: '6', text: '🎮 Game Console', color: '#27ae60', weight: 0.1, textColor: '#ffffff' },
];

/**
 * Segments with custom styling including borders and different text colors
 */
const styledSegments: WheelSegment[] = [
  {
    id: '1',
    text: 'GOLD',
    color: '#ffd700',
    textColor: '#333',
    borderColor: '#ffb300',
    borderWidth: 5,
    weight: 1
  },
  {
    id: '2',
    text: 'SILVER',
    color: '#c0c0c0',
    textColor: '#333',
    borderColor: '#a0a0a0',
    borderWidth: 4,
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
    borderWidth: 2,
    weight: 0.5
  },
];

/**
 * Segments with some disabled options to demonstrate selective availability
 */
const disabledSegments: WheelSegment[] = [
  { id: '1', text: 'Available', color: '#28a745', textColor: '#fff' },
  { id: '2', text: 'Sold Out', color: '#6c757d', textColor: '#fff', disabled: true },
  { id: '3', text: 'Available', color: '#17a2b8', textColor: '#fff' },
  { id: '4', text: 'Coming Soon', color: '#ffc107', textColor: '#333', disabled: true },
  { id: '5', text: 'Available', color: '#dc3545', textColor: '#fff' },
  { id: '6', text: 'Available', color: '#6f42c1', textColor: '#fff' },
];

/**
 * Large segment set for performance testing with 20 segments
 */
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

  /** Wheel customization state variables */
  const [pointerStyle, setPointerStyle] = useState<'arrow' | 'triangle' | 'circle'>('arrow');
  const [pointerPosition, setPointerPosition] = useState<'top' | 'right' | 'bottom' | 'left'>('top');
  const [pointerColor, setPointerColor] = useState('#e74c3c');
  const [pointerSize, setPointerSize] = useState(25);
  const [animationEasing, setAnimationEasing] = useState<'linear' | 'ease-in' | 'ease-out' | 'ease-in-out'>('ease-out');
  const [wheelTheme, setWheelTheme] = useState({
    background: '#ffffff',
    border: '#dee2e6',
    text: '#212529',
  });
  const [predefinedResult, setPredefinedResult] = useState<string>('');
  const [spinButtonText, setSpinButtonText] = useState('SPIN TO WIN!');
  const [showSpinButton, setShowSpinButton] = useState(true);

  /** Segment editing state for custom demo */
  const [isEditingSegments, setIsEditingSegments] = useState(false);
  const [editableSegments, setEditableSegments] = useState<WheelSegment[]>([]);

  /**
   * Handles wheel spin completion and logs the result
   */
  const handleSpinComplete = (result: SpinResult) => {
    setLastResult(result);
    console.log('Spin result:', result);
  };

  /**
   * Handles wheel spin start and clears previous result
   */
  const handleSpinStart = () => {
    console.log('Spin started!');
    setLastResult(null);
  };

  /**
   * Switches between different demo configurations
   * @param demoType - The type of demo to activate
   */
  const switchToDemo = (demoType: string) => {
    setSelectedDemo(demoType);
    setLastResult(null);
    setIsEditingSegments(false);

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
      case 'custom':
        setCurrentSegments(editableSegments.length > 0 ? editableSegments : [...basicSegments]);
        setIsEditingSegments(true);
        setEditableSegments(editableSegments.length > 0 ? editableSegments : [...basicSegments]);
        break;
      default:
        setCurrentSegments(basicSegments);
    }
  };

  /**
   * Updates a specific editable segment with new properties
   * @param index - Index of the segment to update
   * @param updates - Partial segment properties to update
   */
  const updateEditableSegment = (index: number, updates: Partial<WheelSegment>) => {
    const updated = [...editableSegments];
    updated[index] = { ...updated[index], ...updates };
    setEditableSegments(updated);
    if (isEditingSegments) {
      setCurrentSegments(updated);
    }
  };

  /**
   * Adds a new segment to the editable segments array
   */
  const addSegment = () => {
    const newSegment: WheelSegment = {
      id: `custom-${Date.now()}`,
      text: `Segment ${editableSegments.length + 1}`,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`,
      weight: 1,
    };
    const updated = [...editableSegments, newSegment];
    setEditableSegments(updated);
    if (isEditingSegments) {
      setCurrentSegments(updated);
    }
  };

  /**
   * Removes a segment from the editable segments array
   * @param index - Index of the segment to remove
   */
  const removeSegment = (index: number) => {
    const updated = editableSegments.filter((_, i) => i !== index);
    setEditableSegments(updated);
    if (isEditingSegments) {
      setCurrentSegments(updated);
    }
  };

  /**
   * Returns description text for the currently selected demo
   * @returns Description string for the active demo
   */
  const getDemoDescription = () => {
    switch (selectedDemo) {
      case 'basic':
        return 'Simple wheel with equal probability for all segments';
      case 'weighted':
        return 'Segments have different weights - check probability percentages below';
      case 'styled':
        return 'Custom colors, borders, and text styling with different border widths';
      case 'disabled':
        return 'Some segments are disabled and cannot be selected (marked with 🚫)';
      case 'many':
        return 'Performance test with 20 segments and random weights';
      case 'custom':
        return 'Create and edit your own custom segments with full control';
      default:
        return '';
    }
  }; return (
    <div className="app">
      <header className="header">
        <h1>🎡 React Prize Wheel Demo</h1>
        <p>Showcase of all features and capabilities</p>
      </header>

      <main className="main">
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
            <button
              type="button"
              onClick={() => switchToDemo('custom')}
              className={`btn ${selectedDemo === 'custom' ? 'btn-primary' : 'btn-outline'}`}
            >
              Custom Segments
            </button>
          </div>
          <p className="demo-description">{getDemoDescription()}</p>
        </div>

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
              color: pointerColor,
              size: pointerSize,
              position: pointerPosition,
            }}
            theme={wheelTheme}
            showSpinButton={showSpinButton}
            spinButtonText={spinButtonText}
            predefinedResult={predefinedResult || undefined}
          />
          <div className="pointer-info">
            <p><strong>Note:</strong> The winner is determined by which segment the {pointerPosition} {pointerStyle} points to when the wheel stops.</p>
          </div>
        </div>

        <div className="controls">
          <div className="control-section">
            <h2>🎡 Wheel Properties</h2>
            <div className="control-row">
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

              <div className="control-group">
                <h3>Background Color</h3>
                <input
                  type="color"
                  value={wheelTheme.background}
                  onChange={e => setWheelTheme(prev => ({ ...prev, background: e.target.value }))}
                />
                <span>{wheelTheme.background}</span>
              </div>

              <div className="control-group">
                <h3>Border Color</h3>
                <input
                  type="color"
                  value={wheelTheme.border}
                  onChange={e => setWheelTheme(prev => ({ ...prev, border: e.target.value }))}
                />
                <span>{wheelTheme.border}</span>
              </div>
            </div>
          </div>

          <div className="control-section">
            <h2>⚙️ Animation Settings</h2>
            <div className="control-row">
              <div className="control-group">
                <h3>Duration</h3>
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
                <h3>Easing</h3>
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
            </div>
          </div>

          <div className="control-section">
            <h2>📍 Pointer Settings</h2>
            <div className="control-row">
              <div className="control-group">
                <h3>Style</h3>
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
                <h3>Position</h3>
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

              <div className="control-group">
                <h3>Color</h3>
                <input
                  type="color"
                  value={pointerColor}
                  onChange={e => setPointerColor(e.target.value)}
                />
                <span>{pointerColor}</span>
              </div>

              <div className="control-group">
                <h3>Size</h3>
                <input
                  type="range"
                  min="10"
                  max="50"
                  value={pointerSize}
                  onChange={e => setPointerSize(Number(e.target.value))}
                />
                <span>{pointerSize}px</span>
              </div>
            </div>
          </div>

          <div className="control-section">
            <h2>🔘 Button Settings</h2>
            <div className="control-row">
              <div className="control-group">
                <h3>Show Button</h3>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={showSpinButton}
                    onChange={e => setShowSpinButton(e.target.checked)}
                  />
                  <span>Show spin button</span>
                </label>
              </div>

              <div className="control-group">
                <h3>Button Text</h3>
                <input
                  type="text"
                  value={spinButtonText}
                  onChange={e => setSpinButtonText(e.target.value)}
                  placeholder="Enter button text"
                />
              </div>
            </div>
          </div>

          <div className="control-section">
            <h2>🧪 Testing Features</h2>
            <div className="control-row">
              <div className="control-group">
                <h3>Predefined Result</h3>
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
          </div>
        </div>

        {/* Segment Editor for Custom Segments */}
        {isEditingSegments && (
          <div className="segment-editor">
            <h2>🛠️ Segment Editor</h2>
            <div className="editor-controls">
              <button type="button" onClick={addSegment} className="btn btn-primary">
                ➕ Add Segment
              </button>
              <p>Click on any segment below to edit its properties</p>
            </div>

            <div className="editable-segments">
              {editableSegments.map((segment, index) => (
                <div key={segment.id} className="editable-segment">
                  <div className="segment-preview" style={{ backgroundColor: segment.color }}>
                    <span style={{ color: segment.textColor || '#ffffff' }}>
                      {segment.text}
                    </span>
                  </div>

                  <div className="segment-controls">
                    <div className="control-row">
                      <div className="control-group">
                        <label htmlFor={`text-input-${segment.id}`}>Text</label>
                        <input
                          id={`text-input-${segment.id}`}
                          type="text"
                          value={segment.text}
                          onChange={e => updateEditableSegment(index, { text: e.target.value })}
                        />
                      </div>

                      <div className="control-group">
                        <label htmlFor={`color-input-${segment.id}`}>Color</label>
                        <input
                          id={`color-input-${segment.id}`}
                          type="color"
                          value={segment.color}
                          onChange={e => updateEditableSegment(index, { color: e.target.value })}
                        />
                      </div>

                      <div className="control-group">
                        <label htmlFor={`text-color-input-${segment.id}`}>Text Color</label>
                        <input
                          id={`text-color-input-${segment.id}`}
                          type="color"
                          value={segment.textColor || '#ffffff'}
                          onChange={e => updateEditableSegment(index, { textColor: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="control-row">
                      <div className="control-group">
                        <label htmlFor={`weight-input-${segment.id}`}>Weight</label>
                        <input
                          id={`weight-input-${segment.id}`}
                          type="number"
                          min="0.1"
                          max="10"
                          step="0.1"
                          value={segment.weight || 1}
                          onChange={e => updateEditableSegment(index, { weight: Number(e.target.value) })}
                        />
                      </div>

                      <div className="control-group">
                        <label htmlFor={`border-color-input-${segment.id}`}>Border Color</label>
                        <input
                          id={`border-color-input-${segment.id}`}
                          type="color"
                          value={segment.borderColor || '#000000'}
                          onChange={e => updateEditableSegment(index, { borderColor: e.target.value })}
                        />
                      </div>

                      <div className="control-group">
                        <label htmlFor={`border-width-input-${segment.id}`}>Border Width</label>
                        <input
                          id={`border-width-input-${segment.id}`}
                          type="number"
                          min="0"
                          max="10"
                          value={segment.borderWidth || 0}
                          onChange={e => updateEditableSegment(index, { borderWidth: Number(e.target.value) })}
                        />
                      </div>

                      <div className="control-group">
                        <label htmlFor={`disabled-checkbox-${segment.id}`}>Disabled</label>
                        <label className="checkbox-label">
                          <input
                            id={`disabled-checkbox-${segment.id}`}
                            type="checkbox"
                            checked={segment.disabled || false}
                            onChange={e => updateEditableSegment(index, { disabled: e.target.checked })}
                          />
                          <span>Disabled</span>
                        </label>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeSegment(index)}
                      className="btn btn-danger"
                      disabled={editableSegments.length <= 2}
                    >
                      🗑️ Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {lastResult && (
          <div className="result">
            <h3>🎉 Winner: {lastResult.segment.text}</h3>
            <div className="result-details">
              <p><strong>Segment ID:</strong> {lastResult.segment.id}</p>
              <p><strong>Duration:</strong> {lastResult.duration.toFixed(0)}ms</p>
              {lastResult.segment.weight !== 1 && lastResult.segment.weight !== undefined && (
                <p><strong>Weight:</strong> {lastResult.segment.weight}</p>
              )}
            </div>
          </div>
        )}

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
                  {segment.borderWidth && (
                    <small>Border: {segment.borderWidth}px</small>
                  )}
                  {segment.disabled && <small>DISABLED</small>}
                </div>
              </div>
            ))}
          </div>

          {currentSegments.some(s => s.weight !== 1 && s.weight !== undefined) && (
            <div className="probability-info">
              <h4>Win Probability</h4>
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
          )}
        </div>

        <div className="features-showcase">
          <h3>✨ Package Features</h3>
          <div className="features-grid">
            <div className="feature-card">
              <h4>🎯 Weighted Probability</h4>
              <p>Configure different weights for segments to control win probability</p>
            </div>
            <div className="feature-card">
              <h4>🎨 Custom Styling</h4>
              <p>Control colors, borders (with width), text styling, and themes</p>
            </div>
            <div className="feature-card">
              <h4>⚙️ Animation Control</h4>
              <p>Customizable duration and rotation count</p>
            </div>
            <div className="feature-card">
              <h4>🚫 Disabled Segments</h4>
              <p>Exclude certain segments from selection</p>
            </div>
            <div className="feature-card">
              <h4>⚡ Performance</h4>
              <p>Smooth animations even with many segments</p>
            </div>
            <div className="feature-card">
              <h4>🎮 Easy to Use</h4>
              <p>Simple API with TypeScript support</p>
            </div>
          </div>
        </div>

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
