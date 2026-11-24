import { useState, useEffect } from 'react';
import { LoginScreen } from './components/login-screen';
import { Sidebar } from './components/sidebar';
import { Dashboard } from './components/dashboard';
import { Grades } from './components/grades';
import { Schedule } from './components/schedule';
import { Homework } from './components/homework';
import { Library } from './components/library';
import { News } from './components/news';
import { Chat } from './components/chat';
import { TeacherDashboard } from './components/teacher-dashboard';
import { TeacherClasses } from './components/teacher-classes';
import { TeacherJournal } from './components/teacher-journal';
import { TeacherActions } from './components/teacher-actions';
import { TeacherActivity } from './components/teacher-activity';
import {
  type SessionUser,
  loadSession,
  saveSession,
  clearSession,
  getTeachers,
  getStudents,
} from './data/db';

type StudentView = 'dashboard' | 'grades' | 'schedule' | 'homework' | 'library' | 'news' | 'chat';
type TeacherView = 'dashboard' | 'classes' | 'journal' | 'actions' | 'activity';

export default function App() {
  const [session, setSession] = useState<SessionUser | null>(null);
  const [currentView, setCurrentView] = useState<StudentView | TeacherView>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Восстанавливаем сессию при перезагрузке страницы
  useEffect(() => {
    const existing = loadSession();
    if (existing) setSession(existing);
  }, []);

  const handleLogin = (newSession: SessionUser) => {
    saveSession(newSession);
    setSession(newSession);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    clearSession();
    setSession(null);
    setCurrentView('dashboard');
  };

  if (!session) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  const teacher = session.role === 'teacher' ? getTeachers().find((t) => t.id === session.teacherId) : undefined;
  const student = session.role === 'student' ? getStudents().find((s) => s.id === session.studentId) : undefined;

  const userName = session.role === 'teacher' ? teacher?.fullName ?? 'Учитель' : student?.name ?? 'Ученик';

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        currentPage={currentView}
        onNavigate={(page) => setCurrentView(page as StudentView | TeacherView)}
        onLogout={handleLogout}
        userName={userName}
        userRole={session.role}
        subtitle={session.role === 'teacher' ? teacher?.subject : undefined}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <div className="flex-1 overflow-auto">
        {session.role === 'student' ? (
          <>
            {currentView === 'dashboard' && <Dashboard userName={userName} />}
            {currentView === 'grades' && <Grades />}
            {currentView === 'schedule' && <Schedule />}
            {currentView === 'homework' && <Homework />}
            {currentView === 'library' && <Library />}
            {currentView === 'news' && <News />}
            {currentView === 'chat' && <Chat />}
          </>
        ) : (
          <>
            {currentView === 'dashboard' && teacher && <TeacherDashboard teacherId={teacher.id} />}
            {currentView === 'classes' && teacher && <TeacherClasses teacherId={teacher.id} />}
            {currentView === 'journal' && teacher && <TeacherJournal teacherId={teacher.id} />}
            {currentView === 'actions' && teacher && <TeacherActions teacherId={teacher.id} />}
            {currentView === 'activity' && teacher && <TeacherActivity teacherId={teacher.id} />}
          </>
        )}
      </div>
    </div>
  );
}
