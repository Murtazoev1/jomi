import { useState } from 'react';
import { Users, TrendingUp, Search, ArrowLeft } from 'lucide-react';
import {
  getClassesForTeacher,
  getStudentsByClassId,
  getGradesForStudentSubject,
  calcAverage,
  getTeachers,
} from '../data/db';

interface TeacherClassesProps {
  teacherId: string;
}

export function TeacherClasses({ teacherId }: TeacherClassesProps) {
  const [activeView, setActiveView] = useState<'list' | 'journal'>('list');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const teacher = getTeachers().find((t) => t.id === teacherId);
  const classes = getClassesForTeacher(teacherId);

  const handleOpenJournal = (classId: string) => {
    setSelectedClassId(classId);
    setActiveView('journal');
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 9) return 'bg-green-500 text-white';
    if (grade >= 7) return 'bg-yellow-500 text-white';
    return 'bg-red-500 text-white';
  };

  if (activeView === 'journal') {
    const selectedClass = classes.find((c) => c.id === selectedClassId);
    const students = getStudentsByClassId(selectedClassId).filter((s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div className="p-8">
        <button
          onClick={() => setActiveView('list')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium mb-6 transition-colors"
        >
          <ArrowLeft size={20} /> Назад к списку классов
        </button>

        <h1 className="text-2xl font-bold mb-1">Журнал: {selectedClass?.name}</h1>
        <p className="text-muted-foreground mb-6">Предмет: {teacher?.subject}</p>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            className="w-full pl-10 pr-4 py-2 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
            placeholder="Поиск ученика..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="bg-white rounded-xl shadow border overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 font-bold text-gray-600">ФИО Ученика</th>
                <th className="p-4 text-center font-bold text-gray-600">Оценки ({teacher?.subject})</th>
                <th className="p-4 text-center font-bold text-gray-600">Средний</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => {
                const grades = teacher ? getGradesForStudentSubject(student.id, teacher.subject) : [];
                const average = calcAverage(grades);
                return (
                  <tr key={student.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-800">{student.name}</td>
                    <td className="p-4">
                      <div className="flex gap-1 justify-center flex-wrap">
                        {grades.length === 0 ? (
                          <span className="text-gray-300 italic text-sm">Нет оценок</span>
                        ) : (
                          grades.map((g) => (
                            <span
                              key={g.id}
                              className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold ${getGradeColor(g.grade)} shadow-sm`}
                            >
                              {g.grade}
                            </span>
                          ))
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-center font-bold text-gray-900">{average || '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {students.length === 0 && (
            <div className="p-12 text-center text-gray-400">Никого не нашли по этому запросу</div>
          )}
        </div>
      </div>
    );
  }

  // Рендер списка классов
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Мои классы</h1>

      {classes.length === 0 && (
        <p className="text-muted-foreground">У вас пока нет закреплённых классов в расписании.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {classes.map((classInfo) => {
          const students = getStudentsByClassId(classInfo.id);
          const allGrades = teacher
            ? students.flatMap((s) => getGradesForStudentSubject(s.id, teacher.subject))
            : [];
          const averageGrade = calcAverage(allGrades);

          return (
            <div
              key={classInfo.id}
              className="bg-white rounded-2xl shadow-sm border border-border p-6 hover:shadow-lg transition-shadow group"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-primary">{classInfo.name}</h2>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                  <Users className="w-6 h-6" />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Учеников:</span>
                  <span className="font-medium">{students.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Средний балл:</span>
                  <span className="font-medium flex items-center gap-1 text-green-600">
                    {averageGrade || '—'}
                    <TrendingUp className="w-4 h-4" />
                  </span>
                </div>
                <div className="pt-3 border-t border-border">
                  <div className="text-xs text-muted-foreground mb-1">Предмет:</div>
                  <div className="text-sm font-medium">{teacher?.subject}</div>
                </div>
              </div>

              <button
                onClick={() => handleOpenJournal(classInfo.id)}
                className="w-full mt-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition-all font-semibold"
              >
                Открыть журнал
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
