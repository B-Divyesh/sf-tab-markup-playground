# Demo sandbox

Open <https://tab-markup-playground.sociobot.in/demo/> or choose **Try it with
sample data** on the home page.

The demo starts with a realistic four-bar G-major warmup. It includes four
chords and six ASCII tab strings, so the chord, fretboard, interval, and scale
views are populated immediately.

Demo edits use the separate browser-storage key
`tab-playbook:demo:draft:v1`. Normal work uses `tab-playbook:draft:v1`; the demo
never reads or writes that key. **Reset demo** restores the shipped sample.
**Start for real** removes the demo key and returns to the normal editor without
changing a normal draft.

The complete demo is available after its first load because the service worker
precaches the demo page and its same-origin assets.
