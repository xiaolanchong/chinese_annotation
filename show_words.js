
const by = {
  ord: function(a, b) {
    return a[3] - b[3];
  },
  py: function(a, b) {
    var l = a[1].toLowerCase();
    var r = b[1].toLowerCase();
    return l > r ? 1 : l < r ? -1 : 0;
  },
  rad: function(a, b) {
    return a[0] > b[0] ? 1 : a[0] < b[0] ? -1 : 0;
  },
  freq: function(a, b) {
    return b[4] - a[4];
  },
};

function vocab_sort(vocab_list, cmp) {
  if (cmp == undefined)
    cmp = "ord";
  vocab_list.sort(by[cmp]);
}

function fill_vocab(vocab_list) {
  const pclass = "py";
  $("#vocab").empty();
  for (var i = 0, l = vocab_list.length; i < l; ++i) {
    $("#vocab").append('<tr><td class="nw">' + vocab_list[i][0] +
      '</td><td class="nw voc' + pclass + '">' + vocab_list[i][1] +
      '</td><td class="nw_def">' + vocab_list[i][2] + '</td></tr>');
  }
}

function add_to_list(word, pys, ens, ord, freq, vocab_list) {
  for (var i = 0, l = pys.length; i < l; ++i) {
    const py = pys[i].replace(/ ([aeoāáǎàēéěèōóǒò])/g, "'$1").replace(/ ([^A-Z])/g, "$1");
    const en = ens[i].replace(/\//g, " / ");
    vocab_list.push([word, py, en, ord, freq]);
  }
}

function show_words() {
  const vocab = text_vocabulary;

  const vocab_list = []
  const vocab_th = parseInt($("#vocab_ls").val(), 10);
  const sort_by = $("#sort_ls").val();

  for (var k in vocab) {
    const item = vocab[k];
    const pys = item[0];
    const ens = item[1];
    const level = vocab[k][2];
    const freq = item[3];
    const ord = item[4];

    if (level < vocab_th)
      continue;
    add_to_list(k, pys, ens, ord, freq, vocab_list);
  }

  vocab_sort(vocab_list, sort_by);
  fill_vocab(vocab_list);
}
