import { useState, useEffect } from 'react';
import { Newspaper } from 'lucide-react';
import { getNewsList, markRead, getReadState, loadSession, type NewsItem } from '../data/db';

export function News() {
  const session = loadSession();
  const myId = session?.role === 'student' ? (session as any).studentId
    : session?.role === 'teacher' ? (session as any).teacherId : 'admin';

  const [news, setNews] = useState<NewsItem[]>([]);
  const [selected, setSelected] = useState<NewsItem | null>(null);

  useEffect(() => {
    setNews(getNewsList());
  }, []);

  const isRead = (id: string): boolean => {
    const rs = getReadState();
    return !!rs[`news-${myId}-${id}`];
  };

  const handleOpen = (item: NewsItem) => {
    setSelected(item);
    markRead(`news-${myId}-${item.id}`);
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div style={{ padding: 32, minHeight: '100vh', background: '#f8faff' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <Newspaper size={24} color="#1E4FD8" />
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1a1a3e', margin: 0 }}>Новости</h1>
      </div>

      {news.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 20px', color: '#94a3b8' }}>
          <Newspaper size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
          <p style={{ fontSize: 16, margin: 0 }}>Новостей пока нет</p>
          <p style={{ fontSize: 13, margin: '8px 0 0', textAlign: 'center' }}>Администратор ещё не опубликовал новости</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {news.map(item => {
            const read = isRead(item.id);
            return (
              <div
                key={item.id}
                onClick={() => handleOpen(item)}
                style={{
                  background: 'white', borderRadius: 16, padding: 20, cursor: 'pointer',
                  boxShadow: read ? '0 1px 4px rgba(0,0,0,0.06)' : '0 4px 16px rgba(30,79,216,0.12)',
                  border: read ? '1px solid #f0f4ff' : '2px solid #1E4FD8',
                  transition: 'all 0.2s', opacity: read ? 0.75 : 1,
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1a1a3e', margin: 0, lineHeight: 1.4, flex: 1 }}>{item.title}</h3>
                  {!read && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#1E4FD8', flexShrink: 0, marginLeft: 8, marginTop: 4 }} />}
                </div>
                <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 12px', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {item.body}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, color: '#94a3b8' }}>{formatDate(item.createdAt)}</span>
                  <span style={{ fontSize: 11, color: '#94a3b8' }}>{item.author}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,10,46,0.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
          onClick={() => setSelected(null)}>
          <div style={{ background: 'white', borderRadius: 20, padding: 32, maxWidth: 540, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', maxHeight: '80vh', overflowY: 'auto' }}
            onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1a1a3e', marginBottom: 8 }}>{selected.title}</h2>
            <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 16 }}>{formatDate(selected.createdAt)} · {selected.author}</div>
            <p style={{ fontSize: 15, color: '#334155', lineHeight: 1.7, whiteSpace: 'pre-wrap', margin: 0 }}>{selected.body}</p>
            <button onClick={() => setSelected(null)} style={{ width: '100%', marginTop: 24, padding: 12, background: 'linear-gradient(135deg,#1E4FD8,#6B84E8)', color: 'white', border: 'none', borderRadius: 12, cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
