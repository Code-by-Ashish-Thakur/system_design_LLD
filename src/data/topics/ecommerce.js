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
        <div class="req-pill"><span class="num">1</span> Add / Remove / Update Cart Items</div>
        <div class="req-pill"><span class="num">2</span> Inventory Reservation (soft lock)</div>
        <div class="req-pill"><span class="num">3</span> Pricing Engine (discounts, coupons, tax)</div>
        <div class="req-pill"><span class="num">4</span> Address Management (shipping / billing)</div>
        <div class="req-pill"><span class="num">5</span> Checkout Flow (cart → address → payment → confirm)</div>
        <div class="req-pill"><span class="num">6</span> Order Placement &amp; Confirmation</div>
        <div class="req-pill"><span class="num">7</span> Coupon / Promo Code Validation</div>
        <div class="req-pill"><span class="num">8</span> Stock Validation at Checkout</div>
        <div class="req-pill"><span class="num">9</span> Abandoned Cart Recovery</div>
        <div class="req-pill"><span class="num">10</span> Flash Sale / Limited Stock Handling</div>
        <div class="req-pill"><span class="num">11</span> Guest Checkout Support</div>
        <div class="req-pill"><span class="num">12</span> Delivery Slot Selection</div>
    </div>
</div>

<div class="section theme-blue">
    <div class="section-title"><span class="section-num">2</span>Core Entities</div>
    <div class="entity-grid">
        <div class="entity-card">
            <h3>Cart</h3>
            <div class="field"><span class="field-name">id</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">userId</span><span class="field-type">Long (nullable for guest)</span></div>
            <div class="field"><span class="field-name">sessionId</span><span class="field-type">String (guest)</span></div>
            <div class="field"><span class="field-name">items</span><span class="field-type">List&lt;CartItem&gt;</span></div>
            <div class="field"><span class="field-name">couponCode</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">subtotal</span><span class="field-type">BigDecimal</span></div>
            <div class="field"><span class="field-name">discount</span><span class="field-type">BigDecimal</span></div>
            <div class="field"><span class="field-name">tax</span><span class="field-type">BigDecimal</span></div>
            <div class="field"><span class="field-name">total</span><span class="field-type">BigDecimal</span></div>
            <div class="field"><span class="field-name">status</span><span class="field-type">CartStatus</span></div>
            <div class="field"><span class="field-name">updatedAt</span><span class="field-type">LocalDateTime</span></div>
        </div>
        <div class="entity-card">
            <h3>CartItem</h3>
            <div class="field"><span class="field-name">id</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">cartId</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">productId</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">quantity</span><span class="field-type">int</span></div>
            <div class="field"><span class="field-name">unitPrice</span><span class="field-type">BigDecimal</span></div>
            <div class="field"><span class="field-name">totalPrice</span><span class="field-type">BigDecimal</span></div>
        </div>
        <div class="entity-card">
            <h3>Inventory</h3>
            <div class="field"><span class="field-name">id</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">productId</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">warehouseId</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">totalStock</span><span class="field-type">int</span></div>
            <div class="field"><span class="field-name">reserved</span><span class="field-type">int</span></div>
            <div class="field"><span class="field-name">available</span><span class="field-type">int (computed)</span></div>
            <div class="field"><span class="field-name">version</span><span class="field-type">Long (@Version)</span></div>
        </div>
        <div class="entity-card">
            <h3>Coupon</h3>
            <div class="field"><span class="field-name">id</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">code</span><span class="field-type">String (UNIQUE)</span></div>
            <div class="field"><span class="field-name">type</span><span class="field-type">CouponType</span></div>
            <div class="field"><span class="field-name">value</span><span class="field-type">BigDecimal</span></div>
            <div class="field"><span class="field-name">minOrderAmount</span><span class="field-type">BigDecimal</span></div>
            <div class="field"><span class="field-name">maxDiscount</span><span class="field-type">BigDecimal</span></div>
            <div class="field"><span class="field-name">usageLimit</span><span class="field-type">int</span></div>
            <div class="field"><span class="field-name">usedCount</span><span class="field-type">int</span></div>
            <div class="field"><span class="field-name">validFrom</span><span class="field-type">LocalDateTime</span></div>
            <div class="field"><span class="field-name">validTo</span><span class="field-type">LocalDateTime</span></div>
        </div>
        <div class="entity-card">
            <h3>Order</h3>
            <div class="field"><span class="field-name">id</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">orderId</span><span class="field-type">String (UUID)</span></div>
            <div class="field"><span class="field-name">userId</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">items</span><span class="field-type">List&lt;OrderItem&gt;</span></div>
            <div class="field"><span class="field-name">shippingAddressId</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">subtotal</span><span class="field-type">BigDecimal</span></div>
            <div class="field"><span class="field-name">discount</span><span class="field-type">BigDecimal</span></div>
            <div class="field"><span class="field-name">tax</span><span class="field-type">BigDecimal</span></div>
            <div class="field"><span class="field-name">total</span><span class="field-type">BigDecimal</span></div>
            <div class="field"><span class="field-name">status</span><span class="field-type">OrderStatus</span></div>
            <div class="field"><span class="field-name">paymentId</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">createdAt</span><span class="field-type">LocalDateTime</span></div>
        </div>
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
    <div class="section-title"><span class="section-num">4</span>Interfaces &amp; SOLID Principles</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span><span class="code-title">CheckoutInterfaces.java</span></div>
    <pre class="code-block">
