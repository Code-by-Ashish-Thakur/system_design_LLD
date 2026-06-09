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

<!-- ============ 2. CORE ENTITIES ============ -->
<div class="section theme-blue">
    <div class="section-title"><span class="section-num">2</span>Core Entities</div>
    <div class="entity-grid">
        <div class="entity-card">
            <h3>Problem</h3>
            <div class="field"><span class="field-name">id</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">title</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">slug</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">description</span><span class="field-type">String (HTML)</span></div>
            <div class="field"><span class="field-name">difficulty</span><span class="field-type">Difficulty</span></div>
            <div class="field"><span class="field-name">categoryTags</span><span class="field-type">List&lt;String&gt;</span></div>
            <div class="field"><span class="field-name">companyTags</span><span class="field-type">List&lt;String&gt;</span></div>
            <div class="field"><span class="field-name">acceptanceRate</span><span class="field-type">Double</span></div>
            <div class="field"><span class="field-name">totalSubmissions</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">totalAccepted</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">constraints</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">starterCode</span><span class="field-type">Map&lt;Language,String&gt;</span></div>
            <div class="field"><span class="field-name">isPremium</span><span class="field-type">Boolean</span></div>
            <div class="field"><span class="field-name">createdAt</span><span class="field-type">LocalDateTime</span></div>
        </div>
        <div class="entity-card">
            <h3>Submission</h3>
            <div class="field"><span class="field-name">id</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">userId</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">problemId</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">language</span><span class="field-type">Language</span></div>
            <div class="field"><span class="field-name">code</span><span class="field-type">String (TEXT)</span></div>
            <div class="field"><span class="field-name">verdict</span><span class="field-type">Verdict</span></div>
            <div class="field"><span class="field-name">runtime</span><span class="field-type">Integer (ms)</span></div>
            <div class="field"><span class="field-name">memory</span><span class="field-type">Integer (KB)</span></div>
            <div class="field"><span class="field-name">passedTestCases</span><span class="field-type">Integer</span></div>
            <div class="field"><span class="field-name">totalTestCases</span><span class="field-type">Integer</span></div>
            <div class="field"><span class="field-name">errorOutput</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">contestId</span><span class="field-type">Long (nullable)</span></div>
            <div class="field"><span class="field-name">submittedAt</span><span class="field-type">LocalDateTime</span></div>
        </div>
        <div class="entity-card">
            <h3>TestCase</h3>
            <div class="field"><span class="field-name">id</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">problemId</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">input</span><span class="field-type">String (TEXT)</span></div>
            <div class="field"><span class="field-name">expectedOutput</span><span class="field-type">String (TEXT)</span></div>
            <div class="field"><span class="field-name">isSample</span><span class="field-type">Boolean</span></div>
            <div class="field"><span class="field-name">orderIndex</span><span class="field-type">Integer</span></div>
            <div class="field"><span class="field-name">timeLimitMs</span><span class="field-type">Integer</span></div>
            <div class="field"><span class="field-name">memoryLimitKb</span><span class="field-type">Integer</span></div>
        </div>
        <div class="entity-card">
            <h3>User</h3>
            <div class="field"><span class="field-name">id</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">username</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">email</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">passwordHash</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">role</span><span class="field-type">UserRole</span></div>
            <div class="field"><span class="field-name">rating</span><span class="field-type">Integer</span></div>
            <div class="field"><span class="field-name">totalSolved</span><span class="field-type">Integer</span></div>
            <div class="field"><span class="field-name">easySolved</span><span class="field-type">Integer</span></div>
            <div class="field"><span class="field-name">mediumSolved</span><span class="field-type">Integer</span></div>
            <div class="field"><span class="field-name">hardSolved</span><span class="field-type">Integer</span></div>
            <div class="field"><span class="field-name">streak</span><span class="field-type">Integer</span></div>
            <div class="field"><span class="field-name">isPremium</span><span class="field-type">Boolean</span></div>
            <div class="field"><span class="field-name">createdAt</span><span class="field-type">LocalDateTime</span></div>
        </div>
        <div class="entity-card group-card">
            <h3>Contest</h3>
            <div class="field"><span class="field-name">id</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">title</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">type</span><span class="field-type">ContestType</span></div>
            <div class="field"><span class="field-name">startTime</span><span class="field-type">LocalDateTime</span></div>
            <div class="field"><span class="field-name">endTime</span><span class="field-type">LocalDateTime</span></div>
            <div class="field"><span class="field-name">duration</span><span class="field-type">Integer (min)</span></div>
            <div class="field"><span class="field-name">problemIds</span><span class="field-type">List&lt;Long&gt;</span></div>
            <div class="field"><span class="field-name">registeredUsers</span><span class="field-type">Set&lt;Long&gt;</span></div>
            <div class="field"><span class="field-name">status</span><span class="field-type">ContestStatus</span></div>
            <div class="field"><span class="field-name">createdAt</span><span class="field-type">LocalDateTime</span></div>
        </div>
        <div class="entity-card group-card">
            <h3>Discussion</h3>
            <div class="field"><span class="field-name">id</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">problemId</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">userId</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">title</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">content</span><span class="field-type">String (Markdown)</span></div>
            <div class="field"><span class="field-name">upvotes</span><span class="field-type">Integer</span></div>
            <div class="field"><span class="field-name">downvotes</span><span class="field-type">Integer</span></div>
            <div class="field"><span class="field-name">commentCount</span><span class="field-type">Integer</span></div>
            <div class="field"><span class="field-name">tags</span><span class="field-type">List&lt;String&gt;</span></div>
            <div class="field"><span class="field-name">createdAt</span><span class="field-type">LocalDateTime</span></div>
        </div>
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

