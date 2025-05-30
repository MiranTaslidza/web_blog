from django.http import JsonResponse
from django.shortcuts import get_object_or_404, redirect, render

from likes.models import Like
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
        'form': form,

    }
    return render(request, 'blog/home.html', context)


# prikaz detalja posta
@login_required
def blog_detail(request, pk):
    blog = Blog.objects.get(pk=pk)

    # Povećaj broj pregleda
    blog.views += 1
    blog.save(update_fields=['views'])
        
    # provjera da li je post lajkovan
    is_liked = False
    if request.user.is_authenticated:
        is_liked = Like.objects.filter(user=request.user, blog=blog).exists()
    
    context = {
        'blog': blog,
        'is_liked': is_liked, # da li je post lajkovan
    }
    return render(request, 'blog/blog_detail.html', context)




@login_required
def new_post(request):
    if request.method == "POST":
        form = PostForm(request.POST)
        
        if form.is_valid():
            # Kreiranje novog posta
            post = form.save(commit=False)
            post.author = request.user

            # Spremanje polja 'is_public' koje je dodano u formu
            post.is_public = form.cleaned_data['is_public']

            # Spremanje posta
            post.save()

            # Dodavanje slika
            if request.FILES.getlist('image'):
                for image in request.FILES.getlist('image'):
                    Image.objects.create(blog=post, image=image)

            # Ako je AJAX zahtjev
            if request.headers.get('x-requested-with') == 'XMLHttpRequest':
                return JsonResponse({'message': 'Post created successfully'}, status=200)

            # Ako nije AJAX, klasični redirect
            return redirect('home')

    else:
        form = PostForm()

    return render(request, 'blog/new_post.html', {'form': form})

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

# upload image za tinymce
from django.core.files.base import ContentFile
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import default_storage
@csrf_exempt
def upload_image(request):
    if request.method == 'POST':
        file = request.FILES['file']
        file_path = default_storage.save('uploads/' + file.name, ContentFile(file.read()))
        file_url = default_storage.url(file_path)
        return JsonResponse({'location': file_url})
    return JsonResponse({'error': 'Invalid request'}, status=400)

