from django.db import models
from django.contrib.auth import get_user_model
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey

User = get_user_model()

class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE) #korisnik koji postavlja komentar
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE) # povezivanja komentara sa bilo kojim modelom 
    object_id = models.PositiveIntegerField() # insrtanca modela koji se komentariše
    content_object = GenericForeignKey('content_type', 'object_id')  # pristupanje objektu koji je komentarisan

    parent = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE, related_name='replies') # odgovori na komentare
    text = models.TextField() # tekst komentara ili odgovora
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def is_reply(self):
        return self.parent is not None
