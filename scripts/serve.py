#!/usr/bin/env python3
"""本机测试用的静态服务器（跟 `python3 -m http.server 8792 --bind 127.0.0.1` 一样，只是 listen 队列加大）。
Python 默认 request_queue_size=5，Chrome 一次开三十多条连线载入素材时会被 ERR_CONNECTION_RESET，测试就会偶发「页面没载入」。
用法：python3 scripts/serve.py [端口] [资料夹]    （默认 8792、当前资料夹）。素材多的工具（物理沙盒、生图素材几十张）本机测试用这个。"""
import http.server, os, sys, functools

class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass

class Server(http.server.ThreadingHTTPServer):
    request_queue_size = 256
    daemon_threads = True

def make(port=8792, root=None, quiet=True):
    root = root or os.getcwd()
    h = functools.partial(Quiet if quiet else http.server.SimpleHTTPRequestHandler, directory=root)
    return Server(('127.0.0.1', port), h)

if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8792
    root = os.path.abspath(sys.argv[2]) if len(sys.argv) > 2 else None
    print(f'http://127.0.0.1:{port}  （Ctrl+C 结束）')
    make(port, root, quiet=False).serve_forever()
