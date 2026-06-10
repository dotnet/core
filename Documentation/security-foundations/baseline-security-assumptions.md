# Baseline security assumptions

This document frames a set of baseline assumptions that consumers and implementers of .NET components can simply _assume_. These assumptions determine how .NET reasons about a component's authority boundary and the trusted actors that operate within that boundary. They are incorporated by default into all .NET documentation and threat models, and they need not be restated.

The baseline described here is not intended to immutably bind all .NET components. Components may in some cases need to expand the authority boundary (e.g., fully trust an external entity) or narrow the authority boundary (e.g., treat another same-user process as less privileged). The baseline does not prohibit these modifications. However, because these changes fall outside the baseline, the component author should prominently document these deviations and any obligation they place on consumers or integrators.

## Audience and how to read this document

The primary audience for this document is the .NET team, which creates libraries, tools, and SDKs. This document does not itself discuss how to create a threat model; it instead discusses general principles that those threat models or security design documents can rely on as invariants.

A secondary audience for this document is security researchers who are submitting vulnerability reports against .NET. By documenting how the .NET team thinks about security invariants, we hope researchers can more productively tailor their investigations to areas that do cross true boundaries and do not violate an invariant expected by .NET. Vulnerability reports that are predicated on an invariant being violated are closed as won't fix or by design. See ["Vulnerability theory"](vulnerability-theory.md) for .NET's formal definition of what constitutes a vulnerability.

The first several sections of this document list axioms that all .NET components -- both those written by the .NET team and those written by third-party .NET developers -- can use as foundational underpinnings for their own security analyses. We do not tend to state these in API or product documentation; they are simply _assumed_.

The latter sections describe various interpretations of these axioms as they apply to components created by the .NET team. These are more high-level consequences than direct axioms, but they should still derive naturally from the axioms, and .NET-authored components can assume these interpretations without explicitly stating them in documentation.

## Defining "fully trusted"

Many of the items below use the term **_fully trusted_**. We assume that a fully trusted authority:

* may legitimately exercise total control over the process's execution flow;
* exercises that authority intentionally and not in error; and
* exercises that authority without adversarial influence.

Or, more bluntly: a fully trusted authority tells us what to do, and it's not our place to second-guess them.

> [!NOTE]
>
> This doesn't mean the fully trusted authority _is in fact_ free of misconfiguration or compromise; real systems can and do fail in those ways. It means that, for the purposes of threat assessment, we must _model_ the fully trusted authority as intentional, correct, and uncompromised, because we cannot meaningfully defend against failures in that authority.
>
> Similarly, the assumptions listed here are not necessarily factual claims about the world. For example, nothing prevents a user from making their home directory world-writable. They are instead axioms that bound the model.  If a baseline assumption is violated, the model is no longer applicable, and **we make no security guarantees whatsoever under such conditions.** Components that must operate in environments where a baseline assumption does not hold must declare that as part of their model, and they must redefine their security goals accordingly.

> [!IMPORTANT]
>
> Under this definition, **any entity that can legitimately influence execution flow is fully trusted.** This includes both sysadmins and non-sysadmin operators.
>
> This is distinct from the OS's notion of privilege level, which is primarily concerned with preventing non-sysadmin operators from making sweeping changes that impact _other_ accounts. Our models are scoped to the application, not the entire machine, so OS privilege level does not solely determine trust.
>
> Since non-sysadmin operators are often able to control how the application is launched, configured, deployed, or supplied with operational inputs (such as environment variables, command-line arguments, and configuration files), they are considered "fully trusted" under our model.

## 1. Operating system axioms

### 1.1. The operating system provides account isolation.

The operating system enforces account isolation through ACLs, integrity levels, and other access‑control mechanisms that prevent lower‑privilege accounts from modifying or reading resources owned by higher‑privilege accounts. These same controls prevent standard user accounts from modifying resources belonging to other standard user accounts. Higher‑privilege accounts are not restricted from accessing resources owned by lower‑privilege accounts.

### 1.2. Any entity with equivalent or higher effective privilege is fully trusted.

Any code running within the same process shares the process's privilege level and is therefore fully trusted. ([Sec. 3.3](#33-in-process-composition-is-not-a-security-boundary) revisits this from an application-composition perspective.) Additionally, any other process running under the same user account (if at an equal or higher integrity level) or under a higher-privileged account (such as SYSTEM or root) is fully trusted.

