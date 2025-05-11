from django.contrib import admin
from django.urls import path, include

from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('blog.urls')),
    path('profiles/', include('profiles.urls')),
    path('comment/', include('comment.urls')),
    path('tinymce/', include('tinymce.urls')),
    path('likes/', include('likes.urls', namespace='likes')),
]
if settings.DEBUG: # Django će servirati medijske fajlove SAMO u developmentu
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)