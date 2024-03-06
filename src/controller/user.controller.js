const crypto = require('crypto');
const db = require("../database/models");
const User = db.user;

async function hashedPassword(password) {
  //Engrypt password
  const md5 = crypto.createHash('md5');
  const pwd = md5.update(password).digest('hex');
  return pwd;
}

async function findUser(where) {
  try {
    allUsers = await User.findAll({ where: where });
    const count = await User.count({ where: where });

    return (allUsers instanceof Array) ? {user: allUsers[0], count: count} : { user: '', count: 0 };
  }
  catch (ex) {
    throw ex;
  }
}

exports.signup = async (req, res) => {
  // Do something with the form data
  res.send('Form data received');
  if (!req.body.username, !req.body.email, !req.body.password) {
    res.status(400).send({
      message: 'Please provide all the fields.'
    });
    return;
  }

  const pwd = await hashedPassword(req.body.password);

  const newUser = {
    username: req.body.username,
    email: req.body.email,
    password: pwd,
    phone: req.body.phone
  }

  User.create(newUser)
    .then(data => {
      res.send({
        message: "Signup Successful!"
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while signing you up.",
        errObj: err
      });
    });
}

exports.login = async (req, res) => {
  if ((!req.body.email) || (!req.body.password)) {
    res.status(400).send({
      message: 'Please provide username/email and password.'
    });
  }

  const pwd = await hashedPassword(req.body.password);

  const data = await findUser({email: req.body.email, password: pwd});

  (data.count > 0)? res.status(200).send({ auth: true }): res.status(200).send({ auth: false });
}

module.exports = exports;