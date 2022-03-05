const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const h2 = $('.dashboard header h2');
const thumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const repeatBtn = $('.btn-repeat');
const randomBtn = $('.btn-random');
const volume = $('#volume');

const CONFIG_KEY = 'music_app_config';

const app = {
  config: JSON.parse(localStorage.getItem(CONFIG_KEY)) || {},
  currentIndex: JSON.parse(localStorage.getItem(CONFIG_KEY))?.currentIndex || 0,
  playedSongsInRandomMode: [],
  canTimeUpdate: true,
  setConfig(key, value) {
    this.config[key] = value;
    localStorage.setItem(CONFIG_KEY, JSON.stringify(this.config));
  },
  songs: [
    {
      name: 'Nevada',
      singer: 'Vicetone',
      path: './assets/music/music-2.mp3',
      image: './assets/img/img-2.jpg',
    },
    {
      name: 'Summertime',
      singer: 'K 391',
      path: './assets/music/music-3.mp3',
      image: './assets/img/img-3.jpg',
    },
    {
      name: 'Cô đơn dành cho ai 3',
      singer: 'Út nhị',
      path: './assets/music/music-1.mp3',
      image: './assets/img/img-1.webp',
    },
    {
      name: 'Cô đơn dành cho ai 4',
      singer: 'Út nhị',
      path: './assets/music/music-1.mp3',
      image: './assets/img/img-1.webp',
    },
    {
      name: 'Cô đơn dành cho ai 5',
      singer: 'Út nhị',
      path: './assets/music/music-1.mp3',
      image: './assets/img/img-1.webp',
    },
    {
      name: 'Cô đơn dành cho ai 6',
      singer: 'Út nhị',
      path: './assets/music/music-1.mp3',
      image: './assets/img/img-1.webp',
    },
    {
      name: 'Cô đơn dành cho ai 7',
      singer: 'Út nhị',
      path: './assets/music/music-1.mp3',
      image: './assets/img/img-1.webp',
    },
    {
      name: 'Cô đơn dành cho ai 8',
      singer: 'Út nhị',
      path: './assets/music/music-1.mp3',
      image: './assets/img/img-1.webp',
    },
    {
      name: 'Cô đơn dành cho ai 9',
      singer: 'Út nhị',
      path: './assets/music/music-1.mp3',
      image: './assets/img/img-1.webp',
    },
    {
      name: 'Cô đơn dành cho ai 10',
      singer: 'Út nhị',
      path: './assets/music/music-1.mp3',
      image: './assets/img/img-1.webp',
    },
    {
      name: 'Cô đơn dành cho ai 11',
      singer: 'Út nhị',
      path: './assets/music/music-1.mp3',
      image: './assets/img/img-1.webp',
    },
  ],
  render() {
    // const html = [...new Array(10)]
    const html = this.songs
      .map((song, index) => {
        return `
          <div class="song" data-index="${index}">
           <div
             class="thumb"
             style="background-image: url('${song.image}')"
           ></div>
           <div class="body">
             <h3 class="title">${song.name}</h3>
             <p class="author">${song.singer}</p>
           </div>
           <div class="option">
             <i class="fas fa-ellipsis-h"></i>
           </div>
         </div>
       `;
      })
      .join('');
    $('.playlist').innerHTML = html;
  },
  handleEvents() {
    const _this = this;
    const cdWidth = cd.offsetWidth;

    // xử lý CD quay và dừng
    const cdAnimate = cd.animate([{ transform: 'rotate(360deg)' }], {
      duration: 10000, // 10seconds
      iterations: Infinity,
    });

    cdAnimate.pause();

    document.addEventListener('scroll', function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;

      const newCdWidth = cdWidth - (scrollTop <= 200 ? scrollTop : 200);
      const opacityRate = newCdWidth / cdWidth;

      cd.style.width = Math.ceil(newCdWidth);
      cd.style.opacity = opacityRate;
    });

    playBtn.addEventListener('click', function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    });

    audio.addEventListener('play', function () {
      player.classList.add('playing');
      cdAnimate.play();
    });
    audio.addEventListener('pause', function () {
      player.classList.remove('playing');
      cdAnimate.pause();
    });

    audio.addEventListener(
      'timeupdate',
      function (e) {
        if (this.canTimeUpdate) {
          const current = audio.currentTime;
          const total = audio.duration;

          if (!isNaN(total)) {
            const rate = (current * 100) / total;
            progress.value = rate + '';
          }
        }
      }.bind(this)
    );

    audio.addEventListener(
      'ended',
      function (e) {
        if (this.config.isRepeat) {
          audio.currentTime = 0;
          audio.play();
          return;
        }
        nextBtn.click();
      }.bind(this)
    );

    progress.addEventListener(
      'mousedown',
      function (e) {
        this.canTimeUpdate = false;
      }.bind(this)
    );

    progress.addEventListener(
      'change',
      function (e) {
        const rate = e.target.value / 100;
        const nextTime = rate * audio.duration;

        audio.currentTime = nextTime;
        this.canTimeUpdate = true;
      }.bind(this)
    );

    prevBtn.addEventListener(
      'click',
      function () {
        if (this.config.isRandom) {
          this.loadRandomSong();
        } else {
          this.loadPrevSong();
        }
        this.handleActiveSong();
        audio.play();
      }.bind(this)
    );

    nextBtn.addEventListener('click', () => {
      if (this.config.isRandom) {
        this.loadRandomSong();
      } else {
        this.loadNextSong();
      }
      this.handleActiveSong();
      audio.play();
    });

    randomBtn.addEventListener(
      'click',
      function () {
        this.setConfig('isRandom', !this.config.isRandom);
        randomBtn.classList.toggle('active');

        if (!this.config.isRandom) {
          this.playedSongsInRandomMode = [];
        }
      }.bind(this)
    );

    repeatBtn.addEventListener(
      'click',
      function () {
        this.setConfig('isRepeat', !this.config.isRepeat);
        repeatBtn.classList.toggle('active');
      }.bind(this)
    );

    $('.playlist').addEventListener('click', function (e) {
      //  _this.currentIndex =
      const songEl = e.target.closest('.song');
      if (songEl) {
        const clickedIndex = Number(songEl.dataset.index);
        const isActive = songEl.classList.toString().split(' ').includes('active');

        if (isActive) return;
        else {
          _this.currentIndex = clickedIndex;
          _this.setConfig('currentIndex', clickedIndex);

          _this.loadCurrentSong();
          _this.handleActiveSong();
          audio.play();
        }
      }
    });

    volume.addEventListener(
      'change',
      function (e) {
        audio.volume = e.target.value / 10;
        this.setConfig('volume', audio.volume);
      }.bind(this)
    );
  },

  defineProperties() {
    Object.defineProperty(this, 'currentSong', {
      get() {
        return this.songs[this.currentIndex];
      },
    });

    Object.defineProperty(this, 'isPlaying', {
      get() {
        return player.classList.toString().includes('playing');
      },
    });
  },
  loadCurrentSong() {
    h2.textContent = this.currentSong.name;
    thumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.setAttribute('src', this.currentSong.path);
  },
  loadNextSong() {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) this.currentIndex = 0;
    this.setConfig('currentIndex', this.currentIndex);
    this.loadCurrentSong();
  },
  loadPrevSong() {
    this.currentIndex--;
    if (this.currentIndex < 0) this.currentIndex = this.songs.length - 1;
    this.setConfig('currentIndex', this.currentIndex);
    this.loadCurrentSong();
  },
  loadRandomSong() {
    let randomIndex = this.currentIndex;

    if (this.playedSongsInRandomMode.length === this.songs.length) {
      this.playedSongsInRandomMode = [];
    }

    while (
      randomIndex === this.currentIndex ||
      this.playedSongsInRandomMode.indexOf(randomIndex) !== -1
    ) {
      randomIndex = Math.ceil(Math.random() * this.songs.length) - 1;
    }

    this.playedSongsInRandomMode.push(randomIndex);
    this.currentIndex = randomIndex;
    this.setConfig('currentIndex', this.currentIndex);

    this.loadCurrentSong();
  },
  handleActiveSong() {
    const songEls = $$('.song');
    for (let i = 0; i < songEls.length; i++) {
      const songEl = songEls[i];
      if (i === this.currentIndex) {
        songEl.classList.add('active');
      } else {
        songEl.classList.remove('active');
      }
    }

    setTimeout(() => {
      $('.song.active')?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }, 300);
  },
  handleConfig() {
    if (this.config.isRandom) {
      randomBtn.classList.add('active');
    }
    if (this.config.isRepeat) {
      repeatBtn.classList.add('active');
    }

    const currentVolume = this.config.volume || 1;
    audio.volume = currentVolume;
    volume.value = currentVolume * 10;
  },
  start() {
    this.defineProperties();
    this.handleEvents();

    this.loadCurrentSong();

    this.render();
    this.handleActiveSong();
    this.handleConfig();
  },
};

app.start();

// delegate pattern => Nếu listen vào tk con trước khi nó được thêm vào dom thì ko đc nên phải listen
// event ở tk cha => rồi tìm đến tk con (thường dùng với e.target và closest())
