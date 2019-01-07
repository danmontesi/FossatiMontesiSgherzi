
import 'package:data4help/view/data4help/Dashboard.dart';
import 'package:data4help/view/data4help/Data4HelpRegister.dart';
import 'package:data4help/presenter/UserPresenter.dart';
import 'package:flutter/material.dart';

class Data4HelpLogin extends StatelessWidget {
  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return new Scaffold(
        appBar: _buildBar(context),
        body: Data4HelpLoginPage(title: 'Data4Help Login'));
  }

  Widget _buildBar(BuildContext context) {
    return new AppBar(
      title: Text('Data4Help Login'),
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

  bool _loginDisabled = false;


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

    new UserPresenter(_email, _password).login().then((token) {
      print(token);
      Navigator.push(
          context, MaterialPageRoute(builder: (context) => Dashboard()));
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
        context, MaterialPageRoute(builder: (context) => Data4HelpRegister()));
  }


}

