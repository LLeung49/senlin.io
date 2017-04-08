from django.conf.urls import url, include
from . import views


urlpatterns = [
    url(r'^$', views.home, name='home'),
    # url(r'^words/$', views.words.as_view(), name='words'),
    url(r'^words/$', views.words, name='words'),

]