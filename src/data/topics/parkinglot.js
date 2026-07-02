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
    <div class="section-title"><span class="section-num">5</span>APIs (with Request / Response)</div>
    <div class="api-grid">
        <div class="api-card">
            <div class="api-header"><span class="api-method method-post">POST</span><span class="api-path">/api/v1/parking/entry</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Request</div>{
  <span class="key">"registrationNo"</span>: <span class="val">"MH-12-AB-1234"</span>,
  <span class="key">"vehicleType"</span>: <span class="val">"CAR"</span>,
  <span class="key">"color"</span>: <span class="val">"White"</span>,
  <span class="key">"ownerName"</span>: <span class="val">"Rahul Sharma"</span>,
  <span class="key">"isElectric"</span>: <span class="val">false</span>,
  <span class="key">"gateId"</span>: <span class="val">"gate-01"</span>
}</div>
                <div class="api-json"><div class="label">Response 201</div>{
  <span class="key">"ticketId"</span>: <span class="val">"TKT-20250615-001"</span>,
  <span class="key">"spotNumber"</span>: <span class="val">"F2-A05"</span>,
  <span class="key">"floorNumber"</span>: <span class="val">2</span>,
  <span class="key">"spotType"</span>: <span class="val">"MEDIUM"</span>,
  <span class="key">"vehicleType"</span>: <span class="val">"CAR"</span>,
  <span class="key">"entryTime"</span>: <span class="val">"2025-06-15T10:30:00Z"</span>,
  <span class="key">"entryGate"</span>: <span class="val">"Gate 1 - Ground Floor"</span>,
  <span class="key">"qrCode"</span>: <span class="val">"base64_encoded_qr..."</span>
}</div>
            </div>
            <div class="api-note">Vehicle entry pe nearest available spot allocate karta hai &mdash; vehicle type ke basis pe compatible spot dhundhta hai, ticket generate karke QR code deta hai</div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-post">POST</span><span class="api-path">/api/v1/parking/exit</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Request</div>{
  <span class="key">"ticketId"</span>: <span class="val">"TKT-20250615-001"</span>,
  <span class="key">"gateId"</span>: <span class="val">"gate-03"</span>,
  <span class="key">"paymentMode"</span>: <span class="val">"UPI"</span>
}</div>
                <div class="api-json"><div class="label">Response 200</div>{
  <span class="key">"ticketId"</span>: <span class="val">"TKT-20250615-001"</span>,
  <span class="key">"vehicleNo"</span>: <span class="val">"MH-12-AB-1234"</span>,
  <span class="key">"entryTime"</span>: <span class="val">"2025-06-15T10:30:00Z"</span>,
  <span class="key">"exitTime"</span>: <span class="val">"2025-06-15T14:45:00Z"</span>,
  <span class="key">"duration"</span>: <span class="val">"4h 15m"</span>,
  <span class="key">"fee"</span>: <span class="val">100.00</span>,
  <span class="key">"paymentMode"</span>: <span class="val">"UPI"</span>,
  <span class="key">"paymentStatus"</span>: <span class="val">"SUCCESS"</span>,
  <span class="key">"transactionId"</span>: <span class="val">"TXN-98765"</span>,
  <span class="key">"receiptUrl"</span>: <span class="val">"/receipts/TKT-20250615-001.pdf"</span>
}</div>
            </div>
            <div class="api-note">Vehicle exit pe fee calculate karke payment process karta hai &mdash; ticket scan hota hai, duration calculate hoti hai, FeeStrategy se amount nikalta hai, payment process hoke barrier open hota hai</div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-get">GET</span><span class="api-path">/api/v1/parking/availability?vehicleType=CAR</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Response 200</div>{
  <span class="key">"totalAvailable"</span>: <span class="val">42</span>,
  <span class="key">"floors"</span>: [
    { <span class="key">"floor"</span>: <span class="val">1</span>, <span class="key">"available"</span>: <span class="val">15</span>, <span class="key">"total"</span>: <span class="val">40</span> },
    { <span class="key">"floor"</span>: <span class="val">2</span>, <span class="key">"available"</span>: <span class="val">20</span>, <span class="key">"total"</span>: <span class="val">40</span> },
    { <span class="key">"floor"</span>: <span class="val">3</span>, <span class="key">"available"</span>: <span class="val">7</span>, <span class="key">"total"</span>: <span class="val">30</span> }
  ],
  <span class="key">"evChargingAvailable"</span>: <span class="val">3</span>,
  <span class="key">"handicappedAvailable"</span>: <span class="val">2</span>
}</div>
            </div>
            <div class="api-note">Floor-wise aur type-wise available spots return karta hai &mdash; display board pe dikhane ke liye real-time data, EV aur handicapped spots ka count alag se milta hai</div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-get">GET</span><span class="api-path">/api/v1/parking/ticket/{ticketId}</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Response 200</div>{
  <span class="key">"ticketId"</span>: <span class="val">"TKT-20250615-001"</span>,
  <span class="key">"vehicleNo"</span>: <span class="val">"MH-12-AB-1234"</span>,
  <span class="key">"vehicleType"</span>: <span class="val">"CAR"</span>,
  <span class="key">"spotNumber"</span>: <span class="val">"F2-A05"</span>,
  <span class="key">"floorNumber"</span>: <span class="val">2</span>,
  <span class="key">"entryTime"</span>: <span class="val">"2025-06-15T10:30:00Z"</span>,
  <span class="key">"status"</span>: <span class="val">"ACTIVE"</span>,
  <span class="key">"currentFee"</span>: <span class="val">80.00</span>
}</div>
            </div>
            <div class="api-note">Ticket details fetch karta hai &mdash; vehicle info, spot info, current fee (abhi tak ka estimated) sab milta hai</div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-get">GET</span><span class="api-path">/api/v1/parking/search?regNo=MH-12-AB-1234</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Response 200</div>{
  <span class="key">"found"</span>: <span class="val">true</span>,
  <span class="key">"vehicleNo"</span>: <span class="val">"MH-12-AB-1234"</span>,
  <span class="key">"spotNumber"</span>: <span class="val">"F2-A05"</span>,
  <span class="key">"floorNumber"</span>: <span class="val">2</span>,
  <span class="key">"direction"</span>: <span class="val">"Take elevator to Floor 2, Section A, Spot 05"</span>
}</div>
            </div>
            <div class="api-note">Registration number se vehicle search karta hai &mdash; agar koi bhool gaya ki gaadi kahaan park ki toh number dalke spot location mil jayegi</div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-post">POST</span><span class="api-path">/api/v1/parking/payment</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Request</div>{
  <span class="key">"ticketId"</span>: <span class="val">"TKT-20250615-001"</span>,
  <span class="key">"amount"</span>: <span class="val">100.00</span>,
  <span class="key">"paymentMode"</span>: <span class="val">"CREDIT_CARD"</span>,
  <span class="key">"cardLast4"</span>: <span class="val">"4242"</span>
}</div>
                <div class="api-json"><div class="label">Response 200</div>{
  <span class="key">"paymentId"</span>: <span class="val">"PAY-456"</span>,
  <span class="key">"status"</span>: <span class="val">"SUCCESS"</span>,
  <span class="key">"transactionId"</span>: <span class="val">"TXN-98765"</span>,
  <span class="key">"receiptUrl"</span>: <span class="val">"/receipts/PAY-456.pdf"</span>
}</div>
                <div class="api-json"><div class="label">Response 402</div>{
  <span class="key">"error"</span>: <span class="val">"PAYMENT_FAILED"</span>,
  <span class="key">"message"</span>: <span class="val">"Card declined, please try another payment method"</span>
}</div>
            </div>
            <div class="api-note">Payment process karta hai &mdash; pre-exit pe bhi payment ho sakta hai (app se pay karo, exit pe sirf ticket scan karo, direct barrier open)</div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-put">PUT</span><span class="api-path">/api/v1/admin/rates</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Request</div>{
  <span class="key">"rates"</span>: [
    { <span class="key">"vehicleType"</span>: <span class="val">"BIKE"</span>, <span class="key">"hourlyRate"</span>: <span class="val">10</span>, <span class="key">"dailyMax"</span>: <span class="val">50</span> },
    { <span class="key">"vehicleType"</span>: <span class="val">"CAR"</span>, <span class="key">"hourlyRate"</span>: <span class="val">20</span>, <span class="key">"dailyMax"</span>: <span class="val">200</span> },
    { <span class="key">"vehicleType"</span>: <span class="val">"TRUCK"</span>, <span class="key">"hourlyRate"</span>: <span class="val">40</span>, <span class="key">"dailyMax"</span>: <span class="val">400</span> }
  ],
  <span class="key">"lostTicketFee"</span>: <span class="val">500</span>,
  <span class="key">"effectiveFrom"</span>: <span class="val">"2025-07-01T00:00:00Z"</span>
}</div>
                <div class="api-json"><div class="label">Response 200</div>{
  <span class="key">"updated"</span>: <span class="val">3</span>,
  <span class="key">"effectiveFrom"</span>: <span class="val">"2025-07-01T00:00:00Z"</span>
}</div>
            </div>
            <div class="api-note">Admin parking rates update karta hai &mdash; vehicle type wise hourly rate, daily max cap, aur lost ticket penalty set hota hai</div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-get">GET</span><span class="api-path">/api/v1/admin/reports?date=2025-06-15</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Response 200</div>{
  <span class="key">"date"</span>: <span class="val">"2025-06-15"</span>,
  <span class="key">"totalVehicles"</span>: <span class="val">1250</span>,
  <span class="key">"revenue"</span>: <span class="val">45600.00</span>,
  <span class="key">"avgOccupancy"</span>: <span class="val">"78%"</span>,
  <span class="key">"peakHour"</span>: <span class="val">"09:00-10:00"</span>,
  <span class="key">"peakOccupancy"</span>: <span class="val">"95%"</span>,
  <span class="key">"vehicleBreakdown"</span>: {
    <span class="key">"BIKE"</span>: <span class="val">450</span>,
    <span class="key">"CAR"</span>: <span class="val">700</span>,
    <span class="key">"TRUCK"</span>: <span class="val">100</span>
  },
  <span class="key">"avgDuration"</span>: <span class="val">"3h 20m"</span>
}</div>
            </div>
            <div class="api-note">Revenue, occupancy aur peak hour reports generate karta hai &mdash; daily, weekly, monthly reports ke liye date range pass kar sakte hain</div>
        </div>
    </div>
