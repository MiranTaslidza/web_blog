const commentsContainer = document.getElementById("comment");
const blogSlug = commentsContainer.dataset.slug;  // uzimamo slug direktno iz HTML-a
const commentForm = document.getElementById("comment-form"); // uzimamo formu
const csrf = document.getElementsByName("csrfmiddlewaretoken");// nuzimam middleware token
const messageContainer = document.getElementById("ajax-message-container");//za prikazivanje poruke koja se nalazi u base fajlu



function fetchComments() {
    $.ajax({
      type: "GET",
      url: "/comment/comments_list/",
      data: { slug: blogSlug },
      success: function(response) {
        // Reset komentara
        commentsContainer.innerHTML = '<h5>Comments:</h5>';
        const data = response.data;
        const lastRepliedToId = sessionStorage.getItem("lastRepliedToId");
  
        // Generišemo sav HTML za svaki komentar i odgovore
        data.forEach(comment => {
          const repliesId = `replies-${comment.id}`;
          const toggleId = `toggle-${comment.id}`;
  
          // Generišemo HTML za odgovore
          let repliesHtml = "";
          if (comment.replies.length) {
            comment.replies.forEach(r => {
              repliesHtml += `
                <div class="reply">
                  <div class="comment_header">
                    <img class="profile_comment_image" src="${r.profile_image}" alt="">
                    <h6 class="comment_user">${r.user}</h6>
                  </div>

                  <p class="comment_content">${r.content}</p>

                  <form class="edit-comment-form" id="edit-comment-${r.id}" style="display:none;">
                    <textarea class="ms-5 form-control edit-comment-input" id="edit-comment-input-${r.id}">${r.content}</textarea>
                    <div class="edit_btn mt-2">
                      <button class="btn btn-sm btn-outline-primary save-edit-btn" data-id="${r.id}">Save</button>
                      <button class="btn btn-sm btn-outline-secondary cancel-edit-btn">Cancel</button>
                    </div>
                  </form>

                  <div class="btn-group">
                    <button style="border-radius: 100%;" type="button" class="menu-btn ms-3 btn btn-outline-secondary" data-bs-toggle="dropdown">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
                    </svg>
                    </button>
                    <ul class="dropdown-menu">
                      <li>
                        <button class="dropdown-item edit-btn" data-target="#edit-comment-${r.id}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                            </svg>
                            Edit
                        </button>
                      </li>
                      <li>
                        <button class="dropdown-item delete-comment-btn" data-id="${r.id}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash2" viewBox="0 0 16 16">
                            <path d="M14 3a.7.7 0 0 1-.037.225l-1.684 10.104A2 2 0 0 1 10.305 15H5.694a2 2 0 0 1-1.973-1.671L2.037 3.225A.7.7 0 0 1 2 3c0-1.105 2.686-2 6-2s6 .895 6 2M3.215 4.207l1.493 8.957a1 1 0 0 0 .986.836h4.612a1 1 0 0 0 .986-.836l1.493-8.957C11.69 4.689 9.954 5 8 5s-3.69-.311-4.785-.793"/>
                            </svg>
                            Delete
                        </button>
                      </li>
                    </ul>
                  </div>
                  <div class="comment_actions mt-2">
                    <button class="btn btn-sm btn-outline-primary like-btn" data-id="${r.id}">👍 Like</button>
                  </div>
                </div>
              `;
            });
          }
  
          // Celokupan HTML jednog komentara
          let html = `
            <div class="comment mt-5" id="comment-${comment.id}">
              <div class="comment_header">
                <img class="profile_comment_image" src="${comment.profile_image}" alt="">
                <h5 class="comment_user">${comment.user}</h5>
              </div>
              <p class="comment_content">${comment.content}</p>
  
              <form class="edit-comment-form" id="edit-comment-${comment.id}" style="display:none;">
                <textarea class="ms-5 form-control edit-comment-input" id="edit-comment-input-${comment.id}">${comment.content}</textarea>
                <div class="edit_btn mt-2">
                  <button class="btn btn-sm btn-outline-primary save-edit-btn" data-id="${comment.id}">Save</button>
                  <button class="btn btn-sm btn-outline-secondary cancel-edit-btn">Cancel</button>
                </div>
              </form>
  
              <div class="btn-group">
                <button style="border-radius: 100%;" type="button" class="menu-btn ms-3 btn btn-outline-secondary" data-bs-toggle="dropdown">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
                </svg>
                    </button>
                    <ul class="dropdown-menu">
                    <li>
                    <button class="dropdown-item edit-btn" data-target="#edit-comment-${comment.id}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                    <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                    </svg>
                    Edit
                    </button>
                  </li>
                  <li>
                    <button class="dropdown-item delete-comment-btn" data-id="${comment.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash2" viewBox="0 0 16 16">
                        <path d="M14 3a.7.7 0 0 1-.037.225l-1.684 10.104A2 2 0 0 1 10.305 15H5.694a2 2 0 0 1-1.973-1.671L2.037 3.225A.7.7 0 0 1 2 3c0-1.105 2.686-2 6-2s6 .895 6 2M3.215 4.207l1.493 8.957a1 1 0 0 0 .986.836h4.612a1 1 0 0 0 .986-.836l1.493-8.957C11.69 4.689 9.954 5 8 5s-3.69-.311-4.785-.793"/>
                        </svg>
                        Delete
                    </button>
                  </li>
                </ul>
              </div>
  
              <div class="comment_actions mt-2 ms-5">
                <button class="btn btn-sm btn-outline-primary like-btn" data-id="${comment.id}">👍 Like</button>
                <button class="btn btn-sm btn-outline-secondary reply-toggle-btn" data-id="${comment.id}">💬 Reply</button>
              </div>
  
              <div class="reply-form-container mt-3" id="reply-form-${comment.id}" style="display:none;">
                <div class="input-group">
                  <input type="text" class="ms-5 form-control reply-input" placeholder="Write a reply...">
                  <button class="ms-2 btn btn-sm btn-outline-primary submit-reply-btn" data-id="${comment.id}">Post Reply</button>
                </div>
              </div>
            </div>
  
            <div class="toggle_replies" id="${toggleId}" style="cursor:pointer; color:#007bff">
              ▼ ${comment.replies.length} answer${comment.replies.length === 1 ? '' : 's'}
            </div>
            <div class="replies" id="${repliesId}" style="display:none;">
              ${repliesHtml}
            </div>
          `;
  
          // Dodajemo u container
          commentsContainer.innerHTML += html;
  
          // Ako je odgovor dodat ranije, prikaži ga
          if (lastRepliedToId && parseInt(lastRepliedToId) === comment.id) {
            const repliesDiv = document.getElementById(repliesId);
            const toggleBtn = document.getElementById(toggleId);
            repliesDiv.style.display = 'block';
            toggleBtn.innerHTML = '▲ ' + `${comment.replies.length} answer${comment.replies.length === 1 ? '' : 's'}`;
            document.getElementById(`reply-form-${comment.id}`).style.display = 'block';
            sessionStorage.removeItem("lastRepliedToId");
          }
        });
  
        // Dodavanje listenera za sve toggles i dugmad
        document.querySelectorAll('.toggle_replies').forEach(btn => {
          btn.addEventListener('click', () => {
            const id = btn.id.split('-')[1];
            const repliesDiv = document.getElementById(`replies-${id}`);
            const hidden = repliesDiv.style.display === 'none';
            repliesDiv.style.display = hidden ? 'block' : 'none';
            btn.innerHTML = (hidden ? '▲ ' : '▼ ') + `${repliesDiv.children.length} answer${repliesDiv.children.length === 1 ? '' : 's'}`;
          });
        });
  
        document.querySelectorAll('.menu-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const menu = btn.nextElementSibling;
            menu.classList.toggle('show');
          });
        });
  
        document.querySelectorAll('.reply-toggle-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            const form = document.getElementById(`reply-form-${id}`);
            form.style.display = form.style.display === 'none' ? 'block' : 'none';
          });
        });
  
        // Ostatak listenera (save, cancel, delete, submit reply) zadrži kako imaš.
      },
      error: function(err) {
        console.error(err);
      }
    });
  }
  
  // Početni poziv
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

