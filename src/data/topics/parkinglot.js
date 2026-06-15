export default {
  title: "Parking Lot &mdash; Low Level Design",
  subtitle: "Complete LLD for Java Spring Boot Interview &mdash; Multi-Floor, Vehicle Types, Ticketing &amp; Payment",
  subtitleColor: "#e0f7fa",
  headerGradient: "linear-gradient(135deg,#00695c,#00897b,#4db6ac)",
  footerText: "Parking Lot &mdash; Low Level Design",
  content: `
<div class="section theme-green">
    <div class="section-title"><span class="section-num">1</span>Functional Requirements</div>
    <div class="req-grid">
        <div class="req-pill"><span class="num">1</span><div class="fr-content"><div class="fr-en">Multi-floor parking lot with configurable spots per floor</div><div class="fr-hi">Parking lot me multiple floors honge aur har floor pe configurable number of spots honge &mdash; admin ground floor pe 50 spots aur first floor pe 40 spots set kar sakta hai</div></div></div>
        <div class="req-pill"><span class="num">2</span><div class="fr-content"><div class="fr-en">Support multiple vehicle types (Bike, Car, Truck)</div><div class="fr-hi">Alag-alag vehicle types support karne hain &mdash; Bike ko small spot, Car ko medium, Truck ko large spot assign hoga, ek Truck Car wali spot me nahi ja sakta</div></div></div>
        <div class="req-pill"><span class="num">3</span><div class="fr-content"><div class="fr-en">Assign nearest available spot to incoming vehicle</div><div class="fr-hi">Jab vehicle aaye toh usko sabse nearest available spot dena hai &mdash; entrance se closest spot milna chahiye taki customer ko door na jaana pade</div></div></div>
        <div class="req-pill"><span class="num">4</span><div class="fr-content"><div class="fr-en">Generate parking ticket on entry</div><div class="fr-hi">Vehicle enter kare toh ticket generate hoga &mdash; ticket me vehicle number, spot info, entry time, floor number sab hoga, ye ticket exit pe payment ke liye chahiye</div></div></div>
        <div class="req-pill"><span class="num">5</span><div class="fr-content"><div class="fr-en">Calculate parking fee based on duration and vehicle type</div><div class="fr-hi">Parking fee calculate hogi based on kitni der khadi rahi gaadi &mdash; Bike ka rate alag, Car ka alag, Truck ka alag, aur hourly basis pe charge hoga</div></div></div>
        <div class="req-pill"><span class="num">6</span><div class="fr-content"><div class="fr-en">Process payment (Cash, Card, UPI)</div><div class="fr-hi">Payment ke multiple modes support karne hain &mdash; Cash counter pe de sakte hain, Card swipe kar sakte hain, ya UPI se scan karke pay kar sakte hain</div></div></div>
        <div class="req-pill"><span class="num">7</span><div class="fr-content"><div class="fr-en">Track real-time availability per floor and vehicle type</div><div class="fr-hi">Real-time me pata hona chahiye ki kaun se floor pe kitni spots available hain &mdash; display boards pe dikhega "Floor 1: 5 Car spots free, 2 Bike spots free"</div></div></div>
        <div class="req-pill"><span class="num">8</span><div class="fr-content"><div class="fr-en">Multiple entry and exit gates</div><div class="fr-hi">Multiple gates honge entry aur exit ke liye &mdash; concurrent vehicles handle karne ke liye ek se zyada gates chahiye, har gate pe ticket scan hoga</div></div></div>
        <div class="req-pill"><span class="num">9</span><div class="fr-content"><div class="fr-en">Vehicle search by registration number</div><div class="fr-hi">Registration number se vehicle search kar sakte hain &mdash; agar koi bhool gaya ki gaadi kahaan park ki toh number dalke spot location mil jayegi</div></div></div>
        <div class="req-pill"><span class="num">10</span><div class="fr-content"><div class="fr-en">EV charging spot support</div><div class="fr-hi">Electric vehicle ke liye special charging spots hone chahiye &mdash; ye spots pe charging station laga hoga, EV wale specifically ye spot request kar sakte hain</div></div></div>
        <div class="req-pill"><span class="num">11</span><div class="fr-content"><div class="fr-en">Handicapped / Reserved spot support</div><div class="fr-hi">Handicapped aur VIP ke liye reserved spots hone chahiye &mdash; ye spots normal vehicles ko assign nahi honge, sirf authorized vehicles ko milenge</div></div></div>
        <div class="req-pill"><span class="num">12</span><div class="fr-content"><div class="fr-en">Admin panel for rate configuration and reports</div><div class="fr-hi">Admin panel se rates change kar sakte hain aur reports dekh sakte hain &mdash; daily revenue, peak hours, average occupancy sab reports me dikhega</div></div></div>
    </div>
</div>

<!-- ============ NON-FUNCTIONAL REQUIREMENTS ============ -->
<div class="section theme-pink">
    <div class="section-title"><span class="section-num">2</span>Non-Functional Requirements</div>
    <div class="req-grid">
        <div class="req-pill"><span class="num">1</span><div class="nfr-content"><div class="nfr-en">Concurrency &mdash; Multiple gates issuing tickets simultaneously without double-booking</div><div class="nfr-hi">Multiple gates pe ek hi time pe ticket issue ho toh same spot assign nahi honi chahiye &mdash; locking mechanism chahiye</div></div></div>
        <div class="req-pill"><span class="num">2</span><div class="nfr-content"><div class="nfr-en">Low Latency &mdash; Spot assignment under 100ms</div><div class="nfr-hi">Spot assign karna 100ms se kam me hona chahiye &mdash; gate pe gaadi zyada der nahi rukni chahiye</div></div></div>
        <div class="req-pill"><span class="num">3</span><div class="nfr-content"><div class="nfr-en">Data Consistency &mdash; Spot status always accurate across all gates</div><div class="nfr-hi">Sab gates pe spot ka status consistent hona chahiye &mdash; ek gate pe occupied dikhaye toh doosre pe bhi occupied dikhna chahiye</div></div></div>
        <div class="req-pill"><span class="num">4</span><div class="nfr-content"><div class="nfr-en">Fault Tolerance &mdash; System works even if one gate terminal fails</div><div class="nfr-hi">Ek gate ka terminal kharab ho jaye toh baaki gates pe kaam chalta rahe &mdash; single point of failure nahi hona chahiye</div></div></div>
        <div class="req-pill"><span class="num">5</span><div class="nfr-content"><div class="nfr-en">Scalability &mdash; Support 10,000+ spots across multiple floors</div><div class="nfr-hi">10,000+ spots handle karne chahiye &mdash; mall ya airport jaise large parking lots ke liye scalable hona chahiye</div></div></div>
        <div class="req-pill"><span class="num">6</span><div class="nfr-content"><div class="nfr-en">Auditability &mdash; Complete log of entries, exits, and payments</div><div class="nfr-hi">Har entry, exit aur payment ka complete log hona chahiye &mdash; audit aur dispute resolution ke liye zaroori hai</div></div></div>
    </div>
</div>

<div class="section theme-purple">
    <div class="section-title"><span class="section-num">3</span>Enums</div>
    <div class="enum-grid">
        <div class="enum-card"><h3>VehicleType</h3><div class="enum-val">BIKE</div><div class="enum-val">CAR</div><div class="enum-val">TRUCK</div><div class="enum-val">BUS</div><div class="enum-val">ELECTRIC</div></div>
        <div class="enum-card"><h3>SpotType</h3><div class="enum-val">SMALL</div><div class="enum-val">MEDIUM</div><div class="enum-val">LARGE</div><div class="enum-val">EV_CHARGING</div><div class="enum-val">HANDICAPPED</div></div>
        <div class="enum-card"><h3>SpotStatus</h3><div class="enum-val">AVAILABLE</div><div class="enum-val">OCCUPIED</div><div class="enum-val">RESERVED</div><div class="enum-val">OUT_OF_SERVICE</div></div>
        <div class="enum-card"><h3>TicketStatus</h3><div class="enum-val">ACTIVE</div><div class="enum-val">PAID</div><div class="enum-val">LOST</div><div class="enum-val">EXPIRED</div></div>
        <div class="enum-card"><h3>PaymentMode</h3><div class="enum-val">CASH</div><div class="enum-val">CREDIT_CARD</div><div class="enum-val">DEBIT_CARD</div><div class="enum-val">UPI</div></div>
        <div class="enum-card"><h3>GateType</h3><div class="enum-val">ENTRY</div><div class="enum-val">EXIT</div><div class="enum-val">ENTRY_EXIT</div></div>
    </div>
</div>

<div class="section theme-purple">
    <div class="section-title"><span class="section-num">4</span>Service LLD</div>
    <div class="service-grid">
        <div class="service-card">
            <h3>ParkingLotService</h3>
            <p class="svc-desc">Core service jo parking lot ki overall state manage karta hai &mdash; floors, spots, capacity sab iske through access hota hai</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">ParkingLotService</span> {

    <span class="cm">// parking lot initialize karta hai floors aur spots ke saath</span>
    <span class="tp">ParkingLot</span> <span class="fn">initializeLot</span>(<span class="tp">String</span> name, <span class="tp">int</span> floors, <span class="tp">Map</span>&lt;<span class="tp">SpotType</span>, <span class="tp">Integer</span>&gt; spotsPerFloor)

    <span class="cm">// total available spots return karta hai by vehicle type</span>
    <span class="tp">int</span> <span class="fn">getAvailableSpots</span>(<span class="tp">VehicleType</span> vehicleType)

    <span class="cm">// floor-wise availability map return karta hai</span>
    <span class="tp">Map</span>&lt;<span class="tp">Integer</span>, <span class="tp">Integer</span>&gt; <span class="fn">getFloorWiseAvailability</span>(<span class="tp">VehicleType</span> vehicleType)

    <span class="cm">// parking lot full hai ya nahi check karta hai</span>
    <span class="tp">boolean</span> <span class="fn">isFull</span>(<span class="tp">VehicleType</span> vehicleType)
}
</pre></div>
        </div>
        <div class="service-card">
            <h3>SpotAllocationService</h3>
            <p class="svc-desc">Vehicle ke liye best spot find karke assign karta hai &mdash; Strategy pattern use karta hai nearest-first, floor-priority ya random allocation ke liye</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">SpotAllocationService</span> {

    <span class="cm">// vehicle type ke basis pe nearest available spot find karta hai</span>
    <span class="tp">Optional</span>&lt;<span class="tp">ParkingSpot</span>&gt; <span class="fn">findAndAllocate</span>(<span class="tp">VehicleType</span> vehicleType, <span class="tp">int</span> entryGateFloor)

    <span class="cm">// specific spot ko free karta hai jab vehicle exit kare</span>
    <span class="tp">void</span> <span class="fn">deallocate</span>(<span class="tp">ParkingSpot</span> spot)

    <span class="cm">// check karta hai ki ye vehicle type is spot me fit hoga ya nahi</span>
    <span class="tp">boolean</span> <span class="fn">canFit</span>(<span class="tp">VehicleType</span> vehicleType, <span class="tp">SpotType</span> spotType)

    <span class="cm">// EV spots ko prefer karta hai electric vehicles ke liye</span>
    <span class="tp">Optional</span>&lt;<span class="tp">ParkingSpot</span>&gt; <span class="fn">findEVSpot</span>(<span class="tp">int</span> preferredFloor)
}
</pre></div>
        </div>
        <div class="service-card">
            <h3>TicketService</h3>
            <p class="svc-desc">Entry pe ticket generate karta hai aur exit pe ticket validate karta hai &mdash; ticket me vehicle info, spot info, entry time sab store hota hai</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">TicketService</span> {

    <span class="cm">// entry pe naya ticket generate karta hai with unique ID</span>
    <span class="tp">ParkingTicket</span> <span class="fn">generateTicket</span>(<span class="tp">Vehicle</span> vehicle, <span class="tp">ParkingSpot</span> spot, <span class="tp">Gate</span> entryGate)

    <span class="cm">// ticket ID se ticket details fetch karta hai</span>
    <span class="tp">ParkingTicket</span> <span class="fn">getTicket</span>(<span class="tp">String</span> ticketId)

    <span class="cm">// exit pe ticket close karta hai with exit time</span>
    <span class="tp">void</span> <span class="fn">closeTicket</span>(<span class="tp">String</span> ticketId, <span class="tp">Gate</span> exitGate)

    <span class="cm">// lost ticket scenario handle karta hai — vehicle number se ticket find karta hai</span>
    <span class="tp">ParkingTicket</span> <span class="fn">findByVehicleNumber</span>(<span class="tp">String</span> registrationNumber)
}
</pre></div>
        </div>
        <div class="service-card">
            <h3>FeeCalculatorService</h3>
            <p class="svc-desc">Parking duration aur vehicle type ke basis pe fee calculate karta hai &mdash; Strategy pattern se different pricing models support karta hai</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">FeeCalculatorService</span> {

    <span class="cm">// ticket ke basis pe total fee calculate karta hai</span>
    <span class="tp">BigDecimal</span> <span class="fn">calculateFee</span>(<span class="tp">ParkingTicket</span> ticket)

    <span class="cm">// hourly rate return karta hai vehicle type ke liye</span>
    <span class="tp">BigDecimal</span> <span class="fn">getHourlyRate</span>(<span class="tp">VehicleType</span> vehicleType)

    <span class="cm">// lost ticket pe penalty fee calculate karta hai — max hours charge hoga</span>
    <span class="tp">BigDecimal</span> <span class="fn">calculateLostTicketFee</span>(<span class="tp">VehicleType</span> vehicleType)

    <span class="cm">// weekend/holiday pe surge pricing apply karta hai</span>
    <span class="tp">BigDecimal</span> <span class="fn">applySurge</span>(<span class="tp">BigDecimal</span> baseFee, <span class="tp">LocalDateTime</span> entryTime)
}
</pre></div>
        </div>
        <div class="service-card">
            <h3>PaymentService</h3>
            <p class="svc-desc">Payment process karta hai multiple modes me &mdash; Cash, Card, UPI sabko handle karta hai aur receipt generate karta hai</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">PaymentService</span> {

    <span class="cm">// payment process karta hai given mode se</span>
    <span class="tp">PaymentReceipt</span> <span class="fn">processPayment</span>(<span class="tp">ParkingTicket</span> ticket, <span class="tp">PaymentMode</span> mode, <span class="tp">BigDecimal</span> amount)

    <span class="cm">// refund initiate karta hai agar overcharge hua ho</span>
    <span class="tp">PaymentReceipt</span> <span class="fn">processRefund</span>(<span class="tp">String</span> paymentId, <span class="tp">BigDecimal</span> refundAmount)

    <span class="cm">// payment receipt generate karta hai PDF ya digital format me</span>
    <span class="tp">Receipt</span> <span class="fn">generateReceipt</span>(<span class="tp">String</span> paymentId)
}
</pre></div>
        </div>
        <div class="service-card">
            <h3>GateService</h3>
            <p class="svc-desc">Entry aur exit gates manage karta hai &mdash; barrier open/close, ticket scan, display board update sab handle karta hai</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">GateService</span> {

    <span class="cm">// entry gate pe vehicle aane pe pura flow handle karta hai</span>
    <span class="tp">ParkingTicket</span> <span class="fn">handleEntry</span>(<span class="tp">Vehicle</span> vehicle, <span class="tp">Gate</span> gate)

    <span class="cm">// exit gate pe ticket scan karke payment aur exit handle karta hai</span>
    <span class="tp">PaymentReceipt</span> <span class="fn">handleExit</span>(<span class="tp">String</span> ticketId, <span class="tp">Gate</span> gate, <span class="tp">PaymentMode</span> mode)

    <span class="cm">// gate ka barrier open ya close karta hai</span>
    <span class="tp">void</span> <span class="fn">operateBarrier</span>(<span class="tp">Gate</span> gate, <span class="tp">boolean</span> open)

    <span class="cm">// display board update karta hai with availability info</span>
    <span class="tp">void</span> <span class="fn">updateDisplayBoard</span>(<span class="tp">Gate</span> gate)
}
</pre></div>
        </div>
        <div class="service-card">
            <h3>DisplayBoardService</h3>
            <p class="svc-desc">Har floor pe display board manage karta hai jo real-time availability dikhata hai &mdash; Observer pattern se spot changes pe auto-update hota hai</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">DisplayBoardService</span> {

    <span class="cm">// specific floor ka display board update karta hai</span>
    <span class="tp">void</span> <span class="fn">updateFloorDisplay</span>(<span class="tp">int</span> floorNumber)

    <span class="cm">// entrance pe overall availability dikhata hai</span>
    <span class="tp">DisplayInfo</span> <span class="fn">getEntranceDisplay</span>()

    <span class="cm">// spot status change hone pe Observer pattern se notify hota hai</span>
    <span class="tp">void</span> <span class="fn">onSpotStatusChange</span>(<span class="tp">ParkingSpot</span> spot, <span class="tp">SpotStatus</span> newStatus)
}
</pre></div>
        </div>
    </div>
</div>

<div class="section theme-teal">
    <div class="section-title"><span class="section-num">5</span>APIs</div>
    <div class="api-grid">
        <div class="api-card"><span class="api-method post">POST</span><span class="api-path">/api/v1/parking/entry</span><span class="api-desc">Vehicle entry &mdash; spot allocate karke ticket generate karta hai</span></div>
        <div class="api-card"><span class="api-method post">POST</span><span class="api-path">/api/v1/parking/exit</span><span class="api-desc">Vehicle exit &mdash; fee calculate karke payment process karta hai</span></div>
        <div class="api-card"><span class="api-method get">GET</span><span class="api-path">/api/v1/parking/availability</span><span class="api-desc">Floor-wise aur type-wise available spots return karta hai</span></div>
        <div class="api-card"><span class="api-method get">GET</span><span class="api-path">/api/v1/parking/ticket/{ticketId}</span><span class="api-desc">Ticket details fetch karta hai with spot aur vehicle info</span></div>
        <div class="api-card"><span class="api-method get">GET</span><span class="api-path">/api/v1/parking/search?regNo={regNo}</span><span class="api-desc">Registration number se vehicle ka spot location find karta hai</span></div>
        <div class="api-card"><span class="api-method post">POST</span><span class="api-path">/api/v1/parking/payment</span><span class="api-desc">Payment process karta hai for given ticket</span></div>
        <div class="api-card"><span class="api-method put">PUT</span><span class="api-path">/api/v1/admin/rates</span><span class="api-desc">Admin parking rates update karta hai vehicle type wise</span></div>
        <div class="api-card"><span class="api-method get">GET</span><span class="api-path">/api/v1/admin/reports</span><span class="api-desc">Revenue, occupancy aur peak hour reports generate karta hai</span></div>
    </div>
</div>

<div class="section theme-pink">
    <div class="section-title"><span class="section-num">6</span>Database Schema</div>
    <div class="db-grid">
        <div class="db-table">
            <h3>parking_lot</h3>
            <div class="db-row"><span class="col-name">id</span><span class="col-type">UUID PK</span></div>
            <div class="db-row"><span class="col-name">name</span><span class="col-type">VARCHAR(100)</span></div>
            <div class="db-row"><span class="col-name">address</span><span class="col-type">TEXT</span></div>
            <div class="db-row"><span class="col-name">total_floors</span><span class="col-type">INT</span></div>
            <div class="db-row"><span class="col-name">total_spots</span><span class="col-type">INT</span></div>
            <div class="db-row"><span class="col-name">status</span><span class="col-type">ENUM(ACTIVE, INACTIVE)</span></div>
            <div class="db-row"><span class="col-name">created_at</span><span class="col-type">TIMESTAMP</span></div>
        </div>
        <div class="db-table">
            <h3>parking_floor</h3>
            <div class="db-row"><span class="col-name">id</span><span class="col-type">UUID PK</span></div>
            <div class="db-row"><span class="col-name">lot_id</span><span class="col-type">UUID FK</span></div>
            <div class="db-row"><span class="col-name">floor_number</span><span class="col-type">INT</span></div>
            <div class="db-row"><span class="col-name">total_spots</span><span class="col-type">INT</span></div>
            <div class="db-row"><span class="col-name">available_spots</span><span class="col-type">INT</span></div>
            <div class="db-row"><span class="col-name">display_board_id</span><span class="col-type">UUID FK</span></div>
        </div>
        <div class="db-table">
            <h3>parking_spot</h3>
            <div class="db-row"><span class="col-name">id</span><span class="col-type">UUID PK</span></div>
            <div class="db-row"><span class="col-name">floor_id</span><span class="col-type">UUID FK</span></div>
            <div class="db-row"><span class="col-name">spot_number</span><span class="col-type">VARCHAR(10)</span></div>
            <div class="db-row"><span class="col-name">spot_type</span><span class="col-type">ENUM</span></div>
            <div class="db-row"><span class="col-name">status</span><span class="col-type">ENUM</span></div>
            <div class="db-row"><span class="col-name">vehicle_id</span><span class="col-type">UUID FK NULL</span></div>
            <div class="db-row"><span class="col-name">has_ev_charger</span><span class="col-type">BOOLEAN</span></div>
        </div>
        <div class="db-table">
            <h3>vehicle</h3>
            <div class="db-row"><span class="col-name">id</span><span class="col-type">UUID PK</span></div>
            <div class="db-row"><span class="col-name">registration_no</span><span class="col-type">VARCHAR(20) UNIQUE</span></div>
            <div class="db-row"><span class="col-name">vehicle_type</span><span class="col-type">ENUM</span></div>
            <div class="db-row"><span class="col-name">color</span><span class="col-type">VARCHAR(30)</span></div>
            <div class="db-row"><span class="col-name">owner_name</span><span class="col-type">VARCHAR(100)</span></div>
            <div class="db-row"><span class="col-name">is_electric</span><span class="col-type">BOOLEAN</span></div>
        </div>
        <div class="db-table">
            <h3>parking_ticket</h3>
            <div class="db-row"><span class="col-name">id</span><span class="col-type">UUID PK</span></div>
            <div class="db-row"><span class="col-name">ticket_number</span><span class="col-type">VARCHAR(20) UNIQUE</span></div>
            <div class="db-row"><span class="col-name">vehicle_id</span><span class="col-type">UUID FK</span></div>
            <div class="db-row"><span class="col-name">spot_id</span><span class="col-type">UUID FK</span></div>
            <div class="db-row"><span class="col-name">entry_gate_id</span><span class="col-type">UUID FK</span></div>
            <div class="db-row"><span class="col-name">exit_gate_id</span><span class="col-type">UUID FK NULL</span></div>
            <div class="db-row"><span class="col-name">entry_time</span><span class="col-type">TIMESTAMP</span></div>
            <div class="db-row"><span class="col-name">exit_time</span><span class="col-type">TIMESTAMP NULL</span></div>
            <div class="db-row"><span class="col-name">status</span><span class="col-type">ENUM</span></div>
            <div class="db-row"><span class="col-name">fee</span><span class="col-type">DECIMAL(10,2) NULL</span></div>
        </div>
        <div class="db-table">
            <h3>payment</h3>
            <div class="db-row"><span class="col-name">id</span><span class="col-type">UUID PK</span></div>
            <div class="db-row"><span class="col-name">ticket_id</span><span class="col-type">UUID FK</span></div>
            <div class="db-row"><span class="col-name">amount</span><span class="col-type">DECIMAL(10,2)</span></div>
            <div class="db-row"><span class="col-name">payment_mode</span><span class="col-type">ENUM</span></div>
            <div class="db-row"><span class="col-name">payment_status</span><span class="col-type">ENUM(SUCCESS, FAILED, REFUNDED)</span></div>
            <div class="db-row"><span class="col-name">transaction_id</span><span class="col-type">VARCHAR(50)</span></div>
            <div class="db-row"><span class="col-name">paid_at</span><span class="col-type">TIMESTAMP</span></div>
        </div>
        <div class="db-table">
            <h3>gate</h3>
            <div class="db-row"><span class="col-name">id</span><span class="col-type">UUID PK</span></div>
            <div class="db-row"><span class="col-name">lot_id</span><span class="col-type">UUID FK</span></div>
            <div class="db-row"><span class="col-name">gate_number</span><span class="col-type">INT</span></div>
            <div class="db-row"><span class="col-name">gate_type</span><span class="col-type">ENUM</span></div>
            <div class="db-row"><span class="col-name">floor_number</span><span class="col-type">INT</span></div>
            <div class="db-row"><span class="col-name">status</span><span class="col-type">ENUM(ACTIVE, INACTIVE)</span></div>
        </div>
        <div class="db-table">
            <h3>parking_rate</h3>
            <div class="db-row"><span class="col-name">id</span><span class="col-type">UUID PK</span></div>
            <div class="db-row"><span class="col-name">lot_id</span><span class="col-type">UUID FK</span></div>
            <div class="db-row"><span class="col-name">vehicle_type</span><span class="col-type">ENUM</span></div>
            <div class="db-row"><span class="col-name">hourly_rate</span><span class="col-type">DECIMAL(10,2)</span></div>
            <div class="db-row"><span class="col-name">daily_max</span><span class="col-type">DECIMAL(10,2)</span></div>
            <div class="db-row"><span class="col-name">lost_ticket_fee</span><span class="col-type">DECIMAL(10,2)</span></div>
            <div class="db-row"><span class="col-name">effective_from</span><span class="col-type">TIMESTAMP</span></div>
        </div>
    </div>
</div>

<div class="section theme-green">
    <div class="section-title"><span class="section-num">7</span>Deep Dive &mdash; Spot Allocation Strategy</div>
    <div class="section-body">
        <p>Parking lot me sabse important design decision hai ki vehicle ko kaun sa spot assign karein. Iske liye <strong>Strategy Pattern</strong> use hota hai &mdash; alag-alag algorithms ko plug-and-play kar sakte hain.</p>
        <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="cm">// Strategy Pattern — allocation algorithm plug-and-play</span>
<span class="kw">interface</span> <span class="cn">SpotAllocationStrategy</span> {
    <span class="tp">Optional</span>&lt;<span class="tp">ParkingSpot</span>&gt; <span class="fn">allocate</span>(<span class="tp">List</span>&lt;<span class="tp">ParkingFloor</span>&gt; floors,
                                       <span class="tp">VehicleType</span> vehicleType,
                                       <span class="tp">int</span> entryFloor);
}

<span class="cm">// Nearest First — entry gate ke sabse close wala spot</span>
<span class="kw">class</span> <span class="cn">NearestFirstStrategy</span> <span class="kw">implements</span> <span class="cn">SpotAllocationStrategy</span> {
    <span class="kw">public</span> <span class="tp">Optional</span>&lt;<span class="tp">ParkingSpot</span>&gt; <span class="fn">allocate</span>(<span class="tp">List</span>&lt;<span class="tp">ParkingFloor</span>&gt; floors,
                                             <span class="tp">VehicleType</span> vehicleType,
                                             <span class="tp">int</span> entryFloor) {
        <span class="cm">// Step 1: Entry floor se start karo</span>
        <span class="cm">// Step 2: Same floor pe available spot check karo</span>
        <span class="cm">// Step 3: Nahi mila toh adjacent floors pe jao (entry±1, entry±2...)</span>
        <span class="cm">// Step 4: Spot number ascending order me first available return karo</span>
        <span class="kw">return</span> floors.stream()
            .sorted(Comparator.comparingInt(f -> Math.abs(f.getFloorNumber() - entryFloor)))
            .flatMap(f -> f.getSpots().stream())
            .filter(s -> s.getStatus() == SpotStatus.AVAILABLE)
            .filter(s -> canFit(vehicleType, s.getSpotType()))
            .findFirst();
    }
}

<span class="cm">// Spread Evenly — sab floors pe evenly distribute karo</span>
<span class="kw">class</span> <span class="cn">SpreadEvenlyStrategy</span> <span class="kw">implements</span> <span class="cn">SpotAllocationStrategy</span> {
    <span class="kw">public</span> <span class="tp">Optional</span>&lt;<span class="tp">ParkingSpot</span>&gt; <span class="fn">allocate</span>(<span class="tp">List</span>&lt;<span class="tp">ParkingFloor</span>&gt; floors,
                                             <span class="tp">VehicleType</span> vehicleType,
                                             <span class="tp">int</span> entryFloor) {
        <span class="cm">// Jis floor pe sabse zyada spots available hain, wahan assign karo</span>
        <span class="kw">return</span> floors.stream()
            .max(Comparator.comparingInt(<span class="tp">ParkingFloor</span>::getAvailableCount))
            .flatMap(f -> f.getFirstAvailableSpot(vehicleType));
    }
}
</pre></div>
        <p><strong>Vehicle-Spot Mapping:</strong> Bike &rarr; SMALL/MEDIUM/LARGE me fit ho sakti hai. Car &rarr; sirf MEDIUM/LARGE me. Truck &rarr; sirf LARGE me. Is hierarchy se spot utilization optimize hota hai.</p>
        <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="cm">// Vehicle-Spot compatibility matrix</span>
<span class="kw">class</span> <span class="cn">VehicleSpotMapper</span> {
    <span class="kw">private static final</span> <span class="tp">Map</span>&lt;<span class="tp">VehicleType</span>, <span class="tp">List</span>&lt;<span class="tp">SpotType</span>&gt;&gt; COMPATIBILITY = Map.of(
        VehicleType.BIKE,  List.of(SpotType.SMALL, SpotType.MEDIUM, SpotType.LARGE),
        VehicleType.CAR,   List.of(SpotType.MEDIUM, SpotType.LARGE),
        VehicleType.TRUCK, List.of(SpotType.LARGE),
        VehicleType.BUS,   List.of(SpotType.LARGE)
    );

    <span class="kw">public static</span> <span class="tp">boolean</span> <span class="fn">canFit</span>(<span class="tp">VehicleType</span> vehicle, <span class="tp">SpotType</span> spot) {
        <span class="kw">return</span> COMPATIBILITY.getOrDefault(vehicle, List.of()).contains(spot);
    }
}
</pre></div>
    </div>
</div>

<div class="section theme-yellow">
    <div class="section-title"><span class="section-num">8</span>Deep Dive &mdash; Concurrency &amp; Locking</div>
    <div class="section-body">
        <p>Multiple entry gates pe simultaneously vehicles aayein toh same spot double-book nahi honi chahiye. Iske liye <strong>Pessimistic Locking</strong> ya <strong>Optimistic Locking</strong> use hota hai.</p>
        <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="cm">// Approach 1: Pessimistic Locking — DB row lock</span>
<span class="kw">class</span> <span class="cn">PessimisticSpotAllocator</span> {
    <span class="cm">// SELECT ... FOR UPDATE — row lock lagata hai</span>
    <span class="cm">// Jab tak transaction commit nahi hota, doosra thread wait karega</span>
    @Transactional
    <span class="kw">public</span> <span class="tp">ParkingSpot</span> <span class="fn">allocateWithLock</span>(<span class="tp">VehicleType</span> type) {
        <span class="tp">ParkingSpot</span> spot = spotRepo.findFirstAvailableForUpdate(type);
        <span class="cm">// FOR UPDATE ensures only one thread gets this spot</span>
        <span class="kw">if</span> (spot != <span class="kw">null</span>) {
            spot.setStatus(SpotStatus.OCCUPIED);
            spotRepo.save(spot);
        }
        <span class="kw">return</span> spot;
    }
}

<span class="cm">// Approach 2: Optimistic Locking — version check</span>
<span class="kw">class</span> <span class="cn">OptimisticSpotAllocator</span> {
    <span class="cm">// @Version field use karta hai — concurrent update pe exception aata hai</span>
    <span class="cm">// Retry logic lagana padta hai — agar version mismatch ho toh next spot try karo</span>
    <span class="kw">public</span> <span class="tp">ParkingSpot</span> <span class="fn">allocateWithRetry</span>(<span class="tp">VehicleType</span> type) {
        <span class="kw">for</span> (<span class="tp">int</span> retry = 0; retry &lt; MAX_RETRIES; retry++) {
            <span class="kw">try</span> {
                <span class="tp">ParkingSpot</span> spot = spotRepo.findFirstAvailable(type);
                spot.setStatus(SpotStatus.OCCUPIED);
                spotRepo.save(spot); <span class="cm">// throws OptimisticLockException on conflict</span>
                <span class="kw">return</span> spot;
            } <span class="kw">catch</span> (<span class="tp">OptimisticLockException</span> e) {
                <span class="cm">// Conflict! Doosra thread ne pehle le liya — retry next spot</span>
            }
        }
        <span class="kw">throw new</span> <span class="tp">NoSpotAvailableException</span>(<span class="kw">"All spots taken after retries"</span>);
    }
}

<span class="cm">// Approach 3: In-memory ConcurrentHashMap — single server setup</span>
<span class="kw">class</span> <span class="cn">InMemorySpotAllocator</span> {
    <span class="kw">private final</span> <span class="tp">ConcurrentHashMap</span>&lt;<span class="tp">String</span>, <span class="tp">SpotStatus</span>&gt; spotMap = <span class="kw">new</span> <span class="tp">ConcurrentHashMap</span>&lt;&gt;();

    <span class="kw">public</span> <span class="tp">boolean</span> <span class="fn">tryAllocate</span>(<span class="tp">String</span> spotId) {
        <span class="cm">// CAS operation — atomic hai, thread-safe hai</span>
        <span class="kw">return</span> spotMap.replace(spotId, SpotStatus.AVAILABLE, SpotStatus.OCCUPIED);
    }
}
</pre></div>
        <p><strong>Recommendation:</strong> Small parking lot (single server) &rarr; ConcurrentHashMap. Medium (multi-server) &rarr; Pessimistic Locking with DB. Large (high traffic) &rarr; Optimistic Locking with retry, zyada throughput milta hai.</p>
    </div>
</div>

<div class="section theme-teal">
    <div class="section-title"><span class="section-num">9</span>Deep Dive &mdash; Fee Calculation Strategy</div>
    <div class="section-body">
        <p>Parking fee calculate karna simple lagta hai but multiple pricing models support karne ke liye <strong>Strategy Pattern</strong> use karna padta hai &mdash; flat rate, hourly, tiered sab alag strategies hain.</p>
        <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="cm">// Fee Calculation Strategy Pattern</span>
<span class="kw">interface</span> <span class="cn">FeeStrategy</span> {
    <span class="tp">BigDecimal</span> <span class="fn">calculate</span>(<span class="tp">Duration</span> duration, <span class="tp">VehicleType</span> vehicleType);
}

<span class="cm">// Flat Hourly — har hour ka fixed rate</span>
<span class="kw">class</span> <span class="cn">FlatHourlyStrategy</span> <span class="kw">implements</span> <span class="cn">FeeStrategy</span> {
    <span class="kw">public</span> <span class="tp">BigDecimal</span> <span class="fn">calculate</span>(<span class="tp">Duration</span> duration, <span class="tp">VehicleType</span> type) {
        <span class="tp">long</span> hours = Math.max(1, (<span class="tp">long</span>) Math.ceil(duration.toMinutes() / 60.0));
        <span class="tp">BigDecimal</span> rate = rateConfig.getHourlyRate(type);
        <span class="kw">return</span> rate.multiply(BigDecimal.valueOf(hours));
    }
}

<span class="cm">// Tiered — pehle 2 hours ka alag rate, uske baad alag</span>
<span class="kw">class</span> <span class="cn">TieredStrategy</span> <span class="kw">implements</span> <span class="cn">FeeStrategy</span> {
    <span class="kw">public</span> <span class="tp">BigDecimal</span> <span class="fn">calculate</span>(<span class="tp">Duration</span> duration, <span class="tp">VehicleType</span> type) {
        <span class="tp">long</span> hours = Math.max(1, (<span class="tp">long</span>) Math.ceil(duration.toMinutes() / 60.0));
        <span class="kw">if</span> (hours &lt;= 2) <span class="kw">return</span> BigDecimal.valueOf(30); <span class="cm">// first 2 hours flat ₹30</span>
        <span class="kw">if</span> (hours &lt;= 8) <span class="kw">return</span> BigDecimal.valueOf(30 + (hours - 2) * 20); <span class="cm">// ₹20/hr after</span>
        <span class="kw">return</span> BigDecimal.valueOf(200); <span class="cm">// daily max cap ₹200</span>
    }
}

<span class="cm">// Weekend Surge — weekends pe 1.5x charge</span>
<span class="kw">class</span> <span class="cn">SurgeDecorator</span> <span class="kw">implements</span> <span class="cn">FeeStrategy</span> {
    <span class="kw">private final</span> <span class="tp">FeeStrategy</span> base;
    <span class="kw">public</span> <span class="tp">BigDecimal</span> <span class="fn">calculate</span>(<span class="tp">Duration</span> duration, <span class="tp">VehicleType</span> type) {
        <span class="tp">BigDecimal</span> baseFee = base.calculate(duration, type);
        <span class="kw">if</span> (isWeekend()) <span class="kw">return</span> baseFee.multiply(BigDecimal.valueOf(1.5));
        <span class="kw">return</span> baseFee;
    }
}
</pre></div>
    </div>
</div>

<div class="section theme-orange">
    <div class="section-title"><span class="section-num">10</span>Deep Dive &mdash; Design Patterns Used</div>
    <div class="section-body">
        <p>Parking Lot LLD me kaafi design patterns use hote hain. Ye list interview me confidently bol sakte ho:</p>
        <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Design Patterns Summary</span></div><pre class="code-block">
<span class="cm">┌─────────────────────────────────────────────────────────────┐</span>
<span class="cm">│ DESIGN PATTERN       │ WHERE USED                          │</span>
<span class="cm">├─────────────────────────────────────────────────────────────┤</span>
<span class="cm">│ Singleton            │ ParkingLot — ek hi instance hona     │</span>
<span class="cm">│                      │ chahiye poore system me              │</span>
<span class="cm">├─────────────────────────────────────────────────────────────┤</span>
<span class="cm">│ Strategy             │ SpotAllocationStrategy — nearest,    │</span>
<span class="cm">│                      │ spread-evenly, random algorithms     │</span>
<span class="cm">│                      │ FeeStrategy — flat, tiered, surge    │</span>
<span class="cm">├─────────────────────────────────────────────────────────────┤</span>
<span class="cm">│ Observer             │ DisplayBoard — spot status change pe │</span>
<span class="cm">│                      │ automatically update hota hai        │</span>
<span class="cm">├─────────────────────────────────────────────────────────────┤</span>
<span class="cm">│ Factory              │ VehicleFactory — vehicle type ke     │</span>
<span class="cm">│                      │ basis pe object create karta hai     │</span>
<span class="cm">├─────────────────────────────────────────────────────────────┤</span>
<span class="cm">│ Decorator            │ SurgeDecorator — base fee pe surge   │</span>
<span class="cm">│                      │ pricing wrap karta hai               │</span>
<span class="cm">├─────────────────────────────────────────────────────────────┤</span>
<span class="cm">│ State                │ ParkingSpot — AVAILABLE → OCCUPIED   │</span>
<span class="cm">│                      │ → RESERVED state transitions         │</span>
<span class="cm">├─────────────────────────────────────────────────────────────┤</span>
<span class="cm">│ Template Method      │ GateService — entry/exit flow ka     │</span>
<span class="cm">│                      │ skeleton fixed, steps customizable   │</span>
<span class="cm">└─────────────────────────────────────────────────────────────┘</span>
</pre></div>
        <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="cm">// Singleton Pattern — ParkingLot ek hi hona chahiye</span>
<span class="kw">class</span> <span class="cn">ParkingLot</span> {
    <span class="kw">private static volatile</span> <span class="tp">ParkingLot</span> INSTANCE;
    <span class="kw">private final</span> <span class="tp">List</span>&lt;<span class="tp">ParkingFloor</span>&gt; floors;
    <span class="kw">private final</span> <span class="tp">List</span>&lt;<span class="tp">Gate</span>&gt; gates;

    <span class="kw">private</span> <span class="fn">ParkingLot</span>() { <span class="cm">/* private constructor */</span> }

    <span class="kw">public static</span> <span class="tp">ParkingLot</span> <span class="fn">getInstance</span>() {
        <span class="kw">if</span> (INSTANCE == <span class="kw">null</span>) {
            <span class="kw">synchronized</span> (<span class="tp">ParkingLot</span>.<span class="kw">class</span>) {
                <span class="kw">if</span> (INSTANCE == <span class="kw">null</span>) {
                    INSTANCE = <span class="kw">new</span> <span class="tp">ParkingLot</span>();
                }
            }
        }
        <span class="kw">return</span> INSTANCE;
    }
}

<span class="cm">// Observer Pattern — spot change pe display board auto-update</span>
<span class="kw">interface</span> <span class="cn">SpotChangeObserver</span> {
    <span class="tp">void</span> <span class="fn">onSpotStatusChanged</span>(<span class="tp">ParkingSpot</span> spot, <span class="tp">SpotStatus</span> oldStatus, <span class="tp">SpotStatus</span> newStatus);
}

<span class="kw">class</span> <span class="cn">DisplayBoard</span> <span class="kw">implements</span> <span class="cn">SpotChangeObserver</span> {
    <span class="kw">private</span> <span class="tp">int</span> availableSmall, availableMedium, availableLarge;

    <span class="kw">public</span> <span class="tp">void</span> <span class="fn">onSpotStatusChanged</span>(<span class="tp">ParkingSpot</span> spot, <span class="tp">SpotStatus</span> old, <span class="tp">SpotStatus</span> now) {
        <span class="kw">if</span> (old == AVAILABLE && now == OCCUPIED) decrement(spot.getType());
        <span class="kw">if</span> (old == OCCUPIED && now == AVAILABLE) increment(spot.getType());
        refreshDisplay();
    }
}

<span class="cm">// Factory Pattern — Vehicle type ke basis pe object banao</span>
<span class="kw">class</span> <span class="cn">VehicleFactory</span> {
    <span class="kw">public static</span> <span class="tp">Vehicle</span> <span class="fn">create</span>(<span class="tp">VehicleType</span> type, <span class="tp">String</span> regNo) {
        <span class="kw">return switch</span> (type) {
            <span class="kw">case</span> BIKE    -> <span class="kw">new</span> <span class="tp">Bike</span>(regNo);
            <span class="kw">case</span> CAR     -> <span class="kw">new</span> <span class="tp">Car</span>(regNo);
            <span class="kw">case</span> TRUCK   -> <span class="kw">new</span> <span class="tp">Truck</span>(regNo);
            <span class="kw">case</span> BUS     -> <span class="kw">new</span> <span class="tp">Bus</span>(regNo);
            <span class="kw">case</span> ELECTRIC -> <span class="kw">new</span> <span class="tp">ElectricVehicle</span>(regNo);
        };
    }
}
</pre></div>
    </div>
</div>

<div class="section theme-green">
    <div class="section-title"><span class="section-num">11</span>Deep Dive &mdash; Entry &amp; Exit Flow</div>
    <div class="section-body">
        <p>Complete entry aur exit flow step-by-step samjhte hain &mdash; ye interview me diagram draw karke explain karna padta hai:</p>
        <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Entry Flow</span></div><pre class="code-block">
<span class="cm">VEHICLE ENTRY FLOW:</span>
<span class="cm">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>

<span class="cm">  Vehicle arrives at Entry Gate</span>
<span class="cm">         │</span>
<span class="cm">         ▼</span>
<span class="cm">  ┌─────────────────┐</span>
<span class="cm">  │ Scan / Input     │  Registration number scan karo</span>
<span class="cm">  │ Registration No  │  (Camera ANPR ya manual input)</span>
<span class="cm">  └────────┬────────┘</span>
<span class="cm">           ▼</span>
<span class="cm">  ┌─────────────────┐</span>
<span class="cm">  │ Check Vehicle    │  Vehicle type identify karo</span>
<span class="cm">  │ Type             │  (Bike / Car / Truck)</span>
<span class="cm">  └────────┬────────┘</span>
<span class="cm">           ▼</span>
<span class="cm">  ┌─────────────────┐     ┌──────────────┐</span>
<span class="cm">  │ Check Spot       │────▶│ LOT FULL     │  Display "Parking Full"</span>
<span class="cm">  │ Availability     │ No  │ Reject Entry │  on display board</span>
<span class="cm">  └────────┬────────┘     └──────────────┘</span>
<span class="cm">           │ Yes</span>
<span class="cm">           ▼</span>
<span class="cm">  ┌─────────────────┐</span>
<span class="cm">  │ Allocate Nearest │  Strategy pattern se best spot find karo</span>
<span class="cm">  │ Available Spot   │  (with concurrency lock)</span>
<span class="cm">  └────────┬────────┘</span>
<span class="cm">           ▼</span>
<span class="cm">  ┌─────────────────┐</span>
<span class="cm">  │ Generate Ticket  │  Unique ticket ID, entry time, spot info</span>
<span class="cm">  │ & Print/Display  │  QR code pe encode karke print karo</span>
<span class="cm">  └────────┬────────┘</span>
<span class="cm">           ▼</span>
<span class="cm">  ┌─────────────────┐</span>
<span class="cm">  │ Open Barrier     │  Barrier open karo, vehicle enter kare</span>
<span class="cm">  │ Update Display   │  Display board pe availability update karo</span>
<span class="cm">  └─────────────────┘</span>
</pre></div>
        <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Exit Flow</span></div><pre class="code-block">
<span class="cm">VEHICLE EXIT FLOW:</span>
<span class="cm">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>

<span class="cm">  Vehicle arrives at Exit Gate</span>
<span class="cm">         │</span>
<span class="cm">         ▼</span>
<span class="cm">  ┌─────────────────┐     ┌──────────────────┐</span>
<span class="cm">  │ Scan Ticket      │────▶│ LOST TICKET?     │</span>
<span class="cm">  │ (QR / Barcode)   │ No  │ Search by RegNo  │</span>
<span class="cm">  └────────┬────────┘     │ Charge max fee   │</span>
<span class="cm">           │ Yes          └──────────────────┘</span>
<span class="cm">           ▼</span>
<span class="cm">  ┌─────────────────┐</span>
<span class="cm">  │ Calculate Fee    │  exit_time - entry_time = duration</span>
<span class="cm">  │ (Strategy)       │  FeeStrategy.calculate(duration, type)</span>
<span class="cm">  └────────┬────────┘</span>
<span class="cm">           ▼</span>
<span class="cm">  ┌─────────────────┐</span>
<span class="cm">  │ Display Amount   │  Screen pe amount dikhao</span>
<span class="cm">  │ Choose Payment   │  Cash / Card / UPI select karo</span>
<span class="cm">  └────────┬────────┘</span>
<span class="cm">           ▼</span>
<span class="cm">  ┌─────────────────┐     ┌──────────────┐</span>
<span class="cm">  │ Process Payment  │────▶│ PAYMENT FAIL │  Retry ya</span>
<span class="cm">  │                  │Fail │ different mode│  different mode try karo</span>
<span class="cm">  └────────┬────────┘     └──────────────┘</span>
<span class="cm">           │ Success</span>
<span class="cm">           ▼</span>
<span class="cm">  ┌─────────────────┐</span>
<span class="cm">  │ Free Spot        │  Spot status OCCUPIED → AVAILABLE</span>
<span class="cm">  │ Close Ticket     │  Ticket status ACTIVE → PAID</span>
<span class="cm">  └────────┬────────┘</span>
<span class="cm">           ▼</span>
<span class="cm">  ┌─────────────────┐</span>
<span class="cm">  │ Open Barrier     │  Receipt print/display karo</span>
<span class="cm">  │ Print Receipt    │  Barrier open karo, vehicle exit kare</span>
<span class="cm">  └─────────────────┘</span>
</pre></div>
    </div>
</div>

<div class="section theme-pink">
    <div class="section-title"><span class="section-num">12</span>Comparison &mdash; Design Approaches</div>
    <div class="section-body">
        <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Approach Comparison</span></div><pre class="code-block">
<span class="cm">┌────────────────────┬──────────────────┬──────────────────┬──────────────────┐</span>
<span class="cm">│ Aspect             │ In-Memory (Map)  │ DB + Lock        │ Redis + DB       │</span>
<span class="cm">├────────────────────┼──────────────────┼──────────────────┼──────────────────┤</span>
<span class="cm">│ Speed              │ ⚡ Fastest       │ 🔶 Medium        │ ⚡ Fast          │</span>
<span class="cm">│ Concurrency        │ ConcurrentMap    │ Pessimistic Lock │ Redis SETNX      │</span>
<span class="cm">│ Persistence        │ ❌ Lost on crash │ ✅ Durable       │ ✅ Durable       │</span>
<span class="cm">│ Multi-server       │ ❌ Single only   │ ✅ Supported     │ ✅ Best          │</span>
<span class="cm">│ Complexity         │ ⭐ Simple        │ ⭐⭐ Medium      │ ⭐⭐⭐ Complex  │</span>
<span class="cm">│ Best for           │ Interview/Small  │ Medium lots      │ Large/Multi-site │</span>
<span class="cm">├────────────────────┼──────────────────┼──────────────────┼──────────────────┤</span>
<span class="cm">│ Spot Allocation    │                  │                  │                  │</span>
<span class="cm">├────────────────────┼──────────────────┼──────────────────┼──────────────────┤</span>
<span class="cm">│ Nearest First      │ O(N) scan        │ SQL ORDER BY     │ Sorted Set       │</span>
<span class="cm">│ Spread Evenly      │ Min-heap floors  │ COUNT query      │ Counter per floor│</span>
<span class="cm">│ Random             │ Random index     │ RANDOM() query   │ RANDOMKEY        │</span>
<span class="cm">├────────────────────┼──────────────────┼──────────────────┼──────────────────┤</span>
<span class="cm">│ Fee Strategy       │                  │                  │                  │</span>
<span class="cm">├────────────────────┼──────────────────┼──────────────────┼──────────────────┤</span>
<span class="cm">│ Flat Hourly        │ ⭐ Simple        │ Easy to query    │ Same             │</span>
<span class="cm">│ Tiered             │ ⭐⭐ Logic heavy │ SP possible      │ Lua script       │</span>
<span class="cm">│ Daily Max Cap      │ Math.min()       │ LEAST() in SQL   │ Same             │</span>
<span class="cm">└────────────────────┴──────────────────┴──────────────────┴──────────────────┘</span>
</pre></div>
    </div>
</div>

<div class="section theme-red">
    <div class="section-title"><span class="section-num">13</span>Bottlenecks &amp; Solutions</div>
    <div class="bottleneck-grid">
        <div class="bottleneck-item"><span class="bottleneck-problem">Double booking of same spot (race condition)</span><span class="bottleneck-arrow">&rarr;</span><span class="bottleneck-solution">Pessimistic locking (SELECT FOR UPDATE) ya Optimistic locking (@Version)</span></div>
        <div class="bottleneck-item"><span class="bottleneck-problem">Spot search slow on large lots (10K+ spots)</span><span class="bottleneck-arrow">&rarr;</span><span class="bottleneck-solution">Per-floor count cache, Min-heap for floor priority, Bitmap for O(1) lookup</span></div>
        <div class="bottleneck-item"><span class="bottleneck-problem">Peak hour gate congestion (9 AM rush)</span><span class="bottleneck-arrow">&rarr;</span><span class="bottleneck-solution">Pre-booking via app, ANPR camera auto-entry, multiple gates with LB</span></div>
        <div class="bottleneck-item"><span class="bottleneck-problem">Payment gateway timeout at exit</span><span class="bottleneck-arrow">&rarr;</span><span class="bottleneck-solution">Fallback to cash, pre-auth on entry, offline mode + reconcile later</span></div>
        <div class="bottleneck-item"><span class="bottleneck-problem">Display board sync lag</span><span class="bottleneck-arrow">&rarr;</span><span class="bottleneck-solution">Observer pattern real-time update, WebSocket push, 2-3 sec delay OK</span></div>
        <div class="bottleneck-item"><span class="bottleneck-problem">Lost ticket scenario</span><span class="bottleneck-arrow">&rarr;</span><span class="bottleneck-solution">ANPR camera verify, search by registration number, charge max daily fee</span></div>
    </div>
</div>

<div class="section theme-orange">
    <div class="section-title"><span class="section-num">14</span>Interview Summary</div>
    <div class="summary-grid">
        <div class="summary-card sc-1"><h4>Singleton Pattern</h4><p>ParkingLot &mdash; ek hi instance poore system me</p></div>
        <div class="summary-card sc-2"><h4>Strategy Pattern</h4><p>Spot allocation + Fee calculation plug-and-play</p></div>
        <div class="summary-card sc-3"><h4>Observer Pattern</h4><p>DisplayBoard auto-update on spot change</p></div>
        <div class="summary-card sc-4"><h4>Concurrency Handling</h4><p>Pessimistic/Optimistic locking for double booking</p></div>
        <div class="summary-card sc-1"><h4>Vehicle-Spot Matrix</h4><p>Bike &rarr; S/M/L, Car &rarr; M/L, Truck &rarr; L only</p></div>
        <div class="summary-card sc-2"><h4>Factory Pattern</h4><p>VehicleFactory creates by type</p></div>
        <div class="summary-card sc-3"><h4>EV Charging Spots</h4><p>Special spots with charging station support</p></div>
        <div class="summary-card sc-4"><h4>Lost Ticket Flow</h4><p>ANPR verify + RegNo lookup + max fee penalty</p></div>
        <div class="summary-card sc-1"><h4>Multiple Gates</h4><p>Concurrent entry/exit with barrier control</p></div>
        <div class="summary-card sc-2"><h4>Fee Calculator</h4><p>Flat hourly / Tiered / Surge (weekend) pricing</p></div>
        <div class="summary-card sc-3"><h4>State Pattern</h4><p>AVAILABLE &rarr; OCCUPIED &rarr; RESERVED transitions</p></div>
        <div class="summary-card sc-4"><h4>Decorator Pattern</h4><p>SurgeDecorator wraps base fee strategy</p></div>
    </div>
    <p style="text-align:center;margin-top:24px;color:#78909c;font-size:1em">
        Complete Parking Lot LLD for <strong style="color:#00897b">Java Spring Boot</strong> interviews &mdash; covers Design Patterns, Concurrency, Fee Strategy &amp; Scalability.
    </p>
</div>
`
}
