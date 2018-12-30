import 'dart:math';

import 'package:intl/intl.dart';

class UserData {
  final List<GpsCoordinate> gpsCoordinates;
  final List<Accelerometer> accelerometer;
  final List<Heartrate> heartRate;


  UserData(this.gpsCoordinates, this.accelerometer, this.heartRate);

  factory UserData.fromJson(Map<String, dynamic> json){
    UserData data = new UserData(new List<GpsCoordinate>(), new List<Accelerometer>(),new List<Heartrate>());

    json["gps_coordinates"].forEach((e) {
      data.gpsCoordinates.add(GpsCoordinate.fromJson(e));
    });

    json["accelerometer"].forEach((e) {
      data.accelerometer.add(Accelerometer.fromJson(e));
    });

    json["heart_rate"].forEach((e) {
      data.heartRate.add(Heartrate.fromJson(e));
    });


    return data;
  }


  String toJson() {
    String gps_json="";
    String acc_json="";
    String hr_json="";

    gpsCoordinates.forEach((c) {
      gps_json += c.toJson();
      if (c != gpsCoordinates.last){
        gps_json += ", ";
      }
    });

    accelerometer.forEach((c) {
      acc_json += c.toJson();
      if (c != accelerometer.last){
        acc_json += ", ";
      }
    });

    heartRate.forEach((c) {
      hr_json += c.toJson();
      if (c != heartRate.last){
        hr_json += ", ";
      }
    });


    return "{"
        "\"gps_coordinates\": [$gps_json],"
        "\"accelerometer\": [$acc_json],"
        "\"heart_rate\": [$hr_json]"
        "}";

  }

  static UserData generateSampleData(DateTime now) {

    final List<GpsCoordinate> gpsCoordinates = new List();
    final List<Accelerometer> accelerometer = new List();
    final List<Heartrate> heartRate = new List();




    for(int i=0; i<6*24; i++){
      gpsCoordinates.add(new GpsCoordinate(Random.secure().nextDouble(), Random.secure().nextDouble(), now));
      accelerometer.add(new Accelerometer(Random.secure().nextDouble(), Random.secure().nextDouble(), Random.secure().nextDouble(), now));
      heartRate.add(new Heartrate(Random.secure().nextInt(80)-40 + 60 , now));
      now= now.add(new Duration(minutes: 10));
    }

    UserData userdata = new UserData(gpsCoordinates, accelerometer, heartRate);
    return userdata;
  }
}

String _formatData(DateTime inputString){
  return new DateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'").format(inputString);
}

class GpsCoordinate{
  final double lat;
  final double long;
  final DateTime timestamp;

  GpsCoordinate(this.lat, this.long, this.timestamp);

  GpsCoordinate.fromJson(Map<String, dynamic> json)
      : lat = json['lat'],
        long = json['long'],
        timestamp = DateTime.parse(json['timestamp']);

  String toJson() =>
      "{\"lat\": ${lat.toStringAsFixed(6)}, \"long\": ${long.toStringAsFixed(6)}, \"timestamp\": \"${_formatData(timestamp)}\"}";
}


class Accelerometer{
  final double x, y, z;
  final DateTime timestamp;


  Accelerometer(this.x, this.y, this.z, this.timestamp);

  Accelerometer.fromJson(Map<String, dynamic> json)
      : x = json['acc_x'],
        y = json['acc_y'],
        z = json['acc_z'],
        timestamp = DateTime.parse(json['timestamp']);

  String toJson() =>
      "{\"acc_x\": ${x.toStringAsFixed(6)}, \"acc_y\": ${y.toStringAsFixed(6)}, \"acc_z\": ${z.toStringAsFixed(6)},  \"timestamp\": \"${_formatData(timestamp)}\"}";
}


class Heartrate{
  final int hr;
  final DateTime timestamp;


  Heartrate(this.hr, this.timestamp);

  Heartrate.fromJson(Map<String, dynamic> json)
      : hr = json['bpm'],
        timestamp = DateTime.parse(json['timestamp']);

  String toJson() =>
      "{\"bpm\": $hr,   \"timestamp\": \"${_formatData(timestamp)}\"}";
}




