#! /usr/bin/env node
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
              Welcome to the ATM \n        
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

// take input form user
let atm_input = async () => {
    let result: Answers = await inquirer.prompt([
        {
            name: "accType",
            type: "list",
            choices: ["Current Account", "Saving Account"],
            message: "please choose your account type: ",
        },
        {
            name: "options",
            type: "list",
            choices: [
                "Fund Transfer",
                "Cash Withdraw",
                "Deposit funds",
                "Balance Inquiry",
                "Utility Bill",
                "Exit"
            ],
            message: "choose one of the given below options: ",
            when(answers) {
                return answers.accType;
            },
        },
    ]);

    return result;
};

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
        console.log(`${chalk.red.bold("Insufficient funds. Please enter a different amount.")}`);
    } else if (amount) {
        balance -= amount;

        console.log(`${chalk.green.bold(`Sucessful \n Transfer Amount ${amount}`)}`);
        console.log(`your remaining balance is ${balance}`);
    } else {
        console.log("something went wrong");
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
        console.log(`${chalk.red.bold("Insufficient funds. Please enter a different amount.")}`);
    }
    else if (billInformation) {
        console.log(`${chalk.green.bold(`Paying ${billInformation.payment_amount} PKR to ${billInformation.utility_company} form account number ${billInformation.account_number}`)}`);
    }
}


// take user information 
let takeUserInformation = async () => {
    let { options } = await atm_input();


    if (options === "Balance Inquiry") {
        console.log(`${chalk.green.bold(`Your current balance is: ${balance} PKR`)}`);
        await takeUserInformation()
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
                console.log(`${chalk.red.bold("Insufficient funds. Please enter a different amount.")}`);
            } else {
                balance -= amount;
                console.log(`${chalk.green.bold(`${amount} PKR withdrawn. Your new balance is: ${balance}`)}`);
                await takeUserInformation()
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
                `${chalk.green.bold(`${amount} PKR deposited. Your new balance is: ${balance}PKR`)}`
            );
            await takeUserInformation()
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
        await takeUserInformation()
    }
    // pay utility bills
    else if (options === "Utility Bill") {
        await payUtilityBills()
        await takeUserInformation()
    }
    else if (options === "Exit") {
        console.log("Goodbye!");
    }


}



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
        await takeUserInformation()
    } else {
        console.log('Invalid username or password.');
    }
}

signIn()
