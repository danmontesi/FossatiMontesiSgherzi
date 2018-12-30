import 'dart:convert';
import 'dart:math';

import 'package:charts_flutter/flutter.dart' as charts;
import 'package:data4help/data4help/UserData.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:intl/intl.dart';

class DashboardTestPage extends StatefulWidget {
  DashboardTestPage(this.authtoken, {Key key, this.title}) : super(key: key);
  final String title, authtoken;

  @override
  _DashboardTestPageState createState() => new _DashboardTestPageState();
}

class _DashboardTestPageState extends State<DashboardTestPage> {
  String _datetimeToLoad = new DateFormat("yyyy-MM-dd").format(DateTime.now());
  @override
  Widget build(BuildContext context) {
    return new Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          new Card(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: <Widget>[
                Text("Day to generate:"),
                new Row(
                  mainAxisSize: MainAxisSize.max,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: <Widget>[
                    new Text(_datetimeToLoad),
                    new IconButton(icon: new Icon(Icons.calendar_today), onPressed: () {_chooseDate(context, _datetimeToLoad);}),
                    new MaterialButton(onPressed: () =>_sendDataToServer(context), child: new Text("GENERATE DATA"),)
                  ],
                )
              ],
            ),
          ),
        ]);
  }





  void _sendDataToServer(BuildContext context) async {
    Map<String, String> body = new Map<String, String>();
    body.putIfAbsent("auth_token", () => widget.authtoken);
    print(widget.authtoken);
    String data = UserData.generateSampleData(convertToDate(_datetimeToLoad)).toJson();
    print(data);
    body.putIfAbsent("data", () => data);



    final response = await http.post(
        'https://data4halp.herokuapp.com/indiv/data',
        body: body);
    print(response.body);
    print( json.decode(response.body)['message']);
    setState(() {
      Scaffold.of(context).showSnackBar(new SnackBar(content: new Text(json.decode(response.body)['message'])));
    });
  }



  Future _chooseDate(BuildContext context, String initialDateString) async {
    var now = new DateTime.now();
    var initialDate = convertToDate(initialDateString) ?? now;
    initialDate = (initialDate.year >= 1900 && initialDate.isBefore(now)
        ? initialDate
        : now);

    var result = await showDatePicker(
        context: context,
        initialDate: initialDate,
        firstDate: new DateTime(1900),
        lastDate: new DateTime.now());

    if (result == null) return;

    setState(() {
      _datetimeToLoad = new DateFormat("yyyy-MM-dd").format(result);
    });
  }

  DateTime convertToDate(String input) {
    try {
      var d = new DateFormat("yyyy-MM-dd").parseStrict(input);
      return d;
    } catch (e) {
      return null;
    }
  }



}















