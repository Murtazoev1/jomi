import { useState } from 'react';
import { FileText, ClipboardCheck, Send, X } from 'lucide-react';
import {
  getClassesForTeacher,
  getTeachers,
  addHomework,
  getHomeworkForClass,
  deleteHomework,
} from '../data/db';

interface TeacherActionsProps {
  teacherId: string;
}

// --- ФОРМА СОЗДАНИЯ ДОМАШНЕГО ЗАДАНИЯ ---
function HomeworkForm({ teacherId, onBack }: { teacherId: string; onBack: () => void }) {
  const teacher = getTeachers().find((t) => t.id === teacherId);
  const classes = getClassesForTeacher(teacherId);

  const [classId, setClassId] = useState(classes[0]?.id ?? '');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [, forceUpdate] = useState(0);

  if (!teacher) return null;

  const existing = classId ? getHomeworkForClass(classId) : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!classId || !title.trim() || !dueDate) {
      alert('Заполните класс, название и срок сдачи');
      return;
    }
    addHomework({
      classId,
      subject: teacher.subject,
      teacherId: teacher.id,
      title: title.trim(),
      description: description.trim(),
      dueDate,
    });
    setTitle('');
    setDescription('');
    setDueDate('');
    forceUpdate((n) => n + 1);
  };

  const handleDelete = (id: string) => {
    deleteHomework(id);
    forceUpdate((n) => n + 1);
  };

  return (
    <div className="p-4 md:p-8">
      <button onClick={onBack} className="text-sm text-blue-600 font-bold mb-6">← Вернуться к действиям</button>
      <h1 className="text-2xl font-bold mb-6">Новое домашнее задание</h1>

      {classes.length === 0 ? (
        <p className="text-muted-foreground">У вас пока нет классов в расписании.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border p-6 space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium">Класс</label>
              <select
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-border outline-none focus:ring-2 focus:ring-primary"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">Название задания</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Например: §12, упражнения 3-5"
                className="w-full px-4 py-2 rounded-lg border border-border outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">Описание (необязательно)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-border outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">Срок сдачи</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-border outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Опубликовать задание
            </button>
          </form>

          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h2 className="font-semibold mb-4">Задания для этого класса</h2>
            {existing.length === 0 ? (
              <p className="text-sm text-muted-foreground">Пока ничего не задано.</p>
            ) : (
              <div className="space-y-3">
                {existing.map((hw) => (
                  <div key={hw.id} className="p-4 rounded-xl bg-muted/30 flex items-start justify-between gap-3">
                    <div>
                      <div className="font-medium">{hw.title}</div>
                      {hw.description && <div className="text-sm text-muted-foreground mt-1">{hw.description}</div>}
                      <div className="text-xs text-muted-foreground mt-2">
                        Срок: {new Date(hw.dueDate).toLocaleDateString('ru-RU')}
                      </div>
                    </div>
                    <button onClick={() => handleDelete(hw.id)} className="p-1 hover:bg-destructive/10 rounded-lg flex-shrink-0">
                      <X className="w-4 h-4 text-destructive" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// --- ГЛАВНЫЙ КОМПОНЕНТ УЧИТЕЛЯ ---
export function TeacherActions({ teacherId }: TeacherActionsProps) {
  const [view, setView] = useState<'menu' | 'homework'>('menu');
  const teacher = getTeachers().find((t) => t.id === teacherId);

  const quickActions = [
    { id: 'homework', title: 'Задать домашнее задание', description: 'Создать новое ДЗ для своего класса', icon: FileText, color: 'bg-blue-500' },
    { id: 'check', title: 'Проверить задания', description: 'Просмотреть и оценить домашние задания', icon: ClipboardCheck, color: 'bg-green-500' },
  ];

  const handleAction = (id: string) => {
    if (id === 'homework') setView('homework');
    if (id === 'check') alert('Проверка заданий появится вместе с реальной базой сдаваемых работ.');
  };

  if (view === 'homework') {
    return <HomeworkForm teacherId={teacherId} onBack={() => setView('menu')} />;
  }

  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-bold">Быстрые действия</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => handleAction(action.id)}
              className="bg-white rounded-2xl shadow-sm border p-6 hover:shadow-lg transition-all hover:scale-105 text-left group"
            >
              <div className={`${action.color} w-14 h-14 rounded-xl flex items-center justify-center mb-4`}>
                <Icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{action.title}</h3>
              <p className="text-sm text-muted-foreground">{action.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
