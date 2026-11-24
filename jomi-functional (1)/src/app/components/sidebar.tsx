import { Home, BookOpen, Calendar, FileText, Library, MessageSquare, BarChart3, ChevronLeft, ChevronRight, Newspaper, User, LogOut, Users, ClipboardCheck, Zap, TrendingUp } from 'lucide-react';

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

export function Sidebar({ currentPage, onNavigate, onLogout, userName, userRole, subtitle, isCollapsed, onToggleCollapse }: SidebarProps) {
  const studentMenuItems = [
    { id: 'dashboard', label: 'Главная', icon: Home },
    { id: 'grades', label: 'Оценки', icon: BarChart3 },
    { id: 'schedule', label: 'Расписание', icon: Calendar },
    { id: 'homework', label: 'Домашние задания', icon: FileText },
    { id: 'library', label: 'Библиотека', icon: Library },
    { id: 'news', label: 'Новости', icon: Newspaper },
    { id: 'chat', label: 'Чаты', icon: MessageSquare },
  ];

  const teacherMenuItems = [
    { id: 'dashboard', label: 'Главная', icon: Home },
    { id: 'classes', label: 'Мои классы', icon: Users },
    { id: 'journal', label: 'Журнал', icon: BookOpen },
    { id: 'actions', label: 'Действия', icon: Zap },
    { id: 'activity', label: 'Аналитика', icon: TrendingUp },
  ];

  const menuItems = userRole === 'teacher' ? teacherMenuItems : studentMenuItems;

  return (
    <div className={`${isCollapsed ? 'w-20' : 'w-64'} bg-sidebar text-sidebar-foreground h-screen flex flex-col transition-all duration-300`}>
      {/* Logo */}
      <div className={`flex items-center ${isCollapsed ? 'justify-center py-4' : 'px-6 pt-5 pb-2'}`}>
        {!isCollapsed && (
          <span style={{ fontFamily: 'Scripter, cursive', fontSize: '36px', lineHeight: 1, color: 'white', letterSpacing: '1px' }}>
            JOMI
          </span>
        )}
        {isCollapsed && (
          <span style={{ fontFamily: 'Scripter, cursive', fontSize: '22px', lineHeight: 1, color: 'white' }}>J</span>
        )}
      </div>

      {/* Profile Section */}
      <div className="px-6 pb-4 border-b border-sidebar-border">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
          <div className="w-12 h-12 bg-sidebar-primary rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-6 h-6" />
          </div>
          {!isCollapsed && (
            <div>
              <div className="font-medium">{userName}</div>
              <div className="text-sm text-sidebar-foreground/70">
                {subtitle ?? (userRole === 'teacher' ? 'Учитель' : 'Ученик')}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                      : 'hover:bg-sidebar-accent text-sidebar-foreground'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && <span>{item.label}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-sidebar-border">
        <button
          onClick={onToggleCollapse}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground transition-colors mb-2`}
          title={isCollapsed ? 'Развернуть' : 'Свернуть'}
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          {!isCollapsed && <span>Свернуть</span>}
        </button>
        <button
          onClick={onLogout}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-lg hover:bg-destructive/10 text-sidebar-foreground transition-colors`}
          title={isCollapsed ? 'Выход' : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span>Выход</span>}
        </button>
      </div>
    </div>
  );
}