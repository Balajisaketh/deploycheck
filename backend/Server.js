const express = require('express')
const app = express()
const port = 3001
const cors = require('cors')
app.use(cors())
const md5=require('md5')
const uuid = require('uuid').v4;
app.use(express.json())
const jwt = require('jsonwebtoken');
const {Client}=require("pg")
const { query } = require('express')
app.use(express.static('public'))
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'shopping',
  password: '1234',
  port: 5432, 
});
client.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
const secretkey = "hello";
// app.use((req, res, next)=>{

//   if(req.url ==='/register' || req.url ==='/login'){
//       next();
//   }else{
//      const authHeader = req.headers["authorization"];
    
//      if(authHeader){
//           const token = authHeader.split(' ')[1];

//           if(token){
//               jwt.verify(token,secretkey,(err, decoded)=>{
//                   if(err){
//                       if(err&&err.message && err.message === "jwt expired"){
//                           res.status(401).json({error:"conflict",errorDescription:"token expired"})
//                       }else{
//                           res.status(403).json({errorDescription:"invalid token"})
//                       }
                   
//                   }else{
//                       req.user= decoded;
                      
//                       next(); /// must 
//                   }
//               }) 
//           }else{
//               res.status(401).json({errorDescription:" no token"})
//           }
//      }else{
//       res.status(401).json({errorDescription:"no authHeader"})
//      }
          

//   }
// }) 
app.post('/register',(req,res)=>{

  let data= req.body;
     const uid=uuid();
 const username=data.username;
    const email=data.email; 
    const salt =  (Math.random() + 1).toString(36).substring(7);
    const password =md5(data.password+salt)
   
    const querydata = {
      text:  `SELECT * FROM users	 
     WHERE email =$1`,  
      values : [email] 
    }
    client.query(querydata).then((data)=>{ 

                
            if (data.rows.length>0) {     
              res.send("email already exists")
              
            } 
             else{
              const queryData = {
                text: `INSERT INTO users (uid,username,email,password,salt)
                              VALUES($1,$2,$3,$4,$5) RETURNING *`,
              values: [uid,username,email,password,salt],
              }
          
              client.query(queryData).then(()=>{ 
              console.log(res.data,'uo  mq ');
             res.json({success:true});
         

        
                }).catch(err=>{
                  console.log(err,'uo mq ');
                })
          }
    })
  })    
app.post("/login",(req,res) => {

  const email =req.body.email;
  const password = req.body.password;
  
  const querydataa= {
    text:  `SELECT * FROM users	 
   WHERE email =$1`,
    values : [email] 
  }
     

client.query(querydataa).then((data)=>
{
    console.log(data.rows[0],"i m here");
     const email = data.rows[0].email;
     const passworddata = data.rows[0].password;
     const salt = data.rows[0].salt;
     console.log(salt,"i m salt")
     console.log(passworddata,"password")

     const verfypwd=md5(password+salt);
     console.log(verfypwd,"i m verfypwd");
     if(verfypwd==passworddata)
     {
      const tokenData = {email:data.email,password:data.password};
      const token = jwt.sign(tokenData, secretkey, { expiresIn: '3h' })


      res.send({ token: token, status: "success", message: "login successful"})
      console.log({ token: token, status: "success", message: "login successful" })
    } else {
      res.send({ status: "Incorrect", message: "failed" })
      console.log({ status: "Incorrect", message: "failed" })
    }
}).catch((err)=>
{
  console.log("error", err)
})
})
app.post('/addproduct', (req,res) => {
  console.log("Add Product",req.body)
    let productname=req.body.productname
    let price= req.body.price
    let category=req.body.category
    let quantity = req.body.quantity
    let uid=uuid();          
    let description=req.body.description
    const insertquery= {
      text: `INSERT INTO products (uid, productname,price,category,quantity,description) 
                        VALUES($1, $2, $3,$4,$5,$6) RETURNING *`,
      values : [uid,productname,price,category,quantity,description]
    }
    client.query(insertquery).then((data)=>{ 
      console.log({status:true, message:" data inserted successfully"})
      res.send("done inserted successfull")
    }).catch((error) =>{ 
      console.log(error,"i am error")
      // console.log({status: false,message:error.message})
      res.send({status: false,message:"failed"}) 
    }) 

})

