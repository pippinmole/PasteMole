//
// Author: Jonathan Ruffles
// Libraries used: Ace
//
//
//
//
//

const CODE_CHARACTER_LENGTH_MAX = 100000; // 100k

var editor;

function OnLoad() {

  // ace.js
  editor = ace.edit("editor");

  // Default the theme of the editor
  // TODO: make a dropdown for this
  editor.setTheme("ace/theme/twilight");

  // Default the text area to empty string
  editor.setValue(decodeURI($("#editor").val()));

  // Set the mode of the current session
  // TODO: Move this to a function so that I can have a dropdown for all the different code modes
  editor.session.setMode("ace/mode/plain_text");
}

function SubmitCode() {

  if(editor == null) {
    console.log("Editor is null. Please report this.");
    return;
  }

  const _pasteName = $(".paste_name").val();
  const _pasteDescription = $(".paste_description").val();
  const _code = editor.getValue();
  const _codeType = $(".codeTypeSelector").val();
  const _passworded = $(".paste_passworded")[0].checked;
  const _password = $(".paste_passwordfield").val();

  if(_passworded && _password == "") {
    const errorMessage = "You should enter a password, or uncheck 'Passworded'!";

    console.log(errorMessage);
    $("#error_message").html(errorMessage);
    return;
  } else {
    $("#error_message").html("");
  }

  // Clean content of the codePastingArea
  if(_code == undefined || _code == "") {
    const errorMessage = "You should enter something into the code block before sending it!";

    console.log(errorMessage);
    $("#error_message").html(errorMessage);
    return;
  } else if(_code.length > CODE_CHARACTER_LENGTH_MAX) {

    const errorMessage = "Code character length should be less than 10,000"

    console.log(errorMessage);
    $("#error_message").html(errorMessage);
    return;
  } else {
    $("#error_message").html("");
  }

  // Else, return all this to the server

  // Store the data we're sending to the server
  // let data = {
  //   url: "X6LF43",
  //   code: "let x = 5;",
  //   codeType: "javascript"
  // }

  let _pasteData = {
    pasteName: _pasteName,
    pasteDescription: _pasteDescription,
    code: _code,
    codeType: _codeType
  };

  // Assumed password content
  if(_passworded) {
    // Encrypt paste
    _pasteData = CryptoJS.AES.encrypt(JSON.stringify(_pasteData), _password).toString();
  }
  
  const data = {
    pasteData: _pasteData,
    passworded: _passworded
  };

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


function OnPasswordInputChanged() {

  const value = $(".paste_passworded")[0].checked;

  console.log("Passworded: " + value);

  // Enable/disable password box
  $(".paste_passwordGroup")[0].style.visibility = value ? "visible" : "hidden";

}