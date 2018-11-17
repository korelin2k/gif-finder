# gif-finder

### Find My Movie GIF!
1. Discussed this with Mason, but went another direction outside of buttons - did not like that customer experience.
2. Integrated with OMDB on the movie search, and displayed up to the first 10 matches. In the future will enable pagination and a cleaner experience from a customer perspective - but for now, the top 10 works! A few additional notes:
  * Any movie that had a poster of N/A was filtered out
  * Any movie that had a poster with an image that was not found was filtered out (this took a while)
3. Always increments 10 GIFs at a time with as many movies as you want to search
4. GIFs are downloadable by clicking on the download icon (download.js was leveraged)
5. My favorites section that persists after browser is closed (leverages localstorage) by clicking on the heart icon
5. Fully responsive (huge screen vs mobile)


### Link
https://korelin2k.github.io/gif-finder/