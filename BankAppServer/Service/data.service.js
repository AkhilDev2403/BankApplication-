//connect with database.js
const db = require('./database')


users = {
  1000: { acc_no: 1000, user_name: "Akhil", password: 123, balance: 15000, transaction: [] },
  2000: { acc_no: 2000, user_name: "Loki", password: 456, balance: 25000, transaction: [] },
  3000: { acc_no: 3000, user_name: "Ben", password: 789, balance: 8000, transaction: [] }
}


//const validateRegister = (acc_no, user_name, password) => {

//console.log("register called");  //acc_no is not defined
// return                          //user_name is not defind,.....

// if (acc_no in users) {
//   return {
//     StatusCode: 422,
//     status: false,
//     message: "User already exist! Please Login"
//   }
// }
// else {

//   users[acc_no] = {
//     acc_no,
//     user_name,
//     password,
//     balance: 0,
//     transaction: []
//   }
//   return {
//     StatusCode: 200,
//     status: true,
//     message: "Successfully Registered!"
//   }
// }

// }

const validateRegister = (acc_no, user_name, password) => {

  return db.User.findOne({ acc_no }).then(user => {

    if (user) {
      return {
        StatusCode: 422,
        status: false,
        message: "User already exist! Please Login"
      }
    }
    else {

      const newUser = new db.User({
        acc_no,
        user_name,
        password,
        balance: 0,
        transaction: []
      })

      newUser.save()

      return {
        StatusCode: 200,
        status: true,
        message: "Successfully Registered!"
      }

    }

  })


}


// validateLogin = (req, acc_no, password) => {

//   if (acc_no in users) {
//     if (password == users[acc_no]["password"]) {

//       currentUser = users[acc_no]["user_name"]
//       req.session.currentAcc = acc_no

//       //console.log(currentUser);                                   // currently logged in username      (loki)
//       //console.log(req.session.currentAcc);                        // currently logged in user account number  (5000)

//       return {
//         StatusCode: 200,
//         status: true,
//         message: "Login Success!"
//       }

//     }

//     else {
//       return {
//         StatusCode: 422,
//         status: false,
//         message: "invalid password!"
//       }

//     }
//   }
//   else {
//     return {
//       StatusCode: 422,
//       status: false,
//       message: "invalid account number!"
//     }
//   }

// }

validateLogin =  (req, acc_no, password) => {

  return db.User.findOne({ acc_no, password })
    .then(user => {

      if (user) {
        req.session.currentAcc = user.acc_no

        return {
          StatusCode: 200,
          status: true,
          message: "Login Success!",
          userName : user.user_name,
          currentAcc : user.acc_no
        }

      }
      
        return {
          StatusCode: 422,
          status: false,
          message: "invalid user!"
        }
      

    })


}


// const validateDeposit = (acc_no, password, amount) => {

//   // if (!(req.session.currentAcc)) {
//   //   return{
//   //     StatusCode: 422,                                                // used in middleware,   actually we need to use these codes in deopsit,withdraw,transaction_history, or everywhere this code demands...
//   //     status: false,                                                  therefore we can simply call AuthenticationMiddleware , so that everywhere these code will work
//   //     message: "Please Login first"
//   //   }
//   // }


//   let amt = parseInt(amount)

//   if (acc_no in users) {

//     if (password == users[acc_no]["password"]) {

//       users[acc_no]["balance"] += amt

//       users[acc_no].transaction.push({
//         amount: amt,
//         type: "Credit"
//       })

//       // console.log(users[acc_no].transaction);                          //[ { amount: 2000, type: 'Credit' } ]

//       return {
//         StatusCode: 200,
//         status: true,
//         message: amt + "Successfully Credited..! New Balance is :" + users[acc_no]["balance"]
//       }

//     }
//     else {
//       return {
//         StatusCode: 422,
//         status: false,
//         message: "invalid password!"
//       }
//     }
//   }
//   else {
//     return {
//       StatusCode: 422,
//       status: false,
//       message: "invalid account number!"
//     }
//   }



