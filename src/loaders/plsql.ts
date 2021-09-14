const oracledb = require('oracledb')
const config = {
  user: 'DBTEST',
  password: '123456789',
  connectString: 'localhost:1521/orcl'
}

export async function getUsers () {
  let conn

  try {
    conn = await oracledb.getConnection(config)

    const result = await conn.execute(
      'SELECT * from USERS'
    )

    console.log(result.rows[0])
  } catch (err) {
    console.log('Ouch!', err)
  } finally {
    if (conn) { // conn assignment worked, need to close
      await conn.close()
    }
  }
}

export async function executeQuery (Query:string) {
  let conn

  try {
    conn = await oracledb.getConnection(config)

    const result = await conn.execute(Query)
    return result;
  } catch (err) {
    console.log('Ouch!', err)
  } finally {
    if (conn) { // conn assignment worked, need to close
      await conn.close()
    }
  }
}


