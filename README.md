Da bi koristio slike koje šaljem na mail kao poruku moraju biti onlajn moram da korisntim njihovu stvarnu putanju.
Kreiranje projekta
Prvo ču da kreiram venv 
python -m venv venv
sada ču da aktiviram venv to jeste virtualno okruženje 
.\venv\Scripts\activate
Sada ču da instaliram django
python -m pip install Django
sada ču da kreiram projekat direktno unutar foldera nazivam ga a_core  tako da ga izvojim od svog sadržaja i nakraju stavljam razmak i tačku da se projekat kreira unutar ovog foldera
django-admin startproject a_core .
nakon toga ulazim u projekat i radim migraciju
py manage.py migrate
sada ču da kreiram super korisnika
py manage.py createsuperuser
Instalirati ču pip pakete pillov 
pip install pillow
sada ču da izađem iz foldera projekta cd.. i kreirati ču  requirements.txt fajl unutar kojeg če biti  zapisani instalirani pip paketi.
pip freeze > requirements.txt
da bi instalirao te pip pakete
pip install -r requirements.txt
py -m pip install --upgrade pip (ukoliko je starija verzija pip paketa u terminalu win napravit update)

kreiranje nove aplikacije
novu aplikaciju kreiram tako što koristim komandu 
py manage.py startapp naziv_aplikacije

podešavanje aplikacije
unutar a_core to jeste unutar glavnog projkta u INSTALED_APPS da dodam instaliranu aplikaciju i koliko god da bude aplikacije dodajem ih ovdje.
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'naziv_aplikacije',
]


unutar aplikacije kreiram i urls.py fajl
from django.urls import path
from . import views

urlpatterns = [

]

Unutar a_core projekta u urls.py fajla daodati url koji  sam kreirao u aplikaciji ukoliko ostavim prazne navodnike to znači da je url početni 
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('naziv_aplikacije.urls')),
]



Kreiranje templates unutar kojehg smještam html fajlove
Unutar glavnog projekta kreirati ču templates folder unutar kojrg smještam base.html fajl, header.html i slične falove koji su vezani ta templejte koji se povezuju sa stranicama
Da bi koristio tempaltes unutar glavnog projekta u settings.py fajlu a_core lu da dodam
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

A templates unutar aplikacija se prikazuju samo što pored templates/naziv_aplikacije koristim i folder sa nazivom aplikacije.

Krieranje static foldera unutar kojeg se smješta css, js
Unutar statički fajlova sve slike js i css se dodaju ručno 
kada kreiram static folder unutar njega kreiram css, js, img foldere
nakon tofa unutar setting.py fajla prikažem statičke foldere
BASE_DIR = Path(__file__).resolve().parent.parent
STATIC_URL = 'static/'
STATICFILES_DIRS = [
    BASE_DIR /'static', # STATIC FOLDER UNUTAR GLAVNOG PROJEKTA 
    BASE_DIR /'naziv_aplikacije' /'static', # STATIC FOLDER UNUTAR APLIKAVIJE BLOG
]  


Konfiguracija medijski fajlova
unutar media foldera korisnik uploaduje 
✅ Slike profila
✅ Dokumenti (PDF, Word fajlovi)
✅ Video zapisi
✅ Audio fajlovi

Podešavanje medijski fajlova unutar settinfs.py  a_core  foldera  ču da dodam odma ispod static konfiguracije i media konfiguraciju
# media fajlovi
MEDIA_URL = '/media/'  # URL putanja za pristup medijskim fajlovima
MEDIA_ROOT = BASE_DIR / 'media'  # Folder gde će se čuvati otpremljeni fajlovi


A unutar urls.py a_core foldera podesit i url za medijske fajlove.
from django.contrib import admin
from django.urls import path, include

from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('blog.urls')),
    path('profiles/', include('profiles.urls')),
]
if settings.DEBUG: # Django će servirati medijske fajlove SAMO u developmentu
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

ukoliko stavim stranicu na server django više neče servirati fajlove to če  tu se koristi Nginx/Apache ili cloud storage (AWS S3).


postavke base fajla
unutar base fajla ču da postavim neke postavke prvo ču da loadujem static fajl da bi mogao prikazati favicon unutar head tagova ču da pozovem bootstrap css i css koji sam ja kreirao unutar static foldera a unutar tagova title ču da postavim block title kod jer če svaka  stranica da ima svoj naziv.

{% load static %}   
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- favicon -->
    <link rel="icon" type="image/png" href="{% static 'img/favicon.ico' %}"/>
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
    <!-- glavni css -->
    <link rel="stylesheet" href="{% static 'css/main.css' %}">
    <!-- blok za css fajlove -->
    {% block styles %}{% endblock styles %}
    <title>{% block title %}{% endblock %}</title>
</head>

Unutar body tagova ču da ostavim prostor za navbar koji ču da postavim kasnije ispod navbara ču da kreiram content unutar diva unutar content blokova postavljam sadržaj ostalih stranica. Ispod diva ču da uvezem bootstrap,  jquery, moj glavni js, i napraviti ču blok kod za  JS kod jkoji ču da postavljam  na drugim stranicama.
<body>
    <!-- navbar -->

    <!-- content -->
     <div class="container mt-3">
        {% block content %}{% endblock %}
     </div>

    <!-- Bootstrap Bundle with Popper -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
    <!-- Jquery -->
    <script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>
      
    <!-- Custom js  static fajla-->
    <script src="{% static 'js/main.js' %}" defer></script>
    {% block scripts %}{% endblock scripts %}
      
</body>
</html>

Unutar static fajla u glavnom projektu kreirati ču main.css u css folderu, main.js u jd folderu unutar img ču da postavim favicon.
Krieranje navbara
Kreirati fajl navbar.html unutar glavnog templčates fajlai dodati vabar

<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
        <!-- button navbar -->
        <a class="navbar-brand" href="#">Navbar</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <!-- linkovi -->
                <li class="nav-item">
                    <a class="nav-link active" aria-current="page" href="#">Home</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Link</a>
                </li>

                <!-- dropdown lista -->
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                        data-bs-toggle="dropdown" aria-expanded="false">
                        Dropdown
                    </a>
                    <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                        <li><a class="dropdown-item" href="#">Action</a></li>
                        <li><a class="dropdown-item" href="#">Another action</a></li>
                        <li>
                            <hr class="dropdown-divider">
                        </li>
                        <li><a class="dropdown-item" href="#">Something else here</a></li>
                    </ul>
                </li>

        </div>
    </div>
</nav>

Unutar baste fajla uvaesti navbar fajl
    <!-- navbar -->
    {% include 'navbar.html' %}

Kreiranje prve stranice
Untuar aplikacije u views.py napraviti ču osnovni kontroler za prikaz home stranice
from django.shortcuts import render

def home(request):
    return render(request, 'naziv_aplikacije/home.html')

a unutar templates/naziv_aplikacije ču da kreiram  home.html uvezem base fajl dodam title uvezem blok za JS, i uvezem blok za sadržaj
{% extends 'base.html' %} <!-- uvoizim sadržaj base.html -->

{% block title %}Home{% endblock title %}   <!-- ovdje se menja title -->

{% load static %} <!-- uvoizim static fajle -->

<!-- blok za JS static fajlova -->
{% block scripts %}
    <script src="{% static 'js/home.js' %}"></script>
{% endblock scripts %}

<!-- blok za sadržaj -->
{% block content %}

    <h1>Home</h1>

{% endblock content %}

Unutar static fajla u js folder kreiram js fajl radi provjere
console.log("hello home js");

 to isto uradim i unutar main.js fajla sadržaj treba da se prikaže unutar konzole.

Kreiranje modela
Model je jedini, konačni izvor informacija o vašim podacima. Sadrži bitna polja i ponašanja podataka koje pohranjujete. Općenito, svaki se model preslikava u jednu tablicu baze podataka.
Osnove:
•	Svaki model je Python klasa koja podklase django.db.models.Model.
•	Svaki atribut modela predstavlja polje baze podataka.
•	Uz sve to, Django vam daje automatski generirani API za pristup bazi podataka; pogledajt









Kreiranje korisničkog profila
Kreiranje korisničkog modela
from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Profile (models.Model):
    # ovo je da svaki korisnik može de ima samo jedan profil i uvozim SUewr iz django.contrib.auth.models
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    # polje za biografiju
    bio = models.TextField(blank=True)
    # polje avatar downloadovati ču sliku https://pixabay.com/ koja če da predstavi avatar profila 
    # dowloadovati avatar sliku i smjestiti je unutr media foldera u projektu
    profile_image = models.ImageField(default="avatar.png", upload_to="avatars/")   
    # polje za datum kada je profil izmenjen 
    updated = models.DateTimeField(auto_now=True)
    # polje za datum kada je profil kreiran
    created = models.DateTimeField(auto_now_add=True)

    def  __str__(self):
        return f"profile of the user {self.user.username}"

keriranje signala
# Ova dekoracija povezuje signal post_save sa modelom User. To znači:
# • Signal se aktivira svaki put kada se sačuva instanca modela User (novi korisnik ili postojeći korisnik).
@receiver(post_save, sender=User)

# • Parametri funkcije:
# o sender: Model koji je poslao signal (u ovom slučaju, User).
# o instance: Konkretna instanca modela User koja je sačuvana.
# o created: True ako je instanca tek napravljena, False ako je samo ažurirana.
# o kwargs: Dodatni parametri (rijetko se koriste).
def create_user_profile(sender, instance, created, **kwargs):

# Provjerava da li je korisnik nov (tj. created == True).
# Ako jeste, kreira novu instancu Profile i automatski povezuje je sa novim korisnikom.
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save() # instance.profile pristupa povezanoj instanci Profile. save() osigurava da se izmjene u Profile sačuvaju u bazi
# Ako izmijeniš korisnika (User) i ako profil (Profile) zavisi od toga, ova funkcija osigurava da se te promjene odraze i na profil.

Dodavanje signala unutar apps.py
from django.apps import AppConfig

class ProfilesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'profiles'

# registracija signala koji sam kreirao
    def ready(self):
        import profiles.signals

prikaz profila unutar adminpanela
from django.contrib import admin
from .models import Profile

admin.site.register(Profile)

profil korisnika
priakz profila korisnika
unutar views.py ču da kreiram kontroler za prikaz jednog korisnika
from django.shortcuts import render
from .models import Profile

# prikaz profila korisnika
def wiew_profile(request, pk):
    profile = Profile.objects.get(pk=pk)
    return render(request, 'profiles/profile.html', {'profile': profile})

nakon toga ču da kreiram url za prikaz korisnika
path('<int:pk>/', views.wiew_profile, name='profile'),

nakon toga ču da kreiram profile.html fajl
{% extends 'base.html' %} <!-- uvoizim sadržaj base.html -->

{% load static %} <!-- uvoizim static fajle -->

<!-- blok za css fajlove -->
{% block styles %}
<link rel="stylesheet" href="{% static 'profiles/css/profile.css' %}">
{% endblock styles %}

{% block title %}{{ profile.user.username }} profile{% endblock title %} <!-- ovdje se menja title -->

<!-- blok za JS static fajlova -->
{% block scripts %}

{% endblock scripts %}

<!-- blok za sadržaj -->
{% block content %}

<div class="container d-flex justify-content-center align-items-center">

    <div class="card">

        <div class="upper">

            <img src="https://i.imgur.com/Qtrsrk5.jpg" class="img-fluid">

        </div>

        <div class="user text-center">
                <img src="{{ profile.profile_image.url }}" class="img_profile" >
        </div>

        <div class="text-center data">

            <h1 class="mb-0 fw-bpld">{{ profile.user.first_name }} {{ profile.user.last_name }}</h1>
            <span class="text-muted d-block mb-2 fw-bold">({{ profile.user.username }})</span>
        </div>

        <hr>

        <div class="text-center bio">
            <p>{{ profile.bio }}</p>
        </div>

        <div class="d-flex justify-content-between align-items-center mt-4 px-4">

            <div class="stats">
                <h6 class="mb-0">Created</h6>
                <span>{{ profile.created }}</span>

            </div>

            <div class="stats">
                <h6 class="mb-0">Posts</h6>
                <span>142</span>

            </div>

            <div class="stats">
                <h6 class="mb-0">Birth</h6>
                <span>{{ profile.date_of_birth }}</span>

            </div>
        </div>
    </div>
</div>

{% endblock content %}

Nakon toga ču da napravim profile.css fajl unutar startc foldera aplikacije 
@import url("https://fonts.googleapis.com/css2?family=Poppins:weight@100;200;300;400;500;600;700;800&display=swap");

       body{
        background-color:#545454;
        font-family: "Poppins", sans-serif;
        font-weight: 300;
       }

       .container{
        height: 80vh;
       }

       .card{

        width: 780px;
        border: none;
        border-radius: 15px;
        padding: 8px;
        background-color: #fff;
        position: relative;
        height: 570px;
       }

       .upper{

        height: 100px;

       }

       .upper img{
        
        width: 100%;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;

       }

       .user{
        position: relative;
       }

       .img_profile{
        border-radius: 20px;
        height: 250px;
        width: auto;
        margin-top:-200px;
        box-shadow: 2px 3px 17px   rgba(243, 255, 189, 0.938);
        
       }

       .data{
        margin-top: 40px;
        padding: 0;
       }

       .bio{
        margin-top: 20px;
        height: 200px;
       }

       .follow{

        border-radius: 15px;
        padding-left: 20px;
        padding-right: 20px;
        height: 35px;
       }

       .stats span{

        font-size: 17px;
       }

Kreiranje login
Kreirati ču viws.py fajla aplikacije profiles da uvezem redirect  messages,  authentificate i login
from django.shortcuts import render, redirect
from .models import Profile
from django.contrib import messages
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User












a onda ču untar views.py fajla unutar login  funkciji  da kreiram login 
#login
def login_user(request):
    if request.method == 'POST':
        # Dohvati username i password iz POST podataka
        username = request.POST.get('username')
        password = request.POST.get('password')

        # Provjeri jesu li oba polja popunjena
        if not username or not password:
            messages.error(request, 'Both username and password are required')
            return redirect('login')

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            # Preusmjeravanje nakon logina
            next_url = request.GET.get('next', 'home')
            messages.success(request, 'Login Successful')
            return redirect(next_url)
        else:
            messages.error(request, 'Invalid login credentials')
            return redirect('login')
            
    return render(request, 'profiles/login.html')


kreirati ču url
path('login/', views.login_user, name='login'),









a onda ču unutar base.html fajla ispod prikaza navbara da prikažem poruku
    <!-- navbar -->
    {% include 'navbar.html' %}

    <!-- prikazivanje poruke -->
    {% if messages %}
    {% for message in messages %}
    <div class="alert alert-warning alert-dismissible fade show" role="alert">
        {{ message }}
        <button type="button" class="btn-close" data-bs-dismiss="alert" arialabel="Close"></button>
    </div>
    {% endfor %}
    {% endif %}
    <!-- Kraj prikazivanja poruka -->

Anakon toga ču  da keriram login.html fajl
{% extends 'base.html' %} <!-- uvoizim sadržaj base.html -->

{% load static %} <!-- uvoizim static fajle -->

<!-- blok za css fajlove -->
{% block styles %}
<link rel="stylesheet" href="{% static 'profiles/css/login.css' %}">
{% endblock styles %}

{% block title %}Login{% endblock title %} <!-- ovdje se menja title -->

<!-- blok za JS static fajlova -->
{% block scripts %}

{% endblock scripts %}

<!-- blok za sadržaj -->
{% block content %}
<section class="vh-98 log_sec mt-5" >
    <div class="container py-5 h-100">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col col-xl-10">
          <div class="card">
            <div class="row g-0">
              <div class="col-md-6 col-lg-5 d-none d-md-block">
                <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp"
                  alt="login form" class="img-fluid" />
              </div>
              <div class="col-md-6 col-lg-7 d-flex align-items-center">
                <div class="card-body p-4 p-lg-5 text-black">
  
                  <form method="post">
                    {% csrf_token %}
  
                    <div class="d-flex align-items-center ms-3 mb-3 pb-1">
                      <span class="h1 fw-bold mb-0">Logo</span>
                    </div>
  
                    <h5 class="fw-normal mb-3 pb-3">Sign into your account</h5>
  
                    <div data-mdb-input-init class="form-outline mb-4">
                        <label for="username">Username or email</label>
                        <input type="text" id="username" name="username" class="form-control form-control-lg" required>
                    </div>
  
                    <div data-mdb-input-init class="form-outline mb-4">
                        <label for="password">Password</label>
                        <input type="password" id="password" name="password" class="form-control form-control-lg" required>
                    </div>
  
                    <div class="pt-1 mb-4">
                      <button data-mdb-button-init data-mdb-ripple-init class="btn btn-dark btn-lg btn-block" type="submit">Login</button>
                    </div>
  

                  </form>
                  <a class="small text-muted" href="#!">Forgot password?</a>
                  <p class="mb-5 pb-lg-2" >Don't have an account? <a href="#!"
                      >Register here</a></p>
                  <a href="#!" class="small text-muted">Terms of use.</a>
                  <a href="#!" class="small text-muted">Privacy policy</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

{% endblock content %}

Kreiram login.css
.log_sec{
    background-color: #11050b;
}
.card{
    border-radius: 1rem;
}
.img-fluid{
    border-radius: 1rem 0 0 1rem;
}

Nakon toga ču da izmjenim navbar do izgleda ovako
<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
        <!-- Navbar Brand -->
        <a class="navbar-brand" href="#">Navbar</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <!-- Glavni meni -->
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item">
                    <a class="nav-link active" aria-current="page" href="{% url 'home' %}">Home</a>
                </li>
            </ul>

            {% if user.is_authenticated %}
                <!-- Padajući meni za korisnika sa slikom -->
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle d-flex align-items-center" href="#" id="navbarDropdownMenuLink" role="button"
                            data-bs-toggle="dropdown" aria-expanded="false">
                            <!-- Profilna slika -->
                            <img src="{{ user.profile.profile_image.url }}" class="rounded-circle me-2" width="40" height="40" alt="Profile">
                            {{ user.username }}
                        </a>
                        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdownMenuLink">
                            <li><a class="dropdown-item" href="#">My profile</a></li>
                            <li><a class="dropdown-item" href="#">Edit profile</a></li>
                            <li><a class="dropdown-item" href="#">Logout</a></li>
                        </ul>
                    </li>
                </ul>
            {% else %}
                <!-- Login i Register na desnu stranu -->
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="{% url 'login' %}">Login</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Register</a>
                    </li>
                </ul>
            {% endif %}
        </div>
    </div>
</nav>


Sad kada se pokušam prijaviti korisničkim imenom ili mailom  mogu da se prijavim.
Logout

Prvo ču unutar views.py fajla da uvezem logout
from django.contrib.auth import authenticate, login, logout



a nakon toga ču da kreiram kontroler logout
#logtout 
def logout_user(request):
    if request.user.is_authenticated:
        logout(request)
        messages.success(request, 'You are now logged out')
    else:
        messages.error(request, 'You are not logged in')
    return redirect('all_user')

a onda ču da kreiram urls
path('logout/', views.logout_user, name='logout'),

a unutar urls.py fajla ču da dodam url za logout
   {% if user.is_authenticated %}
                <!-- Padajući meni za korisnika sa slikom -->
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle d-flex align-items-center" href="#" id="navbarDropdownMenuLink" role="button"
                            data-bs-toggle="dropdown" aria-expanded="false">
                            <!-- Profilna slika -->
                            <img src="{{ user.profile.profile_image.url }}" class="rounded-circle me-2" width="40" height="40" alt="Profile">
                            {{ user.username }}
                        </a>
                        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdownMenuLink">
                            <li><a class="dropdown-item" href="{% url 'profile' user.pk %}">My profile</a></li>
                            <li><a class="dropdown-item" href="">Edit profile</a></li>
                            <li><a class="dropdown-item" href="{% url 'logout' %}">Logout</a></li>
                        </ul>
                    </li>
                </ul>
            {% else %}
                <!-- Login i Register na desnu stranu -->
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="{% url 'login' %}">Login</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Register</a>
                    </li>
                </ul>
            {% endif %}

sada kada se klikne na logout izađem iz accounta.

Registracija korisnika
Kreirati forms.py fajl unutar profile aplikacije
from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

class UserRegisterForm(UserCreationForm):
    email = forms.EmailField(
        required=True, 
        widget=forms.EmailInput(attrs={'class': 'form-control', 'placeholder': 'Enter your email'})
    )

    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Uklanjanje help textova
        for field_name, field in self.fields.items():
            field.help_text = None  # Uklanjanje default help_text-a
            field.widget.attrs['class'] = 'form-control'  # Dodaj klasu za Bootstrap stilove
            field.label_suffix = ''  # Ukloni ":" iz labela

onda unutar views.py  uvestiu ovu formu 
from .forms import UserRegisterForm

a onda ču unutar views.py da kreiram register kontorler
# register
def register_user(request):
    if request.method == 'POST':
        form = UserRegisterForm(request.POST)
        if form.is_valid():
            user = form.save()  # Sačuvaj korisnika
            username = form.cleaned_data.get('username')
            messages.success(request, f"Account created for {username}! You can now log in.")
            return redirect('login')  # Preusmjeri na login stranicu
        else:
            # Ako forma nije validna, prikaži specifične greške
            for field, errors in form.errors.items():
                for error in errors:
                    messages.error(request, f"{field.capitalize()}: {error}")
    else:
        form = UserRegisterForm()

    return render(request, 'profiles/register.html', {'form': form})

kreireti ču url za registraciju korisnika
path('register/', views.register_user, name='register'),

a onda ču da kreiram register.html
{% extends 'base.html' %} <!-- uvoizim sadržaj base.html -->

{% load static %} <!-- uvoizim static fajle -->

<!-- blok za css fajlove -->
{% block styles %}
<link rel="stylesheet" href="{% static 'profiles/css/register.css' %}">
{% endblock styles %}

