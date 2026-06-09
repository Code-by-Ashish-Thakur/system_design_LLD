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

<!-- ============ 2. CORE ENTITIES ============ -->
<div class="section theme-blue">
    <div class="section-title"><span class="section-num">2</span>Core Entities</div>
    <div class="entity-grid">
        <div class="entity-card">
            <h3>ChatRoom</h3>
            <div class="field"><span class="field-name">roomId</span><span class="field-type">String (UUID)</span></div>
            <div class="field"><span class="field-name">name</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">description</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">roomType</span><span class="field-type">RoomType</span></div>
            <div class="field"><span class="field-name">createdBy</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">maxParticipants</span><span class="field-type">int</span></div>
            <div class="field"><span class="field-name">lastMessageAt</span><span class="field-type">LocalDateTime</span></div>
            <div class="field"><span class="field-name">createdAt</span><span class="field-type">LocalDateTime</span></div>
            <div class="field"><span class="field-name">isArchived</span><span class="field-type">Boolean</span></div>
        </div>
        <div class="entity-card">
            <h3>Message</h3>
            <div class="field"><span class="field-name">messageId</span><span class="field-type">String (UUID)</span></div>
            <div class="field"><span class="field-name">roomId</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">senderId</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">content</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">messageType</span><span class="field-type">MessageType</span></div>
            <div class="field"><span class="field-name">parentMessageId</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">isPinned</span><span class="field-type">Boolean</span></div>
            <div class="field"><span class="field-name">isEdited</span><span class="field-type">Boolean</span></div>
            <div class="field"><span class="field-name">isDeleted</span><span class="field-type">Boolean</span></div>
            <div class="field"><span class="field-name">createdAt</span><span class="field-type">LocalDateTime</span></div>
            <div class="field"><span class="field-name">updatedAt</span><span class="field-type">LocalDateTime</span></div>
        </div>
        <div class="entity-card">
            <h3>User</h3>
            <div class="field"><span class="field-name">userId</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">username</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">email</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">displayName</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">avatarUrl</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">status</span><span class="field-type">UserStatus</span></div>
            <div class="field"><span class="field-name">lastSeenAt</span><span class="field-type">LocalDateTime</span></div>
            <div class="field"><span class="field-name">createdAt</span><span class="field-type">LocalDateTime</span></div>
        </div>
        <div class="entity-card">
            <h3>Attachment</h3>
            <div class="field"><span class="field-name">attachmentId</span><span class="field-type">String (UUID)</span></div>
            <div class="field"><span class="field-name">messageId</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">fileName</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">fileUrl</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">fileSize</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">mimeType</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">thumbnailUrl</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">uploadedAt</span><span class="field-type">LocalDateTime</span></div>
        </div>
        <div class="entity-card group-card">
            <h3>Participant</h3>
            <div class="field"><span class="field-name">participantId</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">roomId</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">userId</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">role</span><span class="field-type">ParticipantRole</span></div>
            <div class="field"><span class="field-name">joinedAt</span><span class="field-type">LocalDateTime</span></div>
            <div class="field"><span class="field-name">lastReadMessageId</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">isMuted</span><span class="field-type">Boolean</span></div>
        </div>
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

<!-- ============ 4. INTERFACES ============ -->
<div class="section theme-cyan">
    <div class="section-title"><span class="section-num">4</span>Interfaces &amp; SOLID Principles</div>

    <div class="sub-heading" style="color:#18ffff;border-color:#18ffff">Interface Segregation &mdash; Small, focused interfaces</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">IChatService.java</span></div><pre class="code-block">
<span class="kw">interface</span> <span class="iface">IChatService</span> {
    <span class="tp">void</span> <span class="fn">sendMessage</span>(String roomId, Long senderId, String content, MessageType type);
    <span class="tp">void</span> <span class="fn">broadcastToRoom</span>(String roomId, WebSocketEvent event);
    <span class="tp">void</span> <span class="fn">handleTypingIndicator</span>(String roomId, Long userId, <span class="tp">boolean</span> isTyping);
    <span class="tp">void</span> <span class="fn">updatePresence</span>(Long userId, UserStatus status);
}
    </pre></div>

    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">IRoomService.java</span></div><pre class="code-block">
