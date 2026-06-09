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
        <div class="req-pill"><span class="num">1</span> Rider Request Ride (pickup → drop)</div>
        <div class="req-pill"><span class="num">2</span> Driver-Rider Matching (nearest available)</div>
        <div class="req-pill"><span class="num">3</span> Real-time Location Tracking (WebSocket)</div>
        <div class="req-pill"><span class="num">4</span> Fare Estimation &amp; Surge Pricing</div>
        <div class="req-pill"><span class="num">5</span> Trip Lifecycle (request → match → pickup → ride → drop)</div>
        <div class="req-pill"><span class="num">6</span> ETA Calculation</div>
        <div class="req-pill"><span class="num">7</span> Driver Availability Management</div>
        <div class="req-pill"><span class="num">8</span> Ride Pooling / Sharing</div>
        <div class="req-pill"><span class="num">9</span> Cancellation Policy &amp; Fees</div>
        <div class="req-pill"><span class="num">10</span> Rating &amp; Review System</div>
        <div class="req-pill"><span class="num">11</span> Payment Integration</div>
        <div class="req-pill"><span class="num">12</span> SOS / Emergency Support</div>
    </div>
</div>

<div class="section theme-blue">
    <div class="section-title"><span class="section-num">2</span>Core Entities</div>
    <div class="entity-grid">
        <div class="entity-card">
            <h3>Ride</h3>
            <div class="field"><span class="field-name">id</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">rideId</span><span class="field-type">String (UUID)</span></div>
            <div class="field"><span class="field-name">riderId</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">driverId</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">pickupLat</span><span class="field-type">double</span></div>
            <div class="field"><span class="field-name">pickupLng</span><span class="field-type">double</span></div>
            <div class="field"><span class="field-name">dropLat</span><span class="field-type">double</span></div>
            <div class="field"><span class="field-name">dropLng</span><span class="field-type">double</span></div>
            <div class="field"><span class="field-name">status</span><span class="field-type">RideStatus</span></div>
            <div class="field"><span class="field-name">rideType</span><span class="field-type">RideType</span></div>
            <div class="field"><span class="field-name">estimatedFare</span><span class="field-type">BigDecimal</span></div>
            <div class="field"><span class="field-name">actualFare</span><span class="field-type">BigDecimal</span></div>
            <div class="field"><span class="field-name">surgeMultiplier</span><span class="field-type">double</span></div>
            <div class="field"><span class="field-name">distanceKm</span><span class="field-type">double</span></div>
            <div class="field"><span class="field-name">durationMin</span><span class="field-type">int</span></div>
            <div class="field"><span class="field-name">startedAt</span><span class="field-type">LocalDateTime</span></div>
            <div class="field"><span class="field-name">completedAt</span><span class="field-type">LocalDateTime</span></div>
            <div class="field"><span class="field-name">createdAt</span><span class="field-type">LocalDateTime</span></div>
        </div>
        <div class="entity-card">
            <h3>Driver</h3>
            <div class="field"><span class="field-name">id</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">name</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">phone</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">vehicleNumber</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">vehicleType</span><span class="field-type">VehicleType</span></div>
            <div class="field"><span class="field-name">currentLat</span><span class="field-type">double</span></div>
            <div class="field"><span class="field-name">currentLng</span><span class="field-type">double</span></div>
            <div class="field"><span class="field-name">status</span><span class="field-type">DriverStatus</span></div>
            <div class="field"><span class="field-name">rating</span><span class="field-type">double</span></div>
            <div class="field"><span class="field-name">totalRides</span><span class="field-type">int</span></div>
        </div>
        <div class="entity-card">
            <h3>Rider</h3>
            <div class="field"><span class="field-name">id</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">name</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">phone</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">email</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">rating</span><span class="field-type">double</span></div>
            <div class="field"><span class="field-name">savedAddresses</span><span class="field-type">List&lt;Address&gt;</span></div>
            <div class="field"><span class="field-name">walletId</span><span class="field-type">Long</span></div>
        </div>
        <div class="entity-card">
            <h3>Location</h3>
            <div class="field"><span class="field-name">id</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">driverId</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">rideId</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">lat</span><span class="field-type">double</span></div>
            <div class="field"><span class="field-name">lng</span><span class="field-type">double</span></div>
            <div class="field"><span class="field-name">speed</span><span class="field-type">double (km/h)</span></div>
            <div class="field"><span class="field-name">timestamp</span><span class="field-type">LocalDateTime</span></div>
        </div>
        <div class="entity-card">
            <h3>Rating</h3>
            <div class="field"><span class="field-name">id</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">rideId</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">fromUserId</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">toUserId</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">score</span><span class="field-type">int (1-5)</span></div>
            <div class="field"><span class="field-name">comment</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">createdAt</span><span class="field-type">LocalDateTime</span></div>
        </div>
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