<span class="kw">public interface</span> <span class="tp">ICartService</span> {
    <span class="tp">Cart</span> <span class="fn">getOrCreate</span>(<span class="tp">Long</span> userId);
    <span class="tp">Cart</span> <span class="fn">addItem</span>(<span class="tp">Long</span> cartId, <span class="tp">Long</span> productId, <span class="kw">int</span> quantity);
    <span class="tp">Cart</span> <span class="fn">removeItem</span>(<span class="tp">Long</span> cartId, <span class="tp">Long</span> productId);
    <span class="tp">Cart</span> <span class="fn">applyCoupon</span>(<span class="tp">Long</span> cartId, <span class="tp">String</span> couponCode);
}

<span class="kw">public interface</span> <span class="tp">IInventoryService</span> {
    <span class="kw">boolean</span> <span class="fn">reserve</span>(<span class="tp">Long</span> productId, <span class="kw">int</span> qty, <span class="tp">String</span> reservationId);
    <span class="kw">void</span> <span class="fn">confirm</span>(<span class="tp">String</span> reservationId);
    <span class="kw">void</span> <span class="fn">release</span>(<span class="tp">String</span> reservationId);
    <span class="kw">int</span> <span class="fn">getAvailable</span>(<span class="tp">Long</span> productId);
}

<span class="kw">public interface</span> <span class="tp">IPricingEngine</span> {
    <span class="tp">PriceBreakdown</span> <span class="fn">calculate</span>(<span class="tp">Cart</span> cart);
    <span class="tp">BigDecimal</span> <span class="fn">applyDiscount</span>(<span class="tp">Cart</span> cart, <span class="tp">Coupon</span> coupon);
    <span class="tp">BigDecimal</span> <span class="fn">calculateTax</span>(<span class="tp">Cart</span> cart, <span class="tp">Address</span> shipping);
}

<span class="kw">public interface</span> <span class="tp">ICheckoutService</span> {
    <span class="tp">Order</span> <span class="fn">checkout</span>(<span class="tp">CheckoutRequest</span> request);
    <span class="kw">void</span> <span class="fn">cancelOrder</span>(<span class="tp">String</span> orderId);
}
    </pre></div>
</div>

<div class="section theme-blue">
    <div class="section-title"><span class="section-num">5</span>Class Design (JPA Entities)</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span><span class="code-title">Inventory.java — Optimistic Locking</span></div>
    <pre class="code-block">
