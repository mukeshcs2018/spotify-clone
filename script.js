let audio = new Audio;
let currentSongIndex =  0



async function fetchSongs(){

  let songUri = "./tree/main/songs/"

  let response = await fetch(songUri);
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

// for changing seekbar
 function onChangeInput(){
  let seekbar = document.querySelector(".seekbar")
  audio.currentTime = seekbar.value
 }



function playMusic(currentSongIndex, songsDir){

  let currentSongName = decodeURI(songsDir[currentSongIndex]).split("./songs/")[1].split('-')[0];

  document.getElementById('song-name').innerHTML = currentSongName;
  audio.src = songsDir[currentSongIndex];

  audio.play();

  audio.addEventListener("timeupdate", ()=>{

    document.querySelector(".song-duration").innerHTML = `${songTimer(audio.currentTime)}/${!isNaN(audio.duration) ? songTimer(audio.duration): '00:00'}`
    
    
    
    let seekbar = document.querySelector(".seekbar")
    seekbar.max = audio.duration
    seekbar.value = audio.currentTime  

  })




  function songTimer(durationInSeconds){

    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = Math.floor(durationInSeconds % 60);

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  
}



async function main(){
  let songsDir = await fetchSongs();
  displaySongsInLib(songsDir);
 
  Array.from(document.querySelector(".songs-list").getElementsByTagName("li")).forEach((ele, index) =>{
        ele.addEventListener("click", () => {
            currentSongIndex = index
            playMusic(currentSongIndex, songsDir);   
            play.src = "./svgs/paused.svg"       
        })
  })


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
  


//  currentSongIndex = 1
    
  prev.addEventListener("click", ()=>{

    if(currentSongIndex >= 0){
      playMusic(currentSongIndex-=1, songsDir);
    }
    else{
      playMusic(0, songsDir);
    }
  })

  next.addEventListener("click",()=>{

    if(currentSongIndex < songsDir.length-1){
      playMusic(currentSongIndex += 1, songsDir)
    }
    else{
        playMusic(songsDir.length - 1, songsDir)
    }
  })


}   

main();
