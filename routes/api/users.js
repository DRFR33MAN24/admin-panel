const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
//const axios = require("axios");

const auth = require("../../middleware/auth");
// User Model
const User = require("../../models/User");

// @route POST api/users
// @desc Register New User
// @acces Public
router.post("/", async (req, res) => {
  //console.log(req.body);
  const { name, phone, password, active } = req.body;
  // Verify URL
  // const query = stringify({
  //   secret: config.get("reCAPTCHA"),
  //   response: req.body.token,
  //   remoteip: req.connection.remoteAddress
  // });
  // const verifyURL = `${config.get("verifyURL")}${query}`;
  // //console.log(verifyURL);
  // const body = await axios.get(verifyURL);
  //console.log(body.data);
  // if (body.data.success !== undefined && !body.data.success) {
  //   return res.status(400).json({ msg: "Failed captcha verification" });
  // }

  if (!name || !phone || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  // Check for exitsting user
  let user = await User.findOne(
    { where: { phone: `${phone}` } },
    { plain: true }
  );
  if (user) {
    return res.status(400).json({ msg: "User alerady exists." });
  }

  // const newUser = new User({
  //   name,
  //   email,
  //   password
  // });
  const newUser = User.build({
    name: `${name}`,
    phone: `${phone}`,
    password: `${password}`,
    active: `${active}`,
  });

  // Create salt and hash

  bcryptjs.genSalt(10, (err, salt) => {
    bcryptjs.hash(newUser.password, salt, (err, hash) => {
      if (err) throw err;
      newUser.password = hash;
      newUser.save().then((user) => {
        jwt.sign(
          { id: user.id },
          config.get("jwtSecret"),
          {
            expiresIn: 604800,
          },
          (err, token) => {
            if (err) throw err;
            res.json({
              token,
              user: {
                id: user.id,
                name: user.name,
                phone: user.phone,
                active: user.active,
              },
            });
          }
        );
      });
    });
  });
});

// pass the old user info
// router.post("/update", auth, (req, res) => {
//   console.log("update route called");
//   const {
//     name,
//     email,
//     password,
//     id,
//     wallet,
//     zip,
//     country,
//     region,
//     address
//   } = req.body;

//   if (!name || !email || !password) {
//     console.log(name, email, password);
//     return res.status(400).json({ msg: "Please enter all fields" });
//   }
//   console.log(name, email, password, wallet);
//   User.findOne({ where: { id: `${id}` } }, { plain: true }).then(user => {
//     if (user) {
//       if (user.password === password) {
//         User.update(
//           {
//             name: `${name}`,
//             email: `${email}`,
//             country: `${country}`,
//             region: `${region}`,
//             address: `${address}`,
//             zip: `${zip}`,
//             wallet: `${wallet}`,
//             active: false
//           },
//           { where: { id: `${id}` } }
//         )
//           .then(user => {
//             res.json({
//               user: {
//                 id: user.id,
//                 name: user.name,
//                 email: user.email,
//                 active: user.active,
//                 password: user.password,
//                 country: user.country,
//                 region: user.region,
//                 address: user.address,
//                 zip: user.zip,
//                 wallet: user.wallet
//               }
//             });
//             console.log("user updated");
//           })
//           .catch(err => console.log(err));

//         return;
//       }

//       bcryptjs.genSalt(10, (err, salt) => {
//         bcryptjs.hash(password, salt, (err, hash) => {
//           if (err) throw err;

//           User.update(
//             {
//               name: `${name}`,
//               email: `${email}`,
//               password: `${hash}`,
//               country: `${country}`,
//               region: `${region}`,
//               address: `${address}`,
//               zip: `${zip}`,
//               wallet: `${wallet}`,
//               active: false
//             },
//             { where: { id: `${id}` } }
//           ).then(user => {
//             jwt.sign(
//               { id: user.id },
//               config.get("jwtSecret"),
//               {
//                 expiresIn: 3600
//               },
//               (err, token) => {
//                 if (err) throw err;
//                 res.json({
//                   token,
//                   user: {
//                     id: user.id,
//                     name: user.name,
//                     email: user.email,
//                     active: user.active,
//                     country: user.country,
//                     region: user.region,
//                     address: user.address,
//                     zip: user.zip,
//                     wallet: user.wallet
//                   }
//                 });
//               }
//             );
//           });
//         });
//       });
//     }
//   });
// });
// // pass the old user info
// router.post("/reset", auth, async (req, res) => {
//   console.log("reset route called");
//   const { email, password, token } = req.body;

//   // Verify URL
//   // const query = stringify({
//   //   secret: config.get("reCAPTCHA"),
//   //   response: req.body.token,
//   //   remoteip: req.connection.remoteAddress
//   // });
//   // const verifyURL = `${config.get("verifyURL")}${query}`;
//   // //console.log(verifyURL);
//   // const body = await axios.get(verifyURL);
//   //console.log(body.data);
//   if (body.data.success !== undefined && !body.data.success) {
//     return res.status(400).json({ msg: "Failed captcha verification" });
//   }

//   if (!token || !email || !password) {
//     return res.status(400).json({ msg: "Please enter all fields" });
//   }
//   console.log(email, password, token);

//   // if user dosen't exitst do nothing
//   // if user exists de-activate user
//   // change password
//   // send message to his email with link to activate

//   User.findOne({ where: { email: `${email}` } }, { plain: true }).then(user => {
//     if (user) {
//       //update existing user
//       // const newUser = User.build({
//       //   name: `${name}`,
//       //   email: `${email}`,
//       //   password: `${password}`
//       // });

//       // Create salt and hash

//       bcryptjs.genSalt(10, (err, salt) => {
//         bcryptjs.hash(password, salt, (err, hash) => {
//           if (err) throw err;

//           User.update(
//             {
//               password: `${hash}`,

//               active: false
//             },
//             { where: { email: `${email}` } }
//           ).then(console.log("password re-setted successfully"));
//         });
//       });
//     } else {
//       return res.status(400).json({ msg: "User dosen't exists" });
//     }
//   });
// });

module.exports = router;
