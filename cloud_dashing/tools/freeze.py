# -*- coding: UTF-8 -*-
#!/usr/bin/env python
from flask.ext.frozen import Freezer
from cloud_dashing.basemain import app
Freezer(app).run()
