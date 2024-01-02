"use strict";

async function fetchSong() {
  let url = await fetch("http://127.0.0.1:3000/songs/");
  let response = await url.text();
  let div = document.createElement("div");
  div = response;
  console.log(response);
}

fetchSong();
