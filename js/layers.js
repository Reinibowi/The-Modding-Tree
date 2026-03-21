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
            cost(x) { return {samen: getBuyableAmount("t", 11).lte(15) 
                ? new Decimal(2).pow(x.sub(getBuyableAmount(this.layer, 14)))
                : new Decimal(2).pow(x.sub(getBuyableAmount(this.layer, 14)).mul(1.5))}},
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
            cost(x) { return {samen: getBuyableAmount("t", 12).lte(10)
                ? new Decimal(3).mul(new Decimal(3).pow(x.sub(getBuyableAmount(this.layer, 14))))
                : new Decimal(3).mul(new Decimal(3).pow(x.sub(getBuyableAmount(this.layer, 14)).mul(1.5)))}},
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
            cost(x) { return {samen: getBuyableAmount("t", 13).lte(5)
                ? new Decimal(50).mul(new Decimal(20).pow(x.sub(getBuyableAmount(this.layer, 14))))
                : new Decimal(50).mul(new Decimal(20).pow(x.sub(getBuyableAmount(this.layer, 14)).mul(1.5)))}},
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
            cost(x) {return {samen: getBuyableAmount("t", 14).lte(5)
                ? new Decimal(100).mul(new Decimal(10).pow(x))
                : new Decimal(100).mul(new Decimal(10).pow(x.mul(1.5)))}}, 
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

