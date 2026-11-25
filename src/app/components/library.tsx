import { useState } from 'react';
import { BookOpen, ExternalLink, Search } from 'lucide-react';

interface Book {
  id: string;
  title: string;
  author: string;
  subject: string;
  grade: string;
  color: string;
  url: string;
}

const BOOKS: Book[] = [
  // Таджикские учебники с maorif.tj
  { id: '1',  title: 'Математика 8',          author: 'М. Бобоев',         subject: 'Математика',   grade: '8', color: '#4F6FFF', url: 'https://maorif.tj/page/55' },
  { id: '2',  title: 'Алгебра 8',             author: 'Н. Мирзоев',        subject: 'Математика',   grade: '8', color: '#4F6FFF', url: 'https://maorif.tj/page/55' },
  { id: '3',  title: 'Геометрия 8',           author: 'Х. Ҳасанов',        subject: 'Математика',   grade: '8', color: '#6B84E8', url: 'https://maorif.tj/page/55' },
  { id: '4',  title: 'Забони тоҷикӣ 8',       author: 'С. Назарзода',      subject: 'Таджикский',   grade: '8', color: '#38B6FF', url: 'https://maorif.tj/page/55' },
  { id: '5',  title: 'Адабиёти тоҷик 8',      author: 'Н. Салимов',        subject: 'Литература',   grade: '8', color: '#00C2CB', url: 'https://maorif.tj/page/55' },
  { id: '6',  title: 'Таърихи Тоҷикистон 8',  author: 'Р. Масов',          subject: 'История',      grade: '8', color: '#a855f7', url: 'https://maorif.tj/page/55' },
  { id: '7',  title: 'Ҷуғрофия 8',            author: 'З. Мирзоев',        subject: 'География',    grade: '8', color: '#10b981', url: 'https://maorif.tj/page/55' },
  // Английский
  { id: '8',  title: 'Solution (3rd Ed.) B1', author: 'Tim Falla',          subject: 'Английский',   grade: '8', color: '#f59e0b', url: 'https://archive.org/search?query=solution+third+edition+oxford' },
  // Математика (Cambridge)
  { id: '9',  title: 'Complete Mathematics 3', author: 'Oxford',            subject: 'Математика',   grade: '8', color: '#4F6FFF', url: 'https://www.oxfordowl.co.uk' },
  // Информатика
  { id: '10', title: 'Oxford Computing 8',    author: 'Oxford',             subject: 'Информатика',  grade: '8', color: '#1E4FD8', url: 'https://www.oxfordowl.co.uk' },
  // Физика (Oxford вместо Андарз)
  { id: '11', title: 'Oxford International Science Physics 8', author: 'Oxford', subject: 'Физика', grade: '8', color: '#ef4444', url: 'https://www.oxfordowl.co.uk' },
  // Химия
  { id: '12', title: 'Oxford International Science Chemistry 8', author: 'Oxford', subject: 'Химия', grade: '8', color: '#8b5cf6', url: 'https://www.oxfordowl.co.uk' },
  // Биология
  { id: '13', title: 'Oxford International Science Biology 8', author: 'Oxford', subject: 'Биология', grade: '8', color: '#10b981', url: 'https://www.oxfordowl.co.uk' },
];

const SUBJECTS = ['Все', ...Array.from(new Set(BOOKS.map((b) => b.subject)))];

export function Library() {
  const [activeSubject, setActiveSubject] = useState('Все');
  const [search, setSearch] = useState('');

  const filtered = BOOKS.filter((b) => {
    const matchSubject = activeSubject === 'Все' || b.subject === activeSubject;
    const matchSearch = b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase());
    return matchSubject && matchSearch;
  });

  return (
    <div style={{ padding: '32px', background: '#f8faff', minHeight: '100vh' }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1a1a2e', marginBottom: 4 }}>Библиотека</h1>
      <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 24 }}>Учебники и книги для 8 класса</p>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 20 }}>
        <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск книг..."
          style={{ width: '100%', padding: '11px 14px 11px 40px', borderRadius: 12, border: '2px solid #e0e7ff', outline: 'none', fontSize: 14, background: 'white', boxSizing: 'border-box' }}
          onFocus={(e) => e.target.style.borderColor = '#4F6FFF'}
          onBlur={(e) => e.target.style.borderColor = '#e0e7ff'}
        />
      </div>

      {/* Subject filter */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        {SUBJECTS.map((s) => (
          <button
            key={s}
            onClick={() => setActiveSubject(s)}
            style={{
              padding: '7px 16px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500, transition: 'all 0.2s',
              background: activeSubject === s ? 'linear-gradient(135deg, #1E4FD8, #4F6FFF)' : 'white',
              color: activeSubject === s ? 'white' : '#64748b',
              boxShadow: activeSubject === s ? '0 2px 8px rgba(30,79,216,0.3)' : '0 1px 4px rgba(0,0,0,0.06)',
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Books grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
        {filtered.map((book) => (
          <a
            key={book.id}
            href={book.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none', display: 'block' }}
          >
            <div style={{ background: 'white', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', border: '1px solid #e0e7ff', cursor: 'pointer', transition: 'all 0.2s', height: '100%' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(30,79,216,0.15)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.07)'; }}
            >
              {/* Cover */}
              <div style={{ background: book.color, height: 130, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <BookOpen size={48} color="rgba(255,255,255,0.7)" />
                <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(255,255,255,0.2)', borderRadius: 6, padding: '2px 8px' }}>
                  <ExternalLink size={12} color="white" />
                </div>
              </div>
              {/* Info */}
              <div style={{ padding: '12px 14px' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e', lineHeight: 1.3, marginBottom: 4 }}>{book.title}</div>
                <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 6 }}>{book.author}</div>
                <div style={{ display: 'inline-block', background: book.color + '18', color: book.color, fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 6 }}>{book.subject}</div>
              </div>
            </div>
          </a>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>
          <BookOpen size={40} color="#c7d2fe" style={{ margin: '0 auto 12px' }} />
          <p>Книги не найдены</p>
        </div>
      )}
    </div>
  );
}
