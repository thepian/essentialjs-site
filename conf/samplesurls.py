from django.conf.urls.defaults import *
from django.views.generic.simple import direct_to_template

urlpatterns = patterns('',
    url(r'^$', direct_to_template, {"template": "samples/samples.html"}),
    url(r'^extending$', direct_to_template, {"template": "samples/extending.html"}),
    url(r'^test-extension$', direct_to_template, {"template": "pagespec/test-extension.html"}),
)
