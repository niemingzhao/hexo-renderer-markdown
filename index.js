"use strict";

const merge = require("lodash.merge");
const union = require("lodash.union");

const functionize = (object = {}) => {
  for (let [k, v] of Object.entries(object || {})) {
    if (typeof v === "string" && v.startsWith("function (") && v.endsWith("}")) {
      object[k] = eval("(" + v + ")");
    } else if (typeof v === "object") {
      object[k] = functionize(v);
    }
  }
  return object;
};

const def_pugs_list = [
  "markdown-it-abbr",
  "markdown-it-anchor",
  "markdown-it-attrs",
  "markdown-it-checkbox",
  "markdown-it-deflist",
  "markdown-it-emoji",
  "markdown-it-footnote",
  "markdown-it-ins",
  "markdown-it-mark",
  "markdown-it-sub",
  "markdown-it-sup",
  "markdown-it-texmath",
];
const def_pugs_conf = {
  "markdown-it-anchor": {
    level: 1,
    permalink: undefined,
    slugify: (s) => encodeURIComponent(String(s).trim().toLowerCase().replace(/\s+/g, "-")),
    tabIndex: -1,
    uniqueSlugStartIndex: 1,
  },
  "markdown-it-attrs": {
    leftDelimiter: "{",
    rightDelimiter: "}",
    allowedAttributes: [],
  },
  "markdown-it-checkbox": {
    divWrap: false,
    divClass: "checkbox",
    idPrefix: "checkbox",
  },
  "markdown-it-texmath": {
    katexCssSrc: "//cdn.jsdelivr.net/npm/katex/dist/katex.min.css",
    texmathCssSrc: "//cdn.jsdelivr.net/npm/markdown-it-texmath/css/texmath.min.css",
    texmathDelimiters: "dollars",
    throwOnError: false,
    errorColor: "#cc0000",
    macros: { "\\RR": "\\mathbb{R}" },
  },
};
const def_main_conf = {
  html: true,
  xhtmlOut: false,
  breaks: true,
  langPrefix: "language-",
  linkify: true,
  typographer: true,
  quotes: "“”‘’",
};

const renderer = function (data, options) {
  let config = merge({}, this.config.markdown);
  let main_conf = merge({}, def_main_conf, config.render);
  let pugs_conf = merge({}, def_pugs_conf, config.plugins);
  let pugs_list = union(def_pugs_list, Object.keys(pugs_conf));
  let parser = require("markdown-it")(functionize(main_conf));

  parser = pugs_list.reduce((parser, pugs) => {
    let pugs_opt = merge({}, pugs_conf[pugs]);
    if (pugs_opt.disabled) return parser;
    pugs_opt = functionize(pugs_opt);
    if (pugs === "markdown-it-texmath" && data.path) {
      let { katexCssSrc, texmathCssSrc, texmathDelimiters, ...katexOptions } = pugs_opt;
      data.text += `
        \n<link rel="stylesheet" href="${katexCssSrc}">
        \n<link rel="stylesheet" href="${texmathCssSrc}">
      `;
      pugs_opt = {
        engine: require("katex"),
        delimiters: texmathDelimiters,
        katexOptions,
      };
    }
    if (pugs_opt._parser) return eval("(" + pugs_opt._parser + ")");
    if (pugs === "markdown-it-anchor") return parser.use(require(pugs).default, pugs_opt);
    if (pugs === "markdown-it-emoji") return parser.use(require(pugs).full, pugs_opt);
    return parser.use(require(pugs), pugs_opt);
  }, parser);

  return parser.render(data.text);
};

hexo.extend.renderer.register("md", "html", renderer, true);
hexo.extend.renderer.register("markdown", "html", renderer, true);
hexo.extend.renderer.register("mkd", "html", renderer, true);
hexo.extend.renderer.register("mkdn", "html", renderer, true);
hexo.extend.renderer.register("mdwn", "html", renderer, true);
hexo.extend.renderer.register("mdtxt", "html", renderer, true);
hexo.extend.renderer.register("mdtext", "html", renderer, true);
