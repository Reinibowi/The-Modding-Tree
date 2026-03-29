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
    position: 0, 
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
            content: ["main-display", "blank", "prestige-button", "blank", "upgrades"]
        },
        "Tees": {
            content: ["main-display", "blank", "buyables"]
        }, 
        "Erklärung": {
            content: [["infobox", "tee"]]
        }
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
            effect() {return (new Decimal(player[this.layer].points)).add(1).log10().add(1)},
            cost: new Decimal(500)
        }
    },


    buyables: {
        11: {
            title: "Minztee",
            cost(x) { 
                let price = new Decimal(2)

                getBuyableAmount("t", 11).lte(15) 
                ? price = price.pow(x.sub(getBuyableAmount(this.layer, 14)))
                : price = price.pow(x.sub(getBuyableAmount(this.layer, 14)).mul(1.5))

                if(hasMilestone("i", 4)){
                    price = price.div(player["i"].points.add().ln().add(1))
                }

                return {samen: price}},
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
            cost(x) {
                let price = new Decimal(2)

                getBuyableAmount("t", 11).lte(15) 
                ? price = price.mul(new Decimal(3).pow(x.sub(getBuyableAmount(this.layer, 14))))
                : price = price.mul(new Decimal(3).pow(x.sub(getBuyableAmount(this.layer, 14))).mul(1.5))

                if(hasMilestone("i", 4)){
                    price = price.div(player["i"].points.add().ln().add(1))
                }

                return {samen: price}},
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
            cost(x) {
                let price = new Decimal(50)

                getBuyableAmount("t", 11).lte(15) 
                ? price = price.mul(new Decimal(20).pow(x.sub(getBuyableAmount(this.layer, 14))))
                : price = price.mul(new Decimal(20).pow(x.sub(getBuyableAmount(this.layer, 14))).mul(1.5))

                if(hasMilestone("i", 4)){
                    price = price.div(player["i"].points.add().ln().add(1))
                }

                return {samen: price}},
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
            cost(x) {
                let price = new Decimal(100)

                getBuyableAmount("t", 11).lte(15) 
                ? price = price.mul(new Decimal(10).pow(x))
                : price = price.mul(new Decimal(10).pow(x).mul(1.5))

                if(hasMilestone("i", 4)){
                    price = price.div(player["i"].points.add().ln().add(1))
                }

                return {samen: price}},
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

    infoboxes: {
        tee: {
            title: "Tee", 
            body() {
                return "Tofls Methode um Geld zu machen ist es Tee anzupflanzen und zu verkaufen. Resette deine Euros für Samen und nutze die Samen um Tee zu pflanzen mit verschiedenen Effekten. Tees werden deutlich teurer ab einer bestimmten Menge des jeweiligen Tees."
            }
        }
    }
})
