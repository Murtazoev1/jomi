import { useState } from 'react';
import { TrendingUp, X, GraduationCap } from 'lucide-react';

interface Subject {
  id: string;
  name: string;
  average: number;
  grades: number[];
}

const subjects: Subject[] = [
  { id: '1', name: 'Олимпиада', average: 9.9, grades: [9, 10, 10, 10, 10, 10, 10] },
  { id: '2', name: 'Алгебра', average: 8.5, grades: [9, 8, 10, 7, 9, 9, 8] },
  { id: '3', name: 'Геометрия', average: 8.3, grades: [8, 9, 8, 8, 9] },
  { id: '4', name: 'Английский', average: 8.6, grades: [9, 9, 8, 8, 9, 8] },
  { id: '5', name: 'Физика', average: 8.2, grades: [8, 8, 9, 8, 7, 9] },
  { id: '6', name: 'Химия', average: 8.0, grades: [8, 8, 7, 9, 8] },
  { id: '7', name: 'Биология', average: 8.7, grades: [9, 8, 9, 9, 8] },
  { id: '8', name: 'Физ-ра', average: 9.5, grades: [10, 9, 10, 9, 10] },
  { id: '9', name: 'География', average: 8.4, grades: [8, 9, 8, 9, 8] },
  { id: '10', name: 'Т. итт.', average: 8.3, grades: [8, 8, 9, 8] },
  { id: '11', name: 'З. русӣ', average: 9.2, grades: [10, 9, 10, 9, 9, 10] },
  { id: '12', name: 'З. модарӣ', average: 9.3, grades: [10, 9, 9, 10, 9] },
  { id: '13', name: 'Адабиёт', average: 8.9, grades: [9, 9, 8, 9, 9] },
  { id: '14', name: 'Т. ум.', average: 9.0, grades: [9, 9, 9, 9] },
  { id: '15', name: 'Т. хт.', average: 8.8, grades: [9, 8, 9, 9] },
];

export function Grades() {
  const [selectedSubject, setSelectedSubject] = useState<Subject>(subjects[0]);
  const [showForecast, setShowForecast] = useState(false);
  const [desiredGrade, setDesiredGrade] = useState('9'); // По умолчанию 9

const calculateForecast = () => {
  const target = parseFloat(desiredGrade);
  
  // Ключевое изменение: если цель 10, мы ищем порог 9.5 (который округляется до 10)
  // Для остальных оценок (например, 9) порог будет 8.5 и так далее.
  const threshold = target - 0.5; 

  const currentSum = selectedSubject.grades.reduce((a, b) => a + b, 0);
  const currentCount = selectedSubject.grades.length;
  
  if (currentSum / currentCount >= threshold) return 0;

  let extraGrades = 0;
  let newSum = currentSum;
  let newCount = currentCount;

  // Теперь цикл остановится, когда средний балл достигнет порога округления
  while ((newSum / newCount) < threshold && extraGrades < 100) {
    newSum += 10;
    newCount += 1;
    extraGrades += 1;
  }

  return extraGrades;
};

  const getGradeColor = (grade: number) => {
    if (grade >= 9) return 'bg-green-100 text-green-800';
    if (grade >= 7) return 'bg-blue-100 text-blue-800';
    if (grade >= 5) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const forecastResult = calculateForecast();

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Боковая колонка (Столбик предметов) */}
      <aside className="w-full md:w-72 bg-white border-r border-border p-4 overflow-y-auto max-h-screen">
        <div className="flex items-center gap-2 mb-6 px-2">
          <GraduationCap className="text-blue-600 w-6 h-6" />
          <h2 className="text-xl font-bold">Предметы</h2>
        </div>
        <div className="flex flex-col gap-1">
          {subjects.map((subject) => (
            <button
              key={subject.id}
              onClick={() => setSelectedSubject(subject)}
              className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                selectedSubject.id === subject.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <span className="truncate mr-2 font-medium">{subject.name}</span>
              <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                selectedSubject.id === subject.id ? 'bg-white/20' : 'bg-gray-100'
              }`}>
                {subject.average.toFixed(1)}
              </span>
            </button>
          ))}
        </div>
      </aside>

      {/* Основная панель */}
      <main className="flex-1 p-6 md:p-10">
        <div className="max-w-4xl mx-auto">
          <header className="mb-10 text-center md:text-left">
            <h1 className="text-4xl font-black text-gray-900 mb-2">{selectedSubject.name}</h1>
            <p className="text-gray-500">Анализ успеваемости и прогноз оценок</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            {/* Карточка среднего балла */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center">
              <span className="text-gray-400 font-semibold uppercase tracking-wider text-sm mb-4">Средний балл</span>
              <div className="text-7xl font-black text-blue-600">
                {selectedSubject.average.toFixed(1)}
              </div>
            </div>

            {/* Карточка оценок */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <span className="text-gray-400 font-semibold uppercase tracking-wider text-sm mb-6 block">Последние оценки</span>
              <div className="flex flex-wrap gap-3">
                {selectedSubject.grades.map((grade, i) => (
                  <div key={i} className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shadow-sm ${getGradeColor(grade)}`}>
                    {grade}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowForecast(true)}
            className="w-full md:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-all hover:scale-[1.02] active:scale-95 shadow-xl"
          >
            <TrendingUp className="w-6 h-6" />
            Рассчитать прогноз
          </button>
        </div>
      </main>

      {/* Модалка прогноза */}
      {showForecast && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-gray-900">Прогноз</h3>
              <button onClick={() => setShowForecast(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Цель на четверть:</label>
              <select
                value={desiredGrade}
                onChange={(e) => setDesiredGrade(e.target.value)}
                className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none font-bold text-lg transition-all"
              >
                {[10, 9, 8, 7, 6].map(v => (
                  <option key={v} value={v}>{v} ({v >= 9 ? 'Отлично' : 'Хорошо'})</option>
                ))}
              </select>
            </div>

            <div className={`p-8 rounded-3xl text-center mb-6 ${forecastResult === 0 ? 'bg-green-50' : 'bg-blue-50'}`}>
              {forecastResult === 0 ? (
                <p className="text-green-700 font-bold">У вас уже отличный балл для этой цели! 🎉</p>
              ) : (
                <>
                  <p className="text-blue-600 font-medium mb-2">Нужно получить еще десяток:</p>
                  <div className="text-6xl font-black text-blue-700 mb-1">
                    {forecastResult}
                  </div>
                  <p className="text-blue-400 text-sm">при условии отсутствия плохих оценок</p>
                </>
              )}
            </div>

            <button
              onClick={() => setShowForecast(false)}
              className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all"
            >
              Понятно
            </button>
          </div>
        </div>
      )}
    </div>
  );
}