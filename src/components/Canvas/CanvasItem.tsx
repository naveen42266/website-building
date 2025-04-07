import React from 'react';
import { useDragDrop } from '../../hooks/useDragDrop';
import { CanvasElement } from '../../types';
import { useBuilderContext } from '../../contexts/BuilderContext';
interface Props {
  element: CanvasElement;
}

const CanvasItem: React.FC<Props> = ({ element }) => {
  const { updateElement, setSelectedElement } = useBuilderContext();
  const { drag, drop, isDragging } = useDragDrop(element.type, element, (id, x, y) => {
    updateElement({ ...element, x, y });
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      style={{
        position: 'absolute',
        left: `${element.x}px`,
        top: `${element.y}px`,
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
      }}
      onClick={() => setSelectedElement(element)}
    >
      {element.type === 'text' && (
        <div style={{ fontSize: element.fontSize, color: element.color }}>{element.text}</div>
      )}
      {element.type === 'image' && <img src={element.src} alt="Draggable" width="100px" />}
      {element.type === 'button' && (
        <button style={{ backgroundColor: element.color }}>{element.text}</button>
      )}
    </div>
  );
};


export default CanvasItem;
