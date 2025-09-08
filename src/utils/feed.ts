import type { CollectionEntry } from 'astro:content'
import { SITE } from '@/config'
import type { APIContext } from 'astro'
import { getSortedFilteredPosts } from '@/utils/draft'

export async function generateRSS(context: APIContext) {
  const sortedPosts = await getSortedFilteredPosts()

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:wfw="http://wellformedweb.org/CommentAPI/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE.title}</title>
    <link>${context.site}</link>
    <description>${SITE.description}</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${context.site}/rss.xml" rel="self" type="application/rss+xml" />
    ${sortedPosts
      .map(
        (post: CollectionEntry<'posts'>) => `
      <item>
        <title><![CDATA[${post.data.title}]]></title>
        <link>${context.site}/${post.id}/</link>
        <guid>${context.site}/${post.id}/</guid>
        <pubDate>${post.data.pubDate.toUTCString()}</pubDate>
        <content:encoded><![CDATA[${post.body}]]></content:encoded>
      </item>
    `
      )
      .join('')}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8'
    }
  })
}

export async function generateAtom(context: APIContext) {
  const sortedPosts = await getSortedFilteredPosts()

  const atom = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${SITE.title}</title>
  <subtitle>${SITE.description}</subtitle>
  <link href="${context.site}/atom.xml" rel="self" type="application/atom+xml" />
  <link href="${context.site}" />
  <id>${context.site}</id>
  <updated>${new Date().toISOString()}</updated>
  ${sortedPosts
    .map(
      (post: CollectionEntry<'posts'>) => `
    <entry>
      <title>${post.data.title}</title>
      <link href="${context.site}/${post.id}/" />
      <id>${context.site}/${post.id}/</id>
      <published>${post.data.pubDate.toISOString()}</published>
      <content type="html"><![CDATA[${post.body}]]></content>
    </entry>
  `
    )
    .join('')}
</feed>`

  return new Response(atom, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8'
    }
  })
}
