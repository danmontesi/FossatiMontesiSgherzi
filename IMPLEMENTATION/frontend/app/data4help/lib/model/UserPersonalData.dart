/// Contains the personal data of a user, like the name and the surname.
class UserPersonalData {
  final String name, surname, email, ssn, smartwatchModel;
  final bool verified;
  final DateTime birthDate;

  //{"email":"fossanico@gmail.com","verified":true,"ssn":"1234567890123456","birth_date":"2018-12-27T00:00:00.000Z","automated_sos":false,"smartwatch":"TestSmartwatch1","name":"Nico","surname":"Fossa"

  UserPersonalData.fromJson(Map<String, dynamic> json)
      : name = json["name"],
        surname = json["surname"],
        email = json["email"],
        ssn = json["ssn"],
        birthDate = DateTime.parse(json["birth_date"]),
        smartwatchModel = json["smartwatch"],
        verified = json["verified"];
}
