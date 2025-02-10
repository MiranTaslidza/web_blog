from email.message import EmailMessage
from django.shortcuts import render, redirect
from .models import Profile
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from .forms import UserRegisterForm
import uuid
from django.contrib.auth.tokens import default_token_generator
from django.contrib.sites.shortcuts import get_current_site
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth.models import User
from django.utils.timezone import now
from datetime import timedelta
from django.core.mail import EmailMultiAlternatives



# prikaz profila korisnika
def wiew_profile(request, pk):
    profile = Profile.objects.get(pk=pk)
    return render(request, 'profiles/profile.html', {'profile': profile})

#login
def login_user(request):
    if request.method == 'POST':
        identifier = request.POST.get('username')  # Može biti i email i username
        password = request.POST.get('password')

        if not identifier or not password:
            messages.error(request, 'Both username/email and password are required')
            return redirect('login')

        # Provera da li je korisnik uneo email ili username
        user = None
        if '@' in identifier:  
            try:
                user_obj = User.objects.get(email=identifier)
                user = authenticate(request, username=user_obj.username, password=password)
            except User.DoesNotExist:
                user = None
        else:
            user = authenticate(request, username=identifier, password=password)

        if user is not None:
            login(request, user)
            next_url = request.GET.get('next', 'home')
            messages.success(request, 'Login Successful')
            return redirect(next_url)
        else:
            messages.error(request, 'Invalid login credentials')
            return redirect('login')
            
    return render(request, 'profiles/login.html')

#logtout 
def logout_user(request):
    if request.user.is_authenticated:
        logout(request)
        messages.success(request, 'You are now logged out')
    else:
        messages.error(request, 'You are not logged in')
    return redirect('home')






#funkcija za salnje emaila
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


