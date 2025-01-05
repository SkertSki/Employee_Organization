import inquirer from 'inquirer';
import mainMenu from "../../index.js";
import { viewDepartments, addDept, removeDept } from './departmentsLogic.js'

const departmentMenu = async () => {
    const answer = await inquirer.prompt([
        {
            type: 'list',
            name: 'departmentMenu',
            message: '',
            choices: [
                'View Departments',
                new inquirer.Separator, 
                'Add Department', 
                'Remove Department',
                new inquirer.Separator, 
                'Back to Main Menu',
                new inquirer.Separator
            ]
        }
    ]);

    switch (answer.departmentMenu) {
        case 'View Departments':
            console.log('You are looking at departments');
            const callback = '';
            viewDepartments(callback);
            break;
        case 'Add Department':
            addDept();
            break;
        case 'Remove Department':
            removeDept();
            break;
        case 'Back to Main Menu':
            mainMenu();
            break;
    }
};

export default departmentMenu;
