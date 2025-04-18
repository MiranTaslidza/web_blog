from django.urls import path
from . import views

urlpatterns = [
    path('comments_list/', views.all_comments, name='comments_list'),  # url za prikazivanje svih komentara na blog postucomment, name='comment'),

]