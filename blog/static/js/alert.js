const postElement = document.getElementById('delete');
const postId = postElement.getAttribute('data-id');

document.addEventListener("DOMContentLoaded", function () {
    const delete_btn = document.getElementById('delete');

    if (delete_btn) {  // Provera da dugme postoji
        delete_btn.addEventListener('click', function (event) {
            event.preventDefault();

            Swal.fire({
                title: "Are you sure?",
                text: "Do you want to delete the post!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Delete",
                cancelButtonText: "Cancel"
            }).then((result) => {
                if (result.isConfirmed) {
                    const postId = delete_btn.getAttribute('data-id');
                    window.location.href = "/blog_delete/" + postId;
                }
            });
        });
    } else {
        console.error("Dugme sa ID 'delete' ne postoji!");
    }
});
