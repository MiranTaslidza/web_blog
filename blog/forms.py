from django import forms
from .models import Blog

from tinymce.widgets import TinyMCE
class PostForm(forms.ModelForm):
    title = forms.CharField(widget=forms.TextInput(attrs={'class': 'form-control'}))
    content = forms.CharField(widget=TinyMCE(attrs={'cols': 80, 'rows': 30, 'class': 'form-control, tinymce'}))
    
    class Meta:
        model = Blog
        fields = ('title', 'content')

