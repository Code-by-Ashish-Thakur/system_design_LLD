export default {
  title: "Gmail &mdash; Low Level Design",
  subtitle: "Complete LLD for Email System &mdash; Java Spring Boot Interview",
  subtitleColor: "#ffcdd2",
  headerGradient: "linear-gradient(135deg,#c62828,#ea4335,#ff7043)",
  footerText: "Gmail (Email System) &mdash; LLD",
  content: `
<!-- ============ 1. FUNCTIONAL REQUIREMENTS ============ -->
<div class="section theme-green">
    <div class="section-title"><span class="section-num">1</span>Functional Requirements</div>
    <div class="req-grid">
        <div class="req-pill"><span class="num">1</span><div class="fr-content"><div class="fr-en">User Registration &amp; Login (Google OAuth)</div><div class="fr-hi">Gmail me Google account se login hota hai — email address hi identity hai, bina account ke email send/receive nahi ho sakta</div></div></div>
        <div class="req-pill"><span class="num">2</span><div class="fr-content"><div class="fr-en">Compose &amp; Send Email</div><div class="fr-hi">Ye email system ka core feature hai — To, CC, BCC me recipients add karo, subject/body likho, attach files, aur send karo. SMTP protocol se deliver hota hai</div></div></div>
        <div class="req-pill"><span class="num">3</span><div class="fr-content"><div class="fr-en">Receive Email (SMTP Inbound)</div><div class="fr-hi">Dusre email servers se email receive karna — MX record lookup se sender ko pata chalta hai ki receiver ka mail server kahan hai. SMTP se deliver hota hai inbox me</div></div></div>
        <div class="req-pill"><span class="num">4</span><div class="fr-content"><div class="fr-en">Inbox with Tabs (Primary / Social / Promotions)</div><div class="fr-hi">Gmail ka killer feature — ML model se automatically categorize hota hai. Primary = important personal emails, Social = Facebook/Twitter notifications, Promotions = marketing emails</div></div></div>
        <div class="req-pill"><span class="num">5</span><div class="fr-content"><div class="fr-en">Reply / Reply All / Forward</div><div class="fr-hi">Email conversation ka basic flow — reply sirf sender ko, reply all sab recipients ko, forward kisi aur ko bhejta hai. Thread me linked rehta hai via In-Reply-To header</div></div></div>
        <div class="req-pill"><span class="num">6</span><div class="fr-content"><div class="fr-en">Attachments (Upload / Download)</div><div class="fr-hi">Files bhejne ka tarika — Gmail me 25MB tak direct attach, usse bada Google Drive link auto-insert hota hai. S3 pe store, CDN se download</div></div></div>
        <div class="req-pill"><span class="num">7</span><div class="fr-content"><div class="fr-en">Labels &amp; Folders (Organize)</div><div class="fr-hi">Emails organize karne ke liye — Gmail labels use karta hai (ek email pe multiple labels, unlike folders). Inbox, Sent, Drafts, Spam, Trash system labels hai</div></div></div>
        <div class="req-pill"><span class="num">8</span><div class="fr-content"><div class="fr-en">Search Emails (Full-text)</div><div class="fr-hi">Thousands of emails me se dhundhna — from:, to:, subject:, has:attachment, before:, after: operators. Elasticsearch se full-text search body + subject me</div></div></div>
        <div class="req-pill"><span class="num">9</span><div class="fr-content"><div class="fr-en">Star / Archive / Delete</div><div class="fr-hi">Star se important mark, archive se inbox se hatao (delete nahi), delete se trash me jaata hai. Quick actions jo email management easy banate hai</div></div></div>
        <div class="req-pill"><span class="num">10</span><div class="fr-content"><div class="fr-en">Draft Auto-Save</div><div class="fr-hi">Compose karte waqt har 2 sec me auto-save hota hai — browser crash ho, power cut jaaye, draft safe rehta hai. WebSocket ya periodic API call se save</div></div></div>
        <div class="req-pill"><span class="num">11</span><div class="fr-content"><div class="fr-en">Spam &amp; Phishing Detection</div><div class="fr-hi">Gmail ka 99.9% spam detection rate hai — Bayesian filter, ML classifier, SPF/DKIM/DMARC verification, content analysis, sender reputation. Spam me gaya to retrieve bhi kar sakte ho</div></div></div>
        <div class="req-pill"><span class="num">12</span><div class="fr-content"><div class="fr-en">Contacts &amp; Address Book</div><div class="fr-hi">Email address store aur autocomplete ke liye — type karte hi suggestions aate hai. Contact groups se bulk email bhej sakte ho</div></div></div>
        <div class="req-pill"><span class="num">13</span><div class="fr-content"><div class="fr-en">Email Threading (Conversations)</div><div class="fr-hi">Related emails ek thread me group hote hai — In-Reply-To aur References headers se link hota hai. Gmail ne threading popularize kiya, conversation view dikhata hai</div></div></div>
        <div class="req-pill"><span class="num">14</span><div class="fr-content"><div class="fr-en">Filters &amp; Rules (Auto-organize)</div><div class="fr-hi">Automatic rules set karo — "from:boss@company.com" wale emails ko "Important" label lagao, "from:newsletter" ko archive karo. Incoming emails pe auto-apply hota hai</div></div></div>
        <div class="req-pill"><span class="num">15</span><div class="fr-content"><div class="fr-en">Push Notifications (New Email)</div><div class="fr-hi">Naya email aaye to turant pata chale — mobile push notification, desktop notification, unread badge count. WebSocket ya IMAP IDLE se real-time delivery</div></div></div>
        <div class="req-pill"><span class="num">16</span><div class="fr-content"><div class="fr-en">Undo Send (30 sec window)</div><div class="fr-hi">Galti se send ho gaya? 30 sec ke andar undo kar sakte ho — actually email immediately send nahi hota, queue me rehta hai 30 sec, phir deliver hota hai</div></div></div>
    </div>
</div>

<!-- ============ 2. NON-FUNCTIONAL REQUIREMENTS ============ -->
<div class="section theme-pink">
    <div class="section-title"><span class="section-num">2</span>Non-Functional Requirements</div>
    <div class="req-grid">
        <div class="req-pill"><span class="num">1</span><div class="nfr-content"><div class="nfr-en">High Availability &mdash; 99.99% uptime, email must never be lost</div><div class="nfr-hi">99.99% uptime — email ek business-critical tool hai, downtime = productivity loss, koi email lost nahi hona chahiye</div></div></div>
        <div class="req-pill"><span class="num">2</span><div class="nfr-content"><div class="nfr-en">Low Latency &mdash; Email delivery under 5 seconds</div><div class="nfr-hi">Email send karne ke 5 sec me deliver hona chahiye same provider pe — cross-provider me thoda delay OK but &lt; 30 sec target</div></div></div>
        <div class="req-pill"><span class="num">3</span><div class="nfr-content"><div class="nfr-en">Scalability &mdash; Handle 300B+ emails per day globally</div><div class="nfr-hi">Gmail pe daily 300 billion+ emails process hote hai — horizontal scaling + sharding mandatory hai</div></div></div>
        <div class="req-pill"><span class="num">4</span><div class="nfr-content"><div class="nfr-en">Security &mdash; TLS in transit, encryption at rest</div><div class="nfr-hi">Email transit me TLS encrypted hona chahiye, storage pe AES-256 encryption. Phishing/spam detection critical hai</div></div></div>
        <div class="req-pill"><span class="num">5</span><div class="nfr-content"><div class="nfr-en">Spam Detection &mdash; 99.9% accuracy</div><div class="nfr-hi">99.9% spam catch rate + low false positive — legitimate email spam me nahi jaana chahiye, ye user trust ka matter hai</div></div></div>
        <div class="req-pill"><span class="num">6</span><div class="nfr-content"><div class="nfr-en">Storage &mdash; 15GB free per user, efficient storage</div><div class="nfr-hi">Har user ko 15GB free — billions of users = exabytes of data, attachment dedup aur compression se cost manage karna padta hai</div></div></div>
    </div>
</div>

<!-- ============ 3. ENUMS ============ -->
<div class="section theme-purple">
    <div class="section-title"><span class="section-num">3</span>Enums</div>
    <div class="enum-grid">
        <div class="enum-card"><h3>EmailStatus</h3><div class="enum-val">DRAFT</div><div class="enum-val">QUEUED</div><div class="enum-val">SENDING</div><div class="enum-val">SENT</div><div class="enum-val">DELIVERED</div><div class="enum-val">BOUNCED</div><div class="enum-val">FAILED</div></div>
        <div class="enum-card"><h3>LabelType</h3><div class="enum-val">INBOX</div><div class="enum-val">SENT</div><div class="enum-val">DRAFTS</div><div class="enum-val">SPAM</div><div class="enum-val">TRASH</div><div class="enum-val">STARRED</div><div class="enum-val">IMPORTANT</div><div class="enum-val">CUSTOM</div></div>
        <div class="enum-card"><h3>SpamVerdict</h3><div class="enum-val">CLEAN</div><div class="enum-val">SPAM</div><div class="enum-val">PHISHING</div><div class="enum-val">MALWARE</div><div class="enum-val">SUSPICIOUS</div></div>
        <div class="enum-card"><h3>EmailCategory</h3><div class="enum-val">PRIMARY</div><div class="enum-val">SOCIAL</div><div class="enum-val">PROMOTIONS</div><div class="enum-val">UPDATES</div><div class="enum-val">FORUMS</div></div>
        <div class="enum-card"><h3>EmailPriority</h3><div class="enum-val">HIGH</div><div class="enum-val">NORMAL</div><div class="enum-val">LOW</div></div>
        <div class="enum-card"><h3>FilterAction</h3><div class="enum-val">LABEL</div><div class="enum-val">ARCHIVE</div><div class="enum-val">DELETE</div><div class="enum-val">STAR</div><div class="enum-val">MARK_READ</div><div class="enum-val">FORWARD</div><div class="enum-val">MARK_IMPORTANT</div></div>
        <div class="enum-card"><h3>AttachmentStatus</h3><div class="enum-val">UPLOADING</div><div class="enum-val">UPLOADED</div><div class="enum-val">SCANNING</div><div class="enum-val">CLEAN</div><div class="enum-val">INFECTED</div></div>
        <div class="enum-card"><h3>ThreadAction</h3><div class="enum-val">REPLY</div><div class="enum-val">REPLY_ALL</div><div class="enum-val">FORWARD</div></div>
    </div>
</div>

<!-- ============ 4. SERVICE LLD ============ -->
<div class="section theme-yellow">
    <div class="section-title"><span class="section-num">4</span>Service LLD</div>
    <div class="service-grid">
        <div class="service-card">
            <h3>AuthService</h3>
            <p class="svc-desc">User ka registration aur login handle karta hai &mdash; OAuth aur password dono support karta hai, JWT token issue karta hai</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">AuthService</span> {

    <span class="cm">// naya user register karta hai email + password se</span>
    <span class="tp">User</span> <span class="fn">register</span>(<span class="tp">String</span> email, <span class="tp">String</span> password,
        <span class="tp">String</span> displayName)

    <span class="cm">// email + password se login karke JWT return karta hai</span>
    <span class="tp">AuthToken</span> <span class="fn">login</span>(<span class="tp">String</span> email, <span class="tp">String</span> password)

    <span class="cm">// Google OAuth se login karta hai</span>
    <span class="tp">AuthToken</span> <span class="fn">oauthLogin</span>(<span class="tp">String</span> oauthCode,
        <span class="tp">String</span> provider)

    <span class="cm">// JWT token refresh karta hai</span>
    <span class="tp">AuthToken</span> <span class="fn">refreshToken</span>(<span class="tp">String</span> refreshToken)

    <span class="cm">// user ko logout karke session invalidate karta hai</span>
    <span class="kw">void</span> <span class="fn">logout</span>(<span class="tp">Long</span> userId, <span class="tp">String</span> sessionId)
}
</pre></div>
        </div>
        <div class="service-card">
            <h3>EmailService</h3>
            <p class="svc-desc">Email compose, send, reply, forward ka core logic — SMTP se outbound delivery, queue me schedule karta hai</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">EmailService</span> {

    <span class="cm">// email compose aur send karta hai</span>
    <span class="tp">Email</span> <span class="fn">sendEmail</span>(<span class="tp">Long</span> senderId,
        <span class="tp">List&lt;String&gt;</span> to, <span class="tp">List&lt;String&gt;</span> cc,
        <span class="tp">List&lt;String&gt;</span> bcc, <span class="tp">String</span> subject,
        <span class="tp">String</span> body, <span class="tp">List&lt;String&gt;</span> attachmentIds)

    <span class="cm">// email reply karta hai (thread me linked)</span>
    <span class="tp">Email</span> <span class="fn">reply</span>(<span class="tp">String</span> emailId, <span class="tp">Long</span> userId,
        <span class="tp">String</span> body, <span class="tp">boolean</span> replyAll)

    <span class="cm">// email forward karta hai</span>
    <span class="tp">Email</span> <span class="fn">forward</span>(<span class="tp">String</span> emailId,
        <span class="tp">List&lt;String&gt;</span> to, <span class="tp">Long</span> userId, <span class="tp">String</span> body)

    <span class="cm">// queued email ko undo karta hai (30 sec window)</span>
    <span class="tp">boolean</span> <span class="fn">undoSend</span>(<span class="tp">String</span> emailId, <span class="tp">Long</span> userId)

    <span class="cm">// email detail fetch karta hai</span>
    <span class="tp">EmailDetail</span> <span class="fn">getEmail</span>(<span class="tp">String</span> emailId,
        <span class="tp">Long</span> userId)
}
</pre></div>
        </div>
        <div class="service-card">
            <h3>InboxService</h3>
            <p class="svc-desc">Inbox, sent, labels ke emails paginated fetch karta hai — unread count, category tabs handle karta hai</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">InboxService</span> {

    <span class="cm">// inbox emails fetch karta hai (category-wise)</span>
    <span class="tp">Page&lt;EmailThread&gt;</span> <span class="fn">getInbox</span>(<span class="tp">Long</span> userId,
        <span class="tp">EmailCategory</span> category, <span class="tp">int</span> page, <span class="tp">int</span> size)

    <span class="cm">// label ke emails fetch karta hai</span>
    <span class="tp">Page&lt;EmailThread&gt;</span> <span class="fn">getByLabel</span>(<span class="tp">Long</span> userId,
        <span class="tp">String</span> labelId, <span class="tp">int</span> page, <span class="tp">int</span> size)

    <span class="cm">// unread count return karta hai (label-wise)</span>
    <span class="tp">Map&lt;String, Integer&gt;</span> <span class="fn">getUnreadCounts</span>(
        <span class="tp">Long</span> userId)

    <span class="cm">// email ko read/unread mark karta hai</span>
    <span class="kw">void</span> <span class="fn">markAsRead</span>(<span class="tp">String</span> emailId, <span class="tp">Long</span> userId)

    <span class="cm">// email star/unstar toggle karta hai</span>
    <span class="kw">void</span> <span class="fn">toggleStar</span>(<span class="tp">String</span> emailId, <span class="tp">Long</span> userId)

    <span class="cm">// email archive karta hai (inbox se hatata hai)</span>
    <span class="kw">void</span> <span class="fn">archive</span>(<span class="tp">String</span> emailId, <span class="tp">Long</span> userId)
}
</pre></div>
        </div>
        <div class="service-card">
            <h3>ThreadService</h3>
            <p class="svc-desc">Email conversation threading handle karta hai — In-Reply-To header se related emails group hote hai</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">ThreadService</span> {

    <span class="cm">// thread ke saare emails fetch karta hai</span>
    <span class="tp">List&lt;Email&gt;</span> <span class="fn">getThread</span>(<span class="tp">String</span> threadId,
        <span class="tp">Long</span> userId)

    <span class="cm">// naya email thread me add karta hai (reply pe)</span>
    <span class="kw">void</span> <span class="fn">addToThread</span>(<span class="tp">String</span> threadId,
        <span class="tp">String</span> emailId)

    <span class="cm">// email ka thread find karta hai (In-Reply-To header se)</span>
    <span class="tp">String</span> <span class="fn">findThread</span>(<span class="tp">String</span> inReplyTo,
        <span class="tp">String</span> subject)
}
</pre></div>
        </div>
        <div class="service-card">
            <h3>SpamService</h3>
            <p class="svc-desc">Spam detection handle karta hai — ML classifier, SPF/DKIM/DMARC check, content analysis, sender reputation</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">SpamService</span> {

    <span class="cm">// email ka spam score calculate karta hai</span>
    <span class="tp">SpamResult</span> <span class="fn">classify</span>(<span class="tp">Email</span> email)

    <span class="cm">// SPF, DKIM, DMARC authentication check</span>
    <span class="tp">AuthResult</span> <span class="fn">authenticateSender</span>(
        <span class="tp">String</span> senderDomain, <span class="tp">String</span> rawHeaders)

    <span class="cm">// user report spam karta hai (model training ke liye)</span>
    <span class="kw">void</span> <span class="fn">reportSpam</span>(<span class="tp">String</span> emailId, <span class="tp">Long</span> userId)

    <span class="cm">// not spam mark karta hai (false positive fix)</span>
    <span class="kw">void</span> <span class="fn">markNotSpam</span>(<span class="tp">String</span> emailId, <span class="tp">Long</span> userId)
}
</pre></div>
        </div>
        <div class="service-card">
            <h3>AttachmentService</h3>
            <p class="svc-desc">File attachments upload, download aur virus scan handle karta hai — S3 pe store, 25MB limit</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">AttachmentService</span> {

    <span class="cm">// attachment upload karta hai S3 pe</span>
    <span class="tp">Attachment</span> <span class="fn">upload</span>(<span class="tp">MultipartFile</span> file,
        <span class="tp">Long</span> userId)

    <span class="cm">// download URL generate karta hai</span>
    <span class="tp">String</span> <span class="fn">getDownloadUrl</span>(<span class="tp">String</span> attachmentId,
        <span class="tp">Long</span> userId)

    <span class="cm">// virus scan karta hai upload ke baad</span>
    <span class="tp">ScanResult</span> <span class="fn">virusScan</span>(<span class="tp">String</span> attachmentId)
}
</pre></div>
        </div>
        <div class="service-card">
            <h3>LabelService</h3>
            <p class="svc-desc">System + custom labels manage karta hai — email pe label add/remove, label CRUD</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">LabelService</span> {

    <span class="cm">// custom label create karta hai</span>
    <span class="tp">Label</span> <span class="fn">create</span>(<span class="tp">Long</span> userId, <span class="tp">String</span> name,
        <span class="tp">String</span> color)

    <span class="cm">// email pe label add karta hai</span>
    <span class="kw">void</span> <span class="fn">addLabel</span>(<span class="tp">String</span> emailId,
        <span class="tp">String</span> labelId, <span class="tp">Long</span> userId)

    <span class="cm">// email se label remove karta hai</span>
    <span class="kw">void</span> <span class="fn">removeLabel</span>(<span class="tp">String</span> emailId,
        <span class="tp">String</span> labelId, <span class="tp">Long</span> userId)

    <span class="cm">// user ke saare labels list karta hai</span>
    <span class="tp">List&lt;Label&gt;</span> <span class="fn">getLabels</span>(<span class="tp">Long</span> userId)
}
</pre></div>
        </div>
        <div class="service-card">
            <h3>SearchService</h3>
            <p class="svc-desc">Elasticsearch pe email search — from:, to:, subject:, body, has:attachment operators support</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">SearchService</span> {

    <span class="cm">// emails search karta hai with Gmail operators</span>
    <span class="tp">Page&lt;Email&gt;</span> <span class="fn">search</span>(<span class="tp">Long</span> userId,
        <span class="tp">String</span> query, <span class="tp">int</span> page, <span class="tp">int</span> size)

    <span class="cm">// naye email ko search index me add karta hai</span>
    <span class="kw">void</span> <span class="fn">indexEmail</span>(<span class="tp">Email</span> email)

    <span class="cm">// autocomplete suggestions (contacts + recent searches)</span>
    <span class="tp">List&lt;String&gt;</span> <span class="fn">autoSuggest</span>(<span class="tp">String</span> prefix,
        <span class="tp">Long</span> userId)
}
</pre></div>
        </div>
        <div class="service-card">
            <h3>DraftService</h3>
            <p class="svc-desc">Draft auto-save handle karta hai — har 2 sec me save, multiple drafts manage</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">DraftService</span> {

    <span class="cm">// naya draft create karta hai</span>
    <span class="tp">Draft</span> <span class="fn">create</span>(<span class="tp">Long</span> userId)

    <span class="cm">// draft auto-save karta hai (debounced)</span>
    <span class="tp">Draft</span> <span class="fn">save</span>(<span class="tp">String</span> draftId,
        <span class="tp">DraftContent</span> content)

    <span class="cm">// draft se email send karta hai</span>
    <span class="tp">Email</span> <span class="fn">sendDraft</span>(<span class="tp">String</span> draftId, <span class="tp">Long</span> userId)

    <span class="cm">// draft delete karta hai</span>
    <span class="kw">void</span> <span class="fn">delete</span>(<span class="tp">String</span> draftId, <span class="tp">Long</span> userId)
}
</pre></div>
        </div>
        <div class="service-card">
            <h3>FilterService</h3>
            <p class="svc-desc">Email filters/rules create aur apply karta hai — incoming emails pe automatic actions (label, archive, delete, forward)</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">FilterService</span> {

    <span class="cm">// filter rule create karta hai</span>
    <span class="tp">Filter</span> <span class="fn">createFilter</span>(<span class="tp">Long</span> userId,
        <span class="tp">FilterCriteria</span> criteria,
        <span class="tp">List&lt;FilterAction&gt;</span> actions)

    <span class="cm">// incoming email pe matching filters apply karta hai</span>
    <span class="kw">void</span> <span class="fn">applyFilters</span>(<span class="tp">Email</span> email, <span class="tp">Long</span> userId)

    <span class="cm">// user ke saare filters list karta hai</span>
    <span class="tp">List&lt;Filter&gt;</span> <span class="fn">getFilters</span>(<span class="tp">Long</span> userId)

    <span class="cm">// filter delete karta hai</span>
    <span class="kw">void</span> <span class="fn">deleteFilter</span>(<span class="tp">String</span> filterId, <span class="tp">Long</span> userId)
}
</pre></div>
        </div>
        <div class="service-card">
            <h3>ContactService</h3>
            <p class="svc-desc">Address book manage karta hai &mdash; contacts add/edit/delete, autocomplete suggestions aur contact groups handle karta hai</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">ContactService</span> {

    <span class="cm">// naya contact add karta hai address book me</span>
    <span class="tp">Contact</span> <span class="fn">addContact</span>(<span class="tp">Long</span> userId,
        <span class="tp">String</span> name, <span class="tp">String</span> email)

    <span class="cm">// email compose me autocomplete suggestions deta hai</span>
    <span class="tp">List&lt;Contact&gt;</span> <span class="fn">suggest</span>(<span class="tp">Long</span> userId,
        <span class="tp">String</span> prefix)

    <span class="cm">// user ke saare contacts paginated return karta hai</span>
    <span class="tp">Page&lt;Contact&gt;</span> <span class="fn">getContacts</span>(<span class="tp">Long</span> userId,
        <span class="tp">int</span> page, <span class="tp">int</span> size)

    <span class="cm">// contact details update karta hai</span>
    <span class="tp">Contact</span> <span class="fn">updateContact</span>(<span class="tp">Long</span> contactId,
        <span class="tp">String</span> name, <span class="tp">String</span> email)

    <span class="cm">// contact delete karta hai</span>
    <span class="kw">void</span> <span class="fn">deleteContact</span>(<span class="tp">Long</span> contactId,
        <span class="tp">Long</span> userId)
}
</pre></div>
        </div>
        <div class="service-card">
            <h3>NotificationService</h3>
            <p class="svc-desc">New email aane pe push notification bhejta hai &mdash; FCM/APNs se mobile pe aur WebSocket se browser pe real-time notify karta hai</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">NotificationService</span> {

    <span class="cm">// naye email ki push notification bhejta hai</span>
    <span class="kw">void</span> <span class="fn">notifyNewEmail</span>(<span class="tp">Long</span> userId,
        <span class="tp">EmailSummary</span> email)

    <span class="cm">// device token register karta hai push ke liye</span>
    <span class="kw">void</span> <span class="fn">registerDevice</span>(<span class="tp">Long</span> userId,
        <span class="tp">String</span> deviceToken, <span class="tp">String</span> platform)

    <span class="cm">// notification preferences update karta hai</span>
    <span class="kw">void</span> <span class="fn">updatePreferences</span>(<span class="tp">Long</span> userId,
        <span class="kw">boolean</span> pushEnabled,
        <span class="kw">boolean</span> desktopEnabled)

    <span class="cm">// WebSocket se real-time inbox update push karta hai</span>
    <span class="kw">void</span> <span class="fn">pushRealtimeUpdate</span>(<span class="tp">Long</span> userId,
        <span class="tp">InboxEvent</span> event)
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
            <div class="api-header"><span class="api-method method-post">POST</span><span class="api-path">/api/v1/emails/send</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Request</div>{
  "to": ["rahul@gmail.com"],
  "cc": ["priya@gmail.com"],
  "bcc": [],
  "subject": "System Design Notes",
  "body": "&lt;p&gt;Hi, please find the notes attached.&lt;/p&gt;",
  "attachmentIds": ["att-001"],
  "threadId": null,
  "undoWindowSec": 30
}</div>
                <div class="api-json"><div class="label">Response 202</div>{
  "emailId": "em-abc123",
  "threadId": "th-new-001",
  "status": "QUEUED",
  "undoDeadline": "2025-06-15T10:00:30Z",
  "message": "Email queued. Undo available for 30 seconds."
}</div>
            </div>
            <div class="api-note">Email send queue me jaata hai — 30 sec undo window ke baad SMTP se actually deliver hota hai. HTML body allowed hai. 202 Accepted (async processing)</div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-get">GET</span><span class="api-path">/api/v1/inbox?category=PRIMARY&amp;page=1&amp;size=50</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Response 200</div>{
  "threads": [
    {
      "threadId": "th-001",
      "subject": "Re: Sprint Planning",
      "snippet": "Sure, let's schedule for tomorrow...",
      "from": { "name": "Rahul", "email": "rahul@gmail.com" },
      "participants": 3,
      "messageCount": 5,
      "hasAttachments": true,
      "isStarred": false,
      "isRead": false,
      "labels": ["INBOX", "work"],
      "lastMessageAt": "2025-06-15T09:45:00Z"
    }
  ],
  "unreadCount": { "PRIMARY": 12, "SOCIAL": 45, "PROMOTIONS": 120 },
  "nextPageToken": "eyJwYWdlIjoy..."
}</div>
            </div>
            <div class="api-note">Inbox threads return karta hai category-wise — Primary tab default, snippet last message ka preview hai. Unread counts sab tabs ke saath aate hai</div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-get">GET</span><span class="api-path">/api/v1/threads/{threadId}</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Response 200</div>{
  "threadId": "th-001",
  "subject": "Sprint Planning",
  "messages": [
    {
      "emailId": "em-001",
      "from": { "name": "Rahul", "email": "rahul@gmail.com" },
      "to": ["team@company.com"],
      "body": "&lt;p&gt;Let's plan the sprint...&lt;/p&gt;",
      "attachments": [],
      "timestamp": "2025-06-15T08:00:00Z"
    },
    {
      "emailId": "em-002",
      "from": { "name": "Priya", "email": "priya@gmail.com" },
      "body": "&lt;p&gt;Sure, let's schedule for tomorrow&lt;/p&gt;",
      "timestamp": "2025-06-15T09:45:00Z"
    }
  ]
}</div>
            </div>
            <div class="api-note">Thread ke saare emails chronological order me — conversation view dikhata hai. Thread open karte hi sab unread messages read mark ho jaate hai</div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-get">GET</span><span class="api-path">/api/v1/search?q=from:rahul+has:attachment+after:2025-06-01</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Response 200</div>{
  "results": [
    { "threadId": "th-001", "subject": "Sprint Planning",
      "snippet": "...attached the document...",
      "matchedIn": ["body", "attachments"],
      "from": "rahul@gmail.com",
      "date": "2025-06-15T08:00:00Z" }
  ],
  "totalResults": 3,
  "searchTime": "0.12s"
}</div>
            </div>
            <div class="api-note">Gmail search operators support — from:, to:, subject:, has:attachment, before:, after:, is:unread, label:, in:inbox. Elasticsearch se &lt; 200ms me results</div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-post">POST</span><span class="api-path">/api/v1/emails/{emailId}/labels</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Request</div>{
  "addLabels": ["Important", "work"],
  "removeLabels": ["INBOX"]
}</div>
                <div class="api-json"><div class="label">Response 200</div>{
  "emailId": "em-abc123",
  "labels": ["Important", "work", "SENT"]
}</div>
            </div>
            <div class="api-note">Email pe labels add/remove karta hai — "INBOX" remove = archive. Multiple labels ek saath add/remove ho sakte hai. System labels (SENT, DRAFTS) user remove nahi kar sakta</div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-post">POST</span><span class="api-path">/api/v1/filters</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Request</div>{
  "criteria": {
    "from": "newsletter@company.com",
    "subject": null,
    "hasAttachment": false
  },
  "actions": [
    { "type": "LABEL", "value": "Newsletters" },
    { "type": "ARCHIVE" },
    { "type": "MARK_READ" }
  ]
}</div>
                <div class="api-json"><div class="label">Response 201</div>{
  "filterId": "filter-001",
  "criteria": { "from": "newsletter@company.com" },
  "actions": ["LABEL:Newsletters", "ARCHIVE", "MARK_READ"],
  "createdAt": "2025-06-15T10:00:00Z"
}</div>
            </div>
            <div class="api-note">Auto-organize filter create karta hai — matching incoming emails pe automatically actions apply honge. Multiple actions ek filter me combine ho sakti hai</div>
        </div>
    </div>
</div>

<!-- ============ 6. DATABASE SCHEMA ============ -->
<div class="section theme-pink">
    <div class="section-title"><span class="section-num">6</span>Database Schema</div>
    <div class="dbtech-grid">
        <div class="dbtech-card">
            <div class="dbtech-name">PostgreSQL <span class="dbtech-type">RDBMS</span></div>
            <div class="dbtech-usage">Users, emails, threads, labels, contacts, filters — ACID transactions ke liye</div>
            <div class="dbtech-tables"><span>users</span><span>emails</span><span>threads</span><span>labels</span><span>contacts</span><span>filters</span></div>
        </div>
        <div class="dbtech-card">
            <div class="dbtech-name">Redis <span class="dbtech-type">Cache</span></div>
            <div class="dbtech-usage">Unread counts, session cache, undo queue (30 sec TTL), rate limiting</div>
            <div class="dbtech-tables"><span>unread:{userId}</span><span>undo:{emailId}</span><span>session:{token}</span></div>
        </div>
        <div class="dbtech-card">
            <div class="dbtech-name">Elasticsearch <span class="dbtech-type">Search</span></div>
            <div class="dbtech-usage">Full-text email search — subject, body, from, to with Gmail operators</div>
            <div class="dbtech-tables"><span>emails_index</span></div>
        </div>
        <div class="dbtech-card">
            <div class="dbtech-name">S3 <span class="dbtech-type">Object Storage</span></div>
            <div class="dbtech-usage">Email attachments, large email bodies — content-addressable for dedup</div>
            <div class="dbtech-tables"><span>attachments/</span><span>email-bodies/</span></div>
        </div>
    </div>
    <div class="db-grid">
        <div class="db-table">
            <h3>users</h3>
            <ul>
                <li><span class="pk">id BIGINT (PK)</span></li>
                <li>email VARCHAR(255) UNIQUE</li>
                <li>name VARCHAR(100)</li>
                <li>avatar_url VARCHAR(500)</li>
                <li>storage_used BIGINT DEFAULT 0</li>
                <li>storage_limit BIGINT DEFAULT 16106127360</li>
                <li>created_at TIMESTAMP</li>
                <li><span class="idx">INDEX idx_email (email)</span></li>
            </ul>
        </div>
        <div class="db-table">
            <h3>emails</h3>
            <ul>
                <li><span class="pk">id VARCHAR(36) (PK)</span></li>
                <li><span class="fk">sender_id BIGINT (FK &rarr; users.id)</span></li>
                <li><span class="fk">thread_id VARCHAR(36) (FK &rarr; threads.id)</span></li>
                <li>message_id VARCHAR(255) UNIQUE</li>
                <li>in_reply_to VARCHAR(255) NULL</li>
                <li>from_email VARCHAR(255)</li>
                <li>to_emails JSON</li>
                <li>cc_emails JSON</li>
                <li>bcc_emails JSON</li>
                <li>subject VARCHAR(500)</li>
                <li>body_preview VARCHAR(200)</li>
                <li>body_storage_key VARCHAR(255)</li>
                <li>has_attachments BOOLEAN DEFAULT false</li>
                <li>status ENUM('DRAFT','QUEUED','SENT','DELIVERED','BOUNCED')</li>
                <li>spam_verdict ENUM('CLEAN','SPAM','PHISHING') DEFAULT 'CLEAN'</li>
                <li>category ENUM('PRIMARY','SOCIAL','PROMOTIONS','UPDATES')</li>
                <li>size_bytes BIGINT</li>
                <li>sent_at TIMESTAMP</li>
                <li>created_at TIMESTAMP</li>
                <li><span class="idx">INDEX idx_thread (thread_id)</span></li>
                <li><span class="idx">INDEX idx_sender (sender_id, sent_at DESC)</span></li>
                <li><span class="idx">INDEX idx_message_id (message_id)</span></li>
            </ul>
        </div>
        <div class="db-table">
            <h3>threads</h3>
            <ul>
                <li><span class="pk">id VARCHAR(36) (PK)</span></li>
                <li>subject VARCHAR(500)</li>
                <li>message_count INT DEFAULT 1</li>
                <li>last_message_at TIMESTAMP</li>
                <li>created_at TIMESTAMP</li>
            </ul>
        </div>
        <div class="db-table">
            <h3>email_recipients</h3>
            <ul>
                <li><span class="pk">id BIGINT (PK)</span></li>
                <li><span class="fk">email_id VARCHAR(36) (FK &rarr; emails.id)</span></li>
                <li><span class="fk">user_id BIGINT (FK &rarr; users.id)</span></li>
                <li>is_read BOOLEAN DEFAULT false</li>
                <li>is_starred BOOLEAN DEFAULT false</li>
                <li>is_archived BOOLEAN DEFAULT false</li>
                <li>is_trashed BOOLEAN DEFAULT false</li>
                <li>category ENUM('PRIMARY','SOCIAL','PROMOTIONS','UPDATES')</li>
                <li>read_at TIMESTAMP NULL</li>
                <li><span class="idx">INDEX idx_user_inbox (user_id, is_trashed, is_archived, category)</span></li>
                <li><span class="idx">INDEX idx_unread (user_id, is_read)</span></li>
            </ul>
        </div>
        <div class="db-table">
            <h3>email_labels</h3>
            <ul>
                <li><span class="pk">id BIGINT (PK)</span></li>
                <li><span class="fk">email_id VARCHAR(36) (FK &rarr; emails.id)</span></li>
                <li><span class="fk">label_id VARCHAR(36) (FK &rarr; labels.id)</span></li>
                <li><span class="fk">user_id BIGINT (FK &rarr; users.id)</span></li>
                <li><span class="idx">UNIQUE idx_email_label (email_id, label_id, user_id)</span></li>
            </ul>
        </div>
        <div class="db-table">
            <h3>attachments</h3>
            <ul>
                <li><span class="pk">id VARCHAR(36) (PK)</span></li>
                <li><span class="fk">email_id VARCHAR(36) (FK &rarr; emails.id)</span></li>
                <li>file_name VARCHAR(255)</li>
                <li>mime_type VARCHAR(100)</li>
                <li>size_bytes BIGINT</li>
                <li>storage_key VARCHAR(255)</li>
                <li>content_hash VARCHAR(64)</li>
                <li><span class="idx">INDEX idx_email_att (email_id)</span></li>
            </ul>
        </div>
    </div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">SQL &mdash; Core Queries</span></div><pre class="code-block">
<span class="cm">-- Inbox fetch (Primary tab, unread first, then by date)</span>
<span class="kw">SELECT</span> e.id, e.subject, e.body_preview, e.from_email, e.sent_at,
    er.is_read, er.is_starred, e.has_attachments, e.thread_id
<span class="kw">FROM</span> emails e
<span class="kw">JOIN</span> email_recipients er <span class="kw">ON</span> e.id = er.email_id
<span class="kw">WHERE</span> er.user_id = :userId <span class="kw">AND</span> er.is_trashed = false
    <span class="kw">AND</span> er.is_archived = false <span class="kw">AND</span> er.category = 'PRIMARY'
<span class="kw">ORDER BY</span> er.is_read ASC, e.sent_at <span class="kw">DESC</span>
<span class="kw">LIMIT</span> :size <span class="kw">OFFSET</span> :offset;

<span class="cm">-- Thread ke emails fetch karo (conversation view)</span>
<span class="kw">SELECT</span> e.* <span class="kw">FROM</span> emails e
<span class="kw">WHERE</span> e.thread_id = :threadId
<span class="kw">ORDER BY</span> e.sent_at ASC;

<span class="cm">-- Unread count per category</span>
<span class="kw">SELECT</span> er.category, COUNT(*) as unread
<span class="kw">FROM</span> email_recipients er
<span class="kw">WHERE</span> er.user_id = :userId <span class="kw">AND</span> er.is_read = false
    <span class="kw">AND</span> er.is_trashed = false <span class="kw">AND</span> er.is_archived = false
<span class="kw">GROUP BY</span> er.category;

<span class="cm">-- Thread find karo by In-Reply-To header</span>
<span class="kw">SELECT</span> thread_id <span class="kw">FROM</span> emails
<span class="kw">WHERE</span> message_id = :inReplyTo <span class="kw">LIMIT</span> 1;
</pre></div>
</div>

<!-- ============ 7. EMAIL PROTOCOLS ============ -->
<div class="section theme-blue">
    <div class="section-title"><span class="section-num">7</span>Architecture &mdash; Email Protocols (SMTP / IMAP)</div>
    <div class="service-grid">
        <div class="service-card">
            <h3>SMTP (Simple Mail Transfer Protocol)</h3>
            <p class="svc-desc">Email SEND karne ke liye — server-to-server communication, MX record se destination pata chalta hai</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">SMTP Flow</span></div><pre class="code-block">
<span class="cm">// User sends email: rahul@gmail.com &rarr; priya@yahoo.com</span>

<span class="cm">// Step 1: Client &rarr; Gmail SMTP Server (port 587, TLS)</span>
EHLO gmail.com
AUTH LOGIN (JWT token)
MAIL FROM: &lt;rahul@gmail.com&gt;
RCPT TO: &lt;priya@yahoo.com&gt;
DATA
  From: rahul@gmail.com
  To: priya@yahoo.com
  Subject: Hello!
  Message body here...
.
QUIT

<span class="cm">// Step 2: Gmail SMTP looks up MX record for yahoo.com</span>
dig MX yahoo.com
<span class="cm">// Answer: mx1.yahoo.com (priority 10)</span>

<span class="cm">// Step 3: Gmail SMTP &rarr; Yahoo SMTP (port 25, TLS)</span>
<span class="cm">// Same SMTP conversation, server-to-server</span>

<span class="cm">// Step 4: Yahoo delivers to priya's mailbox</span>
<span class="cm">// If Yahoo is down: Gmail retries with exponential backoff</span>
<span class="cm">// Retry: 1 min, 5 min, 30 min, 2 hr, 12 hr (up to 5 days)</span>
</pre></div>
        </div>
        <div class="service-card">
            <h3>SPF / DKIM / DMARC (Anti-spoofing)</h3>
            <p class="svc-desc">Email spoofing rokne ke 3 layers — sender verification ke bina koi bhi kisi bhi email se bhej sakta tha</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Email Authentication</span></div><pre class="code-block">
<span class="cm">// SPF (Sender Policy Framework)</span>
<span class="cm">// DNS TXT record batata hai ki kaunse servers gmail.com</span>
<span class="cm">// se email bhej sakte hai</span>
gmail.com TXT "v=spf1 include:_spf.google.com ~all"
<span class="cm">// Receiving server checks: kya sender IP allowed hai?</span>
<span class="cm">// PASS = legitimate, FAIL = forged sender</span>

<span class="cm">// DKIM (DomainKeys Identified Mail)</span>
<span class="cm">// Sender email ko digitally sign karta hai (private key)</span>
<span class="cm">// Receiver DNS se public key le ke verify karta hai</span>
DKIM-Signature: d=gmail.com; s=20230601; b=abc123...
<span class="cm">// PASS = email tampered nahi hua transit me</span>

<span class="cm">// DMARC (Domain-based Message Auth)</span>
<span class="cm">// SPF + DKIM dono fail ho to kya kare? DMARC batata hai</span>
_dmarc.gmail.com TXT "v=DMARC1; p=reject; rua=..."
<span class="cm">// p=reject: fail emails reject karo</span>
<span class="cm">// p=quarantine: spam folder me daalo</span>
<span class="cm">// p=none: report karo but deliver karo</span>
</pre></div>
        </div>
    </div>
</div>

<!-- ============ 8. SPAM DETECTION ============ -->
<div class="section theme-green">
    <div class="section-title"><span class="section-num">8</span>Spam Detection &amp; Filtering</div>
    <div class="service-grid">
        <div class="service-card">
            <h3>Multi-Layer Spam Filter</h3>
            <p class="svc-desc">Gmail ka 99.9% spam detection — multiple layers of checks, ML classifier final decision leta hai</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Spam Pipeline</span></div><pre class="code-block">
<span class="cm">// LAYER 1: Connection-level checks</span>
<span class="cm">// - IP reputation (known spam server?)</span>
<span class="cm">// - DNS blacklist (DNSBL) check</span>
<span class="cm">// - Rate limiting (too many emails from same IP?)</span>

<span class="cm">// LAYER 2: Authentication checks</span>
<span class="cm">// - SPF verification (authorized sender?)</span>
<span class="cm">// - DKIM signature verification (tampered?)</span>
<span class="cm">// - DMARC policy check</span>
<span class="cm">// Fail = high spam score</span>

<span class="cm">// LAYER 3: Content analysis</span>
<span class="cm">// - Subject line keywords ("FREE", "WINNER", "ACT NOW")</span>
<span class="cm">// - URL analysis (shortened links, known phishing domains)</span>
<span class="cm">// - HTML ratio (too many images, hidden text)</span>
<span class="cm">// - Attachment scan (malware, executable files)</span>

<span class="cm">// LAYER 4: ML Classifier (final decision)</span>
<span class="cm">// - Trained on billions of user "Report Spam" actions</span>
<span class="cm">// - Features: sender history, content, user behavior</span>
<span class="cm">// - Output: spam_score 0.0 to 1.0</span>
<span class="cm">// - Threshold: > 0.7 = SPAM, > 0.9 = PHISHING</span>

<span class="cm">// LAYER 5: User-level personalization</span>
<span class="cm">// - User ne pehle is sender ko spam mark kiya?</span>
<span class="cm">// - User ke contacts me hai ye sender?</span>
<span class="cm">// - Similar emails user ne pehle kya kiya? (read/delete/spam)</span>
</pre></div>
        </div>
    </div>
</div>

<!-- ============ 9. EMAIL THREADING ============ -->
<div class="section theme-purple">
    <div class="section-title"><span class="section-num">9</span>Email Threading &amp; Categorization</div>
    <div class="service-grid">
        <div class="service-card">
            <h3>Threading via Headers</h3>
            <p class="svc-desc">In-Reply-To aur References headers se related emails ek thread me group hote hai</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Threading Mechanism</span></div><pre class="code-block">
<span class="cm">// EMAIL 1 (Original)</span>
Message-ID: &lt;msg-001@gmail.com&gt;
Subject: Sprint Planning
<span class="cm">// No In-Reply-To (first email in thread)</span>

<span class="cm">// EMAIL 2 (Reply)</span>
Message-ID: &lt;msg-002@gmail.com&gt;
In-Reply-To: &lt;msg-001@gmail.com&gt;
References: &lt;msg-001@gmail.com&gt;
Subject: Re: Sprint Planning

<span class="cm">// EMAIL 3 (Reply to reply)</span>
Message-ID: &lt;msg-003@gmail.com&gt;
In-Reply-To: &lt;msg-002@gmail.com&gt;
References: &lt;msg-001@gmail.com&gt; &lt;msg-002@gmail.com&gt;
Subject: Re: Re: Sprint Planning

<span class="cm">// THREADING ALGORITHM:</span>
<span class="cm">// 1. Check In-Reply-To header &rarr; find parent email</span>
<span class="cm">// 2. Parent ka thread_id = is email ka thread_id</span>
<span class="cm">// 3. No In-Reply-To? Check subject (Re: stripped match)</span>
<span class="cm">// 4. No match? Create new thread</span>
</pre></div>
        </div>
        <div class="service-card">
            <h3>Gmail Tabs (ML Categorization)</h3>
            <p class="svc-desc">ML model automatically emails ko Primary, Social, Promotions, Updates me categorize karta hai</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Category Classification</span></div><pre class="code-block">
<span class="cm">// PRIMARY: Person-to-person emails</span>
<span class="cm">// Signals: known contact, personal domain, conversational tone</span>

<span class="cm">// SOCIAL: Social network notifications</span>
<span class="cm">// Signals: from facebook.com, twitter.com, linkedin.com</span>
<span class="cm">// Headers: List-Unsubscribe present, bulk sender</span>

<span class="cm">// PROMOTIONS: Marketing, deals, offers</span>
<span class="cm">// Signals: promotional keywords, HTML-heavy, images</span>
<span class="cm">// Headers: X-Mailer (Mailchimp, SendGrid)</span>

<span class="cm">// UPDATES: Bills, receipts, confirmations</span>
<span class="cm">// Signals: order confirmation, bank statement, OTP</span>
<span class="cm">// From: noreply@, transactional content</span>

<span class="cm">// ML Model trains on:</span>
<span class="cm">// - User's move actions (drag email to different tab)</span>
<span class="cm">// - Sender domain patterns</span>
<span class="cm">// - Email content features</span>
<span class="cm">// - Global aggregate signals (what do most users do?)</span>
</pre></div>
        </div>
    </div>
</div>

<!-- ============ 10. SEARCH ARCHITECTURE ============ -->
<div class="section theme-yellow">
    <div class="section-title"><span class="section-num">10</span>Search Architecture</div>
    <div class="service-grid">
        <div class="service-card">
            <h3>Gmail Search Operators</h3>
            <p class="svc-desc">Elasticsearch pe custom query parser — Gmail ke special operators ko ES queries me convert karta hai</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Search Engine</span></div><pre class="code-block">
<span class="cm">// Gmail search operators &rarr; Elasticsearch queries</span>

<span class="cm">// from:rahul &rarr; { "term": { "from": "rahul" } }</span>
<span class="cm">// to:priya &rarr; { "term": { "to": "priya" } }</span>
<span class="cm">// subject:meeting &rarr; { "match": { "subject": "meeting" } }</span>
<span class="cm">// has:attachment &rarr; { "term": { "has_attachments": true } }</span>
<span class="cm">// is:unread &rarr; { "term": { "is_read": false } }</span>
<span class="cm">// before:2025/06/01 &rarr; { "range": { "sent_at": { "lt": "..." } } }</span>
<span class="cm">// after:2025/06/01 &rarr; { "range": { "sent_at": { "gt": "..." } } }</span>
<span class="cm">// label:work &rarr; filter by label_id join</span>
<span class="cm">// in:inbox &rarr; is_archived=false AND is_trashed=false</span>

<span class="cm">// Combined: from:rahul has:attachment after:2025/06/01</span>
<span class="cm">// = bool query with must clauses for each operator</span>

<span class="cm">// INDEXING: Every email indexed on receive</span>
<span class="cm">// Fields: from, to, cc, subject, body (stripped HTML)</span>
<span class="cm">// Near real-time: available in search within 1-2 sec</span>
</pre></div>
        </div>
    </div>
</div>

<!-- ============ 11. COMPLETE FLOW ============ -->
<div class="section theme-teal">
    <div class="section-title"><span class="section-num">11</span>Complete Email Flow &mdash; End to End</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Email Lifecycle</span></div><pre class="code-block">
<span class="cm">// ===== SENDING (Outbound) =====</span>
User clicks Send &rarr; POST /emails/send
    &rarr; Email saved in DB (status: QUEUED)
    &rarr; Redis: undo key with 30-sec TTL
    &rarr; Attachments: verify uploaded, link to email
    &rarr; After 30 sec (undo window expired):
        &rarr; SMTP Outbound Worker picks up
        &rarr; DNS: MX record lookup for recipient domain
        &rarr; SMTP: connect to recipient mail server (TLS)
        &rarr; DKIM: sign email with private key
        &rarr; Deliver email &rarr; status: SENT
        &rarr; Save to Sent folder
        &rarr; If delivery fails: retry with exponential backoff

<span class="cm">// ===== RECEIVING (Inbound) =====</span>
External SMTP server connects to Gmail MX (port 25)
    &rarr; Connection check: IP reputation, rate limit
    &rarr; SPF check: is sender authorized?
    &rarr; Receive email data via SMTP protocol
    &rarr; DKIM verification: signature valid?
    &rarr; DMARC check: SPF + DKIM align with domain?

<span class="cm">// ===== PROCESSING =====</span>
    &rarr; Spam classification (ML model, score 0.0-1.0)
    &rarr; Phishing detection (URL analysis, content check)
    &rarr; Virus scan on attachments
    &rarr; Category classification (Primary/Social/Promotions)
    &rarr; Thread matching (In-Reply-To header lookup)
    &rarr; Filter rules apply (user's custom filters)
    &rarr; Save email to PostgreSQL + attachments to S3
    &rarr; Index in Elasticsearch (near real-time)
    &rarr; Update unread count in Redis

<span class="cm">// ===== NOTIFICATION =====</span>
    &rarr; If not spam/muted:
        &rarr; Push notification to mobile (FCM/APNs)
        &rarr; Desktop notification (WebSocket)
        &rarr; Badge count update
    &rarr; If filter says "archive": skip notification

<span class="cm">// ===== USER READS =====</span>
User opens inbox &rarr; GET /inbox (category: PRIMARY)
    &rarr; Threads sorted by last message time
    &rarr; Click thread &rarr; GET /threads/{id}
    &rarr; Mark as read &rarr; update is_read, decrement unread count
</pre></div>
</div>

<!-- ============ 12. COMPARISONS ============ -->
<div class="section theme-pink">
    <div class="section-title"><span class="section-num">12</span>Gmail vs Outlook vs Yahoo Mail &mdash; Key Differences</div>
    <div class="service-grid">
        <div class="service-card">
            <h3>Gmail</h3>
            <p class="svc-desc">Google ecosystem — 15GB free, best spam filter, category tabs</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Gmail</span></div><pre class="code-block">
<span class="cm">// 15GB free (shared with Drive + Photos)</span>
<span class="cm">// Category tabs (Primary, Social, Promotions)</span>
<span class="cm">// Best spam filter (99.9% accuracy)</span>
<span class="cm">// Labels (not folders) — one email, multiple labels</span>
<span class="cm">// Undo send (30 sec window)</span>
<span class="cm">// Smart Reply / Smart Compose (AI)</span>
<span class="cm">// Google Workspace integration</span>
<span class="cm">// 1.8B active users</span>
</pre></div>
        </div>
        <div class="service-card">
            <h3>Outlook</h3>
            <p class="svc-desc">Microsoft ecosystem — calendar integration, Focused Inbox, enterprise-grade</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Outlook</span></div><pre class="code-block">
<span class="cm">// 15GB free storage</span>
<span class="cm">// Focused Inbox (2 tabs: Focused + Other)</span>
<span class="cm">// Calendar + Tasks built-in</span>
<span class="cm">// Microsoft 365 integration</span>
<span class="cm">// Folders-based (traditional, not labels)</span>
<span class="cm">// Rules engine (powerful auto-organize)</span>
<span class="cm">// Exchange ActiveSync (enterprise)</span>
<span class="cm">// 400M+ active users</span>
</pre></div>
        </div>
        <div class="service-card">
            <h3>Yahoo Mail</h3>
            <p class="svc-desc">Generous free storage — 1TB free, disposable addresses</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Yahoo Mail</span></div><pre class="code-block">
<span class="cm">// 1TB free storage (most generous!)</span>
<span class="cm">// Disposable email addresses (spam prevention)</span>
<span class="cm">// Folders-based organization</span>
<span class="cm">// Travel & package tracking built-in</span>
<span class="cm">// Ad-supported free tier</span>
<span class="cm">// Yahoo Calendar integration</span>
<span class="cm">// 225M+ active users</span>
</pre></div>
        </div>
    </div>
</div>

<!-- ============ 13. BOTTLENECKS ============ -->
<div class="section theme-blue">
    <div class="section-title"><span class="section-num">13</span>Bottlenecks &amp; Solutions</div>
    <div class="bottleneck-grid">
        <div class="bottleneck-card"><h3>300B Emails/Day Processing</h3><p>Massive inbound volume. Solution: Horizontal SMTP servers, Kafka for async processing, batch spam classification, sharded storage</p></div>
        <div class="bottleneck-card"><h3>Spam at Scale</h3><p>50%+ of all email is spam. Solution: Multi-layer filtering (IP &rarr; auth &rarr; content &rarr; ML), reject at connection level before processing body</p></div>
        <div class="bottleneck-card"><h3>Search Index Size</h3><p>Years of emails per user = massive index. Solution: Per-user Elasticsearch index partition, time-based index rotation, search recent first</p></div>
        <div class="bottleneck-card"><h3>Attachment Storage Cost</h3><p>Same file attached to 1000 emails. Solution: Content-addressable storage (dedup by hash), compress before storing, S3 lifecycle to Glacier</p></div>
        <div class="bottleneck-card"><h3>Email Delivery Failures</h3><p>Recipient server down. Solution: Exponential backoff retry queue (up to 5 days), bounce notification to sender, fallback MX records</p></div>
        <div class="bottleneck-card"><h3>Undo Send Race Condition</h3><p>User clicks undo at exactly 30 sec. Solution: Redis TTL-based queue, atomic check-and-cancel, QUEUED status prevents premature delivery</p></div>
        <div class="bottleneck-card"><h3>Unread Count Accuracy</h3><p>Multiple devices marking read simultaneously. Solution: Redis atomic counter, eventual consistency OK, batch sync across devices</p></div>
        <div class="bottleneck-card"><h3>Thread Matching Edge Cases</h3><p>Missing In-Reply-To header (old clients). Solution: Fallback to subject matching (strip Re:/Fwd:), same participants + time window heuristic</p></div>
    </div>
</div>

<!-- ============ 14. INTERVIEW TIPS ============ -->
<div class="section theme-green">
    <div class="section-title"><span class="section-num">14</span>Interview Tips &mdash; Key Points</div>
    <div class="service-grid">
        <div class="service-card">
            <h3>Must-Know Concepts</h3>
            <p class="svc-desc">Email system design interview me ye concepts zaroor puchte hai</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Key Talking Points</span></div><pre class="code-block">
<span class="cm">// 1. SMTP for sending, IMAP/POP3 for reading</span>
<span class="cm">// SMTP = push protocol, IMAP = pull protocol</span>
<span class="cm">// MX record DNS lookup for routing</span>

<span class="cm">// 2. SPF + DKIM + DMARC = email security trifecta</span>
<span class="cm">// Without these, anyone can spoof any email address</span>

<span class="cm">// 3. Spam classification is ML, not just rules</span>
<span class="cm">// Trained on user "Report Spam" actions</span>
<span class="cm">// Multi-layer: IP &rarr; auth &rarr; content &rarr; ML &rarr; user</span>

<span class="cm">// 4. Threading = In-Reply-To + References headers</span>
<span class="cm">// Gmail made conversation view mainstream</span>

<span class="cm">// 5. Labels &ne; Folders</span>
<span class="cm">// Label: one email, many labels (many-to-many)</span>
<span class="cm">// Folder: one email, one folder (one-to-many)</span>

<span class="cm">// 6. Undo Send = delayed queue, not actual recall</span>
<span class="cm">// Email sits in queue for 30 sec, then sends</span>

<span class="cm">// 7. Category classification (tabs) is ML-based</span>
<span class="cm">// Trained on sender patterns + user behavior</span>

<span class="cm">// 8. Email is async by design</span>
<span class="cm">// Store-and-forward model, not real-time</span>
<span class="cm">// Retry queue with exponential backoff</span>

<span class="cm">// 9. Attachment dedup saves massive storage</span>
<span class="cm">// Same PDF shared 1000 times = stored once</span>

<span class="cm">// 10. Push notification via IMAP IDLE or WebSocket</span>
<span class="cm">// Long-lived connection for real-time new email alerts</span>
</pre></div>
        </div>
    </div>
</div>
`
}
