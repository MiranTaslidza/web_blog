const postForm = document.getElementById("post-form"); // uključujem post formu modala
const title = document.getElementById("id_title"); // uključujem title unutar modala 
const content = document.getElementById("id_content"); // uključujem content unutar modala
const csrf = document.getElementsByName("csrfmiddlewaretoken"); // uključujem CSRF token
const dropzone = document.querySelector(".dropzone"); // uključujem dropzone element

postForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Kreiraj FormData objekt iz forme
  let formData = new FormData(postForm);

  // Pribavi slike iz Dropzone instance (koristimo myDropzone koji si već definirao)
  myDropzone.getAcceptedFiles().forEach(file => {
      formData.append('image', file);
  });

  $.ajax({
    type: "POST",
    url: "/new_post/",
    data: formData,
    processData: false,  // Sprečava jQuery da automatski pretvori podatke u query string
    contentType: false,  // Sprečava jQuery da postavi Content-Type header
    success: function(response){
        // refresh stranice
        location.reload();
    },
    error: function(error){
        console.log(error);
    }
  });
});


// Isključi automatsko otkrivanje odmah
Dropzone.autoDiscover = false;

let myDropzone;

$(document).ready(function() {
  // Inicijaliziraj Dropzone ručno samo jednom
  myDropzone = new Dropzone(".dropzone", {
    url: "/new_post/",
    maxFiles: 10,
    acceptedFiles: ".jpg, .jpeg, .png, .gif",
    maxFilesize: 2,
    dictDefaultMessage: "Povucite slike ovdje ili kliknite za upload",
    dictFallbackMessage: "Vaš preglednik ne podržava drag 'n' drop upload.",
    dictInvalidFileType: "Ne podržavamo ovaj tip datoteke.",
    dictResponseError: "Greška pri upload-u slike.",
    dictCancelUpload: "Otkaži upload",
    dictCancelUploadConfirmation: "Da li ste sigurni da želite otkažete upload?",
    dictRemoveFile: "Ukloni sliku",
    dictMaxFilesExceeded: "Prešli ste maksimalni broj upload-a.",
    init: function() {
      this.on("sending", function(file, xhr, formData) {
        formData.append("csrfmiddlewaretoken", $('input[name="csrfmiddlewaretoken"]').val());
        console.log("Sending file:", file);
      });
    }
  });
});