</div>

<!-- ============ 6. DATABASE SCHEMA ============ -->
<div class="section theme-pink">
    <div class="section-title"><span class="section-num">6</span>Database Schema (with FK &amp; Indexes)</div>

    <div class="sub-heading" style="color:#ff80ab;border-color:#ff80ab">Database Technology Stack</div>
    <div class="dbtech-grid">
        <div class="dbtech-card">
            <div class="dbtech-name">PostgreSQL <span class="dbtech-type">RDBMS</span></div>
            <div class="dbtech-usage">Parking lots, floors, spots, tickets, payments &mdash; ACID transactions for concurrent spot allocation</div>
            <div class="dbtech-tables"><span>parking_lot</span><span>parking_floor</span><span>parking_spot</span><span>parking_ticket</span><span>payment</span></div>
        </div>
        <div class="dbtech-card">
            <div class="dbtech-name">Redis <span class="dbtech-type">In-Memory Cache</span></div>
            <div class="dbtech-usage">Real-time spot availability count, display board data, distributed locks for spot allocation</div>
            <div class="dbtech-tables"><span>floor:{id}:available</span><span>spot:lock:{spotId}</span><span>display:{lotId}</span></div>
        </div>
        <div class="dbtech-card">
            <div class="dbtech-name">Kafka <span class="dbtech-type">Event Queue</span></div>
            <div class="dbtech-usage">Spot change events, display board updates, revenue calculation &mdash; async processing</div>
            <div class="dbtech-tables"><span>spot-events</span><span>payment-events</span></div>
        </div>
    </div>

    <div class="db-grid">
        <div class="db-table">
            <h3>parking_lot</h3>
            <ul>
                <li><span class="pk">id UUID PK</span></li>
                <li>name VARCHAR(100) NOT NULL</li>
                <li>address TEXT NOT NULL</li>
                <li>total_floors INT NOT NULL</li>
                <li>total_spots INT NOT NULL</li>
                <li>status ENUM('ACTIVE','INACTIVE') DEFAULT 'ACTIVE'</li>
                <li>created_at TIMESTAMP</li>
            </ul>
        </div>
        <div class="db-table">
            <h3>parking_floor</h3>
            <ul>
                <li><span class="pk">id UUID PK</span></li>
                <li><span class="fk">lot_id UUID FK &rarr; parking_lot.id</span></li>
                <li>floor_number INT NOT NULL</li>
                <li>total_spots INT</li>
                <li>available_spots INT DEFAULT 0</li>
                <li><span class="fk">display_board_id UUID FK NULL</span></li>
                <li><span class="idx">INDEX idx_lot_floor (lot_id, floor_number)</span></li>
            </ul>
        </div>
        <div class="db-table">
            <h3>parking_spot</h3>
            <ul>
                <li><span class="pk">id UUID PK</span></li>
                <li><span class="fk">floor_id UUID FK &rarr; parking_floor.id</span></li>
                <li>spot_number VARCHAR(10) NOT NULL</li>
                <li>spot_type ENUM('SMALL','MEDIUM','LARGE','HANDICAPPED') <span class="idx">IDX</span></li>
                <li>status ENUM('AVAILABLE','OCCUPIED','RESERVED','MAINTENANCE') <span class="idx">IDX</span></li>
                <li><span class="fk">vehicle_id UUID FK &rarr; vehicle.id NULL</span></li>
                <li>has_ev_charger BOOLEAN DEFAULT false</li>
                <li>version BIGINT DEFAULT 0</li>
                <li><span class="idx">INDEX idx_floor_status (floor_id, status, spot_type)</span></li>
                <li><span class="idx">UNIQUE idx_floor_spot (floor_id, spot_number)</span></li>
            </ul>
        </div>
        <div class="db-table">
            <h3>vehicle</h3>
            <ul>
                <li><span class="pk">id UUID PK</span></li>
                <li>registration_no VARCHAR(20) UNIQUE NOT NULL <span class="idx">IDX</span></li>
                <li>vehicle_type ENUM('BIKE','CAR','TRUCK','BUS','ELECTRIC')</li>
                <li>color VARCHAR(30)</li>
                <li>owner_name VARCHAR(100)</li>
                <li>is_electric BOOLEAN DEFAULT false</li>
            </ul>
        </div>
        <div class="db-table">
            <h3>parking_ticket</h3>
            <ul>
                <li><span class="pk">id UUID PK</span></li>
                <li>ticket_number VARCHAR(20) UNIQUE NOT NULL <span class="idx">IDX</span></li>
                <li><span class="fk">vehicle_id UUID FK &rarr; vehicle.id</span></li>
                <li><span class="fk">spot_id UUID FK &rarr; parking_spot.id</span></li>
                <li><span class="fk">entry_gate_id UUID FK &rarr; gate.id</span></li>
                <li><span class="fk">exit_gate_id UUID FK &rarr; gate.id NULL</span></li>
                <li>entry_time TIMESTAMP NOT NULL</li>
                <li>exit_time TIMESTAMP NULL</li>
                <li>status ENUM('ACTIVE','PAID','LOST','CANCELLED') <span class="idx">IDX</span></li>
                <li>fee DECIMAL(10,2) NULL</li>
                <li><span class="idx">INDEX idx_vehicle_entry (vehicle_id, entry_time DESC)</span></li>
                <li><span class="idx">INDEX idx_status_time (status, entry_time)</span></li>
            </ul>
        </div>
        <div class="db-table">
            <h3>payment</h3>
            <ul>
                <li><span class="pk">id UUID PK</span></li>
                <li><span class="fk">ticket_id UUID FK &rarr; parking_ticket.id</span> <span class="idx">IDX</span></li>
                <li>amount DECIMAL(10,2) NOT NULL</li>
                <li>payment_mode ENUM('CASH','CREDIT_CARD','DEBIT_CARD','UPI')</li>
                <li>payment_status ENUM('SUCCESS','FAILED','REFUNDED') <span class="idx">IDX</span></li>
                <li>transaction_id VARCHAR(50) UNIQUE</li>
                <li>paid_at TIMESTAMP</li>
            </ul>
        </div>
        <div class="db-table">
            <h3>gate</h3>
            <ul>
                <li><span class="pk">id UUID PK</span></li>
                <li><span class="fk">lot_id UUID FK &rarr; parking_lot.id</span></li>
                <li>gate_number INT NOT NULL</li>
                <li>gate_type ENUM('ENTRY','EXIT','BOTH')</li>
                <li>floor_number INT</li>
                <li>status ENUM('ACTIVE','INACTIVE') DEFAULT 'ACTIVE'</li>
                <li><span class="idx">INDEX idx_lot_gate (lot_id, gate_type)</span></li>
            </ul>
        </div>
        <div class="db-table">
            <h3>parking_rate</h3>
            <ul>
                <li><span class="pk">id UUID PK</span></li>
                <li><span class="fk">lot_id UUID FK &rarr; parking_lot.id</span></li>
                <li>vehicle_type ENUM('BIKE','CAR','TRUCK','BUS','ELECTRIC')</li>
                <li>hourly_rate DECIMAL(10,2) NOT NULL</li>
                <li>daily_max DECIMAL(10,2)</li>
                <li>lost_ticket_fee DECIMAL(10,2)</li>
                <li>effective_from TIMESTAMP NOT NULL</li>
                <li><span class="idx">UNIQUE idx_lot_vehicle_rate (lot_id, vehicle_type, effective_from)</span></li>
            </ul>
        </div>
    </div>

    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">SQL &mdash; Core Queries</span></div><pre class="code-block">
