

      function signInReq() {
        const url = "https://data4halp.herokuapp.com/auth/login";
        var username = $('#usernLogin').val();
        var password = $('#passwLogin').val();
        fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: username,
            password: password,
            type: 'company'
          })
        })
          .then(response => response.text())
          .then(contents => { //Assign to contents the response
            var myObj = JSON.parse(contents); //Parse the response
            if (myObj["success"] === true) {
              document.getElementById("demo2").innerHTML = myObj["auth_token"];
              setCookie(myObj["auth_token"], 7)
              document.location.href = "dashboard.html";
            }
            else {
              alert("Error Password or Username, retry.")/*displays error message*/
            }
          }
          )
          .catch((e) => console.log("Can’t access " + url + " response. Blocked by browser?" + e))
      }


      function signUpReq() {
        const url2 = "https://data4halp.herokuapp.com/auth/register_company?action=success";
        var username = $('#usernReg').val();
        var password = $('#passwReg').val();
        var company_name = $('#companyNameReg').val();
        var email = $('#emailReg').val();
        fetch(url2, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: email,
            password: password,
            company_name: company_name,
            type: 'company'
          })
        })
          .then(response => response.text())
          .then(contents => { //Assign to contents the response
            var myObj = JSON.parse(contents); //Parse the response
            if (myObj["status"] == 200) {
  
              // SERVIZIO INVIO EMAIL
  
              //Save cookie mail & authtoken (necessary for inserting the authCode)
              setCookie_mail(email, myObj["auth_token"], 1) // 1 day only and expires, since is a verification mail
  
  
              //Redirect to page where have to send the code and the email to confirm email
              document.location.href = "verify-email.html";
            }
            else {
              alert("There was found the following error:\n" + myObj["message"] + "\nRetry!")/*displays error message*/
            }
          }
          )
          .catch((e) => console.log("Can’t access " + url + " response. Blocked by browser?" + e))
      }
  
  
//Triggers for login & sign up

    $(document).ready(function () {
      $('.modal').modal();
    });
