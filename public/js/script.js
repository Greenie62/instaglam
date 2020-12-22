var cameraBtn = document.querySelector('.camerabutton');
var captureBtn = document.querySelector(".capturebtn");
var saveBtn = document.querySelector(".savebutton");
var printBtn = document.querySelector(".printbutton");
var imageGrid = document.querySelector(".imageGrid")
saveBtn.style.display = 'none'
printBtn.style.display = 'none'
captureBtn.style.display = 'none'

var canvas = document.querySelector("canvas");

let video = document.createElement("video");
video.className='video'
let vidCard = document.querySelector('.videocard')
video.muted = true;

let imgUrl, currentImg;

cameraBtn.onclick=openCamera;



const createStream=async()=>{
      let stream = await navigator.mediaDevices.getUserMedia({audio:true,video:true})
      console.log(stream)
          return stream;
}


async function openCamera(){
     let stream = await createStream()

     video.srcObject = stream;
     video.onloadedmetadata=()=>{
         video.play()
         captureBtn.style.display='block'
     }

     vidCard.appendChild(video)


}



captureBtn.onclick=capturePic;


function capturePic(){
    console.log('capturePic fired!')

    var context = canvas.getContext("2d");
        canvas.width = 200;
        canvas.height = 200;

    context.drawImage(video,0,0,canvas.width,canvas.height)
     imgUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    // console.log(imgUrl)
    saveBtn.style.display='block'
    printBtn.style.display='block'
}


saveBtn.onclick=savePic;
printBtn.onclick=printPic;


function savePic(){
    console.log('savePic fired!')
    this.href=imgUrl;

    console.log(this)

    saveBtn.download="myimage.png"
}


function printPic(){

    let picDiv = document.createElement("div");
    picDiv.className='picDiv'
    let img = document.createElement("img");
    img.setAttribute('src',imgUrl);
    img.className='printPic'

    picDiv.appendChild(img);

    imageGrid.appendChild(picDiv)
}



var fileInput = document.querySelector(".fileinput");


fileInput.onchange=(e)=>{

    var file = e.target.files[0];

    let formData= new FormData();
    formData.append("file",file);

    axios.post('/upload',formData,{
        headers:{
            'Content-Type':'application/json'
        }
    })
    .then(res=>{
        console.log(res)
    })
}

