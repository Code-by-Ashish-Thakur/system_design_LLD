export default {
  title: "WhatsApp Low Level Design",
  subtitle: "Complete LLD for Java Spring Boot Interview",
  subtitleColor: "#d4f5e9",
  headerGradient: "linear-gradient(135deg,#075e54,#128c7e,#25d366)",
  footerText: "WhatsApp LLD",
  content: `
<!-- ============ 1. FUNCTIONAL REQUIREMENTS ============ -->
<div id="requirements" class="section theme-green">
    <div class="section-title"><span class="section-num">1</span>Functional Requirements</div>
    <div class="req-grid">
        <div class="req-pill"><span class="num">1</span> User Login with OTP</div>
        <div class="req-pill"><span class="num">2</span> One-to-One Chat</div>
        <div class="req-pill"><span class="num">3</span> Group Chat <span class="new-badge">NEW</span></div>
        <div class="req-pill"><span class="num">4</span> Send Message</div>
        <div class="req-pill"><span class="num">5</span> Receive Message</div>
        <div class="req-pill"><span class="num">6</span> Online/Offline Status</div>
        <div class="req-pill"><span class="num">7</span> Typing Indicator <span class="new-badge">NEW</span></div>
        <div class="req-pill"><span class="num">8</span> Push Notification</div>
        <div class="req-pill"><span class="num">9</span> Voice/Video Call</div>
        <div class="req-pill"><span class="num">10</span> Search Chat</div>
        <div class="req-pill"><span class="num">11</span> Sent/Delivered/Seen</div>
        <div class="req-pill"><span class="num">12</span> Read Receipt Flow <span class="new-badge">NEW</span></div>
        <div class="req-pill"><span class="num">13</span> Delete Message</div>
        <div class="req-pill"><span class="num">14</span> Edit Message</div>
        <div class="req-pill"><span class="num">15</span> Media Upload <span class="new-badge">NEW</span></div>
        <div class="req-pill"><span class="num">16</span> Logout</div>
    </div>
</div>

<!-- ============ 2. ENUMS ============ -->
<div id="enums" class="section theme-purple">
    <div class="section-title"><span class="section-num">2</span>Enums</div>
    <div class="enum-grid">
        <div class="enum-card">
            <h3>UserStatus</h3>
            <div class="enum-val">ONLINE</div>
            <div class="enum-val">OFFLINE</div>
        </div>
        <div class="enum-card">
            <h3>MessageStatus</h3>
            <div class="enum-val">SENT</div>
            <div class="enum-val">DELIVERED</div>
            <div class="enum-val">SEEN</div>
        </div>
        <div class="enum-card">
            <h3>MessageType</h3>
            <div class="enum-val">TEXT</div>
            <div class="enum-val">IMAGE</div>
            <div class="enum-val">VIDEO</div>
            <div class="enum-val">AUDIO</div>
            <div class="enum-val">DOCUMENT</div>
        </div>
        <div class="enum-card">
            <h3>CallType</h3>
            <div class="enum-val">VOICE</div>
            <div class="enum-val">VIDEO</div>
        </div>
        <div class="enum-card" style="border-color:rgba(255,82,82,.25);background:linear-gradient(145deg,rgba(255,82,82,.1),rgba(255,82,82,.02))">
            <h3 style="color:#ff5252">CallStatus <span class="new-badge">NEW</span></h3>
            <div class="enum-val">RINGING</div>
            <div class="enum-val">CONNECTED</div>
            <div class="enum-val">ENDED</div>
            <div class="enum-val">MISSED</div>
            <div class="enum-val">REJECTED</div>
        </div>
        <div class="enum-card" style="border-color:rgba(255,82,82,.25);background:linear-gradient(145deg,rgba(255,82,82,.1),rgba(255,82,82,.02))">
            <h3 style="color:#ff5252">DeleteType <span class="new-badge">NEW</span></h3>
            <div class="enum-val">DELETE_FOR_ME</div>
            <div class="enum-val">DELETE_FOR_EVERYONE</div>
        </div>
        <div class="enum-card" style="border-color:rgba(255,82,82,.25);background:linear-gradient(145deg,rgba(255,82,82,.1),rgba(255,82,82,.02))">
            <h3 style="color:#ff5252">ConversationType <span class="new-badge">NEW</span></h3>
            <div class="enum-val">ONE_TO_ONE</div>
            <div class="enum-val">GROUP</div>
        </div>
    </div>
</div>

<!-- ============ 3. CLASS DESIGN ============ -->
<div id="classes" class="section theme-orange">
    <div class="section-title"><span class="section-num">3</span>Class Design (with Methods)</div>

    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="ann">@Entity</span>
<span class="kw">class</span> <span class="cn">User</span> {
    <span class="ann">@Id @GeneratedValue</span>
    <span class="tp">Long</span> <span class="fn">id</span>;
    <span class="tp">String</span> <span class="fn">phoneNumber</span>;
    <span class="tp">String</span> <span class="fn">name</span>;
    <span class="tp">String</span> <span class="fn">profilePic</span>;
    <span class="ann">@Enumerated(EnumType.STRING)</span>
    <span class="tp">UserStatus</span> <span class="fn">status</span>;
    <span class="tp">LocalDateTime</span> <span class="fn">lastSeen</span>;
    <span class="tp">String</span> <span class="fn">publicKey</span>;  <span class="cm">// for E2E encryption</span>

    <span class="kw">public void</span> <span class="fn">goOnline</span>()  { <span class="kw">this</span>.status = ONLINE; }
    <span class="kw">public void</span> <span class="fn">goOffline</span>() { <span class="kw">this</span>.status = OFFLINE; <span class="kw">this</span>.lastSeen = LocalDateTime.now(); }
    <span class="kw">public boolean</span> <span class="fn">isOnline</span>() { <span class="kw">return this</span>.status == ONLINE; }
}
    </pre></div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="ann">@Entity</span>
<span class="kw">class</span> <span class="cn">Message</span> {
    <span class="ann">@Id</span>
    <span class="tp">String</span> <span class="fn">messageId</span> = UUID.randomUUID().toString();
    <span class="tp">Long</span> <span class="fn">senderId</span>;
    <span class="tp">Long</span> <span class="fn">receiverId</span>;
    <span class="tp">String</span> <span class="fn">conversationId</span>;
    <span class="tp">String</span> <span class="fn">content</span>;
    <span class="tp">String</span> <span class="fn">mediaUrl</span>;
    <span class="ann">@Enumerated(EnumType.STRING)</span>
    <span class="tp">MessageStatus</span> <span class="fn">status</span> = SENT;
    <span class="ann">@Enumerated(EnumType.STRING)</span>
    <span class="tp">MessageType</span> <span class="fn">type</span>;
    <span class="tp">DeleteType</span> <span class="fn">deleteType</span>;
    <span class="tp">boolean</span> <span class="fn">isEdited</span>;
    <span class="tp">boolean</span> <span class="fn">isDeleted</span>;
    <span class="tp">LocalDateTime</span> <span class="fn">createdAt</span>;
    <span class="ann">@Version</span>  <span class="cm">// Optimistic Locking for concurrency</span>
    <span class="tp">Long</span> <span class="fn">version</span>;

    <span class="kw">public void</span> <span class="fn">markDelivered</span>() { <span class="kw">this</span>.status = DELIVERED; }
    <span class="kw">public void</span> <span class="fn">markSeen</span>()      { <span class="kw">this</span>.status = SEEN; }
    <span class="kw">public void</span> <span class="fn">edit</span>(String newContent) {
        <span class="kw">this</span>.content = newContent;
        <span class="kw">this</span>.isEdited = <span class="kw">true</span>;
    }
    <span class="kw">public void</span> <span class="fn">softDelete</span>(DeleteType type) {
        <span class="kw">this</span>.isDeleted = <span class="kw">true</span>;
        <span class="kw">this</span>.deleteType = type;
        <span class="kw">if</span> (type == DELETE_FOR_EVERYONE) <span class="kw">this</span>.content = <span class="st">"This message was deleted"</span>;
    }
    <span class="kw">public boolean</span> <span class="fn">isEditable</span>() {
        <span class="kw">return</span> !isDeleted &amp;&amp; Duration.between(createdAt, LocalDateTime.now()).toMinutes() &lt; 15;
    }
}
    </pre></div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="ann">@Entity</span>
<span class="kw">class</span> <span class="cn">Group</span> {
    <span class="ann">@Id</span>
    <span class="tp">String</span> <span class="fn">groupId</span> = UUID.randomUUID().toString();
    <span class="tp">String</span> <span class="fn">name</span>;
    <span class="tp">String</span> <span class="fn">description</span>;
    <span class="ann">@ElementCollection</span>
    <span class="tp">Set&lt;Long&gt;</span> <span class="fn">adminIds</span>;
    <span class="ann">@ElementCollection</span>
    <span class="tp">Set&lt;Long&gt;</span> <span class="fn">memberIds</span>;
    <span class="tp">Long</span> <span class="fn">createdBy</span>;

    <span class="kw">public boolean</span> <span class="fn">isAdmin</span>(Long userId) { <span class="kw">return</span> adminIds.contains(userId); }
    <span class="kw">public void</span> <span class="fn">addMember</span>(Long userId)  { memberIds.add(userId); }
    <span class="kw">public void</span> <span class="fn">removeMember</span>(Long userId) {
        memberIds.remove(userId);
        adminIds.remove(userId);
    }
}
    </pre></div>
</div>

<!-- ============ 4. DATABASE SCHEMA ============ -->
<div id="database" class="section theme-pink">
    <div class="section-title"><span class="section-num">4</span>Database Schema (with FK &amp; Indexes)</div>

    <div class="sub-heading" style="color:#ff80ab;border-color:#ff80ab">Database Technology Stack</div>
    <div class="dbtech-grid">
        <div class="dbtech-card">
            <div class="dbtech-name">PostgreSQL <span class="dbtech-type">RDBMS</span></div>
            <div class="dbtech-usage">Users, conversations, groups &mdash; ACID transactions for structured relational data</div>
            <div class="dbtech-tables"><span>users</span><span>conversations</span><span>groups</span></div>
        </div>
        <div class="dbtech-card">
            <div class="dbtech-name">Cassandra <span class="dbtech-type">NoSQL</span></div>
            <div class="dbtech-usage">Messages storage &mdash; write-heavy, time-series data partitioned by conversation_id</div>
            <div class="dbtech-tables"><span>messages</span><span>group_messages</span></div>
        </div>
        <div class="dbtech-card">
            <div class="dbtech-name">Redis <span class="dbtech-type">In-Memory</span></div>
            <div class="dbtech-usage">Online/offline presence, typing indicators, WebSocket session mapping</div>
            <div class="dbtech-tables"><span>presence:{userId}</span><span>typing:{convId}</span></div>
        </div>
        <div class="dbtech-card">
            <div class="dbtech-name">S3 <span class="dbtech-type">Blob Storage</span></div>
            <div class="dbtech-usage">Media files &mdash; images, videos, voice notes, documents</div>
            <div class="dbtech-tables"><span>media/{userId}/{messageId}</span></div>
        </div>
        <div class="dbtech-card">
            <div class="dbtech-name">Kafka <span class="dbtech-type">Message Queue</span></div>
            <div class="dbtech-usage">Async message delivery, push notifications, event streaming</div>
            <div class="dbtech-tables"><span>chat-events</span><span>notifications</span></div>
        </div>
    </div>

    <div class="db-grid">
        <div class="db-table">
            <h3>users</h3>
            <ul>
                <li><span class="pk">id BIGINT (PK, AUTO_INCREMENT)</span></li>
                <li>phone_number VARCHAR(15) UNIQUE</li>
                <li>name VARCHAR(100)</li>
                <li>profile_pic VARCHAR(255)</li>
                <li>status ENUM('ONLINE','OFFLINE')</li>
                <li>last_seen TIMESTAMP</li>
                <li>public_key TEXT</li>
                <li><span class="idx">INDEX idx_phone (phone_number)</span></li>
            </ul>
        </div>
        <div class="db-table">
            <h3>messages</h3>
            <ul>
                <li><span class="pk">message_id VARCHAR(36) (PK)</span></li>
                <li><span class="fk">sender_id BIGINT (FK &rarr; users.id)</span></li>
                <li><span class="fk">receiver_id BIGINT (FK &rarr; users.id)</span></li>
                <li><span class="fk">conversation_id VARCHAR(36) (FK)</span></li>
                <li>content TEXT</li>
                <li>media_url VARCHAR(255)</li>
                <li>message_type ENUM</li>
                <li>message_status ENUM</li>
                <li>delete_type ENUM</li>
                <li>created_at TIMESTAMP</li>
                <li>updated_at TIMESTAMP</li>
                <li>is_edited BOOLEAN DEFAULT FALSE</li>
                <li>is_deleted BOOLEAN DEFAULT FALSE</li>
                <li>version BIGINT DEFAULT 0</li>
                <li><span class="idx">INDEX idx_conv_time (conversation_id, created_at DESC)</span></li>
                <li><span class="idx">INDEX idx_sender (sender_id)</span></li>
                <li><span class="idx">INDEX idx_receiver (receiver_id)</span></li>
            </ul>
        </div>
        <div class="db-table">
            <h3>conversations</h3>
            <ul>
                <li><span class="pk">conversation_id VARCHAR(36) (PK)</span></li>
                <li>type ENUM('ONE_TO_ONE','GROUP')</li>
                <li><span class="fk">user1_id BIGINT (FK &rarr; users.id)</span></li>
                <li><span class="fk">user2_id BIGINT (FK &rarr; users.id)</span></li>
                <li>updated_at TIMESTAMP</li>
                <li><span class="idx">INDEX idx_users (user1_id, user2_id)</span></li>
            </ul>
        </div>
        <div class="db-table" style="border-color:rgba(255,171,64,.25)">
            <h3 style="background:rgba(255,171,64,.15);color:#ffab40">groups <span class="new-badge">NEW</span></h3>
            <ul>
                <li><span class="pk">group_id VARCHAR(36) (PK)</span></li>
                <li>name VARCHAR(100)</li>
                <li>description VARCHAR(500)</li>
                <li><span class="fk">created_by BIGINT (FK &rarr; users.id)</span></li>
                <li>group_pic VARCHAR(255)</li>
                <li>created_at TIMESTAMP</li>
            </ul>
        </div>
        <div class="db-table" style="border-color:rgba(255,171,64,.25)">
            <h3 style="background:rgba(255,171,64,.15);color:#ffab40">group_members <span class="new-badge">NEW</span></h3>
            <ul>
                <li><span class="fk">group_id VARCHAR(36) (FK &rarr; groups)</span></li>
                <li><span class="fk">user_id BIGINT (FK &rarr; users.id)</span></li>
                <li>role ENUM('ADMIN','MEMBER')</li>
                <li>joined_at TIMESTAMP</li>
                <li><span class="pk">PK (group_id, user_id)</span></li>
            </ul>
        </div>
        <div class="db-table">
            <h3>calls</h3>
            <ul>
                <li><span class="pk">call_id VARCHAR(36) (PK)</span></li>
                <li><span class="fk">caller_id BIGINT (FK &rarr; users.id)</span></li>
                <li><span class="fk">receiver_id BIGINT (FK &rarr; users.id)</span></li>
                <li>call_type ENUM('VOICE','VIDEO')</li>
                <li>status ENUM('RINGING','CONNECTED','ENDED','MISSED','REJECTED')</li>
                <li>start_time TIMESTAMP</li>
                <li>end_time TIMESTAMP</li>
            </ul>
        </div>
    </div>
    <div style="margin-top:16px;padding:14px 18px;background:rgba(255,128,171,.08);border-radius:12px;border:1px solid rgba(255,128,171,.15)">
        <strong style="color:#ff80ab">Why these indexes matter:</strong>
        <p style="color:#b0bec5;font-size:.88em;margin-top:8px;line-height:1.6">
            <strong>idx_conv_time</strong> &mdash; Most frequent query: "load latest messages in a chat" (pagination)<br>
            <strong>idx_sender / idx_receiver</strong> &mdash; Fast lookup for undelivered messages when user comes online<br>
            <strong>idx_phone</strong> &mdash; Login lookup by phone number (OTP flow)<br>
            <strong>idx_users</strong> &mdash; Find existing conversation between two users before creating a new one
        </p>
    </div>

    <div class="sub-heading" style="color:#ff80ab;border-color:#ff80ab">Database Examples &mdash; Sample Data</div>
    <div class="db-grid">
        <div class="db-table">
            <h3>users &mdash; Example Rows</h3>
            <ul>
                <li style="color:#80cbc4"><strong>Row 1:</strong> id=1, phone='9876543210', name='Rahul', status='ONLINE', last_seen=NULL</li>
                <li style="color:#80cbc4"><strong>Row 2:</strong> id=2, phone='9123456789', name='Priya', status='OFFLINE', last_seen='2026-06-09 14:30:00'</li>
                <li style="color:#80cbc4"><strong>Row 3:</strong> id=3, phone='9988776655', name='Amit', status='ONLINE', last_seen=NULL</li>
            </ul>
        </div>
        <div class="db-table">
            <h3>messages &mdash; Example Rows</h3>
            <ul>
                <li style="color:#80cbc4"><strong>Row 1:</strong> message_id='a1b2-c3d4', sender_id=1, receiver_id=2, conversation_id='conv-001', content='Hey Priya!', type='TEXT', status='SEEN', is_edited=false</li>
                <li style="color:#80cbc4"><strong>Row 2:</strong> message_id='e5f6-g7h8', sender_id=2, receiver_id=1, conversation_id='conv-001', content='Hi Rahul, kya haal hai?', type='TEXT', status='DELIVERED', is_edited=false</li>
                <li style="color:#80cbc4"><strong>Row 3:</strong> message_id='i9j0-k1l2', sender_id=1, receiver_id=2, conversation_id='conv-001', media_url='s3://media/1/img.jpg', type='IMAGE', status='SENT', is_edited=false</li>
            </ul>
        </div>
        <div class="db-table">
            <h3>conversations &mdash; Example Rows</h3>
            <ul>
                <li style="color:#80cbc4"><strong>Row 1:</strong> conversation_id='conv-001', type='ONE_TO_ONE', user1_id=1, user2_id=2, updated_at='2026-06-09 14:35:00'</li>
                <li style="color:#80cbc4"><strong>Row 2:</strong> conversation_id='conv-002', type='ONE_TO_ONE', user1_id=1, user2_id=3, updated_at='2026-06-09 10:00:00'</li>
                <li style="color:#80cbc4"><strong>Row 3:</strong> conversation_id='conv-grp-001', type='GROUP', user1_id=NULL, user2_id=NULL, updated_at='2026-06-09 15:00:00'</li>
            </ul>
        </div>
        <div class="db-table" style="border-color:rgba(255,171,64,.25)">
            <h3 style="background:rgba(255,171,64,.15);color:#ffab40">groups &mdash; Example Rows</h3>
            <ul>
                <li style="color:#80cbc4"><strong>Row 1:</strong> group_id='grp-001', name='College Friends', description='Batch 2020 group', created_by=1, group_pic='s3://pics/grp1.jpg'</li>
                <li style="color:#80cbc4"><strong>Row 2:</strong> group_id='grp-002', name='Office Team', description='Dev team chat', created_by=3, group_pic=NULL</li>
            </ul>
        </div>
        <div class="db-table" style="border-color:rgba(255,171,64,.25)">
            <h3 style="background:rgba(255,171,64,.15);color:#ffab40">group_members &mdash; Example Rows</h3>
            <ul>
                <li style="color:#80cbc4"><strong>Row 1:</strong> group_id='grp-001', user_id=1, role='ADMIN', joined_at='2026-01-15 09:00:00'</li>
                <li style="color:#80cbc4"><strong>Row 2:</strong> group_id='grp-001', user_id=2, role='MEMBER', joined_at='2026-01-15 09:01:00'</li>
                <li style="color:#80cbc4"><strong>Row 3:</strong> group_id='grp-001', user_id=3, role='MEMBER', joined_at='2026-01-16 11:30:00'</li>
            </ul>
        </div>
        <div class="db-table">
            <h3>calls &mdash; Example Rows</h3>
            <ul>
                <li style="color:#80cbc4"><strong>Row 1:</strong> call_id='call-001', caller_id=1, receiver_id=2, call_type='VOICE', status='ENDED', start_time='2026-06-09 12:00:00', end_time='2026-06-09 12:15:00'</li>
                <li style="color:#80cbc4"><strong>Row 2:</strong> call_id='call-002', caller_id=3, receiver_id=1, call_type='VIDEO', status='MISSED', start_time='2026-06-09 13:00:00', end_time=NULL</li>
            </ul>
        </div>
    </div>
</div>

<!-- ============ 5. APIs ============ -->
<div id="apis" class="section theme-teal">
    <div class="section-title"><span class="section-num">5</span>APIs (with Pagination &amp; Media)</div>
    <div class="api-grid">
        <div class="api-card">
            <div class="api-header"><span class="api-method method-post">POST</span><span class="api-path">/auth/send-otp</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Request</div>{ <span class="key">"phone"</span>: <span class="val">"9999999999"</span> }</div>
                <div class="api-json"><div class="label">Response</div>{ <span class="key">"success"</span>: <span class="val">true</span>, <span class="key">"expiresIn"</span>: <span class="val">300</span> }</div>
            </div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-post">POST</span><span class="api-path">/auth/verify-otp</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Request</div>{ <span class="key">"phone"</span>: <span class="val">"9999999999"</span>, <span class="key">"otp"</span>: <span class="val">"123456"</span> }</div>
                <div class="api-json"><div class="label">Response 200</div>{ <span class="key">"token"</span>: <span class="val">"jwt-token"</span> }<br><br><div class="label" style="color:#ff5252">Response 401</div>{ <span class="key">"error"</span>: <span class="val">"Invalid or expired OTP"</span> }</div>
            </div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-post">POST</span><span class="api-path">/messages/send</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Request</div>{ <span class="key">"receiverId"</span>: <span class="val">2</span>, <span class="key">"content"</span>: <span class="val">"Hello"</span>, <span class="key">"type"</span>: <span class="val">"TEXT"</span> }</div>
                <div class="api-json"><div class="label">Response 201</div>{ <span class="key">"messageId"</span>: <span class="val">"uuid"</span>, <span class="key">"status"</span>: <span class="val">"SENT"</span>, <span class="key">"createdAt"</span>: <span class="val">"..."</span> }</div>
            </div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-get">GET</span><span class="api-path">/messages/{conversationId}?page=0&amp;size=20</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Query Params</div><span class="key">page</span>: <span class="val">0</span> (default)<br><span class="key">size</span>: <span class="val">20</span> (default)</div>
                <div class="api-json"><div class="label">Response 200</div>{ <span class="key">"messages"</span>: <span class="val">[...]</span>, <span class="key">"totalPages"</span>: <span class="val">15</span>, <span class="key">"hasNext"</span>: <span class="val">true</span> }</div>
            </div>
            <div class="api-note">Paginated &mdash; loads 20 messages at a time, newest first</div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-put">PUT</span><span class="api-path">/messages/{messageId}</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Request</div>{ <span class="key">"content"</span>: <span class="val">"Updated text"</span> }</div>
                <div class="api-json"><div class="label">Response 200</div>{ <span class="key">"success"</span>: <span class="val">true</span>, <span class="key">"isEdited"</span>: <span class="val">true</span> }<br><br><div class="label" style="color:#ff5252">Response 403</div>{ <span class="key">"error"</span>: <span class="val">"Edit window expired (15 min)"</span> }</div>
            </div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-delete">DELETE</span><span class="api-path">/messages/{messageId}?type=DELETE_FOR_EVERYONE</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Query Param</div><span class="key">type</span>: <span class="val">DELETE_FOR_ME</span> | <span class="val">DELETE_FOR_EVERYONE</span></div>
                <div class="api-json"><div class="label">Response 200</div>{ <span class="key">"success"</span>: <span class="val">true</span> }</div>
            </div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-get">GET</span><span class="api-path">/messages/search?keyword=hello&amp;conversationId=abc</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Query Params</div><span class="key">keyword</span>: <span class="val">"hello"</span><br><span class="key">conversationId</span>: <span class="val">"abc"</span> (optional)</div>
                <div class="api-json"><div class="label">Response 200</div>{ <span class="key">"results"</span>: <span class="val">[{messageId, content, ...}]</span> }</div>
            </div>
        </div>
        <div class="api-card" style="border-color:rgba(255,171,64,.3)">
            <div class="api-header" style="background:rgba(255,171,64,.08)"><span class="api-method method-post">POST</span><span class="api-path">/media/upload</span> <span class="new-badge">NEW</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Request (multipart)</div><span class="key">file</span>: <span class="val">binary</span><br><span class="key">type</span>: <span class="val">IMAGE | VIDEO | AUDIO</span></div>
                <div class="api-json"><div class="label">Response 201</div>{ <span class="key">"mediaUrl"</span>: <span class="val">"https://s3.../img.jpg"</span> }</div>
            </div>
            <div class="api-note">Upload to S3, then send message with mediaUrl</div>
        </div>
        <div class="api-card" style="border-color:rgba(255,171,64,.3)">
            <div class="api-header" style="background:rgba(255,171,64,.08)"><span class="api-method method-post">POST</span><span class="api-path">/groups/create</span> <span class="new-badge">NEW</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Request</div>{ <span class="key">"name"</span>: <span class="val">"Friends"</span>, <span class="key">"memberIds"</span>: <span class="val">[2,3,4]</span> }</div>
                <div class="api-json"><div class="label">Response 201</div>{ <span class="key">"groupId"</span>: <span class="val">"uuid"</span> }</div>
            </div>
        </div>
    </div>
</div>

<!-- ============ 6. SERVICE LLD ============ -->
<div id="services" class="section theme-yellow">
    <div class="section-title"><span class="section-num">6</span>Service LLD</div>
    <div class="service-grid">
        <div class="service-card">
            <h3>AuthService</h3>
            <p class="svc-desc">User ka login handle karta hai &mdash; OTP bhejta hai, verify karta hai, aur logout bhi</p>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">1</span> sendOTP(SendOTPRequest)</div>
                <div class="method-return">Returns: <code>void</code></div>
                <div class="params-title">Parameters (SendOTPRequest):</div>
                <div class="param-row"><span class="param-name">phoneNumber</span><span class="param-type">String</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">2</span> verifyOTP(VerifyOTPRequest)</div>
                <div class="method-return">Returns: <code>String (JWT Token)</code></div>
                <div class="params-title">Parameters (VerifyOTPRequest):</div>
                <div class="param-row"><span class="param-name">phoneNumber</span><span class="param-type">String</span></div>
                <div class="param-row"><span class="param-name">otp</span><span class="param-type">String</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">3</span> logout(LogoutRequest)</div>
                <div class="method-return">Returns: <code>void</code></div>
                <div class="params-title">Parameters (LogoutRequest):</div>
                <div class="param-row"><span class="param-name">userId</span><span class="param-type">Long</span></div>
            </div>
        </div>
        <div class="service-card">
            <h3>MessageService</h3>
            <p class="svc-desc">Message bhejne, receive karne, edit/delete karne aur search karne ka poora kaam yahi karta hai</p>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">1</span> sendMessage(SendMessageRequest)</div>
                <div class="method-return">Returns: <code>Message</code></div>
                <div class="params-title">Parameters (SendMessageRequest):</div>
                <div class="param-row"><span class="param-name">senderId</span><span class="param-type">Long</span></div>
                <div class="param-row"><span class="param-name">receiverId</span><span class="param-type">Long</span></div>
                <div class="param-row"><span class="param-name">content</span><span class="param-type">String</span></div>
                <div class="param-row"><span class="param-name">type</span><span class="param-type">MessageType</span></div>
                <div class="param-row"><span class="param-name">mediaUrl</span><span class="param-type">String</span><span class="param-opt">[Optional]</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">2</span> getMessages(GetMessagesRequest)</div>
                <div class="method-return">Returns: <code>List&lt;Message&gt;</code></div>
                <div class="params-title">Parameters (GetMessagesRequest):</div>
                <div class="param-row"><span class="param-name">conversationId</span><span class="param-type">String</span></div>
                <div class="param-row"><span class="param-name">page</span><span class="param-type">int</span></div>
                <div class="param-row"><span class="param-name">size</span><span class="param-type">int</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">3</span> editMessage(EditMessageRequest)</div>
                <div class="method-return">Returns: <code>void</code></div>
                <div class="params-title">Parameters (EditMessageRequest):</div>
                <div class="param-row"><span class="param-name">messageId</span><span class="param-type">String</span></div>
                <div class="param-row"><span class="param-name">newContent</span><span class="param-type">String</span></div>
                <div class="param-row"><span class="param-name">userId</span><span class="param-type">Long</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">4</span> deleteMessage(DeleteMessageRequest)</div>
                <div class="method-return">Returns: <code>void</code></div>
                <div class="params-title">Parameters (DeleteMessageRequest):</div>
                <div class="param-row"><span class="param-name">messageId</span><span class="param-type">String</span></div>
                <div class="param-row"><span class="param-name">userId</span><span class="param-type">Long</span></div>
                <div class="param-row"><span class="param-name">deleteType</span><span class="param-type">DeleteType</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">5</span> searchMessages(SearchMessagesRequest)</div>
                <div class="method-return">Returns: <code>List&lt;Message&gt;</code></div>
                <div class="params-title">Parameters (SearchMessagesRequest):</div>
                <div class="param-row"><span class="param-name">conversationId</span><span class="param-type">String</span></div>
                <div class="param-row"><span class="param-name">keyword</span><span class="param-type">String</span></div>
                <div class="param-row"><span class="param-name">page</span><span class="param-type">int</span></div>
            </div>
        </div>
        <div class="service-card">
            <h3>MessageStatusService <span class="new-badge" style="font-size:.55em">NEW</span></h3>
            <p class="svc-desc">Message ka status track karta hai &mdash; sent, delivered ya seen (blue tick wala kaam)</p>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">1</span> markAsDelivered(MarkDeliveredRequest)</div>
                <div class="method-return">Returns: <code>void</code></div>
                <div class="params-title">Parameters (MarkDeliveredRequest):</div>
                <div class="param-row"><span class="param-name">messageId</span><span class="param-type">String</span></div>
                <div class="param-row"><span class="param-name">userId</span><span class="param-type">Long</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">2</span> markAsSeen(MarkSeenRequest)</div>
                <div class="method-return">Returns: <code>void</code></div>
                <div class="params-title">Parameters (MarkSeenRequest):</div>
                <div class="param-row"><span class="param-name">messageId</span><span class="param-type">String</span></div>
                <div class="param-row"><span class="param-name">userId</span><span class="param-type">Long</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">3</span> getStatus(GetStatusRequest)</div>
                <div class="method-return">Returns: <code>MessageStatus</code></div>
                <div class="params-title">Parameters (GetStatusRequest):</div>
                <div class="param-row"><span class="param-name">messageId</span><span class="param-type">String</span></div>
            </div>
        </div>
        <div class="service-card">
            <h3>ConversationService</h3>
            <p class="svc-desc">Do users ke beech chat thread manage karta hai &mdash; naya create ya existing dhundh ke deta hai</p>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">1</span> getOrCreateConversation(GetOrCreateConvRequest)</div>
                <div class="method-return">Returns: <code>Conversation</code></div>
                <div class="params-title">Parameters (GetOrCreateConvRequest):</div>
                <div class="param-row"><span class="param-name">userId1</span><span class="param-type">Long</span></div>
                <div class="param-row"><span class="param-name">userId2</span><span class="param-type">Long</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">2</span> getConversations(GetConversationsRequest)</div>
                <div class="method-return">Returns: <code>List&lt;Conversation&gt;</code></div>
                <div class="params-title">Parameters (GetConversationsRequest):</div>
                <div class="param-row"><span class="param-name">userId</span><span class="param-type">Long</span></div>
                <div class="param-row"><span class="param-name">page</span><span class="param-type">int</span></div>
            </div>
        </div>
        <div class="service-card">
            <h3>PresenceService</h3>
            <p class="svc-desc">User online hai ya offline, last seen kab tha, aur typing indicator &mdash; sab yahi handle karta hai</p>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">1</span> markOnline(MarkOnlineRequest)</div>
                <div class="method-return">Returns: <code>void</code></div>
                <div class="params-title">Parameters (MarkOnlineRequest):</div>
                <div class="param-row"><span class="param-name">userId</span><span class="param-type">Long</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">2</span> markOffline(MarkOfflineRequest)</div>
                <div class="method-return">Returns: <code>void</code></div>
                <div class="params-title">Parameters (MarkOfflineRequest):</div>
                <div class="param-row"><span class="param-name">userId</span><span class="param-type">Long</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">3</span> getUserStatus(GetUserStatusRequest)</div>
                <div class="method-return">Returns: <code>UserStatus</code></div>
                <div class="params-title">Parameters (GetUserStatusRequest):</div>
                <div class="param-row"><span class="param-name">userId</span><span class="param-type">Long</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">4</span> broadcastTyping(BroadcastTypingRequest)</div>
                <div class="method-return">Returns: <code>void</code></div>
                <div class="params-title">Parameters (BroadcastTypingRequest):</div>
                <div class="param-row"><span class="param-name">userId</span><span class="param-type">Long</span></div>
                <div class="param-row"><span class="param-name">conversationId</span><span class="param-type">String</span></div>
            </div>
        </div>
        <div class="service-card">
            <h3>NotificationService</h3>
            <p class="svc-desc">Jab user offline ho toh push notification bhejta hai, agar woh bhi fail ho toh SMS fallback karta hai</p>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">1</span> sendPushNotification(SendPushRequest)</div>
                <div class="method-return">Returns: <code>void</code></div>
                <div class="params-title">Parameters (SendPushRequest):</div>
                <div class="param-row"><span class="param-name">userId</span><span class="param-type">Long</span></div>
                <div class="param-row"><span class="param-name">title</span><span class="param-type">String</span></div>
                <div class="param-row"><span class="param-name">body</span><span class="param-type">String</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">2</span> sendSMSFallback(SendSMSRequest)</div>
                <div class="method-return">Returns: <code>void</code></div>
                <div class="params-title">Parameters (SendSMSRequest):</div>
                <div class="param-row"><span class="param-name">userId</span><span class="param-type">Long</span></div>
                <div class="param-row"><span class="param-name">message</span><span class="param-type">String</span></div>
            </div>
        </div>
        <div class="service-card" style="border-color:rgba(255,171,64,.3)">
            <h3 style="color:#ffab40">GroupService <span class="new-badge" style="font-size:.55em">NEW</span></h3>
            <p class="svc-desc">Group banana, members add/remove karna, aur group mein message bhejne ka kaam &mdash; sab yahi karta hai</p>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">1</span> createGroup(CreateGroupRequest)</div>
                <div class="method-return">Returns: <code>Group</code></div>
                <div class="params-title">Parameters (CreateGroupRequest):</div>
                <div class="param-row"><span class="param-name">name</span><span class="param-type">String</span></div>
                <div class="param-row"><span class="param-name">createdBy</span><span class="param-type">Long</span></div>
                <div class="param-row"><span class="param-name">memberIds</span><span class="param-type">List&lt;Long&gt;</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">2</span> addMember(AddMemberRequest)</div>
                <div class="method-return">Returns: <code>void</code></div>
                <div class="params-title">Parameters (AddMemberRequest):</div>
                <div class="param-row"><span class="param-name">groupId</span><span class="param-type">String</span></div>
                <div class="param-row"><span class="param-name">adminId</span><span class="param-type">Long</span></div>
                <div class="param-row"><span class="param-name">newMemberId</span><span class="param-type">Long</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">3</span> removeMember(RemoveMemberRequest)</div>
                <div class="method-return">Returns: <code>void</code></div>
                <div class="params-title">Parameters (RemoveMemberRequest):</div>
                <div class="param-row"><span class="param-name">groupId</span><span class="param-type">String</span></div>
                <div class="param-row"><span class="param-name">adminId</span><span class="param-type">Long</span></div>
                <div class="param-row"><span class="param-name">memberId</span><span class="param-type">Long</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">4</span> sendGroupMessage(SendGroupMessageRequest)</div>
                <div class="method-return">Returns: <code>void</code></div>
                <div class="params-title">Parameters (SendGroupMessageRequest):</div>
                <div class="param-row"><span class="param-name">groupId</span><span class="param-type">String</span></div>
                <div class="param-row"><span class="param-name">senderId</span><span class="param-type">Long</span></div>
                <div class="param-row"><span class="param-name">content</span><span class="param-type">String</span></div>
            </div>
        </div>
        <div class="service-card" style="border-color:rgba(255,171,64,.3)">
            <h3 style="color:#ffab40">MediaService <span class="new-badge" style="font-size:.55em">NEW</span></h3>
            <p class="svc-desc">Photos, videos, documents upload/download karna &mdash; S3 pe store karta hai aur presigned URL deta hai</p>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">1</span> uploadMedia(UploadMediaRequest)</div>
                <div class="method-return">Returns: <code>String (media URL)</code></div>
                <div class="params-title">Parameters (UploadMediaRequest):</div>
                <div class="param-row"><span class="param-name">file</span><span class="param-type">MultipartFile</span></div>
                <div class="param-row"><span class="param-name">userId</span><span class="param-type">Long</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">2</span> downloadMedia(DownloadMediaRequest)</div>
                <div class="method-return">Returns: <code>byte[]</code></div>
                <div class="params-title">Parameters (DownloadMediaRequest):</div>
                <div class="param-row"><span class="param-name">mediaUrl</span><span class="param-type">String</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">3</span> generatePresignedUrl(PresignedUrlRequest)</div>
                <div class="method-return">Returns: <code>String (presigned URL)</code></div>
                <div class="params-title">Parameters (PresignedUrlRequest):</div>
                <div class="param-row"><span class="param-name">mediaKey</span><span class="param-type">String</span></div>
                <div class="param-row"><span class="param-name">expiryMinutes</span><span class="param-type">int</span></div>
            </div>
        </div>
        <div class="service-card">
            <h3>CallService</h3>
            <p class="svc-desc">Voice aur video call ka poora flow &mdash; call start, accept, reject aur end sab handle karta hai</p>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">1</span> startCall(StartCallRequest)</div>
                <div class="method-return">Returns: <code>Call</code></div>
                <div class="params-title">Parameters (StartCallRequest):</div>
                <div class="param-row"><span class="param-name">callerId</span><span class="param-type">Long</span></div>
                <div class="param-row"><span class="param-name">receiverId</span><span class="param-type">Long</span></div>
                <div class="param-row"><span class="param-name">type</span><span class="param-type">CallType</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">2</span> acceptCall(AcceptCallRequest)</div>
                <div class="method-return">Returns: <code>void</code></div>
                <div class="params-title">Parameters (AcceptCallRequest):</div>
                <div class="param-row"><span class="param-name">callId</span><span class="param-type">String</span></div>
                <div class="param-row"><span class="param-name">userId</span><span class="param-type">Long</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">3</span> rejectCall(RejectCallRequest)</div>
                <div class="method-return">Returns: <code>void</code></div>
                <div class="params-title">Parameters (RejectCallRequest):</div>
                <div class="param-row"><span class="param-name">callId</span><span class="param-type">String</span></div>
                <div class="param-row"><span class="param-name">userId</span><span class="param-type">Long</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">4</span> endCall(EndCallRequest)</div>
                <div class="method-return">Returns: <code>void</code></div>
                <div class="params-title">Parameters (EndCallRequest):</div>
                <div class="param-row"><span class="param-name">callId</span><span class="param-type">String</span></div>
                <div class="param-row"><span class="param-name">userId</span><span class="param-type">Long</span></div>
            </div>
        </div>
    </div>
</div>

<!-- ============ 7. WEBSOCKET DESIGN ============ -->
<div id="websocket" class="section theme-blue">
    <div class="section-title"><span class="section-num">7</span>WebSocket Design (Enhanced)</div>

    <div class="sub-heading" style="color:#4fc3f7;border-color:#4fc3f7">Connection Management</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="cm">// In-memory session map &mdash; tracks who is connected</span>
<span class="kw">class</span> <span class="cn">WebSocketSessionManager</span> {
    <span class="cm">// ConcurrentHashMap for thread safety</span>
    Map&lt;Long, WebSocketSession&gt; <span class="fn">activeSessions</span> = <span class="kw">new</span> ConcurrentHashMap&lt;&gt;();

    <span class="kw">void</span> <span class="fn">addSession</span>(Long userId, WebSocketSession session);
    <span class="kw">void</span> <span class="fn">removeSession</span>(Long userId);
    <span class="kw">boolean</span> <span class="fn">isConnected</span>(Long userId);
    WebSocketSession <span class="fn">getSession</span>(Long userId);
}
    </pre></div>

    <div class="sub-heading" style="color:#4fc3f7;border-color:#4fc3f7">Message Delivery Flow</div>
    <div class="flow-container">
        <div class="flow-box flow-green">User A sends message</div>
        <div class="flow-arrow arrow-green"></div>
        <div class="flow-box flow-blue">WebSocket Server receives</div>
        <div class="flow-arrow arrow-blue"></div>
        <div class="flow-box flow-purple">MessageService saves to DB</div>
        <div class="flow-arrow arrow-purple"></div>
        <div class="flow-box flow-orange">Check: Is User B online?</div>
    </div>
    <div class="two-col">
        <div style="text-align:center">
            <div style="color:#25d366;font-weight:700;margin-bottom:10px">User B is ONLINE</div>
            <div class="flow-container" style="padding:10px">
                <div class="flow-box flow-green" style="font-size:.85em">Push via WebSocket instantly</div>
                <div class="flow-arrow arrow-green"></div>
                <div class="flow-box flow-green" style="font-size:.85em">Status &rarr; DELIVERED</div>
                <div class="flow-arrow arrow-green"></div>
                <div class="flow-box flow-green" style="font-size:.85em">Send delivery ACK to User A</div>
            </div>
        </div>
        <div style="text-align:center">
            <div style="color:#ff5252;font-weight:700;margin-bottom:10px">User B is OFFLINE</div>
            <div class="flow-container" style="padding:10px">
                <div class="flow-box flow-red" style="font-size:.85em">Queue in Kafka / Redis</div>
                <div class="flow-arrow" style="background:#ff5252"><div style="position:absolute;bottom:0;left:50%;transform:translateX(-50%);border-left:6px solid transparent;border-right:6px solid transparent;border-top:8px solid #ff5252"></div></div>
                <div class="flow-box flow-red" style="font-size:.85em">Send Push Notification (FCM)</div>
                <div class="flow-arrow" style="background:#ff5252"><div style="position:absolute;bottom:0;left:50%;transform:translateX(-50%);border-left:6px solid transparent;border-right:6px solid transparent;border-top:8px solid #ff5252"></div></div>
                <div class="flow-box flow-red" style="font-size:.85em">Deliver queued msgs on reconnect</div>
            </div>
        </div>
    </div>

    <div class="sub-heading" style="color:#4fc3f7;border-color:#4fc3f7">Typing Indicator <span class="new-badge">NEW</span></div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="cm">// WebSocket event types</span>
<span class="kw">enum</span> <span class="cn">WebSocketEventType</span> {
    MESSAGE, TYPING_START, TYPING_STOP, STATUS_UPDATE, READ_RECEIPT, CALL_SIGNAL
}

<span class="cm">// Client sends TYPING_START &rarr; Server forwards to receiver &rarr; UI shows "typing..."</span>
<span class="cm">// Auto-expires after 3 seconds if no new TYPING_START received</span>
    </pre></div>

    <div class="sub-heading" style="color:#4fc3f7;border-color:#4fc3f7">Heartbeat &amp; Reconnection</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:10px">
        <div style="background:rgba(79,195,247,.06);border:1px solid rgba(79,195,247,.15);border-radius:12px;padding:16px">
            <strong style="color:#4fc3f7">Heartbeat (Ping/Pong)</strong>
            <p style="color:#b0bec5;font-size:.85em;margin-top:6px">Client sends ping every 30s. If server gets no ping for 60s, mark user OFFLINE and update lastSeen.</p>
        </div>
        <div style="background:rgba(79,195,247,.06);border:1px solid rgba(79,195,247,.15);border-radius:12px;padding:16px">
            <strong style="color:#4fc3f7">Reconnection</strong>
            <p style="color:#b0bec5;font-size:.85em;margin-top:6px">Client uses exponential backoff (1s, 2s, 4s, 8s...). On reconnect, fetch all queued undelivered messages.</p>
        </div>
    </div>
</div>

<!-- ============ 8. MSG STATUS + READ RECEIPT ============ -->
<div id="msg-status" class="section theme-green">
    <div class="section-title"><span class="section-num">8</span>Message Status &amp; Read Receipt Flow</div>
    <div class="flow-container">
        <div class="flow-box flow-orange">Sender sends message</div>
        <div class="flow-arrow arrow-green"></div>
        <div class="flow-box" style="background:rgba(158,158,158,.15);border:1px solid #9e9e9e;color:#9e9e9e">SENT &#10003; &mdash; saved in DB</div>
        <div class="flow-arrow arrow-green"></div>
        <div class="flow-box" style="background:rgba(79,195,247,.15);border:1px solid #4fc3f7;color:#4fc3f7">DELIVERED &#10003;&#10003; &mdash; receiver's device got it</div>
        <div class="flow-arrow arrow-green"></div>
        <div class="flow-box" style="background:rgba(37,211,102,.15);border:1px solid #25d366;color:#25d366">SEEN &#10003;&#10003; &mdash; receiver opened the chat</div>
    </div>
    <div class="tick-grid">
        <div class="tick-card tick-sent"><div class="tick-icon">&#10003;</div><div class="tick-label">Single Tick</div><div class="tick-desc">SENT</div></div>
        <div class="tick-card tick-delivered"><div class="tick-icon">&#10003;&#10003;</div><div class="tick-label">Double Tick</div><div class="tick-desc">DELIVERED</div></div>
        <div class="tick-card tick-seen"><div class="tick-icon" style="color:#25d366">&#10003;&#10003;</div><div class="tick-label">Blue Tick</div><div class="tick-desc">SEEN</div></div>
    </div>

    <div class="sub-heading" style="color:#25d366;border-color:#25d366">Read Receipt Reverse Flow <span class="new-badge">NEW</span></div>
    <div class="flow-container">
        <div class="flow-box flow-teal">User B opens chat</div>
        <div class="flow-arrow arrow-green"></div>
        <div class="flow-box flow-blue">Client sends READ_RECEIPT via WebSocket</div>
        <div class="flow-arrow arrow-blue"></div>
        <div class="flow-box flow-purple">Server updates message status &rarr; SEEN</div>
        <div class="flow-arrow arrow-green"></div>
        <div class="flow-box flow-green">Server pushes SEEN ACK to User A via WebSocket</div>
        <div class="flow-arrow arrow-green"></div>
        <div class="flow-box flow-orange">User A's UI updates tick to blue</div>
    </div>
</div>

<!-- ============ 9. DESIGN PATTERNS ============ -->
<div id="patterns" class="section theme-cyan">
    <div class="section-title"><span class="section-num">9</span>Design Patterns (with Implementation)</div>
    <div class="pattern-grid">
        <div class="pattern-card"><div class="pattern-name">Factory Pattern</div><div class="pattern-use">Message Creation</div></div>
        <div class="pattern-card"><div class="pattern-name">Strategy Pattern</div><div class="pattern-use">Notification Types</div></div>
        <div class="pattern-card"><div class="pattern-name">Observer Pattern</div><div class="pattern-use">WebSocket Events</div></div>
        <div class="pattern-card"><div class="pattern-name">Singleton Pattern</div><div class="pattern-use">Config &amp; Session Manager</div></div>
    </div>

    <div class="sub-heading" style="color:#18ffff;border-color:#18ffff">Factory Pattern &mdash; MessageFactory</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">MessageFactory</span> {
    <span class="kw">public static</span> Message <span class="fn">createMessage</span>(Long sender, Long receiver, String content, MessageType type) {
        Message msg = <span class="kw">new</span> Message();
        msg.setMessageId(UUID.randomUUID().toString());
        msg.setSenderId(sender);
        msg.setReceiverId(receiver);
        msg.setContent(content);
        msg.setType(type);
        msg.setStatus(MessageStatus.SENT);
        msg.setCreatedAt(LocalDateTime.now());

        <span class="kw">if</span> (type == IMAGE || type == VIDEO || type == AUDIO) {
            <span class="cm">// Validate media URL is present</span>
            <span class="kw">if</span> (content == <span class="kw">null</span>) <span class="kw">throw new</span> IllegalArgumentException(<span class="st">"Media URL required"</span>);
        }
        <span class="kw">return</span> msg;
    }
}
    </pre></div>

    <div class="sub-heading" style="color:#18ffff;border-color:#18ffff">Strategy Pattern &mdash; Notification</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">NotificationService</span> <span class="kw">implements</span> <span class="iface">INotificationService</span> {
    <span class="tp">Map&lt;String, NotificationStrategy&gt;</span> strategies;

    <span class="kw">void</span> <span class="fn">sendNotification</span>(Long userId, String title, String body) {
        User user = userRepo.findById(userId);
        <span class="kw">if</span> (user.isOnline()) {
            strategies.get(<span class="st">"PUSH"</span>).send(userId, title, body);    <span class="cm">// FCM</span>
        } <span class="kw">else</span> {
            strategies.get(<span class="st">"SMS"</span>).send(userId, title, body);     <span class="cm">// Twilio fallback</span>
        }
    }
}
    </pre></div>

    <div class="sub-heading" style="color:#18ffff;border-color:#18ffff">Observer Pattern &mdash; WebSocket Events</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">interface</span> <span class="iface">WebSocketEventListener</span> {
    <span class="kw">void</span> <span class="fn">onEvent</span>(WebSocketEvent event);
}

<span class="kw">class</span> <span class="cn">MessageDeliveryListener</span> <span class="kw">implements</span> <span class="iface">WebSocketEventListener</span> {
    <span class="kw">void</span> <span class="fn">onEvent</span>(WebSocketEvent event) {
        <span class="kw">if</span> (event.getType() == MESSAGE) { <span class="cm">// deliver message to receiver</span> }
    }
}

<span class="kw">class</span> <span class="cn">PresenceUpdateListener</span> <span class="kw">implements</span> <span class="iface">WebSocketEventListener</span> {
    <span class="kw">void</span> <span class="fn">onEvent</span>(WebSocketEvent event) {
        <span class="kw">if</span> (event.getType() == STATUS_UPDATE) { <span class="cm">// broadcast online/offline</span> }
    }
}

<span class="kw">class</span> <span class="cn">TypingIndicatorListener</span> <span class="kw">implements</span> <span class="iface">WebSocketEventListener</span> {
    <span class="kw">void</span> <span class="fn">onEvent</span>(WebSocketEvent event) {
        <span class="kw">if</span> (event.getType() == TYPING_START) { <span class="cm">// forward to other user</span> }
    }
}

<span class="cm">// WebSocketServer registers all listeners and dispatches events</span>
    </pre></div>
</div>

<!-- ============ 10. SEQUENCE FLOW ============ -->
<div id="sequence" class="section theme-purple">
    <div class="section-title"><span class="section-num">10</span>LLD Sequence Flow</div>
    <div class="flow-container">
        <div class="flow-box flow-green">User A &rarr; MessageController.sendMessage()</div>
        <div class="flow-arrow arrow-green"></div>
        <div class="flow-box flow-blue">MessageService.sendMessage()</div>
        <div class="flow-arrow arrow-blue"></div>
        <div class="flow-box flow-orange">MessageFactory.createMessage()</div>
        <div class="flow-arrow arrow-orange"></div>
        <div class="flow-box flow-purple">MessageRepository.save(message)</div>
        <div class="flow-arrow arrow-purple"></div>
        <div class="flow-box flow-teal">WebSocketSessionManager.isConnected(receiverId)?</div>
        <div class="flow-arrow arrow-green"></div>
        <div class="flow-box flow-green">If YES: Push via WebSocket &rarr; User B</div>
        <div class="flow-arrow arrow-green"></div>
        <div class="flow-box flow-pink">If NO: Queue + Push Notification</div>
    </div>
</div>

<!-- ============ 11. CAPACITY ESTIMATION ============ -->
<div id="capacity" class="section theme-deepblue">
    <div class="section-title"><span class="section-num">11</span>Capacity Estimation <span class="new-badge">NEW</span></div>

    <div class="assumption-box">
        <h4>Assumptions (WhatsApp Scale)</h4>
        <div class="assumption-row"><span class="calc-label">Total Users</span><span class="calc-value">2 Billion</span></div>
        <div class="assumption-row"><span class="calc-label">Daily Active Users (DAU)</span><span class="calc-value">500 Million</span></div>
        <div class="assumption-row"><span class="calc-label">Avg messages sent/user/day</span><span class="calc-value">40 messages</span></div>
        <div class="assumption-row"><span class="calc-label">Avg message size (text)</span><span class="calc-value">100 bytes</span></div>
        <div class="assumption-row"><span class="calc-label">Avg media size (image/video)</span><span class="calc-value">300 KB (compressed)</span></div>
        <div class="assumption-row"><span class="calc-label">% messages with media</span><span class="calc-value">5%</span></div>
        <div class="assumption-row"><span class="calc-label">Avg connections per user</span><span class="calc-value">1 WebSocket</span></div>
    </div>

    <div class="cap-grid">
        <div class="cap-card">
            <h4>Messages Per Day</h4>
            <div class="calc-row"><span class="calc-label">DAU</span><span class="calc-value">500M</span></div>
            <div class="calc-row"><span class="calc-label">&times; 40 msgs/user/day</span><span class="calc-value"></span></div>
            <div class="calc-result"><span class="calc-label">Total Messages / Day</span><span class="calc-value">20 Billion</span></div>
            <div class="calc-result"><span class="calc-label">Messages / Second (QPS)</span><span class="calc-value">~230K QPS</span></div>
        </div>

        <div class="cap-card">
            <h4>Storage &mdash; Text Messages (per day)</h4>
            <div class="calc-row"><span class="calc-label">Messages/day</span><span class="calc-value">20B</span></div>
            <div class="calc-row"><span class="calc-label">&times; 100 bytes / msg</span><span class="calc-value"></span></div>
            <div class="calc-result"><span class="calc-label">Text Storage / Day</span><span class="calc-value">~2 TB / day</span></div>
            <div class="calc-result"><span class="calc-label">Text Storage / Year</span><span class="calc-value">~730 TB / year</span></div>
        </div>

        <div class="cap-card">
            <h4>Storage &mdash; Media (per day)</h4>
            <div class="calc-row"><span class="calc-label">Media messages/day</span><span class="calc-value">20B &times; 5% = 1B</span></div>
            <div class="calc-row"><span class="calc-label">&times; 300 KB / media</span><span class="calc-value"></span></div>
            <div class="calc-result"><span class="calc-label">Media Storage / Day</span><span class="calc-value">~300 TB / day</span></div>
            <div class="calc-result"><span class="calc-label">Media Storage / Year</span><span class="calc-value">~110 PB / year</span></div>
        </div>

        <div class="cap-card">
            <h4>Bandwidth Estimation</h4>
            <div class="calc-row"><span class="calc-label">Text bandwidth</span><span class="calc-value">2 TB / 86400s = ~23 MB/s</span></div>
            <div class="calc-row"><span class="calc-label">Media bandwidth</span><span class="calc-value">300 TB / 86400s = ~3.5 GB/s</span></div>
            <div class="calc-result"><span class="calc-label">Total Ingress</span><span class="calc-value">~3.5 GB/s</span></div>
            <div class="calc-row" style="margin-top:6px"><span class="calc-label">Egress (read heavy, 2x)</span><span class="calc-value"></span></div>
            <div class="calc-result"><span class="calc-label">Total Egress</span><span class="calc-value">~7 GB/s</span></div>
        </div>

        <div class="cap-card">
            <h4>WebSocket Connections</h4>
            <div class="calc-row"><span class="calc-label">Concurrent online users</span><span class="calc-value">~100M (20% DAU)</span></div>
            <div class="calc-row"><span class="calc-label">1 WebSocket / user</span><span class="calc-value"></span></div>
            <div class="calc-result"><span class="calc-label">Total Connections</span><span class="calc-value">100M concurrent</span></div>
            <div class="calc-row" style="margin-top:6px"><span class="calc-label">If 50K conn/server</span><span class="calc-value"></span></div>
            <div class="calc-result"><span class="calc-label">WebSocket Servers Needed</span><span class="calc-value">~2,000 servers</span></div>
        </div>

        <div class="cap-card">
            <h4>Cache (Redis) Estimation</h4>
            <div class="calc-row"><span class="calc-label">Cache recent 50 msgs &times; top 20% convos</span><span class="calc-value"></span></div>
            <div class="calc-row"><span class="calc-label">Active conversations</span><span class="calc-value">~500M</span></div>
            <div class="calc-row"><span class="calc-label">Top 20% = 100M convos</span><span class="calc-value"></span></div>
            <div class="calc-row"><span class="calc-label">&times; 50 msgs &times; 100 bytes</span><span class="calc-value"></span></div>
            <div class="calc-result"><span class="calc-label">Redis Cache Size</span><span class="calc-value">~500 GB</span></div>
        </div>

        <div class="cap-card">
            <h4>Database Sizing</h4>
            <div class="calc-row"><span class="calc-label">Message row size (with indexes)</span><span class="calc-value">~500 bytes</span></div>
            <div class="calc-row"><span class="calc-label">20B rows &times; 500 bytes / day</span><span class="calc-value"></span></div>
            <div class="calc-result"><span class="calc-label">DB Growth / Day</span><span class="calc-value">~10 TB / day</span></div>
            <div class="calc-row" style="margin-top:6px"><span class="calc-label">Sharding strategy</span><span class="calc-value">by conversationId</span></div>
            <div class="calc-row"><span class="calc-label">If 1 TB per shard</span><span class="calc-value"></span></div>
            <div class="calc-result"><span class="calc-label">Shards Needed (per day growth)</span><span class="calc-value">~10 new shards/day</span></div>
        </div>

        <div class="cap-card">
            <h4>API QPS Breakdown</h4>
            <div class="calc-row"><span class="calc-label">Send Message</span><span class="calc-value">~230K QPS</span></div>
            <div class="calc-row"><span class="calc-label">Read Messages (3x writes)</span><span class="calc-value">~700K QPS</span></div>
            <div class="calc-row"><span class="calc-label">Status Updates</span><span class="calc-value">~460K QPS</span></div>
            <div class="calc-row"><span class="calc-label">Presence / Typing</span><span class="calc-value">~100K QPS</span></div>
            <div class="calc-result"><span class="calc-label">Total API QPS</span><span class="calc-value">~1.5M QPS</span></div>
        </div>

        <div class="cap-card">
            <h4>CPU / Server Estimation</h4>
            <div class="calc-row"><span class="calc-label">Total API QPS</span><span class="calc-value">~1.5M QPS</span></div>
            <div class="calc-row"><span class="calc-label">Each server handles</span><span class="calc-value">~10K QPS</span></div>
            <div class="calc-result"><span class="calc-label">App Servers Needed</span><span class="calc-value">~150 servers</span></div>
            <div class="calc-row" style="margin-top:6px"><span class="calc-label">CPU cores per server (8 cores)</span><span class="calc-value"></span></div>
            <div class="calc-result"><span class="calc-label">Total CPU Cores</span><span class="calc-value">~1,200 cores</span></div>
            <div class="calc-row" style="margin-top:6px"><span class="calc-label">WebSocket Servers (50K conn/server)</span><span class="calc-value">~2,000 servers</span></div>
            <div class="calc-row"><span class="calc-label">Redis Cluster Nodes</span><span class="calc-value">10-20 nodes</span></div>
            <div class="calc-row"><span class="calc-label">DB Shards</span><span class="calc-value">100+ shards</span></div>
            <div class="calc-row"><span class="calc-label">Kafka Brokers</span><span class="calc-value">30-50 brokers</span></div>
        </div>
    </div>

    <div style="margin-top:20px;padding:16px;background:rgba(130,177,255,.08);border-radius:12px;border:1px solid rgba(130,177,255,.15)">
        <strong style="color:#82b1ff">Key Takeaway for Interview:</strong>
        <p style="color:#b0bec5;font-size:.88em;margin-top:8px;line-height:1.7">
            WhatsApp is a <strong style="color:#69f0ae">write-heavy + read-heavy</strong> system. The key challenges are:
            <strong style="color:#ffcc80">230K writes/sec</strong> (requires Kafka + DB sharding),
            <strong style="color:#ffcc80">100M concurrent WebSocket connections</strong> (requires horizontal scaling),
            <strong style="color:#ffcc80">300 TB/day media</strong> (requires S3/CDN, not stored in DB),
            and <strong style="color:#ffcc80">500 GB cache</strong> (Redis cluster for hot conversations).
        </p>
    </div>
</div>

<!-- ============ 12. BOTTLENECKS ============ -->
<div id="bottlenecks" class="section theme-red">
    <div class="section-title"><span class="section-num">12</span>Bottlenecks &amp; Solutions</div>
    <div class="bottleneck-grid">
        <div class="bottleneck-item"><span class="bottleneck-problem">Too many messages</span><span class="bottleneck-arrow">&#10132;</span><span class="bottleneck-solution">Kafka Queue (async processing)</span></div>
        <div class="bottleneck-item"><span class="bottleneck-problem">Database overload</span><span class="bottleneck-arrow">&#10132;</span><span class="bottleneck-solution">Sharding by conversationId</span></div>
        <div class="bottleneck-item"><span class="bottleneck-problem">Read traffic high</span><span class="bottleneck-arrow">&#10132;</span><span class="bottleneck-solution">Read Replicas</span></div>
        <div class="bottleneck-item"><span class="bottleneck-problem">Frequently opened chats</span><span class="bottleneck-arrow">&#10132;</span><span class="bottleneck-solution">Redis Cache (recent messages)</span></div>
        <div class="bottleneck-item"><span class="bottleneck-problem">Large media files</span><span class="bottleneck-arrow">&#10132;</span><span class="bottleneck-solution">S3 + CDN + Presigned URLs</span></div>
        <div class="bottleneck-item"><span class="bottleneck-problem">Concurrent message edits</span><span class="bottleneck-arrow">&#10132;</span><span class="bottleneck-solution">Optimistic Locking (@Version)</span></div>
        <div class="bottleneck-item"><span class="bottleneck-problem">WebSocket server crash</span><span class="bottleneck-arrow">&#10132;</span><span class="bottleneck-solution">Sticky Sessions + Redis Pub/Sub</span></div>
    </div>
</div>

<!-- ============ 13. EDGE CASES ============ -->
<div id="edge-cases" class="section theme-amber">
    <div class="section-title"><span class="section-num">13</span>Edge Cases &amp; Error Handling <span class="new-badge">NEW</span></div>
    <div class="edge-grid">
        <div class="edge-card">
            <h4>OTP Expired</h4>
            <p>OTP has 5-min TTL. If expired, return 401 with "OTP expired, request a new one". Max 3 attempts per OTP, then invalidate.</p>
        </div>
        <div class="edge-card">
            <h4>Edit After 15 Minutes</h4>
            <p>Message.isEditable() checks timestamp. If window passed, return 403: "Edit window expired". Matches WhatsApp's real behavior.</p>
        </div>
        <div class="edge-card">
            <h4>Delete For Everyone vs Delete For Me</h4>
            <p><strong>DELETE_FOR_ME:</strong> Soft delete only for requester (filter in query).<br><strong>DELETE_FOR_EVERYONE:</strong> Replace content with "This message was deleted" and notify receiver via WebSocket.</p>
        </div>
        <div class="edge-card">
            <h4>User Offline During Message Send</h4>
            <p>Message saved with SENT status. Queued in Kafka. On receiver reconnect, deliver all pending messages and update to DELIVERED.</p>
        </div>
        <div class="edge-card">
            <h4>Concurrent Message Edits</h4>
            <p>@Version field enables optimistic locking. If two edits conflict, second one gets OptimisticLockException &rarr; retry or fail gracefully.</p>
        </div>
        <div class="edge-card">
            <h4>WebSocket Disconnection</h4>
            <p>Heartbeat timeout (60s no ping) triggers markOffline(). Update lastSeen. Pending messages queued. Client reconnects with exponential backoff.</p>
        </div>
        <div class="edge-card">
            <h4>Duplicate Message Prevention</h4>
            <p>Client generates UUID before sending. Server checks messageId uniqueness. Idempotent &mdash; same messageId = same response, no duplicate.</p>
        </div>
        <div class="edge-card">
            <h4>Group Message Delivery</h4>
            <p>Fan-out: one message saved, then pushed to N members via their WebSocket sessions. Track deliveredTo and seenBy per member individually.</p>
        </div>
    </div>
</div>

<!-- ============ 14. SECURITY ============ -->
<div id="security" class="section theme-lime">
    <div class="section-title"><span class="section-num">14</span>Security (Enhanced)</div>
    <div class="security-grid">
        <div class="security-item">
            <span class="shield">&#9670;</span>
            <div>OTP Authentication<div class="security-detail">Hashed OTP stored in DB. Max 3 attempts. 5-min expiry. Rate limited to 1 OTP/min per phone.</div></div>
        </div>
        <div class="security-item">
            <span class="shield">&#9670;</span>
            <div>JWT Token<div class="security-detail">Short-lived access token (15 min) + long-lived refresh token. Stored in HttpOnly cookie.</div></div>
        </div>
        <div class="security-item">
            <span class="shield">&#9670;</span>
            <div>E2E Encryption <span class="new-badge">NEW</span><div class="security-detail">Each user has public/private key pair. Messages encrypted with receiver's public key. Server cannot read message content.</div></div>
        </div>
        <div class="security-item">
            <span class="shield">&#9670;</span>
            <div>HTTPS / WSS<div class="security-detail">All REST APIs over HTTPS. WebSocket upgraded to WSS (TLS encrypted).</div></div>
        </div>
        <div class="security-item">
            <span class="shield">&#9670;</span>
            <div>Rate Limiting<div class="security-detail">API Gateway rate limit: 100 req/min per user. OTP: 1/min. Message send: 60/min.</div></div>
        </div>
        <div class="security-item">
            <span class="shield">&#9670;</span>
            <div>Input Validation<div class="security-detail">Sanitize all inputs. Max message length: 4096 chars. File size limit: 16MB. Allowed media types only.</div></div>
        </div>
        <div class="security-item">
            <span class="shield">&#9670;</span>
            <div>Authorization Checks <span class="new-badge">NEW</span><div class="security-detail">Users can only edit/delete their own messages. Only group admins can add/remove members.</div></div>
        </div>
        <div class="security-item">
            <span class="shield">&#9670;</span>
            <div>Media Security <span class="new-badge">NEW</span><div class="security-detail">S3 presigned URLs with expiry. No direct public access to media files.</div></div>
        </div>
    </div>
</div>

<!-- ============ 15. SUMMARY ============ -->
<div id="summary" class="section theme-green">
    <div class="section-title"><span class="section-num">15</span>Interview Summary</div>
    <div class="summary-grid">
        <div class="summary-card sc-1"><h4>Controller &rarr; Service &rarr; Repository &rarr; DB</h4><p>Layered Architecture</p></div>
        <div class="summary-card sc-2"><h4>WebSocket + Session Map</h4><p>Real-Time Messaging</p></div>
        <div class="summary-card sc-3"><h4>Redis</h4><p>Caching &amp; Presence</p></div>
        <div class="summary-card sc-4"><h4>Kafka</h4><p>Async Processing &amp; Queuing</p></div>
        <div class="summary-card sc-1"><h4>S3 + CDN</h4><p>Media Storage</p></div>
        <div class="summary-card sc-2"><h4>SOLID + Design Patterns</h4><p>Clean Architecture</p></div>
        <div class="summary-card sc-3"><h4>E2E Encryption</h4><p>Security First</p></div>
        <div class="summary-card sc-4"><h4>Optimistic Locking</h4><p>Concurrency Control</p></div>
        <div class="summary-card sc-1"><h4>Capacity Estimation</h4><p>230K QPS, 300 TB/day media</p></div>
    </div>
    <p style="text-align:center;margin-top:24px;color:#78909c;font-size:1em">
        Complete WhatsApp LLD for <strong style="color:#25d366">Java Spring Boot</strong> interviews &mdash; covers SOLID, Design Patterns, Scalability, Security &amp; Edge Cases.
    </p>
</div>
`
}
