from django.http import JsonResponse
from django.shortcuts import get_object_or_404, redirect, render
from .models import Blog, Image
from django.contrib.auth.decorators import login_required
from .forms import PostForm
from profiles.models import Profile
from django.contrib import messages


# prikaz svih postova
def home(request):
    form = PostForm() # kreiranje forme
    blog = Blog.objects.all()
    context = {
        'blogs': blog,
        'form': form
    }
    return render(request, 'blog/home.html', context)

# prikaz detalja posta
@login_required
def blog_detail(request, pk):
    blog = Blog.objects.get(pk=pk)  
    return render(request, 'blog/blog_detail.html', {'blog': blog})

# krieranje posta
@login_required
def new_post(request):
    form = PostForm(request.POST or None)

    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        if form.is_valid():
            instance = form.save(commit=False)
            instance.author = request.user
            instance.save()  # Sačuvaj post pre dodavanja slika

            if request.FILES.getlist('image'):
                for image in request.FILES.getlist('image'):
                    Image.objects.create(blog=instance, image=image)
                    print(request.FILES)  # Dodaj ovo u views.py

    context = {'form': form}
    return render(request, 'blog/home.html', context)


# brisanje posta
@login_required
def delete_post(request, pk):
    blog = get_object_or_404(Blog, pk=pk)
    blog.delete()
    messages.success(request, 'Post deleted successfully.')  # Poruka pre preusmeravanja
    return redirect('home')

