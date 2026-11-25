import { useState } from 'react';
import { BookOpen, Eye } from 'lucide-react';

interface Book {
  id: string;
  title: string;
  author: string;
  category: 'textbook' | 'manual';
  subject?: string;
  coverColor: string;
  url: string; 

}

const books: Book[] = [
  {
    id: '1',
    title: 'Олимпиада 7 класс',
    author: 'М. Э. Абрамян',
    category: 'textbook',
    subject: 'Олимпиада',
    coverColor: 'bg-indigo-500',
    url: 'https://www.scribd.com/document/583616673/Pre-Algebra-2',
  
  },
  {
    id: '2',
    title: 'Алгебра 7 класс',
    author: 'Deborah Barton',
    category: 'textbook',
    subject: 'Математика',
    coverColor: 'bg-indigo-500',
    url: 'https://www.scribd.com/document/512746413/complete-mathematics-for-cambridge-secondary-1-book-3-pdf-free'
  },
  {
    id: '3',
    title: 'Геометрия 7 класс',
    author: 'Deborah Barton',
    category: 'textbook',
    subject: 'Математика',
    coverColor: 'bg-indigo-500',
    url: 'https://www.scribd.com/document/512746413/complete-mathematics-for-cambridge-secondary-1-book-3-pdf-free'
  },
  {
    id: '4',
    title: 'Английский язык 7 класс',
    author: 'Naomi Simmons',
    category: 'textbook',
    subject: 'Английский',
    coverColor: 'bg-indigo-500',
    url: 'https://online.flipbuilder.com/xtrvf/wjgv/'
  },
  {
    id: '5',
    title: 'Физика 7 класс',
    author: 'М. Султонов',
    category: 'textbook',
    subject: 'Физика',
    coverColor: 'bg-indigo-500',
    url: 'https://marifat.tj/book/epub?book=62dfc97b1610f_1658833275.epub&id=144'
  },
  {
    id: '6',
    title: 'Химия 7 класс',
    author: 'Х. Сафиев',
    category: 'textbook',
    subject: 'Химия',
    coverColor: 'bg-indigo-500',
    url: 'https://example.com/chemistry7'
  },
  {
    id: '7',
    title: 'Биология 7 класс',
    author: 'А.Махмадзиёев',
    category: 'textbook',
    subject: 'Биология',
    coverColor: 'bg-indigo-500',
    url: 'https://marifat.tj/book/epub?book=62dfcb2166244_1658833697.epub&id=154'
  },
  {
    id: '9',
    title: 'География 7 класс',
    author: 'Кодир Ятимов',
    category: 'textbook',
    subject: 'География',
    coverColor: 'bg-indigo-500',
    url: 'https://marifat.tj/book/epub?book=62dfcda27d98b_1658834338.epub&id=159'
  },
  {
    id: '10',
    title: 'Технологии итт. 7 класс',
    author: 'С. Комилов',
    category: 'textbook',
    subject: 'Информатика',
    coverColor: 'bg-indigo-500',
    url: 'https://online.flipbuilder.com/rslc/rdnx/'
  },
  {
    id: '11',
    title: 'Забони русӣ 7 класс',
    author: 'Т. Гусейнова',
    category: 'textbook',
    subject: 'Русский язык',
    coverColor: 'bg-indigo-500',
    url: 'https://marifat.tj/book/epub?book=62dfca8cac7df_1658833548.epub&id=151'
  },
  {
    id: '12',
    title: 'Забони модарӣ 7 класс',
    author: 'С. Аминов',
    category: 'textbook',
    subject: 'Родной язык',
    coverColor: 'bg-indigo-500',
    url: 'https://marifat.tj/book/epub?book=62e3cab8a8875_1659095736.epub&id=155'
  },
  {
    id: '13',
    title: 'Адабиёт 7 класс',
    author: 'У.Тоиров',
    category: 'textbook',
    subject: 'Литература',
    coverColor: 'bg-indigo-500',
    url: 'https://marifat.tj/book/epub?book=63ce59f655494_1674467830.epub&id=340'
  },
  {
    id: '14',
    title: 'Таърихи умумӣ 7 класс',
    author: 'Т.Н.Зиёзода',
    category: 'textbook',
    subject: 'История',
    coverColor: 'bg-indigo-500',
    url: 'https://marifat.tj/book/epub?book=62dfca2eaee99_1658833454.epub&id=148'
  },
  {
    id: '15',
    title: 'Таърихи халқи тоҷик 7 класс',
    author: 'Собир Хочаев',
    category: 'textbook',
    subject: 'История',
    coverColor: 'bg-indigo-500',
    url: 'https://marifat.tj/book/epub?book=62e3d2ba339d9_1659097786.epub&id=147'
  },
    {
    id: '16',
    title: 'Алифбо ва матни ниёгон 7 класс',
    author: 'А. Байзоев',
    category: 'textbook',
    subject: 'История',
    coverColor: 'bg-indigo-500',
    url: 'https://marifat.tj/book/epub?book=62dfce9d5a57a_1658834589.epub&id=161'
  },
    {
    id: '17',
    title: 'Касбу хунар (барои духтарон)7 класс',
    author: 'Кодир Ятимов',
    category: 'textbook',
    subject: 'История',
    coverColor: 'bg-indigo-500',
    url: 'https://marifat.tj/book/epub?book=62dfcacc104ea_1658833612.epub&id=153'
  },
      {
    id: '18',
    title: 'Технология таълими  мехнат 7 класс',
    author: 'С.Исломов',
    category: 'textbook',
    subject: 'История',
    coverColor: 'bg-indigo-500',
    url: 'https://marifat.tj/book/epub?book=62dfcaaeb45d3_1658833582.epub&id=152'
  }
];

export function Library() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'textbook' | 'manual'>('all');
  const [hoveredBook, setHoveredBook] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'Все книги' },
    { id: 'textbook', label: 'Учебники' },
  ];

  const filteredBooks = selectedCategory === 'all'
    ? books
    : books.filter(book => book.category === selectedCategory);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Библиотека</h1>

      {/* Category Filters */}
      <div className="flex gap-3 mb-8">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id as 'all' | 'textbook' | 'manual')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedCategory === category.id
                ? 'bg-indigo-600 text-white'
                : 'bg-white border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filteredBooks.map((book) => (
          <div
            key={book.id}
            className="group cursor-pointer"
            onMouseEnter={() => setHoveredBook(book.id)}
            onMouseLeave={() => setHoveredBook(null)}
          >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-transform group-hover:scale-105 group-hover:shadow-lg">
              
              {/* Book Cover */}
              <div className={`${book.coverColor} h-64 flex items-center justify-center p-6 relative`}>
                <BookOpen className="w-16 h-16 text-white opacity-80" />
                
                {/* Hover Action - Только просмотр и только если есть ссылка */}
                {hoveredBook === book.id && book.url && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity">
                    <a 
                      href={book.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-4 bg-white rounded-full hover:bg-gray-100 transition-transform hover:scale-110 shadow-xl flex items-center justify-center"
                    >
                      <Eye className="w-6 h-6 text-indigo-600" />
                    </a>
                  </div>
                )}
              </div>

              {/* Book Info */}
              <div className="p-4">
                <h3 className="text-sm font-medium mb-1 line-clamp-2">{book.title}</h3>
                <p className="text-xs text-gray-500 line-clamp-1">{book.author}</p>
                {book.subject && (
                  <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-xs rounded-full text-gray-600">
                    {book.subject}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    
  );
}
  