export default {
  title: "E-commerce Checkout System &mdash; Low Level Design",
  subtitle: "Complete LLD for Java Spring Boot Interview &mdash; Cart, Pricing, Inventory &amp; Order Placement",
  subtitleColor: "#e0f7fa",
  headerGradient: "linear-gradient(135deg,#006064,#00838f,#18ffff)",
  footerText: "E-commerce Checkout System &mdash; Low Level Design",
  content: `
<div class="section theme-green">
    <div class="section-title"><span class="section-num">1</span>Functional Requirements</div>
    <div class="req-grid">
        <div class="req-pill"><span class="num">1</span><div class="fr-content"><div class="fr-en">Add / Remove / Update Cart Items</div><div class="fr-hi">Ye requirement isliye hai taki user apne pasand ke products cart me add/remove kar sake aur quantity update kar sake — bina cart ke user ek saath multiple items ka order nahi place kar payega, ye e-commerce ka starting point hai</div></div></div>
        <div class="req-pill"><span class="num">2</span><div class="fr-content"><div class="fr-en">Inventory Reservation (soft lock)</div><div class="fr-hi">Ye requirement isliye hai taki checkout pe inventory soft lock ho jaye — agar 2 users ek hi last item checkout kar rahe hain to pehle wale ko reserve mile aur dusre ko "out of stock" dikhe, bina iske overselling ho jayegi</div></div></div>
        <div class="req-pill"><span class="num">3</span><div class="fr-content"><div class="fr-en">Pricing Engine (discounts, coupons, tax)</div><div class="fr-hi">Ye requirement isliye hai taki user ko accurate final price dikhe — discounts, coupon deductions aur state-wise tax dynamically calculate hona chahiye, galat pricing se customer trust tootega aur legal issues bhi ho sakte hain</div></div></div>
        <div class="req-pill"><span class="num">4</span><div class="fr-content"><div class="fr-en">Address Management (shipping / billing)</div><div class="fr-hi">Ye requirement isliye hai taki user multiple shipping aur billing addresses save kar sake — office, ghar, relatives ke ghar alag alag deliver karwana common hai Amazon/Flipkart pe, har baar address type karna tedious hoga</div></div></div>
        <div class="req-pill"><span class="num">5</span><div class="fr-content"><div class="fr-en">Checkout Flow (cart &rarr; address &rarr; payment &rarr; confirm)</div><div class="fr-hi">Ye requirement isliye hai taki user step-by-step checkout kar sake — cart se address select karo, payment method choose karo aur confirm karo, ye structured flow confusion reduce karta hai aur cart abandonment kam hota hai</div></div></div>
        <div class="req-pill"><span class="num">6</span><div class="fr-content"><div class="fr-en">Order Placement &amp; Confirmation</div><div class="fr-hi">Ye requirement isliye hai taki payment success hone ke baad order create ho aur user ko turant confirmation mile email/notification se — bina confirmation ke user ko bharosa nahi hoga ki order sahi se place hua hai</div></div></div>
        <div class="req-pill"><span class="num">7</span><div class="fr-content"><div class="fr-en">Coupon / Promo Code Validation</div><div class="fr-hi">Ye requirement isliye hai taki coupon code apply karne se pehle validate ho — expired hai? min order amount meet hua? usage limit cross hua? bina validation ke fake ya expired coupons se revenue loss hoga</div></div></div>
        <div class="req-pill"><span class="num">8</span><div class="fr-content"><div class="fr-en">Stock Validation at Checkout</div><div class="fr-hi">Ye requirement isliye hai taki checkout ke time re-verify ho ki items abhi bhi stock me hain — user ne 2 ghante pehle cart me daala tha, tab se stock khatam ho sakta hai, bina check ke order fail hoga payment ke baad</div></div></div>
        <div class="req-pill"><span class="num">9</span><div class="fr-content"><div class="fr-en">Abandoned Cart Recovery</div><div class="fr-hi">Ye feature isliye hai taki agar user ne cart me items daalke checkout nahi kiya to usse reminder bheja ja sake — e-commerce me 70% carts abandon hote hain, recovery emails se 10-15% orders wapas aa sakte hain</div></div></div>
        <div class="req-pill"><span class="num">10</span><div class="fr-content"><div class="fr-en">Flash Sale / Limited Stock Handling</div><div class="fr-hi">Ye requirement isliye hai taki flash sale me limited stock correctly handle ho — hazaron users ek hi time pe buy click karenge, race condition se overselling hogi agar atomic operations (Redis DECR, optimistic locking) nahi use kiye</div></div></div>
        <div class="req-pill"><span class="num">11</span><div class="fr-content"><div class="fr-en">Guest Checkout Support</div><div class="fr-hi">Ye feature isliye hai taki user bina account banaye bhi checkout kar sake — bahut se users sirf ek baar kharidna chahte hain, forced login se cart abandonment badhta hai, guest checkout se conversion rate improve hota hai</div></div></div>
        <div class="req-pill"><span class="num">12</span><div class="fr-content"><div class="fr-en">Delivery Slot Selection</div><div class="fr-hi">Ye feature isliye hai taki user apna preferred delivery time slot choose kar sake — ghar pe koi nahi hai to evening slot select karo, ye customer convenience badhata hai aur failed delivery attempts kam hote hain</div></div></div>
    </div>
</div>

<!-- ============ NON-FUNCTIONAL REQUIREMENTS ============ -->
<div class="section theme-pink">
    <div class="section-title"><span class="section-num">2</span>Non-Functional Requirements</div>
    <div class="req-grid">
        <div class="req-pill"><span class="num">1</span><div class="nfr-content"><div class="nfr-en">Low Latency &mdash; Search &amp; checkout response under 500ms</div><div class="nfr-hi">Search aur checkout &lt; 500ms me hona chahiye taki user drop-off na ho</div></div></div>
        <div class="req-pill"><span class="num">2</span><div class="nfr-content"><div class="nfr-en">High Availability &mdash; 99.99% uptime, especially during sales</div><div class="nfr-hi">Sale time pe bhi 99.99% uptime hona chahiye &mdash; downtime = revenue loss</div></div></div>
        <div class="req-pill"><span class="num">3</span><div class="nfr-content"><div class="nfr-en">Scalability &mdash; Handle 10x traffic spike during flash sales</div><div class="nfr-hi">Flash sale pe 10x traffic spike aata hai &mdash; horizontally scale karke handle karo</div></div></div>
        <div class="req-pill"><span class="num">4</span><div class="nfr-content"><div class="nfr-en">Consistency &mdash; Inventory &amp; payment must have ACID guarantee</div><div class="nfr-hi">Inventory aur payment ka data ACID compliant hona chahiye &mdash; double booking nahi ho</div></div></div>
        <div class="req-pill"><span class="num">5</span><div class="nfr-content"><div class="nfr-en">Fault Tolerance &mdash; Graceful retry on payment failure</div><div class="nfr-hi">Payment fail hone pe graceful retry ho &mdash; user ko baar baar try nahi karna pade</div></div></div>
        <div class="req-pill"><span class="num">6</span><div class="nfr-content"><div class="nfr-en">Security &mdash; User data &amp; payment info must be encrypted</div><div class="nfr-hi">User data aur payment info encrypted rehni chahiye &mdash; at rest + in transit</div></div></div>
    </div>
</div>

<div class="section theme-purple">
    <div class="section-title"><span class="section-num">3</span>Enums</div>
    <div class="enum-grid">
        <div class="enum-card"><h3>CartStatus</h3><div class="enum-val">ACTIVE</div><div class="enum-val">CHECKED_OUT</div><div class="enum-val">ABANDONED</div><div class="enum-val">MERGED</div></div>
        <div class="enum-card"><h3>OrderStatus</h3><div class="enum-val">CREATED</div><div class="enum-val">PAYMENT_PENDING</div><div class="enum-val">CONFIRMED</div><div class="enum-val">PROCESSING</div><div class="enum-val">SHIPPED</div><div class="enum-val">DELIVERED</div><div class="enum-val">CANCELLED</div><div class="enum-val">RETURNED</div></div>
        <div class="enum-card"><h3>CouponType</h3><div class="enum-val">PERCENTAGE</div><div class="enum-val">FLAT_AMOUNT</div><div class="enum-val">FREE_SHIPPING</div><div class="enum-val">BUY_X_GET_Y</div></div>
        <div class="enum-card"><h3>InventoryAction</h3><div class="enum-val">RESERVE</div><div class="enum-val">CONFIRM</div><div class="enum-val">RELEASE</div><div class="enum-val">DEDUCT</div></div>
    </div>
</div>

<div class="section theme-green">
    <div class="section-title"><span class="section-num">4</span>Service LLD</div>
    <div class="service-grid">
        <div class="service-card">
            <h3>CartService</h3>
            <p class="svc-desc">Shopping cart manage karta hai &mdash; items add/remove, quantity update aur total recalculate karta hai</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">CartService</span> {

    <span class="cm">// cart mein naya item add karta hai, guest ya logged-in dono ke liye</span>
    <span class="tp">Cart</span> <span class="fn">addItem</span>(<span class="tp">Long</span> userId, <span class="tp">String</span> sessionId, <span class="tp">Long</span> productId, <span class="tp">int</span> quantity)

    <span class="cm">// item ki quantity update karta hai, 0 means remove</span>
    <span class="tp">Cart</span> <span class="fn">updateQuantity</span>(<span class="tp">Long</span> cartId, <span class="tp">Long</span> productId, <span class="tp">int</span> newQuantity)

    <span class="cm">// cart se specific item remove karta hai</span>
    <span class="tp">Cart</span> <span class="fn">removeItem</span>(<span class="tp">Long</span> cartId, <span class="tp">Long</span> productId)

    <span class="cm">// user ya guest ka cart fetch karta hai</span>
    <span class="tp">Cart</span> <span class="fn">getCart</span>(<span class="tp">Long</span> userId, <span class="tp">String</span> sessionId)

    <span class="cm">// cart pe coupon code apply karta hai</span>
    <span class="tp">Cart</span> <span class="fn">applyCoupon</span>(<span class="tp">Long</span> cartId, <span class="tp">String</span> couponCode)

    <span class="cm">// applied coupon hata deta hai cart se</span>
    <span class="tp">Cart</span> <span class="fn">removeCoupon</span>(<span class="tp">Long</span> cartId)

    <span class="cm">// login pe guest cart ko user cart mein merge karta hai</span>
    <span class="tp">Cart</span> <span class="fn">mergeGuestCart</span>(<span class="tp">Long</span> userId, <span class="tp">String</span> sessionId)
}
</pre></div>
        </div>

        <div class="service-card">
            <h3>InventoryService</h3>
            <p class="svc-desc">Stock manage karta hai &mdash; reserve on checkout, confirm on payment, release on cancel ya timeout (15 min)</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">InventoryService</span> {

    <span class="cm">// stock reserve karta hai checkout pe, nearest warehouse auto-pick</span>
    <span class="tp">boolean</span> <span class="fn">reserve</span>(<span class="tp">Long</span> productId, <span class="tp">Long</span> warehouseId, <span class="tp">int</span> quantity, <span class="tp">String</span> reservationId, <span class="tp">int</span> ttlMinutes)

    <span class="cm">// payment success ke baad stock permanently deduct karta hai</span>
    <span class="tp">void</span> <span class="fn">confirm</span>(<span class="tp">String</span> reservationId)

    <span class="cm">// cancel ya timeout pe reserved stock wapas release karta hai</span>
    <span class="tp">void</span> <span class="fn">release</span>(<span class="tp">String</span> reservationId, <span class="tp">Long</span> productId, <span class="tp">int</span> quantity)

    <span class="cm">// product ka available stock return karta hai</span>
    <span class="tp">int</span> <span class="fn">getAvailable</span>(<span class="tp">Long</span> productId)

    <span class="cm">// check karta hai ki itna stock available hai ya nahi</span>
    <span class="tp">boolean</span> <span class="fn">isAvailable</span>(<span class="tp">Long</span> productId, <span class="tp">int</span> quantity)
}
</pre></div>
        </div>

        <div class="service-card">
            <h3>PricingEngine</h3>
            <p class="svc-desc">Final price calculate karta hai &mdash; items ka subtotal, coupon discount apply, aur shipping state ke hisaab se tax lagata hai</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">PricingEngine</span> {

    <span class="cm">// cart ka full price breakdown calculate karta hai with coupon + tax</span>
    <span class="tp">PriceBreakdown</span> <span class="fn">calculate</span>(<span class="tp">Long</span> cartId, <span class="tp">List&lt;CartItem&gt;</span> items, <span class="tp">String</span> couponCode, <span class="tp">Long</span> shippingAddressId)

    <span class="cm">// validated coupon ka discount apply karta hai subtotal pe</span>
    <span class="tp">PriceBreakdown</span> <span class="fn">applyDiscount</span>(<span class="tp">PriceBreakdown</span> priceBreakdown, <span class="tp">CouponResult</span> coupon)

    <span class="cm">// shipping state ke hisaab se tax calculate karta hai</span>
    <span class="tp">BigDecimal</span> <span class="fn">calculateTax</span>(<span class="tp">BigDecimal</span> subtotal, <span class="tp">String</span> state, <span class="tp">String</span> productCategory)
}
</pre></div>
        </div>

        <div class="service-card">
            <h3>CouponService</h3>
            <p class="svc-desc">Coupon code validate karta hai &mdash; expiry check, min order amount, usage limit aur per-user usage track karta hai</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">CouponService</span> {

    <span class="cm">// coupon validate karta hai - expiry, min amount, per-user usage check</span>
    <span class="tp">CouponResult</span> <span class="fn">validate</span>(<span class="tp">String</span> couponCode, <span class="tp">Long</span> cartId, <span class="tp">Long</span> userId, <span class="tp">BigDecimal</span> cartTotal)

    <span class="cm">// coupon active hai ya expired/limit crossed, check karta hai</span>
    <span class="tp">boolean</span> <span class="fn">isActive</span>(<span class="tp">String</span> couponCode)

    <span class="cm">// order place hone pe coupon usage mark karta hai</span>
    <span class="tp">void</span> <span class="fn">markUsed</span>(<span class="tp">String</span> couponCode, <span class="tp">Long</span> userId, <span class="tp">String</span> orderId)
}
</pre></div>
        </div>

        <div class="service-card">
            <h3>CheckoutService</h3>
            <p class="svc-desc">Pura checkout flow handle karta hai &mdash; stock reserve, order create, payment initiate, aur failure pe rollback (Saga pattern)</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">CheckoutService</span> {

    <span class="cm">// pura checkout flow - stock reserve, order create, payment initiate</span>
    <span class="tp">Order</span> <span class="fn">checkout</span>(<span class="tp">Long</span> cartId, <span class="tp">Long</span> userId, <span class="tp">Long</span> shippingAddressId, <span class="tp">Long</span> billingAddressId, <span class="tp">PaymentMethod</span> paymentMethod, <span class="tp">Long</span> deliverySlotId, <span class="tp">String</span> idempotencyKey)

    <span class="cm">// checkout se pehle har item ka stock validate karta hai</span>
    <span class="tp">void</span> <span class="fn">validateStock</span>(<span class="tp">Long</span> cartId, <span class="tp">List&lt;CartItem&gt;</span> items)

    <span class="cm">// payment gateway se payment initiate karta hai, duplicate prevent with idempotency</span>
    <span class="tp">PaymentResult</span> <span class="fn">initiatePayment</span>(<span class="tp">String</span> orderId, <span class="tp">BigDecimal</span> amount, <span class="tp">PaymentMethod</span> paymentMethod, <span class="tp">String</span> idempotencyKey)
}
</pre></div>
        </div>

        <div class="service-card">
            <h3>OrderService</h3>
            <p class="svc-desc">Order create karta hai cart se aur lifecycle manage karta hai &mdash; placed, shipped, delivered, cancelled, returned</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">OrderService</span> {

    <span class="cm">// cart se naya order create karta hai with price breakdown</span>
    <span class="tp">Order</span> <span class="fn">createOrder</span>(<span class="tp">Long</span> cartId, <span class="tp">Long</span> userId, <span class="tp">Long</span> shippingAddressId, <span class="tp">PriceBreakdown</span> priceBreakdown, <span class="tp">Long</span> deliverySlotId)

    <span class="cm">// order details fetch karta hai UUID se</span>
    <span class="tp">Order</span> <span class="fn">getOrder</span>(<span class="tp">String</span> orderId)

    <span class="cm">// order cancel karta hai aur inventory release trigger karta hai</span>
    <span class="tp">void</span> <span class="fn">cancelOrder</span>(<span class="tp">String</span> orderId, <span class="tp">Long</span> userId, <span class="tp">String</span> reason)

    <span class="cm">// order status update karta hai - PROCESSING, SHIPPED, DELIVERED etc</span>
    <span class="tp">void</span> <span class="fn">updateStatus</span>(<span class="tp">String</span> orderId, <span class="tp">OrderStatus</span> newStatus, <span class="tp">String</span> updatedBy)
}
</pre></div>
        </div>

        <div class="service-card">
            <h3>AbandonedCartService</h3>
            <p class="svc-desc">24+ ghante se inactive carts detect karta hai, reminder email bhejta hai aur expired reservations ka stock release karta hai</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">AbandonedCartService</span> {

    <span class="cm">// scheduled job - 24h se inactive carts detect aur process karta hai</span>
    <span class="tp">void</span> <span class="fn">processAbandoned</span>()

    <span class="cm">// abandoned cart ke user ko reminder email bhejta hai</span>
    <span class="tp">void</span> <span class="fn">sendReminder</span>(<span class="tp">Long</span> userId, <span class="tp">Long</span> cartId, <span class="tp">String</span> email, <span class="tp">List&lt;CartItem&gt;</span> cartItems)

    <span class="cm">// 15 min se zyada purani expired reservations release karta hai</span>
    <span class="tp">void</span> <span class="fn">releaseExpiredReservations</span>()
}
</pre></div>
        </div>
    </div>
</div>

<div class="section theme-purple">
    <div class="section-title"><span class="section-num">5</span>API Endpoints</div>
    <div class="api-grid">
        <div class="api-card"><div class="api-method get">GET</div><div class="api-path">/api/v1/cart</div><div class="api-desc">Get current user's cart with price breakdown</div></div>
        <div class="api-card"><div class="api-method post">POST</div><div class="api-path">/api/v1/cart/items</div><div class="api-desc">Add item to cart (validates stock)</div></div>
        <div class="api-card"><div class="api-method put">PUT</div><div class="api-path">/api/v1/cart/items/{productId}</div><div class="api-desc">Update item quantity</div></div>
        <div class="api-card"><div class="api-method delete">DELETE</div><div class="api-path">/api/v1/cart/items/{productId}</div><div class="api-desc">Remove item from cart</div></div>
        <div class="api-card"><div class="api-method post">POST</div><div class="api-path">/api/v1/cart/coupon</div><div class="api-desc">Apply coupon code</div></div>
        <div class="api-card"><div class="api-method delete">DELETE</div><div class="api-path">/api/v1/cart/coupon</div><div class="api-desc">Remove applied coupon</div></div>
        <div class="api-card"><div class="api-method post">POST</div><div class="api-path">/api/v1/checkout</div><div class="api-desc">Place order (reserve stock &rarr; create order &rarr; initiate payment)</div></div>
        <div class="api-card"><div class="api-method get">GET</div><div class="api-path">/api/v1/orders/{orderId}</div><div class="api-desc">Get order details &amp; status</div></div>
        <div class="api-card"><div class="api-method put">PUT</div><div class="api-path">/api/v1/orders/{orderId}/cancel</div><div class="api-desc">Cancel order (releases inventory)</div></div>
        <div class="api-card"><div class="api-method get">GET</div><div class="api-path">/api/v1/inventory/{productId}</div><div class="api-desc">Check available stock</div></div>
    </div>
</div>

<div class="section theme-blue">
    <div class="section-title"><span class="section-num">6</span>Database Schema</div>

    <div class="sub-heading" style="color:#25d366;border-color:#25d366">Database Technology Stack</div>
    <div class="dbtech-grid">
        <div class="dbtech-card">
            <div class="dbtech-name">PostgreSQL <span class="dbtech-type">RDBMS</span></div>
            <div class="dbtech-usage">Products, orders, inventory, coupons &mdash; ACID for inventory locking &amp; order creation</div>
            <div class="dbtech-tables"><span>products</span><span>orders</span><span>inventory</span><span>coupons</span></div>
        </div>
        <div class="dbtech-card">
            <div class="dbtech-name">Redis <span class="dbtech-type">In-Memory</span></div>
            <div class="dbtech-usage">Shopping cart (TTL-based), stock cache, session store, coupon usage dedup</div>
            <div class="dbtech-tables"><span>cart:{userId}</span><span>stock:{productId}</span></div>
        </div>
        <div class="dbtech-card">
            <div class="dbtech-name">Elasticsearch <span class="dbtech-type">Search Engine</span></div>
            <div class="dbtech-usage">Product search with filters, faceted navigation, auto-suggest</div>
            <div class="dbtech-tables"><span>products</span></div>
        </div>
        <div class="dbtech-card">
            <div class="dbtech-name">Kafka <span class="dbtech-type">Message Queue</span></div>
            <div class="dbtech-usage">Async order pipeline &mdash; inventory-reserved &rarr; payment &rarr; order-confirmed</div>
            <div class="dbtech-tables"><span>order-events</span><span>stock-updates</span></div>
        </div>
    </div>

    <div class="db-grid">
        <div class="db-card">
            <h3>carts</h3>
            <div class="db-row"><span class="col-name">id</span><span class="col-type">BIGINT</span><span class="col-constraint">PK</span></div>
            <div class="db-row"><span class="col-name">user_id</span><span class="col-type">BIGINT</span><span class="col-constraint">FK IDX (nullable)</span></div>
            <div class="db-row"><span class="col-name">session_id</span><span class="col-type">VARCHAR(64)</span><span class="col-constraint">IDX</span></div>
            <div class="db-row"><span class="col-name">coupon_code</span><span class="col-type">VARCHAR(32)</span><span class="col-constraint"></span></div>
            <div class="db-row"><span class="col-name">subtotal</span><span class="col-type">DECIMAL(12,2)</span><span class="col-constraint"></span></div>
            <div class="db-row"><span class="col-name">discount</span><span class="col-type">DECIMAL(12,2)</span><span class="col-constraint">DEFAULT 0</span></div>
            <div class="db-row"><span class="col-name">tax</span><span class="col-type">DECIMAL(12,2)</span><span class="col-constraint">DEFAULT 0</span></div>
            <div class="db-row"><span class="col-name">total</span><span class="col-type">DECIMAL(12,2)</span><span class="col-constraint"></span></div>
            <div class="db-row"><span class="col-name">status</span><span class="col-type">ENUM</span><span class="col-constraint">DEFAULT 'ACTIVE'</span></div>
            <div class="db-row"><span class="col-name">updated_at</span><span class="col-type">TIMESTAMP</span><span class="col-constraint">IDX</span></div>
        </div>
        <div class="db-card">
            <h3>cart_items</h3>
            <div class="db-row"><span class="col-name">id</span><span class="col-type">BIGINT</span><span class="col-constraint">PK</span></div>
            <div class="db-row"><span class="col-name">cart_id</span><span class="col-type">BIGINT</span><span class="col-constraint">FK IDX</span></div>
            <div class="db-row"><span class="col-name">product_id</span><span class="col-type">BIGINT</span><span class="col-constraint">FK</span></div>
            <div class="db-row"><span class="col-name">quantity</span><span class="col-type">INT</span><span class="col-constraint">NOT NULL</span></div>
            <div class="db-row"><span class="col-name">unit_price</span><span class="col-type">DECIMAL(12,2)</span><span class="col-constraint"></span></div>
        </div>
        <div class="db-card">
            <h3>inventory</h3>
            <div class="db-row"><span class="col-name">id</span><span class="col-type">BIGINT</span><span class="col-constraint">PK</span></div>
            <div class="db-row"><span class="col-name">product_id</span><span class="col-type">BIGINT</span><span class="col-constraint">FK UNIQUE(product,warehouse)</span></div>
            <div class="db-row"><span class="col-name">warehouse_id</span><span class="col-type">BIGINT</span><span class="col-constraint">FK</span></div>
            <div class="db-row"><span class="col-name">total_stock</span><span class="col-type">INT</span><span class="col-constraint">NOT NULL</span></div>
            <div class="db-row"><span class="col-name">reserved</span><span class="col-type">INT</span><span class="col-constraint">DEFAULT 0</span></div>
            <div class="db-row"><span class="col-name">version</span><span class="col-type">BIGINT</span><span class="col-constraint">OCC</span></div>
        </div>
        <div class="db-card">
            <h3>coupons</h3>
            <div class="db-row"><span class="col-name">id</span><span class="col-type">BIGINT</span><span class="col-constraint">PK</span></div>
            <div class="db-row"><span class="col-name">code</span><span class="col-type">VARCHAR(32)</span><span class="col-constraint">UNIQUE</span></div>
            <div class="db-row"><span class="col-name">type</span><span class="col-type">ENUM</span><span class="col-constraint">NOT NULL</span></div>
            <div class="db-row"><span class="col-name">value</span><span class="col-type">DECIMAL(12,2)</span><span class="col-constraint"></span></div>
            <div class="db-row"><span class="col-name">min_order_amount</span><span class="col-type">DECIMAL(12,2)</span><span class="col-constraint"></span></div>
            <div class="db-row"><span class="col-name">max_discount</span><span class="col-type">DECIMAL(12,2)</span><span class="col-constraint"></span></div>
            <div class="db-row"><span class="col-name">usage_limit</span><span class="col-type">INT</span><span class="col-constraint"></span></div>
            <div class="db-row"><span class="col-name">used_count</span><span class="col-type">INT</span><span class="col-constraint">DEFAULT 0</span></div>
            <div class="db-row"><span class="col-name">valid_from</span><span class="col-type">TIMESTAMP</span><span class="col-constraint"></span></div>
            <div class="db-row"><span class="col-name">valid_to</span><span class="col-type">TIMESTAMP</span><span class="col-constraint">IDX</span></div>
        </div>
        <div class="db-card">
            <h3>orders</h3>
            <div class="db-row"><span class="col-name">id</span><span class="col-type">BIGINT</span><span class="col-constraint">PK</span></div>
            <div class="db-row"><span class="col-name">order_id</span><span class="col-type">VARCHAR(36)</span><span class="col-constraint">UNIQUE IDX</span></div>
            <div class="db-row"><span class="col-name">user_id</span><span class="col-type">BIGINT</span><span class="col-constraint">FK IDX</span></div>
            <div class="db-row"><span class="col-name">shipping_address_id</span><span class="col-type">BIGINT</span><span class="col-constraint">FK</span></div>
            <div class="db-row"><span class="col-name">subtotal</span><span class="col-type">DECIMAL(12,2)</span><span class="col-constraint"></span></div>
            <div class="db-row"><span class="col-name">discount</span><span class="col-type">DECIMAL(12,2)</span><span class="col-constraint"></span></div>
            <div class="db-row"><span class="col-name">tax</span><span class="col-type">DECIMAL(12,2)</span><span class="col-constraint"></span></div>
            <div class="db-row"><span class="col-name">total</span><span class="col-type">DECIMAL(12,2)</span><span class="col-constraint"></span></div>
            <div class="db-row"><span class="col-name">status</span><span class="col-type">ENUM</span><span class="col-constraint">IDX</span></div>
            <div class="db-row"><span class="col-name">payment_id</span><span class="col-type">VARCHAR(64)</span><span class="col-constraint">IDX</span></div>
            <div class="db-row"><span class="col-name">created_at</span><span class="col-type">TIMESTAMP</span><span class="col-constraint">IDX</span></div>
        </div>
    </div>
</div>

<div class="section theme-blue">
    <div class="section-title"><span class="section-num">7</span>Capacity Estimation</div>
    <div class="cap-grid">
        <div class="cap-card"><div class="cap-label">Daily Active Users</div><div class="cap-value">10M</div></div>
        <div class="cap-card"><div class="cap-label">Carts Created / Day</div><div class="cap-value">5M</div></div>
        <div class="cap-card"><div class="cap-label">Checkout Rate</div><div class="cap-value">~20% (1M orders/day)</div></div>
        <div class="cap-card"><div class="cap-label">Peak Orders / sec</div><div class="cap-value">~50 orders/sec (flash sale: 500/sec)</div></div>
        <div class="cap-card"><div class="cap-label">Inventory Checks / sec</div><div class="cap-value">~5,000 QPS</div></div>
        <div class="cap-card"><div class="cap-label">Cart Abandonment Rate</div><div class="cap-value">~70%</div></div>
        <div class="cap-card"><div class="cap-label">Avg Cart Size</div><div class="cap-value">3.5 items</div></div>
        <div class="cap-card"><div class="cap-label">Reservation TTL</div><div class="cap-value">15 minutes</div></div>
        <div class="cap-card">
            <h4 style="color:#82b1ff;margin-bottom:8px">CPU / Server Estimation</h4>
            <div class="calc-row"><span class="calc-label">Inventory check QPS</span><span class="calc-value">~5,000 QPS</span></div>
            <div class="calc-row"><span class="calc-label">Peak checkout (flash sale)</span><span class="calc-value">~500 orders/sec</span></div>
            <div class="calc-row"><span class="calc-label">Each server handles</span><span class="calc-value">~2K QPS</span></div>
            <div class="calc-result"><span class="calc-label">App Servers Needed</span><span class="calc-value">~5 servers</span></div>
            <div class="calc-result"><span class="calc-label">Total CPU Cores (4 per server)</span><span class="calc-value">~20 cores</span></div>
            <div class="calc-row"><span class="calc-label">Redis (cart + inventory lock)</span><span class="calc-value">3 nodes</span></div>
            <div class="calc-row"><span class="calc-label">DB (orders, with replicas)</span><span class="calc-value">3 nodes</span></div>
        </div>
    </div>
</div>

<div class="section theme-blue">
    <div class="section-title"><span class="section-num">8</span>Key Architecture</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span><span class="code-title">CheckoutService.java &mdash; Checkout Flow</span></div>
    <pre class="code-block">
<span class="ann">@Service</span> <span class="ann">@Transactional</span>
<span class="kw">public class</span> <span class="tp">CheckoutService</span> <span class="kw">implements</span> <span class="tp">ICheckoutService</span> {

    <span class="kw">public</span> <span class="tp">Order</span> <span class="fn">checkout</span>(<span class="tp">CheckoutRequest</span> req) {
        <span class="tp">Cart</span> cart = cartService.<span class="fn">getCart</span>(req.getCartId());

        <span class="cm">// 1. Validate stock for all items</span>
        <span class="kw">for</span> (<span class="tp">CartItem</span> item : cart.getItems()) {
            <span class="kw">if</span> (!inventoryService.<span class="fn">reserve</span>(item.getProductId(),
                    item.getQuantity(), cart.getId().toString()))
                <span class="kw">throw new</span> <span class="tp">InsufficientStockException</span>(item.getProductId());
        }

        <span class="cm">// 2. Calculate final price (coupon + tax)</span>
        <span class="tp">PriceBreakdown</span> price = pricingEngine.<span class="fn">calculate</span>(cart);

        <span class="cm">// 3. Create order</span>
        <span class="tp">Order</span> order = orderService.<span class="fn">createOrder</span>(cart, req.getAddressId(), price);

        <span class="cm">// 4. Initiate payment</span>
        <span class="tp">Payment</span> payment = paymentService.<span class="fn">initiatePayment</span>(
            <span class="tp">PaymentRequest</span>.<span class="fn">builder</span>()
                .<span class="fn">orderId</span>(order.getOrderId())
                .<span class="fn">amount</span>(price.getTotal())
                .<span class="fn">method</span>(req.getPaymentMethod())
                .<span class="fn">idempotencyKey</span>(order.getOrderId())
                .<span class="fn">build</span>());

        order.<span class="fn">setPaymentId</span>(payment.getPaymentId());
        order.<span class="fn">setStatus</span>(<span class="tp">OrderStatus</span>.PAYMENT_PENDING);

        <span class="cm">// 5. Mark cart as checked out</span>
        cart.<span class="fn">setStatus</span>(<span class="tp">CartStatus</span>.CHECKED_OUT);

        <span class="cm">// 6. On payment failure &rarr; release inventory (compensating action)</span>
        <span class="cm">// Handled by PaymentFailedEventListener</span>

        <span class="kw">return</span> order;
    }
}
    </pre></div>
</div>

<div class="section theme-purple">
    <div class="section-title"><span class="section-num">9</span>Design Patterns Used</div>
    <div class="pattern-grid">
        <div class="pattern-card"><h3>Strategy</h3><p>IPricingStrategy for discount types (percentage, flat, BOGO) &mdash; add new promotions without code changes</p></div>
        <div class="pattern-card"><h3>Builder</h3><p>Order.builder() constructs complex order from cart items, address, pricing, payment info</p></div>
        <div class="pattern-card"><h3>Observer</h3><p>OrderCreated / PaymentFailed events trigger inventory confirm/release, email notifications</p></div>
        <div class="pattern-card"><h3>State Machine</h3><p>OrderStatus transitions: CREATED&rarr;PAYMENT_PENDING&rarr;CONFIRMED&rarr;SHIPPED&rarr;DELIVERED</p></div>
        <div class="pattern-card"><h3>Chain of Responsibility</h3><p>Checkout validation pipeline: StockValidator &rarr; PriceValidator &rarr; AddressValidator &rarr; FraudValidator</p></div>
        <div class="pattern-card"><h3>Template Method</h3><p>AbstractCheckoutStep defines step flow (validate &rarr; execute &rarr; rollback), subclasses implement specifics</p></div>
    </div>
</div>

<div class="section theme-green">
    <div class="section-title"><span class="section-num">10</span>Sequence Flow</div>
    <div class="flow-container">
        <div class="flow-step"><span class="step-num">1</span><span class="step-text">User adds items to cart &rarr; CartService validates stock availability</span></div>
        <div class="flow-step"><span class="step-num">2</span><span class="step-text">User applies coupon &rarr; CouponService validates &amp; calculates discount</span></div>
        <div class="flow-step"><span class="step-num">3</span><span class="step-text">User selects shipping address &rarr; PricingEngine calculates tax by state</span></div>
        <div class="flow-step"><span class="step-num">4</span><span class="step-text">User clicks "Place Order" &rarr; POST /api/v1/checkout</span></div>
        <div class="flow-step"><span class="step-num">5</span><span class="step-text">InventoryService reserves stock for all items (optimistic lock)</span></div>
        <div class="flow-step"><span class="step-num">6</span><span class="step-text">OrderService creates Order record (status = PAYMENT_PENDING)</span></div>
        <div class="flow-step"><span class="step-num">7</span><span class="step-text">PaymentService initiates payment with gateway</span></div>
        <div class="flow-step"><span class="step-num">8</span><span class="step-text">On payment success &rarr; confirm inventory, update order to CONFIRMED</span></div>
        <div class="flow-step"><span class="step-num">9</span><span class="step-text">On payment failure &rarr; release inventory, mark order CANCELLED</span></div>
        <div class="flow-step"><span class="step-num">10</span><span class="step-text">Send order confirmation email &amp; push notification</span></div>
    </div>
</div>

<div class="section theme-purple">
    <div class="section-title"><span class="section-num">11</span>Bottlenecks &amp; Solutions</div>
    <div class="bottleneck-grid">
        <div class="bottleneck-card"><h3>Flash Sale Overselling</h3><p>Optimistic locking with @Version; Redis atomic DECR for hot products; queue-based ordering for extreme cases</p></div>
        <div class="bottleneck-card"><h3>Inventory Hot Row</h3><p>Shard inventory by warehouse; Redis cache for read-heavy stock checks; DB only for writes</p></div>
        <div class="bottleneck-card"><h3>Cart Bloat</h3><p>Set max 50 items per cart; lazy price recalculation; TTL on inactive carts</p></div>
        <div class="bottleneck-card"><h3>Coupon Race Condition</h3><p>Atomic usedCount increment with WHERE usedCount &lt; usageLimit; per-user usage tracking</p></div>
        <div class="bottleneck-card"><h3>Checkout Latency</h3><p>Parallelize: stock check + address validation + pricing; async payment initiation</p></div>
        <div class="bottleneck-card"><h3>Abandoned Reservations</h3><p>Scheduled job releases expired reservations (TTL 15min); Redis TTL for real-time tracking</p></div>
    </div>
</div>

<div class="section theme-green">
    <div class="section-title"><span class="section-num">12</span>Edge Cases</div>
    <div class="edge-grid">
        <div class="edge-card"><h3>Price Changed During Checkout</h3><p>Lock price at cart add time; re-validate at checkout; show user if price changed</p></div>
        <div class="edge-card"><h3>Item Out of Stock at Checkout</h3><p>Re-validate all items before reserving; partial checkout option or remove unavailable items</p></div>
        <div class="edge-card"><h3>Coupon Expired Mid-Checkout</h3><p>Re-validate coupon at order creation; recalculate total; notify user if coupon invalid</p></div>
        <div class="edge-card"><h3>Concurrent Cart Modification</h3><p>Optimistic locking on cart; last-write-wins for quantity updates; conflict resolution</p></div>
        <div class="edge-card"><h3>Guest to Logged-in Cart Merge</h3><p>On login: merge guest cart items into user cart; handle duplicate products by summing qty</p></div>
        <div class="edge-card"><h3>Payment Timeout</h3><p>15-min reservation window; if payment not completed &rarr; release stock &rarr; cancel order</p></div>
    </div>
</div>

<div class="section theme-blue">
    <div class="section-title"><span class="section-num">13</span>Security Considerations</div>
    <div class="security-grid">
        <div class="security-card"><h3>Price Manipulation</h3><p>Server-side price calculation; never trust client-sent prices; validate at every step</p></div>
        <div class="security-card"><h3>Coupon Abuse</h3><p>Per-user usage limits; device fingerprinting; velocity checks on coupon redemption</p></div>
        <div class="security-card"><h3>Cart Tampering</h3><p>JWT authentication; server-side cart storage; validate cart ownership on every request</p></div>
        <div class="security-card"><h3>Stock Manipulation</h3><p>Rate limit add-to-cart API; CAPTCHA for suspicious patterns; bot detection</p></div>
        <div class="security-card"><h3>CSRF Protection</h3><p>CSRF tokens on checkout form; SameSite cookie attributes; verify origin header</p></div>
    </div>
</div>

<div class="section theme-deepblue">
    <div class="section-title"><span class="section-num">14</span>UML Class Diagram</div>
    <div class="uml-diagram">
        <div class="uml-section-label">Entity Classes</div>
        <div class="uml-grid">
            <div class="uml-class">
                <div class="uml-class-name">User</div>
                <div class="uml-stereotype">&laquo;entity&raquo;</div>
                <div class="uml-attributes">
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">id</span><span class="uml-type">: Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">email</span><span class="uml-type">: String</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">name</span><span class="uml-type">: String</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">createdAt</span><span class="uml-type">: Timestamp</span></div>
                </div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getCart()</span><span class="uml-type">: Cart</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getOrders()</span><span class="uml-type">: List&lt;Order&gt;</span></div>
                </div>
            </div>
            <div class="uml-class">
                <div class="uml-class-name">Cart</div>
                <div class="uml-stereotype">&laquo;entity&raquo;</div>
                <div class="uml-attributes">
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">id</span><span class="uml-type">: Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">userId</span><span class="uml-type">: Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">status</span><span class="uml-type">: CartStatus</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">totalAmount</span><span class="uml-type">: BigDecimal</span></div>
                </div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">addItem(productId, qty)</span><span class="uml-type">: CartItem</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">removeItem(productId)</span><span class="uml-type">: void</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">applyCoupon(code)</span><span class="uml-type">: void</span></div>
                </div>
            </div>
            <div class="uml-class">
                <div class="uml-class-name">CartItem</div>
                <div class="uml-stereotype">&laquo;entity&raquo;</div>
                <div class="uml-attributes">
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">id</span><span class="uml-type">: Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">cartId</span><span class="uml-type">: Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">productId</span><span class="uml-type">: Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">quantity</span><span class="uml-type">: int</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">price</span><span class="uml-type">: BigDecimal</span></div>
                </div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">updateQuantity(qty)</span><span class="uml-type">: void</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getSubtotal()</span><span class="uml-type">: BigDecimal</span></div>
                </div>
            </div>
            <div class="uml-class">
                <div class="uml-class-name">Product</div>
                <div class="uml-stereotype">&laquo;entity&raquo;</div>
                <div class="uml-attributes">
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">id</span><span class="uml-type">: Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">name</span><span class="uml-type">: String</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">price</span><span class="uml-type">: BigDecimal</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">stockCount</span><span class="uml-type">: int</span></div>
                </div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">isAvailable(qty)</span><span class="uml-type">: boolean</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">reserveStock(qty)</span><span class="uml-type">: boolean</span></div>
                </div>
            </div>
            <div class="uml-class">
                <div class="uml-class-name">Order</div>
                <div class="uml-stereotype">&laquo;entity&raquo;</div>
                <div class="uml-attributes">
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">id</span><span class="uml-type">: Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">userId</span><span class="uml-type">: Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">cartId</span><span class="uml-type">: Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">status</span><span class="uml-type">: OrderStatus</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">totalAmount</span><span class="uml-type">: BigDecimal</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">paymentId</span><span class="uml-type">: String</span></div>
                </div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">cancel(reason)</span><span class="uml-type">: void</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">updateStatus(status)</span><span class="uml-type">: void</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getTrackingInfo()</span><span class="uml-type">: TrackingInfo</span></div>
                </div>
            </div>
            <div class="uml-class">
                <div class="uml-class-name">Coupon</div>
                <div class="uml-stereotype">&laquo;entity&raquo;</div>
                <div class="uml-attributes">
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">id</span><span class="uml-type">: Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">code</span><span class="uml-type">: String</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">type</span><span class="uml-type">: CouponType</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">discountValue</span><span class="uml-type">: BigDecimal</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">minOrderValue</span><span class="uml-type">: BigDecimal</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">expiresAt</span><span class="uml-type">: Timestamp</span></div>
                </div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">isValid(orderTotal)</span><span class="uml-type">: boolean</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">calculateDiscount(total)</span><span class="uml-type">: BigDecimal</span></div>
                </div>
            </div>
            <div class="uml-class">
                <div class="uml-class-name">InventoryLock</div>
                <div class="uml-stereotype">&laquo;entity&raquo;</div>
                <div class="uml-attributes">
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">id</span><span class="uml-type">: Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">productId</span><span class="uml-type">: Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">orderId</span><span class="uml-type">: Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">quantity</span><span class="uml-type">: int</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">expiresAt</span><span class="uml-type">: Timestamp</span></div>
                </div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">isExpired()</span><span class="uml-type">: boolean</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">release()</span><span class="uml-type">: void</span></div>
                </div>
            </div>
        </div>

        <div class="uml-section-label">Enums</div>
        <div class="uml-grid">
            <div class="uml-class">
                <div class="uml-class-name">CartStatus</div>
                <div class="uml-stereotype">&laquo;enum&raquo;</div>
                <div class="uml-attributes">
                    <div class="uml-attr"><span class="uml-name">ACTIVE, CHECKED_OUT, ABANDONED, MERGED</span></div>
                </div>
            </div>
            <div class="uml-class">
                <div class="uml-class-name">OrderStatus</div>
                <div class="uml-stereotype">&laquo;enum&raquo;</div>
                <div class="uml-attributes">
                    <div class="uml-attr"><span class="uml-name">CREATED, PAYMENT_PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED, RETURNED</span></div>
                </div>
            </div>
            <div class="uml-class">
                <div class="uml-class-name">CouponType</div>
                <div class="uml-stereotype">&laquo;enum&raquo;</div>
                <div class="uml-attributes">
                    <div class="uml-attr"><span class="uml-name">PERCENTAGE, FLAT_AMOUNT, FREE_SHIPPING, BUY_X_GET_Y</span></div>
                </div>
            </div>
            <div class="uml-class">
                <div class="uml-class-name">InventoryAction</div>
                <div class="uml-stereotype">&laquo;enum&raquo;</div>
                <div class="uml-attributes">
                    <div class="uml-attr"><span class="uml-name">RESERVE, CONFIRM, RELEASE, DEDUCT</span></div>
                </div>
            </div>
        </div>

        <div class="uml-section-label">Service Classes</div>
        <div class="uml-grid">
            <div class="uml-class">
                <div class="uml-class-name">CartService</div>
                <div class="uml-stereotype">&laquo;service&raquo;</div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">addItem(userId, productId, qty)</span><span class="uml-type">: Cart</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">removeItem(cartId, productId)</span><span class="uml-type">: Cart</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">applyCoupon(cartId, code)</span><span class="uml-type">: Cart</span></div>
                </div>
            </div>
            <div class="uml-class">
                <div class="uml-class-name">InventoryService</div>
                <div class="uml-stereotype">&laquo;service&raquo;</div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">reserve(productId, qty)</span><span class="uml-type">: boolean</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">confirm(reservationId)</span><span class="uml-type">: void</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">release(reservationId)</span><span class="uml-type">: void</span></div>
                </div>
            </div>
            <div class="uml-class">
                <div class="uml-class-name">PricingEngine</div>
                <div class="uml-stereotype">&laquo;service&raquo;</div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">calculate(cartId, items)</span><span class="uml-type">: PriceBreakdown</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">applyDiscount(price, coupon)</span><span class="uml-type">: PriceBreakdown</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">calculateTax(subtotal, state)</span><span class="uml-type">: BigDecimal</span></div>
                </div>
            </div>
            <div class="uml-class">
                <div class="uml-class-name">CouponService</div>
                <div class="uml-stereotype">&laquo;service&raquo;</div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">validate(code, cartId, userId)</span><span class="uml-type">: CouponResult</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">isActive(code)</span><span class="uml-type">: boolean</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">markUsed(code, userId)</span><span class="uml-type">: void</span></div>
                </div>
            </div>
            <div class="uml-class">
                <div class="uml-class-name">CheckoutService</div>
                <div class="uml-stereotype">&laquo;service&raquo;</div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">checkout(cartId, userId)</span><span class="uml-type">: Order</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">validateStock(cartId)</span><span class="uml-type">: void</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">initiatePayment(orderId)</span><span class="uml-type">: PaymentResult</span></div>
                </div>
            </div>
            <div class="uml-class">
                <div class="uml-class-name">OrderService</div>
                <div class="uml-stereotype">&laquo;service&raquo;</div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">createOrder(cartId, userId)</span><span class="uml-type">: Order</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">cancelOrder(orderId)</span><span class="uml-type">: void</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">updateStatus(orderId, status)</span><span class="uml-type">: void</span></div>
                </div>
            </div>
            <div class="uml-class">
                <div class="uml-class-name">AbandonedCartService</div>
                <div class="uml-stereotype">&laquo;service&raquo;</div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">processAbandoned()</span><span class="uml-type">: void</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">sendReminder(userId, cartId)</span><span class="uml-type">: void</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">releaseExpiredReservations()</span><span class="uml-type">: void</span></div>
                </div>
            </div>
        </div>

        <div class="uml-section-label">Relationships</div>
        <div class="uml-relations">
            <div class="uml-rel"><span class="uml-rel-from">User</span><span class="uml-rel-arrow">1 &mdash;&mdash; N</span><span class="uml-rel-to">Cart</span><span class="uml-rel-label">owns</span><span class="uml-rel-type">Association</span></div>
            <div class="uml-rel"><span class="uml-rel-from">Cart</span><span class="uml-rel-arrow">1 &mdash;&mdash; N</span><span class="uml-rel-to">CartItem</span><span class="uml-rel-label">contains</span><span class="uml-rel-type">Composition</span></div>
            <div class="uml-rel"><span class="uml-rel-from">CartItem</span><span class="uml-rel-arrow">N &mdash;&mdash; 1</span><span class="uml-rel-to">Product</span><span class="uml-rel-label">refers to</span><span class="uml-rel-type">Association</span></div>
            <div class="uml-rel"><span class="uml-rel-from">Cart</span><span class="uml-rel-arrow">1 &mdash;&mdash; 0..1</span><span class="uml-rel-to">Order</span><span class="uml-rel-label">converts to</span><span class="uml-rel-type">Association</span></div>
            <div class="uml-rel"><span class="uml-rel-from">Order</span><span class="uml-rel-arrow">1 &mdash;&mdash; 1</span><span class="uml-rel-to">Payment</span><span class="uml-rel-label">paid via</span><span class="uml-rel-type">Association</span></div>
            <div class="uml-rel"><span class="uml-rel-from">Cart</span><span class="uml-rel-arrow">0..1 &mdash;&mdash; 1</span><span class="uml-rel-to">Coupon</span><span class="uml-rel-label">applies</span><span class="uml-rel-type">Association</span></div>
            <div class="uml-rel"><span class="uml-rel-from">Product</span><span class="uml-rel-arrow">1 &mdash;&mdash; N</span><span class="uml-rel-to">InventoryLock</span><span class="uml-rel-label">locked by</span><span class="uml-rel-type">Aggregation</span></div>
        </div>

        <div class="uml-note">Yeh UML diagram E-commerce Checkout ka flow dikhata hai &mdash; User ka Cart hota hai jisme CartItems hote hain, CheckoutService cart ko Order me convert karta hai. InventoryService product stock lock karta hai taaki overselling na ho. CouponService discount validate karta hai aur PricingEngine final amount calculate karta hai.</div>
    </div>
</div>

<div class="section theme-purple">
    <div class="section-title"><span class="section-num">15</span>Interview Cheat-Sheet</div>
    <div class="summary-grid">
        <div class="summary-card"><strong>Inventory</strong><br>Optimistic locking (@Version); reserve on checkout, confirm on payment, release on failure/timeout</div>
        <div class="summary-card"><strong>Pricing</strong><br>Strategy pattern for discount types; server-side calculation; tax by shipping state</div>
        <div class="summary-card"><strong>Flash Sale</strong><br>Redis DECR for hot products; queue-based ordering; @Version prevents overselling</div>
        <div class="summary-card"><strong>Checkout Flow</strong><br>Reserve&rarr;Order&rarr;Pay&rarr;Confirm; compensating actions on failure (Saga pattern)</div>
        <div class="summary-card"><strong>Abandoned Cart</strong><br>24h TTL; recovery emails; 15-min inventory reservation auto-release</div>
        <div class="summary-card"><strong>Coupon</strong><br>Atomic usedCount increment; per-user limits; min order validation</div>
        <div class="summary-card"><strong>Guest Checkout</strong><br>Session-based cart; merge on login; no account required for purchase</div>
        <div class="summary-card"><strong>Patterns</strong><br>Strategy, Builder, Observer, State Machine, Chain of Responsibility</div>
    </div>
</div>

</div></div>
<!-- END E-COMMERCE CHECKOUT -->

<!-- ==================== RIDE HANDLING SYSTEM ==================== -->
`
}
