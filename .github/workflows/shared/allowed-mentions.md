---
description: >-
  Shared allowlist of @mention handles that agentic workflows in this repo may
  emit through safe-outputs, so these handles are notified instead of being
  escaped in generated issue, discussion, and pull request content.
safe-outputs:
  mentions:
    allowed:
      # Repo reviewers and owner teams
      - dotnet/aspnet-api-review
      - dotnet/dotnet-winforms
      - dotnet/dotnet-wpf-maintainers
      - dotnet/wpf-developers
      - agocke
      - jeffhandley
      - JulieLeeMSFT
      - karelz
      - lewing
      - SamMonoRT
      - steveisok
      # .NET libraries area owners
      - dotnet/area-extensions-caching
      - dotnet/area-extensions-configuration
      - dotnet/area-extensions-dependencyinjection
      - dotnet/area-extensions-filesystem
      - dotnet/area-extensions-hosting
      - dotnet/area-extensions-logging
      - dotnet/area-extensions-options
      - dotnet/area-extensions-primitives
      - dotnet/area-microsoft-win32
      - dotnet/area-system-buffers
      - dotnet/area-system-codedom
      - dotnet/area-system-collections
      - dotnet/area-system-componentmodel
      - dotnet/area-system-componentmodel-dataannotations
      - dotnet/area-system-console
      - dotnet/area-system-diagnostics
      - dotnet/area-system-diagnostics-metric
      - dotnet/area-system-diagnostics-process
      - dotnet/area-system-diagnostics-tracesource
      - dotnet/area-system-diagnostics-tracing
      - dotnet/area-system-drawing
      - dotnet/area-system-formats-asn1
      - dotnet/area-system-formats-nrbf
      - dotnet/area-system-formats-tar
      - dotnet/area-system-globalization
      - dotnet/area-system-io
      - dotnet/area-system-io-compression
      - dotnet/area-system-linq
      - dotnet/area-system-linq-parallel
      - dotnet/area-system-memory
      - dotnet/area-system-numerics
      - dotnet/area-system-reflection
      - dotnet/area-system-reflection-emit
      - dotnet/area-system-reflection-metadata
      - dotnet/area-system-resources
      - dotnet/area-system-runtime
      - dotnet/area-system-runtime-compilerservices
      - dotnet/area-system-runtime-intrinsics
      - dotnet/area-system-security
      - dotnet/area-system-text-encoding
      - dotnet/area-system-text-encodings-web
      - dotnet/area-system-text-json
      - dotnet/area-system-text-regularexpressions
      - dotnet/area-system-threading-channels
      - dotnet/area-system-threading-tasks
      - dotnet/area-system-xml
      - dotnet/efteam
      - dotnet/interop-contrib
      - dotnet/ncl
      - dotnet/Tellurium
      - 333fred
      - bartonjs
      - halter73
      - pavelsavara
      - StephenMolloy
      - vcsjones
      - vsadov
      # .NET runtime, tooling, and out-of-band area owners
      - dotnet/area-dependencymodel
      - dotnet/area-infrastructure-libraries
      - dotnet/area-meta
      - dotnet/area-system-componentmodel-composition
      - dotnet/area-system-composition
      - dotnet/area-system-configuration
      - dotnet/area-system-datetime
      - dotnet/area-system-diagnostics-activity
      - dotnet/area-system-diagnostics-coreclr
      - dotnet/area-system-diagnostics-eventlog
      - dotnet/area-system-diagnostics-performancecounter
      - dotnet/area-system-directoryservices
      - dotnet/area-system-formats-cbor
      - dotnet/area-system-io-hashing
      - dotnet/area-system-io-ports
      - dotnet/area-system-management
      - dotnet/area-system-numerics-tensors
      - dotnet/area-system-serviceprocess
      - dotnet/area-system-speech
      - dotnet/area-tracing-coreclr
      - dotnet/crossgen-contrib
      - dotnet/dnr-codeflow
      - dotnet/dotnet-diag
      - dotnet/fxdc
      - dotnet/gc
      - dotnet/ilc-contrib
      - dotnet/illink
      - dotnet/jit-contrib
      - dotnet/net-sdk-workload-contributors
      - dotnet/runtime-infrastructure
      - AaronRobinsonMSFT
      - akoeplinger
      - anicka-net
      - BrennanConroy
      - BrzVlad
      - cheenamalhotra
      - David-Engel
      - davidwrighton
      - elinor-fung
      - janvorli
      - jkoritzinsky
      - joperezr
      - kotlarmilos
      - leecow
      - matouskozak
      - mconnew
      - mdh1418
      - MichaelSimons
      - MichalStrehovsky
      - simonrozsival
      - thaystg
      - tommcdon
      - vitek-karas
---

<!--
Shared @mention allowlist for agentic workflows in this repository.

gh-aw's safe-outputs mention sanitizer escapes any @handle that is not in the
workflow's mentions.allowed list. Import this file to reuse the curated set of
handles that maintainer-owned workflows are expected to notify, rather than
maintaining a separate list in each workflow. Handles are grouped (dotnet/ teams
first, then individuals) and sorted alphabetically within each group.

Keep the set limited to handles workflows should actually be able to @mention.
Update this list when the mentionable owners change, then recompile any
workflow that imports it.
-->
