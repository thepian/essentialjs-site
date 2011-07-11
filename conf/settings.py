# -*- coding: utf-8 -*-
# Django settings for skeleton project.

from thepian.conf import structure
from os.path import join

DEVELOPING = structure.DEVELOPING
DEBUG = DEVELOPING
TEMPLATE_DEBUG = DEBUG

# Possible choices are: ''|'simple'|'recaptcha'
# To utilize recaptcha you must get public/private keys
# from http://recaptcha.net/
CAPTCHA='simple'
RECAPTCHA_PUBLIC_KEY = ''
RECAPTCHA_PRIVATE_KEY =''

ADMINS = structure.ADMINS
MANAGERS = ADMINS

COUCHDB_DATABASES = (
    ('essentialjs.essentialjs', 'http://127.0.0.1:5984/essentialjs'),
)
if DEVELOPING:        
    DATABASE_ENGINE = 'sqlite3'
    DATABASE_NAME = join(structure.PROJECT_DIR,'testdb')
    DATABASE_USER = ''
    DATABASE_PASSWORD = ''
    DATABASE_HOST = ''
    DATABASE_PORT = ''
else:
    DATABASE_ENGINE = 'postgresql_psycopg2'
    DATABASE_NAME = 'skeleton'
    DATABASE_USER = 'skeleton'
    DATABASE_PASSWORD = 'thepian'
    DATABASE_HOST = ''
    DATABASE_PORT = ''    

# Local time zone for this installation. Choices can be found here:
# http://en.wikipedia.org/wiki/List_of_tz_zones_by_name
# although not all choices may be available on all operating systems.
# If running in a Windows environment this must be set to the same as your
# system time zone.
TIME_ZONE = 'Europe/London'

# Language code for this installation. All choices can be found here:
# http://www.i18nguy.com/unicode/language-identifiers.html
LANGUAGE_CODE = 'en-uk'

SITE_ID = 1
SITE_TITLE = 'essentialjs Site'

# If you set this to False, Django will make some optimizations so as not
# to load the internationalization machinery.
USE_I18N = True

# Absolute path to the directory that holds media.
# Example: "/home/media/media.lawrence.com/"
MEDIA_ROOT = ''

# URL that handles the media served from MEDIA_ROOT. Make sure to use a
# trailing slash if there is a path component (optional in other cases).
# Examples: "http://media.lawrence.com", "http://example.com/media/"
MEDIA_URL = 'http://media.essentialjs.org'

# URL prefix for admin media -- CSS, JavaScript and images. Make sure to use a
# trailing slash.
ADMIN_MEDIA_PREFIX = MEDIA_URL+'/admin/'

# Make this unique, and don't share it with anybody.
SECRET_KEY = ''

# List of callables that know how to import templates from various sources.
TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.load_template_source',
    'django.template.loaders.app_directories.load_template_source',
    'themaestro.loaders.sources.load_template_source',
)

TEMPLATE_CONTEXT_PROCESSORS = (
    "django.core.context_processors.auth",
    "django.core.context_processors.debug",
    "django.core.context_processors.i18n",
    "django.core.context_processors.media",
 
    #"notification.context_processors.notification",
    #"announcements.context_processors.site_wide_announcements",
    #"messages.context_processors.inbox",
    "theapps.supervisor.context_processors.vars",
    "theapps.supervisor.context_processors.settings_vars",
)

#AUTHENTICATION_BACKENDS = (
#    'django.contrib.auth.backends.ModelBackend',
#    'accounts.backends.CommentApprovingBackend',
#    'accounts.backends.EmailBackend',
#    'openidconsumer.backend.OpenidBackend',
#)


MIDDLEWARE_CLASSES = (
    'django.middleware.common.CommonMiddleware',
    'theapps.supervisor.middleware.SiteMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.locale.LocaleMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    #'django_openidconsumer.middleware.OpenIDMiddleware',
    'theapps.supervisor.middleware.DeviceMiddleware',
)

ROOT_URLCONF = 'urls'
#URLCONFS = {
#    'www':'conf.urls',
#    'media':'devonly.media_urls',
#    #TODO 'aa':'theapps.assets.shard_urls',
#} 

APPEND_SLASH = True

TEMPLATE_DIRS = (
    # Put strings here, like "/home/html/django_templates" or "C:/www/django/templates".
    # Always use forward slashes, even on Windows.
    # Don't forget to use absolute paths, not relative paths.
    structure.TEMPLATES_DIR,
    # structure.SAMPLE_TEMPLATES_DIR,
)

INSTALLED_APPS = (
    'django.contrib.contenttypes',
    'django.contrib.auth',
    'django.contrib.sessions',
    'django.contrib.humanize',
    'django.contrib.markup',
    
    'couchdbkit.ext.django',
    
    'theapps.media',
    'theapps.openuser',
    'theapps.sitemaps',
    'theapps.supervisor',
    
    # 'mailer',
    # 'timezones',
    'essentialjs',
    
    'about',
)

# AUTH_USER_MODULE = 'account.user_model.User'
# AUTH_PROFILE_MODELS = ('account.Profile',)
# AUTH_PROFILE_MODULE = 'account.Profile'

EMAIL_HOST = 'localhost'
SERVER_EMAIL = "server@thepia.net"

DEFAULT_FROM_EMAIL = 'confirmations@essentialjs.com'

EMAIL_CONFIRMATION_DAYS = 2
EMAIL_DEBUG = DEBUG
CONTACT_EMAIL = "feedback@skeleton.com"
LOGIN_URL = "/account/login"

LOGGING_OUTPUT_ENABLED = True
LOGGING_SHOW_METRICS = True
LOGGING_LOG_SQL = True

INTERNAL_IPS = ( '127.0.0.1', ) + structure.DEV_MACHINES

DEFAULT_CHARSET = 'utf-8'

# Record page generation statistics and put spread, then pull on demand, flagging page with identifier
TRACE = DEBUG

ugettext = lambda s: s
LANGUAGES = (
  ('en', u'English'),
  ('de', u'Deutsch'),
  ('es', u'Español'),
  ('fr', u'Français'),
  ('sv', u'Svenska'),
  ('pt-br', u'Português brasileiro'),
)

# URCHIN_ID = "ua-..."

CACHE_BACKEND = "locmem:///?max_entries=3000"
FEEDUTIL_SUMMARY_LEN = 60*7 # 7 hours

try:
    from localsettings import *
except ImportError:
    pass