<span class="kw">interface</span> <span class="iface">IRoomService</span> {
    ChatRoom <span class="fn">createRoom</span>(String name, RoomType type, Long createdBy);
    <span class="tp">void</span> <span class="fn">addParticipant</span>(String roomId, Long userId, ParticipantRole role);
    <span class="tp">void</span> <span class="fn">removeParticipant</span>(String roomId, Long userId);
    List&lt;ChatRoom&gt; <span class="fn">getUserRooms</span>(Long userId);
    <span class="tp">void</span> <span class="fn">archiveRoom</span>(String roomId, Long requesterId);
}
    </pre></div>

    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">IMessageService.java</span></div><pre class="code-block">
<span class="kw">interface</span> <span class="iface">IMessageService</span> {
    Message <span class="fn">sendMessage</span>(String roomId, Long senderId, String content, MessageType type);
    Page&lt;Message&gt; <span class="fn">getMessageHistory</span>(String roomId, <span class="tp">int</span> page, <span class="tp">int</span> size);
    <span class="tp">void</span> <span class="fn">editMessage</span>(String messageId, String newContent, Long userId);
    <span class="tp">void</span> <span class="fn">deleteMessage</span>(String messageId, Long userId);
    List&lt;Message&gt; <span class="fn">searchMessages</span>(String roomId, String keyword);
    <span class="tp">void</span> <span class="fn">pinMessage</span>(String messageId, Long userId);
}
    </pre></div>

    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">IFileService.java</span></div><pre class="code-block">
<span class="kw">interface</span> <span class="iface">IFileService</span> {
    Attachment <span class="fn">uploadFile</span>(MultipartFile file, String messageId, Long userId);
    <span class="tp">byte[]</span> <span class="fn">downloadFile</span>(String attachmentId);
    String <span class="fn">generatePresignedUrl</span>(String attachmentId, <span class="tp">int</span> expiryMinutes);
    <span class="tp">void</span> <span class="fn">deleteFile</span>(String attachmentId, Long userId);
    <span class="tp">boolean</span> <span class="fn">validateFileType</span>(String mimeType);
}
    </pre></div>
</div>

<!-- ============ 5. CLASS DESIGN ============ -->
<div class="section theme-orange">
    <div class="section-title"><span class="section-num">5</span>Class Design (with Methods)</div>

    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">ChatRoom.java</span></div><pre class="code-block">
<span class="ann">@Entity</span>
<span class="kw">class</span> <span class="cn">ChatRoom</span> {
    <span class="ann">@Id</span>
    <span class="tp">String</span> <span class="fn">roomId</span> = UUID.randomUUID().toString();
    <span class="tp">String</span> <span class="fn">name</span>;
    <span class="tp">String</span> <span class="fn">description</span>;
    <span class="ann">@Enumerated(EnumType.STRING)</span>
    <span class="tp">RoomType</span> <span class="fn">roomType</span>;
    <span class="tp">Long</span> <span class="fn">createdBy</span>;
    <span class="tp">int</span> <span class="fn">maxParticipants</span>;
    <span class="tp">LocalDateTime</span> <span class="fn">lastMessageAt</span>;
    <span class="tp">boolean</span> <span class="fn">isArchived</span>;

    <span class="ann">@OneToMany(mappedBy = "room", cascade = CascadeType.ALL)</span>
    <span class="tp">List&lt;Participant&gt;</span> <span class="fn">participants</span> = <span class="kw">new</span> ArrayList&lt;&gt;();

    <span class="kw">public boolean</span> <span class="fn">isFull</span>() {
        <span class="kw">return</span> participants.size() &gt;= maxParticipants;
    }
    <span class="kw">public boolean</span> <span class="fn">isPrivate</span>() {
        <span class="kw">return</span> roomType == RoomType.PRIVATE;
    }
    <span class="kw">public void</span> <span class="fn">updateLastMessage</span>() {
        <span class="kw">this</span>.lastMessageAt = LocalDateTime.now();
    }
    <span class="kw">public boolean</span> <span class="fn">hasParticipant</span>(Long userId) {
        <span class="kw">return</span> participants.stream().anyMatch(p -&gt; p.getUserId().equals(userId));
    }
}
    </pre></div>

    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Message.java</span></div><pre class="code-block">
