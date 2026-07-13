---
order: 1

layout: project

title: 'Hello Outer Space!'
author: 'Andrea Buran'

time: '2018'

categories: [All, Non-Commercial]
tags: [CSS, HTML, Markdown, stress test, styles, typographic elements]

preview_image: 'hello_outer_space_00.jpg'
preview_color: '#020202'

description: 'The following article is used as a testing ground for all the styles that shapes the body text prose and code of the Sitefolio.'
exordium: 'The following article is used as a testing ground for all the styles that shapes the body text prose, code and form of this very site.'

published: false
---

<div class="figures">
    {% include image.html
        size="xl"
        h="1" w="2"
        src="hello_outer_space_00.jpg"
        alt="A pure black placeholder image used to stress test the img style of this very site."
        color="#000"
    %}
</div>

# Heading Level #1

## Heading Level #2

### Heading Level #3

#### Heading Level #4

##### Heading Level #5

###### Heading Level #6

A paragraph (from the Greek paragraphos, “to write beside” or “written beside”) is a self-contained unit of a discourse in writing dealing with a particular point or idea.

A paragraph consists of one or more sentences. Though not required by the syntax of any language, paragraphs are usually an expected part of formal writing, used to organize longer prose.

> A block quotation (also known as a long quotation or extract) is a quotation in a written document, that is set off from the main text as a paragraph, or block of text, and typically distinguished visually using indentation and a different typeface or smaller size quotation.
>
> — <cite>[Video](http://www.youtube.com/watch?v=6r7E-69MIOU "Matt Cutts on YouTube"), Matt Cutts.</cite>

This text[^first-footnote] has a first footnote.

This text[^second-footnote] has a second footnote.

[This text](http://www.andreaburan.com/ "Andrea Buran’s Sitefolio") is a hyperlink.

**This text** is given strong importance.

*This text* is given emphasis.

<del>This text</del> is deleted while <ins>this text</ins> is inserted.

<sup>This text</sup> is a superscript, such as <sup>®</sup>.

<sub>This text</sub> is a subscript, such as H<sub>2</sub>O.

<small>This small text is small <br/>for for fine print, etc</small>.

This is an <abbr title="Abbreviation">Abbr</abbr>, such as <abbr title="HyperText Markup Language">HTML</abbr>.

This is a keyboard input, such as <kbd>Cmd</kbd>.

<q cite="https://developer.mozilla.org/en-US/docs/HTML/Element/q">This text</q> is a short inline quotation.

This is a <dfn>dfn element</dfn> and indicates a definition.

This is a <mark>mark element</mark> and indicates a highlight.

`This text` is an inline code.

<samp>This text</samp> is a sample output from a computer program.

This is a <var>variable element</var>, such as <var>x</var> = <var>y</var>.

***

+ This is a list item in an unordered list
+ An unordered list is a list in which the sequence of items is not important. Sometimes, an unordered list is a bulleted list. And this is a long list item in an unordered list that can wrap onto a new line.
+ Lists can be nested inside of each other
    + This is a nested list item
    + This is another nested list item in an unordered list
+ This is the last list item

1. This is a list item in an ordered list
1. An ordered list is a list in which the sequence of items is important. An ordered list does not necessarily contain sequence characters.
1. Lists can be nested inside of each other
    1. This is a nested list item
    1. This is another nested list item in an ordered list
1. This is the last list item

This is a code block:

{% raw %}
``` javascript
@mixin face($status: sans) {
  @if $status == "sans" {
    font-family: "IBM Plex Sans", "Helvetica Neue", Arial, sans-serif;
  } @else if $status == "serif" {
    font-family: "IBM Plex Serif", serif;
  } @else if $status == "mono" {
    font-family: "IBM Plex Mono", "Andale Mono", "Monaco", monospace;
  }
}
```
{: .code-m }
{% endraw %}

and this is another code block:

{% raw %}
``` javascript

const fruits = ['Banana', 'Orange', 'Apple', 'Mango'];
let fLen = fruits.length;

let text = '<ul>';
for (let i = 0; i < fLen; i++) {
  text += '<li>' + fruits[i] + '</li>';
}
text += '</ul>';

document.getElementById('demo').innerHTML = text;

```
{: .code-l }
{% endraw %}

and this is yet another code block:

{% raw %}
``` liquid
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
{: .code-xl }
{% endraw %}

<div class="figures">
    {% include image.html
        size="xl"
        h="3" w="4"
        src="hello_outer_space_00.jpg"
        alt="A pure black placeholder image used to stress test the img style of this very site."
        color="#000"
    %}
</div>

<div class="figures">
    {% include image.html
        size="l"
        h="1" w="2"
        src="hello_outer_space_01.jpg"
        alt="A pure black placeholder image used to stress test the img style of this very site."
        color="#000"
    %}
</div>

<div class="figures">
    {% include image.html
        size="m"
        h="3" w="4"
        src="hello_outer_space_00.jpg"
        alt="A pure black placeholder image used to stress test the img style of this very site."
        color="#000"
    %}
    {% include image.html
        size="m"
        h="3" w="4"
        src="hello_outer_space_00.jpg"
        alt="A pure black placeholder image used to stress test the img style of this very site."
        color="#000"
    %}
</div>

<div class="figures">
    {% include image.html
        size="s"
        h="1" w="2"
        src="hello_outer_space_01.jpg"
        alt="A pure black placeholder image used to stress test the img style of this very site."
        color="#000"
    %}
    {% include image.html
        size="s"
        h="1" w="2"
        src="hello_outer_space_01.jpg"
        alt="A pure black placeholder image used to stress test the img style of this very site."
        color="#000"
    %}
    {% include image.html
        size="s"
        h="1" w="2"
        src="hello_outer_space_01.jpg"
        alt="A pure black placeholder image used to stress test the img style of this very site."
        color="#000"
    %}
    {% include image.html
        size="s"
        h="1" w="2"
        src="hello_outer_space_01.jpg"
        alt="A pure black placeholder image used to stress test the img style of this very site."
        color="#000"
    %}
</div>

<div class="figures">
    {% include image.html
        size="xs"
        h="3" w="4"
        src="hello_outer_space_00.jpg"
        alt="A pure black placeholder image used to stress test the img style of this very site."
        color="#000"
    %}
    {% include image.html
        size="xs"
        h="3" w="4"
        src="hello_outer_space_00.jpg"
        alt="A pure black placeholder image used to stress test the img style of this very site."
        color="#000"
    %}
    {% include image.html
        size="xs"
        h="3" w="4"
        src="hello_outer_space_00.jpg"
        alt="A pure black placeholder image used to stress test the img style of this very site."
        color="#000"
    %}
    {% include image.html
        size="xs"
        h="3" w="4"
        src="hello_outer_space_00.jpg"
        alt="A pure black placeholder image used to stress test the img style of this very site."
        color="#000"
    %}
    {% include image.html
        size="xs"
        h="3" w="4"
        src="hello_outer_space_00.jpg"
        alt="A pure black placeholder image used to stress test the img style of this very site."
        color="#000"
    %}
    {% include image.html
        size="xs"
        h="3" w="4"
        src="hello_outer_space_00.jpg"
        alt="A pure black placeholder image used to stress test the img style of this very site."
        color="#000"
    %}
    {% include image.html
        size="xs"
        h="3" w="4"
        src="hello_outer_space_00.jpg"
        alt="A pure black placeholder image used to stress test the img style of this very site."
        color="#000"
    %}
    {% include image.html
        size="xs"
        h="3" w="4"
        src="hello_outer_space_00.jpg"
        alt="A pure black placeholder image used to stress test the img style of this very site."
        color="#000"
    %}
</div>

Definition List
: A number of connected items or names written or printed consecutively, typically one below the other.

This is a term.
: This is the definition of the above term, which both live in a dl.

This is another term.
: And it gets a definition too, which is this line.

This is term that shares a definition with the term below.
: And it gets a definition too, which is this line.

<div class="form">
    <div class="field">
        <label for="name">Name</label>
        <input id="name" name="field[name]" placeholder="Alias" type="text"/>
    </div>
    <div class="field error">
        <label for="name">Name</label>
        <input id="name" name="field[name]" placeholder="Alias" type="text"/>
        <i>Mmm. Are you the “<a href="http://en.wikipedia.org/wiki/Man_with_No_Name" target="_blank" title="Man with No Name on Wikipedia">Man with No Name</a>”?</i>
    </div>
    <div class="field">
        <label for="email">E-Mail</label>
        <input id="email" name="field[email]" placeholder="you@email.ext" type="text"/>
    </div>
    <div class="field error">
        <label for="email">E-Mail</label>
        <input id="email" name="field[email]" placeholder="you@email.ext" type="text"/>
        <i>Uh-oh. I need your <strong>e-mail</strong> to write you back.</i>
    </div>
    <div class="field">
        <label for="subject">Subject</label>
        <input id="subject" name="field[subject]" placeholder="Matter" type="text"/>
    </div>
    <div class="field error">
        <label for="subject">Subject</label>
        <input id="subject" name="field[subject]" placeholder="Matter" type="text"/>
        <i>Erm. What’s it all <strong>about</strong>?</i>
    </div>
    <div class="field">
        <label for="body">Body</label>
        <textarea id="field[body]" name="body" placeholder="Hello…" cols="10" rows="8"></textarea>
    </div>
    <div class="field error">
        <label for="body">Body</label>
        <textarea id="field[body]" name="body" placeholder="Hello…" cols="10" rows="8"></textarea>
        <i>Doh. <strong>Writer’s block</strong>?</i>
    </div>

    <div class="field-button">
        <input class="send" name="action[message]" type="submit" value="Send"/>
    </div>
</div>


[^first-footnote]: This is the first footnote.

    This is a second paragraph of the first footnote.

[^second-footnote]: This is the second footnote.
