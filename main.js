const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const playlist = $('.playlist')
const songName = $('header h2')
const cdThumb = $('.cd .cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const progress = $('#progress')
const repeatBtn = $('.btn-repeat')
const randomBtn = $('.btn-random')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    indexTemp: [],
    isRepeat: false,

    songs: [
        {
            name: 'Lalisa',
            singer: 'Lisa',
            path: './assets/music/song1.mp3',
            image: './assets/cd_img/song1.jpg'
        },
        {
            name: 'Money',
            singer: 'Lisa',
            path: './assets/music/song2.mp3',
            image: './assets/cd_img/song2.jpg'
        },
        {
            name: 'Muộn rồi mà sao còn',
            singer: 'Sơn Tùng - MTP',
            path: './assets/music/song3.mp3',
            image: './assets/cd_img/song3.jfif'
        },
        {
            name: 'Bước Qua Nhau',
            singer: 'Vũ',
            path: './assets/music/song4.mp3',
            image: './assets/cd_img/song4.jpg'
        },
        {
            name: 'Thương nhiều hơn là nói',
            singer: '...',
            path: './assets/music/song5.mp3',
            image: './assets/cd_img/song5.jpg'
        },
        {
            name: 'Vùng ký ức',
            singer: 'Chillies',
            path: './assets/music/song6.mp3',
            image: './assets/cd_img/song6.jpg'
        },
        {
            name: 'Từ chối nhẹ nhàng thôi',
            singer: 'Bích Phương & Phúc Du',
            path: './assets/music/song7.mp3',
            image: './assets/cd_img/song7.jpg'
        },
        {
            name: 'An Thần',
            singer: 'Thắng & Low G',
            path: './assets/music/song8.mp3',
            image: './assets/cd_img/song8.jpg'
        },
        {
            name: 'Hướng Dương',
            singer: 'Changg',
            path: './assets/music/song9.mp3',
            image: './assets/cd_img/song9.jfif'
        },
        {
            name: 'Vầng Trăng Khóc',
            singer: 'hnhngan & Thịnh Suy',
            path: './assets/music/song10.mp3',
            image: './assets/cd_img/song10.jpg'
        },
        {
            name: 'Chuyện Rằng',
            singer: 'Thịnh Suy',
            path: './assets/music/song11.mp3',
            image: './assets/cd_img/song11.jpg'
        },
        {
            name: 'Internet Love',
            singer: 'hnhngan',
            path: './assets/music/song12.mp3',
            image: './assets/cd_img/song12.jpg'
        },
        {
            name: 'Tháng Tư Là Lời Nói Dối Của Em',
            singer: 'Hà Anh Tuấn',
            path: './assets/music/song13.mp3',
            image: './assets/cd_img/song13.jpg'
        },
    ],

    render: function() {
        const htmls = this.songs.map((song, index) => 
            `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index = ${index}>
              <div class="thumb" style="background-image: url(${song.image})">
              </div>
              <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
              </div>
              <div class="option">
                <i class="fas fa-ellipsis-h"></i>
              </div>
            </div>
            `
        )
        playlist.innerHTML = htmls.join('\n')
    },

    handleEvent: function() {
        const _this = this

        // Handle cd thumb when scroll
        const cd = $('.cd')
        const cdWidth = cd.offsetWidth
        window.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }

        // Handle cd thumb rotate
        const cdThumbAnimation = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimation.pause()


        // Handle when click play 
        playBtn.onclick = function(e) {
            if(_this.isPlaying) {
                audio.pause()
                cdThumbAnimation.pause()
                
            } else {
                audio.play()
                cdThumbAnimation.play()
            }
        }

        // Handle when click next button
        nextBtn.onclick = function() {
            if (_this.isRandom) {
                _this.randomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
            cdThumbAnimation.play()
        }

        // Handle when click prev button
        prevBtn.onclick = function() {
            if (_this.isRandom) {
                _this.randomSong()
            } else {
                _this.prevSong()
            }   
            audio.play()
            cdThumbAnimation.play()
        }

        // While song is played
        audio.onplay = () => {
            _this.isPlaying = true
            player.classList.add('playing')
            _this.seekSong
        }
        // While song is paused
        audio.onpause = () => {
            _this.isPlaying = false
            player.classList.remove('playing')
        }

        // Handle SeekSong
        audio.ontimeupdate = function() {
            const progressPercent = audio.currentTime / audio.duration * 100
            if(progressPercent) {
                progress.value = progressPercent
            }
        }

        // Xử lí khi tua song
        progress.oninput = function(e) {
            currentSongPercent = e.target.value
            timeToSeek = audio.duration * currentSongPercent / 100
            audio.currentTime = timeToSeek
        }

        // Handle when random 
        randomBtn.onclick = function(e) {
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle('active', _this.isRandom)
        }

        // Handle when end songs
        audio.onended = function() {
            if (_this.isRepeat) {
                playBtn.click()
            } else {
                nextBtn.click()
            }
        }

        // Handle when repeat songs
        repeatBtn.onclick = function(e) {
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        // Handle click songs
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
            if (songNode || e.target.closest('.option')) {
                // When click song
                if (songNode) {
                    _this.currentIndex = songNode.dataset.index
                    _this.loadCurrentSong()
                    audio.play()
                    cdThumbAnimation.play()
                    // Handle active songs
                    const songs = $$('.song')
                    $('.song.active').classList.remove('active')
                    songs[_this.currentIndex].classList.add('active')

                }

                // When click option
                if (e.target.closest('.option')) {
                    alert('HI :) CHUA CO LAM THEM OPTION')
                }
            }
        }

        

    },

    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },

    loadCurrentSong: function() {
        songName.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },

    scrollToActiveSong: function() {
        const songActivated = $('.song.active')
        setTimeout(() => {
            songActivated.scrollIntoView({
                behavior: 'smooth',
                block: 'end'
            })
        }, 300)
        
    },

    setActiveSong: function(currentIndex) {
        const songs = $$('.song')
        const songActivated = $('.song.active')
        songActivated.classList.remove('active')
        songs[currentIndex].classList.add('active')
    },

    nextSong: function() {
        this.currentIndex++
        if (this.currentIndex > this.songs.length - 1) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
        this.setActiveSong(this.currentIndex)
        this.scrollToActiveSong()
    },

    prevSong: function() {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
        this.setActiveSong(this.currentIndex)
        this.scrollToActiveSong()
    },

    randomSong: function() {
        let newIndex

        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while(this.randomSort(newIndex))
        this.currentIndex = newIndex
        this.loadCurrentSong()
        this.setActiveSong(this.currentIndex)
        this.scrollToActiveSong()
        this.indexTemp.push(this.currentIndex)
        if (this.indexTemp.length >= this.songs.length) {
            this.indexTemp = [this.currentIndex]
        }
    },

    randomSort: function(newIndex) {
        const existIndex = this.indexTemp.some((index) => {
            return newIndex === index
        })
        return existIndex
    },


    start: function() {
        // Render playlist
        this.render()

        // Define properties for object
        this.defineProperties()
        
        // Listen and Handle event after action (DOM EVENT)
        this.handleEvent()

        // Load current song
        this.loadCurrentSong()

        


    },
}

