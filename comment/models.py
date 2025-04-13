from django.db import models

# Create your models here.
from django.db import models
from django.conf import settings  # Preporučeno je koristiti settings.AUTH_USER_MODEL
from blog.models import Blog

class Comment(models.Model):
    blog = models.ForeignKey(
        Blog,
        on_delete=models.CASCADE,
        related_name='comments',
        help_text="Blog post na koji se komentar odnosi. Uzimamo slug iz Blog modela preko veze."
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='comments',
        help_text="Korisnik koji je napisao komentar."
    )
    content = models.TextField(help_text="Tekst komentara") # Tekst komentara
    created_at = models.DateTimeField(auto_now_add=True, help_text="Kada je komentar kreiran")
    updated_at = models.DateTimeField(auto_now=True, help_text="Kada je komentar zadnji put ažuriran")
    # Polje 'parent' omogućuje da se komentar poveže s roditeljskim komentarom
    parent = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='replies',
        help_text="Ako je postavljen, označava da je ovaj komentar odgovor na drugi komentar."
    )

    class Meta:
        ordering = ['-created_at']  # Komentari se mogu automatski redati po datumu kreiranja
        verbose_name = "Komentar"
        verbose_name_plural = "Komentari"

    def __str__(self):
        # Prikazuje se korisničko ime i slug blog posta
        return f'Komentar od {self.user.username} na {self.blog.slug}'

    def is_reply(self):
        # Jednostavna metoda za provjeru da li je komentar odgovor na drugi komentar
        return self.parent is not None
