# -*- coding: UTF-8 -*-
from flask import render_template
from cloud_dashing.basemain import app
import time

@app.route('/')
def index():
    return render_template('index.html', time=time.time())
