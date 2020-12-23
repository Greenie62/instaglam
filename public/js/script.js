var cameraBtn = document.querySelector('.camerabutton');
var captureBtn = document.querySelector(".capturebtn");
var printBtn = document.querySelector(".printbutton");
var captionBtn = document.querySelector(".btn-caption");
var imageGrid = document.querySelector(".imageGrid")
printBtn.style.display = 'none'
captureBtn.style.display = 'none'

var canvas = document.querySelector("canvas");

let video = document.createElement("video");
video.className='video'
let vidCard = document.querySelector('.videocard')
video.muted = true;

let imgUrl, currentImg,ctx;

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
    context.font = "200px";
    context.fillStyle="red"
    context.fill()
    let msg = prompt("Add a caption?")
    context.fillText(msg, 75, 10);
     imgUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    // console.log(imgUrl)
    // saveBtn.style.display='block'
    printBtn.style.display='block'

}


printBtn.onclick=printPic;


let currentImgData;


function printPic(){

    let picDiv = document.createElement("div");
    picDiv.className='picDiv'
    let img = document.createElement("img");
    img.setAttribute('src',imgUrl);
    currentImgData = img
    img.className='printPic'
    let a = document.createElement("a");
    a.href=imgUrl;
    let fileName = prompt("Filename?")
    a.innerText = fileName + " --save"
    a.download=fileName + ".png"

    let pShare = document.createElement("p");
    pShare.innerText="Share";
    pShare.setAttribute('data-file',imgUrl)
    pShare.onclick=(e)=>sharePic(e)

    picDiv.appendChild(img);
    picDiv.appendChild(a);
    picDiv.appendChild(pShare);

    imageGrid.appendChild(picDiv)
    // imageGrid.appendChild(a)
    // imageGrid.appendChild(pShare)
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
        let picDiv = document.createElement("div");
        let a = document.createElement("a");
        let pShare = document.createElement("p");
        pShare.innerText="Share";
        pShare.onclick=(e)=>sharePic(e)
        a.href=res.data.filePath;
        a.innerText=res.data.fileName.split(".")[0]
        a.onclick=()=>alert("You already have this pic on your filesystem! :)")
        picDiv.className='picDiv'
        let img = document.createElement("img");
        img.setAttribute('src',res.data.filePath);
        img.className='printPic'
    
        picDiv.appendChild(img);
        
        imageGrid.appendChild(picDiv)
        imageGrid.appendChild(a)
    })
}


function sharePic(e){
    console.log(e.target);
    console.log(e.target.getAttribute('data-file'))
    fetch("/share",{
        method:"POST",
        headers:{
            'Content-Type':"application/json"
        },
        body:JSON.stringify({file:currentImgData})
    })
    .then(res=>res.json())
    .then(res=>{
        console.log(res)
    })
}



captionBtn.onclick=()=>{
    if(imgUrl === undefined)return;
    var msg= prompt("Add what caption?");
    console.log(msg)
    ctx.font = "20px";
    ctx.fillText(msg, 10, 100);
}

