"""PersonalGuide2 URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.9/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.contrib import admin

from PersonalGuide import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^admin/', admin.site.urls),
    url(r'^venues_foursquare/$', views.venues_foursquare, name='venues_foursquare'),
    url(r'^venues_foursquare/(?P<venue_id>[\w\-]{24})/$', views.venues_foursquare_details,
        name='venues_foursquare_details'),
    url(r'^venues_foursquare/popular/$', views.popular_venues_foursquare, name='popular_venues_foursquare'),
    url(r'^venues/', views.venues, name="venues"),
    url(r'^venues/map/$', views.venues_map, name='venues_map'),


]