<!-- ============ 4. INTERFACES & SOLID ============ -->
<div class="section theme-cyan">
    <div class="section-title"><span class="section-num">4</span>Interfaces &amp; SOLID Principles</div>

    <div class="sub-heading" style="color:#18ffff;border-color:#18ffff">Interface Segregation &mdash; Small, focused interfaces</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="cm">// SRP: Each interface has a single responsibility</span>
<span class="kw">interface</span> <span class="iface">IProblemService</span> {
    Problem <span class="fn">createProblem</span>(ProblemRequest req);
    Problem <span class="fn">getProblemById</span>(Long id);
    Problem <span class="fn">getProblemBySlug</span>(String slug);
    Page&lt;Problem&gt; <span class="fn">listProblems</span>(ProblemFilter filter, Pageable pageable);
    <span class="tp">void</span> <span class="fn">updateProblem</span>(Long id, ProblemRequest req);
}

<span class="kw">interface</span> <span class="iface">ISubmissionService</span> {
    Submission <span class="fn">submit</span>(Long userId, Long problemId, String code, Language lang);
    Submission <span class="fn">runCode</span>(Long userId, Long problemId, String code, Language lang, String customInput);
    List&lt;Submission&gt; <span class="fn">getSubmissions</span>(Long userId, Long problemId);
    Submission <span class="fn">getSubmissionById</span>(Long id);
}

<span class="kw">interface</span> <span class="iface">IJudgeService</span> {
    JudgeResult <span class="fn">evaluate</span>(Submission submission, List&lt;TestCase&gt; testCases);
    CompileResult <span class="fn">compile</span>(String code, Language language);
    ExecutionResult <span class="fn">execute</span>(String compiledPath, String input, <span class="tp">int</span> timeLimitMs, <span class="tp">int</span> memoryLimitKb);
}

<span class="kw">interface</span> <span class="iface">IContestService</span> {
    Contest <span class="fn">createContest</span>(ContestRequest req);
    <span class="tp">void</span> <span class="fn">registerUser</span>(Long contestId, Long userId);
    List&lt;LeaderboardEntry&gt; <span class="fn">getLeaderboard</span>(Long contestId, <span class="tp">int</span> page, <span class="tp">int</span> size);
    <span class="tp">void</span> <span class="fn">submitContestSolution</span>(Long contestId, Long userId, Long problemId, String code, Language lang);
}

<span class="kw">interface</span> <span class="iface">IDiscussionService</span> {
    Discussion <span class="fn">createPost</span>(Long userId, Long problemId, DiscussionRequest req);
    Page&lt;Discussion&gt; <span class="fn">getDiscussions</span>(Long problemId, Pageable pageable);
    <span class="tp">void</span> <span class="fn">upvote</span>(Long discussionId, Long userId);
    <span class="tp">void</span> <span class="fn">addComment</span>(Long discussionId, Long userId, String content);
}

