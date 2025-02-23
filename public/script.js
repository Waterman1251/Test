// Load videos on page load
document.addEventListener("DOMContentLoaded", () => {
    loadVideoFeed();
});

// Upload a new video
function uploadVideo() {
    const fileInput = document.getElementById('videoUpload');
    const formData = new FormData();

    if (!fileInput.files[0]) {
        alert("Please select a video to upload.");
        return;
    }

    formData.append('video', fileInput.files[0]);

    fetch('/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Video uploaded successfully!');
            loadVideoFeed();
        } else {
            alert('Failed to upload video.');
        }
    })
    .catch(error => console.error('Error uploading video:', error));
}

// Load video feed
function loadVideoFeed() {
    fetch('/videos')
        .then(response => response.json())
        .then(videos => {
            const feed = document.getElementById('videoFeed');
            feed.innerHTML = '';

            if (videos.length === 0) {
                feed.innerHTML = '<p>No videos uploaded yet.</p>';
                return;
            }

            videos.forEach(video => {
                const videoCard = document.createElement('div');
                videoCard.className = 'video-card';
                videoCard.innerHTML = `
                    <video src="${video.path}" controls></video>
                    <p>${video.title}</p>
                    <a href="/video.html?video=${encodeURIComponent(video.filename)}">Watch Video</a>
                `;
                feed.appendChild(videoCard);
            });
        })
        .catch(error => console.error('Error loading videos:', error));
}
