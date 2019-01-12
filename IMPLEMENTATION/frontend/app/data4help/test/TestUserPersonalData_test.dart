import 'dart:convert';

import 'package:data4help/model/UserPersonalData.dart';
import "package:test/test.dart";

void main() {
  test("Json decoding", () async {
    var a = UserPersonalData.fromJson(json.decode('{"email":"fossanico@gmail.com","verified":true,"ssn":"1234567890123456","birth_date":"2018-12-27T00:00:00.000Z","automated_sos":false,"smartwatch":"TestSmartwatch1","name":"Nico","surname":"Fossa"}'));

    expect(a.verified, true);
    expect(a.email, "fossanico@gmail.com");
    expect(a.ssn, "1234567890123456");
    expect(a.birthDate, DateTime.parse("2018-12-27T00:00:00.000Z"));
    expect(a.smartwatchModel, "TestSmartwatch1");
    expect(a.name, "Nico");
    expect(a.surname, "Fossa");



  });
}
