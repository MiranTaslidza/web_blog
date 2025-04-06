const postForm = document.getElementById("post-form"); 
const csrf = document.getElementsByName("csrfmiddlewaretoken")[0];
const dropzone = document.querySelector(".dropzone");

Dropzone.autoDiscover = false;

let myDropzone;

$(document).ready(function () {
  myDropzone = new Dropzone(".dropzone", {
    url: "/new_post/",
    maxFiles: 10,
    acceptedFiles: ".jpg, .jpeg, .png, .gif",
    maxFilesize: 2,
    addRemoveLinks: true,
    dictDefaultMessage: "Povucite slike ovdje ili kliknite za upload",
    init: function () {
      this.on("sending", function (file, xhr, formData) {
        formData.append("csrfmiddlewaretoken", csrf.value);
      });
    },
  });

  postForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(postForm);

    // Dodaj sve fajlove iz dropzone u formu
    myDropzone.getAcceptedFiles().forEach((file) => {
      formData.append("image", file);
    });

    $.ajax({
      type: "POST",
      url: "/new_post/",
      data: formData,
      processData: false,
      contentType: false,
      success: function (response) {
        // ❗❗ Ovdje je ključ: browser će sada ići na početnu stranicu
        window.location.href = "/";
      },
      error: function (error) {
        console.error("Greška:", error);
      },
    });
  });
});
