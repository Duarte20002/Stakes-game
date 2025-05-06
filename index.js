const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const connection = require("./database");

const app = express();

// Connect to the database
connection.connect((err) => {
    if (err) {
        console.log("Error connecting to the Database: " + err);
        return;
    }
    console.log("Connected to the Database!");
});

// Middleware
app.use(session({
    secret: "mysupersecret",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 6000000000 }
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use("/", express.static("client"));

// Routes

app.post("/register", (req, res) => {
    const { username, password, confirmpassword } = req.body;

    if (password !== confirmpassword) {
        return res.send("The passwords do not match.");
    }

    connection.query(
        "insert into Stakes_digtentape.player (plr_username, plr_password, plr_searching) values (?, ?, 'idle')",
        [username, password],
        (err) => {
            if (err) return res.send(err);
            res.redirect("http://localhost:4000/login.html");
        }
    );
});

app.post("/login", (req, res) => {
    const { username_login, password_login } = req.body;

    connection.query(
        "select * from Stakes_digtentape.player where plr_username = ? and plr_password = ?",
        [username_login, password_login],
        (err, rows) => {
            if (err) return res.send(err);

            if (rows.length === 0) {
                return res.send("Player not found.");
            }

            const player = rows[0];
            req.session.username = player.plr_username;
            req.session.player_id = player.plr_id;

            res.redirect("/lobby.html");
        }
    );
});

app.get("/matchState", (req, res) => {
    if (!req.session.username) {
        return res.status(401).json({ message: "Not logged in" });
    }

    connection.query(
        "select plr_searching from Stakes_digtentape.player where plr_id = ?",
        [req.session.player_id],
        (err, rows) => {
            if (err) return res.send(err);
            if (rows.length === 0) return res.status(404).send("Player not found.");

            const state = rows[0].plr_searching;

            res.json({
                message: "Match status obtained",
                state: state === "idle" ? "NOT_IN_QUEUE" :
                       state === "queueing" ? "IN_QUEUE" :
                       state === "matched" ? "IN_GAME" : "UNKNOWN"
            });
        }
    );
});

app.post("/findMatch", (req, res) => {
    if (!req.session.username) {
        return res.status(401).json({ message: "Not logged in" });
    }

    function InitializeGame() {
        console.log('initializing game for id ' + req.session.gameID)
    // Get players' info into the game
    connection.query(
        "select plr1_id, plr2_id from Stakes_digtentape.game where game_id = ?",
        [req.session.gameID],
        (err, results) => {
            if (err) return res.send(err);
            if (results.length === 0) return res.status(404).json({ message: "Game not found" });

            const { plr1_id, plr2_id } = results[0];

    // Assign the ownership of the territories
            const allTerritoryIds = Array.from({ length: 32 }, (_, i) => i + 1);

            const territoryInserts = allTerritoryIds.map(ter_id => {
                if (ter_id === 9) return [req.session.gameID, ter_id, plr1_id, 4];
                if (ter_id === 32) return [req.session.gameID, ter_id, plr2_id, 4];

    //Make some territories neutral and assign 3 troops to points of greater interest(Ports)        
                let neutralTroops = 2;
                if (ter_id === 1) neutralTroops = 3;
                else if (ter_id === 3) neutralTroops = 3;
                else if (ter_id === 6) neutralTroops = 3;
                else if (ter_id === 10) neutralTroops = 3;
                else if (ter_id === 17) neutralTroops = 3;
                else if (ter_id === 21) neutralTroops = 3;
                else if (ter_id === 27) neutralTroops = 3;
                else if (ter_id === 30) neutralTroops = 3;
            
                return [req.session.gameID, ter_id, null, neutralTroops];
            });

    // Insert or update territory information
            const sql = "insert into Stakes_digtentape.game_territory (game_id, ter_id, plr_own_id, troop_count) values ? on duplicate key update plr_own_id = values(plr_own_id), troop_count = values(troop_count)";

                connection.query(sql, [territoryInserts], (err) => {
                    if (err) return res.send(err);

                    res.json({
                        message: "All territories attributed successfully",
                        "game_id": req.session.gameID,
                        "player_id": req.session.player_id,
                        plr1_territory: 9,
                        plr2_territory: 32,
                        initial_troops: 4,
                        neutral_troops: 2
                    });
                });
            }
        );
    }

    connection.query(
        "select * from Stakes_digtentape.player where plr_searching = 'queueing' AND plr_id != ? LIMIT 1",
        [req.session.player_id],
        (err, rows) => {
            if (err) return res.send(err);

            if (rows.length === 0) {
                connection.query(
                    "update Stakes_digtentape.player set plr_searching = 'queueing' where plr_id = ?",
                    [req.session.player_id],
                    (err) => {
                        if (err) return res.send(err);
                        res.json({ message: "Waiting for opponent", state: "IN_QUEUE" });
                    }
                );
            } else {
                const opponent = rows[0];
                connection.query(
                    "insert into Stakes_digtentape.game (plr1_id, plr2_id, cur_turn_plr_id) values (?, ?, ?)",
                    [opponent.plr_id, req.session.player_id, opponent.plr_id],
                    (err, gameResult) => {
                        if (err) return res.send(err);

                        const updateQuery = "update Stakes_digtentape.player set plr_searching = 'matched' where plr_id IN (?, ?)";

                        connection.query(updateQuery, [opponent.plr_id, req.session.player_id], (err) => {
                            if (err) return res.send(err);

                            const gameId = gameResult.insertId;
                            const plr1_id = opponent.plr_id;
                            const plr2_id = req.session.player_id;
                            req.session.gameID = gameId
                            
                            InitializeGame();
                        });

                    }
                );
            }
        }
    );
    function GetGameID() {
        connection.query(
            "select game_id from Stakes_digtentape.game where plr1_id = ? or plr2_id = ?",             //Query to get the game_id where both the players are in
            [req.session.player_id, req.session.player_id],
            (err, rows) => {
                if (err) return res.status(500).json({ message: "Database error", error: err });                       //Error scenario
                if (rows.length === 0) return res.status(404).json({ message: "No game found for this player" });      //If there is no game in which the players are in

                req.session.gameID = rows[0].game_id;                                    //Make sure the game_id is alligned with the first game_id that shows up                                            // Make sure game_id is set before calling initialize
                InitializeGame();
            }
        );
    }

    if (!req.session.gameID)
        GetGameID();
    else
    InitializeGame();
});

app.post("/quitMatch", (req, res) => {
    if (!req.session.username) {
        return res.status(401).json({ message: "Not logged in" });
    }

    connection.query(
        "update Stakes_digtentape.player set plr_searching = 'idle' where plr_id = ?",
        [req.session.player_id],
        (err) => {
            if (err) return res.send(err);
            res.json({ success: true, message: "Left queue", state: "NOT_IN_QUEUE" });
        }
    );
});

app.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log("Error destroying session:", err);
            return res.status(500).send("Could not log out.");
        }

        res.redirect("/index.html");
    });
});

