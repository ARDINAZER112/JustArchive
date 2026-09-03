    var gifs = ['https://media.tenor.com/B0CfqF_sYAcAAAAi/%E9%BB%91%E5%A1%94.gif', 'https://media.tenor.com/nTznIJ1-uREAAAAi/kuru-kuru-kuru.gif', 'https://upload-os-bbs.hoyolab.com/upload/2023/06/23/66485151/7fd7306e513746eb86d2f1fccc4ebe8c_297756461864129858.gif', 'https://media.tenor.com/7lHdnabfyTQAAAAi/herta-kurukuru.gif']; // Replace with the paths to your GIFs

    var audioElements = [document.getElementById('audio1'), document.getElementById('audio2')];
    var count = 0;

    var intro = new Image();
    intro.src = "https://media1.tenor.com/m/DwJZQ1u_XjcAAAAC/herta-honkai.gif";
    intro.setAttribute("alt", "intro");
    intro.setAttribute("width", "300px");
    intro.setAttribute("height", "200px");

    document.addEventListener("DOMContentLoaded", function () {
      var container3 = document.createElement("div");
      container3.id = "badContainer";
      container3.appendChild(intro);
      document.body.appendChild(container3);
      container3.addEventListener("click", introAudio);
      setTimeout(function () {
        document.body.removeChild(container3);
      }, 3000);
    });
    function introAudio() {
      document.getElementById("audio9").play();
    }
    document.getElementById('triggerBtn').addEventListener('click', function () {
      count++;
      document.getElementById('kuruMeter').innerHTML = count;
      var gifContainer = document.createElement('div');
      gifContainer.classList.add('gifContainer');

      var animatedGif = document.createElement('img');
      var randomGifIndex = Math.floor(Math.random() * gifs.length);
      animatedGif.src = gifs[randomGifIndex];
      animatedGif.alt = 'Animated GIF';
      animatedGif.classList.add('animatedGif');

      gifContainer.appendChild(animatedGif);
      document.body.appendChild(gifContainer);

      setTimeout(function () {
        gifContainer.style.left = 'calc(100% + 200px)'; // Adjust 200px based on GIF width
      }, 100);

      var randomAudioIndex = Math.floor(Math.random() * audioElements.length);
      var audio = audioElements[randomAudioIndex].cloneNode(true);

      if (count % 20 == 0) {
        document.getElementById("audio10").cloneNode(true).play();
      }
      else {
        audio.play();
      }
      var checkPoint = new Image();
      checkPoint.src = "https://media1.tenor.com/m/DCZDn-WveuAAAAAC/herta.gif";
      checkPoint.setAttribute("alt", "check");

      var UwU = new Image();
      UwU.src = "https://media1.tenor.com/m/4egASwJNnn4AAAAC/herta.gif";
      UwU.setAttribute("alt", "UwU");
      UwU.setAttribute("width", "300px");

      if (count % 140 == 0) {
        document.getElementById("audio8").cloneNode(true).play();
        var container2 = document.createElement("div");
        container2.id = "badContainer";
        container2.appendChild(UwU);
        document.body.appendChild(container2);
        setTimeout(function () {
          document.body.removeChild(container2);
        }, 13000);
      }
      else if (count % 70 == 0) {
        document.getElementById("audio6").cloneNode(true).play();
      }
      else if (count % 35 == 0) {
        document.getElementById("audio7").cloneNode(true).play();
        var container1 = document.createElement("div");
        container1.id = "badContainer";
        container1.appendChild(checkPoint);
        document.body.appendChild(container1);
        setTimeout(function () {
          document.body.removeChild(container1);
        }, 2000);
      }

    });
    document.getElementById("silverwolf").onclick = () => {
      document.getElementById("audio3").cloneNode(true).play();
      document.querySelector('.popup-img').style.display = 'block';
    }

     document.getElementById("theherta").onclick = () => {
      document.getElementById("audio3").cloneNode(true).play();
      document.querySelector('.thepopup-img').style.display = 'block';
    }

    document.querySelector('.popup-img span').onclick = () => {
      document.querySelector('.popup-img').style.display = 'none';
    }

    var angerCount = 0;
    var badEnd = new Image();
    badEnd.src = "https://media1.tenor.com/m/U7KilKmyJ7UAAAAC/herta-leave-herta-star-rail.gif";
    badEnd.setAttribute("alt", "RIP");
    document.getElementById("angerHerta").onclick = () => {
      angerCount++;
      document.getElementById("audio4").cloneNode(true).play();
      if (angerCount >= 5) {
        document.getElementById("audio5").cloneNode(true).play();
        document.querySelector('.popup-img').style.display = 'none';
        var container = document.createElement("div");
        container.id = "badContainer";
        container.appendChild(badEnd);
        document.body.appendChild(container);
        setTimeout(function () {
          window.open(location, '_self').close();
        }, 2200);
      }
    }
    // Background Music
       var audio = document.getElementById("background-music");
        var playPauseButton = document.getElementById("playPauseButton");
        playPauseButton.addEventListener("click", function() {
            if (audio.paused) {
                audio.play();
                playPauseButton.textContent = "⏹";
            } else {
                audio.pause();
                playPauseButton.textContent = "►";
            }
        });
        