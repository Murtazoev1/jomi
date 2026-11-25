import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, X } from 'lucide-react';

interface AiMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

const GEMINI_KEY = 'AIzaSyAb8RN6I_gafwzhiWD1JyrK35khaFfKraML9lBnkvU9TeV5x6-w';

async function askGemini(messages: AiMessage[]): Promise<string> {
  const contents = messages.map((m) => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: m.text }],
  }));

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: 'Ты JOMI AI — умный помощник для школьников. Объясняй темы понятно, кратко и дружелюбно. Отвечай на языке, на котором задан вопрос (русский или таджикский). Если спрашивают про математику, физику или другие школьные предметы — объясняй с примерами.' }],
        },
        contents,
        generationConfig: { maxOutputTokens: 1024, temperature: 0.7 },
      }),
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message ?? `HTTP ${res.status}`);
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? 'Нет ответа';
}

function BubbleCircles({ size = 36 }: { size?: number }) {
  const r = size * 0.33;
  const c = size / 2;
  const off = size * 0.17;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={c - off} cy={c - off} r={r} fill="#6B84E8" opacity="0.9" />
      <circle cx={c + off} cy={c - off} r={r} fill="#56CCF2" opacity="0.9" />
      <circle cx={c - off} cy={c + off} r={r} fill="#1E4FD8" opacity="0.9" />
      <circle cx={c + off} cy={c + off} r={r} fill="#1A1A7E" opacity="0.9" />
    </svg>
  );
}

export function JomiAI() {
  const [messages, setMessages] = useState<AiMessage[]>([
    { id: 'welcome', role: 'assistant', text: 'Привет! Я JOMI AI 🤖\nЗадай мне любой вопрос по школьным предметам — объясню понятно!' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    setError('');

    const userMsg: AiMessage = { id: `u-${Date.now()}`, role: 'user', text: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const reply = await askGemini(newMessages);
      setMessages((prev) => [...prev, { id: `a-${Date.now()}`, role: 'assistant', text: reply }]);
    } catch (err: any) {
      setError('Ошибка: ' + (err.message ?? 'Не удалось получить ответ'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen" style={{ background: '#f0f4ff' }}>
      {/* Header */}
      <div className="px-6 py-4 shadow-sm flex items-center gap-3" style={{ background: 'linear-gradient(135deg, #1A1A7E, #6B84E8)' }}>
        <BubbleCircles size={40} />
        <div>
          <div style={{ color: 'white', fontFamily: 'Scripter, cursive', fontSize: '22px', letterSpacing: '1px' }}>JOMI AI</div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', letterSpacing: '1px' }}>Твой умный помощник</div>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <Sparkles size={20} color="rgba(255,255,255,0.6)" />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'} gap-2`}>
              {!isUser && (
                <div style={{ flexShrink: 0, marginTop: 2 }}>
                  <BubbleCircles size={32} />
                </div>
              )}
              <div
                style={{
                  maxWidth: '78%',
                  padding: '12px 16px',
                  borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  background: isUser ? 'linear-gradient(135deg, #1E4FD8, #6B84E8)' : 'white',
                  color: isUser ? 'white' : '#1a1a2e',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {msg.text}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex justify-start gap-2">
            <div style={{ flexShrink: 0, marginTop: 2 }}><BubbleCircles size={32} /></div>
            <div style={{ background: 'white', borderRadius: '18px 18px 18px 4px', padding: '12px 18px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <div className="flex gap-1 items-center">
                {[0, 1, 2].map((i) => (
                  <div key={i} style={{
                    width: 8, height: 8, borderRadius: '50%', background: '#6B84E8',
                    animation: `bounce 1.2s ${i * 0.2}s infinite`,
                  }} />
                ))}
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-center">
            <div style={{ background: '#fff0f0', border: '1px solid #fed7d7', color: '#e53e3e', padding: '8px 16px', borderRadius: '12px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <X size={14} /> {error}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="px-4 py-3 flex gap-2 items-center" style={{ background: 'white', borderTop: '1px solid #e0e7ff' }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Задай вопрос по любому предмету..."
          className="flex-1 px-4 py-3 rounded-2xl outline-none text-sm"
          style={{ background: '#f0f4ff', border: '2px solid transparent', transition: 'border-color 0.2s' }}
          onFocus={(e) => e.target.style.borderColor = '#6B84E8'}
          onBlur={(e) => e.target.style.borderColor = 'transparent'}
          disabled={loading}
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          style={{
            width: 46, height: 46, borderRadius: '50%', border: 'none',
            background: input.trim() && !loading ? 'linear-gradient(135deg, #1E4FD8, #6B84E8)' : '#e0e7ff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: input.trim() && !loading ? 'pointer' : 'default', transition: 'all 0.2s',
          }}
        >
          <Send size={18} color={input.trim() && !loading ? 'white' : '#94a3b8'} />
        </button>
      </form>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}
