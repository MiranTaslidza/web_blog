from django.db import models
from django.conf import settings
from blog.models import Blog
from comment.models import Comment
class Like(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='likes', help_text="Korisnik koji je lajkao")

    # Opcionalne reference - samo jedna će biti korištena za svaki lajk
    blog = models.ForeignKey(Blog,on_delete=models.CASCADE, null=True, blank=True, related_name='likes', help_text="Blog koji je lajkan")
    
    comment = models.ForeignKey(Comment, 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True,
        related_name='likes',
        help_text="Komentar koji je lajkan"
    )
    
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Vrijeme kada je lajk kreiran"
    )
    
    class Meta:
        # Osigurava da korisnik može lajkati objekt samo jednom
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'blog'],
                condition=models.Q(blog__isnull=False),
                name='unique_user_blog_like'
            ),
            models.UniqueConstraint(
                fields=['user', 'comment'],
                condition=models.Q(comment__isnull=False),
                name='unique_user_comment_like'
            ),
            # Osigurava da je točno jedno polje (blog ili comment) postavljeno
            models.CheckConstraint(
                check=(
                    (models.Q(blog__isnull=False) & models.Q(comment__isnull=True)) |
                    (models.Q(blog__isnull=True) & models.Q(comment__isnull=False))
                ),
                name='like_exactly_one_object'
            ),
        ]
        verbose_name = "Lajk"
        verbose_name_plural = "Lajkovi"
    
    def __str__(self):
        if self.blog:
            return f"{self.user.username} lajkao blog: {self.blog.title}"
        elif self.comment:
            return f"{self.user.username} lajkao komentar na blogu: {self.comment.blog.title}"
        return f"Lajk od {self.user.username}"
    
