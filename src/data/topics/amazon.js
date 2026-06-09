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

<!-- ============ 2. CORE ENTITIES ============ -->
<div class="section theme-blue">
    <div class="section-title"><span class="section-num">2</span>Core Entities</div>
    <div class="entity-grid">
        <div class="entity-card">
            <h3>Product</h3>
            <div class="field"><span class="field-name">id</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">title</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">description</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">price</span><span class="field-type">BigDecimal</span></div>
            <div class="field"><span class="field-name">mrp</span><span class="field-type">BigDecimal</span></div>
            <div class="field"><span class="field-name">categoryId</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">sellerId</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">brand</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">images</span><span class="field-type">List&lt;String&gt;</span></div>
            <div class="field"><span class="field-name">attributes</span><span class="field-type">Map&lt;String,String&gt;</span></div>
            <div class="field"><span class="field-name">avgRating</span><span class="field-type">Double</span></div>
            <div class="field"><span class="field-name">totalReviews</span><span class="field-type">Integer</span></div>
            <div class="field"><span class="field-name">status</span><span class="field-type">ProductStatus</span></div>
            <div class="field"><span class="field-name">createdAt</span><span class="field-type">LocalDateTime</span></div>
        </div>
        <div class="entity-card">
            <h3>Category</h3>
            <div class="field"><span class="field-name">id</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">name</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">parentId</span><span class="field-type">Long (nullable)</span></div>
            <div class="field"><span class="field-name">level</span><span class="field-type">Integer</span></div>
            <div class="field"><span class="field-name">slug</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">attributes</span><span class="field-type">List&lt;String&gt;</span></div>
        </div>
        <div class="entity-card">
            <h3>Seller</h3>
            <div class="field"><span class="field-name">id</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">businessName</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">gstin</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">email</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">phone</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">rating</span><span class="field-type">Double</span></div>
            <div class="field"><span class="field-name">status</span><span class="field-type">SellerStatus</span></div>
            <div class="field"><span class="field-name">warehouseIds</span><span class="field-type">List&lt;Long&gt;</span></div>
            <div class="field"><span class="field-name">createdAt</span><span class="field-type">LocalDateTime</span></div>
        </div>
        <div class="entity-card">
            <h3>Review</h3>
            <div class="field"><span class="field-name">id</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">productId</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">userId</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">rating</span><span class="field-type">Integer (1-5)</span></div>
            <div class="field"><span class="field-name">title</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">body</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">images</span><span class="field-type">List&lt;String&gt;</span></div>
            <div class="field"><span class="field-name">verified</span><span class="field-type">Boolean</span></div>
            <div class="field"><span class="field-name">helpfulCount</span><span class="field-type">Integer</span></div>
            <div class="field"><span class="field-name">createdAt</span><span class="field-type">LocalDateTime</span></div>
        </div>
        <div class="entity-card">
            <h3>Order</h3>
            <div class="field"><span class="field-name">id</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">orderId</span><span class="field-type">String (UUID)</span></div>
            <div class="field"><span class="field-name">userId</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">totalAmount</span><span class="field-type">BigDecimal</span></div>
            <div class="field"><span class="field-name">discount</span><span class="field-type">BigDecimal</span></div>
            <div class="field"><span class="field-name">shippingAddressId</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">paymentId</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">status</span><span class="field-type">OrderStatus</span></div>
            <div class="field"><span class="field-name">createdAt</span><span class="field-type">LocalDateTime</span></div>
            <div class="field"><span class="field-name">updatedAt</span><span class="field-type">LocalDateTime</span></div>
        </div>
        <div class="entity-card">
            <h3>OrderItem</h3>
            <div class="field"><span class="field-name">id</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">orderId</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">productId</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">sellerId</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">quantity</span><span class="field-type">Integer</span></div>
            <div class="field"><span class="field-name">unitPrice</span><span class="field-type">BigDecimal</span></div>
            <div class="field"><span class="field-name">totalPrice</span><span class="field-type">BigDecimal</span></div>
            <div class="field"><span class="field-name">status</span><span class="field-type">OrderStatus</span></div>
        </div>
        <div class="entity-card">
            <h3>Inventory</h3>
            <div class="field"><span class="field-name">id</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">productId</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">sellerId</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">warehouseId</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">totalStock</span><span class="field-type">Integer</span></div>
            <div class="field"><span class="field-name">reservedStock</span><span class="field-type">Integer</span></div>
            <div class="field"><span class="field-name">availableStock</span><span class="field-type">Integer</span></div>
            <div class="field"><span class="field-name">version</span><span class="field-type">Long</span></div>
        </div>
        <div class="entity-card">
            <h3>DeliveryTracking</h3>
            <div class="field"><span class="field-name">id</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">orderId</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">trackingNumber</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">carrier</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">status</span><span class="field-type">DeliveryStatus</span></div>
            <div class="field"><span class="field-name">currentLocation</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">estimatedDelivery</span><span class="field-type">LocalDate</span></div>
            <div class="field"><span class="field-name">deliveredAt</span><span class="field-type">LocalDateTime</span></div>
            <div class="field"><span class="field-name">events</span><span class="field-type">List&lt;TrackingEvent&gt;</span></div>
        </div>
        <div class="entity-card">
            <h3>Return</h3>
            <div class="field"><span class="field-name">id</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">orderId</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">orderItemId</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">userId</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">reason</span><span class="field-type">ReturnReason</span></div>
            <div class="field"><span class="field-name">description</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">refundAmount</span><span class="field-type">BigDecimal</span></div>
            <div class="field"><span class="field-name">status</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">createdAt</span><span class="field-type">LocalDateTime</span></div>
        </div>
        <div class="entity-card">
            <h3>Wishlist</h3>
            <div class="field"><span class="field-name">id</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">userId</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">productId</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">addedAt</span><span class="field-type">LocalDateTime</span></div>
        </div>
        <div class="entity-card">
            <h3>Address</h3>
            <div class="field"><span class="field-name">id</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">userId</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">fullName</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">phone</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">line1</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">line2</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">city</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">state</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">pincode</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">isDefault</span><span class="field-type">Boolean</span></div>
        </div>
        <div class="entity-card">
            <h3>User</h3>
            <div class="field"><span class="field-name">id</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">name</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">email</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">phone</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">passwordHash</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">addresses</span><span class="field-type">List&lt;Address&gt;</span></div>
            <div class="field"><span class="field-name">createdAt</span><span class="field-type">LocalDateTime</span></div>
        </div>
    </div>
