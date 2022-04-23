

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

const getGdpUnemployment = (req, res) => {
  console.log("gdp X unemployment called");
  try{
    pool.query('SELECT Nation.nationkey, Nation.nationname, Year.yearkey, gdp, unemployment FROM Nation, Year, Finances, (SELECT Nation.nationkey, COUNT(Year.yearkey), MIN(Year.yearkey), MAX(Year.yearkey) FROM Nation, Year, Finances WHERE Nation.nationkey=Finances.nationkey AND Year.yearkey=Finances.yearkey AND gdp IS NOT NULL AND unemployment IS NOT NULL GROUP BY Nation.nationkey) yearStats WHERE Nation.nationkey=Finances.nationkey AND Year.yearkey=Finances.yearkey AND yearStats.nationkey = Nation.nationkey AND gdp IS NOT NULL AND unemployment IS NOT NULL AND yearStats.count > 10 AND yearStats.min <= 2000 AND yearStats.max >= 2018 AND Year.yearkey BETWEEN 2000 AND 2018;', (error, results) => {
      if (error) {
        throw error
      }
      res.status(200).json(results.rows)
    })
  }catch(e){
    console.log(e);
  }
 
}

const getCustom = (req, res)=>{
  const {table1, table2, attribute1, attribute2} = req.params;
  console.log("custom called  called: " + table1 + " " + table2 + " " + attribute1 + " " + attribute2);
  pool.query(`WITH attribute1Stats AS
  (SELECT Nation.nationkey, COUNT(Year.yearkey), MIN(Year.yearkey), MAX(Year.yearkey) 
  FROM Nation
    JOIN ${table1} ON Nation.nationkey=${table1}.nationkey
    JOIN Year ON ${table1}.yearkey=Year.yearkey
  WHERE ${table1}.${attribute1} IS NOT NULL 
  GROUP BY Nation.nationkey),

attribute2Stats AS
  (SELECT Nation.nationkey, COUNT(Year.yearkey), MIN(Year.yearkey), MAX(Year.yearkey) 
  FROM Nation
    JOIN ${table2} ON Nation.nationkey=${table2}.nationkey
    JOIN Year ON ${table2}.yearkey=Year.yearkey
  WHERE ${table2}.${attribute2} IS NOT NULL 
  GROUP BY Nation.nationkey)

SELECT Nation.nationkey, Nation.nationname, Year.yearkey, ${table1}.${attribute1}, ${table2}.${attribute2} 
FROM Nation, Year, ${table1}, ${table2}, attribute1Stats, attribute2Stats 
WHERE Nation.nationkey=${table1}.nationkey 
  AND Nation.nationkey = ${table2}.nationkey 
  AND Year.yearkey=${table1}.yearkey 
  AND Year.yearkey = ${table2}.yearkey 
  AND attribute1Stats.nationkey = Nation.nationkey 
  AND attribute2Stats.nationkey = Nation.nationkey 
  AND ${attribute1} IS NOT NULL 
  AND ${attribute2} IS NOT NULL 
  AND attribute1Stats.count > 10 
  AND attribute2Stats.count > 10  
  AND attribute1Stats.min <= 2000 
  AND attribute2Stats.min <= 2000 
  AND attribute1Stats.max >= 2018 
  AND attribute2Stats.max >= 2018 
  AND Year.yearkey BETWEEN 2000 AND 2018;`, (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
}




module.exports = {
  getAll,
  getSomething,
  getGdpUnemployment,
  getCustom
}