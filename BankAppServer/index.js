const express =  require('express')
const DataService = require('./Service/data.service')
const session = require('express-session')
const cors = require('cors')


const app = express()
app.use(express.json())                                               //{ acc_no: 8000, user_name: 'Benly', password: 8000 }

app.use(cors({
    origin : 'http://localhost:4200',
    credentials : true
}))

//session
app.use(session({
    secret : 'UniqueSecureString',
    resave : false,
    saveUninitialized : false
}))

//middleware

// app.use((req,res, next)=>{
//     console.log("APPLICATON SPECIFIC MIDDLEWARES");                          // 1st this will run contineously, never get in to rqst/resolve it so we use next()

// })

app.use((req, res, next)=>{
    console.log("Application Specific Middleware"); 
    next()
})

const AuthenticationMiddleware = (req, res, next) =>{
    
  if (!(req.session.currentAcc)) {
    res.json({
      StatusCode: 422,                                                                     
      status: false,
      message: "Please Login first"
    })
  }
  else{
      next()
  }

}

//app.use(AuthenticationMiddleware)


app.get('/',(req,res)=>{
    res.send("GET METHOD")
})

app.post('/', (req,res)=>{
    res.send("POST METHOD")
})

app.put('/', (req, res)=>{
    res.send("PUT METHOD")
})

app.delete('/', (req, res)=>{
    res.send("DELETE METHOD")
})

app.patch('/', (req,rs)=>{
    rs.send("PATCH METHOD")
})

//resolving register()

// app.post('/register', (req,res)=>{
//     console.log(req.body);                                         //{ acc_no: 8000, user_name: 'Benly', password: 8000 }

//     const result = DataService.validateRegister(req.body.acc_no, req.body.user_name, req.body.password)
//     // res.status(result.StatusCode).send(result.message)
//     res.status(result.StatusCode).json(result)

// })

app.post('/register', (req,res)=>{
        DataService.validateRegister(req.body.acc_no, req.body.user_name, req.body.password)
        .then(result=>{
            res.status(result.StatusCode).json(result)
        })
    
    })


// app.post('/login', (req,res)=>{
//     console.log(req.body);                                         
//    // console.log(req.sessionID);                                    //0jdFrCvx2HSpV2YEEsozgWlPxIYcVcqX


//     const result = DataService.validateLogin(req, req.body.acc_no, req.body.password)
//      res.status(result.StatusCode).send(result.message)
//     res.status(result.StatusCode).json(result)

// })

app.post('/login', (req,res)=>{
 
    DataService.validateLogin(req, req.body.acc_no, req.body.password)
    .then(result=>{
        res.status(result.StatusCode).json(result)
    })

})

// app.post('/deposit', AuthenticationMiddleware, (req,res)=>{
//     console.log(req.body);                                         
//     console.log(req);

//     const result = DataService.validateDeposit(req.body.acc_no, req.body.password, req.body.amount)
//     res.status(result.StatusCode).json(result)

// })

app.post('/deposit', AuthenticationMiddleware, (req,res)=>{
   // console.log(req.body);                                         
   // console.log(req);

     DataService.validateDeposit(req.body.acc_no, req.body.password, req.body.amount) 
     .then(result =>{
        res.status(result.StatusCode).json(result)
     })

})

// app.post('/withdraw', AuthenticationMiddleware, (req,res)=>{
//     console.log(req.body);                                         
//    // console.log(req.session.currentAcc);                      //currentAcc: 5000

//     const result = DataService.validateWithdraw(req.body.acc_no, req.body.password, req.body.amount)
//     res.status(result.StatusCode).json(result)

// })

app.post('/withdraw', AuthenticationMiddleware, (req,res)=>{
   

   DataService.validateWithdraw(req, req.body.acc_no, req.body.password, req.body.amount)
   .then(result=>{
    res.status(result.StatusCode).json(result)
   })

})


// app.post('/transations', AuthenticationMiddleware, (req,res)=>{

//     const result = DataService.GetTransaction(req)
//     res.status(result.StatusCode).json(result)

// })

app.post('/transations', AuthenticationMiddleware, (req,res)=>{

   DataService.GetTransaction(req.body.acc_no)                              //before mth1  GetTransaction(req)
   .then(result=>{
    res.status(result.StatusCode).json(result)
   })

})



app.delete('/deleteAcc/:acc_no', AuthenticationMiddleware, (req,res)=>{

    DataService.deleteAcc(req.params.acc_no)                              
    .then(result=>{
     res.status(result.StatusCode).json(result)
    })
 
 })
 

app.listen(3000, ()=> {
    console.log("server worked port number: 3000");
})