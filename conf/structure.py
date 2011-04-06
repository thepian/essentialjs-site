# This is a settings file used by the shard-admin.py

ADMINS = (
    ('Henrik Vendelbo', 'hvendelbo.dev@googlemail.com'),
)

DEFAULT_SITE_TITLE = "skeleton Site"
DEFAULT_HOSTNAME = "www.skeleton.local"

CLUSTERS = {
    'live': { 'domains': ('skeleton.com','skeleton.net','skeleton.thepia.net',), 
        'media':'media.skeleton.thepia.net',
        'upstream_protocol': 'fastcgi', 'upstream_port': '8881', 
        'upstream_socket': '/tmp/skeleton', 'email_host':'localhost',
        'shard_user':'thepian', 'shard_group':'thepian',
        'etc_user':'thepian', 'etc_group':'thepian',
        'log_user':'www-data','log_group':'adm'
        }, 
    'staged': { 'domains': ('skeleton.staged.local',), 
        'media':'media.skeleton.staged.local',
        'upstream_protocol': 'fastcgi', 'upstream_port': '8881', 
        'upstream_socket': '/tmp/skeleton',
        'shard_user':'thepian', 'shard_group':'thepian',
        'etc_user':'thepian', 'etc_group':'thepian',
        'log_user':'thepian','log_group':'nobody'
        },
    'dev': { 'domains': ('skeleton.dev.local',), 
        'media':'media.skeleton.dev.local',
        'upstream_protocol': 'http', 'upstream_port': '8000', 'email_host':'smtp.ntlworld.com',
        'shard_user':'root', 'shard_group':'admin',
        'etc_user':'root', 'etc_group':'admin',
        'log_user':'root','log_group':'nobody'
        }, 
}


#? simple division shard= subdomain, cluster = domain, site = tld ?? sites = ('net','com', 'co.uk')
SERVERS = (
    { 'mac':'1cb374a89f', 'pool_ip':'192.168.9.104', 'own_ip':'192.168.9.94', 'cluster':'dev', 
        'NICK': "imac2", 'EMAIL_HOST':'localhost', 'SERVER_EMAIL':'imac2@thepia.net'},
    { 'mac':'1b639c1367', 'pool_ip':'192.168.9.104', 'own_ip':'192.168.9.94', 'cluster':'dev', 
        'NICK': "imac", 'EMAIL_HOST':'localhost', 'SERVER_EMAIL':'imac@thepia.net'},
    { 'mac':'1b63aa4556', 'pool_ip':'192.168.9.105', 'own_ip':'192.168.9.95', 'cluster':'dev', 
        'NICK': "tinkerbell", 'EMAIL_HOST':'localhost', 'SERVER_EMAIL':'tinkerbell@thepia.net' },

    { 'mac':'1e8c6bd607', 'pool_ip':'83.170.98.113', 'own_ip':'83.170.93.136', 'cluster':'live', 
        'NICK': "s1",'EMAIL_HOST':'smtp.ntlworld.com', 'SERVER_EMAIL':'s1@thepia.net' },
    { 'mac':'1b639c13??1', 'pool_ip':'192.168.9.61', 'own_ip':'192.168.9.51', 'cluster':'test', 
        'NICK': "test1",'EMAIL_HOST':'smtp.ntlworld.com', 'SERVER_EMAIL':'test1@thepia.net'
     },
    { 'mac':'1b639c13??2', 'pool_ip':'192.168.9.62', 'own_ip':'192.168.9.52', 'cluster':'test', 
        'NICK': "test2",'EMAIL_HOST':'smtp.ntlworld.com', 'SERVER_EMAIL':'test2@thepia.net'
     },
)


DEV_MACHINES = ('192.168.9.94', '192.168.9.95')

SHARD_NAMES = ('aa','ab','ac','ad','ae','af','ag','ah','ai','aj','ak','al',)

# Allows you to tie a particular affinity number to a shard name
# By default the shard is determined by: number % len(SHARD_NAMES)
SHARD_AFFINITY = {
#    'aa' : (1, 2, 3, 4),
#    'ak' : (5,77,222)
}

AFFINITY_SECRET = ''

ETC_SYMLINKS = (
    ('nginx.fastcgi.conf','%(NGINX_ETC_DIR)s/fastcgi.conf'),
    ('nginx.geo.conf','%(NGINX_ETC_DIR)s/geo.conf'),
    ('extra.nginx.conf','%(NGINX_SITES_ENABLED)s/extra.nginx.conf'),
    ('live.nginx.conf','%(NGINX_SITES_ENABLED)s/live.%(PROJECT_NAME)s.conf'),
)