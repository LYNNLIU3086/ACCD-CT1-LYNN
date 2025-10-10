document.addEventListener("DOMContentLoaded", function () {
  const thumbImages = document.querySelectorAll(".gallery-thumb > img");
  const scImage = document.getElementById("showcaseImage");
  const arrowRight = document.querySelector(".showcase-arrow-right");
  const arrowLeft = document.querySelector(".showcase-arrow-left");

  let currentIndexThumb = 0;

  function changeImage(newImage) {
    scImage.src = newImage.src;

    thumbImages.forEach(img => {
      img.parentElement.classList.remove("current-thumb");
    });

    newImage.parentElement.classList.add("current-thumb");
    currentIndexThumb = Array.from(thumbImages).indexOf(newImage);
  }

  thumbImages.forEach(img => {
    img.addEventListener("click", () => {
      changeImage(img);
    });
  });

  arrowRight.addEventListener("click", () => {
    currentIndexThumb = (currentIndexThumb + 1) % thumbImages.length;
    changeImage(thumbImages[currentIndexThumb]);
  });

  arrowLeft.addEventListener("click", () => {
    currentIndexThumb = (currentIndexThumb - 1 + thumbImages.length) % thumbImages.length;
    changeImage(thumbImages[currentIndexThumb]);
  });
});
