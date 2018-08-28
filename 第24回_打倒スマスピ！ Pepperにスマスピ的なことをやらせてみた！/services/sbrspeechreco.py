#!/usr/bin/env python
# encoding: utf-8

import qi

import logging, traceback
logging.basicConfig(filename='/home/nao/example.log',level=logging.DEBUG)
logger = logging.getLogger('SpeechRecognizer')

class SpeechRecognizer:
    def __init__(self, service):
        import os

        self._service = service
        self._memory = service.session.service("ALMemory")
        self._eventKey = "ComSoftbankrobotics/SampleProject/SpeechRecognizer/Recognized"

        self._libPath = "%s/../libs" % os.path.abspath(os.path.dirname(__file__))
        logger.debug(self._libPath)

        self._audioAsync = None
        self._runing = False

        self._recordCommand = ["arecord", "-t", "wav", "-f", "S16_LE", "-c1", "-r16000" ]
        self._headerSize  = 44   # WAVファイルのHeaderサイズ
        self._ups         = 2    # 1/n秒単位で計算
        self._maxSec      = 60   # 発話と認識する音の長さ。長すぎると音楽などを発話と認識する可能性がある
        self._borderValue = 1300 # 発話中と認識する音量の閾値。fanのみでも800ぐらいの音量がある
        self._chunkSize   = 16000 * 2 / self._ups    # 音声データの読出しサイズ

        self._googleApiKey = "AIzaSyA-WebMGWpR1D3UPFMWewNNQuishPzkA-8"

    def start(self):
        if self._audioAsync is None:
            self._loadLib()
            self._audioAsync = qi.async(self._run)

    def stop(self):
        self._roop = False
        if self._audioAsync:
            self._audioAsync.wait()
            self._audioAsync = None
        self._unloadLib()

    def _run(self):
        try:
            if not self._runing:
                import subprocess, time
                import numpy as np
                logger.debug("_run")
                self._runing = True
                arecord = subprocess.Popen(self._recordCommand, stdout=subprocess.PIPE)
                time.sleep(0.1)
                header = arecord.stdout.read(self._headerSize)
                prev = None
                sounds = []
                maxSize = self._maxSec * self._ups

                self._roop = True
                while self._roop:
                    data  = arecord.stdout.read(self._chunkSize)
                    value = np.abs(np.frombuffer(data, dtype='int16' )).mean()
                    size  = len(sounds)
                    
                    status = self._memory.getData("ALTextToSpeech/Status")
                    if status[1] == "done" and value > self._borderValue and size <= maxSize:
                        # 音量が一定以上あって、音が長すぎない場合
                        logger.debug("append")
                        sounds.append(data)
                    else:
                        if 0 < size and size <= maxSize:
                            # 音が鳴りやんだタイミング
                            targetData = header + prev + b''.join(sounds) + data
                            qi.async(self._recognize, targetData)
                        # 音が鳴っていない
                        logger.debug("reset")
                        prev = data
                        sounds = []

                arecord.kill()
                self._runing = False
        except e:
            logger.debug( traceback.format_exc())

    def _recognize(self, targetData):
        logger.debug("_recognize")
        try:
            result = ""
            '''
            from google.cloud import speech
            from google.cloud.speech import enums
            from google.cloud.speech import types

            client = speech.SpeechClient()
            audio = types.RecognitionAudio(content=targetData)

            config = types.RecognitionConfig(
                encoding=enums.RecognitionConfig.AudioEncoding.LINEAR16,
                sample_rate_hertz=16000,
                language_code='ja-JP')

            response = client.recognize(config, audio)

            logger.debug(str(response))

            for current in response.results:
                result = result + current.alternatives[0].transcript
            '''
            import re
            result = self._getText(targetData)
            if result:
                result = result.replace(" ", "")
                result = result.replace("　", "")
                logger.debug(result)
                objRegex = re.match(r"(ねぇ|ねー|ねえ)?[,、]?(Pepper|pepper|ぺっぱー|ペッパー|ペーパー)(.*)(って|と)(呟いて|ツイート|つぶやいて).*", result)
                if objRegex:
                    #self._memory.raiseEvent(self._eventKey, result)
                    self._tweet(objRegex.group(3))
                               
        except Exception as e:
            logger.debug( traceback.format_exc())
            logger.debug("ERROR:" + e.message)

    def _loadLib(self):
        import sys
        if self._libPath and not self._libPath in sys.path:
            sys.path.insert(1, self._libPath)

    def _unloadLib(self):
        import sys
        if self._libPath and self._libPath in sys.path:
            sys.path.remove(self._libPath)

    def _getText(self, targetData):
        import httplib, urllib, base64, uuid, json
        result = None
        headers = {
            'Content-type': 'application/json'
        }

        params = urllib.urlencode({
            "key": self._googleApiKey
        })

        value = json.dumps({
            "config":{
                "encoding":"LINEAR16",
                "sample_rate":16000,
                "language_code":"ja-JP"
            },
            "audio":{
                "content": base64.b64encode(targetData)
            }
        });

        try:
            conn = httplib.HTTPSConnection('speech.googleapis.com')
            conn.request("POST", "/v1beta1/speech:syncrecognize?%s" % params, value, headers)
            response = conn.getresponse()
            data = response.read()
            conn.close()
            logger.debug("result: %s" % data)
            
            data = json.loads(data, 'utf-8')
            if data and data['results'] and data['results'][0] and data['results'][0]['alternatives'] and data['results'][0]['alternatives'][0]:
                result = data['results'][0]['alternatives'][0]['transcript'].encode('utf-8')
        except Exception as e:
            logger.debug(traceback.format_exc())
            logger.debug("ERROR:" + e.message)

        return result

    def _tweet(self, message):
        import requests, json
        logger.debug("_tweet: %s" % message)
        payload = {"result": {"parameters": {"message": message, "action": "tweet"} } }
        headers = {"Content-Type": "application/json"}
        requests.post('https://us-central1-peppersay-f9641.cloudfunctions.net/pepperSay', data=json.dumps(payload), headers=headers, verify=False)

class SBRSpeechReco:
    def __init__(self, session):
        self.session = session
        self.recognizer = None
        self.isRunning = False
        logger.debug("__init__")

    @qi.bind(qi.Int32)
    def start(self):
        result = -1
        if not self.isRunning:
            logger.debug("start service")
            self.isRunning = True
            self.recognizer = SpeechRecognizer(self)
            self.recognizer.start()
            result = 1
        return result

    @qi.bind(qi.Void)
    def stop(self):
        if self.isRunning:
            self.recognizer.stop()
            self.recognizer = None
            self.isRunning = False
            logger.debug("stop service")

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
    register_as_service(SBRSpeechReco)
    app = qi.Application()
    app.run()

if __name__ == "__main__":
    main()

