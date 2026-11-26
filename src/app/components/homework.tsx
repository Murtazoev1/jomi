import { useState } from 'react';
import { Calendar, Paperclip, CheckCircle2, Circle, Clock } from 'lucide-react';

interface Homework {
  id: string;
  subject: string;
  title: string;
  description: string;
  deadline: string;
  status: 'new' | 'in-progress' | 'completed';
  hasAttachment?: boolean;
}

const homeworkData: Homework[] = [
  {
    id: '1',
    subject: 'Алгебра',
    title: 'Решить задачи № 145-158',
    description: 'Линейные уравнения, страница 32',
    deadline: '2026-02-05',
    status: 'new',
  },
  {
    id: '2',
    subject: 'Русский язык',
    title: 'Написать сочинение',
    description: 'Тема: "Моя любимая книга". Объем: 150-200 слов',
    deadline: '2026-02-07',
    status: 'in-progress',
  },
  {
    id: '3',
    subject: 'Физика',
    title: 'Лабораторная работа',
    description: 'Измерение плотности вещества',
    deadline: '2026-02-06',
    status: 'new',
  },
  {
    id: '4',
    subject: 'Английский',
    title: 'Упражнения 3-6',
    description: 'Present Simple, workbook page 18',
    deadline: '2026-02-04',
    status: 'completed',
    hasAttachment: true,
  },
  {
    id: '5',
    subject: 'История',
    title: 'Подготовить презентацию',
    description: 'Тема: "Средневековые города"',
    deadline: '2026-02-08',
    status: 'in-progress',
  },
  {
    id: '6',
    subject: 'Химия',
    title: 'Выучить формулы',
    description: 'Простые вещества и их свойства',
    deadline: '2026-02-03',
    status: 'completed',
  },
];

export function Homework() {
  const [homework, setHomework] = useState(homeworkData);
  const [filter, setFilter] = useState<'all' | 'new' | 'in-progress' | 'finished'>('all');

  const filteredHomework = filter === 'all' 
    ? homework 
    : homework.filter(hw => hw.status === filter);

  const getStatusIcon = (status: Homework['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-blue-600" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusText = (status: Homework['status']) => {
    switch (status) {
      case 'completed':
        return 'Сдано';
      case 'in-progress':
        return 'В работе';
      default:
        return 'Новое';
    }
  };

  const getStatusColor = (status: Homework['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 text-green-700';
      case 'in-progress':
        return 'bg-blue-50 text-blue-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const today = new Date('2026-02-03');
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Просрочено';
    if (diffDays === 0) return 'Сегодня';
    if (diffDays === 1) return 'Завтра';
    return `Через ${diffDays} дн.`;
  };

  const changeStatus = (id: string) => {
    setHomework(homework.map(hw => {
      if (hw.id === id) {
        const statusOrder: Homework['status'][] = ['new', 'in-progress', 'completed'];
        const currentIndex = statusOrder.indexOf(hw.status);
        const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];
        return { ...hw, status: nextStatus };
      }
      return hw;
    }));
  };

  return (
    <div className="p-8">
      <h1 className="mb-6">Домашнее задание</h1>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
            filter === 'all'
              ? 'bg-primary text-white'
              : 'bg-white border border-border hover:border-primary'
          }`}
        >
          Все ({homework.length})
        </button>
        <button
          onClick={() => setFilter('new')}
          className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
            filter === 'new'
              ? 'bg-primary text-white'
              : 'bg-white border border-border hover:border-primary'
          }`}
        >
          Новые ({homework.filter(hw => hw.status === 'new').length})
        </button>
        <button
          onClick={() => setFilter('in-progress')}
          className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
            filter === 'in-progress'
              ? 'bg-primary text-white'
              : 'bg-white border border-border hover:border-primary'
          }`}
        >
          В работе ({homework.filter(hw => hw.status === 'in-progress').length})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
            filter === 'completed'
              ? 'bg-primary text-white'
              : 'bg-white border border-border hover:border-primary'
          }`}
        >
          Сдано ({homework.filter(hw => hw.status === 'completed').length})
        </button>
      </div>

      {/* Homework List */}
      <div className="grid gap-4 max-w-4xl">
        {filteredHomework.map((hw) => (
          <div
            key={hw.id}
            className="bg-white rounded-xl shadow-sm border border-border p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <button onClick={() => changeStatus(hw.id)}>
                    {getStatusIcon(hw.status)}
                  </button>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-primary">{hw.subject}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(hw.status)}`}>
                      {getStatusText(hw.status)}
                    </span>
                  </div>
                </div>
                
                <h4 className="mb-2">{hw.title}</h4>
                <p className="text-muted-foreground mb-3">{hw.description}</p>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDeadline(hw.deadline)}</span>
                  </div>
                  <div className={`font-medium ${
                    getDaysUntilDeadline(hw.deadline) === 'Сегодня' || 
                    getDaysUntilDeadline(hw.deadline) === 'Завтра'
                      ? 'text-destructive'
                      : ''
                  }`}>
                    {getDaysUntilDeadline(hw.deadline)}
                  </div>
                </div>
              </div>

              <button className="p-3 bg-accent/30 rounded-lg hover:bg-accent/50 transition-colors">
                <Paperclip className="w-5 h-5 text-accent-foreground" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredHomework.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Circle className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p>Нет заданий в этой категории</p>
        </div>
      )}
    </div>
  );
}