<span class="kw">interface</span> <span class="iface">ILeaderboardService</span> {
    List&lt;LeaderboardEntry&gt; <span class="fn">getGlobalRanking</span>(<span class="tp">int</span> page, <span class="tp">int</span> size);
    <span class="tp">int</span> <span class="fn">getUserRank</span>(Long userId);
    <span class="tp">void</span> <span class="fn">updateRating</span>(Long userId, <span class="tp">int</span> delta);
}
    </pre></div>

    <div class="sub-heading" style="color:#18ffff;border-color:#18ffff">SOLID Applied</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="cm">// OCP: Strategy pattern for language-specific compilation</span>
<span class="kw">interface</span> <span class="iface">ICompiler</span> {
    CompileResult <span class="fn">compile</span>(String code, String workDir);
    Language <span class="fn">getSupportedLanguage</span>();
}

<span class="kw">class</span> <span class="tp">JavaCompiler</span> <span class="kw">implements</span> <span class="iface">ICompiler</span> { <span class="cm">/* javac compilation */</span> }
<span class="kw">class</span> <span class="tp">PythonCompiler</span> <span class="kw">implements</span> <span class="iface">ICompiler</span> { <span class="cm">/* syntax check only */</span> }
<span class="kw">class</span> <span class="tp">CppCompiler</span> <span class="kw">implements</span> <span class="iface">ICompiler</span> { <span class="cm">/* g++ compilation */</span> }

<span class="cm">// DIP: High-level JudgeService depends on abstraction, not concrete compilers</span>
<span class="ann">@Service</span>
<span class="kw">class</span> <span class="tp">JudgeService</span> <span class="kw">implements</span> <span class="iface">IJudgeService</span> {
    <span class="kw">private final</span> Map&lt;Language, ICompiler&gt; <span class="fn">compilers</span>;  <span class="cm">// injected via Spring</span>

    <span class="ann">@Autowired</span>
    <span class="kw">public</span> <span class="fn">JudgeService</span>(List&lt;ICompiler&gt; compilerList) {
        <span class="kw">this</span>.compilers = compilerList.stream()
            .collect(Collectors.toMap(ICompiler::getSupportedLanguage, c -&gt; c));
    }
}
    </pre></div>
</div>

<!-- ============ 5. CLASS DESIGN ============ -->
<div class="section theme-orange">
    <div class="section-title"><span class="section-num">5</span>Class Design</div>

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

