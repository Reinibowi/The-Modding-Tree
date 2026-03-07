let modInfo = {
	name: "The Tofl Tree :3",
	id: "tofl_tree",
	author: "Kuro",
	pointsName: "Euro",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (1), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
	isEndgame(){
		return player.points.get(new Decimal(1000000))
	}
}


// Set your version in num and name
let VERSION = {
	num: "1.0",
	name: "Phase 1",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3> v1.0 </h3>><br>
		- Brontalo Layer hinzugefügt.><br>
		- Kuro Layer beendet.><br>
		- Aktuelles Endgame ist 1.000.000 Euro.><br>><br>
	<h3> v0.3 </h3><br>
		- Kuro-Layer angefangen<br>
	<br>
	<h3> v0.2 </h3><br>
		- Herbsti Layer beendet<br>
	<br>
	<h3>v0.1</h3><br>
		- Spiel existiert<br>
		- Tofl Layer<br>
		- Herbsti Layer`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(0)

	//Tofl

	if (hasUpgrade("t", 11)) gain = gain.add(0.1)
	if (hasUpgrade("t", 14)) gain = gain.mul(upgradeEffect("t", 14))


	if (getBuyableAmount("t", 11).gte(1)) gain = gain.add(buyableEffect("t", 11))
	if (getBuyableAmount("t", 12).gte(1)) gain = gain.mul(buyableEffect("t", 12))
	if (getBuyableAmount("t", 13).gte(1)) gain = gain.pow(buyableEffect("t", 13))

	//Herbsti

	if (hasUpgrade("h", 11)) gain = gain.add(0.1)
	if (hasUpgrade("h", 14)) gain = gain.mul(upgradeEffect("h", 14))

	if (layers["h"].read().gte(1)) gain = gain.mul(layers["h"].read())

	//Kuro

	if (hasUpgrade("k", 11)) gain = gain.add(0.1)
	if (hasUpgrade("k", 14)) gain = gain.mul(upgradeEffect("k", 14))

	//Brontalo

	if (hasUpgrade("b", 11)) gain = gain.add(0.1)
	if (hasUpgrade("b", 14)) gain = gain.mul(upgradeEffect("b", 14))
	
	gain = gain.mul(layers["b"].euroBoost())

	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("e280000000"))
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}