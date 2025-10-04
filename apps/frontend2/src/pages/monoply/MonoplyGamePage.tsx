import React, { useState } from 'react';

const properties = [
  { name: 'GO', type: 'corner', color: null },
  { name: 'Mediterranean Ave', type: 'property', color: '#8B4513', price: 60 },
  { name: 'Community Chest', type: 'special', color: null },
  { name: 'Baltic Ave', type: 'property', color: '#8B4513', price: 60 },
  { name: 'Income Tax', type: 'special', color: null },
  { name: 'Reading Railroad', type: 'railroad', color: null, price: 200 },
  { name: 'Oriental Ave', type: 'property', color: '#87CEEB', price: 100 },
  { name: 'Chance', type: 'special', color: null },
  { name: 'Vermont Ave', type: 'property', color: '#87CEEB', price: 100 },
  { name: 'Connecticut Ave', type: 'property', color: '#87CEEB', price: 120 },
  { name: 'JAIL', type: 'corner', color: null },
  { name: 'St. Charles Place', type: 'property', color: '#FF1493', price: 140 },
  { name: 'Electric Company', type: 'utility', color: null, price: 150 },
  { name: 'States Ave', type: 'property', color: '#FF1493', price: 140 },
  { name: 'Virginia Ave', type: 'property', color: '#FF1493', price: 160 },
  { name: 'Pennsylvania Railroad', type: 'railroad', color: null, price: 200 },
  { name: 'St. James Place', type: 'property', color: '#FFA500', price: 180 },
  { name: 'Community Chest', type: 'special', color: null },
  { name: 'Tennessee Ave', type: 'property', color: '#FFA500', price: 180 },
  { name: 'New York Ave', type: 'property', color: '#FFA500', price: 200 },
  { name: 'FREE PARKING', type: 'corner', color: null },
  { name: 'Kentucky Ave', type: 'property', color: '#DC143C', price: 220 },
  { name: 'Chance', type: 'special', color: null },
  { name: 'Indiana Ave', type: 'property', color: '#DC143C', price: 220 },
  { name: 'Illinois Ave', type: 'property', color: '#DC143C', price: 240 },
  { name: 'B&O Railroad', type: 'railroad', color: null, price: 200 },
  { name: 'Atlantic Ave', type: 'property', color: '#FFFF00', price: 260 },
  { name: 'Ventnor Ave', type: 'property', color: '#FFFF00', price: 260 },
  { name: 'Water Works', type: 'utility', color: null, price: 150 },
  { name: 'Marvin Gardens', type: 'property', color: '#FFFF00', price: 280 },
  { name: 'GO TO JAIL', type: 'corner', color: null },
  { name: 'Pacific Ave', type: 'property', color: '#228B22', price: 300 },
  { name: 'North Carolina Ave', type: 'property', color: '#228B22', price: 300 },
  { name: 'Community Chest', type: 'special', color: null },
  { name: 'Pennsylvania Ave', type: 'property', color: '#228B22', price: 320 },
  { name: 'Short Line', type: 'railroad', color: null, price: 200 },
  { name: 'Chance', type: 'special', color: null },
  { name: 'Park Place', type: 'property', color: '#0000CD', price: 350 },
  { name: 'Luxury Tax', type: 'special', color: null },
  { name: 'Boardwalk', type: 'property', color: '#0000CD', price: 400 },
];

const buildingCards = [
  { id: 1, name: 'Small House', cost: 50, rent: 10, icon: '🏠', description: 'Basic residential property' },
  { id: 2, name: 'Duplex', cost: 100, rent: 25, icon: '🏘️', description: 'Two-family home' },
  { id: 3, name: 'Apartment', cost: 150, rent: 40, icon: '🏢', description: 'Multi-unit building' },
  { id: 4, name: 'Shopping Mall', cost: 200, rent: 60, icon: '🏬', description: 'Commercial complex' },
  { id: 5, name: 'Office Tower', cost: 250, rent: 80, icon: '🏢', description: 'Corporate headquarters' },
  { id: 6, name: 'Hotel', cost: 300, rent: 100, icon: '🏨', description: 'Luxury accommodation' },
  { id: 7, name: 'Casino', cost: 350, rent: 120, icon: '🎰', description: 'Entertainment venue' },
  { id: 8, name: 'Skyscraper', cost: 400, rent: 150, icon: '🏙️', description: 'Premium high-rise' },
];

