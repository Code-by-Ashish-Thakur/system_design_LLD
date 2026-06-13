export default {
  title: "Ride Handling System &mdash; Low Level Design",
  subtitle: "Complete LLD for Java Spring Boot Interview &mdash; Matching, Pricing, Tracking &amp; Trip Management",
  subtitleColor: "#e8f5e9",
  headerGradient: "linear-gradient(135deg,#1b5e20,#2e7d32,#b2ff59)",
  footerText: "Ride Handling System &mdash; Low Level Design",
  content: `
<div class="section theme-green">
    <div class="section-title"><span class="section-num">1</span>Functional Requirements</div>
    <div class="req-grid">
        <div class="req-pill"><span class="num">1</span><div class="fr-content"><div class="fr-en">Rider Request Ride (pickup &rarr; drop)</div><div class="fr-hi">Rider pickup aur drop location deke ride request kare</div></div></div>
        <div class="req-pill"><span class="num">2</span><div class="fr-content"><div class="fr-en">Driver-Rider Matching (nearest available)</div><div class="fr-hi">Nearest available driver ko match karo — geospatial query se</div></div></div>
        <div class="req-pill"><span class="num">3</span><div class="fr-content"><div class="fr-en">Real-time Location Tracking (WebSocket)</div><div class="fr-hi">Driver ki live location WebSocket se real-time track karo</div></div></div>
        <div class="req-pill"><span class="num">4</span><div class="fr-content"><div class="fr-en">Fare Estimation &amp; Surge Pricing</div><div class="fr-hi">Ride ka estimated fare calculate karo — surge pricing bhi include</div></div></div>
        <div class="req-pill"><span class="num">5</span><div class="fr-content"><div class="fr-en">Trip Lifecycle (request &rarr; match &rarr; pickup &rarr; ride &rarr; drop)</div><div class="fr-hi">Request se drop tak ka pura trip lifecycle manage karo</div></div></div>
        <div class="req-pill"><span class="num">6</span><div class="fr-content"><div class="fr-en">ETA Calculation</div><div class="fr-hi">Driver kitne time me aayega — ETA calculate karo</div></div></div>
        <div class="req-pill"><span class="num">7</span><div class="fr-content"><div class="fr-en">Driver Availability Management</div><div class="fr-hi">Driver online/offline, busy/available status manage karo</div></div></div>
        <div class="req-pill"><span class="num">8</span><div class="fr-content"><div class="fr-en">Ride Pooling / Sharing</div><div class="fr-hi">Multiple riders ek ride share kar saken — pool option do</div></div></div>
        <div class="req-pill"><span class="num">9</span><div class="fr-content"><div class="fr-en">Cancellation Policy &amp; Fees</div><div class="fr-hi">Cancel pe policy apply karo — free window ke baad charge lagao</div></div></div>
        <div class="req-pill"><span class="num">10</span><div class="fr-content"><div class="fr-en">Rating &amp; Review System</div><div class="fr-hi">Ride complete hone pe rider aur driver dono ko rate karne do</div></div></div>
        <div class="req-pill"><span class="num">11</span><div class="fr-content"><div class="fr-en">Payment Integration</div><div class="fr-hi">UPI, Card, Wallet se payment integrate karo</div></div></div>
        <div class="req-pill"><span class="num">12</span><div class="fr-content"><div class="fr-en">SOS / Emergency Support</div><div class="fr-hi">Emergency me SOS button se nearest police/help ko alert bhejo</div></div></div>
    </div>
</div>

<!-- ============ NON-FUNCTIONAL REQUIREMENTS ============ -->
<div class="section theme-pink">
    <div class="section-title"><span class="section-num">2</span>Non-Functional Requirements</div>
    <div class="req-grid">
        <div class="req-pill"><span class="num">1</span><div class="nfr-content"><div class="nfr-en">Low Latency &mdash; Driver match must happen within 30 seconds</div><div class="nfr-hi">Driver match &lt; 30 sec me ho jaana chahiye &mdash; user zyada wait nahi karega</div></div></div>
        <div class="req-pill"><span class="num">2</span><div class="nfr-content"><div class="nfr-en">High Availability &mdash; 99.99% uptime, rides never drop mid-trip</div><div class="nfr-hi">99.99% uptime hona chahiye &mdash; ride kabhi beech me drop nahi honi chahiye</div></div></div>
        <div class="req-pill"><span class="num">3</span><div class="nfr-content"><div class="nfr-en">Scalability &mdash; Handle millions of concurrent rides</div><div class="nfr-hi">Millions concurrent rides handle karne padenge &mdash; peak hours me bhi smooth ho</div></div></div>
        <div class="req-pill"><span class="num">4</span><div class="nfr-content"><div class="nfr-en">Real-time &mdash; Live GPS tracking updated every 2-3 seconds</div><div class="nfr-hi">Live GPS tracking har 2-3 sec me update honi chahiye &mdash; real-time location dikhe</div></div></div>
        <div class="req-pill"><span class="num">5</span><div class="nfr-content"><div class="nfr-en">Consistency &mdash; Ride state machine must be ACID compliant</div><div class="nfr-hi">Ride state machine ACID hona chahiye &mdash; invalid state transition nahi ho</div></div></div>
        <div class="req-pill"><span class="num">6</span><div class="nfr-content"><div class="nfr-en">Fault Tolerance &mdash; Rides must not be lost on server crash</div><div class="nfr-hi">Server crash hone pe bhi ride data lost nahi hona chahiye &mdash; persistent storage me save ho</div></div></div>
    </div>
</div>

<div class="section theme-purple">
    <div class="section-title"><span class="section-num">3</span>Enums</div>
    <div class="enum-grid">
        <div class="enum-card"><h3>RideStatus</h3><div class="enum-val">REQUESTED</div><div class="enum-val">DRIVER_ASSIGNED</div><div class="enum-val">DRIVER_ARRIVED</div><div class="enum-val">IN_PROGRESS</div><div class="enum-val">COMPLETED</div><div class="enum-val">CANCELLED</div><div class="enum-val">NO_DRIVERS</div></div>
        <div class="enum-card"><h3>DriverStatus</h3><div class="enum-val">OFFLINE</div><div class="enum-val">AVAILABLE</div><div class="enum-val">BUSY</div><div class="enum-val">ON_RIDE</div></div>
        <div class="enum-card"><h3>RideType</h3><div class="enum-val">MINI</div><div class="enum-val">SEDAN</div><div class="enum-val">SUV</div><div class="enum-val">PREMIUM</div><div class="enum-val">POOL</div><div class="enum-val">AUTO</div><div class="enum-val">BIKE</div></div>
        <div class="enum-card"><h3>VehicleType</h3><div class="enum-val">HATCHBACK</div><div class="enum-val">SEDAN</div><div class="enum-val">SUV</div><div class="enum-val">AUTO_RICKSHAW</div><div class="enum-val">MOTORCYCLE</div></div>
        <div class="enum-card"><h3>CancellationReason</h3><div class="enum-val">DRIVER_NOT_MOVING</div><div class="enum-val">CHANGED_PLANS</div><div class="enum-val">WRONG_ADDRESS</div><div class="enum-val">ETA_TOO_LONG</div><div class="enum-val">DRIVER_ASKED</div></div>
    </div>
</div>

<div class="section theme-purple">
    <div class="section-title"><span class="section-num">4</span>Service LLD</div>
    <div class="service-grid">

        <div class="service-card">
            <h3>RideService</h3>
            <p class="svc-desc">Pura ride lifecycle handle karta hai &mdash; ride create karo, driver assign karo, start/complete/cancel sab iske through hota hai</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">RideService</span> {

    <span class="cm">// Nayi ride request create karo - pickup, drop, rideType sab yahan aata hai</span>
    <span class="tp">Ride</span> <span class="fn">requestRide</span>(<span class="tp">Long</span> riderId, <span class="tp">double</span> pickupLat, <span class="tp">double</span> pickupLng, <span class="tp">double</span> dropLat, <span class="tp">double</span> dropLng, <span class="tp">RideType</span> rideType, <span class="tp">String</span> promoCode, <span class="tp">String</span> paymentMode)

    <span class="cm">// Ride ID se ride details nikalo</span>
    <span class="tp">Ride</span> <span class="fn">getRideById</span>(<span class="tp">String</span> rideId)

    <span class="cm">// Ride cancel karo - rider ya driver dono kar sakte hain reason ke saath</span>
    <span class="tp">void</span> <span class="fn">cancelRide</span>(<span class="tp">String</span> rideId, <span class="tp">Long</span> userId, <span class="tp">CancellationReason</span> reason)

    <span class="cm">// Ride complete karo - GPS trail se actual distance calculate hota hai</span>
    <span class="tp">Ride</span> <span class="fn">completeRide</span>(<span class="tp">String</span> rideId, <span class="tp">double</span> actualDistanceKm)
}
</pre></div>
        </div>

        <div class="service-card">
            <h3>MatchingEngine</h3>
            <p class="svc-desc">Rider ke liye best driver dhundhta hai &mdash; Redis GEORADIUS se nearby drivers nikalo, phir distance + rating + acceptance rate se rank karo</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">MatchingEngine</span> {

    <span class="cm">// Pickup ke paas best driver dhundho - radius mein search + scoring</span>
    <span class="tp">Optional&lt;Driver&gt;</span> <span class="fn">findBestMatch</span>(<span class="tp">double</span> pickupLat, <span class="tp">double</span> pickupLng, <span class="tp">RideType</span> rideType, <span class="tp">double</span> radiusKm)

    <span class="cm">// Nearby available drivers ka list nikalo - GEORADIUS se</span>
    <span class="tp">List&lt;Driver&gt;</span> <span class="fn">findNearbyDrivers</span>(<span class="tp">double</span> lat, <span class="tp">double</span> lng, <span class="tp">double</span> radiusKm, <span class="tp">VehicleType</span> vehicleType, <span class="tp">int</span> limit)

    <span class="cm">// Candidates ko rank karo - 60% distance + 25% rating + 15% acceptance</span>
    <span class="tp">List&lt;ScoredDriver&gt;</span> <span class="fn">rankDrivers</span>(<span class="tp">List&lt;Driver&gt;</span> candidates, <span class="tp">double</span> pickupLat, <span class="tp">double</span> pickupLng, <span class="tp">RideType</span> rideType)
}
</pre></div>
        </div>

        <div class="service-card">
            <h3>PricingService</h3>
            <p class="svc-desc">Ride ka fare calculate karta hai &mdash; base fare + per km + per minute + surge multiplier, aur promo code bhi apply karta hai</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">PricingService</span> {

    <span class="cm">// Final fare calculate karo - distance, time, rideType aur surge se</span>
    <span class="tp">BigDecimal</span> <span class="fn">calculateFare</span>(<span class="tp">double</span> distanceKm, <span class="tp">int</span> durationMin, <span class="tp">RideType</span> rideType, <span class="tp">double</span> surgeMultiplier)

    <span class="cm">// Booking se pehle fare estimate dikhao - pickup/drop se calculate</span>
    <span class="tp">FareEstimate</span> <span class="fn">estimate</span>(<span class="tp">double</span> pickupLat, <span class="tp">double</span> pickupLng, <span class="tp">double</span> dropLat, <span class="tp">double</span> dropLng, <span class="tp">RideType</span> rideType)

    <span class="cm">// Promo code apply karo - FIRST50, RIDE20 jaise codes pe discount</span>
    <span class="tp">BigDecimal</span> <span class="fn">applyPromo</span>(<span class="tp">BigDecimal</span> fare, <span class="tp">String</span> promoCode, <span class="tp">Long</span> riderId)
}
</pre></div>
        </div>

        <div class="service-card">
            <h3>SurgePricingService</h3>
            <p class="svc-desc">Jab ek area mein demand zyada ho aur drivers kam &mdash; toh surge multiplier badhata hai (1x se 3x tak), har 30s recalculate hota hai</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">SurgePricingService</span> {

    <span class="cm">// Pickup location ka current surge multiplier nikalo</span>
    <span class="tp">double</span> <span class="fn">getSurgeMultiplier</span>(<span class="tp">double</span> lat, <span class="tp">double</span> lng)

    <span class="cm">// Zone ka surge recalculate karo - demand/supply ratio se</span>
    <span class="tp">void</span> <span class="fn">recalculateSurge</span>(<span class="tp">String</span> zoneId, <span class="tp">int</span> activeRequests, <span class="tp">int</span> availableDrivers)
}
</pre></div>
        </div>

        <div class="service-card">
            <h3>LocationService</h3>
            <p class="svc-desc">Driver ki real-time location track karta hai Redis GEO mein, rider ko live position dikhata hai aur route history bhi rakhta hai</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">LocationService</span> {

    <span class="cm">// Driver ki location update karo Redis GEO mein - har 3 sec aata hai</span>
    <span class="tp">void</span> <span class="fn">updateLocation</span>(<span class="tp">Long</span> driverId, <span class="tp">double</span> lat, <span class="tp">double</span> lng, <span class="tp">double</span> speed, <span class="tp">Long</span> rideId)

    <span class="cm">// Driver ki current location nikalo - Redis GEOPOS se</span>
    <span class="tp">GeoPoint</span> <span class="fn">getDriverLocation</span>(<span class="tp">Long</span> driverId)

    <span class="cm">// Puri ride ka GPS trail nikalo - TimescaleDB se route history</span>
    <span class="tp">List&lt;GeoPoint&gt;</span> <span class="fn">getRideRoute</span>(<span class="tp">String</span> rideId)
}
</pre></div>
        </div>

        <div class="service-card">
            <h3>ETAService</h3>
            <p class="svc-desc">Driver kitne time mein pickup ya drop pe pahunchega woh estimate karta hai &mdash; distance + traffic + historical data se</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">ETAService</span> {

    <span class="cm">// Driver se pickup/drop tak ka estimated time nikalo</span>
    <span class="tp">Duration</span> <span class="fn">calculateETA</span>(<span class="tp">double</span> fromLat, <span class="tp">double</span> fromLng, <span class="tp">double</span> toLat, <span class="tp">double</span> toLng)

    <span class="cm">// Do points ke beech ki distance estimate karo in km</span>
    <span class="tp">double</span> <span class="fn">estimateDistance</span>(<span class="tp">double</span> fromLat, <span class="tp">double</span> fromLng, <span class="tp">double</span> toLat, <span class="tp">double</span> toLng)
}
</pre></div>
        </div>

        <div class="service-card">
            <h3>RatingService</h3>
            <p class="svc-desc">Trip ke baad rider/driver rating handle karta hai (1-5 stars), low-rated drivers ko flag bhi karta hai review ke liye</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">RatingService</span> {

    <span class="cm">// Ride ke baad rating do - rider ya driver dono de sakte hain</span>
    <span class="tp">void</span> <span class="fn">rate</span>(<span class="tp">String</span> rideId, <span class="tp">Long</span> fromUserId, <span class="tp">Long</span> toUserId, <span class="tp">int</span> score, <span class="tp">String</span> feedback)

    <span class="cm">// Driver ki average rating nikalo - AVG(score) from ratings table</span>
    <span class="tp">double</span> <span class="fn">getDriverRating</span>(<span class="tp">Long</span> driverId)

    <span class="cm">// Low-rated drivers ko flag karo review ke liye - threshold se neeche wale</span>
    <span class="tp">void</span> <span class="fn">flagLowRatedDrivers</span>(<span class="tp">double</span> threshold, <span class="tp">int</span> minRides)
}
</pre></div>
        </div>

        <div class="service-card">
            <h3>NotificationService</h3>
            <p class="svc-desc">Drivers ko naye ride requests ki push notification bhejta hai (30 sec accept timeout), riders ko ride status aur ETA updates deta hai</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">NotificationService</span> {

    <span class="cm">// Driver ko nayi ride request ki notification bhejo - 30s accept timeout</span>
    <span class="tp">void</span> <span class="fn">notifyDriver</span>(<span class="tp">Long</span> driverId, <span class="tp">String</span> rideId, <span class="tp">String</span> pickupAddress, <span class="tp">BigDecimal</span> estimatedFare, <span class="tp">RideType</span> rideType, <span class="tp">int</span> timeoutSec)

    <span class="cm">// Rider ko ride status update bhejo - driver details aur OTP ke saath</span>
    <span class="tp">void</span> <span class="fn">notifyRider</span>(<span class="tp">Long</span> riderId, <span class="tp">String</span> rideId, <span class="tp">RideStatus</span> status, <span class="tp">String</span> driverName, <span class="tp">String</span> vehicleNumber, <span class="tp">String</span> otp)

    <span class="cm">// Rider ko ETA update bhejo - kitne min mein driver aayega with live location</span>
    <span class="tp">void</span> <span class="fn">sendETAUpdate</span>(<span class="tp">Long</span> riderId, <span class="tp">String</span> rideId, <span class="tp">Duration</span> eta, <span class="tp">double</span> driverLat, <span class="tp">double</span> driverLng)
}
</pre></div>
        </div>

    </div>
</div>

<div class="section theme-blue">
    <div class="section-title"><span class="section-num">5</span>API Endpoints</div>
    <div class="api-grid">
        <div class="api-card"><div class="api-method post">POST</div><div class="api-path">/api/v1/rides/request</div><div class="api-desc">Request a ride (pickup, drop, rideType)</div></div>
        <div class="api-card"><div class="api-method post">POST</div><div class="api-path">/api/v1/rides/estimate</div><div class="api-desc">Get fare estimate &amp; ETA without booking</div></div>
        <div class="api-card"><div class="api-method put">PUT</div><div class="api-path">/api/v1/rides/{rideId}/accept</div><div class="api-desc">Driver accepts ride request</div></div>
        <div class="api-card"><div class="api-method put">PUT</div><div class="api-path">/api/v1/rides/{rideId}/start</div><div class="api-desc">Driver starts ride (OTP verified)</div></div>
        <div class="api-card"><div class="api-method put">PUT</div><div class="api-path">/api/v1/rides/{rideId}/complete</div><div class="api-desc">Driver completes ride at drop location</div></div>
        <div class="api-card"><div class="api-method put">PUT</div><div class="api-path">/api/v1/rides/{rideId}/cancel</div><div class="api-desc">Cancel ride (applies fee if after threshold)</div></div>
        <div class="api-card"><div class="api-method post">POST</div><div class="api-path">/api/v1/rides/{rideId}/rate</div><div class="api-desc">Rate driver/rider (1-5 stars)</div></div>
        <div class="api-card"><div class="api-method put">PUT</div><div class="api-path">/api/v1/drivers/location</div><div class="api-desc">Update driver's current location (every 3s)</div></div>
        <div class="api-card"><div class="api-method put">PUT</div><div class="api-path">/api/v1/drivers/availability</div><div class="api-desc">Toggle driver online/offline</div></div>
        <div class="api-card"><div class="api-method get">GET</div><div class="api-path">/api/v1/rides/{rideId}/track</div><div class="api-desc">WebSocket: real-time driver location updates</div></div>
    </div>
</div>

<div class="section theme-green">
    <div class="section-title"><span class="section-num">6</span>Database Schema</div>

    <div class="sub-heading" style="color:#25d366;border-color:#25d366">Database Technology Stack</div>
    <div class="dbtech-grid">
        <div class="dbtech-card">
            <div class="dbtech-name">PostgreSQL <span class="dbtech-type">RDBMS</span></div>
            <div class="dbtech-usage">Rides, users, drivers, ratings &mdash; ACID transactions for ride booking</div>
            <div class="dbtech-tables"><span>rides</span><span>riders</span><span>drivers</span><span>ratings</span></div>
        </div>
        <div class="dbtech-card">
            <div class="dbtech-name">Redis GEO <span class="dbtech-type">In-Memory</span></div>
            <div class="dbtech-usage">Real-time driver locations (GEOADD/GEORADIUS), surge pricing zones, session cache</div>
            <div class="dbtech-tables"><span>driver:locations</span><span>surge:{zoneId}</span></div>
        </div>
        <div class="dbtech-card">
            <div class="dbtech-name">Kafka <span class="dbtech-type">Message Queue</span></div>
            <div class="dbtech-usage">Ride events, driver notifications, location updates, pricing recalculation</div>
            <div class="dbtech-tables"><span>ride-events</span><span>location-updates</span></div>
        </div>
        <div class="dbtech-card">
            <div class="dbtech-name">TimescaleDB <span class="dbtech-type">Time-Series</span></div>
            <div class="dbtech-usage">Driver location history &mdash; time-series data for route tracking and ETA calculation</div>
            <div class="dbtech-tables"><span>location_history</span></div>
        </div>
    </div>

    <div class="db-grid">
        <div class="db-card">
            <h3>rides</h3>
            <div class="db-row"><span class="col-name">id</span><span class="col-type">BIGINT</span><span class="col-constraint">PK</span></div>
            <div class="db-row"><span class="col-name">ride_id</span><span class="col-type">VARCHAR(36)</span><span class="col-constraint">UNIQUE IDX</span></div>
            <div class="db-row"><span class="col-name">rider_id</span><span class="col-type">BIGINT</span><span class="col-constraint">FK IDX</span></div>
            <div class="db-row"><span class="col-name">driver_id</span><span class="col-type">BIGINT</span><span class="col-constraint">FK IDX</span></div>
            <div class="db-row"><span class="col-name">pickup_lat</span><span class="col-type">DOUBLE</span><span class="col-constraint"></span></div>
            <div class="db-row"><span class="col-name">pickup_lng</span><span class="col-type">DOUBLE</span><span class="col-constraint"></span></div>
            <div class="db-row"><span class="col-name">drop_lat</span><span class="col-type">DOUBLE</span><span class="col-constraint"></span></div>
            <div class="db-row"><span class="col-name">drop_lng</span><span class="col-type">DOUBLE</span><span class="col-constraint"></span></div>
            <div class="db-row"><span class="col-name">status</span><span class="col-type">ENUM</span><span class="col-constraint">IDX</span></div>
            <div class="db-row"><span class="col-name">ride_type</span><span class="col-type">ENUM</span><span class="col-constraint"></span></div>
            <div class="db-row"><span class="col-name">estimated_fare</span><span class="col-type">DECIMAL(10,2)</span><span class="col-constraint"></span></div>
            <div class="db-row"><span class="col-name">actual_fare</span><span class="col-type">DECIMAL(10,2)</span><span class="col-constraint"></span></div>
            <div class="db-row"><span class="col-name">surge_multiplier</span><span class="col-type">DOUBLE</span><span class="col-constraint">DEFAULT 1.0</span></div>
            <div class="db-row"><span class="col-name">created_at</span><span class="col-type">TIMESTAMP</span><span class="col-constraint">IDX</span></div>
        </div>
        <div class="db-card">
            <h3>drivers</h3>
            <div class="db-row"><span class="col-name">id</span><span class="col-type">BIGINT</span><span class="col-constraint">PK</span></div>
            <div class="db-row"><span class="col-name">name</span><span class="col-type">VARCHAR(128)</span><span class="col-constraint"></span></div>
            <div class="db-row"><span class="col-name">phone</span><span class="col-type">VARCHAR(15)</span><span class="col-constraint">UNIQUE</span></div>
            <div class="db-row"><span class="col-name">vehicle_number</span><span class="col-type">VARCHAR(20)</span><span class="col-constraint">UNIQUE</span></div>
            <div class="db-row"><span class="col-name">vehicle_type</span><span class="col-type">ENUM</span><span class="col-constraint">IDX</span></div>
            <div class="db-row"><span class="col-name">current_lat</span><span class="col-type">DOUBLE</span><span class="col-constraint">SPATIAL IDX</span></div>
            <div class="db-row"><span class="col-name">current_lng</span><span class="col-type">DOUBLE</span><span class="col-constraint">SPATIAL IDX</span></div>
            <div class="db-row"><span class="col-name">status</span><span class="col-type">ENUM</span><span class="col-constraint">IDX</span></div>
            <div class="db-row"><span class="col-name">rating</span><span class="col-type">DOUBLE</span><span class="col-constraint">DEFAULT 5.0</span></div>
        </div>
        <div class="db-card">
            <h3>location_history (time-series)</h3>
            <div class="db-row"><span class="col-name">id</span><span class="col-type">BIGINT</span><span class="col-constraint">PK</span></div>
            <div class="db-row"><span class="col-name">driver_id</span><span class="col-type">BIGINT</span><span class="col-constraint">FK IDX</span></div>
            <div class="db-row"><span class="col-name">ride_id</span><span class="col-type">BIGINT</span><span class="col-constraint">FK IDX</span></div>
            <div class="db-row"><span class="col-name">lat</span><span class="col-type">DOUBLE</span><span class="col-constraint"></span></div>
            <div class="db-row"><span class="col-name">lng</span><span class="col-type">DOUBLE</span><span class="col-constraint"></span></div>
            <div class="db-row"><span class="col-name">speed</span><span class="col-type">DOUBLE</span><span class="col-constraint"></span></div>
            <div class="db-row"><span class="col-name">timestamp</span><span class="col-type">TIMESTAMP</span><span class="col-constraint">IDX</span></div>
        </div>
        <div class="db-card">
            <h3>ratings</h3>
            <div class="db-row"><span class="col-name">id</span><span class="col-type">BIGINT</span><span class="col-constraint">PK</span></div>
            <div class="db-row"><span class="col-name">ride_id</span><span class="col-type">BIGINT</span><span class="col-constraint">FK UNIQUE</span></div>
            <div class="db-row"><span class="col-name">from_user_id</span><span class="col-type">BIGINT</span><span class="col-constraint">FK</span></div>
            <div class="db-row"><span class="col-name">to_user_id</span><span class="col-type">BIGINT</span><span class="col-constraint">FK IDX</span></div>
            <div class="db-row"><span class="col-name">score</span><span class="col-type">INT</span><span class="col-constraint">CHECK(1-5)</span></div>
            <div class="db-row"><span class="col-name">comment</span><span class="col-type">TEXT</span><span class="col-constraint"></span></div>
        </div>
    </div>

    <div class="sub-heading" style="color:#25d366;border-color:#25d366">Database Query Examples</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span><span class="code-title">PostgreSQL &mdash; Core Ride Queries</span></div>
    <pre class="code-block">
<span class="cm">-- 1. Rider ki ride history (latest first, paginated)</span>
<span class="kw">SELECT</span> * <span class="kw">FROM</span> rides
<span class="kw">WHERE</span> rider_id = <span class="cn">1001</span>
<span class="kw">ORDER BY</span> created_at <span class="kw">DESC</span>
<span class="kw">LIMIT</span> <span class="cn">10</span> <span class="kw">OFFSET</span> <span class="cn">0</span>;

<span class="cm">-- 2. Driver ka current active ride dhundho</span>
<span class="kw">SELECT</span> * <span class="kw">FROM</span> rides
<span class="kw">WHERE</span> driver_id = <span class="cn">5001</span>
  <span class="kw">AND</span> status <span class="kw">IN</span> (<span class="st">'DRIVER_ASSIGNED'</span>, <span class="st">'DRIVER_ARRIVED'</span>, <span class="st">'IN_PROGRESS'</span>);

<span class="cm">-- 3. Nearby available drivers (ST_Distance_Sphere) &mdash; 5km radius</span>
<span class="kw">SELECT</span> id, name, vehicle_type,
       ST_Distance_Sphere(
           POINT(current_lng, current_lat),
           POINT(<span class="cn">77.209</span>, <span class="cn">28.613</span>)
       ) / <span class="cn">1000</span> <span class="kw">AS</span> distance_km
<span class="kw">FROM</span> drivers
<span class="kw">WHERE</span> status = <span class="st">'AVAILABLE'</span>
  <span class="kw">AND</span> vehicle_type = <span class="st">'SEDAN'</span>
<span class="kw">HAVING</span> distance_km &lt;= <span class="cn">5</span>
<span class="kw">ORDER BY</span> distance_km <span class="kw">ASC</span>
<span class="kw">LIMIT</span> <span class="cn">20</span>;

<span class="cm">-- 4. Driver ki average rating nikalo</span>
<span class="kw">SELECT</span> to_user_id <span class="kw">AS</span> driver_id,
       <span class="fn">AVG</span>(score) <span class="kw">AS</span> avg_rating,
       <span class="fn">COUNT</span>(*) <span class="kw">AS</span> total_reviews
<span class="kw">FROM</span> ratings
<span class="kw">WHERE</span> to_user_id = <span class="cn">5001</span>
<span class="kw">GROUP BY</span> to_user_id;

<span class="cm">-- 5. Surge zone ke liye demand/supply ratio</span>
<span class="kw">SELECT</span>
    (<span class="kw">SELECT</span> <span class="fn">COUNT</span>(*) <span class="kw">FROM</span> rides <span class="kw">WHERE</span> status = <span class="st">'REQUESTED'</span>
     <span class="kw">AND</span> created_at > NOW() - INTERVAL <span class="st">'5 minutes'</span>) <span class="kw">AS</span> demand,
    (<span class="kw">SELECT</span> <span class="fn">COUNT</span>(*) <span class="kw">FROM</span> drivers <span class="kw">WHERE</span> status = <span class="st">'AVAILABLE'</span>) <span class="kw">AS</span> supply;
    </pre></div>

    <div class="code-wrapper"><div class="code-titlebar"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span><span class="code-title">Redis GEO &mdash; Real-time Location Commands</span></div>
    <pre class="code-block">
<span class="cm">// 1. Driver ki location update karo (har 3 sec)</span>
GEOADD driver:locations <span class="cn">77.209</span> <span class="cn">28.613</span> <span class="st">"driver:5001"</span>

<span class="cm">// 2. Pickup ke paas 5km mein available drivers dhundho</span>
GEORADIUS driver:locations <span class="cn">77.209</span> <span class="cn">28.613</span> <span class="cn">5</span> km
    ASC COUNT <span class="cn">20</span> WITHDIST

<span class="cm">// 3. Driver ki current location nikalo</span>
GEOPOS driver:locations <span class="st">"driver:5001"</span>

<span class="cm">// 4. Surge multiplier cache karo zone ke liye</span>
SET surge:zone_delhi_cp <span class="cn">2.5</span> EX <span class="cn">30</span>
GET surge:zone_delhi_cp

<span class="cm">// 5. Ride accept ke liye distributed lock (SETNX)</span>
SET ride:lock:R123 <span class="st">"driver:5001"</span> NX EX <span class="cn">10</span>
    </pre></div>
</div>

<div class="section theme-green">
    <div class="section-title"><span class="section-num">7</span>Capacity Estimation</div>
    <div class="cap-grid">
        <div class="cap-card"><div class="cap-label">Daily Rides</div><div class="cap-value">15M rides/day</div></div>
        <div class="cap-card"><div class="cap-label">Active Drivers</div><div class="cap-value">5M online at peak</div></div>
        <div class="cap-card"><div class="cap-label">Location Updates / sec</div><div class="cap-value">~1.7M (5M drivers &times; every 3s)</div></div>
        <div class="cap-card"><div class="cap-label">Redis GEO Memory</div><div class="cap-value">~1 GB for 5M driver locations</div></div>
        <div class="cap-card"><div class="cap-label">Matching QPS</div><div class="cap-value">~200 ride requests/sec</div></div>
        <div class="cap-card"><div class="cap-label">WebSocket Connections</div><div class="cap-value">~10M concurrent (riders + drivers)</div></div>
        <div class="cap-card"><div class="cap-label">Location History Storage</div><div class="cap-value">~500 GB/day (TimescaleDB, 7-day retention)</div></div>
        <div class="cap-card"><div class="cap-label">Avg Trip Duration</div><div class="cap-value">~20 minutes</div></div>
        <div class="cap-card">
            <h4 style="color:#82b1ff;margin-bottom:8px">CPU / Server Estimation</h4>
            <div class="calc-row"><span class="calc-label">Location update QPS</span><span class="calc-value">~1.7M/sec</span></div>
            <div class="calc-row"><span class="calc-label">Matching QPS</span><span class="calc-value">~200/sec</span></div>
            <div class="calc-row"><span class="calc-label">Each location server handles</span><span class="calc-value">~50K QPS</span></div>
            <div class="calc-result"><span class="calc-label">Location Servers Needed</span><span class="calc-value">~34 servers</span></div>
            <div class="calc-row"><span class="calc-label">Each matching server handles</span><span class="calc-value">~50 matches/sec</span></div>
            <div class="calc-result"><span class="calc-label">Matching Servers Needed</span><span class="calc-value">~4 servers</span></div>
            <div class="calc-row" style="margin-top:6px"><span class="calc-label">WebSocket Servers (50K conn/server)</span><span class="calc-value">~200 servers</span></div>
            <div class="calc-result"><span class="calc-label">Total CPU Cores (all services)</span><span class="calc-value">~1,000+ cores</span></div>
            <div class="calc-row"><span class="calc-label">Redis GEO Cluster</span><span class="calc-value">5-10 nodes</span></div>
        </div>
    </div>
</div>

<div class="section theme-green">
    <div class="section-title"><span class="section-num">8</span>Key Architecture</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span><span class="code-title">MatchingEngine.java &mdash; GeoSpatial + Scoring</span></div>
    <pre class="code-block">
<span class="ann">@Service</span>
<span class="kw">public class</span> <span class="tp">MatchingEngine</span> <span class="kw">implements</span> <span class="tp">IMatchingEngine</span> {
    <span class="kw">private final</span> <span class="tp">StringRedisTemplate</span> redis;
    <span class="kw">private final</span> <span class="tp">DriverRepository</span> driverRepo;

    <span class="kw">public</span> <span class="tp">Optional</span>&lt;<span class="tp">Driver</span>&gt; <span class="fn">findBestMatch</span>(<span class="tp">RideRequest</span> req) {
        <span class="cm">// 1. Redis GEO: find drivers within 5km radius</span>
        <span class="tp">GeoResults</span>&lt;<span class="tp">RedisGeoCommands.GeoLocation</span>&lt;<span class="tp">String</span>&gt;&gt; nearby =
            redis.<span class="fn">opsForGeo</span>().<span class="fn">radius</span>(
                <span class="st">"driver:locations"</span>,
                <span class="kw">new</span> <span class="tp">Circle</span>(<span class="kw">new</span> <span class="tp">Point</span>(req.getPickupLng(), req.getPickupLat()),
                    <span class="kw">new</span> <span class="tp">Distance</span>(<span class="cn">5</span>, <span class="tp">Metrics</span>.KILOMETERS)),
                <span class="tp">RedisGeoCommands.GeoRadiusCommandArgs</span>
                    .<span class="fn">newGeoRadiusArgs</span>().<span class="fn">includeDistance</span>().<span class="fn">sortAscending</span>().<span class="fn">limit</span>(<span class="cn">20</span>));

        <span class="cm">// 2. Filter by vehicle type + available status</span>
        <span class="tp">List</span>&lt;<span class="tp">Driver</span>&gt; candidates = nearby.getContent().stream()
            .<span class="fn">map</span>(r -&gt; driverRepo.<span class="fn">findById</span>(<span class="tp">Long</span>.<span class="fn">parseLong</span>(r.getContent().getName())))
            .<span class="fn">filter</span>(<span class="tp">Optional</span>::isPresent).<span class="fn">map</span>(<span class="tp">Optional</span>::get)
            .<span class="fn">filter</span>(d -&gt; d.getStatus() == <span class="tp">DriverStatus</span>.AVAILABLE)
            .<span class="fn">filter</span>(d -&gt; d.getVehicleType().<span class="fn">matches</span>(req.getRideType()))
            .<span class="fn">collect</span>(<span class="tp">Collectors</span>.<span class="fn">toList</span>());

        <span class="cm">// 3. Score: 60% distance + 25% rating + 15% acceptance rate</span>
        <span class="kw">return</span> candidates.stream()
            .<span class="fn">max</span>(<span class="tp">Comparator</span>.<span class="fn">comparingDouble</span>(<span class="kw">this</span>::<span class="fn">calculateScore</span>));
    }
}
    </pre></div>
</div>

<div class="section theme-blue">
    <div class="section-title"><span class="section-num">9</span>Design Patterns Used</div>
    <div class="pattern-grid">
        <div class="pattern-card"><h3>Strategy</h3><p>IPricingStrategy for ride types (Mini, Sedan, SUV) &mdash; different base fare, per-km, per-min rates</p></div>
        <div class="pattern-card"><h3>Observer</h3><p>Location updates trigger WebSocket push to rider; ride status changes trigger notifications</p></div>
        <div class="pattern-card"><h3>State Machine</h3><p>RideStatus transitions: REQUESTED&rarr;ASSIGNED&rarr;ARRIVED&rarr;IN_PROGRESS&rarr;COMPLETED</p></div>
        <div class="pattern-card"><h3>Mediator</h3><p>MatchingEngine mediates between riders and drivers; decouples request from assignment</p></div>
        <div class="pattern-card"><h3>Command</h3><p>RideCommand (request, accept, start, complete, cancel) &mdash; encapsulates ride actions with validation</p></div>
        <div class="pattern-card"><h3>Factory</h3><p>PricingFactory creates pricing strategy based on ride type + city + time of day</p></div>
    </div>
</div>

<div class="section theme-purple">
    <div class="section-title"><span class="section-num">10</span>Sequence Flow</div>
    <div class="flow-container">
        <div class="flow-step"><span class="step-num">1</span><span class="step-text">Rider opens app &rarr; enters pickup &amp; drop &rarr; gets fare estimate</span></div>
        <div class="flow-step"><span class="step-num">2</span><span class="step-text">Rider confirms &rarr; POST /rides/request (status = REQUESTED)</span></div>
        <div class="flow-step"><span class="step-num">3</span><span class="step-text">MatchingEngine finds top 3 nearest available drivers via Redis GEORADIUS</span></div>
        <div class="flow-step"><span class="step-num">4</span><span class="step-text">Push notification sent to best match driver (30s accept timeout)</span></div>
        <div class="flow-step"><span class="step-num">5</span><span class="step-text">Driver accepts &rarr; status = DRIVER_ASSIGNED, rider gets driver details</span></div>
        <div class="flow-step"><span class="step-num">6</span><span class="step-text">Driver arrives at pickup &rarr; status = DRIVER_ARRIVED, rider gets OTP</span></div>
        <div class="flow-step"><span class="step-num">7</span><span class="step-text">Driver verifies OTP &rarr; starts ride &rarr; status = IN_PROGRESS</span></div>
        <div class="flow-step"><span class="step-num">8</span><span class="step-text">Real-time location tracked via WebSocket (every 3s update)</span></div>
        <div class="flow-step"><span class="step-num">9</span><span class="step-text">Driver reaches drop &rarr; completes ride &rarr; actual fare calculated</span></div>
        <div class="flow-step"><span class="step-num">10</span><span class="step-text">Payment processed &rarr; rating screen shown &rarr; ride archived</span></div>
    </div>
</div>

<div class="section theme-blue">
    <div class="section-title"><span class="section-num">11</span>Bottlenecks &amp; Solutions</div>
    <div class="bottleneck-grid">
        <div class="bottleneck-card"><h3>Location Update Storm</h3><p>Redis GEO for writes; batch WebSocket pushes; Kafka for location history persistence</p></div>
        <div class="bottleneck-card"><h3>Matching at Scale</h3><p>GeoHash-based partitioning; pre-computed supply-demand index; locality-based sharding</p></div>
        <div class="bottleneck-card"><h3>Surge Calculation</h3><p>Pre-computed per GeoHash cell every 30s; Redis cache; not per-request calculation</p></div>
        <div class="bottleneck-card"><h3>WebSocket Connection Limit</h3><p>Horizontal scaling with sticky sessions; Redis pub/sub for cross-node delivery</p></div>
        <div class="bottleneck-card"><h3>ETA Accuracy</h3><p>Cache popular routes; use historical traffic data; ML model for peak hours</p></div>
        <div class="bottleneck-card"><h3>Driver Timeout Cascade</h3><p>If driver doesn't accept in 30s &rarr; auto-skip to next nearest; limit 3 attempts &rarr; NO_DRIVERS</p></div>
    </div>
</div>

<div class="section theme-purple">
    <div class="section-title"><span class="section-num">12</span>Edge Cases</div>
    <div class="edge-grid">
        <div class="edge-card"><h3>No Drivers Available</h3><p>Retry with expanding radius (5&rarr;10&rarr;15km); queue request for 60s; notify when driver found</p></div>
        <div class="edge-card"><h3>Driver GPS Lost</h3><p>Detect no location update &gt; 30s; show "last known" to rider; auto-cancel if &gt; 5min</p></div>
        <div class="edge-card"><h3>Fare Dispute</h3><p>Log full GPS trail; recalculate fare from location history; compare with estimated vs actual</p></div>
        <div class="edge-card"><h3>Simultaneous Accept</h3><p>Distributed lock on rideId (Redis SETNX); first driver wins; others get rejection</p></div>
        <div class="edge-card"><h3>Ride Pool Matching</h3><p>Match riders with similar routes (heading angle &lt; 30&deg;); dynamic detour calculation</p></div>
        <div class="edge-card"><h3>Cancellation After Pickup</h3><p>Rider-side cancel charges full estimated fare; driver-side cancel charges minimum fare</p></div>
    </div>
</div>

<div class="section theme-green">
    <div class="section-title"><span class="section-num">13</span>Security Considerations</div>
    <div class="security-grid">
        <div class="security-card"><h3>OTP for Ride Start</h3><p>4-digit OTP sent to rider; driver must verify before starting &mdash; prevents wrong passenger</p></div>
        <div class="security-card"><h3>SOS / Emergency</h3><p>Panic button shares live location with emergency contacts + support; auto-call 911</p></div>
        <div class="security-card"><h3>Location Privacy</h3><p>Only share driver location during active ride; mask exact home/office locations</p></div>
        <div class="security-card"><h3>Phone Masking</h3><p>Virtual phone numbers (Twilio) for rider-driver calls; real numbers never exposed</p></div>
        <div class="security-card"><h3>Driver Background Check</h3><p>KYC verification; criminal background check; periodic document re-validation</p></div>
    </div>
</div>

<div class="section theme-blue">
    <div class="section-title"><span class="section-num">14</span>Interview Cheat-Sheet</div>
    <div class="summary-grid">
        <div class="summary-card"><strong>Matching</strong><br>Redis GEORADIUS for nearby drivers; score by distance + rating; 30s accept timeout</div>
        <div class="summary-card"><strong>Location</strong><br>Redis GEO for real-time; WebSocket push to rider; Kafka &rarr; TimescaleDB for history</div>
        <div class="summary-card"><strong>Surge</strong><br>Demand/supply ratio per GeoHash cell; pre-computed every 30s; 1.0&times;-3.0&times; multiplier</div>
        <div class="summary-card"><strong>Pricing</strong><br>Strategy pattern: base + per-km + per-min &times; surge; different rates per ride type</div>
        <div class="summary-card"><strong>State Machine</strong><br>REQUESTED&rarr;ASSIGNED&rarr;ARRIVED&rarr;IN_PROGRESS&rarr;COMPLETED; OTP verification for start</div>
        <div class="summary-card"><strong>Scale</strong><br>15M rides/day; 1.7M location updates/sec; 10M WebSocket connections; Redis GEO 1GB</div>
        <div class="summary-card"><strong>Patterns</strong><br>Strategy, Observer, State Machine, Mediator, Command, Factory</div>
        <div class="summary-card"><strong>Safety</strong><br>OTP, phone masking, SOS button, live tracking, driver KYC</div>
    </div>
</div>

</div></div>
<!-- END RIDE HANDLING -->

<!-- ==================== NETFLIX ==================== -->
`
}
