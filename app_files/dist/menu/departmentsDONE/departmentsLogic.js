import inquirer from 'inquirer';
import { pool } from '../../connections.js';
import departmentMenu from './departmentsMenu.js';
import { queryViewDepartments } from '../../connections.js';
const viewDepartments = async (callback) => {
    const { rows } = await pool.query('SELECT * FROM departments');
    const viewDepartment = rows.map((data) => data.dept_name);
    await queryViewDepartments('dept_details');
    if (callback === '') {
        departmentMenu();
    }
    else {
        return viewDepartment;
    }
};
const addDept = async () => {
    const answer = await inquirer.prompt([
        {
            type: 'input',
            name: 'addDept',
            message: 'Please input the name of the new department'
        }
    ]);
    const add = `
    INSERT INTO departments (dept_name, id)
    VALUES ($1, (SELECT COALESCE(MAX(id), 0) + 1 FROM departments))`;
    try {
        await pool.query(add, [answer.addDept]);
        console.log(`${answer.addDept} has been added to departments`);
        viewDepartments();
        departmentMenu();
    }
    catch (err) {
        console.error('Error', err);
    }
};
const removeDept = async () => {
    const departments = await viewDepartments();
    const answer = await inquirer.prompt([
        {
            type: 'list',
            name: 'removeDept',
            message: 'Choose which department you would like to remove',
            choices: departments.map(dept => ({
                name: dept,
                value: dept
            }))
        }
    ]);
    const remove = `
    DELETE FROM departments 
    WHERE dept_name = $1`;
    try {
        console.log(`${answer.removeDept} department removed`);
        await pool.query(remove, [answer.removeDept]);
        viewDepartments();
        departmentMenu();
    }
    catch (err) {
        console.error('Error', err);
    }
};
export { viewDepartments, addDept, removeDept };