<div class="section theme-green">
    <div class="section-title"><span class="section-num">4</span>Interfaces &amp; SOLID Principles</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span><span class="code-title">RideInterfaces.java — Strategy + OCP</span></div>
    <pre class="code-block">
<span class="kw">public interface</span> <span class="tp">IMatchingEngine</span> {
    <span class="tp">Optional</span>&lt;<span class="tp">Driver</span>&gt; <span class="fn">findBestMatch</span>(<span class="tp">RideRequest</span> request);
    <span class="tp">List</span>&lt;<span class="tp">Driver</span>&gt; <span class="fn">findNearbyDrivers</span>(<span class="kw">double</span> lat, <span class="kw">double</span> lng, <span class="kw">double</span> radiusKm, <span class="tp">VehicleType</span> type);
}

<span class="kw">public interface</span> <span class="tp">IPricingStrategy</span> {
    <span class="tp">FareEstimate</span> <span class="fn">calculate</span>(<span class="kw">double</span> distanceKm, <span class="kw">int</span> durationMin, <span class="tp">RideType</span> type);
    <span class="kw">double</span> <span class="fn">getSurgeMultiplier</span>(<span class="kw">double</span> lat, <span class="kw">double</span> lng);
}

<span class="kw">public interface</span> <span class="tp">ILocationService</span> {
    <span class="kw">void</span> <span class="fn">updateDriverLocation</span>(<span class="tp">Long</span> driverId, <span class="kw">double</span> lat, <span class="kw">double</span> lng);
    <span class="tp">Location</span> <span class="fn">getDriverLocation</span>(<span class="tp">Long</span> driverId);
    <span class="tp">List</span>&lt;<span class="tp">Location</span>&gt; <span class="fn">getRideTrack</span>(<span class="tp">Long</span> rideId);
}

<span class="kw">public interface</span> <span class="tp">IRideService</span> {
    <span class="tp">Ride</span> <span class="fn">requestRide</span>(<span class="tp">RideRequest</span> request);
    <span class="tp">Ride</span> <span class="fn">acceptRide</span>(<span class="tp">Long</span> rideId, <span class="tp">Long</span> driverId);
    <span class="tp">Ride</span> <span class="fn">startRide</span>(<span class="tp">Long</span> rideId);
    <span class="tp">Ride</span> <span class="fn">completeRide</span>(<span class="tp">Long</span> rideId);
    <span class="tp">Ride</span> <span class="fn">cancelRide</span>(<span class="tp">Long</span> rideId, <span class="tp">CancellationReason</span> reason);
}
    </pre></div>
</div>

<div class="section theme-blue">
    <div class="section-title"><span class="section-num">5</span>Class Design (JPA Entities)</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span><span class="code-title">Ride.java — JPA Entity</span></div>
    <pre class="code-block">
<span class="ann">@Entity</span>
<span class="ann">@Table</span>(name = <span class="st">"rides"</span>, indexes = {
    <span class="ann">@Index</span>(name = <span class="st">"idx_ride_rider"</span>, columnList = <span class="st">"rider_id, created_at DESC"</span>),
    <span class="ann">@Index</span>(name = <span class="st">"idx_ride_driver"</span>, columnList = <span class="st">"driver_id, status"</span>),
    <span class="ann">@Index</span>(name = <span class="st">"idx_ride_status"</span>, columnList = <span class="st">"status"</span>)
})
<span class="kw">public class</span> <span class="tp">Ride</span> {
    <span class="ann">@Id</span> <span class="ann">@GeneratedValue</span>(strategy = <span class="tp">GenerationType</span>.IDENTITY)
    <span class="kw">private</span> <span class="tp">Long</span> id;

    <span class="ann">@Column</span>(unique = <span class="kw">true</span>)
    <span class="kw">private</span> <span class="tp">String</span> rideId;

    <span class="kw">private</span> <span class="tp">Long</span> riderId;
    <span class="kw">private</span> <span class="tp">Long</span> driverId;
    <span class="kw">private double</span> pickupLat, pickupLng;
    <span class="kw">private double</span> dropLat, dropLng;

    <span class="ann">@Enumerated</span>(<span class="tp">EnumType</span>.STRING)
    <span class="kw">private</span> <span class="tp">RideStatus</span> status;

    <span class="ann">@Enumerated</span>(<span class="tp">EnumType</span>.STRING)
    <span class="kw">private</span> <span class="tp">RideType</span> rideType;

    <span class="ann">@Column</span>(precision = <span class="cn">10</span>, scale = <span class="cn">2</span>)
    <span class="kw">private</span> <span class="tp">BigDecimal</span> estimatedFare;
    <span class="kw">private</span> <span class="tp">BigDecimal</span> actualFare;
    <span class="kw">private double</span> surgeMultiplier = <span class="cn">1.0</span>;
    <span class="kw">private double</span> distanceKm;
    <span class="kw">private int</span> durationMin;

    <span class="kw">private</span> <span class="tp">LocalDateTime</span> startedAt;
    <span class="kw">private</span> <span class="tp">LocalDateTime</span> completedAt;
    <span class="ann">@CreationTimestamp</span>
    <span class="kw">private</span> <span class="tp">LocalDateTime</span> createdAt;
}
    </pre></div>
