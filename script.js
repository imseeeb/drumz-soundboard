let swap1, swap2;
let enter, exit;

let instruments = {
    boom : 'sounds/boom.wav',
    clap : 'sounds/clap.wav',
    hihat : 'sounds/hihat.wav',
    kick : 'sounds/kick.wav',
    openhat : 'sounds/openhat.wav',
    ride : 'sounds/ride.wav',
    snare : 'sounds/snare.wav',
    tink : 'sounds/tink.wav',
    tom : 'sounds/tom.wav'
}

let recordButton = document.querySelector('.record'),
    stopButton = document.querySelector('.stop'),
    playButton = document.querySelector('.play');

let isRecordingFlag = 0,
    isStopFlag = 0;
    isPlayFlag = 0;

let recording = {
    key: [],
    time: [],
    play: []
}

let recordingStart;
//----------------------------------------------------------//

//DRAG AND DROP -> SWITCH SOUNDS
function noAllowDrop(ev) {
    ev.stopPropagation();
}

document.addEventListener('dragstart',function(e){
    //console.log(e.target);
    swap1=e.target.classList[1];
})
document.addEventListener('dragover',function(e){
    e.preventDefault();

    //console.log(e.target.classList[1]);
    /*let select = document.querySelector(`.${hover}`);
    if(hover==swap1) return;
    select.classList.add('hover');
    if (hover!=e.target.classList[1])
        select.classList.remove('hover');
    //if(hover != e.target.classList[1])
     //   let hover = e.target.classList[1]*/
})
document.addEventListener('dragenter', function(e){
    enter=e.target.classList[1];

    if (typeof(enter)=='undefined') return;
    if(enter==swap1) return;

    select=document.querySelector(`.${enter}`);
    select.classList.add('hover');
})

document.addEventListener('dragleave', function(e){
    exit=e.target.classList[1];

    if (typeof(exit)=='undefined') return;

    select=document.querySelector(`.${exit}`);
    select.classList.remove('hover');
})

document.addEventListener('drop',function(e){
    //console.log(e.target);
    swap2=e.target.classList[1];

    if (swap1==swap2) return;
    if (typeof(swap2)=='undefined') return;

    let select1 = document.querySelector(`.${swap1}`),
        select2 = document.querySelector(`.${swap2}`);

    select1.classList.add(swap2);
    select1.classList.remove(swap1);
    select1.innerHTML = `<span>${swap2.toUpperCase()}</span>`;
    select2.classList.add(swap1);
    select2.classList.remove(swap2);
    select2.innerHTML = `<span>${swap1.toUpperCase()}</span>`;
    select2.classList.remove('hover');
})

//----------------------------------------------------------//

//LISTENING FOR KEYS

document.addEventListener('keydown', function(e){ 
    if (e.repeat) return;
    if (e.key=='a'){
        keySound(0);
        keyAnimate(e.key);
    }

    if (e.key=='s'){
        keySound(1);
        keyAnimate(e.key);
    }
    if (e.key=='d'){
        keySound(2);
        keyAnimate(e.key);
    }
    if (e.key=='f'){
        keySound(3);
        keyAnimate(e.key);
    }
    if (e.key=='g'){
        keySound(4);
        keyAnimate(e.key);
    }
    if (e.key=='h'){
        keySound(5);
        keyAnimate(e.key);
    }
    if (e.key=='j'){
        keySound(6);
        keyAnimate(e.key);
    }
    if (e.key=='k'){
        keySound(7);
        keyAnimate(e.key);
    }
    if (e.key=='l'){
        keySound(8);
        keyAnimate(e.key);
    }
    if (e.key=='z'){
        record();
        keyAnimate(e.key);
        recAnimate('play');
    }
    if (e.key=='x'){
        stop();
        keyAnimate(e.key);
        recAnimate('pause');
        playAnimate('pause');
    }
    if (e.key=='c'){
        playing();
        keyAnimate(e.key);
        playAnimate('play');
    }
});

//LISTENING FOR CLICKS
document.addEventListener('click', function(e){
    let instrument = e.target.classList[1];
    let sound = new Audio(instruments[instrument]);
    sound.play();
});

//----------------------------------------------------------//

//FUNCTIONS

function keySound(numOrder){
    let instrument = document.querySelectorAll('.sound')[numOrder].classList[1];
    let sound = new Audio(instruments[instrument]);
    sound.play();
}

function keyAnimate(inputKey){
    let key = document.querySelector('.'+ inputKey);
    key.animate([
        {transform: "scale(3)"},
        {transform: "rotate(60deg)"}
    ],{duration: 120});
}

function recAnimate(state){
    let rec = document.querySelector('.record');
    let recAnimationKeyFrames = new KeyframeEffect(
        rec,
        [
            {backgroundColor: "rgb(83, 83, 83)"},
            {backgroundColor: "red"}
        ],
        {duration:1000, iterations:Infinity}
    );

    let recAnimation = new Animation(recAnimationKeyFrames, document.timeline)

    recAnimation[state]();
    /*
    rec.animate(
        [{backgroundColor: "red"},
        {backgroundColor: "white"}],
        {duration:1000, iterations:Infinity}
    );*/
}

function playAnimate(state){
    let rec = document.querySelector('.play');
    let recAnimationKeyFrames = new KeyframeEffect(
        rec,
        [
            {backgroundColor: "rgb(83, 83, 83)"},
            {backgroundColor: "green"}
        ],
        {duration:1000, iterations:Infinity}
    );

    let recAnimation = new Animation(recAnimationKeyFrames, document.timeline)

    recAnimation[state]();
}

function record(){
    isStopFlag=0;
    isRecordingFlag = 1;
    isPlayFlag=0;
    recordingStart = performance.now();

    document.addEventListener('keydown',function(e){
        if (isRecordingFlag==0 || isStopFlag==1) return;

        recording.key.push(e.key);
        recording.time.push(performance.now());
    });
}

function playing(){
    isRecordingFlag=0;
    isStopFlag=0;
    isPlayFlag=1;

    //solution for delaying between loop iterations based on stackoverflow post
    const timer = ms => new Promise(res => setTimeout(res, ms))

    async function loopThrough () { // We need to wrap the loop into an async function for this to work
        for (var i = 0; i < recording.time.length; i++) {
            await timer(recording.play[i]); // then the created Promise can be awaited
            let evt = new KeyboardEvent('keydown', {key: recording.key[i]})
            document.dispatchEvent(evt)

            if (isRecordingFlag==1 || isStopFlag==1) return;
        }
    }
    //////////////////////////////////////////////////////////////////////

loopThrough();
}

function stop(){
    isRecordingFlag = 0;
    isStopFlag = 1;
    isPlayFlag= 0;

    recording.play[0]=recording.time[0]-recordingStart;
    for(i=1;i<recording.time.length;i++){
        recording.play[i]=recording.time[i]-recording.time[i-1];
    }
}

/*document.addEventListener('keydown',function(e){
    console.log(e.key);
})*/

/*setInterval(() => {
    let evt = new KeyboardEvent('keydown', {key: 'a'})
    document.dispatchEvent(evt)
  }, 2000)*/