app.get("/game", (req, res) => {
    if (!req.session.username){
        res.status(401).json({
            "message": "Not logged in"
        });
        return
    }

    connection.query("select * from Stakes_digtentape.game_territory", //Where Game ID = ? AND playerid 
        [],
        function (err, rows, fields) {
            if (err){
                res.json({
                    "error": err
                })
                return
            }

            res.json(rows)
        })
}) 

app.post("/verifyAdjecencies", (req, res) => {
    const { ter_ID } = req.body;

    const sql = "select adj_ter2_id from Stakes_digtentape.adjacency where adj_ter1_id = ?";    //Query to select the correspondent adjacent territory(ies) when taking into account the territory that the player innitially selects

    connection.query(sql, [ter_ID], (err, results) => {
        if (err) {
            console.error("Error obtaining adjacencies:", err);
            return res.status(500).json({ error: "Database error" });
        }

        res.json(results);
    });
});

app.post("/logAttack", (req, res) => {
    const { ter_from_id, ter_to_id, att_troop_count } = req.body;

    if (!ter_from_id || !ter_to_id || !att_troop_count) {
        return res.status(400).json({ message: "Missing parameter(s)" });
    }

    const attackingPlayerId = req.session.player_id;
    let ter_from_troop_count, ter_to_troop_count;

    function CheckForVictory(attackingPlayerId) {
        connection.query(
            "SELECT COUNT(*) AS territoryCount FROM Stakes_digtentape.game_territory WHERE game_id = ? AND plr_own_id = ?",
            [req.session.gameID, attackingPlayerId],
            (err, results) => {
                if (err) return console.error("Error checking victory:", err);
    
                const territoryCount = results[0].territoryCount;
    
                if (territoryCount === 32) {
                    req.session.winner = attackingPlayerId;
                    req.session.gameOver = true;
    
                    // ✅ Persist winner info to the database
                    connection.query(
                        "UPDATE Stakes_digtentape.game SET win_plr_id = ?, win_con = ? WHERE game_id = ?",
                        [attackingPlayerId, "all_territories", req.session.gameID],
                        (updateErr) => {
                            if (updateErr) {
                                console.error("Failed to update winner in database:", updateErr);
                            } else {
                                console.log("Winner recorded in database");
                            }
                        }
                    );
                }
            }
        );
    }
    

    function GetTerritoryData() {
        connection.query(
            "SELECT * FROM game_territory WHERE game_id = ? AND (ter_id = ? OR ter_id = ?)",
            [req.session.gameID, ter_from_id, ter_to_id],
            function (err, rows) {
                if (err) return res.status(500).json({ error: err });
                if (rows.length < 2) return res.status(404).json({ message: "Territory data not found" });

                if (ter_from_id == rows[0].ter_id) {
                    ter_from_troop_count = rows[0].troop_count;
                    ter_to_troop_count = rows[1].troop_count;
                } else {
                    ter_from_troop_count = rows[1].troop_count;
                    ter_to_troop_count = rows[0].troop_count;
                }

                if (att_troop_count < 1 || att_troop_count > 3 || att_troop_count >= ter_from_troop_count) {
                    return res.status(400).json({ message: "Invalid attacking troop count" });
                }

                InsertInfo();
            }
        );
    }

    function InsertInfo() {
        connection.query(
            "SELECT plr_own_id FROM game_territory WHERE game_id = ? AND ter_id = ?",
            [req.session.gameID, ter_to_id],
            (err, result) => {
                if (err) return res.status(500).json({ message: "Error obtaining defender ID", error: err });

                const defendingPlayerId = result[0]?.plr_own_id || null;

                const attackerRolls = Array.from({ length: att_troop_count }, () => Math.floor(Math.random() * 6) + 1).sort((a, b) => b - a);
                const defenderDiceCount = Math.min(2, ter_to_troop_count);
                const defenderRolls = Array.from({ length: defenderDiceCount }, () => Math.floor(Math.random() * 6) + 1).sort((a, b) => b - a);

                const comparisons = Math.min(attackerRolls.length, defenderRolls.length);
                let attackerLosses = 0;
                let defenderLosses = 0;

                for (let i = 0; i < comparisons; i++) {
                    if (attackerRolls[i] > defenderRolls[i]) {
                        defenderLosses++;
                    } else {
                        attackerLosses++;
                    }
                }

                const newAttackerTroops = ter_from_troop_count - attackerLosses;
                let newDefenderTroops = ter_to_troop_count - defenderLosses;

                connection.query(
                    "INSERT INTO dice_rolls (game_id, ter_from_id, ter_to_id, plr_att_id, plr_def_id, att_die, def_die, att_troops, def_troops) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    [
                        req.session.gameID,
                        ter_from_id,
                        ter_to_id,
                        attackingPlayerId,
                        defendingPlayerId,
                        JSON.stringify(attackerRolls),
                        JSON.stringify(defenderRolls),
                        ter_from_troop_count,
                        ter_to_troop_count
                    ],
                    (err) => {
                        if (err) return res.status(500).json({ message: "Error logging dice rolls", error: err });

                        connection.query(
                            "UPDATE game_territory SET troop_count = ? WHERE game_id = ? AND ter_id = ?",
                            [newAttackerTroops, req.session.gameID, ter_from_id],
                            (err) => {
                                if (err) return res.status(500).json({ message: "Failed to update attacker troops", error: err });

                                connection.query(
                                    "UPDATE game_territory SET troop_count = ? WHERE game_id = ? AND ter_id = ?",
                                    [Math.max(0, newDefenderTroops), req.session.gameID, ter_to_id],
                                    (err) => {
                                        if (err) return res.status(500).json({ message: "Failed to update defender troops", error: err });

                                        if (newDefenderTroops <= 0) {
                                            const troopsToMove = Math.min(att_troop_count - attackerLosses, newAttackerTroops - 1);
                                            const newAttackerFinal = newAttackerTroops - troopsToMove;

                                            req.session.justConquered = true;

                                            connection.query(
                                                "UPDATE game_territory SET troop_count = ? WHERE game_id = ? AND ter_id = ?",
                                                [newAttackerFinal, req.session.gameID, ter_from_id],
                                                (err) => {
                                                    if (err) return res.status(500).json({ message: "Failed to update attacker after conquest", error: err });

                                                    connection.query(
                                                        "UPDATE game_territory SET plr_own_id = ?, troop_count = ? WHERE game_id = ? AND ter_id = ?",
                                                        [attackingPlayerId, troopsToMove, req.session.gameID, ter_to_id],
                                                        (err) => {
                                                            if (err) return res.status(500).json({ message: "Failed to transfer territory", error: err });

                                                            CheckForVictory(attackingPlayerId);

                                                            return res.json({
                                                                message: "Territory conquered",
                                                                attackerRolls,
                                                                defenderRolls,
                                                                attackerLosses,
                                                                defenderLosses,
                                                                territoryCaptured: true,
                                                                troopsMoved: troopsToMove
                                                            });
                                                        }
                                                    );
                                                }
                                            );
                                        } else {
                                            return res.json({
                                                message: "Attack resolved",
                                                attackerRolls,
                                                defenderRolls,
                                                attackerLosses,
                                                defenderLosses,
                                                territoryCaptured: false
                                            });
                                        }
                                    }
                                );
                            }
                        );
                    }
                );
            }
        );
    }

    function GetGameID() {
        connection.query(
            "SELECT game_id FROM Stakes_digtentape.game WHERE plr1_id = ? OR plr2_id = ?",
            [req.session.player_id, req.session.player_id],
            (err, rows) => {
                if (err) return res.status(500).json({ message: "Database error", error: err });
                if (rows.length === 0) return res.status(404).json({ message: "No game found for this player" });

                req.session.gameID = rows[0].game_id;
                GetTerritoryData();
            }
        );
    }

    if (!req.session.gameID)
        GetGameID();
    else
        GetTerritoryData();
});

