const mongoose = require('mongoose')

const server = process.env.DB_SERVER
const db = process.env.DB_NAME

class Database {
  constructor () {
    this._connect()
  }

  async _connect () {
    await mongoose.connect(`mongodb://${server}/${db}`)
  }
}

module.exports = new Database()
