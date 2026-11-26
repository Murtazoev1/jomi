import { Clock, MapPin } from 'lucide-react';

interface DashboardProps {
  userName: string;
}

export function Dashboard({ userName }: DashboardProps) {
  const nextLesson = {
    subject: 'Алгебра',
    room: '506',
    startTime: '10:00',
    breakEndsIn: '5 минут'
  };

  const currentDate = new Date();
  const dateString = currentDate.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="mb-2">Привет, {userName}!</h1>
        <p className="text-muted-foreground">Сегодня {dateString}</p>
      </div>

      {/* Next Lesson Widget */}
      <div className="bg-white rounded-2xl shadow-sm border border-border p-6 max-w-2xl">
        <h3 className="mb-4">Следующий урок</h3>
        
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="mb-4">
              <div className="text-2xl font-semibold mb-1">{nextLesson.subject}</div>
              <div className="text-muted-foreground">Начало в {nextLesson.startTime}</div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>Кабинет {nextLesson.room}</span>
              </div>
              <div className="flex items-center gap-2 text-primary">
                <Clock className="w-4 h-4" />
                <span>Перемена заканчивается через {nextLesson.breakEndsIn}</span>
              </div>
            </div>
          </div>

          <div className="w-24 h-24 bg-accent/30 rounded-full flex items-center justify-center">
            <span className="text-3xl">📚</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 mt-8 max-w-2xl">
        <div className="bg-white rounded-xl shadow-sm border border-border p-4">
          <div className="text-muted-foreground mb-1">Домашних заданий</div>
          <div className="text-2xl font-semibold text-primary">3</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-border p-4">
          <div className="text-muted-foreground mb-1">Непрочитанных</div>
          <div className="text-2xl font-semibold text-primary">12</div>
        </div>
      </div>
    </div>
  );
}