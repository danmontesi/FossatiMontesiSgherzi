import 'package:data4help/model/RunOrganizerModel.dart';
import 'package:data4help/model/RunPoint.dart';
import 'package:flutter/material.dart';

class RunOrganizerPresenter{
  final RunOrganizerModel _runModel;

  static RunOrganizerPresenter _singleton;

  RunOrganizerPresenter(String username, String password)
      : _runModel = new RunOrganizerModel(username, password){
    _singleton=this;
  }

  static RunOrganizerPresenter getActivePresenter(){
    return _singleton;
  }

  Future<bool> login() async {
    return await _runModel.login();
  }

  Future<bool> registerRunOrganizer(String ssn, String name, String surname,
      String birthday) async {
  return await _runModel.registerRunOrganizer(ssn, name, surname, birthday);
  }

  Future<String> createNewRun(List<RunPoint> runPoints, DateTime startDate,
      TimeOfDay startTime, DateTime endDate, TimeOfDay endTime,
      String description) async {
    return await _runModel.createNewRun(runPoints, startDate, startTime, endDate, endTime, description);
  }


}