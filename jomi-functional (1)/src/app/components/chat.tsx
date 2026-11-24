import { useState } from 'react';
import { Send, Pin, MoreVertical } from 'lucide-react';

interface Message {
  id: string;
  sender: string;
  text: string;
  time: string;
  isOwn?: boolean;
}

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread?: number;
  isPinned?: boolean;
}

const chats: Chat[] = [
  {
    id: '1',
    name: 'Чат 7-Г Математика',
    lastMessage: 'Завтра контрольная работа!',
    time: '13:15',
    unread: 5,
    isPinned: true,
  },
  {
    id: '2',
    name: 'Мирзошо Одинаев',
    lastMessage: 'Мухаммадаюб, не забудьте сдать работу',
    time: '12:00',
  },
  {
    id: '3',
    name: 'Чат 7-Г Класс',
    lastMessage: 'В субботу поход в музей!',
    time: '10:30',
    unread: 12,
  },

];

const initialMessages: Message[] = [
  {
    id: '1',
    sender: 'Мирзошо Одинаев',
    text: 'Добрый день, класс! Напоминаю о контрольной работе завтра.',
    time: '10:00',
  },
  {
    id: '2',
    sender: 'Сино',
    text: 'По каким темам будет контрольная?',
    time: '10:05',
  },
  {
    id: '3',
    sender: 'Мирзошо Одинаев',
    text: 'Линейные уравнения и степени. Повторите параграфы 5-8.',
    time: '10:07',
  },
  {
    id: '4',
    sender: 'Розия',
    text: 'Можно использовать калькулятор?',
    time: '10:10',
  },
  {
    id: '5',
    sender: 'Мирзошо Одинаев',
    text:'Да, калькуляторы разрешены.',
    time: '10:12',
  },
];

export function Chat() {
  const [selectedChat, setSelectedChat] = useState<Chat>(chats[1]);
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageText.trim()) {
      const now = new Date();
      const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      const newMessage: Message = {
        id: Date.now().toString(),
        sender: 'Вы',
        text: messageText.trim(),
        time: timeString,
        isOwn: true,
      };
      
      setMessages([...messages, newMessage]);
      setMessageText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <div className="flex h-[calc(100vh-2rem)] m-4 bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
      {/* Chat List */}
      <div className="w-80 border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <h3>Чаты</h3>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className={`w-full p-4 text-left hover:bg-muted/50 transition-colors border-b border-border ${
                selectedChat.id === chat.id ? 'bg-accent/30' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-1">
                <div className="flex items-center gap-2">
                  {chat.isPinned && <Pin className="w-4 h-4 text-primary" />}
                  <div className="font-medium text-sm">{chat.name}</div>
                </div>
                <div className="text-xs text-muted-foreground">{chat.time}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground line-clamp-1 flex-1">
                  {chat.lastMessage}
                </div>
                {chat.unread && (
                  <div className="ml-2 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs">
                    {chat.unread}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-white">
          <div>
            <h3 className="mb-1">{selectedChat.name}</h3>
            <div className="text-sm text-muted-foreground">24 участника</div>
          </div>
          <button className="p-2 hover:bg-muted rounded-lg">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>

        {/* Pinned Message */}
        <div className="bg-accent/20 px-4 py-3 border-b border-border flex items-center gap-2">
          <Pin className="w-4 h-4 text-primary" />
          <div className="text-sm">
            <span className="font-medium">Важно:</span> Завтра контрольная работа по квадратным уравнениям!
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[70%] ${message.isOwn ? 'order-2' : 'order-1'}`}>
                {!message.isOwn && (
                  <div className="text-sm font-medium text-primary mb-1">
                    {message.sender}
                  </div>
                )}
                <div
                  className={`rounded-2xl px-4 py-2 ${
                    message.isOwn
                      ? 'bg-primary text-white rounded-br-sm'
                      : 'bg-white border border-border rounded-bl-sm'
                  }`}
                >
                  <div className="text-sm">{message.text}</div>
                  <div
                    className={`text-xs mt-1 ${
                      message.isOwn ? 'text-white/70' : 'text-muted-foreground'
                    }`}
                  >
                    {message.time}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-border bg-white">
          <div className="flex gap-2">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Написать сообщение..."
              className="flex-1 px-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              disabled={!messageText.trim()}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}