</div>

<!-- ============ 3. ENUMS ============ -->
<div class="section theme-purple">
    <div class="section-title"><span class="section-num">3</span>Enums</div>
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

<!-- ============ 4. INTERFACES ============ -->
<div class="section theme-cyan">
    <div class="section-title"><span class="section-num">4</span>Interfaces &amp; SOLID Principles</div>

    <div class="sub-heading" style="color:#18ffff;border-color:#18ffff">Interface Segregation &mdash; Focused service contracts</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">IProductService.java</span></div><pre class="code-block">
<span class="kw">interface</span> <span class="iface">IProductService</span> {
    Product <span class="fn">createProduct</span>(ProductRequest req, Long sellerId);
    Product <span class="fn">getProductById</span>(Long productId);
    Page&lt;Product&gt; <span class="fn">getProductsByCategory</span>(Long categoryId, Pageable pageable);
    <span class="tp">void</span> <span class="fn">updateProduct</span>(Long productId, ProductRequest req, Long sellerId);
    <span class="tp">void</span> <span class="fn">delistProduct</span>(Long productId, Long sellerId);
}
    </pre></div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">ISearchService.java</span></div><pre class="code-block">
<span class="kw">interface</span> <span class="iface">ISearchService</span> {
    SearchResult <span class="fn">search</span>(String query, SearchFilters filters, Pageable pageable);
    List&lt;String&gt; <span class="fn">autoSuggest</span>(String prefix);
    <span class="tp">void</span> <span class="fn">indexProduct</span>(Product product);    <span class="cm">// sync to Elasticsearch</span>
    <span class="tp">void</span> <span class="fn">removeFromIndex</span>(Long productId);
}
    </pre></div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">IOrderService.java</span></div><pre class="code-block">
