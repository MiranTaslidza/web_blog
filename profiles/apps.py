from django.apps import AppConfig


class ProfilesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'profiles'

# registracija signala koji sam kreirao
    def ready(self):
        import profiles.signals