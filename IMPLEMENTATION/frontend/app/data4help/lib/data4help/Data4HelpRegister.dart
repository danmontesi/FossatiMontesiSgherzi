import 'dart:convert';

import 'package:data4help/data4help/Dashboard.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:intl/intl.dart';

class Data4HelpRegister extends StatelessWidget {
  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return new Scaffold(
        appBar: _buildBar(context),
        body: Data4HelpRegisterPage());
  }

  Widget _buildBar(BuildContext context) {
    return new AppBar(
      title: Text('Data4Help Register'),
    );
  }
}

class Data4HelpRegisterPage extends StatefulWidget {
  Data4HelpRegisterPage({Key key, this.title}) : super(key: key);

  final String title;

  @override
  _Data4HelpRegisterPageState createState() => _Data4HelpRegisterPageState();
}

class _Data4HelpRegisterPageState extends State<Data4HelpRegisterPage> {
  final TextEditingController _emailFilter = new TextEditingController();
  final TextEditingController _passwordFilter = new TextEditingController();
  final TextEditingController _ssnFilter = new TextEditingController();
  final TextEditingController _nameFilter = new TextEditingController();
  final TextEditingController _surnameFilter = new TextEditingController();
  final TextEditingController _datetimeFilter = new TextEditingController();

  String _email = "";
  String _password = "";
  String _ssn = "";
  String _name = "";
  String _surname = "";

  bool _registerDisabled = false;


  _Data4HelpRegisterPageState() {
    _emailFilter.addListener(_emailListen);
    _passwordFilter.addListener(_passwordListen);
    _ssnFilter.addListener(_ssnListen);
    _nameFilter.addListener(_nameListen);
    _surnameFilter.addListener(_surnameListen);
  }

  void _emailListen() {
    if (_emailFilter.text.isEmpty) {
      _email = "";
    } else {
      _email = _emailFilter.text;
    }
  }

  void _passwordListen() {
    if (_passwordFilter.text.isEmpty || _passwordFilter.text.length < 8) {
      _password = "";
    } else {
      _password = _passwordFilter.text;
    }
  }

  void _ssnListen() {
    if (_ssnFilter.text.isEmpty) {
      _ssn = "";
    } else {
      _ssn = _ssnFilter.text;
    }
  }

  void _nameListen() {
    if (_nameFilter.text.isEmpty) {
      _name = "";
    } else {
      _name = _nameFilter.text;
    }
  }

  void _surnameListen() {
    if (_surnameFilter.text.isEmpty) {
      _surname = "";
    } else {
      _surname = _surnameFilter.text;
    }
  }

  @override
  Widget build(BuildContext context) {
    return new Container(
      padding: EdgeInsets.all(16.0),
      child: SingleChildScrollView(
        child: new Column(
          children: <Widget>[
            _buildTextFields(),
            _buildButtons(),
          ],
        ),
      ));
  }


  Widget _buildTextFields() {
    return new Container(
      child: new Column(
        children: <Widget>[
          new Container(
            child: new TextField(
              controller: _emailFilter,
              decoration: new InputDecoration(labelText: 'Email'),
            ),
          ),
          new Container(
            child: new TextField(
              controller: _passwordFilter,
              decoration: new InputDecoration(labelText: 'Password'),
              obscureText: true,
            ),
          ),
          new Container(
            child: new TextField(
              controller: _ssnFilter,
              decoration: new InputDecoration(labelText: 'SSN/Fiscal code'),
              obscureText: false,
            ),
          ),
          new Container(
            child: new TextField(
              controller: _nameFilter,
              decoration: new InputDecoration(labelText: 'Name'),
              obscureText: false,
            ),
          ),
          new Container(
            child: new TextField(
              controller: _surnameFilter,
              decoration: new InputDecoration(labelText: 'Surname'),
              obscureText: false,
            ),
          ),
          new Container(
            child: Row(
              children: <Widget>[
                Expanded(
                  child: new TextFormField(
                    decoration: const InputDecoration(
                      hintText: 'Enter your date of birth',
                      labelText: 'Date of birth',
                    ),
                    enabled: false,
                    controller: _datetimeFilter,
                    keyboardType: TextInputType.datetime,
                  ),
                ),
                new IconButton(
                    icon: new Icon(Icons.more_horiz),
                    onPressed: () =>
                        _chooseDate(context, _datetimeFilter.text)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildButtons() {
    return new Container(
      child: new Column(
        children: <Widget>[
          new RaisedButton(
            child: new Text('Register'),
            onPressed: _registerDisabled ? null : _loginPressed,
          ),
        ],
      ),
    );
  }

  Future _chooseDate(BuildContext context, String initialDateString) async {
    var now = new DateTime.now();
    var initialDate = convertToDate(initialDateString) ?? now;
    initialDate = (initialDate.year >= 1900 && initialDate.isBefore(now)
        ? initialDate
        : now);

    var result = await showDatePicker(
        context: context,
        initialDate: initialDate,
        firstDate: new DateTime(1900),
        lastDate: new DateTime.now());

    if (result == null) return;

    setState(() {
      _datetimeFilter.text = new DateFormat("yyyy-MM-dd").format(result);
    });
  }

  DateTime convertToDate(String input) {
    try {
      var d = new DateFormat("yyyy-MM-dd").parseStrict(input);
      return d;
    } catch (e) {
      return null;
    }
  }

  void _loginPressed() {
    setState(() {
      _registerDisabled = true;
    });

    fetchAuthToken().then((token) {
      print(token);
      Navigator.pop(context);
      Navigator.pop(context);
      Navigator.push(
          context, MaterialPageRoute(builder: (context) => Dashboard()));
    })
        .catchError((ex) {
      Scaffold.of(context).showSnackBar(new SnackBar(

        content: new Text("$ex"),
      ));

    }).whenComplete(() {
      setState(() {
        _registerDisabled = false;
      });
    });
  }

  Future<String> fetchAuthToken() async {
    Map<String, String> body = new Map<String, String>();
    body.putIfAbsent("email", () => _email);
    body.putIfAbsent("username", () => _email);
    body.putIfAbsent("password", () => _password);
    body.putIfAbsent("SSN", () => _ssn);
    body.putIfAbsent("name", () => _name);
    body.putIfAbsent("surname", () => _surname);
    body.putIfAbsent("birthday", () => _datetimeFilter.text);
    body.putIfAbsent("smartwatch", () => "TestSmartwatch1");

    final response = await http.post(
        'https://data4halp.herokuapp.com/auth/register_user',
        body: body);

    if (response.statusCode == 200) {
      if (json.decode(response.body)['success'] == true) {
        return json.decode(response.body)['auth_token'];
      }
      print(response.body);
      var error = json.decode(response.body)['message'];
      throw Exception('Server says: $error');
    } else {
      throw Exception('Failed to contact server.');
    }
  }
}

enum FormType { login, register }
