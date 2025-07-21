# hexo-renderer-markdown

This renderer plugin is inspired by [hexo-renderer-markdown-it](https://github.com/hexojs/hexo-renderer-markdown-it). It uses [Markdown-it](https://github.com/markdown-it/markdown-it) as a render engine on [Hexo](http://hexo.io) with more `markdown-it` plugins.

## Main Features

- Support for Markdown
- Extensive Configuration
- Faster than the default renderer | `hexo-renderer-marked`
- [abbr](https://www.npmjs.com/package/markdown-it-abbr)
- [anchor](https://www.npmjs.com/package/markdown-it-anchor)
- [attrs](https://www.npmjs.com/package/markdown-it-attrs)
- [checkbox](https://www.npmjs.com/package/markdown-it-checkbox)
- [deflist](https://www.npmjs.com/package/markdown-it-deflist)
- [emoji](https://www.npmjs.com/package/markdown-it-emoji)
- [footnote](https://www.npmjs.com/package/markdown-it-footnote)
- [ins](https://www.npmjs.com/package/markdown-it-ins)
- [mark](https://www.npmjs.com/package/markdown-it-mark)
- [sub](https://www.npmjs.com/package/markdown-it-sub)
- [sup](https://www.npmjs.com/package/markdown-it-sup)
- [katex](https://www.npmjs.com/package/markdown-it-texmath)

## Installation

```cmd
npm un hexo-renderer-marked --save
npm i hexo-renderer-markdown --save
```

## Configuration

If you want to change some settings, you can add the config to the main hexo `_config.yml` file.

```yml
markdown:
  render:
    html: true
    xhtmlOut: false
    breaks: true
    langPrefix: language-
    linkify: true
    typographer: true
    quotes: “”‘’
  plugins:
    markdown-it-anchor:
      level: 1
      permalink: false
      slugify: function (s) {return encodeURIComponent(String(s).trim().toLowerCase().replace(/\s+/g, "-"));} # String starting with 'function' will be parsed as a function that satisfies the plugin.
      tabIndex: -1
      uniqueSlugStartIndex: 1
    markdown-it-attrs:
      leftDelimiter: "{"
      rightDelimiter: "}"
      allowedAttributes: []
    markdown-it-checkbox:
      divWrap: false
      divClass: checkbox
      idPrefix: checkbox
    markdown-it-texmath:
      katexCssSrc: //cdn.jsdelivr.net/npm/katex/dist/katex.min.css
      texmathCssSrc: //cdn.jsdelivr.net/npm/markdown-it-texmath/css/texmath.min.css
      texmathDelimiters: dollars
      throwOnError: false
      errorColor: "#cc0000"
      macros: { "\\RR": "\\mathbb{R}" }
```

## Disable `markdown-it` Plugins

Now you can disable the default built-in plugins with giving them the setting `disabled: true`.

## Add `markdown-it` Plugins

If you want to add a new `markdown-it-something` plugin, it's fairly simple.

1. Install the plugin

```cmd
npm i markdown-it-something --save
```

2. Config the `_config.yml`

```yml
markdown:
  # ...
  plugins:
    markdown-it-something:
      option_example: value_example
      _parser: parser.use(require(pugs), pugs_opt) # This describes how to load the plugin because some plugins have nonstandard load style. The string will be 'eval' to execute. 'parser' - the markdown-it parser instance, 'pugs' - the plugin name, 'pugs_opt' - the plugin options.
```

## Bug Reports

If you have any bugs to report, you're welcome to file an [issue](https://github.com/niemingzhao/hexo-renderer-markdown/issues).
