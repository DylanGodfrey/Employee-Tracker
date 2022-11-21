const inquirer = require("inquirer");
require("console.table");
require("dotenv").config();
const mysql = require("mysql2");


// Create DB Conection
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    }
);

// Import helper files - validate inputs
const validate = require('./helpers/validate');


setTimeout(() => {promptUser();}, 1); // wrapped in setTimeout to prevent cTable getting overwritten by the prompt

// Prompt User for Choices
async function promptUser() {
  inquirer.prompt([
      {
        name: 'choices',
        type: 'list',
        message: 'Please select an option:',
        choices: [
          'View All Employees',
          'View All Roles',
          'View All Departments',
          'View All Employees By Department',
          'Add Employee',
          'Add Role',
          'Add Department',
          'Remove Employee',
          'Remove Role',
          'Remove Department',
          'Update Employee Role',
          'Update Employee Manager',
          'View Department Budgets',
          'Exit'
          ]
      }
    ])
    .then((answers) => {
      const {choices} = answers;

      switch (choices) {
        case 'View All Employees':
          viewAllEmployees();
          break;
        case 'View All Roles':
          viewAllRoles();
          break;
        case 'View All Departments':
          viewAllDepartments();
          break;
        case 'View All Employees By Department': 
          viewEmployeesByDepartments();
          break;
        case 'Add Employee': {
          addEmployee();
          //viewAllEmployees();
          break;
        }
        case 'Remove Employee':
          //removeEmployee();
          break;
        case 'Update Employee Role':
          //update.updateEmployeeRole();
          //viewAll
          break;
        case 'Update Employee Manager':
          //updateEmployeeManager();
          break;
        case 'Add Role':
          addRole();
          // viewAllRoles after update
          break;
        case 'Remove Role':
          //removeRole();
          break;
        case 'Add Department':
          //create.addDepartment();
          // viewAllDepartment after update
          break;
        case 'View Department Budgets':
          // read.viewDepartmentBudget();
          break;
        case 'Remove Department':
          //removeDepartment();
          break;
        case 'Exit':
          //exit
          break;
        default:
          break;
      }
  });
};

// ------------------- METHODS ---------------------------------------//

// ------------------- VIEWS ---------------------------------------//
const viewAllEmployees = () => {  
  db.query("SELECT employee.id as id, employee.first_name as 'First Name', employee.last_name as 'Last Name', role.title as 'Job Title', role.salary as 'Salary', department.name as 'Department', employee.manager_id as 'Manager ID' FROM employee, role, department GROUP BY employee.id ORDER BY employee.id", (err, results) => {
    console.table("\nEmployees", results); // Display results in a table
  });
  promptUser();
}
const viewAllRoles = () => {  
  db.query("SELECT role.id as id, role.title as Title, role.salary as Salary, department.name as Department FROM role JOIN department on role.department_id = department.id", (err, results) => {
    console.table("\nRoles", results); // Display results in a table
  });
  promptUser();
}
const viewAllDepartments = () => {  
  db.query("SELECT id, name as 'Department Name' FROM department", (err, results) => {
    console.table("\nDepartments", results); // Display results in a table
  });
  promptUser();
}
const viewEmployeesByDepartments = () => {  
  db.query("SELECT employee.first_name, employee.last_name, department.name as Department FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id", (err, results) => { 
    console.table("\nEmployees By Department", results); // Display results in a table
  });
  promptUser();
}


// ------------------- ADDS ---------------------------------------//

const addEmployee = async () => {
  let rolesList = [];
  db.query("SELECT role.title as Title FROM role", (err, results) => {
    results.forEach((role) => {
      rolesList.push(role.Title);
    });
  });

  let managersNames =[];
  db.query("SELECT CONCAT(first_name, ' ', last_name) as Name FROM employee", (err, results) => {
    results.forEach((manager) => {
      managersNames.push(manager.Name);
    });
  });

  await inquirer.prompt([
    {
      type: 'input',
      name: 'firstName',
      message: "What is the employee's first name?",
      //validate: addFirstName => {(addFirstName) ? true : false;}
    },
    {
      type: 'input',
      name: 'lastName',
      message: "What is the employee's last name?",
      //validate: addLastName => {(addLastName) ? true : false;}
    },
    {
      type: 'list',
      name: 'role',
      message: "What is the employee's role?",
      choices: rolesList
    },
    {
      type: 'list',
      name: 'manager',
      message: "Who is the employee's manager?",
      choices: managersNames
    }
  ])
  .then((answer) => {
    db.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", [answer.firstName, answer.lastName, (answer.role.indexOf(answer.role)+1), (answer.manager.indexOf(answer.manager)+1)], (err) => {
      err ? console.error(err) : true; // Log any errors
  });
  });
}



const addRole = async () => {
  let deptList = [];
  db.query("SELECT department.name as Department FROM department", (err, results) => {
    results.forEach((dept) => {
      deptList.push(dept.Department);
    });
  });

  await inquirer.prompt([
    {
      name: "title",
      type: "input",
      message: "What is the name of your new role?",
      //validate: validate.validateString,
    },
    {
      name: "dept",
      type: "list",
      message: "Which department is this new role in?",
      choices: deptList,
    },
    {
      name: "salary",
      type: "input",
      message: "What is the salary of this new role?",
      //validate: validate.validateSalary,
    }
  ])
  .then((answer) => {
    db.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)", [answer.title, answer.salary, (answer.dept.indexOf(answer.dept)+1)], (err) => {
      err ? console.error(err) : true; // Log any errors
  });
  });
}

// ------------------- REMOVES ---------------------------------------//