<span class="cm">-- Available spot dhundho vehicle type ke basis pe (Pessimistic Lock)</span>
<span class="kw">SELECT</span> ps.id, ps.spot_number, ps.floor_id
<span class="kw">FROM</span> parking_spot ps
<span class="kw">JOIN</span> parking_floor pf <span class="kw">ON</span> ps.floor_id = pf.id
<span class="kw">WHERE</span> ps.status = 'AVAILABLE' <span class="kw">AND</span> ps.spot_type >= :requiredSize
    <span class="kw">AND</span> pf.lot_id = :lotId
<span class="kw">ORDER BY</span> pf.floor_number, ps.spot_number
<span class="kw">LIMIT</span> 1
<span class="kw">FOR UPDATE SKIP LOCKED</span>;

<span class="cm">-- Ticket generate karo entry pe</span>
<span class="kw">INSERT INTO</span> parking_ticket (id, ticket_number, vehicle_id, spot_id, entry_gate_id, entry_time, status)
<span class="kw">VALUES</span> (UUID(), :ticketNo, :vehicleId, :spotId, :gateId, NOW(), 'ACTIVE');

<span class="cm">-- Fee calculate karo exit pe</span>
<span class="kw">SELECT</span> pt.entry_time, pr.hourly_rate, pr.daily_max,
    EXTRACT(EPOCH FROM NOW() - pt.entry_time) / 3600 AS hours_parked
