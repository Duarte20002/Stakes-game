function FindMatch() {

    const audio = document.getElementById("welcome-audio");
    if (audio) {
        audio.volume = 0.5;
        audio.loop = true;
        audio.play().catch((err) => console.warn("Failed to play audio:", err));
    }

    sessionStorage.clear();

    var request = new XMLHttpRequest();

    request.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                var data = JSON.parse(this.responseText);
                console.log("Match search response:", data);
            } else {
                console.error("Error finding match:", this.responseText);
            }
        }
    };

    request.open("POST", "/findMatch", true);
    request.send();
}

function QuitMatch() {
    var request = new XMLHttpRequest();

    const audio = document.getElementById("welcome-audio");
    if (audio) {
        audio.pause();
        audio.currentTime = 0;
    }

    request.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                var data = JSON.parse(this.responseText);
                console.log("Quit match response:", data);
                document.getElementById("find-match").style.display = "block";
                document.getElementById("quit-match").style.display = "none";
            } else {
                console.error("Error quitting match:", this.responseText);
            }
        }
    };

    request.open("POST", "/quitMatch", true);
    request.send();
}

function Logout() {
    var request = new XMLHttpRequest();

    request.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status === 200 || this.status === 302) {
                sessionStorage.clear();
                window.location.href = this.responseURL || "/login.html";
            } else {
                console.error("Logout failed.");
            }
        }
    };

    request.open("GET", "/logout", true);
    request.send();
}

function GetMatchState() {
    var request = new XMLHttpRequest();

    request.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                var data = JSON.parse(this.responseText);
                console.log("Match state:", data);

                if (data.state === "NOT_IN_QUEUE") {
                    document.getElementById("find-match").style.display = "block";
                    document.getElementById("quit-match").style.display = "none";
                } else if (data.state === "IN_QUEUE") {
                    document.getElementById("find-match").style.display = "none";
                    document.getElementById("quit-match").style.display = "block";
                } else if (data.state === "IN_GAME") {
                    window.location.href = "/game2";
                }


            } else if (this.status == 401) {
                window.location.href = "login.html";
            } else {
                console.error("Unexpected response:", this.responseText);
            }
        }
    };

    request.open("GET", "/matchState", true);
    request.send();
}


GetMatchState();
setInterval(GetMatchState, 3000);