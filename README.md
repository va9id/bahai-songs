# Bahá'í Songs [![pages-build-deployment](https://github.com/va9id/bahai-songs/actions/workflows/pages/pages-build-deployment/badge.svg)](https://github.com/va9id/bahai-songs/actions/workflows/pages/pages-build-deployment)

<p align="center">
  <img src="assets/imgs/logo.jpeg" alt="Logo" width="200px">
</p>

This is an initiative to share Bahá'í song lyrics available at [bahaisongs.ca](https://bahaisongs.ca). 

## Contributing

### Want to add a song? 

If you want to request for a song to be added, please [submit a song](https://bahaisongs.ca/src/pages/submit.html) on our website.

### Code

- For any issues or suggestions, please create an [issue](https://github.com/va9id/bahai-songs/issues).

- For any code changes you'd like to add, please create a [pull request](https://github.com/va9id/bahai-songs/pulls).

#### Adding songs programmatically [![Validate Songs JSON Schema](https://github.com/va9id/bahai-songs/actions/workflows/validate-json.yaml/badge.svg)](https://github.com/va9id/bahai-songs/actions/workflows/validate-json.yaml)
- You can also add a song by updating [`songs.json`](/src/data/songs.json), which has a workflow when updated ensuring the [schema](/src/data/schema.json) is respected. 
- When adding a song for a new language, ensure the `"language"` key has the correct [ISO 639](https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes) language code value.

#### *Note*
The techstack is plain and simple: HTML, CSS, Bootstrap and 🍦 `js`.<br><br>
*Please don't bother* submitting a PR where you turn the site into a `react` app or something. The **goal** here is to be **lightweight**💨 and **dependency free**.


