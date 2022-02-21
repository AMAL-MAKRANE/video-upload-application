import { gql } from 'apollo-server-core'

const typeDefs = gql`
  type Video {
    id: ID!
    "Video title"
    title: String!
    thumbnail: String
    description: String
    owner: ID!
    length: Int
  }

  type User {
    id: ID!
    name: String!
    email: String!
  }

  type AddVideoResponse {
    success: Boolean!
    message: String!
    video: Video
  }

  type DeleteVideoResponse {
    success: Boolean!
    message: String!
  }
  type LoginResponse {
    success: Boolean!
    message: String!
    token: String
  }

  input AddVideoInput {
    title: String!
    description: String
    thumbnail: String
    length: Int
  }

  input DeleteVideoInput {
    id: ID!
  }

  input LoginInput {
    email: String!
    password: String!
  }
  input RegisterInput {
    name: String!
    password: String!
    confirmPassword: String!
    email: String!
  }
  type RegisterResponse {
    success: Boolean!
    message: String!
    token: String
  }

  type Mutation {
    addVideo(input: AddVideoInput!): AddVideoResponse!
    deleteVideo(input: DeleteVideoInput!): DeleteVideoResponse!
    login(input: LoginInput!): LoginResponse!
    register(registerInput: RegisterInput): RegisterResponse!
  }
  type Query {
    videosForHome: [Video!]!
    video(id: ID!): Video!
    videosByOwner(id: ID!): Video!
  }
`

export default typeDefs
