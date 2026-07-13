---
layout: post

title: Multilingual sites in Jekyll, Part 4
author: Andrea Buran

date: 2021-08-15T08:00:00+03:00
tags: [approach, development, Jekyll, multilingual, site]

description: This series of articles illustrates my approach to creating a multilingual site in Jekyll.
excerpt: We place a dedicated page named `sitemap.xml` in each language subdirectory of the site.
exordium: This series of articles ([Part 1](http://andreaburan.com/post/multilingual-sites-in-jekyll.html), [Part 2](http://andreaburan.com/post/multilingual-sites-in-jekyll-2.html), [Part 3](http://andreaburan.com/post/multilingual-sites-in-jekyll-3.html), [Part 4](http://andreaburan.com/post/multilingual-sites-in-jekyll-4.html)) and this [basic *GitHub Pages* site](https://ranbureand.github.io/multilingual-experiment/) illustrate my approach to creating a multilingual site in *[Jekyll](https://jekyllrb.com/ "Jekyll")*.

published: true
---

[[toc]]

## Multilingual sitemaps

To serve a multilingual sitemap, we need to create a [Sitemap index](https://www.sitemaps.org/protocol.html#index "Sitemaps XML Format, Sitemap index") file and list a Sitemap file for each language we support.

### Sitemap index file

We place the page named `sitemap.html` in the root directory of the site. It points to the other localized sitemaps in the respective language subfolders.

{% raw %}
``` liquid
---
layout: none

sitemap:
  excluded: true
---

<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  {%- assign pages = site.pages | where: 'language_reference', 'sitemap' %}

  {%- for page in pages %}
    <sitemap>
      <loc>{{ site.absoluteurl }}{{ page.url | remove: 'index.html' }}</loc>

      {%- if page.sitemap.lastmod %}
        {%- assign lastmod = page.sitemap.lastmod | date: '%Y-%m-%d' %}
      {%- elsif page.date %}
        {%- assign lastmod = page.date | date_to_xmlschema %}
      {%- else %}
        {%- assign lastmod = site.time | date_to_xmlschema %}
      {%- endif %}
      <lastmod>{{ lastmod }}</lastmod>
    </sitemap>
  {%- endfor %}

</sitemapindex>
```
{: .code-l }
{% endraw %}

By setting the following variables in the front matter of the Sitemap index file:

{% raw %}
``` yaml
sitemap:
  excluded: true
```
{: .code-m }
{% endraw %}

we make sure to exclude it from the list of pages returned in each language Sitemap file.

### Sitemap files

We then place a dedicated `sitemap.xml` page in each of the language subdirectories of the site. For example, here is the front matter of the English page `sitemap.xml`:

{% raw %}
``` liquid
---
layout: none

title: English Sitemap

language: en
language_reference: sitemap

sitemap:
  excluded: true
---

<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  {%- assign posts = site.posts | sort: 'date' | where: 'language', page.language | where: 'published', true %}

  {%- for post in posts reversed %}
    {%- unless post.sitemap.excluded == true %}
    <url>
      <loc>{{ site.absoluteurl }}{{ post.url }}</loc>

      {%- if post.sitemap.lastmod %}
        {%- assign lastmod = post.sitemap.lastmod | date: '%Y-%m-%d' %}
      {%- elsif post.date %}
        {%- assign lastmod = post.date | date_to_xmlschema %}
      {%- else %}
        {%- assign lastmod = site.time | date_to_xmlschema %}
      {%- endif %}
      <lastmod>{{ lastmod }}</lastmod>

      {%- if post.sitemap.changefreq %}
        {%- assign changefreq = post.sitemap.changefreq %}
      {%- else %}
        {%- assign changefreq = 'monthly' %}
      {%- endif %}
      <changefreq>{{ changefreq }}</changefreq>

      {%- if post.sitemap.priority %}
        {%- assign priority = post.sitemap.priority %}
      {%- else %}
        {%- assign priority = 0.5 %}
      {%- endif %}
      <priority>{{ priority }}</priority>
    </url>
    {%- endunless %}
  {%- endfor %}

  {%- assign pages = site.pages | where: 'language', page.language %}

  {%- for page in pages %}
    {%- unless page.sitemap.excluded == true %}
    <url>
      <loc>{{ site.absoluteurl }}{{ page.url | remove: 'index.html' }}</loc>

      {%- if post.sitemap.lastmod %}
        {%- assign lastmod = page.sitemap.lastmod | date: '%Y-%m-%d' %}
      {%- elsif post.date %}
        {%- assign lastmod = page.date | date_to_xmlschema %}
      {%- else %}
        {%- assign lastmod = site.time | date_to_xmlschema %}
      {%- endif %}
      <lastmod>{{ lastmod }}</lastmod>

      {%- if page.sitemap.changefreq %}
        {%- assign changefreq = page.sitemap.changefreq %}
      {%- else %}
        {%- assign changefreq = 'monthly' %}
      {%- endif %}
      <changefreq>{{ changefreq }}</changefreq>

      {%- if page.sitemap.priority %}
        {%- assign priority = page.sitemap.priority %}
      {%- else %}
        {%- assign priority = 0.3 %}
      {%- endif %}
      <priority>{{ priority }}</priority>
    </url>
    {%- endunless %}
  {%- endfor %}

</urlset>
```
{: .code-l }
{% endraw %}

Each page contains two *for* loops:

+ the first loop goes through the array of posts and returns those that do not have the variables `sitemap: excluded: true` set in their front matter
+ the second loop goes through the array of pages and, similarly, returns those that do not have the variables `sitemap: excluded: true` set in their front matter

We can override the `lastmod`, `changefreq`, and `priority` default values by setting the following variables in the front matter of the file:

{% raw %}
``` yaml
sitemap:
  lastmod: 2021-08-15 08:00:00 +0300
  changefreq: monthly
  priority: 0.5
```
{: .code-m }
{% endraw %}

Again, we can exclude a post or page from being returned in a sitemap by setting the following variables in the front matter of the file:

{% raw %}
``` yaml
sitemap:
  excluded: true
```
{: .code-m }
{% endraw %}

### RSS feed

*Coming soon…*

### Page not found

*Coming soon…*

## Resources

+ [Creating a multilingual blog with Jekyll](https://forestry.io/blog/creating-a-multilingual-blog-with-jekyll/ "Creating a multilingual blog with Jekyll")
+ [Making Jekyll multilingual](https://sylvaindurand.org/making-jekyll-multilingual/ "Making Jekyll multilingual")
+ [Making a multilingual website with Jekyll collections](https://www.kooslooijesteijn.net/blog/multilingual-website-with-jekyll-collections "Making a multilingual website with Jekyll collections")
+ [Multilingual Jekyll: How The Programming Historian does that](https://matthewlincoln.net/2020/03/01/multilingual-jekyll.html "Multilingual Jekyll: How The Programming Historian does that")
+ [Multilingual Jekyll websites](https://www.usecue.com/blog/multilingual-jekyll-websites/ "Multilingual Jekyll websites")

## Afterword

If you have any suggestions or spot something worth fixing, please feel free to either [drop me a line](andreaburan.com/ "Andrea Buran’s Sitefolio") or [create an issue on GitHub](https://github.com/ranbureand/multilingual-experiment/issues). Thoughts, critiques, suggestions are welcomed.

Thank you!