from django.db import models
from django.contrib.auth.models import User

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

