
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
    position: 1, 
    type: "normal",
    exponent: 0.5,
    requires: new Decimal(1),
    read() {
        return ((player[this.layer].maxRead.div(100)).mul(player[this.layer].readValue)).add(new Decimal(1).add(player[this.layer].minRead))
    }, 
    update() {
        if (player[this.layer].readValue.gte(0)){
            //balkenleerung
            let reduction = player[this.layer].readDecreaseTime;

            if (hasUpgrade("h", 13)) reduction = reduction.div(upgradeEffect("h", 13))
            reduction = reduction.mul(buyableEffect("h", 12))

            if(hasUpgrade("h", 24)) reduction = reduction.div(2)

            player[this.layer].readValue = player[this.layer].readValue.sub(reduction);
        }
        //max and min
        let max = new Decimal(0.25)
        let min = new Decimal(0)

        max = max.add(buyableEffect(this.layer, 11).mul(getBuyableAmount(this.layer, 11)))
        min = min.add(buyableEffect(this.layer, 13).mul(getBuyableAmount(this.layer, 13)))

        if(hasUpgrade(this.layer, 22)) max = max.add(upgradeEffect(this.layer, 22))

        player[this.layer].maxRead = max
        player[this.layer].minRead = min
    
    },

    tabFormat:{
        "Main": {
            content: ["main-display", "blank", "prestige-button", "blank", "upgrades"]
        },
        "Read": {
            content: ["main-display", "blank", ["bar", "readBar"], "blank", "clickables", "blank",  "buyables"]
        },
        "Erklärung": {
            content: [["infobox", "buecher"]]
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
            }, 
            onClick() {
                if(hasUpgrade(this.layer, "23")){
                    player[this.layer].readValue = new Decimal(100)
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
        }, 
        21: {
            description: "Schalte Buyable-Booster frei",
            cost() {return new Decimal(75)}, 
            unlocked() {return hasMilestone("i", 1)}
        }, 
        22: {
            description() {return "Bücher boosten maximalen Lese-Multiplikator: Aktuell: " + format(this.effect())},
            effect() {return new Decimal(0.1).mul(new Decimal(player[this.layer].points).add(1).log10())},
            cost() {return new Decimal(300)}, 
            unlocked() {return hasMilestone("i", 1)}
        }, 
        23: {
            description: "Ein einfacher Klick reicht um die Leseleiste zu füllen.",
            cost() {return new Decimal(500)}, 
            unlocked() {return hasMilestone("i", 1)}
        }, 
        24: {
            description: "Halbiere die Rate mit der sich die Leseleiste leert.", 
            cost() {return  new Decimal(1000)}, 
            unlocked() {return hasMilestone("i", 1)}
        }
    }, 

    buyables: {
        11:{
            title: "Novelle",
            cost(x) {return {buecher: getBuyableAmount("h", 11).lte(20)
                ? (new Decimal(5)).mul(new Decimal(1.5).pow(x))
                : (new Decimal(5)).mul(new Decimal(1.5).pow(x.mul(1.2)))}}, 
            display() {return "Erhöhe den maximalen Multiplikator um " + format(this.effect()) + "\nAktuell: +" + format(new Decimal(this.effect()).mul(getBuyableAmount(this.layer, 11))) + "\n\nKosten: " + format(this.cost().buecher) + " Bücher"},
            canAfford() {return player[this.layer].points.gte(this.cost().buecher)},
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost().buecher)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {return hasUpgrade(this.layer, 12)},
            effect() {return new Decimal(0.1).add(new Decimal(0.01).mul(getBuyableAmount(this.layer, 21)))}

        },
        12:{
            title: "Krimmi", 
            cost(x) {return  {buecher: new Decimal(3).mul(new Decimal(2).pow(x))}},
            display() {return "Senke die Rate mit der sich die Leiste leert um " +format(new Decimal(5).add(getBuyableAmount(this.layer, 22))) + "%\nAktuell: " + format(this.effect()) + "\n\n Kosten: " + format(this.cost().buecher) + " Bücher"},
            canAfford() {return player[this.layer].points.gte(this.cost().buecher)},
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost().buecher)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) {return new Decimal(1).mul((new Decimal(0.95).sub(new Decimal(0.01).mul(getBuyableAmount(this.layer, 22)))).pow(x))},
            unlocked() {return hasUpgrade(this.layer, 12)}
        }, 
        13:{
            title: "Sachbuch",
            cost(x) {return {buecher: getBuyableAmount("h", 13).lte(10)
                ? (new Decimal(10)).mul(new Decimal(3).pow(x))
                : (new Decimal(10)).mul(new Decimal(3).pow(x.mul(1.2)))}}, 
            display() {return "Erhöhe den minimalen Multiplikator um " + format(this.effect()) + "\nAktuell: +" + format(new Decimal(this.effect()).mul(getBuyableAmount(this.layer, 13))) + "\n\nKosten: " + format(this.cost().buecher) + " Bücher"},
            canAfford() {return player[this.layer].points.gte(this.cost().buecher)},
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost().buecher)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {return hasUpgrade(this.layer, 12)}, 
            effect() {return new Decimal(0.1).add(new Decimal(0.01).mul(getBuyableAmount(this.layer, 23)))}

        },
        21: {
            title: "Novellen-Booster", 
            cost(x)  {return  {buecher: new Decimal(50).mul(new Decimal(3).pow(x))}},
            display() {return "Erhöhe, den Effekt von Novellen um 0.01\n\nKosten: " + format(this.cost(getBuyableAmount("h", 21)).buecher) + " Bücher"},
            canAfford() {return player[this.layer].points.gte(this.cost().buecher)},
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost().buecher)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            }, 
            unlocked() {return hasUpgrade(this.layer, 21)},
            style: {
                "height": "100px", 
                "border-radius": "0px", 
            }
    
        },
        22: {
            title: "Krimmi-Booster", 
            cost(x) {return {buecher: new Decimal(100).mul(new Decimal(3).pow(x))}},
            display() {return "Erhöhe, den Effekt von Krimmis um einen Prozentpunkt\n\nKosten: " + format(this.cost(getBuyableAmount("h", 22)).buecher) + " Bücher"},
            canAfford() {return player[this.layer].points.gte(this.cost().buecher)},
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost().buecher)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            }, 
            unlocked() {return hasUpgrade(this.layer, 21)},
            style: {
                "height": "100px", 
                "border-radius": "0px", 
            }
        },

        23: {
            title: "Sachbuch-Booster", 
            cost(x) {return {buecher: new Decimal(50).mul(new Decimal(3).pow(x))}},
            display() {return "Erhöhe, den Effekt von Sachbüchern um 0.01\n\nKosten: " + format(this.cost(getBuyableAmount("h", 23)).buecher) + " Bücher"},
            canAfford() {return player[this.layer].points.gte(this.cost().buecher)},
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost().buecher)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            }, 
            unlocked() {return hasUpgrade(this.layer, 21)},
            style: {
                "height": "100px", 
                "border-radius": "0px", 
            }
    
        },

    }, 

    infoboxes: {
        buecher: {
            title: "Bücher", 
            body() {
                return "Herbstis Methode um Geld zu machen ist es Bücher zu lesen und das Wissen daraus zu nutzen. Resette dene Euros für Bücher und lese diese, indem du den Button für Lesen gedrückt hältst. Das Boostet deine Europroduktion. Mit den Büchern kannst du bestimmte Dinge um die Leseleiste verbessern."
            }
        }
    }
 })