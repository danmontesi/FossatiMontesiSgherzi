import 'dart:convert';
import 'package:data4help/Config.dart';
import 'package:data4help/model/Run.dart';
import 'package:data4help/model/RunPoint.dart';
import 'package:flutter/material.dart';

import 'package:http/http.dart' as http;

/// This is the model for the Run Organizer. It allows to get data from the backend and handles communication issues.
/// Initialize the class using a user + password and then call [login] if you want to login with those credentials or [registerUser] to register a user with those credentials.
class RunOrganizerModel {
  final String _email, _password;
  String _authToken;

  RunOrganizerModel(this._email, this._password);

  ///Logs the user in using the credential specified during the instantiation of the model.
  ///If the user is invalid throws an Exception
  Future<bool> login() async {
    Map<String, String> body = new Map<String, String>();
    body.putIfAbsent("email", () => _email);
    body.putIfAbsent("password", () => _password);
    body.putIfAbsent("type", () => "run_organizer");

    final response = await http.post(
        Config.BASE_URL + '/auth/login',
        body: body);

    if (response.statusCode == 200) {
      if (json.decode(response.body)['success'] == true) {
        _authToken = json.decode(response.body)['auth_token'];
        return true;
      }
      print(response.body);
      var error = json.decode(response.body)['message'];
      throw Exception('Server says: $error');
    } else {
      throw Exception('Failed to contact server.');
    }
  }

  /// Registers a new run organizer on the server, using the given details.
  /// [ssn] is the ssn of the user (16 characters), [name] the name of the user, [surname] the surname of the user, [birthDay] the birthday of the user formatted as yyyy-MM-dd
  Future<bool> registerRunOrganizer(String ssn, String name, String surname,
      String birthday) async {
    Map<String, String> body = new Map<String, String>();
    body.putIfAbsent("email", () => _email);
    body.putIfAbsent("username", () => _email);
    body.putIfAbsent("password", () => _password);
    body.putIfAbsent("SSN", () => ssn);
    body.putIfAbsent("name", () => name);
    body.putIfAbsent("surname", () => surname);
    body.putIfAbsent("birthday", () => birthday);

    final response = await http.post(
        Config.BASE_URL + '/auth/register_run_organizer',
        body: body);

    if (response.statusCode == 200) {
      if (json.decode(response.body)['success'] == true) {
        return true;
      }
      print(response.body);
      var error = json.decode(response.body)['message'];
      throw Exception('Server says: $error');
    } else {
      throw Exception('Failed to contact server.');
    }
  }

  /// Creates a new run based on the given [runPoints], starting at [startDate] [startTime], ending at [endTime] [endDate], with the given [description].
  Future<String> createNewRun(List<RunPoint> runPoints, DateTime startDate,
      TimeOfDay startTime, DateTime endDate, TimeOfDay endTime,
      String description) async {
    Map<String, String> head = new Map<String, String>();
    head.putIfAbsent("Content-Type", () => "application/json");
    DateTime begin, end;
    begin = startDate.add(
        new Duration(hours: startTime.hour, minutes: startTime.minute));
    end =
        endDate.add(new Duration(hours: endTime.hour, minutes: endTime.minute));


    String coordinatesList = "";
    runPoints.forEach((p) {
      coordinatesList += p.toJson();
      if (p != runPoints.last) {
        coordinatesList += ",";
      }
    });


    String jsonp = "{"
        "\"auth_token\": \"$_authToken\","
        "\"time_begin\": \"${begin.toIso8601String()}\","
        "\"time_end\": \"${end.toIso8601String()}\","
        "\"description\": \"$description\","
        "\"coordinates\":[$coordinatesList]"
        "}";

    print(jsonp);

    final response =
    await http.post(Config.BASE_URL + '/runs/run', body: jsonp, headers: head);


    print(response.body);
    print(json.decode(response.body)['message']);
    if (response.statusCode != 200) {
      return json.decode(response.body)['message'] ?? "Connection error!";
    }

    throw new Exception("Connection error!");
  }

  /// Retrive the list of the runs organized by the current logged in run organizer
  Future<List<Run>> retriveRunOrganizersRun() async {
    final response =
    await http.get(Config.BASE_URL + '/runs?auth_token=$_authToken');
    List<Run> runList = new List<Run>();

    if (response.statusCode == 200) {
      print(response.body);
      json.decode(response.body)["runs"].forEach((elem) {
        runList.add(Run.fromJson(elem));
      });

      //runList.removeWhere((run) => run.status != "RUN_ENDED");
      return runList;
    } else {
      throw new Exception(
          json.decode(response.body)['message'] ?? "Connection error!");
    }
  }
}