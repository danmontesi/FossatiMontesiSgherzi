import 'package:data4help/presenter/UserPresenter.dart';
import 'package:data4help/track4run/RunPoint.dart';
import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:http/http.dart' as http;

class WatchRun extends StatelessWidget {
  final int runId;
  GlobalKey<_WatchRunPageState> _WatchRunPageStateKey =
      new GlobalKey<_WatchRunPageState>();

  WatchRun(
    this.runId, {
    Key key,
  }) : super(key: key);

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return new Scaffold(
        appBar: _buildBar(context),
        body: WatchRunPage(
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
    this.runId, {
    Key key,
    this.title,
  }) : super(key: key);
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

  void refreshData() {
    UserPresenter.getActivePresenter().getRunPositions(widget.runId).then((data){
      _addAllRunners(data);
    }).catchError((error) {
      Scaffold.of(context).showSnackBar(new SnackBar(content: new Text("$error")));
    });
  }
}

