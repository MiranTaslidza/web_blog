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
    path('user/change_email/', views.change_email, name='change_email'),
    path('confirm_old_email/<str:token>/', views.confirm_old_email, name='confirm_email_change'),
    path('cancel-email/<str:token>/', views.cancel_email_change, name='cancel_email_change'),
    
    path('confirm_new_email/<str:token>/', views.confirm_new_email, name='confirm_new_email'),

]