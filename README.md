# Bahá'í Songs [![pages-build-deployment](https://github.com/va9id/bahai-songs/actions/workflows/pages/pages-build-deployment/badge.svg)](https://github.com/va9id/bahai-songs/actions/workflows/pages/pages-build-deployment)

An initiative to share Bahá'í song lyrics available at [bahaisongs.ca](https://bahaisongs.ca). Also includes a [Bahá'í calendar](https://bahaisongs.ca/calendar.html) that you can add to your calendar.

## Contributing

### Adding new songs [![Validate Songs Data](https://github.com/va9id/bahai-songs/actions/workflows/validate-json.yaml/badge.svg)](https://github.com/va9id/bahai-songs/actions/workflows/validate-json.yaml)

- Update [`songs.json`](/assets/data/songs.json)
    - A workflow runs automatically when it's updated to ensure the [schema](/assets/data/schema.json) is respected.
- When adding a song of a new language, ensure the `"language"` key has the correct [ISO 639](https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes) language code value
    - The language "_Other_" is used for uncommon languages since all the language codes aren't supported properly across different platforms by the `Intl` API.
        - For example: the African language Nyanja (with ISO 639 code "ny") doesn't have a DisplayName on browsers in Android, but it does on Apple devices.

### Code
- For code changes refer to the [contribution guidelines](/CONTRIBUTING.md). 
- For any issues or suggestions create an [issue](https://github.com/va9id/bahai-songs/issues).
- _HTML/CSS/🍦js stack to keep the site **lightweight** and **fast**💨._
