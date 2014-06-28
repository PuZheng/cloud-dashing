cloud-dashing
=============


we want following features:
 
 * highly interactive
 * adapt to mobile devices
 * intuitive


## quick start

1. `$ git clone https://github.com/PuZheng/cloud-dashing.git`
2. `$ cd cloud-dashing/cloud_dashing`
3. `$ pip install -r ../requirements.txt   # you'd better in virtual env`
4. `$ sudo apt-get install node npm` 
5. `$ sudo npm install -g bower`
6. `$ bower install`


## deployment

0. change file config.py, set "FAB_PRIVATE_KEY_FILE" to your actually ssh pem file

1. change file config.py, set "CONFIG" to False, assuming that you set "CONFIG" to True in development cycle.
2. update static/js/main.js, set "urlArgs" to a new bust, eg "bust=><new bust>",
3. `$ node tools/r.js -o build.js`
4. `$ python tools/freeze.py`
5. `$ fab tools/fabfile.py deploy` 

`
