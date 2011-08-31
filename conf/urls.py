from thepian.conf import structure
from mediaserver.handlers import *
from tornado.web import StaticFileHandler

url_info = {
    "upload_script_name": "upload-specs.js",
    "core_api": structure.JS_DIR + "/upload-specs.js",
    "run_script": structure.JS_DIR + "/upload-specs.js" 
}

website = [
# (r"^/$", HomeHandler),
(r".*/$", DirectoryHandler),
]
apisite = [
    (r"/(\w+)/(\w+)/pagespec-verify.js", PageSpecVerifyJsHandler),
    
    # Account and project pages (for testing as it would be on website instead)
    (r"^/(essentialjs)/$", AccountOverviewHandler),
    (r"^/(essentialjs)/(pagespec)/$", ProjectOverviewHandler),
    (r"^/(essentialjs)/(constructive)/$", ProjectOverviewHandler),
    (r"^/(\w+)/(\w+)/(\w+)-example.zip", ExampleZipHandler, url_info),             # Downloadable ZIP with suite runners and specs uploader
    (r"^/(\w+)/(\w+)/introduction.html", IntroductionHandler),          # Downloadable
    

    # /project/shortcut_id/all-suite-runner.html - downloadable
    # /project/shortcut_id/all-suite-selftest.js
    (r"^/(\w+)/([^\./]+)/(\w+)-suite-runner.html", SuiteRunnerHandler, url_info),
    (r"^/(\w+)/([^\./]+)/(\w+)-suite-(\w+).js", SuiteRunnerScriptHandler, url_info),
    (r"^/(\w+)/([^\./]+)/runs$", NodesHandler),
    (r"^/(\w+)/([^\./]+)/runs/([^\./]+)/$", SpecificRunHandler),
    (r"^/(\w+)/([^\./]+)/runs/([^\./]+)$", SpecificRunHandler),
    
    # /project/shortcut_id/spec.zip - Downloadable with specs uploader
    # /project/shortcut_id/spec/index.html
    # /project/shortcut_id/upload-specs.js
    # /project/shortcut_id/spec/*.spec.js - upload spec change only
    (r"^/(\w+)/([^\./]+)/spec/index.html", SpecIndexHandler,url_info),
    (r"^/(\w+)/([^\./]+)/spec.zip", SpecZipHandler,url_info),
    (r"^/(\w+)/([^\./]+)/spec/(.*\.js)", SpecUploadHandler),
    (r"^/(\w+)/([^\./]+)/upload-specs.js", SpecUploadScriptHandler,url_info),

    # Self Test nodes and runs
    (r"^/(\w+)/(\w+)/nodes", NodesHandler),
    (r"^/(\w+)/(\w+)/nodes/([^\.]+)$", NodesHandler),
]

mediasite = [
    (r"^/$", MediaHomeHandler),
    (r"/static/(.*)", StaticFileHandler, {"path": structure.MEDIASITE_DIRS[0]}),
    (r"/960gs/(.*)", StaticFileHandler, {"path": structure.MEDIASITE_DIRS[0] + "/960gs"}),
    (r"/images/(.*)", StaticFileHandler, {"path": structure.MEDIASITE_DIRS[0] + "/images"}),
    (r"/demo/", DirectoryHandler),
    (r"/demo/(.*)", StaticFileHandler, {"path": structure.MEDIASITE_DIRS[0] + "/demo"}),

    (r".*/$", DirectoryHandler),
]
