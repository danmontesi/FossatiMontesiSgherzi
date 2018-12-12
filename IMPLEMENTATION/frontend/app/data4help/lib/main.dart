import 'package:data4help/data4help/CheckSmartwatch.dart';
import 'package:data4help/data4help/Data4HelpLogin.dart';
import 'package:data4help/track4run/track4RunLogin.dart';
import 'package:flutter/material.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Data4Help',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: MyHomePage(title: 'Data4Help'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  MyHomePage({Key key, this.title}) : super(key: key);

  final String title;

  @override
  _MyHomePageState createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
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
              'Select the service you want to access: ',
            ),
            new MaterialButton(onPressed: (){Navigator.push(context, MaterialPageRoute(builder: (context) => CheckSmartwatch()));}, child: new Text("Data4Help"),),
            new MaterialButton(onPressed: (){Navigator.push(context, MaterialPageRoute(builder: (context) => Track4RunLogin()));}, child: new Text("Track4Run"),),
          ],
        ),
      ),
    );
  }
}
