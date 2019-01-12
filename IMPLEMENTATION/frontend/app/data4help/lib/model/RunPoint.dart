/// A single check point of a run.
class RunPoint {
  /// The position of the checkpoint.
  final double lat, long;

  /// The order in the run
  final int order;

  ///A description of the checkpoint
  final String desc;

  RunPoint(this.lat, this.long, this.order, this.desc);

  /// Creates Json representation of the object
  String toJson() {
    return "{"
        "\"lat\": $lat,"
        "\"long\": $long,"
        "\"description\": \"$order - $desc\""
        "}";
  }

  RunPoint.fromJson(Map<String, dynamic> json)
      : lat = json["lastPosition"]["lat"],
        long = json["lastPosition"]["long"],
        order = json["order"] ?? 0,
        desc = json["id"] ?? "";
}
