
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useBingo from "@/hooks/useBingo";
import { emotes } from "@/assets/emotes";

// Dynamic import of emotes to improve scalability


export function EmoteSelector() {
  const { sendEmote } = useBingo();

  const buttonStyles = useMemo(
    () => ({
      selected: "bg-amber-500 text-gray-900 border-amber-600",
      default: "bg-gray-700 hover:bg-gray-600 text-gray-100 border-gray-600",
    }),
    []
  );

  return (
    <Card className="w-full bg-gray-800 text-gray-100 shadow-lg border-gray-700">
      <CardHeader className="border-b py-3 border-gray-700 bg-gray-800/50">
        <CardTitle className="text-2xl font-bold text-center text-amber-400">
          Emotes
        </CardTitle>
        <p className="text-sm text-center text-gray-400">
          Taunt your opponent with emotes.
        </p>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-5 gap-4">
          {emotes.map((emote) => (
            <Button
              key={emote.name}
              variant="outline"
              className={`h-20 p-0 w-full ${
                buttonStyles.selected
              } transition-colors duration-200 ease-in-out`}
              onClick={() => sendEmote(emote.name)}
            >
              <img
                src={emote.url}
                alt={emote.name}
                className="w-full object-contain h-full"
              />
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
