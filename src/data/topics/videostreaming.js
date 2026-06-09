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
        <div class="req-pill"><span class="num">1</span> Video Upload (multipart / chunked)</div>
        <div class="req-pill"><span class="num">2</span> Transcoding Pipeline (multiple resolutions)</div>
        <div class="req-pill"><span class="num">3</span> Adaptive Bitrate Streaming (HLS / DASH)</div>
        <div class="req-pill"><span class="num">4</span> CDN Integration for Edge Delivery</div>
        <div class="req-pill"><span class="num">5</span> Thumbnail &amp; Preview Generation</div>
        <div class="req-pill"><span class="num">6</span> Video Metadata (title, tags, description)</div>
        <div class="req-pill"><span class="num">7</span> Comments &amp; Likes System</div>
        <div class="req-pill"><span class="num">8</span> Watch History &amp; Resume Playback</div>
        <div class="req-pill"><span class="num">9</span> Channel Subscriptions</div>
        <div class="req-pill"><span class="num">10</span> Search with Filters (category, duration, date)</div>
        <div class="req-pill"><span class="num">11</span> Live Streaming Support</div>
        <div class="req-pill"><span class="num">12</span> Content Moderation (NSFW detection)</div>
    </div>
</div>

<div class="section theme-blue">
    <div class="section-title"><span class="section-num">2</span>Core Entities</div>
    <div class="entity-grid">
        <div class="entity-card">
            <h3>Video</h3>
            <div class="field"><span class="field-name">id</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">title</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">description</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">channelId</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">originalUrl</span><span class="field-type">String (S3)</span></div>
            <div class="field"><span class="field-name">thumbnailUrl</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">duration</span><span class="field-type">int (seconds)</span></div>
            <div class="field"><span class="field-name">status</span><span class="field-type">VideoStatus</span></div>
            <div class="field"><span class="field-name">visibility</span><span class="field-type">Visibility</span></div>
            <div class="field"><span class="field-name">category</span><span class="field-type">Category</span></div>
            <div class="field"><span class="field-name">tags</span><span class="field-type">List&lt;String&gt;</span></div>
            <div class="field"><span class="field-name">viewCount</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">likeCount</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">createdAt</span><span class="field-type">LocalDateTime</span></div>
        </div>
        <div class="entity-card">
            <h3>VideoVariant</h3>
            <div class="field"><span class="field-name">id</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">videoId</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">resolution</span><span class="field-type">Resolution</span></div>
            <div class="field"><span class="field-name">codec</span><span class="field-type">Codec</span></div>
            <div class="field"><span class="field-name">bitrate</span><span class="field-type">int (kbps)</span></div>
            <div class="field"><span class="field-name">fileSize</span><span class="field-type">Long (bytes)</span></div>
            <div class="field"><span class="field-name">hlsUrl</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">dashUrl</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">status</span><span class="field-type">TranscodeStatus</span></div>
        </div>
        <div class="entity-card">
            <h3>Channel</h3>
            <div class="field"><span class="field-name">id</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">ownerId</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">name</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">handle</span><span class="field-type">String (@unique)</span></div>
            <div class="field"><span class="field-name">avatarUrl</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">subscriberCount</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">verified</span><span class="field-type">boolean</span></div>
            <div class="field"><span class="field-name">createdAt</span><span class="field-type">LocalDateTime</span></div>
        </div>
        <div class="entity-card">
            <h3>Comment</h3>
            <div class="field"><span class="field-name">id</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">videoId</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">userId</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">parentId</span><span class="field-type">Long (nullable)</span></div>
            <div class="field"><span class="field-name">content</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">likeCount</span><span class="field-type">int</span></div>
            <div class="field"><span class="field-name">createdAt</span><span class="field-type">LocalDateTime</span></div>
        </div>
        <div class="entity-card">
            <h3>WatchHistory</h3>
            <div class="field"><span class="field-name">id</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">userId</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">videoId</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">watchedSeconds</span><span class="field-type">int</span></div>
            <div class="field"><span class="field-name">completed</span><span class="field-type">boolean</span></div>
            <div class="field"><span class="field-name">lastWatchedAt</span><span class="field-type">LocalDateTime</span></div>
        </div>
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

