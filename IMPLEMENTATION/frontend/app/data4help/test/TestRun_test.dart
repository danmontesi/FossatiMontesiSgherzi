import 'dart:convert';

import 'package:data4help/model/Run.dart';
import "package:test/test.dart";

void main() {
  test("Json decoding", () async {
    var a = Run.fromJson(json.decode('{"organizer_id":70,"id":25,"start_time":"2019-02-07T16:37:00.000Z","description":"test","end_time":"2019-01-11T17:37:00.000Z","status":"ACCEPTING_SUBSCRIPTION"}'));

    expect(a.organizerId, 70);
    expect(a.id, 25);
    expect(a.startTime, DateTime.parse("2019-02-07T16:37:00.000Z"));
    expect(a.endTime, DateTime.parse("2019-01-11T17:37:00.000Z"));
    expect(a.description, "test");
    expect(a.status, "ACCEPTING_SUBSCRIPTION");

  });
}
