import { useState } from 'react';
import { Plus, Trash2, Save, Key, Newspaper, Calendar, Sparkles } from 'lucide-react';
import { getNewsList, addNews, deleteNews, getApiKey, setApiKey, getSchedule, saveSchedule, type ScheduleSlot, DAYS_ORDER } from '../data/db';
import { THEMES, setTheme, getTheme, type ThemeId } from '../data/theme';

interface AdminPanelProps { currentPage: string; }

export function AdminPanel({ currentPage }: AdminPanelProps) {
  if (currentPage === 'admin-news') return <NewsAdmin/>;
  if (currentPage === 'admin-schedule') return <ScheduleAdmin/>;
  if (currentPage === 'admin-theme') return <ThemeAdmin/>;
  if (currentPage === 'admin-apikey') return <ApiKeyAdmin/>;
  return <NewsAdmin/>;
}

function PageHeader({ title, subtitle, icon }: { title: string; subtitle: string; icon: React.ReactNode }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:28 }}>
      <div style={{ width:44, height:44, borderRadius:12, background:'linear-gradient(135deg,#1A1A7E,#1E4FD8)', display:'flex', alignItems:'center', justifyContent:'center' }}>
        {icon}
      </div>
      <div>
        <h1 style={{ fontSize:22, fontWeight:700, color:'#1a1a3e', margin:0 }}>{title}</h1>
        <p style={{ fontSize:13, color:'#64748b', margin:0 }}>{subtitle}</p>
      </div>
    </div>
  );
}

