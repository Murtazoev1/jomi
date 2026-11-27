import { useEffect, useState } from 'react';
import { BookOpen, MessageSquare, FileText } from 'lucide-react';
import { getSchedule, findNextLesson, formatMinutesUntil, getTotalUnread, getHomeworkForClass, loadSession } from '../data/db';

interface DashboardProps { userName: string; }

export function Dashboard({ userName }: DashboardProps) {
  const [now, setNow] = useState(new Date());
  const session = loadSession();
  const myId = session?.role === 'student' ? (session as any).studentId : '';

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const schedule = getSchedule();
  const next = findNextLesson(schedule, now);
  const unread = myId ? getTotalUnread(myId) : 0;
  const homework = getHomeworkForClass('class-8g');

  const currentDate = now.toLocaleDateString('ru-RU', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const firstName = userName.split(' ').slice(1).join(' ') || userName;

  return (
    <div style={{ padding: 32, minHeight: '100vh', background: '#f8faff' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1a1a3e', margin: '0 0 4px' }}>
          Привет, {firstName}!
        </h1>
        <p style={{ color: '#64748b', margin: 0, fontSize: 14, textTransform: 'capitalize' }}>{currentDate}</p>
      </div>

      {/* Next lesson card */}
      {next ? (
        <div style={{ background: 'linear-gradient(135deg,#1A1A7E,#1E4FD8)', borderRadius: 20, padding: '24px 28px', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, boxShadow: '0 8px 32px rgba(30,79,216,0.3)' }}>
          <div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6 }}>
              {next.isToday ? '⏰ Следующий урок сегодня' : `📅 Следующий урок (${next.slot.day})`}
            </div>
            <div style={{ color: 'white', fontSize: 22, fontWeight: 700 }}>{next.slot.subject}</div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 4 }}>
              {next.slot.startTime}–{next.slot.endTime}
              {next.slot.room && ` · Каб. ${next.slot.room}`}
              {(next.slot as any).teacher && ` · ${(next.slot as any).teacher}`}
            </div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 16, padding: '12px 20px', textAlign: 'center' }}>
            <div style={{ color: 'white', fontSize: 20, fontWeight: 800 }}>{formatMinutesUntil(next.minutesUntil)}</div>
          </div>
        </div>
      ) : (
        <div style={{ background: 'white', borderRadius: 20, padding: 24, marginBottom: 24, border: '1px solid #e0e7ff', color: '#64748b', textAlign: 'center' }}>
          Уроков сегодня больше нет 🎉
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 24 }}>
        <StatCard icon={<FileText size={22} color="white"/>} bg="#1E4FD8" value={homework.length} label="Домашних заданий"/>
        <StatCard icon={<MessageSquare size={22} color="white"/>} bg="#6B84E8" value={unread} label="Непрочитанных"/>
        <StatCard icon={<BookOpen size={22} color="white"/>} bg="#004BAD" value={schedule.length} label="Уроков в неделю"/>
      </div>

      {/* Today's schedule */}
      <TodaySchedule schedule={schedule} now={now}/>
    </div>
  );
}

function StatCard({ icon, bg, value, label }: { icon: React.ReactNode; bg: string; value: number; label: string }) {
  return (
    <div style={{ background: 'white', borderRadius: 16, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #f0f4ff' }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{icon}</div>
      <div>
        <div style={{ fontSize: 24, fontWeight: 800, color: '#1a1a3e', lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{label}</div>
      </div>
    </div>
  );
}

function TodaySchedule({ schedule, now }: { schedule: any[]; now: Date }) {
  const days = ['Понедельник','Вторник','Среда','Четверг','Пятница','Суббота'];
  const todayName = days[(now.getDay() + 6) % 7];
  const todaySlots = schedule.filter((s: any) => s.day === todayName).sort((a: any, b: any) => a.startTime.localeCompare(b.startTime));
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const toMin = (t: string) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };

  if (todaySlots.length === 0) return null;

  return (
    <div style={{ background: 'white', borderRadius: 20, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #f0f4ff' }}>
      <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a3e', marginBottom: 16 }}>📋 Расписание на сегодня</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {todaySlots.map((s: any, i: number) => {
          const isPast = toMin(s.endTime) < nowMin;
          const isCurrent = toMin(s.startTime) <= nowMin && nowMin <= toMin(s.endTime);
          return (
            <div key={s.id} style={{
              display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', borderRadius: 12,
              background: isCurrent ? '#e0e7ff' : isPast ? '#fafafa' : '#f8faff',
              border: isCurrent ? '1.5px solid #1E4FD8' : '1px solid transparent',
              opacity: isPast ? 0.6 : 1,
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', minWidth: 24, textAlign: 'center' }}>{i + 1}</div>
              <div style={{ fontSize: 11, color: '#94a3b8', minWidth: 90 }}>{s.startTime}–{s.endTime}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: isCurrent ? '#1E4FD8' : '#1a1a3e' }}>{s.subject}</div>
                {(s as any).teacher && <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>{(s as any).teacher}</div>}
              </div>
              {isCurrent && <div style={{ fontSize: 11, color: '#1E4FD8', fontWeight: 700, background: '#c7d2fe', padding: '2px 8px', borderRadius: 20 }}>Сейчас</div>}
              {s.room && <div style={{ fontSize: 11, color: '#94a3b8' }}>Каб. {s.room}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
