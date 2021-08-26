import { v4 as uuidv4 } from 'uuid';

const descriptionSpent = ["Amazon UPI", "Morrisons Petrol", "Bussiness Loan", "OYO Hotels", "Monthly Account Admission Fee",
"Loan repayment", "Electricity Bill", "Ola Cabservices", "Dominos Pizza Bill", "Makers of Milkshake Bill", "SMS Notofication Fee",
"Reliance Digital Payment", "Monthly SIP"];

const descriptionCredit = ["Phonepe UPI", "Monthly Salary", "Fixed Deposit Interest", "From Ravi UPI", "NEFT from Satwik",
"Bussiness Loan", "Bonus Salary", "Investments Released"];

function randomDate(date1, date2){
    function randomValueBetween(min, max) {
      return Math.random() * (max - min) + min;
    }
    var date1 = date1 || '01-01-1970'
    var date2 = date2 || new Date().toLocaleDateString()
    date1 = new Date(date1).getTime()
    date2 = new Date(date2).getTime()
    if( date1>date2){
        return new Date(randomValueBetween(date2,date1))   
    } else{
        return new Date(randomValueBetween(date1, date2))  

    }
}

const generateBankAccount = (req) => {
    const {
        bankName, userName , password, userId, email, imgUrl
    } = req;
    const generateBalance = 20000 + Math.floor(Math.random() * 20000);
    return {
        "autoFetch": true,
        "currencyCode": "INR",
        "currencySymbol": "Rs.",
        "iType": "bank",
        "id": uuidv4(),
        "name": bankName,
        "balance": generateBalance,
        "uniqueUserId": email,
        "userRef": userId,
        "imgUrl": imgUrl
    }
}

const generateTransactions = (req) => {
    const { email, accountId, no, balance, fromDate, toDate } = req;

    var transactions = [];
    var dates = [];
    var closeBalance = balance;

    for(var i=0; i<no/2; i++){
        var amount = (-1)*(100 + Math.floor(Math.random()*300)); 
        transactions = [...transactions, {
            date: '',
            details: descriptionSpent[Math.floor(Math.random()*13)],
            amount,
            closingBalance: 0,
            transactionId: Math.floor(Math.random()*10000000000),
            accountId,
            email
        }]
        dates = [...dates, randomDate(fromDate, toDate)];
    };
    for(var i=0; i<no/2; i++){
        var amount = (1)*(100 + Math.floor(Math.random()*300)); 
        transactions = [...transactions, {
            date: '',
            details: descriptionCredit[Math.floor(Math.random()*8)],
            amount,
            closingBalance: 0,
            transactionId: Math.floor(Math.random()*10000000000),
            accountId,
            email
        }]
        dates = [...dates, randomDate(fromDate, toDate)];
    };

    dates.sort((a,b) => (a.getTime() - b.getTime()));
    transactions.sort(() => Math.random() - 0.5);
    
    for(var i=0; i<no; i++){
        transactions[i].date = dates[i]; 
        transactions[i].closingBalance = transactions[i].amount + closeBalance;
        closeBalance = transactions[i].closingBalance;
    }

    return {transactions, closeBalance};
}

export default {
    generateBankAccount,
    generateTransactions
};
