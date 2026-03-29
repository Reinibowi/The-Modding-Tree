

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

        if(hasMilestone("i", 2)) priceGain = priceGain.mul(player["i"].points.lte(10) ? player["i"].points : 10)

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