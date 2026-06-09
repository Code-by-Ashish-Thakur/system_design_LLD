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
        <div class="req-pill"><span class="num">1</span> Payment Initiation (UPI / Card / Net Banking)</div>
        <div class="req-pill"><span class="num">2</span> Payment Gateway Integration (Razorpay / Stripe)</div>
        <div class="req-pill"><span class="num">3</span> Idempotency (prevent double charge)</div>
        <div class="req-pill"><span class="num">4</span> Wallet System (top-up, debit, balance)</div>
        <div class="req-pill"><span class="num">5</span> Full &amp; Partial Refunds</div>
        <div class="req-pill"><span class="num">6</span> Ledger / Double-Entry Bookkeeping</div>
        <div class="req-pill"><span class="num">7</span> Webhook Handling (async status updates)</div>
        <div class="req-pill"><span class="num">8</span> Reconciliation (daily settlement matching)</div>
        <div class="req-pill"><span class="num">9</span> Fraud Detection (velocity checks, amount limits)</div>
        <div class="req-pill"><span class="num">10</span> PCI-DSS Compliance (tokenized card storage)</div>
        <div class="req-pill"><span class="num">11</span> Multi-Currency Support</div>
        <div class="req-pill"><span class="num">12</span> Payment State Machine (lifecycle tracking)</div>
    </div>
</div>

<div class="section theme-blue">
    <div class="section-title"><span class="section-num">2</span>Core Entities</div>
    <div class="entity-grid">
        <div class="entity-card">
            <h3>Payment</h3>
            <div class="field"><span class="field-name">id</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">paymentId</span><span class="field-type">String (UUID)</span></div>
            <div class="field"><span class="field-name">orderId</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">userId</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">amount</span><span class="field-type">BigDecimal</span></div>
            <div class="field"><span class="field-name">currency</span><span class="field-type">Currency</span></div>
            <div class="field"><span class="field-name">method</span><span class="field-type">PaymentMethod</span></div>
            <div class="field"><span class="field-name">gateway</span><span class="field-type">GatewayProvider</span></div>
            <div class="field"><span class="field-name">gatewayTxnId</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">status</span><span class="field-type">PaymentStatus</span></div>
            <div class="field"><span class="field-name">idempotencyKey</span><span class="field-type">String (UNIQUE)</span></div>
            <div class="field"><span class="field-name">createdAt</span><span class="field-type">LocalDateTime</span></div>
            <div class="field"><span class="field-name">updatedAt</span><span class="field-type">LocalDateTime</span></div>
        </div>
        <div class="entity-card">
            <h3>Wallet</h3>
            <div class="field"><span class="field-name">id</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">userId</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">balance</span><span class="field-type">BigDecimal</span></div>
            <div class="field"><span class="field-name">currency</span><span class="field-type">Currency</span></div>
            <div class="field"><span class="field-name">status</span><span class="field-type">WalletStatus</span></div>
            <div class="field"><span class="field-name">version</span><span class="field-type">Long (@Version)</span></div>
        </div>
        <div class="entity-card">
            <h3>Refund</h3>
            <div class="field"><span class="field-name">id</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">paymentId</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">amount</span><span class="field-type">BigDecimal</span></div>
            <div class="field"><span class="field-name">reason</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">type</span><span class="field-type">RefundType</span></div>
            <div class="field"><span class="field-name">status</span><span class="field-type">RefundStatus</span></div>
            <div class="field"><span class="field-name">gatewayRefundId</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">createdAt</span><span class="field-type">LocalDateTime</span></div>
        </div>
        <div class="entity-card">
            <h3>LedgerEntry</h3>
            <div class="field"><span class="field-name">id</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">paymentId</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">debitAccount</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">creditAccount</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">amount</span><span class="field-type">BigDecimal</span></div>
            <div class="field"><span class="field-name">type</span><span class="field-type">LedgerEntryType</span></div>
            <div class="field"><span class="field-name">createdAt</span><span class="field-type">LocalDateTime</span></div>
        </div>
        <div class="entity-card">
            <h3>WebhookEvent</h3>
            <div class="field"><span class="field-name">id</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">eventId</span><span class="field-type">String (gateway ID)</span></div>
            <div class="field"><span class="field-name">eventType</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">payload</span><span class="field-type">String (JSON)</span></div>
            <div class="field"><span class="field-name">processed</span><span class="field-type">boolean</span></div>
            <div class="field"><span class="field-name">createdAt</span><span class="field-type">LocalDateTime</span></div>
        </div>
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

<div class="section theme-green">
    <div class="section-title"><span class="section-num">4</span>Interfaces &amp; SOLID Principles</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span><span class="code-title">PaymentInterfaces.java — Strategy + OCP</span></div>
    <pre class="code-block">