<span class="ann">@Entity</span>
<span class="ann">@Table</span>(name = <span class="st">"inventory"</span>, indexes = {
    <span class="ann">@Index</span>(name = <span class="st">"idx_inv_product"</span>, columnList = <span class="st">"product_id, warehouse_id"</span>, unique = <span class="kw">true</span>)
})
<span class="kw">public class</span> <span class="tp">Inventory</span> {
    <span class="ann">@Id</span> <span class="ann">@GeneratedValue</span>(strategy = <span class="tp">GenerationType</span>.IDENTITY)
    <span class="kw">private</span> <span class="tp">Long</span> id;
    <span class="kw">private</span> <span class="tp">Long</span> productId;
    <span class="kw">private</span> <span class="tp">Long</span> warehouseId;
    <span class="kw">private int</span> totalStock;
    <span class="kw">private int</span> reserved;

    <span class="ann">@Version</span>
    <span class="kw">private</span> <span class="tp">Long</span> version; <span class="cm">// Optimistic locking prevents overselling</span>

    <span class="kw">public int</span> <span class="fn">getAvailable</span>() { <span class="kw">return</span> totalStock - reserved; }

    <span class="kw">public void</span> <span class="fn">reserve</span>(<span class="kw">int</span> qty) {
        <span class="kw">if</span> (<span class="fn">getAvailable</span>() &lt; qty)
            <span class="kw">throw new</span> <span class="tp">InsufficientStockException</span>(<span class="st">"Only "</span> + <span class="fn">getAvailable</span>() + <span class="st">" left"</span>);
        <span class="kw">this</span>.reserved += qty;
    }
}
    </pre></div>
</div>

<div class="section theme-purple">
    <div class="section-title"><span class="section-num">6</span>Repository / DAO Layer</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span><span class="code-title">CartRepository.java</span></div>
    <pre class="code-block">
<span class="kw">public interface</span> <span class="tp">CartRepository</span> <span class="kw">extends</span> <span class="tp">JpaRepository</span>&lt;<span class="tp">Cart</span>, <span class="tp">Long</span>&gt; {
    <span class="tp">Optional</span>&lt;<span class="tp">Cart</span>&gt; <span class="fn">findByUserIdAndStatus</span>(<span class="tp">Long</span> userId, <span class="tp">CartStatus</span> status);
    <span class="tp">Optional</span>&lt;<span class="tp">Cart</span>&gt; <span class="fn">findBySessionIdAndStatus</span>(<span class="tp">String</span> sessionId, <span class="tp">CartStatus</span> status);

    <span class="ann">@Query</span>(<span class="st">"SELECT c FROM Cart c WHERE c.status = 'ACTIVE' AND c.updatedAt &lt; :cutoff"</span>)
    <span class="tp">List</span>&lt;<span class="tp">Cart</span>&gt; <span class="fn">findAbandonedCarts</span>(<span class="ann">@Param</span>(<span class="st">"cutoff"</span>) <span class="tp">LocalDateTime</span> cutoff);
}

<span class="kw">public interface</span> <span class="tp">InventoryRepository</span> <span class="kw">extends</span> <span class="tp">JpaRepository</span>&lt;<span class="tp">Inventory</span>, <span class="tp">Long</span>&gt; {
    <span class="ann">@Lock</span>(<span class="tp">LockModeType</span>.OPTIMISTIC)
    <span class="tp">Optional</span>&lt;<span class="tp">Inventory</span>&gt; <span class="fn">findByProductIdAndWarehouseId</span>(<span class="tp">Long</span> productId, <span class="tp">Long</span> warehouseId);

    <span class="ann">@Modifying</span>
    <span class="ann">@Query</span>(<span class="st">"UPDATE Inventory i SET i.reserved = i.reserved - :qty WHERE i.productId = :pid AND i.reserved >= :qty"</span>)
    <span class="kw">int</span> <span class="fn">releaseStock</span>(<span class="ann">@Param</span>(<span class="st">"pid"</span>) <span class="tp">Long</span> productId, <span class="ann">@Param</span>(<span class="st">"qty"</span>) <span class="kw">int</span> qty);
}

