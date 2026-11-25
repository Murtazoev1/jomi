// ============================================================================
// JOMI — центральная "база данных" приложения.
// Сейчас всё хранится в localStorage браузера (без сервера).
// Когда появится реальная база данных школы — этот файл нужно будет заменить
// на модуль, который загружает те же структуры (Teacher, SchoolClass,
// Student, ScheduleSlot, Homework, GradeEntry) из настоящего API.
// Весь остальной код приложения обращается только к функциям этого файла,
// поэтому замена "начинки" на реальный backend не потребует переписывать
// экраны — только функции ниже.
// ============================================================================

export type DayOfWeek =
  | 'Понедельник'
  | 'Вторник'
  | 'Среда'
  | 'Четверг'
  | 'Пятница'
  | 'Суббота';

export const DAYS_ORDER: DayOfWeek[] = [
  'Понедельник',
  'Вторник',
  'Среда',
  'Четверг',
  'Пятница',
  'Суббота',
];

export interface Teacher {
  id: string;
  login: string; // логин для входа, например "odinaev"
  password: string; // пароль (учебный проект — хранится как текст)
  fullName: string; // "Одинаев Мирзошо"
  subject: string; // основной предмет, например "Математика"
  isClassTeacher?: string; // если он классный руководитель — название класса, напр. "7-Г"
}

export interface Student {
  id: string;
  name: string;
  classId: string; // ссылка на SchoolClass.id
}

export interface SchoolClass {
  id: string;
  name: string; // "7-Г"
}

// Один урок в недельном расписании конкретного учителя
export interface ScheduleSlot {
  id: string;
  teacherId: string;
  day: DayOfWeek;
  startTime: string; // "13:05"
  endTime: string; // "13:45"
  subject: string;
  classId: string; // какому классу ведёт этот урок
  room: string;
}

// Запись в журнале оценок: конкретная оценка конкретного ученика по
// конкретному предмету, поставленная конкретным учителем
export interface GradeEntry {
  id: string;
  studentId: string;
  subject: string;
  grade: number; // 1-10
  date: string; // ISO-строка даты выставления
  teacherId: string;
}

export interface Homework {
  id: string;
  classId: string;
  subject: string;
  teacherId: string;
  title: string;
  description: string;
  dueDate: string; // ISO-строка
  createdAt: string;
}

// ----------------------------------------------------------------------------
// ДЕМО-ДАННЫЕ. Это временные данные на 2 учителей и 2 класса для теста.
// Структура (поля и формат) — именно та, в которую завтра нужно будет
// перенести настоящие данные школы.
// ----------------------------------------------------------------------------

const DEMO_CLASSES: SchoolClass[] = [
  { id: 'class-8g', name: '8-Г' },
];

const DEMO_TEACHERS: Teacher[] = [
  {
    id: 'teacher-saidov',
    login: 'saidov',
    password: '1234',
    fullName: 'Саидов Бахром',
    subject: 'Математика',
    isClassTeacher: '8-Г',
  },
];

const DEMO_STUDENTS: Student[] = [
  { id: '1',  name: 'Муртазоев Мухаммадаюб', classId: 'class-8g' },
  { id: '2',  name: 'Абдурахмонов Сино',      classId: 'class-8g' },
  { id: '3',  name: 'Шарифзода Мухаммад',     classId: 'class-8g' },
  { id: '4',  name: 'Даврониён Фариза',        classId: 'class-8g' },
  { id: '5',  name: 'Махмадулоев Ахмад',       classId: 'class-8g' },
  { id: '6',  name: 'Туйчиев Амин',            classId: 'class-8g' },
  { id: '7',  name: 'Саторова Азиза',          classId: 'class-8g' },
  { id: '8',  name: 'Насриев Ахмад',           classId: 'class-8g' },
  { id: '9',  name: 'Рахимов Зайнуло',         classId: 'class-8g' },
  { id: '10', name: 'Билолзода Сулаймон',      classId: 'class-8g' },
  { id: '11', name: 'Хайдаров Билол',          classId: 'class-8g' },
  { id: '12', name: 'Мирхайдаров Абдулазиз',  classId: 'class-8g' },
  { id: '13', name: 'Фозилов Амирчон',         classId: 'class-8g' },
  { id: '14', name: 'Носиров Мустафо',         classId: 'class-8g' },
  { id: '15', name: 'Чураев Мухаммадамин',     classId: 'class-8g' },
  { id: '16', name: 'Чобиров Мудасир',         classId: 'class-8g' },
  { id: '17', name: 'Абдушукурзода Анас',      classId: 'class-8g' },
  { id: '19', name: 'Тагаева Румайса',         classId: 'class-8g' },
  { id: '21', name: 'Сафарзода Розия',         classId: 'class-8g' },
  { id: '22', name: 'Хакимзода Дилрабо',       classId: 'class-8g' },
  { id: '23', name: 'Кучаров Лутфуло',         classId: 'class-8g' },
  { id: '24', name: 'Махмудова Зулайхо',       classId: 'class-8g' },
];

