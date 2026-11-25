import { useState, useEffect, useRef } from 'react';
import { Send, Hash } from 'lucide-react';
import { getChatMessages, sendChatMessage, loadSession, getStudents, getTeachers, type ChatMessage } from '../data/db';

const CHANNELS = [
  { id: 'class-8g',      label: 'Чат 8-Г',              description: 'Общий чат класса' },
  { id: 'math-8g',       label: 'Математика',            description: 'Чат с учителем математики' },
  { id: 'biology-8g',    label: 'Биология',              description: 'Чат с учителем биологии' },
  { id: 'physics-8g',    label: 'Физика',                description: 'Чат с учителем физики' },
  { id: 'english-8g',    label: 'Английский',            description: 'Чат с учителем английского' },
  { id: 'chemistry-8g',  label: 'Химия',                 description: 'Чат с учителем химии' },
  { id: 'history-8g',    label: 'История',               description: 'Чат с учителем истории' },
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
    ? students.find((s) => s.id === session.studentId)
    : teachers.find((t) => t.id === (session as any)?.teacherId);

  const myId = session?.role === 'student' ? session.studentId : (session as any)?.teacherId ?? '';
  const myName = me
    ? (session?.role === 'student' ? (me as any).name : (me as any).fullName)
    : 'Вы';

  useEffect(() => {
    const load = () => setMessages(getChatMessages(activeChannel));
    load();
    const interval = setInterval(load, 2000);
    return () => clearInterval(interval);
  }, [activeChannel]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !session) return;
    sendChatMessage({ senderId: myId, senderName: myName, role: session.role, classId: activeChannel, text: text.trim() });
    setText('');
    setMessages(getChatMessages(activeChannel));
  };

  const formatTime = (iso: string) => new Date(iso).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  const formatDate = (iso: string) => new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });

  const grouped: { date: string; msgs: ChatMessage[] }[] = [];
  for (const msg of messages) {
    const date = formatDate(msg.timestamp);
    const last = grouped[grouped.length - 1];
    if (last && last.date === date) last.msgs.push(msg);
    else grouped.push({ date, msgs: [msg] });
  }

  const channel = CHANNELS.find((c) => c.id === activeChannel)!;

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f0f4ff' }}>
      {/* Channel list */}
      <div style={{ width: 220, background: '#1a1a2e', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ color: 'white', fontWeight: 700, fontSize: '14px' }}>Каналы</div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginTop: 2 }}>Класс 8-Г</div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
          {CHANNELS.map((ch) => (
            <button
              key={ch.id}
              onClick={() => setActiveChannel(ch.id)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                padding: '9px 10px', borderRadius: 8, border: 'none', cursor: 'pointer',
                background: activeChannel === ch.id ? '#38B6FF22' : 'transparent',
                color: activeChannel === ch.id ? '#38B6FF' : 'rgba(255,255,255,0.7)',
                fontSize: 13, textAlign: 'left', marginBottom: 2, transition: 'all 0.15s',
                fontWeight: activeChannel === ch.id ? 600 : 400,
              }}
            >
              <Hash size={14} style={{ flexShrink: 0 }} />
              <span>{ch.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ padding: '14px 20px', background: 'white', borderBottom: '1px solid #e0e7ff', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Hash size={18} color="#1E4FD8" />
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#1a1a2e' }}>{channel.label}</div>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>{channel.description}</div>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
          {messages.length === 0 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <div style={{ textAlign: 'center' }}>
                <Hash size={40} color="#c7d2fe" />
                <p style={{ color: '#94a3b8', marginTop: 8, fontSize: 14 }}>Нет сообщений. Начните общение!</p>
              </div>
            </div>
          )}
          {grouped.map((group) => (
            <div key={group.date}>
              <div style={{ display: 'flex', justifyContent: 'center', margin: '12px 0' }}>
                <span style={{ background: 'rgba(30,79,216,0.1)', color: '#1E4FD8', fontSize: 11, padding: '3px 12px', borderRadius: 20 }}>{group.date}</span>
              </div>
              {group.msgs.map((msg) => {
                const isMe = msg.senderId === myId;
                return (
                  <div key={msg.id} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start', marginBottom: 10 }}>
                    {!isMe && (
                      <div style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0, background: msg.role === 'teacher' ? '#1E4FD8' : '#6B84E8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12, fontWeight: 'bold', marginRight: 8, marginTop: 2 }}>
                        {msg.senderName.charAt(0)}
                      </div>
                    )}
                    <div style={{ maxWidth: '70%' }}>
                      {!isMe && <div style={{ fontSize: 11, color: '#6B84E8', marginBottom: 2, fontWeight: 600 }}>{msg.role === 'teacher' ? '👨‍🏫 ' : ''}{msg.senderName}</div>}
                      <div style={{ padding: '10px 14px', borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px', background: isMe ? 'linear-gradient(135deg, #1E4FD8, #4F6FFF)' : 'white', color: isMe ? 'white' : '#1a1a2e', fontSize: 14, lineHeight: 1.5, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
                        {msg.text}
                      </div>
                      <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2, textAlign: isMe ? 'right' : 'left' }}>{formatTime(msg.timestamp)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSend} style={{ padding: '12px 16px', display: 'flex', gap: 10, background: 'white', borderTop: '1px solid #e0e7ff', alignItems: 'center' }}>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`Написать в #${channel.label}...`}
            style={{ flex: 1, padding: '12px 16px', borderRadius: 20, border: '2px solid #e0e7ff', outline: 'none', fontSize: 14, background: '#f8faff', transition: 'border-color 0.2s' }}
            onFocus={(e) => e.target.style.borderColor = '#1E4FD8'}
            onBlur={(e) => e.target.style.borderColor = '#e0e7ff'}
          />
          <button type="submit" disabled={!text.trim()} style={{ width: 44, height: 44, borderRadius: '50%', border: 'none', background: text.trim() ? 'linear-gradient(135deg, #1E4FD8, #4F6FFF)' : '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: text.trim() ? 'pointer' : 'default', transition: 'all 0.2s' }}>
            <Send size={16} color={text.trim() ? 'white' : '#94a3b8'} />
          </button>
        </form>
      </div>
    </div>
  );
}
