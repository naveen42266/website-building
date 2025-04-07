import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import type { CanvasElement } from '../../shared/types';

interface DraggableElementProps {
    element: CanvasElement;
    isSelected: boolean;
    onClick: () => void;
    onUpdate: (element: CanvasElement) => void;
    onDelete: (id: string) => void;
}

const CanvasElement: React.FC<DraggableElementProps> = ({ 
    element, 
    isSelected, 
    onClick, 
    // onUpdate, 
    onDelete 
}) => {
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

export default CanvasElement;