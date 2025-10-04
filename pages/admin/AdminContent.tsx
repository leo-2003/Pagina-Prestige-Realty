import React, { useState } from 'react';

const AdminContent: React.FC = () => {
    // State to hold the content, initialized with placeholder values
    const [content, setContent] = useState({
        heroHeadline: 'Encuentra la Propiedad de Tus Sueños',
        heroSubheadline: 'Tu socio de confianza en bienes raíces, dedicado a ayudarte a navegar tu próximo gran movimiento.',
        heroImage: 'https://picsum.photos/seed/hero/1920/1080',
        whyChooseUsTitle: '¿Por Qué Elegirnos?',
        whyChooseUsText: 'Con años de experiencia y un compromiso con la excelencia, ofrecemos resultados inigualables y un servicio al cliente excepcional. Somos más que solo agentes; somos sus socios en bienes raíces.'
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setContent(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Content saved! (Simulation)');
        // In a real app, you would send this state to your backend/API
        console.log('Saving content:', content);
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

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Manage Website Content</h1>
            <form onSubmit={handleSubmit}>
                <FormSection title="Hero Section (Homepage)">
                    <InputField label="Headline" name="heroHeadline" value={content.heroHeadline} onChange={handleInputChange} />
                    <TextareaField label="Subheadline" name="heroSubheadline" value={content.heroSubheadline} onChange={handleInputChange} />
                    <InputField label="Background Image URL" name="heroImage" value={content.heroImage} onChange={handleInputChange} />
                </FormSection>

                <FormSection title="'Why Choose Us' Section">
                    <InputField label="Title" name="whyChooseUsTitle" value={content.whyChooseUsTitle} onChange={handleInputChange} />
                    <TextareaField label="Text Content" name="whyChooseUsText" value={content.whyChooseUsText} onChange={handleInputChange} />
                </FormSection>
                
                <div className="flex justify-end">
                    <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors">
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminContent;
