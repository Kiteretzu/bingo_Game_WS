const GameModeCard = ({ mode, description, selected, onClick }) => (
  <div
    className={`p-4 rounded-lg cursor-pointer transition-all ${selected ? "bg-blue-900 border-2 border-blue-500" : "bg-gray-800 border border-gray-700 hover:border-blue-500"}`}
    onClick={onClick}
  >
    <img
      src="/api/placeholder/200/150"
      alt={`${mode} game mode`}
      className="w-full h-32 object-cover rounded-md mb-3 bg-gray-700"
    />
    <h3
      className={`font-semibold text-lg mb-2 ${selected ? "text-blue-300" : "text-gray-200"}`}
    >
      {mode}
    </h3>
    <p className="text-gray-400 text-sm">{description}</p>
  </div>
);

export default GameModeCard;
