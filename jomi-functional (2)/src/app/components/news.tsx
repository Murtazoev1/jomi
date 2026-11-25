import { useState } from 'react';
import { Calendar, Trophy, Bell, Star, TrendingUp } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  description: string;
  date: string;
  category: 'olympiad' | 'schedule' | 'events' | 'contests' | 'results';
  isNew?: boolean;
}

const newsData: NewsItem[] = [
  {
    id: '1',
    title: 'ICT Week',
    description: 'с 9 по 13 февраля состоится неделя компьютерных технологий',
    date: '2026-02-03',
    category: 'events',
  },
  {
    id: '2',
    title: 'Are you ready for JT',
    description: '27 февраля состоится традиционный День экзамена.',
    date: '2026-02-03',
    category: 'events',
  },
  {
    id: '3',
    title: 'Изменение в расписании на 10 февраля',
    description: 'В связи с педсоветом занятия 10 февраля заканчиваются на час раньше. Последний урок - в 13:00.',
    date: '2026-02-04',
    category: 'schedule',
    isNew: true,
  },
  {
    id: '4',
    title: 'городская олимпиада по математике',
    description: 'Приглашаем учащихся 7-х классов принять участие в городскую олимпиаде по математике. Регистрация до 15 февраля.',
    date: '2026-02-05',
    category: 'olympiad',
    isNew: true,
  },
  {
    id: '5',
    title: 'Конкурс "Лучший ученик месяца"',
    description: 'Стартует новый конкурс! Критерии: успеваемость, активность на уроках, участие в олимпиадах. Итоги - 28 февраля.',
    date: '2026-02-02',
    category: 'contests',
  },
  {
    id: '6',
    title: 'Итоги недели: 29 января - 2 февраля',
    description: 'Поздравляем победителей школьной олимпиады по физике! 7-Г класс показал отличные результаты - 3 призовых места.',
    date: '2026-02-02',
    category: 'results',
  },

  {
    id: '7',
    title: 'Экскурсия в музей естественных наук',
    description: 'Планируется экскурсия для 7-х классов в музей естественных наук 18 февраля. Сбор информации об участниках до 10 февраля.',
    date: '2026-01-31',
    category: 'events',
  },
  {
    id: '8',
    title: 'Спортивные соревнования',
    description: 'Межклассные соревнования по баскетболу состоятся 15 февраля. Ждем болельщиков и участников!',
    date: '2026-01-30',
    category: 'events',
  },
];

const categories = [
  { id: 'all', label: 'Все новости', icon: Bell },
  { id: 'olympiad', label: 'Олимпиады', icon: Trophy },
  { id: 'schedule', label: 'Расписание', icon: Calendar },
  { id: 'events', label: 'События', icon: Star },
  { id: 'contests', label: 'Конкурсы', icon: TrendingUp },
  { id: 'results', label: 'Итоги', icon: Trophy },
];

export function News() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredNews = selectedCategory === 'all'
    ? newsData
    : newsData.filter(item => item.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'olympiad':
        return 'bg-yellow-100 text-yellow-800';
      case 'schedule':
        return 'bg-blue-100 text-blue-800';
      case 'events':
        return 'bg-purple-100 text-purple-800';
      case 'contests':
        return 'bg-green-100 text-green-800';
      case 'results':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryLabel = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat?.label || category;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('ru-RU', options);
  };

  return (
    <div className="p-8">
      <h1 className="mb-6">Новости</h1>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                selectedCategory === category.id
                  ? 'bg-primary text-white'
                  : 'bg-white border border-border hover:bg-muted/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {category.label}
            </button>
          );
        })}
      </div>

      {/* News List */}
      <div className="space-y-4">
        {filteredNews.map((news) => (
          <div
            key={news.id}
            className="bg-white rounded-2xl shadow-sm border border-border p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg">{news.title}</h3>
                  {news.isNew && (
                    <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                      Новое
                    </span>
                  )}
                </div>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                    news.category
                  )}`}
                >
                  {getCategoryLabel(news.category)}
                </span>
              </div>
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {formatDate(news.date)}
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed">{news.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
