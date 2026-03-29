

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