import { useState, useRef, useEffect } from 'react';
import { Send, FileText, GraduationCap, ClipboardList, X } from 'lucide-react';
import { getApiKey } from '../data/db';

interface Message { id: string; role: 'user'|'assistant'; text: string; }

type WorkType = 'classwork'|'homework'|'exam'|'test'|null;

function BubbleCircles({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="207 169 665 640" xmlns="http://www.w3.org/2000/svg">
      <circle cx="529" cy="341" r="171" fill="#4F6FFF"/>
      <circle cx="377" cy="496" r="170" fill="#004BAD"/>
      <circle cx="527" cy="637" r="171" fill="#1A00A8"/>
      <circle cx="700" cy="497" r="171" fill="#38B6FF"/>
    </svg>
  );
}

const TEACHER_PROMPT = 'Ты помощник учителя математики в таджикской школе. Создавай задания, тесты, экзамены и классные работы на русском языке (если не просят иначе). Форматируй задания красиво с нумерацией. Для тестов давай варианты ответов А, Б, В, Г. Для экзаменов указывай баллы за каждое задание.';

async function askGemini(messages: Message[], apiKey: string): Promise<string> {
  // FreeLLMAPI / OpenAI-compatible
  if (apiKey.startsWith('sk-') || apiKey.startsWith('fllm-') || apiKey.startsWith('fre-') || apiKey.length > 60) {
    const res = await fetch('https://api.freellmapi.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: 'auto',
        messages: [
          { role: 'system', content: TEACHER_PROMPT },
          ...messages.map(m => ({ role: m.role, content: m.text })),
        ],
        max_tokens: 2000, temperature: 0.7,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error?.message ?? `HTTP ${res.status}`);
    return data.choices?.[0]?.message?.content ?? 'Нет ответа';
  }

  // Gemini
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        system_instruction:{parts:[{text:TEACHER_PROMPT}]},
        contents: messages.map(m=>({role:m.role==='user'?'user':'model',parts:[{text:m.text}]})),
        generationConfig:{maxOutputTokens:2000,temperature:0.7},
      }),
    }
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message??`HTTP ${res.status}`);
  return data.candidates?.[0]?.content?.parts?.[0]?.text??'Нет ответа';
}