<span class="kw">interface</span> <span class="iface">IOrderService</span> {
    Order <span class="fn">placeOrder</span>(OrderRequest req, Long userId);
    Order <span class="fn">getOrder</span>(String orderId);
    List&lt;Order&gt; <span class="fn">getUserOrders</span>(Long userId, Pageable pageable);
    <span class="tp">void</span> <span class="fn">cancelOrder</span>(String orderId, Long userId);
    <span class="tp">void</span> <span class="fn">updateOrderStatus</span>(String orderId, OrderStatus status);
}
    </pre></div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">IInventoryService.java</span></div><pre class="code-block">
<span class="kw">interface</span> <span class="iface">IInventoryService</span> {
    <span class="tp">boolean</span> <span class="fn">checkAvailability</span>(Long productId, <span class="tp">int</span> qty);
    <span class="tp">void</span> <span class="fn">reserveStock</span>(Long productId, <span class="tp">int</span> qty, String orderId);   <span class="cm">// optimistic lock</span>
    <span class="tp">void</span> <span class="fn">releaseStock</span>(Long productId, <span class="tp">int</span> qty, String orderId);
    <span class="tp">void</span> <span class="fn">deductStock</span>(Long productId, <span class="tp">int</span> qty);
    <span class="tp">int</span> <span class="fn">getAvailableStock</span>(Long productId, Long warehouseId);
}
    </pre></div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">ISellerService.java</span></div><pre class="code-block">
<span class="kw">interface</span> <span class="iface">ISellerService</span> {
    Seller <span class="fn">registerSeller</span>(SellerRequest req);
    Seller <span class="fn">getSellerById</span>(Long sellerId);
    <span class="tp">void</span> <span class="fn">verifySeller</span>(Long sellerId);
    <span class="tp">void</span> <span class="fn">suspendSeller</span>(Long sellerId, String reason);
    SellerDashboard <span class="fn">getDashboard</span>(Long sellerId);
}
    </pre></div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">IDeliveryService.java</span></div><pre class="code-block">
<span class="kw">interface</span> <span class="iface">IDeliveryService</span> {
    DeliveryTracking <span class="fn">assignDelivery</span>(Long orderId, Long warehouseId);
    DeliveryTracking <span class="fn">trackDelivery</span>(String trackingNumber);
    <span class="tp">void</span> <span class="fn">updateDeliveryStatus</span>(String trackingNumber, DeliveryStatus status, String location);
    <span class="tp">void</span> <span class="fn">markDelivered</span>(String trackingNumber);
}
    </pre></div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">IReviewService.java</span></div><pre class="code-block">
<span class="kw">interface</span> <span class="iface">IReviewService</span> {
    Review <span class="fn">addReview</span>(Long productId, Long userId, ReviewRequest req);
    Page&lt;Review&gt; <span class="fn">getReviews</span>(Long productId, Pageable pageable);
    RatingAggregation <span class="fn">getRatingAggregation</span>(Long productId);
    <span class="tp">void</span> <span class="fn">markHelpful</span>(Long reviewId, Long userId);
}
    </pre></div>
</div>

<!-- ============ 5. CLASS DESIGN ============ -->
<div class="section theme-orange">
    <div class="section-title"><span class="section-num">5</span>Class Design (with Methods)</div>

    <div class="sub-heading" style="color:#ffab40;border-color:#ffab40">Product Search with Elasticsearch</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">ElasticsearchSearchService.java</span></div><pre class="code-block">
