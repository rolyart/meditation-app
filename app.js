const breathContainer = document.getElementById('breathContainer');
const playButton = document.getElementById('playButton');
const pointer = document.getElementById('pointer');
const trackOutline = document.getElementById('trackOutline');
const outline = document.querySelector(".track-outline circle");
var outlineLength = outline.getTotalLength();
outline.style.strokeDashoffset = outlineLength;
outline.style.strokeDasharray = outlineLength;



const showList = document.getElementById('showList');
const playList  = document.getElementById('playList');
const selectedVideo  = document.getElementById('currentVideo');
const selectedAudio = new Audio();
getIntro();
getData();

showList.addEventListener('click', ()=>{
    playList.classList.toggle('show');
    showList.classList.toggle('opened');
});

playButton.addEventListener('click', ()=>{
    if(selectedAudio.paused){
        start();
    }
    else{
        stop();
    }
})


function closePlaylist(){
    playList.classList.toggle('show');
}


function drawPlayList(files){
    let c = 0;
    let container = document.createElement('div');

    container.innerHTML = `<header class="header">
        <h4>Select meditation</h4>
        <button onclick="closePlaylist()"></button>
    </header>`
    container.classList.add('container');
    files.forEach(el=>{
        let item = document.createElement('div');
        item.classList.add('item');
        let output = `
            <div class="item-inner">
                <img class="cover"  src="${el.cover}">
                <div class="title">
                    <h3>${el.title}</h3>
                </div>
            </div>`;
        item.innerHTML = output;
        item.addEventListener('click', ()=>{
            onSelectItem(el);
        })
        container.appendChild(item);
        c++;
    })
    playList.appendChild(container);
}


function onSelectItem(item){
    if(!selectedAudio.paused){
        stop();
    }
    initCurrentMeditation(item);
    closePlaylist();
}


function getData(){
    var http = new XMLHttpRequest();
    var url = "http://apps.rolyart.ro/api/meditation-app/data.json";
    http.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            const files = JSON.parse(this.responseText);
            initCurrentMeditation(files[0]);
            drawPlayList(files);
        }
    };
    http.open("GET", url, true);
    http.send();
}


function initCurrentMeditation(item){
    playButton.classList.toggle('loading');
    let source =  selectedVideo.querySelector("source");
    source.src = item.video;
    selectedAudio.src = item.sound;
    selectedVideo.load();
    selectedAudio.load();
    selectedVideo.addEventListener('loadeddata', ()=>{
        if(selectedVideo.readyState>=2){
            selectedVideo.play();
            
        }
    })

    selectedAudio.addEventListener('loadeddata', ()=>{
        if(selectedAudio.readyState>=2){
            console.log(selectedAudio.readyState)
            playButton.classList.remove('loading');
        }
    })
    



    
    if(!selectedAudio.paused){
        stop()
    }

    
    



    
}


function start(){
    selectedAudio.play();
    breathContainer.classList.add('show');
    breathContainer.classList.add('breath-animation');
    pointer.classList.add('rotate-pointer');
    playButton.classList.toggle('playing');
    selectedAudio.addEventListener('timeupdate', ()=>{
        let progress = outlineLength - (selectedAudio.currentTime / selectedAudio.duration) * outlineLength;
        outline.style.strokeDashoffset = progress;
        if(selectedAudio.currentTime === selectedAudio.duration){
            stop();
        }
    })
}

function stop(){
    selectedAudio.pause();
    selectedAudio.currentTime = 0;
    breathContainer.classList.remove('show');
    breathContainer.classList.remove('breath-animation');
    pointer.classList.remove('rotate-pointer');
    playButton.classList.remove('playing');
}

function getIntro(){
    let intro  = document.getElementById('intro');
    let story  = document.querySelector("#intro h3");
    let skip  = document.querySelector("#intro button");
    let time = 0;
    let interval = setInterval(()=>{
        if(time<2) story.innerHTML = 'Once upon a time';
        else if(time<5) {
            story.innerHTML = 'Calm and quiet people...';
            skip.style.opacity = 1;
        }
        else if(time<8) story.innerHTML = 'But one day Knowledge appeared';
        else if(time<11) story.innerHTML = 'And the silence disappeared...';
        else if(time<14) story.innerHTML = 'Now is the time to become aware of the lost peace';
        else{
            story.remove();
            clearInterval(interval);
            intro.classList.add('fade-out');
            setTimeout(()=>{
                intro.remove();
            }, 1400)
        }

        console.log(time);
    time++;
    }, 1000);

    skip.addEventListener('click', ()=>{
        intro.classList.add('fade-out');
        clearInterval(interval);
        setTimeout(()=>{
            intro.remove();
        }, 1400)
    })
}










