-- Create tables
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('student', 'university_curator', 'company_curator', 'chairman', 'expert', 'admin')),
    organization VARCHAR(255),
    phone VARCHAR(50),
    avatar_bg VARCHAR(50) DEFAULT '#60a5fa',
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'blocked')),
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    group_name VARCHAR(100),
    university VARCHAR(255),
    direction VARCHAR(255),
    gpa DECIMAL(3,2) DEFAULT 0.00,
    total_points INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    match_percent INTEGER DEFAULT 0,
    success_percent INTEGER DEFAULT 0,
    leadership INTEGER DEFAULT 0,
    innovation INTEGER DEFAULT 0,
    practice_score INTEGER,
    dob DATE,
    resume VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS criteria (
    id SERIAL PRIMARY KEY,
    key VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    max_points INTEGER NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS student_points (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    criteria_id INTEGER REFERENCES criteria(id) ON DELETE CASCADE,
    points INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, criteria_id)
);

CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('Обязательный', 'Рекомендованный', 'Необязательный')),
    points INTEGER NOT NULL,
    direction VARCHAR(255),
    status VARCHAR(20) DEFAULT 'активен' CHECK (status IN ('активен', 'неактивен')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS student_courses (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'Не начат' CHECK (status IN ('Завершён', 'В процессе', 'Не завершён', 'Не начат')),
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, course_id)
);

CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('Семинар', 'Воркшоп', 'Хакатон', 'Конференция')),
    category VARCHAR(50) CHECK (category IN ('Обязательное', 'Рекомендованное', 'Необязательное')),
    points INTEGER,
    date TIMESTAMP NOT NULL,
    status VARCHAR(50) DEFAULT 'Запланировано' CHECK (status IN ('Запланировано', 'Завершено')),
    participants_count INTEGER DEFAULT 0,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS event_participants (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'Записан' CHECK (status IN ('Записан', 'Не записан')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, event_id)
);

-- Insert default criteria
INSERT INTO criteria (key, title, max_points, description) VALUES
('gpa', 'Успеваемость', 150, 'Средний балл (1–5) × 30'),
('courses', 'Курсы', 200, 'Каждый пройденный курс = 20 (макс. 10)'),
('events', 'Мероприятия', 50, 'Каждый семинар/воркшоп = 10 (макс. 5)'),
('projects', 'Проекты', 50, 'Каждый проект = 20 (мин.2)'),
('research', 'НИР', 50, 'Каждая защищённая работа = 20 (мин.2)'),
('hard', 'Хард Скиллы', 200, 'Каждый тест/навык = 10 (макс.20)'),
('intern', 'Практика/Стажировки', 100, 'Максимум 25 баллов за семестр (назначает куратор)'),
('recom', 'Рекомендации', 50, 'Каждая рекомендация = 25 (макс.2)')
ON CONFLICT (key) DO NOTHING;

-- Insert default courses
INSERT INTO courses (title, category, points, direction) VALUES
('Основы аналитики', 'Обязательный', 20, 'Экономика ИТ'),
('Python продвинутый', 'Рекомендованный', 20, 'Все направления'),
('Машинное обучение', 'Необязательный', 20, 'Программная инженерия'),
('Java для начинающих', 'Обязательный', 20, 'Информационные системы'),
('Бизнес-анализ', 'Рекомендованный', 20, 'Бизнес-информатика')
ON CONFLICT DO NOTHING;

-- Insert default events
INSERT INTO events (title, type, category, points, date, status, participants_count) VALUES
('Хакатон DataCup', 'Хакатон', 'Необязательное', 20, '2023-12-15', 'Завершено', 42),
('Семинар по аналитике', 'Семинар', 'Обязательное', 10, '2023-11-20', 'Завершено', 25),
('Конференция ИТ-2023', 'Конференция', 'Необязательное', 20, '2024-01-20', 'Запланировано', 0)
ON CONFLICT DO NOTHING;

