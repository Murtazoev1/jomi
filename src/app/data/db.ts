// ============================================================================
// JOMI — центральная база данных (localStorage)
// DATA_VERSION — при изменении все данные сбрасываются
// ============================================================================

export type DayOfWeek = 'Понедельник'|'Вторник'|'Среда'|'Четверг'|'Пятница'|'Суббота';
export const DAYS_ORDER: DayOfWeek[] = ['Понедельник','Вторник','Среда','Четверг','Пятница','Суббота'];

export interface Teacher { id:string; login:string; password:string; fullName:string; subject:string; isClassTeacher?:string; }
export interface Student { id:string; name:string; classId:string; }
export interface SchoolClass { id:string; name:string; }
export interface ScheduleSlot { id:string; teacherId:string; day:DayOfWeek; startTime:string; endTime:string; subject:string; classId:string; room:string; teacher?:string; }
export interface GradeEntry { id:string; studentId:string; subject:string; grade:number; date:string; teacherId:string; }
export interface Homework { id:string; classId:string; subject:string; teacherId:string; title:string; description:string; dueDate:string; createdAt:string; }
export interface ChatMessage { id:string; senderId:string; senderName:string; role:'student'|'teacher'|'admin'; classId:string; channel:string; text:string; timestamp:string; }
export interface NewsItem { id:string; title:string; body:string; author:string; createdAt:string; imageUrl?:string; }
export interface ReadState { [key:string]: string; } // key -> last read timestamp

// ---- VERSION ----
const DATA_VERSION = 'v7';
function resetIfVersionChanged() {
  if (localStorage.getItem('jomi_data_version') !== DATA_VERSION) {
    ['jomi_teachers','jomi_classes','jomi_students','jomi_schedule','jomi_grades','jomi_homework','jomi_chat_messages','jomi_news','jomi_read_state'].forEach(k=>localStorage.removeItem(k));
    localStorage.setItem('jomi_data_version', DATA_VERSION);
  }
}
resetIfVersionChanged();

const KEYS = {
  teachers:'jomi_teachers', classes:'jomi_classes', students:'jomi_students',
  schedule:'jomi_schedule', grades:'jomi_grades', homework:'jomi_homework',
  session:'jomi_session', chat:'jomi_chat_messages', news:'jomi_news',
  readState:'jomi_read_state', apiKey:'jomi_gemini_api_key',
} as const;

function readOrInit<T>(key:string, demo:T):T {
  const raw = localStorage.getItem(key);
  if (raw) { try { return JSON.parse(raw) as T; } catch {} }
  localStorage.setItem(key, JSON.stringify(demo));
  return demo;
}
function write<T>(key:string, val:T) { localStorage.setItem(key, JSON.stringify(val)); }

// ---- DEMO DATA ----
const DEMO_CLASSES:SchoolClass[] = [{ id:'class-8g', name:'8-Г' }];

const DEMO_TEACHERS:Teacher[] = [{
  id:'teacher-saidov', login:'saidov', password:'1234',
  fullName:'Саидов Бахром', subject:'Математика', isClassTeacher:'8-Г',
}];

const SUBJECTS_8G = ['Олимпиада','Алгебра','Геометрия','Английский','Физика','Биология','Химия','История','Таджикский','Русский','Информатика','Технология','Физ-ра','География'];

