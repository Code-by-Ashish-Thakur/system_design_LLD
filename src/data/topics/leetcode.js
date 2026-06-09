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
        <div class="req-pill"><span class="num">1</span> User Authentication (OAuth + Email)</div>
        <div class="req-pill"><span class="num">2</span> Problem Listing &amp; Filtering</div>
        <div class="req-pill"><span class="num">3</span> Code Submission &amp; Execution</div>
        <div class="req-pill"><span class="num">4</span> Online Judge (Verdict System)</div>
        <div class="req-pill"><span class="num">5</span> Leaderboard &amp; Rankings</div>
        <div class="req-pill"><span class="num">6</span> Contest Mode (Timed Events)</div>
        <div class="req-pill"><span class="num">7</span> Discussion Forum</div>
        <div class="req-pill"><span class="num">8</span> Solution &amp; Editorial</div>
        <div class="req-pill"><span class="num">9</span> User Profile &amp; Stats</div>
        <div class="req-pill"><span class="num">10</span> Multi-Language Support</div>
    </div>
</div>

<!-- ============ 2. ENUMS ============ -->
<div class="section theme-purple">
    <div class="section-title"><span class="section-num">2</span>Enums</div>
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

<!-- ============ 3. CLASS DESIGN ============ -->
<div class="section theme-orange">
    <div class="section-title"><span class="section-num">3</span>Class Design</div>

    <div class="sub-heading" style="color:#ffab40;border-color:#ffab40">Problem Entity</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="ann">@Entity</span>
<span class="ann">@Table</span>(name = <span class="st">"problems"</span>)
<span class="kw">public class</span> <span class="tp">Problem</span> {
    <span class="ann">@Id</span> <span class="ann">@GeneratedValue</span>(strategy = GenerationType.IDENTITY)
    <span class="kw">private</span> Long <span class="fn">id</span>;

    <span class="ann">@Column</span>(unique = <span class="kw">true</span>, nullable = <span class="kw">false</span>)
    <span class="kw">private</span> String <span class="fn">title</span>;

    <span class="ann">@Column</span>(unique = <span class="kw">true</span>, nullable = <span class="kw">false</span>)
    <span class="kw">private</span> String <span class="fn">slug</span>;

    <span class="ann">@Column</span>(columnDefinition = <span class="st">"TEXT"</span>)
    <span class="kw">private</span> String <span class="fn">description</span>;

    <span class="ann">@Enumerated</span>(EnumType.STRING)
    <span class="kw">private</span> Difficulty <span class="fn">difficulty</span>;

    <span class="ann">@ElementCollection</span>
    <span class="kw">private</span> List&lt;String&gt; <span class="fn">categoryTags</span>;

    <span class="kw">private</span> Double <span class="fn">acceptanceRate</span>;
    <span class="kw">private</span> Long <span class="fn">totalSubmissions</span>;
    <span class="kw">private</span> Long <span class="fn">totalAccepted</span>;
    <span class="kw">private</span> Boolean <span class="fn">isPremium</span>;

    <span class="ann">@OneToMany</span>(mappedBy = <span class="st">"problem"</span>, cascade = CascadeType.ALL)
    <span class="kw">private</span> List&lt;TestCase&gt; <span class="fn">testCases</span>;

    <span class="ann">@CreationTimestamp</span>
    <span class="kw">private</span> LocalDateTime <span class="fn">createdAt</span>;
}
    </pre></div>

    <div class="sub-heading" style="color:#ffab40;border-color:#ffab40">Submission Entity</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="ann">@Entity</span>
