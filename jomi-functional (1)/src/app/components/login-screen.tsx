import { useState } from 'react';
import { BookOpen, AlertCircle } from 'lucide-react';
import { findTeacherByLogin, getStudents, type SessionUser } from '../data/db';

interface LoginScreenProps {
  onLogin: (session: SessionUser) => void;
}

// Единственный пока настоящий ученик — Мухаммадаюб. Любой другой логин/пароль
// для ученика не распознаётся (чтобы не притворяться, что система уже знает
// всех учеников — это появится вместе с реальной базой).
const STUDENT_LOGIN = 'muhammadayub';
const STUDENT_PASSWORD = '1234';
const STUDENT_ID = '1';

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedLogin = login.trim().toLowerCase();

    // 1) Проверяем учителей
    const teacher = findTeacherByLogin(trimmedLogin, password);
    if (teacher) {
      onLogin({ role: 'teacher', teacherId: teacher.id });
      return;
    }

    // 2) Проверяем ученика (пока только один настоящий аккаунт)
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
          </div>

          <div className="text-center mb-1" style={{ fontFamily: 'Scripter, cursive', fontSize: '52px', lineHeight: 1.1, color: 'var(--foreground)' }}>
            JOMI
          </div>
          <p className="text-center text-muted-foreground mb-6" style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase' }}>
            Journal of My Intelligence
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="login" className="block mb-2">
                Login
              </label>
              <input
                id="login"
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Введите логин"
                autoComplete="username"
              />
            </div>

            <div>
              <label htmlFor="password" className="block mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Введите пароль"
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-destructive text-sm px-1">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Войти
            </button>

            <div className="text-center">
              <a href="#" className="text-primary hover:underline">
                Забыли пароль?
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
