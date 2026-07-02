export default {
  title: "Search Engine &mdash; Low Level Design",
  subtitle: "Complete LLD for Java Spring Boot Interview &mdash; Web Crawling, Indexing, Ranking &amp; Query Processing",
  subtitleColor: "#e8f5e9",
  headerGradient: "linear-gradient(135deg,#1b5e20,#388e3c,#66bb6a)",
  footerText: "Search Engine &mdash; Low Level Design",
  content: `
<div class="section theme-green">
    <div class="section-title"><span class="section-num">1</span>Functional Requirements</div>
    <div class="req-grid">
        <div class="req-pill"><span class="num">1</span><div class="fr-content"><div class="fr-en">Web Crawling &mdash; Discover and fetch web pages from the internet</div><div class="fr-hi">Crawler internet pe ghoomta hai aur web pages fetch karta hai &mdash; seed URLs se start karke links follow karke naye pages discover karta hai, BFS/DFS approach se crawl karta hai</div></div></div>
        <div class="req-pill"><span class="num">2</span><div class="fr-content"><div class="fr-en">Indexing &mdash; Parse and store page content for fast retrieval</div><div class="fr-hi">Crawl kiye hue pages ko parse karke index banana hai &mdash; har word ka inverted index banta hai taki search query pe instantly relevant pages mil jayein</div></div></div>
        <div class="req-pill"><span class="num">3</span><div class="fr-content"><div class="fr-en">Query Processing &mdash; Parse user query and match against index</div><div class="fr-hi">User ki query ko tokenize karke index me search karna hai &mdash; "best pizza near me" ko tokens me todke relevant pages dhundhna hai</div></div></div>
        <div class="req-pill"><span class="num">4</span><div class="fr-content"><div class="fr-en">Ranking &mdash; Sort results by relevance using PageRank + TF-IDF</div><div class="fr-hi">Results ko relevance ke basis pe rank karna hai &mdash; PageRank se page ki authority pata chalti hai, TF-IDF se query match score milta hai, dono combine karke best results top pe aate hain</div></div></div>
        <div class="req-pill"><span class="num">5</span><div class="fr-content"><div class="fr-en">Auto-complete / Search Suggestions</div><div class="fr-hi">User type kare toh suggestions dikhane hain &mdash; "how to" likhte hi popular searches suggest hone chahiye, Trie data structure se fast prefix matching hota hai</div></div></div>
        <div class="req-pill"><span class="num">6</span><div class="fr-content"><div class="fr-en">Spell Correction &mdash; "Did you mean...?"</div><div class="fr-hi">Galat spelling pe correct suggestion dena hai &mdash; "amazn" likhne pe "Did you mean: amazon?" dikhana chahiye, Edit Distance algorithm se closest match milta hai</div></div></div>
        <div class="req-pill"><span class="num">7</span><div class="fr-content"><div class="fr-en">Snippet Generation &mdash; Show relevant text excerpt in results</div><div class="fr-hi">Search results me page ka relevant snippet dikhana hai &mdash; query ke around ka text highlight karke dikhao taki user ko click karne se pehle context mile</div></div></div>
        <div class="req-pill"><span class="num">8</span><div class="fr-content"><div class="fr-en">Image, Video, News Search (Vertical Search)</div><div class="fr-hi">Sirf web pages nahi, images, videos aur news bhi searchable hone chahiye &mdash; alag vertical indexes maintain karne padte hain har content type ke liye</div></div></div>
        <div class="req-pill"><span class="num">9</span><div class="fr-content"><div class="fr-en">Safe Search &mdash; Filter adult/harmful content</div><div class="fr-hi">Harmful ya adult content filter karna hai &mdash; ML classifier se NSFW content detect karke results se hata do, family-safe mode support karo</div></div></div>
        <div class="req-pill"><span class="num">10</span><div class="fr-content"><div class="fr-en">Ads Integration &mdash; Show sponsored results</div><div class="fr-hi">Search results me sponsored ads dikhane hain &mdash; advertisers bid karte hain keywords pe, auction system se decide hota hai kaun sa ad dikhega</div></div></div>
        <div class="req-pill"><span class="num">11</span><div class="fr-content"><div class="fr-en">Personalized Results &mdash; Based on user history and location</div><div class="fr-hi">User ki location aur search history ke basis pe results personalize karne hain &mdash; Delhi me "pizza" search kare toh Delhi ke pizza shops pehle dikhenge</div></div></div>
        <div class="req-pill"><span class="num">12</span><div class="fr-content"><div class="fr-en">Crawl Scheduling &mdash; Re-crawl pages periodically to stay fresh</div><div class="fr-hi">Pages ko periodically re-crawl karna padta hai taki stale content na dikhe &mdash; news sites ko hourly crawl karo, blogs ko weekly, static pages ko monthly</div></div></div>
        <div class="req-pill"><span class="num">13</span><div class="fr-content"><div class="fr-en">robots.txt &amp; Sitemap Compliance</div><div class="fr-hi">Website ka robots.txt respect karna zaroori hai &mdash; agar site ne kaha "/admin" crawl mat karo toh skip karo, sitemap.xml se important pages ka list milta hai</div></div></div>
        <div class="req-pill"><span class="num">14</span><div class="fr-content"><div class="fr-en">Duplicate Detection &mdash; Avoid indexing same content multiple times</div><div class="fr-hi">Same content baar baar index nahi hona chahiye &mdash; SimHash ya MinHash se near-duplicate pages detect karo aur canonical URL rakh ke baaki remove karo</div></div></div>
    </div>
</div>

<!-- ============ NON-FUNCTIONAL REQUIREMENTS ============ -->
<div class="section theme-pink">
    <div class="section-title"><span class="section-num">2</span>Non-Functional Requirements</div>
    <div class="req-grid">
        <div class="req-pill"><span class="num">1</span><div class="nfr-content"><div class="nfr-en">Low Latency &mdash; Search results under 200ms for 99th percentile</div><div class="nfr-hi">Search results 200ms me aane chahiye &mdash; user ko instant feel hona chahiye, Google benchmark hai</div></div></div>
        <div class="req-pill"><span class="num">2</span><div class="nfr-content"><div class="nfr-en">High Availability &mdash; 99.99% uptime, search never goes down</div><div class="nfr-hi">Search kabhi down nahi hona chahiye &mdash; replication aur failover se 99.99% availability ensure karo</div></div></div>
        <div class="req-pill"><span class="num">3</span><div class="nfr-content"><div class="nfr-en">Scalability &mdash; Handle billions of web pages and millions of QPS</div><div class="nfr-hi">Billions pages index karne hain aur millions queries/sec handle karne hain &mdash; horizontal sharding zaroori hai</div></div></div>
        <div class="req-pill"><span class="num">4</span><div class="nfr-content"><div class="nfr-en">Freshness &mdash; Index should reflect recent content within hours</div><div class="nfr-hi">Index me fresh content hona chahiye &mdash; breaking news hours me searchable hona chahiye, stale results dikhana bad UX hai</div></div></div>
        <div class="req-pill"><span class="num">5</span><div class="nfr-content"><div class="nfr-en">Relevance &mdash; Top 3 results should satisfy 80%+ queries</div><div class="nfr-hi">Top 3 results me 80%+ queries ka answer milna chahiye &mdash; ranking quality hi search engine ki quality hai</div></div></div>
        <div class="req-pill"><span class="num">6</span><div class="nfr-content"><div class="nfr-en">Crawl Politeness &mdash; Don't overload target websites</div><div class="nfr-hi">Kisi website ko zyada requests bhej ke overload nahi karna &mdash; rate limiting per domain, robots.txt follow, polite crawling</div></div></div>
    </div>
</div>

<div class="section theme-purple">
    <div class="section-title"><span class="section-num">3</span>Enums</div>
    <div class="enum-grid">
        <div class="enum-card"><h3>CrawlStatus</h3><div class="enum-val">PENDING</div><div class="enum-val">CRAWLING</div><div class="enum-val">CRAWLED</div><div class="enum-val">FAILED</div><div class="enum-val">ROBOTS_BLOCKED</div></div>
        <div class="enum-card"><h3>PageType</h3><div class="enum-val">WEB_PAGE</div><div class="enum-val">IMAGE</div><div class="enum-val">VIDEO</div><div class="enum-val">NEWS</div><div class="enum-val">PDF</div><div class="enum-val">MAP</div></div>
        <div class="enum-card"><h3>CrawlPriority</h3><div class="enum-val">CRITICAL</div><div class="enum-val">HIGH</div><div class="enum-val">MEDIUM</div><div class="enum-val">LOW</div></div>
        <div class="enum-card"><h3>IndexStatus</h3><div class="enum-val">INDEXED</div><div class="enum-val">NOT_INDEXED</div><div class="enum-val">DE_INDEXED</div><div class="enum-val">DUPLICATE</div></div>
        <div class="enum-card"><h3>SearchType</h3><div class="enum-val">WEB</div><div class="enum-val">IMAGE</div><div class="enum-val">VIDEO</div><div class="enum-val">NEWS</div><div class="enum-val">MAPS</div><div class="enum-val">SHOPPING</div></div>
        <div class="enum-card"><h3>SafeSearchLevel</h3><div class="enum-val">STRICT</div><div class="enum-val">MODERATE</div><div class="enum-val">OFF</div></div>
    </div>
</div>

<div class="section theme-purple">
    <div class="section-title"><span class="section-num">4</span>Service LLD</div>
    <div class="service-grid">
        <div class="service-card">
            <h3>CrawlerService</h3>
            <p class="svc-desc">Web pages fetch karta hai internet se &mdash; URL frontier maintain karta hai, robots.txt follow karta hai, politeness delay rakhta hai per domain</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">CrawlerService</span> {

    <span class="cm">// URL fetch karke HTML content return karta hai</span>
    <span class="tp">CrawlResult</span> <span class="fn">crawl</span>(<span class="tp">String</span> url)

    <span class="cm">// page se sab outgoing links extract karta hai for further crawling</span>
    <span class="tp">List</span>&lt;<span class="tp">String</span>&gt; <span class="fn">extractLinks</span>(<span class="tp">String</span> html, <span class="tp">String</span> baseUrl)

    <span class="cm">// robots.txt parse karke check karta hai crawl allowed hai ya nahi</span>
    <span class="tp">boolean</span> <span class="fn">isAllowed</span>(<span class="tp">String</span> url, <span class="tp">String</span> userAgent)

    <span class="cm">// domain ke liye politeness delay calculate karta hai</span>
    <span class="tp">Duration</span> <span class="fn">getCrawlDelay</span>(<span class="tp">String</span> domain)

    <span class="cm">// URL already crawled hai ya nahi check karta hai (Bloom filter)</span>
    <span class="tp">boolean</span> <span class="fn">isAlreadyCrawled</span>(<span class="tp">String</span> url)
}
</pre></div>
        </div>
        <div class="service-card">
            <h3>URLFrontierService</h3>
            <p class="svc-desc">Crawl karne ke liye URLs ka priority queue maintain karta hai &mdash; BFS order me URLs serve karta hai, priority ke basis pe schedule karta hai</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">URLFrontierService</span> {

    <span class="cm">// crawl queue me naya URL add karta hai</span>
    <span class="tp">void</span> <span class="fn">addUrl</span>(<span class="tp">String</span> url, <span class="tp">CrawlPriority</span> priority)

    <span class="cm">// next URL dequeue karta hai for crawling</span>
    <span class="tp">String</span> <span class="fn">getNextUrl</span>()

    <span class="cm">// domain-wise rate limiting ensure karta hai</span>
    <span class="tp">boolean</span> <span class="fn">canCrawlDomain</span>(<span class="tp">String</span> domain)

    <span class="cm">// re-crawl ke liye URLs schedule karta hai based on change frequency</span>
    <span class="tp">void</span> <span class="fn">scheduleRecrawl</span>(<span class="tp">String</span> url, <span class="tp">Duration</span> interval)
}
</pre></div>
        </div>
        <div class="service-card">
            <h3>IndexerService</h3>
            <p class="svc-desc">Crawled pages ko parse karke inverted index build karta hai &mdash; tokenization, stemming, stop-word removal sab iske andar hota hai</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">IndexerService</span> {

    <span class="cm">// crawled page ko parse karke index me add karta hai</span>
    <span class="tp">void</span> <span class="fn">indexPage</span>(<span class="tp">CrawlResult</span> crawlResult)

    <span class="cm">// HTML se meaningful text extract karta hai (tags hatake)</span>
    <span class="tp">String</span> <span class="fn">extractText</span>(<span class="tp">String</span> html)

    <span class="cm">// text ko tokens me todta hai (tokenization + stemming)</span>
    <span class="tp">List</span>&lt;<span class="tp">String</span>&gt; <span class="fn">tokenize</span>(<span class="tp">String</span> text)

    <span class="cm">// inverted index me entry add karta hai — word → list of doc IDs</span>
    <span class="tp">void</span> <span class="fn">addToInvertedIndex</span>(<span class="tp">String</span> token, <span class="tp">String</span> docId, <span class="tp">int</span> position)

    <span class="cm">// TF-IDF score calculate karta hai har term ke liye</span>
    <span class="tp">double</span> <span class="fn">calculateTfIdf</span>(<span class="tp">String</span> term, <span class="tp">String</span> docId)
}
</pre></div>
        </div>
        <div class="service-card">
            <h3>QueryService</h3>
            <p class="svc-desc">User ki search query process karta hai &mdash; query parse karke index se matching documents fetch karta hai aur ranking ke liye bhejta hai</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">QueryService</span> {

    <span class="cm">// full search flow — parse → search → rank → return</span>
    <span class="tp">SearchResults</span> <span class="fn">search</span>(<span class="tp">String</span> query, <span class="tp">SearchType</span> type, <span class="tp">int</span> page)

    <span class="cm">// query ko tokens me todta hai aur operators handle karta hai</span>
    <span class="tp">ParsedQuery</span> <span class="fn">parseQuery</span>(<span class="tp">String</span> rawQuery)

    <span class="cm">// inverted index se matching document IDs fetch karta hai</span>
    <span class="tp">List</span>&lt;<span class="tp">String</span>&gt; <span class="fn">lookupIndex</span>(<span class="tp">ParsedQuery</span> query)

    <span class="cm">// results me query terms highlight karke snippet generate karta hai</span>
    <span class="tp">String</span> <span class="fn">generateSnippet</span>(<span class="tp">String</span> docContent, <span class="tp">ParsedQuery</span> query)
}
</pre></div>
        </div>
        <div class="service-card">
            <h3>RankingService</h3>
            <p class="svc-desc">Search results ko relevance ke basis pe rank karta hai &mdash; PageRank + TF-IDF + freshness + user signals combine karke final score milta hai</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">RankingService</span> {

    <span class="cm">// multiple signals combine karke final score calculate karta hai</span>
    <span class="tp">List</span>&lt;<span class="tp">RankedResult</span>&gt; <span class="fn">rank</span>(<span class="tp">List</span>&lt;<span class="tp">String</span>&gt; docIds, <span class="tp">ParsedQuery</span> query)

    <span class="cm">// page ka PageRank score return karta hai</span>
    <span class="tp">double</span> <span class="fn">getPageRank</span>(<span class="tp">String</span> docId)

    <span class="cm">// query aur document ke beech relevance score calculate karta hai</span>
    <span class="tp">double</span> <span class="fn">calculateRelevance</span>(<span class="tp">String</span> docId, <span class="tp">ParsedQuery</span> query)

    <span class="cm">// freshness boost — recent pages ko higher rank deta hai</span>
    <span class="tp">double</span> <span class="fn">freshnessBoost</span>(<span class="tp">String</span> docId)
}
</pre></div>
        </div>
        <div class="service-card">
            <h3>AutoCompleteService</h3>
            <p class="svc-desc">User type karte time search suggestions deta hai &mdash; Trie data structure se fast prefix matching karta hai, popular queries prioritize karta hai</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">AutoCompleteService</span> {

    <span class="cm">// prefix ke basis pe top-K suggestions return karta hai</span>
    <span class="tp">List</span>&lt;<span class="tp">String</span>&gt; <span class="fn">getSuggestions</span>(<span class="tp">String</span> prefix, <span class="tp">int</span> limit)

    <span class="cm">// naye popular queries ko Trie me add karta hai</span>
    <span class="tp">void</span> <span class="fn">addQuery</span>(<span class="tp">String</span> query, <span class="tp">long</span> frequency)

    <span class="cm">// personalized suggestions — user ki past searches se</span>
    <span class="tp">List</span>&lt;<span class="tp">String</span>&gt; <span class="fn">getPersonalizedSuggestions</span>(<span class="tp">String</span> userId, <span class="tp">String</span> prefix)
}
</pre></div>
        </div>
        <div class="service-card">
            <h3>SpellCheckService</h3>
            <p class="svc-desc">Misspelled queries correct karta hai &mdash; Edit Distance se closest valid word dhundhta hai, "Did you mean?" suggestion deta hai</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">SpellCheckService</span> {

    <span class="cm">// misspelled word ka correct suggestion deta hai</span>
    <span class="tp">String</span> <span class="fn">correct</span>(<span class="tp">String</span> word)

    <span class="cm">// poori query ko spell-check karke corrected version return karta hai</span>
    <span class="tp">SpellCheckResult</span> <span class="fn">checkQuery</span>(<span class="tp">String</span> query)

    <span class="cm">// Edit Distance calculate karta hai 2 words ke beech</span>
    <span class="tp">int</span> <span class="fn">editDistance</span>(<span class="tp">String</span> word1, <span class="tp">String</span> word2)

    <span class="cm">// dictionary me word exist karta hai ya nahi</span>
    <span class="tp">boolean</span> <span class="fn">isValidWord</span>(<span class="tp">String</span> word)
}
</pre></div>
        </div>
        <div class="service-card">
            <h3>DuplicateDetectionService</h3>
            <p class="svc-desc">Near-duplicate pages detect karta hai &mdash; SimHash se content fingerprint generate karke compare karta hai, canonical URL select karta hai</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">DuplicateDetectionService</span> {

    <span class="cm">// page ka SimHash fingerprint generate karta hai</span>
    <span class="tp">long</span> <span class="fn">computeSimHash</span>(<span class="tp">String</span> content)

    <span class="cm">// 2 pages near-duplicate hain ya nahi check karta hai</span>
    <span class="tp">boolean</span> <span class="fn">isNearDuplicate</span>(<span class="tp">long</span> hash1, <span class="tp">long</span> hash2, <span class="tp">int</span> threshold)

    <span class="cm">// duplicate group me se canonical URL select karta hai</span>
    <span class="tp">String</span> <span class="fn">selectCanonical</span>(<span class="tp">List</span>&lt;<span class="tp">String</span>&gt; duplicateUrls)
}
</pre></div>
        </div>
    </div>
</div>

<div class="section theme-teal">
    <div class="section-title"><span class="section-num">5</span>APIs (with Request / Response)</div>
    <div class="api-grid">
        <div class="api-card">
            <div class="api-header"><span class="api-method method-get">GET</span><span class="api-path">/api/v1/search?q=best+java+tutorials&amp;type=web&amp;page=0&amp;size=10</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Response 200</div>{
  <span class="key">"query"</span>: <span class="val">"best java tutorials"</span>,
  <span class="key">"totalResults"</span>: <span class="val">45000000</span>,
  <span class="key">"timeTaken"</span>: <span class="val">"0.18 seconds"</span>,
  <span class="key">"spellCorrection"</span>: <span class="val">null</span>,
  <span class="key">"results"</span>: [{
    <span class="key">"title"</span>: <span class="val">"Best Java Tutorials 2025 - Complete Guide"</span>,
    <span class="key">"url"</span>: <span class="val">"https://example.com/java-tutorials"</span>,
    <span class="key">"snippet"</span>: <span class="val">"This is the **best** resource to learn **Java**..."</span>,
    <span class="key">"score"</span>: <span class="val">2.17</span>,
    <span class="key">"cachedUrl"</span>: <span class="val">"/cache?url=..."</span>,
    <span class="key">"publishedAt"</span>: <span class="val">"2025-05-20"</span>
  }],
  <span class="key">"pagination"</span>: { <span class="key">"page"</span>: <span class="val">0</span>, <span class="key">"size"</span>: <span class="val">10</span>, <span class="key">"totalPages"</span>: <span class="val">4500000</span> }
}</div>
            </div>
            <div class="api-note">Main search API &mdash; query parse karke inverted index se matching docs fetch karta hai, TF-IDF + PageRank se rank karke snippets ke saath return karta hai</div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-get">GET</span><span class="api-path">/api/v1/suggest?q=how+to+le</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Response 200</div>{
  <span class="key">"prefix"</span>: <span class="val">"how to le"</span>,
  <span class="key">"suggestions"</span>: [
    <span class="val">"how to learn java"</span>,
    <span class="val">"how to learn python"</span>,
    <span class="val">"how to learn spring boot"</span>,
    <span class="val">"how to learn react"</span>,
    <span class="val">"how to learn dsa"</span>
  ]
}</div>
            </div>
            <div class="api-note">Auto-complete suggestions &mdash; Trie se top-K prefix matches return karta hai, pre-computed suggestions O(prefix_length) me milte hai</div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-get">GET</span><span class="api-path">/api/v1/spellcheck?q=javva+tutoriall</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Response 200</div>{
  <span class="key">"original"</span>: <span class="val">"javva tutoriall"</span>,
  <span class="key">"corrected"</span>: <span class="val">"java tutorial"</span>,
  <span class="key">"didYouMean"</span>: <span class="val">true</span>,
  <span class="key">"corrections"</span>: [
    { <span class="key">"original"</span>: <span class="val">"javva"</span>, <span class="key">"suggestion"</span>: <span class="val">"java"</span>, <span class="key">"editDistance"</span>: <span class="val">1</span> },
    { <span class="key">"original"</span>: <span class="val">"tutoriall"</span>, <span class="key">"suggestion"</span>: <span class="val">"tutorial"</span>, <span class="key">"editDistance"</span>: <span class="val">1</span> }
  ]
}</div>
            </div>
            <div class="api-note">Spell check API &mdash; Edit Distance se closest valid word dhundhta hai, "Did you mean?" suggestion deta hai</div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-post">POST</span><span class="api-path">/api/v1/crawl/submit</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Request</div>{
  <span class="key">"urls"</span>: [<span class="val">"https://mysite.com"</span>, <span class="val">"https://mysite.com/blog"</span>],
  <span class="key">"sitemapUrl"</span>: <span class="val">"https://mysite.com/sitemap.xml"</span>,
  <span class="key">"priority"</span>: <span class="val">"NORMAL"</span>
}</div>
                <div class="api-json"><div class="label">Response 202</div>{
  <span class="key">"submitted"</span>: <span class="val">2</span>,
  <span class="key">"status"</span>: <span class="val">"QUEUED"</span>,
  <span class="key">"estimatedCrawlTime"</span>: <span class="val">"2-5 days"</span>
}</div>
            </div>
            <div class="api-note">Manual URL submit for crawling &mdash; webmasters apni site submit kar sakte hain, sitemap se sari pages discover hoti hain</div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-get">GET</span><span class="api-path">/api/v1/index/status?url=https://mysite.com</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Response 200</div>{
  <span class="key">"url"</span>: <span class="val">"https://mysite.com"</span>,
  <span class="key">"indexed"</span>: <span class="val">true</span>,
  <span class="key">"lastCrawledAt"</span>: <span class="val">"2025-06-14T08:00:00Z"</span>,
  <span class="key">"pageRank"</span>: <span class="val">0.45</span>,
  <span class="key">"indexedPages"</span>: <span class="val">150</span>
}</div>
            </div>
            <div class="api-note">URL ka index status check karta hai &mdash; last crawl time, PageRank, total indexed pages dikhata hai</div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-get">GET</span><span class="api-path">/api/v1/trending?region=IN&amp;limit=10</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Response 200</div>{
  <span class="key">"region"</span>: <span class="val">"IN"</span>,
  <span class="key">"trending"</span>: [
    { <span class="key">"query"</span>: <span class="val">"IPL 2025 final"</span>, <span class="key">"searchVolume"</span>: <span class="val">5200000</span> },
    { <span class="key">"query"</span>: <span class="val">"budget 2025"</span>, <span class="key">"searchVolume"</span>: <span class="val">3100000</span> },
    { <span class="key">"query"</span>: <span class="val">"weather today"</span>, <span class="key">"searchVolume"</span>: <span class="val">2800000</span> }
  ],
  <span class="key">"updatedAt"</span>: <span class="val">"2025-06-15T10:00:00Z"</span>
}</div>
            </div>
            <div class="api-note">Trending searches return karta hai &mdash; region-wise real-time popular queries, har 5 min update hoti hai</div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-post">POST</span><span class="api-path">/api/v1/feedback</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Request</div>{
  <span class="key">"queryId"</span>: <span class="val">"q-abc123"</span>,
  <span class="key">"clickedUrl"</span>: <span class="val">"https://example.com/java-tutorials"</span>,
  <span class="key">"clickPosition"</span>: <span class="val">1</span>,
  <span class="key">"dwellTime"</span>: <span class="val">45</span>
}</div>
                <div class="api-json"><div class="label">Response 200</div>{
  <span class="key">"status"</span>: <span class="val">"recorded"</span>
}</div>
            </div>
            <div class="api-note">Search quality feedback &mdash; click-through rate aur dwell time track karta hai, ranking model training ke liye use hota hai</div>
        </div>
    </div>
</div>

<!-- ============ 6. DATABASE SCHEMA ============ -->
<div class="section theme-pink">
    <div class="section-title"><span class="section-num">6</span>Database Schema (with FK &amp; Indexes)</div>

    <div class="sub-heading" style="color:#ff80ab;border-color:#ff80ab">Database Technology Stack</div>
    <div class="dbtech-grid">
        <div class="dbtech-card">
            <div class="dbtech-name">Bigtable / HBase <span class="dbtech-type">Wide-Column Store</span></div>
            <div class="dbtech-usage">Crawled pages, inverted index &mdash; billions of rows, fast sequential reads, column-family storage</div>
            <div class="dbtech-tables"><span>crawled_pages</span><span>inverted_index</span><span>page_links</span></div>
        </div>
        <div class="dbtech-card">
            <div class="dbtech-name">Redis <span class="dbtech-type">In-Memory</span></div>
            <div class="dbtech-usage">URL frontier queue, Bloom filter for URL dedup, Trie cache for auto-complete, query result cache</div>
            <div class="dbtech-tables"><span>url:frontier</span><span>bloom:urls</span><span>cache:query:{hash}</span><span>trie:suggestions</span></div>
        </div>
        <div class="dbtech-card">
            <div class="dbtech-name">PostgreSQL <span class="dbtech-type">RDBMS</span></div>
            <div class="dbtech-usage">Search query logs, robots.txt rules, crawl scheduling &mdash; ACID for analytics</div>
            <div class="dbtech-tables"><span>search_query_log</span><span>robots_rules</span></div>
        </div>
        <div class="dbtech-card">
            <div class="dbtech-name">Kafka <span class="dbtech-type">Message Queue</span></div>
            <div class="dbtech-usage">Crawl jobs, index updates, PageRank computation pipeline &mdash; async distributed processing</div>
            <div class="dbtech-tables"><span>crawl-jobs</span><span>index-updates</span><span>pagerank-events</span></div>
        </div>
        <div class="dbtech-card">
            <div class="dbtech-name">HDFS <span class="dbtech-type">Distributed File System</span></div>
            <div class="dbtech-usage">Raw HTML storage, PageRank computation data, MapReduce batch processing</div>
            <div class="dbtech-tables"><span>/crawl-data/</span><span>/pagerank-input/</span><span>/pagerank-output/</span></div>
        </div>
    </div>

    <div class="db-grid">
        <div class="db-table">
            <h3>crawled_page</h3>
            <ul>
                <li><span class="pk">id UUID PK</span></li>
                <li>url VARCHAR(2048) UNIQUE NOT NULL <span class="idx">IDX</span></li>
                <li>domain VARCHAR(255) NOT NULL <span class="idx">IDX</span></li>
                <li>title VARCHAR(512)</li>
                <li>content_hash BIGINT (SimHash) <span class="idx">IDX</span></li>
                <li>raw_html TEXT (compressed, stored in HDFS)</li>
                <li>extracted_text TEXT</li>
                <li>page_rank DOUBLE DEFAULT 0.0</li>
                <li>crawl_status ENUM('QUEUED','CRAWLING','INDEXED','FAILED','BLOCKED')</li>
                <li>last_crawled_at TIMESTAMP <span class="idx">IDX</span></li>
                <li>next_crawl_at TIMESTAMP <span class="idx">IDX</span></li>
                <li>http_status INT</li>
                <li><span class="idx">INDEX idx_domain_status (domain, crawl_status)</span></li>
                <li><span class="idx">INDEX idx_next_crawl (next_crawl_at, crawl_status)</span></li>
            </ul>
        </div>
        <div class="db-table">
            <h3>inverted_index</h3>
            <ul>
                <li><span class="pk">term VARCHAR(100) PK</span></li>
                <li>doc_frequency INT NOT NULL</li>
                <li>posting_list BLOB (compressed)</li>
                <li><span class="idx">Sharded by term range (a-m, n-z)</span></li>
            </ul>
        </div>
        <div class="db-table">
            <h3>posting_entry (within posting_list)</h3>
            <ul>
                <li>doc_id UUID</li>
                <li>term_frequency INT</li>
                <li>positions INT[] (word positions in doc)</li>
                <li>tf_idf_score FLOAT (pre-computed)</li>
            </ul>
        </div>
        <div class="db-table">
            <h3>page_link (for PageRank)</h3>
            <ul>
                <li><span class="fk">source_page_id UUID FK &rarr; crawled_page.id</span> <span class="idx">IDX</span></li>
                <li>target_url VARCHAR(2048) <span class="idx">IDX</span></li>
                <li>anchor_text VARCHAR(500)</li>
                <li>is_external BOOLEAN DEFAULT false</li>
                <li><span class="idx">INDEX idx_source (source_page_id)</span></li>
                <li><span class="idx">INDEX idx_target (target_url)</span></li>
            </ul>
        </div>
        <div class="db-table">
            <h3>search_query_log</h3>
            <ul>
                <li><span class="pk">id UUID PK</span></li>
                <li>query VARCHAR(500) NOT NULL <span class="idx">IDX</span></li>
                <li><span class="fk">user_id UUID FK NULL</span></li>
                <li>search_type ENUM('WEB','IMAGE','VIDEO','NEWS')</li>
                <li>results_count INT</li>
                <li>clicked_result VARCHAR(2048) NULL</li>
                <li>click_position INT NULL</li>
                <li>dwell_time INT NULL</li>
                <li>location VARCHAR(100)</li>
                <li>searched_at TIMESTAMP <span class="idx">IDX</span></li>
                <li><span class="idx">INDEX idx_query_time (query, searched_at DESC)</span></li>
            </ul>
        </div>
        <div class="db-table">
            <h3>robots_rules</h3>
            <ul>
                <li><span class="pk">domain VARCHAR(255) PK</span></li>
                <li>disallowed_paths TEXT[]</li>
                <li>crawl_delay INT (seconds)</li>
                <li>sitemap_url VARCHAR(2048)</li>
                <li>last_fetched_at TIMESTAMP</li>
            </ul>
        </div>
    </div>

    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">SQL &mdash; Core Queries</span></div><pre class="code-block">
<span class="cm">-- Next batch of URLs to crawl (priority queue)</span>
<span class="kw">SELECT</span> id, url, domain <span class="kw">FROM</span> crawled_page
<span class="kw">WHERE</span> crawl_status = 'QUEUED' <span class="kw">AND</span> next_crawl_at &lt;= NOW()
<span class="kw">ORDER BY</span> page_rank <span class="kw">DESC</span>, next_crawl_at
<span class="kw">LIMIT</span> 1000 <span class="kw">FOR UPDATE SKIP LOCKED</span>;

<span class="cm">-- SimHash duplicate check (Hamming distance &lt;= 3 = near-duplicate)</span>
<span class="kw">SELECT</span> url <span class="kw">FROM</span> crawled_page
<span class="kw">WHERE</span> BIT_COUNT(content_hash ^ :newHash) &lt;= 3 <span class="kw">LIMIT</span> 1;

<span class="cm">-- Trending queries (last 1 hour)</span>
<span class="kw">SELECT</span> query, COUNT(*) as search_count
<span class="kw">FROM</span> search_query_log
<span class="kw">WHERE</span> searched_at >= NOW() - INTERVAL '1 hour'
<span class="kw">GROUP BY</span> query <span class="kw">ORDER BY</span> search_count <span class="kw">DESC</span> <span class="kw">LIMIT</span> 10;

<span class="cm">-- Click-through rate per query (ranking quality metric)</span>
<span class="kw">SELECT</span> query, COUNT(*) as total_searches,
    SUM(CASE WHEN clicked_result IS NOT NULL THEN 1 ELSE 0 END) as clicks,
    AVG(click_position) as avg_click_pos
<span class="kw">FROM</span> search_query_log
<span class="kw">WHERE</span> searched_at >= :startDate
<span class="kw">GROUP BY</span> query <span class="kw">ORDER BY</span> total_searches <span class="kw">DESC</span>;
</pre></div>
</div>

<!-- ============ 7. CAPACITY ESTIMATION ============ -->
<div class="section theme-deepblue">
    <div class="section-title"><span class="section-num">7</span>Capacity Estimation</div>
    <div class="assumption-box">
        <h4>Assumptions</h4>
        <div class="assumption-row"><span class="calc-label">Total indexed pages</span><span class="calc-value">100 Billion</span></div>
        <div class="assumption-row"><span class="calc-label">New/updated pages crawled/day</span><span class="calc-value">5 Billion</span></div>
        <div class="assumption-row"><span class="calc-label">Search queries/day</span><span class="calc-value">8.5 Billion (Google-scale)</span></div>
        <div class="assumption-row"><span class="calc-label">Avg page size (compressed HTML)</span><span class="calc-value">50 KB</span></div>
        <div class="assumption-row"><span class="calc-label">Avg query latency target</span><span class="calc-value">&lt; 200 ms</span></div>
        <div class="assumption-row"><span class="calc-label">Unique terms in index</span><span class="calc-value">~1 Billion</span></div>
        <div class="assumption-row"><span class="calc-label">Avg outlinks per page</span><span class="calc-value">50</span></div>
    </div>
    <div class="cap-grid">
        <div class="cap-card">
            <h4>Search QPS</h4>
            <div class="calc-row"><span class="calc-label">8.5B queries/day</span><span class="calc-value">~100K QPS avg</span></div>
            <div class="calc-row"><span class="calc-label">Peak (3x avg)</span><span class="calc-value">~300K QPS</span></div>
            <div class="calc-result"><span class="calc-label">Auto-complete QPS (10x search)</span><span class="calc-value">~1M QPS</span></div>
        </div>
        <div class="cap-card">
            <h4>Crawl Rate</h4>
            <div class="calc-row"><span class="calc-label">5B pages/day</span><span class="calc-value">~58K pages/sec</span></div>
            <div class="calc-row"><span class="calc-label">Bandwidth: 58K &times; 50KB</span><span class="calc-value">~2.9 GB/sec ingress</span></div>
            <div class="calc-result"><span class="calc-label">Politeness: 1 req/sec/domain</span><span class="calc-value">~58K concurrent domains</span></div>
        </div>
        <div class="cap-card">
            <h4>Storage &mdash; Crawled Pages</h4>
            <div class="calc-row"><span class="calc-label">100B pages &times; 50KB</span><span class="calc-value">~5 PB (compressed HTML)</span></div>
            <div class="calc-row"><span class="calc-label">New per day: 5B &times; 50KB</span><span class="calc-value">~250 TB/day</span></div>
            <div class="calc-result"><span class="calc-label">Total with history</span><span class="calc-value">~10 PB</span></div>
        </div>
        <div class="cap-card">
            <h4>Storage &mdash; Inverted Index</h4>
            <div class="calc-row"><span class="calc-label">1B terms &times; avg 1KB posting list</span><span class="calc-value">~1 PB index</span></div>
            <div class="calc-row"><span class="calc-label">Shards (1TB per shard)</span><span class="calc-value">~1,000 shards</span></div>
            <div class="calc-result"><span class="calc-label">Replicas (3x for availability)</span><span class="calc-value">~3,000 shard replicas</span></div>
        </div>
        <div class="cap-card">
            <h4>URL Dedup (Bloom Filter)</h4>
            <div class="calc-row"><span class="calc-label">100B URLs, 1% false positive</span><span class="calc-value">~120 GB Bloom filter</span></div>
            <div class="calc-row"><span class="calc-label">Lookup time</span><span class="calc-value">O(k) = O(7) = constant</span></div>
            <div class="calc-result"><span class="calc-label">Fits in memory?</span><span class="calc-value">Yes &mdash; distributed across 10 nodes</span></div>
        </div>
        <div class="cap-card">
            <h4>PageRank Computation</h4>
            <div class="calc-row"><span class="calc-label">100B pages &times; 50 links each</span><span class="calc-value">5 Trillion edges</span></div>
            <div class="calc-row"><span class="calc-label">~50 iterations to converge</span><span class="calc-value">MapReduce batch job</span></div>
            <div class="calc-result"><span class="calc-label">Compute time (1000 nodes)</span><span class="calc-value">~12-24 hours</span></div>
        </div>
        <div class="cap-card">
            <h4>Trie (Auto-complete)</h4>
            <div class="calc-row"><span class="calc-label">Top 100M queries in Trie</span><span class="calc-value">~10 GB memory</span></div>
            <div class="calc-row"><span class="calc-label">Lookup per keystroke</span><span class="calc-value">O(prefix_length)</span></div>
            <div class="calc-result"><span class="calc-label">Pre-computed top-K at node</span><span class="calc-value">O(1) suggestion retrieval</span></div>
        </div>
        <div class="cap-card">
            <h4>CPU / Server Estimation</h4>
            <div class="calc-row"><span class="calc-label">Search API servers</span><span class="calc-value">~5,000 servers</span></div>
            <div class="calc-row"><span class="calc-label">Crawler workers</span><span class="calc-value">~10,000 workers</span></div>
            <div class="calc-row"><span class="calc-label">Index shard servers</span><span class="calc-value">~3,000 servers</span></div>
            <div class="calc-row"><span class="calc-label">Redis (cache + Trie + Bloom)</span><span class="calc-value">~50 nodes</span></div>
            <div class="calc-result"><span class="calc-label">Total infrastructure</span><span class="calc-value">~20,000+ servers</span></div>
        </div>
    </div>
</div>

<!-- ============ 8. DATA STRUCTURES & TRADE-OFFS ============ -->
<div class="section theme-purple">
    <div class="section-title"><span class="section-num">8</span>Data Structures &amp; Trade-offs</div>
    <div class="service-grid">
        <div class="service-card">
            <h3>Inverted Index &mdash; Core Search Indexing</h3>
            <p class="svc-desc">Search engine ka backbone. Har word ke against ek posting list maintain hoti hai &mdash; "kaunse documents me ye word hai?" Forward index (doc → words) se search O(N) hai, Inverted Index (word → docs) se O(1) term lookup + O(k) result scan.</p>
            <p class="svc-desc"><strong>How it works:</strong> Document "cat sat on mat" → Index: "cat"→[doc1:pos0], "sat"→[doc1:pos1], "on"→[doc1:pos2], "mat"→[doc1:pos3]. Query "cat mat" = intersection of posting lists<br><br>
            <strong>Why Inverted Index?</strong> 100 Billion web pages me full scan impossible. Inverted Index se "cat" search = directly posting list access, no scanning<br><br>
            <strong>Pros:</strong> O(1) term lookup, boolean AND/OR/NOT queries efficient, TF-IDF/BM25 scoring built-in, phrase search with positional index, compression friendly (delta encoding)<br><br>
            <strong>Cons:</strong> Index size 30-50% of original data (~1PB for Google scale), index update latency (new page searchable after seconds), memory intensive for real-time indexing, merge cost for AND queries on large posting lists<br><br>
            <strong>Optimization:</strong> Skip pointers in posting lists for faster intersection, tiered index (hot terms in memory, cold on disk), sharding by term or document range</p>
        </div>
        <div class="service-card">
            <h3>Trie (Prefix Tree) &mdash; Typeahead / Auto-Complete Search</h3>
            <p class="svc-desc">User "how to" type karta hai toh suggestions aate hai: "how to lose weight", "how to code", "how to cook". Trie me har character ek node hai, prefix tak traverse karke popular completions return hoti hai.</p>
            <p class="svc-desc"><strong>How it works:</strong> Trie build karo past queries se with frequency counts. "how to" type hone pe → traverse h→o→w→ →t→o node tak → DFS for top-K completions by frequency<br><br>
            <strong>Why Trie for Typeahead?</strong> HashMap exact match deta hai (type "how to" → only exact "how to"). Trie prefix match deta hai (type "how to" → all queries starting with "how to")<br><br>
            <strong>Data Source:</strong> Query logs (last 30 days) aggregate karke Trie build. Google pe 8.5B queries/day ka log → frequency count → top completions cache at each Trie node<br><br>
            <strong>Pros:</strong> O(L) prefix search (L = query length, independent of dataset size), all completions from any prefix, incremental search (each keystroke = one more node)<br><br>
            <strong>Cons:</strong> High memory (26+ pointers per node for English), stale data (new trending queries take time), rebuild needed periodically (hourly/daily from query logs)<br><br>
            <strong>Optimizations:</strong> (1) Compressed Trie (Radix Tree) &mdash; merge single-child chains, 60% memory saving. (2) Top-K cache per node &mdash; pre-compute top 10 suggestions, no DFS needed at query time. (3) Shard by first 2 characters (aa-zz = 676 shards)</p>
        </div>
        <div class="service-card">
            <h3>Bloom Filter &mdash; URL Dedup in Web Crawler</h3>
            <p class="svc-desc">Web crawler ko track karna padta hai ki kaunse URLs already crawl ho chuke hai. 100 Billion URLs ka HashSet ~8TB RAM lagega. Bloom Filter me ~120GB me same work hota hai (with 0.1% false positive).</p>
            <p class="svc-desc"><strong>How it works:</strong> New URL mila → Bloom Filter check → "definitely not crawled" = add to crawl queue. "maybe crawled" = skip (0.1% chance ye false positive hai = miss ek page, acceptable)<br><br>
            <strong>Why Bloom Filter?</strong> HashSet me 100B URLs x 80 bytes avg = 8TB RAM. Bloom Filter me 10 bits/element x 100B = 120GB. 67x memory saving!<br><br>
            <strong>Pros:</strong> O(1) membership check, extreme memory efficiency, no false negatives (already crawled URL will never be re-crawled), distributable across crawler nodes<br><br>
            <strong>Cons:</strong> False positives = some valid URLs skipped (0.1%), can't remove URLs (deleted page still marked "crawled"), periodic rebuild needed with fresh data<br><br>
            <strong>Trade-off:</strong> 0.1% false positive rate = 100 Million pages potentially skipped out of 100B. Acceptable because re-crawl happens anyway on next cycle. Lower FP = more memory</p>
        </div>
        <div class="service-card">
            <h3>Graph (Adjacency List) &mdash; PageRank Algorithm</h3>
            <p class="svc-desc">Web ek giant directed graph hai &mdash; pages nodes hai, hyperlinks edges hai. PageRank is graph pe iterative computation karta hai to determine page importance: "zyada quality pages se link = zyada important."</p>
            <p class="svc-desc"><strong>How it works:</strong> Har page ka initial rank = 1/N. Iterate: rank(P) = (1-d)/N + d * SUM(rank(T)/outlinks(T)) for all T linking to P. d=0.85 (damping factor). Converge after ~50 iterations<br><br>
            <strong>Why Adjacency List?</strong> Web graph sparse hai (avg 10-15 outlinks per page). Adjacency Matrix 100B x 100B = impossible. Adjacency List stores only actual edges<br><br>
            <strong>Scale:</strong> 100B nodes, ~5 Trillion edges. Distributed computation (MapReduce/Pregel). Each iteration = full graph traversal<br><br>
            <strong>Pros:</strong> Models real web link structure, iterative refinement converges to stable ranking, spam-resistant (hard to fake many quality inlinks)<br><br>
            <strong>Cons:</strong> Massive memory (even adjacency list ~5TB for 5T edges), computation expensive (50 iterations x full graph), link spam attacks, slow to update (batch recomputation)<br><br>
            <strong>Modern:</strong> Google now uses 200+ ranking signals beyond PageRank (BERT, freshness, user engagement, Core Web Vitals). PageRank is just one signal</p>
        </div>
        <div class="service-card">
            <h3>Priority Queue &mdash; Crawl Frontier Scheduling</h3>
            <p class="svc-desc">Web crawler ko decide karna hai ki next kaunsa URL crawl kare. High-importance pages pehle (news sites, updated pages). Priority Queue se URLs importance-based order me process hote hai.</p>
            <p class="svc-desc"><strong>How it works:</strong> Priority = f(PageRank, freshness, update_frequency, domain_authority). New URL discovered → Priority Queue me insert with score → workers extract highest priority first<br><br>
            <strong>Why Priority Queue?</strong> FIFO queue me CNN.com aur random blog same priority se crawl hoga. Priority Queue se important pages first, better crawl budget utilization<br><br>
            <strong>Pros:</strong> O(log n) insert, O(1) highest priority peek, crawl budget optimization (most valuable pages first), adaptive re-prioritization<br><br>
            <strong>Cons:</strong> Starvation of low-priority URLs (long-tail pages rarely crawled), priority computation overhead, distributed priority queue complex (multiple crawler nodes)<br><br>
            <strong>Implementation:</strong> Multiple priority queues per domain (politeness) + back queue (round-robin across domains to avoid overloading one server)</p>
        </div>
        <div class="service-card">
            <h3>SimHash / MinHash &mdash; Near-Duplicate Page Detection</h3>
            <p class="svc-desc">Internet pe 30%+ content duplicate/near-duplicate hai (same article different sites, mirror pages). Exact hash different hoga (different ads/headers). SimHash content ka fingerprint banata hai jo similar content ke liye similar hash deta hai.</p>
            <p class="svc-desc"><strong>How it works:</strong> Page content → extract features (word n-grams) → hash each feature → weighted sum → SimHash (64-bit fingerprint). Two pages similar if Hamming distance(SimHash_A, SimHash_B) &le; 3<br><br>
            <strong>Why SimHash?</strong> MD5/SHA hash me 1 character change = completely different hash. SimHash me small content change = small hash change (locality-sensitive)<br><br>
            <strong>Pros:</strong> O(1) comparison (XOR + popcount), locality-sensitive (similar content = similar hash), compact representation (64 bits per page), scalable to billions<br><br>
            <strong>Cons:</strong> Approximation (false positives/negatives), not suitable for exact matching, threshold tuning needed (Hamming distance cutoff), no content reconstruction from hash<br><br>
            <strong>Alternative:</strong> MinHash + LSH (Locality-Sensitive Hashing) &mdash; better for Jaccard similarity, used for document clustering. SimHash better for single-page fingerprinting</p>
        </div>
        <div class="service-card">
            <h3>Skip List &mdash; Posting List Intersection</h3>
            <p class="svc-desc">Query "machine learning python" me 3 posting lists ka intersection chahiye. Posting lists sorted hai by doc_id. Skip List sorted list me O(log n) jumps allow karta hai &mdash; intersection ke liye ideal.</p>
            <p class="svc-desc"><strong>How it works:</strong> Posting list [1,3,5,8,12,15,20,25,30] with skip pointers every sqrt(n) elements. Intersection me agar current = 8 aur target &gt; 20, skip pointer se directly 20 pe jump karo instead of scanning 12,15<br><br>
            <strong>Why Skip List?</strong> Simple merge = O(n+m) for two lists. Skip pointers se O(sqrt(n)) skips possible, especially when one list much smaller than other<br><br>
            <strong>Pros:</strong> O(log n) skip during intersection, simple implementation over sorted arrays, probabilistic balancing (no rebalancing needed)<br><br>
            <strong>Cons:</strong> Memory overhead for skip pointers, probabilistic height (not guaranteed O(log n)), worse cache performance than arrays<br><br>
            <strong>Lucene Implementation:</strong> Block-based skip lists with 128-doc blocks, delta+variable-byte encoding for posting lists, SIMD for block intersection</p>
        </div>
    </div>
</div>

<!-- ============ 9. SEARCH TYPES DEEP DIVE ============ -->
<div class="section theme-green">
    <div class="section-title"><span class="section-num">9</span>Search Types &mdash; Complete Deep Dive</div>
    <p style="color:#b0bec5;font-size:.92em;margin-bottom:20px;line-height:1.6">Har search type ka apna architecture, data structures, capacity estimation aur trade-offs hote hai. Click karke detail me padho.</p>
    <div class="search-type-accordion">

<!-- ===== TYPEAHEAD / AUTO-COMPLETE SEARCH ===== -->
<details>
    <summary>Typeahead / Auto-Complete Search<span class="st-badge">TRIE + TOP-K</span></summary>
    <div class="st-content">
        <div class="st-subtitle">What is Typeahead Search?</div>
        <p style="color:#b0bec5;font-size:.9em;line-height:1.6;margin-bottom:12px">User jab search box me type karta hai, har keystroke pe real-time suggestions dikhte hai. "how to" likhte hi "how to lose weight", "how to code in java" suggest hota hai. Google pe har character type karne pe ~200ms me suggestions aate hai. Ye puri system Trie data structure + precomputed top-K cache pe chalti hai.</p>

        <div class="st-subtitle">Functional Requirements</div>
        <div class="st-grid">
            <div class="st-card"><span class="st-label">Prefix Matching</span>User type kare "how t" toh sab queries jo "how t" se start hoti hai wo suggest karni hai &mdash; partial prefix se match</div>
            <div class="st-card"><span class="st-label">Top-K Suggestions</span>Har prefix ke liye top 10 most popular queries return karna &mdash; ranked by search frequency</div>
            <div class="st-card"><span class="st-label">Real-time Response</span>Har keystroke pe &lt; 100ms me suggestions aane chahiye &mdash; user ko typing lag feel nahi hona chahiye</div>
            <div class="st-card"><span class="st-label">Trending Queries</span>Jo abhi trending hai (cricket score, election results) wo suggestions me upar aana chahiye &mdash; freshness factor</div>
            <div class="st-card"><span class="st-label">Personalization</span>User ki past searches ko higher weight dena &mdash; agar pehle "python" zyada search kiya hai toh "py" pe "python" pehle suggest ho</div>
            <div class="st-card"><span class="st-label">Spell Tolerance</span>"amzn" type karne pe bhi "amazon" suggest hona chahiye &mdash; fuzzy matching support</div>
        </div>

        <div class="st-subtitle">Non-Functional Requirements</div>
        <div class="st-grid">
            <div class="st-card"><span class="st-label">Latency &lt; 100ms (P99)</span>Har keystroke pe instant response &mdash; 100ms se zyada delay = user frustration. CDN edge caching se achieve karo</div>
            <div class="st-card"><span class="st-label">Availability 99.99%</span>Search suggestions down = search UX broken. Replicated Trie servers across regions</div>
            <div class="st-card"><span class="st-label">Scalability &mdash; 8.5B queries/day</span>Millions of concurrent prefix queries handle karne hain &mdash; horizontal sharding by prefix</div>
            <div class="st-card"><span class="st-label">Freshness &mdash; Minutes</span>Naye trending query 5-10 min me suggestions me aana chahiye &mdash; streaming pipeline for real-time updates</div>
        </div>

        <div class="st-subtitle">Data Structures Used</div>
        <p style="margin-bottom:8px"><span class="st-ds-tag">Trie (Prefix Tree)</span><span class="st-ds-tag">Compressed Trie (Radix)</span><span class="st-ds-tag">Min-Heap (Top-K)</span><span class="st-ds-tag">HashMap (Cache)</span><span class="st-ds-tag">Bloom Filter (Offensive Query)</span></p>
        <div class="st-grid">
            <div class="st-card"><span class="st-label">Trie</span>Har character ek node &mdash; "how" = h→o→w node path. Prefix "ho" tak traverse karo → subtree me sab queries milti hai. O(L) lookup where L = prefix length<br><br><span class="st-pro">Pros: O(L) prefix search, all completions from any prefix, space sharing for common prefixes</span><br><span class="st-con">Cons: High memory (26+ pointers/node), not cache-friendly, rebuild cost</span></div>
            <div class="st-card"><span class="st-label">Compressed Trie (Radix Tree)</span>Single-child chains compress karo: h→o→w→ →t→o compress to "how to" ek node me. 60-70% memory saving<br><br><span class="st-pro">Pros: 60% less memory, fewer node traversals, better cache performance</span><br><span class="st-con">Cons: Split/merge complexity on insert/delete, implementation harder</span></div>
            <div class="st-card"><span class="st-label">Min-Heap (Top-K per node)</span>Har Trie node pe top-10 popular queries pre-computed. Prefix match hone pe direct top-K return karo without DFS<br><br><span class="st-pro">Pros: O(1) top-K lookup at query time, no DFS needed</span><br><span class="st-con">Cons: Update cost (rebuild heap on frequency change), extra memory per node</span></div>
        </div>

        <div class="st-subtitle">Capacity Estimation</div>
        <div class="st-grid">
            <div class="st-card">
                <span class="st-label">Query Volume</span>
                <div class="st-cap-row"><span class="calc-label">Total search queries/day</span><span class="calc-value">8.5 Billion</span></div>
                <div class="st-cap-row"><span class="calc-label">Avg characters typed/query</span><span class="calc-value">5 (before selecting suggestion)</span></div>
                <div class="st-cap-row"><span class="calc-label">Typeahead requests/day</span><span class="calc-value">8.5B &times; 5 = 42.5 Billion</span></div>
                <div class="st-cap-row"><span class="calc-label">Typeahead QPS</span><span class="calc-value">~490K QPS</span></div>
                <div class="st-cap-row"><span class="calc-label">Peak QPS (3x)</span><span class="calc-value">~1.5M QPS</span></div>
            </div>
            <div class="st-card">
                <span class="st-label">Storage</span>
                <div class="st-cap-row"><span class="calc-label">Unique queries (last 30 days)</span><span class="calc-value">~5 Billion</span></div>
                <div class="st-cap-row"><span class="calc-label">Avg query length</span><span class="calc-value">20 characters</span></div>
                <div class="st-cap-row"><span class="calc-label">Trie memory (compressed)</span><span class="calc-value">~50 GB per shard</span></div>
                <div class="st-cap-row"><span class="calc-label">Top-K cache per node</span><span class="calc-value">~30 GB additional</span></div>
                <div class="st-cap-row"><span class="calc-label">Total per replica</span><span class="calc-value">~80 GB RAM</span></div>
            </div>
            <div class="st-card">
                <span class="st-label">Infrastructure</span>
                <div class="st-cap-row"><span class="calc-label">Shards (by prefix a-z, 0-9)</span><span class="calc-value">36 shards</span></div>
                <div class="st-cap-row"><span class="calc-label">Replicas per shard</span><span class="calc-value">3 (for availability)</span></div>
                <div class="st-cap-row"><span class="calc-label">Total Trie servers</span><span class="calc-value">~108 servers</span></div>
                <div class="st-cap-row"><span class="calc-label">Rebuild frequency</span><span class="calc-value">Hourly (incremental)</span></div>
            </div>
        </div>

        <div class="st-subtitle">Architecture Flow</div>
        <div class="flow-container">
            <div class="flow-box">User types "how t"</div>
            <div class="flow-arrow">&darr;</div>
            <div class="flow-box flow-green">Debounce (100ms wait)</div>
            <div class="flow-arrow">&darr;</div>
            <div class="flow-box flow-blue">CDN Edge Cache Check</div>
            <div class="flow-arrow">&darr;</div>
            <div class="flow-box flow-purple">Shard Router (hash prefix[0] &rarr; shard)</div>
            <div class="flow-arrow">&darr;</div>
            <div class="flow-box flow-green">Trie Server: traverse to "how t" node</div>
            <div class="flow-arrow">&darr;</div>
            <div class="flow-box flow-blue">Return pre-computed Top-10 from node</div>
            <div class="flow-arrow">&darr;</div>
            <div class="flow-box">Display suggestions (&lt; 50ms)</div>
        </div>
    </div>
</details>

<!-- ===== FULL-TEXT SEARCH ===== -->
<details>
    <summary>Full-Text Search (Keyword Search)<span class="st-badge">INVERTED INDEX + BM25</span></summary>
    <div class="st-content">
        <div class="st-subtitle">What is Full-Text Search?</div>
        <p style="color:#b0bec5;font-size:.9em;line-height:1.6;margin-bottom:12px">User query type karta hai "best machine learning course" &mdash; search engine 100 Billion indexed pages me se relevant results dhundh ke ranking ke saath return karta hai. Core me Inverted Index hai jo har word ke against documents ki list maintain karta hai, aur BM25/TF-IDF se relevance score calculate hota hai.</p>

        <div class="st-subtitle">Functional Requirements</div>
        <div class="st-grid">
            <div class="st-card"><span class="st-label">Multi-word Query</span>"machine learning python" &mdash; saare words ka intersection ya union based on AND/OR operator</div>
            <div class="st-card"><span class="st-label">Phrase Search</span>"machine learning" (quotes me) &mdash; exact phrase match, words adjacent hone chahiye same order me</div>
            <div class="st-card"><span class="st-label">Boolean Operators</span>"python AND machine learning NOT java" &mdash; include/exclude terms support</div>
            <div class="st-card"><span class="st-label">Relevance Ranking</span>BM25 score se rank &mdash; term frequency, document length normalization, inverse doc frequency</div>
            <div class="st-card"><span class="st-label">Snippet Generation</span>Result me query ke around ka text highlight karke dikhao &mdash; user ko context mile bina click kiye</div>
            <div class="st-card"><span class="st-label">Pagination</span>10 results per page, "next page" pe agle 10 &mdash; offset-based ya cursor-based pagination</div>
        </div>

        <div class="st-subtitle">Non-Functional Requirements</div>
        <div class="st-grid">
            <div class="st-card"><span class="st-label">Latency &lt; 200ms (P99)</span>Google benchmark: full search results 200ms me. Index in-memory + distributed query execution</div>
            <div class="st-card"><span class="st-label">Throughput ~100K QPS</span>8.5B queries/day = ~100K QPS average, 300K+ peak. Sharded index + replicas</div>
            <div class="st-card"><span class="st-label">Index Freshness &lt; 1 hour</span>Breaking news 1 hour me searchable hona chahiye. Real-time indexing pipeline via Kafka</div>
            <div class="st-card"><span class="st-label">Recall &gt; 95%</span>95%+ relevant pages results me hone chahiye &mdash; missing relevant page = bad search quality</div>
        </div>

        <div class="st-subtitle">Data Structures Used</div>
        <p style="margin-bottom:8px"><span class="st-ds-tag">Inverted Index</span><span class="st-ds-tag">Skip List</span><span class="st-ds-tag">B+ Tree</span><span class="st-ds-tag">Compressed Bitmap</span><span class="st-ds-tag">Priority Queue</span></p>
        <div class="st-grid">
            <div class="st-card"><span class="st-label">Inverted Index</span>Core DS: "machine" → [doc1:pos3, doc5:pos1, doc99:pos7]. Har term ke liye sorted posting list with positions<br><br><span class="st-pro">Pros: O(1) term lookup, boolean queries fast, phrase search with positional index</span><br><span class="st-con">Cons: Index size 30-50% of original data, update latency, merge cost for AND queries</span></div>
            <div class="st-card"><span class="st-label">Skip List (Posting List Merge)</span>AND query me 2+ posting lists ka intersection chahiye. Skip List se O(sqrt(n)) jumps possible during merge<br><br><span class="st-pro">Pros: Faster intersection than linear merge, simple implementation</span><br><span class="st-con">Cons: Memory overhead for skip pointers, probabilistic height</span></div>
            <div class="st-card"><span class="st-label">Priority Queue (Top-K Results)</span>BM25 score calculate karke Top-10 results nikalna &mdash; Min-Heap of size K maintain karo<br><br><span class="st-pro">Pros: O(N log K) for top-K extraction, memory efficient</span><br><span class="st-con">Cons: Score computation per document, distributed aggregation complex</span></div>
        </div>

        <div class="st-subtitle">Capacity Estimation</div>
        <div class="st-grid">
            <div class="st-card">
                <span class="st-label">Index Size</span>
                <div class="st-cap-row"><span class="calc-label">Total indexed pages</span><span class="calc-value">100 Billion</span></div>
                <div class="st-cap-row"><span class="calc-label">Avg page size (text)</span><span class="calc-value">50 KB</span></div>
                <div class="st-cap-row"><span class="calc-label">Raw text corpus</span><span class="calc-value">~5 PB</span></div>
                <div class="st-cap-row"><span class="calc-label">Inverted index size (40%)</span><span class="calc-value">~2 PB</span></div>
                <div class="st-cap-row"><span class="calc-label">Positional index (2x)</span><span class="calc-value">~4 PB total</span></div>
            </div>
            <div class="st-card">
                <span class="st-label">Query Processing</span>
                <div class="st-cap-row"><span class="calc-label">Avg terms per query</span><span class="calc-value">3.5 words</span></div>
                <div class="st-cap-row"><span class="calc-label">Posting list fetch per term</span><span class="calc-value">~10K-1M docs</span></div>
                <div class="st-cap-row"><span class="calc-label">Intersection + scoring</span><span class="calc-value">~50ms per shard</span></div>
                <div class="st-cap-row"><span class="calc-label">Shards queried parallel</span><span class="calc-value">~100 shards</span></div>
                <div class="st-cap-row"><span class="calc-label">Merge + re-rank</span><span class="calc-value">~20ms</span></div>
            </div>
            <div class="st-card">
                <span class="st-label">Infrastructure</span>
                <div class="st-cap-row"><span class="calc-label">Index shards</span><span class="calc-value">~10,000 shards</span></div>
                <div class="st-cap-row"><span class="calc-label">Replicas per shard</span><span class="calc-value">3</span></div>
                <div class="st-cap-row"><span class="calc-label">Index servers</span><span class="calc-value">~15,000 servers</span></div>
                <div class="st-cap-row"><span class="calc-label">RAM per server</span><span class="calc-value">256 GB (hot index in memory)</span></div>
            </div>
        </div>

        <div class="st-subtitle">BM25 Scoring Formula</div>
        <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">BM25 Ranking Algorithm</span></div><pre class="code-block">
<span class="cm">// BM25 Score for a query Q and document D:</span>
<span class="cm">// score(Q, D) = SUM for each term t in Q:</span>
<span class="cm">//   IDF(t) * (tf(t,D) * (k1 + 1)) / (tf(t,D) + k1 * (1 - b + b * |D| / avgdl))</span>

<span class="cm">// IDF(t) = log((N - n(t) + 0.5) / (n(t) + 0.5))</span>
<span class="cm">//   N = total documents, n(t) = docs containing term t</span>
<span class="cm">//   Rare terms get higher IDF (more informative)</span>

<span class="cm">// tf(t,D) = frequency of term t in document D</span>
<span class="cm">//   More occurrences = more relevant (with diminishing returns)</span>

<span class="cm">// |D| / avgdl = document length normalization</span>
<span class="cm">//   Longer docs naturally have more term matches</span>
<span class="cm">//   b=0.75: moderate length normalization</span>

<span class="cm">// k1 = 1.2 (term frequency saturation)</span>
<span class="cm">// b = 0.75 (length normalization weight)</span>

<span class="cm">// Example: Query "machine learning"</span>
<span class="cm">// Doc A (500 words): "machine"=5, "learning"=3 → high tf, normal length</span>
<span class="cm">// Doc B (10000 words): "machine"=10, "learning"=8 → high tf, BUT long doc penalized</span>
<span class="cm">// Result: Doc A ranks higher (better tf-to-length ratio)</span>
</pre></div>
    </div>
</details>

<!-- ===== FUZZY SEARCH / SPELL CORRECTION ===== -->
<details>
    <summary>Fuzzy Search / Spell Correction<span class="st-badge">EDIT DISTANCE + SYMSPELL</span></summary>
    <div class="st-content">
        <div class="st-subtitle">What is Fuzzy Search?</div>
        <p style="color:#b0bec5;font-size:.9em;line-height:1.6;margin-bottom:12px">User galat spelling type karta hai "amazn" ya "gogle" &mdash; search engine samajhta hai ki "amazon" ya "google" search karna hai. "Did you mean: amazon?" dikhata hai. Core me Edit Distance (Levenshtein Distance) algorithm hai jo minimum character operations (insert/delete/replace) count karta hai do strings ke beech.</p>

        <div class="st-subtitle">Functional Requirements</div>
        <div class="st-grid">
            <div class="st-card"><span class="st-label">"Did you mean?" Suggestions</span>Misspelled query pe correct spelling suggest karna &mdash; "amazn" → "Did you mean: amazon?"</div>
            <div class="st-card"><span class="st-label">Auto-Correct</span>Obvious typos auto-correct karna &mdash; "gogle" automatically "google" results dikha de bina ask kiye</div>
            <div class="st-card"><span class="st-label">Edit Distance &le; 2</span>Maximum 2 character changes tak fuzzy match &mdash; "amazn" (1 edit), "amzon" (1 edit), "amzn" (2 edits)</div>
            <div class="st-card"><span class="st-label">Context-Aware</span>"python" ke baad "prnt" type kare toh "print" suggest karo, "paint" nahi &mdash; context se correct suggestion</div>
        </div>

        <div class="st-subtitle">Non-Functional Requirements</div>
        <div class="st-grid">
            <div class="st-card"><span class="st-label">Latency &lt; 50ms</span>Spell correction search ke pehle hona chahiye &mdash; total budget 200ms me se 50ms spell check ke liye</div>
            <div class="st-card"><span class="st-label">Accuracy &gt; 95%</span>95%+ typos correctly identify hone chahiye without false corrections (correct word ko change nahi karna)</div>
            <div class="st-card"><span class="st-label">Dictionary: 10M+ words</span>English vocabulary + brand names + technical terms + trending words &mdash; continuously updated</div>
        </div>

        <div class="st-subtitle">Data Structures &amp; Algorithms</div>
        <p style="margin-bottom:8px"><span class="st-ds-tag">Edit Distance (DP)</span><span class="st-ds-tag">SymSpell</span><span class="st-ds-tag">BK-Tree</span><span class="st-ds-tag">N-gram Index</span><span class="st-ds-tag">Soundex / Metaphone</span></p>
        <div class="st-grid">
            <div class="st-card"><span class="st-label">Edit Distance (Levenshtein)</span>Dynamic Programming: dp[i][j] = min operations to convert word1[0..i] to word2[0..j]. Operations: insert, delete, replace. O(m*n) time/space<br><br><span class="st-pro">Pros: Exact minimum distance, handles all edit types, proven correctness</span><br><span class="st-con">Cons: O(m*n) too slow for comparing against 10M dictionary words one by one</span></div>
            <div class="st-card"><span class="st-label">SymSpell (Symmetric Delete)</span>Pre-compute: har dictionary word ke saare deletions (edit distance 1,2) store karo. Query time: query ke deletions generate karo → HashMap lookup → O(1) match!<br><br><span class="st-pro">Pros: O(1) lookup at query time, 1M+ corrections/sec, pre-computed</span><br><span class="st-con">Cons: High memory for pre-computed deletions (10M words &times; deletions = ~500MB), offline build time</span></div>
            <div class="st-card"><span class="st-label">BK-Tree (Burkhard-Keller Tree)</span>Metric tree where edit distance is the metric. Query "amazn" with threshold 2 → tree prune karo, sirf relevant subtrees explore karo<br><br><span class="st-pro">Pros: Efficient search (prunes 90%+ tree), works with any distance metric</span><br><span class="st-con">Cons: Build time O(n log n), unbalanced tree possible, slower than SymSpell</span></div>
            <div class="st-card"><span class="st-label">N-gram Index</span>"amazon" → bi-grams: [am, ma, az, zo, on]. Typo "amazn" → [am, ma, az, zn]. Overlap score = 3/5 = 0.6 → candidate match<br><br><span class="st-pro">Pros: Fast candidate generation, language independent, works with any n</span><br><span class="st-con">Cons: Not exact (overlap != edit distance), false positives need verification</span></div>
        </div>

        <div class="st-subtitle">Capacity Estimation</div>
        <div class="st-grid">
            <div class="st-card">
                <span class="st-label">Scale</span>
                <div class="st-cap-row"><span class="calc-label">Queries needing spell check</span><span class="calc-value">~15% of all queries</span></div>
                <div class="st-cap-row"><span class="calc-label">Spell check QPS</span><span class="calc-value">100K &times; 15% = 15K QPS</span></div>
                <div class="st-cap-row"><span class="calc-label">Dictionary size</span><span class="calc-value">10M words</span></div>
                <div class="st-cap-row"><span class="calc-label">SymSpell pre-computed index</span><span class="calc-value">~500 MB RAM</span></div>
                <div class="st-cap-row"><span class="calc-label">Correction latency</span><span class="calc-value">&lt; 5ms (SymSpell in-memory)</span></div>
            </div>
        </div>
    </div>
</details>

<!-- ===== SEMANTIC / VECTOR SEARCH ===== -->
<details>
    <summary>Semantic / Vector Search<span class="st-badge">EMBEDDINGS + ANN</span></summary>
    <div class="st-content">
        <div class="st-subtitle">What is Semantic Search?</div>
        <p style="color:#b0bec5;font-size:.9em;line-height:1.6;margin-bottom:12px">Traditional search "keyword match" karta hai &mdash; "How to fix car" search karo toh sirf pages jisme ye exact words hai milenge. Semantic search MEANING samajhta hai &mdash; "automobile repair tutorial" bhi result me aayega kyunki meaning same hai. BERT/Word2Vec se text ko vector (numbers) me convert karte hai, phir vector similarity se match hota hai.</p>

        <div class="st-subtitle">Functional Requirements</div>
        <div class="st-grid">
            <div class="st-card"><span class="st-label">Meaning-based Matching</span>"cheap flights" search pe "affordable airfare" bhi match hona chahiye &mdash; synonyms, paraphrases understand karo</div>
            <div class="st-card"><span class="st-label">Intent Understanding</span>"apple" search pe context se decide karo &mdash; tech enthusiast ke liye Apple Inc, chef ke liye apple fruit</div>
            <div class="st-card"><span class="st-label">Multi-lingual</span>"voiture rouge" (French for "red car") search pe English "red car" results bhi dikhao &mdash; cross-language embeddings</div>
            <div class="st-card"><span class="st-label">Zero-shot Queries</span>Rare queries jo training data me nahi thi unko bhi handle karo &mdash; generalization through embeddings</div>
        </div>

        <div class="st-subtitle">Data Structures &amp; Algorithms</div>
        <p style="margin-bottom:8px"><span class="st-ds-tag">Vector Embeddings (768-dim)</span><span class="st-ds-tag">HNSW Graph</span><span class="st-ds-tag">IVF (Inverted File)</span><span class="st-ds-tag">Product Quantization</span><span class="st-ds-tag">KD-Tree</span></p>
        <div class="st-grid">
            <div class="st-card"><span class="st-label">Vector Embeddings</span>BERT/Sentence-BERT se text → 768-dimensional vector. Similar meaning = similar vectors. Cosine similarity se match score<br><br><span class="st-pro">Pros: Captures meaning, handles synonyms, multi-lingual</span><br><span class="st-con">Cons: Model inference latency (~10ms), embedding storage cost, no exact match guarantee</span></div>
            <div class="st-card"><span class="st-label">HNSW (Hierarchical Navigable Small World)</span>Graph-based ANN (Approximate Nearest Neighbor). Multi-layer graph where top layers are sparse (fast navigation), bottom layers dense (precise)<br><br><span class="st-pro">Pros: O(log n) query time, 95%+ recall, best in-memory ANN performance</span><br><span class="st-con">Cons: High memory (graph + vectors), build time O(n log n), not great for streaming updates</span></div>
            <div class="st-card"><span class="st-label">IVF (Inverted File Index)</span>Cluster vectors into K groups (K-means). Query time: find nearest clusters → search only those clusters<br><br><span class="st-pro">Pros: Reduces search space drastically, works with PQ for compression</span><br><span class="st-con">Cons: Cluster boundary misses (edge vectors), training required, quality depends on K</span></div>
        </div>

        <div class="st-subtitle">Capacity Estimation</div>
        <div class="st-grid">
            <div class="st-card">
                <span class="st-label">Vector Storage</span>
                <div class="st-cap-row"><span class="calc-label">Documents to embed</span><span class="calc-value">100 Billion pages</span></div>
                <div class="st-cap-row"><span class="calc-label">Vector dimensions</span><span class="calc-value">768 (BERT) &times; 4 bytes</span></div>
                <div class="st-cap-row"><span class="calc-label">Per vector</span><span class="calc-value">3 KB</span></div>
                <div class="st-cap-row"><span class="calc-label">Total raw vectors</span><span class="calc-value">~300 PB (impractical!)</span></div>
                <div class="st-cap-row"><span class="calc-label">With PQ (32x compression)</span><span class="calc-value">~10 PB (still huge)</span></div>
                <div class="st-cap-row"><span class="calc-label">Practical: top 1B pages only</span><span class="calc-value">~3 TB vectors + HNSW graph</span></div>
            </div>
        </div>

        <div class="st-subtitle">Hybrid Approach (Real World)</div>
        <p style="color:#b0bec5;font-size:.9em;line-height:1.6">Google actual me pure semantic search nahi use karta &mdash; <strong style="color:#e0e0e0">Hybrid approach</strong> hai: pehle Inverted Index se candidate documents nikalo (fast, keyword match), phir BERT re-ranker se semantic score calculate karo (accurate, meaning match). Ye 2-stage approach latency aur accuracy dono balance karta hai.</p>
    </div>
</details>

<!-- ===== IMAGE / VISUAL SEARCH ===== -->
<details>
    <summary>Image / Visual Search<span class="st-badge">CNN + PERCEPTUAL HASH</span></summary>
    <div class="st-content">
        <div class="st-subtitle">What is Image Search?</div>
        <p style="color:#b0bec5;font-size:.9em;line-height:1.6;margin-bottom:12px">2 types hai: (1) Text-to-Image: "sunset beach" type karo → relevant images dikhao. (2) Reverse Image Search: image upload karo → similar images dhundho (Google Lens). CNN (Convolutional Neural Network) se image ko feature vector me convert karte hai, phir similarity search hota hai.</p>

        <div class="st-subtitle">Functional Requirements</div>
        <div class="st-grid">
            <div class="st-card"><span class="st-label">Text-to-Image Search</span>"red car sunset" query pe matching images dikhao &mdash; alt text, surrounding text, aur CLIP embeddings se match</div>
            <div class="st-card"><span class="st-label">Reverse Image Search</span>User image upload kare → similar images, same product, ya source website dhundho &mdash; Google Lens style</div>
            <div class="st-card"><span class="st-label">Visual Similarity</span>Color, shape, texture, objects &mdash; same dress different angle bhi match hona chahiye</div>
            <div class="st-card"><span class="st-label">Safe Search Filter</span>NSFW/adult images filter karna &mdash; ML classifier se categorize before showing results</div>
        </div>

        <div class="st-subtitle">Data Structures &amp; Algorithms</div>
        <p style="margin-bottom:8px"><span class="st-ds-tag">CNN Feature Vectors</span><span class="st-ds-tag">Perceptual Hash (pHash)</span><span class="st-ds-tag">CLIP Embeddings</span><span class="st-ds-tag">HNSW (ANN)</span><span class="st-ds-tag">LSH (Locality Sensitive)</span></p>
        <div class="st-grid">
            <div class="st-card"><span class="st-label">CNN Feature Extraction</span>ResNet/EfficientNet se image → 2048-dim feature vector. Similar images have similar vectors. L2 distance ya cosine similarity se match<br><br><span class="st-pro">Pros: Captures visual features (edges, textures, objects), rotation/scale invariant</span><br><span class="st-con">Cons: Model inference ~20ms/image, feature vector storage large, training data needed</span></div>
            <div class="st-card"><span class="st-label">Perceptual Hash (pHash)</span>Image → resize to 8x8 grayscale → DCT → binary hash. Similar images = similar hash (Hamming distance &le; 5)<br><br><span class="st-pro">Pros: O(1) comparison (XOR), very compact (64 bits/image), exact duplicate detection</span><br><span class="st-con">Cons: Sensitive to heavy edits (crop, overlay), not semantic (same object different scene = different hash)</span></div>
            <div class="st-card"><span class="st-label">CLIP (OpenAI)</span>Text aur image dono ko same embedding space me project karta hai. "red car" text vector aur red car image vector similar hote hai<br><br><span class="st-pro">Pros: Text-to-image + image-to-image dono ek model se, zero-shot, multi-modal</span><br><span class="st-con">Cons: Large model (~400M params), inference cost high, fine-tuning needs GPU</span></div>
        </div>

        <div class="st-subtitle">Capacity Estimation</div>
        <div class="st-grid">
            <div class="st-card">
                <span class="st-label">Scale</span>
                <div class="st-cap-row"><span class="calc-label">Total indexed images</span><span class="calc-value">~50 Billion</span></div>
                <div class="st-cap-row"><span class="calc-label">Feature vector per image</span><span class="calc-value">2048-dim &times; 4 bytes = 8 KB</span></div>
                <div class="st-cap-row"><span class="calc-label">Total feature storage</span><span class="calc-value">~400 TB</span></div>
                <div class="st-cap-row"><span class="calc-label">Image search QPS</span><span class="calc-value">~5K QPS</span></div>
                <div class="st-cap-row"><span class="calc-label">pHash index (64 bits/img)</span><span class="calc-value">~50 GB</span></div>
            </div>
        </div>
    </div>
</details>

<!-- ===== GEO / LOCATION SEARCH ===== -->
<details>
    <summary>Geo / Location-based Search<span class="st-badge">GEOHASH + R-TREE</span></summary>
    <div class="st-content">
        <div class="st-subtitle">What is Geo Search?</div>
        <p style="color:#b0bec5;font-size:.9em;line-height:1.6;margin-bottom:12px">"Pizza near me", "ATM within 1km" &mdash; user ki location ke basis pe nearby results dikhana. Latitude/longitude coordinates pe spatial indexing hoti hai. Geohash se 2D coordinates ko 1D string me convert karke efficient range queries possible hoti hai.</p>

        <div class="st-subtitle">Functional Requirements</div>
        <div class="st-grid">
            <div class="st-card"><span class="st-label">Proximity Search</span>"restaurants within 2km" &mdash; given radius me saare matching places return karo sorted by distance</div>
            <div class="st-card"><span class="st-label">Bounding Box</span>Map viewport ke andar ke saare results &mdash; top-left (lat1,lng1) to bottom-right (lat2,lng2) rectangle</div>
            <div class="st-card"><span class="st-label">Distance Calculation</span>Haversine formula se earth surface pe actual distance calculate karo (not straight line)</div>
            <div class="st-card"><span class="st-label">Local Results Boosting</span>"pizza" search pe nearby pizzerias higher rank pe &mdash; distance-based relevance boosting</div>
        </div>

        <div class="st-subtitle">Data Structures &amp; Algorithms</div>
        <p style="margin-bottom:8px"><span class="st-ds-tag">Geohash</span><span class="st-ds-tag">R-Tree</span><span class="st-ds-tag">Quadtree</span><span class="st-ds-tag">S2 Geometry (Google)</span><span class="st-ds-tag">H3 (Uber)</span></p>
        <div class="st-grid">
            <div class="st-card"><span class="st-label">Geohash</span>Lat/lng → base32 string. "9q8yyk" = San Francisco area. Same prefix = nearby locations. B+ Tree index on geohash string se range queries fast<br><br><span class="st-pro">Pros: 1D string (indexable in any DB), prefix = proximity, easy caching</span><br><span class="st-con">Cons: Edge cases at boundaries (neighbors can have different prefixes), not uniform cell sizes</span></div>
            <div class="st-card"><span class="st-label">R-Tree</span>Spatial index for rectangles. Internal nodes = bounding boxes, leaf nodes = actual points. "Find all within box" = tree traversal, prune non-overlapping subtrees<br><br><span class="st-pro">Pros: Efficient range queries, handles 2D naturally, supports polygons/rectangles</span><br><span class="st-con">Cons: Complex implementation, insertion rebalancing expensive, not great for point-only queries</span></div>
            <div class="st-card"><span class="st-label">Quadtree</span>Space recursively divide into 4 quadrants. Dense areas = deeper tree (more granular). Sparse areas = shallow<br><br><span class="st-pro">Pros: Adaptive resolution (dense areas more detail), simple implementation</span><br><span class="st-con">Cons: Unbalanced tree (hot spots deep), not disk-friendly, rebuild on changes</span></div>
        </div>

        <div class="st-subtitle">Capacity Estimation</div>
        <div class="st-grid">
            <div class="st-card">
                <span class="st-label">Scale</span>
                <div class="st-cap-row"><span class="calc-label">Total places indexed (Google Maps)</span><span class="calc-value">~200 Million</span></div>
                <div class="st-cap-row"><span class="calc-label">Geo search QPS</span><span class="calc-value">~50K QPS</span></div>
                <div class="st-cap-row"><span class="calc-label">Geohash index size</span><span class="calc-value">~10 GB</span></div>
                <div class="st-cap-row"><span class="calc-label">R-Tree in-memory</span><span class="calc-value">~20 GB</span></div>
                <div class="st-cap-row"><span class="calc-label">Avg result latency</span><span class="calc-value">&lt; 50ms</span></div>
            </div>
        </div>
    </div>
</details>

<!-- ===== REAL-TIME / TRENDING SEARCH ===== -->
<details>
    <summary>Real-time / Trending Search<span class="st-badge">SLIDING WINDOW + COUNT-MIN</span></summary>
    <div class="st-content">
        <div class="st-subtitle">What is Trending Search?</div>
        <p style="color:#b0bec5;font-size:.9em;line-height:1.6;margin-bottom:12px">"Trending Now" section me abhi jo zyada search ho raha hai wo dikhata hai &mdash; cricket match score, election results, breaking news. Sliding window + Count-Min Sketch se real-time frequency tracking hota hai bina saare queries store kiye.</p>

        <div class="st-subtitle">Functional Requirements</div>
        <div class="st-grid">
            <div class="st-card"><span class="st-label">Top-K Trending</span>Last 1 hour me sabse zyada searched queries &mdash; ranked by velocity (rate of increase, not just count)</div>
            <div class="st-card"><span class="st-label">Real-time Updates</span>Trending list har 30 sec me refresh hona chahiye &mdash; naya trend 2-5 min me appear hona chahiye</div>
            <div class="st-card"><span class="st-label">Regional Trending</span>India me alag trending, US me alag &mdash; geo-based trending with regional aggregation</div>
            <div class="st-card"><span class="st-label">Spike Detection</span>Normally 100 QPS wali query suddenly 10,000 QPS ho jaaye → trending flag laga do</div>
        </div>

        <div class="st-subtitle">Data Structures &amp; Algorithms</div>
        <p style="margin-bottom:8px"><span class="st-ds-tag">Count-Min Sketch</span><span class="st-ds-tag">Sliding Window</span><span class="st-ds-tag">Min-Heap (Top-K)</span><span class="st-ds-tag">Exponential Decay</span><span class="st-ds-tag">HyperLogLog</span></p>
        <div class="st-grid">
            <div class="st-card"><span class="st-label">Count-Min Sketch</span>Probabilistic frequency counter. 2D array with d hash functions. Increment: hash query → increment d cells. Query: min of d cells = approximate count<br><br><span class="st-pro">Pros: O(1) increment/query, fixed memory (width &times; depth), handles millions of unique queries in ~1MB</span><br><span class="st-con">Cons: Over-counts (never under-counts), no exact count, can't enumerate all stored queries</span></div>
            <div class="st-card"><span class="st-label">Sliding Window (Time-bucketed)</span>Time ko 1-min buckets me divide karo. Har bucket ka apna Count-Min Sketch. "Last 1 hour" = last 60 buckets sum. Oldest bucket expire karo<br><br><span class="st-pro">Pros: Time-decayed counting, old trends naturally expire, memory bounded</span><br><span class="st-con">Cons: Bucket granularity trade-off (1 min vs 1 sec), memory = buckets &times; sketch size</span></div>
            <div class="st-card"><span class="st-label">HyperLogLog</span>Unique searchers count karo (not just searches). "IPL" searched 1M times but by only 100K unique users vs "election" 500K times by 400K unique users → election more genuinely trending<br><br><span class="st-pro">Pros: O(1) cardinality estimate, only 12 KB memory per counter, &lt; 1% error</span><br><span class="st-con">Cons: Approximate (not exact), can't tell WHO searched, only unique count</span></div>
        </div>

        <div class="st-subtitle">Capacity Estimation</div>
        <div class="st-grid">
            <div class="st-card">
                <span class="st-label">Scale</span>
                <div class="st-cap-row"><span class="calc-label">Queries to track</span><span class="calc-value">100K QPS streaming</span></div>
                <div class="st-cap-row"><span class="calc-label">Count-Min Sketch size</span><span class="calc-value">~1 MB per time bucket</span></div>
                <div class="st-cap-row"><span class="calc-label">60 buckets (1 hour window)</span><span class="calc-value">~60 MB total</span></div>
                <div class="st-cap-row"><span class="calc-label">Top-K heap</span><span class="calc-value">&lt; 1 MB (K=1000)</span></div>
                <div class="st-cap-row"><span class="calc-label">Update latency</span><span class="calc-value">&lt; 1ms per query</span></div>
                <div class="st-cap-row"><span class="calc-label">Regional instances</span><span class="calc-value">~50 (per major region)</span></div>
            </div>
        </div>
    </div>
</details>

<!-- ===== FACETED SEARCH ===== -->
<details>
    <summary>Faceted Search (Filtered Search)<span class="st-badge">BITMAP INDEX + AGGREGATION</span></summary>
    <div class="st-content">
        <div class="st-subtitle">What is Faceted Search?</div>
        <p style="color:#b0bec5;font-size:.9em;line-height:1.6;margin-bottom:12px">Amazon pe "laptop" search karo toh left side me filters dikhte hai: Brand (Dell, HP, Lenovo), Price (10K-20K, 20K-50K), Rating (4+ stars). Ye facets hai &mdash; search results ko multiple dimensions se filter karna. Har facet ke saath count bhi dikhta hai ki kitne results available hai.</p>

        <div class="st-subtitle">Functional Requirements</div>
        <div class="st-grid">
            <div class="st-card"><span class="st-label">Dynamic Facet Generation</span>Search results ke basis pe available filters dynamically generate karo with counts &mdash; "Brand: Dell (45), HP (32)"</div>
            <div class="st-card"><span class="st-label">Multi-facet Selection</span>Multiple filters combine karo &mdash; Brand=Dell AND Price=20K-50K AND Rating=4+ → intersection of all filters</div>
            <div class="st-card"><span class="st-label">Range Facets</span>Price 10K-50K, Date last 7 days &mdash; continuous values ke liye range-based filtering</div>
            <div class="st-card"><span class="st-label">Facet Count Updates</span>Ek filter select karne pe baaki facets ke counts update hone chahiye &mdash; real-time recalculation</div>
        </div>

        <div class="st-subtitle">Data Structures &amp; Algorithms</div>
        <p style="margin-bottom:8px"><span class="st-ds-tag">Bitmap Index</span><span class="st-ds-tag">Roaring Bitmap</span><span class="st-ds-tag">Inverted Index per Facet</span><span class="st-ds-tag">B+ Tree (Range)</span></p>
        <div class="st-grid">
            <div class="st-card"><span class="st-label">Bitmap Index</span>Har facet value ke liye ek bitmap: Dell=[1,0,1,0,0,1...], HP=[0,1,0,1,0,0...]. AND = bitwise AND of bitmaps → O(n/64) with 64-bit words<br><br><span class="st-pro">Pros: Blazing fast AND/OR (bitwise ops), compact for low-cardinality facets, popcount = instant count</span><br><span class="st-con">Cons: Sparse bitmaps waste space (solved by Roaring Bitmap), high cardinality facets inefficient</span></div>
            <div class="st-card"><span class="st-label">Roaring Bitmap</span>Compressed bitmap: dense chunks use bitmap, sparse chunks use sorted arrays. Best of both worlds<br><br><span class="st-pro">Pros: 10-100x compression over plain bitmaps, fast set operations, used by Elasticsearch/Lucene</span><br><span class="st-con">Cons: Complexity in implementation, chunk switching overhead, not trivially parallelizable</span></div>
        </div>

        <div class="st-subtitle">Capacity Estimation</div>
        <div class="st-grid">
            <div class="st-card">
                <span class="st-label">E-commerce Scale (Amazon)</span>
                <div class="st-cap-row"><span class="calc-label">Total products</span><span class="calc-value">~350 Million</span></div>
                <div class="st-cap-row"><span class="calc-label">Facets per category</span><span class="calc-value">~20-50 facets</span></div>
                <div class="st-cap-row"><span class="calc-label">Bitmap index per facet</span><span class="calc-value">~44 MB (350M bits)</span></div>
                <div class="st-cap-row"><span class="calc-label">Roaring Bitmap (compressed)</span><span class="calc-value">~2-5 MB per facet</span></div>
                <div class="st-cap-row"><span class="calc-label">Faceted search latency</span><span class="calc-value">&lt; 100ms (including counts)</span></div>
            </div>
        </div>
    </div>
</details>

    </div>
</div>

<div class="section theme-blue">
    <div class="section-title"><span class="section-num">10</span>Deep Dive &mdash; Web Crawling Architecture</div>
    <div class="section-body">
        <p>Web crawler internet pe systematically pages fetch karta hai. Isme key challenges hain: politeness, duplicate URL detection, aur distributed coordination.</p>
        <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Crawler Architecture</span></div><pre class="code-block">
<span class="cm">WEB CRAWLER ARCHITECTURE:</span>
<span class="cm">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>

<span class="cm">  Seed URLs                    ┌──────────────┐</span>
<span class="cm">  ──────────▶                  │ URL Frontier  │ Priority queue of URLs to crawl</span>
<span class="cm">                               │ (Redis)       │ Per-domain rate limiting</span>
<span class="cm">                               └──────┬───────┘</span>
<span class="cm">                                      │</span>
<span class="cm">                                      ▼</span>
<span class="cm">                              ┌───────────────┐</span>
<span class="cm">                              │ DNS Resolver   │ Domain → IP cache</span>
<span class="cm">                              │ (Local Cache)  │ Avoid repeated DNS lookups</span>
<span class="cm">                              └──────┬────────┘</span>
<span class="cm">                                     ▼</span>
<span class="cm">                              ┌───────────────┐</span>
<span class="cm">                              │ robots.txt     │ Check crawl permission</span>
<span class="cm">                              │ Checker        │ Cache per domain (24hr TTL)</span>
<span class="cm">                              └──────┬────────┘</span>
<span class="cm">                                     ▼</span>
<span class="cm">                              ┌───────────────┐</span>
<span class="cm">                              │ HTTP Fetcher   │ Fetch page content</span>
<span class="cm">                              │ (Async, Pool)  │ Connection pooling + timeout</span>
<span class="cm">                              └──────┬────────┘</span>
<span class="cm">                                     ▼</span>
<span class="cm">                              ┌───────────────┐</span>
<span class="cm">                              │ Duplicate      │ URL seen before? (Bloom Filter)</span>
<span class="cm">                              │ Detector       │ Content same? (SimHash)</span>
<span class="cm">                              └──────┬────────┘</span>
<span class="cm">                                     ▼</span>
<span class="cm">           ┌─────────────────────────┼────────────────────┐</span>
<span class="cm">           ▼                         ▼                    ▼</span>
<span class="cm">  ┌────────────────┐      ┌──────────────────┐   ┌───────────────┐</span>
<span class="cm">  │ Link Extractor │      │ Content Parser   │   │ Page Store    │</span>
<span class="cm">  │ (Add to        │      │ (Index Pipeline) │   │ (S3 / HDFS)   │</span>
<span class="cm">  │  Frontier)     │      └──────────────────┘   └───────────────┘</span>
<span class="cm">  └────────────────┘</span>
</pre></div>
        <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="cm">// Bloom Filter — memory-efficient "URL already seen?" check</span>
<span class="cm">// 10 billion URLs ke liye ~1.2 GB memory lagta hai (1% false positive)</span>
<span class="kw">class</span> <span class="cn">BloomFilterURLDedup</span> {
    <span class="kw">private final</span> <span class="tp">BitSet</span> bitSet;
    <span class="kw">private final</span> <span class="tp">int</span> numHashFunctions;

    <span class="kw">public</span> <span class="tp">boolean</span> <span class="fn">mightContain</span>(<span class="tp">String</span> url) {
        <span class="cm">// All K hash positions check karo</span>
        <span class="cm">// Sab 1 hain → probably seen (small false positive chance)</span>
        <span class="cm">// Koi bhi 0 → definitely NOT seen</span>
        <span class="kw">for</span> (<span class="tp">int</span> i = 0; i &lt; numHashFunctions; i++) {
            <span class="tp">int</span> pos = hash(url, i) % bitSet.size();
            <span class="kw">if</span> (!bitSet.get(pos)) <span class="kw">return false</span>;
        }
        <span class="kw">return true</span>;
    }

    <span class="kw">public</span> <span class="tp">void</span> <span class="fn">add</span>(<span class="tp">String</span> url) {
        <span class="kw">for</span> (<span class="tp">int</span> i = 0; i &lt; numHashFunctions; i++) {
            <span class="tp">int</span> pos = hash(url, i) % bitSet.size();
            bitSet.set(pos);
        }
    }
}
</pre></div>
    </div>
</div>

<div class="section theme-green">
    <div class="section-title"><span class="section-num">11</span>Deep Dive &mdash; Inverted Index &amp; TF-IDF</div>
    <div class="section-body">
        <p>Inverted index search engine ka heart hai. Normal index me doc → words hota hai, inverted index me <strong>word → list of docs</strong> hota hai. Isi se fast keyword search possible hota hai.</p>
        <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Inverted Index Example</span></div><pre class="code-block">
<span class="cm">INVERTED INDEX STRUCTURE:</span>
<span class="cm">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>

<span class="cm">Documents:</span>
<span class="cm">  Doc1: "java spring boot tutorial"</span>
<span class="cm">  Doc2: "spring cloud microservices"</span>
<span class="cm">  Doc3: "java collections tutorial"</span>

<span class="cm">Forward Index (normal):     Inverted Index (search engine):</span>
<span class="cm">  Doc1 → [java,spring,       "java"   → [Doc1, Doc3]</span>
<span class="cm">          boot,tutorial]     "spring" → [Doc1, Doc2]</span>
<span class="cm">  Doc2 → [spring,cloud,      "boot"   → [Doc1]</span>
<span class="cm">          microservices]     "tutorial"→ [Doc1, Doc3]</span>
<span class="cm">  Doc3 → [java,collections,  "cloud"  → [Doc2]</span>
<span class="cm">          tutorial]          ...</span>

<span class="cm">Query "java tutorial" → Intersection of:</span>
<span class="cm">  "java" → [Doc1, Doc3]  ∩  "tutorial" → [Doc1, Doc3]</span>
<span class="cm">  Result → [Doc1, Doc3] ✓</span>
</pre></div>
        <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="cm">// TF-IDF Scoring — relevance measure karta hai</span>
<span class="cm">// TF = Term Frequency — word kitni baar aaya doc me</span>
<span class="cm">// IDF = Inverse Doc Frequency — word kitna rare hai across all docs</span>
<span class="cm">// Score = TF × IDF</span>

<span class="kw">class</span> <span class="cn">TfIdfCalculator</span> {
    <span class="kw">private final</span> <span class="tp">long</span> totalDocuments;

    <span class="cm">// TF = (word count in doc) / (total words in doc)</span>
    <span class="kw">public</span> <span class="tp">double</span> <span class="fn">termFrequency</span>(<span class="tp">String</span> term, <span class="tp">String</span> docId) {
        <span class="tp">int</span> termCount = getTermCountInDoc(term, docId);
        <span class="tp">int</span> totalTerms = getTotalTermsInDoc(docId);
        <span class="kw">return</span> (<span class="tp">double</span>) termCount / totalTerms;
    }

    <span class="cm">// IDF = log(total docs / docs containing term)</span>
    <span class="cm">// Rare words get higher score, common words (the, is) get lower</span>
    <span class="kw">public</span> <span class="tp">double</span> <span class="fn">inverseDocFrequency</span>(<span class="tp">String</span> term) {
        <span class="tp">long</span> docsContainingTerm = getDocFrequency(term);
        <span class="kw">return</span> Math.log((<span class="tp">double</span>) totalDocuments / (1 + docsContainingTerm));
    }

    <span class="cm">// Final score = TF × IDF</span>
    <span class="kw">public</span> <span class="tp">double</span> <span class="fn">score</span>(<span class="tp">String</span> term, <span class="tp">String</span> docId) {
        <span class="kw">return</span> termFrequency(term, docId) * inverseDocFrequency(term);
    }
}

<span class="cm">// Example: Query "java spring"</span>
<span class="cm">// Doc1 TF-IDF("java")=0.25×1.1=0.275, TF-IDF("spring")=0.25×0.7=0.175</span>
<span class="cm">// Doc1 Total Score = 0.275 + 0.175 = 0.45</span>
<span class="cm">// Doc3 TF-IDF("java")=0.33×1.1=0.363, TF-IDF("spring")=0 (not present)</span>
<span class="cm">// Doc3 Total Score = 0.363</span>
<span class="cm">// Ranking: Doc1 > Doc3 (because Doc1 matches both terms)</span>
</pre></div>
    </div>
</div>

<div class="section theme-purple">
    <div class="section-title"><span class="section-num">12</span>Deep Dive &mdash; PageRank Algorithm</div>
    <div class="section-body">
        <p><strong>PageRank</strong> Google ka original algorithm hai. Idea simple hai: agar bahut saari important pages kisi page ko link kar rahi hain, toh wo page bhi important hai. Ye ek voting system jaisa hai.</p>
        <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">PageRank Explained</span></div><pre class="code-block">
<span class="cm">PAGERANK — HOW IT WORKS:</span>
<span class="cm">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>

<span class="cm">Core idea: Page A links to Page B = Page A "votes" for Page B</span>
<span class="cm">More incoming links from important pages = Higher PageRank</span>

<span class="cm">Formula:  PR(A) = (1 - d) + d × Σ [PR(Ti) / C(Ti)]</span>
<span class="cm">  d = damping factor (0.85) — random surfer model</span>
<span class="cm">  Ti = pages linking to A</span>
<span class="cm">  C(Ti) = number of outgoing links from Ti</span>

<span class="cm">Example:                        PageRank:</span>
<span class="cm">                                ┌──────────────────────┐</span>
<span class="cm">  Page A ──────▶ Page C         │ Page A: 0.15 (no     │</span>
<span class="cm">  Page B ──────▶ Page C         │   incoming links)    │</span>
<span class="cm">  Page D ──────▶ Page C         │ Page B: 0.15         │</span>
<span class="cm">  Page C ──────▶ Page A         │ Page C: 0.78 (3      │</span>
<span class="cm">                                │   incoming links!)   │</span>
<span class="cm">                                │ Page D: 0.15         │</span>
<span class="cm">                                └──────────────────────┘</span>
<span class="cm">  Page C has highest rank because A, B, D all link to it</span>
</pre></div>
        <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="cm">// PageRank — iterative computation</span>
<span class="kw">class</span> <span class="cn">PageRankCalculator</span> {
    <span class="kw">private static final</span> <span class="tp">double</span> DAMPING = 0.85;
    <span class="kw">private static final</span> <span class="tp">int</span> MAX_ITERATIONS = 100;
    <span class="kw">private static final</span> <span class="tp">double</span> CONVERGENCE_THRESHOLD = 0.0001;

    <span class="kw">public</span> <span class="tp">Map</span>&lt;<span class="tp">String</span>, <span class="tp">Double</span>&gt; <span class="fn">compute</span>(<span class="tp">Map</span>&lt;<span class="tp">String</span>, <span class="tp">List</span>&lt;<span class="tp">String</span>&gt;&gt; linkGraph) {
        <span class="tp">int</span> N = linkGraph.size();
        <span class="tp">Map</span>&lt;<span class="tp">String</span>, <span class="tp">Double</span>&gt; ranks = <span class="kw">new</span> <span class="tp">HashMap</span>&lt;&gt;();

        <span class="cm">// Step 1: Initialize — sab pages ko equal rank do</span>
        linkGraph.keySet().forEach(page -> ranks.put(page, 1.0 / N));

        <span class="cm">// Step 2: Iterate until convergence</span>
        <span class="kw">for</span> (<span class="tp">int</span> i = 0; i &lt; MAX_ITERATIONS; i++) {
            <span class="tp">Map</span>&lt;<span class="tp">String</span>, <span class="tp">Double</span>&gt; newRanks = <span class="kw">new</span> <span class="tp">HashMap</span>&lt;&gt;();
            <span class="tp">double</span> maxDiff = 0;

            <span class="kw">for</span> (<span class="tp">String</span> page : linkGraph.keySet()) {
                <span class="tp">double</span> incomingRank = getIncomingLinks(page).stream()
                    .mapToDouble(src -> ranks.get(src) / getOutDegree(src))
                    .sum();

                <span class="tp">double</span> newRank = (1 - DAMPING) / N + DAMPING * incomingRank;
                maxDiff = Math.max(maxDiff, Math.abs(newRank - ranks.get(page)));
                newRanks.put(page, newRank);
            }

            ranks.putAll(newRanks);
            <span class="kw">if</span> (maxDiff &lt; CONVERGENCE_THRESHOLD) <span class="kw">break</span>; <span class="cm">// converged!</span>
        }
        <span class="kw">return</span> ranks;
    }
}
</pre></div>
    </div>
</div>

<div class="section theme-yellow">
    <div class="section-title"><span class="section-num">13</span>Deep Dive &mdash; Auto-Complete with Trie</div>
    <div class="section-body">
        <p>Search suggestions ke liye <strong>Trie (Prefix Tree)</strong> use hota hai. Trie me har node ek character represent karta hai, aur prefix match bahut fast hota hai &mdash; O(L) time me jahan L prefix ki length hai.</p>
        <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="cm">// Trie-based Auto-Complete</span>
<span class="kw">class</span> <span class="cn">TrieNode</span> {
    <span class="tp">Map</span>&lt;<span class="tp">Character</span>, <span class="tp">TrieNode</span>&gt; children = <span class="kw">new</span> <span class="tp">HashMap</span>&lt;&gt;();
    <span class="tp">boolean</span> isEndOfWord;
    <span class="tp">long</span> frequency; <span class="cm">// kitni baar ye query search hua</span>
    <span class="tp">List</span>&lt;<span class="tp">String</span>&gt; topSuggestions; <span class="cm">// pre-computed top-K at this node</span>
}

<span class="kw">class</span> <span class="cn">AutoCompleteTrie</span> {
    <span class="kw">private final</span> <span class="tp">TrieNode</span> root = <span class="kw">new</span> <span class="tp">TrieNode</span>();

    <span class="cm">// query insert karo with frequency</span>
    <span class="kw">public</span> <span class="tp">void</span> <span class="fn">insert</span>(<span class="tp">String</span> query, <span class="tp">long</span> frequency) {
        <span class="tp">TrieNode</span> node = root;
        <span class="kw">for</span> (<span class="tp">char</span> c : query.toLowerCase().toCharArray()) {
            node = node.children.computeIfAbsent(c, k -> <span class="kw">new</span> <span class="tp">TrieNode</span>());
        }
        node.isEndOfWord = <span class="kw">true</span>;
        node.frequency = frequency;
    }

    <span class="cm">// prefix ke basis pe top-K suggestions return karo</span>
    <span class="kw">public</span> <span class="tp">List</span>&lt;<span class="tp">String</span>&gt; <span class="fn">getSuggestions</span>(<span class="tp">String</span> prefix, <span class="tp">int</span> k) {
        <span class="tp">TrieNode</span> node = root;
        <span class="kw">for</span> (<span class="tp">char</span> c : prefix.toLowerCase().toCharArray()) {
            node = node.children.get(c);
            <span class="kw">if</span> (node == <span class="kw">null</span>) <span class="kw">return</span> Collections.emptyList();
        }
        <span class="cm">// Optimization: pre-computed suggestions at each node</span>
        <span class="kw">if</span> (node.topSuggestions != <span class="kw">null</span>) <span class="kw">return</span> node.topSuggestions;

        <span class="cm">// Fallback: DFS se sab words collect karo, sort by frequency</span>
        <span class="tp">PriorityQueue</span>&lt;<span class="tp">Map.Entry</span>&lt;<span class="tp">String</span>,<span class="tp">Long</span>&gt;&gt; pq = <span class="kw">new</span> <span class="tp">PriorityQueue</span>&lt;&gt;(
            Comparator.comparingLong(e -> -e.getValue()));
        collectWords(node, prefix, pq);
        <span class="kw">return</span> pq.stream().limit(k).map(<span class="tp">Map.Entry</span>::getKey).toList();
    }
}

<span class="cm">// Optimization: har node pe top-K suggestions pre-compute karo</span>
<span class="cm">// Insert time badhta hai but query time O(1) ho jata hai</span>
<span class="cm">// Google me har second ~100K queries aati hain, toh query time fast hona zaroori</span>
</pre></div>
        <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Trie Visualization</span></div><pre class="code-block">
<span class="cm">TRIE STRUCTURE — prefix "how"</span>
<span class="cm">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>

<span class="cm">         root</span>
<span class="cm">          │</span>
<span class="cm">          h</span>
<span class="cm">          │</span>
<span class="cm">          o</span>
<span class="cm">          │</span>
<span class="cm">          w ──── topSuggestions: ["how to learn java",</span>
<span class="cm">         /|\                       "how to cook",</span>
<span class="cm">        / | \                      "how are you"]</span>
<span class="cm">       ·  ·  ·</span>
<span class="cm">      t   a   · (more branches)</span>
<span class="cm">      │   │</span>
<span class="cm">      o   r</span>
<span class="cm">      │   │</span>
<span class="cm">     ' '  e</span>
<span class="cm">      │</span>
<span class="cm">   l,c,... (learn, cook...)</span>

<span class="cm">User types "how" → instantly get pre-computed suggestions</span>
<span class="cm">No DFS needed at query time! O(prefix_length) lookup</span>
</pre></div>
    </div>
</div>

<div class="section theme-teal">
    <div class="section-title"><span class="section-num">14</span>Deep Dive &mdash; Complete Search Flow</div>
    <div class="section-body">
        <p>User "best java tutorials" search kare toh pura flow kya hota hai &mdash; end to end samjhte hain:</p>
        <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">End-to-End Search Flow</span></div><pre class="code-block">
<span class="cm">USER SEARCHES: "best java tutorials"</span>
<span class="cm">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>

<span class="cm">Step 1: QUERY PARSING</span>
<span class="cm">  "best java tutorials"</span>
<span class="cm">     │</span>
<span class="cm">     ├── Tokenize: ["best", "java", "tutorials"]</span>
<span class="cm">     ├── Remove stop words: ["best", "java", "tutorials"]</span>
<span class="cm">     ├── Stemming: ["best", "java", "tutori"]</span>
<span class="cm">     └── Spell check: all correct ✓</span>

<span class="cm">Step 2: INDEX LOOKUP (parallel per shard)</span>
<span class="cm">  "best"     → [Doc5, Doc12, Doc89, Doc234, ...]</span>
<span class="cm">  "java"     → [Doc1, Doc3, Doc5, Doc12, Doc456, ...]</span>
<span class="cm">  "tutori"   → [Doc1, Doc5, Doc12, Doc78, ...]</span>
<span class="cm">  Intersection → [Doc5, Doc12] (match all terms)</span>
<span class="cm">  Union fallback → [Doc1, Doc3, Doc5, Doc12, ...] (match any)</span>

<span class="cm">Step 3: SCORING &amp; RANKING</span>
<span class="cm">  Doc5:  TF-IDF=0.82 + PageRank=0.45 + Freshness=0.9 → Score: 2.17</span>
<span class="cm">  Doc12: TF-IDF=0.91 + PageRank=0.32 + Freshness=0.7 → Score: 1.93</span>
<span class="cm">  Doc1:  TF-IDF=0.65 + PageRank=0.88 + Freshness=0.5 → Score: 2.03</span>
<span class="cm">  Ranked: Doc5 > Doc1 > Doc12</span>

<span class="cm">Step 4: SNIPPET GENERATION</span>
<span class="cm">  Doc5 content: "...This is the **best** resource to learn **Java**.</span>
<span class="cm">  Our **tutorials** cover basics to advanced..."</span>
<span class="cm">  Snippet: highlighted text around query terms</span>

<span class="cm">Step 5: RESPONSE (under 200ms)</span>
<span class="cm">  {</span>
<span class="cm">    results: [</span>
<span class="cm">      { title: "Best Java Tutorials 2024", url: "...", snippet: "..." },</span>
<span class="cm">      { title: "Java Tutorial for Beginners", url: "...", snippet: "..." },</span>
<span class="cm">      ...</span>
<span class="cm">    ],</span>
<span class="cm">    totalResults: 45000000,</span>
<span class="cm">    timeTaken: "0.18 seconds"</span>
<span class="cm">  }</span>
</pre></div>
    </div>
</div>

<div class="section theme-pink">
    <div class="section-title"><span class="section-num">15</span>Comparison &mdash; Search Engine Components</div>
    <div class="section-body">
        <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Component Comparison</span></div><pre class="code-block">
<span class="cm">┌─────────────────┬────────────────────┬─────────────────────┬────────────────────┐</span>
<span class="cm">│ Component        │ Google              │ Elasticsearch        │ Interview Scope     │</span>
<span class="cm">├─────────────────┼────────────────────┼─────────────────────┼────────────────────┤</span>
<span class="cm">│ Crawler          │ Googlebot (custom) │ Not included        │ Design from scratch │</span>
<span class="cm">│ Index            │ Custom (Bigtable)  │ Lucene inverted idx │ Inverted index      │</span>
<span class="cm">│ Ranking          │ 200+ signals, AI   │ BM25 (TF-IDF++)     │ TF-IDF + PageRank   │</span>
<span class="cm">│ Auto-complete    │ Custom Trie + ML   │ Completion suggester│ Trie data structure │</span>
<span class="cm">│ Spell check      │ ML based           │ Term suggester      │ Edit distance       │</span>
<span class="cm">│ Scale            │ Billions of pages  │ Millions of docs    │ Discuss sharding    │</span>
<span class="cm">├─────────────────┼────────────────────┼─────────────────────┼────────────────────┤</span>
<span class="cm">│ Ranking Algo     │                    │                     │                    │</span>
<span class="cm">├─────────────────┼────────────────────┼─────────────────────┼────────────────────┤</span>
<span class="cm">│ TF-IDF           │ Basic building     │ Core of BM25        │ ✅ Must know        │</span>
<span class="cm">│                  │ block              │                     │                    │</span>
<span class="cm">│ BM25             │ Enhanced version   │ Default scorer      │ 🔶 Mention if asked │</span>
<span class="cm">│ PageRank         │ Original signal    │ Not applicable      │ ✅ Must know        │</span>
<span class="cm">│ ML Ranking       │ RankBrain/BERT     │ Learning to Rank    │ 🔶 Bonus            │</span>
<span class="cm">├─────────────────┼────────────────────┼─────────────────────┼────────────────────┤</span>
<span class="cm">│ Dedup Method     │                    │                     │                    │</span>
<span class="cm">├─────────────────┼────────────────────┼─────────────────────┼────────────────────┤</span>
<span class="cm">│ URL Dedup        │ Bloom Filter       │ N/A                 │ ✅ Bloom Filter     │</span>
<span class="cm">│ Content Dedup    │ SimHash            │ N/A                 │ ✅ SimHash/MinHash  │</span>
<span class="cm">│ Exact Dedup      │ MD5/SHA hash       │ N/A                 │ ✅ Hash compare     │</span>
<span class="cm">└─────────────────┴────────────────────┴─────────────────────┴────────────────────┘</span>
</pre></div>
    </div>
</div>

<div class="section theme-red">
    <div class="section-title"><span class="section-num">16</span>Bottlenecks &amp; Solutions</div>
    <div class="bottleneck-grid">
        <div class="bottleneck-item"><span class="bottleneck-problem">Index too large for single machine (TBs)</span><span class="bottleneck-arrow">&rarr;</span><span class="bottleneck-solution">Shard by term range or doc ID, parallel search + merge across 1000s shards</span></div>
        <div class="bottleneck-item"><span class="bottleneck-problem">Crawl speed vs politeness trade-off</span><span class="bottleneck-arrow">&rarr;</span><span class="bottleneck-solution">Per-domain rate limit (1 req/sec), parallel domains, respect robots.txt crawl-delay</span></div>
        <div class="bottleneck-item"><span class="bottleneck-problem">Stale index / freshness problem</span><span class="bottleneck-arrow">&rarr;</span><span class="bottleneck-solution">Tiered crawl: news hourly, popular daily, static weekly. Kafka real-time pipeline</span></div>
        <div class="bottleneck-item"><span class="bottleneck-problem">Query latency spikes (trending queries)</span><span class="bottleneck-arrow">&rarr;</span><span class="bottleneck-solution">Redis query cache (5 min TTL), shard replicas for read scaling, CDN cache</span></div>
        <div class="bottleneck-item"><span class="bottleneck-problem">Spam pages polluting results</span><span class="bottleneck-arrow">&rarr;</span><span class="bottleneck-solution">ML spam classifier, link farm detection, manual review, domain authority scoring</span></div>
        <div class="bottleneck-item"><span class="bottleneck-problem">Duplicate content waste (syndicated articles)</span><span class="bottleneck-arrow">&rarr;</span><span class="bottleneck-solution">SimHash fingerprint O(1), canonical URL selection, Hamming distance threshold</span></div>
    </div>
</div>

<!-- ============ 17. UML CLASS DIAGRAM ============ -->
<div class="section theme-deepblue">
    <div class="section-title"><span class="section-num">17</span>UML Class Diagram</div>
    <div class="uml-diagram">

        <div class="uml-section-label">Entity Classes</div>
        <div class="uml-grid">
            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;entity&raquo;</span>CrawledPage</div>
                <div class="uml-attributes">
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">id</span><span class="uml-type">Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">url</span><span class="uml-type">String</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">pageType</span><span class="uml-type">PageType</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">status</span><span class="uml-type">CrawlStatus</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">pageRank</span><span class="uml-type">double</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">lastCrawledAt</span><span class="uml-type">LocalDateTime</span></div>
                </div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getOutLinks()</span><span class="uml-type">List&lt;PageLink&gt;</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getInLinks()</span><span class="uml-type">List&lt;PageLink&gt;</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getPostings()</span><span class="uml-type">List&lt;PostingEntry&gt;</span></div>
                </div>
            </div>

            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;entity&raquo;</span>InvertedIndex</div>
                <div class="uml-attributes">
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">id</span><span class="uml-type">Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">term</span><span class="uml-type">String</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">documentCount</span><span class="uml-type">int</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">frequency</span><span class="uml-type">Long</span></div>
                </div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getPostings()</span><span class="uml-type">List&lt;PostingEntry&gt;</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getIDF()</span><span class="uml-type">double</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">merge()</span><span class="uml-type">void</span></div>
                </div>
            </div>

            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;entity&raquo;</span>PostingEntry</div>
                <div class="uml-attributes">
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">id</span><span class="uml-type">Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">pageId</span><span class="uml-type">Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">position</span><span class="uml-type">int</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">frequency</span><span class="uml-type">int</span></div>
                </div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getTF()</span><span class="uml-type">double</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getPage()</span><span class="uml-type">CrawledPage</span></div>
                </div>
            </div>

            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;entity&raquo;</span>PageLink</div>
                <div class="uml-attributes">
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">id</span><span class="uml-type">Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">sourcePageId</span><span class="uml-type">Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">targetPageId</span><span class="uml-type">Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">anchorText</span><span class="uml-type">String</span></div>
                </div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getSourcePage()</span><span class="uml-type">CrawledPage</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getTargetPage()</span><span class="uml-type">CrawledPage</span></div>
                </div>
            </div>

            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;entity&raquo;</span>RobotsRules</div>
                <div class="uml-attributes">
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">id</span><span class="uml-type">Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">domain</span><span class="uml-type">String</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">disallowedPaths</span><span class="uml-type">List&lt;String&gt;</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">crawlDelay</span><span class="uml-type">int</span></div>
                </div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">isAllowed()</span><span class="uml-type">boolean</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getDelay()</span><span class="uml-type">int</span></div>
                </div>
            </div>

            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;entity&raquo;</span>SearchQueryLog</div>
                <div class="uml-attributes">
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">id</span><span class="uml-type">Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">userId</span><span class="uml-type">Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">query</span><span class="uml-type">String</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">resultsCount</span><span class="uml-type">int</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">clickedPosition</span><span class="uml-type">int</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">searchType</span><span class="uml-type">SearchType</span></div>
                </div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getUser()</span><span class="uml-type">User</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getCTR()</span><span class="uml-type">double</span></div>
                </div>
            </div>
        </div>

        <div class="uml-section-label">Enums</div>
        <div class="uml-grid">
            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;enum&raquo;</span>CrawlStatus</div>
                <div class="uml-attributes">
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">PENDING</span></div>
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">CRAWLING</span></div>
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">CRAWLED</span></div>
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">FAILED</span></div>
                </div>
            </div>
            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;enum&raquo;</span>PageType</div>
                <div class="uml-attributes">
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">HTML</span></div>
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">PDF</span></div>
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">IMAGE</span></div>
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">VIDEO</span></div>
                </div>
            </div>
            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;enum&raquo;</span>CrawlPriority</div>
                <div class="uml-attributes">
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">CRITICAL</span></div>
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">HIGH</span></div>
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">MEDIUM</span></div>
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">LOW</span></div>
                </div>
            </div>
            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;enum&raquo;</span>IndexStatus</div>
                <div class="uml-attributes">
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">INDEXED</span></div>
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">NOT_INDEXED</span></div>
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">DEINDEXED</span></div>
                </div>
            </div>
            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;enum&raquo;</span>SearchType</div>
                <div class="uml-attributes">
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">WEB</span></div>
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">IMAGE</span></div>
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">VIDEO</span></div>
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">NEWS</span></div>
                </div>
            </div>
            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;enum&raquo;</span>SafeSearchLevel</div>
                <div class="uml-attributes">
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">OFF</span></div>
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">MODERATE</span></div>
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">STRICT</span></div>
                </div>
            </div>
        </div>

        <div class="uml-section-label">Service Classes</div>
        <div class="uml-grid">
            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;service&raquo;</span>CrawlerService</div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">crawl()</span><span class="uml-type">CrawledPage</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">fetchPage()</span><span class="uml-type">String</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">extractLinks()</span><span class="uml-type">List&lt;String&gt;</span></div>
                </div>
            </div>
            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;service&raquo;</span>IndexerService</div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">indexPage()</span><span class="uml-type">void</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">tokenize()</span><span class="uml-type">List&lt;String&gt;</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">buildInvertedIndex()</span><span class="uml-type">void</span></div>
                </div>
            </div>
            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;service&raquo;</span>QueryService</div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">parseQuery()</span><span class="uml-type">List&lt;String&gt;</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">executeQuery()</span><span class="uml-type">List&lt;CrawledPage&gt;</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">intersectPostings()</span><span class="uml-type">List&lt;PostingEntry&gt;</span></div>
                </div>
            </div>
            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;service&raquo;</span>RankingService</div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">computePageRank()</span><span class="uml-type">void</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">scoreTFIDF()</span><span class="uml-type">double</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">rankResults()</span><span class="uml-type">List&lt;CrawledPage&gt;</span></div>
                </div>
            </div>
            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;service&raquo;</span>DuplicateDetectionService</div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">computeSimHash()</span><span class="uml-type">Long</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">isDuplicate()</span><span class="uml-type">boolean</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">selectCanonical()</span><span class="uml-type">CrawledPage</span></div>
                </div>
            </div>
            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;service&raquo;</span>SearchService</div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">search()</span><span class="uml-type">List&lt;CrawledPage&gt;</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">filterResults()</span><span class="uml-type">List&lt;CrawledPage&gt;</span></div>
                </div>
            </div>
            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;service&raquo;</span>SpellCheckService</div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">correct()</span><span class="uml-type">String</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">editDistance()</span><span class="uml-type">int</span></div>
                </div>
            </div>
            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;service&raquo;</span>AutoCompleteService</div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">suggest()</span><span class="uml-type">List&lt;String&gt;</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">updateTrie()</span><span class="uml-type">void</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getTopK()</span><span class="uml-type">List&lt;String&gt;</span></div>
                </div>
            </div>
            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;service&raquo;</span>URLFrontierService</div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">addUrl()</span><span class="uml-type">void</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getNextUrl()</span><span class="uml-type">String</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">prioritize()</span><span class="uml-type">void</span></div>
                </div>
            </div>
        </div>

        <div class="uml-relations">
            <h4>Relationships</h4>
            <div class="uml-rel">
                <span class="uml-rel-from">CrawledPage</span>
                <span class="uml-rel-arrow">1 ────── N</span>
                <span class="uml-rel-to">PostingEntry</span>
                <span class="uml-rel-label">indexed as</span>
                <span class="uml-rel-type">ONE-TO-MANY</span>
            </div>
            <div class="uml-rel">
                <span class="uml-rel-from">InvertedIndex</span>
                <span class="uml-rel-arrow">1 ────── N</span>
                <span class="uml-rel-to">PostingEntry</span>
                <span class="uml-rel-label">contains</span>
                <span class="uml-rel-type">ONE-TO-MANY</span>
            </div>
            <div class="uml-rel">
                <span class="uml-rel-from">CrawledPage</span>
                <span class="uml-rel-arrow">N ────── N</span>
                <span class="uml-rel-to">CrawledPage</span>
                <span class="uml-rel-label">links to (via PageLink)</span>
                <span class="uml-rel-type">MANY-TO-MANY (SELF)</span>
            </div>
            <div class="uml-rel">
                <span class="uml-rel-from">User</span>
                <span class="uml-rel-arrow">1 ────── N</span>
                <span class="uml-rel-to">SearchQueryLog</span>
                <span class="uml-rel-label">searches</span>
                <span class="uml-rel-type">ONE-TO-MANY</span>
            </div>
        </div>

        <div class="uml-note">
            <strong>Hinglish Explanation:</strong> Yeh UML diagram Google jaise Search Engine ka design dikhata hai &mdash; CrawlerService web pages crawl karta hai aur IndexerService unhe InvertedIndex me store karta hai. Jab user search karta hai to QueryService InvertedIndex se relevant pages dhundta hai, RankingService PageRank algorithm se results rank karta hai, aur AutoCompleteService Trie data structure se suggestions deta hai.
        </div>
    </div>
</div>

<div class="section theme-orange">
    <div class="section-title"><span class="section-num">18</span>Interview Summary</div>
    <div class="summary-grid">
        <div class="summary-card sc-1"><h4>Inverted Index</h4><p>Core of search &mdash; word &rarr; list of doc IDs</p></div>
        <div class="summary-card sc-2"><h4>TF-IDF Scoring</h4><p>Term frequency &times; inverse document frequency</p></div>
        <div class="summary-card sc-3"><h4>PageRank</h4><p>Link-based authority &mdash; more inlinks = higher rank</p></div>
        <div class="summary-card sc-4"><h4>Web Crawler (BFS)</h4><p>URL frontier, robots.txt, politeness delay</p></div>
        <div class="summary-card sc-1"><h4>Bloom Filter</h4><p>Memory-efficient URL dedup (1.2 GB for 10B URLs)</p></div>
        <div class="summary-card sc-2"><h4>Trie (Auto-complete)</h4><p>Pre-computed top-K at each node, O(prefix) lookup</p></div>
        <div class="summary-card sc-3"><h4>SimHash (Dedup)</h4><p>Near-duplicate content detection in O(1)</p></div>
        <div class="summary-card sc-4"><h4>Edit Distance</h4><p>Spell correction &mdash; "Did you mean?" suggestions</p></div>
        <div class="summary-card sc-1"><h4>Index Sharding</h4><p>By term range or doc ID, parallel search + merge</p></div>
        <div class="summary-card sc-2"><h4>Snippet Generation</h4><p>Highlight query terms in page context</p></div>
        <div class="summary-card sc-3"><h4>Query Caching</h4><p>Popular query results in Redis (5 min TTL)</p></div>
        <div class="summary-card sc-4"><h4>robots.txt Compliance</h4><p>Crawl politeness &mdash; respect disallow rules</p></div>
    </div>
    <p style="text-align:center;margin-top:24px;color:#78909c;font-size:1em">
        Complete Search Engine LLD for <strong style="color:#2e7d32">Java Spring Boot</strong> interviews &mdash; covers Crawling, Indexing, PageRank, Auto-complete &amp; Scalability.
    </p>
</div>
`
}
