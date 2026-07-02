export default {
  title: "YouTube &mdash; Low Level Design",
  subtitle: "Complete LLD for Java Spring Boot Interview &mdash; Upload, Stream, Recommend &amp; Monetize",
  subtitleColor: "#ffcdd2",
  headerGradient: "linear-gradient(135deg,#cc0000,#ff0000,#ff4444)",
  footerText: "YouTube &mdash; LLD",
  content: `
<div class="section theme-green">
    <div class="section-title"><span class="section-num">1</span>Functional Requirements</div>
    <div class="req-grid">
        <div class="req-pill"><span class="num">1</span><div class="fr-content"><div class="fr-en">User Registration &amp; Login (OAuth / Email / Phone)</div><div class="fr-hi">Ye requirement isliye hai taki user securely register aur login kar sake &mdash; Google OAuth se one-click login, email/phone se bhi signup hota hai. Bina login ke user videos upload nahi kar sakta, comments nahi kar sakta, aur personalized recommendations nahi milte</div></div></div>
        <div class="req-pill"><span class="num">2</span><div class="fr-content"><div class="fr-en">Video Upload (Chunked / Multipart / Resumable)</div><div class="fr-hi">Ye poore system ka entry point hai &mdash; creators ke videos GB me hote hai isliye chunked/resumable upload zaroori hai. Agar 2GB video ka upload beech me fail ho jaaye toh poora dobara nahi karna padega, jahan ruka tha wahi se resume hoga TUS protocol se</div></div></div>
        <div class="req-pill"><span class="num">3</span><div class="fr-content"><div class="fr-en">Transcoding Pipeline (Multi-Resolution + Codec)</div><div class="fr-hi">Ye sabse critical backend requirement hai &mdash; creator 4K me upload karta hai lekin har viewer ke paas fast internet nahi hai. Same video ko 144p, 360p, 720p, 1080p, 4K me convert karna padta hai with H.264/VP9/AV1 codecs. FFmpeg workers Kafka se fan-out hote hai</div></div></div>
        <div class="req-pill"><span class="num">4</span><div class="fr-content"><div class="fr-en">Channel Management (Create, Customize, Analytics)</div><div class="fr-hi">Channel creator ki identity hai YouTube pe &mdash; channel name, description, banner, profile pic sab customizable hai. Creator dashboard pe analytics dikhta hai &mdash; views, watch time, subscriber growth, revenue. Bina channel ke video upload nahi ho sakta</div></div></div>
        <div class="req-pill"><span class="num">5</span><div class="fr-content"><div class="fr-en">Channel Subscriptions &amp; Bell Notifications</div><div class="fr-hi">Subscribe se user apne favorite creators ka content miss nahi karta &mdash; naya video upload hote hi subscriber ko notification jaati hai. Bell icon se "All notifications" on karna padta hai warna sirf personalized notifications aati hai</div></div></div>
        <div class="req-pill"><span class="num">6</span><div class="fr-content"><div class="fr-en">Video Search with Filters &amp; Autocomplete</div><div class="fr-hi">Billions of videos me se user ko content dhundhne ka tarika chahiye &mdash; Elasticsearch se full-text search hota hai with fuzzy matching. Filters se narrow down karo &mdash; upload date, duration, type (video/channel/playlist), sort by relevance/views/date</div></div></div>
        <div class="req-pill"><span class="num">7</span><div class="fr-content"><div class="fr-en">Like / Dislike &amp; Engagement Tracking</div><div class="fr-hi">Like/dislike se video ki quality ka signal milta hai &mdash; YouTube algorithm like ratio se decide karta hai ki video ko recommend karna hai ya nahi. Dislike count public se hata diya hai but internally algorithm use karta hai engagement scoring ke liye</div></div></div>
        <div class="req-pill"><span class="num">8</span><div class="fr-content"><div class="fr-en">Comments &amp; Threaded Replies</div><div class="fr-hi">Comments se community banti hai video pe &mdash; nested replies support hai (parent_id se tree structure). Comment pe like, pin, heart by creator, sort by top/newest. Spam detection aur profanity filter bhi lagta hai automatically</div></div></div>
        <div class="req-pill"><span class="num">9</span><div class="fr-content"><div class="fr-en">Playlists (Create, Add, Reorder, Share)</div><div class="fr-hi">Playlists se user videos organize kar sakta hai &mdash; Watch Later, Favorites, custom playlists. Public playlist share ho sakti hai. Autoplay next video playlist se hota hai. Creator bhi apne channel pe playlists banata hai series ke liye</div></div></div>
        <div class="req-pill"><span class="num">10</span><div class="fr-content"><div class="fr-en">Watch History &amp; Resume Playback</div><div class="fr-hi">User ne 2 ghante ki video 45 min pe pause ki &mdash; kal wapas aaye toh wahi se start hona chahiye. Watch history se "Continue Watching" banta hai. Progress har 10 sec pe save hota hai Redis me, batch me DB me flush hota hai</div></div></div>
        <div class="req-pill"><span class="num">11</span><div class="fr-content"><div class="fr-en">Recommendation Engine (Homepage + Sidebar)</div><div class="fr-hi">YouTube ka 70% traffic recommendations se aata hai &mdash; homepage pe personalized suggestions, video ke side me "Up Next" queue. Collaborative filtering + content-based + deep learning model use hota hai. Watch time optimization hai, click-through nahi</div></div></div>
        <div class="req-pill"><span class="num">12</span><div class="fr-content"><div class="fr-en">Live Streaming &amp; Live Chat</div><div class="fr-hi">Live streaming se creator real-time me audience se connect karta hai &mdash; gaming, events, Q&amp;A ke liye. RTMP se ingest hota hai, HLS me convert hoke deliver hota hai. Live chat me Super Chat se paid messages highlight hote hai</div></div></div>
        <div class="req-pill"><span class="num">13</span><div class="fr-content"><div class="fr-en">Monetization (Ads, Premium, Super Chat, Memberships)</div><div class="fr-hi">YouTube ka revenue model &mdash; pre-roll, mid-roll, post-roll ads insert hote hai. YouTube Premium se ad-free experience milta hai. Super Chat live stream me paid messages hai. Channel memberships se exclusive content access milta hai. Creator ko 55% ad revenue milta hai</div></div></div>
        <div class="req-pill"><span class="num">14</span><div class="fr-content"><div class="fr-en">Notifications (Push, Email, In-App Bell)</div><div class="fr-hi">Subscriber ko naye video ki notification turant milni chahiye &mdash; push notification mobile pe, bell icon in-app pe, email digest weekly. Notification preferences customizable hai &mdash; all, personalized, none. Millions of subscribers ko fan-out karna padta hai</div></div></div>
        <div class="req-pill"><span class="num">15</span><div class="fr-content"><div class="fr-en">YouTube Shorts (Vertical Short-Form Videos)</div><div class="fr-hi">TikTok competition ke liye Shorts feature &mdash; max 60 sec vertical videos. Separate feed hai swipe-based. Different transcoding pipeline (vertical aspect ratio). Shorts shelf homepage pe dikhta hai. Creator ke liye quick content banane ka easy way hai</div></div></div>
        <div class="req-pill"><span class="num">16</span><div class="fr-content"><div class="fr-en">Community Posts &amp; Polls</div><div class="fr-hi">Creators text, images, polls share kar sakte hai bina video banaye &mdash; subscriber engagement badhane ke liye. Polls se audience feedback milta hai. Community tab channel pe dikhta hai. Ye creator-viewer relationship strengthen karta hai</div></div></div>
    </div>
</div>

<!-- ============ NON-FUNCTIONAL REQUIREMENTS ============ -->
<div class="section theme-pink">
    <div class="section-title"><span class="section-num">2</span>Non-Functional Requirements</div>
    <div class="req-grid">
        <div class="req-pill"><span class="num">1</span><div class="nfr-content"><div class="nfr-en">Low Latency &mdash; Video playback must start within 2 seconds</div><div class="nfr-hi">Video start &lt; 2 sec me hona chahiye &mdash; user buffering dekhke chala jaayega, first byte time critical hai</div></div></div>
        <div class="req-pill"><span class="num">2</span><div class="nfr-content"><div class="nfr-en">High Availability &mdash; 99.99% uptime globally (52 min downtime/year)</div><div class="nfr-hi">99.99% uptime hona chahiye &mdash; YouTube 1 ghanta bhi down ho to worldwide impact, billions depend karte hai</div></div></div>
        <div class="req-pill"><span class="num">3</span><div class="nfr-content"><div class="nfr-en">Scalability &mdash; Handle 2B+ monthly active users, 500hrs video/min upload</div><div class="nfr-hi">2B+ MAU handle karne padenge &mdash; har minute 500 ghante ka video upload hota hai, horizontal scaling mandatory hai</div></div></div>
        <div class="req-pill"><span class="num">4</span><div class="nfr-content"><div class="nfr-en">CDN &mdash; Global edge caching, content served from nearest PoP</div><div class="nfr-hi">CDN se global edge caching karo taki buffering zero ho &mdash; India ka user India ke edge server se video dekhe, US se nahi</div></div></div>
        <div class="req-pill"><span class="num">5</span><div class="nfr-content"><div class="nfr-en">Adaptive Bitrate &mdash; Quality auto-adjusts based on network speed</div><div class="nfr-hi">Network ke hisaab se quality auto-adjust honi chahiye &mdash; slow net pe 360p dikhe, fast pe 1080p, user ko manual change na karna pade</div></div></div>
        <div class="req-pill"><span class="num">6</span><div class="nfr-content"><div class="nfr-en">Fault Tolerance &mdash; Graceful degradation, no data loss on failures</div><div class="nfr-hi">Server crash hone pe bhi video, comments, watch history lost nahi hona chahiye &mdash; replication + WAL se data safe rehta hai</div></div></div>
    </div>
</div>

<!-- ============ ENUMS ============ -->
<div class="section theme-purple">
    <div class="section-title"><span class="section-num">3</span>Enums</div>
    <div class="enum-grid">
        <div class="enum-card"><h3>VideoStatus</h3><div class="enum-val">UPLOADING</div><div class="enum-val">PROCESSING</div><div class="enum-val">TRANSCODING</div><div class="enum-val">READY</div><div class="enum-val">FAILED</div><div class="enum-val">REMOVED</div><div class="enum-val">BLOCKED</div></div>
        <div class="enum-card"><h3>Resolution</h3><div class="enum-val">R_144P</div><div class="enum-val">R_240P</div><div class="enum-val">R_360P</div><div class="enum-val">R_480P</div><div class="enum-val">R_720P</div><div class="enum-val">R_1080P</div><div class="enum-val">R_1440P</div><div class="enum-val">R_2160P (4K)</div></div>
        <div class="enum-card"><h3>Visibility</h3><div class="enum-val">PUBLIC</div><div class="enum-val">UNLISTED</div><div class="enum-val">PRIVATE</div><div class="enum-val">SCHEDULED</div><div class="enum-val">MEMBERS_ONLY</div></div>
        <div class="enum-card"><h3>Category</h3><div class="enum-val">MUSIC</div><div class="enum-val">GAMING</div><div class="enum-val">EDUCATION</div><div class="enum-val">ENTERTAINMENT</div><div class="enum-val">SPORTS</div><div class="enum-val">NEWS</div><div class="enum-val">TECH</div><div class="enum-val">VLOGS</div></div>
        <div class="enum-card"><h3>AdType</h3><div class="enum-val">PRE_ROLL</div><div class="enum-val">MID_ROLL</div><div class="enum-val">POST_ROLL</div><div class="enum-val">BANNER_OVERLAY</div><div class="enum-val">SPONSORED_CARD</div><div class="enum-val">BUMPER_6S</div></div>
        <div class="enum-card"><h3>CommentSort</h3><div class="enum-val">TOP_COMMENTS</div><div class="enum-val">NEWEST_FIRST</div></div>
        <div class="enum-card"><h3>PlaylistType</h3><div class="enum-val">NORMAL</div><div class="enum-val">WATCH_LATER</div><div class="enum-val">LIKED_VIDEOS</div><div class="enum-val">HISTORY</div><div class="enum-val">MIX</div></div>
        <div class="enum-card"><h3>SubscriptionTier</h3><div class="enum-val">FREE</div><div class="enum-val">PREMIUM</div><div class="enum-val">PREMIUM_FAMILY</div><div class="enum-val">PREMIUM_STUDENT</div><div class="enum-val">MUSIC</div></div>
    </div>
</div>

<!-- ============ SERVICE LLD ============ -->
<div class="section theme-yellow">
    <div class="section-title"><span class="section-num">4</span>Service LLD</div>
    <div class="service-grid">
        <div class="service-card">
            <h3>AuthService</h3>
            <p class="svc-desc">User registration, login, OAuth aur session management handle karta hai &mdash; Google OAuth se one-click login, JWT token based authentication</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">AuthService</span> {

    <span class="cm">// email + password se register karta hai</span>
    <span class="tp">User</span> <span class="fn">register</span>(<span class="tp">String</span> email, <span class="tp">String</span> password,
        <span class="tp">String</span> displayName)

    <span class="cm">// login karke JWT token return karta hai</span>
    <span class="tp">AuthToken</span> <span class="fn">login</span>(<span class="tp">String</span> email, <span class="tp">String</span> password)

    <span class="cm">// Google/Apple OAuth login &mdash; one-click sign in</span>
    <span class="tp">AuthToken</span> <span class="fn">oauthLogin</span>(<span class="tp">String</span> provider,
        <span class="tp">String</span> authCode)

    <span class="cm">// JWT token refresh karta hai expiry se pehle</span>
    <span class="tp">AuthToken</span> <span class="fn">refreshToken</span>(<span class="tp">String</span> refreshToken)

    <span class="cm">// logout aur session invalidate</span>
    <span class="kw">void</span> <span class="fn">logout</span>(<span class="tp">Long</span> userId, <span class="tp">String</span> deviceId)
}
</pre></div>
        </div>
        <div class="service-card">
            <h3>VideoUploadService</h3>
            <p class="svc-desc">Video file ko S3 pe chunked/resumable upload karta hai &mdash; TUS protocol se large files reliably upload hote hai, metadata save hota hai DB me</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">VideoUploadService</span> {

    <span class="cm">// upload session initiate karta hai &mdash; presigned URL milta hai</span>
    <span class="tp">UploadSession</span> <span class="fn">initiateUpload</span>(<span class="tp">Long</span> channelId,
        <span class="tp">String</span> title, <span class="tp">String</span> description,
        <span class="tp">Visibility</span> visibility, <span class="tp">List&lt;String&gt;</span> tags,
        <span class="tp">Category</span> category, <span class="tp">long</span> fileSizeBytes)

    <span class="cm">// chunk upload karta hai &mdash; resumable hai network fail pe</span>
    <span class="tp">ChunkResult</span> <span class="fn">uploadChunk</span>(<span class="tp">String</span> uploadId,
        <span class="tp">int</span> chunkNumber, <span class="tp">byte[]</span> chunkData,
        <span class="tp">String</span> checksum)

    <span class="cm">// saare chunks assemble karke final video banata hai</span>
    <span class="tp">Video</span> <span class="fn">completeUpload</span>(<span class="tp">String</span> uploadId)

    <span class="cm">// upload progress percentage dekhne ke liye</span>
    <span class="tp">UploadProgress</span> <span class="fn">getProgress</span>(<span class="tp">String</span> uploadId)

    <span class="cm">// file format, size, codec validate karta hai</span>
    <span class="tp">ValidationResult</span> <span class="fn">validateVideo</span>(<span class="tp">String</span> uploadId,
        <span class="tp">long</span> maxSizeBytes, <span class="tp">List&lt;String&gt;</span> allowedFormats)
}
</pre></div>
        </div>
        <div class="service-card">
            <h3>TranscodingService</h3>
            <p class="svc-desc">Video ko multiple quality levels (144p se 4K) me convert karta hai &mdash; FFmpeg workers Kafka se fan-out hote hai, HLS segments generate hote hai</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">TranscodingService</span> {

    <span class="cm">// video ko multiple resolutions me transcode karta hai</span>
    <span class="kw">void</span> <span class="fn">submitTranscodeJob</span>(<span class="tp">Long</span> videoId,
        <span class="tp">String</span> inputS3Key,
        <span class="tp">List&lt;Resolution&gt;</span> targetResolutions,
        <span class="tp">Codec</span> codec, <span class="tp">int</span> priority)

    <span class="cm">// transcoding ka current status check karo</span>
    <span class="tp">TranscodeProgress</span> <span class="fn">getStatus</span>(<span class="tp">Long</span> videoId)

    <span class="cm">// fail hui resolution ko retry karo &mdash; max 3 attempts</span>
    <span class="kw">void</span> <span class="fn">retryTranscode</span>(<span class="tp">Long</span> videoId,
        <span class="tp">Resolution</span> resolution, <span class="tp">int</span> maxRetries)

    <span class="cm">// HLS .m3u8 manifest + .ts segments generate karta hai</span>
    <span class="tp">ManifestResult</span> <span class="fn">generateHlsManifest</span>(<span class="tp">Long</span> videoId,
        <span class="tp">List&lt;Resolution&gt;</span> availableResolutions)

    <span class="cm">// thumbnail auto-generate karta hai key frames se</span>
    <span class="tp">List&lt;String&gt;</span> <span class="fn">generateThumbnails</span>(<span class="tp">Long</span> videoId,
        <span class="tp">int</span> count, <span class="tp">List&lt;Integer&gt;</span> timestamps)
}
</pre></div>
        </div>
        <div class="service-card">
            <h3>StreamingService</h3>
            <p class="svc-desc">Viewer ko nearest CDN server se video deliver karta hai &mdash; HLS adaptive bitrate streaming, signed URLs se hotlink protection, DRM support</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">StreamingService</span> {

    <span class="cm">// HLS manifest URL return karta hai video stream ke liye</span>
    <span class="tp">StreamResponse</span> <span class="fn">getStream</span>(<span class="tp">Long</span> videoId,
        <span class="tp">Long</span> userId, <span class="tp">Resolution</span> preferredQuality,
        <span class="tp">String</span> deviceType)

    <span class="cm">// time-limited signed URL generate karta hai CDN ke liye</span>
    <span class="tp">String</span> <span class="fn">generateSignedUrl</span>(<span class="tp">Long</span> videoId,
        <span class="tp">Long</span> userId, <span class="tp">int</span> expiryMinutes)

    <span class="cm">// bandwidth ke hisaab se best quality select karta hai</span>
    <span class="tp">Resolution</span> <span class="fn">selectAdaptiveQuality</span>(<span class="tp">Long</span> userId,
        <span class="tp">double</span> bandwidthMbps, <span class="tp">double</span> bufferHealth)

    <span class="cm">// view count record karta hai with deduplication</span>
    <span class="kw">void</span> <span class="fn">recordView</span>(<span class="tp">Long</span> videoId, <span class="tp">Long</span> userId,
        <span class="tp">String</span> ipAddress, <span class="tp">int</span> watchDurationSec)
}
</pre></div>
        </div>
        <div class="service-card">
            <h3>ChannelService</h3>
            <p class="svc-desc">Channel create, customize aur analytics handle karta hai &mdash; channel banner, description, links, verification badge sab manage karta hai</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">ChannelService</span> {

    <span class="cm">// naya channel create karta hai user ke liye</span>
    <span class="tp">Channel</span> <span class="fn">createChannel</span>(<span class="tp">Long</span> userId,
        <span class="tp">String</span> name, <span class="tp">String</span> handle,
        <span class="tp">String</span> description)

    <span class="cm">// channel details update karta hai &mdash; banner, links etc</span>
    <span class="tp">Channel</span> <span class="fn">updateChannel</span>(<span class="tp">Long</span> channelId,
        <span class="tp">UpdateChannelRequest</span> request)

    <span class="cm">// channel ki public profile fetch karta hai</span>
    <span class="tp">ChannelProfile</span> <span class="fn">getChannel</span>(<span class="tp">String</span> handle)

    <span class="cm">// creator dashboard analytics &mdash; views, watch time, revenue</span>
    <span class="tp">ChannelAnalytics</span> <span class="fn">getAnalytics</span>(<span class="tp">Long</span> channelId,
        <span class="tp">DateRange</span> range)

    <span class="cm">// channel ke saare videos paginated fetch karta hai</span>
    <span class="tp">Page&lt;Video&gt;</span> <span class="fn">getChannelVideos</span>(<span class="tp">Long</span> channelId,
        <span class="tp">String</span> sortBy, <span class="tp">int</span> page, <span class="tp">int</span> size)
}
</pre></div>
        </div>
        <div class="service-card">
            <h3>SubscriptionService</h3>
            <p class="svc-desc">Channel subscribe/unsubscribe handle karta hai &mdash; bell notification preference bhi set karta hai (all/personalized/none)</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">SubscriptionService</span> {

    <span class="cm">// channel ko subscribe karta hai</span>
    <span class="tp">Subscription</span> <span class="fn">subscribe</span>(<span class="tp">Long</span> userId,
        <span class="tp">Long</span> channelId)

    <span class="cm">// channel se unsubscribe karta hai</span>
    <span class="kw">void</span> <span class="fn">unsubscribe</span>(<span class="tp">Long</span> userId, <span class="tp">Long</span> channelId)

    <span class="cm">// bell notification preference set karta hai</span>
    <span class="kw">void</span> <span class="fn">setNotificationPref</span>(<span class="tp">Long</span> userId,
        <span class="tp">Long</span> channelId, <span class="tp">String</span> pref)

    <span class="cm">// user ki subscriptions list paginated fetch</span>
    <span class="tp">Page&lt;Channel&gt;</span> <span class="fn">getSubscriptions</span>(<span class="tp">Long</span> userId,
        <span class="tp">int</span> page, <span class="tp">int</span> size)

    <span class="cm">// check karo user ne channel subscribe kiya hai ya nahi</span>
    <span class="tp">boolean</span> <span class="fn">isSubscribed</span>(<span class="tp">Long</span> userId,
        <span class="tp">Long</span> channelId)

    <span class="cm">// channel ke subscribers ki list (creator dashboard)</span>
    <span class="tp">Page&lt;User&gt;</span> <span class="fn">getSubscribers</span>(<span class="tp">Long</span> channelId,
        <span class="tp">int</span> page, <span class="tp">int</span> size)
}
</pre></div>
        </div>
        <div class="service-card">
            <h3>CommentService</h3>
            <p class="svc-desc">Video pe comments aur threaded replies handle karta hai &mdash; like, pin, heart by creator, spam detection sab yahi karta hai</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">CommentService</span> {

    <span class="cm">// video pe comment karta hai</span>
    <span class="tp">Comment</span> <span class="fn">addComment</span>(<span class="tp">Long</span> videoId,
        <span class="tp">Long</span> userId, <span class="tp">String</span> content)

    <span class="cm">// comment pe reply karta hai (nested/threaded)</span>
    <span class="tp">Comment</span> <span class="fn">replyToComment</span>(<span class="tp">Long</span> commentId,
        <span class="tp">Long</span> userId, <span class="tp">String</span> content)

    <span class="cm">// video ke comments paginated fetch karta hai</span>
    <span class="tp">Page&lt;Comment&gt;</span> <span class="fn">getComments</span>(<span class="tp">Long</span> videoId,
        <span class="tp">CommentSort</span> sortBy, <span class="tp">int</span> page, <span class="tp">int</span> size)

    <span class="cm">// comment delete karta hai (owner ya creator)</span>
    <span class="kw">void</span> <span class="fn">deleteComment</span>(<span class="tp">Long</span> commentId,
        <span class="tp">Long</span> userId)

    <span class="cm">// creator apne video pe comment pin karta hai</span>
    <span class="kw">void</span> <span class="fn">pinComment</span>(<span class="tp">Long</span> commentId,
        <span class="tp">Long</span> channelOwnerId)

    <span class="cm">// creator comment pe heart deta hai</span>
    <span class="kw">void</span> <span class="fn">heartComment</span>(<span class="tp">Long</span> commentId,
        <span class="tp">Long</span> channelOwnerId)

    <span class="cm">// comment pe like karta hai</span>
    <span class="kw">void</span> <span class="fn">likeComment</span>(<span class="tp">Long</span> commentId, <span class="tp">Long</span> userId)
}
</pre></div>
        </div>
        <div class="service-card">
            <h3>SearchService</h3>
            <p class="svc-desc">Elasticsearch pe full-text search karta hai &mdash; videos, channels, playlists me fuzzy matching + autocomplete + filters support</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">SearchService</span> {

    <span class="cm">// videos, channels, playlists me fulltext search</span>
    <span class="tp">SearchResult</span> <span class="fn">search</span>(<span class="tp">String</span> query,
        <span class="tp">SearchFilters</span> filters, <span class="tp">String</span> type,
        <span class="tp">int</span> page, <span class="tp">int</span> size, <span class="tp">String</span> sortBy)

    <span class="cm">// type karte waqt autocomplete suggestions deta hai</span>
    <span class="tp">List&lt;String&gt;</span> <span class="fn">autoSuggest</span>(<span class="tp">String</span> prefix,
        <span class="tp">int</span> limit, <span class="tp">String</span> region)

    <span class="cm">// naya video Elasticsearch index me add karta hai</span>
    <span class="kw">void</span> <span class="fn">indexVideo</span>(<span class="tp">Video</span> video)

    <span class="cm">// trending searches return karta hai region wise</span>
    <span class="tp">List&lt;String&gt;</span> <span class="fn">getTrendingSearches</span>(<span class="tp">String</span> region,
        <span class="tp">int</span> limit)
}
</pre></div>
        </div>
        <div class="service-card">
            <h3>RecommendationService</h3>
            <p class="svc-desc">User ki watch history se personalized video suggestions deta hai &mdash; homepage feed, sidebar "Up Next", trending, Shorts feed sab yahi generate karta hai</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">RecommendationService</span> {

    <span class="cm">// homepage ke liye personalized feed return karta hai</span>
    <span class="tp">List&lt;Video&gt;</span> <span class="fn">getHomeFeed</span>(<span class="tp">Long</span> userId,
        <span class="tp">int</span> limit, <span class="tp">String</span> region)

    <span class="cm">// video ke side me "Up Next" queue return karta hai</span>
    <span class="tp">List&lt;Video&gt;</span> <span class="fn">getUpNext</span>(<span class="tp">Long</span> videoId,
        <span class="tp">Long</span> userId, <span class="tp">int</span> limit)

    <span class="cm">// region wise trending videos fetch karta hai</span>
    <span class="tp">List&lt;Video&gt;</span> <span class="fn">getTrending</span>(<span class="tp">String</span> region,
        <span class="tp">Category</span> category, <span class="tp">int</span> limit)

    <span class="cm">// Shorts feed ke liye vertical videos return karta hai</span>
    <span class="tp">List&lt;Video&gt;</span> <span class="fn">getShortsFeed</span>(<span class="tp">Long</span> userId,
        <span class="tp">int</span> limit)

    <span class="cm">// subscription feed &mdash; subscribed channels ke latest videos</span>
    <span class="tp">Page&lt;Video&gt;</span> <span class="fn">getSubscriptionFeed</span>(<span class="tp">Long</span> userId,
        <span class="tp">int</span> page, <span class="tp">int</span> size)
}
</pre></div>
        </div>
        <div class="service-card">
            <h3>MonetizationService</h3>
            <p class="svc-desc">Ad insertion, revenue tracking, YouTube Premium, Super Chat aur channel memberships handle karta hai &mdash; creator ko 55% ad revenue milta hai</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">MonetizationService</span> {

    <span class="cm">// video ke liye ad placement decide karta hai</span>
    <span class="tp">List&lt;AdPlacement&gt;</span> <span class="fn">getAdPlacements</span>(<span class="tp">Long</span> videoId,
        <span class="tp">Long</span> userId, <span class="tp">int</span> videoDurationSec)

    <span class="cm">// ad serve karta hai &mdash; targeting ke saath</span>
    <span class="tp">Ad</span> <span class="fn">serveAd</span>(<span class="tp">Long</span> userId, <span class="tp">AdType</span> adType,
        <span class="tp">Long</span> videoId, <span class="tp">String</span> region)

    <span class="cm">// ad view/click record karta hai revenue ke liye</span>
    <span class="kw">void</span> <span class="fn">recordAdEvent</span>(<span class="tp">Long</span> adId, <span class="tp">Long</span> userId,
        <span class="tp">String</span> eventType, <span class="tp">int</span> watchedSeconds)

    <span class="cm">// creator ka revenue dashboard &mdash; estimated earnings</span>
    <span class="tp">RevenueReport</span> <span class="fn">getCreatorRevenue</span>(<span class="tp">Long</span> channelId,
        <span class="tp">DateRange</span> range)

    <span class="cm">// Premium user hai to ads skip karo</span>
    <span class="tp">boolean</span> <span class="fn">isPremiumUser</span>(<span class="tp">Long</span> userId)

    <span class="cm">// Super Chat payment process karta hai live stream me</span>
    <span class="tp">SuperChat</span> <span class="fn">processSuperChat</span>(<span class="tp">Long</span> userId,
        <span class="tp">Long</span> liveStreamId, <span class="tp">String</span> message,
        <span class="tp">BigDecimal</span> amount, <span class="tp">String</span> currency)
}
</pre></div>
        </div>
        <div class="service-card">
            <h3>NotificationService</h3>
            <p class="svc-desc">New video upload, comment reply, like milne pe notification bhejta hai &mdash; push (FCM/APNs), in-app bell, email digest support karta hai</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">NotificationService</span> {

    <span class="cm">// subscriber ko naye video ki notification bhejta hai</span>
    <span class="kw">void</span> <span class="fn">notifySubscribers</span>(<span class="tp">Long</span> channelId,
        <span class="tp">Long</span> videoId, <span class="tp">String</span> title)

    <span class="cm">// individual notification bhejta hai (comment, like etc)</span>
    <span class="kw">void</span> <span class="fn">sendNotification</span>(<span class="tp">Long</span> targetUserId,
        <span class="tp">String</span> type, <span class="tp">String</span> title,
        <span class="tp">String</span> body, <span class="tp">String</span> deepLink)

    <span class="cm">// user ke notifications paginated fetch karta hai</span>
    <span class="tp">Page&lt;Notification&gt;</span> <span class="fn">getNotifications</span>(
        <span class="tp">Long</span> userId, <span class="tp">int</span> page, <span class="tp">int</span> size)

    <span class="cm">// sab notifications read mark karta hai</span>
    <span class="kw">void</span> <span class="fn">markAllRead</span>(<span class="tp">Long</span> userId)

    <span class="cm">// unread count return karta hai bell icon ke liye</span>
    <span class="tp">int</span> <span class="fn">getUnreadCount</span>(<span class="tp">Long</span> userId)
}
</pre></div>
        </div>
        <div class="service-card">
            <h3>PlaylistService</h3>
            <p class="svc-desc">Playlists create, manage, reorder karta hai &mdash; Watch Later, Liked Videos, custom playlists sab yahi handle karta hai</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">PlaylistService</span> {

    <span class="cm">// nayi playlist create karta hai</span>
    <span class="tp">Playlist</span> <span class="fn">createPlaylist</span>(<span class="tp">Long</span> userId,
        <span class="tp">String</span> title, <span class="tp">String</span> description,
        <span class="tp">Visibility</span> visibility)

    <span class="cm">// playlist me video add karta hai</span>
    <span class="kw">void</span> <span class="fn">addVideo</span>(<span class="tp">Long</span> playlistId,
        <span class="tp">Long</span> videoId, <span class="tp">Long</span> userId)

    <span class="cm">// playlist se video remove karta hai</span>
    <span class="kw">void</span> <span class="fn">removeVideo</span>(<span class="tp">Long</span> playlistId,
        <span class="tp">Long</span> videoId, <span class="tp">Long</span> userId)

    <span class="cm">// playlist ke videos paginated fetch karta hai</span>
    <span class="tp">Page&lt;Video&gt;</span> <span class="fn">getPlaylistVideos</span>(<span class="tp">Long</span> playlistId,
        <span class="tp">int</span> page, <span class="tp">int</span> size)

    <span class="cm">// videos ka order change karta hai drag-drop se</span>
    <span class="kw">void</span> <span class="fn">reorderVideos</span>(<span class="tp">Long</span> playlistId,
        <span class="tp">List&lt;Long&gt;</span> videoIdOrder)

    <span class="cm">// user ki saari playlists return karta hai</span>
    <span class="tp">List&lt;Playlist&gt;</span> <span class="fn">getUserPlaylists</span>(<span class="tp">Long</span> userId)
}
</pre></div>
        </div>
    </div>
</div>

<!-- ============ APIs ============ -->
<div class="section theme-teal">
    <div class="section-title"><span class="section-num">5</span>APIs (with Request / Response)</div>
    <div class="api-grid">
        <div class="api-card">
            <div class="api-header"><span class="api-method method-post">POST</span><span class="api-path">/api/v1/videos/upload/initiate</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Request</div>{
  <span class="key">"channelId"</span>: <span class="val">1001</span>,
  <span class="key">"title"</span>: <span class="val">"Spring Boot Tutorial #5"</span>,
  <span class="key">"description"</span>: <span class="val">"Learn microservices..."</span>,
  <span class="key">"visibility"</span>: <span class="val">"PUBLIC"</span>,
  <span class="key">"tags"</span>: <span class="val">["java", "spring-boot"]</span>,
  <span class="key">"category"</span>: <span class="val">"EDUCATION"</span>,
  <span class="key">"fileSizeBytes"</span>: <span class="val">2147483648</span>
}</div>
                <div class="api-json"><div class="label">Response 201</div>{
  <span class="key">"uploadId"</span>: <span class="val">"upl-abc123"</span>,
  <span class="key">"presignedUrl"</span>: <span class="val">"https://s3.../upload"</span>,
  <span class="key">"chunkSize"</span>: <span class="val">5242880</span>,
  <span class="key">"totalChunks"</span>: <span class="val">410</span>,
  <span class="key">"expiresIn"</span>: <span class="val">3600</span>
}</div>
            </div>
            <div class="api-note">Upload session initiate karta hai &mdash; 2GB file ko 5MB chunks me divide karta hai, presigned URL milta hai S3 ke liye. Resumable hai &mdash; network fail pe jahan ruka tha wahi se continue</div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-get">GET</span><span class="api-path">/api/v1/videos/{videoId}</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Response 200</div>{
  <span class="key">"videoId"</span>: <span class="val">5001</span>,
  <span class="key">"title"</span>: <span class="val">"Spring Boot Tutorial #5"</span>,
  <span class="key">"channel"</span>: { <span class="key">"id"</span>: <span class="val">1001</span>, <span class="key">"name"</span>: <span class="val">"CodeWithRahul"</span> },
  <span class="key">"viewCount"</span>: <span class="val">142000</span>,
  <span class="key">"likeCount"</span>: <span class="val">8500</span>,
  <span class="key">"commentCount"</span>: <span class="val">320</span>,
  <span class="key">"duration"</span>: <span class="val">1845</span>,
  <span class="key">"thumbnailUrl"</span>: <span class="val">"https://cdn.yt/thumb/5001.jpg"</span>,
  <span class="key">"streamUrl"</span>: <span class="val">"https://cdn.yt/hls/5001/master.m3u8"</span>,
  <span class="key">"hasLiked"</span>: <span class="val">true</span>,
  <span class="key">"isSubscribed"</span>: <span class="val">true</span>,
  <span class="key">"publishedAt"</span>: <span class="val">"2025-06-10T10:00:00Z"</span>
}</div>
            </div>
            <div class="api-note">Video metadata + stream URL return karta hai &mdash; hasLiked aur isSubscribed current user ke context me hai. viewCount Redis se aata hai (eventually consistent)</div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-get">GET</span><span class="api-path">/api/v1/search?q=java+spring&amp;type=video&amp;duration=medium</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Query Params</div><span class="key">q</span>: <span class="val">"java spring"</span><br><span class="key">type</span>: <span class="val">video | channel | playlist</span><br><span class="key">duration</span>: <span class="val">short | medium | long</span><br><span class="key">uploadDate</span>: <span class="val">today | week | month | year</span><br><span class="key">sort</span>: <span class="val">relevance | date | views | rating</span></div>
                <div class="api-json"><div class="label">Response 200</div>{
  <span class="key">"results"</span>: [{ <span class="key">"videoId"</span>: <span class="val">5001</span>, <span class="key">"title"</span>: <span class="val">"..."</span>,
    <span class="key">"channel"</span>: <span class="val">{...}</span>, <span class="key">"viewCount"</span>: <span class="val">142000</span>,
    <span class="key">"duration"</span>: <span class="val">1845</span>, <span class="key">"thumbnail"</span>: <span class="val">"..."</span> }],
  <span class="key">"totalResults"</span>: <span class="val">15420</span>,
  <span class="key">"nextPageToken"</span>: <span class="val">"CAoQAA"</span>
}</div>
            </div>
            <div class="api-note">Elasticsearch se full-text search &mdash; filters (duration, upload date, type) aur sorting support. Token-based pagination use hota hai offset se fast hai</div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-post">POST</span><span class="api-path">/api/v1/channels/{channelId}/subscribe</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Request</div>{ <span class="key">"notificationPref"</span>: <span class="val">"ALL"</span> }</div>
                <div class="api-json"><div class="label">Response 200</div>{
  <span class="key">"channelId"</span>: <span class="val">1001</span>,
  <span class="key">"subscribed"</span>: <span class="val">true</span>,
  <span class="key">"subscriberCount"</span>: <span class="val">1250000</span>,
  <span class="key">"notificationPref"</span>: <span class="val">"ALL"</span>
}</div>
            </div>
            <div class="api-note">Channel subscribe karta hai &mdash; subscriberCount Redis counter se aata hai (eventually consistent). notificationPref se bell icon ka state set hota hai</div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-post">POST</span><span class="api-path">/api/v1/videos/{videoId}/like</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Request</div>{ <span class="key">"action"</span>: <span class="val">"LIKE"</span> }</div>
                <div class="api-json"><div class="label">Response 200</div>{
  <span class="key">"videoId"</span>: <span class="val">5001</span>,
  <span class="key">"action"</span>: <span class="val">"LIKE"</span>,
  <span class="key">"likeCount"</span>: <span class="val">8501</span>
}</div>
            </div>
            <div class="api-note">Like/dislike toggle karta hai &mdash; idempotent hai, dobara bhejne se unlike hota hai. Redis INCR se instant count update, DB write async via Kafka</div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-post">POST</span><span class="api-path">/api/v1/videos/{videoId}/comments</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Request</div>{
  <span class="key">"content"</span>: <span class="val">"Great tutorial! Very helpful"</span>,
  <span class="key">"parentCommentId"</span>: <span class="val">null</span>
}</div>
                <div class="api-json"><div class="label">Response 201</div>{
  <span class="key">"commentId"</span>: <span class="val">9001</span>,
  <span class="key">"userId"</span>: <span class="val">2001</span>,
  <span class="key">"content"</span>: <span class="val">"Great tutorial! Very helpful"</span>,
  <span class="key">"likeCount"</span>: <span class="val">0</span>,
  <span class="key">"isPinned"</span>: <span class="val">false</span>,
  <span class="key">"isHearted"</span>: <span class="val">false</span>,
  <span class="key">"createdAt"</span>: <span class="val">"2025-06-15T10:05:00Z"</span>
}</div>
            </div>
            <div class="api-note">Comment add karta hai &mdash; parentCommentId null hai to top-level, kuch hai to reply. Video owner ko notification jaata hai. Spam detection auto-run hota hai</div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-get">GET</span><span class="api-path">/api/v1/feed/home?page=0&amp;size=20</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Response 200</div>{
  <span class="key">"videos"</span>: [{ <span class="key">"videoId"</span>: <span class="val">5001</span>,
    <span class="key">"title"</span>: <span class="val">"..."</span>, <span class="key">"channel"</span>: <span class="val">{...}</span>,
    <span class="key">"viewCount"</span>: <span class="val">142000</span>,
    <span class="key">"thumbnail"</span>: <span class="val">"..."</span>,
    <span class="key">"duration"</span>: <span class="val">1845</span>,
    <span class="key">"publishedAt"</span>: <span class="val">"..."</span> }],
  <span class="key">"nextPageToken"</span>: <span class="val">"eyJwYWdlIjoxfQ"</span>,
  <span class="key">"hasMore"</span>: <span class="val">true</span>
}</div>
            </div>
            <div class="api-note">Personalized home feed return karta hai &mdash; ML model se ranked, Redis me cached. Subscriptions + trending + recommended videos mix hote hai</div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-post">POST</span><span class="api-path">/api/v1/playlists</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Request</div>{
  <span class="key">"title"</span>: <span class="val">"Java Masterclass"</span>,
  <span class="key">"description"</span>: <span class="val">"Complete Java series"</span>,
  <span class="key">"visibility"</span>: <span class="val">"PUBLIC"</span>
}</div>
                <div class="api-json"><div class="label">Response 201</div>{
  <span class="key">"playlistId"</span>: <span class="val">7001</span>,
  <span class="key">"title"</span>: <span class="val">"Java Masterclass"</span>,
  <span class="key">"videoCount"</span>: <span class="val">0</span>,
  <span class="key">"createdAt"</span>: <span class="val">"2025-06-15T10:00:00Z"</span>
}</div>
            </div>
            <div class="api-note">Nayi playlist create karta hai &mdash; PUBLIC/PRIVATE/UNLISTED visibility. Creator apne channel pe series ke liye playlist banata hai</div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-get">GET</span><span class="api-path">/api/v1/history?page=0&amp;size=20</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Response 200</div>{
  <span class="key">"history"</span>: [{ <span class="key">"videoId"</span>: <span class="val">5001</span>,
    <span class="key">"title"</span>: <span class="val">"..."</span>,
    <span class="key">"watchedSeconds"</span>: <span class="val">845</span>,
    <span class="key">"totalDuration"</span>: <span class="val">1845</span>,
    <span class="key">"watchedAt"</span>: <span class="val">"2025-06-14T20:30:00Z"</span> }],
  <span class="key">"hasMore"</span>: <span class="val">true</span>
}</div>
            </div>
            <div class="api-note">User ki watch history return karta hai &mdash; watchedSeconds se resume point pata chalta hai. Paginated hai newest first</div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-get">GET</span><span class="api-path">/api/v1/channels/{handle}</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Response 200</div>{
  <span class="key">"channelId"</span>: <span class="val">1001</span>,
  <span class="key">"name"</span>: <span class="val">"CodeWithRahul"</span>,
  <span class="key">"handle"</span>: <span class="val">"@codewithrahul"</span>,
  <span class="key">"subscriberCount"</span>: <span class="val">1250000</span>,
  <span class="key">"videoCount"</span>: <span class="val">245</span>,
  <span class="key">"totalViews"</span>: <span class="val">85000000</span>,
  <span class="key">"isVerified"</span>: <span class="val">true</span>,
  <span class="key">"bannerUrl"</span>: <span class="val">"https://cdn.yt/banner/1001.jpg"</span>,
  <span class="key">"isSubscribed"</span>: <span class="val">true</span>
}</div>
            </div>
            <div class="api-note">Channel ki public profile return karta hai &mdash; subscriberCount abbreviated dikhta hai (1.25M). isSubscribed current user ke context me hai</div>
        </div>
    </div>
</div>

<!-- ============ DATABASE SCHEMA ============ -->
<div class="section theme-pink">
    <div class="section-title"><span class="section-num">6</span>Database Schema</div>

    <div class="sub-heading" style="color:#ff80ab;border-color:#ff80ab">Database Technology Stack</div>
    <div class="dbtech-grid">
        <div class="dbtech-card">
            <div class="dbtech-name">PostgreSQL <span class="dbtech-type">RDBMS</span></div>
            <div class="dbtech-usage">Users, channels, videos metadata, subscriptions, playlists &mdash; ACID transactions for structured relational data</div>
            <div class="dbtech-tables"><span>users</span><span>channels</span><span>videos</span><span>subscriptions</span><span>playlists</span></div>
        </div>
        <div class="dbtech-card">
            <div class="dbtech-name">Redis <span class="dbtech-type">In-Memory</span></div>
            <div class="dbtech-usage">View counters (atomic INCR), like counters, trending scores, session tokens, recommendation cache, subscriber counts</div>
            <div class="dbtech-tables"><span>views:{videoId}</span><span>likes:{videoId}</span><span>trending:{region}</span><span>reco:{userId}</span></div>
        </div>
        <div class="dbtech-card">
            <div class="dbtech-name">Elasticsearch <span class="dbtech-type">Search Engine</span></div>
            <div class="dbtech-usage">Full-text search on video titles, descriptions, tags, channel names with fuzzy matching + autocomplete</div>
            <div class="dbtech-tables"><span>videos_index</span><span>channels_index</span></div>
        </div>
        <div class="dbtech-card">
            <div class="dbtech-name">S3 + CDN <span class="dbtech-type">Content Delivery</span></div>
            <div class="dbtech-usage">Raw video uploads, transcoded HLS segments, thumbnails &mdash; served via CloudFront/Google CDN edge servers</div>
            <div class="dbtech-tables"><span>raw/{videoId}</span><span>transcoded/{videoId}/{resolution}</span><span>thumbnails/{videoId}</span></div>
        </div>
        <div class="dbtech-card">
            <div class="dbtech-name">Kafka <span class="dbtech-type">Message Queue</span></div>
            <div class="dbtech-usage">Transcode job queue, view/like event streaming, notification fan-out, search index updates</div>
            <div class="dbtech-tables"><span>transcode-jobs</span><span>view-events</span><span>notification-events</span></div>
        </div>
        <div class="dbtech-card">
            <div class="dbtech-name">Cassandra <span class="dbtech-type">NoSQL</span></div>
            <div class="dbtech-usage">Comments (write-heavy, partitioned by videoId), watch history (partitioned by userId)</div>
            <div class="dbtech-tables"><span>comments</span><span>watch_history</span></div>
        </div>
    </div>

    <div class="db-grid">
        <div class="db-table">
            <h3>users</h3>
            <ul>
                <li><span class="pk">id BIGINT (PK, AUTO_INCREMENT)</span></li>
                <li>email VARCHAR(255) UNIQUE</li>
                <li>display_name VARCHAR(100)</li>
                <li>avatar_url VARCHAR(512)</li>
                <li>google_id VARCHAR(255) UNIQUE</li>
                <li>subscription_tier ENUM DEFAULT 'FREE'</li>
                <li>created_at TIMESTAMP</li>
                <li><span class="idx">INDEX idx_email (email)</span></li>
                <li><span class="idx">INDEX idx_google (google_id)</span></li>
            </ul>
        </div>
        <div class="db-table">
            <h3>channels</h3>
            <ul>
                <li><span class="pk">id BIGINT (PK, AUTO_INCREMENT)</span></li>
                <li><span class="fk">owner_id BIGINT (FK &rarr; users.id)</span></li>
                <li>name VARCHAR(128)</li>
                <li>handle VARCHAR(64) UNIQUE</li>
                <li>description TEXT</li>
                <li>banner_url VARCHAR(512)</li>
                <li>subscriber_count BIGINT DEFAULT 0</li>
                <li>is_verified BOOLEAN DEFAULT FALSE</li>
                <li>created_at TIMESTAMP</li>
                <li><span class="idx">INDEX idx_handle (handle)</span></li>
                <li><span class="idx">INDEX idx_owner (owner_id)</span></li>
            </ul>
        </div>
        <div class="db-table">
            <h3>videos</h3>
            <ul>
                <li><span class="pk">id BIGINT (PK, AUTO_INCREMENT)</span></li>
                <li><span class="fk">channel_id BIGINT (FK &rarr; channels.id)</span></li>
                <li>title VARCHAR(255)</li>
                <li>description TEXT</li>
                <li>thumbnail_url VARCHAR(512)</li>
                <li>duration_seconds INT</li>
                <li>status ENUM DEFAULT 'UPLOADING'</li>
                <li>visibility ENUM DEFAULT 'PRIVATE'</li>
                <li>category ENUM</li>
                <li>view_count BIGINT DEFAULT 0</li>
                <li>like_count BIGINT DEFAULT 0</li>
                <li>dislike_count BIGINT DEFAULT 0</li>
                <li>comment_count BIGINT DEFAULT 0</li>
                <li>is_short BOOLEAN DEFAULT FALSE</li>
                <li>tags VARCHAR(1000)</li>
                <li>published_at TIMESTAMP</li>
                <li>created_at TIMESTAMP</li>
                <li><span class="idx">INDEX idx_channel (channel_id, published_at DESC)</span></li>
                <li><span class="idx">INDEX idx_status (status)</span></li>
                <li><span class="idx">INDEX idx_category (category, published_at DESC)</span></li>
                <li><span class="idx">FULLTEXT idx_search (title, description, tags)</span></li>
            </ul>
        </div>
        <div class="db-table">
            <h3>video_variants</h3>
            <ul>
                <li><span class="pk">id BIGINT (PK)</span></li>
                <li><span class="fk">video_id BIGINT (FK &rarr; videos.id)</span></li>
                <li>resolution ENUM NOT NULL</li>
                <li>codec VARCHAR(10)</li>
                <li>bitrate_kbps INT</li>
                <li>file_size_bytes BIGINT</li>
                <li>hls_url VARCHAR(512)</li>
                <li>status ENUM DEFAULT 'QUEUED'</li>
                <li><span class="idx">INDEX idx_video_res (video_id, resolution)</span></li>
            </ul>
        </div>
        <div class="db-table">
            <h3>subscriptions</h3>
            <ul>
                <li><span class="fk">user_id BIGINT (FK &rarr; users.id)</span></li>
                <li><span class="fk">channel_id BIGINT (FK &rarr; channels.id)</span></li>
                <li>notification_pref VARCHAR(20) DEFAULT 'PERSONALIZED'</li>
                <li>subscribed_at TIMESTAMP</li>
                <li><span class="pk">PK (user_id, channel_id)</span></li>
                <li><span class="idx">INDEX idx_channel_subs (channel_id)</span></li>
            </ul>
        </div>
        <div class="db-table">
            <h3>comments</h3>
            <ul>
                <li><span class="pk">id BIGINT (PK)</span></li>
                <li><span class="fk">video_id BIGINT (FK &rarr; videos.id)</span></li>
                <li><span class="fk">user_id BIGINT (FK &rarr; users.id)</span></li>
                <li><span class="fk">parent_id BIGINT (FK &rarr; comments.id, NULL for top-level)</span></li>
                <li>content TEXT</li>
                <li>like_count INT DEFAULT 0</li>
                <li>is_pinned BOOLEAN DEFAULT FALSE</li>
                <li>is_hearted BOOLEAN DEFAULT FALSE</li>
                <li>created_at TIMESTAMP</li>
                <li><span class="idx">INDEX idx_video_time (video_id, created_at DESC)</span></li>
                <li><span class="idx">INDEX idx_parent (parent_id)</span></li>
            </ul>
        </div>
        <div class="db-table">
            <h3>playlists</h3>
            <ul>
                <li><span class="pk">id BIGINT (PK)</span></li>
                <li><span class="fk">user_id BIGINT (FK &rarr; users.id)</span></li>
                <li>title VARCHAR(255)</li>
                <li>description TEXT</li>
                <li>visibility ENUM DEFAULT 'PRIVATE'</li>
                <li>type ENUM DEFAULT 'NORMAL'</li>
                <li>video_count INT DEFAULT 0</li>
                <li>created_at TIMESTAMP</li>
                <li><span class="idx">INDEX idx_user (user_id)</span></li>
            </ul>
        </div>
        <div class="db-table">
            <h3>watch_history</h3>
            <ul>
                <li><span class="pk">id BIGINT (PK)</span></li>
                <li><span class="fk">user_id BIGINT (FK &rarr; users.id)</span></li>
                <li><span class="fk">video_id BIGINT (FK &rarr; videos.id)</span></li>
                <li>watched_seconds INT</li>
                <li>total_duration INT</li>
                <li>completed BOOLEAN DEFAULT FALSE</li>
                <li>last_watched_at TIMESTAMP</li>
                <li><span class="idx">INDEX idx_user_time (user_id, last_watched_at DESC)</span></li>
                <li><span class="idx">UNIQUE idx_user_video (user_id, video_id)</span></li>
            </ul>
        </div>
    </div>

    <div class="sub-heading" style="color:#ff80ab;border-color:#ff80ab">Core SQL Queries</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">SQL</span></div><pre class="code-block">
<span class="cm">-- Channel ke videos fetch karo (newest first, paginated)</span>
<span class="kw">SELECT</span> v.id, v.title, v.thumbnail_url, v.view_count, v.duration_seconds, v.published_at
<span class="kw">FROM</span> videos v
<span class="kw">WHERE</span> v.channel_id = ? <span class="kw">AND</span> v.status = <span class="val">'READY'</span> <span class="kw">AND</span> v.visibility = <span class="val">'PUBLIC'</span>
<span class="kw">ORDER BY</span> v.published_at <span class="kw">DESC</span>
<span class="kw">LIMIT</span> 20 <span class="kw">OFFSET</span> ?;

<span class="cm">-- User ki subscriptions ke latest videos (subscription feed)</span>
<span class="kw">SELECT</span> v.id, v.title, v.thumbnail_url, v.view_count, c.name <span class="kw">AS</span> channel_name
<span class="kw">FROM</span> videos v
<span class="kw">JOIN</span> subscriptions s <span class="kw">ON</span> v.channel_id = s.channel_id
<span class="kw">JOIN</span> channels c <span class="kw">ON</span> v.channel_id = c.id
<span class="kw">WHERE</span> s.user_id = ? <span class="kw">AND</span> v.status = <span class="val">'READY'</span> <span class="kw">AND</span> v.visibility = <span class="val">'PUBLIC'</span>
<span class="kw">ORDER BY</span> v.published_at <span class="kw">DESC</span>
<span class="kw">LIMIT</span> 20;

<span class="cm">-- Video ke top-level comments (sorted by likes)</span>
<span class="kw">SELECT</span> c.id, c.content, c.like_count, c.is_pinned, c.is_hearted,
       u.display_name, u.avatar_url, c.created_at
<span class="kw">FROM</span> comments c
<span class="kw">JOIN</span> users u <span class="kw">ON</span> c.user_id = u.id
<span class="kw">WHERE</span> c.video_id = ? <span class="kw">AND</span> c.parent_id <span class="kw">IS NULL</span>
<span class="kw">ORDER BY</span> c.is_pinned <span class="kw">DESC</span>, c.like_count <span class="kw">DESC</span>
<span class="kw">LIMIT</span> 20 <span class="kw">OFFSET</span> ?;

<span class="cm">-- Watch history se resume point nikalo</span>
<span class="kw">SELECT</span> video_id, watched_seconds, total_duration
<span class="kw">FROM</span> watch_history
<span class="kw">WHERE</span> user_id = ? <span class="kw">AND</span> completed = <span class="val">FALSE</span>
<span class="kw">ORDER BY</span> last_watched_at <span class="kw">DESC</span>
<span class="kw">LIMIT</span> 10;

<span class="cm">-- Subscriber count update (atomic increment)</span>
<span class="kw">UPDATE</span> channels <span class="kw">SET</span> subscriber_count = subscriber_count + 1
<span class="kw">WHERE</span> id = ?;
</pre></div>
</div>

<!-- ============ CAPACITY ESTIMATION ============ -->
<div class="section theme-deepblue">
    <div class="section-title"><span class="section-num">7</span>Capacity Estimation</div>

    <div class="assumption-box">
        <h4>Assumptions (YouTube Scale)</h4>
        <div class="assumption-row"><span class="calc-label">Total Users</span><span class="calc-value">2.5 Billion</span></div>
        <div class="assumption-row"><span class="calc-label">Daily Active Users (DAU)</span><span class="calc-value">800 Million</span></div>
        <div class="assumption-row"><span class="calc-label">Avg videos watched/user/day</span><span class="calc-value">10 videos</span></div>
        <div class="assumption-row"><span class="calc-label">Video uploads/day</span><span class="calc-value">500K</span></div>
        <div class="assumption-row"><span class="calc-label">Avg video size (original)</span><span class="calc-value">500 MB</span></div>
        <div class="assumption-row"><span class="calc-label">Avg video duration</span><span class="calc-value">7 minutes</span></div>
        <div class="assumption-row"><span class="calc-label">Avg transcoded output per video</span><span class="calc-value">5 resolutions = 2 GB total</span></div>
    </div>

    <div class="cap-grid">
        <div class="cap-card">
            <h4>Video Uploads Per Day</h4>
            <div class="calc-row"><span class="calc-label">Uploads/day</span><span class="calc-value">500K</span></div>
            <div class="calc-row"><span class="calc-label">500K / 86400s</span><span class="calc-value"></span></div>
            <div class="calc-result"><span class="calc-label">Avg Upload QPS</span><span class="calc-value">~6 QPS</span></div>
            <div class="calc-result"><span class="calc-label">Peak Upload QPS (5x)</span><span class="calc-value">~30 QPS</span></div>
        </div>

        <div class="cap-card">
            <h4>Video Views Per Day</h4>
            <div class="calc-row"><span class="calc-label">DAU</span><span class="calc-value">800M</span></div>
            <div class="calc-row"><span class="calc-label">&times; 10 videos/user/day</span><span class="calc-value"></span></div>
            <div class="calc-result"><span class="calc-label">Total Views / Day</span><span class="calc-value">8 Billion</span></div>
            <div class="calc-result"><span class="calc-label">Avg View QPS</span><span class="calc-value">~92K QPS</span></div>
            <div class="calc-result"><span class="calc-label">Peak View QPS (3x)</span><span class="calc-value">~300K QPS</span></div>
        </div>

        <div class="cap-card">
            <h4>Storage &mdash; Raw Videos (per day)</h4>
            <div class="calc-row"><span class="calc-label">Uploads/day</span><span class="calc-value">500K</span></div>
            <div class="calc-row"><span class="calc-label">&times; 500 MB / video</span><span class="calc-value"></span></div>
            <div class="calc-result"><span class="calc-label">Raw Storage / Day</span><span class="calc-value">~250 TB / day</span></div>
            <div class="calc-result"><span class="calc-label">Raw Storage / Year</span><span class="calc-value">~91 PB / year</span></div>
        </div>

        <div class="cap-card">
            <h4>Storage &mdash; Transcoded Videos (per day)</h4>
            <div class="calc-row"><span class="calc-label">Uploads/day</span><span class="calc-value">500K</span></div>
            <div class="calc-row"><span class="calc-label">&times; 2 GB transcoded output</span><span class="calc-value"></span></div>
            <div class="calc-result"><span class="calc-label">Transcoded Storage / Day</span><span class="calc-value">~1 PB / day</span></div>
            <div class="calc-result"><span class="calc-label">Transcoded Storage / Year</span><span class="calc-value">~365 PB / year</span></div>
        </div>

        <div class="cap-card">
            <h4>CDN Bandwidth</h4>
            <div class="calc-row"><span class="calc-label">Views/day</span><span class="calc-value">8 Billion</span></div>
            <div class="calc-row"><span class="calc-label">&times; 100 MB avg streamed</span><span class="calc-value"></span></div>
            <div class="calc-result"><span class="calc-label">Total Egress / Day</span><span class="calc-value">~800 PB / day</span></div>
            <div class="calc-result"><span class="calc-label">Avg Egress Throughput</span><span class="calc-value">~9.25 GB/s per server</span></div>
        </div>

        <div class="cap-card">
            <h4>Transcoding Compute</h4>
            <div class="calc-row"><span class="calc-label">Uploads/day</span><span class="calc-value">500K</span></div>
            <div class="calc-row"><span class="calc-label">&times; 5 resolutions &times; 7 min</span><span class="calc-value"></span></div>
            <div class="calc-row"><span class="calc-label">Total transcode time/day</span><span class="calc-value">~17.5M minutes</span></div>
            <div class="calc-result"><span class="calc-label">Transcoding Workers Needed</span><span class="calc-value">~2,500 workers</span></div>
        </div>

        <div class="cap-card">
            <h4>Thumbnail Generation</h4>
            <div class="calc-row"><span class="calc-label">Uploads/day</span><span class="calc-value">500K</span></div>
            <div class="calc-row"><span class="calc-label">&times; 3 thumbnails / video</span><span class="calc-value"></span></div>
            <div class="calc-result"><span class="calc-label">Thumbnails / Day</span><span class="calc-value">1.5M thumbnails/day</span></div>
        </div>

        <div class="cap-card">
            <h4>Recommendation QPS</h4>
            <div class="calc-row"><span class="calc-label">DAU</span><span class="calc-value">800M</span></div>
            <div class="calc-row"><span class="calc-label">&times; 10 feed loads / user / day</span><span class="calc-value"></span></div>
            <div class="calc-result"><span class="calc-label">Recommendations / Day</span><span class="calc-value">8 Billion</span></div>
            <div class="calc-result"><span class="calc-label">Recommendation QPS</span><span class="calc-value">~92K QPS</span></div>
        </div>

        <div class="cap-card">
            <h4>CPU / Server Estimation</h4>
            <div class="calc-row"><span class="calc-label">API Servers</span><span class="calc-value">~500 servers</span></div>
            <div class="calc-row"><span class="calc-label">Transcoding Workers</span><span class="calc-value">~2,500 workers</span></div>
            <div class="calc-row"><span class="calc-label">CDN Edge Servers</span><span class="calc-value">~10,000 servers</span></div>
            <div class="calc-row"><span class="calc-label">DB Shards</span><span class="calc-value">50+ shards</span></div>
            <div class="calc-row"><span class="calc-label">Redis Cluster Nodes</span><span class="calc-value">100+ nodes</span></div>
        </div>
    </div>
</div>

<!-- ============ 8. DATA STRUCTURES & TRADE-OFFS ============ -->
<div class="section theme-purple">
    <div class="section-title"><span class="section-num">8</span>Data Structures &amp; Trade-offs</div>
    <div class="service-grid">
        <div class="service-card">
            <h3>B+ Tree &mdash; Video Metadata Index</h3>
            <p class="svc-desc">MySQL/PostgreSQL internally B+ Tree use karta hai video metadata (title, upload_date, channel_id) ko index karne ke liye. Jab tum "latest videos" ya "channel ke saare videos" search karte ho, B+ Tree sorted traversal deta hai.</p>
            <p class="svc-desc"><strong>Use Case:</strong> Video table pe INDEX(channel_id, upload_date DESC) &mdash; channel page pe latest videos dikhane ke liye<br><br>
            <strong>Why B+ Tree?</strong> Sorted order maintain karta hai disk pe, range queries efficient hai (e.g., last 7 days ke videos), leaf nodes linked list se connected hai toh sequential scan fast hai<br><br>
            <strong>Pros:</strong> O(log n) search, sorted traversal O(k), disk-optimized (high fan-out = fewer disk reads), range queries excellent<br><br>
            <strong>Cons:</strong> Write amplification (rebalancing on insert/delete), overhead for small datasets, not ideal for write-heavy workloads (view counts)<br><br>
            <strong>Alternative:</strong> Hash Index &mdash; O(1) point lookup but no range queries, toh "latest videos" nahi mil paayega</p>
        </div>
        <div class="service-card">
            <h3>LSM Tree &mdash; Write-Heavy Counters (View Count, Likes)</h3>
            <p class="svc-desc">YouTube pe har second millions of view count updates hote hai. B+ Tree se ye handle nahi hoga kyunki har write pe rebalancing hoti hai. LSM Tree (Cassandra, RocksDB) append-only writes karta hai &mdash; pehle MemTable me, phir SSTable flush.</p>
            <p class="svc-desc"><strong>Use Case:</strong> video_id → {view_count, like_count, comment_count} &mdash; Cassandra me store, Redis buffer se batch flush<br><br>
            <strong>Why LSM Tree?</strong> Write throughput 10x better than B+ Tree, append-only toh disk seek nahi lagta, compaction background me hota hai<br><br>
            <strong>Pros:</strong> O(1) writes (sequential append), excellent for write-heavy workloads, compression friendly, time-series data ke liye ideal<br><br>
            <strong>Cons:</strong> Read amplification (multiple SSTables check karna padta), compaction spikes CPU/IO, space amplification (duplicate keys until compacted)<br><br>
            <strong>Trade-off:</strong> B+ Tree = read-optimized, LSM = write-optimized. YouTube me view counts write-heavy hai toh LSM wins</p>
        </div>
        <div class="service-card">
            <h3>Consistent Hashing &mdash; CDN &amp; Cache Distribution</h3>
            <p class="svc-desc">YouTube ke 800M+ daily users ke videos serve karne ke liye CDN edge servers pe content distribute karna padta hai. Consistent Hashing se video_id hash karke nearest CDN node assign hota hai.</p>
            <p class="svc-desc"><strong>Use Case:</strong> hash(video_id) → CDN edge node, Redis cache sharding bhi same technique<br><br>
            <strong>Why Consistent Hashing?</strong> Server add/remove pe sirf 1/N fraction data redistribute hota hai, traditional modular hashing me sab rehash hota<br><br>
            <strong>Pros:</strong> Minimal data movement on rebalancing, horizontal scaling easy, fault tolerant (node down = next node takes over)<br><br>
            <strong>Cons:</strong> Uneven distribution without virtual nodes (hotspot problem), complexity in implementation, clock-wise lookup overhead<br><br>
            <strong>Virtual Nodes:</strong> Har physical server ko 100-200 virtual nodes dete hai ring pe, toh load evenly distribute hota hai</p>
        </div>
        <div class="service-card">
            <h3>Priority Queue (Min-Heap) &mdash; Recommendation Ranking</h3>
            <p class="svc-desc">YouTube ka recommendation engine 2-stage hai: pehle candidate generation (1000s videos), phir ranking model score deta hai. Top-K videos nikalne ke liye Min-Heap use hota hai.</p>
            <p class="svc-desc"><strong>Use Case:</strong> Top 50 recommended videos nikalna 10,000 candidates me se based on ML score<br><br>
            <strong>Why Min-Heap?</strong> Size K ka min-heap maintain karo, agar naya element heap top se bada hai toh replace karo. O(N log K) me Top-K mil jaata hai without sorting all N elements<br><br>
            <strong>Pros:</strong> O(1) peek (minimum element), O(log K) insert/extract, memory efficient (only K elements in heap)<br><br>
            <strong>Cons:</strong> No random access, full scan for arbitrary element, not cache-friendly for large heaps<br><br>
            <strong>Alternative:</strong> Full sort O(N log N) vs Heap-based Top-K O(N log K) &mdash; K=50, N=10000 me heap 3x faster</p>
        </div>
        <div class="service-card">
            <h3>DAG (Directed Acyclic Graph) &mdash; Transcoding Pipeline</h3>
            <p class="svc-desc">Video upload hone ke baad multiple stages se guzarta hai: validation → thumbnail extraction → transcoding (6 resolutions) → DRM → CDN push. Ye stages DAG ke nodes hai, dependencies edges hai.</p>
            <p class="svc-desc"><strong>Use Case:</strong> Transcoding pipeline orchestration &mdash; parallel tasks (6 resolution transcodes) + sequential dependencies (transcode complete → CDN push)<br><br>
            <strong>Why DAG?</strong> Topological sort se execution order determine hota hai, independent tasks parallel run ho sakte hai, cycle detection ensures no deadlock<br><br>
            <strong>Pros:</strong> Parallel execution of independent tasks, clear dependency management, fault isolation (one task fail = only dependents blocked)<br><br>
            <strong>Cons:</strong> Complexity in scheduling, needs orchestrator (Airflow/Temporal), retry logic per node<br><br>
            <strong>Real World:</strong> YouTube uses Borg (K8s predecessor) + custom DAG scheduler for transcoding pipelines</p>
        </div>
        <div class="service-card">
            <h3>Bloom Filter &mdash; Duplicate &amp; Copyright Detection</h3>
            <p class="svc-desc">800M+ videos me se duplicate check karna expensive hai. Bloom Filter probabilistic data structure hai jo O(1) me "definitely not exists" ya "maybe exists" bata deta hai. Content ID system me audio/video fingerprint check ke liye use hota hai.</p>
            <p class="svc-desc"><strong>Use Case:</strong> Video fingerprint duplicate check &mdash; upload time pe pehle Bloom Filter check, positive aaye toh full comparison<br><br>
            <strong>Why Bloom Filter?</strong> 800M video fingerprints store karna HashSet me ~50GB+ RAM lagega, Bloom Filter me ~1GB me same work (with 0.1% false positive rate)<br><br>
            <strong>Pros:</strong> O(1) lookup, extremely space efficient (10 bits per element), no false negatives guaranteed<br><br>
            <strong>Cons:</strong> False positives possible (0.1-1%), cannot delete elements (use Counting Bloom Filter for deletion), cannot retrieve stored elements<br><br>
            <strong>Trade-off:</strong> Memory vs Accuracy &mdash; more bits per element = lower false positive rate. 10 bits/element = 1% FP, 15 bits = 0.1% FP</p>
        </div>
    </div>
</div>

<!-- ============ TRANSCODING PIPELINE ============ -->
<div class="section theme-blue">
    <div class="section-title"><span class="section-num">9</span>Architecture &mdash; Transcoding Pipeline</div>
    <div class="service-grid">
        <div class="service-card">
            <h3>Upload &rarr; Transcode &rarr; HLS Flow</h3>
            <p class="svc-desc">Video upload hote hi Kafka me transcode job publish hota hai &mdash; FFmpeg workers parallel me multiple resolutions generate karte hai, HLS segments S3 pe store hote hai</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">TranscodingPipeline</span> {

    <span class="cm">// Step 1: Upload complete hote hi fan-out transcode jobs</span>
    <span class="kw">void</span> <span class="fn">onUploadComplete</span>(<span class="tp">VideoUploadEvent</span> event) {
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

    <span class="cm">// Step 2: FFmpeg worker picks job from Kafka</span>
    <span class="kw">void</span> <span class="fn">processTranscode</span>(<span class="tp">TranscodeJob</span> job) {
        <span class="cm">// FFmpeg command: split into 6s HLS segments</span>
        <span class="cm">// ffmpeg -i input.mp4 -vf scale=-2:720</span>
        <span class="cm">//   -c:v libx264 -preset fast -hls_time 6</span>
        <span class="cm">//   -hls_segment_filename 'seg_%03d.ts'</span>
        <span class="cm">//   output.m3u8</span>
        <span class="tp">TranscodeResult</span> result = ffmpeg.<span class="fn">transcode</span>(
            job.getInputPath(), job.getResolution());
        <span class="cm">// Upload .ts segments + .m3u8 to S3</span>
        s3.<span class="fn">uploadDirectory</span>(result.getOutputDir(),
            <span class="st">"transcoded/"</span> + job.getVideoId()
            + <span class="st">"/"</span> + job.getResolution());
    }

    <span class="cm">// Step 3: Saari resolutions complete -&gt; master manifest</span>
    <span class="kw">void</span> <span class="fn">generateMasterManifest</span>(<span class="tp">Long</span> videoId) {
        <span class="cm">// Master .m3u8 points to each resolution playlist</span>
        <span class="cm">// #EXT-X-STREAM-INF:BANDWIDTH=800000,RESOLUTION=640x360</span>
        <span class="cm">// 360p/playlist.m3u8</span>
        <span class="cm">// #EXT-X-STREAM-INF:BANDWIDTH=2500000,RESOLUTION=1280x720</span>
        <span class="cm">// 720p/playlist.m3u8</span>
        videoRepo.<span class="fn">updateStatus</span>(videoId, READY);
    }
}
</pre></div>
        </div>
        <div class="service-card">
            <h3>HLS Adaptive Bitrate Streaming</h3>
            <p class="svc-desc">Player bandwidth measure karta hai aur dynamically quality switch karta hai &mdash; slow net pe 360p, fast pe 1080p, buffer health monitor se decision hota hai</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">AdaptiveBitrateSelector</span> {

    <span class="cm">// Master manifest structure (HLS)</span>
    <span class="cm">// #EXTM3U</span>
    <span class="cm">// #EXT-X-STREAM-INF:BANDWIDTH=400000,RESOLUTION=426x240</span>
    <span class="cm">//   240p/playlist.m3u8</span>
    <span class="cm">// #EXT-X-STREAM-INF:BANDWIDTH=800000,RESOLUTION=640x360</span>
    <span class="cm">//   360p/playlist.m3u8</span>
    <span class="cm">// #EXT-X-STREAM-INF:BANDWIDTH=2500000,RESOLUTION=1280x720</span>
    <span class="cm">//   720p/playlist.m3u8</span>
    <span class="cm">// #EXT-X-STREAM-INF:BANDWIDTH=5000000,RESOLUTION=1920x1080</span>
    <span class="cm">//   1080p/playlist.m3u8</span>

    <span class="cm">// Bandwidth ke hisaab se best resolution select karo</span>
    <span class="tp">Resolution</span> <span class="fn">selectQuality</span>(<span class="tp">double</span> bandwidthMbps,
            <span class="tp">double</span> bufferHealthSec) {
        <span class="cm">// Buffer low hai &lt; 5s -&gt; quality neeche karo</span>
        <span class="cm">// Buffer healthy &gt; 15s -&gt; quality upar karo</span>
        <span class="cm">// Bandwidth se max sustainable resolution decide karo</span>
        <span class="kw">if</span> (bufferHealthSec &lt; 5) <span class="kw">return</span> <span class="fn">lowerQuality</span>();
        <span class="kw">if</span> (bandwidthMbps &gt; 5.0) <span class="kw">return</span> R_1080P;
        <span class="kw">if</span> (bandwidthMbps &gt; 2.5) <span class="kw">return</span> R_720P;
        <span class="kw">if</span> (bandwidthMbps &gt; 0.8) <span class="kw">return</span> R_360P;
        <span class="kw">return</span> R_240P;
    }
}
</pre></div>
        </div>
    </div>
</div>

<!-- ============ RECOMMENDATION SYSTEM ============ -->
<div class="section theme-green">
    <div class="section-title"><span class="section-num">10</span>Recommendation System</div>
    <div class="service-grid">
        <div class="service-card">
            <h3>YouTube Recommendation Algorithm</h3>
            <p class="svc-desc">Two-stage approach &mdash; pehle candidate generation (1000s videos shortlist), phir ranking model (top 20-50 select). Watch time optimization hai, click-through rate nahi</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">RecommendationEngine</span> {

    <span class="cm">// Stage 1: Candidate Generation</span>
    <span class="cm">// Collaborative Filtering - similar users ne kya dekha</span>
    <span class="cm">// Content-Based - same tags/category/channel ke videos</span>
    <span class="cm">// Popular - region wise trending videos</span>
    <span class="tp">List&lt;Long&gt;</span> <span class="fn">generateCandidates</span>(<span class="tp">Long</span> userId, <span class="tp">int</span> limit) {
        <span class="tp">Set&lt;Long&gt;</span> candidates = <span class="kw">new</span> <span class="tp">LinkedHashSet</span>&lt;&gt;();
        <span class="cm">// collaborative filtering se similar users ke videos</span>
        candidates.<span class="fn">addAll</span>(<span class="fn">getCollaborativeRecs</span>(userId));
        <span class="cm">// user ki watch history se content-based match</span>
        candidates.<span class="fn">addAll</span>(<span class="fn">getContentBasedRecs</span>(userId));
        <span class="cm">// region wise trending fill karo</span>
        candidates.<span class="fn">addAll</span>(<span class="fn">getTrendingFill</span>(userId));
        <span class="cm">// already watched filter karo</span>
        candidates.<span class="fn">removeAll</span>(<span class="fn">getWatchedIds</span>(userId));
        <span class="kw">return</span> <span class="kw">new</span> <span class="tp">ArrayList</span>&lt;&gt;(candidates);
    }

    <span class="cm">// Stage 2: Ranking Model</span>
    <span class="cm">// Features: user history, video freshness, engagement,</span>
    <span class="cm">// watch-through rate, CTR, user-video affinity</span>
    <span class="tp">List&lt;Video&gt;</span> <span class="fn">rankCandidates</span>(<span class="tp">Long</span> userId,
            <span class="tp">List&lt;Long&gt;</span> candidateIds) {
        <span class="cm">// ML model predict karta hai expected watch time</span>
        <span class="cm">// Score = P(click) * E(watch_time) * quality_score</span>
        <span class="cm">// Higher expected watch time = higher rank</span>
        <span class="kw">return</span> candidateIds.stream()
            .<span class="fn">map</span>(id -&gt; <span class="fn">scoreVideo</span>(userId, id))
            .<span class="fn">sorted</span>(Comparator.comparing(
                <span class="tp">ScoredVideo</span>::getScore).reversed())
            .<span class="fn">limit</span>(50)
            .<span class="fn">map</span>(<span class="tp">ScoredVideo</span>::getVideo)
            .<span class="fn">collect</span>(Collectors.<span class="fn">toList</span>());
    }
}
</pre></div>
        </div>
        <div class="service-card">
            <h3>Cold Start &amp; Exploration</h3>
            <p class="svc-desc">Naye user ke liye koi history nahi hoti &mdash; region wise popular videos dikhao, genre preference signup pe poocho, exploration vs exploitation balance karo</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">ColdStartHandler</span> {

    <span class="cm">// Naye user ke liye &mdash; koi watch history nahi hai</span>
    <span class="tp">List&lt;Video&gt;</span> <span class="fn">getNewUserRecs</span>(<span class="tp">String</span> region,
            <span class="tp">List&lt;Category&gt;</span> preferredCategories) {
        <span class="cm">// Step 1: Region ke top trending videos</span>
        <span class="cm">// Step 2: Selected categories ke popular videos</span>
        <span class="cm">// Step 3: Globally viral videos mix karo</span>
        <span class="cm">// Step 4: Explore &mdash; random diverse content 10-20%</span>
        <span class="kw">return</span> <span class="fn">mixAndDiversify</span>(trending, popular, viral);
    }

    <span class="cm">// Naye video ke liye &mdash; koi engagement data nahi hai</span>
    <span class="tp">double</span> <span class="fn">scoreNewVideo</span>(<span class="tp">Video</span> video) {
        <span class="cm">// Channel ki past performance se predict karo</span>
        <span class="cm">// Title/thumbnail quality score (ML model)</span>
        <span class="cm">// Category aur tags ka match score</span>
        <span class="cm">// Freshness boost (naye videos ko chance do)</span>
        <span class="kw">return</span> channelScore * 0.4 + qualityScore * 0.3
            + relevanceScore * 0.2 + freshnessBoost * 0.1;
    }
}
</pre></div>
        </div>
    </div>
</div>

<!-- ============ MONETIZATION & ADS ============ -->
<div class="section theme-purple">
    <div class="section-title"><span class="section-num">11</span>Monetization &amp; Ads</div>
    <div class="service-grid">
        <div class="service-card">
            <h3>Ad Insertion Engine</h3>
            <p class="svc-desc">Video me pre-roll, mid-roll, post-roll ads insert karta hai &mdash; 8+ min video me mid-roll allowed hai, targeting user profile se hota hai, Premium users ko ads nahi dikhte</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">AdInsertionEngine</span> {

    <span class="cm">// Video ke liye ad placements decide karo</span>
    <span class="tp">List&lt;AdPlacement&gt;</span> <span class="fn">computeAdBreaks</span>(<span class="tp">Long</span> videoId,
            <span class="tp">int</span> durationSec, <span class="tp">Long</span> userId) {
        <span class="cm">// Premium user hai to empty list return karo</span>
        <span class="kw">if</span> (<span class="fn">isPremium</span>(userId)) <span class="kw">return</span> List.<span class="fn">of</span>();

        List&lt;AdPlacement&gt; placements = <span class="kw">new</span> ArrayList&lt;&gt;();
        <span class="cm">// Pre-roll: hamesha (0 sec pe)</span>
        placements.<span class="fn">add</span>(<span class="kw">new</span> <span class="tp">AdPlacement</span>(PRE_ROLL, 0));

        <span class="cm">// Mid-roll: sirf 8+ min video me, har 3-5 min pe</span>
        <span class="kw">if</span> (durationSec &gt; 480) {
            <span class="kw">for</span> (<span class="kw">int</span> t = 180; t &lt; durationSec - 60; t += 210) {
                placements.<span class="fn">add</span>(<span class="kw">new</span> <span class="tp">AdPlacement</span>(MID_ROLL, t));
            }
        }
        <span class="cm">// Post-roll: video end pe</span>
        placements.<span class="fn">add</span>(<span class="kw">new</span> <span class="tp">AdPlacement</span>(POST_ROLL, durationSec));
        <span class="kw">return</span> placements;
    }

    <span class="cm">// Targeting ke basis pe best ad select karo</span>
    <span class="tp">Ad</span> <span class="fn">selectAd</span>(<span class="tp">Long</span> userId, <span class="tp">AdType</span> type,
            <span class="tp">String</span> region, <span class="tp">Category</span> videoCategory) {
        <span class="cm">// User demographics + interests + video context match</span>
        <span class="cm">// Real-time bidding (RTB) se highest CPM ad select</span>
        <span class="cm">// Frequency capping &mdash; same ad baar baar nahi</span>
        <span class="kw">return</span> adAuction.<span class="fn">runAuction</span>(userId, type, region);
    }
}
</pre></div>
        </div>
        <div class="service-card">
            <h3>Creator Revenue &amp; YouTube Premium</h3>
            <p class="svc-desc">Creator ko 55% ad revenue milta hai &mdash; YouTube Premium se ad-free experience, premium revenue watch time proportional distribute hota hai creators me</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">RevenueCalculator</span> {

    <span class="cm">// Creator ka ad revenue calculate karo</span>
    <span class="tp">RevenueReport</span> <span class="fn">calculateAdRevenue</span>(<span class="tp">Long</span> channelId,
            <span class="tp">DateRange</span> range) {
        <span class="cm">// Total ad impressions * CPM / 1000</span>
        <span class="cm">// Creator share = 55% (YouTube keeps 45%)</span>
        <span class="cm">// RPM = Revenue per 1000 views (varies by niche)</span>
        <span class="cm">// Finance niche: $15-30 RPM</span>
        <span class="cm">// Gaming niche: $3-8 RPM</span>
        <span class="cm">// Entertainment: $5-12 RPM</span>
        <span class="tp">double</span> totalRevenue = impressions * cpm / 1000;
        <span class="kw">return</span> <span class="kw">new</span> <span class="tp">RevenueReport</span>(totalRevenue * 0.55);
    }

    <span class="cm">// Premium revenue distribute karo watch time ke basis pe</span>
    <span class="tp">BigDecimal</span> <span class="fn">calculatePremiumShare</span>(<span class="tp">Long</span> channelId,
            <span class="tp">YearMonth</span> month) {
        <span class="cm">// Premium pool = total premium subscriptions revenue</span>
        <span class="cm">// Channel share = channel_watch_time / total_watch_time</span>
        <span class="cm">// Agar user ne 30% time tumhare channel pe dekha</span>
        <span class="cm">// to uski premium fee ka 30% tumhe milega</span>
        <span class="tp">double</span> ratio = channelWatchTime / totalWatchTime;
        <span class="kw">return</span> premiumPool.<span class="fn">multiply</span>(BigDecimal.valueOf(ratio));
    }

    <span class="cm">// Super Chat revenue &mdash; creator ko 70% milta hai</span>
    <span class="cm">// Channel membership revenue &mdash; creator ko 70% milta hai</span>
}
</pre></div>
        </div>
    </div>
</div>

<!-- ============ CDN & STREAMING ============ -->
<div class="section theme-yellow">
    <div class="section-title"><span class="section-num">12</span>CDN &amp; Streaming Architecture</div>
    <div class="service-grid">
        <div class="service-card">
            <h3>Edge Caching &amp; Content Delivery</h3>
            <p class="svc-desc">Google ke global CDN (Google Edge Network) se video segments deliver hote hai &mdash; 100+ countries me PoP (Points of Presence), trending videos pre-warm hote hai edge pe</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">CDNManager</span> {

    <span class="cm">// Nearest edge server se video serve karo</span>
    <span class="tp">String</span> <span class="fn">resolveEdgeUrl</span>(<span class="tp">Long</span> videoId,
            <span class="tp">Resolution</span> resolution, <span class="tp">String</span> clientIp) {
        <span class="cm">// GeoDNS se nearest PoP identify karo</span>
        <span class="tp">String</span> edgeNode = geoDns.<span class="fn">resolve</span>(clientIp);
        <span class="cm">// Check karo edge pe cached hai ya nahi</span>
        <span class="kw">if</span> (!edge.<span class="fn">isCached</span>(videoId, resolution)) {
            <span class="cm">// Origin shield se pull karo (cascading cache)</span>
            edge.<span class="fn">pullFromOrigin</span>(videoId, resolution);
        }
        <span class="cm">// Signed URL generate karo with 1hr expiry</span>
        <span class="kw">return</span> <span class="fn">generateSignedUrl</span>(edgeNode, videoId,
            resolution, 3600);
    }

    <span class="cm">// Trending videos ko proactively edge pe push karo</span>
    <span class="kw">void</span> <span class="fn">preWarmEdge</span>(<span class="tp">List&lt;Long&gt;</span> trendingVideoIds,
            <span class="tp">String</span> region) {
        <span class="cm">// Top 100 trending videos ko region ke</span>
        <span class="cm">// saare edge nodes pe push karo</span>
        <span class="cm">// Cache miss storm prevent hota hai isse</span>
        <span class="kw">for</span> (<span class="tp">Long</span> videoId : trendingVideoIds) {
            edgeCluster.<span class="fn">pushToRegion</span>(videoId, region);
        }
    }

    <span class="cm">// Cache hierarchy: Edge &rarr; Origin Shield &rarr; S3</span>
    <span class="cm">// Edge cache TTL: popular videos 24h, others 2h</span>
    <span class="cm">// Origin shield: reduces S3 requests by 90%</span>
}
</pre></div>
        </div>
        <div class="service-card">
            <h3>Video Chunk Delivery &amp; Player</h3>
            <p class="svc-desc">Player 6-second HLS segments (.ts files) download karta hai sequentially &mdash; buffer maintain karta hai 15-30 sec ka, quality switch seamless hota hai mid-segment</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">VideoPlayerEngine</span> {

    <span class="cm">// HLS segment delivery flow</span>
    <span class="cm">// 1. Player requests master.m3u8 (manifest)</span>
    <span class="cm">// 2. Manifest lists all available resolutions</span>
    <span class="cm">// 3. Player selects resolution playlist (720p.m3u8)</span>
    <span class="cm">// 4. Playlist lists 6-second .ts segments</span>
    <span class="cm">// 5. Player downloads segments sequentially</span>
    <span class="cm">// 6. Buffer maintains 15-30 seconds ahead</span>

    <span class="cm">// Segment request from CDN edge</span>
    <span class="tp">byte[]</span> <span class="fn">getSegment</span>(<span class="tp">Long</span> videoId,
            <span class="tp">Resolution</span> res, <span class="tp">int</span> segmentNum) {
        <span class="tp">String</span> key = videoId + <span class="st">"/"</span> + res
            + <span class="st">"/seg_"</span> + segmentNum + <span class="st">".ts"</span>;
        <span class="cm">// CDN edge cache hit &rarr; instant serve</span>
        <span class="cm">// Cache miss &rarr; origin shield &rarr; S3</span>
        <span class="kw">return</span> cdn.<span class="fn">get</span>(key);
    }

    <span class="cm">// Watch progress save karo har 10 seconds pe</span>
    <span class="kw">void</span> <span class="fn">reportProgress</span>(<span class="tp">Long</span> userId,
            <span class="tp">Long</span> videoId, <span class="tp">int</span> currentSecond) {
        <span class="cm">// Redis me buffer karo, batch me DB flush</span>
        redis.<span class="fn">set</span>(<span class="st">"progress:"</span> + userId + <span class="st">":"</span>
            + videoId, currentSecond);
    }
}
</pre></div>
        </div>
    </div>
</div>

<!-- ============ COMPLETE VIDEO FLOW ============ -->
<div class="section theme-teal">
    <div class="section-title"><span class="section-num">13</span>Complete Video Flow &mdash; End to End</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">End-to-End Flow</span></div><pre class="code-block">
<span class="cm">========= UPLOAD PHASE =========</span>

<span class="kw">Step 1:</span> Creator clicks "Upload" &rarr; POST /api/v1/videos/upload/initiate
        <span class="cm">// Upload session create hota hai, presigned URL milta hai</span>
        <span class="cm">// Video record DB me banta hai status=UPLOADING</span>

<span class="kw">Step 2:</span> Client chunks video (5MB each) &rarr; uploads to S3 via presigned URL
        <span class="cm">// Resumable hai &mdash; network fail pe jahan ruka tha wahi se</span>
        <span class="cm">// Progress bar dikhta hai creator ko</span>

<span class="kw">Step 3:</span> All chunks uploaded &rarr; POST /api/v1/videos/upload/{uploadId}/complete
        <span class="cm">// S3 multipart upload complete hota hai</span>
        <span class="cm">// VideoUploadEvent publish hota hai Kafka pe</span>

<span class="cm">========= PROCESSING PHASE =========</span>

<span class="kw">Step 4:</span> TranscodingPipeline picks up event &rarr; fan-out 4-6 transcode jobs
        <span class="cm">// Parallel jobs: 360p, 480p, 720p, 1080p (+ 4K if source supports)</span>
        <span class="cm">// Video status = TRANSCODING</span>

<span class="kw">Step 5:</span> FFmpeg workers transcode + generate HLS segments (.ts + .m3u8)
        <span class="cm">// 6-second segments, multiple bitrates</span>
        <span class="cm">// Segments upload hote hai S3 pe: transcoded/{videoId}/{resolution}/</span>

<span class="kw">Step 6:</span> ThumbnailService generates 3 auto-thumbnails from key frames
        <span class="cm">// Creator apna custom thumbnail bhi upload kar sakta hai</span>

<span class="kw">Step 7:</span> ModerationService runs content check (NSFW, copyright, violence)
        <span class="cm">// Content ID system audio fingerprint check karta hai</span>

<span class="kw">Step 8:</span> All variants complete &rarr; master .m3u8 manifest generate hota hai
        <span class="cm">// Video status = READY, visibility = PUBLIC (ya scheduled)</span>

<span class="cm">========= DISCOVERY PHASE =========</span>

<span class="kw">Step 9:</span>  Video Elasticsearch me index hota hai (title, tags, description)
        <span class="cm">// Search me aane lagta hai ab</span>

<span class="kw">Step 10:</span> NotificationService subscribers ko notify karta hai (fan-out)
        <span class="cm">// Kafka se async, millions of subscribers ko batch me</span>
        <span class="cm">// Bell=ALL wale ko push, PERSONALIZED wale ko selective</span>

<span class="kw">Step 11:</span> RecommendationService naye video ko candidate pool me add karta hai
        <span class="cm">// Channel ki past performance se initial score milta hai</span>

<span class="cm">========= VIEWING PHASE =========</span>

<span class="kw">Step 12:</span> Viewer clicks video &rarr; GET /api/v1/videos/{videoId}
        <span class="cm">// Metadata + stream URL return hota hai</span>
        <span class="cm">// Ad placements calculate hote hai (pre-roll, mid-roll)</span>

<span class="kw">Step 13:</span> Player requests master.m3u8 from CDN edge
        <span class="cm">// GeoDNS nearest edge resolve karta hai</span>
        <span class="cm">// ABR algorithm bandwidth check karke resolution select karta hai</span>

<span class="kw">Step 14:</span> Player downloads .ts segments sequentially from CDN
        <span class="cm">// 6-second segments, buffer 15-30 sec maintain</span>
        <span class="cm">// Quality auto-adjusts based on bandwidth</span>

<span class="kw">Step 15:</span> Watch progress saved every 10s &rarr; Redis buffer &rarr; batch DB write
        <span class="cm">// Resume playback ke liye</span>

<span class="cm">========= ENGAGEMENT PHASE =========</span>

<span class="kw">Step 16:</span> View count increment &rarr; Redis INCR (atomic, eventually consistent)
        <span class="cm">// Batch flush to DB every 30 seconds</span>
        <span class="cm">// View event Kafka pe publish &rarr; updates recommendations + trending</span>

<span class="kw">Step 17:</span> Like/Comment/Share &rarr; engagement signals recommendation engine ko
        <span class="cm">// Higher engagement = more recommendations</span>
        <span class="cm">// Comment pe notification jaata hai video owner ko</span>
</pre></div>
</div>

<!-- ============ YOUTUBE vs NETFLIX vs TWITCH ============ -->
<div class="section theme-pink">
    <div class="section-title"><span class="section-num">14</span>YouTube vs Netflix vs Twitch</div>
    <div class="service-grid">
        <div class="service-card">
            <h3>YouTube</h3>
            <p class="svc-desc"><strong>Content Model:</strong> User-Generated Content (UGC) &mdash; koi bhi upload kar sakta hai<br><br>
            <strong>Revenue:</strong> Ad-supported (55% creator, 45% YouTube) + Premium subscription + Super Chat + Memberships<br><br>
            <strong>Transcoding:</strong> Har video ko 6-8 resolutions me transcode karna padta hai, 500 hrs/min upload rate<br><br>
            <strong>Recommendation:</strong> Watch time optimization, two-stage (candidate gen + ranking), Deep Neural Network<br><br>
            <strong>Scale:</strong> 2B+ MAU, 800M+ videos, 1B+ hrs watched/day<br><br>
            <strong>Special:</strong> Shorts (TikTok competitor), Community posts, Premiere, YouTube Music, YouTube TV</p>
        </div>
        <div class="service-card">
            <h3>Netflix</h3>
            <p class="svc-desc"><strong>Content Model:</strong> Licensed + Original content &mdash; professional studio-grade content only<br><br>
            <strong>Revenue:</strong> Pure subscription model (no ads in premium), 4 tier plans<br><br>
            <strong>Transcoding:</strong> One-time transcode per title, pre-positioned on CDN, less churn than YouTube<br><br>
            <strong>Recommendation:</strong> Personalized artwork, row-based browsing, 80% content discovered via recommendations<br><br>
            <strong>Scale:</strong> 250M+ subscribers, ~20K titles, 15M concurrent streams<br><br>
            <strong>Special:</strong> Multiple profiles (5), offline download, DRM enforcement, regional licensing, parental controls</p>
        </div>
        <div class="service-card">
            <h3>Twitch</h3>
            <p class="svc-desc"><strong>Content Model:</strong> Live streaming focused &mdash; gaming, IRL, creative streams. VOD secondary<br><br>
            <strong>Revenue:</strong> Subscriptions (creator gets 50-70%), Bits (virtual currency), ads, sponsorships<br><br>
            <strong>Transcoding:</strong> Real-time transcoding (live), RTMP ingest &rarr; HLS output, &lt;5 sec latency target<br><br>
            <strong>Recommendation:</strong> Category-based browsing, viewer count ranking, raid/host system for discovery<br><br>
            <strong>Scale:</strong> 140M+ MAU, 7M+ streamers, 2.5M concurrent peak<br><br>
            <strong>Special:</strong> Live chat (high velocity), emotes, clips, channel points, raids, drops, extensions</p>
        </div>
    </div>
</div>

<!-- ============ BOTTLENECKS & SOLUTIONS ============ -->
<div class="section theme-red">
    <div class="section-title"><span class="section-num">15</span>Bottlenecks &amp; Solutions</div>
    <div class="bottleneck-grid">
        <div class="bottleneck-item"><span class="bottleneck-problem">Transcoding CPU bottleneck (500 hrs/min)</span><span class="bottleneck-arrow">&rarr;</span><span class="bottleneck-solution">GPU workers (NVENC), K8s auto-scale by queue depth, priority queue</span></div>
        <div class="bottleneck-item"><span class="bottleneck-problem">View count hot key (viral video)</span><span class="bottleneck-arrow">&rarr;</span><span class="bottleneck-solution">Redis INCR buffer, batch flush to DB every 30s, 10 sharded counters</span></div>
        <div class="bottleneck-item"><span class="bottleneck-problem">Subscriber notification fan-out (250M+)</span><span class="bottleneck-arrow">&rarr;</span><span class="bottleneck-solution">Kafka partitioned fan-out, priority tiers (bell=ALL first), rate limiting</span></div>
        <div class="bottleneck-item"><span class="bottleneck-problem">CDN cache miss storm on viral release</span><span class="bottleneck-arrow">&rarr;</span><span class="bottleneck-solution">Pre-warm CDN, origin shield layer, request coalescing for same segment</span></div>
        <div class="bottleneck-item"><span class="bottleneck-problem">Comment spam &amp; moderation</span><span class="bottleneck-arrow">&rarr;</span><span class="bottleneck-solution">ML spam pipeline (async), profanity filter real-time, shadowban offenders</span></div>
        <div class="bottleneck-item"><span class="bottleneck-problem">Search index staleness for new uploads</span><span class="bottleneck-arrow">&rarr;</span><span class="bottleneck-solution">Kafka CDC pipeline for near real-time Elasticsearch index update</span></div>
        <div class="bottleneck-item"><span class="bottleneck-problem">Storage cost explosion</span><span class="bottleneck-arrow">&rarr;</span><span class="bottleneck-solution">Tiered storage: hot (SSD), warm (S3 IA), cold (Glacier). Delete old low-res</span></div>
        <div class="bottleneck-item"><span class="bottleneck-problem">Recommendation cold start (new user)</span><span class="bottleneck-arrow">&rarr;</span><span class="bottleneck-solution">Region trending, genre preference at signup, 10-20% exploration budget</span></div>
    </div>
</div>

<!-- ============ 16. UML CLASS DIAGRAM ============ -->
<div class="section theme-deepblue">
    <div class="section-title"><span class="section-num">16</span>UML Class Diagram</div>
    <div class="uml-diagram">

        <div class="uml-section-label">Entity Classes</div>
        <div class="uml-grid">
            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;entity&raquo;</span>User</div>
                <div class="uml-attributes">
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">id</span><span class="uml-type">Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">username</span><span class="uml-type">String</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">email</span><span class="uml-type">String</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">avatarUrl</span><span class="uml-type">String</span></div>
                </div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getChannel()</span><span class="uml-type">Channel</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getSubscriptions()</span><span class="uml-type">List&lt;Subscription&gt;</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getWatchHistory()</span><span class="uml-type">List&lt;WatchHistory&gt;</span></div>
                </div>
            </div>

            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;entity&raquo;</span>Channel</div>
                <div class="uml-attributes">
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">id</span><span class="uml-type">Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">userId</span><span class="uml-type">Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">channelName</span><span class="uml-type">String</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">subscriberCount</span><span class="uml-type">Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">totalViews</span><span class="uml-type">Long</span></div>
                </div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getVideos()</span><span class="uml-type">List&lt;Video&gt;</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getPlaylists()</span><span class="uml-type">List&lt;Playlist&gt;</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">updateSubscriberCount()</span><span class="uml-type">void</span></div>
                </div>
            </div>

            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;entity&raquo;</span>Video</div>
                <div class="uml-attributes">
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">id</span><span class="uml-type">Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">channelId</span><span class="uml-type">Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">title</span><span class="uml-type">String</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">status</span><span class="uml-type">VideoStatus</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">visibility</span><span class="uml-type">Visibility</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">viewCount</span><span class="uml-type">Long</span></div>
                </div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getVariants()</span><span class="uml-type">List&lt;VideoVariant&gt;</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getComments()</span><span class="uml-type">List&lt;Comment&gt;</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">incrementViewCount()</span><span class="uml-type">void</span></div>
                </div>
            </div>

            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;entity&raquo;</span>VideoVariant</div>
                <div class="uml-attributes">
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">id</span><span class="uml-type">Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">videoId</span><span class="uml-type">Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">resolution</span><span class="uml-type">Resolution</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">bitrateKbps</span><span class="uml-type">int</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">fileUrl</span><span class="uml-type">String</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">fileSize</span><span class="uml-type">Long</span></div>
                </div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getStreamUrl()</span><span class="uml-type">String</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getManifest()</span><span class="uml-type">String</span></div>
                </div>
            </div>

            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;entity&raquo;</span>Comment</div>
                <div class="uml-attributes">
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">id</span><span class="uml-type">Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">videoId</span><span class="uml-type">Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">userId</span><span class="uml-type">Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">text</span><span class="uml-type">String</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">likeCount</span><span class="uml-type">int</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">replyCount</span><span class="uml-type">int</span></div>
                </div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getReplies()</span><span class="uml-type">List&lt;Comment&gt;</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">like()</span><span class="uml-type">void</span></div>
                </div>
            </div>

            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;entity&raquo;</span>Playlist</div>
                <div class="uml-attributes">
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">id</span><span class="uml-type">Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">channelId</span><span class="uml-type">Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">title</span><span class="uml-type">String</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">type</span><span class="uml-type">PlaylistType</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">videoCount</span><span class="uml-type">int</span></div>
                </div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">addVideo()</span><span class="uml-type">void</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getVideos()</span><span class="uml-type">List&lt;Video&gt;</span></div>
                </div>
            </div>

            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;entity&raquo;</span>Subscription</div>
                <div class="uml-attributes">
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">id</span><span class="uml-type">Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">subscriberId</span><span class="uml-type">Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">channelId</span><span class="uml-type">Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">tier</span><span class="uml-type">SubscriptionTier</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">isActive</span><span class="uml-type">boolean</span></div>
                </div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">subscribe()</span><span class="uml-type">void</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">unsubscribe()</span><span class="uml-type">void</span></div>
                </div>
            </div>

            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;entity&raquo;</span>WatchHistory</div>
                <div class="uml-attributes">
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">id</span><span class="uml-type">Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">userId</span><span class="uml-type">Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">videoId</span><span class="uml-type">Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">watchDuration</span><span class="uml-type">int</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">watchedAt</span><span class="uml-type">LocalDateTime</span></div>
                </div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getVideo()</span><span class="uml-type">Video</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getWatchPercentage()</span><span class="uml-type">double</span></div>
                </div>
            </div>
        </div>

        <div class="uml-section-label">Enums</div>
        <div class="uml-grid">
            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;enum&raquo;</span>VideoStatus</div>
                <div class="uml-attributes">
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">UPLOADING</span></div>
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">TRANSCODING</span></div>
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">PUBLISHED</span></div>
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">FAILED</span></div>
                </div>
            </div>
            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;enum&raquo;</span>Resolution</div>
                <div class="uml-attributes">
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">RES_144P</span></div>
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">RES_360P</span></div>
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">RES_720P</span></div>
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">RES_1080P</span></div>
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">RES_4K</span></div>
                </div>
            </div>
            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;enum&raquo;</span>Visibility</div>
                <div class="uml-attributes">
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">PUBLIC</span></div>
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">UNLISTED</span></div>
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">PRIVATE</span></div>
                </div>
            </div>
            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;enum&raquo;</span>Category</div>
                <div class="uml-attributes">
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">MUSIC</span></div>
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">GAMING</span></div>
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">EDUCATION</span></div>
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">ENTERTAINMENT</span></div>
                </div>
            </div>
            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;enum&raquo;</span>AdType</div>
                <div class="uml-attributes">
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">PRE_ROLL</span></div>
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">MID_ROLL</span></div>
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">POST_ROLL</span></div>
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">BANNER</span></div>
                </div>
            </div>
            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;enum&raquo;</span>PlaylistType</div>
                <div class="uml-attributes">
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">NORMAL</span></div>
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">WATCH_LATER</span></div>
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">LIKED_VIDEOS</span></div>
                </div>
            </div>
            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;enum&raquo;</span>SubscriptionTier</div>
                <div class="uml-attributes">
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">FREE</span></div>
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">PREMIUM</span></div>
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">MEMBER</span></div>
                </div>
            </div>
        </div>

        <div class="uml-section-label">Service Classes</div>
        <div class="uml-grid">
            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;service&raquo;</span>ChannelService</div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">createChannel()</span><span class="uml-type">Channel</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getChannelStats()</span><span class="uml-type">ChannelStats</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">updateChannel()</span><span class="uml-type">void</span></div>
                </div>
            </div>
            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;service&raquo;</span>VideoUploadService</div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">initiateUpload()</span><span class="uml-type">String</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">uploadChunk()</span><span class="uml-type">void</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">completeUpload()</span><span class="uml-type">Video</span></div>
                </div>
            </div>
            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;service&raquo;</span>TranscodingService</div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">transcode()</span><span class="uml-type">List&lt;VideoVariant&gt;</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">generateThumbnail()</span><span class="uml-type">String</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getProgress()</span><span class="uml-type">double</span></div>
                </div>
            </div>
            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;service&raquo;</span>StreamingService</div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getManifest()</span><span class="uml-type">String</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getSegment()</span><span class="uml-type">byte[]</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">selectQuality()</span><span class="uml-type">VideoVariant</span></div>
                </div>
            </div>
            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;service&raquo;</span>SearchService</div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">search()</span><span class="uml-type">List&lt;Video&gt;</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">suggest()</span><span class="uml-type">List&lt;String&gt;</span></div>
                </div>
            </div>
            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;service&raquo;</span>RecommendationService</div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getHomeFeed()</span><span class="uml-type">List&lt;Video&gt;</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getRelatedVideos()</span><span class="uml-type">List&lt;Video&gt;</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getTrending()</span><span class="uml-type">List&lt;Video&gt;</span></div>
                </div>
            </div>
            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;service&raquo;</span>PlaylistService</div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">createPlaylist()</span><span class="uml-type">Playlist</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">addVideo()</span><span class="uml-type">void</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">removeVideo()</span><span class="uml-type">void</span></div>
                </div>
            </div>
            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;service&raquo;</span>CommentService</div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">addComment()</span><span class="uml-type">Comment</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">deleteComment()</span><span class="uml-type">void</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getComments()</span><span class="uml-type">List&lt;Comment&gt;</span></div>
                </div>
            </div>
            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;service&raquo;</span>MonetizationService</div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">insertAd()</span><span class="uml-type">Ad</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">calculateRevenue()</span><span class="uml-type">BigDecimal</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getEarnings()</span><span class="uml-type">BigDecimal</span></div>
                </div>
            </div>
        </div>

        <div class="uml-relations">
            <h4>Relationships</h4>
            <div class="uml-rel">
                <span class="uml-rel-from">User</span>
                <span class="uml-rel-arrow">1 ────── 1</span>
                <span class="uml-rel-to">Channel</span>
                <span class="uml-rel-label">owns</span>
                <span class="uml-rel-type">ONE-TO-ONE</span>
            </div>
            <div class="uml-rel">
                <span class="uml-rel-from">Channel</span>
                <span class="uml-rel-arrow">1 ────── N</span>
                <span class="uml-rel-to">Video</span>
                <span class="uml-rel-label">uploads</span>
                <span class="uml-rel-type">ONE-TO-MANY</span>
            </div>
            <div class="uml-rel">
                <span class="uml-rel-from">Video</span>
                <span class="uml-rel-arrow">1 ────── N</span>
                <span class="uml-rel-to">VideoVariant</span>
                <span class="uml-rel-label">transcoded into</span>
                <span class="uml-rel-type">ONE-TO-MANY</span>
            </div>
            <div class="uml-rel">
                <span class="uml-rel-from">Video</span>
                <span class="uml-rel-arrow">1 ────── N</span>
                <span class="uml-rel-to">Comment</span>
                <span class="uml-rel-label">has</span>
                <span class="uml-rel-type">ONE-TO-MANY</span>
            </div>
            <div class="uml-rel">
                <span class="uml-rel-from">Channel</span>
                <span class="uml-rel-arrow">1 ────── N</span>
                <span class="uml-rel-to">Playlist</span>
                <span class="uml-rel-label">creates</span>
                <span class="uml-rel-type">ONE-TO-MANY</span>
            </div>
            <div class="uml-rel">
                <span class="uml-rel-from">User</span>
                <span class="uml-rel-arrow">1 ────── N</span>
                <span class="uml-rel-to">Subscription</span>
                <span class="uml-rel-label">subscribes</span>
                <span class="uml-rel-type">ONE-TO-MANY</span>
            </div>
            <div class="uml-rel">
                <span class="uml-rel-from">User</span>
                <span class="uml-rel-arrow">1 ────── N</span>
                <span class="uml-rel-to">WatchHistory</span>
                <span class="uml-rel-label">watches</span>
                <span class="uml-rel-type">ONE-TO-MANY</span>
            </div>
        </div>

        <div class="uml-note">
            <strong>Hinglish Explanation:</strong> Yeh UML diagram YouTube ka complete class design dikhata hai &mdash; User ka Channel hota hai jisme Videos upload hoti hain. Har Video multiple VideoVariants me transcode hoti hai (144p se 4K tak). RecommendationService WatchHistory ke basis pe personalized feed banata hai. MonetizationService ads aur revenue handle karta hai.
        </div>
    </div>
</div>

<!-- ============ INTERVIEW TIPS ============ -->
<div class="section theme-orange">
    <div class="section-title"><span class="section-num">17</span>Interview Summary</div>
    <div class="summary-grid">
        <div class="summary-card sc-1"><h4>Chunked Upload (TUS)</h4><p>Resumable, parallel chunks with checksum</p></div>
        <div class="summary-card sc-2"><h4>FFmpeg Transcoding</h4><p>Kafka fan-out to GPU workers, 4-8 resolutions</p></div>
        <div class="summary-card sc-3"><h4>HLS Streaming</h4><p>6-sec .ts segments + .m3u8 manifest</p></div>
        <div class="summary-card sc-4"><h4>Adaptive Bitrate (ABR)</h4><p>Quality auto-adjusts based on bandwidth</p></div>
        <div class="summary-card sc-1"><h4>CDN Edge Caching</h4><p>GeoDNS + origin shield + pre-warm trending</p></div>
        <div class="summary-card sc-2"><h4>Recommendation (2-stage)</h4><p>Candidate gen (1000s) &rarr; Ranking (top 50)</p></div>
        <div class="summary-card sc-3"><h4>View Count (Redis)</h4><p>Atomic INCR, batch DB flush, sharded counters</p></div>
        <div class="summary-card sc-4"><h4>Monetization</h4><p>Pre/mid/post-roll ads, RTB auction, 55% creator share</p></div>
        <div class="summary-card sc-1"><h4>Strategy Pattern</h4><p>ITranscoder &mdash; H264/VP9/AV1 plug-and-play</p></div>
        <div class="summary-card sc-2"><h4>Producer-Consumer</h4><p>Kafka decouples upload from transcoding</p></div>
        <div class="summary-card sc-3"><h4>Content ID</h4><p>Audio/video fingerprint for copyright detection</p></div>
        <div class="summary-card sc-4"><h4>Scale Numbers</h4><p>2B MAU, 500 hrs/min upload, 1B hrs/day watch</p></div>
    </div>
    <p style="text-align:center;margin-top:24px;color:#78909c;font-size:1em">
        Complete YouTube LLD for <strong style="color:#ff1744">Java Spring Boot</strong> interviews &mdash; covers Transcoding, CDN, Recommendation, Monetization &amp; Scalability.
    </p>
</div>

`
}