</div>

<div class="section theme-purple">
    <div class="section-title"><span class="section-num">6</span>Repository / DAO Layer</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span><span class="code-title">RideRepository.java</span></div>
    <pre class="code-block">
<span class="kw">public interface</span> <span class="tp">RideRepository</span> <span class="kw">extends</span> <span class="tp">JpaRepository</span>&lt;<span class="tp">Ride</span>, <span class="tp">Long</span>&gt; {
    <span class="tp">Optional</span>&lt;<span class="tp">Ride</span>&gt; <span class="fn">findByRideId</span>(<span class="tp">String</span> rideId);
    <span class="tp">Page</span>&lt;<span class="tp">Ride</span>&gt; <span class="fn">findByRiderIdOrderByCreatedAtDesc</span>(<span class="tp">Long</span> riderId, <span class="tp">Pageable</span> p);
    <span class="tp">Optional</span>&lt;<span class="tp">Ride</span>&gt; <span class="fn">findByDriverIdAndStatus</span>(<span class="tp">Long</span> driverId, <span class="tp">RideStatus</span> status);
}

<span class="kw">public interface</span> <span class="tp">DriverRepository</span> <span class="kw">extends</span> <span class="tp">JpaRepository</span>&lt;<span class="tp">Driver</span>, <span class="tp">Long</span>&gt; {
    <span class="cm">// GeoHash-based nearby driver query (using Redis GEO in practice)</span>
    <span class="ann">@Query</span>(value = <span class="st">"SELECT * FROM drivers WHERE status = 'AVAILABLE' AND vehicle_type = :type AND ST_Distance_Sphere(POINT(current_lng, current_lat), POINT(:lng, :lat)) &lt;= :radiusM"</span>, nativeQuery = <span class="kw">true</span>)
    <span class="tp">List</span>&lt;<span class="tp">Driver</span>&gt; <span class="fn">findNearbyAvailable</span>(
        <span class="ann">@Param</span>(<span class="st">"lat"</span>) <span class="kw">double</span> lat, <span class="ann">@Param</span>(<span class="st">"lng"</span>) <span class="kw">double</span> lng,
        <span class="ann">@Param</span>(<span class="st">"radiusM"</span>) <span class="kw">double</span> radiusMeters, <span class="ann">@Param</span>(<span class="st">"type"</span>) <span class="tp">String</span> type);
}
    </pre></div>
</div>

<div class="section theme-green">
    <div class="section-title"><span class="section-num">7</span>Database Schema</div>
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
</div>

<div class="section theme-blue">
    <div class="section-title"><span class="section-num">8</span>API Endpoints</div>
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

