import * as mysql from 'mysql2'

// 封装数据库连接方法
  
// 连接数据库的信息
const db={
    host  : '127.0.0.1',
    user  : 'root',
    password : '123456',
    database : 'server_echat_data',
    port:3306
   }
   

// 封装数据库连接方法
const connectionDB=(sql,params,cb)=>{
    // return new Promise((resolve,reject)=>{
        // 创建数据库连接
        const connection=mysql.createConnection(db);
        // 连接数据库
        connection.connect((err,conn)=>{
            if(err){
                // console.log("数据库连接失败");
                return;
            }
            // console.log("数据库连接成功");
            connection.query(sql,params,cb)
            connection.end();//关闭数据库
        })

    // })
}
export default connectionDB
