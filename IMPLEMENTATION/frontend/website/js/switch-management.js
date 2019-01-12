
  function changeSwitchState(query_id) {
    console.log("entra");
    $("input" + query_id).change(function () {
      if ($(this).is(":checked")) {
        console.log("Is checked");
        changeSubscriptionToQuery(query_id, 'individual', true);
      }
      else {
        console.log("Is Not checked");
        changeSubscriptionToQuery(query_id, 'individual', false);
      }
    })
  }

  function changeSubscriptionToQuery(query_id, query_type, subscribed) {
    console.log("SubscribeToQuery");
    const url = "https://data4halp.herokuapp.com/queries/subscribe";
    var auth_token = getCookie("auth_token");//get authtoken
    var SSN = $('#ssn').val();

    fetch(url, {

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
          console.log("success change query_id=" + query_id);
        }
      }
      )
  }
  
  