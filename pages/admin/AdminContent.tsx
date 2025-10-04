import React, { useState, useEffect } from 'react';
import { supabase } from '../../context/AuthContext';
import type { WebsiteContent } from '../../types';

const AdminContent: React.FC = () => {
    const [content, setContent] = useState<Partial<WebsiteContent>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchContent = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('website_content')
                .select('*')
                .eq('id', 1)
                .single();
            
            if (error) {
                console.error('Error fetching website content:', error);
                // Set default content if none is found, so form is not empty
                setContent({
                    hero_headline: 'Encuentra la Propiedad de Tus Sueños',
                    hero_subheadline: 'Tu socio de confianza en bienes raíces, dedicado a ayudarte a navegar tu próximo gran movimiento.',
                    hero_image: 'https://picsum.photos/seed/hero/1920/1080',
                    why_choose_us_title: '¿Por Qué Elegirnos?',
                    why_choose_us_text: 'Con años de experiencia y un compromiso con la excelencia, ofrecemos resultados inigualables y un servicio al cliente excepcional. Somos más que solo agentes; somos sus socios en bienes raíces.'
                });
            } else {
                setContent(data);
            }
            setLoading(false);
        };
        fetchContent();
    }, []);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setContent(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        
        const { error } = await supabase
            .from('website_content')
            .upsert({ id: 1, ...content });

        if (error) {
            alert('Error al guardar los cambios. Revisa la consola para más detalles.');
            console.error('Error saving content:', error);
        } else {
            alert('¡Contenido guardado exitosamente!');
        }
        setSaving(false);
    };

    const FormSection: React.FC<{title: string, children: React.ReactNode}> = ({ title, children }) => (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">{title}</h2>
            <div className="space-y-4">
                {children}
            </div>
        </div>
    );
    
    const InputField: React.FC<{label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void}> = ({ label, name, value, onChange}) => (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
            <input 
                type="text" 
                id={name}
                name={name} 
                value={value}
                onChange={onChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
        </div>
    );

    const TextareaField: React.FC<{label: string, name: string, value: string, rows?: number, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void}> = ({ label, name, value, rows=4, onChange}) => (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
            <textarea 
                id={name}
                name={name} 
                value={value}
                onChange={onChange}
                rows={rows}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
        </div>
    );
    
    if (loading) {
        return <div>Cargando editor de contenido...</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Gestionar Contenido del Sitio Web</h1>
            <form onSubmit={handleSubmit}>
                <FormSection title="Sección Principal (Página de Inicio)">
                    <InputField label="Titular" name="hero_headline" value={content.hero_headline || ''} onChange={handleInputChange} />
                    <TextareaField label="Subtítulo" name="hero_subheadline" value={content.hero_subheadline || ''} onChange={handleInputChange} />
                    <InputField label="URL de Imagen de Fondo" name="hero_image" value={content.hero_image || ''} onChange={handleInputChange} />
                </FormSection>

                <FormSection title="Sección '¿Por Qué Elegirnos?'">
                    <InputField label="Título" name="why_choose_us_title" value={content.why_choose_us_title || ''} onChange={handleInputChange} />
                    <TextareaField label="Contenido de Texto" name="why_choose_us_text" value={content.why_choose_us_text || ''} onChange={handleInputChange} />
                </FormSection>
                
                <div className="flex justify-end">
                    <button type="submit" disabled={saving} className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400">
                        {saving ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminContent;