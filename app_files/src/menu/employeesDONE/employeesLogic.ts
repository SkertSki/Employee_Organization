import inquirer from 'inquirer';
import { pool } from '../../connections.js';
import employeesMenu from './employeesMenu.js';
import { QueryResult } from 'pg';
import { queryViewEmployees } from '../../connections.js';

interface Dept {
    id: number,
    dept_name: string
}

interface Employee {
    id: number,
    first_name: string,
    last_name: string
    role_id: number,
    department_id: number
}

interface Role {
    id: number,
    title: string,
    salary: number
}

const viewDepts = async () => {
    try{
        const { rows }: any = await pool.query(`SELECT * FROM departments`);
        const viewDepts = rows.map((data: Dept) => ({
            id: data.id,
            dept_name: data.dept_name
        }));
        
        return viewDepts;
    
    } catch (error) {
        console.error('Error querying view:', error);
    }
}

const viewEmployees = async (callback?: string) => {
    try {
        const { rows }: any = await pool.query(`SELECT * FROM employees`);
        const viewEmployee = rows.map((data: Employee) => ({
            id: data.id,
            first_name: data.first_name,
            last_name: data.last_name,
            role_id: data.role_id,
            department_id: data.department_id
        }));

        await queryViewEmployees('employee_details');

        if (callback === '') {
            employeesMenu();
        } else {
            return viewEmployee;
        }
    } catch (error) {
        console.error('Error querying view:', error);
    }
}

const viewManager = async () => {
    const { rows } = await pool.query(`
    SELECT first_name, last_name, department_id
    FROM employees
    WHERE role_id
    IN (1, 2)`);

    const answer = await inquirer.prompt([
        {
        
            type: 'list',
            name: 'viewManager',
            message: 'Select an employee to view their manager',
            choices: rows.map(employee =>({
                name: `${employee.first_name} ${employee.last_name}`,
                value: {
                    first_name: employee.first_name,
                    last_name: employee.last_name,
                    department_id: employee.department_id
                }
            }))
        }
    ]);

    const viewManagers = `
    SELECT first_name, last_name
    FROM employees
    WHERE department_id = $1
    AND role_id = 3`;

    try {
        const { rows: manager } = await pool.query(viewManagers, [answer.viewManager.department_id]);

        console.log(`\n${answer.viewManager.first_name} ${answer.viewManager.last_name}'s manager is ${manager[0].first_name} ${manager[0].last_name}\n`);
    } catch (err) {
        console.error('Error', err);
    }

    employeesMenu();

}

const viewRoles = async () => {
    try{
        const { rows }: any = await pool.query(`SELECT * FROM roles`);
        const viewRoles = rows.map((data: Role) => ({
            id: data.id,
            title: data.title,
            salary: data.salary
        }));
        
        return viewRoles;

    } catch (error) {
        console.error('Error querying view:', error);
    }
}

const addEmployee = async () => {
    const dept: Dept[] = await viewDepts();
    const roles: Role[] = await viewRoles();

    const answer = await inquirer.prompt([
        {
            type: 'input',
            name: 'addEmployeeFirst',
            message: 'Please input the first name of the new employee'
        },
        {
            type: 'input',
            name: 'addEmployeeLast',
            message: 'Please input the last name of the new employee'
        },
        {
            type: 'list',
            name: 'addRole',
            message: 'Please select that title of the new employee',
            choices: roles.map((role: Role) =>({
                name: `${role.title}`,
                value: {
                    id: role.id,
                    title: role.title,
                    salary: role.salary
                }
            }))
        },
        {
            type: 'list',
            name: 'addDept',
            message: 'Please select which department the employee will work in',
            choices: dept.map((dept: Dept) =>({
                name: `${dept.dept_name}`,
                value: {
                    id: dept.id,
                    dept_name: dept.dept_name
                }
            }))
        }
    ])
    
    const manager = `
    SELECT * FROM employees
    WHERE role_id = 3
    AND department_id = $1`

    const add = `
    INSERT INTO employees (id, first_name, last_name, role_id, department_id, manager_id) 
    VALUES ((SELECT COALESCE(MAX(id), 0) + 1 FROM employees), $1, $2, $3, $4, $5)`

    try {
        const employeeManager = await pool.query(manager, [answer.addDept.id]);
        const { id } = employeeManager.rows[0];


        await pool.query(add, [
            answer.addEmployeeFirst, 
            answer.addEmployeeLast, 
            answer.addRole.id, 
            answer.addDept.id,
            id
        ]);

        console.log(`\n${answer.addEmployeeFirst} ${answer.addEmployeeLast} has been hired\n`)

        viewEmployees();
        employeesMenu();
    } catch (err) {
        console.error('Error', err);
    }
};