//memorisanje  editovanog komentara klikom na dugme "Save" poziva se url koji memoriše editovani komentar u bazu
commentsContainer.addEventListener('click', async (e) => {
    const saveBtn = e.target.closest('.save-edit-btn');
    if (!saveBtn) return;

    e.preventDefault();

    const commentId = saveBtn.dataset.id;
    const form = document.querySelector(`#edit-comment-${commentId}`);
    const textarea = form.querySelector('.edit-comment-input');
    const newContent = textarea.value.trim();

    if (!newContent) return;

    try {
        await fetch('/comment/edit_comment/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrf[0].value,  // koristiš prvi pronađeni token
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                comment_id: commentId,
                content: newContent
            })
        });


        // Ažuriraj prikaz komentara
        const contentParagraph = form.previousElementSibling;
        contentParagraph.textContent = newContent;

        // Sakrij formu i prikaži paragraf + meni (ako postoji)
        form.style.display = 'none';
        contentParagraph.style.display = 'block';

        const menu = saveBtn.closest('.btn-group');
        if (menu) menu.style.display = 'inline-block';
    } catch (error) {
        console.error('Greška prilikom slanja komentara:', error);
    }
});

// brisanje komentara
commentsContainer.addEventListener('click', async e => {
    const deleteBtn = e.target.closest('.delete-comment-btn');

    if (!deleteBtn) return;
    
    const commentId = deleteBtn.dataset.id;
    
    if (!commentId) return;

    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
        const response = await fetch('/comment/delete_comment/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrf[0].value,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                comment_id: commentId
            })
        });

        if (response.ok) {
            const commentDiv = deleteBtn.closest('.comment');
            if (commentDiv) commentDiv.remove();
        }

        fetchComments();

    } catch (error) {
        // opcionalno: možeš prikazati grešku korisniku alertom ako želiš
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
    const input = form.querySelector('.edit-comment-input'); // input u formi
  
    // Sakrij paragraf i meni, prikaži formu
    p.style.display    = 'none';
    form.style.display = 'block';
    if (menu) menu.style.display = 'none';
    // fokusiraj na input
    if (input) {
        input.focus();
        // Pomjeri kursor na kraj teksta
        const val = input.value;
        input.value = '';
        input.value = val;
    } 
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
  
//   ligika koja automatski otkriva tekst u text arei
  commentsContainer.addEventListener('click', e => {
    const btn = e.target.closest('.edit-btn');
    if (!btn) return;

    e.preventDefault();
    const form = document.querySelector(btn.dataset.target);
    const p    = form.previousElementSibling;
    const menu = btn.closest('.btn-group');

    // Sakrij paragraf i meni, prikaži formu
    p.style.display    = 'none';
    form.style.display = 'block';
    if (menu) menu.style.display = 'none';

    // Fokusiraj textarea i pomjeri kursor na kraj
    const textarea = form.querySelector('.edit-comment-input');
    if (textarea) {
        textarea.focus();
        // Resetuj visinu da raste ispravno
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    }

    // Automatsko rastvaranje textarea pri unosu
    textarea.addEventListener('input', () => {
        textarea.style.height = 'auto';  // Resetuj visinu
        textarea.style.height = textarea.scrollHeight + 'px';  // Podesi visinu prema sadržaju
    });
});
