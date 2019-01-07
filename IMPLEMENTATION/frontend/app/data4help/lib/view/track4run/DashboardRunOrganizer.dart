import 'package:data4help/view/track4run/CreateNewRun.dart';
import 'package:flutter/material.dart';

class DashboardRunOrganizer extends StatelessWidget {

  DashboardRunOrganizer();

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MyHomePage(title: 'Data4Help - Dashboard');
  }
}

class MyHomePage extends StatefulWidget {

  MyHomePage( {Key key, this.title}) : super(key: key);

  final String title;

  @override
  _MyHomePageState createState() => new _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
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
    return Column(children: <Widget>[
      MaterialButton(onPressed: _newRun, child: Text("NEW RUN"),),

    ],);
  }

  void _newRun() {
    Navigator.push(
        context, MaterialPageRoute(builder: (context) => CreateNewRun()));
  }
}
