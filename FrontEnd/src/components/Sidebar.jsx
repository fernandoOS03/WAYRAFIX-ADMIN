import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutList, 
  History, 
  Truck, 
  Settings, 
  Users, 
  DollarSign, 
  Zap,
  ChevronDown
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const navGroups = [
    {
      title: 'Tools',
      items: [
        { name: 'Solicitudes', path: '/', icon: LayoutList },
        { name: 'Finanzas', path: '/finanzas', icon: DollarSign },
        { name: 'Historial', path: '/historial', icon: History },
      ]
    },
    {
      title: 'Admin',
      items: [
        { name: 'Clientes', path: '/clientes', icon: Users },
        { name: 'Grúas / Flotas', path: '/flotas', icon: Truck },
        { name: 'Configuración', path: '/configuracion', icon: Settings },
      ]
    }
  ];

  return (
    <div
      style={{
        width: '240px',
        background: '#fff',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid var(--color-border)',
        zIndex: 50,
        padding: '1rem 0'
      }}
    >
      {/* User / Org Selector */}
      <div style={{ padding: '0 1rem 1.5rem', borderBottom: '1px solid var(--color-border)', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ 
              width: '24px', height: '24px', borderRadius: '4px', 
              background: 'var(--color-primary)', display: 'flex', 
              alignItems: 'center', justifyContent: 'center' 
            }}>
              <Zap size={14} color="#fff" />
            </div>
            <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>WayraFix Admin</span>
          </div>
          <ChevronDown size={14} color="var(--color-text-muted)" />
        </div>
      </div>

      {/* Nav Groups */}
      <div style={{ flex: 1, padding: '0 0.75rem', overflowY: 'auto' }}>
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} style={{ marginBottom: '1.5rem' }}>
            <p style={{ 
              fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)', 
              textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0 0.75rem', marginBottom: '0.5rem' 
            }}>
              {group.title}
            </p>
            {group.items.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`sidebar-link ${isActive ? 'active' : ''}`}
                  style={{ marginBottom: '2px' }}
                >
                  <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                  <span style={{ fontSize: '13px' }}>{item.name}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Help & Resources Section (Like Mapbox) */}
      <div style={{ padding: '0 0.75rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
        <p style={{ 
          fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)', 
          textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0 0.75rem', marginBottom: '0.5rem' 
        }}>
          Ayuda y Soporte
        </p>
        <Link to="#" className="sidebar-link"><span style={{ fontSize: '13px' }}>Documentación</span></Link>
        <Link to="#" className="sidebar-link"><span style={{ fontSize: '13px' }}>Soporte Técnico</span></Link>
      </div>
    </div>
  );
};

export default Sidebar;
