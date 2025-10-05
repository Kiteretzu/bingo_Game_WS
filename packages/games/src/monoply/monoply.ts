type PropertyType = 'street' | 'railroad' | 'utility' | 'special';

interface Property {
  id: number;
  name: string;
  type: PropertyType;
  price: number;
  rent: number[];
  houseCost?: number;
  hotelCost?: number;
  color?: string;
}

interface Player {
  id: number;
  name: string;
  position: number;
  money: number;
  properties: number[];
  inJail: boolean;
  jailTurns: number;
}

interface Building {
  propertyId: number;
  houses: number;
  hotel: boolean;
}

class Monopoly {
  private players: Map<number, Player>;
  private properties: Map<number, Property>;
  private buildings: Map<number, Building>;
  private currentPlayerIndex: number;
  private playerOrder: number[];

  constructor() {
    this.players = new Map();
    this.properties = new Map();
    this.buildings = new Map();
    this.currentPlayerIndex = 0;
    this.playerOrder = [];
    this.initializeBoard();
  }

  private initializeBoard(): void {
    // Sample properties (simplified Monopoly board)
    const boardProperties: Property[] = [
      { id: 0, name: 'GO', type: 'special', price: 0, rent: [] },
      { id: 1, name: 'Mediterranean Avenue', type: 'street', price: 60, rent: [2, 10, 30, 90, 160, 250], houseCost: 50, color: 'brown' },
      { id: 2, name: 'Community Chest', type: 'special', price: 0, rent: [] },
      { id: 3, name: 'Baltic Avenue', type: 'street', price: 60, rent: [4, 20, 60, 180, 320, 450], houseCost: 50, color: 'brown' },
      { id: 4, name: 'Income Tax', type: 'special', price: 0, rent: [] },
      { id: 5, name: 'Reading Railroad', type: 'railroad', price: 200, rent: [25, 50, 100, 200] },
      { id: 6, name: 'Oriental Avenue', type: 'street', price: 100, rent: [6, 30, 90, 270, 400, 550], houseCost: 50, color: 'lightblue' },
      { id: 7, name: 'Chance', type: 'special', price: 0, rent: [] },
      { id: 8, name: 'Vermont Avenue', type: 'street', price: 100, rent: [6, 30, 90, 270, 400, 550], houseCost: 50, color: 'lightblue' },
      { id: 9, name: 'Connecticut Avenue', type: 'street', price: 120, rent: [8, 40, 100, 300, 450, 600], houseCost: 50, color: 'lightblue' },
      { id: 10, name: 'Jail', type: 'special', price: 0, rent: [] },
      // Add more properties as needed...
    ];

    boardProperties.forEach(prop => this.properties.set(prop.id, prop));
  }

  // Player Management
  addPlayer(name: string): number {
    const id = this.players.size;
    const player: Player = {
      id,
      name,
      position: 0,
      money: 1500,
      properties: [],
      inJail: false,
      jailTurns: 0
    };
    this.players.set(id, player);
    this.playerOrder.push(id);
    return id;
  }

  getPlayer(playerId: number): Player | undefined {
    return this.players.get(playerId);
  }

  getCurrentPlayer(): Player | undefined {
    const playerId = this.playerOrder[this.currentPlayerIndex];
    return this.players.get(playerId);
  }

  // Movement
  movePlayer(playerId: number, spaces: number): void {
    const player = this.players.get(playerId);
    if (!player) throw new Error('Player not found');

    const oldPosition = player.position;
    player.position = (player.position + spaces) % 40;

    // Check if passed GO
    if (player.position < oldPosition) {
      player.money += 200;
      console.log(`${player.name} passed GO and collected $200`);
    }
  }

  setPlayerPosition(playerId: number, position: number): void {
    const player = this.players.get(playerId);
    if (!player) throw new Error('Player not found');
    player.position = position;
  }

  // Property Management
  buyProperty(playerId: number, propertyId: number): boolean {
    const player = this.players.get(playerId);
    const property = this.properties.get(propertyId);

    if (!player || !property) return false;
    if (property.type === 'special') return false;
    if (this.isPropertyOwned(propertyId)) return false;
    if (player.money < property.price) return false;

    player.money -= property.price;
    player.properties.push(propertyId);
    return true;
  }

  isPropertyOwned(propertyId: number): boolean {
    for (const player of this.players.values()) {
      if (player.properties.includes(propertyId)) return true;
    }
    return false;
  }

  getPropertyOwner(propertyId: number): Player | undefined {
    for (const player of this.players.values()) {
      if (player.properties.includes(propertyId)) return player;
    }
    return undefined;
  }

  // Building Management
  buildHouse(playerId: number, propertyId: number): boolean {
    const player = this.players.get(playerId);
    const property = this.properties.get(propertyId);

    if (!player || !property) return false;
    if (!player.properties.includes(propertyId)) return false;
    if (property.type !== 'street' || !property.houseCost) return false;

    let building = this.buildings.get(propertyId);
    if (!building) {
      building = { propertyId, houses: 0, hotel: false };
      this.buildings.set(propertyId, building);
    }

    if (building.hotel || building.houses >= 4) return false;
    if (player.money < property.houseCost) return false;

    player.money -= property.houseCost;
    building.houses++;
    return true;
  }

  buildHotel(playerId: number, propertyId: number): boolean {
    const player = this.players.get(playerId);
    const property = this.properties.get(propertyId);

    if (!player || !property) return false;
    if (!player.properties.includes(propertyId)) return false;
    if (property.type !== 'street' || !property.hotelCost) return false;

    const building = this.buildings.get(propertyId);
    if (!building || building.houses < 4 || building.hotel) return false;
    if (player.money < property.hotelCost) return false;

    player.money -= property.hotelCost;
    building.hotel = true;
    building.houses = 0;
    return true;
  }

  getBuildings(propertyId: number): Building | undefined {
    return this.buildings.get(propertyId);
  }

  // Rent Calculation
  calculateRent(propertyId: number): number {
    const property = this.properties.get(propertyId);
    if (!property || property.type === 'special') return 0;

    const building = this.buildings.get(propertyId);
    
    if (property.type === 'street') {
      if (building?.hotel) return property.rent[5] || 0;
      if (building?.houses) return property.rent[building.houses] || 0;
      return property.rent[0] || 0;
    }

    if (property.type === 'railroad') {
      const owner = this.getPropertyOwner(propertyId);
      if (!owner) return 0;
      const railroadsOwned = owner.properties.filter(id => {
        const prop = this.properties.get(id);
        return prop?.type === 'railroad';
      }).length;
      return property.rent[railroadsOwned - 1] || 0;
    }

    return property.rent[0] || 0;
  }

  payRent(payerId: number, ownerId: number, amount: number): void {
    const payer = this.players.get(payerId);
    const owner = this.players.get(ownerId);

    if (!payer || !owner) return;

    const payment = Math.min(payer.money, amount);
    payer.money -= payment;
    owner.money += payment;
  }

  // Turn Management
  nextTurn(): void {
    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.playerOrder.length;
  }

  // Game State
  getGameState() {
    return {
      players: Array.from(this.players.values()),
      currentPlayer: this.getCurrentPlayer(),
      properties: Array.from(this.properties.values()),
      buildings: Array.from(this.buildings.values())
    };
  }

  getPlayerProperties(playerId: number): Property[] {
    const player = this.players.get(playerId);
    if (!player) return [];
    return player.properties.map(id => this.properties.get(id)!).filter(Boolean);
  }
}