import { useState } from 'react';
import { Newspaper, Bell } from 'lucide-react';
import { getNewsList, markRead, isRead, type NewsItem } from '../data/db';

const CATEGORY_COLORS: Record<string, string> = {
  'Объявление': '#1E4FD8',
  'Событие': '#059669',
  'Успеваемость': '#d97706',
  'Расписание': '#7c3aed',
  'Общее': '#64748b',
};

export function News() {
  const [, forceUpdate] = useState(0);
  const news = getNewsList().slice().reverse();

  const handleRead = (item: NewsItem) => {
    markRead(`news-${item.id}`);
    forceUpdate(n => n + 1);
  };

  if (news.length === 0) {
    return (
      <div style={{ padding: 32, minHeight: '100vh', background: '#f8faff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Newspaper size={56} color="#c7d2fe" />
        <h2 style={{ color: '#94a3b8', marginTop: 16, fontWeight: 500 }}>Новостей пока нет</h2>
        <p style={{ color: '#94a3b8', fontSize: 14 }}>Администратор добавит новости позже</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 32, background: '#f8faff', minHeight: '100vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#0D1B6E', margin: 0 }}>Новости</h1>
        <span style={{ background: '#1E4FD8', color: 'white', borderRadius: 20, padding: '2px 10px', fontSize: 12, fontWeight: 700 }}>
          {news.filter(n => !isRead(`news-${n.id}`)).length} новых
        </span>
      </div>

      <div style={{ display: 'grid', gap: 16, maxWidth: 760 }}>
        {news.map(item => {
          const read = isRead(`news-${item.id}`);
          const catColor = CATEGORY_COLORS[item.category] ?? '#1E4FD8';
          return (
            <div key={item.id} onClick={() => handleRead(item)} style={{
              background: 'white', borderRadius: 20,
              boxShadow: read ? '0 1px 4px rgba(0,0,0,0.05)' : '0 4px 20px rgba(30,79,216,0.12)',
              padding: 24, cursor: 'pointer', transition: 'all 0.2s',
              borderLeft: `4px solid ${read ? '#e0e7ff' : catColor}`,
              opacity: read ? 0.75 : 1,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: catColor, textTransform: 'uppercase', letterSpacing: 1, background: catColor + '15', padding: '3px 10px', borderRadius: 20 }}>
                  {item.category}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {!read && <Bell size={14} color={catColor} />}
                  <span style={{ fontSize: 12, color: '#94a3b8' }}>{new Date(item.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}</span>
                </div>
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: '#1a1a2e', margin: '0 0 8px' }}>{item.title}</h3>
              <p style={{ fontSize: 14, color: '#475569', margin: 0, lineHeight: 1.6 }}>{item.content}</p>
              <div style={{ marginTop: 12, fontSize: 12, color: '#94a3b8' }}>— {item.author}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
