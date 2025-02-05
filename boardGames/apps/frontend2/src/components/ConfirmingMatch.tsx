import useBingo from '@/hooks/useBingo'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setPlayerRecord } from '@/store/slices/bingoSlice'
import { useGetBingoPlayerRecordsQuery } from '@repo/graphql/types/client'
import React, { useEffect } from 'react'

function ConfirmingMatch() {
    const { bingoProfileId, matchFoundData, setIsConfirmedMatch, setIsMatchFound } = useBingo()
    const againstPlayerId = matchFoundData.find(player => player.user.bingoProfile.id !== bingoProfileId)?.user.bingoProfile.id
    const dispatch = useAppDispatch()


    const { data, loading } = useGetBingoPlayerRecordsQuery({
        variables: {
            profileId: againstPlayerId || '' // fallback to an empty string or any default value
        }
    })

    useEffect(() => {
        if (!loading && data) {
            const records = data.bingoPlayerRecords
            if (records) {
                const isPlayer1 = bingoProfileId === records?.player1Id
                const wins = isPlayer1 ? records?.player1Wins : records?.player2Wins
                const losses = isPlayer1
                    ? (records?.player2Wins ?? 0)
                    : (records?.player1Wins ?? 0)
                    
                console.log("This is the win ratio", { wins, losses })
                dispatch(setPlayerRecord({ wins: wins ?? 0, loss: losses ?? 0 }))
                setIsMatchFound(false)
                setIsConfirmedMatch(true)
            }
        }
    }, [data, loading, bingoProfileId, dispatch, setIsConfirmedMatch, setIsMatchFound])

    return (
        <div>
            CONFIRMING MATCH
        </div>
    )
}

export default ConfirmingMatch