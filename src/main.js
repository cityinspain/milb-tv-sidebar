import App from "./App.svelte";

// const firstHeadingParent =
//   document.getElementsByClassName("p-heading")[0].parentElement;

const videoPlayerParent = document.getElementById("video-player").parentElement;
const videoPlayer = document.getElementById("video-player");
const videoPlayerContainer = document.createElement("div");
videoPlayerContainer.className = "video-player-container";
videoPlayerContainer.style = "display: flex;";
videoPlayerContainer.appendChild(videoPlayer);

const sidebarContainer = document.createElement("div");
sidebarContainer.className = "milb-tv-sidebar-container";
videoPlayerContainer.appendChild(sidebarContainer);

videoPlayerParent.appendChild(videoPlayerContainer);

const app = new App({
  target: sidebarContainer,
  props: {
    name: "world",
  },
});

export default app;
