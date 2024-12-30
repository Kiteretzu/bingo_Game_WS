import { ActionButton } from "./ActionButton";
import { cn } from "@/lib/utils";

function FindMatchButton({
  findMatch,
  cancelFindMatch,
  isFinding,
}: {
  findMatch: () => void;
  cancelFindMatch: () => void;
  isFinding: boolean;
}) {
  return (
    <div className="flex items-center justify-center">
      {isFinding ? (
        <div
          className="flex items-center gap-3 justify-center"
          aria-live="polite"
        >
          <span className=" font-jaro text-2xl text-white transition-colors">
            FINDING MATCH...
          </span>
          <ActionButton
            className={cn(
              " p-0 font-jaro text-2xl text-white bg-transparent rounded hover:bg-white p-3 transition-colors"
            )}
            onClick={cancelFindMatch}
          >
            ❌
          </ActionButton>
        </div>
      ) : (
        <ActionButton
          className={cn(
            "px-24 py-4 font-jaro text-2xl text-white rounded transition-colors "
          )}
          onClick={findMatch}
        >
          FIND MATCH
        </ActionButton>
      )}
    </div>
  );
}

export default FindMatchButton;