{% block title %}Register{% endblock title %} <!-- ovdje se menja title -->

<!-- blok za JS static fajlova -->
{% block scripts %}

{% endblock scripts %}

<!-- blok za sadržaj -->
{% block content %}
<section class="reg_sec p-3 p-md-4 p-xl-5">
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-12 col-xxl-11">
                <div class="card border-light-subtle shadow-sm ">
                    <div class="row g-0">
                        <div class="col-12 col-md-6">
                            <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp" alt="login form" class="img-fluid" />
                        </div>
                        <div class="col-12 col-md-6 d-flex align-items-center justify-content-center">
                            <div class="col-12 col-lg-11 col-xl-10">
                                <div class="card-body p-3 p-md-4 p-xl-5">
                                    <div class="row">
                                        <div class="col-12">
                                            <div class="mb-5">
                                                <div class="text-center mb-4">
                                                    <a href="#!">
                                                        <img src="./assets/img/bsb-logo.svg" alt="BootstrapBrain Logo"
                                                            width="175" height="57">
                                                    </a>
                                                </div>
                                                <h2 class="h4 text-center">Registration</h2>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-12">
                                            <div class="d-flex gap-3 flex-column">
                                                <a href="#!" class="btn btn-lg btn-outline-dark">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                        fill="currentColor" class="bi bi-google" viewBox="0 0 16 16">
                                                        <path
                                                            d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z" />
                                                    </svg>
                                                    <span class="ms-2 fs-6">Log in with Google</span>
                                                </a>
                                            </div>
                                            <p class="text-center mt-2 mb-5">Or enter your details to register</p>
                                        </div>
                                    </div>
                                    <form method="post">
                                        {% csrf_token %}
                                        <!-- prolazi kroz petlju koja iterira kroz form -->
                                        {% for field in form %}
                                        <div class="mb-3">
                                            <label for="{{ field.id_for_label }}" class="form-label">{{ field.label}}</label>
                                            <!-- ispis polja -->
                                            {{ field }}
                                            <!-- ukoliko je greška ispisuje je -->
                                            {% if field.errors %}
                                            <div class="text-danger mt-1">
                                                {% for error in field.errors %}
                                                <small>{{ error }}</small>
                                                {% endfor %}
                                            </div>
                                            {% endif %}
                                        </div>
                                        {% endfor %}
                                        <button type="submit" class="btn btn-primary">Register</button>
                                    </form>
                                    <div class="row">
                                        <div class="col-12">
                                            <p class="mb-0 mt-5 text-secondary text-center">Already have an account? <a href="{% url 'login' %}" class="link-primary text-decoration-none">Sign in</a></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

{% endblock content %}

I register.css
.card{
    width: 100%;
}

.reg_sec{
    background-color: #11050b;
}

A onda ču unutar navbara da dodam register url

            {% if user.is_authenticated %}
                <!-- Padajući meni za korisnika sa slikom -->
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle d-flex align-items-center" href="#" id="navbarDropdownMenuLink" role="button"
                            data-bs-toggle="dropdown" aria-expanded="false">
                            <!-- Profilna slika -->
                            <img src="{{ user.profile.profile_image.url }}" class="rounded-circle me-2" width="40" height="40" alt="Profile">
                            {{ user.username }}
                        </a>
                        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdownMenuLink">
                            <li><a class="dropdown-item" href="{% url 'profile' user.pk %}">My profile</a></li>
                            <li><a class="dropdown-item" href="">Edit profile</a></li>
                            <li><a class="dropdown-item" href="{% url 'logout' %}">Logout</a></li>
                        </ul>
                    </li>
                </ul>
            {% else %}
                <!-- Login i Register na desnu stranu -->
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="{% url 'login' %}">Login</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="{% url 'register' %}">Register</a>
                    </li>
                </ul>
            {% endif %}

Sada kad dodam korisnika on se spremi unutar baze podataka.
Dodavanje mail authentifikacije
Na google accoutu odem na tačkastu kocku kliknem na nju u settingsu i verifikujem 2 step verifikaciju nakon toga odem na account u home i kliknem na app password  i verifikujem app passwprd njega kopiram.
Unuatar settings moog projekta odem na dno napravim podešavanja
A onda ču unutar settings fajla da dodam na dno podešavanja
# postavke za slanje maila
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'dr.restful.code@gmail.com'
EMAIL_HOST_PASSWORD = 'suqjkkeuyfplhkgc'
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER

# Postavke za sesije
SESSION_ENGINE = 'django.contrib.sessions.backends.db'
SESSION_COOKIE_AGE = 3600
SESSION_EXPIRE_AT_BROWSER_CLOSE = False
SESSION_COOKIE_SECURE = True  # HTTPS samo
SESSION_COOKIE_HTTPONLY = True  # Sprečava JavaScript pristup
CSRF_COOKIE_SECURE = True  # HTTPS samo za CSRF kolačiće


Unutar forme forms.py  moram postaviti  brisanje korisnika sa itim mailom
class UserRegisterForm(UserCreationForm):
    email = forms.EmailField(
        required=True, 
        widget=forms.EmailInput(attrs={'class': 'form-control', 'placeholder': 'Enter your email'})
    )

    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Uklanjanje help textova
        for field_name, field in self.fields.items():
            field.help_text = None  # Uklanjanje default help_text-a
            field.widget.attrs['class'] = 'form-control'  # Dodaj klasu za Bootstrap stilove
            field.label_suffix = ''  # Ukloni ":" iz labela

    # sriječavanje registracije više korisnika sa istim mailom
    def clean_email(self):
        email = self.cleaned_data.get('email')
        if User.objects.filter(email=email).exists():
            raise forms.ValidationError("This email is already in use.")
        return email

a onda ču unutar views.py da uvezem slijedeče fajlove
from django.contrib.auth.tokens import default_token_generator
from django.contrib.sites.shortcuts import get_current_site
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.contrib.auth import get_user_model
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes, force_str
from django.core.mail import EmailMultiAlternatives
from django.utils.encoding import force_bytes





onda ču da kreiram kontroler koji šalje email korisniku
# funkcija koja šalje mail korisniku
def send_email_notification(subject, message, recipient_list):
    try:
        email = EmailMultiAlternatives(
            subject=subject,
            body="This is a verification email.",
            from_email='dr.restful.code@gmail.com',  # Zameni svojom adresom
            to=recipient_list,
        )
        email.attach_alternative(message, "text/html")  # Dodaje HTML verziju e-maila
        email.send()
    except Exception as e:
        print(f"Failed to send email: {e}")

nakon toga ču da dodam verifity_user funkciju
def verify_user(request, uidb64, token):
    try:
        # Dekodiranje uidb64
        uid = urlsafe_base64_decode(uidb64).decode()
        user = get_user_model().objects.get(pk=uid)
        
        # Provera tokena
        if default_token_generator.check_token(user, token):
            # Ovde se obično aktivira korisnik
            user.is_active = True
            user.save()
            messages.success(request, 'Your account has been verified!')
            return redirect('login')  # Preusmeri korisnika na login
        else:
            messages.error(request, 'The verification link is invalid or has expired.')
            return redirect('home')  # Ili bilo koja druga stranica

    except (TypeError, ValueError, OverflowError, user.DoesNotExist):
        messages.error(request, 'Invalid verification link.')
        return redirect('home')  # Ili bilo koja druga stranica


i onda ču da izmjenim funkciju za registraciju korisnika
# Funkcija za registraciju korisnika
def register_user(request):
    if request.method == 'POST':
        form = UserRegisterForm(request.POST)
        if form.is_valid():
            # Spremamo podatke u sesiju
            request.session['registration_data'] = form.cleaned_data
            email = form.cleaned_data.get('email')

            # Generišemo token i UID za verifikaciju
            user = User(username=form.cleaned_data.get('username'), email=email)
            user.set_password(form.cleaned_data.get('password1'))
            user.is_active = False  # Korisnik je neaktivan dok ne potvrdi e-mail
            user.save()

            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))

            # Kreiraj verifikacioni link
            current_site = get_current_site(request)
            domain = current_site.domain
            link = f"http://{domain}/profiles/verify/{uid}/{token}/"

            # Pošalji e-mail s verifikacionim linkom
            subject = "Verify your email"
            html_message = render_to_string('profiles/activation_email.html', {
                'user': user,
                'link': link,
            })
            send_email_notification(subject, html_message, [email])  # Koristimo funkciju za slanje e-maila

            messages.success(request, "Check your email to verify your account.")
            return redirect('login')
    else:
        form = UserRegisterForm()

    return render(request, 'profiles/register.html', {'form': form})

nakon toga ču da dodam url za verifikaciju korisnika
path('verify/<uidb64>/<token>/', views.verify_user, name='verify'),  # url za verifikaciju

a onda ču unutar template/profiles da kreiram activation_email.html
<!DOCTYPE html>
<html lang="en"> 
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
</head>
<body>
    <h2>Hi {{ user.username }},</h2>
    <p>Thank you for registering on our website. Please click the link below to verify your email address:</p>
    <a href="{{ link }}">Verify your email</a>
    <p>If you did not create an account, please ignore this email.</p>
</body>
</html>

Ukoliko je korisnik logovan zabraniti prikaz lgin i register stranice.
Untuar block contenta napraviti if uslov ukoliko je korisnik authentifikona da se prikaže poruka da je korisnik logovan a unutar else uslova postaviti formu za login
{% block content %}
{% if user.is_authenticated %}
 <h1>You are already logged in</h1> 
{% else %}
<section class="vh-98 log_sec mt-5" >
    <div class="container py-5 h-100">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col col-xl-10">
          <div class="card">
            <div class="row g-0">
              <div class="col-md-6 col-lg-5 d-none d-md-block">
                <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp"
                  alt="login form" class="img-fluid" />
              </div>
              <div class="col-md-6 col-lg-7 d-flex align-items-center">
                <div class="card-body p-4 p-lg-5 text-black">
  
                  <form method="post">
                    {% csrf_token %}
  
                    <div class="d-flex align-items-center ms-3 mb-3 pb-1">
                      <span class="h1 fw-bold mb-0">Logo</span>
                    </div>
  
                    <h5 class="fw-normal mb-3 pb-3">Sign into your account</h5>
  
                    <div data-mdb-input-init class="form-outline mb-4">
                        <label for="username">Username or email</label>
                        <input type="text" id="username" name="username" class="form-control form-control-lg" required>
                    </div>
  
                    <div data-mdb-input-init class="form-outline mb-4">
                        <label for="password">Password</label>
                        <input type="password" id="password" name="password" class="form-control form-control-lg" required>
                    </div>
  
                    <div class="pt-1 mb-4">
                      <button data-mdb-button-init data-mdb-ripple-init class="btn btn-dark btn-lg btn-block" type="submit">Login</button>
                    </div>
  

                  </form>
                  <a class="small text-muted" href="#!">Forgot password?</a>
                  <p class="mb-5 pb-lg-2" >Don't have an account? <a href="{% url 'register' %}">Register here</a></p>
                  <a href="#!" class="small text-muted">Terms of use.</a>
                  <a href="#!" class="small text-muted">Privacy policy</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
{% endif %}
{% endblock content %}

Ovo isto uraditi i sa  refgister  stranicom


Brisanje akaunta koji nije verifikovan
Sada  ču da kreiram fajl delete_inactive_users.bat u  mojoj aplikaciji, 
I spremiti ovaj dio koda
@echo off
@REM ovde se koeisti tačna putanja iza /d ukoliko putanja sadrži razmak koristiti navodne znakove
cd /d "C:\Users\drres\Desktop\web blog"
"C:\Users\drres\Desktop\web blog\venv\Scripts\python.exe" manage.py delete_inactive_users

a unutar profiles aplikacije krierati folder profiles/management/commands/ i tu krierati delete_inactive_users.py
from django.core.management.base import BaseCommand
from django.utils.timezone import now
from datetime import timedelta
from django.contrib.auth.models import User

class Command(BaseCommand):
    help = "Delete users who haven't verified their email within 24 hours."

    def handle(self, *args, **kwargs):
        expiry_time = now() - timedelta(hours=24)  # Menjaj na minute za testiranje
        inactive_users = User.objects.filter(is_active=False, date_joined__lt=expiry_time)
        count = inactive_users.count()
        inactive_users.delete()
        self.stdout.write(f"{count} inactive users deleted.")


i pokrenuti konandu unutar terminala  u VS code.
python manage.py delete_inactive_users
.\delete_inactive_users.bat
Sada ovo treba pokreinuti na server mašini kada za to dođe vrijeme i pravo pitanje je 

Pitanje: "Kako postaviti sistemski cron za automatsko pokretanje Django komande svakih X sati/dana?"
 Zasada kada želim da izvršim provjeru da li radi i izbrišem korisnika kucam ovu komandu u terminalu projekta
.\delete_inactive_users.bat

Update  profil
Da bi unutar forms.py fajla nadogradio profil korisnika koji se sastoji od modela koji je kreirao django prilikom kreiranja super korisnika moram da ga uvezem to je user  model iiz django.contrib.auth.models kao i  model Profile koji se nalazi u ovoj aplikaciji. 
from django.contrib.auth.models import User
from .models import Profile

nakon toga krieram klasu ProfileUpdateForm i dodajem polja koja nisu dio Profile modela a postoje u User modelu
class ProfileUpdateForm(forms.ModelForm):
    #dodajem polja koja nisu dio Profile modela a postoje u User modelu
    first_name = forms.CharField(max_length=150, required=True, label="Ime")
    last_name = forms.CharField(max_length=150, required=True, label="Prezime")

nakon toga doadajem meta klasu unutar koje postavljam polja iz modela
    class Meta:
        model = Profile
        fields = ['bio', 'profile_image', 'date_of_birth']  # Polja iz Profile modela

nakon toga dodajem o def init metodu koja popunjava polja incijalnim vrijednostima 
    def __init__(self, *args, **kwargs):
        user = kwargs.pop('user', None)  # Očekujemo da nam views.py pošalje user objekat.
        super().__init__(*args, **kwargs)  # Pokrećemo osnovnu ModelForm logiku.
        #Ako user postoji, postavljamo first_name i last_name polja da već imaju vrednosti iz baze.
        if user:
            self.fields['first_name'].initial = user.first_name  # Postavljamo početnu vrednost
            self.fields['last_name'].initial = user.last_name


nakon toga spremam User i Profile model
    def save(self, commit=True):
        profile = super().save(commit=False)  # Pravimo Profile objekat, ali ga još ne snimamo u bazu.
        user = profile.user #Dohvatamo povezanog korisnika.
        user.first_name = self.cleaned_data['first_name']  # Uzimamo podatke iz forme i dodeljujemo ih User modelu.
        user.last_name = self.cleaned_data['last_name'] # Uzimamo podatke iz forme i dodeljujemo ih User modelu
        # Ako commit=True, prvo snimamo User, pa Profile.
        if commit:
            user.save()  # Snimamo User model
            profile.save()  # Snimamo Profile model
        return profile

sada kada sam kreirao formu unutar views.py člu da uvezem tu formu
from .forms import UserRegisterForm, ProfileUpdateForm

koristiti ču  login required da samo logovani korisnik može pristupiti ovoj formi pa ču je uvesti
from django.contrib.auth.decorators import login_required

kreirati ču funkciju updateProfile
@login_required
def update_profile(request):

a nakon toga ču da kreiram funkciju za update podataka
if request.method == "POST":
•  Proveravamo da li korisnik šalje podatke putem POST zahteva.
•  Ako je POST – znači da je korisnik poslao formu (kliknuo dugme "Sačuvaj promene").
•  Ako nije POST, to znači da korisnik prvi put otvara stranicu, pa treba da mu prikažemo formu sa postojećim podacima.
form = ProfileUpdateForm(request.POST, request.FILES, instance=request.user.profile, user=request.user)
•  Kreiramo instancu forme (ProfileUpdateForm) i prosleđujemo joj podatke koje je korisnik poslao (request.POST).
•  request.FILES – ako korisnik menja sliku profila, fajl će biti poslat kroz request.FILES.
•  instance=request.user.profile – kačimo formu na postojeći profil korisnika, da bi Django znao koji objekat treba da ažurira.
•  user=request.user – šaljemo user objekt kako bi se njegovi podaci (first_name, last_name) popunili u formi.


if form.is_valid():
•	is_valid() proverava da li su podaci ispravno uneti (npr. da li su sva obavezna polja popunjena, da li je datum validan, itd.).
•	Ako forma nije validna, kod ide dalje i ponovo prikazuje formu sa greškama.

            form.save()
            return redirect("profile_detail")
Pozivamo save() metodu forme, koja:
✅ Prvo snima podatke u User model (ime i prezime).
✅ Zatim snima podatke u Profile model (bio, slika, datum rođenja).
•	Sve se snima u bazu, a korisnički profil je ažuriran!
•	Nakon uspešnog snimanja, korisnik se preusmerava na stranicu sa svojim profilom.
•	"profile_detail" je naziv rute gde korisnik može videti svoj profil.
•	Ako ne postoji ruta "profile_detail", treba da je dodaš u urls.py da bi preusmeravanje radilo.

    else:
        form = ProfileUpdateForm(instance=request.user.profile, user=request.user)
•  Ovo se izvršava ako korisnik samo otvara stranicu, a ne šalje podatke.
•  Kreiramo ProfileUpdateForm, ali ne prosleđujemo request.POST, već samo popunjavamo formu podacima iz baze (instance=request.user.profile).
•  user=request.user se šalje da bi se popunila polja first_name i last_name.



Ovako izgleda kompletna funkcija
# Update podataka
@login_required
def update_profile(request):
    if request.method == "POST": # Proveravamo da li korisnik šalje podatke putem POST zahteva.
        form = ProfileUpdateForm(request.POST, request.FILES, instance=request.user.profile, user=request.user)
        if form.is_valid():
            form.save()
            return redirect("profile_detail")
    else:
        form = ProfileUpdateForm(instance=request.user.profile, user=request.user)

    return render(request, "profiles/update_profile.html", {"form": form})
sada da bi korisnik izbrisao staru sliku kada doda nosu unutar  modela ču da dodam ču da importujem 
from django.core.files.storage import default_storage
a nakon toga ču da dodam save na sami kraj
class Profile (models.Model):
    # ovo je da svaki korisnik može de ima samo jedan profil i uvozim SUewr iz django.contrib.auth.models
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    # polje za biografiju
    bio = models.TextField(blank=True)
    # polje avatar downloadovati ču sliku https://pixabay.com/ koja če da predstavi avatar profila 
    # dowloadovati avatar sliku i smjestiti je unutr media foldera u projektu
    profile_image = models.ImageField(default="avatar.png", upload_to="avatars/")   
    # polje za datum i god rođenja
    date_of_birth = models.DateField(null=True, blank=True)
    # polje za datum kada je profil izmenjen 
    updated = models.DateTimeField(auto_now=True)
    # polje za datum kada je profil kreiran
    created = models.DateTimeField(auto_now_add=True)

    def  __str__(self):
        return f"profile of the user {self.user.username}"

    def save(self, *args, **kwargs):
            """Ako korisnik menja sliku, brišemo staru pre nego šaljemo novu."""
            try:
                # Uzimamo trenutni objekat iz baze (pre nego šaljemo novu)
                old_profile = Profile.objects.get(pk=self.pk)
                if old_profile.profile_image and old_profile.profile_image != self.profile_image:
                    # Proveravamo da li je stara slika različita od nove i da li nije default avatar
                    if old_profile.profile_image.name != "avatar.png":
                        default_storage.delete(old_profile.profile_image.path)
            except Profile.DoesNotExist:
                pass  # Ako korisnik tek kreira profil, nema staru sliku za brisanje

            super().save(*args, **kwargs)  # Pozivamo originalnu save() metodu da sačuva novu sliku

sada kada sam to uradio kreirati ču update_profile.html stranicu i postaviti ču ne stilizovanu formu
{% extends 'base.html' %} <!-- uvoizim sadržaj base.html -->
{% load static %} <!-- uvoizim static fajle -->

<!-- blok za css fajlove -->
{% block styles %}

{% endblock styles %}

{% block title %}Edit{% endblock title %} <!-- ovdje se menja title -->

<!-- blok za JS static fajlova -->
{% block scripts %}

{% endblock scripts %}

<!-- blok za sadržaj -->
{% block content %}

<form method="POST" enctype="multipart/form-data">
    {% csrf_token %}
    {{ form.as_p }}
    <button type="submit">Save</button>
  </form>

{% endblock content %}

Sada ču da krieram url unutar urls.py fajla
path("update/", views.update_profile, name="update_profile"),

ovaj url koristim bez primarnog ključa zato što sam unuta kontrolera koristio      
user = models.OneToOneField(User, on_delete=models.CASCADE)
Django automatski uzima trenutno prijavljenog korisnika (request.user) i dohvaća njegov Profile model, koji je povezan putem OneToOne veze:
Sada ču unutar navbara u padfajuču listu da dodam  link na edit profile
<li><a class="dropdown-item" href="{% url 'update_profile' %}">Edit profile</a></li>

Sa ovim sam dobio grubo prikazanu formu sada je moram  podesiti i stilizovati 
Stilizacija update profila forme
Da bi poredao polja onako kako ja  želim mogu da koristim explicitna polja koa  {{form.bio}} da bi dođao do polja za biografiju i prikazao ga, da bi prikazao label ispis koristim <label for="{{ form.bio.id_for_label }}">Biografija</label> i slično.
    <div class="form-group">
        <label for="{{ form.bio.id_for_label }}">Biografija</label>
        {{ form.bio }}
    </div>

