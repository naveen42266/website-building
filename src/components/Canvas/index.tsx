import React from 'react';
import CanvasItem from './CanvasItem';
import { useBuilderContext } from '../../contexts/BuilderContext';

const Canvas: React.FC = () => {
  const { elements, templates, selectedTemplate } = useBuilderContext();

  return (
    <div
      style={{
        position: 'relative',
        width: `${templates[0].width}px`,
        height: `${templates[0].height}px`,
        background: templates[0].background,
        margin: '20px auto',
        border: '1px dashed #ccc',
      }}
    >
      {elements.map((element) => (
        <CanvasItem key={element.id} element={element} />
      ))}
    </div>
  );
};


export default Canvas;