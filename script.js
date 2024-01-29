let audio = new Audio;
let currentSongIndex = 0;
let playlistIndex = 1;

// let playlist = async () =>  fetch("./songs")


async function fetchPlaylist() {
  let songUri = `./songs/`;

  let response = await fetch(songUri);
  response = await response.text();

  let div = document.createElement("div");
  div.innerHTML = response;

  let aTags = div.getElementsByTagName('a')


  let playlists = [];

  for (let i = 0; i < aTags.length; i++) {
    const ele = aTags[i];
    tg = ele.href
    if (tg.includes('/songs/')) {
      let names = tg.split('/songs/');
      names = names[names.length - 1].split('/');
      playlists.push(names[0]);
    }
  }

  return playlists;
}

async function fetchSongs(folder) {

  let songUri = `./songs/${folder}`;

  let response = await fetch(songUri);
  response = await response.text();
  let div = document.createElement("div");
  div.innerHTML = response;

  let aTags = div.getElementsByTagName('a')

  songs = [];

  for (let i = 0; i < aTags.length; i++) {
    const ele = aTags[i];
    if (ele.href.endsWith('.mp3')) {
      songs.push(ele.href);
    }
  }

  return songs;
}



function displaySongsInLib(songs) {
  let songsUl = document.getElementsByClassName('songs-list')[0].querySelector("ul");
  songsUl.innerHTML = ``;
  for (let i = 0; i < songs.length; i++) {
    let li = document.createElement('li');
    li.addEventListener("click", () => { 
      playMusic(i, songs);
      play.src = "./svgs/paused.svg"
    })
    let songName = decodeURI(songs[i]).split("/songs/")[1].split("/")[1].split('-')[0];
    let artistName = decodeURI(songs[i]).split("/songs/")[1].split('-')[1].split('.')[0];
    li.innerHTML += `<img class="invert" src="./svgs/music.svg" alt="" />
    <div class="song-info">
      <div>${songName}</div>
      <div>Artist: ${artistName}</div>
    </div>
    <div class="play-now">
      <span>Play Now</span>
      <img class="invert" src="./svgs/play.svg" alt="" />
    </div>
  `

    songsUl.appendChild(li);
  }
}



async function displayPlaylist(playlist) {
    

  let cardContainer = document.getElementsByClassName("cardContainer")[0];
  for (let i = 0; i< playlist.length; i++) {

    let play = playlist[i];

    let dv = document.createElement("div");

    dv.classList.add(["playlist"]);
    dv.classList.add(["card"]);

    dv.addEventListener("click" , async () => {
      songsDir = await fetchSongs(playlist[i]);

      displaySongsInLib(songsDir);

      document.querySelector(".left").style.left = "0";

    });


    let dt = await fetch(`./songs/${play}/info.json`).then((resp) =>  resp.json()).then((resp) => {

      dv.innerHTML += `<div class="play-card-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          class="lucide lucide-play-circle">
          <circle cx="12" cy="12" r="11" fill="#006400" />
          <polygon points="10 8 16 12 10 16 10 8" fill="#006400" />
        </svg>
      </div>
      <img src="./songs/${play}/cover.jpg" alt="card-image" />
      <h2>${resp.title}</h2>
      <p>${resp.description}</p>
    `
    cardContainer.appendChild(dv);
      })
   
  }
}

// for changing seekbar
function onChangeInput() {
  let seekbar = document.querySelector(".seekbar")
  audio.currentTime = seekbar.value
}

function playMusic(currentSongIndex, songsDir) {

  let currentSongName = decodeURI(songsDir[currentSongIndex]).split('/songs/')[1].split("/")[1].split('-')[0];
  document.getElementById('song-name').innerHTML = currentSongName;
  audio.src = songsDir[currentSongIndex];
  audio.play();
  audio.addEventListener("timeupdate", () => {
    document.querySelector(".song-duration").innerHTML = `${songTimer(audio.currentTime)}/${!isNaN(audio.duration) ? songTimer(audio.duration) : '00:00'}`

    let seekbar = document.querySelector(".seekbar")
    seekbar.max = audio.duration
    seekbar.value = audio.currentTime

  })

  //Display remaining time.
  function songTimer(durationInSeconds) {
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = Math.floor(durationInSeconds % 60);

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
}

async function main() {

  let playlist = await fetchPlaylist();

  let songsDir = await fetchSongs(playlist[playlistIndex]);

  displaySongsInLib(songsDir);
  displayPlaylist(playlist);

  // Array.from(document.querySelector(".cardContainer").getElementsByClassName("card")).forEach((ele, index) => {
  //   ele.addEventListener("click", async () => {

  //     console.log("cllsdkfjl")
  //     playlistIndex = index;
  //     songsDir = await fetchSongs(playlist[playlistIndex]);
  //     displaySongsInLib(songsDir);
  //   })
  // });


  function pauseAudio() {
    audio.pause();
    play.src = "./svgs/play-btn.svg";
  }

  function resumeAudio() {
    // Save the current playback position
    var currentPlaybackTime = audio.currentTime;

    playMusic(currentSongIndex, songsDir);

    // Set the saved playback position
    audio.currentTime = currentPlaybackTime;
    play.src = "./svgs/paused.svg";

  }


  play.addEventListener("click", function () {
    if (audio.paused) {
      resumeAudio();
    } else {
      pauseAudio();
    }
  });


  prev.addEventListener("click", () => {

    if (currentSongIndex > 0) {
      playMusic(currentSongIndex -= 1, songsDir);
    }
    else {
      playMusic(0, songsDir);
    }
  })

  next.addEventListener("click", () => {

    if (currentSongIndex < songsDir.length - 1) {
      playMusic(currentSongIndex += 1, songsDir);
      play.src = "./svgs/paused.svg";

    }
    else {
      playMusic(songsDir.length - 1, songsDir);
      play.src = "./svgs/paused.svg";
    }
  })

  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  })

  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  })

  document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (event) => {
    audio.volume = parseInt(event.target.value) / 100;
  })
}


main();



