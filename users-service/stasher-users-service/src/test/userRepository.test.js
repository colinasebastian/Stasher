var mockUser = {
    id: 1,
    name : "test name",
    emailAddress:"test@gmail.com",
    password: "test",
    family:{
        name:"test"
    }
}

var mockLoginData= {
    password: "",
    emailAddress:""
}

var mockLoginDataOk= {
    emailAddress:"test@gmail.com",
    password: "test"
}

var mockLogin = {
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiUGVkcm8iLCJpZCI6MywiZW1haWxBZGRyZXNzIjoiUGVkcm9AZ21haWwuY29tIiwicm9sZSI6ImFkbWluaXN0cmF0b3IiLCJpYXQiOjE2NjQ0NjkzMTcsImV4cCI6MTY2NDQ2OTQxN30.2t4SBgYqohZVbn-MyrSn7nFjxeMRxG_7nHmXWoVNlYo",
    role: "administrator"
}

var mockFamily = { id: "1", name:"test name"}

const SequelizeMock = require('sequelize-mock'); 
let dbMock = new SequelizeMock(); 
let mockUserModel =  dbMock.define('../models/user', {})

  mockUserModel.$queryInterface.$useHandler(function (query) {
    if (query === 'findOne') {
      return new Promise(resolve => resolve(null))
    }
    if(query === 'create'){
        return new Promise(resolve => resolve(mockUser))
    }
  })

  jest.mock("../repositories/familyRepository", () => {
    return jest.fn().mockImplementation(() => ({
        findFamilyByName: jest.fn().mockReturnValueOnce(null).mockReturnValueOnce(mockFamily).mockReturnValueOnce(mockFamily)
    }));
  });

  var Repository = require("../repositories/repository");
   
  const UserRepository = require("../repositories/userRepository");
  Repository.User = mockUserModel
  const userRepository = new UserRepository()

  const FamilyRepository = require('../repositories/familyRepository');
  const familyRepository = new FamilyRepository();


//--------------------------------- Test add user -----------------------------------//

test('add ok administrator test', async () => {
    let family = await familyRepository.findFamilyByName()
    expect(family).toBe(null);
    let user =await mockUserModel.findOne(mockUser);
    expect(user).toBe(null);   
    let userAdded = await userRepository.addAdministrator(mockUser)
    expect(userAdded.emailAddress).toStrictEqual(mockUser.emailAddress);
});

//--------------------------------- Test add user incorrect family -----------------------------------//
const mockAddDataError = new Error("That family already exists");

test('add user incorrect family test', async () => {
    let family = await familyRepository.findFamilyByName()
    expect(family).toBe(mockFamily);
    let user =await mockUserModel.findOne(mockUser);
    expect(user).toBe(null);   
    try{        
         await userRepository.addAdministrator(mockUser)
    }
    catch(er){
        expect(er).toStrictEqual(mockAddDataError);
    }
});

//--------------------------------- Test add repeat user -----------------------------------//
const mockAddRepeatUser = new Error("That administrator already exists");
let dbMock2 = new SequelizeMock(); 
let mockUserModel2 =  dbMock2.define('../models/user', {})

  mockUserModel2.$queryInterface.$useHandler(function (query) {
    if (query === 'findOne') {
      return new Promise(resolve => resolve(mockUser))
    }
    if(query === 'create'){
        return new Promise(resolve => resolve(mockUser))
    }
  })

  Repository.User = mockUserModel2
  const userRepository2 = new UserRepository()

test('add repeat administrator test', async () => {
    let family = await familyRepository.findFamilyByName()
    expect(family).toBe(mockFamily);
    let user =await mockUserModel2.findOne(mockUser);
    expect(user).toBe(mockUser);   
    try{        
         await userRepository2.addAdministrator(mockUser)
    }
    catch(er){
        expect(er).toStrictEqual(mockAddRepeatUser);
    }
});

//--------------------------------- Test login ok -----------------------------------//

test('Login ok test', async () => {
    let user =await mockUserModel2.findOne(mockUser);
    expect(user).toBe(mockUser);   
    let userAdded = await userRepository2.login(mockLoginDataOk)
    expect(userAdded.emailAddress).toStrictEqual(mockUser.emailAddress);
});


//--------------------------------- Test login user not registered -----------------------------------//
const mockLoginError = new Error("User not registered in the system");


let dbMock3 = new SequelizeMock(); 
let mockUserModel3 =  dbMock3.define('../models/user', {})

  mockUserModel3.$queryInterface.$useHandler(function (query) {
    if (query === 'findOne') {
      return new Promise(resolve => resolve(mockUser))
    }
    if(query === 'create'){
        return new Promise(resolve => resolve(mockUser))
    }
  })

  Repository.User = mockUserModel3
  const userRepository3 = new UserRepository()


test('Login user not registered test', async () => {
    let user =await mockUserModel3.findOne(mockLoginDataOk);
    expect(user).toBe(mockUser);   
    try{        
         await userRepository3.login(mockLoginDataOk)
    }
    catch(er){
        expect(er).toStrictEqual(mockLoginError);
    }
});

//--------------------------------- Test login data error -----------------------------------//
const mockLoginDataError = new Error("Password and email cannot be empty");

test('Login data error test', async () => {
    try{        
         await userRepository.login(mockLoginData)
    }
    catch(er){
        expect(er).toStrictEqual(mockLoginDataError);
    }
});