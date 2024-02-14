var mockUser = {
    name : "test name",
    emailAddress:"test@gmail.com",
    password: "test",
    family:{
        name:"test"
    }
}

var mockUserAdded = {
    dataValues: {
      id: 13,
      name: 'test2 name',
      emailAddress: 'test2@gmail.com',
      password: '4c0e41d09eb01fb3c5d73d7ee196e5a7',
      role: 'administrator',
      familyId: 12
    }
  }

var mockLogin = {
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiUGVkcm8iLCJpZCI6MywiZW1haWxBZGRyZXNzIjoiUGVkcm9AZ21haWwuY29tIiwicm9sZSI6ImFkbWluaXN0cmF0b3IiLCJpYXQiOjE2NjQ0NjkzMTcsImV4cCI6MTY2NDQ2OTQxN30.2t4SBgYqohZVbn-MyrSn7nFjxeMRxG_7nHmXWoVNlYo",
    role: "administrator"
}

var mockLoginData = {
    emailAddress:"test@gmail.com",
    password: "test"
}


// mock user repository
jest.mock("../repositories/userRepository", () => {
    const mockError = new Error("That family already exists");
    const mockErrorRepeat = new Error('That administrator already exists');
    const mockLoginError = new Error("User not registered in the system");
    const mockLoginDataError = new Error("Password and email cannot be empty");
    return jest.fn().mockImplementation(() => ({
        addAdministrator: jest.fn().mockReturnValueOnce(mockUserAdded)
        .mockImplementationOnce(() => {
          throw mockErrorRepeat
        }).mockImplementationOnce(() => {
          throw mockError
        }),
        login: jest.fn().mockReturnValueOnce(mockLogin)
        .mockImplementationOnce(() => {
          throw mockLoginError
        }).mockImplementationOnce(() => {
          throw mockLoginDataError
        })
    }));
  });

  const UserRepository = require("../repositories/userRepository");
  const UserService = require("../services/userService")
  const userService = new UserService();
  const userRepository = new UserRepository()
  

//--------------------------------- Test add user -----------------------------------//

test('add ok administrator test', async () => {
    expect(userRepository.addAdministrator()).toBe(mockUserAdded);
    expect(await userService.addAdministrator(mockUser)).toStrictEqual(mockUserAdded);
});

//--------------------------------- Test add repeat user  -------------------------------------//

const mockErrorRepeat = new Error('That administrator already exists');

test('add repeat administrator test', async () => {
  try {
    expect(userRepository.addAdministrator()).toStrictEqual(mockErrorRepeat);
  } catch (e) {
    try{
        expect(await userService.addAdministrator(mockUser)).toStrictEqual(mockErrorRepeat);
    }
    catch(er){
        expect(er).toStrictEqual(mockErrorRepeat);
    }
  }
  
});

//--------------------------------- Test add repeat family  -------------------------------------//


const mockError = new Error("That family already exists");

test('add repeat family administrator test', async () => {
  try {
    expect(userRepository.addAdministrator()).toStrictEqual(mockError);
  } catch (e) {
    try{
        expect(await userService.addAdministrator(mockUser)).toStrictEqual(mockError);
    }
    catch(er){
        expect(er).toStrictEqual(mockError);
    }
  }
});

//--------------------------------- Test Login -------------------------------------//

test('login ok test', async () => {
  expect(userRepository.login()).toBe(mockLogin);
  expect(await userService.login(mockLoginData)).toStrictEqual(mockLogin);
});

//--------------------------------- Test User not registered Login -------------------------------------//

const mockLoginError = new Error("User not registered in the system");

test('login user not registered test', async () => {
    try {
    expect(userRepository.login()).toStrictEqual(mockLoginError);
  } catch (e) {
    try{
        expect(await userService.login(mockLoginData)).toStrictEqual(mockLoginError);
    }
    catch(er){
        expect(er).toStrictEqual(mockLoginError);
    }
  }
});

//--------------------------------- Test incorrect data Login -------------------------------------//

const mockLoginDataError = new Error("Password and email cannot be empty");

test('login incorrect data test', async () => {
    try {
    expect(userRepository.login()).toStrictEqual(mockLoginDataError);
  } catch (e) {
    try{
        expect(await userService.login(mockLoginData)).toStrictEqual(mockLoginDataError);
    }
    catch(er){
        expect(er).toStrictEqual(mockLoginDataError);
    }
  }
});