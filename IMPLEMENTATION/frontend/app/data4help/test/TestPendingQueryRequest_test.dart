import 'dart:convert';

import 'package:data4help/model/PendingQueryRequest.dart';
import "package:test/test.dart";

void main() {
  test("Json decoding", () async {
    var a = PendingQueryRequest.fromJson(json.decode('{"id":248,"company_name":"ddd"}'));

    expect(a.queryId, 248);
    expect(a.companyName, "ddd");
  });

}