<span class="kw">FROM</span> parking_ticket pt
<span class="kw">JOIN</span> vehicle v <span class="kw">ON</span> pt.vehicle_id = v.id
<span class="kw">JOIN</span> parking_rate pr <span class="kw">ON</span> pr.vehicle_type = v.vehicle_type
    <span class="kw">AND</span> pr.effective_from &lt;= NOW()
<span class="kw">WHERE</span> pt.id = :ticketId
<span class="kw">ORDER BY</span> pr.effective_from <span class="kw">DESC</span> <span class="kw">LIMIT</span> 1;

<span class="cm">-- Floor-wise availability count (Redis se faster, DB fallback)</span>
<span class="kw">SELECT</span> pf.floor_number, ps.spot_type, COUNT(*) as available
<span class="kw">FROM</span> parking_spot ps
<span class="kw">JOIN</span> parking_floor pf <span class="kw">ON</span> ps.floor_id = pf.id
<span class="kw">WHERE</span> pf.lot_id = :lotId <span class="kw">AND</span> ps.status = 'AVAILABLE'
<span class="kw">GROUP BY</span> pf.floor_number, ps.spot_type;

<span class="cm">-- Daily revenue report</span>
<span class="kw">SELECT</span> DATE(p.paid_at) as date, SUM(p.amount) as revenue, COUNT(*) as transactions
<span class="kw">FROM</span> payment p
<span class="kw">WHERE</span> p.paid_at >= :startDate <span class="kw">AND</span> p.paid_at &lt; :endDate
    <span class="kw">AND</span> p.payment_status = 'SUCCESS'
<span class="kw">GROUP BY</span> DATE(p.paid_at);
</pre></div>
</div>