<span class="ann">@Service</span>
<span class="kw">class</span> <span class="cn">ElasticsearchSearchService</span> <span class="kw">implements</span> <span class="iface">ISearchService</span> {

    <span class="kw">private final</span> <span class="tp">RestHighLevelClient</span> esClient;
    <span class="kw">private final</span> <span class="tp">SearchRankingStrategy</span> rankingStrategy;

    <span class="ann">@Override</span>
    <span class="kw">public</span> SearchResult <span class="fn">search</span>(String query, SearchFilters filters, Pageable pageable) {
        BoolQueryBuilder boolQuery = QueryBuilders.boolQuery()
            .must(QueryBuilders.multiMatchQuery(query, <span class="st">"title"</span>, <span class="st">"description"</span>, <span class="st">"brand"</span>));

        <span class="cm">// Apply filters: category, price range, brand, rating</span>
        <span class="kw">if</span> (filters.getCategoryId() != <span class="kw">null</span>)
            boolQuery.filter(QueryBuilders.termQuery(<span class="st">"categoryId"</span>, filters.getCategoryId()));
        <span class="kw">if</span> (filters.getMinPrice() != <span class="kw">null</span>)
            boolQuery.filter(QueryBuilders.rangeQuery(<span class="st">"price"</span>).gte(filters.getMinPrice()));
        <span class="kw">if</span> (filters.getMaxPrice() != <span class="kw">null</span>)
            boolQuery.filter(QueryBuilders.rangeQuery(<span class="st">"price"</span>).lte(filters.getMaxPrice()));

        <span class="cm">// Apply ranking strategy (relevance, popularity, price)</span>
        SortBuilder sort = rankingStrategy.buildSort(filters.getSortBy());

        SearchRequest request = <span class="kw">new</span> SearchRequest(<span class="st">"products"</span>)
            .source(<span class="kw">new</span> SearchSourceBuilder().query(boolQuery)
                .sort(sort).from(pageable.getOffset()).size(pageable.getPageSize()));

        SearchResponse response = esClient.search(request, RequestOptions.DEFAULT);
        <span class="kw">return</span> mapToSearchResult(response, pageable);
    }

    <span class="ann">@Override</span>
    <span class="kw">public</span> <span class="tp">void</span> <span class="fn">indexProduct</span>(Product product) {
        IndexRequest req = <span class="kw">new</span> IndexRequest(<span class="st">"products"</span>)
            .id(product.getId().toString())
            .source(objectMapper.writeValueAsString(product), XContentType.JSON);
        esClient.index(req, RequestOptions.DEFAULT);
    }
}
    </pre></div>

    <div class="sub-heading" style="color:#ffab40;border-color:#ffab40">Inventory Reservation (Optimistic Locking)</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">InventoryServiceImpl.java</span></div><pre class="code-block">
<span class="ann">@Service</span>
<span class="kw">class</span> <span class="cn">InventoryServiceImpl</span> <span class="kw">implements</span> <span class="iface">IInventoryService</span> {

    <span class="kw">private final</span> <span class="tp">InventoryRepository</span> inventoryRepo;

    <span class="ann">@Override</span>
    <span class="ann">@Transactional</span>
    <span class="kw">public void</span> <span class="fn">reserveStock</span>(Long productId, <span class="tp">int</span> qty, String orderId) {
        Inventory inv = inventoryRepo.findByProductIdWithLock(productId)
            .orElseThrow(() -&gt; <span class="kw">new</span> ProductNotFoundException(productId));

        <span class="kw">if</span> (inv.getAvailableStock() &lt; qty) {
            <span class="kw">throw new</span> InsufficientStockException(productId, qty, inv.getAvailableStock());
        }

        inv.setReservedStock(inv.getReservedStock() + qty);
        inv.setAvailableStock(inv.getTotalStock() - inv.getReservedStock());
        inventoryRepo.save(inv);   <span class="cm">// @Version triggers optimistic lock check</span>

        <span class="cm">// Schedule reservation expiry (15 min TTL)</span>
        reservationScheduler.scheduleRelease(productId, qty, orderId, Duration.ofMinutes(15));
    }

    <span class="ann">@Override</span>
    <span class="ann">@Transactional</span>
    <span class="kw">public void</span> <span class="fn">releaseStock</span>(Long productId, <span class="tp">int</span> qty, String orderId) {
        Inventory inv = inventoryRepo.findByProductIdWithLock(productId).orElseThrow();
        inv.setReservedStock(Math.max(0, inv.getReservedStock() - qty));
        inv.setAvailableStock(inv.getTotalStock() - inv.getReservedStock());
        inventoryRepo.save(inv);
    }
}
    </pre></div>

    <div class="sub-heading" style="color:#ffab40;border-color:#ffab40">Order Placement (Distributed Transaction &mdash; Saga Pattern)</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">OrderServiceImpl.java</span></div><pre class="code-block">