<span class="kw">public interface</span> <span class="tp">CouponRepository</span> <span class="kw">extends</span> <span class="tp">JpaRepository</span>&lt;<span class="tp">Coupon</span>, <span class="tp">Long</span>&gt; {
    <span class="tp">Optional</span>&lt;<span class="tp">Coupon</span>&gt; <span class="fn">findByCodeAndValidToAfter</span>(<span class="tp">String</span> code, <span class="tp">LocalDateTime</span> now);
}
    </pre></div>
</div>

<div class="section theme-green">
    <div class="section-title"><span class="section-num">7</span>Database Schema</div>
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
    <div class="section-title"><span class="section-num">8</span>API Endpoints</div>
    <div class="api-grid">
        <div class="api-card"><div class="api-method get">GET</div><div class="api-path">/api/v1/cart</div><div class="api-desc">Get current user's cart with price breakdown</div></div>
        <div class="api-card"><div class="api-method post">POST</div><div class="api-path">/api/v1/cart/items</div><div class="api-desc">Add item to cart (validates stock)</div></div>
        <div class="api-card"><div class="api-method put">PUT</div><div class="api-path">/api/v1/cart/items/{productId}</div><div class="api-desc">Update item quantity</div></div>
        <div class="api-card"><div class="api-method delete">DELETE</div><div class="api-path">/api/v1/cart/items/{productId}</div><div class="api-desc">Remove item from cart</div></div>
        <div class="api-card"><div class="api-method post">POST</div><div class="api-path">/api/v1/cart/coupon</div><div class="api-desc">Apply coupon code</div></div>
        <div class="api-card"><div class="api-method delete">DELETE</div><div class="api-path">/api/v1/cart/coupon</div><div class="api-desc">Remove applied coupon</div></div>
        <div class="api-card"><div class="api-method post">POST</div><div class="api-path">/api/v1/checkout</div><div class="api-desc">Place order (reserve stock → create order → initiate payment)</div></div>
        <div class="api-card"><div class="api-method get">GET</div><div class="api-path">/api/v1/orders/{orderId}</div><div class="api-desc">Get order details &amp; status</div></div>
        <div class="api-card"><div class="api-method put">PUT</div><div class="api-path">/api/v1/orders/{orderId}/cancel</div><div class="api-desc">Cancel order (releases inventory)</div></div>
        <div class="api-card"><div class="api-method get">GET</div><div class="api-path">/api/v1/inventory/{productId}</div><div class="api-desc">Check available stock</div></div>
    </div>
</div>

<div class="section theme-purple">
    <div class="section-title"><span class="section-num">9</span>Service Layer</div>
    <div class="service-grid">
        <div class="service-card">
            <h3>CartService</h3>
            <p class="svc-desc">Manages shopping cart — add items, update quantity, and recalculate total</p>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Add a product to the cart</div><code>Cart addItem(Long productId, int quantity)</code></div>
        </div>
        <div class="service-card">
            <h3>InventoryService</h3>
            <p class="svc-desc">Reserves stock when user adds to cart, auto-releases after 15 minutes if not purchased</p>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Reserve stock for a product</div><code>boolean reserve(Long productId, int quantity)</code></div>
        </div>
        <div class="service-card">
            <h3>PricingEngine</h3>
            <p class="svc-desc">Calculates the final price — adds up items, applies coupon discount, and calculates tax</p>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Calculate total price for the cart</div><code>PriceBreakdown calculate(Cart cart)</code></div>
        </div>
        <div class="service-card">
            <h3>CouponService</h3>
            <p class="svc-desc">Checks if a coupon code is valid (not expired, minimum amount met, not already used)</p>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Check coupon and apply discount</div><code>CouponResult validate(String code, Cart cart)</code></div>
        </div>
        <div class="service-card">
            <h3>CheckoutService</h3>
            <p class="svc-desc">Full checkout flow — reserve stock, create order, start payment, confirm on success</p>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Process the complete checkout</div><code>Order checkout(CheckoutRequest request)</code></div>
        </div>
        <div class="service-card">
            <h3>OrderService</h3>
            <p class="svc-desc">Creates an order from the cart and manages its lifecycle (placed, shipped, delivered)</p>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Create a new order from cart</div><code>Order createOrder(Cart cart, Long addressId)</code></div>
        </div>
        <div class="service-card">
            <h3>AbandonedCartService</h3>
            <p class="svc-desc">Sends reminder emails for carts left inactive for 24+ hours and releases reserved stock</p>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Process all abandoned carts (runs as scheduled job)</div><code>void processAbandoned()</code></div>
        </div>
    </div>
