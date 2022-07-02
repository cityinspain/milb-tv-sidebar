// convert innings pitched string to number of outs

// ex. 9.0 IP = 27 outs

// 9.1 IP = 28 outs

// 9.2 IP = 29 outs

// 10.0 IP = 30 outs

// const getNameByGamePk = async (gamePk) => {
//   // get the game from the api

//   const { data } = await axios.get(`${baseUrl}game/${gamePk}/boxscore`);

//   return data;
// };

// const game = await getNameByGamePk(670820);

// console.log(game.teams.home);

// console.log(game.teams.home);

export const processMlbApiGame = (game) => {
  console.log("Game: ", game);

  const inningsPitchedStringToOuts = (ip) => {
    const [innings, outs] = ip.split(".");

    return parseInt(innings) * 3 + parseInt(outs);
  };

  const mapPlayerByIdKey = (idKey) => {
    const [_, id] = idKey.split("ID");

    const homePlayer = game.teams.home.players[idKey];

    const awayPlayer = game.teams.away.players[idKey];

    const player = homePlayer || awayPlayer;

    const result = {
      id,

      name: player.person.fullName,

      team: homePlayer
        ? game.teams.home.team.abbreviation
        : game.teams.away.team.abbreviation,

      visitor: homePlayer ? false : true,

      position: player.position.abbreviation,

      number: Number(player.jerseyNumber),
    };

    if (player.seasonStats.batting?.atBats) {
      result.battingStats = {
        pa: player.seasonStats.batting.atBats,

        avg: player.seasonStats.batting.avg,

        obp: player.seasonStats.batting.obp,

        slg: player.seasonStats.batting.slg,

        ops: player.seasonStats.batting.ops,
      };
    }

    if (player.seasonStats.pitching?.inningsPitched !== "0.0") {
      result.pitchingStats = {
        outs: inningsPitchedStringToOuts(
          player.seasonStats.pitching.inningsPitched
        ),

        era: player.seasonStats.pitching.era,

        whip: player.seasonStats.pitching.whip,

        wins: player.seasonStats.pitching.wins,

        losses: player.seasonStats.pitching.losses,
      };
    }

    return result;
  };

  const players = [];

  const playerIds = [];

  const playerMap = new Map();

  Object.keys(game.teams.home.players).forEach((idKey) => {
    const player = mapPlayerByIdKey(idKey);

    players.push({ id: player.id, home: true });

    playerIds.push(parseInt(player.id));

    playerMap.set(parseInt(player.id), player);
  });

  Object.keys(game.teams.away.players).forEach((idKey) => {
    const player = mapPlayerByIdKey(idKey);

    players.push({ id: player.id, home: false });

    playerIds.push(parseInt(player.id));

    playerMap.set(parseInt(player.id), player);
  });

  const battingOrders = {
    away: game.teams.away.battingOrder.map((playerId) =>
      playerMap.get(playerId)
    ),

    home: game.teams.home.battingOrder.map((playerId) =>
      playerMap.get(playerId)
    ),
  };

  return {
    awayTeamName: game.teams.away.team.teamName,
    homeTeamName: game.teams.home.team.teamName,
    battingOrders,
  };
};

// displayBattingOrder(battingOrders.home);

// Object.keys(game.teams.away.players).forEach((idKey) => {

// // throw away the first part, we don't need it

// // do it rusty

// const [_, id] = idKey.split("ID");

// const p = game.teams.away.players[idKey];

// console.log(p.seasonStats.batting);

// const player = {

// playerId: id,

// name: p.person.fullName,

// team: game.teams.away.team.abbreviation,

// visitor: true,

// number: Number(p.jerseyNumber),

// position: p.position.abbreviation,

// battingStats: {

// pa: p.seasonStats.batting.atBats,

// avg: p.seasonStats.batting.avg,

// obp: p.seasonStats.batting.obp,

// slg: p.seasonStats.batting.slg,

// ops: p.seasonStats.batting.ops,

// },

// pitchingStats: {

// outs: inningsPitchedStringToOuts(p.seasonStats.pitching.inningsPitched),

// era: p.seasonStats.pitching.era,

// whip: p.seasonStats.pitching.whip,

// wins: p.seasonStats.pitching.wins,

// losses: p.seasonStats.pitching.losses,

// },

// };

// console.log(player);

// });
