

const Pool = require('pg').Pool
const pool = new Pool({
  user: 'ataing',
  host: 'localhost',
  database: 'corrgen',
  password: 'password',
  port: 8888,
})


const getAll = (req, res) => {
  pool.query('SELECT * FROM Nation', (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
}

const getSomething = (req, res) => {
  console.log("something called");
  pool.query('SELECT gdp, unemployment FROM finances limit 10', (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
}


module.exports = {
  getAll,
  getSomething,
}