const removeEmployee = async () => {
    try {
        const employees: Employee[] = await viewEmployees();
        
        if (employees.length === 0) {
            console.log('There is nothing to remove');
            employeesMenu();
            return;
        }

        const answer = await inquirer.prompt([
            {
                type: 'list',
                name: 'removeEmployee',
                message: 'Choose which employee you would like to remove',
                choices: employees.map((employee: Employee) =>({
                    name: `${employee.first_name} ${employee.last_name}`,
                    value: {
                        first_name: employee.first_name,
                        last_name: employee.last_name,
                        department_id: employee.department_id
                    }
                }))
            }
        ]);

        const confirm = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'confirmEmployee',
                message: `Are you sure you want to delete ${answer.removeEmployee.first_name} ${answer.removeEmployee.last_name}`,
                default: false
            }
        ])

        if (!confirm.confirmEmployee) {
            employeesMenu();
            return;
        }

        const remove = `
        DELETE FROM employees 
        WHERE first_name = $1
        AND last_name = $2`

        console.log(`\n${answer.removeEmployee.first_name} ${answer.removeEmployee.last_name} has been fired\n`);

        await pool.query<Employee>(remove, [
            answer.removeEmployee.first_name, 
            answer.removeEmployee.last_name]);

        viewEmployees();
        employeesMenu();
    } catch (err) {
        console.error('Error', err);
    }
};

const promoteEmployee = async () => {
    const employees: Employee[] = await viewEmployees();

    const answer = await inquirer.prompt([
        {
            type: 'list',
            name: 'promoteEmployee',
            message: 'Choose which employee you would like to promote',
            choices: employees.map((employee: Employee) =>({
                name: `${employee.first_name} ${employee.last_name}`,
                value: {
                    first_name: employee.first_name,
                    last_name: employee.last_name,
                    role_id: employee.role_id
                }
            }))
        }
    ]);

    const idMax = await pool.query(`
    SELECT MAX(role_id - 1)
    FROM employees`);

    const highestId = idMax.rows[0].max;

    const promote = `
    UPDATE employees
    SET role_id = LEAST(role_id + 1, $1)
    WHERE first_name = $2
    AND last_name = $3`

    try {
        await pool.query<Employee>(promote, [
            highestId, 
            answer.promoteEmployee.first_name,
            answer.promoteEmployee.last_name]);

        console.log(`\n${answer.promoteEmployee.first_name} ${answer.promoteEmployee.last_name} has been promoted\n`);

        viewEmployees();
        employeesMenu();
    } catch (err) {
        console.error('Error', err);
    }
};

const demoteEmployee = async () => {
    const employees: Employee[] = await viewEmployees();

    const answer = await inquirer.prompt([
        {
            type: 'list',
            name: 'demoteEmployee',
            message: 'Choose which employee you would like to demote',
            choices: employees.map((employee: Employee) =>({
                name: `${employee.first_name} ${employee.last_name}`,
                value: {
                    first_name: employee.first_name,
                    last_name: employee.last_name,
                    role_id: employee.role_id
                }
            }))
        }
    ]);

    const demote = `
    UPDATE employees
    SET role_id = GREATEST(role_id - 1, 1)
    WHERE first_name = $1
    AND last_name = $2`

    try {
        await pool.query<Employee>(demote, [ 
            answer.demoteEmployee.first_name, 
            answer.demoteEmployee.last_name]);

        console.log(`\n${answer.demoteEmployee.first_name} ${answer.demoteEmployee.last_name} has been demoted\n`);

        viewEmployees();
        employeesMenu();
    } catch (err) {
        console.error('Error', err);
    }
};

const updateDepartment = async () => {
    const employeesResult: QueryResult<Employee> = await pool.query(`
        SELECT *
        FROM employees
        WHERE role_id
        IN (1, 2)`);
    
    const deptResult: QueryResult<Dept> = await pool.query(`
        SELECT *
        FROM departments`);

        const employees = employeesResult.rows;

        const departments = deptResult.rows;

    const answer = await inquirer.prompt([
        {
            type: 'list',
            name: 'changeManagement',
            message: 'Which employee would you you like to assign to a difference department?',
            choices: employees.map((employee: Employee) => ({
                name: `${employee.first_name} ${employee.last_name}`,
                value: {
                    first_name: employee.first_name,
                    last_name: employee.last_name,
                    id: employee.id
                }
            }))
        },
        {
            type: 'list',
            name: 'whichDepartment',
            message: 'Which department would you like to assign the employee to?',
            choices: departments.map((department: Dept) => ({
                name: `${department.dept_name}`,
                value: {
                    id: department.id,
                    dept_name: department.dept_name
                }
            }))
        }
    ]);

    const newDepartment = `
    UPDATE employees
    SET department_id = $1
    WHERE id = $2`

    try {
        await pool.query(newDepartment, [
            answer.whichDepartment.id, 
            answer.changeManagement.id])

        console.log(`\n${answer.changeManagement.first_name} ${answer.changeManagement.last_name} has now been assigned to the ${answer.whichDepartment.dept_name} department\n`)

        viewEmployees();
        employeesMenu();
    } catch (err) {
        console.error('Error', err);
    }
}

export { viewEmployees, viewManager, addEmployee, removeEmployee, promoteEmployee, demoteEmployee, updateDepartment };