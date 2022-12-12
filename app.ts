#! /usr/bin/env node
import inquirer from "inquirer";
import { faker } from "@faker-js/faker";
import chalk from "chalk";
import chalkAnimation from "chalk-animation";
import figlet from "figlet";
import gradient from "gradient-string";



type Answers = {
    user_name: string;
    pin: string;
    accType: string;
    options: string;
    cashAmount: number;
};

// balance for atm users
let balance = Math.floor(Math.random() * 100000);

let sleep = () => {
    return new Promise((res) => {
        setTimeout(res, 2000);
    })
}

async function welcome() {
    const rainbowTitle = chalkAnimation.rainbow(
        `
              Welcome to the ATM \n        
        `
    );
    await sleep();
    rainbowTitle.stop();


    console.log(gradient.pastel.multiline(figlet.textSync("ATM", { horizontalLayout: 'full' })))



    console.log('\n');
    console.log(
        `
         ${chalk.cyan.bold(`How to sign in?`)}                   
         ${chalk.hex('#FFA500').bold(`First, we give you an auto-generated username and password`)} 
         ${chalk.hex('#FFA500').bold(`you just enter the auto-generated username and password to unlock our atm machine features like`)}
         ${chalk.green.bold(`fund transfers, fund withdrawals, fund deposits and pay utility-bills.`)}       
                 
        `
    );
}

await welcome()


// handle-transfer-account
const handleTransferAccounts = async function () {
    const transferTo = await inquirer.prompt({
        name: "username",
        type: "input",
        message: "Account Holders Name:",
        validate: (input) => {
            if (Number(input)) {
                return "Invalid Name";
            } else {
                return true;
            }
        },
    });
};

let handleTransfers = async (amount: number) => {

    if (amount > balance) {
        console.log(`${chalk.red.bold("Insufficient funds. Please enter a different amount.")} \n`);
    } else if (amount) {
        balance -= amount;
        
        console.log(`${chalk.green.bold(`Your transaction is successful and the transfer amount is ${amount} PKR`)} \n`);
        console.log(`${chalk.blue.bold(`your remaining balance is ${balance} PKR`)} \n`);        
    } else {
        console.log("something went wrong \n");
    }
};

// user-pay-utility-bills

let payUtilityBills = async () => {
    let billInformation = await inquirer.prompt([
        {
            type: "input",
            name: "utility_company",
            message: "Enter the name of the utility company:",
        },
        {
            type: "input",
            name: "account_number",
            message: "Enter your account number:",
        },
        {
            type: "input",
            name: "payment_amount",
            message: "Enter the amount you want to pay:",
        },
    ]);

    if (billInformation.payment_amount > balance) {
        console.log(`${chalk.red.bold("Insufficient funds. Please enter a different amount.")} \n`);
    }
    else if (billInformation) {
        balance -= billInformation.payment_amount
        console.log(`${chalk.green.bold(`Paying ${billInformation.payment_amount} PKR to ${billInformation.utility_company} form account number ${billInformation.account_number}`)} \n`);         
    }
}

let userInput = async () => {
    let atmInput: Answers = await inquirer.prompt([
        {
            name: "options",
            type: "list",
            choices: [
                "Fund Transfer",
                "Cash Withdraw",
                "Deposit funds",
                "Balance Inquiry",
                "Utility Bill",                
            ],
            message: "choose one of the given below options: ",                
        },  
    ])

    return atmInput
 }

let atm_input = async () => {    
    let result: Answers = await inquirer.prompt([        
        {
            name: "accType",
            type: "list",
            choices: ["Current Account", "Saving Account", "Exit"],
            message: "Do you want to perform the transaction or exit?: ",            
        },                  
    ]);

    if(result.accType === "Current Account" || result.accType === "Saving Account") {
        let { options } = await userInput()

        if (options === "Balance Inquiry") {                                         
            console.log(`${chalk.green.bold(`Your current balance is: ${balance} PKR \n`)}`);       
            await atm_input()       
        }

    // cash withdraw
    else if (options === "Cash Withdraw") {
        let result = await inquirer.prompt([
            {
                type: "input",
                name: "amount",
                message: "How much would you like to withdraw?",
            },
        ]);

        if (true) {
            const amount = parseInt(result.amount);
            if (amount > balance) {
                console.log(`${chalk.red.bold("Insufficient funds. Please enter a different amount.")} \n`);
                await atm_input()
            } else {
                balance -= amount;
                console.log(`${chalk.green.bold(`${amount} PKR withdrawn. Your new balance is: ${balance} PKR`)} \n`);  
                await atm_input()              
            }
        }
        
    }

    // deposit funds
    else if (options === "Deposit funds") {
        let result = await inquirer.prompt([
            {
                type: "input",
                name: "amount",
                message: "How much would you like to deposit?",
            },
        ]);

        if (result.amount) {
            const amount = parseInt(result.amount);
            balance += amount;
            console.log(
              `${chalk.green.bold(`${amount} PKR deposited. Your new balance is: ${balance}PKR`)} \n`
            );  
            
            await atm_input()
        }
    }

    // fund trunsfer
    else if (options === "Fund Transfer") {
        await handleTransferAccounts();
        const transferAmount = await inquirer.prompt([
            {
                name: "Amount",
                type: "input",
                message: "Transfer Amount",
                validate: (input) => {
                    if (Number(input)) {
                        return true;
                    } else {
                        return "Invalid Amount";
                    }
                },
            },
        ]);

        await handleTransfers(transferAmount.Amount);       
        atm_input()
    }

    else if(options === "Utility Bill") {       
        await payUtilityBills()  
        await atm_input()     
    }    
   
    else {
        console.log('please choose given options');            
    }
        
        
    }
    else if(result.accType === "Exit") {
        console.log('Thank you! for using the ATM.');        
    } else {
        console.log('please select correct option');
        
    }

};

let signIn = async () => {
    const username = faker.internet.userName();
    const password = faker.internet.password();
  
    console.log(
        `
         ${chalk.hex('#FFA500').bold(`your username is ${chalk.red.bold('==>')} ${chalk.green.bold(username)}`)}   
         ${chalk.hex('#FFA500').bold(`your password is ${chalk.red.bold('==>')} ${chalk.green.bold(password)}`)}         
        `
    )   
    
    
    let sign_in = await inquirer.prompt([
      {
          type: 'input',
          name: 'username',
          message: 'Enter your username:'
      },
      {
         type: 'password',
         mask: "#",
         name: 'password',
         message: 'Enter your password:'
      }    
    ])         
    
    if (sign_in.username === username && sign_in.password === password) {
       await atm_input()          
    } else {
        console.log('Invalid username or password.');
    }
}

await signIn()