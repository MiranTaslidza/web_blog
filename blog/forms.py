from django import forms
from .models import Blog

<<<<<<< HEAD
class PostForm(forms.ModelForm):
    title = forms.CharField(widget=forms.TextInput(attrs={'class': 'form-control'}))
    content = forms.CharField(widget=forms.Textarea(attrs={'class': 'form-control', 'rows': 3}))
=======
from tinymce.widgets import TinyMCE
class PostForm(forms.ModelForm):
    title = forms.CharField(widget=forms.TextInput(attrs={'class': 'form-control'}))
    content = forms.CharField(widget=TinyMCE(attrs={'cols': 80, 'rows': 30, 'class': 'form-control, tinymce'}))
>>>>>>> 0dea486 (tinnymce uređivač teksta)
    
    class Meta:
        model = Blog
        fields = ('title', 'content')

