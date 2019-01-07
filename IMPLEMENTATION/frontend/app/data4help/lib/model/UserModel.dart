import 'dart:convert';

import 'package:data4help/Config.dart';
import 'package:data4help/data4help/dashboard/DashboardPendingQueriesRequests.dart';
import 'package:data4help/model/PendingQueryRequest.dart';
import 'package:data4help/model/UserData.dart';
import 'package:data4help/track4run/Run.dart';
import 'package:data4help/track4run/RunPoint.dart';
import 'package:http/http.dart' as http;

class UserModel {
  final String _email, _password;
  String _authToken;

  UserModel(this._email, this._password);

  Future<UserPersonalData> retriveUserPersonalData() async {
    if (_authToken == null) throw LoginException();

    final response =
        await http.get(Config.BASE_URL + '/indiv/user?auth_token=$_authToken');

    if (response.statusCode == 200) {
      print(response.body);
      final userData = json.decode(response.body)["user"];
      return new UserPersonalData(userData["name"], userData["surname"]);
    }
    throw Exception("Connection error");
  }

  Future<bool> login() async {
    Map<String, String> body = new Map<String, String>();
    body.putIfAbsent("email", () => _email);
    body.putIfAbsent("password", () => _password);
    body.putIfAbsent("type", () => "individual");

    final response =
        await http.post(Config.BASE_URL + '/auth/login', body: body);
    print(response.body);
    if (response.statusCode == 200) {
      if (json.decode(response.body)['success'] == true) {
        _authToken = json.decode(response.body)['auth_token'];

        return true;
      } else {
        print(response.body);
        var error = json.decode(response.body)['message'];
        throw Exception('Server says: $error');
      }
    } else {
      throw Exception('Failed to contact server.');
    }
  }

  Future<bool> fetchAuthToken(String ssn, String name, String surname, String birthDay,
      String smartwatchModel) async {
    Map<String, String> body = new Map<String, String>();
    body.putIfAbsent("email", () => _email);
    body.putIfAbsent("username", () => _email);
    body.putIfAbsent("password", () => _password);
    body.putIfAbsent("SSN", () => ssn);
    body.putIfAbsent("name", () => name);
    body.putIfAbsent("surname", () => surname);
    body.putIfAbsent("birthday", () => birthDay);
    body.putIfAbsent("smartwatch", () => smartwatchModel);

    final response =
        await http.post(Config.BASE_URL + '/auth/register_user', body: body);

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

  Future<List<RunPoint>> getRunPositions(int runId) async {
    final response = await http.get(Config.BASE_URL +
        '/runs/positions?auth_token=$_authToken&run_id=$runId');
    print(response.body);

    if (response.statusCode == 200) {
      return _decodePos(response.body);
    } else {
      throw Exception("Connection error!");
    }
  }

  Future<UserData> loadDataOfDatetime(String dateToLoad) async {
    final response = await http.get(Config.BASE_URL +
        '/indiv/data?auth_token=$_authToken&begin_date=$dateToLoad&end_date=${dateToLoad + "T23:59:59Z"}');
    print(response.body);
    if (response.statusCode == 200) {
      return UserData.fromJson(json.decode(response.body)["data"]);
    }
    throw Exception("Connection error!");
  }

  Future<List<PendingQueryRequest>> retrivePendingQueries() async {
    final response = await http.get(Config.BASE_URL +
        '/queries/query/individual/pending?auth_token=$_authToken');
    List<PendingQueryRequest> queryList = new List<PendingQueryRequest>();

    if (response.statusCode == 200) {
      print(response.body);
      json.decode(response.body)["queries"].forEach((elem) {
        queryList.add(PendingQueryRequest.fromJson(elem));
      });
      return queryList;
    } else {
      throw Exception("Connection error!");
    }
  }

  Future<String> respondToPendingQuery(int queryId, bool accept) async {
    Map<String, String> body = new Map<String, String>();
    body.putIfAbsent("auth_token", () => _authToken);
    body.putIfAbsent("query_id", () => queryId.toString());
    body.putIfAbsent("decision", () => accept.toString());

    final response = await http.post(
        Config.BASE_URL + '/queries/query/individual/pending',
        body: body);
    print(response.body);

    return json.decode(response.body)['message'] ?? "Connection error!";
  }

  Future<List<Run>> retriveNearbyRuns() async {
    final response =
        await http.get(Config.BASE_URL + '/runs?auth_token=$_authToken');
    List<Run> runList = new List<Run>();

    if (response.statusCode == 200) {
      print(response.body);
      json.decode(response.body)["runs"].forEach((elem) {
        runList.add(Run.fromJson(elem));
      });

      runList.removeWhere((run) => run.status != "RUN_ENDED");
      return runList;
    } else {
      throw new Exception(
          json.decode(response.body)['message'] ?? "Connection error!");
    }
  }

  Future<String> subscribeUserToRun(int id) async {
    Map<String, String> body = new Map<String, String>();
    body.putIfAbsent("auth_token", () => _authToken);
    body.putIfAbsent("run_id", () => id.toString());

    final response =
        await http.post(Config.BASE_URL + '/runs/join', body: body);
    print(response.body);
    print(json.decode(response.body)['message']);
    return json.decode(response.body)['message'] ?? "Connection error!";
  }

  List<RunPoint> _decodePos(String body) {
    final list = List<RunPoint>();
    throw Exception("TODO!!!");
    return list;
  }

  Future<String> sendUserDataToServer(UserData data) async {
    Map<String, String> body = new Map<String, String>();
    body.putIfAbsent("auth_token", () => _authToken);


    body.putIfAbsent("data", () => data.toJson());

    final response =
        await http.post(Config.BASE_URL + '/indiv/data', body: body);
    print(response.body);
    print(json.decode(response.body)['message']);
    return json.decode(response.body)['message'] ?? "Connection errror!";
  }
}

class LoginException implements Exception {
  LoginException();

  String toString() {
    return "Exception: User not logged in!";
  }
}

class UserPersonalData {
  final String name, surname;

  UserPersonalData(this.name, this.surname);
}

