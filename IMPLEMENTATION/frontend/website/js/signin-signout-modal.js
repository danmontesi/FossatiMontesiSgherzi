//Var of path url
var path_url = "https://data4halp.herokuapp.com/v1/";

      function signInReq() {
        const url = "auth/login";
        var username = $('#usernLogin').val();
        var password = $('#passwLogin').val();
        
        fetch(path_url + url, {
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
              setCookie(myObj["auth_token"], 7)
              document.location.href = "dashboard.html";
            }
            else {
              alert("Error Password or Username, retry.")/*displays error message*/
            }
          }
          )
          .catch((e) => console.log("Can’t access " + url + " response. " + e))
      }


      function signUpReq() {
      
        const url2 = "auth/register_company?action=success";
    
        var password = $('#passwReg').val();
        var confirm_password = $('#repPasswordReg').val();
        var company_name = $('#companyNameReg').val();
        var email = $('#emailReg').val();
        
        if (!isLongEnough(4, email)){
        	alert("It was found the following error:\nYour email must be at least long 4 characters.\nRetry!");
        }
        else if (!isLongEnough(8, password)){
        	alert("It was found the following error:\nYour password must be at least long 8 characters.\nRetry!");
        }
        else if(!isMatch(password, confirm_password)) {
        	alert("It was found the following error:\nYour passwords don't match.\nRetry!");
       }
    	else if(!isLongEnough(4, company_name)) {
        	alert("It was found the following error:\nYour company name must be at least long 4 characters.\nRetry!");
       }
       else{
        
        fetch(path_url + url2, {
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
          .catch((e) => console.log("Can’t access " + url + " response." + e))
          
          }
      }
  
  
  function isMatch(password, confirm_pass) {
    if (password != confirm_pass)
        return false
    else
        return true
}

  function isLongEnough(length, label) {
    if (label.length >= length)
        return true
    else
        return false
}
  
//Triggers for login & sign up

    $(document).ready(function () {
      $('.modal').modal();
    });
    
