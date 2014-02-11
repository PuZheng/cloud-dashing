# -*- coding: UTF-8 -*-
from flask import render_template, make_response
from cloud_dashing.basemain import app
import time
import json


@app.route('/')
def index():
    return render_template('index.html', time=time.time())


@app.route('/api/agents')
def agents_view():
    ret = make_response(json.dumps([
        {
            'id': 1,
            'name': '百度云',
            'location': '北京市',
        },
        {
            'id': 2,
            'name': '阿里云',
            'location': '杭州市',
        },
    ]))
    ret.headers['Content-Type'] = 'application/json'
    return ret
