import 'dart:async';

import 'package:data4help/data4help/Data4HelpLogin.dart';
import 'package:flutter/material.dart';

class CheckSmartwatch extends StatelessWidget {
  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Data4Help',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: CheckSmartwatchPage(title: 'Data4Help'),
    );
  }
}

class CheckSmartwatchPage extends StatefulWidget {
  CheckSmartwatchPage({Key key, this.title}) : super(key: key);

  final String title;

  @override
  _CheckSmartwatchPageState createState() => _CheckSmartwatchPageState();
}

class _CheckSmartwatchPageState extends State<CheckSmartwatchPage> {

  _CheckSmartwatchPageState() {
    new Timer(const Duration(milliseconds: 5000), ()
    {
      Navigator.pop(context);
      Navigator.push(context, MaterialPageRoute(builder: (context) => Data4HelpLogin()));
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Text(
              'Checking smartwatch connection...',
            ),
            new CircularProgressIndicator(),
          ],
        ),
      ),
    );
  }
}
