#!/usr/bin/env dotnet
#:package NuGet.Protocol@6.12.1
#:property NuGetAudit=false
#:property NoWarn=IL2026;IL3050
#:property JsonSerializerIsReflectionEnabledByDefault=true

// Deterministic discovery for the API Diff Orchestrator, driven entirely by the dnceng
// NuGet feeds. Emits the set of API diff reports to produce for the
// active, not-yet-shipped majors.
//
// Majors: maxGA is the highest major with a GA (X.0.0, non-prerelease) build on
// dotnet-public. We only ever consider maxGA+1 and maxGA+2 -- maxGA+3's baseline
// (maxGA+2) could not yet be at RC, so it would always be held off.
//
// Two tracks per active major:
//
//   - major-to-major (cumulative): (X-1) -> X head. The CURRENT build is the newest
//     build on the dotnet{X} channel feed regardless of prerelease label (alpha,
//     beta, preview, rc) so the cumulative "what's coming in X" surface tracks the
//     freshest bits. The BASELINE is the newest (X-1) build on dotnet-public that is
//     RC-or-GA (RC is public and API-locked, so an RC baseline yields materially the
//     same diff as GA; it advances RC1 -> RC2 -> GA as (X-1) finalizes). The PR
//     identity stays canonical "(X-1).0-ga_to_X.0"; only the pinned previous_version
//     evolves. Content lives at the major root: release-notes/X.0/X.0.0/api-diff.
//
//   - incremental (milestone deltas): the CURRENT end is the latest NAMED milestone (preview.N /
//     rc.N) on the dotnet{X} dev feed, so a milestone's DRAFT api-diff PR is produced as soon as
//     it has builds -- to be reviewed and merged BEFORE it releases publicly. The BASELINE is the
//     previous milestone's SHIPPED build on dotnet-public; the diff is HELD OFF until that
//     predecessor releases (e.g. preview.7 waits for preview.6 to ship), so the "before" side is
//     always a stable released milestone. preview.1's baseline is the prior major's shipped
//     RC-or-GA. Reports are milestone-named, so advancing dev builds are content-only refreshes.
//     Content lives under release-notes/X.0/preview/<milestone>/api-diff.
//
// Status: maxGA+1 is code-complete (PR Ready for Review) once maxGA+2 has started
// publishing builds (main has forked to the next major); otherwise in-development
// (PR stays draft). maxGA+2 is always in-development.
//
// Feed version discovery uses the NuGet client SDK (NuGet.Protocol +
// NuGet.Versioning) for correct SemVer ordering. When an output-file path is passed
// as the first argument the JSON array is written there (so the "dotnet run" build
// output on stdout never contaminates the capture); otherwise it is written to
// stdout. Notices/warnings/errors go to stderr as GitHub Actions workflow commands.

using System.Text.Json;
using System.Text.RegularExpressions;
using NuGet.Common;
using NuGet.Protocol;
using NuGet.Protocol.Core.Types;
using NuGet.Versioning;

const string PublicChannel = "dotnet-public";
const string RefPackage = "Microsoft.NETCore.App.Ref";

static void Notice(string m) => Console.Error.WriteLine($"::notice::{m}");
static void Warn(string m) => Console.Error.WriteLine($"::warning::{m}");
static void Fail(string m)
{
    Console.Error.WriteLine($"::error::{m}");
    Environment.Exit(1);
}

// ---- NuGet feed discovery --------------------------------------------------
static string FeedIndex(string channel) =>
    $"https://pkgs.dev.azure.com/dnceng/public/_packaging/{channel}/nuget/v3/index.json";

var versionsCache = new Dictionary<string, IReadOnlyList<NuGetVersion>>();

