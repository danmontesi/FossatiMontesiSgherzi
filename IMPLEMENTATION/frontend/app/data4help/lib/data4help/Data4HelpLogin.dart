import 'dart:convert';

import 'package:data4help/data4help/Dashboard.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class Data4HelpLogin extends StatelessWidget {
  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Data4Help',

      home: Data4HelpLoginPage(title: 'Data4Help Login'),
    );
  }
}

class Data4HelpLoginPage extends StatefulWidget {
  Data4HelpLoginPage({Key key, this.title}) : super(key: key);

  final String title;

  @override
  _Data4HelpLoginPageState createState() => _Data4HelpLoginPageState();
}

class _Data4HelpLoginPageState extends State<Data4HelpLoginPage> {
  final TextEditingController _emailFilter = new TextEditingController();
  final TextEditingController _passwordFilter = new TextEditingController();
  String _email = "";
  String _password = "";

  bool _loginDisabled=false;

  FormType _form = FormType
      .login; // our default setting is to login, and we should switch to creating an account when the user chooses to

  _Data4HelpLoginPageState() {
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
    return new Scaffold(
      appBar: _buildBar(context),
      body: new Container(
        padding: EdgeInsets.all(16.0),
        child: new Column(
          children: <Widget>[
            _buildTextFields(),
            _buildButtons(),
          ],
        ),
      ),
    );
  }

  Widget _buildBar(BuildContext context) {
    return new AppBar(
      title: Text(widget.title),
    );
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
          )
        ],
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
              child: new Text('Dont have an account? Tap here to register.'),
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
        Navigator.push(context, MaterialPageRoute(builder: (context) => Dashboard()));
    }).catchError(() {
      Scaffold.of(context).showSnackBar(new SnackBar(
        content: new Text("Authentication error"),
        ));
    });



    Navigator.push(context, MaterialPageRoute(builder: (context) => Dashboard()));
  }

  void _createAccountPressed() {
    //

  }

  Future<String> fetchAuthToken() async {
    Map<String, String> body = new Map<String, String>();
    body.putIfAbsent("username", () => _email);
    body.putIfAbsent("password", () => _password);

    final response = await http.post('https://data4halp.herokuapp.com/auth/login?action=success', body: body);

    if (response.statusCode == 200) {
      return json.decode(response.body)['auth_token'];
    } else {
      throw Exception('Failed to load post');
    }
  }
}


enum FormType {
  login,
  register
}






