<!-- ============ 6. REPOSITORY LAYER ============ -->
<div class="section theme-indigo">
    <div class="section-title"><span class="section-num">6</span>Repository Layer</div>
    <div class="repo-grid">
        <div class="repo-card">
            <h3>ProblemRepository</h3>
            <div class="method-item"><span class="method-dot" style="background:#8c9eff"></span> findBySlug(String slug)</div>
            <div class="method-item"><span class="method-dot" style="background:#8c9eff"></span> findByDifficulty(Difficulty d, Pageable p)</div>
            <div class="method-item"><span class="method-dot" style="background:#8c9eff"></span> findByCategoryTagsIn(List tags)</div>
            <div class="method-item"><span class="method-dot" style="background:#8c9eff"></span> searchByTitleContaining(String q)</div>
        </div>
        <div class="repo-card">
            <h3>SubmissionRepository</h3>
            <div class="method-item"><span class="method-dot" style="background:#8c9eff"></span> findByUserIdAndProblemId(Long uId, Long pId)</div>
            <div class="method-item"><span class="method-dot" style="background:#8c9eff"></span> findByContestIdAndUserId(Long cId, Long uId)</div>
            <div class="method-item"><span class="method-dot" style="background:#8c9eff"></span> countByUserIdAndVerdict(Long uId, Verdict v)</div>
            <div class="method-item"><span class="method-dot" style="background:#8c9eff"></span> findTopByOrderBySubmittedAtDesc()</div>
        </div>
        <div class="repo-card">
            <h3>ContestRepository</h3>
            <div class="method-item"><span class="method-dot" style="background:#8c9eff"></span> findByStatus(ContestStatus status)</div>
            <div class="method-item"><span class="method-dot" style="background:#8c9eff"></span> findUpcomingContests(LocalDateTime now)</div>
            <div class="method-item"><span class="method-dot" style="background:#8c9eff"></span> findActiveContests(LocalDateTime now)</div>
        </div>
        <div class="repo-card">
            <h3>DiscussionRepository</h3>
            <div class="method-item"><span class="method-dot" style="background:#8c9eff"></span> findByProblemId(Long pId, Pageable p)</div>
            <div class="method-item"><span class="method-dot" style="background:#8c9eff"></span> findByUserIdOrderByCreatedAtDesc(Long uId)</div>
            <div class="method-item"><span class="method-dot" style="background:#8c9eff"></span> findTopByProblemIdOrderByUpvotesDesc(Long pId)</div>
        </div>
        <div class="repo-card">
            <h3>TestCaseRepository</h3>
            <div class="method-item"><span class="method-dot" style="background:#8c9eff"></span> findByProblemId(Long problemId)</div>
            <div class="method-item"><span class="method-dot" style="background:#8c9eff"></span> findSamplesByProblemId(Long problemId)</div>
            <div class="method-item"><span class="method-dot" style="background:#8c9eff"></span> countByProblemId(Long problemId)</div>
        </div>
        <div class="repo-card">
            <h3>UserRepository</h3>
            <div class="method-item"><span class="method-dot" style="background:#8c9eff"></span> findByUsername(String username)</div>
            <div class="method-item"><span class="method-dot" style="background:#8c9eff"></span> findByEmail(String email)</div>
            <div class="method-item"><span class="method-dot" style="background:#8c9eff"></span> findTopByOrderByRatingDesc(Pageable p)</div>
        </div>
    </div>
</div>

<!-- ============ 7. DATABASE SCHEMA ============ -->
<div class="section theme-pink">
    <div class="section-title"><span class="section-num">7</span>Database Schema</div>
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
</div>

<!-- ============ 8. APIs ============ -->
<div class="section theme-teal">
    <div class="section-title"><span class="section-num">8</span>API Endpoints</div>
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

