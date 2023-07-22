require('dotenv').config()
const mysql = require('mysql');
const preFix = 'storecart_';

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
let dataResp= [];
con.query(String(`SELECT p.ID, pm.meta_key, pm.meta_value FROM ${preFix}posts as p JOIN ${preFix}postmeta as pm ON p.ID = pm.post_id where p.post_type='market-index' `), function (errorQur, result, fields) {
  if (errorQur) throw errorQur; 
 dataResp.push(result);  
  });


        
module.exports = { con, dataResp  }
  
