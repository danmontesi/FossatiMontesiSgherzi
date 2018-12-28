import 'dart:math';

import 'package:charts_flutter/flutter.dart' as charts;
import 'package:data4help/data4help/UserData.dart';
import 'package:flutter/material.dart';

class DashboardTestPage extends StatefulWidget {
  DashboardTestPage({Key key, this.title}) : super(key: key);
  final String title;

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
          new MaterialButton(onPressed: _generateData, child: new Text("Prova a generare dati..."),)
        ]);
  }



  void _generateData() {

    final List<GpsCoordinate> gpsCoordinates = new List();
    final List<Accelerometer> accelerometer = new List();
    final List<Heartrate> heartRate = new List();


    DateTime now = new DateTime.now();
    for(int i=0; i<6*24; i++){
      gpsCoordinates.add(new GpsCoordinate(Random.secure().nextDouble(), Random.secure().nextDouble(), now));
      accelerometer.add(new Accelerometer(Random.secure().nextDouble(), Random.secure().nextDouble(), Random.secure().nextDouble(), now));
      heartRate.add(new Heartrate(Random.secure().nextInt(20)-10 + 60 , now));
      now= now.add(new Duration(minutes: 10));
    }

    UserData userdata = new UserData(gpsCoordinates, accelerometer, heartRate);
  }
}















