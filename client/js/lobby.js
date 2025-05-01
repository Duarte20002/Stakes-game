function FindMatch() {
    var request = new XMLHttpRequest();

    request.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                var data = JSON.parse(this.responseText);
                console.log("Match search response:", data);
                // You can update UI or messages here if you like
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
    const request = new XMLHttpRequest();
    request.open("GET", "/logout", true);

    request.onload = function () {
        if (request.status >= 200 && request.status < 300) {
            if (request.responseURL && request.responseURL !== window.location.href) {
                sessionStorage.clear();
                window.location.href = request.responseURL; // Redirects to index.html
            } else {
                console.error("Logout failed.");
            }
        } else {
            console.error("Logout failed with status:", request.status);
        }
    };

    request.onerror = function () {
        console.error("Logout error: Request failed.");
    };

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
                    window.location.href = "/game.html";
                }

                document.getElementById("username_login").innerText = data.username;
                document.getElementById("win-rate").innerText = data.winrate;

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

// app.post('/startgame', async (req, res) => {
//     const { plr1_id, plr2_id } = req.body;

//     try {
//         // 1. Create game entry
//         const [gameResult] = await db.promise().execute(
//             `insert into game (plr1_id, plr2_id, cur_turn_plr_id)
//              values (?, ?, ?)`,
//             [plr1_id, plr2_id, plr1_id]
//         );
//         const game_id = gameResult.insertId;

//         // 2. Assign territories
//         await db.promise().execute(
//             `insert into game_territory (game_id, territory_id, owner_id, troop_count)
//              values (?, 9, ?, 5), (?, 32, ?, 5)`,
//             [game_id, plr1_id, game_id, plr2_id]
//         );

//         res.json({ success: true, game_id });
//     } catch (err) {
//         console.error("Error initializing game:", err);
//         res.status(500).json({ success: false, error: err.message });
//     }
// });


GetMatchState();
setInterval(GetMatchState, 3000);