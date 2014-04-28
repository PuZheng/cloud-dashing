import os.path
from paramiko import RSAKey
from fabric.api import run, cd, prefix, env, sudo
from fabric import operations
from plumbum import cmd
from cloud_dashing.basemain import app

env.hosts=["106.187.93.89"]
env.key_filename = app.config['FAB_PRIVATE_KEY_FILE']
env.user= app.config['FAB_USER']

def deploy():
    cmd.tar['zcf', 'build.tar.gz', 'build']()
    with cd('public/cloudwarrior.org/public'):
        run('rm -rf *')
    operations.put('build.tar.gz', 'public/cloudwarrior.org/public')
    with cd('public/cloudwarrior.org/public'):
        run('tar zxvf build.tar.gz > /dev/zero')
        run('mv build/* ./')
        run('rm -rf build')
