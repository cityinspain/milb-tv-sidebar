<script>
  import Sidebar from "./Sidebar.svelte";

  const isGameStreamRegex = /\/live-stream-games\/g\d{6}/;

  const setBackgoundColor = () => {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    document.body.style.backgroundColor = "#" + randomColor;
  };
  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    if (request.message === "TabUpdated") {
      let path = window.location.pathname;
      console.log(path);
      if (isGameStreamRegex.test(path)) {
        const gamePk = path.match(/\d+$/)[0];
        if (
          document.querySelector("#milb-tv-sidebar-container") &&
          document.querySelector("#milb-sidebar")
        ) {
          console.debug("stuff already present, return");
          return;
        }
        // the user is on the game stream page, yay
        console.log("on the game stream page! make a sidebar");

        const videoPlayerParent =
          document.getElementById("video-player").parentElement;
        const videoPlayer = document.getElementById("video-player");
        const videoPlayerContainer = document.createElement("div");
        videoPlayerContainer.className = "video-player-container";
        videoPlayerContainer.style = "display: flex;";
        videoPlayerContainer.appendChild(videoPlayer);

        const sidebarContainer = document.createElement("div");
        sidebarContainer.id = "milb-tv-sidebar-container";
        videoPlayerContainer.appendChild(sidebarContainer);

        videoPlayerParent.appendChild(videoPlayerContainer);

        const target = document.querySelector("#milb-tv-sidebar-container");
        new Sidebar({ target, props: { gamePk } });
      }
    } else {
      console.log("request: ", request);
    }
  });
</script>

<main>
  <div style="height: 100vh; width: 100vw; background: black;" />
  <!-- <div class="sidebar-container">Everett vs. Eugene</div> -->
</main>

<style>
  .video-player-container {
    display: flex;
    width: 400px;
  }
  .sidebar-container {
    width: 400px;
    background: red;
  }
</style>
