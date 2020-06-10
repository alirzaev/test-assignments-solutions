from flask import Flask, request, Response, redirect
from requests import get, head
from re import sub, compile
from bs4 import BeautifulSoup
from bs4.element import Doctype, NavigableString, Comment

PORT = 8080
LOCAL_URL = f'http://localhost:{PORT}'
HABR_DOMAIN = 'habr.com'
HABR_URL = f'https://{HABR_DOMAIN}'

app = Flask(__name__)


def is_html(headers):
    return 'Content-Type' in headers and 'text/html' in headers['Content-Type']


def replace_content(content):
    def navstr_predicate(tag):
        return len(tag.contents) >= 1 and any(isinstance(t, NavigableString) for t in tag.contents)

    def link_predicate(tag):
        if isinstance(tag, (Doctype, Comment, NavigableString)):
            return False
        else:
            return hasattr(tag, 'attrs') and 'href' in tag.attrs and tag['href'].startswith(HABR_URL)

    dom = BeautifulSoup(content, 'html5lib')

    p = compile('\\b([\\w]{6})\\b')
    r = '\\1™'
    for tag in list(dom.find_all(navstr_predicate)):
        for navstr in (t for t in tag.contents if isinstance(t, NavigableString)):
            if navstr.parent.name not in ['script', 'style']:
                s = str(navstr.string)
                s = sub(p, r, s)
                navstr.replace_with(s)

    for tag in list(dom.find_all(link_predicate)):
        tag.attrs['href'] = tag['href'].replace(HABR_URL, LOCAL_URL)

    return str(dom)


@app.route('/', methods=['GET'], defaults={'path': ''})
@app.route('/<path:path>', methods=['GET'])
def proxy(path):
    request_headers = dict(request.headers)
    request_headers['Host'] = HABR_DOMAIN

    request_url = f'{HABR_URL}/{path}'

    response = get(request_url, headers=request_headers)

    status_code = response.status_code
    response_headers = response.headers
    response_content = response.content

    if is_html(response_headers):
        response_content = replace_content(response_content.decode('utf-8')).encode('utf-8')

    response_headers.pop('Content-Encoding', None)
    response_headers.pop('Transfer-Encoding', None)

    response_headers['Content-Length'] = f'{len(response_content)}'

    return Response(
        response=response_content,
        status=status_code,
        headers=dict(response_headers)
    )


if __name__ == '__main__':
    app.run(port=PORT, debug=True)