<div class="section theme-green">
    <div class="section-title"><span class="section-num">4</span>Interfaces &amp; SOLID Principles</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span><span class="code-title">VideoInterfaces.java — Strategy + OCP</span></div>
    <pre class="code-block">
<span class="kw">public interface</span> <span class="tp">IVideoService</span> {
    <span class="tp">Video</span> <span class="fn">upload</span>(<span class="tp">MultipartFile</span> file, <span class="tp">VideoMetadataRequest</span> meta);
    <span class="tp">Video</span> <span class="fn">getById</span>(<span class="tp">Long</span> id);
    <span class="tp">Page</span>&lt;<span class="tp">Video</span>&gt; <span class="fn">search</span>(<span class="tp">String</span> query, <span class="tp">Pageable</span> pageable);
    <span class="kw">void</span> <span class="fn">delete</span>(<span class="tp">Long</span> id);
}

<span class="kw">public interface</span> <span class="tp">ITranscoder</span> {
    <span class="tp">TranscodeResult</span> <span class="fn">transcode</span>(<span class="tp">String</span> inputPath, <span class="tp">Resolution</span> res, <span class="tp">Codec</span> codec);
    <span class="tp">Codec</span> <span class="fn">getCodec</span>();
}

<span class="kw">public interface</span> <span class="tp">IStorageService</span> {
    <span class="tp">String</span> <span class="fn">upload</span>(<span class="tp">InputStream</span> data, <span class="tp">String</span> key, <span class="tp">String</span> contentType);
    <span class="tp">InputStream</span> <span class="fn">download</span>(<span class="tp">String</span> key);
    <span class="tp">String</span> <span class="fn">getSignedUrl</span>(<span class="tp">String</span> key, <span class="tp">Duration</span> expiry);
}

<span class="kw">public interface</span> <span class="tp">ICdnService</span> {
    <span class="tp">String</span> <span class="fn">getStreamUrl</span>(<span class="tp">Long</span> videoId, <span class="tp">Resolution</span> res);
    <span class="kw">void</span> <span class="fn">invalidateCache</span>(<span class="tp">String</span> videoKey);
}
    </pre></div>
</div>

<div class="section theme-blue">
    <div class="section-title"><span class="section-num">5</span>Class Design (JPA Entities)</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span><span class="code-title">Video.java — JPA Entity</span></div>
    <pre class="code-block">
<span class="ann">@Entity</span>
<span class="ann">@Table</span>(name = <span class="st">"videos"</span>, indexes = {
    <span class="ann">@Index</span>(name = <span class="st">"idx_video_channel"</span>, columnList = <span class="st">"channel_id, created_at DESC"</span>),
    <span class="ann">@Index</span>(name = <span class="st">"idx_video_status"</span>, columnList = <span class="st">"status"</span>)
})
<span class="kw">public class</span> <span class="tp">Video</span> {
    <span class="ann">@Id</span> <span class="ann">@GeneratedValue</span>(strategy = <span class="tp">GenerationType</span>.IDENTITY)
    <span class="kw">private</span> <span class="tp">Long</span> id;

    <span class="ann">@Column</span>(nullable = <span class="kw">false</span>)
    <span class="kw">private</span> <span class="tp">String</span> title;
    <span class="ann">@Column</span>(columnDefinition = <span class="st">"TEXT"</span>)
    <span class="kw">private</span> <span class="tp">String</span> description;

    <span class="ann">@ManyToOne</span>(fetch = <span class="tp">FetchType</span>.LAZY)
    <span class="ann">@JoinColumn</span>(name = <span class="st">"channel_id"</span>)
    <span class="kw">private</span> <span class="tp">Channel</span> channel;

    <span class="kw">private</span> <span class="tp">String</span> originalUrl;
    <span class="kw">private</span> <span class="tp">String</span> thumbnailUrl;
    <span class="kw">private int</span> duration;

    <span class="ann">@Enumerated</span>(<span class="tp">EnumType</span>.STRING)
    <span class="kw">private</span> <span class="tp">VideoStatus</span> status;

    <span class="ann">@Enumerated</span>(<span class="tp">EnumType</span>.STRING)
    <span class="kw">private</span> <span class="tp">Visibility</span> visibility;

    <span class="ann">@ElementCollection</span>
    <span class="kw">private</span> <span class="tp">List</span>&lt;<span class="tp">String</span>&gt; tags;

    <span class="kw">private</span> <span class="tp">Long</span> viewCount = <span class="cn">0L</span>;
    <span class="kw">private</span> <span class="tp">Long</span> likeCount = <span class="cn">0L</span>;

    <span class="ann">@OneToMany</span>(mappedBy = <span class="st">"video"</span>, cascade = <span class="tp">CascadeType</span>.ALL)
    <span class="kw">private</span> <span class="tp">List</span>&lt;<span class="tp">VideoVariant</span>&gt; variants;

    <span class="ann">@CreationTimestamp</span>
    <span class="kw">private</span> <span class="tp">LocalDateTime</span> createdAt;
}
    </pre></div>