</div>

<div class="section theme-green">
    <div class="section-title"><span class="section-num">10</span>Key Architecture</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span><span class="code-title">CheckoutService.java — Checkout Flow</span></div>
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

        <span class="cm">// 6. On payment failure → release inventory (compensating action)</span>
        <span class="cm">// Handled by PaymentFailedEventListener</span>

        <span class="kw">return</span> order;
    }
}
    </pre></div>
</div>

<div class="section theme-blue">
    <div class="section-title"><span class="section-num">11</span>Design Patterns Used</div>
    <div class="pattern-grid">
        <div class="pattern-card"><h3>Strategy</h3><p>IPricingStrategy for discount types (percentage, flat, BOGO) — add new promotions without code changes</p></div>
        <div class="pattern-card"><h3>Builder</h3><p>Order.builder() constructs complex order from cart items, address, pricing, payment info</p></div>
        <div class="pattern-card"><h3>Observer</h3><p>OrderCreated / PaymentFailed events trigger inventory confirm/release, email notifications</p></div>
        <div class="pattern-card"><h3>State Machine</h3><p>OrderStatus transitions: CREATED→PAYMENT_PENDING→CONFIRMED→SHIPPED→DELIVERED</p></div>
        <div class="pattern-card"><h3>Chain of Responsibility</h3><p>Checkout validation pipeline: StockValidator → PriceValidator → AddressValidator → FraudValidator</p></div>
        <div class="pattern-card"><h3>Template Method</h3><p>AbstractCheckoutStep defines step flow (validate → execute → rollback), subclasses implement specifics</p></div>
    </div>
</div>

<div class="section theme-purple">
    <div class="section-title"><span class="section-num">12</span>Sequence Flow</div>
    <div class="flow-container">
        <div class="flow-step"><span class="step-num">1</span><span class="step-text">User adds items to cart → CartService validates stock availability</span></div>
        <div class="flow-step"><span class="step-num">2</span><span class="step-text">User applies coupon → CouponService validates &amp; calculates discount</span></div>
        <div class="flow-step"><span class="step-num">3</span><span class="step-text">User selects shipping address → PricingEngine calculates tax by state</span></div>
        <div class="flow-step"><span class="step-num">4</span><span class="step-text">User clicks "Place Order" → POST /api/v1/checkout</span></div>
        <div class="flow-step"><span class="step-num">5</span><span class="step-text">InventoryService reserves stock for all items (optimistic lock)</span></div>
        <div class="flow-step"><span class="step-num">6</span><span class="step-text">OrderService creates Order record (status = PAYMENT_PENDING)</span></div>
        <div class="flow-step"><span class="step-num">7</span><span class="step-text">PaymentService initiates payment with gateway</span></div>
        <div class="flow-step"><span class="step-num">8</span><span class="step-text">On payment success → confirm inventory, update order to CONFIRMED</span></div>
        <div class="flow-step"><span class="step-num">9</span><span class="step-text">On payment failure → release inventory, mark order CANCELLED</span></div>
        <div class="flow-step"><span class="step-num">10</span><span class="step-text">Send order confirmation email &amp; push notification</span></div>
    </div>
</div>