app.post("/reinforce", (req, res) => {
    if (!req.session.username) {
        return res.status(401).json({ success: false, message: "Not logged in." });
    }

    const { territory_id, troops } = req.body;

    if (!territory_id || !troops || troops <= 0) {
        return res.status(400).json({ success: false, message: "Invalid input." });
    }

    // Make sure the player owns the territory
    connection.query(
        "SELECT * FROM Stakes_digtentape.game_territory WHERE ter_id = ? AND plr_own_id = ?",
        [territory_id, req.session.player_id],
        (err, rows) => {
            if (err) return res.status(500).json({ success: false, message: "Database error." });

            if (rows.length === 0) {
                return res.status(403).json({ success: false, message: "You do not own this territory." });
            }

            // Update troop count
            connection.query(
                "UPDATE Stakes_digtentape.game_territory SET troop_count = troop_count + ? WHERE ter_id = ?",
                [troops, territory_id],
                (err) => {
                    if (err) return res.status(500).json({ success: false, message: "Failed to reinforce." });

                    return res.json({ success: true, message: `Successfully reinforced with ${troops} troops!` });
                }
            );
        }
    );
});


app.post("/giveCard", (req, res) => {

    connection.query("SELECT crd_id FROM cards WHERE crd_id BETWEEN 9 AND 11 ORDER BY RAND() LIMIT 1", (err, results) => {
        if (err) {
            console.error("Error selecting card:", err);
            return res.status(500).send("Database error");
        }

        if (results.length === 0) return res.status(404).send("No cards available");

        const card_id = results[0].crd_id;

        connection.query(
            "INSERT INTO player_cards (plr_id, crd_id, game_id, is_used) VALUES (?, ?, ?, 0)",
            [req.session.player_id, card_id, req.session.gameID],
            (insertErr) => {
                if (insertErr) {
                    console.error("Error inserting card:", insertErr);
                    return res.status(500).send("Failed to assign card");
                }
                connection.query(
                    "SELECT * FROM cards WHERE crd_id = ?",
                    [card_id],
                    (fetchErr, cardResults) => {
                        if (fetchErr || cardResults.length === 0) {
                            return res.status(500).send("Failed to fetch card details");
                        }
                        req.session.cardToUse = card_id;
                        res.status(200).json({
                            message: "Card granted",
                            card: cardResults[0]
                        });
                    }
                );
            }
        );
    });
});

