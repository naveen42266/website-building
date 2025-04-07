import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { isMobile } from 'react-device-detect';
import { CanvasElement, Template } from '../../components/shared/types';
import { generateId } from '../../components/shared/utils';
import TemplateSelector from '../../components/TemplateSelector';
import Toolbox from '../../components/Toolbox';
import Canvas from '../../components/Canvas';
import PropertyPanel from '../../components/PropertyPanel';


const Home: React.FC = () => {
    const [elements, setElements] = useState<CanvasElement[]>([]);
    const [selectedElement, setSelectedElement] = useState<CanvasElement | null>(null);
    const [templates] = useState<Template[]>([
        { id: 'default', name: 'Default', background: '#ffffff', width: 800, height: 1000 },
        { id: 'business', name: 'Business', background: '#f8f9fa', width: 800, height: 1000 },
    ]);
    const [selectedTemplate, setSelectedTemplate] = useState('default');
    const [canvasWidth, setCanvasWidth] = useState<number>(800);
    const [canvasHeight, setCanvasHeight] = useState<number>(1000);

    const findTemplate = (id: string) => templates.find(t => t.id === id) || templates[0];

    const addElement = (element: Omit<CanvasElement, 'id'>, x: number, y: number) => {
        const newElement: CanvasElement = {
            ...element,
            id: generateId(),
            x,
            y,
            width: element.width || (element.type === 'image' ? 200 : 150),
            height: element.height || (element.type === 'image' ? 150 : 40),
        };
        setElements([...elements, newElement]);
        setSelectedElement(newElement);
    };

    const updateElement = (updatedElement: CanvasElement) => {
        setElements(elements.map(el => (el.id === updatedElement.id ? updatedElement : el)));
        setSelectedElement(updatedElement);
    };

    const deleteElement = (id: string) => {
        setElements(elements.filter(el => el.id !== id));
        if (selectedElement?.id === id) {
            setSelectedElement(null);
        }
    };

    const moveElement = (id: string, x: number, y: number) => {
        setElements(elements.map(el => 
            el.id === id ? { ...el, x, y } : el
        ));
    };

    useEffect(() => {
        const template = findTemplate(selectedTemplate);
        setCanvasWidth(template.width);
        setCanvasHeight(template.height);
    }, [selectedTemplate]);

    return (
        <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
            <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
                <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Website Builder</h1>

                <TemplateSelector 
                    templates={templates}
                    selectedTemplate={selectedTemplate}
                    setSelectedTemplate={setSelectedTemplate}
                />

                <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr 250px', gap: '20px' }}>
                    <Toolbox
                        canvasWidth={canvasWidth}
                        canvasHeight={canvasHeight}
                        selectedTemplate={selectedTemplate}
                        setCanvasWidth={setCanvasWidth}
                        setCanvasHeight={setCanvasHeight}
                        findTemplate={findTemplate}
                    />
                    <Canvas 
                        elements={elements}
                        selectedElement={selectedElement}
                        canvasWidth={canvasWidth}
                        canvasHeight={canvasHeight}
                        selectedTemplate={selectedTemplate}
                        setSelectedElement={setSelectedElement}
                        updateElement={updateElement}
                        deleteElement={deleteElement}
                        moveElement={moveElement}
                        addElement={addElement}
                        setCanvasWidth={setCanvasWidth}
                        setCanvasHeight={setCanvasHeight}
                    />
                    <PropertyPanel 
                        selectedElement={selectedElement}
                        updateElement={updateElement}
                    />
                </div>
            </div>
        </DndProvider>
    );
};

export default Home;