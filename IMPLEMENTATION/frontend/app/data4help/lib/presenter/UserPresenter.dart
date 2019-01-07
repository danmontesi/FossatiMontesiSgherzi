import 'package:data4help/data4help/dashboard/DashboardPendingQueriesRequests.dart';
import 'package:data4help/model/PendingQueryRequest.dart';
import 'package:data4help/model/UserData.dart';
import 'package:data4help/model/UserModel.dart';
import 'package:data4help/track4run/Run.dart';
import 'package:data4help/track4run/RunPoint.dart';

class UserPresenter {
  final UserModel _userModel;

  static UserPresenter _singleton;

  UserPresenter(String username, String password)
      : _userModel = new UserModel(username, password){
    _singleton=this;
  }

  static UserPresenter getActivePresenter(){
    return _singleton;
  }

  Future<UserPersonalData> retriveUserPersonalData() async {
    return await _userModel.retriveUserPersonalData();
  }

  Future<bool> login() async {
    return await _userModel.login();
  }

  Future<bool> registerUser(String ssn, String name, String surname,
      String birthDay, String smartwatchModel) async {
    return await _userModel.fetchAuthToken(
        ssn, name, surname, birthDay, smartwatchModel);
  }

  Future<List<RunPoint>> getRunPositions(int runId) async {
    return _userModel.getRunPositions(runId);
  }

  Future<UserData> loadDataOfDatetime(String dateToLoad) async {
    return await _userModel.loadDataOfDatetime(dateToLoad);
  }

  Future<List<PendingQueryRequest>> retrivePendingQueries() async {
    return await _userModel.retrivePendingQueries();
  }

  Future<String> respondToPendingQuery(int queryId, bool accept) async {
    return await _userModel.respondToPendingQuery(queryId, accept);
  }

  Future<List<Run>> retriveNearbyRuns() async {
    return await _userModel.retriveNearbyRuns();
  }

  Future<String> subscribeUserToRun(int id) async {
    return await _userModel.subscribeUserToRun(id);
  }

  Future<String> sendDummyUserDataToServer(DateTime dayOfGeneration) async {
    UserData data = UserData.generateSampleData(dayOfGeneration);

    return await _userModel.sendUserDataToServer(data);
  }
}
