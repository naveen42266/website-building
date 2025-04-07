export interface CanvasElement {
    id: string;
    type: 'text' | 'image' | 'button';
    x: number;
    y: number;
    text?: string;
    src?: string;
    color?: string;
    fontSize?: number;
  }
  
  export interface Template {
    id: string;
    name: string;
    background: string;
    width: number;
    height: number;
  }