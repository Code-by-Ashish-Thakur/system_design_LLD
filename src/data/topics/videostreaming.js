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

<div class="section theme-purple">
    <div class="section-title"><span class="section-num">2</span>Enums</div>
    <div class="enum-grid">
        <div class="enum-card"><h3>VideoStatus</h3><div class="enum-val">UPLOADING</div><div class="enum-val">PROCESSING</div><div class="enum-val">TRANSCODING</div><div class="enum-val">READY</div><div class="enum-val">FAILED</div><div class="enum-val">DELETED</div></div>
        <div class="enum-card"><h3>Resolution</h3><div class="enum-val">R_360P</div><div class="enum-val">R_480P</div><div class="enum-val">R_720P</div><div class="enum-val">R_1080P</div><div class="enum-val">R_1440P</div><div class="enum-val">R_4K</div></div>
        <div class="enum-card"><h3>Codec</h3><div class="enum-val">H264</div><div class="enum-val">H265</div><div class="enum-val">VP9</div><div class="enum-val">AV1</div></div>
        <div class="enum-card"><h3>Visibility</h3><div class="enum-val">PUBLIC</div><div class="enum-val">UNLISTED</div><div class="enum-val">PRIVATE</div><div class="enum-val">SCHEDULED</div></div>
        <div class="enum-card"><h3>TranscodeStatus</h3><div class="enum-val">QUEUED</div><div class="enum-val">IN_PROGRESS</div><div class="enum-val">COMPLETED</div><div class="enum-val">FAILED</div></div>
    </div>
</div>

<div class="section theme-green">
    <div class="section-title"><span class="section-num">3</span>Class Design (JPA Entities)</div>
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

