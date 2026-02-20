addLayer('t', {
    name: "Tofls",
    startData(){
        return {
            unlocked: true,
            points: new Decimal(0)

        }
    },
    color: "yellow",
    resource: "Toflls",
    row: 0,



    upgrades:{
        11: {
            title: "Tofl-Increase",
            description: "Unlocks the second Tofl-Buyable.",
            cost: new Decimal(30),
            currencyDisplayName: "Tofls",
            currencyInternalName: "points",
        },
        12: {
            title: "Tofl-Increase 2",
            description: "Unlocks the third Tofl-Buyable",
            cost: new Decimal(200),
            currencyDisplayName: "Tofls", 
            currencyInternalName: "points",
        }, 
        13: {
            title: "Tofl-Increase 3",
            description: "Unlocks the fourth Tofl-Buyable",
            cost: new Decimal(300),
            currencyDisplayName: "Tofls", 
            currencyInternalName: "points",
        }
    },


    buyables: {
        11: {
            title: "Tofl-Generation",
            cost(x) { return {tofls: new Decimal(1).mul(new Decimal(2).pow(x))}},
            effect(x) {
                return (new Decimal(0.1).add(buyableEffect(this.layer, 14))).mul(x)
            },
            style: {
                "border-radius": "0%",
            },
            display() { return "Start generating Tofls.\n +"+ format(new Decimal(0.1).add(buyableEffect(this.layer, 14))) + " per level.\n\n Currently:  " + format(this.effect()) + " Tofls/sec\n\nCost: " + format(this.cost().tofls) + " Tofls" },
            canAfford() { return player.points.gte(this.cost().tofls) },
            buy() {
                player.points = player.points.sub(this.cost().tofls)
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
            display() { return "Multiply Tofl-Generation by 1.2\n\n Currently:  " + format(this.effect()) + " \n\nCost: " + format(this.cost().tofls) + " Tofls" },
            canAfford() { return player.points.gte(this.cost().tofls) },
            buy() {
                player.points = player.points.sub(this.cost().tofls)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {return hasUpgrade(this.layer, 11)},
        }, 
        13: {
            title: "Tofl-Exponentation",
            cost(x) { return {tofls: new Decimal(1).mul(new Decimal(20).pow(x))}},
            effect(x) {
                return (x.mul(0.01)).add(1)
            },
            style: {
                "border-radius": "0%",
            },
            display() { return "Raise the Tofl-Generation to the 1.01th power\n\n Currently:  " + format(this.effect()) + " \n\nCost: " + format(this.cost().tofls) + " Tofls" },
            canAfford() { return player.points.gte(this.cost().tofls) },
            buy() {
                player.points = player.points.sub(this.cost().tofls)
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
            canAfford() { return player.points.gte(this.cost().tofls) },
            buy() {
                player.points = player.points.sub(this.cost().tofls)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {return hasUpgrade(this.layer, 13)},
        }
    },
 })