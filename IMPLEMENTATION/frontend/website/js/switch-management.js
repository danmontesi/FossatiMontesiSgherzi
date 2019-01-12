//Var of path url
var path_url = "https://data4halp.herokuapp.com/v1/";

  function changeSwitchState(query_id) {
    $("input" + query_id).change(function () {
      if ($(this).is(":checked")) {

        changeSubscriptionToQuery(query_id, 'individual', true);
      }
      else {
        changeSubscriptionToQuery(query_id, 'individual', false);
      }
    })
  }

// Not implemented, left for future addition of the functionality
  function changeSubscriptionToQuery(query_id, query_type, subscribed) {

    const url = "queries/subscribe";
    var auth_token = getCookie("auth_token");//get authtoken // not implemented endpoint
    var SSN = $('#ssn').val();

    fetch(path_url + url, {

      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        auth_token: auth_token,
        query_type: query_type,
        query_id: query_id,
        subscribed: subscribed
      }
      )
    })
      .then(response => response.text())
      .then(contents => {

        if (response["success"] === true) {
        }
      }
      )
  }
  
   