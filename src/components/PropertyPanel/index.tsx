import React from 'react';
import { useBuilderContext } from '../../contexts/BuilderContext';

const PropertyPanel: React.FC = () => {
  const { selectedElement, updateElement } = useBuilderContext();

  if (!selectedElement) return <div>Select an element to edit</div>;

  return (
    <div style={{ padding: '10px', border: '1px solid #ddd' }}>
      <h3>Properties</h3>
      <div>
        <label>X: </label>
        <input
          type="number"
          value={selectedElement.x}
          onChange={(e) =>
            updateElement({ ...selectedElement, x: parseInt(e.target.value) })
          }
        />
      </div>
      {/* Add more properties based on element.type */}
    </div>
  );
};

export default PropertyPanel;