// Расписание 8-Г. По расписанию ученика первые 4 урока каждый день — Математика (Саидов Бахром).
// Времена из реального расписания: 8:00-8:45, 8:55-9:40, 10:30-11:15, 11:25-12:10
const DEMO_SCHEDULE: ScheduleSlot[] = [
  // Понедельник
  { id: 'mo1', teacherId: 'teacher-saidov', day: 'Понедельник', startTime: '08:00', endTime: '08:45', subject: 'Математика', classId: 'class-8g', room: '505' },
  { id: 'mo2', teacherId: 'teacher-saidov', day: 'Понедельник', startTime: '08:55', endTime: '09:40', subject: 'Математика', classId: 'class-8g', room: '505' },
  { id: 'mo3', teacherId: 'teacher-saidov', day: 'Понедельник', startTime: '10:30', endTime: '11:15', subject: 'Математика', classId: 'class-8g', room: '505' },
  { id: 'mo4', teacherId: 'teacher-saidov', day: 'Понедельник', startTime: '11:25', endTime: '12:10', subject: 'Математика', classId: 'class-8g', room: '505' },
  // Вторник
  { id: 'tu1', teacherId: 'teacher-saidov', day: 'Вторник', startTime: '08:00', endTime: '08:45', subject: 'Математика', classId: 'class-8g', room: '505' },
  { id: 'tu2', teacherId: 'teacher-saidov', day: 'Вторник', startTime: '08:55', endTime: '09:40', subject: 'Математика', classId: 'class-8g', room: '505' },
  { id: 'tu3', teacherId: 'teacher-saidov', day: 'Вторник', startTime: '10:30', endTime: '11:15', subject: 'Математика', classId: 'class-8g', room: '505' },
  { id: 'tu4', teacherId: 'teacher-saidov', day: 'Вторник', startTime: '11:25', endTime: '12:10', subject: 'Математика', classId: 'class-8g', room: '505' },
  // Среда
  { id: 'we1', teacherId: 'teacher-saidov', day: 'Среда', startTime: '08:00', endTime: '08:45', subject: 'Математика', classId: 'class-8g', room: '505' },
  { id: 'we2', teacherId: 'teacher-saidov', day: 'Среда', startTime: '08:55', endTime: '09:40', subject: 'Математика', classId: 'class-8g', room: '505' },
  { id: 'we3', teacherId: 'teacher-saidov', day: 'Среда', startTime: '10:30', endTime: '11:15', subject: 'Математика', classId: 'class-8g', room: '505' },
  { id: 'we4', teacherId: 'teacher-saidov', day: 'Среда', startTime: '11:25', endTime: '12:10', subject: 'Математика', classId: 'class-8g', room: '505' },
  // Четверг
  { id: 'th1', teacherId: 'teacher-saidov', day: 'Четверг', startTime: '08:00', endTime: '08:45', subject: 'Математика', classId: 'class-8g', room: '505' },
  { id: 'th2', teacherId: 'teacher-saidov', day: 'Четверг', startTime: '08:55', endTime: '09:40', subject: 'Математика', classId: 'class-8g', room: '505' },
  { id: 'th3', teacherId: 'teacher-saidov', day: 'Четверг', startTime: '10:30', endTime: '11:15', subject: 'Математика', classId: 'class-8g', room: '505' },
  { id: 'th4', teacherId: 'teacher-saidov', day: 'Четверг', startTime: '11:25', endTime: '12:10', subject: 'Математика', classId: 'class-8g', room: '505' },
  // Пятница
  { id: 'fr1', teacherId: 'teacher-saidov', day: 'Пятница', startTime: '08:00', endTime: '08:45', subject: 'Математика', classId: 'class-8g', room: '505' },
  { id: 'fr2', teacherId: 'teacher-saidov', day: 'Пятница', startTime: '08:55', endTime: '09:40', subject: 'Математика', classId: 'class-8g', room: '505' },
  { id: 'fr3', teacherId: 'teacher-saidov', day: 'Пятница', startTime: '10:30', endTime: '11:15', subject: 'Математика', classId: 'class-8g', room: '505' },
  { id: 'fr4', teacherId: 'teacher-saidov', day: 'Пятница', startTime: '11:25', endTime: '12:10', subject: 'Математика', classId: 'class-8g', room: '505' },
];

