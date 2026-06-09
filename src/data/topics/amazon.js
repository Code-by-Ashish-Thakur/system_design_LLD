export default {
  title: "Amazon / Flipkart Clone &mdash; Low Level Design",
  subtitle: "Complete LLD for Java Spring Boot Interview &mdash; Product Catalog, Search, Order Processing &amp; Delivery",
  subtitleColor: "#fff3e0",
  headerGradient: "linear-gradient(135deg,#e65100,#ef6c00,#ffb74d)",
  footerText: "Amazon / Flipkart Clone LLD",
  content: `
<!-- ============ 1. FUNCTIONAL REQUIREMENTS ============ -->
<div class="section theme-green">
    <div class="section-title"><span class="section-num">1</span>Functional Requirements</div>
    <div class="req-grid">
        <div class="req-pill"><span class="num">1</span> Product Catalog</div>
        <div class="req-pill"><span class="num">2</span> Search with Filters</div>
        <div class="req-pill"><span class="num">3</span> Product Detail Page</div>
        <div class="req-pill"><span class="num">4</span> Reviews &amp; Ratings</div>
        <div class="req-pill"><span class="num">5</span> Seller Management</div>
        <div class="req-pill"><span class="num">6</span> Inventory Management</div>
        <div class="req-pill"><span class="num">7</span> Order Management</div>
        <div class="req-pill"><span class="num">8</span> Delivery Tracking</div>
        <div class="req-pill"><span class="num">9</span> Return / Refund</div>
        <div class="req-pill"><span class="num">10</span> Wishlist</div>
    </div>
</div>

<!-- ============ 2. ENUMS ============ -->
<div class="section theme-purple">
    <div class="section-title"><span class="section-num">2</span>Enums</div>
    <div class="enum-grid">
        <div class="enum-card">
            <h3>OrderStatus</h3>
            <div class="enum-val">PLACED</div>
            <div class="enum-val">CONFIRMED</div>
            <div class="enum-val">PACKED</div>
            <div class="enum-val">SHIPPED</div>
            <div class="enum-val">OUT_FOR_DELIVERY</div>
            <div class="enum-val">DELIVERED</div>
            <div class="enum-val">CANCELLED</div>
            <div class="enum-val">RETURNED</div>
        </div>
        <div class="enum-card">
            <h3>ProductStatus</h3>
            <div class="enum-val">ACTIVE</div>
            <div class="enum-val">INACTIVE</div>
            <div class="enum-val">OUT_OF_STOCK</div>
        </div>
        <div class="enum-card">
            <h3>SellerStatus</h3>
            <div class="enum-val">PENDING_VERIFICATION</div>
            <div class="enum-val">ACTIVE</div>
            <div class="enum-val">SUSPENDED</div>
            <div class="enum-val">BLOCKED</div>
        </div>
        <div class="enum-card">
            <h3>ReturnReason</h3>
            <div class="enum-val">DEFECTIVE</div>
            <div class="enum-val">WRONG_ITEM</div>
            <div class="enum-val">SIZE_MISMATCH</div>
            <div class="enum-val">NOT_AS_DESCRIBED</div>
            <div class="enum-val">CHANGED_MIND</div>
            <div class="enum-val">DAMAGED_IN_TRANSIT</div>
        </div>
        <div class="enum-card">
            <h3>DeliveryStatus</h3>
            <div class="enum-val">PICKED_UP</div>
            <div class="enum-val">IN_TRANSIT</div>
            <div class="enum-val">AT_HUB</div>
            <div class="enum-val">OUT_FOR_DELIVERY</div>
            <div class="enum-val">DELIVERED</div>
            <div class="enum-val">FAILED_ATTEMPT</div>
            <div class="enum-val">RETURNED_TO_SELLER</div>
        </div>
    </div>
</div>

<!-- ============ 3. SERVICE LLD ============ -->
<div class="section theme-yellow">
    <div class="section-title"><span class="section-num">3</span>Service LLD</div>
    <div class="service-grid">

        <!-- ========== PRODUCT SERVICE ========== -->
        <div class="service-card">
            <h3>ProductService</h3>
            <p class="svc-desc">Product catalog ka full CRUD &mdash; seller apna product add karta hai, update karta hai, category wise fetch hota hai aur delist bhi kar sakta hai. Ye sabse core service hai Amazon/Flipkart ki.</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">ProductService</span> {

    <span class="cm">// seller naya product create karta hai with all details</span>
    <span class="tp">Product</span> <span class="fn">createProduct</span>(<span class="tp">Long</span> sellerId, <span class="tp">String</span> title, <span class="tp">String</span> description, <span class="tp">BigDecimal</span> price, <span class="tp">BigDecimal</span> mrp, <span class="tp">Long</span> categoryId, <span class="tp">String</span> brand, <span class="tp">List&lt;String&gt;</span> images, <span class="tp">Map&lt;String,String&gt;</span> attributes, <span class="tp">ProductStatus</span> status)

    <span class="cm">// product ID se ek product fetch karo</span>
    <span class="tp">Product</span> <span class="fn">getProductById</span>(<span class="tp">Long</span> productId)

    <span class="cm">// category wise paginated products laao</span>
    <span class="tp">Page&lt;Product&gt;</span> <span class="fn">getByCategory</span>(<span class="tp">Long</span> categoryId, <span class="tp">Integer</span> pageNo, <span class="tp">Integer</span> pageSize)

    <span class="cm">// existing product update karo - ownership check hota hai</span>
    <span class="tp">Product</span> <span class="fn">updateProduct</span>(<span class="tp">Long</span> productId, <span class="tp">Long</span> sellerId, <span class="tp">String</span> title, <span class="tp">String</span> description, <span class="tp">BigDecimal</span> price, <span class="tp">BigDecimal</span> mrp, <span class="tp">String</span> brand, <span class="tp">List&lt;String&gt;</span> images, <span class="tp">Map&lt;String,String&gt;</span> attributes)

    <span class="cm">// seller apna hi product delist kar sakta hai</span>
    <span class="tp">void</span> <span class="fn">delistProduct</span>(<span class="tp">Long</span> productId, <span class="tp">Long</span> sellerId)
}
</pre></div>
        </div>

        <!-- ========== SEARCH SERVICE ========== -->
        <div class="service-card">
            <h3>SearchService</h3>
            <p class="svc-desc">Elasticsearch pe product search hota hai &mdash; user keyword type karta hai, auto-suggest aata hai, filters lagaata hai aur results milte hain. Product index bhi yahi service manage karti hai.</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">SearchService</span> {

    <span class="cm">// keyword + filters + sorting se products search karo</span>
    <span class="tp">SearchResult</span> <span class="fn">search</span>(<span class="tp">String</span> query, <span class="tp">Long</span> categoryId, <span class="tp">BigDecimal</span> minPrice, <span class="tp">BigDecimal</span> maxPrice, <span class="tp">String</span> brand, <span class="tp">Double</span> minRating, <span class="tp">String</span> sortBy, <span class="tp">Integer</span> pageNo, <span class="tp">Integer</span> pageSize)

    <span class="cm">// user type kare toh auto-suggest milta hai</span>
    <span class="tp">List&lt;String&gt;</span> <span class="fn">autoSuggest</span>(<span class="tp">String</span> prefix)

    <span class="cm">// DB save ke baad Elasticsearch me product index karo</span>
    <span class="tp">void</span> <span class="fn">indexProduct</span>(<span class="tp">Product</span> product)

    <span class="cm">// product delete/delist pe index se remove karo</span>
    <span class="tp">void</span> <span class="fn">removeFromIndex</span>(<span class="tp">Long</span> productId)
}
</pre></div>
        </div>

        <!-- ========== ORDER SERVICE ========== -->
        <div class="service-card">
            <h3>OrderService</h3>
            <p class="svc-desc">Order place karna, order details dekhna, cancel karna aur status update karna &mdash; Saga pattern se inventory reserve hota hai, payment hota hai, fail hone pe compensate hota hai.</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">OrderService</span> {

    <span class="cm">// naya order place karo - inventory reserve + payment hota hai</span>
    <span class="tp">Order</span> <span class="fn">placeOrder</span>(<span class="tp">Long</span> userId, <span class="tp">List&lt;CartItem&gt;</span> items, <span class="tp">Long</span> addressId, <span class="tp">String</span> paymentMethod, <span class="tp">String</span> couponCode)

    <span class="cm">// order ID se order details fetch karo</span>
    <span class="tp">Order</span> <span class="fn">getOrder</span>(<span class="tp">String</span> orderId)

    <span class="cm">// user ke saare orders paginated laao</span>
    <span class="tp">Page&lt;Order&gt;</span> <span class="fn">getUserOrders</span>(<span class="tp">Long</span> userId, <span class="tp">Integer</span> pageNo, <span class="tp">Integer</span> pageSize)

    <span class="cm">// apna order cancel karo - verify ki owner hai</span>
    <span class="tp">void</span> <span class="fn">cancelOrder</span>(<span class="tp">String</span> orderId, <span class="tp">Long</span> userId, <span class="tp">String</span> reason)

    <span class="cm">// order status update karo - SHIPPED, DELIVERED etc</span>
    <span class="tp">void</span> <span class="fn">updateOrderStatus</span>(<span class="tp">String</span> orderId, <span class="tp">OrderStatus</span> status)
}
</pre></div>
        </div>

        <!-- ========== INVENTORY SERVICE ========== -->
        <div class="service-card">
            <h3>InventoryService</h3>
            <p class="svc-desc">Product stock track karna &mdash; availability check, checkout pe stock reserve, cancel pe release, aur confirm pe deduct. Optimistic locking se overselling nahi hota.</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">InventoryService</span> {

    <span class="cm">// product ka stock available hai ya nahi check karo</span>
    <span class="tp">boolean</span> <span class="fn">checkAvailability</span>(<span class="tp">Long</span> productId, <span class="tp">int</span> quantity, <span class="tp">Long</span> warehouseId)

    <span class="cm">// checkout pe stock reserve karo - 15 min TTL ke baad auto-release</span>
    <span class="tp">void</span> <span class="fn">reserveStock</span>(<span class="tp">Long</span> productId, <span class="tp">int</span> quantity, <span class="tp">String</span> orderId)

    <span class="cm">// cancel ya timeout pe reserved stock release karo</span>
    <span class="tp">void</span> <span class="fn">releaseStock</span>(<span class="tp">Long</span> productId, <span class="tp">int</span> quantity, <span class="tp">String</span> orderId)

    <span class="cm">// payment confirm hone ke baad final stock deduct karo</span>
    <span class="tp">void</span> <span class="fn">deductStock</span>(<span class="tp">Long</span> productId, <span class="tp">int</span> quantity)

    <span class="cm">// specific warehouse ka available stock check karo</span>
    <span class="tp">int</span> <span class="fn">getAvailableStock</span>(<span class="tp">Long</span> productId, <span class="tp">Long</span> warehouseId)
}
</pre></div>
        </div>

        <!-- ========== SELLER SERVICE ========== -->
        <div class="service-card">
            <h3>SellerService</h3>
            <p class="svc-desc">Seller registration, GSTIN verify, suspend/block karna aur seller dashboard &mdash; naya seller register hota hai, admin verify karta hai, policy violation pe suspend hota hai.</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">SellerService</span> {

    <span class="cm">// naya seller register karo with business details</span>
    <span class="tp">Seller</span> <span class="fn">registerSeller</span>(<span class="tp">String</span> businessName, <span class="tp">String</span> gstin, <span class="tp">String</span> email, <span class="tp">String</span> phone, <span class="tp">List&lt;Long&gt;</span> warehouseIds)

    <span class="cm">// seller ID se seller details fetch karo</span>
    <span class="tp">Seller</span> <span class="fn">getSellerById</span>(<span class="tp">Long</span> sellerId)

    <span class="cm">// admin GSTIN aur docs verify karke seller approve karta hai</span>
    <span class="tp">void</span> <span class="fn">verifySeller</span>(<span class="tp">Long</span> sellerId)

    <span class="cm">// policy violation pe seller ko suspend karo</span>
    <span class="tp">void</span> <span class="fn">suspendSeller</span>(<span class="tp">Long</span> sellerId, <span class="tp">String</span> reason)

    <span class="cm">// seller ka dashboard - sales, orders, ratings, revenue</span>
    <span class="tp">SellerDashboard</span> <span class="fn">getDashboard</span>(<span class="tp">Long</span> sellerId)
}
</pre></div>
        </div>

        <!-- ========== DELIVERY SERVICE ========== -->
        <div class="service-card">
            <h3>DeliveryService</h3>
            <p class="svc-desc">Delivery assign karna, live tracking, status update aur delivered mark karna &mdash; State Machine se valid transitions enforce hote hain (e.g. DELIVERED ke baad IN_TRANSIT nahi ho sakta).</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">DeliveryService</span> {

    <span class="cm">// order ko nearest warehouse se delivery assign karo</span>
    <span class="tp">DeliveryTracking</span> <span class="fn">assignDelivery</span>(<span class="tp">Long</span> orderId, <span class="tp">Long</span> warehouseId)

    <span class="cm">// tracking number se delivery status track karo</span>
    <span class="tp">DeliveryTracking</span> <span class="fn">trackDelivery</span>(<span class="tp">String</span> trackingNumber)

    <span class="cm">// delivery status update karo - state machine validate karta hai</span>
    <span class="tp">void</span> <span class="fn">updateDeliveryStatus</span>(<span class="tp">String</span> trackingNumber, <span class="tp">DeliveryStatus</span> status, <span class="tp">String</span> location)

    <span class="cm">// delivery boy OTP verify karke delivered mark karo</span>
    <span class="tp">void</span> <span class="fn">markDelivered</span>(<span class="tp">String</span> trackingNumber)
}
</pre></div>
        </div>

        <!-- ========== REVIEW SERVICE ========== -->
        <div class="service-card">
            <h3>ReviewService</h3>
            <p class="svc-desc">Product reviews aur ratings manage karna &mdash; sirf verified purchase wale hi review de sakte hain. Average rating auto-update hota hai product pe. Helpful mark bhi kar sakte ho.</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">ReviewService</span> {

    <span class="cm">// verified purchase check ke baad review add karo</span>
    <span class="tp">Review</span> <span class="fn">addReview</span>(<span class="tp">Long</span> productId, <span class="tp">Long</span> userId, <span class="tp">Integer</span> rating, <span class="tp">String</span> title, <span class="tp">String</span> body, <span class="tp">List&lt;String&gt;</span> images)

    <span class="cm">// product ke saare reviews paginated laao</span>
    <span class="tp">Page&lt;Review&gt;</span> <span class="fn">getReviews</span>(<span class="tp">Long</span> productId, <span class="tp">Integer</span> pageNo, <span class="tp">Integer</span> pageSize)

    <span class="cm">// average rating + star-wise breakdown fetch karo</span>
    <span class="tp">RatingAggregation</span> <span class="fn">getRatingAggregation</span>(<span class="tp">Long</span> productId)

    <span class="cm">// ek user ek review pe sirf ek baar helpful mark kar sakta</span>
    <span class="tp">void</span> <span class="fn">markHelpful</span>(<span class="tp">Long</span> reviewId, <span class="tp">Long</span> userId)
}
</pre></div>
        </div>

        <!-- ========== WISHLIST SERVICE ========== -->
        <div class="service-card">
            <h3>WishlistService</h3>
            <p class="svc-desc">User apne pasand ke products save kar sakta hai baad me khareedne ke liye &mdash; add, remove aur full wishlist fetch karna.</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">WishlistService</span> {

    <span class="cm">// product ko wishlist me add karo</span>
    <span class="tp">void</span> <span class="fn">addToWishlist</span>(<span class="tp">Long</span> userId, <span class="tp">Long</span> productId)

    <span class="cm">// wishlist se product remove karo</span>
    <span class="tp">void</span> <span class="fn">removeFromWishlist</span>(<span class="tp">Long</span> userId, <span class="tp">Long</span> productId)

    <span class="cm">// user ke saare saved products ki list laao</span>
    <span class="tp">List&lt;Product&gt;</span> <span class="fn">getWishlist</span>(<span class="tp">Long</span> userId)
}
</pre></div>
        </div>

        <!-- ========== RETURN SERVICE ========== -->
        <div class="service-card">
            <h3>ReturnService</h3>
            <p class="svc-desc">Return aur refund handle karna &mdash; customer return request raise karta hai, admin approve karta hai, refund process hota hai. Wrong item ya defective pe auto-approve bhi hota hai.</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">ReturnService</span> {

    <span class="cm">// customer return request raise karta hai with reason</span>
    <span class="tp">Return</span> <span class="fn">initiateReturn</span>(<span class="tp">Long</span> orderId, <span class="tp">Long</span> orderItemId, <span class="tp">Long</span> userId, <span class="tp">ReturnReason</span> reason, <span class="tp">String</span> description, <span class="tp">List&lt;String&gt;</span> images)

    <span class="cm">// admin approve karega, refund trigger hoga</span>
    <span class="tp">void</span> <span class="fn">approveReturn</span>(<span class="tp">Long</span> returnId)

    <span class="cm">// refund process karo - original payment ya wallet me</span>
    <span class="tp">void</span> <span class="fn">processRefund</span>(<span class="tp">Long</span> returnId, <span class="tp">BigDecimal</span> refundAmount, <span class="tp">String</span> refundMode)
}
</pre></div>
        </div>

    </div>
</div>

<!-- ============ 5. DB SCHEMA ============ -->
<div class="section theme-pink">
    <div class="section-title"><span class="section-num">4</span>Database Schema</div>

    <div class="sub-heading" style="color:#ff80ab;border-color:#ff80ab">Database Technology Stack</div>
    <div class="dbtech-grid">
        <div class="dbtech-card">
            <div class="dbtech-name">PostgreSQL <span class="dbtech-type">RDBMS</span></div>
            <div class="dbtech-usage">Products, orders, users, sellers, inventory &mdash; ACID transactions for e-commerce data</div>
            <div class="dbtech-tables"><span>products</span><span>orders</span><span>users</span><span>sellers</span><span>inventory</span></div>
        </div>
        <div class="dbtech-card">
            <div class="dbtech-name">Redis <span class="dbtech-type">In-Memory</span></div>
            <div class="dbtech-usage">Cart sessions, stock availability cache, product detail cache</div>
            <div class="dbtech-tables"><span>cart:{userId}</span><span>stock:{productId}</span></div>
        </div>
        <div class="dbtech-card">
            <div class="dbtech-name">Elasticsearch <span class="dbtech-type">Search Engine</span></div>
            <div class="dbtech-usage">Product search with auto-suggest, filters, faceted search</div>
            <div class="dbtech-tables"><span>products</span><span>categories</span></div>
        </div>
        <div class="dbtech-card">
            <div class="dbtech-name">Kafka <span class="dbtech-type">Message Queue</span></div>
            <div class="dbtech-usage">Order processing pipeline &mdash; order-placed &rarr; inventory-reserved &rarr; payment &rarr; confirmed</div>
            <div class="dbtech-tables"><span>order-placed</span><span>order-confirmed</span></div>
        </div>
        <div class="dbtech-card">
            <div class="dbtech-name">S3 <span class="dbtech-type">Blob Storage</span></div>
            <div class="dbtech-usage">Product images, seller documents, invoice PDFs</div>
            <div class="dbtech-tables"><span>product-images</span><span>documents</span></div>
        </div>
    </div>

    <div class="db-grid">
        <div class="db-table">
            <h3>products</h3>
            <ul>
                <li><span class="pk">id BIGINT PK</span></li>
                <li>title VARCHAR(255) <span class="idx">[FULLTEXT]</span></li>
                <li>description TEXT <span class="idx">[FULLTEXT]</span></li>
                <li>price DECIMAL(10,2)</li>
                <li>mrp DECIMAL(10,2)</li>
                <li><span class="fk">category_id BIGINT FK</span> <span class="idx">[INDEX]</span></li>
                <li><span class="fk">seller_id BIGINT FK</span> <span class="idx">[INDEX]</span></li>
                <li>brand VARCHAR(100) <span class="idx">[INDEX]</span></li>
                <li>images JSON</li>
                <li>attributes JSON</li>
                <li>avg_rating DECIMAL(2,1)</li>
                <li>total_reviews INT</li>
                <li>status ENUM <span class="idx">[INDEX]</span></li>
                <li>created_at TIMESTAMP</li>
            </ul>
        </div>
        <div class="db-table">
            <h3>categories</h3>
            <ul>
                <li><span class="pk">id BIGINT PK</span></li>
                <li>name VARCHAR(100)</li>
                <li><span class="fk">parent_id BIGINT FK (self)</span> <span class="idx">[INDEX]</span></li>
                <li>level INT</li>
                <li>slug VARCHAR(100) <span class="idx">[UNIQUE]</span></li>
                <li>attributes JSON</li>
            </ul>
        </div>
        <div class="db-table">
            <h3>inventory</h3>
            <ul>
                <li><span class="pk">id BIGINT PK</span></li>
                <li><span class="fk">product_id BIGINT FK</span> <span class="idx">[INDEX]</span></li>
                <li><span class="fk">seller_id BIGINT FK</span></li>
                <li><span class="fk">warehouse_id BIGINT FK</span> <span class="idx">[INDEX]</span></li>
                <li>total_stock INT</li>
                <li>reserved_stock INT</li>
                <li>available_stock INT</li>
                <li>version BIGINT <span class="idx">[OPTIMISTIC LOCK]</span></li>
            </ul>
        </div>
        <div class="db-table">
            <h3>orders</h3>
            <ul>
                <li><span class="pk">id BIGINT PK</span></li>
                <li>order_id VARCHAR(36) <span class="idx">[UNIQUE]</span></li>
                <li><span class="fk">user_id BIGINT FK</span> <span class="idx">[INDEX]</span></li>
                <li>total_amount DECIMAL(12,2)</li>
                <li>discount DECIMAL(10,2)</li>
                <li><span class="fk">shipping_address_id BIGINT FK</span></li>
                <li>payment_id VARCHAR(100)</li>
                <li>status ENUM <span class="idx">[INDEX]</span></li>
                <li>created_at TIMESTAMP <span class="idx">[INDEX]</span></li>
                <li>updated_at TIMESTAMP</li>
            </ul>
        </div>
        <div class="db-table">
            <h3>order_items</h3>
            <ul>
                <li><span class="pk">id BIGINT PK</span></li>
                <li><span class="fk">order_id BIGINT FK</span> <span class="idx">[INDEX]</span></li>
                <li><span class="fk">product_id BIGINT FK</span></li>
                <li><span class="fk">seller_id BIGINT FK</span></li>
                <li>quantity INT</li>
                <li>unit_price DECIMAL(10,2)</li>
                <li>total_price DECIMAL(10,2)</li>
                <li>status ENUM</li>
            </ul>
        </div>
        <div class="db-table">
            <h3>reviews</h3>
            <ul>
                <li><span class="pk">id BIGINT PK</span></li>
                <li><span class="fk">product_id BIGINT FK</span> <span class="idx">[INDEX]</span></li>
                <li><span class="fk">user_id BIGINT FK</span></li>
                <li>rating TINYINT <span class="idx">[INDEX]</span></li>
                <li>title VARCHAR(200)</li>
                <li>body TEXT</li>
                <li>images JSON</li>
                <li>verified BOOLEAN</li>
                <li>helpful_count INT</li>
                <li>created_at TIMESTAMP</li>
            </ul>
        </div>
        <div class="db-table">
            <h3>sellers</h3>
            <ul>
                <li><span class="pk">id BIGINT PK</span></li>
                <li>business_name VARCHAR(200)</li>
                <li>gstin VARCHAR(15) <span class="idx">[UNIQUE]</span></li>
                <li>email VARCHAR(100)</li>
                <li>phone VARCHAR(15)</li>
                <li>rating DECIMAL(2,1)</li>
                <li>status ENUM <span class="idx">[INDEX]</span></li>
                <li>created_at TIMESTAMP</li>
            </ul>
        </div>
    </div>
</div>

<!-- ============ 6. APIs ============ -->
<div class="section theme-teal">
    <div class="section-title"><span class="section-num">5</span>REST API Endpoints</div>
    <div class="api-grid">
        <div class="api-card">
            <div class="api-header"><span class="api-method method-get">GET</span><span class="api-path">/api/v1/products/search?q={query}&amp;category={id}&amp;minPrice={}&amp;maxPrice={}&amp;sort={}&amp;page={}&amp;size={}</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Query Parameters</div><span class="key">q</span>: <span class="val">"wireless headphones"</span><br><span class="key">category</span>: <span class="val">42</span><br><span class="key">minPrice</span>: <span class="val">500</span><br><span class="key">maxPrice</span>: <span class="val">5000</span><br><span class="key">sort</span>: <span class="val">"price_asc | relevance | popularity"</span><br><span class="key">page</span>: <span class="val">0</span><br><span class="key">size</span>: <span class="val">20</span></div>
                <div class="api-json"><div class="label">Response</div>{ <span class="key">"products"</span>: [{ <span class="key">"id"</span>: <span class="val">1</span>, <span class="key">"title"</span>: <span class="val">"..."</span>, <span class="key">"price"</span>: <span class="val">1299</span>, <span class="key">"avgRating"</span>: <span class="val">4.3</span> }], <span class="key">"totalResults"</span>: <span class="val">1542</span>, <span class="key">"facets"</span>: { ... } }</div>
            </div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-get">GET</span><span class="api-path">/api/v1/products/{productId}</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Path Param</div><span class="key">productId</span>: <span class="val">12345</span></div>
                <div class="api-json"><div class="label">Response</div>{ <span class="key">"id"</span>: <span class="val">12345</span>, <span class="key">"title"</span>: <span class="val">"..."</span>, <span class="key">"price"</span>: <span class="val">1299</span>, <span class="key">"seller"</span>: { ... }, <span class="key">"reviews"</span>: { ... }, <span class="key">"inventory"</span>: { <span class="key">"available"</span>: <span class="val">true</span> } }</div>
            </div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-post">POST</span><span class="api-path">/api/v1/orders</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Request Body</div>{ <span class="key">"items"</span>: [{ <span class="key">"productId"</span>: <span class="val">12345</span>, <span class="key">"qty"</span>: <span class="val">2</span> }], <span class="key">"addressId"</span>: <span class="val">5</span>, <span class="key">"paymentMethod"</span>: <span class="val">"UPI"</span> }</div>
                <div class="api-json"><div class="label">Response</div>{ <span class="key">"orderId"</span>: <span class="val">"ORD-abc123"</span>, <span class="key">"status"</span>: <span class="val">"CONFIRMED"</span>, <span class="key">"total"</span>: <span class="val">2598</span>, <span class="key">"estimatedDelivery"</span>: <span class="val">"2026-06-07"</span> }</div>
            </div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-get">GET</span><span class="api-path">/api/v1/delivery/{trackingNumber}</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Path Param</div><span class="key">trackingNumber</span>: <span class="val">"TRK-xyz789"</span></div>
                <div class="api-json"><div class="label">Response</div>{ <span class="key">"trackingNumber"</span>: <span class="val">"TRK-xyz789"</span>, <span class="key">"status"</span>: <span class="val">"IN_TRANSIT"</span>, <span class="key">"currentLocation"</span>: <span class="val">"Mumbai Hub"</span>, <span class="key">"events"</span>: [...] }</div>
            </div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-post">POST</span><span class="api-path">/api/v1/products/{productId}/reviews</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Request Body</div>{ <span class="key">"rating"</span>: <span class="val">5</span>, <span class="key">"title"</span>: <span class="val">"Excellent!"</span>, <span class="key">"body"</span>: <span class="val">"Great product, fast delivery"</span>, <span class="key">"images"</span>: [<span class="val">"img1.jpg"</span>] }</div>
                <div class="api-json"><div class="label">Response</div>{ <span class="key">"reviewId"</span>: <span class="val">42</span>, <span class="key">"verified"</span>: <span class="val">true</span>, <span class="key">"status"</span>: <span class="val">"PUBLISHED"</span> }</div>
            </div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-post">POST</span><span class="api-path">/api/v1/sellers</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Request Body</div>{ <span class="key">"businessName"</span>: <span class="val">"TechStore"</span>, <span class="key">"gstin"</span>: <span class="val">"22AAAAA0000A1Z5"</span>, <span class="key">"email"</span>: <span class="val">"seller@tech.com"</span> }</div>
                <div class="api-json"><div class="label">Response</div>{ <span class="key">"sellerId"</span>: <span class="val">101</span>, <span class="key">"status"</span>: <span class="val">"PENDING_VERIFICATION"</span> }</div>
            </div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-put">PUT</span><span class="api-path">/api/v1/sellers/{sellerId}</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Request Body</div>{ <span class="key">"businessName"</span>: <span class="val">"TechStore Pro"</span>, <span class="key">"phone"</span>: <span class="val">"+91-9876543210"</span> }</div>
                <div class="api-json"><div class="label">Response</div>{ <span class="key">"sellerId"</span>: <span class="val">101</span>, <span class="key">"status"</span>: <span class="val">"ACTIVE"</span>, <span class="key">"updated"</span>: <span class="val">true</span> }</div>
            </div>
        </div>
    </div>
</div>

<!-- ============ 7. KEY ARCHITECTURE ============ -->
<div class="section theme-red">
    <div class="section-title"><span class="section-num">6</span>Key Architecture Components</div>

    <div class="sub-heading" style="color:#ff5252;border-color:#ff5252">Search Engine &mdash; Elasticsearch</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Elasticsearch Integration</span></div><pre class="code-block">
<span class="cm">// Product Index Mapping</span>
{
  <span class="st">"mappings"</span>: {
    <span class="st">"properties"</span>: {
      <span class="st">"title"</span>:       { <span class="st">"type"</span>: <span class="st">"text"</span>, <span class="st">"analyzer"</span>: <span class="st">"standard"</span> },
      <span class="st">"description"</span>: { <span class="st">"type"</span>: <span class="st">"text"</span> },
      <span class="st">"brand"</span>:       { <span class="st">"type"</span>: <span class="st">"keyword"</span> },
      <span class="st">"categoryId"</span>: { <span class="st">"type"</span>: <span class="st">"long"</span> },
      <span class="st">"price"</span>:       { <span class="st">"type"</span>: <span class="st">"double"</span> },
      <span class="st">"avgRating"</span>:   { <span class="st">"type"</span>: <span class="st">"float"</span> },
      <span class="st">"status"</span>:      { <span class="st">"type"</span>: <span class="st">"keyword"</span> },
      <span class="st">"sellerId"</span>:    { <span class="st">"type"</span>: <span class="st">"long"</span> }
    }
  }
}

<span class="cm">// Dual-write: DB + Elasticsearch via @TransactionalEventListener</span>
<span class="ann">@TransactionalEventListener</span>
<span class="kw">public void</span> <span class="fn">onProductSaved</span>(ProductSavedEvent event) {
    searchService.indexProduct(event.getProduct());
}
    </pre></div>

    <div class="sub-heading" style="color:#ff5252;border-color:#ff5252">Inventory Management &mdash; Warehouse-Level Stock</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Warehouse Inventory</span></div><pre class="code-block">
<span class="cm">// Each product tracked per warehouse per seller</span>
<span class="cm">// Optimistic locking with @Version prevents overselling</span>
<span class="cm">// Redis used for fast availability checks (cache-aside)</span>

<span class="ann">@Cacheable</span>(value = <span class="st">"inventory"</span>, key = <span class="st">"#productId"</span>)
<span class="kw">public int</span> <span class="fn">getAvailableStock</span>(Long productId, Long warehouseId) {
    <span class="kw">return</span> inventoryRepo.findByProductIdAndWarehouseId(productId, warehouseId)
        .map(Inventory::getAvailableStock).orElse(0);
}

<span class="ann">@CacheEvict</span>(value = <span class="st">"inventory"</span>, key = <span class="st">"#productId"</span>)
<span class="kw">public void</span> <span class="fn">reserveStock</span>(Long productId, <span class="tp">int</span> qty, String orderId) {
    <span class="cm">// ... reservation logic with optimistic lock</span>
}
    </pre></div>

    <div class="sub-heading" style="color:#ff5252;border-color:#ff5252">Order Processing Pipeline</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Order Pipeline (Kafka)</span></div><pre class="code-block">
<span class="cm">// Kafka topics for async order processing</span>
<span class="cm">// order-placed  &rarr;  inventory-reserved  &rarr;  payment-processed  &rarr;  order-confirmed</span>

<span class="ann">@KafkaListener</span>(topics = <span class="st">"order-placed"</span>)
<span class="kw">public void</span> <span class="fn">handleOrderPlaced</span>(OrderPlacedEvent event) {
    <span class="cm">// Reserve inventory, trigger payment, send confirmation</span>
    inventoryService.reserveStock(event.getProductId(), event.getQty(), event.getOrderId());
    kafkaTemplate.send(<span class="st">"inventory-reserved"</span>, event);
}

<span class="ann">@KafkaListener</span>(topics = <span class="st">"order-confirmed"</span>)
<span class="kw">public void</span> <span class="fn">handleOrderConfirmed</span>(OrderConfirmedEvent event) {
    <span class="cm">// Notify seller, assign warehouse, schedule pickup</span>
    notificationService.notifySeller(event.getSellerId(), event.getOrderId());
    deliveryService.assignDelivery(event.getOrderId(), event.getWarehouseId());
}
    </pre></div>

    <div class="sub-heading" style="color:#ff5252;border-color:#ff5252">Delivery Tracking System</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Delivery State Machine</span></div><pre class="code-block">
<span class="cm">// State machine enforces valid delivery transitions</span>
<span class="cm">// PICKED_UP &rarr; IN_TRANSIT &rarr; AT_HUB &rarr; OUT_FOR_DELIVERY &rarr; DELIVERED</span>
<span class="cm">//                                    &rarr; FAILED_ATTEMPT &rarr; RETURNED_TO_SELLER</span>

<span class="kw">class</span> <span class="cn">DeliveryStateMachine</span> {
    <span class="kw">private static final</span> Map&lt;DeliveryStatus, Set&lt;DeliveryStatus&gt;&gt; TRANSITIONS = Map.of(
        PICKED_UP,         Set.of(IN_TRANSIT),
        IN_TRANSIT,        Set.of(AT_HUB, OUT_FOR_DELIVERY),
        AT_HUB,            Set.of(OUT_FOR_DELIVERY),
        OUT_FOR_DELIVERY,  Set.of(DELIVERED, FAILED_ATTEMPT),
        FAILED_ATTEMPT,    Set.of(OUT_FOR_DELIVERY, RETURNED_TO_SELLER)
    );

    <span class="kw">public void</span> <span class="fn">transition</span>(DeliveryTracking tracking, DeliveryStatus newStatus) {
        Set&lt;DeliveryStatus&gt; allowed = TRANSITIONS.get(tracking.getStatus());
        <span class="kw">if</span> (allowed == <span class="kw">null</span> || !allowed.contains(newStatus))
            <span class="kw">throw new</span> InvalidStateTransitionException(tracking.getStatus(), newStatus);
        tracking.setStatus(newStatus);
    }
}
    </pre></div>
</div>

<!-- ============ 8. DESIGN PATTERNS ============ -->
<div class="section theme-cyan">
    <div class="section-title"><span class="section-num">7</span>Design Patterns (with Code)</div>

    <div class="sub-heading" style="color:#18ffff;border-color:#18ffff">Strategy Pattern &mdash; Search Ranking</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">SearchRankingStrategy.java</span></div><pre class="code-block">
<span class="kw">interface</span> <span class="iface">SearchRankingStrategy</span> {
    SortBuilder <span class="fn">buildSort</span>(String sortBy);
}

<span class="kw">class</span> <span class="cn">RelevanceRankingStrategy</span> <span class="kw">implements</span> <span class="iface">SearchRankingStrategy</span> {
    <span class="ann">@Override</span>
    <span class="kw">public</span> SortBuilder <span class="fn">buildSort</span>(String sortBy) {
        <span class="kw">return</span> SortBuilders.scoreSort().order(SortOrder.DESC);  <span class="cm">// TF-IDF score</span>
    }
}

<span class="kw">class</span> <span class="cn">PopularityRankingStrategy</span> <span class="kw">implements</span> <span class="iface">SearchRankingStrategy</span> {
    <span class="ann">@Override</span>
    <span class="kw">public</span> SortBuilder <span class="fn">buildSort</span>(String sortBy) {
        <span class="kw">return</span> SortBuilders.fieldSort(<span class="st">"totalReviews"</span>).order(SortOrder.DESC);
    }
}

<span class="kw">class</span> <span class="cn">PriceRankingStrategy</span> <span class="kw">implements</span> <span class="iface">SearchRankingStrategy</span> {
    <span class="ann">@Override</span>
    <span class="kw">public</span> SortBuilder <span class="fn">buildSort</span>(String sortBy) {
        SortOrder order = sortBy.equals(<span class="st">"price_desc"</span>) ? SortOrder.DESC : SortOrder.ASC;
        <span class="kw">return</span> SortBuilders.fieldSort(<span class="st">"price"</span>).order(order);
    }
}

<span class="cm">// Factory to resolve strategy at runtime</span>
<span class="ann">@Component</span>
<span class="kw">class</span> <span class="cn">RankingStrategyFactory</span> {
    <span class="kw">public</span> SearchRankingStrategy <span class="fn">getStrategy</span>(String sortBy) {
        <span class="kw">return switch</span> (sortBy) {
            <span class="kw">case</span> <span class="st">"popularity"</span> -&gt; <span class="kw">new</span> PopularityRankingStrategy();
            <span class="kw">case</span> <span class="st">"price_asc"</span>, <span class="st">"price_desc"</span> -&gt; <span class="kw">new</span> PriceRankingStrategy();
            <span class="kw">default</span> -&gt; <span class="kw">new</span> RelevanceRankingStrategy();
        };
    }
}
    </pre></div>

    <div class="sub-heading" style="color:#18ffff;border-color:#18ffff">Factory Pattern &mdash; Order Creation</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">OrderFactory.java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">OrderFactory</span> {

    <span class="kw">public static</span> Order <span class="fn">create</span>(String orderId, Long userId,
                                  List&lt;CartItem&gt; items, Long addressId) {
        Order order = <span class="kw">new</span> Order();
        order.setOrderId(orderId);
        order.setUserId(userId);
        order.setShippingAddressId(addressId);
        order.setStatus(OrderStatus.PLACED);
        order.setCreatedAt(LocalDateTime.now());

        BigDecimal total = BigDecimal.ZERO;
        List&lt;OrderItem&gt; orderItems = <span class="kw">new</span> ArrayList&lt;&gt;();

        <span class="kw">for</span> (CartItem item : items) {
            OrderItem oi = <span class="kw">new</span> OrderItem();
            oi.setProductId(item.getProductId());
            oi.setSellerId(item.getSellerId());
            oi.setQuantity(item.getQty());
            oi.setUnitPrice(item.getPrice());
            oi.setTotalPrice(item.getPrice().multiply(BigDecimal.valueOf(item.getQty())));
            oi.setStatus(OrderStatus.PLACED);
            orderItems.add(oi);
            total = total.add(oi.getTotalPrice());
        }

        order.setItems(orderItems);
        order.setTotalAmount(total);
        <span class="kw">return</span> order;
    }
}
    </pre></div>

    <div class="sub-heading" style="color:#18ffff;border-color:#18ffff">Observer Pattern &mdash; Order Status Updates</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">OrderEventListeners.java</span></div><pre class="code-block">
<span class="cm">// Spring ApplicationEvent for order lifecycle</span>
<span class="kw">class</span> <span class="cn">OrderPlacedEvent</span> <span class="kw">extends</span> <span class="tp">ApplicationEvent</span> {
    <span class="kw">private final</span> Order order;
    <span class="kw">public</span> <span class="fn">OrderPlacedEvent</span>(Order order) { <span class="kw">super</span>(order); <span class="kw">this</span>.order = order; }
}

<span class="ann">@Component</span>
<span class="kw">class</span> <span class="cn">InventoryListener</span> {
    <span class="ann">@EventListener</span>
    <span class="kw">public void</span> <span class="fn">onOrderPlaced</span>(OrderPlacedEvent event) {
        <span class="cm">// Deduct reserved stock after payment confirmation</span>
        event.getOrder().getItems().forEach(item -&gt;
            inventoryService.deductStock(item.getProductId(), item.getQuantity()));
    }
}

<span class="ann">@Component</span>
<span class="kw">class</span> <span class="cn">NotificationListener</span> {
    <span class="ann">@EventListener</span>
    <span class="kw">public void</span> <span class="fn">onOrderPlaced</span>(OrderPlacedEvent event) {
        <span class="cm">// Send order confirmation email/SMS to customer</span>
        notificationService.send(event.getOrder().getUserId(),
            <span class="st">"Order Confirmed"</span>, <span class="st">"Your order "</span> + event.getOrder().getOrderId() + <span class="st">" is confirmed!"</span>);
    }
}

<span class="ann">@Component</span>
<span class="kw">class</span> <span class="cn">SellerNotificationListener</span> {
    <span class="ann">@EventListener</span>
    <span class="kw">public void</span> <span class="fn">onOrderPlaced</span>(OrderPlacedEvent event) {
        <span class="cm">// Notify sellers to start packing</span>
        event.getOrder().getItems().stream()
            .map(OrderItem::getSellerId).distinct()
            .forEach(sellerId -&gt; sellerNotificationService.notifyNewOrder(sellerId, event.getOrder()));
    }
}
    </pre></div>

    <div class="sub-heading" style="color:#18ffff;border-color:#18ffff">State Pattern &mdash; Delivery Lifecycle</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">DeliveryState.java</span></div><pre class="code-block">
<span class="kw">interface</span> <span class="iface">DeliveryState</span> {
    <span class="tp">void</span> <span class="fn">next</span>(DeliveryTracking tracking);
    <span class="tp">void</span> <span class="fn">fail</span>(DeliveryTracking tracking);
    String <span class="fn">getStatusLabel</span>();
}

<span class="kw">class</span> <span class="cn">InTransitState</span> <span class="kw">implements</span> <span class="iface">DeliveryState</span> {
    <span class="ann">@Override</span>
    <span class="kw">public void</span> <span class="fn">next</span>(DeliveryTracking tracking) {
        tracking.setStatus(DeliveryStatus.AT_HUB);
        tracking.setState(<span class="kw">new</span> AtHubState());
    }
    <span class="ann">@Override</span>
    <span class="kw">public void</span> <span class="fn">fail</span>(DeliveryTracking tracking) {
        tracking.setStatus(DeliveryStatus.RETURNED_TO_SELLER);
    }
    <span class="ann">@Override</span>
    <span class="kw">public</span> String <span class="fn">getStatusLabel</span>() { <span class="kw">return</span> <span class="st">"Package is in transit"</span>; }
}

<span class="kw">class</span> <span class="cn">OutForDeliveryState</span> <span class="kw">implements</span> <span class="iface">DeliveryState</span> {
    <span class="ann">@Override</span>
    <span class="kw">public void</span> <span class="fn">next</span>(DeliveryTracking tracking) {
        tracking.setStatus(DeliveryStatus.DELIVERED);
        tracking.setDeliveredAt(LocalDateTime.now());
    }
    <span class="ann">@Override</span>
    <span class="kw">public void</span> <span class="fn">fail</span>(DeliveryTracking tracking) {
        tracking.setStatus(DeliveryStatus.FAILED_ATTEMPT);
        tracking.setState(<span class="kw">new</span> FailedAttemptState());
    }
    <span class="ann">@Override</span>
    <span class="kw">public</span> String <span class="fn">getStatusLabel</span>() { <span class="kw">return</span> <span class="st">"Out for delivery"</span>; }
}
    </pre></div>

    <div class="sub-heading" style="color:#18ffff;border-color:#18ffff">CQRS &mdash; Read-Heavy Product Catalog</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">CQRS Architecture</span></div><pre class="code-block">
<span class="cm">// Command side: writes go to PostgreSQL (source of truth)</span>
<span class="ann">@Service</span>
<span class="kw">class</span> <span class="cn">ProductCommandService</span> {
    <span class="kw">private final</span> <span class="tp">ProductRepository</span> productRepo;
    <span class="kw">private final</span> <span class="tp">ApplicationEventPublisher</span> eventPublisher;

    <span class="kw">public</span> Product <span class="fn">createProduct</span>(ProductRequest req) {
        Product product = productRepo.save(mapToEntity(req));
        eventPublisher.publishEvent(<span class="kw">new</span> ProductSavedEvent(product)); <span class="cm">// sync to read side</span>
        <span class="kw">return</span> product;
    }
}

<span class="cm">// Query side: reads go to Elasticsearch + Redis cache</span>
<span class="ann">@Service</span>
<span class="kw">class</span> <span class="cn">ProductQueryService</span> {
    <span class="kw">private final</span> <span class="tp">RestHighLevelClient</span> esClient;
    <span class="kw">private final</span> <span class="tp">RedisTemplate</span> redisTemplate;

    <span class="ann">@Cacheable</span>(<span class="st">"product-detail"</span>)
    <span class="kw">public</span> ProductDetailDTO <span class="fn">getProductDetail</span>(Long productId) {
        <span class="cm">// Read from Elasticsearch for rich product data</span>
        <span class="kw">return</span> esClient.get(...);
    }

    <span class="kw">public</span> SearchResult <span class="fn">search</span>(String query, SearchFilters filters) {
        <span class="cm">// Full-text search on Elasticsearch read replica</span>
        <span class="kw">return</span> esClient.search(...);
    }
}

<span class="cm">// Write: PostgreSQL  |  Read: Elasticsearch + Redis</span>
<span class="cm">// Sync: @TransactionalEventListener or Kafka CDC</span>
    </pre></div>

    <div class="pattern-grid" style="margin-top:20px">
        <div class="pattern-card">
            <div class="pattern-name">Strategy</div>
            <div class="pattern-use">Search ranking algorithms (relevance, price, popularity) &mdash; swap at runtime</div>
        </div>
        <div class="pattern-card">
            <div class="pattern-name">Factory</div>
            <div class="pattern-use">Order creation from cart items &mdash; encapsulates complex construction logic</div>
        </div>
        <div class="pattern-card">
            <div class="pattern-name">Observer</div>
            <div class="pattern-use">Order lifecycle events trigger inventory, notification, and seller updates</div>
        </div>
        <div class="pattern-card">
            <div class="pattern-name">State</div>
            <div class="pattern-use">Delivery tracking lifecycle &mdash; enforces valid state transitions</div>
        </div>
        <div class="pattern-card">
            <div class="pattern-name">CQRS</div>
            <div class="pattern-use">Separate read (Elasticsearch) and write (PostgreSQL) for product catalog</div>
        </div>
    </div>
</div>

<!-- ============ 9. SEQUENCE FLOW ============ -->
<div class="section theme-lime">
    <div class="section-title"><span class="section-num">8</span>Sequence Flow &mdash; Search to Delivery</div>
    <div class="flow-container">
        <div class="flow-box flow-green">User Searches for Product</div>
        <div class="flow-arrow arrow-green"></div>
        <div class="flow-box flow-blue">Elasticsearch Returns Results</div>
        <div class="flow-arrow arrow-blue"></div>
        <div class="flow-box flow-purple">User Views Product Detail Page</div>
        <div class="flow-arrow arrow-purple"></div>
        <div class="flow-box flow-teal">Add to Cart</div>
        <div class="flow-arrow arrow-teal"></div>
        <div class="flow-box flow-orange">Checkout &amp; Select Address</div>
        <div class="flow-arrow arrow-orange"></div>
        <div class="flow-box flow-yellow">Payment Processing (UPI/Card/COD)</div>
        <div class="flow-arrow arrow-orange"></div>
        <div class="flow-box flow-green">Inventory Reserved + Order Created</div>
        <div class="flow-arrow arrow-green"></div>
        <div class="flow-box flow-blue">Seller Notified &rarr; Warehouse Pick &amp; Pack</div>
        <div class="flow-arrow arrow-blue"></div>
        <div class="flow-box flow-purple">Shipped &rarr; In Transit &rarr; At Hub</div>
        <div class="flow-arrow arrow-purple"></div>
        <div class="flow-box flow-teal">Out for Delivery &rarr; Delivered</div>
    </div>
</div>

<!-- ============ 10. CAPACITY ESTIMATION ============ -->
<div class="section theme-deepblue">
    <div class="section-title"><span class="section-num">9</span>Capacity Estimation</div>
    <div class="assumption-box">
        <h4>Base Assumptions</h4>
        <div class="assumption-row"><span class="calc-label">Total products in catalog</span><span class="calc-value">50 Million</span></div>
        <div class="assumption-row"><span class="calc-label">Daily active users (DAU)</span><span class="calc-value">50 Million</span></div>
        <div class="assumption-row"><span class="calc-label">Avg searches per user/day</span><span class="calc-value">5</span></div>
        <div class="assumption-row"><span class="calc-label">Avg orders per day</span><span class="calc-value">5 Million</span></div>
        <div class="assumption-row"><span class="calc-label">Avg product page views/day</span><span class="calc-value">500 Million</span></div>
    </div>
    <div class="cap-grid">
        <div class="cap-card">
            <h4>Search Traffic</h4>
            <div class="calc-row"><span class="calc-label">Total searches/day</span><span class="calc-value">250M</span></div>
            <div class="calc-row"><span class="calc-label">Searches/second (avg)</span><span class="calc-value">~2,900 QPS</span></div>
            <div class="calc-row"><span class="calc-label">Peak (10x avg)</span><span class="calc-value">~29,000 QPS</span></div>
            <div class="calc-result"><span class="calc-label">Elasticsearch Cluster</span><span class="calc-value">50+ nodes</span></div>
        </div>
        <div class="cap-card">
            <h4>Order Processing</h4>
            <div class="calc-row"><span class="calc-label">Orders/day</span><span class="calc-value">5M</span></div>
            <div class="calc-row"><span class="calc-label">Orders/second (avg)</span><span class="calc-value">~58 QPS</span></div>
            <div class="calc-row"><span class="calc-label">Flash sale peak</span><span class="calc-value">~10,000 QPS</span></div>
            <div class="calc-result"><span class="calc-label">Write Throughput</span><span class="calc-value">10K TPS (peak)</span></div>
        </div>
        <div class="cap-card">
            <h4>Inventory Updates</h4>
            <div class="calc-row"><span class="calc-label">Updates/order (avg 2 items)</span><span class="calc-value">2</span></div>
            <div class="calc-row"><span class="calc-label">Total inventory updates/day</span><span class="calc-value">10M</span></div>
            <div class="calc-row"><span class="calc-label">Updates/second</span><span class="calc-value">~115 QPS</span></div>
            <div class="calc-result"><span class="calc-label">Redis + DB Write-Behind</span><span class="calc-value">Sub-ms latency</span></div>
        </div>
        <div class="cap-card">
            <h4>Storage</h4>
            <div class="calc-row"><span class="calc-label">Product data (50M x 5KB)</span><span class="calc-value">~250 GB</span></div>
            <div class="calc-row"><span class="calc-label">Product images (50M x 5 x 500KB)</span><span class="calc-value">~125 TB (S3)</span></div>
            <div class="calc-row"><span class="calc-label">Orders/year (5M/day x 1KB)</span><span class="calc-value">~1.8 TB</span></div>
            <div class="calc-result"><span class="calc-label">Total DB Storage</span><span class="calc-value">~5 TB + 125 TB S3</span></div>
        </div>
        <div class="cap-card">
            <h4>CPU / Server Estimation</h4>
            <div class="calc-row"><span class="calc-label">Search QPS (peak)</span><span class="calc-value">~29,000 QPS</span></div>
            <div class="calc-row"><span class="calc-label">Product page views QPS</span><span class="calc-value">~5,800 QPS</span></div>
            <div class="calc-row"><span class="calc-label">Order processing (peak)</span><span class="calc-value">~10,000 TPS</span></div>
            <div class="calc-row"><span class="calc-label">Each server handles</span><span class="calc-value">~5K QPS</span></div>
            <div class="calc-result"><span class="calc-label">App Servers Needed</span><span class="calc-value">~30 servers</span></div>
            <div class="calc-row" style="margin-top:6px"><span class="calc-label">CPU cores per server (8 cores)</span><span class="calc-value"></span></div>
            <div class="calc-result"><span class="calc-label">Total CPU Cores</span><span class="calc-value">~240 cores</span></div>
            <div class="calc-row" style="margin-top:6px"><span class="calc-label">Elasticsearch Cluster</span><span class="calc-value">50+ nodes</span></div>
            <div class="calc-row"><span class="calc-label">Redis Cluster Nodes</span><span class="calc-value">5-10 nodes</span></div>
            <div class="calc-row"><span class="calc-label">DB Shards (order DB)</span><span class="calc-value">10+ shards</span></div>
        </div>
    </div>
</div>

<!-- ============ 11. BOTTLENECKS ============ -->
<div class="section theme-red">
    <div class="section-title"><span class="section-num">10</span>Bottlenecks &amp; Solutions</div>
    <div class="bottleneck-grid">
        <div class="bottleneck-item">
            <span class="bottleneck-problem">Search Latency at Scale</span>
            <span class="bottleneck-arrow">&#10132;</span>
            <span class="bottleneck-solution">Elasticsearch cluster with read replicas + Redis caching for popular queries</span>
        </div>
        <div class="bottleneck-item">
            <span class="bottleneck-problem">Flash Sale Inventory Overselling</span>
            <span class="bottleneck-arrow">&#10132;</span>
            <span class="bottleneck-solution">Redis DECR for atomic stock counting + DB optimistic locking as fallback</span>
        </div>
        <div class="bottleneck-item">
            <span class="bottleneck-problem">Order Processing at Peak Load</span>
            <span class="bottleneck-arrow">&#10132;</span>
            <span class="bottleneck-solution">Kafka message queue + async Saga orchestration + horizontal scaling</span>
        </div>
        <div class="bottleneck-item">
            <span class="bottleneck-problem">Delivery Route Optimization</span>
            <span class="bottleneck-arrow">&#10132;</span>
            <span class="bottleneck-solution">Geospatial indexing + batch route planning + nearest-warehouse selection</span>
        </div>
    </div>
</div>

<!-- ============ 12. EDGE CASES ============ -->
<div class="section theme-amber">
    <div class="section-title"><span class="section-num">11</span>Edge Cases</div>
    <div class="edge-grid">
        <div class="edge-card">
            <h4>Flash Sale Overselling</h4>
            <p>Use Redis DECR for atomic stock counting. Pre-load inventory to Redis before flash sale. DB write-behind for persistence. If Redis DECR returns &lt; 0, reject order immediately. Rate limit per user (1 item/sale).</p>
        </div>
        <div class="edge-card">
            <h4>Seller Ships Wrong Item</h4>
            <p>Customer raises return with reason WRONG_ITEM. Auto-approve return for verified mismatch (image AI comparison). Seller penalty scoring system. Escrow-based payment release &mdash; hold payment until delivery confirmation.</p>
        </div>
        <div class="edge-card">
            <h4>Delivery Failed Multiple Times</h4>
            <p>After 3 failed delivery attempts, auto-mark as RETURNED_TO_SELLER. Notify customer via SMS/email before each retry. Allow customer to update address or schedule preferred time slot. Full refund after return confirmed.</p>
        </div>
        <div class="edge-card">
            <h4>Price Change During Checkout</h4>
            <p>Lock price at "Add to Cart" time with TTL (30 min). Show price difference warning if changed. At order placement, validate against current price &mdash; if higher, show confirmation dialog. Never charge more than displayed price.</p>
        </div>
        <div class="edge-card">
            <h4>Product Delisted After Order</h4>
            <p>Soft-delete products (set status=INACTIVE). Existing orders continue fulfillment. Product page shows "No longer available". Related search results exclude inactive products via Elasticsearch filter. Seller inventory auto-zeroed.</p>
        </div>
    </div>
</div>

<!-- ============ 13. SECURITY ============ -->
<div class="section theme-lime">
    <div class="section-title"><span class="section-num">12</span>Security Considerations</div>
    <div class="security-grid">
        <div class="security-item">
            <span class="shield">&#9670;</span>
            <div>Seller Verification<div class="security-detail">GSTIN validation via government API. KYC document verification. Manual review for first-time sellers. Probation period with limited listings. Regular audit of top-selling accounts.</div></div>
        </div>
        <div class="security-item">
            <span class="shield">&#9670;</span>
            <div>Fake Review Detection<div class="security-detail">Only verified purchasers can review (check order history). ML-based spam detection on review text. Rate limiting (1 review per product per user). Flag reviews from suspicious IP patterns. Seller review manipulation leads to account suspension.</div></div>
        </div>
        <div class="security-item">
            <span class="shield">&#9670;</span>
            <div>Payment Security<div class="security-detail">PCI-DSS compliant payment gateway (Razorpay/Stripe). Never store card numbers &mdash; use tokenization. 3D Secure for high-value orders. Escrow model: hold funds until delivery confirmed. Idempotency keys to prevent double charging.</div></div>
        </div>
        <div class="security-item">
            <span class="shield">&#9670;</span>
            <div>SQL Injection in Search<div class="security-detail">Use parameterized queries (JPA @Query). Search goes through Elasticsearch (no direct SQL). Input sanitization and validation on all endpoints. WAF (Web Application Firewall) at API Gateway. Content-Security-Policy headers.</div></div>
        </div>
    </div>
</div>

<!-- ============ 14. SUMMARY ============ -->
<div class="section theme-green">
    <div class="section-title"><span class="section-num">13</span>Interview Summary</div>
    <div class="summary-grid">
        <div class="summary-card sc-1"><h4>Elasticsearch + CQRS</h4><p>Read-Heavy Product Catalog</p></div>
        <div class="summary-card sc-2"><h4>Saga Pattern + Kafka</h4><p>Distributed Order Processing</p></div>
        <div class="summary-card sc-3"><h4>Optimistic Locking</h4><p>Inventory Concurrency Control</p></div>
        <div class="summary-card sc-4"><h4>State Machine</h4><p>Delivery Lifecycle Management</p></div>
        <div class="summary-card sc-1"><h4>Strategy Pattern</h4><p>Search Ranking Algorithms</p></div>
        <div class="summary-card sc-2"><h4>Observer / Events</h4><p>Order Status Propagation</p></div>
        <div class="summary-card sc-3"><h4>Redis Caching</h4><p>Inventory &amp; Search Performance</p></div>
        <div class="summary-card sc-4"><h4>Factory Pattern</h4><p>Order Construction Logic</p></div>
        <div class="summary-card sc-1"><h4>Capacity Planning</h4><p>29K QPS search, 10K TPS orders</p></div>
    </div>
    <p style="text-align:center;margin-top:24px;color:#78909c;font-size:1em">
        Complete Amazon/Flipkart LLD for <strong style="color:#ffb74d">Java Spring Boot</strong> interviews &mdash; covers SOLID, Design Patterns, Scalability, Security &amp; Edge Cases.
    </p>
</div>
`
}
