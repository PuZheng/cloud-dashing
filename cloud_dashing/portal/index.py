# -*- coding: UTF-8 -*-
import math
from flask import render_template, make_response, request
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
            'color': 'blue',
        },
        {
            'id': 2,
            'name': '阿里云',
            'location': '杭州市',
            'color': 'green',
        },
    ]))
    ret.headers['Content-Type'] = 'application/json'
    return ret


@app.route('/api/reports')
def reports_view():
    start = request.args.get('start', type=int)
    end = request.args.get('end', type=int)
    viewpoint_id = request.args.get('viewpoint_id', type=int)

    if not (start and end and viewpoint_id):
        return 'invalid parameter', 403

    step = 20 * 60 * 1000

    def _makeSlice(i):
        latency1 = viewpoint_id * 20 + abs(
            math.floor(15 + math.sin(i / 20 + 1) * 20 +
                       math.sin(i / 10 + 0.5) * 10))
        latency2 = viewpoint_id * 30 + abs(
            math.floor(15 + math.sin(i / 20 + 1) * 20 +
                       math.sin(i / 10 + 0.5) * 10))

        return dict(at=start + i,
                    statusList=[
                        {
                            'id': 1,
                            'latency': latency1,
                        },
                        {
                            'id': 2,
                            'latency': latency2,
                        }])
    ret = [_makeSlice(i) for i in xrange(0, end - start, step)]

    ret = make_response(json.dumps(ret))
    ret.headers['Content-Type'] = 'application/json'
    return ret
