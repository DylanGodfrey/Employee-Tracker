INSERT INTO department(department_name)
VALUES("Engineering"), ("Sales"), ("Finance"), ("Legal"), ("Marketing");

INSERT INTO role(title, salary, department_id)
VALUES("Engineer", 90000, 1), ("Senior Engineer", 130000, 1), ("CFO", 250000, 3), ("Legal Team Lead", 300000, 4);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES ('Johnnie', 'Random', 1, 2), ('James', 'Smith', 1, null), ('Ronnie', 'Manning', 1, 2), ('Jimmy', 'Jones', 2, 2), ('Larry', 'Legal', 4, null);