-- Insert default users with different roles
INSERT INTO users (name, email, password, role, organization, phone, avatar_bg) VALUES
-- Student
('Женя Борисов', 'student@edu.ru', '$2a$10$N9qo8uLOickgx2ZMRZoMye.KB1.7Z7QwQZ7QwQZ7QwQZ7QwQZ7QwQ', 'student', 'СПБПУ', '+7 (911) 111-11-11', '#60a5fa'),

-- University Curator
('Анна Петрова', 'university@curator.ru', '$2a$10$N9qo8uLOickgx2ZMRZoMye.KB1.7Z7QwQZ7QwQZ7QwQZ7QwQZ7QwQ', 'university_curator', 'СПБПУ', '+7 (911) 222-22-22', '#10b981'),

-- Company Curator
('Дмитрий Смирнов', 'company@curator.ru', '$2a$10$N9qo8uLOickgx2ZMRZoMye.KB1.7Z7QwQZ7QwQZ7QwQZ7QwQZ7QwQ', 'company_curator', 'Газпром нефть', '+7 (911) 333-33-33', '#8b5cf6'),

-- Chairman
('Мария Иванова', 'chairman@committee.ru', '$2a$10$N9qo8uLOickgx2ZMRZoMye.KB1.7Z7QwQZ7QwQZ7QwQZ7QwQZ7QwQ', 'chairman', 'Комиссия', '+7 (911) 444-44-44', '#f59e0b'),

-- Expert
('Алексей Козлов', 'expert@industry.ru', '$2a$10$N9qo8uLOickgx2ZMRZoMye.KB1.7Z7QwQZ7QwQZ7QwQZ7QwQZ7QwQ', 'expert', 'НОЦ', '+7 (911) 555-55-55', '#ef4444'),

-- Admin
('Администратор Системы', 'admin@system.ru', '$2a$10$N9qo8uLOickgx2ZMRZoMye.KB1.7Z7QwQZ7QwQZ7QwQZ7QwQZ7QwQ', 'admin', 'Система', '+7 (911) 666-66-66', '#6b7280')
ON CONFLICT (email) DO NOTHING;

-- Insert student records
INSERT INTO students (user_id, group_name, university, direction, gpa, total_points, level, match_percent, success_percent, leadership, innovation, practice_score) VALUES
(1, 'БП-401654/452467', 'СПБПУ', 'Экономика ИТ и бизнес-анализ', 4.2, 446, 4, 89, 82, 75, 80, 21),
(2, 'Куратор СПБПУ', 'СПБПУ', 'Экономика ИТ и бизнес-анализ', 4.5, 720, 6, 89, 82, 75, 80, 25),
(3, 'Куратор Яндекс', 'Яндекс', 'Информационные системы', 4.2, 650, 5, 76, 70, 65, 72, 18),
(4, 'Председатель комиссии', 'Комиссия', 'Все направления', 4.8, 820, 7, 92, 88, 85, 90, 23),
(5, 'Эксперт отрасли', 'НОЦ', 'Программная инженерия', 4.0, 580, 4, 68, 65, 60, 62, 16)
ON CONFLICT DO NOTHING;

-- Insert student points
INSERT INTO student_points (student_id, criteria_id, points) VALUES
(1, 1, 126), -- gpa
(1, 2, 60),  -- courses
(1, 3, 20),  -- events
(1, 4, 20),  -- projects
(1, 5, 0),   -- research
(1, 6, 60),  -- hard
(1, 7, 25),  -- intern
(1, 8, 25)   -- recom
ON CONFLICT DO NOTHING;

-- Insert student courses
INSERT INTO student_courses (student_id, course_id, status, completed_at) VALUES
(1, 1, 'Завершён', '2023-10-15'),
(1, 2, 'В процессе', NULL),
(1, 3, 'Не начат', NULL)
ON CONFLICT DO NOTHING;