<span class="ann">@Service</span>
<span class="kw">class</span> <span class="cn">OrderServiceImpl</span> <span class="kw">implements</span> <span class="iface">IOrderService</span> {

    <span class="kw">private final</span> <span class="tp">OrderRepository</span> orderRepo;
    <span class="kw">private final</span> <span class="tp">IInventoryService</span> inventoryService;
    <span class="kw">private final</span> <span class="tp">PaymentService</span> paymentService;
    <span class="kw">private final</span> <span class="tp">ApplicationEventPublisher</span> eventPublisher;

    <span class="ann">@Override</span>
    <span class="ann">@Transactional</span>
    <span class="kw">public</span> Order <span class="fn">placeOrder</span>(OrderRequest req, Long userId) {
        <span class="cm">// 1. Validate cart items &amp; prices</span>
        List&lt;CartItem&gt; cartItems = validateAndLockPrices(req.getItems());

        <span class="cm">// 2. Reserve inventory for each item (Saga step 1)</span>
        String orderId = UUID.randomUUID().toString();
        <span class="kw">for</span> (CartItem item : cartItems) {
            inventoryService.reserveStock(item.getProductId(), item.getQty(), orderId);
        }

        <span class="cm">// 3. Create order</span>
        Order order = OrderFactory.create(orderId, userId, cartItems, req.getAddressId());
        orderRepo.save(order);

        <span class="cm">// 4. Process payment (Saga step 2)</span>
        <span class="kw">try</span> {
            paymentService.processPayment(order.getTotalAmount(), req.getPaymentMethod());
        } <span class="kw">catch</span> (PaymentFailedException e) {
            <span class="cm">// Compensate: release all reserved inventory</span>
            cartItems.forEach(i -&gt; inventoryService.releaseStock(i.getProductId(), i.getQty(), orderId));
            order.setStatus(OrderStatus.CANCELLED);
            orderRepo.save(order);
            <span class="kw">throw</span> e;
        }

        <span class="cm">// 5. Publish order event (Observer pattern)</span>
        order.setStatus(OrderStatus.CONFIRMED);
        orderRepo.save(order);
        eventPublisher.publishEvent(<span class="kw">new</span> OrderPlacedEvent(order));

        <span class="kw">return</span> order;
    }
}
    </pre></div>

    <div class="sub-heading" style="color:#ffab40;border-color:#ffab40">Delivery Assignment</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">DeliveryServiceImpl.java</span></div><pre class="code-block">
<span class="ann">@Service</span>
<span class="kw">class</span> <span class="cn">DeliveryServiceImpl</span> <span class="kw">implements</span> <span class="iface">IDeliveryService</span> {

    <span class="kw">private final</span> <span class="tp">DeliveryTrackingRepository</span> trackingRepo;
    <span class="kw">private final</span> <span class="tp">DeliveryStateMachine</span> stateMachine;

    <span class="ann">@Override</span>
    <span class="kw">public</span> DeliveryTracking <span class="fn">assignDelivery</span>(Long orderId, Long warehouseId) {
        String trackingNum = TrackingNumberGenerator.generate();

        DeliveryTracking tracking = DeliveryTracking.builder()
            .orderId(orderId)
            .trackingNumber(trackingNum)
            .status(DeliveryStatus.PICKED_UP)
            .estimatedDelivery(LocalDate.now().plusDays(3))
            .build();

        tracking.addEvent(<span class="kw">new</span> TrackingEvent(<span class="st">"Order picked from warehouse"</span>, warehouseId));
        <span class="kw">return</span> trackingRepo.save(tracking);
    }

    <span class="ann">@Override</span>
    <span class="kw">public void</span> <span class="fn">updateDeliveryStatus</span>(String trackingNum, DeliveryStatus newStatus, String location) {
        DeliveryTracking tracking = trackingRepo.findByTrackingNumber(trackingNum).orElseThrow();
        <span class="cm">// State machine validates transitions (e.g., can't go from DELIVERED to IN_TRANSIT)</span>
        stateMachine.transition(tracking, newStatus);
        tracking.setCurrentLocation(location);
        tracking.addEvent(<span class="kw">new</span> TrackingEvent(newStatus.name(), location));
        trackingRepo.save(tracking);
    }
}
    </pre></div>

    <div class="sub-heading" style="color:#ffab40;border-color:#ffab40">Review Aggregation</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">ReviewServiceImpl.java</span></div><pre class="code-block">