<span class="ann">@Table</span>(name = <span class="st">"submissions"</span>, indexes = {
    <span class="ann">@Index</span>(name = <span class="st">"idx_user_problem"</span>, columnList = <span class="st">"userId, problemId"</span>),
    <span class="ann">@Index</span>(name = <span class="st">"idx_contest"</span>, columnList = <span class="st">"contestId, userId"</span>)
})
<span class="kw">public class</span> <span class="tp">Submission</span> {
    <span class="ann">@Id</span> <span class="ann">@GeneratedValue</span>(strategy = GenerationType.IDENTITY)
    <span class="kw">private</span> Long <span class="fn">id</span>;

    <span class="kw">private</span> Long <span class="fn">userId</span>;
    <span class="kw">private</span> Long <span class="fn">problemId</span>;

    <span class="ann">@Enumerated</span>(EnumType.STRING)
    <span class="kw">private</span> Language <span class="fn">language</span>;

    <span class="ann">@Column</span>(columnDefinition = <span class="st">"TEXT"</span>)
    <span class="kw">private</span> String <span class="fn">code</span>;

    <span class="ann">@Enumerated</span>(EnumType.STRING)
    <span class="kw">private</span> Verdict <span class="fn">verdict</span>;

    <span class="kw">private</span> Integer <span class="fn">runtime</span>;       <span class="cm">// in ms</span>
    <span class="kw">private</span> Integer <span class="fn">memory</span>;        <span class="cm">// in KB</span>
    <span class="kw">private</span> Integer <span class="fn">passedTestCases</span>;
    <span class="kw">private</span> Integer <span class="fn">totalTestCases</span>;

    <span class="ann">@Column</span>(columnDefinition = <span class="st">"TEXT"</span>)
    <span class="kw">private</span> String <span class="fn">errorOutput</span>;

    <span class="kw">private</span> Long <span class="fn">contestId</span>;        <span class="cm">// nullable for non-contest</span>

    <span class="ann">@CreationTimestamp</span>
    <span class="kw">private</span> LocalDateTime <span class="fn">submittedAt</span>;
}
    </pre></div>

    <div class="sub-heading" style="color:#ffab40;border-color:#ffab40">Contest Entity</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="ann">@Entity</span>
<span class="ann">@Table</span>(name = <span class="st">"contests"</span>)
<span class="kw">public class</span> <span class="tp">Contest</span> {
    <span class="ann">@Id</span> <span class="ann">@GeneratedValue</span>(strategy = GenerationType.IDENTITY)
    <span class="kw">private</span> Long <span class="fn">id</span>;

    <span class="kw">private</span> String <span class="fn">title</span>;

    <span class="ann">@Enumerated</span>(EnumType.STRING)
    <span class="kw">private</span> ContestType <span class="fn">type</span>;

    <span class="kw">private</span> LocalDateTime <span class="fn">startTime</span>;
    <span class="kw">private</span> LocalDateTime <span class="fn">endTime</span>;
    <span class="kw">private</span> Integer <span class="fn">duration</span>;     <span class="cm">// minutes</span>

    <span class="ann">@ElementCollection</span>
    <span class="kw">private</span> List&lt;Long&gt; <span class="fn">problemIds</span>;

    <span class="ann">@Enumerated</span>(EnumType.STRING)
    <span class="kw">private</span> ContestStatus <span class="fn">status</span>;

    <span class="ann">@CreationTimestamp</span>
    <span class="kw">private</span> LocalDateTime <span class="fn">createdAt</span>;
}
    </pre></div>
</div>

<!-- ============ 4. DATABASE SCHEMA ============ -->
<div class="section theme-pink">
    <div class="section-title"><span class="section-num">4</span>Database Schema</div>

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

