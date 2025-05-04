from blog.models import Blog
from .models import Comment # uvoz modela coment
from django.http import JsonResponse# uvoz json response
from django.contrib.auth.decorators import login_required


def all_comments(request):
    blog_slug = request.GET.get('slug')
    # ako nema slug, vratimo praznu listu
    if not blog_slug:
        return JsonResponse({'data': []})
    # filtriramo samo glavne komentare za taj blog
    comments = Comment.objects.filter(parent__isnull=True, blog__slug=blog_slug)
    data = []
    for comment in comments:
        try:
            profile_image_url = comment.user.profile.profile_image.url
        except Exception:
            profile_image_url = ''
        replies_data = []
        for reply in comment.replies.all():
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
            })
        data.append({
            'id': comment.id,
            'user': comment.user.username,
            'profile_image': profile_image_url,
            'content': comment.content,
            'created_at': comment.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            'replies': replies_data,
        })
    return JsonResponse({'data': data})

@login_required
# dodavanje komentara bez form polja
def add_comment(request):
    if request.method == 'POST': 
        blog_slug = request.POST.get('blog_slug') # uzimamo slug bloga
        content = request.POST.get('content') # uzimamo sadrzaj
        parent_id = request.POST.get('parent_id') # uzimamo parent id za odgovor na komentar ++++
        blog = Blog.objects.get(slug=blog_slug) # uzimamo blog

        # Ako postoji parent_id, znači da je odgovor
        parent = Comment.objects.get(id=parent_id) if parent_id else None

        comment = Comment(blog=blog, user=request.user, content=content, parent=parent) # kreiramo komentar
        
        comment.save() # snimamo
        return JsonResponse({'message': 'Comment added successfully'})


# edit komentara i odgorva na komentar
def edit_comment(request):
    if request.method == 'POST':
        comment_id = request.POST.get('comment_id')
        content = request.POST.get('content')
        comment = Comment.objects.get(id=comment_id)
        comment.content = content
        comment.save()
        return JsonResponse({'message': 'Comment updated successfully'})


#  brisanje komentara
@login_required
def delete_comment(request):
    if request.method == 'POST':
        comment_id = request.POST.get('comment_id')
        print(f'Comment ID: {comment_id}')  # Ovo će se pojaviti u terminalu
        try:
            comment = Comment.objects.get(id=comment_id)
            comment.delete()
            return JsonResponse({'message': 'Comment deleted successfully'})
        except Comment.DoesNotExist:
            return JsonResponse({'error': 'Comment not found'}, status=404)
