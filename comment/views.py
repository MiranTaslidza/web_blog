
from django.shortcuts import get_object_or_404
from blog.models import Blog
from .models import Comment
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required

def all_comments(request):
    blog_slug = request.GET.get('slug')
    if not blog_slug:
        return JsonResponse({'data': []})
        
    comments = Comment.objects.filter(
        parent__isnull=True, 
        blog__slug=blog_slug
    ).select_related('user', 'user__profile')
    
    data = []
    for comment in comments:
        try:
            profile_image_url = comment.user.profile.profile_image.url
        except Exception:
            profile_image_url = ''
            
        replies_data = []
        for reply in comment.replies.all().select_related('user', 'user__profile'):
            try:
                reply_profile_image = reply.user.profile.profile_image.url
            except Exception:
                reply_profile_image = ''
                
            replies_data.append({
                'id': reply.id,
                'user': reply.user.username,
                'profile_image': reply_profile_image,
                'content': reply.content,
                'created_at': reply.created_at.strftime("%Y-%m-%d %H:%M:%S"),
                'can_edit': request.user.is_authenticated and request.user == reply.user,
                'can_delete': request.user.is_authenticated and request.user == reply.user,
            })
            
        data.append({
            'id': comment.id,
            'user': comment.user.username,
            'profile_image': profile_image_url,
            'content': comment.content,
            'created_at': comment.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            'can_edit': request.user.is_authenticated and request.user == comment.user,
            'can_delete': request.user.is_authenticated and request.user == comment.user,
            'replies': replies_data,
        })
    return JsonResponse({'data': data})

@login_required
def add_comment(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
        
    try:
        blog_slug = request.POST.get('blog_slug')
        content = request.POST.get('content')
        
        if not content:
            return JsonResponse({'error': 'Content is required'}, status=400)
            
        blog = get_object_or_404(Blog, slug=blog_slug)
        parent_id = request.POST.get('parent_id')
        parent = get_object_or_404(Comment, id=parent_id) if parent_id else None

        comment = Comment.objects.create(
            blog=blog,
            user=request.user,
            content=content,
            parent=parent
        )
        
        return JsonResponse({
            'message': 'Comment added successfully',
            'comment_id': comment.id
        })
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

@login_required
def edit_comment(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)

    try:
        comment_id = request.POST.get('comment_id')
        content = request.POST.get('content')

        if not content:
            return JsonResponse({'error': 'Content is required'}, status=400)

        comment = get_object_or_404(Comment, id=comment_id)

        if comment.user != request.user:
            return JsonResponse({'error': "You can't edit someone else's comment"}, status=403)

        comment.content = content
        comment.save()
        return JsonResponse({'message': 'Comment updated successfully'})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

@login_required
def delete_comment(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)

    try:
        comment_id = request.POST.get('comment_id')
        comment = get_object_or_404(Comment, id=comment_id)

        if comment.user != request.user:
            return JsonResponse({'error': "You can't delete someone else's comment"}, status=403)

        comment.delete()
        return JsonResponse({'message': 'Comment deleted successfully'})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
