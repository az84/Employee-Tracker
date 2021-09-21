use employees;

INSERT INTO department
    (name)
VALUES
    ('Marketing'),
    ('Human Resources'),
    ('Accounting'),
    ('Compliance');

INSERT INTO role
    (title, salary, department_id)
VALUES
    ('Marketing Associate', 40000, 1),
    ('Marketing Manager', 90000, 1),
    ('Human Resources Associate', 45000, 2),
    ('Human Resources Manager', 140000, 2),
    ('Account Manager', 120000, 3),
    ('Accountant', 50000, 3),
    ('Compliance Associate', 40000, 4),
    ('Compliance Officer', 200000, 4);

INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ('Mark', 'Watson', 1, NULL),
    ('Liam', 'Miller', 2, 1),
    ('Gary', 'Monroe', 3, NULL),
    ('Steven', 'Holmes', 4, 3),
    ('Harry', 'Charles', 5, NULL),
    ('Michael', 'Bailey', 6, 5),
    ('Traci', 'Jason', 7, NULL),
    ('Henry', 'Russell', 8, 7);