async Task<IReadOnlyList<NuGetVersion>> VersionsOn(string channel, bool quiet = false)
{
    if (versionsCache.TryGetValue(channel, out var cached))
        return cached;

    // A transient feed error (or a channel that does not exist yet) throws; retry a
    // few times before treating the channel as having no builds. NoCache so a
    // just-published build is seen immediately.
    IReadOnlyList<NuGetVersion> result = [];
    Exception? last = null;
    var cache = new SourceCacheContext { NoCache = true };
    var repo = NuGet.Protocol.Core.Types.Repository.Factory.GetCoreV3(FeedIndex(channel));
    for (var attempt = 1; attempt <= 3; attempt++)
    {
        try
        {
            var resource = await repo.GetResourceAsync<FindPackageByIdResource>();
            var versions = await resource.GetAllVersionsAsync(
                RefPackage, cache, NullLogger.Instance, CancellationToken.None);
            result = versions.ToList();
            last = null;
            break;
        }
        catch (Exception ex)
        {
            last = ex;
            if (attempt < 3)
                await Task.Delay(2000);
        }
    }
    if (last is not null)
    {
        // The maxGA+2 channel legitimately does not exist until main forks to it, so
        // its probe is quiet (a Notice); a feed we expect to exist warns.
        var msg = $"feed query for '{channel}' failed after 3 attempts: {last.Message}";
        if (quiet)
            Notice($"{channel}: no builds (channel not present yet).");
        else
            Warn(msg);
    }

    versionsCache[channel] = result;
    return result;
}

// All X.0.0[-*] ref-pack versions on a channel (the .0 release line for major X).
async Task<List<NuGetVersion>> ReleaseLine(int major, string channel) =>
    (await VersionsOn(channel))
        .Where(v => v.Major == major && v.Minor == 0 && v.Patch == 0)
        .ToList();

// Newest X build across the given channels, regardless of prerelease label. Ties
// keep the first channel listed (prefer the per-major dev feed over dotnet-public).
async Task<(NuGetVersion Ver, string Feed)?> LatestAnyLabel(int major, params string[] channels)
{
    (NuGetVersion Ver, string Feed)? best = null;
    foreach (var channel in channels)
        foreach (var v in await ReleaseLine(major, channel))
            if (best is null || VersionComparer.Default.Compare(v, best.Value.Ver) > 0)
                best = (v, channel);
    return best;
}

// Newest (major).0.0 build on dotnet-public that is RC-or-GA: prefer GA (the final,
// non-prerelease X.0.0), else the newest rc.N. Null until (major) reaches RC.
async Task<NuGetVersion?> LatestRcOrGa(int major)
{
    var line = await ReleaseLine(major, PublicChannel);
    var ga = line.Where(v => !v.IsPrerelease)
        .OrderBy(v => v, VersionComparer.Default).LastOrDefault();
    if (ga is not null)
        return ga;
    return line
        .Where(v => v.IsPrerelease && v.Release.StartsWith("rc.", StringComparison.OrdinalIgnoreCase))
        .OrderBy(v => v, VersionComparer.Default).LastOrDefault();
}

// Highest milestone of a kind ("preview"/"rc") for major on channel: (N, newest build).
async Task<(int Num, NuGetVersion Ver)?> MaxMilestone(int major, string kind, string channel)
{
    var rx = new Regex($@"^{Regex.Escape(kind)}\.(\d+)(\.|$)", RegexOptions.IgnoreCase);
    var matches = (await ReleaseLine(major, channel))
        .Where(v => v.IsPrerelease && rx.IsMatch(v.Release))
        .ToList();
    if (matches.Count == 0)
        return null;
    var maxN = matches.Max(v => int.Parse(rx.Match(v.Release).Groups[1].Value));
    var ver = matches
        .Where(v => int.Parse(rx.Match(v.Release).Groups[1].Value) == maxN)
        .OrderBy(v => v, VersionComparer.Default).Last();
    return (maxN, ver);
}

// Newest build of a specific milestone (kind.num) for major on channel, or null.
async Task<NuGetVersion?> MilestoneBuild(int major, string kind, int num, string channel)
{
    var rx = new Regex($@"^{Regex.Escape(kind)}\.{num}(\.|$)", RegexOptions.IgnoreCase);
    return (await ReleaseLine(major, channel))
        .Where(v => v.IsPrerelease && rx.IsMatch(v.Release))
        .OrderBy(v => v, VersionComparer.Default).LastOrDefault();
}

