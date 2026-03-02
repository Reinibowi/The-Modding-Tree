addLayer('t', {
    name: "Tofls",
    startData(){
        return {
            unlocked: true,
            points: new Decimal(0)

        }
    },
    color: "yellow",
    resource: "Samen",
    baseResource: "points",
    baseAmount() {return player.points},
    row: 0,
    type: "normal",
    exponent: 0.5,
    base: 1,
    gainExp() {
        let gain = new Decimal(1)

        if (hasUpgrade(this.layer, 12)) gain = gain.add(0.2)

        return gain
    },
    requires: new Decimal(1), 


    tabFormat: {
        "Main": {
            content: ["main-display", "prestige-button", "upgrades"]
        },
        "Tees": {
            content: ["main-display", "buyables"]
        }, 
    },


    upgrades:{
        11: {
            description: "Verkaufe Tees und starte die Euro-Generierung. \n+0.1 Euro/sec",
            cost: new Decimal(1),
        },
        12: {
            description: "Samen werden billiger. \nEuro^0.5 -> Euro^0.6",
            cost: new Decimal(5),
        }, 
        13: {
            description: "Schaltet Matchatee frei.",
            cost: new Decimal(100),
        },
        14: {
            description() {return "Samen multiplizieren Europroduktion: *log(Samen+1)\n\n Aktuell: "+format(this.effect())}, 
            effect() {return (new Decimal(player[this.layer].points)).log10().add(1)},
            cost: new Decimal(500)
        }
    },


    buyables: {
        11: {
            title: "Minztee",
            cost(x) { return {samen: new Decimal(2).pow(x.sub(getBuyableAmount(this.layer, 14)))}},
            effect(x) {
                return (new Decimal(0.1)).mul(x)
            },
            style: {
                "border-radius": "0%",
            },
            display() { return "Starte Euro-Generation.\n +"+ format(new Decimal(0.1)) + "/sec per level.\n\n Aktuell:  " + format(this.effect()) + " Euro/sec\n\nKosten: " + format(this.cost().samen) + " Samen" },
            canAfford() { return player[this.layer].points.gte(this.cost().samen) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost().samen)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
        },
        12: {
            title: "Früchtetee",
            cost(x) { return {samen: new Decimal(3).mul(new Decimal(3).pow(x.sub(getBuyableAmount(this.layer, 14))))}},
            effect(x) {
                return new Decimal(1.2).pow(x)
            },
            style: {
                "border-radius": "0%",
            },
            display() { return "Multipliziere die Euro-Generation mit 1.2\n\n Aktuell:  " + format(this.effect()) + " \n\nKosten: " + format(this.cost().samen) + " Samen" },
            canAfford() { return player[this.layer].points.gte(this.cost().samen) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost().samen)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {return true},
        }, 
        13: {
            title: "Grüntee",
            cost(x) { return {samen: new Decimal(50).mul(new Decimal(20).pow(x.sub(getBuyableAmount(this.layer, 14))))}},
            effect(x) {
                return (x.mul(0.05)).add(1)
            },
            style: {
                "border-radius": "0%",
            },
            display() { return "Nimm die Euro-Generierung ^ 1.05\n\n Aktuell:  " + format(this.effect()) + " \n\nKosten: " + format(this.cost().samen) + " Samen" },
            canAfford() { return player[this.layer].points.gte(this.cost().samen) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost().samen)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {return true},
        }, 
        14: {
            title: "Matchatee", 
            cost(x) {return {samen: new Decimal(100).mul(new Decimal(10).pow(x))}}, 
            effect(x){return x},
            style: {
                "border-radius": "0%",
            },
            display() {return "+1 kostenloses Level aller anderen Tees. \n\n Aktuell: "+format(this.effect())+ "\n\nKosten: "+format(this.cost().samen) + " Samen"},
            canAfford() {return player[this.layer].points.gte(this.cost().samen)}, 
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost().samen)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                addBuyables(this.layer, 11, 1)
                addBuyables(this.layer, 12, 1)
                addBuyables(this.layer, 13, 1)
            },
            unlocked() {return hasUpgrade(this.layer, 13)}
        }
    },
})

