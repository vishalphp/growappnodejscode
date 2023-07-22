//import { Server } from "socket.io";
require('dotenv').config()
const express = require('express');
const app = express();
const cors = require('cors');
const { Server } = require("socket.io");
const mysql = require('mysql');
const preFix = 'storecart_';

const httpServer = require('http').createServer(app);

const con = mysql.createConnection({
    host: process.env.host, 
    user: process.env.user,
    password: process.env.password ? process.env.password: '',
    database : process.env.database
  }); 

let errorCheck = con.connect(function(err) {
    if (err) { throw err }; 
    return err;
  }); 

if(errorCheck){
   throw errorCheck;
}


const io = new Server(httpServer, { 
    cors: {
    origin: 'http://localhost:3000'
 } 
});
  
app.use(cors());

app.get('/', function (req, res){
    res.send("home data");
});


 io.on("connection", (socket) => {
  
     console.log("new user is connected");
 
    // to send first message from server
    //io.emit("firstmessage", "this is my first message from server");
   // io.emit('indexfundsresult', dataResp);
    //message from client recived
    //socket.on("messagefromclient", (arg)=>{
    // console.log(arg);
    //})

    const interval = setInterval(async () => {

        const query = `SELECT p.ID, pm.meta_key, pm.meta_value FROM ${preFix}posts as p JOIN ${preFix}postmeta as pm ON p.ID = pm.post_id where p.post_type='market-index' `;

        con.query(query, (error, results) => {
          if (error) {
            console.error('Error executing MySQL query:', error);
          } else {
            
            const updateData = results.map((data)=>{ return data  });

           /*const marketindex = { 
            'finnifty': results.data[0].acf.finnifty,
            'nifty_50': results.data[0].acf.nifty_50, 
            'nifty_100': results.data[0].acf.nifty_100,
            'nifty_bank': results.data[0].acf.nifty_bank,
            'nifty_midcap_100': results.data[0].acf.nifty_midcap_100,
            'nifty_next_50': results.data[0].acf.nifty_next_50,
            'sp_bse_100': results.data[0].acf.sp_bse_100,
            'sensex':  results.data[0].acf.sensex, 
            };*/

            io.emit('indexfundsresult', updateData);
          }
        });
  
    }, 4000);
   socket.on("disconnect", ()=>{
                console.log("new user disconnected from system");
                clearInterval(interval); // Clear the interval when the client disconnects
        
            });
 
 });
 


httpServer.listen(8080, () => {
    console.log('Server listening on port 8080');
  });