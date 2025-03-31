from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('new_post/', views.new_post, name='new_post'),
    path('<int:pk>/', views.blog_detail, name='blog_detail'),
]
