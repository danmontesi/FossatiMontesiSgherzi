
import 'package:data4help/presenter/RunOrganizerPresenter.dart';
import 'package:data4help/view/track4run/DashboardRunOrganizer.dart';
import 'package:data4help/view/track4run/Track4RunRegister.dart';
import 'package:flutter/material.dart';

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

  void _loginPressed() {
    setState(() {
      _loginDisabled = true;
    });

    new RunOrganizerPresenter(_email, _password).login().then((token) {
      print(token);
      Navigator.push(
          context, MaterialPageRoute(builder: (context) => DashboardRunOrganizer()));
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


}

