from setuptools import setup, find_packages
import sys, os

version = '0.1dev'

packages = find_packages('python')
packages.append('conf')

setup(name='skeleton',
      version=version,
      description="thepian web skeleton",
      long_description="""\
""",
      keywords='thepian skeleton theapps django',
      author='Henrik Vendelbo',
      author_email='hvendelbo.dev@googlemail.com',
      url='www.thepian.org',
      license='All Rights Reserved',
      package_dir= {'':'python', 'conf':'conf'},
      packages= packages,
      include_package_data=True,
      zip_safe=False,
      setup_requires=['setuptools',],
      install_requires= ['Django','theapps','thepian-lib'],
      entry_points= {
        'console_scripts':[
            'dummy = about:dummy_cmdline',
        ],
      },
      classifiers=[
        'Development Status :: Alpha',
        'Environment :: Web Environment',
        'Operating System :: OS Independent',
        'Programming Language :: Python',
        'Framework :: Django',
        'Programming Language :: Python :: 2.5',
        'Programming Language :: JavaScript',
        ], 
      )