<span class="cm">// Strategy — Different payment gateways implement same interface</span>
<span class="cm">// OCP — Add Paytm/PhonePe without modifying PaymentService</span>
<span class="cm">// DIP — PaymentService depends on IGateway abstraction</span>

<span class="kw">public interface</span> <span class="tp">IPaymentGateway</span> {
    <span class="tp">GatewayProvider</span> <span class="fn">getProvider</span>();
    <span class="tp">GatewayResponse</span> <span class="fn">initiatePayment</span>(<span class="tp">PaymentRequest</span> request);
    <span class="tp">GatewayResponse</span> <span class="fn">capturePayment</span>(<span class="tp">String</span> gatewayTxnId, <span class="tp">BigDecimal</span> amount);
    <span class="tp">GatewayResponse</span> <span class="fn">refund</span>(<span class="tp">String</span> gatewayTxnId, <span class="tp">BigDecimal</span> amount);
    <span class="kw">boolean</span> <span class="fn">verifyWebhookSignature</span>(<span class="tp">String</span> payload, <span class="tp">String</span> signature);
}

<span class="kw">public interface</span> <span class="tp">IPaymentService</span> {
    <span class="tp">Payment</span> <span class="fn">initiatePayment</span>(<span class="tp">PaymentRequest</span> req);
    <span class="tp">Payment</span> <span class="fn">getPayment</span>(<span class="tp">String</span> paymentId);
    <span class="tp">Refund</span> <span class="fn">refund</span>(<span class="tp">RefundRequest</span> req);
}

<span class="kw">public interface</span> <span class="tp">IWalletService</span> {
    <span class="tp">Wallet</span> <span class="fn">getBalance</span>(<span class="tp">Long</span> userId);
    <span class="tp">Wallet</span> <span class="fn">topUp</span>(<span class="tp">Long</span> userId, <span class="tp">BigDecimal</span> amount);
    <span class="tp">Wallet</span> <span class="fn">debit</span>(<span class="tp">Long</span> userId, <span class="tp">BigDecimal</span> amount);
}

<span class="kw">public interface</span> <span class="tp">ILedgerService</span> {
    <span class="kw">void</span> <span class="fn">recordEntry</span>(<span class="tp">LedgerEntry</span> entry);
    <span class="tp">List</span>&lt;<span class="tp">LedgerEntry</span>&gt; <span class="fn">getEntries</span>(<span class="tp">Long</span> paymentId);
    <span class="tp">BigDecimal</span> <span class="fn">reconcile</span>(<span class="tp">LocalDate</span> date);
}
    </pre></div>
</div>

<div class="section theme-blue">
    <div class="section-title"><span class="section-num">5</span>Class Design (JPA Entities)</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span><span class="code-title">Payment.java — JPA Entity with State Machine</span></div>
    <pre class="code-block">
<span class="ann">@Entity</span>
<span class="ann">@Table</span>(name = <span class="st">"payments"</span>, indexes = {
    <span class="ann">@Index</span>(name = <span class="st">"idx_payment_order"</span>, columnList = <span class="st">"order_id"</span>),
    <span class="ann">@Index</span>(name = <span class="st">"idx_payment_user"</span>, columnList = <span class="st">"user_id, created_at DESC"</span>),
    <span class="ann">@Index</span>(name = <span class="st">"idx_payment_idempotency"</span>, columnList = <span class="st">"idempotency_key"</span>, unique = <span class="kw">true</span>)
})
<span class="kw">public class</span> <span class="tp">Payment</span> {
    <span class="ann">@Id</span> <span class="ann">@GeneratedValue</span>(strategy = <span class="tp">GenerationType</span>.IDENTITY)
    <span class="kw">private</span> <span class="tp">Long</span> id;

    <span class="ann">@Column</span>(unique = <span class="kw">true</span>)
    <span class="kw">private</span> <span class="tp">String</span> paymentId; <span class="cm">// UUID</span>

    <span class="kw">private</span> <span class="tp">String</span> orderId;
    <span class="kw">private</span> <span class="tp">Long</span> userId;

    <span class="ann">@Column</span>(precision = <span class="cn">12</span>, scale = <span class="cn">2</span>)
    <span class="kw">private</span> <span class="tp">BigDecimal</span> amount;

    <span class="ann">@Enumerated</span>(<span class="tp">EnumType</span>.STRING)
    <span class="kw">private</span> <span class="tp">PaymentMethod</span> method;

    <span class="ann">@Enumerated</span>(<span class="tp">EnumType</span>.STRING)
    <span class="kw">private</span> <span class="tp">GatewayProvider</span> gateway;

    <span class="kw">private</span> <span class="tp">String</span> gatewayTxnId;

    <span class="ann">@Enumerated</span>(<span class="tp">EnumType</span>.STRING)
    <span class="kw">private</span> <span class="tp">PaymentStatus</span> status = <span class="tp">PaymentStatus</span>.INITIATED;

    <span class="ann">@Column</span>(unique = <span class="kw">true</span>)
    <span class="kw">private</span> <span class="tp">String</span> idempotencyKey;

    <span class="ann">@Version</span>
    <span class="kw">private</span> <span class="tp">Long</span> version; <span class="cm">// Optimistic locking</span>

    <span class="cm">// State Machine: INITIATED → PENDING → AUTHORIZED → CAPTURED</span>
    <span class="cm">//                                                   → FAILED</span>
    <span class="cm">//                                    CAPTURED → REFUNDED</span>
}
    </pre></div>
