import sys
from pathlib import Path
import re
import jinja2
import urllib.request
import urllib.parse
from multipart_sender import MultiPartForm

env = jinja2.Environment(loader=jinja2.PackageLoader('annotate', '.'))
template = env.get_template('output_file.template.htm')


def replace_html_content(title: str, content: str):
    m = re.search('dI.vocab = (.*?)</script>', content, re.UNICODE | re.S)
    assert m is not None
    vocab_json_str = m.group(1)
    m = re.search('<div id="annotated">(.*?)<div style="clear:both">', content, re.UNICODE | re.S)
    assert m is not None
    annotate_spans = m.group(1)
    annotate_spans = annotate_spans.replace('"onmouseover', '" onmouseover')
    input_params = {
        'simplified_hanzi': True,
        'title': title,
        'vocabulary': vocab_json_str,
        'annotation': annotate_spans,
    }
    return template.render(**input_params, sort_keys=True, indent=2)


def download_annotated_text(content, values):
    form = MultiPartForm()
    form.add_field('text', content)
    for (key, val) in values.items():
        form.add_field(key, str(val))
    form.make_result()

    url = 'https://mandarinspot.com/annotate'
    headers = {
        'Content-type': form.get_content_type(),
        'Content-length': len(form.form_data)
    }
    req = urllib.request.Request(url, data=form.form_data, headers=headers)
    fp = urllib.request.urlopen(req)
    assert fp.getcode() < 400, f'Error http code={fp.getcode()} returned'
    return fp.read().decode('utf-8')


def process_text_file(filename, params):
    name_no_ext = Path(filename).stem
    with open(filename, encoding='utf8') as f:
        content = f.read()
    processed_text = download_annotated_text(content, params)
    processed_text = replace_html_content(name_no_ext, processed_text)
    with open(f'{name_no_ext}-out.htm', mode='w', encoding='utf8') as f:
        f.write(processed_text)


def main():
    if len(sys.argv) != 2:
        print('mandarinsport.py <input utf-8 text file>')
        exit(-1)

    file_name = sys.argv[1]
    values = {
        'e': 'utf-8',
        'phs': 'pinyin',
        'show': 'hanzi',
        'vocab': 5,
        'sort': 'ord'
    }
    process_text_file(file_name, values)


if __name__ == "__main__":
    main()