<span class="ann">@Entity</span>
<span class="kw">class</span> <span class="cn">Message</span> {
    <span class="ann">@Id</span>
    <span class="tp">String</span> <span class="fn">messageId</span> = UUID.randomUUID().toString();
    <span class="tp">String</span> <span class="fn">roomId</span>;
    <span class="tp">Long</span> <span class="fn">senderId</span>;
    <span class="tp">String</span> <span class="fn">content</span>;
    <span class="ann">@Enumerated(EnumType.STRING)</span>
    <span class="tp">MessageType</span> <span class="fn">messageType</span>;
    <span class="tp">String</span> <span class="fn">parentMessageId</span>;  <span class="cm">// for thread replies</span>
    <span class="tp">boolean</span> <span class="fn">isPinned</span>;
    <span class="tp">boolean</span> <span class="fn">isEdited</span>;
    <span class="tp">boolean</span> <span class="fn">isDeleted</span>;
    <span class="tp">LocalDateTime</span> <span class="fn">createdAt</span>;
    <span class="tp">LocalDateTime</span> <span class="fn">updatedAt</span>;

    <span class="ann">@OneToMany(mappedBy = "message", cascade = CascadeType.ALL)</span>
    <span class="tp">List&lt;Attachment&gt;</span> <span class="fn">attachments</span> = <span class="kw">new</span> ArrayList&lt;&gt;();

    <span class="ann">@Version</span>  <span class="cm">// Optimistic locking</span>
    <span class="tp">Long</span> <span class="fn">version</span>;

    <span class="kw">public void</span> <span class="fn">edit</span>(String newContent) {
        <span class="kw">this</span>.content = newContent;
        <span class="kw">this</span>.isEdited = <span class="kw">true</span>;
        <span class="kw">this</span>.updatedAt = LocalDateTime.now();
    }
    <span class="kw">public void</span> <span class="fn">softDelete</span>() {
        <span class="kw">this</span>.isDeleted = <span class="kw">true</span>;
        <span class="kw">this</span>.content = <span class="st">"[This message was deleted]"</span>;
    }
    <span class="kw">public boolean</span> <span class="fn">isEditable</span>(Long userId) {
        <span class="kw">return</span> !isDeleted &amp;&amp; senderId.equals(userId)
            &amp;&amp; Duration.between(createdAt, LocalDateTime.now()).toMinutes() &lt; 30;
    }
}
    </pre></div>

    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Participant.java</span></div><pre class="code-block">
<span class="ann">@Entity</span>
<span class="kw">class</span> <span class="cn">Participant</span> {
    <span class="ann">@Id @GeneratedValue</span>
    <span class="tp">Long</span> <span class="fn">participantId</span>;
    <span class="tp">String</span> <span class="fn">roomId</span>;
    <span class="tp">Long</span> <span class="fn">userId</span>;
    <span class="ann">@Enumerated(EnumType.STRING)</span>
    <span class="tp">ParticipantRole</span> <span class="fn">role</span>;
    <span class="tp">LocalDateTime</span> <span class="fn">joinedAt</span>;
    <span class="tp">String</span> <span class="fn">lastReadMessageId</span>;
    <span class="tp">boolean</span> <span class="fn">isMuted</span>;

    <span class="kw">public boolean</span> <span class="fn">canModerate</span>() {
        <span class="kw">return</span> role == OWNER || role == ADMIN || role == MODERATOR;
    }
    <span class="kw">public void</span> <span class="fn">markRead</span>(String messageId) {
        <span class="kw">this</span>.lastReadMessageId = messageId;
    }
}
    </pre></div>

    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Attachment.java</span></div><pre class="code-block">
