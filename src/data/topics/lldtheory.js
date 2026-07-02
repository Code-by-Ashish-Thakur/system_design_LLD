export default {
  title: "LLD Theory — Complete Guide",
  subtitle: "Basic se Advanced tak — Hinglish mein poora System Design Theory",
  subtitleColor: "#ffe0d0",
  headerGradient: "linear-gradient(135deg,#bf360c,#e64a19,#ff7043)",
  footerText: "LLD Theory — Complete Guide",
  content: `
<!-- 1. LATENCY -->
<div class="section theme-green">
<div class="section-title"><span class="section-num">1</span> Latency (Vilamb / Delay)</div>
<p style="color:#b0bec5;margin-bottom:12px;font-size:1.05em"><strong>Kya hai?</strong> — Jab aap koi request bhejte ho (jaise button click kiya) aur response aata hai, us beech ka time hi <b>Latency</b> hai. Simple words mein: <em>"Kitna time laga response aane mein?"</em></p>

<div class="bottleneck-grid">
<div class="bottleneck-card">
<h4 style="color:#66bb6a">Real Life Example</h4>
<p>Aap Zomato pe "Place Order" click karte ho → 200ms mein response aaya "Order Placed!" → Yeh 200ms hai latency.<br>Agar 3 second laga → high latency = bad user experience.</p>
</div>
<div class="bottleneck-card">
<h4 style="color:#66bb6a">Types of Latency</h4>
<p><b>1. Network Latency:</b> Data ka client se server tak jaane ka time (ping time)<br>
<b>2. Disk Latency:</b> Hard disk se data read karne ka time (~5-20ms HDD, ~0.1ms SSD)<br>
<b>3. Application Latency:</b> Server pe code execute hone ka time<br>
<b>4. Database Latency:</b> DB query run hone ka time</p>
</div>
<div class="bottleneck-card">
<h4 style="color:#66bb6a">Kaise Measure Karein?</h4>
<p><b>Command Line:</b><br><code>ping google.com</code> → network latency check<br><code>curl -w "%{time_total}" https://api.com</code> → total API time<br><br>
<b>Spring Boot:</b> Actuator + Micrometer se measure hota hai<br>
<b>Tools:</b> Prometheus, Grafana, New Relic, Jaeger (distributed tracing)</p>
</div>
<div class="bottleneck-card">
<h4 style="color:#66bb6a">Latency Kaise Kam Karein?</h4>
<p><b>1.</b> Caching use karo (Redis) → DB hit avoid<br>
<b>2.</b> CDN use karo → static content nearest server se<br>
<b>3.</b> Database indexing karo → query fast<br>
<b>4.</b> Connection pooling (HikariCP) → connection reuse<br>
<b>5.</b> Async processing → heavy task background mein<br>
<b>6.</b> gRPC use karo instead of REST → binary protocol faster hai</p>
</div>
</div>

<div class="code-wrapper"><div class="code-titlebar"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span><span class="code-title">Latency Numbers Every Developer Should Know</span></div>
<pre class="code-block"><span class="cm">// Approximate Latency Numbers (2024)</span>
L1 Cache Reference:                <span class="cn">0.5 ns</span>
L2 Cache Reference:                <span class="cn">7 ns</span>
RAM (Main Memory) Reference:       <span class="cn">100 ns</span>
SSD Random Read:                   <span class="cn">150,000 ns</span>  = 150 <span class="st">μs</span>
HDD Disk Seek:                     <span class="cn">10,000,000 ns</span> = 10 ms
Send packet CA → Netherlands:      <span class="cn">150,000,000 ns</span> = 150 ms
<span class="cm">
// Interview Tip:
// "Cache se 1ms, DB se 100ms, Network se 200ms"
// Yaad rakho — 100x difference har level pe</span></pre></div>
</div>

<!-- 2. THROUGHPUT -->
<div class="section theme-blue">
<div class="section-title"><span class="section-num">2</span> Throughput (Capacity / Processing Power)</div>
<p style="color:#b0bec5;margin-bottom:12px;font-size:1.05em"><strong>Kya hai?</strong> — Ek system ek second mein kitne requests handle kar sakta hai. Jaise highway pe 1 minute mein kitni gaadi nikal sakti hai — woh hai throughput.</p>

<div class="bottleneck-grid">
<div class="bottleneck-card">
<h4 style="color:#42a5f5">Units of Throughput</h4>
<p><b>RPS</b> — Requests Per Second (API server ke liye)<br>
<b>QPS</b> — Queries Per Second (Database ke liye)<br>
<b>TPS</b> — Transactions Per Second (Payment systems ke liye)<br>
<b>Mbps/Gbps</b> — Network throughput (bandwidth)</p>
</div>
<div class="bottleneck-card">
<h4 style="color:#42a5f5">Example</h4>
<p>Instagram: ~1 Lakh RPS (100K requests/sec) handle karta hai<br>
WhatsApp: ~50 Million messages/sec globally<br><br>
Agar tumhara server 500 RPS handle karta hai aur 1000 RPS aa rahe hain → server crash → scale karna padega!</p>
</div>
<div class="bottleneck-card">
<h4 style="color:#42a5f5">Latency vs Throughput</h4>
<p><b>Latency</b> = Ek request ka time (jaise ek gaadi ka travel time)<br>
<b>Throughput</b> = Kitni requests/sec (jaise kitni gaadi road pe chalti hain per hour)<br><br>
<em>Dono alag hain!</em> Low latency ho sakti hai but low throughput bhi (narrow road, fast car). High throughput possible hai with moderate latency (wide highway).</p>
</div>
<div class="bottleneck-card">
<h4 style="color:#42a5f5">Throughput Kaise Badhayein?</h4>
<p><b>1.</b> Horizontal scaling → more servers add karo<br>
<b>2.</b> Load balancer lagao → traffic distribute karo<br>
<b>3.</b> Async processing → queue mein daalo, parallel process karo<br>
<b>4.</b> Batch processing → ek-ek ki jagah batch mein kaam karo<br>
<b>5.</b> Connection pooling → connection reuse karo<br>
<b>6.</b> Caching → DB load kam karo</p>
</div>
</div>

<div class="code-wrapper"><div class="code-titlebar"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span><span class="code-title">Throughput Calculation Example</span></div>
<pre class="code-block"><span class="cm">// Scenario: E-commerce app with 10M DAU (Daily Active Users)</span>

Total users per day     = <span class="cn">10,000,000</span>
Average session         = <span class="cn">5 minutes</span>
Requests per session    = <span class="cn">20</span>
Total requests per day  = 10M × 20 = <span class="cn">200,000,000</span> (200M)

<span class="cm">// Peak hours = 4 hours mein 60% traffic</span>
Peak requests           = 200M × 0.6 = <span class="cn">120,000,000</span>
Peak seconds            = 4 × 3600 = <span class="cn">14,400 sec</span>
Peak RPS                = 120M / 14400 = <span class="cn">~8,333 RPS</span>

<span class="cm">// Agar 1 server 500 RPS handle karta hai:
// Servers needed = 8333 / 500 = ~17 servers (with buffer: 25 servers)</span></pre></div>
</div>

<!-- 3. AVAILABILITY -->
<div class="section theme-purple">
<div class="section-title"><span class="section-num">3</span> Availability (Uptime / System Chalu Rehna)</div>
<p style="color:#b0bec5;margin-bottom:12px;font-size:1.05em"><strong>Kya hai?</strong> — System kitne time tak chalu (available) rehta hai bina down hue. "5 Nines" (99.999%) ka matlab hai saal mein sirf 5 minute downtime!</p>

<div class="bottleneck-grid">
<div class="bottleneck-card">
<h4 style="color:#ab47bc">The Nines Table</h4>
<p><b>99% (2 nines)</b> → 3.65 days/year downtime<br>
<b>99.9% (3 nines)</b> → 8.76 hours/year downtime<br>
<b>99.99% (4 nines)</b> → 52.6 minutes/year downtime<br>
<b>99.999% (5 nines)</b> → 5.26 minutes/year downtime<br><br>
<em>AWS, Google Cloud target: 99.99% (4 nines)</em></p>
</div>
<div class="bottleneck-card">
<h4 style="color:#ab47bc">Availability vs Reliability</h4>
<p><b>Availability:</b> System accessible hai ya nahi (UP/DOWN)<br>
<b>Reliability:</b> System sahi result de raha hai ya nahi (CORRECT/WRONG)<br><br>
Example: Website open ho rahi hai (available ✓) lekin galat data dikha rahi hai (not reliable ✗). Dono chahiye!</p>
</div>
<div class="bottleneck-card">
<h4 style="color:#ab47bc">SLA / SLO / SLI</h4>
<p><b>SLA</b> (Service Level Agreement) → Company ka promise: "Hum 99.9% uptime denge, warna refund"<br>
<b>SLO</b> (Service Level Objective) → Internal target: "Hum 99.95% aim karenge"<br>
<b>SLI</b> (Service Level Indicator) → Actual measurement: "Last month 99.93% tha"</p>
</div>
<div class="bottleneck-card">
<h4 style="color:#ab47bc">High Availability Kaise Achieve Karein?</h4>
<p><b>1. Redundancy:</b> Multiple servers/DB rakho — ek fail ho toh doosra<br>
<b>2. Load Balancer:</b> Traffic healthy servers pe bhejo<br>
<b>3. Health Checks:</b> Har 10 sec server ko ping karo — dead server hata do<br>
<b>4. Auto-failover:</b> Primary DB down → automatic replica promote<br>
<b>5. Multi-region deploy:</b> Mumbai + Singapore — ek data center down toh doosra<br>
<b>6. Graceful degradation:</b> Partial features kaam karte rahein</p>
</div>
</div>

<div class="code-wrapper"><div class="code-titlebar"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span><span class="code-title">Availability Formula & Calculation</span></div>
<pre class="code-block"><span class="cm">// Availability = Uptime / (Uptime + Downtime) × 100</span>

<span class="cm">// Single server availability = 99.9%</span>
<span class="cm">// Probability of failure = 0.1%</span>

<span class="cm">// Two servers in PARALLEL (either one works = system works)</span>
Availability = 1 - (0.001 × 0.001) = 1 - 0.000001 = <span class="cn">99.9999%</span>
<span class="cm">// Dono ek saath fail hone ka chance bahut kam!</span>

<span class="cm">// Two servers in SERIES (both must work)</span>
Availability = 0.999 × 0.999 = <span class="cn">99.8%</span>
<span class="cm">// Series mein availability GHATTI — har component ek weak link hai</span>

<span class="cm">// Interview Tip:
// "Parallel = Availability badhti hai (redundancy)"
// "Series = Availability ghatti hai (dependency chain)"</span></pre></div>
</div>

<!-- 4. CAP Theorem -->
<div class="section theme-green">
<div class="section-title"><span class="section-num">4</span> CAP Theorem (Brewer's Theorem)</div>
<p style="color:#b0bec5;margin-bottom:12px;font-size:1.05em"><strong>Kya hai?</strong> — Ek distributed system mein teeno cheezein ek saath nahi mil sakti: <b>Consistency</b>, <b>Availability</b>, <b>Partition Tolerance</b>. Sirf 2 choose kar sakte ho. Yeh rule hai — tod nahi sakte!</p>

<div class="bottleneck-grid">
<div class="bottleneck-card">
<h4 style="color:#66bb6a">C — Consistency</h4>
<p><b>Matlab:</b> Har read request pe latest data milega. Agar Maine abhi update kiya → sabko turant updated data dikhega.<br><br>
<b>Example:</b> Bank balance ₹1000 hai. Maine ₹500 withdraw kiya. Ab kisi bhi ATM pe check karo → ₹500 hi dikhega. Kabhi stale ₹1000 nahi dikhega.</p>
</div>
<div class="bottleneck-card">
<h4 style="color:#66bb6a">A — Availability</h4>
<p><b>Matlab:</b> Har request ka response aayega (success ya failure) — system kabhi "no response" nahi dega.<br><br>
<b>Example:</b> WhatsApp pe message bheja → delivery hua ya nahi hua, kuch toh response milega. App hang nahi hoga.</p>
</div>
<div class="bottleneck-card">
<h4 style="color:#66bb6a">P — Partition Tolerance</h4>
<p><b>Matlab:</b> Agar network ke 2 parts disconnect ho jaayein (network partition) toh bhi system kaam karta rahe.<br><br>
<b>Example:</b> Mumbai server aur Delhi server ke beech ka network toot gaya. Dono apne-apne users ko serve karte rahein — yeh hai partition tolerance.<br><br>
<em>NOTE: P hamesha choose karna padta hai (network failure toh hoga hi!) → choice sirf C vs A ki hai.</em></p>
</div>
<div class="bottleneck-card">
<h4 style="color:#66bb6a">Real World Choices</h4>
<p><b>CP (Consistency + Partition):</b><br>→ MongoDB, HBase, Redis Cluster<br>→ Bank systems — galat balance nahi chalega!<br><br>
<b>AP (Availability + Partition):</b><br>→ Cassandra, DynamoDB, CouchDB<br>→ Social media — purana post dikhe chalega, but app down nahi hona chahiye<br><br>
<b>CA (Consistency + Availability):</b><br>→ Traditional SQL (PostgreSQL, MySQL single node)<br>→ Only possible when NO network partition (single machine)</p>
</div>
</div>

<div class="code-wrapper"><div class="code-titlebar"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span><span class="code-title">CAP Interview — Kaise Answer Karein</span></div>
<pre class="code-block"><span class="cm">// Interviewer: "WhatsApp ke liye kya choose karoge — CP ya AP?"</span>

<span class="cm">// Answer:</span>
<span class="st">"WhatsApp ke liye AP choose karunga because:</span>
<span class="st"> - User ko message delivery zyada important hai (Availability)</span>
<span class="st"> - Agar 2-3 second delay se message sync ho toh chalega (Eventual Consistency)</span>
<span class="st"> - App kabhi down nahi hona chahiye — 2B users hain"</span>

<span class="cm">// Interviewer: "Banking system ke liye?"</span>

<span class="st">"Banking ke liye CP choose karunga because:</span>
<span class="st"> - Galat balance dikhana CRITICAL failure hai</span>
<span class="st"> - 2 second wait acceptable hai but wrong data NEVER acceptable</span>
<span class="st"> - Strong consistency mandatory for financial transactions"</span></pre></div>
</div>

<!-- 5. Consistency Patterns -->
<div class="section theme-blue">
<div class="section-title"><span class="section-num">5</span> Consistency Patterns</div>
<p style="color:#b0bec5;margin-bottom:12px;font-size:1.05em"><strong>Kya hai?</strong> — Jab multiple servers pe data hota hai, toh sab servers pe data kab aur kaise sync hoga — uske different patterns hain.</p>

<div class="bottleneck-grid">
<div class="bottleneck-card">
<h4 style="color:#42a5f5">1. Strong Consistency</h4>
<p><b>Matlab:</b> Write ke baad koi bhi read kare → latest data milega. GUARANTEED.<br>
<b>Kaise:</b> Write tab tak complete nahi maana jata jab tak SAB replicas update na ho jaayein.<br>
<b>Downside:</b> Slow hai — har write pe sab replicas ka wait karna padta hai.<br>
<b>Use:</b> Banking, Stock Trading, Inventory count<br>
<b>DB:</b> PostgreSQL, MySQL (single master), Google Spanner</p>
</div>
<div class="bottleneck-card">
<h4 style="color:#42a5f5">2. Eventual Consistency</h4>
<p><b>Matlab:</b> Write ke baad thodi der purana data dikh sakta hai, but EVENTUALLY sab sync ho jayega.<br>
<b>Kaise:</b> Write sirf primary pe hota hai, replicas background mein async update hote hain.<br>
<b>Downside:</b> User ko 1-5 sec stale data dikh sakta hai.<br>
<b>Use:</b> Social media feeds, DNS, Shopping cart<br>
<b>DB:</b> DynamoDB, Cassandra, MongoDB (default)</p>
</div>
<div class="bottleneck-card">
<h4 style="color:#42a5f5">3. Causal Consistency</h4>
<p><b>Matlab:</b> Agar A event ke baad B hua → toh sabko pehle A dikhega phir B. Order maintain hoga for related events.<br>
<b>Example:</b> Comment ke baad Reply → sabko pehle comment dikhega phir reply. Unrelated posts ka order matter nahi karta.<br>
<b>Use:</b> Chat messages, Comment threads<br>
<b>DB:</b> MongoDB (with causal sessions)</p>
</div>
<div class="bottleneck-card">
<h4 style="color:#42a5f5">4. Read-Your-Writes Consistency</h4>
<p><b>Matlab:</b> Jo user ne likha woh user ko turant dikhega, doosron ko delay ho sakta hai.<br>
<b>Example:</b> Aapne profile photo change kiya → Aapko turant naya photo dikhega. Doosron ko 5 sec baad dikhega.<br>
<b>Kaise:</b> User ki reads hamesha primary server se karo, baaki replicas se.<br>
<b>Use:</b> Profile updates, Settings changes</p>
</div>
</div>

<div class="code-wrapper"><div class="code-titlebar"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span><span class="code-title">Consistency in Spring Boot — Example</span></div>
<pre class="code-block"><span class="cm">// Strong Consistency — Synchronous replication</span>
<span class="ann">@Transactional</span>(isolation = Isolation.<span class="cn">SERIALIZABLE</span>)
<span class="kw">public void</span> <span class="fn">transferMoney</span>(<span class="tp">Long</span> from, <span class="tp">Long</span> to, <span class="tp">BigDecimal</span> amount) {
    Account sender = accountRepo.<span class="fn">findByIdForUpdate</span>(from);  <span class="cm">// SELECT FOR UPDATE (lock)</span>
    Account receiver = accountRepo.<span class="fn">findByIdForUpdate</span>(to);
    sender.<span class="fn">debit</span>(amount);
    receiver.<span class="fn">credit</span>(amount);
    accountRepo.<span class="fn">saveAll</span>(List.<span class="fn">of</span>(sender, receiver));
    <span class="cm">// Dono save hone ke baad hi transaction commit hoga</span>
}

<span class="cm">// Eventual Consistency — Async event</span>
<span class="kw">public void</span> <span class="fn">updateUserProfile</span>(<span class="tp">UserDTO</span> dto) {
    userRepo.<span class="fn">save</span>(mapper.<span class="fn">toEntity</span>(dto));          <span class="cm">// Primary DB update</span>
    kafkaTemplate.<span class="fn">send</span>(<span class="st">"user-updates"</span>, dto);      <span class="cm">// Async event → replicas/cache update later</span>
    <span class="cm">// User ko turant response, cache 2-3 sec mein update hoga</span>
}</pre></div>
</div>

<!-- 6. Scaling -->
<div class="section theme-purple">
<div class="section-title"><span class="section-num">6</span> Scaling (System Ko Bada Banana)</div>
<p style="color:#b0bec5;margin-bottom:12px;font-size:1.05em"><strong>Kya hai?</strong> — Jab users badh jaayein toh system ko zyada traffic handle karne laayak banana. Do tarike hain — Vertical aur Horizontal.</p>

<div class="bottleneck-grid">
<div class="bottleneck-card">
<h4 style="color:#ab47bc">Vertical Scaling (Scale Up)</h4>
<p><b>Matlab:</b> Existing server ko powerful banana — zyada RAM, CPU, SSD lagao.<br>
<b>Example:</b> 8GB RAM → 64GB RAM, 4 core → 32 core<br>
<b>Pros:</b> Simple hai, code change nahi karna padta<br>
<b>Cons:</b> Limit hai (kitna bada karoge?), expensive, single point of failure<br>
<b>Use:</b> Small apps, databases (initially)</p>
</div>
<div class="bottleneck-card">
<h4 style="color:#ab47bc">Horizontal Scaling (Scale Out)</h4>
<p><b>Matlab:</b> Zyada servers add karo — load distribute karo multiple machines pe.<br>
<b>Example:</b> 1 server → 10 servers + Load Balancer<br>
<b>Pros:</b> Unlimited scaling, no single point of failure, cost effective<br>
<b>Cons:</b> Complex — distributed systems ke problems (consistency, network)<br>
<b>Use:</b> Large apps — Netflix, Amazon, Google</p>
</div>
<div class="bottleneck-card">
<h4 style="color:#ab47bc">Kab Kya Use Karein?</h4>
<p><b>Start:</b> Vertical scaling (simple, fast)<br>
<b>Grow:</b> Horizontal scaling (jab vertical limit hit ho)<br>
<b>Database:</b> Pehle vertical → phir read replicas → phir sharding<br>
<b>Application:</b> Stateless banao → horizontal scale karo easily<br><br>
<em>Interview Tip: "Hamesha stateless design karo taki horizontal scaling easy ho. Session data Redis mein rakho, server pe nahi."</em></p>
</div>
<div class="bottleneck-card">
<h4 style="color:#ab47bc">Stateless vs Stateful</h4>
<p><b>Stateless:</b> Server pe koi user data store nahi — har request independent. Koi bhi server handle kar sakta hai. Horizontally scalable!<br>
<b>Stateful:</b> Server pe session/data store hai — user ko SAME server pe bhejne padega. Scaling mushkil!<br><br>
<b>Rule:</b> Application layer ALWAYS stateless rakho. State → Redis/DB mein.</p>
</div>
</div>
</div>

<!-- 7. Load Balancing -->
<div class="section theme-green">
<div class="section-title"><span class="section-num">7</span> Load Balancing (Traffic Baantna)</div>
<p style="color:#b0bec5;margin-bottom:12px;font-size:1.05em"><strong>Kya hai?</strong> — Incoming traffic ko multiple servers mein distribute karna taki koi ek server overload na ho. Jaise traffic police gaadiyaan alag-alag roads pe bhejti hai.</p>

<div class="bottleneck-grid">
<div class="bottleneck-card">
<h4 style="color:#66bb6a">Load Balancing Algorithms</h4>
<p><b>1. Round Robin:</b> Ek-ek karke sabko baari-baari — S1→S2→S3→S1...<br>
<b>2. Weighted Round Robin:</b> Powerful server ko zyada requests<br>
<b>3. Least Connections:</b> Jis server pe sabse kam connections hain usko bhejo<br>
<b>4. IP Hash:</b> Client IP se hash → hamesha same server (sticky session)<br>
<b>5. Random:</b> Random server choose karo<br>
<b>6. Least Response Time:</b> Jo server fastest respond kar raha hai</p>
</div>
<div class="bottleneck-card">
<h4 style="color:#66bb6a">Types of Load Balancers</h4>
<p><b>Layer 4 (Transport):</b> TCP/UDP level pe route karta hai — IP + Port dekh ke. Fast but basic.<br>
<b>Layer 7 (Application):</b> HTTP level pe route — URL, headers, cookies dekh ke. Smarter but slower.<br><br>
<b>Hardware LB:</b> F5, Citrix — expensive, dedicated device<br>
<b>Software LB:</b> Nginx, HAProxy, AWS ALB — cheap, flexible<br>
<b>DNS LB:</b> Route53 — DNS level pe traffic route</p>
</div>
<div class="bottleneck-card">
<h4 style="color:#66bb6a">Health Checks</h4>
<p><b>Kya:</b> Load balancer har 10-30 sec mein servers ko ping karta hai<br>
<b>Kaise:</b> <code>GET /health</code> endpoint hit karta hai<br>
<b>Agar:</b> Server respond nahi karta → unhealthy mark → traffic bhejne band<br>
<b>Jab:</b> Server wapas respond kare → healthy mark → traffic phir bhejne lage<br><br>
<em>Isse automatic failover hota hai — no manual intervention needed!</em></p>
</div>
<div class="bottleneck-card">
<h4 style="color:#66bb6a">Interview Example</h4>
<p><b>Q: "Ek server down ho jaaye toh kya hoga?"</b><br>
A: "Load balancer health check fail detect karega → us server ko pool se hata dega → traffic baaki servers pe redirect → zero downtime for users."<br><br>
<b>Q: "Session management kaise karoge?"</b><br>
A: "Sticky sessions avoid karunga. Session data Redis mein store karunga → koi bhi server session read kar sakta hai → truly stateless."</p>
</div>
</div>

<div class="code-wrapper"><div class="code-titlebar"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span><span class="code-title">Nginx Load Balancer — Full Config</span></div>
<pre class="code-block"><span class="cm"># nginx.conf — Layer 7 Load Balancer</span>
upstream backend_servers {
    least_conn;                        <span class="cm"># Least connections algorithm</span>
    server app1.internal:8080 weight=3; <span class="cm"># 3x zyada traffic (powerful server)</span>
    server app2.internal:8080 weight=1;
    server app3.internal:8080 weight=1;
    server app4.internal:8080 backup;   <span class="cm"># Sirf tab use hoga jab baaki down</span>
}

server {
    listen 80;
    location /api/ {
        proxy_pass http://backend_servers;
        proxy_set_header X-Real-IP $remote_addr;
        health_check interval=10 fails=3 passes=2;
        <span class="cm"># Har 10 sec check, 3 fail = unhealthy, 2 pass = healthy</span>
    }
}</pre></div>
</div>

<!-- 8. Caching -->
<div class="section theme-blue">
<div class="section-title"><span class="section-num">8</span> Caching (Data Ko Memory Mein Rakhna)</div>
<p style="color:#b0bec5;margin-bottom:12px;font-size:1.05em"><strong>Kya hai?</strong> — Frequently accessed data ko fast memory (RAM) mein store karna taki DB ko baar-baar hit na karna pade. DB query = 100ms, Cache hit = 1ms — 100x faster!</p>

<div class="bottleneck-grid">
<div class="bottleneck-card">
<h4 style="color:#42a5f5">Caching Levels</h4>
<p><b>L1 — Browser Cache:</b> User ke browser mein (CSS, JS, images)<br>
<b>L2 — CDN Cache:</b> Edge servers pe (static content)<br>
<b>L3 — Application Cache:</b> Server memory mein (in-process, Caffeine)<br>
<b>L4 — Distributed Cache:</b> Redis/Memcached (shared across servers)<br>
<b>L5 — Database Cache:</b> DB ka internal buffer pool</p>
</div>
<div class="bottleneck-card">
<h4 style="color:#42a5f5">Cache Strategies</h4>
<p><b>1. Cache-Aside (Lazy Loading):</b><br>App pehle cache check kare → miss toh DB se lao → cache mein daal do<br><br>
<b>2. Write-Through:</b><br>Write pe cache + DB dono update karo simultaneously<br><br>
<b>3. Write-Behind (Write-Back):</b><br>Write pe sirf cache update → background mein DB update<br><br>
<b>4. Read-Through:</b><br>Cache automatically DB se data load kare on miss</p>
</div>
<div class="bottleneck-card">
<h4 style="color:#42a5f5">Cache Eviction Policies</h4>
<p><b>LRU (Least Recently Used):</b> Jo sabse purana access hua woh hataao — MOST COMMON<br>
<b>LFU (Least Frequently Used):</b> Jo sabse kam baar access hua woh hataao<br>
<b>FIFO (First In First Out):</b> Jo pehle aaya woh pehle hataao<br>
<b>TTL (Time To Live):</b> Fixed time ke baad automatic expire<br><br>
<em>Interview: "Main LRU with TTL use karunga — popular data cache mein rahega, stale data TTL se expire hoga"</em></p>
</div>
<div class="bottleneck-card">
<h4 style="color:#42a5f5">Cache Problems</h4>
<p><b>Cache Stampede:</b> Cache expire hua → 1000 requests ek saath DB pe! Fix: Locking — sirf ek thread DB hit kare.<br>
<b>Cache Penetration:</b> Jo data DB mein bhi nahi hai uski requests — cache miss → DB miss → repeat. Fix: Bloom Filter ya null cache.<br>
<b>Cache Avalanche:</b> Bahut saare keys ek saath expire. Fix: Random TTL add karo.<br>
<b>Stale Data:</b> Cache mein purana data. Fix: TTL + event-based invalidation.</p>
</div>
</div>

<div class="code-wrapper"><div class="code-titlebar"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span><span class="code-title">Spring Boot + Redis Cache — Complete Example</span></div>
<pre class="code-block"><span class="cm">// 1. application.yml</span>
spring:
  redis:
    host: localhost
    port: <span class="cn">6379</span>
  cache:
    type: redis
    redis:
      time-to-live: <span class="cn">600000</span>  <span class="cm"># 10 minutes TTL</span>

<span class="cm">// 2. Config class</span>
<span class="ann">@Configuration</span>
<span class="ann">@EnableCaching</span>
<span class="kw">public class</span> <span class="tp">RedisConfig</span> { }

<span class="cm">// 3. Service — Cache-Aside Pattern</span>
<span class="ann">@Cacheable</span>(value = <span class="st">"products"</span>, key = <span class="st">"#id"</span>)          <span class="cm">// GET → cache se</span>
<span class="kw">public</span> <span class="tp">Product</span> <span class="fn">getProduct</span>(<span class="tp">Long</span> id) { <span class="kw">return</span> productRepo.<span class="fn">findById</span>(id).<span class="fn">orElseThrow</span>(); }

<span class="ann">@CachePut</span>(value = <span class="st">"products"</span>, key = <span class="st">"#product.id"</span>)    <span class="cm">// UPDATE → cache + DB</span>
<span class="kw">public</span> <span class="tp">Product</span> <span class="fn">updateProduct</span>(<span class="tp">Product</span> product) { <span class="kw">return</span> productRepo.<span class="fn">save</span>(product); }

<span class="ann">@CacheEvict</span>(value = <span class="st">"products"</span>, key = <span class="st">"#id"</span>)          <span class="cm">// DELETE → cache se hataao</span>
<span class="kw">public void</span> <span class="fn">deleteProduct</span>(<span class="tp">Long</span> id) { productRepo.<span class="fn">deleteById</span>(id); }</pre></div>
</div>

<!-- 9. SQL vs NoSQL -->
<div class="section theme-purple">
<div class="section-title"><span class="section-num">9</span> SQL vs NoSQL Databases</div>
<p style="color:#b0bec5;margin-bottom:12px;font-size:1.05em"><strong>Kya hai?</strong> — Data kahan store karein? Structured data ke liye SQL (tables), unstructured/flexible data ke liye NoSQL (documents, key-value). Dono ke apne use cases hain.</p>

<div class="bottleneck-grid">
<div class="bottleneck-card">
<h4 style="color:#ab47bc">SQL (Relational Databases)</h4>
<p><b>Examples:</b> MySQL, PostgreSQL, Oracle<br>
<b>Structure:</b> Tables with rows & columns, fixed schema<br>
<b>Query:</b> SQL language (SELECT, JOIN, WHERE)<br>
<b>ACID:</b> Full ACID transactions supported<br>
<b>Scaling:</b> Vertical mainly, horizontal mushkil<br>
<b>Best for:</b> Banking, E-commerce orders, User accounts — jahan relationships important hain</p>
</div>
<div class="bottleneck-card">
<h4 style="color:#ab47bc">NoSQL (Non-Relational)</h4>
<p><b>Types:</b><br>
&#8226; <b>Document DB:</b> MongoDB — JSON documents, flexible schema<br>
&#8226; <b>Key-Value:</b> Redis, DynamoDB — fast lookup by key<br>
&#8226; <b>Column-Family:</b> Cassandra, HBase — wide columns, time-series<br>
&#8226; <b>Graph DB:</b> Neo4j — relationships between entities<br>
<b>Best for:</b> Social feeds, real-time analytics, IoT data, session store</p>
</div>
<div class="bottleneck-card">
<h4 style="color:#ab47bc">Kab Kya Choose Karein?</h4>
<p><b>SQL choose karo jab:</b><br>
&#8226; Data structured hai (fixed columns)<br>
&#8226; Relationships complex hain (JOINs chahiye)<br>
&#8226; ACID transactions zaroori hain (banking)<br>
&#8226; Data integrity critical hai<br><br>
<b>NoSQL choose karo jab:</b><br>
&#8226; Schema flexible chahiye (schema-less)<br>
&#8226; Massive scale chahiye (horizontal scaling)<br>
&#8226; High write throughput chahiye<br>
&#8226; Data denormalized store karna hai</p>
</div>
<div class="bottleneck-card">
<h4 style="color:#ab47bc">ACID vs BASE</h4>
<p><b>ACID (SQL):</b><br>
<b>A</b>tomic — Sab ya kuch nahi (all or nothing)<br>
<b>C</b>onsistent — Data rules follow karega<br>
<b>I</b>solated — Transactions ek doosre ko affect nahi karenge<br>
<b>D</b>urable — Commit hua toh permanent hai<br><br>
<b>BASE (NoSQL):</b><br>
<b>B</b>asically <b>A</b>vailable — System hamesha respond karega<br>
<b>S</b>oft state — Data change ho sakta hai over time<br>
<b>E</b>ventually consistent — Sab sync ho jayega... eventually</p>
</div>
</div>

<div class="code-wrapper"><div class="code-titlebar"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span><span class="code-title">Interview — System Design Database Choice</span></div>
<pre class="code-block"><span class="cm">// WhatsApp Messages → NoSQL (Cassandra)</span>
<span class="cm">// Why? Massive writes, time-series data, no complex JOINs needed</span>

<span class="cm">// Amazon Orders → SQL (PostgreSQL)</span>
<span class="cm">// Why? ACID for payments, complex relationships (user→order→items→payment)</span>

<span class="cm">// Instagram Feed → NoSQL (DynamoDB) + SQL (PostgreSQL)</span>
<span class="cm">// Why? Feed = high read/write, fast → NoSQL</span>
<span class="cm">//       User accounts = structured, ACID → SQL</span>

<span class="cm">// Netflix Recommendations → Graph DB (Neo4j) + NoSQL</span>
<span class="cm">// Why? User↔Movie relationships → Graph DB</span>
<span class="cm">//       Movie metadata, watch history → NoSQL</span>

<span class="cm">// Session Store → Key-Value (Redis)</span>
<span class="cm">// Why? Simple key lookup, fast, TTL support, in-memory</span>

<span class="cm">// RULE: Most real systems use POLYGLOT PERSISTENCE</span>
<span class="cm">// = Multiple DB types for different use cases!</span></pre></div>
</div>

<!-- 10. Database Indexing -->
<div class="section theme-green">
<div class="section-title"><span class="section-num">10</span> Database Indexing (Search Ko Fast Banana)</div>
<p style="color:#b0bec5;margin-bottom:12px;font-size:1.05em"><strong>Kya hai?</strong> — Index ek "shortcut" hai jo DB ko directly correct row tak le jaata hai — bina poori table scan kiye. Jaise book ka index page — direct page number mil jaata hai!</p>

<div class="bottleneck-grid">
<div class="bottleneck-card">
<h4 style="color:#66bb6a">Without Index vs With Index</h4>
<p><b>Without:</b> <code>SELECT * FROM users WHERE email='a@b.com'</code><br>
DB poori table scan karega — 10 million rows check karega → <b>O(n) = 10 sec</b><br><br>
<b>With Index on email:</b><br>
DB seedha index mein search karega (B-Tree) → <b>O(log n) = 10ms</b><br><br>
<em>1000x faster! Yeh hai indexing ki taakat.</em></p>
</div>
<div class="bottleneck-card">
<h4 style="color:#66bb6a">Types of Indexes</h4>
<p><b>1. B-Tree Index:</b> Default, most common. Range queries + equality. <code>WHERE age > 25</code><br>
<b>2. Hash Index:</b> Sirf equality. <code>WHERE id = 5</code> → O(1) but no range<br>
<b>3. Composite Index:</b> Multiple columns pe. <code>(user_id, created_at)</code><br>
<b>4. Unique Index:</b> Duplicate values prevent karta hai<br>
<b>5. Full-Text Index:</b> Text search ke liye. <code>WHERE title LIKE '%spring%'</code><br>
<b>6. Partial Index:</b> Sirf kuch rows pe. <code>WHERE status='ACTIVE'</code></p>
</div>
<div class="bottleneck-card">
<h4 style="color:#66bb6a">Kab Index Lagayein?</h4>
<p><b>Lagao:</b><br>
&#8226; WHERE clause mein frequently used columns<br>
&#8226; JOIN conditions (foreign keys)<br>
&#8226; ORDER BY columns<br>
&#8226; Unique constraints (email, username)<br><br>
<b>Mat lagao:</b><br>
&#8226; Jis column mein bahut kam unique values (boolean)<br>
&#8226; Choti tables pe (full scan faster hoga)<br>
&#8226; Write-heavy tables pe (har write pe index update hoga)</p>
</div>
<div class="bottleneck-card">
<h4 style="color:#66bb6a">Index Ka Downside</h4>
<p><b>1. Write slow hota hai:</b> Har INSERT/UPDATE pe index bhi update → extra time<br>
<b>2. Extra storage:</b> Index ka apna space lagta hai (~10-20% extra)<br>
<b>3. Too many indexes:</b> Write performance bahut gir jaati hai<br><br>
<b>Rule:</b> Read-heavy tables pe zyada indexes OK. Write-heavy tables pe kam rakho.<br>
<b>Command:</b> <code>EXPLAIN ANALYZE SELECT...</code> — query plan dekhne ke liye</p>
</div>
</div>

<div class="code-wrapper"><div class="code-titlebar"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span><span class="code-title">Indexing in JPA + SQL</span></div>
<pre class="code-block"><span class="cm">// JPA Entity — Add indexes</span>
<span class="ann">@Entity</span>
<span class="ann">@Table</span>(name = <span class="st">"orders"</span>, indexes = {
    <span class="ann">@Index</span>(name = <span class="st">"idx_user_id"</span>, columnList = <span class="st">"user_id"</span>),
    <span class="ann">@Index</span>(name = <span class="st">"idx_status_date"</span>, columnList = <span class="st">"status, created_at"</span>),
    <span class="ann">@Index</span>(name = <span class="st">"idx_email"</span>, columnList = <span class="st">"email"</span>, unique = <span class="cn">true</span>)
})
<span class="kw">public class</span> <span class="tp">Order</span> { ... }

<span class="cm">// SQL — Check if index is being used</span>
EXPLAIN ANALYZE <span class="kw">SELECT</span> * <span class="kw">FROM</span> orders <span class="kw">WHERE</span> user_id = <span class="cn">123</span>;
<span class="cm">// Output: "Index Scan using idx_user_id" → ✓ Index used!</span>
<span class="cm">// Output: "Seq Scan on orders" → ✗ Full table scan — index missing!</span>

<span class="cm">// Composite Index — Column ORDER matters!</span>
<span class="cm">// Index on (user_id, created_at) works for:</span>
<span class="cm">//   WHERE user_id = 5                    ✓ (leftmost prefix)</span>
<span class="cm">//   WHERE user_id = 5 AND created_at > x ✓ (both columns)</span>
<span class="cm">//   WHERE created_at > x                 ✗ (skipped leftmost!)</span></pre></div>
</div>

<!-- 11. Database Sharding -->
<div class="section theme-blue">
<div class="section-title"><span class="section-num">11</span> Database Sharding (DB Ko Todna)</div>
<p style="color:#b0bec5;margin-bottom:12px;font-size:1.05em"><strong>Kya hai?</strong> — Ek badi database ko chhote-chhote parts (shards) mein divide karna aur alag-alag servers pe rakhna. Jaise library ke books ko multiple rooms mein divide karna — A-M ek room, N-Z doosra room.</p>

<div class="bottleneck-grid">
<div class="bottleneck-card">
<h4 style="color:#42a5f5">Sharding Strategies</h4>
<p><b>1. Hash-Based:</b> <code>shard = hash(user_id) % N</code><br>Even distribution, but resharding mushkil<br><br>
<b>2. Range-Based:</b> <code>A-M → Shard1, N-Z → Shard2</code><br>Simple, but hotspot problem (popular ranges)<br><br>
<b>3. Geographic:</b> India → Shard1, US → Shard2<br>Low latency for local users<br><br>
<b>4. Directory-Based:</b> Lookup table batata hai ki kaunsa data kahan — flexible but lookup table = bottleneck</p>
</div>
<div class="bottleneck-card">
<h4 style="color:#42a5f5">Shard Key Kaise Choose Karein?</h4>
<p><b>Good Shard Key:</b><br>
&#8226; High cardinality (bahut unique values) — user_id ✓<br>
&#8226; Even distribution — requests sab shards pe equal<br>
&#8226; Query pattern match kare — queries same shard pe<br><br>
<b>Bad Shard Key:</b><br>
&#8226; country — India mein bahut users, Iceland mein kam → hotspot!<br>
&#8226; created_date — latest shard pe saara traffic<br>
&#8226; boolean (is_active) — sirf 2 values → 2 shards mein sara data</p>
</div>
<div class="bottleneck-card">
<h4 style="color:#42a5f5">Sharding ke Problems</h4>
<p><b>1. Cross-shard queries:</b> 2 alag shards ka data JOIN karna — slow & complex<br>
<b>2. Resharding:</b> Shards badhane pe data migrate karna — painful<br>
<b>3. Hotspot:</b> Ek shard pe zyada traffic → overload<br>
<b>4. Referential integrity:</b> Foreign keys across shards work nahi karti<br>
<b>5. Distributed transactions:</b> 2-phase commit chahiye → slow</p>
</div>
<div class="bottleneck-card">
<h4 style="color:#42a5f5">Kab Sharding Karein?</h4>
<p><b>Pehle try karo:</b><br>
1. Query optimization + Indexing<br>
2. Vertical scaling (bigger machine)<br>
3. Read replicas (read traffic distribute)<br>
4. Caching (Redis)<br><br>
<b>Phir sharding karo jab:</b><br>
&#8226; Single server ka storage full ho raha ho (>1TB)<br>
&#8226; Write throughput limit hit ho rahi ho<br>
&#8226; Saari above techniques try kar chuke ho</p>
</div>
</div>
</div>

<!-- 12. Database Replication -->
<div class="section theme-purple">
<div class="section-title"><span class="section-num">12</span> Database Replication (DB Ki Copies Banana)</div>
<p style="color:#b0bec5;margin-bottom:12px;font-size:1.05em"><strong>Kya hai?</strong> — Primary database ki copies (replicas) banana taki read traffic distribute ho sake aur data backup rahe. Primary pe write hota hai, replicas pe read hota hai.</p>

<div class="bottleneck-grid">
<div class="bottleneck-card">
<h4 style="color:#ab47bc">Replication Types</h4>
<p><b>1. Master-Slave (Primary-Replica):</b><br>
1 Master → writes handle kare<br>
N Slaves → reads handle karein<br>
Master se data async/sync slave ko copy hota hai<br><br>
<b>2. Master-Master (Multi-Primary):</b><br>
Multiple masters — sab pe write ho sakta hai<br>
Conflict resolution complex hai<br>
Use: Multi-region deployment</p>
</div>
<div class="bottleneck-card">
<h4 style="color:#ab47bc">Sync vs Async Replication</h4>
<p><b>Synchronous:</b><br>
Write tab complete maana jata hai jab primary + replica dono update ho jaayein<br>
Strong consistency ✓ | Slow writes ✗<br><br>
<b>Asynchronous:</b><br>
Primary pe write hote hi response → replica background mein update<br>
Fast writes ✓ | Eventual consistency (stale reads possible) ✗<br><br>
<b>Semi-Synchronous:</b> At least 1 replica sync + baaki async — good balance!</p>
</div>
<div class="bottleneck-card">
<h4 style="color:#ab47bc">Failover Process</h4>
<p><b>Master down hone pe:</b><br>
1. Health check detect karta hai — master not responding<br>
2. Most up-to-date replica select hoti hai<br>
3. Us replica ko promote karte hain → new master<br>
4. Baaki replicas naye master se sync karne lagti hain<br>
5. Application ka DB connection naye master pe point karo<br><br>
<b>Tools:</b> AWS RDS Multi-AZ (automatic failover), Redis Sentinel</p>
</div>
<div class="bottleneck-card">
<h4 style="color:#ab47bc">Replication vs Sharding</h4>
<p><b>Replication:</b> Same data multiple servers pe → READ scale + HA<br>
<b>Sharding:</b> Different data different servers pe → WRITE scale + storage<br><br>
<b>Best Practice:</b> Dono saath use karo!<br>
Each shard ki apni replicas hoti hain:<br>
<code>Shard1: Primary + 2 Replicas</code><br>
<code>Shard2: Primary + 2 Replicas</code><br>
= Read scale + Write scale + High Availability</p>
</div>
</div>
</div>

<!-- 13. Message Queues -->
<div class="section theme-green">
<div class="section-title"><span class="section-num">13</span> Message Queues (Async Communication)</div>
<p style="color:#b0bec5;margin-bottom:12px;font-size:1.05em"><strong>Kya hai?</strong> — Ek system hai jo messages ko temporarily store karta hai aur producers se consumers tak deliver karta hai — asynchronously. Jaise post office — aap letter daalo, wo deliver karega, aapko wait nahi karna.</p>

<div class="bottleneck-grid">
<div class="bottleneck-card">
<h4 style="color:#66bb6a">Kyu Use Karein?</h4>
<p><b>1. Decoupling:</b> Services ek doosre pe directly depend nahi karti<br>
<b>2. Async Processing:</b> Heavy tasks (email, video encode) background mein<br>
<b>3. Load Leveling:</b> Spike aaye toh queue mein store, slowly process<br>
<b>4. Reliability:</b> Consumer down hai → message queue mein wait karega<br>
<b>5. Scalability:</b> Multiple consumers parallel process kar sakte hain</p>
</div>
<div class="bottleneck-card">
<h4 style="color:#66bb6a">Popular Message Queues</h4>
<p><b>Apache Kafka:</b> High throughput, log-based, replay possible. Best for event streaming, analytics<br>
<b>RabbitMQ:</b> Traditional message broker, routing flexible. Best for task queues, RPC<br>
<b>Amazon SQS:</b> Fully managed, serverless. Easy to start, no maintenance<br>
<b>Redis Pub/Sub:</b> Simple, in-memory. Best for real-time notifications but no persistence</p>
</div>
<div class="bottleneck-card">
<h4 style="color:#66bb6a">Kafka vs RabbitMQ</h4>
<p><b>Kafka:</b><br>
&#8226; Messages persist on disk (replay possible)<br>
&#8226; Consumer groups — parallel consumption<br>
&#8226; Millions of messages/sec throughput<br>
&#8226; Use: Event sourcing, log aggregation, stream processing<br><br>
<b>RabbitMQ:</b><br>
&#8226; Message acknowledge → delete from queue<br>
&#8226; Complex routing (exchanges, bindings)<br>
&#8226; Lower latency per message<br>
&#8226; Use: Task queues, email sending, order processing</p>
</div>
<div class="bottleneck-card">
<h4 style="color:#66bb6a">Message Delivery Guarantees</h4>
<p><b>At-Most-Once:</b> Message 1 baar ya 0 baar deliver — fast but data loss possible<br>
<b>At-Least-Once:</b> Message kam se kam 1 baar deliver — duplicates possible → need idempotency<br>
<b>Exactly-Once:</b> Message exactly 1 baar deliver — complex to achieve (Kafka supports with transactions)<br><br>
<em>Interview: "At-least-once + idempotent consumer = safest practical approach"</em></p>
</div>
</div>

<div class="code-wrapper"><div class="code-titlebar"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span><span class="code-title">Spring Boot + Kafka — Producer & Consumer</span></div>
<pre class="code-block"><span class="cm">// Producer — Order placed → send to queue</span>
<span class="ann">@Service</span>
<span class="kw">public class</span> <span class="tp">OrderService</span> {
    <span class="ann">@Autowired</span> <span class="kw">private</span> <span class="tp">KafkaTemplate</span>&lt;<span class="tp">String</span>, <span class="tp">String</span>&gt; kafka;

    <span class="kw">public</span> <span class="tp">Order</span> <span class="fn">placeOrder</span>(<span class="tp">OrderDTO</span> dto) {
        Order order = orderRepo.<span class="fn">save</span>(mapper.<span class="fn">toEntity</span>(dto));
        kafka.<span class="fn">send</span>(<span class="st">"order-events"</span>, order.<span class="fn">toJson</span>());  <span class="cm">// Async!</span>
        <span class="kw">return</span> order;  <span class="cm">// User ko turant response</span>
    }
}

<span class="cm">// Consumer — Background mein process</span>
<span class="ann">@Component</span>
<span class="kw">public class</span> <span class="tp">OrderConsumer</span> {
    <span class="ann">@KafkaListener</span>(topics = <span class="st">"order-events"</span>, groupId = <span class="st">"order-group"</span>)
    <span class="kw">public void</span> <span class="fn">handleOrder</span>(<span class="tp">String</span> message) {
        Order order = <span class="tp">Order</span>.<span class="fn">fromJson</span>(message);
        emailService.<span class="fn">sendConfirmation</span>(order);     <span class="cm">// Email bhejo</span>
        inventoryService.<span class="fn">reduceStock</span>(order);      <span class="cm">// Stock update</span>
        analyticsService.<span class="fn">trackOrder</span>(order);       <span class="cm">// Analytics</span>
    }
}</pre></div>
</div>

<!-- 14. Microservices vs Monolith -->
<div class="section theme-blue">
<div class="section-title"><span class="section-num">14</span> Microservices vs Monolith Architecture</div>
<p style="color:#b0bec5;margin-bottom:12px;font-size:1.05em"><strong>Kya hai?</strong> — Application ko kaise structure karein? Ek bada codebase (Monolith) ya chhote independent services (Microservices)? Dono ka apna time aur jagah hai.</p>

<div class="bottleneck-grid">
<div class="bottleneck-card">
<h4 style="color:#42a5f5">Monolith Architecture</h4>
<p><b>Kya:</b> Poora application ek single codebase, ek deployable unit<br>
<b>Example:</b> User, Order, Payment, Notification — sab ek Spring Boot app mein<br>
<b>Pros:</b> Simple development, easy debugging, no network calls, easy to deploy<br>
<b>Cons:</b> Ek module fail → poora app crash, scaling mushkil, bada codebase = messy<br>
<b>Best for:</b> Startups, small teams, MVP (Minimum Viable Product)</p>
</div>
<div class="bottleneck-card">
<h4 style="color:#42a5f5">Microservices Architecture</h4>
<p><b>Kya:</b> Har feature/module ek alag service — independently deployable<br>
<b>Example:</b> UserService, OrderService, PaymentService — alag-alag Spring Boot apps<br>
<b>Pros:</b> Independent scaling, team autonomy, fault isolation, tech stack freedom<br>
<b>Cons:</b> Network latency, distributed complexity, debugging mushkil, data consistency hard<br>
<b>Best for:</b> Large teams, high scale, Netflix/Amazon jaise systems</p>
</div>
<div class="bottleneck-card">
<h4 style="color:#42a5f5">Communication Between Services</h4>
<p><b>Synchronous (REST/gRPC):</b><br>
OrderService → <code>HTTP GET</code> → UserService<br>
Simple but coupling + latency<br><br>
<b>Asynchronous (Events/Queue):</b><br>
OrderService → Kafka → NotificationService<br>
Decoupled, resilient, but complex<br><br>
<b>Rule:</b> Prefer async for non-critical operations. Use sync only when you NEED the response immediately.</p>
</div>
<div class="bottleneck-card">
<h4 style="color:#42a5f5">Monolith → Microservices Migration</h4>
<p><b>Strangler Fig Pattern:</b><br>
1. Naya feature microservice mein banao<br>
2. Purane features ek-ek karke extract karo<br>
3. API Gateway se route karo — kuch old, kuch new<br>
4. Gradually poora monolith replace ho jayega<br><br>
<em>Interview: "Start with monolith. Jab team aur scale bade → slowly migrate to microservices. Premature microservices = disaster for small teams."</em></p>
</div>
</div>
</div>

<!-- 15. API Gateway -->
<div class="section theme-purple">
<div class="section-title"><span class="section-num">15</span> API Gateway (Single Entry Point)</div>
<p style="color:#b0bec5;margin-bottom:12px;font-size:1.05em"><strong>Kya hai?</strong> — Ek single door jo client aur backend services ke beech mein baithta hai. Client sirf gateway se baat karta hai, gateway request sahi service tak forward karta hai. Jaise hotel ka reception — guest seedha room nahi jaata, reception se baat karta hai.</p>

<div class="bottleneck-grid">
<div class="bottleneck-card">
<h4 style="color:#ab47bc">Kya Kaam Karta Hai?</h4>
<p><b>1. Routing:</b> <code>/api/users</code> → UserService, <code>/api/orders</code> → OrderService<br>
<b>2. Authentication:</b> JWT verify karta hai — invalid token → 401<br>
<b>3. Rate Limiting:</b> Per user max 100 req/min — spam se bachao<br>
<b>4. Load Balancing:</b> Same service ke multiple instances mein distribute<br>
<b>5. Caching:</b> Repeated requests ka response cache karta hai<br>
<b>6. Request/Response Transform:</b> Headers add, body modify<br>
<b>7. Circuit Breaking:</b> Service down hai → fast fail, don't overload</p>
</div>
<div class="bottleneck-card">
<h4 style="color:#ab47bc">Popular API Gateways</h4>
<p><b>Spring Cloud Gateway:</b> Java/Spring ecosystem — reactive, filters<br>
<b>Kong:</b> Open source, plugin-based, Nginx pe built<br>
<b>AWS API Gateway:</b> Fully managed, serverless integration<br>
<b>Nginx:</b> Reverse proxy + basic gateway features<br>
<b>Zuul (Netflix):</b> Older, Spring Cloud supported — being replaced by SCG</p>
</div>
<div class="bottleneck-card">
<h4 style="color:#ab47bc">BFF Pattern</h4>
<p><b>Backend For Frontend:</b><br>
Har client type ke liye alag gateway:<br>
&#8226; Mobile BFF → optimized for mobile (less data, compressed)<br>
&#8226; Web BFF → full data, rich responses<br>
&#8226; Third-party BFF → limited access, strict rate limits<br><br>
<b>Why:</b> Mobile ko 50 fields nahi chahiye, sirf 10 chahiye. Web ko sab chahiye. BFF tailored response deta hai.</p>
</div>
<div class="bottleneck-card">
<h4 style="color:#ab47bc">Without vs With API Gateway</h4>
<p><b>Without:</b> Client ko har service ka address pata hona chahiye — <code>user:8080</code>, <code>order:8081</code>, <code>payment:8082</code>. Tight coupling, no central auth.<br><br>
<b>With:</b> Client sirf <code>gateway:80</code> se baat kare. Gateway internally route kare. Auth ek jagah, rate limit ek jagah. Clean!</p>
</div>
</div>
</div>

<!-- 16. Rate Limiting -->
<div class="section theme-green">
<div class="section-title"><span class="section-num">16</span> Rate Limiting (Request Ko Rokna)</div>
<p style="color:#b0bec5;margin-bottom:12px;font-size:1.05em"><strong>Kya hai?</strong> — Ek user ya client ko ek time period mein limited requests allow karna. Agar limit cross kare → 429 Too Many Requests. Jaise buffet mein ek plate ek baar — zyada chahiye toh line mein lago!</p>

<div class="bottleneck-grid">
<div class="bottleneck-card">
<h4 style="color:#66bb6a">Kyu Zaroori Hai?</h4>
<p><b>1. DDoS Protection:</b> Attacker millions of requests bheje → server crash hone se bachao<br>
<b>2. Fair Usage:</b> Ek user sabka bandwidth na kha jaaye<br>
<b>3. Cost Control:</b> Third-party API (Stripe, Twilio) ka overuse prevent karo<br>
<b>4. Stability:</b> Traffic spike mein system stable rahe</p>
</div>
<div class="bottleneck-card">
<h4 style="color:#66bb6a">Rate Limiting Algorithms</h4>
<p><b>1. Token Bucket:</b> Bucket mein tokens hain (e.g., 10). Har request 1 token consume kare. Tokens fixed rate pe refill hote hain. Burst allow!<br><br>
<b>2. Sliding Window:</b> Last N seconds mein kitni requests aayi? Window slide hoti rehti hai. Accurate but memory zyada.<br><br>
<b>3. Fixed Window:</b> Har minute mein max 100. Simple but boundary pe burst (59th sec + 1st sec = double).<br><br>
<b>4. Leaky Bucket:</b> Requests constant rate pe process — queue mein wait. No burst allowed.</p>
</div>
<div class="bottleneck-card">
<h4 style="color:#66bb6a">Where to Implement?</h4>
<p><b>1. API Gateway Level:</b> Centralized, sab services ke liye ek jagah. Best approach!<br>
<b>2. Application Level:</b> Spring Boot mein filter/interceptor se. Fine-grained control.<br>
<b>3. Load Balancer Level:</b> Nginx mein <code>limit_req</code>. Simple but limited.<br>
<b>4. Distributed (Redis):</b> Multiple servers ke across shared counter. Production ready!</p>
</div>
<div class="bottleneck-card">
<h4 style="color:#66bb6a">Response Headers</h4>
<p><code>X-RateLimit-Limit: 100</code> → Max allowed requests<br>
<code>X-RateLimit-Remaining: 45</code> → Kitni baaki hain<br>
<code>X-RateLimit-Reset: 1625097600</code> → Kab reset hoga (Unix timestamp)<br>
<code>Retry-After: 30</code> → 429 ke saath — kitne seconds baad retry karo<br><br>
<em>Yeh headers client ko batate hain ki kitna quota bacha hai.</em></p>
</div>
</div>

<div class="code-wrapper"><div class="code-titlebar"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span><span class="code-title">Redis-Based Rate Limiter — Spring Boot</span></div>
<pre class="code-block"><span class="cm">// Token Bucket with Redis</span>
<span class="ann">@Component</span>
<span class="kw">public class</span> <span class="tp">RateLimiter</span> {
    <span class="ann">@Autowired</span> <span class="kw">private</span> <span class="tp">StringRedisTemplate</span> redis;

    <span class="kw">public boolean</span> <span class="fn">isAllowed</span>(<span class="tp">String</span> userId, <span class="kw">int</span> maxRequests, <span class="kw">int</span> windowSec) {
        <span class="tp">String</span> key = <span class="st">"rate:"</span> + userId;
        <span class="tp">Long</span> count = redis.opsForValue().<span class="fn">increment</span>(key);
        <span class="kw">if</span> (count == <span class="cn">1</span>) {
            redis.<span class="fn">expire</span>(key, windowSec, TimeUnit.<span class="cn">SECONDS</span>);
        }
        <span class="kw">return</span> count <= maxRequests;  <span class="cm">// true = allowed, false = 429</span>
    }
}

<span class="cm">// Usage in Controller Filter</span>
<span class="kw">if</span> (!rateLimiter.<span class="fn">isAllowed</span>(userId, <span class="cn">100</span>, <span class="cn">60</span>)) {  <span class="cm">// 100 req per 60 sec</span>
    <span class="kw">throw new</span> <span class="tp">RateLimitExceededException</span>(<span class="st">"Too many requests"</span>);
    <span class="cm">// Returns 429 with Retry-After header</span>
}</pre></div>
</div>

<!-- 17. CDN -->
<div class="section theme-blue">
<div class="section-title"><span class="section-num">17</span> CDN — Content Delivery Network</div>
<p style="color:#b0bec5;margin-bottom:12px;font-size:1.05em"><strong>Kya hai?</strong> — Duniya bhar mein edge servers ka network jo static content (images, videos, CSS, JS) user ke nearest location se serve karta hai. Mumbai ka user Mumbai ke server se, US ka user US ke server se — fast delivery!</p>

<div class="bottleneck-grid">
<div class="bottleneck-card">
<h4 style="color:#42a5f5">Kaise Kaam Karta Hai?</h4>
<p><b>1.</b> User request karta hai <code>cdn.app.com/image.jpg</code><br>
<b>2.</b> DNS nearest edge server ka IP return karta hai<br>
<b>3.</b> Edge server pe cache hai → turant response (Cache HIT)<br>
<b>4.</b> Cache nahi hai → origin server se fetch → cache mein store → response (Cache MISS)<br>
<b>5.</b> Next time same request → cache se serve (fast!)</p>
</div>
<div class="bottleneck-card">
<h4 style="color:#42a5f5">Types of CDN Content</h4>
<p><b>Static:</b> Images, videos, CSS, JS, fonts — mostly CDN pe<br>
<b>Dynamic:</b> API responses — CDN pe cache tricky but possible with short TTL<br><br>
<b>Push CDN:</b> Aap manually content upload karo edge servers pe. Small sites ke liye.<br>
<b>Pull CDN:</b> First request pe CDN origin se fetch kare, cache kare. Large sites ke liye. Most common!</p>
</div>
<div class="bottleneck-card">
<h4 style="color:#42a5f5">Popular CDNs</h4>
<p><b>CloudFlare:</b> Free tier, DDoS protection, DNS, WAF<br>
<b>AWS CloudFront:</b> AWS ecosystem integration, Lambda@Edge<br>
<b>Akamai:</b> Enterprise, largest network (300K+ servers)<br>
<b>Fastly:</b> Real-time purging, edge computing</p>
</div>
<div class="bottleneck-card">
<h4 style="color:#42a5f5">Cache Invalidation</h4>
<p><b>Problem:</b> Content update hua but CDN pe purana cached hai!<br>
<b>Solutions:</b><br>
&#8226; <b>TTL:</b> 24 hours baad auto expire<br>
&#8226; <b>Purge API:</b> Manually specific URL ka cache clear<br>
&#8226; <b>Versioned URLs:</b> <code>style.v2.css</code> — naya version = naya URL = no stale cache<br>
&#8226; <b>Cache-busting:</b> <code>image.jpg?v=123</code> — query param change = new cache entry</p>
</div>
</div>
</div>

<!-- 18. Proxies -->
<div class="section theme-purple">
<div class="section-title"><span class="section-num">18</span> Proxies (Beech Ka Aadmi)</div>
<p style="color:#b0bec5;margin-bottom:12px;font-size:1.05em"><strong>Kya hai?</strong> — Proxy ek intermediary server hai jo client aur server ke beech mein baithta hai. Requests aur responses proxy se hokar jaate hain. Do types hain — Forward aur Reverse.</p>

<div class="bottleneck-grid">
<div class="bottleneck-card">
<h4 style="color:#ab47bc">Forward Proxy</h4>
<p><b>Kya:</b> Client ki taraf se kaam karta hai. Client → Proxy → Server<br>
<b>Server ko nahi pata ki actual client kaun hai</b> (client ki identity chupaata hai)<br><br>
<b>Use Cases:</b><br>
&#8226; VPN — location chupaao, blocked sites access karo<br>
&#8226; Corporate firewall — employees ki internet access control<br>
&#8226; Caching — proxy pe cache → fast response for repeated requests<br>
&#8226; Web scraping — IP rotate karo, block se bachao</p>
</div>
<div class="bottleneck-card">
<h4 style="color:#ab47bc">Reverse Proxy</h4>
<p><b>Kya:</b> Server ki taraf se kaam karta hai. Client → Reverse Proxy → Server<br>
<b>Client ko nahi pata ki actual server kaun hai</b> (server ki identity chupaata hai)<br><br>
<b>Use Cases:</b><br>
&#8226; Load Balancing — traffic multiple servers mein distribute<br>
&#8226; SSL Termination — HTTPS handling proxy pe, servers pe HTTP<br>
&#8226; Caching — static content proxy pe cache<br>
&#8226; Security — server ka IP hide, DDoS protection<br>
<b>Examples:</b> Nginx, HAProxy, AWS ALB</p>
</div>
<div class="bottleneck-card">
<h4 style="color:#ab47bc">Forward vs Reverse — Quick Diff</h4>
<p><b>Forward:</b> Client ki identity chupaata hai. Client ke side mein baithta hai.<br>
<b>Reverse:</b> Server ki identity chupaata hai. Server ke side mein baithta hai.<br><br>
<b>Forward:</b> User privacy ke liye (VPN)<br>
<b>Reverse:</b> Server protection ke liye (Nginx)<br><br>
<em>Interview: "Nginx ek reverse proxy hai. VPN ek forward proxy hai."</em></p>
</div>
<div class="bottleneck-card">
<h4 style="color:#ab47bc">SSL/TLS Termination</h4>
<p><b>Kya:</b> HTTPS decryption reverse proxy pe hota hai, backend servers pe plain HTTP jaata hai<br>
<b>Kyu:</b> SSL decrypt karna CPU intensive hai. Proxy pe ek baar decrypt karo, backend pe load na daalo.<br>
<b>Flow:</b><br>
Client →(HTTPS)→ Nginx →(HTTP)→ App Server<br>
<em>Nginx pe SSL certificate, backend pe nahi chahiye!</em></p>
</div>
</div>
</div>

<!-- 19. WebSocket -->
<div class="section theme-green">
<div class="section-title"><span class="section-num">19</span> WebSocket (Real-Time Communication)</div>
<p style="color:#b0bec5;margin-bottom:12px;font-size:1.05em"><strong>Kya hai?</strong> — HTTP mein client request bhejta hai, server response deta hai — bas! WebSocket mein ek baar connection banta hai, phir dono taraf se kisi bhi time data bhej sakte hain. Full-duplex, persistent connection.</p>

<div class="bottleneck-grid">
<div class="bottleneck-card">
<h4 style="color:#66bb6a">HTTP vs WebSocket</h4>
<p><b>HTTP:</b> Client → Request → Server → Response → Connection closed<br>
Har baar naya connection. Client ko har baar poochna padta hai "kuch naya hai?"<br><br>
<b>WebSocket:</b> Client ↔ Server (always connected)<br>
Server khud bol sakta hai "naya message aaya!" bina client ke pooche<br><br>
<b>HTTP Polling:</b> Client har 2 sec mein poochta hai → wasteful<br>
<b>Long Polling:</b> Server wait karta hai jab tak naya data na ho → better but complex<br>
<b>WebSocket:</b> Persistent connection → BEST for real-time!</p>
</div>
<div class="bottleneck-card">
<h4 style="color:#66bb6a">Kab Use Karein?</h4>
<p><b>Use WebSocket:</b><br>
&#8226; Chat applications (WhatsApp, Slack)<br>
&#8226; Live scores (Cricbuzz)<br>
&#8226; Stock price updates (Zerodha)<br>
&#8226; Online gaming (multiplayer)<br>
&#8226; Collaborative editing (Google Docs)<br>
&#8226; Notifications (real-time push)<br><br>
<b>Use HTTP:</b><br>
&#8226; REST APIs, form submissions, file uploads — one-time request/response</p>
</div>
<div class="bottleneck-card">
<h4 style="color:#66bb6a">WebSocket Handshake</h4>
<p><b>Step 1:</b> Client HTTP request bhejta hai with <code>Upgrade: websocket</code> header<br>
<b>Step 2:</b> Server <code>101 Switching Protocols</code> response deta hai<br>
<b>Step 3:</b> Ab connection HTTP se WebSocket pe upgrade ho gaya<br>
<b>Step 4:</b> Dono taraf se data frames bhej sakte hain<br><br>
URL: <code>ws://example.com/chat</code> (unsecured)<br>
URL: <code>wss://example.com/chat</code> (secured — like HTTPS)</p>
</div>
<div class="bottleneck-card">
<h4 style="color:#66bb6a">Scaling WebSockets</h4>
<p><b>Problem:</b> 1 server pe max ~65K connections. 1M users ke liye?<br>
<b>Solutions:</b><br>
&#8226; Multiple WebSocket servers + Load Balancer (sticky sessions)<br>
&#8226; Redis Pub/Sub for cross-server messaging<br>
&#8226; User A on Server1, User B on Server2 → Redis se sync<br><br>
<b>Tools:</b> Socket.IO, Spring WebSocket, STOMP protocol</p>
</div>
</div>

<div class="code-wrapper"><div class="code-titlebar"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span><span class="code-title">Spring Boot WebSocket — Chat Example</span></div>
<pre class="code-block"><span class="cm">// Config</span>
<span class="ann">@Configuration</span>
<span class="ann">@EnableWebSocketMessageBroker</span>
<span class="kw">public class</span> <span class="tp">WebSocketConfig</span> <span class="kw">implements</span> <span class="tp">WebSocketMessageBrokerConfigurer</span> {
    <span class="kw">public void</span> <span class="fn">registerStompEndpoints</span>(<span class="tp">StompEndpointRegistry</span> r) {
        r.<span class="fn">addEndpoint</span>(<span class="st">"/ws"</span>).<span class="fn">withSockJS</span>();  <span class="cm">// Client yahan connect karega</span>
    }
    <span class="kw">public void</span> <span class="fn">configureMessageBroker</span>(<span class="tp">MessageBrokerRegistry</span> r) {
        r.<span class="fn">enableSimpleBroker</span>(<span class="st">"/topic"</span>);       <span class="cm">// Subscribe endpoint</span>
        r.<span class="fn">setApplicationDestinationPrefixes</span>(<span class="st">"/app"</span>);  <span class="cm">// Send endpoint</span>
    }
}

<span class="cm">// Controller — Receive &amp; Broadcast</span>
<span class="ann">@MessageMapping</span>(<span class="st">"/chat.send"</span>)           <span class="cm">// Client sends to /app/chat.send</span>
<span class="ann">@SendTo</span>(<span class="st">"/topic/public"</span>)                <span class="cm">// Broadcast to all subscribers</span>
<span class="kw">public</span> <span class="tp">ChatMessage</span> <span class="fn">sendMessage</span>(<span class="tp">ChatMessage</span> msg) {
    <span class="kw">return</span> msg;  <span class="cm">// Sab connected users ko jayega!</span>
}</pre></div>
</div>

<!-- 20. Consistent Hashing -->
<div class="section theme-blue">
<div class="section-title"><span class="section-num">20</span> Consistent Hashing (Smart Data Distribution)</div>
<p style="color:#b0bec5;margin-bottom:12px;font-size:1.05em"><strong>Kya hai?</strong> — Jab distributed systems mein data multiple servers pe store karna ho, toh Consistent Hashing batata hai ki kaunsa data kaunse server pe jaayega — aur server add/remove hone pe MINIMUM data move hota hai!</p>

<div class="bottleneck-grid">
<div class="bottleneck-card">
<h4 style="color:#42a5f5">Normal Hashing Ka Problem</h4>
<p><b>Normal:</b> <code>server = hash(key) % N</code><br>
3 servers hain: <code>hash("user1") % 3 = 1</code> → Server 1<br><br>
<b>Problem:</b> Ek server add kiya (N=3 → N=4)<br>
Ab <code>hash("user1") % 4 = 2</code> → Server 2!<br>
Almost SAARA data move hoga! 75%+ cache miss = <b>Cache Stampede!</b></p>
</div>
<div class="bottleneck-card">
<h4 style="color:#42a5f5">Consistent Hashing Kaise Kaam Karta Hai</h4>
<p><b>1.</b> Ek virtual ring (circle) imagine karo — 0 se 360 degree<br>
<b>2.</b> Har server ko ring pe place karo (hash of server IP)<br>
<b>3.</b> Har key ko bhi ring pe place karo (hash of key)<br>
<b>4.</b> Key clockwise chalega → jo pehla server milega woh handle karega<br><br>
<b>Server add/remove:</b> Sirf adjacent keys move hoti hain — minimal disruption! ~K/N data move (K=keys, N=nodes)</p>
</div>
<div class="bottleneck-card">
<h4 style="color:#42a5f5">Virtual Nodes (Vnodes)</h4>
<p><b>Problem:</b> Servers ring pe unevenly distribute ho sakte hain → unequal load<br>
<b>Solution:</b> Har server ke multiple virtual nodes banao<br>
Server A → A1, A2, A3, A4 (4 positions on ring)<br>
Server B → B1, B2, B3, B4<br><br>
Zyada virtual nodes = better distribution = more even load<br>
<b>Standard:</b> 100-200 virtual nodes per physical server</p>
</div>
<div class="bottleneck-card">
<h4 style="color:#42a5f5">Kahan Use Hota Hai?</h4>
<p><b>1. Distributed Cache:</b> Redis Cluster, Memcached — key kaunse node pe?<br>
<b>2. Load Balancer:</b> Request kaunse server pe bhejein?<br>
<b>3. DB Sharding:</b> Data kaunse shard pe?<br>
<b>4. CDN:</b> Content kaunse edge server pe cache ho?<br><br>
<b>Used by:</b> Amazon DynamoDB, Apache Cassandra, Discord, Akamai CDN</p>
</div>
</div>
</div>

<!-- 21. SOLID Principles -->
<div class="section theme-purple">
<div class="section-title"><span class="section-num">21</span> SOLID Principles (Clean Code Ka Foundation)</div>
<p style="color:#b0bec5;margin-bottom:12px;font-size:1.05em"><strong>Kya hai?</strong> — 5 design principles jo code ko maintainable, extensible, aur testable banate hain. Interview mein BAHUT important — har LLD question mein SOLID apply hona chahiye.</p>

<div class="bottleneck-grid">
<div class="bottleneck-card">
<h4 style="color:#ab47bc">S — Single Responsibility</h4>
<p><b>Ek class ka ek hi kaam hona chahiye.</b><br><br>
<b>Bad:</b> <code>UserService</code> — user create bhi kare, email bhi bheje, PDF bhi banaye<br>
<b>Good:</b> <code>UserService</code> → user create, <code>EmailService</code> → email, <code>PdfService</code> → PDF<br><br>
<em>"Ek class ko change karne ki sirf EK reason honi chahiye"</em></p>
</div>
<div class="bottleneck-card">
<h4 style="color:#ab47bc">O — Open/Closed</h4>
<p><b>Extension ke liye open, modification ke liye closed.</b><br><br>
Naya feature add karna ho → naya code likho, purana mat chhedo!<br>
<b>How:</b> Interfaces + Polymorphism use karo<br>
<b>Example:</b> Naya payment method add karna ho → <code>PaymentStrategy</code> interface implement karo, purane code ko touch mat karo</p>
</div>
<div class="bottleneck-card">
<h4 style="color:#ab47bc">L — Liskov Substitution</h4>
<p><b>Child class ko parent ki jagah use kar sako bina code tode.</b><br><br>
<b>Bad:</b> <code>Square extends Rectangle</code> → setWidth kare toh height bhi change ho = unexpected!<br>
<b>Good:</b> Dono ko <code>Shape</code> interface implement karao independently<br><br>
<em>"Agar Bird fly() kar sakta hai, toh Penguin extends Bird GALAT hai kyunki Penguin fly nahi kar sakta"</em></p>
</div>
<div class="bottleneck-card">
<h4 style="color:#ab47bc">I — Interface Segregation</h4>
<p><b>Bade interface ko chhote specific interfaces mein todo.</b><br><br>
<b>Bad:</b> <code>Worker { work(); eat(); sleep(); }</code> — Robot ko eat/sleep nahi chahiye!<br>
<b>Good:</b> <code>Workable { work(); }</code> + <code>Eatable { eat(); }</code><br>
Robot sirf <code>Workable</code> implement kare<br><br>
<em>"Client ko un methods pe depend nahi karna chahiye jo woh use nahi karta"</em></p>
</div>
</div>

<div class="code-wrapper"><div class="code-titlebar"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span><span class="code-title">D — Dependency Inversion (with Code Example)</span></div>
<pre class="code-block"><span class="cm">// D = High-level modules ko low-level pe depend nahi karna chahiye.</span>
<span class="cm">// Dono ko ABSTRACTIONS (interfaces) pe depend karna chahiye.</span>

<span class="cm">// ✗ BAD — Directly depend on MySQL</span>
<span class="kw">public class</span> <span class="tp">OrderService</span> {
    <span class="kw">private</span> <span class="tp">MySQLOrderRepo</span> repo = <span class="kw">new</span> <span class="tp">MySQLOrderRepo</span>();  <span class="cm">// Tight coupling!</span>
}

<span class="cm">// ✓ GOOD — Depend on interface</span>
<span class="kw">public interface</span> <span class="tp">OrderRepository</span> {
    <span class="tp">Order</span> <span class="fn">findById</span>(<span class="tp">Long</span> id);
    <span class="tp">Order</span> <span class="fn">save</span>(<span class="tp">Order</span> order);
}

<span class="ann">@Service</span>
<span class="kw">public class</span> <span class="tp">OrderService</span> {
    <span class="kw">private final</span> <span class="tp">OrderRepository</span> repo;  <span class="cm">// Interface pe depend!</span>

    <span class="kw">public</span> <span class="fn">OrderService</span>(<span class="tp">OrderRepository</span> repo) {
        <span class="kw">this</span>.repo = repo;  <span class="cm">// Spring inject karega — MySQL, Mongo, kuch bhi!</span>
    }
}
<span class="cm">// Ab MySQL se MongoDB switch karna ho → sirf new implementation banao</span>
<span class="cm">// OrderService ko touch nahi karna padega!</span></pre></div>
</div>

<!-- 22. Design Patterns -->
<div class="section theme-green">
<div class="section-title"><span class="section-num">22</span> Design Patterns (Reusable Solutions)</div>
<p style="color:#b0bec5;margin-bottom:12px;font-size:1.05em"><strong>Kya hai?</strong> — Common problems ke proven solutions. Har baar naya solution invent karne ki zaroorat nahi — Design Pattern use karo! 3 categories hain: Creational, Structural, Behavioral.</p>

<div class="bottleneck-grid">
<div class="bottleneck-card">
<h4 style="color:#66bb6a">Creational Patterns (Object Banana)</h4>
<p><b>Singleton:</b> Poore app mein sirf EK instance — DB connection pool, Logger<br>
<b>Factory:</b> Object creation logic alag class mein — <code>NotificationFactory.create("SMS")</code><br>
<b>Builder:</b> Complex object step-by-step banao — <code>User.builder().name("A").age(25).build()</code><br>
<b>Prototype:</b> Existing object ki copy banao — costly object clone karo</p>
</div>
<div class="bottleneck-card">
<h4 style="color:#66bb6a">Structural Patterns (Object Jodna)</h4>
<p><b>Adapter:</b> Incompatible interfaces ko compatible banao — <code>PayPalAdapter implements PaymentGateway</code><br>
<b>Decorator:</b> Existing object mein naya behavior add karo — <code>EncryptedStream(CompressedStream(FileStream))</code><br>
<b>Proxy:</b> Object ka substitute — lazy loading, access control, caching<br>
<b>Facade:</b> Complex subsystem ka simple interface — <code>OrderFacade.placeOrder()</code> internally 5 services call kare</p>
</div>
<div class="bottleneck-card">
<h4 style="color:#66bb6a">Behavioral Patterns (Object Ka Behavior)</h4>
<p><b>Strategy:</b> Algorithm runtime pe change karo — <code>SortStrategy: QuickSort, MergeSort</code><br>
<b>Observer:</b> State change pe sabko notify — Event listeners, Pub/Sub<br>
<b>Chain of Responsibility:</b> Request chain se guzre — Authentication → Authorization → Validation → Handler<br>
<b>Template Method:</b> Algorithm ka skeleton define karo, steps subclass mein — <code>abstract processPayment()</code></p>
</div>
<div class="bottleneck-card">
<h4 style="color:#66bb6a">Interview Mein Kab Kaunsa?</h4>
<p><b>Payment methods:</b> Strategy Pattern<br>
<b>Notifications (Email/SMS/Push):</b> Factory + Strategy<br>
<b>Logger:</b> Singleton<br>
<b>Request filters:</b> Chain of Responsibility<br>
<b>Event systems:</b> Observer Pattern<br>
<b>Complex object creation:</b> Builder Pattern<br>
<b>Third-party integration:</b> Adapter Pattern<br>
<b>Caching/Lazy loading:</b> Proxy Pattern</p>
</div>
</div>

<div class="code-wrapper"><div class="code-titlebar"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span><span class="code-title">Most Used Patterns — Code Examples</span></div>
<pre class="code-block"><span class="cm">// STRATEGY PATTERN — Payment methods</span>
<span class="kw">public interface</span> <span class="tp">PaymentStrategy</span> {
    <span class="kw">void</span> <span class="fn">pay</span>(<span class="tp">BigDecimal</span> amount);
}
<span class="kw">public class</span> <span class="tp">UpiPayment</span> <span class="kw">implements</span> <span class="tp">PaymentStrategy</span> { <span class="cm">/* UPI logic */</span> }
<span class="kw">public class</span> <span class="tp">CardPayment</span> <span class="kw">implements</span> <span class="tp">PaymentStrategy</span> { <span class="cm">/* Card logic */</span> }

<span class="cm">// FACTORY PATTERN — Create the right strategy</span>
<span class="kw">public class</span> <span class="tp">PaymentFactory</span> {
    <span class="kw">public static</span> <span class="tp">PaymentStrategy</span> <span class="fn">create</span>(<span class="tp">String</span> type) {
        <span class="kw">return switch</span> (type) {
            <span class="kw">case</span> <span class="st">"UPI"</span> -> <span class="kw">new</span> <span class="tp">UpiPayment</span>();
            <span class="kw">case</span> <span class="st">"CARD"</span> -> <span class="kw">new</span> <span class="tp">CardPayment</span>();
            <span class="kw">default</span> -> <span class="kw">throw new</span> <span class="tp">IllegalArgumentException</span>(<span class="st">"Unknown type"</span>);
        };
    }
}

<span class="cm">// OBSERVER PATTERN — Event notification</span>
<span class="ann">@Component</span>
<span class="kw">public class</span> <span class="tp">OrderEventListener</span> {
    <span class="ann">@EventListener</span>
    <span class="kw">public void</span> <span class="fn">onOrderPlaced</span>(<span class="tp">OrderPlacedEvent</span> event) {
        emailService.<span class="fn">send</span>(event);   <span class="cm">// Observer 1</span>
        smsService.<span class="fn">send</span>(event);     <span class="cm">// Observer 2</span>
        analyticsService.<span class="fn">track</span>(event); <span class="cm">// Observer 3</span>
    }
}</pre></div>
</div>

<!-- 23. Idempotency -->
<div class="section theme-blue">
<div class="section-title"><span class="section-num">23</span> Idempotency (Same Request = Same Result)</div>
<p style="color:#b0bec5;margin-bottom:12px;font-size:1.05em"><strong>Kya hai?</strong> — Ek operation agar 1 baar karo ya 10 baar karo — result same hoga. Network retry, duplicate clicks, message queue re-delivery — idempotency se safe rehta hai system.</p>

<div class="bottleneck-grid">
<div class="bottleneck-card">
<h4 style="color:#42a5f5">Real Life Example</h4>
<p><b>Idempotent:</b> Lift ka button — 10 baar dabaao, lift 1 hi baar aayegi<br>
<b>NOT Idempotent:</b> ATM se paise nikaalna — 2 baar kiya toh 2x debit!<br><br>
<b>HTTP Methods:</b><br>
GET → Idempotent ✓ (read same data)<br>
PUT → Idempotent ✓ (same update repeat = same state)<br>
DELETE → Idempotent ✓ (delete same thing = already deleted)<br>
POST → NOT Idempotent ✗ (2x POST = 2 new records!)</p>
</div>
<div class="bottleneck-card">
<h4 style="color:#42a5f5">Kyu Zaroori Hai?</h4>
<p><b>Scenario 1:</b> User ne "Pay ₹500" click kiya → network slow → user phir click kiya → 2 baar ₹500 kat gaye! ✗<br>
<b>Scenario 2:</b> Kafka message retry hua → order 2 baar process ho gaya! ✗<br>
<b>Scenario 3:</b> API timeout → client retry karta hai → duplicate entry! ✗<br><br>
<b>Solution:</b> Idempotency Key — har request ke saath unique ID bhejo. Server check kare — pehle process hua toh skip.</p>
</div>
<div class="bottleneck-card">
<h4 style="color:#42a5f5">Implementation Approaches</h4>
<p><b>1. Idempotency Key:</b> Client sends unique UUID with request. Server stores in DB — duplicate detected → return cached response.<br>
<b>2. Database Unique Constraint:</b> <code>UNIQUE(order_id, user_id)</code> — duplicate insert fails<br>
<b>3. Optimistic Locking:</b> Version check — update WHERE version = X<br>
<b>4. Deduplication Table:</b> Store processed request IDs — check before processing</p>
</div>
<div class="bottleneck-card">
<h4 style="color:#42a5f5">Interview Answer Template</h4>
<p><b>Q: "Payment duplicate ho jaaye toh?"</b><br>
A: "Har payment request ke saath client ek UUID (idempotency_key) bhejega. Server Redis mein check karega — agar key exists → return cached response. Agar nahi → process karo, key store karo with TTL of 24 hours. Isse duplicate payment NEVER hogi."</p>
</div>
</div>

<div class="code-wrapper"><div class="code-titlebar"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span><span class="code-title">Idempotent Payment API — Spring Boot</span></div>
<pre class="code-block"><span class="ann">@PostMapping</span>(<span class="st">"/api/payments"</span>)
<span class="kw">public</span> <span class="tp">ResponseEntity</span>&lt;<span class="tp">Payment</span>&gt; <span class="fn">processPayment</span>(
        <span class="ann">@RequestHeader</span>(<span class="st">"Idempotency-Key"</span>) <span class="tp">String</span> idempotencyKey,
        <span class="ann">@RequestBody</span> <span class="tp">PaymentRequest</span> request) {

    <span class="cm">// 1. Check if already processed</span>
    <span class="tp">String</span> cached = redis.<span class="fn">get</span>(<span class="st">"idem:"</span> + idempotencyKey);
    <span class="kw">if</span> (cached != <span class="cn">null</span>) {
        <span class="kw">return</span> ResponseEntity.<span class="fn">ok</span>(Payment.<span class="fn">fromJson</span>(cached)); <span class="cm">// Return cached!</span>
    }

    <span class="cm">// 2. Process payment</span>
    Payment payment = paymentService.<span class="fn">process</span>(request);

    <span class="cm">// 3. Store in Redis with 24h TTL</span>
    redis.<span class="fn">set</span>(<span class="st">"idem:"</span> + idempotencyKey, payment.<span class="fn">toJson</span>(), <span class="cn">24</span>, TimeUnit.<span class="cn">HOURS</span>);

    <span class="kw">return</span> ResponseEntity.<span class="fn">status</span>(<span class="cn">201</span>).<span class="fn">body</span>(payment);
}</pre></div>
</div>

<!-- 24. Circuit Breaker -->
<div class="section theme-purple">
<div class="section-title"><span class="section-num">24</span> Circuit Breaker (Service Failure Se Bachao)</div>
<p style="color:#b0bec5;margin-bottom:12px;font-size:1.05em"><strong>Kya hai?</strong> — Jaise ghar mein bijli ka circuit breaker trip karta hai overload pe — aise hi microservice call fail hone pe Circuit Breaker Pattern request rokta hai taki cascading failure na ho. Jab service recover ho jaaye → circuit wapas close hota hai.</p>

<div class="bottleneck-grid">
<div class="bottleneck-card">
<h4 style="color:#ab47bc">3 States</h4>
<p><b>CLOSED (Normal):</b> Sab requests pass hote hain. Failures count hote hain.<br><br>
<b>OPEN (Tripped):</b> Failure threshold cross hua → circuit open! Requests turant fail = fast fail. Service ko recover hone ka time milta hai.<br><br>
<b>HALF-OPEN (Testing):</b> Thodi der baad kuch test requests bhejte hain. Success → CLOSED. Fail → wapas OPEN.</p>
</div>
<div class="bottleneck-card">
<h4 style="color:#ab47bc">Kyu Zaroori Hai?</h4>
<p><b>Without Circuit Breaker:</b><br>
PaymentService down hai → OrderService wait karta hai (timeout 30s) → User wait karta hai → Threads block hote hain → OrderService bhi crash → <b>Cascading Failure!</b><br><br>
<b>With Circuit Breaker:</b><br>
PaymentService down → Circuit OPEN → instant fail response → OrderService healthy rehta hai → fallback response user ko milta hai</p>
</div>
<div class="bottleneck-card">
<h4 style="color:#ab47bc">Fallback Strategies</h4>
<p><b>1. Default Response:</b> Cached/default data return karo<br>
<b>2. Graceful Degradation:</b> Feature disable karo but app chale<br>
<b>3. Queue for Later:</b> Request queue mein daalo, baad mein process<br>
<b>4. Alternative Service:</b> Backup service call karo<br><br>
<em>Example: Recommendation service down → "Popular Products" dikhao instead (fallback)</em></p>
</div>
<div class="bottleneck-card">
<h4 style="color:#ab47bc">Tools</h4>
<p><b>Resilience4j:</b> Modern Java library — lightweight, modular (Spring Boot recommended)<br>
<b>Hystrix:</b> Netflix ka purana library — deprecated but widely known<br>
<b>Sentinel:</b> Alibaba ka — rate limiting + circuit breaker<br><br>
<b>Config Parameters:</b><br>
&#8226; failureThreshold: 5 failures → open<br>
&#8226; waitDuration: 30 sec → try half-open<br>
&#8226; successThreshold: 3 success → close</p>
</div>
</div>

<div class="code-wrapper"><div class="code-titlebar"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span><span class="code-title">Resilience4j Circuit Breaker — Spring Boot</span></div>
<pre class="code-block"><span class="cm">// application.yml</span>
resilience4j.circuitbreaker:
  instances:
    paymentService:
      failureRateThreshold: <span class="cn">50</span>        <span class="cm"># 50% failures → OPEN</span>
      waitDurationInOpenState: <span class="cn">30s</span>     <span class="cm"># 30 sec wait → HALF-OPEN</span>
      slidingWindowSize: <span class="cn">10</span>            <span class="cm"># Last 10 calls monitor</span>
      permittedNumberOfCallsInHalfOpenState: <span class="cn">3</span>  <span class="cm"># 3 test calls</span>

<span class="cm">// Service</span>
<span class="ann">@CircuitBreaker</span>(name = <span class="st">"paymentService"</span>, fallbackMethod = <span class="st">"paymentFallback"</span>)
<span class="kw">public</span> <span class="tp">PaymentResponse</span> <span class="fn">processPayment</span>(<span class="tp">PaymentRequest</span> req) {
    <span class="kw">return</span> paymentClient.<span class="fn">charge</span>(req);  <span class="cm">// External service call</span>
}

<span class="cm">// Fallback — jab circuit OPEN ho</span>
<span class="kw">public</span> <span class="tp">PaymentResponse</span> <span class="fn">paymentFallback</span>(<span class="tp">PaymentRequest</span> req, <span class="tp">Throwable</span> t) {
    <span class="cm">// Queue for later processing</span>
    kafkaTemplate.<span class="fn">send</span>(<span class="st">"payment-retry"</span>, req.<span class="fn">toJson</span>());
    <span class="kw">return new</span> <span class="tp">PaymentResponse</span>(<span class="st">"PENDING"</span>, <span class="st">"Payment queued, will process shortly"</span>);
}</pre></div>
</div>

<!-- 25. Event-Driven Architecture -->
<div class="section theme-green">
<div class="section-title"><span class="section-num">25</span> Event-Driven Architecture (Event Se Chalao System)</div>
<p style="color:#b0bec5;margin-bottom:12px;font-size:1.05em"><strong>Kya hai?</strong> — Services ek doosre ko directly call nahi karti. Instead, events produce karti hain aur interested services un events ko consume karti hain. Loose coupling, high scalability!</p>

<div class="bottleneck-grid">
<div class="bottleneck-card">
<h4 style="color:#66bb6a">Traditional vs Event-Driven</h4>
<p><b>Traditional (Request-Driven):</b><br>
OrderService → calls → PaymentService → calls → NotificationService<br>
Tight coupling, synchronous, one fails = all fail<br><br>
<b>Event-Driven:</b><br>
OrderService → publishes "OrderPlaced" event<br>
PaymentService → listens & processes payment<br>
NotificationService → listens & sends email<br>
<em>Sab independent! Ek fail ho toh baaki chalu.</em></p>
</div>
<div class="bottleneck-card">
<h4 style="color:#66bb6a">Event Sourcing</h4>
<p><b>Kya:</b> Current state store karne ki jagah, SAARE events store karo. State = replay of all events.<br><br>
<b>Example (Bank Account):</b><br>
Event 1: AccountCreated(balance=0)<br>
Event 2: MoneyDeposited(+1000)<br>
Event 3: MoneyWithdrawn(-300)<br>
Current balance = replay → ₹700<br><br>
<b>Pros:</b> Complete audit trail, time travel (past state dekho), debugging easy<br>
<b>Used by:</b> Banking, Git (commits = events!)</p>
</div>
<div class="bottleneck-card">
<h4 style="color:#66bb6a">CQRS Pattern</h4>
<p><b>Command Query Responsibility Segregation</b><br><br>
<b>Command (Write):</b> Alag model — optimized for writes<br>
<b>Query (Read):</b> Alag model — optimized for reads<br><br>
<b>Example:</b> Write → normalized SQL, Read → denormalized Elasticsearch<br>
Event sync karta hai write model se read model ko<br><br>
<b>Use:</b> Jab read aur write patterns bahut different ho — social media feeds, analytics dashboards</p>
</div>
<div class="bottleneck-card">
<h4 style="color:#66bb6a">Saga Pattern (Distributed Transactions)</h4>
<p><b>Problem:</b> Microservices mein distributed transaction kaise handle karein?<br><br>
<b>Saga:</b> Ek bada transaction chhote local transactions mein todo. Fail hone pe compensating transactions run karo (undo).<br><br>
<b>Example — Order Flow:</b><br>
1. CreateOrder ✓<br>
2. ReserveInventory ✓<br>
3. ProcessPayment ✗ (failed!)<br>
4. Compensate: ReleaseInventory → CancelOrder<br><br>
<b>Types:</b> Choreography (event-based) vs Orchestration (central coordinator)</p>
</div>
</div>

<div class="code-wrapper"><div class="code-titlebar"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span><span class="code-title">Event-Driven Architecture — Spring Boot Complete Flow</span></div>
<pre class="code-block"><span class="cm">// 1. EVENT CLASS</span>
<span class="kw">public class</span> <span class="tp">OrderPlacedEvent</span> {
    <span class="kw">private</span> <span class="tp">String</span> orderId;
    <span class="kw">private</span> <span class="tp">String</span> userId;
    <span class="kw">private</span> <span class="tp">BigDecimal</span> amount;
    <span class="kw">private</span> <span class="tp">LocalDateTime</span> timestamp;
}

<span class="cm">// 2. PRODUCER — Order Service publishes event</span>
<span class="ann">@Service</span>
<span class="kw">public class</span> <span class="tp">OrderService</span> {
    <span class="kw">public</span> <span class="tp">Order</span> <span class="fn">placeOrder</span>(<span class="tp">OrderDTO</span> dto) {
        Order order = orderRepo.<span class="fn">save</span>(mapper.<span class="fn">toEntity</span>(dto));
        kafka.<span class="fn">send</span>(<span class="st">"order-events"</span>, <span class="kw">new</span> <span class="tp">OrderPlacedEvent</span>(order));
        <span class="kw">return</span> order;  <span class="cm">// User ko turant response — baaki async!</span>
    }
}

<span class="cm">// 3. CONSUMERS — Independent services listen & react</span>
<span class="ann">@KafkaListener</span>(topics = <span class="st">"order-events"</span>, groupId = <span class="st">"payment-group"</span>)
<span class="kw">public void</span> <span class="fn">handlePayment</span>(<span class="tp">OrderPlacedEvent</span> e) {
    paymentService.<span class="fn">charge</span>(e.getUserId(), e.getAmount());
}

<span class="ann">@KafkaListener</span>(topics = <span class="st">"order-events"</span>, groupId = <span class="st">"notification-group"</span>)
<span class="kw">public void</span> <span class="fn">handleNotification</span>(<span class="tp">OrderPlacedEvent</span> e) {
    emailService.<span class="fn">sendOrderConfirmation</span>(e.getUserId(), e.getOrderId());
}

<span class="ann">@KafkaListener</span>(topics = <span class="st">"order-events"</span>, groupId = <span class="st">"inventory-group"</span>)
<span class="kw">public void</span> <span class="fn">handleInventory</span>(<span class="tp">OrderPlacedEvent</span> e) {
    inventoryService.<span class="fn">reduceStock</span>(e.getOrderId());
}
<span class="cm">// Sab PARALLEL &amp; INDEPENDENT — ek fail toh baaki chalu!</span></pre></div>
</div>

<!-- 26. Little's Law -->
<div class="section theme-blue">
<div class="section-title"><span class="section-num">26</span> Little's Law (Queue Ka Fundamental Rule)</div>
<p style="color:#b0bec5;margin-bottom:12px;font-size:1.05em"><strong>Kya hai?</strong> — Little's Law ek bahut simple aur powerful formula hai jo batata hai ki kisi bhi stable system mein average kitne items/requests "andar" hain. Formula: <b>L = λ × W</b>. Yeh law har jagah kaam karta hai — restaurants, servers, queues, traffic, sab jagah!</p>

<div class="bottleneck-grid">
<div class="bottleneck-card">
<h4 style="color:#42a5f5">Formula Samjho</h4>
<p><b>L = λ × W</b><br><br>
<b>L</b> = Average number of items in system (kitne requests system mein hain right now)<br>
<b>λ (Lambda)</b> = Arrival rate (kitne requests per second aa rahe hain)<br>
<b>W</b> = Average time ek item system mein spend karta hai (latency/wait time)<br><br>
<em>Simple mein:</em> Agar 10 customers per hour aate hain (λ=10) aur har ek 30 min spend karta hai (W=0.5hr), toh average 5 customers honge andar (L=10×0.5=5)</p>
</div>
<div class="bottleneck-card">
<h4 style="color:#42a5f5">Real Life Examples</h4>
<p><b>Restaurant:</b><br>60 customers/hour aate hain, har ek 20 min spend karta hai<br>L = 60 × (20/60) = <b>20 customers</b> andar honge average<br><br>
<b>API Server:</b><br>500 requests/sec (λ), har request 200ms (W=0.2s) leti hai<br>L = 500 × 0.2 = <b>100 concurrent requests</b><br><br>
<b>Message Queue:</b><br>1000 msgs/sec produce hote hain, processing time 5ms<br>L = 1000 × 0.005 = <b>5 messages</b> average queue mein</p>
</div>
<div class="bottleneck-card">
<h4 style="color:#42a5f5">System Design Mein Use</h4>
<p><b>1. Server Capacity Planning:</b><br>
"Kitne concurrent connections handle karne padenge?" → L = λ × W se pata chalega<br><br>
<b>2. Thread Pool Sizing:</b><br>
1000 RPS, each request 50ms → L = 1000 × 0.05 = 50 threads minimum chahiye<br><br>
<b>3. Queue Sizing:</b><br>
Producer rate aur consumer latency se queue length predict karo<br><br>
<b>4. Database Connections:</b><br>
500 QPS, avg query time 10ms → L = 500 × 0.01 = 5 connections minimum</p>
</div>
<div class="bottleneck-card">
<h4 style="color:#42a5f5">Interview Mein Kaise Use Karein?</h4>
<p><b>Q: "Tumhare system ko 10K RPS handle karna hai, har request 100ms leti hai. Kitne servers chahiye?"</b><br><br>
<b>Answer:</b><br>
L = 10,000 × 0.1 = <b>1000 concurrent requests</b><br>
Agar ek server 200 concurrent handle karta hai → 1000/200 = <b>5 servers minimum</b><br><br>
<em>Tip:</em> Little's Law se capacity planning ka answer 10 second mein nikaal sakte ho. Interviewer impress hoga!</p>
</div>
</div>

<div class="code-wrapper"><div class="code-titlebar"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span><span class="code-title">Little's Law — Capacity Planning Calculator</span></div>
<pre class="code-block"><span class="cm">// Little's Law: L = λ × W</span>
<span class="cm">// L = avg items in system, λ = arrival rate, W = avg time in system</span>

<span class="cm">// Example 1: API Server Capacity</span>
<span class="kw">double</span> requestsPerSec = <span class="cn">5000</span>;    <span class="cm">// λ = 5000 RPS</span>
<span class="kw">double</span> avgLatency     = <span class="cn">0.2</span>;     <span class="cm">// W = 200ms = 0.2s</span>
<span class="kw">double</span> concurrent     = requestsPerSec * avgLatency; <span class="cm">// L = 1000</span>
<span class="cm">// → 1000 concurrent requests handle karne ka capacity chahiye</span>

<span class="cm">// Example 2: Thread Pool Size for Database</span>
<span class="kw">double</span> queriesPerSec  = <span class="cn">2000</span>;    <span class="cm">// λ = 2000 QPS</span>
<span class="kw">double</span> avgQueryTime   = <span class="cn">0.01</span>;    <span class="cm">// W = 10ms = 0.01s</span>
<span class="kw">double</span> poolSize       = queriesPerSec * avgQueryTime; <span class="cm">// L = 20</span>
<span class="cm">// → HikariCP pool size minimum 20 rakhna padega</span>

<span class="cm">// Example 3: Message Queue Planning</span>
<span class="kw">double</span> produceRate    = <span class="cn">10000</span>;   <span class="cm">// λ = 10K msgs/sec</span>
<span class="kw">double</span> processTime    = <span class="cn">0.05</span>;    <span class="cm">// W = 50ms per message</span>
<span class="kw">double</span> queueLength    = produceRate * processTime; <span class="cm">// L = 500</span>
<span class="cm">// → Average 500 messages queue mein pending honge</span>

<span class="cm">// Pro Tip: Agar L bahut bada ho raha hai → ya toh λ kam karo (rate limit)</span>
<span class="cm">// ya W kam karo (optimize latency) ya resources badhao (scale)</span></pre></div>
</div>

<!-- 27. PACELC Theorem -->
<div class="section theme-purple">
<div class="section-title"><span class="section-num">27</span> PACELC Theorem (CAP Ka Advanced Version)</div>
<p style="color:#b0bec5;margin-bottom:12px;font-size:1.05em"><strong>Kya hai?</strong> — CAP Theorem sirf partition ke time ki baat karta hai. But <b>PACELC</b> kehta hai: "Partition ke time <b>A vs C</b> choose karo, <b>Else</b> (normal time) <b>Latency vs Consistency</b> choose karo." Yeh real-world systems ko zyada accurately describe karta hai.</p>

<div class="bottleneck-grid">
<div class="bottleneck-card">
<h4 style="color:#b388ff">Full Form Samjho</h4>
<p><b>P</b> — if there is a <b>Partition</b><br>
<b>A</b> — choose <b>Availability</b><br>
<b>C</b> — or choose <b>Consistency</b><br>
<b>E</b> — <b>Else</b> (jab partition nahi hai)<br>
<b>L</b> — choose <b>Latency</b> (fast response)<br>
<b>C</b> — or choose <b>Consistency</b> (correct data)<br><br>
<em>Matlab:</em> "Partition hai toh A ya C choose karo. Nahi hai toh L ya C choose karo."</p>
</div>
<div class="bottleneck-card">
<h4 style="color:#b388ff">CAP vs PACELC</h4>
<p><b>CAP Problem:</b><br>
CAP sirf extreme case (network partition) ki baat karta hai. Normal operations mein kya tradeoff hai — yeh CAP nahi batata.<br><br>
<b>PACELC Addition:</b><br>
Normal time mein bhi ek tradeoff hai — agar data ko sab nodes pe sync karoge (Consistency) toh latency badhegi. Agar fast response chahiye (Low Latency) toh eventual consistency accept karna padega.<br><br>
<em>PACELC = CAP + normal operation tradeoff</em></p>
</div>
<div class="bottleneck-card">
<h4 style="color:#b388ff">Real World Database Examples</h4>
<p><b>DynamoDB — PA/EL:</b><br>
Partition → Availability choose karo<br>
Else → Low Latency choose karo<br>
(Fast read, eventual consistency by default)<br><br>
<b>MongoDB — PA/EC:</b><br>
Partition → Availability<br>
Else → Consistency (strong reads from primary)<br><br>
<b>HBase — PC/EC:</b><br>
Partition → Consistency<br>
Else → Consistency<br>
(Always consistent — banking ke liye best)</p>
</div>
<div class="bottleneck-card">
<h4 style="color:#b388ff">Interview Mein Kaise Bolein?</h4>
<p><b>Q: "CAP se zyada realistic theorem kya hai?"</b><br><br>
<b>Answer:</b> "PACELC theorem, because CAP sirf partition failure ke scenario cover karta hai. Lekin real life mein 99.9% time partition hota hi nahi — tab bhi Latency vs Consistency ka tradeoff rehta hai. PACELC dono scenarios cover karta hai."<br><br>
<b>Q: "Cassandra ka PACELC classification kya hai?"</b><br>
<b>A:</b> "PA/EL — Partition pe Available, normal time pe Low Latency. Isliye real-time analytics aur high-write systems mein use hota hai."</p>
</div>
</div>

<div class="code-wrapper"><div class="code-titlebar"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span><span class="code-title">PACELC — Database Classification Table</span></div>
<pre class="code-block"><span class="cm">// PACELC Classification of Popular Databases</span>
<span class="cm">// Format: Database → P(A/C) / E(L/C)</span>

<span class="cm">// ┌──────────────────┬────────────┬────────────┬────────────────────┐</span>
<span class="cm">// │ Database         │ Partition  │ Else       │ Use Case           │</span>
<span class="cm">// ├──────────────────┼────────────┼────────────┼────────────────────┤</span>
<span class="cm">// │ DynamoDB         │ PA         │ EL         │ E-commerce, Gaming │</span>
<span class="cm">// │ Cassandra        │ PA         │ EL         │ Analytics, IoT     │</span>
<span class="cm">// │ MongoDB          │ PA         │ EC         │ General purpose    │</span>
<span class="cm">// │ HBase            │ PC         │ EC         │ Banking, Finance   │</span>
<span class="cm">// │ PostgreSQL       │ PC         │ EC         │ Traditional RDBMS  │</span>
<span class="cm">// │ CockroachDB      │ PC         │ EC         │ Global SQL         │</span>
<span class="cm">// │ Couchbase        │ PA         │ EL         │ Mobile, Caching    │</span>
<span class="cm">// └──────────────────┴────────────┴────────────┴────────────────────┘</span>

<span class="cm">// Key Insight:</span>
<span class="cm">// PA/EL → Speed-focused (social media, gaming, caching)</span>
<span class="cm">// PC/EC → Safety-focused (banking, transactions, inventory)</span>
<span class="cm">// PA/EC → Balanced (general purpose apps)</span></pre></div>
</div>

<!-- 28. Amdahl's Law -->
<div class="section theme-orange">
<div class="section-title"><span class="section-num">28</span> Amdahl's Law (Parallel Processing Ki Limit)</div>
<p style="color:#b0bec5;margin-bottom:12px;font-size:1.05em"><strong>Kya hai?</strong> — Amdahl's Law batata hai ki kisi task ko parallel processing se kitna fast kar sakte ho. Agar task ka kuch part serial hai (parallel nahi ho sakta), toh chahe infinite CPUs/servers lagao — usse zyada speedup kabhi nahi milega. <b>Bottleneck wahi serial part hai!</b></p>

<div class="bottleneck-grid">
<div class="bottleneck-card">
<h4 style="color:#ffab40">Formula</h4>
<p><b>Speedup = 1 / (S + P/N)</b><br><br>
<b>S</b> = Serial fraction (jo part parallel nahi ho sakta) — e.g., 0.1 means 10% serial<br>
<b>P</b> = Parallel fraction (1 - S) — e.g., 0.9 means 90% parallel<br>
<b>N</b> = Number of processors/servers<br><br>
<b>Example:</b> Agar 20% kaam serial hai (S=0.2):<br>
2 CPUs → Speedup = 1/(0.2+0.8/2) = <b>1.67x</b><br>
10 CPUs → Speedup = 1/(0.2+0.8/10) = <b>3.57x</b><br>
∞ CPUs → Speedup = 1/0.2 = <b>5x MAX</b><br>
<em>20% serial → maximum 5x fast ho sakta hai, chahe 1000 CPUs lagao!</em></p>
</div>
<div class="bottleneck-card">
<h4 style="color:#ffab40">System Design Mein Kahan Use Hota Hai?</h4>
<p><b>1. Horizontal Scaling Decision:</b><br>
Agar 30% code sequential hai → max 3.3x improvement. More servers = waste!<br><br>
<b>2. Microservices Decomposition:</b><br>
Jo service sequential bottleneck hai usko identify karo — parallel karne se pehle serial part optimize karo<br><br>
<b>3. Database Query Optimization:</b><br>
Parallel queries tabhi help karengi jab koi sequential dependency na ho (joins, locks)<br><br>
<b>4. MapReduce / Big Data:</b><br>
Map phase parallel hai, Reduce phase serial-ish → Amdahl's Law limit karta hai</p>
</div>
<div class="bottleneck-card">
<h4 style="color:#ffab40">Real World Examples</h4>
<p><b>E-commerce Order Flow:</b><br>
Serial: Validate order → Check payment<br>
Parallel: Update inventory + Send email + Generate invoice<br>
Serial part = 40%, toh max speedup = 2.5x<br><br>
<b>Web Server:</b><br>
Serial: Parse request, build response<br>
Parallel: DB calls, API calls, cache lookups<br>
Serial part = 10%, max speedup = 10x<br><br>
<b>Video Processing:</b><br>
Serial: Read file header<br>
Parallel: Process frames (highly parallelizable!)<br>
Serial part = 2%, max speedup = 50x</p>
</div>
<div class="bottleneck-card">
<h4 style="color:#ffab40">Key Takeaways</h4>
<p><b>1.</b> Pehle serial bottleneck dhundho, usse optimize karo — servers add karna baad mein<br><br>
<b>2.</b> Agar 50% kaam serial hai → max 2x improvement. More servers = waste of money<br><br>
<b>3.</b> Interview mein bolo: "Before scaling horizontally, main Amdahl's Law check karunga — identify karunga ki kitna kaam actually parallel ho sakta hai"<br><br>
<b>4.</b> Amdahl's Law + Little's Law = powerful combo for capacity planning<br><br>
<em>Rule of thumb: Serial part ko kam karo, tabhi scaling ka fayda milega!</em></p>
</div>
</div>

<div class="code-wrapper"><div class="code-titlebar"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span><span class="code-title">Amdahl's Law — Speedup Calculator</span></div>
<pre class="code-block"><span class="cm">// Amdahl's Law: Speedup = 1 / (S + P/N)</span>
<span class="cm">// S = serial fraction, P = parallel fraction (1-S), N = processors</span>

<span class="kw">public class</span> <span class="tp">AmdahlsLaw</span> {
    <span class="kw">public static double</span> <span class="fn">maxSpeedup</span>(<span class="kw">double</span> serialFraction, <span class="kw">int</span> processors) {
        <span class="kw">double</span> parallelFraction = <span class="cn">1.0</span> - serialFraction;
        <span class="kw">return</span> <span class="cn">1.0</span> / (serialFraction + parallelFraction / processors);
    }

    <span class="kw">public static void</span> <span class="fn">main</span>(<span class="tp">String</span>[] args) {
        <span class="kw">double</span> serial = <span class="cn">0.1</span>;  <span class="cm">// 10% kaam serial hai</span>

        System.out.<span class="fn">println</span>(<span class="st">"Serial fraction: "</span> + (serial * <span class="cn">100</span>) + <span class="st">"%"</span>);
        System.out.<span class="fn">println</span>(<span class="st">"-----------------------------------"</span>);

        <span class="kw">int</span>[] cores = {<span class="cn">1</span>, <span class="cn">2</span>, <span class="cn">4</span>, <span class="cn">8</span>, <span class="cn">16</span>, <span class="cn">64</span>, <span class="cn">1024</span>};
        <span class="kw">for</span> (<span class="kw">int</span> n : cores) {
            System.out.<span class="fn">printf</span>(<span class="st">"%4d cores → %.2fx speedup%n"</span>, n, <span class="fn">maxSpeedup</span>(serial, n));
        }
        <span class="cm">// Output:
        //    1 cores → 1.00x speedup
        //    2 cores → 1.82x speedup
        //    4 cores → 3.08x speedup
        //    8 cores → 4.71x speedup
        //   16 cores → 6.40x speedup
        //   64 cores → 8.77x speedup
        // 1024 cores → 9.91x speedup  ← 10% serial → max ~10x!</span>

        System.out.<span class="fn">println</span>(<span class="st">"Max theoretical speedup: "</span> + (<span class="cn">1.0</span>/serial) + <span class="st">"x"</span>);
        <span class="cm">// Max = 10x — chahe infinite cores lagao!</span>
    }
}</pre></div>
</div>

<!-- 29. ACID Properties -->
<div class="section theme-teal">
<div class="section-title"><span class="section-num">29</span> ACID Properties (Database Transaction Ka Foundation)</div>
<p style="color:#b0bec5;margin-bottom:12px;font-size:1.05em"><strong>Kya hai?</strong> — ACID woh 4 guarantees hain jo ek reliable database transaction ko milti hain. Banking, payment, inventory — jahan bhi data 100% correct chahiye wahan ACID mandatory hai. Agar ACID nahi toh data corrupt ho sakta hai!</p>

<div class="bottleneck-grid">
<div class="bottleneck-card">
<h4 style="color:#64ffda">A — Atomicity (All or Nothing)</h4>
<p><b>Matlab:</b> Transaction ya toh <b>poora complete</b> hoga ya <b>poora rollback</b> hoga. Beech mein half-done state kabhi nahi hoga.<br><br>
<b>Example — Bank Transfer:</b><br>
Step 1: A ke account se ₹500 minus<br>
Step 2: B ke account mein ₹500 plus<br><br>
Agar Step 2 fail ho gaya → Step 1 bhi <b>rollback</b> hoga. Paisa gaya nahi gayab — A ke account mein wapas.<br><br>
<em>Bina Atomicity:</em> ₹500 A se gaye, B ko nahi mile = paisa havaa mein!</p>
</div>
<div class="bottleneck-card">
<h4 style="color:#64ffda">C — Consistency (Valid State Only)</h4>
<p><b>Matlab:</b> Transaction ke baad database <b>hamesha valid state</b> mein hoga. Koi rule/constraint violate nahi hoga.<br><br>
<b>Example:</b><br>
Rule: Account balance kabhi negative nahi ho sakta.<br>
A ka balance: ₹300<br>
A tries to send ₹500 → Transaction <b>REJECT</b>!<br>
DB consistent rahi — negative balance nahi hua.<br><br>
<b>Constraints kya hote hain?</b><br>
Foreign keys, unique constraints, check constraints, NOT NULL — sab consistency enforce karte hain.</p>
</div>
<div class="bottleneck-card">
<h4 style="color:#64ffda">I — Isolation (Ek Doosre Se Independent)</h4>
<p><b>Matlab:</b> Multiple transactions ek saath chal rahi hain toh ek doosre ko <b>affect nahi karengi</b>. Har transaction ko lagta hai ki woh akeli chal rahi hai.<br><br>
<b>Example:</b><br>
T1: A ka balance read karo (₹1000)<br>
T2: A ke account mein ₹500 add karo<br>
T1 ko purana ₹1000 dikhega ya naya ₹1500 — depend karta hai isolation level pe:<br><br>
<b>Levels:</b> READ UNCOMMITTED → READ COMMITTED → REPEATABLE READ → SERIALIZABLE<br>
<em>Jitna strict isolation, utna slow — tradeoff hai!</em></p>
</div>
<div class="bottleneck-card">
<h4 style="color:#64ffda">D — Durability (Permanent Save)</h4>
<p><b>Matlab:</b> Ek baar transaction commit ho gaya → data <b>permanently saved</b> hai. Server crash ho jaaye, light chali jaaye — data safe rahega.<br><br>
<b>Kaise hota hai?</b><br>
<b>1. WAL (Write-Ahead Log):</b> Pehle log likhta hai, phir data — crash pe log se recover<br>
<b>2. Disk Flush:</b> RAM se disk pe force write<br>
<b>3. Replication:</b> Multiple copies alag servers pe<br><br>
<b>Example:</b> UPI payment successful hua → phone band ho gaya → transaction safe hai because durability guarantee.</p>
</div>
</div>

<div class="code-wrapper"><div class="code-titlebar"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span><span class="code-title">ACID — Spring Boot Transaction Example</span></div>
<pre class="code-block"><span class="cm">// ACID Transaction in Spring Boot — Bank Transfer</span>

<span class="ann">@Service</span>
<span class="kw">public class</span> <span class="tp">BankService</span> {

    <span class="ann">@Transactional</span>  <span class="cm">// ← Yeh ACID guarantee deta hai!</span>
    <span class="kw">public void</span> <span class="fn">transferMoney</span>(<span class="tp">Long</span> fromId, <span class="tp">Long</span> toId, <span class="tp">BigDecimal</span> amount) {

        <span class="cm">// ATOMICITY: Dono operations ek unit mein — fail hoga toh dono rollback</span>
        <span class="tp">Account</span> from = accountRepo.<span class="fn">findById</span>(fromId)
            .<span class="fn">orElseThrow</span>(() -> <span class="kw">new</span> <span class="tp">RuntimeException</span>(<span class="st">"Account not found"</span>));
        <span class="tp">Account</span> to = accountRepo.<span class="fn">findById</span>(toId)
            .<span class="fn">orElseThrow</span>(() -> <span class="kw">new</span> <span class="tp">RuntimeException</span>(<span class="st">"Account not found"</span>));

        <span class="cm">// CONSISTENCY: Balance negative nahi hoga</span>
        <span class="kw">if</span> (from.<span class="fn">getBalance</span>().<span class="fn">compareTo</span>(amount) < <span class="cn">0</span>) {
            <span class="kw">throw new</span> <span class="tp">InsufficientFundsException</span>(<span class="st">"Balance kam hai!"</span>);
            <span class="cm">// Transaction rollback → kuch nahi hoga</span>
        }

        <span class="cm">// ISOLATION: Doosri transaction yeh half state nahi dekh sakti</span>
        from.<span class="fn">setBalance</span>(from.<span class="fn">getBalance</span>().<span class="fn">subtract</span>(amount));
        to.<span class="fn">setBalance</span>(to.<span class="fn">getBalance</span>().<span class="fn">add</span>(amount));

        accountRepo.<span class="fn">save</span>(from);
        accountRepo.<span class="fn">save</span>(to);
        <span class="cm">// DURABILITY: Commit hone ke baad disk pe permanently saved</span>
    }
}

<span class="cm">// Isolation Levels in Spring Boot:</span>
<span class="ann">@Transactional</span>(isolation = Isolation.READ_COMMITTED)     <span class="cm">// Default — safe enough</span>
<span class="ann">@Transactional</span>(isolation = Isolation.REPEATABLE_READ)     <span class="cm">// Stricter</span>
<span class="ann">@Transactional</span>(isolation = Isolation.SERIALIZABLE)        <span class="cm">// Safest but slowest</span>

<span class="cm">// Rollback control:</span>
<span class="ann">@Transactional</span>(rollbackFor = Exception.<span class="kw">class</span>)  <span class="cm">// Checked exceptions pe bhi rollback</span>
<span class="ann">@Transactional</span>(noRollbackFor = EmailException.<span class="kw">class</span>)  <span class="cm">// Email fail pe rollback mat karo</span></pre></div>
</div>

<!-- 30. BASE Properties -->
<div class="section theme-pink">
<div class="section-title"><span class="section-num">30</span> BASE Properties (NoSQL Ka Foundation — ACID Ka Opposite)</div>
<p style="color:#b0bec5;margin-bottom:12px;font-size:1.05em"><strong>Kya hai?</strong> — BASE woh approach hai jo NoSQL databases use karti hain. ACID strict consistency deta hai (banking), but BASE flexibility deta hai — "data thodi der mein consistent hoga, but system hamesha available rahega." Social media, e-commerce jaise systems BASE follow karte hain.</p>

<div class="bottleneck-grid">
<div class="bottleneck-card">
<h4 style="color:#ff80ab">BA — Basically Available</h4>
<p><b>Matlab:</b> System <b>hamesha response dega</b> — chahe kuch nodes down ho jaayein. Ho sakta hai response mein thoda purana data ho, but system available rahega.<br><br>
<b>Example:</b><br>
Amazon pe ek product ka price 2 alag servers pe alag dikh raha hai — ₹499 aur ₹479. Dono serve kar rahe hain (available!), consistency thodi der mein aayegi.<br><br>
<b>ACID mein:</b> Jab tak sab nodes agree na karein, koi response nahi → user wait karega.<br>
<b>BASE mein:</b> Turant response — "available first!"</p>
</div>
<div class="bottleneck-card">
<h4 style="color:#ff80ab">S — Soft State</h4>
<p><b>Matlab:</b> System ki state <b>time ke saath change ho sakti hai</b> — bina kisi external input ke bhi. Data expire ho sakta hai, sync ho sakta hai, update ho sakta hai automatically.<br><br>
<b>Example:</b><br>
<b>1. Cache expiry:</b> Redis mein data tha → TTL expire hua → data automatically gaya<br>
<b>2. Replication lag:</b> Primary pe write hua → Replica pe 2 sec baad reflect hua — beech mein "soft" state<br>
<b>3. Session data:</b> User ka session 30 min baad expire → state change<br><br>
<em>ACID mein state "hard" hoti hai — sirf explicit transaction se badalti hai.</em></p>
</div>
<div class="bottleneck-card">
<h4 style="color:#ff80ab">E — Eventual Consistency</h4>
<p><b>Matlab:</b> Abhi data inconsistent ho sakta hai, but <b>eventually (thodi der mein) sab nodes pe same data</b> hoga.<br><br>
<b>Example:</b><br>
Instagram pe photo upload ki → Tumhare friend ko 3 sec baad dikhi → Eventually consistent!<br><br>
<b>Real Implementation:</b><br>
<b>1. DNS:</b> Domain update → 24-48 hrs mein globally propagate<br>
<b>2. DynamoDB:</b> Write → milliseconds mein sab replicas sync<br>
<b>3. WhatsApp:</b> Last seen update → thodi delay se sabko dikhe<br><br>
<em>Acceptable jab: Social media, search index, analytics, recommendations</em><br>
<em>NOT acceptable jab: Banking, inventory count, ticket booking</em></p>
</div>
<div class="bottleneck-card">
<h4 style="color:#ff80ab">ACID vs BASE — Comparison</h4>
<p><b>ACID:</b> Strong consistency, slow, less scalable<br>
→ SQL databases (PostgreSQL, MySQL, Oracle)<br>
→ Banking, Healthcare, Finance<br><br>
<b>BASE:</b> Eventual consistency, fast, highly scalable<br>
→ NoSQL databases (Cassandra, DynamoDB, MongoDB)<br>
→ Social media, E-commerce catalog, Analytics<br><br>
<b>Interview Answer:</b><br>
"Payment system → ACID (₹1 bhi galat nahi hona chahiye)<br>
Product catalog → BASE (price 2 sec delay se update ho toh chalega, but app down nahi hona chahiye)"</p>
</div>
</div>

<div class="code-wrapper"><div class="code-titlebar"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span><span class="code-title">ACID vs BASE — When To Use What</span></div>
<pre class="code-block"><span class="cm">// ACID vs BASE Decision Guide</span>

<span class="cm">// ┌────────────────────┬──────────────────┬──────────────────┐</span>
<span class="cm">// │ Feature            │ ACID             │ BASE             │</span>
<span class="cm">// ├────────────────────┼──────────────────┼──────────────────┤</span>
<span class="cm">// │ Consistency        │ Strong (turant)  │ Eventual (delay) │</span>
<span class="cm">// │ Availability       │ Sacrifice karta  │ Priority hai     │</span>
<span class="cm">// │ Scalability        │ Vertical (1 box) │ Horizontal (N)   │</span>
<span class="cm">// │ Performance        │ Slower (locks)   │ Faster (no lock) │</span>
<span class="cm">// │ Data Model         │ Structured (SQL) │ Flexible (NoSQL) │</span>
<span class="cm">// │ Use Case           │ Transactions     │ Big data, feeds  │</span>
<span class="cm">// └────────────────────┴──────────────────┴──────────────────┘</span>

<span class="cm">// Real System Example: E-Commerce Platform</span>

<span class="cm">// ACID use karo yahan:</span>
<span class="ann">@Transactional</span>  <span class="cm">// PostgreSQL — ACID</span>
<span class="kw">public void</span> <span class="fn">processPayment</span>(<span class="tp">Order</span> order) {
    deductBalance(order.getUserId(), order.getAmount());   <span class="cm">// ₹ accurate hona chahiye</span>
    updateInventory(order.getProductId(), -<span class="cn">1</span>);             <span class="cm">// Stock count correct</span>
    createOrderRecord(order);                               <span class="cm">// Order save</span>
    <span class="cm">// Sab ya kuch nahi — ACID Atomicity!</span>
}

<span class="cm">// BASE use karo yahan:</span>
<span class="kw">public void</span> <span class="fn">updateProductCatalog</span>(<span class="tp">Product</span> product) {
    dynamoDB.<span class="fn">putItem</span>(product);  <span class="cm">// DynamoDB — BASE</span>
    <span class="cm">// Price update 2-3 sec mein sab regions mein propagate hoga</span>
    <span class="cm">// Eventual consistency acceptable hai yahan</span>
    <span class="cm">// But system hamesha available rahega — 100M users ke liye zaroori!</span>
}

<span class="cm">// Interview Pro Tip:</span>
<span class="cm">// "Mere system mein payment service ACID follow karegi (PostgreSQL)</span>
<span class="cm">// aur product catalog service BASE follow karegi (DynamoDB)</span>
<span class="cm">// — kyunki dono ki requirements alag hain!"</span></pre></div>
</div>

<!-- 31. UML Diagrams -->
<div class="section theme-blue">
<div class="section-title"><span class="section-num">31</span> UML Diagrams (System Ko Visualize Karna)</div>
<p style="color:#b0bec5;margin-bottom:12px;font-size:1.05em"><strong>Kya hai?</strong> — <b>UML (Unified Modeling Language)</b> ek standard visual language hai jo software system ko diagrams ke through represent karti hai. Code likhne se pehle system ka blueprint banate ho — woh UML hai. Jaise ghar banane se pehle naqsha (map) banate ho, waise hi software banane se pehle UML diagrams banate ho. Interview mein LLD round mein UML diagrams banana aana chahiye!</p>

<div class="bottleneck-grid">
<div class="bottleneck-card">
<h4 style="color:#42a5f5">UML Kyun Zaroori Hai?</h4>
<p><b>1. Communication:</b> Team ke saath design share karna easy — diagram bol deta hai sab kuch<br><br>
<b>2. Documentation:</b> Naye developer ko system samajhne mein help karta hai — code padhne ki zaroorat nahi<br><br>
<b>3. Planning:</b> Code likhne se pehle design sochte ho → bugs kam hote hain, rework kam hota hai<br><br>
<b>4. Interview:</b> LLD round mein interviewer kehta hai "Draw the class diagram" ya "Show me the sequence diagram" — yeh aana chahiye!<br><br>
<b>Tools:</b> draw.io, Lucidchart, PlantUML, Mermaid, StarUML</p>
</div>
<div class="bottleneck-card">
<h4 style="color:#42a5f5">2 Main Categories</h4>
<p><b>1. Structural Diagrams (Structure Dikhate Hain):</b><br>
System ka "kya hai" — classes, objects, components kaise organized hain<br>
→ Class Diagram, Object Diagram, Component Diagram, Package Diagram<br><br>
<b>2. Behavioral Diagrams (Behavior Dikhate Hain):</b><br>
System "kaise kaam karta hai" — flow, interaction, state changes<br>
→ Use Case Diagram, Sequence Diagram, Activity Diagram, State Diagram<br><br>
<em>Interview mein 4 sabse important:</em> Class, Sequence, Use Case, Activity</p>
</div>
<div class="bottleneck-card">
<h4 style="color:#42a5f5">Class Diagram Symbols</h4>
<p><b>Class Box:</b> 3 sections — Name | Attributes | Methods<br><br>
<b>Relationships:</b><br>
<b>──────▶</b> Association (uses / has reference)<br>
<b>◆──────▶</b> Composition (strong "part of" — child dies with parent)<br>
<b>◇──────▶</b> Aggregation (weak "has a" — child survives independently)<br>
<b>- - - - -▶</b> Dependency (temporary use)<br>
<b>──────▷</b> Inheritance (extends / is-a)<br>
<b>- - - - -▷</b> Implementation (implements interface)<br><br>
<b>Visibility:</b> + public, - private, # protected, ~ package</p>
</div>
<div class="bottleneck-card">
<h4 style="color:#42a5f5">Multiplicity (Cardinality)</h4>
<p><b>1</b> → Exactly one<br>
<b>0..1</b> → Zero or one (optional)<br>
<b>*</b> → Zero or more (many)<br>
<b>1..*</b> → One or more (at least one)<br>
<b>0..*</b> → Zero or more<br><br>
<b>Example:</b><br>
User <b>1</b> ────── <b>0..*</b> Order<br>
(Ek user ke 0 ya zyada orders ho sakte hain)<br><br>
Order <b>1</b> ────── <b>1..*</b> OrderItem<br>
(Ek order mein kam se kam 1 item hoga)</p>
</div>
</div>

<div class="bottleneck-grid">
<div class="bottleneck-card">
<h4 style="color:#42a5f5">1. Class Diagram (Sabse Important!)</h4>
<p><b>Kya dikhata hai:</b> Classes, unke attributes, methods, aur classes ke beech relationships<br><br>
<b>Kab use karo:</b><br>
→ LLD interview mein (90% time yahi puchte hain)<br>
→ Database schema design karte time<br>
→ OOP relationships define karte time<br><br>
<b>Example:</b> "Design a Parking Lot" → ParkingLot, Floor, Slot, Vehicle, Ticket classes aur unke relationships<br><br>
<em>Tip: Interview mein pehle classes identify karo → phir relationships → phir methods</em></p>
</div>
<div class="bottleneck-card">
<h4 style="color:#42a5f5">2. Sequence Diagram</h4>
<p><b>Kya dikhata hai:</b> Objects ke beech <b>time-order mein messages/calls</b> — kaun kisko kab call karta hai<br><br>
<b>Kab use karo:</b><br>
→ API flow dikhana ho (user → controller → service → DB)<br>
→ Microservice communication flow<br>
→ Authentication/Login flow<br><br>
<b>Elements:</b><br>
<b>Actor:</b> Stick figure (User)<br>
<b>Lifeline:</b> Dotted vertical line (object ka lifecycle)<br>
<b>→ Solid arrow:</b> Synchronous call<br>
<b>--→ Dashed arrow:</b> Response/return<br>
<b>Activation box:</b> Thin rectangle (processing time)</p>
</div>
<div class="bottleneck-card">
<h4 style="color:#42a5f5">3. Use Case Diagram</h4>
<p><b>Kya dikhata hai:</b> System kya-kya kar sakta hai (features) aur <b>kaun use karega</b> (actors)<br><br>
<b>Kab use karo:</b><br>
→ Requirement gathering phase mein<br>
→ Stakeholders ko features explain karna<br>
→ System boundary define karna<br><br>
<b>Elements:</b><br>
<b>Actor:</b> Stick figure (User, Admin, System)<br>
<b>Use Case:</b> Oval/ellipse (Login, Place Order, Pay)<br>
<b>System Boundary:</b> Rectangle box<br>
<b>Relationships:</b> include (mandatory), extend (optional)<br><br>
<b>Example:</b> ATM System → Actors: Customer, Bank. Use Cases: Withdraw, Deposit, Check Balance</p>
</div>
<div class="bottleneck-card">
<h4 style="color:#42a5f5">4. Activity Diagram (Flowchart Jaisa)</h4>
<p><b>Kya dikhata hai:</b> Step-by-step <b>workflow/flow</b> — kaise ek process execute hota hai, decisions, parallel paths<br><br>
<b>Kab use karo:</b><br>
→ Business logic flow dikhana (order processing, payment flow)<br>
→ Complex conditional logic samjhana<br>
→ Parallel activities dikhana<br><br>
<b>Elements:</b><br>
<b>●</b> Start node (filled circle)<br>
<b>◉</b> End node (filled circle with border)<br>
<b>▭</b> Activity (rounded rectangle)<br>
<b>◇</b> Decision (diamond) — if/else<br>
<b>▬</b> Fork/Join bar — parallel activities<br>
<b>Swimlanes:</b> Vertical columns (kaun kya karega)</p>
</div>
</div>

<div class="bottleneck-grid">
<div class="bottleneck-card">
<h4 style="color:#42a5f5">5. State Diagram</h4>
<p><b>Kya dikhata hai:</b> Ek object ki <b>different states</b> aur state transitions (ek state se doosri mein kaise jaata hai)<br><br>
<b>Kab use karo:</b><br>
→ Order status flow (Placed → Confirmed → Shipped → Delivered)<br>
→ Payment status (Pending → Processing → Success/Failed)<br>
→ User account states (Active → Suspended → Banned)<br><br>
<b>Example — Order States:</b><br>
CREATED → PAYMENT_PENDING → CONFIRMED → SHIPPED → DELIVERED<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓ (payment fail)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;CANCELLED</p>
</div>
<div class="bottleneck-card">
<h4 style="color:#42a5f5">6. Component Diagram</h4>
<p><b>Kya dikhata hai:</b> System ke <b>high-level components/modules</b> aur unke dependencies<br><br>
<b>Kab use karo:</b><br>
→ Microservices architecture dikhana<br>
→ System ke modules aur unki dependencies<br>
→ HLD (High Level Design) round mein<br><br>
<b>Example — E-Commerce:</b><br>
[Auth Service] → [User Service]<br>
[Order Service] → [Payment Service]<br>
[Order Service] → [Inventory Service]<br>
[API Gateway] → [All Services]<br>
[Notification Service] ← [Order Service]</p>
</div>
<div class="bottleneck-card">
<h4 style="color:#42a5f5">7. Object Diagram</h4>
<p><b>Kya dikhata hai:</b> Class diagram ka ek <b>snapshot</b> — actual objects with real values at a specific moment<br><br>
<b>Kab use karo:</b><br>
→ Class diagram ko concrete example se samjhana<br>
→ Testing scenarios visualize karna<br><br>
<b>Example:</b><br>
Class: <b>User</b>(name, email)<br>
Object: <b>user1:User</b>(name="Rahul", email="rahul@gmail.com")<br><br>
<em>Interview mein rarely puchte hain — but class diagram samjhne ke liye helpful hai</em></p>
</div>
<div class="bottleneck-card">
<h4 style="color:#42a5f5">8. Package Diagram</h4>
<p><b>Kya dikhata hai:</b> Code ke <b>packages/modules</b> ka organization — kaise group kiya hai<br><br>
<b>Kab use karo:</b><br>
→ Project structure dikhana<br>
→ Module dependencies visualize karna<br><br>
<b>Example — Spring Boot:</b><br>
📦 com.app<br>
├── 📦 controller (REST APIs)<br>
├── 📦 service (Business logic)<br>
├── 📦 repository (DB access)<br>
├── 📦 model (Entities/DTOs)<br>
├── 📦 config (Security, DB config)<br>
└── 📦 exception (Error handling)<br><br>
<em>Mostly used for large projects with many modules</em></p>
</div>
</div>

<div class="bottleneck-grid">
<div class="bottleneck-card">
<h4 style="color:#42a5f5">Konsa Diagram Kab Use Karna Hai? — Quick Guide</h4>
<p><b>LLD Interview:</b> Class Diagram + Sequence Diagram (99% yahi chahiye)<br><br>
<b>HLD Interview:</b> Component Diagram + Sequence Diagram<br><br>
<b>Requirements Discussion:</b> Use Case Diagram<br><br>
<b>Business Logic Flow:</b> Activity Diagram<br><br>
<b>Object Lifecycle:</b> State Diagram<br><br>
<b>Code Organization:</b> Package Diagram<br><br>
<b>Debugging/Testing:</b> Object Diagram + Sequence Diagram</p>
</div>
<div class="bottleneck-card">
<h4 style="color:#42a5f5">Interview Strategy</h4>
<p><b>Step 1:</b> Requirements suno → Use Case Diagram mentally socho<br><br>
<b>Step 2:</b> Core entities identify karo → Class Diagram banao (attributes + methods + relationships)<br><br>
<b>Step 3:</b> Key flows ke liye Sequence Diagram banao (login flow, order flow, payment flow)<br><br>
<b>Step 4:</b> Agar complex state hai (order, payment) → State Diagram dikhao<br><br>
<em>"Interviewer ko lagta hai — ye banda sochta hai code likhne se pehle. Hire karo!"</em></p>
</div>
</div>

<div class="code-wrapper"><div class="code-titlebar"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span><span class="code-title">UML Class Diagram — Parking Lot LLD Example</span></div>
<pre class="code-block"><span class="cm">// Class Diagram → Java Code Mapping</span>
<span class="cm">// Yeh diagram ka code representation hai — interview mein dono dikhao!</span>

<span class="cm">// ┌─────────────────────────┐</span>
<span class="cm">// │      ParkingLot          │</span>
<span class="cm">// ├─────────────────────────┤</span>
<span class="cm">// │ - name: String           │</span>
<span class="cm">// │ - floors: List&lt;Floor&gt;    │</span>
<span class="cm">// ├─────────────────────────┤</span>
<span class="cm">// │ + addFloor(f): void      │</span>
<span class="cm">// │ + findSlot(v): Slot      │</span>
<span class="cm">// └──────────┬──────────────┘</span>
<span class="cm">//            │ 1</span>
<span class="cm">//            │ ◆ Composition (Floor can't exist without ParkingLot)</span>
<span class="cm">//            │ *</span>
<span class="cm">// ┌──────────┴──────────────┐</span>
<span class="cm">// │        Floor             │</span>
<span class="cm">// ├─────────────────────────┤</span>
<span class="cm">// │ - floorNumber: int       │</span>
<span class="cm">// │ - slots: List&lt;Slot&gt;      │</span>
<span class="cm">// ├─────────────────────────┤</span>
<span class="cm">// │ + getAvailableSlots()    │</span>
<span class="cm">// └──────────┬──────────────┘</span>
<span class="cm">//            │ 1</span>
<span class="cm">//            │ ◆ Composition</span>
<span class="cm">//            │ *</span>
<span class="cm">// ┌──────────┴──────────────┐       ┌─────────────────────┐</span>
<span class="cm">// │        Slot              │       │   &lt;&lt;enum&gt;&gt;          │</span>
<span class="cm">// ├─────────────────────────┤       │   SlotType           │</span>
<span class="cm">// │ - slotId: String         │       ├─────────────────────┤</span>
<span class="cm">// │ - type: SlotType         │──────▶│ SMALL, MEDIUM,      │</span>
<span class="cm">// │ - isOccupied: boolean    │       │ LARGE, HANDICAPPED  │</span>
<span class="cm">// │ - vehicle: Vehicle       │       └─────────────────────┘</span>
<span class="cm">// ├─────────────────────────┤</span>
<span class="cm">// │ + park(v): boolean       │</span>
<span class="cm">// │ + unpark(): Vehicle      │</span>
<span class="cm">// └──────────┬──────────────┘</span>
<span class="cm">//            │ 0..1  (slot mein 0 ya 1 vehicle hogi)</span>
<span class="cm">//            │ ◇ Aggregation (Vehicle exists independently)</span>
<span class="cm">//            │</span>
<span class="cm">// ┌──────────┴──────────────┐</span>
<span class="cm">// │      Vehicle             │</span>
<span class="cm">// ├─────────────────────────┤</span>
<span class="cm">// │ - licensePlate: String   │</span>
<span class="cm">// │ - type: VehicleType      │</span>
<span class="cm">// │ - color: String          │</span>
<span class="cm">// └─────────────────────────┘</span>

<span class="cm">// Code Implementation:</span>
<span class="kw">public class</span> <span class="tp">ParkingLot</span> {
    <span class="kw">private</span> <span class="tp">String</span> name;
    <span class="kw">private</span> <span class="tp">List</span>&lt;<span class="tp">Floor</span>&gt; floors;  <span class="cm">// ◆ Composition: ParkingLot owns Floors</span>

    <span class="kw">public</span> <span class="tp">Slot</span> <span class="fn">findAvailableSlot</span>(<span class="tp">VehicleType</span> type) {
        <span class="kw">return</span> floors.<span class="fn">stream</span>()
            .<span class="fn">flatMap</span>(f -> f.<span class="fn">getSlots</span>().<span class="fn">stream</span>())
            .<span class="fn">filter</span>(s -> !s.<span class="fn">isOccupied</span>() &amp;&amp; s.<span class="fn">getType</span>().<span class="fn">fits</span>(type))
            .<span class="fn">findFirst</span>().<span class="fn">orElse</span>(<span class="kw">null</span>);
    }
}

<span class="kw">public class</span> <span class="tp">Slot</span> {
    <span class="kw">private</span> <span class="tp">Vehicle</span> vehicle;  <span class="cm">// ◇ Aggregation: Vehicle can exist without Slot</span>

    <span class="kw">public boolean</span> <span class="fn">park</span>(<span class="tp">Vehicle</span> v) {
        <span class="kw">if</span> (isOccupied) <span class="kw">return false</span>;
        <span class="kw">this</span>.vehicle = v;
        <span class="kw">this</span>.isOccupied = <span class="kw">true</span>;
        <span class="kw">return true</span>;
    }
}</pre></div>

<div class="code-wrapper"><div class="code-titlebar"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span><span class="code-title">UML Sequence Diagram — Login Flow Example</span></div>
<pre class="code-block"><span class="cm">// Sequence Diagram → Login Flow</span>
<span class="cm">// Time flows TOP to BOTTOM (↓)</span>
<span class="cm">// Arrows show method calls between objects</span>

<span class="cm">// User        Controller       Service         Repository       Redis</span>
<span class="cm">//  │              │               │                │              │</span>
<span class="cm">//  │──POST /login─▶│               │                │              │</span>
<span class="cm">//  │              │──authenticate()▶│               │              │</span>
<span class="cm">//  │              │               │──findByEmail()─▶│              │</span>
<span class="cm">//  │              │               │◀──User object───│              │</span>
<span class="cm">//  │              │               │                │              │</span>
<span class="cm">//  │              │               │──verifyPassword()              │</span>
<span class="cm">//  │              │               │  (BCrypt match) │              │</span>
<span class="cm">//  │              │               │                │              │</span>
<span class="cm">//  │              │               │──generateJWT()  │              │</span>
<span class="cm">//  │              │               │                │              │</span>
<span class="cm">//  │              │               │──cacheSession()─┼─────────────▶│</span>
<span class="cm">//  │              │               │                │     SET token│</span>
<span class="cm">//  │              │               │◀─────────────── ┼──────────────│</span>
<span class="cm">//  │              │◀──JWT token────│                │              │</span>
<span class="cm">//  │◀──200 + token─│               │                │              │</span>
<span class="cm">//  │              │               │                │              │</span>

<span class="cm">// Spring Boot Code for this Sequence:</span>
<span class="ann">@PostMapping</span>(<span class="st">"/login"</span>)
<span class="kw">public</span> <span class="tp">ResponseEntity</span>&lt;<span class="tp">AuthResponse</span>&gt; <span class="fn">login</span>(<span class="ann">@RequestBody</span> <span class="tp">LoginDTO</span> dto) {
    <span class="tp">String</span> token = authService.<span class="fn">authenticate</span>(dto);   <span class="cm">// Controller → Service</span>
    <span class="kw">return</span> ResponseEntity.<span class="fn">ok</span>(<span class="kw">new</span> <span class="tp">AuthResponse</span>(token));
}

<span class="kw">public</span> <span class="tp">String</span> <span class="fn">authenticate</span>(<span class="tp">LoginDTO</span> dto) {
    <span class="tp">User</span> user = userRepo.<span class="fn">findByEmail</span>(dto.getEmail());  <span class="cm">// Service → Repository</span>
    <span class="kw">if</span> (!encoder.<span class="fn">matches</span>(dto.getPassword(), user.<span class="fn">getPassword</span>()))
        <span class="kw">throw new</span> <span class="tp">BadCredentialsException</span>(<span class="st">"Wrong password"</span>);
    <span class="tp">String</span> jwt = jwtUtil.<span class="fn">generateToken</span>(user);        <span class="cm">// Generate JWT</span>
    redis.<span class="fn">set</span>(<span class="st">"session:"</span> + user.getId(), jwt);         <span class="cm">// Service → Redis</span>
    <span class="kw">return</span> jwt;
}</pre></div>

<div class="code-wrapper"><div class="code-titlebar"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span><span class="code-title">All UML Diagrams — Quick Reference Table</span></div>
<pre class="code-block"><span class="cm">// ┌────────────────────┬──────────────┬─────────────────────────────────────┐</span>
<span class="cm">// │ Diagram            │ Category     │ Kab Use Karna Hai                   │</span>
<span class="cm">// ├────────────────────┼──────────────┼─────────────────────────────────────┤</span>
<span class="cm">// │ Class Diagram      │ Structural   │ LLD interview, DB design, OOP      │</span>
<span class="cm">// │ Sequence Diagram   │ Behavioral   │ API flow, service communication    │</span>
<span class="cm">// │ Use Case Diagram   │ Behavioral   │ Requirements, feature listing      │</span>
<span class="cm">// │ Activity Diagram   │ Behavioral   │ Business flow, complex logic       │</span>
<span class="cm">// │ State Diagram      │ Behavioral   │ Order/payment status, lifecycle    │</span>
<span class="cm">// │ Component Diagram  │ Structural   │ HLD, microservice architecture     │</span>
<span class="cm">// │ Object Diagram     │ Structural   │ Class diagram ka real example      │</span>
<span class="cm">// │ Package Diagram    │ Structural   │ Project structure, module deps     │</span>
<span class="cm">// ├────────────────────┼──────────────┼─────────────────────────────────────┤</span>
<span class="cm">// │ INTERVIEW FOCUS:   │              │                                     │</span>
<span class="cm">// │ ★ Class Diagram    │ #1 Priority  │ "Design Parking Lot / BookMyShow"  │</span>
<span class="cm">// │ ★ Sequence Diagram │ #2 Priority  │ "Show login/order/payment flow"    │</span>
<span class="cm">// │ ★ Use Case Diagram │ #3 Priority  │ "What can users do in this system?"│</span>
<span class="cm">// │ ★ State Diagram    │ #4 Priority  │ "Show order/ticket lifecycle"      │</span>
<span class="cm">// └────────────────────┴──────────────┴─────────────────────────────────────┘</span>

<span class="cm">// Composition vs Aggregation vs Association — Summary:</span>
<span class="cm">// ◆ Composition  → "Part of" (Room dies when House is destroyed)</span>
<span class="cm">// ◇ Aggregation  → "Has a"   (Student exists without University)</span>
<span class="cm">// → Association  → "Uses"    (Teacher teaches Student)</span>
<span class="cm">// --▷ Implements → "Can do"  (Dog implements Animal interface)</span>
<span class="cm">// ──▷ Extends    → "Is a"    (Dog extends Animal class)</span></pre></div>
</div>

<!-- FINAL: Interview Cheat Sheet -->
<div class="section theme-purple">
<div class="section-title"><span class="section-num">&#127942;</span> Master Cheat Sheet — Interview Quick Revision</div>
<div class="summary-grid">
<div class="summary-card"><h4>Performance</h4><p><b>Latency</b> = response time | <b>Throughput</b> = requests/sec | Cache = 1ms, DB = 100ms, Network = 200ms | Reduce latency: Cache → CDN → Index → Pool → Async</p></div>
<div class="summary-card"><h4>Reliability</h4><p><b>Availability</b> = 99.99% = 52min/year down | Parallel = more available | HA: Redundancy + Failover + Health checks | SLA > SLO > SLI</p></div>
<div class="summary-card"><h4>Data</h4><p><b>CAP:</b> CP=Banking, AP=Social | <b>SQL:</b> ACID, relationships | <b>NoSQL:</b> Scale, flexible | <b>Index:</b> B-Tree, composite | <b>Sharding:</b> Last resort</p></div>
<div class="summary-card"><h4>Communication</h4><p><b>Sync:</b> REST/gRPC | <b>Async:</b> Kafka/RabbitMQ | <b>Real-time:</b> WebSocket | <b>Events:</b> Pub/Sub | At-least-once + Idempotency = safe</p></div>
<div class="summary-card"><h4>Architecture</h4><p><b>Start:</b> Monolith → Scale: Microservices | <b>Gateway:</b> Auth + Rate limit + Route | <b>Patterns:</b> Strategy, Factory, Observer, Builder</p></div>
<div class="summary-card"><h4>Resilience</h4><p><b>Circuit Breaker:</b> CLOSED→OPEN→HALF-OPEN | <b>Retry:</b> Exponential backoff | <b>Saga:</b> Distributed tx | <b>Idempotency:</b> UUID key + Redis cache</p></div>
<div class="summary-card"><h4>Theorems & Laws</h4><p><b>Little's Law:</b> L=λ×W (capacity planning) | <b>Amdahl's Law:</b> Speedup=1/(S+P/N) (scaling limit) | <b>CAP:</b> Pick 2 of C,A,P | <b>PACELC:</b> CAP + Latency vs Consistency tradeoff in normal ops</p></div>
<div class="summary-card"><h4>ACID vs BASE</h4><p><b>ACID:</b> Atomicity, Consistency, Isolation, Durability → SQL, Banking | <b>BASE:</b> Basically Available, Soft state, Eventual consistency → NoSQL, Social media | Payment=ACID, Catalog=BASE</p></div>
<div class="summary-card"><h4>UML Diagrams</h4><p><b>LLD:</b> Class Diagram (#1) + Sequence Diagram (#2) | <b>HLD:</b> Component Diagram | <b>Requirements:</b> Use Case Diagram | <b>Flow:</b> Activity Diagram | <b>Lifecycle:</b> State Diagram | ◆=Composition ◇=Aggregation →=Association</p></div>
</div>
</div>

</div>
<!-- END LLD THEORY -->

<!-- TOPIC_PLACEHOLDER -->
`
}