Da bi dodao stilizaciju to jeste klase polja ili id to radim unutar foprms.py dodavanje widgets odma na samom počćetku iznad klase meta naprimjer:
#update profile
class ProfileUpdateForm(forms.ModelForm):
    #dodajem polja koja nisu dio Profile modela a postoje u User modelu
    first_name = forms.CharField(max_length=150, required=True, label="Ime", widget=forms.TextInput(attrs={'class': 'form-control', 'id': 'first-name'}))
    last_name = forms.CharField(max_length=150, required=True, label="Prezime", widget=forms.TextInput(attrs={'class': 'form-control', 'id': 'last-name'}))
    bio = forms.CharField(widget=forms.Textarea(attrs={'class': 'form-control', 'id': 'bio', 'rows': 4}))
    profile_image = forms.ImageField(widget=forms.ClearableFileInput(attrs={'class': 'form-control-file', 'id': 'profile-image'}))
    date_of_birth = forms.DateField(widget=forms.DateInput(attrs={'class': 'form-control', 'id': 'date-of-birth'}))

sada kreičem sa postavkama
unutar views.py fajla u kontroleru za uprate više return fajla ču da dodam prikaz podataka profilada bi mogao učitati sliku
@login_required
def update_profile(request):

    if request.method == "POST":
        form = ProfileUpdateForm(request.POST, request.FILES, instance=request.user.profile, user=request.user)
        if form.is_valid():
            form.save()
            messages.success(request, 'Your profile has been updated!')
    else:
        form = ProfileUpdateForm(instance=request.user.profile, user=request.user)
    
    
    profile = request.user.profile  # Uzimaš profil korisnika
    return render(request, "profiles/update_profile.html", {"form": form, "profile": profile})

unutar formss-.py dodati ču neke klase koje ču da primjenim unutar css
    #dodajem polja koja nisu dio Profile modela a postoje u User modelu
    first_name = forms.CharField(max_length=150, required=True, label="First name", widget=forms.TextInput(attrs={'placeholder': 'First name', 'class': 'inp_style'}))
    last_name = forms.CharField(max_length=150, required=True, label="Last name", widget=forms.TextInput(attrs={'placeholder':'Last name', 'class': 'inp_style'}))
    bio = forms.CharField(widget=forms.Textarea(attrs={'class': 'form-control', 'id': 'bio', 'rows': 4, 'placeholder': 'Enter your bio'}))
    profile_image = forms.ImageField(widget=forms.FileInput(attrs={'class': 'profile_style'}))
    date_of_birth = forms.DateField(widget=forms.DateInput(attrs={'class': 'size', 'type': 'date'}))

unutar update_profile.html  namjestiti ču koda kako trea da mi izgleda
<!-- blok za css fajlove -->
{% block styles %}
<link rel="stylesheet" href="{% static 'profiles/css/profile.css' %}">
<link rel="stylesheet" href="{% static 'profiles/css/update.css' %}">
{% endblock styles %}

{% block title %}Edit{% endblock title %} <!-- ovdje se menja title -->

<!-- blok za JS static fajlova -->
{% block scripts %}

{% endblock scripts %}

<!-- blok za sadržaj -->
{% block content %}


<form method="POST" enctype="multipart/form-data">
    {% csrf_token %}
    <!-- podatci koji če se prikazivati drugim korisnicima  -->
    <div class="container d-flex justify-content-center align-items-center">

        <div class="card">

            <div class="upper">

                <img src="https://i.imgur.com/Qtrsrk5.jpg" class="img-fluid">

            </div>

            <div class=" form-grup user text-center">
                <img src="{{ profile.profile_image.url }}" class="img_profile">
                {{ form.profile_image }}
            </div>
            <div class="form-group text-center data">

                {{ form.first_name }} {{ form.last_name }}

            </div>

            <hr>

            <div class="foem-group mt-3">
                {{ form.bio }}
            </div>

            <div class="foem-group mt-3">
                {{ form.date_of_birth }}
            </div>

            <button type="submit" class="btn btn-primary mt-4">Save</button>
        </div>
    </div>
    </div>
</form>

{% endblock content %}







A onda ču da dodam css unutar update.css fajla
.inp_style{
    border: none; /* Uklanja sve ivice oko input polja */
    border-bottom: 2px solid #282828d5; /* Dodaje samo donju crtu */
    outline: none; /* Uklanja outline prilikom selektovanja */
    background: none; /* Uklanja pozadinsku boju */
    padding: 5px 0; /* Daje padding samo sa strane */
    font-size: 16px; /* Opcionalno, prilagoditi veličinu fonta */
    box-shadow: 0px 3px 0px   rgba(205, 248, 15, 0.893);
    font-size: 150%;
    text-align: center;
}
.size{
    height: 40px;
    width: 190px;
    font-size: 25px;
    color: grey;
}
.profile_style{
    margin: 0;
    padding: 0;
    margin-left: 10%;
    
}   

Brisanje profila

Za brisanje fajla koristit ču ajax pa ču unutar views.py fajal da kreiram delete  kontroler
@login_required
def delete_account(request):
    if request.method == "POST":
        user = request.user
        user.delete()
        return JsonResponse({"message": "Account deleted"}, status=200)
    return JsonResponse({"error": "Invalid request"}, status=400)

a unutar urls.py fajla ču dakreiram url
 path("delete/", views.delete_account, name="delete_account"),


a onda ču unutar html.py fajla da kreiram div koji če da prikazuje button save i button delete jedan pored drugog
            <div class="d-flex pt-1 mt-3">
                <button type="submit"  class="btn btn-outline-primary me-1 flex-grow-1">Save</button>
            
                <!-- brisanje akaunta -->
                <button type="button" class="btn btn-outline-danger flex-grow-1" id="delete-button">Delete</button>
            </div>

A unutar deleteProfile js fajla koji sam uveo unutar block script u html fajliu
{% block scripts %}
<script src="{% static 'profiles/js/deleteProfile.js' %}"></script>
{% endblock scripts %}

Ču da napravim ajax zahtjeev
document.addEventListener("DOMContentLoaded", function () {
    const deleteButton = document.getElementById("delete-button");

    deleteButton.addEventListener("click", function () {
        const confirmation = confirm("Are you sure you want to delete your account? This action cannot be undone.");

        if (confirmation) {
            fetch("/profiles/delete/", {  // Stavi ispravnu rutu
                method: "POST",
                headers: {
                    "X-CSRFToken": getCSRFToken(), // Uzima CSRF token
                    "Content-Type": "application/json"
                }
            })
            .then(response => {
                if (response.ok) {
                    alert("Your account has been deleted.");
                    window.location.href = "/"; // Preusmeri na login stranicu
                } else {
                    alert("An error occurred. Try again.");
                }
            })
            .catch(error => console.error("Error:", error));
        }
    });

    function getCSRFToken() {
        return document.querySelector("[name=csrfmiddlewaretoken]").value;
    }
});


Promjena passworda
Unutar views.py fajla ču da uvezem
from django.contrib.auth.forms import PasswordChangeForm
from django.contrib.auth import update_session_auth_hash
from django.urls import reverse
a nakon toga ču da napravim kontroler za promjenu passworda
# promjena passworda i slanje obavjesti korissniku na mail
@login_required
def change_password(request):
    if request.method == 'POST':
        form = PasswordChangeForm(user=request.user, data=request.POST)
        if form.is_valid():
            user = form.save()  # Promeni lozinku korisnika
            update_session_auth_hash(request, user)  # Održava aktivnu sesiju nakon promene lozinke
            
            # Slanje email obaveštenja
            subject = "Password Changed Successfully"
            message = render_to_string('profiles/password_change_email.html', {
                'user': user,
                'login_url': request.build_absolute_uri(reverse('login')),  # Link za prijavu
            })
            send_email_notification(subject, message, [user.email])
            
            messages.success(request, "Your password has been successfully updated!")
            return redirect('home')
        else:
            messages.error(request, "There was an error changing your password. Please try again.")
    else:
        form = PasswordChangeForm(user=request.user)
    
    return render(request, 'profiles/change_password.html', {'form': form})
a onda ču da napravim password_change_email.html za slanje poruke na mail.
<!DOCTYPE html>
<html>
<head>
    <title>Password Changed</title>
</head>
<body>
    <p>Dear {{ user.first_name }},</p>
    <p>Your password has been successfully changed. If you did not initiate this change, please contact our support team immediately.</p>
    <p>You can log in to your account here: <a href="{{ login_url }}">{{ login_url }}</a></p>
    <p>Thank you,</p>
    <p>The Team</p>
</body>
</html>

Nakon toga ču da kreiram change_password.html unutar kojeg će da se nalazi forma za promjenu passworda
{% extends 'base.html' %} <!-- uvoizim sadržaj base.html -->
{% load static %} <!-- uvoizim static fajle -->

<!-- blok za css fajlove -->
{% block styles %}
    <style src="{% static 'profiles/css/change_passw.css' %}"></style>
{% endblock styles %}

{% block title %}Change Password{% endblock title %} <!-- ovdje se menja title -->

<!-- blok za JS static fajlova -->
{% block scripts %}

{% endblock scripts %}

<!-- blok za sadržaj -->
{% block content %}

<section class="vh-98 log_sec mt-5" >
    <div class="container py-5 h-100">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col col-xl-10">
          <div class="card">
            <div class="row g-0">
              <div class="col-md-6 col-lg-5 d-none d-md-block">
                <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp"
                  alt="login form" class="img-fluid" />
              </div>
              <div class="col-md-6 col-lg-7 d-flex align-items-center">
                <div class="card-body p-4 p-lg-5 text-black">
  
                  <form method="post">
                    {% csrf_token %}
  
                    <div class="d-flex align-items-center ms-3 mb-3 pb-1">
                      <span class="h1 fw-bold mb-0">Logo</span>
                    </div>
  
                    <h5 class="fw-normal mb-3 pb-3">Change Password</h5>
  
 
  
                    <div data-mdb-input-init class="form-outline mb-4">
                        <label for="password">Old Password</label>
                        {{ form.old_password }}
                    </div>
                    <div data-mdb-input-init class="form-outline mb-4">
                        <label for="password">New Password</label>
                        {{ form.new_password1 }}
                    </div>
                    <div data-mdb-input-init class="form-outline mb-4">
                        <label for="password">New Password</label>
                        {{ form.new_password2 }}
                    </div>
  
                    <div class="pt-1 mb-4">
                      <button data-mdb-button-init data-mdb-ripple-init class="btn btn-dark btn-lg btn-block" type="submit">Password update</button>
                    </div>
  

                  </form>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>


{% endblock content %}

Nakon toga ču da kreiam url koji če da me vodi na stranicu za promjenu passworda.
 path('user/change_password/', views.change_password, name='change_password'),

da bi omogučio korisnikov izbor unosa passworda unutar settings.py fajala
ču da dodam

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
        'OPTIONS': {
            'min_length': 8,  # Minimalna dužina lozinke
        }
    },
    # Ovdje ne stavljaj nikakve dodatne restrikcije kao što je 'NameAndNumberPasswordValidator'
]


A unutar navbara u padajuču lčistu postaviti ču link za promjenu passworda
<li><a class="dropdown-item" href="{% url 'change_password' %}">Change password</a></li>

Promjena maila
Da bi izvršio promjenu maila dodati ču unutar modela tri polja polje koje ču va predhodni mail korisnika, polje koje privremeno čuva novi mail dok ga korisnik ne potvrduei i polje koje provjerava da li je novi mail potvrđen.
from django.db import models
from django.contrib.auth.models import User
from django.core.files.storage import default_storage

# Create your models here.
class Profile (models.Model):
    # ovo je da svaki korisnik može de ima samo jedan profil i uvozim SUewr iz django.contrib.auth.models
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    # polje za biografiju
    bio = models.TextField(blank=True)
    # polje avatar downloadovati ču sliku https://pixabay.com/ koja če da predstavi avatar profila 
    # dowloadovati avatar sliku i smjestiti je unutr media foldera u projektu
    profile_image = models.ImageField(default="avatar.png", upload_to="avatars/")   
    # polje za datum i god rođenja
    date_of_birth = models.DateField(null=True, blank=True)

    # Čuva prethodni email korisnika
    old_email = models.EmailField(blank=True, null=True)  
    # Privremeno čuva novi email dok ga korisnik ne potvrdi
    new_email = models.EmailField(blank=True, null=True) 
    # Provera da li je novi email potvrđen 
    email_confirmed = models.BooleanField(default=False)  

    # polje za datum kada je profil izmenjen 
    updated = models.DateTimeField(auto_now=True)
    # polje za datum kada je profil kreiran
    created = models.DateTimeField(auto_now_add=True)

    def  __str__(self):
        return f"profile of the user {self.user.username}"

    def save(self, *args, **kwargs):
            """Ako korisnik menja sliku, brišemo staru pre nego šaljemo novu."""
            try:
                # Uzimamo trenutni objekat iz baze (pre nego šaljemo novu)
                old_profile = Profile.objects.get(pk=self.pk)
                if old_profile.profile_image and old_profile.profile_image != self.profile_image:
                    # Proveravamo da li je stara slika različita od nove i da li nije default avatar
                    if old_profile.profile_image.name != "avatar.png":
                        default_storage.delete(old_profile.profile_image.path)
            except Profile.DoesNotExist:
                pass  # Ako korisnik tek kreira profil, nema staru sliku za brisanje

            super().save(*args, **kwargs)  # Pozivamo originalnu save() metodu da sačuva novu sliku

uraditi migraciju


Forma za unos novog emaila
Prvo ču unutar forms.py fajla da uvezem validtion error Koristi se za proveru podataka u formama ili modelima i za prikazivanje grešaka korisniku kada unos nije validan.
from django.core.exceptions import ValidationError #

naskon toga ču da kreiram klasu za promjenu maila
class ChangeEmailForm(forms.Form):

sada ču unutar klase da kreiram polje za unos emaila u formi.
✔️ forms.EmailField → Koristi se za unos email adrese.
✔️ label="New Email" → Ovo je naziv polja koji će se prikazivati u formi.
✔️ widget=forms.EmailInput(...) → Ovde prilagođavamo izgled input polja:
•	"class": "form-control" → Dodajemo Bootstrap klasu za lepši izgled.
•	"placeholder": "Enter new email" → Postavljamo tekst koji će se pojaviti unutar polja pre nego što korisnik nešto unese.
👉 Rezultat:
Na stranici će se prikazati input polje sa placeholder-om i lepim Bootstrap stilom.

    new_email = forms.EmailField(
        label="New Email",
        widget=forms.EmailInput(attrs={"class": "form-control", "placeholder": "Enter new email"}),
    )
A onda ču ispod da kreiram konstruktor klase (__init__), koji se poziva kad kreiramo formu.
✔️ Zašto prosljeđujemo user?
•	Kada korisnik popuni formu, moramo znati koji korisnik menja email.
•	self.user = user → Čuvamo korisnika kako bismo kasnije mogli proveriti njegov email.
✔️ super().__init__(*args, **kwargs) → Pozivamo konstruktor roditeljske klase (forms.Form), da ne bismo izgubili ugrađene funkcionalnosti Django forme.

    def __init__(self, user, *args, **kwargs):
        """Prosljeđujemo korisnika da bismo mogli provjeriti emailove."""
        self.user = user
        super().__init__(*args, **kwargs)

onda ču da kreiram funkciju clean_new_email 
•	self.cleaned_data["new_email"] → Uzima email koji je korisnik uneo.
•	User.objects.filter(email=new_email).exists() → Proverava da li već postoji korisnik sa istim emailom.
•	Ako email već postoji, podiže se ValidationError, i prikazuje se poruka greške.
•	Ako je email jedinstven, vraća se uneti email i validacija prolazi.
👉 Rezultat:
Ako korisnik unese email koji već postoji, dobiće poruku:
🚫 "This email is already in use. Please choose another."

    def clean_new_email(self):
        """Provjera da li novi email već postoji u sistemu."""
        new_email = self.cleaned_data["new_email"]
        if User.objects.filter(email=new_email).exists():
            raise ValidationError("This email is already in use. Please choose another.")
        return new_email





Ovo jekompletna klasa:
class ChangeEmailForm(forms.Form):
    new_email = forms.EmailField(
        label="New Email",
        widget=forms.EmailInput(attrs={"class": "form-control", "placeholder": "Enter new email"}),
    )

    def __init__(self, user, *args, **kwargs):
        """Prosljeđujemo korisnika da bismo mogli provjeriti emailove."""
        self.user = user
        super().__init__(*args, **kwargs)

    def clean_new_email(self):
        """Provjera da li novi email već postoji u sistemu."""
        new_email = self.cleaned_data["new_email"]
        if User.objects.filter(email=new_email).exists():
            raise ValidationError("This email is already in use. Please choose another.")
        return new_email


potvrdi zahtev na starom emailu
prvo ču u views.py fajlu da uvezem  get object  or 404 ukoliko dođe do greške
from django.shortcuts import render, redirect, get_object_or_404

nakon toga ču da uvezem signer  koristi se za geherisanvoje tokena u email linku
from django.core.signing import Signer, BadSignature, TimestampSigner

uvozim send mail da bi mogao da pošaljem mail korisniku
from django.core.mail import EmailMultiAlternatives, send_mail



uvesti formu koju sam kreirao za promjenu emaila
from .forms import UserRegisterForm, ProfileUpdateForm, ChangeEmailForm

uvesti 
nakon toga ču kreirati kontroler unutar kojeg če da se vrši promjena emaila
@login_required
def change_email(request):
    """View za prikazivanje i obradu promene emaila."""
    if request.method == 'POST':
        form = ChangeEmailForm(user=request.user, data=request.POST)
        if form.is_valid():
            new_email = form.cleaned_data['new_email']
            profile = request.user.profile

            # Sačuvaj novi email privremeno i označi ga kao nepotvrđen
            profile.new_email = new_email
            profile.email_confirmed = False
            profile.save()

            # Generisanje sigurnosnog tokena za potvrdu
            signer = TimestampSigner()
            token = signer.sign(request.user.username)

            # Kreiraj link za potvrdu
            confirm_url = request.build_absolute_uri(
                reverse('confirm_email_change', kwargs={'token': token})
            )

            # Slanje emaila na stari email
            mail_subject = 'Confirm Your Email Change'
            message = render_to_string('profiles/confirm_old_email.html', {
                'user': request.user,
                'confirm_url': confirm_url,
            })
# DA BI SE MAIL POKAZAO U PRAVOM FORMATU
            send_mail(
                mail_subject,
                '',  # Ostavlja se prazno plain text, ili možeš dodati kratku poruku
                'noreply@mywebsite.com',
                [profile.user.email],
                html_message=message
            )

            messages.success(request, "We have sent a verification link to your old email address.")
            return redirect('profile', pk=request.user.pk)  # Možete redirektovati na neki drugi URL po potrebi

        else:
            messages.error(request, "There was an error with the email change. Please try again.")
    else:
        form = ChangeEmailForm(user=request.user)

    return render(request, 'profiles/change_email.html', {'form': form})

nakon toga ču da kreiram url 
path('user/change_email/', views.change_email, name='change_email'),

unutar navbara u padajučoj listi kreirati ču link koji vodi na formu za promjenu maila
<li><a class="dropdown-item" href="{% url 'change_email' %}">Change Email</a></li>

Nakon toga ču da naptavim change_email.html koji če da prikaže tu formu
{% extends 'base.html' %} <!-- uvoizim sadržaj base.html -->

{% load static %} <!-- uvoizim static fajle -->

<!-- blok za css fajlove -->
{% block styles %}

{% endblock styles %}

{% block title %}Change Email{% endblock title %} <!-- ovdje se menja title -->

<!-- blok za JS static fajlova -->
{% block scripts %}

{% endblock scripts %}

<!-- blok za sadržaj -->
{% block content %}
<form method="post">
    {% csrf_token %}
    {{ form.as_p }}  <!-- Prikazuje formu -->
    <button type="submit">Submit</button>
</form>
{% endblock content %}


Potvrda na starom emailu
Nakon toga ču da napravim view za potvrdu na starom mailu 
# Napraviti novi view za potvrdu na starom emailu
@login_required
def confirm_old_email(request, token):
    """View za potvrdu na starom emailu i slanje verifikacije na novi email."""
    signer = TimestampSigner()
    try:
        username = signer.unsign(token, max_age=3600)  # Token važi 1h
        user = get_object_or_404(User, username=username)
        
        if user.profile.email_confirmed:
            messages.info(request, "This email change has already been confirmed.")
            return redirect('profile', pk=request.user.pk)

        # Generišemo novi token za novi email
        new_signer = TimestampSigner()
        new_token = new_signer.sign(user.profile.new_email)

        # Kreiraj link za potvrdu na novom emailu
        new_confirm_url = request.build_absolute_uri(
            reverse('confirm_new_email', kwargs={'token': new_token})
        )

        # Slanje emaila na novi email
        mail_subject = 'Verify Your New Email Address'
        message = render_to_string('profiles/confirm_new_email.html', {
            'user': user,
            'new_confirm_url': new_confirm_url,
        })

       # Pošalji email DA BI SE PRIKAZAO U HTML FORMATU
        mail_subject = 'Potvrdi promjenu e-pošte'
        send_mail(
            mail_subject,
            '',  # Ostavlja se prazno plain text, ili možeš dodati kratku poruku
            'noreply@mywebsite.com',
            [user.profile.new_email],
            html_message=message
        )

        messages.success(request, "A verification link has been sent to your new email address.")
        return redirect('profile', pk=request.user.pk)

    except BadSignature:
        messages.error(request, "Invalid or expired confirmation link.")
        return redirect('profile', pk=request.user.pk)

nakon toga unutar urls.py dodati link
path('confirm_old_email/<str:token>/', views.confirm_old_email, name='confirm_email_change'),

napraviti confirm_old_email.html templates
Hello {{ user.username }},

You requested to change your email. Please confirm this request by clicking the link below:

<a href="{{ confirm_url }}">{{ confirm_url }}</a>


Best regards,  
Your Website Team





