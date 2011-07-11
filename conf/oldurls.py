from theapps.sitemaps.urls.defaults import *
from django.conf import settings
from django.views.generic.simple import direct_to_template
from django.contrib.syndication.views import feed as feed_view

from theapps.shortcuts import blank
from theapps.sitemaps import GenericSitemap, views as sitemap_views
# from theapps.blog.sitemap import BlogSitemap

from pagespec import views as pagespec_views

#info_dict = { 'queryset': Tag.objects.all() }
info_dict = { 'queryset':[] }


sitemaps = {
    #'tags': GenericSitemap(info_dict, priority=0.5, changefreq='daily'),
    }

urlpatterns = patterns('',
    url(r'^$', direct_to_template, {"template": "homepage.html"}, name="home"),
    
    url(r'^pagespec/', include('pagespec.urls')),
    url(r'^jsunit/', include('pagespec.jsunit_urls')),
    url(r'^i18n/', include('django.conf.urls.i18n')),

    url(r'^about/', include('about.urls')),
    url(r'^samples/', include('samplesurls')),

    url(r'^sitemap$', sitemap_views.sitemap_page, {'sitemaps': sitemaps}, name="sitemap"),
    url(r'^sitemap.xml$', sitemap_views.sitemap, {'sitemaps': sitemaps}, name="sitemap.xml"),
    url(r'^robots.txt$', sitemap_views.robots_txt),
    
    url(r'^blank$', blank),
)
