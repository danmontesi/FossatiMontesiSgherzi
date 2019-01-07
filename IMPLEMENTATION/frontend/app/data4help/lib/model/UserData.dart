import 'dart:math';

import 'package:intl/intl.dart';

/// Contains, as list, the data of a user. It contains the [gpsCoordinates], the [accelerometer] informations and data about [heartRate].
class UserData {
  final List<GpsCoordinate> gpsCoordinates;
  final List<Accelerometer> accelerometer;
  final List<Heartrate> heartRate;


  UserData(this.gpsCoordinates, this.accelerometer, this.heartRate);

  /// Creates the object starting from the Json representation
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

/// Returns a [String] containing the json representation of the actual data.
  String toJson() {
    String gpsJson="";
    String accJson="";
    String hrJson="";

    gpsCoordinates.forEach((c) {
      gpsJson += c.toJson();
      if (c != gpsCoordinates.last){
        gpsJson += ", ";
      }
    });

    accelerometer.forEach((c) {
      accJson += c.toJson();
      if (c != accelerometer.last){
        accJson += ", ";
      }
    });

    heartRate.forEach((c) {
      hrJson += c.toJson();
      if (c != heartRate.last){
        hrJson += ", ";
      }
    });


    return "{"
        "\"gps_coordinates\": [$gpsJson],"
        "\"accelerometer\": [$accJson],"
        "\"heart_rate\": [$hrJson]"
        "}";

  }

  /// Generates fake data for the day specified in [now], only for testing purpose.
  static UserData generateSampleData(DateTime now) {

    final List<GpsCoordinate> gpsCoordinates = new List();
    final List<Accelerometer> accelerometer = new List();
    final List<Heartrate> heartRate = new List();

    for(int i=0; i<6*24; i++){
      gpsCoordinates.add(new GpsCoordinate(45.476987, 9.230192999999844, now));
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

/// Contains a single point of gps data as latitude, longitude and timestamp.
class GpsCoordinate{
  ///The latitude
  final double lat;
  ///The longitude
  final double long;
  /// The date/time associated with the current point.
  final DateTime timestamp;

  GpsCoordinate(this.lat, this.long, this.timestamp);

  /// Creates the object starting from the Json representation
  GpsCoordinate.fromJson(Map<String, dynamic> json)
      : lat = json['lat'],
        long = json['long'],
        timestamp = DateTime.parse(json['timestamp']);

  /// Returns a [String] containing the json representation of the actual data.
  String toJson() =>
      "{\"lat\": ${lat.toStringAsFixed(6)}, \"long\": ${long.toStringAsFixed(6)}, \"timestamp\": \"${_formatData(timestamp)}\"}";
}


class Accelerometer{
  ///Informations about the x, y and z coordinates.
  final double x, y, z;
  /// The date/time associated with the current data.
  final DateTime timestamp;


  Accelerometer(this.x, this.y, this.z, this.timestamp);

  /// Creates the object starting from the Json representation
  Accelerometer.fromJson(Map<String, dynamic> json)
      : x = json['acc_x'],
        y = json['acc_y'],
        z = json['acc_z'],
        timestamp = DateTime.parse(json['timestamp']);

  /// Returns a [String] containing the json representation of the actual data.
  String toJson() =>
      "{\"acc_x\": ${x.toStringAsFixed(6)}, \"acc_y\": ${y.toStringAsFixed(6)}, \"acc_z\": ${z.toStringAsFixed(6)},  \"timestamp\": \"${_formatData(timestamp)}\"}";
}


class Heartrate{
  /// The heartrate.
  final int hr;
  /// The date/time associated with the current heartrate.
  final DateTime timestamp;


  Heartrate(this.hr, this.timestamp);

  /// Creates the object starting from the Json representation
  Heartrate.fromJson(Map<String, dynamic> json)
      : hr = json['bpm'],
        timestamp = DateTime.parse(json['timestamp']);

  /// Returns a [String] containing the json representation of the actual data.
  String toJson() =>
      "{\"bpm\": $hr,   \"timestamp\": \"${_formatData(timestamp)}\"}";
}