// Latest NAMED milestone (rc preferred over preview) on the major's dev feed. Uses the
// dotnet{major} dev channel -- not dotnet-public -- so a milestone gets its draft api-diff PR
// as soon as it has builds, letting the diff be reviewed and merged BEFORE the milestone
// releases publicly (a public-only source would surface it too late).
async Task<(string Kind, int Num, NuGetVersion Ver)?> LatestMilestone(int major)
{
    var channel = $"dotnet{major}";
    if (await MaxMilestone(major, "rc", channel) is { } rc)
        return ("rc", rc.Num, rc.Ver);
    if (await MaxMilestone(major, "preview", channel) is { } pv)
        return ("preview", pv.Num, pv.Ver);
    return null;
}

// The milestone label of a version: "preview.7", "rc.2", "alpha.1", ... or "ga".
// Normalized to lower case so an upper/mixed-case feed label (e.g. "RC.2") yields a
// canonical marker and folder name, consistent with RunApiDiff.ps1's label handling.
static string HeadLabel(NuGetVersion v)
{
    if (!v.IsPrerelease)
        return "ga";
    var parts = v.Release.ToLowerInvariant().Split('.');
    return parts.Length >= 2 ? $"{parts[0]}.{parts[1]}" : parts[0];
}

static string Undot(string label) => label.Replace(".", "");

// The incremental baseline (previous milestone) for <major> at head milestone (kind.num), as
// (version-milestone, version, feed). The baseline is the previous milestone's SHIPPED build on
// dotnet-public: a milestone diff always pins its "before" to a released milestone, so the diff
// is HELD OFF until the previous milestone ships (e.g. preview.7 waits for preview.6 to release).
// preview.1's baseline is the prior major's shipped RC-or-GA on dotnet-public.
async Task<(string VersionMilestone, string Version, string Feed)?> PrevMilestone(int major, string kind, int num)
{
    if (kind == "preview" && num > 1)
    {
        var v = await MilestoneBuild(major, "preview", num - 1, PublicChannel);
        return v is null ? null : ($"{major}.0-preview.{num - 1}", v.ToNormalizedString(), PublicChannel);
    }
    if (kind == "rc" && num > 1)
    {
        var v = await MilestoneBuild(major, "rc", num - 1, PublicChannel);
        return v is null ? null : ($"{major}.0-rc.{num - 1}", v.ToNormalizedString(), PublicChannel);
    }
    if (kind == "rc")
    {
        // rc.1: baseline is the highest shipped public preview of this major.
        var pv = await MaxMilestone(major, "preview", PublicChannel);
        return pv is null ? null : ($"{major}.0-preview.{pv.Value.Num}", pv.Value.Ver.ToNormalizedString(), PublicChannel);
    }

    // preview.1 (first milestone of the major): baseline is the prior major's shipped
    // RC-or-GA. The label stays canonical "(X-1).0-ga" even while the pin is an RC.
    var prior = await LatestRcOrGa(major - 1);
    return prior is null ? null : ($"{major - 1}.0-ga", prior.ToNormalizedString(), PublicChannel);
}

// ---- Determine the active majors from the feeds ----------------------------
var publicVersions = await VersionsOn(PublicChannel);
var maxGa = publicVersions.Where(v => !v.IsPrerelease).Select(v => v.Major).DefaultIfEmpty(0).Max();
if (maxGa == 0)
    Fail($"Could not determine any GA major of {RefPackage} on {PublicChannel}. Aborting instead of emitting an empty target set.");
Notice($"maxGA = {maxGa}.0");

// maxGA+2 activity (main has forked to the next major) makes maxGA+1 code-complete.
// Prime the maxGA+2 channel cache quietly first, since it does not exist until main
// forks to it and should not warn on every run.
var vNextMajor = maxGa + 2;
await VersionsOn($"dotnet{vNextMajor}", quiet: true);
var vNextHead = await LatestAnyLabel(vNextMajor, $"dotnet{vNextMajor}", PublicChannel);
var vNextActive = vNextHead is not null;

