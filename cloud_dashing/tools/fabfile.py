from fabric.api import run, cd, prefix, env, sudo
from fabric import operations
import os.path
from plumbum import cmd

env.hosts=["cloudwarrior.org"]
env.passwords={"cloudwarrior.org": "cloudwarrior"}
env.user="cloudwarrior"

def deploy():
    cmd.tar['zcf', 'build.tar.gz', 'build']()
    with cd('public/cloudwarrior.org/public'):
        run('rm -rf *')
    operations.put('build.tar.gz', 'public/cloudwarrior.org/public')
    with cd('public/cloudwarrior.org/public'):
        run('tar zxvf build.tar.gz > /dev/zero')
        run('mv build/* ./')
        run('rm -rf build')
