from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify

<<<<<<< HEAD
=======
from tinymce.models import HTMLField

>>>>>>> 0dea486 (tinnymce uređivač teksta)
class Blog(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='blogs')
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True)
<<<<<<< HEAD
    content = models.TextField()
=======
    content = HTMLField()
>>>>>>> 0dea486 (tinnymce uređivač teksta)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_published = models.BooleanField(default=False)
    # SEO polja
    meta_description = models.CharField(max_length=255, blank=True)
    meta_keywords = models.CharField(max_length=255, blank=True)
    tags = models.ManyToManyField('Tag', blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

class Image(models.Model):
    blog = models.ForeignKey(Blog, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='blog_images/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image for {self.blog.title}"

class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name
