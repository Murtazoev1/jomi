import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, X, Key } from 'lucide-react';
import { getApiKey, setApiKey } from '../data/db';

interface AiMessage { id: string; role: 'user'|'assistant'; text: string; }

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

async function askGemini(messages: AiMessage[], apiKey: string): Promise<string> {
  const contents = messages.map(m => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: m.text }],
  }));
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: 'Ты JOMI AI — умный помощник для школьников 8 класса. Объясняй темы понятно, кратко и дружелюбно. Отвечай на языке вопроса (русский или таджикский). Для математики, физики и других предметов давай пошаговые объяснения с примерами.' }] },
        contents,
        generationConfig: { maxOutputTokens: 1500, temperature: 0.7 },
      }),
    }
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message ?? `HTTP ${res.status}`);
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? 'Нет ответа';
}

export function JomiAI() {
  const [apiKey, setApiKeyState] = useState(getApiKey);
  const [showKeyInput, setShowKeyInput] = useState(!getApiKey());
  const [keyInput, setKeyInput] = useState('');
  const [messages, setMessages] = useState<AiMessage[]>([
    { id: 'welcome', role: 'assistant', text: 'Привет! Я JOMI AI 🤖\nЗадай мне любой вопрос по школьным предметам — объясню понятно!' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  const saveKey = () => {
    if (!keyInput.trim()) return;
    setApiKey(keyInput.trim());
    setApiKeyState(keyInput.trim());
    setShowKeyInput(false);
    setKeyInput('');
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    if (!apiKey) { setShowKeyInput(true); return; }
    setError('');
    const userMsg: AiMessage = { id: `u-${Date.now()}`, role: 'user', text: input.trim() };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInput('');
    setLoading(true);
    try {
      const reply = await askGemini(newMsgs, apiKey);
      setMessages(prev => [...prev, { id: `a-${Date.now()}`, role: 'assistant', text: reply }]);
    } catch (err: any) {
      const msg = err.message ?? '';
      if (msg.includes('API key not valid') || msg.includes('API_KEY_INVALID')) {
        setError('Неверный API ключ. Введите новый ключ.');
        setShowKeyInput(true);
      } else {
        setError('Ошибка: ' + msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#f0f4ff' }}>
      {/* Header */}
      <div style={{ padding: '14px 20px', background: 'linear-gradient(135deg,#1A1A7E,#6B84E8)', display: 'flex', alignItems: 'center', gap: 12 }}>
        <BubbleCircles size={36} />
        <div style={{ flex: 1 }}>
          <div style={{ color: 'white', fontFamily: 'Scripter, cursive', fontSize: 20, letterSpacing: 1 }}>JOMI AI</div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>Твой умный помощник</div>
        </div>
        <button onClick={() => setShowKeyInput(true)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
          <Key size={13} /> API ключ
        </button>
      </div>

      {/* Key input modal */}
      {showKeyInput && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,10,46,0.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', borderRadius: 20, padding: 32, maxWidth: 440, width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <BubbleCircles size={32} />
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a3e' }}>Введите API ключ Gemini</h2>
            </div>
            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 16, lineHeight: 1.6 }}>
              Получи ключ на <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" style={{ color: '#1E4FD8' }}>aistudio.google.com</a><br/>
              Ключ сохраняется только в твоём браузере.
            </p>
            <input
              value={keyInput}
              onChange={e => setKeyInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && saveKey()}
              placeholder="AIzaSy..."
              style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '2px solid #e0e7ff', outline: 'none', fontSize: 13, boxSizing: 'border-box', marginBottom: 12 }}
              autoFocus
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={saveKey} style={{ flex: 1, padding: 12, background: 'linear-gradient(135deg,#1E4FD8,#6B84E8)', color: 'white', border: 'none', borderRadius: 12, cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>
                Сохранить
              </button>
              {apiKey && (
                <button onClick={() => setShowKeyInput(false)} style={{ padding: '12px 20px', background: '#f0f4ff', color: '#64748b', border: 'none', borderRadius: 12, cursor: 'pointer' }}>
                  Отмена
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages.map(msg => {
          const isUser = msg.role === 'user';
          return (
            <div key={msg.id} style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', gap: 8 }}>
              {!isUser && <div style={{ flexShrink: 0, marginTop: 2 }}><BubbleCircles size={30} /></div>}
              <div style={{
                maxWidth: '78%', padding: '12px 16px',
                borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                background: isUser ? 'linear-gradient(135deg,#1E4FD8,#6B84E8)' : 'white',
                color: isUser ? 'white' : '#1a1a2e', fontSize: 14, lineHeight: 1.6,
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)', whiteSpace: 'pre-wrap',
              }}>{msg.text}</div>
            </div>
          );
        })}
        {loading && (
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ flexShrink: 0 }}><BubbleCircles size={30} /></div>
            <div style={{ background: 'white', borderRadius: '18px 18px 18px 4px', padding: '14px 18px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <div style={{ display: 'flex', gap: 4 }}>
                {[0,1,2].map(i=><div key={i} style={{ width:8,height:8,borderRadius:'50%',background:'#6B84E8',animation:`bounce 1.2s ${i*0.2}s infinite` }}/>)}
              </div>
            </div>
          </div>
        )}
        {error && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ background: '#fff0f0', border: '1px solid #fed7d7', color: '#e53e3e', padding: '8px 16px', borderRadius: 12, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
              <X size={14}/> {error}
            </div>
          </div>
        )}
        <div ref={bottomRef}/>
      </div>

      {/* Input */}
      <form onSubmit={handleSend} style={{ padding: '12px 16px', background: 'white', borderTop: '1px solid #e0e7ff', display: 'flex', gap: 10, alignItems: 'center' }}>
        <input value={input} onChange={e=>setInput(e.target.value)} disabled={loading}
          placeholder={apiKey ? 'Задай вопрос по любому предмету...' : 'Сначала введите API ключ →'}
          style={{ flex:1,padding:'12px 16px',borderRadius:24,border:'2px solid #e0e7ff',outline:'none',fontSize:14,background:'#f8faff',transition:'border-color 0.2s' }}
          onFocus={e=>e.target.style.borderColor='#6B84E8'}
          onBlur={e=>e.target.style.borderColor='#e0e7ff'}
        />
        <button type="submit" disabled={!input.trim()||loading} style={{
          width:44,height:44,borderRadius:'50%',border:'none',
          background:input.trim()&&!loading?'linear-gradient(135deg,#1E4FD8,#6B84E8)':'#e0e7ff',
          display:'flex',alignItems:'center',justifyContent:'center',cursor:input.trim()&&!loading?'pointer':'default',transition:'all 0.2s',
        }}>
          <Send size={16} color={input.trim()&&!loading?'white':'#94a3b8'}/>
        </button>
      </form>
      <style>{`@keyframes bounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-6px)}}`}</style>
    </div>
  );
}
