console.log("js for spotify clone");


let currentSong = new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
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



async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:5502/${folder}/`);

    let response = await a.text();
    console.log(response);

    let div = document.createElement("div");
    div.innerHTML = response;

    let as = div.getElementsByTagName("a");

    songs = [];

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }

    // SHOWS ALL SONGS IN PLAYLIST

    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    songUL.innerHTML = "";

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
                                <img  src="play.svg" alt="Play" style="width: 30px; height: 30px;">
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

    return songs;

}

const playMusic = (track, pause = false) => {
    // const audio = new Audio("/songs/" + track);
    currentSong.src = `/${currFolder}/` + track;

    if (!pause) {

        currentSong.play();
        play.src = "pause.svg";
    }


    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"

};

async function displayAlbums() {
    let a = await fetch(`http://127.0.0.1:5502/songs/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;

    let anchors = div.getElementsByTagName("a");
    let cardContainer = document.querySelector(".cardContainer");

    // Use traditional for loop to ensure sequential execution
    for (let i = 0; i < anchors.length; i++) {
        let e = anchors[i];

        if (e.href.includes("/songs")) {
            let folder = e.href.split("/").slice(-1)[0];
            // console.log("Fetching folder:", folder); 

            try {
                let a = await fetch(`http://127.0.0.1:5502/songs/${folder}/info.json`);
                if (!a.ok) throw new Error(`File not found: ${folder}/info.json`);

                let response = await a.json();
                console.log("Fetched JSON:", response);
            } catch (error) {
                // console.error("Error fetching data:", error);
            }

            try {
                // Fetch metadata of each folder
                let a = await fetch(`http://127.0.0.1:5502/songs/${folder}/info.json`);
                if (!a.ok) throw new Error(`Failed to fetch ${folder}/info.json`);
                let response = await a.json();
                console.log(response);

                // Add card to container
                let cardHTML = `
                    <div data-folder="${folder}" class="card">
                        <div class="play">
                            <div class="play-button">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"
                                    color="#000000" fill="000">
                                    <path
                                        d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                                        stroke="currentColor" fill="000" stroke-width="1.5" stroke-linejoin="round" />
                                </svg>
                            </div>
                        </div>
                        <img src="/songs/${folder}/cover.jpg" alt="">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>
                `;
                cardContainer.innerHTML += cardHTML;
            } catch (error) {
                // console.error("Error fetching data:", error);
            }
        }
    }

    // Attach event listeners AFTER all cards are created
    let cards = document.getElementsByClassName("card");
    for (let i = 0; i < cards.length; i++) {
        cards[i].addEventListener("click", async function (event) {
            let folder = event.currentTarget.dataset.folder;
            songs = await getSongs(`songs/${folder}`);
        });
    }
}


async function main() {


    await getSongs("songs/ncs");
    // console.log(songs);
    playMusic(songs[0], true)

    // display all the albums on the page

    displayAlbums()




    // commented code only removed %20 and below code removes all %26 and %2c also so used

    // let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    // for (const song of songs) {
    //     songUL.innerHTML = songUL.innerHTML + `<li> ${song.replaceAll("%20", " ") }</li>`
    // }

    // play first song
    // var audio = new Audio(songs[0]); // index of the song to be played
    // audio.play();

    // attach an event listener to play next and previous

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "pause.svg";
        }
        else {
            currentSong.pause()
            play.src = "play.svg"

        }
    })

    // listen for timeupdate event
    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`

        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";

    })

    // add an event listener to seekbar

    document.querySelector(".seekbar").addEventListener("click", seekbar => {

        let percent = (seekbar.offsetX / seekbar.target.getBoundingClientRect().width) * 100

        document.querySelector(".circle").style.left = percent + "%";

        currentSong.currentTime = ((currentSong.duration) * percent) / 100;

    })

    // add an event listener for hamburger

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    // add an event listener for close button

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })

    // add an event listener to previous
    previous.addEventListener("click", () => {
        console.log("previous clicked");

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])

        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }

    })

    // add an event listener to previous
    next.addEventListener("click", () => {
        console.log("next clicked");


        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])

        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }

    })

    // add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("setting volume to", e.target.value, "/100");
        currentSong.volume = parseInt(e.target.value) / 100
    })

}

// add event listener to mute the track

document.querySelector(".volume>img").addEventListener("click" , e=>{
    console.log("changing" , e.target.src);
    
    if (e.target.src.includes ("volume.svg")) {
       e.target.src =  e.target.src.replace ("volume.svg","mute.svg")
        currentSong.volume = 0

        document.querySelector(".range").getElementsByTagName("input")[0].value = 0; //makes volume slider's volume to zero when mute event is clicked

    }
    else
    {
        e.target.src = e.target.src.replace("mute.svg","volume.svg")
       currentSong.volume = .10;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
    }
})

main(); 



