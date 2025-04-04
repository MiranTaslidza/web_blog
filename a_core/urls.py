from django.contrib import admin
from django.urls import path, include

from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('blog.urls')),
    path('profiles/', include('profiles.urls')),
<<<<<<< HEAD
=======
    path('tinymce/', include('tinymce.urls')),
>>>>>>> 0dea486 (tinnymce uređivač teksta)
]
if settings.DEBUG: # Django će servirati medijske fajlove SAMO u developmentu
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)