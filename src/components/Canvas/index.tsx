import React, { useRef, useState } from 'react';
import { useDrop } from 'react-dnd';
import CanvasElement from './CanvasElement';
import { CanvasProps } from '../shared/types';
import { useCombinedRefs } from '../shared/utils';

const Canvas: React.FC<CanvasProps> = ({
    elements,
    selectedElement,
    canvasWidth,
    canvasHeight,
    selectedTemplate,
    setSelectedElement,
    updateElement,
    deleteElement,
    moveElement,
    addElement,
    setCanvasWidth,
    setCanvasHeight,
}) => {
    const canvasRef = useRef<HTMLDivElement>(null);
    const [isResizing, setIsResizing] = useState(false);
    
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
                    // Adding new element from toolbox
                    addElement(item, x, y);
                }
            }
        },
    });

    const currentTemplate = {
        id: 'default',
        name: 'Default',
        background: '#ffffff',
        width: canvasWidth,
        height: canvasHeight,
    };

    const combinedRef = useCombinedRefs(canvasRef, drop);

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
        <div style={{
            position: 'relative',
            width: 'fit-content',
            margin: '20px auto',
        }}>
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
                    <CanvasElement
                        key={element.id}
                        element={element}
                        isSelected={selectedElement?.id === element.id}
                        onClick={() => setSelectedElement(element)}
                        onUpdate={updateElement}
                        onDelete={deleteElement}
                    />
                ))}
            </div>
            
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

export default Canvas;