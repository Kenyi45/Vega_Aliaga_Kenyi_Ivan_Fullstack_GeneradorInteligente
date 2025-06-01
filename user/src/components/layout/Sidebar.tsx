import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    BarChart3,
    Upload,
    FileText,
    ChevronRight,
    ChevronLeft,
} from 'lucide-react';
import { cn } from '../../utils/cn';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'Procesar Archivos', href: '/upload', icon: Upload },
    { name: 'Reportes', href: '/reports', icon: FileText },
];

interface SidebarProps {
    isExpanded: boolean;
    setIsExpanded: (expanded: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isExpanded, setIsExpanded }) => {
    const location = useLocation();

    return (
        <div className={cn(
            'flex h-screen flex-col bg-white shadow-lg border-r border-gray-200 transition-all duration-300 ease-in-out relative',
            isExpanded ? 'w-64' : 'w-16'
        )}>
            {/* Logo Header */}
            <div className="flex h-16 items-center px-4 border-b border-gray-200">
                <Link to="/dashboard" className="flex items-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                        <BarChart3 className="h-5 w-5 text-white" />
                    </div>
                    {isExpanded && (
                        <span className="ml-3 text-xl font-bold text-gray-900 whitespace-nowrap">
                            IntelliReport
                        </span>
                    )}
                </Link>
            </div>

            {/* Toggle Button - Positioned absolutely */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="absolute -right-3 top-6 z-50 flex h-6 w-6 items-center justify-center rounded-full bg-white border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-md"
            >
                {isExpanded ? (
                    <ChevronLeft className="h-3 w-3 text-gray-600" />
                ) : (
                    <ChevronRight className="h-3 w-3 text-gray-600" />
                )}
            </button>

            {/* Navigation */}
            <nav className="flex-1 px-2 py-6 space-y-2">
                {navigation.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.href;
                    
                    return (
                        <div key={item.name} className="relative group">
                            <Link
                                to={item.href}
                                className={cn(
                                    'flex items-center rounded-lg transition-all duration-200',
                                    isExpanded ? 'px-4 py-3' : 'px-3 py-3 justify-center',
                                    isActive
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                )}
                            >
                                <Icon className={cn(
                                    'h-5 w-5 transition-colors duration-200',
                                    isActive ? 'text-blue-600' : 'text-gray-400',
                                    isExpanded ? 'mr-3' : ''
                                )} />
                                
                                {isExpanded && (
                                    <span className="text-sm font-medium whitespace-nowrap">
                                        {item.name}
                                    </span>
                                )}
                                
                                {/* Active indicator for collapsed state */}
                                {!isExpanded && isActive && (
                                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-blue-600 rounded-l-full"></div>
                                )}
                            </Link>
                            
                            {/* Tooltip for collapsed state */}
                            {!isExpanded && (
                                <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-40">
                                    {item.name}
                                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 border-4 border-transparent border-r-gray-900"></div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>
        </div>
    );
}; 