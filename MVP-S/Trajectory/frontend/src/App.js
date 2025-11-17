import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { studentAPI, criteriaAPI, courseAPI, eventAPI, userAPI, authAPI } from './services/api.js'; 

Chart.register(...registerables);
// Роли в системе
const ROLES = {
  STUDENT: 'student',
  UNIVERSITY_CURATOR: 'university_curator',
  COMPANY_CURATOR: 'company_curator',
  CHAIRMAN: 'chairman',
  EXPERT: 'expert',
  ADMIN: 'admin'
};

// Профили для каждой роли
const ROLE_PROFILES = {
  [ROLES.STUDENT]: {
    name: 'Женя Борисов',
    group: 'БП-401654/452467',
    avatarBg: '#60a5fa',
    role: 'Студент'
  },
  [ROLES.UNIVERSITY_CURATOR]: {
    name: 'Анна Петрова',
    group: 'Куратор СПБПУ',
    avatarBg: '#10b981',
    role: 'Куратор ВУЗа'
  },
  [ROLES.COMPANY_CURATOR]: {
    name: 'Дмитрий Смирнов',
    group: 'Куратор Яндекс',
    avatarBg: '#8b5cf6',
    role: 'Куратор компании'
  },
  [ROLES.CHAIRMAN]: {
    name: 'Мария Иванова',
    group: 'Председатель комиссии',
    avatarBg: '#f59e0b',
    role: 'Председатель'
  },
  [ROLES.EXPERT]: {
    name: 'Алексей Козлов',
    group: 'Эксперт отрасли',
    avatarBg: '#ef4444',
    role: 'Эксперт'
  },
  [ROLES.ADMIN]: {
    name: 'Администратор Системы',
    group: 'Системный администратор',
    avatarBg: '#6b7280',
    role: 'Администратор'
  }
};

// Данные для демонстрации
const DEMO_DATA = {
  students: [
    { id: 1, name: 'Иванов И.И.', university: 'СПБПУ', direction: 'Экономика ИТ и бизнес-анализ', 
      gpa: 4.5, points: 720, level: 6, matchPercent: 89, successPercent: 82, leadership: 75, innovation: 80 },
    { id: 2, name: 'Петров П.П.', university: 'СПБПУ', direction: 'Информационные системы', 
      gpa: 4.2, points: 650, level: 5, matchPercent: 76, successPercent: 70, leadership: 65, innovation: 72 },
    { id: 3, name: 'Сидорова С.С.', university: 'ИТМО', direction: 'Программная инженерия', 
      gpa: 4.8, points: 820, level: 7, matchPercent: 92, successPercent: 88, leadership: 85, innovation: 90 },
    { id: 4, name: 'Кузнецов К.К.', university: 'ВШЭ', direction: 'Бизнес-информатика', 
      gpa: 4.0, points: 580, level: 4, matchPercent: 68, successPercent: 65, leadership: 60, innovation: 62 },
  ],
  events: [
    { id: 1, title: 'Хакатон DataCup', type: 'Хакатон', date: '2023-12-15', status: 'Завершено', participants: 42, points: 20, category: 'Необязательное' },
    { id: 2, title: 'Семинар по аналитике', type: 'Семинар', date: '2023-11-20', status: 'Завершено', participants: 25, points: 10, category: 'Обязательное' },
    { id: 3, title: 'Конференция ИТ-2023', type: 'Конференция', date: '2024-01-20', status: 'Запланировано', participants: 0, points: 20, category: 'Необязательное' },
  ],
  applications: [
    { id: 1, student: 'Иванов И.И.', type: 'Сертификат', category: 'Курс', title: 'Python Advanced', date: '2023-11-10', status: 'Новые' },
    { id: 2, student: 'Петров П.П.', type: 'Диплом', category: 'Хакатон', title: 'Победа в DataCup', date: '2023-12-18', status: 'Новые' },
    { id: 3, student: 'Сидорова С.С.', type: 'Сертификат', category: 'Курс', title: 'Machine Learning', date: '2023-10-05', status: 'Подтвержденные' },
  ]
};

