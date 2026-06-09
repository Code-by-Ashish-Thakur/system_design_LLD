export default {
  title: "API Rate Limiter &mdash; Low Level Design",
  subtitle: "Complete LLD for Java Spring Boot Interview &mdash; Token Bucket, Sliding Window &amp; Distributed Rate Limiting",
  subtitleColor: "#fff8e1",
  headerGradient: "linear-gradient(135deg,#f57f17,#f9a825,#ffd740)",
  footerText: "API Rate Limiter &mdash; Low Level Design",
  content: `
<div class="section theme-green">
    <div class="section-title"><span class="section-num">1</span>Functional Requirements</div>
    <div class="req-grid">
        <div class="req-pill"><span class="num">1</span> Rate limit per User / API Key / IP</div>
        <div class="req-pill"><span class="num">2</span> Multiple Algorithm Support (Token Bucket, Sliding Window)</div>
        <div class="req-pill"><span class="num">3</span> Configurable Limits per API Endpoint</div>
        <div class="req-pill"><span class="num">4</span> Return Rate Limit Headers (X-RateLimit-*)</div>
        <div class="req-pill"><span class="num">5</span> Distributed Rate Limiting (Redis-backed)</div>
        <div class="req-pill"><span class="num">6</span> Tiered Limits (Free / Pro / Enterprise)</div>
        <div class="req-pill"><span class="num">7</span> Graceful Degradation (429 Too Many Requests)</div>
        <div class="req-pill"><span class="num">8</span> Throttling Dashboard &amp; Metrics</div>
        <div class="req-pill"><span class="num">9</span> Whitelist / Blacklist Support</div>
        <div class="req-pill"><span class="num">10</span> Dynamic Rule Updates (no restart)</div>
    </div>
</div>

<div class="section theme-purple">
    <div class="section-title"><span class="section-num">2</span>Enums</div>
    <div class="enum-grid">
        <div class="enum-card"><h3>Algorithm</h3><div class="enum-val">TOKEN_BUCKET</div><div class="enum-val">LEAKY_BUCKET</div><div class="enum-val">FIXED_WINDOW</div><div class="enum-val">SLIDING_WINDOW_LOG</div><div class="enum-val">SLIDING_WINDOW_COUNTER</div></div>
        <div class="enum-card"><h3>KeyType</h3><div class="enum-val">USER_ID</div><div class="enum-val">API_KEY</div><div class="enum-val">IP_ADDRESS</div><div class="enum-val">ENDPOINT</div><div class="enum-val">COMPOSITE</div></div>
        <div class="enum-card"><h3>UserTier</h3><div class="enum-val">FREE</div><div class="enum-val">BASIC</div><div class="enum-val">PRO</div><div class="enum-val">ENTERPRISE</div></div>
        <div class="enum-card"><h3>RateLimitDecision</h3><div class="enum-val">ALLOWED</div><div class="enum-val">THROTTLED</div><div class="enum-val">BLOCKED</div><div class="enum-val">WHITELISTED</div></div>
    </div>
</div>

<div class="section theme-blue">
    <div class="section-title"><span class="section-num">3</span>Class Design (JPA Entities)</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span><span class="code-title">RateLimitRule.java — JPA Entity</span></div>
    <pre class="code-block">
<span class="ann">@Entity</span>
<span class="ann">@Table</span>(name = <span class="st">"rate_limit_rules"</span>, indexes = {
    <span class="ann">@Index</span>(name = <span class="st">"idx_rule_endpoint_tier"</span>, columnList = <span class="st">"endpoint, tier"</span>)
})
<span class="kw">public class</span> <span class="tp">RateLimitRule</span> {
    <span class="ann">@Id</span> <span class="ann">@GeneratedValue</span>(strategy = <span class="tp">GenerationType</span>.IDENTITY)
    <span class="kw">private</span> <span class="tp">Long</span> id;

    <span class="kw">private</span> <span class="tp">String</span> name;
    <span class="kw">private</span> <span class="tp">String</span> endpoint; <span class="cm">// "/api/v1/messages/**"</span>

    <span class="ann">@Enumerated</span>(<span class="tp">EnumType</span>.STRING)
    <span class="kw">private</span> <span class="tp">KeyType</span> keyType;

    <span class="ann">@Enumerated</span>(<span class="tp">EnumType</span>.STRING)
    <span class="kw">private</span> <span class="tp">Algorithm</span> algorithm;

    <span class="kw">private int</span> maxRequests;     <span class="cm">// bucket capacity or window limit</span>
    <span class="kw">private int</span> windowSeconds;   <span class="cm">// time window duration</span>
    <span class="kw">private int</span> refillRate;      <span class="cm">// tokens per second (token bucket)</span>

    <span class="ann">@Enumerated</span>(<span class="tp">EnumType</span>.STRING)
    <span class="kw">private</span> <span class="tp">UserTier</span> tier;

    <span class="kw">private boolean</span> active = <span class="kw">true</span>;
}
    </pre></div>
</div>

<div class="section theme-green">
    <div class="section-title"><span class="section-num">4</span>Database Schema</div>

    <div class="sub-heading" style="color:#25d366;border-color:#25d366">Database Technology Stack</div>
    <div class="dbtech-grid">
        <div class="dbtech-card">
            <div class="dbtech-name">Redis <span class="dbtech-type">In-Memory</span></div>
            <div class="dbtech-usage">Token bucket counters, sliding window logs, fixed window counters &mdash; atomic Lua scripts</div>
            <div class="dbtech-tables"><span>bucket:{key}</span><span>window:{key}</span></div>
        </div>
        <div class="dbtech-card">
            <div class="dbtech-name">PostgreSQL <span class="dbtech-type">RDBMS</span></div>
            <div class="dbtech-usage">Rate limit rules, API key configs, user tier settings</div>
            <div class="dbtech-tables"><span>rate_limit_rules</span><span>api_keys</span><span>user_tiers</span></div>
        </div>
        <div class="dbtech-card">
            <div class="dbtech-name">Prometheus <span class="dbtech-type">Monitoring</span></div>
            <div class="dbtech-usage">Metrics collection &mdash; allowed/blocked request counts, latency percentiles</div>
            <div class="dbtech-tables"><span>rate_limit_allowed</span><span>rate_limit_blocked</span></div>
        </div>
    </div>

    <div class="db-grid">
        <div class="db-card">
            <h3>rate_limit_rules</h3>
            <div class="db-row"><span class="col-name">id</span><span class="col-type">BIGINT</span><span class="col-constraint">PK AUTO_INCREMENT</span></div>
            <div class="db-row"><span class="col-name">name</span><span class="col-type">VARCHAR(128)</span><span class="col-constraint">NOT NULL</span></div>
            <div class="db-row"><span class="col-name">endpoint</span><span class="col-type">VARCHAR(256)</span><span class="col-constraint">IDX</span></div>
            <div class="db-row"><span class="col-name">key_type</span><span class="col-type">ENUM</span><span class="col-constraint">NOT NULL</span></div>
            <div class="db-row"><span class="col-name">algorithm</span><span class="col-type">ENUM</span><span class="col-constraint">NOT NULL</span></div>
            <div class="db-row"><span class="col-name">max_requests</span><span class="col-type">INT</span><span class="col-constraint">NOT NULL</span></div>
            <div class="db-row"><span class="col-name">window_seconds</span><span class="col-type">INT</span><span class="col-constraint">NOT NULL</span></div>
            <div class="db-row"><span class="col-name">refill_rate</span><span class="col-type">INT</span><span class="col-constraint"></span></div>
            <div class="db-row"><span class="col-name">tier</span><span class="col-type">ENUM</span><span class="col-constraint">IDX</span></div>
            <div class="db-row"><span class="col-name">active</span><span class="col-type">BOOLEAN</span><span class="col-constraint">DEFAULT TRUE</span></div>
        </div>
        <div class="db-card">
            <h3>client_configs</h3>
            <div class="db-row"><span class="col-name">id</span><span class="col-type">BIGINT</span><span class="col-constraint">PK</span></div>
            <div class="db-row"><span class="col-name">api_key</span><span class="col-type">VARCHAR(128)</span><span class="col-constraint">UNIQUE IDX</span></div>
            <div class="db-row"><span class="col-name">tier</span><span class="col-type">ENUM</span><span class="col-constraint">DEFAULT 'FREE'</span></div>
            <div class="db-row"><span class="col-name">whitelisted</span><span class="col-type">BOOLEAN</span><span class="col-constraint">DEFAULT FALSE</span></div>
            <div class="db-row"><span class="col-name">custom_limits</span><span class="col-type">JSON</span><span class="col-constraint"></span></div>
        </div>
        <div class="db-card">
            <h3>rate_limit_logs (partitioned by day)</h3>
            <div class="db-row"><span class="col-name">id</span><span class="col-type">BIGINT</span><span class="col-constraint">PK</span></div>
            <div class="db-row"><span class="col-name">client_key</span><span class="col-type">VARCHAR(256)</span><span class="col-constraint">IDX</span></div>
            <div class="db-row"><span class="col-name">endpoint</span><span class="col-type">VARCHAR(256)</span><span class="col-constraint"></span></div>
            <div class="db-row"><span class="col-name">allowed</span><span class="col-type">BOOLEAN</span><span class="col-constraint"></span></div>
            <div class="db-row"><span class="col-name">remaining</span><span class="col-type">INT</span><span class="col-constraint"></span></div>
            <div class="db-row"><span class="col-name">timestamp</span><span class="col-type">TIMESTAMP</span><span class="col-constraint">IDX</span></div>
        </div>
    </div>
</div>

<div class="section theme-blue">
    <div class="section-title"><span class="section-num">5</span>API Endpoints</div>
    <div class="api-grid">
        <div class="api-card"><div class="api-method get">GET</div><div class="api-path">/api/v1/rate-limits/status</div><div class="api-desc">Get current rate limit status for caller</div></div>
        <div class="api-card"><div class="api-method get">GET</div><div class="api-path">/api/v1/admin/rate-limits/rules</div><div class="api-desc">List all rate limit rules (admin)</div></div>
        <div class="api-card"><div class="api-method post">POST</div><div class="api-path">/api/v1/admin/rate-limits/rules</div><div class="api-desc">Create new rate limit rule</div></div>
        <div class="api-card"><div class="api-method put">PUT</div><div class="api-path">/api/v1/admin/rate-limits/rules/{id}</div><div class="api-desc">Update rule (live, no restart)</div></div>
        <div class="api-card"><div class="api-method delete">DELETE</div><div class="api-path">/api/v1/admin/rate-limits/rules/{id}</div><div class="api-desc">Deactivate a rate limit rule</div></div>
        <div class="api-card"><div class="api-method get">GET</div><div class="api-path">/api/v1/admin/rate-limits/metrics</div><div class="api-desc">Get throttling metrics &amp; top blocked clients</div></div>
        <div class="api-card"><div class="api-method post">POST</div><div class="api-path">/api/v1/admin/rate-limits/whitelist</div><div class="api-desc">Add API key to whitelist</div></div>
        <div class="api-card"><div class="api-method post">POST</div><div class="api-path">/api/v1/admin/rate-limits/reset/{clientKey}</div><div class="api-desc">Reset rate limit counters for a client</div></div>
    </div>
</div>

<div class="section theme-purple">
    <div class="section-title"><span class="section-num">6</span>Service LLD</div>
    <div class="service-grid">
        <div class="service-card">
            <h3>RateLimiterFilter</h3>
            <p class="svc-desc">Har incoming API request ko check karta hai aur decide karta hai allow karein ya block karein &mdash; Spring ka OncePerRequestFilter use karta hai</p>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">1</span> doFilter(FilterRequest)</div>
                <div class="method-return">Returns: <code>void</code></div>
                <div class="params-title">Parameters (FilterRequest):</div>
                <div class="param-row"><span class="param-name">request</span><span class="param-type">HttpServletRequest</span><span class="param-comment">// incoming HTTP request object</span></div>
                <div class="param-row"><span class="param-name">response</span><span class="param-type">HttpServletResponse</span><span class="param-comment">// response mein headers set karenge</span></div>
                <div class="param-row"><span class="param-name">chain</span><span class="param-type">FilterChain</span><span class="param-comment">// allowed ho toh next filter ko forward</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">2</span> addRateLimitHeaders(HeaderRequest)</div>
                <div class="method-return">Returns: <code>void</code></div>
                <div class="params-title">Parameters (HeaderRequest):</div>
                <div class="param-row"><span class="param-name">response</span><span class="param-type">HttpServletResponse</span><span class="param-comment">// jismein headers add karenge</span></div>
                <div class="param-row"><span class="param-name">result</span><span class="param-type">RateLimitResult</span><span class="param-comment">// remaining, resetAt, retryAfter info</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">3</span> sendRateLimitExceeded(ExceededRequest)</div>
                <div class="method-return">Returns: <code>void</code></div>
                <div class="params-title">Parameters (ExceededRequest):</div>
                <div class="param-row"><span class="param-name">response</span><span class="param-type">HttpServletResponse</span><span class="param-comment">// 429 status code set karega</span></div>
                <div class="param-row"><span class="param-name">retryAfterSeconds</span><span class="param-type">long</span><span class="param-comment">// kitne seconds baad retry karein</span></div>
            </div>
        </div>
        <div class="service-card">
            <h3>TokenBucketLimiter</h3>
            <p class="svc-desc">Token bucket algorithm se rate limit karta hai &mdash; user ke paas tokens hote hain jo time ke saath refill hote hain, har request ek token consume karti hai</p>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">1</span> tryAcquire(AcquireRequest)</div>
                <div class="method-return">Returns: <code>RateLimitResult</code></div>
                <div class="params-title">Parameters (AcquireRequest):</div>
                <div class="param-row"><span class="param-name">key</span><span class="param-type">String</span><span class="param-comment">// unique identifier jaise "user:42:/api/messages"</span></div>
                <div class="param-row"><span class="param-name">rule</span><span class="param-type">RateLimitRule</span><span class="param-comment">// maxRequests, refillRate, windowSeconds etc.</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">2</span> getRemainingTokens(TokenQueryRequest)</div>
                <div class="method-return">Returns: <code>long</code></div>
                <div class="params-title">Parameters (TokenQueryRequest):</div>
                <div class="param-row"><span class="param-name">key</span><span class="param-type">String</span><span class="param-comment">// bucket key jiska remaining token count chahiye</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">3</span> resetBucket(ResetRequest)</div>
                <div class="method-return">Returns: <code>void</code></div>
                <div class="params-title">Parameters (ResetRequest):</div>
                <div class="param-row"><span class="param-name">key</span><span class="param-type">String</span><span class="param-comment">// admin override &mdash; bucket reset karke full capacity pe laana</span></div>
            </div>
        </div>
        <div class="service-card">
            <h3>SlidingWindowLimiter</h3>
            <p class="svc-desc">Sliding time window mein requests count karta hai &mdash; fixed window se zyada accurate hai, Redis sorted set use karta hai timestamps store karne ke liye</p>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">1</span> tryAcquire(AcquireRequest)</div>
                <div class="method-return">Returns: <code>RateLimitResult</code></div>
                <div class="params-title">Parameters (AcquireRequest):</div>
                <div class="param-row"><span class="param-name">key</span><span class="param-type">String</span><span class="param-comment">// client identity + endpoint ka composite key</span></div>
                <div class="param-row"><span class="param-name">rule</span><span class="param-type">RateLimitRule</span><span class="param-comment">// maxRequests aur windowSeconds define karta hai</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">2</span> getCurrentCount(CountRequest)</div>
                <div class="method-return">Returns: <code>long</code></div>
                <div class="params-title">Parameters (CountRequest):</div>
                <div class="param-row"><span class="param-name">key</span><span class="param-type">String</span><span class="param-comment">// jis key ka current window count chahiye</span></div>
                <div class="param-row"><span class="param-name">window</span><span class="param-type">Duration</span><span class="param-comment">// sliding window ki duration (e.g. 60s)</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">3</span> cleanupExpiredEntries(CleanupRequest)</div>
                <div class="method-return">Returns: <code>void</code></div>
                <div class="params-title">Parameters (CleanupRequest):</div>
                <div class="param-row"><span class="param-name">key</span><span class="param-type">String</span><span class="param-comment">// sorted set se purane timestamps hataane ke liye</span></div>
            </div>
        </div>
        <div class="service-card">
            <h3>FixedWindowLimiter</h3>
            <p class="svc-desc">Fixed time blocks mein requests limit karta hai (jaise 100 req/min) &mdash; simple implementation hai but window boundary pe burst ho sakta hai</p>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">1</span> tryAcquire(AcquireRequest)</div>
                <div class="method-return">Returns: <code>RateLimitResult</code></div>
                <div class="params-title">Parameters (AcquireRequest):</div>
                <div class="param-row"><span class="param-name">key</span><span class="param-type">String</span><span class="param-comment">// rate limit key for this client+endpoint</span></div>
                <div class="param-row"><span class="param-name">rule</span><span class="param-type">RateLimitRule</span><span class="param-comment">// maxRequests aur windowSeconds milega</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">2</span> getRemainingQuota(QuotaRequest)</div>
                <div class="method-return">Returns: <code>long</code></div>
                <div class="params-title">Parameters (QuotaRequest):</div>
                <div class="param-row"><span class="param-name">key</span><span class="param-type">String</span><span class="param-comment">// current window mein kitne requests baaki hain</span></div>
                <div class="param-row"><span class="param-name">rule</span><span class="param-type">RateLimitRule</span><span class="param-comment">// maxRequests se compare karega</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">3</span> getTimeUntilReset(ResetTimeRequest)</div>
                <div class="method-return">Returns: <code>Duration</code></div>
                <div class="params-title">Parameters (ResetTimeRequest):</div>
                <div class="param-row"><span class="param-name">key</span><span class="param-type">String</span><span class="param-comment">// current window kab reset hoga, Retry-After header ke liye</span></div>
            </div>
        </div>
        <div class="service-card">
            <h3>KeyResolverService</h3>
            <p class="svc-desc">Pata lagata hai ki request kaun bhej raha hai &mdash; userId, API key, ya IP address se identify karta hai aur composite key banata hai</p>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">1</span> resolve(ResolveRequest)</div>
                <div class="method-return">Returns: <code>String</code></div>
                <div class="params-title">Parameters (ResolveRequest):</div>
                <div class="param-row"><span class="param-name">request</span><span class="param-type">HttpServletRequest</span><span class="param-comment">// HTTP request se identity extract karega</span></div>
                <div class="param-row"><span class="param-name">keyType</span><span class="param-type">KeyType</span><span class="param-comment">// USER_ID, API_KEY, IP_ADDRESS, ya COMPOSITE</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">2</span> extractIpAddress(IpRequest)</div>
                <div class="method-return">Returns: <code>String</code></div>
                <div class="params-title">Parameters (IpRequest):</div>
                <div class="param-row"><span class="param-name">request</span><span class="param-type">HttpServletRequest</span><span class="param-comment">// X-Forwarded-For handle karta hai proxies ke liye</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">3</span> getTierByApiKey(TierLookupRequest)</div>
                <div class="method-return">Returns: <code>UserTier</code></div>
                <div class="params-title">Parameters (TierLookupRequest):</div>
                <div class="param-row"><span class="param-name">apiKey</span><span class="param-type">String</span><span class="param-comment">// API key se user ka tier (FREE/PRO/ENTERPRISE) return karega</span></div>
            </div>
        </div>
        <div class="service-card">
            <h3>RuleProviderService</h3>
            <p class="svc-desc">Database se rate limit rules load karta hai aur memory mein cache rakhta hai &mdash; speed ke liye local cache, freshness ke liye periodic refresh</p>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">1</span> getRule(RuleLookupRequest)</div>
                <div class="method-return">Returns: <code>Optional&lt;RateLimitRule&gt;</code></div>
                <div class="params-title">Parameters (RuleLookupRequest):</div>
                <div class="param-row"><span class="param-name">endpoint</span><span class="param-type">String</span><span class="param-comment">// API path jaise "/api/v1/messages/**"</span></div>
                <div class="param-row"><span class="param-name">tier</span><span class="param-type">UserTier</span><span class="param-comment">// user ka tier, matching rule dhundhega</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">2</span> refreshRulesCache()</div>
                <div class="method-return">Returns: <code>void</code></div>
                <div class="params-title">Parameters:</div>
                <div class="param-row"><span class="param-name">&mdash;</span><span class="param-type">none</span><span class="param-comment">// DB se saari active rules reload karke cache update karega</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">3</span> upsertRule(UpsertRuleRequest)</div>
                <div class="method-return">Returns: <code>RateLimitRule</code></div>
                <div class="params-title">Parameters (UpsertRuleRequest):</div>
                <div class="param-row"><span class="param-name">endpoint</span><span class="param-type">String</span><span class="param-comment">// kis endpoint ke liye rule set karna hai</span></div>
                <div class="param-row"><span class="param-name">tier</span><span class="param-type">UserTier</span><span class="param-comment">// kis tier ke liye applicable hai</span></div>
                <div class="param-row"><span class="param-name">maxRequests</span><span class="param-type">int</span><span class="param-comment">// maximum allowed requests in window</span></div>
                <div class="param-row"><span class="param-name">window</span><span class="param-type">Duration</span><span class="param-comment">// time window duration (e.g. 60 seconds)</span></div>
            </div>
        </div>
        <div class="service-card">
            <h3>MetricsService</h3>
            <p class="svc-desc">Kitni requests allow ya block hui, yeh track karta hai &mdash; Prometheus counters update karta hai monitoring dashboards ke liye</p>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">1</span> recordDecision(DecisionRequest)</div>
                <div class="method-return">Returns: <code>void</code></div>
                <div class="params-title">Parameters (DecisionRequest):</div>
                <div class="param-row"><span class="param-name">result</span><span class="param-type">RateLimitResult</span><span class="param-comment">// allowed/blocked + remaining info record karega</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">2</span> getMetrics(MetricsQueryRequest)</div>
                <div class="method-return">Returns: <code>RateLimitMetrics</code></div>
                <div class="params-title">Parameters (MetricsQueryRequest):</div>
                <div class="param-row"><span class="param-name">endpoint</span><span class="param-type">String</span><span class="param-comment">// kis endpoint ki metrics chahiye</span></div>
                <div class="param-row"><span class="param-name">timeRange</span><span class="param-type">Duration</span><span class="param-comment">// last kitne time ki metrics (e.g. last 1 hour)</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">3</span> getTopBlockedUsers(TopBlockedRequest)</div>
                <div class="method-return">Returns: <code>List&lt;UserMetric&gt;</code></div>
                <div class="params-title">Parameters (TopBlockedRequest):</div>
                <div class="param-row"><span class="param-name">limit</span><span class="param-type">int</span><span class="param-comment">// top kitne blocked users chahiye (abuse detection ke liye)</span></div>
            </div>
        </div>
    </div>
</div>

<div class="section theme-green">
    <div class="section-title"><span class="section-num">7</span>Key Architecture</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span><span class="code-title">TokenBucketLimiter.java — Redis Lua Script</span></div>
    <pre class="code-block">
<span class="ann">@Component</span>
<span class="kw">public class</span> <span class="tp">TokenBucketLimiter</span> <span class="kw">implements</span> <span class="tp">IRateLimiter</span> {
    <span class="kw">private final</span> <span class="tp">StringRedisTemplate</span> redis;

    <span class="cm">// Atomic Lua script: refill tokens + try consume</span>
    <span class="kw">private static final</span> <span class="tp">String</span> LUA_SCRIPT = <span class="st">"""
        local key = KEYS[1]
        local capacity = tonumber(ARGV[1])
        local refillRate = tonumber(ARGV[2])
        local now = tonumber(ARGV[3])
        local ttl = tonumber(ARGV[4])

        local bucket = redis.call('HMGET', key, 'tokens', 'lastRefill')
        local tokens = tonumber(bucket[1]) or capacity
        local lastRefill = tonumber(bucket[2]) or now

        -- Refill tokens based on elapsed time
        local elapsed = math.max(0, now - lastRefill)
        tokens = math.min(capacity, tokens + elapsed * refillRate / 1000)

        local allowed = 0
        if tokens >= 1 then
            tokens = tokens - 1
            allowed = 1
        end

        redis.call('HMSET', key, 'tokens', tokens, 'lastRefill', now)
        redis.call('EXPIRE', key, ttl)
        return {allowed, math.floor(tokens)}
        """</span>;

    <span class="ann">@Override</span>
    <span class="kw">public</span> <span class="tp">RateLimitResult</span> <span class="fn">tryAcquire</span>(<span class="tp">String</span> key, <span class="tp">RateLimitRule</span> rule) {
        <span class="tp">List</span>&lt;<span class="tp">Object</span>&gt; result = redis.<span class="fn">execute</span>(
            <span class="kw">new</span> <span class="tp">DefaultRedisScript</span>&lt;&gt;(LUA_SCRIPT, <span class="tp">List</span>.<span class="kw">class</span>),
            <span class="tp">List</span>.<span class="fn">of</span>(key),
            <span class="tp">String</span>.<span class="fn">valueOf</span>(rule.getMaxRequests()),
            <span class="tp">String</span>.<span class="fn">valueOf</span>(rule.getRefillRate()),
            <span class="tp">String</span>.<span class="fn">valueOf</span>(<span class="tp">System</span>.<span class="fn">currentTimeMillis</span>()),
            <span class="tp">String</span>.<span class="fn">valueOf</span>(rule.getWindowSeconds())
        );
        <span class="kw">boolean</span> allowed = ((Long) result.<span class="fn">get</span>(<span class="cn">0</span>)) == <span class="cn">1</span>;
        <span class="kw">int</span> remaining = ((Long) result.<span class="fn">get</span>(<span class="cn">1</span>)).<span class="fn">intValue</span>();
        <span class="kw">return new</span> <span class="tp">RateLimitResult</span>(allowed, remaining,
            <span class="tp">System</span>.<span class="fn">currentTimeMillis</span>() + rule.getWindowSeconds() * <span class="cn">1000L</span>,
            allowed ? <span class="cn">0</span> : rule.getWindowSeconds());
    }

    <span class="ann">@Override</span>
    <span class="kw">public</span> <span class="tp">Algorithm</span> <span class="fn">getAlgorithm</span>() { <span class="kw">return</span> <span class="tp">Algorithm</span>.TOKEN_BUCKET; }
}
    </pre></div>
</div>

<div class="section theme-blue">
    <div class="section-title"><span class="section-num">8</span>Design Patterns Used</div>
    <div class="pattern-grid">
        <div class="pattern-card"><h3>Strategy</h3><p>IRateLimiter implementations (TokenBucket, SlidingWindow, FixedWindow) — select algorithm per rule</p></div>
        <div class="pattern-card"><h3>Factory</h3><p>RateLimiterFactory.create(algorithm) returns the correct IRateLimiter implementation</p></div>
        <div class="pattern-card"><h3>Decorator</h3><p>LoggingRateLimiter wraps IRateLimiter to add metrics/logging transparently</p></div>
        <div class="pattern-card"><h3>Chain of Responsibility</h3><p>Whitelist → Rate Limit → Throttle → Block — request passes through filter chain</p></div>
        <div class="pattern-card"><h3>Singleton</h3><p>Redis connection pool (Lettuce); cached rule map refreshed periodically</p></div>
        <div class="pattern-card"><h3>Template Method</h3><p>AbstractRateLimiter defines flow (resolveKey → checkLimit → recordResult), subclasses override checkLimit</p></div>
    </div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span><span class="code-title">SlidingWindowLogLimiter.java</span></div>
    <pre class="code-block">
<span class="ann">@Component</span>
<span class="kw">public class</span> <span class="tp">SlidingWindowLogLimiter</span> <span class="kw">implements</span> <span class="tp">IRateLimiter</span> {

    <span class="kw">private static final</span> <span class="tp">String</span> LUA = <span class="st">"""
        local key = KEYS[1]
        local now = tonumber(ARGV[1])
        local windowMs = tonumber(ARGV[2])
        local maxReqs = tonumber(ARGV[3])

        -- Remove expired entries
        redis.call('ZREMRANGEBYSCORE', key, 0, now - windowMs)

        local count = redis.call('ZCARD', key)
        if count < maxReqs then
            redis.call('ZADD', key, now, now .. '-' .. math.random(1000000))
            redis.call('EXPIRE', key, math.ceil(windowMs / 1000))
            return {1, maxReqs - count - 1}
        end
        return {0, 0}
        """</span>;

    <span class="ann">@Override</span>
    <span class="kw">public</span> <span class="tp">Algorithm</span> <span class="fn">getAlgorithm</span>() { <span class="kw">return</span> <span class="tp">Algorithm</span>.SLIDING_WINDOW_LOG; }
}
    </pre></div>
</div>

<div class="section theme-purple">
    <div class="section-title"><span class="section-num">9</span>Sequence Flow</div>
    <div class="flow-container">
        <div class="flow-step"><span class="step-num">1</span><span class="step-text">HTTP request hits RateLimiterFilter (OncePerRequestFilter)</span></div>
        <div class="flow-step"><span class="step-num">2</span><span class="step-text">KeyResolver extracts client identity (userId / API key / IP)</span></div>
        <div class="flow-step"><span class="step-num">3</span><span class="step-text">Check whitelist — whitelisted clients bypass rate limiting</span></div>
        <div class="flow-step"><span class="step-num">4</span><span class="step-text">RuleProvider finds matching rule for endpoint + client tier</span></div>
        <div class="flow-step"><span class="step-num">5</span><span class="step-text">RateLimiterFactory selects algorithm (TokenBucket / SlidingWindow)</span></div>
        <div class="flow-step"><span class="step-num">6</span><span class="step-text">IRateLimiter.tryAcquire() executes atomic Lua script on Redis</span></div>
        <div class="flow-step"><span class="step-num">7</span><span class="step-text">If allowed → set response headers (X-RateLimit-Remaining, X-RateLimit-Reset)</span></div>
        <div class="flow-step"><span class="step-num">8</span><span class="step-text">If throttled → return 429 with Retry-After header</span></div>
        <div class="flow-step"><span class="step-num">9</span><span class="step-text">MetricsService records decision for monitoring dashboard</span></div>
    </div>
</div>

<div class="section theme-green">
    <div class="section-title"><span class="section-num">10</span>Capacity Estimation</div>
    <div class="cap-grid">
        <div class="cap-card"><div class="cap-label">API Requests / sec</div><div class="cap-value">100,000 QPS</div></div>
        <div class="cap-card"><div class="cap-label">Redis Operations / sec</div><div class="cap-value">~100K (1 Lua call per request)</div></div>
        <div class="cap-card"><div class="cap-label">Unique Keys in Redis</div><div class="cap-value">~10M (users × endpoints)</div></div>
        <div class="cap-card"><div class="cap-label">Redis Memory per Key</div><div class="cap-value">~200 bytes (token bucket)</div></div>
        <div class="cap-card"><div class="cap-label">Total Redis Memory</div><div class="cap-value">~2 GB for 10M keys</div></div>
        <div class="cap-card"><div class="cap-label">Lua Script Latency</div><div class="cap-value">&lt; 1ms (p99)</div></div>
        <div class="cap-card"><div class="cap-label">Filter Overhead</div><div class="cap-value">&lt; 2ms added latency per request</div></div>
        <div class="cap-card"><div class="cap-label">Log Storage</div><div class="cap-value">~8.6 TB/day (if logging all, sample at 1%)</div></div>
        <div class="cap-card">
            <h4 style="color:#82b1ff;margin-bottom:8px">CPU / Server Estimation</h4>
            <div class="calc-row"><span class="calc-label">API QPS</span><span class="calc-value">100,000 QPS</span></div>
            <div class="calc-row"><span class="calc-label">Rate limiter runs as filter on each server</span><span class="calc-value"></span></div>
            <div class="calc-row"><span class="calc-label">Each server handles</span><span class="calc-value">~10K QPS</span></div>
            <div class="calc-result"><span class="calc-label">App Servers Needed</span><span class="calc-value">~10 servers</span></div>
            <div class="calc-result"><span class="calc-label">Total CPU Cores (4 per server)</span><span class="calc-value">~40 cores</span></div>
            <div class="calc-row"><span class="calc-label">Redis Cluster (rate limit data)</span><span class="calc-value">3-5 nodes</span></div>
        </div>
    </div>
</div>

<div class="section theme-blue">
    <div class="section-title"><span class="section-num">11</span>Bottlenecks &amp; Solutions</div>
    <div class="bottleneck-grid">
        <div class="bottleneck-card"><h3>Redis Single Point of Failure</h3><p>Redis Cluster with 3+ masters; Sentinel for automatic failover; read replicas</p></div>
        <div class="bottleneck-card"><h3>Hot Key Problem</h3><p>Hash-based key distribution; local in-memory cache with Redis sync; key sharding</p></div>
        <div class="bottleneck-card"><h3>Lua Script Blocking</h3><p>Keep scripts short (&lt; 1ms); avoid KEYS iteration; use EVALSHA for cached scripts</p></div>
        <div class="bottleneck-card"><h3>Rule Staleness</h3><p>Local cache with 60s refresh; Redis pub/sub for instant rule invalidation on update</p></div>
        <div class="bottleneck-card"><h3>Clock Skew in Distributed</h3><p>Use Redis server time (not client); all Lua scripts use redis.call('TIME')</p></div>
        <div class="bottleneck-card"><h3>Burst at Window Boundary</h3><p>Sliding window counter avoids fixed window boundary issue; weighted overlap calculation</p></div>
    </div>
</div>

<div class="section theme-purple">
    <div class="section-title"><span class="section-num">12</span>Edge Cases</div>
    <div class="edge-grid">
        <div class="edge-card"><h3>Redis Down</h3><p>Fail-open with local in-memory fallback limiter; log degradation; alert ops</p></div>
        <div class="edge-card"><h3>Distributed Race Condition</h3><p>Lua scripts are atomic on single Redis node; for cluster, use hash tags {userId}</p></div>
        <div class="edge-card"><h3>IP Spoofing</h3><p>Trust X-Forwarded-For only from known proxies; fall back to socket IP; combine with API key</p></div>
        <div class="edge-card"><h3>Multiple API Keys Same User</h3><p>Composite key: combine userId + apiKey + endpoint; aggregate limits across keys</p></div>
        <div class="edge-card"><h3>Negative Token Count</h3><p>Lua script uses math.max(0, tokens); atomic operation prevents race to negative</p></div>
        <div class="edge-card"><h3>TTL Expiry During Request</h3><p>Set TTL slightly longer than window; Lua script refreshes TTL on each access</p></div>
    </div>
</div>

<div class="section theme-green">
    <div class="section-title"><span class="section-num">13</span>Security Considerations</div>
    <div class="security-grid">
        <div class="security-card"><h3>DDoS Protection</h3><p>Rate limiting is first line; combine with WAF, IP reputation, CAPTCHA challenges</p></div>
        <div class="security-card"><h3>API Key Rotation</h3><p>Support multiple active keys per client; grace period during rotation</p></div>
        <div class="security-card"><h3>Admin API Protection</h3><p>Rate limit management APIs require ADMIN role; audit log all rule changes</p></div>
        <div class="security-card"><h3>Header Manipulation</h3><p>Never trust client-sent rate limit headers; compute server-side only</p></div>
        <div class="security-card"><h3>Enumeration Attack</h3><p>Generic 429 response without revealing which specific limit was hit</p></div>
    </div>
</div>

<div class="section theme-blue">
    <div class="section-title"><span class="section-num">14</span>Interview Cheat-Sheet</div>
    <div class="summary-grid">
        <div class="summary-card"><strong>Algorithms</strong><br>Token Bucket (smooth), Sliding Window Log (precise), Fixed Window (simple), Leaky Bucket (constant outflow)</div>
        <div class="summary-card"><strong>Redis Lua</strong><br>Atomic operations prevent race conditions; EVALSHA caches compiled scripts; &lt; 1ms latency</div>
        <div class="summary-card"><strong>Strategy Pattern</strong><br>IRateLimiter interface; select algorithm per endpoint/tier via Factory</div>
        <div class="summary-card"><strong>Headers</strong><br>X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset, Retry-After</div>
        <div class="summary-card"><strong>Distributed</strong><br>Redis Cluster for HA; hash tags for key locality; fail-open on Redis down</div>
        <div class="summary-card"><strong>Spring Integration</strong><br>OncePerRequestFilter or HandlerInterceptor; @Aspect for annotation-based limiting</div>
        <div class="summary-card"><strong>Scale</strong><br>100K QPS; 10M keys; ~2 GB Redis; &lt; 2ms overhead per request</div>
        <div class="summary-card"><strong>Trade-offs</strong><br>Token Bucket (burst-friendly) vs Sliding Window (precise but more memory)</div>
    </div>
</div>

</div></div>
<!-- END RATE LIMITER -->

<!-- ==================== PAYMENT SYSTEM ==================== -->
`
}
