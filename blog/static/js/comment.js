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

                    <!-- Edit form -->	
                    <form class="edit-comment-form" id="edit-comment-${comment.id}" style="display: none;">
                    <input type="text" class="form-control edit-comment-input" id="edit-comment-input-${comment.id}" value="${comment.content}">
                    <button class="btn btn-sm btn-outline-primary save-edit-btn" data-id="${comment.id}">
                        Save
                    </button>
                    <button class="btn btn-sm btn-outline-secondary cancel-edit-btn">
                        Cancel
                    </button>
                    </form>

                    <!--menu button-->
                    <div class="btn-group">
                        <button style="border-radius: 100%;" type="button" class="menu-btn ms-3 btn btn-outline-secondary " data-bs-toggle="dropdown" aria-expanded="false">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
                            </svg>
                        </button>
                        <ul class="dropdown-menu">
                            <li>
                                <button class="dropdown-item btn btn-link edit-btn" data-target="#edit-comment-${comment.id}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                    <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                                </svg>
                                Edit
                                </button>
                            </li>
                                <li><a class="dropdown-item" href="#">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                                </svg>
                                Delete</a>
                            </li>
                        </ul>
                    </div>
                
            
               
                    <div class="comment_actions mt-2 ms-5">
                        <button class="btn btn-sm btn-outline-primary me-2 like-btn" data-id="${comment.id}">
                            👍 Like
                        </button>
                        <button class="btn btn-sm btn-outline-secondary reply-toggle-btn" data-id="${comment.id}">
                            💬 Reply
                        </button>
                        
                    </div>
                    <div class="reply-form-container mt-3" id="reply-form-${comment.id}" style="display:none;">
                        <div class="input-group">
                            <input type="text" class="ms-5 form-control reply-input" placeholder="Write a reply...">
                            <button class="ms-2 btn btn-sm  btn-outline-primary submit-reply-btn" data-id="${comment.id}">Post Reply</button>
                        </div>
                    </div>
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

            // Dodavanje funkcionalnosti za "Reply" dugme +++++++
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
        const replyContent = replyInput ? replyInput.value.trim() : ""; // dodao trim() da se uklone whitespace

        if (replyContent === "") {
            alert("Molimo unesite tekst odgovora");
            return;
        }

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


// 1) Otvori formu na klik “Edit”
commentsContainer.addEventListener('click', e => {
    const btn = e.target.closest('.edit-btn');
    if (!btn) return;
  
    e.preventDefault();
    const form = document.querySelector(btn.dataset.target);
    const p    = form.previousElementSibling;
    const menu = btn.closest('.btn-group'); // meni koji treba sakriti
  
    // Sakrij paragraf i meni, prikaži formu
    p.style.display    = 'none';
    form.style.display = 'block';
    if (menu) menu.style.display = 'none';
  });
  
  // 2) Sakrij formu na klik “Cancel”
  commentsContainer.addEventListener('click', e => {
    if (!e.target.matches('.cancel-edit-btn')) return;
  
    e.preventDefault();
    const form = e.target.closest('form.edit-comment-form');
    const p    = form.previousElementSibling;
    const menu = form.nextElementSibling; // meni je odmah ispod forme
  
    // Sakrij formu, prikaži paragraf i meni
    form.style.display = 'none';
    if (p) p.style.removeProperty('display');
    if (menu) menu.style.removeProperty('display');
  });
  
