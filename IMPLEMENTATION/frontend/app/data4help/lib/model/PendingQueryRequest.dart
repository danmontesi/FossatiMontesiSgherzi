class PendingQueryRequest {
  final int queryId;

  PendingQueryRequest(this.queryId);

  PendingQueryRequest.fromJson(Map<String, dynamic> json)
      : queryId = json["id"];
}