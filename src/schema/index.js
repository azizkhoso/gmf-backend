import { gql } from 'apollo-server-core';

const typeDefs = gql`
  scalar Date

  type Institute {
    _id: Int!
    name: String!
    email: String!
    courses: [String]!
    createdAt: Date!
    faculties: [Faculty]!
  }

  type Faculty {
    _id: Int!
    firstName: String!
    lastName: String!
    email: String!
    institute: Institute!
    department: String!
    courses: [String]!
    ratings: [Rating]!
    levelOfDifficulty: Float!
    attributes: [String]!
  }

  type User {
    _id: Int!
    firstName: String!
    lastName: String!
    email: String!
    institute: Institute!
    savedFaculties: [Faculty]!
    graduationYear: Int!
    registeredAt: Date!
    ratings: [Rating]!
  }

  type Rating {
    _id: Int!
    user: User!
    faculty: Faculty!
    course: String!
    semester: String!
    createdAt: Date!
    gradeOfUser: String!
    overAllRating: Int!
    levelOfDifficulty: Float!
    tags: [String]!
    wouldTakeAgain: Boolean!
    isAttendanceMandatory: Boolean!
    thoughts: String!
    likes: [User]!
    disLikes: [User]!
    reports: [Report]!
  }

  type Report {
    _id: Int!
    user: User!
    rating: Rating!
    summary: String!
    details: String!
  }

  type Admin {
    _id: Int!
    name: String!
    email: String!
    status: String!
    blogs: [Blog]!
    facebookLink: String
    instagramLink: String
    twitterLink: String
  }

  type Blog {
    _id: Int!
    title: String!
    content: String!
    writtenBy: Admin!
    tags: [String]!
    createdAt: Date!
  }

  type Query {
    institutes: [Institute]!
    faculties: [Faculty]!
    users: [User]!
    ratings: [Rating]!
    reports: [Report]!
    admins: [Admin]!
    blogs: [Blog]!
  }

`;

export default typeDefs;
