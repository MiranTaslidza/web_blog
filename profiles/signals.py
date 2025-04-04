from django.db.models.signals import post_save 
from django.dispatch import receiver 
from django.contrib.auth.models import User #uvozim model User koji je kreiran po defaultu
from .models import Profile #uvozim model Profile koji sam kreirao


# Ova dekoracija povezuje signal post_save sa modelom User. To znači:
# •	Signal se aktivira svaki put kada se sačuva instanca modela User (novi korisnik ili postojeći korisnik).
@receiver(post_save, sender=User)

# •	Parametri funkcije:
# o	sender: Model koji je poslao signal (u ovom slučaju, User).
# o	instance: Konkretna instanca modela User koja je sačuvana.
# o	created: True ako je instanca tek napravljena, False ako je samo ažurirana.
# o	kwargs: Dodatni parametri (rijetko se koriste).
def create_user_profile(sender, instance, created, **kwargs):

# Provjerava da li je korisnik nov (tj. created == True).
# Ako jeste, kreira novu instancu Profile i automatski povezuje je sa novim korisnikom.
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save() # instance.profile pristupa povezanoj instanci Profile. save() osigurava da se izmjene u Profile sačuvaju u bazi
# Ako izmijeniš korisnika (User) i ako profil (Profile) zavisi od toga, ova funkcija osigurava da se te promjene odraze i na profil.