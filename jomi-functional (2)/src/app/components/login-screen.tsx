import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { findTeacherByLogin, getStudents, type SessionUser } from '../data/db';

interface LoginScreenProps {
  onLogin: (session: SessionUser) => void;
}

const STUDENT_LOGIN = 'muhammadayub';
const STUDENT_PASSWORD = '1234';
const STUDENT_ID = '1';

// Логотип — 4 перекрывающихся круга
function JomiLogo({ size = 80 }: { size?: number }) {
  const r = size * 0.35;
  const cx = size / 2;
  const cy = size / 2;
  const off = size * 0.18;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: 'visible' }}>
      <circle cx={cx - off} cy={cy - off} r={r} fill="#6B84E8" opacity="0.9" />
      <circle cx={cx + off} cy={cy - off} r={r} fill="#56CCF2" opacity="0.9" />
      <circle cx={cx - off} cy={cy + off} r={r} fill="#1E4FD8" opacity="0.9" />
      <circle cx={cx + off} cy={cy + off} r={r} fill="#1A1A7E" opacity="0.9" />
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
    const trimmedLogin = login.trim().toLowerCase();

    const teacher = findTeacherByLogin(trimmedLogin, password);
    if (teacher) {
      onLogin({ role: 'teacher', teacherId: teacher.id });
      return;
    }

    if (trimmedLogin === STUDENT_LOGIN && password === STUDENT_PASSWORD) {
      const student = getStudents().find((s) => s.id === STUDENT_ID);
      if (student) {
        onLogin({ role: 'student', studentId: student.id });
        return;
      }
    }

    setError('Неверный логин или пароль');
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0f0c29 0%, #1A1A7E 40%, #1E4FD8 100%)' }}>
      <div className="w-full max-w-md px-4">
        <div className="bg-white rounded-3xl shadow-2xl p-10">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <JomiLogo size={90} />
            <div className="mt-3" style={{ fontFamily: 'Scripter, cursive', fontSize: '48px', lineHeight: 1, color: '#1A1A7E', letterSpacing: '2px' }}>
              JOMI
            </div>
            <p style={{ fontSize: '10px', letterSpacing: '3px', color: '#6B84E8', textTransform: 'uppercase', marginTop: '4px' }}>
              Journal of My Intelligence
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#1A1A7E' }}>Логин</label>
              <input
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 outline-none transition-all"
                style={{ borderColor: '#E0E7FF' }}
                onFocus={(e) => e.target.style.borderColor = '#1E4FD8'}
                onBlur={(e) => e.target.style.borderColor = '#E0E7FF'}
                placeholder="Введите логин"
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#1A1A7E' }}>Пароль</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 outline-none transition-all"
                style={{ borderColor: '#E0E7FF' }}
                onFocus={(e) => e.target.style.borderColor = '#1E4FD8'}
                onBlur={(e) => e.target.style.borderColor = '#E0E7FF'}
                placeholder="Введите пароль"
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm px-1" style={{ color: '#e53e3e' }}>
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl text-white font-semibold transition-all hover:opacity-90 active:scale-95"
              style={{ background: 'linear-gradient(135deg, #1E4FD8, #6B84E8)' }}
            >
              Войти
            </button>

            <div className="text-center text-xs mt-2" style={{ color: '#6B84E8' }}>
              Ученик: muhammadayub / 1234 &nbsp;|&nbsp; Учитель: saidov / 1234
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
