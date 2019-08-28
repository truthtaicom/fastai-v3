var el = x => document.getElementById(x);

function showPicker() {
  el("file-input").click();
}

function showPicked(input) {
  el("upload-label").innerHTML = input.files[0].name;
  var reader = new FileReader();
  reader.onload = function(e) {
    el("image-picked").src = e.target.result;
    el("image-picked").className = "";
  };
  reader.readAsDataURL(input.files[0]);
}

function analyze() {
  var uploadFiles = el("file-input").files;
  if (uploadFiles.length !== 1) alert("Please select a file to analyze!");

  el("analyze-button").innerHTML = "Analyzing...";
  var xhr = new XMLHttpRequest();
  var loc = window.location;
  xhr.open("POST", `${loc.protocol}//${loc.hostname}:${loc.port}/analyze`,
    true);
  xhr.onerror = function() {
    alert(xhr.responseText);
  };
  xhr.onload = function(e) {
    if (this.readyState === 4) {
      var response = JSON.parse(e.target.responseText);
      try {
        j = response["result"];
        const l = j.find(elm => elm[1] > 0.7)
        if(l) {
          el("result-label").innerHTML = `
              Result = ${l[0]}
              ${j.map(elm => `<p>${elm[0]}: ${elm[1]}</p>`)}
          `;
        } else {
          el("result-label").innerHTML = `
              😂 I dont know this guy !
              ${j.map(elm => `<p>${elm[0]}: ${elm[1]}</p>`)}
          `;
        }
        
      } catch(error) {
        el("result-label").innerHTML = `😂 I dont know what happend !`;
      }
      
    }
    el("analyze-button").innerHTML = "Analyze";
  };

  var fileData = new FormData();
  fileData.append("file", uploadFiles[0]);
  xhr.send(fileData);
}

