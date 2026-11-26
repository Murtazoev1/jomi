import { useState } from 'react';
import { BookOpen, ExternalLink, Search } from 'lucide-react';

interface Book {
  id: string; title: string; author: string; subject: string;
  url: string; color: string; flag?: string;
}

const BOOKS: Book[] = [
  // Таджикские учебники с maorif.tj
  { id:'1', title:'Алгебра 8', author:'Алгебра 8-синф', subject:'Алгебра', url:'https://maorif.tj/index.php/kitobho/maktabi-miyona/sinfi-8', color:'#7EC8E3', flag:'🇹🇯' },
  { id:'2', title:'Геометрия 8', author:'Геометрия 8-синф', subject:'Геометрия', url:'https://maorif.tj/index.php/kitobho/maktabi-miyona/sinfi-8', color:'#A8D8E8', flag:'🇹🇯' },
  { id:'3', title:'Физика 8', author:'Физика 8-синф', subject:'Физика', url:'https://maorif.tj/index.php/kitobho/maktabi-miyona/sinfi-8', color:'#F9C784', flag:'🇹🇯' },
  { id:'4', title:'Химия 8', author:'Химия 8-синф', subject:'Химия', url:'https://maorif.tj/index.php/kitobho/maktabi-miyona/sinfi-8', color:'#A8D8A8', flag:'🇹🇯' },
  { id:'5', title:'Биология 8', author:'Биология 8-синф', subject:'Биология', url:'https://maorif.tj/index.php/kitobho/maktabi-miyona/sinfi-8', color:'#C8E6A8', flag:'🇹🇯' },
  { id:'6', title:'История 8', author:'История 8-синф', subject:'История', url:'https://maorif.tj/index.php/kitobho/maktabi-miyona/sinfi-8', color:'#F9C784', flag:'🇹🇯' },
  { id:'7', title:'Забони тоҷикӣ 8', author:'Забони тоҷикӣ 8-синф', subject:'Таджикский', url:'https://maorif.tj/index.php/kitobho/maktabi-miyona/sinfi-8', color:'#E8AADD', flag:'🇹🇯' },
  { id:'8', title:'Забони русӣ 8', author:'Забони русӣ 8-синф', subject:'Русский', url:'https://maorif.tj/index.php/kitobho/maktabi-miyona/sinfi-8', color:'#D8A8C8', flag:'🇹🇯' },
  { id:'9', title:'Ҷуғрофия 8', author:'Ҷуғрофия 8-синф', subject:'География', url:'https://maorif.tj/index.php/kitobho/maktabi-miyona/sinfi-8', color:'#A8D8D8', flag:'🇹🇯' },
  { id:'10', title:'Адабиёт 8', author:'Адабиёт 8-синф', subject:'Литература', url:'https://maorif.tj/index.php/kitobho/maktabi-miyona/sinfi-8', color:'#F9C8A8', flag:'🇹🇯' },
  { id:'11', title:'Технология 8', author:'Технология 8-синф', subject:'Технология', url:'https://maorif.tj/index.php/kitobho/maktabi-miyona/sinfi-8', color:'#F9A8C9', flag:'🇹🇯' },

  // English
  { id:'12', title:'Solutions (3rd Ed.) Intermediate', author:'Tim Falla, Paul A. Davies', subject:'Английский', url:'https://www.oxford-learnersdictionaries.com', color:'#FFD700', flag:'🇬🇧' },
  { id:'13', title:'Solutions (3rd Ed.) Pre-Int', author:'Tim Falla, Paul A. Davies', subject:'Английский', url:'https://www.oxford-learnersdictionaries.com', color:'#FFA500', flag:'🇬🇧' },

  // Mathematics Oxford
  { id:'14', title:'Complete Mathematics (Cambridge Secondary 3)', author:'Oxford University Press', subject:'Математика', url:'https://www.oxfordsecondary.com/9780198390084', color:'#7EC8E3', flag:'🇬🇧' },

  // ICT Oxford
  { id:'15', title:'Oxford Computing 8', author:'Alison Page', subject:'Информатика', url:'https://global.oup.com/education/product/9780198497813', color:'#56CCF2', flag:'🇬🇧' },

  // Oxford Science (replacement for Andarz books)
  { id:'16', title:'Oxford Science Physics 8', author:'Oxford University Press', subject:'Физика', url:'https://global.oup.com/education', color:'#F9C784', flag:'🇬🇧' },
  { id:'17', title:'Oxford Science Chemistry 8', author:'Oxford University Press', subject:'Химия', url:'https://global.oup.com/education', color:'#A8D8A8', flag:'🇬🇧' },
  { id:'18', title:'Oxford Science Biology 8', author:'Oxford University Press', subject:'Биология', url:'https://global.oup.com/education', color:'#C8E6A8', flag:'🇬🇧' },
];