// Конфигурация критериев для студента
const CRITERIA_CONFIG = [
  { key: 'gpa', title: 'Успеваемость', max: 150, description: 'Средний балл (1–5) × 30' },
  { key: 'courses', title: 'Курсы', max: 200, description: 'Каждый пройденный курс = 20 (макс. 10)' },
  { key: 'events', title: 'Мероприятия', max: 50, description: 'Каждый семинар/воркшоп = 10 (макс. 5)' },
  { key: 'projects', title: 'Проекты', max: 50, description: 'Каждый проект = 20 (мин.2)' },
  { key: 'research', title: 'НИР', max: 50, description: 'Каждая защищённая работа = 20 (мин.2)' },
  { key: 'hard', title: 'Хард Скиллы', max: 200, description: 'Каждый тест/навык = 10 (макс.20)' },
  { key: 'intern', title: 'Практика/Стажировки', max: 100, description: 'Максимум 25 баллов за семестр (назначает куратор)' },
  { key: 'recom', title: 'Рекомендации', max: 50, description: 'Каждая рекомендация = 25 (макс.2)' },
];

const DEFAULT_STUDENT_STATE = {
  gpa: 4.2, courses: 3, events: 2, projects: 1, research: 0, hard: 6, intern: 25, recom: 1,
  levelThreshold: 850,
  ...ROLE_PROFILES[ROLES.STUDENT],
  dob: '2001-01-01',
  uploaded: { resume: null, certs: ['Сертификат Python.pdf','SQL Workshop.pdf'] },
  activity: [
    { month: 'Сентябрь', points: 51 },
    { month: 'Октябрь', points: 47 },
    { month: 'Ноябрь', points: 48 }
  ],
  hardTests: [
    { id:1, title:'Python тест', type:'Обязательное', points:20, status:'Пройден', link: '/test/python' },
    { id:2, title:'SQL тест', type:'Обязательное', points:20, status:'В процессе', link: '/test/sql' },
    { id:3, title:'Excel продвинутый', type:'Рекоменд.', points:12, status:'Не начат', link: '/test/excel' },
    { id:4, title:'Power BI', type:'Необязательный', points:5, status:'Не начат', link: '/test/powerbi' },
    { id:5, title:'JavaScript тест', type:'Рекоменд.', points:12, status:'Пройден', link: '/test/javascript' },
    { id:6, title:'Data Science тест', type:'Обязательное', points:20, status:'Пройден', link: '/test/datascience' },
  ],
};

// Хук для работы с localStorage
function useLocalState(key, initial) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch { return initial; }
  });
  
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(state)); } catch {}
  }, [key, state]);
  
  return [state, setState];
}

// Вычисление баллов студента
function computePoints(values) {
  const points = {};
  points.gpa = Math.min(150, Math.round((values.gpa * 30) * 10) / 10);
  points.courses = Math.min(200, Math.round(values.courses * 20));
  points.events = Math.min(50, Math.round(values.events * 10));
  points.projects = Math.min(50, Math.round(values.projects * 20));
  points.research = Math.min(50, Math.round(values.research * 20));
  points.hard = Math.min(200, (values.hardTests || []).reduce((sum, t) => sum + (t.status === 'Пройден' ? t.points : 0), 0));
  points.intern = Math.min(100, Math.round(values.intern));
  points.recom = Math.min(50, Math.round(values.recom * 25));
  const total = Object.values(points).reduce((s,v)=>s+v,0);
  return { points, total: Math.round(total*10)/10 };
}

// Базовые компоненты
function Logo({ size = 32 }) {
  return (
    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
      Т
    </div>
  );
}

