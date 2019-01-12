import 'dart:convert';

import 'package:data4help/Config.dart';
import 'package:data4help/model/PendingQueryRequest.dart';
import 'package:data4help/model/Run.dart';
import 'package:data4help/model/RunPoint.dart';
import 'package:data4help/model/UserData.dart';
import 'package:data4help/model/UserPersonalData.dart';
import 'package:http/http.dart' as http;

/// This is the model for the User. It allows to get data from the backend and handles communication issues.
/// Initialize the class using a user + password and then call [login] if you want to login with those credentials or [registerUser] to register a user with those credentials.
class UserModel {
  final String _email, _password;
  String _authToken;

  ///Creates a new UserModel with the [_email] and [_password] given.
  UserModel(this._email, this._password);

  ///If the user il logged in, returns a UserPersonalData containing the current user's data
  Future<UserPersonalData> retriveUserPersonalData() async {
    if (_authToken == null) throw LoginException();

    final response =
        await http.get(Config.BASE_URL + '/indiv/user?auth_token=$_authToken');

    if (response.statusCode == 200) {
      print(response.body);
      final userData = json.decode(response.body)["user"];
      return  new UserPersonalData.fromJson(userData);
    }
    throw Exception("Connection error");
  }

  ///Logs the user in using the credential specified during the instantiation of the model.
  ///If the user is invalid throws an Exception
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

  /// Registers a new user on the server, using the given details.
  /// [ssn] is the ssn of the user (16 characters), [name] the name of the user, [surname] the surname of the user, [birthDay] the birthday of the user formatted as yyyy-MM-dd
  Future<bool> registerUser(String ssn, String name, String surname,
      String birthDay, String smartwatchModel) async {
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

  ///Returns a List of RunPoint representing the positions of the runners in the given runId run.
  ///In [runId] the id of the run must be specified.
  Future<List<RunPoint>> getRunPositions(int runId) async {
    if (_authToken == null) throw LoginException();
    final response = await http.get(Config.BASE_URL +
        '/runs/positions?auth_token=$_authToken&run_id=$runId');
    print(response.body);

    if (response.statusCode == 200) {
      final list = List<RunPoint>();
      var jsonp = json.decode(response.body);

      jsonp["positions"].forEach((el) {
        if (el["lastPosition"]["lat"] != -9999.0) {
          //list.add(new RunPoint(el["lastPosition"]["lat"], el["lastPosition"]["long"], 0, el["id"].toString()));
          list.add(new RunPoint.fromJson(el));
        }
      });
      return list;
    } else {
      throw Exception("Connection error!");
    }
  }

  /// Returns a UserData containing all the available data for a specific day.
  /// The [dateToLoad] must be formatted as yyyy-MM-dd.
  Future<UserData> loadDataOfDatetime(String dateToLoad) async {
    if (_authToken == null) throw LoginException();
    final response = await http.get(Config.BASE_URL +
        '/indiv/data?auth_token=$_authToken&begin_date=$dateToLoad&end_date=${dateToLoad + "T23:59:59Z"}');
    print(response.body);
    if (response.statusCode == 200) {
      return UserData.fromJson(json.decode(response.body)["data"]);
    }
    throw Exception("Connection error!");
  }

  /// Returns a list of all the companies pending queries of the logged in user
  Future<List<PendingQueryRequest>> retrivePendingQueries() async {
    if (_authToken == null) throw LoginException();
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

  /// Responds to a pending query, specifying if the user accept or deny the request.
  /// In the [queryId] a query must be specified, and [accept] can be true if the user wants to accept the request, false otherwise
  Future<String> respondToPendingQuery(int queryId, bool accept) async {
    if (_authToken == null) throw LoginException();
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

  /// Retrive the list of runs near the user.
  Future<List<Run>> retriveNearbyRuns() async {
    if (_authToken == null) throw LoginException();
    final response =
        await http.get(Config.BASE_URL + '/runs?auth_token=$_authToken');
    List<Run> runList = new List<Run>();

    if (response.statusCode == 200) {
      print(response.body);
      json.decode(response.body)["runs"].forEach((elem) {
        //print(elem);
        runList.add(Run.fromJson(elem));
      });

      runList.removeWhere((run) => run.status == "RUN_ENDED");
      return runList;
    } else {
      throw new Exception(
          json.decode(response.body)['message'] ?? "Connection error!");
    }
  }

  /// Subscribe the logged in user to the run specified in [id].
  Future<String> subscribeUserToRun(int id) async {
    print(id);
    if (_authToken == null) throw LoginException();
    Map<String, String> body = new Map<String, String>();
    body.putIfAbsent("auth_token", () => _authToken);
    body.putIfAbsent("run_id", () => id.toString());

    final response =
        await http.post(Config.BASE_URL + '/runs/join', body: body);
    print(response.body);
    print(json.decode(response.body)['message']);
    return json.decode(response.body)['message'] ?? "Connection error!";
  }

  /// Send the user data of the loged in user to the server. [data] must not be null.
  Future<String> sendUserDataToServer(UserData data) async {
    assert(data != null);
    if (_authToken == null) throw LoginException();
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

/// An exception that is thrown when the action requires a logged in user but login() has not been called yed or has failed.
class LoginException implements Exception {
  LoginException();

  String toString() {
    return "Exception: User not logged in!";
  }
}
