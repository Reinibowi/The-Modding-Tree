

addLayer("debug", {
    resource: "Debug Points",
    type: "normal",
    baseResource: "points",
    baseAmount() {return player.points},
    requires: new Decimal(1),
    exponent: 1,
    tabFormat: {
        "Main": {
            content: ["prestige-button", "buyables"]
        }
    }, 

    startData() {
        return {
            unlocked: true,
            points: new Decimal(0)
        }
    }, 
    row: "side",

    buyables: {
        11: {
            display() {
                return "+1.000.000 Euro"
            }, 
            cost(x) {
                return new Decimal(0)
            }, 
            canAfford: true, 
            buy(){
                player.points = player.points.add(1e6)
            }
        }, 
        12: {
            display() {
                return "+1.000.000.000 Euro"
            }, 
            cost(x) {
                return new Decimal(0)
            }, 
            canAfford: true, 
            buy(){
                player.points = player.points.add(1e9)
            }
        }
    }
})