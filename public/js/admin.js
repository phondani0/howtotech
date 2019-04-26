// JQuery
$(document).ready(() => {
    // Init tinymce
    tinymce.init({
        selector: '#post-body'
    });
});

console.log(document.getElementById('header_img-upload'))
const custom_btn = document.getElementById('header_img-upload');

custom_btn.addEventListener('click', replace_btn);

function replace_btn(e) {
    const real_btn = document.getElementById('upload_file');
    const upload_text = document.getElementById('upload_text');
    real_btn.click();
    real_btn.addEventListener('change', (e) => {
        console.log(real_btn.value);
        if (real_btn.value) {
            const allowTypes = ['image/jpeg', 'image/png', 'image/svg'];
            const isValidType = real_btn.files ? allowTypes.indexOf(real_btn.files[0].type) > -1 ? true : false : false;
            // console.log(isValidType);
            if (isValidType === true) {
                upload_text.innerText = real_btn.value.replace(/^(.*[\\\/])/g, "");
            } else {
                upload_text.innerText = 'Image must be of jpeg or png type';
            }
        } else {
            upload_text.innerText = 'No file chosen';
        }
    })
}