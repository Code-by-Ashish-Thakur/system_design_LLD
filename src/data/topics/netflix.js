export default {
  title: "Netflix &mdash; Low Level Design",
  subtitle: "Complete LLD for Java Spring Boot Interview &mdash; Content Catalog, Streaming, Profiles &amp; Recommendations",
  subtitleColor: "#ffcdd2",
  headerGradient: "linear-gradient(135deg,#b71c1c,#c62828,#e53935)",
  footerText: "Netflix &mdash; Low Level Design",
  content: `
<div class="section theme-green">
    <div class="section-title"><span class="section-num">1</span>Functional Requirements</div>
    <div class="req-grid">
        <div class="req-pill"><span class="num">1</span> Content Catalog (Movies, Series, Episodes)</div>
        <div class="req-pill"><span class="num">2</span> User Profiles (up to 5 per account)</div>
        <div class="req-pill"><span class="num">3</span> Subscription Plans (Basic, Standard, Premium)</div>
        <div class="req-pill"><span class="num">4</span> Watch History &amp; Continue Watching</div>
        <div class="req-pill"><span class="num">5</span> Content Recommendation Engine</div>
        <div class="req-pill"><span class="num">6</span> Search with Filters (genre, year, language)</div>
        <div class="req-pill"><span class="num">7</span> Adaptive Bitrate Streaming (HLS)</div>
        <div class="req-pill"><span class="num">8</span> Download for Offline Viewing</div>
        <div class="req-pill"><span class="num">9</span> Parental Controls &amp; Age Rating</div>
        <div class="req-pill"><span class="num">10</span> Subtitles &amp; Audio Track Selection</div>
        <div class="req-pill"><span class="num">11</span> My List (Watchlist)</div>
        <div class="req-pill"><span class="num">12</span> Content Availability by Region (licensing)</div>
    </div>
</div>

<div class="section theme-blue">
    <div class="section-title"><span class="section-num">2</span>Core Entities</div>
    <div class="entity-grid">
        <div class="entity-card">
            <h3>Content</h3>
            <div class="field"><span class="field-name">id</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">title</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">description</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">type</span><span class="field-type">ContentType</span></div>
            <div class="field"><span class="field-name">genres</span><span class="field-type">List&lt;Genre&gt;</span></div>
            <div class="field"><span class="field-name">ageRating</span><span class="field-type">AgeRating</span></div>
            <div class="field"><span class="field-name">releaseYear</span><span class="field-type">int</span></div>
            <div class="field"><span class="field-name">duration</span><span class="field-type">int (min)</span></div>
            <div class="field"><span class="field-name">languages</span><span class="field-type">List&lt;String&gt;</span></div>
            <div class="field"><span class="field-name">cast</span><span class="field-type">List&lt;String&gt;</span></div>
            <div class="field"><span class="field-name">director</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">thumbnailUrl</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">trailerUrl</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">avgRating</span><span class="field-type">double</span></div>
            <div class="field"><span class="field-name">regions</span><span class="field-type">List&lt;String&gt;</span></div>
        </div>
        <div class="entity-card">
            <h3>Episode</h3>
            <div class="field"><span class="field-name">id</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">contentId</span><span class="field-type">Long (series)</span></div>
            <div class="field"><span class="field-name">seasonNumber</span><span class="field-type">int</span></div>
            <div class="field"><span class="field-name">episodeNumber</span><span class="field-type">int</span></div>
            <div class="field"><span class="field-name">title</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">duration</span><span class="field-type">int (min)</span></div>
            <div class="field"><span class="field-name">streamUrl</span><span class="field-type">String</span></div>
        </div>
        <div class="entity-card">
            <h3>Profile</h3>
            <div class="field"><span class="field-name">id</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">accountId</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">name</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">avatarUrl</span><span class="field-type">String</span></div>
            <div class="field"><span class="field-name">isKids</span><span class="field-type">boolean</span></div>
            <div class="field"><span class="field-name">maturityLevel</span><span class="field-type">AgeRating</span></div>
            <div class="field"><span class="field-name">language</span><span class="field-type">String</span></div>
        </div>
        <div class="entity-card">
            <h3>Subscription</h3>
            <div class="field"><span class="field-name">id</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">accountId</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">plan</span><span class="field-type">PlanType</span></div>
            <div class="field"><span class="field-name">maxScreens</span><span class="field-type">int</span></div>
            <div class="field"><span class="field-name">maxResolution</span><span class="field-type">Resolution</span></div>
            <div class="field"><span class="field-name">status</span><span class="field-type">SubStatus</span></div>
            <div class="field"><span class="field-name">startDate</span><span class="field-type">LocalDate</span></div>
            <div class="field"><span class="field-name">endDate</span><span class="field-type">LocalDate</span></div>
        </div>
        <div class="entity-card">
            <h3>WatchHistory</h3>
            <div class="field"><span class="field-name">id</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">profileId</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">contentId</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">episodeId</span><span class="field-type">Long (nullable)</span></div>
            <div class="field"><span class="field-name">watchedSeconds</span><span class="field-type">int</span></div>
            <div class="field"><span class="field-name">totalSeconds</span><span class="field-type">int</span></div>
            <div class="field"><span class="field-name">completed</span><span class="field-type">boolean</span></div>
            <div class="field"><span class="field-name">lastWatchedAt</span><span class="field-type">LocalDateTime</span></div>
        </div>
        <div class="entity-card">
            <h3>Watchlist</h3>
            <div class="field"><span class="field-name">id</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">profileId</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">contentId</span><span class="field-type">Long</span></div>
            <div class="field"><span class="field-name">addedAt</span><span class="field-type">LocalDateTime</span></div>
        </div>
    </div>
</div>

<div class="section theme-purple">
    <div class="section-title"><span class="section-num">3</span>Enums</div>
    <div class="enum-grid">
        <div class="enum-card"><h3>ContentType</h3><div class="enum-val">MOVIE</div><div class="enum-val">SERIES</div><div class="enum-val">DOCUMENTARY</div><div class="enum-val">SHORT</div></div>
        <div class="enum-card"><h3>Genre</h3><div class="enum-val">ACTION</div><div class="enum-val">COMEDY</div><div class="enum-val">DRAMA</div><div class="enum-val">THRILLER</div><div class="enum-val">HORROR</div><div class="enum-val">SCI_FI</div><div class="enum-val">ROMANCE</div><div class="enum-val">ANIME</div></div>
        <div class="enum-card"><h3>AgeRating</h3><div class="enum-val">U</div><div class="enum-val">UA_7</div><div class="enum-val">UA_13</div><div class="enum-val">UA_16</div><div class="enum-val">A (18+)</div></div>
        <div class="enum-card"><h3>PlanType</h3><div class="enum-val">MOBILE</div><div class="enum-val">BASIC</div><div class="enum-val">STANDARD</div><div class="enum-val">PREMIUM</div></div>
        <div class="enum-card"><h3>SubStatus</h3><div class="enum-val">ACTIVE</div><div class="enum-val">PAUSED</div><div class="enum-val">CANCELLED</div><div class="enum-val">EXPIRED</div></div>
    </div>
</div>

<div class="section theme-green">
    <div class="section-title"><span class="section-num">4</span>Interfaces &amp; SOLID Principles</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span><span class="code-title">NetflixInterfaces.java</span></div>
    <pre class="code-block">
<span class="kw">public interface</span> <span class="tp">IContentService</span> {
    <span class="tp">Content</span> <span class="fn">getById</span>(<span class="tp">Long</span> id, <span class="tp">String</span> region);
    <span class="tp">Page</span>&lt;<span class="tp">Content</span>&gt; <span class="fn">browse</span>(<span class="tp">BrowseRequest</span> req, <span class="tp">Pageable</span> p);
    <span class="tp">Page</span>&lt;<span class="tp">Content</span>&gt; <span class="fn">search</span>(<span class="tp">String</span> query, <span class="tp">SearchFilters</span> filters, <span class="tp">Pageable</span> p);
}

<span class="kw">public interface</span> <span class="tp">IRecommendationEngine</span> {
    <span class="tp">List</span>&lt;<span class="tp">Content</span>&gt; <span class="fn">getPersonalized</span>(<span class="tp">Long</span> profileId, <span class="kw">int</span> limit);
    <span class="tp">List</span>&lt;<span class="tp">Content</span>&gt; <span class="fn">getSimilar</span>(<span class="tp">Long</span> contentId, <span class="kw">int</span> limit);
    <span class="tp">List</span>&lt;<span class="tp">Content</span>&gt; <span class="fn">getTrending</span>(<span class="tp">String</span> region, <span class="kw">int</span> limit);
}

<span class="kw">public interface</span> <span class="tp">IStreamingService</span> {
    <span class="tp">StreamManifest</span> <span class="fn">getStream</span>(<span class="tp">Long</span> contentId, <span class="tp">Long</span> profileId);
    <span class="kw">void</span> <span class="fn">updateProgress</span>(<span class="tp">Long</span> profileId, <span class="tp">Long</span> contentId, <span class="kw">int</span> watchedSec);
}

<span class="kw">public interface</span> <span class="tp">ISubscriptionService</span> {
    <span class="tp">Subscription</span> <span class="fn">subscribe</span>(<span class="tp">Long</span> accountId, <span class="tp">PlanType</span> plan);
    <span class="kw">boolean</span> <span class="fn">canStream</span>(<span class="tp">Long</span> accountId);
    <span class="kw">int</span> <span class="fn">getActiveScreenCount</span>(<span class="tp">Long</span> accountId);
}
    </pre></div>
</div>

<div class="section theme-blue">
    <div class="section-title"><span class="section-num">5</span>Class Design (JPA Entities)</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span><span class="code-title">Content.java — JPA Entity</span></div>
    <pre class="code-block">
<span class="ann">@Entity</span>
<span class="ann">@Table</span>(name = <span class="st">"content"</span>, indexes = {
    <span class="ann">@Index</span>(name = <span class="st">"idx_content_type"</span>, columnList = <span class="st">"type"</span>),
    <span class="ann">@Index</span>(name = <span class="st">"idx_content_year"</span>, columnList = <span class="st">"release_year DESC"</span>)
})
<span class="kw">public class</span> <span class="tp">Content</span> {
    <span class="ann">@Id</span> <span class="ann">@GeneratedValue</span>(strategy = <span class="tp">GenerationType</span>.IDENTITY)
    <span class="kw">private</span> <span class="tp">Long</span> id;

    <span class="ann">@Column</span>(nullable = <span class="kw">false</span>)
    <span class="kw">private</span> <span class="tp">String</span> title;
    <span class="ann">@Column</span>(columnDefinition = <span class="st">"TEXT"</span>)
    <span class="kw">private</span> <span class="tp">String</span> description;

    <span class="ann">@Enumerated</span>(<span class="tp">EnumType</span>.STRING)
    <span class="kw">private</span> <span class="tp">ContentType</span> type;

    <span class="ann">@ElementCollection</span>
    <span class="ann">@Enumerated</span>(<span class="tp">EnumType</span>.STRING)
    <span class="kw">private</span> <span class="tp">List</span>&lt;<span class="tp">Genre</span>&gt; genres;

    <span class="ann">@Enumerated</span>(<span class="tp">EnumType</span>.STRING)
    <span class="kw">private</span> <span class="tp">AgeRating</span> ageRating;

    <span class="kw">private int</span> releaseYear;
    <span class="kw">private int</span> duration;
    <span class="kw">private double</span> avgRating;

    <span class="ann">@ElementCollection</span>
    <span class="kw">private</span> <span class="tp">List</span>&lt;<span class="tp">String</span>&gt; languages;

    <span class="ann">@ElementCollection</span>
    <span class="kw">private</span> <span class="tp">List</span>&lt;<span class="tp">String</span>&gt; regions; <span class="cm">// Available in these countries</span>

    <span class="ann">@OneToMany</span>(mappedBy = <span class="st">"content"</span>, cascade = <span class="tp">CascadeType</span>.ALL)
    <span class="kw">private</span> <span class="tp">List</span>&lt;<span class="tp">Episode</span>&gt; episodes;
}
    </pre></div>
</div>

<div class="section theme-purple">
    <div class="section-title"><span class="section-num">6</span>Repository / DAO Layer</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span><span class="code-title">ContentRepository.java</span></div>
    <pre class="code-block">
<span class="kw">public interface</span> <span class="tp">ContentRepository</span> <span class="kw">extends</span> <span class="tp">JpaRepository</span>&lt;<span class="tp">Content</span>, <span class="tp">Long</span>&gt; {
    <span class="tp">Page</span>&lt;<span class="tp">Content</span>&gt; <span class="fn">findByTypeAndRegionsContaining</span>(
        <span class="tp">ContentType</span> type, <span class="tp">String</span> region, <span class="tp">Pageable</span> p);

    <span class="ann">@Query</span>(<span class="st">"SELECT c FROM Content c JOIN c.genres g WHERE g = :genre AND :region MEMBER OF c.regions"</span>)
    <span class="tp">Page</span>&lt;<span class="tp">Content</span>&gt; <span class="fn">findByGenreAndRegion</span>(
        <span class="ann">@Param</span>(<span class="st">"genre"</span>) <span class="tp">Genre</span> genre, <span class="ann">@Param</span>(<span class="st">"region"</span>) <span class="tp">String</span> region, <span class="tp">Pageable</span> p);

    <span class="tp">Page</span>&lt;<span class="tp">Content</span>&gt; <span class="fn">findByAgeRatingIn</span>(
        <span class="tp">List</span>&lt;<span class="tp">AgeRating</span>&gt; ratings, <span class="tp">Pageable</span> p);
}

<span class="kw">public interface</span> <span class="tp">WatchHistoryRepository</span> <span class="kw">extends</span> <span class="tp">JpaRepository</span>&lt;<span class="tp">WatchHistory</span>, <span class="tp">Long</span>&gt; {
    <span class="tp">Optional</span>&lt;<span class="tp">WatchHistory</span>&gt; <span class="fn">findByProfileIdAndContentId</span>(<span class="tp">Long</span> profileId, <span class="tp">Long</span> contentId);
    <span class="tp">Page</span>&lt;<span class="tp">WatchHistory</span>&gt; <span class="fn">findByProfileIdAndCompletedFalseOrderByLastWatchedAtDesc</span>(
        <span class="tp">Long</span> profileId, <span class="tp">Pageable</span> p); <span class="cm">// Continue watching</span>
    <span class="tp">Page</span>&lt;<span class="tp">WatchHistory</span>&gt; <span class="fn">findByProfileIdOrderByLastWatchedAtDesc</span>(<span class="tp">Long</span> profileId, <span class="tp">Pageable</span> p);
}

<span class="kw">public interface</span> <span class="tp">ProfileRepository</span> <span class="kw">extends</span> <span class="tp">JpaRepository</span>&lt;<span class="tp">Profile</span>, <span class="tp">Long</span>&gt; {
    <span class="tp">List</span>&lt;<span class="tp">Profile</span>&gt; <span class="fn">findByAccountId</span>(<span class="tp">Long</span> accountId);
    <span class="kw">long</span> <span class="fn">countByAccountId</span>(<span class="tp">Long</span> accountId); <span class="cm">// max 5</span>
}
    </pre></div>
</div>

<div class="section theme-green">
    <div class="section-title"><span class="section-num">7</span>Database Schema</div>
    <div class="db-grid">
        <div class="db-card">
            <h3>content</h3>
            <div class="db-row"><span class="col-name">id</span><span class="col-type">BIGINT</span><span class="col-constraint">PK</span></div>
            <div class="db-row"><span class="col-name">title</span><span class="col-type">VARCHAR(255)</span><span class="col-constraint">FULLTEXT IDX</span></div>
            <div class="db-row"><span class="col-name">description</span><span class="col-type">TEXT</span><span class="col-constraint"></span></div>
            <div class="db-row"><span class="col-name">type</span><span class="col-type">ENUM</span><span class="col-constraint">IDX</span></div>
            <div class="db-row"><span class="col-name">age_rating</span><span class="col-type">ENUM</span><span class="col-constraint">IDX</span></div>
            <div class="db-row"><span class="col-name">release_year</span><span class="col-type">INT</span><span class="col-constraint">IDX</span></div>
            <div class="db-row"><span class="col-name">duration</span><span class="col-type">INT</span><span class="col-constraint"></span></div>
            <div class="db-row"><span class="col-name">avg_rating</span><span class="col-type">DOUBLE</span><span class="col-constraint"></span></div>
            <div class="db-row"><span class="col-name">thumbnail_url</span><span class="col-type">VARCHAR(1024)</span><span class="col-constraint"></span></div>
            <div class="db-row"><span class="col-name">trailer_url</span><span class="col-type">VARCHAR(1024)</span><span class="col-constraint"></span></div>
        </div>
        <div class="db-card">
            <h3>episodes</h3>
            <div class="db-row"><span class="col-name">id</span><span class="col-type">BIGINT</span><span class="col-constraint">PK</span></div>
            <div class="db-row"><span class="col-name">content_id</span><span class="col-type">BIGINT</span><span class="col-constraint">FK → content(id) IDX</span></div>
            <div class="db-row"><span class="col-name">season_number</span><span class="col-type">INT</span><span class="col-constraint"></span></div>
            <div class="db-row"><span class="col-name">episode_number</span><span class="col-type">INT</span><span class="col-constraint"></span></div>
            <div class="db-row"><span class="col-name">title</span><span class="col-type">VARCHAR(255)</span><span class="col-constraint"></span></div>
            <div class="db-row"><span class="col-name">duration</span><span class="col-type">INT</span><span class="col-constraint"></span></div>
            <div class="db-row"><span class="col-name">stream_url</span><span class="col-type">VARCHAR(1024)</span><span class="col-constraint"></span></div>
        </div>
        <div class="db-card">
            <h3>profiles</h3>
            <div class="db-row"><span class="col-name">id</span><span class="col-type">BIGINT</span><span class="col-constraint">PK</span></div>
            <div class="db-row"><span class="col-name">account_id</span><span class="col-type">BIGINT</span><span class="col-constraint">FK IDX</span></div>
            <div class="db-row"><span class="col-name">name</span><span class="col-type">VARCHAR(64)</span><span class="col-constraint"></span></div>
            <div class="db-row"><span class="col-name">is_kids</span><span class="col-type">BOOLEAN</span><span class="col-constraint">DEFAULT FALSE</span></div>
            <div class="db-row"><span class="col-name">maturity_level</span><span class="col-type">ENUM</span><span class="col-constraint"></span></div>
            <div class="db-row"><span class="col-name">language</span><span class="col-type">VARCHAR(10)</span><span class="col-constraint"></span></div>
        </div>
        <div class="db-card">
            <h3>subscriptions</h3>
            <div class="db-row"><span class="col-name">id</span><span class="col-type">BIGINT</span><span class="col-constraint">PK</span></div>
            <div class="db-row"><span class="col-name">account_id</span><span class="col-type">BIGINT</span><span class="col-constraint">FK IDX</span></div>
            <div class="db-row"><span class="col-name">plan</span><span class="col-type">ENUM</span><span class="col-constraint"></span></div>
            <div class="db-row"><span class="col-name">max_screens</span><span class="col-type">INT</span><span class="col-constraint"></span></div>
            <div class="db-row"><span class="col-name">max_resolution</span><span class="col-type">ENUM</span><span class="col-constraint"></span></div>
            <div class="db-row"><span class="col-name">status</span><span class="col-type">ENUM</span><span class="col-constraint">IDX</span></div>
            <div class="db-row"><span class="col-name">start_date</span><span class="col-type">DATE</span><span class="col-constraint"></span></div>
            <div class="db-row"><span class="col-name">end_date</span><span class="col-type">DATE</span><span class="col-constraint">IDX</span></div>
        </div>
        <div class="db-card">
            <h3>watch_history</h3>
            <div class="db-row"><span class="col-name">id</span><span class="col-type">BIGINT</span><span class="col-constraint">PK</span></div>
            <div class="db-row"><span class="col-name">profile_id</span><span class="col-type">BIGINT</span><span class="col-constraint">FK IDX</span></div>
            <div class="db-row"><span class="col-name">content_id</span><span class="col-type">BIGINT</span><span class="col-constraint">FK IDX</span></div>
            <div class="db-row"><span class="col-name">episode_id</span><span class="col-type">BIGINT</span><span class="col-constraint">FK (nullable)</span></div>
            <div class="db-row"><span class="col-name">watched_seconds</span><span class="col-type">INT</span><span class="col-constraint"></span></div>
            <div class="db-row"><span class="col-name">completed</span><span class="col-type">BOOLEAN</span><span class="col-constraint">IDX</span></div>
            <div class="db-row"><span class="col-name">last_watched_at</span><span class="col-type">TIMESTAMP</span><span class="col-constraint">IDX</span></div>
        </div>
    </div>
</div>

<div class="section theme-blue">
    <div class="section-title"><span class="section-num">8</span>API Endpoints</div>
    <div class="api-grid">
        <div class="api-card"><div class="api-method get">GET</div><div class="api-path">/api/v1/browse?genre=ACTION&amp;page=0</div><div class="api-desc">Browse content catalog by genre/type</div></div>
        <div class="api-card"><div class="api-method get">GET</div><div class="api-path">/api/v1/search?q=stranger&amp;year=2024</div><div class="api-desc">Search content with filters</div></div>
        <div class="api-card"><div class="api-method get">GET</div><div class="api-path">/api/v1/content/{id}</div><div class="api-desc">Get content details + episodes (if series)</div></div>
        <div class="api-card"><div class="api-method get">GET</div><div class="api-path">/api/v1/content/{id}/stream</div><div class="api-desc">Get HLS manifest URL (checks subscription + region + DRM)</div></div>
        <div class="api-card"><div class="api-method get">GET</div><div class="api-path">/api/v1/recommendations</div><div class="api-desc">Get personalized recommendations for profile</div></div>
        <div class="api-card"><div class="api-method get">GET</div><div class="api-path">/api/v1/continue-watching</div><div class="api-desc">Get "Continue Watching" row for profile</div></div>
        <div class="api-card"><div class="api-method put">PUT</div><div class="api-path">/api/v1/watch-progress</div><div class="api-desc">Update watch progress (called every 30s during playback)</div></div>
        <div class="api-card"><div class="api-method post">POST</div><div class="api-path">/api/v1/watchlist/{contentId}</div><div class="api-desc">Add to My List</div></div>
        <div class="api-card"><div class="api-method get">GET</div><div class="api-path">/api/v1/profiles</div><div class="api-desc">Get all profiles for account</div></div>
        <div class="api-card"><div class="api-method post">POST</div><div class="api-path">/api/v1/profiles</div><div class="api-desc">Create profile (max 5 per account)</div></div>
        <div class="api-card"><div class="api-method get">GET</div><div class="api-path">/api/v1/trending</div><div class="api-desc">Top 10 trending in user's region</div></div>
    </div>
</div>

<div class="section theme-purple">
    <div class="section-title"><span class="section-num">9</span>Service Layer</div>
    <div class="service-grid">
        <div class="service-card">
            <h3>ContentService</h3>
            <p class="svc-desc">Shows movies and shows available in the user's region and age group</p>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Get content details (checks region and maturity level)</div><code>Content getById(Long contentId, String region)</code></div>
        </div>
        <div class="service-card">
            <h3>StreamingService</h3>
            <p class="svc-desc">Delivers video stream — checks subscription, screen limit, and returns the video URL</p>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Get the stream URL for a movie/show</div><code>StreamResponse getStream(Long contentId, Long profileId)</code></div>
        </div>
        <div class="service-card">
            <h3>RecommendationEngine</h3>
            <p class="svc-desc">Suggests movies and shows based on what the user has watched before</p>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Get personalized recommendations for a profile</div><code>List&lt;Content&gt; getPersonalized(Long profileId)</code></div>
        </div>
        <div class="service-card">
            <h3>SearchService</h3>
            <p class="svc-desc">Helps users find content by title, genre, or actor with auto-complete and fuzzy matching</p>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Search for movies or shows</div><code>Page&lt;Content&gt; search(String query, SearchFilters filters)</code></div>
        </div>
        <div class="service-card">
            <h3>ProfileService</h3>
            <p class="svc-desc">Manages profiles under one account — max 5 profiles, kids profile has content filter</p>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Create a new profile</div><code>Profile create(Long accountId, ProfileRequest profile)</code></div>
        </div>
        <div class="service-card">
            <h3>SubscriptionService</h3>
            <p class="svc-desc">Checks if user can stream — is plan active? how many screens allowed? what quality?</p>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Check if account is allowed to stream</div><code>boolean canStream(Long accountId)</code></div>
        </div>
        <div class="service-card">
            <h3>WatchHistoryService</h3>
            <p class="svc-desc">Tracks what user watched and where they stopped — used for "Continue Watching"</p>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Save or update watch progress</div><code>void updateProgress(Long profileId, Long contentId, int seconds)</code></div>
        </div>
        <div class="service-card">
            <h3>DownloadService</h3>
            <p class="svc-desc">Lets users download content for offline viewing (limited by plan)</p>
            <div class="svc-fn"><div class="fn-desc"><span class="method-dot"></span> Start a download for offline viewing</div><code>DownloadPackage requestDownload(Long contentId)</code></div>
        </div>
    </div>
</div>

<div class="section theme-green">
    <div class="section-title"><span class="section-num">10</span>Key Architecture</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span><span class="code-title">RecommendationEngine.java — Collaborative + Content-Based</span></div>
    <pre class="code-block">
<span class="ann">@Service</span>
<span class="kw">public class</span> <span class="tp">RecommendationEngine</span> <span class="kw">implements</span> <span class="tp">IRecommendationEngine</span> {
    <span class="kw">private final</span> <span class="tp">RedisTemplate</span>&lt;<span class="tp">String</span>, <span class="tp">List</span>&lt;<span class="tp">Long</span>&gt;&gt; redis;
    <span class="kw">private final</span> <span class="tp">WatchHistoryRepository</span> historyRepo;
    <span class="kw">private final</span> <span class="tp">ContentRepository</span> contentRepo;

    <span class="cm">// Pre-computed by Apache Spark batch job (runs daily)</span>
    <span class="cm">// Stored in Redis: "reco:{profileId}" → [contentId1, contentId2, ...]</span>

    <span class="ann">@Override</span>
    <span class="kw">public</span> <span class="tp">List</span>&lt;<span class="tp">Content</span>&gt; <span class="fn">getPersonalized</span>(<span class="tp">Long</span> profileId, <span class="kw">int</span> limit) {
        <span class="tp">String</span> key = <span class="st">"reco:"</span> + profileId;
        <span class="tp">List</span>&lt;<span class="tp">Long</span>&gt; contentIds = redis.<span class="fn">opsForValue</span>().<span class="fn">get</span>(key);

        <span class="kw">if</span> (contentIds == <span class="kw">null</span>) {
            <span class="cm">// Fallback: real-time content-based recommendation</span>
            contentIds = <span class="fn">computeContentBased</span>(profileId, limit);
        }

        <span class="cm">// Filter out already watched + apply maturity filter</span>
        <span class="tp">Set</span>&lt;<span class="tp">Long</span>&gt; watched = historyRepo
            .<span class="fn">findByProfileIdAndCompletedTrue</span>(profileId)
            .stream().<span class="fn">map</span>(<span class="tp">WatchHistory</span>::getContentId)
            .<span class="fn">collect</span>(<span class="tp">Collectors</span>.<span class="fn">toSet</span>());

        <span class="kw">return</span> contentIds.stream()
            .<span class="fn">filter</span>(id -&gt; !watched.<span class="fn">contains</span>(id))
            .<span class="fn">limit</span>(limit)
            .<span class="fn">map</span>(contentRepo::<span class="fn">findById</span>)
            .<span class="fn">filter</span>(<span class="tp">Optional</span>::isPresent)
            .<span class="fn">map</span>(<span class="tp">Optional</span>::get)
            .<span class="fn">collect</span>(<span class="tp">Collectors</span>.<span class="fn">toList</span>());
    }

    <span class="kw">private</span> <span class="tp">List</span>&lt;<span class="tp">Long</span>&gt; <span class="fn">computeContentBased</span>(<span class="tp">Long</span> profileId, <span class="kw">int</span> limit) {
        <span class="cm">// Find user's top genres from watch history</span>
        <span class="cm">// Score content by genre overlap + popularity + recency</span>
        <span class="cm">// Return top-N content IDs</span>
        <span class="kw">return</span> contentRepo.<span class="fn">findTopByGenresAndPopularity</span>(profileId, limit);
    }
}
    </pre></div>
</div>

<div class="section theme-blue">
    <div class="section-title"><span class="section-num">11</span>Design Patterns Used</div>
    <div class="pattern-grid">
        <div class="pattern-card"><h3>Strategy</h3><p>IRecommendationAlgorithm — swap between collaborative filtering, content-based, or hybrid</p></div>
        <div class="pattern-card"><h3>Observer</h3><p>Watch events → Kafka → update recommendations, trending lists, analytics pipeline</p></div>
        <div class="pattern-card"><h3>Decorator</h3><p>ContentFilter chain: RegionFilter → MaturityFilter → SubscriptionFilter wraps content service</p></div>
        <div class="pattern-card"><h3>Factory</h3><p>ContentFactory creates Movie/Series/Documentary with type-specific behavior</p></div>
        <div class="pattern-card"><h3>Proxy</h3><p>CDN as caching proxy for stream segments; signed URLs control access</p></div>
        <div class="pattern-card"><h3>Builder</h3><p>BrowseRequest.builder().genre().type().year().region().maturity().build()</p></div>
    </div>
</div>

<div class="section theme-purple">
    <div class="section-title"><span class="section-num">12</span>Sequence Flow</div>
    <div class="flow-container">
        <div class="flow-step"><span class="step-num">1</span><span class="step-text">User opens app → selects profile → loads personalized homepage</span></div>
        <div class="flow-step"><span class="step-num">2</span><span class="step-text">Homepage: Continue Watching + Trending + Recommended rows from Redis cache</span></div>
        <div class="flow-step"><span class="step-num">3</span><span class="step-text">User selects content → GET /content/{id} loads details + episodes</span></div>
        <div class="flow-step"><span class="step-num">4</span><span class="step-text">User clicks Play → GET /content/{id}/stream</span></div>
        <div class="flow-step"><span class="step-num">5</span><span class="step-text">StreamingService checks: subscription active? concurrent screens? region license?</span></div>
        <div class="flow-step"><span class="step-num">6</span><span class="step-text">Returns signed HLS manifest URL (time-limited, DRM-protected)</span></div>
        <div class="flow-step"><span class="step-num">7</span><span class="step-text">Player fetches .ts segments from nearest CDN edge</span></div>
        <div class="flow-step"><span class="step-num">8</span><span class="step-text">ABR algorithm adjusts quality based on bandwidth</span></div>
        <div class="flow-step"><span class="step-num">9</span><span class="step-text">Watch progress sent every 30s → updates Continue Watching</span></div>
        <div class="flow-step"><span class="step-num">10</span><span class="step-text">View event published to Kafka → updates recommendations + trending</span></div>
    </div>
</div>

<div class="section theme-green">
    <div class="section-title"><span class="section-num">13</span>Capacity Estimation</div>
    <div class="cap-grid">
        <div class="cap-card"><div class="cap-label">Total Subscribers</div><div class="cap-value">250M</div></div>
        <div class="cap-card"><div class="cap-label">Daily Active Users</div><div class="cap-value">100M</div></div>
        <div class="cap-card"><div class="cap-label">Concurrent Streams</div><div class="cap-value">~15M peak</div></div>
        <div class="cap-card"><div class="cap-label">Content Library</div><div class="cap-value">~20,000 titles</div></div>
        <div class="cap-card"><div class="cap-label">CDN Bandwidth</div><div class="cap-value">~100 Tbps peak</div></div>
        <div class="cap-card"><div class="cap-label">Watch Progress Writes</div><div class="cap-value">~500K writes/sec</div></div>
        <div class="cap-card"><div class="cap-label">Recommendation Cache</div><div class="cap-value">~50 GB Redis (250M profiles × 200B each)</div></div>
        <div class="cap-card"><div class="cap-label">Avg Session Duration</div><div class="cap-value">~90 minutes</div></div>
        <div class="cap-card">
            <h4 style="color:#82b1ff;margin-bottom:8px">CPU / Server Estimation</h4>
            <div class="calc-row"><span class="calc-label">Concurrent streams (peak)</span><span class="calc-value">~15M</span></div>
            <div class="calc-row"><span class="calc-label">Watch progress writes/sec</span><span class="calc-value">~500K/sec</span></div>
            <div class="calc-row"><span class="calc-label">Each API server handles</span><span class="calc-value">~10K QPS</span></div>
            <div class="calc-result"><span class="calc-label">API Servers Needed</span><span class="calc-value">~50 servers</span></div>
            <div class="calc-result"><span class="calc-label">Total CPU Cores (8 per server)</span><span class="calc-value">~400 cores</span></div>
            <div class="calc-row"><span class="calc-label">Recommendation Engine</span><span class="calc-value">Spark cluster (100+ nodes)</span></div>
            <div class="calc-row"><span class="calc-label">Redis Cluster (cache)</span><span class="calc-value">10-20 nodes</span></div>
            <div class="calc-row"><span class="calc-label">CDN Edge Servers</span><span class="calc-value">10,000+ globally</span></div>
        </div>
    </div>
</div>

<div class="section theme-blue">
    <div class="section-title"><span class="section-num">14</span>Bottlenecks &amp; Solutions</div>
    <div class="bottleneck-grid">
        <div class="bottleneck-card"><h3>Homepage Cold Start</h3><p>Pre-compute personalized homepage per profile (Spark); cache in Redis; fallback to trending</p></div>
        <div class="bottleneck-card"><h3>New User Recommendations</h3><p>Cold start: show popular by region/genre; ask genre preferences on signup; content-based until enough data</p></div>
        <div class="bottleneck-card"><h3>Concurrent Screen Enforcement</h3><p>Redis SET per accountId with active deviceIds + TTL; check count before allowing new stream</p></div>
        <div class="bottleneck-card"><h3>Watch Progress Write Storm</h3><p>Buffer in Redis (per-profile key); batch flush to DB every 5 minutes; async via Kafka</p></div>
        <div class="bottleneck-card"><h3>Content Catalog Search</h3><p>Elasticsearch with regional content index; autocomplete with fuzzy matching; n-gram tokenizer</p></div>
        <div class="bottleneck-card"><h3>Regional Content Licensing</h3><p>Content-region mapping table; cache in Redis; CDN edge checks region from IP geolocation</p></div>
    </div>
</div>

<div class="section theme-purple">
    <div class="section-title"><span class="section-num">15</span>Edge Cases</div>
    <div class="edge-grid">
        <div class="edge-card"><h3>Max Screens Exceeded</h3><p>Show "too many screens" error; allow user to sign out remote device; admin override</p></div>
        <div class="edge-card"><h3>Content Removed Mid-Watch</h3><p>License expiry: allow finish if started within license period; remove from browse + recommendations</p></div>
        <div class="edge-card"><h3>Profile Limit Reached</h3><p>Max 5 profiles; show "max profiles" error; suggest deleting unused profile</p></div>
        <div class="edge-card"><h3>Subscription Expired Mid-Stream</h3><p>Allow current session to finish; block new streams; show renewal prompt</p></div>
        <div class="edge-card"><h3>Offline Download Expired</h3><p>Downloads valid for 48h after first play or 7 days from download; require re-download</p></div>
        <div class="edge-card"><h3>VPN / Region Bypass</h3><p>IP geolocation check; DNS-based detection; block known VPN IP ranges</p></div>
    </div>
</div>

<div class="section theme-green">
    <div class="section-title"><span class="section-num">16</span>Security Considerations</div>
    <div class="security-grid">
        <div class="security-card"><h3>DRM Protection</h3><p>Widevine (Android/Chrome), FairPlay (iOS/Safari), PlayReady (Edge); encrypted HLS segments</p></div>
        <div class="security-card"><h3>Stream URL Security</h3><p>Signed URLs with expiry (1 hour); IP-locked tokens; prevent hotlinking/sharing</p></div>
        <div class="security-card"><h3>Account Sharing</h3><p>Device fingerprinting; unusual location detection; password verification for new devices</p></div>
        <div class="security-card"><h3>Kids Profile Safety</h3><p>Maturity filter enforced server-side; PIN to exit kids profile; restricted search</p></div>
        <div class="security-card"><h3>Payment Security</h3><p>PCI-DSS compliant payment; tokenized card storage; 3D Secure for card payments</p></div>
    </div>
</div>

<div class="section theme-blue">
    <div class="section-title"><span class="section-num">17</span>Interview Cheat-Sheet</div>
    <div class="summary-grid">
        <div class="summary-card"><strong>Recommendations</strong><br>Collaborative filtering (Spark batch) + content-based (real-time fallback); cached in Redis per profile</div>
        <div class="summary-card"><strong>Streaming</strong><br>HLS adaptive bitrate; CDN edge delivery (100 Tbps); signed URLs with DRM</div>
        <div class="summary-card"><strong>Profiles</strong><br>Max 5 per account; independent watch history + recommendations; kids mode with maturity filter</div>
        <div class="summary-card"><strong>Continue Watching</strong><br>Progress saved every 30s; Redis buffer → batch DB write; marks complete at 95%</div>
        <div class="summary-card"><strong>Concurrent Screens</strong><br>Redis SET per account with device IDs; enforce max screens per plan type</div>
        <div class="summary-card"><strong>Regional Licensing</strong><br>Content-region mapping; IP geolocation at CDN edge; VPN detection</div>
        <div class="summary-card"><strong>Scale</strong><br>250M subs, 100M DAU, 15M concurrent streams, 100 Tbps CDN</div>
        <div class="summary-card"><strong>Patterns</strong><br>Strategy, Observer, Decorator, Factory, Proxy, Builder</div>
    </div>
</div>

</div></div>
<!-- END NETFLIX -->

<!-- START SYSTEM DESIGN -->
`
}
