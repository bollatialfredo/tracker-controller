
const { Pool } = require('pg')
const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
  ssl: true
})

  const getUsers = (request, response) => {
    pool.query('SELECT * FROM sys_user;', (error, results) => {
      if (error) {
        throw error
      }
      console.log(results.rows);
      response.status(200).json(results.rows)
    })
  }

  const getAuthUser = async (request) => {
    return new Promise(function(resolve, reject) {
      pool.query(`
          SELECT * 
          FROM sys_user 
          WHERE username = '${request.username}';`, (error, results) => {
        if (error) {
          reject(error)
        }
        if (!results || !results.rows || !results.rows[0]) {
          resolve({})
          return;
        }
        resolve(results.rows[0]);
      })
    });  
  }

  module.exports = {
    getUsers,
    getAuthUser
  }