<!-- ============ 7. CAPACITY ESTIMATION ============ -->
<div class="section theme-deepblue">
    <div class="section-title"><span class="section-num">7</span>Capacity Estimation</div>
    <div class="assumption-box">
        <h4>Assumptions (Large Mall Parking Lot)</h4>
        <div class="assumption-row"><span class="calc-label">Total Parking Spots</span><span class="calc-value">5,000</span></div>
        <div class="assumption-row"><span class="calc-label">Floors</span><span class="calc-value">5</span></div>
        <div class="assumption-row"><span class="calc-label">Entry/Exit Gates</span><span class="calc-value">10 (5 entry + 5 exit)</span></div>
        <div class="assumption-row"><span class="calc-label">Avg occupancy rate</span><span class="calc-value">75%</span></div>
        <div class="assumption-row"><span class="calc-label">Avg parking duration</span><span class="calc-value">3 hours</span></div>
        <div class="assumption-row"><span class="calc-label">Operating hours</span><span class="calc-value">16 hours/day (6 AM - 10 PM)</span></div>
        <div class="assumption-row"><span class="calc-label">Peak hour factor</span><span class="calc-value">2x average</span></div>
    </div>
    <div class="cap-grid">
        <div class="cap-card">
            <h4>Vehicles Per Day</h4>
            <div class="calc-row"><span class="calc-label">5000 spots &times; 75% &times; (16h/3h avg)</span><span class="calc-value">~20,000 vehicles/day</span></div>
            <div class="calc-row"><span class="calc-label">Per hour (avg)</span><span class="calc-value">~1,250 vehicles/hr</span></div>
            <div class="calc-result"><span class="calc-label">Peak Hour (9 AM)</span><span class="calc-value">~2,500 vehicles/hr</span></div>
        </div>
        <div class="cap-card">
            <h4>Entry/Exit QPS</h4>
            <div class="calc-row"><span class="calc-label">Avg entries/sec</span><span class="calc-value">~0.35 QPS</span></div>
            <div class="calc-row"><span class="calc-label">Peak entries/sec</span><span class="calc-value">~0.7 QPS</span></div>
            <div class="calc-row"><span class="calc-label">Availability checks/sec (display)</span><span class="calc-value">~5 QPS</span></div>
            <div class="calc-result"><span class="calc-label">Total API QPS (peak)</span><span class="calc-value">~10 QPS</span></div>
        </div>
        <div class="cap-card">
            <h4>Database Size</h4>
            <div class="calc-row"><span class="calc-label">Tickets/year: 20K/day &times; 365</span><span class="calc-value">~7.3M tickets/year</span></div>
            <div class="calc-row"><span class="calc-label">Per ticket row: ~500 bytes</span><span class="calc-value">~3.6 GB/year</span></div>
            <div class="calc-row"><span class="calc-label">Payments: 7.3M &times; 300 bytes</span><span class="calc-value">~2.2 GB/year</span></div>
            <div class="calc-result"><span class="calc-label">Total DB (5 years)</span><span class="calc-value">~30 GB (single PostgreSQL)</span></div>
        </div>
        <div class="cap-card">
            <h4>Redis Memory</h4>
            <div class="calc-row"><span class="calc-label">Spot status (5000 spots &times; 100B)</span><span class="calc-value">~500 KB</span></div>
            <div class="calc-row"><span class="calc-label">Floor counters (5 floors)</span><span class="calc-value">~1 KB</span></div>
            <div class="calc-row"><span class="calc-label">Distributed locks (active)</span><span class="calc-value">~50 KB</span></div>
            <div class="calc-result"><span class="calc-label">Total Redis</span><span class="calc-value">&lt; 1 MB (single node enough)</span></div>
        </div>
        <div class="cap-card">
            <h4>Concurrency Requirement</h4>
            <div class="calc-row"><span class="calc-label">Peak: 10 gates &times; 1 vehicle/5 sec</span><span class="calc-value">~2 concurrent allocations</span></div>
            <div class="calc-row"><span class="calc-label">SELECT FOR UPDATE handles</span><span class="calc-value">~100+ concurrent easily</span></div>
            <div class="calc-result"><span class="calc-label">Bottleneck?</span><span class="calc-value">No &mdash; single DB handles fine</span></div>
        </div>
        <div class="cap-card">
            <h4>Server Estimation</h4>
            <div class="calc-row"><span class="calc-label">API servers</span><span class="calc-value">1-2 (Spring Boot)</span></div>
            <div class="calc-row"><span class="calc-label">Database</span><span class="calc-value">1 PostgreSQL (+ 1 replica)</span></div>
            <div class="calc-row"><span class="calc-label">Redis</span><span class="calc-value">1 node (single instance enough)</span></div>
            <div class="calc-result"><span class="calc-label">Multi-location (100 lots)</span><span class="calc-value">Shard by lot_id, 10 DB shards</span></div>
        </div>
    </div>
</div>

