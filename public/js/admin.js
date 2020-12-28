// JQuery
$(document).ready(() => {
  // Init tinymce
  tinymce.init({
    selector: '#post-body'
  });
});

// If image exists :- previeImg
const headerImg = document.getElementById('header_img');
const hasImg = headerImg && headerImg.getAttribute('src') != "" ? true : false;

if (hasImg) {
  previewImage();
}

const custom_btn = document.getElementById('header_img-upload');
if (custom_btn) {
  custom_btn.addEventListener('click', replace_btn);
}

const real_btn = document.getElementById('upload_file');
const upload_text = document.getElementById('upload_text');

function replace_btn(e) {
  real_btn.click();
  // ChangeEvent
  real_btn.addEventListener('change', (e) => {
    // console.log(real_btn.value);
    if (real_btn.value) {
      const allowTypes = ['image/jpeg', 'image/png'];
      const isValidType = real_btn.files ? allowTypes.indexOf(real_btn.files[0].type) > -1 ? true : false : false;
      // console.log(isValidType);
      if (isValidType === true) {
        // replace btn text
        upload_text.innerText = real_btn.value.replace(/^(.*[\\\/])/g, "");
        loadImage();
      } else {
        upload_text.innerText = 'Image must be of jpeg or png type';
      }
    } else {
      upload_text.innerText = 'No file chosen';
    }
  })
}

function loadImage() {
  // Preview uploaded img to the page
  const image = document.querySelector('#header_img-container img');
  const imageSize = document.querySelector('#uploaded_img-size');

  const reader = new FileReader();

  reader.onload = function (e) {
    image.src = e.target.result;
    // Image Size
    imageSize.innerText = `Size ${Math.round(e.loaded / 1000)} KB`;
  }
  // Preview Image after image is loaded
  reader.onloadend = previewImage;
  reader.readAsDataURL(real_btn.files[0]);
}

function previewImage() {
  const image = document.querySelector('#header_img-container img');
  const imgContainer = document.getElementById('header_img-container');
  const removeImg = document.querySelector('#header_img-container #remove_img');
  removeImg.style.paddingLeft = "0";
  removeImg.style.paddingRight = "0";
  imgContainer.classList.remove('d-none');
  removeImg.style.bottom = `${imgContainer.clientHeight - image.clientHeight}px`;

  // Event MouseOver
  imgContainer.addEventListener('mouseover', (e) => {
    if (e.target.id === "header_img") {
      removeImg.style.display = "block";
      const imageWidth = image.clientWidth;
      let removeImgWidth = removeImg.clientWidth - Number.parseFloat(removeImg.style.paddingLeft) - Number.parseFloat(removeImg.style.paddingRight);
      removeImg.style.padding = `0 ${imageWidth/2 - removeImgWidth/2}px`;
    }
  });
  // Event MouseLeave
  imgContainer.addEventListener('mouseleave', (e) => {
    removeImg.style.paddingLeft = "0";
    removeImg.style.paddingRight = "0";
    removeImg.style.display = "none";
  });

}

const deleteImg = document.querySelector('#header_img-container #remove_img');

if (deleteImg) {
  deleteImg.addEventListener('click', removeImage);
}

function removeImage(e) {
  console.log('delete clicked');
  const imgContainer = document.getElementById('header_img-container');
  const input = document.getElementById('upload_file');
  // To remove the uploaded image
  input.value = "";
  input.type = "";
  input.type = "file";

  document.getElementById('header_img').setAttribute('src', "");
  imgContainer.classList.add('d-none');
}