<span class="ann">@Entity</span>
<span class="kw">class</span> <span class="cn">Attachment</span> {
    <span class="ann">@Id</span>
    <span class="tp">String</span> <span class="fn">attachmentId</span> = UUID.randomUUID().toString();
    <span class="tp">String</span> <span class="fn">messageId</span>;
    <span class="tp">String</span> <span class="fn">fileName</span>;
    <span class="tp">String</span> <span class="fn">fileUrl</span>;
    <span class="tp">Long</span> <span class="fn">fileSize</span>;
    <span class="tp">String</span> <span class="fn">mimeType</span>;
    <span class="tp">String</span> <span class="fn">thumbnailUrl</span>;
    <span class="tp">LocalDateTime</span> <span class="fn">uploadedAt</span> = LocalDateTime.now();

    <span class="kw">public boolean</span> <span class="fn">isImage</span>() {
        <span class="kw">return</span> mimeType != <span class="kw">null</span> &amp;&amp; mimeType.startsWith(<span class="st">"image/"</span>);
    }
    <span class="kw">public String</span> <span class="fn">getHumanReadableSize</span>() {
        <span class="kw">if</span> (fileSize &lt; 1024) <span class="kw">return</span> fileSize + <span class="st">" B"</span>;
        <span class="kw">if</span> (fileSize &lt; 1024 * 1024) <span class="kw">return</span> (fileSize / 1024) + <span class="st">" KB"</span>;
        <span class="kw">return</span> (fileSize / (1024 * 1024)) + <span class="st">" MB"</span>;
    }
}
    </pre></div>
</div>

<!-- ============ 6. REPOSITORY LAYER ============ -->
<div class="section theme-indigo">
    <div class="section-title"><span class="section-num">6</span>Repository / DAO Layer</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Repositories.java</span></div><pre class="code-block">
<span class="kw">interface</span> <span class="iface">ChatRoomRepository</span> <span class="kw">extends</span> <span class="tp">JpaRepository</span>&lt;ChatRoom, String&gt; {
    List&lt;ChatRoom&gt; <span class="fn">findByParticipantsUserIdOrderByLastMessageAtDesc</span>(Long userId);
    Optional&lt;ChatRoom&gt; <span class="fn">findByRoomTypeAndParticipantsUserIdIn</span>(RoomType type, List&lt;Long&gt; userIds);
}

<span class="kw">interface</span> <span class="iface">MessageRepository</span> <span class="kw">extends</span> <span class="tp">JpaRepository</span>&lt;Message, String&gt; {
    <span class="cm">// Paginated history &mdash; most critical query</span>
    Page&lt;Message&gt; <span class="fn">findByRoomIdAndIsDeletedFalseOrderByCreatedAtDesc</span>(String roomId, Pageable pageable);

    <span class="ann">@Query</span>(<span class="st">"SELECT m FROM Message m WHERE m.roomId = :roomId AND m.content LIKE %:keyword%"</span>)
    List&lt;Message&gt; <span class="fn">searchMessages</span>(String roomId, String keyword);

    List&lt;Message&gt; <span class="fn">findByRoomIdAndIsPinnedTrue</span>(String roomId);

    <span class="cm">// Messages after a timestamp (for offline sync)</span>
    List&lt;Message&gt; <span class="fn">findByRoomIdAndCreatedAtAfterOrderByCreatedAtAsc</span>(String roomId, LocalDateTime since);
}

<span class="kw">interface</span> <span class="iface">ParticipantRepository</span> <span class="kw">extends</span> <span class="tp">JpaRepository</span>&lt;Participant, Long&gt; {
    List&lt;Participant&gt; <span class="fn">findByRoomId</span>(String roomId);
    Optional&lt;Participant&gt; <span class="fn">findByRoomIdAndUserId</span>(String roomId, Long userId);
    <span class="tp">int</span> <span class="fn">countByRoomId</span>(String roomId);
}

<span class="kw">interface</span> <span class="iface">AttachmentRepository</span> <span class="kw">extends</span> <span class="tp">JpaRepository</span>&lt;Attachment, String&gt; {
    List&lt;Attachment&gt; <span class="fn">findByMessageId</span>(String messageId);
}

