const submitButton = document.getElementById("submit-button")
const inputName = document.getElementById("input-name")
const inputId = document.getElementById("input-id")
const inputCreator = document.getElementById("input-creator")
const inputVideo = document.getElementById("input-video")

function submitForm() {
    const name = inputName.value;
    const id = inputId.value;
    const creator = inputCreator.value;
    const video = inputVideo.value;
    
    if (!name || !id || !creator || !video) {
        alert("Please fill in all fields!");
        return;
    }

    console.log(name);
    console.log(id);
    console.log(creator);
    console.log(video);
}