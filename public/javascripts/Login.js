function onSignIn(googleUser) {
    // Useful data for your client-side scripts:
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
        document.getElementById("userId").textContent = "Welcome " + profile.getName();
    };
    xhr.onerror = function(){
        console.log('Request to server to verify user failed with error: ' + xhr.errorMessage);
    };
    xhr.send('idtoken=' + id_token);
}
function signOut() {
    var auth2 = gapi.auth2.getAuthInstance()
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

