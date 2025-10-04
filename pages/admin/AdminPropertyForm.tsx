import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../context/AuthContext';
import type { Property } from '../../types';
import { GoogleGenAI } from '@google/genai';
import { SparklesIcon, XCircleIcon, ArrowUpOnSquareIcon } from '@heroicons/react/24/solid';

const AdminPropertyForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isNew = id === undefined;

    const [property, setProperty] = useState<Partial<Property>>({
        title: '',
        price: 0,
        location: '',
        bedrooms: 0,
        bathrooms: 0,
        area: 0,
        type: 'House',
        status: 'For Sale',
        images: [],
        description: '',
        features: [],
        amenities: [],
        agent: { name: 'John Doe', imageUrl: 'https://picsum.photos/seed/agent1/200/200', phone: '123-456-7890', email: 'john.doe@prestige.com' },
        year_built: new Date().getFullYear(),
    });

    const [featuresStr, setFeaturesStr] = useState('');
    const [amenitiesStr, setAmenitiesStr] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [loading, setLoading] = useState(!isNew);
    const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [errors, setErrors] = useState<Partial<Record<keyof Property | 'featuresStr' | 'amenitiesStr', string>>>({});


    useEffect(() => {
        const fetchProperty = async () => {
            if (isNew) return;
            
            const { data, error } = await supabase
                .from('properties')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error('Error fetching property for edit:', error);
                navigate('/admin/properties');
            } else if (data) {
                setProperty(data);
                setFeaturesStr((data.features || []).join(', '));
                setAmenitiesStr((data.amenities || []).join(', '));
                if (data.images) {
                  setImagePreviews(data.images);
                }
            }
            setLoading(false);
        };
        
        fetchProperty();
    }, [id, isNew, navigate]);

    const clearError = (fieldName: string) => {
        if (errors[fieldName as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [fieldName]: undefined }));
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProperty(prev => ({ ...prev, [name]: name === 'price' || name === 'bedrooms' || name === 'bathrooms' || name === 'area' || name === 'year_built' ? Number(value) : value }));
        clearError(name);
    };
    
    const handleFeaturesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFeaturesStr(e.target.value);
        clearError('featuresStr');
    };
    
    const handleAmenitiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAmenitiesStr(e.target.value);
        clearError('amenitiesStr');
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray: File[] = Array.from(e.target.files);
            setNewImageFiles(prev => [...prev, ...filesArray]);

            const previewsArray = filesArray.map(file => URL.createObjectURL(file));
            setImagePreviews(prev => [...prev, ...previewsArray]);
            clearError('images');
        }
    };

    const handleRemoveNewImage = (index: number) => {
        const newFileIndex = index - (property.images?.length || 0);
        setNewImageFiles(prev => prev.filter((_, i) => i !== newFileIndex));
        setImagePreviews(prev => {
            const urlToRevoke = prev[index];
            URL.revokeObjectURL(urlToRevoke); 
            return prev.filter((_, i) => i !== index);
        });
    };

    const handleRemoveExistingImage = (imageUrl: string) => {
        setProperty(prev => ({
            ...prev,
            images: prev.images?.filter(img => img !== imageUrl)
        }));
        setImagePreviews(prev => prev.filter(url => url !== imageUrl));
        setImagesToDelete(prev => [...prev, imageUrl]);
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof Property | 'featuresStr' | 'amenitiesStr', string>> = {};

        if (!property.title?.trim()) newErrors.title = 'El título es obligatorio.';
        if (!property.location?.trim()) newErrors.location = 'La ubicación es obligatoria.';
        if (!property.price || property.price <= 0) newErrors.price = 'El precio debe ser un número positivo.';
        if (property.bedrooms === undefined || property.bedrooms < 0) newErrors.bedrooms = 'El número de habitaciones no puede ser negativo.';
        if (property.bathrooms === undefined || property.bathrooms < 0) newErrors.bathrooms = 'El número de baños no puede ser negativo.';
        if (!property.area || property.area <= 0) newErrors.area = 'El área debe ser un número positivo.';
        if (!property.year_built || property.year_built < 1800 || property.year_built > new Date().getFullYear() + 1) {
            newErrors.year_built = 'Por favor, introduce un año de construcción válido.';
        }
        if (!property.description?.trim()) newErrors.description = 'La descripción es obligatoria.';
        if (!featuresStr.trim()) newErrors.featuresStr = 'Por favor, añade al menos una característica.';
        if (!amenitiesStr.trim()) newErrors.amenitiesStr = 'Por favor, añade al menos una amenidad.';
        
        const totalImages = (property.images?.length || 0) + newImageFiles.length;
        if (totalImages === 0) {
            newErrors.images = 'Se requiere al menos una imagen.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        setIsUploading(true);

        let finalImageUrls = property.images ? [...property.images] : [];

        // 1. Delete images from storage
        if (imagesToDelete.length > 0) {
            const pathsToDelete = imagesToDelete.map(url => {
                const urlParts = url.split('/property-images/');
                return urlParts.length > 1 ? urlParts[1] : '';
            }).filter(Boolean);

            if (pathsToDelete.length > 0) {
                 const { error: deleteError } = await supabase.storage.from('property-images').remove(pathsToDelete);
                if (deleteError) {
                    console.error('Error deleting images:', deleteError);
                    alert('Failed to delete some images.');
                    setIsUploading(false);
                    return;
                }
            }
            setImagesToDelete([]);
        }

        // 2. Upload new images to storage
        if (newImageFiles.length > 0) {
            const uploadPromises = newImageFiles.map(file => {
                const fileName = `${Date.now()}-${file.name}`;
                return supabase.storage.from('property-images').upload(fileName, file);
            });

            const uploadResults = await Promise.all(uploadPromises);
            const uploadErrors = uploadResults.filter(result => result.error);
            if (uploadErrors.length > 0) {
                console.error('Errors during image upload:', uploadErrors);
                alert('Some images failed to upload.');
                setIsUploading(false);
                return;
            }

            const newImagePaths = uploadResults.map(result => result.data?.path).filter((p): p is string => !!p);
            const newPublicUrls = newImagePaths.map(path => supabase.storage.from('property-images').getPublicUrl(path).data.publicUrl);
            finalImageUrls.push(...newPublicUrls);
        }

        const { id: propertyId, created_at, ...formData } = property as (Partial<Property> & { created_at?: string });
        const finalPropertyData = {
            ...formData,
            features: featuresStr.split(',').map(f => f.trim()).filter(Boolean),
            amenities: amenitiesStr.split(',').map(a => a.trim()).filter(Boolean),
            images: finalImageUrls,
        };
        
        if (isNew) {
            const { error } = await supabase.from('properties').insert(finalPropertyData);
            if (error) {
                 console.error('Error creating property:', error);
                 alert('Failed to create property.');
                 setIsUploading(false);
                 return;
            }
        } else {
            const { error } = await supabase.from('properties').update(finalPropertyData).match({ id });
            if (error) {
                console.error('Error updating property:', error);
                alert('Failed to update property.');
                setIsUploading(false);
                return;
            }
        }
        setIsUploading(false);
        navigate('/admin/properties');
    };

    const handleGenerateDescription = async () => {
        setIsGenerating(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `Generate a compelling real estate property description for a "${property.title}". It is a ${property.type} located in ${property.location}. Key features include: ${featuresStr}. Key amenities include: ${amenitiesStr}. The property has ${property.bedrooms} bedrooms and ${property.bathrooms} bathrooms, with an area of ${property.area} sqft. It was built in ${property.year_built}. Write it in Spanish, in a professional, appealing, and enticing tone for potential buyers. Do not use markdown.`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });

            setProperty(prev => ({...prev, description: response.text}));
            clearError('description');
        } catch (error) {
            console.error("Error generating description:", error);
            alert("Failed to generate description. Check the console for details.");
        } finally {
            setIsGenerating(false);
        }
    };
    
    if (loading) {
        return <div>Cargando datos de la propiedad...</div>
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">{isNew ? 'Añadir Nueva Propiedad' : 'Editar Propiedad'}</h1>
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Título</label>
                        <input type="text" name="title" id="title" value={property.title} onChange={handleChange} className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${errors.title ? 'border-red-500' : 'border-gray-300'}`} />
                        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                    </div>
                    <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700">Ubicación</label>
                        <input type="text" name="location" id="location" value={property.location} onChange={handleChange} className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${errors.location ? 'border-red-500' : 'border-gray-300'}`} />
                        {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Precio ($)</label>
                        <input type="number" name="price" id="price" value={property.price} onChange={handleChange} className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${errors.price ? 'border-red-500' : 'border-gray-300'}`} />
                        {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
                    </div>
                    <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700">Tipo</label>
                        <select name="type" id="type" value={property.type} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                            <option value="House">Casa</option>
                            <option value="Apartment">Apartamento</option>
                            <option value="Condo">Condominio</option>
                            <option value="Villa">Villa</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">Estado</label>
                        <select name="status" id="status" value={property.status} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                            <option value="For Sale">En Venta</option>
                            <option value="For Rent">En Alquiler</option>
                            <option value="Sold">Vendido</option>
                            <option value="Rented">Alquilado</option>
                            <option value="Paused">Pausado</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                        <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700">Habitaciones</label>
                        <input type="number" name="bedrooms" id="bedrooms" value={property.bedrooms} onChange={handleChange} className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${errors.bedrooms ? 'border-red-500' : 'border-gray-300'}`} />
                        {errors.bedrooms && <p className="mt-1 text-sm text-red-600">{errors.bedrooms}</p>}
                    </div>
                    <div>
                        <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700">Baños</label>
                        <input type="number" name="bathrooms" id="bathrooms" value={property.bathrooms} onChange={handleChange} className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${errors.bathrooms ? 'border-red-500' : 'border-gray-300'}`} />
                         {errors.bathrooms && <p className="mt-1 text-sm text-red-600">{errors.bathrooms}</p>}
                    </div>
                    <div>
                        <label htmlFor="area" className="block text-sm font-medium text-gray-700">Área (sqft)</label>
                        <input type="number" name="area" id="area" value={property.area} onChange={handleChange} className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${errors.area ? 'border-red-500' : 'border-gray-300'}`} />
                        {errors.area && <p className="mt-1 text-sm text-red-600">{errors.area}</p>}
                    </div>
                    <div>
                        <label htmlFor="year_built" className="block text-sm font-medium text-gray-700">Año de Construcción</label>
                        <input type="number" name="year_built" id="year_built" value={property.year_built || ''} onChange={handleChange} className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${errors.year_built ? 'border-red-500' : 'border-gray-300'}`} />
                        {errors.year_built && <p className="mt-1 text-sm text-red-600">{errors.year_built}</p>}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Imágenes</label>
                    {errors.images && <p className="mt-1 text-sm text-red-600">{errors.images}</p>}
                    <div className={`mt-2 p-4 border-2 border-dashed rounded-lg ${errors.images ? 'border-red-500' : 'border-gray-300'}`}>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-4">
                             {imagePreviews.map((previewUrl, index) => {
                                const isExisting = property.images?.includes(previewUrl);
                                return (
                                <div key={previewUrl} className="relative group">
                                    <img src={previewUrl} alt={`Preview ${index + 1}`} className="w-full h-24 object-cover rounded-md"/>
                                    <button 
                                        type="button" 
                                        onClick={() => isExisting ? handleRemoveExistingImage(previewUrl) : handleRemoveNewImage(index)} 
                                        className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-600 rounded-full text-white p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <XCircleIcon className="h-5 w-5"/>
                                    </button>
                                </div>
                                );
                            })}
                        </div>
                        <div className="flex justify-center">
                            <label htmlFor="image-upload" className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                                <ArrowUpOnSquareIcon className="-ml-1 mr-2 h-5 w-5" />
                                Subir Imágenes
                            </label>
                            <input id="image-upload" name="image-upload" type="file" multiple accept="image/*" className="sr-only" onChange={handleFileChange} />
                        </div>
                    </div>
                </div>
                
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
                    <div className="relative">
                        <textarea name="description" id="description" value={property.description} onChange={handleChange} rows={6} className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${errors.description ? 'border-red-500' : 'border-gray-300'}`}></textarea>
                        <button type="button" onClick={handleGenerateDescription} disabled={isGenerating} className="absolute top-2 right-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300">
                           <SparklesIcon className={`-ml-0.5 mr-2 h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
                           {isGenerating ? 'Generando...' : 'Generar con IA'}
                        </button>
                    </div>
                     {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                </div>

                <div>
                    <label htmlFor="features" className="block text-sm font-medium text-gray-700">Características (separadas por coma)</label>
                    <input type="text" name="featuresStr" id="features" value={featuresStr} onChange={handleFeaturesChange} className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${errors.featuresStr ? 'border-red-500' : 'border-gray-300'}`} />
                    {errors.featuresStr && <p className="mt-1 text-sm text-red-600">{errors.featuresStr}</p>}
                </div>
                 <div>
                    <label htmlFor="amenities" className="block text-sm font-medium text-gray-700">Amenidades (separadas por coma)</label>
                    <input type="text" name="amenitiesStr" id="amenities" value={amenitiesStr} onChange={handleAmenitiesChange} className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${errors.amenitiesStr ? 'border-red-500' : 'border-gray-300'}`} />
                    {errors.amenitiesStr && <p className="mt-1 text-sm text-red-600">{errors.amenitiesStr}</p>}
                </div>

                <div className="flex justify-end space-x-4">
                    <button type="button" onClick={() => navigate('/admin/properties')} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">
                        Cancelar
                    </button>
                    <button type="submit" disabled={isUploading} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-300">
                        {isUploading ? 'Guardando...' : 'Guardar Propiedad'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminPropertyForm;
