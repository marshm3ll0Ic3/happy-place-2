<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Application architecture
- Keep talent discovery fixtures in a browser-safe module separate from private applications and legacy financial records; this prevents demo examples from becoming real activity.
- Use protected server functions and owner-scoped database policies for resumable applications; ownership comes from the verified session, never submitted fields.
- Preserve legacy DSC and orders as an archive and block old issuance/order creation endpoints; saved intentions must never be mistaken for executed trades or money.
- Use one shared integer-minor-unit accounting helper and UTC elapsed-day lifecycle helper; all screens must use identical units and programme deadlines.
- Keep route-level share metadata and URL-backed discovery filters; profile navigation must carry catalogue search state.
- New programme copy uses a shared locale-aware copy helper alongside the existing dictionaries; this preserves all four languages without mutating legacy copy.
- Keep the imported Talent / 365 interactive demo sandboxed within /fund, with device-local simulation state and separate resource/forecast balances; never bridge account credentials or real ledgers into the uploaded prototype.
- Use the compact navigation below the xl breakpoint, minimum-width-zero text tracks, and scrollable viewport-bounded sheets; this keeps translated navigation and account controls usable on phones and tablets.
- Demo credit purchases and market orders run through signed-in database actions called from the browser, not server functions; the app is also hosted on the owner's own Cloudflare Worker, which has no server-side backend keys.
