# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React, TypeScript, Vite, Tailwind CSS, and React Router, as specified in the confirmed brief.

## Users

Assumption confirmed from the attached brief: candidates preparing for the IBGE Recenseador exam who want to practice Conhecimentos Técnicos by topic block.

## Product Purpose

Provide a straightforward way to answer original multiple-choice questions, see immediate right-or-wrong feedback, read an explanation with its study-booklet reference, and review a block score.

## Positioning

Practice is organized into eight CT blocks, with authored questions kept alongside their explanations and page references. The site is independent study material and is not official or affiliated with IBGE or Cesgranrio.

## Operating Context

The learner chooses one of CT 01–CT 08, answers its questions in order, and sees a result at the end. Session progress lives only in memory while the page remains open.

## Capabilities and Constraints

- Eight shareable block routes and a home page listing the real question count for each block.
- Five alternatives per question, a locked answer, immediate feedback, explanation, source, progress, and a final score.
- No accounts, backend, APIs, network loading of question data, cookies, local storage, saved history, ranking, or administrative interface.
- Questions are static JSON. The supplied text, answer keys, explanations, and references must remain unchanged.
- Blocks without supplied questions remain empty and display as being prepared.
- Static build for GitHub and Vercel; no automatic publishing.

## Evidence on Hand

- `blocos.json` provides metadata for CT 01–CT 08.
- `ct01.json` provides 20 real authored questions. It is the only supplied question file.
- No question content was supplied for CT 02–CT 08; these blocks must remain empty until source JSON files are provided.

## Product Principles

- Preserve source questions exactly.
- Show the answer and explanation only after a learner responds.
- Make the source page visible with the explanation.
- Keep the flow usable on mobile and desktop, including keyboard navigation and long text.
- Keep sessions simple and non-persistent.

## Accessibility & Inclusion

The brief requires keyboard navigation, visible focus, legible contrast, responsive layouts, and controls that clearly communicate disabled and answered states.
