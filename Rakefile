# Adopted from Scott Kyle's Rakefile
# http://github.com/appden/appden.github.com/blob/master/Rakefile

task :default => :server
 
desc 'Build site with Jekyll'
task :build do
  jekyll
  lessc 'twothirds'
  lessc 'thirds'
  lessc 'fourths'
  lessc 'pale_serif'
  lessc 'night_sans'
end
 
desc 'Build and start server with --auto'
task :server do
  jekyll '--server --auto'
end

desc 'Build and deploy'
task :deploy => :build do
  sh 'rsync -rtzh --progress --delete _site/ tatey@tatey.com:~/var/www/tatey.com/'
end

def jekyll(opts = '')
  sh 'rm -rf _site'
  sh 'jekyll ' + opts
end

def lessc(base)
  sh 'rm -f css/' + base + '.css'
  sh '(cat less/' + base +'.prefix; lessc -x less/'+ base + '.less)> css/' + base + '.css'
end