function NewsAdmin() {
  const [news, setNews] = useState(getNewsList);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [saved, setSaved] = useState(false);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    addNews({ title: title.trim(), body: body.trim(), author: 'Администратор' });
    setNews(getNewsList());
    setTitle(''); setBody('');
    setSaved(true); setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ padding:32, minHeight:'100vh', background:'#f8faff' }}>
      <PageHeader title="Управление новостями" subtitle="Публикуйте и удаляйте новости школы" icon={<Newspaper size={22} color="white"/>}/>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }}>
        <div style={{ background:'white', borderRadius:16, padding:24, boxShadow:'0 2px 12px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize:16, fontWeight:700, marginBottom:16, color:'#1a1a3e' }}>➕ Новая новость</h2>
          <form onSubmit={handleAdd} style={{ display:'flex', flexDirection:'column', gap:12 }}>
            <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Заголовок"
              style={{ padding:'10px 14px', borderRadius:10, border:'2px solid #e0e7ff', outline:'none', fontSize:14 }}
              onFocus={e=>e.target.style.borderColor='#1E4FD8'} onBlur={e=>e.target.style.borderColor='#e0e7ff'}/>
            <textarea value={body} onChange={e=>setBody(e.target.value)} placeholder="Текст новости..." rows={5}
              style={{ padding:'10px 14px', borderRadius:10, border:'2px solid #e0e7ff', outline:'none', fontSize:14, resize:'vertical' }}
              onFocus={e=>e.target.style.borderColor='#1E4FD8'} onBlur={e=>e.target.style.borderColor='#e0e7ff'}/>
            <button type="submit" style={{ padding:'12px', background:'linear-gradient(135deg,#1E4FD8,#6B84E8)', color:'white', border:'none', borderRadius:10, cursor:'pointer', fontWeight:600, fontSize:14, display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
              <Plus size={16}/>{saved?'✓ Опубликовано!':'Опубликовать'}
            </button>
          </form>
        </div>
        <div style={{ background:'white', borderRadius:16, padding:24, boxShadow:'0 2px 12px rgba(0,0,0,0.06)', maxHeight:500, overflowY:'auto' }}>
          <h2 style={{ fontSize:16, fontWeight:700, marginBottom:16, color:'#1a1a3e' }}>📰 Опубликованные ({news.length})</h2>
          {news.length===0 && <p style={{ color:'#94a3b8', fontSize:14 }}>Новостей пока нет.</p>}
          {news.map(n=>(
            <div key={n.id} style={{ padding:'12px 14px', borderRadius:10, background:'#f8faff', marginBottom:10, display:'flex', gap:10, alignItems:'flex-start' }}>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:600, fontSize:14, color:'#1a1a3e' }}>{n.title}</div>
                <div style={{ fontSize:12, color:'#94a3b8', marginTop:4 }}>{new Date(n.createdAt).toLocaleDateString('ru-RU')}</div>
              </div>
              <button onClick={()=>{deleteNews(n.id);setNews(getNewsList());}} style={{ background:'none', border:'none', cursor:'pointer', color:'#ef4444', padding:4 }}>
                <Trash2 size={16}/>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ScheduleAdmin() {
  const [schedule, setSchedule] = useState(getSchedule);
  const [saved, setSaved] = useState(false);
  const updateSlot = (id: string, field: keyof ScheduleSlot, value: string) =>
    setSchedule(prev => prev.map(s => s.id===id ? {...s,[field]:value} : s));
  const handleSave = () => { saveSchedule(schedule); setSaved(true); setTimeout(()=>setSaved(false),2000); };

  return (
    <div style={{ padding:32, background:'#f8faff', minHeight:'100vh' }}>
      <PageHeader title="Расписание 8-Г" subtitle="Редактируйте расписание уроков" icon={<Calendar size={22} color="white"/>}/>
      <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:16 }}>
        <button onClick={handleSave} style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 24px', background:'linear-gradient(135deg,#1E4FD8,#6B84E8)', color:'white', border:'none', borderRadius:10, cursor:'pointer', fontWeight:600, fontSize:14 }}>
          <Save size={15}/>{saved?'✓ Сохранено!':'Сохранить изменения'}
        </button>
      </div>
      {DAYS_ORDER.slice(0,5).map(day=>{
        const slots=schedule.filter(s=>s.day===day).sort((a,b)=>a.startTime.localeCompare(b.startTime));
        return(
          <div key={day} style={{ background:'white', borderRadius:14, padding:20, marginBottom:16, boxShadow:'0 2px 8px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize:14, fontWeight:700, color:'#1E4FD8', marginBottom:12 }}>{day}</h3>
            {slots.map((slot,i)=>(
              <div key={slot.id} style={{ display:'grid', gridTemplateColumns:'30px 85px 85px 1fr 1fr 70px', gap:6, alignItems:'center', marginBottom:6 }}>
                <div style={{ fontSize:12, color:'#94a3b8', textAlign:'center', fontWeight:700 }}>{i+1}</div>
                <input value={slot.startTime} onChange={e=>updateSlot(slot.id,'startTime',e.target.value)} style={{ padding:'6px 8px', borderRadius:8, border:'1px solid #e0e7ff', fontSize:12, outline:'none' }}/>
                <input value={slot.endTime} onChange={e=>updateSlot(slot.id,'endTime',e.target.value)} style={{ padding:'6px 8px', borderRadius:8, border:'1px solid #e0e7ff', fontSize:12, outline:'none' }}/>
                <input value={slot.subject} onChange={e=>updateSlot(slot.id,'subject',e.target.value)} style={{ padding:'6px 10px', borderRadius:8, border:'1px solid #e0e7ff', fontSize:12, outline:'none' }}/>
                <input value={(slot as any).teacher??''} onChange={e=>updateSlot(slot.id,'teacher' as any,e.target.value)} placeholder="Учитель" style={{ padding:'6px 10px', borderRadius:8, border:'1px solid #e0e7ff', fontSize:12, outline:'none' }}/>
                <input value={slot.room} onChange={e=>updateSlot(slot.id,'room',e.target.value)} placeholder="Каб." style={{ padding:'6px 8px', borderRadius:8, border:'1px solid #e0e7ff', fontSize:12, outline:'none' }}/>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

function ThemeAdmin() {
  const [current, setCurrent] = useState(getTheme().id);

  const handleChange = (id: ThemeId) => {
    setCurrent(id);
    setTheme(id);
  };

  return (
    <div style={{ padding:32, background:'#f8faff', minHeight:'100vh' }}>
      <PageHeader title="Тема сайта" subtitle="Выберите сезонную тему оформления" icon={<Sparkles size={22} color="white"/>}/>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px,1fr))', gap:20 }}>
        {Object.values(THEMES).map(theme=>{
          const active = current === theme.id;
          return(
            <div key={theme.id} onClick={()=>handleChange(theme.id as ThemeId)} style={{
              background:'white', borderRadius:20, overflow:'hidden', cursor:'pointer',
              border: active ? `3px solid ${theme.primary}` : '3px solid transparent',
              boxShadow: active ? `0 8px 24px ${theme.primary}44` : '0 2px 8px rgba(0,0,0,0.06)',
              transition:'all 0.2s', transform: active ? 'scale(1.02)' : 'scale(1)',
            }}>
              {/* Preview */}
              <div style={{ height:100, background:`linear-gradient(135deg,${theme.sidebarFrom},${theme.sidebarTo})`, display:'flex', alignItems:'center', justifyContent:'center', position:'relative' }}>
                <svg width={70} height={70} viewBox="207 169 665 640">
                  <circle cx="529" cy="341" r="171" fill={theme.c1}/>
                  <circle cx="377" cy="496" r="170" fill={theme.c2}/>
                  <circle cx="527" cy="637" r="171" fill={theme.c3}/>
                  <circle cx="700" cy="497" r="171" fill={theme.c4}/>
                </svg>
                {active && <div style={{ position:'absolute', top:10, right:10, background:'white', borderRadius:'50%', width:24, height:24, display:'flex', alignItems:'center', justifyContent:'center', color:theme.primary, fontWeight:700, fontSize:14 }}>✓</div>}
              </div>
              <div style={{ padding:'14px 16px' }}>
                <div style={{ fontSize:16, fontWeight:700, color:'#1a1a3e' }}>{theme.emoji} {theme.name}</div>
                <div style={{ fontSize:12, color:'#94a3b8', marginTop:2 }}>Сезон: {theme.season}</div>
                <div style={{ marginTop:10, display:'flex', gap:6 }}>
                  {[theme.c1,theme.c2,theme.c3,theme.c4].map((c,i)=>(
                    <div key={i} style={{ width:20, height:20, borderRadius:'50%', background:c }}/>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ApiKeyAdmin() {
  const [key, setKey] = useState(getApiKey);
  const [saved, setSaved] = useState(false);
  const handleSave = () => { setApiKey(key.trim()); setSaved(true); setTimeout(()=>setSaved(false),2000); };

  return (
    <div style={{ padding:32, background:'#f8faff', minHeight:'100vh' }}>
      <PageHeader title="API ключ JOMI AI" subtitle="Только администратор может менять ключ" icon={<Key size={22} color="white"/>}/>
      <div style={{ maxWidth:500 }}>
        <div style={{ background:'white', borderRadius:16, padding:28, boxShadow:'0 2px 12px rgba(0,0,0,0.06)' }}>
          <p style={{ fontSize:13, color:'#64748b', marginBottom:16, lineHeight:1.6 }}>
            Получи ключ на <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" style={{ color:'#1E4FD8' }}>aistudio.google.com</a>.<br/>
            Или используй FreeLLMAPI — пришли ключ в чат.
          </p>
          <input value={key} onChange={e=>setKey(e.target.value)} placeholder="AIzaSy... или sk-..."
            style={{ width:'100%', padding:'12px 14px', borderRadius:12, border:'2px solid #e0e7ff', outline:'none', fontSize:14, boxSizing:'border-box', marginBottom:12 }}
            onFocus={e=>e.target.style.borderColor='#1E4FD8'} onBlur={e=>e.target.style.borderColor='#e0e7ff'}/>
          <button onClick={handleSave} style={{ width:'100%', padding:12, background:'linear-gradient(135deg,#1E4FD8,#6B84E8)', color:'white', border:'none', borderRadius:12, cursor:'pointer', fontWeight:600, fontSize:14 }}>
            {saved?'✓ Сохранено!':'Сохранить ключ'}
          </button>
          {key && <div style={{ marginTop:12, padding:'8px 12px', background:'#f0fff4', borderRadius:8, fontSize:12, color:'#16a34a' }}>✓ API ключ установлен</div>}
        </div>
      </div>
    </div>
  );
}