<!-- ============ 5. SERVICE LLD ============ -->
<div class="section theme-yellow">
    <div class="section-title"><span class="section-num">5</span>Service LLD</div>
    <div class="service-grid">
        <div class="service-card">
            <h3>ProblemService</h3>
            <p class="svc-desc">Coding problems ko manage karta hai &mdash; create, fetch, filter aur acceptance rate update karta hai</p>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">1</span> createProblem(CreateProblemRequest)</div>
                <div class="method-return">Returns: <code>Problem</code></div>
                <div class="params-title">Parameters (CreateProblemRequest):</div>
                <div class="param-row"><span class="param-name">title</span><span class="param-type">String</span></div>
                <div class="param-row"><span class="param-name">slug</span><span class="param-type">String</span></div>
                <div class="param-row"><span class="param-name">description</span><span class="param-type">String</span></div>
                <div class="param-row"><span class="param-name">difficulty</span><span class="param-type">Difficulty</span></div>
                <div class="param-row"><span class="param-name">categoryTags</span><span class="param-type">List&lt;String&gt;</span></div>
                <div class="param-row"><span class="param-name">constraints</span><span class="param-type">String</span></div>
                <div class="param-row"><span class="param-name">starterCode</span><span class="param-type">Map&lt;Language, String&gt;</span></div>
                <div class="param-row"><span class="param-name">isPremium</span><span class="param-type">Boolean</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">2</span> getProblemBySlug(String)</div>
                <div class="method-return">Returns: <code>Problem</code></div>
                <div class="params-title">Parameters:</div>
                <div class="param-row"><span class="param-name">slug</span><span class="param-type">String</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">3</span> listProblems(ProblemFilter, Pageable)</div>
                <div class="method-return">Returns: <code>Page&lt;Problem&gt;</code></div>
                <div class="params-title">Parameters (ProblemFilter):</div>
                <div class="param-row"><span class="param-name">difficulty</span><span class="param-type">Difficulty</span></div>
                <div class="param-row"><span class="param-name">tag</span><span class="param-type">String</span></div>
                <div class="param-row"><span class="param-name">searchQuery</span><span class="param-type">String</span></div>
                <div class="param-row"><span class="param-name">isPremium</span><span class="param-type">Boolean</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">4</span> updateAcceptanceRate(Long)</div>
                <div class="method-return">Returns: <code>void</code></div>
                <div class="params-title">Parameters:</div>
                <div class="param-row"><span class="param-name">problemId</span><span class="param-type">Long</span></div>
            </div>
        </div>
        <div class="service-card">
            <h3>SubmissionService</h3>
            <p class="svc-desc">Code submissions handle karta hai &mdash; solution submit karo, test cases run karo, result check karo</p>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">1</span> submit(SubmitRequest)</div>
                <div class="method-return">Returns: <code>Submission</code></div>
                <div class="params-title">Parameters (SubmitRequest):</div>
                <div class="param-row"><span class="param-name">userId</span><span class="param-type">Long</span></div>
                <div class="param-row"><span class="param-name">problemId</span><span class="param-type">Long</span></div>
                <div class="param-row"><span class="param-name">code</span><span class="param-type">String</span></div>
                <div class="param-row"><span class="param-name">language</span><span class="param-type">Language</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">2</span> runCode(RunCodeRequest)</div>
                <div class="method-return">Returns: <code>RunResult</code></div>
                <div class="params-title">Parameters (RunCodeRequest):</div>
                <div class="param-row"><span class="param-name">userId</span><span class="param-type">Long</span></div>
                <div class="param-row"><span class="param-name">problemId</span><span class="param-type">Long</span></div>
                <div class="param-row"><span class="param-name">code</span><span class="param-type">String</span></div>
                <div class="param-row"><span class="param-name">language</span><span class="param-type">Language</span></div>
                <div class="param-row"><span class="param-name">customInput</span><span class="param-type">String</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">3</span> getSubmissionStatus(Long)</div>
                <div class="method-return">Returns: <code>SubmissionStatus</code></div>
                <div class="params-title">Parameters:</div>
                <div class="param-row"><span class="param-name">submissionId</span><span class="param-type">Long</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">4</span> getUserSubmissions(Long, Long)</div>
                <div class="method-return">Returns: <code>List&lt;Submission&gt;</code></div>
                <div class="params-title">Parameters:</div>
                <div class="param-row"><span class="param-name">userId</span><span class="param-type">Long</span></div>
                <div class="param-row"><span class="param-name">problemId</span><span class="param-type">Long</span></div>
            </div>
        </div>
        <div class="service-card">
            <h3>JudgeService</h3>
            <p class="svc-desc">Submitted code ko compile, run aur check karta hai &mdash; har test case ke against expected output match karta hai</p>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">1</span> evaluate(EvaluateRequest)</div>
                <div class="method-return">Returns: <code>JudgeResult</code></div>
                <div class="params-title">Parameters (EvaluateRequest):</div>
                <div class="param-row"><span class="param-name">submission</span><span class="param-type">Submission</span></div>
                <div class="param-row"><span class="param-name">testCases</span><span class="param-type">List&lt;TestCase&gt;</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">2</span> compile(CompileRequest)</div>
                <div class="method-return">Returns: <code>CompileResult</code></div>
                <div class="params-title">Parameters (CompileRequest):</div>
                <div class="param-row"><span class="param-name">code</span><span class="param-type">String</span></div>
                <div class="param-row"><span class="param-name">language</span><span class="param-type">Language</span></div>
                <div class="param-row"><span class="param-name">workDir</span><span class="param-type">String</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">3</span> execute(ExecuteRequest)</div>
                <div class="method-return">Returns: <code>ExecutionResult</code></div>
                <div class="params-title">Parameters (ExecuteRequest):</div>
                <div class="param-row"><span class="param-name">binaryPath</span><span class="param-type">String</span></div>
                <div class="param-row"><span class="param-name">input</span><span class="param-type">String</span></div>
                <div class="param-row"><span class="param-name">timeLimitMs</span><span class="param-type">int</span></div>
                <div class="param-row"><span class="param-name">memoryLimitKb</span><span class="param-type">int</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">4</span> compareOutput(String, String)</div>
                <div class="method-return">Returns: <code>boolean</code></div>
                <div class="params-title">Parameters:</div>
                <div class="param-row"><span class="param-name">actualOutput</span><span class="param-type">String</span></div>
                <div class="param-row"><span class="param-name">expectedOutput</span><span class="param-type">String</span></div>
            </div>
        </div>
        <div class="service-card">
            <h3>ContestService</h3>
            <p class="svc-desc">Coding contests manage karta hai &mdash; contest create karo, users register karo, scores track karo aur rating update karo</p>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">1</span> createContest(CreateContestRequest)</div>
                <div class="method-return">Returns: <code>Contest</code></div>
                <div class="params-title">Parameters (CreateContestRequest):</div>
                <div class="param-row"><span class="param-name">title</span><span class="param-type">String</span></div>
                <div class="param-row"><span class="param-name">type</span><span class="param-type">ContestType</span></div>
                <div class="param-row"><span class="param-name">startTime</span><span class="param-type">LocalDateTime</span></div>
                <div class="param-row"><span class="param-name">duration</span><span class="param-type">Integer</span></div>
                <div class="param-row"><span class="param-name">problemIds</span><span class="param-type">List&lt;Long&gt;</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">2</span> registerUser(Long, Long)</div>
                <div class="method-return">Returns: <code>void</code></div>
                <div class="params-title">Parameters:</div>
                <div class="param-row"><span class="param-name">contestId</span><span class="param-type">Long</span></div>
                <div class="param-row"><span class="param-name">userId</span><span class="param-type">Long</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">3</span> getLeaderboard(Long, Pageable)</div>
                <div class="method-return">Returns: <code>Page&lt;LeaderboardEntry&gt;</code></div>
                <div class="params-title">Parameters:</div>
                <div class="param-row"><span class="param-name">contestId</span><span class="param-type">Long</span></div>
                <div class="param-row"><span class="param-name">pageable</span><span class="param-type">Pageable</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">4</span> calculateRatings(Long)</div>
                <div class="method-return">Returns: <code>void</code></div>
                <div class="params-title">Parameters:</div>
                <div class="param-row"><span class="param-name">contestId</span><span class="param-type">Long</span></div>
            </div>
        </div>
        <div class="service-card">
            <h3>LeaderboardService</h3>
            <p class="svc-desc">Global rankings aur user ratings track karta hai &mdash; Redis Sorted Set se fast rank query hota hai</p>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">1</span> getGlobalRanking(Pageable)</div>
                <div class="method-return">Returns: <code>Page&lt;RankEntry&gt;</code></div>
                <div class="params-title">Parameters:</div>
                <div class="param-row"><span class="param-name">pageable</span><span class="param-type">Pageable</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">2</span> getUserRank(Long)</div>
                <div class="method-return">Returns: <code>RankEntry</code></div>
                <div class="params-title">Parameters:</div>
                <div class="param-row"><span class="param-name">userId</span><span class="param-type">Long</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">3</span> updateRating(Long, int)</div>
                <div class="method-return">Returns: <code>void</code></div>
                <div class="params-title">Parameters:</div>
                <div class="param-row"><span class="param-name">userId</span><span class="param-type">Long</span></div>
                <div class="param-row"><span class="param-name">delta</span><span class="param-type">int</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">4</span> refreshCache()</div>
                <div class="method-return">Returns: <code>void</code></div>
                <div class="params-title">Parameters:</div>
                <div class="param-row"><span class="param-name">none</span><span class="param-type">&mdash;</span></div>
            </div>
        </div>
        <div class="service-card">
            <h3>DiscussionService</h3>
            <p class="svc-desc">Discussion posts, comments aur upvotes manage karta hai &mdash; har problem ke liye community solutions</p>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">1</span> createPost(CreatePostRequest)</div>
                <div class="method-return">Returns: <code>Discussion</code></div>
                <div class="params-title">Parameters (CreatePostRequest):</div>
                <div class="param-row"><span class="param-name">userId</span><span class="param-type">Long</span></div>
                <div class="param-row"><span class="param-name">problemId</span><span class="param-type">Long</span></div>
                <div class="param-row"><span class="param-name">title</span><span class="param-type">String</span></div>
                <div class="param-row"><span class="param-name">content</span><span class="param-type">String</span></div>
                <div class="param-row"><span class="param-name">tags</span><span class="param-type">List&lt;String&gt;</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">2</span> getDiscussions(Long, Pageable)</div>
                <div class="method-return">Returns: <code>Page&lt;Discussion&gt;</code></div>
                <div class="params-title">Parameters:</div>
                <div class="param-row"><span class="param-name">problemId</span><span class="param-type">Long</span></div>
                <div class="param-row"><span class="param-name">pageable</span><span class="param-type">Pageable</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">3</span> upvote(Long, Long)</div>
                <div class="method-return">Returns: <code>void</code></div>
                <div class="params-title">Parameters:</div>
                <div class="param-row"><span class="param-name">discussionId</span><span class="param-type">Long</span></div>
                <div class="param-row"><span class="param-name">userId</span><span class="param-type">Long</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">4</span> addComment(CommentRequest)</div>
                <div class="method-return">Returns: <code>Comment</code></div>
                <div class="params-title">Parameters (CommentRequest):</div>
                <div class="param-row"><span class="param-name">discussionId</span><span class="param-type">Long</span></div>
                <div class="param-row"><span class="param-name">userId</span><span class="param-type">Long</span></div>
                <div class="param-row"><span class="param-name">content</span><span class="param-type">String</span></div>
            </div>
        </div>
        <div class="service-card">
            <h3>AuthService</h3>
            <p class="svc-desc">User signup, login (email + Google/GitHub OAuth) aur JWT token refresh handle karta hai</p>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">1</span> register(RegisterRequest)</div>
                <div class="method-return">Returns: <code>User</code></div>
                <div class="params-title">Parameters (RegisterRequest):</div>
                <div class="param-row"><span class="param-name">username</span><span class="param-type">String</span></div>
                <div class="param-row"><span class="param-name">email</span><span class="param-type">String</span></div>
                <div class="param-row"><span class="param-name">password</span><span class="param-type">String</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">2</span> login(LoginRequest)</div>
                <div class="method-return">Returns: <code>String (JWT)</code></div>
                <div class="params-title">Parameters (LoginRequest):</div>
                <div class="param-row"><span class="param-name">email</span><span class="param-type">String</span></div>
                <div class="param-row"><span class="param-name">password</span><span class="param-type">String</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">3</span> oauthLogin(OAuthRequest)</div>
                <div class="method-return">Returns: <code>String (JWT)</code></div>
                <div class="params-title">Parameters (OAuthRequest):</div>
                <div class="param-row"><span class="param-name">provider</span><span class="param-type">String</span></div>
                <div class="param-row"><span class="param-name">oauthToken</span><span class="param-type">String</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">4</span> refreshToken(String)</div>
                <div class="method-return">Returns: <code>String (JWT)</code></div>
                <div class="params-title">Parameters:</div>
                <div class="param-row"><span class="param-name">refreshToken</span><span class="param-type">String</span></div>
            </div>
        </div>
        <div class="service-card">
            <h3>SandboxService</h3>
            <p class="svc-desc">Safe Docker containers create karta hai user code run karne ke liye &mdash; network band, memory limit, time limit sab lagta hai</p>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">1</span> createContainer(Language)</div>
                <div class="method-return">Returns: <code>String (containerId)</code></div>
                <div class="params-title">Parameters:</div>
                <div class="param-row"><span class="param-name">language</span><span class="param-type">Language</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">2</span> executeInSandbox(SandboxExecRequest)</div>
                <div class="method-return">Returns: <code>ExecutionResult</code></div>
                <div class="params-title">Parameters (SandboxExecRequest):</div>
                <div class="param-row"><span class="param-name">containerId</span><span class="param-type">String</span></div>
                <div class="param-row"><span class="param-name">code</span><span class="param-type">String</span></div>
                <div class="param-row"><span class="param-name">input</span><span class="param-type">String</span></div>
                <div class="param-row"><span class="param-name">timeLimitMs</span><span class="param-type">int</span></div>
                <div class="param-row"><span class="param-name">memoryLimitKb</span><span class="param-type">int</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">3</span> destroyContainer(String)</div>
                <div class="method-return">Returns: <code>void</code></div>
                <div class="params-title">Parameters:</div>
                <div class="param-row"><span class="param-name">containerId</span><span class="param-type">String</span></div>
            </div>
            <div class="method-block">
                <div class="method-sig"><span class="method-num">4</span> enforceResourceLimits(ResourceLimitRequest)</div>
                <div class="method-return">Returns: <code>void</code></div>
                <div class="params-title">Parameters (ResourceLimitRequest):</div>
                <div class="param-row"><span class="param-name">containerId</span><span class="param-type">String</span></div>
                <div class="param-row"><span class="param-name">cpuCores</span><span class="param-type">int</span></div>
                <div class="param-row"><span class="param-name">memoryLimitKb</span><span class="param-type">int</span></div>
                <div class="param-row"><span class="param-name">timeLimitMs</span><span class="param-type">int</span></div>
                <div class="param-row"><span class="param-name">pidsLimit</span><span class="param-type">int</span></div>
            </div>
        </div>
    </div>
</div>

<!-- ============ 6. APIs ============ -->
<div class="section theme-teal">
    <div class="section-title"><span class="section-num">6</span>API Endpoints</div>
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

<!-- ============ 7. KEY ARCHITECTURE ============ -->
<div class="section theme-blue">
    <div class="section-title"><span class="section-num">7</span>Key Architecture &mdash; Code Execution &amp; Judge System</div>

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

<!-- ============ 8. DESIGN PATTERNS ============ -->
<div class="section theme-cyan">
    <div class="section-title"><span class="section-num">8</span>Design Patterns</div>
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

<!-- ============ 9. SEQUENCE FLOW ============ -->
<div class="section theme-green">
    <div class="section-title"><span class="section-num">9</span>Sequence Flow &mdash; Code Submission</div>
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

<!-- ============ 10. CAPACITY ESTIMATION ============ -->
<div class="section theme-deepblue">
    <div class="section-title"><span class="section-num">10</span>Capacity Estimation</div>
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

<!-- ============ 14. INTERVIEW SUMMARY ============ -->
<div class="section theme-orange">
    <div class="section-title"><span class="section-num">14</span>Interview Summary</div>
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