Otkazivanje  promjene maila
Nakon toga unutar viewsa napraviti kontroiler cancel_email_change
# kontroler za poništavanje promjene emaila
@login_required
def cancel_email_change(request, token):
    """
    View koja poništava zahtev za promenu emaila. Proverava token (npr. da li pripada
    trenutnom korisniku) i briše vrednost new_email u profilu.
    """
    signer = TimestampSigner()
    try:
        # Pretpostavljamo da je token generisan na način da sadrži username.
        token_username = signer.unsign(token, max_age=3600)  # token važi 1 sat
        if token_username != request.user.username:
            messages.error(request, "Invalid cancellation token.")
            return redirect('profile', pk=request.user.pk)
    except BadSignature:
        messages.error(request, "Invalid or expired cancellation link.")
        return redirect('profile', pk=request.user.pk)
    
    # Ako je token validan, poništavamo zahtev
    profile = request.user.profile
    profile.new_email = None  # Brišemo privremeno čuvani novi email
    profile.email_confirmed = False
    profile.save()
    
    messages.success(request, "Your email change request has been cancelled.")
    return redirect('profile', pk=request.user.pk)

unutar urls.py kreirati url
path('cancel-email/<str:token>/', views.cancel_email_change, name='cancel_email_change'),

i unutar templates confirm_old_email.html dodati link za odustajanje od novog emaila
Hello {{ user.username }},

You requested to change your email. Please confirm this request by clicking the link below:

<a href="{{ confirm_url }}">Confirm</a>

If you did not make this request, you can cancel the email change by clicking the link below:
<a href="{{ cancel_url }}">Cancel</a>

Best regards,  
Your Website Team

Unutar confirm_old_emaila ču da generišem  cencel urls i dictonary  spodatcima context za otkazivanje emaila
def confirm_old_email(request, token):
    signer = TimestampSigner()
    try:
        # Dešifruj token da dobijemo korisničko ime
        username = signer.unsign(token, max_age=3600)
        user = get_object_or_404(User, username=username)
        
        if user.profile.email_confirmed:
            messages.info(request, "Ova promjena e-pošte je već potvrđena.")
            return redirect('profile', pk=request.user.pk)

        # Generiši novi token za potvrdu novog emaila
        new_token = signer.sign(user.profile.new_email)
        new_confirm_url = request.build_absolute_uri(
            reverse('confirm_new_email', kwargs={'token': new_token})
        )

        # Generiši cancel URL koristeći originalni token
        cancel_url = request.build_absolute_uri(
            reverse('cancel_email_change', kwargs={'token': token})
        )

        # Ovdje kreiraš dictionary s podacima – to je tvoj "context" za otkazivanje emaila 
        context = {
            'user': user,
            'new_confirm_url': new_confirm_url,
            'cancel_url': cancel_url,
        }

        # Ovdje se koristi render_to_string s context-om
        message = render_to_string('profiles/confirm_new_email.html', context)

        # Pošalji email
        mail_subject = 'Potvrdi promjenu e-pošte'
        send_mail(
            mail_subject,
            '',  # Ostavlja se prazno plain text, ili možeš dodati kratku poruku
            'noreply@mywebsite.com',
            [user.profile.new_email],
            html_message=message
        )
        
        messages.success(request, "Verifikacijski link je poslan na tvoj novi email.")
        return redirect('profile', pk=request.user.pk)

    except BadSignature:
        messages.error(request, "Nevažeći ili istekli token.")
        return redirect('profile', pk=request.user.pk)

nakon toga ču unutar change_email viewsa da kreiram link za otkazivanje emaila i pozovem fa unutar message
@login_required
def change_email(request):
    """View za prikazivanje i obradu promene emaila."""
    if request.method == 'POST':
        form = ChangeEmailForm(user=request.user, data=request.POST)
        if form.is_valid():
            new_email = form.cleaned_data['new_email']
            profile = request.user.profile

            # Sačuvaj novi email privremeno i označi ga kao nepotvrđen
            profile.new_email = new_email
            profile.email_confirmed = False
            profile.save()

            # Generisanje sigurnosnog tokena za potvrdu
            signer = TimestampSigner()
            token = signer.sign(request.user.username)

            # Kreiraj link za potvrdu
            confirm_url = request.build_absolute_uri(
                reverse('confirm_email_change', kwargs={'token': token})
            )

            # Kreiraj link za otkazivanje promjene emaila
            cancel_url = request.build_absolute_uri(
                reverse('cancel_email_change', kwargs={'token': token})
            )

            # Slanje emaila na stari email
            mail_subject = 'Confirm Your Email Change'

            message = render_to_string('profiles/confirm_old_email.html', {
                'user': request.user,
                'confirm_url': confirm_url,
                'cancel_url': cancel_url,
            })

            send_mail(
                mail_subject,
                '',  # Ostavlja se prazno plain text, ili možeš dodati kratku poruku
                'noreply@mywebsite.com',
                [profile.user.email],
                html_message=message
            )

            messages.success(request, "We have sent a verification link to your old email address.")
            return redirect('profile', pk=request.user.pk)  # Možete redirektovati na neki drugi URL po potrebi

        else:
            messages.error(request, "There was an error with the email change. Please try again.")
    else:
        form = ChangeEmailForm(user=request.user)

    return render(request, 'profiles/change_email.html', {'form': form})


promjena emaila
unutar views.py fajla ču da kreiram funkciju ukoliko korisnik klikne na potvrdu za promjenu emaila 
@login_required
def confirm_new_email(request, token):
    """
    View koji finalizira promjenu emaila. Korisnik klikne na verifikacioni link iz emaila
    poslanog na novu adresu, a ovdje se token provjerava, stari email se sprema, a email se ažurira.
    """
    signer = TimestampSigner()
    try:
        # Dešifruj token da dobijemo novu email adresu
        new_email = signer.unsign(token, max_age=3600)  # Token vrijedi 1 sat
        user = request.user
        profile = user.profile

        # Provjeri da li se tokenirani novi email podudara s onim koji je privremeno spremljen
        if profile.new_email != new_email:
            messages.error(request, "Token se ne podudara s novom email adresom.")
            return redirect('profile', pk=user.pk)

        # Sačuvaj trenutnu email adresu u polje old_email, prije ažuriranja
        profile.old_email = user.email
        profile.save()

        # Ažuriraj email korisnika
        user.email = new_email
        user.save()

        # Označi da je nova email adresa potvrđena i očisti privremeni podatak
        profile.email_confirmed = True
        profile.new_email = None
        profile.save()

        messages.success(request, "Vaša email adresa je uspješno promijenjena!")
        return redirect('profile', pk=user.pk)

    except BadSignature:
        messages.error(request, "Nevažeći ili istekli token.")
        return redirect('profile', pk=request.user.pk)

sada ču da kreiram url za potvrdu 
path('confirm_new_email/<str:token>/', views.confirm_new_email, name='confirm_new_email'),

i napraviim html templates confirm_new_email.html
<!DOCTYPE html>
<html lang="hr">
<head>
    <meta charset="UTF-8">
    <title>Potvrda promjene e-pošte</title>
</head>
<body>
    <p>Pozdrav {{ user.username }},</p>
    <p>Zatražili ste promjenu e-pošte. Molimo kliknite na sljedeći link za potvrdu:</p>
    <p><a href="{{ new_confirm_url }}">Potvrdi</a></p>
    <p>Ako niste podnijeli ovaj zahtjev, možete ga poništiti klikom na sljedeći link:</p>
    <p><a href="{{ cancel_url }}">Poništi</a></p>
    <p>Srdačan pozdrav, <br>Vaš tim</p>
</body>
</html>


Zaboravljen password
Unutar urls.pya dodati ču url za resetiranje lozinke korisstiti ču django ugrađenu fubnkcionalnost za reset lozinke uvestu ču 
from django.contrib.auth import views as auth_views


pa ču unuitar urls.py kreirati url za resetiranje lozinke
 # url resetiranje loozinke
    path('password_reset/',auth_views.PasswordResetView.as_view(template_name='profiles/password_reset_form.html'), name='password_reset'),
    path('password_reset/done/', auth_views.PasswordResetDoneView.as_view(template_name='profiles/password_reset_done.html'),name='password_reset_done'),
    path('reset/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(template_name='profiles/password_reset_confirm.html'),name='password_reset_confirm'),
    path('reset/done/', auth_views.PasswordResetCompleteView.as_view(template_name='profiles/password_reset_complete.html'), name='password_reset_complete'),


a nakon toga ču da kreiram templates
password_reset_form.html
{% extends 'base.html' %} <!-- uvoizim sadržaj base.html -->
{% load static %} <!-- uvoizim static fajle -->

<!-- blok za css fajlove -->
{% block styles %}

{% endblock styles %}

{% block title %}Reset password{% endblock title %}<!-- ovdje se menja title -->

<!-- blok za JS static fajlova -->
{% block scripts %}

{% endblock scripts %}

<!-- blok za sadržaj -->
{% block content %}
  <p>Unesite svoju email adresu i poslat ćemo vam upute za reset lozinke.</p>
  <form method="post">
    {% csrf_token %}
    {{ form.as_p }}
    <button type="submit">Resetiraj lozinku</button>
  </form>
{% endblock content%}

password_reset_done.html
{% extends 'base.html' %} <!-- uvoizim sadržaj base.html -->
{% load static %} <!-- uvoizim static fajle -->

<!-- blok za css fajlove -->
{% block styles %}

{% endblock styles %}

{% block title %}Reset password{% endblock title %}<!-- ovdje se menja title -->

<!-- blok za JS static fajlova -->
{% block scripts %}

{% endblock scripts %}

<!-- blok za sadržaj -->
{% block content %}
  <h2>Email poslan!</h2>
  <p>Pogledajte svoju email poštu – tamo ćete naći upute za resetiranje lozinke.</p>
{% endblock %}



password_reset_confirm.html
{% extends 'base.html' %} <!-- uvoizim sadržaj base.html -->
{% load static %} <!-- uvoizim static fajle -->

<!-- blok za css fajlove -->
{% block styles %}

{% endblock styles %}

{% block title %}Reset password{% endblock title %}<!-- ovdje se menja title -->

<!-- blok za JS static fajlova -->
{% block scripts %}

{% endblock scripts %}

<!-- blok za sadržaj -->
{% block content %}
  <h2>Postavite novu lozinku</h2>
  <form method="post">
    {% csrf_token %}
    {{ form.as_p }}
    <button type="submit">Spremi novu lozinku</button>
  </form>
{% endblock %}





password_reset_complete.html
{% extends 'base.html' %} <!-- uvoizim sadržaj base.html -->
{% load static %} <!-- uvoizim static fajle -->

<!-- blok za css fajlove -->
{% block styles %}

{% endblock styles %}

{% block title %}Reset password{% endblock title %}<!-- ovdje se menja title -->

<!-- blok za JS static fajlova -->
{% block scripts %}

{% endblock scripts %}

<!-- blok za sadržaj -->
{% block content %}
  <h2>Lozinka uspješno promijenjena</h2>
  <p>Vaša lozinka je sada promijenjena. Možete se prijaviti s novom lozinkom.</p>
{% endblock %}



nakon toga ču da proslčijedim link za resetiranje lozinke taj link se nalazi na login stranici
<a class="small text-muted" href="{% url 'password_reset' %}">Forgot password?</a>

A da bi me nakraju kada kliknem na link preusmjerilo na moj login unutar settings.py fajla moram da definičem preusmjerenje na login stranicu
LOGIN_URL = '/profiles/login/'




Blog
Kreiranje modela
from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify
from tinymce.models import HTMLField

class Blog(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='blogs') # author bloga
    title = models.CharField(max_length=255) #naslov bloga
    slug = models.SlugField(unique=True, blank=True) # slug bloga koji če da sadrži  naziv aplikacij ei id bloga
    content = HTMLField() # sadrzaj bloga

    created_at = models.DateTimeField(auto_now_add=True) # kada je  blog kreiran
    updated_at = models.DateTimeField(auto_now=True) # kada je blog azuriran
    is_published = models.BooleanField(default=True) # da li je blog objavljivan
    is_public = models.BooleanField(default=True)  # Da li je blog javni ili privatni

    # SEO polja
    meta_description = models.CharField(max_length=255, blank=True) # Ovo je kratak opis koji se koristi za pretragu na internetu
    meta_keywords = models.CharField(max_length=255, blank=True) # Ovo je kljucne rijeci koje se koriste za pretragu na internetu4

    def save(self, *args, **kwargs):
        # Ako slug nije postavljen, postavi privremeni slug sa ID-om
        if not self.slug:
            self.slug = f"temp-slug-{self.id if self.id else 'temp'}"
        
        # Generišemo SEO podatke ako nisu postavljeni
        if not self.meta_description:
            # Generisanje kratkog opisa (prvih 150 karaktera sadržaja)
            self.meta_description = self.content[:150]

        if not self.meta_keywords:
            # Generišemo ključne reči (prvi deo sadržaja, razdvojeno zarezima)
            self.meta_keywords = ",".join(self.content.split()[:5])  # Prvih 5 reči

        # Prvo sačuvaj blog, kako bi dobio ID
        super().save(*args, **kwargs)

        # Ažuriraj pravi slug nakon što dobije ID
        if not self.slug.startswith('temp-slug-'):
            return  # Ako je slug već postavljen, nema potrebe za promenom

        # Ažuriraj slug sa imenom aplikacije i ID-jem bloga
        self.slug = f"appname-{self.id}"
        
        # Ponovo sačuvaj sa novim slugom
        super().save(update_fields=["slug"])

    def __str__(self):
        return self.title

#polja za sliku
class Image(models.Model):
    blog = models.ForeignKey(Blog, on_delete=models.CASCADE, related_name='images') # sliku povezujemo sa blogom
    image = models.ImageField(upload_to='blog_images/') # sliku pohranjujemo u direktorij
    uploaded_at = models.DateTimeField(auto_now_add=True) # kada je slika pohranjena

    def __str__(self):
        return f"Image for {self.blog.title}"

class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name







Kreiranje viewsa
Prikaz svih postova
Unutar views.py faja uvesti ču blog models i napraviti ču funkciju koja prikazuje sve postove
from django.shortcuts import render
from .models import Blog

# prikaz svih postova
def home(request):
    blog = Blog.objects.all()
    return render(request, 'blog/home.html', {'blogs': blog})

unutar urls.py fajla ču da kreiram 
path('', views.home, name='home'),

unutar home.html ču da prikažem  sve postove napravi slider za sve postove i stilizujem to 
{% extends 'base.html' %} <!-- uvoizim sadržaj base.html -->

{% block title %}Home{% endblock title %} <!-- ovdje se menja title -->

{% load static %} <!-- uvoizim static fajle -->

{%block css%}

<link rel="stylesheet" href="{% static 'css/card_blog.css' %}">
<link rel="stylesheet" href="{% static 'css/slider.css' %}">

{%endblock css%}

<!-- blok za JS static fajlova -->
{% block scripts %}
<script src="{% static 'js/slider.js' %}"></script>
{% endblock scripts %}

<!-- blok za sadržaj -->
{% block content %}

{% for blog in blogs %}
<div class="container">
  <div class="left">
      <div class="row img_box">
        {% if blog.images.all %}
          <div id="slider">
            <a href="#" class="control_next">></a>
            <a href="#" class="control_prev"><</a>
            <ul>
              {% for image in blog.images.all %}
                <li><img src="{{ image.image.url }}" alt="Slika za blog {{ blog.title }}"></li>
              {% endfor %}
            </ul>  
          </div>
        {% else %}
        

        {% endif %}
      </div>
      <div class="row">
        <div class="left_left">
            <h5>12</h5>
            <h6>JANUARY</h6>
        </div>
        <div class="left_right">
            <table>
              <tr>
                <td><i class="fa fa-eye fa-2x"></i></td>
                <td><i class="fa fa-heart-o fa-2x"></i></td>
                <td><i class="fa fa-envelope-o fa-2x"></i></td>
                <td><i class="fa fa-share-alt fa-2x"></i></td>
              </tr>
              <tr>
                <td>20</td>
                <td>20</td>
                <td>20</td>
                <td>20</td>
              </tr>
            </table>
        </div>
      </div>
  </div>

  <div class="right">
      <div class="box box1">
        <h1>{{ blog.title }}</h1>
        <div class="author">
          <img src="{{ blog.author.profile.profile_image.url }}" alt="Profilna slika">
          <h2 class="author_name">{{ blog.author.first_name }} {{ blog.author.last_name }}</h2>
        </div> 
      </div>
      <div class="box box2">{{ blog.content|truncatewords:130 }}</div>
      <div class="fab"><i class="fa fa-arrow-down fa-3x"></i></div>
  </div>
</div>
{% endfor %}

{% endblock content %}

U slider.js 
jQuery(document).ready(function ($) {
    // Prolazi kroz svaki container koji sadrži slider (pretpostavljamo da su slideri unutar .img_box)
    $('.img_box').each(function() {
      var $imgBox = $(this);
      // Pronalazi slider unutar trenutnog .img_box
      var $slider = $imgBox.find('#slider');
      if (!$slider.length) return; // Ako slider nije pronađen, preskoči
  
      var $ul = $slider.find('ul');
      var $lis = $ul.find('li');
      var slideCount = $lis.length;
      
      // Izračunaj širinu i visinu prvog slajda (pretpostavlja se da su svi isti)
      var slideWidth = $lis.first().width();
      var slideHeight = $lis.first().height();
      var sliderUlWidth = slideCount * slideWidth;
      
      // Postavi dimenzije slidera
      $slider.css({ width: slideWidth, height: slideHeight });
      $ul.css({ width: sliderUlWidth, marginLeft: -slideWidth });
      
      // Premesti poslednji li na početak
      $ul.find('li:last-child').prependTo($ul);
    
      // Funkcija za pomeranje ulevo
      function moveLeft() {
        $ul.animate({
            left: + slideWidth
        }, 200, function () {
            $ul.find('li:last-child').prependTo($ul);
            $ul.css('left', '');
        });
      }
    
      // Funkcija za pomeranje udesno
      function moveRight() {
        $ul.animate({
            left: - slideWidth
        }, 200, function () {
            $ul.find('li:first-child').appendTo($ul);
            $ul.css('left', '');
        });
      }
    
      // Poveži klik događaje samo za ovaj slider
      $slider.find('a.control_prev').click(function (e) {
        e.preventDefault();
        moveLeft();
      });
    
      $slider.find('a.control_next').click(function (e) {
        e.preventDefault();
        moveRight();
      });
    
      // Automatsko pomeranje svakih 5 sekundi za ovaj slider
      setInterval(function () {
        moveRight();
      }, 5000);
    });
  });
  

Card_blog.css
.container {
  display: flex;
  width: 60%;
  height:550px;
  margin: 150px auto;
  border: 1px solid black;
  justify-content: center; 
  padding: 0px;
  -webkit-box-shadow: 10px 10px 50px 0px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 10px 10px 50px 0px rgba(0, 0, 0, 0.75);
  box-shadow: 10px 10px 50px 0px rgba(0, 0, 0, 0.75);
  
}

.left {
   display: flex;
   flex-direction: column;
   width: 60%;

}

.right {
    width: 30%;
    display: flex;
    flex-direction: column;
    gap: 10px;

}

.img_box{
  position: relative;
  height: 350px;
  margin: 0px;
  padding: 0px;
  width: 90%;
  top: -80px;

}

.img_box img{

  height: 350px;
  object-fit: cover;
  margin: 0px;
  padding: 0px;
}

.left_right {
   display: flex;
   flex-direction: column;
   width: 55%;
   float: right;
}

.left_left {
    width: 40%;
    display: flex;
    flex-direction: column;
    float: left;
    margin: 0px;
    padding: 0px;
}
.left_left h5{
  font-size: 6rem;
  color: #C3C3C3;
  margin:0;
}
.left_left h6{
  font-size: 2rem;
  color: #C3C3C3;
  margin:0;
}

.left_right table {
  margin-top: 50px;
  width: 350px;
  text-align: center;
}

.left_right td {
  list-style: none;
  padding-right: 40px;
  color: #7B7B7B;
}

.box{
  
  margin-left: 10PX;
  width: 380px;
}

.box1{
  text-align: center;
  float: top;
  margin: 10px;
}

.box2{
  height: 400px;
  padding: 5px;
  text-align: justify;
  
}

.box1 h1{
  color : #4B4B4B; 
}

.author {
  background-color: #9ecaff;
  height: 30px;
  width: 210px;
  border-radius: 20px;
  margin-left: 20px;
  padding-top: 5px;
}

.author img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  float: left;
  margin: -10px ;
}

.author_name {
  font-size: 1rem;
  color: white;
}

.fab {
  position: relative;
  right: -300px;
  box-sizing: border-box;
  padding-top: 10px;
  background-color: #1875D0;
  width: 80px;
  height: 80px;
  color: white;
  text-align: center;
  border-radius: 50%;
  -webkit-box-shadow: 10px 10px 50px 0px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 10px 10px 50px 0px rgba(0, 0, 0, 0.75);
  box-shadow: 10px 10px 50px 0px rgba(0, 0, 0, 0.75);
}

/* Ekrani širine 1200px i manje */
@media (max-width: 1200px) {
  .container {
    width: 80%;
    margin: 100px auto;
  }
  .left, .right {
    width: 100%;
  }
  .left_right, .left_left {
    width: 100%;
    float: none;
  }
  .img_box {
    width: 100%;
    top: 0;
  }
}

/* Ekrani širine 992px i manje */
@media (max-width: 992px) {
  .container {
    width: 90%;
    margin: 80px auto;
  }
  .left_left h5 {
    font-size: 4rem;
  }
  .left_left h6 {
    font-size: 1.5rem;
  }
  .left_right table {
    width: 100%;
  }
}

/* Ekrani širine 768px i manje */
@media (max-width: 768px) {
  .container {
    flex-direction: column;
    height: auto;
    margin: 50px auto;
  }
  .img_box {
    height: auto;
  }
  .img_box img {
    width: 100%;
    height: auto;
  }
  .fab {
    right: 0;
    margin-top: 20px;
  }
}

