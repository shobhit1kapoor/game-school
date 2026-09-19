# Contributing to Game School

Thank you for improving Game School. This project is designed for young learners, so every change should make the next step clearer, calmer, and more trustworthy.

## Development workflow

1. Create a focused branch from `main`.
2. Make the smallest coherent change.
3. Run the required checks:

   ```bash
   npm run lint
   npm run test
   npm run build
   ```

4. Test the affected interaction in a browser at desktop and narrow widths.
5. Describe learner-facing changes, testing performed, and any content assumptions in the pull request.

## Content contract

When adding or changing a lesson:

- Keep language age-appropriate for the target grade.
- Preserve the sequence: **concept explanation → guided check → 10-part practice → feedback**.
- Include a clear, unambiguous correct answer and plausible distractors.
- Avoid stereotypes, cultural assumptions, and unnecessary time pressure.
- Keep the stage syllabus aligned with the lesson title and skill.
- Do not mark games or lessons as locked; Game School supports free exploration.

## Interaction contract

- Buttons must remain keyboard reachable and have an accessible name.
- Correct, incorrect, reward, and ordinary click feedback must retain their distinct sound cues.
- Respect `prefers-reduced-motion` in new animation work.
- Keep learner information in the local-first state model. Do not add trackers, advertising SDKs, or remote accounts without an explicit privacy design review.

## Arcade changes

Games under `public/arcade/` are packaged local experiences. Keep their entry pages self-contained, English-first, and free of independent logins. Preserve the common Game School HUD and test the game directly through its `/arcade/<game>/index.html` route.
