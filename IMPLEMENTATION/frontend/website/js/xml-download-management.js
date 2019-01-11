
//<!-- Function get Xml from  server endpoint-->

  function createXml(query_id) {

    const url = "https://data4halp.herokuapp.com/queries/query/data";
    var authtoken = getCookie("auth_token");//get authtoken
    var query_id = query_id;
    fetch(url + "?auth_token=" + authtoken + "&query_id=" + query_id, {

      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }

    })
      .then(response => response.text())
      .then(contents => { //Assign to contents the response
        var myObj = JSON.parse(contents); //Parse the response
        if (myObj["success"] == true) {
          //Show the json file
          //window.webkitRequestFileSystem(window.TEMPORARY, 1024*1024, SaveDatFileBro);
          
          var xml = json2xml(contents);
          download_file(query_id + ".txt", xml.substring(58, xml.length), "text/plain")

        }
        else {
          alert("Error:" + myObj["message"] + ".\nRetry!")
        }

      });
  }

  function json2xml(json) {
    var a = JSON.parse(json)
    var c = document.createElement("root");
    var t = function (v) {
      return {}.toString.call(v).split(' ')[1].slice(0, -1).toLowerCase();
    };
    var f = function (f, c, a, s) {
      c.setAttribute("type", t(a));
      if (t(a) != "array" && t(a) != "object") {
        if (t(a) != "null") {
          c.appendChild(document.createTextNode(a));
        }
      } else {
        for (var k in a) {
          var v = a[k];
          if (k == "__type" && t(a) == "object") {
            c.setAttribute("__type", v);
          } else {
            if (t(v) == "object") {
              var ch = c.appendChild(document.createElementNS(null, s ? "item" : k));
              f(f, ch, v);
            } else if (t(v) == "array") {
              var ch = c.appendChild(document.createElementNS(null, s ? "item" : k));
              f(f, ch, v, true);
            } else {
              var va = document.createElementNS(null, s ? "item" : k);
              if (t(v) != "null") {
                va.appendChild(document.createTextNode(v));
              }
              var ch = c.appendChild(va);
              ch.setAttribute("type", t(v));
            }
          }
        }
      }
    };
    f(f, c, a, t(a) == "array");
    return c.outerHTML;
  }

  function download_file(name, contents, mime_type) {
    mime_type = mime_type || "text/plain";

    var blob = new Blob([contents], { type: mime_type });

    var dlink = document.createElement('a');
    dlink.download = name;
    dlink.href = window.URL.createObjectURL(blob);
    dlink.onclick = function (e) {
      // revokeObjectURL needs a delay to work properly
      var that = this;
      setTimeout(function () {
        window.URL.revokeObjectURL(that.href);
      }, 1500);
    };

    dlink.click();
    dlink.remove();
  }
  