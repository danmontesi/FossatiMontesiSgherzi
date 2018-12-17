import 'package:flutter/material.dart';

class Track4RunLogin extends StatelessWidget {
  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Data4Help',

      home: Track4RunLoginPage(title: 'Data4Help Login'),
    );
  }
}

class Track4RunLoginPage extends StatefulWidget {
  Track4RunLoginPage({Key key, this.title}) : super(key: key);

  final String title;

  @override
  _Track4RunLoginPageState createState() => _Track4RunLoginPageState();
}

class _Track4RunLoginPageState extends State<Track4RunLoginPage> {
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
              'TODO',
            ),
          ],
        ),
      ),
    );
  }
}
