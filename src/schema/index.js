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
    institute(_id:Int!): Institute!
    institutes(name:String offset:Int limit:Int): [Institute]!
    faculties(firstName:String institute:Int offset:Int limit:Int): [Faculty]!
    users(firstName:String offset:Int limit:Int): [User]!
    user(email:String!): User!
    ratings(date:Date user:Int faculty:Int offset:Int limit:Int): [Rating]!
    reports: [Report]!
    admins(name:String offset:Int limit:Int): [Admin]!
    blogs: [Blog]!
    allowedEmails(emailDomain:String offset:Int limit:Int): [AllowedEmail]!
    ads(title:String offset:Int limit:Int): [Ad]!
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
    newInstitute(name:String! email:String! courses:[String]!): Institute!
    updateInstitute(_id:Int! name:String email:String courses:[String]): Institute!
    deleteInstitute(_id:Int!): ID!
    newFaculty(firstName:String! lastName:String! email:String! institute:Int! department:String! courses:[String!]!): Faculty!
    updateFaculty(_id:Int! firstName:String lastName:String email:String institute:Int department:String courses:[String]): Faculty!
    deleteFaculty(_id:Int!): ID!
    newAdmin(name:String! email:String! password:String! confirmPassword:String! facebookLink:String instagramLink:String twitterLink:String): Admin!
    updateAdmin(_id:Int! name:String email:String password:String newPassword:String status:String facebookLink:String instagramLink:String twitterLink:String): Admin!
    deleteAdmin(_id:Int!): ID!
    updateAboutUs(ourStory:String whoWeAre:String ourMission:String): AboutUs!
    newAd(title:String! locationId:String! code:String!): Ad!
    updateAd(_id:Int! title:String locationId:String code:String status:String): Ad!
    deleteAd(_id:Int!): ID!
    newAllowedEmail(emailDomain:String! isAllowed:Boolean!): AllowedEmail!
    updateAllowedEmail(_id:Int! emailDomain:String isAllowed:Boolean status:String): AllowedEmail!
    deleteEmail(_id:Int!): ID!
  }

`;

export default typeDefs;