/* Ekrani širine 576px i manje */
@media (max-width: 576px) {
  .left_left h5 {
    font-size: 3rem;
  }
  .left_left h6 {
    font-size: 1.2rem;
  }
  .author {
    width: 100%;
    text-align: center;
  }
  .author img {
    margin: 0 10px;
  }
}

@media (max-width: 1889px) {
  .container {
    flex-direction: column;
    align-items: center;
    width: 90%;
    height: auto;
    margin: 50px auto;
  }
  .left, .right {
    width: 100%;
  }
  .img_box {
    width: 100%;
    top: 0;
  }
  .img_box img {
    width: 100%;
    height: auto;
  }
  .left_left, .left_right {
    width: 100%;
    float: none;
  }
  .left_left h5 {
    font-size: 4rem;
    text-align: center;
  }
  .left_left h6 {
    font-size: 1.5rem;
    text-align: center;
  }
  .left_right table {
    width: 100%;
    margin-top: 20px;
  }
  .left_right td {
    padding-right: 20px;
  }
  .box {
    width: 100%;
    margin-left: 0;
  }
  .fab {
    right: 0;
    margin-top: 20px;
  }
}

Slider.css
@import url(https://fonts.googleapis.com/css?family=Open+Sans:400,300,600);

html {
  border-top: 5px solid #fff;
  color: #2a2a2a;
}

html, body {
  margin: 0;
  padding: 0;
  font-family: 'Open Sans';
}

h1 {
  color: #fff;
  text-align: center;
  font-weight: 300;
}

#slider {
  position: relative;
  overflow: hidden;
  width: 100%;    /* Zauzima punu širinu roditeljskog kontejnera (npr. .img_box) */
  height: 100%;   /* Zauzima punu visinu roditeljskog kontejnera */
  border-radius: 4px;
  margin-left: 10px;
  -webkit-box-shadow: 10px 10px 50px 0px rgba(0, 0, 0, 0.75); 
  -moz-box-shadow: 10px 10px 50px 0px rgba(0, 0, 0, 0.75);
  box-shadow: 10px 10px 50px 0px rgba(0, 0, 0, 0.75);
}

#slider ul {
  position: relative;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  list-style: none;
}

#slider ul li {
  position: relative;
  display: block;
  float: left;
  width: 100%;
  height: 100%;
  background: #ccc; /* ili prilagodi boju/sliku po potrebi */
  text-align: center;
  line-height: normal;  /* ovde možeš dodati dodatno vertikalno centriranje ako je potrebno */
}

a.control_prev, 
a.control_next {
  position: absolute;
  top: 50%; /* Centrirano vertikalno */
  transform: translateY(-50%);
  z-index: 999;
  display: block;
  padding: 10px;
  background: #2a2a2a;
  color: #fff;
  text-decoration: none;
  font-weight: 600;
  font-size: 18px;
  opacity: 0.8;
  cursor: pointer;
}

a.control_prev:hover, 
a.control_next:hover {
  opacity: 1;
  transition: all 0.2s ease;
}

a.control_prev {
  left: 0;  /* sa leve strane */
  border-radius: 0 2px 2px 0;
}

a.control_next {
  right: 0; /* sa desne strane */
  border-radius: 2px 0 0 2px;
}

.slider_option {
  position: relative;
  margin: 10px auto;
  width: 160px;
  font-size: 18px;
}

/* Media query za tablete (do 768px) */
@media (max-width: 768px) {
  #slider {
    margin-left: 0;  /* Ukloni dodatnu levu marginu kako bi se slider centrirao */
    height: 250px;   /* Smanji visinu slidera za tablet */
  }
  
  a.control_prev, 
  a.control_next {
    font-size: 16px;
    padding: 8px;
  }
  
  .slider_option {
    width: 140px;
    font-size: 16px;
  }
}

/* Media query za mobilne uređaje (do 480px) */
@media (max-width: 480px) {
  #slider {
    height: 200px;  /* Dalje smanji visinu slidera za mobilne uređaje */
  }
  
  a.control_prev, 
  a.control_next {
    font-size: 14px;
    padding: 6px;
  }
  
  .slider_option {
    width: 120px;
    font-size: 14px;
  }
}






Ukoliko želim da prikažem samo prvu sliku iz liste slika onda mi css i JS vezana za slider nije potrebna to radim na ovaj način
      <div class="row img_box">
        {% if blog.images.all %}
        <img src="{{ blog.images.first.image.url }}" alt="Slika za blog {{ blog.title }}">
        {% else %}
            <img src="{% static 'images/no_image.jpg' %}" alt="">
        {% endif %}
      </div>

Prikaz detalja posta
Uvesti ču login_required  da bi samo prijavljeni korisnici mogli da vide post ukoliko pokuša ne logovan korisnik pristupit detaljima stranica če ga preusmjeriti na login post
from django.contrib.auth.decorators import login_required

sada ču da napravim funkciju za prikazivanje detalja bloga po primarnom ključu
@login_required
def blog_detail(request, pk):
    blog = Blog.objects.get(pk=pk)  
    if not request.user.is_authenticated:
        messages.success(request, "You are not logged in. Please log in to view this page.")
    return render(request, 'blog/blog_detail.html', {'blog': blog})

sada ču da kreiram url za prikaz poosta
path('<pk>/', views.blog_detail, name='blog_detail'),


a unutar home stranice na kojoj prikazujem sve postove postaviti ču link koji vodi na prikaz jednog posta
 <a href="{% url 'blog_detail' blog.pk %}"><div class="fab"><i class="fa fa-arrow-down fa-3x"></i></div></a>

Sada ču da kreiram html stranicu blog_detail.html i pozovem podatke unutar nje
{% extends 'base.html' %} <!-- uvoizim sadržaj base.html -->

{% block title %}{{ blog.title }}{% endblock title %} <!-- ovdje se menja title -->

{% load static %} <!-- uvoizim static fajle -->

{%block css%}
<link rel="stylesheet" href="{% static 'css/blog_detail.css' %}">
<link rel="stylesheet" href="{% static 'css/slider.css' %}">
{%endblock css%}

<!-- blok za JS static fajlova -->
{% block scripts %}
<script src="{% static 'js/slider.js' %}"></script>
{% endblock scripts %}

<!-- blok za sadržaj -->
{% block content %}

<div class="blog_detail">

    <div class="img">
        <div class="row img_box">
            {% if blog.images.all %}
            <div id="slider">
                <a href="#" class="control_next">></a>
                <a href="#" class="control_prev"><</a>
                <ul>
                {% for image in blog.images.all %}
                    <li><img src="{{ image.image.url }}" alt="Slika za blog {{ blog.title }}" style="height: 100%;"></li>
                {% endfor %}
                </ul>  
            </div>
        {% else %}
        <img src="{% static 'images/no_image.jpg' %}" alt="">
        {% endif %}
        </div>
        
        <div class="text">
            <h1 style="font-weight: bold; text-align: center;">{{blog.title}}</h1>
            <p>Author:  <a href="{% url 'profile' blog.author.pk %}" style="text-decoration: none;">{{blog.author.first_name}} {{blog.author.last_name}}</a></p>
            <p>{{blog.content}}</p>
        </div>

        <div class="row" style="text-align: center;">
            <div class="left_left">
                <h5>{{blog.created_at.day}} {{ blog.created_at|date:"F" }}</h5>
    
                <h1>{{ blog.created_at|date:"Y" }}</h1>
            </div>
            <div class="left_right">
                <table>
                <tr>
                    <td><i class="fa fa-eye fa-2x"></i></td>
                    <td><i class="fa fa-heart-o fa-2x"></i></td>
                    <td><i class="fa fa-envelope-o fa-2x"></i></td>
                    <td><i class="fa fa-comments-o fa-2x"></i></td>
                </tr>
                <tr>
                    <td>20</td>
                    <td>20</td>
                    <td>20</td>
                    <td>20</td>
                </tr>
                </table>
            </div>
        </div>
    </div>

    <hr>
    <h5>Coments:</h5>

</div>

{% endblock content %}

Ovo je css detail bloga
.blog_detail{
   
    width: 90%; 
    margin: auto;
}
.text{
    margin-top: 50px;
    font-size: 1.5rem;
}

.left_right {
    display: flex;
    flex-direction: column;
    width: 55%;
    float: right;

 }
 
 .left_left {
     width: 40%;
     display: flex;
     flex-direction: column;
     float: left;
     margin-top: 50px;
     padding: 0px;
 }
 .left_left h5{
   font-size: 6rem;
   color: #C3C3C3;
   margin:0;
   font-weight: bold;
 }
 .left_left h1{
   font-size: 6rem;
   color: #C3C3C3;
   margin-left: 10%;
   font-weight: bold;
 }
 
 .left_right table {
   margin-top: 150px;
   width: 550px;

 }
 
 .left_right td {
   list-style: none;
   padding-right: 40px;
   color: #7B7B7B;
   font-weight: bold;
   font-size: 1.5rem;
 }


Ovo je css slidera
@import url(https://fonts.googleapis.com/css?family=Open+Sans:400,300,600);

html {
  border-top: 5px solid #fff;
  color: #2a2a2a;
}

html, body {
  margin: 0;
  padding: 0;
  font-family: 'Open Sans';
}

#slider h1 {
  color: #fff;
  text-align: center;
  font-weight: 300;
}

#slider {
  position: relative;
  overflow: hidden;
  width: 100%;    /* Zauzima punu širinu roditeljskog kontejnera (npr. .img_box) */
  height: 100%;   /* Zauzima punu visinu roditeljskog kontejnera */
  border-radius: 4px;
  margin-left: 10px;
  -webkit-box-shadow: 10px 10px 50px 0px rgba(0, 0, 0, 0.75); 
  -moz-box-shadow: 10px 10px 50px 0px rgba(0, 0, 0, 0.75);
  box-shadow: 10px 10px 50px 0px rgba(0, 0, 0, 0.75);
}

#slider ul {
  position: relative;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  list-style: none;
}

#slider ul li {
  position: relative;
  display: block;
  float: left;
  width: 100%;
  height: 100%;
  background: #ccc; /* ili prilagodi boju/sliku po potrebi */
  text-align: center;
  line-height: normal;  /* ovde možeš dodati dodatno vertikalno centriranje ako je potrebno */
}

a.control_prev, 
a.control_next {
  position: absolute;
  top: 50%; /* Centrirano vertikalno */
  transform: translateY(-50%);
  z-index: 999;
  display: block;
  padding: 10px;
  background: #2a2a2a;
  color: #fff;
  text-decoration: none;
  font-weight: 600;
  font-size: 18px;
  opacity: 0.8;
  cursor: pointer;
}

a.control_prev:hover, 
a.control_next:hover {
  opacity: 1;
  transition: all 0.2s ease;
}

a.control_prev {
  left: 0;  /* sa leve strane */
  border-radius: 0 2px 2px 0;
}

a.control_next {
  right: 0; /* sa desne strane */
  border-radius: 2px 0 0 2px;
}

.slider_option {
  position: relative;
  margin: 10px auto;
  width: 160px;
  font-size: 18px;
}

/* Media query za tablete (do 768px) */
@media (max-width: 768px) {
  #slider {
    margin-left: 0;  /* Ukloni dodatnu levu marginu kako bi se slider centrirao */
    height: 250px;   /* Smanji visinu slidera za tablet */
  }
  
  a.control_prev, 
  a.control_next {
    font-size: 16px;
    padding: 8px;
  }
  
  .slider_option {
    width: 140px;
    font-size: 16px;
  }
}

/* Media query za mobilne uređaje (do 480px) */
@media (max-width: 480px) {
  #slider {
    height: 200px;  /* Dalje smanji visinu slidera za mobilne uređaje */
  }
  
  a.control_prev, 
  a.control_next {
    font-size: 14px;
    padding: 6px;
  }
  
  .slider_option {
    width: 120px;
    font-size: 14px;
  }
}


I ovo je JS slidera
jQuery(document).ready(function ($) {
    // Prolazi kroz svaki container koji sadrži slider (pretpostavljamo da su slideri unutar .img_box)
    $('.img_box').each(function() {
      var $imgBox = $(this);
      // Pronalazi slider unutar trenutnog .img_box
      var $slider = $imgBox.find('#slider');
      if (!$slider.length) return; // Ako slider nije pronađen, preskoči
  
      var $ul = $slider.find('ul');
      var $lis = $ul.find('li');
      var slideCount = $lis.length;
      
      // Izračunaj širinu i visinu prvog slajda (pretpostavlja se da su svi isti)
      var slideWidth = $lis.first().width();
      var slideHeight = $lis.first().height();
      var sliderUlWidth = slideCount * slideWidth;
      
      // Postavi dimenzije slidera
      $slider.css({ width: slideWidth, height: slideHeight });
      $ul.css({ width: sliderUlWidth, marginLeft: -slideWidth });
      
      // Premesti poslednji li na početak
      $ul.find('li:last-child').prependTo($ul);
    
      // Funkcija za pomeranje ulevo
      function moveLeft() {
        $ul.animate({
            left: + slideWidth
        }, 200, function () {
            $ul.find('li:last-child').prependTo($ul);
            $ul.css('left', '');
        });
      }
    
      // Funkcija za pomeranje udesno
      function moveRight() {
        $ul.animate({
            left: - slideWidth
        }, 200, function () {
            $ul.find('li:first-child').appendTo($ul);
            $ul.css('left', '');
        });
      }
    
      // Poveži klik događaje samo za ovaj slider
      $slider.find('a.control_prev').click(function (e) {
        e.preventDefault();
        moveLeft();
      });
    
      $slider.find('a.control_next').click(function (e) {
        e.preventDefault();
        moveRight();
      });
    
      // Automatsko pomeranje svakih 5 sekundi za ovaj slider
      setInterval(function () {
        moveRight();
      }, 5000);
    });
  });
  

Dodavanje posta
U views.py dodati ču kontroler koji če da dohvati sve podatke  poput authora  i forme unutar koje postavljam nslov i sadržaj teksta postavljam ajax zahtjev jer ču slike da postavim preko dop zone.

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

nakon toga ču da dodam link za dodavanje novog posta 
path('new_post/', views.new_post, name='new_post'),

nkon toga ču da  kreriam new_post.html stranicu unutar templatesa
{% extends 'base.html' %}

{% block title %}Add blog{% endblock title %}

{% load static %}

{% block css %}
  <style src="{% static 'css/drop_zone.css' %}"></style>
{% endblock css %}

{% block scripts %}
  <script src="{% static 'js/dropzone.js' %}"></script>
  <script src="{% static 'js/tinny.js' %}"></script>
{% endblock scripts %}

{% block content %}
  <div class="container mt-4">
    <h2>Add Post</h2>
    <form method="POST" enctype="multipart/form-data" id="post-form">
        {% csrf_token %}
        {{ form.as_p }}

        <div class="dropzone" id="dropzone">
            <div class="dz-message">
                <h2>Povucite slike ovdje ili kliknite za upload</h2>
            </div>
        </div>

        <button type="submit" class="btn btn-primary">Save Changes</button>
    </form>
  </div>
{% endblock content %}

Pošto ću da slike postavljam koristeči drop zpne  kreirati ču js dorpzone.js koji postavlja ajay zahtjev za drop zone.
const postForm = document.getElementById("post-form"); 
const csrf = document.getElementsByName("csrfmiddlewaretoken")[0];
const dropzone = document.querySelector(".dropzone");

Dropzone.autoDiscover = false;

let myDropzone;

$(document).ready(function () {
  myDropzone = new Dropzone(".dropzone", {
    url: "/new_post/",
    maxFiles: 10,
    acceptedFiles: ".jpg, .jpeg, .png, .gif",
    maxFilesize: 2,
    addRemoveLinks: true,
    dictDefaultMessage: "Povucite slike ovdje ili kliknite za upload",
    init: function () {
      this.on("sending", function (file, xhr, formData) {
        formData.append("csrfmiddlewaretoken", csrf.value);
      });
    },
  });

  postForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(postForm);

    // Dodaj sve fajlove iz dropzone u formu
    myDropzone.getAcceptedFiles().forEach((file) => {
      formData.append("image", file);
    });

    $.ajax({
      type: "POST",
      url: "/new_post/",
      data: formData,
      processData: false,
      contentType: false,
      success: function (response) {
        // ❗❗ Ovdje je ključ: browser će sada ići na početnu stranicu
        window.location.href = "/";
      },
      error: function (error) {
        console.error("Greška:", error);
      },
    });
  });
});

Brisanje posta
Unutar  views.py fajal ču da kreiram kontroler za  brisanje posta 
# brisanje posta
@login_required
def delete_post(request, pk):
    blog = get_object_or_404(Blog, pk=pk)
    blog.delete()
    messages.success(request, 'Post deleted successfully.')  # Poruka pre preusmeravanja
    return redirect('home')

unutar urls.py fajla ču da kreiram url za brisnje posta 
 path('blog_delete/<int:pk>/', views.delete_post, name='blog_delete'),

unutar html stranice kreirati ču delete button koji če prilikom klika pokrenut alert koji če primati id posta data-id="{{ blog.pk }}"  data id proslijeđuje id post.
<btn id="delete" data-id="{{ blog.pk }}"  class="btn btn-outline-danger btn-lg p-0 m-0  ms-2" style="width: 100%;">Delete</btn>

A onda ču da kreiram js fajl i unutar njega prvo prikažem id posta
const postElement = document.getElementById('delete');
const postId = postElement.getAttribute('data-id');

a onda ču da dodam ebent klik na button i kada se klikne dodati ču alert
document.getElementById('delete').addEventListener('click', function(event) {
    event.preventDefault(); // Sprečava podrazumevanu akciju dugmeta

    const confirmDelete = confirm('Are you sure you want to delete this post?');

    if (confirmDelete) {
        // Pozivanje URL-a za brisanje u alertu
        window.location.href = "/blog_delete/" + postId; 
    }
});



Poštop alert izgleda malo ružno prilikom brisanja pa ču da koristim  SweetAlert2 pa ču više alert.js koda da  zaljepim

<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<script src="{% static 'js/alert.js' %}"></script>

A unutar alert.js fajla ču da kreiram SweetAlert2
const postElement = document.getElementById('delete');
const postId = postElement.getAttribute('data-id');

document.addEventListener("DOMContentLoaded", function () {
    const delete_btn = document.getElementById('delete');

    if (delete_btn) {  // Provera da dugme postoji
        delete_btn.addEventListener('click', function (event) {
            event.preventDefault();

            Swal.fire({
                title: "Are you sure?",
                text: "Do you want to delete the post!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Delete",
                cancelButtonText: "Cancel"
            }).then((result) => {
                if (result.isConfirmed) {
                    const postId = delete_btn.getAttribute('data-id');
                    window.location.href = "/blog_delete/" + postId;
                }
            });
        });
    } else {
        console.error("Dugme sa ID 'delete' ne postoji!");
    }
});





Ediitovanje po sta (uređenje posta)
Unutar views.py uraditi ču editovanje posta
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

nakon toga ču da kreiram url za edit post
 path('edit_post/<int:pk>/', views.edit_post, name='edit_post'),


taj určl ču da pozovem unutar blog detaila gdje sam ga i kreirao
<td class="p-0 m-0" style="width: 100px;"><a href="{% url 'edit_post' blog.pk %}" class="btn btn-outline-primary btn-lg p-0 m-0" style="width: 100%;" >Edit</a></td>

Kreirati ču edit post ht5ml stranicu
{% extends 'base.html' %} <!-- uvoizim sadržaj base.html -->

{% block title %}{{ blog.title }}{% endblock title %} <!-- ovdje se menja title -->

{% load static %} <!-- uvoizim static fajle -->

{%block css%}
{% endblock css%}

<!-- blok za JS static fajlova -->
{% block scripts %}
{% endblock scripts %}

<!-- blok za sadržaj -->
{% block content %}
<div class="container mt-4">
    <h2>Edit Post: {{ blog.title }}</h2>
    <form method="POST" enctype="multipart/form-data">
        {% csrf_token %}
        <!-- Prikaz forme za naslov i sadržaj -->
        {{ form.as_p }}

        <!-- Sekcija za prikaz postojećih slika sa mogućnošću brisanja -->
        <h3>Current Images</h3>
        {% if blog.images.all %}
            <div class="row">
                {% for image in blog.images.all %}
                    <div class="col-md-3 mb-3">
                        <img src="{{ image.image.url }}" class="img-thumbnail" alt="Image for {{ blog.title }}">
                        <div class="form-check mt-2">
                            <input class="form-check-input" type="checkbox" name="delete_images" value="{{ image.id }}" id="deleteImage{{ image.id }}">
                            <label class="form-check-label" for="deleteImage{{ image.id }}">
                                Delete
                            </label>
                        </div>
                    </div>
                {% endfor %}
            </div>
        {% else %}
            <p>No images available.</p>
        {% endif %}

        <!-- Sekcija za upload novih slika -->
        <h3>Add New Images</h3>
        <div class="mb-3">
            <input type="file" name="new_images" multiple class="form-control">
        </div>

        <button type="submit" class="btn btn-primary">Save Changes</button>
    </form>
</div>
{% endblock content %}





Uređivanje teksta unutar polja za pisanje i dodavanje slika unutar tog polja


Instalacija
pip install django-tinymce
u settings.py fajlu ču da dodam osnovne opcije za korištenje tinnymce
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'tinymce',
    'blog',
    'profiles',
]

TINYMCE_DEFAULT_CONFIG = {
    'plugins': "image,link,code",
    'toolbar': "undo redo | bold italic | alignleft aligncenter alignright | image | code",
}


Unutar  prijekta u glavnom url ču da dodam url
path('tinymce/', include('tinymce.urls')),

unutar models fajla ču da dodam tiny mce
from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify

from tinymce.models import HTMLField