addLayer("k", {
    name: "Kuro",
    startData(){
        return {
            points: new Decimal(0), 
            gachaChance: new Decimal(1), 
            pity: new Decimal(0), 
            maxPity: new Decimal(200),
            price: new Decimal(5), 
            gachaCost: new Decimal(1),
            lastWin: "nothing",
            timesWon: new Decimal(0)
        }
    }, 
    color: "aqua",
    resource: "Gacha",
    row: 0,
    position: 2, 
    baseResource: "points", 
    baseAmount(){return player.points},
    requires: new Decimal(1),
    type: "normal",
    exponent: 0.5, 
    update(){
        let priceGain = new Decimal(5)
        let maxPityGain = new Decimal(100)

        priceGain = priceGain.mul(new Decimal(1.15).pow(getBuyableAmount("k", 11)))
        
        if(hasUpgrade("k", 13)) priceGain = priceGain.mul(upgradeEffect("k", 13))

        player[this.layer].price = priceGain

        maxPityGain = maxPityGain.mul(new Decimal(0.5).pow(getBuyableAmount("k", 13)))
        player[this.layer].maxPity = maxPityGain.mul(2)
    },

    tabFormat:{
        "Main": {
            content: ["main-display", "blank", "prestige-button", "blank", "upgrades"]
        },
        "Gacha": {
            content: ["main-display", "blank", ["bar", "pityBar"], "blank", "clickables", 
            "blank", ["display-text", 
                function() {
                    if (player[this.layer].lastWin == "nothing"){
                        return ""
                    }
                    if (player[this.layer].lastWin == "win"){
                        return "Du hast gewonnen! Preisgeld erhalten!"
                    }
                    if (player[this.layer].lastWin == "lose"){
                        return "Du hast verloren."
                    }
                    if (player[this.layer].lastWin == "pity"){
                        return "Du hast das maximale Pity erreicht. Preisgeld erhalten."
                    }
                }
            ], "blank", ["display-text", 
                function() {
                    return "Du hast bereits " + format(player[this.layer].timesWon) + " Mal gewonnen!"
                }
            ], "blank", "buyables"]
        }, 
        "Erklärung": {
            content: [["infobox", "gacha"]]
        }
    },

    upgrades: {
        11: {
            description: "Starte die Eurogeneration. +0.1 Euro/sec.",
            cost: new Decimal(1),
        },
        12: {
            description: "Schalte Buyables frei.",
            cost: new Decimal(5),
        },
        13: {
            description() { return "Die Menge an Gacha, die du hast, erhöht das Preisgeld. Aktuell: *" + format(this.effect())},
            cost: new Decimal(100), 
            effect() {return (new Decimal(player[this.layer].points).max(1)).log10().add(1)}
         },
        14: {
            description() {return "Gacha multipliziert Europroduktion: *log(Gacha+1)\n\n Aktuell: "+format(this.effect())}, 
            effect() {return (new Decimal(player[this.layer].points)).add(1).log10().add(1)},
            cost: new Decimal(500)
        }
    }, 

    bars: {
        pityBar: {
            direction: RIGHT,
            width: 500,
            height: 50,
            fillStyle: {
                "background-color": "blue",
            },
            display() {return "Gacha-pity: " + format(player[this.layer].pity) + "/" + format(player[this.layer].maxPity)},
            progress() {return new Decimal(player[this.layer].pity).div(player[this.layer].maxPity)},
            unlocked: true,
        },
    },

    clickables: {
        11:{
            title: "GACHA!", 
            display() {return "GACHA GACHA GACHA: Rolle für Euros.\n\nAktuelle Gewinnchance: "+ format(player[this.layer].gachaChance) +"% \n\nAktueller Preis: " + format(player[this.layer].price) + " Euro\n\nKosten: " + format(player[this.layer].gachaCost + " Gacha")},
            canClick() {return player[this.layer].points.gte(player[this.layer].gachaCost)}, 
            onClick() {
                player[this.layer].points = player[this.layer].points.sub(player[this.layer].gachaCost)
                let number = 0
                number = Math.random()*100 
                if(player[this.layer].gachaChance.gte(100-number)){
                    player.points = player.points.add(player[this.layer].price)
                    player[this.layer].pity = new Decimal(0)
                    player[this.layer].timesWon = player[this.layer].timesWon.add(1)
                    player[this.layer].lastWin = "win"
                }else{
                    player[this.layer].pity = player[this.layer].pity.add(1)
                    player[this.layer].lastWin = "lose"
                    if (player[this.layer].pity.gte(player[this.layer].maxPity)) {
                        player[this.layer].pity = new Decimal(0)
                        player[this.layer].timesWon = player[this.layer].timesWon.add(1)
                        player.points = player.points.add(player[this.layer].price)
                        player[this.layer].lastWin = "pity"
                    }
                }
            }, 
            style: {
                "width": "300px", 
                "height": "100px", 
                "border-radius": "1%"
            }
        }
    },


    buyables: {
        11:{
            title: "Spezielle Banner",
            display() {return "Erhöht das Preisgeld um 15%\n\nKosten: " + format(this.cost().gacha)+ " Gacha"},
            cost(x) {return {gacha: new Decimal(5).mul(new Decimal(1.2).pow(x))}},
            canAfford() {return player[this.layer].points.gte(this.cost().gacha)},
            buy(){
                player[this.layer].points = player[this.layer].points.sub(this.cost().gacha)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {return hasUpgrade(this.layer, 12)}
        }, 
        12:{
            title: "Geld investieren",
            display() {return "Verbessert die Chance auf gewinnen\n\nKosten: " + format(this.cost().gacha)+ " Gacha"},
            cost(x) {return {gacha: new Decimal(10).mul(new Decimal(3).pow(x))}},
            canAfford() {return player[this.layer].points.gte(this.cost().gacha)},
            buy(){
                player[this.layer].points = player[this.layer].points.sub(this.cost().gacha)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                player[this.layer].gachaChance = player[this.layer].gachaChance.add((new Decimal(100).sub(new Decimal(player[this.layer].gachaChance))).mul(0.05))
            },
            unlocked() {return hasUpgrade(this.layer, 12)}
        },
        13:{
            title: "Updates",
            display() {return "Reduziert maximales Pity um 50%\n\nKosten: " + format(this.cost().gacha)+ " Gacha"},
            cost(x) {return {gacha: new Decimal(20).mul(new Decimal(1.76).pow(x))}},
            canAfford() {return player[this.layer].points.gte(this.cost().gacha)},
            buy(){
                player[this.layer].points = player[this.layer].points.sub(this.cost().gacha)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {return hasUpgrade(this.layer, 12)},
        }
    }, 

    infoboxes: {
        gacha: {
            title: "Gacha", 
            body(){
                return "Kuros Methode um Geld zu machen ist es in Gacha zu investieren mit der Hoffnung auf den großen Sieg. Restte für Gacha und gib Gacha aus um zu rollen. Die Gewinnchance und Preisgeld sind festgelegt. Solltest du verlieren erhöht sich die Pity-Leiste. Wenn diese voll ist, gewinnst du beim nächsten Pull, auch wenn du hättest verlieren sollen. Mit Gacha können verschiedene Aspekte des Systems verbessert werden."
            }
        }
    }
 })

addLayer("b", {
    name: "Brontalo",
    color: "orange", 
    resource: "Taschenrechner",
    row: 0,
    position: 3, 
    type: "normal",
    baseResource: "points",
    baseAmount() {return player.points},
    requires: new Decimal(1),
    exponent: 0.1,
    startData(){ return {
        points: new Decimal(0),
        unlocked: true,
        a: new Decimal(0.1),
        b: new Decimal(0.1),

        result: new Decimal(1)
    }},

    gainExp() {
        let gain = new Decimal(1)

        if (hasUpgrade(this.layer, 12)) gain = gain.add(2)

        return gain
    },

    update(){
        let resultGain = new Decimal(0)
        resultGain = resultGain.add(new Decimal(player[this.layer].points).mul(player[this.layer].a))
        if (hasUpgrade(this.layer, 13)) resultGain = resultGain.add((new Decimal(player[this.layer].points).pow(2)).mul(player[this.layer].b))
    
        player[this.layer].result = resultGain
    },


    euroBoost(){
        if(player[this.layer].result.lte(200000)){ 
            return (new Decimal(player[this.layer].result).add(1)).log10().add(1)
        }else{
            return (new Decimal(player[this.layer].result).add(1)).log10().add(1)
        }
    },

    formulaLabel(){
        if (hasUpgrade(this.layer, 13)){
            return "" + format(player[this.layer].a) + "x + " + format(player[this.layer].b) + "x^2 = " + format(player[this.layer].result) 
        }else{
            return "" + format(player[this.layer].a) + "x = " + format(player[this.layer].result) 
        }
    },

    boosLabel(){
        return "Boost auf Euro-Generation: *" + format(layers.b.euroBoost())
    },

    tabFormat:{
        "Main": {
            content: ["main-display", "blank", "prestige-button", "blank", "upgrades"]
        },
        "Formel": {
            content: ["main-display", "blank", ["display-text", () => layers.b.formulaLabel(), {"font-size": "40px"}], "blank", ["display-text", () => layers.b.boosLabel()], "blank", "buyables"]
        }, 
        "Erklärung": {
            content: [["infobox", "taschenrechner"]]
        }
    },

    upgrades:{
        11: {
            description: "Starte die Euro-Generation: +0.1/sec", 
            cost: new Decimal(1)
        }, 
        12: {
            description: "Verbessere die Formel für Taschenrechner-Erhalt: Euro^0.1 -> Euro^0.3", 
            cost: new Decimal(3)
        }, 
        13: {
            description: "Schalte b und sein Buyable frei", 
            cost: new Decimal(100)
        }, 
        14: {
            description() {return "Taschenrechner multiplizieren Europroduktion: *log(Taschenrechner+1)\n\n Aktuell: "+format(this.effect())}, 
            effect() {return (new Decimal(player[this.layer].points)).add(1).log10().add(1)},
            cost: new Decimal(500)
        }
    }, 

    buyables:{
        11:{
            title: "A erhöhen",
            display() {return "Erhöhe a um 0.1\n\nKosten: " + format(this.cost().taschenrechner)+ " Taschenrechner"},
            cost(x) {return {taschenrechner: new Decimal(1).mul(new Decimal(2).pow(x))}},
            canAfford() {return player[this.layer].points.gte(this.cost().taschenrechner)},
            buy(){
                player[this.layer].points = player[this.layer].points.sub(this.cost().taschenrechner)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                player[this.layer].a = player[this.layer].a.add(0.1)
            },
            unlocked() {return true}
        }, 
        12:{
            title: "B erhöhen",
            display() {return "Erhöhe b um 0.01\n\nKosten: " + format(this.cost().taschenrechner)+ " Taschenrechner"},
            cost(x) {return {taschenrechner: new Decimal(10).mul(new Decimal(2).pow(x))}},
            canAfford() {return player[this.layer].points.gte(this.cost().taschenrechner)},
            buy(){
                player[this.layer].points = player[this.layer].points.sub(this.cost().taschenrechner)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                player[this.layer].b = player[this.layer].b.add(0.01)
            },
            unlocked() {return hasUpgrade(this.layer, 13)}
        }, 
    }, 

    infoboxes: {
        taschenrechner:{
            title: "Taschenrechner", 
            body(){
                return "Brontalos Methode um Geld zu machen ist es einen möglichst große Formel auszurechnen und daraus Geld zu generieren. Unter dem Tab >>Formel<< steht eine Formel mit x. X ist die Anzahl der Taschenrechner die du hast. der Koeffizient kann verbessert werden mit Taschenrechnern. Das Ergebnis der Rechnung ist Grundlage für den Euro-generations-boost. Ab einem Ergebnis von 200.000 wird der Bonus auf die Europroduktion gesoftcapped."
            }
        }
    }
})

addLayer("i", {
    name: "Immobilien",
    startData() { return {
        unlocked: false, 
        points: new Decimal(0),
        shown: false, 

        time: new Decimal(0), 
        maxTime: new Decimal(1000),
        timeRate: new Decimal(5),
        value: new Decimal(1000000), 
        valueChange: new Decimal(0),
        positiveRate: new Decimal(65),
        maxChangePositive: new Decimal(10), 
        maxChangeNegative: new Decimal(8)
        }
    }, 
    color: "grey", 
    row: 1, 
    resource: "Immobilien",
    layerShown() {
        if(player[this.layer].shown){
            return true
        }else{
            if(player.points.gte(new Decimal(100000)) && !player[this.layer].shown){
                player[this.layer].shown = true
            }
            return false
        }
    },
    type: "static",
    baseResource: "points",
    baseAmount() {return player.points},
    requires: new Decimal(1000000),
    exponent: 2,
    base: 2,

    update(){
        player[this.layer].time = player[this.layer].time.add(player[this.layer].timeRate)
        if(player[this.layer].time.gte(player[this.layer].maxTime)){
            player[this.layer].time = new Decimal(0)
            layers.i.changeValueI()
        }
    },
    
    currentValue(){
        let valueText = format(player[this.layer].value)
        let changeText = format(player[this.layer].valueChange)
        if(player[this.layer].valueChange.gte(0)){
            return `Aktueller Wert: <span style="color:green">${valueText} Euro +${changeText}</span>%`
        } else {
            return `Aktueller Wert: <span style="color:red">${valueText} Euro ${changeText}</span>%`
        }
    },

    changeValueI(){
        if(new Decimal(Math.random()*100).lte(player[this.layer].positiveRate)){
            let changeRate = new Decimal(Math.random()).mul(player[this.layer].maxChangePositive).div(100)
            player[this.layer].value = player[this.layer].value.mul(new Decimal(1).add(changeRate))
            player[this.layer].valueChange = changeRate.mul(100)
        }else{
            let changeRate = new Decimal(Math.random()).mul(player[this.layer].maxChangeNegative).div(100).mul(-1)
            player[this.layer].value = player[this.layer].value.mul(new Decimal(1).add(changeRate))
            player[this.layer].valueChange = changeRate.mul(100)
        }
    },

    //Die Frage ist, was bewirkt das wirklich für's gameplay. Könnte kompliziertere Logik einbauen. Growthspurts? Momente, an denen 
    //Der Preis springt, sonst eher niedrig?

    tabFormat: {
        "Main": {
            content: ["main-display", "prestige-button", "milestones"]
        }, 
        "Markt":{
            content: ["main-display", ["bar", "timeBar"], ["display-text", () => layers.i.currentValue(), {"font-size": "40px"}]]
        }
    },


    milestones: {
        0:{
            requirementDescription: "1 Immobilie",
            effectDescription: "*3 Europroduktion", 
            done() {return player[this.layer].points.gte(1)}
        }, 
        1: {
            requirementDescription: "2 Immobilien", 
            effectDescription: "Neue Bückerupgrades", 
            done() {return player[this.layer].points.gte(2)}
        }
    }, 

    bars: {
        timeBar: {
            direction: RIGHT,
            width: 300,
            height: 50,
            fillStyle: {
                "background-color": "grey",
            }, 
            display(){return "" + format(player[this.layer].time) + "/" + format(player[this.layer].maxTime)},
            progress() {return new Decimal(player[this.layer].time).div(player[this.layer].maxTime)},
            unlocked: true,
        },
    },
})

addLayer("lore", {

    tabFormat:{
        "Lore": {
            content:[["infobox", "lore"]]
        }
    },

    infoboxes: {
        lore:{
            title: "lore", 
            body(){
                return "Es war ein schöner Tag in Kümmel. Tofl und Freunde laufen entspannt durch die umtriebigen Straßen. Plötzlich jedoch sieht Tofl etwas in einem Schaufenster! Eine Tafel Schokolade (vergan natürlich), für nur... 10^^10^308 Euro!!!! Was für ein Schnäppchen! <br>Herbsti >>Wie viel soll das denn sein?<< <br>Tofl: >>Mir egal! Ich will die haben!<< <br>Brontalo: >>Das... sind 10 hoch 10 hoch 10 hoch... und so weiter und das 10 hoch 308 mal! Das ist keine Zahl, die irgendjemand sich je vorstellen kann!<< <br>Tofl: >>Ich kann mir alles vorstellen!<< <br>Herbsti: >>Also genaugenommen sind der menschlichen Vorstellungskraft keine Grenzen gesetzt. Wenn man das philosophisch betrachtet...<< <br>Kuro: >>Egal, ob wir uns das jetzt vorstellen können, oder nicht. Wir haben nicht so viel Geld!<< <br>Tofl: >>Dann müssen wir uns eben bei unseren Bootstraps together pullen und das Geld auftreiben!<< <br>Herbsti: >>Gibt es nicht nur 1,6 Billionen Euro überhaupt?<< <br>Brontalo: >>Tofl, ich glaube du unterschätzt, wie viel das wirklich ist...<< <br>Tofl: >>Pscht! Wir werden dieses Geld zusammnbekommen! Und ihr helft mit! Ich will diese Schokolade!<< <br> Kuro: >>Wieso müssen wir jetzt helfen!!!<< <br>Und so machten sich Tofl und ihre Truppe auf, 10^^10^308 Euro zu beschaffen. Jeder hatte eine andere Methode Geld zu machen, doch zusammen würden sie es bestimmt schaffen. Bestimmt..."
            }
        }
    },
    startData(){
        return {
            unlocked: true,
            points: new Decimal(0)
        }
    },
    row: "side"
})

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
        }
    }
})