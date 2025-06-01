import React, { Fragment } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronDown, User, Settings, LogOut } from 'lucide-react';
import { Menu, Transition } from '@headlessui/react';
import { useAuth } from '../../contexts/AuthContext';
import { useLogout } from '../../hooks/useAuth';
import { cn } from '../../utils/cn';

export const TopBar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const logout = useLogout();
  
  // Generar saludo personalizado basado en el nombre del usuario
  const getPageTitle = () => {
    if (location.pathname === '/dashboard') {
      return `Welcome back, ${user?.first_name || 'Usuario'}`;
    }
    
    const pageNames: Record<string, string> = {
      '/upload': 'Subir Archivo',
      '/reports': 'Informes',
      '/profile': 'Mi Perfil',
      '/user-info': 'Información de Usuario',
      '/settings': 'Configuración',
    };
    
    return pageNames[location.pathname] || 'IntelliReport';
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {getPageTitle()}
        </h1>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center space-x-4">
        {/* User Menu Dropdown */}
        <Menu as="div" className="relative">
          <div>
            <Menu.Button className="flex items-center space-x-3 bg-white border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100">
                <span className="text-sm font-medium text-orange-600">
                  {user?.first_name?.[0]}{user?.last_name?.[0]}
                </span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-700">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-xs text-gray-500">
                  Administrador
                </p>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </Menu.Button>
          </div>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-lg bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border border-gray-200">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.email}
                </p>
              </div>
              
              <Menu.Item>
                {({ active }) => (
                  <Link
                    to="/profile"
                    className={cn(
                      'flex items-center px-4 py-2 text-sm transition-colors',
                      active ? 'bg-gray-50 text-gray-900' : 'text-gray-700'
                    )}
                  >
                    <User className="h-4 w-4 mr-3 text-gray-400" />
                    Mi Perfil
                  </Link>
                )}
              </Menu.Item>
              
              <Menu.Item>
                {({ active }) => (
                  <Link
                    to="/user-info"
                    className={cn(
                      'flex items-center px-4 py-2 text-sm transition-colors',
                      active ? 'bg-gray-50 text-gray-900' : 'text-gray-700'
                    )}
                  >
                    <Settings className="h-4 w-4 mr-3 text-gray-400" />
                    Información de Usuario
                  </Link>
                )}
              </Menu.Item>
              
              <div className="border-t border-gray-100 my-1"></div>
              
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={handleLogout}
                    className={cn(
                      'flex w-full items-center px-4 py-2 text-sm transition-colors',
                      active ? 'bg-gray-50 text-gray-900' : 'text-gray-700'
                    )}
                  >
                    <LogOut className="h-4 w-4 mr-3 text-gray-400" />
                    Cerrar Sesión
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </header>
  );
}; 