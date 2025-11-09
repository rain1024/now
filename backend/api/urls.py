from django.urls import path
from . import views

urlpatterns = [
    path('signup', views.signup, name='signup'),
    path('login', views.login, name='login'),
    path('feedback', views.feedback, name='feedback'),
    path('feedbacks', views.feedback, name='feedbacks'),  # Same view for GET
    path('stats', views.stats, name='stats'),
]
