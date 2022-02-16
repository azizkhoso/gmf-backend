import { gql } from 'apollo-server-core';

const typeDefs = gql`
  # Date Scalar type
  scalar Date

  # User type
  type User {
    _id: ID!
    firstName: String!
    lastName: String!
    email: String!
    institute: ID!
    savedFaculties: [Int]!
    graduationYear: Int!
    registeredAt: Date!
    ratings: [ID]!
  }
  # Faculty type 
  type Faculty {
    _id: ID!
    firstName: String!
    lastName: String!
    email: String!
    institute: ID!
    department: String!
    courses: [String]!
    ratings: [ID]!
    levelOfDifficulty: Float!
    attributes: [String]!
  }
  # Institute type
  type Institute {
    _id: ID!
    name: String!
    email: String!
    courses: [String]!
    createdAt: Date!
    faculties: [ID]!
  }
  # Rating type
  type Rating {
    _id: ID!
    user: ID!
    faculty: ID!
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
    likes: [Int]!
    disLikes: [Int]!
  }
  # Report type
  type Report {
    _id: ID!
    user: ID!
    rating: ID!
    summary: String!
    details: String!
  }
  # Admin type
  type Admin {
    _id: ID!
    name: String!
    email: String!
    status: String!
    facebookLink: String
    instagramLink: String
    twitterLink: String
  }
  # Blog type
  type Blog {
    _id: ID!
    title: String!
    content: String!
    writtenBy: Int!
    tags: [String]!
    createdAt: Date!
  }
  # Ad type
  type Ad {
    _id: ID!
    title: String!
    locationId: String!
    code: String!
    status: String!
  }
  # AllowedEmail type
  type AllowedEmail {
    _id: ID!
    emailDomain: String!
    isAllowed: Boolean!
    status: String!
  }
  # Faq type
  type Faq {
    _id: ID!
    title: String!
    category: String!
    answer: String!
  }
  # Logged User type
  type LoggedUser {
    user: User!
    token: String!
  }
  # Logged Admin type
  type LoggedAdmin {
    admin: Admin!
    token: String!
  }
  # Team member type
  type Member {
    _id: ID!
    image: String!
    name: String!
    role: String!
    facebookLink: String!
    instagramLink: String!
    linkedinLink: String!
  }
  # AboutUs type
  type AboutUs {
    ourStory: String
    whoWeAre: String
  }

  # Root Query
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
    faculties(institute:Int offset:Int limit:Int): [Faculty]!
    users(offset:Int limit:Int): [User]!
    institutes(offset:Int limit:Int): [Institute]!
    ratings(faculty:Int user:Int): [Rating]!
    admins(offset:Int limit:Int): [Admin]!
    members(offset:Int limit:Int): [Member]!
    ads(offset:Int limit:Int): [Ad]!
    allowedEmails(offset:Int limit:Int): [AllowedEmail]!
    faqs(offset:Int limit:Int): [Faq]!
    blogs(offset:Int limit:Int): [Blog]!
    reports(offset:Int limit:Int): [Report]!
    user(email:String!): User!
    faculty(email:String!): Faculty!
    institute(name:String!): Institute!
    rating(user:String! faculty:String!): Rating!
    loggedUser: LoggedUser!
    loggedAdmin: LoggedAdmin!
    aboutUs: AboutUs!
  }

  type Mutation {
    loginUser(email:String! password:String!): LoggedUser!
    loginAdmin(email:String! password:String!): LoggedAdmin!
    newUser(firstName:String! lastName:String! email:String! password:String! confirmPassword:String!): User!
    updateUser(_id:Int! firstName:String! lastName:String! email:String! password:String confirmPassword:String institute:Int savedFaculties:[Int] graduationYear:Int): User!
    updateUserEmail(_id:Int! email:String! password:String!): String!
    updateUserPassword(_id:Int! oldPassword:String! newPassword:String!): Boolean!
    updateAdmin(_id:Int! name:String! email:String! password:String! newPassword:String status:String! facebookLink:String instagramLink:String twitterLink:String): Admin!
    updateMember(_id:Int! image:String! name:String! role:String! facebookLink:String! instagramLink:String! linkedinLink:String!): Member!
    updateFaculty(_id:Int! firstName:String! lastName:String! email:String! institute:Int! department:String! courses:[String!]!): Faculty!
    updateInstitute(_id:Int! name:String! email:String courses:[String]!): Institute!
    updateAd(_id:Int! title:String! locationId:String! code:String! status:String!): Ad!
    updateAllowedEmail(_id:Int! emailDomain:String! isAllowed:Boolean! status:String!): AllowedEmail!
    updateFaq(_id:Int! title:String! category:String! answer:String!): Faq!
    updateAboutUs(ourStory:String whoWeAre:String): AboutUs!
    updateBlog(_id:Int! title:String! content:String! tags:[String]): Blog!
    newFaculty(firstName:String! lastName:String! email:String! institute:Int! department:String! courses:[String!]!): Faculty!
    newInstitute(name:String! email:String! courses:[String]!): Institute!
    newAdmin(name:String! email:String! password:String! confirmPassword:String! facebookLink:String instagramLink:String twitterLink:String): Admin!
    newMember(image:String! name:String! role:String! facebookLink:String! instagramLink:String! linkedinLink:String!): Member!
    newAd(title:String! locationId:String! code:String!): Ad!
    newRating(user:Int! faculty:Int! course:String! levelOfDifficulty:Int! gradeOfUser:String! isAttendanceMandatory:Boolean! overAllRating:Int! semester:String! tags:[String]! thoughts:String! wouldTakeAgain:Boolean!): Rating!
    addLike(user:Int! rating:Int!): Int!
    addDisLike(user:Int! rating:Int!): Int!
    saveFaculty(user:Int! faculty:Int!): [Int]!
    newReport(user:Int! rating:Int! summary:String! details:String!): Report!
    newAllowedEmail(emailDomain:String! isAllowed:Boolean!): AllowedEmail!
    newFaq(title:String! category:String! answer:String!): Faq!
    newBlog(title:String! content:String! writtenBy:Int! tags:[String]): Blog!
    deleteUser(_id:Int!): ID!
    deleteAdmin(_id:Int!): ID!
    deleteMember(_id:Int!): ID!
    deleteFaculty(_id:Int!): ID!
    deleteInstitute(_id:Int!): ID!
    deleteAd(_id:Int!): ID!
    deleteEmail(_id:Int!): ID!
    deleteFaq(_id:Int!): ID!
    deleteRating(_id:Int!): ID!
    deleteBlog(_id:Int!): ID!
    deleteReport(_id:Int!): ID!
  }
`;

export default typeDefs;
