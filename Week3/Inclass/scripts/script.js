let cBox = document.getElementById("colorBox")
let colorBtn = document.getElementById("changeColor")
let imgBox = document.getElementById("QImage")
let imageBtn = document.getElementById("toggleImage")

let assignRandomColor = function ()

{
    let rComp = 255 * Math.random()
    let gComp = 255 * Math.random()
    let bComp = 255 * Math.random()

    cBox.style.backgroundColor = "rgb(" + rComp + ", " + gComp + ", " + bComp + ")"
}


const toggleImage = () =>
{
    console.log(imgBox.src)
    if(imgBox.src.includes("Q1"))
    {
       imgBox.src = "images/Q3.png"
    }
    else
    {
        imgBox.src = "images/Q1.png" 
    }
    
    
}
colorBtn.addEventListener("click", assignRandomColor)
imageBtn.addEventListener("click", toggleImage)



























