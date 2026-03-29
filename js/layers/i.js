

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
    type: "custom",
    baseResource: "points",
    baseAmount() {return player.points},
    requires: new Decimal(1000000),

    //AI code from here to
    canBuyMax() { return true },

    getResetGain() {
        let current = player[this.layer].points
        let points = player.points
        let baseCost = new Decimal(1000000)
        let nextCost = baseCost.mul(new Decimal(2).pow(current))
        if (points.lt(nextCost)) return new Decimal(0)

        // Solve points >= baseCost*2^current * (2^k - 1)
        let available = points.div(baseCost.mul(new Decimal(2).pow(current)))
        let gain = available.add(1).log(2).floor()
        return gain.max(0)
    },

    getNextAt(canMax = false) {
        let current = player[this.layer].points
        let baseCost = new Decimal(1000000)
        let singleCost = baseCost.mul(new Decimal(2).pow(current))

        if (!canMax) {
            return singleCost
        }

        let gain = this.getResetGain()
        if (gain.lte(0)) return singleCost

        // Total cost to buy 'gain' from current level
        return baseCost.mul(new Decimal(2).pow(current)).mul(new Decimal(2).pow(gain).sub(1))
    },

    canReset() {
        return this.getResetGain().gt(0)
    },

    prestigeButtonText() {
        let gain = this.getResetGain()
        let nextAt = this.getNextAt(false)
        return `Reset for +<b>${formatWhole(gain)}</b> Immobilien<br><br>Next at ${format(nextAt)} points`
    },

    prestigeNotify() {
        return this.canReset()
    },

    //here
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
        if(new Decimal(Math.random()*100).lte(player[this.layer].positiveRate) && player["i"].points.gte(10)){
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
            content: ["main-display", "blank", "prestige-button", "blank", "milestones"]
        }, 
        "Markt":{
            content: ["main-display", "blank", ["bar", "timeBar"], "blank", ["display-text", () => layers.i.currentValue(), {"font-size": "40px"}], "blank", ["clickable", "sell"]],
            unlocked() {return player["i"].points.gte(10)}
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
            effectDescription: "Neue Bücherupgrades", 
            done() {return player[this.layer].points.gte(2)}
        }, 
        2: {
            requirementDescription: "3 Immobilien", 
            effectDescription() { return "Die Menge an Immobilien, die du hast verbessert das Gacha-Preisgeld. \n Aktuell: *" + format(player[this.layer].points.lte(10) ? player[this.layer].points : 10) + " (Maximal *10)"},
            done() {return player[this.layer].points.gte(3)},
        }, 
        3: {
            requirementDescription: "4 Immobilien", 
            effectDescription: "Neue Taschenrechnerupgrades",
            done() {return player[this.layer].points.gte(4)}
        }, 
        4: {
            requirementDescription: "5 Immobilien", 
            effectDescription: "Immobilien reduzieren Teepreise", 
            done() {return player[this.layer].points.gte(5)}
        }, 
        5: {
            requirementDescription: "6 Immobilien", 
            effectDescription: "Neue Gachaupgrades", 
            done() {return player[this.layer].points.gte(6)}
        }, 
        6: {
            requirementDescription: "7 Immobilien", 
            effectDescription: "Immobilien bossten Euro-Generierung.", 
            done() {return player[this.layer].points.gte(7)}
        }, 
        8: {
            requirementDescription: "8 Immobilien", 
            effectDescription: "Neue Teeupgrades", 
            done() {return player[this.layer].points.gte(8)}
        }, 
        9: {
            requirementDescription: "10 Immobilien", 
            effectDescription: "Schalte den Markt frei", 
            done() {return player[this.layer].points.gte(10)}
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

    clickables: {
        sell: {
            title: "Immobilie verkaufen!",
            canClick() {
                return player[this.layer].points.gte(1)
            },
            onClick(){
                player[this.layer].points = player[this.layer].points.sub(1)
                player.points = player.points.add(player[this.layer].value)
                player[this.layer].value = new Decimal("1e6")
            }
        }
    }
})