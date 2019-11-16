const fs = require('fs').promises;

Promise.all([
    fs.mkdir("pack/assets/minecraft/models/item", {recursive:true}),
    fs.mkdir("pack/assets/minecraft/models/slimefun", {recursive:true})
]).then(() => fs.readFile("models.json", "UTF-8").then(models => {
    let json = JSON.parse(models);
    let yml = "";
    let minecraft = {};

    for (let slimefunItem in json) {
        let cfg = json[slimefunItem];
        console.log(`Found ${cfg.type} "${slimefunItem}"`);
        yml += slimefunItem + ": " + cfg.data + "\n";

        if (cfg.type === "ITEM") {
            if (!minecraft[cfg.item]) minecraft[cfg.item] = [slimefunItem];
            else minecraft[cfg.item].push(slimefunItem);

            console.log("Generating 'model.json'...");

            fs.writeFile(`pack/assets/minecraft/models/slimefun/${cfg.id}.json`, JSON.stringify({
                parent: "item/generated",
                textures: {
                    "layer0": "slimefun/" + cfg.texture
                }
            }), "UTF-8");
        }
    }

    for (let item in minecraft) {
        console.log(`Altering "${item}.json"`);
        var overrides = [];
        var type = "NONE";

        for (let i in minecraft[item]) {
            let slimefunItem = json[minecraft[item][i]];
            type = slimefunItem.type;

            overrides.push({
                predicate: {
                    custom_model_data: slimefunItem.data
                },
                "model": "slimefun/" + slimefunItem.id
            });
        }

        overrides.sort((a, b) => a.predicate.custom_model_data - b.predicate.custom_model_data);

        if (type == "ITEM") {
            fs.writeFile(`pack/assets/minecraft/models/item/${item}.json`, JSON.stringify({
                parent: "item/generated",
                textures: {
                    "layer0": "item/" + item
                },
                overrides: overrides
            }), "UTF-8");
        }
    }

    console.log("Exporting 'item-models.yml'");
    fs.writeFile("item-models.yml", yml, "UTF-8");
}));
