export default {
  title: "System Design Essentials",
  subtitle: "Basic Steps & API Optimization for Interviews",
  subtitleColor: "#e8daff",
  headerGradient: "linear-gradient(135deg,#4527a0,#7c4dff,#b388ff)",
  footerText: "System Design Essentials",
  content: `
<!-- Sub-Section 1: Basic Things to Design System Design -->
<div class="section theme-green">
<div class="section-title"><span class="section-num">1</span> Basic Things to Design System Design</div>
<p style="color:#b0bec5;margin-bottom:18px;">Follow these 10 steps when approaching any system design interview question. This is your framework — apply it to every problem.</p>
<div class="flow-container">
<div class="flow-step"><div class="step-num">1</div><div class="step-text"><strong>Functional Requirements</strong><br>Define what the system should do — core features, user actions, use cases. E.g., "User can send a message", "User can create a short URL".</div></div>
<div class="flow-step"><div class="step-num">2</div><div class="step-text"><strong>Non-Functional Requirements</strong><br>Define quality attributes — low latency, high availability, consistency, durability, scalability, fault tolerance. These decide your architecture tradeoffs.</div></div>
<div class="flow-step"><div class="step-num">3</div><div class="step-text"><strong>Capacity & Estimation</strong><br>Estimate scale — DAU, QPS, storage, bandwidth. E.g., 100M users, 10K writes/sec, 1 PB storage over 5 years. This drives DB choice, sharding, and caching strategy.</div></div>
<div class="flow-step"><div class="step-num">4</div><div class="step-text"><strong>High-Level Design (HLD)</strong><br>Draw the big picture — clients, load balancer, API gateway, application servers, databases, caches, message queues, CDN. Show how components interact.</div></div>
<div class="flow-step"><div class="step-num">5</div><div class="step-text"><strong>Database Design</strong><br>Choose SQL vs NoSQL. Design tables/collections, define schemas, relationships (1:1, 1:N, M:N), primary keys, foreign keys. Consider denormalization for read-heavy systems.</div></div>
<div class="flow-step"><div class="step-num">6</div><div class="step-text"><strong>API Design</strong><br>Define REST/gRPC endpoints — HTTP methods, paths, request/response bodies, pagination, rate limiting headers. E.g., <code>POST /api/v1/messages</code>, <code>GET /api/v1/users/{id}</code>.</div></div>
<div class="flow-step"><div class="step-num">7</div><div class="step-text"><strong>Bottlenecks & Tradeoffs</strong><br>Identify single points of failure, hotspots, and bottlenecks. Discuss CAP theorem tradeoffs — consistency vs availability. Address read/write ratio impact.</div></div>
<div class="flow-step"><div class="step-num">8</div><div class="step-text"><strong>Scalability & Strategy</strong><br>Plan for growth — horizontal scaling, database sharding, read replicas, caching layers (L1/L2), CDN, auto-scaling groups, partitioning strategies.</div></div>
<div class="flow-step"><div class="step-num">9</div><div class="step-text"><strong>Security & Authentication</strong><br>JWT/OAuth2 authentication, role-based access control (RBAC), HTTPS/TLS, input validation, SQL injection prevention, rate limiting, API key management.</div></div>
<div class="flow-step"><div class="step-num">10</div><div class="step-text"><strong>Error Handling & Optimization</strong><br>Graceful degradation, circuit breakers, retry with exponential backoff, dead letter queues, health checks, monitoring (Prometheus/Grafana), logging (ELK stack).</div></div>
</div>
</div>

<!-- Sub-Section 2: Optimize the API -->
<div class="section theme-blue">
<div class="section-title"><span class="section-num">2</span> Optimize the API — 10 Key Techniques</div>
<p style="color:#b0bec5;margin-bottom:18px;">These are the top 10 strategies to make your APIs fast, scalable, and efficient. Use these in any system design discussion when asked "How would you optimize?"</p>

<div class="bottleneck-grid">

<div class="bottleneck-card">
<h4 style="color:#4fc3f7;">&#9889; 1. Caching</h4>
<p>Store frequently accessed data in temporary memory (Redis, Memcached) so you don't hit the database on every request. Response time drops from ~100ms to ~1ms.</p>
<div class="code-wrapper"><div class="code-titlebar"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span><span class="code-title">Spring Boot — Redis Cache</span></div>
<pre class="code-block"><span class="ann">@Cacheable</span>(value = <span class="st">"users"</span>, key = <span class="st">"#userId"</span>)
<span class="kw">public</span> <span class="tp">User</span> <span class="fn">getUserById</span>(<span class="tp">Long</span> userId) {
    <span class="kw">return</span> userRepository.<span class="fn">findById</span>(userId)
            .<span class="fn">orElseThrow</span>(() -> <span class="kw">new</span> <span class="tp">ResourceNotFoundException</span>(<span class="st">"User not found"</span>));
}</pre></div>
</div>

<div class="bottleneck-card">
<h4 style="color:#4fc3f7;">&#128269; 2. Database Indexing</h4>
<p>Add indexes on columns used in WHERE, JOIN, and ORDER BY clauses. Turns O(n) table scans into O(log n) index lookups.</p>
<div class="code-wrapper"><div class="code-titlebar"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span><span class="code-title">JPA Index Annotation</span></div>
<pre class="code-block"><span class="ann">@Table</span>(name = <span class="st">"orders"</span>, indexes = {
    <span class="ann">@Index</span>(name = <span class="st">"idx_user_id"</span>, columnList = <span class="st">"user_id"</span>),
    <span class="ann">@Index</span>(name = <span class="st">"idx_status_date"</span>, columnList = <span class="st">"status, created_at"</span>)
})
<span class="kw">public class</span> <span class="tp">Order</span> { ... }</pre></div>
</div>

<div class="bottleneck-card">
<h4 style="color:#4fc3f7;">&#128218; 3. Read Replica</h4>
<p>Create copies of the main database that handle read requests. Distributes read load — primary handles writes, replicas handle reads. Great for read-heavy systems (90% reads).</p>
<div class="code-wrapper"><div class="code-titlebar"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span><span class="code-title">application.yml — Read Replica Config</span></div>
<pre class="code-block"><span class="cm"># Primary — writes</span>
spring.datasource.primary.url=jdbc:mysql://primary-db:3306/app
<span class="cm"># Replica — reads</span>
spring.datasource.replica.url=jdbc:mysql://replica-db:3306/app</pre></div>
</div>

<div class="bottleneck-card">
<h4 style="color:#4fc3f7;">&#128256; 4. Database Sharding</h4>
<p>Split a large database into smaller parts (shards) distributed across multiple servers. Each shard holds a subset of data. Shard key (e.g., user_id % N) determines which shard stores a record.</p>
<div class="code-wrapper"><div class="code-titlebar"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span><span class="code-title">Shard Routing Logic</span></div>
<pre class="code-block"><span class="kw">public</span> <span class="tp">DataSource</span> <span class="fn">getShardForUser</span>(<span class="tp">Long</span> userId) {
    <span class="tp">int</span> shardId = (<span class="kw">int</span>) (userId % NUM_SHARDS);
    <span class="kw">return</span> shardDataSources.<span class="fn">get</span>(shardId);
}</pre></div>
</div>

<div class="bottleneck-card">
<h4 style="color:#4fc3f7;">&#9878; 5. Load Balancing</h4>
<p>Distribute incoming traffic across multiple servers so no single server gets overloaded. Use Round Robin, Least Connections, or IP Hash algorithms. Tools: Nginx, AWS ALB, HAProxy.</p>
<div class="code-wrapper"><div class="code-titlebar"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span><span class="code-title">Nginx Load Balancer Config</span></div>
<pre class="code-block">upstream backend {
    least_conn;
    server app1:8080;
    server app2:8080;
    server app3:8080;
}
server {
    location /api/ {
        proxy_pass http://backend;
    }
}</pre></div>
</div>

<div class="bottleneck-card">
<h4 style="color:#4fc3f7;">&#128233; 6. Queue / Async Processing</h4>
<p>Offload heavy tasks (email, video processing, report generation) to background workers via message queues (Kafka, RabbitMQ, SQS). User gets instant response while work happens asynchronously.</p>
<div class="code-wrapper"><div class="code-titlebar"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span><span class="code-title">Spring Kafka Producer</span></div>
<pre class="code-block"><span class="ann">@Autowired</span>
<span class="kw">private</span> <span class="tp">KafkaTemplate</span>&lt;<span class="tp">String</span>, <span class="tp">String</span>&gt; kafkaTemplate;

<span class="kw">public void</span> <span class="fn">processOrderAsync</span>(<span class="tp">Order</span> order) {
    kafkaTemplate.<span class="fn">send</span>(<span class="st">"order-processing"</span>, order.<span class="fn">toJson</span>());
    <span class="cm">// User gets immediate response — processing happens in background</span>
}</pre></div>
</div>

<div class="bottleneck-card">
<h4 style="color:#4fc3f7;">&#128200; 7. Horizontal Scaling</h4>
<p>Add more servers instead of upgrading a single server. Stateless services scale horizontally behind a load balancer. Use auto-scaling groups to handle traffic spikes automatically.</p>
<div class="code-wrapper"><div class="code-titlebar"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span><span class="code-title">Kubernetes HPA</span></div>
<pre class="code-block">apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
spec:
  minReplicas: 3
  maxReplicas: 20
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        averageUtilization: 70</pre></div>
</div>

<div class="bottleneck-card">
<h4 style="color:#4fc3f7;">&#127760; 8. Using CDN</h4>
<p>Serve static files (images, CSS, JS, videos) from the nearest edge server to the user. Reduces latency dramatically — content loads from a server 50ms away instead of 500ms.</p>
<div class="code-wrapper"><div class="code-titlebar"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span><span class="code-title">CDN Integration</span></div>
<pre class="code-block"><span class="cm">// Before: Serve from origin</span>
&lt;img src=<span class="st">"https://myserver.com/images/photo.jpg"</span>&gt;

<span class="cm">// After: Serve from CDN edge</span>
&lt;img src=<span class="st">"https://cdn.myapp.com/images/photo.jpg"</span>&gt;

<span class="cm">// CloudFront, Cloudflare, Akamai — cache at 300+ global edge locations</span></pre></div>
</div>

<div class="bottleneck-card">
<h4 style="color:#4fc3f7;">&#128270; 9. Query Optimization</h4>
<p>Write efficient queries — avoid SELECT *, use pagination, eliminate N+1 queries, use EXPLAIN ANALYZE, add proper JOINs instead of subqueries, use batch operations.</p>
<div class="code-wrapper"><div class="code-titlebar"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span><span class="code-title">JPA — Avoid N+1 with Fetch Join</span></div>
<pre class="code-block"><span class="cm">// BAD: N+1 problem — 1 query for orders + N queries for items</span>
List&lt;<span class="tp">Order</span>&gt; orders = orderRepository.<span class="fn">findAll</span>();

<span class="cm">// GOOD: Single query with JOIN FETCH</span>
<span class="ann">@Query</span>(<span class="st">"SELECT o FROM Order o JOIN FETCH o.items WHERE o.userId = :uid"</span>)
List&lt;<span class="tp">Order</span>&gt; <span class="fn">findOrdersWithItems</span>(<span class="ann">@Param</span>(<span class="st">"uid"</span>) <span class="tp">Long</span> uid);</pre></div>
</div>

<div class="bottleneck-card">
<h4 style="color:#4fc3f7;">&#128268; 10. Connection Pooling</h4>
<p>Reuse database connections instead of creating a new connection for every request. Creating a connection takes ~50ms; reusing from pool takes ~1ms. Use HikariCP (Spring Boot default).</p>
<div class="code-wrapper"><div class="code-titlebar"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span><span class="code-title">HikariCP Connection Pool Config</span></div>
<pre class="code-block">spring:
  datasource:
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
      idle-timeout: 300000        <span class="cm"># 5 minutes</span>
      max-lifetime: 1800000       <span class="cm"># 30 minutes</span>
      connection-timeout: 30000   <span class="cm"># 30 seconds</span></pre></div>
</div>

</div>
</div>

<!-- Quick Reference Summary -->
<div class="section theme-purple">
<div class="section-title"><span class="section-num">3</span> Quick Reference — Interview Cheat Sheet</div>
<div class="summary-grid">
<div class="summary-card"><h4>10 Steps for System Design</h4><p>1. Functional Req → 2. Non-Functional Req → 3. Capacity Estimation → 4. HLD → 5. DB Design → 6. API Design → 7. Bottlenecks & Tradeoffs → 8. Scalability → 9. Security & Auth → 10. Error Handling & Optimization</p></div>
<div class="summary-card"><h4>10 API Optimization Techniques</h4><p>1. Caching (Redis) → 2. DB Indexing → 3. Read Replicas → 4. DB Sharding → 5. Load Balancing → 6. Async/Queue (Kafka) → 7. Horizontal Scaling → 8. CDN → 9. Query Optimization → 10. Connection Pooling (HikariCP)</p></div>
<div class="summary-card"><h4>When Interviewer Asks "How to Scale?"</h4><p>Start with caching → add read replicas → shard the DB → put queue for async → horizontal scale behind LB → CDN for static → optimize queries → connection pool</p></div>
<div class="summary-card"><h4>Key Numbers to Remember</h4><p>Cache hit: ~1ms | DB query: ~10-100ms | Network: ~50-500ms | Disk I/O: ~5-20ms | New DB connection: ~50ms | Pooled connection: ~1ms | CDN edge: ~10-50ms</p></div>
</div>
</div>

</div>
<!-- END SYSTEM DESIGN -->

<!-- START LLD THEORY -->
`
}