class Blog(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='blogs')
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True)
    content = HTMLField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_published = models.BooleanField(default=False)
    # SEO polja
    meta_description = models.CharField(max_length=255, blank=True)
    meta_keywords = models.CharField(max_length=255, blank=True)
    tags = models.ManyToManyField('Tag', blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

class Image(models.Model):
    blog = models.ForeignKey(Blog, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='blog_images/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image for {self.blog.title}"

class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

unutar forms.py fajla ču da doam  isto
from django import forms
from .models import Blog
from tinymce.widgets import TinyMCE

class PostForm(forms.ModelForm):
    title = forms.CharField(widget=forms.TextInput(attrs={'class': 'form-control'}))
    content = forms.CharField(widget=TinyMCE(attrs={'cols': 80, 'rows': 30, 'class': 'form-control tinymce'}))
    is_public = forms.BooleanField(required=False, initial=True, label="Is this blog public?", widget=forms.CheckboxInput(attrs={'class': 'form-check-input'}))

    class Meta:
        model = Blog
        fields = ('title', 'content', 'is_public')

unutar base.html u head dijelu ču da dodam podešavanja za tinymce
    <!-- tekst editor -->
    <script src="https://cdn.tiny.cloud/1/api ključ /tinymce/6/tinymce.min.js" referrerpolicy="origin"></script>

Nakon toga ču da se prijavim na  web srtranicu 
https://www.tiny.cloud/my-account/integrate/#html i kopiram moj api ključ i postavim fa unutarr linka  gdje taj ključ treba da bude
unutar approver domains ču da dodam svoj url lokal hosta koji koristim
pa če linkovi tekst editora izgledati ovako
    <!-- tekst editor -->
    <script src="https://cdn.tiny.cloud/1/iofahfp5pvzclfibt34j35zf4peo80vuh3pwfvr9wajkiwca/tinymce/6/tinymce.min.js" referrerpolicy="origin"></script>

A napraviti tinny.js fajl i unutar tog fajla smjestiti ovaj kod
console.log("Tinny.js pokrenut");

document.addEventListener('DOMContentLoaded', function () {
  console.log("DOM učitan");

  console.log("TinyMCE verzija:", tinymce.majorVersion + "." + tinymce.minorVersion);

  tinymce.init({
    selector: '.tinymce',
    plugins: 'image link code lists table',
    toolbar: 'undo redo | bold italic underline | alignleft aligncenter alignright | bullist numlist | link image | code',
    menubar: false,
    height: 500,
    automatic_uploads: true,
    file_picker_types: 'image',
    file_picker_callback: function (cb, value, meta) {
      if (meta.filetype === 'image') {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');

        input.onchange = function () {
          const file = this.files[0];
          const reader = new FileReader();
          reader.onload = function () {
            const id = 'blobid' + new Date().getTime();
            const blobCache = tinymce.activeEditor.editorUpload.blobCache;
            const base64 = reader.result.split(',')[1];
            const blobInfo = blobCache.create(id, file, base64);
            blobCache.add(blobInfo);
            cb(blobInfo.blobUri(), { title: file.name });
          };
          reader.readAsDataURL(file);
        };

        input.click();
      }
    }
  });
});


I skriptu pozvati unutar editi block skripte
{% block scripts %}
<script src="{% static 'js/tinny.js' %}"></script>
{% endblock scripts %}


Unutar viewsa uraditi kontroler za snimanje slike u tekstualnom polju
import os
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

i unurls.py fajlu krierati url
   path('upload_image/', views.upload_image, name='upload_image'),
]

Da bi prikazivao slike u pravom formatu moram da koristim safe u prikazu teksta.
<p>{{blog.content|safe}}</p>

Sada mogu da  sve koristim kako treba















Komentari 
Kreirati comment app  podesiti je 
Kreiranje moodela
 blog = models.ForeignKey(
        Blog,
        on_delete=models.CASCADE,
        related_name='comments',
        help_text="Blog post na koji se komentar odnosi. Uzimamo slug iz Blog modela preko veze."
    )

•  ForeignKey prema Blog modelu: Ovdje se koristi veza prema modelu Blog kako bi se svaki komentar povezao s određenim blog postom.
•  on_delete=models.CASCADE: Ako se blog post obriše, svi povezani komentari će se automatski obrisati.
•  related_name='comments': Omogućava da sa instancom bloga lako pristupite svim povezanim komentarima koristeći atribut comments (npr. blog_instance.comments.all()).
•  help_text: Kratka uputa u administracijskom sučelju koja objašnjava svrhu polja.

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='comments',
        help_text="Korisnik koji je napisao komentar."
    )

•	Veza prema korisničkom modelu: Koristi se settings.AUTH_USER_MODEL kako bi se omogućila fleksibilnost u slučaju korištenja prilagođenog korisničkog modela.
•	on_delete=models.CASCADE: Ako se korisnik obriše, svi njegovi komentari će se također obrisati.
•	related_name='comments': Omogućuje pristup svim komentarima koje je napisao određeni korisnik (npr. user_instance.comments.all()).
    content = models.TextField(help_text="Tekst komentara") # Tekst komentara
    created_at = models.DateTimeField(auto_now_add=True, help_text="Kada je komentar kreiran")
    updated_at = models.DateTimeField(auto_now=True, help_text="Kada je komentar zadnji put ažuriran")
    # Polje 'parent' omogućuje da se komentar poveže s roditeljskim komentarom

•	Tekst komentara: Polje koje sadrži sadržaj komentara. Koristi se TextField jer komentar može sadržavati proizvoljno mnogo teksta.
•	Automatsko postavljanje vremenskih oznaka:
•	created_at se automatski postavlja na trenutni datum i vrijeme kada se komentar prvi put kreira.
•	updated_at se automatski ažurira pri svakom spremanju (update) komentara.
•	Ovo olakšava praćenje kada je komentar kreiran i kada je posljednji put izmijenjen.

    # Polje 'parent' omogućuje da se komentar poveže s roditeljskim komentarom
    parent = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='replies',
        help_text="Ako je postavljen, označava da je ovaj komentar odgovor na drugi komentar."
    )

•  Self-referencijalni odnos: Pomoću ovog polja omogućujete da komentar može biti odgovor (odnosno, pod-komentar) na neki drugi komentar.
•  null=True i blank=True: Polje je opciono, što znači da osnovni komentar ne mora imati roditelja. Ako je postavljeno, onda se radi o odgovoru.
•  related_name='replies': Omogućuje pristup svim odgovorima na određeni komentar koristeći atribut replies (npr. komentar_instance.replies.all()).
•  on_delete=models.CASCADE: Ako se iz nekog razloga obriše roditeljski komentar, svi odgovori na njega također će biti obrisani.




    class Meta:
        ordering = ['created_at']  # Komentari se mogu automatski redati po datumu kreiranja
        verbose_name = "Komentar"
        verbose_name_plural = "Komentari"

•	
o	ordering: Definira da se komentari automatski sortiraju po datumu kreiranja (created_at), što omogućava prikaz od najstarijih prema najnovijima ili obrnuto (ovisno o načinu prikaza).
o	verbose_name i verbose_name_plural: Pomoću ovih atributa definirate prikladna imena za model u administracijskom sučelju, što poboljšava preglednost i razumijevanje.
    def __str__(self):
        # Prikazuje se korisničko ime i slug blog posta
        return f'Komentar od {self.user.username} na {self.blog.slug}'

•	Predstavljanje instance: Ova metoda definira kako će se instanca modela prikazati kao string. U ovom slučaju, vraća se jednostavan tekstualni opis koji uključuje korisničko ime osobe koja je napisala komentar i slug blog posta, što olakšava identifikaciju komentara prilikom rada u administraciji ili debugiranju.

    def is_reply(self):
        # Jednostavna metoda za provjeru da li je komentar odgovor na drugi komentar
        return self.parent is not None

•	Provjera je li komentar odgovor: Ova pomoćna metoda omogućuje provjeru da li je određeni komentar odgovor (tj. ima postavljeni parent) ili osnovni komentar. Ako parent nije None, metoda će vratiti True, što znači da je komentar odgovor na drugi komentar.







ovako izgleda kompletan model
from django.db import models

# Create your models here.
from django.db import models
from django.conf import settings  # Preporučeno je koristiti settings.AUTH_USER_MODEL
from blog.models import Blog

class Comment(models.Model):
    blog = models.ForeignKey(
        Blog,
        on_delete=models.CASCADE,
        related_name='comments',
        help_text="Blog post na koji se komentar odnosi. Uzimamo slug iz Blog modela preko veze."
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='comments',
        help_text="Korisnik koji je napisao komentar."
    )
    content = models.TextField(help_text="Tekst komentara") # Tekst komentara
    created_at = models.DateTimeField(auto_now_add=True, help_text="Kada je komentar kreiran")
    updated_at = models.DateTimeField(auto_now=True, help_text="Kada je komentar zadnji put ažuriran")
    # Polje 'parent' omogućuje da se komentar poveže s roditeljskim komentarom
    parent = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='replies',
        help_text="Ako je postavljen, označava da je ovaj komentar odgovor na drugi komentar."
    )

    class Meta:
        ordering = ['-created_at']  # Komentari se mogu automatski redati po datumu kreiranja
        verbose_name = "Komentar"
        verbose_name_plural = "Komentari"

    def __str__(self):
        # Prikazuje se korisničko ime i slug blog posta
        return f'Komentar od {self.user.username} na {self.blog.slug}'

    def is_reply(self):
        # Jednostavna metoda za provjeru da li je komentar odgovor na drugi komentar
        return self.parent is not None



Prikazivanje sadržaja od najnovijeg prema najstarijem  
kreira se unutar klase meta ukoliko postavi minus pokazuje se od najnovijeg prema najstarijem bez minnusa je kontra
 class Meta:
        ordering = ['-created_at']  # Komentari se mogu automatski redati po datumu kreiranja















kreiranje viewsa
from blog.models import Blog
from .models import Comment # uvoz modela coment
from django.http import JsonResponse# uvoz json response

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

nakon toga ču da kreiram url
path('comments_list/', views.all_comments, name='comments_list'), 





povezivanje html i kreiranje js koda
unutar blog_detail.html fajla to jesste u fjl unutar kojeg žalim da smjestim komentare ču da smjestim div blok sa id comment   i unutar njega ču da postavim h5 naslov sa ispisom koment.
    
<div class="ms-5 mb-5" id="comment" data-slug="{{ blog.slug }}">
  <h5>Comments:</h5>
</div>

A onda ču unutar tog HTML fajla ču da uvezem  kreirani JS fajl comments.js 
{% block scripts %}
<script src="{% static 'js/slider.js' %}"></script>
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<script src="{% static 'js/alert.js' %}"></script>
<script src="{% static 'js/comment.js' %}"></script>
{% endblock scripts %}

A u JS fajlu ču da selektujem div sa id comment kada prolazim kroz HTML  element do slike dolazim preko poziva unutar viewsa  svaki podatak koji želim da prikažem preko ajaxa moram da prođem kroz podatke u viewsu.
const commentsContainer = document.getElementById("comment");
const blogSlug = commentsContainer.dataset.slug;  // uzimamo slug direktno iz HTML-a

$.ajax({
    type: "GET",
    url: "/comment/comments_list/",
    data: { slug: blogSlug },            // šaljemo slug u GET
    success: function(response) {
        commentsContainer.innerHTML = '<h5>Comments:</h5>';  // resetujemo
        const data = response.data;
        data.forEach(comment => {
            const repliesId = `replies-${comment.id}`;
            const toggleId = `toggle-${comment.id}`;
            let html = `
                <div class="comment mt-5">
                  <div class="comment_header">
                    <img class="profile_comment_image" src="${comment.profile_image}" alt="">
                    <h5 class="comment_user">${comment.user}</h5>
                  </div>
                  <p class="comment_content">${comment.content}</p>
            `;
            if (comment.replies.length) {
                html += `
                  <div class="toggle_replies" id="${toggleId}" style="cursor:pointer; color:#007bff">
                    ▼ ${comment.replies.length} answer${comment.replies.length>1?'s':''}
                  </div>
                  <div class="replies" id="${repliesId}" style="display:none">
                `;
                comment.replies.forEach(r => {
                    html += `
                      <div class="reply">
                        <div class="comment_header">
                          <img class="profile_comment_image" src="${r.profile_image}" alt="">
                          <h6 class="comment_user">${r.user}</h6>
                        </div>
                        <p class="comment_content">${r.content}</p>
                      </div>
                    `;
                });
                html += `</div>`;
            }
            html += `</div>`;
            commentsContainer.innerHTML += html;

            // toggle
            setTimeout(() => {
                const toggle = document.getElementById(toggleId);
                const replies = document.getElementById(repliesId);
                if (toggle && replies) {
                    toggle.addEventListener("click", () => {
                        const hidden = replies.style.display === "none";
                        replies.style.display = hidden ? "block" : "none";
                        toggle.innerHTML = (hidden ? "▲ " : "▼ ")
                          + `${comment.replies.length} answer${comment.replies.length>1?'s':''}`;
                    });
                }
            }, 0);
        });
    },
    error: function(err) {
        console.log(err);
    }
});


Sa ovim imam prikaz svih komentar i odgovora na komentaru jako ružnom formatu pa to moram da stilizujem. Kreirati ču CSS fajl comment.css ii uvesti ču ga unutar HTML fala  u kojem prikazujem kometare
{%block css%}
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
<link rel="stylesheet" href="{% static 'css/blog_detail.css' %}">
<link rel="stylesheet" href="{% static 'css/slider.css' %}">
<link rel="stylesheet" href="{% static 'css/comment.css' %}">
{%endblock css%}


A onda unutar css fajla  ču da kreiram stilizaciju
.comment_header {
    display: flex;
    align-items: center;
    gap: 10px; /* razmak između slike i imena */
}
.profile_comment_image{
    width: 30px;
    height: 30px;
    border-radius: 100%;
    
}
.comment_content{
    margin-left: 4%;
}

.toggle_replies {
    font-size: 14px;
    margin-left: 4%;
    margin-top: 5px;
    user-select: none;
}

.replies {
    margin-left: 30px;
    margin-top: 10px;
}


Dodavanje komentara
Da bi dodao komentar moram da kreiram funkciju za dodavanje komentara
# dodavanje komentara bez form polja
def add_comment(request):
    if request.method == 'POST': 
        blog_slug = request.POST.get('blog_slug') # uzimamo slug bloga
        content = request.POST.get('content') # uzimamo sadrzaj
        blog = Blog.objects.get(slug=blog_slug) # uzimamo blog
        comment = Comment(blog=blog, user=request.user, content=content) # kreiramo komentar
        comment.save() # snimamo
        return JsonResponse({'message': 'Comment added successfully'})

nakon toga kreiram url za dodavanje komentara
    path('add_comment/', views.add_comment, name='add_comment'), 

unutar html ču da dodam formu za unos komentara

    <form id="comment-form" method="POST" data-slug="{{ blog.slug }}">
        {% csrf_token %}
        <!-- Vučeš slug iz data-attributa ako hoćeš, ili možeš koristiti hidden field -->
        <input type="hidden" name="blog_slug" value="{{ blog.slug }}">
      
        <!-- Ovo je tvoje polje za unos komentara -->
        <input type="text" name="content" class="form-control add_coment_inp" placeholder="Add a comment..." required/>
      
        <button type="submit" class="btn btn-primary mt-3">Dodaj komentar</button>
      </form>


Unutar js fajla ču da prvo unota u funkciju fetchComment  prikaz kom3entara i tu funkciju ču da pozovem odmah ispod to radim zato da bi prilikom unosa komentara mogao osvježiti prikaz komentara.
function fetchComments() {
    $.ajax({
        type: "GET",
        url: "/comment/comments_list/",
        data: { slug: blogSlug },            // šaljemo slug u GET
        success: function(response) {
            commentsContainer.innerHTML = '<h5>Comments:</h5>';  // resetujemo
            const data = response.data;
            data.forEach(comment => {
                const repliesId = `replies-${comment.id}`;
                const toggleId = `toggle-${comment.id}`;
                let html = `
                    <div class="comment mt-5">
                    <div class="comment_header">
                        <img class="profile_comment_image" src="${comment.profile_image}" alt="">
                        <h5 class="comment_user">${comment.user}</h5>
                    </div>
                    <p class="comment_content">${comment.content}</p>
                `;
                if (comment.replies.length) {
                    html += `
                    <div class="toggle_replies" id="${toggleId}" style="cursor:pointer; color:#007bff">
                        ▼ ${comment.replies.length} answer${comment.replies.length>1?'s':''}
                    </div>
                    <div class="replies" id="${repliesId}" style="display:none">
                    `;
                    comment.replies.forEach(r => {
                        html += `
                        <div class="reply">
                            <div class="comment_header">
                            <img class="profile_comment_image" src="${r.profile_image}" alt="">
                            <h6 class="comment_user">${r.user}</h6>
                            </div>
                            <p class="comment_content">${r.content}</p>
                        </div>
                        `;
                    });
                    html += `</div>`;
                }
                html += `</div>`;
                commentsContainer.innerHTML += html;

                // toggle
                setTimeout(() => {
                    const toggle = document.getElementById(toggleId);
                    const replies = document.getElementById(repliesId);
                    if (toggle && replies) {
                        toggle.addEventListener("click", () => {
                            const hidden = replies.style.display === "none";
                            replies.style.display = hidden ? "block" : "none";
                            toggle.innerHTML = (hidden ? "▲ " : "▼ ")
                            + `${comment.replies.length} answer${comment.replies.length>1?'s':''}`;
                        });
                    }
                }, 0);
            });
        },
        error: function(err) {
            console.log(err);
        }
    });
}

// Pozivanje fetchComments kada stranica učita komentare
fetchComments();

nakon toga ču unutar base fajla da dodam div za prikaz poruke 
    <!-- prikazivanje poruke -->
    <div id="ajax-message-container">
    {% if messages %}
    {% for message in messages %}
    <div class="alert alert-warning alert-dismissible fade show" role="alert">
        {{ message }}
        <button type="button" class="btn-close" data-bs-dismiss="alert" arialabel="Close"></button>
    </div>
    {% endfor %}
    {% endif %}
    </div>
    <!-- Kraj prikazivanja poruka -->



A unutar js ču da  selektujem formu  uzmem csff tokeni selektujem div za prikaz poruke.
const commentForm = document.getElementById("comment-form"); // uzimamo formu
const csrf = document.getElementsByName("csrfmiddlewaretoken");// nuzimam middleware token
const messageContainer = document.getElementById("ajax-message-container");//za prikazivanje poruke koja se nalazi u base fajlu

sada ču ispod prikaza komentara napraviti  ajax post zahtjev za unos komentara ali prvo moram spriječiti da se komentari submituju  prije nego  pritisne button   prevent defaultom  pozovem ajax zahtjev uzmem podatke koji su mi potrebni,  prikažem poruku da je komentar dodat i pozovem fetchComment funkciju da osvježim komentare.
commentForm.addEventListener('submit', function(event) {
    event.preventDefault();  // Sprečavamo da forma submituje i osveži stranicu prije pritiska buttona

    // Napravimo AJAX zahtev
    $.ajax({
        type: "POST",
        url: "/comment/add_comment/",
        //podatci za unios komentara
        data: {
            blog_slug: blogSlug, // uzimamo slug bloga
            content: commentForm.querySelector('input[name="content"]').value, // uzimamo komentar koji sam napisao
            csrfmiddlewaretoken: csrf[0].value  // token
        },
        success: function(response) {
            // Prikazivanje poruke
            messageContainer.innerHTML = `
                <div class="alert alert-success alert-dismissible fade show" role="alert">
                    ${response.message}
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            `;

            // Očisti polje
            commentForm.querySelector('input[name="content"]').value = "";

            // Prikazi komentare ponovo
            fetchComments();
        },
        error: function(err) {
            console.log(err);
        }
    });
});

Sadea mi se komentari unose.
Stilizacija forme
Formu ču da malo preuredim i izmjenim
    {% if user.is_authenticated %}
    <form id="comment-form" method="POST" data-slug="{{ blog.slug }}" class="d-flex align-items-center mt-5 mb-5">
        {% csrf_token %}
    
        <!-- Slika korisnika -->
        <img src="{{ user.profile.profile_image.url }}" class="rounded-circle me-3" alt="User Image" width="45" height="45" />
    
        <!-- Polje za unos komentara i dugme -->
        <div class="flex-grow-1">
            <div class="input-group">
                <input type="text" name="content" class="form-control border-0 border-bottom" placeholder="Add a comment..." required style="border-radius: 0;">
                <button type="submit" class="btn btn-outline-primary ms-2">Add comment</button>
            </div>
        </div>
    </form>
    {% endif %}

A unutar css za komentare dodam stilizaciju
#comment-form input[name="content"]:focus {
    box-shadow: none;
    border-color: #007bff;
}





Dodavanje odgovora na komentar
Unutar viewsa za dodavanje komentara ču da dodam parent_id i ako postoji taj id znali da je odgovor i taj parent dodati u  comment
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

