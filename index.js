const inquirer = require("inquirer");
const db = require("./db/connection");
require("console.table");


  displayPrompts();


function displayPrompts () {
  inquirer.prompt([
      {
        name: 'choices',
        type: 'list',
        message: 'Select from the list:',
        choices: [
          'Find All Employees',
          'Find All Roles',
          'Find All Departments',
          'Find All Employees By Department',
          'Find Employees By Manager',
          'Find Department Budget',
          'Update Employee Role',
          'Update Employee Manager',
          'Add Employee',
          'Add Role',
          'Add Department',
          'Remove Employee',
          'Remove Role',
          'Remove Department',
          'Exit'
          ]
      }
    ])
    .then((answers) => {
      const {choices} = answers;

        if (choices === 'Find All Employees') {
            findAllEmployees();
        }

        if (choices === 'Find All Departments') {
          findAllDepartments();
      }

        if (choices === 'Find All Employees By Department') {
            findAllEmployeesByDepartment();
        }

        if (choices === 'Find Employees By Manager') {
          findEmployeesByManager();
      }

        if (choices === 'Add Employee') {
            addEmployee();
        }

        if (choices === 'Remove Employee') {
            removeEmployee();
        }

        if (choices === 'Update Employee Role') {
            updateEmployeeRole();
        }

        if (choices === 'Update Employee Manager') {
            updateEmployeeManager();
        }

        if (choices === 'Find All Roles') {
            findAllRoles();
        }

        if (choices === 'Add Role') {
            addRole();
        }

        if (choices === 'Remove Role') {
            removeRole();
        }

        if (choices === 'Add Department') {
            addDepartment();
        }

        if (choices === 'Find Department Budget') {
            findDepartmentBudget();
        }

        if (choices === 'Remove Department') {
            removeDepartment();
        }

        if (choices === 'Exit') {
            connection.end();
            exit ()
        }
  });
};
// View all employees
function findAllEmployees() {
  const findAllEmployees =
      "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;"
    ;
     db.query(findAllEmployees, (err, response) => {
      if (err) throw err;
      console.table(response);
     displayPrompts();
     });
    }
  
    // View all employees that report to a specific manager
function findEmployeesByManager() {

  const managerEmpl = "SELECT employee.id, employee.first_name, employee.last_name, department.name AS department, role.title FROM employee LEFT JOIN role on role.id = employee.role_id LEFT JOIN department ON department.id = role.department_id WHERE manager_id = ?;";

  db.query(managerEmpl, function (err, res) {
    if (err) throw err;
    console.table(res)

    const managerChoices = res
      .map(({ manager_id, manager }) => ({
        value: manager_id,
        name: manager,
      }));

    inquirer.prompt(prompt.viewManagerPrompt(managerChoices))
      .then(function (answer) {
        const empMan = `SELECT e.id, e.first_name, e.last_name, r.title, CONCAT(m.first_name, ' ', m.last_name) AS manager
      FROM employee e
      JOIN role r
      ON e.role_id = r.id
      JOIN department d
      ON d.id = r.department_id
      LEFT JOIN employee m
      ON m.id = e.manager_id
      WHERE m.id = ?`;

       db.query(empMan, answer.managerId, function (err, res) {
          if (err) throw err;

          console.table( res);
          displayPrompts();

        });
      });
  });
}

// View all employees that belong to a department
function findAllEmployeesByDepartment () {
  const employeeDepart = `SELECT employee.first_name, 
                      employee.last_name, 
                      department.name AS department
               FROM employee 
               LEFT JOIN role ON employee.role_id = role.id 
               LEFT JOIN department ON role.department_id = department.id`;

  db.query(employeeDepart, (err, rows) => {
    if (err) throw err; 
    console.table(rows); 
    displayPrompts();
  });          
};

// View department budget
function findDepartmentBudget () {
  const viewDepartmentBud =
  "SELECT department.id, department.name, SUM(role.salary) AS utilized_budget FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id GROUP BY department.id, department.name;"
 ;
     db.query(viewDepartmentBud, (err, response) => {
      if (err) throw err;
      console.table(response);
    })
    displayPrompts();
}

function findAllDepartments() {
  const findAllDepartments =
  "SELECT department.id, department.name FROM department;"
 ;
     db.query(findAllDepartments, (err, response) => {
      if (err) throw err;
      console.table(response)
    })
     displayPrompts();
}
// All Roles
function findAllRoles() {
  const findAllRoles =
  "SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id;"
 ;
     db.query(findAllRoles, (err, response) => {
      if (err) throw err;
      console.table (response);
    })
     displayPrompts();
}



// Exit the application
function exit() {
  connection.end();
}
