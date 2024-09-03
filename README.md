# SimpleToDoApp
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(60) NOT NULL
);

CREATE TABLE priorities (
	priority_id SERIAL PRIMARY KEY,
	priority VARCHAR (10) NOT NULL
);
INSERT INTO priorities (priority)
VALUES
('low'),
('medium'),
('high');

CREATE TABLE categories (
	category_id SERIAL PRIMARY KEY,
	category VARCHAR (50) NOT NULL
);

INSERT INTO categories (category)
VALUES
('personal'),
('work'),
('shopping');

CREATE TABLE todos (
  todo_id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  title VARCHAR(300) NOT NULL,
  due_date DATE NOT NULL,
  priority INTEGER REFERENCES priorities(priority_id),
  category INTEGER REFERENCES categories(category_id),
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE todosdescription (
	descr_id SERIAL PRIMARY KEY,
	todo_id INTEGER REFERENCES todos(todo_id) ON DELETE CASCADE,
	description TEXT
);




.env file:
SESSION_SECRET=""
PG_USER="postgres"
PG_HOST="localhost"
PG_DATABASE=""
PG_PASSWORD=""
PG_PORT="5432" or "5433"



Tommy Hilfiger Color Palette:
	#1b2651	(27,38,81)
#cd2028	(205,32,40)
#ffffff	(255,255,255)
#edeae1	(237,234,225)
#166c96	(22,108,150)