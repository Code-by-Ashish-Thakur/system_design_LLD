export default {
  title: "Video Conferencing &mdash; Low Level Design",
  subtitle: "Complete LLD for Zoom / Google Meet / Microsoft Teams &mdash; Java Spring Boot Interview",
  subtitleColor: "#bbdefb",
  headerGradient: "linear-gradient(135deg,#1565c0,#1976d2,#42a5f5)",
  footerText: "Video Conferencing (Zoom / Meet / Teams) &mdash; LLD",
  content: `
<!-- ============ 1. FUNCTIONAL REQUIREMENTS ============ -->
<div class="section theme-green">
    <div class="section-title"><span class="section-num">1</span>Functional Requirements</div>
    <div class="req-grid">
        <div class="req-pill"><span class="num">1</span><div class="fr-content"><div class="fr-en">User Registration &amp; Login (OAuth / Email)</div><div class="fr-hi">Ye requirement isliye hai taki user securely register aur login kar sake — Zoom me email/SSO, Meet me Google account, Teams me Microsoft account se login hota hai. Bina auth ke koi meeting host ya join nahi kar sakta</div></div></div>
        <div class="req-pill"><span class="num">2</span><div class="fr-content"><div class="fr-en">Create / Schedule Meeting</div><div class="fr-hi">Ye core feature hai — host ko meeting create karni hoti hai with unique meeting ID, optional password, scheduled time. Zoom me "New Meeting" ya "Schedule", Meet me calendar invite, Teams me channel meeting — sabme ek unique link generate hota hai</div></div></div>
        <div class="req-pill"><span class="num">3</span><div class="fr-content"><div class="fr-en">Join Meeting via Link / Code</div><div class="fr-hi">Ye requirement isliye hai taki koi bhi participant meeting link ya code se join kar sake — bina ye feature ke meeting ka koi matlab nahi. Guest join bhi support hona chahiye (bina login ke), jaise Zoom me "Join a Meeting"</div></div></div>
        <div class="req-pill"><span class="num">4</span><div class="fr-content"><div class="fr-en">Real-time Audio/Video Streaming</div><div class="fr-hi">Ye poore system ki backbone hai — WebRTC se peer-to-peer ya SFU (Selective Forwarding Unit) se audio/video real-time me stream hota hai. Bina iske video call possible hi nahi hai, latency &lt; 200ms hona chahiye</div></div></div>
        <div class="req-pill"><span class="num">5</span><div class="fr-content"><div class="fr-en">Screen Sharing</div><div class="fr-hi">Ye feature isliye zaroori hai taki presenter apni screen share kar sake — office meetings, presentations, code reviews me screen sharing must-have hai. WebRTC ka getDisplayMedia API use hota hai</div></div></div>
        <div class="req-pill"><span class="num">6</span><div class="fr-content"><div class="fr-en">In-Meeting Chat</div><div class="fr-hi">Ye feature isliye hai taki participants bina unmute kiye text messages bhej sake — links share karna, side conversation, Q&amp;A ke liye chat zaroori hai. WebSocket se real-time deliver hota hai</div></div></div>
        <div class="req-pill"><span class="num">7</span><div class="fr-content"><div class="fr-en">Mute / Unmute Audio &amp; Video</div><div class="fr-hi">Ye basic control hai — user apna mic/camera on/off kar sake. Host ko bhi participants ko mute karne ka option milna chahiye (host controls). Background noise avoid karne ke liye large meetings me default mute hota hai</div></div></div>
        <div class="req-pill"><span class="num">8</span><div class="fr-content"><div class="fr-en">Waiting Room / Lobby</div><div class="fr-hi">Ye security feature hai — uninvited log directly meeting me na ghus sake. Host ko approve/deny karne ka option milta hai. Zoom me "Waiting Room", Teams me "Lobby" — sensitive meetings ke liye zaroori hai</div></div></div>
        <div class="req-pill"><span class="num">9</span><div class="fr-content"><div class="fr-en">Meeting Recording (Cloud &amp; Local)</div><div class="fr-hi">Ye feature isliye hai taki meeting ka recording save ho sake — training sessions, interviews, important decisions ko record karke baad me dekh sakte hai. Cloud recording server-side hota hai, local recording client-side</div></div></div>
        <div class="req-pill"><span class="num">10</span><div class="fr-content"><div class="fr-en">Raise Hand &amp; Reactions</div><div class="fr-hi">Ye feature isliye hai taki large meetings me participants bina interrupt kiye apni baat rakh sake — hand raise se speaker ko pata chalta hai ki koi bolna chahta hai. Reactions (thumbs up, clap) se engagement badhta hai</div></div></div>
        <div class="req-pill"><span class="num">11</span><div class="fr-content"><div class="fr-en">Breakout Rooms</div><div class="fr-hi">Ye feature isliye hai taki ek badi meeting ko chhoti groups me todh sake — workshops, team discussions ke liye. Host breakout rooms create karta hai, participants ko assign karta hai, timer set karta hai, phir wapas main room me laata hai</div></div></div>
        <div class="req-pill"><span class="num">12</span><div class="fr-content"><div class="fr-en">Virtual Background &amp; Noise Cancellation</div><div class="fr-hi">Ye feature isliye hai taki user ghar se bhi professional dikhe — background blur/replace se messy room nahi dikhta, noise cancellation se barking dog ya traffic ka awaaz filter ho jaata hai. ML models client-side run hote hai</div></div></div>
        <div class="req-pill"><span class="num">13</span><div class="fr-content"><div class="fr-en">End / Leave Meeting</div><div class="fr-hi">Ye requirement isliye hai taki participant leave ya host meeting end kar sake — host "End Meeting for All" kare to sabka connection close ho, resources release ho, aur recording save ho jaaye</div></div></div>
        <div class="req-pill"><span class="num">14</span><div class="fr-content"><div class="fr-en">Participant Management (Kick, Mute All)</div><div class="fr-hi">Ye host controls hai — disruptive participant ko remove karna, sab ko mute karna, co-host assign karna. Large meetings me bina host controls ke meeting manage karna impossible hai</div></div></div>
    </div>
</div>

<!-- ============ 2. NON-FUNCTIONAL REQUIREMENTS ============ -->
<div class="section theme-pink">
    <div class="section-title"><span class="section-num">2</span>Non-Functional Requirements</div>
    <div class="req-grid">
        <div class="req-pill"><span class="num">1</span><div class="nfr-content"><div class="nfr-en">Ultra-Low Latency &mdash; Audio/video delivery under 200ms for real-time conversation</div><div class="nfr-hi">Audio/video &lt; 200ms me deliver hona chahiye &mdash; isse zyada lag hua to conversation natural nahi lagega, users frustrate ho jayenge</div></div></div>
        <div class="req-pill"><span class="num">2</span><div class="nfr-content"><div class="nfr-en">High Availability &mdash; 99.99% uptime, meetings must never drop</div><div class="nfr-hi">99.99% uptime hona chahiye &mdash; meeting beech me drop ho gayi to client lose ho sakte hai, critical business calls ke liye reliability zaroori hai</div></div></div>
        <div class="req-pill"><span class="num">3</span><div class="nfr-content"><div class="nfr-en">Scalability &mdash; Support 1000+ participants in a single meeting</div><div class="nfr-hi">Ek meeting me 1000+ participants support karne padenge &mdash; webinars, all-hands, conferences ke liye horizontal scaling zaroori hai</div></div></div>
        <div class="req-pill"><span class="num">4</span><div class="nfr-content"><div class="nfr-en">E2E Encryption &mdash; Media streams must be end-to-end encrypted</div><div class="nfr-hi">Audio/video streams E2E encrypted hone chahiye &mdash; server bhi media content decode na kar sake, privacy aur compliance ke liye mandatory hai</div></div></div>
        <div class="req-pill"><span class="num">5</span><div class="nfr-content"><div class="nfr-en">Adaptive Quality &mdash; Auto-adjust resolution based on bandwidth</div><div class="nfr-hi">Bandwidth ke hisaab se video quality auto-adjust honi chahiye &mdash; slow network pe 360p dikhe, fast pe 1080p. Simulcast se sender multiple qualities bhejta hai</div></div></div>
        <div class="req-pill"><span class="num">6</span><div class="nfr-content"><div class="nfr-en">Fault Tolerance &mdash; Auto-reconnect on network drop without losing meeting</div><div class="nfr-hi">Network drop hone pe auto-reconnect ho &mdash; user ko meeting dobara join nahi karni chahiye, ICE restart se seamless recovery honi chahiye</div></div></div>
    </div>
</div>

<!-- ============ 3. ENUMS ============ -->
<div class="section theme-purple">
    <div class="section-title"><span class="section-num">3</span>Enums</div>
    <div class="enum-grid">
        <div class="enum-card"><h3>MeetingStatus</h3><div class="enum-val">SCHEDULED</div><div class="enum-val">WAITING</div><div class="enum-val">IN_PROGRESS</div><div class="enum-val">ENDED</div><div class="enum-val">CANCELLED</div></div>
        <div class="enum-card"><h3>ParticipantRole</h3><div class="enum-val">HOST</div><div class="enum-val">CO_HOST</div><div class="enum-val">PARTICIPANT</div><div class="enum-val">GUEST</div></div>
        <div class="enum-card"><h3>MediaType</h3><div class="enum-val">AUDIO</div><div class="enum-val">VIDEO</div><div class="enum-val">SCREEN_SHARE</div></div>
        <div class="enum-card"><h3>ParticipantStatus</h3><div class="enum-val">IN_LOBBY</div><div class="enum-val">JOINED</div><div class="enum-val">LEFT</div><div class="enum-val">KICKED</div></div>
        <div class="enum-card"><h3>RecordingStatus</h3><div class="enum-val">NOT_STARTED</div><div class="enum-val">RECORDING</div><div class="enum-val">PAUSED</div><div class="enum-val">STOPPED</div><div class="enum-val">PROCESSING</div><div class="enum-val">READY</div></div>
        <div class="enum-card"><h3>Reaction</h3><div class="enum-val">THUMBS_UP</div><div class="enum-val">CLAP</div><div class="enum-val">HEART</div><div class="enum-val">LAUGH</div><div class="enum-val">RAISED_HAND</div></div>
        <div class="enum-card"><h3>MeetingType</h3><div class="enum-val">INSTANT</div><div class="enum-val">SCHEDULED</div><div class="enum-val">RECURRING</div><div class="enum-val">WEBINAR</div></div>
        <div class="enum-card"><h3>ChatMessageType</h3><div class="enum-val">TEXT</div><div class="enum-val">FILE</div><div class="enum-val">LINK</div></div>
    </div>
</div>

<!-- ============ 4. SERVICE LLD ============ -->
<div class="section theme-yellow">
    <div class="section-title"><span class="section-num">4</span>Service LLD</div>
    <div class="service-grid">
        <div class="service-card">
            <h3>AuthService</h3>
            <p class="svc-desc">User ka registration, login aur OAuth handle karta hai &mdash; JWT token issue karta hai session ke liye</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">AuthService</span> {

    <span class="cm">// email + password se register karta hai</span>
    <span class="tp">User</span> <span class="fn">register</span>(<span class="tp">String</span> email, <span class="tp">String</span> password, <span class="tp">String</span> name)

    <span class="cm">// login karke JWT token return karta hai</span>
    <span class="tp">AuthToken</span> <span class="fn">login</span>(<span class="tp">String</span> email, <span class="tp">String</span> password)

    <span class="cm">// Google/Microsoft OAuth se login karta hai</span>
    <span class="tp">AuthToken</span> <span class="fn">oauthLogin</span>(<span class="tp">String</span> provider, <span class="tp">String</span> authCode)

    <span class="cm">// JWT token refresh karta hai expiry se pehle</span>
    <span class="tp">AuthToken</span> <span class="fn">refreshToken</span>(<span class="tp">String</span> refreshToken)

    <span class="cm">// user ko logout karta hai aur token invalidate</span>
    <span class="kw">void</span> <span class="fn">logout</span>(<span class="tp">Long</span> userId)
}
</pre></div>
        </div>
        <div class="service-card">
            <h3>MeetingService</h3>
            <p class="svc-desc">Meeting create, schedule, update aur end karne ka poora kaam &mdash; unique meeting code generate karta hai</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">MeetingService</span> {

    <span class="cm">// nayi meeting create karta hai with unique code</span>
    <span class="tp">Meeting</span> <span class="fn">createMeeting</span>(<span class="tp">Long</span> hostId, <span class="tp">String</span> title,
        <span class="tp">MeetingType</span> type, <span class="tp">MeetingSettings</span> settings)

    <span class="cm">// future ke liye meeting schedule karta hai</span>
    <span class="tp">Meeting</span> <span class="fn">scheduleMeeting</span>(<span class="tp">Long</span> hostId, <span class="tp">String</span> title,
        <span class="tp">LocalDateTime</span> startTime, <span class="tp">int</span> durationMinutes,
        <span class="tp">List&lt;String&gt;</span> inviteeEmails, <span class="tp">MeetingSettings</span> settings)

    <span class="cm">// meeting code se meeting details fetch karta hai</span>
    <span class="tp">Meeting</span> <span class="fn">getMeetingByCode</span>(<span class="tp">String</span> meetingCode)

    <span class="cm">// meeting settings update karta hai (password, lobby, etc)</span>
    <span class="kw">void</span> <span class="fn">updateSettings</span>(<span class="tp">String</span> meetingId,
        <span class="tp">MeetingSettings</span> settings, <span class="tp">Long</span> hostId)

    <span class="cm">// meeting end karta hai sab participants ke liye</span>
    <span class="kw">void</span> <span class="fn">endMeeting</span>(<span class="tp">String</span> meetingId, <span class="tp">Long</span> hostId)
}
</pre></div>
        </div>
        <div class="service-card">
            <h3>ParticipantService</h3>
            <p class="svc-desc">Participant ka join, leave, lobby approval, kick aur role management handle karta hai</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">ParticipantService</span> {

    <span class="cm">// participant ko meeting me join karata hai (lobby check)</span>
    <span class="tp">Participant</span> <span class="fn">joinMeeting</span>(<span class="tp">String</span> meetingCode,
        <span class="tp">Long</span> userId, <span class="tp">String</span> displayName,
        <span class="tp">String</span> password)

    <span class="cm">// lobby me waiting participant ko approve karta hai</span>
    <span class="kw">void</span> <span class="fn">admitFromLobby</span>(<span class="tp">String</span> meetingId,
        <span class="tp">Long</span> participantId, <span class="tp">Long</span> hostId)

    <span class="cm">// participant ko meeting se remove karta hai</span>
    <span class="kw">void</span> <span class="fn">kickParticipant</span>(<span class="tp">String</span> meetingId,
        <span class="tp">Long</span> participantId, <span class="tp">Long</span> hostId)

    <span class="cm">// participant ka role change karta hai (co-host banana)</span>
    <span class="kw">void</span> <span class="fn">changeRole</span>(<span class="tp">String</span> meetingId,
        <span class="tp">Long</span> participantId, <span class="tp">ParticipantRole</span> newRole,
        <span class="tp">Long</span> hostId)

    <span class="cm">// meeting ke saare participants ki list deta hai</span>
    <span class="tp">List&lt;Participant&gt;</span> <span class="fn">getParticipants</span>(<span class="tp">String</span> meetingId)

    <span class="cm">// participant meeting se leave karta hai</span>
    <span class="kw">void</span> <span class="fn">leaveMeeting</span>(<span class="tp">String</span> meetingId, <span class="tp">Long</span> userId)
}
</pre></div>
        </div>
        <div class="service-card">
            <h3>MediaService</h3>
            <p class="svc-desc">WebRTC signaling, SFU media routing, mute/unmute aur adaptive quality handle karta hai &mdash; ye poore system ka real-time core hai</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">MediaService</span> {

    <span class="cm">// WebRTC SDP offer/answer exchange karta hai</span>
    <span class="tp">SessionDescription</span> <span class="fn">negotiateSession</span>(
        <span class="tp">String</span> meetingId, <span class="tp">Long</span> userId,
        <span class="tp">SessionDescription</span> offer)

    <span class="cm">// ICE candidate exchange karta hai NAT traversal ke liye</span>
    <span class="kw">void</span> <span class="fn">addIceCandidate</span>(<span class="tp">String</span> meetingId,
        <span class="tp">Long</span> userId, <span class="tp">IceCandidate</span> candidate)

    <span class="cm">// audio ya video mute/unmute toggle karta hai</span>
    <span class="kw">void</span> <span class="fn">toggleMedia</span>(<span class="tp">String</span> meetingId,
        <span class="tp">Long</span> userId, <span class="tp">MediaType</span> mediaType,
        <span class="tp">boolean</span> enabled)

    <span class="cm">// host sab participants ko mute karta hai</span>
    <span class="kw">void</span> <span class="fn">muteAll</span>(<span class="tp">String</span> meetingId, <span class="tp">Long</span> hostId)

    <span class="cm">// bandwidth ke hisaab se video quality adjust karta hai</span>
    <span class="kw">void</span> <span class="fn">adjustQuality</span>(<span class="tp">String</span> meetingId,
        <span class="tp">Long</span> userId, <span class="tp">int</span> bandwidthKbps)
}
</pre></div>
        </div>
        <div class="service-card">
            <h3>ScreenShareService</h3>
            <p class="svc-desc">Screen sharing start/stop aur viewer management handle karta hai &mdash; ek time pe ek hi presenter allowed hai by default</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">ScreenShareService</span> {

    <span class="cm">// screen sharing start karta hai meeting me</span>
    <span class="kw">void</span> <span class="fn">startScreenShare</span>(<span class="tp">String</span> meetingId,
        <span class="tp">Long</span> userId, <span class="tp">ScreenShareConfig</span> config)

    <span class="cm">// screen sharing band karta hai</span>
    <span class="kw">void</span> <span class="fn">stopScreenShare</span>(<span class="tp">String</span> meetingId,
        <span class="tp">Long</span> userId)

    <span class="cm">// check karta hai kaun screen share kar raha hai</span>
    <span class="tp">ScreenShareInfo</span> <span class="fn">getActiveShare</span>(<span class="tp">String</span> meetingId)
}
</pre></div>
        </div>
        <div class="service-card">
            <h3>ChatService</h3>
            <p class="svc-desc">In-meeting chat handle karta hai &mdash; public messages, private DMs, file sharing aur chat history</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">ChatService</span> {

    <span class="cm">// meeting me public message bhejta hai sabko</span>
    <span class="tp">ChatMessage</span> <span class="fn">sendMessage</span>(<span class="tp">String</span> meetingId,
        <span class="tp">Long</span> senderId, <span class="tp">String</span> content,
        <span class="tp">ChatMessageType</span> type)

    <span class="cm">// ek specific participant ko private message bhejta hai</span>
    <span class="tp">ChatMessage</span> <span class="fn">sendPrivateMessage</span>(<span class="tp">String</span> meetingId,
        <span class="tp">Long</span> senderId, <span class="tp">Long</span> receiverId,
        <span class="tp">String</span> content)

    <span class="cm">// meeting ki poori chat history return karta hai</span>
    <span class="tp">List&lt;ChatMessage&gt;</span> <span class="fn">getChatHistory</span>(
        <span class="tp">String</span> meetingId, <span class="tp">int</span> page, <span class="tp">int</span> size)

    <span class="cm">// chat me file share karta hai (PDF, image, etc)</span>
    <span class="tp">ChatMessage</span> <span class="fn">shareFile</span>(<span class="tp">String</span> meetingId,
        <span class="tp">Long</span> senderId, <span class="tp">MultipartFile</span> file)
}
</pre></div>
        </div>
        <div class="service-card">
            <h3>RecordingService</h3>
            <p class="svc-desc">Meeting recording start/stop, cloud pe save aur download link generate karta hai</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">RecordingService</span> {

    <span class="cm">// cloud recording start karta hai</span>
    <span class="tp">Recording</span> <span class="fn">startRecording</span>(<span class="tp">String</span> meetingId,
        <span class="tp">Long</span> hostId)

    <span class="cm">// recording pause karta hai temporarily</span>
    <span class="kw">void</span> <span class="fn">pauseRecording</span>(<span class="tp">String</span> meetingId,
        <span class="tp">Long</span> hostId)

    <span class="cm">// recording stop karta hai aur processing start hoti hai</span>
    <span class="tp">Recording</span> <span class="fn">stopRecording</span>(<span class="tp">String</span> meetingId,
        <span class="tp">Long</span> hostId)

    <span class="cm">// processed recording ka download link deta hai</span>
    <span class="tp">String</span> <span class="fn">getDownloadUrl</span>(<span class="tp">String</span> recordingId,
        <span class="tp">Long</span> userId, <span class="tp">int</span> expiryMinutes)

    <span class="cm">// user ke saare recordings list karta hai</span>
    <span class="tp">List&lt;Recording&gt;</span> <span class="fn">getRecordings</span>(<span class="tp">Long</span> userId,
        <span class="tp">int</span> page, <span class="tp">int</span> size)
}
</pre></div>
        </div>
        <div class="service-card">
            <h3>BreakoutRoomService</h3>
            <p class="svc-desc">Breakout rooms create, assign participants, timer set aur merge back karne ka kaam karta hai</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">BreakoutRoomService</span> {

    <span class="cm">// multiple breakout rooms create karta hai</span>
    <span class="tp">List&lt;BreakoutRoom&gt;</span> <span class="fn">createRooms</span>(
        <span class="tp">String</span> meetingId, <span class="tp">int</span> roomCount,
        <span class="tp">Long</span> hostId)

    <span class="cm">// participants ko rooms me assign karta hai</span>
    <span class="kw">void</span> <span class="fn">assignParticipants</span>(<span class="tp">String</span> meetingId,
        <span class="tp">Map&lt;String, List&lt;Long&gt;&gt;</span> roomAssignments,
        <span class="tp">Long</span> hostId)

    <span class="cm">// sab breakout rooms band karke main room me laata hai</span>
    <span class="kw">void</span> <span class="fn">closeAllRooms</span>(<span class="tp">String</span> meetingId,
        <span class="tp">Long</span> hostId)

    <span class="cm">// host sabko broadcast message bhejta hai</span>
    <span class="kw">void</span> <span class="fn">broadcastToAll</span>(<span class="tp">String</span> meetingId,
        <span class="tp">String</span> message, <span class="tp">Long</span> hostId)
}
</pre></div>
        </div>
        <div class="service-card">
            <h3>ReactionService</h3>
            <p class="svc-desc">Hand raise, emoji reactions broadcast karta hai &mdash; real-time WebSocket se sabko dikhai deta hai</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">ReactionService</span> {

    <span class="cm">// hand raise toggle karta hai</span>
    <span class="kw">void</span> <span class="fn">toggleHandRaise</span>(<span class="tp">String</span> meetingId,
        <span class="tp">Long</span> userId, <span class="tp">boolean</span> raised)

    <span class="cm">// emoji reaction bhejta hai (thumbs up, clap, etc)</span>
    <span class="kw">void</span> <span class="fn">sendReaction</span>(<span class="tp">String</span> meetingId,
        <span class="tp">Long</span> userId, <span class="tp">Reaction</span> reaction)

    <span class="cm">// raised hands ki list return karta hai</span>
    <span class="tp">List&lt;Long&gt;</span> <span class="fn">getRaisedHands</span>(<span class="tp">String</span> meetingId)

    <span class="cm">// host sab ke hands lower karta hai</span>
    <span class="kw">void</span> <span class="fn">lowerAllHands</span>(<span class="tp">String</span> meetingId,
        <span class="tp">Long</span> hostId)
}
</pre></div>
        </div>
        <div class="service-card">
            <h3>NotificationService</h3>
            <p class="svc-desc">Meeting invites, reminders, recording ready notifications bhejta hai &mdash; email + push notification</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">NotificationService</span> {

    <span class="cm">// meeting invite email bhejta hai invitees ko</span>
    <span class="kw">void</span> <span class="fn">sendMeetingInvite</span>(<span class="tp">String</span> meetingId,
        <span class="tp">List&lt;String&gt;</span> emails)

    <span class="cm">// meeting start hone se 5 min pehle reminder bhejta hai</span>
    <span class="kw">void</span> <span class="fn">sendReminder</span>(<span class="tp">String</span> meetingId,
        <span class="tp">int</span> minutesBefore)

    <span class="cm">// recording ready hone pe notification bhejta hai</span>
    <span class="kw">void</span> <span class="fn">notifyRecordingReady</span>(<span class="tp">String</span> recordingId,
        <span class="tp">Long</span> userId)

    <span class="cm">// lobby me koi aaya to host ko notify karta hai</span>
    <span class="kw">void</span> <span class="fn">notifyLobbyEntry</span>(<span class="tp">String</span> meetingId,
        <span class="tp">String</span> participantName)
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
            <div class="api-header"><span class="api-method method-post">POST</span><span class="api-path">/api/v1/meetings</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Request</div>{
  "title": "Sprint Planning",
  "type": "SCHEDULED",
  "startTime": "2025-06-15T10:00:00Z",
  "durationMinutes": 60,
  "invitees": ["a@gmail.com", "b@gmail.com"],
  "settings": {
    "lobbyEnabled": true,
    "password": "abc123",
    "muteOnEntry": true,
    "allowScreenShare": true,
    "maxParticipants": 100
  }
}</div>
                <div class="api-json"><div class="label">Response 201</div>{
  "meetingId": "m-abc123xyz",
  "meetingCode": "123-456-789",
  "joinUrl": "https://meet.app/j/123-456-789",
  "hostId": 1001,
  "title": "Sprint Planning",
  "status": "SCHEDULED",
  "startTime": "2025-06-15T10:00:00Z",
  "createdAt": "2025-06-14T18:30:00Z"
}</div>
            </div>
            <div class="api-note">Host meeting create karta hai &mdash; unique meeting code aur join URL generate hota hai. Settings me lobby, password, mute-on-entry configure hota hai</div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-post">POST</span><span class="api-path">/api/v1/meetings/{meetingCode}/join</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Request</div>{
  "displayName": "Rahul Sharma",
  "password": "abc123",
  "audioEnabled": true,
  "videoEnabled": true
}</div>
                <div class="api-json"><div class="label">Response 200</div>{
  "participantId": "p-xyz789",
  "status": "IN_LOBBY",
  "meetingId": "m-abc123xyz",
  "signalingUrl": "wss://media.app/signal",
  "iceServers": [
    { "urls": "turn:turn.app:3478",
      "username": "user", "credential": "pass" }
  ],
  "token": "eyJhbGciOi..."
}</div>
            </div>
            <div class="api-note">Participant meeting join karta hai &mdash; lobby enabled hai to IN_LOBBY status milta hai, warna direct JOINED. Response me WebRTC signaling URL aur TURN server credentials milte hai</div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-post">POST</span><span class="api-path">/api/v1/meetings/{meetingId}/admit</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Request</div>{
  "participantIds": ["p-xyz789", "p-abc456"],
  "admitAll": false
}</div>
                <div class="api-json"><div class="label">Response 200</div>{
  "admitted": ["p-xyz789", "p-abc456"],
  "remainingInLobby": 3
}</div>
            </div>
            <div class="api-note">Host lobby me waiting participants ko admit karta hai &mdash; admitAll=true se saare lobby participants ek saath admit ho jaate hai</div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-post">POST</span><span class="api-path">/api/v1/meetings/{meetingId}/media/toggle</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Request</div>{
  "mediaType": "AUDIO",
  "enabled": false
}</div>
                <div class="api-json"><div class="label">Response 200</div>{
  "participantId": "p-xyz789",
  "audioEnabled": false,
  "videoEnabled": true,
  "screenShareActive": false
}</div>
            </div>
            <div class="api-note">Participant apna audio/video mute/unmute karta hai &mdash; server sabko WebSocket se media state change broadcast karta hai</div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-post">POST</span><span class="api-path">/api/v1/meetings/{meetingId}/screen-share/start</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Request</div>{
  "shareType": "FULL_SCREEN",
  "withAudio": true
}</div>
                <div class="api-json"><div class="label">Response 200</div>{
  "shareId": "ss-001",
  "participantId": "p-xyz789",
  "status": "ACTIVE",
  "startedAt": "2025-06-15T10:05:30Z"
}</div>
            </div>
            <div class="api-note">Screen sharing start karta hai &mdash; ek time pe sirf ek participant share kar sakta hai (unless host allows multiple). Client getDisplayMedia() API use karta hai</div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-post">POST</span><span class="api-path">/api/v1/meetings/{meetingId}/chat</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Request</div>{
  "content": "Can everyone see my screen?",
  "type": "TEXT",
  "recipientId": null
}</div>
                <div class="api-json"><div class="label">Response 201</div>{
  "messageId": "msg-101",
  "senderId": "p-xyz789",
  "senderName": "Rahul Sharma",
  "content": "Can everyone see my screen?",
  "timestamp": "2025-06-15T10:06:00Z",
  "isPrivate": false
}</div>
            </div>
            <div class="api-note">Meeting me chat message bhejta hai &mdash; recipientId null hai to public message, specific ID hai to private DM. WebSocket se sabko (ya sirf recipient ko) broadcast hota hai</div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-post">POST</span><span class="api-path">/api/v1/meetings/{meetingId}/recording/start</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Request</div>{
  "recordingType": "CLOUD",
  "includeChat": true,
  "layout": "GALLERY"
}</div>
                <div class="api-json"><div class="label">Response 200</div>{
  "recordingId": "rec-001",
  "status": "RECORDING",
  "startedAt": "2025-06-15T10:10:00Z",
  "storageLocation": "s3://recordings/rec-001"
}</div>
            </div>
            <div class="api-note">Cloud recording start karta hai &mdash; SFU server pe media mix hoke record hota hai. Participants ko "Recording started" notification milta hai. Chat history bhi optionally save hoti hai</div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-post">POST</span><span class="api-path">/api/v1/meetings/{meetingId}/breakout-rooms</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Request</div>{
  "roomCount": 3,
  "autoAssign": true,
  "timerMinutes": 15,
  "allowReturnToMain": true
}</div>
                <div class="api-json"><div class="label">Response 201</div>{
  "rooms": [
    { "roomId": "br-1", "name": "Room 1", "participants": ["p-1","p-2"] },
    { "roomId": "br-2", "name": "Room 2", "participants": ["p-3","p-4"] },
    { "roomId": "br-3", "name": "Room 3", "participants": ["p-5","p-6"] }
  ],
  "timerMinutes": 15,
  "expiresAt": "2025-06-15T10:25:00Z"
}</div>
            </div>
            <div class="api-note">Breakout rooms create karta hai &mdash; autoAssign=true se participants randomly distribute ho jaate hai. Timer expire hone pe sab main room me wapas aa jaate hai</div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-post">POST</span><span class="api-path">/api/v1/meetings/{meetingId}/reactions</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Request</div>{
  "reaction": "RAISED_HAND"
}</div>
                <div class="api-json"><div class="label">Response 200</div>{
  "participantId": "p-xyz789",
  "reaction": "RAISED_HAND",
  "handRaised": true,
  "timestamp": "2025-06-15T10:12:00Z"
}</div>
            </div>
            <div class="api-note">Reaction ya hand raise bhejta hai &mdash; WebSocket se sabko broadcast hota hai. Hand raise toggle hai (dobara bhejne se lower ho jaata hai), emoji reactions 5 sec baad auto-dismiss hote hai</div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-post">POST</span><span class="api-path">/api/v1/meetings/{meetingId}/end</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Request</div>{
  "endForAll": true
}</div>
                <div class="api-json"><div class="label">Response 200</div>{
  "meetingId": "m-abc123xyz",
  "status": "ENDED",
  "duration": 3600,
  "totalParticipants": 25,
  "recordingId": "rec-001",
  "endedAt": "2025-06-15T11:00:00Z"
}</div>
            </div>
            <div class="api-note">Host meeting end karta hai &mdash; endForAll=true se sabka WebSocket connection close hota hai, recording stop hoti hai, resources release hote hai aur meeting summary generate hota hai</div>
        </div>
    </div>
</div>

<!-- ============ 6. DATABASE SCHEMA ============ -->
<div class="section theme-pink">
    <div class="section-title"><span class="section-num">6</span>Database Schema</div>

    <div class="dbtech-grid">
        <div class="dbtech-card">
            <div class="dbtech-name">PostgreSQL <span class="dbtech-type">RDBMS</span></div>
            <div class="dbtech-usage">Users, meetings, participants, recordings &mdash; strong consistency aur ACID transactions ke liye</div>
            <div class="dbtech-tables"><span>users</span><span>meetings</span><span>participants</span><span>recordings</span><span>breakout_rooms</span></div>
        </div>
        <div class="dbtech-card">
            <div class="dbtech-name">Redis <span class="dbtech-type">Cache + Pub/Sub</span></div>
            <div class="dbtech-usage">Active meeting state, participant presence, real-time reactions, signaling coordination</div>
            <div class="dbtech-tables"><span>meeting:active:{id}</span><span>participant:presence</span><span>reactions:{meetingId}</span></div>
        </div>
        <div class="dbtech-card">
            <div class="dbtech-name">MongoDB <span class="dbtech-type">NoSQL</span></div>
            <div class="dbtech-usage">Chat messages, meeting analytics &mdash; flexible schema aur fast writes ke liye</div>
            <div class="dbtech-tables"><span>chat_messages</span><span>meeting_analytics</span></div>
        </div>
        <div class="dbtech-card">
            <div class="dbtech-name">S3 <span class="dbtech-type">Object Storage</span></div>
            <div class="dbtech-usage">Meeting recordings, shared files, profile pictures &mdash; large binary data ke liye</div>
            <div class="dbtech-tables"><span>recordings/</span><span>shared-files/</span><span>avatars/</span></div>
        </div>
    </div>

    <div class="db-grid">
        <div class="db-table">
            <h3>users</h3>
            <ul>
                <li><span class="pk">id BIGINT (PK)</span></li>
                <li>email VARCHAR(255) UNIQUE</li>
                <li>name VARCHAR(100)</li>
                <li>password_hash VARCHAR(255)</li>
                <li>avatar_url VARCHAR(500)</li>
                <li>oauth_provider VARCHAR(50)</li>
                <li>oauth_id VARCHAR(255)</li>
                <li>is_active BOOLEAN DEFAULT true</li>
                <li>created_at TIMESTAMP</li>
                <li>updated_at TIMESTAMP</li>
                <li><span class="idx">INDEX idx_email (email)</span></li>
                <li><span class="idx">INDEX idx_oauth (oauth_provider, oauth_id)</span></li>
            </ul>
        </div>
        <div class="db-table">
            <h3>meetings</h3>
            <ul>
                <li><span class="pk">id VARCHAR(36) (PK)</span></li>
                <li><span class="fk">host_id BIGINT (FK &rarr; users.id)</span></li>
                <li>meeting_code VARCHAR(20) UNIQUE</li>
                <li>title VARCHAR(255)</li>
                <li>type ENUM('INSTANT','SCHEDULED','RECURRING','WEBINAR')</li>
                <li>status ENUM('SCHEDULED','WAITING','IN_PROGRESS','ENDED','CANCELLED')</li>
                <li>password_hash VARCHAR(255)</li>
                <li>lobby_enabled BOOLEAN DEFAULT false</li>
                <li>mute_on_entry BOOLEAN DEFAULT false</li>
                <li>allow_screen_share BOOLEAN DEFAULT true</li>
                <li>max_participants INT DEFAULT 100</li>
                <li>scheduled_start TIMESTAMP</li>
                <li>actual_start TIMESTAMP</li>
                <li>ended_at TIMESTAMP</li>
                <li>duration_seconds INT</li>
                <li>created_at TIMESTAMP</li>
                <li><span class="idx">INDEX idx_meeting_code (meeting_code)</span></li>
                <li><span class="idx">INDEX idx_host (host_id)</span></li>
                <li><span class="idx">INDEX idx_status (status)</span></li>
                <li><span class="idx">INDEX idx_scheduled (scheduled_start)</span></li>
            </ul>
        </div>
        <div class="db-table">
            <h3>participants</h3>
            <ul>
                <li><span class="pk">id VARCHAR(36) (PK)</span></li>
                <li><span class="fk">meeting_id VARCHAR(36) (FK &rarr; meetings.id)</span></li>
                <li><span class="fk">user_id BIGINT (FK &rarr; users.id) NULL</span></li>
                <li>display_name VARCHAR(100)</li>
                <li>role ENUM('HOST','CO_HOST','PARTICIPANT','GUEST')</li>
                <li>status ENUM('IN_LOBBY','JOINED','LEFT','KICKED')</li>
                <li>audio_enabled BOOLEAN DEFAULT true</li>
                <li>video_enabled BOOLEAN DEFAULT true</li>
                <li>hand_raised BOOLEAN DEFAULT false</li>
                <li>joined_at TIMESTAMP</li>
                <li>left_at TIMESTAMP</li>
                <li><span class="idx">INDEX idx_meeting_part (meeting_id, status)</span></li>
                <li><span class="idx">INDEX idx_user_meetings (user_id)</span></li>
            </ul>
        </div>
        <div class="db-table">
            <h3>recordings</h3>
            <ul>
                <li><span class="pk">id VARCHAR(36) (PK)</span></li>
                <li><span class="fk">meeting_id VARCHAR(36) (FK &rarr; meetings.id)</span></li>
                <li><span class="fk">started_by BIGINT (FK &rarr; users.id)</span></li>
                <li>status ENUM('RECORDING','PAUSED','STOPPED','PROCESSING','READY')</li>
                <li>storage_url VARCHAR(500)</li>
                <li>file_size_bytes BIGINT</li>
                <li>duration_seconds INT</li>
                <li>include_chat BOOLEAN DEFAULT false</li>
                <li>started_at TIMESTAMP</li>
                <li>stopped_at TIMESTAMP</li>
                <li>processed_at TIMESTAMP</li>
                <li><span class="idx">INDEX idx_meeting_rec (meeting_id)</span></li>
                <li><span class="idx">INDEX idx_user_rec (started_by)</span></li>
            </ul>
        </div>
        <div class="db-table">
            <h3>breakout_rooms</h3>
            <ul>
                <li><span class="pk">id VARCHAR(36) (PK)</span></li>
                <li><span class="fk">meeting_id VARCHAR(36) (FK &rarr; meetings.id)</span></li>
                <li>name VARCHAR(100)</li>
                <li>timer_minutes INT</li>
                <li>is_active BOOLEAN DEFAULT true</li>
                <li>created_at TIMESTAMP</li>
                <li>closed_at TIMESTAMP</li>
                <li><span class="idx">INDEX idx_meeting_br (meeting_id, is_active)</span></li>
            </ul>
        </div>
        <div class="db-table">
            <h3>chat_messages (MongoDB)</h3>
            <ul>
                <li><span class="pk">_id ObjectId (PK)</span></li>
                <li>meeting_id VARCHAR(36)</li>
                <li>sender_id VARCHAR(36)</li>
                <li>sender_name VARCHAR(100)</li>
                <li>content TEXT</li>
                <li>type ENUM('TEXT','FILE','LINK')</li>
                <li>recipient_id VARCHAR(36) NULL</li>
                <li>is_private BOOLEAN DEFAULT false</li>
                <li>file_url VARCHAR(500) NULL</li>
                <li>timestamp TIMESTAMP</li>
                <li><span class="idx">INDEX idx_meeting_ts (meeting_id, timestamp)</span></li>
            </ul>
        </div>
    </div>

    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">SQL &mdash; Core Queries</span></div><pre class="code-block">
<span class="cm">-- Meeting create karte waqt unique code generate karo</span>
<span class="kw">INSERT INTO</span> meetings (id, host_id, meeting_code, title, type, status, lobby_enabled, mute_on_entry, max_participants, scheduled_start, created_at)
<span class="kw">VALUES</span> (UUID(), :hostId, :meetingCode, :title, :type, 'SCHEDULED', :lobbyEnabled, :muteOnEntry, :maxParticipants, :scheduledStart, NOW());

<span class="cm">-- Participant join kare to lobby me daalo ya direct join</span>
<span class="kw">INSERT INTO</span> participants (id, meeting_id, user_id, display_name, role, status, joined_at)
<span class="kw">VALUES</span> (UUID(), :meetingId, :userId, :displayName,
    <span class="kw">CASE WHEN</span> :userId = (SELECT host_id FROM meetings WHERE id = :meetingId) <span class="kw">THEN</span> 'HOST' <span class="kw">ELSE</span> 'PARTICIPANT' <span class="kw">END</span>,
    <span class="kw">CASE WHEN</span> (SELECT lobby_enabled FROM meetings WHERE id = :meetingId) = true <span class="kw">THEN</span> 'IN_LOBBY' <span class="kw">ELSE</span> 'JOINED' <span class="kw">END</span>,
    NOW());

<span class="cm">-- Active meeting ke participants fetch karo (lobby + joined)</span>
<span class="kw">SELECT</span> p.id, p.display_name, p.role, p.status, p.audio_enabled, p.video_enabled, p.hand_raised
<span class="kw">FROM</span> participants p
<span class="kw">WHERE</span> p.meeting_id = :meetingId <span class="kw">AND</span> p.status <span class="kw">IN</span> ('IN_LOBBY', 'JOINED')
<span class="kw">ORDER BY</span> p.joined_at;

<span class="cm">-- Lobby se admit karo (status update)</span>
<span class="kw">UPDATE</span> participants <span class="kw">SET</span> status = 'JOINED' <span class="kw">WHERE</span> id <span class="kw">IN</span> (:participantIds) <span class="kw">AND</span> meeting_id = :meetingId <span class="kw">AND</span> status = 'IN_LOBBY';

<span class="cm">-- Meeting end karo aur duration calculate karo</span>
<span class="kw">UPDATE</span> meetings <span class="kw">SET</span> status = 'ENDED', ended_at = NOW(),
    duration_seconds = EXTRACT(EPOCH FROM NOW() - actual_start)
<span class="kw">WHERE</span> id = :meetingId <span class="kw">AND</span> host_id = :hostId;

<span class="cm">-- User ki meeting history (recent first)</span>
<span class="kw">SELECT</span> m.id, m.title, m.type, m.status, m.scheduled_start, m.duration_seconds, p.role
<span class="kw">FROM</span> meetings m <span class="kw">JOIN</span> participants p <span class="kw">ON</span> m.id = p.meeting_id
<span class="kw">WHERE</span> p.user_id = :userId <span class="kw">ORDER BY</span> m.created_at <span class="kw">DESC</span> <span class="kw">LIMIT</span> :limit <span class="kw">OFFSET</span> :offset;

<span class="cm">-- Recordings fetch karo user ke liye</span>
<span class="kw">SELECT</span> r.id, r.meeting_id, m.title, r.status, r.duration_seconds, r.file_size_bytes, r.processed_at
<span class="kw">FROM</span> recordings r <span class="kw">JOIN</span> meetings m <span class="kw">ON</span> r.meeting_id = m.id
<span class="kw">WHERE</span> r.started_by = :userId <span class="kw">AND</span> r.status = 'READY'
<span class="kw">ORDER BY</span> r.processed_at <span class="kw">DESC</span>;
</pre></div>
</div>

<!-- ============ 7. ARCHITECTURE ============ -->
<div class="section theme-blue">
    <div class="section-title"><span class="section-num">7</span>Architecture &mdash; WebRTC + SFU Deep Dive</div>

    <div class="service-grid">
        <div class="service-card">
            <h3>WebRTC Flow (How Video Call Works)</h3>
            <p class="svc-desc">Ye poore system ka core hai &mdash; client-to-client ya client-to-SFU ke beech audio/video kaise establish hota hai</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">WebRTC Signaling Flow</span></div><pre class="code-block">
<span class="cm">// Step 1: User A creates offer (SDP = Session Description Protocol)</span>
<span class="cm">// SDP me batata hai ki kaunsa codec, resolution, bitrate support karta hai</span>
User A  &rarr;  SDP Offer  &rarr;  Signaling Server (WebSocket)

<span class="cm">// Step 2: Signaling server offer forward karta hai User B ko</span>
Signaling Server  &rarr;  SDP Offer  &rarr;  User B

<span class="cm">// Step 3: User B SDP Answer bhejta hai (apni capabilities)</span>
User B  &rarr;  SDP Answer  &rarr;  Signaling Server  &rarr;  User A

<span class="cm">// Step 4: ICE Candidates exchange (NAT traversal)</span>
<span class="cm">// STUN server se public IP pata chalta hai</span>
<span class="cm">// TURN server relay karta hai jab direct connection fail ho</span>
User A  &harr;  ICE Candidates  &harr;  User B

<span class="cm">// Step 5: P2P connection establish &mdash; media flows directly</span>
User A  &harr;&harr;&harr;  DTLS-SRTP Encrypted Media  &harr;&harr;&harr;  User B
</pre></div>
        </div>
        <div class="service-card">
            <h3>SFU vs MCU vs Mesh</h3>
            <p class="svc-desc">Video conferencing me 3 architecture patterns hai &mdash; Zoom/Meet/Teams sab SFU use karte hai production me</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Architecture Comparison</span></div><pre class="code-block">
<span class="cm">// 1. MESH (P2P) &mdash; Small calls only (2-4 people)</span>
<span class="cm">// Har user directly baaki sab se connected hai</span>
<span class="cm">// Problem: N users = N-1 upload streams per user (exponential)</span>
  A &harr; B
  A &harr; C    <span class="cm">// 3 users = 2 connections each = 6 total</span>
  B &harr; C    <span class="cm">// 10 users = 9 connections each = 90 total (impossible!)</span>

<span class="cm">// 2. SFU (Selective Forwarding Unit) &mdash; BEST for video calls</span>
<span class="cm">// Har user ek hi baar upload karta hai SFU server ko</span>
<span class="cm">// SFU selectively forward karta hai viewers ko (no mixing)</span>
  A &rarr; SFU &rarr; B, C, D
  B &rarr; SFU &rarr; A, C, D    <span class="cm">// Each user: 1 upload, N-1 downloads</span>
  C &rarr; SFU &rarr; A, B, D    <span class="cm">// Zoom, Meet, Teams sab SFU use karte hai!</span>

<span class="cm">// 3. MCU (Multipoint Control Unit) &mdash; Expensive, server-heavy</span>
<span class="cm">// Server sab streams mix karke ek composite stream bhejta hai</span>
<span class="cm">// Heavy CPU usage on server (decoding + encoding)</span>
  A &rarr; MCU &rarr; mixed stream &rarr; B, C, D
  <span class="cm">// Pro: Client ko sirf 1 stream receive karni hai</span>
  <span class="cm">// Con: Server cost bahut high, latency zyada</span>
</pre></div>
        </div>
        <div class="service-card">
            <h3>Simulcast &amp; SVC (Scalable Video)</h3>
            <p class="svc-desc">SFU me adaptive quality ke liye sender multiple quality layers bhejta hai &mdash; SFU receiver ki bandwidth ke hisaab se best layer forward karta hai</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Simulcast Architecture</span></div><pre class="code-block">
<span class="cm">// SIMULCAST: Sender 3 quality streams bhejta hai SFU ko</span>
<span class="cm">// SFU receiver ki bandwidth ke hisaab se best stream forward karta hai</span>

Sender &rarr; SFU Server:
  Stream 1: 1080p @ 2.5 Mbps  (High quality)
  Stream 2:  720p @ 1.0 Mbps  (Medium quality)
  Stream 3:  360p @ 0.5 Mbps  (Low quality)

SFU &rarr; Receiver A (fast internet):   1080p stream forward
SFU &rarr; Receiver B (slow internet):    360p stream forward
SFU &rarr; Receiver C (mobile data):      720p stream forward

<span class="cm">// Dynamic switching: Bandwidth change hone pe SFU</span>
<span class="cm">// automatically dusri quality stream pe switch karta hai</span>
<span class="cm">// Client ko kuch karne ki zaroorat nahi!</span>

<span class="cm">// Active Speaker Detection:</span>
<span class="cm">// Jo bol raha hai uski HIGH quality stream forward hoti hai</span>
<span class="cm">// Baaki sab ki LOW quality stream forward hoti hai</span>
<span class="cm">// Isse bandwidth 60-70% save hota hai!</span>
</pre></div>
        </div>
        <div class="service-card">
            <h3>TURN / STUN Servers (NAT Traversal)</h3>
            <p class="svc-desc">80% users NAT ke peeche hote hai &mdash; STUN public IP batata hai, TURN relay karta hai jab direct connection fail ho</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">NAT Traversal</span></div><pre class="code-block">
<span class="cm">// STUN (Session Traversal Utilities for NAT)</span>
<span class="cm">// Client STUN server se apna public IP:port pata karta hai</span>
Client &rarr; STUN Server: "Mera public IP kya hai?"
STUN Server &rarr; Client: "203.0.113.5:54321"
<span class="cm">// Ab ye public IP peer ko bhej sakte hai ICE candidate me</span>

<span class="cm">// TURN (Traversal Using Relays around NAT)</span>
<span class="cm">// Jab symmetric NAT ho aur direct connection na bane</span>
<span class="cm">// TURN server relay karta hai media (last resort)</span>
Client A &rarr; TURN Server &rarr; Client B
<span class="cm">// ~15% calls TURN use karti hai (corporate firewalls)</span>
<span class="cm">// TURN server bandwidth costly hai isliye last resort hai</span>

<span class="cm">// ICE (Interactive Connectivity Establishment)</span>
<span class="cm">// Sab candidates try karta hai best se worst:</span>
<span class="cm">// 1. Host candidate (same LAN = direct)</span>
<span class="cm">// 2. Server reflexive (STUN = public IP)</span>
<span class="cm">// 3. Relay (TURN = server relay, last resort)</span>
</pre></div>
        </div>
    </div>
</div>

<!-- ============ 8. REAL-TIME COMMUNICATION ============ -->
<div class="section theme-green">
    <div class="section-title"><span class="section-num">8</span>Real-time Communication &mdash; WebSocket Events</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">WebSocket Events &mdash; Server &harr; Client</span></div><pre class="code-block">
<span class="cm">// ===== SIGNALING EVENTS (WebRTC Setup) =====</span>

<span class="cm">// Client &rarr; Server: SDP offer bhejta hai</span>
{ "event": "OFFER", "meetingId": "m-abc", "sdp": "v=0\r\n..." }

<span class="cm">// Server &rarr; Client: SDP answer forward karta hai</span>
{ "event": "ANSWER", "meetingId": "m-abc", "from": "p-xyz", "sdp": "v=0\r\n..." }

<span class="cm">// Bidirectional: ICE candidates exchange</span>
{ "event": "ICE_CANDIDATE", "meetingId": "m-abc", "candidate": { "sdpMid": "0", "candidate": "..." } }

<span class="cm">// ===== PARTICIPANT EVENTS =====</span>

<span class="cm">// Server &rarr; All: Naya participant joined</span>
{ "event": "PARTICIPANT_JOINED", "participant": { "id": "p-new", "name": "Rahul", "role": "PARTICIPANT" } }

<span class="cm">// Server &rarr; All: Participant left ya kicked</span>
{ "event": "PARTICIPANT_LEFT", "participantId": "p-xyz", "reason": "LEFT" }

<span class="cm">// Server &rarr; Host: Koi lobby me aaya</span>
{ "event": "LOBBY_ENTRY", "participant": { "id": "p-new", "name": "Guest User" } }

<span class="cm">// ===== MEDIA EVENTS =====</span>

<span class="cm">// Server &rarr; All: Participant ne mute/unmute kiya</span>
{ "event": "MEDIA_TOGGLE", "participantId": "p-xyz", "mediaType": "AUDIO", "enabled": false }

<span class="cm">// Server &rarr; All: Screen share started/stopped</span>
{ "event": "SCREEN_SHARE_STARTED", "participantId": "p-xyz", "shareId": "ss-001" }
{ "event": "SCREEN_SHARE_STOPPED", "participantId": "p-xyz" }

<span class="cm">// ===== INTERACTION EVENTS =====</span>

<span class="cm">// Server &rarr; All: Hand raised/lowered</span>
{ "event": "HAND_RAISED", "participantId": "p-xyz", "raised": true }

<span class="cm">// Server &rarr; All: Emoji reaction (auto-dismiss after 5s)</span>
{ "event": "REACTION", "participantId": "p-xyz", "reaction": "THUMBS_UP" }

<span class="cm">// Server &rarr; All: Chat message broadcast</span>
{ "event": "CHAT_MESSAGE", "messageId": "msg-101", "senderId": "p-xyz", "content": "Hello!", "isPrivate": false }

<span class="cm">// ===== MEETING CONTROL EVENTS =====</span>

<span class="cm">// Server &rarr; All: Recording started (participants ko inform karo)</span>
{ "event": "RECORDING_STARTED", "recordingId": "rec-001" }

<span class="cm">// Server &rarr; All: Meeting ending in 5 minutes</span>
{ "event": "MEETING_ENDING_SOON", "minutesRemaining": 5 }

<span class="cm">// Server &rarr; All: Meeting ended by host</span>
{ "event": "MEETING_ENDED", "meetingId": "m-abc", "reason": "HOST_ENDED" }
</pre></div>
</div>

<!-- ============ 9. SCALABILITY ============ -->
<div class="section theme-purple">
    <div class="section-title"><span class="section-num">9</span>Scalability &amp; High Availability</div>
    <div class="service-grid">
        <div class="service-card">
            <h3>SFU Server Scaling</h3>
            <p class="svc-desc">Ek SFU server ~100-200 participants handle karta hai &mdash; bade meetings ke liye cascaded SFU architecture use hota hai</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Cascaded SFU</span></div><pre class="code-block">
<span class="cm">// Single SFU: 100-200 participants max</span>
<span class="cm">// 1000 participants ke liye? Cascaded SFU!</span>

<span class="cm">// Primary SFU (origin) se multiple edge SFUs connected</span>
Participants 1-200   &rarr; SFU-1 (Region: US-East)
Participants 201-400 &rarr; SFU-2 (Region: US-West)
Participants 401-600 &rarr; SFU-3 (Region: EU)
Participants 601-800 &rarr; SFU-4 (Region: Asia)

<span class="cm">// SFU servers aapas me media relay karte hai</span>
SFU-1 &harr; SFU-2 &harr; SFU-3 &harr; SFU-4
<span class="cm">// Inter-SFU communication low-latency backbone pe hota hai</span>

<span class="cm">// Load Balancer decides: user kaunse SFU pe jaaye</span>
<span class="cm">// Criteria: geographic proximity, server load, latency</span>
</pre></div>
        </div>
        <div class="service-card">
            <h3>Redis for Real-time State</h3>
            <p class="svc-desc">Active meeting state Redis me rakho &mdash; participant list, media state, reactions sab in-memory hai for speed</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Redis Data Structures</span></div><pre class="code-block">
<span class="cm">// Meeting active state (Hash)</span>
HSET meeting:active:m-abc
    status "IN_PROGRESS"
    host_id "1001"
    participant_count "25"
    recording "true"
    sfu_server "sfu-3.us-east"

<span class="cm">// Participant presence (Sorted Set by join time)</span>
ZADD meeting:participants:m-abc 1718445600 "p-xyz789"
ZADD meeting:participants:m-abc 1718445610 "p-abc456"

<span class="cm">// Media state per participant (Hash)</span>
HSET participant:media:p-xyz789
    audio "true" video "false" screen "false"

<span class="cm">// Raised hands (Set)</span>
SADD meeting:hands:m-abc "p-xyz789" "p-abc456"

<span class="cm">// Participant &rarr; SFU mapping</span>
HSET meeting:sfu-map:m-abc "p-xyz789" "sfu-1"

<span class="cm">// TTL: Meeting end hone pe 1 hour baad auto-delete</span>
EXPIRE meeting:active:m-abc 3600
</pre></div>
        </div>
        <div class="service-card">
            <h3>Recording Pipeline</h3>
            <p class="svc-desc">SFU server pe media capture hoke S3 pe raw chunks jaate hai &mdash; Kafka event trigger karta hai processing pipeline ko</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Recording Architecture</span></div><pre class="code-block">
<span class="cm">// Step 1: SFU server pe recording bot join karta hai</span>
<span class="cm">// Ye bot sab participants ke streams receive karta hai</span>
Recording Bot joins meeting &rarr; receives all media streams

<span class="cm">// Step 2: Raw media chunks S3 pe upload hote hai</span>
Raw Audio chunks &rarr; S3://recordings/m-abc/audio/
Raw Video chunks &rarr; S3://recordings/m-abc/video/

<span class="cm">// Step 3: Meeting end pe Kafka event trigger</span>
{ "event": "RECORDING_COMPLETE", "meetingId": "m-abc",
  "chunks": 450, "duration": 3600 }

<span class="cm">// Step 4: Processing pipeline (async workers)</span>
Worker picks up &rarr; merge chunks &rarr; transcode to MP4
    &rarr; generate thumbnail &rarr; upload final to S3
    &rarr; update DB status = READY
    &rarr; notify host via email/push

<span class="cm">// Step 5: Signed URL se download (time-limited)</span>
GET /recordings/rec-001/download
&rarr; S3 presigned URL (expires in 24h)
</pre></div>
        </div>
    </div>
</div>

<!-- ============ 10. SECURITY ============ -->
<div class="section theme-yellow">
    <div class="section-title"><span class="section-num">10</span>Security &amp; Privacy</div>
    <div class="service-grid">
        <div class="service-card">
            <h3>E2E Encryption (Insertable Streams)</h3>
            <p class="svc-desc">WebRTC me DTLS-SRTP default encryption hai, lekin true E2E encryption ke liye Insertable Streams API use hota hai jisme SFU bhi decrypt nahi kar sakta</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Encryption Layers</span></div><pre class="code-block">
<span class="cm">// Layer 1: DTLS-SRTP (Default WebRTC encryption)</span>
<span class="cm">// Client &harr; SFU ke beech encrypted hai</span>
<span class="cm">// BUT: SFU server pe media plaintext me available hai</span>
Client &rarr; [DTLS encrypted] &rarr; SFU &rarr; [DTLS encrypted] &rarr; Client

<span class="cm">// Layer 2: E2E Encryption (Insertable Streams)</span>
<span class="cm">// Client pe encrypt, client pe decrypt — SFU sirf forward karta hai</span>
<span class="cm">// SFU ko encrypted blob milta hai, wo decrypt nahi kar sakta</span>
Client &rarr; [E2E + DTLS] &rarr; SFU (can't read) &rarr; [E2E + DTLS] &rarr; Client

<span class="cm">// Key Exchange: Sender Encryption Key (SEK)</span>
<span class="cm">// Har participant ka unique key hai</span>
<span class="cm">// Key rotation har 30 sec pe hota hai</span>
<span class="cm">// Participant leave kare to key change hota hai (forward secrecy)</span>

<span class="cm">// Trade-off: E2E ON = no server-side recording possible</span>
<span class="cm">// Zoom "E2E mode" me cloud recording disabled hota hai</span>
</pre></div>
        </div>
        <div class="service-card">
            <h3>Meeting Security Controls</h3>
            <p class="svc-desc">Zoom-bombing prevention ke liye multiple layers of security</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Security Checklist</span></div><pre class="code-block">
<span class="cm">// 1. Meeting Password</span>
<span class="cm">// Join karne ke liye password chahiye (6-10 digit)</span>

<span class="cm">// 2. Waiting Room / Lobby</span>
<span class="cm">// Host manually approve karta hai har participant ko</span>

<span class="cm">// 3. Meeting Lock</span>
<span class="cm">// Sab join karne ke baad meeting lock karo</span>
<span class="cm">// Koi naya join nahi kar sakta</span>

<span class="cm">// 4. Authenticated Users Only</span>
<span class="cm">// Guest join disable — sirf logged-in users allowed</span>

<span class="cm">// 5. Rate Limiting</span>
<span class="cm">// Wrong password 5 baar = 15 min block</span>
<span class="cm">// Join attempts per IP rate limited</span>

<span class="cm">// 6. Meeting Code Rotation</span>
<span class="cm">// One-time meeting IDs (not reusable personal rooms)</span>

<span class="cm">// 7. Participant Actions Control</span>
<span class="cm">// Host disable kar sakta hai: screen share, chat, unmute</span>
</pre></div>
        </div>
    </div>
</div>

<!-- ============ 11. SYSTEM FLOW ============ -->
<div class="section theme-teal">
    <div class="section-title"><span class="section-num">11</span>Complete Meeting Flow &mdash; End to End</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Meeting Lifecycle</span></div><pre class="code-block">
<span class="cm">// ===== PHASE 1: MEETING CREATION =====</span>
Host &rarr; POST /meetings &rarr; MeetingService.createMeeting()
    &rarr; Generate unique meeting code (123-456-789)
    &rarr; Save to PostgreSQL (status = SCHEDULED)
    &rarr; Send calendar invite via NotificationService
    &rarr; Return join URL to host

<span class="cm">// ===== PHASE 2: JOINING =====</span>
Participant &rarr; POST /meetings/{code}/join
    &rarr; Validate password (if set)
    &rarr; Check lobby setting
        &rarr; Lobby ON: status = IN_LOBBY, notify host via WebSocket
        &rarr; Lobby OFF: status = JOINED, proceed to media setup
    &rarr; Return signaling URL + TURN credentials

<span class="cm">// ===== PHASE 3: MEDIA SETUP (WebRTC) =====</span>
Client &rarr; WebSocket connect to Signaling Server
    &rarr; Send SDP Offer to SFU
    &rarr; SFU responds with SDP Answer
    &rarr; ICE candidate exchange (STUN/TURN)
    &rarr; Media connection established!
    &rarr; Simulcast: send 3 quality streams (360p, 720p, 1080p)

<span class="cm">// ===== PHASE 4: ACTIVE MEETING =====</span>
<span class="cm">// All via WebSocket real-time:</span>
    &rarr; Media streams flowing through SFU
    &rarr; Active speaker detection (loudest audio = spotlight)
    &rarr; Chat messages via ChatService
    &rarr; Reactions broadcast to all
    &rarr; Screen share via separate media track
    &rarr; Recording bot capturing all streams

<span class="cm">// ===== PHASE 5: MEETING END =====</span>
Host &rarr; POST /meetings/{id}/end
    &rarr; Broadcast MEETING_ENDED event to all via WebSocket
    &rarr; Close all WebRTC connections
    &rarr; Stop recording &rarr; trigger processing pipeline
    &rarr; Update meeting status = ENDED in PostgreSQL
    &rarr; Clean up Redis state (TTL 1 hour)
    &rarr; Release SFU server resources
    &rarr; Send recording link when processed
</pre></div>
</div>

<!-- ============ 12. KEY DIFFERENCES ============ -->
<div class="section theme-pink">
    <div class="section-title"><span class="section-num">12</span>Zoom vs Google Meet vs Teams &mdash; Key Differences</div>
    <div class="service-grid">
        <div class="service-card">
            <h3>Zoom</h3>
            <p class="svc-desc">Standalone platform &mdash; dedicated desktop client best performance deta hai</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Zoom Specifics</span></div><pre class="code-block">
<span class="cm">// Custom media protocol (not pure WebRTC)</span>
<span class="cm">// Desktop client = native C++ for best performance</span>
<span class="cm">// Own global data center network</span>
<span class="cm">// Breakout rooms (first to introduce)</span>
<span class="cm">// Virtual backgrounds with ML (on-device)</span>
<span class="cm">// Webinar mode (10K+ attendees)</span>
<span class="cm">// Phone dial-in support (PSTN gateway)</span>
<span class="cm">// Max 1000 participants (paid plan)</span>
</pre></div>
        </div>
        <div class="service-card">
            <h3>Google Meet</h3>
            <p class="svc-desc">Browser-first approach &mdash; Google Calendar + Gmail integration</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Meet Specifics</span></div><pre class="code-block">
<span class="cm">// Pure WebRTC (browser-native, no plugin)</span>
<span class="cm">// Google Calendar tight integration</span>
<span class="cm">// Gmail se directly meeting start</span>
<span class="cm">// Google Cloud infrastructure (global)</span>
<span class="cm">// AI-powered noise cancellation</span>
<span class="cm">// Live captions (speech-to-text)</span>
<span class="cm">// Max 500 participants (Enterprise)</span>
<span class="cm">// No desktop client required (browser works)</span>
</pre></div>
        </div>
        <div class="service-card">
            <h3>Microsoft Teams</h3>
            <p class="svc-desc">Microsoft 365 ecosystem &mdash; chat, files, meetings sab ek jagah</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Teams Specifics</span></div><pre class="code-block">
<span class="cm">// Deep Microsoft 365 integration (Outlook, SharePoint, OneDrive)</span>
<span class="cm">// Persistent chat channels (not just meeting chat)</span>
<span class="cm">// Azure Communication Services backend</span>
<span class="cm">// Together Mode (AI-generated shared background)</span>
<span class="cm">// Whiteboard integration (real-time collaboration)</span>
<span class="cm">// Max 1000 participants (interactive)</span>
<span class="cm">// Town Hall mode (10K+ view-only attendees)</span>
<span class="cm">// Phone system (PSTN replacement)</span>
</pre></div>
        </div>
    </div>
</div>

<!-- ============ 13. BOTTLENECKS ============ -->
<div class="section theme-blue">
    <div class="section-title"><span class="section-num">13</span>Bottlenecks &amp; Solutions</div>
    <div class="bottleneck-grid">
        <div class="bottleneck-card"><h3>SFU Server Overload</h3><p>Cascaded SFU architecture use karo &mdash; ek SFU 200 participants, usse zyada ke liye multiple SFUs chain karo. Geographic routing se nearest SFU assign karo</p></div>
        <div class="bottleneck-card"><h3>Bandwidth Explosion</h3><p>Simulcast + Active Speaker Detection &mdash; sirf speaker ki high quality stream forward karo, baaki sab ki low quality. Gallery view me visible tiles ki hi streams bhejo</p></div>
        <div class="bottleneck-card"><h3>Network Jitter &amp; Packet Loss</h3><p>Jitter buffer (50-200ms), FEC (Forward Error Correction) for packet loss recovery, NACK-based retransmission for critical frames, Opus codec for audio (handles 30% loss)</p></div>
        <div class="bottleneck-card"><h3>Recording Storage Cost</h3><p>Raw recording ko transcode karke compressed MP4 banao (10x size reduction). Cold storage (S3 Glacier) me purane recordings move karo. Auto-delete policy set karo (90 days)</p></div>
        <div class="bottleneck-card"><h3>Lobby Queue Surge</h3><p>Redis sorted set se lobby manage karo. Batch admit feature for host. Auto-admit for authenticated org users. Lobby timeout (10 min) se stale entries clean karo</p></div>
        <div class="bottleneck-card"><h3>Signaling Server Bottleneck</h3><p>WebSocket connections horizontally scale karo with sticky sessions. Redis Pub/Sub for cross-server event broadcasting. Separate signaling from media path</p></div>
        <div class="bottleneck-card"><h3>TURN Server Cost</h3><p>TURN sirf 15% calls me use hota hai &mdash; geographic TURN server placement. TCP fallback over 443 for corporate firewalls. Bandwidth quotas per meeting</p></div>
        <div class="bottleneck-card"><h3>Large Meeting Latency</h3><p>Dominant speaker algorithm &mdash; sirf top 4 speakers ki video forward karo. Last-N strategy: sirf recent active participants ki streams. Thumbnail mode for 50+ participants</p></div>
    </div>
</div>

<!-- ============ 14. INTERVIEW TIPS ============ -->
<div class="section theme-green">
    <div class="section-title"><span class="section-num">14</span>Interview Tips &mdash; Key Points to Remember</div>
    <div class="service-grid">
        <div class="service-card">
            <h3>Must-Know Concepts</h3>
            <p class="svc-desc">Ye concepts interview me zaroor aayenge &mdash; ache se samajh lo</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Key Talking Points</span></div><pre class="code-block">
<span class="cm">// 1. WHY SFU over Mesh/MCU?</span>
<span class="cm">// SFU = best balance of quality, scalability, cost</span>
<span class="cm">// Mesh doesn't scale, MCU is too CPU-heavy</span>

<span class="cm">// 2. WebRTC Signaling is NOT media</span>
<span class="cm">// Signaling = SDP + ICE exchange (WebSocket)</span>
<span class="cm">// Media = actual audio/video (UDP/DTLS-SRTP)</span>

<span class="cm">// 3. Simulcast saves bandwidth</span>
<span class="cm">// Sender sends 3 qualities, SFU picks best for each receiver</span>

<span class="cm">// 4. E2E encryption trade-off</span>
<span class="cm">// E2E ON = no server recording, no transcription</span>
<span class="cm">// Most calls use transport encryption (DTLS), not true E2E</span>

<span class="cm">// 5. TURN is expensive but necessary</span>
<span class="cm">// ~15% of connections need TURN (corporate NATs)</span>
<span class="cm">// Without TURN, those users can't connect at all</span>

<span class="cm">// 6. Active Speaker Detection</span>
<span class="cm">// Audio level analysis = who's speaking</span>
<span class="cm">// Only forward high-quality stream for active speaker</span>
<span class="cm">// Saves 60-70% bandwidth in large meetings</span>

<span class="cm">// 7. Recording = separate bot participant</span>
<span class="cm">// Not client-side capture, server-side SFU recording</span>

<span class="cm">// 8. Lobby/Waiting Room is critical for security</span>
<span class="cm">// Prevents Zoom-bombing, unauthorized access</span>
</pre></div>
        </div>
    </div>
</div>
`
}