// Реальное расписание 8-Г из скриншота
const DEMO_SCHEDULE:ScheduleSlot[] = [
  // Понедельник
  {id:'mo1',teacherId:'teacher-saidov',day:'Понедельник',startTime:'08:00',endTime:'08:45',subject:'Олимпиада',classId:'class-8g',room:'',teacher:'Саидов Бахром'},
  {id:'mo2',teacherId:'teacher-saidov',day:'Понедельник',startTime:'08:55',endTime:'09:40',subject:'Олимпиада',classId:'class-8g',room:'',teacher:'Саидов Бахром'},
  {id:'mo3',teacherId:'teacher-saidov',day:'Понедельник',startTime:'10:30',endTime:'11:15',subject:'Олимпиада',classId:'class-8g',room:'',teacher:'Саидов Бахром'},
  {id:'mo4',teacherId:'teacher-saidov',day:'Понедельник',startTime:'11:25',endTime:'12:10',subject:'Олимпиада',classId:'class-8g',room:'',teacher:'Саидов Бахром'},
  {id:'mo5',teacherId:'teacher-saidov',day:'Понедельник',startTime:'12:20',endTime:'13:05',subject:'Алгебра',classId:'class-8g',room:'505 Б',teacher:'Хусейнов Зокир'},
  {id:'mo6',teacherId:'teacher-saidov',day:'Понедельник',startTime:'13:55',endTime:'14:35',subject:'Геометрия',classId:'class-8g',room:'505 Б',teacher:'Хусейнов Зокир'},
  {id:'mo7',teacherId:'teacher-saidov',day:'Понедельник',startTime:'14:45',endTime:'15:25',subject:'География',classId:'class-8g',room:'',teacher:'ЯХ'},
  // Вторник
  {id:'tu1',teacherId:'teacher-saidov',day:'Вторник',startTime:'08:00',endTime:'08:45',subject:'Олимпиада',classId:'class-8g',room:'',teacher:'Саидов Бахром'},
  {id:'tu2',teacherId:'teacher-saidov',day:'Вторник',startTime:'08:55',endTime:'09:40',subject:'Олимпиада',classId:'class-8g',room:'',teacher:'Саидов Бахром'},
  {id:'tu3',teacherId:'teacher-saidov',day:'Вторник',startTime:'10:30',endTime:'11:15',subject:'Олимпиада',classId:'class-8g',room:'',teacher:'Саидов Бахром'},
  {id:'tu4',teacherId:'teacher-saidov',day:'Вторник',startTime:'11:25',endTime:'12:10',subject:'Олимпиада',classId:'class-8g',room:'',teacher:'Саидов Бахром'},
  {id:'tu5',teacherId:'teacher-saidov',day:'Вторник',startTime:'12:20',endTime:'13:05',subject:'Технология',classId:'class-8g',room:'709',teacher:'ФН'},
  {id:'tu6',teacherId:'teacher-saidov',day:'Вторник',startTime:'13:55',endTime:'14:35',subject:'Таджикский',classId:'class-8g',room:'М вар.-1',teacher:'Хочиакбар Мадаминов'},
  {id:'tu7',teacherId:'teacher-saidov',day:'Вторник',startTime:'14:45',endTime:'15:25',subject:'Физ-ра',classId:'class-8g',room:'',teacher:'Мухаммадюсуф Шербоев'},
  // Среда
  {id:'we1',teacherId:'teacher-saidov',day:'Среда',startTime:'08:00',endTime:'08:45',subject:'Олимпиада',classId:'class-8g',room:'',teacher:'Саидов Бахром'},
  {id:'we2',teacherId:'teacher-saidov',day:'Среда',startTime:'08:55',endTime:'09:40',subject:'Олимпиада',classId:'class-8g',room:'',teacher:'Саидов Бахром'},
  {id:'we3',teacherId:'teacher-saidov',day:'Среда',startTime:'10:30',endTime:'11:15',subject:'Олимпиада',classId:'class-8g',room:'',teacher:'Саидов Бахром'},
  {id:'we4',teacherId:'teacher-saidov',day:'Среда',startTime:'11:25',endTime:'12:10',subject:'Олимпиада',classId:'class-8g',room:'',teacher:'Саидов Бахром'},
  {id:'we5',teacherId:'teacher-saidov',day:'Среда',startTime:'12:20',endTime:'13:05',subject:'Английский',classId:'class-8g',room:'',teacher:'Давлатов'},
  {id:'we6',teacherId:'teacher-saidov',day:'Среда',startTime:'13:55',endTime:'14:35',subject:'Русский',classId:'class-8g',room:'',teacher:'Раъно Кабилова'},
  {id:'we7',teacherId:'teacher-saidov',day:'Среда',startTime:'14:45',endTime:'15:25',subject:'История',classId:'class-8g',room:'',teacher:'Латипова Умеда'},
  // Четверг
  {id:'th1',teacherId:'teacher-saidov',day:'Четверг',startTime:'08:00',endTime:'08:45',subject:'Олимпиада',classId:'class-8g',room:'',teacher:'Саидов Бахром'},
  {id:'th2',teacherId:'teacher-saidov',day:'Четверг',startTime:'08:55',endTime:'09:40',subject:'Олимпиада',classId:'class-8g',room:'',teacher:'Саидов Бахром'},
  {id:'th3',teacherId:'teacher-saidov',day:'Четверг',startTime:'10:30',endTime:'11:15',subject:'Олимпиада',classId:'class-8g',room:'',teacher:'Саидов Бахром'},
  {id:'th4',teacherId:'teacher-saidov',day:'Четверг',startTime:'11:25',endTime:'12:10',subject:'Олимпиада',classId:'class-8g',room:'',teacher:'Саидов Бахром'},
  {id:'th5',teacherId:'teacher-saidov',day:'Четверг',startTime:'12:20',endTime:'13:05',subject:'Таджикский',classId:'class-8g',room:'',teacher:'Латипова Умеда'},
  {id:'th6',teacherId:'teacher-saidov',day:'Четверг',startTime:'13:55',endTime:'14:35',subject:'Литература',classId:'class-8g',room:'',teacher:'Додочон Шарипов'},
  {id:'th7',teacherId:'teacher-saidov',day:'Четверг',startTime:'14:45',endTime:'15:25',subject:'Биология',classId:'class-8g',room:'',teacher:'Шохимардон Болтаев'},
  // Пятница
  {id:'fr1',teacherId:'teacher-saidov',day:'Пятница',startTime:'08:00',endTime:'08:45',subject:'Олимпиада',classId:'class-8g',room:'',teacher:'Саидов Бахром'},
  {id:'fr2',teacherId:'teacher-saidov',day:'Пятница',startTime:'08:55',endTime:'09:40',subject:'Олимпиада',classId:'class-8g',room:'',teacher:'Саидов Бахром'},
  {id:'fr3',teacherId:'teacher-saidov',day:'Пятница',startTime:'10:30',endTime:'11:15',subject:'Олимпиада',classId:'class-8g',room:'',teacher:'Саидов Бахром'},
  {id:'fr4',teacherId:'teacher-saidov',day:'Пятница',startTime:'11:25',endTime:'12:10',subject:'Олимпиада',classId:'class-8g',room:'',teacher:'Саидов Бахром'},
  {id:'fr5',teacherId:'teacher-saidov',day:'Пятница',startTime:'12:20',endTime:'13:05',subject:'Английский',classId:'class-8g',room:'',teacher:'Давлатов'},
  {id:'fr6',teacherId:'teacher-saidov',day:'Пятница',startTime:'13:55',endTime:'14:35',subject:'Химия',classId:'class-8g',room:'',teacher:'Азизбек Мирахимов'},
  {id:'fr7',teacherId:'teacher-saidov',day:'Пятница',startTime:'14:45',endTime:'15:25',subject:'Таджикский',classId:'class-8g',room:'',teacher:'Додочон Шарипов'},
];

