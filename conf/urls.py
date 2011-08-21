from thepian.conf import structure
from mediaserver.handlers import *
from tornado.web import StaticFileHandler

website = [
# (r"^/$", HomeHandler),
(r".*/$", DirectoryHandler),
]
apisite = [
    (r"/(\w+)/(\w+)/pagespec-verify.js", PageSpecVerifyJsHandler),
    
    # Self Test pages
    (r"^/(essentialjs)/(pagespec)/all/(selftest)\.html$", SelfTestHandler),
    (r"^/(essentialjs)/(pagespec)/all/(known)\.html$", KnownSpecsHandler),
    (r"^/(essentialjs)/(constructive)/all/(selftest)\.html$", SelfTestHandler),
    
    # Self Test test all JavaScript
    (r"^/(\w+)/(\w+)/all/(\w+)\.js$", JsExecuteAllHandler, { 
        "core_api": structure.JS_DIR + "/pagespec-core.js",
        "run_script": structure.JS_DIR + "/execute-all.js" 
        }),
        
    # /project/shortcut_id/runner.js
    # /project/shortcut_id/runner.html - downloadable
    # /project/shortcut_id/introduction.html - downloadable
    (r"^/(\w+)/([^\./]+)/runner.js", IntroductionHandler),
    (r"^/(\w+)/([^\./]+)/runner.html", IntroductionHandler),
    (r"^/(\w+)/([^\./]+)/introduction.html", IntroductionHandler),
    (r"^/(\w+)/([^\./]+)/spec/index.html", SpecIndexHandler),
    (r"^/(\w+)/([^\./]+)/spec.zip", SpecZipHandler),
    (r"^/(\w+)/([^\./]+)/spec/(.*\.js)", SpecUploadHandler),

    # Self Test nodes and runs
    (r"^/(\w+)/(\w+)/nodes", NodesHandler),
    (r"^/(\w+)/(\w+)/nodes/([^\.]+)$", NodesHandler),
    (r"^/(\w+)/(\w+)/runs$", NodesHandler),
    (r"^/(\w+)/(\w+)/runs/([^\./]+)/$", SpecificRunHandler),
    (r"^/(\w+)/(\w+)/runs/([^\./]+)$", SpecificRunHandler),
        
    # Individual specs preprocessed
    (r"^/(\w+)/(\w+)/([^\.]+)\.js$", JsPreProcessHandler),
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

    (r".*/$", DirectoryHandler),
]
