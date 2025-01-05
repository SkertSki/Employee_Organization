import inquirer from 'inquirer';
import mainMenu from '../../index.js';
import { viewEmployees, viewManager, addEmployee, removeEmployee, promoteEmployee, demoteEmployee, updateDepartment } from './employeesLogic.js'


const employeesMenu = async () => {
    const answer = await inquirer.prompt([
        {
            type: 'list',
            name: 'employeesMenu',
            message: '',
            choices: [
                'View Employees',
                'View an Employees Manager', 
                'Add Employee', 
                'Remove Employee', 
                'Promote Employee',
                'Demote Employee',
                'Change Employee Department',
                'Back to Main Menu',
                new inquirer.Separator
            ]
        }
    ]);

    switch (answer.employeesMenu) {
        case 'View Employees':
            console.log('You are looking at employees');
            const callback = '';
            viewEmployees(callback);
            break;
        case 'View an Employees Manager':
            viewManager();
            break;
        case 'Add Employee':
            addEmployee();
            break;
        case 'Remove Employee':
            removeEmployee();
            break;
        case 'Promote Employee':
            promoteEmployee();
            break;    
        case 'Demote Employee':
            demoteEmployee();
            break;
        case 'Change Employee Department':
            updateDepartment();
            break;
        case 'Back to Main Menu':
            mainMenu();
    }
}

export default employeesMenu;