# SimpleToDoApp

This is a simple ToDo App built using Node.js, Express, PostgreSQL, and Passport.js for user authentication. It allows users to create an account, log in, and manage their tasks with categories like Work, Personal, and Shopping.

## Features

- User registration and login with secure password handling using bcrypt.
- Session management using express-session.
- ToDo management: add, update, and delete tasks.
- Tasks categorized by type: Work, Personal, Shopping.
- Tasks are stored in PostgreSQL database.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (version 14.x or higher)

- PostgreSQL

- npm (Node Package Manager)

- A .env file with the following variables:

```bash
PG_USER=<your_postgres_username>
PG_PASSWORD=<your_postgres_password>
PG_HOST=<your_postgres_host>
PG_PORT=<your_postgres_port>
PG_DATABASE=<your_postgres_db_name>
SESSION_SECRET=<a_random_string_for_session_secret>
```


## Installation

Fork and Clone the repository:

```bash
git clone <repository-url>
cd simple-to-do-app
```
Install dependencies:

```bash
npm install
```

**Set up your .env file with your database credentials and session secret.**

Create and configure the PostgreSQL database. Use the following schema as a starting point:

```sql

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

```

## Run the app:
Install nodemon

```bash
npm install -g nodemon
```
Run app

```bash
nodemon index.js
```
Open your browser and go to <http://localhost:3000>

## Usage
- Register and Login
- Go to /register to create a new account.
- Log in using your email and password at /login.
- Managing Todos:
    - After logging in, you’ll be redirected to the ToDo page.
    - You can add new tasks with a title, due date, priority, and category.
    - Mark tasks as completed, update, or delete them.


## Built With
- Node.js - JavaScript runtime
- Express.js - Web framework for Node.js
- PostgreSQL - SQL database
- bcrypt - Password hashing
- Passport.js - Authentication middleware
- express-validator - Data validation and sanitation



<!-- https://www.color-hex.com/color-palette/89010 
Tommy Hilfiger Color Palette:
	#1b2651	(27,38,81)
#cd2028	(205,32,40)
#ffffff	(255,255,255)
#edeae1	(237,234,225)
#166c96	(22,108,150) -->
