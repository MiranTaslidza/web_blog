const commentsContainer = document.getElementById("comment");
const blogSlug = commentsContainer.dataset.slug;  // uzimamo slug direktno iz HTML-a
const commentForm = document.getElementById("comment-form"); // uzimamo formu
const csrf = document.getElementsByName("csrfmiddlewaretoken");// nuzimam middleware token
const messageContainer = document.getElementById("ajax-message-container");//za prikazivanje poruke koja se nalazi u base fajlu


function fetchComments() {
    $.ajax({
        type: "GET",
        url: "/comment/comments_list/",
        data: { slug: blogSlug },            // šaljemo slug u GET
        success: function(response) {
            commentsContainer.innerHTML = '<h5>Comments:</h5>';  // resetujemo
            const data = response.data;
            data.forEach(comment => {
                const repliesId = `replies-${comment.id}`;
                const toggleId = `toggle-${comment.id}`;
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
                if (comment.replies.length) {
                    html += `
                    <div class="toggle_replies" id="${toggleId}" style="cursor:pointer; color:#007bff">
                        ▼ ${comment.replies.length} answer${comment.replies.length>1?'s':''}
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
                    html += `</div>`;
                }
                html += `</div>`;
                commentsContainer.innerHTML += html;

                // toggle
                setTimeout(() => {
                    const toggle = document.getElementById(toggleId);
                    const replies = document.getElementById(repliesId);
                    if (toggle && replies) {
                        toggle.addEventListener("click", () => {
                            const hidden = replies.style.display === "none";
                            replies.style.display = hidden ? "block" : "none";
                            toggle.innerHTML = (hidden ? "▲ " : "▼ ")
                            + `${comment.replies.length} answer${comment.replies.length>1?'s':''}`;
                        });
                    }
                }, 0);
            });
        },
        error: function(err) {
            console.log(err);
        }
    });
}

// Pozivanje fetchComments kada stranica učita komentare
fetchComments();

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