</div>

<div class="section theme-purple">
    <div class="section-title"><span class="section-num">6</span>Repository / DAO Layer</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span><span class="code-title">PaymentRepository.java</span></div>
    <pre class="code-block">
<span class="kw">public interface</span> <span class="tp">PaymentRepository</span> <span class="kw">extends</span> <span class="tp">JpaRepository</span>&lt;<span class="tp">Payment</span>, <span class="tp">Long</span>&gt; {
    <span class="tp">Optional</span>&lt;<span class="tp">Payment</span>&gt; <span class="fn">findByPaymentId</span>(<span class="tp">String</span> paymentId);
    <span class="tp">Optional</span>&lt;<span class="tp">Payment</span>&gt; <span class="fn">findByIdempotencyKey</span>(<span class="tp">String</span> key);
    <span class="tp">Optional</span>&lt;<span class="tp">Payment</span>&gt; <span class="fn">findByGatewayTxnId</span>(<span class="tp">String</span> txnId);
    <span class="tp">Page</span>&lt;<span class="tp">Payment</span>&gt; <span class="fn">findByUserIdOrderByCreatedAtDesc</span>(<span class="tp">Long</span> userId, <span class="tp">Pageable</span> p);

    <span class="ann">@Query</span>(<span class="st">"SELECT p FROM Payment p WHERE p.status = 'PENDING' AND p.createdAt &lt; :cutoff"</span>)
    <span class="tp">List</span>&lt;<span class="tp">Payment</span>&gt; <span class="fn">findStalePayments</span>(<span class="ann">@Param</span>(<span class="st">"cutoff"</span>) <span class="tp">LocalDateTime</span> cutoff);
}

<span class="kw">public interface</span> <span class="tp">WalletRepository</span> <span class="kw">extends</span> <span class="tp">JpaRepository</span>&lt;<span class="tp">Wallet</span>, <span class="tp">Long</span>&gt; {
    <span class="ann">@Lock</span>(<span class="tp">LockModeType</span>.PESSIMISTIC_WRITE)
    <span class="tp">Optional</span>&lt;<span class="tp">Wallet</span>&gt; <span class="fn">findByUserId</span>(<span class="tp">Long</span> userId);
}

<span class="kw">public interface</span> <span class="tp">LedgerEntryRepository</span> <span class="kw">extends</span> <span class="tp">JpaRepository</span>&lt;<span class="tp">LedgerEntry</span>, <span class="tp">Long</span>&gt; {
    <span class="tp">List</span>&lt;<span class="tp">LedgerEntry</span>&gt; <span class="fn">findByPaymentId</span>(<span class="tp">Long</span> paymentId);
    <span class="ann">@Query</span>(<span class="st">"SELECT SUM(l.amount) FROM LedgerEntry l WHERE l.type = :type AND l.createdAt BETWEEN :start AND :end"</span>)
    <span class="tp">BigDecimal</span> <span class="fn">sumByTypeAndDateRange</span>(<span class="ann">@Param</span>(<span class="st">"type"</span>) <span class="tp">LedgerEntryType</span> type,
        <span class="ann">@Param</span>(<span class="st">"start"</span>) <span class="tp">LocalDateTime</span> start, <span class="ann">@Param</span>(<span class="st">"end"</span>) <span class="tp">LocalDateTime</span> end);
}
    </pre></div>
</div>

<div class="section theme-green">
    <div class="section-title"><span class="section-num">7</span>Database Schema</div>
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

<div class="section theme-blue">
    <div class="section-title"><span class="section-num">8</span>API Endpoints</div>
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

