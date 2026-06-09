export default {
  title: "Food Delivery (Zomato / Swiggy) &mdash; Low Level Design",
  subtitle: "Complete LLD for Java Spring Boot Interview &mdash; Restaurant, Menu, Cart, Order &amp; Delivery",
  subtitleColor: "#fff3e0",
  headerGradient: "linear-gradient(135deg,#e65100,#ff6d00,#ff9100)",
  footerText: "Food Delivery LLD &mdash; Zomato / Swiggy Clone",
  content: `
<!-- ============ 1. FUNCTIONAL REQUIREMENTS ============ -->
<div class="section theme-green">
    <div class="section-title"><span class="section-num">1</span>Functional Requirements</div>
    <div class="req-grid">
        <div class="req-pill"><span class="num">1</span> Restaurant Management</div>
        <div class="req-pill"><span class="num">2</span> Food Menu / Catalog</div>
        <div class="req-pill"><span class="num">3</span> Search Food &amp; Restaurants</div>
        <div class="req-pill"><span class="num">4</span> Cart Management</div>
        <div class="req-pill"><span class="num">5</span> Order Placement</div>
        <div class="req-pill"><span class="num">6</span> Payment Processing</div>
        <div class="req-pill"><span class="num">7</span> Delivery Partner Assignment</div>
        <div class="req-pill"><span class="num">8</span> Real-time Order Tracking</div>
        <div class="req-pill"><span class="num">9</span> Ratings &amp; Reviews</div>
        <div class="req-pill"><span class="num">10</span> Coupon / Offer System</div>
    </div>
</div>

<!-- ============ 2. NON-FUNCTIONAL REQUIREMENTS ============ -->
<div class="section theme-pink">
    <div class="section-title"><span class="section-num">2</span>Non-Functional Requirements</div>
    <div class="req-grid">
        <div class="req-pill"><span class="num">1</span> Low Latency &mdash; search &amp; order &lt; 200ms</div>
        <div class="req-pill"><span class="num">2</span> High Availability &mdash; 99.99% uptime</div>
        <div class="req-pill"><span class="num">3</span> Scalability &mdash; handle 1M+ concurrent users</div>
        <div class="req-pill"><span class="num">4</span> Consistency &mdash; payment &amp; inventory ACID</div>
        <div class="req-pill"><span class="num">5</span> Real-time &mdash; live location tracking via WebSocket</div>
        <div class="req-pill"><span class="num">6</span> Fault Tolerance &mdash; retry + circuit breaker</div>
    </div>
</div>

<!-- ============ 3. ENUMS ============ -->
<div class="section theme-purple">
    <div class="section-title"><span class="section-num">3</span>Enums</div>
    <div class="enum-grid">
        <div class="enum-card">
            <h3>OrderStatus</h3>
            <div class="enum-val">PLACED</div>
            <div class="enum-val">ACCEPTED</div>
            <div class="enum-val">PREPARING</div>
            <div class="enum-val">READY_FOR_PICKUP</div>
            <div class="enum-val">PICKED_UP</div>
            <div class="enum-val">ON_THE_WAY</div>
            <div class="enum-val">DELIVERED</div>
            <div class="enum-val">CANCELLED</div>
        </div>
        <div class="enum-card">
            <h3>RestaurantStatus</h3>
            <div class="enum-val">ACTIVE</div>
            <div class="enum-val">INACTIVE</div>
            <div class="enum-val">SUSPENDED</div>
            <div class="enum-val">PENDING_APPROVAL</div>
        </div>
        <div class="enum-card">
            <h3>PartnerStatus</h3>
            <div class="enum-val">ONLINE</div>
            <div class="enum-val">OFFLINE</div>
            <div class="enum-val">ON_DELIVERY</div>
            <div class="enum-val">BLOCKED</div>
        </div>
        <div class="enum-card">
            <h3>DiscountType</h3>
            <div class="enum-val">PERCENTAGE</div>
            <div class="enum-val">FLAT</div>
            <div class="enum-val">BOGO</div>
            <div class="enum-val">FREE_DELIVERY</div>
        </div>
        <div class="enum-card">
            <h3>PaymentMode</h3>
            <div class="enum-val">UPI</div>
            <div class="enum-val">CARD</div>
            <div class="enum-val">WALLET</div>
            <div class="enum-val">COD</div>
            <div class="enum-val">NET_BANKING</div>
        </div>
    </div>
</div>

<!-- ============ 4. SERVICE LLD ============ -->
<div class="section theme-yellow">
    <div class="section-title"><span class="section-num">4</span>Service LLD</div>
    <div class="service-grid">

        <!-- ========== FOOD SERVICE ========== -->
        <div class="service-card">
            <h3>FoodService</h3>
            <p class="svc-desc">Food items ka CRUD &mdash; restaurant apne menu me items add, update, delete aur search kar sakta hai. Ye sabse core service hai food delivery app ki.</p>

            <div class="method-block">
                <div class="method-sig"><span class="method-num">1</span> createFood(FoodRequest)</div>
                <div class="method-return">Returns: <code>FoodItem</code></div>
                <div class="params-title">Parameters (FoodRequest):</div>
                <div class="param-row"><span class="param-name">restaurantId</span><span class="param-type">Long</span></div>
                <div class="param-row"><span class="param-name">foodName</span><span class="param-type">String</span></div>
                <div class="param-row"><span class="param-name">description</span><span class="param-type">String</span></div>
                <div class="param-row"><span class="param-name">categoryId</span><span class="param-type">Long</span></div>
                <div class="param-row"><span class="param-name">price</span><span class="param-type">BigDecimal</span></div>
                <div class="param-row"><span class="param-name">discountPrice</span><span class="param-type">BigDecimal</span><span class="param-opt">[Optional]</span></div>
                <div class="param-row"><span class="param-name">quantityAvailable</span><span class="param-type">Integer</span></div>
                <div class="param-row"><span class="param-name">imageUrl</span><span class="param-type">String</span></div>
                <div class="param-row"><span class="param-name">isVeg</span><span class="param-type">Boolean</span></div>
                <div class="param-row"><span class="param-name">isAvailable</span><span class="param-type">Boolean</span></div>
                <div class="param-row"><span class="param-name">preparationTime</span><span class="param-type">Integer</span><span class="param-comment">// minutes</span></div>
                <div class="param-row"><span class="param-name">ingredients</span><span class="param-type">String</span></div>
                <div class="param-row"><span class="param-name">tags</span><span class="param-type">String</span><span class="param-comment">// spicy, fast food etc</span></div>
            </div>

            <div class="method-block">
                <div class="method-sig"><span class="method-num">2</span> updateFood(UpdateFoodRequest)</div>
                <div class="method-return">Returns: <code>FoodItem</code></div>
                <div class="params-title">Parameters (UpdateFoodRequest):</div>
                <div class="param-row"><span class="param-name">foodId</span><span class="param-type">Long</span></div>
                <div class="param-row"><span class="param-name">foodName</span><span class="param-type">String</span><span class="param-opt">[Optional]</span></div>
                <div class="param-row"><span class="param-name">description</span><span class="param-type">String</span><span class="param-opt">[Optional]</span></div>
                <div class="param-row"><span class="param-name">categoryId</span><span class="param-type">Long</span><span class="param-opt">[Optional]</span></div>
                <div class="param-row"><span class="param-name">price</span><span class="param-type">BigDecimal</span><span class="param-opt">[Optional]</span></div>
                <div class="param-row"><span class="param-name">discountPrice</span><span class="param-type">BigDecimal</span><span class="param-opt">[Optional]</span></div>
                <div class="param-row"><span class="param-name">quantityAvailable</span><span class="param-type">Integer</span></div>
                <div class="param-row"><span class="param-name">imageUrl</span><span class="param-type">String</span></div>
                <div class="param-row"><span class="param-name">isVeg</span><span class="param-type">Boolean</span></div>
                <div class="param-row"><span class="param-name">isAvailable</span><span class="param-type">Boolean</span></div>
                <div class="param-row"><span class="param-name">preparationTime</span><span class="param-type">Integer</span></div>
                <div class="param-row"><span class="param-name">ingredients</span><span class="param-type">String</span></div>
                <div class="param-row"><span class="param-name">tags</span><span class="param-type">String</span></div>
            </div>

            <div class="method-block">
                <div class="method-sig"><span class="method-num">3</span> deleteFood(foodId)</div>
                <div class="method-return">Returns: <code>void</code></div>
                <div class="params-title">Parameters:</div>
                <div class="param-row"><span class="param-name">foodId</span><span class="param-type">Long</span></div>
            </div>

            <div class="method-block">
                <div class="method-sig"><span class="method-num">4</span> searchFood(SearchFoodRequest)</div>
                <div class="method-return">Returns: <code>Page&lt;FoodItem&gt;</code></div>
                <div class="params-title">Parameters (SearchFoodRequest):</div>
                <div class="param-row"><span class="param-name">keyword</span><span class="param-type">String</span></div>
                <div class="param-row"><span class="param-name">categoryId</span><span class="param-type">Long</span></div>
                <div class="param-row"><span class="param-name">restaurantId</span><span class="param-type">Long</span></div>
                <div class="param-row"><span class="param-name">minPrice</span><span class="param-type">BigDecimal</span></div>
                <div class="param-row"><span class="param-name">maxPrice</span><span class="param-type">BigDecimal</span></div>
                <div class="param-row"><span class="param-name">isVeg</span><span class="param-type">Boolean</span></div>
                <div class="param-row"><span class="param-name">sortBy</span><span class="param-type">String</span><span class="param-comment">// price_asc, rating, popularity</span></div>
                <div class="param-row"><span class="param-name">pageNo</span><span class="param-type">Integer</span></div>
                <div class="param-row"><span class="param-name">pageSize</span><span class="param-type">Integer</span></div>
            </div>
        </div>

        <!-- ========== RESTAURANT SERVICE ========== -->
        <div class="service-card">
            <h3>RestaurantService</h3>
            <p class="svc-desc">Restaurant register, update, nearby search aur open/close toggle. Geospatial query se user ke paas ke restaurants dikhate hain.</p>

            <div class="method-block">
                <div class="method-sig"><span class="method-num">1</span> registerRestaurant(RestaurantRequest)</div>
                <div class="method-return">Returns: <code>Restaurant</code></div>
                <div class="params-title">Parameters (RestaurantRequest):</div>
                <div class="param-row"><span class="param-name">name</span><span class="param-type">String</span></div>
                <div class="param-row"><span class="param-name">ownerId</span><span class="param-type">Long</span></div>
                <div class="param-row"><span class="param-name">address</span><span class="param-type">String</span></div>
                <div class="param-row"><span class="param-name">latitude</span><span class="param-type">Double</span></div>
                <div class="param-row"><span class="param-name">longitude</span><span class="param-type">Double</span></div>
                <div class="param-row"><span class="param-name">cuisineType</span><span class="param-type">String</span><span class="param-comment">// north indian, chinese etc</span></div>
                <div class="param-row"><span class="param-name">openingTime</span><span class="param-type">LocalTime</span></div>
                <div class="param-row"><span class="param-name">closingTime</span><span class="param-type">LocalTime</span></div>
                <div class="param-row"><span class="param-name">minOrderAmount</span><span class="param-type">BigDecimal</span></div>
                <div class="param-row"><span class="param-name">imageUrl</span><span class="param-type">String</span></div>
            </div>

            <div class="method-block">
                <div class="method-sig"><span class="method-num">2</span> updateRestaurant(UpdateRestaurantRequest)</div>
                <div class="method-return">Returns: <code>Restaurant</code></div>
                <div class="params-title">Parameters (UpdateRestaurantRequest):</div>
                <div class="param-row"><span class="param-name">restaurantId</span><span class="param-type">Long</span></div>
                <div class="param-row"><span class="param-name">name</span><span class="param-type">String</span><span class="param-opt">[Optional]</span></div>
                <div class="param-row"><span class="param-name">address</span><span class="param-type">String</span><span class="param-opt">[Optional]</span></div>
                <div class="param-row"><span class="param-name">cuisineType</span><span class="param-type">String</span><span class="param-opt">[Optional]</span></div>
                <div class="param-row"><span class="param-name">openingTime</span><span class="param-type">LocalTime</span><span class="param-opt">[Optional]</span></div>
                <div class="param-row"><span class="param-name">closingTime</span><span class="param-type">LocalTime</span><span class="param-opt">[Optional]</span></div>
                <div class="param-row"><span class="param-name">minOrderAmount</span><span class="param-type">BigDecimal</span><span class="param-opt">[Optional]</span></div>
            </div>

            <div class="method-block">
                <div class="method-sig"><span class="method-num">3</span> searchNearby(NearbySearchRequest)</div>
                <div class="method-return">Returns: <code>List&lt;Restaurant&gt;</code></div>
                <div class="params-title">Parameters (NearbySearchRequest):</div>
                <div class="param-row"><span class="param-name">latitude</span><span class="param-type">Double</span></div>
                <div class="param-row"><span class="param-name">longitude</span><span class="param-type">Double</span></div>
                <div class="param-row"><span class="param-name">radiusKm</span><span class="param-type">Double</span><span class="param-comment">// default 5km</span></div>
                <div class="param-row"><span class="param-name">cuisineType</span><span class="param-type">String</span><span class="param-opt">[Optional]</span></div>
                <div class="param-row"><span class="param-name">sortBy</span><span class="param-type">String</span><span class="param-comment">// rating, distance, delivery_time</span></div>
            </div>

            <div class="method-block">
                <div class="method-sig"><span class="method-num">4</span> toggleOpenClose(restaurantId, isOpen)</div>
                <div class="method-return">Returns: <code>void</code></div>
                <div class="params-title">Parameters:</div>
                <div class="param-row"><span class="param-name">restaurantId</span><span class="param-type">Long</span></div>
                <div class="param-row"><span class="param-name">isOpen</span><span class="param-type">Boolean</span></div>
            </div>
        </div>

        <!-- ========== CART SERVICE ========== -->
        <div class="service-card">
            <h3>CartService</h3>
            <p class="svc-desc">User ka cart manage karo &mdash; Redis me store hota hai (fast access). Ek time pe sirf ek restaurant ka cart allowed, dusre restaurant ka item add karne pe purana clear hoga.</p>

            <div class="method-block">
                <div class="method-sig"><span class="method-num">1</span> addToCart(AddToCartRequest)</div>
                <div class="method-return">Returns: <code>Cart</code></div>
                <div class="params-title">Parameters (AddToCartRequest):</div>
                <div class="param-row"><span class="param-name">userId</span><span class="param-type">Long</span></div>
                <div class="param-row"><span class="param-name">foodItemId</span><span class="param-type">Long</span></div>
                <div class="param-row"><span class="param-name">quantity</span><span class="param-type">Integer</span></div>
                <div class="param-row"><span class="param-name">specialInstructions</span><span class="param-type">String</span><span class="param-opt">[Optional]</span><span class="param-comment">// extra spicy, no onion</span></div>
            </div>

            <div class="method-block">
                <div class="method-sig"><span class="method-num">2</span> removeFromCart(userId, foodItemId)</div>
                <div class="method-return">Returns: <code>Cart</code></div>
                <div class="params-title">Parameters:</div>
                <div class="param-row"><span class="param-name">userId</span><span class="param-type">Long</span></div>
                <div class="param-row"><span class="param-name">foodItemId</span><span class="param-type">Long</span></div>
            </div>

            <div class="method-block">
                <div class="method-sig"><span class="method-num">3</span> getCart(userId)</div>
                <div class="method-return">Returns: <code>Cart</code></div>
                <div class="params-title">Parameters:</div>
                <div class="param-row"><span class="param-name">userId</span><span class="param-type">Long</span></div>
            </div>

            <div class="method-block">
                <div class="method-sig"><span class="method-num">4</span> clearCart(userId)</div>
                <div class="method-return">Returns: <code>void</code></div>
                <div class="params-title">Parameters:</div>
                <div class="param-row"><span class="param-name">userId</span><span class="param-type">Long</span></div>
            </div>
        </div>

        <!-- ========== ORDER SERVICE ========== -->
        <div class="service-card">
            <h3>OrderService</h3>
            <p class="svc-desc">Order place, cancel, status update aur history. Saga pattern se payment + inventory + delivery partner sab coordinate hota hai. Cancel sirf PLACED/ACCEPTED me allowed.</p>

            <div class="method-block">
                <div class="method-sig"><span class="method-num">1</span> placeOrder(PlaceOrderRequest)</div>
                <div class="method-return">Returns: <code>Order</code></div>
                <div class="params-title">Parameters (PlaceOrderRequest):</div>
                <div class="param-row"><span class="param-name">userId</span><span class="param-type">Long</span></div>
                <div class="param-row"><span class="param-name">restaurantId</span><span class="param-type">Long</span></div>
                <div class="param-row"><span class="param-name">items</span><span class="param-type">List&lt;OrderItemRequest&gt;</span><span class="param-comment">// [{foodItemId, qty}]</span></div>
                <div class="param-row"><span class="param-name">addressId</span><span class="param-type">Long</span></div>
                <div class="param-row"><span class="param-name">paymentMode</span><span class="param-type">PaymentMode</span><span class="param-comment">// UPI, CARD, COD</span></div>
                <div class="param-row"><span class="param-name">couponCode</span><span class="param-type">String</span><span class="param-opt">[Optional]</span></div>
            </div>

            <div class="method-block">
                <div class="method-sig"><span class="method-num">2</span> getOrder(orderId)</div>
                <div class="method-return">Returns: <code>Order</code></div>
                <div class="params-title">Parameters:</div>
                <div class="param-row"><span class="param-name">orderId</span><span class="param-type">String</span></div>
            </div>

            <div class="method-block">
                <div class="method-sig"><span class="method-num">3</span> cancelOrder(CancelOrderRequest)</div>
                <div class="method-return">Returns: <code>void</code></div>
                <div class="params-title">Parameters (CancelOrderRequest):</div>
                <div class="param-row"><span class="param-name">orderId</span><span class="param-type">String</span></div>
                <div class="param-row"><span class="param-name">userId</span><span class="param-type">Long</span></div>
                <div class="param-row"><span class="param-name">reason</span><span class="param-type">String</span><span class="param-opt">[Optional]</span></div>
            </div>

            <div class="method-block">
                <div class="method-sig"><span class="method-num">4</span> updateOrderStatus(StatusUpdateRequest)</div>
                <div class="method-return">Returns: <code>void</code></div>
                <div class="params-title">Parameters (StatusUpdateRequest):</div>
                <div class="param-row"><span class="param-name">orderId</span><span class="param-type">String</span></div>
                <div class="param-row"><span class="param-name">status</span><span class="param-type">OrderStatus</span><span class="param-comment">// ACCEPTED, PREPARING, READY etc</span></div>
            </div>

            <div class="method-block">
                <div class="method-sig"><span class="method-num">5</span> getUserOrders(userId, pageable)</div>
                <div class="method-return">Returns: <code>Page&lt;Order&gt;</code></div>
                <div class="params-title">Parameters:</div>
                <div class="param-row"><span class="param-name">userId</span><span class="param-type">Long</span></div>
                <div class="param-row"><span class="param-name">pageNo</span><span class="param-type">Integer</span></div>
                <div class="param-row"><span class="param-name">pageSize</span><span class="param-type">Integer</span></div>
            </div>
        </div>

        <!-- ========== DELIVERY SERVICE ========== -->
        <div class="service-card">
            <h3>DeliveryService</h3>
            <p class="svc-desc">Delivery partner assign karo (nearest available), live location update karo Redis me, order track karo aur delivered mark karo. Location har 5 sec update hoti hai.</p>

            <div class="method-block">
                <div class="method-sig"><span class="method-num">1</span> assignPartner(AssignPartnerRequest)</div>
                <div class="method-return">Returns: <code>DeliveryPartner</code></div>
                <div class="params-title">Parameters (AssignPartnerRequest):</div>
                <div class="param-row"><span class="param-name">orderId</span><span class="param-type">String</span></div>
                <div class="param-row"><span class="param-name">restaurantLat</span><span class="param-type">Double</span></div>
                <div class="param-row"><span class="param-name">restaurantLng</span><span class="param-type">Double</span></div>
                <div class="param-row"><span class="param-name">radiusKm</span><span class="param-type">Double</span><span class="param-comment">// default 5km, retry 8km, 12km</span></div>
            </div>

            <div class="method-block">
                <div class="method-sig"><span class="method-num">2</span> updateLocation(LocationUpdateRequest)</div>
                <div class="method-return">Returns: <code>void</code></div>
                <div class="params-title">Parameters (LocationUpdateRequest):</div>
                <div class="param-row"><span class="param-name">partnerId</span><span class="param-type">Long</span></div>
                <div class="param-row"><span class="param-name">latitude</span><span class="param-type">Double</span></div>
                <div class="param-row"><span class="param-name">longitude</span><span class="param-type">Double</span></div>
            </div>

            <div class="method-block">
                <div class="method-sig"><span class="method-num">3</span> trackOrder(orderId)</div>
                <div class="method-return">Returns: <code>DeliveryTracking</code> <span class="param-comment">// partner location + ETA + status</span></div>
                <div class="params-title">Parameters:</div>
                <div class="param-row"><span class="param-name">orderId</span><span class="param-type">String</span></div>
            </div>

            <div class="method-block">
                <div class="method-sig"><span class="method-num">4</span> markDelivered(DeliveryCompleteRequest)</div>
                <div class="method-return">Returns: <code>void</code></div>
                <div class="params-title">Parameters (DeliveryCompleteRequest):</div>
                <div class="param-row"><span class="param-name">orderId</span><span class="param-type">String</span></div>
                <div class="param-row"><span class="param-name">partnerId</span><span class="param-type">Long</span></div>
                <div class="param-row"><span class="param-name">deliveryOtp</span><span class="param-type">String</span><span class="param-comment">// customer verify karega</span></div>
            </div>
        </div>

        <!-- ========== PAYMENT SERVICE ========== -->
        <div class="service-card">
            <h3>PaymentService</h3>
            <p class="svc-desc">Payment process karo (UPI/Card/Wallet/COD), verify karo aur cancel pe refund karo. Idempotency key se double payment nahi hoga.</p>

            <div class="method-block">
                <div class="method-sig"><span class="method-num">1</span> processPayment(PaymentRequest)</div>
                <div class="method-return">Returns: <code>PaymentResponse</code></div>
                <div class="params-title">Parameters (PaymentRequest):</div>
                <div class="param-row"><span class="param-name">orderId</span><span class="param-type">String</span></div>
                <div class="param-row"><span class="param-name">amount</span><span class="param-type">BigDecimal</span></div>
                <div class="param-row"><span class="param-name">paymentMode</span><span class="param-type">PaymentMode</span><span class="param-comment">// UPI, CARD, COD</span></div>
                <div class="param-row"><span class="param-name">idempotencyKey</span><span class="param-type">String</span><span class="param-comment">// duplicate payment block</span></div>
            </div>

            <div class="method-block">
                <div class="method-sig"><span class="method-num">2</span> verifyPayment(paymentId)</div>
                <div class="method-return">Returns: <code>PaymentStatus</code></div>
                <div class="params-title">Parameters:</div>
                <div class="param-row"><span class="param-name">paymentId</span><span class="param-type">String</span></div>
            </div>

            <div class="method-block">
                <div class="method-sig"><span class="method-num">3</span> processRefund(RefundRequest)</div>
                <div class="method-return">Returns: <code>RefundResponse</code></div>
                <div class="params-title">Parameters (RefundRequest):</div>
                <div class="param-row"><span class="param-name">orderId</span><span class="param-type">String</span></div>
                <div class="param-row"><span class="param-name">amount</span><span class="param-type">BigDecimal</span></div>
                <div class="param-row"><span class="param-name">reason</span><span class="param-type">String</span></div>
            </div>
        </div>

        <!-- ========== COUPON SERVICE ========== -->
        <div class="service-card">
            <h3>CouponService</h3>
            <p class="svc-desc">Coupon validate karo (active? expired? min order?), discount calculate karo (% ya flat), aur use count track karo. Har coupon ki usage limit hoti hai.</p>

            <div class="method-block">
                <div class="method-sig"><span class="method-num">1</span> validateCoupon(ValidateCouponRequest)</div>
                <div class="method-return">Returns: <code>CouponValidationResult</code></div>
                <div class="params-title">Parameters (ValidateCouponRequest):</div>
                <div class="param-row"><span class="param-name">couponCode</span><span class="param-type">String</span></div>
                <div class="param-row"><span class="param-name">orderAmount</span><span class="param-type">BigDecimal</span></div>
                <div class="param-row"><span class="param-name">userId</span><span class="param-type">Long</span><span class="param-comment">// check if already used by this user</span></div>
            </div>

            <div class="method-block">
                <div class="method-sig"><span class="method-num">2</span> calculateDiscount(couponCode, orderAmount)</div>
                <div class="method-return">Returns: <code>BigDecimal</code> <span class="param-comment">// final discount amount</span></div>
                <div class="params-title">Parameters:</div>
                <div class="param-row"><span class="param-name">couponCode</span><span class="param-type">String</span></div>
                <div class="param-row"><span class="param-name">orderAmount</span><span class="param-type">BigDecimal</span></div>
            </div>

            <div class="method-block">
                <div class="method-sig"><span class="method-num">3</span> markCouponUsed(couponId, userId)</div>
                <div class="method-return">Returns: <code>void</code></div>
                <div class="params-title">Parameters:</div>
                <div class="param-row"><span class="param-name">couponId</span><span class="param-type">Long</span></div>
                <div class="param-row"><span class="param-name">userId</span><span class="param-type">Long</span></div>
            </div>
        </div>

        <!-- ========== REVIEW SERVICE ========== -->
        <div class="service-card">
            <h3>ReviewService</h3>
            <p class="svc-desc">Order delivered hone ke baad hi review de sako. Review submit karne pe restaurant ki avg rating auto-update hoti hai (denormalized field).</p>

            <div class="method-block">
                <div class="method-sig"><span class="method-num">1</span> addReview(ReviewRequest)</div>
                <div class="method-return">Returns: <code>Review</code></div>
                <div class="params-title">Parameters (ReviewRequest):</div>
                <div class="param-row"><span class="param-name">userId</span><span class="param-type">Long</span></div>
                <div class="param-row"><span class="param-name">orderId</span><span class="param-type">Long</span></div>
                <div class="param-row"><span class="param-name">restaurantId</span><span class="param-type">Long</span></div>
                <div class="param-row"><span class="param-name">rating</span><span class="param-type">Integer</span><span class="param-comment">// 1 to 5</span></div>
                <div class="param-row"><span class="param-name">comment</span><span class="param-type">String</span><span class="param-opt">[Optional]</span></div>
                <div class="param-row"><span class="param-name">deliveryRating</span><span class="param-type">Integer</span><span class="param-comment">// 1 to 5, delivery partner ke liye</span></div>
            </div>

            <div class="method-block">
                <div class="method-sig"><span class="method-num">2</span> getReviews(restaurantId, pageable)</div>
                <div class="method-return">Returns: <code>Page&lt;Review&gt;</code></div>
                <div class="params-title">Parameters:</div>
                <div class="param-row"><span class="param-name">restaurantId</span><span class="param-type">Long</span></div>
                <div class="param-row"><span class="param-name">pageNo</span><span class="param-type">Integer</span></div>
                <div class="param-row"><span class="param-name">pageSize</span><span class="param-type">Integer</span></div>
            </div>

            <div class="method-block">
                <div class="method-sig"><span class="method-num">3</span> updateRestaurantRating(restaurantId)</div>
                <div class="method-return">Returns: <code>void</code> <span class="param-comment">// avg rating recalculate karke restaurant table update</span></div>
                <div class="params-title">Parameters:</div>
                <div class="param-row"><span class="param-name">restaurantId</span><span class="param-type">Long</span></div>
            </div>
        </div>

    </div>
</div>

<!-- ============ 5. DATABASE ============ -->
<div class="section theme-pink">
    <div class="section-title"><span class="section-num">5</span>Database Schema</div>

    <div class="sub-heading" style="color:#ff80ab;border-color:#ff80ab">Database Technology Stack</div>
    <p style="color:#b0bec5;font-size:.9em;margin-bottom:16px"><strong style="color:#ff80ab">SQL kyun?</strong> food_items aur food_category (aur restaurant) ke beech relations, foreign keys, joins aur transactional consistency maintain karni hoti hai, jo relational databases better handle karte hain.<br><strong style="color:#ff80ab">NoSQL kyun nahi?</strong> isme complex relations, joins, foreign key constraints aur strong transactional consistency efficiently maintain karna comparatively difficult hota hai.</p>
    <div class="dbtech-grid">
        <div class="dbtech-card">
            <div class="dbtech-name">PostgreSQL <span class="dbtech-type">RDBMS</span></div>
            <div class="dbtech-usage">Restaurants, food items, orders, users &mdash; ACID transactions for structured relational data</div>
            <div class="dbtech-tables"><span>restaurants</span><span>food_items</span><span>food_category</span><span>orders</span><span>users</span></div>
        </div>
        <div class="dbtech-card">
            <div class="dbtech-name">Redis <span class="dbtech-type">In-Memory</span></div>
            <div class="dbtech-usage">Cart sessions, restaurant menu cache, delivery partner live location, OTP storage</div>
            <div class="dbtech-tables"><span>cart:{userId}</span><span>menu:{restaurantId}</span><span>loc:{partnerId}</span></div>
        </div>
        <div class="dbtech-card">
            <div class="dbtech-name">Elasticsearch <span class="dbtech-type">Search Engine</span></div>
            <div class="dbtech-usage">Food search, restaurant search &mdash; fuzzy matching, auto-suggest, filters</div>
            <div class="dbtech-tables"><span>food_items</span><span>restaurants</span></div>
        </div>
        <div class="dbtech-card">
            <div class="dbtech-name">Kafka <span class="dbtech-type">Message Queue</span></div>
            <div class="dbtech-usage">Order events pipeline &mdash; order-placed &rarr; restaurant-accepted &rarr; partner-assigned &rarr; delivered</div>
            <div class="dbtech-tables"><span>order-events</span><span>location-updates</span></div>
        </div>
        <div class="dbtech-card">
            <div class="dbtech-name">S3 <span class="dbtech-type">Blob Storage</span></div>
            <div class="dbtech-usage">Food images, restaurant logos, menu PDFs</div>
            <div class="dbtech-tables"><span>food-images</span><span>restaurant-assets</span></div>
        </div>
    </div>

    <div class="db-grid">
        <div class="db-table">
            <h3>food_items</h3>
            <ul>
                <li><span class="pk">id BIGINT PK</span></li>
                <li><span class="fk">restaurant_id BIGINT FK</span> <span class="idx">[INDEX]</span></li>
                <li><span class="fk">category_id BIGINT FK</span> <span class="idx">[INDEX]</span></li>
                <li>food_name VARCHAR(200) <span class="idx">[FULLTEXT]</span></li>
                <li>description TEXT</li>
                <li>price DECIMAL(10,2)</li>
                <li>discount_price DECIMAL(10,2) <span class="idx">[NULLABLE]</span></li>
                <li>quantity_available INT</li>
                <li>image_url VARCHAR(500)</li>
                <li>is_veg BOOLEAN <span class="idx">[INDEX]</span></li>
                <li>is_available BOOLEAN <span class="idx">[INDEX]</span></li>
                <li>preparation_time INT</li>
                <li>ingredients TEXT</li>
                <li>tags VARCHAR(255)</li>
                <li>created_at TIMESTAMP</li>
                <li>updated_at TIMESTAMP</li>
            </ul>
        </div>
        <div class="db-table">
            <h3>food_category</h3>
            <ul>
                <li><span class="pk">id BIGINT PK</span></li>
                <li>category_name VARCHAR(100)</li>
                <li>description VARCHAR(255)</li>
                <li>image_url VARCHAR(500)</li>
                <li>created_at TIMESTAMP</li>
                <li>updated_at TIMESTAMP</li>
            </ul>
        </div>
        <div class="db-table">
            <h3>restaurants</h3>
            <ul>
                <li><span class="pk">id BIGINT PK</span></li>
                <li>name VARCHAR(200)</li>
                <li><span class="fk">owner_id BIGINT FK</span></li>
                <li>address TEXT</li>
                <li>latitude DOUBLE</li>
                <li>longitude DOUBLE</li>
                <li>cuisine_type VARCHAR(200)</li>
                <li>avg_rating DECIMAL(2,1)</li>
                <li>is_open BOOLEAN</li>
                <li>opening_time TIME</li>
                <li>closing_time TIME</li>
                <li>avg_delivery_time INT</li>
                <li>min_order_amount DECIMAL(10,2)</li>
                <li>status ENUM <span class="idx">[INDEX]</span></li>
                <li>created_at TIMESTAMP</li>
            </ul>
        </div>
        <div class="db-table">
            <h3>orders</h3>
            <ul>
                <li><span class="pk">id BIGINT PK</span></li>
                <li>order_id VARCHAR(36) <span class="idx">[UNIQUE]</span></li>
                <li><span class="fk">user_id BIGINT FK</span> <span class="idx">[INDEX]</span></li>
                <li><span class="fk">restaurant_id BIGINT FK</span> <span class="idx">[INDEX]</span></li>
                <li><span class="fk">delivery_partner_id BIGINT FK</span></li>
                <li><span class="fk">delivery_address_id BIGINT FK</span></li>
                <li>total_amount DECIMAL(10,2)</li>
                <li>delivery_fee DECIMAL(10,2)</li>
                <li>discount DECIMAL(10,2)</li>
                <li>payment_id VARCHAR(100)</li>
                <li>status ENUM <span class="idx">[INDEX]</span></li>
                <li>estimated_delivery_time TIMESTAMP</li>
                <li>created_at TIMESTAMP <span class="idx">[INDEX]</span></li>
            </ul>
        </div>
        <div class="db-table">
            <h3>order_items</h3>
            <ul>
                <li><span class="pk">id BIGINT PK</span></li>
                <li><span class="fk">order_id BIGINT FK</span> <span class="idx">[INDEX]</span></li>
                <li><span class="fk">food_item_id BIGINT FK</span></li>
                <li>quantity INT</li>
                <li>unit_price DECIMAL(10,2)</li>
                <li>total_price DECIMAL(10,2)</li>
                <li>special_instructions TEXT</li>
            </ul>
        </div>
        <div class="db-table">
            <h3>delivery_partners</h3>
            <ul>
                <li><span class="pk">id BIGINT PK</span></li>
                <li>name VARCHAR(100)</li>
                <li>phone VARCHAR(15) <span class="idx">[UNIQUE]</span></li>
                <li>vehicle_type VARCHAR(50)</li>
                <li>latitude DOUBLE</li>
                <li>longitude DOUBLE</li>
                <li>is_available BOOLEAN <span class="idx">[INDEX]</span></li>
                <li>rating DECIMAL(2,1)</li>
                <li>status ENUM <span class="idx">[INDEX]</span></li>
            </ul>
        </div>
        <div class="db-table">
            <h3>reviews</h3>
            <ul>
                <li><span class="pk">id BIGINT PK</span></li>
                <li><span class="fk">user_id BIGINT FK</span></li>
                <li><span class="fk">order_id BIGINT FK</span></li>
                <li><span class="fk">restaurant_id BIGINT FK</span> <span class="idx">[INDEX]</span></li>
                <li>rating TINYINT <span class="idx">[INDEX]</span></li>
                <li>comment TEXT</li>
                <li>delivery_rating TINYINT</li>
                <li>created_at TIMESTAMP</li>
            </ul>
        </div>
        <div class="db-table">
            <h3>coupons</h3>
            <ul>
                <li><span class="pk">id BIGINT PK</span></li>
                <li>code VARCHAR(50) <span class="idx">[UNIQUE]</span></li>
                <li>discount_type ENUM</li>
                <li>discount_value DECIMAL(10,2)</li>
                <li>min_order_amount DECIMAL(10,2)</li>
                <li>max_discount DECIMAL(10,2)</li>
                <li>valid_from TIMESTAMP</li>
                <li>valid_till TIMESTAMP</li>
                <li>usage_limit INT</li>
                <li>is_active BOOLEAN</li>
            </ul>
        </div>
    </div>

</div>

<!-- ============ 6. APIs ============ -->
<div class="section theme-teal">
    <div class="section-title"><span class="section-num">6</span>REST API Endpoints</div>
    <div class="api-grid">
        <div class="api-card">
            <div class="api-header"><span class="api-method method-post">POST</span><span class="api-path">/api/v1/foods</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Request Body (FoodRequest)</div>{ <span class="key">"restaurantId"</span>: <span class="val">1</span>, <span class="key">"foodName"</span>: <span class="val">"Paneer Butter Masala"</span>, <span class="key">"categoryId"</span>: <span class="val">3</span>, <span class="key">"price"</span>: <span class="val">249.00</span>, <span class="key">"discountPrice"</span>: <span class="val">199.00</span>, <span class="key">"isVeg"</span>: <span class="val">true</span>, <span class="key">"preparationTime"</span>: <span class="val">20</span>, <span class="key">"ingredients"</span>: <span class="val">"paneer, butter, cream, tomato"</span>, <span class="key">"tags"</span>: <span class="val">"north indian, bestseller"</span> }</div>
                <div class="api-json"><div class="label">Response 201</div>{ <span class="key">"id"</span>: <span class="val">42</span>, <span class="key">"foodName"</span>: <span class="val">"Paneer Butter Masala"</span>, <span class="key">"price"</span>: <span class="val">249.00</span>, <span class="key">"isAvailable"</span>: <span class="val">true</span> }</div>
            </div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-put">PUT</span><span class="api-path">/api/v1/foods/{foodId}</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Request Body (UpdateFoodRequest)</div>{ <span class="key">"foodName"</span>: <span class="val">"Paneer Butter Masala (Large)"</span>, <span class="key">"price"</span>: <span class="val">299.00</span>, <span class="key">"isAvailable"</span>: <span class="val">true</span> }</div>
                <div class="api-json"><div class="label">Response 200</div>{ <span class="key">"id"</span>: <span class="val">42</span>, <span class="key">"foodName"</span>: <span class="val">"Paneer Butter Masala (Large)"</span>, <span class="key">"price"</span>: <span class="val">299.00</span>, <span class="key">"updated"</span>: <span class="val">true</span> }</div>
            </div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-delete">DELETE</span><span class="api-path">/api/v1/foods/{foodId}</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Path Param</div><span class="key">foodId</span>: <span class="val">42</span></div>
                <div class="api-json"><div class="label">Response 200</div>{ <span class="key">"deleted"</span>: <span class="val">true</span> }</div>
            </div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-get">GET</span><span class="api-path">/api/v1/foods/search?keyword={}&amp;categoryId={}&amp;isVeg={}&amp;minPrice={}&amp;maxPrice={}&amp;sortBy={}&amp;page={}&amp;size={}</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Query Params (SearchFoodRequest)</div><span class="key">keyword</span>: <span class="val">"paneer"</span><br><span class="key">categoryId</span>: <span class="val">3</span><br><span class="key">isVeg</span>: <span class="val">true</span><br><span class="key">minPrice</span>: <span class="val">100</span><br><span class="key">maxPrice</span>: <span class="val">500</span><br><span class="key">sortBy</span>: <span class="val">"price_asc | rating | popularity"</span></div>
                <div class="api-json"><div class="label">Response 200</div>{ <span class="key">"foods"</span>: [{ <span class="key">"id"</span>: <span class="val">42</span>, <span class="key">"foodName"</span>: <span class="val">"Paneer Butter Masala"</span>, <span class="key">"price"</span>: <span class="val">249</span> }], <span class="key">"totalResults"</span>: <span class="val">38</span> }</div>
            </div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-post">POST</span><span class="api-path">/api/v1/orders</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Request Body</div>{ <span class="key">"restaurantId"</span>: <span class="val">1</span>, <span class="key">"items"</span>: [{ <span class="key">"foodItemId"</span>: <span class="val">42</span>, <span class="key">"qty"</span>: <span class="val">2</span> }], <span class="key">"addressId"</span>: <span class="val">5</span>, <span class="key">"paymentMode"</span>: <span class="val">"UPI"</span>, <span class="key">"couponCode"</span>: <span class="val">"SAVE50"</span> }</div>
                <div class="api-json"><div class="label">Response 201</div>{ <span class="key">"orderId"</span>: <span class="val">"ORD-abc123"</span>, <span class="key">"status"</span>: <span class="val">"PLACED"</span>, <span class="key">"total"</span>: <span class="val">448</span>, <span class="key">"estimatedDelivery"</span>: <span class="val">"35 mins"</span> }</div>
            </div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-get">GET</span><span class="api-path">/api/v1/orders/{orderId}/track</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Response 200</div>{ <span class="key">"orderId"</span>: <span class="val">"ORD-abc123"</span>, <span class="key">"status"</span>: <span class="val">"ON_THE_WAY"</span>, <span class="key">"partnerName"</span>: <span class="val">"Rahul"</span>, <span class="key">"partnerLat"</span>: <span class="val">28.612</span>, <span class="key">"partnerLng"</span>: <span class="val">77.231</span>, <span class="key">"eta"</span>: <span class="val">"8 mins"</span> }</div>
            </div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-get">GET</span><span class="api-path">/api/v1/restaurants/nearby?lat={}&amp;lng={}&amp;radius={}</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Query Params</div><span class="key">lat</span>: <span class="val">28.6139</span><br><span class="key">lng</span>: <span class="val">77.2090</span><br><span class="key">radius</span>: <span class="val">5</span> (km)</div>
                <div class="api-json"><div class="label">Response 200</div>{ <span class="key">"restaurants"</span>: [{ <span class="key">"id"</span>: <span class="val">1</span>, <span class="key">"name"</span>: <span class="val">"Pizza Palace"</span>, <span class="key">"avgRating"</span>: <span class="val">4.3</span>, <span class="key">"deliveryTime"</span>: <span class="val">"30 mins"</span> }] }</div>
            </div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-post">POST</span><span class="api-path">/api/v1/cart/add</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Request Body</div>{ <span class="key">"foodItemId"</span>: <span class="val">42</span>, <span class="key">"quantity"</span>: <span class="val">2</span> }</div>
                <div class="api-json"><div class="label">Response 200</div>{ <span class="key">"cartId"</span>: <span class="val">1</span>, <span class="key">"restaurantId"</span>: <span class="val">1</span>, <span class="key">"items"</span>: [...], <span class="key">"total"</span>: <span class="val">498</span> }</div>
            </div>
        </div>
    </div>
</div>

<!-- ============ 7. KEY ARCHITECTURE ============ -->
<div class="section theme-red">
    <div class="section-title"><span class="section-num">7</span>Key Architecture Components</div>

    <div class="sub-heading" style="color:#ff5252;border-color:#ff5252">Order Placement Flow &mdash; Saga Pattern</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">OrderServiceImpl.java</span></div><pre class="code-block">
<span class="ann">@Service</span>
<span class="kw">class</span> <span class="cn">OrderServiceImpl</span> <span class="kw">implements</span> <span class="iface">IOrderService</span> {

    <span class="ann">@Override</span>
    <span class="ann">@Transactional</span>
    <span class="kw">public</span> Order <span class="fn">placeOrder</span>(Long userId, PlaceOrderRequest req) {
        <span class="cm">// 1. Cart validate karo</span>
        Cart cart = cartService.getCart(userId);

        <span class="cm">// 2. Coupon apply karo (agar diya hai)</span>
        BigDecimal discount = BigDecimal.ZERO;
        <span class="kw">if</span> (req.getCouponCode() != <span class="kw">null</span>)
            discount = couponService.calculateDiscount(req.getCouponCode(), cart.getTotalAmount());

        <span class="cm">// 3. Order create karo</span>
        Order order = OrderFactory.create(userId, cart, req.getAddressId(), discount);
        orderRepo.save(order);

        <span class="cm">// 4. Payment process karo (Saga Step 1)</span>
        <span class="kw">try</span> {
            paymentService.processPayment(order.getOrderId(), order.getTotalAmount(), req.getPaymentMode());
        } <span class="kw">catch</span> (PaymentFailedException e) {
            order.setStatus(OrderStatus.CANCELLED);  <span class="cm">// Compensate</span>
            <span class="kw">throw</span> e;
        }

        <span class="cm">// 5. Restaurant ko notify karo via Kafka</span>
        eventPublisher.publishEvent(<span class="kw">new</span> OrderPlacedEvent(order));
        cartService.clearCart(userId);
        <span class="kw">return</span> order;
    }
}
    </pre></div>

    <div class="sub-heading" style="color:#ff5252;border-color:#ff5252">Delivery Partner Assignment &mdash; Nearest Available</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">DeliveryServiceImpl.java</span></div><pre class="code-block">
<span class="ann">@Service</span>
<span class="kw">class</span> <span class="cn">DeliveryServiceImpl</span> {

    <span class="kw">public</span> DeliveryPartner <span class="fn">assignPartner</span>(String orderId, Double lat, Double lng) {
        <span class="cm">// Nearest available partner dhundhho (Redis GEO)</span>
        List&lt;DeliveryPartner&gt; nearby = partnerRepo.findNearestAvailable(lat, lng);
        <span class="kw">if</span> (nearby.isEmpty()) <span class="kw">throw new</span> NoPartnerAvailableException();

        DeliveryPartner partner = nearby.get(0);
        partner.setStatus(PartnerStatus.ON_DELIVERY);
        partnerRepo.save(partner);
        <span class="kw">return</span> partner;
    }

    <span class="kw">public void</span> <span class="fn">updateLocation</span>(Long partnerId, Double lat, Double lng) {
        <span class="cm">// Redis me live location store (har 5 sec update)</span>
        redisTemplate.opsForGeo().add(<span class="st">"partner-loc"</span>, <span class="kw">new</span> Point(lng, lat), partnerId.toString());
    }
}
    </pre></div>

    <div class="sub-heading" style="color:#ff5252;border-color:#ff5252">Cart &mdash; Redis Based (Single Restaurant Rule)</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">CartServiceImpl.java</span></div><pre class="code-block">
<span class="ann">@Service</span>
<span class="kw">class</span> <span class="cn">CartServiceImpl</span> {

    <span class="kw">public</span> Cart <span class="fn">addToCart</span>(Long userId, Long foodItemId, <span class="tp">int</span> qty) {
        FoodItem food = foodRepo.findById(foodItemId).orElseThrow();
        String cartKey = <span class="st">"cart:"</span> + userId;

        <span class="cm">// Dusre restaurant ka item hai to purana cart clear karo</span>
        Cart existing = getCart(userId);
        <span class="kw">if</span> (existing != <span class="kw">null</span> &amp;&amp; !existing.getRestaurantId().equals(food.getRestaurantId()))
            clearCart(userId);

        redisTemplate.opsForHash().put(cartKey, foodItemId.toString(), <span class="kw">new</span> CartItem(food, qty));
        redisTemplate.expire(cartKey, Duration.ofHours(24));  <span class="cm">// 24hr TTL</span>
        <span class="kw">return</span> getCart(userId);
    }
}
    </pre></div>
</div>

<!-- ============ 8. DESIGN PATTERNS ============ -->
<div class="section theme-cyan">
    <div class="section-title"><span class="section-num">8</span>Design Patterns</div>

    <div class="sub-heading" style="color:#18ffff;border-color:#18ffff">Strategy Pattern &mdash; Delivery Fee Calculation</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">DeliveryFeeStrategy.java</span></div><pre class="code-block">
<span class="kw">interface</span> <span class="iface">DeliveryFeeStrategy</span> {
    BigDecimal <span class="fn">calculate</span>(Double distanceKm, BigDecimal orderAmount);
}

<span class="kw">class</span> <span class="cn">NormalFeeStrategy</span> <span class="kw">implements</span> <span class="iface">DeliveryFeeStrategy</span> {
    <span class="kw">public</span> BigDecimal <span class="fn">calculate</span>(Double distanceKm, BigDecimal orderAmount) {
        <span class="kw">if</span> (orderAmount.compareTo(<span class="kw">new</span> BigDecimal(<span class="st">"500"</span>)) &gt;= 0) <span class="kw">return</span> BigDecimal.ZERO;
        <span class="kw">return</span> BigDecimal.valueOf(distanceKm * 8);  <span class="cm">// Rs 8/km</span>
    }
}

<span class="kw">class</span> <span class="cn">SurgeFeeStrategy</span> <span class="kw">implements</span> <span class="iface">DeliveryFeeStrategy</span> {
    <span class="kw">public</span> BigDecimal <span class="fn">calculate</span>(Double distanceKm, BigDecimal orderAmount) {
        <span class="kw">return</span> BigDecimal.valueOf(distanceKm * 15);  <span class="cm">// Rain/peak = Rs 15/km</span>
    }
}
    </pre></div>

    <div class="sub-heading" style="color:#18ffff;border-color:#18ffff">State Pattern &mdash; Order Lifecycle</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">OrderStateMachine.java</span></div><pre class="code-block">
<span class="cm">// PLACED &rarr; ACCEPTED &rarr; PREPARING &rarr; READY_FOR_PICKUP &rarr; PICKED_UP &rarr; ON_THE_WAY &rarr; DELIVERED</span>
<span class="cm">// PLACED/ACCEPTED &rarr; CANCELLED</span>

<span class="kw">class</span> <span class="cn">OrderStateMachine</span> {
    <span class="kw">private static final</span> Map&lt;OrderStatus, Set&lt;OrderStatus&gt;&gt; TRANSITIONS = Map.of(
        PLACED,            Set.of(ACCEPTED, CANCELLED),
        ACCEPTED,          Set.of(PREPARING, CANCELLED),
        PREPARING,         Set.of(READY_FOR_PICKUP),
        READY_FOR_PICKUP,  Set.of(PICKED_UP),
        PICKED_UP,         Set.of(ON_THE_WAY),
        ON_THE_WAY,        Set.of(DELIVERED)
    );

    <span class="kw">public void</span> <span class="fn">transition</span>(Order order, OrderStatus newStatus) {
        Set&lt;OrderStatus&gt; allowed = TRANSITIONS.get(order.getStatus());
        <span class="kw">if</span> (!allowed.contains(newStatus))
            <span class="kw">throw new</span> InvalidStateTransitionException(order.getStatus(), newStatus);
        order.setStatus(newStatus);
    }
}
    </pre></div>

    <div class="sub-heading" style="color:#18ffff;border-color:#18ffff">Observer Pattern &mdash; Order Events</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">OrderEventListeners.java</span></div><pre class="code-block">
<span class="ann">@Component</span>
<span class="kw">class</span> <span class="cn">RestaurantNotifyListener</span> {
    <span class="ann">@EventListener</span>
    <span class="kw">public void</span> <span class="fn">onOrderPlaced</span>(OrderPlacedEvent event) {
        notificationService.notifyRestaurant(event.getOrder().getRestaurantId());
    }
}

<span class="ann">@Component</span>
<span class="kw">class</span> <span class="cn">DeliveryAssignListener</span> {
    <span class="ann">@EventListener</span>
    <span class="kw">public void</span> <span class="fn">onOrderAccepted</span>(OrderAcceptedEvent event) {
        deliveryService.assignPartner(event.getOrderId(), event.getRestaurantLat(), event.getRestaurantLng());
    }
}
    </pre></div>

    <div class="pattern-grid" style="margin-top:20px">
        <div class="pattern-card">
            <div class="pattern-name">Strategy</div>
            <div class="pattern-use">Delivery fee &mdash; normal, surge, rain pricing</div>
        </div>
        <div class="pattern-card">
            <div class="pattern-name">Observer</div>
            <div class="pattern-use">Order events &rarr; restaurant notify, partner assign</div>
        </div>
        <div class="pattern-card">
            <div class="pattern-name">State</div>
            <div class="pattern-use">Order lifecycle PLACED &rarr; DELIVERED</div>
        </div>
        <div class="pattern-card">
            <div class="pattern-name">Factory</div>
            <div class="pattern-use">OrderFactory &mdash; cart se Order construct</div>
        </div>
        <div class="pattern-card">
            <div class="pattern-name">Saga</div>
            <div class="pattern-use">Order placement &mdash; payment fail pe rollback</div>
        </div>
    </div>
</div>

<!-- ============ 9. SEQUENCE FLOW ============ -->
<div class="section theme-lime">
    <div class="section-title"><span class="section-num">9</span>Sequence Flow &mdash; Order to Delivery</div>
    <div class="flow-container">
        <div class="flow-box flow-green">User searches food / browses restaurant</div>
        <div class="flow-arrow arrow-green"></div>
        <div class="flow-box flow-blue">Add items to cart (Redis)</div>
        <div class="flow-arrow arrow-blue"></div>
        <div class="flow-box flow-purple">Apply coupon + Checkout</div>
        <div class="flow-arrow arrow-purple"></div>
        <div class="flow-box flow-teal">Payment process (UPI/Card/COD)</div>
        <div class="flow-arrow arrow-teal"></div>
        <div class="flow-box flow-orange">Order PLACED &rarr; Restaurant notified (Kafka)</div>
        <div class="flow-arrow arrow-orange"></div>
        <div class="flow-box flow-yellow">Restaurant ACCEPTED &rarr; PREPARING</div>
        <div class="flow-arrow arrow-orange"></div>
        <div class="flow-box flow-green">READY_FOR_PICKUP &rarr; Delivery partner assigned</div>
        <div class="flow-arrow arrow-green"></div>
        <div class="flow-box flow-blue">PICKED_UP &rarr; ON_THE_WAY (live tracking)</div>
        <div class="flow-arrow arrow-blue"></div>
        <div class="flow-box flow-purple">DELIVERED &rarr; Review prompt</div>
    </div>
</div>

<!-- ============ 10. CAPACITY ESTIMATION ============ -->
<div class="section theme-deepblue">
    <div class="section-title"><span class="section-num">10</span>Capacity Estimation</div>
    <div class="assumption-box">
        <h4>Base Assumptions</h4>
        <div class="assumption-row"><span class="calc-label">Daily Active Users (DAU)</span><span class="calc-value">10 Million</span></div>
        <div class="assumption-row"><span class="calc-label">Total restaurants on platform</span><span class="calc-value">500K</span></div>
        <div class="assumption-row"><span class="calc-label">Avg orders per day</span><span class="calc-value">2 Million</span></div>
        <div class="assumption-row"><span class="calc-label">Avg food items per restaurant</span><span class="calc-value">50</span></div>
        <div class="assumption-row"><span class="calc-label">Delivery partners active</span><span class="calc-value">200K</span></div>
    </div>
    <div class="cap-grid">
        <div class="cap-card">
            <h4>Search Traffic</h4>
            <div class="calc-row"><span class="calc-label">Searches/day (5 per user)</span><span class="calc-value">50M</span></div>
            <div class="calc-row"><span class="calc-label">Searches/sec (avg)</span><span class="calc-value">~580 QPS</span></div>
            <div class="calc-row"><span class="calc-label">Peak (lunch/dinner 5x)</span><span class="calc-value">~2,900 QPS</span></div>
            <div class="calc-result"><span class="calc-label">Elasticsearch Cluster</span><span class="calc-value">10+ nodes</span></div>
        </div>
        <div class="cap-card">
            <h4>Order Processing</h4>
            <div class="calc-row"><span class="calc-label">Orders/day</span><span class="calc-value">2M</span></div>
            <div class="calc-row"><span class="calc-label">Orders/sec (avg)</span><span class="calc-value">~23 QPS</span></div>
            <div class="calc-row"><span class="calc-label">Peak dinner time (10x)</span><span class="calc-value">~230 QPS</span></div>
            <div class="calc-result"><span class="calc-label">Write Throughput</span><span class="calc-value">~230 TPS (peak)</span></div>
        </div>
        <div class="cap-card">
            <h4>Location Updates</h4>
            <div class="calc-row"><span class="calc-label">Active delivery partners</span><span class="calc-value">200K</span></div>
            <div class="calc-row"><span class="calc-label">Update frequency</span><span class="calc-value">Every 5 sec</span></div>
            <div class="calc-row"><span class="calc-label">Location writes/sec</span><span class="calc-value">~40K QPS</span></div>
            <div class="calc-result"><span class="calc-label">Redis GEO cluster</span><span class="calc-value">5+ nodes</span></div>
        </div>
        <div class="cap-card">
            <h4>Storage</h4>
            <div class="calc-row"><span class="calc-label">Food items (25M x 2KB)</span><span class="calc-value">~50 GB</span></div>
            <div class="calc-row"><span class="calc-label">Food images (25M x 3 x 300KB)</span><span class="calc-value">~22 TB (S3)</span></div>
            <div class="calc-row"><span class="calc-label">Orders/year (2M/day x 1KB)</span><span class="calc-value">~730 GB</span></div>
            <div class="calc-result"><span class="calc-label">Total</span><span class="calc-value">~1 TB DB + 22 TB S3</span></div>
        </div>
    </div>
</div>

<!-- ============ 11. BOTTLENECKS ============ -->
<div class="section theme-red">
    <div class="section-title"><span class="section-num">11</span>Bottlenecks &amp; Solutions</div>
    <div class="bottleneck-grid">
        <div class="bottleneck-item">
            <span class="bottleneck-problem">Peak hour order spike (lunch/dinner)</span>
            <span class="bottleneck-arrow">&#10132;</span>
            <span class="bottleneck-solution">Kafka queue se async processing + horizontal scaling of order service</span>
        </div>
        <div class="bottleneck-item">
            <span class="bottleneck-problem">Delivery partner location 40K writes/sec</span>
            <span class="bottleneck-arrow">&#10132;</span>
            <span class="bottleneck-solution">Redis GEO for live location &mdash; DB me batch write every 30 sec</span>
        </div>
        <div class="bottleneck-item">
            <span class="bottleneck-problem">Restaurant menu read-heavy traffic</span>
            <span class="bottleneck-arrow">&#10132;</span>
            <span class="bottleneck-solution">Redis cache with 5-min TTL + CDN for images</span>
        </div>
        <div class="bottleneck-item">
            <span class="bottleneck-problem">Search latency for fuzzy food queries</span>
            <span class="bottleneck-arrow">&#10132;</span>
            <span class="bottleneck-solution">Elasticsearch with n-gram tokenizer + auto-suggest index</span>
        </div>
    </div>
</div>

<!-- ============ 12. EDGE CASES ============ -->
<div class="section theme-amber">
    <div class="section-title"><span class="section-num">12</span>Edge Cases</div>
    <div class="edge-grid">
        <div class="edge-card">
            <h4>Restaurant Closes After Order Placed</h4>
            <p>Agar restaurant ne ACCEPTED nahi kiya 5 min me to auto-cancel. Customer ko full refund + sorry coupon.</p>
        </div>
        <div class="edge-card">
            <h4>No Delivery Partner Available</h4>
            <p>Retry 3 baar har 2 min pe with increasing radius (5km &rarr; 8km &rarr; 12km). Nahi mila to cancel with refund.</p>
        </div>
        <div class="edge-card">
            <h4>Food Item Out of Stock After Order</h4>
            <p>Restaurant PREPARING me item unavailable mark kare to partial order allow. Customer ko notification + price adjust.</p>
        </div>
        <div class="edge-card">
            <h4>Cart From Different Restaurant</h4>
            <p>Ek time pe sirf ek restaurant ka cart. Dusre ka add kare to dialog &mdash; "Purana cart clear hoga, continue?"</p>
        </div>
        <div class="edge-card">
            <h4>Double Payment / Idempotency</h4>
            <p>Har order ke liye unique idempotency key. Retry pe same key se gateway duplicate charge nahi karega.</p>
        </div>
    </div>
</div>

<!-- ============ 13. SECURITY ============ -->
<div class="section theme-lime">
    <div class="section-title"><span class="section-num">13</span>Security Considerations</div>
    <div class="security-grid">
        <div class="security-item">
            <span class="shield">&#9670;</span>
            <div>Payment Security<div class="security-detail">PCI-DSS compliant gateway (Razorpay/Stripe). Tokenized card storage. Idempotency keys prevent double charging.</div></div>
        </div>
        <div class="security-item">
            <span class="shield">&#9670;</span>
            <div>Location Privacy<div class="security-detail">Partner location sirf active order me dikhao. Delivered hone ke baad delete. User address encrypted at rest.</div></div>
        </div>
        <div class="security-item">
            <span class="shield">&#9670;</span>
            <div>Fake Order Prevention<div class="security-detail">OTP for COD. Rate limiting max 5 orders/hour. ML fraud detection. Phone verification required.</div></div>
        </div>
        <div class="security-item">
            <span class="shield">&#9670;</span>
            <div>API Security<div class="security-detail">JWT auth. Role-based access (USER, RESTAURANT, DELIVERY, ADMIN). Rate limiting. Input validation. SQL injection prevention via JPA.</div></div>
        </div>
    </div>
</div>

<!-- ============ 14. SUMMARY ============ -->
<div class="section theme-green">
    <div class="section-title"><span class="section-num">14</span>Interview Summary</div>
    <div class="summary-grid">
        <div class="summary-card sc-1"><h4>FoodService</h4><p>CRUD + Search with Elasticsearch</p></div>
        <div class="summary-card sc-2"><h4>Saga Pattern</h4><p>Order placement with payment rollback</p></div>
        <div class="summary-card sc-3"><h4>Redis Cart</h4><p>Fast cart with 24hr TTL + single restaurant</p></div>
        <div class="summary-card sc-4"><h4>Geospatial Query</h4><p>Nearest restaurant &amp; delivery partner</p></div>
        <div class="summary-card sc-1"><h4>State Machine</h4><p>Order lifecycle PLACED &rarr; DELIVERED</p></div>
        <div class="summary-card sc-2"><h4>Observer / Kafka</h4><p>Event-driven notifications &amp; partner assign</p></div>
        <div class="summary-card sc-3"><h4>Strategy Pattern</h4><p>Dynamic delivery fee (normal vs surge)</p></div>
        <div class="summary-card sc-4"><h4>PostgreSQL + Redis</h4><p>SQL for data, Redis for cache &amp; location</p></div>
    </div>
    <p style="text-align:center;margin-top:24px;color:#78909c;font-size:1em">
        Complete Food Delivery LLD for <strong style="color:#ff9100">Java Spring Boot</strong> interviews &mdash; covers SOLID, Design Patterns, Scalability, Security &amp; Edge Cases.
    </p>
</div>
`
}
