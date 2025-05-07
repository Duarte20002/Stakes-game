let reinforceMode = false;
let alreadyReinforced = false;
let selectedCard = null;


function initTerritories() {
    const xhr = new XMLHttpRequest();

    // Handle the response when it comes back
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) { // When request is complete
            if (xhr.status === 200) {
                const data = JSON.parse(xhr.responseText);
                console.log("Territories initialized:", data);
            } else {
                console.error("Error initializing territories:", xhr.statusText);
            }
        }
    };

    xhr.open("POST", "/findMatch", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
}

function GameLoop(){
    var request = new XMLHttpRequest();

    request.onreadystatechange = function () {
        if (this.readyState == 4) {
            var data = JSON.parse(this.responseText);
            // console.log(data)

            var player1ID = undefined
            var player2ID = undefined

            data.forEach(territory => {
                var territoryID = "zone_red_" + territory.ter_id
                var terrorityElement = document.getElementById(territoryID)
               terrorityElement.innerHTML = territory.troop_count
               terrorityElement.style.fontSize = "25px";
                if (territory.plr_own_id){
                    if (!player1ID){
                        player1ID = territory.plr_own_id
                        terrorityElement.style.color = "DarkRed"
                    }else if (player1ID == territory.plr_own_id){
                        terrorityElement.style.color = "DarkRed"
                    }else {
                        terrorityElement.style.color = "blue"
                    }
                }
            });
        }
    };

    request.open("GET", "/game", true);
    request.send();
}

function verifyAdjacencies() {                      //Check adjacencies between the territories via ter_id
    const dataToSend = {
        ter_ID: selectedZone
    };

    console.log("Selected zone:", selectedZone);

    const request = new XMLHttpRequest();

    request.onreadystatechange = function () {
        if (this.readyState === 4) {
            const data = JSON.parse(this.response);

            // Get the data from EVERY row instead of only the first.
            const adjacent = data.map(row => row.adj_ter2_id);

            Coloradjacent(adjacent);
        }
    };

    request.open("POST", "/verifyAdjecencies", true);
    request.setRequestHeader("Content-Type", "application/json");
    request.send(JSON.stringify(dataToSend));
}

let highlightedAdjacents = [];

function Coloradjacent(arrayAdjacent) {         //Function to color the adjacent territories when clicking on an area
    highlightedAdjacents = arrayAdjacent;

    arrayAdjacent.forEach(id => {
        if (id > 0) {
            const el = document.getElementById("zone_red_" + id);       
            if (el) el.style.background = "green";
        }
    });
}

function ClearAdjacents() {                     //Function to clear selection of adjacent when clicking outside of areas.
    highlightedAdjacents.forEach(id => {
        if (id > 0) {
            const el = document.getElementById("zone_red_" + id);
            if (el) el.style.background = "";
        }
    });
    highlightedAdjacents = [];
}


// Guy attacking
let selectedZone;

// Guy defending
let defendingZone;

function ClickArea(area_number) {
    const selectionDiv = document.getElementById("selection");

    
    if (reinforceMode) {
        reinforceTerritory(area_number);
        return;
    }

    if (selectedZone === undefined) {
        selectedZone = area_number;
        selectionDiv.innerHTML = "Attacking from Area " + selectedZone;
        const zone = document.getElementById("zone_red_" + selectedZone);
        if (zone) zone.style.backgroundColor = "palegoldenrod";
        verifyAdjacencies();
        return;
    }

    if (selectedZone === area_number) {
        const zone = document.getElementById("zone_red_" + selectedZone);
        if (zone) zone.style.backgroundColor = "";
        selectedZone = undefined;
        defendingZone = undefined;
        selectionDiv.innerHTML = "";
        ClearAdjacents();
        return;
    }

    if (selectedZone !== undefined && defendingZone === undefined) {
        if (!highlightedAdjacents.includes(area_number)) {
            selectionDiv.innerHTML = "You can only attack connected territories.";
            return;
        }

        defendingZone = area_number;
        const defZone = document.getElementById("zone_red_" + defendingZone);
        if (defZone) defZone.style.backgroundColor = "blue";

        // Dropdown that gives the player the option to select with how many troops he wants to attack
        selectionDiv.innerHTML = `
            Attacking from Area ${selectedZone} to Area ${defendingZone}<br>
            Select number of attacking troops (max 3, must leave 1 behind):<br>
            <select id="attackTroopCount">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
            </select>
            <button onclick='AttackZone()'>Attack</button>
        `;
        return;
    }

    if (selectedZone !== area_number && defendingZone !== undefined) {
        const oldAttacker = document.getElementById("zone_red_" + selectedZone);
        const oldDefender = document.getElementById("zone_red_" + defendingZone);
        if (oldAttacker) oldAttacker.style.backgroundColor = "";
        if (oldDefender) oldDefender.style.backgroundColor = "";

        selectedZone = area_number;
        defendingZone = undefined;
        const newZone = document.getElementById("zone_red_" + selectedZone);
        if (newZone) newZone.style.backgroundColor = "red";
        selectionDiv.innerHTML = "Attacking from Area " + selectedZone;
        ClearAdjacents();
        verifyAdjacencies();
    }

  

    console.log("Clicked on area " + area_number);
}

