import 'dart:convert';

import 'package:data4help/track4run/CreateNewRunPoint.dart';
import 'package:data4help/track4run/RunPoint.dart';
import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:http/http.dart' as http;
import 'package:intl/intl.dart';

class CreateNewRun extends StatelessWidget {
  final String authtoken;

  CreateNewRun(this.authtoken);

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MyHomePage(authtoken, title: 'Data4Help - Dashboard');
  }
}

class MyHomePage extends StatefulWidget {
  final String authtoken;

  MyHomePage(this.authtoken, {Key key, this.title}) : super(key: key);

  final String title;

  @override
  _MyHomePageState createState() => new _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  GlobalKey<ScaffoldState> _scaffoldState =
  new GlobalKey<ScaffoldState>();
  final TextEditingController _startDateFilter = new TextEditingController();
  final TextEditingController _endDateFilter = new TextEditingController();
  final TextEditingController _startTimeFilter = new TextEditingController();
  final TextEditingController _endTimeFilter = new TextEditingController();
  final TextEditingController _descriptionFilter = new TextEditingController();

  GoogleMapController _controller;
  List<RunPoint> runPoints = new List();

  @override
  Widget build(BuildContext context) {
    return new Scaffold(
      key: _scaffoldState,
      appBar: new AppBar(
        title: new Text(widget.title),
        actions: <Widget>[
          new IconButton(
              icon: new Icon(Icons.save), onPressed: _sendRunToServer)
        ],
      ),
      body: new Container(
        child: _getActualWidget(),
      ),
      floatingActionButton: new FloatingActionButton(
        onPressed: _addPointOnMap,
        child: new Icon(Icons.add),
      ),
    );
  }