app.start()



// const songs = [
//     {
//         name: 'Lalisa',
//         singer: 'Lisa',
//         path: './assets/music/song1',
//         image: './assets/cd_img/song1'
//     },
//     {
//         name: 'Money',
//         singer: 'Lisa',
//         path: './assets/music/song2',
//         image: './assets/cd_img/song2'
//     },
//     {
//         name: 'Muộn rồi mà sao còn',
//         singer: 'Sơn Tùng - MTP',
//         path: './assets/music/song3',
//         image: './assets/cd_img/song3'
//     },
//     {
//         name: 'Bước Qua Nhau',
//         singer: 'Vũ',
//         path: './assets/music/song4',
//         image: './assets/cd_img/song4'
//     },
//     {
//         name: 'Thương nhiều hơn là nói',
//         singer: '...',
//         path: './assets/music/song5',
//         image: './assets/cd_img/song5'
//     },
//     {
//         name: 'Vùng ký ức',
//         singer: 'Chillies',
//         path: './assets/music/song6',
//         image: './assets/cd_img/song6'
//     },
//     {
//         name: 'Từ chối nhẹ nhàng thôi',
//         singer: 'Bích Phương & Phúc Du',
//         path: './assets/music/song7',
//         image: './assets/cd_img/song7'
//     },
// ]