nakon toga ču unutar js u funkciji za prikaz lpmentara dodati formu za unos odgovora na komentar i funkcionalnost na button da mogu prikazati tu formu  
function fetchComments() {
    $.ajax({
        type: "GET",
        url: "/comment/comments_list/",  // Uzimamo komentare sa servera
        data: { slug: blogSlug },        // Slug bloga koji šaljemo da filtriramo komentare
        success: function(response) {
            commentsContainer.innerHTML = '<h5>Comments:</h5>';  // Resetujemo prikaz komentara
            const data = response.data;
            data.forEach(comment => {
                const repliesId = `replies-${comment.id}`;  // ID za odgovore na komentar
                const toggleId = `toggle-${comment.id}`;    // ID za toggle dugme (da prikaže odgovore)
                //html kod za prikaz komentara
                let html = ` 
                    <div class="comment mt-5">
                    <div class="comment_header">
                        <img class="profile_comment_image" src="${comment.profile_image}" alt="">
                        <h5 class="comment_user">${comment.user}</h5>
                    </div>
                    <p class="comment_content">${comment.content}</p>

                    <div class="comment_actions mt-2 ms-5">
                        <button class="btn btn-sm btn-outline-primary me-2 like-btn" data-id="${comment.id}">
                            👍 Like
                        </button>
                        <button class="btn btn-sm btn-outline-secondary reply-toggle-btn" data-id="${comment.id}">
                            💬 Reply
                        </button>
                        
                    </div>
                    <div class="reply-form-container mt-3" id="reply-form-${comment.id}" style="display:none;">
                        <input type="text" class="form-control mb-2 reply-input" placeholder="Write a reply...">
                        <button class="btn btn-sm btn-success submit-reply-btn" data-id="${comment.id}">Post Reply</button>
                    </div>
                `;
                
                // Ako komentar ima odgovore, dodaj ih
                if (comment.replies.length) {
                    html += `
                    <div class="toggle_replies" id="${toggleId}" style="cursor:pointer; color:#007bff">
                        ▼ ${comment.replies.length} answer${comment.replies.length > 1 ? 's' : ''}
                    </div>
                    <div class="replies" id="${repliesId}" style="display:none">
                    `;
                    comment.replies.forEach(r => {
                        html += `
                        <div class="reply">
                            <div class="comment_header">
                            <img class="profile_comment_image" src="${r.profile_image}" alt="">
                            <h6 class="comment_user">${r.user}</h6>
                            </div>
                            <p class="comment_content">${r.content}</p>
                        </div>
                        `;
                    });
                    html += `</div>`;  // Zatvaranje div-a za odgovore
                }
                html += `</div>`;  // Zatvaranje div-a za komentar

                commentsContainer.innerHTML += html;  // Dodajemo generisani HTML u stranicu

                // Dodavanje toggle funkcionalnosti za prikaz odgovora
                setTimeout(() => {
                    const toggle = document.getElementById(toggleId);
                    const replies = document.getElementById(repliesId);
                    if (toggle && replies) {
                        toggle.addEventListener("click", () => {
                            const hidden = replies.style.display === "none";
                            replies.style.display = hidden ? "block" : "none";
                            toggle.innerHTML = (hidden ? "▲ " : "▼ ") + `${comment.replies.length} answer${comment.replies.length > 1 ? 's' : ''}`;
                        });
                    }
                }, 0);  // Malo čekanje da se dodaju event listeneri
            });

            // Dodavanje funkcionalnosti za "Reply" dugme +++++++
            document.querySelectorAll('.reply-toggle-btn').forEach(button => {
                button.addEventListener("click", function(event) {
                    const commentId = button.dataset.id;  // ID komentara na koji se odgovara
                    const replyForm = document.getElementById(`reply-form-${commentId}`);  // Forma za unos odgovora
                    
                    // Toggle (prikazivanje ili skrivanje) forme za odgovor
                    if (replyForm.style.display === "none") {
                        replyForm.style.display = "block";  // Prikazivanje forme
                    } else {
                        replyForm.style.display = "none";  // Sakrivanje forme
                    }
                });
            });
        },
        error: function(err) {
            console.log(err);  // Ako dođe do greške, loguj grešku
        }
    });
}






Nakon toga ču da napravim funkciju koja unosi odgovor na komentar
// dodavanje odgovora na komentar
document.addEventListener("click", function (event) {
    if (event.target && event.target.classList.contains("submit-reply-btn")) {
        const button = event.target;
        const parentId = button.dataset.id;
        const replyInput = document.querySelector(`#reply-form-${parentId} .reply-input`);
        const replyContent = replyInput ? replyInput.value : "";

        $.ajax({
            type: "POST",
            url: "/comment/add_comment/",
            data: {
                blog_slug: blogSlug,  // koristiš globalni slug bloga
                content: replyContent,
                parent_id: parentId, // ovo označava da je odgovor
                csrfmiddlewaretoken: csrf[0].value
            },
            success: function(response) {
                console.log("Odgovor poslan:", response.message);
                replyInput.value = "";  // očisti polje nakon slanja

                // Opcionalno: prikaži poruku
                messageContainer.innerHTML = `
                    <div class="alert alert-success alert-dismissible fade show" role="alert">
                        ${response.message}
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                `;
                // Opcionalno: prikaži poruku kada se doda odgovor na komentar
                sessionStorage.setItem("lastRepliedToId", parentId);

                // Sakrij formu za unos odgovora nakon što je odgovor poslan
                document.getElementById(`reply-form-${parentId}`).style.display = 'none'; 

                //refrešh stranice
                fetchComments();  // ponovo učitaj komentare i odgovore

            },
            error: function(err) {
                console.log("Greška:", err);
            }
        });
    }
});


Da bi odgovor i akomentar bili otvoreni  unutar  prikaza kometara moram dodati slijedeče

function fetchComments() {
    $.ajax({
        type: "GET",
        url: "/comment/comments_list/",  // Uzimamo komentare sa servera
        data: { slug: blogSlug },        // Slug bloga koji šaljemo da filtriramo komentare
        success: function(response) {
            commentsContainer.innerHTML = '<h5>Comments:</h5>';  // Resetujemo prikaz komentara
            const data = response.data;

            const lastRepliedToId = sessionStorage.getItem("lastRepliedToId");  // Uzimamo poslednji odgovor na komentar da bi ostao otvoren replay od unesebog odgovora na komentar

            data.forEach(comment => {
                const repliesId = `replies-${comment.id}`;  // ID za odgovore na komentar
                const toggleId = `toggle-${comment.id}`;    // ID za toggle dugme (da prikaže odgovore)
                //html kod za prikaz komentara
                let html = ` 
                    <div class="comment mt-5">
                    <div class="comment_header">
                        <img class="profile_comment_image" src="${comment.profile_image}" alt="">
                        <h5 class="comment_user">${comment.user}</h5>
                    </div>
                    <p class="comment_content">${comment.content}</p>

                    <div class="comment_actions mt-2 ms-5">
                        <button class="btn btn-sm btn-outline-primary me-2 like-btn" data-id="${comment.id}">
                            👍 Like
                        </button>
                        <button class="btn btn-sm btn-outline-secondary reply-toggle-btn" data-id="${comment.id}">
                            💬 Reply
                        </button>
                        
                    </div>
                    <div class="reply-form-container mt-3" id="reply-form-${comment.id}" style="display:none;">
                        <input type="text" class="form-control mb-2 reply-input" placeholder="Write a reply...">
                        <button class="btn btn-sm btn-success submit-reply-btn" data-id="${comment.id}">Post Reply</button>
                    </div>
                `;
                
                // Ako komentar ima odgovore, dodaj ih
                if (comment.replies.length) {
                    html += `
                    <div class="toggle_replies" id="${toggleId}" style="cursor:pointer; color:#007bff">
                        ▼ ${comment.replies.length} answer${comment.replies.length > 1 ? 's' : ''}
                    </div>
                    <div class="replies" id="${repliesId}" style="display:none">
                    `;
                    comment.replies.forEach(r => {
                        html += `
                        <div class="reply">
                            <div class="comment_header">
                            <img class="profile_comment_image" src="${r.profile_image}" alt="">
                            <h6 class="comment_user">${r.user}</h6>
                            </div>
                            <p class="comment_content">${r.content}</p>
                        </div>
                        `;
                    });
                    html += `</div>`;  // Zatvaranje div-a za odgovore
                }
                html += `</div>`;  // Zatvaranje div-a za komentar

                commentsContainer.innerHTML += html;  // Dodajemo generisani HTML u stranicu

                // Dodavanje toggle funkcionalnosti za prikaz odgovora
                setTimeout(() => {
                    const toggle = document.getElementById(toggleId);
                    const replies = document.getElementById(repliesId);
                    if (toggle && replies) {
                        toggle.addEventListener("click", () => {
                            const hidden = replies.style.display === "none";
                            replies.style.display = hidden ? "block" : "none";
                            toggle.innerHTML = (hidden ? "▲ " : "▼ ") + `${comment.replies.length} answer${comment.replies.length > 1 ? 's' : ''}`;
                        });
                    }

                    //dodavanje funkcionalnosti za prikaz odgovora na komentar kada se doda odgovor
                    if (lastRepliedToId && parseInt(lastRepliedToId) === comment.id) {
                        if (replies) replies.style.display = "block";
                        if (toggle) toggle.innerHTML = "▲ " +
                            `${comment.replies.length} answer${comment.replies.length > 1 ? 's' : ''}`;

                        const replyForm = document.getElementById(`reply-form-${comment.id}`);
                        if (replyForm) replyForm.style.display = "block";

                        sessionStorage.removeItem("lastRepliedToId");  // izbriši nakon prikaza
                    }

                }, 0);  // Malo čekanje da se dodaju event listeneri
            });

            // Dodavanje funkcionalnosti za "Reply" dugme +++++++
            document.querySelectorAll('.reply-toggle-btn').forEach(button => {
                button.addEventListener("click", function(event) {
                    const commentId = button.dataset.id;  // ID komentara na koji se odgovara
                    const replyForm = document.getElementById(`reply-form-${commentId}`);  // Forma za unos odgovora
                    
                    // Toggle (prikazivanje ili skrivanje) forme za odgovor
                    if (replyForm.style.display === "none") {
                        replyForm.style.display = "block";  // Prikazivanje forme
                    } else {
                        replyForm.style.display = "none";  // Sakrivanje forme
                    }
                });
            });
        },
        error: function(err) {
            console.log(err);  // Ako dođe do greške, loguj grešku
        }
    });
}


Pravljenje  menu butona  i  postavljanje gunkcije edit iz menu butona

Unutar prikaza komentara napopraviti ču formu za  editovanje komentaranapraviti ču nmenu button  koji če sadržavati edit i delete
<div class="comment mt-5">
                    <div class="comment_header">
                        <img class="profile_comment_image" src="${comment.profile_image}" alt="">
                        <h5 class="comment_user">${comment.user}</h5>
                    </div>

                    <p class="comment_content">${comment.content}</p>

                    <!-- Edit form -->  
                    <form class="edit-comment-form" id="edit-comment-${comment.id}" style="display: none;">
                    <input type="text" class="form-control edit-comment-input" id="edit-comment-input-${comment.id}" value="${comment.content}">
                    <button class="btn btn-sm btn-outline-primary save-edit-btn" data-id="${comment.id}">
                        Save
                    </button>
                    <button class="btn btn-sm btn-outline-secondary cancel-edit-btn">
                        Cancel
                    </button>
                    </form>

                    <!--menu button-->
                    <div class="btn-group">
                    <button style="border-radius: 100%;" type="button" class="menu-btn ms-3 btn btn-outline-secondary " data-bs-toggle="dropdown" aria-expanded="false">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
                        </svg>
                    </button>
                    <ul class="dropdown-menu">
                        <li>
                    <button class="dropdown-item btn btn-link edit-btn" data-target="#edit-comment-${comment.id}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                        <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                    </svg>
                    Edit
                    </button>
                        </li>
                        <li><a class="dropdown-item" href="#">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                        <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                        </svg>
                        Delete</a></li>
                    </ul>
                    </div>
            
               
                    <div class="comment_actions mt-2 ms-5">
                        <button class="btn btn-sm btn-outline-primary me-2 like-btn" data-id="${comment.id}">
                            👍 Like
                        </button>
                        <button class="btn btn-sm btn-outline-secondary reply-toggle-btn" data-id="${comment.id}">
                            💬 Reply
                        </button>
                        
                    </div>
                    <div class="reply-form-container mt-3" id="reply-form-${comment.id}" style="display:none;">
                        <div class="input-group">
                            <input type="text" class="ms-5 form-control reply-input" placeholder="Write a reply...">
                            <button class="ms-2 btn btn-sm  btn-outline-primary submit-reply-btn" data-id="${comment.id}">Post Reply</button>
                        </div>
                    </div>
                </div>

Sada ču unutar js na samom dnu  priakzati i sakriti formu  za editovanje
// 1) Otvori formu na klik “Edit”
commentsContainer.addEventListener('click', e => {
    const btn = e.target.closest('.edit-btn');
    if (!btn) return;
  
    e.preventDefault();
    const form = document.querySelector(btn.dataset.target);
    const p    = form.previousElementSibling;
    const menu = btn.closest('.btn-group'); // meni koji treba sakriti
  
    // Sakrij paragraf i meni, prikaži formu
    p.style.display    = 'none';
    form.style.display = 'block';
    if (menu) menu.style.display = 'none';
  });
  
  // 2) Sakrij formu na klik “Cancel”
  commentsContainer.addEventListener('click', e => {
    if (!e.target.matches('.cancel-edit-btn')) return;
  
    e.preventDefault();
    const form = e.target.closest('form.edit-comment-form');
    const p    = form.previousElementSibling;
    const menu = form.nextElementSibling; // meni je odmah ispod forme
  
    // Sakrij formu, prikaži paragraf i meni
    form.style.display = 'none';
    if (p) p.style.removeProperty('display');
    if (menu) menu.style.removeProperty('display');
  });
  




Kreirianje views logike za spremanje update teksta
def edit_comment(request):
    if request.method == 'POST':
        comment_id = request.POST.get('comment_id')
        content = request.POST.get('content')
        comment = Comment.objects.get(id=comment_id)
        comment.content = content
        comment.save()
        return JsonResponse({'message': 'Comment updated successfully'})

kreirati ču urls
 path('edit_comment/', views.edit_comment, name='edit_comment'),  # url za editovanje komentara

a unutar js koda ču krierati ajax poziv za update 
commentsContainer.addEventListener('click', async (e) => {
    const saveBtn = e.target.closest('.save-edit-btn');
    if (!saveBtn) return;

    e.preventDefault();

    const commentId = saveBtn.dataset.id;
    const form = document.querySelector(`#edit-comment-${commentId}`);
    const textarea = form.querySelector('.edit-comment-input');
    const newContent = textarea.value.trim();

    if (!newContent) return;

    try {
        await fetch('/comment/edit_comment/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrf[0].value,  // koristiš prvi pronađeni token
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                comment_id: commentId,
                content: newContent
            })
        });

        // Ažuriraj prikaz komentara
        const contentParagraph = form.previousElementSibling;
        contentParagraph.textContent = newContent;

        // Sakrij formu i prikaži paragraf + meni (ako postoji)
        form.style.display = 'none';
        contentParagraph.style.display = 'block';

        const menu = saveBtn.closest('.btn-group');
        if (menu) menu.style.display = 'inline-block';
    } catch (error) {
        console.error('Greška prilikom slanja komentara:', error);
    }
});

Brisanje komentara
U viewsu ču da uradim slijedeče
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

krierati ču urls
    path('delete_comment/', views.delete_comment, name='delete_comment'),  # url za brisanje komentara

u js ču da krieram ajax za brisanje komentarra
// brisanje komentara
commentsContainer.addEventListener('click', async e => {
    const deleteBtn = e.target.closest('.delete-comment-btn');

    if (!deleteBtn) return;
    
    const commentId = deleteBtn.dataset.id;
    
    if (!commentId) return;

    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
        const response = await fetch('/comment/delete_comment/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrf[0].value,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                comment_id: commentId
            })
        });

        if (response.ok) {
            const commentDiv = deleteBtn.closest('.comment');
            if (commentDiv) commentDiv.remove();
        }

        fetchComments();

    } catch (error) {
        // opcionalno: možeš prikazati grešku korisniku alertom ako želiš
    }
});

pošto sam imao problem sa menu listom za priakz padajuče liste odgovra na  komentar izmjenuo sam fetch coments da izgleda ovako
function fetchComments() {
    $.ajax({
      type: "GET",
      url: "/comment/comments_list/",
      data: { slug: blogSlug },
      success: function(response) {
        // Reset komentara
        commentsContainer.innerHTML = '<h5>Comments:</h5>';
        const data = response.data;
        const lastRepliedToId = sessionStorage.getItem("lastRepliedToId");
  
        // Generišemo sav HTML za svaki komentar i odgovore
        data.forEach(comment => {
          const repliesId = `replies-${comment.id}`;
          const toggleId = `toggle-${comment.id}`;
  
          // Generišemo HTML za odgovore
          let repliesHtml = "";
          if (comment.replies.length) {
            comment.replies.forEach(r => {
              repliesHtml += `
                <div class="reply">
                  <div class="comment_header">
                    <img class="profile_comment_image" src="${r.profile_image}" alt="">
                    <h6 class="comment_user">${r.user}</h6>
                  </div>

                  <p class="comment_content">${r.content}</p>

                  <form class="edit-comment-form" id="edit-comment-${r.id}" style="display:none;">
                    <textarea class="ms-5 form-control edit-comment-input" id="edit-comment-input-${r.id}">${r.content}</textarea>
                    <div class="edit_btn mt-2">
                      <button class="btn btn-sm btn-outline-primary save-edit-btn" data-id="${r.id}">Save</button>
                      <button class="btn btn-sm btn-outline-secondary cancel-edit-btn">Cancel</button>
                    </div>
                  </form>

                  <div class="btn-group">
                    <button style="border-radius: 100%;" type="button" class="menu-btn ms-3 btn btn-outline-secondary" data-bs-toggle="dropdown">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
                    </svg>
                    </button>
                    <ul class="dropdown-menu">
                      <li>
                        <button class="dropdown-item edit-btn" data-target="#edit-comment-${r.id}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                            </svg>
                            Edit
                        </button>
                      </li>
                      <li>
                        <button class="dropdown-item delete-comment-btn" data-id="${r.id}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash2" viewBox="0 0 16 16">
                            <path d="M14 3a.7.7 0 0 1-.037.225l-1.684 10.104A2 2 0 0 1 10.305 15H5.694a2 2 0 0 1-1.973-1.671L2.037 3.225A.7.7 0 0 1 2 3c0-1.105 2.686-2 6-2s6 .895 6 2M3.215 4.207l1.493 8.957a1 1 0 0 0 .986.836h4.612a1 1 0 0 0 .986-.836l1.493-8.957C11.69 4.689 9.954 5 8 5s-3.69-.311-4.785-.793"/>
                            </svg>
                            Delete
                        </button>
                      </li>
                    </ul>
                  </div>
                  <div class="comment_actions mt-2">
                    <button class="btn btn-sm btn-outline-primary like-btn" data-id="${r.id}">👍 Like</button>
                  </div>
                </div>
              `;
            });
          }
  
          // Celokupan HTML jednog komentara
          let html = `
            <div class="comment mt-5" id="comment-${comment.id}">
              <div class="comment_header">
                <img class="profile_comment_image" src="${comment.profile_image}" alt="">
                <h5 class="comment_user">${comment.user}</h5>
              </div>
              <p class="comment_content">${comment.content}</p>
  
              <form class="edit-comment-form" id="edit-comment-${comment.id}" style="display:none;">
                <textarea class="ms-5 form-control edit-comment-input" id="edit-comment-input-${comment.id}">${comment.content}</textarea>
                <div class="edit_btn mt-2">
                  <button class="btn btn-sm btn-outline-primary save-edit-btn" data-id="${comment.id}">Save</button>
                  <button class="btn btn-sm btn-outline-secondary cancel-edit-btn">Cancel</button>
                </div>
              </form>
  
              <div class="btn-group">
                <button style="border-radius: 100%;" type="button" class="menu-btn ms-3 btn btn-outline-secondary" data-bs-toggle="dropdown">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
                </svg>
                    </button>
                    <ul class="dropdown-menu">
                    <li>
                    <button class="dropdown-item edit-btn" data-target="#edit-comment-${comment.id}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                    <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                    </svg>
                    Edit
                    </button>
                  </li>
                  <li>
                    <button class="dropdown-item delete-comment-btn" data-id="${comment.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash2" viewBox="0 0 16 16">
                        <path d="M14 3a.7.7 0 0 1-.037.225l-1.684 10.104A2 2 0 0 1 10.305 15H5.694a2 2 0 0 1-1.973-1.671L2.037 3.225A.7.7 0 0 1 2 3c0-1.105 2.686-2 6-2s6 .895 6 2M3.215 4.207l1.493 8.957a1 1 0 0 0 .986.836h4.612a1 1 0 0 0 .986-.836l1.493-8.957C11.69 4.689 9.954 5 8 5s-3.69-.311-4.785-.793"/>
                        </svg>
                        Delete
                    </button>
                  </li>
                </ul>
              </div>
  
              <div class="comment_actions mt-2 ms-5">
                <button class="btn btn-sm btn-outline-primary like-btn" data-id="${comment.id}">👍 Like</button>
                <button class="btn btn-sm btn-outline-secondary reply-toggle-btn" data-id="${comment.id}">💬 Reply</button>
              </div>
  
              <div class="reply-form-container mt-3" id="reply-form-${comment.id}" style="display:none;">
                <div class="input-group">
                  <input type="text" class="ms-5 form-control reply-input" placeholder="Write a reply...">
                  <button class="ms-2 btn btn-sm btn-outline-primary submit-reply-btn" data-id="${comment.id}">Post Reply</button>
                </div>
              </div>
            </div>
  
            <div class="toggle_replies" id="${toggleId}" style="cursor:pointer; color:#007bff">
              ▼ ${comment.replies.length} answer${comment.replies.length === 1 ? '' : 's'}
            </div>
            <div class="replies" id="${repliesId}" style="display:none;">
              ${repliesHtml}
            </div>
          `;
  
          // Dodajemo u container
          commentsContainer.innerHTML += html;
  
          // Ako je odgovor dodat ranije, prikaži ga
          if (lastRepliedToId && parseInt(lastRepliedToId) === comment.id) {
            const repliesDiv = document.getElementById(repliesId);
            const toggleBtn = document.getElementById(toggleId);
            repliesDiv.style.display = 'block';
            toggleBtn.innerHTML = '▲ ' + `${comment.replies.length} answer${comment.replies.length === 1 ? '' : 's'}`;
            document.getElementById(`reply-form-${comment.id}`).style.display = 'block';
            sessionStorage.removeItem("lastRepliedToId");
          }
        });
  
        // Dodavanje listenera za sve toggles i dugmad
        document.querySelectorAll('.toggle_replies').forEach(btn => {
          btn.addEventListener('click', () => {
            const id = btn.id.split('-')[1];
            const repliesDiv = document.getElementById(`replies-${id}`);
            const hidden = repliesDiv.style.display === 'none';
            repliesDiv.style.display = hidden ? 'block' : 'none';
            btn.innerHTML = (hidden ? '▲ ' : '▼ ') + `${repliesDiv.children.length} answer${repliesDiv.children.length === 1 ? '' : 's'}`;
          });
        });
  
        document.querySelectorAll('.menu-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const menu = btn.nextElementSibling;
            menu.classList.toggle('show');
          });
        });
  
        document.querySelectorAll('.reply-toggle-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            const form = document.getElementById(`reply-form-${id}`);
            form.style.display = form.style.display === 'none' ? 'block' : 'none';
          });
        });
  
        // Ostatak listenera (save, cancel, delete, submit reply) zadrži kako imaš.
      },
      error: function(err) {
        console.error(err);
      }
    });
  }
  
  // Početni poziv
  fetchComments();


