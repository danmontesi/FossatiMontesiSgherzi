import 'package:data4help/presenter/UserPresenter.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class DashboardTestPage extends StatefulWidget {
  DashboardTestPage({Key key, this.title}) : super(key: key);
  final String title;

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
                    new IconButton(
                        icon: new Icon(Icons.calendar_today),
                        onPressed: () {
                          _chooseDate(context, _datetimeToLoad);
                        }),
                    new MaterialButton(
                      onPressed: () => _sendDataToServer(),
                      child: new Text("GENERATE DATA"),
                    )
                  ],
                )
              ],
            ),
          ),
        ]);
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

  _sendDataToServer() {
    UserPresenter.getActivePresenter().sendDummyUserDataToServer(convertToDate(_datetimeToLoad)).then((data){
      Scaffold.of(context).showSnackBar(new SnackBar(content: new Text("$data")));
    }).catchError((error) {
      Scaffold.of(context).showSnackBar(new SnackBar(content: new Text("$error")));
    });
  }
}
