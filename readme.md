# SillyTavern RP English Coach

## Overview

A [SillyTavern](https://docs.sillytavern.app/) extension for learning English while roleplaying.

RP English Coach uses your selected [connection profile](https://docs.sillytavern.app/usage/core-concepts/connection-profiles/) to generate feedback after character responses. The roleplay message stays first, and the coaching panel appears below it so you can read the scene before studying corrections.

![popup](images/overview.png)

---

## What it does

- Gives selective feedback on the user's previous roleplay writing.
- Suggests more natural phrasing without rewriting long messages completely.
- Explains grammar, wording, clarity, style, or unnecessary detail in Indonesian.
- Extracts useful vocabulary and phrases from the character response.
- Lets you edit, regenerate, or delete feedback per message.
- Keeps schema, prompt, and HTML template customizable from settings.

---

## Recommended setup

1. Open extension settings.
2. Choose a connection profile.
3. Set **Auto Mode** to **Process character responses**.
4. Use **Native API** if your model/API supports structured output.
5. If Native API fails, switch **Prompt Engineering** to **JSON** or **XML**.

For Text Completion profiles, make sure the profile contains API, preset, model, and instruct settings.

For Chat Completion profiles, API, settings, and model are usually enough.

---

## Schema and template

You can customize the feedback schema and HTML template.

Default feedback contains:

- `feedbackSummary` — short Indonesian summary.
- `writingFeedback` — selected issues from the user's writing.
- `vocabulary` — useful or difficult terms from the character response.

You can also pick a different schema preset for the active chat from the extensions menu.

![modify_for_this_chat](images/modify_for_this_chat.png)

---

## Settings

![settings](images/settings.gif)

Main settings:

- **Connection Profile** — model/profile used to generate feedback.
- **Auto Mode** — use **Process character responses** for the intended workflow.
- **Prompt Engineering** — Native API, JSON, or XML output mode.
- **Feedback Schema** — structured output shape.
- **HTML Template** — how feedback is rendered under messages.
- **Include Last X Messages** — context window for the roleplay scene.
- **Include Last X Coach Feedback Entries** — previous feedback entries injected into context.

---

## Installation

Install via the SillyTavern extension installer:

```txt
https://github.com/bmen25124/SillyTavern-WTracker
```

If you rename this fork/repo, use your new repository URL instead.

---

## FAQ

> I'm getting API or structured output errors.

Your API/model might not support structured output. Change `Prompt Engineering` from `Native API` to `JSON` or `XML`.

> Why does feedback appear below the character response?

So roleplay flow stays intact. Read the character response first, then study the feedback panel below it.

> Can I make feedback shorter or more detailed?

Yes. Edit the prompt, schema, or HTML template in settings.

> Can I still use it manually?

Yes. Click the message toolbar language icon to generate or regenerate feedback for a message.
