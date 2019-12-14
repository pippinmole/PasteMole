//
// Author: Jonathan Ruffles
// Libraries used: Ace
//
//
//
//
//

var editor;

function OnLoad() {
  // ace.js
  editor = ace.edit("editor");

  // Default the theme of the editor
  // TODO: make a dropdown for this
  editor.setTheme("ace/theme/twilight");

  // Default the text area to empty string
  editor.setValue($("#editor").val());

  // Set the mode of the current session
  // TODO: Move this to a function so that I can have a dropdown for all the different code modes
  editor.session.setMode("ace/mode/plain_text");
}

function SubmitCode() {

  if(editor == null) {
    console.log("Editor is null. Please report this.");
    return;
  }

  var content = editor.getValue();

  // Clean content of the codePastingArea
  if(content == undefined || content == "") {
    console.log("You should enter something into the code block before sending it!");
    return;
  }

  // Else, return all this to the server

  // Store the data we're sending to the server
  // let data = {
  //   url: "X6LF43",
  //   code: "let x = 5;",
  //   codeType: "javascript"
  // }
  const data = {
    code: content,
    codeType: $(".codeTypeSelector").val()
  };

  console.log(data.code);
  console.log(JSON.stringify(data));

  // Store the different sending options to the server
  const options = {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data),
    strictSSL: false
  };

  fetch("/", options).then(OnFetchResponse);

  console.log("Sending the data to the server...");
};

async function OnFetchResponse(response) {

  const json = await response.json();

  const redirectURL = json.redirectRoute;

  console.log("Redirecting to: " + redirectURL);

  // redirect
  window.location.href = redirectURL; //relative to domain
}

// UI Callbacks
function OnCodeTypeSelectorChanged() {
  const value = $(".codeTypeSelector").val();
  // ace/mode/javascript
  editor.session.setMode("ace/mode/" + value);

  console.log("ace/mode/" + value);
}
