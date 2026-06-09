export default {
  title: "URL Shortener Low Level Design",
  subtitle: "Complete LLD for Java Spring Boot Interview",
  subtitleColor: "#b3e5fc",
  headerGradient: "linear-gradient(135deg,#0277bd,#0288d1,#4fc3f7)",
  footerText: "URL Shortener LLD",
  content: `
<!-- ============ 1. FUNCTIONAL REQUIREMENTS ============ -->
<div class="section theme-green">
    <div class="section-title"><span class="section-num">1</span>Functional Requirements</div>
    <div class="req-grid">
        <div class="req-pill"><span class="num">1</span> Shorten a long URL</div>
        <div class="req-pill"><span class="num">2</span> Redirect short URL to original</div>
        <div class="req-pill"><span class="num">3</span> Custom alias support</div>
        <div class="req-pill"><span class="num">4</span> URL expiration (TTL)</div>
        <div class="req-pill"><span class="num">5</span> Click analytics tracking</div>
        <div class="req-pill"><span class="num">6</span> User registration &amp; auth</div>
        <div class="req-pill"><span class="num">7</span> List user's URLs (paginated)</div>
        <div class="req-pill"><span class="num">8</span> Delete / deactivate a URL</div>
        <div class="req-pill"><span class="num">9</span> Rate limiting per user</div>
        <div class="req-pill"><span class="num">10</span> Bulk URL creation via API</div>
    </div>
</div>

<!-- ============ 2. CORE ENTITIES ============ -->
<div class="section theme-blue">
    <div class="section-title"><span class="section-num">2</span>Core Entities</div>
    <div class="entity-grid">
        <div class="entity-card">
            <h3>Url</h3>
            <div class="field"><span class="field-name">id</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">shortCode</span><span class="field-type">String (7 chars)</span></div>
            <div class="field"><span class="field-name">originalUrl</span><span class="field-type">String (2048)</span></div>
            <div class="field"><span class="field-name">userId</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">customAlias</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">status</span><span class="field-type">UrlStatus</span></div>
            <div class="field"><span class="field-name">expiresAt</span><span class="field-type">LocalDateTime</span></div>
            <div class="field"><span class="field-name">clickCount</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">createdAt</span><span class="field-type">LocalDateTime</span></div>
            <div class="field"><span class="field-name">updatedAt</span><span class="field-type">LocalDateTime</span></div>
        </div>
        <div class="entity-card">
            <h3>User</h3>
            <div class="field"><span class="field-name">id</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">email</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">passwordHash</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">apiKey</span><span class="field-type">String (UUID)</span></div>
            <div class="field"><span class="field-name">tier</span><span class="field-type">UserTier</span></div>
            <div class="field"><span class="field-name">dailyQuota</span><span class="field-type">int</span></div>
            <div class="field"><span class="field-name">createdAt</span><span class="field-type">LocalDateTime</span></div>
        </div>
        <div class="entity-card">
            <h3>ClickAnalytics</h3>
            <div class="field"><span class="field-name">id</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">urlId</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">shortCode</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">ipAddress</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">userAgent</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">referer</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">country</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">deviceType</span><span class="field-type">DeviceType</span></div>
            <div class="field"><span class="field-name">browser</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">clickedAt</span><span class="field-type">LocalDateTime</span></div>
        </div>
        <div class="entity-card">
            <h3>UrlDailyStats</h3>
            <div class="field"><span class="field-name">id</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">urlId</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">date</span><span class="field-type">LocalDate</span></div>
            <div class="field"><span class="field-name">clickCount</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">uniqueVisitors</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">topCountry</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">topReferer</span><span class="field-type">String</span></div>
        </div>
    </div>
</div>

<!-- ============ 3. ENUMS ============ -->
<div class="section theme-purple">
    <div class="section-title"><span class="section-num">3</span>Enums</div>
    <div class="enum-grid">
        <div class="enum-card">
            <h3>UrlStatus</h3>
            <div class="enum-val">ACTIVE</div>
            <div class="enum-val">EXPIRED</div>
            <div class="enum-val">DISABLED</div>
            <div class="enum-val">FLAGGED</div>
        </div>
        <div class="enum-card">
            <h3>UserTier</h3>
            <div class="enum-val">FREE</div>
            <div class="enum-val">PRO</div>
            <div class="enum-val">ENTERPRISE</div>
        </div>
        <div class="enum-card">
            <h3>DeviceType</h3>
            <div class="enum-val">DESKTOP</div>
            <div class="enum-val">MOBILE</div>
            <div class="enum-val">TABLET</div>
            <div class="enum-val">BOT</div>
        </div>
        <div class="enum-card">
            <h3>IdGenerationStrategy</h3>
            <div class="enum-val">BASE62_COUNTER</div>
            <div class="enum-val">MD5_HASH</div>
            <div class="enum-val">SNOWFLAKE</div>
            <div class="enum-val">NANO_ID</div>
        </div>
        <div class="enum-card">
            <h3>ExpirationPolicy</h3>
            <div class="enum-val">NEVER</div>
            <div class="enum-val">ONE_DAY</div>
            <div class="enum-val">SEVEN_DAYS</div>
            <div class="enum-val">THIRTY_DAYS</div>
            <div class="enum-val">ONE_YEAR</div>
            <div class="enum-val">CUSTOM</div>
        </div>
    </div>
</div>

<!-- ============ 4. INTERFACES & SOLID ============ -->
<div class="section theme-cyan">
    <div class="section-title"><span class="section-num">4</span>Interfaces &amp; SOLID Principles</div>

    <div class="sub-heading" style="color:#18ffff;border-color:#18ffff">Interface Segregation &mdash; Small, focused interfaces</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">interface</span> <span class="iface">IUrlService</span> {
    Url <span class="fn">createShortUrl</span>(CreateUrlRequest request, Long userId);
    String <span class="fn">resolveUrl</span>(String shortCode);  <span class="cm">// returns original URL or null</span>
    <span class="tp">void</span> <span class="fn">deactivateUrl</span>(String shortCode, Long userId);
    Page&lt;Url&gt; <span class="fn">getUserUrls</span>(Long userId, Pageable pageable);
}

<span class="kw">interface</span> <span class="iface">IAnalyticsService</span> {
    <span class="tp">void</span> <span class="fn">recordClick</span>(String shortCode, HttpServletRequest request);
    ClickStats <span class="fn">getClickStats</span>(String shortCode, LocalDate from, LocalDate to);
    List&lt;UrlDailyStats&gt; <span class="fn">getDailyBreakdown</span>(String shortCode, <span class="tp">int</span> days);
}

<span class="kw">interface</span> <span class="iface">IIdGeneratorService</span> {
    String <span class="fn">generateId</span>();  <span class="cm">// returns 7-char short code</span>
}

<span class="kw">interface</span> <span class="iface">IUrlValidationService</span> {
    <span class="tp">boolean</span> <span class="fn">isValidUrl</span>(String url);
    <span class="tp">boolean</span> <span class="fn">isMalicious</span>(String url);  <span class="cm">// Google Safe Browsing API</span>
    <span class="tp">boolean</span> <span class="fn">isCustomAliasAvailable</span>(String alias);
}

<span class="kw">interface</span> <span class="iface">ICacheService</span> {
    <span class="tp">void</span> <span class="fn">put</span>(String shortCode, String originalUrl);
    String <span class="fn">get</span>(String shortCode);
    <span class="tp">void</span> <span class="fn">evict</span>(String shortCode);
}

<span class="kw">interface</span> <span class="iface">IExpirationService</span> {
    <span class="tp">void</span> <span class="fn">scheduleExpiration</span>(Url url);
    <span class="tp">void</span> <span class="fn">cleanupExpiredUrls</span>();  <span class="cm">// @Scheduled cron job</span>
}
    </pre></div>

    <div class="sub-heading" style="color:#18ffff;border-color:#18ffff">Strategy Pattern &mdash; ID Generation</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">interface</span> <span class="iface">IdGenerationStrategy</span> {
    String <span class="fn">generate</span>();
}

<span class="kw">class</span> <span class="cn">Base62CounterStrategy</span> <span class="kw">implements</span> <span class="iface">IdGenerationStrategy</span> {
    <span class="ann">@Override</span>
    <span class="kw">public</span> String <span class="fn">generate</span>() {
        <span class="tp">long</span> counter = counterService.getNextId();  <span class="cm">// Atomic counter from DB/Redis</span>
        <span class="kw">return</span> Base62.encode(counter);  <span class="cm">// e.g., 100000 &rarr; "q0U"</span>
    }
}

<span class="kw">class</span> <span class="cn">Md5HashStrategy</span> <span class="kw">implements</span> <span class="iface">IdGenerationStrategy</span> {
    <span class="ann">@Override</span>
    <span class="kw">public</span> String <span class="fn">generate</span>() {
        String hash = DigestUtils.md5Hex(url + salt);
        <span class="kw">return</span> hash.substring(0, 7);  <span class="cm">// first 7 chars of MD5</span>
    }
}

<span class="kw">class</span> <span class="cn">SnowflakeStrategy</span> <span class="kw">implements</span> <span class="iface">IdGenerationStrategy</span> {
    <span class="ann">@Override</span>
    <span class="kw">public</span> String <span class="fn">generate</span>() {
        <span class="tp">long</span> snowflakeId = snowflakeGenerator.nextId();
        <span class="kw">return</span> Base62.encode(snowflakeId).substring(0, 7);
    }
}
    </pre></div>
</div>

<!-- ============ 5. CLASS DESIGN ============ -->
<div class="section theme-orange">
    <div class="section-title"><span class="section-num">5</span>Class Design (with Methods)</div>

    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Url.java</span></div><pre class="code-block">
<span class="ann">@Entity</span>
<span class="ann">@Table</span>(name = <span class="st">"urls"</span>)
<span class="kw">class</span> <span class="cn">Url</span> {
    <span class="ann">@Id @GeneratedValue</span>(strategy = GenerationType.IDENTITY)
    <span class="tp">Long</span> <span class="fn">id</span>;

    <span class="ann">@Column</span>(unique = <span class="kw">true</span>, nullable = <span class="kw">false</span>, length = 15)
    <span class="tp">String</span> <span class="fn">shortCode</span>;

    <span class="ann">@Column</span>(nullable = <span class="kw">false</span>, length = 2048)
    <span class="tp">String</span> <span class="fn">originalUrl</span>;

    <span class="ann">@ManyToOne</span>(fetch = FetchType.LAZY)
    <span class="ann">@JoinColumn</span>(name = <span class="st">"user_id"</span>)
    <span class="tp">User</span> <span class="fn">user</span>;

    <span class="tp">String</span> <span class="fn">customAlias</span>;

    <span class="ann">@Enumerated</span>(EnumType.STRING)
    <span class="tp">UrlStatus</span> <span class="fn">status</span> = UrlStatus.ACTIVE;

    <span class="tp">LocalDateTime</span> <span class="fn">expiresAt</span>;
    <span class="tp">Long</span> <span class="fn">clickCount</span> = 0L;
    <span class="tp">LocalDateTime</span> <span class="fn">createdAt</span>;
    <span class="tp">LocalDateTime</span> <span class="fn">updatedAt</span>;

    <span class="ann">@PrePersist</span>
    <span class="kw">void</span> <span class="fn">onCreate</span>() {
        <span class="kw">this</span>.createdAt = LocalDateTime.now();
        <span class="kw">this</span>.updatedAt = LocalDateTime.now();
    }

    <span class="kw">public boolean</span> <span class="fn">isExpired</span>() {
        <span class="kw">return</span> expiresAt != <span class="kw">null</span> &amp;&amp; LocalDateTime.now().isAfter(expiresAt);
    }

    <span class="kw">public boolean</span> <span class="fn">isAccessible</span>() {
        <span class="kw">return</span> status == UrlStatus.ACTIVE &amp;&amp; !isExpired();
    }

    <span class="kw">public void</span> <span class="fn">incrementClick</span>() {
        <span class="kw">this</span>.clickCount++;
    }

    <span class="kw">public void</span> <span class="fn">deactivate</span>() {
        <span class="kw">this</span>.status = UrlStatus.DISABLED;
        <span class="kw">this</span>.updatedAt = LocalDateTime.now();
    }

    <span class="kw">public void</span> <span class="fn">markExpired</span>() {
        <span class="kw">this</span>.status = UrlStatus.EXPIRED;
        <span class="kw">this</span>.updatedAt = LocalDateTime.now();
    }
}
    </pre></div>

    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">User.java</span></div><pre class="code-block">
<span class="ann">@Entity</span>
<span class="ann">@Table</span>(name = <span class="st">"users"</span>)
<span class="kw">class</span> <span class="cn">User</span> {
    <span class="ann">@Id @GeneratedValue</span>
    <span class="tp">Long</span> <span class="fn">id</span>;
    <span class="tp">String</span> <span class="fn">email</span>;
    <span class="tp">String</span> <span class="fn">passwordHash</span>;
    <span class="tp">String</span> <span class="fn">apiKey</span> = UUID.randomUUID().toString();

    <span class="ann">@Enumerated</span>(EnumType.STRING)
    <span class="tp">UserTier</span> <span class="fn">tier</span> = UserTier.FREE;

    <span class="kw">public int</span> <span class="fn">getDailyQuota</span>() {
        <span class="kw">return switch</span> (tier) {
            <span class="kw">case</span> FREE       <span class="kw">-&gt;</span> 100;
            <span class="kw">case</span> PRO        <span class="kw">-&gt;</span> 10_000;
            <span class="kw">case</span> ENTERPRISE <span class="kw">-&gt;</span> 1_000_000;
        };
    }

    <span class="kw">public boolean</span> <span class="fn">canCreateUrl</span>(<span class="tp">long</span> todayCount) {
        <span class="kw">return</span> todayCount &lt; getDailyQuota();
    }
}
    </pre></div>

    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">ClickAnalytics.java</span></div><pre class="code-block">
<span class="ann">@Entity</span>
<span class="ann">@Table</span>(name = <span class="st">"click_analytics"</span>)
<span class="kw">class</span> <span class="cn">ClickAnalytics</span> {
    <span class="ann">@Id @GeneratedValue</span>
    <span class="tp">Long</span> <span class="fn">id</span>;

    <span class="ann">@ManyToOne</span>(fetch = FetchType.LAZY)
    <span class="ann">@JoinColumn</span>(name = <span class="st">"url_id"</span>)
    <span class="tp">Url</span> <span class="fn">url</span>;

    <span class="tp">String</span> <span class="fn">shortCode</span>;
    <span class="tp">String</span> <span class="fn">ipAddress</span>;
    <span class="tp">String</span> <span class="fn">userAgent</span>;
    <span class="tp">String</span> <span class="fn">referer</span>;
    <span class="tp">String</span> <span class="fn">country</span>;

    <span class="ann">@Enumerated</span>(EnumType.STRING)
    <span class="tp">DeviceType</span> <span class="fn">deviceType</span>;

    <span class="tp">String</span> <span class="fn">browser</span>;
    <span class="tp">LocalDateTime</span> <span class="fn">clickedAt</span> = LocalDateTime.now();

    <span class="kw">public static</span> ClickAnalytics <span class="fn">fromRequest</span>(Url url, HttpServletRequest req) {
        ClickAnalytics click = <span class="kw">new</span> ClickAnalytics();
        click.url = url;
        click.shortCode = url.getShortCode();
        click.ipAddress = extractIp(req);
        click.userAgent = req.getHeader(<span class="st">"User-Agent"</span>);
        click.referer = req.getHeader(<span class="st">"Referer"</span>);
        click.deviceType = DeviceTypeParser.parse(click.userAgent);
        click.browser = BrowserParser.parse(click.userAgent);
        click.country = GeoIpService.resolve(click.ipAddress);
        <span class="kw">return</span> click;
    }
}
    </pre></div>

    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Base62.java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">Base62</span> {
    <span class="kw">private static final</span> String <span class="fn">ALPHABET</span> =
        <span class="st">"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"</span>;

    <span class="kw">public static</span> String <span class="fn">encode</span>(<span class="tp">long</span> num) {
        StringBuilder sb = <span class="kw">new</span> StringBuilder();
        <span class="kw">while</span> (num &gt; 0) {
            sb.append(ALPHABET.charAt((<span class="tp">int</span>) (num % 62)));
            num /= 62;
        }
        <span class="kw">while</span> (sb.length() &lt; 7) sb.append(<span class="st">'0'</span>);  <span class="cm">// pad to 7 chars</span>
        <span class="kw">return</span> sb.reverse().toString();
    }

    <span class="kw">public static long</span> <span class="fn">decode</span>(String code) {
        <span class="tp">long</span> num = 0;
        <span class="kw">for</span> (<span class="tp">char</span> c : code.toCharArray()) {
            num = num * 62 + ALPHABET.indexOf(c);
        }
        <span class="kw">return</span> num;
    }
}
<span class="cm">// 62^7 = 3.5 trillion unique codes &mdash; enough for decades</span>
    </pre></div>
</div>

<!-- ============ 6. REPOSITORY LAYER ============ -->
<div class="section theme-indigo">
    <div class="section-title"><span class="section-num">6</span>Repository / DAO Layer</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">interface</span> <span class="iface">UrlRepository</span> <span class="kw">extends</span> <span class="tp">JpaRepository</span>&lt;Url, Long&gt; {
    Optional&lt;Url&gt; <span class="fn">findByShortCode</span>(String shortCode);

    Optional&lt;Url&gt; <span class="fn">findByOriginalUrlAndUserId</span>(String originalUrl, Long userId);

    Page&lt;Url&gt; <span class="fn">findByUserIdOrderByCreatedAtDesc</span>(Long userId, Pageable pageable);

    <span class="ann">@Query</span>(<span class="st">"SELECT u FROM Url u WHERE u.status = 'ACTIVE' AND u.expiresAt &lt; :now"</span>)
    List&lt;Url&gt; <span class="fn">findExpiredUrls</span>(<span class="ann">@Param</span>(<span class="st">"now"</span>) LocalDateTime now);

    <span class="ann">@Modifying</span>
    <span class="ann">@Query</span>(<span class="st">"UPDATE Url u SET u.clickCount = u.clickCount + 1 WHERE u.shortCode = :code"</span>)
    <span class="tp">void</span> <span class="fn">incrementClickCount</span>(<span class="ann">@Param</span>(<span class="st">"code"</span>) String shortCode);

    <span class="tp">long</span> <span class="fn">countByUserIdAndCreatedAtAfter</span>(Long userId, LocalDateTime since);

    <span class="tp">boolean</span> <span class="fn">existsByShortCode</span>(String shortCode);
}

<span class="kw">interface</span> <span class="iface">ClickAnalyticsRepository</span> <span class="kw">extends</span> <span class="tp">JpaRepository</span>&lt;ClickAnalytics, Long&gt; {
    <span class="tp">long</span> <span class="fn">countByShortCode</span>(String shortCode);

    List&lt;ClickAnalytics&gt; <span class="fn">findByShortCodeAndClickedAtBetween</span>(
        String shortCode, LocalDateTime from, LocalDateTime to);

    <span class="ann">@Query</span>(<span class="st">"SELECT c.country, COUNT(c) FROM ClickAnalytics c WHERE c.shortCode = :code GROUP BY c.country ORDER BY COUNT(c) DESC"</span>)
    List&lt;Object[]&gt; <span class="fn">getCountryBreakdown</span>(<span class="ann">@Param</span>(<span class="st">"code"</span>) String shortCode);

    <span class="ann">@Query</span>(<span class="st">"SELECT c.deviceType, COUNT(c) FROM ClickAnalytics c WHERE c.shortCode = :code GROUP BY c.deviceType"</span>)
    List&lt;Object[]&gt; <span class="fn">getDeviceBreakdown</span>(<span class="ann">@Param</span>(<span class="st">"code"</span>) String shortCode);
}

<span class="kw">interface</span> <span class="iface">UserRepository</span> <span class="kw">extends</span> <span class="tp">JpaRepository</span>&lt;User, Long&gt; {
    Optional&lt;User&gt; <span class="fn">findByEmail</span>(String email);
    Optional&lt;User&gt; <span class="fn">findByApiKey</span>(String apiKey);
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
                <div class="flow-box flow-pink" style="min-width:120px">Database</div>
            </div>
        </div>
        <div class="repo-card">
            <h3>Why Repository Layer?</h3>
            <div class="method-item"><span class="method-dot" style="background:#8c9eff"></span><span style="color:#c5cae9"> Decouples business logic from DB</span></div>
            <div class="method-item"><span class="method-dot" style="background:#8c9eff"></span><span style="color:#c5cae9"> Custom @Query for analytics aggregations</span></div>
            <div class="method-item"><span class="method-dot" style="background:#8c9eff"></span><span style="color:#c5cae9"> @Modifying for atomic click increment</span></div>
            <div class="method-item"><span class="method-dot" style="background:#8c9eff"></span><span style="color:#c5cae9"> Easy to mock in unit tests</span></div>
        </div>
    </div>
</div>

<!-- ============ 7. DATABASE SCHEMA ============ -->
<div class="section theme-pink">
    <div class="section-title"><span class="section-num">7</span>Database Schema (with FK &amp; Indexes)</div>
    <div class="db-grid">
        <div class="db-table">
            <h3>urls</h3>
            <ul>
                <li><span class="pk">id BIGINT (PK, AUTO_INCREMENT)</span></li>
                <li>short_code VARCHAR(15) UNIQUE NOT NULL</li>
                <li>original_url VARCHAR(2048) NOT NULL</li>
                <li><span class="fk">user_id BIGINT (FK &rarr; users.id)</span></li>
                <li>custom_alias VARCHAR(30)</li>
                <li>status ENUM('ACTIVE','EXPIRED','DISABLED','FLAGGED')</li>
                <li>expires_at TIMESTAMP NULL</li>
                <li>click_count BIGINT DEFAULT 0</li>
                <li>created_at TIMESTAMP</li>
                <li>updated_at TIMESTAMP</li>
                <li><span class="idx">UNIQUE INDEX idx_short_code (short_code)</span></li>
                <li><span class="idx">INDEX idx_user_created (user_id, created_at DESC)</span></li>
                <li><span class="idx">INDEX idx_expires (status, expires_at)</span></li>
                <li><span class="idx">INDEX idx_original_user (original_url(255), user_id)</span></li>
            </ul>
        </div>
        <div class="db-table">
            <h3>users</h3>
            <ul>
                <li><span class="pk">id BIGINT (PK, AUTO_INCREMENT)</span></li>
                <li>email VARCHAR(255) UNIQUE NOT NULL</li>
                <li>password_hash VARCHAR(255)</li>
                <li>api_key VARCHAR(36) UNIQUE</li>
                <li>tier ENUM('FREE','PRO','ENTERPRISE')</li>
                <li>created_at TIMESTAMP</li>
                <li><span class="idx">UNIQUE INDEX idx_email (email)</span></li>
                <li><span class="idx">UNIQUE INDEX idx_api_key (api_key)</span></li>
            </ul>
        </div>
        <div class="db-table">
            <h3>click_analytics</h3>
            <ul>
                <li><span class="pk">id BIGINT (PK, AUTO_INCREMENT)</span></li>
                <li><span class="fk">url_id BIGINT (FK &rarr; urls.id)</span></li>
                <li>short_code VARCHAR(15)</li>
                <li>ip_address VARCHAR(45)</li>
                <li>user_agent VARCHAR(500)</li>
                <li>referer VARCHAR(2048)</li>
                <li>country VARCHAR(3)</li>
                <li>device_type ENUM('DESKTOP','MOBILE','TABLET','BOT')</li>
                <li>browser VARCHAR(50)</li>
                <li>clicked_at TIMESTAMP</li>
                <li><span class="idx">INDEX idx_code_time (short_code, clicked_at DESC)</span></li>
                <li><span class="idx">INDEX idx_url_id (url_id)</span></li>
            </ul>
        </div>
        <div class="db-table">
            <h3>url_daily_stats</h3>
            <ul>
                <li><span class="pk">id BIGINT (PK, AUTO_INCREMENT)</span></li>
                <li><span class="fk">url_id BIGINT (FK &rarr; urls.id)</span></li>
                <li>stat_date DATE</li>
                <li>click_count BIGINT DEFAULT 0</li>
                <li>unique_visitors BIGINT DEFAULT 0</li>
                <li>top_country VARCHAR(3)</li>
                <li>top_referer VARCHAR(2048)</li>
                <li><span class="idx">UNIQUE INDEX idx_url_date (url_id, stat_date)</span></li>
            </ul>
        </div>
    </div>
    <div style="margin-top:16px;padding:14px 18px;background:rgba(255,128,171,.08);border-radius:12px;border:1px solid rgba(255,128,171,.15)">
        <strong style="color:#ff80ab">Why these indexes matter:</strong>
        <p style="color:#b0bec5;font-size:.88em;margin-top:8px;line-height:1.6">
            <strong>idx_short_code (UNIQUE)</strong> &mdash; Most critical: every redirect does a lookup by short_code. Must be O(1).<br>
            <strong>idx_user_created</strong> &mdash; Dashboard view: "list my URLs newest first" with pagination.<br>
            <strong>idx_expires</strong> &mdash; Cron job cleanup: find all ACTIVE URLs where expires_at &lt; NOW().<br>
            <strong>idx_code_time</strong> &mdash; Analytics query: "clicks for this URL in the last 7 days" with time range filter.<br>
            <strong>idx_original_user</strong> &mdash; Deduplication: check if user already shortened the same URL (prefix index on 255 chars).
        </p>
    </div>
</div>

<!-- ============ 8. APIs ============ -->
<div class="section theme-teal">
    <div class="section-title"><span class="section-num">8</span>APIs (with Request/Response)</div>
    <div class="api-grid">
        <div class="api-card">
            <div class="api-header"><span class="api-method method-post">POST</span><span class="api-path">/api/v1/urls/shorten</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Request</div>{ <span class="key">"originalUrl"</span>: <span class="val">"https://example.com/very/long/path"</span>,<br>&nbsp;&nbsp;<span class="key">"customAlias"</span>: <span class="val">"my-link"</span>,<br>&nbsp;&nbsp;<span class="key">"expiresIn"</span>: <span class="val">"THIRTY_DAYS"</span> }</div>
                <div class="api-json"><div class="label">Response 201</div>{ <span class="key">"shortCode"</span>: <span class="val">"aB3xK9p"</span>,<br>&nbsp;&nbsp;<span class="key">"shortUrl"</span>: <span class="val">"https://short.ly/aB3xK9p"</span>,<br>&nbsp;&nbsp;<span class="key">"expiresAt"</span>: <span class="val">"2026-07-04T00:00:00"</span> }</div>
            </div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-get">GET</span><span class="api-path">/{shortCode}</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Path Param</div><span class="key">shortCode</span>: <span class="val">"aB3xK9p"</span></div>
                <div class="api-json"><div class="label">Response 302</div><span class="key">Location</span>: <span class="val">https://example.com/very/long/path</span><br><br><div class="label" style="color:#ff5252">Response 404</div>{ <span class="key">"error"</span>: <span class="val">"Short URL not found or expired"</span> }</div>
            </div>
            <div class="api-note">HTTP 302 (temporary redirect) &mdash; allows analytics tracking on every visit. 301 would be cached by browser.</div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-get">GET</span><span class="api-path">/api/v1/urls/{shortCode}/analytics?from=2026-01-01&amp;to=2026-06-01</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Query Params</div><span class="key">from</span>: <span class="val">2026-01-01</span><br><span class="key">to</span>: <span class="val">2026-06-01</span></div>
                <div class="api-json"><div class="label">Response 200</div>{ <span class="key">"totalClicks"</span>: <span class="val">15420</span>,<br>&nbsp;&nbsp;<span class="key">"uniqueVisitors"</span>: <span class="val">8930</span>,<br>&nbsp;&nbsp;<span class="key">"topCountries"</span>: <span class="val">[{"US": 5200}, {"IN": 3100}]</span>,<br>&nbsp;&nbsp;<span class="key">"deviceBreakdown"</span>: <span class="val">{"MOBILE": 60, "DESKTOP": 35, "TABLET": 5}</span>,<br>&nbsp;&nbsp;<span class="key">"dailyStats"</span>: <span class="val">[...]</span> }</div>
            </div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-get">GET</span><span class="api-path">/api/v1/urls?page=0&amp;size=20</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Query Params</div><span class="key">page</span>: <span class="val">0</span> (default)<br><span class="key">size</span>: <span class="val">20</span> (default)</div>
                <div class="api-json"><div class="label">Response 200</div>{ <span class="key">"urls"</span>: <span class="val">[{shortCode, originalUrl, clickCount, ...}]</span>,<br>&nbsp;&nbsp;<span class="key">"totalPages"</span>: <span class="val">5</span>,<br>&nbsp;&nbsp;<span class="key">"totalElements"</span>: <span class="val">98</span>,<br>&nbsp;&nbsp;<span class="key">"hasNext"</span>: <span class="val">true</span> }</div>
            </div>
            <div class="api-note">Paginated &mdash; returns user's URLs sorted by created_at DESC</div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-delete">DELETE</span><span class="api-path">/api/v1/urls/{shortCode}</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Path Param</div><span class="key">shortCode</span>: <span class="val">"aB3xK9p"</span></div>
                <div class="api-json"><div class="label">Response 200</div>{ <span class="key">"success"</span>: <span class="val">true</span>,<br>&nbsp;&nbsp;<span class="key">"message"</span>: <span class="val">"URL deactivated"</span> }<br><br><div class="label" style="color:#ff5252">Response 403</div>{ <span class="key">"error"</span>: <span class="val">"Not authorized"</span> }</div>
            </div>
            <div class="api-note">Soft delete &mdash; marks status as DISABLED, evicts from cache</div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-post">POST</span><span class="api-path">/api/v1/urls/bulk</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Request</div>{ <span class="key">"urls"</span>: [<br>&nbsp;&nbsp;{ <span class="key">"originalUrl"</span>: <span class="val">"https://a.com"</span> },<br>&nbsp;&nbsp;{ <span class="key">"originalUrl"</span>: <span class="val">"https://b.com"</span> }<br>] }</div>
                <div class="api-json"><div class="label">Response 201</div>{ <span class="key">"results"</span>: [<br>&nbsp;&nbsp;{ <span class="key">"shortUrl"</span>: <span class="val">"https://short.ly/xY7kL"</span> },<br>&nbsp;&nbsp;{ <span class="key">"shortUrl"</span>: <span class="val">"https://short.ly/mN3pQ"</span> }<br>] }</div>
            </div>
            <div class="api-note">Batch creation &mdash; max 100 URLs per request. Subject to daily quota.</div>
        </div>
    </div>
</div>

<!-- ============ 9. SERVICE LAYER ============ -->
<div class="section theme-yellow">
    <div class="section-title"><span class="section-num">9</span>Service Layer</div>
    <div class="service-grid">
        <div class="service-card">
            <h3>UrlService</h3>
            <p class="svc-desc">Creates short URLs, resolves them back to original URLs, and manages user's URLs</p>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Create a new short URL</div><code>ShortUrl createShortUrl(CreateUrlRequest request, Long userId)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Get the original URL from a short code</div><code>String resolveUrl(String shortCode)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Turn off a short URL so it stops working</div><code>void deactivateUrl(String shortCode, Long userId)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Get all short URLs created by a user</div><code>Page&lt;ShortUrl&gt; getUserUrls(Long userId, Pageable pageable)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Check if same URL was already shortened</div><code>Optional&lt;ShortUrl&gt; handleDuplicateUrl(String originalUrl, Long userId)</code></div>
        </div>
        <div class="service-card">
            <h3>RedirectService</h3>
            <p class="svc-desc">Redirects users from short URL to the original URL, checks cache first for speed</p>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Redirect user to the original URL</div><code>String redirect(String shortCode, HttpServletRequest request)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Look up URL in cache first (fast)</div><code>Optional&lt;String&gt; checkCacheFirst(String shortCode)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Look up URL in database if not in cache</div><code>String fallbackToDb(String shortCode)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Make sure the URL is still reachable</div><code>boolean validateAccessible(String url)</code></div>
        </div>
        <div class="service-card">
            <h3>AnalyticsService</h3>
            <p class="svc-desc">Tracks and reports how many times each short URL was clicked</p>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Record a click when someone uses the short URL</div><code>void recordClick(String shortCode, HttpServletRequest request)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Get total clicks and stats for a short URL</div><code>ClickStats getClickStats(String shortCode, DateRange range)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Get day-by-day click breakdown</div><code>List&lt;DailyStats&gt; getDailyBreakdown(String shortCode, int days)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Combine daily stats into summary (runs as scheduled job)</div><code>void aggregateDailyStats()</code></div>
        </div>
        <div class="service-card">
            <h3>IdGeneratorService</h3>
            <p class="svc-desc">Creates unique short codes for URLs and handles conflicts</p>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Generate a unique short code</div><code>String generateId()</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Handle if the short code already exists</div><code>String handleCollision(String shortCode)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Create a batch of IDs in advance for speed</div><code>List&lt;String&gt; preGenerateIds(int batchSize)</code></div>
        </div>
        <div class="service-card">
            <h3>CacheService</h3>
            <p class="svc-desc">Stores popular URLs in memory (Redis) so they load faster</p>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Save a URL mapping in cache</div><code>void put(String shortCode, String originalUrl)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Get a URL from cache</div><code>Optional&lt;String&gt; get(String shortCode)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Remove a URL from cache</div><code>void evict(String shortCode)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Pre-load popular URLs into cache on startup</div><code>void warmUpCache(List&lt;ShortUrl&gt; hotUrls)</code></div>
        </div>
        <div class="service-card">
            <h3>UrlValidationService</h3>
            <p class="svc-desc">Checks if a URL is valid, safe, and not harmful before shortening</p>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Check if the URL format is correct</div><code>boolean isValidUrl(String url)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Check if the URL leads to a harmful site</div><code>boolean isMalicious(String url)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Check if a custom short code is available</div><code>boolean isCustomAliasAvailable(String alias)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Clean up and fix the URL format</div><code>String sanitizeUrl(String url)</code></div>
        </div>
        <div class="service-card">
            <h3>ExpirationService</h3>
            <p class="svc-desc">Removes expired URLs and warns users before their URLs expire</p>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Set an expiry date for a URL</div><code>void scheduleExpiration(ShortUrl url)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Delete all expired URLs (runs as scheduled job)</div><code>void cleanupExpiredUrls()</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Email users whose URLs are about to expire</div><code>void notifyExpiringUrls()</code></div>
        </div>
        <div class="service-card">
            <h3>AuthService</h3>
            <p class="svc-desc">Handles user signup, login, and API key management</p>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Register a new user</div><code>User register(String email, String password)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Log in and get a JWT token</div><code>String login(String email, String password)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Check if an API key is valid</div><code>boolean validateApiKey(String apiKey)</code></div>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Create a new JWT token for a user</div><code>String generateJwt(Long userId)</code></div>
        </div>
    </div>
</div>

<!-- ============ 10. KEY ARCHITECTURE FLOW ============ -->
<div class="section theme-blue">
    <div class="section-title"><span class="section-num">10</span>Key Architecture Flow</div>

    <div class="sub-heading" style="color:#4fc3f7;border-color:#4fc3f7">Base62 Encoding &mdash; How Short Codes Are Generated</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="cm">// Approach 1: Counter-Based (Recommended for production)</span>
<span class="cm">// Use a distributed counter (Redis INCR or DB sequence)</span>
<span class="cm">// Counter: 1000000001 &rarr; Base62 encode &rarr; "15FTGf"</span>

<span class="ann">@Service</span>
<span class="kw">class</span> <span class="cn">CounterBasedIdGenerator</span> <span class="kw">implements</span> <span class="iface">IIdGeneratorService</span> {
    <span class="ann">@Autowired</span> RedisTemplate&lt;String, Long&gt; redis;

    <span class="kw">public</span> String <span class="fn">generateId</span>() {
        <span class="cm">// Atomic increment in Redis &mdash; guaranteed unique</span>
        Long counter = redis.opsForValue().increment(<span class="st">"url:counter"</span>);
        <span class="kw">return</span> Base62.encode(counter);
    }
}

<span class="cm">// Approach 2: Range-Based Counter (multi-server safe)</span>
<span class="cm">// Server 1 gets range [1M - 2M], Server 2 gets [2M - 3M]</span>
<span class="cm">// Each server uses its range locally &mdash; no contention</span>

<span class="ann">@Service</span>
<span class="kw">class</span> <span class="cn">RangeBasedIdGenerator</span> <span class="kw">implements</span> <span class="iface">IIdGeneratorService</span> {
    <span class="kw">private</span> AtomicLong <span class="fn">current</span>;
    <span class="kw">private long</span> <span class="fn">rangeEnd</span>;

    <span class="kw">public synchronized</span> String <span class="fn">generateId</span>() {
        <span class="kw">if</span> (current.get() &gt;= rangeEnd) {
            fetchNewRange();  <span class="cm">// Get next range from ZooKeeper / DB</span>
        }
        <span class="kw">return</span> Base62.encode(current.getAndIncrement());
    }
}
    </pre></div>

    <div class="sub-heading" style="color:#4fc3f7;border-color:#4fc3f7">URL Create Flow</div>
    <div class="flow-container">
        <div class="flow-box flow-green">Client sends POST /api/v1/urls/shorten</div>
        <div class="flow-arrow arrow-green"></div>
        <div class="flow-box flow-blue">Validate URL (format + malicious check)</div>
        <div class="flow-arrow arrow-blue"></div>
        <div class="flow-box flow-purple">Check daily quota (user.canCreateUrl())</div>
        <div class="flow-arrow arrow-purple"></div>
        <div class="flow-box flow-orange">Check duplicate (same URL + same user?)</div>
        <div class="flow-arrow arrow-orange"></div>
        <div class="flow-box flow-teal">Generate short code (Base62 / custom alias)</div>
        <div class="flow-arrow arrow-teal"></div>
        <div class="flow-box flow-blue">Save to DB + populate cache</div>
        <div class="flow-arrow arrow-blue"></div>
        <div class="flow-box flow-green">Return short URL to client</div>
    </div>

    <div class="sub-heading" style="color:#4fc3f7;border-color:#4fc3f7">Redirect Flow (Read Path &mdash; Most Critical)</div>
    <div class="flow-container">
        <div class="flow-box flow-green">Browser hits GET /{shortCode}</div>
        <div class="flow-arrow arrow-green"></div>
        <div class="flow-box flow-blue">Check Redis Cache (O(1) lookup)</div>
        <div class="flow-arrow arrow-blue"></div>
        <div class="flow-box flow-orange">Cache HIT? Return 302 + Location header</div>
    </div>
    <div class="two-col">
        <div style="text-align:center">
            <div style="color:#25d366;font-weight:700;margin-bottom:10px">Cache HIT (99% of requests)</div>
            <div class="flow-container" style="padding:10px">
                <div class="flow-box flow-green" style="font-size:.85em">Return originalUrl from Redis</div>
                <div class="flow-arrow arrow-green"></div>
                <div class="flow-box flow-green" style="font-size:.85em">HTTP 302 Redirect</div>
                <div class="flow-arrow arrow-green"></div>
                <div class="flow-box flow-green" style="font-size:.85em">Async: record click in Kafka</div>
            </div>
        </div>
        <div style="text-align:center">
            <div style="color:#ff5252;font-weight:700;margin-bottom:10px">Cache MISS</div>
            <div class="flow-container" style="padding:10px">
                <div class="flow-box flow-red" style="font-size:.85em">Query DB by short_code index</div>
                <div class="flow-arrow" style="background:#ff5252"><div style="position:absolute;bottom:0;left:50%;transform:translateX(-50%);border-left:6px solid transparent;border-right:6px solid transparent;border-top:8px solid #ff5252"></div></div>
                <div class="flow-box flow-red" style="font-size:.85em">Populate cache for future hits</div>
                <div class="flow-arrow" style="background:#ff5252"><div style="position:absolute;bottom:0;left:50%;transform:translateX(-50%);border-left:6px solid transparent;border-right:6px solid transparent;border-top:8px solid #ff5252"></div></div>
                <div class="flow-box flow-red" style="font-size:.85em">302 Redirect or 404 if not found</div>
            </div>
        </div>
    </div>

    <div class="sub-heading" style="color:#4fc3f7;border-color:#4fc3f7">Collision Handling</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="cm">// Counter-based: NO collisions possible (each counter value is unique)</span>
<span class="cm">// Hash-based: Collisions possible &mdash; handle with retry + salt</span>

<span class="kw">public</span> String <span class="fn">generateWithCollisionHandling</span>(String originalUrl) {
    <span class="tp">int</span> attempt = 0;
    <span class="kw">while</span> (attempt &lt; MAX_RETRIES) {
        String hash = DigestUtils.md5Hex(originalUrl + attempt);
        String shortCode = hash.substring(0, 7);
        <span class="kw">if</span> (!urlRepository.existsByShortCode(shortCode)) {
            <span class="kw">return</span> shortCode;  <span class="cm">// No collision, use this code</span>
        }
        attempt++;  <span class="cm">// Collision! Append attempt number as salt and retry</span>
    }
    <span class="kw">throw new</span> RuntimeException(<span class="st">"Failed to generate unique code after "</span> + MAX_RETRIES + <span class="st">" attempts"</span>);
}

<span class="cm">// Why counter-based is preferred:</span>
<span class="cm">// 1. Zero collisions (monotonically increasing)</span>
<span class="cm">// 2. No DB existence check needed</span>
<span class="cm">// 3. Predictable performance O(1)</span>
    </pre></div>
</div>

<!-- ============ 11. DESIGN PATTERNS ============ -->
<div class="section theme-cyan">
    <div class="section-title"><span class="section-num">11</span>Design Patterns (with Implementation)</div>
    <div class="pattern-grid">
        <div class="pattern-card"><div class="pattern-name">Builder Pattern</div><div class="pattern-use">URL Creation with optional fields</div></div>
        <div class="pattern-card"><div class="pattern-name">Strategy Pattern</div><div class="pattern-use">ID Generation (Base62 / MD5 / Snowflake)</div></div>
        <div class="pattern-card"><div class="pattern-name">Factory Pattern</div><div class="pattern-use">Expiration Policy creation</div></div>
        <div class="pattern-card"><div class="pattern-name">Cache-Aside Pattern</div><div class="pattern-use">Redis read-through caching</div></div>
        <div class="pattern-card"><div class="pattern-name">Template Method</div><div class="pattern-use">URL Validation pipeline</div></div>
    </div>

    <div class="sub-heading" style="color:#18ffff;border-color:#18ffff">Builder Pattern &mdash; URL Creation</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">UrlBuilder</span> {
    <span class="kw">private</span> String <span class="fn">originalUrl</span>;
    <span class="kw">private</span> String <span class="fn">customAlias</span>;
    <span class="kw">private</span> User <span class="fn">user</span>;
    <span class="kw">private</span> LocalDateTime <span class="fn">expiresAt</span>;
    <span class="kw">private</span> String <span class="fn">shortCode</span>;

    <span class="kw">public</span> UrlBuilder <span class="fn">originalUrl</span>(String url)       { <span class="kw">this</span>.originalUrl = url; <span class="kw">return this</span>; }
    <span class="kw">public</span> UrlBuilder <span class="fn">customAlias</span>(String alias)      { <span class="kw">this</span>.customAlias = alias; <span class="kw">return this</span>; }
    <span class="kw">public</span> UrlBuilder <span class="fn">user</span>(User user)                { <span class="kw">this</span>.user = user; <span class="kw">return this</span>; }
    <span class="kw">public</span> UrlBuilder <span class="fn">expiresAt</span>(LocalDateTime exp)  { <span class="kw">this</span>.expiresAt = exp; <span class="kw">return this</span>; }
    <span class="kw">public</span> UrlBuilder <span class="fn">shortCode</span>(String code)         { <span class="kw">this</span>.shortCode = code; <span class="kw">return this</span>; }

    <span class="kw">public</span> Url <span class="fn">build</span>() {
        Url url = <span class="kw">new</span> Url();
        url.setOriginalUrl(originalUrl);
        url.setShortCode(customAlias != <span class="kw">null</span> ? customAlias : shortCode);
        url.setCustomAlias(customAlias);
        url.setUser(user);
        url.setExpiresAt(expiresAt);
        url.setStatus(UrlStatus.ACTIVE);
        <span class="kw">return</span> url;
    }
}

<span class="cm">// Usage in service:</span>
Url url = <span class="kw">new</span> UrlBuilder()
    .originalUrl(<span class="st">"https://example.com/long/path"</span>)
    .user(currentUser)
    .shortCode(idGenerator.generateId())
    .expiresAt(LocalDateTime.now().plusDays(30))
    .build();
    </pre></div>

    <div class="sub-heading" style="color:#18ffff;border-color:#18ffff">Strategy Pattern &mdash; ID Generation (Already Shown in Section 4)</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="ann">@Service</span>
<span class="kw">class</span> <span class="cn">IdGeneratorService</span> <span class="kw">implements</span> <span class="iface">IIdGeneratorService</span> {
    <span class="kw">private final</span> Map&lt;String, IdGenerationStrategy&gt; <span class="fn">strategies</span>;

    <span class="ann">@Value</span>(<span class="st">"\${url.id.strategy:BASE62_COUNTER}"</span>)
    <span class="kw">private</span> String <span class="fn">activeStrategy</span>;

    <span class="kw">public</span> String <span class="fn">generateId</span>() {
        <span class="kw">return</span> strategies.get(activeStrategy).generate();
    }
}
<span class="cm">// Open/Closed Principle: Add new strategy without modifying existing code</span>
<span class="cm">// Single Responsibility: Each strategy class has one job</span>
    </pre></div>

    <div class="sub-heading" style="color:#18ffff;border-color:#18ffff">Cache-Aside Pattern &mdash; Redis Read-Through</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="ann">@Service</span>
<span class="kw">class</span> <span class="cn">CacheService</span> <span class="kw">implements</span> <span class="iface">ICacheService</span> {
    <span class="ann">@Autowired</span> RedisTemplate&lt;String, String&gt; redisTemplate;
    <span class="kw">private static final long</span> TTL_HOURS = 24;

    <span class="kw">public</span> String <span class="fn">get</span>(String shortCode) {
        <span class="kw">return</span> redisTemplate.opsForValue().get(<span class="st">"url:"</span> + shortCode);
    }

    <span class="kw">public void</span> <span class="fn">put</span>(String shortCode, String originalUrl) {
        redisTemplate.opsForValue().set(
            <span class="st">"url:"</span> + shortCode, originalUrl, TTL_HOURS, TimeUnit.HOURS);
    }

    <span class="kw">public void</span> <span class="fn">evict</span>(String shortCode) {
        redisTemplate.delete(<span class="st">"url:"</span> + shortCode);
    }
}

<span class="cm">// Flow: Check cache &rarr; Cache miss &rarr; Query DB &rarr; Populate cache &rarr; Return</span>
<span class="cm">// Eviction: LRU policy + TTL. Evict on URL deletion/deactivation.</span>
    </pre></div>
</div>

<!-- ============ 12. SEQUENCE FLOW ============ -->
<div class="section theme-purple">
    <div class="section-title"><span class="section-num">12</span>Sequence Flow</div>

    <div class="sub-heading" style="color:#b388ff;border-color:#b388ff">Create Short URL Flow</div>
    <div class="flow-container">
        <div class="flow-box flow-green">Client &rarr; UrlController.createShortUrl(request)</div>
        <div class="flow-arrow arrow-green"></div>
        <div class="flow-box flow-blue">UrlValidationService.isValidUrl(originalUrl)</div>
        <div class="flow-arrow arrow-blue"></div>
        <div class="flow-box flow-purple">UrlValidationService.isMalicious(originalUrl)</div>
        <div class="flow-arrow arrow-purple"></div>
        <div class="flow-box flow-orange">Check user daily quota (countByUserIdAndCreatedAtAfter)</div>
        <div class="flow-arrow arrow-orange"></div>
        <div class="flow-box flow-teal">Check duplicate URL for this user</div>
        <div class="flow-arrow arrow-teal"></div>
        <div class="flow-box flow-blue">IdGeneratorService.generateId() &rarr; "aB3xK9p"</div>
        <div class="flow-arrow arrow-blue"></div>
        <div class="flow-box flow-purple">UrlBuilder.build() &rarr; Url entity</div>
        <div class="flow-arrow arrow-purple"></div>
        <div class="flow-box flow-green">UrlRepository.save(url) + CacheService.put()</div>
        <div class="flow-arrow arrow-green"></div>
        <div class="flow-box flow-green">Return CreateUrlResponse (shortUrl, expiresAt)</div>
    </div>

    <div class="sub-heading" style="color:#b388ff;border-color:#b388ff">Redirect Flow (Read Path)</div>
    <div class="flow-container">
        <div class="flow-box flow-green">Browser &rarr; RedirectController.redirect(shortCode)</div>
        <div class="flow-arrow arrow-green"></div>
        <div class="flow-box flow-blue">CacheService.get(shortCode)</div>
        <div class="flow-arrow arrow-blue"></div>
        <div class="flow-box flow-orange">Cache MISS? &rarr; UrlRepository.findByShortCode()</div>
        <div class="flow-arrow arrow-orange"></div>
        <div class="flow-box flow-purple">Url.isAccessible()? (status=ACTIVE &amp; not expired)</div>
        <div class="flow-arrow arrow-purple"></div>
        <div class="flow-box flow-teal">HTTP 302 Redirect with Location header</div>
        <div class="flow-arrow arrow-teal"></div>
        <div class="flow-box flow-green">Async: Kafka.send(ClickEvent) &rarr; AnalyticsService.recordClick()</div>
    </div>
</div>

<!-- ============ 13. CAPACITY ESTIMATION ============ -->
<div class="section theme-deepblue">
    <div class="section-title"><span class="section-num">13</span>Capacity Estimation</div>

    <div class="assumption-box">
        <h4>Assumptions (Bitly-Scale URL Shortener)</h4>
        <div class="assumption-row"><span class="calc-label">New URLs created / month</span><span class="calc-value">500 Million</span></div>
        <div class="assumption-row"><span class="calc-label">Read:Write ratio</span><span class="calc-value">100:1 (read heavy)</span></div>
        <div class="assumption-row"><span class="calc-label">Redirects per month</span><span class="calc-value">50 Billion</span></div>
        <div class="assumption-row"><span class="calc-label">Avg original URL size</span><span class="calc-value">200 bytes</span></div>
        <div class="assumption-row"><span class="calc-label">Short code length</span><span class="calc-value">7 characters</span></div>
        <div class="assumption-row"><span class="calc-label">URL retention period</span><span class="calc-value">5 years</span></div>
        <div class="assumption-row"><span class="calc-label">Total unique URLs (5 yrs)</span><span class="calc-value">30 Billion</span></div>
    </div>

    <div class="cap-grid">
        <div class="cap-card">
            <h4>Write QPS (URL Creation)</h4>
            <div class="calc-row"><span class="calc-label">URLs / month</span><span class="calc-value">500M</span></div>
            <div class="calc-row"><span class="calc-label">500M / 30 / 86400</span><span class="calc-value"></span></div>
            <div class="calc-result"><span class="calc-label">Write QPS</span><span class="calc-value">~200 QPS</span></div>
            <div class="calc-result"><span class="calc-label">Peak (3x)</span><span class="calc-value">~600 QPS</span></div>
        </div>

        <div class="cap-card">
            <h4>Read QPS (Redirects)</h4>
            <div class="calc-row"><span class="calc-label">Redirects / month</span><span class="calc-value">50B</span></div>
            <div class="calc-row"><span class="calc-label">50B / 30 / 86400</span><span class="calc-value"></span></div>
            <div class="calc-result"><span class="calc-label">Read QPS</span><span class="calc-value">~20K QPS</span></div>
            <div class="calc-result"><span class="calc-label">Peak (3x)</span><span class="calc-value">~60K QPS</span></div>
        </div>

        <div class="cap-card">
            <h4>Storage &mdash; URL Records (5 years)</h4>
            <div class="calc-row"><span class="calc-label">Total URLs (5 yrs)</span><span class="calc-value">30 Billion</span></div>
            <div class="calc-row"><span class="calc-label">Avg row size (with indexes)</span><span class="calc-value">~500 bytes</span></div>
            <div class="calc-result"><span class="calc-label">URL Table Storage</span><span class="calc-value">~15 TB</span></div>
        </div>

        <div class="cap-card">
            <h4>Storage &mdash; Click Analytics (per year)</h4>
            <div class="calc-row"><span class="calc-label">Clicks / year</span><span class="calc-value">600B</span></div>
            <div class="calc-row"><span class="calc-label">Click row size</span><span class="calc-value">~200 bytes</span></div>
            <div class="calc-result"><span class="calc-label">Analytics Storage / Year</span><span class="calc-value">~120 TB / year</span></div>
            <div class="calc-row" style="margin-top:6px"><span class="calc-label">Strategy</span><span class="calc-value">Partition by month, archive old data</span></div>
        </div>

        <div class="cap-card">
            <h4>Cache Sizing (Redis)</h4>
            <div class="calc-row"><span class="calc-label">Cache top 20% hot URLs</span><span class="calc-value"></span></div>
            <div class="calc-row"><span class="calc-label">30B &times; 20% = 6B URLs</span><span class="calc-value"></span></div>
            <div class="calc-row"><span class="calc-label">Key (15B) + Value (200B) = 215B</span><span class="calc-value"></span></div>
            <div class="calc-result"><span class="calc-label">Full Hot Set</span><span class="calc-value">~1.3 TB</span></div>
            <div class="calc-row" style="margin-top:6px"><span class="calc-label">Practical: cache recent + frequent</span><span class="calc-value"></span></div>
            <div class="calc-result"><span class="calc-label">Realistic Redis Size</span><span class="calc-value">~100-200 GB</span></div>
        </div>

        <div class="cap-card">
            <h4>Bandwidth</h4>
            <div class="calc-row"><span class="calc-label">Incoming (writes): 200 &times; 500B</span><span class="calc-value">~100 KB/s</span></div>
            <div class="calc-row"><span class="calc-label">Outgoing (reads): 20K &times; 500B</span><span class="calc-value">~10 MB/s</span></div>
            <div class="calc-result"><span class="calc-label">Total Bandwidth</span><span class="calc-value">~10 MB/s</span></div>
            <div class="calc-row" style="margin-top:6px"><span class="calc-label">Conclusion</span><span class="calc-value">Network is NOT the bottleneck</span></div>
        </div>

        <div class="cap-card">
            <h4>Short Code Space (62^7)</h4>
            <div class="calc-row"><span class="calc-label">62^7 possible codes</span><span class="calc-value">3.52 Trillion</span></div>
            <div class="calc-row"><span class="calc-label">URLs needed (5 yrs)</span><span class="calc-value">30 Billion</span></div>
            <div class="calc-result"><span class="calc-label">Utilization</span><span class="calc-value">&lt; 1%</span></div>
            <div class="calc-row" style="margin-top:6px"><span class="calc-label">Collision risk (counter)</span><span class="calc-value">Zero</span></div>
        </div>

        <div class="cap-card">
            <h4>Server Estimation</h4>
            <div class="calc-row"><span class="calc-label">Read QPS (peak)</span><span class="calc-value">60K</span></div>
            <div class="calc-row"><span class="calc-label">Each server handles</span><span class="calc-value">~5K QPS</span></div>
            <div class="calc-result"><span class="calc-label">App Servers Needed</span><span class="calc-value">~12 servers</span></div>
            <div class="calc-row" style="margin-top:6px"><span class="calc-label">Redis instances (cluster)</span><span class="calc-value">3-5 nodes</span></div>
            <div class="calc-result"><span class="calc-label">DB Read Replicas</span><span class="calc-value">3-5 replicas</span></div>
        </div>
    </div>

    <div style="margin-top:20px;padding:16px;background:rgba(130,177,255,.08);border-radius:12px;border:1px solid rgba(130,177,255,.15)">
        <strong style="color:#82b1ff">Key Takeaway for Interview:</strong>
        <p style="color:#b0bec5;font-size:.88em;margin-top:8px;line-height:1.7">
            URL Shortener is <strong style="color:#69f0ae">extremely read-heavy</strong> (100:1 ratio). Key design decisions:
            <strong style="color:#ffcc80">20K read QPS</strong> (Redis cache handles 99%+),
            <strong style="color:#ffcc80">7-char Base62 codes</strong> (3.5T capacity, &lt;1% used in 5 years),
            <strong style="color:#ffcc80">HTTP 302</strong> (not 301) to track analytics,
            and <strong style="color:#ffcc80">counter-based ID generation</strong> (zero collisions, O(1) performance).
        </p>
    </div>
</div>

<!-- ============ 14. BOTTLENECKS & SOLUTIONS ============ -->
<div class="section theme-red">
    <div class="section-title"><span class="section-num">14</span>Bottlenecks &amp; Solutions</div>
    <div class="bottleneck-grid">
        <div class="bottleneck-item"><span class="bottleneck-problem">Hot URL (millions of clicks)</span><span class="bottleneck-arrow">&#10132;</span><span class="bottleneck-solution">Redis cache with LRU + local in-memory cache (Caffeine)</span></div>
        <div class="bottleneck-item"><span class="bottleneck-problem">DB read overload at 20K QPS</span><span class="bottleneck-arrow">&#10132;</span><span class="bottleneck-solution">Cache-aside pattern: 99% cache hit ratio eliminates DB reads</span></div>
        <div class="bottleneck-item"><span class="bottleneck-problem">Analytics write storm</span><span class="bottleneck-arrow">&#10132;</span><span class="bottleneck-solution">Kafka async: clicks queued, batch-written by consumer</span></div>
        <div class="bottleneck-item"><span class="bottleneck-problem">Counter single point of failure</span><span class="bottleneck-arrow">&#10132;</span><span class="bottleneck-solution">Range-based counter: each server gets a pre-allocated range</span></div>
        <div class="bottleneck-item"><span class="bottleneck-problem">Analytics table grows too large</span><span class="bottleneck-arrow">&#10132;</span><span class="bottleneck-solution">Time-partitioning by month + aggregate into daily_stats table</span></div>
        <div class="bottleneck-item"><span class="bottleneck-problem">Cache stampede on popular expired key</span><span class="bottleneck-arrow">&#10132;</span><span class="bottleneck-solution">Distributed lock (Redisson) + cache warming on creation</span></div>
        <div class="bottleneck-item"><span class="bottleneck-problem">Global latency for users worldwide</span><span class="bottleneck-arrow">&#10132;</span><span class="bottleneck-solution">CDN edge redirect + geo-distributed Redis clusters</span></div>
    </div>
</div>

<!-- ============ 15. EDGE CASES ============ -->
<div class="section theme-amber">
    <div class="section-title"><span class="section-num">15</span>Edge Cases &amp; Error Handling</div>
    <div class="edge-grid">
        <div class="edge-card">
            <h4>URL Expiration</h4>
            <p>@Scheduled cron job runs every hour: finds ACTIVE URLs with expiresAt &lt; now(), marks them EXPIRED, evicts from cache. On redirect, double-check isAccessible() in case cron hasn't run yet.</p>
        </div>
        <div class="edge-card">
            <h4>Duplicate URLs</h4>
            <p>Same user shortening the same URL? Return existing short URL instead of creating a duplicate. Use findByOriginalUrlAndUserId() check. Different users for the same URL get different short codes.</p>
        </div>
        <div class="edge-card">
            <h4>Custom Alias Conflicts</h4>
            <p>User requests alias "sale" but it already exists. Return 409 Conflict with message "Alias already taken". Validate alias: alphanumeric + hyphens only, 3-30 chars, no reserved words (api, admin, health).</p>
        </div>
        <div class="edge-card">
            <h4>Hot URL (Viral Content)</h4>
            <p>A single URL getting millions of clicks/sec. Solution: two-level cache (Caffeine local cache + Redis). Async click recording via Kafka. Batch increment clickCount every 10 seconds, not per request.</p>
        </div>
        <div class="edge-card">
            <h4>404 Not Found / Expired URL</h4>
            <p>Short code doesn't exist or URL is expired/disabled. Return custom 404 page with "This link has expired or doesn't exist". Cache 404 responses briefly (negative caching) to prevent DB hammering.</p>
        </div>
        <div class="edge-card">
            <h4>Malicious URL Submitted</h4>
            <p>Check against Google Safe Browsing API before creating. If flagged, reject with 400 "URL flagged as malicious". Existing URLs: periodic background scan. If flagged post-creation, set status = FLAGGED.</p>
        </div>
        <div class="edge-card">
            <h4>Rate Limit Exceeded</h4>
            <p>User exceeds daily quota or API rate limit. Return 429 Too Many Requests with Retry-After header. Free tier: 100/day, Pro: 10K/day. Rate limit at API Gateway (token bucket algorithm).</p>
        </div>
        <div class="edge-card">
            <h4>Redirect Loop Detection</h4>
            <p>User tries to shorten a short URL (e.g., short.ly/abc &rarr; short.ly/xyz). Detect and reject with 400 "Cannot shorten URLs from this domain". Check if originalUrl hostname matches our service domain.</p>
        </div>
    </div>
</div>

<!-- ============ 16. SECURITY ============ -->
<div class="section theme-lime">
    <div class="section-title"><span class="section-num">16</span>Security</div>
    <div class="security-grid">
        <div class="security-item">
            <span class="shield">&#9670;</span>
            <div>Input Validation<div class="security-detail">Validate URL format (RFC 3986). Max length 2048 chars. Reject javascript:, data:, and file: schemes. Sanitize to prevent XSS/SSRF.</div></div>
        </div>
        <div class="security-item">
            <span class="shield">&#9670;</span>
            <div>Rate Limiting<div class="security-detail">Token bucket at API Gateway: 60 req/min for auth users, 10 req/min for anonymous. Bulk endpoint: 5 req/min. Sliding window counter per API key.</div></div>
        </div>
        <div class="security-item">
            <span class="shield">&#9670;</span>
            <div>Malicious URL Detection<div class="security-detail">Google Safe Browsing API lookup on creation. PhishTank integration. Periodic background re-scan of existing URLs. Auto-flag and disable.</div></div>
        </div>
        <div class="security-item">
            <span class="shield">&#9670;</span>
            <div>Authentication &amp; API Keys<div class="security-detail">JWT for web sessions (15 min access + refresh token). API key for programmatic access. Scoped permissions per tier.</div></div>
        </div>
        <div class="security-item">
            <span class="shield">&#9670;</span>
            <div>Authorization<div class="security-detail">Users can only view/delete/deactivate their own URLs. Admin role for flagging and global management. @PreAuthorize annotations.</div></div>
        </div>
        <div class="security-item">
            <span class="shield">&#9670;</span>
            <div>Abuse Prevention<div class="security-detail">CAPTCHA for anonymous URL creation. Blocklist of spam domains. IP-based throttling. Honeypot detection for bots.</div></div>
        </div>
        <div class="security-item">
            <span class="shield">&#9670;</span>
            <div>HTTPS Everywhere<div class="security-detail">All APIs and redirects over HTTPS. HSTS header enforced. Short URLs always generate https:// links.</div></div>
        </div>
        <div class="security-item">
            <span class="shield">&#9670;</span>
            <div>Custom Alias Abuse<div class="security-detail">Block reserved words (api, admin, login, health). Block offensive words filter. Validate format: ^[a-zA-Z0-9-]{3,30}$.</div></div>
        </div>
    </div>
</div>

<!-- ============ 17. INTERVIEW SUMMARY ============ -->
<div class="section theme-green">
    <div class="section-title"><span class="section-num">17</span>Interview Summary</div>
    <div class="summary-grid">
        <div class="summary-card sc-1"><h4>Base62 Counter</h4><p>7-char codes, 3.5T capacity, zero collisions</p></div>
        <div class="summary-card sc-2"><h4>HTTP 302 Redirect</h4><p>Not 301 &mdash; enables click analytics tracking</p></div>
        <div class="summary-card sc-3"><h4>Redis Cache-Aside</h4><p>99%+ cache hit ratio for read-heavy workload</p></div>
        <div class="summary-card sc-4"><h4>Kafka Async Analytics</h4><p>Decouple click recording from redirect path</p></div>
        <div class="summary-card sc-1"><h4>Read:Write = 100:1</h4><p>20K reads/sec vs 200 writes/sec</p></div>
        <div class="summary-card sc-2"><h4>Strategy Pattern</h4><p>Pluggable ID generation (Base62, MD5, Snowflake)</p></div>
        <div class="summary-card sc-3"><h4>Builder + Factory</h4><p>Clean URL creation with optional fields</p></div>
        <div class="summary-card sc-4"><h4>SOLID Principles</h4><p>ISP, OCP, SRP across all services</p></div>
        <div class="summary-card sc-1"><h4>Expiration Cron Job</h4><p>Scheduled cleanup + cache eviction</p></div>
    </div>
    <p style="text-align:center;margin-top:24px;color:#78909c;font-size:1em">
        Complete URL Shortener LLD for <strong style="color:#4fc3f7">Java Spring Boot</strong> interviews &mdash; covers Base62 encoding, caching strategy, async analytics, SOLID principles &amp; scalability.
    </p>
</div>
`
}