lajkovi
opis i način lajkanja
Lajkovi se spremaju u bazu podataka u tablicu "likes_like". Ovdje je kako to funkcionira:
Kad korisnik lajka blog post, stvorit će se novi zapis u tablici "likes_like" s:
ID korisnika koji je lajkao (user_id)
ID bloga koji je lajkan (blog_id)
null vrijednost za comment_id
vremenskom oznakom kada je lajk kreiran (created_at)
Kad korisnik lajka komentar, stvorit će se novi zapis u tablici "likes_like" s:
ID korisnika koji je lajkao (user_id)
ID komentara koji je lajkan (comment_id)
null vrijednost za blog_id
vremenskom oznakom kada je lajk kreiran (created_at)
Ograničenja (constraints) u vašem modelu osiguravaju da:
Korisnik može lajkati specifični blog samo jednom
Korisnik može lajkati specifični komentar samo jednom
Svaki lajk mora biti povezan ili s blogom ili s komentarom, ali ne s oba

Ovo je model
from django.db import models
from django.conf import settings
from blog.models import Blog
from comment.models import Comment
class Like(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='likes', help_text="Korisnik koji je lajkao")

    # Opcionalne reference - samo jedna će biti korištena za svaki lajk
    blog = models.ForeignKey(Blog,on_delete=models.CASCADE, null=True, blank=True, related_name='likes', help_text="Blog koji je lajkan")
    
    comment = models.ForeignKey(Comment, 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True,
        related_name='likes',
        help_text="Komentar koji je lajkan"
    )
    
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Vrijeme kada je lajk kreiran"
    )
    
    class Meta:
        # Osigurava da korisnik može lajkati objekt samo jednom
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'blog'],
                condition=models.Q(blog__isnull=False),
                name='unique_user_blog_like'
            ),
            models.UniqueConstraint(
                fields=['user', 'comment'],
                condition=models.Q(comment__isnull=False),
                name='unique_user_comment_like'
            ),
            # Osigurava da je točno jedno polje (blog ili comment) postavljeno
            models.CheckConstraint(
                check=(
                    (models.Q(blog__isnull=False) & models.Q(comment__isnull=True)) |
                    (models.Q(blog__isnull=True) & models.Q(comment__isnull=False))
                ),
                name='like_exactly_one_object'
            ),
        ]
        verbose_name = "Lajk"
        verbose_name_plural = "Lajkovi"
    
    def __str__(self):
        if self.blog:
            return f"{self.user.username} lajkao blog: {self.blog.title}"
        elif self.comment:
            return f"{self.user.username} lajkao komentar na blogu: {self.comment.blog.title}"
        return f"Lajk od {self.user.username}"

nakon toga ču te lajkove da proslijedim u admin panel dodam lajk  preko admin panela  
from django.contrib import admin
from .models import Like
# Register your models here.
admin.site.register(Like)

i prikažem  lajk unutar svog posta u home templatesu gdje se vide svi postovi  u blog aplikaciji
          <table>
            <tr>
              <td><i class="fa fa-eye fa-2x"></i></td>
              <td><i class="fa fa-heart-o fa-2x"></i></td>
              <td><i class="fa fa-envelope-o fa-2x"></i></td>
              <td><i class="fa fa-comments-o fa-2x"></i></td>
            </tr>
            <tr>
              <td>20</td>
              <td>{{ blog.likes.count }}</td>
              <td>20</td>
              <td>20</td>
            </tr>
          </table>







Lajk bloga
Nakon toga ču da kreiram views za dodavanje lajkova  pa ču unutar aplikacije likes u viewsu napraviti kontroler za dodavanje lajkova na post preko ajaxa
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

nakon toga ču da uradim urls
from django.urls import path
from .import views

app_name = 'likes' # Definišemo ime aplikacije kako bismo izbegli konflikte sa drugim aplikacijama

urlpatterns = [
    path('blog/<int:blog_id>/', views.like_blog, name='like_blog'),
]




A onda ču unutar voews blog aplikacije u kontorleru za prikaz detalja bloga da dodam uslov koji če mi prikazivati  cerveno srce ako je korisnik lajkovao taj blog
@login_required
def blog_detail(request, pk):
    blog = Blog.objects.get(pk=pk)  
        
    # provjera da li je post lajkovan
    is_liked = False
    if request.user.is_authenticated:
        is_liked = Like.objects.filter(user=request.user, blog=blog).exists()
    
    context = {
        'blog': blog,
        'is_liked': is_liked, # da li je post lajkovan
    }
    return render(request, 'blog/blog_detail.html', context)


a onda ču u templatesu blog_detail u tabeli za prikaz lajkova da krieram  button i uslov za lakjanje i uklanjanje lajka kao i prikaz  broja lajkova
               <table>
                    <tr>
                        <td><i class="fa fa-eye fa-2x"></i></td>
                        <td>
                            {% if user.is_authenticated %}
                                <span id="like-button" data-blog-id="{{ blog.id }}" style="cursor: pointer;">
                                    {% if is_liked %}
                                        <i id="heart-icon" class="fa fa-heart fa-2x" style="color: red;"></i>
                                    {% else %}
                                        <i id="heart-icon" class="fa fa-heart-o fa-2x"></i>
                                    {% endif %}
                                </span>
                            {% else %}
                                <i class="fa fa-heart-o fa-2x"></i>
                            {% endif %}
                        </td>
                        <td><i class="fa fa-envelope-o fa-2x"></i></td>
                        <td><i class="fa fa-comments-o fa-2x"></i></td>
                    </tr>
                    <tr>
                        <td>20</td>
                        <td id="like-count">{{ blog.likes.count }}</td>
                        <td>20</td>
                        <td>20</td>
                        {% if user.is_authenticated and blog.author == user%}
                        <td class="p-0 m-0" style="width: 100px;"><a href="{% url 'edit_post' blog.pk %}" class="btn btn-outline-primary btn-lg p-0 m-0" style="width: 100%;" >Edit</a></td>
                        <td class="p-0 m-0" style="width: 100px;"><btn id="delete" data-id="{{ blog.pk }}"  class="btn btn-outline-danger btn-lg p-0 m-0  ms-2" style="width: 100%;">Delete</btn></td>
                        {% endif %} 
                    </tr>
                </table>

A onda ču da kreiram globalni js likes.js u static fajlu projekta i js folderu tog stastic fajla
document.addEventListener('DOMContentLoaded', function() {
    // Dohvaćanje elemenata
    const likeButton = document.getElementById('like-button');
    const heartIcon = document.getElementById('heart-icon');
    const likeCount = document.getElementById('like-count');
    
    // Funkcija za dohvaćanje CSRF tokena iz kolačića
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                // Traži kolačić koji počinje s traženim imenom
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    
    // Provjera postoji li gumb za lajkove (korisnik je prijavljen)
    if (likeButton) {
        likeButton.addEventListener('click', function() {
            // Dohvaćanje ID-a bloga iz data atributa
            const blogId = this.dataset.blogId;
            
            // Dohvaćanje CSRF tokena
            const csrftoken = getCookie('csrftoken');
            
            // Slanje AJAX zahtjeva - ispravljeni URL (s dodatnim 's' u "likes")
            fetch(`/likes/blog/${blogId}/`, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': csrftoken,
                    'Content-Type': 'application/json'
                },
                credentials: 'same-origin'
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                // Ažuriranje broja lajkova
                likeCount.textContent = data.like_count;
                
                // Promjena izgleda srca ovisno o statusu
                if (data.status === 'liked') {
                    heartIcon.className = 'fa fa-heart fa-2x';
                    heartIcon.style.color = 'red';
                } else {
                    heartIcon.className = 'fa fa-heart-o fa-2x';
                    heartIcon.style.color = '';
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });
    }
});

Ova js  ču da pozovem unutar blog_detail templatesa unutar script bloka
<!-- blok za JS static fajlova -->
{% block scripts %}
<script src="{% static 'js/slider.js' %}"></script>
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<script src="{% static 'js/alert.js' %}"></script>
<script src="{% static 'js/comment.js' %}"></script>
<script src="{% static 'js/likes.js' %}"></script>
{% endblock scripts %}

Lajk  komentara
Prvo ču da lajkam komentar unutar admin panela a onda ču da ga prikažem unutar js koda koji je krieran za komenare

unutar html gdje imamo odgovore na komentarea i buuton koji izvršava lajk unutar  sdovore na komentara i unutar komentara ču da prikažem i broj lajkova 
                <!-- prikaz lajkova odgovora na komentar-->
                <div class="comment_actions mt-2">
                    <button class="btn btn-sm btn-outline-primary like-btn" data-id="${r.id}">👍 Like ${r.like_count || 0}</button>
                  </div>
                </div>

<button class="btn btn-sm btn-outline-primary like-btn" data-id="${comment.id}">👍 Like ${comment.like_count || 0}</button>

A unutar viewsa koji prikazuje sve komentare ču da prikažem   lajkove
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

        # Dodavanje broja lajkova za komentar
        comment.likes_count = Like.objects.filter(comment=comment).count()
        comment.is_liked = request.user.is_authenticated and Like.objects.filter(user=request.user, comment=comment).exists()

        try:
            profile_image_url = comment.user.profile.profile_image.url
        except Exception:
            profile_image_url = ''
            
        replies_data = []
        # Jedna petlja za odgovore - dohvaćanje i formatiranje odgovora
        for reply in comment.replies.all().select_related('user', 'user__profile'):

            # Dodavanje broja lajkova za odgovor
            reply.likes_count = Like.objects.filter(comment=reply).count()
            reply.is_liked = request.user.is_authenticated and Like.objects.filter(user=request.user, comment=reply).exists()

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

                # prikaz lajkova odgovora na komentar
                'like_count': reply.likes_count,
                'is_liked': reply.is_liked,
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
            
            # prikaz lajkova komentara
            'like_count': comment.likes_count,
            'is_liked': comment.is_liked,
        })
    return JsonResponse({'data': data})


Unutar viewsa ču da kreiram kontrolor za likovanje komentara

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

a onda ču da kreiram url 
from django.urls import path
from .import views
app_name = 'likes' # Definišemo ime aplikacije kako bismo izbegli konflikte sa drugim aplikacijama

urlpatterns = [
    path('blog/<int:blog_id>/', views.like_blog, name='like_blog'),
    path('comment/<int:comment_id>/', views.like_comment, name='like_comment'),
]
A nakon toga ču da kreiram  funkciju koja če da vrši spremanje lajkova unutar comment .js fajla 
// lajkovanje komentara
function setupLikeButtons() {
  document.querySelectorAll('.like-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const commentId = this.dataset.id;
      
      // AJAX poziv za lajkanje/unlike komentara
      $.ajax({
        type: "POST",
        url: `/likes/comment/${commentId}/`,
        data: {
          csrfmiddlewaretoken: csrf[0].value
        },
        success: (response) => {
          // Ažuriraj broj lajkova u dugmetu
          this.innerHTML = `👍 Like ${response.like_count || 0}`;
          
          // Dodaj/ukloni klasu za vizualni feedback
          if (response.status === 'liked') {
            this.classList.add('liked');
          } else {
            this.classList.remove('liked');
          }
        },
        error: (error) => {
          console.error('Error:', error);
          
          // Opciono - prikaži poruku o grešci
          messageContainer.innerHTML = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                Error liking comment. Please try again.
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
          `;
        }
      });
    });
  });
}

A ovu funkciju ču da pozovem unutar fetch comment funkcije za prikaz svih komentara jer se tamo nalaze buttoni za lajkanje komentara


function fetchComments() {

    $.ajax({
      type: "GET",
      url: "/comment/comments_list/",
      data: { slug: blogSlug },
      success: function(response) {

        // Reset komentara
        commentsContainer.innerHTML = '<h5>Comments:</h5>';
        const data = response.data;
        const lastRepliedToId = sessionStorage.getItem("lastRepliedToId");

  
        // Generišemo sav HTML za svaki komentar i odgovore
        data.forEach(comment => {
          const repliesId = `replies-${comment.id}`;
          const toggleId = `toggle-${comment.id}`;

          // Generišemo HTML za odgovore
          let repliesHtml = "";
          if (comment.replies.length) {
            comment.replies.forEach(r => {
              repliesHtml += `
                <div class="reply">
                  <div class="comment_header">
                    <img class="profile_comment_image" src="${r.profile_image}" alt="">
                    <h6 class="comment_user">${r.user}</h6>
                  </div>

                  <p class="comment_content">${r.content}</p>

                  <form class="edit-comment-form" id="edit-comment-${r.id}" style="display:none;">
                    <textarea class="ms-5 form-control edit-comment-input" id="edit-comment-input-${r.id}">${r.content}</textarea>
                    <div class="edit_btn mt-2">
                      <button class="btn btn-sm btn-outline-primary save-edit-btn" data-id="${r.id}">Save</button>
                      <button class="btn btn-sm btn-outline-secondary cancel-edit-btn">Cancel</button>
                    </div>
                  </form>

                ${r.can_edit || r.can_delete ? 
                ` 
                <div class="btn-group">
                    <button style="border-radius: 100%;" type="button" class=" ms-3 btn btn-outline-secondary" data-bs-toggle="dropdown">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
                    </svg>
                    </button>
                    <ul class="dropdown-menu">
                      <li>
                        <button class="dropdown-item edit-btn" data-target="#edit-comment-${r.id}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                            </svg>
                            Edit
                        </button>
                      </li>
                      <li>
                        <button class="dropdown-item delete-comment-btn" data-id="${r.id}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash2" viewBox="0 0 16 16">
                            <path d="M14 3a.7.7 0 0 1-.037.225l-1.684 10.104A2 2 0 0 1 10.305 15H5.694a2 2 0 0 1-1.973-1.671L2.037 3.225A.7.7 0 0 1 2 3c0-1.105 2.686-2 6-2s6 .895 6 2M3.215 4.207l1.493 8.957a1 1 0 0 0 .986.836h4.612a1 1 0 0 0 .986-.836l1.493-8.957C11.69 4.689 9.954 5 8 5s-3.69-.311-4.785-.793"/>
                            </svg>
                            Delete
                        </button>
                      </li>
                    </ul>
                  </div>
                  ` : ''
                }
                
                <!-- prikaz lajkova odgovora na komentar-->
                <div class="comment_actions mt-2">
                    <button class="btn btn-sm btn-outline-primary like-btn" data-id="${r.id}">👍 Like ${r.like_count || 0}</button>
                  </div>
                </div>

              `;
            });
          }
  
          // Celokupan HTML jednog komentara
          let html = `
            <div class="comment mt-5" id="comment-${comment.id}">
              <div class="comment_header">
                <img class="profile_comment_image" src="${comment.profile_image}" alt="">
                <h5 class="comment_user">${comment.user}</h5>
              </div>
              <p class="comment_content">${comment.content}</p>
  
              <form class="edit-comment-form" id="edit-comment-${comment.id}" style="display:none;">
                <textarea class="ms-5 form-control edit-comment-input" id="edit-comment-input-${comment.id}">${comment.content}</textarea>
                <div class="edit_btn mt-2">
                  <button class="btn btn-sm btn-outline-primary save-edit-btn" data-id="${comment.id}">Save</button>
                  <button class="btn btn-sm btn-outline-secondary cancel-edit-btn">Cancel</button>
                </div>
              </form>

  
            ${comment.can_edit || comment.can_delete ? 
            `
            <div class="btn-group">
                
                <button type="button" style="border-radius: 100%;" class="btn btn-outline-secondary ms-2" data-bs-toggle="dropdown" >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
                </svg>
                    </button>
                    <ul class="dropdown-menu">
                    <li>
                    <button class="dropdown-item edit-btn" data-target="#edit-comment-${comment.id}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                    <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                    </svg>
                    Edit
                    </button>
                  </li>
                  <li>
                    <button class="dropdown-item delete-comment-btn" data-id="${comment.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash2" viewBox="0 0 16 16">
                        <path d="M14 3a.7.7 0 0 1-.037.225l-1.684 10.104A2 2 0 0 1 10.305 15H5.694a2 2 0 0 1-1.973-1.671L2.037 3.225A.7.7 0 0 1 2 3c0-1.105 2.686-2 6-2s6 .895 6 2M3.215 4.207l1.493 8.957a1 1 0 0 0 .986.836h4.612a1 1 0 0 0 .986-.836l1.493-8.957C11.69 4.689 9.954 5 8 5s-3.69-.311-4.785-.793"/>
                        </svg>
                        Delete
                    </button>
                  </li>
                </ul>
              </div>
              
              ` : ''}

  
              <div class="comment_actions mt-2 ms-5">

               <button class="btn btn-sm btn-outline-primary like-btn" data-id="${comment.id}">👍 Like ${comment.like_count || 0}</button>

                <button class="btn btn-sm btn-outline-secondary reply-toggle-btn" data-id="${comment.id}">💬 Reply</button>
              </div>
  
              <div class="reply-form-container mt-3" id="reply-form-${comment.id}" style="display:none;">
                <div class="input-group">
                  <input type="text" class="ms-5 form-control reply-input" placeholder="Write a reply...">
                  <button class="ms-2 btn btn-sm btn-outline-primary submit-reply-btn" data-id="${comment.id}">Post Reply</button>
                </div>
              </div>
            </div>
  
            <div class="toggle_replies" id="${toggleId}" style="cursor:pointer; color:#007bff">
              ▼ ${comment.replies.length} answer${comment.replies.length === 1 ? '' : 's'}
            </div>
            <div class="replies" id="${repliesId}" style="display:none;">
              ${repliesHtml}
            </div>
          `;
  
          // Dodajemo u container
          commentsContainer.innerHTML += html;
  
          // Ako je odgovor dodat ranije, prikaži ga
          if (lastRepliedToId && parseInt(lastRepliedToId) === comment.id) {
            const repliesDiv = document.getElementById(repliesId);
            const toggleBtn = document.getElementById(toggleId);
            repliesDiv.style.display = 'block';
            toggleBtn.innerHTML = '▲ ' + `${comment.replies.length} answer${comment.replies.length === 1 ? '' : 's'}`;
            document.getElementById(`reply-form-${comment.id}`).style.display = 'block';
            sessionStorage.removeItem("lastRepliedToId");
          }
        });
  
        // Dodavanje listenera za sve toggles i dugmad
        document.querySelectorAll('.toggle_replies').forEach(btn => {
          btn.addEventListener('click', () => {
            const id = btn.id.split('-')[1];
            const repliesDiv = document.getElementById(`replies-${id}`);
            const hidden = repliesDiv.style.display === 'none';
            repliesDiv.style.display = hidden ? 'block' : 'none';
            btn.innerHTML = (hidden ? '▲ ' : '▼ ') + `${repliesDiv.children.length} answer${repliesDiv.children.length === 1 ? '' : 's'}`;
          });
        });
  
        document.querySelectorAll('.menu-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const menu = btn.nextElementSibling;
            menu.classList.toggle('show');
          });
        });
  
        document.querySelectorAll('.reply-toggle-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            const form = document.getElementById(`reply-form-${id}`);
            form.style.display = form.style.display === 'none' ? 'block' : 'none';
          });
        });

        // Postavljanje listenera za lajkove
        setupLikeButtons();
  
        // Ostatak listenera (save, cancel, delete, submit reply) zadrži kako imaš.
      },
      error: function(err) {
        console.error(err);
      }
    });
  }

I sa samom ovim mogu da lajkam komentre i odgovore na komentare
Prikaz broja komentara
To ču da uradim unutar home i blog_detail stranice  samo da dodam ovaj dio koda

<td>{{ blog.comments.count }}</td>

Prikaz broje pregleda
Među polja modela dodati ču views polje koje če da sprema broj pregleda
class Blog(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='blogs') # author bloga
    title = models.CharField(max_length=255) #naslov bloga
    slug = models.SlugField(unique=True, blank=True) # slug bloga koji če da sadrži  naziv aplikacij ei id bloga
    content = HTMLField() # sadrzaj bloga
    views = models.PositiveIntegerField(default=0)  # Broj pregleda bloga
    created_at = models.DateTimeField(auto_now_add=True) # kada je  blog kreiran
    updated_at = models.DateTimeField(auto_now=True) # kada je blog azuriran
    is_published = models.BooleanField(default=True) # da li je blog objavljivan
    is_public = models.BooleanField(default=True)  # Da li je blog javni ili privatni

a unutar viewsa bloga u kontroler za detalje bloga ču da dodam brojač pregleda

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


a unutar templatesa za broj pregleda ču da dodam 
 <td>{{ blog.views }}</td>


