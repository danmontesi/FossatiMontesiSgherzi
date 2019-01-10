
import 'package:data4help/view/data4help/WatchRun.dart';
import 'package:data4help/presenter/UserPresenter.dart';
import 'package:data4help/model/Run.dart';
import 'package:flutter/material.dart';

class DashboardRunRegistrationPage extends StatefulWidget {
  DashboardRunRegistrationPage({Key key, this.title})
      : super(key: key);
  final String title;

  @override
  _DashboardRunRegistrationPageState createState() =>
      new _DashboardRunRegistrationPageState();
}

class _DashboardRunRegistrationPageState
    extends State<DashboardRunRegistrationPage> {

  List<Run> _runList = [];

  @override
  void initState() {
    _retriveRuns();
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return new Column(
      mainAxisSize: MainAxisSize.max,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: <Widget>[
        new Text("Nearby runs:"),
        new MaterialButton(onPressed: _retriveRuns, child: new Icon(Icons.refresh),),
        Expanded(
          child: ListView.separated(
            separatorBuilder: (context, index) {
              return Divider();
            },
            itemCount: _runList.length,
            itemBuilder: (context, index) {
              return ListTile(
                title: Text('${_runList[index].id} - ${_runList[index].description}'),
                trailing: (_runList[index].status=="ACCEPTING_SUBSCRIPTION"?
                    new MaterialButton(
                      onPressed: () => _subscribeUser(_runList[index].id),
                      child: new Text("SUBSCRIBE"),
                    )
                        :
                    new MaterialButton(
                      onPressed: () => _watchRun(_runList[index].id),
                      child: new Text("WATCH"),
                    )
                ),
              );
            },
          ),
        ),
      ],
    );
  }






  _watchRun(int index) {
    Navigator.push(
        context, MaterialPageRoute(builder: (context) => WatchRun(index)));
  }

  void _retriveRuns() {
    UserPresenter.getActivePresenter().retriveNearbyRuns().then((data){
      setState(() {
        _runList=data;
      });

    }).catchError((error) {
      Scaffold.of(context).showSnackBar(new SnackBar(content: new Text("$error")));
    });
  }

  _subscribeUser(int id) {
    UserPresenter.getActivePresenter().subscribeUserToRun(id).then((data){
      Scaffold.of(context).showSnackBar(new SnackBar(content: new Text("$data")));
    }).catchError((error) {
      Scaffold.of(context).showSnackBar(new SnackBar(content: new Text("$error")));
    }).whenComplete((){
      _retriveRuns();
    });
  }
}














