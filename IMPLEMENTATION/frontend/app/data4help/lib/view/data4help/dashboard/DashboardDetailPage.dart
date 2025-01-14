import 'package:charts_flutter/flutter.dart' as charts;
import 'package:data4help/model/UserData.dart';
import 'package:data4help/presenter/UserPresenter.dart';
import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:intl/intl.dart';

class DashboardDetailsPage extends StatefulWidget {
  DashboardDetailsPage({Key key, this.title}) : super(key: key);
  final String title;

  @override
  _DashboardDetailsPageState createState() => new _DashboardDetailsPageState();
}

class _DashboardDetailsPageState extends State<DashboardDetailsPage> {
  String _datetimeToLoad = new DateFormat("yyyy-MM-dd").format(DateTime.now());
  UserData _userData;

  GoogleMapController _controller;

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
                  Container(
                    height: 250.0,
                    child: GoogleMap(
                      options: GoogleMapOptions(
                        myLocationEnabled: true,
                      ),
                      onMapCreated: (GoogleMapController controller) {
                        _controller = controller;
                        _loadDataOfDatetime();
                      },
                    ),
                  ),
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

  void _loadDataOfDatetime() {
    UserPresenter.getActivePresenter()
        .loadDataOfDatetime(_datetimeToLoad)
        .then((data) {
      setState(() {
        _userData = data;
      });
      if (_controller != null) {
        _controller.clearMarkers();

        _userData.gpsCoordinates.forEach((point) {
          _controller.addMarker(
            new MarkerOptions(
              position: new LatLng(point.lat, point.long),
              infoWindowText:
                  new InfoWindowText("Point", "Time: ${point.timestamp}"),
            ),
          );
          if (point == _userData.gpsCoordinates.last) {
            _controller.animateCamera(CameraUpdate.newLatLngZoom(
                new LatLng(point.lat, point.long), 14));
          }
        });
      }
    }).catchError((error) {
      Scaffold.of(context)
          .showSnackBar(new SnackBar(content: new Text("$error")));
    });
  }
}
