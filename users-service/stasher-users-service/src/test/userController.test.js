
var mockUser = {
    name : "test name",
    emailAddress:"test@gmail.com",
    password: "test",
    family:{
        name:"test"
    }
}

var mockLogin = {
  data: {
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiUGVkcm8iLCJpZCI6MywiZW1haWxBZGRyZXNzIjoiUGVkcm9AZ21haWwuY29tIiwicm9sZSI6ImFkbWluaXN0cmF0b3IiLCJpYXQiOjE2NjQ0NjkzMTcsImV4cCI6MTY2NDQ2OTQxN30.2t4SBgYqohZVbn-MyrSn7nFjxeMRxG_7nHmXWoVNlYo",
    role: "administrator"
}
}

var emailExpected = {
    email:"test@gmail.com"
}

const ctx = {
    request: {
      method: 'POST',
      url: '/api/administrator',
      header: {
        'content-type': 'application/json',
        'user-agent': 'PostmanRuntime/7.29.2',
        accept: '*/*',
        'postman-token': '74f5dc72-68b7-4249-acf3-3dd7a679128d',
        host: 'localhost:8080',
        'accept-encoding': 'gzip, deflate, br',
        connection: 'keep-alive',
        'content-length': '155'
      }
    }
  }

// mock user Service
jest.mock("../services/userService", () => {
    const mockError = new Error("That family already exists");
    const mockErrorRepeat = new Error('That administrator already exists');
    const mockLoginError = new Error("User not registered in the system");
    const mockLoginDataError = new Error("Password and email cannot be empty");
    return jest.fn().mockImplementation(() => ({
        addAdministrator: jest.fn().mockReturnValueOnce(mockUser)
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

  const UserController = require("../controllers/userController");
  var userController = new UserController();

  const UserService = require("../services/userService")
  var userService = new UserService();
  

//--------------------------------- Test add user -----------------------------------//

test('add ok administrator test', async () => {
    expect(userService.addAdministrator()).toBe(mockUser);
    await userController.registerAdministrator(ctx);
    expect(ctx.body).toStrictEqual(emailExpected);
});

//--------------------------------- Test add repeat user  -------------------------------------//

const mockErrorRepeat = new Error('That administrator already exists');

const ctxResultRepeat = {
  status: 500,
  message: "That administrator already exists"
};

test('add repeat administrator test', async () => {
  try {
    expect(userService.addAdministrator()).toStrictEqual(mockErrorRepeat);
  } catch (e) {
   
  await userController.registerAdministrator(ctx)
  expect(ctx.body).toStrictEqual(ctxResultRepeat);
  }
  
});


//--------------------------------- Test add repeat family  -------------------------------------//


const mockError = new Error("That family already exists");

const ctxResult = {
  status: 500,
  message: "That family already exists"
};

test('add repeat family administrator test', async () => {
  try {
    expect(userService.addAdministrator()).toStrictEqual(mockError);
  } catch (e) {
  await userController.registerAdministrator(ctx)
  expect(ctx.body).toStrictEqual(ctxResult);
  }
});


//--------------------------------- Test Login -------------------------------------//

test('login ok test', async () => {
  expect(userService.login()).toBe(mockLogin);
  await userController.login(ctx);
  expect(ctx.body.data).toStrictEqual(mockLogin);
});

//--------------------------------- Test User not registered Login -------------------------------------//

const mockLoginError = new Error("User not registered in the system");

const ctxResultLogin = {
  status: 400,
  message: "User not registered in the system"
};

test('login user not registered test', async () => {
    try {
    expect(userService.login()).toStrictEqual(mockLoginError);
  } catch (e) {
    await userController.login(ctx);
    expect(ctx.body).toStrictEqual(ctxResultLogin);
  }
});


//--------------------------------- Test incorrect data Login -------------------------------------//

const mockLoginDataError = new Error("Password and email cannot be empty");

const ctxResultDataLogin = {
  status: 400,
  message: "Password and email cannot be empty"
};

test('login incorrect data test', async () => {
    try {
    expect(userService.login()).toStrictEqual(mockLoginDataError);
  } catch (e) {
    await userController.login(ctx);
    expect(ctx.body).toStrictEqual(ctxResultDataLogin);
  }
});