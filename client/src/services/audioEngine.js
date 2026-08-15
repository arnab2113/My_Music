export function extractYouTubeId(url) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2] && match[2].length === 11 ? match[2] : null;
}

class AudioEngineService {
  constructor() {
    this.audioElement = new Audio();
    this.audioElement.crossOrigin = 'anonymous';
    this.audioContext = null;
    this.analyser = null;
    this.sourceNode = null;
    this.isInitialized = false;

    // YouTube IFrame API properties
    this.ytPlayer = null;
    this.ytPlayerReady = false;
    this.activeYouTubeId = null;
    this.isYouTubeMode = false;
    this.ytTimer = null;
    this.pendingPlayRequest = false;

    this.sampleFallbackStreams = [
      'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
      'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=chill-abstract-intention-12099.mp3',
      'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=sweet-love-121561.mp3',
      'https://cdn.pixabay.com/download/audio/2021/09/06/audio_841029c368.mp3?filename=acoustic-guitars-ambient-10852.mp3',
      'https://cdn.pixabay.com/download/audio/2022/11/06/audio_c89b7b99c8.mp3?filename=rainy-day-126296.mp3'
    ];

    // Web Audio Synthesized Ambient Engine
    this.ambientNodes = {};
    this.ambientVolumes = {
      rain: 0,
      cafe: 0,
      fireplace: 0,
      vinyl: 0,
      ocean: 0,
      forest: 0,
      city: 0
    };

    this.onTimeUpdateCallback = null;
    this.onEndedCallback = null;
    this.onErrorCallback = null;

    this.setupListeners();
    this.initYouTubeAPI();
  }

