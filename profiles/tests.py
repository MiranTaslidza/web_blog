from django.test import TestCase

# Create your tests here.
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
