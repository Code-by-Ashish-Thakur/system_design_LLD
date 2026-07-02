export default {
  title: "Netflix &mdash; Low Level Design",
  subtitle: "Complete LLD for Java Spring Boot Interview &mdash; Content Catalog, Streaming, Profiles &amp; Recommendations",
  subtitleColor: "#ffcdd2",
  headerGradient: "linear-gradient(135deg,#b71c1c,#c62828,#e53935)",
  footerText: "Netflix &mdash; Low Level Design",
  content: `
<div class="section theme-green">
    <div class="section-title"><span class="section-num">1</span>Functional Requirements</div>
    <div class="req-grid">
        <div class="req-pill"><span class="num">1</span><div class="fr-content"><div class="fr-en">Content Catalog (Movies, Series, Episodes)</div><div class="fr-hi">Ye requirement isliye hai taki platform pe movies, series aur episodes ka structured catalog ho — bina content catalog ke Netflix pe user ko dikhane ke liye kuch hoga hi nahi, ye poore system ki foundation hai</div></div></div>
        <div class="req-pill"><span class="num">2</span><div class="fr-content"><div class="fr-en">User Profiles (up to 5 per account)</div><div class="fr-hi">Ye feature isliye hai taki ek account me family ke 5 alag profiles ban sake — har member ki alag watch history, recommendations aur preferences hoti hain, jaise bacchon ko kids content aur adults ko thrillers dikhein</div></div></div>
        <div class="req-pill"><span class="num">3</span><div class="fr-content"><div class="fr-en">Subscription Plans (Basic, Standard, Premium)</div><div class="fr-hi">Ye requirement isliye hai taki user apne budget ke hisaab se plan choose kar sake — Basic me ek screen aur SD quality, Premium me 4 screens aur 4K, Netflix ka revenue model isi pe based hai</div></div></div>
        <div class="req-pill"><span class="num">4</span><div class="fr-content"><div class="fr-en">Watch History &amp; Continue Watching</div><div class="fr-hi">Ye feature isliye hai taki user ne kya dekha aur kahan choda wo track ho sake — "Continue Watching" row isi se banta hai, taki user jahan choda tha wahi se aage dekh sake bina dhundhne ke</div></div></div>
        <div class="req-pill"><span class="num">5</span><div class="fr-content"><div class="fr-en">Content Recommendation Engine</div><div class="fr-hi">Ye feature isliye hai taki user ko uski watch history ke basis pe personalized content suggest ho — Netflix ka 80% content discovery recommendations se hota hai, bina iske user ko manually dhundhna padega 20,000+ titles me</div></div></div>
        <div class="req-pill"><span class="num">6</span><div class="fr-content"><div class="fr-en">Search with Filters (genre, year, language)</div><div class="fr-hi">Ye feature isliye hai taki user genre, release year aur language se content search aur filter kar sake — jab user ko specifically kuch dekhna ho (jaise Hindi action movies 2024 ki) to search zaroori hai</div></div></div>
        <div class="req-pill"><span class="num">7</span><div class="fr-content"><div class="fr-en">Adaptive Bitrate Streaming (HLS)</div><div class="fr-hi">Ye requirement isliye hai taki video quality user ke network speed ke hisaab se automatically adjust ho — slow internet pe low quality dikhao taki buffering na ho, fast internet pe 4K dikhao, HLS protocol iske liye use hota hai</div></div></div>
        <div class="req-pill"><span class="num">8</span><div class="fr-content"><div class="fr-en">Download for Offline Viewing</div><div class="fr-hi">Ye feature isliye hai taki user content download karke bina internet ke offline dekh sake — travel me ya low connectivity areas me ye bahut useful hai, DRM protection ke saath download hota hai taki piracy na ho</div></div></div>
        <div class="req-pill"><span class="num">9</span><div class="fr-content"><div class="fr-en">Parental Controls &amp; Age Rating</div><div class="fr-hi">Ye feature isliye hai taki parents bacchon ke profile pe age-inappropriate content restrict kar sake — Netflix pe adult content bhi hota hai, parental controls se kids profile me sirf safe content dikhta hai PIN protection ke saath</div></div></div>
        <div class="req-pill"><span class="num">10</span><div class="fr-content"><div class="fr-en">Subtitles &amp; Audio Track Selection</div><div class="fr-hi">Ye feature isliye hai taki user apni preferred language me subtitles aur audio track select kar sake — Netflix globally available hai, ek Korean show Hindi subtitles ke saath ya English dubbed me dekhna common hai</div></div></div>
        <div class="req-pill"><span class="num">11</span><div class="fr-content"><div class="fr-en">My List (Watchlist)</div><div class="fr-hi">Ye feature isliye hai taki user interesting content ko "My List" me save kar sake baad me dekhne ke liye — abhi time nahi hai par dekhna hai to watchlist me daal do, warna 20,000+ titles me dobara dhundhna mushkil hoga</div></div></div>
        <div class="req-pill"><span class="num">12</span><div class="fr-content"><div class="fr-en">Content Availability by Region (licensing)</div><div class="fr-hi">Ye requirement isliye hai taki har region me sirf licensed content dikhe — Netflix ka content licensing country-wise hota hai, India me available show US me nahi hoga aur vice versa, legal compliance ke liye ye zaroori hai</div></div></div>
    </div>
</div>

<!-- ============ NON-FUNCTIONAL REQUIREMENTS ============ -->
<div class="section theme-pink">
    <div class="section-title"><span class="section-num">2</span>Non-Functional Requirements</div>
    <div class="req-grid">
        <div class="req-pill"><span class="num">1</span><div class="nfr-content"><div class="nfr-en">Low Latency &mdash; Content must load within 200ms</div><div class="nfr-hi">Content &lt; 200ms me load hona chahiye taki user ko buffering na dikhe</div></div></div>
        <div class="req-pill"><span class="num">2</span><div class="nfr-content"><div class="nfr-en">High Availability &mdash; 99.99% uptime across all regions</div><div class="nfr-hi">Globally 99.99% uptime hona chahiye &mdash; kisi bhi country me down nahi ho</div></div></div>
        <div class="req-pill"><span class="num">3</span><div class="nfr-content"><div class="nfr-en">Scalability &mdash; Support 200M+ concurrent subscribers</div><div class="nfr-hi">200M+ subscribers ko ek saath handle karna padega &mdash; horizontally scale karo</div></div></div>
        <div class="req-pill"><span class="num">4</span><div class="nfr-content"><div class="nfr-en">CDN &mdash; Global edge caching for zero buffering</div><div class="nfr-hi">CDN se global edge caching karo taki buffering zero ho &mdash; nearest server se serve ho</div></div></div>
        <div class="req-pill"><span class="num">5</span><div class="nfr-content"><div class="nfr-en">Personalization &mdash; Real-time recommendation updates</div><div class="nfr-hi">Real-time me recommendation update honi chahiye user ke watch history ke basis pe</div></div></div>
        <div class="req-pill"><span class="num">6</span><div class="nfr-content"><div class="nfr-en">Fault Tolerance &mdash; Graceful degradation under peak load</div><div class="nfr-hi">Peak load pe system crash nahi hona chahiye &mdash; graceful degradation se handle karo</div></div></div>
    </div>
</div>

<div class="section theme-purple">
    <div class="section-title"><span class="section-num">3</span>Enums</div>
    <div class="enum-grid">
        <div class="enum-card"><h3>ContentType</h3><div class="enum-val">MOVIE</div><div class="enum-val">SERIES</div><div class="enum-val">DOCUMENTARY</div><div class="enum-val">SHORT</div></div>
        <div class="enum-card"><h3>Genre</h3><div class="enum-val">ACTION</div><div class="enum-val">COMEDY</div><div class="enum-val">DRAMA</div><div class="enum-val">THRILLER</div><div class="enum-val">HORROR</div><div class="enum-val">SCI_FI</div><div class="enum-val">ROMANCE</div><div class="enum-val">ANIME</div></div>
        <div class="enum-card"><h3>AgeRating</h3><div class="enum-val">U</div><div class="enum-val">UA_7</div><div class="enum-val">UA_13</div><div class="enum-val">UA_16</div><div class="enum-val">A (18+)</div></div>
        <div class="enum-card"><h3>PlanType</h3><div class="enum-val">MOBILE</div><div class="enum-val">BASIC</div><div class="enum-val">STANDARD</div><div class="enum-val">PREMIUM</div></div>
        <div class="enum-card"><h3>SubStatus</h3><div class="enum-val">ACTIVE</div><div class="enum-val">PAUSED</div><div class="enum-val">CANCELLED</div><div class="enum-val">EXPIRED</div></div>
    </div>
</div>

<div class="section theme-green">
    <div class="section-title"><span class="section-num">4</span>Service LLD</div>
    <div class="service-grid">
        <div class="service-card">
            <h3>ContentService</h3>
            <p class="svc-desc">Movies aur shows dikhata hai user ke region aur age group ke hisaab se &mdash; browse, details, trending sab handle karta hai</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">ContentService</span> {

    <span class="cm">// content ki details laao — region aur maturity check ke saath</span>
    <span class="tp">Content</span> <span class="fn">getById</span>(<span class="tp">Long</span> contentId, <span class="tp">String</span> region, <span class="tp">Long</span> profileId)

    <span class="cm">// genre wise browse karo — pagination ke saath</span>
    <span class="tp">Page&lt;Content&gt;</span> <span class="fn">getByGenre</span>(<span class="tp">String</span> genre, <span class="tp">String</span> region, <span class="tp">AgeRating</span> maturityLevel, <span class="tp">int</span> page, <span class="tp">int</span> size)

    <span class="cm">// region wise trending content laao — top 10 ya 20</span>
    <span class="tp">List&lt;Content&gt;</span> <span class="fn">getTrending</span>(<span class="tp">String</span> region, <span class="tp">int</span> limit, <span class="tp">ContentType</span> contentType)
}
</pre></div>
        </div>

        <div class="service-card">
            <h3>StreamingService</h3>
            <p class="svc-desc">Video stream deliver karta hai &mdash; subscription check, screen limit enforce, aur HLS manifest URL return karta hai DRM ke saath</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">StreamingService</span> {

    <span class="cm">// stream shuru karo — subscription, screen limit, region sab check hota hai</span>
    <span class="tp">StreamResponse</span> <span class="fn">getStream</span>(<span class="tp">Long</span> contentId, <span class="tp">Long</span> profileId, <span class="tp">Long</span> accountId, <span class="tp">String</span> deviceId, <span class="tp">Long</span> episodeId, <span class="tp">Resolution</span> preferredResolution)

    <span class="cm">// check karo screen available hai ya nahi — plan se max screens aata hai</span>
    <span class="tp">boolean</span> <span class="fn">hasAvailableScreen</span>(<span class="tp">Long</span> accountId, <span class="tp">int</span> maxScreens)

    <span class="cm">// stream khatam karo — device hata do aur final progress save karo</span>
    <span class="tp">void</span> <span class="fn">endStream</span>(<span class="tp">Long</span> profileId, <span class="tp">Long</span> contentId, <span class="tp">String</span> deviceId, <span class="tp">int</span> lastWatchedSeconds)
}
</pre></div>
        </div>

        <div class="service-card">
            <h3>RecommendationEngine</h3>
            <p class="svc-desc">User ki watch history ke basis pe movies/shows suggest karta hai &mdash; Spark batch job precompute karta hai, Redis mein cache hota hai</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">RecommendationEngine</span> {

    <span class="cm">// personalized recommendations laao — Redis cache se pehle check hota hai</span>
    <span class="tp">List&lt;Content&gt;</span> <span class="fn">getPersonalized</span>(<span class="tp">Long</span> profileId, <span class="tp">int</span> limit, <span class="tp">String</span> region, <span class="tp">AgeRating</span> maturityLevel)

    <span class="cm">// "Because you watched X" jaisa similar content dikhao</span>
    <span class="tp">List&lt;Content&gt;</span> <span class="fn">getSimilar</span>(<span class="tp">Long</span> contentId, <span class="tp">int</span> limit, <span class="tp">String</span> region, <span class="tp">boolean</span> excludeWatched)

    <span class="cm">// recommendations refresh karo — Spark batch job trigger hota hai</span>
    <span class="tp">void</span> <span class="fn">refreshRecommendations</span>(<span class="tp">Long</span> profileId, <span class="tp">String</span> algorithm)
}
</pre></div>
        </div>

        <div class="service-card">
            <h3>SearchService</h3>
            <p class="svc-desc">Content dhundne mein help karta hai &mdash; title, genre, actor se search karo with autocomplete aur fuzzy matching (Elasticsearch use hota hai)</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">SearchService</span> {

    <span class="cm">// content search karo — filters aur pagination ke saath</span>
    <span class="tp">Page&lt;Content&gt;</span> <span class="fn">search</span>(<span class="tp">String</span> query, <span class="tp">Genre</span> genre, <span class="tp">ContentType</span> contentType, <span class="tp">Integer</span> releaseYear, <span class="tp">String</span> language, <span class="tp">String</span> region, <span class="tp">AgeRating</span> maturityLevel, <span class="tp">int</span> page, <span class="tp">int</span> size)

    <span class="cm">// type karte waqt suggestions dikhao — fuzzy matching se</span>
    <span class="tp">List&lt;String&gt;</span> <span class="fn">autoSuggest</span>(<span class="tp">String</span> prefix, <span class="tp">String</span> region, <span class="tp">int</span> maxResults)

    <span class="cm">// naya content Elasticsearch mein index karo</span>
    <span class="tp">void</span> <span class="fn">indexContent</span>(<span class="tp">Content</span> content, <span class="tp">String</span> updateMode)
}
</pre></div>
        </div>

        <div class="service-card">
            <h3>ProfileService</h3>
            <p class="svc-desc">Ek account ke under profiles manage karta hai &mdash; max 5 profiles, kids profile mein content filter lagta hai server-side</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">ProfileService</span> {

    <span class="cm">// naya profile banao — max 5 allowed hain per account</span>
    <span class="tp">Profile</span> <span class="fn">create</span>(<span class="tp">Long</span> accountId, <span class="tp">String</span> name, <span class="tp">String</span> avatarUrl, <span class="tp">boolean</span> isKids, <span class="tp">AgeRating</span> maturityLevel, <span class="tp">String</span> language)

    <span class="cm">// profile delete karo — verify karo ki account ka hi hai</span>
    <span class="tp">void</span> <span class="fn">deleteProfile</span>(<span class="tp">Long</span> profileId, <span class="tp">Long</span> accountId)

    <span class="cm">// account ke saare profiles laao (max 5)</span>
    <span class="tp">List&lt;Profile&gt;</span> <span class="fn">getProfiles</span>(<span class="tp">Long</span> accountId)
}
</pre></div>
        </div>

        <div class="service-card">
            <h3>SubscriptionService</h3>
            <p class="svc-desc">User ka plan check karta hai &mdash; kya stream kar sakta hai? kitni screens allowed? kaunsi quality? plan upgrade/downgrade bhi handle karta hai</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">SubscriptionService</span> {

    <span class="cm">// check karo user stream kar sakta hai ya nahi</span>
    <span class="tp">boolean</span> <span class="fn">canStream</span>(<span class="tp">Long</span> accountId, <span class="tp">String</span> deviceId)

    <span class="cm">// plan change karo — upgrade ya downgrade</span>
    <span class="tp">Subscription</span> <span class="fn">changePlan</span>(<span class="tp">Long</span> accountId, <span class="tp">PlanType</span> newPlan, <span class="tp">LocalDate</span> effectiveDate)

    <span class="cm">// subscription cancel karo — turant ya billing cycle end pe</span>
    <span class="tp">void</span> <span class="fn">cancelSubscription</span>(<span class="tp">Long</span> accountId, <span class="tp">String</span> reason, <span class="tp">boolean</span> immediate)
}
</pre></div>
        </div>

        <div class="service-card">
            <h3>WatchHistoryService</h3>
            <p class="svc-desc">User ne kya dekha aur kahan ruka &mdash; ye track karta hai. &ldquo;Continue Watching&rdquo; row isi se banta hai. Redis mein buffer karta hai, batch mein DB mein flush hota hai</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">WatchHistoryService</span> {

    <span class="cm">// watch progress update karo — har 30 sec pe call hota hai</span>
    <span class="tp">void</span> <span class="fn">updateProgress</span>(<span class="tp">Long</span> profileId, <span class="tp">Long</span> contentId, <span class="tp">Long</span> episodeId, <span class="tp">int</span> watchedSeconds, <span class="tp">int</span> totalSeconds)

    <span class="cm">// "Continue Watching" row ke liye incomplete items laao</span>
    <span class="tp">List&lt;WatchProgress&gt;</span> <span class="fn">getContinueWatching</span>(<span class="tp">Long</span> profileId, <span class="tp">int</span> limit)

    <span class="cm">// poori watch history laao — pagination ke saath</span>
    <span class="tp">Page&lt;WatchHistory&gt;</span> <span class="fn">getHistory</span>(<span class="tp">Long</span> profileId, <span class="tp">ContentType</span> contentType, <span class="tp">int</span> page, <span class="tp">int</span> size)
}
</pre></div>
        </div>

        <div class="service-card">
            <h3>DownloadService</h3>
            <p class="svc-desc">Offline viewing ke liye download karne deta hai &mdash; plan ke hisaab se download slots limited hote hain, 48h mein expire ho jaate hain</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">DownloadService</span> {

    <span class="cm">// download request karo — plan ke hisaab se limit check hota hai</span>
    <span class="tp">DownloadPackage</span> <span class="fn">requestDownload</span>(<span class="tp">Long</span> contentId, <span class="tp">Long</span> profileId, <span class="tp">Long</span> accountId, <span class="tp">Long</span> episodeId, <span class="tp">Resolution</span> quality, <span class="tp">String</span> deviceId)

    <span class="cm">// kitne downloads baaki hain check karo</span>
    <span class="tp">int</span> <span class="fn">getRemainingDownloads</span>(<span class="tp">Long</span> accountId, <span class="tp">String</span> deviceId)

    <span class="cm">// expired downloads saaf karo — 48h play ke baad, 7 din download ke baad</span>
    <span class="tp">void</span> <span class="fn">cleanupExpiredDownloads</span>(<span class="tp">Long</span> accountId, <span class="tp">String</span> deviceId, <span class="tp">int</span> expiryHours)
}
</pre></div>
        </div>
    </div>
</div>

<div class="section theme-purple">
    <div class="section-title"><span class="section-num">5</span>API Endpoints</div>
    <div class="api-grid">
        <div class="api-card"><div class="api-method get">GET</div><div class="api-path">/api/v1/browse?genre=ACTION&amp;page=0</div><div class="api-desc">Browse content catalog by genre/type</div></div>
        <div class="api-card"><div class="api-method get">GET</div><div class="api-path">/api/v1/search?q=stranger&amp;year=2024</div><div class="api-desc">Search content with filters</div></div>
        <div class="api-card"><div class="api-method get">GET</div><div class="api-path">/api/v1/content/{id}</div><div class="api-desc">Get content details + episodes (if series)</div></div>
        <div class="api-card"><div class="api-method get">GET</div><div class="api-path">/api/v1/content/{id}/stream</div><div class="api-desc">Get HLS manifest URL (checks subscription + region + DRM)</div></div>
        <div class="api-card"><div class="api-method get">GET</div><div class="api-path">/api/v1/recommendations</div><div class="api-desc">Get personalized recommendations for profile</div></div>
        <div class="api-card"><div class="api-method get">GET</div><div class="api-path">/api/v1/continue-watching</div><div class="api-desc">Get "Continue Watching" row for profile</div></div>
        <div class="api-card"><div class="api-method put">PUT</div><div class="api-path">/api/v1/watch-progress</div><div class="api-desc">Update watch progress (called every 30s during playback)</div></div>
        <div class="api-card"><div class="api-method post">POST</div><div class="api-path">/api/v1/watchlist/{contentId}</div><div class="api-desc">Add to My List</div></div>
        <div class="api-card"><div class="api-method get">GET</div><div class="api-path">/api/v1/profiles</div><div class="api-desc">Get all profiles for account</div></div>
        <div class="api-card"><div class="api-method post">POST</div><div class="api-path">/api/v1/profiles</div><div class="api-desc">Create profile (max 5 per account)</div></div>
        <div class="api-card"><div class="api-method get">GET</div><div class="api-path">/api/v1/trending</div><div class="api-desc">Top 10 trending in user's region</div></div>
    </div>
</div>

<div class="section theme-blue">
    <div class="section-title"><span class="section-num">6</span>Database Schema</div>

    <div class="sub-heading" style="color:#25d366;border-color:#25d366">Database Technology Stack</div>
    <div class="dbtech-grid">
        <div class="dbtech-card">
            <div class="dbtech-name">PostgreSQL <span class="dbtech-type">RDBMS</span></div>
            <div class="dbtech-usage">Accounts, subscriptions, profiles, billing &mdash; ACID for user &amp; payment data</div>
            <div class="dbtech-tables"><span>accounts</span><span>subscriptions</span><span>profiles</span></div>
        </div>
        <div class="dbtech-card">
            <div class="dbtech-name">Cassandra <span class="dbtech-type">NoSQL</span></div>
            <div class="dbtech-usage">Watch history &mdash; high write throughput, partitioned by profileId</div>
            <div class="dbtech-tables"><span>watch_history</span></div>
        </div>
        <div class="dbtech-card">
            <div class="dbtech-name">Redis <span class="dbtech-type">In-Memory</span></div>
            <div class="dbtech-usage">Pre-computed recommendations, active stream count, session tokens</div>
            <div class="dbtech-tables"><span>reco:{profileId}</span><span>streams:{accountId}</span></div>
        </div>
        <div class="dbtech-card">
            <div class="dbtech-name">S3 + CDN <span class="dbtech-type">Content Delivery</span></div>
            <div class="dbtech-usage">Video files (HLS segments), thumbnails &mdash; served via CloudFront edge</div>
            <div class="dbtech-tables"><span>content/{contentId}/{resolution}</span></div>
        </div>
        <div class="dbtech-card">
            <div class="dbtech-name">Elasticsearch <span class="dbtech-type">Search Engine</span></div>
            <div class="dbtech-usage">Content search by title, genre, actor with fuzzy matching and filters</div>
            <div class="dbtech-tables"><span>content</span></div>
        </div>
    </div>

    <div class="db-grid">
        <div class="db-card">
            <h3>content</h3>
            <div class="db-row"><span class="col-name">id</span><span class="col-type">BIGINT</span><span class="col-constraint">PK</span></div>
            <div class="db-row"><span class="col-name">title</span><span class="col-type">VARCHAR(255)</span><span class="col-constraint">FULLTEXT IDX</span></div>
            <div class="db-row"><span class="col-name">description</span><span class="col-type">TEXT</span><span class="col-constraint"></span></div>
            <div class="db-row"><span class="col-name">type</span><span class="col-type">ENUM</span><span class="col-constraint">IDX</span></div>
            <div class="db-row"><span class="col-name">age_rating</span><span class="col-type">ENUM</span><span class="col-constraint">IDX</span></div>
            <div class="db-row"><span class="col-name">release_year</span><span class="col-type">INT</span><span class="col-constraint">IDX</span></div>
            <div class="db-row"><span class="col-name">duration</span><span class="col-type">INT</span><span class="col-constraint"></span></div>
            <div class="db-row"><span class="col-name">avg_rating</span><span class="col-type">DOUBLE</span><span class="col-constraint"></span></div>
            <div class="db-row"><span class="col-name">thumbnail_url</span><span class="col-type">VARCHAR(1024)</span><span class="col-constraint"></span></div>
            <div class="db-row"><span class="col-name">trailer_url</span><span class="col-type">VARCHAR(1024)</span><span class="col-constraint"></span></div>
        </div>
        <div class="db-card">
            <h3>episodes</h3>
            <div class="db-row"><span class="col-name">id</span><span class="col-type">BIGINT</span><span class="col-constraint">PK</span></div>
            <div class="db-row"><span class="col-name">content_id</span><span class="col-type">BIGINT</span><span class="col-constraint">FK &rarr; content(id) IDX</span></div>
            <div class="db-row"><span class="col-name">season_number</span><span class="col-type">INT</span><span class="col-constraint"></span></div>
            <div class="db-row"><span class="col-name">episode_number</span><span class="col-type">INT</span><span class="col-constraint"></span></div>
            <div class="db-row"><span class="col-name">title</span><span class="col-type">VARCHAR(255)</span><span class="col-constraint"></span></div>
            <div class="db-row"><span class="col-name">duration</span><span class="col-type">INT</span><span class="col-constraint"></span></div>
            <div class="db-row"><span class="col-name">stream_url</span><span class="col-type">VARCHAR(1024)</span><span class="col-constraint"></span></div>
        </div>
        <div class="db-card">
            <h3>profiles</h3>
            <div class="db-row"><span class="col-name">id</span><span class="col-type">BIGINT</span><span class="col-constraint">PK</span></div>
            <div class="db-row"><span class="col-name">account_id</span><span class="col-type">BIGINT</span><span class="col-constraint">FK IDX</span></div>
            <div class="db-row"><span class="col-name">name</span><span class="col-type">VARCHAR(64)</span><span class="col-constraint"></span></div>
            <div class="db-row"><span class="col-name">is_kids</span><span class="col-type">BOOLEAN</span><span class="col-constraint">DEFAULT FALSE</span></div>
            <div class="db-row"><span class="col-name">maturity_level</span><span class="col-type">ENUM</span><span class="col-constraint"></span></div>
            <div class="db-row"><span class="col-name">language</span><span class="col-type">VARCHAR(10)</span><span class="col-constraint"></span></div>
        </div>
        <div class="db-card">
            <h3>subscriptions</h3>
            <div class="db-row"><span class="col-name">id</span><span class="col-type">BIGINT</span><span class="col-constraint">PK</span></div>
            <div class="db-row"><span class="col-name">account_id</span><span class="col-type">BIGINT</span><span class="col-constraint">FK IDX</span></div>
            <div class="db-row"><span class="col-name">plan</span><span class="col-type">ENUM</span><span class="col-constraint"></span></div>
            <div class="db-row"><span class="col-name">max_screens</span><span class="col-type">INT</span><span class="col-constraint"></span></div>
            <div class="db-row"><span class="col-name">max_resolution</span><span class="col-type">ENUM</span><span class="col-constraint"></span></div>
            <div class="db-row"><span class="col-name">status</span><span class="col-type">ENUM</span><span class="col-constraint">IDX</span></div>
            <div class="db-row"><span class="col-name">start_date</span><span class="col-type">DATE</span><span class="col-constraint"></span></div>
            <div class="db-row"><span class="col-name">end_date</span><span class="col-type">DATE</span><span class="col-constraint">IDX</span></div>
        </div>
        <div class="db-card">
            <h3>watch_history</h3>
            <div class="db-row"><span class="col-name">id</span><span class="col-type">BIGINT</span><span class="col-constraint">PK</span></div>
            <div class="db-row"><span class="col-name">profile_id</span><span class="col-type">BIGINT</span><span class="col-constraint">FK IDX</span></div>
            <div class="db-row"><span class="col-name">content_id</span><span class="col-type">BIGINT</span><span class="col-constraint">FK IDX</span></div>
            <div class="db-row"><span class="col-name">episode_id</span><span class="col-type">BIGINT</span><span class="col-constraint">FK (nullable)</span></div>
            <div class="db-row"><span class="col-name">watched_seconds</span><span class="col-type">INT</span><span class="col-constraint"></span></div>
            <div class="db-row"><span class="col-name">completed</span><span class="col-type">BOOLEAN</span><span class="col-constraint">IDX</span></div>
            <div class="db-row"><span class="col-name">last_watched_at</span><span class="col-type">TIMESTAMP</span><span class="col-constraint">IDX</span></div>
        </div>
    </div>
</div>

<div class="section theme-blue">
    <div class="section-title"><span class="section-num">7</span>Capacity Estimation</div>
    <div class="cap-grid">
        <div class="cap-card"><div class="cap-label">Total Subscribers</div><div class="cap-value">250M</div></div>
        <div class="cap-card"><div class="cap-label">Daily Active Users</div><div class="cap-value">100M</div></div>
        <div class="cap-card"><div class="cap-label">Concurrent Streams</div><div class="cap-value">~15M peak</div></div>
        <div class="cap-card"><div class="cap-label">Content Library</div><div class="cap-value">~20,000 titles</div></div>
        <div class="cap-card"><div class="cap-label">CDN Bandwidth</div><div class="cap-value">~100 Tbps peak</div></div>
        <div class="cap-card"><div class="cap-label">Watch Progress Writes</div><div class="cap-value">~500K writes/sec</div></div>
        <div class="cap-card"><div class="cap-label">Recommendation Cache</div><div class="cap-value">~50 GB Redis (250M profiles &times; 200B each)</div></div>
        <div class="cap-card"><div class="cap-label">Avg Session Duration</div><div class="cap-value">~90 minutes</div></div>
        <div class="cap-card">
            <h4 style="color:#82b1ff;margin-bottom:8px">CPU / Server Estimation</h4>
            <div class="calc-row"><span class="calc-label">Concurrent streams (peak)</span><span class="calc-value">~15M</span></div>
            <div class="calc-row"><span class="calc-label">Watch progress writes/sec</span><span class="calc-value">~500K/sec</span></div>
            <div class="calc-row"><span class="calc-label">Each API server handles</span><span class="calc-value">~10K QPS</span></div>
            <div class="calc-result"><span class="calc-label">API Servers Needed</span><span class="calc-value">~50 servers</span></div>
            <div class="calc-result"><span class="calc-label">Total CPU Cores (8 per server)</span><span class="calc-value">~400 cores</span></div>
            <div class="calc-row"><span class="calc-label">Recommendation Engine</span><span class="calc-value">Spark cluster (100+ nodes)</span></div>
            <div class="calc-row"><span class="calc-label">Redis Cluster (cache)</span><span class="calc-value">10-20 nodes</span></div>
            <div class="calc-row"><span class="calc-label">CDN Edge Servers</span><span class="calc-value">10,000+ globally</span></div>
        </div>
    </div>
</div>

<div class="section theme-blue">
    <div class="section-title"><span class="section-num">8</span>Key Architecture</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span><span class="code-title">RecommendationEngine.java — Collaborative + Content-Based</span></div>
    <pre class="code-block">
<span class="ann">@Service</span>
<span class="kw">public class</span> <span class="tp">RecommendationEngine</span> <span class="kw">implements</span> <span class="tp">IRecommendationEngine</span> {
    <span class="kw">private final</span> <span class="tp">RedisTemplate</span>&lt;<span class="tp">String</span>, <span class="tp">List</span>&lt;<span class="tp">Long</span>&gt;&gt; redis;
    <span class="kw">private final</span> <span class="tp">WatchHistoryRepository</span> historyRepo;
    <span class="kw">private final</span> <span class="tp">ContentRepository</span> contentRepo;

    <span class="cm">// Pre-computed by Apache Spark batch job (runs daily)</span>
    <span class="cm">// Stored in Redis: "reco:{profileId}" → [contentId1, contentId2, ...]</span>

    <span class="ann">@Override</span>
    <span class="kw">public</span> <span class="tp">List</span>&lt;<span class="tp">Content</span>&gt; <span class="fn">getPersonalized</span>(<span class="tp">Long</span> profileId, <span class="kw">int</span> limit) {
        <span class="tp">String</span> key = <span class="st">"reco:"</span> + profileId;
        <span class="tp">List</span>&lt;<span class="tp">Long</span>&gt; contentIds = redis.<span class="fn">opsForValue</span>().<span class="fn">get</span>(key);

        <span class="kw">if</span> (contentIds == <span class="kw">null</span>) {
            <span class="cm">// Fallback: real-time content-based recommendation</span>
            contentIds = <span class="fn">computeContentBased</span>(profileId, limit);
        }

        <span class="cm">// Filter out already watched + apply maturity filter</span>
        <span class="tp">Set</span>&lt;<span class="tp">Long</span>&gt; watched = historyRepo
            .<span class="fn">findByProfileIdAndCompletedTrue</span>(profileId)
            .stream().<span class="fn">map</span>(<span class="tp">WatchHistory</span>::getContentId)
            .<span class="fn">collect</span>(<span class="tp">Collectors</span>.<span class="fn">toSet</span>());

        <span class="kw">return</span> contentIds.stream()
            .<span class="fn">filter</span>(id -&gt; !watched.<span class="fn">contains</span>(id))
            .<span class="fn">limit</span>(limit)
            .<span class="fn">map</span>(contentRepo::<span class="fn">findById</span>)
            .<span class="fn">filter</span>(<span class="tp">Optional</span>::isPresent)
            .<span class="fn">map</span>(<span class="tp">Optional</span>::get)
            .<span class="fn">collect</span>(<span class="tp">Collectors</span>.<span class="fn">toList</span>());
    }

    <span class="kw">private</span> <span class="tp">List</span>&lt;<span class="tp">Long</span>&gt; <span class="fn">computeContentBased</span>(<span class="tp">Long</span> profileId, <span class="kw">int</span> limit) {
        <span class="cm">// Find user's top genres from watch history</span>
        <span class="cm">// Score content by genre overlap + popularity + recency</span>
        <span class="cm">// Return top-N content IDs</span>
        <span class="kw">return</span> contentRepo.<span class="fn">findTopByGenresAndPopularity</span>(profileId, limit);
    }
}
    </pre></div>
</div>

<div class="section theme-purple">
    <div class="section-title"><span class="section-num">9</span>Design Patterns Used</div>
    <div class="pattern-grid">
        <div class="pattern-card"><h3>Strategy</h3><p>IRecommendationAlgorithm — swap between collaborative filtering, content-based, or hybrid</p></div>
        <div class="pattern-card"><h3>Observer</h3><p>Watch events &rarr; Kafka &rarr; update recommendations, trending lists, analytics pipeline</p></div>
        <div class="pattern-card"><h3>Decorator</h3><p>ContentFilter chain: RegionFilter &rarr; MaturityFilter &rarr; SubscriptionFilter wraps content service</p></div>
        <div class="pattern-card"><h3>Factory</h3><p>ContentFactory creates Movie/Series/Documentary with type-specific behavior</p></div>
        <div class="pattern-card"><h3>Proxy</h3><p>CDN as caching proxy for stream segments; signed URLs control access</p></div>
        <div class="pattern-card"><h3>Builder</h3><p>BrowseRequest.builder().genre().type().year().region().maturity().build()</p></div>
    </div>
</div>

<div class="section theme-green">
    <div class="section-title"><span class="section-num">10</span>Sequence Flow</div>
    <div class="flow-container">
        <div class="flow-step"><span class="step-num">1</span><span class="step-text">User opens app &rarr; selects profile &rarr; loads personalized homepage</span></div>
        <div class="flow-step"><span class="step-num">2</span><span class="step-text">Homepage: Continue Watching + Trending + Recommended rows from Redis cache</span></div>
        <div class="flow-step"><span class="step-num">3</span><span class="step-text">User selects content &rarr; GET /content/{id} loads details + episodes</span></div>
        <div class="flow-step"><span class="step-num">4</span><span class="step-text">User clicks Play &rarr; GET /content/{id}/stream</span></div>
        <div class="flow-step"><span class="step-num">5</span><span class="step-text">StreamingService checks: subscription active? concurrent screens? region license?</span></div>
        <div class="flow-step"><span class="step-num">6</span><span class="step-text">Returns signed HLS manifest URL (time-limited, DRM-protected)</span></div>
        <div class="flow-step"><span class="step-num">7</span><span class="step-text">Player fetches .ts segments from nearest CDN edge</span></div>
        <div class="flow-step"><span class="step-num">8</span><span class="step-text">ABR algorithm adjusts quality based on bandwidth</span></div>
        <div class="flow-step"><span class="step-num">9</span><span class="step-text">Watch progress sent every 30s &rarr; updates Continue Watching</span></div>
        <div class="flow-step"><span class="step-num">10</span><span class="step-text">View event published to Kafka &rarr; updates recommendations + trending</span></div>
    </div>
</div>

<div class="section theme-purple">
    <div class="section-title"><span class="section-num">11</span>Bottlenecks &amp; Solutions</div>
    <div class="bottleneck-grid">
        <div class="bottleneck-card"><h3>Homepage Cold Start</h3><p>Pre-compute personalized homepage per profile (Spark); cache in Redis; fallback to trending</p></div>
        <div class="bottleneck-card"><h3>New User Recommendations</h3><p>Cold start: show popular by region/genre; ask genre preferences on signup; content-based until enough data</p></div>
        <div class="bottleneck-card"><h3>Concurrent Screen Enforcement</h3><p>Redis SET per accountId with active deviceIds + TTL; check count before allowing new stream</p></div>
        <div class="bottleneck-card"><h3>Watch Progress Write Storm</h3><p>Buffer in Redis (per-profile key); batch flush to DB every 5 minutes; async via Kafka</p></div>
        <div class="bottleneck-card"><h3>Content Catalog Search</h3><p>Elasticsearch with regional content index; autocomplete with fuzzy matching; n-gram tokenizer</p></div>
        <div class="bottleneck-card"><h3>Regional Content Licensing</h3><p>Content-region mapping table; cache in Redis; CDN edge checks region from IP geolocation</p></div>
    </div>
</div>

<div class="section theme-green">
    <div class="section-title"><span class="section-num">12</span>Edge Cases</div>
    <div class="edge-grid">
        <div class="edge-card"><h3>Max Screens Exceeded</h3><p>Show "too many screens" error; allow user to sign out remote device; admin override</p></div>
        <div class="edge-card"><h3>Content Removed Mid-Watch</h3><p>License expiry: allow finish if started within license period; remove from browse + recommendations</p></div>
        <div class="edge-card"><h3>Profile Limit Reached</h3><p>Max 5 profiles; show "max profiles" error; suggest deleting unused profile</p></div>
        <div class="edge-card"><h3>Subscription Expired Mid-Stream</h3><p>Allow current session to finish; block new streams; show renewal prompt</p></div>
        <div class="edge-card"><h3>Offline Download Expired</h3><p>Downloads valid for 48h after first play or 7 days from download; require re-download</p></div>
        <div class="edge-card"><h3>VPN / Region Bypass</h3><p>IP geolocation check; DNS-based detection; block known VPN IP ranges</p></div>
    </div>
</div>

<div class="section theme-blue">
    <div class="section-title"><span class="section-num">13</span>Security Considerations</div>
    <div class="security-grid">
        <div class="security-card"><h3>DRM Protection</h3><p>Widevine (Android/Chrome), FairPlay (iOS/Safari), PlayReady (Edge); encrypted HLS segments</p></div>
        <div class="security-card"><h3>Stream URL Security</h3><p>Signed URLs with expiry (1 hour); IP-locked tokens; prevent hotlinking/sharing</p></div>
        <div class="security-card"><h3>Account Sharing</h3><p>Device fingerprinting; unusual location detection; password verification for new devices</p></div>
        <div class="security-card"><h3>Kids Profile Safety</h3><p>Maturity filter enforced server-side; PIN to exit kids profile; restricted search</p></div>
        <div class="security-card"><h3>Payment Security</h3><p>PCI-DSS compliant payment; tokenized card storage; 3D Secure for card payments</p></div>
    </div>
</div>

<!-- ============ 15. UML CLASS DIAGRAM ============ -->
<div class="section theme-deepblue">
    <div class="section-title"><span class="section-num">15</span>UML Class Diagram</div>
    <div class="uml-diagram">

        <div class="uml-section-label">Entity Classes</div>
        <div class="uml-grid">
            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;entity&raquo;</span>User</div>
                <div class="uml-attributes">
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">id</span><span class="uml-type">Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">email</span><span class="uml-type">String</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">name</span><span class="uml-type">String</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">planType</span><span class="uml-type">PlanType</span></div>
                </div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getProfiles()</span><span class="uml-type">List&lt;Profile&gt;</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getSubscription()</span><span class="uml-type">Subscription</span></div>
                </div>
            </div>

            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;entity&raquo;</span>Profile</div>
                <div class="uml-attributes">
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">id</span><span class="uml-type">Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">userId</span><span class="uml-type">Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">name</span><span class="uml-type">String</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">avatar</span><span class="uml-type">String</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">maturityLevel</span><span class="uml-type">AgeRating</span></div>
                </div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getWatchHistory()</span><span class="uml-type">List&lt;WatchHistory&gt;</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getDownloads()</span><span class="uml-type">List&lt;Download&gt;</span></div>
                </div>
            </div>

            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;entity&raquo;</span>Content</div>
                <div class="uml-attributes">
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">id</span><span class="uml-type">Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">title</span><span class="uml-type">String</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">type</span><span class="uml-type">ContentType</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">genre</span><span class="uml-type">Genre</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">ageRating</span><span class="uml-type">AgeRating</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">duration</span><span class="uml-type">int</span></div>
                </div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getEpisodes()</span><span class="uml-type">List&lt;Episode&gt;</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">isAvailableInRegion()</span><span class="uml-type">boolean</span></div>
                </div>
            </div>

            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;entity&raquo;</span>Episode</div>
                <div class="uml-attributes">
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">id</span><span class="uml-type">Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">contentId</span><span class="uml-type">Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">seasonNum</span><span class="uml-type">int</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">episodeNum</span><span class="uml-type">int</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">title</span><span class="uml-type">String</span></div>
                </div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getStreamUrl()</span><span class="uml-type">String</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getDuration()</span><span class="uml-type">int</span></div>
                </div>
            </div>

            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;entity&raquo;</span>Subscription</div>
                <div class="uml-attributes">
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">id</span><span class="uml-type">Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">userId</span><span class="uml-type">Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">planType</span><span class="uml-type">PlanType</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">status</span><span class="uml-type">SubStatus</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">startDate</span><span class="uml-type">LocalDate</span></div>
                </div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">isActive()</span><span class="uml-type">boolean</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getMaxScreens()</span><span class="uml-type">int</span></div>
                </div>
            </div>

            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;entity&raquo;</span>WatchHistory</div>
                <div class="uml-attributes">
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">id</span><span class="uml-type">Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">profileId</span><span class="uml-type">Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">contentId</span><span class="uml-type">Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">progress</span><span class="uml-type">int</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">watchedAt</span><span class="uml-type">LocalDateTime</span></div>
                </div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">isCompleted()</span><span class="uml-type">boolean</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getContent()</span><span class="uml-type">Content</span></div>
                </div>
            </div>

            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;entity&raquo;</span>Download</div>
                <div class="uml-attributes">
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">id</span><span class="uml-type">Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">profileId</span><span class="uml-type">Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">contentId</span><span class="uml-type">Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">expiresAt</span><span class="uml-type">LocalDateTime</span></div>
                </div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">isExpired()</span><span class="uml-type">boolean</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getContent()</span><span class="uml-type">Content</span></div>
                </div>
            </div>
        </div>

        <div class="uml-section-label">Enums</div>
        <div class="uml-grid">
            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;enum&raquo;</span>ContentType</div>
                <div class="uml-attributes">
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">MOVIE</span></div>
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">SERIES</span></div>
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">DOCUMENTARY</span></div>
                </div>
            </div>
            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;enum&raquo;</span>Genre</div>
                <div class="uml-attributes">
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">ACTION</span></div>
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">COMEDY</span></div>
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">DRAMA</span></div>
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">THRILLER</span></div>
                </div>
            </div>
            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;enum&raquo;</span>AgeRating</div>
                <div class="uml-attributes">
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">U</span></div>
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">UA_13</span></div>
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">UA_16</span></div>
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">A</span></div>
                </div>
            </div>
            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;enum&raquo;</span>PlanType</div>
                <div class="uml-attributes">
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">MOBILE</span></div>
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">BASIC</span></div>
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">STANDARD</span></div>
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">PREMIUM</span></div>
                </div>
            </div>
            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;enum&raquo;</span>SubStatus</div>
                <div class="uml-attributes">
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">ACTIVE</span></div>
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">PAUSED</span></div>
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">CANCELLED</span></div>
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">EXPIRED</span></div>
                </div>
            </div>
        </div>

        <div class="uml-section-label">Service Classes</div>
        <div class="uml-grid">
            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;service&raquo;</span>ContentService</div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getById()</span><span class="uml-type">Content</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getByGenre()</span><span class="uml-type">Page&lt;Content&gt;</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getTrending()</span><span class="uml-type">List&lt;Content&gt;</span></div>
                </div>
            </div>
            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;service&raquo;</span>StreamingService</div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getStream()</span><span class="uml-type">StreamResponse</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">hasAvailableScreen()</span><span class="uml-type">boolean</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">endStream()</span><span class="uml-type">void</span></div>
                </div>
            </div>
            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;service&raquo;</span>RecommendationEngine</div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getPersonalized()</span><span class="uml-type">List&lt;Content&gt;</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getSimilar()</span><span class="uml-type">List&lt;Content&gt;</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">refreshRecommendations()</span><span class="uml-type">void</span></div>
                </div>
            </div>
            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;service&raquo;</span>SearchService</div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">search()</span><span class="uml-type">Page&lt;Content&gt;</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">autoSuggest()</span><span class="uml-type">List&lt;String&gt;</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">indexContent()</span><span class="uml-type">void</span></div>
                </div>
            </div>
            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;service&raquo;</span>ProfileService</div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">create()</span><span class="uml-type">Profile</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">deleteProfile()</span><span class="uml-type">void</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getProfiles()</span><span class="uml-type">List&lt;Profile&gt;</span></div>
                </div>
            </div>
            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;service&raquo;</span>SubscriptionService</div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">canStream()</span><span class="uml-type">boolean</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">changePlan()</span><span class="uml-type">Subscription</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">cancelSubscription()</span><span class="uml-type">void</span></div>
                </div>
            </div>
            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;service&raquo;</span>WatchHistoryService</div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">updateProgress()</span><span class="uml-type">void</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getContinueWatching()</span><span class="uml-type">List&lt;WatchProgress&gt;</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getHistory()</span><span class="uml-type">Page&lt;WatchHistory&gt;</span></div>
                </div>
            </div>
            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;service&raquo;</span>DownloadService</div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">requestDownload()</span><span class="uml-type">DownloadPackage</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getRemainingDownloads()</span><span class="uml-type">int</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">cleanupExpiredDownloads()</span><span class="uml-type">void</span></div>
                </div>
            </div>
        </div>

        <div class="uml-relations">
            <h4>Relationships</h4>
            <div class="uml-rel">
                <span class="uml-rel-from">User</span>
                <span class="uml-rel-arrow">1 ────── N</span>
                <span class="uml-rel-to">Profile</span>
                <span class="uml-rel-label">has</span>
                <span class="uml-rel-type">ONE-TO-MANY</span>
            </div>
            <div class="uml-rel">
                <span class="uml-rel-from">User</span>
                <span class="uml-rel-arrow">1 ────── 1</span>
                <span class="uml-rel-to">Subscription</span>
                <span class="uml-rel-label">subscribes</span>
                <span class="uml-rel-type">ONE-TO-ONE</span>
            </div>
            <div class="uml-rel">
                <span class="uml-rel-from">Profile</span>
                <span class="uml-rel-arrow">1 ────── N</span>
                <span class="uml-rel-to">WatchHistory</span>
                <span class="uml-rel-label">tracks</span>
                <span class="uml-rel-type">ONE-TO-MANY</span>
            </div>
            <div class="uml-rel">
                <span class="uml-rel-from">Content</span>
                <span class="uml-rel-arrow">1 ────── N</span>
                <span class="uml-rel-to">Episode</span>
                <span class="uml-rel-label">contains</span>
                <span class="uml-rel-type">ONE-TO-MANY</span>
            </div>
            <div class="uml-rel">
                <span class="uml-rel-from">WatchHistory</span>
                <span class="uml-rel-arrow">N ────── 1</span>
                <span class="uml-rel-to">Content</span>
                <span class="uml-rel-label">references</span>
                <span class="uml-rel-type">MANY-TO-ONE</span>
            </div>
            <div class="uml-rel">
                <span class="uml-rel-from">Profile</span>
                <span class="uml-rel-arrow">1 ────── N</span>
                <span class="uml-rel-to">Download</span>
                <span class="uml-rel-label">downloads</span>
                <span class="uml-rel-type">ONE-TO-MANY</span>
            </div>
        </div>

        <div class="uml-note">
            <strong>Hinglish Explanation:</strong> Yeh UML diagram Netflix ka core design dikhata hai &mdash; User ke multiple Profiles hote hain (family sharing), har Profile ki apni WatchHistory hoti hai. Content me Movies aur Series dono aate hain, Series ke Episodes hote hain. SubscriptionService check karta hai ki user ka plan active hai ya nahi aur kitne screens pe stream ho sakta hai.
        </div>
    </div>
</div>

<div class="section theme-purple">
    <div class="section-title"><span class="section-num">14</span>Interview Cheat-Sheet</div>
    <div class="summary-grid">
        <div class="summary-card"><strong>Recommendations</strong><br>Collaborative filtering (Spark batch) + content-based (real-time fallback); cached in Redis per profile</div>
        <div class="summary-card"><strong>Streaming</strong><br>HLS adaptive bitrate; CDN edge delivery (100 Tbps); signed URLs with DRM</div>
        <div class="summary-card"><strong>Profiles</strong><br>Max 5 per account; independent watch history + recommendations; kids mode with maturity filter</div>
        <div class="summary-card"><strong>Continue Watching</strong><br>Progress saved every 30s; Redis buffer &rarr; batch DB write; marks complete at 95%</div>
        <div class="summary-card"><strong>Concurrent Screens</strong><br>Redis SET per account with device IDs; enforce max screens per plan type</div>
        <div class="summary-card"><strong>Regional Licensing</strong><br>Content-region mapping; IP geolocation at CDN edge; VPN detection</div>
        <div class="summary-card"><strong>Scale</strong><br>250M subs, 100M DAU, 15M concurrent streams, 100 Tbps CDN</div>
        <div class="summary-card"><strong>Patterns</strong><br>Strategy, Observer, Decorator, Factory, Proxy, Builder</div>
    </div>
</div>

</div></div>
<!-- END NETFLIX -->

<!-- START SYSTEM DESIGN -->
`
}
