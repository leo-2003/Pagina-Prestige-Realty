import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    
  interface SocialIconProps {
    href: string;
    children: React.ReactNode;
  }

  const SocialIcon = ({ href, children }: SocialIconProps) => (
    <a href={href} className="text-gray-400 hover:text-blue-500 transition-colors duration-300">
        {children}
    </a>
  );

  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold mb-4">Prestige Realty</h3>
            <p className="text-gray-400 text-sm">
              Your trusted partner in finding the perfect property. We are dedicated to providing exceptional service and expertise in the real estate market.
            </p>
            <div className="flex space-x-4 mt-6">
                 <SocialIcon href="#">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
                 </SocialIcon>
                 <SocialIcon href="#">
                     <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                 </SocialIcon>
                 <SocialIcon href="#">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.012-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218 1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.345 2.525c.636-.247 1.363-.416 2.427-.465C9.795 2.013 10.148 2 12.315 2zm-1.161 2.065a8.536 8.536 0 00-3.57 2.14A8.536 8.536 0 004.065 9.75c-.21.986-.344 2.052-.364 3.195.02.996.14 2.008.342 2.957.294 1.364.846 2.535 1.838 3.527a8.536 8.536 0 003.527 1.838c.95.201 1.96.322 2.957.342.943.02 2.01-.114 3.195-.364a8.536 8.536 0 003.57-2.14 8.536 8.536 0 002.14-3.57c.21-.986.344-2.052.364-3.195-.02-.996-.14-2.008-.342-2.957-.294-1.364-.846-2.535-1.838-3.527a8.536 8.536 0 00-3.527-1.838c-.95-.201-1.96-.322-2.957-.342-.943-.02-2.01.114-3.195.364zm0 2.58a4.846 4.846 0 100 9.692 4.846 4.846 0 000-9.692zm-2.836 4.846a2.836 2.836 0 115.672 0 2.836 2.836 0 01-5.672 0z" clipRule="evenodd" /></svg>
                 </SocialIcon>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/properties" className="text-gray-400 hover:text-white text-sm">Propiedades</Link></li>
              <li><Link to="/services" className="text-gray-400 hover:text-white text-sm">Servicios</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-white text-sm">Sobre Nosotros</Link></li>
              <li><Link to="/blog" className="text-gray-400 hover:text-white text-sm">Blog</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white text-sm">Contacto</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="flex items-start">
                <span className="mt-1 mr-3 shrink-0">&#x1F4CD;</span>
                123 Prestige Lane, Real Estate City, 12345
              </li>
              <li className="flex items-center">
                <span className="mr-3 shrink-0">&#x2709;</span>
                <a href="mailto:contact@prestigerealty.com" className="hover:text-white">contact@prestigerealty.com</a>
              </li>
              <li className="flex items-center">
                <span className="mr-3 shrink-0">&#x1F4DE;</span>
                <a href="tel:123-456-7890" className="hover:text-white">123-456-7890</a>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to our newsletter for the latest property listings and market news.
            </p>
            <form>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="w-full px-3 py-2 text-gray-800 rounded-l-md focus:outline-none"
                />
                <button 
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-r-md font-semibold transition-colors"
                >
                  Go
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <div className="mt-12 border-t border-gray-700 pt-6 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Prestige Realty. All rights reserved.
          </p>
           <div className="flex space-x-4 mt-4 sm:mt-0 text-sm">
                <a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-white">Terms & Conditions</a>
                <Link to="/admin/login" className="text-gray-400 hover:text-white">Admin Login</Link>
           </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;