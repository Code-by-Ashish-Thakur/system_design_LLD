export default {
  title: "Social Media &mdash; Low Level Design",
  subtitle: "Complete LLD for Facebook / Instagram / Twitter &mdash; Java Spring Boot Interview",
  subtitleColor: "#f8bbd0",
  headerGradient: "linear-gradient(135deg,#e91e63,#9c27b0,#673ab7)",
  footerText: "Social Media (Facebook / Instagram / Twitter) &mdash; LLD",
  content: `
<!-- ============ 1. FUNCTIONAL REQUIREMENTS ============ -->
<div class="section theme-green">
    <div class="section-title"><span class="section-num">1</span>Functional Requirements</div>
    <div class="req-grid">
        <div class="req-pill"><span class="num">1</span><div class="fr-content"><div class="fr-en">User Registration &amp; Login (OAuth / Email / Phone)</div><div class="fr-hi">Ye requirement isliye hai taki user securely register aur login kar sake — Facebook me email, Instagram me phone/email, Twitter me email/phone se signup hota hai. OAuth se Google/Apple login bhi support karna padta hai</div></div></div>
        <div class="req-pill"><span class="num">2</span><div class="fr-content"><div class="fr-en">User Profile (Bio, Avatar, Cover Photo)</div><div class="fr-hi">Ye feature isliye hai taki user apni identity create kar sake — profile picture, bio, website link, location sab dikhta hai. Instagram me highlights, Twitter me pinned tweet, Facebook me cover photo — sab profile ka part hai</div></div></div>
        <div class="req-pill"><span class="num">3</span><div class="fr-content"><div class="fr-en">Create Post (Text, Image, Video, Link)</div><div class="fr-hi">Ye poore platform ka core hai — user text, photo, video ya link share kar sake. Instagram me photo/video mandatory hai, Twitter me 280 char limit, Facebook me sab kuch allowed. Media S3 pe store hota hai aur CDN se serve hota hai</div></div></div>
        <div class="req-pill"><span class="num">4</span><div class="fr-content"><div class="fr-en">News Feed Generation</div><div class="fr-hi">Ye sabse important aur complex feature hai — user ko uske friends/followers ki posts chronologically ya algorithmically dikhani hai. Fan-out-on-write ya fan-out-on-read strategy decide karni padti hai. Ye poore system ki backbone hai</div></div></div>
        <div class="req-pill"><span class="num">5</span><div class="fr-content"><div class="fr-en">Like / React on Posts</div><div class="fr-hi">Ye engagement ka foundation hai — Facebook me 6 reactions (Like, Love, Haha, Wow, Sad, Angry), Instagram me like + double-tap, Twitter me like (heart). Like count real-time update hona chahiye</div></div></div>
        <div class="req-pill"><span class="num">6</span><div class="fr-content"><div class="fr-en">Comment &amp; Reply (Nested Comments)</div><div class="fr-hi">Ye feature isliye hai taki users post pe discussion kar sake — Facebook/Instagram me nested replies support hai. Comment pe bhi like kar sakte hai. Threaded comments tree structure me store hote hai</div></div></div>
        <div class="req-pill"><span class="num">7</span><div class="fr-content"><div class="fr-en">Follow / Unfollow (Friend System)</div><div class="fr-hi">Ye social graph ka core hai — Instagram/Twitter me one-way follow (asymmetric), Facebook me two-way friendship (symmetric). Follow karne se us user ki posts tumhare feed me aayengi</div></div></div>
        <div class="req-pill"><span class="num">8</span><div class="fr-content"><div class="fr-en">Share / Repost / Retweet</div><div class="fr-hi">Ye content virality ka engine hai — Twitter me retweet, Facebook me share, Instagram me story reshare. Original post ka reference rakhte hue apne followers ko dikhana hai</div></div></div>
        <div class="req-pill"><span class="num">9</span><div class="fr-content"><div class="fr-en">Stories (24-hour Expiry)</div><div class="fr-hi">Ye feature isliye hai taki user temporary content share kar sake — Instagram/Facebook stories 24 ghante me expire ho jaati hai. Viewers list dikhti hai, highlights me permanently save kar sakte hai</div></div></div>
        <div class="req-pill"><span class="num">10</span><div class="fr-content"><div class="fr-en">Search (Users, Posts, Hashtags)</div><div class="fr-hi">Ye discovery ka main tool hai — user search kare to users, posts, hashtags, locations sab milne chahiye. Elasticsearch se full-text search hota hai with autocomplete aur trending suggestions</div></div></div>
        <div class="req-pill"><span class="num">11</span><div class="fr-content"><div class="fr-en">Hashtags &amp; Trending Topics</div><div class="fr-hi">Ye content discovery aur categorization ke liye hai — #coding likhne se sab coding posts ek jagah milte hai. Trending topics real-time me calculate hote hai based on velocity of mentions</div></div></div>
        <div class="req-pill"><span class="num">12</span><div class="fr-content"><div class="fr-en">Notifications (Push, In-App, Email)</div><div class="fr-hi">Ye engagement driver hai — kisi ne like kiya, comment kiya, follow kiya to user ko turant pata chalna chahiye. Push notification + in-app notification bell + email digest — sab channels pe notify karna hai</div></div></div>
        <div class="req-pill"><span class="num">13</span><div class="fr-content"><div class="fr-en">Direct Messages (DM)</div><div class="fr-hi">Ye private messaging feature hai — Instagram DM, Twitter DM, Facebook Messenger. One-to-one aur group messages, media sharing, read receipts — basically ek mini chat app andar hai</div></div></div>
        <div class="req-pill"><span class="num">14</span><div class="fr-content"><div class="fr-en">Bookmark / Save Post</div><div class="fr-hi">Ye feature isliye hai taki user interesting posts baad me dekhne ke liye save kar sake — Instagram me saved collections, Twitter me bookmarks, Facebook me saved items. Private hai, kisi ko nahi dikhta</div></div></div>
        <div class="req-pill"><span class="num">15</span><div class="fr-content"><div class="fr-en">Content Moderation &amp; Reporting</div><div class="fr-hi">Ye platform safety ke liye zaroori hai — users inappropriate content report kar sake, AI-based auto-detection for NSFW/spam/hate speech. Reported content review queue me jaata hai for manual moderation</div></div></div>
        <div class="req-pill"><span class="num">16</span><div class="fr-content"><div class="fr-en">Block / Mute User</div><div class="fr-hi">Ye privacy control hai — block karne se wo user tumhara profile, posts kuch nahi dekh sakta. Mute karne se uski posts tumhare feed me nahi aayengi but follow remain karega. Harassment prevention ke liye critical hai</div></div></div>
    </div>
</div>

<!-- ============ 2. NON-FUNCTIONAL REQUIREMENTS ============ -->
<div class="section theme-pink">
    <div class="section-title"><span class="section-num">2</span>Non-Functional Requirements</div>
    <div class="req-grid">
        <div class="req-pill"><span class="num">1</span><div class="nfr-content"><div class="nfr-en">Low Latency &mdash; Feed load under 200ms, likes under 50ms</div><div class="nfr-hi">Feed &lt; 200ms me load hona chahiye, like/comment &lt; 50ms me reflect hona chahiye &mdash; slow feed pe user swipe karke chala jaayega</div></div></div>
        <div class="req-pill"><span class="num">2</span><div class="nfr-content"><div class="nfr-en">High Availability &mdash; 99.99% uptime globally</div><div class="nfr-hi">99.99% uptime hona chahiye &mdash; Facebook/Instagram 1 ghanta bhi down ho to worldwide news ban jaati hai, billions of users depend karte hai</div></div></div>
        <div class="req-pill"><span class="num">3</span><div class="nfr-content"><div class="nfr-en">Scalability &mdash; Handle 2B+ daily active users</div><div class="nfr-hi">2B+ DAU handle karne padenge &mdash; Facebook pe daily 4B+ posts hote hai, horizontal scaling + sharding mandatory hai</div></div></div>
        <div class="req-pill"><span class="num">4</span><div class="nfr-content"><div class="nfr-en">Eventual Consistency &mdash; Like counts can be slightly delayed</div><div class="nfr-hi">Like count 2-3 sec delay se update ho sakta hai &mdash; strong consistency itne scale pe impossible hai, eventual consistency se performance milta hai</div></div></div>
        <div class="req-pill"><span class="num">5</span><div class="nfr-content"><div class="nfr-en">CDN &mdash; Media delivery from nearest edge server</div><div class="nfr-hi">Images/videos nearest CDN edge se serve hone chahiye &mdash; India ka user India ke server se photo dekhe, US se nahi. Latency 10x kam hoti hai</div></div></div>
        <div class="req-pill"><span class="num">6</span><div class="nfr-content"><div class="nfr-en">Fault Tolerance &mdash; No data loss even during failures</div><div class="nfr-hi">Server crash hone pe bhi post, comment, message lost nahi hona chahiye &mdash; replication + write-ahead log se data safe rehta hai</div></div></div>
    </div>
</div>

<!-- ============ 3. ENUMS ============ -->
<div class="section theme-purple">
    <div class="section-title"><span class="section-num">3</span>Enums</div>
    <div class="enum-grid">
        <div class="enum-card"><h3>PostType</h3><div class="enum-val">TEXT</div><div class="enum-val">IMAGE</div><div class="enum-val">VIDEO</div><div class="enum-val">LINK</div><div class="enum-val">STORY</div><div class="enum-val">REEL</div></div>
        <div class="enum-card"><h3>ReactionType</h3><div class="enum-val">LIKE</div><div class="enum-val">LOVE</div><div class="enum-val">HAHA</div><div class="enum-val">WOW</div><div class="enum-val">SAD</div><div class="enum-val">ANGRY</div></div>
        <div class="enum-card"><h3>Visibility</h3><div class="enum-val">PUBLIC</div><div class="enum-val">FOLLOWERS_ONLY</div><div class="enum-val">PRIVATE</div><div class="enum-val">CLOSE_FRIENDS</div></div>
        <div class="enum-card"><h3>FollowStatus</h3><div class="enum-val">FOLLOWING</div><div class="enum-val">REQUESTED</div><div class="enum-val">BLOCKED</div><div class="enum-val">MUTED</div></div>
        <div class="enum-card"><h3>NotificationType</h3><div class="enum-val">LIKE</div><div class="enum-val">COMMENT</div><div class="enum-val">FOLLOW</div><div class="enum-val">MENTION</div><div class="enum-val">SHARE</div><div class="enum-val">DM</div><div class="enum-val">STORY_VIEW</div></div>
        <div class="enum-card"><h3>ContentStatus</h3><div class="enum-val">ACTIVE</div><div class="enum-val">REPORTED</div><div class="enum-val">UNDER_REVIEW</div><div class="enum-val">REMOVED</div><div class="enum-val">ARCHIVED</div></div>
        <div class="enum-card"><h3>MediaStatus</h3><div class="enum-val">UPLOADING</div><div class="enum-val">PROCESSING</div><div class="enum-val">READY</div><div class="enum-val">FAILED</div></div>
        <div class="enum-card"><h3>StoryStatus</h3><div class="enum-val">ACTIVE</div><div class="enum-val">EXPIRED</div><div class="enum-val">HIGHLIGHTED</div></div>
    </div>
</div>

<!-- ============ 4. SERVICE LLD ============ -->
<div class="section theme-yellow">
    <div class="section-title"><span class="section-num">4</span>Service LLD</div>
    <div class="service-grid">
        <div class="service-card">
            <h3>AuthService</h3>
            <p class="svc-desc">User registration, login, OAuth aur session management handle karta hai</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">AuthService</span> {

    <span class="cm">// email + password se register karta hai</span>
    <span class="tp">User</span> <span class="fn">register</span>(<span class="tp">String</span> email, <span class="tp">String</span> password,
        <span class="tp">String</span> username, <span class="tp">String</span> name)

    <span class="cm">// login karke JWT token return karta hai</span>
    <span class="tp">AuthToken</span> <span class="fn">login</span>(<span class="tp">String</span> emailOrUsername,
        <span class="tp">String</span> password)

    <span class="cm">// Google/Apple/Facebook OAuth login</span>
    <span class="tp">AuthToken</span> <span class="fn">oauthLogin</span>(<span class="tp">String</span> provider,
        <span class="tp">String</span> authCode)

    <span class="cm">// username availability check karta hai</span>
    <span class="tp">boolean</span> <span class="fn">isUsernameAvailable</span>(<span class="tp">String</span> username)

    <span class="cm">// logout aur token invalidate</span>
    <span class="kw">void</span> <span class="fn">logout</span>(<span class="tp">Long</span> userId)
}
</pre></div>
        </div>
        <div class="service-card">
            <h3>UserService</h3>
            <p class="svc-desc">Profile management &mdash; bio update, avatar upload, privacy settings sab yahi handle karta hai</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">UserService</span> {

    <span class="cm">// user profile fetch karta hai</span>
    <span class="tp">UserProfile</span> <span class="fn">getProfile</span>(<span class="tp">String</span> username)

    <span class="cm">// bio, name, website update karta hai</span>
    <span class="tp">UserProfile</span> <span class="fn">updateProfile</span>(<span class="tp">Long</span> userId,
        <span class="tp">UpdateProfileRequest</span> request)

    <span class="cm">// profile picture upload karta hai S3 pe</span>
    <span class="tp">String</span> <span class="fn">uploadAvatar</span>(<span class="tp">Long</span> userId,
        <span class="tp">MultipartFile</span> image)

    <span class="cm">// privacy settings update (public/private account)</span>
    <span class="kw">void</span> <span class="fn">updatePrivacy</span>(<span class="tp">Long</span> userId,
        <span class="tp">PrivacySettings</span> settings)

    <span class="cm">// user search karta hai name/username se</span>
    <span class="tp">List&lt;UserProfile&gt;</span> <span class="fn">searchUsers</span>(<span class="tp">String</span> query,
        <span class="tp">int</span> page, <span class="tp">int</span> size)
}
</pre></div>
        </div>
        <div class="service-card">
            <h3>PostService</h3>
            <p class="svc-desc">Post create, edit, delete aur fetch karne ka poora kaam &mdash; media upload bhi handle karta hai</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">PostService</span> {

    <span class="cm">// naya post create karta hai (text/image/video)</span>
    <span class="tp">Post</span> <span class="fn">createPost</span>(<span class="tp">Long</span> userId, <span class="tp">String</span> content,
        <span class="tp">List&lt;MultipartFile&gt;</span> media, <span class="tp">PostType</span> type,
        <span class="tp">Visibility</span> visibility, <span class="tp">List&lt;String&gt;</span> hashtags)

    <span class="cm">// post fetch karta hai with like/comment count</span>
    <span class="tp">PostDetail</span> <span class="fn">getPost</span>(<span class="tp">String</span> postId, <span class="tp">Long</span> viewerId)

    <span class="cm">// post ka content edit karta hai</span>
    <span class="tp">Post</span> <span class="fn">editPost</span>(<span class="tp">String</span> postId, <span class="tp">Long</span> userId,
        <span class="tp">String</span> newContent)

    <span class="cm">// post delete karta hai (soft delete)</span>
    <span class="kw">void</span> <span class="fn">deletePost</span>(<span class="tp">String</span> postId, <span class="tp">Long</span> userId)

    <span class="cm">// user ki saari posts paginated fetch karta hai</span>
    <span class="tp">Page&lt;Post&gt;</span> <span class="fn">getUserPosts</span>(<span class="tp">Long</span> userId,
        <span class="tp">int</span> page, <span class="tp">int</span> size)

    <span class="cm">// post share/retweet karta hai apne followers ko</span>
    <span class="tp">Post</span> <span class="fn">sharePost</span>(<span class="tp">String</span> postId, <span class="tp">Long</span> userId,
        <span class="tp">String</span> comment)
}
</pre></div>
        </div>
        <div class="service-card">
            <h3>FeedService</h3>
            <p class="svc-desc">News feed generate karta hai &mdash; fan-out-on-write se followers ki feed pre-compute hoti hai, celebrities ke liye fan-out-on-read</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">FeedService</span> {

    <span class="cm">// user ki personalized feed return karta hai</span>
    <span class="tp">List&lt;FeedItem&gt;</span> <span class="fn">getFeed</span>(<span class="tp">Long</span> userId,
        <span class="tp">String</span> cursor, <span class="tp">int</span> size)

    <span class="cm">// naya post aane pe followers ki feed me push karta hai</span>
    <span class="kw">void</span> <span class="fn">fanOutToFollowers</span>(<span class="tp">String</span> postId,
        <span class="tp">Long</span> authorId)

    <span class="cm">// celebrity ki post on-demand merge karta hai read time pe</span>
    <span class="tp">List&lt;FeedItem&gt;</span> <span class="fn">mergeOnRead</span>(<span class="tp">Long</span> userId,
        <span class="tp">List&lt;Long&gt;</span> celebrityIds, <span class="tp">String</span> cursor)

    <span class="cm">// ML ranking model se feed re-rank karta hai</span>
    <span class="tp">List&lt;FeedItem&gt;</span> <span class="fn">rankFeed</span>(<span class="tp">Long</span> userId,
        <span class="tp">List&lt;FeedItem&gt;</span> candidates)

    <span class="cm">// feed cache invalidate karta hai jab settings change ho</span>
    <span class="kw">void</span> <span class="fn">invalidateCache</span>(<span class="tp">Long</span> userId)
}
</pre></div>
        </div>
        <div class="service-card">
            <h3>LikeService</h3>
            <p class="svc-desc">Post aur comment pe like/reaction handle karta hai &mdash; Redis counter se fast count, async DB write</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">LikeService</span> {

    <span class="cm">// post pe like/reaction karta hai</span>
    <span class="kw">void</span> <span class="fn">likePost</span>(<span class="tp">String</span> postId, <span class="tp">Long</span> userId,
        <span class="tp">ReactionType</span> reaction)

    <span class="cm">// post se like hatata hai</span>
    <span class="kw">void</span> <span class="fn">unlikePost</span>(<span class="tp">String</span> postId, <span class="tp">Long</span> userId)

    <span class="cm">// post ka total like count return karta hai</span>
    <span class="tp">Map&lt;ReactionType, Long&gt;</span> <span class="fn">getLikeCounts</span>(
        <span class="tp">String</span> postId)

    <span class="cm">// check karta hai user ne post like kiya hai ya nahi</span>
    <span class="tp">boolean</span> <span class="fn">hasLiked</span>(<span class="tp">String</span> postId, <span class="tp">Long</span> userId)

    <span class="cm">// post ko like karne walon ki list (paginated)</span>
    <span class="tp">Page&lt;UserProfile&gt;</span> <span class="fn">getLikedBy</span>(<span class="tp">String</span> postId,
        <span class="tp">int</span> page, <span class="tp">int</span> size)
}
</pre></div>
        </div>
        <div class="service-card">
            <h3>CommentService</h3>
            <p class="svc-desc">Comments aur nested replies handle karta hai &mdash; tree structure me store hote hai with parent_id reference</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">CommentService</span> {

    <span class="cm">// post pe comment karta hai</span>
    <span class="tp">Comment</span> <span class="fn">addComment</span>(<span class="tp">String</span> postId,
        <span class="tp">Long</span> userId, <span class="tp">String</span> content)

    <span class="cm">// comment pe reply karta hai (nested)</span>
    <span class="tp">Comment</span> <span class="fn">replyToComment</span>(<span class="tp">String</span> commentId,
        <span class="tp">Long</span> userId, <span class="tp">String</span> content)

    <span class="cm">// post ke comments paginated fetch karta hai</span>
    <span class="tp">Page&lt;Comment&gt;</span> <span class="fn">getComments</span>(<span class="tp">String</span> postId,
        <span class="tp">int</span> page, <span class="tp">int</span> size, <span class="tp">String</span> sortBy)

    <span class="cm">// comment delete karta hai</span>
    <span class="kw">void</span> <span class="fn">deleteComment</span>(<span class="tp">String</span> commentId,
        <span class="tp">Long</span> userId)

    <span class="cm">// comment pe like karta hai</span>
    <span class="kw">void</span> <span class="fn">likeComment</span>(<span class="tp">String</span> commentId, <span class="tp">Long</span> userId)
}
</pre></div>
        </div>
        <div class="service-card">
            <h3>FollowService</h3>
            <p class="svc-desc">Follow/unfollow, follow requests (private accounts), block/mute handle karta hai &mdash; social graph ka core</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">FollowService</span> {

    <span class="cm">// user ko follow karta hai (private account pe request jaata hai)</span>
    <span class="tp">FollowStatus</span> <span class="fn">follow</span>(<span class="tp">Long</span> followerId,
        <span class="tp">Long</span> followeeId)

    <span class="cm">// unfollow karta hai</span>
    <span class="kw">void</span> <span class="fn">unfollow</span>(<span class="tp">Long</span> followerId,
        <span class="tp">Long</span> followeeId)

    <span class="cm">// follow request accept karta hai (private account)</span>
    <span class="kw">void</span> <span class="fn">acceptRequest</span>(<span class="tp">Long</span> userId,
        <span class="tp">Long</span> requesterId)

    <span class="cm">// followers ki list return karta hai</span>
    <span class="tp">Page&lt;UserProfile&gt;</span> <span class="fn">getFollowers</span>(<span class="tp">Long</span> userId,
        <span class="tp">int</span> page, <span class="tp">int</span> size)

    <span class="cm">// following ki list return karta hai</span>
    <span class="tp">Page&lt;UserProfile&gt;</span> <span class="fn">getFollowing</span>(<span class="tp">Long</span> userId,
        <span class="tp">int</span> page, <span class="tp">int</span> size)

    <span class="cm">// user ko block karta hai</span>
    <span class="kw">void</span> <span class="fn">blockUser</span>(<span class="tp">Long</span> userId, <span class="tp">Long</span> blockedUserId)

    <span class="cm">// user ko mute karta hai (feed se hide)</span>
    <span class="kw">void</span> <span class="fn">muteUser</span>(<span class="tp">Long</span> userId, <span class="tp">Long</span> mutedUserId)
}
</pre></div>
        </div>
        <div class="service-card">
            <h3>StoryService</h3>
            <p class="svc-desc">Stories create, view, expire aur highlights handle karta hai &mdash; 24 ghante baad auto-delete hoti hai</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">StoryService</span> {

    <span class="cm">// nayi story create karta hai (24hr TTL)</span>
    <span class="tp">Story</span> <span class="fn">createStory</span>(<span class="tp">Long</span> userId,
        <span class="tp">MultipartFile</span> media, <span class="tp">Visibility</span> visibility)

    <span class="cm">// user ke followers ki active stories fetch karta hai</span>
    <span class="tp">List&lt;StoryGroup&gt;</span> <span class="fn">getFeedStories</span>(<span class="tp">Long</span> userId)

    <span class="cm">// story view record karta hai</span>
    <span class="kw">void</span> <span class="fn">viewStory</span>(<span class="tp">String</span> storyId, <span class="tp">Long</span> viewerId)

    <span class="cm">// story ki viewers list return karta hai</span>
    <span class="tp">List&lt;UserProfile&gt;</span> <span class="fn">getViewers</span>(<span class="tp">String</span> storyId)

    <span class="cm">// story ko highlight me permanently save karta hai</span>
    <span class="kw">void</span> <span class="fn">addToHighlight</span>(<span class="tp">String</span> storyId,
        <span class="tp">String</span> highlightName, <span class="tp">Long</span> userId)

    <span class="cm">// expired stories cleanup (scheduled job)</span>
    <span class="kw">void</span> <span class="fn">cleanupExpiredStories</span>()
}
</pre></div>
        </div>
        <div class="service-card">
            <h3>SearchService</h3>
            <p class="svc-desc">Users, posts, hashtags me full-text search karta hai &mdash; Elasticsearch pe autocomplete aur trending bhi</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">SearchService</span> {

    <span class="cm">// users, posts, hashtags me search karta hai</span>
    <span class="tp">SearchResult</span> <span class="fn">search</span>(<span class="tp">String</span> query,
        <span class="tp">String</span> type, <span class="tp">int</span> page, <span class="tp">int</span> size)

    <span class="cm">// type karte waqt autocomplete suggestions</span>
    <span class="tp">List&lt;String&gt;</span> <span class="fn">autoSuggest</span>(<span class="tp">String</span> prefix,
        <span class="tp">int</span> limit)

    <span class="cm">// hashtag se tagged posts fetch karta hai</span>
    <span class="tp">Page&lt;Post&gt;</span> <span class="fn">getPostsByHashtag</span>(<span class="tp">String</span> hashtag,
        <span class="tp">int</span> page, <span class="tp">int</span> size)

    <span class="cm">// trending hashtags return karta hai (time-windowed)</span>
    <span class="tp">List&lt;TrendingTopic&gt;</span> <span class="fn">getTrending</span>(
        <span class="tp">String</span> region, <span class="tp">int</span> limit)
}
</pre></div>
        </div>
        <div class="service-card">
            <h3>NotificationService</h3>
            <p class="svc-desc">Like, comment, follow, mention ke notifications bhejta hai &mdash; push + in-app + email channels</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">NotificationService</span> {

    <span class="cm">// notification create aur send karta hai</span>
    <span class="kw">void</span> <span class="fn">notify</span>(<span class="tp">Long</span> targetUserId,
        <span class="tp">NotificationType</span> type, <span class="tp">Long</span> actorId,
        <span class="tp">String</span> entityId)

    <span class="cm">// user ke notifications paginated fetch</span>
    <span class="tp">Page&lt;Notification&gt;</span> <span class="fn">getNotifications</span>(
        <span class="tp">Long</span> userId, <span class="tp">int</span> page, <span class="tp">int</span> size)

    <span class="cm">// sab notifications read mark karta hai</span>
    <span class="kw">void</span> <span class="fn">markAllRead</span>(<span class="tp">Long</span> userId)

    <span class="cm">// unread notification count return karta hai</span>
    <span class="tp">int</span> <span class="fn">getUnreadCount</span>(<span class="tp">Long</span> userId)

    <span class="cm">// batch notifications aggregate karta hai</span>
    <span class="cm">// "Rahul and 5 others liked your post"</span>
    <span class="kw">void</span> <span class="fn">aggregateNotifications</span>(<span class="tp">Long</span> userId,
        <span class="tp">String</span> entityId)
}
</pre></div>
        </div>
        <div class="service-card">
            <h3>MediaService</h3>
            <p class="svc-desc">Image/video upload, resize, compress aur CDN se serve karta hai &mdash; multiple sizes generate karta hai</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">MediaService</span> {

    <span class="cm">// image upload karta hai S3 pe with compression</span>
    <span class="tp">MediaUrl</span> <span class="fn">uploadImage</span>(<span class="tp">MultipartFile</span> file,
        <span class="tp">Long</span> userId)

    <span class="cm">// video upload karta hai with transcoding trigger</span>
    <span class="tp">MediaUrl</span> <span class="fn">uploadVideo</span>(<span class="tp">MultipartFile</span> file,
        <span class="tp">Long</span> userId)

    <span class="cm">// image ke multiple sizes generate karta hai</span>
    <span class="cm">// (thumbnail 150px, medium 600px, original)</span>
    <span class="tp">Map&lt;String, String&gt;</span> <span class="fn">generateVariants</span>(
        <span class="tp">String</span> imageKey)

    <span class="cm">// CDN signed URL return karta hai</span>
    <span class="tp">String</span> <span class="fn">getCdnUrl</span>(<span class="tp">String</span> mediaKey)
}
</pre></div>
        </div>
        <div class="service-card">
            <h3>ModerationService</h3>
            <p class="svc-desc">Content reporting, AI-based auto-detection aur manual review queue handle karta hai</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">ModerationService</span> {

    <span class="cm">// post/comment report karta hai</span>
    <span class="kw">void</span> <span class="fn">report</span>(<span class="tp">String</span> entityId,
        <span class="tp">String</span> entityType, <span class="tp">Long</span> reporterId,
        <span class="tp">String</span> reason)

    <span class="cm">// AI se NSFW/spam/hate detect karta hai</span>
    <span class="tp">ModerationResult</span> <span class="fn">autoModerate</span>(
        <span class="tp">String</span> content, <span class="tp">List&lt;String&gt;</span> mediaUrls)

    <span class="cm">// manual review ke baad action leta hai</span>
    <span class="kw">void</span> <span class="fn">reviewAction</span>(<span class="tp">String</span> entityId,
        <span class="tp">ContentStatus</span> decision, <span class="tp">Long</span> moderatorId)
}
</pre></div>
        </div>
    </div>
</div>

<!-- ============ 5. APIs ============ -->
<div class="section theme-teal">
    <div class="section-title"><span class="section-num">5</span>APIs (with Request / Response)</div>
    <div class="api-grid">
        <div class="api-card">
            <div class="api-header"><span class="api-method method-post">POST</span><span class="api-path">/api/v1/posts</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Request (multipart/form-data)</div>{
  "content": "Exploring the mountains! #travel #nature",
  "type": "IMAGE",
  "visibility": "PUBLIC",
  "media": [file1.jpg, file2.jpg],
  "hashtags": ["travel", "nature"],
  "location": "Manali, India"
}</div>
                <div class="api-json"><div class="label">Response 201</div>{
  "postId": "post-abc123",
  "userId": 1001,
  "content": "Exploring the mountains! #travel #nature",
  "type": "IMAGE",
  "mediaUrls": [
    "https://cdn.app/img/post-abc123/1.jpg",
    "https://cdn.app/img/post-abc123/2.jpg"
  ],
  "likeCount": 0,
  "commentCount": 0,
  "createdAt": "2025-06-15T10:00:00Z"
}</div>
            </div>
            <div class="api-note">Post create karta hai &mdash; images S3 pe upload hoti hai, multiple sizes generate hote hai (thumbnail, medium, full), CDN se serve hote hai. Hashtags extract karke search index me jaate hai. Fan-out triggered hota hai async</div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-get">GET</span><span class="api-path">/api/v1/feed?cursor={cursor}&amp;size=20</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Response 200</div>{
  "feed": [
    {
      "postId": "post-xyz789",
      "author": { "userId": 2001, "username": "rahul_dev",
                  "avatar": "https://cdn.app/avatars/2001.jpg" },
      "content": "Just shipped a new feature! #coding",
      "type": "TEXT",
      "likeCount": 142,
      "commentCount": 23,
      "hasLiked": true,
      "myReaction": "LIKE",
      "createdAt": "2025-06-15T09:30:00Z"
    }
  ],
  "nextCursor": "eyJsYXN0SWQiOiJwb3N0LXh5ejc4OSJ9",
  "hasMore": true
}</div>
            </div>
            <div class="api-note">Cursor-based pagination se feed fetch karta hai &mdash; offset pagination slow hai billions of posts me, cursor se constant time me next page milta hai. Feed pre-computed hai Redis me (fan-out-on-write). hasLiked field batata hai ki current user ne like kiya hai ya nahi</div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-post">POST</span><span class="api-path">/api/v1/posts/{postId}/like</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Request</div>{
  "reaction": "LOVE"
}</div>
                <div class="api-json"><div class="label">Response 200</div>{
  "postId": "post-abc123",
  "reaction": "LOVE",
  "totalLikes": 1435,
  "reactions": {
    "LIKE": 1200, "LOVE": 150,
    "HAHA": 50, "WOW": 35
  }
}</div>
            </div>
            <div class="api-note">Post pe like/reaction karta hai &mdash; Redis INCR se counter badhta hai instantly, DB write async hota hai via Kafka. Idempotent hai &mdash; dobara bhejne se reaction change hota hai, duplicate nahi banta</div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-post">POST</span><span class="api-path">/api/v1/posts/{postId}/comments</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Request</div>{
  "content": "Amazing view! Where is this exactly?",
  "parentCommentId": null
}</div>
                <div class="api-json"><div class="label">Response 201</div>{
  "commentId": "cmt-456",
  "postId": "post-abc123",
  "userId": 3001,
  "username": "priya_codes",
  "content": "Amazing view! Where is this exactly?",
  "parentCommentId": null,
  "likeCount": 0,
  "replies": [],
  "createdAt": "2025-06-15T10:05:00Z"
}</div>
            </div>
            <div class="api-note">Comment add karta hai &mdash; parentCommentId null hai to top-level comment, kuch hai to nested reply. Post author ko notification jaata hai. @mention detect karke mentioned user ko bhi notify karta hai</div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-post">POST</span><span class="api-path">/api/v1/users/{userId}/follow</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Response 200 (Public Account)</div>{
  "followeeId": 2001,
  "status": "FOLLOWING",
  "followerCount": 15420,
  "followingCount": 340
}</div>
                <div class="api-json"><div class="label">Response 200 (Private Account)</div>{
  "followeeId": 2001,
  "status": "REQUESTED",
  "message": "Follow request sent"
}</div>
            </div>
            <div class="api-note">User ko follow karta hai &mdash; public account hai to direct FOLLOWING, private hai to REQUESTED status milta hai. Follow karne se uski posts tumhare feed me aane lagti hai. Follower count Redis me cached hai</div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-post">POST</span><span class="api-path">/api/v1/stories</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Request (multipart/form-data)</div>{
  "media": story_video.mp4,
  "visibility": "CLOSE_FRIENDS",
  "duration": 15
}</div>
                <div class="api-json"><div class="label">Response 201</div>{
  "storyId": "story-789",
  "userId": 1001,
  "mediaUrl": "https://cdn.app/stories/story-789.mp4",
  "visibility": "CLOSE_FRIENDS",
  "expiresAt": "2025-06-16T10:00:00Z",
  "viewCount": 0
}</div>
            </div>
            <div class="api-note">Story create karta hai &mdash; 24 ghante ka TTL set hota hai. CLOSE_FRIENDS visibility se sirf close friends list wale dekh sakte hai. Redis me TTL set hota hai, scheduled job expired stories S3 se bhi delete karta hai</div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-get">GET</span><span class="api-path">/api/v1/search?q={query}&amp;type=posts&amp;page=1</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Response 200</div>{
  "results": {
    "users": [
      { "userId": 2001, "username": "rahul_dev",
        "name": "Rahul", "avatar": "...", "isFollowing": true }
    ],
    "posts": [
      { "postId": "post-xyz", "content": "...",
        "likeCount": 500, "author": {...} }
    ],
    "hashtags": [
      { "tag": "#coding", "postCount": 2500000 }
    ]
  },
  "trending": ["#coding", "#travel", "#food"]
}</div>
            </div>
            <div class="api-note">Elasticsearch se full-text search karta hai &mdash; users, posts, hashtags me simultaneously search hota hai. Fuzzy matching se typos bhi handle hote hai. Trending topics time-windowed count se calculate hote hai</div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-get">GET</span><span class="api-path">/api/v1/trending?region=IN&amp;limit=10</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Response 200</div>{
  "trending": [
    { "rank": 1, "hashtag": "#IPL2025", "postCount": 5200000,
      "velocity": 12000, "category": "Sports" },
    { "rank": 2, "hashtag": "#coding", "postCount": 2500000,
      "velocity": 8500, "category": "Technology" },
    { "rank": 3, "hashtag": "#monsoon", "postCount": 1800000,
      "velocity": 6200, "category": "Weather" }
  ],
  "region": "IN",
  "updatedAt": "2025-06-15T10:00:00Z"
}</div>
            </div>
            <div class="api-note">Trending topics region-wise return karta hai &mdash; velocity (mentions per hour) se rank hota hai, sirf total count se nahi. Har 5 min me recalculate hota hai. Old topics decay karte hai taki fresh content trending me aaye</div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-post">POST</span><span class="api-path">/api/v1/posts/{postId}/share</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Request</div>{
  "comment": "Must read this thread!",
  "visibility": "PUBLIC"
}</div>
                <div class="api-json"><div class="label">Response 201</div>{
  "shareId": "share-101",
  "originalPost": { "postId": "post-abc123", "author": "rahul_dev" },
  "comment": "Must read this thread!",
  "shareCount": 45,
  "createdAt": "2025-06-15T10:10:00Z"
}</div>
            </div>
            <div class="api-note">Post share/retweet karta hai &mdash; original post ka reference rehta hai (denormalized copy nahi). Share count increment hota hai. Original author ko notification jaata hai. Share bhi ek post hai jo sharer ke followers ki feed me jaata hai</div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-post">POST</span><span class="api-path">/api/v1/users/{userId}/block</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Response 200</div>{
  "blockedUserId": 5001,
  "status": "BLOCKED",
  "actions": [
    "Unfollowed automatically",
    "Removed from your followers",
    "Hidden from search results",
    "Cannot view your profile"
  ]
}</div>
            </div>
            <div class="api-note">User ko block karta hai &mdash; automatically unfollow hota hai dono taraf se, blocked user tumhara profile/posts nahi dekh sakta, search me nahi aata, comment/like nahi kar sakta. Feed se bhi remove hota hai</div>
        </div>
    </div>
</div>

<!-- ============ 6. DATABASE SCHEMA ============ -->
<div class="section theme-pink">
    <div class="section-title"><span class="section-num">6</span>Database Schema</div>

    <div class="dbtech-grid">
        <div class="dbtech-card">
            <div class="dbtech-name">PostgreSQL <span class="dbtech-type">RDBMS</span></div>
            <div class="dbtech-usage">Users, posts, comments, follows &mdash; strong consistency aur ACID transactions ke liye</div>
            <div class="dbtech-tables"><span>users</span><span>posts</span><span>comments</span><span>follows</span><span>blocks</span></div>
        </div>
        <div class="dbtech-card">
            <div class="dbtech-name">Redis <span class="dbtech-type">Cache + Counter</span></div>
            <div class="dbtech-usage">Feed cache, like/follower counts, stories TTL, trending calculation, user sessions</div>
            <div class="dbtech-tables"><span>feed:{userId}</span><span>like_count:{postId}</span><span>followers_count:{userId}</span><span>trending:{region}</span></div>
        </div>
        <div class="dbtech-card">
            <div class="dbtech-name">Cassandra <span class="dbtech-type">Wide-Column</span></div>
            <div class="dbtech-usage">Feed timeline storage, activity logs &mdash; high write throughput aur time-series data ke liye</div>
            <div class="dbtech-tables"><span>user_feed</span><span>user_activity</span></div>
        </div>
        <div class="dbtech-card">
            <div class="dbtech-name">Elasticsearch <span class="dbtech-type">Search Engine</span></div>
            <div class="dbtech-usage">Full-text search for users, posts, hashtags with fuzzy matching aur autocomplete</div>
            <div class="dbtech-tables"><span>users_index</span><span>posts_index</span><span>hashtags_index</span></div>
        </div>
        <div class="dbtech-card">
            <div class="dbtech-name">S3 + CDN <span class="dbtech-type">Object Storage</span></div>
            <div class="dbtech-usage">Images, videos, stories, avatars &mdash; CloudFront CDN se global edge delivery</div>
            <div class="dbtech-tables"><span>posts/</span><span>stories/</span><span>avatars/</span><span>videos/</span></div>
        </div>
    </div>

    <div class="db-grid">
        <div class="db-table">
            <h3>users</h3>
            <ul>
                <li><span class="pk">id BIGINT (PK)</span></li>
                <li>username VARCHAR(30) UNIQUE</li>
                <li>email VARCHAR(255) UNIQUE</li>
                <li>password_hash VARCHAR(255)</li>
                <li>name VARCHAR(100)</li>
                <li>bio VARCHAR(500)</li>
                <li>avatar_url VARCHAR(500)</li>
                <li>cover_url VARCHAR(500)</li>
                <li>website VARCHAR(255)</li>
                <li>is_private BOOLEAN DEFAULT false</li>
                <li>is_verified BOOLEAN DEFAULT false</li>
                <li>follower_count INT DEFAULT 0</li>
                <li>following_count INT DEFAULT 0</li>
                <li>post_count INT DEFAULT 0</li>
                <li>created_at TIMESTAMP</li>
                <li><span class="idx">INDEX idx_username (username)</span></li>
                <li><span class="idx">INDEX idx_email (email)</span></li>
            </ul>
        </div>
        <div class="db-table">
            <h3>posts</h3>
            <ul>
                <li><span class="pk">id VARCHAR(36) (PK)</span></li>
                <li><span class="fk">user_id BIGINT (FK &rarr; users.id)</span></li>
                <li>content TEXT</li>
                <li>type ENUM('TEXT','IMAGE','VIDEO','LINK','REEL')</li>
                <li>visibility ENUM('PUBLIC','FOLLOWERS_ONLY','PRIVATE','CLOSE_FRIENDS')</li>
                <li>media_urls JSON</li>
                <li>location VARCHAR(255)</li>
                <li>like_count INT DEFAULT 0</li>
                <li>comment_count INT DEFAULT 0</li>
                <li>share_count INT DEFAULT 0</li>
                <li>original_post_id VARCHAR(36) NULL</li>
                <li>status ENUM('ACTIVE','REPORTED','REMOVED','ARCHIVED')</li>
                <li>is_edited BOOLEAN DEFAULT false</li>
                <li>created_at TIMESTAMP</li>
                <li>updated_at TIMESTAMP</li>
                <li><span class="idx">INDEX idx_user_posts (user_id, created_at DESC)</span></li>
                <li><span class="idx">INDEX idx_status (status)</span></li>
                <li><span class="idx">INDEX idx_created (created_at DESC)</span></li>
            </ul>
        </div>
        <div class="db-table">
            <h3>likes</h3>
            <ul>
                <li><span class="pk">id BIGINT (PK)</span></li>
                <li><span class="fk">user_id BIGINT (FK &rarr; users.id)</span></li>
                <li><span class="fk">post_id VARCHAR(36) (FK &rarr; posts.id)</span></li>
                <li>reaction ENUM('LIKE','LOVE','HAHA','WOW','SAD','ANGRY')</li>
                <li>created_at TIMESTAMP</li>
                <li><span class="idx">UNIQUE idx_user_post (user_id, post_id)</span></li>
                <li><span class="idx">INDEX idx_post_likes (post_id)</span></li>
            </ul>
        </div>
        <div class="db-table">
            <h3>comments</h3>
            <ul>
                <li><span class="pk">id VARCHAR(36) (PK)</span></li>
                <li><span class="fk">post_id VARCHAR(36) (FK &rarr; posts.id)</span></li>
                <li><span class="fk">user_id BIGINT (FK &rarr; users.id)</span></li>
                <li>parent_comment_id VARCHAR(36) NULL</li>
                <li>content TEXT</li>
                <li>like_count INT DEFAULT 0</li>
                <li>reply_count INT DEFAULT 0</li>
                <li>status ENUM('ACTIVE','REMOVED')</li>
                <li>created_at TIMESTAMP</li>
                <li><span class="idx">INDEX idx_post_comments (post_id, created_at)</span></li>
                <li><span class="idx">INDEX idx_parent (parent_comment_id)</span></li>
            </ul>
        </div>
        <div class="db-table">
            <h3>follows</h3>
            <ul>
                <li><span class="pk">id BIGINT (PK)</span></li>
                <li><span class="fk">follower_id BIGINT (FK &rarr; users.id)</span></li>
                <li><span class="fk">followee_id BIGINT (FK &rarr; users.id)</span></li>
                <li>status ENUM('FOLLOWING','REQUESTED')</li>
                <li>created_at TIMESTAMP</li>
                <li><span class="idx">UNIQUE idx_follow_pair (follower_id, followee_id)</span></li>
                <li><span class="idx">INDEX idx_followee (followee_id)</span></li>
            </ul>
        </div>
        <div class="db-table">
            <h3>stories</h3>
            <ul>
                <li><span class="pk">id VARCHAR(36) (PK)</span></li>
                <li><span class="fk">user_id BIGINT (FK &rarr; users.id)</span></li>
                <li>media_url VARCHAR(500)</li>
                <li>media_type ENUM('IMAGE','VIDEO')</li>
                <li>visibility ENUM('PUBLIC','FOLLOWERS_ONLY','CLOSE_FRIENDS')</li>
                <li>view_count INT DEFAULT 0</li>
                <li>status ENUM('ACTIVE','EXPIRED','HIGHLIGHTED')</li>
                <li>highlight_name VARCHAR(100) NULL</li>
                <li>expires_at TIMESTAMP</li>
                <li>created_at TIMESTAMP</li>
                <li><span class="idx">INDEX idx_user_stories (user_id, status, created_at)</span></li>
                <li><span class="idx">INDEX idx_expiry (expires_at)</span></li>
            </ul>
        </div>
        <div class="db-table">
            <h3>hashtags</h3>
            <ul>
                <li><span class="pk">id BIGINT (PK)</span></li>
                <li>tag VARCHAR(100) UNIQUE</li>
                <li>post_count BIGINT DEFAULT 0</li>
                <li>created_at TIMESTAMP</li>
                <li><span class="idx">INDEX idx_tag (tag)</span></li>
                <li><span class="idx">INDEX idx_count (post_count DESC)</span></li>
            </ul>
        </div>
        <div class="db-table">
            <h3>post_hashtags</h3>
            <ul>
                <li><span class="pk">id BIGINT (PK)</span></li>
                <li><span class="fk">post_id VARCHAR(36) (FK &rarr; posts.id)</span></li>
                <li><span class="fk">hashtag_id BIGINT (FK &rarr; hashtags.id)</span></li>
                <li><span class="idx">INDEX idx_hashtag_posts (hashtag_id, post_id)</span></li>
                <li><span class="idx">UNIQUE idx_post_tag (post_id, hashtag_id)</span></li>
            </ul>
        </div>
        <div class="db-table">
            <h3>notifications</h3>
            <ul>
                <li><span class="pk">id BIGINT (PK)</span></li>
                <li><span class="fk">user_id BIGINT (FK &rarr; users.id)</span></li>
                <li><span class="fk">actor_id BIGINT (FK &rarr; users.id)</span></li>
                <li>type ENUM('LIKE','COMMENT','FOLLOW','MENTION','SHARE','DM')</li>
                <li>entity_id VARCHAR(36)</li>
                <li>entity_type VARCHAR(20)</li>
                <li>is_read BOOLEAN DEFAULT false</li>
                <li>created_at TIMESTAMP</li>
                <li><span class="idx">INDEX idx_user_notif (user_id, is_read, created_at DESC)</span></li>
            </ul>
        </div>
        <div class="db-table">
            <h3>blocks</h3>
            <ul>
                <li><span class="pk">id BIGINT (PK)</span></li>
                <li><span class="fk">blocker_id BIGINT (FK &rarr; users.id)</span></li>
                <li><span class="fk">blocked_id BIGINT (FK &rarr; users.id)</span></li>
                <li>created_at TIMESTAMP</li>
                <li><span class="idx">UNIQUE idx_block_pair (blocker_id, blocked_id)</span></li>
                <li><span class="idx">INDEX idx_blocked (blocked_id)</span></li>
            </ul>
        </div>
    </div>

    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">SQL &mdash; Core Queries</span></div><pre class="code-block">
<span class="cm">-- Post create karo with hashtag linking</span>
<span class="kw">INSERT INTO</span> posts (id, user_id, content, type, visibility, media_urls, location, created_at)
<span class="kw">VALUES</span> (UUID(), :userId, :content, :type, :visibility, :mediaUrls, :location, NOW());

<span class="cm">-- Like karo (idempotent &mdash; duplicate pe reaction update)</span>
<span class="kw">INSERT INTO</span> likes (user_id, post_id, reaction, created_at)
<span class="kw">VALUES</span> (:userId, :postId, :reaction, NOW())
<span class="kw">ON CONFLICT</span> (user_id, post_id) <span class="kw">DO UPDATE SET</span> reaction = :reaction;

<span class="cm">-- Follow karo (public account = FOLLOWING, private = REQUESTED)</span>
<span class="kw">INSERT INTO</span> follows (follower_id, followee_id, status, created_at)
<span class="kw">VALUES</span> (:followerId, :followeeId,
    <span class="kw">CASE WHEN</span> (SELECT is_private FROM users WHERE id = :followeeId) = true
        <span class="kw">THEN</span> 'REQUESTED' <span class="kw">ELSE</span> 'FOLLOWING' <span class="kw">END</span>, NOW());

<span class="cm">-- User ki feed ke liye following users ke posts fetch karo</span>
<span class="kw">SELECT</span> p.*, u.username, u.avatar_url,
    EXISTS(SELECT 1 FROM likes l WHERE l.post_id = p.id AND l.user_id = :viewerId) as has_liked
<span class="kw">FROM</span> posts p
<span class="kw">JOIN</span> users u <span class="kw">ON</span> p.user_id = u.id
<span class="kw">WHERE</span> p.user_id <span class="kw">IN</span> (SELECT followee_id FROM follows WHERE follower_id = :userId AND status = 'FOLLOWING')
    <span class="kw">AND</span> p.status = 'ACTIVE'
    <span class="kw">AND</span> p.user_id <span class="kw">NOT IN</span> (SELECT blocked_id FROM blocks WHERE blocker_id = :userId)
<span class="kw">ORDER BY</span> p.created_at <span class="kw">DESC</span> <span class="kw">LIMIT</span> :size;

<span class="cm">-- Nested comments fetch karo (top-level + replies)</span>
<span class="kw">SELECT</span> c.*, u.username, u.avatar_url
<span class="kw">FROM</span> comments c <span class="kw">JOIN</span> users u <span class="kw">ON</span> c.user_id = u.id
<span class="kw">WHERE</span> c.post_id = :postId <span class="kw">AND</span> c.parent_comment_id <span class="kw">IS NULL</span> <span class="kw">AND</span> c.status = 'ACTIVE'
<span class="kw">ORDER BY</span> c.created_at <span class="kw">DESC</span> <span class="kw">LIMIT</span> :size <span class="kw">OFFSET</span> :offset;

<span class="cm">-- Hashtag ke posts fetch karo (trending page)</span>
<span class="kw">SELECT</span> p.*, u.username, u.avatar_url
<span class="kw">FROM</span> posts p
<span class="kw">JOIN</span> post_hashtags ph <span class="kw">ON</span> p.id = ph.post_id
<span class="kw">JOIN</span> hashtags h <span class="kw">ON</span> ph.hashtag_id = h.id
<span class="kw">JOIN</span> users u <span class="kw">ON</span> p.user_id = u.id
<span class="kw">WHERE</span> h.tag = :hashtag <span class="kw">AND</span> p.status = 'ACTIVE'
<span class="kw">ORDER BY</span> p.created_at <span class="kw">DESC</span> <span class="kw">LIMIT</span> :size;

<span class="cm">-- Expired stories cleanup (scheduled job every hour)</span>
<span class="kw">UPDATE</span> stories <span class="kw">SET</span> status = 'EXPIRED'
<span class="kw">WHERE</span> expires_at &lt; NOW() <span class="kw">AND</span> status = 'ACTIVE' <span class="kw">AND</span> highlight_name <span class="kw">IS NULL</span>;
</pre></div>
</div>

<!-- ============ 7. NEWS FEED ARCHITECTURE ============ -->
<div class="section theme-blue">
    <div class="section-title"><span class="section-num">7</span>News Feed Architecture &mdash; Fan-out Deep Dive</div>
    <div class="service-grid">
        <div class="service-card">
            <h3>Fan-out-on-Write (Push Model)</h3>
            <p class="svc-desc">Post create hote hi sab followers ki feed me push karta hai &mdash; read time pe instant feed milta hai but write expensive hai</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Push Model Architecture</span></div><pre class="code-block">
<span class="cm">// User A creates a post</span>
<span class="cm">// Step 1: Post save hota hai PostgreSQL me</span>
PostService.createPost() &rarr; INSERT INTO posts

<span class="cm">// Step 2: Kafka event trigger hota hai</span>
{ "event": "POST_CREATED", "postId": "post-123", "userId": 1001 }

<span class="cm">// Step 3: Fan-out worker picks up</span>
<span class="cm">// User A ke saare followers fetch karo</span>
SELECT followee_id FROM follows WHERE follower_id = 1001
<span class="cm">// Result: [2001, 2002, 2003, ..., 5000] (5000 followers)</span>

<span class="cm">// Step 4: Har follower ki Redis feed list me push karo</span>
LPUSH feed:2001 "post-123"
LPUSH feed:2002 "post-123"
LPUSH feed:2003 "post-123"
<span class="cm">// ... 5000 Redis writes (parallel, batched)</span>

<span class="cm">// Step 5: Feed list ko trim karo (max 1000 posts)</span>
LTRIM feed:2001 0 999

<span class="cm">// READ TIME: User opens app</span>
<span class="cm">// Simply: LRANGE feed:userId 0 19 &rarr; instant feed!</span>
<span class="cm">// Redis se post IDs lo, DB se post details fetch karo</span>

<span class="cm">// PROS: Read &lt; 10ms (pre-computed)</span>
<span class="cm">// CONS: Celebrity with 100M followers = 100M Redis writes!</span>
</pre></div>
        </div>
        <div class="service-card">
            <h3>Fan-out-on-Read (Pull Model)</h3>
            <p class="svc-desc">Feed request aane pe real-time me following users ki posts fetch karke merge karta hai &mdash; write cheap hai but read expensive</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Pull Model Architecture</span></div><pre class="code-block">
<span class="cm">// User B opens app and requests feed</span>
<span class="cm">// Step 1: User B ke following list fetch karo</span>
SELECT followee_id FROM follows WHERE follower_id = :userId
<span class="cm">// Result: [1001, 1002, 1003, ..., 500] (following 500 users)</span>

<span class="cm">// Step 2: In sab users ki recent posts fetch karo</span>
SELECT * FROM posts
WHERE user_id IN (1001, 1002, ..., 500)
    AND created_at > NOW() - INTERVAL '7 days'
ORDER BY created_at DESC LIMIT 20;

<span class="cm">// Step 3: Merge + rank karo (ML model)</span>
<span class="cm">// Engagement score, recency, relationship closeness</span>

<span class="cm">// PROS: Write instant (no fan-out needed)</span>
<span class="cm">// CONS: Read slow (500 users ke posts merge karna expensive)</span>

<span class="cm">// USE FOR: Celebrities / users with 100K+ followers</span>
<span class="cm">// Unke liye fan-out-on-write = 100M writes per post!</span>
</pre></div>
        </div>
        <div class="service-card">
            <h3>Hybrid Approach (Production Strategy)</h3>
            <p class="svc-desc">Facebook/Instagram/Twitter sab hybrid use karte hai &mdash; normal users ke liye push, celebrities ke liye pull, dono merge karke final feed banta hai</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Hybrid Model (Best of Both)</span></div><pre class="code-block">
<span class="cm">// RULE: Followers < 10K = Fan-out-on-Write (push)</span>
<span class="cm">//        Followers >= 10K = Fan-out-on-Read (pull)</span>

<span class="cm">// When user opens feed:</span>
<span class="cm">// Step 1: Redis se pre-computed feed lo (push model posts)</span>
LRANGE feed:userId 0 49
<span class="cm">// Ye normal friends/small accounts ke posts hai</span>

<span class="cm">// Step 2: Celebrity list fetch karo</span>
<span class="cm">// (jo following me hai aur 10K+ followers hai)</span>
SELECT followee_id FROM follows f
JOIN users u ON f.followee_id = u.id
WHERE f.follower_id = :userId AND u.follower_count >= 10000

<span class="cm">// Step 3: Celebrities ki recent posts real-time fetch karo</span>
SELECT * FROM posts WHERE user_id IN (:celebrityIds)
    AND created_at > :lastFeedTime ORDER BY created_at DESC

<span class="cm">// Step 4: Merge push + pull posts</span>
<span class="cm">// Step 5: ML Ranking model se re-rank</span>
<span class="cm">// Step 6: Return top 20 posts to user</span>

<span class="cm">// RESULT: Fast reads + scalable writes = WIN!</span>
</pre></div>
        </div>
    </div>
</div>

<!-- ============ 8. SOCIAL GRAPH ============ -->
<div class="section theme-green">
    <div class="section-title"><span class="section-num">8</span>Social Graph &mdash; Follow System Deep Dive</div>
    <div class="service-grid">
        <div class="service-card">
            <h3>Graph Storage &amp; Queries</h3>
            <p class="svc-desc">Social graph relational DB + Redis me store hota hai &mdash; mutual friends, suggestions sab graph queries hai</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Social Graph Patterns</span></div><pre class="code-block">
<span class="cm">// ASYMMETRIC follow (Instagram/Twitter)</span>
<span class="cm">// A follows B doesn't mean B follows A</span>
follows table: (follower_id, followee_id, status)

<span class="cm">// SYMMETRIC friendship (Facebook)</span>
<span class="cm">// A friends B means both see each other's posts</span>
<span class="cm">// Stored as 2 rows: (A&rarr;B) + (B&rarr;A)</span>

<span class="cm">// Mutual followers query</span>
<span class="cm">// "Who follows both me and this user?"</span>
SELECT f1.follower_id
FROM follows f1
JOIN follows f2 ON f1.follower_id = f2.follower_id
WHERE f1.followee_id = :userId AND f2.followee_id = :otherUserId
    AND f1.status = 'FOLLOWING' AND f2.status = 'FOLLOWING';

<span class="cm">// "People you may know" (friend-of-friend)</span>
SELECT f2.followee_id, COUNT(*) as mutual_count
FROM follows f1
JOIN follows f2 ON f1.followee_id = f2.follower_id
WHERE f1.follower_id = :userId
    AND f2.followee_id != :userId
    AND f2.followee_id NOT IN (SELECT followee_id FROM follows WHERE follower_id = :userId)
GROUP BY f2.followee_id
ORDER BY mutual_count DESC LIMIT 20;

<span class="cm">// Redis me follower/following count cached hai</span>
INCR followers_count:2001   <span class="cm">// follow pe +1</span>
DECR followers_count:2001   <span class="cm">// unfollow pe -1</span>
</pre></div>
        </div>
    </div>
</div>

<!-- ============ 9. TRENDING ALGORITHM ============ -->
<div class="section theme-purple">
    <div class="section-title"><span class="section-num">9</span>Trending Algorithm &amp; Stories Architecture</div>
    <div class="service-grid">
        <div class="service-card">
            <h3>Trending Calculation</h3>
            <p class="svc-desc">Trending sirf total count se nahi, velocity (mentions per hour) + decay function se calculate hota hai</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Trending Algorithm</span></div><pre class="code-block">
<span class="cm">// VELOCITY-BASED TRENDING (not just total count)</span>
<span class="cm">// "10K mentions in 1 hour" > "100K mentions in 1 week"</span>

<span class="cm">// Redis Sorted Set with time-windowed counting</span>
<span class="cm">// Every time a hashtag is used in a post:</span>
ZINCRBY trending:global 1 "#IPL2025"
ZINCRBY trending:IN 1 "#IPL2025"      <span class="cm">// region-wise</span>

<span class="cm">// Time-windowed counting (sliding window)</span>
<span class="cm">// Maintain separate counters for each time window:</span>
ZINCRBY trending:hour:14 1 "#IPL2025"  <span class="cm">// current hour</span>
ZINCRBY trending:hour:13 1 "#IPL2025"  <span class="cm">// previous hour</span>

<span class="cm">// Trending Score Formula:</span>
<span class="cm">// score = current_hour_count * 3 + prev_hour * 2 + 2hrs_ago * 1</span>
<span class="cm">// Higher weight = more recent mentions matter more</span>

<span class="cm">// Decay: Old trending topics naturally fall off</span>
<span class="cm">// Every 5 minutes, recalculate scores</span>
<span class="cm">// Topics with declining velocity drop out</span>

<span class="cm">// Anti-spam: Same user ke multiple mentions = 1 count</span>
<span class="cm">// Bot detection: Sudden spike from new accounts = flag</span>

<span class="cm">// Get top 10 trending:</span>
ZREVRANGE trending:IN 0 9 WITHSCORES
</pre></div>
        </div>
        <div class="service-card">
            <h3>Stories Architecture</h3>
            <p class="svc-desc">Stories 24hr TTL ke saath Redis + S3 me store hoti hai &mdash; TTL expire pe cleanup job chalti hai</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Stories Pipeline</span></div><pre class="code-block">
<span class="cm">// CREATE STORY:</span>
<span class="cm">// 1. Upload media to S3 (image/video)</span>
<span class="cm">// 2. Save to PostgreSQL with expires_at = NOW() + 24h</span>
<span class="cm">// 3. Cache in Redis with TTL</span>
SET story:story-789 "{userId, mediaUrl, ...}" EX 86400

<span class="cm">// 4. Add to user's active stories sorted set</span>
ZADD user_stories:1001 1718445600 "story-789"

<span class="cm">// FETCH STORIES for feed (stories bar at top):</span>
<span class="cm">// 1. Get following list from Redis/DB</span>
<span class="cm">// 2. For each followed user, check active stories</span>
<span class="cm">// ZRANGEBYSCORE user_stories:{userId} (NOW-86400) +inf</span>
<span class="cm">// 3. Group by user, sort by most recent</span>
<span class="cm">// 4. Unseen stories first (check story_views set)</span>

<span class="cm">// VIEW TRACKING:</span>
SADD story_views:story-789 :viewerId
<span class="cm">// Check if already viewed:</span>
SISMEMBER story_views:story-789 :viewerId

<span class="cm">// CLEANUP (scheduled every hour):</span>
<span class="cm">// 1. Find expired stories in DB</span>
<span class="cm">// 2. Delete from S3 (unless highlighted)</span>
<span class="cm">// 3. Remove from Redis sets</span>
<span class="cm">// 4. Update DB status = EXPIRED</span>
</pre></div>
        </div>
    </div>
</div>

<!-- ============ 10. SCALABILITY ============ -->
<div class="section theme-yellow">
    <div class="section-title"><span class="section-num">10</span>Scalability &amp; Caching Strategy</div>
    <div class="service-grid">
        <div class="service-card">
            <h3>Database Sharding</h3>
            <p class="svc-desc">Billions of posts/users ke liye single DB kaafi nahi &mdash; user_id based sharding se data distribute hota hai</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Sharding Strategy</span></div><pre class="code-block">
<span class="cm">// USER-BASED SHARDING</span>
<span class="cm">// shard_id = user_id % num_shards</span>
<span class="cm">// User ki posts, likes, comments same shard pe</span>

<span class="cm">// Example: 16 shards</span>
User 1001 &rarr; shard_id = 1001 % 16 = 9 &rarr; DB Shard 9
User 2001 &rarr; shard_id = 2001 % 16 = 1 &rarr; DB Shard 1

<span class="cm">// Posts table bhi user_id se shard hoti hai</span>
<span class="cm">// Ek user ke saare posts same shard pe = fast query</span>

<span class="cm">// PROBLEM: Cross-shard queries slow hai</span>
<span class="cm">// "Get feed" = multiple users = multiple shards</span>
<span class="cm">// SOLUTION: Feed pre-computed hai Redis me (no cross-shard read)</span>

<span class="cm">// Celebrity posts: Replicated to all shards</span>
<span class="cm">// OR: Separate "hot" table for viral posts</span>
</pre></div>
        </div>
        <div class="service-card">
            <h3>Multi-layer Caching</h3>
            <p class="svc-desc">L1 (local) + L2 (Redis) + DB &mdash; cache hit ratio 99%+ hona chahiye itne scale pe</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Cache Architecture</span></div><pre class="code-block">
<span class="cm">// LAYER 1: CDN Edge Cache (static assets)</span>
<span class="cm">// Images, videos, avatars &rarr; CloudFront/Akamai</span>
<span class="cm">// TTL: 30 days (immutable URLs with content hash)</span>

<span class="cm">// LAYER 2: Application-level Cache (Caffeine/Guava)</span>
<span class="cm">// Hot user profiles, post details</span>
<span class="cm">// TTL: 5 minutes, LRU eviction</span>

<span class="cm">// LAYER 3: Redis Distributed Cache</span>
<span class="cm">// Feed lists, like counts, follower counts, stories</span>
feed:userId     &rarr; List of post IDs (pre-computed)
like_count:postId &rarr; Atomic counter (INCR/DECR)
user:1001       &rarr; User profile JSON (TTL 10 min)
trending:IN     &rarr; Sorted set of hashtags

<span class="cm">// LAYER 4: PostgreSQL (source of truth)</span>
<span class="cm">// Only hit when cache miss</span>

<span class="cm">// Cache Invalidation Strategy:</span>
<span class="cm">// Write-through: Update cache + DB together</span>
<span class="cm">// TTL-based: Auto-expire after set time</span>
<span class="cm">// Event-driven: Kafka event triggers cache update</span>
</pre></div>
        </div>
    </div>
</div>

<!-- ============ 11. SYSTEM FLOW ============ -->
<div class="section theme-teal">
    <div class="section-title"><span class="section-num">11</span>Complete Post Flow &mdash; End to End</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Post Lifecycle</span></div><pre class="code-block">
<span class="cm">// ===== PHASE 1: POST CREATION =====</span>
User &rarr; POST /api/v1/posts (with images)
    &rarr; MediaService: Upload images to S3
    &rarr; MediaService: Generate variants (thumbnail, medium, full)
    &rarr; PostService: Save post to PostgreSQL
    &rarr; Extract hashtags (#travel, #nature) &rarr; link in post_hashtags
    &rarr; Update user's post_count (Redis + DB)
    &rarr; Kafka Event: POST_CREATED

<span class="cm">// ===== PHASE 2: FAN-OUT (Async via Kafka) =====</span>
Fan-out Worker picks up POST_CREATED event
    &rarr; Check author's follower count
    &rarr; If &lt; 10K followers: Fan-out-on-Write
        &rarr; Fetch all follower IDs
        &rarr; LPUSH post-ID to each follower's Redis feed list
        &rarr; Batch write (1000 followers per batch)
    &rarr; If &gt;= 10K: Skip (fan-out-on-read at feed time)

<span class="cm">// ===== PHASE 3: INDEXING (Async) =====</span>
Search Indexer picks up event
    &rarr; Index post in Elasticsearch (title, content, hashtags)
    &rarr; Update hashtag trending counters in Redis
    &rarr; AI moderation check (NSFW, spam detection)

<span class="cm">// ===== PHASE 4: NOTIFICATION (Async) =====</span>
Notification Worker
    &rarr; Detect @mentions in content &rarr; notify mentioned users
    &rarr; Hashtag subscribers &rarr; notify if subscribed
    &rarr; Close friends &rarr; push notification for close friend's post

<span class="cm">// ===== PHASE 5: FEED READ =====</span>
User opens app &rarr; GET /api/v1/feed
    &rarr; Redis: LRANGE feed:userId 0 49 (pre-computed post IDs)
    &rarr; Merge with celebrity posts (fan-out-on-read)
    &rarr; ML Ranking: score based on engagement, recency, relationship
    &rarr; Filter: Remove blocked users, muted users, seen posts
    &rarr; Return top 20 ranked posts with cursor for next page

<span class="cm">// ===== PHASE 6: ENGAGEMENT =====</span>
Like &rarr; Redis INCR like_count:postId (instant)
      &rarr; Kafka: async DB write + notification to post author
Comment &rarr; Save to DB &rarr; increment comment_count
        &rarr; Notify post author + mentioned users
Share &rarr; Create new post with original_post_id reference
      &rarr; Fan-out to sharer's followers
</pre></div>
</div>

<!-- ============ 12. KEY DIFFERENCES ============ -->
<div class="section theme-pink">
    <div class="section-title"><span class="section-num">12</span>Facebook vs Instagram vs Twitter &mdash; Key Differences</div>
    <div class="service-grid">
        <div class="service-card">
            <h3>Facebook</h3>
            <p class="svc-desc">Full social network &mdash; friends (symmetric), groups, events, marketplace sab ek jagah</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Facebook Specifics</span></div><pre class="code-block">
<span class="cm">// Symmetric friendship (A friends B = mutual)</span>
<span class="cm">// Edge Rank algorithm for feed ranking</span>
<span class="cm">// Groups with admins, posts, events</span>
<span class="cm">// Facebook Marketplace (buy/sell)</span>
<span class="cm">// Events with RSVP system</span>
<span class="cm">// Pages for businesses/celebrities</span>
<span class="cm">// Reactions: Like, Love, Haha, Wow, Sad, Angry</span>
<span class="cm">// TAO: Graph database for social graph</span>
<span class="cm">// 2.9B monthly active users</span>
</pre></div>
        </div>
        <div class="service-card">
            <h3>Instagram</h3>
            <p class="svc-desc">Visual-first platform &mdash; photos, reels, stories. Asymmetric follow model</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Instagram Specifics</span></div><pre class="code-block">
<span class="cm">// Asymmetric follow (like Twitter)</span>
<span class="cm">// Visual content mandatory (no text-only posts)</span>
<span class="cm">// Stories (24hr) + Highlights (permanent)</span>
<span class="cm">// Reels (short-form video, TikTok competitor)</span>
<span class="cm">// Explore page (ML-powered discovery)</span>
<span class="cm">// Shopping tags on posts (e-commerce)</span>
<span class="cm">// Close Friends list for private stories</span>
<span class="cm">// Double-tap to like (UX innovation)</span>
<span class="cm">// 2B monthly active users</span>
</pre></div>
        </div>
        <div class="service-card">
            <h3>Twitter (X)</h3>
            <p class="svc-desc">Text-first microblogging &mdash; 280 char limit, retweets, threads, trending hashtags</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Twitter Specifics</span></div><pre class="code-block">
<span class="cm">// Asymmetric follow</span>
<span class="cm">// 280 character limit per tweet</span>
<span class="cm">// Retweet (share) + Quote Tweet (share with comment)</span>
<span class="cm">// Threads (connected tweets for long content)</span>
<span class="cm">// Trending topics (region-wise, real-time)</span>
<span class="cm">// Spaces (live audio rooms)</span>
<span class="cm">// Lists (curated feed groups)</span>
<span class="cm">// Bookmarks (private saves)</span>
<span class="cm">// Manhattan DB (key-value store, custom built)</span>
<span class="cm">// 500M monthly active users</span>
</pre></div>
        </div>
    </div>
</div>

<!-- ============ 13. BOTTLENECKS ============ -->
<div class="section theme-red">
    <div class="section-title"><span class="section-num">13</span>Bottlenecks &amp; Solutions</div>
    <div class="bottleneck-grid">
        <div class="bottleneck-item"><span class="bottleneck-problem">Celebrity fan-out (100M followers)</span><span class="bottleneck-arrow">&rarr;</span><span class="bottleneck-solution">Hybrid: fan-out-on-read for celebrities, fan-out-on-write for normal users</span></div>
        <div class="bottleneck-item"><span class="bottleneck-problem">Viral post &mdash; millions of likes simultaneously</span><span class="bottleneck-arrow">&rarr;</span><span class="bottleneck-solution">Redis atomic INCR + batch DB writes via Kafka (eventual consistency)</span></div>
        <div class="bottleneck-item"><span class="bottleneck-problem">Feed ranking at scale (2B users)</span><span class="bottleneck-arrow">&rarr;</span><span class="bottleneck-solution">Pre-compute hourly, lightweight re-rank at read time, ML cached per segment</span></div>
        <div class="bottleneck-item"><span class="bottleneck-problem">Image storage explosion (100M+ daily)</span><span class="bottleneck-arrow">&rarr;</span><span class="bottleneck-solution">3 size variants + WebP format + CDN + S3 Glacier for old images</span></div>
        <div class="bottleneck-item"><span class="bottleneck-problem">Thundering herd on celebrity post</span><span class="bottleneck-arrow">&rarr;</span><span class="bottleneck-solution">Cache warming + staggered fan-out (jitter) + request coalescing</span></div>
        <div class="bottleneck-item"><span class="bottleneck-problem">Search index lag for new posts</span><span class="bottleneck-arrow">&rarr;</span><span class="bottleneck-solution">Near real-time indexing via Kafka, Elasticsearch 1-sec refresh</span></div>
        <div class="bottleneck-item"><span class="bottleneck-problem">Story storage cost (24hr expiry)</span><span class="bottleneck-arrow">&rarr;</span><span class="bottleneck-solution">S3 lifecycle auto-delete 48h, aggressive cleanup job, short CDN TTL</span></div>
        <div class="bottleneck-item"><span class="bottleneck-problem">Cross-shard queries for feed</span><span class="bottleneck-arrow">&rarr;</span><span class="bottleneck-solution">Feed pre-computed in Redis (no cross-shard reads), Cassandra partitioned</span></div>
    </div>
</div>

<!-- ============ 14. INTERVIEW TIPS ============ -->
<div class="section theme-orange">
    <div class="section-title"><span class="section-num">14</span>Interview Summary</div>
    <div class="summary-grid">
        <div class="summary-card sc-1"><h4>Fan-out Hybrid</h4><p>Push for normal users, pull for celebrities (&gt;10K followers)</p></div>
        <div class="summary-card sc-2"><h4>Feed Ranking (ML)</h4><p>Engagement probability + recency + relationship closeness</p></div>
        <div class="summary-card sc-3"><h4>Eventual Consistency</h4><p>Like count 2-3 sec late is OK &mdash; Redis INCR + async DB</p></div>
        <div class="summary-card sc-4"><h4>Cursor Pagination</h4><p>WHERE id &lt; :lastId LIMIT 20 (not OFFSET)</p></div>
        <div class="summary-card sc-1"><h4>Sharding by user_id</h4><p>Posts, likes, comments on same shard</p></div>
        <div class="summary-card sc-2"><h4>CDN for Media</h4><p>Origin 500ms vs CDN 20ms &mdash; non-negotiable</p></div>
        <div class="summary-card sc-3"><h4>Stories = TTL</h4><p>Redis TTL + S3 lifecycle + cleanup job</p></div>
        <div class="summary-card sc-4"><h4>Social Graph</h4><p>Billions of edges, 2-hop traversal for suggestions</p></div>
        <div class="summary-card sc-1"><h4>Notification Aggregation</h4><p>"Rahul and 99 others liked" not 100 notifs</p></div>
        <div class="summary-card sc-2"><h4>Content Moderation</h4><p>AI pre-filter + human review queue</p></div>
        <div class="summary-card sc-3"><h4>Trending Algorithm</h4><p>Velocity-based: engagement/time window ratio</p></div>
        <div class="summary-card sc-4"><h4>Observer Pattern</h4><p>Post event &rarr; feed + notify + index + moderate</p></div>
    </div>
    <p style="text-align:center;margin-top:24px;color:#78909c;font-size:1em">
        Complete Social Media LLD for <strong style="color:#e91e63">Java Spring Boot</strong> interviews &mdash; covers Feed, Social Graph, Stories, Trending &amp; Scalability.
    </p>
</div>
`
}
