const postForm = document.getElementById("post-form"); // uključujem post formu modala
const title = document.getElementById("id_title"); // uključujem title unutar modala 
const content = document.getElementById("id_content"); // uključujem content unutar modala
const csrf = document.getElementsByName("csrfmiddlewaretoken"); // uključujem CSRF token

postForm.addEventListener("submit", (e) => { // prilikom submitanja forme
  e.preventDefault();

  $.ajax({
    type: "POST",
    url: "/new_post/", // slanje zahtjeva na ispravan URL
    data: {
      'csrfmiddlewaretoken': csrf[0].value,
      'title': title.value,
      'content': content.value  // content je naziv polja unutar forme i unutar nje stavlam sadržaj polja iz modala
    },
    success: function(response){
      console.log(response); 
      // refresh stranice
      location.reload()
    },
    error: function(error){
      console.log(error);
    }
  });
});
