from django import forms
from django.contrib.auth.forms import UserCreationForm #uvozim formu za registraciju
from django.contrib.auth.models import User #uvozim model User koji je kreiran po defaultu
from .models import Profile #uvozim model Profile koji sam kreirao


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


#update profile
class ProfileUpdateForm(forms.ModelForm):
    #dodajem polja koja nisu dio Profile modela a postoje u User modelu
    first_name = forms.CharField(max_length=150, required=True, label="First name", widget=forms.TextInput(attrs={'placeholder': 'First name', 'class': 'inp_style'}))
    last_name = forms.CharField(max_length=150, required=True, label="Last name", widget=forms.TextInput(attrs={'placeholder':'Last name', 'class': 'inp_style'}))
    bio = forms.CharField(widget=forms.Textarea(attrs={'class': 'form-control', 'id': 'bio', 'rows': 4, 'placeholder': 'Enter your bio'}))
    profile_image = forms.ImageField(widget=forms.FileInput(attrs={'class': 'profile_style'}))
    date_of_birth = forms.DateField(widget=forms.DateInput(attrs={'class': 'size', 'type': 'date'}))


    class Meta:
        model = Profile
        fields = ['profile_image', 'bio','date_of_birth']  # Polja iz Profile modela

    def __init__(self, *args, **kwargs):
        user = kwargs.pop('user', None)  # Očekujemo da nam views.py pošalje user objekat.
        super().__init__(*args, **kwargs)  # Pokrećemo osnovnu ModelForm logiku.
        #Ako user postoji, postavljamo first_name i last_name polja da već imaju vrednosti iz baze.
        if user:
            self.fields['first_name'].initial = user.first_name  # Postavljamo početnu vrednost
            self.fields['last_name'].initial = user.last_name

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