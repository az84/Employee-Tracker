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
          'Find employees by manager',
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

        if (choices === 'Find Employees by Manager') {
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

        if (choices === 'View All Roles') {
            viewAllRoles();
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

// View all employees that report to a specific manager
function findEmployeesByManager() {
  
    const managerEmpl = "SELECT employee.id, employee.first_name, employee.last_name, department.name AS department, role.title FROM employee LEFT JOIN role on role.id = employee.role_id LEFT JOIN department ON department.id = role.department_id WHERE manager_id = ?;";
  
    db.query(managerEmpl, function (err, res) {
      if (err) throw err;

      const managerChoices = res
        .map(({ manager_id, manager }) => ({
          value: manager_id,
          name: manager,
        }));
  
      inquirer
        .prompt(prompt.viewManagerPrompt(managerChoices))
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
  

// remove an employee
function removeEmployee ()  {
  const deleteEmployee = `SELECT * FROM employee`;

  db.query(deleteEmployee, (err, data) => {
    if (err) throw err; 
    console.table (data)
    const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));

    inquirer.prompt([
      {
        input: 'choices',
        name: 'name',
        message: "Which employee would you like to remove?",
        choices: employees
      }
    ])
      .then(selectEmployee => {
        const del = selectEmployee.name;

        const remove = `DELETE FROM employee WHERE id = ?`;

        db.query(remove, del, (err, result) => {
          if (err) throw err;
        console.table (result)
          displayPropmts();
    });
  });
 });
};


// Update an employee's role
function updateEmployeeRole ()  { 
  const updateEmployee = `SELECT * FROM employee`;

  db.query(updateEmployee, (err, data) => {
    if (err) throw err; 
    console.table (data);
    const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));

    inquirer.prompt([
      {
        input: 'choices',
        name: 'name',
        message: "Which employee would you like to update?",
        choices: employees
      }
    ])
      .then(listEmp => {
        const employee = listEmp.name;
        const params = []; 
        params.push(employee);

        const selectRole = `SELECT * FROM role`;

        db.query(selectRole, (err, data) => {
          if (err) throw err; 
          console.table (data);

          const roles = data.map(({ id, title }) => ({ name: title, value: id }));
          
            inquirer.prompt([
              {
                type: 'list',
                name: 'role',
                message: "What is the employee's new role?",
                choices: roles
              }
            ])
                .then(roleEmp => {
                const role = roleEmp.role;
                params.push(role); 
                
                let employee = params[0]
                params[0] = role
                params[1] = employee 
                


                const updateEmp = `UPDATE employee SET role_id = ? WHERE id = ?`;

                db.query(updateEmp, params, (err, result) => {
                  if (err) throw err;
                console.table(result);
              
                displayPropmts();
          });
        });
      });
    });
  });
};


// All Roles
function viewAllRoles() {
  const findAllRoles =
  "SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id;"
 ;
     connection.promise().query(findAllRoles, (err, response) => {
      if (err) throw err;
      console.table (response);
    })
     displayPrompts();
}

// Add a role
function addRole() {
  const createRole = "SELECT department.id, department.name FROM department;";

	connection.query(createRole, function (err, res) {
		if (err) throw err;
  console.table (res);
	// 	// Select department for role
		const departmentChoices = res.map(({ id, name }) => ({
			value: id,
			name: `${id} ${name}`,
		}));
 
      prompt([
        {
          name: "title",
          message: "What is the name of the role?"
        },
        {
          name: "salary",
          message: "What is the salary of the role?"
        },
        {
          type: "list",
          name: "department_id",
          message: "Which department does the role belong to?",
          choices: departmentChoices
        }
      ])
        .then(role => {
          const createRole = "SELECT department.id, department.name FROM department;";

          connection.query(createRole, function (err, res) {
            if (err) throw err;
          console.table (res);
           })
         displayPrompts()
        })
    })
}

// Delete a role
function removeRole () {
  const revRole = `SELECT * FROM role`; 

  db.query(revRole, (err, data) => {
    if (err) throw err; 
    console.table (data);

    const role = data.map(({ title, id }) => ({ name: title, value: id }));

    inquirer.prompt([
      {
        type: 'list', 
        name: 'role',
        message: "What role do you want to delete?",
        choices: role
      }
    ])
      .then(roleChoice => {
        const role = roleChoice.role;
        const del = `DELETE FROM role WHERE id = ?`;

        connection.query(del, role, (err, result) => {
          if (err) throw err;

          displayPrompts();
      });
    });
  });
;}

// // View all deparments
function viewAllDepartments() {
  const findAllDepartments =
  "SELECT department.id, department.name FROM department;"
 ;
     db.query(findAllDepartments, (err, response) => {
      if (err) throw err;
      console.table(response)
    })
     displayPrompts();
}


const addDepartment = () => {
  inquirer
    .prompt([
      {
        name: 'departmentAdd',
        message: 'What is the name of the Department?',
        
      }
    ])
    .then((answer) => {
      const addDepartments = `INSERT INTO department (department_name) VALUES (?)`;
      db.query(addDepartments, answer.departmentAdd, (err, response) => {
        if (err) throw err;
    console.table(response);

     displayPropmts();
      });
    });
};


// function to delete department
function removeDepartment ()  {
  const deleteDepart = `SELECT * FROM department`; 

  db.query(deleteDepart, (err, data) => {
    if (err) throw err; 
    console.table(data);

    const deleted = data.map(({ name, id }) => ({ name: name, value: id }));

    inquirer.prompt([
      {
        type: 'list', 
        name: 'dept',
        message: "What department do you want to delete?",
        choices: deleted
      }
    ])
      .then(departmentDel => {
        const deleted = departmentDel.deleted;
        const departChoices = `DELETE FROM department WHERE id = ?`;

        db.query(departChoices, deleted, (err, result) => {
          if (err) throw err;
          console.table(result)

        displayPrompts();
      });
    });
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
    .then(() => displayPrompts());
}

// update employee manager
function updateEmployeeManager () {
  inquirer.prompt([
    {
      type: 'input',
      name: 'fistName',
      message: "What is the employee's first name?",
      validate: inputFirstName => {
        if (inputFirstName) {
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
      validate: inputLastName => {
        if (inputLastName) {
            return true;
        } else {
            return false;
        }
      }
    }
  ])
    .then(answer => {
    const params = [answer.fistName, answer.lastName]
    const employeeRole = `SELECT role.id, role.title FROM role`;
  
    db.promise().query(employeeRole, (err, data) => {
      if (err) throw err; 
      console.table(data)
      
      const roles = data.map(({ id, title }) => ({ name: title, value: id }));

      inquirer.prompt([
            {
              type: 'list',
              name: 'role',
              message: "What is the employee's role?",
              choices: roles
            }
          ])
            .then(selectRole => {
              const role = selectRole.role;
              params.push(role);

              const emp = `SELECT * FROM employee`;

             db.query(emp, (err, data) => {
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
                  .then(displayManager => {
                    const manager = displayManager.manager;
                    params.push(manager);

                    const man = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                    VALUES (?, ?, ?, ?)`;

                    db.query(man, params, (err, result) => {
                    if (err) throw err;
                    console.table(result);

                    displayPrompts();
              });
            });
          });
        });
     });
  });
};

// Exit the application
function exit() {
  connection.end();
}
