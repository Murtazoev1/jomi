import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { findTeacherByLogin, getStudents, type SessionUser } from '../data/db';

interface LoginScreenProps { onLogin: (session: SessionUser) => void; }

function JomiLogo({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="207 169 665 640" xmlns="http://www.w3.org/2000/svg">
      <circle cx="529" cy="341" r="171" fill="#4F6FFF"/>
      <circle cx="377" cy="496" r="170" fill="#004BAD"/>
      <circle cx="527" cy="637" r="171" fill="#1A00A8"/>
      <circle cx="700" cy="497" r="171" fill="#38B6FF"/>
    </svg>
  );
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const trimmed = login.trim().toLowerCase();

    // Admin
    if (trimmed === 'admin' && password === '1234') {
      onLogin({ role: 'admin' });
      return;
    }
    // Teacher
    const teacher = findTeacherByLogin(trimmed, password);
    if (teacher) { onLogin({ role: 'teacher', teacherId: teacher.id }); return; }
    // Student
    if (trimmed === 'muhammadayub' && password === '1234') {
      const student = getStudents().find(s => s.id === '1');
      if (student) { onLogin({ role: 'student', studentId: student.id }); return; }
    }
    setError('Неверный логин или пароль');
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg,#0f0c29 0%,#1A1A7E 40%,#1E4FD8 100%)' }}>
      <div style={{ width:'100%', maxWidth:420, padding:'0 16px' }}>
        <div style={{ background:'white', borderRadius:24, boxShadow:'0 20px 60px rgba(0,0,0,0.3)', padding:40 }}>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', marginBottom:32 }}>
            <JomiLogo size={80}/>
            <div style={{ fontFamily:'Scripter, cursive', fontSize:48, lineHeight:1, color:'#1A1A7E', letterSpacing:2, marginTop:8 }}>JOMI</div>
            <p style={{ fontSize:10, letterSpacing:3, color:'#6B84E8', textTransform:'uppercase', marginTop:4 }}>Journal of My Intelligence</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div>
              <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#1A1A7E', marginBottom:6 }}>Логин</label>
              <input type="text" value={login} onChange={e=>setLogin(e.target.value)} placeholder="Введите логин"
                style={{ width:'100%', padding:'12px 14px', borderRadius:12, border:'2px solid #e0e7ff', outline:'none', fontSize:14, boxSizing:'border-box', transition:'border-color 0.2s' }}
                onFocus={e=>e.target.style.borderColor='#1E4FD8'} onBlur={e=>e.target.style.borderColor='#e0e7ff'} autoComplete="username"/>
            </div>
            <div>
              <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#1A1A7E', marginBottom:6 }}>Пароль</label>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Введите пароль"
                style={{ width:'100%', padding:'12px 14px', borderRadius:12, border:'2px solid #e0e7ff', outline:'none', fontSize:14, boxSizing:'border-box', transition:'border-color 0.2s' }}
                onFocus={e=>e.target.style.borderColor='#1E4FD8'} onBlur={e=>e.target.style.borderColor='#e0e7ff'} autoComplete="current-password"/>
            </div>
            {error && (
              <div style={{ display:'flex', alignItems:'center', gap:6, color:'#e53e3e', fontSize:13 }}>
                <AlertCircle size={15}/>{error}
              </div>
            )}
            <button type="submit" style={{ padding:'14px', background:'linear-gradient(135deg,#1E4FD8,#6B84E8)', color:'white', border:'none', borderRadius:12, cursor:'pointer', fontWeight:700, fontSize:15, transition:'opacity 0.2s' }}
              onMouseEnter={e=>(e.currentTarget as HTMLElement).style.opacity='0.9'} onMouseLeave={e=>(e.currentTarget as HTMLElement).style.opacity='1'}>
              Войти
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
