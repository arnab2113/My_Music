// Provides royalty-free audio sources and synthetic tone audio fallbacks for sample seeding

const sampleAudioStreams = [
  'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
  'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=chill-abstract-intention-12099.mp3',
  'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=sweet-love-121561.mp3',
  'https://cdn.pixabay.com/download/audio/2021/09/06/audio_841029c368.mp3?filename=acoustic-guitars-ambient-10852.mp3',
  'https://cdn.pixabay.com/download/audio/2022/11/06/audio_c89b7b99c8.mp3?filename=rainy-day-126296.mp3',
  'https://cdn.pixabay.com/download/audio/2022/08/02/audio_884fe92db1.mp3?filename=retro-funk-117869.mp3'
];

exports.getAudioStream = (index) => {
  return sampleAudioStreams[index % sampleAudioStreams.length];
};
