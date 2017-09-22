#!/usr/bin/env python
# encoding: utf-8

import qi

class SampleService:
    def __init__(self, session):
        import os
        self._session = session
        self._prev = 0
        self._manager = self._session.service("ALBehaviorManager")
        self._run = True

    @qi.bind(qi.Void, paramsType=(qi.String,))
    def stop(self, text):
        self._run = False

    def _start(self):
        current = datetime.now().strftime('%s')
        import time
        t = time.ctime();

        # 書式 "Mon Dec 6 11:33:26 2010"
        while self._run: # 毎時4分
            if ":04 " in t and "Mon" in t and current > self._prev + 60:
                self._manager.startBehavior("sbr_70270_dango-3-kyodai/.")
                self._prev = datetime.now().strftime('%s')
            time.sleep(10.0)

def register_as_service(service_class, robot_ip="127.0.0.1"):
    session = qi.Session()
    session.connect("tcp://%s:9559" % robot_ip)
    service_name = service_class.__name__
    instance = service_class(session)
    try:
        for info in session.services():
            try:
                if info['name'] == service_name:
                    session.unregisterService(info['serviceId'])
                    break
            except Exception as e:
                pass
        session.registerService(service_name, instance)
    except Exception as e:
        pass

def main():
    register_as_service(SampleService)
    app = qi.Application()
    app.run()

if __name__ == "__main__":
    main()

