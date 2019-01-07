import 'package:data4help/model/Run.dart';
import 'package:data4help/presenter/RunOrganizerPresenter.dart';
import 'package:data4help/view/track4run/CreateNewRun.dart';
import 'package:flutter/material.dart';

class DashboardRunOrganizer extends StatelessWidget {
  final GlobalKey<_MyHomePageState> _MyHomePageStateKey =
      new GlobalKey<_MyHomePageState>();

  DashboardRunOrganizer();

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return new Scaffold(
      appBar: new AppBar(
        title: new Text('Data4Help - Dashboard'),
        actions: <Widget>[
          new IconButton(
              icon: new Icon(Icons.refresh),
              onPressed: () => _MyHomePageStateKey.currentState.refresh())
        ],
      ),
      body: new Container(
        child: MyHomePage(title: 'Data4Help - Dashboard', key: _MyHomePageStateKey,),
      ),
      floatingActionButton: new FloatingActionButton(
        onPressed: () =>_MyHomePageStateKey.currentState.addNewRun(),
        child: new Icon(Icons.add),
      ),
    );
  }
}

class MyHomePage extends StatefulWidget {
  MyHomePage({Key key, this.title}) : super(key: key);

  final String title;

  @override
  _MyHomePageState createState() => new _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  List<Run> _runList = [];

  @override
  void initState() {
    refresh();
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: <Widget>[
        new Text("Your runs:"),
        Expanded(
          child: ListView.builder(
            itemCount: _runList.length,
            itemBuilder: (context, index) {
              return ListTile(
                title: Text(
                    '${_runList[index].id} - ${_runList[index].description} - ${_runList[index].status.replaceAll("_", " ").toLowerCase()}'),
              );
            },
          ),
        ),
      ],
    );
  }



  void refresh() {
    RunOrganizerPresenter.getActivePresenter().retriveRunOrganizersRun().then((data) {
      setState(() {
        _runList = data;
      });
    }).catchError((error) {
      Scaffold.of(context).showSnackBar(new SnackBar(content: new Text("$error")));
    });
  }

  void addNewRun() {
    Navigator.push(
        context, MaterialPageRoute(builder: (context) => CreateNewRun()));
  }
}
