import 'package:data4help/model/Run.dart';
import 'package:data4help/presenter/RunOrganizerPresenter.dart';
import 'package:data4help/view/track4run/CreateNewRun.dart';
import 'package:flutter/material.dart';

class DashboardRunOrganizer extends StatelessWidget {
  GlobalKey<_DashBoardPageState> _DashBoardPageStateKey =
      new GlobalKey<_DashBoardPageState>();

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
              onPressed: () => _DashBoardPageStateKey.currentState.refresh())
        ],
      ),
      body: new Container(
        child: DashBoardPage(title: 'Data4Help - Dashboard', key: _DashBoardPageStateKey,),
      ),
      floatingActionButton: new FloatingActionButton(
        onPressed: () =>_DashBoardPageStateKey.currentState.addNewRun(),
        child: new Icon(Icons.add),
      ),
    );
  }
}

class DashBoardPage extends StatefulWidget {
  DashBoardPage({Key key, this.title}) : super(key: key);

  final String title;

  @override
  _DashBoardPageState createState() => new _DashBoardPageState();
}

class _DashBoardPageState extends State<DashBoardPage> {
  List<Run> _runList = [];

  @override
  void initState() {
    super.initState();

    //refresh();
  }



  @override
  Widget build(BuildContext context) {
    return Column(
      children: <Widget>[
        new Text("Your runs:"),
        Expanded(
          child: ListView.separated(
            separatorBuilder: (context, index) {
              return Divider();
            },
            itemCount: _runList.length,
            itemBuilder: (context, index) {
              return ListTile(
                title: Text(
                    'Run ${_runList[index].id} - ${_runList[index].description} - ${_runList[index].status.replaceAll("_", " ").toLowerCase()}'),
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
      print("Error: $error");
      Scaffold.of(context).showSnackBar(new SnackBar(content: new Text("$error")));
    });
  }

  void addNewRun() {
    Navigator.push(
        context, MaterialPageRoute(builder: (context) => CreateNewRun()));
  }
}
