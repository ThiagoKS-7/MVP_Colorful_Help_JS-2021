const video = document.getElementById('webcam');
const liveView = document.getElementById('liveView');
const demosSection = document.getElementById('demos');
const enableWebcamButton = document.getElementById('webcamButton');

$(document).ready(function(){
  startSpeaking("Bem vindo ao Cólorful Help!! Auxiliando pessoas cegas a perceber o mundo de forma independente.");
  startSpeaking("Aperte a tecla espaço para começar!!");
});

// Check if webcam access is supported.
function getUserMediaSupported() {
    return !!(navigator.mediaDevices &&
      navigator.mediaDevices.getUserMedia);
  }
  
  // If webcam supported, add event listener to button for when user
  // wants to activate it to call enableCam function which we will 
  // define in the next step.
  if (getUserMediaSupported()) {
    enableWebcamButton.addEventListener('click', enableCam);
  } else {
    console.warn('getUserMedia() is not supported by your browser');
  }
  
 // Enable the live webcam view and start classification.
function enableCam() {
    // Only continue if the COCO-SSD has finished loading.
    if (!model) {
      return;
    }
     
    // getUsermedia parameters to force video but not audio.
    const constraints = {
      video: true
    };
  
    // Activate the webcam stream.
    navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
      video.srcObject = stream;
      video.addEventListener('loadeddata', predictWebcam);
    });
  }

// Pretend model has loaded so we can try out the webcam code.
var model = true;
demosSection.classList.remove('invisible');



// Store the resulting model in the global scope of our app.
var model = undefined;

// Before we can use COCO-SSD class we must wait for it to finish
// loading. Machine Learning models can be large and take a moment 
// to get everything needed to run.
// Note: cocoSsd is an external object loaded from our index.html
// script tag import so ignore any warning in Glitch.
cocoSsd.load().then(function (loadedModel) {
  model = loadedModel;
  // Show demo section now model is ready to use.
  demosSection.classList.remove('camera-img');
  demosSection.classList.remove('invisible');
});

var children = [];
var text = '';
var voices = [];
let count = 0;
let isOn = false;


//pegar o btn por ID e fazer a função de fala por ele
window.speechSynthesis.onvoiceschanged = function() {
text = new SpeechSynthesisUtterance();
voices = window.speechSynthesis.getVoices();
//console.log(voices);
text.voiceURI = "Google português do Brasil"; //discovered after dumping getVoices()
text.lang = "pt-br";
text.localService = true;
if(voices.lenght === 21){
  text.voice = voices[14]; //index to the voiceURI. This index number is not static.
 // console.log(voices);
} else if (voices.lenght === 26){
  text.voice = voices[17]; //index to the voiceURI. This index number is not static.
 // console.log(voices);
}
}

startSpeaking = function(line){
text.text = line;
speechSynthesis.speak(text);
}

document.addEventListener('keypress', function(e){
  if(e.which === 32){
    enableCam();
    isOn = true;
  }
}, false);

function predictWebcam() {
  // Now let's start classifying a frame in the stream.
  if (count === 0){
    startSpeaking("Predição Iniciada!!");
    count = 2;
  }

  model.detect(video).then(function (predictions) {
    // Remove any highlighting we did previous frame.
    for (let i = 0; i < children.length; i++) {
      liveView.removeChild(children[i]);
    }
    children.splice(0);
    
    // Now lets loop through predictions and draw them to the live view if
    // they have a high confidence score.
    for (let n = 0; n < predictions.length; n++) {
      // If we are over 66% sure we are sure we classified it right, draw it!
      if (predictions[n].score > 0.66) {
        const p = document.createElement('p');
        p.innerText = predictions[n].class  + ' - with ' 
            + Math.round(parseFloat(predictions[n].score) * 100) 
            + '% confidence.';
        p.style = 'margin-left: ' + predictions[n].bbox[0] + 'px; margin-top: '
            + (predictions[n].bbox[1] - 10) + 'px; width: ' 
            + (predictions[n].bbox[2] - 10) + 'px; top: 0; left: 0;';

        const highlighter = document.createElement('div');
        highlighter.setAttribute('class', 'highlighter');
        highlighter.style = 'left: ' + predictions[n].bbox[0] + 'px; top: '
            + predictions[n].bbox[1] + 'px; width: ' 
            + predictions[n].bbox[2] + 'px; height: '
            + predictions[n].bbox[3] + 'px;';

        liveView.appendChild(highlighter);
        liveView.appendChild(p);
        children.push(highlighter);
        children.push(p); 

      }
    }
  
    // Call this function again to keep predicting when the browser is ready.
    if(isOn === true){
      window.requestAnimationFrame(predictWebcam);
      let result = children[1].innerText.split('-');
      console.log(result.length)
      let precision = result[1].split(' ');
      let is = "";
      //console.log(result)
      //console.log(result[0])
      switch(result[0]){
        case "person ":{
          is = "uma";
          result = "pessoa";
          break;
        }
        case "cup ":{
          is = "um";
          result = "copo";
          break;
        }
        case "couch ":{
          is = "um";
          result = "sofá";
          break;
        }  
        case 'remote ':{
          is = "um";
          result = "controle remoto";
          break;
        }
        case 'tv ':{
          is = "uma";
          result = "televisão";
          break;
        }
        case 'toothbrush ':{
          is = "uma";
          result = "escova de dentes";
          break;
        }
        case 'laptop ':{
          is = "um";
          result = "laptop";
          break;
        }
        case 'chair ':{
          is = "uma";
          result = "cadeira";
          break;
        }
        case 'clock ':{
          is = "um";
          result = "relógio";
          break;
        }
        case 'teddy bear ':{
          is = "um";
          result = "ursinho!!"
          break;
        }
        case 'hot dog ': {
          is = "um";
          result = "cachorro quente!!! umm, coisa boa..."
          break;
        }
        case 'car ':{
          is = "um";
          result = "carro";
          break;
        }
        case 'suitcase ':{
          is = 'uma';
          result = "maleta";
          break;
        }
        case 'skateboard ':{
          is = "um";
          result = "isqueite?? Nossa, que legaal!! só cuida para não se machucar... Aa... E eu... "
          break;
        }
        case 'book ':{
          is = "um";
          result = "livro, parece ser interessante..."
          break;
        }
        case 'donut':{
          is = "um";
          result = "donut";
          break;
        }
        case 'cat ':{
          is = 'um';
          result = 'gato, que foofo!!';
          break;
        }
        case 'scissors ':{
          is = "uma";
          result = "tesoura";
          break;
        }
        case 'bicycle ':{
          is = "uma";
          result = "bicicleta";
          break;
        }
        case 'cell phone ':{
          is = "um";
          result = "celular";
          break;
        }
        case 'refrigerator ':{
          is = "um";
          result = "copo";
          break;
        }

      }
      //console.log(result)

      if (result.length > 0){
        startSpeaking(`Oie. Eu encontrei ${is} ${result}... Tenho ${precision[2]} de certeza nessa predição.`)
        isOn = false;
      }
      else if(result.length <= 0){
        startSpeaking("Desculpe, mas não encontrei nada aqui.")
        isOn = false;
      }

    }

  });

}
