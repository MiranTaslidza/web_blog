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

    # sriječavanje registracije više korisnika sa istim mailom
    def clean_email(self):
        email = self.cleaned_data.get('email')
        if User.objects.filter(email=email).exists():
            raise forms.ValidationError("This email is already in use.")
        return email


