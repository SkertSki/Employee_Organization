import inquirer from 'inquirer';
import { pool } from '../../connections.js';
import rolesMenu from './rolesMenu.js';
import { queryViewRoles } from '../../connections.js';

interface Roles {
    id: number,
    title: string,
    salary: number
}

const viewRoles = async (callback?: string) => {
    const { rows }: any = await pool.query('SELECT * FROM roles');
    const viewRole = rows.map((data: Roles) => ({
        id: data.id,
        title: data.title,
        salary: data.salary
    }));

    await queryViewRoles('role_details');

    if (callback === '') {
        rolesMenu();
    } else {
        return viewRole;
    }
}

const addRole = async () => {
    const answer = await inquirer.prompt([
        {
            type: 'input',
            name: 'addRole',
            message: 'Please input the title of the new role being added'
        },
        {
            type: 'input',
            name: 'addRoleSalary',
            message: 'Please input the salary of the new role being added'
        }
    ])

    const idMax = await pool.query(`
        SELECT MAX(id)
        FROM roles`);
    
    const highestId = idMax.rows[0].max;

    const add = `
    INSERT INTO roles (id, title, salary)
    VALUES ($1, $2, $3)`

    try {
        await pool.query(add, [(highestId + 1), answer.addRole, answer.addRoleSalary]);
        console.log(`${answer.addRole} has been added as a new role, with a salary of ${answer.addRoleSalary}`)

        viewRoles();
        rolesMenu();
    } catch (err) {
        console.error('Error', err);
    }
};

const removeRole = async () => {
    const roles = await viewRoles();

    if (roles.length === 0) {
        console.log('There is nothing to remove');
        return rolesMenu();
    }

    const answer = await inquirer.prompt([
        {
            type: 'list',
            name: 'removeRole',
            message: 'Choose which role you would like to remove',
            choices: roles.map((role: Roles) =>({
                name: `${role.title}`,
                value: {
                    id: role.id,
                    title: role.title
                }
            }))
        }
    ]);

    const confirm = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'confirmRole',
            message: `Are you sure you want to delete ${answer.removeRole.title}`,
            default: false
        }
    ])

    if (!confirm.confirmRole) {
        return rolesMenu();
    }

    try {

        const usageCheck = `
        SELECT COUNT (*)
        FROM employees
        WHERE role_id = $1`

        const usageResult = await pool.query(usageCheck, [answer.removeRole.id]);

        if (usageResult.rows[0].count > 0) {
            console.log(`Cannot remove role "${answer.removeRole.title}" as it is currently assigned to employees`);
            rolesMenu();
        }

        const remove = `
        DELETE FROM roles 
        WHERE id = $1`;

        await pool.query(remove, [answer.removeRole.id]);
        console.log(`The role ${answer.removeRole.title} has been removed`);

        viewRoles();
        rolesMenu();
        
    } catch (err) {
        console.error('Error', err);
    }
};

export { viewRoles, addRole, removeRole };