<!-- ============ 8. DATA STRUCTURES & TRADE-OFFS ============ -->
<div class="section theme-purple">
    <div class="section-title"><span class="section-num">8</span>Data Structures &amp; Trade-offs</div>
    <div class="service-grid">
        <div class="service-card">
            <h3>Bitmap (BitSet) &mdash; Spot Availability Tracking</h3>
            <p class="svc-desc">Parking lot me har spot ka status sirf 2 hai: available (0) ya occupied (1). Bitmap me 1 bit per spot use hota hai &mdash; 5000 spots ka poora status sirf 625 bytes me store ho jaata hai!</p>
            <p class="svc-desc"><strong>Use Case:</strong> Floor 3 pe kitne spots available hai? → bitmap[floor3] me 0-bits count karo (popcount) = available spots. O(1) operation<br><br>
            <strong>Why Bitmap?</strong> Boolean array me 1 byte per spot = 5000 bytes. Bitmap me 1 bit per spot = 625 bytes (8x saving). Plus bitwise operations se bulk queries instant hai<br><br>
            <strong>Pros:</strong> Extremely memory efficient (1 bit/spot), O(1) availability check, bitwise AND/OR for bulk operations (e.g., "compact spots near elevator"), CPU cache friendly<br><br>
            <strong>Cons:</strong> Only boolean state (no metadata like vehicle info), bit manipulation complex to debug, not suitable for multi-state tracking (reserved/handicap/EV)<br><br>
            <strong>Extension:</strong> Multi-state ke liye 2-bit encoding: 00=available, 01=occupied, 10=reserved, 11=maintenance. 5000 spots = 1250 bytes</p>
        </div>
        <div class="service-card">
            <h3>Min-Heap &mdash; Nearest Available Spot Finding</h3>
            <p class="svc-desc">Vehicle entry pe sabse nearest available spot dhundna hai (nearest to entrance/elevator). Min-Heap me spots distance ke basis pe sorted rehte hai &mdash; top element always nearest available spot hai.</p>
            <p class="svc-desc"><strong>Use Case:</strong> Vehicle enters Floor 2 → Min-Heap[floor2] se peek() = nearest spot. allocate() = extractMin() + mark bitmap. O(log n) operation<br><br>
            <strong>Why Min-Heap?</strong> Sorted array me nearest spot O(1) but insert O(n). LinkedList me insert O(1) but find nearest O(n). Heap dono O(log n) me balanced karta hai<br><br>
            <strong>Pros:</strong> O(1) nearest spot peek, O(log n) allocate/deallocate, natural priority ordering (closest first, then by spot type)<br><br>
            <strong>Cons:</strong> No random access (can't check specific spot directly), rebuild cost O(n) for mass operations (floor closure), not ideal for "find spot near X" (spatial index better)<br><br>
            <strong>Alternative:</strong> For "nearest to my current location" → use R-Tree/KD-Tree (spatial index). Min-Heap works for "nearest to fixed entrance"</p>
        </div>
        <div class="service-card">
            <h3>HashMap &mdash; Vehicle-to-Spot Mapping</h3>
            <p class="svc-desc">Vehicle plate number se turant uska spot find karna &mdash; "MH-04-AB-1234 kahan parked hai?" HashMap me license_plate → spot_info O(1) me milta hai.</p>
            <p class="svc-desc"><strong>Use Case:</strong> Exit pe: HashMap.get("MH-04-AB-1234") → {spot: A-205, floor: 2, entry_time: 10:30, vehicle_type: CAR}. Fee calculate karo aur spot release karo<br><br>
            <strong>Why HashMap?</strong> Most frequent query: "is vehicle ka spot kya hai?" O(1) lookup. Array me search O(n), Tree me O(log n) &mdash; HashMap fastest<br><br>
            <strong>Pros:</strong> O(1) average lookup/insert/delete, simple key-value model, perfect for plate→spot mapping<br><br>
            <strong>Cons:</strong> No ordering (can't answer "sab vehicles entry time ke order me"), hash collisions (rare but degrade to O(n)), memory overhead (load factor 0.75 = 25% wasted)<br><br>
            <strong>Complement:</strong> HashMap + Bitmap together: HashMap for "where is vehicle X?" + Bitmap for "how many spots available?"</p>
        </div>
        <div class="service-card">
            <h3>TreeMap (Red-Black Tree) &mdash; Time-Ordered Entries for Billing</h3>
            <p class="svc-desc">Fee calculation ke liye entry_time sorted chahiye. TreeMap internally Red-Black Tree use karta hai &mdash; sorted order maintain karta hai with O(log n) operations.</p>
            <p class="svc-desc"><strong>Use Case:</strong> "Last 1 hour me kitne vehicles enter hue?" → TreeMap.subMap(now-1hr, now).size(). Revenue report by time range bhi O(log n + k)<br><br>
            <strong>Why TreeMap?</strong> HashMap me range query nahi hota. TreeMap me sorted order maintained hai toh time-based queries natural hai<br><br>
            <strong>Pros:</strong> O(log n) insert/search/delete, sorted iteration, range queries (subMap/headMap/tailMap), self-balancing (guaranteed O(log n))<br><br>
            <strong>Cons:</strong> Slower than HashMap for point queries (O(log n) vs O(1)), more memory per node (color bit + 2 child pointers + parent pointer), not cache-friendly<br><br>
            <strong>When to use:</strong> Need sorted + range queries = TreeMap. Need fastest point lookup = HashMap. Parking system me dono chahiye toh dono use karo</p>
        </div>
        <div class="service-card">
            <h3>Queue (FIFO) &mdash; Entry/Exit Gate Management</h3>
            <p class="svc-desc">Peak hours me entry gate pe line lagti hai. Queue FIFO order maintain karta hai &mdash; pehle aaya pehle process. Gate barrier + ticket system queue pattern follow karta hai.</p>
            <p class="svc-desc"><strong>Use Case:</strong> Vehicle arrives → Queue.enqueue(vehicle). Gate sensor triggers → Queue.dequeue() → scan plate → allocate spot → raise barrier. Concurrent gates = multiple consumers<br><br>
            <strong>Why Queue?</strong> Fairness guarantee (FIFO), backpressure handling (queue full = "lot full" sign), rate limiting (1 vehicle per 10 sec per gate)<br><br>
            <strong>Pros:</strong> O(1) enqueue/dequeue, fair ordering, natural fit for gate management, easy to implement with LinkedList or circular array<br><br>
            <strong>Cons:</strong> No priority (VIP vehicles wait in same line), head-of-line blocking (stuck vehicle blocks queue), fixed capacity decision needed<br><br>
            <strong>Extension:</strong> Priority Queue for VIP/handicap vehicles &mdash; separate lane with higher priority dequeue</p>
        </div>
    </div>
</div>

<div class="section theme-green">
    <div class="section-title"><span class="section-num">9</span>Deep Dive &mdash; Spot Allocation Strategy</div>
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
    <div class="section-title"><span class="section-num">10</span>Deep Dive &mdash; Concurrency &amp; Locking</div>
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
    <div class="section-title"><span class="section-num">11</span>Deep Dive &mdash; Fee Calculation Strategy</div>
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
    <div class="section-title"><span class="section-num">12</span>Deep Dive &mdash; Design Patterns Used</div>
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
    <div class="section-title"><span class="section-num">13</span>Deep Dive &mdash; Entry &amp; Exit Flow</div>
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
    <div class="section-title"><span class="section-num">14</span>Comparison &mdash; Design Approaches</div>
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
    <div class="section-title"><span class="section-num">15</span>Bottlenecks &amp; Solutions</div>
    <div class="bottleneck-grid">
        <div class="bottleneck-item"><span class="bottleneck-problem">Double booking of same spot (race condition)</span><span class="bottleneck-arrow">&rarr;</span><span class="bottleneck-solution">Pessimistic locking (SELECT FOR UPDATE) ya Optimistic locking (@Version)</span></div>
        <div class="bottleneck-item"><span class="bottleneck-problem">Spot search slow on large lots (10K+ spots)</span><span class="bottleneck-arrow">&rarr;</span><span class="bottleneck-solution">Per-floor count cache, Min-heap for floor priority, Bitmap for O(1) lookup</span></div>
        <div class="bottleneck-item"><span class="bottleneck-problem">Peak hour gate congestion (9 AM rush)</span><span class="bottleneck-arrow">&rarr;</span><span class="bottleneck-solution">Pre-booking via app, ANPR camera auto-entry, multiple gates with LB</span></div>
        <div class="bottleneck-item"><span class="bottleneck-problem">Payment gateway timeout at exit</span><span class="bottleneck-arrow">&rarr;</span><span class="bottleneck-solution">Fallback to cash, pre-auth on entry, offline mode + reconcile later</span></div>
        <div class="bottleneck-item"><span class="bottleneck-problem">Display board sync lag</span><span class="bottleneck-arrow">&rarr;</span><span class="bottleneck-solution">Observer pattern real-time update, WebSocket push, 2-3 sec delay OK</span></div>
        <div class="bottleneck-item"><span class="bottleneck-problem">Lost ticket scenario</span><span class="bottleneck-arrow">&rarr;</span><span class="bottleneck-solution">ANPR camera verify, search by registration number, charge max daily fee</span></div>
    </div>
</div>

<!-- ============ 16. UML CLASS DIAGRAM ============ -->
<div class="section theme-deepblue">
    <div class="section-title"><span class="section-num">16</span>UML Class Diagram</div>
    <div class="uml-diagram">

        <div class="uml-section-label">Entity Classes</div>
        <div class="uml-grid">
            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;entity&raquo;</span>ParkingLot</div>
                <div class="uml-attributes">
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">id</span><span class="uml-type">Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">name</span><span class="uml-type">String</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">address</span><span class="uml-type">String</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">totalSpots</span><span class="uml-type">int</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">availableSpots</span><span class="uml-type">int</span></div>
                </div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getFloors()</span><span class="uml-type">List&lt;ParkingFloor&gt;</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getGates()</span><span class="uml-type">List&lt;Gate&gt;</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getRates()</span><span class="uml-type">List&lt;ParkingRate&gt;</span></div>
                </div>
            </div>

            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;entity&raquo;</span>ParkingFloor</div>
                <div class="uml-attributes">
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">id</span><span class="uml-type">Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">parkingLotId</span><span class="uml-type">Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">floorNumber</span><span class="uml-type">int</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">totalSpots</span><span class="uml-type">int</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">availableSpots</span><span class="uml-type">int</span></div>
                </div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getSpots()</span><span class="uml-type">List&lt;ParkingSpot&gt;</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">isFull()</span><span class="uml-type">boolean</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getAvailableByType()</span><span class="uml-type">Map&lt;SpotType, Integer&gt;</span></div>
                </div>
            </div>

            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;entity&raquo;</span>ParkingSpot</div>
                <div class="uml-attributes">
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">id</span><span class="uml-type">Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">floorId</span><span class="uml-type">Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">spotNumber</span><span class="uml-type">String</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">spotType</span><span class="uml-type">SpotType</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">status</span><span class="uml-type">SpotStatus</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">vehicleId</span><span class="uml-type">Long</span></div>
                </div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">assignVehicle()</span><span class="uml-type">void</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">releaseSpot()</span><span class="uml-type">void</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">isAvailable()</span><span class="uml-type">boolean</span></div>
                </div>
            </div>

            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;entity&raquo;</span>Vehicle</div>
                <div class="uml-attributes">
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">id</span><span class="uml-type">Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">userId</span><span class="uml-type">Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">vehicleType</span><span class="uml-type">VehicleType</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">licensePlate</span><span class="uml-type">String</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">color</span><span class="uml-type">String</span></div>
                </div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getTickets()</span><span class="uml-type">List&lt;ParkingTicket&gt;</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getActiveTicket()</span><span class="uml-type">ParkingTicket</span></div>
                </div>
            </div>

            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;entity&raquo;</span>ParkingTicket</div>
                <div class="uml-attributes">
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">id</span><span class="uml-type">Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">vehicleId</span><span class="uml-type">Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">spotId</span><span class="uml-type">Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">entryTime</span><span class="uml-type">LocalDateTime</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">exitTime</span><span class="uml-type">LocalDateTime</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">status</span><span class="uml-type">TicketStatus</span></div>
                </div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getPayment()</span><span class="uml-type">Payment</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getDuration()</span><span class="uml-type">Duration</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">close()</span><span class="uml-type">void</span></div>
                </div>
            </div>

            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;entity&raquo;</span>Payment</div>
                <div class="uml-attributes">
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">id</span><span class="uml-type">Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">ticketId</span><span class="uml-type">Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">amount</span><span class="uml-type">BigDecimal</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">mode</span><span class="uml-type">PaymentMode</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">status</span><span class="uml-type">String</span></div>
                </div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">processPayment()</span><span class="uml-type">boolean</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">generateReceipt()</span><span class="uml-type">String</span></div>
                </div>
            </div>

            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;entity&raquo;</span>Gate</div>
                <div class="uml-attributes">
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">id</span><span class="uml-type">Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">parkingLotId</span><span class="uml-type">Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">gateName</span><span class="uml-type">String</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">gateType</span><span class="uml-type">GateType</span></div>
                </div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">openGate()</span><span class="uml-type">void</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">closeGate()</span><span class="uml-type">void</span></div>
                </div>
            </div>

            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;entity&raquo;</span>ParkingRate</div>
                <div class="uml-attributes">
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">id</span><span class="uml-type">Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">parkingLotId</span><span class="uml-type">Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">vehicleType</span><span class="uml-type">VehicleType</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">hourlyRate</span><span class="uml-type">BigDecimal</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">dailyRate</span><span class="uml-type">BigDecimal</span></div>
                </div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">calculateFee()</span><span class="uml-type">BigDecimal</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getRate()</span><span class="uml-type">BigDecimal</span></div>
                </div>
            </div>
        </div>

        <div class="uml-section-label">Enums</div>
        <div class="uml-grid">
            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;enum&raquo;</span>VehicleType</div>
                <div class="uml-attributes">
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">BIKE</span></div>
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">CAR</span></div>
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">TRUCK</span></div>
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">EV</span></div>
                </div>
            </div>
            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;enum&raquo;</span>SpotType</div>
                <div class="uml-attributes">
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">SMALL</span></div>
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">MEDIUM</span></div>
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">LARGE</span></div>
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">EV_CHARGING</span></div>
                </div>
            </div>
            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;enum&raquo;</span>SpotStatus</div>
                <div class="uml-attributes">
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">AVAILABLE</span></div>
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">OCCUPIED</span></div>
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">RESERVED</span></div>
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">MAINTENANCE</span></div>
                </div>
            </div>
            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;enum&raquo;</span>TicketStatus</div>
                <div class="uml-attributes">
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">ACTIVE</span></div>
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">PAID</span></div>
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">LOST</span></div>
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">CANCELLED</span></div>
                </div>
            </div>
            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;enum&raquo;</span>PaymentMode</div>
                <div class="uml-attributes">
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">CASH</span></div>
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">CARD</span></div>
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">UPI</span></div>
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">WALLET</span></div>
                </div>
            </div>
            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;enum&raquo;</span>GateType</div>
                <div class="uml-attributes">
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">ENTRY</span></div>
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">EXIT</span></div>
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">BOTH</span></div>
                </div>
            </div>
        </div>

        <div class="uml-section-label">Service Classes</div>
        <div class="uml-grid">
            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;service&raquo;</span>ParkingLotService</div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getInstance()</span><span class="uml-type">ParkingLot</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getAvailability()</span><span class="uml-type">Map&lt;SpotType, Integer&gt;</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">isFull()</span><span class="uml-type">boolean</span></div>
                </div>
            </div>
            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;service&raquo;</span>SpotAllocationService</div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">allocateSpot()</span><span class="uml-type">ParkingSpot</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">releaseSpot()</span><span class="uml-type">void</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">findNearestSpot()</span><span class="uml-type">ParkingSpot</span></div>
                </div>
            </div>
            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;service&raquo;</span>GateService</div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">processEntry()</span><span class="uml-type">ParkingTicket</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">processExit()</span><span class="uml-type">void</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">scanTicket()</span><span class="uml-type">ParkingTicket</span></div>
                </div>
            </div>
            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;service&raquo;</span>TicketService</div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">generateTicket()</span><span class="uml-type">ParkingTicket</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">closeTicket()</span><span class="uml-type">void</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">handleLostTicket()</span><span class="uml-type">ParkingTicket</span></div>
                </div>
            </div>
            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;service&raquo;</span>PaymentService</div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">processPayment()</span><span class="uml-type">Payment</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">refund()</span><span class="uml-type">void</span></div>
                </div>
            </div>
            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;service&raquo;</span>FeeCalculatorService</div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">calculateFee()</span><span class="uml-type">BigDecimal</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">applyDiscount()</span><span class="uml-type">BigDecimal</span></div>
                </div>
            </div>
            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;service&raquo;</span>DisplayBoardService</div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">updateBoard()</span><span class="uml-type">void</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getFloorStatus()</span><span class="uml-type">Map&lt;Integer, Integer&gt;</span></div>
                </div>
            </div>
        </div>

        <div class="uml-relations">
            <h4>Relationships</h4>
            <div class="uml-rel">
                <span class="uml-rel-from">ParkingLot</span>
                <span class="uml-rel-arrow">1 ────── N</span>
                <span class="uml-rel-to">ParkingFloor</span>
                <span class="uml-rel-label">has</span>
                <span class="uml-rel-type">ONE-TO-MANY</span>
            </div>
            <div class="uml-rel">
                <span class="uml-rel-from">ParkingFloor</span>
                <span class="uml-rel-arrow">1 ────── N</span>
                <span class="uml-rel-to">ParkingSpot</span>
                <span class="uml-rel-label">contains</span>
                <span class="uml-rel-type">ONE-TO-MANY</span>
            </div>
            <div class="uml-rel">
                <span class="uml-rel-from">ParkingLot</span>
                <span class="uml-rel-arrow">1 ────── N</span>
                <span class="uml-rel-to">Gate</span>
                <span class="uml-rel-label">has</span>
                <span class="uml-rel-type">ONE-TO-MANY</span>
            </div>
            <div class="uml-rel">
                <span class="uml-rel-from">ParkingSpot</span>
                <span class="uml-rel-arrow">1 ────── 0..1</span>
                <span class="uml-rel-to">Vehicle</span>
                <span class="uml-rel-label">occupied by</span>
                <span class="uml-rel-type">ONE-TO-ONE (OPTIONAL)</span>
            </div>
            <div class="uml-rel">
                <span class="uml-rel-from">Vehicle</span>
                <span class="uml-rel-arrow">1 ────── N</span>
                <span class="uml-rel-to">ParkingTicket</span>
                <span class="uml-rel-label">has</span>
                <span class="uml-rel-type">ONE-TO-MANY</span>
            </div>
            <div class="uml-rel">
                <span class="uml-rel-from">ParkingTicket</span>
                <span class="uml-rel-arrow">1 ────── 1</span>
                <span class="uml-rel-to">Payment</span>
                <span class="uml-rel-label">paid via</span>
                <span class="uml-rel-type">ONE-TO-ONE</span>
            </div>
            <div class="uml-rel">
                <span class="uml-rel-from">ParkingLot</span>
                <span class="uml-rel-arrow">1 ────── N</span>
                <span class="uml-rel-to">ParkingRate</span>
                <span class="uml-rel-label">defines</span>
                <span class="uml-rel-type">ONE-TO-MANY</span>
            </div>
        </div>

        <div class="uml-note">
            <strong>Hinglish Explanation:</strong> Yeh UML diagram Parking Lot System ka classic OOP design dikhata hai &mdash; ParkingLot ke multiple ParkingFloors hote hain, har floor pe ParkingSpots hote hain different types ke (SMALL, MEDIUM, LARGE, EV_CHARGING). Vehicle enter karne pe GateService ParkingTicket generate karta hai, SpotAllocationService best available spot assign karta hai aur exit pe FeeCalculatorService time ke basis pe fee calculate karta hai.
        </div>
    </div>
</div>

<div class="section theme-orange">
    <div class="section-title"><span class="section-num">17</span>Interview Summary</div>
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
