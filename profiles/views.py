from django.shortcuts import render
from .models import Profile

# prikaz profila korisnika
def wiew_profile(request, pk):
    profile = Profile.objects.get(pk=pk)
    return render(request, 'profiles/profile.html', {'profile': profile})