import 'dart:convert';

import 'package:charts_flutter/flutter.dart' as charts;
import 'package:data4help/data4help/UserData.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:intl/intl.dart';

class DashboardDetailsPage extends StatefulWidget {
  final String authtoken;

  DashboardDetailsPage(this.authtoken, {Key key, this.title}) : super(key: key);
  final String title;

  @override
  _DashboardDetailsPageState createState() => new _DashboardDetailsPageState();
}

class _DashboardDetailsPageState extends State<DashboardDetailsPage> {
  String _datetimeToLoad = new DateFormat("yyyy-MM-dd").format(DateTime.now());
  UserData _userData;

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: new Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            new Card(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: <Widget>[
                  Text("Shown data:"),
                  new Row(
                    mainAxisSize: MainAxisSize.max,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: <Widget>[
                      new Text(_datetimeToLoad),
                      new IconButton(
                          icon: new Icon(Icons.calendar_today),
                          onPressed: () {
                            _chooseDate(context, _datetimeToLoad);
                          }),
                      new MaterialButton(
                        onPressed: _loadDataOfDatetime,
                        child: new Text("LOAD"),
                      )
                    ],
                  )
                ],
              ),
            ),
            new Card(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: <Widget>[
                  const ListTile(
                    leading: Icon(Icons.border_color),
                    title: Text('Heart Rate'),
                  ),
                  new LimitedBox(
                      maxWidth: 250.0,
                      maxHeight: 250.0,
                      child: new charts.TimeSeriesChart(
                        _loadHeartrateData(),
                      )),
                ],
              ),
            ),
            new Card(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: <Widget>[
                  const ListTile(
                    leading: Icon(Icons.border_color),
                    title: Text('GPS coordinates'),
                  ),
                  new LimitedBox(
                      maxWidth: 250.0,
                      maxHeight: 250.0,
                      child: new charts.TimeSeriesChart(
                        _loadGPSData(),
                      )),
                ],
              ),
            ),
            new Card(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: <Widget>[
                  const ListTile(
                    leading: Icon(Icons.border_color),
                    title: Text('Accelerometer'),
                  ),
                  new LimitedBox(
                      maxWidth: 250.0,
                      maxHeight: 250.0,
                      child: new charts.TimeSeriesChart(
                        _loadAccelerometerData(),
                      )),
                ],
              ),
            ),
          ]),
    );
  }

  List<charts.Series<Heartrate, DateTime>> _loadHeartrateData() {
    final List<Heartrate> data = _userData == null ? [] : _userData.heartRate;

    return [
      new charts.Series<Heartrate, DateTime>(
        id: 'Heart Rate',
        colorFn: (_, __) => charts.MaterialPalette.blue.shadeDefault,
        domainFn: (Heartrate hr, _) => hr.timestamp,
        measureFn: (Heartrate hr, _) => hr.hr,
        data: data,
      )
    ];
  }

  List<charts.Series<Accelerometer, DateTime>> _loadAccelerometerData() {
    final List<Accelerometer> data =
        _userData == null ? [] : _userData.accelerometer;

    return [
      new charts.Series<Accelerometer, DateTime>(
        id: 'X',
        colorFn: (_, __) => charts.MaterialPalette.blue.shadeDefault,
        domainFn: (Accelerometer hr, _) => hr.timestamp,
        measureFn: (Accelerometer hr, _) => hr.x,
        data: data,
      ),
      new charts.Series<Accelerometer, DateTime>(
        id: 'Y',
        colorFn: (_, __) => charts.MaterialPalette.red.shadeDefault,
        domainFn: (Accelerometer hr, _) => hr.timestamp,
        measureFn: (Accelerometer hr, _) => hr.y,
        data: data,
      ),
      new charts.Series<Accelerometer, DateTime>(
        id: 'Z',
        colorFn: (_, __) => charts.MaterialPalette.green.shadeDefault,
        domainFn: (Accelerometer hr, _) => hr.timestamp,
        measureFn: (Accelerometer hr, _) => hr.z,
        data: data,
      ),
    ];
  }

  List<charts.Series<GpsCoordinate, DateTime>> _loadGPSData() {
    final List<GpsCoordinate> data =
        _userData == null ? [] : _userData.gpsCoordinates;

    return [
      new charts.Series<GpsCoordinate, DateTime>(
        id: 'LAT',
        colorFn: (_, __) => charts.MaterialPalette.blue.shadeDefault,
        domainFn: (GpsCoordinate hr, _) => hr.timestamp,
        measureFn: (GpsCoordinate hr, _) => hr.lat,
        data: data,
      ),
      new charts.Series<GpsCoordinate, DateTime>(
        id: 'LONG',
        colorFn: (_, __) => charts.MaterialPalette.red.shadeDefault,
        domainFn: (GpsCoordinate hr, _) => hr.timestamp,
        measureFn: (GpsCoordinate hr, _) => hr.long,
        data: data,
      ),
    ];
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

  void _loadDataOfDatetime() async {
    final response = await http.get(
        'https://data4halp.herokuapp.com/indiv/data?auth_token=${widget.authtoken}&begin_date=$_datetimeToLoad&end_date=${_datetimeToLoad + "T23:59:59Z"}');
    print(response.body);
    setState(() {
      _userData = UserData.fromJson(json.decode(response.body)["data"]);
    });
  }
}
