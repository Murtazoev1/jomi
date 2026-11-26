import { Home, BarChart2, Calendar, FileText, BookOpen, Newspaper, MessageSquare, LogOut, ChevronLeft, ChevronRight, Users, BookMarked, Zap, Activity, Sparkles, Shield } from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  userName: string;
  userRole: 'student' | 'teacher' | 'admin';
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

  const adminNav = [
    { id: 'admin-news',     label: 'Новости',     icon: Newspaper },
    { id: 'admin-schedule', label: 'Расписание',  icon: Calendar },
    { id: 'admin-users',    label: 'Пользователи',icon: Users },
    { id: 'admin-theme',    label: 'Тема',        icon: Sparkles },
  ];

  const navItems = userRole === 'student' ? studentNav : userRole === 'teacher' ? teacherNav : adminNav;

  const initials = userName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div style={{
      width: isCollapsed ? '64px' : '220px',
      background: 'linear-gradient(180deg, #0A0A2E 0%, #0D1B6E 50%, #0F2FA8 100%)',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
      flexShrink: 0,
      position: 'relative',
      borderRight: '1px solid rgba(255,255,255,0.08)',
    }}>
      {/* Logo */}
      <div style={{
        padding: isCollapsed ? '18px 0' : '18px 16px 10px',
        display: 'flex', alignItems: 'center', gap: '10px',
        justifyContent: isCollapsed ? 'center' : 'flex-start',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        marginBottom: '8px',
      }}>
        <BubbleCircles size={isCollapsed ? 32 : 28} />
        {!isCollapsed && (
          <span style={{ fontFamily: 'Scripter, cursive', fontSize: '26px', color: 'white', letterSpacing: '2px', lineHeight: 1 }}>
            JOMI
          </span>
        )}
      </div>

      {/* Profile — only when expanded */}
      {!isCollapsed && (
        <div style={{ padding: '10px 16px 14px', marginBottom: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'rgba(255,255,255,0.15)',
              border: '1.5px solid rgba(255,255,255,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 'bold', fontSize: '13px', flexShrink: 0,
            }}>
              {initials}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ color: 'white', fontWeight: '600', fontSize: '12px', lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userName}</div>
              <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '11px', marginTop: '1px' }}>
                {subtitle ?? (userRole === 'teacher' ? 'Учитель' : userRole === 'admin' ? '⚙️ Администратор' : 'Ученик 8-Г')}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav style={{ flex: 1, padding: '0 6px', overflowY: 'auto' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              title={isCollapsed ? item.label : ''}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: isCollapsed ? '11px 0' : '10px 12px',
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
                marginBottom: '2px',
                background: active ? 'rgba(255,255,255,0.18)' : 'transparent',
                color: active ? 'white' : 'rgba(255,255,255,0.75)',
                transition: 'all 0.15s',
                fontSize: '13px',
                fontWeight: active ? 600 : 400,
                letterSpacing: '0.01em',
              }}
              onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)'; }}
              onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              <Icon size={17} style={{ flexShrink: 0 }} />
              {!isCollapsed && <span>{item.label}</span>}
              {active && !isCollapsed && (
                <div style={{ marginLeft: 'auto', width: 4, height: 4, borderRadius: '50%', background: '#38B6FF' }} />
              )}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: '6px 6px 16px' }}>
        <button
          onClick={onLogout}
          title={isCollapsed ? 'Выйти' : ''}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
            padding: isCollapsed ? '11px 0' : '10px 12px',
            justifyContent: isCollapsed ? 'center' : 'flex-start',
            borderRadius: '10px', border: 'none', cursor: 'pointer',
            background: 'transparent', color: 'rgba(255,255,255,0.5)',
            fontSize: '13px', transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,80,80,0.15)'; (e.currentTarget as HTMLElement).style.color = '#ff9999'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)'; }}
        >
          <LogOut size={17} style={{ flexShrink: 0 }} />
          {!isCollapsed && <span>Выйти</span>}
        </button>
      </div>

      {/* Toggle collapse */}
      <button
        onClick={onToggleCollapse}
        style={{
          position: 'absolute', top: '50%', right: '-13px',
          transform: 'translateY(-50%)',
          width: 26, height: 26, borderRadius: '50%',
          background: '#1E4FD8', border: '2px solid white',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: 'white', zIndex: 10,
          boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
        }}
      >
        {isCollapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
      </button>
    </div>
  );
}
