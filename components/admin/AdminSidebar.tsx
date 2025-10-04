import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  ChartBarIcon,
  HomeModernIcon,
  UsersIcon,
  PencilSquareIcon,
  ArrowLeftOnRectangleIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/solid';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navLinks = [
    { to: '/admin/dashboard', icon: ChartBarIcon, text: 'Panel' },
    { to: '/admin/properties', icon: HomeModernIcon, text: 'Propiedades' },
    { to: '/admin/clients', icon: UsersIcon, text: 'Clientes' },
    { to: '/admin/content', icon: PencilSquareIcon, text: 'Contenido' },
  ];

  const NavItem: React.FC<{ to: string, icon: React.ElementType, text: string }> = ({ to, icon: Icon, text }) => (
    <NavLink
      to={to}
      end={to === '/admin/dashboard' || to === '/admin'}
      className={({ isActive }) =>
        `flex items-center px-4 py-2 mt-5 text-gray-100 transition-colors duration-200 transform rounded-md hover:bg-gray-700 ${
          isActive ? 'bg-gray-700' : ''
        }`
      }
    >
      <Icon className="w-5 h-5" />
      <span className="mx-4 font-medium">{text}</span>
    </NavLink>
  );

  return (
    <div className="flex flex-col w-64 h-screen px-4 py-8 bg-gray-800 text-white">
      <Link to="/admin" className="text-2xl font-bold text-white">Panel de Admin</Link>
      
      <div className="flex flex-col justify-between flex-1 mt-6">
        <nav>
          {navLinks.map(link => (
            <NavItem key={link.to} {...link} />
          ))}
        </nav>
        
        <div>
           <Link to="/home" className="flex items-center px-4 py-2 mt-5 text-gray-100 transition-colors duration-200 transform rounded-md hover:bg-ray-700">
                <Cog6ToothIcon className="w-5 h-5" />
                <span className="mx-4 font-medium">Volver al Sitio</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 mt-5 text-gray-100 transition-colors duration-200 transform rounded-md hover:bg-gray-700"
            >
              <ArrowLeftOnRectangleIcon className="w-5 h-5" />
              <span className="mx-4 font-medium">Cerrar Sesión</span>
            </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;