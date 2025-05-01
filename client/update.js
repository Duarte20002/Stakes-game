function makeRequest(){
    var username = document.getElementById("username_login").value
    var password = document.getElementById("password_login").value

    console.log("Try to log in with " + username + " | " + password)

    // Create a JSON object with the username and password
    var dataToSend = {
        "username": username,
        "password": password
    }

    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (this.readyState == 4){
            // When the request is done, parse the response to JSON.
            var data = JSON.parse(this.response)

            // Log the response to the console of the browser.
            console.log(data)

            if (this.status == 200){
                // If status is 200, redirect to the game page since everything is OK and the user is logged in
                window.location.href = "/game.html"
            }else{
                // If status is not 200, show the error message
                document.getElementById("message").innerHTML = data.message
            }
        }
    }

    // Open the request with POST method and URL /login
    request.open("POST", "/login", true);

    // Set the request header to JSON
    request.setRequestHeader("Content-Type", "application/json");

    // Send the request with the data. Stringify will convert the JSON object to a string.
    request.send(JSON.stringify(dataToSend));
}