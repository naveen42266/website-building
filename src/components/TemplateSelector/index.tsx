import React from 'react';
import { TemplateSelectorProps } from '../shared/types';

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ templates, selectedTemplate, setSelectedTemplate }) => {
    return (
        <div style={{
            padding: '15px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            background: '#f8f9fa',
            marginBottom: '20px',
        }}>
            <h3 style={{ marginTop: 0 }}>Templates</h3>
            <div style={{ display: 'flex', gap: '10px' }}>
                {templates.map(template => (
                    <div
                        key={template.id}
                        onClick={() => setSelectedTemplate(template.id)}
                        style={{
                            width: '80px',
                            height: '100px',
                            background: template.background,
                            border: selectedTemplate === template.id ? '2px solid #1890ff' : '1px solid #ddd',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            position: 'relative',
                            overflow: 'hidden',
                        }}
                    >
                        <div style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background: 'rgba(0,0,0,0.7)',
                            color: 'white',
                            padding: '5px',
                            fontSize: '12px',
                            textAlign: 'center',
                        }}>
                            {template.name}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TemplateSelector;