<span class="ann">@Service</span>
<span class="kw">class</span> <span class="cn">ReviewServiceImpl</span> <span class="kw">implements</span> <span class="iface">IReviewService</span> {

    <span class="kw">private final</span> <span class="tp">ReviewRepository</span> reviewRepo;
    <span class="kw">private final</span> <span class="tp">ProductRepository</span> productRepo;
    <span class="kw">private final</span> <span class="tp">OrderRepository</span> orderRepo;

    <span class="ann">@Override</span>
    <span class="ann">@Transactional</span>
    <span class="kw">public</span> Review <span class="fn">addReview</span>(Long productId, Long userId, ReviewRequest req) {
        <span class="cm">// Verify user actually purchased this product</span>
        <span class="kw">boolean</span> purchased = orderRepo.existsByUserIdAndProductIdAndStatus(
            userId, productId, OrderStatus.DELIVERED);
        <span class="kw">if</span> (!purchased) <span class="kw">throw new</span> UnverifiedPurchaseException();

        Review review = Review.builder()
            .productId(productId).userId(userId)
            .rating(req.getRating()).title(req.getTitle())
            .body(req.getBody()).verified(<span class="kw">true</span>).build();
        reviewRepo.save(review);

        <span class="cm">// Update aggregated rating on product (denormalized)</span>
        updateProductRating(productId);
        <span class="kw">return</span> review;
    }

    <span class="kw">private void</span> <span class="fn">updateProductRating</span>(Long productId) {
        Double avg = reviewRepo.calculateAverageRating(productId);
        Integer count = reviewRepo.countByProductId(productId);
        productRepo.updateRating(productId, avg, count);
    }
}
    </pre></div>
</div>

<!-- ============ 6. REPOSITORY LAYER ============ -->
<div class="section theme-indigo">
    <div class="section-title"><span class="section-num">6</span>Repository / DAO Layer</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Repositories.java</span></div><pre class="code-block">
<span class="kw">interface</span> <span class="iface">ProductRepository</span> <span class="kw">extends</span> <span class="tp">JpaRepository</span>&lt;Product, Long&gt; {
    Page&lt;Product&gt; <span class="fn">findByCategoryIdAndStatus</span>(Long catId, ProductStatus status, Pageable p);
    List&lt;Product&gt; <span class="fn">findBySellerIdAndStatus</span>(Long sellerId, ProductStatus status);

    <span class="ann">@Modifying @Query</span>(<span class="st">"UPDATE Product p SET p.avgRating = :avg, p.totalReviews = :cnt WHERE p.id = :id"</span>)
    <span class="tp">void</span> <span class="fn">updateRating</span>(Long id, Double avg, Integer cnt);
}

<span class="kw">interface</span> <span class="iface">OrderRepository</span> <span class="kw">extends</span> <span class="tp">JpaRepository</span>&lt;Order, Long&gt; {
    Optional&lt;Order&gt; <span class="fn">findByOrderId</span>(String orderId);
    Page&lt;Order&gt; <span class="fn">findByUserIdOrderByCreatedAtDesc</span>(Long userId, Pageable p);
    <span class="tp">boolean</span> <span class="fn">existsByUserIdAndProductIdAndStatus</span>(Long userId, Long productId, OrderStatus status);
}

<span class="kw">interface</span> <span class="iface">InventoryRepository</span> <span class="kw">extends</span> <span class="tp">JpaRepository</span>&lt;Inventory, Long&gt; {
    <span class="ann">@Lock</span>(LockModeType.OPTIMISTIC)
    <span class="ann">@Query</span>(<span class="st">"SELECT i FROM Inventory i WHERE i.productId = :productId"</span>)
    Optional&lt;Inventory&gt; <span class="fn">findByProductIdWithLock</span>(Long productId);

    List&lt;Inventory&gt; <span class="fn">findByWarehouseId</span>(Long warehouseId);
}

<span class="kw">interface</span> <span class="iface">ReviewRepository</span> <span class="kw">extends</span> <span class="tp">JpaRepository</span>&lt;Review, Long&gt; {
    Page&lt;Review&gt; <span class="fn">findByProductIdOrderByCreatedAtDesc</span>(Long productId, Pageable p);

    <span class="ann">@Query</span>(<span class="st">"SELECT AVG(r.rating) FROM Review r WHERE r.productId = :productId"</span>)
    Double <span class="fn">calculateAverageRating</span>(Long productId);

    Integer <span class="fn">countByProductId</span>(Long productId);
}

