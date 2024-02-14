var mockNotifyUser = {
  emailAddress:"test@gmail.com"
}

// mock user repository
jest.mock("../repositories/notifyUserRepository", () => {
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

const NotifyUserRepository = require("../repositories/notifyUserRepository");
const NotificationService = require("../services/notificationService");
const userService = new NotificationService();
const notifyUserRepository = new NotifyUserRepository()
  

//--------------------------------- Test add notify user -----------------------------------//

test('add ok notify user test', async () => {
    expect(notifyUserRepository.addNotifyUser()).toBe(mockNotifyUser);
    expect(await userService.addNotifyUser(mockNotifyUser)).toStrictEqual(mockNotifyUser);
});

//--------------------------------- Test add repeat notify user  -------------------------------------//

const mockErrorRepeat = new Error('This user is already added to notice to this category');

test('add repeat notify user test', async () => {
  try {
    expect(notifyUserRepository.addNotifyUser()).toStrictEqual(mockErrorRepeat);
  } catch (e) {
    try{
        expect(await userService.addNotifyUser(mockNotifyUser)).toStrictEqual(mockErrorRepeat);
    }
    catch(er){
        expect(er).toStrictEqual(mockErrorRepeat);
    }
  }
  
});


//--------------------------------- Test delete notify user -----------------------------------//

test('delete ok notify user test', async () => {
  expect(notifyUserRepository.deleteNotifyUser()).toBe(mockNotifyUser);
  expect(await userService.deleteNotifyUser(mockNotifyUser)).toStrictEqual("User deleted to notice successfully");
});

//--------------------------------- Test delete bad notify user  -------------------------------------//

const mockErrorDelete = new Error('This user is already added to notice to this category');

test('delete bad notify user test', async () => {
try {
  expect(notifyUserRepository.addNotifyUser()).toStrictEqual(mockErrorDelete);
} catch (e) {
  try{
      expect(await userService.addNotifyUser(mockNotifyUser)).toStrictEqual(mockErrorDelete);
  }
  catch(er){
      expect(er).toStrictEqual(mockErrorDelete);
  }
}

});


//--------------------------------- Test get notify user -----------------------------------//

test('get notify user test', async () => {
  expect(notifyUserRepository.getAllNotifyByUser()).toBe(mockNotifyUser);
  expect(await userService.getAllNotifyByUser(mockNotifyUser)).toStrictEqual(mockNotifyUser);
});