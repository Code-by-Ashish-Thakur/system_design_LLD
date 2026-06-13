export default {
  title: "Video Streaming System &mdash; Low Level Design",
  subtitle: "Complete LLD for Java Spring Boot Interview &mdash; Upload, Transcode, Stream &amp; CDN",
  subtitleColor: "#ffcdd2",
  headerGradient: "linear-gradient(135deg,#b71c1c,#d32f2f,#ff5252)",
  footerText: "Video Streaming System &mdash; Low Level Design",
  content: `
<div class="section theme-green">
    <div class="section-title"><span class="section-num">1</span>Functional Requirements</div>
    <div class="req-grid">
        <div class="req-pill"><span class="num">1</span><div class="fr-content"><div class="fr-en">Video Upload (multipart / chunked)</div><div class="fr-hi">Video upload karo — bade files ke liye multipart/chunked upload</div></div></div>
        <div class="req-pill"><span class="num">2</span><div class="fr-content"><div class="fr-en">Transcoding Pipeline (multiple resolutions)</div><div class="fr-hi">Video ko multiple resolutions me transcode karo — 360p to 4K</div></div></div>
        <div class="req-pill"><span class="num">3</span><div class="fr-content"><div class="fr-en">Adaptive Bitrate Streaming (HLS / DASH)</div><div class="fr-hi">Network speed ke hisaab se quality auto-adjust karo — HLS/DASH</div></div></div>
        <div class="req-pill"><span class="num">4</span><div class="fr-content"><div class="fr-en">CDN Integration for Edge Delivery</div><div class="fr-hi">CDN se edge servers pe cache karo — user ke paas se serve ho</div></div></div>
        <div class="req-pill"><span class="num">5</span><div class="fr-content"><div class="fr-en">Thumbnail &amp; Preview Generation</div><div class="fr-hi">Video ka thumbnail aur hover preview auto-generate karo</div></div></div>
        <div class="req-pill"><span class="num">6</span><div class="fr-content"><div class="fr-en">Video Metadata (title, tags, description)</div><div class="fr-hi">Video ka title, description, tags, category manage karo</div></div></div>
        <div class="req-pill"><span class="num">7</span><div class="fr-content"><div class="fr-en">Comments &amp; Likes System</div><div class="fr-hi">Videos pe comment karo, like karo — engagement features</div></div></div>
        <div class="req-pill"><span class="num">8</span><div class="fr-content"><div class="fr-en">Watch History &amp; Resume Playback</div><div class="fr-hi">Kya dekha, kahan choda track karo — resume se wahi se start ho</div></div></div>
        <div class="req-pill"><span class="num">9</span><div class="fr-content"><div class="fr-en">Channel Subscriptions</div><div class="fr-hi">Channels subscribe karo — naye video pe notification aaye</div></div></div>
        <div class="req-pill"><span class="num">10</span><div class="fr-content"><div class="fr-en">Search with Filters (category, duration, date)</div><div class="fr-hi">Category, duration, date se videos search aur filter karo</div></div></div>
        <div class="req-pill"><span class="num">11</span><div class="fr-content"><div class="fr-en">Live Streaming Support</div><div class="fr-hi">Live streaming support karo — real-time broadcast</div></div></div>
        <div class="req-pill"><span class="num">12</span><div class="fr-content"><div class="fr-en">Content Moderation (NSFW detection)</div><div class="fr-hi">Inappropriate content detect karo — NSFW/moderation rules lagao</div></div></div>
    </div>
</div>

<!-- ============ NON-FUNCTIONAL REQUIREMENTS ============ -->
<div class="section theme-pink">
    <div class="section-title"><span class="section-num">2</span>Non-Functional Requirements</div>
    <div class="req-grid">
        <div class="req-pill"><span class="num">1</span><div class="nfr-content"><div class="nfr-en">Low Latency &mdash; Video playback must start within 2 seconds</div><div class="nfr-hi">Video start &lt; 2 sec me hona chahiye &mdash; user buffering dekhke chala jaayega</div></div></div>
        <div class="req-pill"><span class="num">2</span><div class="nfr-content"><div class="nfr-en">High Availability &mdash; 99.99% uptime, streams must never buffer</div><div class="nfr-hi">99.99% uptime hona chahiye &mdash; stream kabhi buffer nahi hona chahiye</div></div></div>
        <div class="req-pill"><span class="num">3</span><div class="nfr-content"><div class="nfr-en">Scalability &mdash; Handle millions of concurrent viewers</div><div class="nfr-hi">Millions concurrent viewers handle karne padenge &mdash; CDN + horizontal scaling</div></div></div>
        <div class="req-pill"><span class="num">4</span><div class="nfr-content"><div class="nfr-en">CDN &mdash; Edge caching for fast global delivery</div><div class="nfr-hi">Edge caching se global delivery fast honi chahiye &mdash; nearest server se stream ho</div></div></div>
        <div class="req-pill"><span class="num">5</span><div class="nfr-content"><div class="nfr-en">Adaptive Bitrate &mdash; Quality auto-adjusts based on network speed</div><div class="nfr-hi">Network ke hisaab se quality auto-adjust honi chahiye &mdash; slow net pe low quality dikhe</div></div></div>
        <div class="req-pill"><span class="num">6</span><div class="nfr-content"><div class="nfr-en">Fault Tolerance &mdash; Seamless retry on chunk failure</div><div class="nfr-hi">Chunk failure hone pe seamless retry ho &mdash; user ko pata bhi na chale</div></div></div>
    </div>
</div>

<div class="section theme-purple">
    <div class="section-title"><span class="section-num">3</span>Enums</div>
    <div class="enum-grid">
        <div class="enum-card"><h3>VideoStatus</h3><div class="enum-val">UPLOADING</div><div class="enum-val">PROCESSING</div><div class="enum-val">TRANSCODING</div><div class="enum-val">READY</div><div class="enum-val">FAILED</div><div class="enum-val">DELETED</div></div>
        <div class="enum-card"><h3>Resolution</h3><div class="enum-val">R_360P</div><div class="enum-val">R_480P</div><div class="enum-val">R_720P</div><div class="enum-val">R_1080P</div><div class="enum-val">R_1440P</div><div class="enum-val">R_4K</div></div>
        <div class="enum-card"><h3>Codec</h3><div class="enum-val">H264</div><div class="enum-val">H265</div><div class="enum-val">VP9</div><div class="enum-val">AV1</div></div>
        <div class="enum-card"><h3>Visibility</h3><div class="enum-val">PUBLIC</div><div class="enum-val">UNLISTED</div><div class="enum-val">PRIVATE</div><div class="enum-val">SCHEDULED</div></div>
        <div class="enum-card"><h3>TranscodeStatus</h3><div class="enum-val">QUEUED</div><div class="enum-val">IN_PROGRESS</div><div class="enum-val">COMPLETED</div><div class="enum-val">FAILED</div></div>
    </div>
</div>

<div class="section theme-blue">
    <div class="section-title"><span class="section-num">4</span>Service LLD</div>
    <div class="service-grid">
        <div class="service-card">
            <h3>VideoUploadService</h3>
            <p class="svc-desc">Video file ko S3 pe chunked upload karta hai &mdash; resumable upload support ke saath</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">VideoUploadService</span> {

    <span class="cm">// video file S3 pe upload karta hai with metadata</span>
    <span class="tp">Video</span> <span class="fn">upload</span>(<span class="tp">MultipartFile</span> file, <span class="tp">String</span> title, <span class="tp">String</span> description, <span class="tp">Long</span> channelId, <span class="tp">Visibility</span> visibility, <span class="tp">List&lt;String&gt;</span> tags, <span class="tp">Category</span> category)

    <span class="cm">// pehle se started upload ko resume karta hai chunk-wise</span>
    <span class="tp">UploadSession</span> <span class="fn">resumeUpload</span>(<span class="tp">String</span> uploadId, <span class="tp">int</span> chunkNumber, <span class="tp">byte[]</span> chunkData)

    <span class="cm">// file format aur size validate karta hai upload se pehle</span>
    <span class="tp">boolean</span> <span class="fn">validateVideo</span>(<span class="tp">MultipartFile</span> file, <span class="tp">Long</span> maxSizeBytes, <span class="tp">List&lt;String&gt;</span> allowedFormats)

    <span class="cm">// upload ka progress percentage dekhne ke liye</span>
    <span class="tp">UploadProgress</span> <span class="fn">getProgress</span>(<span class="tp">String</span> uploadId)
}
</pre></div>
        </div>
        <div class="service-card">
            <h3>TranscodingService</h3>
            <p class="svc-desc">Video ko multiple quality levels (360p, 720p, 1080p) mein convert karta hai &mdash; Kafka se fan-out hota hai</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">TranscodingService</span> {

    <span class="cm">// video ko multiple resolutions mein transcode karta hai</span>
    <span class="tp">void</span> <span class="fn">transcode</span>(<span class="tp">Long</span> videoId, <span class="tp">List&lt;Resolution&gt;</span> targetResolutions, <span class="tp">Codec</span> codec, <span class="tp">int</span> priority)

    <span class="cm">// transcoding ka current status check karo</span>
    <span class="tp">TranscodeStatus</span> <span class="fn">getStatus</span>(<span class="tp">Long</span> videoId)

    <span class="cm">// fail hui resolution ko dubara retry karo</span>
    <span class="tp">void</span> <span class="fn">retryTranscode</span>(<span class="tp">Long</span> videoId, <span class="tp">Resolution</span> resolution, <span class="tp">int</span> maxRetries)
}
</pre></div>
        </div>
        <div class="service-card">
            <h3>ThumbnailService</h3>
            <p class="svc-desc">Video ke key frames se preview images banata hai &mdash; auto-generate ya custom upload dono support karta hai</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">ThumbnailService</span> {

    <span class="cm">// video ke key frames se thumbnails auto-generate karta hai</span>
    <span class="tp">List&lt;String&gt;</span> <span class="fn">generate</span>(<span class="tp">Long</span> videoId, <span class="tp">int</span> count, <span class="tp">List&lt;Integer&gt;</span> timestamps)

    <span class="cm">// creator apna custom thumbnail upload kar sakta hai</span>
    <span class="tp">String</span> <span class="fn">uploadCustomThumbnail</span>(<span class="tp">Long</span> videoId, <span class="tp">MultipartFile</span> image, <span class="tp">CropParams</span> cropParams)

    <span class="cm">// generated thumbnails mein se ek ko primary set karo</span>
    <span class="tp">void</span> <span class="fn">setPrimaryThumbnail</span>(<span class="tp">Long</span> videoId, <span class="tp">String</span> thumbnailUrl)
}
</pre></div>
        </div>
        <div class="service-card">
            <h3>StreamingService</h3>
            <p class="svc-desc">Viewer ko nearest CDN server se video deliver karta hai &mdash; HLS/DASH adaptive bitrate streaming ke saath</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">StreamingService</span> {

    <span class="cm">// HLS/DASH manifest return karta hai video stream ke liye</span>
    <span class="tp">String</span> <span class="fn">getManifest</span>(<span class="tp">Long</span> videoId, <span class="tp">Resolution</span> resolution, <span class="tp">String</span> format)

    <span class="cm">// time-limited signed URL generate karta hai hotlink protection ke saath</span>
    <span class="tp">String</span> <span class="fn">generateSignedUrl</span>(<span class="tp">Long</span> videoId, <span class="tp">Long</span> userId, <span class="tp">int</span> expiryMinutes, <span class="tp">String</span> ipRestriction)

    <span class="cm">// bandwidth ke hisaab se best quality select karta hai</span>
    <span class="tp">Resolution</span> <span class="fn">selectAdaptiveQuality</span>(<span class="tp">Long</span> userId, <span class="tp">double</span> bandwidthMbps, <span class="tp">double</span> bufferHealth)
}
</pre></div>
        </div>
        <div class="service-card">
            <h3>SearchService</h3>
            <p class="svc-desc">Elasticsearch pe full-text search karta hai &mdash; title, description, tags mein fuzzy matching ke saath</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">SearchService</span> {

    <span class="cm">// fulltext search with filters aur pagination</span>
    <span class="tp">Page&lt;Video&gt;</span> <span class="fn">search</span>(<span class="tp">String</span> query, <span class="tp">SearchFilters</span> filters, <span class="tp">int</span> page, <span class="tp">int</span> size, <span class="tp">String</span> sortBy)

    <span class="cm">// type karte waqt autocomplete suggestions deta hai</span>
    <span class="tp">List&lt;String&gt;</span> <span class="fn">autoSuggest</span>(<span class="tp">String</span> prefix, <span class="tp">int</span> limit, <span class="tp">Long</span> userId)

    <span class="cm">// video ko Elasticsearch index mein add ya delete karta hai</span>
    <span class="tp">void</span> <span class="fn">indexVideo</span>(<span class="tp">Video</span> video, <span class="tp">String</span> operation)
}
</pre></div>
        </div>
        <div class="service-card">
            <h3>ViewCountService</h3>
            <p class="svc-desc">Redis mein fast atomic counter se views count karta hai &mdash; har 30 second mein DB mein flush karta hai (eventually consistent)</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">ViewCountService</span> {

    <span class="cm">// view count badhata hai with deduplication check</span>
    <span class="tp">void</span> <span class="fn">recordView</span>(<span class="tp">Long</span> videoId, <span class="tp">Long</span> userId, <span class="tp">String</span> ipAddress, <span class="tp">int</span> watchDuration)

    <span class="cm">// Redis ya DB se view count fetch karta hai</span>
    <span class="tp">long</span> <span class="fn">getViewCount</span>(<span class="tp">Long</span> videoId, <span class="tp">boolean</span> useCache)

    <span class="cm">// Redis ke buffered counts ko batch mein DB mein flush karta hai</span>
    <span class="tp">void</span> <span class="fn">flushToDatabase</span>(<span class="tp">int</span> batchSize, <span class="tp">boolean</span> forceFlush)
}
</pre></div>
        </div>
        <div class="service-card">
            <h3>ModerationService</h3>
            <p class="svc-desc">AI se NSFW &amp; copyright check karta hai &mdash; user reports handle karta hai aur manual review support karta hai</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">ModerationService</span> {

    <span class="cm">// AI se NSFW, copyright, violence check karta hai</span>
    <span class="tp">ModerationResult</span> <span class="fn">moderate</span>(<span class="tp">Long</span> videoId, <span class="tp">List&lt;String&gt;</span> checkTypes, <span class="tp">boolean</span> strictMode)

    <span class="cm">// user video report karta hai with reason aur timestamp</span>
    <span class="tp">void</span> <span class="fn">flagVideo</span>(<span class="tp">Long</span> videoId, <span class="tp">Long</span> reportedBy, <span class="tp">String</span> reason, <span class="tp">String</span> description, <span class="tp">int</span> timestamp)

    <span class="cm">// moderator flagged video ka decision deta hai</span>
    <span class="tp">void</span> <span class="fn">reviewFlaggedVideo</span>(<span class="tp">Long</span> videoId, <span class="tp">ModerationDecision</span> decision, <span class="tp">Long</span> reviewerId, <span class="tp">String</span> notes)
}
</pre></div>
        </div>
        <div class="service-card">
            <h3>RecommendationService</h3>
            <p class="svc-desc">User ki watch history aur preferences se personalized video suggestions deta hai &mdash; trending aur similar videos bhi</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">RecommendationService</span> {

    <span class="cm">// user ke liye personalized video recommendations deta hai</span>
    <span class="tp">List&lt;Video&gt;</span> <span class="fn">getRecommendations</span>(<span class="tp">Long</span> userId, <span class="tp">int</span> limit, <span class="tp">boolean</span> excludeWatched, <span class="tp">Category</span> category)

    <span class="cm">// region wise trending videos fetch karta hai</span>
    <span class="tp">List&lt;Video&gt;</span> <span class="fn">getTrending</span>(<span class="tp">String</span> region, <span class="tp">int</span> limit, <span class="tp">String</span> timeWindow, <span class="tp">Category</span> category)

    <span class="cm">// current video ke similar videos dhundhta hai</span>
    <span class="tp">List&lt;Video&gt;</span> <span class="fn">getSimilar</span>(<span class="tp">Long</span> videoId, <span class="tp">int</span> limit, <span class="tp">boolean</span> sameChannel)
}
</pre></div>
        </div>
    </div>
</div>

<div class="section theme-purple">
    <div class="section-title"><span class="section-num">5</span>API Endpoints</div>
    <div class="api-grid">
        <div class="api-card"><div class="api-method post">POST</div><div class="api-path">/api/v1/videos/upload</div><div class="api-desc">Upload video (multipart, returns uploadId)</div></div>
        <div class="api-card"><div class="api-method post">POST</div><div class="api-path">/api/v1/videos/upload/{uploadId}/chunk</div><div class="api-desc">Upload chunk for resumable upload</div></div>
        <div class="api-card"><div class="api-method get">GET</div><div class="api-path">/api/v1/videos/{id}</div><div class="api-desc">Get video metadata + stream URLs</div></div>
        <div class="api-card"><div class="api-method get">GET</div><div class="api-path">/api/v1/videos/{id}/stream?resolution=1080p</div><div class="api-desc">Get HLS manifest for adaptive streaming</div></div>
        <div class="api-card"><div class="api-method get">GET</div><div class="api-path">/api/v1/videos/search?q=java&amp;page=0</div><div class="api-desc">Search videos with fulltext + filters</div></div>
        <div class="api-card"><div class="api-method post">POST</div><div class="api-path">/api/v1/videos/{id}/comments</div><div class="api-desc">Add comment (supports nested replies)</div></div>
        <div class="api-card"><div class="api-method post">POST</div><div class="api-path">/api/v1/videos/{id}/like</div><div class="api-desc">Like / unlike a video</div></div>
        <div class="api-card"><div class="api-method put">PUT</div><div class="api-path">/api/v1/videos/{id}/watch-progress</div><div class="api-desc">Update watch progress for resume</div></div>
        <div class="api-card"><div class="api-method get">GET</div><div class="api-path">/api/v1/channels/{id}/videos?page=0</div><div class="api-desc">List channel videos (paginated)</div></div>
        <div class="api-card"><div class="api-method post">POST</div><div class="api-path">/api/v1/channels/{id}/subscribe</div><div class="api-desc">Subscribe / unsubscribe from channel</div></div>
    </div>
</div>

<div class="section theme-blue">
    <div class="section-title"><span class="section-num">6</span>Database Schema</div>

    <div class="sub-heading" style="color:#25d366;border-color:#25d366">Database Technology Stack</div>
    <div class="dbtech-grid">
        <div class="dbtech-card">
            <div class="dbtech-name">PostgreSQL <span class="dbtech-type">RDBMS</span></div>
            <div class="dbtech-usage">Videos metadata, users, channels, subscriptions &mdash; structured relational data</div>
            <div class="dbtech-tables"><span>videos</span><span>users</span><span>channels</span><span>subscriptions</span></div>
        </div>
        <div class="dbtech-card">
            <div class="dbtech-name">S3 <span class="dbtech-type">Blob Storage</span></div>
            <div class="dbtech-usage">Raw uploads &amp; transcoded video files &mdash; multi-resolution HLS/DASH segments</div>
            <div class="dbtech-tables"><span>raw-uploads</span><span>transcoded/{resolution}</span></div>
        </div>
        <div class="dbtech-card">
            <div class="dbtech-name">Redis <span class="dbtech-type">In-Memory</span></div>
            <div class="dbtech-usage">View counters (atomic INCR), active stream sessions, CDN token cache</div>
            <div class="dbtech-tables"><span>views:{videoId}</span><span>session:{userId}</span></div>
        </div>
        <div class="dbtech-card">
            <div class="dbtech-name">Elasticsearch <span class="dbtech-type">Search Engine</span></div>
            <div class="dbtech-usage">Full-text search on video titles, descriptions, tags with fuzzy matching</div>
            <div class="dbtech-tables"><span>videos</span></div>
        </div>
        <div class="dbtech-card">
            <div class="dbtech-name">Kafka <span class="dbtech-type">Message Queue</span></div>
            <div class="dbtech-usage">Transcode job queue, view count flush, content moderation pipeline</div>
            <div class="dbtech-tables"><span>transcode-jobs</span><span>view-events</span></div>
        </div>
        <div class="dbtech-card">
            <div class="dbtech-name">CDN <span class="dbtech-type">Edge Cache</span></div>
            <div class="dbtech-usage">Video segment delivery from nearest edge server &mdash; CloudFront / Akamai</div>
            <div class="dbtech-tables"><span>global edge locations</span></div>
        </div>
    </div>

    <div class="db-grid">
        <div class="db-card">
            <h3>videos</h3>
            <div class="db-row"><span class="col-name">id</span><span class="col-type">BIGINT</span><span class="col-constraint">PK AUTO_INCREMENT</span></div>
            <div class="db-row"><span class="col-name">title</span><span class="col-type">VARCHAR(255)</span><span class="col-constraint">FULLTEXT IDX</span></div>
            <div class="db-row"><span class="col-name">description</span><span class="col-type">TEXT</span><span class="col-constraint">FULLTEXT IDX</span></div>
            <div class="db-row"><span class="col-name">channel_id</span><span class="col-type">BIGINT</span><span class="col-constraint">FK → channels(id) IDX</span></div>
            <div class="db-row"><span class="col-name">original_url</span><span class="col-type">VARCHAR(1024)</span><span class="col-constraint"></span></div>
            <div class="db-row"><span class="col-name">thumbnail_url</span><span class="col-type">VARCHAR(1024)</span><span class="col-constraint"></span></div>
            <div class="db-row"><span class="col-name">duration</span><span class="col-type">INT</span><span class="col-constraint"></span></div>
            <div class="db-row"><span class="col-name">status</span><span class="col-type">ENUM</span><span class="col-constraint">IDX</span></div>
            <div class="db-row"><span class="col-name">visibility</span><span class="col-type">ENUM</span><span class="col-constraint">IDX</span></div>
            <div class="db-row"><span class="col-name">view_count</span><span class="col-type">BIGINT</span><span class="col-constraint">DEFAULT 0</span></div>
            <div class="db-row"><span class="col-name">like_count</span><span class="col-type">BIGINT</span><span class="col-constraint">DEFAULT 0</span></div>
            <div class="db-row"><span class="col-name">created_at</span><span class="col-type">TIMESTAMP</span><span class="col-constraint">IDX</span></div>
        </div>
        <div class="db-card">
            <h3>video_variants</h3>
            <div class="db-row"><span class="col-name">id</span><span class="col-type">BIGINT</span><span class="col-constraint">PK</span></div>
            <div class="db-row"><span class="col-name">video_id</span><span class="col-type">BIGINT</span><span class="col-constraint">FK → videos(id) IDX</span></div>
            <div class="db-row"><span class="col-name">resolution</span><span class="col-type">ENUM</span><span class="col-constraint">NOT NULL</span></div>
            <div class="db-row"><span class="col-name">codec</span><span class="col-type">ENUM</span><span class="col-constraint">NOT NULL</span></div>
            <div class="db-row"><span class="col-name">bitrate</span><span class="col-type">INT</span><span class="col-constraint"></span></div>
            <div class="db-row"><span class="col-name">file_size</span><span class="col-type">BIGINT</span><span class="col-constraint"></span></div>
            <div class="db-row"><span class="col-name">hls_url</span><span class="col-type">VARCHAR(1024)</span><span class="col-constraint"></span></div>
            <div class="db-row"><span class="col-name">status</span><span class="col-type">ENUM</span><span class="col-constraint"></span></div>
        </div>
        <div class="db-card">
            <h3>channels</h3>
            <div class="db-row"><span class="col-name">id</span><span class="col-type">BIGINT</span><span class="col-constraint">PK</span></div>
            <div class="db-row"><span class="col-name">owner_id</span><span class="col-type">BIGINT</span><span class="col-constraint">FK → users(id)</span></div>
            <div class="db-row"><span class="col-name">name</span><span class="col-type">VARCHAR(128)</span><span class="col-constraint"></span></div>
            <div class="db-row"><span class="col-name">handle</span><span class="col-type">VARCHAR(64)</span><span class="col-constraint">UNIQUE</span></div>
            <div class="db-row"><span class="col-name">subscriber_count</span><span class="col-type">BIGINT</span><span class="col-constraint">DEFAULT 0</span></div>
            <div class="db-row"><span class="col-name">verified</span><span class="col-type">BOOLEAN</span><span class="col-constraint">DEFAULT FALSE</span></div>
        </div>
        <div class="db-card">
            <h3>comments</h3>
            <div class="db-row"><span class="col-name">id</span><span class="col-type">BIGINT</span><span class="col-constraint">PK</span></div>
            <div class="db-row"><span class="col-name">video_id</span><span class="col-type">BIGINT</span><span class="col-constraint">FK IDX</span></div>
            <div class="db-row"><span class="col-name">user_id</span><span class="col-type">BIGINT</span><span class="col-constraint">FK</span></div>
            <div class="db-row"><span class="col-name">parent_id</span><span class="col-type">BIGINT</span><span class="col-constraint">FK (self-ref)</span></div>
            <div class="db-row"><span class="col-name">content</span><span class="col-type">TEXT</span><span class="col-constraint"></span></div>
            <div class="db-row"><span class="col-name">like_count</span><span class="col-type">INT</span><span class="col-constraint">DEFAULT 0</span></div>
            <div class="db-row"><span class="col-name">created_at</span><span class="col-type">TIMESTAMP</span><span class="col-constraint">IDX</span></div>
        </div>
        <div class="db-card">
            <h3>watch_history</h3>
            <div class="db-row"><span class="col-name">id</span><span class="col-type">BIGINT</span><span class="col-constraint">PK</span></div>
            <div class="db-row"><span class="col-name">user_id</span><span class="col-type">BIGINT</span><span class="col-constraint">FK IDX</span></div>
            <div class="db-row"><span class="col-name">video_id</span><span class="col-type">BIGINT</span><span class="col-constraint">FK IDX</span></div>
            <div class="db-row"><span class="col-name">watched_seconds</span><span class="col-type">INT</span><span class="col-constraint"></span></div>
            <div class="db-row"><span class="col-name">completed</span><span class="col-type">BOOLEAN</span><span class="col-constraint"></span></div>
            <div class="db-row"><span class="col-name">last_watched_at</span><span class="col-type">TIMESTAMP</span><span class="col-constraint">IDX</span></div>
        </div>
    </div>
</div>

<div class="section theme-green">
    <div class="section-title"><span class="section-num">7</span>Capacity Estimation</div>
    <div class="cap-grid">
        <div class="cap-card"><div class="cap-label">Daily Active Users</div><div class="cap-value">100M</div></div>
        <div class="cap-card"><div class="cap-label">Videos Uploaded / Day</div><div class="cap-value">500K</div></div>
        <div class="cap-card"><div class="cap-label">Avg Video Size (raw)</div><div class="cap-value">500 MB</div></div>
        <div class="cap-card"><div class="cap-label">Daily Upload Storage</div><div class="cap-value">250 TB/day (raw)</div></div>
        <div class="cap-card"><div class="cap-label">Transcoded Variants</div><div class="cap-value">4 per video × 500K = 2M jobs/day</div></div>
        <div class="cap-card"><div class="cap-label">Stream Requests / sec</div><div class="cap-value">~50,000 QPS</div></div>
        <div class="cap-card"><div class="cap-label">CDN Bandwidth</div><div class="cap-value">~40 Tbps peak</div></div>
        <div class="cap-card"><div class="cap-label">View Count Writes</div><div class="cap-value">Buffered in Redis, batch flush every 30s</div></div>
        <div class="cap-card">
            <h4 style="color:#82b1ff;margin-bottom:8px">CPU / Server Estimation</h4>
            <div class="calc-row"><span class="calc-label">Stream QPS (peak)</span><span class="calc-value">~50,000 QPS</span></div>
            <div class="calc-row"><span class="calc-label">Each API server handles</span><span class="calc-value">~5K QPS</span></div>
            <div class="calc-result"><span class="calc-label">API Servers Needed</span><span class="calc-value">~10 servers</span></div>
            <div class="calc-row"><span class="calc-label">Transcode jobs/day</span><span class="calc-value">2M jobs</span></div>
            <div class="calc-row"><span class="calc-label">Avg transcode time</span><span class="calc-value">~30 min per job</span></div>
            <div class="calc-result"><span class="calc-label">Transcode Workers (GPU)</span><span class="calc-value">~400 workers</span></div>
            <div class="calc-result"><span class="calc-label">Total CPU Cores (API)</span><span class="calc-value">~80 cores</span></div>
            <div class="calc-row"><span class="calc-label">CDN Edge Servers</span><span class="calc-value">1000+ globally</span></div>
        </div>
    </div>
</div>

<div class="section theme-green">
    <div class="section-title"><span class="section-num">8</span>Key Architecture</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span><span class="code-title">TranscodingPipeline.java — Processing Pipeline</span></div>
    <pre class="code-block">
<span class="ann">@Service</span>
<span class="kw">public class</span> <span class="tp">TranscodingPipeline</span> {
    <span class="kw">private final</span> <span class="tp">Map</span>&lt;<span class="tp">Codec</span>, <span class="tp">ITranscoder</span>&gt; transcoders;
    <span class="kw">private final</span> <span class="tp">KafkaTemplate</span>&lt;<span class="tp">String</span>, <span class="tp">TranscodeJob</span>&gt; kafka;

    <span class="cm">// On video upload complete → fan-out transcode jobs</span>
    <span class="ann">@EventListener</span>
    <span class="kw">public void</span> <span class="fn">onUploadComplete</span>(<span class="tp">VideoUploadEvent</span> event) {
        <span class="tp">Resolution</span>[] targets = {R_360P, R_480P, R_720P, R_1080P};
        <span class="kw">for</span> (<span class="tp">Resolution</span> res : targets) {
            <span class="tp">TranscodeJob</span> job = <span class="tp">TranscodeJob</span>.<span class="fn">builder</span>()
                .<span class="fn">videoId</span>(event.getVideoId())
                .<span class="fn">inputPath</span>(event.getS3Key())
                .<span class="fn">resolution</span>(res)
                .<span class="fn">codec</span>(<span class="tp">Codec</span>.H264)
                .<span class="fn">build</span>();
            kafka.<span class="fn">send</span>(<span class="st">"transcode.jobs"</span>, job);
        }
    }

    <span class="ann">@KafkaListener</span>(topics = <span class="st">"transcode.jobs"</span>, concurrency = <span class="st">"8"</span>)
    <span class="kw">public void</span> <span class="fn">processTranscode</span>(<span class="tp">TranscodeJob</span> job) {
        <span class="tp">ITranscoder</span> transcoder = transcoders.<span class="fn">get</span>(job.getCodec());
        <span class="tp">TranscodeResult</span> result = transcoder.<span class="fn">transcode</span>(
            job.getInputPath(), job.getResolution(), job.getCodec());

        <span class="cm">// Save variant and generate HLS segments</span>
        <span class="tp">VideoVariant</span> variant = <span class="kw">new</span> <span class="tp">VideoVariant</span>();
        variant.<span class="fn">setVideoId</span>(job.getVideoId());
        variant.<span class="fn">setResolution</span>(job.getResolution());
        variant.<span class="fn">setHlsUrl</span>(result.getHlsManifestUrl());
        variant.<span class="fn">setStatus</span>(<span class="tp">TranscodeStatus</span>.COMPLETED);
        variantRepo.<span class="fn">save</span>(variant);

        <span class="cm">// Check if all variants done → mark video READY</span>
        <span class="kw">if</span> (<span class="fn">allVariantsComplete</span>(job.getVideoId())) {
            videoRepo.<span class="fn">updateStatus</span>(job.getVideoId(), <span class="tp">VideoStatus</span>.READY);
        }
    }
}
    </pre></div>
</div>

<div class="section theme-blue">
    <div class="section-title"><span class="section-num">9</span>Design Patterns Used</div>
    <div class="pattern-grid">
        <div class="pattern-card"><h3>Strategy</h3><p>ITranscoder implementations for H264, H265, VP9 — swap codecs without changing pipeline</p></div>
        <div class="pattern-card"><h3>Observer</h3><p>VideoUploadEvent triggers transcoding, thumbnail generation, moderation in parallel</p></div>
        <div class="pattern-card"><h3>Factory</h3><p>TranscoderFactory creates codec-specific transcoder based on config and video type</p></div>
        <div class="pattern-card"><h3>Chain of Responsibility</h3><p>Processing pipeline: Upload → Validate → Transcode → Thumbnail → Moderate → Publish</p></div>
        <div class="pattern-card"><h3>Producer-Consumer</h3><p>Kafka decouples upload API from CPU-intensive transcoding workers</p></div>
        <div class="pattern-card"><h3>Proxy</h3><p>CDN acts as caching proxy; signed URLs for access control on stream endpoints</p></div>
    </div>
</div>

<div class="section theme-purple">
    <div class="section-title"><span class="section-num">10</span>Sequence Flow</div>
    <div class="flow-container">
        <div class="flow-step"><span class="step-num">1</span><span class="step-text">Creator uploads video via chunked multipart to S3</span></div>
        <div class="flow-step"><span class="step-num">2</span><span class="step-text">Upload service creates Video record (status=UPLOADING)</span></div>
        <div class="flow-step"><span class="step-num">3</span><span class="step-text">On upload complete → publishes VideoUploadEvent</span></div>
        <div class="flow-step"><span class="step-num">4</span><span class="step-text">TranscodingPipeline fans out jobs for 360p, 480p, 720p, 1080p</span></div>
        <div class="flow-step"><span class="step-num">5</span><span class="step-text">FFmpeg workers transcode in parallel, generate HLS .m3u8 + .ts segments</span></div>
        <div class="flow-step"><span class="step-num">6</span><span class="step-text">ThumbnailService extracts key frames, generates sprite sheet</span></div>
        <div class="flow-step"><span class="step-num">7</span><span class="step-text">ModerationService runs NSFW/copyright checks</span></div>
        <div class="flow-step"><span class="step-num">8</span><span class="step-text">All variants complete → Video status = READY</span></div>
        <div class="flow-step"><span class="step-num">9</span><span class="step-text">Viewer requests video → StreamingService returns HLS manifest</span></div>
        <div class="flow-step"><span class="step-num">10</span><span class="step-text">Player fetches .ts segments from nearest CDN edge</span></div>
        <div class="flow-step"><span class="step-num">11</span><span class="step-text">ABR algorithm switches resolution based on bandwidth</span></div>
        <div class="flow-step"><span class="step-num">12</span><span class="step-text">Watch progress saved for resume playback</span></div>
    </div>
</div>

<div class="section theme-blue">
    <div class="section-title"><span class="section-num">11</span>Bottlenecks &amp; Solutions</div>
    <div class="bottleneck-grid">
        <div class="bottleneck-card"><h3>Transcoding CPU Bottleneck</h3><p>GPU-accelerated workers (NVENC); auto-scale K8s pods by queue depth; priority queue for popular creators</p></div>
        <div class="bottleneck-card"><h3>Storage Cost Explosion</h3><p>Tiered storage: hot (SSD) for recent, warm (S3 IA) for old, cold (Glacier) for archive. Delete unpopular variants</p></div>
        <div class="bottleneck-card"><h3>View Count Hot Key</h3><p>Buffer in Redis (INCR); batch flush to DB every 30s; eventually consistent display</p></div>
        <div class="bottleneck-card"><h3>CDN Cache Miss Storm</h3><p>Pre-warm CDN for trending videos; origin shield layer; request coalescing</p></div>
        <div class="bottleneck-card"><h3>Search Latency</h3><p>Elasticsearch with async index updates; denormalized search documents; suggest/autocomplete index</p></div>
        <div class="bottleneck-card"><h3>Upload Reliability</h3><p>Chunked resumable uploads (TUS protocol); client retries individual chunks; server-side assembly</p></div>
    </div>
</div>

<div class="section theme-purple">
    <div class="section-title"><span class="section-num">12</span>Edge Cases</div>
    <div class="edge-grid">
        <div class="edge-card"><h3>Transcode Failure</h3><p>Retry failed variant 3×; if still fails, mark video as PARTIALLY_READY with available resolutions</p></div>
        <div class="edge-card"><h3>Corrupt Upload</h3><p>Validate video header/codec on upload; checksum verification; reject unsupported formats early</p></div>
        <div class="edge-card"><h3>Copyright Content</h3><p>Audio fingerprinting (Content ID); auto-mute or block; appeal process for fair use</p></div>
        <div class="edge-card"><h3>Viral Video Spike</h3><p>CDN auto-scales; pre-warm popular edges; rate limit non-subscriber viewers</p></div>
        <div class="edge-card"><h3>Concurrent Upload Resume</h3><p>Chunk-level locking with upload session ID; detect duplicate chunks via ETag</p></div>
        <div class="edge-card"><h3>Low Bandwidth Viewer</h3><p>ABR starts at lowest quality; progressive enhancement; audio-only fallback mode</p></div>
    </div>
</div>

<div class="section theme-green">
    <div class="section-title"><span class="section-num">13</span>Security Considerations</div>
    <div class="security-grid">
        <div class="security-card"><h3>Signed URLs</h3><p>Time-limited signed URLs for stream access; prevent hotlinking; rotate signing keys</p></div>
        <div class="security-card"><h3>DRM Protection</h3><p>Widevine/FairPlay for premium content; encrypted HLS segments; license server</p></div>
        <div class="security-card"><h3>Upload Validation</h3><p>File type validation (magic bytes); max file size limit; virus scanning</p></div>
        <div class="security-card"><h3>Comment Moderation</h3><p>Profanity filter; spam detection ML; rate limit comments per user</p></div>
        <div class="security-card"><h3>Privacy Controls</h3><p>Unlisted/private visibility; age-restricted content; COPPA compliance</p></div>
        <div class="security-card"><h3>Rate Limiting</h3><p>Upload: 10/day/user; API: 1000 req/min; Stream: IP-based throttle for abuse</p></div>
    </div>
</div>

<div class="section theme-blue">
    <div class="section-title"><span class="section-num">14</span>Interview Cheat-Sheet</div>
    <div class="summary-grid">
        <div class="summary-card"><strong>Upload</strong><br>Chunked resumable upload to S3; TUS protocol for reliability</div>
        <div class="summary-card"><strong>Transcoding</strong><br>Kafka fan-out to FFmpeg workers; 4 resolutions × H264; GPU acceleration</div>
        <div class="summary-card"><strong>Streaming</strong><br>HLS/DASH adaptive bitrate; CDN edge delivery; signed URLs</div>
        <div class="summary-card"><strong>View Counts</strong><br>Redis INCR buffer → batch flush to DB every 30s; eventually consistent</div>
        <div class="summary-card"><strong>Search</strong><br>Elasticsearch fulltext; async index update via Kafka; autocomplete</div>
        <div class="summary-card"><strong>CDN</strong><br>Multi-region edge cache; origin shield; pre-warm trending content</div>
        <div class="summary-card"><strong>Patterns</strong><br>Strategy, Observer, Factory, Chain of Responsibility, Producer-Consumer, Proxy</div>
        <div class="summary-card"><strong>Scale</strong><br>100M DAU, 500K uploads/day, 50K stream QPS, 40 Tbps CDN bandwidth</div>
    </div>
</div>

</div></div>
<!-- END VIDEO STREAMING -->

<!-- ==================== API RATE LIMITER ==================== -->
`
}
