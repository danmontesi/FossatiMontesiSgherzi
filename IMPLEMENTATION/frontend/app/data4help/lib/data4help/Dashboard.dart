import 'package:data4help/data4help/dashboard/DashboardDetailPage.dart';
import 'package:data4help/data4help/dashboard/DashboardMainPage.dart';
import 'package:data4help/data4help/dashboard/DashboardRunRegistrationPage.dart';
import 'package:data4help/data4help/dashboard/DashboardTestPage.dart';
import 'package:flutter/material.dart';

class Dashboard extends StatelessWidget {
  final String authtoken;

  Dashboard(this.authtoken);

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
      drawer: Drawer(
        child: ListView(
          padding: EdgeInsets.zero,
          children: <Widget>[
            DrawerHeader(
              child: new Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    Text('Welcom back, TestUser!'),
                    IconButton(
                      icon: Icon(Icons.account_circle),
                      color: Colors.green.shade900,
                      iconSize: 60.0,
                      onPressed: () {},
                    )
                  ]),
              decoration: BoxDecoration(
                color: Colors.green,
              ),
            ),
            ListTile(
              title: Text('Dashboard'),
              onTap: () {
                setState(() {
                  _selectedItem = 0;
                  Navigator.pop(context);
                });
              },
            ),
            ListTile(
              title: Text('Activities details'),
              onTap: () {
                setState(() {
                  _selectedItem = 1;
                  Navigator.pop(context);
                });
              },
            ),
            ListTile(
              title: Text('AutomatedSOS'),
              onTap: () {
                setState(() {
                  _selectedItem = 2;
                  Navigator.pop(context);
                });
              },
            ),
            ListTile(
              title: Text('Track4Run'),
              onTap: () {
                setState(() {
                  _selectedItem = 3;
                  Navigator.pop(context);
                });
              },
            ),
            ListTile(
              title: Text('Testing'),
              onTap: () {
                setState(() {
                  _selectedItem = 4;
                  Navigator.pop(context);
                });
              },
            ),
          ],
        ),
      ),
      body: new Container(
        child: _getActualWidget(),
      ),
    );
  }

  Widget _getActualWidget() {
    switch (_selectedItem) {
      case 0:
        return  new SingleChildScrollView(
          child: _dashboardMainPage,
        );
      case 1:
        return new DashboardDetailsPage(widget.authtoken);
      case 2:
        return new Center(
          child: Text("Function not implemented yet."),
        );
      case 3:
        return new DashboardRunRegistrationPage(widget.authtoken);
      case 4:
        return new DashboardTestPage(widget.authtoken);
    }
    return new Text("WTF");
  }
}
