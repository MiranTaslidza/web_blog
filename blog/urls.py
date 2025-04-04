from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('new_post/', views.new_post, name='new_post'),
    path('<int:pk>/', views.blog_detail, name='blog_detail'),
    path('blog_delete/<int:pk>/', views.delete_post, name='blog_delete'),
    path('edit_post/<int:pk>/', views.edit_post, name='edit_post'),
<<<<<<< HEAD

=======
    path('upload_image/', views.upload_image, name='upload_image'),
>>>>>>> 0dea486 (tinnymce uređivač teksta)
]
