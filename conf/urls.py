from thepian.conf import structure
from mediaserver.handlers import *
from tornado.web import StaticFileHandler

website = [
# (r"^/$", HomeHandler),
(r".*/$", DirectoryHandler),
]
apisite = [
    (r"/(\w+)/pagespec.js", PagespecJsHandler),
    (r"/(\w+)/translated.js", TranslateJsHandler),
    

    (r"/(\w+\.js)", JsHandler),

    (r"/js/(\w+)/verify/assets/(\w+\.\w+)", VerifyAssetsHandler, { "path": structure.JS_DIR + "/"}),
    (r"/js/(\w+\.js)/verify/(.*)", JsVerifyHandler),
    (r"/js/(\w+)/(\w+\.js)/verify/(.*)", JsVerifyDetailHandler),
    (r"/js/verify", JsVerifyAllHandler),
    (r"/js/(\w+\.js)", JsHandler),
]

mediasite = [
    (r"^/$", MediaHomeHandler),
    (r"/static/(.*)", StaticFileHandler, {"path": structure.MEDIASITE_DIRS[0]}),
    (r"/960gs/(.*)", StaticFileHandler, {"path": structure.MEDIASITE_DIRS[0] + "/960gs"}),
    (r"/images/(.*)", StaticFileHandler, {"path": structure.MEDIASITE_DIRS[0] + "/images"}),
    (r"/demo/", DirectoryHandler),
    (r"/demo/(.*)", StaticFileHandler, {"path": structure.MEDIASITE_DIRS[0] + "/demo"}),
    (r"/css/(\w+\.css)", CssHandler),
    (r"/js/(\w+)/verify/assets/(\w+\.\w+)", VerifyAssetsHandler, { "path": structure.JS_DIR + "/"}),
    (r"/js/(\w+\.js)/verify/(.*)", JsVerifyHandler),
    (r"/js/(\w+)/(\w+\.js)/verify/(.*)", JsVerifyDetailHandler),
    (r"/js/verify", JsVerifyAllHandler),
    (r"/js/(\w+\.js)", JsHandler),
    (r"/js/(\w+\.jo)", JoHandler),

    (r".*/$", DirectoryHandler),
]
