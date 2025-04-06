from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify


from tinymce.models import HTMLField


class Blog(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='blogs') # author bloga
    title = models.CharField(max_length=255) #naslov bloga
    slug = models.SlugField(unique=True, blank=True) # slug bloga koji če da sadrži  naziv aplikacij ei id bloga
    content = HTMLField() # sadrzaj bloga

    created_at = models.DateTimeField(auto_now_add=True) # kada je  blog kreiran
    updated_at = models.DateTimeField(auto_now=True) # kada je blog azuriran
    is_published = models.BooleanField(default=False) # da li je blog objavljivan
    is_public = models.BooleanField(default=True)  # Da li je blog javni ili privatni

    # SEO polja
    meta_description = models.CharField(max_length=255, blank=True) # Ovo je kratak opis koji se koristi za pretragu na internetu
    meta_keywords = models.CharField(max_length=255, blank=True) # Ovo je kljucne rijeci koje se koriste za pretragu na internetu4
    tags = models.ManyToManyField('Tag', blank=True) # kreiranje kategorije bloga

    # Metoda koja se poziva kada se sačuva blog i postavlja slug naziv aplikacije i ID-jem
    def save(self, *args, **kwargs):
        if not self.slug:
            # Slug sa nazivom aplikacije i ID-jem (npr. "blog-42")
            self.slug = f"blog-{self.id}" 
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

#polja za sliku
class Image(models.Model):
    blog = models.ForeignKey(Blog, on_delete=models.CASCADE, related_name='images') # sliku povezujemo sa blogom
    image = models.ImageField(upload_to='blog_images/') # sliku pohranjujemo u direktorij
    uploaded_at = models.DateTimeField(auto_now_add=True) # kada je slika pohranjena

    def __str__(self):
        return f"Image for {self.blog.title}"

class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name