// ---- Emit targets ----------------------------------------------------------
var targets = new List<Target>();
foreach (var major in new[] { maxGa + 1, maxGa + 2 })
{
    var channel = $"dotnet{major}";
    var head = major == vNextMajor ? vNextHead : await LatestAnyLabel(major, channel, PublicChannel);
    if (head is null)
    {
        Notice($"{major}.0: no builds on the feeds yet; skipping.");
        continue;
    }
    var headVer = head.Value.Ver;
    var headLabel = HeadLabel(headVer);
    var headUndotted = Undot(headLabel);
    var status = major == vNextMajor
        ? "in-development"
        : (vNextActive ? "code-complete" : "in-development");
    Notice($"{major}.0 head -> {headVer.ToNormalizedString()} ({head.Value.Feed}) [{headLabel}], status={status}");

    // major-to-major (cumulative): (X-1) RC-or-GA -> X head (any label).
    var baseline = await LatestRcOrGa(major - 1);
    if (baseline is not null)
    {
        var marker = $"{major - 1}.0-ga_to_{major}.0";
        targets.Add(new Target(
            track: "major-to-major", major: $"{major}.0",
            previous_version_milestone: $"{major - 1}.0-ga", current_version_milestone: $"{major}.0-{headLabel}",
            previous_version: baseline.ToNormalizedString(), previous_feed: FeedIndex(PublicChannel),
            current_version: headVer.ToNormalizedString(), current_feed: FeedIndex(head.Value.Feed),
            content_dir: $"release-notes/{major}.0/{major}.0.0/api-diff", cur_milestone: headUndotted,
            marker_id: marker, desired_branch: $"api-diff/{marker}",
            status: status));
    }
    else
    {
        Notice($"{major}.0 cumulative held off: {major - 1}.0 is not yet at RC/GA on {PublicChannel}.");
    }

    // incremental (milestone deltas): previous milestone -> latest milestone, sourced from the
    // dotnet{major} dev feed so a draft PR is produced as soon as a milestone has builds (before
    // it releases publicly).
    var ms = await LatestMilestone(major);
    if (ms is not null)
    {
        var (kind, num, msVer) = ms.Value;
        var msLabel = $"{kind}.{num}";
        var pm = await PrevMilestone(major, kind, num);
        if (pm is not null)
        {
            var currentVersionMilestone = $"{major}.0-{msLabel}";
            var marker = $"{pm.Value.VersionMilestone}_to_{currentVersionMilestone}";
            targets.Add(new Target(
                track: "incremental", major: $"{major}.0",
                previous_version_milestone: pm.Value.VersionMilestone, current_version_milestone: currentVersionMilestone,
                previous_version: pm.Value.Version, previous_feed: FeedIndex(pm.Value.Feed),
                current_version: msVer.ToNormalizedString(), current_feed: FeedIndex($"dotnet{major}"),
                content_dir: $"release-notes/{major}.0/preview/{Undot(msLabel)}/api-diff", cur_milestone: Undot(msLabel),
                marker_id: marker, desired_branch: $"api-diff/{marker}",
                status: status));
        }
        else
        {
            Notice($"{major}.0 incremental ({msLabel}) held off: the previous milestone has not shipped to {PublicChannel} yet.");
        }
    }
}

var output = targets
    .GroupBy(t => (t.track, t.desired_branch))
    .Select(g => g.First())
    .OrderBy(t => t.major, StringComparer.Ordinal)
    .ThenBy(t => t.track, StringComparer.Ordinal)
    .ThenBy(t => t.current_version_milestone, StringComparer.Ordinal)
    .ToList();

var json = JsonSerializer.Serialize(output);

// When an output path is passed, write the JSON there so the caller can read a
// clean file regardless of any build/restore output "dotnet run" emits to stdout;
// otherwise emit to stdout for local/ad-hoc use.
if (args.Length > 0)
    File.WriteAllText(args[0], json);
else
    Console.WriteLine(json);

// Field names/order mirror the JSON contract the API Diff Orchestrator consumes.
record Target(
    string track, string major, string previous_version_milestone, string current_version_milestone,
    string previous_version, string previous_feed,
    string current_version, string current_feed,
    string content_dir, string cur_milestone,
    string marker_id, string desired_branch,
    string status);