  Widget _getActualWidget() {
    return Column(
      children: <Widget>[
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 8.0),
          child: Column(
            children: <Widget>[
              new Container(
                child: Row(
                  children: <Widget>[
                    Expanded(
                      child: new TextFormField(
                        decoration: const InputDecoration(
                          hintText: 'Enter the start date',
                          labelText: 'Start date',
                        ),
                        enabled: false,
                        controller: _startDateFilter,
                        keyboardType: TextInputType.datetime,
                      ),
                    ),
                    new IconButton(
                        icon: new Icon(Icons.calendar_today),
                        onPressed: () =>
                            _chooseDate(context, _startDateFilter)),
                  ],
                ),
              ),
              new Container(
                child: Row(
                  children: <Widget>[
                    Expanded(
                      child: new TextFormField(
                        decoration: const InputDecoration(
                          hintText: 'Enter the start time',
                          labelText: 'Time start',
                        ),
                        enabled: false,
                        controller: _startTimeFilter,
                        keyboardType: TextInputType.datetime,
                      ),
                    ),
                    new IconButton(
                        icon: new Icon(Icons.watch_later),
                        onPressed: () =>
                            _chooseTime(context, _startTimeFilter)),
                  ],
                ),
              ),
              new Container(
                child: Row(
                  children: <Widget>[
                    Expanded(
                      child: new TextFormField(
                        decoration: const InputDecoration(
                          hintText: 'Enter the end date',
                          labelText: 'End date',
                        ),
                        enabled: false,
                        controller: _endDateFilter,
                        keyboardType: TextInputType.datetime,
                      ),
                    ),
                    new IconButton(
                        icon: new Icon(Icons.calendar_today),
                        onPressed: () => _chooseDate(context, _endDateFilter)),
                  ],
                ),
              ),
              new Container(
                child: Row(
                  children: <Widget>[
                    Expanded(
                      child: new TextFormField(
                        decoration: const InputDecoration(
                          hintText: 'Enter the end time',
                          labelText: 'End time',
                        ),
                        enabled: false,
                        controller: _endTimeFilter,
                        keyboardType: TextInputType.datetime,
                      ),
                    ),
                    new IconButton(
                        icon: new Icon(Icons.watch_later),
                        onPressed: () => _chooseTime(context, _endTimeFilter)),
                  ],
                ),
              ),
              new TextFormField(
                decoration: const InputDecoration(
                  hintText: 'Description',
                  labelText: 'Description',
                ),
                enabled: true,
                controller: _descriptionFilter,
              )
            ],
          ),
        ),
        Expanded(
          child: GoogleMap(
            options: GoogleMapOptions(
              myLocationEnabled: true,
            ),
            onMapCreated: (GoogleMapController controller) {
              _controller = controller;
            },
          ),
        ),
      ],
    );
  }

  _chooseDate(BuildContext context, TextEditingController dateFilter) async {
    DateTime now = new DateTime.now();
    DateTime initialDate = convertToDate(dateFilter.text) ?? now;

    DateTime result = await showDatePicker(
        context: context,
        initialDate: initialDate,
        lastDate: new DateTime(2099),
        firstDate: initialDate);

    if (result == null) return;

    setState(() {
      dateFilter.text = new DateFormat("yyyy-MM-dd").format(result);
    });
  }

  _chooseTime(BuildContext context, TextEditingController hourFilter) async {
    TimeOfDay now = new TimeOfDay.now();
    TimeOfDay initialDate = convertToTime(hourFilter.text) ?? now;

    TimeOfDay result =
        await showTimePicker(context: context, initialTime: initialDate);

    if (result == null) return;

    setState(() {
      hourFilter.text = "${result.hour}:${result.minute}";
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

  TimeOfDay convertToTime(String input) {
    try {
      var d = new DateFormat("hh:mm").parseStrict(input);
      return TimeOfDay.fromDateTime(d);
    } catch (e) {
      return null;
    }
  }

  void _sendRunToServer() async {
    Map<String, String> head = new Map<String, String>();
    head.putIfAbsent("Content-Type", () => "application/json");
    DateTime begin, end;
    begin=convertToDate(_startDateFilter.text).add(new Duration(hours: convertToTime(_startTimeFilter.text).hour, minutes: convertToTime(_startTimeFilter.text).minute));
    end=convertToDate(_endDateFilter.text).add(new Duration(hours: convertToTime(_endTimeFilter.text).hour, minutes: convertToTime(_endTimeFilter.text).minute));


    String coordinatesList="";
    runPoints.forEach((p) {
      coordinatesList+=p.toJson();
      if(p!=runPoints.last){
        coordinatesList+=",";
      }
    });



    String jsonp = "{"
        "\"auth_token\": \"${widget.authtoken}\","
        "\"time_begin\": \"${begin.toIso8601String()}\","
        "\"time_end\": \"${end.toIso8601String()}\","
        "\"description\": \"${_descriptionFilter.text}\","
        "\"coordinates\":[$coordinatesList]"
        "}";

    print(jsonp);

    final response =
        await http.post('https://data4halp.herokuapp.com/runs/run', body: jsonp, headers: head);


    print(response.body);
    print(json.decode(response.body)['message']);
    if (response.statusCode != 200) {
      setState(() {
        Scaffold.of(_scaffoldState.currentContext).showSnackBar(new SnackBar(
            content: new Text(json.decode(response.body)['message'])));
      });
    }else{
      Navigator.pop(context);
    }
  }

  void _addPointOnMap() {
    Navigator.push(
        context,
        MaterialPageRoute(
            builder: (context) => (new CreateNewPoint(runPoints)))).then((obj) {
      if (obj != null) {
        runPoints.add(obj);
        _addMapsPoints();
      } else {
        print("User canceled selection!");
      }
    });
  }

  void _addMapsPoints() {
    _controller.clearMarkers();

    runPoints.forEach((point) {
      _controller.addMarker(
        new MarkerOptions(
          position: new LatLng(point.lat, point.long),
          infoWindowText: new InfoWindowText("Point", "Index: ${point.order}"),
        ),
      );
      if (point == runPoints.last) {
        _controller.animateCamera(
            CameraUpdate.newLatLngZoom(new LatLng(point.lat, point.long), 14));
      }
    });
  }
}
