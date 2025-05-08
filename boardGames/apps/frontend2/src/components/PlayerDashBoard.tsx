import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Swords, CoinsIcon } from "lucide-react";
import useBingo from "@/hooks/useBingo";
import { MatchHistory } from "@repo/messages/message";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@radix-ui/react-tooltip";

function PlayerDashBoard() {
  const { matchHistory, playersData, tossWinner } = useBingo();

  // Extract player data more efficiently using destructuring and mapping

  const players = playersData.map(({ user }) => ({
    id: user.bingoProfile.id,
    name: user.displayName,
    avatar: user.avatar,
  }));

  const [player1, player2] = players;

  // Memoize the playerMoves function to avoid recalculation
  const getPlayerMoves = React.useCallback(
    (playerId: string): MatchHistory => {
      return matchHistory.filter((move) => move.by === playerId);
    },
    [matchHistory]
  );

  return (
    <Card className="w-full bg-gray-800 border-gray-700 shadow-lg">
      <CardHeader className="p-0">
        <CardTitle className="flex flex-col py-3 justify-center items-center border-b border-gray-700">
          <div className="text-2xl font-bold text-center text-amber-400 flex items-center justify-center space-x-2">
            <span className="max-w-[15ch truncate">{player1?.name}</span>
            <Swords className="w-6 h-6" />
            <span className="max-w-[15ch] truncate">{player2?.name}</span>
          </div>
          <div className="text-sm text-gray-400 flex flex-col items-center">
            <div className="flex items-center mb-1">
              <CoinsIcon className="w-4 h-4 mr-2" />
              Toss won by:{" "}
              {tossWinner === "Player 1" ? player1?.name : player2?.name}
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex py-3">
          <PlayerColumn
            playerData={{
              ...player1,
              isPlayer1: true,
              moves: getPlayerMoves(player1?.id),
            }}
          />
          <Separator orientation="vertical" className="mx-4" />
          <PlayerColumn
            playerData={{
              ...player2,
              isPlayer1: false,
              moves: getPlayerMoves(player2?.id),
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}

type PlayerColumnProps = {
  playerData: {
    name: string;
    avatar: string;
    moves: MatchHistory;
    isPlayer1: boolean;
  };
};

const PlayerColumn = React.memo(({ playerData }: PlayerColumnProps) => {
  const { name, moves, isPlayer1, avatar } = playerData;
  const playerKey = isPlayer1 ? "Player 1" : "Player 2";
  const borderColor = isPlayer1
    ? "border-blue-400 text-blue-400"
    : "border-red-400 text-red-400";

  const tooltipBorderColor = isPlayer1 ? "border-blue-900" : "border-red-900";

  const tooltipContent = isPlayer1
    ? "First move is done by Player 1"
    : "Second move is done by Player 2";

  return (
    <div className="flex-1">
      <div className="flex items-center justify-center space-x-3 mb-4  select-none">
        <Avatar className="h-16 w-16 border-2 border-amber-400">
          <AvatarImage src={avatar} />
          <AvatarFallback>{name?.charAt(0)}</AvatarFallback>
        </Avatar>
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-center select-none">
                <h3 className="text-lg font-semibold max-w-[15ch]  truncate text-gray-100">
                  {name}
                </h3>
                <Badge variant="outline" className={borderColor}>
                  {playerKey}
                </Badge>
              </div>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              className={`bg-gray-800/45 text-xs text-gray-100 border ${tooltipBorderColor}`}
            >
              <p>{tooltipContent}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="space-y-2 text-sm">
        {moves.map((move, index) => (
          <div
            key={index}
            className={`flex justify-between items-center p-2 rounded-md border-l-4 ${isPlayer1 ? "border-blue-400" : "border-red-400"} bg-gray-700/50`}
          >
            <span className="text-gray-400">{move.move}</span>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-gray-100">{move.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

PlayerColumn.displayName = "PlayerColumn";

export default PlayerDashBoard;
