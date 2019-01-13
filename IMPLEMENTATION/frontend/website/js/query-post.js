//Var of path url
var path_url = "https://data4halp.herokuapp.com/v1/";

  function sendQueryRadius() {
    const url = "queries/query";
    var authtoken = getCookie("auth_token");//get authtoken
    var center_lat = parseFloat($('#center_lat').val());
    var center_long = parseFloat($('#center_long').val());
    var acc_min = parseInt($('#min_accR').val());
    var acc_max = parseInt($('#max_accR').val());
    var bpm_min = parseInt($('#min_bpmR').val());
    var bpm_max = parseInt($('#max_bpmR').val());
    var radius = parseInt($('#radius').val());
    fetch(path_url + url, {

      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        auth_token: authtoken,
        query: {
          type: 'radius',
          center_lat: center_lat,
          center_long: center_long,
          radius: radius,
          additional_params: {
            accelerometer: {
              acc_x: [acc_min, acc_max]
            },
            heart_rate: {
              bpm: [bpm_min, bpm_max]
            }
          }
        }
      }
      )
    })
      .then(response => response.text())
      .then(contents => { //Assign to contents the response
        var myObj = JSON.parse(contents); //Parse the response
        if (myObj["success"] === true) {
          setCookieQueryId(contents["query_id"], 1)
          $('.modal.open').modal('close')
          $("#modal1").modal();
          $("#modal1").modal('open');

          //Reload queries after new one performed
          getAllQueries();
        }
        else {
          alert("Error:" + myObj["message"] + ".\nRetry!")
        }

      });
  }



  function sendQueryIndividual() {
    const url = "queries/query";
    var auth_token = getCookie("auth_token");//get authtoken
    var SSN = $('#ssn').val();

    fetch(path_url + url, {

      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        auth_token: auth_token,
        query: {
          type: 'individual',
          ssn: SSN,
          additional_params: {

          }
        }
      }
      )
    })
      .then(response => response.text())
      .then(contents => { //Assign to contents the response
        var myObj = JSON.parse(contents); //Parse the response
        if (myObj["success"] == true) {
          $('.modal.open').modal('close')
          $("#modal1").modal();
          $("#modal1").modal('open');
        }
        else {
          alert("Error:" + myObj["message"] + ".\nRetry!")
        }

      });
  }

