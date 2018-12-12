import 'dart:math';

import 'package:charts_flutter/flutter.dart' as charts;
import 'package:flutter/material.dart';

class Dashboard extends StatelessWidget {
  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return new MaterialApp(
      title: 'Data4Help',
      theme: new ThemeData(
        // This is the theme of your application.
        //
        // Try running your application with "flutter run". You'll see the
        // application has a blue toolbar. Then, without quitting the app, try
        // changing the primarySwatch below to Colors.green and then invoke
        // "hot reload" (press "r" in the console where you ran "flutter run",
        // or press Run > Flutter Hot Reload in IntelliJ). Notice that the
        // counter didn't reset back to zero; the application is not restarted.
        primarySwatch: Colors.green,
      ),
      home: new MyHomePage(title: 'Data4Help - Dashboard'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  MyHomePage({Key key, this.title}) : super(key: key);

  // This widget is the home page of your application. It is stateful, meaning
  // that it has a State object (defined below) that contains fields that affect
  // how it looks.

  // This class is the configuration for the state. It holds the values (in this
  // case the title) provided by the parent (in this case the App widget) and
  // used by the build method of the State. Fields in a Widget subclass are
  // always marked "final".

  final String title;

  @override
  _MyHomePageState createState() => new _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  @override
  Widget build(BuildContext context) {
    // This method is rerun every time setState is called, for instance as done
    // by the _incrementCounter method above.
    //
    // The Flutter framework has been optimized to make rerunning build methods
    // fast, so that you can just rebuild anything that needs updating rather
    // than having to individually change instances of widgets.
    return new Scaffold(
      appBar: new AppBar(
        // Here we take the value from the MyHomePage object that was created by
        // the App.build method, and use it to set our appbar title.
        title: new Text(widget.title),
      ),

      drawer: Drawer(
        // Add a ListView to the drawer. This ensures the user can scroll
        // through the options in the Drawer if there isn't enough vertical
        // space to fit everything.
        child: ListView(
          // Important: Remove any padding from the ListView.
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
                // Update the state of the app
                // ...
              },
            ),
            ListTile(
              title: Text('Activities details'),
              onTap: () {
                // Update the state of the app
                // ...
              },
            ),
            ListTile(
              title: Text('AutomatedSOS'),
              onTap: () {
                // Update the state of the app
                // ...
              },
            ),
            ListTile(
              title: Text('Track4Run'),
              onTap: () {
                // Update the state of the app
                // ...
              },
            ),
          ],
        ),
      ),

      body: new Container(
          child: new SingleChildScrollView(
              child: new Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
            new Card(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: <Widget>[
                  const ListTile(
                    leading: Icon(Icons.directions_run),
                    title: Text('Today activity'),
                  ),
                  new LimitedBox(
                      maxWidth: 250.0,
                      maxHeight: 250.0,
                      child: new charts.PieChart(_createSampleData(),
                          // Configure the width of the pie slices to 30px. The remaining space in
                          // the chart will be left as a hole in the center. Adjust the start
                          // angle and the arc length of the pie so it resembles a gauge.
                          defaultRenderer: new charts.ArcRendererConfig(
                            arcWidth: 50,
                            arcRendererDecorators: [
                              new charts.ArcLabelDecorator()
                            ],
                            startAngle: 4 / 5 * pi,
                            arcLength: 7 / 5 * pi,
                          ))),
                  ButtonTheme.bar(
                    // make buttons use the appropriate styles for cards
                    child: ButtonBar(
                      children: <Widget>[
                        FlatButton(
                          child: const Text('DETAILS'),
                          onPressed: () {},
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            new Card(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: <Widget>[
                  const ListTile(
                    leading: Icon(Icons.alarm),
                    title: Text('Sleep info'),
                  ),
                  new LimitedBox(
                      maxWidth: 250.0,
                      maxHeight: 250.0,
                      child: new charts.PieChart(_createSampleSleepData(),
                          // Configure the width of the pie slices to 30px. The remaining space in
                          // the chart will be left as a hole in the center. Adjust the start
                          // angle and the arc length of the pie so it resembles a gauge.
                          defaultRenderer: new charts.ArcRendererConfig(
                            arcWidth: 50,
                            arcRendererDecorators: [
                              new charts.ArcLabelDecorator()
                            ],
                            startAngle: 4 / 5 * pi,
                            arcLength: 7 / 5 * pi,
                          ))),
                  ButtonTheme.bar(
                    // make buttons use the appropriate styles for cards
                    child: ButtonBar(
                      children: <Widget>[
                        FlatButton(
                          child: const Text('DETAILS'),
                          onPressed: () {},
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ]))),

      // This trailing comma makes auto-formatting nicer for build methods.
    );
  }

  /// Create one series with sample hard coded data.
  static List<charts.Series<GaugeSegment, String>> _createSampleData() {
    final data = [
      new GaugeSegment('Walking', 75, Colors.green.shade100),
      new GaugeSegment('Running', 10, Colors.green.shade200),
      new GaugeSegment('Riding bike', 20, Colors.green.shade300),
      //new GaugeSegment('', 5, Colors.green.shade400),
    ];

    return [
      new charts.Series<GaugeSegment, String>(
        id: 'Segments',
        domainFn: (GaugeSegment segment, _) => segment.segment,
        measureFn: (GaugeSegment segment, _) => segment.size,
        colorFn: (GaugeSegment segment, _) => segment.color,
        data: data,
      )
    ];
  }

  static List<charts.Series<GaugeSegment, String>> _createSampleSleepData() {
    final data = [
      new GaugeSegment('REM sleep', 35, Colors.blue.shade400),
      new GaugeSegment('Light sleep', 10, Colors.blue.shade500),
      new GaugeSegment('Deep sleep', 75, Colors.blue.shade600),
      //new GaugeSegment('', 5, Colors.green.shade400),
    ];

    return [
      new charts.Series<GaugeSegment, String>(
        id: 'Segments',
        domainFn: (GaugeSegment segment, _) => segment.segment,
        measureFn: (GaugeSegment segment, _) => segment.size,
        colorFn: (GaugeSegment segment, _) => segment.color,
        data: data,
      )
    ];
  }
}

/// Sample data type.
class GaugeSegment {
  final String segment;
  final int size;
  final charts.Color color;

  GaugeSegment(this.segment, this.size, Color color)
      : this.color = new charts.Color(
            r: color.red, g: color.green, b: color.blue, a: color.alpha);
}
