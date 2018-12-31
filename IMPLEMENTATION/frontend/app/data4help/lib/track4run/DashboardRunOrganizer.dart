import 'package:data4help/data4help/dashboard/DashboardDetailPage.dart';
import 'package:data4help/data4help/dashboard/DashboardMainPage.dart';
import 'package:data4help/data4help/dashboard/DashboardTestPage.dart';
import 'package:flutter/material.dart';

class DashboardRunOrganizer extends StatelessWidget {
  final String authtoken;

  DashboardRunOrganizer(this.authtoken);

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
  DashboardMainPage _dashboardMainPage = new DashboardMainPage();
  int _selectedItem = 0;

  @override
  Widget build(BuildContext context) {
    return new Scaffold(
      appBar: new AppBar(
        title: new Text(widget.title),
      ),
      body: new Container(
        child: _getActualWidget(),
      ),
    );
  }

  Widget _getActualWidget() {

    return new Text("WTF");
  }
}
