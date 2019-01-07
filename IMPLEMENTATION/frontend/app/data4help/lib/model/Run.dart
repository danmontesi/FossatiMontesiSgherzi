/// A class representing a Run
class Run{
  /// The description of the run.
  final String description;
  ///The starting and the ending time of the run.
  final DateTime startTime, endTime;
  /// The status of the run.
  final String status;
  /// The id of the run.
  final int id;
  ///The id of the organizer of the run.
  final int organizerId;

  Run(this.id, this.organizerId, this.description, this.startTime, this.endTime, this.status
      );

  /// Creates Json representation of the object
  factory Run.fromJson(Map<String, dynamic> json){
    return new Run(json["id"], json["organizer_id"], json["description"], DateTime.parse(json["start_time"]), DateTime.parse(json["end_time"]), json["status"]);
  }


}