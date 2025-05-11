document.addEventListener('DOMContentLoaded', function() {
    // Dohvaćanje elemenata
    const likeButton = document.getElementById('like-button');
    const heartIcon = document.getElementById('heart-icon');
    const likeCount = document.getElementById('like-count');
    
    // Funkcija za dohvaćanje CSRF tokena iz kolačića
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                // Traži kolačić koji počinje s traženim imenom
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    
    // Provjera postoji li gumb za lajkove (korisnik je prijavljen)
    if (likeButton) {
        likeButton.addEventListener('click', function() {
            // Dohvaćanje ID-a bloga iz data atributa
            const blogId = this.dataset.blogId;
            
            // Dohvaćanje CSRF tokena
            const csrftoken = getCookie('csrftoken');
            
            // Slanje AJAX zahtjeva - ispravljeni URL (s dodatnim 's' u "likes")
            fetch(`/likes/blog/${blogId}/`, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': csrftoken,
                    'Content-Type': 'application/json'
                },
                credentials: 'same-origin'
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                // Ažuriranje broja lajkova
                likeCount.textContent = data.like_count;
                
                // Promjena izgleda srca ovisno o statusu
                if (data.status === 'liked') {
                    heartIcon.className = 'fa fa-heart fa-2x';
                    heartIcon.style.color = 'red';
                } else {
                    heartIcon.className = 'fa fa-heart-o fa-2x';
                    heartIcon.style.color = '';
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });
    }
});