import 'dart:convert';

import 'package:data4help/model/PendingQueryRequest.dart';
import 'package:data4help/presenter/UserPresenter.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class DashboardPendingQueriesRequestsPage extends StatefulWidget {
  DashboardPendingQueriesRequestsPage({Key key, this.title})
      : super(key: key);
  final String title;

  @override
  _DashboardPendingQueriesRequestsPageState createState() =>
      new _DashboardPendingQueriesRequestsPageState();
}

class _DashboardPendingQueriesRequestsPageState
    extends State<DashboardPendingQueriesRequestsPage> {
  List<PendingQueryRequest> queryList = [];


  @override
  void initState() {
    _retriveQueries();
    super.initState();
  }
  @override
  Widget build(BuildContext context) {
    return new Column(
      mainAxisSize: MainAxisSize.max,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: <Widget>[
        new Text("Pending requests:"),
        new MaterialButton(
          onPressed: _retriveQueries,
          child: new Icon(Icons.refresh),
        ),
        Expanded(
          child: ListView.builder(
            itemCount: queryList.length,
            itemBuilder: (context, index) {
              return ListTile(
                title: Text(
                    '${queryList[index].queryId} - ${queryList[index].queryId}'),
                trailing: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: <Widget>[
                    new MaterialButton(
                      onPressed: () => _respondToQuery(queryList[index].queryId, true),
                      child: new Text("ACCEPT"),
                    ),
                    new MaterialButton(
                      onPressed: () => _respondToQuery(queryList[index].queryId, false),
                      child: new Text("DENY"),
                    ),
                  ],
                ),
              );
            },
          ),
        ),
      ],
    );
  }





  void _retriveQueries() {
    UserPresenter.getActivePresenter().retrivePendingQueries().then((data){
      setState(() {
        queryList=data;
      });

    }).catchError((error) {
      Scaffold.of(context).showSnackBar(new SnackBar(content: new Text("$error")));
    });
  }

  _respondToQuery(int queryId, bool accept) {
    UserPresenter.getActivePresenter().respondToPendingQuery(queryId, accept).then((data){
      Scaffold.of(context).showSnackBar(new SnackBar(content: new Text("$data")));
    }).catchError((error) {
      Scaffold.of(context).showSnackBar(new SnackBar(content: new Text("$error")));
    }).whenComplete((){
      _retriveQueries();
    });
  }
}


