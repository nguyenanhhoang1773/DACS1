const musicItem = document.querySelector(".musicItems");
const musicItemPopular = document.querySelector(".musicItems--popular");
const musicItemHot = document.querySelector(".musicItem--hot");
const musicItemNew = document.querySelector(".musicItem--new");
const nowPlayingInfor = document.querySelector(".nowPlaying__infor");
const playBtn = document.querySelector(".playBtn");
const pauseBtn = document.querySelector(".pauseBtn");
const audio = document.querySelector(".audio");
const timeRun = document.querySelector(".control__bar__timeRun");
const duration = document.querySelector(".control__bar__duration");
const barControl = document.querySelector(".control__bar");
const runningControl = document.querySelector(".control__bar--running");
const circleControl = document.querySelector(".control__circle");
const libraryItems = document.querySelector(".library__items");
const loading = document.querySelector(".loading");
let songs;
window.addEventListener("resize", () => {
  console.log(window.innerWidth);
});
window.addEventListener("load", function () {
  fetch("http://127.0.0.1:3000/api/data")
    .then((response) => response.json())
    .then((data) => {
      // console.log("data: ", data);
      songs = data;
      addSong(data);
      addSongLibrary(data);
      setTimeout(() => {
        loading.classList.add("hidden");
      }, 100);
      // Hiển thị dữ liệu nhận được
      // document.getElementById('dataContainer').textContent = JSON.stringify(data);
    })
    .catch((error) => {
      console.error("Lỗi:", error);
    });
  console.log("Trang web và tất cả các tài nguyên đã được tải hoàn toàn");
});

const addMultipleEventListener = (arr, action, callback) => {
  arr.forEach((item) => {
    item.addEventListener(action, () => callback(item));
  });
};

const clientBarControl = barControl.getBoundingClientRect();
barControl.addEventListener("click", (e) => {
  playAudio();
  const duration = audio.duration;
  const width = e.clientX - clientBarControl.left - 7;
  runningControl.style.width = width + "px";
  audio.currentTime = (width / barControl.clientWidth) * duration;
});
barControl.addEventListener("mousedown", (e) => {
  playAudio();
  audio.removeEventListener("timeupdate", barRunning);
  window.addEventListener("mousemove", audioMouseMove);
  window.addEventListener("mouseup", audioMouseUp);
  let width = e.clientX - clientBarControl.left;
  function audioMouseMove(e) {
    if (e.clientX > clientBarControl.right) {
      width = barControl.clientWidth;
    } else if (e.clientX < clientBarControl.left) {
      width = 0;
    } else {
      width = e.clientX - clientBarControl.left - 7;
    }
    runningControl.style.width = width + "px";
  }
  function audioMouseUp(e) {
    console.log(123);
    const duration = audio.duration;
    // const width = e.clientX - clientBarControl.left - 7;
    audio.currentTime = (width / barControl.clientWidth) * duration;
    window.removeEventListener("mousemove", audioMouseMove);
    audio.addEventListener("timeupdate", barRunning);
    window.removeEventListener("mouseup", audioMouseUp);
  }
});

playBtn.addEventListener("click", playAudio);
pauseBtn.addEventListener("click", pauseAudio);
function playAudio() {
  playBtn.classList.remove("active");
  pauseBtn.classList.add("active");
  audio.play();
}
function pauseAudio() {
  pauseBtn.classList.remove("active");
  playBtn.classList.add("active");
  audio.pause();
}
audio.addEventListener("timeupdate", barRunning);
audio.addEventListener("timeupdate", timeRunning);
audio.addEventListener("ended", () => {
  pauseBtn.classList.remove("active");
  playBtn.classList.add("active");
});
function barRunning(e) {
  const duration = audio.duration;
  const width = (audio.currentTime / duration) * barControl.clientWidth;
  runningControl.style.width = width + "px";
}
function timeRunning(e) {
  if (Math.floor(audio.currentTime) < 10) {
    timeRun.textContent = `0:0${Math.floor(audio.currentTime)}`;
  } else if (
    Math.floor(audio.currentTime) >= 10 &&
    Math.floor(audio.currentTime) < 60
  ) {
    timeRun.textContent = `0:${Math.floor(audio.currentTime)}`;
  } else {
    let minute = Math.floor(Math.floor(audio.currentTime) / 60);
    let second = Math.floor(audio.currentTime) % 60;
    if (second < 10) {
      timeRun.textContent = `${minute}:0${second}`;
    } else {
      timeRun.textContent = `${minute}:${second}`;
    }
  }
}

const addSong = (songs) => {
  songs.forEach((song, i) => {
    const childEle = document.createElement("li");
    childEle.classList.add("songItem");
    childEle.innerHTML = `
    <a class="song" idSong="${song.idSong}" href="#"
    ><img class="songItem__img" src="${song.url}" alt=""
    /></a>
    <div class="info-albumn">
    <h3>${song.name}</h3>
    </div>
    `;
    if (i < 10) {
      musicItem.appendChild(childEle);
    } else if (i >= 10 && i < 15) {
      musicItemPopular.appendChild(childEle);
    } else if (i >= 15 && i < 20) {
      musicItemHot.appendChild(childEle);
    } else {
      musicItemNew.appendChild(childEle);
    }
  });
};
const addSongLibrary = (songs) => {
  songs.forEach((song, index) => {
    if (index >= 10) {
      const childEle = document.createElement("div");
      childEle.setAttribute("idSong", song.idSong);
      childEle.classList.add("library__item");
      childEle.classList.add("song");
      childEle.innerHTML = `<img
    class="library__item__img"
    src="${song.url}"
  />
  <div class="library__item__infor">
    <h3 class="library__item__title">${song.name}</h3>
    <p class="library__item__describe">${song.singer}</p>
  </div>`;
      libraryItems.appendChild(childEle);
    }
  });
  const itemSong = document.querySelectorAll(".song");
  addMultipleEventListener(itemSong, "click", (item) => {
    const idSongActive = item.getAttribute("idSong");
    console.log(idSongActive);
    songs.forEach((song) => {
      if (song.idSong == idSongActive) {
        nowPlayingInfor.innerHTML = `
  <img
    class="nowPlaying__infor__img"
    src="${song.url}"
  />
  <div class="nowPlaying__infor--describe">
    <h3 class="nowPlaying__infor__title">${song.name}</h3>
    <p class="nowPlaying__infor__singer">${song.singer}</p>
  </div>
  <i class="nowPlaying__infor__icon fa-regular fa-heart"></i>
  `;
      }
    });
  });
};
