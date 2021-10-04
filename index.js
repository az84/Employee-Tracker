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
          'Find Department Budget',
          'Update Employee Role',
          'Add Employee',
          'Add Role',
          'Add Department',
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

        if (choices === 'Add Employee') {
            addEmployee();
        }


        if (choices === 'Update Employee Role') {
            updateEmployeeRole();
        }

        if (choices === 'Find All Roles') {
            findAllRoles();
        }

        if (choices === 'Add Role') {
            addRole();
        }

        if (choices === 'Add Department') {
            addDepartment();
        }

        if (choices === 'Find Department Budget') {
            findDepartmentBudget();
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

 
// View all employees that belong to a department
function findAllEmployeesByDepartment () {
  const employeeDepart = `SELECT employee.first_name, employee.last_name, department.name AS department FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id`;

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

// function to add a department 
function addDepartment () {
  inquirer.prompt([
    {
      type: 'input', 
      name: 'addDept',
      message: "What department do you want to add?",
      validate: addDept => {
        if (addDept) {
            return true;
        } else {
            return false;
        }
      }
    }
  ])
    .then(answer => {
      const sql = `INSERT INTO department (name)
                  VALUES (?)`;
      db.query(sql, answer.addDept, (err, result) => {
        if (err) throw err;
        console.log('Added ' + answer.addDept + " to departments!"); 

        findAllDepartments();
    });
  });
};


function addRole() {
  inquirer.prompt([
      {
        type: "input",
        message: "Please enter employee's title",
        name: "roleTitle"
      },
      {
        type: "input",
        message: "Please enter employee's salary",
        name: "roleSalary"
      },
      {
        type: "input",
        message: "Enter the employee's department ID",
        name: "roleDept"
      }
    ])
    .then(function (res) {
      const title = res.roleTitle;
      const salary = res.roleSalary;
      const departmentID = res.roleDept;
      const query = `INSERT INTO role (title, salary, department_id) VALUES ("${title}", "${salary}", "${departmentID}")`;
      db.query(query, function (err, res) {
        if (err) {
          throw err;
        }
        console.table(res);
        findAllRoles();
      });
    });
}

// function to add an employee 
function addEmployee () {
  inquirer.prompt([
    {
      type: 'input',
      name: 'fistName',
      message: "What is the employee's first name?",
      validate: addFirst => {
        if (addFirst) {
            return true;
        } else {
            return false;
        }
      }
    },
    {
      type: 'input',
      name: 'lastName',
      message: "What is the employee's last name?",
      validate: addLast => {
        if (addLast) {
            return true;
        } else {
            return false;
        }
      }
    }
  ])
    .then(answer => {
    const params = [answer.fistName, answer.lastName]

    // grab roles from roles table
    const enterRole = `SELECT role.id, role.title FROM role`;
  
    db.query(enterRole, (err, data) => {
      if (err) throw err; 
      
      const roles = data.map(({ id, title }) => ({ name: title, value: id }));

      inquirer.prompt([
            {
              type: 'list',
              name: 'role',
              message: "What is the employee's role?",
              choices: roles
            }
          ])
            .then(roleAdd => {
              const role = roleAdd.role;
              params.push(role);

              const managerSql = `SELECT * FROM employee`;

              db.query(managerSql, (err, data) => {
                if (err) throw err;

                const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));

                // console.log(managers);

                inquirer.prompt([
                  {
                    type: 'list',
                    name: 'manager',
                    message: "Who is the employee's manager?",
                    choices: managers
                  }
                ])
                  .then(managerAdd => {
                    const manager = managerAdd.manager;
                    params.push(manager);

                    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                    VALUES (?, ?, ?, ?)`;

                    db.query(sql, params, (err, result) => {
                    if (err) throw err;

                    findAllEmployees();
              });
            });
          });
        });
     });
  });
};


// function to update an employee 
function updateEmployeeRole () {
  // get employees from employee table 
  const updateEmployee = `SELECT * FROM employee`;

 db.query(updateEmployee, (err, data) => {
    if (err) throw err; 

  const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));

    inquirer.prompt([
      {
        type: 'list',
        name: 'name',
        message: "Which employee would you like to update?",
        choices: employees
      }
    ])
      .then(empChoice => {
        const employee = empChoice.name;
        const params = []; 
        params.push(employee);

        const roleAdd = `SELECT * FROM role`;

       db.query(roleAdd, (err, data) => {
          if (err) throw err; 

          const roles = data.map(({ id, title }) => ({ name: title, value: id }));
          
            inquirer.prompt([
              {
                type: 'list',
                name: 'role',
                message: "What is the employee's new role?",
                choices: roles
              }
            ])
                .then(roleChoice => {
                const role = roleChoice.role;
                params.push(role); 
                
                let employee = params[0]
                params[0] = role
                params[1] = employee 

                const update = `UPDATE employee SET role_id = ? WHERE id = ?`;

                db.query(update, params, (err, result) => {
                  if (err) throw err;
              
                findAllEmployees();
          });
        });
      });
    });
  });
};
