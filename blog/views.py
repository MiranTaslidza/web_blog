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

# edit post
@login_required
def edit_post(request, pk):
    # Uzimamo post koji se edituje, a samo autor posta ima pravo da ga edituje.
    blog = get_object_or_404(Blog, pk=pk, author=request.user)
    
    if request.method == "POST":
        form = PostForm(request.POST, instance=blog)
        if form.is_valid():
            blog = form.save(commit=False)
            blog.save()  # Čuvamo izmenjene naslov i sadržaj

            # Brisanje slika – očekujemo da HTML šalje listu ID-jeva slika za brisanje
            delete_image_ids = request.POST.getlist('delete_images')
            if delete_image_ids:
                Image.objects.filter(id__in=delete_image_ids, blog=blog).delete()

            # Dodavanje novih slika – očekujemo input tipa "file" sa atributom "multiple" i nazivom 'new_images'
            new_images = request.FILES.getlist('new_images')
            if new_images:
                for image in new_images:
                    Image.objects.create(blog=blog, image=image)
            
            messages.success(request, "Post updated successfully!")
            return redirect('blog_detail', pk=blog.pk)
        else:
            messages.error(request, "Please correct the errors below.")
    else:
        form = PostForm(instance=blog)
    
    context = {
        'form': form,
        'blog': blog,  # Prosljeđujemo post i slike da možemo prikazati postojeće slike u šablonu
    }
    return render(request, 'blog/edit_post.html', context)
