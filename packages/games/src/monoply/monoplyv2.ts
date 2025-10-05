import { createGameBoard, Tile, TileName } from "./gameboard";

interface Player {
    id: number;
    name: string;
    position: TileName; 
    money: number;
    ownedAssets: Tile[]; // list of property IDs owned
    inJail: boolean;
    jailTurns: number; // number of turns in jail
}

class MonopolyGame {
    private players: Player[];
    private assets: Tile[];
    private playerOrder: number[]; // order of player turns
    private currentPlayerIndex: number;
    private gameBoard: Tile[];
    private awaitingPropertyDecision: boolean; // flag to track if waiting for buy decision

    constructor(assets: Tile[]) {
        this.players = [];
        this.assets = assets;
        this.playerOrder = [];
        this.currentPlayerIndex = 0;
        this.gameBoard = [];
        this.awaitingPropertyDecision = false;

        this.initializeGameBoard();
    }

    private initializeGameBoard() {
        // Initialize the game board with the provided assets
        this.gameBoard = createGameBoard();
    }

    public addPlayerToGame(player: Player) {
        this.players.push(player);
        this.playerOrder.push(player.id);
    }

    private rollDice(): [number, number] {
        const die1 = Math.floor(Math.random() * 6) + 1;
        const die2 = Math.floor(Math.random() * 6) + 1;
        return [die1, die2];
    }

    private movePlayer(playerId: number, spaces: number) {
        const player = this.players.find(p => p.id === playerId);
        if (!player) throw new Error('Player not found');

        // Update player position
        const currentIndex = this.gameBoard.findIndex(tile => tile.tileName === player.position);
        const newIndex = (currentIndex + spaces) % this.gameBoard.length;
        player.position = this.gameBoard[newIndex].tileName;

        // Handle passing "Start"
        if (newIndex < currentIndex) {
            player.money += 200; // Collect $200 for passing Start
            console.log(`${player.name} passed Start and collected $200`);
        }
    }

    private getCurrentPlayer(): Player {
        const playerIndex = this.playerOrder[this.currentPlayerIndex];
        return this.players[playerIndex];
    }

    private nextTurn() {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.playerOrder.length;
        this.awaitingPropertyDecision = false;
    }

    // Handle when player lands on Land tile
    private handleLandTile(player: Player, tile: Tile) {
        if (tile.type !== 'land') return;

        const property = tile;
        if (!property) return;

        // Check if property is owned
        const owner = this.players.find(p => p.ownedAssets.includes(property));
        
        if (owner && owner.id !== player.id) {
            // Property is owned by another player - pay rent
            let rentAmount = 0;
            
            if (property.building && property.building > 0) {
                // Property has buildings - pay building rent (which includes base rent)
                rentAmount = property.rent ? property.rent[property.building] : 0;
                console.log(`${player.name} landed on ${property.tileName} owned by ${owner.name} with ${property.building} building(s). Paying rent: $${rentAmount}`);
            } else {
                // No buildings - just pay base land rent
                rentAmount = property.rent ? property.rent[0] : 0;
                console.log(`${player.name} landed on ${property.tileName} owned by ${owner.name} with no buildings. Paying base rent: $${rentAmount}`);
            }
            
            player.money -= rentAmount;
            owner.money += rentAmount;
            
            console.log(`${player.name} now has $${player.money}. ${owner.name} now has $${owner.money}`);
            
        } else if (!owner) {
            // Property is not owned - player can choose to buy
            console.log(`${property.tileName} is available for purchase at $${property.price}`);
            console.log(`${player.name} has $${player.money} available`);
            
            // Set flag that we're waiting for a buy/skip decision
            this.awaitingPropertyDecision = true;
              
            // DO NOT end turn here - need to wait for buy property decision
            return; 
        } else {
            // Player owns this property 
            console.log(`${player.name} landed on their own property: ${property.tileName}`);
        }
    }

    // Method to handle property purchase decision
    public buyProperty(shouldBuy: boolean): boolean {
        if (!this.awaitingPropertyDecision) {
            console.log("No property purchase decision pending");
            return false;
        }

        const player = this.getCurrentPlayer();
        const currentTile = this.gameBoard.find(tile => tile.tileName === player.position);
        
        if (!currentTile || currentTile.type !== 'land') {
            console.log("Current tile is not a purchasable property");
            this.awaitingPropertyDecision = false;
            return false;
        }

        if (shouldBuy) {
            if (player.money >= currentTile.price) {
                player.money -= currentTile.price;
                player.ownedAssets.push(currentTile);
                console.log(`${player.name} purchased ${currentTile.tileName} for $${currentTile.price}`);
                console.log(`${player.name} now has $${player.money}`);
            } else {
                console.log(`${player.name} cannot afford ${currentTile.tileName} (costs $${currentTile.price}, has $${player.money})`);
            }
        } else {
            console.log(`${player.name} declined to purchase ${currentTile.tileName}`);
        }

        // Don't end turn automatically
        this.awaitingPropertyDecision = false;
        return true;
    }

    public endTurn() {
        if (this.awaitingPropertyDecision) {
            console.log("Cannot end turn - awaiting property decision");
            return;
        }

        console.log(`${this.getCurrentPlayer().name} ended their turn`);
        this.nextTurn();
    }

    public playTurn() {
        if (this.awaitingPropertyDecision) {
            console.log("Cannot roll dice - waiting for property purchase decision");
            return;
        }

        const player = this.getCurrentPlayer();
        const [die1, die2] = this.rollDice();
        const totalMove = die1 + die2;

        console.log(`\n--- ${player.name}'s Turn ---`);
        console.log(`${player.name} rolled ${die1} and ${die2}, moving ${totalMove} spaces.`);
        
        this.movePlayer(player.id, totalMove);

        // Get the tile the player landed on
        const currentTile = this.gameBoard.find(tile => tile.tileName === player.position);
        console.log(`${player.name} landed on ${currentTile?.tileName}`);
        
        if (currentTile) {
            if (currentTile.type === 'land') {
                this.handleLandTile(player, currentTile);
                
                // If awaiting decision, don't end turn
                if (this.awaitingPropertyDecision) {
                    return;
                }
            }
            // Handle other tile types here (jail, tax, chance, etc.)
        }

        // End turn if no property decision is needed
        this.nextTurn();
    }

    // Utility methods
    public getGameState() {
        return {
            players: this.players,
            currentPlayer: this.getCurrentPlayer(),
            awaitingPropertyDecision: this.awaitingPropertyDecision
        };
    }

    public getPlayerInfo(playerId: number): Player | undefined {
        return this.players.find(p => p.id === playerId);
    }
}

export { MonopolyGame, Player };