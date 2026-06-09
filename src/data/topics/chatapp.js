export default {
  title: "Chat Application Low Level Design",
  subtitle: "Complete LLD &mdash; Rooms, WebSocket, File Sharing, Presence &amp; Message History",
  subtitleColor: "#ede7f6",
  headerGradient: "linear-gradient(135deg,#4527a0,#5e35b1,#b388ff)",
  footerText: "Chat Application LLD &mdash; Interview Prep",
  content: `
<!-- ============ 1. FUNCTIONAL REQUIREMENTS ============ -->
<div class="section theme-green">
    <div class="section-title"><span class="section-num">1</span>Functional Requirements</div>
    <div class="req-grid">
        <div class="req-pill"><span class="num">1</span> Create Chat Rooms (Private/Group/Channel)</div>
        <div class="req-pill"><span class="num">2</span> Send &amp; Receive Messages</div>
        <div class="req-pill"><span class="num">3</span> Message History with Pagination</div>
        <div class="req-pill"><span class="num">4</span> Real-time Messaging via WebSocket</div>
        <div class="req-pill"><span class="num">5</span> File/Attachment Upload</div>
        <div class="req-pill"><span class="num">6</span> Typing Indicator</div>
        <div class="req-pill"><span class="num">7</span> Online/Offline Presence</div>
        <div class="req-pill"><span class="num">8</span> Search Messages</div>
        <div class="req-pill"><span class="num">9</span> Room-based Broadcasting</div>
        <div class="req-pill"><span class="num">10</span> Read Receipts</div>
        <div class="req-pill"><span class="num">11</span> User Mentions &amp; Notifications</div>
        <div class="req-pill"><span class="num">12</span> Join/Leave Room</div>
        <div class="req-pill"><span class="num">13</span> Pin/Unpin Messages</div>
        <div class="req-pill"><span class="num">14</span> Offline Message Sync</div>
    </div>
</div>

<!-- ============ 2. ENUMS ============ -->

<!-- ============ NON-FUNCTIONAL REQUIREMENTS ============ -->
<div class="section theme-pink">
    <div class="section-title"><span class="section-num">2</span>Non-Functional Requirements</div>
    <div class="req-grid">
        <div class="req-pill"><span class="num">1</span> Low Latency &mdash; message delivery &lt; 100ms real-time feel</div>
        <div class="req-pill"><span class="num">2</span> High Availability &mdash; 99.99% uptime hamesha online</div>
        <div class="req-pill"><span class="num">3</span> Scalability &mdash; millions concurrent WebSocket connections</div>
        <div class="req-pill"><span class="num">4</span> Message Ordering &mdash; chat me messages sahi order me aaye</div>
        <div class="req-pill"><span class="num">5</span> Fault Tolerance &mdash; offline pe message queue &amp; retry ho</div>
        <div class="req-pill"><span class="num">6</span> Real-time &mdash; WebSocket se instant delivery guarantee</div>
    </div>
</div>

<!-- ============ 3. ENUMS ============ -->
<div class="section theme-purple">
    <div class="section-title"><span class="section-num">3</span>Enums</div>
    <div class="enum-grid">
        <div class="enum-card">
            <h3>RoomType</h3>
            <div class="enum-val">PRIVATE</div>
            <div class="enum-val">GROUP</div>
            <div class="enum-val">CHANNEL</div>
        </div>
        <div class="enum-card">
            <h3>MessageType</h3>
            <div class="enum-val">TEXT</div>
            <div class="enum-val">IMAGE</div>
            <div class="enum-val">FILE</div>
            <div class="enum-val">VIDEO</div>
            <div class="enum-val">AUDIO</div>
            <div class="enum-val">SYSTEM</div>
        </div>
        <div class="enum-card">
            <h3>UserStatus</h3>
            <div class="enum-val">ONLINE</div>
            <div class="enum-val">AWAY</div>
            <div class="enum-val">DO_NOT_DISTURB</div>
            <div class="enum-val">OFFLINE</div>
        </div>
        <div class="enum-card">
            <h3>ParticipantRole</h3>
            <div class="enum-val">OWNER</div>
            <div class="enum-val">ADMIN</div>
            <div class="enum-val">MODERATOR</div>
            <div class="enum-val">MEMBER</div>
        </div>
    </div>
</div>

<!-- ============ 3. DATABASE SCHEMA ============ -->

<!-- ============ 4. SERVICE LLD ============ -->
<div class="section theme-yellow">
    <div class="section-title"><span class="section-num">4</span>Service LLD</div>
    <div class="service-grid">

        <div class="service-card">
            <h3>ChatService</h3>
            <p class="svc-desc">Real-time messaging ka main service &mdash; room me message bhejo, sabko broadcast karo, typing indicator dikhao aur user ki presence update karo. WebSocket ke through sab kuch real-time hota hai.</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">ChatService</span> {

    <span class="cm">// room me message bhejo, thread reply bhi support karta hai</span>
    <span class="tp">Message</span> <span class="fn">sendMessage</span>(<span class="tp">String</span> roomId, <span class="tp">Long</span> senderId, <span class="tp">String</span> content, <span class="tp">MessageType</span> messageType, <span class="tp">String</span> parentMessageId)

    <span class="cm">// room ke sabko event broadcast karo, sender ko exclude kar sakte ho</span>
    <span class="tp">void</span> <span class="fn">broadcastToRoom</span>(<span class="tp">String</span> roomId, <span class="tp">ChatEvent</span> event, <span class="tp">Long</span> excludeUserId)

    <span class="cm">// typing indicator handle karo — kaun type kar raha hai dikhao</span>
    <span class="tp">void</span> <span class="fn">handleTypingIndicator</span>(<span class="tp">String</span> roomId, <span class="tp">Long</span> userId, <span class="tp">Boolean</span> isTyping)

    <span class="cm">// user ki presence update karo — online/offline/away status set karo</span>
    <span class="tp">void</span> <span class="fn">updatePresence</span>(<span class="tp">Long</span> userId, <span class="tp">UserStatus</span> status)
}
</pre></div>
        </div>

        <div class="service-card">
            <h3>RoomService</h3>
            <p class="svc-desc">Chat rooms ka management &mdash; naya room banao (private/group/channel), members add/remove karo, user ke saare rooms list karo, aur room archive karo. Room capacity bhi check hoti hai.</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">RoomService</span> {

    <span class="cm">// naya chat room banao — private, group ya channel type ke saath</span>
    <span class="tp">ChatRoom</span> <span class="fn">createRoom</span>(<span class="tp">String</span> name, <span class="tp">String</span> description, <span class="tp">RoomType</span> roomType, <span class="tp">Long</span> createdBy, <span class="tp">List&lt;Long&gt;</span> memberIds, <span class="tp">Integer</span> maxParticipants)

    <span class="cm">// room me naya member add karo, admin/owner check hota hai</span>
    <span class="tp">Participant</span> <span class="fn">addParticipant</span>(<span class="tp">String</span> roomId, <span class="tp">Long</span> userId, <span class="tp">ParticipantRole</span> role, <span class="tp">Long</span> addedBy)

    <span class="cm">// room se member hatao, authorization check ke saath</span>
    <span class="tp">void</span> <span class="fn">removeParticipant</span>(<span class="tp">String</span> roomId, <span class="tp">Long</span> userId, <span class="tp">Long</span> removedBy)

    <span class="cm">// user ke saare rooms ki list lao</span>
    <span class="tp">List&lt;ChatRoom&gt;</span> <span class="fn">getUserRooms</span>(<span class="tp">Long</span> userId)

    <span class="cm">// room ko archive karo, sirf owner kar sakta hai</span>
    <span class="tp">void</span> <span class="fn">archiveRoom</span>(<span class="tp">String</span> roomId, <span class="tp">Long</span> requesterId)
}
</pre></div>
        </div>

        <div class="service-card">
            <h3>MessageService</h3>
            <p class="svc-desc">Messages ka pura lifecycle &mdash; message send karo, purane messages paginate karke dikhao, edit karo (30 min window), soft-delete karo, keyword se search karo, aur important messages pin karo.</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">MessageService</span> {

    <span class="cm">// naya message bhejo room me, thread reply bhi support hai</span>
    <span class="tp">Message</span> <span class="fn">sendMessage</span>(<span class="tp">String</span> roomId, <span class="tp">Long</span> senderId, <span class="tp">String</span> content, <span class="tp">MessageType</span> messageType, <span class="tp">String</span> parentMessageId)

    <span class="cm">// purane messages paginate karke lao, cursor-based pagination</span>
    <span class="tp">Page&lt;Message&gt;</span> <span class="fn">getMessageHistory</span>(<span class="tp">String</span> roomId, <span class="tp">Integer</span> page, <span class="tp">Integer</span> size, <span class="tp">LocalDateTime</span> beforeTimestamp)

    <span class="cm">// message edit karo — 30 min window aur ownership check ke saath</span>
    <span class="tp">Message</span> <span class="fn">editMessage</span>(<span class="tp">String</span> messageId, <span class="tp">String</span> newContent, <span class="tp">Long</span> userId)

    <span class="cm">// message soft-delete karo — owner ya moderator hi kar sakta hai</span>
    <span class="tp">void</span> <span class="fn">deleteMessage</span>(<span class="tp">String</span> messageId, <span class="tp">Long</span> userId)

    <span class="cm">// keyword se messages search karo room me</span>
    <span class="tp">List&lt;Message&gt;</span> <span class="fn">searchMessages</span>(<span class="tp">String</span> roomId, <span class="tp">String</span> keyword, <span class="tp">Long</span> fromUserId, <span class="tp">MessageType</span> messageType)

    <span class="cm">// important message pin karo, moderator+ role chahiye</span>
    <span class="tp">void</span> <span class="fn">pinMessage</span>(<span class="tp">String</span> messageId, <span class="tp">Long</span> userId)
}
</pre></div>
        </div>

        <div class="service-card">
            <h3>FileService</h3>
            <p class="svc-desc">Chat me file upload/download ka sara kaam &mdash; S3 pe file upload karo, presigned URL generate karo temporary access ke liye, file type validate karo (whitelist), aur file delete karo storage se.</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">FileService</span> {

    <span class="cm">// S3 pe file upload karo, attachment record bana ke return karo</span>
    <span class="tp">Attachment</span> <span class="fn">uploadFile</span>(<span class="tp">MultipartFile</span> file, <span class="tp">String</span> messageId, <span class="tp">Long</span> userId, <span class="tp">String</span> roomId)

    <span class="cm">// file download karo attachment ID se</span>
    <span class="tp">byte[]</span> <span class="fn">downloadFile</span>(<span class="tp">String</span> attachmentId)

    <span class="cm">// temporary access ke liye presigned URL generate karo</span>
    <span class="tp">String</span> <span class="fn">generatePresignedUrl</span>(<span class="tp">String</span> attachmentId, <span class="tp">Integer</span> expiryMinutes)

    <span class="cm">// file type whitelist me hai ya nahi check karo</span>
    <span class="tp">Boolean</span> <span class="fn">validateFileType</span>(<span class="tp">String</span> mimeType)

    <span class="cm">// file delete karo storage se, ownership check ke saath</span>
    <span class="tp">void</span> <span class="fn">deleteFile</span>(<span class="tp">String</span> attachmentId, <span class="tp">Long</span> userId)
}
</pre></div>
        </div>

        <div class="service-card">
            <h3>PresenceService</h3>
            <p class="svc-desc">User ka online/offline status track karo Redis me &mdash; markOnline/markOffline se status set hota hai, heartbeat (30s ping) se connection alive rehta hai, aur status change hone pe room ke sabko broadcast hota hai.</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">PresenceService</span> {

    <span class="cm">// user ko online mark karo Redis me</span>
    <span class="tp">void</span> <span class="fn">markOnline</span>(<span class="tp">Long</span> userId)

    <span class="cm">// user ko offline mark karo aur last seen update karo</span>
    <span class="tp">void</span> <span class="fn">markOffline</span>(<span class="tp">Long</span> userId)

    <span class="cm">// user ka current status lao — online/away/offline</span>
    <span class="tp">UserStatus</span> <span class="fn">getUserStatus</span>(<span class="tp">Long</span> userId)

    <span class="cm">// room me kaun kaun online hai uski list lao</span>
    <span class="tp">List&lt;Long&gt;</span> <span class="fn">getOnlineUsersInRoom</span>(<span class="tp">String</span> roomId)

    <span class="cm">// presence change hone pe room ke sabko broadcast karo</span>
    <span class="tp">void</span> <span class="fn">broadcastPresenceChange</span>(<span class="tp">Long</span> userId, <span class="tp">UserStatus</span> status)
}
</pre></div>
        </div>

        <div class="service-card">
            <h3>WebSocketSessionManager</h3>
            <p class="svc-desc">Live WebSocket connections manage karo &mdash; jab user chat open kare tab session save karo, band kare tab remove karo, room ke saare connections track karo. ConcurrentHashMap se thread-safe hai.</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">WebSocketSessionManager</span> {

    <span class="cm">// user ka WebSocket session save karo jab connect kare</span>
    <span class="tp">void</span> <span class="fn">addSession</span>(<span class="tp">Long</span> userId, <span class="tp">WebSocketSession</span> session)

    <span class="cm">// user disconnect hone pe session hatao</span>
    <span class="tp">void</span> <span class="fn">removeSession</span>(<span class="tp">Long</span> userId)

    <span class="cm">// user ka active WebSocket session lao</span>
    <span class="tp">WebSocketSession</span> <span class="fn">getSession</span>(<span class="tp">Long</span> userId)

    <span class="cm">// check karo user connected hai ya nahi</span>
    <span class="tp">Boolean</span> <span class="fn">isConnected</span>(<span class="tp">Long</span> userId)

    <span class="cm">// room ke saare active sessions ki list lao</span>
    <span class="tp">List&lt;WebSocketSession&gt;</span> <span class="fn">getSessionsByRoom</span>(<span class="tp">String</span> roomId)
}
</pre></div>
        </div>

        <div class="service-card">
            <h3>NotificationService</h3>
            <p class="svc-desc">Push notifications bhejo users ko &mdash; naye message aane pe room ke saare members ko notify karo, @mention pe specific user ko alert karo, aur FCM/APNs se device pe push notification bhejo.</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">NotificationService</span> {

    <span class="cm">// room ke saare members ko naye message ki notification bhejo</span>
    <span class="tp">void</span> <span class="fn">notifyRoomParticipants</span>(<span class="tp">String</span> roomId, <span class="tp">Message</span> message, <span class="tp">Long</span> excludeUserId)

    <span class="cm">// @mention hone pe specific user ko alert bhejo</span>
    <span class="tp">void</span> <span class="fn">sendMentionNotification</span>(<span class="tp">Long</span> userId, <span class="tp">String</span> roomId, <span class="tp">String</span> mentionedBy, <span class="tp">String</span> messageId)

    <span class="cm">// FCM/APNs se device pe push notification bhejo</span>
    <span class="tp">void</span> <span class="fn">sendPushNotification</span>(<span class="tp">Long</span> userId, <span class="tp">String</span> title, <span class="tp">String</span> body, <span class="tp">Map&lt;String, String&gt;</span> data)
}
</pre></div>
        </div>

    </div>
</div>

<!-- ============ 7. KEY ARCHITECTURE ============ -->

<!-- ============ 5. APIs ============ -->
<div class="section theme-teal">
    <div class="section-title"><span class="section-num">5</span>APIs (REST + WebSocket)</div>
    <div class="api-grid">
        <div class="api-card">
            <div class="api-header"><span class="api-method method-post">POST</span><span class="api-path">/api/rooms</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Request</div>{ <span class="key">"name"</span>: <span class="val">"Dev Team"</span>, <span class="key">"roomType"</span>: <span class="val">"GROUP"</span>, <span class="key">"memberIds"</span>: <span class="val">[2,3,4]</span> }</div>
                <div class="api-json"><div class="label">Response 201</div>{ <span class="key">"roomId"</span>: <span class="val">"uuid"</span>, <span class="key">"name"</span>: <span class="val">"Dev Team"</span>, <span class="key">"roomType"</span>: <span class="val">"GROUP"</span> }</div>
            </div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-post">POST</span><span class="api-path">/api/rooms/{roomId}/messages</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Request</div>{ <span class="key">"content"</span>: <span class="val">"Hello team!"</span>, <span class="key">"messageType"</span>: <span class="val">"TEXT"</span> }</div>
                <div class="api-json"><div class="label">Response 201</div>{ <span class="key">"messageId"</span>: <span class="val">"uuid"</span>, <span class="key">"createdAt"</span>: <span class="val">"..."</span> }</div>
            </div>
            <div class="api-note">Also broadcasts to all room participants via WebSocket</div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-get">GET</span><span class="api-path">/api/rooms/{roomId}/messages?page=0&amp;size=50</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Query Params</div><span class="key">page</span>: <span class="val">0</span> (default)<br><span class="key">size</span>: <span class="val">50</span> (default)<br><span class="key">before</span>: <span class="val">timestamp</span> (cursor)</div>
                <div class="api-json"><div class="label">Response 200</div>{ <span class="key">"messages"</span>: <span class="val">[...]</span>, <span class="key">"totalPages"</span>: <span class="val">25</span>, <span class="key">"hasNext"</span>: <span class="val">true</span>, <span class="key">"cursor"</span>: <span class="val">"ts"</span> }</div>
            </div>
            <div class="api-note">Cursor-based pagination for infinite scroll, newest first</div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-post">POST</span><span class="api-path">/api/rooms/{roomId}/files</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Request (multipart)</div><span class="key">file</span>: <span class="val">binary</span><br><span class="key">messageType</span>: <span class="val">IMAGE | FILE | VIDEO</span></div>
                <div class="api-json"><div class="label">Response 201</div>{ <span class="key">"attachmentId"</span>: <span class="val">"uuid"</span>, <span class="key">"fileUrl"</span>: <span class="val">"https://s3.../file"</span>, <span class="key">"fileSize"</span>: <span class="val">204800</span> }</div>
            </div>
            <div class="api-note">Upload to S3 &rarr; create attachment record &rarr; create message &rarr; broadcast</div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-get">GET</span><span class="api-path">/api/rooms/{roomId}/messages/search?q=keyword</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Query Params</div><span class="key">q</span>: <span class="val">"deployment"</span><br><span class="key">from</span>: <span class="val">userId</span> (optional)<br><span class="key">type</span>: <span class="val">TEXT</span> (optional)</div>
                <div class="api-json"><div class="label">Response 200</div>{ <span class="key">"results"</span>: <span class="val">[{messageId, content, sender, createdAt}]</span>, <span class="key">"count"</span>: <span class="val">12</span> }</div>
            </div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-put">PUT</span><span class="api-path">/api/messages/{messageId}</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Request</div>{ <span class="key">"content"</span>: <span class="val">"Updated message"</span> }</div>
                <div class="api-json"><div class="label">Response 200</div>{ <span class="key">"messageId"</span>: <span class="val">"uuid"</span>, <span class="key">"isEdited"</span>: <span class="val">true</span> }</div>
            </div>
        </div>
    </div>
</div>

<!-- ============ 6. SERVICE LLD ============ -->

<!-- ============ 6. DATABASE SCHEMA ============ -->
<div class="section theme-pink">
    <div class="section-title"><span class="section-num">6</span>Database Schema (with FK &amp; Indexes)</div>

    <div class="sub-heading" style="color:#ff80ab;border-color:#ff80ab">Database Technology Stack</div>
    <div class="dbtech-grid">
        <div class="dbtech-card">
            <div class="dbtech-name">PostgreSQL <span class="dbtech-type">RDBMS</span></div>
            <div class="dbtech-usage">Users, rooms, participants &mdash; relational data with foreign keys</div>
            <div class="dbtech-tables"><span>users</span><span>chat_rooms</span><span>participants</span></div>
        </div>
        <div class="dbtech-card">
            <div class="dbtech-name">MongoDB <span class="dbtech-type">NoSQL</span></div>
            <div class="dbtech-usage">Messages, attachments &mdash; flexible schema, fast writes, cursor-based pagination</div>
            <div class="dbtech-tables"><span>messages</span><span>attachments</span></div>
        </div>
        <div class="dbtech-card">
            <div class="dbtech-name">Redis <span class="dbtech-type">In-Memory</span></div>
            <div class="dbtech-usage">Presence tracking, WebSocket sessions, typing indicators, unread counts</div>
            <div class="dbtech-tables"><span>presence:{userId}</span><span>session:{userId}</span></div>
        </div>
        <div class="dbtech-card">
            <div class="dbtech-name">S3 <span class="dbtech-type">Blob Storage</span></div>
            <div class="dbtech-usage">File attachments &mdash; images, documents, videos uploaded in chat</div>
            <div class="dbtech-tables"><span>attachments/{roomId}/{messageId}</span></div>
        </div>
        <div class="dbtech-card">
            <div class="dbtech-name">Elasticsearch <span class="dbtech-type">Search Engine</span></div>
            <div class="dbtech-usage">Full-text message search across chat rooms</div>
            <div class="dbtech-tables"><span>messages</span></div>
        </div>
    </div>

    <div class="db-grid">
        <div class="db-table">
            <h3>users</h3>
            <ul>
                <li><span class="pk">user_id BIGINT (PK, AUTO_INCREMENT)</span></li>
                <li>username VARCHAR(50) UNIQUE</li>
                <li>email VARCHAR(100) UNIQUE</li>
                <li>display_name VARCHAR(100)</li>
                <li>avatar_url VARCHAR(255)</li>
                <li>status ENUM('ONLINE','AWAY','DND','OFFLINE')</li>
                <li>last_seen_at TIMESTAMP</li>
                <li>created_at TIMESTAMP</li>
                <li><span class="idx">INDEX idx_username (username)</span></li>
                <li><span class="idx">INDEX idx_email (email)</span></li>
            </ul>
        </div>
        <div class="db-table">
            <h3>chat_rooms</h3>
            <ul>
                <li><span class="pk">room_id VARCHAR(36) (PK)</span></li>
                <li>name VARCHAR(100)</li>
                <li>description VARCHAR(500)</li>
                <li>room_type ENUM('PRIVATE','GROUP','CHANNEL')</li>
                <li><span class="fk">created_by BIGINT (FK &rarr; users.user_id)</span></li>
                <li>max_participants INT DEFAULT 500</li>
                <li>last_message_at TIMESTAMP</li>
                <li>is_archived BOOLEAN DEFAULT FALSE</li>
                <li>created_at TIMESTAMP</li>
                <li><span class="idx">INDEX idx_room_type (room_type)</span></li>
                <li><span class="idx">INDEX idx_last_msg (last_message_at DESC)</span></li>
            </ul>
        </div>
        <div class="db-table">
            <h3>messages</h3>
            <ul>
                <li><span class="pk">message_id VARCHAR(36) (PK)</span></li>
                <li><span class="fk">room_id VARCHAR(36) (FK &rarr; chat_rooms)</span></li>
                <li><span class="fk">sender_id BIGINT (FK &rarr; users.user_id)</span></li>
                <li>content TEXT</li>
                <li>message_type ENUM('TEXT','IMAGE','FILE','VIDEO','AUDIO','SYSTEM')</li>
                <li>parent_message_id VARCHAR(36)</li>
                <li>is_pinned BOOLEAN DEFAULT FALSE</li>
                <li>is_edited BOOLEAN DEFAULT FALSE</li>
                <li>is_deleted BOOLEAN DEFAULT FALSE</li>
                <li>created_at TIMESTAMP</li>
                <li>updated_at TIMESTAMP</li>
                <li>version BIGINT DEFAULT 0</li>
                <li><span class="idx">INDEX idx_room_time (room_id, created_at DESC)</span></li>
                <li><span class="idx">INDEX idx_sender (sender_id)</span></li>
                <li><span class="idx">INDEX idx_pinned (room_id, is_pinned)</span></li>
            </ul>
        </div>
        <div class="db-table">
            <h3>participants</h3>
            <ul>
                <li><span class="pk">participant_id BIGINT (PK, AUTO_INCREMENT)</span></li>
                <li><span class="fk">room_id VARCHAR(36) (FK &rarr; chat_rooms)</span></li>
                <li><span class="fk">user_id BIGINT (FK &rarr; users.user_id)</span></li>
                <li>role ENUM('OWNER','ADMIN','MODERATOR','MEMBER')</li>
                <li>joined_at TIMESTAMP</li>
                <li>last_read_message_id VARCHAR(36)</li>
                <li>is_muted BOOLEAN DEFAULT FALSE</li>
                <li><span class="pk">UNIQUE (room_id, user_id)</span></li>
                <li><span class="idx">INDEX idx_user_rooms (user_id)</span></li>
            </ul>
        </div>
        <div class="db-table">
            <h3>attachments</h3>
            <ul>
                <li><span class="pk">attachment_id VARCHAR(36) (PK)</span></li>
                <li><span class="fk">message_id VARCHAR(36) (FK &rarr; messages)</span></li>
                <li>file_name VARCHAR(255)</li>
                <li>file_url VARCHAR(500)</li>
                <li>file_size BIGINT</li>
                <li>mime_type VARCHAR(100)</li>
                <li>thumbnail_url VARCHAR(500)</li>
                <li>uploaded_at TIMESTAMP</li>
                <li><span class="idx">INDEX idx_message (message_id)</span></li>
            </ul>
        </div>
    </div>
    <div style="margin-top:16px;padding:14px 18px;background:rgba(255,128,171,.08);border-radius:12px;border:1px solid rgba(255,128,171,.15)">
        <strong style="color:#ff80ab">Why these indexes matter:</strong>
        <p style="color:#b0bec5;font-size:.88em;margin-top:8px;line-height:1.6">
            <strong>idx_room_time</strong> &mdash; Most frequent query: paginated message history for a room, ordered by time<br>
            <strong>idx_sender</strong> &mdash; Fast lookup for user's sent messages and admin operations<br>
            <strong>idx_user_rooms</strong> &mdash; List all rooms a user has joined (sidebar display)<br>
            <strong>idx_last_msg</strong> &mdash; Sort rooms by latest activity for the room list view
        </p>
    </div>

</div>

<!-- ============ 5. APIs ============ -->

<!-- ============ 7. CAPACITY ESTIMATION ============ -->
<div class="section theme-deepblue">
    <div class="section-title"><span class="section-num">7</span>Capacity Estimation</div>

    <div class="assumption-box">
        <h4>Assumptions (Slack/Discord Scale)</h4>
        <div class="assumption-row"><span class="calc-label">Total Users</span><span class="calc-value">50 Million</span></div>
        <div class="assumption-row"><span class="calc-label">Daily Active Users (DAU)</span><span class="calc-value">10 Million</span></div>
        <div class="assumption-row"><span class="calc-label">Avg messages sent/user/day</span><span class="calc-value">50 messages</span></div>
        <div class="assumption-row"><span class="calc-label">Avg message size (text)</span><span class="calc-value">200 bytes</span></div>
        <div class="assumption-row"><span class="calc-label">Avg rooms per user</span><span class="calc-value">15 rooms</span></div>
        <div class="assumption-row"><span class="calc-label">Avg file attachment size</span><span class="calc-value">500 KB</span></div>
        <div class="assumption-row"><span class="calc-label">% messages with files</span><span class="calc-value">8%</span></div>
        <div class="assumption-row"><span class="calc-label">Avg room size (participants)</span><span class="calc-value">25 users</span></div>
    </div>

    <div class="cap-grid">
        <div class="cap-card">
            <h4>Messages Per Day</h4>
            <div class="calc-row"><span class="calc-label">DAU</span><span class="calc-value">10M</span></div>
            <div class="calc-row"><span class="calc-label">&times; 50 msgs/user/day</span><span class="calc-value"></span></div>
            <div class="calc-result"><span class="calc-label">Total Messages / Day</span><span class="calc-value">500 Million</span></div>
            <div class="calc-result"><span class="calc-label">Messages / Second (QPS)</span><span class="calc-value">~5,800 QPS</span></div>
        </div>

        <div class="cap-card">
            <h4>Fan-out Per Message</h4>
            <div class="calc-row"><span class="calc-label">Avg room size</span><span class="calc-value">25 users</span></div>
            <div class="calc-row"><span class="calc-label">Messages/sec &times; 25 recipients</span><span class="calc-value"></span></div>
            <div class="calc-result"><span class="calc-label">WebSocket Pushes / Second</span><span class="calc-value">~145K pushes/s</span></div>
        </div>

        <div class="cap-card">
            <h4>Storage &mdash; Text Messages (per day)</h4>
            <div class="calc-row"><span class="calc-label">Messages/day</span><span class="calc-value">500M</span></div>
            <div class="calc-row"><span class="calc-label">&times; 200 bytes / msg</span><span class="calc-value"></span></div>
            <div class="calc-result"><span class="calc-label">Text Storage / Day</span><span class="calc-value">~100 GB / day</span></div>
            <div class="calc-result"><span class="calc-label">Text Storage / Year</span><span class="calc-value">~36 TB / year</span></div>
        </div>

        <div class="cap-card">
            <h4>Storage &mdash; File Attachments (per day)</h4>
            <div class="calc-row"><span class="calc-label">File messages/day</span><span class="calc-value">500M &times; 8% = 40M</span></div>
            <div class="calc-row"><span class="calc-label">&times; 500 KB / file</span><span class="calc-value"></span></div>
            <div class="calc-result"><span class="calc-label">File Storage / Day</span><span class="calc-value">~20 TB / day</span></div>
            <div class="calc-result"><span class="calc-label">File Storage / Year</span><span class="calc-value">~7.3 PB / year</span></div>
        </div>

        <div class="cap-card">
            <h4>WebSocket Connections</h4>
            <div class="calc-row"><span class="calc-label">Concurrent online users</span><span class="calc-value">~2M (20% DAU)</span></div>
            <div class="calc-row"><span class="calc-label">1 WebSocket / user</span><span class="calc-value"></span></div>
            <div class="calc-result"><span class="calc-label">Total Connections</span><span class="calc-value">2M concurrent</span></div>
            <div class="calc-row" style="margin-top:6px"><span class="calc-label">If 50K conn/server</span><span class="calc-value"></span></div>
            <div class="calc-result"><span class="calc-label">WebSocket Servers Needed</span><span class="calc-value">~40 servers</span></div>
        </div>

        <div class="cap-card">
            <h4>Bandwidth Estimation</h4>
            <div class="calc-row"><span class="calc-label">Text bandwidth</span><span class="calc-value">100 GB / 86400s = ~1.2 MB/s</span></div>
            <div class="calc-row"><span class="calc-label">File bandwidth</span><span class="calc-value">20 TB / 86400s = ~230 MB/s</span></div>
            <div class="calc-result"><span class="calc-label">Total Ingress</span><span class="calc-value">~230 MB/s</span></div>
            <div class="calc-row" style="margin-top:6px"><span class="calc-label">Egress (read heavy, 3x)</span><span class="calc-value"></span></div>
            <div class="calc-result"><span class="calc-label">Total Egress</span><span class="calc-value">~700 MB/s</span></div>
        </div>

        <div class="cap-card">
            <h4>Redis Cache Estimation</h4>
            <div class="calc-row"><span class="calc-label">Cache recent 100 msgs per active room</span><span class="calc-value"></span></div>
            <div class="calc-row"><span class="calc-label">Active rooms</span><span class="calc-value">~5M</span></div>
            <div class="calc-row"><span class="calc-label">Top 20% = 1M rooms</span><span class="calc-value"></span></div>
            <div class="calc-row"><span class="calc-label">&times; 100 msgs &times; 200 bytes</span><span class="calc-value"></span></div>
            <div class="calc-result"><span class="calc-label">Redis Cache Size</span><span class="calc-value">~20 GB</span></div>
        </div>

        <div class="cap-card">
            <h4>CPU / Server Estimation</h4>
            <div class="calc-row"><span class="calc-label">Total write QPS</span><span class="calc-value">~5,800 QPS</span></div>
            <div class="calc-row"><span class="calc-label">WebSocket push QPS</span><span class="calc-value">~145K pushes/s</span></div>
            <div class="calc-row"><span class="calc-label">Each server handles</span><span class="calc-value">~5K QPS</span></div>
            <div class="calc-result"><span class="calc-label">App Servers Needed</span><span class="calc-value">~6 servers</span></div>
            <div class="calc-row" style="margin-top:6px"><span class="calc-label">CPU cores per server (4 cores)</span><span class="calc-value"></span></div>
            <div class="calc-result"><span class="calc-label">Total CPU Cores</span><span class="calc-value">~24 cores</span></div>
            <div class="calc-row" style="margin-top:6px"><span class="calc-label">WebSocket Servers (50K conn/server)</span><span class="calc-value">~40 servers</span></div>
            <div class="calc-row"><span class="calc-label">Redis Cluster Nodes</span><span class="calc-value">3 nodes</span></div>
            <div class="calc-row"><span class="calc-label">DB Read Replicas</span><span class="calc-value">3 replicas</span></div>
        </div>
    </div>
</div>

<!-- ============ 11. BOTTLENECKS ============ -->

<!-- ============ 8. KEY ARCHITECTURE ============ -->
<div class="section theme-blue">
    <div class="section-title"><span class="section-num">8</span>Key Architecture &mdash; WebSocket + Room Broadcasting + Presence</div>

    <div class="sub-heading" style="color:#4fc3f7;border-color:#4fc3f7">WebSocket Connection &amp; Room Subscription</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">WebSocketSessionManager.java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">WebSocketSessionManager</span> {
    <span class="cm">// userId &rarr; WebSocketSession</span>
    <span class="tp">Map&lt;Long, WebSocketSession&gt;</span> <span class="fn">userSessions</span> = <span class="kw">new</span> ConcurrentHashMap&lt;&gt;();

    <span class="cm">// roomId &rarr; Set of userIds subscribed to this room</span>
    <span class="tp">Map&lt;String, Set&lt;Long&gt;&gt;</span> <span class="fn">roomSubscriptions</span> = <span class="kw">new</span> ConcurrentHashMap&lt;&gt;();

    <span class="kw">void</span> <span class="fn">subscribeToRoom</span>(String roomId, Long userId) {
        roomSubscriptions.computeIfAbsent(roomId, k -&gt; ConcurrentHashMap.newKeySet()).add(userId);
    }

    <span class="kw">void</span> <span class="fn">broadcastToRoom</span>(String roomId, WebSocketEvent event, Long excludeUserId) {
        Set&lt;Long&gt; subscribers = roomSubscriptions.getOrDefault(roomId, Collections.emptySet());
        <span class="kw">for</span> (Long userId : subscribers) {
            <span class="kw">if</span> (!userId.equals(excludeUserId) &amp;&amp; userSessions.containsKey(userId)) {
                userSessions.get(userId).sendMessage(<span class="kw">new</span> TextMessage(toJson(event)));
            }
        }
    }
}
    </pre></div>

    <div class="sub-heading" style="color:#4fc3f7;border-color:#4fc3f7">Room-based Broadcasting Flow</div>
    <div class="flow-container">
        <div class="flow-box flow-green">User sends message to Room X</div>
        <div class="flow-arrow arrow-green"></div>
        <div class="flow-box flow-blue">WebSocket Server receives frame</div>
        <div class="flow-arrow arrow-blue"></div>
        <div class="flow-box flow-purple">MessageService saves to DB</div>
        <div class="flow-arrow arrow-purple"></div>
        <div class="flow-box flow-orange">Lookup roomSubscriptions[roomX] &rarr; get all user IDs</div>
        <div class="flow-arrow arrow-orange"></div>
        <div class="flow-box flow-teal">Fan-out: push to each online user via their WebSocket session</div>
        <div class="flow-arrow arrow-green"></div>
        <div class="flow-box flow-green">Offline users &rarr; store in Kafka queue + push notification</div>
    </div>

    <div class="sub-heading" style="color:#4fc3f7;border-color:#4fc3f7">Presence System</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">PresenceService.java</span></div><pre class="code-block">
<span class="ann">@Service</span>
<span class="kw">class</span> <span class="cn">PresenceService</span> {
    <span class="ann">@Autowired</span> <span class="tp">RedisTemplate</span> redisTemplate;
    <span class="ann">@Autowired</span> <span class="tp">WebSocketSessionManager</span> sessionManager;

    <span class="kw">void</span> <span class="fn">markOnline</span>(Long userId) {
        redisTemplate.opsForValue().set(<span class="st">"presence:"</span> + userId, <span class="st">"ONLINE"</span>);
        <span class="cm">// Broadcast to all rooms user is part of</span>
        List&lt;String&gt; roomIds = participantRepo.findRoomIdsByUserId(userId);
        <span class="kw">for</span> (String roomId : roomIds) {
            sessionManager.broadcastToRoom(roomId,
                <span class="kw">new</span> PresenceEvent(userId, <span class="st">"ONLINE"</span>), userId);
        }
    }

    <span class="kw">void</span> <span class="fn">markOffline</span>(Long userId) {
        redisTemplate.opsForValue().set(<span class="st">"presence:"</span> + userId, <span class="st">"OFFLINE"</span>);
        userRepo.updateLastSeen(userId, LocalDateTime.now());
    }

    <span class="cm">// Heartbeat: client pings every 30s, timeout after 60s &rarr; mark OFFLINE</span>
}
    </pre></div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:16px">
        <div style="background:rgba(79,195,247,.06);border:1px solid rgba(79,195,247,.15);border-radius:12px;padding:16px">
            <strong style="color:#4fc3f7">Heartbeat (Ping/Pong)</strong>
            <p style="color:#b0bec5;font-size:.85em;margin-top:6px">Client sends ping every 30s. If server gets no ping for 60s, mark user OFFLINE and broadcast to their rooms.</p>
        </div>
        <div style="background:rgba(79,195,247,.06);border:1px solid rgba(79,195,247,.15);border-radius:12px;padding:16px">
            <strong style="color:#4fc3f7">Reconnection Strategy</strong>
            <p style="color:#b0bec5;font-size:.85em;margin-top:6px">Client uses exponential backoff (1s, 2s, 4s...). On reconnect, re-subscribe to rooms and fetch messages since last seen timestamp.</p>
        </div>
    </div>
</div>

<!-- ============ 8. DESIGN PATTERNS ============ -->

<!-- ============ 9. DESIGN PATTERNS ============ -->
<div class="section theme-cyan">
    <div class="section-title"><span class="section-num">9</span>Design Patterns (with Implementation)</div>
    <div class="pattern-grid">
        <div class="pattern-card"><div class="pattern-name">Observer Pattern</div><div class="pattern-use">Room event broadcasting</div></div>
        <div class="pattern-card"><div class="pattern-name">Mediator Pattern</div><div class="pattern-use">Chat room message routing</div></div>
        <div class="pattern-card"><div class="pattern-name">Strategy Pattern</div><div class="pattern-use">Message delivery channels</div></div>
        <div class="pattern-card"><div class="pattern-name">Factory Pattern</div><div class="pattern-use">Message creation by type</div></div>
    </div>

    <div class="sub-heading" style="color:#18ffff;border-color:#18ffff">Observer Pattern &mdash; Room Events</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Observer.java</span></div><pre class="code-block">
<span class="cm">// Observer interface &mdash; any component interested in room events</span>
<span class="kw">interface</span> <span class="iface">RoomEventObserver</span> {
    <span class="tp">void</span> <span class="fn">onEvent</span>(RoomEvent event);
}

<span class="kw">class</span> <span class="cn">RoomEvent</span> {
    <span class="tp">String</span> roomId;
    <span class="tp">RoomEventType</span> type;  <span class="cm">// MESSAGE_SENT, USER_JOINED, USER_LEFT, TYPING</span>
    <span class="tp">Object</span> payload;
}

<span class="cm">// Concrete observers</span>
<span class="kw">class</span> <span class="cn">MessageBroadcastObserver</span> <span class="kw">implements</span> <span class="iface">RoomEventObserver</span> {
    <span class="ann">@Override</span>
    <span class="kw">public void</span> <span class="fn">onEvent</span>(RoomEvent event) {
        <span class="kw">if</span> (event.type == MESSAGE_SENT) {
            <span class="cm">// Push message to all online room members via WebSocket</span>
            sessionManager.broadcastToRoom(event.roomId, event.payload, <span class="kw">null</span>);
        }
    }
}

<span class="kw">class</span> <span class="cn">NotificationObserver</span> <span class="kw">implements</span> <span class="iface">RoomEventObserver</span> {
    <span class="ann">@Override</span>
    <span class="kw">public void</span> <span class="fn">onEvent</span>(RoomEvent event) {
        <span class="kw">if</span> (event.type == MESSAGE_SENT) {
            <span class="cm">// Send push notifications to offline members</span>
            List&lt;Long&gt; offlineUsers = getOfflineParticipants(event.roomId);
            offlineUsers.forEach(uid -&gt; pushService.notify(uid, event.payload));
        }
    }
}

<span class="kw">class</span> <span class="cn">PresenceObserver</span> <span class="kw">implements</span> <span class="iface">RoomEventObserver</span> {
    <span class="ann">@Override</span>
    <span class="kw">public void</span> <span class="fn">onEvent</span>(RoomEvent event) {
        <span class="kw">if</span> (event.type == USER_JOINED || event.type == USER_LEFT) {
            <span class="cm">// Broadcast presence change to room</span>
            sessionManager.broadcastToRoom(event.roomId, event.payload, <span class="kw">null</span>);
        }
    }
}

<span class="cm">// Subject &mdash; manages observers</span>
<span class="kw">class</span> <span class="cn">RoomEventPublisher</span> {
    <span class="tp">Map&lt;String, List&lt;RoomEventObserver&gt;&gt;</span> observers = <span class="kw">new</span> ConcurrentHashMap&lt;&gt;();

    <span class="kw">void</span> <span class="fn">subscribe</span>(String roomId, RoomEventObserver observer) {
        observers.computeIfAbsent(roomId, k -&gt; <span class="kw">new</span> CopyOnWriteArrayList&lt;&gt;()).add(observer);
    }
    <span class="kw">void</span> <span class="fn">publish</span>(RoomEvent event) {
        observers.getOrDefault(event.roomId, List.of()).forEach(o -&gt; o.onEvent(event));
    }
}
    </pre></div>

    <div class="sub-heading" style="color:#18ffff;border-color:#18ffff">Mediator Pattern &mdash; Chat Room</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Mediator.java</span></div><pre class="code-block">
<span class="cm">// Mediator &mdash; coordinates communication between participants</span>
<span class="kw">interface</span> <span class="iface">ChatRoomMediator</span> {
    <span class="tp">void</span> <span class="fn">sendMessage</span>(Message message, Long senderId);
    <span class="tp">void</span> <span class="fn">addUser</span>(Long userId);
    <span class="tp">void</span> <span class="fn">removeUser</span>(Long userId);
    <span class="tp">void</span> <span class="fn">notifyTyping</span>(Long userId, <span class="tp">boolean</span> isTyping);
}

<span class="kw">class</span> <span class="cn">ChatRoomMediatorImpl</span> <span class="kw">implements</span> <span class="iface">ChatRoomMediator</span> {
    <span class="tp">String</span> roomId;
    <span class="tp">Set&lt;Long&gt;</span> activeUsers = ConcurrentHashMap.newKeySet();
    <span class="tp">WebSocketSessionManager</span> sessionManager;

    <span class="ann">@Override</span>
    <span class="kw">public void</span> <span class="fn">sendMessage</span>(Message message, Long senderId) {
        <span class="cm">// Mediator decides routing: broadcast to all except sender</span>
        <span class="kw">for</span> (Long userId : activeUsers) {
            <span class="kw">if</span> (!userId.equals(senderId)) {
                sessionManager.sendToUser(userId, message);
            }
        }
    }

    <span class="ann">@Override</span>
    <span class="kw">public void</span> <span class="fn">notifyTyping</span>(Long userId, <span class="tp">boolean</span> isTyping) {
        TypingEvent event = <span class="kw">new</span> TypingEvent(roomId, userId, isTyping);
        activeUsers.stream()
            .filter(uid -&gt; !uid.equals(userId))
            .forEach(uid -&gt; sessionManager.sendToUser(uid, event));
    }
}
    </pre></div>

    <div class="sub-heading" style="color:#18ffff;border-color:#18ffff">Strategy Pattern &mdash; Message Delivery</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Strategy.java</span></div><pre class="code-block">
<span class="kw">interface</span> <span class="iface">MessageDeliveryStrategy</span> {
    <span class="tp">void</span> <span class="fn">deliver</span>(Long userId, Message message);
}

<span class="kw">class</span> <span class="cn">WebSocketDeliveryStrategy</span> <span class="kw">implements</span> <span class="iface">MessageDeliveryStrategy</span> {
    <span class="ann">@Override</span>
    <span class="kw">public void</span> <span class="fn">deliver</span>(Long userId, Message message) {
        <span class="cm">// Direct WebSocket push for online users</span>
        WebSocketSession session = sessionManager.getSession(userId);
        session.sendMessage(<span class="kw">new</span> TextMessage(toJson(message)));
    }
}

<span class="kw">class</span> <span class="cn">PushNotificationDeliveryStrategy</span> <span class="kw">implements</span> <span class="iface">MessageDeliveryStrategy</span> {
    <span class="ann">@Override</span>
    <span class="kw">public void</span> <span class="fn">deliver</span>(Long userId, Message message) {
        <span class="cm">// FCM/APNs push for offline users</span>
        fcmService.send(userId, message.getContent());
    }
}

<span class="kw">class</span> <span class="cn">QueueDeliveryStrategy</span> <span class="kw">implements</span> <span class="iface">MessageDeliveryStrategy</span> {
    <span class="ann">@Override</span>
    <span class="kw">public void</span> <span class="fn">deliver</span>(Long userId, Message message) {
        <span class="cm">// Kafka/Redis queue for deferred delivery on reconnect</span>
        kafkaTemplate.send(<span class="st">"pending-messages"</span>, userId.toString(), message);
    }
}

<span class="cm">// Context selects strategy based on user status</span>
<span class="kw">class</span> <span class="cn">MessageDeliveryService</span> {
    <span class="tp">Map&lt;UserStatus, MessageDeliveryStrategy&gt;</span> strategies;

    <span class="kw">void</span> <span class="fn">deliver</span>(Long userId, Message message) {
        UserStatus status = presenceService.getUserStatus(userId);
        <span class="kw">if</span> (status == ONLINE) {
            strategies.get(ONLINE).deliver(userId, message);  <span class="cm">// WebSocket</span>
        } <span class="kw">else</span> {
            strategies.get(OFFLINE).deliver(userId, message); <span class="cm">// Queue + Push</span>
        }
    }
}
    </pre></div>
</div>

<!-- ============ 9. SEQUENCE FLOW ============ -->

<!-- ============ 10. SEQUENCE FLOW ============ -->
<div class="section theme-purple">
    <div class="section-title"><span class="section-num">10</span>Sequence Flow &mdash; Send Message</div>
    <div class="flow-container">
        <div class="flow-box flow-green">User A &rarr; WebSocket frame: {roomId, content, type}</div>
        <div class="flow-arrow arrow-green"></div>
        <div class="flow-box flow-blue">ChatController receives WebSocket message</div>
        <div class="flow-arrow arrow-blue"></div>
        <div class="flow-box flow-purple">MessageService.sendMessage() &mdash; validate &amp; persist</div>
        <div class="flow-arrow arrow-purple"></div>
        <div class="flow-box flow-orange">RoomEventPublisher.publish(MESSAGE_SENT event)</div>
        <div class="flow-arrow arrow-orange"></div>
        <div class="flow-box flow-teal">MessageBroadcastObserver &rarr; fan-out to room subscribers</div>
        <div class="flow-arrow arrow-green"></div>
        <div class="flow-box flow-green">Online users: WebSocket push | Offline users: Kafka + FCM</div>
        <div class="flow-arrow arrow-blue"></div>
        <div class="flow-box flow-blue">ChatRoom.updateLastMessage() &mdash; update room metadata</div>
    </div>
</div>

<!-- ============ 10. CAPACITY ESTIMATION ============ -->

<!-- ============ 11. BOTTLENECKS ============ -->
<div class="section theme-red">
    <div class="section-title"><span class="section-num">11</span>Bottlenecks &amp; Solutions</div>
    <div class="bottleneck-grid">
        <div class="bottleneck-item"><span class="bottleneck-problem">Fan-out in large rooms (1000+ members)</span><span class="bottleneck-arrow">&#10132;</span><span class="bottleneck-solution">Async fan-out via Kafka partitioned by roomId</span></div>
        <div class="bottleneck-item"><span class="bottleneck-problem">Message ordering across distributed servers</span><span class="bottleneck-arrow">&#10132;</span><span class="bottleneck-solution">Snowflake IDs + per-room ordering with Kafka partitions</span></div>
        <div class="bottleneck-item"><span class="bottleneck-problem">File storage at scale (PBs per year)</span><span class="bottleneck-arrow">&#10132;</span><span class="bottleneck-solution">S3 + CDN + presigned URLs (never store in DB)</span></div>
        <div class="bottleneck-item"><span class="bottleneck-problem">WebSocket server crash / failover</span><span class="bottleneck-arrow">&#10132;</span><span class="bottleneck-solution">Redis Pub/Sub for cross-server broadcasting</span></div>
        <div class="bottleneck-item"><span class="bottleneck-problem">Hot rooms with high activity</span><span class="bottleneck-arrow">&#10132;</span><span class="bottleneck-solution">Message batching + rate limiting per room</span></div>
        <div class="bottleneck-item"><span class="bottleneck-problem">Search across millions of messages</span><span class="bottleneck-arrow">&#10132;</span><span class="bottleneck-solution">Elasticsearch index synced via CDC/Debezium</span></div>
        <div class="bottleneck-item"><span class="bottleneck-problem">Presence updates storm</span><span class="bottleneck-arrow">&#10132;</span><span class="bottleneck-solution">Debounce + batch presence updates every 5s</span></div>
    </div>
</div>

<!-- ============ 12. EDGE CASES ============ -->

<!-- ============ 12. EDGE CASES ============ -->
<div class="section theme-amber">
    <div class="section-title"><span class="section-num">12</span>Edge Cases &amp; Error Handling</div>
    <div class="edge-grid">
        <div class="edge-card">
            <h4>Message Ordering</h4>
            <p>Use Snowflake IDs (timestamp-based) to guarantee global ordering. Kafka partitions by roomId ensure per-room ordering. Clients sort by createdAt as a fallback.</p>
        </div>
        <div class="edge-card">
            <h4>Offline Sync</h4>
            <p>On reconnect, client sends lastReadMessageId. Server returns all messages after that ID using cursor-based query. Batched to avoid overwhelming the client.</p>
        </div>
        <div class="edge-card">
            <h4>Large File Upload</h4>
            <p>Files &gt; 25MB use multipart chunked upload to S3. Client uploads directly via presigned URL. Server only stores metadata. Resume support with upload tokens.</p>
        </div>
        <div class="edge-card">
            <h4>Room Capacity Exceeded</h4>
            <p>Room has maxParticipants limit. addParticipant() checks isFull() before adding. Return 409 Conflict if room is at capacity. CHANNEL type has higher limits (10K+).</p>
        </div>
        <div class="edge-card">
            <h4>Duplicate Message Prevention</h4>
            <p>Client generates UUID before sending. Server checks messageId uniqueness. Idempotent: same messageId = same response, no duplicate saved.</p>
        </div>
        <div class="edge-card">
            <h4>Concurrent Edits</h4>
            <p>@Version field enables optimistic locking. If two edits race, second gets OptimisticLockException &rarr; retry with latest version or fail gracefully.</p>
        </div>
        <div class="edge-card">
            <h4>WebSocket Disconnection</h4>
            <p>Heartbeat timeout (60s) triggers markOffline(). Messages queued in Kafka. On reconnect: re-authenticate, re-subscribe to rooms, sync missed messages.</p>
        </div>
        <div class="edge-card">
            <h4>Room Owner Leaves</h4>
            <p>Ownership auto-transfers to oldest admin. If no admins, oldest member is promoted. If room empty, archive after 30 days of inactivity.</p>
        </div>
    </div>
</div>

<!-- ============ 13. SECURITY ============ -->

<!-- ============ 13. SECURITY ============ -->
<div class="section theme-lime">
    <div class="section-title"><span class="section-num">13</span>Security</div>
    <div class="security-grid">
        <div class="security-item">
            <span class="shield">&#9670;</span>
            <div>JWT Authentication<div class="security-detail">Short-lived access token (15 min) + refresh token. WebSocket handshake validates JWT before upgrading connection.</div></div>
        </div>
        <div class="security-item">
            <span class="shield">&#9670;</span>
            <div>Room Authorization<div class="security-detail">Only participants can send messages or view history. Role-based: OWNER/ADMIN can manage members, MODERATOR can pin/delete messages.</div></div>
        </div>
        <div class="security-item">
            <span class="shield">&#9670;</span>
            <div>TLS / WSS Encryption<div class="security-detail">All REST APIs over HTTPS. WebSocket upgraded to WSS. Data encrypted in transit.</div></div>
        </div>
        <div class="security-item">
            <span class="shield">&#9670;</span>
            <div>Rate Limiting<div class="security-detail">Per-user: 60 msgs/min. Per-room: 200 msgs/min. File upload: 10/min. API Gateway enforces with Token Bucket algorithm.</div></div>
        </div>
        <div class="security-item">
            <span class="shield">&#9670;</span>
            <div>Input Validation &amp; Sanitization<div class="security-detail">Max message: 4000 chars. HTML/script tags stripped. File types whitelisted. File size limit: 25MB.</div></div>
        </div>
        <div class="security-item">
            <span class="shield">&#9670;</span>
            <div>File Security<div class="security-detail">S3 presigned URLs with 1-hour expiry. No direct public access. Virus scanning on upload via Lambda trigger.</div></div>
        </div>
        <div class="security-item">
            <span class="shield">&#9670;</span>
            <div>Audit Logging<div class="security-detail">All admin actions (add/remove member, delete message) logged with actor, timestamp, and details for compliance.</div></div>
        </div>
        <div class="security-item">
            <span class="shield">&#9670;</span>
            <div>CORS &amp; CSRF Protection<div class="security-detail">Strict CORS policy. WebSocket origin validation. CSRF tokens for REST endpoints.</div></div>
        </div>
    </div>
</div>

<!-- ============ 14. SUMMARY ============ -->

<!-- ============ 14. SUMMARY ============ -->
<div class="section theme-green">
    <div class="section-title"><span class="section-num">14</span>Interview Summary</div>
    <div class="summary-grid">
        <div class="summary-card sc-1"><h4>WebSocket + Room Subscriptions</h4><p>Real-time room-based messaging</p></div>
        <div class="summary-card sc-2"><h4>Observer + Mediator + Strategy</h4><p>Clean design pattern usage</p></div>
        <div class="summary-card sc-3"><h4>Cursor-based Pagination</h4><p>Efficient message history loading</p></div>
        <div class="summary-card sc-4"><h4>Redis Presence + Pub/Sub</h4><p>Online status &amp; cross-server events</p></div>
        <div class="summary-card sc-1"><h4>S3 + CDN</h4><p>Scalable file storage</p></div>
        <div class="summary-card sc-2"><h4>Kafka Fan-out</h4><p>Async broadcasting for large rooms</p></div>
        <div class="summary-card sc-3"><h4>Snowflake IDs</h4><p>Global message ordering</p></div>
        <div class="summary-card sc-4"><h4>SOLID Principles</h4><p>Interface segregation throughout</p></div>
    </div>
    <p style="text-align:center;margin-top:24px;color:#78909c;font-size:1em">
        Complete Chat Application LLD for <strong style="color:#b388ff">Java Spring Boot</strong> interviews &mdash; covers WebSocket architecture, design patterns, scalability, security &amp; edge cases.
    </p>
</div>

</div>
<div class="footer">Chat Application LLD &mdash; Interview Prep</div>
</div>
<!-- END CHAT APPLICATION LLD -->

<!-- ==================== AMAZON / FLIPKART CLONE LLD ==================== -->
`
}
