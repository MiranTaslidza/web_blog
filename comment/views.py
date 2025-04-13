from django.shortcuts import render
from .models import Comment

# Create your views here.
def all_comments(request):
    comments = Comment.objects.all()
    return render(request, 'comment/all_comments.html', {'comments': comments})