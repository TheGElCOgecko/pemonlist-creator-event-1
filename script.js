const submitButton = document.getElementById("submit-button")

const inputName = document.getElementById("input-name")
const inputId = document.getElementById("input-id")
const inputCreator = document.getElementById("input-creator")
const inputVideo = document.getElementById("input-video")

const videoPreview = document.getElementById("video-preview")
const videoPreviewPlaceholder = document.getElementById("video-preview-placeholder")

// when video link is added, show video preview
inputVideo.addEventListener("input", () => {
    const url = inputVideo.value.trim()

    // default HTML
    videoPreview.innerHTML = '<h1 id="video-preview-placeholder">Video preview</h1>'

    var videoId = null

    const iframeElement = document.createElement("iframe")
    if (videoId = getYouTubeId(url)) {
        iframeElement.src = `https://www.youtube.com/embed/${videoId}`
        iframeElement.width = "100%"
        iframeElement.height = "auto"
        iframeElement.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        iframeElement.allowFullscreen = true

        // clear html, add iframe
        videoPreview.innerHTML = ""
        videoPreview.appendChild(iframeElement)
    }
    else if (videoId = getGoogleDriveId(url)) {
        iframeElement.src = `https://drive.google.com/file/d/${videoId}/preview`
        iframeElement.width = "100%"
        iframeElement.height = "auto"
        iframeElement.allowFullscreen = true

        // clear html, add iframe
        videoPreview.innerHTML = ""
        videoPreview.appendChild(iframeElement)
    }
    else {
        videoPreview.innerHTML = '<p id="video-preview-placeholder">Video preview not available for videos not on YouTube or Google Drive (you can still submit links from other sites as long as they are accessible)</p>'
    }
})

// When form is submitted, store it in database
function submitForm() {
    const name = inputName.value
    const id = inputId.value.trim()
    const creator = inputCreator.value
    const video = inputVideo.value.trim()
    
    if (!name || !id || !creator || !video) {
        alert("Please fill in all fields!")
        return
    }

    console.log(name)
    console.log(id)
    console.log(creator)
    console.log(video)
}

// HELPER FUNCTIONS
function isYouTubeUrl(url) {
    return url.includes("youtube.com") || url.includes("youtu.be");
}

function isGoogleDriveUrl(url) {
    return url.includes("drive.google.com");
}

// get youtube video ID
function getYouTubeId(url) {
    if (!isYouTubeUrl(url)) return null
    try {
        const urlObj = new URL(url)
        if (urlObj.hostname.includes("youtube.com"))
            return urlObj.searchParams.get("v")
        else if (urlObj.hostname === "youtu.be")
            return urlObj.pathname.slice(1)
    } catch (error) {
        return null
    }
    return null
}

function getGoogleDriveId(url) {
    if (!isGoogleDriveUrl(url)) return null
    try {
        const urlObj = new URL(url);
        if (urlObj.hostname === "drive.google.com") {
            if (urlObj.searchParams.has("id"))
                return urlObj.searchParams.get("id")

            // Look for "file/d/" format
            const pathSegments = urlObj.pathname.split("/")
            if (pathSegments.includes("file"))
                return pathSegments[pathSegments.indexOf("file") + 2]
            
        }
    } catch (error) {
        return null
    }
    return null
}