const DEMO_STUDENTS:Student[] = [
  {id:'1',name:'Муртазоев Мухаммадаюб',classId:'class-8g'},
  {id:'2',name:'Абдурахмонов Сино',classId:'class-8g'},
  {id:'3',name:'Шарифзода Мухаммад',classId:'class-8g'},
  {id:'4',name:'Даврониён Фариза',classId:'class-8g'},
  {id:'5',name:'Махмадулоев Ахмад',classId:'class-8g'},
  {id:'6',name:'Туйчиев Амин',classId:'class-8g'},
  {id:'7',name:'Саторова Азиза',classId:'class-8g'},
  {id:'8',name:'Насриев Ахмад',classId:'class-8g'},
  {id:'9',name:'Рахимов Зайнуло',classId:'class-8g'},
  {id:'10',name:'Билолзода Сулаймон',classId:'class-8g'},
  {id:'11',name:'Хайдаров Билол',classId:'class-8g'},
  {id:'12',name:'Мирхайдаров Абдулазиз',classId:'class-8g'},
  {id:'13',name:'Фозилов Амирчон',classId:'class-8g'},
  {id:'14',name:'Носиров Мустафо',classId:'class-8g'},
  {id:'15',name:'Чураев Мухаммадамин',classId:'class-8g'},
  {id:'16',name:'Чобиров Мудасир',classId:'class-8g'},
  {id:'17',name:'Абдушукурзода Анас',classId:'class-8g'},
  {id:'19',name:'Тагаева Румайса',classId:'class-8g'},
  {id:'21',name:'Сафарзода Розия',classId:'class-8g'},
  {id:'22',name:'Хакимзода Дилрабо',classId:'class-8g'},
  {id:'23',name:'Кучаров Лутфуло',classId:'class-8g'},
  {id:'24',name:'Махмудова Зулайхо',classId:'class-8g'},
];

