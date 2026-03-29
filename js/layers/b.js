

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
        c: new Decimal(1),
        x: new Decimal(0),

        result: new Decimal(1)
    }},

    gainExp() {
        let gain = new Decimal(1)

        if (hasUpgrade(this.layer, 12)) gain = gain.add(2)

        return gain
    },

    update(){
        if(hasUpgrade(this.layer, 21)){
            if(player[this.layer].points.gte(player[this.layer].x)){
                player[this.layer].x = player[this.layer].points
            }
        }else{
            player[this.layer].x = player[this.layer].points
        }

        let resultGain = new Decimal(0)
        resultGain = resultGain.add(player[this.layer].x.mul(player[this.layer].a))
        if (hasUpgrade(this.layer, 13)) resultGain = resultGain.add((player[this.layer].x.pow(2)).mul(player[this.layer].b))

        //c muss am ende kommen
        if (hasUpgrade(this.layer, 22)) resultGain = resultGain.pow(player[this.layer].c)
    
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
            if (hasUpgrade(this.layer, 22)){
                return "(" + format(player[this.layer].a) + 
                "x + " + format(player[this.layer].b) + 
                "x^2)^" + format(player[this.layer].c, 3) +
                " = " + format(player[this.layer].result)
            }else{
            return "" + format(player[this.layer].a) + 
            "x + " + format(player[this.layer].b) + 
            "x^2 = " + format(player[this.layer].result) 
            }
        }else{
            return "" + format(player[this.layer].a) + "x = " + format(player[this.layer].result) 
        }
    },

    boosLabel(){
        return "Boost auf Euro-Generation: *" + format(layers.b.euroBoost())
    },

    identificationLabel(){
        return "x = " + (hasUpgrade(this.layer, 21) ? format(player[this.layer].x) : format(player[this.layer].points)) + 
        "<br>a = " +format(player[this.layer].a) + 
        "<br>" + (hasUpgrade(this.layer, 13) ? "b = " + format(player[this.layer].b) : "") +
        "<br>" + (hasUpgrade(this.layer, 21) ? "c = " + format(player[this.layer].c, 3) : "")
    },

    tabFormat:{
        "Main": {
            content: ["main-display", "blank", "prestige-button", "blank", "upgrades"]
        },
        "Formel": {
            content: ["main-display", "blank", 
                ["display-text", () => layers.b.formulaLabel(), {"font-size": "40px"}], "blank", 
                ["display-text", () => layers.b.boosLabel()], "blank", 
                ["display-text", () => layers.b.identificationLabel()], 
                "blank", "buyables"]
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
        },
        21: {
            description: "x ist nun die höchste Menge an Taschenrechner, nicht die aktuelle.",
            cost: new Decimal(100), 
            unlocked() {return hasMilestone("i", 3)}
        }, 
        22: {
            description: "Schalte c und sein Buyable frei. (Benötigt dass b freigeschaltet ist.)", 
            cost: new Decimal(500), 
            canAfford() {return hasUpgrade(this.layer, 13)}, 
            unlocked() {return hasMilestone("i", 3)}
        }, 
        23: {
            description() {return "(a + b + c) multipliziert die Europroduktion. (Wenn nicht freigeschaltet ist b = 0.1 und c = 1) <br>Aktuell: " + format(this.effect(), 3)}, 
            effect() {return new Decimal(player[this.layer].a).add(player[this.layer].b).add(player[this.layer].c)}, 
            cost: new Decimal(350), 
            unlocked() {return hasMilestone("i", 3)}
        }, 
        24: {
            description: "Schalte den Kostenslasher frei.", 
            cost: new Decimal(1000), 
            unlocked() {return hasMilestone("i", 3)}
        }
    }, 

    buyables:{
        11:{
            title: "A erhöhen",
            display() {return "Erhöhe a um 0.1\n\nKosten: " + format(this.cost().taschenrechner)+ " Taschenrechner"},
            cost(x) {return {taschenrechner: new Decimal(1).mul(new Decimal(2).pow(x)).div(new Decimal(1).mul(new Decimal(2).mul(getBuyableAmount(this.layer, 21))))}},
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
            cost(x) {return {taschenrechner: new Decimal(10).mul(new Decimal(2).pow(x)).div(new Decimal(1).mul(new Decimal(2).mul(getBuyableAmount(this.layer, 21))))}},
            canAfford() {return player[this.layer].points.gte(this.cost().taschenrechner)},
            buy(){
                player[this.layer].points = player[this.layer].points.sub(this.cost().taschenrechner)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                player[this.layer].b = player[this.layer].b.add(0.01)
            },
            unlocked() {return hasUpgrade(this.layer, 13)}
        }, 
        13: {
            title: "C erhöhen",
            display() {return "Erhöhe c um 0.001\n\nKosten: " + format(this.cost().taschenrechner)+ " Taschenrechner"},
            cost(x) {return {taschenrechner: new Decimal(50).mul(new Decimal(2.5).pow(x)).div(new Decimal(1).mul(new Decimal(2).mul(getBuyableAmount(this.layer, 21))))}},
            canAfford() {return player[this.layer].points.gte(this.cost().taschenrechner)},
            buy(){
                player[this.layer].points = player[this.layer].points.sub(this.cost().taschenrechner)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                player[this.layer].c = player[this.layer].c.add(0.001)
            },
            unlocked() {return hasUpgrade(this.layer, 22)}
        }, 
        21: {
            title: "Kostenslasher", 
            display() {return "Dividiere die Kosten der variablen-Buyables durch 2. \n Aktuell: " + format(getBuyableAmount(this.layer, this.id)) + "\n\nKosten: " + format(this.cost().taschenrechner)}, 
            cost(x) {return {taschenrechner: new Decimal(100).mul(new Decimal(5).pow(x))}}, 
            canAfford() {return player[this.layer].points.gte(this.cost().taschenrechner)},
            buy(){
                player[this.layer].points = player[this.layer].points.sub(this.cost().taschenrechner)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {return hasUpgrade(this.layer, 24)},
            style: {
                "height": "100px", 
                "width": "600px",
                "border-radius": "0px", 
            }
        }
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