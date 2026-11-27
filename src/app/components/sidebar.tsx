import { useState, useEffect } from 'react';
import { Home, BarChart2, Calendar, FileText, BookOpen, Newspaper, MessageSquare, LogOut, ChevronLeft, ChevronRight, Users, BookMarked, Zap, Activity, Sparkles } from 'lucide-react';
import { getTheme, type Theme } from '../data/theme';

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

function BubbleCircles({ size = 36, theme, spinning = false }: { size?: number; theme: Theme; spinning?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="207 169 665 640"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        overflow: 'visible', flexShrink: 0,
        transition: 'transform 0.6s cubic-bezier(0.4,0,0.2,1)',
        transform: spinning ? 'rotate(360deg)' : 'rotate(0deg)',
      }}>
      <circle cx="529" cy="341" r="171" fill={theme.c1}/>
      <circle cx="377" cy="496" r="170" fill={theme.c2}/>
      <circle cx="527" cy="637" r="171" fill={theme.c3}/>
      <circle cx="700" cy="497" r="171" fill={theme.c4}/>
    </svg>
  );
}

export function Sidebar({ currentPage, onNavigate, onLogout, userName, userRole, subtitle, isCollapsed, onToggleCollapse }: SidebarProps) {
  const [theme, setThemeState] = useState(getTheme);
  const [spinning, setSpinning] = useState(false);
  const [prevCollapsed, setPrevCollapsed] = useState(isCollapsed);

  useEffect(() => {
    const handler = () => setThemeState(getTheme());
    window.addEventListener('jomi-theme-change', handler);
    return () => window.removeEventListener('jomi-theme-change', handler);
  }, []);

  // Spin logo when collapse state changes
  useEffect(() => {
    if (prevCollapsed !== isCollapsed) {
      setSpinning(true);
      setTimeout(() => setSpinning(false), 650);
      setPrevCollapsed(isCollapsed);
    }
  }, [isCollapsed, prevCollapsed]);

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
    { id: 'ai-teacher',label: 'ИИ Учителя', icon: Sparkles },
    { id: 'activity',  label: 'Активность', icon: Activity },
    { id: 'chat',      label: 'Чат',        icon: MessageSquare },
  ];
  const adminNav = [
    { id: 'admin-news',     label: 'Новости',     icon: Newspaper },
    { id: 'admin-schedule', label: 'Расписание',  icon: Calendar },
    { id: 'admin-theme',    label: 'Тема',        icon: Sparkles },
    { id: 'admin-apikey',   label: 'API ключ',    icon: Zap },
  ];

  const navItems = userRole === 'student' ? studentNav : userRole === 'teacher' ? teacherNav : adminNav;
  const initials = userName.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();

  return (
    <div style={{
      width: isCollapsed ? '64px' : '220px',
      background: `linear-gradient(180deg, ${theme.sidebarFrom} 0%, ${theme.sidebarTo} 100%)`,
      height: '100vh', display: 'flex', flexDirection: 'column',
      transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
      flexShrink: 0, position: 'relative',
      borderRight: '1px solid rgba(255,255,255,0.08)',
    }}>
      {/* Logo */}
      <div style={{
        padding: isCollapsed ? '18px 0' : '18px 16px 10px',
        display: 'flex', alignItems: 'center', gap: '10px',
        justifyContent: isCollapsed ? 'center' : 'flex-start',
        borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: '8px',
        cursor: 'pointer',
      }} onClick={() => { setSpinning(true); setTimeout(()=>setSpinning(false),650); }}>
        <BubbleCircles size={isCollapsed ? 32 : 28} theme={theme} spinning={spinning}/>
        {!isCollapsed && (
          <span style={{ fontFamily:'Scripter, cursive', fontSize:'26px', color:'white', letterSpacing:'2px', lineHeight:1 }}>
            JOMI
          </span>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex:1, padding:'0 6px', overflowY:'auto' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = currentPage === item.id;
          return (
            <button key={item.id} onClick={() => onNavigate(item.id)} title={isCollapsed ? item.label : ''}
              style={{
                width:'100%', display:'flex', alignItems:'center', gap:'10px',
                padding: isCollapsed ? '11px 0' : '10px 12px',
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                borderRadius:'10px', border:'none', cursor:'pointer', marginBottom:'2px',
                background: active ? theme.navActive : 'transparent',
                color: active ? 'white' : 'rgba(255,255,255,0.75)',
                transition:'all 0.15s', fontSize:'13px', fontWeight: active ? 600 : 400,
                transform: 'scale(1)',
              }}
              onMouseEnter={e=>{
                (e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.12)';
                (e.currentTarget as HTMLElement).style.transform='scale(1.04)';
                (e.currentTarget as HTMLElement).style.color='white';
              }}
              onMouseLeave={e=>{
                (e.currentTarget as HTMLElement).style.background=active?theme.navActive:'transparent';
                (e.currentTarget as HTMLElement).style.transform='scale(1)';
                (e.currentTarget as HTMLElement).style.color=active?'white':'rgba(255,255,255,0.75)';
              }}
            >
              <Icon size={17} style={{ flexShrink:0 }}/>
              {!isCollapsed && <span>{item.label}</span>}
              {active && !isCollapsed && <div style={{ marginLeft:'auto', width:4, height:4, borderRadius:'50%', background:theme.c4 }}/>}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding:'6px 6px 16px' }}>
        <button onClick={onLogout} title={isCollapsed?'Выйти':''} style={{
          width:'100%', display:'flex', alignItems:'center', gap:'10px',
          padding: isCollapsed?'11px 0':'10px 12px',
          justifyContent: isCollapsed?'center':'flex-start',
          borderRadius:'10px', border:'none', cursor:'pointer',
          background:'transparent', color:'rgba(255,255,255,0.5)',
          fontSize:'13px', transition:'all 0.15s',
        }}
          onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background='rgba(255,80,80,0.15)';(e.currentTarget as HTMLElement).style.color='#ff9999';}}
          onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background='transparent';(e.currentTarget as HTMLElement).style.color='rgba(255,255,255,0.5)';}}>
          <LogOut size={17} style={{flexShrink:0}}/>
          {!isCollapsed && <span>Выйти</span>}
        </button>
      </div>

      {/* Toggle collapse */}
      <button onClick={onToggleCollapse} style={{
        position:'absolute', top:'50%', right:'-13px',
        transform:'translateY(-50%)',
        width:26, height:26, borderRadius:'50%',
        background: theme.primary, border:'2px solid white',
        display:'flex', alignItems:'center', justifyContent:'center',
        cursor:'pointer', color:'white', zIndex:10,
        boxShadow:'0 2px 8px rgba(0,0,0,0.4)', transition:'background 0.3s',
      }}>
        {isCollapsed ? <ChevronRight size={13}/> : <ChevronLeft size={13}/>}
      </button>
    </div>
  );
}