<span class="kw">interface</span> <span class="iface">SellerRepository</span> <span class="kw">extends</span> <span class="tp">JpaRepository</span>&lt;Seller, Long&gt; {
    Optional&lt;Seller&gt; <span class="fn">findByGstin</span>(String gstin);
}

<span class="kw">interface</span> <span class="iface">DeliveryTrackingRepository</span> <span class="kw">extends</span> <span class="tp">JpaRepository</span>&lt;DeliveryTracking, Long&gt; {
    Optional&lt;DeliveryTracking&gt; <span class="fn">findByTrackingNumber</span>(String trackingNumber);
    Optional&lt;DeliveryTracking&gt; <span class="fn">findByOrderId</span>(Long orderId);
}

<span class="kw">interface</span> <span class="iface">WishlistRepository</span> <span class="kw">extends</span> <span class="tp">JpaRepository</span>&lt;Wishlist, Long&gt; {
    List&lt;Wishlist&gt; <span class="fn">findByUserId</span>(Long userId);
    <span class="tp">void</span> <span class="fn">deleteByUserIdAndProductId</span>(Long userId, Long productId);
}
    </pre></div>
    <div class="repo-grid" style="margin-top:20px">
        <div class="repo-card">
            <h3>Architecture Flow</h3>
            <div class="flow-h">
                <div class="flow-box flow-green" style="min-width:120px">Controller</div>
                <span class="flow-h-arrow">&#10132;</span>
                <div class="flow-box flow-blue" style="min-width:120px">Service</div>
                <span class="flow-h-arrow">&#10132;</span>
                <div class="flow-box flow-purple" style="min-width:120px">Repository</div>
                <span class="flow-h-arrow">&#10132;</span>
                <div class="flow-box flow-pink" style="min-width:120px">DB / ES</div>
            </div>
        </div>
    </div>
</div>

<!-- ============ 7. DB SCHEMA ============ -->
<div class="section theme-pink">
    <div class="section-title"><span class="section-num">7</span>Database Schema</div>
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

<!-- ============ 8. APIs ============ -->
<div class="section theme-teal">
    <div class="section-title"><span class="section-num">8</span>REST API Endpoints</div>
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

