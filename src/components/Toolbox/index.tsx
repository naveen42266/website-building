import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useBuilderContext } from '../../contexts/BuilderContext';

const Toolbox: React.FC = () => {
  const { addElement } = useBuilderContext();

  const items = [
    { type: 'text', label: 'Text' },
    { type: 'image', label: 'Image' },
    { type: 'button', label: 'Button' },
  ];

  return (
    <div style={{ padding: '10px', border: '1px solid #ddd' }}>
      <h3>Toolbox</h3>
      {items.map((item) => (
        <div
          key={item.type}
          style={{ padding: '5px', margin: '5px', cursor: 'grab', background: '#f5f5f5' }}
          draggable
          onDragStart={(e) => {
            e.dataTransfer.setData('type', item.type);
          }}
        >
          {item.label}
        </div>
      ))}
    </div>
  );
};

export default Toolbox;