export default {
  title: "LeetCode &mdash; Low Level Design",
  subtitle: "Complete LLD for Java Spring Boot Interview &mdash; Online Judge, Code Execution, Contest System &amp; Discussion Forum",
  subtitleColor: "#fff3e0",
  headerGradient: "linear-gradient(135deg,#e65100,#f57c00,#ffab40)",
  footerText: "LeetCode Online Judge LLD",
  content: `
<!-- ============ 1. FUNCTIONAL REQUIREMENTS ============ -->
<div class="section theme-orange">
    <div class="section-title"><span class="section-num">1</span>Functional Requirements</div>
    <div class="req-grid">
        <div class="req-pill"><span class="num">1</span><div class="fr-content"><div class="fr-en">User Authentication (OAuth + Email)</div><div class="fr-hi">Ye requirement isliye hai taki user apna progress track kar sake — bina login ke solved problems, submissions, streak sab lost ho jaayega. OAuth se Google/GitHub se quick login milta hai aur email se traditional signup</div></div></div>
        <div class="req-pill"><span class="num">2</span><div class="fr-content"><div class="fr-en">Problem Listing &amp; Filtering</div><div class="fr-hi">LeetCode pe 3000+ problems hai — bina filtering ke user kaise dhundhega ki "Google ke Easy level Array problems" kaunse hai? Topic, difficulty, aur company wise filter se user targeted practice kar sakta hai apni interview prep ke liye</div></div></div>
        <div class="req-pill"><span class="num">3</span><div class="fr-content"><div class="fr-en">Code Submission &amp; Execution</div><div class="fr-hi">Ye poore platform ka core feature hai — user browser me hi code likhe, Run kare aur Submit kare bina local IDE setup ke. Ek click me code server pe execute ho aur result aaye, yahi cheez LeetCode ko powerful banaati hai</div></div></div>
        <div class="req-pill"><span class="num">4</span><div class="fr-content"><div class="fr-en">Online Judge (Verdict System)</div><div class="fr-hi">Ye sabse critical requirement hai — user ka code hidden test cases pe run hoga aur accurate verdict milega. Accepted, Wrong Answer, Time Limit Exceeded, Memory Limit Exceeded — ye verdicts hi user ko bataate hai ki solution sahi hai ya optimize karna padega</div></div></div>
        <div class="req-pill"><span class="num">5</span><div class="fr-content"><div class="fr-en">Leaderboard &amp; Rankings</div><div class="fr-hi">Leaderboard se competitive spirit aati hai — user dekhta hai ki duniya me uski ranking kya hai, kitne problems solve kiye, rating kya hai. Ye gamification users ko motivated rakhti hai aur platform pe wapas laati hai</div></div></div>
        <div class="req-pill"><span class="num">6</span><div class="fr-content"><div class="fr-en">Contest Mode (Timed Events)</div><div class="fr-hi">Contest mode real interview pressure simulate karta hai — 90 min me 4 problems solve karo, ranking bhi update hogi. Weekly/biweekly contests se users ko actual interview jaisa timed environment milta hai jo practice se kahin zyada effective hai</div></div></div>
        <div class="req-pill"><span class="num">7</span><div class="fr-content"><div class="fr-en">Discussion Forum</div><div class="fr-hi">Har problem ke multiple approaches hote hai — discussion forum se users apne solutions share karte hai, doubts poochte hai, aur better approaches seekhte hai. Community-driven learning LeetCode ki sabse badi strength hai</div></div></div>
        <div class="req-pill"><span class="num">8</span><div class="fr-content"><div class="fr-en">Solution &amp; Editorial</div><div class="fr-hi">Agar user 1 ghanta try karke bhi solve nahi kar paaya toh usse optimal approach sikhne ka raasta chahiye — editorial me step-by-step explanation, time/space complexity, aur multiple approaches milti hai jo learning ko accelerate karti hai</div></div></div>
        <div class="req-pill"><span class="num">9</span><div class="fr-content"><div class="fr-en">User Profile &amp; Stats</div><div class="fr-hi">Profile se user apna complete coding journey track karta hai — kitne Easy/Medium/Hard solve kiye, daily streak kitna hai, contest rating kya hai. Ye data interview me bhi dikhate hai aur self-motivation ke liye bhi kaam aata hai</div></div></div>
        <div class="req-pill"><span class="num">10</span><div class="fr-content"><div class="fr-en">Multi-Language Support</div><div class="fr-hi">Har developer ki apni preferred language hoti hai — koi Java me comfortable hai, koi Python me. Multi-language support se user apni strongest language me practice kar sakta hai aur interview me bhi wahi language use karega</div></div></div>
    </div>
</div>

<!-- ============ 2. ENUMS ============ -->

<!-- ============ NON-FUNCTIONAL REQUIREMENTS ============ -->
<div class="section theme-pink">
    <div class="section-title"><span class="section-num">2</span>Non-Functional Requirements</div>
    <div class="req-grid">
        <div class="req-pill"><span class="num">1</span><div class="nfr-content"><div class="nfr-en">Low Latency &mdash; Code compile &amp; run must complete within 5 seconds</div><div class="nfr-hi">Code compile aur run &lt; 5 sec me hona chahiye &mdash; user ko fast feedback mile</div></div></div>
        <div class="req-pill"><span class="num">2</span><div class="nfr-content"><div class="nfr-en">High Availability &mdash; 99.9% uptime, especially during contests</div><div class="nfr-hi">Contest time pe 99.9% uptime hona chahiye &mdash; downtime pe participants ka time waste ho</div></div></div>
        <div class="req-pill"><span class="num">3</span><div class="nfr-content"><div class="nfr-en">Scalability &mdash; Handle 100K+ concurrent submissions during contests</div><div class="nfr-hi">Contest ke time 100K+ concurrent submissions handle karne padenge &mdash; queue-based processing</div></div></div>
        <div class="req-pill"><span class="num">4</span><div class="nfr-content"><div class="nfr-en">Isolation &mdash; Every submission runs in a sandboxed environment</div><div class="nfr-hi">Har submission sandboxed environment me run hona chahiye &mdash; ek ka dusre pe effect nahi ho</div></div></div>
        <div class="req-pill"><span class="num">5</span><div class="nfr-content"><div class="nfr-en">Consistency &mdash; Submission results must update atomically</div><div class="nfr-hi">Submission result atomic update hona chahiye &mdash; partial result nahi dikhna chahiye</div></div></div>
        <div class="req-pill"><span class="num">6</span><div class="nfr-content"><div class="nfr-en">Security &mdash; System must be safe from malicious code execution</div><div class="nfr-hi">Malicious code execution se system safe rehna chahiye &mdash; resource limits + sandbox mandatory</div></div></div>
    </div>
</div>

<!-- ============ 3. ENUMS ============ -->
<div class="section theme-purple">
    <div class="section-title"><span class="section-num">3</span>Enums</div>
    <div class="enum-grid">
        <div class="enum-card">
            <h3>Difficulty</h3>
            <div class="enum-val">EASY</div>
            <div class="enum-val">MEDIUM</div>
            <div class="enum-val">HARD</div>
        </div>
        <div class="enum-card">
            <h3>Verdict</h3>
            <div class="enum-val">ACCEPTED</div>
            <div class="enum-val">WRONG_ANSWER</div>
            <div class="enum-val">TIME_LIMIT_EXCEEDED</div>
            <div class="enum-val">MEMORY_LIMIT_EXCEEDED</div>
            <div class="enum-val">RUNTIME_ERROR</div>
            <div class="enum-val">COMPILE_ERROR</div>
            <div class="enum-val">PENDING</div>
        </div>
        <div class="enum-card">
            <h3>Language</h3>
            <div class="enum-val">JAVA</div>
            <div class="enum-val">PYTHON</div>
            <div class="enum-val">CPP</div>
            <div class="enum-val">JAVASCRIPT</div>
            <div class="enum-val">GO</div>
            <div class="enum-val">RUST</div>
        </div>
        <div class="enum-card">
            <h3>ContestType</h3>
            <div class="enum-val">WEEKLY</div>
            <div class="enum-val">BIWEEKLY</div>
            <div class="enum-val">VIRTUAL</div>
        </div>
        <div class="enum-card">
            <h3>ContestStatus</h3>
            <div class="enum-val">UPCOMING</div>
            <div class="enum-val">LIVE</div>
            <div class="enum-val">ENDED</div>
        </div>
        <div class="enum-card">
            <h3>UserRole</h3>
            <div class="enum-val">USER</div>
            <div class="enum-val">PREMIUM</div>
            <div class="enum-val">ADMIN</div>
            <div class="enum-val">PROBLEM_SETTER</div>
        </div>
        <div class="enum-card">
            <h3>SubmissionStatus</h3>
            <div class="enum-val">QUEUED</div>
            <div class="enum-val">RUNNING</div>
            <div class="enum-val">COMPLETED</div>
            <div class="enum-val">FAILED</div>
        </div>
    </div>
</div>

<!-- ============ 3. DATABASE SCHEMA ============ -->

<!-- ============ 4. SERVICE LLD ============ -->
<div class="section theme-yellow">
    <div class="section-title"><span class="section-num">4</span>Service LLD</div>
    <div class="service-grid">
        <div class="service-card">
            <h3>ProblemService</h3>
            <p class="svc-desc">Coding problems ko manage karta hai &mdash; create, fetch, filter aur acceptance rate update karta hai</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">ProblemService</span> {

    <span class="cm">// Naya problem create karo with all details</span>
    <span class="tp">Problem</span> <span class="fn">createProblem</span>(<span class="tp">String</span> title, <span class="tp">String</span> slug,
        <span class="tp">String</span> description, <span class="tp">Difficulty</span> difficulty,
        <span class="tp">List&lt;String&gt;</span> categoryTags, <span class="tp">String</span> constraints,
        <span class="tp">Map&lt;Language, String&gt;</span> starterCode, <span class="tp">Boolean</span> isPremium)

    <span class="cm">// Slug se ek problem fetch karo</span>
    <span class="tp">Problem</span> <span class="fn">getProblemBySlug</span>(<span class="tp">String</span> slug)

    <span class="cm">// Filter lagake problems ki list nikalo with pagination</span>
    <span class="tp">Page&lt;Problem&gt;</span> <span class="fn">listProblems</span>(<span class="tp">Difficulty</span> difficulty,
        <span class="tp">String</span> tag, <span class="tp">String</span> searchQuery,
        <span class="tp">Boolean</span> isPremium, <span class="tp">Pageable</span> pageable)

    <span class="cm">// Problem ka acceptance rate recalculate karo</span>
    <span class="kw">void</span> <span class="fn">updateAcceptanceRate</span>(<span class="tp">Long</span> problemId)
}
</pre></div>
        </div>
        <div class="service-card">
            <h3>SubmissionService</h3>
            <p class="svc-desc">Code submissions handle karta hai &mdash; solution submit karo, test cases run karo, result check karo</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">SubmissionService</span> {

    <span class="cm">// User ka code submit karo judging ke liye</span>
    <span class="tp">Submission</span> <span class="fn">submit</span>(<span class="tp">Long</span> userId, <span class="tp">Long</span> problemId,
        <span class="tp">String</span> code, <span class="tp">Language</span> language)

    <span class="cm">// Custom input pe code run karo bina submit kiye</span>
    <span class="tp">RunResult</span> <span class="fn">runCode</span>(<span class="tp">Long</span> userId, <span class="tp">Long</span> problemId,
        <span class="tp">String</span> code, <span class="tp">Language</span> language,
        <span class="tp">String</span> customInput)

    <span class="cm">// Submission ka current status check karo</span>
    <span class="tp">SubmissionStatus</span> <span class="fn">getSubmissionStatus</span>(<span class="tp">Long</span> submissionId)

    <span class="cm">// User ki saari submissions nikalo ek problem ke liye</span>
    <span class="tp">List&lt;Submission&gt;</span> <span class="fn">getUserSubmissions</span>(<span class="tp">Long</span> userId,
        <span class="tp">Long</span> problemId)
}
</pre></div>
        </div>
        <div class="service-card">
            <h3>JudgeService</h3>
            <p class="svc-desc">Submitted code ko compile, run aur check karta hai &mdash; har test case ke against expected output match karta hai</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">JudgeService</span> {

    <span class="cm">// Submission ko saare test cases pe evaluate karo</span>
    <span class="tp">JudgeResult</span> <span class="fn">evaluate</span>(<span class="tp">Submission</span> submission,
        <span class="tp">List&lt;TestCase&gt;</span> testCases)

    <span class="cm">// Code ko compile karo sandbox mein</span>
    <span class="tp">CompileResult</span> <span class="fn">compile</span>(<span class="tp">String</span> code,
        <span class="tp">Language</span> language, <span class="tp">String</span> workDir)

    <span class="cm">// Compiled binary ko ek test case pe run karo</span>
    <span class="tp">ExecutionResult</span> <span class="fn">execute</span>(<span class="tp">String</span> binaryPath,
        <span class="tp">String</span> input, <span class="tp">int</span> timeLimitMs,
        <span class="tp">int</span> memoryLimitKb)

    <span class="cm">// Actual output ko expected output se compare karo</span>
    <span class="tp">boolean</span> <span class="fn">compareOutput</span>(<span class="tp">String</span> actualOutput,
        <span class="tp">String</span> expectedOutput)
}
</pre></div>
        </div>
        <div class="service-card">
            <h3>ContestService</h3>
            <p class="svc-desc">Coding contests manage karta hai &mdash; contest create karo, users register karo, scores track karo aur rating update karo</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">ContestService</span> {

    <span class="cm">// Naya coding contest create karo</span>
    <span class="tp">Contest</span> <span class="fn">createContest</span>(<span class="tp">String</span> title,
        <span class="tp">ContestType</span> type, <span class="tp">LocalDateTime</span> startTime,
        <span class="tp">Integer</span> duration, <span class="tp">List&lt;Long&gt;</span> problemIds)

    <span class="cm">// User ko contest mein register karo</span>
    <span class="kw">void</span> <span class="fn">registerUser</span>(<span class="tp">Long</span> contestId, <span class="tp">Long</span> userId)

    <span class="cm">// Contest ka leaderboard fetch karo with pagination</span>
    <span class="tp">Page&lt;LeaderboardEntry&gt;</span> <span class="fn">getLeaderboard</span>(<span class="tp">Long</span> contestId,
        <span class="tp">Pageable</span> pageable)

    <span class="cm">// Contest khatam hone pe ratings calculate karo</span>
    <span class="kw">void</span> <span class="fn">calculateRatings</span>(<span class="tp">Long</span> contestId)
}
</pre></div>
        </div>
        <div class="service-card">
            <h3>LeaderboardService</h3>
            <p class="svc-desc">Global rankings aur user ratings track karta hai &mdash; Redis Sorted Set se fast rank query hota hai</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">LeaderboardService</span> {

    <span class="cm">// Global ranking list nikalo with pagination</span>
    <span class="tp">Page&lt;RankEntry&gt;</span> <span class="fn">getGlobalRanking</span>(<span class="tp">Pageable</span> pageable)

    <span class="cm">// Ek user ka rank aur rating fetch karo</span>
    <span class="tp">RankEntry</span> <span class="fn">getUserRank</span>(<span class="tp">Long</span> userId)

    <span class="cm">// User ki rating update karo delta se</span>
    <span class="kw">void</span> <span class="fn">updateRating</span>(<span class="tp">Long</span> userId, <span class="tp">int</span> delta)

    <span class="cm">// Redis cache ko refresh karo DB se</span>
    <span class="kw">void</span> <span class="fn">refreshCache</span>()
}
</pre></div>
        </div>
        <div class="service-card">
            <h3>DiscussionService</h3>
            <p class="svc-desc">Discussion posts, comments aur upvotes manage karta hai &mdash; har problem ke liye community solutions</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">DiscussionService</span> {

    <span class="cm">// Naya discussion post create karo problem ke liye</span>
    <span class="tp">Discussion</span> <span class="fn">createPost</span>(<span class="tp">Long</span> userId, <span class="tp">Long</span> problemId,
        <span class="tp">String</span> title, <span class="tp">String</span> content,
        <span class="tp">List&lt;String&gt;</span> tags)

    <span class="cm">// Problem ki saari discussions fetch karo</span>
    <span class="tp">Page&lt;Discussion&gt;</span> <span class="fn">getDiscussions</span>(<span class="tp">Long</span> problemId,
        <span class="tp">Pageable</span> pageable)

    <span class="cm">// Discussion ko upvote karo</span>
    <span class="kw">void</span> <span class="fn">upvote</span>(<span class="tp">Long</span> discussionId, <span class="tp">Long</span> userId)

    <span class="cm">// Discussion pe comment add karo</span>
    <span class="tp">Comment</span> <span class="fn">addComment</span>(<span class="tp">Long</span> discussionId,
        <span class="tp">Long</span> userId, <span class="tp">String</span> content)
}
</pre></div>
        </div>
        <div class="service-card">
            <h3>AuthService</h3>
            <p class="svc-desc">User signup, login (email + Google/GitHub OAuth) aur JWT token refresh handle karta hai</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">AuthService</span> {

    <span class="cm">// Naya user register karo email/password se</span>
    <span class="tp">User</span> <span class="fn">register</span>(<span class="tp">String</span> username, <span class="tp">String</span> email,
        <span class="tp">String</span> password)

    <span class="cm">// Email aur password se login karo, JWT milega</span>
    <span class="tp">String</span> <span class="fn">login</span>(<span class="tp">String</span> email, <span class="tp">String</span> password)

    <span class="cm">// Google/GitHub OAuth se login karo</span>
    <span class="tp">String</span> <span class="fn">oauthLogin</span>(<span class="tp">String</span> provider,
        <span class="tp">String</span> oauthToken)

    <span class="cm">// Expired JWT ko refresh karo naya token leke</span>
    <span class="tp">String</span> <span class="fn">refreshToken</span>(<span class="tp">String</span> refreshToken)
}
</pre></div>
        </div>
        <div class="service-card">
            <h3>SandboxService</h3>
            <p class="svc-desc">Safe Docker containers create karta hai user code run karne ke liye &mdash; network band, memory limit, time limit sab lagta hai</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">SandboxService</span> {

    <span class="cm">// Language ke hisaab se Docker container banao</span>
    <span class="tp">String</span> <span class="fn">createContainer</span>(<span class="tp">Language</span> language)

    <span class="cm">// Sandbox mein code execute karo with limits</span>
    <span class="tp">ExecutionResult</span> <span class="fn">executeInSandbox</span>(<span class="tp">String</span> containerId,
        <span class="tp">String</span> code, <span class="tp">String</span> input,
        <span class="tp">int</span> timeLimitMs, <span class="tp">int</span> memoryLimitKb)

    <span class="cm">// Container destroy karo execution ke baad</span>
    <span class="kw">void</span> <span class="fn">destroyContainer</span>(<span class="tp">String</span> containerId)

    <span class="cm">// CPU, memory, PID limits enforce karo container pe</span>
    <span class="kw">void</span> <span class="fn">enforceResourceLimits</span>(<span class="tp">String</span> containerId,
        <span class="tp">int</span> cpuCores, <span class="tp">int</span> memoryLimitKb,
        <span class="tp">int</span> timeLimitMs, <span class="tp">int</span> pidsLimit)
}
</pre></div>
        </div>
    </div>
</div>

<!-- ============ 5. APIs ============ -->

<!-- ============ 5. APIs ============ -->
<div class="section theme-teal">
    <div class="section-title"><span class="section-num">5</span>API Endpoints</div>
    <div class="api-grid">
        <div class="api-card">
            <div class="api-header"><span class="api-method method-get">GET</span><span class="api-path">/api/problems?difficulty=MEDIUM&amp;tag=array&amp;page=0&amp;size=20</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Query Params</div><span class="key">difficulty</span>: <span class="val">EASY | MEDIUM | HARD</span><br><span class="key">tag</span>: <span class="val">"array"</span><br><span class="key">page</span>: <span class="val">0</span>, <span class="key">size</span>: <span class="val">20</span></div>
                <div class="api-json"><div class="label">Response 200</div>{ <span class="key">"problems"</span>: <span class="val">[{id, title, difficulty, acceptanceRate, ...}]</span>, <span class="key">"totalPages"</span>: <span class="val">50</span> }</div>
            </div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-get">GET</span><span class="api-path">/api/problems/{slug}</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Path Param</div><span class="key">slug</span>: <span class="val">"two-sum"</span></div>
                <div class="api-json"><div class="label">Response 200</div>{ <span class="key">"problem"</span>: <span class="val">{id, title, description, sampleTestCases, starterCode, ...}</span> }</div>
            </div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-post">POST</span><span class="api-path">/api/submissions</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Request</div>{ <span class="key">"problemId"</span>: <span class="val">1</span>, <span class="key">"language"</span>: <span class="val">"JAVA"</span>, <span class="key">"code"</span>: <span class="val">"class Solution { ... }"</span> }</div>
                <div class="api-json"><div class="label">Response 202</div>{ <span class="key">"submissionId"</span>: <span class="val">12345</span>, <span class="key">"status"</span>: <span class="val">"QUEUED"</span> }</div>
            </div>
            <div class="api-note">Async &mdash; returns immediately, client polls for result or uses WebSocket</div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-get">GET</span><span class="api-path">/api/submissions/{id}/status</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Response 200 (Pending)</div>{ <span class="key">"status"</span>: <span class="val">"RUNNING"</span>, <span class="key">"testCasesPassed"</span>: <span class="val">5</span> }</div>
                <div class="api-json"><div class="label">Response 200 (Done)</div>{ <span class="key">"verdict"</span>: <span class="val">"ACCEPTED"</span>, <span class="key">"runtime"</span>: <span class="val">12</span>, <span class="key">"memory"</span>: <span class="val">42100</span>, <span class="key">"passed"</span>: <span class="val">50</span>, <span class="key">"total"</span>: <span class="val">50</span> }</div>
            </div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-post">POST</span><span class="api-path">/api/submissions/run</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Request</div>{ <span class="key">"problemId"</span>: <span class="val">1</span>, <span class="key">"language"</span>: <span class="val">"PYTHON"</span>, <span class="key">"code"</span>: <span class="val">"..."</span>, <span class="key">"customInput"</span>: <span class="val">"[2,7,11,15]\\n9"</span> }</div>
                <div class="api-json"><div class="label">Response 200</div>{ <span class="key">"output"</span>: <span class="val">"[0,1]"</span>, <span class="key">"runtime"</span>: <span class="val">5</span>, <span class="key">"expected"</span>: <span class="val">"[0,1]"</span>, <span class="key">"match"</span>: <span class="val">true</span> }</div>
            </div>
            <div class="api-note">Run against sample test cases only &mdash; does not count as official submission</div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-post">POST</span><span class="api-path">/api/contests/{id}/register</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Request</div>{ <span class="key">"userId"</span>: <span class="val">42</span> }</div>
                <div class="api-json"><div class="label">Response 200</div>{ <span class="key">"registered"</span>: <span class="val">true</span>, <span class="key">"contestId"</span>: <span class="val">5</span> }</div>
            </div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-get">GET</span><span class="api-path">/api/contests/{id}/leaderboard?page=0&amp;size=50</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Response 200</div>{ <span class="key">"entries"</span>: <span class="val">[{rank, username, score, finishTime, ...}]</span>, <span class="key">"totalParticipants"</span>: <span class="val">12000</span> }</div>
                <div class="api-json"><div class="label">Sorting</div><span class="key">primary</span>: <span class="val">score DESC</span><br><span class="key">tiebreak</span>: <span class="val">finishTime ASC</span><br><span class="key">penalty</span>: <span class="val">+5 min per wrong attempt</span></div>
            </div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-post">POST</span><span class="api-path">/api/discussions</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Request</div>{ <span class="key">"problemId"</span>: <span class="val">1</span>, <span class="key">"title"</span>: <span class="val">"O(n) HashMap approach"</span>, <span class="key">"content"</span>: <span class="val">"## Approach\\n..."</span> }</div>
                <div class="api-json"><div class="label">Response 201</div>{ <span class="key">"discussionId"</span>: <span class="val">789</span> }</div>
            </div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-get">GET</span><span class="api-path">/api/users/{username}/profile</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Response 200</div>{ <span class="key">"username"</span>: <span class="val">"coder42"</span>, <span class="key">"rating"</span>: <span class="val">2100</span>, <span class="key">"totalSolved"</span>: <span class="val">450</span>, <span class="key">"streak"</span>: <span class="val">30</span> }</div>
                <div class="api-json"><div class="label">Stats Breakdown</div><span class="key">easy</span>: <span class="val">180</span>, <span class="key">medium</span>: <span class="val">200</span>, <span class="key">hard</span>: <span class="val">70</span><br><span class="key">submissions</span>: <span class="val">1200</span>, <span class="key">acceptRate</span>: <span class="val">62.5%</span></div>
            </div>
        </div>
    </div>
</div>

<!-- ============ 6. KEY ARCHITECTURE ============ -->

<!-- ============ 6. DATABASE SCHEMA ============ -->
<div class="section theme-pink">
    <div class="section-title"><span class="section-num">6</span>Database Schema</div>

    <div class="sub-heading" style="color:#ff80ab;border-color:#ff80ab">Database Technology Stack</div>
    <div class="dbtech-grid">
        <div class="dbtech-card">
            <div class="dbtech-name">PostgreSQL <span class="dbtech-type">RDBMS</span></div>
            <div class="dbtech-usage">Users, problems, contests, discussions &mdash; ACID transactions for structured data</div>
            <div class="dbtech-tables"><span>users</span><span>problems</span><span>contests</span><span>discussions</span></div>
        </div>
        <div class="dbtech-card">
            <div class="dbtech-name">MongoDB <span class="dbtech-type">NoSQL</span></div>
            <div class="dbtech-usage">Code submissions &amp; test results &mdash; flexible schema for varying output formats</div>
            <div class="dbtech-tables"><span>submissions</span><span>test_results</span></div>
        </div>
        <div class="dbtech-card">
            <div class="dbtech-name">Redis <span class="dbtech-type">In-Memory</span></div>
            <div class="dbtech-usage">Leaderboard rankings (Sorted Sets), session cache, problem solve counts</div>
            <div class="dbtech-tables"><span>leaderboard:{contestId}</span><span>session:{userId}</span></div>
        </div>
        <div class="dbtech-card">
            <div class="dbtech-name">Docker <span class="dbtech-type">Sandbox</span></div>
            <div class="dbtech-usage">Isolated code execution containers &mdash; one per submission with CPU/memory limits</div>
            <div class="dbtech-tables"><span>judge-{language}-{submissionId}</span></div>
        </div>
        <div class="dbtech-card">
            <div class="dbtech-name">Kafka <span class="dbtech-type">Message Queue</span></div>
            <div class="dbtech-usage">Submission processing queue &mdash; async judge pipeline with priority support</div>
            <div class="dbtech-tables"><span>submissions</span><span>judge-results</span></div>
        </div>
    </div>

    <div class="db-grid">
        <div class="db-table">
            <h3>problems</h3>
            <ul>
                <li><span class="pk">id BIGINT PK AUTO_INCREMENT</span></li>
                <li>title VARCHAR(255) UNIQUE NOT NULL</li>
                <li>slug VARCHAR(255) UNIQUE NOT NULL <span class="idx">IDX</span></li>
                <li>description TEXT NOT NULL</li>
                <li>difficulty ENUM('EASY','MEDIUM','HARD') <span class="idx">IDX</span></li>
                <li>acceptance_rate DECIMAL(5,2)</li>
                <li>total_submissions BIGINT DEFAULT 0</li>
                <li>total_accepted BIGINT DEFAULT 0</li>
                <li>constraints TEXT</li>
                <li>is_premium BOOLEAN DEFAULT FALSE</li>
                <li>created_at TIMESTAMP</li>
            </ul>
        </div>
        <div class="db-table">
            <h3>submissions</h3>
            <ul>
                <li><span class="pk">id BIGINT PK AUTO_INCREMENT</span></li>
                <li><span class="fk">user_id BIGINT FK &rarr; users.id</span> <span class="idx">IDX</span></li>
                <li><span class="fk">problem_id BIGINT FK &rarr; problems.id</span> <span class="idx">IDX</span></li>
                <li>language ENUM NOT NULL</li>
                <li>code TEXT NOT NULL</li>
                <li>verdict ENUM NOT NULL</li>
                <li>runtime INT</li>
                <li>memory INT</li>
                <li>passed_test_cases INT</li>
                <li>total_test_cases INT</li>
                <li>error_output TEXT</li>
                <li><span class="fk">contest_id BIGINT FK &rarr; contests.id</span></li>
                <li>submitted_at TIMESTAMP <span class="idx">IDX</span></li>
            </ul>
        </div>
        <div class="db-table">
            <h3>test_cases</h3>
            <ul>
                <li><span class="pk">id BIGINT PK AUTO_INCREMENT</span></li>
                <li><span class="fk">problem_id BIGINT FK &rarr; problems.id</span> <span class="idx">IDX</span></li>
                <li>input TEXT NOT NULL</li>
                <li>expected_output TEXT NOT NULL</li>
                <li>is_sample BOOLEAN DEFAULT FALSE</li>
                <li>order_index INT</li>
                <li>time_limit_ms INT DEFAULT 2000</li>
                <li>memory_limit_kb INT DEFAULT 262144</li>
            </ul>
        </div>
        <div class="db-table">
            <h3>users</h3>
            <ul>
                <li><span class="pk">id BIGINT PK AUTO_INCREMENT</span></li>
                <li>username VARCHAR(50) UNIQUE <span class="idx">IDX</span></li>
                <li>email VARCHAR(255) UNIQUE <span class="idx">IDX</span></li>
                <li>password_hash VARCHAR(255)</li>
                <li>role ENUM NOT NULL</li>
                <li>rating INT DEFAULT 1500</li>
                <li>total_solved INT DEFAULT 0</li>
                <li>easy_solved INT DEFAULT 0</li>
                <li>medium_solved INT DEFAULT 0</li>
                <li>hard_solved INT DEFAULT 0</li>
                <li>streak INT DEFAULT 0</li>
                <li>is_premium BOOLEAN DEFAULT FALSE</li>
                <li>created_at TIMESTAMP</li>
            </ul>
        </div>
        <div class="db-table">
            <h3>contests</h3>
            <ul>
                <li><span class="pk">id BIGINT PK AUTO_INCREMENT</span></li>
                <li>title VARCHAR(255) NOT NULL</li>
                <li>type ENUM('WEEKLY','BIWEEKLY','VIRTUAL')</li>
                <li>start_time TIMESTAMP <span class="idx">IDX</span></li>
                <li>end_time TIMESTAMP</li>
                <li>duration INT NOT NULL</li>
                <li>status ENUM('UPCOMING','LIVE','ENDED') <span class="idx">IDX</span></li>
                <li>created_at TIMESTAMP</li>
            </ul>
        </div>
        <div class="db-table">
            <h3>discussions</h3>
            <ul>
                <li><span class="pk">id BIGINT PK AUTO_INCREMENT</span></li>
                <li><span class="fk">problem_id BIGINT FK &rarr; problems.id</span> <span class="idx">IDX</span></li>
                <li><span class="fk">user_id BIGINT FK &rarr; users.id</span></li>
                <li>title VARCHAR(255) NOT NULL</li>
                <li>content TEXT NOT NULL</li>
                <li>upvotes INT DEFAULT 0</li>
                <li>downvotes INT DEFAULT 0</li>
                <li>comment_count INT DEFAULT 0</li>
                <li>created_at TIMESTAMP <span class="idx">IDX</span></li>
            </ul>
        </div>
    </div>

    <div class="sub-heading" style="color:#ff80ab;border-color:#ff80ab">Database Examples &mdash; Sample Rows</div>
    <div class="db-grid">
        <div class="db-table">
            <h3>problems &mdash; Example</h3>
            <ul>
                <li><span class="pk">id = 1</span></li>
                <li>title = 'Two Sum'</li>
                <li>slug = 'two-sum'</li>
                <li>description = 'Given an array of integers nums...'</li>
                <li>difficulty = 'EASY'</li>
                <li>acceptance_rate = 49.20</li>
                <li>total_submissions = 12500000</li>
                <li>total_accepted = 6150000</li>
                <li>constraints = '2 &lt;= nums.length &lt;= 10^4'</li>
                <li>is_premium = FALSE</li>
                <li>created_at = '2023-01-15 10:00:00'</li>
            </ul>
        </div>
        <div class="db-table">
            <h3>submissions &mdash; Example</h3>
            <ul>
                <li><span class="pk">id = 101</span></li>
                <li><span class="fk">user_id = 42</span></li>
                <li><span class="fk">problem_id = 1</span></li>
                <li>language = 'JAVA'</li>
                <li>code = 'class Solution { public int[] twoSum...'</li>
                <li>verdict = 'ACCEPTED'</li>
                <li>runtime = 3</li>
                <li>memory = 42100</li>
                <li>passed_test_cases = 50</li>
                <li>total_test_cases = 50</li>
                <li>error_output = NULL</li>
                <li><span class="fk">contest_id = NULL</span></li>
                <li>submitted_at = '2025-06-01 14:30:22'</li>
            </ul>
        </div>
        <div class="db-table">
            <h3>users &mdash; Example</h3>
            <ul>
                <li><span class="pk">id = 42</span></li>
                <li>username = 'coder42'</li>
                <li>email = 'coder42@gmail.com'</li>
                <li>password_hash = '$2a$10$xJk...'</li>
                <li>role = 'PREMIUM'</li>
                <li>rating = 2100</li>
                <li>total_solved = 450</li>
                <li>easy_solved = 180</li>
                <li>medium_solved = 200</li>
                <li>hard_solved = 70</li>
                <li>streak = 30</li>
                <li>is_premium = TRUE</li>
                <li>created_at = '2023-03-10 09:15:00'</li>
            </ul>
        </div>
        <div class="db-table">
            <h3>contests &mdash; Example</h3>
            <ul>
                <li><span class="pk">id = 5</span></li>
                <li>title = 'Weekly Contest 380'</li>
                <li>type = 'WEEKLY'</li>
                <li>start_time = '2025-06-08 08:00:00'</li>
                <li>end_time = '2025-06-08 09:30:00'</li>
                <li>duration = 90</li>
                <li>status = 'ENDED'</li>
                <li>created_at = '2025-06-01 00:00:00'</li>
            </ul>
        </div>
        <div class="db-table">
            <h3>test_cases &mdash; Example</h3>
            <ul>
                <li><span class="pk">id = 501</span></li>
                <li><span class="fk">problem_id = 1</span></li>
                <li>input = '[2,7,11,15]\n9'</li>
                <li>expected_output = '[0,1]'</li>
                <li>is_sample = TRUE</li>
                <li>order_index = 1</li>
                <li>time_limit_ms = 2000</li>
                <li>memory_limit_kb = 262144</li>
            </ul>
        </div>
        <div class="db-table">
            <h3>discussions &mdash; Example</h3>
            <ul>
                <li><span class="pk">id = 789</span></li>
                <li><span class="fk">problem_id = 1</span></li>
                <li><span class="fk">user_id = 42</span></li>
                <li>title = 'O(n) HashMap approach - Java'</li>
                <li>content = '## Approach\nUse a HashMap to store...'</li>
                <li>upvotes = 245</li>
                <li>downvotes = 3</li>
                <li>comment_count = 18</li>
                <li>created_at = '2025-06-02 16:45:00'</li>
            </ul>
        </div>
    </div>
</div>

<!-- ============ 4. SERVICE LLD ============ -->

<!-- ============ 7. CAPACITY ESTIMATION ============ -->
<div class="section theme-deepblue">
    <div class="section-title"><span class="section-num">7</span>Capacity Estimation</div>
    <div class="assumption-box">
        <h4>Assumptions</h4>
        <div class="assumption-row"><span class="calc-label">Daily Active Users (DAU)</span><span class="calc-value">500K</span></div>
        <div class="assumption-row"><span class="calc-label">Avg submissions per user/day</span><span class="calc-value">5</span></div>
        <div class="assumption-row"><span class="calc-label">Weekly contests</span><span class="calc-value">2 (15K participants each)</span></div>
        <div class="assumption-row"><span class="calc-label">Avg code size per submission</span><span class="calc-value">2 KB</span></div>
        <div class="assumption-row"><span class="calc-label">Avg test cases per problem</span><span class="calc-value">50</span></div>
        <div class="assumption-row"><span class="calc-label">Avg execution time per test case</span><span class="calc-value">200 ms</span></div>
    </div>
    <div class="cap-grid">
        <div class="cap-card">
            <h4>Submissions per Day</h4>
            <div class="calc-row"><span class="calc-label">500K users &times; 5 subs</span><span class="calc-value">2.5M/day</span></div>
            <div class="calc-row"><span class="calc-label">Per second (avg)</span><span class="calc-value">~29 QPS</span></div>
            <div class="calc-row"><span class="calc-label">Peak (contest + normal)</span><span class="calc-value">~500 QPS</span></div>
            <div class="calc-result"><span class="calc-label">Judge Workers Needed (peak)</span><span class="calc-value">~50 containers</span></div>
        </div>
        <div class="cap-card">
            <h4>Storage (Submissions)</h4>
            <div class="calc-row"><span class="calc-label">Code: 2.5M &times; 2 KB</span><span class="calc-value">5 GB/day</span></div>
            <div class="calc-row"><span class="calc-label">Metadata per submission</span><span class="calc-value">~500 bytes</span></div>
            <div class="calc-row"><span class="calc-label">Total per day</span><span class="calc-value">~6.25 GB/day</span></div>
            <div class="calc-result"><span class="calc-label">Per Year</span><span class="calc-value">~2.28 TB</span></div>
        </div>
        <div class="cap-card">
            <h4>Execution Compute</h4>
            <div class="calc-row"><span class="calc-label">Subs/day &times; 50 test cases</span><span class="calc-value">125M executions</span></div>
            <div class="calc-row"><span class="calc-label">Avg 200ms per execution</span><span class="calc-value">25M sec CPU/day</span></div>
            <div class="calc-row"><span class="calc-label">CPU cores needed (avg)</span><span class="calc-value">~289 cores</span></div>
            <div class="calc-result"><span class="calc-label">Peak (10x)</span><span class="calc-value">~2,890 cores</span></div>
        </div>
        <div class="cap-card">
            <h4>API Read Traffic</h4>
            <div class="calc-row"><span class="calc-label">Problem page views</span><span class="calc-value">~5M/day</span></div>
            <div class="calc-row"><span class="calc-label">Leaderboard queries</span><span class="calc-value">~2M/day</span></div>
            <div class="calc-row"><span class="calc-label">Discussion page views</span><span class="calc-value">~3M/day</span></div>
            <div class="calc-result"><span class="calc-label">Read QPS (avg)</span><span class="calc-value">~116 QPS</span></div>
        </div>
        <div class="cap-card">
            <h4>CPU / Server Estimation</h4>
            <div class="calc-row"><span class="calc-label">API servers (Read + Write)</span><span class="calc-value">~150 QPS total</span></div>
            <div class="calc-row"><span class="calc-label">Each API server handles</span><span class="calc-value">~2K QPS</span></div>
            <div class="calc-result"><span class="calc-label">API Servers Needed</span><span class="calc-value">~3 servers</span></div>
            <div class="calc-row" style="margin-top:6px"><span class="calc-label">Judge Worker CPU (peak)</span><span class="calc-value">~2,890 cores</span></div>
            <div class="calc-row"><span class="calc-label">Each worker = 1 core</span><span class="calc-value"></span></div>
            <div class="calc-result"><span class="calc-label">Judge Worker Machines (peak)</span><span class="calc-value">~360 machines (8 cores each)</span></div>
            <div class="calc-row" style="margin-top:6px"><span class="calc-label">Normal load workers</span><span class="calc-value">~50 containers</span></div>
            <div class="calc-row"><span class="calc-label">Redis (leaderboard + cache)</span><span class="calc-value">3 nodes</span></div>
            <div class="calc-row"><span class="calc-label">DB Read Replicas</span><span class="calc-value">2-3 replicas</span></div>
        </div>
    </div>
</div>

<!-- ============ 10. BOTTLENECKS ============ -->

<!-- ============ 8. KEY ARCHITECTURE ============ -->
<div class="section theme-blue">
    <div class="section-title"><span class="section-num">8</span>Key Architecture &mdash; Code Execution &amp; Judge System</div>

    <div class="sub-heading" style="color:#4fc3f7;border-color:#4fc3f7">Code Execution Sandbox (Docker-based)</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="ann">@Service</span>
<span class="kw">public class</span> <span class="tp">DockerSandboxService</span> {

    <span class="cm">// Each submission runs in an isolated Docker container</span>
    <span class="kw">private static final</span> Map&lt;Language, String&gt; <span class="fn">DOCKER_IMAGES</span> = Map.of(
        Language.JAVA,       <span class="st">"leetcode-judge:java17"</span>,
        Language.PYTHON,     <span class="st">"leetcode-judge:python3.11"</span>,
        Language.CPP,        <span class="st">"leetcode-judge:gcc13"</span>,
        Language.JAVASCRIPT, <span class="st">"leetcode-judge:node20"</span>
    );

    <span class="kw">public</span> ExecutionResult <span class="fn">executeInSandbox</span>(String code, Language lang, String input,
                                            <span class="tp">int</span> timeLimitMs, <span class="tp">int</span> memoryLimitKb) {
        String containerId = dockerClient.<span class="fn">createContainer</span>(
            CreateContainerCmd.builder()
                .image(DOCKER_IMAGES.get(lang))
                .memory(memoryLimitKb * 1024L)       <span class="cm">// convert to bytes</span>
                .cpuQuota(100000L)                    <span class="cm">// 1 CPU core limit</span>
                .networkDisabled(<span class="kw">true</span>)               <span class="cm">// no network access</span>
                .readonlyRootfs(<span class="kw">true</span>)                <span class="cm">// immutable filesystem</span>
                .pidsLimit(50L)                       <span class="cm">// prevent fork bombs</span>
                .build()
        );

        <span class="kw">try</span> {
            dockerClient.<span class="fn">startContainer</span>(containerId);
            dockerClient.<span class="fn">copyToContainer</span>(containerId, code, <span class="st">"/app/solution"</span>);
            dockerClient.<span class="fn">copyToContainer</span>(containerId, input, <span class="st">"/app/input.txt"</span>);

            ExecResult result = dockerClient.<span class="fn">execWithTimeout</span>(
                containerId, getRunCommand(lang), Duration.ofMillis(timeLimitMs)
            );

            <span class="kw">return new</span> ExecutionResult(result.stdout(), result.stderr(),
                result.exitCode(), result.executionTimeMs(), result.memoryUsedKb());
        } <span class="kw">finally</span> {
            dockerClient.<span class="fn">removeContainer</span>(containerId, <span class="kw">true</span>);  <span class="cm">// force remove</span>
        }
    }
}
    </pre></div>

    <div class="sub-heading" style="color:#4fc3f7;border-color:#4fc3f7">Judge System &mdash; Queue-based Submission Pipeline</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="ann">@Service</span>
<span class="kw">public class</span> <span class="tp">JudgeOrchestrator</span> {

    <span class="kw">private final</span> RabbitTemplate <span class="fn">rabbitTemplate</span>;
    <span class="kw">private final</span> SubmissionRepository <span class="fn">submissionRepo</span>;
    <span class="kw">private final</span> DockerSandboxService <span class="fn">sandbox</span>;
    <span class="kw">private final</span> TestCaseRepository <span class="fn">testCaseRepo</span>;

    <span class="cm">// Producer: enqueue submission for async processing</span>
    <span class="kw">public</span> Submission <span class="fn">submitForJudging</span>(SubmitRequest req) {
        Submission sub = Submission.builder()
            .userId(req.getUserId()).problemId(req.getProblemId())
            .code(req.getCode()).language(req.getLanguage())
            .verdict(Verdict.PENDING).build();
        submissionRepo.<span class="fn">save</span>(sub);

        rabbitTemplate.<span class="fn">convertAndSend</span>(<span class="st">"judge.exchange"</span>, <span class="st">"judge.submit"</span>, sub.getId());
        <span class="kw">return</span> sub;
    }

    <span class="cm">// Consumer: process submission from queue</span>
    <span class="ann">@RabbitListener</span>(queues = <span class="st">"judge.queue"</span>)
    <span class="kw">public void</span> <span class="fn">processSubmission</span>(Long submissionId) {
        Submission sub = submissionRepo.<span class="fn">findById</span>(submissionId).orElseThrow();
        List&lt;TestCase&gt; testCases = testCaseRepo.<span class="fn">findByProblemId</span>(sub.getProblemId());

        <span class="cm">// Step 1: Compile</span>
        CompileResult compileResult = sandbox.<span class="fn">compile</span>(sub.getCode(), sub.getLanguage());
        <span class="kw">if</span> (!compileResult.isSuccess()) {
            sub.setVerdict(Verdict.COMPILE_ERROR);
            sub.setErrorOutput(compileResult.getError());
            submissionRepo.<span class="fn">save</span>(sub); <span class="kw">return</span>;
        }

        <span class="cm">// Step 2: Run against each test case</span>
        <span class="tp">int</span> passed = 0;
        <span class="kw">for</span> (TestCase tc : testCases) {
            ExecutionResult result = sandbox.<span class="fn">executeInSandbox</span>(
                sub.getCode(), sub.getLanguage(), tc.getInput(),
                tc.getTimeLimitMs(), tc.getMemoryLimitKb()
            );

            <span class="kw">if</span> (result.isTimedOut()) {
                sub.setVerdict(Verdict.TIME_LIMIT_EXCEEDED); <span class="kw">break</span>;
            }
            <span class="kw">if</span> (result.isMemoryExceeded()) {
                sub.setVerdict(Verdict.MEMORY_LIMIT_EXCEEDED); <span class="kw">break</span>;
            }
            <span class="kw">if</span> (result.getExitCode() != 0) {
                sub.setVerdict(Verdict.RUNTIME_ERROR);
                sub.setErrorOutput(result.getStderr()); <span class="kw">break</span>;
            }
            <span class="kw">if</span> (!result.getStdout().trim().equals(tc.getExpectedOutput().trim())) {
                sub.setVerdict(Verdict.WRONG_ANSWER); <span class="kw">break</span>;
            }
            passed++;
        }

        <span class="kw">if</span> (passed == testCases.size()) sub.setVerdict(Verdict.ACCEPTED);
        sub.setPassedTestCases(passed);
        sub.setTotalTestCases(testCases.size());
        submissionRepo.<span class="fn">save</span>(sub);
    }
}
    </pre></div>

    <div class="sub-heading" style="color:#4fc3f7;border-color:#4fc3f7">Submission Pipeline Flow</div>
    <div class="flow-container">
        <div class="flow-box flow-green">User submits code via POST /api/submissions</div>
        <div class="flow-arrow arrow-green"></div>
        <div class="flow-box flow-blue">SubmissionService saves to DB (status=QUEUED)</div>
        <div class="flow-arrow arrow-blue"></div>
        <div class="flow-box flow-purple">Publish to RabbitMQ (judge.exchange)</div>
        <div class="flow-arrow arrow-purple"></div>
        <div class="flow-box flow-orange">JudgeWorker picks up from queue</div>
        <div class="flow-arrow arrow-orange"></div>
        <div class="flow-box flow-teal">Compile code in Docker sandbox</div>
        <div class="flow-arrow arrow-teal"></div>
        <div class="flow-box flow-yellow">Run against all test cases sequentially</div>
        <div class="flow-arrow arrow-orange"></div>
        <div class="flow-box flow-pink">Update verdict &amp; notify user via WebSocket</div>
    </div>

    <div class="two-col">
        <div style="background:rgba(79,195,247,.06);border:1px solid rgba(79,195,247,.15);border-radius:12px;padding:16px">
            <strong style="color:#4fc3f7">Why Queue-based?</strong>
            <p style="color:#b0bec5;font-size:.85em;margin-top:6px">Code execution is CPU-intensive. A queue decouples submission from evaluation, allows horizontal scaling of judge workers, and prevents server overload during contests when 10K+ users submit simultaneously.</p>
        </div>
        <div style="background:rgba(79,195,247,.06);border:1px solid rgba(79,195,247,.15);border-radius:12px;padding:16px">
            <strong style="color:#4fc3f7">Why Docker Sandbox?</strong>
            <p style="color:#b0bec5;font-size:.85em;margin-top:6px">User code is untrusted. Docker provides process isolation, resource limits (CPU, memory, PIDs), network isolation, and filesystem isolation. Each submission runs in a fresh container that is destroyed after execution.</p>
        </div>
    </div>
</div>

<!-- ============ 7. DESIGN PATTERNS ============ -->

<!-- ============ 9. DESIGN PATTERNS ============ -->
<div class="section theme-cyan">
    <div class="section-title"><span class="section-num">9</span>Design Patterns</div>
    <div class="pattern-grid">
        <div class="pattern-card">
            <div class="pattern-name">Strategy Pattern</div>
            <div class="pattern-use">ICompiler implementations for each language (Java, Python, C++). New languages added without modifying existing code (OCP).</div>
        </div>
        <div class="pattern-card">
            <div class="pattern-name">Factory Pattern</div>
            <div class="pattern-use">CompilerFactory creates the correct compiler based on Language enum. SandboxFactory creates Docker containers with language-specific images.</div>
        </div>
        <div class="pattern-card">
            <div class="pattern-name">Observer Pattern</div>
            <div class="pattern-use">Submission status changes trigger events: update leaderboard, send WebSocket notification, update user stats, refresh acceptance rate.</div>
        </div>
        <div class="pattern-card">
            <div class="pattern-name">Template Method</div>
            <div class="pattern-use">AbstractJudge defines evaluate() flow: compile &rarr; run &rarr; compare. Subclasses override specific steps for special judges (e.g., floating-point comparison).</div>
        </div>
        <div class="pattern-card">
            <div class="pattern-name">Producer-Consumer</div>
            <div class="pattern-use">RabbitMQ queue between SubmissionService (producer) and JudgeWorker (consumer). Allows scaling judge workers independently based on load.</div>
        </div>
        <div class="pattern-card">
            <div class="pattern-name">Builder Pattern</div>
            <div class="pattern-use">Submission.builder() and ContainerConfig.builder() for constructing complex objects with many optional fields cleanly.</div>
        </div>
        <div class="pattern-card">
            <div class="pattern-name">Decorator Pattern</div>
            <div class="pattern-use">Wrapping base JudgeService with CachingJudgeDecorator (caches compilation results) and LoggingJudgeDecorator (audit trail).</div>
        </div>
        <div class="pattern-card">
            <div class="pattern-name">Singleton (Redis Cache)</div>
            <div class="pattern-use">RedisLeaderboardCache as a shared cache for global rankings. Sorted Sets for O(log N) rank queries and real-time leaderboard updates.</div>
        </div>
    </div>
</div>

<!-- ============ 8. SEQUENCE FLOW ============ -->

<!-- ============ 10. SEQUENCE FLOW ============ -->
<div class="section theme-green">
    <div class="section-title"><span class="section-num">10</span>Sequence Flow &mdash; Code Submission</div>
    <div class="flow-container">
        <div class="flow-box flow-green">User clicks "Submit" in code editor</div>
        <div class="flow-arrow arrow-green"></div>
        <div class="flow-box flow-blue">API Gateway validates JWT token</div>
        <div class="flow-arrow arrow-blue"></div>
        <div class="flow-box flow-purple">Rate Limiter checks (5 submissions/min)</div>
        <div class="flow-arrow arrow-purple"></div>
        <div class="flow-box flow-teal">SubmissionController receives request</div>
        <div class="flow-arrow arrow-teal"></div>
        <div class="flow-box flow-orange">SubmissionService saves to DB (QUEUED)</div>
        <div class="flow-arrow arrow-orange"></div>
        <div class="flow-box flow-yellow">Publish submissionId to RabbitMQ</div>
        <div class="flow-arrow arrow-orange"></div>
        <div class="flow-box flow-blue">Return 202 Accepted with submissionId</div>
    </div>
    <div style="text-align:center;color:#78909c;margin:16px 0;font-style:italic">--- Asynchronous boundary ---</div>
    <div class="flow-container">
        <div class="flow-box flow-purple">JudgeWorker dequeues submissionId</div>
        <div class="flow-arrow arrow-purple"></div>
        <div class="flow-box flow-teal">Create Docker container (language-specific)</div>
        <div class="flow-arrow arrow-teal"></div>
        <div class="flow-box flow-orange">Compile code inside sandbox</div>
        <div class="flow-arrow arrow-orange"></div>
        <div class="flow-box flow-green">Run against test cases one-by-one</div>
        <div class="flow-arrow arrow-green"></div>
        <div class="flow-box flow-blue">Compare output, track time &amp; memory</div>
        <div class="flow-arrow arrow-blue"></div>
        <div class="flow-box flow-pink">Update verdict in DB (ACCEPTED / WA / TLE)</div>
        <div class="flow-arrow arrow-red"></div>
        <div class="flow-box flow-yellow">Push result via WebSocket to user</div>
        <div class="flow-arrow arrow-orange"></div>
        <div class="flow-box flow-green">Destroy Docker container</div>
    </div>
</div>

<!-- ============ 9. CAPACITY ESTIMATION ============ -->

<!-- ============ 11. BOTTLENECKS ============ -->
<div class="section theme-red">
    <div class="section-title"><span class="section-num">11</span>Bottlenecks &amp; Solutions</div>
    <div class="bottleneck-grid">
        <div class="bottleneck-item">
            <span class="bottleneck-problem">Contest spike (10K+ simultaneous submissions)</span>
            <span class="bottleneck-arrow">&rarr;</span>
            <span class="bottleneck-solution">Queue-based decoupling + auto-scale judge workers via K8s HPA</span>
        </div>
        <div class="bottleneck-item">
            <span class="bottleneck-problem">Slow code execution blocking server</span>
            <span class="bottleneck-arrow">&rarr;</span>
            <span class="bottleneck-solution">Async processing via RabbitMQ; strict time limits with container kill</span>
        </div>
        <div class="bottleneck-item">
            <span class="bottleneck-problem">Leaderboard hotspot during contests</span>
            <span class="bottleneck-arrow">&rarr;</span>
            <span class="bottleneck-solution">Redis Sorted Set for O(log N) rank queries + 2-sec refresh TTL</span>
        </div>
        <div class="bottleneck-item">
            <span class="bottleneck-problem">Large test case I/O (some problems have MB-sized inputs)</span>
            <span class="bottleneck-arrow">&rarr;</span>
            <span class="bottleneck-solution">Store test cases in S3; stream into container via volume mount</span>
        </div>
        <div class="bottleneck-item">
            <span class="bottleneck-problem">Repeated compilation of same code (re-runs)</span>
            <span class="bottleneck-arrow">&rarr;</span>
            <span class="bottleneck-solution">Cache compiled binaries by code hash (SHA-256) with 10-min TTL</span>
        </div>
        <div class="bottleneck-item">
            <span class="bottleneck-problem">DB write contention on submission table</span>
            <span class="bottleneck-arrow">&rarr;</span>
            <span class="bottleneck-solution">Partition submissions table by month; separate read replicas for queries</span>
        </div>
        <div class="bottleneck-item">
            <span class="bottleneck-problem">Problem listing queries with complex filters</span>
            <span class="bottleneck-arrow">&rarr;</span>
            <span class="bottleneck-solution">Elasticsearch for full-text search + faceted filtering; Redis cache for hot problems</span>
        </div>
    </div>
</div>

<!-- ============ 12. EDGE CASES ============ -->

<!-- ============ 12. EDGE CASES ============ -->
<div class="section theme-amber">
    <div class="section-title"><span class="section-num">12</span>Edge Cases</div>
    <div class="edge-grid">
        <div class="edge-card">
            <h4>Infinite Loop / Fork Bomb</h4>
            <p>Docker container has strict CPU time limit and PID limit (50). Container is force-killed after timeout. Verdict: TIME_LIMIT_EXCEEDED or RUNTIME_ERROR.</p>
        </div>
        <div class="edge-card">
            <h4>Memory Exhaustion</h4>
            <p>Docker --memory flag enforces hard limit. Kernel OOM killer terminates process. Verdict: MEMORY_LIMIT_EXCEEDED. Sandbox tracks peak memory via cgroups.</p>
        </div>
        <div class="edge-card">
            <h4>Trailing Whitespace / Newline Differences</h4>
            <p>Output comparator trims trailing whitespace and normalizes line endings (\\r\\n to \\n). Special judge mode available for floating-point comparison with epsilon tolerance.</p>
        </div>
        <div class="edge-card">
            <h4>Concurrent Contest Submissions</h4>
            <p>Optimistic locking on leaderboard score updates. If two submissions arrive for same user+problem, only the better one counts. Deduplication via Redis SET.</p>
        </div>
        <div class="edge-card">
            <h4>Judge Worker Crash Mid-Execution</h4>
            <p>RabbitMQ manual ACK mode. If worker crashes before ACK, message re-queued. Idempotent processing via submission status check. Dead letter queue for poison messages.</p>
        </div>
        <div class="edge-card">
            <h4>Plagiarism / Duplicate Submissions</h4>
            <p>MOSS (Measure of Software Similarity) integration for contest submissions. Code fingerprinting via AST-based hashing detects near-identical solutions.</p>
        </div>
        <div class="edge-card">
            <h4>Rate Limiting Abuse</h4>
            <p>Sliding window rate limiter: 5 submissions/minute, 30 submissions/hour per user. Contest mode allows burst of 10/min. IP-based limiting for unauthenticated "Run" requests.</p>
        </div>
        <div class="edge-card">
            <h4>Contest Starts with Clock Skew</h4>
            <p>Server-side timestamps only (never trust client clock). NTP sync across all servers. Contest start/end enforced server-side with 1-second grace period.</p>
        </div>
    </div>
</div>

<!-- ============ 13. SECURITY ============ -->

<!-- ============ 13. SECURITY ============ -->
<div class="section theme-lime">
    <div class="section-title"><span class="section-num">13</span>Security &amp; Sandboxing</div>
    <div class="security-grid">
        <div class="security-item">
            <span class="shield">&#128737;</span>
            <div>Docker Network Isolation<div class="security-detail">Containers run with --network=none. User code cannot make HTTP calls, DNS lookups, or access any external services.</div></div>
        </div>
        <div class="security-item">
            <span class="shield">&#128737;</span>
            <div>Filesystem Isolation<div class="security-detail">Read-only root filesystem. Code writes only to /tmp (tmpfs with size limit). Cannot access host filesystem or other containers.</div></div>
        </div>
        <div class="security-item">
            <span class="shield">&#128737;</span>
            <div>Code Injection Prevention<div class="security-detail">Code runs inside container with non-root user. Seccomp profile blocks dangerous syscalls (ptrace, mount, reboot). AppArmor profile restricts file access.</div></div>
        </div>
        <div class="security-item">
            <span class="shield">&#128737;</span>
            <div>Resource Limits (cgroups)<div class="security-detail">CPU: 1 core, Memory: 256MB, PIDs: 50, Disk I/O: throttled. Prevents resource abuse and noisy neighbor problems on shared judge servers.</div></div>
        </div>
        <div class="security-item">
            <span class="shield">&#128737;</span>
            <div>JWT Authentication<div class="security-detail">Stateless JWT with RS256 signing. Short-lived access tokens (15 min) + refresh tokens (7 days). Role-based access control for admin endpoints.</div></div>
        </div>
        <div class="security-item">
            <span class="shield">&#128737;</span>
            <div>Input Sanitization<div class="security-detail">Problem descriptions sanitized for XSS. Discussion posts rendered through DOMPurify. Code stored as-is but never executed outside sandbox.</div></div>
        </div>
        <div class="security-item">
            <span class="shield">&#128737;</span>
            <div>Anti-Cheating Measures<div class="security-detail">Contest submissions fingerprinted. IP tracking for multiple accounts. Tab-focus-loss detection on client side. Rate limiting per user and IP.</div></div>
        </div>
        <div class="security-item">
            <span class="shield">&#128737;</span>
            <div>Secrets Management<div class="security-detail">Test case answers never exposed to client. Hidden test cases stored encrypted in S3. Only judge workers have decryption keys via Vault.</div></div>
        </div>
    </div>
</div>

<!-- ============ 14. UML CLASS DIAGRAM ============ -->

<!-- ============ 14. UML CLASS DIAGRAM ============ -->
<div class="section theme-deepblue">
    <div class="section-title"><span class="section-num">14</span>UML Class Diagram</div>
    <div class="uml-diagram">

        <div class="uml-section-label">Entity Classes</div>
        <div class="uml-grid">
            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;entity&raquo;</span>User</div>
                <div class="uml-attributes">
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">id</span><span class="uml-type">Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">username</span><span class="uml-type">String</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">email</span><span class="uml-type">String</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">rating</span><span class="uml-type">int</span></div>
                </div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getSubmissions()</span><span class="uml-type">List&lt;Submission&gt;</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">updateRating()</span><span class="uml-type">void</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getSolvedCount()</span><span class="uml-type">int</span></div>
                </div>
            </div>

            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;entity&raquo;</span>Problem</div>
                <div class="uml-attributes">
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">id</span><span class="uml-type">Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">title</span><span class="uml-type">String</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">description</span><span class="uml-type">String</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">difficulty</span><span class="uml-type">Difficulty</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">acceptRate</span><span class="uml-type">double</span></div>
                </div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getTestCases()</span><span class="uml-type">List&lt;TestCase&gt;</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getSubmissions()</span><span class="uml-type">List&lt;Submission&gt;</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">updateAcceptRate()</span><span class="uml-type">void</span></div>
                </div>
            </div>

            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;entity&raquo;</span>Submission</div>
                <div class="uml-attributes">
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">id</span><span class="uml-type">Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">userId</span><span class="uml-type">Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">problemId</span><span class="uml-type">Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">code</span><span class="uml-type">String</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">language</span><span class="uml-type">ProgrammingLanguage</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">status</span><span class="uml-type">SubmissionStatus</span></div>
                </div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getRuntime()</span><span class="uml-type">int</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getMemory()</span><span class="uml-type">int</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">isAccepted()</span><span class="uml-type">boolean</span></div>
                </div>
            </div>

            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;entity&raquo;</span>TestCase</div>
                <div class="uml-attributes">
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">id</span><span class="uml-type">Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">problemId</span><span class="uml-type">Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">input</span><span class="uml-type">String</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">expectedOutput</span><span class="uml-type">String</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">isHidden</span><span class="uml-type">boolean</span></div>
                </div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">validate()</span><span class="uml-type">boolean</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">compare()</span><span class="uml-type">VerdictType</span></div>
                </div>
            </div>

            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;entity&raquo;</span>Discussion</div>
                <div class="uml-attributes">
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">id</span><span class="uml-type">Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">userId</span><span class="uml-type">Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">problemId</span><span class="uml-type">Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">title</span><span class="uml-type">String</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">content</span><span class="uml-type">String</span></div>
                </div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getReplies()</span><span class="uml-type">List&lt;Discussion&gt;</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getVoteCount()</span><span class="uml-type">int</span></div>
                </div>
            </div>

            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;entity&raquo;</span>Contest</div>
                <div class="uml-attributes">
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">id</span><span class="uml-type">Long</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">title</span><span class="uml-type">String</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">startTime</span><span class="uml-type">LocalDateTime</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">endTime</span><span class="uml-type">LocalDateTime</span></div>
                    <div class="uml-attr"><span class="uml-vis">-</span><span class="uml-name">duration</span><span class="uml-type">int</span></div>
                </div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getProblems()</span><span class="uml-type">List&lt;Problem&gt;</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getLeaderboard()</span><span class="uml-type">List&lt;User&gt;</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">isActive()</span><span class="uml-type">boolean</span></div>
                </div>
            </div>
        </div>

        <div class="uml-section-label">Enums</div>
        <div class="uml-grid">
            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;enum&raquo;</span>Difficulty</div>
                <div class="uml-attributes">
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">EASY</span></div>
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">MEDIUM</span></div>
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">HARD</span></div>
                </div>
            </div>
            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;enum&raquo;</span>ProgrammingLanguage</div>
                <div class="uml-attributes">
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">JAVA</span></div>
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">PYTHON</span></div>
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">CPP</span></div>
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">JAVASCRIPT</span></div>
                </div>
            </div>
            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;enum&raquo;</span>SubmissionStatus</div>
                <div class="uml-attributes">
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">PENDING</span></div>
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">RUNNING</span></div>
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">ACCEPTED</span></div>
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">WRONG_ANSWER</span></div>
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">TLE</span></div>
                </div>
            </div>
            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;enum&raquo;</span>VerdictType</div>
                <div class="uml-attributes">
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">PASS</span></div>
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">FAIL</span></div>
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">RUNTIME_ERROR</span></div>
                    <div class="uml-attr"><span class="uml-vis">+</span><span class="uml-name">COMPILATION_ERROR</span></div>
                </div>
            </div>
        </div>

        <div class="uml-section-label">Service Classes</div>
        <div class="uml-grid">
            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;service&raquo;</span>ProblemService</div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getProblems()</span><span class="uml-type">List&lt;Problem&gt;</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">filterByDifficulty()</span><span class="uml-type">List&lt;Problem&gt;</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getProblemById()</span><span class="uml-type">Problem</span></div>
                </div>
            </div>
            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;service&raquo;</span>CodeExecutionService</div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">execute()</span><span class="uml-type">ExecutionResult</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">runInSandbox()</span><span class="uml-type">String</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">validateOutput()</span><span class="uml-type">VerdictType</span></div>
                </div>
            </div>
            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;service&raquo;</span>SubmissionService</div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">submit()</span><span class="uml-type">Submission</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getHistory()</span><span class="uml-type">List&lt;Submission&gt;</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getStatus()</span><span class="uml-type">SubmissionStatus</span></div>
                </div>
            </div>
            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;service&raquo;</span>DiscussionService</div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">createPost()</span><span class="uml-type">Discussion</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getByProblem()</span><span class="uml-type">List&lt;Discussion&gt;</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">vote()</span><span class="uml-type">void</span></div>
                </div>
            </div>
            <div class="uml-class">
                <div class="uml-class-name"><span class="uml-stereotype">&laquo;service&raquo;</span>ContestService</div>
                <div class="uml-methods">
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">createContest()</span><span class="uml-type">Contest</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">registerUser()</span><span class="uml-type">void</span></div>
                    <div class="uml-method"><span class="uml-vis">+</span><span class="uml-name">getLeaderboard()</span><span class="uml-type">List&lt;User&gt;</span></div>
                </div>
            </div>
        </div>

        <div class="uml-relations">
            <h4>Relationships</h4>
            <div class="uml-rel">
                <span class="uml-rel-from">User</span>
                <span class="uml-rel-arrow">1 ────── N</span>
                <span class="uml-rel-to">Submission</span>
                <span class="uml-rel-label">submits</span>
                <span class="uml-rel-type">ONE-TO-MANY</span>
            </div>
            <div class="uml-rel">
                <span class="uml-rel-from">Problem</span>
                <span class="uml-rel-arrow">1 ────── N</span>
                <span class="uml-rel-to">Submission</span>
                <span class="uml-rel-label">receives</span>
                <span class="uml-rel-type">ONE-TO-MANY</span>
            </div>
            <div class="uml-rel">
                <span class="uml-rel-from">Problem</span>
                <span class="uml-rel-arrow">1 ────── N</span>
                <span class="uml-rel-to">TestCase</span>
                <span class="uml-rel-label">has</span>
                <span class="uml-rel-type">ONE-TO-MANY</span>
            </div>
            <div class="uml-rel">
                <span class="uml-rel-from">User</span>
                <span class="uml-rel-arrow">1 ────── N</span>
                <span class="uml-rel-to">Discussion</span>
                <span class="uml-rel-label">creates</span>
                <span class="uml-rel-type">ONE-TO-MANY</span>
            </div>
            <div class="uml-rel">
                <span class="uml-rel-from">Contest</span>
                <span class="uml-rel-arrow">1 ────── N</span>
                <span class="uml-rel-to">Problem</span>
                <span class="uml-rel-label">contains</span>
                <span class="uml-rel-type">ONE-TO-MANY</span>
            </div>
        </div>

        <div class="uml-note">
            <strong>Hinglish Explanation:</strong> Yeh UML diagram LeetCode ke main classes dikhata hai &mdash; User Problem solve karta hai through Submission, har Problem ke saath TestCases hote hain jo code validate karte hain, aur Contest me multiple Problems hote hain. CodeExecutionService sandboxed environment me code run karta hai.
        </div>
    </div>
</div>

<!-- ============ 15. INTERVIEW SUMMARY ============ -->

<!-- ============ 15. INTERVIEW SUMMARY ============ -->
<div class="section theme-orange">
    <div class="section-title"><span class="section-num">15</span>Interview Summary</div>
    <div class="summary-grid">
        <div class="summary-card sc-1"><h4>Async Judge Pipeline</h4><p>Queue-based code execution with RabbitMQ</p></div>
        <div class="summary-card sc-2"><h4>Docker Sandboxing</h4><p>Isolated execution with resource limits</p></div>
        <div class="summary-card sc-3"><h4>Strategy Pattern</h4><p>Language-specific compilers via interface</p></div>
        <div class="summary-card sc-4"><h4>Redis Leaderboard</h4><p>Sorted Sets for O(log N) rankings</p></div>
        <div class="summary-card sc-1"><h4>Rate Limiting</h4><p>Sliding window per user &amp; IP</p></div>
        <div class="summary-card sc-2"><h4>Contest System</h4><p>Timed events with penalty scoring</p></div>
        <div class="summary-card sc-3"><h4>Observer Pattern</h4><p>Event-driven status updates &amp; notifications</p></div>
        <div class="summary-card sc-4"><h4>SOLID Principles</h4><p>ISP, OCP, DIP throughout the design</p></div>
        <div class="summary-card sc-1"><h4>Horizontal Scaling</h4><p>Stateless workers auto-scaled via K8s</p></div>
        <div class="summary-card sc-2"><h4>Security First</h4><p>Seccomp, AppArmor, network isolation</p></div>
        <div class="summary-card sc-3"><h4>Capacity Planning</h4><p>500K DAU, 2.5M subs/day, 50 workers</p></div>
        <div class="summary-card sc-4"><h4>Producer-Consumer</h4><p>Decoupled submission &amp; evaluation</p></div>
    </div>
    <p style="text-align:center;margin-top:24px;color:#78909c;font-size:1em">
        Complete LeetCode Online Judge LLD for <strong style="color:#ffab40">Java Spring Boot</strong> interviews &mdash; covers SOLID, Design Patterns, Sandboxing, Security &amp; Scalability.
    </p>
</div>

</div>
<div class="footer">LeetCode Online Judge LLD</div>
</div>
<!-- END LEETCODE LLD -->

<!-- ==================== NOTIFICATION SYSTEM ==================== -->
`
}
