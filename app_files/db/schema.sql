DROP DATABASE IF EXISTS employee_tracker;
CREATE DATABASE employee_tracker;

\c employee_tracker;

CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    dept_name VARCHAR(30) UNIQUE NOT NULL
);

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(30) UNIQUE NOT NULL,
    salary DECIMAL(10,2) NOT NULL CHECK (salary >= 0)
);

CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER NOT NULL,
    department_id INTEGER NOT NULL,
    manager_id INTEGER,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE RESTRICT,
    FOREIGN KEY (manager_id) REFERENCES employees(id) ON DELETE RESTRICT,
    CHECK (manager_id != id)
);

--SELECT * FROM dept_details;
CREATE VIEW dept_details AS
SELECT 
    d.id,
    d.dept_name
FROM departments d;

--SELECT * FROM employee_details;
CREATE VIEW employee_details AS
SELECT
    e.id,
    e.first_name,
    e.last_name,
    d.dept_name,
    r.title,
    r.salary,
    m.first_name as manager_first_name,
    m.last_name as manager_last_name
FROM employees e
LEFT JOIN departments d ON e.department_id = d.id
LEFT JOIN roles r ON e.role_id = r.id
LEFT JOIN employees m ON e.manager_id = m.id;

--SELECT * FROM role_details;
CREATE VIEW role_details AS
SELECT DISTINCT
    r.title AS title,
    r.salary
FROM roles r
ORDER BY salary;