Note that the inverse is not true. Integrity level by itself does not dictate the full set of privileges available to a process. Similarly, non-SYSTEM accounts may hold administrative-equivalent privileges. One cannot conclude _solely from integrity level or user account_ that a secondary process definitively lies beyond the current process's trust boundary. For related Windows guidance, see [Non-boundaries](https://www.microsoft.com/msrc/windows-security-servicing-criteria).

> [!NOTE]
>
> This extends to physical access: an operator with physical access to the machine who can exercise control over the operating system itself is therefore fully trusted.

### 1.3. Diagnostic tools are fully trusted.

When a diagnostic tool attaches a debugger to the process, inspects its memory, or captures a crash dump, a fully trusted authority (the OS, the host, or an in-process diagnostic component) has already validated that the requestor has sufficient privilege to perform that action. Instructions from the diagnostic tool are therefore fully trusted.

> [!NOTE]
>
> This analysis is from the perspective _of the debuggee._ A debugger who attaches to a target running under a different authority or who processes a memory dump originating from a different authority **must not** make trust assumptions about the target.

This extends to the contents of the dumps themselves: an operator in possession of a dump is considered fully trusted. That operator can restore the process from the snapshot and can control execution flow, including potentially exercising some of the same authority (e.g., accessing the same resources) as the original process. Because there is no general way for a component to identify and scrub all privilege-granting state from a dump, we must assume that in the extreme, an operator with access to the dump contents can exercise equivalent authority as the original process.

### 1.4. Certain directories provide access control guarantees.

OS configuration directories and globally installed executable directories are writable only by sysadmins; their contents are therefore fully trusted.

  * On Windows, this includes but is not limited to `%WINDIR%` and `%PROGRAMFILES%`.
  * On non-Windows platforms, this includes but is not limited to `/etc`, `/usr/bin`, and `/usr/lib`.

The OS affords the user's home directory certain access control protections.

  * On Windows, `%USERPROFILE%` can only be accessed (read or write) by the target user; it is inaccessible to other less-privileged accounts.
  * On non-Windows platforms, `~/` can only be written to by the target user.

> [!WARNING]
>
> Some non-Windows platforms _may_ permit world-read access to the user's home directory. Even on platforms that have moved to more restrictive defaults, user accounts created prior to an OS upgrade may retain overly broad permissions. Additionally, some .NET-supported Linux distros continue to grant broad permissions by default.
>
> On these platforms, components **must not** assume confidentiality of the data in the user's home directory unless they have confirmed that the directory is not accessible by unauthorized accounts.

On Windows only, the .NET API `Path.GetTempPath` and the Win32 API `GetTempPath2` return a directory that is accessible only to the current user.

> [!WARNING]
>
> The temp directory guarantees above apply **only** to .NET's `Path.GetTempPath` on Windows (backed by `GetTempPath2`). Callers must not assume equivalent isolation from:
>
> * the Win32 API `GetTempPath`, which may resolve to a shared location such as `C:\Windows\Temp`;
> * any other framework's `GetTempPath`-equivalent API on Windows; or
> * the temp directory on non-Windows platforms.

### 1.5. The machine is correctly configured.

The sysadmin configures the operating system and machine-wide settings in accordance with established best practices. This includes system clock accuracy, TLS root certificate stores, DNS resolver configuration, and any other OS-level settings that security-sensitive components may depend on.

What constitutes "established best practices" is determined by the vendor, the organization, or both; and defining this is outside the scope of this document. We simply assume the responsible party has made a reasonable and informed effort to keep the environment secure.

### 1.6. The machine and environment are up-to-date.

The sysadmin keeps the operating system, globally installed applications, and other machine-wide components up-to-date with security patches.

The operator keeps the execution environment, all dependencies, available tools, and configuration up-to-date with security patches and configured in accordance with established best practices. That is, for anything that is expected to be on the machine prior to the .NET installer or workload being invoked, the operator bears responsibility for maintenance.

## 2. Environmental axioms

### 2.1. Application folders are fully trusted.

An application folder is any directory that contains code or assets that the application _may_ load, not necessarily what it _does_ load. This includes any directory which:

