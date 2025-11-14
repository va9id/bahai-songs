# Bahá'í Songs [![pages-build-deployment](https://github.com/va9id/bahai-songs/actions/workflows/pages/pages-build-deployment/badge.svg)](https://github.com/va9id/bahai-songs/actions/workflows/pages/pages-build-deployment)

<p align="center">
  <img src="assets/imgs/logo.jpeg" alt="Logo" width="200px">
</p>

This is an initiative to share Bahá'í song lyrics available at [bahaisongs.ca](https://bahaisongs.ca). As a bonus we also include a [Bahá'í calendar](https://bahaisongs.ca/src/pages/calendar.html) that you can add to your device.

## Contributing

### Want to add a song?

If you want to request for a song to be added, please [submit a song](https://bahaisongs.ca/src/pages/submit.html) on our website.

#### Adding songs yourself [![Validate Songs JSON Schema](https://github.com/va9id/bahai-songs/actions/workflows/validate-json.yaml/badge.svg)](https://github.com/va9id/bahai-songs/actions/workflows/validate-json.yaml)

-   Update [`songs.json`](/src/data/songs.json)
    -   A workflow runs automatically when it's updated to ensure the [schema](/src/data/schema.json) is respected.
-   When adding a song of a new language, ensure the `"language"` key has the correct [ISO 639](https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes) language code value

    -   The language "_Other_" is used for uncommon languages since all the language codes aren't supported properly across different platforms by the `Intl` API.

        -   For example: the African language Nyanja (with ISO 639 code "ny") doesn't have a DisplayName on browsers in Android, but it does on Apple devices.

### Code

-   For any issues or suggestions, please create an [issue](https://github.com/va9id/bahai-songs/issues).

-   For any code changes you'd like to add, please create a [pull request](https://github.com/va9id/bahai-songs/pulls).

### _Note_

The stack is simple; HTML, CSS, Bootstrap and 🍦 `js`, with the goal of keeping the site **lightweight** and **fast** 💨.
