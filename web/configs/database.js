const mongoose = require('mongoose')

const dbServer = process.env.DB_SERVER
const dbName = process.env.DB_NAME
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASSWORD

class Database {
  constructor () {
    this._connect()
  }

  async _connect () {
    try {
      const dbUrl = `mongodb+srv://${dbUser}:${dbPassword}@${dbServer}${dbName}`
      // console.log(dbUrl)
      await mongoose.connect(dbUrl)
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = new Database()
