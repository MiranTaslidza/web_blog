from django.urls import path
from . import views

urlpatterns = [
    path('comments_list/', views.all_comments, name='comments_list'),  # url za prikazivanje svih komentara na blog postucomment, name='comment'),
    path('add_comment/', views.add_comment, name='add_comment'),   # url za dodavanje komentara
    path('edit_comment/', views.edit_comment, name='edit_comment'),  # url za editovanje komentara
    path('delete_comment/', views.delete_comment, name='delete_comment'),  # url za brisanje komentara
   
]