  initYouTubeAPI() {
    if (window.YT && window.YT.Player) {
      this.createYTPlayer();
      return;
    }

    if (!document.getElementById('yt-iframe-script')) {
      const tag = document.createElement('script');
      tag.id = 'yt-iframe-script';
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        this.createYTPlayer();
      };
    }
  }

  createYTPlayer() {
    let container = document.getElementById('yt-hidden-player-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'yt-hidden-player-container';
      container.style.position = 'fixed';
      container.style.top = '-9999px';
      container.style.left = '-9999px';
      container.style.width = '1px';
      container.style.height = '1px';
      container.style.opacity = '0';
      container.style.pointerEvents = 'none';
      document.body.appendChild(container);

      const playerDiv = document.createElement('div');
      playerDiv.id = 'yt-player-element';
      container.appendChild(playerDiv);
    }

    this.ytPlayer = new window.YT.Player('yt-player-element', {
      height: '1',
      width: '1',
      playerVars: {
        autoplay: 1,
        controls: 0,
        disablekb: 1,
        fs: 0,
        modestbranding: 1,
        playsinline: 1
      },
      events: {
        onReady: () => {
          this.ytPlayerReady = true;
          if (this.isYouTubeMode && this.activeYouTubeId) {
            try {
              this.ytPlayer.loadVideoById(this.activeYouTubeId);
              if (!this.pendingPlayRequest) {
                this.ytPlayer.playVideo();
              }
            } catch (e) {
              console.warn('YT loadVideoById error on ready:', e);
            }
          }
        },
        onStateChange: (event) => {
          if (event.data === window.YT.PlayerState.ENDED) {
            if (this.onEndedCallback) this.onEndedCallback();
          }
        },
        onError: (e) => {
          console.warn('YouTube Player Error:', e.data);
          this.isYouTubeMode = false;
          this.audioElement.src = this.sampleFallbackStreams[0];
          this.audioElement.play().catch(() => {});
        }
      }
    });
  }

  initWebAudio() {
    if (!this.audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioCtx();
    }
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    if (this.isInitialized) return;
    try {
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;

      this.sourceNode = this.audioContext.createMediaElementSource(this.audioElement);
      this.sourceNode.connect(this.analyser);
      this.analyser.connect(this.audioContext.destination);

      this.isInitialized = true;
    } catch (e) {
      console.warn('Web Audio API initialized in fallback mode:', e.message);
    }
  }

  setupListeners() {
    this.audioElement.addEventListener('timeupdate', () => {
      if (!this.isYouTubeMode && this.onTimeUpdateCallback) {
        this.onTimeUpdateCallback({
          currentTime: this.audioElement.currentTime,
          duration: this.audioElement.duration || 0
        });
      }
    });

    this.audioElement.addEventListener('ended', () => {
      if (!this.isYouTubeMode && this.onEndedCallback) this.onEndedCallback();
    });

    this.audioElement.addEventListener('error', () => {
      if (!this.isYouTubeMode) {
        console.warn('HTML5 Audio error on URL, auto-swapping to playable stream fallback...');
        const randomFallback = this.sampleFallbackStreams[Math.floor(Math.random() * this.sampleFallbackStreams.length)];
        this.audioElement.src = randomFallback;
        this.audioElement.play().catch(() => {});
      }
    });
  }

  loadSong(url) {
    const ytId = extractYouTubeId(url);

    if (ytId) {
      this.isYouTubeMode = true;
      this.activeYouTubeId = ytId;
      this.audioElement.pause();

      if (this.ytPlayerReady && this.ytPlayer && typeof this.ytPlayer.loadVideoById === 'function') {
        try {
          this.ytPlayer.loadVideoById(ytId);
        } catch (e) {
          console.warn('Error loading YT video:', e);
        }
      }
    } else {
      this.isYouTubeMode = false;
      this.activeYouTubeId = null;
      if (this.ytPlayerReady && this.ytPlayer && typeof this.ytPlayer.stopVideo === 'function') {
        try {
          this.ytPlayer.stopVideo();
        } catch (e) {}
      }

      let playableUrl = url;
      if (!url) {
        playableUrl = this.sampleFallbackStreams[0];
      }

      if (this.audioElement.src !== playableUrl) {
        this.audioElement.src = playableUrl;
        this.audioElement.load();
      }
    }

    this.startYouTubeProgressTracker();
  }

  startYouTubeProgressTracker() {
    if (this.ytTimer) clearInterval(this.ytTimer);
    this.ytTimer = setInterval(() => {
      if (this.isYouTubeMode && this.ytPlayerReady && this.ytPlayer && typeof this.ytPlayer.getCurrentTime === 'function') {
        try {
          const currentTime = this.ytPlayer.getCurrentTime() || 0;
          const duration = this.ytPlayer.getDuration() || 0;
          if (this.onTimeUpdateCallback) {
            this.onTimeUpdateCallback({ currentTime, duration });
          }
        } catch (e) {}
      }
    }, 500);
  }

  async play() {
    if (this.isYouTubeMode) {
      if (this.ytPlayerReady && this.ytPlayer && typeof this.ytPlayer.playVideo === 'function') {
        try {
          this.ytPlayer.playVideo();
        } catch (e) {}
      } else {
        this.pendingPlayRequest = true;
      }
      return;
    }

    this.initWebAudio();
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
    try {
      await this.audioElement.play();
    } catch (err) {
      console.warn('Audio play request interrupted, auto-retrying fallback:', err);
      this.audioElement.src = this.sampleFallbackStreams[0];
      await this.audioElement.play().catch(() => {});
    }
  }

  pause() {
    if (this.isYouTubeMode) {
      if (this.ytPlayerReady && this.ytPlayer && typeof this.ytPlayer.pauseVideo === 'function') {
        try {
          this.ytPlayer.pauseVideo();
        } catch (e) {}
      }
      return;
    }
    this.audioElement.pause();
  }

  seek(seconds) {
    if (this.isYouTubeMode) {
      if (this.ytPlayerReady && this.ytPlayer && typeof this.ytPlayer.seekTo === 'function') {
        try {
          this.ytPlayer.seekTo(seconds, true);
        } catch (e) {}
      }
      return;
    }
    if (!isNaN(seconds) && isFinite(seconds)) {
      this.audioElement.currentTime = seconds;
    }
  }

  setVolume(vol) {
    const clamped = Math.max(0, Math.min(1, vol));
    this.audioElement.volume = clamped;

    if (this.ytPlayerReady && this.ytPlayer && typeof this.ytPlayer.setVolume === 'function') {
      try {
        this.ytPlayer.setVolume(clamped * 100);
      } catch (e) {}
    }
  }

  setMute(isMuted) {
    this.audioElement.muted = isMuted;
    if (this.ytPlayerReady && this.ytPlayer && typeof this.ytPlayer.mute === 'function') {
      try {
        if (isMuted) this.ytPlayer.mute();
        else this.ytPlayer.unMute();
      } catch (e) {}
    }
  }

  getAnalyserData(array) {
    if (this.analyser && !this.isYouTubeMode) {
      this.analyser.getByteFrequencyData(array);
    } else {
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 180 + 30);
      }
    }
  }

  // --- Real-Time Synthesized Ambient Sound Generator Engine ---
  initAmbientNodes(soundId) {
    if (!this.audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioCtx();
    }
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    if (this.ambientNodes[soundId]) return this.ambientNodes[soundId];

    const ctx = this.audioContext;
    const gainNode = ctx.createGain();
    gainNode.gain.value = 0;
    gainNode.connect(ctx.destination);

    // Create 2s loop noise buffer
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = ctx.createBiquadFilter();

    if (soundId === 'rain') {
      filter.type = 'lowpass';
      filter.frequency.value = 900;
      whiteNoise.connect(filter);
      filter.connect(gainNode);
    } else if (soundId === 'fireplace') {
      filter.type = 'bandpass';
      filter.frequency.value = 350;
      filter.Q.value = 1.2;
      whiteNoise.connect(filter);
      filter.connect(gainNode);
    } else if (soundId === 'vinyl') {
      filter.type = 'highpass';
      filter.frequency.value = 3000;
      whiteNoise.connect(filter);
      filter.connect(gainNode);
    } else if (soundId === 'ocean') {
      filter.type = 'lowpass';
      filter.frequency.value = 500;

      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.12;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 250;
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start();

      whiteNoise.connect(filter);
      filter.connect(gainNode);
    } else if (soundId === 'forest') {
      filter.type = 'bandpass';
      filter.frequency.value = 1200;
      whiteNoise.connect(filter);
      filter.connect(gainNode);
    } else if (soundId === 'cafe' || soundId === 'city') {
      filter.type = 'lowpass';
      filter.frequency.value = 450;
      whiteNoise.connect(filter);
      filter.connect(gainNode);
    } else {
      filter.type = 'lowpass';
      filter.frequency.value = 800;
      whiteNoise.connect(filter);
      filter.connect(gainNode);
    }

    whiteNoise.start();

    this.ambientNodes[soundId] = { gainNode, whiteNoise, filter };
    return this.ambientNodes[soundId];
  }

  setAmbientVolume(soundId, volume) {
    this.ambientVolumes[soundId] = volume;
    try {
      const node = this.initAmbientNodes(soundId);
      if (node && node.gainNode && this.audioContext) {
        const clampedVol = Math.max(0, Math.min(1, volume));
        node.gainNode.gain.setTargetAtTime(clampedVol * 0.35, this.audioContext.currentTime, 0.04);
      }
    } catch (err) {
      console.warn(`Ambient volume update error (${soundId}):`, err);
    }
  }

  getAmbientVolume(soundId) {
    return this.ambientVolumes[soundId] || 0;
  }

  stopAllAmbient() {
    Object.keys(this.ambientNodes).forEach((soundId) => {
      if (this.ambientNodes[soundId] && this.ambientNodes[soundId].gainNode && this.audioContext) {
        this.ambientNodes[soundId].gainNode.gain.setTargetAtTime(0, this.audioContext.currentTime, 0.04);
        this.ambientVolumes[soundId] = 0;
      }
    });
  }
}

export const audioEngine = new AudioEngineService();
