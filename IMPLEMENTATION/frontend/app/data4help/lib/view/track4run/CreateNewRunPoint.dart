import 'package:data4help/model/RunPoint.dart';
import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

class CreateNewPoint extends StatelessWidget {
  final List<RunPoint> runPointList;
  final GlobalKey<_CreateNewPointPageState> _createNewPointPageStateKey =
      new GlobalKey<_CreateNewPointPageState>();

  CreateNewPoint(
    this.runPointList, {
    Key key,
  }) : super(key: key);

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return new Scaffold(
        appBar: _buildBar(context),
        body: CreateNewPointPage(
          runPointList,
          title: 'Track4Run',
          key: _createNewPointPageStateKey,
        ));
  }

  Widget _buildBar(BuildContext context) {
    return new AppBar(
      title: Text('Track4Run'),
      actions: <Widget>[
        new IconButton(
            icon: new Icon(Icons.check),
            onPressed: () {
              Navigator.pop(
                  context,
                  new RunPoint(
                      _createNewPointPageStateKey.currentState
                          .getMarkerPos()
                          .latitude,
                      _createNewPointPageStateKey.currentState
                          .getMarkerPos()
                          .longitude,
                      runPointList.length, ""));
            })
      ],
    );
  }
}

class CreateNewPointPage extends StatefulWidget {
  CreateNewPointPage(this.runPointList, {Key key, this.title})
      : super(key: key);
  final List<RunPoint> runPointList;

  final String title;

  @override
  _CreateNewPointPageState createState() => _CreateNewPointPageState();
}

class _CreateNewPointPageState extends State<CreateNewPointPage> {
  GoogleMapController _controller;

  Marker _marker;

  @override
  Widget build(BuildContext context) {
    return new Container(
      padding: EdgeInsets.all(0.0),
      child: new Column(
        children: <Widget>[
          _buildButtons(),
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
          widget.runPointList.forEach((point) {
            _controller.addMarker(
              new MarkerOptions(
                position: new LatLng(point.lat, point.long),
                infoWindowText:
                    new InfoWindowText("Point", "Index: ${point.order}"),
                alpha: 0.5,
              ),
            );
          });

          RunPoint last = widget.runPointList.length > 0
              ? widget.runPointList.last
              : new RunPoint(45.476987, 9.234593, 0, "");
          _controller
              .addMarker(
            new MarkerOptions(
                position: new LatLng(last.lat, last.long),
                infoWindowText: new InfoWindowText(
                    "New point", "Drag this point around the map"),
                draggable: false,
                zIndex: 10.0),
          )
              .then((mark) {
            _marker = mark;
            _controller.animateCamera(CameraUpdate.newLatLngZoom(new LatLng(last.lat, last.long), 14));
          });
        },
      ),
    );
  }

  LatLng getMarkerPos() {
    _controller.markers.forEach((m) {
      print(m.id + " - " + m.options.position.toString());
    });
    return _marker.options.position;
  }

  Widget _buildButtons() {
    return new Row(
      mainAxisAlignment: MainAxisAlignment.center,
      crossAxisAlignment: CrossAxisAlignment.center,
      mainAxisSize: MainAxisSize.max,
      children: <Widget>[
        new MaterialButton(
          onPressed: () => _moveMarker(0, -0.0001),
          child: new Icon(Icons.arrow_left),
        ),
        new MaterialButton(
          onPressed: () => _moveMarker(0, 0.0001),
          child: new Icon(Icons.arrow_right),
        ),
        new MaterialButton(
          onPressed: () => _moveMarker(0.0005, 0),
          child: new Icon(Icons.keyboard_arrow_up),
        ),
        new MaterialButton(
          onPressed: () => _moveMarker(-0.0005, 0),
          child: new Icon(Icons.keyboard_arrow_down),
        ),
      ],
    );
  }

  _moveMarker(double lat, double long) {
    _controller.updateMarker(
      _marker,
      new MarkerOptions(
        position: new LatLng(_marker.options.position.latitude + lat,
            _marker.options.position.longitude + long),
      ),
    );
  }
}