app.get('/getproducts',(req,res) => {
    client.query('SELECT * FROM products ORDER BY uid ASC', (error, res) => {
      if (error) {
        throw error
      }
      res.status(200).json(results.rows)
    })
  
})
app.post('/getbycategory', (req, res) =>{
const category =req.body.category.toString()
let querydata=`SELECT * FROM products WHERE category='${category}'`
  console.log(querydata,'hureey')
  client.query(querydata).then((data)=>{ 
    console.log(data,"i m data")
    res.send(data.rows)
  }).catch((error) =>{ 
    console.log(error,"i am error")
    // console.log({status: false,message:error.message})
    res.send('failed') 

  }) 

})
app.post('/deleteusers', (req,res)=>{ 
  
  let useruid =req.body.useruid;
  const query = {text :`DELETE FROM users WHERE useruid = $1 RETURNING *`,values:[useruid]}
        client.query(query).then((data)=>{ 
          console.log({status:true, message:" data deleted successfully",data:data.rows[0]})
            res.send({status:true, message:" data deleted successfully",data:data.rows[0]});

        
        }).catch((error) =>{
       console.log(error,"i m err")
          console.log("failed",error)
        res.send({status: false,message:"failed"}) 
        }) 
                
 })           
app.post('/addorders', (req, res) => {
  let orderid=uuid()
  let item=req.body.item
  let orderamount=req.body.orderamount
  let orderstatus=req.body.orderstatus
  const insertquery= {
    text: `INSERT INTO orders (orderid,item,orderamount,orderstatus) 
                      VALUES($1, $2, $3,$4) RETURNING *`,
    values : [orderid,item,orderamount,orderstatus]
  }
      client.query(insertquery).then((data)=>{ 
      console.log({status:true, message:" data inserted successfully"})
      res.send('success')
    }).catch((error) =>{ 
      console.log(error,"i am error")
      // console.log({status: false,message:error.message})
      res.send({status: false,message:"failed"}) 
    }) 
})
app.post('/updateprice',(req,res) => {
  let uuid = req.body.uid
  console.log(uuid,"i m uid")
  const querydata = {text :`SELECT * FROM products WHERE uid = $1`,values:[uuid]}
  client.query(querydata).then((data) => {
    console.log('entered',data.rows[0])
    let price=req.body.price
    const pricequery = {
      text:`UPDATE products SET 
      price=$2
      WHERE uid=$1 RETURNING *`,
      values : [uuid,price]
   }
   client.query(pricequery).then((data)=>
   {
       res.send('updated'); 
   }).catch((err)=>
   {
           res.send("update success")
   })
 
  }).catch(err => {
    console.error(err,"in first attempt")
  })
})
app.post('/transactions',(req,res) => {
  let data = req.body
  const transactionid=data.useruid;
  const transactionamount=data.amount
  console.log("i am amoht",transactionamount);
  const insertquery= {
    text: `INSERT INTO payments (transactionid,transactionamount) 
                      VALUES($1, $2) RETURNING *`,
    values : [transactionid,transactionamount]
  }
  client.query(insertquery).then((data) => {
    console.log(data,"i mdatabase");
    const joinqry={
      text:'SELECT * FROM users CROSS JOIN payments'
      
    }
    client.query(joinqry).then((data) => {
      console.log(data,"cross");
      res.send(data);
    }).catch((err) => {
      console.log(err,"i am inside error");
    });
  }).catch((err) => {
    console.error(err,"in the transaction");
  });
 
  });
app.get('/getusers', (req, res) => {
  client.query('select * FROM users').then((users) => {
    res.send(users.rows);
  }).catch((err) => {
    console.error(err,"in the getusers");
  });
})
app.post('/searchbyname', (req, res) =>{
  const name =req.body.username.toString()
  console.log(name,"i am a user");
  let querydata=`SELECT * FROM users WHERE username='${name}'`
    console.log(querydata,'hureey')
    client.query(querydata).then((data)=>{ 
      console.log(data,"i m data")
      res.send(data.rows)
    }).catch((error) =>{ 
      console.log(error,"i am error")
      // console.log({status: false,message:error.message})
      res.send('failed') 
  
    }) 
  
  })
  app.get('/getnamebyorderid', (req,res)=>
  {
      //  const query1={
      //      'SELECT DISTINCT name
      //      FROM users
      //      INNER JOIN order ON users.id = order.customerid
      //      WHERE customer.id = 1 '
      //  }
      const queryjoindata=
        `SELECT * FROM users JOIN orders ON users.uid =orders.customerid`
        

      client.query(queryjoindata).then((data) => {
        console.log("done query")
        const secondquey=`SELECT * FROM products JOIN orders ON products.uid = orders.productid`
        client.query(secondquey).then((data) => {
          console.log("done huuay")
          res.send('haaya')

      })
  })
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})