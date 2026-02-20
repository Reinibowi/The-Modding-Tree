addLayer('t', {
    name: "Tofls",
    startData(){
        return {
            unlocked: true,
            points: new Decimal(0)

        }
    },
    color: "yellow",
    resource: "Tofls",
    baseResource: "points",
    baseAmount() {return player.points},
    row: 0,
    type: "normal",
    exponent: 0.75,
    base: 1,
    requires: new Decimal(1), 


    upgrades:{
        11: {
            title: "Tofl-Increase",
            description: "Unlocks the second Tofl-Buyable.",
            cost: new Decimal(30),
        },
        12: {
            title: "Tofl-Increase 2",
            description: "Unlocks the third Tofl-Buyable",
            cost: new Decimal(200),
        }, 
        13: {
            title: "Tofl-Increase 3",
            description: "Unlocks the fourth Tofl-Buyable",
            cost: new Decimal(300),
        }
    },


    tabFormat: {
        "Main": {
            content: ["main-display", "prestige-button"]
        },
        "Buyables": {
            content: ["main-display", "buyables"]
        }, 
        "Upgrades": {
            content: ["main-display", "upgrades"]
        }
    },

    buyables: {
        11: {
            title: "Tofl-Generation",
            cost(x) { return {tofls: new Decimal(2).pow(x)}},
            effect(x) {
                return (new Decimal(0.1).add(buyableEffect(this.layer, 14))).mul(x)
            },
            style: {
                "border-radius": "0%",
            },
            display() { return "Start generating Ghosts.\n +"+ format(new Decimal(0.1).add(buyableEffect(this.layer, 14))) + "/sec per level.\n\n Currently:  " + format(this.effect()) + " Ghosts/sec\n\nCost: " + format(this.cost().tofls) + " Tofls" },
            canAfford() { return player[this.layer].points.gte(this.cost().tofls) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost().tofls)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
        },
        12: {
            title: "Tofl-Multiplikation",
            cost(x) { return {tofls: new Decimal(1).mul(new Decimal(5).pow(x))}},
            effect(x) {
                return new Decimal(1.2).pow(x)
            },
            style: {
                "border-radius": "0%",
            },
            display() { return "Multiply Ghost-Generation by 1.2\n\n Currently:  " + format(this.effect()) + " \n\nCost: " + format(this.cost().tofls) + " Tofls" },
            canAfford() { return player[this.layer].points.gte(this.cost().tofls) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost().tofls)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {return hasUpgrade(this.layer, 11)},
        }, 
        13: {
            title: "Tofl-Exponentation",
            cost(x) { return {tofls: new Decimal(1).mul(new Decimal(20).pow(x))}},
            effect(x) {
                return (x.mul(0.1)).add(1)
            },
            style: {
                "border-radius": "0%",
            },
            display() { return "Raise the Ghost-Generation to the 1.1th power\n\n Currently:  " + format(this.effect()) + " \n\nCost: " + format(this.cost().tofls) + " Tofls" },
            canAfford() { return player[this.layer].points.gte(this.cost().tofls) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost().tofls)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {return hasUpgrade(this.layer, 12)},
        }, 
        14: {
            title: "Tofl-Power",
            cost(x) { return {tofls: new Decimal(100).mul(new Decimal(4).pow(x))}},
            effect(x) {
                return x.mul(0.01)
            },
            style: {
                "border-radius": "0%",
            },
            display() { return "Increase the base of Tofl-Generation by 0.01\n\n Currently:  " + format(this.effect()) + " \n\nCost: " + format(this.cost().tofls) + " Tofls" },
            canAfford() { return player[this.layer].points.gte(this.cost().tofls) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost().tofls)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {return hasUpgrade(this.layer, 13)},
        }
    },
 })

 addLayer("h", {
    name: "Herbsti", 
    startData(){
        return {
            unlocked: true,
            points: new Decimal(0)
        }
    },
    color: "green",
    resource: "Herbstis",
    baseResource: "points",
    baseAmount() {return player.points},
    row: 0,
    type: "normal",
    exponent: 0.5,
    requires: new Decimal(1),

    tabFormat:{
        "Main": {
            content: ["main-display", "prestige-button"]
        },
        "Read": {
            content: ["main-display", ["bar", "readBar"]]
        }
    },

    bars: {
        readBar: {
            direction: RIGHT,
            width: 500,
            height: 50,
            progress() {return 0.5},
            unlocked: true,
        },
    }

    
 })