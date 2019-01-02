function onSignIn(googleUser) {
    // Useful data for your client-side scripts:
    var profile = googleUser.getBasicProfile();
    console.log("ID: " + profile.getId()); // Don't send this directly to your server!
    console.log('Full Name: ' + profile.getName());
    console.log('Given Name: ' + profile.getGivenName());
    console.log('Family Name: ' + profile.getFamilyName());
    console.log("Image URL: " + profile.getImageUrl());
    console.log("Email: " + profile.getEmail());

    // The ID token you need to pass to your backend:
    var id_token = googleUser.getAuthResponse().id_token;
    console.log("ID Token: " + id_token);
    var xhr = new XMLHttpRequest();
    verifyURL = window.serverURL + "login";
    console.log(verifyURL);
    xhr.open('POST', verifyURL);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function() {
        console.log(xhr.response);
        document.getElementById("userId").textContent = "Welcome " + profile.getName();
    };
    xhr.onerror = function(){
        console.log('Request to server to verify user failed with error: ' + xhr.errorMessage);
    };
    xhr.send('idtoken=' + id_token);
}
function signOut() {
    console.log("attempting to signout");
    var auth2 = gapi.auth2.getAuthInstance()
    auth2.signOut().then(function () {
        console.log('User signed out.');
        document.getElementById("userId").textContent = "";
    });
}