* contains the base executable image;
* contains plugins or other dynamically-loaded code (see [Sec. 3.3](#33-in-process-composition-is-not-a-security-boundary));
* contains configuration, resources, or other application assets (see [Sec. 3.1](#31-application-configuration-is-fully-trusted)); or
* is referenced by `%PATH%` or similar environment variables (see [Sec. 2.2](#22-environment-variables-are-trusted-as-a-control-plane-mechanism) below).

These directories are trusted because their contents can influence execution flow, and we previously defined that any authority who can influence execution flow is fully trusted. This classification of "application folder" derives from the fact that the authority exercises control over these locations, not that the locations have any special meaning to the OS. Similarly, given that application assets and resources may influence execution flow within the application, their containers are considered application folders under this model.

> [!IMPORTANT]
>
> This **does not** automatically include `cwd`, and models **must not** implicitly assume `cwd` to be trustworthy. Users typically expect `cwd` to contain data rather than instructions, so treating it as a trusted application folder can silently expand the trust boundary in ways that contradict user expectations.
>
> However, we recognize that we are in the business of providing CLI dev tools (e.g., `dotnet`, `msbuild`), and there are legitimate scenarios where we are expected to treat the contents of `cwd` as control flow instructions or executable code. If a component does need to treat `cwd` as trustworthy, the model must expressly call this out rather than leave it as an unwritten assumption.

> [!WARNING]
>
> Documentation should avoid encouraging users to run executables directly from `%USERPROFILE%\Downloads`. Doing so treats the _Downloads_ folder as a trusted application folder because the fully trusted user has exercised their authority to execute code from that location, not because the folder is inherently trustworthy. This expands the trust boundary to include all contents of the _Downloads_ folder, which may surprise end users and can inadvertently grant an adversary control over execution flow.

### 2.2. Environment variables are trusted as a control-plane mechanism.

The environment block can only be set by a host authority who is able to launch the application or influence its execution flow. Therefore, the environment variables contained within the environment block are fully trusted.

This makes sense intuitively, as environment variables are specifically intended to carry **control-plane instructions**. These include information about the execution environment, configuration values, and dependency locations.

> [!NOTE]
>
> This justifies why we treat `%PATH%` as fully trusted: it can only be set by a fully trusted authority. While it is certainly possible for the authority to include in `%PATH%` a directory whose contents are not safe to load, [this represents a misconfiguration](https://cwe.mitre.org/data/definitions/427.html) by that authority. And, as mentioned in the introduction, we assume the authority has properly configured the operating environment, as we cannot meaningfully defend against misconfigurations.

In some cases, such as cgi-bin handlers, environment variables (e.g., `HTTP_*`) are used to carry **opaque data** rather than control-plane instructions. In these cases, the _shape_ of the environment block (the existence of keys, the number of keys, the structural patterns of keys/values) is assumed to be under the control of the fully trusted host authority. Every key/value pair appears because the host intentionally included it.

The _contents_ of these data-carrying variables might originate from an untrusted actor. The host must not introduce such data unless there is an explicit, documented contract with the target application describing:

* how to distinguish variables containing control-plane instructions from variables carrying opaque data; and
* what semantics apply to each variable that carries opaque data.

The host cannot impose these restrictions unilaterally; the target application must also agree to this contract. Absent this agreement, the target application may treat all environment variables as control-plane instructions and therefore fully trusted.

### 2.3. The command line is trusted as a control-plane mechanism.

This section parallels the environment block discussion above. Command line arguments, like environment variables, represent control-plane instructions. They describe what specific action to execute, how that action should take place, or what file should be operated on. The command line itself is intentionally constructed by the fully trusted host who is authorized to provide such instructions.

Like with environment variables, the host may wish to provide opaque data via the command line, and this opaque data may have originated from an untrusted actor. The host must not introduce such data unless there is an explicit, documented contract with the target application describing:

* how to distinguish arguments containing control-plane instructions from arguments carrying opaque data; and
* what semantics apply to each argument that carries opaque data.

As with the environment block, the host cannot impose this contract unilaterally. The target application must agree to it; and absent such agreement, the target application may treat all arguments as fully trusted control-plane instructions.

> [!IMPORTANT]
>
> File paths are considered control-plane instructions. For example, if the host passes `--infile somefile.txt`, they are exercising their authority to direct the target application to operate on that file. It is up to the host to ensure that the filename is meaningful to the operating system and that any special characters are properly escaped so that the target application receives a faithful reproduction of the path without mangling or splitting.
>
> This **does not** necessarily mean that the file _contents_ are trusted. Though the file name is control-plane information and thus must implicitly be trusted, the file itself may have originated from the network or some other untrusted source. It is up to each application to determine whether it is a valid scenario to operate on potentially untrusted data. Those determinations are out of scope of this document.

## 3. Application axioms

### 3.1. Application configuration is fully trusted.

Application configuration is a **control-plane mechanism**. It exists to direct execution flow, select modes, control features, and generally dictate application behavior. Because these decisions belong to a fully-trusted authority, the configuration input is itself fully trusted. The configuration system can assume that the input's shape and contents are intentional and correct, and any downstream consumers can assume that the configuration system is returning correct values.

A consequence of this is that we assume the operator maintains confidentiality of and practices good hygiene regarding sensitive data provided via configuration. This includes, but is not limited to, connection strings, API keys, and private keys. Improper disclosure could allow an adversary to masquerade as a legitimate authority, and this may undermine some axioms which underpin the component's security design.

> [!TIP]
>
> Applications may choose to improve usability by detecting overt misconfigurations. This is purely optional and does not impact the fact that configuration remains a trusted control-plane mechanism. A component is not considered insecure simply because it misbehaves when provided incorrect configuration.

In hosted multitenant scenarios, individual tenants may legitimately supply configuration-like values: connection strings, web hook endpoints, or per-tenant feature settings. These values originate outside the trust boundary and are therefore **data**, not control-plane instructions.

When configuration may contain tenant-supplied or otherwise untrusted data, the scenario requires an explicit, documented contract between:

* the configuration system itself, which must document predictability, isolation, and robustness guarantees in the face of potentially hostile input; and
* the downstream consumer (e.g., a component which uses a tenant-provided connection string), which must treat these values as potentially tainted and handle them accordingly.

Absent this agreement, the configuration system and all configuration consumers may treat configuration as fully-trusted control-plane input.

### 3.2. All fully trusted components within the authority boundary are correctly implemented.

All fully trusted components operating within the same authority boundary are correct implementations of their published contracts and invariants. Our security design documents generally do not attempt to enumerate potential defects in other components within the same boundary, as we cannot meaningfully defend against such defects. If a component's published invariants do not hold, the defect lies within that component.

### 3.3. In-process composition is not a security boundary.

Each component within a process is fully trusted with respect to every other component within the process. Any code that can be loaded into the process can fully control execution flow within the process, and components are loaded only as a result of actions by a fully trusted authority. Per [Sec. 3.2](#32-all-fully-trusted-components-within-the-authority-boundary-are-correctly-implemented), all such components are correctly implemented.

.NET does not provide or enforce any intra-process sandboxing mechanism.

> [!NOTE]
>
> One component may still provide untrusted ("tainted") data to another component, perhaps because it initially acquired that data from outside the trust boundary. When this happens, it is because the source component is exercising its authority to invoke the target component, and it is doing this intentionally. The interaction between these two components is governed by the published contract of expected invariants and behavioral guarantees.
>
> See [Sec. 4](#4-authority-boundaries-data-provenance-and-taint) for further information.

### 3.4. Out-of-process composition under the same authority remains fully trusted.

Components ("helpers") intentionally executed out-of-process under the same authority are fully trusted with respect to the invoking component. A process boundary, by itself, does not introduce a security boundary. As described in [Sec. 1.2](#12-any-entity-with-equivalent-or-higher-effective-privilege-is-fully-trusted), any process running under the same user account at an equal or higher integrity level is fully trusted. Per [Sec. 3.2](#32-all-fully-trusted-components-within-the-authority-boundary-are-correctly-implemented), all such components are correctly implemented.

As with in-process composition, data exchanged with an out-of-process helper may be untrusted ("tainted"), even though the control-plane information used to invoke the helper is fully trusted. The interaction between the invoker and the helper remains governed by the published contract of invariants and guarantees.

> [!WARNING]
>
> [Sec. 3.4](#34-out-of-process-composition-under-the-same-authority-remains-fully-trusted) applies only when there is **continuity of authority** between the invoker and the helper. When that continuity is absent, the out-of-process component **must not** be assumed fully trusted, and the model must account for this authority transition.
>
> Authority transitions can be overt or subtle. **Overt** transitions are usually recognizable at the launch site: the invoker launches the helper on a different machine, under a different user account, or within [a less-privileged AppContainer](https://learn.microsoft.com/windows/win32/secauthz/implementing-an-appcontainer).
>
> Other transitions are **subtle**: communication mechanisms that rely on an out-of-band rendezvous (for example, connecting to a named pipe or TCP socket, even on localhost) are subject to interference by processes running under different authorities. Endpoints must mutually authenticate before trusting the channel. By contrast, in-band mechanisms like stdin/stdout are established at process creation time and therefore preserve continuity of authority. (The data carried may still be tainted.)
>
> Recall that we make no security guarantees when a baseline assumption is violated. An authority transition does not "violate" Sec. 3.4 in this sense. Sec. 3.4 remains a sound axiom; what changes under an authority transition is only whether this section's precondition holds. It is therefore a logical error for a model to use Sec. 3.4 as the basis for a security claim when continuity of authority is absent.

## 4. Authority boundaries, data provenance, and taint

We've avoided concretely defining "authority boundary," as the operational definition more effectively illustrates the overall concept. If you'd like, you can think of the authority boundary as encompassing every component that is _technically capable_ of performing the same set of actions as you (even if they never exercise this capability), including accessing the same resources in the same manner or generating the same externally observable effects. Any entity that cannot directly do this -- but which instead necessarily relies on a component within your authority boundary mediating such operation -- is outside your authority boundary.

> [!IMPORTANT]
>
> The earlier axioms should not be read as an exhaustive enumeration of everything within your authority boundary. Any real-world system will interact with components whose relationship to the rest of the system does not cleanly fit into one of these buckets. This document does not claim that such components automatically fall within or outside the authority boundary. The true answer of where the component lies requires an analysis of the component's capabilities, informed by the nature of the relationship between the component and the rest of the system.

Remember: this is from the perspective of the component being modeled. There's not necessarily a symmetry present. For example, user-mode code necessarily must include the OS kernel within its authority boundary, since the kernel can exercise full control over any code running in user mode. From the kernel's perspective, however, user-mode code is outside its authority boundary. The kernel mediates user-mode access to any resource under the kernel's authority.

> [!TIP]
>
> This roughly parallels the concept of a "control sphere" [as described by the CWE working group](https://cwe.mitre.org/documents/vulnerability_theory/intro.html#chap7). Feel free to refer to the linked document for more information on vulnerability theory. This is not required reading; we do not assume our audience is familiar with the linked document or its foundational theories.

When interacting with an entity beyond the authority boundary, no component within the authority boundary can assume that the entity is upholding any required invariants or behavioral guarantees. The entity might even be actively hostile and intentionally trying to subvert the guarantees of components operating within the authority boundary.

When encountering data or commands whose provenance rests beyond the authority boundary, we say the data flow is **tainted**. The most obvious cases occur when interacting with a tunnel which punctures the authority boundary: reading from a TCP stream returns tainted bytes to the reader. More subtle cases occur when a trusted component generates a payload but incorporates tainted data within the payload; the generated payload is likewise tainted. For example, if web site registrants can specify their own username at account creation, then the _username_ argument is tainted, and any component which generates a URI like `https://example.com/users/{username}` is generating a tainted URI string, _even if that component properly escapes the username argument._

A trusted component may persist this data to a trusted store secured by a trusted channel, but the data remains tainted because its provenance rests beyond the authority boundary. The taint flag is removed only once a component guarantees that the data fulfills all required invariants expected by all other components that will interact with the data.

Improper tracking of tainted data can lead a component to fail to uphold its contracted invariants or guarantees, potentially undermining the assumptions that other components within the boundary depend on. If one component (the "sender") transmits data to another component (the "receiver") within the boundary, responsibility rests with the sender to ensure that any potentially tainted data conforms to any requirements the receiver has placed on that interaction. The invocation action itself is an implicit assertion by the sender that the data meets the receiver's contract.

> [!NOTE]
>
> Describing how to track taint flows and how to reason about them in published contracts is out of scope of this document. See ["How to choose a threat modeling framework"](choosing-a-framework.md) and ["How to model taint flows"](modeling-taint-flows.md) for more information.

## 5. The CIA triad

The preceding sections stated axioms that define trust boundaries and assumptions about behaviors, and they discussed how we shape the authority boundaries and reason about taint flows. This section explores how these concepts apply when assessing .NET components against [the CIA triad](https://github.com/microsoft/Security-101/blob/main/1.1%20The%20CIA%20triad%20and%20other%20key%20concepts.md), a model for reasoning about security properties. These are interpretations of the concepts, not axioms in themselves.

### 5.1. Confidentiality

A **confidentiality** failure arises when an entity can observe data it is not authorized to observe. Fully trusted authorities are definitionally authorized to observe any and all data; therefore it is not a confidentiality failure for such an authority to have access to sensitive data.

**Scope.** Confidentiality concerns are meaningful only at authority boundaries. Capabilities that allow code to inspect memory, data structures, exception information, or configuration do not, by themselves, constitute confidentiality risks under this model. This includes reflective or dynamic mechanisms, which execute under the authority of the invoking component.

**Responsibility.** Disclosure of information is a control-plane decision. If a component elects to disclose sensitive information outside its authority boundary, any confidentiality failure lies in the component making that disclosure -- not in the component that originally housed the sensitive data, and not in any shared plumbing that merely transports data.

### 5.2. Integrity

An **integrity** failure arises when an entity can, without authorization, mutate state or influence execution in a way that violates intended invariants. Fully trusted authorities are definitionally authorized to direct execution flow and to modify application state; therefore it is not an integrity failure for such an authority to do so.

**Scope.** The mere existence of powerful execution or mutation mechanisms does not imply an integrity risk. Capabilities that allow dynamic code loading, dynamic dispatch, indirect invocation, or state mutation do not, by themselves, constitute integrity risks under this model. Such capabilities execute under the authority of the invoking component.

**Responsibility.** Integrity failures typically arise when a trusted component exposes a control plane to tainted input, allowing that input to influence control-flow decisions or state transitions that were meant to remain under the fully trusted authority. When this occurs, the integrity failure lies in the component that made the control-plane reachable from untrusted input -- not in the mechanism that facilitates or carries out the modification, and not in any shared plumbing that merely transports data.

Integrity failures are not limited to control-plane exposure within the current authority boundary. They can also arise when unauthorized entities mutate data, even if that data is never used within the current authority's control plane. For example, if a web application serves a tampered file to a client, that client (or its human operator) may improperly frame the contents as having the authority of the trusted web server, resulting in harm to the client or its operator when they act on that data.

> [!NOTE]
>
> In practice, confidentiality and integrity failures usually manifest differently. Confidentiality failures often occur due to misconfigurations or operational choices that _unintentionally_ expose sensitive data to an overly broad audience; e.g., by enabling verbose diagnostics at a boundary. Integrity failures are often driven by design choices that _intentionally_ expose a control plane to tainted input, typically because the invoking component isn't aware that it's interfacing with a control plane or that the input may be tainted. These examples are simply commonly observed patterns, not strict definitions.

### 5.3. Availability

An **availability** failure arises when an authorized caller cannot interact with a resource at the resource provider's advertised service level. This typically manifests as the resource simply being inaccessible to the requester (e.g., machine unreachable, HTTP 503). It can also mean that specific interactions with the resource degrade (e.g., "account transfers are unavailable at this time"), time out, or otherwise fail to meet the resource provider's SLA.

**Scope.** Because fully trusted authorities are definitionally authorized to direct execution flow, it is not an availability failure for such an authority to restrict access to resources. Availability claims are meaningful only when the resource provider has established a service level, whether through documentation, SLA, or implicit contract. Absent such a commitment, there is no baseline against which to measure degradation.

Availability failures typically occur when a limited resource (CPU, threads, memory, storage, network bandwidth, energy, etc.) is exhausted. They can also occur due to externalities: integrity failures (e.g., unauthorized deletion or corruption of state; see [Sec. 5.2](#52-integrity)), operating environment failures (e.g., hardware failures, power outages), or resource exhaustion induced by external actors legitimately authorized to consume those resources.

**Responsibility.** As library and SDK authors, we cannot mitigate availability failures caused by external sources. The scope of our responsibility is twofold: we must not exacerbate externally-induced failures should they occur, and we must not introduce availability failures ourselves by allowing unauthorized agents to exhaust application resources. ["APIs and calling patterns"](apis-and-calling-patterns.md) further describes .NET's philosophy regarding allowable resource consumption.
