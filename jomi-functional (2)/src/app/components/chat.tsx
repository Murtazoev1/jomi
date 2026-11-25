import { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import { getChatMessages, sendChatMessage, loadSession, getStudents, getTeachers, type ChatMessage } from '../data/db';

const CLASS_ID = 'class-8g';

export function Chat() {
  const session = loadSession();
  const students = getStudents();
  const teachers = getTeachers();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  // Определяем кто мы
  const me = session?.role === 'student'
    ? students.find((s) => s.id === session.studentId)
    : teachers.find((t) => t.id === (session as any)?.teacherId);

  const myId = session?.role === 'student' ? session.studentId : (session as any)?.teacherId ?? '';
  const myName = me ? (session?.role === 'student' ? (me as any).name : (me as any).fullName) : 'Вы';

  // Автоматически обновляем чат каждые 2 секунды (имитация real-time через localStorage)
  useEffect(() => {
    const load = () => setMessages(getChatMessages(CLASS_ID));
    load();
    const interval = setInterval(load, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !session) return;
    sendChatMessage({
      senderId: myId,
      senderName: myName,
      role: session.role,
      classId: CLASS_ID,
      text: text.trim(),
    });
    setText('');
    setMessages(getChatMessages(CLASS_ID));
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
  };

  // Группируем сообщения по дате
  const grouped: { date: string; msgs: ChatMessage[] }[] = [];
  for (const msg of messages) {
    const date = formatDate(msg.timestamp);
    const last = grouped[grouped.length - 1];
    if (last && last.date === date) last.msgs.push(msg);
    else grouped.push({ date, msgs: [msg] });
  }

  return (
    <div className="flex flex-col h-screen" style={{ background: '#f0f4ff' }}>
      {/* Header */}
      <div className="px-6 py-4 shadow-sm flex items-center gap-3" style={{ background: 'linear-gradient(135deg, #1A1A7E, #1E4FD8)' }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: 'white', fontWeight: 'bold', fontSize: '16px' }}>8Г</span>
        </div>
        <div>
          <div style={{ color: 'white', fontWeight: '600', fontSize: '16px' }}>Чат класса 8-Г</div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>
            {session?.role === 'teacher' ? 'Учитель' : 'Ученик'} · {myName}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p style={{ color: '#94a3b8', fontSize: '14px' }}>Сообщений пока нет. Начните общение!</p>
          </div>
        )}

        {grouped.map((group) => (
          <div key={group.date}>
            <div className="flex justify-center my-4">
              <span style={{ background: 'rgba(30,79,216,0.1)', color: '#1E4FD8', fontSize: '11px', padding: '3px 12px', borderRadius: '20px' }}>
                {group.date}
              </span>
            </div>
            {group.msgs.map((msg) => {
              const isMe = msg.senderId === myId;
              return (
                <div key={msg.id} className={`flex mb-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
                  {!isMe && (
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                      background: msg.role === 'teacher' ? '#1E4FD8' : '#6B84E8',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontSize: '12px', fontWeight: 'bold', marginRight: '8px', marginTop: '2px',
                    }}>
                      {msg.senderName.charAt(0)}
                    </div>
                  )}
                  <div style={{ maxWidth: '70%' }}>
                    {!isMe && (
                      <div style={{ fontSize: '11px', color: '#6B84E8', marginBottom: '2px', fontWeight: '600' }}>
                        {msg.role === 'teacher' ? '👨‍🏫 ' : ''}{msg.senderName}
                      </div>
                    )}
                    <div style={{
                      padding: '10px 14px',
                      borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                      background: isMe
                        ? 'linear-gradient(135deg, #1E4FD8, #6B84E8)'
                        : 'white',
                      color: isMe ? 'white' : '#1a1a2e',
                      fontSize: '14px',
                      lineHeight: '1.5',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                    }}>
                      {msg.text}
                    </div>
                    <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px', textAlign: isMe ? 'right' : 'left' }}>
                      {formatTime(msg.timestamp)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="px-4 py-3 flex gap-2 items-center" style={{ background: 'white', borderTop: '1px solid #e0e7ff' }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Написать сообщение..."
          className="flex-1 px-4 py-3 rounded-2xl outline-none text-sm"
          style={{ background: '#f0f4ff', border: '2px solid transparent', transition: 'border-color 0.2s' }}
          onFocus={(e) => e.target.style.borderColor = '#1E4FD8'}
          onBlur={(e) => e.target.style.borderColor = 'transparent'}
        />
        <button
          type="submit"
          disabled={!text.trim()}
          style={{
            width: 46, height: 46, borderRadius: '50%', border: 'none',
            background: text.trim() ? 'linear-gradient(135deg, #1E4FD8, #6B84E8)' : '#e0e7ff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: text.trim() ? 'pointer' : 'default', transition: 'all 0.2s',
          }}
        >
          <Send size={18} color={text.trim() ? 'white' : '#94a3b8'} />
        </button>
      </form>
    </div>
  );
}
