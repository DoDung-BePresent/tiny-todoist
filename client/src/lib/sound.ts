export const playSound = (soundFile: string) => {
  try {
    const audio = new Audio(soundFile);
    audio.play().catch((error) => {
      console.warn('Sound playback was prevented:', error);
    });
  } catch (error) {
    console.error('Error playing sound:', error);
  }
};
