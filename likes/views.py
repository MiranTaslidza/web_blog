from django.shortcuts import render
from .models import Like
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required

@login_required
def like_blog(request, blog_id):
    if request.method == 'POST':
        user = request.user
        
        try:
            like = Like.objects.get(user=user, blog_id=blog_id)
            like.delete()
            status = 'unliked'
        except Like.DoesNotExist:
            Like.objects.create(user=user, blog_id=blog_id)
            status = 'liked'
        
        # Dohvaćamo ažurirani broj lajkova
        like_count = Like.objects.filter(blog_id=blog_id).count()
        
        return JsonResponse({
            'status': status,
            'like_count': like_count
        })
        
    return JsonResponse({'status': 'invalid_request'}, status=400)


@login_required
def like_comment(request, comment_id):
    if request.method == 'POST':
        user = request.user
        
        try:
            like = Like.objects.get(user=user, comment_id=comment_id)
            like.delete()
            status = 'unliked'
        except Like.DoesNotExist:
            Like.objects.create(user=user, comment_id=comment_id)
            status = 'liked'
        
        # Dohvaćamo ažurirani broj lajkova
        like_count = Like.objects.filter(comment_id=comment_id).count()
        
        return JsonResponse({
            'status': status,
            'like_count': like_count
        })
        
    return JsonResponse({'status': 'invalid_request'}, status=400)