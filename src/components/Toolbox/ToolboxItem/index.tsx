import React from 'react';
import { useDrag } from 'react-dnd';

interface ToolboxItemProps {
    item: { type: string; label: string; icon: string };
}

const ToolboxItem: React.FC<ToolboxItemProps> = ({ item }) => {
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

export default ToolboxItem;