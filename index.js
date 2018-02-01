'use strict';

const def_pugs_list = [
  'markdown-it-abbr',
  'markdown-it-anchor',
  'markdown-it-attrs',
  'markdown-it-checkbox',
  'markdown-it-deflist',
  'markdown-it-emoji',
  'markdown-it-footnote',
  'markdown-it-ins',
  'markdown-it-katex',
  'markdown-it-mark',
  'markdown-it-sub',
  'markdown-it-sup'
];
const def_pugs_conf = {
  'markdown-it-anchor': {
    level: 1,
    slugify: string => string,
    permalink: true,
    permalinkClass: 'header-anchor',
    permalinkSymbol: '¶',
    permalinkBefore: true
  },
  'markdown-it-checkbox': {
    divWrap: false,
    divClass: 'checkbox',
    idPrefix: 'checkbox'
  },
  'markdown-it-katex': {
    throwOnError: false,
    errorColor: '#cc0000',
    csslink: 'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.6.0/katex.min.css'
  }
};
const def_main_conf = {
  html: true,
  xhtmlOut: false,
  breaks: true,
  linkify: true,
  typographer: true,
  quotes: '“”‘’'
};

let renderer = function (data, options) {
  let merge = require('lodash.merge');
  let keys = require('lodash.keys');
  let union = require('lodash.union');
  let config = merge({}, this.config.markdown);
  let main_conf = merge({}, def_main_conf, config.render);
  let pugs_conf = merge({}, def_pugs_conf, config.plugins);
  let pugs_list = union(def_pugs_list, keys(pugs_conf));
  let parser = require('markdown-it')(main_conf);

  parser = pugs_list.reduce(function (parser, pugs) {
    let pugs_opt = merge({}, pugs_conf[pugs]);
    if (pugs_opt.disabled) {
      return parser;
    }
    for (let item in pugs_opt) {
      if (
        typeof pugs_opt[item] === 'string' &&
        pugs_opt[item].startsWith('function (') &&
        pugs_opt[item].endsWith('}')
      ) {
        pugs_opt[item] = eval('(' + pugs_opt[item] + ')');
      }
    }
    if (pugs === 'markdown-it-katex' && data.path) {
      data.text += `\n\n<link rel="stylesheet" href="${pugs_opt.csslink}">`;
    }
    if (pugs_opt._parser) {
      return eval('(' + pugs_opt._parser + ')');
    }
    return parser.use(require(pugs), pugs_opt);
  }, parser);

  return parser.render(data.text);
};

hexo.extend.renderer.register('md', 'html', renderer, true);
hexo.extend.renderer.register('markdown', 'html', renderer, true);
hexo.extend.renderer.register('mkd', 'html', renderer, true);
hexo.extend.renderer.register('mkdn', 'html', renderer, true);
hexo.extend.renderer.register('mdwn', 'html', renderer, true);
hexo.extend.renderer.register('mdtxt', 'html', renderer, true);
hexo.extend.renderer.register('mdtext', 'html', renderer, true);
