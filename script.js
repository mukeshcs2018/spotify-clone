"use strict";

async function fetchSong() {
  let url = await fetch("http://127.0.0.1:3000/songs/");
  let response = await url.text();
  let div = document.createElement("div");
  div.innerHTML = response;

  let as = div.getElementsByTagName("a");

  let songs = [];

  for (let index = 0; index < as.length; index++) {
    const element = as[index];

    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split("/songs/")[1]);
    }
  }
  return songs;
}

async function main() {
  let songs = await fetchSong();

  let songUL = document
    .querySelector(".songs-list")
    .getElementsByTagName("ul")[0];

  for (const song of songs) {
    songUL.innerHTML += `<li>
    <img class="invert" src="./svgs/music.svg" alt="" />
    <div class="info">
      <div>${song.replaceAll("%20", " ")}</div>
      <div>Nigga</div>
    </div>
    <div class="play-now">
      <span>Play Now</span>
      <img class="invert" src="./svgs/play.svg" alt="" />
    </div>
  </li>`;
  }
}

main();
