const mongoose = require('mongoose')

const server = process.env.DB_SERVER
const db = process.env.DB_NAME

class Database {
  constructor () {
    console.log('db constructor')
    this._connect()
  }

  _connect () {
    console.log('db connect')
    mongoose.connect(`mongodb://${server}/${db}`).then(() => {
      console.log('db connected')
    }).catch(err => {
      console.error(err.message)
    })
  }
}

module.exports = new Database()