<div class="section theme-green">
    <div class="section-title"><span class="section-num">13</span>Capacity Estimation</div>
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
    <div class="section-title"><span class="section-num">14</span>Bottlenecks &amp; Solutions</div>
    <div class="bottleneck-grid">
        <div class="bottleneck-card"><h3>Flash Sale Overselling</h3><p>Optimistic locking with @Version; Redis atomic DECR for hot products; queue-based ordering for extreme cases</p></div>
        <div class="bottleneck-card"><h3>Inventory Hot Row</h3><p>Shard inventory by warehouse; Redis cache for read-heavy stock checks; DB only for writes</p></div>
        <div class="bottleneck-card"><h3>Cart Bloat</h3><p>Set max 50 items per cart; lazy price recalculation; TTL on inactive carts</p></div>
        <div class="bottleneck-card"><h3>Coupon Race Condition</h3><p>Atomic usedCount increment with WHERE usedCount &lt; usageLimit; per-user usage tracking</p></div>
        <div class="bottleneck-card"><h3>Checkout Latency</h3><p>Parallelize: stock check + address validation + pricing; async payment initiation</p></div>
        <div class="bottleneck-card"><h3>Abandoned Reservations</h3><p>Scheduled job releases expired reservations (TTL 15min); Redis TTL for real-time tracking</p></div>
    </div>
</div>

<div class="section theme-purple">
    <div class="section-title"><span class="section-num">15</span>Edge Cases</div>
    <div class="edge-grid">
        <div class="edge-card"><h3>Price Changed During Checkout</h3><p>Lock price at cart add time; re-validate at checkout; show user if price changed</p></div>
        <div class="edge-card"><h3>Item Out of Stock at Checkout</h3><p>Re-validate all items before reserving; partial checkout option or remove unavailable items</p></div>
        <div class="edge-card"><h3>Coupon Expired Mid-Checkout</h3><p>Re-validate coupon at order creation; recalculate total; notify user if coupon invalid</p></div>
        <div class="edge-card"><h3>Concurrent Cart Modification</h3><p>Optimistic locking on cart; last-write-wins for quantity updates; conflict resolution</p></div>
        <div class="edge-card"><h3>Guest to Logged-in Cart Merge</h3><p>On login: merge guest cart items into user cart; handle duplicate products by summing qty</p></div>
        <div class="edge-card"><h3>Payment Timeout</h3><p>15-min reservation window; if payment not completed → release stock → cancel order</p></div>
    </div>
</div>

<div class="section theme-green">
    <div class="section-title"><span class="section-num">16</span>Security Considerations</div>
    <div class="security-grid">
        <div class="security-card"><h3>Price Manipulation</h3><p>Server-side price calculation; never trust client-sent prices; validate at every step</p></div>
        <div class="security-card"><h3>Coupon Abuse</h3><p>Per-user usage limits; device fingerprinting; velocity checks on coupon redemption</p></div>
        <div class="security-card"><h3>Cart Tampering</h3><p>JWT authentication; server-side cart storage; validate cart ownership on every request</p></div>
        <div class="security-card"><h3>Stock Manipulation</h3><p>Rate limit add-to-cart API; CAPTCHA for suspicious patterns; bot detection</p></div>
        <div class="security-card"><h3>CSRF Protection</h3><p>CSRF tokens on checkout form; SameSite cookie attributes; verify origin header</p></div>
    </div>
</div>

<div class="section theme-blue">
    <div class="section-title"><span class="section-num">17</span>Interview Cheat-Sheet</div>
    <div class="summary-grid">
        <div class="summary-card"><strong>Inventory</strong><br>Optimistic locking (@Version); reserve on checkout, confirm on payment, release on failure/timeout</div>
        <div class="summary-card"><strong>Pricing</strong><br>Strategy pattern for discount types; server-side calculation; tax by shipping state</div>
        <div class="summary-card"><strong>Flash Sale</strong><br>Redis DECR for hot products; queue-based ordering; @Version prevents overselling</div>
        <div class="summary-card"><strong>Checkout Flow</strong><br>Reserve→Order→Pay→Confirm; compensating actions on failure (Saga pattern)</div>
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
