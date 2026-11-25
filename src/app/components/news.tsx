import { useState, useEffect } from 'react';
import { Bell, Calendar, Trophy, Info, Plus, Trash2, X } from 'lucide-react';
import { loadSession } from '../data/db';

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  date: string;
  category: 'olympiad' | 'schedule' | 'events' | 'info';
  isNew?: boolean;
}

function loadNews(): NewsItem[] {
  try {
    const raw = localStorage.getItem('jomi_news');
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function saveNews(items: NewsItem[]) {
  localStorage.setItem('jomi_news', JSON.stringify(items));
}

const CATEGORY_ICONS = {
  olympiad: Trophy,
  schedule: Calendar,
  events: Bell,
  info: Info,
};

const CATEGORY_LABELS = {
  olympiad: 'Олимпиада',
  schedule: 'Расписание',
  events: 'События',
  info: 'Информация',
};

const CATEGORY_COLORS: Record<string, string> = {
  olympiad: '#f59e0b',
  schedule: '#3b82f6',
  events: '#8b5cf6',
  info: '#10b981',
};

export function News() {
  const session = loadSession();
  const isAdmin = session?.role === 'teacher';

  const [news, setNews] = useState<NewsItem[]>(loadNews());
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<NewsItem['category']>('info');

  useEffect(() => {
    setNews(loadNews());
    const interval = setInterval(() => setNews(loadNews()), 3000);
    return () => clearInterval(interval);
  }, []);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const item: NewsItem = {
      id: `n-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      date: new Date().toISOString().split('T')[0],
      category,
      isNew: true,
    };
    const updated = [item, ...news];
    saveNews(updated);
    setNews(updated);
    setTitle(''); setDescription(''); setShowForm(false);
  };

  const handleDelete = (id: string) => {
    const updated = news.filter((n) => n.id !== id);
    saveNews(updated);
    setNews(updated);
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div style={{ padding: 32, background: '#f8faff', minHeight: '100vh' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1a1a2e' }}>Новости</h1>
            <p style={{ color: '#94a3b8', fontSize: 13, marginTop: 2 }}>Объявления и события школы</p>
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowForm(true)}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 12, border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg, #1E4FD8, #4F6FFF)', color: 'white', fontWeight: 600, fontSize: 14 }}
            >
              <Plus size={18} /> Добавить новость
            </button>
          )}
        </div>

        {/* Add form */}
        {showForm && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: 'white', borderRadius: 20, padding: 32, width: '100%', maxWidth: 480, position: 'relative' }}>
              <button onClick={() => setShowForm(false)} style={{ position: 'absolute', top: 16, right: 16, border: 'none', background: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                <X size={20} />
              </button>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, color: '#1a1a2e' }}>Новое объявление</h2>
              <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ fontSize: 13, color: '#64748b', marginBottom: 4, display: 'block' }}>Заголовок *</label>
                  <input value={title} onChange={(e) => setTitle(e.target.value)} required style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '2px solid #e0e7ff', outline: 'none', fontSize: 14 }} placeholder="Заголовок объявления" />
                </div>
                <div>
                  <label style={{ fontSize: 13, color: '#64748b', marginBottom: 4, display: 'block' }}>Описание</label>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '2px solid #e0e7ff', outline: 'none', fontSize: 14, resize: 'none' }} placeholder="Подробности..." />
                </div>
                <div>
                  <label style={{ fontSize: 13, color: '#64748b', marginBottom: 4, display: 'block' }}>Категория</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value as NewsItem['category'])} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '2px solid #e0e7ff', outline: 'none', fontSize: 14 }}>
                    <option value="info">Информация</option>
                    <option value="events">События</option>
                    <option value="schedule">Расписание</option>
                    <option value="olympiad">Олимпиада</option>
                  </select>
                </div>
                <button type="submit" style={{ padding: '12px', borderRadius: 12, border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg, #1E4FD8, #4F6FFF)', color: 'white', fontWeight: 600, fontSize: 15 }}>
                  Опубликовать
                </button>
              </form>
            </div>
          </div>
        )}

        {/* News list */}
        {news.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#94a3b8' }}>
            <Bell size={48} color="#c7d2fe" style={{ margin: '0 auto 12px' }} />
            <p style={{ fontSize: 15 }}>Пока нет новостей</p>
            {isAdmin && <p style={{ fontSize: 13, marginTop: 4 }}>Добавьте первое объявление</p>}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {news.map((item) => {
              const Icon = CATEGORY_ICONS[item.category];
              const color = CATEGORY_COLORS[item.category];
              return (
                <div key={item.id} style={{ background: 'white', borderRadius: 16, padding: '20px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #e0e7ff', display: 'flex', gap: 16, position: 'relative' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={20} color={color} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color, background: color + '18', padding: '2px 8px', borderRadius: 6 }}>{CATEGORY_LABELS[item.category]}</span>
                      {item.isNew && <span style={{ fontSize: 11, fontWeight: 700, color: 'white', background: '#ef4444', padding: '2px 8px', borderRadius: 6 }}>NEW</span>}
                    </div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1a1a2e', marginBottom: 4 }}>{item.title}</h3>
                    {item.description && <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>{item.description}</p>}
                    <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 8 }}>{formatDate(item.date)}</p>
                  </div>
                  {isAdmin && (
                    <button onClick={() => handleDelete(item.id)} style={{ position: 'absolute', top: 12, right: 12, border: 'none', background: 'none', cursor: 'pointer', color: '#cbd5e1', padding: 4, borderRadius: 6 }}
                      onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.color = '#ef4444'}
                      onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.color = '#cbd5e1'}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
