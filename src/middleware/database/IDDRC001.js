// // require('dotenv').config();
// var jwt = require('jsonwebtoken');
// const TOKEN_SECRET = process.env.TOKEN_SECRET;
// /**
//  * @description: Used to Verify Authenticated
//  */
// export default class IDDRC001 {
//   constructor() {
//     this.encode = this.encode.bind(this);
//     this.decode = this.decode.bind(this);
//     this.ensureAuthenticated = this.ensureAuthenticated.bind(this);
//   }

//   encode = async (
//     payload,
//     secret = TOKEN_SECRET,
//     callback = (e) => {
//       console.log('callback', e);
//     }
//   ) => {
//     let token = await jwt.sign(payload, secret);
//     return token;
//   };

//   decode = async (token, secret = TOKEN_SECRET) => {
//     // console.log('token', token);
//     // let decoded = await jwt.verify(token, secret);
//     // console.log('decoded', decoded);
//     return await jwt.verify(token, secret);
//   };
//   ensureAuthenticated = (req, res, next) => {
//     if (!req.headers.authorization) {
//       return res.status(401).send({ error: 'TokenMissing' });
//     }
//     var token = req.headers.authorization.split(' ')[1];

//     var payload = null;
//     try {
//       payload = this.decode(token, process.env.TOKEN_SECRET);
//     } catch (err) {
//       return res.status(401).send({ error: 'TokenInvalid' });
//     }

//     if (payload.exp <= moment().unix()) {
//       return res.status(401).send({ error: 'TokenExpired' });
//     }

//     return payload.sub;
//   };
// }
