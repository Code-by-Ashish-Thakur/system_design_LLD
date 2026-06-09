export default {
  title: "Notification System &mdash; Low Level Design",
  subtitle: "Complete LLD for Java Spring Boot Interview &mdash; Push, Email, SMS &amp; In-App Notifications",
  subtitleColor: "#fce4ec",
  headerGradient: "linear-gradient(135deg,#880e4f,#c2185b,#ff80ab)",
  footerText: "Notification System &mdash; Low Level Design",
  content: `
<!-- ============ 1. FUNCTIONAL REQUIREMENTS ============ -->
<div class="section theme-green">
    <div class="section-title"><span class="section-num">1</span>Functional Requirements</div>
    <div class="req-grid">
        <div class="req-pill"><span class="num">1</span> Send Push Notifications (FCM / APNs)</div>
        <div class="req-pill"><span class="num">2</span> Send Email Notifications (SMTP / SES)</div>
        <div class="req-pill"><span class="num">3</span> Send SMS Notifications (Twilio / SNS)</div>
        <div class="req-pill"><span class="num">4</span> In-App Notification Center</div>
        <div class="req-pill"><span class="num">5</span> Template Engine (dynamic placeholders)</div>
        <div class="req-pill"><span class="num">6</span> Priority-based Delivery (urgent / normal / low)</div>
        <div class="req-pill"><span class="num">7</span> Retry with Exponential Backoff</div>
        <div class="req-pill"><span class="num">8</span> User Preferences (opt-in / opt-out per channel)</div>
        <div class="req-pill"><span class="num">9</span> Rate Limiting per User</div>
        <div class="req-pill"><span class="num">10</span> Scheduled &amp; Batch Notifications</div>
        <div class="req-pill"><span class="num">11</span> Read / Unread Tracking</div>
        <div class="req-pill"><span class="num">12</span> Dead Letter Queue for Failed Deliveries</div>
    </div>
</div>

<!-- ============ 2. CORE ENTITIES ============ -->
<div class="section theme-blue">
    <div class="section-title"><span class="section-num">2</span>Core Entities</div>
    <div class="entity-grid">
        <div class="entity-card">
            <h3>Notification</h3>
            <div class="field"><span class="field-name">id</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">userId</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">channel</span><span class="field-type">NotificationChannel</span></div>
            <div class="field"><span class="field-name">type</span><span class="field-type">NotificationType</span></div>
            <div class="field"><span class="field-name">priority</span><span class="field-type">Priority</span></div>
            <div class="field"><span class="field-name">templateId</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">title</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">body</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">metadata</span><span class="field-type">Map&lt;String,String&gt;</span></div>
            <div class="field"><span class="field-name">status</span><span class="field-type">NotificationStatus</span></div>
            <div class="field"><span class="field-name">retryCount</span><span class="field-type">int</span></div>
            <div class="field"><span class="field-name">scheduledAt</span><span class="field-type">LocalDateTime</span></div>
            <div class="field"><span class="field-name">sentAt</span><span class="field-type">LocalDateTime</span></div>
            <div class="field"><span class="field-name">readAt</span><span class="field-type">LocalDateTime</span></div>
            <div class="field"><span class="field-name">createdAt</span><span class="field-type">LocalDateTime</span></div>
        </div>
        <div class="entity-card">
            <h3>NotificationTemplate</h3>
            <div class="field"><span class="field-name">id</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">name</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">channel</span><span class="field-type">NotificationChannel</span></div>
            <div class="field"><span class="field-name">titleTemplate</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">bodyTemplate</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">placeholders</span><span class="field-type">List&lt;String&gt;</span></div>
            <div class="field"><span class="field-name">active</span><span class="field-type">boolean</span></div>
        </div>
        <div class="entity-card">
            <h3>UserPreference</h3>
            <div class="field"><span class="field-name">id</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">userId</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">channel</span><span class="field-type">NotificationChannel</span></div>
            <div class="field"><span class="field-name">type</span><span class="field-type">NotificationType</span></div>
            <div class="field"><span class="field-name">enabled</span><span class="field-type">boolean</span></div>
            <div class="field"><span class="field-name">quietHoursStart</span><span class="field-type">LocalTime</span></div>
            <div class="field"><span class="field-name">quietHoursEnd</span><span class="field-type">LocalTime</span></div>
        </div>
        <div class="entity-card">
            <h3>DeviceToken</h3>
            <div class="field"><span class="field-name">id</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">userId</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">token</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">platform</span><span class="field-type">Platform</span></div>
            <div class="field"><span class="field-name">active</span><span class="field-type">boolean</span></div>
            <div class="field"><span class="field-name">lastUsedAt</span><span class="field-type">LocalDateTime</span></div>
        </div>
        <div class="entity-card">
            <h3>NotificationLog</h3>
            <div class="field"><span class="field-name">id</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">notificationId</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">provider</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">status</span><span class="field-type">DeliveryStatus</span></div>
            <div class="field"><span class="field-name">errorCode</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">errorMessage</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">attemptNumber</span><span class="field-type">int</span></div>
            <div class="field"><span class="field-name">latencyMs</span><span class="field-type">long</span></div>
            <div class="field"><span class="field-name">createdAt</span><span class="field-type">LocalDateTime</span></div>
        </div>
    </div>
</div>

<!-- ============ 3. ENUMS ============ -->
<div class="section theme-purple">
    <div class="section-title"><span class="section-num">3</span>Enums</div>
    <div class="enum-grid">
        <div class="enum-card">
            <h3>NotificationChannel</h3>
            <div class="enum-val">PUSH</div>
            <div class="enum-val">EMAIL</div>
            <div class="enum-val">SMS</div>
            <div class="enum-val">IN_APP</div>
            <div class="enum-val">WEBHOOK</div>
        </div>
        <div class="enum-card">
            <h3>NotificationType</h3>
            <div class="enum-val">TRANSACTIONAL</div>
            <div class="enum-val">PROMOTIONAL</div>
            <div class="enum-val">SYSTEM_ALERT</div>
            <div class="enum-val">REMINDER</div>
            <div class="enum-val">OTP</div>
        </div>
        <div class="enum-card">
            <h3>NotificationStatus</h3>
            <div class="enum-val">PENDING</div>
            <div class="enum-val">QUEUED</div>
            <div class="enum-val">SENT</div>
            <div class="enum-val">DELIVERED</div>
            <div class="enum-val">READ</div>
            <div class="enum-val">FAILED</div>
            <div class="enum-val">DLQ</div>
        </div>
        <div class="enum-card">
            <h3>Priority</h3>
            <div class="enum-val">CRITICAL</div>
            <div class="enum-val">HIGH</div>
            <div class="enum-val">NORMAL</div>
            <div class="enum-val">LOW</div>
        </div>
        <div class="enum-card">
            <h3>Platform</h3>
            <div class="enum-val">ANDROID</div>
            <div class="enum-val">IOS</div>
            <div class="enum-val">WEB</div>
        </div>
        <div class="enum-card">
            <h3>DeliveryStatus</h3>
            <div class="enum-val">SUCCESS</div>
            <div class="enum-val">BOUNCED</div>
            <div class="enum-val">REJECTED</div>
            <div class="enum-val">TIMEOUT</div>
            <div class="enum-val">PROVIDER_ERROR</div>
        </div>
    </div>
</div>

<!-- ============ 4. INTERFACES & SOLID ============ -->
<div class="section theme-green">
    <div class="section-title"><span class="section-num">4</span>Interfaces &amp; SOLID Principles</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span><span class="code-title">NotificationInterfaces.java — Strategy + OCP</span></div>
    <pre class="code-block">
<span class="cm">// SRP — Each channel handler has a single responsibility</span>
<span class="cm">// OCP — Add new channels without modifying existing code</span>
<span class="cm">// DIP — Services depend on abstractions, not concrete providers</span>

<span class="kw">public interface</span> <span class="tp">INotificationSender</span> {
    <span class="tp">NotificationChannel</span> <span class="fn">getChannel</span>();
    <span class="tp">DeliveryResult</span> <span class="fn">send</span>(<span class="tp">Notification</span> notification, <span class="tp">User</span> user);
    <span class="kw">boolean</span> <span class="fn">supports</span>(<span class="tp">NotificationChannel</span> channel);
}

<span class="kw">public interface</span> <span class="tp">INotificationService</span> {
    <span class="tp">Notification</span> <span class="fn">send</span>(<span class="tp">NotificationRequest</span> request);
    <span class="tp">List</span>&lt;<span class="tp">Notification</span>&gt; <span class="fn">sendBulk</span>(<span class="tp">BulkNotificationRequest</span> request);
    <span class="tp">Notification</span> <span class="fn">schedule</span>(<span class="tp">NotificationRequest</span> req, <span class="tp">LocalDateTime</span> at);
    <span class="kw">void</span> <span class="fn">cancel</span>(<span class="tp">Long</span> notificationId);
}

<span class="kw">public interface</span> <span class="tp">ITemplateEngine</span> {
    <span class="tp">String</span> <span class="fn">render</span>(<span class="tp">String</span> templateId, <span class="tp">Map</span>&lt;<span class="tp">String</span>, <span class="tp">Object</span>&gt; params);
    <span class="tp">NotificationTemplate</span> <span class="fn">getTemplate</span>(<span class="tp">String</span> templateId);
}

<span class="kw">public interface</span> <span class="tp">IRateLimiter</span> {
    <span class="kw">boolean</span> <span class="fn">isAllowed</span>(<span class="tp">Long</span> userId, <span class="tp">NotificationChannel</span> channel);
    <span class="kw">void</span> <span class="fn">recordSent</span>(<span class="tp">Long</span> userId, <span class="tp">NotificationChannel</span> channel);
}
    </pre></div>
</div>

<!-- ============ 5. CLASS DESIGN ============ -->
<div class="section theme-blue">
    <div class="section-title"><span class="section-num">5</span>Class Design (JPA Entities)</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span><span class="code-title">Notification.java — JPA Entity</span></div>
    <pre class="code-block">
<span class="ann">@Entity</span>
<span class="ann">@Table</span>(name = <span class="st">"notifications"</span>, indexes = {
    <span class="ann">@Index</span>(name = <span class="st">"idx_notif_user_status"</span>, columnList = <span class="st">"user_id, status"</span>),
    <span class="ann">@Index</span>(name = <span class="st">"idx_notif_scheduled"</span>, columnList = <span class="st">"scheduled_at, status"</span>)
})
<span class="kw">public class</span> <span class="tp">Notification</span> {
    <span class="ann">@Id</span> <span class="ann">@GeneratedValue</span>(strategy = <span class="tp">GenerationType</span>.IDENTITY)
    <span class="kw">private</span> <span class="tp">Long</span> id;

    <span class="ann">@Column</span>(name = <span class="st">"user_id"</span>, nullable = <span class="kw">false</span>)
    <span class="kw">private</span> <span class="tp">Long</span> userId;

    <span class="ann">@Enumerated</span>(<span class="tp">EnumType</span>.STRING)
    <span class="kw">private</span> <span class="tp">NotificationChannel</span> channel;

    <span class="ann">@Enumerated</span>(<span class="tp">EnumType</span>.STRING)
    <span class="kw">private</span> <span class="tp">Priority</span> priority;

    <span class="kw">private</span> <span class="tp">String</span> templateId;
    <span class="kw">private</span> <span class="tp">String</span> title;
    <span class="ann">@Column</span>(columnDefinition = <span class="st">"TEXT"</span>)
    <span class="kw">private</span> <span class="tp">String</span> body;

    <span class="ann">@Enumerated</span>(<span class="tp">EnumType</span>.STRING)
    <span class="kw">private</span> <span class="tp">NotificationStatus</span> status = <span class="tp">NotificationStatus</span>.PENDING;

    <span class="kw">private int</span> retryCount = <span class="cn">0</span>;
    <span class="kw">private</span> <span class="tp">LocalDateTime</span> scheduledAt;
    <span class="kw">private</span> <span class="tp">LocalDateTime</span> sentAt;
    <span class="kw">private</span> <span class="tp">LocalDateTime</span> readAt;
    <span class="ann">@CreationTimestamp</span>
    <span class="kw">private</span> <span class="tp">LocalDateTime</span> createdAt;
}
    </pre></div>
</div>

<!-- ============ 6. REPOSITORY / DAO ============ -->
<div class="section theme-purple">
    <div class="section-title"><span class="section-num">6</span>Repository / DAO Layer</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span><span class="code-title">NotificationRepository.java</span></div>
    <pre class="code-block">
<span class="kw">public interface</span> <span class="tp">NotificationRepository</span> <span class="kw">extends</span> <span class="tp">JpaRepository</span>&lt;<span class="tp">Notification</span>, <span class="tp">Long</span>&gt; {

    <span class="tp">Page</span>&lt;<span class="tp">Notification</span>&gt; <span class="fn">findByUserIdAndStatusIn</span>(
        <span class="tp">Long</span> userId, <span class="tp">List</span>&lt;<span class="tp">NotificationStatus</span>&gt; statuses, <span class="tp">Pageable</span> pageable);

    <span class="ann">@Query</span>(<span class="st">"SELECT n FROM Notification n WHERE n.status = 'PENDING' AND n.scheduledAt &lt;= :now"</span>)
    <span class="tp">List</span>&lt;<span class="tp">Notification</span>&gt; <span class="fn">findScheduledReady</span>(<span class="ann">@Param</span>(<span class="st">"now"</span>) <span class="tp">LocalDateTime</span> now);

    <span class="ann">@Query</span>(<span class="st">"SELECT n FROM Notification n WHERE n.status = 'FAILED' AND n.retryCount &lt; :max"</span>)
    <span class="tp">List</span>&lt;<span class="tp">Notification</span>&gt; <span class="fn">findRetryable</span>(<span class="ann">@Param</span>(<span class="st">"max"</span>) <span class="kw">int</span> maxRetries);

    <span class="ann">@Modifying</span>
    <span class="ann">@Query</span>(<span class="st">"UPDATE Notification n SET n.status = 'READ', n.readAt = :now WHERE n.userId = :uid AND n.status = 'DELIVERED'"</span>)
    <span class="kw">int</span> <span class="fn">markAllRead</span>(<span class="ann">@Param</span>(<span class="st">"uid"</span>) <span class="tp">Long</span> uid, <span class="ann">@Param</span>(<span class="st">"now"</span>) <span class="tp">LocalDateTime</span> now);
}

<span class="kw">public interface</span> <span class="tp">DeviceTokenRepository</span> <span class="kw">extends</span> <span class="tp">JpaRepository</span>&lt;<span class="tp">DeviceToken</span>, <span class="tp">Long</span>&gt; {
    <span class="tp">List</span>&lt;<span class="tp">DeviceToken</span>&gt; <span class="fn">findByUserIdAndActiveTrue</span>(<span class="tp">Long</span> userId);
    <span class="tp">Optional</span>&lt;<span class="tp">DeviceToken</span>&gt; <span class="fn">findByToken</span>(<span class="tp">String</span> token);
}
    </pre></div>
</div>

<!-- ============ 7. DATABASE SCHEMA ============ -->
<div class="section theme-green">
    <div class="section-title"><span class="section-num">7</span>Database Schema</div>
    <div class="db-grid">
        <div class="db-card">
            <h3>notifications</h3>
            <div class="db-row"><span class="col-name">id</span><span class="col-type">BIGINT</span><span class="col-constraint">PK AUTO_INCREMENT</span></div>
            <div class="db-row"><span class="col-name">user_id</span><span class="col-type">BIGINT</span><span class="col-constraint">FK → users(id) IDX</span></div>
            <div class="db-row"><span class="col-name">channel</span><span class="col-type">ENUM</span><span class="col-constraint">NOT NULL</span></div>
            <div class="db-row"><span class="col-name">type</span><span class="col-type">ENUM</span><span class="col-constraint">NOT NULL</span></div>
            <div class="db-row"><span class="col-name">priority</span><span class="col-type">ENUM</span><span class="col-constraint">DEFAULT 'NORMAL'</span></div>
            <div class="db-row"><span class="col-name">template_id</span><span class="col-type">VARCHAR(64)</span><span class="col-constraint">FK</span></div>
            <div class="db-row"><span class="col-name">title</span><span class="col-type">VARCHAR(255)</span><span class="col-constraint"></span></div>
            <div class="db-row"><span class="col-name">body</span><span class="col-type">TEXT</span><span class="col-constraint"></span></div>
            <div class="db-row"><span class="col-name">status</span><span class="col-type">ENUM</span><span class="col-constraint">IDX DEFAULT 'PENDING'</span></div>
            <div class="db-row"><span class="col-name">retry_count</span><span class="col-type">INT</span><span class="col-constraint">DEFAULT 0</span></div>
            <div class="db-row"><span class="col-name">scheduled_at</span><span class="col-type">TIMESTAMP</span><span class="col-constraint">IDX</span></div>
            <div class="db-row"><span class="col-name">sent_at</span><span class="col-type">TIMESTAMP</span><span class="col-constraint"></span></div>
            <div class="db-row"><span class="col-name">created_at</span><span class="col-type">TIMESTAMP</span><span class="col-constraint">IDX</span></div>
        </div>
        <div class="db-card">
            <h3>notification_templates</h3>
            <div class="db-row"><span class="col-name">id</span><span class="col-type">BIGINT</span><span class="col-constraint">PK</span></div>
            <div class="db-row"><span class="col-name">name</span><span class="col-type">VARCHAR(128)</span><span class="col-constraint">UNIQUE</span></div>
            <div class="db-row"><span class="col-name">channel</span><span class="col-type">ENUM</span><span class="col-constraint">NOT NULL</span></div>
            <div class="db-row"><span class="col-name">title_template</span><span class="col-type">VARCHAR(512)</span><span class="col-constraint"></span></div>
            <div class="db-row"><span class="col-name">body_template</span><span class="col-type">TEXT</span><span class="col-constraint"></span></div>
            <div class="db-row"><span class="col-name">active</span><span class="col-type">BOOLEAN</span><span class="col-constraint">DEFAULT TRUE</span></div>
        </div>
        <div class="db-card">
            <h3>device_tokens</h3>
            <div class="db-row"><span class="col-name">id</span><span class="col-type">BIGINT</span><span class="col-constraint">PK</span></div>
            <div class="db-row"><span class="col-name">user_id</span><span class="col-type">BIGINT</span><span class="col-constraint">FK IDX</span></div>
            <div class="db-row"><span class="col-name">token</span><span class="col-type">VARCHAR(512)</span><span class="col-constraint">UNIQUE</span></div>
            <div class="db-row"><span class="col-name">platform</span><span class="col-type">ENUM</span><span class="col-constraint">NOT NULL</span></div>
            <div class="db-row"><span class="col-name">active</span><span class="col-type">BOOLEAN</span><span class="col-constraint">DEFAULT TRUE</span></div>
        </div>
        <div class="db-card">
            <h3>user_preferences</h3>
            <div class="db-row"><span class="col-name">id</span><span class="col-type">BIGINT</span><span class="col-constraint">PK</span></div>
            <div class="db-row"><span class="col-name">user_id</span><span class="col-type">BIGINT</span><span class="col-constraint">FK IDX</span></div>
            <div class="db-row"><span class="col-name">channel</span><span class="col-type">ENUM</span><span class="col-constraint">NOT NULL</span></div>
            <div class="db-row"><span class="col-name">type</span><span class="col-type">ENUM</span><span class="col-constraint">NOT NULL</span></div>
            <div class="db-row"><span class="col-name">enabled</span><span class="col-type">BOOLEAN</span><span class="col-constraint">DEFAULT TRUE</span></div>
            <div class="db-row"><span class="col-name">quiet_hours_start</span><span class="col-type">TIME</span><span class="col-constraint"></span></div>
            <div class="db-row"><span class="col-name">quiet_hours_end</span><span class="col-type">TIME</span><span class="col-constraint"></span></div>
        </div>
        <div class="db-card">
            <h3>notification_logs</h3>
            <div class="db-row"><span class="col-name">id</span><span class="col-type">BIGINT</span><span class="col-constraint">PK</span></div>
            <div class="db-row"><span class="col-name">notification_id</span><span class="col-type">BIGINT</span><span class="col-constraint">FK IDX</span></div>
            <div class="db-row"><span class="col-name">provider</span><span class="col-type">VARCHAR(64)</span><span class="col-constraint"></span></div>
            <div class="db-row"><span class="col-name">status</span><span class="col-type">ENUM</span><span class="col-constraint">NOT NULL</span></div>
            <div class="db-row"><span class="col-name">error_code</span><span class="col-type">VARCHAR(64)</span><span class="col-constraint"></span></div>
            <div class="db-row"><span class="col-name">attempt_number</span><span class="col-type">INT</span><span class="col-constraint"></span></div>
            <div class="db-row"><span class="col-name">latency_ms</span><span class="col-type">BIGINT</span><span class="col-constraint"></span></div>
            <div class="db-row"><span class="col-name">created_at</span><span class="col-type">TIMESTAMP</span><span class="col-constraint">IDX</span></div>
        </div>
    </div>
</div>

<!-- ============ 8. API ENDPOINTS ============ -->
<div class="section theme-blue">
    <div class="section-title"><span class="section-num">8</span>API Endpoints</div>
    <div class="api-grid">
        <div class="api-card">
            <div class="api-method post">POST</div>
            <div class="api-path">/api/v1/notifications</div>
            <div class="api-desc">Send notification (async 202 Accepted)</div>
        </div>
        <div class="api-card">
            <div class="api-method post">POST</div>
            <div class="api-path">/api/v1/notifications/bulk</div>
            <div class="api-desc">Send bulk notifications (batch)</div>
        </div>
        <div class="api-card">
            <div class="api-method post">POST</div>
            <div class="api-path">/api/v1/notifications/schedule</div>
            <div class="api-desc">Schedule future notification delivery</div>
        </div>
        <div class="api-card">
            <div class="api-method get">GET</div>
            <div class="api-path">/api/v1/notifications?page=0&amp;size=20</div>
            <div class="api-desc">Get user's notification center (paginated)</div>
        </div>
        <div class="api-card">
            <div class="api-method get">GET</div>
            <div class="api-path">/api/v1/notifications/unread-count</div>
            <div class="api-desc">Get unread notification count</div>
        </div>
        <div class="api-card">
            <div class="api-method put">PUT</div>
            <div class="api-path">/api/v1/notifications/{id}/read</div>
            <div class="api-desc">Mark single notification as read</div>
        </div>
        <div class="api-card">
            <div class="api-method put">PUT</div>
            <div class="api-path">/api/v1/notifications/read-all</div>
            <div class="api-desc">Mark all notifications as read</div>
        </div>
        <div class="api-card">
            <div class="api-method get">GET</div>
            <div class="api-path">/api/v1/preferences</div>
            <div class="api-desc">Get user notification preferences</div>
        </div>
        <div class="api-card">
            <div class="api-method put">PUT</div>
            <div class="api-path">/api/v1/preferences</div>
            <div class="api-desc">Update notification preferences</div>
        </div>
        <div class="api-card">
            <div class="api-method post">POST</div>
            <div class="api-path">/api/v1/devices/token</div>
            <div class="api-desc">Register device push token</div>
        </div>
    </div>
</div>

<!-- ============ 9. SERVICE LAYER ============ -->
<div class="section theme-purple">
    <div class="section-title"><span class="section-num">9</span>Service Layer</div>
    <div class="service-grid">
        <div class="service-card">
            <h3>NotificationService</h3>
            <p class="svc-desc">Main service — checks user preferences, builds the message, and sends it to the right queue</p>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Send a notification to a user</div><code>void send(NotificationRequest request)</code></div>
        </div>
        <div class="service-card">
            <h3>PushNotificationSender</h3>
            <p class="svc-desc">Sends push notifications to mobile devices using Firebase or Apple Push</p>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Send push notification to user's phone</div><code>void send(Notification notification, User user)</code></div>
        </div>
        <div class="service-card">
            <h3>EmailNotificationSender</h3>
            <p class="svc-desc">Sends emails using AWS SES or SMTP and tracks if emails bounce</p>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Send an email notification</div><code>void send(Notification notification, User user)</code></div>
        </div>
        <div class="service-card">
            <h3>SmsNotificationSender</h3>
            <p class="svc-desc">Sends SMS messages using Twilio or AWS SNS with delivery tracking</p>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Send an SMS notification</div><code>void send(Notification notification, User user)</code></div>
        </div>
        <div class="service-card">
            <h3>TemplateService</h3>
            <p class="svc-desc">Builds notification messages from templates (like "Hi {name}, your order is ready")</p>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Fill in template with actual values</div><code>String render(String templateId, Map&lt;String, Object&gt; params)</code></div>
        </div>
        <div class="service-card">
            <h3>PreferenceService</h3>
            <p class="svc-desc">Checks if user wants to receive notifications — respects opt-out, quiet hours, DND</p>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Check if a channel (push/email/sms) is enabled for user</div><code>boolean isChannelEnabled(Long userId, Channel channel)</code></div>
        </div>
        <div class="service-card">
            <h3>RetryService</h3>
            <p class="svc-desc">Retries failed notifications with increasing wait time, gives up after max tries</p>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Retry all failed notifications</div><code>void retryFailed()</code></div>
        </div>
        <div class="service-card">
            <h3>SchedulerService</h3>
            <p class="svc-desc">Sends scheduled notifications at the right time (like a reminder at 9 AM)</p>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Process all due scheduled notifications</div><code>void processScheduled()</code></div>
        </div>
    </div>
</div>

<!-- ============ 10. KEY ARCHITECTURE ============ -->
<div class="section theme-green">
    <div class="section-title"><span class="section-num">10</span>Key Architecture</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span><span class="code-title">NotificationDispatcher.java — Strategy + Kafka Pipeline</span></div>
    <pre class="code-block">
<span class="ann">@Service</span>
<span class="kw">public class</span> <span class="tp">NotificationDispatcher</span> {

    <span class="kw">private final</span> <span class="tp">Map</span>&lt;<span class="tp">NotificationChannel</span>, <span class="tp">INotificationSender</span>&gt; senders;
    <span class="kw">private final</span> <span class="tp">KafkaTemplate</span>&lt;<span class="tp">String</span>, <span class="tp">NotificationEvent</span>&gt; kafka;
    <span class="kw">private final</span> <span class="tp">IRateLimiter</span> rateLimiter;

    <span class="cm">// Strategy: inject all INotificationSender beans into map</span>
    <span class="kw">public</span> <span class="fn">NotificationDispatcher</span>(<span class="tp">List</span>&lt;<span class="tp">INotificationSender</span>&gt; senderList, ...) {
        <span class="kw">this</span>.senders = senderList.stream()
            .collect(<span class="tp">Collectors</span>.<span class="fn">toMap</span>(
                <span class="tp">INotificationSender</span>::getChannel, s -&gt; s));
    }

    <span class="kw">public void</span> <span class="fn">dispatch</span>(<span class="tp">Notification</span> notification) {
        <span class="cm">// 1. Rate limit check</span>
        <span class="kw">if</span> (!rateLimiter.<span class="fn">isAllowed</span>(notification.getUserId(), notification.getChannel()))
            <span class="kw">throw new</span> <span class="tp">RateLimitExceededException</span>(<span class="st">"Too many notifications"</span>);

        <span class="cm">// 2. Route to priority Kafka topic</span>
        <span class="tp">String</span> topic = <span class="kw">switch</span> (notification.getPriority()) {
            <span class="kw">case</span> CRITICAL, HIGH -&gt; <span class="st">"notif.priority.high"</span>;
            <span class="kw">case</span> NORMAL -&gt; <span class="st">"notif.priority.normal"</span>;
            <span class="kw">case</span> LOW -&gt; <span class="st">"notif.priority.low"</span>;
        };
        kafka.<span class="fn">send</span>(topic, <span class="kw">new</span> <span class="tp">NotificationEvent</span>(notification));
    }

    <span class="ann">@KafkaListener</span>(topics = {<span class="st">"notif.priority.high"</span>, <span class="st">"notif.priority.normal"</span>})
    <span class="kw">public void</span> <span class="fn">processNotification</span>(<span class="tp">NotificationEvent</span> event) {
        <span class="tp">Notification</span> n = event.getNotification();
        <span class="tp">INotificationSender</span> sender = senders.<span class="fn">get</span>(n.getChannel());
        <span class="kw">try</span> {
            sender.<span class="fn">send</span>(n, event.getUser());
            n.<span class="fn">setStatus</span>(<span class="tp">NotificationStatus</span>.SENT);
        } <span class="kw">catch</span> (<span class="tp">Exception</span> e) {
            n.<span class="fn">setRetryCount</span>(n.getRetryCount() + <span class="cn">1</span>);
            n.<span class="fn">setStatus</span>(n.getRetryCount() &gt;= <span class="cn">3</span> ?
                <span class="tp">NotificationStatus</span>.DLQ : <span class="tp">NotificationStatus</span>.FAILED);
        }
    }
}
    </pre></div>
</div>

<!-- ============ 11. DESIGN PATTERNS ============ -->
<div class="section theme-blue">
    <div class="section-title"><span class="section-num">11</span>Design Patterns Used</div>
    <div class="pattern-grid">
        <div class="pattern-card"><h3>Strategy</h3><p>Channel-specific senders (Push, Email, SMS) implement INotificationSender — swap providers without modifying dispatch</p></div>
        <div class="pattern-card"><h3>Observer</h3><p>Kafka event-driven: services publish NotificationEvent, consumers react asynchronously</p></div>
        <div class="pattern-card"><h3>Template Method</h3><p>AbstractNotificationSender defines send flow (validate→render→deliver→log), subclasses override deliver()</p></div>
        <div class="pattern-card"><h3>Builder</h3><p>NotificationRequest.builder().userId().channel().template().priority().build()</p></div>
        <div class="pattern-card"><h3>Factory</h3><p>SenderFactory creates appropriate sender based on channel type and provider config</p></div>
        <div class="pattern-card"><h3>Producer-Consumer</h3><p>Kafka priority queues decouple API from delivery — handles burst traffic with backpressure</p></div>
        <div class="pattern-card"><h3>Decorator</h3><p>RateLimitingDecorator wraps senders to add rate limiting transparently</p></div>
    </div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span><span class="code-title">Template Method Pattern</span></div>
    <pre class="code-block">
<span class="kw">public abstract class</span> <span class="tp">AbstractNotificationSender</span> <span class="kw">implements</span> <span class="tp">INotificationSender</span> {

    <span class="kw">public final</span> <span class="tp">DeliveryResult</span> <span class="fn">send</span>(<span class="tp">Notification</span> n, <span class="tp">User</span> u) {
        <span class="fn">validate</span>(n);
        <span class="tp">String</span> rendered = <span class="fn">renderContent</span>(n);
        <span class="tp">DeliveryResult</span> result = <span class="fn">deliver</span>(n, u, rendered); <span class="cm">// abstract</span>
        <span class="fn">logDelivery</span>(n, result);
        <span class="kw">return</span> result;
    }

    <span class="kw">protected abstract</span> <span class="tp">DeliveryResult</span> <span class="fn">deliver</span>(<span class="tp">Notification</span> n, <span class="tp">User</span> u, <span class="tp">String</span> body);
}

<span class="ann">@Component</span>
<span class="kw">public class</span> <span class="tp">PushNotificationSender</span> <span class="kw">extends</span> <span class="tp">AbstractNotificationSender</span> {
    <span class="ann">@Override</span>
    <span class="kw">protected</span> <span class="tp">DeliveryResult</span> <span class="fn">deliver</span>(<span class="tp">Notification</span> n, <span class="tp">User</span> u, <span class="tp">String</span> body) {
        <span class="tp">Message</span> msg = <span class="tp">Message</span>.<span class="fn">builder</span>()
            .<span class="fn">setToken</span>(u.getDeviceToken())
            .<span class="fn">setNotification</span>(<span class="tp">Notification</span>.<span class="fn">builder</span>()
                .<span class="fn">setTitle</span>(n.getTitle()).<span class="fn">setBody</span>(body).<span class="fn">build</span>())
            .<span class="fn">build</span>();
        <span class="kw">return</span> <span class="tp">DeliveryResult</span>.<span class="fn">success</span>(fcm.<span class="fn">send</span>(msg));
    }
}
    </pre></div>
</div>

<!-- ============ 12. SEQUENCE FLOW ============ -->
<div class="section theme-purple">
    <div class="section-title"><span class="section-num">12</span>Sequence Flow</div>
    <div class="flow-container">
        <div class="flow-step"><span class="step-num">1</span><span class="step-text">Client calls POST /api/v1/notifications → 202 Accepted</span></div>
        <div class="flow-step"><span class="step-num">2</span><span class="step-text">NotificationService checks user preferences &amp; quiet hours</span></div>
        <div class="flow-step"><span class="step-num">3</span><span class="step-text">TemplateService renders template with dynamic placeholders</span></div>
        <div class="flow-step"><span class="step-num">4</span><span class="step-text">RateLimiter checks per-user per-channel rate (Redis sliding window)</span></div>
        <div class="flow-step"><span class="step-num">5</span><span class="step-text">Dispatcher publishes to Kafka priority topic (high/normal/low)</span></div>
        <div class="flow-step"><span class="step-num">6</span><span class="step-text">Consumer picks event, resolves INotificationSender via Strategy</span></div>
        <div class="flow-step"><span class="step-num">7</span><span class="step-text">Sender delivers via provider (FCM / SES / Twilio)</span></div>
        <div class="flow-step"><span class="step-num">8</span><span class="step-text">Delivery result logged to notification_logs table</span></div>
        <div class="flow-step"><span class="step-num">9</span><span class="step-text">On failure: increment retry, re-queue with exponential backoff</span></div>
        <div class="flow-step"><span class="step-num">10</span><span class="step-text">After 3 retries: move to Dead Letter Queue</span></div>
        <div class="flow-step"><span class="step-num">11</span><span class="step-text">In-app notifications pushed via WebSocket / SSE</span></div>
    </div>
</div>

<!-- ============ 13. CAPACITY ESTIMATION ============ -->
<div class="section theme-green">
    <div class="section-title"><span class="section-num">13</span>Capacity Estimation</div>
    <div class="cap-grid">
        <div class="cap-card"><div class="cap-label">Daily Active Users</div><div class="cap-value">50M</div></div>
        <div class="cap-card"><div class="cap-label">Notifications / Day</div><div class="cap-value">500M (~10 per user)</div></div>
        <div class="cap-card"><div class="cap-label">Peak QPS</div><div class="cap-value">~11,500 notif/sec</div></div>
        <div class="cap-card"><div class="cap-label">Kafka Throughput</div><div class="cap-value">~15K events/sec</div></div>
        <div class="cap-card"><div class="cap-label">Avg Notification Size</div><div class="cap-value">~500 bytes</div></div>
        <div class="cap-card"><div class="cap-label">Daily Storage</div><div class="cap-value">~250 GB/day</div></div>
        <div class="cap-card"><div class="cap-label">Monthly Storage</div><div class="cap-value">~7.5 TB (30-day)</div></div>
        <div class="cap-card"><div class="cap-label">Push Latency (p99)</div><div class="cap-value">&lt; 2 seconds</div></div>
        <div class="cap-card">
            <h4 style="color:#82b1ff;margin-bottom:8px">CPU / Server Estimation</h4>
            <div class="calc-row"><span class="calc-label">Peak QPS</span><span class="calc-value">~11,500/sec</span></div>
            <div class="calc-row"><span class="calc-label">Each server handles</span><span class="calc-value">~3K QPS</span></div>
            <div class="calc-result"><span class="calc-label">App Servers Needed</span><span class="calc-value">~4 servers</span></div>
            <div class="calc-row"><span class="calc-label">CPU cores per server (4 cores)</span><span class="calc-value"></span></div>
            <div class="calc-result"><span class="calc-label">Total CPU Cores</span><span class="calc-value">~16 cores</span></div>
            <div class="calc-row"><span class="calc-label">Kafka Consumer Workers</span><span class="calc-value">~20 workers</span></div>
            <div class="calc-row"><span class="calc-label">Kafka Brokers</span><span class="calc-value">3-5 brokers</span></div>
        </div>
    </div>
</div>

<!-- ============ 14. BOTTLENECKS ============ -->
<div class="section theme-blue">
    <div class="section-title"><span class="section-num">14</span>Bottlenecks &amp; Solutions</div>
    <div class="bottleneck-grid">
        <div class="bottleneck-card"><h3>Burst Traffic (flash sales)</h3><p>Kafka priority queues absorb spikes; auto-scale consumers with K8s HPA on consumer lag</p></div>
        <div class="bottleneck-card"><h3>Provider Rate Limits</h3><p>Token bucket per provider + circuit breaker; failover to secondary (SES → SendGrid)</p></div>
        <div class="bottleneck-card"><h3>Template Rendering</h3><p>Cache compiled templates in Redis; pre-render for bulk campaigns</p></div>
        <div class="bottleneck-card"><h3>DB Write Amplification</h3><p>Batch inserts for logs; async writes via Kafka → DB sink connector</p></div>
        <div class="bottleneck-card"><h3>Invalid Device Tokens</h3><p>Background job purges stale FCM tokens; maintain token freshness TTL</p></div>
        <div class="bottleneck-card"><h3>Preference Lookup Hot Path</h3><p>Cache in Redis with TTL; invalidate on update via pub/sub</p></div>
    </div>
</div>

<!-- ============ 15. EDGE CASES ============ -->
<div class="section theme-purple">
    <div class="section-title"><span class="section-num">15</span>Edge Cases</div>
    <div class="edge-grid">
        <div class="edge-card"><h3>Duplicate Notifications</h3><p>Idempotency key (userId + templateId + hash) in Redis with 5-min TTL</p></div>
        <div class="edge-card"><h3>User Uninstalls App</h3><p>FCM returns NotRegistered → mark token inactive, fall back to email/SMS</p></div>
        <div class="edge-card"><h3>Quiet Hours (DND)</h3><p>Queue during DND, deliver when ends. CRITICAL priority bypasses DND</p></div>
        <div class="edge-card"><h3>Multi-Device User</h3><p>Push to ALL active tokens; in-app via WebSocket to all connected devices</p></div>
        <div class="edge-card"><h3>Email Bounce</h3><p>Hard bounce → disable channel; soft bounce → retry. Keep bounce rate &lt; 5%</p></div>
        <div class="edge-card"><h3>Provider Outage</h3><p>Circuit breaker after 5 failures; route to fallback; alert via PagerDuty</p></div>
        <div class="edge-card"><h3>Timezone Scheduling</h3><p>Store user timezone; convert to UTC; scheduler checks local delivery time</p></div>
        <div class="edge-card"><h3>Notification Flood</h3><p>Per-user limit: 100/hour/channel. Global circuit breaker if QPS exceeds 2× avg</p></div>
    </div>
</div>

<!-- ============ 16. SECURITY ============ -->
<div class="section theme-green">
    <div class="section-title"><span class="section-num">16</span>Security Considerations</div>
    <div class="security-grid">
        <div class="security-card"><h3>Template Injection</h3><p>Sanitize all params; allow-list for placeholder keys; escape HTML in emails</p></div>
        <div class="security-card"><h3>PII Protection</h3><p>Mask sensitive data in logs; encrypt body at rest; GDPR-compliant retention</p></div>
        <div class="security-card"><h3>API Authentication</h3><p>JWT for user APIs; API key + HMAC for service-to-service calls</p></div>
        <div class="security-card"><h3>Device Token Security</h3><p>Validate ownership; hash at rest; expire after 30 days inactive</p></div>
        <div class="security-card"><h3>Rate Limit Bypass</h3><p>Server-side Redis sliding window; dual per-IP + per-user limits</p></div>
        <div class="security-card"><h3>Email Authenticity</h3><p>DKIM/SPF/DMARC for email; sign notification payloads</p></div>
    </div>
</div>

<!-- ============ 17. INTERVIEW SUMMARY ============ -->
<div class="section theme-blue">
    <div class="section-title"><span class="section-num">17</span>Interview Cheat-Sheet</div>
    <div class="summary-grid">
        <div class="summary-card"><strong>Architecture</strong><br>Event-driven Kafka priority queues + Strategy pattern for multi-channel</div>
        <div class="summary-card"><strong>Multi-Channel</strong><br>Push (FCM/APNs), Email (SES), SMS (Twilio), In-App (WebSocket)</div>
        <div class="summary-card"><strong>Reliability</strong><br>Exponential backoff retries (3 max); Dead Letter Queue for failures</div>
        <div class="summary-card"><strong>Template Engine</strong><br>Mustache with dynamic placeholders; cached compiled templates in Redis</div>
        <div class="summary-card"><strong>User Preferences</strong><br>Per-channel opt-in/out; quiet hours; CRITICAL bypasses DND</div>
        <div class="summary-card"><strong>Rate Limiting</strong><br>Per-user per-channel (Redis); provider-level token bucket + circuit breaker</div>
        <div class="summary-card"><strong>Scale</strong><br>500M notif/day; Kafka auto-scale; batch writes; 30-day retention</div>
        <div class="summary-card"><strong>Patterns</strong><br>Strategy, Observer, Template Method, Builder, Factory, Producer-Consumer</div>
    </div>
</div>

</div><!-- end container -->
</div><!-- end topic-notification -->

<!-- ==================== VIDEO STREAMING SYSTEM ==================== -->
`
}
