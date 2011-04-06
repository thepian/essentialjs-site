from thepian.conf import structure
from mediaserver.handlers import *
from pagespec.handlers import *
from tornado.web import StaticFileHandler

website = [
(r"^/$", HomeHandler),
(r".*/$", DirectoryHandler),
]

mediasite = [
    (r"^/$", MediaHomeHandler),
    (r"/css/(\w+\.css)", CssHandler),
    (r"/js/(\w+\.js)", JsHandler),

    (r".*/$", DirectoryHandler),
]