<div class="section theme-purple">
    <div class="section-title"><span class="section-num">9</span>Service Layer</div>
    <div class="service-grid">
        <div class="service-card">
            <h3>PaymentService</h3>
            <p class="svc-desc">Starts a payment — checks for duplicate requests, checks for fraud, then calls the payment gateway</p>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Start a new payment</div><code>Payment initiatePayment(PaymentRequest request)</code></div>
        </div>
        <div class="service-card">
            <h3>GatewayRoutingService</h3>
            <p class="svc-desc">Picks the best payment gateway (Razorpay, Stripe, etc.) based on payment method and success rate</p>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Choose the best gateway for this payment</div><code>GatewayProvider selectGateway(PaymentMethod method, BigDecimal amount)</code></div>
        </div>
        <div class="service-card">
            <h3>RefundService</h3>
            <p class="svc-desc">Processes refunds — checks if refund is allowed, calls gateway, and updates records</p>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Refund money back to the user</div><code>Refund refund(String paymentId, BigDecimal amount)</code></div>
        </div>
        <div class="service-card">
            <h3>WalletService</h3>
            <p class="svc-desc">Manages user wallet — checks balance and deducts money safely (with database lock)</p>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Deduct money from user's wallet</div><code>void debit(Long userId, BigDecimal amount)</code></div>
        </div>
        <div class="service-card">
            <h3>LedgerService</h3>
            <p class="svc-desc">Keeps a record of every money movement — every payment creates both a debit and credit entry</p>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Record a money movement in the ledger</div><code>void recordEntry(LedgerEntry entry)</code></div>
        </div>
        <div class="service-card">
            <h3>WebhookService</h3>
            <p class="svc-desc">Receives payment status updates from gateways — verifies it's genuine, then updates our records</p>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Process a webhook from payment gateway</div><code>void processWebhook(String payload, String signature)</code></div>
        </div>
        <div class="service-card">
            <h3>ReconciliationService</h3>
            <p class="svc-desc">Daily check — compares our records with the payment gateway's records to find mismatches</p>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Run daily reconciliation for a date</div><code>ReconciliationReport reconcile(LocalDate date)</code></div>
        </div>
        <div class="service-card">
            <h3>FraudDetectionService</h3>
            <p class="svc-desc">Checks for suspicious payments — unusual amounts, too many attempts, unknown location</p>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Check if a payment looks suspicious</div><code>void checkFraud(PaymentRequest request)</code></div>
        </div>
    </div>
</div>

<div class="section theme-green">
    <div class="section-title"><span class="section-num">10</span>Key Architecture</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span><span class="code-title">PaymentService.java — Idempotency + State Machine</span></div>
    <pre class="code-block">
