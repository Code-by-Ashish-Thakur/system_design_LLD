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
        <div class="req-pill"><span class="num">5</span> Checkout Flow (cart &rarr; address &rarr; payment &rarr; confirm)</div>
        <div class="req-pill"><span class="num">6</span> Order Placement &amp; Confirmation</div>
        <div class="req-pill"><span class="num">7</span> Coupon / Promo Code Validation</div>
        <div class="req-pill"><span class="num">8</span> Stock Validation at Checkout</div>
        <div class="req-pill"><span class="num">9</span> Abandoned Cart Recovery</div>
        <div class="req-pill"><span class="num">10</span> Flash Sale / Limited Stock Handling</div>
        <div class="req-pill"><span class="num">11</span> Guest Checkout Support</div>
        <div class="req-pill"><span class="num">12</span> Delivery Slot Selection</div>
    </div>
</div>

<div class="section theme-purple">
    <div class="section-title"><span class="section-num">2</span>Enums</div>
    <div class="enum-grid">
        <div class="enum-card"><h3>CartStatus</h3><div class="enum-val">ACTIVE</div><div class="enum-val">CHECKED_OUT</div><div class="enum-val">ABANDONED</div><div class="enum-val">MERGED</div></div>
        <div class="enum-card"><h3>OrderStatus</h3><div class="enum-val">CREATED</div><div class="enum-val">PAYMENT_PENDING</div><div class="enum-val">CONFIRMED</div><div class="enum-val">PROCESSING</div><div class="enum-val">SHIPPED</div><div class="enum-val">DELIVERED</div><div class="enum-val">CANCELLED</div><div class="enum-val">RETURNED</div></div>
        <div class="enum-card"><h3>CouponType</h3><div class="enum-val">PERCENTAGE</div><div class="enum-val">FLAT_AMOUNT</div><div class="enum-val">FREE_SHIPPING</div><div class="enum-val">BUY_X_GET_Y</div></div>
        <div class="enum-card"><h3>InventoryAction</h3><div class="enum-val">RESERVE</div><div class="enum-val">CONFIRM</div><div class="enum-val">RELEASE</div><div class="enum-val">DEDUCT</div></div>
    </div>
</div>

<div class="section theme-green">
    <div class="section-title"><span class="section-num">3</span>Class Design (JPA Entities)</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span><span class="code-title">Inventory.java &mdash; Optimistic Locking</span></div>
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

<div class="section theme-blue">
    <div class="section-title"><span class="section-num">4</span>Database Schema</div>

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

