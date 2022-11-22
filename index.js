const dotenv = require('dotenv')
dotenv.config()

const express = require('express')
const axios = require('axios')
const cors = require('cors')
const bodyParser = require('body-parser')
const db = require('./db/postgres')

const app = express()
const PORT = process.env.PORT || 8081

app.use(cors({origin: '*'}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.get('/', async (req, res) => {
  const username = req.query.username || 'bollatialfredo'
  try {
    const result = await axios.get(
      `https://api.github.com/users/${username}/repos` 
    );
    const repos = result.data
      .map((repo) => ({
        name: repo.name,
        url: repo.html_url,
        description: repo.description,
        stars: repo.stargazers_count
      }))
      .sort((a, b) => b.stars - a.stars)

    res.send(repos);
  } catch (error) {
    console.log(error);
    res.status(400).send('Error while getting list of repositories')
  }
})

app.get('/users', db.getUsers)

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`)
});
