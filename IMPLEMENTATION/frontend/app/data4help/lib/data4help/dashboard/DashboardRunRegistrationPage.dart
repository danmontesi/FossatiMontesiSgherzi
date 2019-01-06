import 'dart:convert';

import 'package:data4help/data4help/UserData.dart';
import 'package:data4help/data4help/WatchRun.dart';
import 'package:data4help/track4run/Run.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:intl/intl.dart';

class DashboardRunRegistrationPage extends StatefulWidget {
  DashboardRunRegistrationPage(this.authtoken, {Key key, this.title})
      : super(key: key);
  final String title, authtoken;

  @override
  _DashboardRunRegistrationPageState createState() =>
      new _DashboardRunRegistrationPageState();
}

class _DashboardRunRegistrationPageState
    extends State<DashboardRunRegistrationPage> {

  List<Run> runList = [];

  @override
  Widget build(BuildContext context) {
    return new Column(
      mainAxisSize: MainAxisSize.max,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: <Widget>[
        new Text("Nearby runs:"),
        new MaterialButton(onPressed: _retriveRuns, child: new Icon(Icons.refresh),),
        Expanded(
          child: ListView.builder(
            itemCount: runList.length,
            itemBuilder: (context, index) {
              return ListTile(
                title: Text('${runList[index].id} - ${runList[index].description}'),
                trailing: (runList[index].status=="ACCEPTING_SUBSCRIPTION"?
                    new MaterialButton(
                      onPressed: () => _subscribeUser(index),
                      child: new Text("SUBSCRIBE"),
                    )
                        :
                    new MaterialButton(
                      onPressed: () => _watchRun(runList[index].id),
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


  _subscribeUser(int index) async{
    Map<String, String> body = new Map<String, String>();
    body.putIfAbsent("auth_token", () => widget.authtoken);
    body.putIfAbsent("run_id", () => runList[index].id.toString());

    final response = await http
        .post('https://data4halp.herokuapp.com/runs/join', body: body);
    print(response.body);
    print(json.decode(response.body)['message']);
    setState(() {
      Scaffold.of(context).showSnackBar(new SnackBar(
          content: new Text(json.decode(response.body)['message'])));
    });
  }

  _retriveRuns() async{
    final response = await http
        .get('https://data4halp.herokuapp.com/runs?auth_token=${widget.authtoken}');
    runList.clear();

    if(response.statusCode == 200){
      print(response.body);
      try {
        json.decode(response.body)["runs"].forEach((elem) {
          runList.add(Run.fromJson(elem));
        });
        setState(() {
          runList.removeWhere((run) => run.status!="RUN_ENDED");
        });
      }catch(error){
        print(error);
        Scaffold.of(context).showSnackBar(new SnackBar(
            content: new Text("Connection error!")));
      }
    }else{
      Scaffold.of(context).showSnackBar(new SnackBar(
          content: new Text(json.decode(response.body)['message'])));
    }
  }

  _watchRun(int index) {
    Navigator.push(
        context, MaterialPageRoute(builder: (context) => WatchRun(widget.authtoken, index)));
  }
}














