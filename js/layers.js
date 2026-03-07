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

    infoboxes: {
        tee: {
            title: "Tee", 
            body() {
                return "Tofls Methode um Geld zu machen ist es Tee anzupflanzen und zu verkaufen. Resette deine Euros für Samen und nutze die Samen um Tee zu pflanzen mit verschiedenen Effekten."
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
            lastWin: "nothing"
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

        priceGain = priceGain.mul(new Decimal(1.02).pow(getBuyableAmount("k", 11)))
        
        if(hasUpgrade("k", 13)) priceGain = priceGain.mul(upgradeEffect("k", 13))

        player[this.layer].price = priceGain
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
                    player[this.layer].lastWin = "win"
                }else{
                    player[this.layer].pity = player[this.layer].pity.add(1)
                    player[this.layer].lastWin = "lose"
                    if (player[this.layer].pity.gte(player[this.layer].maxPity)) {
                        player[this.layer].pity = new Decimal(0)
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
            display() {return "Erhöht das Preisgeld um 2%\n\nKosten: " + format(this.cost().gacha)+ " Gacha"},
            cost(x) {return {gacha: new Decimal(5).mul(new Decimal(2).pow(x))}},
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
            display() {return "Reduziert maximales Pity um 1\n\nKosten: " + format(this.cost().gacha)+ " Gacha"},
            cost(x) {return {gacha: new Decimal(20).mul(new Decimal(1.76).pow(x))}},
            canAfford() {return player[this.layer].points.gte(this.cost().gacha)},
            buy(){
                player[this.layer].points = player[this.layer].points.sub(this.cost().gacha)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                player[this.layer].maxPity = player[this.layer].maxPity.sub(1)
            },
            unlocked() {return hasUpgrade(this.layer, 12)},
            purchaseLimit: 190
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
        return (new Decimal(player[this.layer].result).add(1)).log10().add(1)
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
                return "Brontalos Methode um Geld zu machen ist es einen möglichst große Formel auszurechnen und daraus Geld zu generieren. Unter dem Tab >>Formel<< steht eine Formel mit x. X ist die Anzahl der Taschenrechner die du hast. der Koeffizient kann verbessert werden mit Taschenrechnern. Das Ergebnis der Rechnung ist Grundlage für den Euro-generations-boost."
            }
        }
    }
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