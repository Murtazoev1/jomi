import { useState } from 'react';
import { Plus, Trash2, Save, Key, Newspaper, Calendar, Users } from 'lucide-react';
import { getNewsList, addNews, deleteNews, getApiKey, setApiKey, getSchedule, saveSchedule, type ScheduleSlot, DAYS_ORDER } from '../data/db';

type AdminTab = 'news'|'schedule'|'apikey';

export function AdminPanel() {
  const [tab, setTab] = useState<AdminTab>('news');
  const tabs = [
    {id:'news' as AdminTab,label:'Новости',icon:Newspaper},
    {id:'schedule' as AdminTab,label:'Расписание',icon:Calendar},
    {id:'apikey' as AdminTab,label:'API ключ',icon:Key},
  ];
  return (
    <div style={{padding:32,minHeight:'100vh',background:'#f8faff'}}>
      <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:28}}>
        <div style={{width:44,height:44,borderRadius:12,background:'linear-gradient(135deg,#1A1A7E,#1E4FD8)',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <Users size={22} color="white"/>
        </div>
        <div>
          <h1 style={{fontSize:22,fontWeight:700,color:'#1a1a3e',margin:0}}>Панель администратора</h1>
          <p style={{fontSize:13,color:'#64748b',margin:0}}>Управление сайтом JOMI</p>
        </div>
      </div>
      <div style={{display:'flex',gap:8,marginBottom:24}}>
        {tabs.map(t=>{const Icon=t.icon;return(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{display:'flex',alignItems:'center',gap:8,padding:'10px 18px',borderRadius:12,border:'none',cursor:'pointer',fontSize:14,fontWeight:600,background:tab===t.id?'linear-gradient(135deg,#1E4FD8,#6B84E8)':'white',color:tab===t.id?'white':'#475569',boxShadow:tab===t.id?'0 4px 12px rgba(30,79,216,0.3)':'0 1px 4px rgba(0,0,0,0.06)',transition:'all 0.2s'}}>
            <Icon size={16}/>{t.label}
          </button>
        );})}
      </div>
      {tab==='news'&&<NewsAdmin/>}
      {tab==='schedule'&&<ScheduleAdmin/>}
      {tab==='apikey'&&<ApiKeyAdmin/>}
    </div>
  );
}

