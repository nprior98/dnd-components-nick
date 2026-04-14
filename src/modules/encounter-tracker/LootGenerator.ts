import * as fs from "fs";
import * as path from "path";

// Random num gen.  Makes the loot generated more random.  I love getting 5 plain maces from a dwarf.  Why did he have those?
function getRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Loot Generator class
export class LootGenerator {
  private armor: string[] = [];
  private weapons: string[] = [];
  private magicItems: string[] = [];
  private lootPool: string[] = [];

  constructor(private dataPath: string) {
    this.loadAllItems();
  }

  // Grab names of items
  private loadFolder(folder: string): string[] {
    const folderPath = path.join(this.dataPath, folder);
    const files = fs.readdirSync(folderPath);

    return files.map((file) => {
      const raw = fs.readFileSync(path.join(folderPath, file), "utf-8");
      const json = JSON.parse(raw);
      return json.name as string;
    });
  }

  // Loads the api items
  private loadAllItems() {
    this.armor = this.loadFolder("Armor");
    this.weapons = this.loadFolder("Weapons");
    this.magicItems = this.loadFolder("MagicItems");
  }

  // Generates the loot based on the monsters killed in an encounter
  generateLoot(monsterCount: number) {
    this.lootPool = [];

    const rolls = Math.max(1, Math.floor(monsterCount * 1.5));

    for (let i = 0; i < rolls; i++) {
      const roll = Math.random();

      if (roll < 0.5) {
        this.lootPool.push(getRandom(this.weapons));
      } else if (roll < 0.8) {
        this.lootPool.push(getRandom(this.armor));
      } else {
        // Magic chance scales with monsters
        const magicChance = Math.min(0.2 + monsterCount * 0.02, 0.6);

        if (Math.random() < magicChance) {
          this.lootPool.push(getRandom(this.magicItems));
        } else {
          this.lootPool.push(getRandom(this.weapons));
        }
      }
    }
  }

  // Returns the pool of loot
  getLoot(): string[] {
    return this.lootPool;
  }
}
