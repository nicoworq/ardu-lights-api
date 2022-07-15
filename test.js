const fs = require('fs')

const content = 'Some content of new things'

const path = './file.txt'

const stream = fs.createWriteStream(path)

// stream.write()

content.split('').forEach((value) => {
  console.log(value)
  stream.write(value)
})
