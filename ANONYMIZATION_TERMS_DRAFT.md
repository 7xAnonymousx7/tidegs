# Anonymization Terms Draft

Use this file as a draft when filling `terms to anonymize` on `anonymous.4open.science`.

Only include identity-bearing terms that actually appear in your repository, filenames, PDFs, or linked assets. The service replaces matched terms with `XXXX`, so avoid adding method names or technical words you want reviewers to keep seeing.

## Recommended Terms To Fill

Add one term per line in the web form. Replace the placeholders below with your real values:

```text
[Author Full Name 1]
[Author Given Name 1]
[Author Family Name 1]
[Author Initials 1]
[Author Full Name 2]
[Author Given Name 2]
[Author Family Name 2]
[GitHub Username]
[GitHub Organization Name]
[Primary Email Domain]
[University Full Name]
[University Acronym]
[Department Name]
[Lab or Group Name]
[Advisor or PI Name]
[Personal Website Domain]
[Project Website Domain]
[Local Username If It Appears In Any File]
[Cluster or Server Name If It Appears In Any File]
```

## Optional Terms

Add these only if they appear anywhere in the repository and could help identify the authors:

```text
[City Name]
[Campus Name]
[Country-Specific Lab Acronym]
[Old Project Codename Linked To Your Group]
[Old Submission Identifier]
```

## Terms You Probably Should Not Add

Do not add these by default, because replacing them with `XXXX` may make the webpage harder to understand or break file paths:

```text
TideGS
CLM
Vanilla 3DGS
Waymo
nuScenes
PandaSet
3D Gaussian Splatting
```

## Notes For This Repository

- The text files I scanned do not currently contain obvious author names, email addresses, GitHub usernames, or institution names.
- The main cleanup items were stale project strings and submission identifiers rather than direct author identity.
- Binary metadata inside images, videos, or PDFs was not inspected in this draft. Check those separately if needed.
