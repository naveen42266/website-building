export type ElementType = 'text' | 'image' | 'button' | 'header' | 'paragraph';

export interface CanvasElement {
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

export interface Template {
    id: string;
    name: string;
    background: string;
    width: number;
    height: number;
}

export interface CanvasProps {
    elements: CanvasElement[];
    selectedElement: CanvasElement | null;
    canvasWidth: number;
    canvasHeight: number;
    selectedTemplate: string;
    setSelectedElement: (element: CanvasElement | null) => void;
    updateElement: (element: CanvasElement) => void;
    deleteElement: (id: string) => void;
    moveElement: (id: string, x: number, y: number) => void;
    addElement: (element: Omit<CanvasElement, 'id'>, x: number, y: number) => void;
    setCanvasWidth: (width: number) => void;
    setCanvasHeight: (height: number) => void;
}

export interface ToolboxProps {
    canvasWidth: number;
    canvasHeight: number;
    selectedTemplate: string;
    setCanvasWidth: (width: number) => void;
    setCanvasHeight: (height: number) => void;
    findTemplate: (id: string) => Template;
}

export interface PropertyPanelProps {
    selectedElement: CanvasElement | null;
    updateElement: (element: CanvasElement) => void;
}

export interface TemplateSelectorProps {
    templates: Template[];
    selectedTemplate: string;
    setSelectedTemplate: (id: string) => void;
}