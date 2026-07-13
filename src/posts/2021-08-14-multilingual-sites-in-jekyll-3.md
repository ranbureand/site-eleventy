---
layout: post

title: Multilingual sites in Jekyll, Part 3
author: Andrea Buran

date: 2021-08-14T08:00:00+03:00
tags: [approach, development, Jekyll, multilingual, site]

description: This series of articles illustrates my approach to creating a multilingual site in Jekyll.
excerpt: We use the `language-switch.html` include to generate an unordered list of all languages supported on the site.
exordium: This series of articles ([Part 1](http://andreaburan.com/post/multilingual-sites-in-jekyll.html), [Part 2](http://andreaburan.com/post/multilingual-sites-in-jekyll-2.html), [Part 3](http://andreaburan.com/post/multilingual-sites-in-jekyll-3.html), [Part 4](http://andreaburan.com/post/multilingual-sites-in-jekyll-4.html)) and this [basic *GitHub Pages* site](https://ranbureand.github.io/multilingual-experiment/) illustrate my approach to creating a multilingual site in *[Jekyll](https://jekyllrb.com/ "Jekyll")*.

published: true
---

[[toc]]

## Includes

The purpose of most of the includes in the basic site is building the navigation.

### header.html

The include `header.html` generates the header in the page. It, in turn, “includes” three more includes:

+ `title.html`
+ `navigation.html`
+ `language-switch.html`

{% raw %}
``` liquid
<header>
  {% include site-title.html %}
  <nav>
    {% include navigation.html %}

    {% include language-switch.html %}
  </nav>
</header>
```
{: .code-l }
{% endraw %}

#### navigation.html

The include `navigation.html` generates an unordered list containing all the published pages with the same `language` variable as the current page.

{% raw %}
``` liquid
<ul>
  {%- assign navigation_pages = site.pages
    | where: 'layout', 'page'
    | where: 'language', page.language
    | where: 'published', true
    | sort: 'order' %}
  {%- for navigation_page in navigation_pages %}
  <li{%- if navigation_page.title == page.title %} class="current"{%- endif %}>
    <a href="{{ site.baseurl }}{{ navigation_page.url }}">{{ navigation_page.title }}</a>
  </li>
  {%- endfor %}
</ul>
```
{: .code-l }
{% endraw %}

In the code above, we create a new variable named `navigation_pages` which returns a list of the pages that, [in their front matter]({% post_url 2021-08-13-multilingual-sites-in-jekyll-2 %}#front-matter), have:

+ the `layout` variable set to `page`
+ the `language` variable set to the language of the current page (`page.language`)
+ the `published` variable set to `true`

We order the list according to the `order` variable, then loop trough the array of pages and generate the list items of the unordered list.

Whenever the title of the current page in the array (`navigation_page.title`) matches the title of the current page (`page.title`), we add a class named `current` to the corresponding `<li/>` tag.

#### language-switch.html

The include `language-switch.html` generates an unordered list containing all the languages supported on the site. You can use the list to switch to other language translations of the current page/post, if available.

{% raw %}
``` liquid
<ul>
  {%- for language in snippets.languages %}

    {%- if page.layout == 'page' %}
      {%- assign navigation_pages = site.pages
        | where: 'language_reference', page.language_reference
        | where: 'language', language[1].slug %}
      {%- if navigation_pages.size == 1 %}
        {%- for navigation_page in navigation_pages %}
          {%- assign url = site.baseurl | append: navigation_page.url %}
        {%- endfor %}
      {%- else %}
        {%- assign navigation_pages = site.pages
          | where: 'language_reference', site.fallback_page
          | where: 'language', language[1].slug %}
        {%- for navigation_page in navigation_pages %}
          {%- assign url = site.baseurl | append: navigation_page.url %}
        {%- endfor %}
      {%- endif %}

    {%- elsif page.layout == 'post' %}
      {%- assign navigation_posts = site.posts
        | where: 'language_reference', page.language_reference
        | where: 'language', language[1].slug %}
      {%- if navigation_posts.size == 1 %}
        {%- for navigation_post in navigation_posts %}
          {%- assign url = site.baseurl | append: navigation_post.url %}
        {%- endfor %}
      {%- else %}
        {%- assign navigation_pages = site.pages
          | where: 'language_reference', site.fallback_page
          | where: 'language', language[1].slug %}
        {%- for navigation_page in navigation_pages %}
          {%- assign url = site.baseurl | append: navigation_page.url %}
        {%- endfor %}
      {%- endif %}

    {%- else %}
      {%- assign navigation_pages = site.pages
        | where: 'language_reference', site.fallback_page
        | where: 'language', language[1].slug %}
      {%- for navigation_page in navigation_pages %}
        {%- assign url = site.baseurl | append: navigation_page.url %}
      {%- endfor %}

    {%- endif %}
    <li{%- if language[1].slug == page.language %} class="current"{%- endif %}>
      <a href="{{ url }}">{{ language[1].value }}</a>
    </li>
  {%- endfor %}
</ul>
```
{: .code-l }
{% endraw %}

In the code above, we loop through the languages defined in the `snippets.yml` file (read the section [Snippets]({% post_url 2021-08-13-multilingual-sites-in-jekyll-2 %}#snippets) for more details).

{% raw %}
``` yaml
languages:
  en:
    value: English
    slug: en
  it:
    value: Italian
    slug: it
```
{: .code-m }
{% endraw %}

The *for* loop contains three different code blocks that run only if specific conditions are met. If we look only at its high-level structure:

{% raw %}
``` liquid
<ul>
  {%- for language in snippets.languages %}

    {%- if page.layout == 'page' %}
      <!-- first code block -->

    {%- elsif page.layout == 'post' %}
      <!-- second code block -->

    {%- else %}
      <!-- third code block -->

    {%- endif %}
    <li {%- if language[1].slug == page.language %} class="current"{%- endif %}>
      <a href="{{ url }}">{{ language[1].value }}</a>
    </li>
  {%- endfor %}
</ul>
```
{: .code-l }
{% endraw %}

We run the first block of code only if the `layout` variable of the current page is set to `page`, else, if it is set to `post`, we run the second block of code, else, if it is set to anything else (or nothing at all), we run the third block of code.

After at least one of the code blocks has been run, we generate the list items of the unordered list.

Whenever the slug of the current language item of the array `snippets.languages` (`language[1].slug`) matches the language of the current page (`page.language`), we add a class named `current` to the corresponding `<li/>` tag.

##### if page.layout == 'page'

{% raw %}
``` liquid
{%- if page.layout == 'page' %}
  {%- assign navigation_pages = site.pages
    | where: 'language_reference', page.language_reference
    | where: 'language', language[1].slug %}
  {%- if navigation_pages.size == 1 %}
    {%- for navigation_page in navigation_pages %}
      {%- assign url = site.baseurl | append: navigation_page.url %}
    {%- endfor %}
  {%- else %}
    {%- assign navigation_pages = site.pages
      | where: 'language_reference', site.fallback_page
      | where: 'language', language[1].slug %}
    {%- for navigation_page in navigation_pages %}
      {%- assign url = site.baseurl | append: navigation_page.url %}
    {%- endfor %}
  {%- endif %}
```
{: .code-l }
{% endraw %}

What does the first block of code do?

{% raw %}
``` liquid
{%- assign navigation_pages = site.pages
  | where: 'language_reference', page.language_reference
  | where: 'language', language[1].slug %}
```
{: .code-l }
{% endraw %}

We create a new variable named `navigation_pages` which returns a list of the pages that, [in their front matter]({% post_url 2021-08-13-multilingual-sites-in-jekyll-2 %}#front-matter), have:

+ the `language_reference` variable equal to the current page’s `language_reference` variable (`page.language_reference`)
+ the `language` variable equal to the slug of the current language item (`language[1].slug`) in the array `snippets.languages`

If we set the front matter of the pages correctly, the size of the array `navigation_pages` should be:

+ either equal to one if the current page **has** a corresponding page translated into the current language item of the array `snippets.languages`
+ or equal to zero if the current page **does not have** a corresponding page translated into the current language item of the array `snippets.languages`

{% raw %}
``` liquid
{%- if navigation_pages.size == 1 %}
  {%- for navigation_page in navigation_pages %}
    {%- assign url = site.baseurl | append: navigation_page.url %}
  {%- endfor %}
```
{: .code-l }
{% endraw %}

If the size of the array `navigation_pages` is equal to one, we loop through the array `navigation_pages` and create a new variable named `url` by combining the `site.baseurl` (defined in the `_config.yml` file) and the URL of the single page (`navigation_page.url`) contained in the array `navigation_pages`.

{% raw %}
``` liquid
{%- else %}
  {%- assign navigation_pages = site.pages
    | where: 'language_reference', site.fallback_page
    | where: 'language', language[1].slug %}
  {%- for navigation_page in navigation_pages %}
    {%- assign url = site.baseurl | append: navigation_page.url %}
  {%- endfor %}
{%- endif %}
```
{: .code-l }
{% endraw %}

If instead, the size of the array `navigation_pages` is equal to zero (or more than one, which is trouble), we do not have a corresponding page in the current language item of the array `snippets.languages` to switch to.

Thus, we provide a fallback page (`site.fallback_page`) so that the web surfers who interact with the language switch and select a language that does not support the current page are at least redirected to a meaningful page in the language they selected.

We set the `fallback_page` in the `_config.yml` file located in the site’s root directory:

{% raw %}
``` yaml
fallback_page: 'stories'
```
{: .code-m }
{% endraw %}

The fallback pages of the basic site are those whose `language_reference` variable is set to `stories`.

Why `stories`? Because—in the context of the basic site—the pages whose `language_reference` variable is set to `stories` function as *home* pages, since they:

+ return a list of all the published posts (they have the same structure as the `index.html` page)
+ have a translated counterpart in all the languages supported on the site

##### elsif page.layout == 'post'

{% raw %}
``` liquid
{%- elsif page.layout == 'post' %}
  {%- assign navigation_posts = site.posts
    | where: 'language_reference', page.language_reference
    | where: 'language', language[1].slug %}
  {%- if navigation_posts.size == 1 %}
    {%- for navigation_post in navigation_posts %}
      {%- assign url = site.baseurl | append: navigation_post.url %}
    {%- endfor %}
  {%- else %}
    {%- assign navigation_pages = site.pages
      | where: 'language_reference', site.fallback_page
      | where: 'language', language[1].slug %}
    {%- for navigation_page in navigation_pages %}
      {%- assign url = site.baseurl | append: navigation_page.url %}
    {%- endfor %}
  {%- endif %}
```
{: .code-l }
{% endraw %}

The second block of code behaves similarly to the first, with the only difference being that we manipulate an array of posts (`navigation_posts`) rather than one of pages (`navigation_pages`).

##### else

{% raw %}
``` liquid
{%- else %}
  {%- assign navigation_pages = site.pages
    | where: 'language_reference', site.fallback_page
    | where: 'language', language[1].slug %}
  {%- for navigation_page in navigation_pages %}
    {%- assign url = site.baseurl | append: navigation_page.url %}
  {%- endfor %}
```
{: .code-l }
{% endraw %}

The third block of code runs in the remote eventuality in which both the first and second blocks of code do not run. so that we make sure, again, to serve a fallback page to our web surfers.

##### Fallback page

How can we be sure that the fallback page truly works?

In this basic site, not all the pages and posts are translated into all the supported languages—on purpose.

| English Pages | Italian Pages |
| - | - |
| preface.html | prefazione.html |
| stories.html | storie.html |
| postface.html | — |

{: .table }

If you go to [the English page *Postface*](https://ranbureand.github.io/multilingual-experiment/en/postface.html) and press on *Italian* in the language switch, you are indeed redirected to the Italian page *Storie*.

| English Posts | Italian Posts |
| - | - |
| hello-world.markdown | ciao-mondo.markdown |
| hello-mars.markdown | ciao-marte.markdown |
| — | ciao-giove.markdown |

{: .table }

Similarly, if you go to [the Italian post *Ciao Giove*](https://ranbureand.github.io/multilingual-experiment/it/storia/ciao-giove) and press on *English* in the language switch, you are indeed redirected to the English page *Stories*.

#### title.html

The include `title.html` generates the title of this basic site.

{% raw %}
``` liquid
{%- if page.language == site.default_language %}
  {%- assign url = site.baseurl | append: '/'%}
{%- else %}
  {%- assign navigation_pages = site.pages
    | where: 'language_reference', site.fallback_page
    | where: 'language', page.language %}
  {%- for navigation_page in navigation_pages %}
    {%- assign url = site.baseurl | append: navigation_page.url %}
  {%- endfor %}
{%- endif %}
<h1>
  <a href="{{ url }}" {%- if page.url == '/' %} class="current"{%- endif %}>{{ site.title }}</a>
</h1>
```
{: .code-l }
{% endraw %}

Again, we have two different code blocks that run only if specific conditions are met.

We run the first code block when the language of the current page (`page.language`) is equal to the default language (`site.default_language`) defined in the `_config.yml` file. Through it, we create a new variable named `url` by combining the `site.baseurl` (defined in the `_config.yml` file) and `/`, which is the domain name of the site. Web surfers who browse the site in the default language are directed to the main page when they press on the title.

Else, we run the second code block to provide the usual fallback page already discussed above (read the section [language-switch.html](#language-switchhtml) for more details). Web surfers who browse the site in a language different from the default one are directed to the fallback page in their current language when they press on the title.

### localizations.html

The include `localizations.html` adds `<link rel="alternate" … />` tags in the `<head/>` tag of a page [to tell search engines](https://developers.google.com/search/docs/advanced/crawling/localized-versions "Tell Google about localized versions of your page") if there are multiple versions of the page for different languages or regions.

{% raw %}
``` liquid
{%- if page.layout == 'page' %}
  {%- assign localized_pages = site.pages
    | where: 'language_reference', page.language_reference
    | sort: 'language' %}
  {%- for localized_page in localized_pages %}
    <link rel="alternate" hreflang="{{ localized_page.language }}" href="{{ site.baseurl }}{{ localized_page.url }}" />
  {%- endfor %}

{%- elsif page.layout == 'post' %}
  {%- assign localized_posts = site.posts
  | where: 'language_reference', page.language_reference
  | sort: 'language' %}
  {%- for localized_post in localized_posts %}
    <link rel="alternate" hreflang="{{ localized_post.language }}" href="{{ site.baseurl }}{{ localized_post.url }}" />
  {%- endfor %}

{%- elsif page.layout == 'index' %}
  {%- assign localized_pages = site.pages
    | where: 'language_reference', site.fallback_page
    | sort: 'language' %}
  {%- for localized_page in localized_pages %}
    <link rel="alternate" hreflang="{{ localized_page.language }}" href="{{ site.baseurl }}{{ localized_page.url }}" />
  {%- endfor %}
{%- endif %}
```
{: .code-xl }
{% endraw %}

Again, we have three different code blocks that run only if specific conditions are met (read the section [language-switch.html](#language-switchhtml) for more details).
