import React from 'react';
import ToolboxItem from './ToolboxItem';
import { ToolboxProps } from '../shared/types';

const Toolbox: React.FC<ToolboxProps> = ({
    canvasWidth,
    canvasHeight,
    selectedTemplate,
    setCanvasWidth,
    setCanvasHeight,
    findTemplate,
}) => {
    const elements = [
        { type: 'header', label: 'Header', icon: 'H' },
        { type: 'paragraph', label: 'Paragraph', icon: 'P' },
        { type: 'text', label: 'Text', icon: 'T' },
        { type: 'image', label: 'Image', icon: '📷' },
        { type: 'button', label: 'Button', icon: '🔘' },
    ];

    return (
        <div style={{
            padding: '15px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            background: '#f8f9fa',
        }}>
            <h3 style={{ marginTop: 0 }}>Elements</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                {elements.map(item => (
                    <ToolboxItem key={item.type} item={item} />
                ))}
            </div>
            
            <h3 style={{ marginTop: '20px' }}>Canvas Size</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Width (px)</label>
                    <input
                        type="number"
                        value={canvasWidth}
                        onChange={e => setCanvasWidth(Math.max(400, parseInt(e.target.value) || 400))}
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ced4da' }}
                        min="400"
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Height (px)</label>
                    <input
                        type="number"
                        value={canvasHeight}
                        onChange={e => setCanvasHeight(Math.max(400, parseInt(e.target.value) || 400))}
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ced4da' }}
                        min="400"
                    />
                </div>
            </div>
            <button
                onClick={() => {
                    const template = findTemplate(selectedTemplate);
                    setCanvasWidth(template.width);
                    setCanvasHeight(template.height);
                }}
                style={{
                    width: '100%',
                    padding: '8px',
                    background: '#f0f0f0',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    cursor: 'pointer',
                }}
            >
                Reset to Template Size
            </button>
        </div>
    );
};

export default Toolbox;