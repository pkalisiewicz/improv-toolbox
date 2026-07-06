# Soundscape Audio Provenance

Every file in `public/sounds/` is CC0 1.0 or public domain, so the repo can
redistribute them under any license and no attribution is required. We record
the sources anyway, both as license evidence and as a thank-you to the
recordists. Verified 2026-07-06 against each evidence page.

All files were transcoded from the sources with ffmpeg: trimmed to at most
6 minutes, loudness-normalized to -20 LUFS, given 1.5 s edge fades for loop
comfort (the elevator track loops by design and got no fades), and encoded as
44.1 kHz stereo MP3.

| File | Source recording | Author | License | Evidence |
|---|---|---|---|---|
| rain.mp3 | Rain heavy 1 (rural) | jmbphilmes | CC0 1.0 | [freesound.org/s/200270](https://freesound.org/people/jmbphilmes/sounds/200270/) |
| city.mp3 | Urban commercial pedestrian street ambience (Liuzhou) | lastraindrop | CC0 1.0 | [freesound.org/s/716384](https://freesound.org/people/lastraindrop/sounds/716384/) |
| forest.mp3 | Forest Birds 01 | Pivou | CC0 1.0 | [freesound.org/s/465170](https://freesound.org/people/Pivou/sounds/465170/) |
| cafe.mp3 | Cafe Ambience (crowded Bay Area cafe) | bittermelonheart | CC0 1.0 | [freesound.org/s/732984](https://freesound.org/people/bittermelonheart/sounds/732984/) |
| storm.mp3 | Thunderstorm after hot summer day (part 1 of 4) | via pdsounds.org | Public domain | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Thunderstorm_after_hot_summer_day_17_minutes_01_of_04.ogg) |
| fireplace.mp3 | Aachen — Burning Fireplace Crackling Fire Sounds | visionear | CC0 1.0 | [freesound.org/s/501417](https://freesound.org/people/visionear/sounds/501417/) |
| ocean.mp3 | Ocean Surf Along the Coast of Maine (Casco Bay) | be-steele | CC0 1.0 | [freesound.org/s/362414](https://freesound.org/people/be-steele/sounds/362414/) |
| elevator.mp3 | Elevator Music | Pro Sensory (Alex McCulloch) | CC0 1.0 | [OpenGameArt](https://opengameart.org/content/elevator-music) |

The Freesound files were fetched as the full-length CDN "HQ preview"
transcodes, which Freesound serves without authentication; the underlying
works are CC0, so the transcodes are redistributable. The Commons file's
public-domain status is machine-verifiable through the API (`License: pd`).

Replaced on 2026-07-06: the previous set traced back to ambient-mixer.com
uploads with no verifiable license, which blocked open-sourcing the repo.
