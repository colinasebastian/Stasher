
var mockNotifyUser = {
    emailAddress:"test@gmail.com"
}

var email = {
    email:"test@gmail.com"
}

const ctx = {
    request: {
      method: 'POST',
      url: '/api/notification/user',
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

// mock notification Service
jest.mock("../services/notificationService", () => {
    const mockErrorRepeat = new Error('This user is already added to notice to this category');
    const mockErrorDeleted = new Error('The user to unsubscribe does not exist or has already been unsubscribed');
    return jest.fn().mockImplementation(() => ({
      addNotifyUser: jest.fn().mockReturnValueOnce(mockNotifyUser)
        .mockImplementationOnce(() => {
          throw mockErrorRepeat
        }).mockImplementationOnce(() => {
          throw mockError
        }),
        getAllNotifyByUser: jest.fn().mockReturnValueOnce(mockNotifyUser),
        deleteNotifyUser: jest.fn().mockReturnValueOnce("User deleted to notice successfully")
        .mockImplementationOnce(() => {
          throw mockErrorDeleted
        })
        
    }));
  });

  const NotificationController = require("../controllers/notificationController");
  var notificationController = new NotificationController();

  const NotificationService = require("../services/notificationService")
  var notificationService = new NotificationService();
  

//--------------------------------- Test add notify user -----------------------------------//

test('add ok notify user test', async () => {
    expect(notificationService.addNotifyUser()).toBe(mockNotifyUser);
    await notificationController.notify(ctx);
    expect(ctx.body).toStrictEqual(mockNotifyUser);
});

//--------------------------------- Test add repeat user  -------------------------------------//

const mockErrorRepeat = new Error('This user is already added to notice to this category');

const ctxResultRepeat = {
  status: 500,
  message: "This user is already added to notice to this category"
};

test('add repeat notify user test', async () => {
  try {
    expect(notificationService.addNotifyUser()).toStrictEqual(mockErrorRepeat);
  } catch (e) {
   
  await notificationController.notify(ctx)
  expect(ctx.body).toStrictEqual(ctxResultRepeat);
  }
  
});


//--------------------------------- Test delete notify user -----------------------------------//

test('delete ok notify user test', async () => {
  expect(notificationService.deleteNotifyUser()).toBe(mockNotifyUser);
  await notificationController.deleteNotify(ctx);
  expect(ctx.body).toStrictEqual("User deleted to notice successfully");
});

//--------------------------------- Test add repeat user  -------------------------------------//

const mockErrorDeleted = new Error('The user to unsubscribe does not exist or has already been unsubscribed');

const ctxResultDeleted = {
status: 500,
message: "The user to unsubscribe does not exist or has already been unsubscribed"
};

test('delete bad notify user test', async () => {
try {
  expect(notificationService.deleteNotifyUser()).toStrictEqual(mockErrorDeleted);
} catch (e) {
 
await notificationController.deleteNotify(ctx)
expect(ctx.body).toStrictEqual(ctxResultDeleted);
}

});

//--------------------------------- Test get notify user -----------------------------------//

test('delete ok notify user test', async () => {
  expect(notificationService.getAllNotifyByUser()).toBe(email);
  await notificationController.getAllNotificationByUser(ctx);
  expect(ctx.body).toStrictEqual(mockNotifyUser);
});