function RoleSelector({ currentRole, onRoleChange }) {
  const roles = [
    { key: ROLES.STUDENT, label: 'Студент', icon: '🎓' },
    { key: ROLES.UNIVERSITY_CURATOR, label: 'Куратор ВУЗа', icon: '👨‍🏫' },
    { key: ROLES.COMPANY_CURATOR, label: 'Куратор компании', icon: '🏢' },
    { key: ROLES.CHAIRMAN, label: 'Председатель', icon: '👨‍⚖️' },
    { key: ROLES.EXPERT, label: 'Эксперт', icon: '🔍' },
    { key: ROLES.ADMIN, label: 'Администратор', icon: '⚙️' },
  ];

  return (
    <div className="role-selector p-4 rounded-lg mb-6">
      <h2 className="text-white text-lg font-semibold mb-3">Выбор роли</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {roles.map(role => (
          <button
            key={role.key}
            onClick={() => onRoleChange(role.key)}
            className={`p-3 rounded flex flex-col items-center justify-center transition-all ${
              currentRole === role.key 
                ? 'bg-white text-indigo-700 shadow-lg' 
                : 'bg-indigo-800 bg-opacity-30 text-white hover:bg-opacity-50'
            }`}
          >
            <span className="text-xl mb-1">{role.icon}</span>
            <span className="text-sm font-medium">{role.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function Header({ onToggle, onOpenProfile, onToggleNotif, profile, currentRole }) {
  return (
    <div className="flex items-center justify-between px-4 h-16 bg-white border-b sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button onClick={onToggle} className="p-2 rounded-md hover:bg-gray-100" aria-label="Toggle sidebar">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={onToggleNotif} className="p-2 rounded-md hover:bg-gray-50 tt" data-tip="Уведомления" aria-label="Notifications">
          <span className="text-2xl">🔔</span>
        </button>
        <button onClick={onOpenProfile} className="flex items-center gap-3 p-1 rounded-md hover:bg-gray-50" aria-label="Open profile">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold" style={{background: profile.avatarBg}}>
            {profile.name.split(' ').map(s=>s[0]).slice(0,2).join('').toUpperCase()}
          </div>
          <div className="hidden sm:flex flex-col items-start">
            <div className="text-sm font-medium leading-4">{profile.name}</div>
            <div className="text-xs text-gray-400 leading-4">{profile.group}</div>
          </div>
        </button>
      </div>
    </div>
  );
}

function Sidebar({ collapsed, active, setActive, currentRole }) {
  const roleNavigation = {
    [ROLES.STUDENT]: [
      { key:'home', label: 'Главная', icon: '🏠' },
      { key:'achievements', label: 'Достижения', icon: '🏆' },
      { key:'courses', label: 'Курсы', icon: '🎓' },
      { key: 'hard', label: 'Хард Скиллы', icon: '🧩' },
      { key:'events', label: 'Мероприятия', icon: '🗓️' },
      { key:'profile', label: 'Профиль', icon: '👤' },
      { key:'contacts', label: 'Контакты', icon: '📇' },
      { key:'support', label: 'Поддержка', icon: '💬' },
    ],
    [ROLES.UNIVERSITY_CURATOR]: [
      { key:'home', label: 'Главная', icon: '🏠' },
      { key:'students', label: 'Студенты', icon: '👨‍🎓' },
      { key:'events', label: 'События', icon: '🗓️' },
      { key:'applications', label: 'Заявки', icon: '📄' },
      { key:'profile', label: 'Профиль', icon: '👤' },
      { key:'support', label: 'Поддержка', icon: '💬' },
    ],
    [ROLES.COMPANY_CURATOR]: [
      { key:'home', label: 'Главная', icon: '🏠' },
      { key:'students', label: 'Студенты', icon: '👨‍🎓' },
      { key:'events', label: 'Мероприятия', icon: '🗓️' },
      { key:'profile', label: 'Профиль', icon: '👤' },
      { key:'support', label: 'Поддержка', icon: '💬' },
    ],
    [ROLES.CHAIRMAN]: [
      { key:'rating', label: 'Рейтинг студентов & Абитуриентов', icon: '📊' },
      { key:'report', label: 'Система подтверждения', icon: '✅' },
      { key:'courses', label: 'Курсы', icon: '📚' },
      { key:'events', label: 'Мероприятия', icon: '🎟️' },
      { key:'hardskills', label: 'Хард Скиллы', icon: '🧩' },
      { key:'users', label: 'Пользователи', icon: '👥' },
      { key:'support', label: 'Поддержка', icon: '💬' },
      { key:'profile', label: 'Мой профиль', icon: '👤' },
    ],
    [ROLES.EXPERT]: [
      { key:'rating', label: 'Рейтинг студентов & Абитуриентов', icon: '📊' },
      { key:'courses', label: 'Курсы', icon: '📚' },
      { key:'events', label: 'Мероприятия', icon: '🎟️' },
      { key:'hardskills', label: 'Хард Скиллы', icon: '🧩' },
      { key:'support', label: 'Поддержка', icon: '💬' },
      { key:'profile', label: 'Мой профиль', icon: '👤' },
    ],
    [ROLES.ADMIN]: [
      { key:'home', label: 'Главная', icon: '🏠' },
      { key:'users', label: 'Пользователи', icon: '👥' },
      { key:'roles', label: 'Роли и права', icon: '🔐' },
      { key:'support', label: 'Поддержка', icon: '💬' },
    ]
  };

  const items = roleNavigation[currentRole] || [];

  return (
    <aside className={`bg-white border-r sidebar-transition ${collapsed ? 'w-20' : 'w-64'} overflow-hidden flex flex-col`}>
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <div><Logo size={32} /></div>
          {!collapsed && <div className="flex flex-col">
            <div className="text-lg font-bold">Траектория</div>
          </div>}
        </div>
      </div>

      <nav className="p-3 flex-1">
        {items.map(it => (
          <button key={it.key} onClick={()=>setActive(it.key)} className={`w-full flex items-center gap-3 p-2 rounded-md text-left hover:bg-gray-50 ${active===it.key ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700'}`}>
            <span className="w-6 text-center">{it.icon}</span>
            {!collapsed && <span className="font-medium">{it.label}</span>}
          </button>
        ))}
      </nav>

      <div className="p-3 border-t text-xs text-gray-500">Траектория v1.0</div>
    </aside>
  );
}

// Базовые страницы
function StudentHome({ totalPoints, profile, openAchievements }) {
  const LEVELS = [
    { name: 'Жёлтый студент', min: 0, max: 99, emoji: '🟡', tip: 'Начните с регистрации и заполнения профиля.' },
    { name: 'Ознакомившийся', min: 100, max: 199, emoji: '🟠', tip: 'Пройдите первые курсы и добавьте проект.' },
    { name: 'Новичок', min: 200, max: 349, emoji: '🟢', tip: 'Добавьте проект или завершите курс, чтобы перейти на уровень "Активный участник".' },
    { name: 'Активный участник', min: 350, max: 499, emoji: '🔵', tip: 'Участвуйте в мероприятиях и стажировках.' },
    { name: 'Практикант', min: 500, max: 699, emoji: '🟣', tip: 'Завершите проекты и курсы для следующего уровня.' },
    { name: 'Развивающийся специалист', min: 700, max: 849, emoji: '🔷', tip: 'Развивайтесь в нескольких направлениях.' },
    { name: 'Потенциальный сотрудник', min: 850, max: Infinity, emoji: '⭐', tip: 'Вы почти на вершине! Поддерживайте активность.' },
  ];

  const currentLevel = LEVELS.find(l => totalPoints >= l.min && totalPoints <= l.max);
  const percent = Math.min(100, Math.round((totalPoints / 1000) * 100));

  const [modalLevel, setModalLevel] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  const lastMonth = profile.activity && profile.activity.length > 0 ? profile.activity[profile.activity.length - 1] : { month: 'Ноябрь', points: 0 };

  return (
    <div className="p-6 space-y-6">
      <section className="bg-white card-shadow rounded-lg p-8 text-center">
        <div className="text-sm text-gray-500 mb-2">Общая сумма баллов</div>
        <div className="text-6xl font-extrabold">{totalPoints}</div>
        <div className="mt-3 text-gray-800 text-xl font-semibold">{`Ты ${currentLevel.name}!`}</div>
        <div className="mt-2 text-gray-500">{`Участвуй в проектах, проходи курсы и проявляй активность — каждый шаг приближает тебя к статусу компетентного специалиста.`}</div>
      </section>

      <section className="bg-white card-shadow rounded-lg p-6">
        <div className="mb-4"><strong>Шкала профессионального роста</strong></div>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-4">
          <div
            className="h-3 rounded-full"
            style={{ width: `${percent}%`, background: 'linear-gradient(90deg,#7c3aed,#06b6d4)' }}
          ></div>
        </div>

        <div className="flex justify-between text-xs">
          {LEVELS.map((lvl, i) => {
            const isActive = totalPoints >= lvl.min;
            return (
              <div
                key={i}
                className="flex flex-col items-center cursor-pointer"
                onClick={() => setModalLevel(lvl)}
                title={`${lvl.tip} (${lvl.min}-${lvl.max} баллов)`}
              >
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded-full text-white font-bold ${
                    isActive ? 'bg-indigo-600' : 'bg-gray-300'
                  }`}
                >
                  {lvl.emoji}
                </div>
                <div className="mt-1 text-center">{lvl.name}</div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-white card-shadow rounded-lg p-6">
        <div className="text-lg font-semibold mb-2">Ваш прогресс за {lastMonth.month}:</div>
        <div className="text-gray-600 mb-1">{`+${lastMonth.points} баллов активности`}</div>
        <div className="text-gray-600 mb-4">{`Всего накоплено: ${profile.activity ? profile.activity.reduce((s,a)=>s+a.points,0) : 0} баллов`}</div>
        <button onClick={() => setShowHistory(s => !s)} className="text-indigo-600 font-semibold underline mb-2">
          {showHistory ? 'Скрыть историю активности' : 'Показать историю активности'}
        </button>

        {showHistory && profile.activity && (
          <div className="mt-3 p-3 bg-gray-50 rounded space-y-1 text-sm text-gray-700">
            <div className="font-medium">История активности по месяцам:</div>
            {profile.activity.map(a => (
              <div key={a.month}>🗓️ {a.month}: {a.points} {a.month === lastMonth.month ? '(в процессе)' : 'баллов'}</div>
            ))}
          </div>
        )}
      </section>

      {modalLevel && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full text-center">
            <div className="text-lg font-semibold mb-2">{modalLevel.name}</div>
            <div className="text-gray-600 mb-4">{modalLevel.tip}</div>
            <div className="flex justify-center gap-4">
              <button onClick={() => { openAchievements(); setModalLevel(null); }} className="px-4 py-2 bg-indigo-600 text-white rounded">Перейти в Достижения</button>
              <button onClick={() => setModalLevel(null)} className="px-4 py-2 border rounded">Закрыть</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SupportPage({ onOpenSupportModal }) {
  return (
    <div className="p-6 flex items-center justify-center">
      <div className="bg-white card-shadow p-8 rounded-lg text-center max-w-lg w-full">
        <div className="text-lg font-semibold mb-4">Нужна помощь?</div>
        <div className="mb-6 text-sm text-gray-500">Если у вас возникли вопросы — напишите в поддержку.</div>
        <button 
          onClick={onOpenSupportModal} 
          className="px-6 py-3 bg-blue-600 text-white rounded-lg text-sm font-semibold shadow hover:bg-blue-700"
        >
          Написать поддержке
        </button>
      </div>
    </div>
  );
}

function SupportModal({ open, onClose }) {
  const [text, setText] = useState('');
  if(!open) return null;
  
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded p-6 w-full max-w-lg">
        <div className="flex items-center justify-between">
          <div className="font-semibold">Поддержка</div>
          <button onClick={onClose} className="text-gray-500">✕</button>
        </div>
        <textarea 
          value={text} 
          onChange={(e)=>setText(e.target.value)} 
          maxLength={1000} 
          rows={6} 
          className="w-full border p-3 rounded mt-4" 
          placeholder="Опишите проблему (до 1000 символов)"
        ></textarea>
        <div className="mt-4 flex justify-center">
          <button 
            onClick={()=>{ 
              alert('Сообщение отправлено (эмуляция)'); 
              setText(''); 
              onClose(); 
            }} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Отправить
          </button>
        </div>
      </div>
    </div>
  );
}

// Главный компонент приложения
function App() {
  const [currentRole, setCurrentRole] = useLocalState('st_role', ROLES.STUDENT);
  const [collapsed, setCollapsed] = useLocalState('st_collapsed', false);
  const [active, setActive] = useLocalState('st_active', 'home');
  const [values, setValues] = useLocalState('st_values', DEFAULT_STUDENT_STATE);
  
  const getProfileForRole = (role) => {
    const roleProfile = ROLE_PROFILES[role] || ROLE_PROFILES[ROLES.STUDENT];
    
    if (role === ROLES.STUDENT) {
      return {
        ...roleProfile,
        dob: DEFAULT_STUDENT_STATE.dob,
        uploaded: DEFAULT_STUDENT_STATE.uploaded,
        activity: DEFAULT_STUDENT_STATE.activity
      };
    }
    
    return roleProfile;
  };

  const [profile, setProfile] = useState(() => getProfileForRole(currentRole));
  const { points, total } = computePoints(values);
  const [notifOpen, setNotifOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [selectedCriterion, setSelectedCriterion] = useState(null);

  useEffect(() => {
    setProfile(getProfileForRole(currentRole));
  }, [currentRole]);

  function openAchievements() {
    setActive('achievements');
    setSelectedCriterion(null);
  }

  const handleSetActive = (key) => {
    setActive(key);
    setSelectedCriterion(null);
  };

  const handleRoleChange = (role) => {
    setCurrentRole(role);
    setActive('home');
    setSelectedCriterion(null);
  };

  function renderActivePage() {
    if (currentRole === ROLES.STUDENT) {
      if (active === 'achievements' && !selectedCriterion) {
        return (
          <div className="p-6">
            <div className="bg-white card-shadow rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Достижения студента</h2>
              <div className="text-center text-gray-500">
                <p>Общее количество баллов: {total}</p>
                <p>Функционал достижений в разработке...</p>
              </div>
            </div>
          </div>
        );
      }
      if (active === 'courses') {
        return (
          <div className="p-6">
            <div className="bg-white card-shadow rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Курсы студента</h2>
              <div className="text-center text-gray-500">
                <p>Функционал курсов в разработке...</p>
              </div>
            </div>
          </div>
        );
      }
      if (active === 'hard') {
        return (
          <div className="p-6">
            <div className="bg-white card-shadow rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Хард Скиллы</h2>
              <div className="text-center text-gray-500">
                <p>Функционал хард скиллов в разработке...</p>
              </div>
            </div>
          </div>
        );
      }
      if (active === 'events') {
        return (
          <div className="p-6">
            <div className="bg-white card-shadow rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Мероприятия</h2>
              <div className="text-center text-gray-500">
                <p>Функционал мероприятий в разработке...</p>
              </div>
            </div>
          </div>
        );
      }
      if (active === 'profile') {
        return (
          <div className="p-6">
            <div className="bg-white card-shadow rounded-lg p-6 max-w-3xl">
              <h2 className="text-xl font-bold mb-4">Профиль студента</h2>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold" style={{ background: profile.avatarBg }}>
                  {profile.name.split(' ').map(s=>s[0]).slice(0,2).join('').toUpperCase()}
                </div>
                <div>
                  <div className="text-lg font-semibold">{profile.name}</div>
                  <div className="text-sm text-gray-500">{profile.group}</div>
                </div>
              </div>
            </div>
          </div>
        );
      }
      if (active === 'contacts') {
        return (
          <div className="p-6">
            <div className="bg-white card-shadow rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Контакты</h2>
              <div className="text-center text-gray-500">
                <p>Функционал контактов в разработке...</p>
              </div>
            </div>
          </div>
        );
      }
      if (active === 'support') {
        return <SupportPage onOpenSupportModal={() => setSupportOpen(true)} />;
      }
    }

    // Для других ролей - базовые страницы
    if (active === 'support') {
      return <SupportPage onOpenSupportModal={() => setSupportOpen(true)} />;
    }

    // Главная страница по умолчанию
    return (
      <StudentHome 
        currentRole={currentRole} 
        totalPoints={total} 
        profile={profile} 
        openAchievements={openAchievements}
      />
    );
  }

  return (
    <div className="min-h-screen flex">
      <Sidebar 
        collapsed={collapsed} 
        active={active} 
        setActive={handleSetActive} 
        currentRole={currentRole} 
      />
      <div className="flex-1 flex flex-col">
        <Header 
          onToggle={()=>setCollapsed(s=>!s)} 
          onOpenProfile={()=>{ setActive('profile'); setSelectedCriterion(null); }} 
          onToggleNotif={()=>setNotifOpen(s=>!s)} 
          profile={profile} 
          currentRole={currentRole} 
        />

        <main className="flex-1 overflow-auto bg-gray-50 p-4">
          <RoleSelector 
            currentRole={currentRole} 
            onRoleChange={handleRoleChange} 
          />
          {renderActivePage()}
        </main>

        <footer className="text-xs text-gray-400 p-3 text-center">
          Траектория — система отслеживания прогресса студентов. Данные сохраняются локально в браузере.
        </footer>
      </div>

      <SupportModal open={supportOpen} onClose={()=>setSupportOpen(false)} />

      {notifOpen && (
        <div className="fixed right-6 top-20 bg-white border rounded shadow p-4 z-40 w-80">
          <div className="font-semibold mb-2">Уведомления</div>
          <div className="text-sm text-gray-600">
            <div className="p-2 border-b">Новое достижение студента Иванова И.И.</div>
            <div className="p-2 border-b">Поступила заявка на подтверждение сертификата</div>
            <div className="p-2">Завтра мероприятие "Хакатон DataCup"</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;