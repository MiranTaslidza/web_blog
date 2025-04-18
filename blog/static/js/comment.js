const comments = document.getElementById("comment");

$.ajax({
    type: "GET",
    url: "/comment/comments_list/",
    success: function(response) {
        const data = response.data;

        data.forEach(comment => {
            // jedinstveni ID za blok sa odgovorima
            const repliesId = `replies-${comment.id}`;
            const toggleId = `toggle-${comment.id}`;

            let commentHTML = `
                <div class="comment mt-5">
                    <div class="comment_header">
                        <img class="profile_comment_image" src="${comment.profile_image}" alt="Profilna slika">
                        <h5 class="comment_user">${comment.user}</h5>
                    </div>
                    <p class="comment_content">${comment.content}</p>
            `;

            if (comment.replies.length > 0) {
                commentHTML += `
                    <div class="toggle_replies" id="${toggleId}" style="cursor:pointer; color: #007bff;">
                        ▼ ${comment.replies.length} answer${comment.replies.length > 1 ? 's' : ''}
                    </div>
                    <div class="replies" id="${repliesId}" style="display: none;">
                `;

                comment.replies.forEach(reply => {
                    commentHTML += `
                        <div class="reply">
                            <div class="comment_header">
                                <img class="profile_comment_image" src="${reply.profile_image}" alt="Profilna slika">
                                <h6 class="comment_user">${reply.user}</h6>
                            </div>
                            <p class="comment_content">${reply.content}</p>
                        </div>
                    `;
                });

                commentHTML += `</div>`; // zatvori .replies
            }

            commentHTML += `</div>`; // zatvori .comment
            comments.innerHTML += commentHTML;

            // Dodavanje event listenera (nakon što je HTML ubačen u DOM)
            setTimeout(() => {
                const toggle = document.getElementById(toggleId);
                const replies = document.getElementById(repliesId);
                if (toggle && replies) {
                    toggle.addEventListener("click", () => {
                        const isHidden = replies.style.display === "none";
                        replies.style.display = isHidden ? "block" : "none";
                        toggle.innerHTML = isHidden
                            ? `▲ ${comment.replies.length} answer${comment.replies.length > 1 ? 's' : ''}`
                            : `▼ ${comment.replies.length} answer${comment.replies.length > 1 ? 's' : ''}`;
                    });
                }
            }, 0);
        });
    },
    error: function(error) {
        console.log(error);
    }
});