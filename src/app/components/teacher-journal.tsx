import { useState } from 'react';
import { Search, Plus, X, GraduationCap } from 'lucide-react';
import {
  getClassesForTeacher,
  getStudentsByClassId,
  getGradesForStudentSubject,
  addGrade,
  deleteGrade,
  calcAverage,
  getTeachers,
} from '../data/db';

interface TeacherJournalProps {
  teacherId: string;
}

export function TeacherJournal({ teacherId }: TeacherJournalProps) {
  const teacher = getTeachers().find((t) => t.id === teacherId);
  const classes = getClassesForTeacher(teacherId);

  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id ?? '');
  const [searchQuery, setSearchQuery] = useState('');
  // Счётчик для принудительного перерендера после записи в localStorage
  const [, forceUpdate] = useState(0);
  const refresh = () => forceUpdate((n) => n + 1);

  if (!teacher) {
    return <div className="p-8 text-muted-foreground">Учитель не найден.</div>;
  }

  const handleAddGrade = (studentId: string) => {
    const gradeStr = prompt('Введите оценку (от 1 до 10):');
    if (gradeStr === null) return;
    const numGrade = parseInt(gradeStr, 10);
    if (numGrade >= 1 && numGrade <= 10) {
      addGrade({ studentId, subject: teacher.subject, grade: numGrade, teacherId: teacher.id });
      refresh();
    } else {
      alert('Оценка должна быть числом от 1 до 10');
    }
  };

  const handleDeleteGrade = (gradeId: string) => {
    deleteGrade(gradeId);
    refresh();
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 9) return 'bg-green-500 text-white';
    if (grade >= 7) return 'bg-yellow-500 text-white';
    if (grade >= 5) return 'bg-orange-500 text-white';
    return 'bg-red-500 text-white';
  };

  const students = getStudentsByClassId(selectedClassId).filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 bg-slate-50 min-h-screen font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
              <GraduationCap size={32} className="text-blue-600" />
              Электронный Журнал
            </h1>
            <p className="text-slate-500">
              {teacher.subject} • класс{' '}
              {classes.find((c) => c.id === selectedClassId)?.name ?? '—'}
            </p>
          </div>
          {classes.length > 0 && (
            <div className="flex gap-2 bg-white p-1 rounded-xl shadow-sm border">
              {classes.map((cls) => (
                <button
                  key={cls.id}
                  onClick={() => setSelectedClassId(cls.id)}
                  className={`px-6 py-2 rounded-lg font-bold transition ${
                    selectedClassId === cls.id ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  {cls.name}
                </button>
              ))}
            </div>
          )}
        </header>

        {classes.length === 0 ? (
          <p className="text-slate-400">У вас пока нет классов в расписании.</p>
        ) : (
          <>
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                className="w-full pl-12 pr-4 py-4 rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-blue-500 outline-none text-lg"
                placeholder="Начните вводить фамилию ученика..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="p-5 text-slate-500 font-semibold uppercase text-xs tracking-wider">Ученик</th>
                    <th className="p-5 text-slate-500 font-semibold uppercase text-xs tracking-wider text-center">История оценок</th>
                    <th className="p-5 text-slate-500 font-semibold uppercase text-xs tracking-wider text-center">Средний</th>
                    <th className="p-5 text-slate-500 font-semibold uppercase text-xs tracking-wider text-right">Действие</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {students.map((student) => {
                    const grades = getGradesForStudentSubject(student.id, teacher.subject);
                    const average = calcAverage(grades);
                    return (
                      <tr key={student.id} className="hover:bg-blue-50/30 transition-colors group">
                        <td className="p-5 font-bold text-slate-700">{student.name}</td>
                        <td className="p-5">
                          <div className="flex gap-2 justify-center flex-wrap">
                            {grades.map((g) => (
                              <div key={g.id} className="relative group/grade">
                                <span
                                  className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-black shadow-sm ${getGradeColor(g.grade)}`}
                                >
                                  {g.grade}
                                </span>
                                <button
                                  onClick={() => handleDeleteGrade(g.id)}
                                  className="absolute -top-2 -right-2 bg-slate-800 text-white rounded-full p-0.5 opacity-0 group-hover/grade:opacity-100 transition-opacity"
                                >
                                  <X size={12} />
                                </button>
                              </div>
                            ))}
                            {grades.length === 0 && <span className="text-slate-300 italic text-sm">Нет оценок</span>}
                          </div>
                        </td>
                        <td className="p-5 text-center">
                          <div
                            className={`inline-block px-4 py-1 rounded-full font-black text-sm ${
                              average >= 9
                                ? 'bg-green-100 text-green-600'
                                : average >= 7
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-600'
                            }`}
                          >
                            {average || '0.0'}
                          </div>
                        </td>
                        <td className="p-5 text-right">
                          <button
                            onClick={() => handleAddGrade(student.id)}
                            className="inline-flex items-center gap-2 bg-slate-100 text-slate-600 px-4 py-2 rounded-xl font-bold hover:bg-blue-600 hover:text-white transition-all active:scale-95"
                          >
                            <Plus size={18} />
                            Оценка
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {students.length === 0 && (
                <div className="p-20 text-center text-slate-400">Никого не нашли по этому запросу</div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