const DEMO_NEWS:NewsItem[] = [];

// ---- PUBLIC API ----
export const getTeachers = ()=>readOrInit(KEYS.teachers, DEMO_TEACHERS);
export const getClasses = ()=>readOrInit(KEYS.classes, DEMO_CLASSES);
export const getStudents = ()=>readOrInit(KEYS.students, DEMO_STUDENTS);
export const getSchedule = ()=>readOrInit(KEYS.schedule, DEMO_SCHEDULE);
export const getGrades = ()=>readOrInit<GradeEntry[]>(KEYS.grades, []);
export const getHomeworkList = ()=>readOrInit<Homework[]>(KEYS.homework, []);
export const getNewsList = ()=>readOrInit<NewsItem[]>(KEYS.news, DEMO_NEWS);
export const saveNewsList = (list:NewsItem[])=>write(KEYS.news, list);
export const saveGrades = (g:GradeEntry[])=>write(KEYS.grades, g);
export const saveHomeworkList = (h:Homework[])=>write(KEYS.homework, h);
export const saveSchedule = (s:ScheduleSlot[])=>write(KEYS.schedule, s);

// API key
export const getApiKey = ():string=>localStorage.getItem(KEYS.apiKey)||'';
export const setApiKey = (k:string)=>localStorage.setItem(KEYS.apiKey, k);

// Read state
export const getReadState = ():ReadState=>readOrInit<ReadState>(KEYS.readState, {});
export const markRead = (key:string)=>{ const s=getReadState(); s[key]=new Date().toISOString(); write(KEYS.readState, s); };

// News helpers
export const addNews = (item:Omit<NewsItem,'id'|'createdAt'>):NewsItem=>{
  const list=getNewsList();
  const n:NewsItem={...item,id:`news-${Date.now()}`,createdAt:new Date().toISOString()};
  saveNewsList([n,...list]);
  return n;
};
export const deleteNews = (id:string)=>saveNewsList(getNewsList().filter(n=>n.id!==id));

