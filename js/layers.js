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
            onPurchase() {this.buyables[12].unlocked()}
        }
    },


    buyables: {
        11: {
            title: "Tofl-Generation",
            cost(x) { return {tofls: new Decimal(1).mul(new Decimal(2).pow(x))}},
            effect(x) {
                return x.div(10)
            },
            style: {
                "border-radius": "0%",
            },
            display() { return "Start generating Tofls.\n +0.1 per level.\n\n Currently:  " + format(this.effect()) + " Tofls/sec\n\nCost: " + format(this.cost().tofls) + " Tofls" },
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
                return x.mul(1.2)
            },
            style: {
                "border-radius": "0%",
            },
            display() { return "Multiply Tofl-Generation by 1.2\n\n Currently:  " + format(this.effect()) + " \n\nCost: " + format(this.cost().tofls) + " Tofls" },
            canAfford() { return player.points.gte(this.cost().tofls) },
            buy() {
                player.points = player.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {if (hasUpgrade(this.layer, 11)) {true} else {false}},
        }
    },
 })