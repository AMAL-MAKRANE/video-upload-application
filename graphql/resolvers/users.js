//import bcrypt from "bcryptjs";
import bcrypt from 'bcrypt'
//const bcrypt = reqre("bcryptjs");
//const jwt = require("jsonwebtoken");
import jwt from "jsonwebtoken" ;

//const { UserInputError } = require("apollo-server");
import { UserInputError } from "apollo-server-core" ;
import { generateJWT } from '../../jwt.js'
import {User,getUserByEmail, comparePassword} from "../../models/user.js" ;
//const {User} = import("../../models/user");
import  {validateRegisterInput} from "../../util/validators.js";
import { jwtAttr } from "../../config.js"; 

//const { SECRET_KEY } = require("../../config");

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    jwtAttr.secret,
    { expiresIn: "1h" }
  );
};

const users = {
  Query: {
    // getUser: async (_, { username }) => {
    //   try {
    //     const user = await User.findOne({ username });
    //     if (user) {
    //       return user;
    //     } else {
    //       throw new Error("User not found");
    //     }
    //   } catch (err) {
    //     throw new Error(err);
    //   }
    // },
  },
  Mutation: {
    login: async (_, args, ctx, info) => {
        const { email, password } = args.input
  
        //Dummy validation
        if (!email || !password)
          return {
            success: false,
            message: `Valid Email or Password are Required`,
          }
        const userWithEmail = await getUserByEmail(email)
  
        if (!userWithEmail)
          return {
            success: false,
            message: `Wrong Email or Password`,
          }
  
        const isCorrectPassword = await comparePassword(
          password,
          userWithEmail.password
        )
        if (!isCorrectPassword)
          return {
            success: false,
            message: `Wrong Email or Password`,
          }
        //Before returning the user you might want to add a DTO layer
        //to Stop information such as password, _id (internal ID) from being sent.
  
        const token = await generateJWT({ user: userWithEmail })
  
        return {
          success: true,
          message: `Logged in succesfuly`,
          token: token,
        }
      },
    register: async (
      _,
      { registerInput: { username, email, password, confirmPassword } }
    ) => {
      const { valid, errors } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }
      const user = await User.findOne({ username });
      if (user) {
        throw new UserInputError("Username is taken", {
          errors: {
            username: "This username is taken",
          },
        });
      }

      password = await bcrypt.hash(password, 12);

      const newUser = new User({
        email,
        name : username,
        password,
        createdAt: new Date().toISOString(),
      });

      const res = await newUser.save();

      const token = generateToken(res);

      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },
  },
};
export default  users ;