const DEMO_GRADES: GradeEntry[] = [];
const DEMO_HOMEWORK: Homework[] = [];

// ----------------------------------------------------------------------------
// Ключи localStorage и утилиты чтения/записи с ленивой инициализацией демо-данными
// ----------------------------------------------------------------------------

export interface ChatMessage {
  id: string;
  senderId: string;   // studentId или teacherId
  senderName: string;
  role: 'student' | 'teacher';
  classId: string;
  text: string;
  timestamp: string; // ISO
}

const KEYS = {
  teachers: 'jomi_teachers',
  classes: 'jomi_classes',
  students: 'jomi_students',
  schedule: 'jomi_schedule',
  grades: 'jomi_grades',
  homework: 'jomi_homework',
  session: 'jomi_session',
  chat: 'jomi_chat_messages',
} as const;

function readOrInit<T>(key: string, demo: T): T {
  const raw = localStorage.getItem(key);
  if (raw) {
    try {
      return JSON.parse(raw) as T;
    } catch {
      // повреждённые данные — откатываемся на демо
    }
  }
  localStorage.setItem(key, JSON.stringify(demo));
  return demo;
}

function write<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

// ----------------------------------------------------------------------------
// Публичное API базы данных
// ----------------------------------------------------------------------------

export function getTeachers(): Teacher[] {
  return readOrInit(KEYS.teachers, DEMO_TEACHERS);
}

export function getClasses(): SchoolClass[] {
  return readOrInit(KEYS.classes, DEMO_CLASSES);
}

export function getStudents(): Student[] {
  return readOrInit(KEYS.students, DEMO_STUDENTS);
}

export function getSchedule(): ScheduleSlot[] {
  return readOrInit(KEYS.schedule, DEMO_SCHEDULE);
}

export function getGrades(): GradeEntry[] {
  return readOrInit(KEYS.grades, DEMO_GRADES);
}

export function getHomeworkList(): Homework[] {
  return readOrInit(KEYS.homework, DEMO_HOMEWORK);
}

export function saveGrades(grades: GradeEntry[]) {
  write(KEYS.grades, grades);
}

export function saveHomeworkList(list: Homework[]) {
  write(KEYS.homework, list);
}

export function saveSchedule(schedule: ScheduleSlot[]) {
  write(KEYS.schedule, schedule);
}

// --- Производные выборки, полезные экранам ---

export function findTeacherByLogin(login: string, password: string): Teacher | null {
  const teachers = getTeachers();
  return (
    teachers.find(
      (t) => t.login.toLowerCase() === login.trim().toLowerCase() && t.password === password
    ) || null
  );
}

export function getClassById(classId: string): SchoolClass | undefined {
  return getClasses().find((c) => c.id === classId);
}

export function getClassByName(name: string): SchoolClass | undefined {
  return getClasses().find((c) => c.name === name);
}

export function getStudentsByClassId(classId: string): Student[] {
  return getStudents().filter((s) => s.classId === classId);
}

// Классы, в которых у учителя есть хотя бы один урок (по расписанию),
// плюс класс, где он классный руководитель.
export function getClassesForTeacher(teacherId: string): SchoolClass[] {
  const teacher = getTeachers().find((t) => t.id === teacherId);
  const schedule = getSchedule().filter((s) => s.teacherId === teacherId);
  const classIds = new Set(schedule.map((s) => s.classId));
  if (teacher?.isClassTeacher) {
    const cls = getClassByName(teacher.isClassTeacher);
    if (cls) classIds.add(cls.id);
  }
  return getClasses().filter((c) => classIds.has(c.id));
}

export function getScheduleForTeacher(teacherId: string): ScheduleSlot[] {
  return getSchedule().filter((s) => s.teacherId === teacherId);
}

export function getGradesForStudent(studentId: string): GradeEntry[] {
  return getGrades().filter((g) => g.studentId === studentId);
}