const SUBJECTS = ['Все', ...Array.from(new Set(BOOKS.map(b => b.subject)))];

export function Library() {
  const [search, setSearch] = useState('');
  const [subject, setSubject] = useState('Все');

  const filtered = BOOKS.filter(b => {
    const matchSearch = b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase()) || b.subject.toLowerCase().includes(search.toLowerCase());
    const matchSubject = subject === 'Все' || b.subject === subject;
    return matchSearch && matchSubject;
  });

  return (
    <div style={{ padding: 32, minHeight: '100vh', background: '#f8faff' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <BookOpen size={24} color="#1E4FD8"/>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1a1a3e', margin: 0 }}>Библиотека</h1>
        <span style={{ fontSize: 12, color: '#94a3b8', background: '#e0e7ff', padding: '2px 10px', borderRadius: 20 }}>{BOOKS.length} книг</span>
      </div>

      {/* Search + Filter */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}/>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск книг..."
            style={{ width: '100%', paddingLeft: 38, paddingRight: 14, paddingTop: 10, paddingBottom: 10, borderRadius: 12, border: '2px solid #e0e7ff', outline: 'none', fontSize: 14, background: 'white', boxSizing: 'border-box' }}
            onFocus={e => e.target.style.borderColor = '#1E4FD8'} onBlur={e => e.target.style.borderColor = '#e0e7ff'}/>
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {SUBJECTS.map(s => (
            <button key={s} onClick={() => setSubject(s)} style={{
              padding: '8px 14px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600,
              background: subject === s ? 'linear-gradient(135deg,#1E4FD8,#6B84E8)' : 'white',
              color: subject === s ? 'white' : '#475569',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)', transition: 'all 0.15s',
            }}>{s}</button>
          ))}
        </div>
      </div>

      {/* Books grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
        {filtered.map(book => (
          <a key={book.id} href={book.url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
            <div style={{ background: 'white', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #f0f4ff', transition: 'all 0.2s', cursor: 'pointer' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(30,79,216,0.15)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'; }}>
              {/* Cover */}
              <div style={{ height: 140, background: book.color, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <BookOpen size={40} color="rgba(255,255,255,0.8)"/>
                <div style={{ position: 'absolute', top: 10, right: 10, fontSize: 20 }}>{book.flag}</div>
                <div style={{ position: 'absolute', bottom: 8, right: 8 }}>
                  <ExternalLink size={14} color="rgba(255,255,255,0.6)"/>
                </div>
              </div>
              {/* Info */}
              <div style={{ padding: '12px 14px' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a3e', lineHeight: 1.3, marginBottom: 4 }}>{book.title}</div>
                <div style={{ fontSize: 11, color: '#64748b', marginBottom: 8, lineHeight: 1.3 }}>{book.author}</div>
                <div style={{ display: 'inline-block', fontSize: 10, fontWeight: 600, color: '#1E4FD8', background: '#e0e7ff', padding: '2px 8px', borderRadius: 20 }}>{book.subject}</div>
              </div>
            </div>
          </a>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
          <BookOpen size={40} style={{ marginBottom: 12, opacity: 0.3 }}/>
          <p style={{ margin: 0 }}>Книг не найдено</p>
        </div>
      )}
    </div>
  );
}
