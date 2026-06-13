export default {
  title: "Payment System &mdash; Low Level Design",
  subtitle: "Complete LLD for Java Spring Boot Interview &mdash; Payment Gateway, Wallet, Refunds &amp; Reconciliation",
  subtitleColor: "#e0f2f1",
  headerGradient: "linear-gradient(135deg,#004d40,#00695c,#64ffda)",
  footerText: "Payment System &mdash; Low Level Design",
  content: `
<div class="section theme-green">
    <div class="section-title"><span class="section-num">1</span>Functional Requirements</div>
    <div class="req-grid">
        <div class="req-pill"><span class="num">1</span><div class="fr-content"><div class="fr-en">Payment Initiation (UPI / Card / Net Banking)</div><div class="fr-hi">UPI, Card, Net Banking se payment start karo</div></div></div>
        <div class="req-pill"><span class="num">2</span><div class="fr-content"><div class="fr-en">Payment Gateway Integration (Razorpay / Stripe)</div><div class="fr-hi">Razorpay/Stripe gateway integrate karo — payment process karo</div></div></div>
        <div class="req-pill"><span class="num">3</span><div class="fr-content"><div class="fr-en">Idempotency (prevent double charge)</div><div class="fr-hi">Double payment nahi hona chahiye — idempotency key se ensure karo</div></div></div>
        <div class="req-pill"><span class="num">4</span><div class="fr-content"><div class="fr-en">Wallet System (top-up, debit, balance)</div><div class="fr-hi">Wallet me balance add karo, debit karo, balance check karo</div></div></div>
        <div class="req-pill"><span class="num">5</span><div class="fr-content"><div class="fr-en">Full &amp; Partial Refunds</div><div class="fr-hi">Full ya partial refund process karo — cancel/return pe</div></div></div>
        <div class="req-pill"><span class="num">6</span><div class="fr-content"><div class="fr-en">Ledger / Double-Entry Bookkeeping</div><div class="fr-hi">Har transaction ka debit-credit ledger maintain karo</div></div></div>
        <div class="req-pill"><span class="num">7</span><div class="fr-content"><div class="fr-en">Webhook Handling (async status updates)</div><div class="fr-hi">Payment gateway se async status updates webhook pe handle karo</div></div></div>
        <div class="req-pill"><span class="num">8</span><div class="fr-content"><div class="fr-en">Reconciliation (daily settlement matching)</div><div class="fr-hi">Daily settlement — gateway aur apne records match karo</div></div></div>
        <div class="req-pill"><span class="num">9</span><div class="fr-content"><div class="fr-en">Fraud Detection (velocity checks, amount limits)</div><div class="fr-hi">Fraud detect karo — zyada transactions, unusual amounts, velocity checks</div></div></div>
        <div class="req-pill"><span class="num">10</span><div class="fr-content"><div class="fr-en">PCI-DSS Compliance (tokenized card storage)</div><div class="fr-hi">Card data tokenize karke store karo — PCI-DSS compliance</div></div></div>
        <div class="req-pill"><span class="num">11</span><div class="fr-content"><div class="fr-en">Multi-Currency Support</div><div class="fr-hi">Multiple currencies support karo — INR, USD, EUR conversion</div></div></div>
        <div class="req-pill"><span class="num">12</span><div class="fr-content"><div class="fr-en">Payment State Machine (lifecycle tracking)</div><div class="fr-hi">Payment ka lifecycle track karo — INITIATED to CAPTURED/FAILED</div></div></div>
    </div>
</div>

<!-- ============ NON-FUNCTIONAL REQUIREMENTS ============ -->
<div class="section theme-pink">
    <div class="section-title"><span class="section-num">2</span>Non-Functional Requirements</div>
    <div class="req-grid">
        <div class="req-pill"><span class="num">1</span><div class="nfr-content"><div class="nfr-en">Low Latency &mdash; Payment processing must complete within 2 seconds</div><div class="nfr-hi">Payment process &lt; 2 sec me complete hona chahiye &mdash; user wait nahi karega</div></div></div>
        <div class="req-pill"><span class="num">2</span><div class="nfr-content"><div class="nfr-en">High Availability &mdash; 99.999% uptime for financial transactions</div><div class="nfr-hi">99.999% uptime hona chahiye &mdash; paisa ka system kabhi fail nahi hona chahiye</div></div></div>
        <div class="req-pill"><span class="num">3</span><div class="nfr-content"><div class="nfr-en">Strong Consistency &mdash; ACID guarantee for every transaction</div><div class="nfr-hi">Har transaction me ACID guarantee hona chahiye &mdash; partial update nahi ho</div></div></div>
        <div class="req-pill"><span class="num">4</span><div class="nfr-content"><div class="nfr-en">Idempotency &mdash; Duplicate payments must never occur</div><div class="nfr-hi">Duplicate payment kabhi nahi hona chahiye &mdash; idempotency key se ensure karo</div></div></div>
        <div class="req-pill"><span class="num">5</span><div class="nfr-content"><div class="nfr-en">Scalability &mdash; Handle peak sale traffic without degradation</div><div class="nfr-hi">Peak sale time pe bhi system degrade nahi hona chahiye &mdash; horizontally scale karo</div></div></div>
        <div class="req-pill"><span class="num">6</span><div class="nfr-content"><div class="nfr-en">Security &mdash; PCI DSS compliance + encryption at rest &amp; in transit</div><div class="nfr-hi">PCI DSS compliance mandatory hai &mdash; data encrypted rehna chahiye at rest + transit</div></div></div>
    </div>
</div>

<div class="section theme-purple">
    <div class="section-title"><span class="section-num">3</span>Enums</div>
    <div class="enum-grid">
        <div class="enum-card"><h3>PaymentStatus</h3><div class="enum-val">INITIATED</div><div class="enum-val">PENDING</div><div class="enum-val">AUTHORIZED</div><div class="enum-val">CAPTURED</div><div class="enum-val">FAILED</div><div class="enum-val">REFUNDED</div><div class="enum-val">PARTIALLY_REFUNDED</div></div>
        <div class="enum-card"><h3>PaymentMethod</h3><div class="enum-val">UPI</div><div class="enum-val">CREDIT_CARD</div><div class="enum-val">DEBIT_CARD</div><div class="enum-val">NET_BANKING</div><div class="enum-val">WALLET</div><div class="enum-val">EMI</div></div>
        <div class="enum-card"><h3>GatewayProvider</h3><div class="enum-val">RAZORPAY</div><div class="enum-val">STRIPE</div><div class="enum-val">PAYU</div><div class="enum-val">PHONEPE</div></div>
        <div class="enum-card"><h3>RefundStatus</h3><div class="enum-val">INITIATED</div><div class="enum-val">PROCESSING</div><div class="enum-val">COMPLETED</div><div class="enum-val">FAILED</div></div>
        <div class="enum-card"><h3>RefundType</h3><div class="enum-val">FULL</div><div class="enum-val">PARTIAL</div></div>
        <div class="enum-card"><h3>LedgerEntryType</h3><div class="enum-val">PAYMENT_CREDIT</div><div class="enum-val">PAYMENT_DEBIT</div><div class="enum-val">REFUND_CREDIT</div><div class="enum-val">REFUND_DEBIT</div><div class="enum-val">WALLET_TOPUP</div><div class="enum-val">WALLET_DEBIT</div></div>
    </div>
</div>

<div class="section theme-purple">
    <div class="section-title"><span class="section-num">4</span>Service LLD</div>
    <div class="service-grid">
        <div class="service-card">
            <h3>PaymentService</h3>
            <p class="svc-desc">Naya payment start karta hai &mdash; duplicate check, fraud check, phir gateway ko call karta hai. Payment ka pura lifecycle yahi handle karta hai.</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">PaymentService</span> {

    <span class="cm">// naya payment start karo &mdash; duplicate check, fraud check, gateway call</span>
    <span class="tp">Payment</span> <span class="fn">initiatePayment</span>(<span class="tp">PaymentRequest</span> req)

    <span class="cm">// paymentId se payment details nikalo</span>
    <span class="tp">Payment</span> <span class="fn">getPaymentById</span>(<span class="tp">String</span> paymentId)

    <span class="cm">// user ki saari payments paginated list karo</span>
    <span class="tp">Page&lt;Payment&gt;</span> <span class="fn">getUserPayments</span>(<span class="tp">Long</span> userId, <span class="tp">Pageable</span> pageable)

    <span class="cm">// authorized payment ko capture karo</span>
    <span class="tp">Payment</span> <span class="fn">capturePayment</span>(<span class="tp">String</span> paymentId)
}
</pre></div>
        </div>

        <div class="service-card">
            <h3>GatewayRoutingService</h3>
            <p class="svc-desc">Best payment gateway choose karta hai &mdash; method aur success rate ke basis pe Razorpay ya Stripe select karta hai. Ek fail ho toh dusre pe fallback.</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">GatewayRoutingService</span> {

    <span class="cm">// method aur amount ke basis pe best gateway select karo</span>
    <span class="tp">GatewayProvider</span> <span class="fn">selectGateway</span>(<span class="tp">PaymentMethod</span> method, <span class="tp">BigDecimal</span> amount)

    <span class="cm">// gateway ka real-time success rate nikalo (0.0 - 1.0)</span>
    <span class="tp">double</span> <span class="fn">getSuccessRate</span>(<span class="tp">GatewayProvider</span> provider)

    <span class="cm">// ek gateway fail ho toh next best gateway do</span>
    <span class="tp">GatewayProvider</span> <span class="fn">getFallbackGateway</span>(<span class="tp">GatewayProvider</span> failed, <span class="tp">PaymentMethod</span> method)
}
</pre></div>
        </div>

        <div class="service-card">
            <h3>RefundService</h3>
            <p class="svc-desc">Refund process karta hai &mdash; check karta hai ki refund allowed hai ya nahi, gateway ko call karta hai, records update karta hai. Full aur partial dono handle karta hai.</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">RefundService</span> {

    <span class="cm">// payment ka full ya partial refund initiate karo</span>
    <span class="tp">Refund</span> <span class="fn">refund</span>(<span class="tp">String</span> paymentId, <span class="tp">BigDecimal</span> amount)

    <span class="cm">// check karo ki payment refundable hai ya nahi (CAPTURED + window)</span>
    <span class="tp">boolean</span> <span class="fn">isRefundable</span>(<span class="tp">String</span> paymentId)

    <span class="cm">// partial refund karo with reason &mdash; totalRefunded + amount &le; original check</span>
    <span class="tp">Refund</span> <span class="fn">partialRefund</span>(<span class="tp">String</span> paymentId, <span class="tp">BigDecimal</span> amount, <span class="tp">String</span> reason)
}
</pre></div>
        </div>

        <div class="service-card">
            <h3>WalletService</h3>
            <p class="svc-desc">User ka wallet manage karta hai &mdash; balance check, debit, credit sab safely karta hai database lock ke saath. Race condition se bachne ke liye pessimistic lock use hota hai.</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">WalletService</span> {

    <span class="cm">// wallet se paisa debit karo &mdash; balance check with row lock</span>
    <span class="tp">void</span> <span class="fn">debit</span>(<span class="tp">Long</span> userId, <span class="tp">BigDecimal</span> amount)

    <span class="cm">// user ka current wallet balance nikalo</span>
    <span class="tp">BigDecimal</span> <span class="fn">getBalance</span>(<span class="tp">Long</span> userId)

    <span class="cm">// wallet me paisa credit karo &mdash; top-up, refund, cashback etc.</span>
    <span class="tp">void</span> <span class="fn">credit</span>(<span class="tp">Long</span> userId, <span class="tp">BigDecimal</span> amount, <span class="tp">String</span> reason)
}
</pre></div>
        </div>

        <div class="service-card">
            <h3>LedgerService</h3>
            <p class="svc-desc">Har paisa movement ka record rakhta hai &mdash; double-entry bookkeeping matlab har payment me ek debit aur ek credit entry banti hai. Reconciliation isi pe depend karti hai.</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">LedgerService</span> {

    <span class="cm">// ledger me ek entry record karo (debit ya credit)</span>
    <span class="tp">void</span> <span class="fn">recordEntry</span>(<span class="tp">LedgerEntry</span> entry)

    <span class="cm">// double-entry banao &mdash; ek debit + ek credit simultaneously</span>
    <span class="tp">void</span> <span class="fn">createDoubleEntry</span>(<span class="tp">String</span> paymentId, <span class="tp">String</span> debitAcc, <span class="tp">String</span> creditAcc, <span class="tp">BigDecimal</span> amount)

    <span class="cm">// payment ki saari ledger entries nikalo</span>
    <span class="tp">List&lt;LedgerEntry&gt;</span> <span class="fn">getEntriesByPayment</span>(<span class="tp">String</span> paymentId)
}
</pre></div>
        </div>

        <div class="service-card">
            <h3>WebhookService</h3>
            <p class="svc-desc">Payment gateway se status updates receive karta hai &mdash; pehle verify karta hai ki genuine hai, phir payment status update karta hai. Duplicate webhook bhi handle karta hai.</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">WebhookService</span> {

    <span class="cm">// gateway se aaya webhook process karo &mdash; verify + status update</span>
    <span class="tp">void</span> <span class="fn">processWebhook</span>(<span class="tp">String</span> payload, <span class="tp">String</span> signature)

    <span class="cm">// HMAC-SHA256 signature verify karo &mdash; har gateway ka secret alag</span>
    <span class="tp">boolean</span> <span class="fn">verifySignature</span>(<span class="tp">String</span> payload, <span class="tp">String</span> signature, <span class="tp">GatewayProvider</span> provider)

    <span class="cm">// check karo ki yeh webhook pehle process ho chuka hai ya nahi</span>
    <span class="tp">boolean</span> <span class="fn">isDuplicate</span>(<span class="tp">String</span> eventId)
}
</pre></div>
        </div>

        <div class="service-card">
            <h3>ReconciliationService</h3>
            <p class="svc-desc">Daily check karta hai &mdash; humare records ko gateway ke records se match karta hai. Mismatch mila toh flag karta hai manual review ke liye.</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">ReconciliationService</span> {

    <span class="cm">// ek din ka pura reconciliation report banao</span>
    <span class="tp">ReconciliationReport</span> <span class="fn">reconcile</span>(<span class="tp">LocalDate</span> date)

    <span class="cm">// gateway-wise mismatch records dhundho</span>
    <span class="tp">List&lt;MismatchRecord&gt;</span> <span class="fn">findMismatches</span>(<span class="tp">LocalDate</span> date, <span class="tp">GatewayProvider</span> provider)
}
</pre></div>
        </div>

        <div class="service-card">
            <h3>FraudDetectionService</h3>
            <p class="svc-desc">Suspicious payments check karta hai &mdash; unusual amount, zyada attempts, unknown location. Risk score calculate karke decide karta hai allow ya block.</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">FraudDetectionService</span> {

    <span class="cm">// payment request pe fraud check karo &mdash; suspicious toh throw karo</span>
    <span class="tp">void</span> <span class="fn">checkFraud</span>(<span class="tp">PaymentRequest</span> req)

    <span class="cm">// risk score calculate karo (amount, velocity, device check)</span>
    <span class="tp">int</span> <span class="fn">calculateRiskScore</span>(<span class="tp">PaymentRequest</span> req)

    <span class="cm">// fraud user ko block karo &mdash; velocity, amount, location reason</span>
    <span class="tp">void</span> <span class="fn">blockUser</span>(<span class="tp">Long</span> userId, <span class="tp">String</span> reason)
}
</pre></div>
        </div>
    </div>
</div>

<div class="section theme-blue">
    <div class="section-title"><span class="section-num">5</span>API Endpoints</div>
    <div class="api-grid">
        <div class="api-card"><div class="api-method post">POST</div><div class="api-path">/api/v1/payments</div><div class="api-desc">Initiate payment (requires Idempotency-Key header)</div></div>
        <div class="api-card"><div class="api-method get">GET</div><div class="api-path">/api/v1/payments/{paymentId}</div><div class="api-desc">Get payment status &amp; details</div></div>
        <div class="api-card"><div class="api-method post">POST</div><div class="api-path">/api/v1/payments/{paymentId}/capture</div><div class="api-desc">Capture authorized payment</div></div>
        <div class="api-card"><div class="api-method post">POST</div><div class="api-path">/api/v1/payments/{paymentId}/refund</div><div class="api-desc">Initiate full/partial refund</div></div>
        <div class="api-card"><div class="api-method get">GET</div><div class="api-path">/api/v1/payments?userId={id}&amp;page=0</div><div class="api-desc">List user's payment history (paginated)</div></div>
        <div class="api-card"><div class="api-method post">POST</div><div class="api-path">/api/v1/webhooks/razorpay</div><div class="api-desc">Razorpay webhook endpoint (signature verified)</div></div>
        <div class="api-card"><div class="api-method get">GET</div><div class="api-path">/api/v1/wallets/balance</div><div class="api-desc">Get wallet balance for authenticated user</div></div>
        <div class="api-card"><div class="api-method post">POST</div><div class="api-path">/api/v1/wallets/topup</div><div class="api-desc">Top up wallet balance</div></div>
        <div class="api-card"><div class="api-method get">GET</div><div class="api-path">/api/v1/ledger/{paymentId}</div><div class="api-desc">Get ledger entries for a payment</div></div>
    </div>
</div>

<div class="section theme-green">
    <div class="section-title"><span class="section-num">6</span>Database Schema</div>

    <div class="sub-heading" style="color:#ff80ab;border-color:#ff80ab">Database Technology Stack</div>
    <div class="dbtech-grid">
        <div class="dbtech-card">
            <div class="dbtech-name">PostgreSQL <span class="dbtech-type">RDBMS</span></div>
            <div class="dbtech-usage">Payments, wallets, ledger entries, refunds &mdash; ACID critical for financial data</div>
            <div class="dbtech-tables"><span>payments</span><span>wallets</span><span>refunds</span><span>ledger_entries</span></div>
        </div>
        <div class="dbtech-card">
            <div class="dbtech-name">Redis <span class="dbtech-type">In-Memory</span></div>
            <div class="dbtech-usage">Idempotency key deduplication, rate limiting, payment session cache</div>
            <div class="dbtech-tables"><span>idempotent:{key}</span><span>rate:{userId}</span></div>
        </div>
        <div class="dbtech-card">
            <div class="dbtech-name">Kafka <span class="dbtech-type">Message Queue</span></div>
            <div class="dbtech-usage">Webhook event processing, async reconciliation, payment status updates</div>
            <div class="dbtech-tables"><span>payment-events</span><span>webhook-events</span></div>
        </div>
    </div>

    <div class="db-grid">
        <div class="db-card">
            <h3>payments</h3>
            <div class="db-row"><span class="col-name">id</span><span class="col-type">BIGINT</span><span class="col-constraint">PK AUTO_INCREMENT</span></div>
            <div class="db-row"><span class="col-name">payment_id</span><span class="col-type">VARCHAR(36)</span><span class="col-constraint">UNIQUE IDX</span></div>
            <div class="db-row"><span class="col-name">order_id</span><span class="col-type">VARCHAR(64)</span><span class="col-constraint">IDX</span></div>
            <div class="db-row"><span class="col-name">user_id</span><span class="col-type">BIGINT</span><span class="col-constraint">FK IDX</span></div>
            <div class="db-row"><span class="col-name">amount</span><span class="col-type">DECIMAL(12,2)</span><span class="col-constraint">NOT NULL</span></div>
            <div class="db-row"><span class="col-name">currency</span><span class="col-type">VARCHAR(3)</span><span class="col-constraint">DEFAULT 'INR'</span></div>
            <div class="db-row"><span class="col-name">method</span><span class="col-type">ENUM</span><span class="col-constraint">NOT NULL</span></div>
            <div class="db-row"><span class="col-name">gateway</span><span class="col-type">ENUM</span><span class="col-constraint">NOT NULL</span></div>
            <div class="db-row"><span class="col-name">gateway_txn_id</span><span class="col-type">VARCHAR(128)</span><span class="col-constraint">IDX</span></div>
            <div class="db-row"><span class="col-name">status</span><span class="col-type">ENUM</span><span class="col-constraint">IDX</span></div>
            <div class="db-row"><span class="col-name">idempotency_key</span><span class="col-type">VARCHAR(64)</span><span class="col-constraint">UNIQUE</span></div>
            <div class="db-row"><span class="col-name">version</span><span class="col-type">BIGINT</span><span class="col-constraint">DEFAULT 0</span></div>
            <div class="db-row"><span class="col-name">created_at</span><span class="col-type">TIMESTAMP</span><span class="col-constraint">IDX</span></div>
        </div>
        <div class="db-card">
            <h3>wallets</h3>
            <div class="db-row"><span class="col-name">id</span><span class="col-type">BIGINT</span><span class="col-constraint">PK</span></div>
            <div class="db-row"><span class="col-name">user_id</span><span class="col-type">BIGINT</span><span class="col-constraint">FK UNIQUE</span></div>
            <div class="db-row"><span class="col-name">balance</span><span class="col-type">DECIMAL(12,2)</span><span class="col-constraint">DEFAULT 0.00</span></div>
            <div class="db-row"><span class="col-name">currency</span><span class="col-type">VARCHAR(3)</span><span class="col-constraint">DEFAULT 'INR'</span></div>
            <div class="db-row"><span class="col-name">status</span><span class="col-type">ENUM</span><span class="col-constraint">DEFAULT 'ACTIVE'</span></div>
            <div class="db-row"><span class="col-name">version</span><span class="col-type">BIGINT</span><span class="col-constraint">OCC</span></div>
        </div>
        <div class="db-card">
            <h3>refunds</h3>
            <div class="db-row"><span class="col-name">id</span><span class="col-type">BIGINT</span><span class="col-constraint">PK</span></div>
            <div class="db-row"><span class="col-name">payment_id</span><span class="col-type">BIGINT</span><span class="col-constraint">FK IDX</span></div>
            <div class="db-row"><span class="col-name">amount</span><span class="col-type">DECIMAL(12,2)</span><span class="col-constraint">NOT NULL</span></div>
            <div class="db-row"><span class="col-name">type</span><span class="col-type">ENUM</span><span class="col-constraint"></span></div>
            <div class="db-row"><span class="col-name">status</span><span class="col-type">ENUM</span><span class="col-constraint">IDX</span></div>
            <div class="db-row"><span class="col-name">gateway_refund_id</span><span class="col-type">VARCHAR(128)</span><span class="col-constraint"></span></div>
            <div class="db-row"><span class="col-name">created_at</span><span class="col-type">TIMESTAMP</span><span class="col-constraint">IDX</span></div>
        </div>
        <div class="db-card">
            <h3>ledger_entries</h3>
            <div class="db-row"><span class="col-name">id</span><span class="col-type">BIGINT</span><span class="col-constraint">PK</span></div>
            <div class="db-row"><span class="col-name">payment_id</span><span class="col-type">BIGINT</span><span class="col-constraint">FK IDX</span></div>
            <div class="db-row"><span class="col-name">debit_account</span><span class="col-type">VARCHAR(64)</span><span class="col-constraint">IDX</span></div>
            <div class="db-row"><span class="col-name">credit_account</span><span class="col-type">VARCHAR(64)</span><span class="col-constraint">IDX</span></div>
            <div class="db-row"><span class="col-name">amount</span><span class="col-type">DECIMAL(12,2)</span><span class="col-constraint"></span></div>
            <div class="db-row"><span class="col-name">type</span><span class="col-type">ENUM</span><span class="col-constraint"></span></div>
            <div class="db-row"><span class="col-name">created_at</span><span class="col-type">TIMESTAMP</span><span class="col-constraint">IDX</span></div>
        </div>
        <div class="db-card">
            <h3>webhook_events</h3>
            <div class="db-row"><span class="col-name">id</span><span class="col-type">BIGINT</span><span class="col-constraint">PK</span></div>
            <div class="db-row"><span class="col-name">event_id</span><span class="col-type">VARCHAR(128)</span><span class="col-constraint">UNIQUE</span></div>
            <div class="db-row"><span class="col-name">event_type</span><span class="col-type">VARCHAR(64)</span><span class="col-constraint"></span></div>
            <div class="db-row"><span class="col-name">payload</span><span class="col-type">JSON</span><span class="col-constraint"></span></div>
            <div class="db-row"><span class="col-name">processed</span><span class="col-type">BOOLEAN</span><span class="col-constraint">DEFAULT FALSE</span></div>
            <div class="db-row"><span class="col-name">created_at</span><span class="col-type">TIMESTAMP</span><span class="col-constraint"></span></div>
        </div>
    </div>

</div>

<div class="section theme-green">
    <div class="section-title"><span class="section-num">7</span>Capacity Estimation</div>
    <div class="cap-grid">
        <div class="cap-card"><div class="cap-label">Daily Transactions</div><div class="cap-value">10M payments/day</div></div>
        <div class="cap-card"><div class="cap-label">Peak TPS</div><div class="cap-value">~500 txn/sec</div></div>
        <div class="cap-card"><div class="cap-label">Avg Payment Size</div><div class="cap-value">~1 KB (record)</div></div>
        <div class="cap-card"><div class="cap-label">Daily Storage</div><div class="cap-value">~10 GB (payments + ledger)</div></div>
        <div class="cap-card"><div class="cap-label">Yearly Storage</div><div class="cap-value">~3.6 TB (never delete financial data)</div></div>
        <div class="cap-card"><div class="cap-label">Webhook Latency</div><div class="cap-value">Process within 5 seconds of receipt</div></div>
        <div class="cap-card"><div class="cap-label">Refund Rate</div><div class="cap-value">~3-5% of total payments</div></div>
        <div class="cap-card"><div class="cap-label">Reconciliation</div><div class="cap-value">Daily batch; 99.99% match rate target</div></div>
        <div class="cap-card">
            <h4 style="color:#82b1ff;margin-bottom:8px">CPU / Server Estimation</h4>
            <div class="calc-row"><span class="calc-label">Peak TPS</span><span class="calc-value">~500 txn/sec</span></div>
            <div class="calc-row"><span class="calc-label">Each server handles</span><span class="calc-value">~100 TPS (heavy processing)</span></div>
            <div class="calc-result"><span class="calc-label">App Servers Needed</span><span class="calc-value">~5 servers</span></div>
            <div class="calc-result"><span class="calc-label">Total CPU Cores (8 per server)</span><span class="calc-value">~40 cores</span></div>
            <div class="calc-row"><span class="calc-label">DB (primary + replicas)</span><span class="calc-value">3 nodes (HA)</span></div>
            <div class="calc-row"><span class="calc-label">Redis (idempotency cache)</span><span class="calc-value">3 nodes</span></div>
            <div class="calc-row"><span class="calc-label">Kafka (webhooks + events)</span><span class="calc-value">3 brokers</span></div>
        </div>
    </div>
</div>

<div class="section theme-green">
    <div class="section-title"><span class="section-num">8</span>Key Architecture</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span><span class="code-title">PaymentService.java &mdash; Idempotency + State Machine</span></div>
    <pre class="code-block">
<span class="ann">@Service</span> <span class="ann">@Transactional</span>
<span class="kw">public class</span> <span class="tp">PaymentService</span> <span class="kw">implements</span> <span class="tp">IPaymentService</span> {
    <span class="kw">private final</span> <span class="tp">Map</span>&lt;<span class="tp">GatewayProvider</span>, <span class="tp">IPaymentGateway</span>&gt; gateways;
    <span class="kw">private final</span> <span class="tp">PaymentRepository</span> paymentRepo;
    <span class="kw">private final</span> <span class="tp">ILedgerService</span> ledger;
    <span class="kw">private final</span> <span class="tp">FraudDetectionService</span> fraud;

    <span class="kw">public</span> <span class="tp">Payment</span> <span class="fn">initiatePayment</span>(<span class="tp">PaymentRequest</span> req) {
        <span class="cm">// 1. Idempotency check &mdash; return existing if duplicate</span>
        <span class="tp">Optional</span>&lt;<span class="tp">Payment</span>&gt; existing = paymentRepo
            .<span class="fn">findByIdempotencyKey</span>(req.getIdempotencyKey());
        <span class="kw">if</span> (existing.<span class="fn">isPresent</span>()) <span class="kw">return</span> existing.<span class="fn">get</span>();

        <span class="cm">// 2. Fraud detection</span>
        fraud.<span class="fn">checkFraud</span>(req); <span class="cm">// throws if suspicious</span>

        <span class="cm">// 3. Create payment record</span>
        <span class="tp">Payment</span> payment = <span class="tp">Payment</span>.<span class="fn">builder</span>()
            .<span class="fn">paymentId</span>(<span class="tp">UUID</span>.<span class="fn">randomUUID</span>().toString())
            .<span class="fn">orderId</span>(req.getOrderId())
            .<span class="fn">amount</span>(req.getAmount())
            .<span class="fn">method</span>(req.getMethod())
            .<span class="fn">idempotencyKey</span>(req.getIdempotencyKey())
            .<span class="fn">status</span>(<span class="tp">PaymentStatus</span>.INITIATED)
            .<span class="fn">build</span>();
        paymentRepo.<span class="fn">save</span>(payment);

        <span class="cm">// 4. Call payment gateway</span>
        <span class="tp">IPaymentGateway</span> gw = gateways.<span class="fn">get</span>(req.getGateway());
        <span class="tp">GatewayResponse</span> resp = gw.<span class="fn">initiatePayment</span>(req);
        payment.<span class="fn">setGatewayTxnId</span>(resp.getTxnId());
        payment.<span class="fn">setStatus</span>(<span class="tp">PaymentStatus</span>.PENDING);

        <span class="cm">// 5. Ledger entry (double-entry)</span>
        ledger.<span class="fn">recordEntry</span>(<span class="tp">LedgerEntry</span>.<span class="fn">builder</span>()
            .<span class="fn">paymentId</span>(payment.getId())
            .<span class="fn">debitAccount</span>(<span class="st">"user:"</span> + req.getUserId())
            .<span class="fn">creditAccount</span>(<span class="st">"merchant:escrow"</span>)
            .<span class="fn">amount</span>(req.getAmount())
            .<span class="fn">type</span>(<span class="tp">LedgerEntryType</span>.PAYMENT_DEBIT)
            .<span class="fn">build</span>());

        <span class="kw">return</span> payment;
    }
}
    </pre></div>
</div>

<div class="section theme-blue">
    <div class="section-title"><span class="section-num">9</span>Design Patterns Used</div>
    <div class="pattern-grid">
        <div class="pattern-card"><h3>Strategy</h3><p>IPaymentGateway implementations (Razorpay, Stripe) &mdash; swap gateways without modifying service</p></div>
        <div class="pattern-card"><h3>State Machine</h3><p>Payment status transitions: INITIATED&rarr;PENDING&rarr;AUTHORIZED&rarr;CAPTURED; invalid transitions throw</p></div>
        <div class="pattern-card"><h3>Observer</h3><p>Webhook events trigger async status updates; Kafka publishes PaymentStatusChanged events</p></div>
        <div class="pattern-card"><h3>Factory</h3><p>GatewayFactory creates appropriate IPaymentGateway based on provider config</p></div>
        <div class="pattern-card"><h3>Saga</h3><p>Distributed transaction: Payment &rarr; Inventory &rarr; Shipping; compensating actions on failure</p></div>
        <div class="pattern-card"><h3>Command</h3><p>PaymentCommand (initiate, capture, refund) &mdash; encapsulates action with undo capability</p></div>
    </div>
</div>

<div class="section theme-purple">
    <div class="section-title"><span class="section-num">10</span>Sequence Flow</div>
    <div class="flow-container">
        <div class="flow-step"><span class="step-num">1</span><span class="step-text">Client sends POST /api/v1/payments with Idempotency-Key header</span></div>
        <div class="flow-step"><span class="step-num">2</span><span class="step-text">PaymentService checks idempotency &mdash; returns existing if duplicate</span></div>
        <div class="flow-step"><span class="step-num">3</span><span class="step-text">FraudDetectionService runs velocity &amp; amount checks</span></div>
        <div class="flow-step"><span class="step-num">4</span><span class="step-text">GatewayRoutingService selects optimal gateway (Razorpay/Stripe)</span></div>
        <div class="flow-step"><span class="step-num">5</span><span class="step-text">IPaymentGateway.initiatePayment() &rarr; returns gateway redirect URL</span></div>
        <div class="flow-step"><span class="step-num">6</span><span class="step-text">User completes payment on gateway page (UPI/Card/NetBanking)</span></div>
        <div class="flow-step"><span class="step-num">7</span><span class="step-text">Gateway sends webhook &rarr; WebhookService verifies signature</span></div>
        <div class="flow-step"><span class="step-num">8</span><span class="step-text">PaymentService updates status (AUTHORIZED &rarr; CAPTURED)</span></div>
        <div class="flow-step"><span class="step-num">9</span><span class="step-text">LedgerService records double-entry (debit user, credit merchant)</span></div>
        <div class="flow-step"><span class="step-num">10</span><span class="step-text">Kafka publishes PaymentCaptured event for downstream (order, notification)</span></div>
    </div>
</div>

<div class="section theme-blue">
    <div class="section-title"><span class="section-num">11</span>Bottlenecks &amp; Solutions</div>
    <div class="bottleneck-grid">
        <div class="bottleneck-card"><h3>Double Payment (double click)</h3><p>Idempotency key (UUID) in UNIQUE index; return existing payment on duplicate</p></div>
        <div class="bottleneck-card"><h3>Gateway Timeout</h3><p>30s timeout with async webhook fallback; stale payment cleanup job marks PENDING&rarr;FAILED after 15min</p></div>
        <div class="bottleneck-card"><h3>Wallet Race Condition</h3><p>Pessimistic locking (SELECT FOR UPDATE) on wallet row; or @Version optimistic locking with retry</p></div>
        <div class="bottleneck-card"><h3>Webhook Ordering</h3><p>Store all webhooks; process idempotently; state machine rejects invalid transitions</p></div>
        <div class="bottleneck-card"><h3>Reconciliation Mismatch</h3><p>Daily batch job; separate mismatch queue for manual review; auto-resolve known patterns</p></div>
        <div class="bottleneck-card"><h3>Gateway Downtime</h3><p>Circuit breaker per gateway; automatic failover to secondary provider</p></div>
    </div>
</div>

<div class="section theme-purple">
    <div class="section-title"><span class="section-num">12</span>Edge Cases</div>
    <div class="edge-grid">
        <div class="edge-card"><h3>Partial Refund Exceeds Total</h3><p>Track totalRefunded per payment; validate: totalRefunded + newRefund &le; originalAmount</p></div>
        <div class="edge-card"><h3>Webhook Before API Response</h3><p>Payment created first (INITIATED); webhook can arrive before API returns &mdash; both paths update atomically</p></div>
        <div class="edge-card"><h3>Currency Conversion</h3><p>Store in original currency; convert at settlement using locked exchange rate at capture time</p></div>
        <div class="edge-card"><h3>Insufficient Wallet Balance</h3><p>Check + debit in single transaction with row lock; return 402 Payment Required</p></div>
        <div class="edge-card"><h3>Duplicate Webhook</h3><p>eventId (gateway-provided) in UNIQUE index; skip if already processed</p></div>
        <div class="edge-card"><h3>Network Failure After Capture</h3><p>Idempotent capture: if already CAPTURED, return success. Gateway returns same result for same txnId</p></div>
    </div>
</div>

<div class="section theme-green">
    <div class="section-title"><span class="section-num">13</span>Security Considerations</div>
    <div class="security-grid">
        <div class="security-card"><h3>PCI-DSS Compliance</h3><p>Never store raw card numbers; use gateway tokenization; SAQ-A for redirect flow</p></div>
        <div class="security-card"><h3>Webhook Verification</h3><p>HMAC-SHA256 signature verification; reject if signature mismatch; IP whitelist</p></div>
        <div class="security-card"><h3>Amount Tampering</h3><p>Server-side amount calculation; compare gateway callback amount with stored amount</p></div>
        <div class="security-card"><h3>SQL Injection</h3><p>Parameterized queries via JPA; never concatenate user input into SQL</p></div>
        <div class="security-card"><h3>Audit Trail</h3><p>Immutable ledger entries; every status change logged with timestamp + actor</p></div>
        <div class="security-card"><h3>Encryption</h3><p>TLS 1.3 for all gateway calls; encrypt sensitive fields at rest (AES-256)</p></div>
    </div>
</div>

<div class="section theme-blue">
    <div class="section-title"><span class="section-num">14</span>Interview Cheat-Sheet</div>
    <div class="summary-grid">
        <div class="summary-card"><strong>Idempotency</strong><br>UUID key in UNIQUE index; return existing on duplicate; prevents double charge</div>
        <div class="summary-card"><strong>State Machine</strong><br>INITIATED&rarr;PENDING&rarr;AUTHORIZED&rarr;CAPTURED&rarr;REFUNDED; reject invalid transitions</div>
        <div class="summary-card"><strong>Double-Entry Ledger</strong><br>Every payment creates debit + credit entries; enables reconciliation &amp; audit</div>
        <div class="summary-card"><strong>Gateway Strategy</strong><br>IPaymentGateway interface; Razorpay/Stripe implementations; auto-failover</div>
        <div class="summary-card"><strong>Wallet Locking</strong><br>PESSIMISTIC_WRITE or @Version OCC; check+debit atomic in single transaction</div>
        <div class="summary-card"><strong>Webhook</strong><br>Signature verification (HMAC); idempotent processing; event deduplication</div>
        <div class="summary-card"><strong>Reconciliation</strong><br>Daily batch: compare gateway settlements with ledger; flag mismatches</div>
        <div class="summary-card"><strong>Patterns</strong><br>Strategy, State Machine, Observer, Factory, Saga, Command</div>
    </div>
</div>

</div></div>
<!-- END PAYMENT SYSTEM -->

<!-- ==================== E-COMMERCE CHECKOUT ==================== -->
`
}
