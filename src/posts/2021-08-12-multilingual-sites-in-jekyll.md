---
layout: post

title: Multilingual sites in Jekyll, Part 1
author: Andrea Buran

date: 2021-08-12T08:00:00+03:00
tags: [approach, development, Jekyll, multilingual, site]

description: This series of articles illustrates my approach to creating a multilingual site in Jekyll.
excerpt: We organize the pages into directories named with ISO language codes, with one directory for each supported language.
exordium: This series of articles ([Part 1](http://andreaburan.com/post/multilingual-sites-in-jekyll.html), [Part 2](http://andreaburan.com/post/multilingual-sites-in-jekyll-2.html), [Part 3](http://andreaburan.com/post/multilingual-sites-in-jekyll-3.html), [Part 4](http://andreaburan.com/post/multilingual-sites-in-jekyll-4.html)) and this [basic *GitHub Pages* site](https://ranbureand.github.io/multilingual-experiment/) illustrate my approach to creating a multilingual site in *[Jekyll](https://jekyllrb.com/ "Jekyll")*.

published: true
---

[[toc]]

## Preface

When I found myself coding a multilingual site in *[Jekyll](https://jekyllrb.com/ "Jekyll")*, I stumbled on [a lot of useful resources]({% post_url 2021-08-15-multilingual-sites-in-jekyll-4 %}#resources) while surfing the Web, but I struggled quite a bit to digest and replicate their approaches due to the lack of a concrete, working example to look at.

At first, I tried to replicate their approaches directly in the site I was working on, but this quickly backfired because it proved to be too big of a bite to chew for a designer who codes.

Not giving up, I then decided to create a basic site from scratch to focus on learning how to handle multiple languages in *Jekyll* without any extra complexity in the picture.

That very same basic site is hosted [in this repository](https://github.com/ranbureand/multilingual-experiment/), which I gladly share with the world as an example project, hoping to help anyone interested in coding a multilingual site using *Jekyll*.

## Foreword

A few words before starting. Sites built with the approach illustrated in this series of articles:

+ can support [as many languages as needed](#directory-structure)
+ can serve pages or posts that may not need to be translated into all supported languages
+ have a [language switch]({% post_url 2021-08-14-multilingual-sites-in-jekyll-3 %}#language-switchhtml) that can either direct web surfers to view the current page or post in the selected language, if available, or direct them to an alternative [fallback page]({% post_url 2021-08-14-multilingual-sites-in-jekyll-3 %}#fallback-page)
+ do not require you to install custom plugins
+ leverage the basics of Jekyll and thus making them relatively future-proof (famous last words)
+ can be published as *GitHub Pages* sites

Specifically, [the basic site](https://ranbureand.github.io/multilingual-experiment/) hosted [in this repository](https://github.com/ranbureand/multilingual-experiment) and used as a concrete example to illustrate my approach:

+ is visually quite crude, as the focus is on illustrating a structural (not visual) approach to building multilingual sites
+ supports English and Italian as example languages

## Directory structure

The directory structure of the basic site looks like this:

{% raw %}
```
.
├── _data
│   └── snippets.yml
├── _includes
│   ├── head.html
│   ├── header.html
│   ├── localizations.html
│   └── references.html
├── _layouts
│   ├── base.html
│   ├── index.html
│   ├── page.html
│   └── post.html
├── _posts
│   ├── en
│   │   ├── YYYY-MM-DD-title.markdown
│   │   ├── …
│   │   └── YYYY-MM-DD-title.markdown
│   └── it
│       ├── YYYY-MM-DD-titolo.markdown
│       ├── …
│       └── YYYY-MM-DD-titolo.markdown
├── 404.html
├── config.yml
├── en
│   ├── drafts.html
│   ├── feed.xml
│   ├── postface.html
│   ├── preface.html
│   ├── sitemap.xml
│   └── stories.html
├── index.html
├── it
│   ├── bozze.html
│   ├── feed.xml
│   ├── prefazione.html
│   ├── sitemap.xml
│   └── storie.html
└── sitemap.xml
```
{: .code-m }
{% endraw %}

### Pages

We organize the pages into as many subdirectories as the languages we plan to support, naming them using [ISO language codes](https://www.w3schools.com/tags/ref_language_codes.asp "HTML Language Code Reference in W3Schools"). The basic site has two subdirectories, one named `en` for grouping the English pages and one named `it` for grouping the Italian pages.

{% raw %}
```
├── …
├── en
│   ├── drafts.html
│   ├── feed.xml
│   ├── postface.html
│   ├── preface.html
│   ├── sitemap.xml
│   └── stories.html
├── …
├── it
│   ├── bozze.html
│   ├── feed.xml
│   ├── prefazione.html
│   ├── sitemap.xml
│   └── storie.html
├── …
```
{: .code-m }
{% endraw %}

After *Jekyll* has built the site, we can reach, for example, the English page `stories.html` and the Italian page `storie.html` at the URLs `www.site.ext/en/stories.html` and `www.site.ext/it/storie.html`, respectively.

#### Exceptions

But, of course, there are exceptions. We place the pages `404.html`, `index.html`, and `sitemap.html` in the root directory of the site. Why?

`404.html` and `index.html` are *unique* pages. Jekyll builds and serves automatically one and only one of them at a time.

`sitemap.xml` is a [Sitemap index](https://www.sitemaps.org/protocol.html#index "Sitemaps XML Format, Sitemap index") which points to other localized sitemaps in the respective language subfolders (read the section [Multilingual sitemaps]({% post_url 2021-08-15-multilingual-sites-in-jekyll-4 %}#multilingual-sitemaps) for more details).

### Posts

We organize the posts following a similar logic. The basic site has two subdirectories in the folder named `_posts`, one named `en` for grouping the English posts and one named `it` for grouping the Italian posts.

{% raw %}
```
├── …
├── _posts
│   ├── en
│   │   ├── YYYY-MM-DD-title.markdown
│   │   ├── …
│   │   └── YYYY-MM-DD-title.markdown
│   └── it
│       ├── YYYY-MM-DD-titolo.markdown
│       ├── …
│       └── YYYY-MM-DD-titolo.markdown
├── …
```
{: .code-m }
{% endraw %}

#### Configuration

We then add the following configuration options in the `_config.yml` file placed in the site’s root directory:

{% raw %}
``` yaml
defaults:
-
  scope:
    path: '_posts/en'
    type: 'posts'
  values:
    permalink: 'en/story/:title'
    language: en
-
  scope:
    path: '_posts/it'
    type: 'posts'
  values:
    permalink: 'it/storia/:title'
    language: it
```
{: .code-m }
{% endraw %}

By setting global permalinks for posts, we can reach, for example, the English post named `2021-01-01-hello-world.markdown` and the Italian post named `2021-01-01-ciao-mondo.markdown` at the URLs `www.site.ext/en/story/hello-world.html` and `www.site.ext/it/storia/ciao-mondo.html`, respectively.
