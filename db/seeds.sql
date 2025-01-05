INSERT INTO departments (id, dept_name)
VALUES 
(01, 'Security'),
(02, 'HVAC'),
(03, 'Engineering'),
(04, 'CEO');

INSERT INTO roles (id, title, salary)
VALUES 
(01, 'Base employee', 40000),
(02, 'Team Lead', 55000),
(03, 'Manager', 75000),
(04, 'CEO', 240000);

INSERT INTO employees (id, first_name, last_name, role_id, department_id, manager_id)
VALUES 
--CEO
(01, 'Super', 'Man', 04, 04, NULL),

--MANAGERS
(02, 'Jonny', 'Cage', 03, 01, 01),
(03, 'Martha', 'Stewart', 03, 02, 01),
(04, 'Jackie', 'Chan', 03, 03, 01),

--WORKERS
(05, 'Sammy', 'Banani', 01, 01, 02),
(06, 'George', 'Jungle', 01, 02, 03),
(07, 'Martin', 'Luther', 01, 03, 04),
(08, 'Johnny', 'Depp', 02, 01, 02),
(09, 'Jack', 'Jane', 02, 02, 03),
(10, 'Hot', 'Rod', 02, 03, 04);
