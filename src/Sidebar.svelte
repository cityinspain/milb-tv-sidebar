<script>
  import { processMlbApiGame } from "./lib/util.js";

  //   export let gamePk = window.location.pathname.match(/\d+$/)[0];
  export let gamePk = "";

  // TODO: rework reacting to game stream page changes

  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    if (request.message === "TabUpdated") {
      let path = window.location.pathname;

      gamePk = path.match(/\d+$/)[0];

      fetch(baseUrl + "/game/" + gamePk + "/boxscore")
        .then((res) => res.json())
        .then(async (res) => {
          console.log("data", res);
          const result = await processMlbApiGame(res);

          if (result) {
            lineups.home = {
              teamName: result.homeTeamName,
              players: result.battingOrders.home,
            };
            lineups.away = {
              teamName: result.awayTeamName,
              players: result.battingOrders.away,
            };
          }
        });
    }
  });

  export let selectedTeam = "home";

  function setSelectedTeamIndex(event) {
    // console.log("event", event.target.value);
    selectedTeam = event.target.value;
  }

  export let lineups = {
    home: {
      teamName: "",
      players: [],
    },
    away: {
      teamName: "",
      players: [],
    },
  };

  const baseUrl = `https://statsapi.mlb.com/api/v1/`;
  const gameUrl = `${baseUrl}game/${gamePk}/boxscore`;

  // TODO: refactor this out with above rework
  fetch(gameUrl)
    .then((res) => res.json())
    .then(async (res) => {
      console.log("data", res);
      const result = await processMlbApiGame(res);

      if (result) {
        lineups.home = {
          teamName: result.homeTeamName,
          players: result.battingOrders.home,
        };
        lineups.away = {
          teamName: result.awayTeamName,
          players: result.battingOrders.away,
        };
      }
    });
</script>

<main id="milb-sidebar">
  <div class="team-toggle-container">
    <button
      class="team-toggle-button"
      class:selected={selectedTeam === "home"}
      on:click={setSelectedTeamIndex}
      value="home">{lineups.home.teamName}</button
    >
    <button
      class="team-toggle-button"
      class:selected={selectedTeam === "away"}
      on:click={setSelectedTeamIndex}
      value="away">{lineups.away.teamName}</button
    >
  </div>
  <table class="lineup-table">
    <thead>
      <tr>
        <th class="lineup-index-col" />
        <th class="player-number-col">#</th>
        <th class="player-position-col">Pos</th>
        <th class="player-name-col">Name</th>
        <th class="player-avg-col">AVG</th>
        <th class="player-ops-col">OPS</th>
      </tr>
    </thead>
    <tbody>
      <!-- render each of lineups.home in a td -->
      {#each lineups[selectedTeam].players as player}
        <tr>
          <td class="lineup-index-col">1</td>
          <td class="player-number-col">{player.number}</td>
          <td class="player-position-col">{player.position}</td>
          <td class="player-name-col">{player.name}</td>
          <td class="player-avg-col">{player.battingStats.avg}</td>
          <td class="player-ops-col">{player.battingStats.ops}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</main>

<style>
  #milb-sidebar {
    min-width: 400px;
    padding-right: 16px;
  }
  .team-toggle-container {
    display: flex;
    justify-content: space-evenly;
  }

  .team-toggle-button {
    border: none;
    text-transform: uppercase;
    font-size: 1.2rem;
    font-weight: bold;
    padding: 0.5rem;
    background: none;
    cursor: pointer;
    border: 0;
    line-height: 1.2;
    text-decoration: none;
    color: #898989;
    border-collapse: collapse;
  }

  .team-toggle-button:hover {
    color: #343434;
    text-decoration: underline;
  }

  .team-toggle-button.selected {
    color: #565656;
    text-decoration: underline;
  }

  .lineup-table {
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
    font-size: 0.8rem;
    font-weight: bold;
    color: #898989;
    border: 1px solid #898989;
  }

  .lineup-index-col {
    width: 5%;
    text-align: center;
    color: #ababab;
  }

  .player-number-col {
    text-align: left;
  }

  .player-position-col {
    text-align: left;
  }

  .player-name-col {
    min-width: 25px;
    text-align: left;
  }

  .player-avg-col,
  .player-ops-col {
    text-align: right;
  }

  .player-ops-col {
    padding-right: 5px;
  }
</style>
