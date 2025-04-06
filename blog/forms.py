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
