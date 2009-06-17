#from thepian.conf import structure
#from os.path import join

DEVELOPING = False
DEBUG = DEVELOPING
TEMPLATE_DEBUG = DEBUG
EMAIL_DEBUG = DEBUG
# Record page generation statistics and put spread, then pull on demand, flagging page with identifier
TRACE = DEBUG

DATABASE_ENGINE = 'postgresql_psycopg2'
DATABASE_NAME = 'skeleton'
DATABASE_USER = 'skeleton'
DATABASE_PASSWORD = 'thepian'
DATABASE_HOST = ''
DATABASE_PORT = ''    

DOMAINS = ('skeleton.thepia.net',)
MEDIA_DOMAIN = 'media.skeleton.thepia.net'

from settings *
