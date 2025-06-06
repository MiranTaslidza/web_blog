# Generated by Django 5.1.6 on 2025-05-10 15:36

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('blog', '0001_initial'),
        ('comment', '0002_alter_comment_options'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Like',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True, help_text='Vrijeme kada je lajk kreiran')),
                ('blog', models.ForeignKey(blank=True, help_text='Blog koji je lajkan', null=True, on_delete=django.db.models.deletion.CASCADE, related_name='likes', to='blog.blog')),
                ('comment', models.ForeignKey(blank=True, help_text='Komentar koji je lajkan', null=True, on_delete=django.db.models.deletion.CASCADE, related_name='likes', to='comment.comment')),
                ('user', models.ForeignKey(help_text='Korisnik koji je lajkao', on_delete=django.db.models.deletion.CASCADE, related_name='likes', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Lajk',
                'verbose_name_plural': 'Lajkovi',
                'constraints': [models.UniqueConstraint(condition=models.Q(('blog__isnull', False)), fields=('user', 'blog'), name='unique_user_blog_like'), models.UniqueConstraint(condition=models.Q(('comment__isnull', False)), fields=('user', 'comment'), name='unique_user_comment_like'), models.CheckConstraint(condition=models.Q(models.Q(('blog__isnull', False), ('comment__isnull', True)), models.Q(('blog__isnull', True), ('comment__isnull', False)), _connector='OR'), name='like_exactly_one_object')],
            },
        ),
    ]
