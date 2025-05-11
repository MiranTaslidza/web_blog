from django.urls import path
from .import views

app_name = 'likes' # Definišemo ime aplikacije kako bismo izbegli konflikte sa drugim aplikacijama

urlpatterns = [
    path('blog/<int:blog_id>/', views.like_blog, name='like_blog'),
    path('comment/<int:comment_id>/', views.like_comment, name='like_comment'),
]