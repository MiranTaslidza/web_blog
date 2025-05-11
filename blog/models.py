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
    is_published = models.BooleanField(default=True) # da li je blog objavljivan
    is_public = models.BooleanField(default=True)  # Da li je blog javni ili privatni

    # SEO polja
    meta_description = models.CharField(max_length=255, blank=True) # Ovo je kratak opis koji se koristi za pretragu na internetu
    meta_keywords = models.CharField(max_length=255, blank=True) # Ovo je kljucne rijeci koje se koriste za pretragu na internetu4

    def save(self, *args, **kwargs):
        # Ako slug nije postavljen, postavi privremeni slug sa ID-om
        if not self.slug:
            self.slug = f"temp-slug-{self.id if self.id else 'temp'}"
        
        # Generišemo SEO podatke ako nisu postavljeni
        if not self.meta_description:
            # Generisanje kratkog opisa (prvih 150 karaktera sadržaja)
            self.meta_description = self.content[:150]

        if not self.meta_keywords:
            # Generišemo ključne reči (prvi deo sadržaja, razdvojeno zarezima)
            self.meta_keywords = ",".join(self.content.split()[:5])  # Prvih 5 reči

        # Prvo sačuvaj blog, kako bi dobio ID
        super().save(*args, **kwargs)

        # Ažuriraj pravi slug nakon što dobije ID
        if not self.slug.startswith('temp-slug-'):
            return  # Ako je slug već postavljen, nema potrebe za promenom

        # Ažuriraj slug sa imenom aplikacije i ID-jem bloga
        self.slug = f"blog-{self.id}"
        
        # Ponovo sačuvaj sa novim slugom
        super().save(update_fields=["slug"])

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
