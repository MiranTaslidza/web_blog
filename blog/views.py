from django.http import JsonResponse
from django.shortcuts import render
from .models import Blog
from django.contrib.auth.decorators import login_required
from .forms import PostForm
from profiles.models import Profile


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
    # kreira formu ako nema podataka učitava stranicu ako ima podatak aunosi ih
    form = PostForm(request.POST or None) 

    if request.headers.get('x-requested-with') == 'XMLHttpRequest': #provjera ajax zahtjeva
        if form.is_valid(): # ako je form validna
            author = Profile.objects.get(user=request.user) # dohvata prijavljenog korisnika iz baze
            # Pravi instancu posta, ali još je ne čuva u bazi 
            instance = form.save(commit=False) # Ovo omogućava da dodamo dodatne podatke pre nego što sačuvamo post.
            instance.author = request.user # dodajem autora unutar instance
            instance.save() # smještanje u bazu



	# odgovor ajax zahtjeva da se može prikazati unutar html prije osvježavanja
            return JsonResponse({
                'id': instance.id,
                'title': instance.title, 
                'content': instance.content, 
                'author': instance.author.username
             }) #vraca podatke u json formatu

    context = {
        'form': form,
    }

    #proslijeđuje podatke u html
    return render(request, 'blog/home.html', context )
