import { gql } from 'apollo-server-core';

const typeDefs = gql`
  # Custom Date type
  scalar Date
  
  # Upload type provided by GraphQLUpload.js
  scalar Upload

  # File type for handling file uploads
  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }

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
    lastName: String
    email: String
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
    institute: String!
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
    _id: Int!
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
    faculties(firstName:String institute:Int offset:Int limit:Int in:[Int]): [Faculty]!
    users(firstName:String offset:Int limit:Int): [User]!
    user(email:String!): User!
    ratings(date:Date user:Int faculty:Int course:String semester:String offset:Int limit:Int): [Rating]!
    reports(summary:String offset:Int limit:Int): [Report]!
    admins(name:String offset:Int limit:Int): [Admin]!
    blogs(title:String offset:Int limit:Int): [Blog]!
    allowedEmails(emailDomain:String offset:Int limit:Int): [AllowedEmail]!
    ads(title:String locationId:String offset:Int limit:Int): [Ad]!
    faqs(title:String category:String offset:Int limit:Int): [Faq]!
    members(name:String offset:Int limit:Int): [Member]!
    aboutUs: AboutUs!
    loggedAdmin: LoggedAdmin!
    loggedUser: LoggedUser!
  }

  type Mutation {
    newUser(firstName:String! lastName:String! email:String! password:String! confirmPassword:String!): User!
    adminUpdateUser(_id:Int! firstName:String lastName:String email:String password:String confirmPassword:String): User!
    updateUser(firstName:String lastName:String institute:String graduationYear:Int): User!
    updateUserEmail(email:String! password:String!): String!
    updateUserPassword(oldPassword:String! newPassword:String!): Boolean!
    deleteUser(_id:Int!): ID!
    deleteSelf: ID!
    newInstitute(name:String! email:String! courses:[String]!): Institute!
    updateInstitute(_id:Int! name:String email:String courses:[String]): Institute!
    deleteInstitute(_id:Int!): ID!
    newFaculties(csvFile:Upload! institute:Int!): [Faculty]! 
    newFaculty(firstName:String! lastName:String email:String institute:Int! department:String! courses:[String!]!): Faculty!
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
    newFaq(title:String! category:String! answer:String!): Faq!
    updateFaq(_id:Int! title:String category:String answer:String): Faq!
    deleteFaq(_id:Int!): ID!
    newBlog(title:String! content:String! tags:[String]): Blog!
    updateBlog(_id:Int! title:String content:String tags:[String]): Blog!
    deleteBlog(_id:Int!): ID!
    newMember(image:Upload! name:String! role:String! facebookLink:String! instagramLink:String! linkedinLink:String!): Member!
    updateMember(_id:Int! image:Upload name:String role:String facebookLink:String instagramLink:String linkedinLink:String): Member!
    deleteMember(_id:Int!): ID!
    newRating(faculty:Int! course:String! levelOfDifficulty:Int! gradeOfUser:String! isAttendanceMandatory:Boolean! overAllRating:Int! semester:String! tags:[String]! thoughts:String! wouldTakeAgain:Boolean!): Rating!
    addLike(rating:Int!): Int!
    addDisLike(rating:Int!): Int!
    adminDeleteRating(_id:Int!): ID!
    deleteRating(_id:Int!): ID!
    saveFaculty(faculty:Int!): [Int]!
    newReport(rating:Int! summary:String! details:String!): Report!
    deleteReport(_id:Int!): ID!
  }

`;

export default typeDefs;
