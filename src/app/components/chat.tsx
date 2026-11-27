import { useState, useEffect, useRef } from 'react';
import { Send, Hash } from 'lucide-react';
import { getChatMessages, sendChatMessage, loadSession, getStudents, getTeachers, markRead, type ChatMessage } from '../data/db';

const CLASS_ID = 'class-8g';

const CHANNELS = [
  { id: 'Чат 8-Г',              label: 'Чат 8-Г',              desc: 'Общий чат класса' },
  { id: 'Алгебра',              label: 'Алгебра',              desc: 'Чат 8-Г + Алгебра' },
  { id: 'Геометрия',            label: 'Геометрия',            desc: 'Чат 8-Г + Геометрия' },
  { id: 'Забони англисӣ',       label: 'Забони англисӣ',       desc: 'Чат 8-Г + Английский' },
  { id: 'Биология',             label: 'Биология',             desc: 'Чат 8-Г + Биология' },
  { id: 'Физика',               label: 'Физика',               desc: 'Чат 8-Г + Физика' },
  { id: 'Химия',                label: 'Химия',                desc: 'Чат 8-Г + Химия' },
  { id: 'Таърихи халқи тоҷик',  label: 'Таърихи халқи тоҷик', desc: 'Чат 8-Г + Таърихи халқи тоҷик' },
  { id: 'Таърихи умумӣ',        label: 'Таърихи умумӣ',        desc: 'Чат 8-Г + Таърихи умумӣ' },
  { id: 'Забони тоҷикӣ',        label: 'Забони тоҷикӣ',        desc: 'Чат 8-Г + Таджикский' },
  { id: 'Адабиёт',              label: 'Адабиёт',              desc: 'Чат 8-Г + Адабиёт' },
  { id: 'Забони русӣ',          label: 'Забони русӣ',          desc: 'Чат 8-Г + Русский' },
  { id: 'Информатика',          label: 'Информатика',          desc: 'Чат 8-Г + Информатика' },
  { id: 'Физ-ра',               label: 'Физ-ра',               desc: 'Чат 8-Г + Физ-ра' },
  { id: 'Ҷуғрофия',             label: 'Ҷуғрофия',             desc: 'Чат 8-Г + География' },
];

export function Chat() {
  const session = loadSession();
  const students = getStudents();
  const teachers = getTeachers();
  const [activeChannel, setActiveChannel] = useState(CHANNELS[0].id);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const me = session?.role === 'student'
    ? students.find(s => s.id === (session as any).studentId)
    : session?.role === 'teacher'
    ? teachers.find(t => t.id === (session as any).teacherId)
    : null;
  const myId = session?.role === 'student' ? (session as any).studentId
    : session?.role === 'teacher' ? (session as any).teacherId : 'admin';
  const myName = session?.role === 'admin' ? 'Администратор'
    : me ? (session?.role === 'student' ? (me as any).name : (me as any).fullName) : 'Вы';
  const myRole = session?.role ?? 'student';

  useEffect(() => {
    const load = () => {
      setMessages(getChatMessages(CLASS_ID, activeChannel));
    };
    load();
    const readKey = `chat-${myId}-${activeChannel}`;
    markRead(readKey);
    const interval = setInterval(() => { load(); markRead(readKey); }, 2000);
    return () => clearInterval(interval);
  }, [activeChannel, myId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    sendChatMessage({ senderId: myId, senderName: myName, role: myRole as any, classId: CLASS_ID, channel: activeChannel, text: text.trim() });
    setText('');
    setMessages(getChatMessages(CLASS_ID, activeChannel));
    markRead(`chat-${myId}-${activeChannel}`);
  };

  const channel = CHANNELS.find(c => c.id === activeChannel)!;
  const formatTime = (iso: string) => new Date(iso).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f0f4ff' }}>
      {/* Channel list */}
      <div style={{ width: 200, background: 'white', borderRight: '1px solid #e0e7ff', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '16px 14px 10px', borderBottom: '1px solid #e0e7ff' }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: '#1A1A7E' }}>Каналы</div>
          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>Класс 8-Г</div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 6px' }}>
          {CHANNELS.map(ch => (
            <button key={ch.id} onClick={() => setActiveChannel(ch.id)} style={{
              width: '100%', textAlign: 'left', padding: '8px 10px', borderRadius: 8,
              border: 'none', cursor: 'pointer', fontSize: 13,
              background: activeChannel === ch.id ? '#e0e7ff' : 'transparent',
              color: activeChannel === ch.id ? '#1E4FD8' : '#475569',
              fontWeight: activeChannel === ch.id ? 600 : 400,
              display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2,
              transition: 'all 0.15s',
            }}>
              <Hash size={13} style={{ flexShrink: 0 }} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ch.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '14px 20px', background: 'white', borderBottom: '1px solid #e0e7ff', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Hash size={18} color="#1E4FD8" />
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: '#1a1a3e' }}>{channel.label}</div>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>{channel.desc}</div>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {messages.length === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, color: '#94a3b8' }}>
              <Hash size={40} style={{ marginBottom: 8, opacity: 0.3 }} />
              <div style={{ fontSize: 14 }}>Нет сообщений. Начните общение!</div>
            </div>
          )}
          {messages.map(msg => {
            const isMe = msg.senderId === myId;
            return (
              <div key={msg.id} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start', gap: 8 }}>
                {!isMe && (
                  <div style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0, marginTop: 2,
                    background: msg.role === 'teacher' ? '#1E4FD8' : msg.role === 'admin' ? '#1A1A7E' : '#6B84E8',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12, fontWeight: 700 }}>
                    {msg.senderName.charAt(0)}
                  </div>
                )}
                <div style={{ maxWidth: '70%' }}>
                  {!isMe && (
                    <div style={{ fontSize: 11, color: '#6B84E8', marginBottom: 2, fontWeight: 600 }}>
                      {msg.role === 'teacher' ? '👨‍🏫 ' : msg.role === 'admin' ? '⚙️ ' : ''}{msg.senderName}
                    </div>
                  )}
                  <div style={{
                    padding: '10px 14px', borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    background: isMe ? 'linear-gradient(135deg,#1E4FD8,#6B84E8)' : 'white',
                    color: isMe ? 'white' : '#1a1a2e', fontSize: 14, lineHeight: 1.5,
                    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                  }}>{msg.text}</div>
                  <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2, textAlign: isMe ? 'right' : 'left' }}>{formatTime(msg.timestamp)}</div>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={handleSend} style={{ padding: '12px 16px', background: 'white', borderTop: '1px solid #e0e7ff', display: 'flex', gap: 10, alignItems: 'center' }}>
          <input value={text} onChange={e => setText(e.target.value)}
            placeholder={`Написать в #${activeChannel}...`}
            style={{ flex: 1, padding: '12px 16px', borderRadius: 24, border: '2px solid #e0e7ff', outline: 'none', fontSize: 14, background: '#f8faff', transition: 'border-color 0.2s' }}
            onFocus={e => e.target.style.borderColor = '#1E4FD8'}
            onBlur={e => e.target.style.borderColor = '#e0e7ff'}
          />
          <button type="submit" disabled={!text.trim()} style={{
            width: 44, height: 44, borderRadius: '50%', border: 'none', cursor: text.trim() ? 'pointer' : 'default',
            background: text.trim() ? 'linear-gradient(135deg,#1E4FD8,#6B84E8)' : '#e0e7ff',
            display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
          }}>
            <Send size={16} color={text.trim() ? 'white' : '#94a3b8'} />
          </button>
        </form>
      </div>
    </div>
  );
}
