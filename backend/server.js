//server creatiom

// 1.http module

const http = require('http');
const fs = require('fs');
const _=require('lodash')

//server create kr liye
const server=http.createServer((req,res)=>{
    //agr req aayegi toh ye func jroor chlega
console.log("request has been made from browser to server");
// console.log(req.method);
// console.log(req.url);

let num=_.random(0,20)
console.log(num);
//setheader btata h ki kis type ki response bhji gyi h
res.setHeader("Content-Type","text/html");
//write btata h ki actual response kya h jo bhja gya h
// res.write('Hello bro');
// res.end();

let path='./src';
switch(req.url){
    case '/':
        path+='/index.html'
        res.statusCode=200
        break;
        case '/about':
            path+='/about.html'
            res.statusCode=200
            break;
            case '/about-me':
              
                res.statusCode=301
                res.setHeader('location','/about')
                res.end()
                break;
            default:
                path+='/404.html'
                res.statusCode=404
                break;
};




fs.readFile(path,(err,fileData)=>{
    if(err){
        console.log(err);
    }else{
        // res.write(fileData);
        res.end(fileData);
    }
})
}) 

//port number,host,callback---.listen k 3 argmnts
server.listen(3000,'localhost',()=>{
    console.log('server is listening on port 3000');
})