addLayer("h", {
    name: "Herbsti", 
    startData(){
        return {
            unlocked: true,
            points: new Decimal(0),
            readValue: new Decimal(0),
            maxRead: new Decimal(0.25),
            minRead: new Decimal(0),
            readDecreaseTime: new Decimal(2),
        }
    },
    color: "green",
    resource: "Buecher",
    baseResource: "points",
    baseAmount() {return player.points},
    row: 0,
    type: "normal",
    exponent: 0.5,
    requires: new Decimal(1),
    read() {
        return ((player[this.layer].maxRead.div(100)).mul(player[this.layer].readValue)).add(new Decimal(1).add(new Decimal(0.1).mul(getBuyableAmount("h", 13))))
    }, 
    update() {
        if (player[this.layer].readValue.gte(0)){
            let reduction = player[this.layer].readDecreaseTime;

            if (hasUpgrade("h", 13)) reduction = reduction.div(upgradeEffect("h", 13))
            reduction = reduction.mul(buyableEffect("h", 12))

            player[this.layer].readValue = player[this.layer].readValue.sub(reduction);
        }
    },

    tabFormat:{
        "Main": {
            content: ["main-display", "prestige-button"]
        },
        "Read": {
            content: ["main-display", ["bar", "readBar"], "clickables", "upgrades", "buyables"]
        }
    },

    bars: {
        readBar: {
            direction: RIGHT,
            width: 500,
            height: 50,
            fillStyle: {
                "background-color": "green",
            },
            display() {return "Euro-Generierung * " + format(layers[this.layer].read(player[this.layer].readValue))}, 
            progress() {return new Decimal(player[this.layer].readValue).div(100)},
            unlocked: true,
        },
    },

    clickables: {
        11: {
            display() {return "Lese Bücher um schlauer zu werden!"},
            canClick() {return true},
            onHold() {
                if (player[this.layer].readValue.lte(100)){
                    player[this.layer].readValue = player[this.layer].readValue.add(10);
                }
            }
        }
    },

    upgrades: {
        11: {
            description: "Nutze deinen Intellekt um Euros zu generieren: \n+0.1/sec",
            cost() {return new Decimal(1)}
        },
        12: {
            description: "Schalte Bücher-Buyables frei.",
            cost() {return new Decimal(2)},
        },
        13: {
            description() {return "Bücher verringern die Rate mit der sich die Leiste leert: \naktuell: /" + format(this.effect())},
            cost() {return new Decimal(50)},
            effect() {return new Decimal(player[this.layer].points).add(1).log10().add(1).log10().add(1)}
        },
        14: {
            description() {return "Bücher multiplizieren Europroduktion: *log(Bücher+1)\n\n Aktuell: "+format(this.effect())}, 
            effect() {return (new Decimal(player[this.layer].points)).add(1).log10().add(1)},
            cost: new Decimal(500)
        }
    }, 

    buyables: {
        11:{
            title: "Novelle",
            cost(x) {return {buecher: (new Decimal(5)).mul(new Decimal(1.5).pow(x))}}, 
            display() {return "Erhöhe den maximalen Multiplikator um +0.1\nAktuell: +" + format(new Decimal(0.1).mul(getBuyableAmount(this.layer, 11))) + "\n\nKosten: " + format(this.cost().buecher) + " Bücher"},
            canAfford() {return player[this.layer].points.gte(this.cost().buecher)},
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost().buecher)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                player[this.layer].maxRead = player[this.layer].maxRead.add(0.1)
            },
            unlocked() {return hasUpgrade(this.layer, 12)}

        },
        12:{
            title: "Krimmi", 
            cost(x) {return  {buecher: new Decimal(3).mul(new Decimal(2).pow(x))}},
            display() {return "Senke die Rate mit der sich die Leiste leert um 5%\nAktuell: " + format(this.effect()) + "\n\n Kosten: " + format(this.cost().buecher) + " Bücher"},
            canAfford() {return player[this.layer].points.gte(this.cost().buecher)},
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost().buecher)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) {return new Decimal(1).mul(new Decimal(0.95).pow(x))},
            unlocked() {return hasUpgrade(this.layer, 12)}
        }, 
        13:{
            title: "Sachbuch",
            cost(x) {return {buecher: (new Decimal(10)).mul(new Decimal(3).pow(x))}}, 
            display() {return "Erhöhe den minimalen Multiplikator um +0.1\nAktuell: +" + format(new Decimal(0.1).mul(getBuyableAmount(this.layer, 13))) + "\n\nKosten: " + format(this.cost().buecher) + " Bücher"},
            canAfford() {return player[this.layer].points.gte(this.cost().buecher)},
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost().buecher)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                player[this.layer].minRead = player[this.layer].minRead.add(0.1)
            },
            unlocked() {return hasUpgrade(this.layer, 12)}
        },
    }
 })