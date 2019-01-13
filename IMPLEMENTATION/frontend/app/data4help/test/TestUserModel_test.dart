import 'package:data4help/model/UserData.dart';
import 'package:data4help/model/UserModel.dart';
import "package:test/test.dart";

void main() {
  test("Login with correct email/password", () async {
    expect(
        await new UserModel("fossanico@gmail.com", "password").login(), true);
  });

  test("Login with incorrect email/password", () async{
    try{
      var a = await UserModel("fossanico@gmail.com", "passworda").login();

      fail("");
    }catch(e){
    }
  });


  test("Get user information", () async{
      var a = UserModel("fossanico@gmail.com", "password");
      await a.login();

      var data = await a.retriveUserPersonalData();

      expect(data.surname, "Fossa");
      expect(data.name, "Nico");
  });

  test("Register already existant user", () async{
    var a = UserModel("fossanico@gmail.com", "password");
    try{
      await a.registerUser("0123456789012399", "Nico", "Fossa", "2018-01-01", "SWR3");
      fail("");
    }catch(e){
    }
  });


  test("List of runs not null", () async{
    var a = UserModel("fossanico@gmail.com", "password");
    await a.login();

    var data = await a.retriveNearbyRuns();

    expect(data, isNotNull);
  });

  test("Data of datetime not null", () async{
    var a = UserModel("fossanico@gmail.com", "password");
    await a.login();

    var data = await a.loadDataOfDatetime("2018-01-01");

    expect(data, isNotNull);
    expect(data.gpsCoordinates, isNotNull);
    expect(data.heartRate, isNotNull);
    expect(data.accelerometer, isNotNull);
  });

  test("Effectiveness of sending data", () async{
    var a = UserModel("fossanico@gmail.com", "password");
    await a.login();

    print(UserData.generateSampleData(DateTime(2018, 1, 1)).toJson());

    await a.sendUserDataToServer(UserData.generateSampleData(DateTime(2018, 1, 1)));

    var data = await a.loadDataOfDatetime("2018-01-01");

    expect(data, isNotNull);
    expect(data.gpsCoordinates, isNotNull);
    expect(data.heartRate, isNotNull);
    expect(data.accelerometer, isNotNull);
    expect(data.accelerometer.length, greaterThan(0));
    expect(data.heartRate.length, greaterThan(0));
    expect(data.gpsCoordinates.length, greaterThan(0));
  });

  test("Retrive run position of runners", () async{
    var a = UserModel("fossanico@gmail.com", "password");
    await a.login();

    var data = await a.getRunPositions(70); //THIS IS AN EXISTENT RUN

    expect(data, isNotNull);


    try{
      var data = await a.getRunPositions(-1); //THIS IS A NON EXISTENT RUN
      fail("");
    }catch(e){
    }
  });


  test("Pending queries not null", () async{
    var a = UserModel("fossanico@gmail.com", "password");
    await a.login();

    var data = await a.retrivePendingQueries();

    expect(data, isNotNull);
  });

  test("Respond to not existing query", () async{
    var a = UserModel("fossanico@gmail.com", "password");
    await a.login();

    try{
      var data = await a.respondToPendingQuery(-1, false); //THIS IS A NON EXISTENT QUERY
      fail("");
    }catch(e){
    }
  });
}












