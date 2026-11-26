import { TrendingUp, Users, Award } from 'lucide-react';
import {
  getClassesForTeacher,
  getStudentsByClassId,
  getGradesForStudentSubject,
  calcAverage,
  getTeachers,
} from '../data/db';

interface TeacherActivityProps {
  teacherId: string;
}

export function TeacherActivity({ teacherId }: TeacherActivityProps) {
  const teacher = getTeachers().find((t) => t.id === teacherId);
  const classes = getClassesForTeacher(teacherId);
  const allStudents = classes.flatMap((c) => getStudentsByClassId(c.id));

  // Реальный рейтинг учеников по среднему баллу у этого учителя/предмета
  const topStudents = teacher
    ? allStudents
        .map((s) => ({
          name: s.name,
          grade: calcAverage(getGradesForStudentSubject(s.id, teacher.subject)),
        }))
        .filter((s) => s.grade > 0)
        .sort((a, b) => b.grade - a.grade)
        .slice(0, 5)
    : [];

  // Пока нет истории по дням (это появится вместе с реальной базой посещаемости) —
  // этот блок остаётся демонстрационным, чтобы показать, как будет выглядеть график.
  const weekData = [
    { day: 'Пн', average: 8.2, attendance: 96 },
    { day: 'Вт', average: 8.5, attendance: 94 },
    { day: 'Ср', average: 8.7, attendance: 98 },
    { day: 'Чт', average: 8.4, attendance: 95 },
    { day: 'Пт', average: 8.9, attendance: 97 },
  ];

  return (
    <div className="p-8">
      <h1 className="mb-6">Аналитика и активность</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm opacity-90">Средний балл недели</div>
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="text-3xl font-semibold">8.7</div>
          <div className="text-sm opacity-75 mt-2">+0.3 к прошлой неделе</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm opacity-90">Посещаемость</div>
            <Users className="w-5 h-5" />
          </div>
          <div className="text-3xl font-semibold">96%</div>
          <div className="text-sm opacity-75 mt-2">+2% к прошлой неделе</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm opacity-90">Отличников</div>
            <Award className="w-5 h-5" />
          </div>
          <div className="text-3xl font-semibold">12</div>
          <div className="text-sm opacity-75 mt-2">из 22 учеников</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Performance Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-border p-6">
          <h2 className="text-xl font-semibold mb-6">График успеваемости за неделю</h2>
          <div className="space-y-4">
            {weekData.map((day) => (
              <div key={day.day} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{day.day}</span>
                  <span className="text-muted-foreground">{day.average}</span>
                </div>
                <div className="h-8 bg-muted/30 rounded-lg overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-accent rounded-lg transition-all duration-500 flex items-center justify-end pr-3"
                    style={{ width: `${(day.average / 10) * 100}%` }}
                  >
                    <span className="text-xs text-white font-medium">
                      {day.attendance}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-accent/20 rounded-xl">
            <div className="text-sm text-muted-foreground mb-1">
              Средний балл за неделю
            </div>
            <div className="text-2xl font-semibold text-primary">
              {(weekData.reduce((sum, d) => sum + d.average, 0) / weekData.length).toFixed(1)}
            </div>
          </div>
        </div>

        {/* Top Students */}
        <div className="bg-white rounded-2xl shadow-sm border border-border p-6">
          <h2 className="text-xl font-semibold mb-6">Лучшие ученики по предмету</h2>
          {topStudents.length === 0 ? (
            <p className="text-sm text-muted-foreground">Пока нет выставленных оценок.</p>
          ) : (
            <div className="space-y-4">
              {topStudents.map((student, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                      index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-600'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{student.name}</div>
                    <div className="text-sm text-muted-foreground">Средний балл: {student.grade}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Class Distribution */}
          <div className="mt-6 p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl">
            <h3 className="font-semibold mb-3">Распределение оценок</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Отлично (9-10)</span>
                <span className="font-medium">45%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Хорошо (7-8)</span>
                <span className="font-medium">40%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Удовлетворительно (5-6)</span>
                <span className="font-medium">15%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
