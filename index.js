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
                       state === "matched" ? "IN_GAME" : "UNKNOWN",
            });
        }
    );
});

app.post("/findMatch", (req, res) => {
    if (!req.session.username) {
        return res.status(401).json({ message: "Not logged in" });
    }

    function InitializeGame() {
        console.log("initializing game for id " + req.session.gameID);
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

                const territoryinserts = allTerritoryIds.map(ter_id => {
                    if (ter_id === 9) return [req.session.gameID, ter_id, plr1_id, 4];
                    if (ter_id === 32) return [req.session.gameID, ter_id, plr2_id, 4];

                    // Make some territories neutral and assign 3 troops to points of greater interest (Ports)
                    let neutralTroops = 2;
                    if ([1, 3, 6, 10, 17, 21, 27, 30].includes(ter_id)) {
                        neutralTroops = 3;
                    }

                    return [req.session.gameID, ter_id, null, neutralTroops];
                });

                // insert or update territory information
                const sql = "insert into Stakes_digtentape.game_territory (game_id, ter_id, plr_own_id, troop_count) values ? on duplicate key update plr_own_id = values(plr_own_id), troop_count = values(troop_count)";

                connection.query(sql, [territoryinserts], (err) => {
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

    function CheckOngoingGames() {
        connection.query(
                "select * from Stakes_digtentape.player where plr_searching = 'queueing' and plr_id != ? limit 1",
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
                                    req.session.gameID = gameId;

                                    InitializeGame();
                                });
                            }
                        );
                    }
                }
            );
    }
    

    function GetGameID() {
        // [Cesar Note] TODO: Check if the match IS NOT finished already. (should have something like win_plr_id = null )
        connection.query(
            "select game_id from Stakes_digtentape.game where win_plr_id is null and (plr1_id = ? or plr2_id = ?)",
            [req.session.player_id, req.session.player_id],
            (err, rows) => {
                if (err) return res.status(500).json({ message: "Database error", error: err });
                if (rows.length === 0) {
                    CheckOngoingGames()
                }else{
                    req.session.gameID = rows[0].game_id;
                    res.json({"message": "Already in game"})
                    // CheckOngoingGames();
                }
            }
        );
    }

    if (!req.session.gameID)
        GetGameID();
    else
        CheckOngoingGames();
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

        res.redirect("/login.html");
    });
});

