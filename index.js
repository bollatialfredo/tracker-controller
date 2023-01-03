const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const tagController = require('./controllers/tagController');
const userController = require('./controllers/userController');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");

const app = express();
const PORT = process.env.PORT || 8081;

app.use(cors({origin: '*'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/users', userController.getUsers);

app.get('/', (req, res) => res.send('pong') );

app.post("/token", async (req, res) => {
  if (req && req.body && req.body.username && req.body.password) {
    try {
      //const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));
      //const hashPass = await bcrypt.hash(req.body.password, salt);
      let user = await userController.getAuthUser({"username": req.body.username})
      try {
        if (!user || !user.password || !user.username) {
          res.status(401).send('invalid username and password');
          return;
        }
        let resp = await bcrypt.compare(req.body.password, user.password);
        if (resp) {
          let jwtSecretKey = process.env.JWT_SECRET_KEY;
          let data = {
            time: Date(),
            user_id: user.user_id,
          }
          const token = jwt.sign(data, jwtSecretKey);
          delete user.password;
          user.token = token;
          res.send(user);
        } else {
          res.status(401).send('invalid username and password');
        }
      } catch (error) {
        console.log(error);
        res.status(500).send('Error on authentication process');
      }
    } catch (error) {
      console.error(error.message || error);
    }
    
  } else {
    res.status(401).send('invalid user and password');
  }
});



app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
