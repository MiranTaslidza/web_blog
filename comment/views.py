from .models import Comment # uvoz modela coment
from django.http import JsonResponse# uvoz json response


def all_comments(request):
    comments = Comment.objects.filter(parent__isnull=True)  # samo glavni komentari
    data = []

    for comment in comments:
        try:
            profile_image_url = comment.user.profile.profile_image.url
        except Exception:
            profile_image_url = ''

        # odgovori na ovaj komentar
        replies_data = []
        for reply in comment.replies.all():  # koristi related_name='replies'
            try:
                reply_profile_image = reply.user.profile.profile_image.url
            except Exception:
                reply_profile_image = ''
            replies_data.append({
                'id': reply.id,
                'user': reply.user.username,
                'profile_image': reply_profile_image,
                'content': reply.content,
                'created_at': reply.created_at.strftime("%Y-%m-%d %H:%M:%S")
            })

        data.append({
            'id': comment.id,
            'user': comment.user.username,
            'profile_image': profile_image_url,
            'content': comment.content,
            'blog_slug': comment.blog.slug,
            'created_at': comment.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            'replies': replies_data,  # dodaj odgovore u glavni komentar
        })

    return JsonResponse({'data': data})


    