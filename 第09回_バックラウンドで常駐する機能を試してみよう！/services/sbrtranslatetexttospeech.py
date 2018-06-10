#!/usr/bin/env python
# encoding: utf-8

import qi

class SBRTranslateTextToSpeech:
    def __init__(self, session):
        import os
        self._session = session
        self._libPath = "%s/../libs" % os.path.abspath(os.path.dirname(__file__))
        self._azure_key = "YOUR AZURE KEY"
        self._tts = self._session.service("ALTextToSpeech")
        self.token = None
        self.reuse_token_until = 0

    @qi.bind(qi.Void, paramsType=(qi.String,))
    def speech(self, text):
        self._loadLib()
        token = self._get_access_token(self._azure_key)
        english = self._translator(str(text), "en", token)
        self._unloadLib()

        self._speech(english)

    def _loadLib(self):
        import sys
        sys.path.append(self._libPath)

    def _unloadLib(self):
        import sys
        if self._libPath and self._libPath in sys.path:
            sys.path.remove(self._libPath)

    def _get_access_token(self, key):
        try:
            import requests
            from datetime import timedelta
            from datetime import datetime

            if (self.token is None) or (datetime.utcnow() > self.reuse_token_until):

                token_service_url = 'https://api.cognitive.microsoft.com/sts/v1.0/issueToken'
                request_headers = {'Ocp-Apim-Subscription-Key': key}

                response = requests.post(token_service_url, headers=request_headers)
                response.raise_for_status()

                self.token = response.content
                self.reuse_token_until = datetime.utcnow() + timedelta(minutes=5)
        except Exception as e:
            pass
        return self.token


    def _translator(self, text, lang, token):
        import requests
        from xml.etree import ElementTree
        result = ""
        try:
            headers = {
                'Authorization': 'Bearer ' + token
            }

            query = {
                'to': lang,
                'text': text
            }

            response = requests.request('GET', 'https://api.microsofttranslator.com/V2/Http.svc/Translate', headers=headers, params=query)
            translation = ElementTree.fromstring(response.text.encode('utf-8'))
            result = translation.text
        except Exception as e:
            pass

        return result

    def _speech(self, text):
        default = self._tts.getLanguage()   
        self._tts.setLanguage("English")
        try:
            self._tts.say("\\RSPD=110\\\\vct=130\\ " + text)
        except Exception as e:
            pass
        self._tts.setLanguage(default)


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
    register_as_service(SBRTranslateTextToSpeech)
    app = qi.Application()
    app.run()

if __name__ == "__main__":
    main()