// }


const validateDeposit = (acc_no, password, amount) => {

  


  let amt = parseInt(amount)

  return db.User.findOne({
    acc_no,
    password
  }).then(user=>{
   
    if(!user){
      return {
        StatusCode: 422,
        status: false,
        message: "invalid account number!"
      }
    }
    user.balance += amt
    user.transaction.push({
      amount: amt,
      type: "Credit"
    })
    user.save()
    return{
      StatusCode: 200,
        status: true,
        message: amt + "Successfully Credited..! New Balance is :" + user.balance
    }

  })
}


// const validateWithdraw = (acc_no, password, amount) => {


//   let amt = parseInt(amount)

//   if (acc_no in users) {

//     if (password == users[acc_no]["password"]) {

//       if (users[acc_no]["balance"] > amt) {

//         users[acc_no]["balance"] -= amt

//         users[acc_no].transaction.push({
//           amount: amt,
//           type: "Debit"
//         })

//         // console.log(users[acc_no].transaction);                        //[ { amount: 2000, type: 'Debit' } ]


//         return {
//           StatusCode: 200,
//           status: true,
//           message: amt + "Successfully Debited..! New Balance is" + users[acc_no]["balance"]
//         }

//       }
//       else {
//         return {
//           StatusCode: 422,
//           status: false,
//           message: "Insufficient Balance!"
//         }
//       }


//     }
//     else {
//       return {
//         StatusCode: 422,
//         status: false,
//         message: "invalid password!"
//       }
//     }
//   }
//   else {
//     return {
//       StatusCode: 422,
//       status: false,
//       message: "invalid account number!"
//     }
//   }

// }


const validateWithdraw = (req, acc_no, password, amount) => {


  let amt = parseInt(amount)

  return db.User.findOne({
    acc_no,
    password
  })
  .then(user=>{
    if(!user){
      return {
        StatusCode: 422,
        status: false,
        message: "invalid user!"
      }
    }
    if(req.session.currentAcc != acc_no){
      return {
        StatusCode: 422,
        status: false,
        message: "Operation Denied"
      }
    }
    if(user.balance < amt){
      return {
        StatusCode: 422,
        status: false,
        message: "Insufficient Balance!"
      }
    }
    user.balance -= amt
    user.transaction.push({
      amount: amt,
      type: "Debit"
    })
    user.save()
    return{
      StatusCode: 200,
      status: true,
      message: amt + "Successfully Debited..! New Balance is" + user.balance
    }
  })


}



// const GetTransaction = (req) => {

//   return {
//     StatusCode: 200,
//     status: true,
//     transaction: users[req.session.currentAcc].transaction
//   }

// }


//a mthd 1

// const GetTransaction = (req) => {

//   return db.User.findOne({
//     acc_no : req.session.currentAcc
//   }).then(user=>{
//     if(user){
//       return {
//         StatusCode: 200,
//         status: true,
//         transaction: user.transaction
//       }
//     }
//   })

  

// }

// mthd 2

const GetTransaction = (acc_no) => {

  return db.User.findOne({
    // acc_no : req.session.currentAcc
    acc_no
  }).then(user=>{
    if(user){
      return {
        StatusCode: 200,
        status: true,
        transaction: user.transaction
      }
    }
  })

  

}

const deleteAcc = (acc_no) =>{
  return db.User.deleteOne({
    acc_no
  }).then(user=>{
    if(!user){
      return {
        StatusCode: 422,
        status: false,
        message: "Operation failed"
      }
    }
    return{
      StatusCode: 200,
      status: true,
      message: "Account Number"+acc_no+"Deleted Successfully"
    }
  })
}


module.exports = {
  validateRegister,
  validateLogin,
  validateDeposit,
  validateWithdraw,
  GetTransaction,
  deleteAcc
}