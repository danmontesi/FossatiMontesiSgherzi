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
        "gps_coordinates: [$gps_json]"
        "accelerometer: [$acc_json]"
        "heart_rate: [$hr_json]"
        "}";

  }
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
      "{lat: $lat, long: $long, timestamp: ${timestamp.toIso8601String()}}";
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
      "{acc_x: $x, acc_y: $y, acc_z: $z,  timestamp: ${timestamp.toIso8601String()}}";
}


class Heartrate{
  final int hr;
  final DateTime timestamp;


  Heartrate(this.hr, this.timestamp);

  Heartrate.fromJson(Map<String, dynamic> json)
      : hr = json['bpm'],
        timestamp = DateTime.parse(json['timestamp']);

  String toJson() =>
      "{bpm: $hr,   timestamp: ${timestamp.toIso8601String()}}";
}




