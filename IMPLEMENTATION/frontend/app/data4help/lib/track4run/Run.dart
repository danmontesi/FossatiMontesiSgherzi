class Run{
  final String description;
  final DateTime startTime, endTime;
  final int status;
  final int id, organizerId;

  Run(this.id, this.organizerId, this.description, this.startTime, this.endTime, this.status
      );

  factory Run.fromJson(Map<String, dynamic> json){
    return new Run(json["id"], json["organizer_id"], json["description"], DateTime.parse(json["start_time"]), DateTime.parse(json["end_time"]), json["status"]);
  }


}