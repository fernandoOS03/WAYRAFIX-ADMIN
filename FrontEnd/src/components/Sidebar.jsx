import { Link, useLocation } from 'react-router-dom';
import { LayoutList, History, Truck, Settings, Users, DollarSign } from 'lucide-react';
import clsx from 'clsx';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Solicitudes', path: '/', icon: LayoutList, hasNotification: true },
    { name: 'Finanzas', path: '/finanzas', icon: DollarSign },
    { name: 'Historial', path: '/historial', icon: History },
    { name: 'Clientes', path: '/clientes', icon: Users },
    { name: 'Grúas / Flotas', path: '/flotas', icon: Truck },
    { name: 'Configuración', path: '/configuracion', icon: Settings },
  ];

  return (
    <div className="w-64 bg-white h-screen fixed left-0 top-0 border-r border-gray-100 flex flex-col shadow-soft z-50">
      <div className="p-8 flex items-center justify-center">
        <h1 className="font-extrabold text-accent-dark tracking-widest text-xl uppercase">Wayrafix</h1>
      </div>

      <nav className="flex-1 px-4 mt-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={clsx(
                'flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 group font-bold text-sm',
                isActive 
                  ? 'bg-gray-50 text-accent-dark/90 shadow-sm border border-gray-100/50' 
                  : 'text-gray-400 hover:bg-gray-50/50 hover:text-gray-600'
              )}
            >
              <div className="flex items-center gap-3">
                <Icon size={18} className={clsx(isActive ? 'text-accent-dark/80' : 'text-gray-400 group-hover:text-gray-500')} />
                {item.name}
              </div>
              {item.hasNotification && (
                <span className="w-2 h-2 rounded-full bg-red-500 shadow-sm shadow-red-200"></span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
