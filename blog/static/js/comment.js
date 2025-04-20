const commentsContainer = document.getElementById("comment");
const blogSlug = commentsContainer.dataset.slug;  // uzimamo slug direktno iz HTML-a
const commentForm = document.getElementById("comment-form"); // uzimamo formu
const csrf = document.getElementsByName("csrfmiddlewaretoken");// nuzimam middleware token
const messageContainer = document.getElementById("ajax-message-container");//za prikazivanje poruke koja se nalazi u base fajlu


function fetchComments() {
    $.ajax({
        type: "GET",
        url: "/comment/comments_list/",  // Uzimamo komentare sa servera
        data: { slug: blogSlug },        // Slug bloga koji šaljemo da filtriramo komentare
        success: function(response) {
            commentsContainer.innerHTML = '<h5>Comments:</h5>';  // Resetujemo prikaz komentara
            const data = response.data;

            const lastRepliedToId = sessionStorage.getItem("lastRepliedToId");  // Uzimamo poslednji odgovor na komentar da bi ostao otvoren replay od unesebog odgovora na komentar

            data.forEach(comment => {
                const repliesId = `replies-${comment.id}`;  // ID za odgovore na komentar
                const toggleId = `toggle-${comment.id}`;    // ID za toggle dugme (da prikaže odgovore)
                //html kod za prikaz komentara
                let html = ` 
                    <div class="comment mt-5">
                    <div class="comment_header">
                        <img class="profile_comment_image" src="${comment.profile_image}" alt="">
                        <h5 class="comment_user">${comment.user}</h5>
                    </div>
                    <p class="comment_content">${comment.content}</p>

                    <div class="comment_actions mt-2 ms-5">
                        <button class="btn btn-sm btn-outline-primary me-2 like-btn" data-id="${comment.id}">
                            👍 Like
                        </button>
                        <button class="btn btn-sm btn-outline-secondary reply-toggle-btn" data-id="${comment.id}">
                            💬 Reply
                        </button>
                        
                    </div>
                    <div class="reply-form-container mt-3" id="reply-form-${comment.id}" style="display:none;">
                        <input type="text" class="form-control mb-2 reply-input" placeholder="Write a reply...">
                        <button class="btn btn-sm btn-success submit-reply-btn" data-id="${comment.id}">Post Reply</button>
                    </div>
                `;
                
                // Ako komentar ima odgovore, dodaj ih
                if (comment.replies.length) {
                    html += `
                    <div class="toggle_replies" id="${toggleId}" style="cursor:pointer; color:#007bff">
                        ▼ ${comment.replies.length} answer${comment.replies.length > 1 ? 's' : ''}
                    </div>
                    <div class="replies" id="${repliesId}" style="display:none">
                    `;
                    comment.replies.forEach(r => {
                        html += `
                        <div class="reply">
                            <div class="comment_header">
                            <img class="profile_comment_image" src="${r.profile_image}" alt="">
                            <h6 class="comment_user">${r.user}</h6>
                            </div>
                            <p class="comment_content">${r.content}</p>
                        </div>
                        `;
                    });
                    html += `</div>`;  // Zatvaranje div-a za odgovore
                }
                html += `</div>`;  // Zatvaranje div-a za komentar

                commentsContainer.innerHTML += html;  // Dodajemo generisani HTML u stranicu

                // Dodavanje toggle funkcionalnosti za prikaz odgovora
                setTimeout(() => {
                    const toggle = document.getElementById(toggleId);
                    const replies = document.getElementById(repliesId);
                    if (toggle && replies) {
                        toggle.addEventListener("click", () => {
                            const hidden = replies.style.display === "none";
                            replies.style.display = hidden ? "block" : "none";
                            toggle.innerHTML = (hidden ? "▲ " : "▼ ") + `${comment.replies.length} answer${comment.replies.length > 1 ? 's' : ''}`;
                        });
                    }

                    //dodavanje funkcionalnosti za prikaz odgovora na komentar kada se doda odgovor
                    if (lastRepliedToId && parseInt(lastRepliedToId) === comment.id) {
                        if (replies) replies.style.display = "block";
                        if (toggle) toggle.innerHTML = "▲ " +
                            `${comment.replies.length} answer${comment.replies.length > 1 ? 's' : ''}`;

                        const replyForm = document.getElementById(`reply-form-${comment.id}`);
                        if (replyForm) replyForm.style.display = "block";

                        sessionStorage.removeItem("lastRepliedToId");  // izbriši nakon prikaza
                    }

                }, 0);  // Malo čekanje da se dodaju event listeneri
            });

            // Dodavanje funkcionalnosti za "Reply" dugme
            document.querySelectorAll('.reply-toggle-btn').forEach(button => {
                button.addEventListener("click", function(event) {
                    const commentId = button.dataset.id;  // ID komentara na koji se odgovara
                    const replyForm = document.getElementById(`reply-form-${commentId}`);  // Forma za unos odgovora
                    
                    // Toggle (prikazivanje ili skrivanje) forme za odgovor
                    if (replyForm.style.display === "none") {
                        replyForm.style.display = "block";  // Prikazivanje forme
                    } else {
                        replyForm.style.display = "none";  // Sakrivanje forme
                    }
                });
            });
        },
        error: function(err) {
            console.log(err);  // Ako dođe do greške, loguj grešku
        }
    });
}


