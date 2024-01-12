"use strict";

let currentSong = new Audio;

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

function playMusic(track){
  // let audio = new Audio("/songs/" + track);
  // audio.play();
  currentSong.src = "/songs/" + track;
  currentSong.play();
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

  Array.from(document.querySelector(".songs-list").getElementsByTagName("li")).forEach( e => {
    e.addEventListener("click", element=>{
      
      //playMusic function
      playMusic(e.querySelector(".info").firstElementChild.innerHTML);
    })
  })
}

main();
