#!/usr/bin/env ./meshed 

PORT = 33333

def main(executable_path,executable_name):
    print "Tornado Server on port %s, logging to testing.log, running in %s" % (PORT,executable_path)

    import fs,os,site
    from thepian.conf import structure
    from os.path import join
    
    from thepian.conf import ensure_target_tree
    ensure_target_tree(structure.PROJECT_DIR)
    #TODO part add_themaestro functionality

    sys.path.insert(0,structure.PROJECT_DIR)
    
    import logging
    print 'logging to testing.log', structure.DEFAULT_HOSTNAME
    LOG_FILENAME = join(structure.PROJECT_DIR,'testing.log')
    logging.basicConfig(filename=LOG_FILENAME,level=logging.DEBUG)
    
    from mediaserver import Application, HTTPServer
    import tornado.httpserver
    import tornado.ioloop
    import tornado.autoreload
    
    ioloop = tornado.ioloop.IOLoop.instance()
    for n in structure.SITES:
        site = structure.SITES[n]
        print n+":", site["port"], site["package"]
        if site["package"] in ("tornado", "mediaserver"):
            http_server = tornado.httpserver.HTTPServer(Application(site,ioloop=ioloop))
            http_server.listen(site["port"])
    
    tornado.autoreload.start(io_loop=ioloop)
    ioloop.start()
    #return 'Tornado trial run\n'


if __name__ == "__main__":
    import sys
    from os.path import split
    path,name = split(sys.executable)
    main(path,name)