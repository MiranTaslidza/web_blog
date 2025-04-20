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
        blog = Blog.objects.get(slug=blog_slug) # uzimamo blog
        comment = Comment(blog=blog, user=request.user, content=content) # kreiramo komentar
        comment.save() # snimamo
        return JsonResponse({'message': 'Comment added successfully'})

