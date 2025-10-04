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
        yearBuilt: new Date().getFullYear(),
    });

    const [featuresStr, setFeaturesStr] = useState('');
    const [amenitiesStr, setAmenitiesStr] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [loading, setLoading] = useState(!isNew);
    const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);

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
            }
            setLoading(false);
        };
        
        fetchProperty();
    }, [id, isNew, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProperty(prev => ({ ...prev, [name]: name === 'price' || name === 'bedrooms' || name === 'bathrooms' || name === 'area' || name === 'yearBuilt' ? Number(value) : value }));
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setNewImageFiles(prev => [...prev, ...filesArray]);

            const previewsArray = filesArray.map(file => URL.createObjectURL(file));
            setImagePreviews(prev => [...prev, ...previewsArray]);
        }
    };

    const handleRemoveNewImage = (index: number) => {
        setNewImageFiles(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => {
            const newPreviews = prev.filter((_, i) => i !== index);
            URL.revokeObjectURL(prev[index]); // Clean up blob URL
            return newPreviews;
        });
    };

    const handleRemoveExistingImage = (imageUrl: string) => {
        setProperty(prev => ({
            ...prev,
            images: prev.images?.filter(img => img !== imageUrl)
        }));
        setImagesToDelete(prev => [...prev, imageUrl]);
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
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
                const fileName = `public/${Date.now()}-${file.name}`;
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
            year_built: property.yearBuilt,
            images: finalImageUrls,
        };
        delete (finalPropertyData as any).yearBuilt;

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
            const prompt = `Generate a compelling real estate property description for a "${property.title}". It is a ${property.type} located in ${property.location}. Key features include: ${featuresStr}. Key amenities include: ${amenitiesStr}. The property has ${property.bedrooms} bedrooms and ${property.bathrooms} bathrooms, with an area of ${property.area} sqft. It was built in ${property.yearBuilt}. Write it in Spanish, in a professional, appealing, and enticing tone for potential buyers. Do not use markdown.`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });

            setProperty(prev => ({...prev, description: response.text}));
        } catch (error) {
            console.error("Error generating description:", error);
            alert("Failed to generate description. Check the console for details.");
        } finally {
            setIsGenerating(false);
        }
    };
    
    if (loading) {
        return <div>Loading property data...</div>
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">{isNew ? 'Add New Property' : 'Edit Property'}</h1>
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                        <input type="text" name="title" id="title" value={property.title} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                        <input type="text" name="location" id="location" value={property.location} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price ($)</label>
                        <input type="number" name="price" id="price" value={property.price} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
                        <select name="type" id="type" value={property.type} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                            <option>House</option>
                            <option>Apartment</option>
                            <option>Condo</option>
                            <option>Villa</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                        <select name="status" id="status" value={property.status} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                            <option>For Sale</option>
                            <option>For Rent</option>
                            <option>Sold</option>
                            <option>Rented</option>
                            <option>Paused</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                        <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700">Bedrooms</label>
                        <input type="number" name="bedrooms" id="bedrooms" value={property.bedrooms} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                        <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700">Bathrooms</label>
                        <input type="number" name="bathrooms" id="bathrooms" value={property.bathrooms} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                        <label htmlFor="area" className="block text-sm font-medium text-gray-700">Area (sqft)</label>
                        <input type="number" name="area" id="area" value={property.area} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                        <label htmlFor="yearBuilt" className="block text-sm font-medium text-gray-700">Year Built</label>
                        <input type="number" name="yearBuilt" id="yearBuilt" value={property.yearBuilt} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Images</label>
                    <div className="mt-2 p-4 border-2 border-dashed border-gray-300 rounded-lg">
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-4">
                            {property.images?.map((imageUrl, index) => (
                                <div key={`existing-${index}`} className="relative group">
                                    <img src={imageUrl} alt={`Property image ${index + 1}`} className="w-full h-24 object-cover rounded-md"/>
                                    <button type="button" onClick={() => handleRemoveExistingImage(imageUrl)} className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-600 rounded-full text-white p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <XCircleIcon className="h-5 w-5"/>
                                    </button>
                                </div>
                            ))}
                            {imagePreviews.map((previewUrl, index) => (
                                <div key={`new-${index}`} className="relative group">
                                    <img src={previewUrl} alt={`New image preview ${index + 1}`} className="w-full h-24 object-cover rounded-md"/>
                                    <button type="button" onClick={() => handleRemoveNewImage(index)} className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-600 rounded-full text-white p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <XCircleIcon className="h-5 w-5"/>
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-center">
                            <label htmlFor="image-upload" className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                                <ArrowUpOnSquareIcon className="-ml-1 mr-2 h-5 w-5" />
                                Upload Images
                            </label>
                            <input id="image-upload" name="image-upload" type="file" multiple accept="image/*" className="sr-only" onChange={handleFileChange} />
                        </div>
                    </div>
                </div>
                
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <div className="relative">
                        <textarea name="description" id="description" value={property.description} onChange={handleChange} rows={6} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
                        <button type="button" onClick={handleGenerateDescription} disabled={isGenerating} className="absolute top-2 right-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300">
                           <SparklesIcon className={`-ml-0.5 mr-2 h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
                           {isGenerating ? 'Generating...' : 'Generate with AI'}
                        </button>
                    </div>
                </div>

                <div>
                    <label htmlFor="features" className="block text-sm font-medium text-gray-700">Features (comma separated)</label>
                    <input type="text" name="features" id="features" value={featuresStr} onChange={(e) => setFeaturesStr(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                </div>
                 <div>
                    <label htmlFor="amenities" className="block text-sm font-medium text-gray-700">Amenities (comma separated)</label>
                    <input type="text" name="amenities" id="amenities" value={amenitiesStr} onChange={(e) => setAmenitiesStr(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                </div>

                <div className="flex justify-end space-x-4">
                    <button type="button" onClick={() => navigate('/admin/properties')} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">
                        Cancel
                    </button>
                    <button type="submit" disabled={isUploading} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-300">
                        {isUploading ? 'Saving...' : 'Save Property'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminPropertyForm;