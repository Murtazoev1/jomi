import { useEffect, useState } from 'react';
import { Users, BookOpen, ClipboardCheck, TrendingUp, Clock } from 'lucide-react';
import {
  getScheduleForTeacher,
  getClassesForTeacher,
  getStudentsByClassId,
  getTeachers,
  getClasses,
  findNextLesson,
  formatMinutesUntil,
  DAYS_ORDER,
  type DayOfWeek,
} from '../data/db';

interface TeacherDashboardProps {
  teacherId: string;
}

export function TeacherDashboard({ teacherId }: TeacherDashboardProps) {
  const [now, setNow] = useState(new Date());

  // Обновляем "через сколько" раз в минуту, чтобы отсчёт был живым
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(interval);
  }, []);

  const teacher = getTeachers().find((t) => t.id === teacherId);
  const schedule = getScheduleForTeacher(teacherId);
  const classes = getClassesForTeacher(teacherId);
  const totalStudents = classes.reduce((sum, c) => sum + getStudentsByClassId(c.id).length, 0);

  const next = findNextLesson(schedule, now);

  const todayName = DAYS_ORDER[(now.getDay() + 6) % 7] as DayOfWeek | undefined;
  const todaySchedule = schedule
    .filter((s) => s.day === todayName)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const currentDate = now.toLocaleDateString('ru-RU', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const stats = [
    { label: 'Всего классов', value: String(classes.length), icon: Users, color: 'bg-blue-500' },
    { label: 'Всего учеников', value: String(totalStudents), icon: Users, color: 'bg-green-500' },
    { label: 'Уроков в неделе', value: String(schedule.length), icon: ClipboardCheck, color: 'bg-purple-500' },
    { label: 'Предмет', value: teacher?.subject ?? '—', icon: TrendingUp, color: 'bg-orange-500' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="mb-2">Здравствуйте, {teacher?.fullName}</h1>
        <p className="text-muted-foreground capitalize">{currentDate}</p>
      </div>

      {/* Следующий урок */}
      {next ? (
        <div className="bg-primary text-white rounded-2xl shadow-sm p-6 mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 text-white/80 text-sm mb-1">
              <Clock className="w-4 h-4" />
              <span>{next.isToday ? 'Следующий урок сегодня' : `Следующий урок (${next.slot.day})`}</span>
            </div>
            <div className="text-xl font-semibold">
              {next.slot.subject} • {classesLabel(next.slot.classId)}
            </div>
            <div className="text-white/80 text-sm mt-1">
              {next.slot.startTime}–{next.slot.endTime} • Каб. {next.slot.room}
            </div>
          </div>
          <div className="text-2xl font-bold bg-white/15 px-5 py-3 rounded-xl">
            {formatMinutesUntil(next.minutesUntil)}
          </div>
        </div>
      ) : (
        <div className="bg-muted/30 rounded-2xl p-6 mb-8 text-muted-foreground">
          В расписании пока нет уроков.
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-2xl shadow-sm border border-border p-6">
              <div className="flex items-center gap-4">
                <div className={`${stat.color} p-3 rounded-xl`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-semibold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <div className="bg-white rounded-2xl shadow-sm border border-border p-6">
          <h2 className="text-xl font-semibold mb-4">Расписание на сегодня</h2>
          {todaySchedule.length === 0 ? (
            <p className="text-muted-foreground text-sm">Сегодня уроков нет.</p>
          ) : (
            <div className="space-y-3">
              {todaySchedule.map((lesson) => (
                <div key={lesson.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
                  <div>
                    <div className="font-medium">{lesson.subject}</div>
                    <div className="text-sm text-muted-foreground">
                      {classesLabel(lesson.classId)} • Каб. {lesson.room}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {lesson.startTime}-{lesson.endTime}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Classes list */}
        <div className="bg-white rounded-2xl shadow-sm border border-border p-6">
          <h2 className="text-xl font-semibold mb-4">Мои классы</h2>
          <div className="space-y-3">
            {classes.map((c) => (
              <div key={c.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <span className="font-medium">{c.name}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {getStudentsByClassId(c.id).length} учеников
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function classesLabel(classId: string): string {
  const cls = getClasses().find((c) => c.id === classId);
  return cls?.name ?? classId;
}
