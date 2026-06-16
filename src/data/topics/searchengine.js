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

<div class="section theme-pink">
    <div class="section-title"><span class="section-num">6</span>Database Schema</div>
    <div class="db-grid">
        <div class="db-table">
            <h3>crawled_page</h3>
            <div class="db-row"><span class="col-name">id</span><span class="col-type">UUID PK</span></div>
            <div class="db-row"><span class="col-name">url</span><span class="col-type">VARCHAR(2048) UNIQUE</span></div>
            <div class="db-row"><span class="col-name">domain</span><span class="col-type">VARCHAR(255) INDEX</span></div>
            <div class="db-row"><span class="col-name">title</span><span class="col-type">VARCHAR(512)</span></div>
            <div class="db-row"><span class="col-name">content_hash</span><span class="col-type">BIGINT (SimHash)</span></div>
            <div class="db-row"><span class="col-name">raw_html</span><span class="col-type">TEXT (compressed)</span></div>
            <div class="db-row"><span class="col-name">extracted_text</span><span class="col-type">TEXT</span></div>
            <div class="db-row"><span class="col-name">page_rank</span><span class="col-type">DOUBLE</span></div>
            <div class="db-row"><span class="col-name">crawl_status</span><span class="col-type">ENUM</span></div>
            <div class="db-row"><span class="col-name">last_crawled_at</span><span class="col-type">TIMESTAMP</span></div>
            <div class="db-row"><span class="col-name">next_crawl_at</span><span class="col-type">TIMESTAMP</span></div>
            <div class="db-row"><span class="col-name">http_status</span><span class="col-type">INT</span></div>
        </div>
        <div class="db-table">
            <h3>inverted_index</h3>
            <div class="db-row"><span class="col-name">term</span><span class="col-type">VARCHAR(100) PK</span></div>
            <div class="db-row"><span class="col-name">doc_frequency</span><span class="col-type">INT</span></div>
            <div class="db-row"><span class="col-name">posting_list</span><span class="col-type">BLOB (compressed)</span></div>
        </div>
        <div class="db-table">
            <h3>posting_entry (within posting_list)</h3>
            <div class="db-row"><span class="col-name">doc_id</span><span class="col-type">UUID</span></div>
            <div class="db-row"><span class="col-name">term_frequency</span><span class="col-type">INT</span></div>
            <div class="db-row"><span class="col-name">positions</span><span class="col-type">INT[] (word positions)</span></div>
            <div class="db-row"><span class="col-name">tf_idf_score</span><span class="col-type">FLOAT</span></div>
        </div>
        <div class="db-table">
            <h3>page_link (for PageRank)</h3>
            <div class="db-row"><span class="col-name">source_page_id</span><span class="col-type">UUID FK</span></div>
            <div class="db-row"><span class="col-name">target_url</span><span class="col-type">VARCHAR(2048)</span></div>
            <div class="db-row"><span class="col-name">anchor_text</span><span class="col-type">VARCHAR(500)</span></div>
            <div class="db-row"><span class="col-name">is_external</span><span class="col-type">BOOLEAN</span></div>
        </div>
        <div class="db-table">
            <h3>search_query_log</h3>
            <div class="db-row"><span class="col-name">id</span><span class="col-type">UUID PK</span></div>
            <div class="db-row"><span class="col-name">query</span><span class="col-type">VARCHAR(500)</span></div>
            <div class="db-row"><span class="col-name">user_id</span><span class="col-type">UUID FK NULL</span></div>
            <div class="db-row"><span class="col-name">search_type</span><span class="col-type">ENUM</span></div>
            <div class="db-row"><span class="col-name">results_count</span><span class="col-type">INT</span></div>
            <div class="db-row"><span class="col-name">clicked_result</span><span class="col-type">VARCHAR(2048) NULL</span></div>
            <div class="db-row"><span class="col-name">click_position</span><span class="col-type">INT NULL</span></div>
            <div class="db-row"><span class="col-name">location</span><span class="col-type">VARCHAR(100)</span></div>
            <div class="db-row"><span class="col-name">searched_at</span><span class="col-type">TIMESTAMP</span></div>
        </div>
        <div class="db-table">
            <h3>robots_rules</h3>
            <div class="db-row"><span class="col-name">domain</span><span class="col-type">VARCHAR(255) PK</span></div>
            <div class="db-row"><span class="col-name">disallowed_paths</span><span class="col-type">TEXT[]</span></div>
            <div class="db-row"><span class="col-name">crawl_delay</span><span class="col-type">INT (seconds)</span></div>
            <div class="db-row"><span class="col-name">sitemap_url</span><span class="col-type">VARCHAR(2048)</span></div>
            <div class="db-row"><span class="col-name">last_fetched_at</span><span class="col-type">TIMESTAMP</span></div>
        </div>
    </div>
</div>

<div class="section theme-blue">
    <div class="section-title"><span class="section-num">7</span>Deep Dive &mdash; Web Crawling Architecture</div>
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
    <div class="section-title"><span class="section-num">8</span>Deep Dive &mdash; Inverted Index &amp; TF-IDF</div>
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
    <div class="section-title"><span class="section-num">9</span>Deep Dive &mdash; PageRank Algorithm</div>
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
    <div class="section-title"><span class="section-num">10</span>Deep Dive &mdash; Auto-Complete with Trie</div>
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
    <div class="section-title"><span class="section-num">11</span>Deep Dive &mdash; Complete Search Flow</div>
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
    <div class="section-title"><span class="section-num">12</span>Comparison &mdash; Search Engine Components</div>
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
    <div class="section-title"><span class="section-num">13</span>Bottlenecks &amp; Solutions</div>
    <div class="bottleneck-grid">
        <div class="bottleneck-item"><span class="bottleneck-problem">Index too large for single machine (TBs)</span><span class="bottleneck-arrow">&rarr;</span><span class="bottleneck-solution">Shard by term range or doc ID, parallel search + merge across 1000s shards</span></div>
        <div class="bottleneck-item"><span class="bottleneck-problem">Crawl speed vs politeness trade-off</span><span class="bottleneck-arrow">&rarr;</span><span class="bottleneck-solution">Per-domain rate limit (1 req/sec), parallel domains, respect robots.txt crawl-delay</span></div>
        <div class="bottleneck-item"><span class="bottleneck-problem">Stale index / freshness problem</span><span class="bottleneck-arrow">&rarr;</span><span class="bottleneck-solution">Tiered crawl: news hourly, popular daily, static weekly. Kafka real-time pipeline</span></div>
        <div class="bottleneck-item"><span class="bottleneck-problem">Query latency spikes (trending queries)</span><span class="bottleneck-arrow">&rarr;</span><span class="bottleneck-solution">Redis query cache (5 min TTL), shard replicas for read scaling, CDN cache</span></div>
        <div class="bottleneck-item"><span class="bottleneck-problem">Spam pages polluting results</span><span class="bottleneck-arrow">&rarr;</span><span class="bottleneck-solution">ML spam classifier, link farm detection, manual review, domain authority scoring</span></div>
        <div class="bottleneck-item"><span class="bottleneck-problem">Duplicate content waste (syndicated articles)</span><span class="bottleneck-arrow">&rarr;</span><span class="bottleneck-solution">SimHash fingerprint O(1), canonical URL selection, Hamming distance threshold</span></div>
    </div>
</div>

<div class="section theme-orange">
    <div class="section-title"><span class="section-num">14</span>Interview Summary</div>
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