</div>

<div class="section theme-purple">
    <div class="section-title"><span class="section-num">6</span>Repository / DAO Layer</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span><span class="code-title">VideoRepository.java</span></div>
    <pre class="code-block">
<span class="kw">public interface</span> <span class="tp">VideoRepository</span> <span class="kw">extends</span> <span class="tp">JpaRepository</span>&lt;<span class="tp">Video</span>, <span class="tp">Long</span>&gt; {
    <span class="tp">Page</span>&lt;<span class="tp">Video</span>&gt; <span class="fn">findByChannelIdAndVisibility</span>(
        <span class="tp">Long</span> channelId, <span class="tp">Visibility</span> vis, <span class="tp">Pageable</span> pageable);

    <span class="ann">@Query</span>(<span class="st">"SELECT v FROM Video v WHERE v.status = :status ORDER BY v.createdAt"</span>)
    <span class="tp">List</span>&lt;<span class="tp">Video</span>&gt; <span class="fn">findByStatus</span>(<span class="ann">@Param</span>(<span class="st">"status"</span>) <span class="tp">VideoStatus</span> status);

    <span class="ann">@Query</span>(value = <span class="st">"SELECT * FROM videos WHERE MATCH(title, description) AGAINST(:q IN BOOLEAN MODE)"</span>, nativeQuery = <span class="kw">true</span>)
    <span class="tp">Page</span>&lt;<span class="tp">Video</span>&gt; <span class="fn">fullTextSearch</span>(<span class="ann">@Param</span>(<span class="st">"q"</span>) <span class="tp">String</span> query, <span class="tp">Pageable</span> pageable);

    <span class="ann">@Modifying</span>
    <span class="ann">@Query</span>(<span class="st">"UPDATE Video v SET v.viewCount = v.viewCount + 1 WHERE v.id = :id"</span>)
    <span class="kw">void</span> <span class="fn">incrementViewCount</span>(<span class="ann">@Param</span>(<span class="st">"id"</span>) <span class="tp">Long</span> id);
}

<span class="kw">public interface</span> <span class="tp">VideoVariantRepository</span> <span class="kw">extends</span> <span class="tp">JpaRepository</span>&lt;<span class="tp">VideoVariant</span>, <span class="tp">Long</span>&gt; {
    <span class="tp">List</span>&lt;<span class="tp">VideoVariant</span>&gt; <span class="fn">findByVideoIdAndStatus</span>(<span class="tp">Long</span> videoId, <span class="tp">TranscodeStatus</span> status);
}

