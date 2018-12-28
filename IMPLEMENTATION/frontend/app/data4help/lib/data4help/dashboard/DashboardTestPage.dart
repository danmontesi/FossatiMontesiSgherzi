import 'dart:convert';
import 'dart:math';

import 'package:charts_flutter/flutter.dart' as charts;
import 'package:data4help/data4help/UserData.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class DashboardTestPage extends StatefulWidget {
  DashboardTestPage(this.authtoken, {Key key, this.title}) : super(key: key);
  final String title, authtoken;

  @override
  _DashboardTestPageState createState() => new _DashboardTestPageState();
}

class _DashboardTestPageState extends State<DashboardTestPage> {
  @override
  Widget build(BuildContext context) {
    return new Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          new MaterialButton(onPressed: _sendDataToServer, child: new Text("Prova a generare dati..."),)
        ]);
  }





  void _sendDataToServer() async {
    Map<String, String> body = new Map<String, String>();
    body.putIfAbsent("auth_token", () => widget.authtoken);
    print(widget.authtoken);
    String data = UserData.generateSampleData().toJson();
    print(data);
    body.putIfAbsent("data", () => data);



    final response = await http.post(
        'https://data4halp.herokuapp.com/indiv/data',
        body: body);
    print(response.body);
    print( json.decode(response.body)['message']);
  }
}















