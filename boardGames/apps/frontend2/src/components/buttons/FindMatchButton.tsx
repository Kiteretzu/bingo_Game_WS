import { useAppSelector } from "@/store/hooks";
import { ActionButton } from "./ActionButton";
import { cn } from "@/lib/utils";
import useBingo from "@/hooks/useBingo";

function FindMatchButton({
  findMatch,
  cancelFindMatch,
  isFinding,
}: {
  findMatch: () => void;
  cancelFindMatch: () => void;
  isFinding: boolean;
}) {
  const isAuth = useAppSelector(state => state.profile.isAuth)
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
              "  font-jaro text-2xl text-white bg-transparent rounded hover:bg-white p-3 transition-colors"
            )}
            onClick={cancelFindMatch}
          >
            ❌
          </ActionButton>
        </div>
      ) : (
        <ActionButton
          className={cn(
            "px-24 py-4 font-jaro text-2xl text-white rounded transition-colors disabled:bg-slate-600/50 disabled:hover:scale-100 "
          )}
          onClick={findMatch}
          disabled={!isAuth}
        >
          FIND MATCH
        </ActionButton>
      )}
    </div>
  );
}

export default FindMatchButton;
