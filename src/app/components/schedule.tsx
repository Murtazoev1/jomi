import { useState } from 'react';
import { Clock, X } from 'lucide-react';

interface Lesson {
  id: string;
  subject: string;
  time: string;
  topic?: string;
}

interface DaySchedule {
  day: string;
  lessons: Lesson[];
}

const schedule: DaySchedule[] = [
  {
    day: 'Понедельник',
    lessons: [
      { id: '1', subject: 'Олимпиада', time: '08:00-08:45' },
      { id: '2', subject: 'Олимпиада', time: '08:55-09:40' },
      { id: '3', subject: 'Алгебра', time: '10:30-11:15' },
      { id: '4', subject: 'Английский', time: '11:25-12:10' },
      { id: '5', subject: 'Физика', time: '12:20-13:45' },
      { id: '6', subject: 'Физ-ра', time: '13:55-14:35' },
      { id: '7', subject: 'Биология', time: '14:45-15:25' },
    ],
  },
  {
    day: 'Вторник',
    lessons: [
      { id: '8', subject: 'Олимпиада', time: '08:00-08:45' },
      { id: '9', subject: 'Олимпиада', time: '08:55-09:40' },
      { id: '10', subject: 'Олимпиада', time: '10:30-11:15' },
      { id: '11', subject: 'Олимпиада', time: '11:25-12:10' },
      { id: '12', subject: 'З. русӣ', time: '12:20-13:45' },
      { id: '13', subject: 'География', time: '13:55-14:35' },
      { id: '14', subject: 'Химия', time: '14:45-15:25' },
    ],
  },
  {
    day: 'Среда',
    lessons: [
      { id: '15', subject: 'Олимпиада', time: '08:00-08:45' },
      { id: '16', subject: 'Английский', time: '08:55-09:40' },
      { id: '17', subject: 'Химия', time: '10:30-11:15' },
      { id: '18', subject: 'Олимпиада', time: '11:25-12:10' },
      { id: '19', subject: 'Алгебра', time: '12:20-13:45' },
      { id: '20', subject: 'Т. ум.', time: '13:55-14:35' },
      { id: '21', subject: 'Т. хт.', time: '14:45-15:25' },
    ],
  },
  {
    day: 'Четверг',
    lessons: [
      { id: '22', subject: 'Олимпиада', time: '08:00-08:45' },
      { id: '23', subject: 'Олимпиада', time: '08:55-09:40' },
      { id: '24', subject: 'Олимпиада', time: '10:30-11:15' },
      { id: '25', subject: 'Олимпиада', time: '11:25-12:10' },
      { id: '26', subject: 'Т. итт.', time: '12:20-13:45' },
      { id: '27', subject: 'Физика', time: '13:55-14:35' },
      { id: '28', subject: 'З. модарӣ', time: '14:45-15:25' },
    ],
  },
  {
    day: 'Пятница',
    lessons: [
      { id: '29', subject: 'Олимпиада', time: '08:00-08:45' },
      { id: '30', subject: 'Олимпиада', time: '08:55-09:40' },
      { id: '31', subject: 'Олимпиада', time: '10:30-11:15' },
      { id: '32', subject: 'Олимпиада', time: '11:25-12:10' },
      { id: '33', subject: 'Адабиёт', time: '12:20-13:45' },
      { id: '34', subject: 'Биология', time: '13:55-14:35' },
      { id: '35', subject: 'Геометрия', time: '14:45-15:25' },
    ],
  },
];

export function Schedule() {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  return (
    <div className="p-8">
      <h1 className="mb-6">Расписание</h1>

      <div className="space-y-6">
        {schedule.map((daySchedule) => (
          <div key={daySchedule.day} className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
            <div className="bg-primary text-white px-6 py-4">
              <h3>{daySchedule.day}</h3>
            </div>
            
            <div className="p-6">
              <div className="space-y-3">
                {daySchedule.lessons.map((lesson) => (
                  <button
                    key={lesson.id}
                    onClick={() => setSelectedLesson(lesson)}
                    className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-muted/50 transition-colors text-left"
                  >
                    <div className="w-32 text-muted-foreground flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{lesson.time}</span>
                    </div>
                    
                    <div className="flex-1">
                      <div className="font-medium">{lesson.subject}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lesson Details Modal */}
      {selectedLesson && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3>{selectedLesson.subject}</h3>
              <button
                onClick={() => setSelectedLesson(null)}
                className="p-2 hover:bg-muted rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Clock className="w-5 h-5" />
                <span>{selectedLesson.time}</span>
              </div>

              {selectedLesson.topic && (
                <div className="mt-6 p-4 bg-accent/30 rounded-xl">
                  <div className="text-sm text-muted-foreground mb-1">Тема занятия:</div>
                  <div className="font-medium">{selectedLesson.topic}</div>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedLesson(null)}
              className="w-full mt-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
}