import React, { useRef, useEffect, useState } from 'react';
import { PropertyPanelProps } from '../shared/types';

const PropertyPanel: React.FC<PropertyPanelProps> = ({ selectedElement, updateElement }) => {
    const textInputRef = useRef<HTMLInputElement>(null);
    const colorInputRef = useRef<HTMLInputElement>(null);
    const bgColorInputRef = useRef<HTMLInputElement>(null);
    const fontSizeInputRef = useRef<HTMLInputElement>(null);
    const imageUrlInputRef = useRef<HTMLInputElement>(null);
    const widthInputRef = useRef<HTMLInputElement>(null);
    const heightInputRef = useRef<HTMLInputElement>(null);
    const [activeInputField, setActiveInputField] = useState<string | null>(null);

    useEffect(() => {
        if (!selectedElement || !activeInputField) return;

        setTimeout(() => {
            switch (activeInputField) {
                case 'text':
                    textInputRef.current?.focus();
                    break;
                case 'color':
                    colorInputRef.current?.focus();
                    break;
                case 'bgColor':
                    bgColorInputRef.current?.focus();
                    break;
                case 'fontSize':
                    fontSizeInputRef.current?.focus();
                    break;
                case 'imageUrl':
                    imageUrlInputRef.current?.focus();
                    break;
                case 'width':
                    widthInputRef.current?.focus();
                    break;
                case 'height':
                    heightInputRef.current?.focus();
                    break;
            }
        }, 0);
    }, [selectedElement, activeInputField]);

    if (!selectedElement) {
        return (
            <div style={{
                padding: '15px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                background: '#f8f9fa',
            }}>
                <h3 style={{ marginTop: 0 }}>Properties</h3>
                <p>Select an element to edit its properties</p>
            </div>
        );
    }

    return (
        <div style={{
            padding: '15px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            background: '#f8f9fa',
        }}>
            <h3 style={{ marginTop: 0 }}>Properties</h3>

            <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Type</label>
                <div style={{ padding: '8px', background: '#e9ecef', borderRadius: '4px' }}>
                    {selectedElement.type.charAt(0).toUpperCase() + selectedElement.type.slice(1)}
                </div>
            </div>

            {['text', 'header', 'paragraph', 'button'].includes(selectedElement.type) && (
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Text</label>
                    <input
                        ref={textInputRef}
                        type="text"
                        value={selectedElement.text || ''}
                        onChange={e => {
                            updateElement({ ...selectedElement, text: e.target.value });
                        }}
                        onFocus={() => setActiveInputField('text')}
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ced4da' }}
                    />
                </div>
            )}

            <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Text Color</label>
                <input
                    ref={colorInputRef}
                    type="color"
                    value={selectedElement.color || '#000000'}
                    onChange={e => {
                        updateElement({ ...selectedElement, color: e.target.value });
                    }}
                    onFocus={() => setActiveInputField('color')}
                    style={{ width: '100%' }}
                />
            </div>

            <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Background Color</label>
                <input
                    ref={bgColorInputRef}
                    type="color"
                    value={selectedElement.backgroundColor || '#ffffff'}
                    onChange={e => {
                        updateElement({ ...selectedElement, backgroundColor: e.target.value });
                    }}
                    onFocus={() => setActiveInputField('bgColor')}
                    style={{ width: '100%' }}
                />
            </div>

            {['text', 'header', 'paragraph', 'button'].includes(selectedElement.type) && (
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Font Size</label>
                    <input
                        ref={fontSizeInputRef}
                        type="range"
                        min="8"
                        max="72"
                        value={selectedElement.fontSize || 16}
                        onChange={e => {
                            updateElement({ ...selectedElement, fontSize: parseInt(e.target.value) });
                        }}
                        onFocus={() => setActiveInputField('fontSize')}
                        style={{ width: '100%' }}
                    />
                    <div style={{ textAlign: 'center' }}>{selectedElement.fontSize || 16}px</div>
                </div>
            )}

            {selectedElement.type === 'image' && (
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Image URL</label>
                    <input
                        ref={imageUrlInputRef}
                        type="text"
                        value={selectedElement.src || ''}
                        onChange={e => {
                            updateElement({ ...selectedElement, src: e.target.value });
                        }}
                        onFocus={() => setActiveInputField('imageUrl')}
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ced4da' }}
                        placeholder="https://example.com/image.jpg"
                    />
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Width</label>
                    <input
                        ref={widthInputRef}
                        type="number"
                        value={selectedElement.width || 150}
                        onChange={e => {
                            updateElement({ ...selectedElement, width: parseInt(e.target.value) });
                        }}
                        onFocus={() => setActiveInputField('width')}
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ced4da' }}
                        min="50"
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Height</label>
                    <input
                        ref={heightInputRef}
                        type="number"
                        value={selectedElement.height || 40}
                        onChange={e => {
                            updateElement({ ...selectedElement, height: parseInt(e.target.value) });
                        }}
                        onFocus={() => setActiveInputField('height')}
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ced4da' }}
                        min="20"
                    />
                </div>
            </div>
        </div>
    );
};

export default PropertyPanel;