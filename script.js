
let audio = new Audio;

let currentSongIndex =  0
 


async function fetchSongs(){
  let response = await fetch("http://127.0.0.1:3000/songs/");
  response = await response.text();
  let div = document.createElement("div");
  div.innerHTML = response;

  let aTags = div.getElementsByTagName('a')

  songs = [];

  for(let i = 0; i<aTags.length; i++){
    const ele = aTags[i];
    if(ele.href.endsWith('.mp3')){
      songs.push(ele.href);
    }
  }
  
  return songs;  
}

function displaySongsInLib(songs){
  let songsUl = document.getElementsByClassName('songs-list')[0].querySelector("ul");
  for(const song of songs){
    songsUl.innerHTML += `<li>
    <img class="invert" src="./svgs/music.svg" alt="" />
    <div class="info">
      <div>${decodeURI(song).split("/songs/")[1].split('-')[0]}</div>
      <div>Artist: ${decodeURI(song).split("/songs/")[1].split('-')[1].split('.')[0]}</div>
    </div>
    <div class="play-now">
      <span>Play Now</span>
      <img class="invert" src="./svgs/play.svg" alt="" />
    </div>
  </li>`
  }
}


function playMusic(currentSongIndex, songsDir){
  let currentSongURI = songsDir[currentSongIndex];

  let currentSongName = decodeURI(currentSongURI).split("/songs/")[1].split('-')[0];

  document.getElementById('song-name').innerHTML = currentSongName;

  console.log(currentSongName)
  audio.src = songsDir[currentSongIndex]
  audio.play();
}


async function main(){
  let songsDir = await fetchSongs();
  displaySongsInLib(songsDir);


  Array.from(document.querySelector(".songs-list").getElementsByTagName("li")).forEach((ele, index) =>{
        ele.addEventListener("click", () => {
            currentSongIndex = index
            playMusic(currentSongIndex, songsDir);          
        })
  })

  play.addEventListener("click",function(){
    if(!audio.paused){
      audio.pause()
      play.src = "/svgs/play-btn.svg"
    }
    else{
      audio.play();
      playMusic(currentSongIndex, songsDir);
      play.src = "/svgs/paused.svg"
    }
  })

  prev.addEventListener("click", ()=>{
    currentSongIndex -= 1;

    if(currentSongIndex >= 0){
      playMusic(currentSongIndex, songsDir);
    }
    else{
      playMusic(0, songsDir);
    }
  })

  next.addEventListener("click",()=>{
    currentSongIndex += 1;
    if(currentSongIndex < songsDir.length){
      playMusic(currentSongIndex, songsDir)
    }
    else{
        playMusic(songsDir.length - 1, songsDir)
    }
  })

}   

main();