<span class="kw">interface</span> <span class="iface">UserRepository</span> <span class="kw">extends</span> <span class="tp">JpaRepository</span>&lt;User, Long&gt; {
    Optional&lt;User&gt; <span class="fn">findByUsername</span>(String username);
    Optional&lt;User&gt; <span class="fn">findByEmail</span>(String email);
}
    </pre></div>
    <div class="repo-grid" style="margin-top:20px">
        <div class="repo-card">
            <h3>Architecture Flow</h3>
            <div class="flow-h">
                <div class="flow-box flow-green" style="min-width:120px">Controller</div>
                <span class="flow-h-arrow">&#10132;</span>
                <div class="flow-box flow-blue" style="min-width:120px">Service</div>
                <span class="flow-h-arrow">&#10132;</span>
                <div class="flow-box flow-purple" style="min-width:120px">Repository</div>
                <span class="flow-h-arrow">&#10132;</span>
                <div class="flow-box flow-pink" style="min-width:120px">Database</div>
            </div>
        </div>
        <div class="repo-card">
            <h3>Why Repository Layer?</h3>
            <div class="method-item"><span class="method-dot" style="background:#8c9eff"></span><span style="color:#c5cae9"> Decouples business logic from data access</span></div>
            <div class="method-item"><span class="method-dot" style="background:#8c9eff"></span><span style="color:#c5cae9"> Enables unit testing with mock repositories</span></div>
            <div class="method-item"><span class="method-dot" style="background:#8c9eff"></span><span style="color:#c5cae9"> Spring Data JPA auto-generates SQL queries</span></div>
            <div class="method-item"><span class="method-dot" style="background:#8c9eff"></span><span style="color:#c5cae9"> Custom @Query for complex search &amp; sync</span></div>
        </div>
    </div>
</div>

<!-- ============ 7. DATABASE SCHEMA ============ -->
<div class="section theme-pink">
    <div class="section-title"><span class="section-num">7</span>Database Schema (with FK &amp; Indexes)</div>
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

<!-- ============ 8. APIs ============ -->
<div class="section theme-teal">
    <div class="section-title"><span class="section-num">8</span>APIs (REST + WebSocket)</div>
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

