import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class DashboardPendingQueriesRequestsPage extends StatefulWidget {
  DashboardPendingQueriesRequestsPage(this.authtoken, {Key key, this.title})
      : super(key: key);
  final String title, authtoken;

  @override
  _DashboardPendingQueriesRequestsPageState createState() =>
      new _DashboardPendingQueriesRequestsPageState();
}

class _DashboardPendingQueriesRequestsPageState
    extends State<DashboardPendingQueriesRequestsPage> {
  List<PendingQueryRequest> queryList = [];

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
                      onPressed: () => _respondToQuery(index, true),
                      child: new Text("ACCEPT"),
                    ),
                    new MaterialButton(
                      onPressed: () => _respondToQuery(index, false),
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

  _respondToQuery(int index, bool accept) async {
    Map<String, String> body = new Map<String, String>();
    body.putIfAbsent("auth_token", () => widget.authtoken);
    body.putIfAbsent("query_id", () => queryList[index].queryId.toString());
    body.putIfAbsent("decision", () => accept.toString());

    final response = await http.post(
        'https://data4halp.herokuapp.com/queries/query/individual/pending',
        body: body);
    print(response.body);

    setState(() {
      Scaffold.of(context).showSnackBar(new SnackBar(
          content: new Text(
              json.decode(response.body)['message'] ?? "Connection error!")));
    });
    _retriveQueries();
  }

  _retriveQueries() async {
    final response = await http.get(
        'https://data4halp.herokuapp.com/queries/query/individual/pending?auth_token=${widget.authtoken}');
    queryList.clear();

    if (response.statusCode == 200) {
      print(response.body);
      try {
        json.decode(response.body)["queries"].forEach((elem) {
          queryList.add(PendingQueryRequest.fromJson(elem));
        });
        setState(() {});
      } catch (error) {
        print(error);
        Scaffold.of(context)
            .showSnackBar(new SnackBar(content: new Text("Connection error!")));
      }
    } else {
      Scaffold.of(context).showSnackBar(new SnackBar(
          content: new Text(json.decode(response.body)['message'])));
    }
  }
}

class PendingQueryRequest {
  final int queryId;

  PendingQueryRequest(this.queryId);

  PendingQueryRequest.fromJson(Map<String, dynamic> json)
      : queryId = json["id"];
}
