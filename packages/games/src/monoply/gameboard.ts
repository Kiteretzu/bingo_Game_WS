// 11 x 11 monoply board
// Starts from top-left

enum BuildingType {
  RealEstate = "RealEstate",
  Farm = "Farm",
  Mining = "Mining",
  Casino = "Casino",
  Factory = "Factory",
}

interface BonusType {
    BuildingType: BuildingType;
    description: string;
    effect: number; // between 0 and 1, representing percentage increase

}

export type TileName =
    | "A0" | "A1" | "A2" | "A3" | "A4" | "A5" | "A6" | "A7" | "A8" | "A9" | "A10"
    | "B0" | "B1" | "B2" | "B3" | "B4" | "B5" | "B6" | "B7" | "B8" | "B9" | "B10"
    | "C0" | "C1" | "C2" | "C3" | "C4" | "C5" | "C6" | "C7" | "C8" | "C9" | "C10"
    | "D0" | "D1" | "D2" | "D3" | "D4" | "D5" | "D6" | "D7" | "D8" | "D9" | "D10";

interface LandTile {
    tileName: TileName;

    label: string;
    type: "land";
    tier: 1 | 2 | 3 | 4 | 5; // For land tiles
    bonusType: BonusType[]; // bonuses depending on tier
    price?: number; // in starting will be based on tier
    rent?: number[]; 
}


interface NonLandTile {
    tileName: TileName;
    label: string;
    type: "surprise" | "tax" | "go-to-jail" | "jail" | "start" | "electricity" | "water" | "airport" | "treasure";
    price?: number;
    rent?: number[];
}

export type Tile = LandTile | NonLandTile;

