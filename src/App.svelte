<script>
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
      let domain = window.location.hostname;
      domain = domain
        .replace("http://", "")
        .replace("https://", "")
        .replace("www.", "")
        .split(/[/?#]/)[0];

      if (domain !== "google.com") return;

      setBackgoundColor();
    }
  });
</script>

<main>
  <div class="sidebar-container">Everett vs. Eugene</div>
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
