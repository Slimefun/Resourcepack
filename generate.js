// FileSystem access, promises-friendly :)
const fs = require('fs').promises;

// Templates for json handlers
const templates = {
    ITEM: (item, overrides) => {
        fs.writeFile(`assets/minecraft/models/item/${item}.json`, JSON.stringify({
            parent: "item/generated",
            textures: {
                "layer0": "item/" + item
            },
            overrides: overrides
        }), "UTF-8");
    },
	FIREWORK_STAR: (item, overrides) => {
		fs.writeFile(`assets/minecraft/models/item/${item}.json`, JSON.stringify({
            parent: "item/generated",
            textures: {
                "layer0": "item/firework_star",
				"layer1": "item/firework_star_overlay"
            },
            overrides: overrides
        }), "UTF-8");
	},
	SKULL: (item, overrides) => {
		fs.writeFile(`assets/minecraft/models/item/${item}.json`, JSON.stringify({
            parent: "item/template_skull",
            overrides: overrides
        }), "UTF-8");
	}
}

Promise.all([
    fs.mkdir("assets/minecraft/models/item", {recursive:true}),
    fs.mkdir("assets/minecraft/models/slimefun", {recursive:true})
]).then(() => fs.readFile("models.json", "UTF-8").then(models => {
    let json = JSON.parse(models);
    let yml = "";
    let minecraft = {};

    for (let slimefunItem in json) {
        let cfg = json[slimefunItem];
        console.log(`Found ${cfg.template} "${slimefunItem}"`);
        yml += slimefunItem + ": " + cfg.data + "\n";

        if (!minecraft[cfg.item]) minecraft[cfg.item] = [slimefunItem];
        else minecraft[cfg.item].push(slimefunItem);

        console.log("Generating 'model.json'...");
		let id = cfg.id ? cfg.id: slimefunItem.toLowerCase();
		let texture = cfg.texture ? cfg.texture: id;

        fs.writeFile(`assets/minecraft/models/slimefun/${id}.json`, JSON.stringify({
            parent: "item/generated",
            textures: {
                "layer0": "slimefun/" + texture
            }
        }), "UTF-8");
    }

    for (let item in minecraft) {
        console.log(`Altering "${item}.json"`);
        var overrides = [];
        var template = "NONE";

        for (let i in minecraft[item]) {
            let slimefunItem = json[minecraft[item][i]];
			let id = slimefunItem.id ? slimefunItem.id: minecraft[item][i].toLowerCase();
            template = slimefunItem.template;

            overrides.push({
                predicate: {
                    custom_model_data: slimefunItem.data
                },
                "model": "slimefun/" + id
            });
        }

        overrides.sort((a, b) => a.predicate.custom_model_data - b.predicate.custom_model_data);
        templates[template](item, overrides);
    }

    console.log("Exporting 'item-models.yml'");
    fs.writeFile("item-models.yml", yml, "UTF-8");
}));
