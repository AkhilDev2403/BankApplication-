const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/Bankapplication',{
    useNewUrlParser: true,
    useUnifiedTopology : true
})

//create model
const User = mongoose.model('User', {
    acc_no : Number,
    user_name : String,
    password : Number,
    balance : Number,
    transaction : []
})
 

module.exports = {
    User
}