<span class="kw">public interface</span> <span class="tp">WatchHistoryRepository</span> <span class="kw">extends</span> <span class="tp">JpaRepository</span>&lt;<span class="tp">WatchHistory</span>, <span class="tp">Long</span>&gt; {
    <span class="tp">Optional</span>&lt;<span class="tp">WatchHistory</span>&gt; <span class="fn">findByUserIdAndVideoId</span>(<span class="tp">Long</span> userId, <span class="tp">Long</span> videoId);
    <span class="tp">Page</span>&lt;<span class="tp">WatchHistory</span>&gt; <span class="fn">findByUserIdOrderByLastWatchedAtDesc</span>(<span class="tp">Long</span> userId, <span class="tp">Pageable</span> p);
}
    </pre></div>
</div>

<div class="section theme-green">
    <div class="section-title"><span class="section-num">7</span>Database Schema</div>
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

<div class="section theme-blue">
    <div class="section-title"><span class="section-num">8</span>API Endpoints</div>
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

<div class="section theme-purple">
    <div class="section-title"><span class="section-num">9</span>Service Layer</div>
    <div class="service-grid">
        <div class="service-card">
            <h3>VideoUploadService</h3>
            <p class="svc-desc">Handles video file upload to cloud storage (S3) in chunks</p>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Upload a video file with its details</div><code>Video upload(MultipartFile file, VideoMetadata metadata)</code></div>
        </div>
        <div class="service-card">
            <h3>TranscodingService</h3>
            <p class="svc-desc">Converts videos into different quality levels (360p, 720p, 1080p) for streaming</p>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Start converting a video into all quality levels</div><code>void transcode(Long videoId)</code></div>
        </div>
        <div class="service-card">
            <h3>ThumbnailService</h3>
            <p class="svc-desc">Creates preview images by picking frames from the video</p>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Generate thumbnail images for a video</div><code>List&lt;String&gt; generate(Long videoId)</code></div>
        </div>
        <div class="service-card">
            <h3>StreamingService</h3>
            <p class="svc-desc">Delivers video stream to user's device from the nearest server (CDN)</p>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Get the video stream URL for a given quality</div><code>String getManifest(Long videoId, Resolution resolution)</code></div>
        </div>
        <div class="service-card">
            <h3>SearchService</h3>
            <p class="svc-desc">Helps users find videos by searching titles, descriptions, and tags</p>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Search for videos by keyword</div><code>Page&lt;Video&gt; search(String query, SearchFilters filters)</code></div>
        </div>
        <div class="service-card">
            <h3>ViewCountService</h3>
            <p class="svc-desc">Counts video views using a fast in-memory counter (Redis), saves to DB every 30 seconds</p>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Record a new view for a video</div><code>void recordView(Long videoId)</code></div>
        </div>
        <div class="service-card">
            <h3>ModerationService</h3>
            <p class="svc-desc">Checks videos for inappropriate content and copyright violations using AI</p>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Check a video for violations</div><code>ModerationResult moderate(Long videoId)</code></div>
        </div>
        <div class="service-card">
            <h3>RecommendationService</h3>
            <p class="svc-desc">Suggests videos the user might like based on what they watched before</p>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Get personalized video recommendations</div><code>List&lt;Video&gt; getRecommendations(Long userId)</code></div>
        </div>
    </div>
</div>

<div class="section theme-green">
    <div class="section-title"><span class="section-num">10</span>Key Architecture</div>
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
    <div class="section-title"><span class="section-num">11</span>Design Patterns Used</div>
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
    <div class="section-title"><span class="section-num">12</span>Sequence Flow</div>
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

<div class="section theme-green">
    <div class="section-title"><span class="section-num">13</span>Capacity Estimation</div>
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

<div class="section theme-blue">
    <div class="section-title"><span class="section-num">14</span>Bottlenecks &amp; Solutions</div>
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
    <div class="section-title"><span class="section-num">15</span>Edge Cases</div>
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
    <div class="section-title"><span class="section-num">16</span>Security Considerations</div>
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
    <div class="section-title"><span class="section-num">17</span>Interview Cheat-Sheet</div>
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