function MonopolyGamePage() {
  const [dice1, setDice1] = useState(1);
  const [dice2, setDice2] = useState(1);
  const [rolling, setRolling] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [selectedCard, setSelectedCard] = useState(null);
  const [ownedProperties, setOwnedProperties] = useState({});
  const [propertyBuildings, setPropertyBuildings] = useState({});
  const [players, setPlayers] = useState([
    { id: 0, position: 0, color: '#EF4444', money: 1500 },
    { id: 1, position: 0, color: '#3B82F6', money: 1500 },
    { id: 2, position: 0, color: '#10B981', money: 1500 },
    { id: 3, position: 0, color: '#F59E0B', money: 1500 },
  ]);

  const rollDice = () => {
    if (rolling) return;
    
    setRolling(true);
    let count = 0;
    const interval = setInterval(() => {
      setDice1(Math.floor(Math.random() * 6) + 1);
      setDice2(Math.floor(Math.random() * 6) + 1);
      count++;
      
      if (count >= 15) {
        clearInterval(interval);
        const finalDice1 = Math.floor(Math.random() * 6) + 1;
        const finalDice2 = Math.floor(Math.random() * 6) + 1;
        setDice1(finalDice1);
        setDice2(finalDice2);
        
        const total = finalDice1 + finalDice2;
        setPlayers(prev => {
          const newPlayers = [...prev];
          newPlayers[currentPlayer].position = (newPlayers[currentPlayer].position + total) % 40;
          return newPlayers;
        });
        
        setTimeout(() => {
          setRolling(false);
          setCurrentPlayer((prev) => (prev + 1) % 4);
        }, 500);
      }
    }, 100);
  };

  const buyProperty = (propertyIndex) => {
    const property = properties[propertyIndex];
    const player = players[currentPlayer];
    
    if (property.type === 'property' && property.price && player.money >= property.price) {
      setOwnedProperties(prev => ({
        ...prev,
        [propertyIndex]: currentPlayer
      }));
      setPlayers(prev => {
        const newPlayers = [...prev];
        newPlayers[currentPlayer].money -= property.price;
        return newPlayers;
      });
    }
  };

  const buildOnProperty = (propertyIndex, card) => {
    const player = players[currentPlayer];
    
    if (ownedProperties[propertyIndex] === currentPlayer && player.money >= card.cost) {
      setPropertyBuildings(prev => ({
        ...prev,
        [propertyIndex]: card
      }));
      setPlayers(prev => {
        const newPlayers = [...prev];
        newPlayers[currentPlayer].money -= card.cost;
        return newPlayers;
      });
      setSelectedCard(null);
    }
  };

  const DiceFace = ({ value }) => {
    const dots = {
      1: [[1, 1]],
      2: [[0, 0], [2, 2]],
      3: [[0, 0], [1, 1], [2, 2]],
      4: [[0, 0], [0, 2], [2, 0], [2, 2]],
      5: [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]],
      6: [[0, 0], [0, 2], [1, 0], [1, 2], [2, 0], [2, 2]],
    };

    return (
      <div className="w-16 h-16 bg-white rounded-lg shadow-lg grid grid-cols-3 grid-rows-3 gap-1 p-2">
        {[...Array(9)].map((_, i) => {
          const row = Math.floor(i / 3);
          const col = i % 3;
          const hasDot = dots[value].some(([r, c]) => r === row && c === col);
          return (
            <div
              key={i}
              className={`rounded-full ${hasDot ? 'bg-gray-900' : ''}`}
            />
          );
        })}
      </div>
    );
  };

  const PropertySpace = ({ property, index, position }) => {
    const isCorner = property.type === 'corner';
    const playersHere = players.filter(p => p.position === index);
    const owner = ownedProperties[index];
    const building = propertyBuildings[index];
    
    if (isCorner) {
      return (
        <div className={`relative bg-gray-800 border-2 border-gray-700 flex items-center justify-center ${
          position === 'bottom-right' ? 'col-start-11 row-start-11' :
          position === 'bottom-left' ? 'col-start-1 row-start-11' :
          position === 'top-left' ? 'col-start-1 row-start-1' :
          'col-start-11 row-start-1'
        }`}>
          <div className="text-white text-xs font-bold text-center p-2">{property.name}</div>
          {playersHere.length > 0 && (
            <div className="absolute bottom-1 right-1 flex gap-0.5">
              {playersHere.map(p => (
                <div key={p.id} className="w-3 h-3 rounded-full border border-white" style={{ backgroundColor: p.color }} />
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="relative bg-gray-900 border border-gray-700 flex flex-col">
        {property.color && (
          <div className="h-4" style={{ backgroundColor: property.color }} />
        )}
        <div className="flex-1 flex flex-col items-center justify-center p-1">
          <div className="text-white text-[0.6rem] font-semibold text-center leading-tight">
            {property.name}
          </div>
          {property.price && (
            <div className="text-green-400 text-[0.5rem] mt-0.5">${property.price}</div>
          )}
          {building && (
            <div className="text-xl mt-1">{building.icon}</div>
          )}
          {owner !== undefined && (
            <div className="absolute top-1 left-1 w-2 h-2 rounded-full border border-white" style={{ backgroundColor: players[owner].color }} />
          )}
        </div>
        {playersHere.length > 0 && (
          <div className="absolute bottom-1 right-1 flex gap-0.5">
            {playersHere.map(p => (
              <div key={p.id} className="w-2 h-2 rounded-full border border-white" style={{ backgroundColor: p.color }} />
            ))}
          </div>
        )}
      </div>
    );
  };

  const getGridPosition = (index) => {
    if (index === 0) return { gridColumn: '11', gridRow: '11' };
    if (index <= 9) return { gridColumn: `${11 - index}`, gridRow: '11' };
    if (index === 10) return { gridColumn: '1', gridRow: '11' };
    if (index <= 19) return { gridColumn: '1', gridRow: `${11 - (index - 10)}` };
    if (index === 20) return { gridColumn: '1', gridRow: '1' };
    if (index <= 29) return { gridColumn: `${index - 19}`, gridRow: '1' };
    if (index === 30) return { gridColumn: '11', gridRow: '1' };
    return { gridColumn: '11', gridRow: `${index - 29}` };
  };

  const currentProperty = properties[players[currentPlayer].position];
  const canBuyProperty = currentProperty.type === 'property' && 
                        currentProperty.price && 
                        ownedProperties[players[currentPlayer].position] === undefined &&
                        players[currentPlayer].money >= currentProperty.price;
  
  const canBuild = ownedProperties[players[currentPlayer].position] === currentPlayer &&
                   !propertyBuildings[players[currentPlayer].position];

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-8 gap-8">
      <div className="flex gap-8 items-start">
        <div className="grid grid-cols-11 grid-rows-11 w-[700px] h-[700px] bg-gray-800 shadow-2xl">
          {properties.map((property, index) => (
            <div key={index} style={getGridPosition(index)}>
              <PropertySpace
                property={property}
                index={index}
                position={
                  index === 0 ? 'bottom-right' :
                  index === 10 ? 'bottom-left' :
                  index === 20 ? 'top-left' :
                  index === 30 ? 'top-right' : 'side'
                }
              />
            </div>
          ))}
          
          <div className="col-start-2 col-end-11 row-start-2 row-end-11 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-5xl font-bold text-white mb-2">MONOPOLY</h1>
              <p className="text-gray-400 text-sm">Classic Edition</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="bg-gray-800 rounded-lg p-6 border-2 border-gray-700 shadow-xl">
            <h2 className="text-white text-xl font-bold mb-4">Roll Dice</h2>
            <div className="flex gap-4 mb-4">
              <DiceFace value={dice1} />
              <DiceFace value={dice2} />
            </div>
            <div className="text-center mb-4">
              <div className="text-white text-2xl font-bold">Total: {dice1 + dice2}</div>
            </div>
            <button
              onClick={rollDice}
              disabled={rolling}
              className={`w-full py-3 rounded-lg font-bold text-white transition-all ${
                rolling
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 active:scale-95'
              }`}
            >
              {rolling ? 'Rolling...' : 'Roll Dice'}
            </button>
            
            {canBuyProperty && (
              <button
                onClick={() => buyProperty(players[currentPlayer].position)}
                className="w-full mt-2 py-2 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all"
              >
                Buy Property (${currentProperty.price})
              </button>
            )}
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border-2 border-gray-700 shadow-xl max-h-[300px] overflow-y-auto">
            <h2 className="text-white text-xl font-bold mb-4">Players</h2>
            {players.map((player) => (
              <div
                key={player.id}
                className={`mb-3 p-3 rounded-lg transition-all ${
                  currentPlayer === player.id ? 'bg-gray-700 ring-2 ring-white' : 'bg-gray-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full border-2 border-white"
                    style={{ backgroundColor: player.color }}
                  />
                  <div className="flex-1">
                    <div className="text-white font-bold">Player {player.id + 1}</div>
                    <div className="text-green-400 text-sm">${player.money}</div>
                    <div className="text-gray-400 text-xs">
                      {properties[player.position].name}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1200px]">
        <div className="bg-gray-800 rounded-lg p-6 border-2 border-gray-700 shadow-xl">
          <h2 className="text-white text-2xl font-bold mb-4">Building Cards Deck</h2>
          <p className="text-gray-400 text-sm mb-4">
            {canBuild 
              ? "Select a building card to construct on your property" 
              : "Own a property to build on it"}
          </p>
          <div className="grid grid-cols-4 gap-4">
            {buildingCards.map((card) => (
              <div
                key={card.id}
                onClick={() => canBuild && setSelectedCard(card)}
                className={`relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-4 border-2 cursor-pointer transition-all ${
                  selectedCard?.id === card.id
                    ? 'border-yellow-500 shadow-lg shadow-yellow-500/50 scale-105'
                    : canBuild
                    ? 'border-gray-700 hover:border-gray-500 hover:scale-105'
                    : 'border-gray-700 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="text-5xl text-center mb-2">{card.icon}</div>
                <h3 className="text-white font-bold text-center mb-1">{card.name}</h3>
                <p className="text-gray-400 text-xs text-center mb-2">{card.description}</p>
                <div className="flex justify-between text-sm">
                  <span className="text-red-400">Cost: ${card.cost}</span>
                  <span className="text-green-400">Rent: ${card.rent}</span>
                </div>
              </div>
            ))}
          </div>
          
          {selectedCard && canBuild && (
            <button
              onClick={() => buildOnProperty(players[currentPlayer].position, selectedCard)}
              disabled={players[currentPlayer].money < selectedCard.cost}
              className={`w-full mt-4 py-3 rounded-lg font-bold text-white transition-all ${
                players[currentPlayer].money < selectedCard.cost
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700 active:scale-95'
              }`}
            >
              {players[currentPlayer].money < selectedCard.cost
                ? 'Not Enough Money'
                : `Build ${selectedCard.name} (${selectedCard.cost})`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default MonopolyGamePage;