<div class="section theme-purple">
    <div class="section-title"><span class="section-num">9</span>Service Layer</div>
    <div class="service-grid">
        <div class="service-card">
            <h3>RideService</h3>
            <p class="svc-desc">Handles ride requests — creates ride, finds a driver, assigns them, and notifies both</p>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Request a new ride</div><code>Ride requestRide(RideRequest request)</code></div>
        </div>
        <div class="service-card">
            <h3>MatchingEngine</h3>
            <p class="svc-desc">Finds the best driver nearby — searches by location, then ranks by distance, rating, and acceptance rate</p>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Find the best available driver for the ride</div><code>Optional&lt;Driver&gt; findBestMatch(RideRequest request)</code></div>
        </div>
        <div class="service-card">
            <h3>PricingService</h3>
            <p class="svc-desc">Calculates ride fare — base fare + per km + per minute + surge pricing</p>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Calculate the fare for a ride</div><code>BigDecimal calculateFare(double distanceKm, int durationMin, RideType type)</code></div>
        </div>
        <div class="service-card">
            <h3>SurgePricingService</h3>
            <p class="svc-desc">Increases price when demand is high in an area (1x to 3x multiplier)</p>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Get the surge multiplier for a location</div><code>double getSurgeMultiplier(double lat, double lng)</code></div>
        </div>
        <div class="service-card">
            <h3>LocationService</h3>
            <p class="svc-desc">Tracks driver location in real-time using Redis, shows live position to the rider</p>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Update driver's current location</div><code>void updateLocation(Long driverId, double lat, double lng)</code></div>
        </div>
        <div class="service-card">
            <h3>ETAService</h3>
            <p class="svc-desc">Estimates how long the driver will take to arrive at pickup or drop location</p>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Calculate estimated time of arrival</div><code>Duration calculateETA(GeoPoint from, GeoPoint to)</code></div>
        </div>
        <div class="service-card">
            <h3>RatingService</h3>
            <p class="svc-desc">Handles rider and driver ratings after a trip, flags low-rated drivers</p>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Rate a ride (1-5 stars)</div><code>void rate(String rideId, int score, String feedback)</code></div>
        </div>
        <div class="service-card">
            <h3>NotificationService</h3>
            <p class="svc-desc">Sends push notifications to drivers about new ride requests (30 second timeout to accept)</p>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Notify driver about a new ride request</div><code>void notifyDriver(Long driverId, Ride ride)</code></div>
        </div>
    </div>
</div>

<div class="section theme-green">
    <div class="section-title"><span class="section-num">10</span>Key Architecture</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span><span class="code-title">MatchingEngine.java — GeoSpatial + Scoring</span></div>
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
    <div class="section-title"><span class="section-num">11</span>Design Patterns Used</div>
    <div class="pattern-grid">
        <div class="pattern-card"><h3>Strategy</h3><p>IPricingStrategy for ride types (Mini, Sedan, SUV) — different base fare, per-km, per-min rates</p></div>
        <div class="pattern-card"><h3>Observer</h3><p>Location updates trigger WebSocket push to rider; ride status changes trigger notifications</p></div>
        <div class="pattern-card"><h3>State Machine</h3><p>RideStatus transitions: REQUESTED→ASSIGNED→ARRIVED→IN_PROGRESS→COMPLETED</p></div>
        <div class="pattern-card"><h3>Mediator</h3><p>MatchingEngine mediates between riders and drivers; decouples request from assignment</p></div>
        <div class="pattern-card"><h3>Command</h3><p>RideCommand (request, accept, start, complete, cancel) — encapsulates ride actions with validation</p></div>
        <div class="pattern-card"><h3>Factory</h3><p>PricingFactory creates pricing strategy based on ride type + city + time of day</p></div>
    </div>
</div>

<div class="section theme-purple">
    <div class="section-title"><span class="section-num">12</span>Sequence Flow</div>
    <div class="flow-container">
        <div class="flow-step"><span class="step-num">1</span><span class="step-text">Rider opens app → enters pickup &amp; drop → gets fare estimate</span></div>
        <div class="flow-step"><span class="step-num">2</span><span class="step-text">Rider confirms → POST /rides/request (status = REQUESTED)</span></div>
        <div class="flow-step"><span class="step-num">3</span><span class="step-text">MatchingEngine finds top 3 nearest available drivers via Redis GEORADIUS</span></div>
        <div class="flow-step"><span class="step-num">4</span><span class="step-text">Push notification sent to best match driver (30s accept timeout)</span></div>
        <div class="flow-step"><span class="step-num">5</span><span class="step-text">Driver accepts → status = DRIVER_ASSIGNED, rider gets driver details</span></div>
        <div class="flow-step"><span class="step-num">6</span><span class="step-text">Driver arrives at pickup → status = DRIVER_ARRIVED, rider gets OTP</span></div>
        <div class="flow-step"><span class="step-num">7</span><span class="step-text">Driver verifies OTP → starts ride → status = IN_PROGRESS</span></div>
        <div class="flow-step"><span class="step-num">8</span><span class="step-text">Real-time location tracked via WebSocket (every 3s update)</span></div>
        <div class="flow-step"><span class="step-num">9</span><span class="step-text">Driver reaches drop → completes ride → actual fare calculated</span></div>
        <div class="flow-step"><span class="step-num">10</span><span class="step-text">Payment processed → rating screen shown → ride archived</span></div>
    </div>
</div>