<!-- ============ 9. SERVICE LAYER ============ -->
<div class="section theme-yellow">
    <div class="section-title"><span class="section-num">9</span>Service Layer</div>
    <div class="service-grid">
        <div class="service-card">
            <h3>ChatService</h3>
            <p class="svc-desc">Main service for sending messages, broadcasting to rooms, and showing typing status</p>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Send a message to a chat room</div><code>Message sendMessage(String roomId, Long senderId, String content)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Send an event to all users in a room</div><code>void broadcastToRoom(String roomId, ChatEvent event)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Show "typing..." to other users</div><code>void handleTypingIndicator(Long userId, String roomId)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Update if user is online or offline</div><code>void updatePresence(Long userId, UserStatus status)</code></div>
        </div>
        <div class="service-card">
            <h3>RoomService</h3>
            <p class="svc-desc">Manages chat rooms — creating, adding/removing members, listing rooms</p>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Create a new chat room</div><code>Room createRoom(String name, RoomType type, Long createdBy)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Add a user to a room</div><code>void addParticipant(String roomId, Long userId)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Remove a user from a room</div><code>void removeParticipant(String roomId, Long userId)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Get all rooms a user is part of</div><code>List&lt;Room&gt; getUserRooms(Long userId)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Archive a room (hide but keep data)</div><code>void archiveRoom(String roomId)</code></div>
        </div>
        <div class="service-card">
            <h3>MessageService</h3>
            <p class="svc-desc">Handles messages — send, get history, edit, delete, search, and pin</p>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Send a new message</div><code>Message sendMessage(String roomId, Long senderId, String content, MessageType type)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Get old messages in a room (with pages)</div><code>Page&lt;Message&gt; getMessageHistory(String roomId, int page)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Edit a message you sent</div><code>void editMessage(String messageId, String newContent)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Delete a message</div><code>void deleteMessage(String messageId)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Search for messages by keyword</div><code>List&lt;Message&gt; searchMessages(String roomId, String keyword)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Pin an important message in the room</div><code>void pinMessage(String messageId)</code></div>
        </div>
        <div class="service-card">
            <h3>FileService</h3>
            <p class="svc-desc">Handles file uploads, downloads, and file type checks in chat</p>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Upload a file attached to a message</div><code>Attachment uploadFile(MultipartFile file, String messageId)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Download a file by its ID</div><code>byte[] downloadFile(String attachmentId)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Get a temporary download link</div><code>String generatePresignedUrl(String attachmentId)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Check if the file type is allowed</div><code>boolean validateFileType(String mimeType)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Delete a file from storage</div><code>void deleteFile(String attachmentId)</code></div>
        </div>
        <div class="service-card">
            <h3>PresenceService</h3>
            <p class="svc-desc">Tracks who is online or offline and tells other users when status changes</p>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Mark user as online</div><code>void markOnline(Long userId)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Mark user as offline</div><code>void markOffline(Long userId)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Check if a user is online</div><code>UserStatus getUserStatus(Long userId)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Get all online users in a room</div><code>List&lt;Long&gt; getOnlineUsersInRoom(String roomId)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Tell everyone in the room about a status change</div><code>void broadcastPresenceChange(Long userId, UserStatus status)</code></div>
        </div>
        <div class="service-card">
            <h3>WebSocketSessionManager</h3>
            <p class="svc-desc">Manages live WebSocket connections for real-time chat</p>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Save a new connection when user opens chat</div><code>void addSession(Long userId, WebSocketSession session)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Remove connection when user closes chat</div><code>void removeSession(Long userId)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Get a user's active connection</div><code>WebSocketSession getSession(Long userId)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Check if a user is currently connected</div><code>boolean isConnected(Long userId)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Get all connections in a room</div><code>List&lt;WebSocketSession&gt; getSessionsByRoom(String roomId)</code></div>
        </div>
        <div class="service-card">
            <h3>NotificationService</h3>
            <p class="svc-desc">Sends push notifications for new messages and mentions</p>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Notify all members of a room about a new message</div><code>void notifyRoomParticipants(String roomId, Message message)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Notify a user when they are @mentioned</div><code>void sendMentionNotification(Long userId, String roomId, String mentionedBy)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Send a push notification to user's device</div><code>void sendPushNotification(Long userId, String title, String body)</code></div>
        </div>
    </div>
</div>

<!-- ============ 10. KEY ARCHITECTURE ============ -->
<div class="section theme-blue">
    <div class="section-title"><span class="section-num">10</span>Key Architecture &mdash; WebSocket + Room Broadcasting + Presence</div>

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

<!-- ============ 11. DESIGN PATTERNS ============ -->
<div class="section theme-cyan">
    <div class="section-title"><span class="section-num">11</span>Design Patterns (with Implementation)</div>
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

<!-- ============ 12. SEQUENCE FLOW ============ -->
<div class="section theme-purple">
    <div class="section-title"><span class="section-num">12</span>Sequence Flow &mdash; Send Message</div>
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

<!-- ============ 13. CAPACITY ESTIMATION ============ -->
<div class="section theme-deepblue">
    <div class="section-title"><span class="section-num">13</span>Capacity Estimation</div>

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

<!-- ============ 14. BOTTLENECKS ============ -->
<div class="section theme-red">
    <div class="section-title"><span class="section-num">14</span>Bottlenecks &amp; Solutions</div>
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

<!-- ============ 15. EDGE CASES ============ -->
<div class="section theme-amber">
    <div class="section-title"><span class="section-num">15</span>Edge Cases &amp; Error Handling</div>
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

<!-- ============ 16. SECURITY ============ -->
<div class="section theme-lime">
    <div class="section-title"><span class="section-num">16</span>Security</div>
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

<!-- ============ 17. SUMMARY ============ -->
<div class="section theme-green">
    <div class="section-title"><span class="section-num">17</span>Interview Summary</div>
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
