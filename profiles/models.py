from django.db import models
from django.contrib.auth.models import User
from django.core.files.storage import default_storage

# Create your models here.
class Profile (models.Model):
    # ovo je da svaki korisnik može de ima samo jedan profil i uvozim SUewr iz django.contrib.auth.models
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    # polje za biografiju
    bio = models.TextField(blank=True)
    # polje avatar downloadovati ču sliku https://pixabay.com/ koja če da predstavi avatar profila 
    # dowloadovati avatar sliku i smjestiti je unutr media foldera u projektu
    profile_image = models.ImageField(default="avatar.png", upload_to="avatars/")   
    # polje za datum i god rođenja
    date_of_birth = models.DateField(null=True, blank=True)
    # polje za datum kada je profil izmenjen 
    updated = models.DateTimeField(auto_now=True)
    # polje za datum kada je profil kreiran
    created = models.DateTimeField(auto_now_add=True)

    def  __str__(self):
        return f"profile of the user {self.user.username}"

    def save(self, *args, **kwargs):
            """Ako korisnik menja sliku, brišemo staru pre nego šaljemo novu."""
            try:
                # Uzimamo trenutni objekat iz baze (pre nego šaljemo novu)
                old_profile = Profile.objects.get(pk=self.pk)
                if old_profile.profile_image and old_profile.profile_image != self.profile_image:
                    # Proveravamo da li je stara slika različita od nove i da li nije default avatar
                    if old_profile.profile_image.name != "avatar.png":
                        default_storage.delete(old_profile.profile_image.path)
            except Profile.DoesNotExist:
                pass  # Ako korisnik tek kreira profil, nema staru sliku za brisanje

            super().save(*args, **kwargs)  # Pozivamo originalnu save() metodu da sačuva novu sliku