// Chat
export const getChatMessages = (classId:string, channel:string):ChatMessage[]=>{
  return readOrInit<ChatMessage[]>(KEYS.chat,[]).filter(m=>m.classId===classId&&m.channel===channel);
};
export const sendChatMessage = (msg:Omit<ChatMessage,'id'|'timestamp'>):ChatMessage=>{
  const all=readOrInit<ChatMessage[]>(KEYS.chat,[]);
  const m:ChatMessage={...msg,id:`msg-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,timestamp:new Date().toISOString()};
  write(KEYS.chat,[...all,m]);
  return m;
};
export const getUnreadCount = (key:string, classId:string, channel:string):number=>{
  const rs=getReadState();
  const lastRead=rs[key]||'';
  const msgs=getChatMessages(classId,channel);
  return msgs.filter(m=>m.timestamp>lastRead).length;
};
export const getTotalUnread = (studentId:string):number=>{
  const channels=['Чат 8-Г','Математика','Алгебра','Геометрия','Английский','Биология','Физика','Химия','История','Таджикский','Русский','Информатика','Физ-ра','География'];
  let total=0;
  for(const ch of channels){
    const key=`chat-${studentId}-${ch}`;
    total+=getUnreadCount(key,'class-8g',ch);
  }
  return total;
};

// Derived
export const findTeacherByLogin=(login:string,password:string)=>getTeachers().find(t=>t.login.toLowerCase()===login.trim().toLowerCase()&&t.password===password)||null;
export const getClassById=(id:string)=>getClasses().find(c=>c.id===id);
export const getStudentsByClassId=(classId:string)=>getStudents().filter(s=>s.classId===classId);
export const getClassesForTeacher=(teacherId:string)=>{
  const teacher=getTeachers().find(t=>t.id===teacherId);
  const ids=new Set(getSchedule().filter(s=>s.teacherId===teacherId).map(s=>s.classId));
  if(teacher?.isClassTeacher){const c=getClasses().find(c=>c.name===teacher.isClassTeacher);if(c)ids.add(c.id);}
  return getClasses().filter(c=>ids.has(c.id));
};
export const getScheduleForTeacher=(teacherId:string)=>getSchedule().filter(s=>s.teacherId===teacherId);
export const getGradesForStudent=(studentId:string)=>getGrades().filter(g=>g.studentId===studentId);
export const getGradesForStudentSubject=(studentId:string,subject:string)=>getGrades().filter(g=>g.studentId===studentId&&g.subject===subject);
export const addGrade=(entry:Omit<GradeEntry,'id'|'date'>):GradeEntry=>{
  const g:GradeEntry={...entry,id:`g-${Date.now()}`,date:new Date().toISOString()};
  saveGrades([...getGrades(),g]); return g;
};
export const deleteGrade=(id:string)=>saveGrades(getGrades().filter(g=>g.id!==id));
export const calcAverage=(entries:GradeEntry[])=>entries.length?parseFloat((entries.reduce((a,b)=>a+b.grade,0)/entries.length).toFixed(1)):0;
export const addHomework=(hw:Omit<Homework,'id'|'createdAt'>):Homework=>{
  const h:Homework={...hw,id:`hw-${Date.now()}`,createdAt:new Date().toISOString()};
  saveHomeworkList([...getHomeworkList(),h]); return h;
};
export const deleteHomework=(id:string)=>saveHomeworkList(getHomeworkList().filter(h=>h.id!==id));
export const getHomeworkForClass=(classId:string)=>getHomeworkList().filter(h=>h.classId===classId);

// Session
export type SessionUser={role:'teacher';teacherId:string}|{role:'student';studentId:string}|{role:'admin'};
export const saveSession=(s:SessionUser)=>write(KEYS.session,s);
export const loadSession=():SessionUser|null=>{const r=localStorage.getItem(KEYS.session);if(!r)return null;try{return JSON.parse(r);}catch{return null;}};
export const clearSession=()=>localStorage.removeItem(KEYS.session);

// Schedule helpers
export const DAY_INDEX:Record<DayOfWeek,number>={Понедельник:1,Вторник:2,Среда:3,Четверг:4,Пятница:5,Суббота:6};
export const findNextLesson=(slots:ScheduleSlot[],now=new Date())=>{
  if(!slots.length)return null;
  const nowDay=now.getDay();
  const nowMin=now.getHours()*60+now.getMinutes();
  const toMin=(t:string)=>{const[h,m]=t.split(':').map(Number);return h*60+m;};
  let best:any=null;
  for(const slot of slots){
    const sd=DAY_INDEX[slot.day];
    let diff=sd-nowDay; if(diff<0)diff+=7;
    let until:number;
    if(diff===0){const s=toMin(slot.startTime);until=s<nowMin?7*24*60-nowMin+s:s-nowMin;}
    else{until=diff*24*60-nowMin+toMin(slot.startTime);}
    if(!best||until<best.minutesUntil)best={slot,minutesUntil:until,isToday:diff===0&&until<24*60};
  }
  return best;
};
export const formatMinutesUntil=(m:number)=>{
  if(m<1)return'идёт сейчас';
  const h=Math.floor(m/60),min=Math.round(m%60);
  if(h===0)return`через ${min} мин`;
  if(h<24)return`через ${h} ч ${min} мин`;
  return`через ${Math.floor(h/24)} дн`;
};

export {SUBJECTS_8G};
