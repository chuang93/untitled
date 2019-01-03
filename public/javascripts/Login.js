function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    ID = profile.getId(); // Don't send this directly to your server!
    console.log('Google Authenticated | Full Name: ' + profile.getName());
    // The ID token you need to pass to your backend:
    var id_token = googleUser.getAuthResponse().id_token;
    var xhr = new XMLHttpRequest();
    verifyURL = window.serverURL + "login";
    xhr.open('POST', verifyURL);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function() {
        //load values of users if successful.
        console.log("Successfully Validated User ID Token in backend server.");
        refreshValues();
    };
    xhr.onerror = function(){
        console.log('Request to server to verify user failed with error: ' + xhr.errorMessage);
    };
    xhr.send('idtoken=' + id_token);
}
function signOut() { //only allow function to be visible and called when no user is logged in.
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        var xhr = new XMLHttpRequest();
        verifyURL = window.serverURL + "logout";
        xhr.open('GET', verifyURL);
        xhr.onload = function() {
            console.log('User signed out.');
            document.getElementById("userId").textContent = "Not Logged in.";
        };
        xhr.onerror = function(){
            console.log('Server error, sign out failed: ' + xhr.errorMessage);
        };
        xhr.send();
    });
}

function refreshValues() {
    if (auth2){
        console.log('Reloading user values on client.');
        currentGoogleUser = auth2.currentUser.get();
        document.getElementById('userId').innerText =
            JSON.stringify(currentGoogleUser, undefined, 2);
        document.getElementById('loginState').innerText =
            auth2.isSignedIn.get();
        updateGoogleUser();
    }
}

