import inquirer from 'inquirer';
import { connectToDb } from './connections.js';
import departmentMenu from './menu/departmentsDONE/departmentsMenu.js';
import employeesMenu from './menu/employeesDONE/employeesMenu.js';
import rolesMenu from './menu/rolesDONE/rolesMenu.js';
const mainMenu = async () => {
    const answer = await inquirer.prompt([
        {
            type: 'list',
            name: 'mainMenu',
            message: 'Where would you like to navigate?',
            choices: ['Departments', 'Roles', 'Employees', 'Exit', new inquirer.Separator]
        }
    ]);
    switch (answer.mainMenu) {
        case 'Departments':
            await departmentMenu();
            break;
        case 'Roles':
            await rolesMenu();
            break;
        case 'Employees':
            await employeesMenu();
            break;
        case 'Exit':
            const confirm = await inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'leaveApp',
                    message: 'Are you sure you want to exit?',
                    default: false
                }
            ]);
            if (confirm.leaveApp) {
                console.log('Bye bye then!');
                process.exit(0);
            }
            else {
                mainMenu();
                break;
            }
    }
};
const init = async () => {
    try {
        connectToDb();
        mainMenu();
    }
    catch (err) {
        console.error('Failed to start application', err);
        process.exit(1);
    }
};
init();
export default mainMenu;
