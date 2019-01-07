import 'dart:math';

import 'package:charts_flutter/flutter.dart' as charts;
import 'package:flutter/material.dart';

class DashboardMainPage extends StatefulWidget {
  DashboardMainPage({Key key, this.title}) : super(key: key);
  final String title;

  @override
  _DashboardMainPageState createState() => new _DashboardMainPageState();
}

class _DashboardMainPageState extends State<DashboardMainPage> {
  @override
  Widget build(BuildContext context) {
    return new Column(
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
                        defaultRenderer: new charts.ArcRendererConfig(
                          arcWidth: 50,
                          arcRendererDecorators: [
                            new charts.ArcLabelDecorator()
                          ],
                          startAngle: 4 / 5 * pi,
                          arcLength: 7 / 5 * pi,
                        ))),
                ButtonTheme.bar(
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
                        defaultRenderer: new charts.ArcRendererConfig(
                          arcWidth: 50,
                          arcRendererDecorators: [
                            new charts.ArcLabelDecorator()
                          ],
                          startAngle: 4 / 5 * pi,
                          arcLength: 7 / 5 * pi,
                        ))),
                ButtonTheme.bar(
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
        ]);
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
