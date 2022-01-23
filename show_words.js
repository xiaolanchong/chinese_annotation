/* exported show_words */
/* global text_vocabulary */

'use strict';

const by = {
  ord: function (a, b) {
    return a[3] - b[3];
  },
  py: function (a, b) {
    const l = a[1].toLowerCase();
    const r = b[1].toLowerCase();
    if (l > r) {
      return 1;
    }
    return l < r ? -1 : 0;
  },
  rad: function (a, b) {
    if (a[0] > b[0]) {
      return 1;
    }
    return a[0] < b[0] ? -1 : 0;
  },
  freq: function (a, b) {
    return b[4] - a[4];
  }
};

function vocab_sort(vocab_list, cmp) {
  const cmp_op = typeof cmp === 'undefined' ? 'ord' : cmp;
  vocab_list.sort(by[cmp_op]);
}

// 历史上 ->	歷--
function create_traditional_item(simplified, traditional) {
  if (traditional === simplified) {
    return '';
  }
  let result = '';
  for (let i = 0; i < traditional.length; ++i) {
    if (i >= simplified.length) {
      result += traditional[i];
      continue;
    }
    result += simplified[i] === traditional[i] ? '-' : traditional[i];
  }
  return result;
}

function fill_vocab(vocab_list) {
  const pclass = 'py';
  $('#vocab').empty();
  if (vocab_list.length) {
    $('#vocab').append('<tr><th>№</th><th>Слово (упрощ. иероглифы)</th>' +
      '<th>Слово (трад. иероглифы)</th><th>Произношение</th><th>Значение</th></tr>');
  }
  for (let i = 0, l = vocab_list.length; i < l; ++i) {
    const trad = create_traditional_item(vocab_list[i][0], vocab_list[i][5]);
    $('#vocab').append('<tr>' +
      '<td class="nw_num">' + (i + 1) + '</td>' +
      '<td class="nw">' + vocab_list[i][0] + '</td>' +
      '<td class="nw">' + trad + '</td>' +
      '<td class="nw voc' + pclass + '">' + vocab_list[i][1] + '</td>' +
      '<td class="nw_def">' + vocab_list[i][2] + '</td>' +
      '</tr>');
  }
}

function add_to_list(vocab_list, vocab_item) {
  for (let i = 0, l = vocab_item.pronunciations.length; i < l; ++i) {
    let py = vocab_item.pronunciations[i].replace(/ ([aeoāáǎàēéěèōóǒò])/g, '\'$1');
    py = py.replace(/ ([^A-Z])/g, '$1');
    const en = vocab_item.definitions[i].replace(/\//g, ' / ');
    vocab_list.push([vocab_item.word, py, en, vocab_item.order,
      vocab_item.frequency, vocab_item.traditional]);
  }
}

function show_words() {
  const vocab = text_vocabulary;

  const vocab_list = [];
  const vocab_th = parseInt($('#vocab_ls').val(), 10);
  const sort_by = $('#sort_ls').val();

  for (let k in vocab) {
    if (!vocab.hasOwnProperty(k)) {
      continue;
    }
    const item = vocab[k];
    const level = vocab[k][2];
    const vocab_item = {
      word: k,
      pronunciations: item[0],
      definitions: item[1],
      frequency: item[3],
      order: item[4],
      traditional: item[5],
      level: level
    };

    if (level < vocab_th) {
      continue;
    }
    add_to_list(vocab_list, vocab_item);
  }

  vocab_sort(vocab_list, sort_by);
  fill_vocab(vocab_list);
}