app.post("/endTurn", (req, res) => {
    if (!req.session.player_id) {
        return res.status(401).json({ message: "Not logged in." });
    }



    function EndTurn(){
        // Get the current game to determine whose turn it is
        connection.query(
            "SELECT plr1_id, plr2_id, cur_turn_plr_id FROM Stakes_digtentape.game WHERE game_id = ?",
            [req.session.gameID],
            (err, results) => {
                if (err || results.length === 0) {
                    return res.status(500).json({ message: "Game not found." });
                }

                const { plr1_id, plr2_id, cur_turn_plr_id } = results[0];
                const nextTurn = cur_turn_plr_id === plr1_id ? plr2_id : plr1_id;

                connection.query(
                    "UPDATE Stakes_digtentape.game SET cur_turn_plr_id = ? WHERE game_id = ?",
                    [nextTurn, req.session.gameID],
                    (updateErr) => {
                        if (updateErr) return res.status(500).json({ message: "Failed to end turn." });
                        res.json({ message: "Turn ended successfully." });
                    }
                );
            }
        );
    }


    function GetGameID() {
        connection.query(
            "select game_id from Stakes_digtentape.game where plr1_id = ? or plr2_id = ?",             //Query to get the game_id where both the players are in
            [req.session.player_id, req.session.player_id],
            (err, rows) => {
                if (err) return res.status(500).json({ message: "Database error", error: err });                       //Error scenario
                if (rows.length === 0) return res.status(404).json({ message: "No game found for this player" });      //If there is no game in which the players are in

                req.session.gameID = rows[0].game_id;                                    //Make sure the game_id is alligned with the first game_id that shows up                                            // Make sure game_id is set before calling initialize
                EndTurn();
            }
        );
    }

    if (!req.session.gameID)
        GetGameID()
    else
        EndTurn();
});

