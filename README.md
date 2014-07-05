cloud-dashing
=============


we want following features:
 
 * highly interactive
 * adapt to mobile devices
 * intuitive


## quick start

1. `$ git clone https://github.com/PuZheng/cloud-dashing.git`
2. `$ cd cloud-dashing`
3. `$ python setup.py develop   # you'd better in virtual env`
4. `$ cd cloud_dashing``
5. `$ sudo apt-get install node npm` 
6. `$ sudo npm install -g bower`
7. `$ bower install`
8. `$ python runserver.py`

visit http://127.0.0.1:5000, you will see the result

## deployment

0. change file config.py, set "FAB_PRIVATE_KEY_FILE" to your actually ssh pem file

1. change file config.py, set "CONFIG" to False, assuming that you set "CONFIG" to True in development cycle.
2. update static/js/main.js, set "urlArgs" to a new bust, eg "bust=><new bust>",
3. `$ python tools/freeze.py`, untils you see `INFO:werkzeug: * Running on http://127.0.0.1:5000/`
4. `$ node tools/r.js -o build.js`
5. `$ fab tools/fabfile.py deploy` 

`
