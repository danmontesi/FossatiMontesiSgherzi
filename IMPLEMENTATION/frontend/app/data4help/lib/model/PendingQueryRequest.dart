/// Represents a pending request by a company
class PendingQueryRequest {
  /// The id of the request
  final int queryId;
  /// The name of the company that has made the id.
  final String companyName;

  PendingQueryRequest(this.queryId, this.companyName);

  /// Creates Json representation of the object
  PendingQueryRequest.fromJson(Map<String, dynamic> json)
      : queryId = json["id"],
        companyName = json["company_name"];
}