# Experience — performance

<!-- Entry file (procedural lessons). Created automatically on first ADD_ROOT to experience/performance.md.
     roots = general lessons, deltas = condition-specific variations (when=), traps = failure records. -->

## Lessons
<!-- empty: reusable strategies that worked, with the reason they work -->

## Traps
<!-- empty: approaches that failed: what was tried, what happened, what to do instead -->
- [performance-0001] trap h=0 x=0 d=2026-10-23 labels=lighthouse,lcp,mobile,animation :: FAILED: speeding up or deferring intro animation to raise Lighthouse mobile LCP; the simulated score barely moved. INSTEAD: check which element is LCP and what downloads before first paint; mobile LCP was fixed by painting the cue from HTML and shrinking first-paint images (WebP, phone-sized texture).