app.get("/game", (req, res) => {
    if (!req.session.player_id){
        res.status(401).json({
            "message": "Not logged in"
        });
        return
    }

    function GrabTerritoryData(){

        connection.query("select * from Stakes_digtentape.game_territory where game_id = ?", //where Game ID = ? and playerid 
            [req.session.gameID],
            function (err, rows, fields) {
                if (err){
                    res.json({
                        "error": err
                    })
                    return
                }
    
                GrabPlayerCards(rows)
            })
    }

    function GrabPlayerCards(territories){

        connection.query("select * from player_cards inner join cards on cards.crd_id = player_cards.crd_id where game_id = ? and plr_id = ? and is_used = 0", [req.session.gameID, req.session.player_id],
            function (err, cards, fields) {
                if (err) return res.status(500).json({error: err})

                res.json({
                    "territories": territories,
                    "cards": cards
                })
            }
        )

    }

    function GetGameID(){
            connection.query(
                "select game_id from Stakes_digtentape.game where win_plr_id is null and (plr1_id = ? or plr2_id = ?)",             //Query to get the game_id where both the players are in
                [req.session.player_id, req.session.player_id],
                (err, rows) => {
                    if (err) return res.status(500).json({ message: "Database error", error: err });                       //Error scenario
                    if (rows.length === 0) return res.status(404).json({ message: "No game found for this player: " + req.session.player_id });      //If there is no game in which the players are in
    
                    req.session.gameID = rows[0].game_id;                                    //Make sure the game_id is alligned with the first game_id that shows up                                            // Make sure game_id is set before calling initialize
                    GrabTerritoryData();
                }
            );
    }

    if (!req.session.gameID)
        GetGameID()
    else
        GrabTerritoryData()

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
        console.log("Checking victory");

        // Only check if a player owns all 32 territories
        connection.query(
            "select COUNT(*) AS territoryCount from Stakes_digtentape.game_territory where game_id = ? and plr_own_id = ?",
            [req.session.gameID, attackingPlayerId],
            (err, results) => {
                if (err) return console.error("Error checking territory conquest victory:", err);

                const territoryCount = results[0].territoryCount;
                if (territoryCount === 32) {
                    console.log(`[Winner] win_plr_id=${attackingPlayerId} | win_con=conquer_all | game_id=${req.session.gameID}`);

                    connection.query(
                        "update Stakes_digtentape.game set win_plr_id = ?, win_con = ? where game_id = ?",
                        [attackingPlayerId, "conquer_all", req.session.gameID],
                        (updateErr) => {
                            if (updateErr) console.error("Failed to update winner in DB:", updateErr);
                            else console.log("Winner recorded in database (conquer_all).");
                        }
                    );
                }
            }
        );
    }

    function GetTerritoryData() {
        connection.query(
            "select * from game_territory where game_id = ? and (ter_id = ? OR ter_id = ?)",
            [req.session.gameID, ter_from_id, ter_to_id],
            function (err, rows) {
                if (err) return res.status(500).json({ error: err });
                if (rows.length < 2) return res.status(404).json({ message: "Territory data not found" });

                const from = rows.find(r => r.ter_id === ter_from_id);
                const to = rows.find(r => r.ter_id === ter_to_id);

                if (from.plr_own_id !== req.session.player_id) {
                    return res.status(403).json({ message: "You do not own this territory!" });
                }

                ter_from_troop_count = from.troop_count;
                ter_to_troop_count = to.troop_count;

                if (att_troop_count < 1 || att_troop_count > 3 || att_troop_count >= ter_from_troop_count) {
                    return res.status(400).json({ message: "Invalid attacking troop count" });
                }

                InsertInfo();
            }
        );
    }

    function InsertInfo() {
        connection.query(
            "select plr_own_id from game_territory where game_id = ? and ter_id = ?",
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
                            "update game_territory set troop_count = ? where game_id = ? and ter_id = ?",
                            [newAttackerTroops, req.session.gameID, ter_from_id],
                            (err) => {
                                if (err) return res.status(500).json({ message: "Failed to update attacker troops", error: err });

                                connection.query(
                                    "update game_territory set troop_count = ? where game_id = ? and ter_id = ?",
                                    [Math.max(0, newDefenderTroops), req.session.gameID, ter_to_id],
                                    (err) => {
                                        if (err) return res.status(500).json({ message: "Failed to update defender troops", error: err });

                                        if (newDefenderTroops <= 0) {
                                            const troopsToMove = Math.min(att_troop_count - attackerLosses, newAttackerTroops - 1);
                                            const newAttackerFinal = newAttackerTroops - troopsToMove;

                                            req.session.justConquered = true;

                                            connection.query(
                                                "update game_territory set troop_count = ? where game_id = ? and ter_id = ?",
                                                [newAttackerFinal, req.session.gameID, ter_from_id],
                                                (err) => {
                                                    if (err) return res.status(500).json({ message: "Failed to update attacker after conquest", error: err });

                                                    connection.query(
                                                        "update game_territory set plr_own_id = ?, troop_count = ? where game_id = ? and ter_id = ?",
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
                                            CheckForVictory(attackingPlayerId);
                                            return res.json({
                                                message: "Attack finished",
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
            "select game_id from Stakes_digtentape.game where win_plr_id is null and (plr1_id = ? or plr2_id = ?)",
            [req.session.player_id, req.session.player_id],
            (err, rows) => {
                if (err) return res.status(500).json({ message: "Database error", error: err });
                if (rows.length === 0) return res.status(404).json({ message: "No game found for this player" });

                req.session.gameID = rows[0].game_id;
                GetTerritoryData();
            }
        );
    }

    if (!req.session.gameID) GetGameID();
    else GetTerritoryData();
});



app.post("/moveTroops", (req, res) => {
    const { from_id, to_id, troops } = req.body;

    if (!req.session.player_id || !req.session.gameID) {
        return res.status(401).json({ message: "Not logged in or in game" });
    }

    if (!from_id || !to_id || !troops || troops <= 0) {
        return res.status(400).json({ message: "Invalid parameters" });
    }

    // Step 1: Check ownership and troop counts
    connection.query(
        "select * from Stakes_digtentape.game_territory where game_id = ? and ter_id IN (?, ?) and plr_own_id = ?",
        [req.session.gameID, from_id, to_id, req.session.player_id],
        (err, results) => {
            if (err) return res.status(500).json({ message: "DB error", err });
            if (results.length < 2) {
                return res.status(403).json({ message: "You must own both territories." });
            }

            const fromTerritory = results.find(row => row.ter_id === from_id);
            const toTerritory = results.find(row => row.ter_id === to_id);

            if (fromTerritory.troop_count <= troops) {
                return res.status(400).json({ message: "You must leave at least 1 troop behind." });
            }

            // Step 2: update both territories
            const update1 = "update Stakes_digtentape.game_territory set troop_count = troop_count - ? where game_id = ? and ter_id = ?";
            const update2 = "update Stakes_digtentape.game_territory set troop_count = troop_count + ? where game_id = ? and ter_id = ?";

            connection.query(update1, [troops, req.session.gameID, from_id], (err1) => {
                if (err1) return res.status(500).json({ message: "Failed to subtract troops", err1 });

                connection.query(update2, [troops, req.session.gameID, to_id], (err2) => {
                    if (err2) return res.status(500).json({ message: "Failed to add troops", err2 });

                    return res.json({ success: true, message: `Moved ${troops} troop(s) successfully.` });

                });
            });
        }
    );
});


app.post("/reinforce", (req, res) => {
    if (!req.session.username) return res.status(401).json({ success: false, message: "Not logged in." });
    
    const { territory_id, troops, card } = req.body;
    if (!card || !card.crd_id){
        return res.status(400).json({ success: false, message: "Invalid Card - " + card });
    }

    if (!territory_id)
        return res.status(400).json({ success: false, message: "Invalid TerritoryID - " + territory_id });


    if (!troops || troops <= 0) {
        return res.status(400).json({ success: false, message: "Invalid Troops - " + troops });
    }
    
    // Step 1: Get card effect value from the database
    connection.query("select * from Stakes_digtentape.cards where crd_id = ?", [card.crd_id], (cardErr, cardRows) => {
        if (cardErr || cardRows.length === 0) {
            return res.status(400).json({ success: false, message: "Invalid card." });
        }

        const cardEffect = cardRows[0];

        // Step 2: Confirm player owns the territory
        connection.query(
            "select * from Stakes_digtentape.game_territory where ter_id = ? and plr_own_id = ?",
            [territory_id, req.session.player_id],
            (err, rows) => {
                if (err) return res.status(500).json({ success: false, message: "Database error." });
                if (rows.length === 0) return res.status(403).json({ success: false, message: "You do not own this territory." });

                // Step 3: Reduce bonus pool (if active)
                const key = `bonus_${req.session.player_id}`;
                let currentBonus = app.get(key) || 0;
                currentBonus -= troops;
                if (currentBonus < 0) currentBonus = 0;
                app.set(key, currentBonus);

                // Step 4: Apply troop reinforcement based on card effect
                connection.query(
                    "update Stakes_digtentape.game_territory set troop_count = troop_count + ? where ter_id = ?",
                    [cardEffect.eff_val, territory_id],
                    (updateErr) => {
                        if (updateErr) return res.status(500).json({ success: false, message: "Failed to reinforce." });

                        // Step 5: Mark the card as used
                        connection.query(
                            "update Stakes_digtentape.player_cards set is_used = 1 where crd_id = ? and plr_id = ? and game_id = ? and is_used = 0",
                            [card.crd_id, req.session.player_id, req.session.gameID],
                            (cardUseErr) => {
                                if (cardUseErr) return res.status(500).json({ success: false, message: "Failed to mark card as used." });

                                return res.json({
                                    success: true,
                                    message: `Successfully reinforced with ${cardEffect.eff_val} troops!`
                                });
                            }
                        );
                    }
                );
            }
        );
    });
});


app.post("/giveCard", (req, res) => {

    connection.query("select crd_id from cards where crd_id between 1 and 10 order by Rand() limit 1", (err, results) => {
        if (err) {
            console.error("Error selecting card:", err);
            return res.status(500).send("Database error");
        }

        if (results.length === 0) return res.status(404).send("No cards available");

        const card_id = results[0].crd_id;

        connection.query(
            "insert into player_cards (plr_id, crd_id, game_id, is_used) values (?, ?, ?, 0)",
            [req.session.player_id, card_id, req.session.gameID],
            (insertErr) => {
                if (insertErr) {
                    console.error("Error inserting card:", insertErr);
                    return res.status(500).send("Failed to assign card");
                }
                connection.query(
                    "select * from cards where crd_id = ?",
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

    function EndTurn() {
        connection.query(
            "select plr1_id, plr2_id, cur_turn_plr_id, rnd_num from Stakes_digtentape.game where game_id = ?",
            [req.session.gameID],
            (err, results) => {
                if (err || results.length === 0) {
                    return res.status(500).json({ message: "Game not found." });
                }

                const { plr1_id, plr2_id, cur_turn_plr_id, rnd_num } = results[0];
                const nextTurn = cur_turn_plr_id === plr1_id ? plr2_id : plr1_id;

                const isNewRound = cur_turn_plr_id === plr2_id && nextTurn === plr1_id;
                const newRound = isNewRound ? rnd_num + 1 : rnd_num;

                //  Give bonus troops to the next player
                GiveStartOfTurnBonus(nextTurn, req.session.gameID, (bonus) => {
                    const key = `bonus_${nextTurn}`;
                    app.set(key, bonus);
                    console.log(` Gave ${bonus} bonus troops to player ${nextTurn}`);
                });

                //  Update turn and round info
                const sql = "update Stakes_digtentape.game set cur_turn_plr_id = ?, rnd_num = ? where game_id = ?";
                connection.query(sql, [nextTurn, newRound, req.session.gameID], (updateErr) => {
                    if (updateErr) return res.status(500).json({ message: "Failed to end turn." });

                    //  If round limit reached, end game
                    if (newRound === 20 && isNewRound) {
                        console.log("New round:", newRound);
                        connection.query(
                            "select plr1_id, plr2_id from Stakes_digtentape.game where game_id = ?",
                            [req.session.gameID],
                            (err, rows) => {
                                if (err || rows.length === 0) return;
                                const { plr1_id, plr2_id } = rows[0];

                                connection.query(
                                    `select plr_own_id, COUNT(*) AS count 
                                     from Stakes_digtentape.game_territory 
                                     where game_id = ? and plr_own_id IS NOT NULL 
                                     group by plr_own_id`,
                                    [req.session.gameID],
                                    (err2, counts) => {
                                        if (err2 || counts.length === 0) return;

                                        const p1 = counts.find(c => c.plr_own_id === plr1_id)?.count || 0;
                                        const p2 = counts.find(c => c.plr_own_id === plr2_id)?.count || 0;

                                        let winner = null;
                                        if (p1 > p2) winner = plr1_id;
                                        else if (p2 > p1) winner = plr2_id;

                                        const winCon = (p1 === p2) ? "draw" : "territory_majority";

                                        connection.query(
                                            "update Stakes_digtentape.game set win_plr_id = ?, win_con = ? where game_id = ?",
                                            [winner, winCon, req.session.gameID],
                                            () => {
                                                res.json({
                                                    message: "Game ended by round limit.",
                                                    round: newRound,
                                                    win_by: winCon
                                                });
                                            }
                                        );
                                    }
                                );
                            }
                        );
                    } else {
                        res.json({ message: "Turn ended successfully.", round: newRound });
                    }
                });
            }
        );
    }

    if (!req.session.gameID) {
        connection.query(
            "select game_id from Stakes_digtentape.game where win_plr_id is null and (plr1_id = ? or plr2_id = ?)",
            [req.session.player_id, req.session.player_id],
            (err, rows) => {
                if (err) return res.status(500).json({ message: "Database error", error: err });
                if (rows.length === 0) return res.status(404).json({ message: "No game found for this player" });
                req.session.gameID = rows[0].game_id;
                EndTurn();
            }
        );
    } else {
        EndTurn();
    }
});


function GiveStartOfTurnBonus(playerId, gameID, callback) {
    const territoryBonusTable = [
        { min: 1, max: 4, bonus: 1 },
        { min: 5, max: 7, bonus: 2 },
        { min: 8, max: 10, bonus: 3 },
        { min: 11, max: 13, bonus: 4 },
        { min: 14, max: 16, bonus: 5 },
        { min: 17, max: 19, bonus: 6 },
        { min: 20, max: 22, bonus: 7 },
        { min: 23, max: 25, bonus: 8 },
        { min: 26, max: 28, bonus: 9 },
        { min: 29, max: 31, bonus: 10 },
    ];

    const sql = `
        select gt.ter_id, t.ter_reg_id
        from Stakes_digtentape.game_territory gt
        join Stakes_digtentape.territory t on gt.ter_id = t.ter_id
        where gt.plr_own_id = ? and gt.game_id = ?
    `;

    connection.query(sql, [playerId, gameID], (err, rows) => {
        if (err || !rows) return callback(0);

        const terrCount = rows.length;
        const match = territoryBonusTable.find(rule => terrCount >= rule.min && terrCount <= rule.max);
        const territoryBonus = match ? match.bonus : 0;

        const regionCounts = {};
        rows.forEach(r => {
            regionCounts[r.ter_reg_id] = (regionCounts[r.ter_reg_id] || 0) + 1;
        });

        connection.query("select reg_id, troop_bonus from Stakes_digtentape.region", (err2, regions) => {
            if (err2) return callback(territoryBonus);

            let regionBonus = 0;
            let checks = 0;

            regions.forEach(region => {
                connection.query(
                    "select COUNT(*) AS total from Stakes_digtentape.territory where ter_reg_id = ?",
                    [region.reg_id],
                    (err3, countRows) => {
                        checks++;
                        if (!err3 && countRows[0].total === regionCounts[region.reg_id]) {
                            regionBonus += region.troop_bonus;
                        }

                        if (checks === regions.length) {
                            callback(territoryBonus + regionBonus);
                        }
                    }
                );
            });
        });
    });
}

app.get("/getBonusTroops", (req, res) => {
    const key = `bonus_${req.session.player_id}`;
    const bonus = app.get(key) || 0;
    res.json({ bonus });
});

app.post("/applyBonusTroops", (req, res) => {
    const { territory_id, troops } = req.body;

    if (!req.session.player_id || !req.session.gameID) {
        return res.status(401).json({ success: false, message: "Not logged in or no active game." });
    }

    if (!territory_id || !troops || troops <= 0) {
        return res.status(400).json({ success: false, message: "Invalid parameters." });
    }

    const key = `bonus_${req.session.player_id}`;
    let currentBonus = app.get(key) || 0;

    if (currentBonus < troops) {
        return res.status(400).json({ success: false, message: `Not enough bonus troops. You have ${currentBonus}.` });
    }

    connection.query(
        "select * from Stakes_digtentape.game_territory where game_id = ? and ter_id = ? and plr_own_id = ?",
        [req.session.gameID, territory_id, req.session.player_id],
        (err, results) => {
            if (err) return res.status(500).json({ success: false, message: "Database error." });
            if (results.length === 0) return res.status(403).json({ success: false, message: "You do not own this territory." });

            connection.query(
                "update Stakes_digtentape.game_territory set troop_count = troop_count + ? where game_id = ? and ter_id = ?",
                [troops, req.session.gameID, territory_id],
                (updateErr) => {
                    if (updateErr) return res.status(500).json({ success: false, message: "Failed to apply troops." });

                    app.set(key, currentBonus - troops);

                    res.json({
                        success: true,
                        message: ` Successfully reinforced ${troops} troops to territory ${territory_id}.`,
                        remainingBonus: currentBonus - troops
                    });
                }
            );
        }
    );
});


app.get("/isMyTurn", (req, res) => {
    if (!req.session.player_id) {
        return res.status(401).json({ message: "Not logged in." });
    }

    function CheckTurn() {
        connection.query(
            "select cur_turn_plr_id from Stakes_digtentape.game where game_id = ?",
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
            "select game_id from Stakes_digtentape.game where win_plr_id is null and (plr1_id = ? or plr2_id = ?)",
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
        const query = "select * from Stakes_digtentape.player_cards where plr_id = ? and game_id = ? and is_used = 0 limit 1";

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
            "select game_id from Stakes_digtentape.game where win_plr_id is null and (plr1_id = ? or plr2_id = ?)",
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


app.get("/checkVictory", (req, res) => {
    if (!req.session.player_id || !req.session.gameID) {
        return res.status(401).json({ message: "Not logged in or no game." });
    }

    connection.query("select win_plr_id, win_con from Stakes_digtentape.game where game_id = ?", [req.session.gameID],
        function (err, rows) {
            if (err) return res.status(500).json({ error: err });
            if (rows.length === 0) return res.status(404).json({ message: "Game not found." });

            const winnerId = rows[0].win_plr_id;
            const winCon = rows[0].win_con;

            if (!winnerId && winCon !== "draw") return res.json({ gameOver: false });

            if (winCon === "draw") {
                return res.json({ gameOver: true, isDraw: true });
            }

            return res.json({
                gameOver: true,
                isWinner: winnerId === req.session.player_id,
                winCon
            });
        }
    );
});

app.post("/setIdle", (req, res) => {
    if (!req.session?.player_id) return res.status(401).json({ message: "Not logged in." });

    connection.query(
        "update Stakes_digtentape.player set plr_searching = 'idle' where plr_id = ?",
        [req.session.player_id],
        (err) => {
            if (err) return res.status(500).json({ message: "Failed to set player idle" });
            res.json({ message: "Player marked as idle." });
        }
    );
});

app.listen(4000, () => {
    console.log("Server running on http://localhost:4000/login.html");
});