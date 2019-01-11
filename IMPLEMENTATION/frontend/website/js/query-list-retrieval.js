

  function getAllQueries() {



    document.getElementById("loading_panel").innerHTML = `
                        
                        <span class="title">Loading queries ...</span>
                         
                       `;

    const url = "https://data4halp.herokuapp.com/queries/query?auth_token=" + getCookie("auth_token");
    fetch( url, {

      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }

    })
      .then(response => response.json())
      .then(response => { //Assign to contents the response
        document.getElementById("loading_panel").innerHTML = ``;
        if (response["success"] === true) {

          if (!response.queries.radius) {
            document.getElementById("loading_panel").innerHTML = `You haven't performed any query yet!`;
          }
          else {
            //creating inner html to append to the page
            var HtmlToAppend = ""
            decodedResponse = response.queries.radius;
            console.log(decodedResponse);

            for (var i = 0; i < decodedResponse.length; i++) {

              curQuery = decodedResponse[i];

              HtmlToAppend += `
                        <ul class="collection">
                <li class="collection-item avatar">
                  <img src="images/data_icon.png" alt="" class="circle">
                  <span class="title">Radius query id: ${curQuery.id}</span>
                  <p>${"Center latitude: " + curQuery.center_lat + ", Center longitude:" + curQuery.center_long}
                  <br>${"bpm min: " + curQuery.additional_params.heart_rate.bpm[0] + ", bpm max: " + curQuery.additional_params.heart_rate.bpm[1]}
                  <br>${"bpm min: " + curQuery.additional_params.accelerometer.acc_x[0] + ", bpm max: " + curQuery.additional_params.accelerometer.acc_x[1]}
                  </p>
                  <button href="#!" onclick=createXml(${curQuery.id}) class="btn red">Download query</button>
                  <a href="#!" class="secondary-content"><!-- Switch -->
  <div class="switch">
    <label>
      Off
      <input id = "input"+${curQuery["id"]} type="checkbox" onclick="changeSwitchState(${curQuery["id"]})" checked="${curQuery["subscribed"]}">
      <span class="lever"></span>
      On
    </label>
  </div></a>
                </li>
              </ul>
                `;

            }

            document.getElementById("start_collection").innerHTML = HtmlToAppend;

          }
        }

      }
      )
      .catch((e) => console.log("Can’t access " + url + " response. Blocked by browser?" + e))
  }





  function getPatientList() {


    document.getElementById("loading_panel").innerHTML = `
                        
                        <span class="title">Loading queries ...</span>
                         
                       `;

    const url = "https://data4halp.herokuapp.com/queries/query?auth_token=" + getCookie("auth_token");

    fetch(url, {

      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }


    })

      .then(response => response.json())
      .then(response => { //Assign to contents the response
        console.log("here in response ")

        console.log(response)
        document.getElementById("loading_panel").innerHTML = ``;
        if (response["success"] === true) {
          if (!response.queries.individual) {
            document.getElementById("loading_panel").innerHTML = `You haven't performed any query yet!`;
          }
          else {
            console.log(response)
            //creating inner html to append to the page
            var HtmlToAppend = ""
            decodedResponse = response.queries.individual;
            if (decodedResponse) {

              for (var i = 0; i < decodedResponse.length; i++) {
                curQuery = decodedResponse[i]; //TODO SOTTO: create query click
                HtmlToAppend += `
                        <ul class="collection">
                <li class="collection-item avatar">
                  <img query_id = ${curQuery["id"]} src="images/data_icon.png" alt="" class="circle"  >
                  <span class="title">SSN: ${curQuery["ssn"]}</span>
                  <p>Query id: ${curQuery["id"]}<br>
                    <button href="#!" onclick=createXml(${curQuery["id"]}) class="btn red">Download query</button>
                  </p>
                  <a href="#!" class="secondary-content"><!-- Switch -->
  <div class="switch">
    <label>
      Off
      <input id = "input"+${curQuery["id"]} type="checkbox" onclick="changeSwitchState(${curQuery["id"]})" checked="${curQuery["subscribed"]}">
      <span class="lever"></span>
      On
    </label>
  </div>
</a>
                </li>
              </ul>
                `

              }
              document.getElementById("start_collection").innerHTML = HtmlToAppend;

            }

          }
        }

      }
      )
      .catch((e) => console.log("Can’t access " + url + " response. Blocked by browser?" + e))
  }



function getFirst5Query() {



  document.getElementById("loading_panel").innerHTML = `
                      
                      <span class="title">Loading queries ...</span>
                       
                     `;
                           
  const url = "https://data4halp.herokuapp.com/queries/query?auth_token=" + getCookie("auth_token");
  fetch(url, {

    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }

  })
    .then(response => response.json())
    .then(response => { //Assign to contents the response
      document.getElementById("loading_panel").innerHTML = ``;
      if (response["success"] === true) {
        if (!response.queries.regional && !response.queries.radius){
          document.getElementById("loading_panel").innerHTML = `You haven't performed any query yet!`;
        }
        else{

        //creating inner html to append to the page
        var HtmlToAppend = ""
        decodedResponse = response.queries.radius;
        console.log(decodedResponse);

        for (var i = 0; i < decodedResponse.length && i<5; i++) {

          curQuery = decodedResponse[i];

          HtmlToAppend += `
                      <ul class="collection">
              <li class="collection-item avatar">
                <img src="images/data_icon.png" alt="" class="circle">
                <span class="title">Radius query id: ${curQuery.id}</span>
                <p>${"Center latitude: " + curQuery.center_lat + ", Center longitude:" + curQuery.center_long}<br>
                  ${"bpm min: " + curQuery.additional_params.heart_rate.bpm[0] + ", bpm max: " + curQuery.additional_params.heart_rate.bpm[1]}
                </p>
                <button href="#!" onclick=createXml(${curQuery.id}) class="btn red">Download query</button>
                <a href="#!" class="secondary-content"><!-- Switch -->
  <div class="switch">
    <label>
      Off
      <input id = "input"+${curQuery["id"]} type="checkbox" onclick="changeSwitchState(${curQuery["id"]})" checked="${curQuery["subscribed"]}">
      <span class="lever"></span>
      On
    </label>
  </div></a>
              </li>
            </ul>
              `;

        }

        document.getElementById("start_collection").innerHTML = HtmlToAppend;
}


      }
      
    
    }
    )
    .catch((e) => console.log("Can’t access " + url + " response. Blocked by browser?" + e))
}
