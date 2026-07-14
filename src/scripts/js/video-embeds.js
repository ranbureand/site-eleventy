/* Copyright (c) 2017 Andrea Buran [www.andreaburan.com]. All rights reserved */

/*
** Videos
*/

document.querySelectorAll('.video-content').forEach(function(videoElement) {

  const attrMuted = videoElement.hasAttribute('muted');

  // Create the custom controls container
  const controlsContainer = document.createElement('div');
  controlsContainer.className = 'video-controls';

  // Create the play/pause button
  const playButton = document.createElement('div');
  playButton.className = 'play paused';
  playButton.title = 'Play/Pause';
  controlsContainer.appendChild(playButton);

  // Create the mute/unmute button if the video is muted
  if (attrMuted) {
    const muteButton = document.createElement('div');
    muteButton.className = 'mute';
    muteButton.title = 'Mute/Unmute';
    controlsContainer.appendChild(muteButton);
  }

  // Insert the controls container after the video element
  videoElement.parentNode.insertBefore(controlsContainer, videoElement.nextSibling);

  // Set the status of the play button icon
  const updatePlayButton = () => {
    if (videoElement.paused || videoElement.ended) {
        playButton.classList.add('paused');
        playButton.classList.remove('played');
    } else {
        playButton.classList.add('played');
        playButton.classList.remove('paused');
    }
  };

  // Function to play/pause the video
  const togglePlay = () => {
    if (videoElement.paused || videoElement.ended) {
        videoElement.play();
    } else {
        videoElement.pause();
    }
    updatePlayButton();
  };

  // Add event listener to the play button and video to toggle play/pause
  playButton.addEventListener('click', togglePlay);
  videoElement.addEventListener('click', togglePlay);
  videoElement.addEventListener('play', updatePlayButton);
  videoElement.addEventListener('pause', updatePlayButton);

  // Mute/unmute functionality if the video is muted
  if (attrMuted) {
    const muteButton = controlsContainer.querySelector('.mute');

    const updateMuteButton = () => {
      if (videoElement.muted) {
        muteButton.classList.add('muted');
        muteButton.classList.remove('unmuted');
      } else {
        muteButton.classList.add('unmuted');
        muteButton.classList.remove('muted');
      }
    };

    const toggleMute = () => {
      videoElement.muted = !videoElement.muted;
      updateMuteButton();
    };

    // Add event listener to the mute button
    muteButton.addEventListener('click', toggleMute);
    videoElement.addEventListener('volumechange', updateMuteButton);

    updateMuteButton(); // Initialize the mute button state
  }

  // Disable the default video controls
  videoElement.controls = false;

  updatePlayButton(); // Initialize the play button state

});