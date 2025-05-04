function initTerritories() {
    const xhr = new XMLHttpRequest();

    // Set up the POST request to the "/initTerritories" route


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
    // Send the data as a JSON string
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
                        terrorityElement.style.color = "blue"
                    }else if (player1ID == territory.plr_own_id){
                        terrorityElement.style.color = "blue"
                    }else {
                        terrorityElement.style.color = "DeepPink"
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

function AttackZone() {
    if (selectedZone && defendingZone) {
        const troopCountInput = document.getElementById("attackTroopCount");
        const selectedTroopCount = parseInt(troopCountInput?.value || "1", 10);

        const xhr = new XMLHttpRequest();


        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
                const data = JSON.parse(xhr.responseText);
                console.log("Attack logged:", data);
        
                // Make sure the dice are properly received
                if (!data.attackerRolls || !data.defenderRolls) {
                    console.error("Dice rolls are undefined:", data);
                    return;
                }
        
                // Sort the numbers from largest to smallest
                const sortedAttackerRolls = data.attackerRolls.sort((a, b) => b - a);
                const sortedDefenderRolls = data.defenderRolls.sort((a, b) => b - a);
        
                // Display dice roll results on the screen with emojis
                const selectionDiv = document.getElementById("selection");
                if (selectionDiv) {
                    selectionDiv.innerHTML = `
                        Attacking from Area ${selectedZone} to Area ${defendingZone}<br>
                        <strong>Dice Roll Results:</strong><br>
                        <strong>Attacker's roll:</strong> ${getDiceEmojis(sortedAttackerRolls)}<br>
                        <strong>Defender's roll:</strong> ${getDiceEmojis(sortedDefenderRolls)}<br>
                    `;
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

        xhr.open("POST", "/logAttack", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(requestData));
    }
}

// Utilizing dice emojis intead of numbers ;)
function getDiceEmojis(rolls) {
    const diceEmojis = ["🎲", "⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
    return rolls.map(roll => diceEmojis[roll] || "❓").join(" ");
}



// Start the loop
GameLoop();
setInterval(GameLoop, 1000);