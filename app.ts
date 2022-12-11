import inquirer from "inquirer";
import { faker } from "@faker-js/faker";
import chalk from "chalk";
import chalkAnimation from "chalk-animation";
import figlet from "figlet";
import gradient from "gradient-string";

let sleep = () => {
    return new Promise((res) => {
        setTimeout(res, 2000);
    })
}

type Answers = {
    user_name: string;
    pin: string;
    accType: string;
    options: string;
    cashAmount: number;
};

// balance for atm users
let balance = Math.floor(Math.random() * 100000);

async function welcome() {
    const rainbowTitle = chalkAnimation.rainbow(
        `
              Welcome to the ATM Machine \n        
        `
    );
    await sleep();
    rainbowTitle.stop();


    console.log(gradient.pastel.multiline(figlet.textSync("ATM", { horizontalLayout: 'full' })))

    
    
    console.log('\n');
    console.log(
        `
         ${chalk.cyan.bold(`how to sign in?`)}          
         ${chalk.hex('#FFA500').bold(`first, we give you an auto-generated username and password`)} 
         ${chalk.hex('#FFA500').bold(`you just enter the auto-generated username and password to unlock our atm machine features like`)}
         ${chalk.green.bold(`fund-transfers fund-withdrawals fund-deposits and pay utility-bills.`)}       
         ${chalk.red.bold(`if you want to exit our atm machine just go Current Account or Saving Account option `)} 
         ${chalk.red.bold(`and just select the exit option you will exit our atm machine.`)}         
        `
    );
}

await welcome()
