import { useState } from 'react';
import { getSchedule, DAYS_ORDER, type DayOfWeek } from '../data/db';

const SUBJECT_COLORS: Record<string, string> = {
  'Олимпиада': '#E8AADD',
  'Алгебра': '#7EC8E3',
  'Геометрия': '#7EC8E3',
  'Английский': '#F9C784',
  'Физика': '#A8D8A8',
  'Биология': '#C8A8D8',
  'Химия': '#F9C784',
  'История': '#F9C784',
  'Таджикский': '#F9C784',
  'Русский': '#A8D8A8',
  'Информатика': '#7EC8E3',
  'Технология': '#F9A8C9',
  'Физ-ра': '#D3D3D3',
  'География': '#A8D8D8',
  'Литература': '#F9C784',
};
const getColor = (subject: string) => SUBJECT_COLORS[subject] || '#E0E0E0';

const TIME_SLOTS = [
  { label: '1', start: '08:00', end: '08:45' },
  { label: '2', start: '08:55', end: '09:40' },
  { label: '3', start: '10:30', end: '11:15' },
  { label: '4', start: '11:25', end: '12:10' },
  { label: '5', start: '12:20', end: '13:05' },
  { label: '6', start: '13:55', end: '14:35' },
  { label: '7', start: '14:45', end: '15:25' },
];

const DAYS_SHORT: Record<DayOfWeek, string> = {
  Понедельник: 'Пн', Вторник: 'Вт', Среда: 'Ср',
  Четверг: 'Чт', Пятница: 'Пт', Суббота: 'Сб',
};

export function Schedule() {
  const schedule = getSchedule();
  const today = new Date();
  const todayDayIdx = today.getDay();
  const days: DayOfWeek[] = ['Понедельник','Вторник','Среда','Четверг','Пятница'];

  const getLesson = (day: DayOfWeek, slot: typeof TIME_SLOTS[0]) => {
    return schedule.find(s => s.day === day && s.startTime === slot.start);
  };

  const isToday = (day: DayOfWeek) => {
    const map: Record<DayOfWeek, number> = { Понедельник:1,Вторник:2,Среда:3,Четверг:4,Пятница:5,Суббота:6 };
    return map[day] === todayDayIdx;
  };

  const [selected, setSelected] = useState<typeof schedule[0] | null>(null);

  return (
    <div style={{ padding: '24px', background: '#f8faff', minHeight: '100vh' }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 20, color: '#1a1a3e' }}>
        📅 Расписание — 8-Г
      </h1>

      {/* Grid table */}
      <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 4px 24px rgba(30,79,216,0.08)', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ display: 'grid', gridTemplateColumns: '80px repeat(5, 1fr)', background: 'linear-gradient(135deg, #1A1A7E, #1E4FD8)' }}>
          <div style={{ padding: '12px 8px', textAlign: 'center', color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>#</div>
          {days.map(day => (
            <div key={day} style={{
              padding: '14px 8px', textAlign: 'center',
              color: isToday(day) ? '#38B6FF' : 'white',
              fontWeight: isToday(day) ? 700 : 500,
              fontSize: 13,
              borderLeft: '1px solid rgba(255,255,255,0.1)',
            }}>
              <div style={{ fontSize: 16, fontWeight: 700 }}>{DAYS_SHORT[day]}</div>
              <div style={{ fontSize: 10, opacity: 0.7, marginTop: 2 }}>{day}</div>
            </div>
          ))}
        </div>

        {/* Rows */}
        {TIME_SLOTS.map((slot, idx) => (
          <div key={slot.label} style={{
            display: 'grid', gridTemplateColumns: '80px repeat(5, 1fr)',
            borderBottom: idx < TIME_SLOTS.length - 1 ? '1px solid #f0f4ff' : 'none',
            background: idx % 2 === 0 ? '#fff' : '#fafbff',
          }}>
            {/* Time column */}
            <div style={{ padding: '10px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid #e8ecf8' }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#1E4FD8' }}>{slot.label}</div>
              <div style={{ fontSize: 9, color: '#94a3b8', marginTop: 2, lineHeight: 1.4, textAlign: 'center' }}>
                {slot.start}<br />{slot.end}
              </div>
            </div>

            {/* Day cells */}
            {days.map(day => {
              const lesson = getLesson(day, slot);
              const todayCol = isToday(day);
              return (
                <div
                  key={day}
                  onClick={() => lesson && setSelected(lesson)}
                  style={{
                    padding: '8px 6px', minHeight: 70,
                    borderLeft: '1px solid #f0f4ff',
                    background: todayCol ? 'rgba(30,79,216,0.03)' : 'transparent',
                    cursor: lesson ? 'pointer' : 'default',
                    transition: 'all 0.15s',
                  }}
                >
                  {lesson ? (
                    <div
                      style={{
                        background: getColor(lesson.subject),
                        borderRadius: 10, padding: '8px 10px',
                        height: '100%', boxSizing: 'border-box',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                        transition: 'transform 0.15s, box-shadow 0.15s',
                        position: 'relative', overflow: 'hidden',
                      }}
                      onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.transform='scale(1.02)';(e.currentTarget as HTMLElement).style.boxShadow='0 4px 12px rgba(0,0,0,0.15)';}}
                      onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform='scale(1)';(e.currentTarget as HTMLElement).style.boxShadow='0 2px 6px rgba(0,0,0,0.08)';}}
                    >
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#1a1a3e', lineHeight: 1.3 }}>{lesson.subject}</div>
                      {lesson.room && <div style={{ fontSize: 10, color: '#444', marginTop: 3 }}>Каб. {lesson.room}</div>}
                      {lesson.teacher && <div style={{ fontSize: 9, color: '#666', marginTop: 2, lineHeight: 1.2 }}>{lesson.teacher}</div>}
                    </div>
                  ) : (
                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ width: 20, height: 2, background: '#e0e7ff', borderRadius: 2 }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Detail modal */}
      {selected && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(10,10,46,0.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setSelected(null)}
        >
          <div
            style={{ background: 'white', borderRadius: 20, padding: 32, maxWidth: 360, width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ width: 48, height: 48, borderRadius: 12, background: getColor(selected.subject), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 16 }}>📚</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a3e', marginBottom: 8 }}>{selected.subject}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', gap: 8, fontSize: 14, color: '#64748b' }}>
                <span>🕐</span><span>{selected.startTime} – {selected.endTime}</span>
              </div>
              <div style={{ display: 'flex', gap: 8, fontSize: 14, color: '#64748b' }}>
                <span>📅</span><span>{selected.day}</span>
              </div>
              {selected.room && <div style={{ display: 'flex', gap: 8, fontSize: 14, color: '#64748b' }}>
                <span>🚪</span><span>Кабинет {selected.room}</span>
              </div>}
              {selected.teacher && <div style={{ display: 'flex', gap: 8, fontSize: 14, color: '#64748b' }}>
                <span>👨‍🏫</span><span>{selected.teacher}</span>
              </div>}
            </div>
            <button
              onClick={() => setSelected(null)}
              style={{ width: '100%', marginTop: 20, padding: '12px', background: 'linear-gradient(135deg,#1E4FD8,#6B84E8)', color: 'white', border: 'none', borderRadius: 12, cursor: 'pointer', fontWeight: 600 }}
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
