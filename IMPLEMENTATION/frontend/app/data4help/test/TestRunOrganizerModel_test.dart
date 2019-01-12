import 'package:data4help/model/RunOrganizerModel.dart';
import 'package:data4help/model/RunPoint.dart';
import 'package:flutter/material.dart';
import "package:test/test.dart";

void main() {
  test("Login with correct email/password", () async {
    expect(
        await new RunOrganizerModel("fo.ssanico@gmail.com", "password").login(), true);
  });

  test("Login with incorrect email/password", () async{
    try{
      var a = await RunOrganizerModel("fo.ssanico@gmail.com", "passworda").login();

      fail("");
    }catch(e){
    }
  });


  test("List of runs not null", () async{
    var a = RunOrganizerModel("fo.ssanico@gmail.com", "password");
    await a.login();

    var data = await a.retriveRunOrganizersRun();

    expect(data, isNotNull);
  });


  test("Invalid run creation", () async{
    try{
      var a = RunOrganizerModel("fo.ssanico@gmail.com", "password");

      await a.login();

      a.createNewRun(new List<RunPoint>(), new DateTime(2018, 1, 2), new TimeOfDay(hour: 0, minute: 0), new DateTime(2018, 1, 1), new TimeOfDay(hour: 0, minute: 0), "Test run");

      fail("");
    }catch(e){
      print(e);
    }
  });


}