<div class="section theme-green">
    <div class="section-title"><span class="section-num">13</span>Capacity Estimation</div>
    <div class="cap-grid">
        <div class="cap-card"><div class="cap-label">Daily Rides</div><div class="cap-value">15M rides/day</div></div>
        <div class="cap-card"><div class="cap-label">Active Drivers</div><div class="cap-value">5M online at peak</div></div>
        <div class="cap-card"><div class="cap-label">Location Updates / sec</div><div class="cap-value">~1.7M (5M drivers × every 3s)</div></div>
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

<div class="section theme-blue">
    <div class="section-title"><span class="section-num">14</span>Bottlenecks &amp; Solutions</div>
    <div class="bottleneck-grid">
        <div class="bottleneck-card"><h3>Location Update Storm</h3><p>Redis GEO for writes; batch WebSocket pushes; Kafka for location history persistence</p></div>
        <div class="bottleneck-card"><h3>Matching at Scale</h3><p>GeoHash-based partitioning; pre-computed supply-demand index; locality-based sharding</p></div>
        <div class="bottleneck-card"><h3>Surge Calculation</h3><p>Pre-computed per GeoHash cell every 30s; Redis cache; not per-request calculation</p></div>
        <div class="bottleneck-card"><h3>WebSocket Connection Limit</h3><p>Horizontal scaling with sticky sessions; Redis pub/sub for cross-node delivery</p></div>
        <div class="bottleneck-card"><h3>ETA Accuracy</h3><p>Cache popular routes; use historical traffic data; ML model for peak hours</p></div>
        <div class="bottleneck-card"><h3>Driver Timeout Cascade</h3><p>If driver doesn't accept in 30s → auto-skip to next nearest; limit 3 attempts → NO_DRIVERS</p></div>
    </div>
</div>

<div class="section theme-purple">
    <div class="section-title"><span class="section-num">15</span>Edge Cases</div>
    <div class="edge-grid">
        <div class="edge-card"><h3>No Drivers Available</h3><p>Retry with expanding radius (5→10→15km); queue request for 60s; notify when driver found</p></div>
        <div class="edge-card"><h3>Driver GPS Lost</h3><p>Detect no location update &gt; 30s; show "last known" to rider; auto-cancel if &gt; 5min</p></div>
        <div class="edge-card"><h3>Fare Dispute</h3><p>Log full GPS trail; recalculate fare from location history; compare with estimated vs actual</p></div>
        <div class="edge-card"><h3>Simultaneous Accept</h3><p>Distributed lock on rideId (Redis SETNX); first driver wins; others get rejection</p></div>
        <div class="edge-card"><h3>Ride Pool Matching</h3><p>Match riders with similar routes (heading angle &lt; 30°); dynamic detour calculation</p></div>
        <div class="edge-card"><h3>Cancellation After Pickup</h3><p>Rider-side cancel charges full estimated fare; driver-side cancel charges minimum fare</p></div>
    </div>
</div>

<div class="section theme-green">
    <div class="section-title"><span class="section-num">16</span>Security Considerations</div>
    <div class="security-grid">
        <div class="security-card"><h3>OTP for Ride Start</h3><p>4-digit OTP sent to rider; driver must verify before starting — prevents wrong passenger</p></div>
        <div class="security-card"><h3>SOS / Emergency</h3><p>Panic button shares live location with emergency contacts + support; auto-call 911</p></div>
        <div class="security-card"><h3>Location Privacy</h3><p>Only share driver location during active ride; mask exact home/office locations</p></div>
        <div class="security-card"><h3>Phone Masking</h3><p>Virtual phone numbers (Twilio) for rider-driver calls; real numbers never exposed</p></div>
        <div class="security-card"><h3>Driver Background Check</h3><p>KYC verification; criminal background check; periodic document re-validation</p></div>
    </div>
</div>

<div class="section theme-blue">
    <div class="section-title"><span class="section-num">17</span>Interview Cheat-Sheet</div>
    <div class="summary-grid">
        <div class="summary-card"><strong>Matching</strong><br>Redis GEORADIUS for nearby drivers; score by distance + rating; 30s accept timeout</div>
        <div class="summary-card"><strong>Location</strong><br>Redis GEO for real-time; WebSocket push to rider; Kafka → TimescaleDB for history</div>
        <div class="summary-card"><strong>Surge</strong><br>Demand/supply ratio per GeoHash cell; pre-computed every 30s; 1.0×-3.0× multiplier</div>
        <div class="summary-card"><strong>Pricing</strong><br>Strategy pattern: base + per-km + per-min × surge; different rates per ride type</div>
        <div class="summary-card"><strong>State Machine</strong><br>REQUESTED→ASSIGNED→ARRIVED→IN_PROGRESS→COMPLETED; OTP verification for start</div>
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
