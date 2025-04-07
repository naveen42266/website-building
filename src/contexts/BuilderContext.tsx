import React, { createContext, useState, useContext } from 'react';
import { CanvasElement, Template } from '../types';

interface BuilderContextProps {
  elements: CanvasElement[];
  templates: Template[];
  selectedTemplate: string;
  selectedElement: CanvasElement | null;
  addElement: (element: CanvasElement) => void;
  updateElement: (element: CanvasElement) => void;
  setSelectedElement: (element: CanvasElement | null) => void;
}

export const BuilderContext = createContext<BuilderContextProps>(null!);

export const BuilderProvider = ({ children }: { children: React.ReactNode }) => {
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<CanvasElement | null>(null);
  const [templates] = useState<Template[]>([
    { id: 'default', name: 'Default', background: '#f0f0f0', width: 800, height: 600 },
  ]);

  const addElement = (element: CanvasElement) => {
    setElements([...elements, element]);
  };

  const updateElement = (updatedElement: CanvasElement) => {
    setElements(elements.map(el => (el.id === updatedElement.id ? updatedElement : el)));
  };

  return (
    <BuilderContext.Provider
      value={{
        elements,
        templates,
        selectedTemplate: 'default',
        selectedElement,
        addElement,
        updateElement,
        setSelectedElement,
      }}
    >
      {children}
    </BuilderContext.Provider>
  );
};

// Custom hook for consuming the context
export const useBuilderContext = () => {
  const context = useContext(BuilderContext);
  if (!context) {
    throw new Error('useBuilderContext must be used within a BuilderProvider');
  }
  return context;
};