// Pozivanje fetchComments kada stranica učita komentare
fetchComments();

// dodavanje komentara
commentForm.addEventListener('submit', function(event) {
    event.preventDefault();  // Sprečavamo da forma submituje i osveži stranicu prije pritiska buttona

    // Napravimo AJAX zahtev
    $.ajax({
        type: "POST",
        url: "/comment/add_comment/",
        //podatci za unios komentara
        data: {
            blog_slug: blogSlug, // uzimamo slug bloga
            content: commentForm.querySelector('input[name="content"]').value, // uzimamo komentar koji sam napisao
            csrfmiddlewaretoken: csrf[0].value  // token
        },
        success: function(response) {
            // Prikazivanje poruke
            messageContainer.innerHTML = `
                <div class="alert alert-success alert-dismissible fade show" role="alert">
                    ${response.message}
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            `;

            // Očisti polje
            commentForm.querySelector('input[name="content"]').value = "";

            // Prikazi komentare ponovo
            fetchComments();
        },
        error: function(err) {
            console.log(err);
        }
    });
});


// dodavanje odgovora na komentar
document.addEventListener("click", function (event) {
    if (event.target && event.target.classList.contains("submit-reply-btn")) {
        const button = event.target;
        const parentId = button.dataset.id;
        const replyInput = document.querySelector(`#reply-form-${parentId} .reply-input`);
        const replyContent = replyInput ? replyInput.value : "";

        $.ajax({
            type: "POST",
            url: "/comment/add_comment/",
            data: {
                blog_slug: blogSlug,  // koristiš globalni slug bloga
                content: replyContent,
                parent_id: parentId, // ovo označava da je odgovor
                csrfmiddlewaretoken: csrf[0].value
            },
            success: function(response) {
                console.log("Odgovor poslan:", response.message);
                replyInput.value = "";  // očisti polje nakon slanja

                // Opcionalno: prikaži poruku
                messageContainer.innerHTML = `
                    <div class="alert alert-success alert-dismissible fade show" role="alert">
                        ${response.message}
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                `;
                // Opcionalno: prikaži poruku kada se doda odgovor na komentar
                sessionStorage.setItem("lastRepliedToId", parentId);

                // Sakrij formu za unos odgovora nakon što je odgovor poslan
                document.getElementById(`reply-form-${parentId}`).style.display = 'none'; 

                //refrešh stranice
                fetchComments();  // ponovo učitaj komentare i odgovore

            },
            error: function(err) {
                console.log("Greška:", err);
            }
        });
    }
});