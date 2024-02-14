var mockNotifyUser = {
  emailAddress:"test@gmail.com"
}

const SequelizeMock = require('sequelize-mock'); 
let dbMock = new SequelizeMock(); 
let mockUserModel =  dbMock.define('../models/notifyUser', {})

  mockUserModel.$queryInterface.$useHandler(function (query) {
    if (query === 'findOne') {
      return new Promise(resolve => resolve(null))
    }
    if(query === 'create'){
        return new Promise(resolve => resolve(mockUser))
    }
  })

  jest.mock("../repositories/notifyUserRepository", () => {
    return jest.fn().mockImplementation(() => ({
        findFamilyByName: jest.fn().mockReturnValueOnce(null).mockReturnValueOnce(mockFamily).mockReturnValueOnce(mockFamily)
    }));
  });

  var Repository = require("../repositories/repository");
   
  const NotifyUserRepository = require("../repositories/notifyUserRepository");
  Repository.NotifyUser = mockNotifyUser
  const notifyUserRepository = new NotifyUserRepository()

//--------------------------------- Test add user -----------------------------------//

test('add ok notify user test', async () => {
    let user =await mockUserModel.findOne(mockNotifyUser);
    expect(user).toBe(null);   
    let userAdded = await notifyUserRepository.addNotifyUser(mockNotifyUser)
    expect(userAdded.emailAddress).toStrictEqual(mockNotifyUser.emailAddress);
});


//--------------------------------- Test add repeat user -----------------------------------//
const mockAddRepeatUser = new Error("This user is already added to notice to this category");
let dbMock2 = new SequelizeMock(); 
let mockUserModel2 =  dbMock2.define('../models/notifyUser', {})

  mockUserModel2.$queryInterface.$useHandler(function (query) {
    if (query === 'findOne') {
      return new Promise(resolve => resolve(mockNotifyUser))
    }
    if(query === 'create'){
        return new Promise(resolve => resolve(mockNotifyUser))
    }
  })

  Repository.NotifyUser = mockUserModel2
  const userRepository2 = new NotifyUserRepository()

test('add repeat notify user test', async () => {
    let user =await mockUserModel2.findOne(mockNotifyUser);
    expect(user).toBe(mockNotifyUser);   
    try{        
         await userRepository2.addNotifyUser(mockNotifyUser)
    }
    catch(er){
        expect(er).toStrictEqual(mockAddRepeatUser);
    }
});

mockUserModel.$queryInterface.$useHandler(function (query) {
  if (query === 'findOne') {
    return new Promise(resolve => resolve(null))
  }
  if(query === 'create'){
      return new Promise(resolve => resolve(mockUser))
  }
  if(query === 'destroy'){
    return new Promise(resolve => resolve(null))
 }
})

jest.mock("../repositories/notifyUserRepository", () => {
  return jest.fn().mockImplementation(() => ({
      findFamilyByName: jest.fn().mockReturnValueOnce(null).mockReturnValueOnce(mockFamily).mockReturnValueOnce(mockFamily)
  }));
});

var Repository = require("../repositories/repository");
 
const NotifyUserRepository = require("../repositories/notifyUserRepository");
Repository.NotifyUser = mockNotifyUser
const notifyUserRepository2 = new NotifyUserRepository()

//--------------------------------- Test delete user -----------------------------------//

test('delete ok notify user test', async () => {
  let user =await mockUserModel.findOne(mockNotifyUser);
  expect(user).toBe(mockNotifyUser);   
   await notifyUserRepository2.deleteNotifyUser(mockNotifyUser)
  expect("User deleted to notice successfully").toStrictEqual("User deleted to notice successfully");
});


//--------------------------------- Test delete bad user -----------------------------------//
const mockAddRepeatUser2 = new Error("The user to unsubscribe does not exist or has already been unsubscribed");
let dbMock3 = new SequelizeMock(); 
let mockUserModel3 =  dbMock3.define('../models/notifyUser', {})

mockUserModel3.$queryInterface.$useHandler(function (query) {
  if (query === 'findOne') {
    return new Promise(resolve => resolve(mockNotifyUser))
  }
  if(query === 'destroy'){
      return new Promise(resolve => resolve(null))
  }
})

Repository.NotifyUser = mockUserModel3
const userRepository3 = new NotifyUserRepository()

test('delete bad notify user test', async () => {
  let user =await mockUserModel2.findOne(mockNotifyUser);
  expect(user).toBe(null);   
  try{        
       await userRepository3.deleteNotifyUser(mockNotifyUser)
  }
  catch(er){
      expect(er).toStrictEqual(mockAddRepeatUser2);
  }
});

//--------------------------------- Test get notify user -----------------------------------//

test('get ok notify user test', async () => {
  let user =await mockUserModel.findOne(mockNotifyUser);
  expect(user).toBe(mockNotifyUser);   
   await notifyUserRepository2.getAllNotifyByUser(mockNotifyUser)
  expect(mockNotifyUser).toStrictEqual(mockNotifyUser);
});
