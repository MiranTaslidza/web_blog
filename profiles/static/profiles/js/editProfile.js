const editProfile = document.getElementById('edit_profile'); // Uzima edit profile formu iz HTML-a
const userPk = editProfile.getAttribute('data-pk'); // Dobijanje ID-a korisnika
const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value; // Dobijanje CSRF tokena
const form = document.getElementById('edit-profile-form'); // Uzima formu iz HTML-a

form.addEventListener('submit', function (e) {
    e.preventDefault(); // Sprečava klasično slanje forme

    let formData = new FormData(form); // Kreira FormData objekat
    formData.append('csrfmiddlewaretoken', csrftoken); // Dodaje CSRF token

    $.ajax({
        type: 'POST',
        url: `/profiles/edit/${userPk}/`, //url za ažuriranje profila
        data: formData,
        processData: false,  // Isključuje automatsku obradu podataka (potrebno za fajlove)
        contentType: false,  // Isključuje defaultni content type
        success: function (response) {
            alert('Profile updated successfully!');
        },
        error: function (error) {
            console.log(error);
        }
    });
});