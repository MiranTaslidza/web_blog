from django.urls import path
from . import views

urlpatterns = [
    path('<int:pk>/', views.wiew_profile, name='profile'),
    path('login/', views.login_user, name='login'),
    path('logout/', views.logout_user, name='logout'),
    path('register/', views.register_user, name='register'),
    path('verify/<uidb64>/<token>/', views.verify_user, name='verify'),  # url za verifikaciju
    path("update/", views.update_profile, name="update_profile"),
    path("delete/", views.delete_account, name="delete_account"),
    path('user/change_password/', views.change_password, name='change_password'),
]