<span class="ann">@Service</span> <span class="ann">@Transactional</span>
<span class="kw">public class</span> <span class="tp">PaymentService</span> <span class="kw">implements</span> <span class="tp">IPaymentService</span> {
    <span class="kw">private final</span> <span class="tp">Map</span>&lt;<span class="tp">GatewayProvider</span>, <span class="tp">IPaymentGateway</span>&gt; gateways;
    <span class="kw">private final</span> <span class="tp">PaymentRepository</span> paymentRepo;
    <span class="kw">private final</span> <span class="tp">ILedgerService</span> ledger;
    <span class="kw">private final</span> <span class="tp">FraudDetectionService</span> fraud;

    <span class="kw">public</span> <span class="tp">Payment</span> <span class="fn">initiatePayment</span>(<span class="tp">PaymentRequest</span> req) {
        <span class="cm">// 1. Idempotency check — return existing if duplicate</span>
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
    <div class="section-title"><span class="section-num">11</span>Design Patterns Used</div>
    <div class="pattern-grid">
        <div class="pattern-card"><h3>Strategy</h3><p>IPaymentGateway implementations (Razorpay, Stripe) — swap gateways without modifying service</p></div>
        <div class="pattern-card"><h3>State Machine</h3><p>Payment status transitions: INITIATED→PENDING→AUTHORIZED→CAPTURED; invalid transitions throw</p></div>
        <div class="pattern-card"><h3>Observer</h3><p>Webhook events trigger async status updates; Kafka publishes PaymentStatusChanged events</p></div>
        <div class="pattern-card"><h3>Factory</h3><p>GatewayFactory creates appropriate IPaymentGateway based on provider config</p></div>
        <div class="pattern-card"><h3>Saga</h3><p>Distributed transaction: Payment → Inventory → Shipping; compensating actions on failure</p></div>
        <div class="pattern-card"><h3>Command</h3><p>PaymentCommand (initiate, capture, refund) — encapsulates action with undo capability</p></div>
    </div>
</div>

<div class="section theme-purple">
    <div class="section-title"><span class="section-num">12</span>Sequence Flow</div>
    <div class="flow-container">
        <div class="flow-step"><span class="step-num">1</span><span class="step-text">Client sends POST /api/v1/payments with Idempotency-Key header</span></div>
        <div class="flow-step"><span class="step-num">2</span><span class="step-text">PaymentService checks idempotency — returns existing if duplicate</span></div>
        <div class="flow-step"><span class="step-num">3</span><span class="step-text">FraudDetectionService runs velocity &amp; amount checks</span></div>
        <div class="flow-step"><span class="step-num">4</span><span class="step-text">GatewayRoutingService selects optimal gateway (Razorpay/Stripe)</span></div>
        <div class="flow-step"><span class="step-num">5</span><span class="step-text">IPaymentGateway.initiatePayment() → returns gateway redirect URL</span></div>
        <div class="flow-step"><span class="step-num">6</span><span class="step-text">User completes payment on gateway page (UPI/Card/NetBanking)</span></div>
        <div class="flow-step"><span class="step-num">7</span><span class="step-text">Gateway sends webhook → WebhookService verifies signature</span></div>
        <div class="flow-step"><span class="step-num">8</span><span class="step-text">PaymentService updates status (AUTHORIZED → CAPTURED)</span></div>
        <div class="flow-step"><span class="step-num">9</span><span class="step-text">LedgerService records double-entry (debit user, credit merchant)</span></div>
        <div class="flow-step"><span class="step-num">10</span><span class="step-text">Kafka publishes PaymentCaptured event for downstream (order, notification)</span></div>
    </div>
</div>

<div class="section theme-green">
    <div class="section-title"><span class="section-num">13</span>Capacity Estimation</div>
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

<div class="section theme-blue">
    <div class="section-title"><span class="section-num">14</span>Bottlenecks &amp; Solutions</div>
    <div class="bottleneck-grid">
        <div class="bottleneck-card"><h3>Double Payment (double click)</h3><p>Idempotency key (UUID) in UNIQUE index; return existing payment on duplicate</p></div>
        <div class="bottleneck-card"><h3>Gateway Timeout</h3><p>30s timeout with async webhook fallback; stale payment cleanup job marks PENDING→FAILED after 15min</p></div>
        <div class="bottleneck-card"><h3>Wallet Race Condition</h3><p>Pessimistic locking (SELECT FOR UPDATE) on wallet row; or @Version optimistic locking with retry</p></div>
        <div class="bottleneck-card"><h3>Webhook Ordering</h3><p>Store all webhooks; process idempotently; state machine rejects invalid transitions</p></div>
        <div class="bottleneck-card"><h3>Reconciliation Mismatch</h3><p>Daily batch job; separate mismatch queue for manual review; auto-resolve known patterns</p></div>
        <div class="bottleneck-card"><h3>Gateway Downtime</h3><p>Circuit breaker per gateway; automatic failover to secondary provider</p></div>
    </div>
</div>

<div class="section theme-purple">
    <div class="section-title"><span class="section-num">15</span>Edge Cases</div>
    <div class="edge-grid">
        <div class="edge-card"><h3>Partial Refund Exceeds Total</h3><p>Track totalRefunded per payment; validate: totalRefunded + newRefund ≤ originalAmount</p></div>
        <div class="edge-card"><h3>Webhook Before API Response</h3><p>Payment created first (INITIATED); webhook can arrive before API returns — both paths update atomically</p></div>
        <div class="edge-card"><h3>Currency Conversion</h3><p>Store in original currency; convert at settlement using locked exchange rate at capture time</p></div>
        <div class="edge-card"><h3>Insufficient Wallet Balance</h3><p>Check + debit in single transaction with row lock; return 402 Payment Required</p></div>
        <div class="edge-card"><h3>Duplicate Webhook</h3><p>eventId (gateway-provided) in UNIQUE index; skip if already processed</p></div>
        <div class="edge-card"><h3>Network Failure After Capture</h3><p>Idempotent capture: if already CAPTURED, return success. Gateway returns same result for same txnId</p></div>
    </div>
</div>

<div class="section theme-green">
    <div class="section-title"><span class="section-num">16</span>Security Considerations</div>
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
    <div class="section-title"><span class="section-num">17</span>Interview Cheat-Sheet</div>
    <div class="summary-grid">
        <div class="summary-card"><strong>Idempotency</strong><br>UUID key in UNIQUE index; return existing on duplicate; prevents double charge</div>
        <div class="summary-card"><strong>State Machine</strong><br>INITIATED→PENDING→AUTHORIZED→CAPTURED→REFUNDED; reject invalid transitions</div>
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
