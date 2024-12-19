const submitButton = document.getElementById("submit-button")

const inputName = document.getElementById("input-name")
const inputId = document.getElementById("input-id")
const inputCreator = document.getElementById("input-creator")
const inputVideo = document.getElementById("input-video")

const videoPreview = document.getElementById("video-preview")
const videoPreviewPlaceholder = document.getElementById("video-preview-placeholder")

const port = getPort()

// when video link is added, show video preview
inputVideo.addEventListener("input", () => {
    const url = inputVideo.value.trim()

    // default HTML
    videoPreview.innerHTML = '<h1 id="video-preview-placeholder">Video preview</h1>'

    var videoId = null

    const iframeElement = document.createElement("iframe")
    if (videoId = getYouTubeId(url)) { // if it is a youtube link, create youtube iframe element
        iframeElement.src = `https://www.youtube.com/embed/${videoId}`
        iframeElement.width = "100%"
        iframeElement.height = "auto"
        iframeElement.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        iframeElement.allowFullscreen = true

        // clear html, add iframe
        videoPreview.innerHTML = ""
        videoPreview.appendChild(iframeElement)
    }
    else if (videoId = getGoogleDriveId(url)) { // if it is a google drive link, create google drive iframe element
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

// when form is submitted, store it in database
async function submitForm() {
    const name = inputName.value
    const id = inputId.value.trim()
    const creator = inputCreator.value
    const video = inputVideo.value.trim()

    const data = { name, id, creator, video }

    // send data to database
    try {
        console.log("Sending form data:", JSON.stringify(data))
        const response = await fetch('http://localhost:3000/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        console.log(response)

        const result = await response.json()
        console.log(result)
        if (response.ok) alert(result.message)
        else alert(result.error)
    } catch (err) {
        console.error("Error connecting to server:", err)
        alert(`Error connecting to server: ${err.message}`)
    }
}

// HELPER FUNCTIONS
// get value of port from server.js
async function getPort() {
    try {
        const response = await fetch("http://localhost:3000/config"); // Replace with your backend URL
        const result = await response.json();
        return result.port;
    } catch (error) {
        console.error("Error fetching port:", error);
    }
}

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

// get google drive video ID
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