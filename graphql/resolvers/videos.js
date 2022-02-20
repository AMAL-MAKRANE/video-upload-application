
import bcrypt from 'bcrypt'

import jwt from "jsonwebtoken" ;
import { requireUser } from '../../permissions.js'

import { UserInputError } from "apollo-server-core" ;
import { generateJWT } from '../../jwt.js'
import {getVideosByOwnerId, getVideoById,createVideo, deleteVideoById,Video} from "../../models/video.js" ;

import  {validateRegisterInput} from "../../util/validators.js";
import { jwtAttr } from "../../config.js"; 
import checkAuth from '../../util/check-auth.js';
const users = {
    Query: {
        video: async (_, { id }) => {
            try {
              return getVideoById(id)
              
            } catch (err) {
              throw new Error(err);
            }
          },
          videosByOwner: async (_, { id }) => {
            try {
              const video= getVideosByOwnerId(id)
              if (video) {
                return video;
              } else {
                throw new Error("Video not found");
              }
            } catch (err) {
              throw new Error(err);
            }
          },
          videosForHome: async () => {
            try {
                const videos = await Video.find().sort({ createdAt: -1 });
                return videos;
              } catch (err) {
                throw new Error(err);
              }


          }

    },
    Mutation: {

        addVideo: async (_, args, ctx, info) => {
            const owner = checkAuth(ctx);
            
            const { title, description, thumbnail, length } = args.input
            
      
            //dummy validation
            if (title.trim() === '' || title.length < 3)
              return {
                success: false,
                message: `title is too short`,
              }
      
            const newVideo = await createVideo({
              title,
              description,
              thumbnail,
              length,
              owner,
            })
      
            return {
              success: true,
              message: `Video created successfully`,
              video: newVideo,
            }
          },
          deleteVideo: requireUser(async (_, args, ctx, info) => {
            const { id } = args.input
            const owner = ctx.user
      
            const video = await getVideoById(id)
            if (!video)
              return {
                success: false,
                message: `Video does not exist`,
              }
      
            if (video.owner.toString() !== owner._id.toString())
              throw ForbiddenError('Cannot update this resource')
      
            await deleteVideoById(id)
            return {
              success: true,
              message: `Video deleted successfully`,
            }
          }),
        },

    }