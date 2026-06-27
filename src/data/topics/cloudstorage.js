export default {
  title: "Cloud Storage &mdash; Low Level Design",
  subtitle: "Complete LLD for Google Drive / Dropbox &mdash; Java Spring Boot Interview",
  subtitleColor: "#bbdefb",
  headerGradient: "linear-gradient(135deg,#1a73e8,#4285f4,#8ab4f8)",
  footerText: "Cloud Storage (Google Drive / Dropbox) &mdash; LLD",
  content: `
<!-- ============ 1. FUNCTIONAL REQUIREMENTS ============ -->
<div class="section theme-green">
    <div class="section-title"><span class="section-num">1</span>Functional Requirements</div>
    <div class="req-grid">
        <div class="req-pill"><span class="num">1</span><div class="fr-content"><div class="fr-en">User Registration &amp; Login (OAuth / Email)</div><div class="fr-hi">Google Drive me Google account, Dropbox me email/Google OAuth se login hota hai — bina auth ke files access karna security risk hai</div></div></div>
        <div class="req-pill"><span class="num">2</span><div class="fr-content"><div class="fr-en">File Upload (Chunked / Resumable)</div><div class="fr-hi">Ye core feature hai — large files (GB+) ke liye chunked upload zaroori hai, beech me fail ho to resume ho sake. S3 pe store hota hai with metadata in DB</div></div></div>
        <div class="req-pill"><span class="num">3</span><div class="fr-content"><div class="fr-en">File Download</div><div class="fr-hi">User apni files kisi bhi device se download kar sake — signed URL se secure download, CDN se fast delivery. Bulk download = zip karna padta hai</div></div></div>
        <div class="req-pill"><span class="num">4</span><div class="fr-content"><div class="fr-en">Folder Management (Create / Rename / Move / Delete)</div><div class="fr-hi">Files organize karne ke liye folders zaroori hai — nested folders tree structure me store hoti hai with parent_id reference. Move = parent_id update karna</div></div></div>
        <div class="req-pill"><span class="num">5</span><div class="fr-content"><div class="fr-en">File Sharing (Link / User / Team)</div><div class="fr-hi">Ye collaboration ka core hai — link sharing (anyone with link), specific user ko invite, team folders. Permission levels: viewer, commenter, editor</div></div></div>
        <div class="req-pill"><span class="num">6</span><div class="fr-content"><div class="fr-en">File Sync Across Devices</div><div class="fr-hi">Laptop pe file save karo, phone pe automatically dikhe — delta sync se sirf changes transfer hote hai (full file nahi). WebSocket/long-polling se real-time sync</div></div></div>
        <div class="req-pill"><span class="num">7</span><div class="fr-content"><div class="fr-en">File Versioning (History &amp; Restore)</div><div class="fr-hi">Galti se file overwrite ho gayi? Version history se purana version restore kar sakte ho. Google Drive 100 versions rakhta hai, Dropbox 30 days tak</div></div></div>
        <div class="req-pill"><span class="num">8</span><div class="fr-content"><div class="fr-en">Search Files (Name, Content, Type)</div><div class="fr-hi">Thousands of files me se dhundhna — Elasticsearch se file name, content (OCR for images, text extraction for PDFs), file type se search hota hai</div></div></div>
        <div class="req-pill"><span class="num">9</span><div class="fr-content"><div class="fr-en">Trash &amp; Restore</div><div class="fr-hi">Delete karne pe file trash me jaati hai — 30 days tak restore kar sakte ho. Permanent delete ke baad S3 se bhi hat jaati hai. Accidental deletion prevention</div></div></div>
        <div class="req-pill"><span class="num">10</span><div class="fr-content"><div class="fr-en">File Preview (Images, PDFs, Docs)</div><div class="fr-hi">Bina download kiye file preview dikhana — images browser me render, PDFs reader me, docs Google Docs/Office Online me open hote hai</div></div></div>
        <div class="req-pill"><span class="num">11</span><div class="fr-content"><div class="fr-en">Real-time Collaboration (Google Docs style)</div><div class="fr-hi">Multiple users ek document simultaneously edit kar sake — Operational Transform (OT) ya CRDT se conflict resolve hota hai, cursor position real-time dikhta hai</div></div></div>
        <div class="req-pill"><span class="num">12</span><div class="fr-content"><div class="fr-en">Storage Quota Management</div><div class="fr-hi">Har user ko limited storage milta hai (Google 15GB free, Dropbox 2GB) — quota exceed hone pe upload block, upgrade option dikhao</div></div></div>
        <div class="req-pill"><span class="num">13</span><div class="fr-content"><div class="fr-en">Offline Access</div><div class="fr-hi">Internet na ho tab bhi files access ho — client app files locally cache karta hai, online aane pe sync ho jaata hai. Conflict resolution zaroori hai offline edits ke liye</div></div></div>
        <div class="req-pill"><span class="num">14</span><div class="fr-content"><div class="fr-en">Activity Log &amp; Notifications</div><div class="fr-hi">Kaun ne kya kiya track karna — file edit, share, comment sab activity log me aata hai. Shared file me change ho to notification jaata hai</div></div></div>
    </div>
</div>

<!-- ============ 2. NON-FUNCTIONAL REQUIREMENTS ============ -->
<div class="section theme-pink">
    <div class="section-title"><span class="section-num">2</span>Non-Functional Requirements</div>
    <div class="req-grid">
        <div class="req-pill"><span class="num">1</span><div class="nfr-content"><div class="nfr-en">High Durability &mdash; 99.999999999% (11 nines) data durability</div><div class="nfr-hi">User ki file kabhi lost nahi honi chahiye — S3 11 nines durability deta hai, cross-region replication zaroori hai</div></div></div>
        <div class="req-pill"><span class="num">2</span><div class="nfr-content"><div class="nfr-en">High Availability &mdash; 99.99% uptime</div><div class="nfr-hi">Files hamesha accessible honi chahiye — multi-AZ deployment, failover ready</div></div></div>
        <div class="req-pill"><span class="num">3</span><div class="nfr-content"><div class="nfr-en">Low Latency &mdash; File operations under 200ms</div><div class="nfr-hi">Upload/download/sync operations fast hone chahiye — CDN + edge caching se latency kam hoti hai</div></div></div>
        <div class="req-pill"><span class="num">4</span><div class="nfr-content"><div class="nfr-en">Scalability &mdash; Handle billions of files, millions of users</div><div class="nfr-hi">Billions of files store karne padenge — metadata sharding + S3 infinite storage + horizontal scaling</div></div></div>
        <div class="req-pill"><span class="num">5</span><div class="nfr-content"><div class="nfr-en">Consistency &mdash; Strong consistency for metadata, eventual for sync</div><div class="nfr-hi">File rename turant dikhna chahiye (strong), cross-device sync me 2-3 sec delay OK (eventual)</div></div></div>
        <div class="req-pill"><span class="num">6</span><div class="nfr-content"><div class="nfr-en">Security &mdash; Encryption at rest and in transit</div><div class="nfr-hi">Files encrypted honi chahiye storage pe (AES-256) aur transfer me (TLS) — unauthorized access impossible hona chahiye</div></div></div>
    </div>
</div>

<!-- ============ 3. ENUMS ============ -->
<div class="section theme-purple">
    <div class="section-title"><span class="section-num">3</span>Enums</div>
    <div class="enum-grid">
        <div class="enum-card"><h3>FileType</h3><div class="enum-val">DOCUMENT</div><div class="enum-val">SPREADSHEET</div><div class="enum-val">PRESENTATION</div><div class="enum-val">IMAGE</div><div class="enum-val">VIDEO</div><div class="enum-val">PDF</div><div class="enum-val">ARCHIVE</div><div class="enum-val">OTHER</div></div>
        <div class="enum-card"><h3>SyncStatus</h3><div class="enum-val">SYNCED</div><div class="enum-val">SYNCING</div><div class="enum-val">PENDING</div><div class="enum-val">CONFLICT</div><div class="enum-val">ERROR</div></div>
        <div class="enum-card"><h3>SharePermission</h3><div class="enum-val">VIEWER</div><div class="enum-val">COMMENTER</div><div class="enum-val">EDITOR</div><div class="enum-val">OWNER</div></div>
        <div class="enum-card"><h3>ShareType</h3><div class="enum-val">PRIVATE</div><div class="enum-val">LINK_VIEW</div><div class="enum-val">LINK_EDIT</div><div class="enum-val">SPECIFIC_USERS</div></div>
        <div class="enum-card"><h3>FileAction</h3><div class="enum-val">CREATED</div><div class="enum-val">UPLOADED</div><div class="enum-val">EDITED</div><div class="enum-val">RENAMED</div><div class="enum-val">MOVED</div><div class="enum-val">DELETED</div><div class="enum-val">SHARED</div><div class="enum-val">RESTORED</div></div>
        <div class="enum-card"><h3>ConflictStrategy</h3><div class="enum-val">KEEP_BOTH</div><div class="enum-val">KEEP_LOCAL</div><div class="enum-val">KEEP_REMOTE</div><div class="enum-val">MERGE</div></div>
    </div>
</div>

<!-- ============ 4. SERVICE LLD ============ -->
<div class="section theme-yellow">
    <div class="section-title"><span class="section-num">4</span>Service LLD</div>
    <div class="service-grid">
        <div class="service-card">
            <h3>FileService</h3>
            <p class="svc-desc">File upload, download, rename, move, delete ka poora lifecycle handle karta hai</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">FileService</span> {

    <span class="cm">// chunked upload initiate karta hai</span>
    <span class="tp">UploadSession</span> <span class="fn">initiateUpload</span>(<span class="tp">Long</span> userId,
        <span class="tp">String</span> fileName, <span class="tp">long</span> fileSize,
        <span class="tp">String</span> folderId, <span class="tp">String</span> contentHash)

    <span class="cm">// ek chunk upload karta hai</span>
    <span class="tp">ChunkResponse</span> <span class="fn">uploadChunk</span>(<span class="tp">String</span> uploadId,
        <span class="tp">int</span> chunkNum, <span class="tp">byte[]</span> data, <span class="tp">String</span> chunkHash)

    <span class="cm">// upload complete karke file record banata hai</span>
    <span class="tp">FileMetadata</span> <span class="fn">completeUpload</span>(<span class="tp">String</span> uploadId)

    <span class="cm">// file download ke liye signed URL deta hai</span>
    <span class="tp">String</span> <span class="fn">getDownloadUrl</span>(<span class="tp">String</span> fileId,
        <span class="tp">Long</span> userId, <span class="tp">int</span> expiryMin)

    <span class="cm">// file rename karta hai</span>
    <span class="tp">FileMetadata</span> <span class="fn">rename</span>(<span class="tp">String</span> fileId,
        <span class="tp">String</span> newName, <span class="tp">Long</span> userId)

    <span class="cm">// file move karta hai dusre folder me</span>
    <span class="tp">FileMetadata</span> <span class="fn">move</span>(<span class="tp">String</span> fileId,
        <span class="tp">String</span> targetFolderId, <span class="tp">Long</span> userId)

    <span class="cm">// file soft delete (trash me daalta hai)</span>
    <span class="kw">void</span> <span class="fn">delete</span>(<span class="tp">String</span> fileId, <span class="tp">Long</span> userId)
}
</pre></div>
        </div>
        <div class="service-card">
            <h3>FolderService</h3>
            <p class="svc-desc">Folder create, rename, move aur tree structure manage karta hai — nested folders ke liye recursive queries</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">FolderService</span> {

    <span class="cm">// naya folder create karta hai</span>
    <span class="tp">Folder</span> <span class="fn">create</span>(<span class="tp">Long</span> userId, <span class="tp">String</span> name,
        <span class="tp">String</span> parentFolderId)

    <span class="cm">// folder ke contents list karta hai (files + subfolders)</span>
    <span class="tp">FolderContents</span> <span class="fn">getContents</span>(<span class="tp">String</span> folderId,
        <span class="tp">Long</span> userId, <span class="tp">String</span> sortBy, <span class="tp">int</span> page)

    <span class="cm">// folder rename karta hai</span>
    <span class="tp">Folder</span> <span class="fn">rename</span>(<span class="tp">String</span> folderId,
        <span class="tp">String</span> newName, <span class="tp">Long</span> userId)

    <span class="cm">// folder ka breadcrumb path return karta hai</span>
    <span class="tp">List&lt;Folder&gt;</span> <span class="fn">getBreadcrumb</span>(<span class="tp">String</span> folderId)

    <span class="cm">// folder aur sab contents delete karta hai (recursive)</span>
    <span class="kw">void</span> <span class="fn">delete</span>(<span class="tp">String</span> folderId, <span class="tp">Long</span> userId)
}
</pre></div>
        </div>
        <div class="service-card">
            <h3>SyncService</h3>
            <p class="svc-desc">Cross-device sync handle karta hai — delta sync se sirf changed blocks transfer, conflict detection aur resolution</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">SyncService</span> {

    <span class="cm">// client ke local state se diff nikalta hai</span>
    <span class="tp">SyncDiff</span> <span class="fn">getDiff</span>(<span class="tp">Long</span> userId,
        <span class="tp">long</span> lastSyncCursor)

    <span class="cm">// client ke changes server pe apply karta hai</span>
    <span class="tp">SyncResult</span> <span class="fn">applyChanges</span>(<span class="tp">Long</span> userId,
        <span class="tp">List&lt;FileChange&gt;</span> changes)

    <span class="cm">// conflict detect aur resolve karta hai</span>
    <span class="tp">ConflictResult</span> <span class="fn">resolveConflict</span>(<span class="tp">String</span> fileId,
        <span class="tp">ConflictStrategy</span> strategy)

    <span class="cm">// long-polling se real-time change notifications</span>
    <span class="tp">List&lt;FileChange&gt;</span> <span class="fn">waitForChanges</span>(
        <span class="tp">Long</span> userId, <span class="tp">long</span> cursor, <span class="tp">int</span> timeoutSec)
}
</pre></div>
        </div>
        <div class="service-card">
            <h3>ShareService</h3>
            <p class="svc-desc">File/folder sharing handle karta hai — link sharing, user invite, permission management</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">ShareService</span> {

    <span class="cm">// shareable link generate karta hai</span>
    <span class="tp">ShareLink</span> <span class="fn">createShareLink</span>(<span class="tp">String</span> fileId,
        <span class="tp">SharePermission</span> permission, <span class="tp">Long</span> ownerId)

    <span class="cm">// specific user ko invite karta hai</span>
    <span class="kw">void</span> <span class="fn">shareWithUser</span>(<span class="tp">String</span> fileId,
        <span class="tp">String</span> email, <span class="tp">SharePermission</span> permission,
        <span class="tp">Long</span> ownerId)

    <span class="cm">// permission update karta hai</span>
    <span class="kw">void</span> <span class="fn">updatePermission</span>(<span class="tp">String</span> fileId,
        <span class="tp">Long</span> userId, <span class="tp">SharePermission</span> newPermission)

    <span class="cm">// sharing revoke karta hai</span>
    <span class="kw">void</span> <span class="fn">revokeAccess</span>(<span class="tp">String</span> fileId,
        <span class="tp">Long</span> userId, <span class="tp">Long</span> ownerId)

    <span class="cm">// file ke saare collaborators list karta hai</span>
    <span class="tp">List&lt;Collaborator&gt;</span> <span class="fn">getCollaborators</span>(
        <span class="tp">String</span> fileId)
}
</pre></div>
        </div>
        <div class="service-card">
            <h3>VersionService</h3>
            <p class="svc-desc">File versioning handle karta hai — har edit pe naya version banta hai, purana restore kar sakte ho</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">VersionService</span> {

    <span class="cm">// naya version create karta hai (file edit pe)</span>
    <span class="tp">FileVersion</span> <span class="fn">createVersion</span>(<span class="tp">String</span> fileId,
        <span class="tp">String</span> storageKey, <span class="tp">long</span> size, <span class="tp">Long</span> userId)

    <span class="cm">// file ki version history return karta hai</span>
    <span class="tp">List&lt;FileVersion&gt;</span> <span class="fn">getVersions</span>(<span class="tp">String</span> fileId)

    <span class="cm">// purana version restore karta hai (current ban jaata hai)</span>
    <span class="tp">FileMetadata</span> <span class="fn">restoreVersion</span>(<span class="tp">String</span> fileId,
        <span class="tp">String</span> versionId, <span class="tp">Long</span> userId)
}
</pre></div>
        </div>
        <div class="service-card">
            <h3>SearchService</h3>
            <p class="svc-desc">Files me search karta hai — file name, content, type, owner, date se filter</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">SearchService</span> {

    <span class="cm">// files search karta hai with filters</span>
    <span class="tp">Page&lt;FileMetadata&gt;</span> <span class="fn">search</span>(<span class="tp">Long</span> userId,
        <span class="tp">String</span> query, <span class="tp">SearchFilters</span> filters,
        <span class="tp">int</span> page, <span class="tp">int</span> size)

    <span class="cm">// file content ko search index me add karta hai</span>
    <span class="kw">void</span> <span class="fn">indexFile</span>(<span class="tp">String</span> fileId,
        <span class="tp">String</span> extractedText)

    <span class="cm">// recently accessed files return karta hai</span>
    <span class="tp">List&lt;FileMetadata&gt;</span> <span class="fn">getRecent</span>(<span class="tp">Long</span> userId,
        <span class="tp">int</span> limit)
}
</pre></div>
        </div>
        <div class="service-card">
            <h3>TrashService</h3>
            <p class="svc-desc">Trash management — soft delete, restore, permanent delete aur auto-cleanup (30 days)</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">TrashService</span> {

    <span class="cm">// trash me files list karta hai</span>
    <span class="tp">List&lt;FileMetadata&gt;</span> <span class="fn">getTrash</span>(<span class="tp">Long</span> userId)

    <span class="cm">// trash se restore karta hai original location pe</span>
    <span class="tp">FileMetadata</span> <span class="fn">restore</span>(<span class="tp">String</span> fileId, <span class="tp">Long</span> userId)

    <span class="cm">// permanently delete karta hai (S3 se bhi)</span>
    <span class="kw">void</span> <span class="fn">permanentDelete</span>(<span class="tp">String</span> fileId, <span class="tp">Long</span> userId)

    <span class="cm">// 30 days purane trashed files auto-delete (cron job)</span>
    <span class="kw">void</span> <span class="fn">cleanupExpiredTrash</span>()
}
</pre></div>
        </div>
        <div class="service-card">
            <h3>StorageService</h3>
            <p class="svc-desc">S3 operations, deduplication, quota management aur storage analytics handle karta hai</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Java</span></div><pre class="code-block">
<span class="kw">class</span> <span class="cn">StorageService</span> {

    <span class="cm">// S3 pe file store karta hai with dedup check</span>
    <span class="tp">String</span> <span class="fn">store</span>(<span class="tp">byte[]</span> data, <span class="tp">String</span> contentHash)

    <span class="cm">// content hash se dedup check (already exists?)</span>
    <span class="tp">boolean</span> <span class="fn">isDuplicate</span>(<span class="tp">String</span> contentHash)

    <span class="cm">// user ka storage usage return karta hai</span>
    <span class="tp">StorageUsage</span> <span class="fn">getUsage</span>(<span class="tp">Long</span> userId)

    <span class="cm">// quota check karta hai upload se pehle</span>
    <span class="tp">boolean</span> <span class="fn">hasQuota</span>(<span class="tp">Long</span> userId, <span class="tp">long</span> fileSize)
}
</pre></div>
        </div>
    </div>
</div>

<!-- ============ 5. APIs ============ -->
<div class="section theme-teal">
    <div class="section-title"><span class="section-num">5</span>APIs (with Request / Response)</div>
    <div class="api-grid">
        <div class="api-card">
            <div class="api-header"><span class="api-method method-post">POST</span><span class="api-path">/api/v1/files/upload/init</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Request</div>{
  "fileName": "project-report.pdf",
  "fileSize": 52428800,
  "contentHash": "sha256:abc123...",
  "folderId": "folder-root",
  "mimeType": "application/pdf"
}</div>
                <div class="api-json"><div class="label">Response 201</div>{
  "uploadId": "up-xyz789",
  "chunkSize": 4194304,
  "totalChunks": 13,
  "isDuplicate": false,
  "uploadUrl": "https://upload.drive.app/up-xyz789"
}</div>
            </div>
            <div class="api-note">Chunked upload initiate karta hai — contentHash se dedup check hota hai, agar same file already exist karti hai to instant upload (no data transfer). 4MB chunks me upload hoga</div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-get">GET</span><span class="api-path">/api/v1/folders/{folderId}/contents?sort=name&amp;page=1</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Response 200</div>{
  "folderId": "folder-abc",
  "folderName": "Projects",
  "breadcrumb": [
    { "id": "root", "name": "My Drive" },
    { "id": "folder-abc", "name": "Projects" }
  ],
  "items": [
    { "id": "file-1", "name": "report.pdf", "type": "FILE",
      "size": 5242880, "modifiedAt": "2025-06-15T10:00:00Z",
      "sharedWith": 3 },
    { "id": "folder-2", "name": "Backend", "type": "FOLDER",
      "itemCount": 15, "modifiedAt": "2025-06-14T08:00:00Z" }
  ],
  "storageUsed": 5368709120,
  "storageLimit": 16106127360
}</div>
            </div>
            <div class="api-note">Folder ke contents list karta hai — files + subfolders sorted. Breadcrumb se navigation path dikhta hai. Storage usage bhi return hota hai</div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-post">POST</span><span class="api-path">/api/v1/files/{fileId}/share</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Request</div>{
  "shareType": "SPECIFIC_USERS",
  "users": [
    { "email": "rahul@gmail.com", "permission": "EDITOR" },
    { "email": "priya@gmail.com", "permission": "VIEWER" }
  ],
  "notifyUsers": true,
  "message": "Please review this document"
}</div>
                <div class="api-json"><div class="label">Response 200</div>{
  "fileId": "file-abc123",
  "sharedWith": [
    { "email": "rahul@gmail.com", "permission": "EDITOR", "status": "INVITED" },
    { "email": "priya@gmail.com", "permission": "VIEWER", "status": "INVITED" }
  ],
  "shareLink": null
}</div>
            </div>
            <div class="api-note">Specific users ko file share karta hai with permissions — EDITOR edit kar sakta hai, VIEWER sirf dekh sakta hai. Email notification jaata hai invite ke saath</div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-get">GET</span><span class="api-path">/api/v1/files/{fileId}/versions</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Response 200</div>{
  "fileId": "file-abc123",
  "currentVersion": "v-5",
  "versions": [
    { "versionId": "v-5", "size": 5242880, "modifiedBy": "Rahul",
      "modifiedAt": "2025-06-15T10:00:00Z", "isCurrent": true },
    { "versionId": "v-4", "size": 5100000, "modifiedBy": "Priya",
      "modifiedAt": "2025-06-14T15:30:00Z", "isCurrent": false }
  ]
}</div>
            </div>
            <div class="api-note">File ki version history dikhata hai — har edit pe automatic version banta hai. Purana version restore kar sakte ho, download bhi kar sakte ho</div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-post">POST</span><span class="api-path">/api/v1/sync</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Request</div>{
  "cursor": 1718445600,
  "localChanges": [
    { "fileId": "file-1", "action": "EDITED", "contentHash": "sha256:def456...",
      "modifiedAt": "2025-06-15T10:05:00Z" },
    { "fileId": null, "action": "CREATED", "fileName": "notes.txt",
      "folderId": "folder-abc", "contentHash": "sha256:ghi789..." }
  ]
}</div>
                <div class="api-json"><div class="label">Response 200</div>{
  "newCursor": 1718445900,
  "serverChanges": [
    { "fileId": "file-2", "action": "EDITED", "downloadUrl": "..." }
  ],
  "conflicts": [
    { "fileId": "file-1", "type": "EDIT_CONFLICT",
      "localVersion": "v-5", "serverVersion": "v-6" }
  ],
  "applied": 1
}</div>
            </div>
            <div class="api-note">Bidirectional sync — client local changes bhejta hai, server apne changes return karta hai. Conflict detect hone pe client ko resolve karna padta hai (keep both / keep local / keep remote)</div>
        </div>
        <div class="api-card">
            <div class="api-header"><span class="api-method method-get">GET</span><span class="api-path">/api/v1/search?q={query}&amp;type=pdf&amp;modifiedAfter=2025-06-01</span></div>
            <div class="api-body">
                <div class="api-json"><div class="label">Response 200</div>{
  "results": [
    { "fileId": "file-abc", "name": "project-report.pdf",
      "path": "/Projects/Backend/", "size": 5242880,
      "matchIn": "content", "snippet": "...system design interview...",
      "modifiedAt": "2025-06-15T10:00:00Z" }
  ],
  "totalResults": 5
}</div>
            </div>
            <div class="api-note">Elasticsearch se search — file name + content (extracted text from PDFs, docs) me search hota hai. Filters: file type, date, owner, folder. Snippet dikhata hai matching text</div>
        </div>
    </div>
</div>

<!-- ============ 6. DATABASE SCHEMA ============ -->
<div class="section theme-pink">
    <div class="section-title"><span class="section-num">6</span>Database Schema</div>
    <div class="dbtech-grid">
        <div class="dbtech-card">
            <div class="dbtech-name">PostgreSQL <span class="dbtech-type">RDBMS</span></div>
            <div class="dbtech-usage">File/folder metadata, shares, versions — strong consistency aur ACID ke liye</div>
            <div class="dbtech-tables"><span>users</span><span>files</span><span>folders</span><span>shares</span><span>versions</span><span>activity_log</span></div>
        </div>
        <div class="dbtech-card">
            <div class="dbtech-name">Redis <span class="dbtech-type">Cache + Locks</span></div>
            <div class="dbtech-usage">Sync cursors, file locks (editing), quota cache, session management</div>
            <div class="dbtech-tables"><span>sync_cursor:{userId}</span><span>file_lock:{fileId}</span><span>quota:{userId}</span></div>
        </div>
        <div class="dbtech-card">
            <div class="dbtech-name">S3 <span class="dbtech-type">Object Storage</span></div>
            <div class="dbtech-usage">Actual file content — content-addressable storage (hash as key) for deduplication</div>
            <div class="dbtech-tables"><span>blocks/{hash}</span><span>thumbnails/</span></div>
        </div>
        <div class="dbtech-card">
            <div class="dbtech-name">Elasticsearch <span class="dbtech-type">Search</span></div>
            <div class="dbtech-usage">File name + content search — full-text indexing with OCR for images</div>
            <div class="dbtech-tables"><span>files_index</span></div>
        </div>
    </div>
    <div class="db-grid">
        <div class="db-table">
            <h3>users</h3>
            <ul>
                <li><span class="pk">id BIGINT (PK)</span></li>
                <li>email VARCHAR(255) UNIQUE</li>
                <li>name VARCHAR(100)</li>
                <li>avatar_url VARCHAR(500)</li>
                <li>storage_used BIGINT DEFAULT 0</li>
                <li>storage_limit BIGINT DEFAULT 16106127360</li>
                <li>created_at TIMESTAMP</li>
                <li><span class="idx">INDEX idx_email (email)</span></li>
            </ul>
        </div>
        <div class="db-table">
            <h3>files</h3>
            <ul>
                <li><span class="pk">id VARCHAR(36) (PK)</span></li>
                <li><span class="fk">owner_id BIGINT (FK &rarr; users.id)</span></li>
                <li><span class="fk">folder_id VARCHAR(36) (FK &rarr; folders.id)</span></li>
                <li>name VARCHAR(255)</li>
                <li>mime_type VARCHAR(100)</li>
                <li>size BIGINT</li>
                <li>storage_key VARCHAR(255)</li>
                <li>content_hash VARCHAR(64)</li>
                <li>current_version_id VARCHAR(36)</li>
                <li>is_trashed BOOLEAN DEFAULT false</li>
                <li>trashed_at TIMESTAMP NULL</li>
                <li>created_at TIMESTAMP</li>
                <li>updated_at TIMESTAMP</li>
                <li><span class="idx">INDEX idx_folder (folder_id, is_trashed)</span></li>
                <li><span class="idx">INDEX idx_owner (owner_id)</span></li>
                <li><span class="idx">INDEX idx_hash (content_hash)</span></li>
                <li><span class="idx">INDEX idx_trash (is_trashed, trashed_at)</span></li>
            </ul>
        </div>
        <div class="db-table">
            <h3>folders</h3>
            <ul>
                <li><span class="pk">id VARCHAR(36) (PK)</span></li>
                <li><span class="fk">owner_id BIGINT (FK &rarr; users.id)</span></li>
                <li><span class="fk">parent_id VARCHAR(36) (FK &rarr; folders.id) NULL</span></li>
                <li>name VARCHAR(255)</li>
                <li>path VARCHAR(2000)</li>
                <li>is_trashed BOOLEAN DEFAULT false</li>
                <li>created_at TIMESTAMP</li>
                <li><span class="idx">INDEX idx_parent (parent_id)</span></li>
                <li><span class="idx">INDEX idx_path (path)</span></li>
            </ul>
        </div>
        <div class="db-table">
            <h3>shares</h3>
            <ul>
                <li><span class="pk">id BIGINT (PK)</span></li>
                <li><span class="fk">file_id VARCHAR(36) (FK &rarr; files.id)</span></li>
                <li><span class="fk">shared_by BIGINT (FK &rarr; users.id)</span></li>
                <li><span class="fk">shared_with BIGINT (FK &rarr; users.id) NULL</span></li>
                <li>permission ENUM('VIEWER','COMMENTER','EDITOR','OWNER')</li>
                <li>share_link VARCHAR(100) UNIQUE NULL</li>
                <li>share_type ENUM('PRIVATE','LINK_VIEW','LINK_EDIT','SPECIFIC_USERS')</li>
                <li>expires_at TIMESTAMP NULL</li>
                <li>created_at TIMESTAMP</li>
                <li><span class="idx">INDEX idx_file_shares (file_id)</span></li>
                <li><span class="idx">INDEX idx_user_shared (shared_with)</span></li>
                <li><span class="idx">INDEX idx_link (share_link)</span></li>
            </ul>
        </div>
        <div class="db-table">
            <h3>file_versions</h3>
            <ul>
                <li><span class="pk">id VARCHAR(36) (PK)</span></li>
                <li><span class="fk">file_id VARCHAR(36) (FK &rarr; files.id)</span></li>
                <li><span class="fk">modified_by BIGINT (FK &rarr; users.id)</span></li>
                <li>version_num INT</li>
                <li>storage_key VARCHAR(255)</li>
                <li>size BIGINT</li>
                <li>content_hash VARCHAR(64)</li>
                <li>created_at TIMESTAMP</li>
                <li><span class="idx">INDEX idx_file_ver (file_id, version_num DESC)</span></li>
            </ul>
        </div>
    </div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">SQL &mdash; Core Queries</span></div><pre class="code-block">
<span class="cm">-- Folder contents fetch karo (files + subfolders)</span>
(<span class="kw">SELECT</span> id, name, 'FILE' as type, size, mime_type, updated_at <span class="kw">FROM</span> files
 <span class="kw">WHERE</span> folder_id = :folderId <span class="kw">AND</span> is_trashed = false)
<span class="kw">UNION ALL</span>
(<span class="kw">SELECT</span> id, name, 'FOLDER' as type, NULL, NULL, created_at <span class="kw">FROM</span> folders
 <span class="kw">WHERE</span> parent_id = :folderId <span class="kw">AND</span> is_trashed = false)
<span class="kw">ORDER BY</span> type <span class="kw">DESC</span>, name <span class="kw">LIMIT</span> :size <span class="kw">OFFSET</span> :offset;

<span class="cm">-- Dedup check: same content already stored hai?</span>
<span class="kw">SELECT</span> storage_key <span class="kw">FROM</span> files <span class="kw">WHERE</span> content_hash = :hash <span class="kw">LIMIT</span> 1;

<span class="cm">-- User ke shared files (Shared with me)</span>
<span class="kw">SELECT</span> f.*, s.permission <span class="kw">FROM</span> files f
<span class="kw">JOIN</span> shares s <span class="kw">ON</span> f.id = s.file_id
<span class="kw">WHERE</span> s.shared_with = :userId <span class="kw">ORDER BY</span> s.created_at <span class="kw">DESC</span>;

<span class="cm">-- Sync: cursor ke baad ki changes fetch karo</span>
<span class="kw">SELECT</span> * <span class="kw">FROM</span> activity_log
<span class="kw">WHERE</span> user_id = :userId <span class="kw">AND</span> id > :cursor <span class="kw">ORDER BY</span> id <span class="kw">LIMIT</span> 100;
</pre></div>
</div>

<!-- ============ 7. CAPACITY ESTIMATION ============ -->
<div class="section theme-deepblue">
    <div class="section-title"><span class="section-num">7</span>Capacity Estimation</div>
    <div class="assumption-box">
        <h4>Assumptions</h4>
        <div class="assumption-row"><span class="calc-label">Total Users</span><span class="calc-value">800 Million</span></div>
        <div class="assumption-row"><span class="calc-label">DAU (Daily Active Users)</span><span class="calc-value">200 Million</span></div>
        <div class="assumption-row"><span class="calc-label">Avg file operations/user/day</span><span class="calc-value">5 (upload/download/sync)</span></div>
        <div class="assumption-row"><span class="calc-label">Avg file size</span><span class="calc-value">2 MB (mix of docs, images, videos)</span></div>
        <div class="assumption-row"><span class="calc-label">Avg storage per user</span><span class="calc-value">5 GB</span></div>
        <div class="assumption-row"><span class="calc-label">Block size (chunked upload)</span><span class="calc-value">4 MB</span></div>
        <div class="assumption-row"><span class="calc-label">Deduplication savings</span><span class="calc-value">60%</span></div>
    </div>
    <div class="cap-grid">
        <div class="cap-card">
            <h4>File Operations / Day</h4>
            <div class="calc-row"><span class="calc-label">200M DAU &times; 5 ops</span><span class="calc-value">1 Billion / day</span></div>
            <div class="calc-row"><span class="calc-label">QPS (avg)</span><span class="calc-value">1B &divide; 86400 &approx; 11.5K QPS</span></div>
            <div class="calc-result"><span class="calc-label">Peak QPS (3&ndash;4&times;)</span><span class="calc-value">~40K QPS</span></div>
        </div>
        <div class="cap-card">
            <h4>Upload Volume / Day</h4>
            <div class="calc-row"><span class="calc-label">200M users &times; 2 uploads &times; 2 MB</span><span class="calc-value">800 TB / day (raw)</span></div>
            <div class="calc-result"><span class="calc-label">After 60% dedup</span><span class="calc-value">~320 TB / day</span></div>
        </div>
        <div class="cap-card">
            <h4>Storage Total</h4>
            <div class="calc-row"><span class="calc-label">800M users &times; 5 GB each</span><span class="calc-value">4 EB (Exabytes) raw</span></div>
            <div class="calc-result"><span class="calc-label">After 60% dedup</span><span class="calc-value">~1.6 EB actual</span></div>
        </div>
        <div class="cap-card">
            <h4>Sync Traffic / Day</h4>
            <div class="calc-row"><span class="calc-label">200M devices &times; 5 syncs &times; 4 MB avg change</span><span class="calc-value">4 PB / day</span></div>
            <div class="calc-result"><span class="calc-label">Sync bandwidth</span><span class="calc-value">~4 PB / day</span></div>
        </div>
        <div class="cap-card">
            <h4>Metadata DB</h4>
            <div class="calc-row"><span class="calc-label">800M users &times; 500 files avg</span><span class="calc-value">400 Billion file records</span></div>
            <div class="calc-result"><span class="calc-label">Metadata size (~100 bytes/record)</span><span class="calc-value">~40 TB metadata</span></div>
        </div>
        <div class="cap-card">
            <h4>Block Storage (S3)</h4>
            <div class="calc-row"><span class="calc-label">Actual storage after dedup</span><span class="calc-value">~1.6 EB</span></div>
            <div class="calc-result"><span class="calc-label">S3 IA / Glacier for old files</span><span class="calc-value">saves ~50% cost</span></div>
        </div>
        <div class="cap-card">
            <h4>CPU / Server Estimation</h4>
            <div class="calc-row"><span class="calc-label">API Servers</span><span class="calc-value">~100 servers</span></div>
            <div class="calc-row"><span class="calc-label">Sync Servers</span><span class="calc-value">~200 servers</span></div>
            <div class="calc-row"><span class="calc-label">DB Shards</span><span class="calc-value">50+ shards</span></div>
            <div class="calc-result"><span class="calc-label">Redis Nodes</span><span class="calc-value">30+ nodes</span></div>
        </div>
    </div>
</div>

<!-- ============ 8. DATA STRUCTURES & TRADE-OFFS ============ -->
<div class="section theme-purple">
    <div class="section-title"><span class="section-num">8</span>Data Structures &amp; Trade-offs</div>
    <div class="service-grid">
        <div class="service-card">
            <h3>Merkle Tree &mdash; File Sync &amp; Change Detection</h3>
            <p class="svc-desc">Cloud storage ka sabse critical problem hai: "kaunsi files change hui client aur server ke beech?" Merkle Tree ek hash tree hai jisme leaf nodes file chunks ke hashes hai, aur parent nodes children ke combined hash hai. Dropbox aur Google Drive iska use karte hai.</p>
            <p class="svc-desc"><strong>Use Case:</strong> Client aur server dono ke paas Merkle Tree hai. Root hash compare karo &mdash; same = fully synced. Different = children me drill down karke exact changed chunks find karo<br><br>
            <strong>Why Merkle Tree?</strong> 10GB folder me 1 file change hui toh bina Merkle Tree poori folder hash karna padega. Merkle Tree se sirf changed subtree check hota hai &mdash; O(log n) comparisons<br><br>
            <strong>Pros:</strong> Efficient diff detection (only changed subtrees), tamper detection (hash chain), bandwidth saving (sync only changed chunks)<br><br>
            <strong>Cons:</strong> Tree rebuild cost on large structural changes (folder rename), memory overhead for deep directory structures, hash computation CPU cost<br><br>
            <strong>Real World:</strong> Dropbox block-level Merkle Tree use karta hai (4MB chunks), Git bhi internally Merkle Tree (blob → tree → commit)</p>
        </div>
        <div class="service-card">
            <h3>Hash Table (CAS) &mdash; Content-Addressable Storage &amp; Dedup</h3>
            <p class="svc-desc">Cloud storage me same file agar 1000 users upload kare toh 1000 copies store karna waste hai. Content-Addressable Storage (CAS) me file ka SHA-256 hash nikalo &mdash; hash hi address hai. Same hash = same content = store once.</p>
            <p class="svc-desc"><strong>Use Case:</strong> upload(file) → hash = SHA256(file) → check hash_table[hash] → exists? return reference : store file, add to hash_table<br><br>
            <strong>Why Hash Table?</strong> O(1) dedup lookup &mdash; "does this exact content already exist?" Hash collision probability SHA-256 me practically zero (2^256 space)<br><br>
            <strong>Pros:</strong> O(1) dedup check, massive storage saving (60%+ for enterprise), automatic versioning (new content = new hash)<br><br>
            <strong>Cons:</strong> SHA-256 computation cost (CPU intensive for large files), no partial dedup (1 byte change = completely different hash), reference counting for garbage collection<br><br>
            <strong>Optimization:</strong> Block-level dedup &mdash; file ko 4MB chunks me todo, har chunk ka hash. 1 block change = sirf 1 new block store, rest shared</p>
        </div>
        <div class="service-card">
            <h3>Trie (Prefix Tree) &mdash; File Path Namespace</h3>
            <p class="svc-desc">File system paths hierarchical hai: /home/user/docs/resume.pdf. Trie naturally is structure ko represent karta hai &mdash; har path component ek node hai.</p>
            <p class="svc-desc"><strong>Use Case:</strong> "List all files in /home/user/docs/" → Trie me /home/user/docs/ node tak traverse karo, children = files in that directory<br><br>
            <strong>Why Trie?</strong> O(L) path lookup (L = path depth), prefix listing built-in (ls /folder/ = all children of node), space sharing for common prefixes (/home/user shared across all user's files)<br><br>
            <strong>Pros:</strong> Natural hierarchy representation, O(L) lookup, efficient prefix operations (list directory), rename = subtree move<br><br>
            <strong>Cons:</strong> Memory heavy for wide directories (millions of files in one folder), not ideal for flat namespace designs, serialization complexity<br><br>
            <strong>Alternative:</strong> Flat key-value with path as key &mdash; simpler but listing directory requires prefix scan (slower)</p>
        </div>
        <div class="service-card">
            <h3>Bloom Filter &mdash; Quick Dedup Check</h3>
            <p class="svc-desc">Full SHA-256 hash compute karna 1GB file ke liye ~2 seconds lagta hai. Bloom Filter se pehle quick check &mdash; "is hash definitely NOT in our system?" Agar not exists, toh full hash compute karne ki zaroorat nahi.</p>
            <p class="svc-desc"><strong>Use Case:</strong> Upload pe pehle fast hash (MD5/CRC32) → Bloom Filter check → "not exists" = unique file, store directly. "maybe exists" = compute full SHA-256 → exact dedup check<br><br>
            <strong>Why Bloom Filter?</strong> 1 Billion unique blocks ka SHA-256 HashSet ~64GB RAM. Bloom Filter me ~1.2GB me same coverage (with 0.1% false positive)<br><br>
            <strong>Pros:</strong> O(1) lookup, 50x memory saving over HashSet, no false negatives (safe for dedup &mdash; won't miss a duplicate)<br><br>
            <strong>Cons:</strong> False positives require full hash verification (0.1% extra compute), can't delete entries (block deleted but Bloom Filter still says "maybe exists")<br><br>
            <strong>Trade-off:</strong> Speed vs Accuracy &mdash; Bloom Filter = fast pre-filter, full hash = accurate verification. Two-tier approach</p>
        </div>
        <div class="service-card">
            <h3>B+ Tree &mdash; Metadata Index</h3>
            <p class="svc-desc">File listing, sorting by name/date/size, search by filename &mdash; ye sab operations B+ Tree indexed database tables se efficient hote hai.</p>
            <p class="svc-desc"><strong>Use Case:</strong> INDEX(user_id, parent_folder_id, file_name) &mdash; "List all files in this folder sorted by name" = B+ Tree range scan<br><br>
            <strong>Why B+ Tree?</strong> Sorted order on disk, range queries for file listing, composite indexes for multi-column queries<br><br>
            <strong>Pros:</strong> O(log n) search, excellent for range queries (files between date A and B), disk-optimized (sequential read of leaf nodes)<br><br>
            <strong>Cons:</strong> Write amplification on frequent updates, overhead for point queries (Hash index faster), rebalancing cost<br><br>
            <strong>When B+ Tree wins:</strong> "Sort files by date" (range scan), "Search files starting with 'report'" (prefix on index). Hash index can't do these</p>
        </div>
        <div class="service-card">
            <h3>Ring Buffer &mdash; Chunked Upload Streaming</h3>
            <p class="svc-desc">Large file upload me chunks (4-8 MB) sequentially aate hai. Ring Buffer fixed-size circular buffer hai jo incoming chunks temporarily hold karta hai before writing to storage.</p>
            <p class="svc-desc"><strong>Use Case:</strong> Upload stream → Ring Buffer (8 slots x 4MB = 32MB) → Background writer flushes to S3/GCS. Buffer full = backpressure to client<br><br>
            <strong>Why Ring Buffer?</strong> Fixed memory allocation (no GC pressure), producer-consumer pattern naturally fits, overflow = backpressure signal<br><br>
            <strong>Pros:</strong> O(1) read/write, fixed memory (predictable), no memory allocation/deallocation, lock-free implementations possible<br><br>
            <strong>Cons:</strong> Fixed capacity (overflow = data loss or blocking), not suitable for variable-size data without padding, size must be power of 2 for bitwise modulo<br><br>
            <strong>Alternative:</strong> Unbounded queue &mdash; no data loss but memory can explode on slow consumer. Ring Buffer safer for production</p>
        </div>
    </div>
</div>

<!-- ============ 9. CHUNKED UPLOAD & SYNC ============ -->
<div class="section theme-blue">
    <div class="section-title"><span class="section-num">9</span>Architecture &mdash; Chunked Upload &amp; Delta Sync</div>
    <div class="service-grid">
        <div class="service-card">
            <h3>Chunked Upload Flow</h3>
            <p class="svc-desc">Large files ko chunks me todh ke upload karte hai — fail hone pe resume, parallel chunks possible</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Upload Architecture</span></div><pre class="code-block">
<span class="cm">// Step 1: Client file ko 4MB blocks me todhta hai</span>
file.pdf (50MB) &rarr; Block1(4MB) + Block2(4MB) + ... + Block13(2MB)

<span class="cm">// Step 2: Har block ka SHA-256 hash calculate</span>
Block1 &rarr; hash: "abc123..."
Block2 &rarr; hash: "def456..."

<span class="cm">// Step 3: Server ko block hashes bhejo (dedup check)</span>
POST /upload/init { hashes: ["abc123", "def456", ...] }
Server: "Block1 already exists! Skip it." <span class="cm">// DEDUP!</span>
Server: "Block2-13 needed, upload these."

<span class="cm">// Step 4: Sirf unique blocks upload karo (parallel possible)</span>
PUT /upload/chunk/2 &rarr; Block2 data
PUT /upload/chunk/3 &rarr; Block3 data (parallel!)

<span class="cm">// Step 5: Complete upload &rarr; server blocks combine karta hai</span>
POST /upload/complete &rarr; blocks assemble &rarr; file record create

<span class="cm">// RESUME: Agar chunk 7 pe fail ho gaya?</span>
<span class="cm">// Client asks: "kaunse chunks upload ho chuke hai?"</span>
GET /upload/{id}/status &rarr; { completed: [1,2,3,4,5,6] }
<span class="cm">// Client sirf chunk 7 se resume karta hai</span>
</pre></div>
        </div>
        <div class="service-card">
            <h3>Delta Sync (Dropbox-style)</h3>
            <p class="svc-desc">Poori file nahi, sirf changed blocks sync hote hai — 1GB file me 1KB change = sirf 4MB block transfer</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Delta Sync Algorithm</span></div><pre class="code-block">
<span class="cm">// FILE = collection of 4MB blocks</span>
<span class="cm">// Har block ka unique hash hai</span>

<span class="cm">// BEFORE EDIT:</span>
file.docx = [Block_A, Block_B, Block_C, Block_D]
             hash_a   hash_b   hash_c   hash_d

<span class="cm">// User edits page 2 (falls in Block_B)</span>
<span class="cm">// AFTER EDIT:</span>
file.docx = [Block_A, Block_B', Block_C, Block_D]
             hash_a   hash_b'  hash_c   hash_d
<span class="cm">//                    ^ only this changed!</span>

<span class="cm">// Client compares old vs new block hashes:</span>
<span class="cm">// hash_a == hash_a (same, skip)</span>
<span class="cm">// hash_b != hash_b' (CHANGED! upload this block only)</span>
<span class="cm">// hash_c == hash_c (same, skip)</span>
<span class="cm">// hash_d == hash_d (same, skip)</span>

<span class="cm">// RESULT: Sirf 4MB upload instead of full file!</span>
<span class="cm">// For 1GB file with small edit = 99.6% bandwidth saved</span>
</pre></div>
        </div>
    </div>
</div>

<!-- ============ 10. FILE SYNC PROTOCOL ============ -->
<div class="section theme-green">
    <div class="section-title"><span class="section-num">10</span>File Sync Protocol &amp; Conflict Resolution</div>
    <div class="service-grid">
        <div class="service-card">
            <h3>Sync Protocol (Long Polling + Cursor)</h3>
            <p class="svc-desc">Dropbox-style cursor-based sync — server pe changes hone pe client ko instantly pata chalta hai via long polling</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Sync Flow</span></div><pre class="code-block">
<span class="cm">// CURSOR = last seen change ID (monotonically increasing)</span>
<span class="cm">// Client stores: lastCursor = 1000</span>

<span class="cm">// SYNC FLOW:</span>
<span class="cm">// 1. Client pushes local changes</span>
POST /sync { cursor: 1000, changes: [...local edits...] }
Server: applies changes, returns new cursor

<span class="cm">// 2. Server returns remote changes since cursor</span>
Response: { newCursor: 1005, changes: [...server edits...] }
<span class="cm">// Client applies server changes locally</span>

<span class="cm">// 3. Long poll for future changes</span>
GET /sync/wait?cursor=1005&amp;timeout=60
<span class="cm">// Server holds connection until:</span>
<span class="cm">//   a) New change happens &rarr; return immediately</span>
<span class="cm">//   b) Timeout (60s) &rarr; return empty, client retries</span>

<span class="cm">// RESULT: Near real-time sync without constant polling!</span>
<span class="cm">// Alternative: WebSocket for truly real-time sync</span>
</pre></div>
        </div>
        <div class="service-card">
            <h3>Conflict Resolution</h3>
            <p class="svc-desc">Do users same file simultaneously edit kare to conflict hota hai — strategies: keep both, last writer wins, merge</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Conflict Handling</span></div><pre class="code-block">
<span class="cm">// CONFLICT SCENARIO:</span>
<span class="cm">// User A edits file at 10:00 AM (offline)</span>
<span class="cm">// User B edits same file at 10:05 AM (online, synced)</span>
<span class="cm">// User A comes online at 10:10 AM &rarr; CONFLICT!</span>

<span class="cm">// STRATEGY 1: KEEP BOTH (Dropbox default)</span>
report.pdf  &rarr; report.pdf            (B's version, latest)
            &rarr; report (A's conflicted copy).pdf

<span class="cm">// STRATEGY 2: LAST WRITER WINS</span>
<span class="cm">// B's version wins, A's changes lost</span>
<span class="cm">// Simple but data loss risk</span>

<span class="cm">// STRATEGY 3: AUTO-MERGE (Google Docs)</span>
<span class="cm">// OT (Operational Transform) ya CRDT se</span>
<span class="cm">// Character-level merge, no conflict!</span>
<span class="cm">// Only works for text documents</span>

<span class="cm">// DETECTION: version vector comparison</span>
<span class="cm">// Client version: v5 (based on v4)</span>
<span class="cm">// Server version: v6 (also based on v4)</span>
<span class="cm">// Base mismatch = CONFLICT!</span>
</pre></div>
        </div>
    </div>
</div>

<!-- ============ 11. DEDUPLICATION ============ -->
<div class="section theme-purple">
    <div class="section-title"><span class="section-num">11</span>File Deduplication &amp; Content-Addressable Storage</div>
    <div class="service-grid">
        <div class="service-card">
            <h3>Block-Level Deduplication</h3>
            <p class="svc-desc">Same content double store nahi karta — SHA-256 hash as storage key, multiple files same blocks point karte hai</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Dedup Architecture</span></div><pre class="code-block">
<span class="cm">// CONTENT-ADDRESSABLE STORAGE (CAS)</span>
<span class="cm">// File ka content hash = storage key</span>
<span class="cm">// Same content = same hash = same key = stored ONCE</span>

<span class="cm">// Example: 100 users upload same photo</span>
User-1: photo.jpg &rarr; SHA256: "abc123" &rarr; S3: blocks/abc123
User-2: pic.jpg   &rarr; SHA256: "abc123" &rarr; S3: blocks/abc123 (SAME!)
<span class="cm">// Storage: 1x instead of 100x!</span>

<span class="cm">// BLOCK-LEVEL DEDUP (more granular):</span>
File-A = [Block1, Block2, Block3]   <span class="cm">// 12MB total</span>
File-B = [Block1, Block2, Block4]   <span class="cm">// 12MB total</span>
<span class="cm">// Block1, Block2 shared = store only once!</span>
<span class="cm">// Actual storage: 4 blocks (16MB) instead of 6 blocks (24MB)</span>

<span class="cm">// REFERENCE COUNTING:</span>
<span class="cm">// block "abc123" &rarr; ref_count: 100</span>
<span class="cm">// User deletes file &rarr; ref_count: 99</span>
<span class="cm">// ref_count = 0 &rarr; safe to delete from S3</span>

<span class="cm">// Dropbox claims 60%+ storage savings from dedup!</span>
</pre></div>
        </div>
    </div>
</div>

<!-- ============ 12. SHARING & PERMISSIONS ============ -->
<div class="section theme-yellow">
    <div class="section-title"><span class="section-num">12</span>Sharing &amp; Permission Model</div>
    <div class="service-grid">
        <div class="service-card">
            <h3>ACL (Access Control List)</h3>
            <p class="svc-desc">Har file/folder pe permission list hoti hai — kaun kya kar sakta hai, inheritance parent folder se</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Permission Model</span></div><pre class="code-block">
<span class="cm">// PERMISSION LEVELS:</span>
<span class="cm">// VIEWER: read-only, download allowed</span>
<span class="cm">// COMMENTER: view + add comments</span>
<span class="cm">// EDITOR: view + edit + upload new versions</span>
<span class="cm">// OWNER: everything + delete + manage permissions</span>

<span class="cm">// INHERITANCE:</span>
<span class="cm">// Folder pe permission = all files inside inherit</span>
/Projects (Editor: Rahul)
  /Backend (inherits: Rahul=Editor)
    report.pdf (inherits: Rahul=Editor)
    secret.pdf (explicit: Rahul=NO ACCESS, overrides!)

<span class="cm">// LINK SHARING:</span>
<span class="cm">// Anyone with link can view/edit (no login needed)</span>
<span class="cm">// Optional: password protected link</span>
<span class="cm">// Optional: expiry date on link</span>

<span class="cm">// PERMISSION CHECK FLOW:</span>
<span class="cm">// 1. Check file-level ACL (explicit permission)</span>
<span class="cm">// 2. Check parent folder ACL (inherited)</span>
<span class="cm">// 3. Check share link (if accessing via link)</span>
<span class="cm">// 4. Check org-level policy (if enterprise)</span>
<span class="cm">// First match wins, explicit overrides inherited</span>
</pre></div>
        </div>
    </div>
</div>

<!-- ============ 13. COMPLETE FLOW ============ -->
<div class="section theme-teal">
    <div class="section-title"><span class="section-num">13</span>Complete File Upload Flow &mdash; End to End</div>
    <div class="code-wrapper"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">File Lifecycle</span></div><pre class="code-block">
<span class="cm">// ===== PHASE 1: UPLOAD =====</span>
Client: Split file into 4MB blocks, compute SHA-256 per block
    &rarr; POST /upload/init { blockHashes: [...] }
    &rarr; Server: dedup check, return which blocks needed
    &rarr; Client: upload only unique blocks (parallel)
    &rarr; POST /upload/complete &rarr; assemble file record

<span class="cm">// ===== PHASE 2: STORAGE =====</span>
    &rarr; Blocks stored in S3 (content-addressable: hash as key)
    &rarr; File metadata saved in PostgreSQL
    &rarr; Version 1 created in file_versions table
    &rarr; User storage_used counter updated
    &rarr; File indexed in Elasticsearch (name + content)

<span class="cm">// ===== PHASE 3: SYNC =====</span>
    &rarr; Activity log entry created (cursor increment)
    &rarr; Long-polling clients get notified immediately
    &rarr; Other devices: download new file's blocks
    &rarr; Delta sync: only download blocks not already cached locally

<span class="cm">// ===== PHASE 4: SHARE =====</span>
    &rarr; Owner shares with Rahul (EDITOR permission)
    &rarr; Share record in DB, email notification sent
    &rarr; Rahul opens file &rarr; permission check &rarr; allowed!
    &rarr; Rahul edits &rarr; new version created (v2)
    &rarr; Owner notified of change

<span class="cm">// ===== PHASE 5: CONFLICT =====</span>
    &rarr; Owner edits offline (based on v1)
    &rarr; Rahul edits online (v2 created)
    &rarr; Owner comes online &rarr; pushes changes
    &rarr; Server: base version mismatch! CONFLICT!
    &rarr; Strategy: Keep both copies, user decides

<span class="cm">// ===== PHASE 6: CLEANUP =====</span>
    &rarr; User deletes file &rarr; moved to trash (soft delete)
    &rarr; 30 days later: permanent delete job runs
    &rarr; Block reference counts decremented
    &rarr; Blocks with ref_count=0 deleted from S3
    &rarr; Storage quota freed up
</pre></div>
</div>

<!-- ============ 14. COMPARISONS ============ -->
<div class="section theme-pink">
    <div class="section-title"><span class="section-num">14</span>Google Drive vs Dropbox vs OneDrive &mdash; Key Differences</div>
    <div class="service-grid">
        <div class="service-card">
            <h3>Google Drive</h3>
            <p class="svc-desc">Google ecosystem integration — Docs, Sheets, Slides real-time collaboration built-in</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Google Drive</span></div><pre class="code-block">
<span class="cm">// 15GB free storage (shared with Gmail, Photos)</span>
<span class="cm">// Google Docs/Sheets/Slides = real-time collab (OT)</span>
<span class="cm">// Google Workspace integration</span>
<span class="cm">// AI-powered search (image content, document text)</span>
<span class="cm">// Version history: 100 versions, 30 days</span>
<span class="cm">// Stream files (don't download, access directly)</span>
<span class="cm">// 2B+ users globally</span>
</pre></div>
        </div>
        <div class="service-card">
            <h3>Dropbox</h3>
            <p class="svc-desc">Sync-first approach — desktop client best-in-class, delta sync pioneer</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">Dropbox</span></div><pre class="code-block">
<span class="cm">// 2GB free storage (industry lowest!)</span>
<span class="cm">// Best desktop sync client (Smart Sync)</span>
<span class="cm">// Delta sync pioneer (block-level)</span>
<span class="cm">// LAN sync (devices on same network = no internet)</span>
<span class="cm">// Paper (collaborative docs)</span>
<span class="cm">// Version history: 30 days (180 days paid)</span>
<span class="cm">// 700M+ registered users</span>
</pre></div>
        </div>
        <div class="service-card">
            <h3>OneDrive</h3>
            <p class="svc-desc">Microsoft 365 deep integration — Windows built-in, Office Online collaboration</p>
            <div class="code-wrapper" style="margin:0"><div class="code-titlebar"><span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span><span class="code-titlebar-text">OneDrive</span></div><pre class="code-block">
<span class="cm">// 5GB free storage</span>
<span class="cm">// Windows 10/11 built-in (no install needed)</span>
<span class="cm">// Microsoft 365 integration (Word, Excel, PPT)</span>
<span class="cm">// SharePoint backend (enterprise)</span>
<span class="cm">// Personal Vault (extra security for sensitive files)</span>
<span class="cm">// Files On-Demand (placeholder files, download on access)</span>
<span class="cm">// 400M+ users</span>
</pre></div>
        </div>
    </div>
</div>

<!-- ============ 15. BOTTLENECKS ============ -->
<div class="section theme-red">
    <div class="section-title"><span class="section-num">15</span>Bottlenecks &amp; Solutions</div>
    <div class="bottleneck-grid">
        <div class="bottleneck-item"><span class="bottleneck-problem">Large file upload failure mid-way</span><span class="bottleneck-arrow">&rarr;</span><span class="bottleneck-solution">Chunked resumable upload, checksum per chunk, retry individual chunks</span></div>
        <div class="bottleneck-item"><span class="bottleneck-problem">Sync storm (5 devices simultaneously)</span><span class="bottleneck-arrow">&rarr;</span><span class="bottleneck-solution">Cursor-based sync, conflict detection, rate limiting per device</span></div>
        <div class="bottleneck-item"><span class="bottleneck-problem">Hot folder shared with 1000s of users</span><span class="bottleneck-arrow">&rarr;</span><span class="bottleneck-solution">Fan-out via Kafka, batch notifications, lazy sync (pull on access)</span></div>
        <div class="bottleneck-item"><span class="bottleneck-problem">Storage cost at scale (petabytes)</span><span class="bottleneck-arrow">&rarr;</span><span class="bottleneck-solution">Block-level dedup (60% savings), tiered storage (S3 IA + Glacier)</span></div>
        <div class="bottleneck-item"><span class="bottleneck-problem">Metadata DB bottleneck (billions of files)</span><span class="bottleneck-arrow">&rarr;</span><span class="bottleneck-solution">Shard by user_id, materialized path for folders, Redis cache</span></div>
        <div class="bottleneck-item"><span class="bottleneck-problem">Conflict resolution complexity</span><span class="bottleneck-arrow">&rarr;</span><span class="bottleneck-solution">Keep-both default, OT for collab docs, version vectors for detection</span></div>
        <div class="bottleneck-item"><span class="bottleneck-problem">Search index lag for new files</span><span class="bottleneck-arrow">&rarr;</span><span class="bottleneck-solution">Near real-time indexing via Kafka, async content extraction (OCR)</span></div>
        <div class="bottleneck-item"><span class="bottleneck-problem">Trash cleanup storage leak</span><span class="bottleneck-arrow">&rarr;</span><span class="bottleneck-solution">30-day cleanup job, reference counting for shared blocks, S3 lifecycle</span></div>
    </div>
</div>

<!-- ============ 16. INTERVIEW TIPS ============ -->
<div class="section theme-orange">
    <div class="section-title"><span class="section-num">16</span>Interview Summary</div>
    <div class="summary-grid">
        <div class="summary-card sc-1"><h4>Chunked Upload</h4><p>Resumable, parallel, checksum per chunk</p></div>
        <div class="summary-card sc-2"><h4>Delta Sync</h4><p>Block-level diff &mdash; 1GB file, 1KB edit = 4MB transfer</p></div>
        <div class="summary-card sc-3"><h4>Content-Addressable Storage</h4><p>SHA-256 hash as key, 60%+ dedup savings</p></div>
        <div class="summary-card sc-4"><h4>Conflict Resolution</h4><p>Keep-both (safe), last-writer-wins (simple), OT (collab)</p></div>
        <div class="summary-card sc-1"><h4>Long Polling Sync</h4><p>Cursor-based: "changes after cursor X"</p></div>
        <div class="summary-card sc-2"><h4>Permission Model</h4><p>ACL with viewer/editor/owner, folder inheritance</p></div>
        <div class="summary-card sc-3"><h4>11 Nines Durability</h4><p>S3 + cross-region replication for DR</p></div>
        <div class="summary-card sc-4"><h4>Metadata vs Content</h4><p>PostgreSQL (metadata) + S3 (content blobs)</p></div>
        <div class="summary-card sc-1"><h4>Versioning</h4><p>Every edit creates new version, rollback support</p></div>
        <div class="summary-card sc-2"><h4>Observer Pattern</h4><p>File change &rarr; sync + notify + index + audit</p></div>
        <div class="summary-card sc-3"><h4>Sharding by user_id</h4><p>User's files on same shard for fast listing</p></div>
        <div class="summary-card sc-4"><h4>Strategy Pattern</h4><p>Conflict strategy plug-and-play per file type</p></div>
    </div>
    <p style="text-align:center;margin-top:24px;color:#78909c;font-size:1em">
        Complete Cloud Storage LLD for <strong style="color:#4285f4">Java Spring Boot</strong> interviews &mdash; covers Chunked Upload, Delta Sync, Dedup, Versioning &amp; Scalability.
    </p>
</div>
`
}
