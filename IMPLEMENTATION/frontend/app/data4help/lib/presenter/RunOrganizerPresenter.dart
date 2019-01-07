import 'package:data4help/model/RunOrganizerModel.dart';
import 'package:data4help/model/RunPoint.dart';
import 'package:flutter/material.dart';

/// This is the model for the Run Organizer. It allows to get data from the model and handles caching.
/// Initialize the class using a user + password and then call [login] if you want to login with those credentials or [registerUser] to register a user with those credentials.
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

  ///Logs the user in using the credential specified during the instantiation of the model.
  ///If the user is invalid throws an Exception
  Future<bool> login() async {
    return await _runModel.login();
  }

  /// Registers a new run organizer on the server, using the given details.
  /// [ssn] is the ssn of the user (16 characters), [name] the name of the user, [surname] the surname of the user, [birthDay] the birthday of the user formatted as yyyy-MM-dd
  Future<bool> registerRunOrganizer(String ssn, String name, String surname,
      String birthday) async {
  return await _runModel.registerRunOrganizer(ssn, name, surname, birthday);
  }

  /// Creates a new run based on the given [runPoints], starting at [startDate] [startTime], ending at [endTime] [endDate], with the given [description].
  Future<String> createNewRun(List<RunPoint> runPoints, DateTime startDate,
      TimeOfDay startTime, DateTime endDate, TimeOfDay endTime,
      String description) async {
    return await _runModel.createNewRun(runPoints, startDate, startTime, endDate, endTime, description);
  }


}