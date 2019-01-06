import 'package:data4help/track4run/RunPoint.dart';
import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:http/http.dart' as http;

class WatchRun extends StatelessWidget {
  final String authToken;
  final int runId;
  GlobalKey<_WatchRunPageState> _WatchRunPageStateKey =
      new GlobalKey<_WatchRunPageState>();

  WatchRun(
    this.authToken,
    this.runId, {
    Key key,
  }) : super(key: key);

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return new Scaffold(
        appBar: _buildBar(context),
        body: WatchRunPage(
          authToken,
          runId,
          title: 'Track4Run',
          key: _WatchRunPageStateKey,
        ));
  }

  Widget _buildBar(BuildContext context) {
    return new AppBar(
      title: Text('Track4Run'),
      actions: <Widget>[
        new IconButton(
            icon: new Icon(Icons.refresh),
            onPressed: () {
              _WatchRunPageStateKey.currentState.refreshData();
            })
      ],
    );
  }
}

class WatchRunPage extends StatefulWidget {
  WatchRunPage(
    this.authToken,
    this.runId, {
    Key key,
    this.title,
  }) : super(key: key);
  final String authToken;
  final int runId;

  final String title;

  @override
  _WatchRunPageState createState() => _WatchRunPageState();
}

class _WatchRunPageState extends State<WatchRunPage> {
  GoogleMapController _controller;

  Marker _marker;

  @override
  Widget build(BuildContext context) {
    return new Container(
      padding: EdgeInsets.all(0.0),
      child: new Column(
        children: <Widget>[
          _buildMap(),
        ],
      ),
    );
  }

  Widget _buildMap() {
    return Expanded(
      child: GoogleMap(
        options: GoogleMapOptions(
          myLocationEnabled: true,
        ),
        onMapCreated: (GoogleMapController controller) {
          _controller = controller;
          refreshData();
        },
      ),
    );
  }

  refreshData() async {
    final response = await http.get(
        'https://data4halp.herokuapp.com/runs/positions?auth_token=${widget.authToken}&run_id=${widget.runId}');
    print(response.body);

    if (response.statusCode == 200) {
      final runnerPos = _decodePos(response.body);
      _addAllRunners(runnerPos);
    } else {
      Scaffold.of(context)
          .showSnackBar(new SnackBar(content: new Text("Conection error.")));
    }
  }

  List<RunPoint> _decodePos(String body) {
    final list = List<RunPoint>();

    return list;
  }

  void _addAllRunners(List<RunPoint> runnerPos) async {
    await _controller.clearMarkers();

    runnerPos.forEach((pos) {
      _controller.addMarker(
        new MarkerOptions(
          position: new LatLng(pos.lat, pos.long),
          infoWindowText: new InfoWindowText("Runner info", pos.desc),
        ),

      );
    });
  }
}