<!-- ============ 9. SERVICE LAYER ============ -->
<div class="section theme-yellow">
    <div class="section-title"><span class="section-num">9</span>Service Layer</div>
    <div class="service-grid">
        <div class="service-card">
            <h3>ProblemService</h3>
            <p class="svc-desc">Manages coding problems — create, view, list with filters, and track acceptance rate</p>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Add a new coding problem</div><code>Problem createProblem(CreateProblemRequest request)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Get a problem by its URL slug (e.g. "two-sum")</div><code>Problem getProblemBySlug(String slug)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> List problems with filters (difficulty, topic, etc.)</div><code>Page&lt;Problem&gt; listProblems(ProblemFilter filter, Pageable pageable)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Recalculate acceptance rate after new submissions</div><code>void updateAcceptanceRate(Long problemId)</code></div>
        </div>
        <div class="service-card">
            <h3>SubmissionService</h3>
            <p class="svc-desc">Handles code submissions — submit solution, run test cases, check results</p>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Submit a solution for judging</div><code>Submission submit(Long userId, Long problemId, String code, Language lang)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Run code with custom input (without submitting)</div><code>RunResult runCode(Long userId, Long problemId, String code, String input)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Check the status of a submission (pending, accepted, etc.)</div><code>SubmissionStatus getSubmissionStatus(Long submissionId)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Get all submissions by a user for a problem</div><code>List&lt;Submission&gt; getUserSubmissions(Long userId, Long problemId)</code></div>
        </div>
        <div class="service-card">
            <h3>JudgeService</h3>
            <p class="svc-desc">Compiles, runs, and checks submitted code against expected answers</p>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Run all test cases and give final result</div><code>JudgeResult evaluate(Submission submission, List&lt;TestCase&gt; testCases)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Compile the code into a runnable program</div><code>CompileResult compile(String code, Language language)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Run the compiled program with given input</div><code>ExecutionResult execute(String binary, String input, ResourceLimits limits)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Compare user's output with expected output</div><code>boolean compareOutput(String actual, String expected)</code></div>
        </div>
        <div class="service-card">
            <h3>ContestService</h3>
            <p class="svc-desc">Manages coding contests — create, register users, and track scores</p>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Create a new contest</div><code>Contest createContest(CreateContestRequest request)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Register a user for a contest</div><code>void registerUser(Long contestId, Long userId)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Get contest leaderboard with rankings</div><code>Page&lt;LeaderboardEntry&gt; getLeaderboard(Long contestId, Pageable pageable)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Calculate rating changes after contest ends</div><code>void calculateRatings(Long contestId)</code></div>
        </div>
        <div class="service-card">
            <h3>LeaderboardService</h3>
            <p class="svc-desc">Tracks global rankings and user ratings across all problems</p>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Get global ranking list (with pages)</div><code>Page&lt;RankEntry&gt; getGlobalRanking(Pageable pageable)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Get a specific user's rank</div><code>RankEntry getUserRank(Long userId)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Update user's rating after a contest</div><code>void updateRating(Long userId, int delta)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Rebuild the leaderboard cache</div><code>void refreshCache()</code></div>
        </div>
        <div class="service-card">
            <h3>DiscussionService</h3>
            <p class="svc-desc">Manages discussion posts, comments, and upvotes for each problem</p>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Create a new discussion post</div><code>Discussion createPost(Long userId, Long problemId, CreatePostRequest request)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Get all discussions for a problem</div><code>Page&lt;Discussion&gt; getDiscussions(Long problemId, Pageable pageable)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Upvote a helpful discussion</div><code>void upvote(Long discussionId, Long userId)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Add a comment to a discussion</div><code>Comment addComment(Long discussionId, CommentRequest comment)</code></div>
        </div>
        <div class="service-card">
            <h3>AuthService</h3>
            <p class="svc-desc">Handles user signup, login (email + Google/GitHub OAuth), and token refresh</p>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Register a new user</div><code>User register(String username, String email, String password)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Log in with email and password</div><code>String login(String email, String password)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Log in using Google or GitHub</div><code>String oauthLogin(String provider, String token)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Get a new token when current one expires</div><code>String refreshToken(String refreshToken)</code></div>
        </div>
        <div class="service-card">
            <h3>SandboxService</h3>
            <p class="svc-desc">Creates safe Docker containers to run user code without security risks</p>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Create a new container for a language</div><code>String createContainer(Language language)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Run code inside the safe container</div><code>ExecutionResult executeInSandbox(String containerId, String code)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Destroy the container after execution</div><code>void destroyContainer(String containerId)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Set CPU, memory, and time limits</div><code>void enforceResourceLimits(String containerId, ResourceLimits limits)</code></div>
        </div>
    </div>
</div>

<!-- ============ 10. KEY ARCHITECTURE ============ -->
<div class="section theme-blue">
    <div class="section-title"><span class="section-num">10</span>Key Architecture &mdash; Code Execution &amp; Judge System</div>

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

<!-- ============ 11. DESIGN PATTERNS ============ -->
<div class="section theme-cyan">
    <div class="section-title"><span class="section-num">11</span>Design Patterns</div>
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

<!-- ============ 12. SEQUENCE FLOW ============ -->
<div class="section theme-green">
    <div class="section-title"><span class="section-num">12</span>Sequence Flow &mdash; Code Submission</div>
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

<!-- ============ 13. CAPACITY ESTIMATION ============ -->
<div class="section theme-deepblue">
    <div class="section-title"><span class="section-num">13</span>Capacity Estimation</div>
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

<!-- ============ 14. BOTTLENECKS ============ -->
<div class="section theme-red">
    <div class="section-title"><span class="section-num">14</span>Bottlenecks &amp; Solutions</div>
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

<!-- ============ 15. EDGE CASES ============ -->
<div class="section theme-amber">
    <div class="section-title"><span class="section-num">15</span>Edge Cases</div>
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

<!-- ============ 16. SECURITY ============ -->
<div class="section theme-lime">
    <div class="section-title"><span class="section-num">16</span>Security &amp; Sandboxing</div>
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

<!-- ============ 17. INTERVIEW SUMMARY ============ -->
<div class="section theme-orange">
    <div class="section-title"><span class="section-num">17</span>Interview Summary</div>
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
