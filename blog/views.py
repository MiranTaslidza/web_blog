from django.shortcuts import render
from .models import Blog
from django.contrib.auth.decorators import login_required


# prikaz svih postova
def home(request):
    blog = Blog.objects.all()
    return render(request, 'blog/home.html', {'blogs': blog})

# prikaz detalja posta
@login_required
def blog_detail(request, pk):
    blog = Blog.objects.get(pk=pk)  
    return render(request, 'blog/blog_detail.html', {'blog': blog})
