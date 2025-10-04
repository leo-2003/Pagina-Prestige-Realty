
import React from 'react';
import { BLOG_POSTS } from '../constants';
import { Link } from 'react-router-dom';
import { TagIcon, CalendarIcon, UserIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const BlogPostCard: React.FC<{ post: typeof BLOG_POSTS[0] }> = ({ post }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden group">
        <Link to={`/blog/${post.id}`} className="block">
            <img className="w-full h-56 object-cover transform group-hover:scale-105 transition-transform duration-300" src={post.imageUrl} alt={post.title} />
        </Link>
        <div className="p-6">
            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                <div className="flex items-center"><UserIcon className="h-4 w-4 mr-1"/><span>{post.author}</span></div>
                <span>&bull;</span>
                <div className="flex items-center"><CalendarIcon className="h-4 w-4 mr-1"/><span>{post.date}</span></div>
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors">
                 <Link to={`/blog/${post.id}`}>{post.title}</Link>
            </h3>
            <p className="text-gray-600 mb-4">{post.excerpt}</p>
            <div className="flex justify-between items-center">
                <Link to={`/blog/${post.id}`} className="font-semibold text-blue-600 hover:text-blue-800">Leer más &rarr;</Link>
                <span className="flex items-center bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    <TagIcon className="h-3 w-3 mr-1"/>
                    {post.category}
                </span>
            </div>
        </div>
    </div>
);

const BlogSidebar: React.FC = () => {
    const categories = ['Buying', 'Selling', 'Finance', 'Lifestyle', 'Market News'];
    const recentPosts = BLOG_POSTS.slice(0, 3);

    return (
        <aside className="space-y-8">
            {/* Search */}
            <div>
                <h3 className="text-xl font-bold mb-4">Buscar</h3>
                <div className="relative">
                    <input type="text" placeholder="Buscar en el blog..." className="w-full p-3 border border-gray-300 rounded-md pr-10"/>
                    <MagnifyingGlassIcon className="h-5 w-5 absolute top-3.5 right-3.5 text-gray-400"/>
                </div>
            </div>

            {/* Categories */}
            <div>
                <h3 className="text-xl font-bold mb-4">Categorías</h3>
                <ul className="space-y-2">
                    {categories.map(cat => (
                        <li key={cat}>
                            <a href="#" className="text-gray-600 hover:text-blue-600 flex justify-between items-center">
                                <span>{cat}</span>
                                <span className="text-xs font-semibold text-gray-400">&gt;</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Recent Posts */}
             <div>
                <h3 className="text-xl font-bold mb-4">Publicaciones Recientes</h3>
                <ul className="space-y-4">
                    {recentPosts.map(post => (
                        <li key={post.id} className="flex items-start space-x-3">
                            <img src={post.imageUrl} alt={post.title} className="w-16 h-16 object-cover rounded-md"/>
                            <div>
                                <Link to={`/blog/${post.id}`} className="font-semibold text-gray-800 hover:text-blue-600 text-sm leading-tight block">{post.title}</Link>
                                <p className="text-xs text-gray-500 mt-1">{post.date}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
};


const BlogPage: React.FC = () => {
  return (
    <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-gray-900">Blog de Bienes Raíces</h1>
                <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                    Perspectivas de expertos, consejos y las últimas tendencias en el mercado inmobiliario.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Blog Posts */}
                <div className="lg:col-span-2 space-y-8">
                    {BLOG_POSTS.map(post => (
                        <BlogPostCard key={post.id} post={post} />
                    ))}
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 bg-white p-6 rounded-lg shadow-md">
                        <BlogSidebar />
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default BlogPage;
