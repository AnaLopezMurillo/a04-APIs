const express = require('express')
const axios = require('axios')
const app = express()
const port = 5500

app.use(express.static('public'));

app.get('/', (req, res) => {
  console.log('here');
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})