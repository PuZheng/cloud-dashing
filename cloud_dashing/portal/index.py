# -*- coding: UTF-8 -*-
from flask import render_template
from cloud_dashing.basemain import app
import time


@app.route('/')
def index():
    return render_template('index.html', time=time.time())


@app.route("/cloud-dashing.html")
def cloud_dashing():
    return render_template('cloud-dashing.html', time=time.time())

@app.route('/embeded-cloud-dashing.html')
def embeded_cloud_dashing():
    return render_template('cloud-dashing.html', time=time.time(),
                           embeded=True)


@app.route('/faq.html')
def faq():
    return render_template('faq.html', time=time.time());

@app.route('/about.html')
def about():
    return render_template('about.html', time=time.time());