export function getGradesForStudentSubject(studentId: string, subject: string): GradeEntry[] {
  return getGrades().filter((g) => g.studentId === studentId && g.subject === subject);
}

export function addGrade(entry: Omit<GradeEntry, 'id' | 'date'>): GradeEntry {
  const grades = getGrades();
  const newEntry: GradeEntry = {
    ...entry,
    id: `g-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    date: new Date().toISOString(),
  };
  const updated = [...grades, newEntry];
  saveGrades(updated);
  return newEntry;
}

export function deleteGrade(gradeId: string) {
  saveGrades(getGrades().filter((g) => g.id !== gradeId));
}

export function calcAverage(entries: GradeEntry[]): number {
  if (entries.length === 0) return 0;
  const sum = entries.reduce((a, b) => a + b.grade, 0);
  return parseFloat((sum / entries.length).toFixed(1));
}

export function addHomework(hw: Omit<Homework, 'id' | 'createdAt'>): Homework {
  const list = getHomeworkList();
  const newHw: Homework = {
    ...hw,
    id: `hw-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
  };
  saveHomeworkList([...list, newHw]);
  return newHw;
}

export function deleteHomework(hwId: string) {
  saveHomeworkList(getHomeworkList().filter((h) => h.id !== hwId));
}

export function getHomeworkForClass(classId: string): Homework[] {
  return getHomeworkList().filter((h) => h.classId === classId);
}

// --- Текущая сессия пользователя ---

export type SessionUser =
  | { role: 'teacher'; teacherId: string }
  | { role: 'student'; studentId: string };

export function saveSession(session: SessionUser) {
  write(KEYS.session, session);
}

export function loadSession(): SessionUser | null {
  const raw = localStorage.getItem(KEYS.session);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(KEYS.session);
}

// --- Чат (общий для класса) ---
export function getChatMessages(classId: string): ChatMessage[] {
  return readOrInit<ChatMessage[]>(KEYS.chat, []).filter((m) => m.classId === classId);
}

export function sendChatMessage(msg: Omit<ChatMessage, 'id' | 'timestamp'>): ChatMessage {
  const all = readOrInit<ChatMessage[]>(KEYS.chat, []);
  const newMsg: ChatMessage = {
    ...msg,
    id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: new Date().toISOString(),
  };
  write(KEYS.chat, [...all, newMsg]);
  return newMsg;
}

// --- Вычисление "через сколько следующий урок" ---

const DAY_INDEX: Record<DayOfWeek, number> = {
  Понедельник: 1,
  Вторник: 2,
  Среда: 3,
  Четверг: 4,
  Пятница: 5,
  Суббота: 6,
};

/**
 * Находит ближайший урок из списка (сегодня позже текущего времени,
 * либо в ближайший следующий учебный день) и возвращает его вместе с
 * количеством минут до начала.
 */
export function findNextLesson(
  slots: ScheduleSlot[],
  now: Date = new Date()
): { slot: ScheduleSlot; minutesUntil: number; isToday: boolean } | null {
  if (slots.length === 0) return null;

  const nowDay = now.getDay(); // 0=вс..6=сб
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const toMinutes = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };

  let best: { slot: ScheduleSlot; minutesUntil: number; isToday: boolean } | null = null;

  for (const slot of slots) {
    const slotDay = DAY_INDEX[slot.day];
    let dayDiff = slotDay - nowDay;
    if (dayDiff < 0) dayDiff += 7;

    let minutesUntil: number;
    if (dayDiff === 0) {
      const start = toMinutes(slot.startTime);
      if (start < nowMinutes) {
        // сегодня, но урок уже прошёл — ищем через неделю
        minutesUntil = 7 * 24 * 60 - nowMinutes + start;
      } else {
        minutesUntil = start - nowMinutes;
      }
    } else {
      minutesUntil = dayDiff * 24 * 60 - nowMinutes + toMinutes(slot.startTime);
    }

    if (!best || minutesUntil < best.minutesUntil) {
      best = { slot, minutesUntil, isToday: dayDiff === 0 && minutesUntil < 24 * 60 };
    }
  }

  return best;
}

export function formatMinutesUntil(minutes: number): string {
  if (minutes < 1) return 'уже идёт';
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  if (h === 0) return `через ${m} мин`;
  if (h < 24) return `через ${h} ч ${m} мин`;
  const days = Math.floor(h / 24);
  const hRem = h % 24;
  return `через ${days} дн ${hRem} ч`;
}
