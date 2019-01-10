import 'package:data4help/model/UserPersonalData.dart';
import 'package:data4help/model/PendingQueryRequest.dart';
import 'package:data4help/model/UserData.dart';
import 'package:data4help/model/UserModel.dart';
import 'package:data4help/model/Run.dart';
import 'package:data4help/model/RunPoint.dart';
import 'package:intl/intl.dart';

/// This is the presenter for the User. It allows to get data from the backend using the model and caching and filtering functionality.
/// Initialize the class using a user + password and then call [login] if you want to login with those credentials or [registerUser] to register a user with those credentials.
class UserPresenter {
  final UserModel _userModel;

  static UserPresenter _singleton;

  ///Creates a new UserModel with the [_email] and [_password] given.
  UserPresenter(String username, String password)
      : _userModel = new UserModel(username, password){
    _singleton=this;
  }

  ///Get the latest used UserPresenter. May be null.
  static UserPresenter getActivePresenter(){
    return _singleton;
  }

  ///If the user il logged in, returns a UserPersonalData containing the current user's data
  Future<UserPersonalData> retriveUserPersonalData() async {
    return await _userModel.retriveUserPersonalData();
  }

  ///Logs the user in using the credential specified during the instantiation of the model.
  ///If the user is invalid throws an Exception
  Future<bool> login() async {
    return await _userModel.login();
  }

  /// Registers a new user on the server, using the given details.
  /// [ssn] is the ssn of the user (16 characters), [name] the name of the user, [surname] the surname of the user, [birthDay] the birthday of the user formatted as yyyy-MM-dd
  Future<bool> registerUser(String ssn, String name, String surname,
      String birthDay, String smartwatchModel) async {
    if (ssn==null || name == null || surname == null || birthDay == null || smartwatchModel == null) throw Exception("The arguments must not be null!");

    if(ssn.isEmpty){
      throw new Exception("Please, insert an SSN!");
    }else{
      if(ssn.length!=16){
        throw Exception("The SSN must be exactly 16 characters long.");
      }
    }

    if(name.isEmpty){
      throw new Exception("Please, insert an name!");
    }

    if(surname.isEmpty){
      throw new Exception("Please, insert an surname!");
    }

    if(birthDay.isEmpty){
      throw new Exception("Please, insert the birth date!");
    }else{
      if(_convertToDate(birthDay) == null){
        throw new Exception("Please, insert the birth date in format yyyy-MM-dd!");
      }
    }



    return await _userModel.registerUser(
        ssn, name, surname, birthDay, smartwatchModel);
  }

  ///Returns a List of RunPoint representing the positions of the runners in the given runId run.
  ///In [runId] the id of the run must be specified.
  Future<List<RunPoint>> getRunPositions(int runId) async {
    if(runId == null || runId < 0){
      throw new Exception("Please, insert an valid runId!");
    }

    return _userModel.getRunPositions(runId);
  }

  /// Returns a UserData containing all the available data for a specific day.
  /// The [dateToLoad] must be formatted as yyyy-MM-dd.
  Future<UserData> loadDataOfDatetime(String dateToLoad) async {
    if(dateToLoad == null || dateToLoad.isEmpty){
      throw new Exception("Please, insert the dateToLoad!");
    }else{
      if(_convertToDate(dateToLoad) == null){
        throw new Exception("Please, insert the dateToLoad in format yyyy-MM-dd!");
      }
    }
    return await _userModel.loadDataOfDatetime(dateToLoad);
  }

  /// Returns a list of all the companies pending queries of the logged in user
  Future<List<PendingQueryRequest>> retrivePendingQueries() async {
    return await _userModel.retrivePendingQueries();
  }

  /// Responds to a pending query, specifying if the user accept or deny the request.
  /// In the [queryId] a query must be specified, and [accept] can be true if the user wants to accept the request, false otherwise
  Future<String> respondToPendingQuery(int queryId, bool accept) async {
    if(queryId == null || queryId < 0){
      throw new Exception("Please, insert an valid queryId!");
    }
    return await _userModel.respondToPendingQuery(queryId, accept);
  }

  /// Retrive the list of runs near the user.
  Future<List<Run>> retriveNearbyRuns() async {
    return await _userModel.retriveNearbyRuns();
  }

  /// Subscribe the logged in user to the run specified in [id].
  Future<String> subscribeUserToRun(int runId) async {
    if(runId == null || runId < 0){
      throw new Exception("Please, insert an valid queryId!");
    }
    return await _userModel.subscribeUserToRun(runId);
  }

  /// Send to the server some dummy data for the specified [dayOfGeneration].
  Future<String> sendDummyUserDataToServer(DateTime dayOfGeneration) async {
    if(dayOfGeneration == null){
      throw new Exception("dayOfGeneration cannot be null!");
    }
    UserData data = UserData.generateSampleData(dayOfGeneration);

    return await _userModel.sendUserDataToServer(data);
  }

  DateTime _convertToDate(String input) {
    try {
      var d = new DateFormat("yyyy-MM-dd").parseStrict(input);
      return d;
    } catch (e) {
      return null;
    }
  }
}
