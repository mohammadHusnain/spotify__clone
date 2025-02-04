console.log("js for spotify clone");


let currentSong = new Audio();

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "Invalid input";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

// Example usage:
const totalSeconds = 72;
const formattedTime = secondsToMinutesSeconds(totalSeconds);
console.log(formattedTime); // Output: "01:12"



async function getSongs() {
    const a = await fetch("http://127.0.0.1:5502/songs/");

    let response = await a.text();
    console.log(response);

    let div = document.createElement("div");
    div.innerHTML = response;

    let as = div.getElementsByTagName("a");

    let songs = [];

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1])
        }
    }

    return songs;

}

const playMusic = (track , pause = false) => {
    // const audio = new Audio("/songs/" + track);
    currentSong.src = "/songs/" + track;

    if(!pause){
        
        currentSong.play();
        play.src = "pause.svg";
    }


    document.querySelector(".songinfo").innerHTML = decodeURI(track) 
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
    
};

async function main() {


    let songs = await getSongs();
        // console.log(songs);
        playMusic(songs[0] , true)



    // commented code only removed %20 and below code removes all %26 and %2c also so used

    // let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    // for (const song of songs) {
    //     songUL.innerHTML = songUL.innerHTML + `<li> ${song.replaceAll("%20", " ") }</li>`
    // }

    // SHOWS ALL SONGS IN PLAYLIST

    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0];

    for (const song of songs) {
        let formattedSong = song.replaceAll("%20", " ")
            .replaceAll("%2C", " ")
            .replaceAll("%26", " ");

        songUL.innerHTML += `<li>
                                    <img class="invert" src="music.svg" alt="">

                            <div class="info">
                                <div>${formattedSong}</div>
                            </div>

                            <div class="playnow">
                                <span>Play Now!</span>
                                <img class="invert" src="play.svg" alt="Play" style="width: 30px; height: 30px;">
                            </div>
 </li>`;
    }


    // Attach an event listener to each song


    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            let songName = e.querySelector(".info").firstElementChild.innerHTML.trim();
            console.log(songName);
            playMusic(songName);
        });
    });



    // play first song
    // var audio = new Audio(songs[0]); // index of the song to be played
    // audio.play();

    // attach an event listener to play next and previous

    play.addEventListener("click" , ()=>{
        if(currentSong.paused){
            currentSong.play();
            play.src = "pause.svg";
        }
        else{
            currentSong.pause()
            play.src = "play.svg"

        }
    })

    // listen for timeupdate event
    currentSong.addEventListener("timeupdate" , ()=>{
        console.log(currentSong.currentTime , currentSong.duration);
        document.querySelector(".songtime").innerHTML=`${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`

        document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration)*100 + "%";
        
    })

    // add an event listener to seekbar

    document.querySelector(".seekbar").addEventListener("click" , seekbar=>{

        document.querySelector(".circle").style.left =  (seekbar.offsetX/seekbar.target.getBoundingClientRect().width) * 100 + "%" ;
        
    })


}



main();



