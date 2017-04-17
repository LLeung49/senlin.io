from django.conf.urls import url, include
from . import views



urlpatterns = [
    url(r'^$', views.home, name='home'),
    # url(r'^register/$', views.UserFormView.as_view(), name='register'),
    # url(r'^words/$', views.words.as_view(), name='words'),
    url(r'^api/words/$', views.words, name='words'),
    url(r'^api/new_memories/$', views.insert_memories, name='new_memories'),


]