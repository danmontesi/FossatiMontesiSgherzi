import 'dart:convert';
import 'package:data4help/Config.dart';
import 'package:data4help/model/RunPoint.dart';
import 'package:flutter/material.dart';

import 'package:http/http.dart' as http;

class RunOrganizerModel {
  final String _email, _password;
  String _authToken;

  RunOrganizerModel(this._email, this._password);

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
}