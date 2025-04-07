// import React from 'react';
// import { BuilderProvider } from '../../contexts/BuilderContext';
// import Toolbox from '../../components/Toolbox';
// import Canvas from '../../components/Canvas';
// import PropertyPanel from '../../components/PropertyPanel';


// const Home: React.FC = () => {
//     return (
//         <BuilderProvider>
//             <div style={{ display: 'flex', gap: '20px' }}>
//                 <Toolbox />
//                 <Canvas />
//                 <PropertyPanel />
//             </div>
//         </BuilderProvider>
//     );
// };


// export default Home;



import React, { useState, useRef, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { isMobile } from 'react-device-detect';

// ==================== TYPES ====================
type ElementType = 'text' | 'image' | 'button' | 'header' | 'paragraph';

interface CanvasElement {
    id: string;
    type: ElementType;
    x: number;
    y: number;
    width?: number;
    height?: number;
    text?: string;
    src?: string;
    color?: string;
    backgroundColor?: string;
    fontSize?: number;
    fontWeight?: number;
}

interface Template {
    id: string;
    name: string;
    background: string;
    width: number;
    height: number;
}

// ==================== MAIN COMPONENT ====================
const Home = () => {
    // ==================== STATE ====================
    const [elements, setElements] = useState<CanvasElement[]>([]);
    const [selectedElement, setSelectedElement] = useState<CanvasElement | null>(null);
    const [templates] = useState<Template[]>([
        { id: 'default', name: 'Default', background: '#ffffff', width: 800, height: 1000 },
        { id: 'business', name: 'Business', background: '#f8f9fa', width: 800, height: 1000 },
    ]);
    const [selectedTemplate, setSelectedTemplate] = useState('default');
    const [canvasWidth, setCanvasWidth] = useState<number>(800);
    const [canvasHeight, setCanvasHeight] = useState<number>(1000);
    const [isResizing, setIsResizing] = useState<boolean>(false);
    const canvasRef = useRef<HTMLDivElement>(null);
    // Store the current active input field to restore focus later
    const [activeInputField, setActiveInputField] = useState<string | null>(null);

    // Update canvas dimensions when template changes
    useEffect(() => {
        const template = findTemplate(selectedTemplate);
        setCanvasWidth(template.width);
        setCanvasHeight(template.height);
    }, [selectedTemplate]);

    // ==================== UTILITY FUNCTIONS ====================
    const generateId = () => `element-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const findTemplate = (id: string) => templates.find(t => t.id === id) || templates[0];

    // ==================== ELEMENT OPERATIONS ====================
    const addElement = (element: Omit<CanvasElement, 'id'>, x: number, y: number) => {
        const newElement: CanvasElement = {
            ...element,
            id: generateId(),
            x,
            y,
            width: element.width || (element.type === 'image' ? 200 : 150),
            height: element.height || (element.type === 'image' ? 150 : 40),
        };
        setElements([...elements, newElement]);
        setSelectedElement(newElement);
    };

    const updateElement = (updatedElement: CanvasElement) => {
        setElements(elements.map(el => (el.id === updatedElement.id ? updatedElement : el)));
        setSelectedElement(updatedElement);
    };

    const deleteElement = (id: string) => {
        setElements(elements.filter(el => el.id !== id));
        if (selectedElement?.id === id) {
            setSelectedElement(null);
        }
    };

    const moveElement = (id: string, x: number, y: number) => {
        setElements(elements.map(el =>
            el.id === id ? { ...el, x, y } : el
        ));
    };

    function useCombinedRefs<T>(...refs: React.Ref<T>[]): React.RefCallback<T> {
        return (node: T | null) => {
            refs.forEach(ref => {
                if (typeof ref === 'function') {
                    ref(node);
                } else if (ref && 'current' in ref) {
                    (ref as React.MutableRefObject<T | null>).current = node;
                }
            });
        };
    }

    // ==================== CANVAS COMPONENT ====================
    const Canvas = () => {
        const [, drop] = useDrop({
            accept: ['text', 'image', 'button', 'header', 'paragraph'],
            drop: (item: any, monitor) => {
                const offset = monitor.getClientOffset();
                if (offset && canvasRef.current) {
                    const canvasRect = canvasRef.current.getBoundingClientRect();
                    const x = offset.x - canvasRect.left - (item.width || 100) / 2;
                    const y = offset.y - canvasRect.top - (item.height || 40) / 2;

                    if (item.id) {
                        // Moving existing element
                        moveElement(item.id, x, y);
                    } else {
                        // Adding new element
                        addElement(item, x, y);
                    }
                }
            },
        });

        const currentTemplate = findTemplate(selectedTemplate);
        const combinedRef = useCombinedRefs(canvasRef, drop);
        
        // Canvas resize handlers
        const handleResize = (direction: 'bottom' | 'right' | 'corner', e: React.MouseEvent | React.TouchEvent) => {
            e.stopPropagation();
            e.preventDefault();
            setIsResizing(true);
            
            const startX = 'touches' in e ? e.touches[0].clientX : e.clientX;
            const startY = 'touches' in e ? e.touches[0].clientY : e.clientY;
            const startWidth = canvasWidth;
            const startHeight = canvasHeight;
            
            const handleMouseMove = (moveEvent: MouseEvent | TouchEvent) => {
                if (!isResizing) return;
                
                const clientX = 'touches' in moveEvent ? moveEvent.touches[0].clientX : moveEvent.clientX;
                const clientY = 'touches' in moveEvent ? moveEvent.touches[0].clientY : moveEvent.clientY;
                
                if (direction === 'right' || direction === 'corner') {
                    const newWidth = Math.max(400, startWidth + (clientX - startX));
                    setCanvasWidth(newWidth);
                }
                
                if (direction === 'bottom' || direction === 'corner') {
                    const newHeight = Math.max(400, startHeight + (clientY - startY));
                    setCanvasHeight(newHeight);
                }
            };
            
            const handleMouseUp = () => {
                setIsResizing(false);
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('touchmove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
                document.removeEventListener('touchend', handleMouseUp);
            };
            
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('touchmove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.addEventListener('touchend', handleMouseUp);
        };
        
        return (
            <div
                style={{
                    position: 'relative',
                    width: 'fit-content',
                    margin: '20px auto',
                }}
            >
                <div
                    ref={combinedRef}
                    style={{
                        position: 'relative',
                        width: `${canvasWidth}px`,
                        height: `${canvasHeight}px`,
                        background: currentTemplate.background,
                        border: '1px dashed #ccc',
                        overflow: 'hidden',
                    }}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setSelectedElement(null);
                        }
                    }}
                >
                    {elements.map(element => (
                        <DraggableElement
                            key={element.id}
                            element={element}
                            isSelected={selectedElement?.id === element.id}
                            onClick={() => setSelectedElement(element)}
                            onUpdate={updateElement}
                            onDelete={deleteElement}
                        />
                    ))}
                </div>
                
                {/* Resize handles */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: '-10px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '40px',
                        height: '10px',
                        background: '#1890ff',
                        cursor: 'ns-resize',
                        borderRadius: '0 0 4px 4px',
                    }}
                    onMouseDown={(e) => handleResize('bottom', e)}
                    onTouchStart={(e) => handleResize('bottom', e)}
                />
                
                <div
                    style={{
                        position: 'absolute',
                        right: '-10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '10px',
                        height: '40px',
                        background: '#1890ff',
                        cursor: 'ew-resize',
                        borderRadius: '0 4px 4px 0',
                    }}
                    onMouseDown={(e) => handleResize('right', e)}
                    onTouchStart={(e) => handleResize('right', e)}
                />
                
                <div
                    style={{
                        position: 'absolute',
                        bottom: '-10px',
                        right: '-10px',
                        width: '20px',
                        height: '20px',
                        background: '#1890ff',
                        cursor: 'nwse-resize',
                        borderRadius: '0 0 4px 0',
                    }}
                    onMouseDown={(e) => handleResize('corner', e)}
                    onTouchStart={(e) => handleResize('corner', e)}
                />
                
                {/* Canvas dimensions display */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: '-30px',
                        left: '0',
                        fontSize: '12px',
                        color: '#666',
                    }}
                >
                    {canvasWidth}px × {canvasHeight}px
                </div>
            </div>
        );
    };

    // ==================== DRAGGABLE ELEMENT COMPONENT ====================
    const DraggableElement: React.FC<{
        element: CanvasElement;
        isSelected: boolean;
        onClick: () => void;
        onUpdate: (element: CanvasElement) => void;
        onDelete: (id: string) => void;
    }> = ({ element, isSelected, onClick, onUpdate, onDelete }) => {
        const [{ isDragging }, drag] = useDrag({
            type: element.type,
            item: { ...element },
            collect: monitor => ({
                isDragging: !!monitor.isDragging(),
            }),
        });

        const [, drop] = useDrop({
            accept: ['text', 'image', 'button', 'header', 'paragraph'],
            hover: (draggedItem: any) => {
                if (draggedItem.id !== element.id) {
                    // Swap elements if needed
                }
            },
        });

        const style: React.CSSProperties = {
            position: 'absolute',
            left: `${element.x}px`,
            top: `${element.y}px`,
            width: `${element.width}px`,
            height: `${element.height}px`,
            opacity: isDragging ? 0.5 : 1,
            cursor: 'move',
            border: isSelected ? '2px solid #1890ff' : '1px dashed transparent',
            padding: '5px',
            boxSizing: 'border-box',
            zIndex: isSelected ? 100 : 1,
        };

        const renderElement = () => {
            switch (element.type) {
                case 'text':
                    return (
                        <div style={{
                            color: element.color || '#000000',
                            fontSize: `${element.fontSize || 14}px`,
                            fontWeight: element.fontWeight || 400,
                            width: '100%',
                            height: '100%',
                            backgroundColor: element.backgroundColor || 'transparent',
                        }}>
                            {element.text || 'Text Element'}
                        </div>
                    );
                case 'image':
                    return (
                        <img
                            src={element.src || 'https://via.placeholder.com/200x150'}
                            alt=""
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                            }}
                        />
                    );
                case 'button':
                    return (
                        <button
                            style={{
                                width: '100%',
                                height: '100%',
                                backgroundColor: element.backgroundColor || '#1890ff',
                                color: element.color || '#ffffff',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: `${element.fontSize || 14}px`,
                            }}
                        >
                            {element.text || 'Button'}
                        </button>
                    );
                case 'header':
                    return (
                        <h1
                            style={{
                                color: element.color || '#000000',
                                fontSize: `${element.fontSize || 24}px`,
                                fontWeight: element.fontWeight || 700,
                                margin: 0,
                                width: '100%',
                                height: '100%',
                                backgroundColor: element.backgroundColor || 'transparent',
                            }}
                        >
                            {element.text || 'Header'}
                        </h1>
                    );
                case 'paragraph':
                    return (
                        <p
                            style={{
                                color: element.color || '#000000',
                                fontSize: `${element.fontSize || 16}px`,
                                fontWeight: element.fontWeight || 400,
                                margin: 0,
                                width: '100%',
                                height: '100%',
                                backgroundColor: element.backgroundColor || 'transparent',
                            }}
                        >
                            {element.text || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'}
                        </p>
                    );
                default:
                    return null;
            }
        };

        return (
            <div
                ref={node => drag(drop(node))}
                style={style}
                onClick={(e) => {
                    e.stopPropagation();
                    onClick();
                }}
            >
                {renderElement()}
                {isSelected && (
                    <div style={{
                        position: 'absolute',
                        top: '-25px',
                        right: 0,
                        display: 'flex',
                        gap: '5px',
                    }}>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(element.id);
                            }}
                            style={{
                                background: '#ff4d4f',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                padding: '2px 5px',
                                cursor: 'pointer',
                            }}
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>
        );
    };

    // ==================== TOOLBOX COMPONENT ====================
    const Toolbox = () => {
        const elements: { type: ElementType; label: string; icon: string }[] = [
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
                
                {/* Canvas Size Controls */}
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

    const ToolboxItem: React.FC<{ item: { type: ElementType; label: string; icon: string } }> = ({ item }) => {
        const [{ isDragging }, drag] = useDrag({
            type: item.type,
            item: { type: item.type },
            collect: monitor => ({
                isDragging: !!monitor.isDragging(),
            }),
        });

        return (
            <div
                ref={drag}
                style={{
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    background: '#fff',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'grab',
                    opacity: isDragging ? 0.5 : 1,
                }}
            >
                <div style={{ fontSize: '20px', marginBottom: '5px' }}>{item.icon}</div>
                <div>{item.label}</div>
            </div>
        );
    };

    // ==================== PROPERTY PANEL COMPONENT ====================
    const PropertyPanel = () => {
        // Create refs for all input fields
        const textInputRef = useRef<HTMLInputElement>(null);
        const colorInputRef = useRef<HTMLInputElement>(null);
        const bgColorInputRef = useRef<HTMLInputElement>(null);
        const fontSizeInputRef = useRef<HTMLInputElement>(null);
        const imageUrlInputRef = useRef<HTMLInputElement>(null);
        const widthInputRef = useRef<HTMLInputElement>(null);
        const heightInputRef = useRef<HTMLInputElement>(null);

        // Use the global activeInputField state to track which input field was last focused
        // This is key to the fix - we're maintaining the same input field selection across renders

        // Effect to restore focus after element update
        useEffect(() => {
            if (!selectedElement || !activeInputField) return;

            // Schedule this for after the current render cycle
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

    // ==================== TEMPLATE SELECTOR ====================
    const TemplateSelector = () => {
        return (
            <div style={{
                padding: '15px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                background: '#f8f9fa',
                marginBottom: '20px',
            }}>
                <h3 style={{ marginTop: 0 }}>Templates</h3>
                <div style={{ display: 'flex', gap: '10px' }}>
                    {templates.map(template => (
                        <div
                            key={template.id}
                            onClick={() => setSelectedTemplate(template.id)}
                            style={{
                                width: '80px',
                                height: '100px',
                                background: template.background,
                                border: selectedTemplate === template.id ? '2px solid #1890ff' : '1px solid #ddd',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                position: 'relative',
                                overflow: 'hidden',
                            }}
                        >
                            <div style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                background: 'rgba(0,0,0,0.7)',
                                color: 'white',
                                padding: '5px',
                                fontSize: '12px',
                                textAlign: 'center',
                            }}>
                                {template.name}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // ==================== RENDER ====================
    return (
        <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
            <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
                <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Website Builder</h1>

                <TemplateSelector />

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '250px 1fr 250px',
                    gap: '20px',
                }}>
                    <Toolbox />
                    <Canvas />
                    <PropertyPanel />
                </div>
            </div>
        </DndProvider>
    );
}

export default Home;