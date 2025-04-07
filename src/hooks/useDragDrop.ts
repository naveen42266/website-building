import { useDrag, useDrop } from 'react-dnd';
import { CanvasElement } from '../types';

export const useDragDrop = (
  type: string,
  element: CanvasElement,
  onMove: (id: string, x: number, y: number) => void
) => {
  const [{ isDragging }, drag] = useDrag({
    type,
    item: { ...element },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: type,
    drop: (item: CanvasElement, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset()!;
      onMove(item.id, element.x + delta.x, element.y + delta.y);
    },
  });

  return { drag, drop, isDragging };
};