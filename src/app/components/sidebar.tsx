import { Home, BarChart2, Calendar, FileText, BookOpen, Newspaper, MessageSquare, LogOut, ChevronLeft, ChevronRight, Users, BookMarked, Zap, Activity, Sparkles } from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  userName: string;
  userRole: 'student' | 'teacher';
  subtitle?: string;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

function BubbleCircles({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="207 169 665 640" xmlns="http://www.w3.org/2000/svg" style={{ overflow: 'visible', flexShrink: 0 }}>
      <circle cx="529" cy="341" r="171" fill="#4F6FFF"/>
      <circle cx="377" cy="496" r="170" fill="#004BAD"/>
      <circle cx="527" cy="637" r="171" fill="#1A00A8"/>
      <circle cx="700" cy="497" r="171" fill="#38B6FF"/>
    </svg>
  );
}

export function Sidebar({ currentPage, onNavigate, onLogout, userName, userRole, subtitle, isCollapsed, onToggleCollapse }: SidebarProps) {
  const studentNav = [
    { id: 'dashboard', label: 'Главная',    icon: Home },
    { id: 'grades',    label: 'Оценки',     icon: BarChart2 },
    { id: 'schedule',  label: 'Расписание', icon: Calendar },
    { id: 'homework',  label: 'Домашка',    icon: FileText },
    { id: 'library',   label: 'Библиотека', icon: BookOpen },
    { id: 'news',      label: 'Новости',    icon: Newspaper },
    { id: 'chat',      label: 'Чат',        icon: MessageSquare },
    { id: 'ai',        label: 'JOMI AI',    icon: Sparkles },
  ];

  const teacherNav = [
    { id: 'dashboard', label: 'Главная',    icon: Home },
    { id: 'classes',   label: 'Классы',     icon: Users },
    { id: 'journal',   label: 'Журнал',     icon: BookMarked },
    { id: 'actions',   label: 'Действия',   icon: Zap },
    { id: 'activity',  label: 'Активность', icon: Activity },
    { id: 'chat',      label: 'Чат',        icon: MessageSquare },
  ];

  const navItems = userRole === 'student' ? studentNav : teacherNav;

  return (
    <div
      style={{
        width: isCollapsed ? '72px' : '240px',
        background: 'linear-gradient(180deg, #0f0c29 0%, #1A1A7E 50%, #1E4FD8 100%)',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
        flexShrink: 0,
        position: 'relative',
      }}
    >
      {/* Logo */}
      <div style={{ padding: isCollapsed ? '20px 0' : '20px 20px 10px', display: 'flex', alignItems: 'center', gap: '10px', justifyContent: isCollapsed ? 'center' : 'flex-start' }}>
        <BubbleCircles size={isCollapsed ? 36 : 32} />
        {!isCollapsed && (
          <span style={{ fontFamily: 'Scripter, cursive', fontSize: '28px', color: 'white', letterSpacing: '2px', lineHeight: 1 }}>
            JOMI
          </span>
        )}
      </div>

      {/* Profile */}
      {!isCollapsed && (
        <div style={{ padding: '12px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '8px' }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '16px', marginBottom: '8px' }}>
            {userName.charAt(0)}
          </div>
          <div style={{ color: 'white', fontWeight: '600', fontSize: '13px', lineHeight: 1.3 }}>{userName}</div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px', marginTop: '2px' }}>
            {subtitle ?? (userRole === 'teacher' ? 'Учитель' : 'Ученик 8-Г')}
          </div>
        </div>
      )}

      {/* Nav */}
      <nav style={{ flex: 1, padding: '8px 8px', overflowY: 'auto' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: isCollapsed ? '12px 0' : '11px 14px',
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                marginBottom: '2px',
                background: active ? 'rgba(255,255,255,0.18)' : 'transparent',
                color: active ? 'white' : 'rgba(255,255,255,0.65)',
                transition: 'all 0.2s',
                fontSize: '14px',
                fontWeight: active ? 600 : 400,
              }}
              onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'; }}
              onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              title={isCollapsed ? item.label : ''}
            >
              <Icon size={18} style={{ flexShrink: 0 }} />
              {!isCollapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: '8px 8px 16px' }}>
        <button
          onClick={onLogout}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
            padding: isCollapsed ? '12px 0' : '11px 14px',
            justifyContent: isCollapsed ? 'center' : 'flex-start',
            borderRadius: '12px', border: 'none', cursor: 'pointer',
            background: 'transparent', color: 'rgba(255,255,255,0.5)',
            fontSize: '14px', transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,100,100,0.15)'; (e.currentTarget as HTMLElement).style.color = '#ff8080'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)'; }}
          title={isCollapsed ? 'Выйти' : ''}
        >
          <LogOut size={18} style={{ flexShrink: 0 }} />
          {!isCollapsed && <span>Выйти</span>}
        </button>
      </div>

      {/* Toggle collapse button */}
      <button
        onClick={onToggleCollapse}
        style={{
          position: 'absolute', top: '50%', right: '-14px',
          transform: 'translateY(-50%)',
          width: 28, height: 28, borderRadius: '50%',
          background: '#1E4FD8', border: '2px solid white',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: 'white', zIndex: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        }}
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </div>
  );
}
