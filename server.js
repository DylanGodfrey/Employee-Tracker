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
          db.query("SELECT employee.id as id, employee.first_name as 'First Name', employee.last_name as 'Last Name', role.title as 'Job Title', role.salary as 'Salary', department.name as 'Department', employee.manager_id as 'Manager ID' FROM employee, role, department GROUP BY employee.id ORDER BY employee.id", (err, results) => {
            console.table("\nEmployees", results); // Display results in a table
        });
          break;
          case 'View All Roles':
            db.query("SELECT role.id as id, role.title as Title, role.salary as Salary, department.name as Department FROM role JOIN department on role.department_id = department.id", (err, results) => {
              console.table("\nRoles", results); // Display results in a table
            });
            break;
          case 'View All Departments':
            db.query("SELECT id, name as 'Department Name' FROM department", (err, results) => {
              console.table("\nDepartments", results); // Display results in a table
          });
            break;
          case 'View All Employees By Department': 
            db.query("SELECT employee.first_name, employee.last_name, department.name as Department FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id", (err, results) => { 
              console.table("\nEmployees By Department", results); // Display results in a table
            });
            break;
          case 'Add Employee':
            //create.addEmployee();
            // viewAllEmployee after update
            break;
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
            //create.addRole();
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