const video = document.getElementById('video')
$("#loadingMessage").html(
    // '<img src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif"/>'
    '<img src="https://media.giphy.com/media/l0ExoXMMeNqZZDwv6/giphy.gif" />'
    // 'Loading your photogenic face ..'
);
Promise.all([
    // faceapi.nets.tinyFaceDetector.loadFromUri('./models/'),
    // faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
    // faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
    // faceapi.nets.faceExpressionNet.loadFromUri('./models')

    faceapi.nets.tinyFaceDetector.loadFromUri('./models/'),
    faceapi.nets.faceLandmark68TinyNet.loadFromUri('./models/'),
    faceapi.nets.faceRecognitionNet.loadFromUri('./models/'),
    faceapi.nets.faceExpressionNet.loadFromUri('./models/')
    //  faceapi.nets.ageGenderNet.loadFromUri('./models/')
]).then(startVideo)

function startVideo() {
    $("#loadingMessage").hide()
    navigator.getUserMedia({ video: {} },
        stream => video.srcObject = stream,
        err => console.error(err)
    )


}

video.addEventListener('play', () => {

    const canvas = faceapi.createCanvasFromMedia(video)
    document.body.append(canvas)
    const displaySize = { width: video.width, height: video.height }
    faceapi.matchDimensions(canvas, displaySize)
    setInterval(async() => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        if (detections === 'undefined') {

        }
        //    console.log('************     ' + detections.length) //.withFaceLandmarks().withFaceExpressions()
        console.log(detections[0]);
        const resizedDetections = faceapi.resizeResults(detections, displaySize)
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        canvas.getContext("2d").fillStyle = "rgba(246, 215, 203, 2)";
        for (i = 0; i < detections.length; i++) {
            //   canvas.getContext("2d").fillRect(detections[0]._box.topLeft._x, detections[0]._box.topLeft._y, detections[0]._box.bottomRight._x, detections[0]._box.bottomRight._y);
            canvas.getContext("2d").fillRect(detections[0]._box._x, detections[0]._box._y, 340, 380);

            faceapi.draw.drawDetections(canvas, resizedDetections) //the contents within this box have to be blurred
        }

        // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)

    }, 40)
})