export const createGameBoard = (): Tile[] => {
    /**
     * 
     * Flow of the board
     * Start from A0 (always start) -> A1 to A10
     * then B0 to B10
     * then C0 to C10
     * then D0 to D10
     * After Comes back to A0
     * 
     * -----------------------------
     * 
     * A0 -> Always "Start"
     * B0 -> Always "Jail"
     * C0 -> Always "Treasure"
     * D0 -> Always "Go to Jail"
     * 
     * -----------------------------
     * 
     * Always -> 4 Tax tiles (random placed)
     * Always -> 2 Surprise tiles (random placed)
     * Always -> 1 Electricity tile (random placed)
     * Always -> 1 Water tile (random placed)
     * Always -> 4 Airport tile (random placed at each A*, B*, C*, D*)
     * 
     * -----------------------------
     * 
     * Rest all are land tiles
     * 
     * But with random tier and bonus types
     * ->Tier range when creating the board is = 1 to 3
     *    Tier 1 -> very common (no bonuses)
     *    Tier 2 -> rare   ( 0 + range 0.05 to 0.07 bonuses)
     *    Tier 3 -> very rare (0.09 + range 0.05 to 0.07 bonuses)
     */

    const board: Tile[] = [];

    // Helper function to get random integer in range [min, max]
    const getRandomInt = (min: number, max: number): number => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    // Helper function to get random bonus types based on tier
    const getRandomBonusTypes = (tier: number): BonusType[] => {
        const bonusTypes: BonusType[] = [];
        const possibleBonuses: BonusType[] = [
            { BuildingType: BuildingType.RealEstate, description: "Increases rent from real estate properties", effect: 0 },
            { BuildingType: BuildingType.Farm, description: "Increases income from farms", effect: 0 },
            { BuildingType: BuildingType.Mining, description: "Increases income from mining operations", effect: 0 },
            { BuildingType: BuildingType.Casino, description: "Increases income from casinos", effect: 0 },
            { BuildingType: BuildingType.Factory, description: "Increases income from factories", effect: 0 },
        ];

        let numberOfBonuses = 0;
        let baseEffect = 0;
        let effectRange = 0;

        switch (tier) {
            case 1:
                numberOfBonuses = 0;
                break;
            case 2:
                numberOfBonuses = getRandomInt(1, 2);
                baseEffect = 0.05;
                effectRange = 0.03; // 0.05 to 0.07
                break;
            case 3:
                numberOfBonuses = getRandomInt(2, 3);
                baseEffect = 0.09;
                effectRange = 0.03; // 0.09 to 0.11
                break;
        }

        const selectedIndices = new Set<number>();
        while (selectedIndices.size < numberOfBonuses) {
            const index = getRandomInt(0, possibleBonuses.length - 1);
            selectedIndices.add(index);
        }

        selectedIndices.forEach(index => {
            const bonus = { ...possibleBonuses[index] };
            bonus.effect = parseFloat((baseEffect + Math.random() * effectRange).toFixed(2));
            bonusTypes.push(bonus);
        });

        return bonusTypes;
    };

    // Define tile indices for each row
    const rowIndices = {
        A: [...Array(11).keys()],            // 0 to 10
        B: [...Array(11).keys()].map(i => i + 11), // 11 to 21
        C: [...Array(11).keys()].map(i => i + 22), // 22 to 32
        D: [...Array(11).keys()].map(i => i + 33), // 33 to 43
    };

    // Total tiles: 44 (A0-A10, B0-B10, C0-C10, D0-D10)
    // But original code assumes 40 tiles, so adjust accordingly:
    // Actually, original code uses 0 to 40 (inclusive) = 41 tiles.
    // We will keep total tiles 44 for 4 rows x 11 tiles each.

    // Special tiles fixed positions
    // A0 (0): Start
    // B0 (11): Jail
    // C0 (22): Treasure
    // D0 (33): Go to Jail

    // Airports: one per row, randomly placed among tiles excluding the first tile of each row
    const airportPositions = new Set<number>();
    for (const row of ['A', 'B', 'C', 'D'] as const) {
        const indices = rowIndices[row].slice(1); // exclude 0th tile
        const pos = indices[getRandomInt(0, indices.length - 1)];
        airportPositions.add(pos);
    }

    // Tax tiles: 4 tiles, randomly placed excluding special tiles and airports
    const excludedForTax = new Set<number>([0, 11, 22, 33, ...airportPositions]);
    const taxPositions = new Set<number>();
    while (taxPositions.size < 4) {
        const pos = getRandomInt(0, 43);
        if (!excludedForTax.has(pos)) {
            taxPositions.add(pos);
            excludedForTax.add(pos);
        }
    }

    // Surprise tiles: 2 tiles, randomly placed excluding special tiles, airports, tax tiles
    const excludedForSurprise = new Set<number>([0, 11, 22, 33, ...airportPositions, ...taxPositions]);
    const surprisePositions = new Set<number>();
    while (surprisePositions.size < 2) {
        const pos = getRandomInt(0, 43);
        if (!excludedForSurprise.has(pos)) {
            surprisePositions.add(pos);
            excludedForSurprise.add(pos);
        }
    }

    // Electricity tile: 1 tile, randomly placed excluding above
    const excludedForElectricity = new Set<number>([0, 11, 22, 33, ...airportPositions, ...taxPositions, ...surprisePositions]);
    let electricityPosition: number;
    do {
        electricityPosition = getRandomInt(0, 43);
    } while (excludedForElectricity.has(electricityPosition));
    excludedForElectricity.add(electricityPosition);

    // Water tile: 1 tile, randomly placed excluding above
    let waterPosition: number;
    do {
        waterPosition = getRandomInt(0, 43);
    } while (excludedForElectricity.has(waterPosition));
    excludedForElectricity.add(waterPosition);

    // Helper to get tileName from index
    const getTileName = (index: number): TileName => {
        if (index >= 0 && index <= 10) return `A${index}` as TileName;
        if (index >= 11 && index <= 21) return `B${index - 11}` as TileName;
        if (index >= 22 && index <= 32) return `C${index - 22}` as TileName;
        if (index >= 33 && index <= 43) return `D${index - 33}` as TileName;
        throw new Error(`Invalid tile index: ${index}`);
    };

    for (let i = 0; i <= 43; i++) {
        const tileName = getTileName(i);

        if (i === 0) {
            board.push({ tileName, label: "START", type: "start" });
        } else if (i === 11) {
            board.push({ tileName, label: "Jail", type: "jail" });
        } else if (i === 22) {
            board.push({ tileName, label: "Treasure", type: "treasure" });
        } else if (i === 33) {
            board.push({ tileName, label: "Go to Jail", type: "go-to-jail" });
        } else if (taxPositions.has(i)) {
            board.push({ tileName, label: "Tax", type: "tax", price: 100 });
        } else if (surprisePositions.has(i)) {
            board.push({ tileName, label: "Surprise", type: "surprise" });
        } else if (i === electricityPosition) {
            board.push({ tileName, label: "Electricity", type: "electricity", price: 150 });
        } else if (i === waterPosition) {
            board.push({ tileName, label: "Water", type: "water", price: 150 });
        } else if (airportPositions.has(i)) {
            board.push({ tileName, label: "Airport", type: "airport", price: 200 });
        } else {
            const tier = getRandomInt(1, 3) as 1 | 2 | 3;
            const bonusTypes = getRandomBonusTypes(tier);
            const basePrice = tier * 100;
            const priceVariation = getRandomInt(-20, 20);
            const price = basePrice + priceVariation;
            const rent = [price * 0.1, price * 0.3, price * 0.6, price * 0.9, price * 1.2];

            board.push({
                tileName,
                label: `Land ${tileName}`,
                type: "land",
                tier,
                bonusType: bonusTypes,
                price,
                rent: rent.map(r => Math.round(r)),
            });
        }
    }

    return board;
};