function reinforceTerritory(area_number) {
    const troopsToAdd = prompt("How many troops do you want to add?", "1");

    if (troopsToAdd === null) {
        reinforceMode = false;
        return;
    }

    const number = parseInt(troopsToAdd);

    if (isNaN(number) || number <= 0) {
        alert("Invalid number of troops.");
        return;
    }

    // Send reinforcement to the server
    const request = new XMLHttpRequest();
    request.open("POST", "/reinforce", true);
    request.setRequestHeader("Content-Type", "application/json");

    request.onreadystatechange = function () {
        if (this.readyState === 4) {
            const response = JSON.parse(this.responseText);
            alert(response.message);

            if (response.success) {
                alreadyReinforced = true;
                reinforceMode = false;
            }
        }
    };

    const dataToSend = {
        territory_id: area_number,
        troops: number
    };

    request.send(JSON.stringify(dataToSend));
}

function AttackZone() {
    if (!selectedZone || !defendingZone) return;
    const currentPlayerId = parseInt(sessionStorage.getItem("player_id"), 10);
    const troopCountInput = document.getElementById("attackTroopCount");
    const selectedTroopCount = parseInt(troopCountInput?.value || "1", 10);

    const xhr = new XMLHttpRequest();

    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            const data = JSON.parse(xhr.responseText);
            console.log("Attack logged:", data);

            if (!data.attackerRolls || !data.defenderRolls) {
                console.error("Dice rolls are undefined:", data);
                return;
            }

            const sortedAttackerRolls = data.attackerRolls.sort((a, b) => b - a);
            const sortedDefenderRolls = data.defenderRolls.sort((a, b) => b - a);

            const selectionDiv = document.getElementById("selection");
            if (selectionDiv) {
                selectionDiv.innerHTML = `
                    Attacking from Area ${selectedZone} to Area ${defendingZone}<br>
                    <strong>Dice Roll Results:</strong><br>
                    <strong>Attacker's roll:</strong> ${getDiceEmojis(sortedAttackerRolls)}<br>
                    <strong>Defender's roll:</strong> ${getDiceEmojis(sortedDefenderRolls)}<br>
                `;
            }

            // ✅ If a territory was captured, give the player a card
            if (data.territoryCaptured === true) {
                giveCardToPlayer(currentPlayerId);
            }

        } else {
            console.error("Error logging attack:", xhr.statusText);
        }
    };

    xhr.onerror = function () {
        console.error("Request failed:", xhr.statusText);
    };

    const requestData = {
        ter_from_id: selectedZone,
        ter_to_id: defendingZone,
        att_troop_count: selectedTroopCount
    };

    alreadyReinforced = false;

    xhr.open("POST", "/logAttack", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(requestData));
}

function giveCardToPlayer(player_id, game_id) {
    const xhrCard = new XMLHttpRequest();
    xhrCard.open("POST", "/giveCard", true);
    xhrCard.setRequestHeader("Content-Type", "application/json");

    xhrCard.onreadystatechange = function () {
        if (xhrCard.readyState === 4) {
            if (xhrCard.status === 200) {
                const response = JSON.parse(xhrCard.responseText);
                const card = response.card;

                console.log("🎴 Player received a card:", card);

                // ✅ Display card info in the game UI
                const cardRewardBox = document.getElementById("cardReward");
            if (cardRewardBox && card) {
            cardRewardBox.innerHTML = `
            <strong>🎴 New Card:</strong><br>
            Type: <em>${card.eff_typ}</em><br>
            Value: <em>${card.eff_val}</em>
    `;
}

            } else {
                console.error("Card request failed:", xhrCard.statusText);
            }
        }
    };

    xhrCard.send(JSON.stringify({ player_id, game_id }));
    checkHasCard();
}

// Utilizing dice emojis intead of numbers ;)
function getDiceEmojis(rolls) {
    const diceEmojis = ["🎲", "⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
    return rolls.map(roll => diceEmojis[roll] || "❓").join(" ");
}

function checkHasCard() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/hasCard", true);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            const btn = document.getElementById("reinforceButton");
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                btn.style.display = response.hasCard ? "block" : "none";
            } else {
                btn.style.display = "none";
            }
        }
    };

    xhr.send();
}

function startReinforce() {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/useCard", true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            const response = JSON.parse(xhr.responseText);
            if (response.success) {
                reinforceMode = true;
                alert("Card used! Select a territory to reinforce.");

                document.getElementById("reinforceButton").style.display = "none";

                const cardDisplay = document.getElementById("cardReward");
                if (cardDisplay) {
                    cardDisplay.innerHTML = "";
                }
            } else {
                alert("No card available or already used.");
            }
        }
    };

    xhr.send();
}

function endTurn() {
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            console.log(xhr.responseText)
            if (xhr.status === 200) {
                alert("Turn ended successfully.");
            } else {
                alert("Failed to end turn.");
            }
        }
    };

    xhr.open("POST", "/endTurn", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
}

function checkTurnOwnership() {
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            const endTurnBtn = document.getElementById("endTurnButton");

            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                endTurnBtn.style.display = response.isMyTurn ? "block" : "none";
            } else {
                endTurnBtn.style.display = "none";
            }
        }
    };

    xhr.open("GET", "/isMyTurn", true);
    xhr.send();
}

function checkVictoryStatus() {
    const xhr = new XMLHttpRequest();


    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                console.log(response)
                if (response.gameOver) {
                    if (response.isWinner) {
                        window.location.href = "/winner.html";
                    } else {
                        window.location.href = "/loser.html";
                    }
                }
            }
        }
    };

    xhr.open("GET", "/checkVictory", true);
    xhr.send();
}


setInterval(checkHasCard, 1000);
setInterval(checkTurnOwnership, 1000);
setInterval(checkVictoryStatus, 2000);

// Start the loop
GameLoop();
setInterval(GameLoop, 1000);