function NewsAdmin(){
  const [news,setNews]=useState(getNewsList);
  const [title,setTitle]=useState('');
  const [body,setBody]=useState('');
  const [saved,setSaved]=useState(false);
  const handleAdd=(e:React.FormEvent)=>{e.preventDefault();if(!title.trim()||!body.trim())return;addNews({title:title.trim(),body:body.trim(),author:'Администратор'});setNews(getNewsList());setTitle('');setBody('');setSaved(true);setTimeout(()=>setSaved(false),2000);};
  return(
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:24}}>
      <div style={{background:'white',borderRadius:16,padding:24,boxShadow:'0 2px 12px rgba(0,0,0,0.06)'}}>
        <h2 style={{fontSize:16,fontWeight:700,marginBottom:16,color:'#1a1a3e'}}>➕ Новая новость</h2>
        <form onSubmit={handleAdd} style={{display:'flex',flexDirection:'column',gap:12}}>
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Заголовок" style={{padding:'10px 14px',borderRadius:10,border:'2px solid #e0e7ff',outline:'none',fontSize:14}} onFocus={e=>e.target.style.borderColor='#1E4FD8'} onBlur={e=>e.target.style.borderColor='#e0e7ff'}/>
          <textarea value={body} onChange={e=>setBody(e.target.value)} placeholder="Текст новости..." rows={5} style={{padding:'10px 14px',borderRadius:10,border:'2px solid #e0e7ff',outline:'none',fontSize:14,resize:'vertical'}} onFocus={e=>e.target.style.borderColor='#1E4FD8'} onBlur={e=>e.target.style.borderColor='#e0e7ff'}/>
          <button type="submit" style={{padding:'12px',background:'linear-gradient(135deg,#1E4FD8,#6B84E8)',color:'white',border:'none',borderRadius:10,cursor:'pointer',fontWeight:600,fontSize:14,display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
            <Plus size={16}/>{saved?'✓ Опубликовано!':'Опубликовать'}
          </button>
        </form>
      </div>
      <div style={{background:'white',borderRadius:16,padding:24,boxShadow:'0 2px 12px rgba(0,0,0,0.06)',maxHeight:500,overflowY:'auto'}}>
        <h2 style={{fontSize:16,fontWeight:700,marginBottom:16,color:'#1a1a3e'}}>📰 Опубликованные ({news.length})</h2>
        {news.length===0&&<p style={{color:'#94a3b8',fontSize:14}}>Новостей пока нет.</p>}
        {news.map(n=>(
          <div key={n.id} style={{padding:'12px 14px',borderRadius:10,background:'#f8faff',marginBottom:10,display:'flex',gap:10,alignItems:'flex-start'}}>
            <div style={{flex:1}}>
              <div style={{fontWeight:600,fontSize:14,color:'#1a1a3e'}}>{n.title}</div>
              <div style={{fontSize:12,color:'#94a3b8',marginTop:4}}>{new Date(n.createdAt).toLocaleDateString('ru-RU')}</div>
            </div>
            <button onClick={()=>{deleteNews(n.id);setNews(getNewsList());}} style={{background:'none',border:'none',cursor:'pointer',color:'#ef4444',padding:4}}>
              <Trash2 size={16}/>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScheduleAdmin(){
  const [schedule,setSchedule]=useState(getSchedule);
  const [saved,setSaved]=useState(false);
  const updateSlot=(id:string,field:keyof ScheduleSlot,value:string)=>setSchedule(prev=>prev.map(s=>s.id===id?{...s,[field]:value}:s));
  const handleSave=()=>{saveSchedule(schedule);setSaved(true);setTimeout(()=>setSaved(false),2000);};
  const days=DAYS_ORDER.slice(0,5);
  return(
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
        <h2 style={{fontSize:16,fontWeight:700,color:'#1a1a3e'}}>Расписание 8-Г</h2>
        <button onClick={handleSave} style={{display:'flex',alignItems:'center',gap:8,padding:'10px 20px',background:'linear-gradient(135deg,#1E4FD8,#6B84E8)',color:'white',border:'none',borderRadius:10,cursor:'pointer',fontWeight:600}}>
          <Save size={15}/>{saved?'✓ Сохранено!':'Сохранить'}
        </button>
      </div>
      {days.map(day=>{
        const slots=schedule.filter(s=>s.day===day).sort((a,b)=>a.startTime.localeCompare(b.startTime));
        return(
          <div key={day} style={{background:'white',borderRadius:14,padding:20,marginBottom:16,boxShadow:'0 2px 8px rgba(0,0,0,0.05)'}}>
            <h3 style={{fontSize:14,fontWeight:700,color:'#1E4FD8',marginBottom:12}}>{day}</h3>
            {slots.map((slot,i)=>(
              <div key={slot.id} style={{display:'grid',gridTemplateColumns:'30px 85px 85px 1fr 1fr 70px',gap:6,alignItems:'center',marginBottom:6}}>
                <div style={{fontSize:12,color:'#94a3b8',textAlign:'center',fontWeight:700}}>{i+1}</div>
                <input value={slot.startTime} onChange={e=>updateSlot(slot.id,'startTime',e.target.value)} style={{padding:'6px 8px',borderRadius:8,border:'1px solid #e0e7ff',fontSize:12,outline:'none'}}/>
                <input value={slot.endTime} onChange={e=>updateSlot(slot.id,'endTime',e.target.value)} style={{padding:'6px 8px',borderRadius:8,border:'1px solid #e0e7ff',fontSize:12,outline:'none'}}/>
                <input value={slot.subject} onChange={e=>updateSlot(slot.id,'subject',e.target.value)} style={{padding:'6px 10px',borderRadius:8,border:'1px solid #e0e7ff',fontSize:12,outline:'none'}}/>
                <input value={(slot as any).teacher??''} onChange={e=>updateSlot(slot.id,'teacher' as any,e.target.value)} placeholder="Учитель" style={{padding:'6px 10px',borderRadius:8,border:'1px solid #e0e7ff',fontSize:12,outline:'none'}}/>
                <input value={slot.room} onChange={e=>updateSlot(slot.id,'room',e.target.value)} placeholder="Каб." style={{padding:'6px 8px',borderRadius:8,border:'1px solid #e0e7ff',fontSize:12,outline:'none'}}/>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

function ApiKeyAdmin(){
  const [key,setKey]=useState(getApiKey);
  const [saved,setSaved]=useState(false);
  const handleSave=()=>{setApiKey(key.trim());setSaved(true);setTimeout(()=>setSaved(false),2000);};
  return(
    <div style={{maxWidth:500}}>
      <div style={{background:'white',borderRadius:16,padding:28,boxShadow:'0 2px 12px rgba(0,0,0,0.06)'}}>
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:20}}>
          <div style={{width:40,height:40,borderRadius:10,background:'#f0f4ff',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <Key size={18} color="#1E4FD8"/>
          </div>
          <div>
            <h2 style={{fontSize:16,fontWeight:700,color:'#1a1a3e',margin:0}}>Google Gemini API ключ</h2>
            <p style={{fontSize:12,color:'#94a3b8',margin:0}}>Для работы JOMI AI</p>
          </div>
        </div>
        <p style={{fontSize:13,color:'#64748b',marginBottom:16,lineHeight:1.6}}>
          Получи ключ на <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" style={{color:'#1E4FD8'}}>aistudio.google.com</a>.<br/>
          Ключ сохраняется в браузере.
        </p>
        <input value={key} onChange={e=>setKey(e.target.value)} placeholder="AIzaSy..." style={{width:'100%',padding:'12px 14px',borderRadius:12,border:'2px solid #e0e7ff',outline:'none',fontSize:14,boxSizing:'border-box',marginBottom:12}} onFocus={e=>e.target.style.borderColor='#1E4FD8'} onBlur={e=>e.target.style.borderColor='#e0e7ff'}/>
        <button onClick={handleSave} style={{width:'100%',padding:12,background:'linear-gradient(135deg,#1E4FD8,#6B84E8)',color:'white',border:'none',borderRadius:12,cursor:'pointer',fontWeight:600,fontSize:14}}>
          {saved?'✓ Сохранено!':'Сохранить ключ'}
        </button>
        {key&&<div style={{marginTop:12,padding:'8px 12px',background:'#f0fff4',borderRadius:8,fontSize:12,color:'#16a34a'}}>✓ API ключ установлен</div>}
      </div>
    </div>
  );
}
