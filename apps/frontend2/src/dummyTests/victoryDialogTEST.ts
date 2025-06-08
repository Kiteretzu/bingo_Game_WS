// mockVictoryData.ts

// Mock data for different victory scenarios
export const mockVictoryData = {
  normalVictory: {
    method: "Regular Victory",
    data: {
      baseWinningPoints: 25,
      firstBloodPoints: 5,
      doubleKillPoints: 10,
      tripleKillPoints: 0,
      perfectionistPoints: 15,
      rampagePoints: 0,
      totalWinningPoints: 55
    }
  },
  perfectGame: {
    method: "Perfect Game",
    data: {
      baseWinningPoints: 25,
      firstBloodPoints: 5,
      doubleKillPoints: 10,
      tripleKillPoints: 15,
      perfectionistPoints: 20,
      rampagePoints: 25,
      totalWinningPoints: 100
    }
  },
  quickWin: {
    method: "Quick Victory",
    data: {
      baseWinningPoints: 25,
      firstBloodPoints: 5,
      doubleKillPoints: 0,
      tripleKillPoints: 0,
      perfectionistPoints: 10,
      rampagePoints: 0,
      totalWinningPoints: 40
    }
  }
};