// function NewGetGameID(request, callback){
//     connection.query(
//         "select game_id from Stakes_digtentape.game where plr1_id = ? or plr2_id = ?",             //Query to get the game_id where both the players are in
//         [request.session.player_id, request.session.player_id],
//         (err, rows) => {
//             if (err) return res.status(500).json({ message: "Database error", error: err });                       //Error scenario
//             if (rows.length === 0) return res.status(404).json({ message: "No game found for this player" });      //If there is no game in which the players are in

//             request.session.gameID = rows[0].game_id;                                    //Make sure the game_id is alligned with the first game_id that shows up                                            // Make sure game_id is set before calling initialize
//             callback();
//         }
//     );
// }

app.get("/isMyTurn", (req, res) => {
    if (!req.session.player_id) {
        return res.status(401).json({ message: "Not logged in." });
    }

    function CheckTurn() {
        connection.query(
            "SELECT cur_turn_plr_id FROM Stakes_digtentape.game WHERE game_id = ?",
            [req.session.gameID],
            (err, results) => {
                if (err || results.length === 0) {
                    return res.status(500).json({ message: "Game not found." });
                }

                const isMyTurn = results[0].cur_turn_plr_id === req.session.player_id;
                res.json({ isMyTurn });
            }
        );
    }

    function GetGameID() {
        connection.query(
            "SELECT game_id FROM Stakes_digtentape.game WHERE plr1_id = ? OR plr2_id = ?",
            [req.session.player_id, req.session.player_id],
            (err, rows) => {
                if (err) return res.status(500).json({ message: "Database error", error: err });
                if (rows.length === 0) return res.status(404).json({ message: "No game found for this player" });

                req.session.gameID = rows[0].game_id;
                CheckTurn();
            }
        );
    }

    if (!req.session.gameID)
        GetGameID();
    else
        CheckTurn();
});

