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
    const { ter_from_id, ter_to_id, att_troop_count } = req.body;          //Extract the id's of the attacking and defending territories, game_ID and how many troops the player is attacking with.

    if (!ter_from_id || !ter_to_id || !att_troop_count) {               //In case of any of the parameters are missing.
        return res.status(400).json({ message: "Missing parameter(s)" });
    }

    const attackingPlayerId = req.session.player_id;
    let ter_from_troop_count, ter_to_troop_count;


    function GetTerritoryData() {               // Get the data from both of the territories
        connection.query(
            "SELECT * FROM game_territory WHERE game_id = ? AND (ter_id = ? OR ter_id = ?)",
            [req.session.gameID, ter_from_id, ter_to_id],
            function (err, rows) {
                if (err) return res.status(500).json({ error: err });

                if (rows.length < 2) return res.status(404).json({ message: "Territory data not found" });

                if (ter_from_id == rows[0].ter_id) {                    //Determine which of the territories is the attacker
                    ter_from_troop_count = rows[0].troop_count;
                    ter_to_troop_count = rows[1].troop_count;
                } else {
                    ter_from_troop_count = rows[1].troop_count;
                    ter_to_troop_count = rows[0].troop_count;
                }

                if (att_troop_count < 1 || att_troop_count > 3 || att_troop_count >= ter_from_troop_count) {        //Makes sure the player can't attack with more troops that he is actually able to
                    return res.status(400).json({ message: "Invalid attacking troop count" });
                }

                InsertInfo();
            }
        );
    }


    function InsertInfo() {
        connection.query(
            "SELECT plr_own_id FROM game_territory WHERE game_id = ? AND ter_id = ?",               //Get the defending player's id in order to correctly storage the dice rolls
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

                // Insert dice rolls into dice_rolls table
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

                        // Update attacking territory troop count
                        connection.query(
                            "UPDATE game_territory SET troop_count = ? WHERE game_id = ? AND ter_id = ?",
                            [newAttackerTroops, req.session.gameID, ter_from_id],
                            (err) => {
                                if (err) return res.status(500).json({ message: "Failed to update attacker troops", error: err });

                                // Update defending territory troop count
                                connection.query(
                                    "UPDATE game_territory SET troop_count = ? WHERE game_id = ? AND ter_id = ?",
                                    [Math.max(0, newDefenderTroops), req.session.gameID, ter_to_id],
                                    (err) => {
                                        if (err) return res.status(500).json({ message: "Failed to update defender troops", error: err });

                                        // Check if a territory was conquered
                                        if (newDefenderTroops <= 0) {
                                            const troopsToMove = Math.min(att_troop_count - attackerLosses, newAttackerTroops - 1);
                                            const newAttackerFinal = newAttackerTroops - troopsToMove;

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
                                                    
                                                            // Grant random card to attacker
                                                            connection.query("SELECT crd_id FROM cards ORDER BY RAND() LIMIT 1", (err, cardResult) => {
                                                                if (err) return res.status(500).json({ message: "Failed to fetch random card", error: err });
                                                    
                                                                const cardId = cardResult[0]?.card_id;
                                                                if (!cardId) return res.status(500).json({ message: "No card found" });
                                                    
                                                                connection.query(
                                                                    "INSERT INTO player_cards (plr_id, crd_id, is_used) VALUES (?, ?, false)",
                                                                    [attackingPlayerId, cardId],
                                                                    (err) => {
                                                                        if (err) return res.status(500).json({ message: "Failed to assign card", error: err });
                                                    
                                                                        return res.json({
                                                                            message: "Territory conquered and card assigned",
                                                                            attackerRolls,
                                                                            defenderRolls,
                                                                            attackerLosses,
                                                                            defenderLosses,
                                                                            territoryCaptured: true,
                                                                            troopsMoved: troopsToMove,
                                                                            cardAwarded: cardId
                                                                        });
                                                                    }
                                                                );
                                                            });
                                                        }
                                                    );
                                                    
                                                }
                                            );
                                        } else {
                                            // If an attack was successfull but no territory was conquered
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
            "select game_id from Stakes_digtentape.game where plr1_id = ? or plr2_id = ?",             //Query to get the game_id where both the players are in
            [req.session.player_id, req.session.player_id],
            (err, rows) => {
                if (err) return res.status(500).json({ message: "Database error", error: err });                       //Error scenario
                if (rows.length === 0) return res.status(404).json({ message: "No game found for this player" });      //If there is no game in which the players are in

                req.session.gameID = rows[0].game_id;                                    //Make sure the game_id is alligned with the first game_id that shows up                                            // Make sure game_id is set before calling initialize
                GetTerritoryData();
            }
        );
    }

    if (!req.session.gameID)
        GetGameID();
    else
        GetTerritoryData();
});




app.listen(4000, () => {
    console.log("Server running on http://localhost:4000/");
});