<!-- ============ 9. SERVICES ============ -->
<div class="section theme-yellow">
    <div class="section-title"><span class="section-num">9</span>Service Layer</div>
    <div class="service-grid">
        <div class="service-card">
            <h3>ProductService</h3>
            <p class="svc-desc">Manages products — create, view, update, and remove from listing</p>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Add a new product to the catalog</div><code>Product createProduct(CreateProductRequest request, Long sellerId)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Get product details by ID</div><code>Product getProductById(Long productId)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Get all products in a category</div><code>Page&lt;Product&gt; getByCategory(Long categoryId, Pageable pageable)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Update product info (price, description, etc.)</div><code>Product updateProduct(Long productId, UpdateProductRequest request)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Remove a product from the store</div><code>void delistProduct(Long productId, Long sellerId)</code></div>
        </div>
        <div class="service-card">
            <h3>SearchService</h3>
            <p class="svc-desc">Helps users find products using search and auto-suggestions</p>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Search products by keyword</div><code>Page&lt;Product&gt; search(String query, SearchFilters filters, Pageable pageable)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Show suggestions as user types</div><code>List&lt;String&gt; autoSuggest(String prefix)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Add a product to the search index</div><code>void indexProduct(Product product)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Remove a product from search index</div><code>void removeFromIndex(Long productId)</code></div>
        </div>
        <div class="service-card">
            <h3>OrderService</h3>
            <p class="svc-desc">Handles placing, viewing, canceling orders and updating order status</p>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Place a new order</div><code>Order placeOrder(Long userId, PlaceOrderRequest request)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Get order details by ID</div><code>Order getOrder(String orderId)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Get all orders for a user</div><code>Page&lt;Order&gt; getUserOrders(Long userId, Pageable pageable)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Cancel an order (if allowed)</div><code>void cancelOrder(String orderId, Long userId)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Update order status (shipped, delivered, etc.)</div><code>void updateOrderStatus(String orderId, OrderStatus status)</code></div>
        </div>
        <div class="service-card">
            <h3>InventoryService</h3>
            <p class="svc-desc">Tracks product stock — check availability, reserve, release, and deduct</p>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Check if product is in stock</div><code>boolean checkAvailability(Long productId, int quantity)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Reserve stock when user starts checkout</div><code>boolean reserveStock(Long productId, int quantity, String orderId)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Release stock if order is canceled</div><code>void releaseStock(Long productId, int quantity, String orderId)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Remove stock after order is confirmed</div><code>void deductStock(Long productId, int quantity)</code></div>
        </div>
        <div class="service-card">
            <h3>SellerService</h3>
            <p class="svc-desc">Manages sellers — registration, verification, suspension, and dashboard</p>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Register a new seller</div><code>Seller registerSeller(SellerRegistrationRequest request)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Verify seller documents and approve</div><code>void verifySeller(Long sellerId)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Suspend a seller for policy violation</div><code>void suspendSeller(Long sellerId, String reason)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Get seller's sales dashboard</div><code>SellerDashboard getDashboard(Long sellerId)</code></div>
        </div>
        <div class="service-card">
            <h3>DeliveryService</h3>
            <p class="svc-desc">Handles delivery — assign driver, track package, update status</p>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Assign a delivery partner to an order</div><code>Delivery assignDelivery(String orderId)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Track where the package is right now</div><code>DeliveryStatus trackDelivery(String orderId)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Update delivery status (picked up, on the way, etc.)</div><code>void updateStatus(String deliveryId, DeliveryStatus status)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Mark order as delivered</div><code>void markDelivered(String deliveryId)</code></div>
        </div>
        <div class="service-card">
            <h3>ReviewService</h3>
            <p class="svc-desc">Manages product reviews and ratings from buyers</p>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Write a review for a product</div><code>Review addReview(Long userId, Long productId, ReviewRequest request)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Get all reviews for a product</div><code>Page&lt;Review&gt; getReviews(Long productId, Pageable pageable)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Get average rating and star breakdown</div><code>RatingAggregation getRatingAggregation(Long productId)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Mark a review as helpful</div><code>void markHelpful(Long reviewId, Long userId)</code></div>
        </div>
        <div class="service-card">
            <h3>WishlistService</h3>
            <p class="svc-desc">Lets users save products they want to buy later</p>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Save a product to wishlist</div><code>void addToWishlist(Long userId, Long productId)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Remove a product from wishlist</div><code>void removeFromWishlist(Long userId, Long productId)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Get all products in user's wishlist</div><code>List&lt;Product&gt; getWishlist(Long userId)</code></div>
        </div>
    </div>
</div>

<!-- ============ 10. KEY ARCHITECTURE ============ -->
<div class="section theme-red">
    <div class="section-title"><span class="section-num">10</span>Key Architecture Components</div>

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

<!-- ============ 11. DESIGN PATTERNS ============ -->
<div class="section theme-cyan">
    <div class="section-title"><span class="section-num">11</span>Design Patterns (with Code)</div>

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

<!-- ============ 12. SEQUENCE FLOW ============ -->
<div class="section theme-lime">
    <div class="section-title"><span class="section-num">12</span>Sequence Flow &mdash; Search to Delivery</div>
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

<!-- ============ 13. CAPACITY ESTIMATION ============ -->
<div class="section theme-deepblue">
    <div class="section-title"><span class="section-num">13</span>Capacity Estimation</div>
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

<!-- ============ 14. BOTTLENECKS ============ -->
<div class="section theme-red">
    <div class="section-title"><span class="section-num">14</span>Bottlenecks &amp; Solutions</div>
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

<!-- ============ 15. EDGE CASES ============ -->
<div class="section theme-amber">
    <div class="section-title"><span class="section-num">15</span>Edge Cases</div>
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

<!-- ============ 16. SECURITY ============ -->
<div class="section theme-lime">
    <div class="section-title"><span class="section-num">16</span>Security Considerations</div>
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

<!-- ============ 17. SUMMARY ============ -->
<div class="section theme-green">
    <div class="section-title"><span class="section-num">17</span>Interview Summary</div>
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
