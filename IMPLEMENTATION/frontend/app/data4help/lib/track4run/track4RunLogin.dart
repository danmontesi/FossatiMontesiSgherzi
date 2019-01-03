import 'dart:convert';

import 'package:data4help/data4help/Dashboard.dart';
import 'package:data4help/data4help/Data4HelpRegister.dart';
import 'package:data4help/track4run/DashboardRunOrganizer.dart';
import 'package:data4help/track4run/Track4RunRegister.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class Track4RunLogin extends StatelessWidget {
  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return new Scaffold(
        appBar: _buildBar(context),
        body: Track4RunLoginPage(title: 'Data4Help Login'));
  }

  Widget _buildBar(BuildContext context) {
    return new AppBar(
      title: Text('Data4Help Login'),
    );
  }
}

class Track4RunLoginPage extends StatefulWidget {
  Track4RunLoginPage({Key key, this.title}) : super(key: key);

  final String title;

  @override
  _Track4RunLoginPageState createState() => _Track4RunLoginPageState();
}

class _Track4RunLoginPageState extends State<Track4RunLoginPage> {
  final TextEditingController _emailFilter = new TextEditingController();
  final TextEditingController _passwordFilter = new TextEditingController();
  String _email = "";
  String _password = "";

  bool _loginDisabled = false;

  FormType _form = FormType
      .login; // our default setting is to login, and we should switch to creating an account when the user chooses to

  _Track4RunLoginPageState() {
    _emailFilter.addListener(_emailListen);
    _passwordFilter.addListener(_passwordListen);
  }

  void _emailListen() {
    if (_emailFilter.text.isEmpty) {
      _email = "";
    } else {
      _email = _emailFilter.text;
    }
  }

  void _passwordListen() {
    if (_passwordFilter.text.isEmpty) {
      _password = "";
    } else {
      _password = _passwordFilter.text;
    }
  }

  @override
  Widget build(BuildContext context) {
    return new Container(
      padding: EdgeInsets.all(16.0),
      child: new SingleChildScrollView(
        child: new Column(
          children: <Widget>[
            _buildTextFields(),
            _buildButtons(),
          ],
        ),
      ),
    );
  }

  Widget _buildTextFields() {
    return new Container(
      child: SingleChildScrollView(
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
            )
          ],
        ),
      ),
    );
  }

  Widget _buildButtons() {
    if (_form == FormType.login) {
      return new Container(
        child: new Column(
          children: <Widget>[
            new RaisedButton(
              child: new Text('Login'),
              onPressed: _loginDisabled ? null : _loginPressed,
            ),
            new FlatButton(
              child: new Text('Don\'t have an account? Tap here to register.'),
              onPressed: _createAccountPressed,
            ),
          ],
        ),
      );
    }
  }

  void _loginPressed() {
    setState(() {
      _loginDisabled = true;
    });

    fetchAuthToken().then((token) {
      print(token);
      Navigator.push(
          context, MaterialPageRoute(builder: (context) => DashboardRunOrganizer(token)));
    }).catchError((e) {
      Scaffold.of(context).showSnackBar(new SnackBar(
        content: new Text("$e"),
      ));
    }).whenComplete(() {
      setState(() {
        _loginDisabled = false;
      });
    });
  }

  void _createAccountPressed() {
    Navigator.push(
        context, MaterialPageRoute(builder: (context) => Track4RunRegister()));
  }

  Future<String> fetchAuthToken() async {
    Map<String, String> body = new Map<String, String>();
    body.putIfAbsent("email", () => _email);
    body.putIfAbsent("password", () => _password);
    body.putIfAbsent("type", () => "run_organizer");

    final response = await http.post(
        'https://data4halp.herokuapp.com/auth/login',
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