<div class="section theme-green">
    <div class="section-title"><span class="section-num">6</span>Service LLD</div>
    <div class="service-grid">
        <div class="service-card">
            <h3>CartService</h3>
            <p class="svc-desc">Shopping cart manage karta hai &mdash; items add/remove, quantity update aur total recalculate karta hai</p>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">1</span> addItem(AddItemRequest)</div>
                <div class="method-return">Returns: <code>Cart</code></div>
                <div class="params-title">Parameters (AddItemRequest):</div>
                <div class="param-row"><span class="param-name">userId</span><span class="param-type">Long</span><span class="param-opt">[Optional]</span><span class="param-comment">// null for guest cart</span></div>
                <div class="param-row"><span class="param-name">sessionId</span><span class="param-type">String</span><span class="param-opt">[Optional]</span><span class="param-comment">// guest user ke liye session</span></div>
                <div class="param-row"><span class="param-name">productId</span><span class="param-type">Long</span></div>
                <div class="param-row"><span class="param-name">quantity</span><span class="param-type">int</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">2</span> updateQuantity(UpdateQuantityRequest)</div>
                <div class="method-return">Returns: <code>Cart</code></div>
                <div class="params-title">Parameters (UpdateQuantityRequest):</div>
                <div class="param-row"><span class="param-name">cartId</span><span class="param-type">Long</span></div>
                <div class="param-row"><span class="param-name">productId</span><span class="param-type">Long</span></div>
                <div class="param-row"><span class="param-name">newQuantity</span><span class="param-type">int</span><span class="param-comment">// 0 means remove item</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">3</span> removeItem(RemoveItemRequest)</div>
                <div class="method-return">Returns: <code>Cart</code></div>
                <div class="params-title">Parameters (RemoveItemRequest):</div>
                <div class="param-row"><span class="param-name">cartId</span><span class="param-type">Long</span></div>
                <div class="param-row"><span class="param-name">productId</span><span class="param-type">Long</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">4</span> getCart(GetCartRequest)</div>
                <div class="method-return">Returns: <code>Cart</code></div>
                <div class="params-title">Parameters (GetCartRequest):</div>
                <div class="param-row"><span class="param-name">userId</span><span class="param-type">Long</span><span class="param-opt">[Optional]</span></div>
                <div class="param-row"><span class="param-name">sessionId</span><span class="param-type">String</span><span class="param-opt">[Optional]</span><span class="param-comment">// guest ke liye</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">5</span> applyCoupon(ApplyCouponRequest)</div>
                <div class="method-return">Returns: <code>Cart</code></div>
                <div class="params-title">Parameters (ApplyCouponRequest):</div>
                <div class="param-row"><span class="param-name">cartId</span><span class="param-type">Long</span></div>
                <div class="param-row"><span class="param-name">couponCode</span><span class="param-type">String</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">6</span> removeCoupon(cartId)</div>
                <div class="method-return">Returns: <code>Cart</code></div>
                <div class="params-title">Parameters:</div>
                <div class="param-row"><span class="param-name">cartId</span><span class="param-type">Long</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">7</span> mergeGuestCart(MergeCartRequest)</div>
                <div class="method-return">Returns: <code>Cart</code></div>
                <div class="params-title">Parameters (MergeCartRequest):</div>
                <div class="param-row"><span class="param-name">userId</span><span class="param-type">Long</span><span class="param-comment">// logged-in user</span></div>
                <div class="param-row"><span class="param-name">sessionId</span><span class="param-type">String</span><span class="param-comment">// guest session to merge from</span></div>
            </div>
        </div>

        <div class="service-card">
            <h3>InventoryService</h3>
            <p class="svc-desc">Stock manage karta hai &mdash; reserve on checkout, confirm on payment, release on cancel ya timeout (15 min)</p>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">1</span> reserve(ReserveStockRequest)</div>
                <div class="method-return">Returns: <code>boolean</code></div>
                <div class="params-title">Parameters (ReserveStockRequest):</div>
                <div class="param-row"><span class="param-name">productId</span><span class="param-type">Long</span></div>
                <div class="param-row"><span class="param-name">warehouseId</span><span class="param-type">Long</span><span class="param-opt">[Optional]</span><span class="param-comment">// auto-pick nearest if null</span></div>
                <div class="param-row"><span class="param-name">quantity</span><span class="param-type">int</span></div>
                <div class="param-row"><span class="param-name">reservationId</span><span class="param-type">String</span><span class="param-comment">// unique id for this reservation (cartId/orderId)</span></div>
                <div class="param-row"><span class="param-name">ttlMinutes</span><span class="param-type">int</span><span class="param-comment">// reservation expiry, default 15 min</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">2</span> confirm(reservationId)</div>
                <div class="method-return">Returns: <code>void</code></div>
                <div class="params-title">Parameters:</div>
                <div class="param-row"><span class="param-name">reservationId</span><span class="param-type">String</span><span class="param-comment">// payment success ke baad stock permanently deduct</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">3</span> release(ReleaseStockRequest)</div>
                <div class="method-return">Returns: <code>void</code></div>
                <div class="params-title">Parameters (ReleaseStockRequest):</div>
                <div class="param-row"><span class="param-name">reservationId</span><span class="param-type">String</span></div>
                <div class="param-row"><span class="param-name">productId</span><span class="param-type">Long</span></div>
                <div class="param-row"><span class="param-name">quantity</span><span class="param-type">int</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">4</span> getAvailable(productId)</div>
                <div class="method-return">Returns: <code>int</code></div>
                <div class="params-title">Parameters:</div>
                <div class="param-row"><span class="param-name">productId</span><span class="param-type">Long</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">5</span> isAvailable(StockCheckRequest)</div>
                <div class="method-return">Returns: <code>boolean</code></div>
                <div class="params-title">Parameters (StockCheckRequest):</div>
                <div class="param-row"><span class="param-name">productId</span><span class="param-type">Long</span></div>
                <div class="param-row"><span class="param-name">quantity</span><span class="param-type">int</span><span class="param-comment">// check if this much stock available hai</span></div>
            </div>
        </div>

        <div class="service-card">
            <h3>PricingEngine</h3>
            <p class="svc-desc">Final price calculate karta hai &mdash; items ka subtotal, coupon discount apply, aur shipping state ke hisaab se tax lagata hai</p>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">1</span> calculate(PriceCalculateRequest)</div>
                <div class="method-return">Returns: <code>PriceBreakdown</code></div>
                <div class="params-title">Parameters (PriceCalculateRequest):</div>
                <div class="param-row"><span class="param-name">cartId</span><span class="param-type">Long</span></div>
                <div class="param-row"><span class="param-name">items</span><span class="param-type">List&lt;CartItem&gt;</span></div>
                <div class="param-row"><span class="param-name">couponCode</span><span class="param-type">String</span><span class="param-opt">[Optional]</span></div>
                <div class="param-row"><span class="param-name">shippingAddressId</span><span class="param-type">Long</span><span class="param-opt">[Optional]</span><span class="param-comment">// tax calculation ke liye</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">2</span> applyDiscount(ApplyDiscountRequest)</div>
                <div class="method-return">Returns: <code>PriceBreakdown</code></div>
                <div class="params-title">Parameters (ApplyDiscountRequest):</div>
                <div class="param-row"><span class="param-name">priceBreakdown</span><span class="param-type">PriceBreakdown</span><span class="param-comment">// existing subtotal info</span></div>
                <div class="param-row"><span class="param-name">coupon</span><span class="param-type">CouponResult</span><span class="param-comment">// validated coupon with discount value</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">3</span> calculateTax(TaxRequest)</div>
                <div class="method-return">Returns: <code>BigDecimal</code></div>
                <div class="params-title">Parameters (TaxRequest):</div>
                <div class="param-row"><span class="param-name">subtotal</span><span class="param-type">BigDecimal</span><span class="param-comment">// discount ke baad ka amount</span></div>
                <div class="param-row"><span class="param-name">state</span><span class="param-type">String</span><span class="param-comment">// shipping state for tax slab</span></div>
                <div class="param-row"><span class="param-name">productCategory</span><span class="param-type">String</span><span class="param-opt">[Optional]</span><span class="param-comment">// GST category based tax</span></div>
            </div>
        </div>

        <div class="service-card">
            <h3>CouponService</h3>
            <p class="svc-desc">Coupon code validate karta hai &mdash; expiry check, min order amount, usage limit aur per-user usage track karta hai</p>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">1</span> validate(ValidateCouponRequest)</div>
                <div class="method-return">Returns: <code>CouponResult</code></div>
                <div class="params-title">Parameters (ValidateCouponRequest):</div>
                <div class="param-row"><span class="param-name">couponCode</span><span class="param-type">String</span></div>
                <div class="param-row"><span class="param-name">cartId</span><span class="param-type">Long</span></div>
                <div class="param-row"><span class="param-name">userId</span><span class="param-type">Long</span><span class="param-comment">// per-user usage check</span></div>
                <div class="param-row"><span class="param-name">cartTotal</span><span class="param-type">BigDecimal</span><span class="param-comment">// min order amount check ke liye</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">2</span> isActive(couponCode)</div>
                <div class="method-return">Returns: <code>boolean</code></div>
                <div class="params-title">Parameters:</div>
                <div class="param-row"><span class="param-name">couponCode</span><span class="param-type">String</span><span class="param-comment">// expired ya limit crossed toh false</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">3</span> markUsed(MarkCouponUsedRequest)</div>
                <div class="method-return">Returns: <code>void</code></div>
                <div class="params-title">Parameters (MarkCouponUsedRequest):</div>
                <div class="param-row"><span class="param-name">couponCode</span><span class="param-type">String</span></div>
                <div class="param-row"><span class="param-name">userId</span><span class="param-type">Long</span></div>
                <div class="param-row"><span class="param-name">orderId</span><span class="param-type">String</span><span class="param-comment">// tracking ke liye which order used it</span></div>
            </div>
        </div>

        <div class="service-card">
            <h3>CheckoutService</h3>
            <p class="svc-desc">Pura checkout flow handle karta hai &mdash; stock reserve, order create, payment initiate, aur failure pe rollback (Saga pattern)</p>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">1</span> checkout(CheckoutRequest)</div>
                <div class="method-return">Returns: <code>Order</code></div>
                <div class="params-title">Parameters (CheckoutRequest):</div>
                <div class="param-row"><span class="param-name">cartId</span><span class="param-type">Long</span></div>
                <div class="param-row"><span class="param-name">userId</span><span class="param-type">Long</span></div>
                <div class="param-row"><span class="param-name">shippingAddressId</span><span class="param-type">Long</span></div>
                <div class="param-row"><span class="param-name">billingAddressId</span><span class="param-type">Long</span><span class="param-opt">[Optional]</span><span class="param-comment">// same as shipping if null</span></div>
                <div class="param-row"><span class="param-name">paymentMethod</span><span class="param-type">PaymentMethod</span><span class="param-comment">// UPI, CARD, COD, WALLET</span></div>
                <div class="param-row"><span class="param-name">deliverySlotId</span><span class="param-type">Long</span><span class="param-opt">[Optional]</span></div>
                <div class="param-row"><span class="param-name">idempotencyKey</span><span class="param-type">String</span><span class="param-comment">// duplicate order prevent karta hai</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">2</span> validateStock(ValidateStockRequest)</div>
                <div class="method-return">Returns: <code>void</code></div>
                <div class="params-title">Parameters (ValidateStockRequest):</div>
                <div class="param-row"><span class="param-name">cartId</span><span class="param-type">Long</span></div>
                <div class="param-row"><span class="param-name">items</span><span class="param-type">List&lt;CartItem&gt;</span><span class="param-comment">// har item ka stock check before checkout</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">3</span> initiatePayment(PaymentInitRequest)</div>
                <div class="method-return">Returns: <code>PaymentResult</code></div>
                <div class="params-title">Parameters (PaymentInitRequest):</div>
                <div class="param-row"><span class="param-name">orderId</span><span class="param-type">String</span></div>
                <div class="param-row"><span class="param-name">amount</span><span class="param-type">BigDecimal</span></div>
                <div class="param-row"><span class="param-name">paymentMethod</span><span class="param-type">PaymentMethod</span></div>
                <div class="param-row"><span class="param-name">idempotencyKey</span><span class="param-type">String</span><span class="param-comment">// duplicate payment prevent karta hai</span></div>
            </div>
        </div>

        <div class="service-card">
            <h3>OrderService</h3>
            <p class="svc-desc">Order create karta hai cart se aur lifecycle manage karta hai &mdash; placed, shipped, delivered, cancelled, returned</p>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">1</span> createOrder(CreateOrderRequest)</div>
                <div class="method-return">Returns: <code>Order</code></div>
                <div class="params-title">Parameters (CreateOrderRequest):</div>
                <div class="param-row"><span class="param-name">cartId</span><span class="param-type">Long</span></div>
                <div class="param-row"><span class="param-name">userId</span><span class="param-type">Long</span></div>
                <div class="param-row"><span class="param-name">shippingAddressId</span><span class="param-type">Long</span></div>
                <div class="param-row"><span class="param-name">priceBreakdown</span><span class="param-type">PriceBreakdown</span><span class="param-comment">// subtotal, discount, tax, total</span></div>
                <div class="param-row"><span class="param-name">deliverySlotId</span><span class="param-type">Long</span><span class="param-opt">[Optional]</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">2</span> getOrder(orderId)</div>
                <div class="method-return">Returns: <code>Order</code></div>
                <div class="params-title">Parameters:</div>
                <div class="param-row"><span class="param-name">orderId</span><span class="param-type">String</span><span class="param-comment">// UUID based order identifier</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">3</span> cancelOrder(CancelOrderRequest)</div>
                <div class="method-return">Returns: <code>void</code></div>
                <div class="params-title">Parameters (CancelOrderRequest):</div>
                <div class="param-row"><span class="param-name">orderId</span><span class="param-type">String</span></div>
                <div class="param-row"><span class="param-name">userId</span><span class="param-type">Long</span><span class="param-comment">// ownership verify karta hai</span></div>
                <div class="param-row"><span class="param-name">reason</span><span class="param-type">String</span><span class="param-opt">[Optional]</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">4</span> updateStatus(UpdateStatusRequest)</div>
                <div class="method-return">Returns: <code>void</code></div>
                <div class="params-title">Parameters (UpdateStatusRequest):</div>
                <div class="param-row"><span class="param-name">orderId</span><span class="param-type">String</span></div>
                <div class="param-row"><span class="param-name">newStatus</span><span class="param-type">OrderStatus</span><span class="param-comment">// PROCESSING, SHIPPED, DELIVERED etc</span></div>
                <div class="param-row"><span class="param-name">updatedBy</span><span class="param-type">String</span><span class="param-opt">[Optional]</span><span class="param-comment">// admin/system identifier</span></div>
            </div>
        </div>

        <div class="service-card">
            <h3>AbandonedCartService</h3>
            <p class="svc-desc">24+ ghante se inactive carts detect karta hai, reminder email bhejta hai aur expired reservations ka stock release karta hai</p>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">1</span> processAbandoned()</div>
                <div class="method-return">Returns: <code>void</code></div>
                <div class="params-title">Parameters:</div>
                <div class="param-row"><span class="param-name">&mdash;</span><span class="param-type">none</span><span class="param-comment">// scheduled job, no input &mdash; picks carts with updatedAt &lt; 24h</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">2</span> sendReminder(SendReminderRequest)</div>
                <div class="method-return">Returns: <code>void</code></div>
                <div class="params-title">Parameters (SendReminderRequest):</div>
                <div class="param-row"><span class="param-name">userId</span><span class="param-type">Long</span></div>
                <div class="param-row"><span class="param-name">cartId</span><span class="param-type">Long</span></div>
                <div class="param-row"><span class="param-name">email</span><span class="param-type">String</span></div>
                <div class="param-row"><span class="param-name">cartItems</span><span class="param-type">List&lt;CartItem&gt;</span><span class="param-comment">// email mein items dikhane ke liye</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">3</span> releaseExpiredReservations()</div>
                <div class="method-return">Returns: <code>void</code></div>
                <div class="params-title">Parameters:</div>
                <div class="param-row"><span class="param-name">&mdash;</span><span class="param-type">none</span><span class="param-comment">// scheduled job &mdash; 15 min se zyada purani reservations release karta hai</span></div>
            </div>
        </div>
    </div>
</div>

<div class="section theme-blue">
    <div class="section-title"><span class="section-num">7</span>Key Architecture</div>
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
    <div class="section-title"><span class="section-num">8</span>Design Patterns Used</div>
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
    <div class="section-title"><span class="section-num">9</span>Sequence Flow</div>
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

<div class="section theme-blue">
    <div class="section-title"><span class="section-num">10</span>Capacity Estimation</div>
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

<div class="section theme-purple">
    <div class="section-title"><span class="section-num">14</span>Interview Cheat-Sheet</div>
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
