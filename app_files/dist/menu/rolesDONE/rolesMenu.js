import inquirer from 'inquirer';
import mainMenu from '../../index.js';
import { viewRoles, addRole, removeRole } from './rolesLogic.js';
const rolesMenu = async () => {
    const answer = await inquirer.prompt([
        {
            type: 'list',
            name: 'rolesMenu',
            message: '',
            choices: [
                'View Roles',
                new inquirer.Separator,
                'Add Roles',
                'Remove Roles',
                new inquirer.Separator,
                'Back to Main Menu',
                new inquirer.Separator
            ]
        }
    ]);
    switch (answer.rolesMenu) {
        case 'View Roles':
            console.log('You are looking at roles');
            const callback = '';
            viewRoles(callback);
            break;
        case 'Add Roles':
            addRole();
            break;
        case 'Remove Roles':
            removeRole();
            break;
        case 'Back to Main Menu':
            mainMenu();
    }
};
export default rolesMenu;
