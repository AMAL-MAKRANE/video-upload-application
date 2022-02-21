// const { AuthenticationError } = require("apollo-server");
// const jwt = require("jsonwebtoken");
// const { SECRET_KEY } = require("../config");
import { AuthenticationError } from "apollo-server-core" ;
import jwt  from "jsonwebtoken";
import { jwtAttr } from"../config.js";
const checkAuth = (context) => {
  // context = { ... headers }
  const authHeader = context.req.headers.authorization;
  if (authHeader) {
    // Bearer ....
    const token = authHeader.split("Bearer ")[1];
    if (token) {
      try {
        const user = jwt.verify(token, jwtAttr.secret);
        return user;
      } catch (err) {
        throw new AuthenticationError("Invalid/Expired token");
      }
    }
    throw new Error("Authentication token must be 'Bearer [token]");
  }
  throw new Error("Authorization header must be provided");
};

export default checkAuth;