app.get("/hasCard", (req, res) => {
    if (!req.session.player_id) {
        return res.status(401).json({ message: "Not logged in." });
    }

    function CheckForCard() {
        const query = `
            SELECT * FROM Stakes_digtentape.player_cards 
            WHERE plr_id = ? AND game_id = ? AND is_used = 0
            LIMIT 1
        `;

        connection.query(query, [req.session.player_id, req.session.gameID], (err, results) => {
            if (err) return res.status(500).json({ error: "Database error" });

            if (results.length === 0) {
                return res.json({ hasCard: false });
            }

            // Store the card id in session
            req.session.cardToUse = results[0].crd_id;
            res.json({ hasCard: true });
        });
    }

    function GetGameID() {
        connection.query(
            "SELECT game_id FROM Stakes_digtentape.game WHERE plr1_id = ? OR plr2_id = ?",
            [req.session.player_id, req.session.player_id],
            (err, rows) => {
                if (err) return res.status(500).json({ error: "Database error", err });
                if (rows.length === 0) return res.status(404).json({ message: "No game found." });

                req.session.gameID = rows[0].game_id;
                CheckForCard();
            }
        );
    }

    if (!req.session.gameID)
        GetGameID();
    else
        CheckForCard();
});

app.post("/useCard", (req, res) => {
    if (!req.session.player_id) {
        return res.status(401).json({ message: "Not logged in." });
    }

    function UseCard() {
        if (!req.session.cardToUse) {
            return res.status(400).json({ message: "No card to use." });
        }

        const query = `
            UPDATE Stakes_digtentape.player_cards 
            SET is_used = 1 
            WHERE plr_id = ? AND game_id = ? AND crd_id = ? AND is_used = 0
        `;

        connection.query(
            query,
            [req.session.player_id, req.session.gameID, req.session.cardToUse],
            (err) => {
                if (err) return res.status(500).json({ error: "Failed to mark card as used." });

                req.session.cardToUse = null;
                res.json({ success: true, message: "Card used successfully." });
            }
        );
    }

    function GetGameID() {
        connection.query(
            "SELECT game_id FROM Stakes_digtentape.game WHERE plr1_id = ? OR plr2_id = ?",
            [req.session.player_id, req.session.player_id],
            (err, rows) => {
                if (err) return res.status(500).json({ error: "Database error", err });
                if (rows.length === 0) return res.status(404).json({ message: "No game found." });

                req.session.gameID = rows[0].game_id;
                UseCard();
            }
        );
    }

    if (!req.session.gameID)
        GetGameID();
    else
        UseCard();
});

app.get("/checkVictory", (req, res) => {

    if (!req.session.player_id || !req.session.gameID) {
        return res.status(401).json({ message: "Not logged in or no game." });
    }

    if (!req.session.gameOver) {
        return res.json({ gameOver: false });
    }

    const isWinner = req.session.player_id === req.session.winner;
    return res.json({ gameOver: true, isWinner });
});


app.listen(4000, () => {
    console.log("Server running on http://localhost:4000/");
});