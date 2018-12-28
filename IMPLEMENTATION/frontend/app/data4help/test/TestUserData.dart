import 'dart:math';

import 'package:data4help/data4help/UserData.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:data4help/main.dart';

void main() {

    print(_generateData().toJson());



}

UserData _generateData() {

  final List<GpsCoordinate> gpsCoordinates = new List();
  final List<Accelerometer> accelerometer = new List();
  final List<Heartrate> heartRate = new List();


  DateTime now = new DateTime.now();
  //go to midnight
  now=now.subtract(new Duration(hours: now.hour, minutes: now.minute, seconds: now.second, milliseconds: now.millisecond, microseconds: now.microsecond));


  for(int i=0; i<2; i++){
    gpsCoordinates.add(new GpsCoordinate(Random.secure().nextDouble(), Random.secure().nextDouble(), now));
    accelerometer.add(new Accelerometer(Random.secure().nextDouble(), Random.secure().nextDouble(), Random.secure().nextDouble(), now));
    heartRate.add(new Heartrate(Random.secure().nextInt(20)-10 + 60 , now));
    now= now.add(new Duration(minutes: 10));
  }

  UserData userdata = new UserData(gpsCoordinates, accelerometer, heartRate);
  return userdata;
}
