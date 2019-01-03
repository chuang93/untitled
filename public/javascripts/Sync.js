window.syncSession = function() {
    console.log("setting up listeners");
    window.auth2 = gapi.auth2.getAuthInstance();
    window.auth2.isSignedIn.listen(signinChanged);
    window.auth2.currentUser.listen(userChanged);
};

function signinChanged (state) {
    console.log('Signin state changed to ', state);
    //if sign in state changes to false then destroy the session.
    if (auth2.isSignedIn.get() == false) {
        console.log("State Changed to False; clearing session");
        clearSession();
    }
    document.getElementById('loginState').innerText = state;
}

function userChanged (user) {
    console.log('User now: ', user);
    currentGoogleUser = user;
    updateGoogleUser();
    document.getElementById('userId').innerText =
        JSON.stringify(user, undefined, 2);
}

function updateGoogleUser() {
    if (currentGoogleUser) {
        document.getElementById('userId').innerText =
            JSON.stringify(currentGoogleUser, undefined, 2);
    } else {
        document.getElementById('userId').innerText =
            "updateGoogleUSer called but no google user supplied.";
    }
}

function clearSession(){
    var xhr = new XMLHttpRequest();
    verifyURL = window.serverURL + "clear";
    xhr.open('GET', verifyURL);
    xhr.onload = function() {
        console.log('User Session Cleared');
    };
    xhr.onerror = function(){
        console.log('User Session could not be cleared: ' + xhr.errorMessage);
    };
    xhr.send();
}

