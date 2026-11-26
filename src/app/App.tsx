import { useState, useEffect } from 'react';
import { SplashScreen } from './components/splash-screen';
import { LoginScreen } from './components/login-screen';
import { Sidebar } from './components/sidebar';
import { Dashboard } from './components/dashboard';
import { Grades } from './components/grades';
import { Schedule } from './components/schedule';
import { Homework } from './components/homework';
import { Library } from './components/library';
import { News } from './components/news';
import { Chat } from './components/chat';
import { JomiAI } from './components/jomi-ai';
import { TeacherDashboard } from './components/teacher-dashboard';
import { TeacherClasses } from './components/teacher-classes';
import { TeacherJournal } from './components/teacher-journal';
import { TeacherActions } from './components/teacher-actions';
import { TeacherActivity } from './components/teacher-activity';
import { AdminPanel } from './components/admin-panel';
import { type SessionUser, loadSession, saveSession, clearSession, getTeachers, getStudents } from './data/db';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [session, setSession] = useState<SessionUser|null>(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => { const s = loadSession(); if(s) setSession(s); }, []);

  const handleLogin = (s: SessionUser) => { saveSession(s); setSession(s); setCurrentView('dashboard'); };
  const handleLogout = () => { clearSession(); setSession(null); setCurrentView('dashboard'); };

  if (showSplash) return <SplashScreen onDone={() => setShowSplash(false)} />;
  if (!session) return <LoginScreen onLogin={handleLogin} />;

  const teacher = session.role === 'teacher' ? getTeachers().find(t=>t.id===(session as any).teacherId) : undefined;
  const student = session.role === 'student' ? getStudents().find(s=>s.id===(session as any).studentId) : undefined;
  const userName = session.role === 'admin' ? 'Администратор' : session.role === 'teacher' ? teacher?.fullName ?? 'Учитель' : student?.name ?? 'Ученик';

  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden' }}>
      <Sidebar
        currentPage={currentView} onNavigate={setCurrentView} onLogout={handleLogout}
        userName={userName} userRole={session.role}
        subtitle={session.role==='teacher' ? teacher?.subject : undefined}
        isCollapsed={isSidebarCollapsed} onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <div style={{ flex:1, overflowY:'auto' }}>
        {session.role === 'admin' && <AdminPanel />}
        {session.role === 'student' && (<>
          {currentView==='dashboard' && <Dashboard userName={userName}/>}
          {currentView==='grades'    && <Grades/>}
          {currentView==='schedule'  && <Schedule/>}
          {currentView==='homework'  && <Homework/>}
          {currentView==='library'   && <Library/>}
          {currentView==='news'      && <News/>}
          {currentView==='chat'      && <Chat/>}
          {currentView==='ai'        && <JomiAI/>}
        </>)}
        {session.role === 'teacher' && teacher && (<>
          {currentView==='dashboard' && <TeacherDashboard teacherId={teacher.id}/>}
          {currentView==='classes'   && <TeacherClasses teacherId={teacher.id}/>}
          {currentView==='journal'   && <TeacherJournal teacherId={teacher.id}/>}
          {currentView==='actions'   && <TeacherActions teacherId={teacher.id}/>}
          {currentView==='activity'  && <TeacherActivity teacherId={teacher.id}/>}
          {currentView==='chat'      && <Chat/>}
        </>)}
      </div>
    </div>
  );
}
