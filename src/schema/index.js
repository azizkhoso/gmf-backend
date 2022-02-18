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

  type AllowedEmail {
    _id: ID!
    emailDomain: String!
    isAllowed: Boolean!
    status: String!
  }

  type Faq {
    _id: ID!
    title: String!
    category: String!
    answer: String!
  }

  type Ad {
    _id: ID!
    title: String!
    locationId: String!
    code: String!
    status: String!
  }

  type Member {
    _id: ID!
    image: String!
    name: String!
    role: String!
    facebookLink: String!
    instagramLink: String!
    linkedinLink: String!
  }

  type AboutUs {
    ourStory: String
    whoWeAre: String
    ourMission: String
  }

  type LoggedUser {
    user: User!
    token: String!
  }

  type LoggedAdmin {
    admin: Admin!
    token: String!
  }

  type Query {
    allFaculties: Int!
    allUsers: Int!
    allInstitutes: Int!
    allRatings: Int!
    allAdmins: Int!
    allAds: Int!
    allAllowedEmails: Int!
    allFaqs: Int!
    allBlogs: Int!
    allReports: Int!
    allMembers: Int!
    institutes: [Institute]!
    faculties: [Faculty]!
    users(firstName:String offset:Int limit:Int): [User]!
    user(email:String!): User!
    ratings(date:Date user:Int faculty:Int offset:Int limit:Int): [Rating]!
    reports: [Report]!
    admins: [Admin]!
    blogs: [Blog]!
    allowedEmails: [AllowedEmail]!
    ads: [Ad]!
    faqs: [Faq]!
    members: [Member]!
    aboutUs: AboutUs!
    loggedAdmin: LoggedAdmin!
    loggedUser: LoggedUser!
  }

  type Mutation {
    newUser(firstName:String! lastName:String! email:String! password:String! confirmPassword:String!): User!
    adminUpdateUser(_id:Int! firstName:String lastName:String email:String password:String confirmPassword:String): User!
    deleteUser(_id:Int!): ID!
  }

`;

export default typeDefs;