<div class="section theme-blue">
    <div class="section-title"><span class="section-num">4</span>Database Schema</div>

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
    <div class="section-title"><span class="section-num">6</span>Service LLD</div>
    <div class="service-grid">
        <div class="service-card">
            <h3>VideoUploadService</h3>
            <p class="svc-desc">Video file ko S3 pe chunked upload karta hai &mdash; resumable upload support ke saath</p>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">1</span> upload(VideoUploadRequest)</div>
                <div class="method-return">Returns: <code>Video</code></div>
                <div class="params-title">Parameters (VideoUploadRequest):</div>
                <div class="param-row"><span class="param-name">file</span><span class="param-type">MultipartFile</span><span class="param-comment">// actual video file jo user upload kar raha hai</span></div>
                <div class="param-row"><span class="param-name">title</span><span class="param-type">String</span></div>
                <div class="param-row"><span class="param-name">description</span><span class="param-type">String</span><span class="param-opt">[Optional]</span></div>
                <div class="param-row"><span class="param-name">channelId</span><span class="param-type">Long</span></div>
                <div class="param-row"><span class="param-name">visibility</span><span class="param-type">Visibility</span><span class="param-comment">// PUBLIC, UNLISTED, PRIVATE, SCHEDULED</span></div>
                <div class="param-row"><span class="param-name">tags</span><span class="param-type">List&lt;String&gt;</span><span class="param-opt">[Optional]</span></div>
                <div class="param-row"><span class="param-name">category</span><span class="param-type">Category</span><span class="param-opt">[Optional]</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">2</span> resumeUpload(ResumeUploadRequest)</div>
                <div class="method-return">Returns: <code>UploadSession</code></div>
                <div class="params-title">Parameters (ResumeUploadRequest):</div>
                <div class="param-row"><span class="param-name">uploadId</span><span class="param-type">String</span><span class="param-comment">// pehle se started upload ka unique ID</span></div>
                <div class="param-row"><span class="param-name">chunkNumber</span><span class="param-type">int</span><span class="param-comment">// kaunsa chunk resume karna hai</span></div>
                <div class="param-row"><span class="param-name">chunkData</span><span class="param-type">byte[]</span><span class="param-comment">// chunk ka actual data</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">3</span> validateVideo(ValidationRequest)</div>
                <div class="method-return">Returns: <code>boolean</code></div>
                <div class="params-title">Parameters (ValidationRequest):</div>
                <div class="param-row"><span class="param-name">file</span><span class="param-type">MultipartFile</span><span class="param-comment">// file format aur size check karne ke liye</span></div>
                <div class="param-row"><span class="param-name">maxSizeBytes</span><span class="param-type">Long</span><span class="param-comment">// max allowed file size (default 10GB)</span></div>
                <div class="param-row"><span class="param-name">allowedFormats</span><span class="param-type">List&lt;String&gt;</span><span class="param-comment">// mp4, mkv, avi etc.</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">4</span> getProgress(ProgressRequest)</div>
                <div class="method-return">Returns: <code>UploadProgress</code></div>
                <div class="params-title">Parameters (ProgressRequest):</div>
                <div class="param-row"><span class="param-name">uploadId</span><span class="param-type">String</span><span class="param-comment">// jis upload ka progress dekhna hai</span></div>
            </div>
        </div>
        <div class="service-card">
            <h3>TranscodingService</h3>
            <p class="svc-desc">Video ko multiple quality levels (360p, 720p, 1080p) mein convert karta hai &mdash; Kafka se fan-out hota hai</p>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">1</span> transcode(TranscodeRequest)</div>
                <div class="method-return">Returns: <code>void</code></div>
                <div class="params-title">Parameters (TranscodeRequest):</div>
                <div class="param-row"><span class="param-name">videoId</span><span class="param-type">Long</span><span class="param-comment">// kis video ko transcode karna hai</span></div>
                <div class="param-row"><span class="param-name">targetResolutions</span><span class="param-type">List&lt;Resolution&gt;</span><span class="param-comment">// 360P, 480P, 720P, 1080P targets</span></div>
                <div class="param-row"><span class="param-name">codec</span><span class="param-type">Codec</span><span class="param-comment">// H264, H265, VP9, AV1</span></div>
                <div class="param-row"><span class="param-name">priority</span><span class="param-type">int</span><span class="param-opt">[Optional]</span><span class="param-comment">// popular creators ko high priority</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">2</span> getStatus(TranscodeStatusRequest)</div>
                <div class="method-return">Returns: <code>TranscodeStatus</code></div>
                <div class="params-title">Parameters (TranscodeStatusRequest):</div>
                <div class="param-row"><span class="param-name">videoId</span><span class="param-type">Long</span><span class="param-comment">// video ID jiska status dekhna hai</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">3</span> retryTranscode(RetryTranscodeRequest)</div>
                <div class="method-return">Returns: <code>void</code></div>
                <div class="params-title">Parameters (RetryTranscodeRequest):</div>
                <div class="param-row"><span class="param-name">videoId</span><span class="param-type">Long</span><span class="param-comment">// fail hui video ka ID</span></div>
                <div class="param-row"><span class="param-name">resolution</span><span class="param-type">Resolution</span><span class="param-comment">// konsi resolution fail hui thi, woh retry karo</span></div>
                <div class="param-row"><span class="param-name">maxRetries</span><span class="param-type">int</span><span class="param-opt">[Optional]</span><span class="param-comment">// kitni baar retry karna hai (default 3)</span></div>
            </div>
        </div>
        <div class="service-card">
            <h3>ThumbnailService</h3>
            <p class="svc-desc">Video ke key frames se preview images banata hai &mdash; auto-generate ya custom upload dono support karta hai</p>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">1</span> generate(ThumbnailGenerateRequest)</div>
                <div class="method-return">Returns: <code>List&lt;String&gt;</code></div>
                <div class="params-title">Parameters (ThumbnailGenerateRequest):</div>
                <div class="param-row"><span class="param-name">videoId</span><span class="param-type">Long</span><span class="param-comment">// kis video ke thumbnails generate karne hain</span></div>
                <div class="param-row"><span class="param-name">count</span><span class="param-type">int</span><span class="param-opt">[Optional]</span><span class="param-comment">// kitne thumbnails chahiye (default 3)</span></div>
                <div class="param-row"><span class="param-name">timestamps</span><span class="param-type">List&lt;Integer&gt;</span><span class="param-opt">[Optional]</span><span class="param-comment">// specific seconds pe capture karo</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">2</span> uploadCustomThumbnail(CustomThumbnailRequest)</div>
                <div class="method-return">Returns: <code>String</code></div>
                <div class="params-title">Parameters (CustomThumbnailRequest):</div>
                <div class="param-row"><span class="param-name">videoId</span><span class="param-type">Long</span><span class="param-comment">// kis video ka custom thumbnail hai</span></div>
                <div class="param-row"><span class="param-name">image</span><span class="param-type">MultipartFile</span><span class="param-comment">// thumbnail image file (JPG/PNG)</span></div>
                <div class="param-row"><span class="param-name">cropParams</span><span class="param-type">CropParams</span><span class="param-opt">[Optional]</span><span class="param-comment">// 16:9 aspect ratio mein crop karne ke params</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">3</span> setPrimaryThumbnail(SetPrimaryRequest)</div>
                <div class="method-return">Returns: <code>void</code></div>
                <div class="params-title">Parameters (SetPrimaryRequest):</div>
                <div class="param-row"><span class="param-name">videoId</span><span class="param-type">Long</span><span class="param-comment">// kis video ka primary thumbnail set karna hai</span></div>
                <div class="param-row"><span class="param-name">thumbnailUrl</span><span class="param-type">String</span><span class="param-comment">// selected thumbnail ka S3 URL</span></div>
            </div>
        </div>
        <div class="service-card">
            <h3>StreamingService</h3>
            <p class="svc-desc">Viewer ko nearest CDN server se video deliver karta hai &mdash; HLS/DASH adaptive bitrate streaming ke saath</p>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">1</span> getManifest(ManifestRequest)</div>
                <div class="method-return">Returns: <code>String</code></div>
                <div class="params-title">Parameters (ManifestRequest):</div>
                <div class="param-row"><span class="param-name">videoId</span><span class="param-type">Long</span><span class="param-comment">// konsa video stream karna hai</span></div>
                <div class="param-row"><span class="param-name">resolution</span><span class="param-type">Resolution</span><span class="param-comment">// preferred quality (720P, 1080P etc.)</span></div>
                <div class="param-row"><span class="param-name">format</span><span class="param-type">String</span><span class="param-opt">[Optional]</span><span class="param-comment">// HLS ya DASH (default HLS)</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">2</span> generateSignedUrl(SignedUrlRequest)</div>
                <div class="method-return">Returns: <code>String</code></div>
                <div class="params-title">Parameters (SignedUrlRequest):</div>
                <div class="param-row"><span class="param-name">videoId</span><span class="param-type">Long</span><span class="param-comment">// video ID jiska signed URL chahiye</span></div>
                <div class="param-row"><span class="param-name">userId</span><span class="param-type">Long</span><span class="param-comment">// user ID for access validation</span></div>
                <div class="param-row"><span class="param-name">expiryMinutes</span><span class="param-type">int</span><span class="param-comment">// kitne minutes mein URL expire hoga</span></div>
                <div class="param-row"><span class="param-name">ipRestriction</span><span class="param-type">String</span><span class="param-opt">[Optional]</span><span class="param-comment">// specific IP pe lock karo (hotlink protection)</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">3</span> selectAdaptiveQuality(AdaptiveQualityRequest)</div>
                <div class="method-return">Returns: <code>Resolution</code></div>
                <div class="params-title">Parameters (AdaptiveQualityRequest):</div>
                <div class="param-row"><span class="param-name">userId</span><span class="param-type">Long</span><span class="param-comment">// user ki bandwidth history ke liye</span></div>
                <div class="param-row"><span class="param-name">bandwidthMbps</span><span class="param-type">double</span><span class="param-comment">// current measured bandwidth in Mbps</span></div>
                <div class="param-row"><span class="param-name">bufferHealth</span><span class="param-type">double</span><span class="param-opt">[Optional]</span><span class="param-comment">// buffer mein kitne seconds ka data hai</span></div>
            </div>
        </div>
        <div class="service-card">
            <h3>SearchService</h3>
            <p class="svc-desc">Elasticsearch pe full-text search karta hai &mdash; title, description, tags mein fuzzy matching ke saath</p>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">1</span> search(VideoSearchRequest)</div>
                <div class="method-return">Returns: <code>Page&lt;Video&gt;</code></div>
                <div class="params-title">Parameters (VideoSearchRequest):</div>
                <div class="param-row"><span class="param-name">query</span><span class="param-type">String</span><span class="param-comment">// search keyword ya phrase</span></div>
                <div class="param-row"><span class="param-name">filters</span><span class="param-type">SearchFilters</span><span class="param-opt">[Optional]</span><span class="param-comment">// category, duration range, upload date</span></div>
                <div class="param-row"><span class="param-name">page</span><span class="param-type">int</span><span class="param-comment">// page number (0-indexed)</span></div>
                <div class="param-row"><span class="param-name">size</span><span class="param-type">int</span><span class="param-comment">// results per page (default 20)</span></div>
                <div class="param-row"><span class="param-name">sortBy</span><span class="param-type">String</span><span class="param-opt">[Optional]</span><span class="param-comment">// relevance, date, viewCount</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">2</span> autoSuggest(AutoSuggestRequest)</div>
                <div class="method-return">Returns: <code>List&lt;String&gt;</code></div>
                <div class="params-title">Parameters (AutoSuggestRequest):</div>
                <div class="param-row"><span class="param-name">prefix</span><span class="param-type">String</span><span class="param-comment">// user ne abhi tak kya type kiya hai</span></div>
                <div class="param-row"><span class="param-name">limit</span><span class="param-type">int</span><span class="param-opt">[Optional]</span><span class="param-comment">// max suggestions (default 10)</span></div>
                <div class="param-row"><span class="param-name">userId</span><span class="param-type">Long</span><span class="param-opt">[Optional]</span><span class="param-comment">// personalized suggestions user history se</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">3</span> indexVideo(IndexVideoRequest)</div>
                <div class="method-return">Returns: <code>void</code></div>
                <div class="params-title">Parameters (IndexVideoRequest):</div>
                <div class="param-row"><span class="param-name">video</span><span class="param-type">Video</span><span class="param-comment">// video entity jo Elasticsearch index mein add/update karna hai</span></div>
                <div class="param-row"><span class="param-name">operation</span><span class="param-type">String</span><span class="param-comment">// INDEX ya DELETE</span></div>
            </div>
        </div>
        <div class="service-card">
            <h3>ViewCountService</h3>
            <p class="svc-desc">Redis mein fast atomic counter se views count karta hai &mdash; har 30 second mein DB mein flush karta hai (eventually consistent)</p>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">1</span> recordView(RecordViewRequest)</div>
                <div class="method-return">Returns: <code>void</code></div>
                <div class="params-title">Parameters (RecordViewRequest):</div>
                <div class="param-row"><span class="param-name">videoId</span><span class="param-type">Long</span><span class="param-comment">// kis video ka view count badhaana hai</span></div>
                <div class="param-row"><span class="param-name">userId</span><span class="param-type">Long</span><span class="param-opt">[Optional]</span><span class="param-comment">// duplicate view detection ke liye</span></div>
                <div class="param-row"><span class="param-name">ipAddress</span><span class="param-type">String</span><span class="param-comment">// bot detection &amp; deduplication ke liye</span></div>
                <div class="param-row"><span class="param-name">watchDuration</span><span class="param-type">int</span><span class="param-comment">// kitne seconds dekha (30s minimum for valid view)</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">2</span> getViewCount(ViewCountRequest)</div>
                <div class="method-return">Returns: <code>long</code></div>
                <div class="params-title">Parameters (ViewCountRequest):</div>
                <div class="param-row"><span class="param-name">videoId</span><span class="param-type">Long</span><span class="param-comment">// video ID jiska view count chahiye</span></div>
                <div class="param-row"><span class="param-name">useCache</span><span class="param-type">boolean</span><span class="param-opt">[Optional]</span><span class="param-comment">// Redis se fast read ya DB se accurate (default true = Redis)</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">3</span> flushToDatabase(FlushRequest)</div>
                <div class="method-return">Returns: <code>void</code></div>
                <div class="params-title">Parameters (FlushRequest):</div>
                <div class="param-row"><span class="param-name">batchSize</span><span class="param-type">int</span><span class="param-opt">[Optional]</span><span class="param-comment">// ek batch mein kitne videos flush karne hain (default 1000)</span></div>
                <div class="param-row"><span class="param-name">forceFlush</span><span class="param-type">boolean</span><span class="param-opt">[Optional]</span><span class="param-comment">// immediate flush chahiye ya scheduled (30s interval)</span></div>
            </div>
        </div>
        <div class="service-card">
            <h3>ModerationService</h3>
            <p class="svc-desc">AI se NSFW &amp; copyright check karta hai &mdash; user reports handle karta hai aur manual review support karta hai</p>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">1</span> moderate(ModerationRequest)</div>
                <div class="method-return">Returns: <code>ModerationResult</code></div>
                <div class="params-title">Parameters (ModerationRequest):</div>
                <div class="param-row"><span class="param-name">videoId</span><span class="param-type">Long</span><span class="param-comment">// video ID jisko moderate karna hai</span></div>
                <div class="param-row"><span class="param-name">checkTypes</span><span class="param-type">List&lt;String&gt;</span><span class="param-opt">[Optional]</span><span class="param-comment">// NSFW, COPYRIGHT, VIOLENCE, SPAM</span></div>
                <div class="param-row"><span class="param-name">strictMode</span><span class="param-type">boolean</span><span class="param-opt">[Optional]</span><span class="param-comment">// strict mode mein low confidence bhi block hota hai</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">2</span> flagVideo(FlagVideoRequest)</div>
                <div class="method-return">Returns: <code>void</code></div>
                <div class="params-title">Parameters (FlagVideoRequest):</div>
                <div class="param-row"><span class="param-name">videoId</span><span class="param-type">Long</span><span class="param-comment">// kaunsa video report ho raha hai</span></div>
                <div class="param-row"><span class="param-name">reportedBy</span><span class="param-type">Long</span><span class="param-comment">// report karne wale user ka ID</span></div>
                <div class="param-row"><span class="param-name">reason</span><span class="param-type">String</span><span class="param-comment">// kyun report kiya &mdash; NSFW, spam, copyright etc.</span></div>
                <div class="param-row"><span class="param-name">description</span><span class="param-type">String</span><span class="param-opt">[Optional]</span><span class="param-comment">// detail mein batao kya issue hai</span></div>
                <div class="param-row"><span class="param-name">timestamp</span><span class="param-type">int</span><span class="param-opt">[Optional]</span><span class="param-comment">// video mein kaunse second pe violation hai</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">3</span> reviewFlaggedVideo(ReviewRequest)</div>
                <div class="method-return">Returns: <code>void</code></div>
                <div class="params-title">Parameters (ReviewRequest):</div>
                <div class="param-row"><span class="param-name">videoId</span><span class="param-type">Long</span><span class="param-comment">// flagged video ka ID</span></div>
                <div class="param-row"><span class="param-name">decision</span><span class="param-type">ModerationDecision</span><span class="param-comment">// APPROVE, REJECT, AGE_RESTRICT</span></div>
                <div class="param-row"><span class="param-name">reviewerId</span><span class="param-type">Long</span><span class="param-comment">// admin/moderator ka ID jo review kar raha hai</span></div>
                <div class="param-row"><span class="param-name">notes</span><span class="param-type">String</span><span class="param-opt">[Optional]</span><span class="param-comment">// moderator ke internal notes</span></div>
            </div>
        </div>
        <div class="service-card">
            <h3>RecommendationService</h3>
            <p class="svc-desc">User ki watch history aur preferences se personalized video suggestions deta hai &mdash; trending aur similar videos bhi</p>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">1</span> getRecommendations(RecommendationRequest)</div>
                <div class="method-return">Returns: <code>List&lt;Video&gt;</code></div>
                <div class="params-title">Parameters (RecommendationRequest):</div>
                <div class="param-row"><span class="param-name">userId</span><span class="param-type">Long</span><span class="param-comment">// kis user ke liye recommendations generate karni hain</span></div>
                <div class="param-row"><span class="param-name">limit</span><span class="param-type">int</span><span class="param-opt">[Optional]</span><span class="param-comment">// kitne videos recommend karne hain (default 20)</span></div>
                <div class="param-row"><span class="param-name">excludeWatched</span><span class="param-type">boolean</span><span class="param-opt">[Optional]</span><span class="param-comment">// already dekhe hue videos hatao (default true)</span></div>
                <div class="param-row"><span class="param-name">category</span><span class="param-type">Category</span><span class="param-opt">[Optional]</span><span class="param-comment">// specific category filter lagao</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">2</span> getTrending(TrendingRequest)</div>
                <div class="method-return">Returns: <code>List&lt;Video&gt;</code></div>
                <div class="params-title">Parameters (TrendingRequest):</div>
                <div class="param-row"><span class="param-name">region</span><span class="param-type">String</span><span class="param-comment">// konse region ke trending videos (IN, US, UK etc.)</span></div>
                <div class="param-row"><span class="param-name">limit</span><span class="param-type">int</span><span class="param-comment">// kitne trending videos chahiye</span></div>
                <div class="param-row"><span class="param-name">timeWindow</span><span class="param-type">String</span><span class="param-opt">[Optional]</span><span class="param-comment">// 1h, 24h, 7d &mdash; kaunsa time period (default 24h)</span></div>
                <div class="param-row"><span class="param-name">category</span><span class="param-type">Category</span><span class="param-opt">[Optional]</span><span class="param-comment">// category wise trending</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">3</span> getSimilar(SimilarVideosRequest)</div>
                <div class="method-return">Returns: <code>List&lt;Video&gt;</code></div>
                <div class="params-title">Parameters (SimilarVideosRequest):</div>
                <div class="param-row"><span class="param-name">videoId</span><span class="param-type">Long</span><span class="param-comment">// current video ke similar videos dhundho</span></div>
                <div class="param-row"><span class="param-name">limit</span><span class="param-type">int</span><span class="param-comment">// kitne similar videos chahiye</span></div>
                <div class="param-row"><span class="param-name">sameChannel</span><span class="param-type">boolean</span><span class="param-opt">[Optional]</span><span class="param-comment">// same channel ke videos bhi include karo ya nahi</span></div>
            </div>
        </div>
    </div>
</div>

<div class="section theme-green">
    <div class="section-title"><span class="section-num">7</span>Key Architecture</div>
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
    <div class="section-title"><span class="section-num">8</span>Design Patterns Used</div>
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
    <div class="section-title"><span class="section-num">9</span>Sequence Flow</div>
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
    <div class="section-title"><span class="section-num">10</span>Capacity Estimation</div>
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
