#####################
公有云项目WEB接口列表
#####################


.. _get_viewpoint_list:

获取观察点列表
==============

获取所有的观察点(即数据采集服务器)列表，若提供了观察者的IP，根据IP判断应该选取哪个观察点，规则暂时为:
   

   **如果IP所在省有观察点，选择该观察点，否则选择北京**

``注: 由于目前仅仅有一个观察点（即北京），直接返回该观察点即可``

* 请求

  .. code-block:: bash

      GET /viewpoint-list?ip=<str>

 * ip - 观察者的ip，可选项，如果不传，直接选择北京

* 响应 - http code 200

  .. code-block:: python 

      {
         "data": [
            {
               "id": <int>,  # 观察点的唯一编号，后续会使用该观察点ID获取数据
               "name": <str>,
               "latitude": <float>, # 后台手工写入即可，没必要非常精确
               "longitude": <float>, # 同longitude
               "prefered": 0|1, # 是默认观察点? 1:0
            }
         ]
      }

.. _get_cloud_list:

获取被监控云列表
================
获取所有被监控的云列表

* 请求

  .. code-block:: bash

      GET /cloud-list

* 响应 - http code 200

  .. code-block:: python

      {
         "data": [
            {
               "id": <int>, # 监控云的唯一编号，后续会使用该编号获取数据
               "name": <str>, 
               "latitude": <float>, # 后台手工写入即可，没必要非常精确
               "longitude": <float>, # 同longitude
            },
            # ...
         ]
      }

 

获取所有被监控云状态
==================

获取对指定观察点的，某些云的状态

* 请求 

  .. code-block:: bash

      GET /cloud-status-list?viewpoint=<int>&clouds=(<int>,)+&at=<int>[,<int>]


 * viewpoint - 观察点id, 参见 :ref:`get_viewpoint_list`
 * clouds - 云id列表, 例如"1,2,3", 可选项，若提供，只提供这些云的详细信息; 否则提供所有云的详细信息，参见 :ref:`get_cloud_list`
 * at - 返回某时间点或区间的云状态，值是自epoch time(1970年1月1日0:00)的秒数, 
   可选项，若不传，返回当前最近的状态信息. 例如 *"1390301420"* 需要返回离此时刻最近的状态, 而 *"1390301420,1390311420"* 需要返回位于时间段 *[1390301420, 1390311420)* 的所有状态

* 响应 - http code 200

  .. code-block:: python
   
      {
         "data": [
            {
               "id": <int>, # 云id
               "status-list":  # 每个时间点的状态信息
               [
                  {
                     "latency": <int>,  # 延迟，单位是毫秒(0.001秒)
                     "up": 0|1,  # 可用? 1: 0
                     "at": <int>,  # seconds since epoch, 注意!!!, 这里是实际的采集时间点，不是在url参数中传入的时间点
                  }
                  # ...
               ]
            },
            # ...
         ] 
      }

* 响应 - http code 403, 参数非法

  .. code-block:: python

      <str>  # 内容是错误原因，例如"不存在的观察点"
