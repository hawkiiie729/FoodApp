const express=require('express');
const app=express();
const userModel=require('./models/userModel')
const cookieParser = require('cookie-parser')

//app is an instance of express

//middleware function ->post ki req me kaam aata hai to convert the front end data to json format
app.use(express.json());
app.listen(3000) 
app.use(cookieParser())

app.use(express.urlencoded({extended: true}));
 

// let users=[
//     {
//         id:1,
//         name:"thor"
//     },
//     {
//         id:2,
//         name:"batman"
//     },
//     {
//         id:3,
//         name:"spidy"
//     },
// ];

//mini app--
const userRouter=express.Router();
const authRouter=express.Router();
//base url,router to use
app.use('/user',userRouter);
app.use('/auth',authRouter); //global midddleware


userRouter
.route('/')
.get(getUsers) //path specific middleware
.post(postUser)
.patch(updateUser)
.delete(deleteUser)


userRouter
.route('/getCookies')
.get(getCookies);

userRouter
.route('/setCookies')
.get(setCookies);


userRouter
.route('/:id')
.get(getUserById)

authRouter
.route('/signup')
.get(middleware,getSignUp)
.post(postSignUp)

function middleware(req,res,next){
    console.log('middleware encountered');
    next();
}

async function getUsers(req,res){
    
  let user= await userModel.findOne({name:'Sachin'})

    res.json({
        message:'list of all users',
        data:user
    });
}

function postUser(req,res){
    console.log(req.body); //post me jo bhi data bjegw from front end  to backend  wo req ki BOdy me pda hoga
    users=req.body;
    res.json({
        message:"data received successfully",
        user:req.body
    });
}
async function updateUser(req,res){
    console.log('req.body->',req.body);
    //update data in user obj
    let dataToBeUpdated=req.body;
    // for(key in dataToBeUpdated){
    //     users[key]=dataToBeUpdated[key];
    // }
    let user=await userModel.findOneAndUpdate({email:'abc@gmail.com'},dataToBeUpdated)
    res.json({
        message:'data updated successfully',
        data:user
    })
}

async function deleteUser(req,res){
    // users={};
    let user=await userModel.findOneAndDelete({email:'superman@gmail.com'})
    res.json({
        message:"data has been deleted",
        data:user
    });
}

//PARAMS->as it is data ..db me se utha ke de dega
function getUserById(req,res){
    console.log(req.params.id);
    let paramId=req.params.id;
    let obj={};
   for(let i=0;i<users.length;i++){
    if(users[i]['id']==paramId){
        obj=users[i];
    }
   }

  res.json({
    message:"req recieved",
    data:obj
  });
    
}

function getSignUp(req,res){
    console.log('getsignup called');
    res.sendFile('public/index.html',{root:__dirname})
}
async function postSignUp(req,res){
    let dataObj=req.body;
    let user =await userModel.create(dataObj)
//    console.log('backend',user);
    res.json({
        message:'user singed up',
        data:user
    })
}


function setCookies(req,res){
    // res.setHeader('Set-Cookie','isloggedIn=true')//(anything like set cookie,cookie ka name with value)
    res.cookie('isLoggedIn',false,{maxAge:1000*60*60*24,secure:true,httpOnly:true});
    res.send('cookies has been set')
}


function getCookies(req,res){
  let cookies=req.cookies;
  console.log(cookies);
  res.send('cookies received')
}


//     let user={
//         name:'batman',
//         email:'abcd@gmail.com',
//         password:'12345678',
//         confirmPassword:'12345678'
//     };

//     let data=await userModel.create(user);
//     console.log(data);
// })();