export function TeacherAI() {
  const [workType, setWorkType] = useState<WorkType>(null);
  const [topic, setTopic] = useState('');
  const [material, setMaterial] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'choose'|'configure'|'chat'>('choose');
  const bottomRef = useRef<HTMLDivElement>(null);

  const apiKey = getApiKey();

  useEffect(() => { bottomRef.current?.scrollIntoView({behavior:'smooth'}); }, [messages, loading]);

  const workTypes = [
    { id:'classwork' as WorkType, label:'Классная работа', icon:<FileText size={20}/>, color:'#1E4FD8', desc:'Упражнения для урока' },
    { id:'homework' as WorkType, label:'Домашнее задание', icon:<ClipboardList size={20}/>, color:'#059669', desc:'Задание на дом' },
    { id:'test' as WorkType, label:'Тест', icon:<GraduationCap size={20}/>, color:'#D97706', desc:'Тест с вариантами ответов' },
    { id:'exam' as WorkType, label:'Экзамен / Контрольная', icon:<FileText size={20}/>, color:'#DC2626', desc:'Итоговая проверочная работа' },
  ];

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    if (!apiKey) { setError('Сначала установите API ключ в панели администратора'); return; }

    const typeLabel = workTypes.find(w=>w.id===workType)?.label??'Задание';
    const prompt = `Создай ${typeLabel} по теме: "${topic}"${material ? `\n\nДополнительные материалы/требования:\n${material}` : ''}\n\nСделай задание подходящим для 8 класса.`;

    const userMsg: Message = { id:`u-${Date.now()}`, role:'user', text: prompt };
    setMessages([userMsg]);
    setStep('chat');
    setLoading(true);
    setError('');

    try {
      const reply = await askGemini([userMsg], apiKey);
      setMessages([userMsg, { id:`a-${Date.now()}`, role:'assistant', text:reply }]);
    } catch(err:any) {
      setError('Ошибка: ' + (err.message??''));
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()||loading||!apiKey) return;
    setError('');
    const userMsg: Message = { id:`u-${Date.now()}`, role:'user', text:input.trim() };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInput('');
    setLoading(true);
    try {
      const reply = await askGemini(newMsgs, apiKey);
      setMessages(prev=>[...prev,{id:`a-${Date.now()}`,role:'assistant',text:reply}]);
    } catch(err:any) {
      setError('Ошибка: '+(err.message??''));
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setStep('choose'); setWorkType(null); setTopic(''); setMaterial(''); setMessages([]); setError(''); };

  if (step === 'choose') {
    return (
      <div style={{ padding:32, minHeight:'100vh', background:'#f8faff' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:28 }}>
          <BubbleCircles size={40}/>
          <div>
            <h1 style={{ fontSize:22, fontWeight:700, color:'#1a1a3e', margin:0 }}>ИИ Помощник Учителя</h1>
            <p style={{ fontSize:13, color:'#64748b', margin:0 }}>Создавайте задания, тесты и экзамены с помощью ИИ</p>
          </div>
        </div>

        {!apiKey && (
          <div style={{ background:'#fff7ed', border:'1px solid #fed7aa', borderRadius:12, padding:'12px 16px', marginBottom:20, fontSize:13, color:'#92400e' }}>
            ⚠️ API ключ не установлен. Попросите администратора добавить ключ в панели управления.
          </div>
        )}

        <h2 style={{ fontSize:16, fontWeight:600, color:'#475569', marginBottom:16 }}>Выберите тип работы:</h2>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px,1fr))', gap:16, maxWidth:800 }}>
          {workTypes.map(wt=>(
            <button key={wt.id as string} onClick={()=>{ setWorkType(wt.id); setStep('configure'); }}
              style={{ background:'white', border:`2px solid ${wt.color}22`, borderRadius:16, padding:'20px', cursor:'pointer', textAlign:'left', transition:'all 0.2s', boxShadow:'0 2px 8px rgba(0,0,0,0.05)' }}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.boxShadow=`0 8px 24px ${wt.color}33`;(e.currentTarget as HTMLElement).style.transform='translateY(-2px)';}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.boxShadow='0 2px 8px rgba(0,0,0,0.05)';(e.currentTarget as HTMLElement).style.transform='translateY(0)';}}>
              <div style={{ width:44,height:44,borderRadius:12,background:wt.color,display:'flex',alignItems:'center',justifyContent:'center',color:'white',marginBottom:12 }}>
                {wt.icon}
              </div>
              <div style={{ fontWeight:700, fontSize:15, color:'#1a1a3e', marginBottom:4 }}>{wt.label}</div>
              <div style={{ fontSize:12, color:'#94a3b8' }}>{wt.desc}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (step === 'configure') {
    const wt = workTypes.find(w=>w.id===workType)!;
    return (
      <div style={{ padding:32, minHeight:'100vh', background:'#f8faff' }}>
        <button onClick={reset} style={{ background:'none',border:'none',cursor:'pointer',color:'#1E4FD8',fontSize:14,fontWeight:600,marginBottom:20,display:'flex',alignItems:'center',gap:6 }}>
          ← Назад
        </button>
        <div style={{ maxWidth:600 }}>
          <div style={{ display:'flex',alignItems:'center',gap:12,marginBottom:24 }}>
            <div style={{ width:44,height:44,borderRadius:12,background:wt.color,display:'flex',alignItems:'center',justifyContent:'center',color:'white' }}>{wt.icon}</div>
            <h1 style={{ fontSize:20,fontWeight:700,color:'#1a1a3e',margin:0 }}>Создать: {wt.label}</h1>
          </div>
          <div style={{ background:'white',borderRadius:16,padding:28,boxShadow:'0 2px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ marginBottom:16 }}>
              <label style={{ display:'block',fontSize:13,fontWeight:600,color:'#1a1a3e',marginBottom:6 }}>Тема *</label>
              <input value={topic} onChange={e=>setTopic(e.target.value)} placeholder="Например: Линейные уравнения с двумя неизвестными"
                style={{ width:'100%',padding:'12px 14px',borderRadius:12,border:'2px solid #e0e7ff',outline:'none',fontSize:14,boxSizing:'border-box' }}
                onFocus={e=>e.target.style.borderColor='#1E4FD8'} onBlur={e=>e.target.style.borderColor='#e0e7ff'}/>
            </div>
            <div style={{ marginBottom:20 }}>
              <label style={{ display:'block',fontSize:13,fontWeight:600,color:'#1a1a3e',marginBottom:6 }}>Дополнительные материалы / требования (необязательно)</label>
              <textarea value={material} onChange={e=>setMaterial(e.target.value)} rows={4}
                placeholder="Укажите формулы, параграф из учебника, количество заданий, уровень сложности..."
                style={{ width:'100%',padding:'12px 14px',borderRadius:12,border:'2px solid #e0e7ff',outline:'none',fontSize:14,resize:'vertical',boxSizing:'border-box' }}
                onFocus={e=>e.target.style.borderColor='#1E4FD8'} onBlur={e=>e.target.style.borderColor='#e0e7ff'}/>
            </div>
            <button onClick={handleGenerate} disabled={!topic.trim()} style={{
              width:'100%',padding:14,background:topic.trim()?`linear-gradient(135deg,${wt.color},${wt.color}99)`:'#e0e7ff',
              color:topic.trim()?'white':'#94a3b8',border:'none',borderRadius:12,cursor:topic.trim()?'pointer':'default',fontWeight:700,fontSize:15,
            }}>
              ✨ Создать с помощью ИИ
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Chat step
  return (
    <div style={{ display:'flex',flexDirection:'column',height:'100vh',background:'#f0f4ff' }}>
      <div style={{ padding:'14px 20px',background:'linear-gradient(135deg,#1A1A7E,#6B84E8)',display:'flex',alignItems:'center',gap:12 }}>
        <BubbleCircles size={32}/>
        <div style={{ flex:1 }}>
          <div style={{ color:'white',fontWeight:700,fontSize:16 }}>ИИ Помощник • {workTypes.find(w=>w.id===workType)?.label}</div>
          <div style={{ color:'rgba(255,255,255,0.7)',fontSize:11 }}>Тема: {topic}</div>
        </div>
        <button onClick={reset} style={{ background:'rgba(255,255,255,0.15)',border:'none',borderRadius:8,padding:'6px 12px',color:'white',cursor:'pointer',fontSize:12 }}>
          Новое задание
        </button>
      </div>

      <div style={{ flex:1,overflowY:'auto',padding:'16px 20px',display:'flex',flexDirection:'column',gap:12 }}>
        {messages.map(msg=>{
          const isUser=msg.role==='user';
          return(
            <div key={msg.id} style={{ display:'flex',justifyContent:isUser?'flex-end':'flex-start',gap:8 }}>
              {!isUser&&<div style={{ flexShrink:0,marginTop:2 }}><BubbleCircles size={28}/></div>}
              <div style={{
                maxWidth:'80%',padding:'12px 16px',
                borderRadius:isUser?'18px 18px 4px 18px':'18px 18px 18px 4px',
                background:isUser?'linear-gradient(135deg,#1E4FD8,#6B84E8)':'white',
                color:isUser?'white':'#1a1a2e',fontSize:14,lineHeight:1.6,
                boxShadow:'0 2px 8px rgba(0,0,0,0.08)',whiteSpace:'pre-wrap',
              }}>{msg.text}</div>
            </div>
          );
        })}
        {loading&&(
          <div style={{ display:'flex',gap:8 }}>
            <div style={{ flexShrink:0 }}><BubbleCircles size={28}/></div>
            <div style={{ background:'white',borderRadius:'18px 18px 18px 4px',padding:'14px 18px',boxShadow:'0 2px 8px rgba(0,0,0,0.08)' }}>
              <div style={{ display:'flex',gap:4 }}>
                {[0,1,2].map(i=><div key={i} style={{ width:8,height:8,borderRadius:'50%',background:'#6B84E8',animation:`bounce 1.2s ${i*0.2}s infinite` }}/>)}
              </div>
            </div>
          </div>
        )}
        {error&&(
          <div style={{ display:'flex',justifyContent:'center' }}>
            <div style={{ background:'#fff0f0',border:'1px solid #fed7d7',color:'#e53e3e',padding:'8px 16px',borderRadius:12,fontSize:13,display:'flex',alignItems:'center',gap:6 }}>
              <X size={14}/>{error}
            </div>
          </div>
        )}
        <div ref={bottomRef}/>
      </div>

      <form onSubmit={handleSend} style={{ padding:'12px 16px',background:'white',borderTop:'1px solid #e0e7ff',display:'flex',gap:10,alignItems:'center' }}>
        <input value={input} onChange={e=>setInput(e.target.value)} disabled={loading}
          placeholder="Измените задание, добавьте вопросы, попросите подсказки..."
          style={{ flex:1,padding:'12px 16px',borderRadius:24,border:'2px solid #e0e7ff',outline:'none',fontSize:14,background:'#f8faff' }}
          onFocus={e=>e.target.style.borderColor='#6B84E8'} onBlur={e=>e.target.style.borderColor='#e0e7ff'}/>
        <button type="submit" disabled={!input.trim()||loading} style={{
          width:44,height:44,borderRadius:'50%',border:'none',
          background:input.trim()&&!loading?'linear-gradient(135deg,#1E4FD8,#6B84E8)':'#e0e7ff',
          display:'flex',alignItems:'center',justifyContent:'center',cursor:input.trim()&&!loading?'pointer':'default',
        }}>
          <Send size={16} color={input.trim()&&!loading?'white':'#94a3b8'}/>
        </button>
      </form>
      <style>{`@keyframes bounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-6px)}}`}</style>
    </div>
  );
}
