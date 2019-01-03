class RunPoint {
  final double lat, long;
  final int order;
  final String desc;

  RunPoint(this.lat, this.long, this.order, this.desc);

  String toJson() {
    return "{"
        "\"lat\": $lat,"
        "\"long\": $long,"
        "\"description\": \"$order - $desc\""
        "}";
  }
}
