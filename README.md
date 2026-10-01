# Bright Royale Arena

Redesign the Bright Battle Royale 2026 website with a completely new visual direction.

IMPORTANT:
Do NOT use the previous InMobi Sports Day design.
Do NOT create a generic sports dashboard.
Do NOT create a typical AI-generated landing page with a giant hero, floating glass cards, excessive gradients, excessive shadows, or dozens of rounded cards.

Use the uploaded/reference images as VISUAL INSPIRATION for the design language:
- bold editorial typography
- strong color-blocked sections
- clean white space
- dark green backgrounds
- bright green accents
- occasional yellow/orange highlights
- large numbers and event typography
- image-led sections
- rounded image corners
- simple but expressive layouts
- strong visual hierarchy
- modern sports/editorial energy

In the reference image there is a race track; add some other track styling/motif instead of that arched track (such as dynamic athletic circuit lanes, stadium curve, or sprint straightaway).

Do not copy the reference websites literally. Create an original Bright Battle Royale identity.

BRAND:
Bright Money's internal sports championship: BRIGHT BATTLE ROYALE 2026
Brand personality: modern, energetic, clean, youthful, premium, friendly, competitive, trustworthy.
Combination of: BRIGHT MONEY + MODERN SPORTS EDITORIAL + CHAMPIONSHIP BRANDING.

COLOR SYSTEM:
Primary: Bright Green (#17C95F), Dark Green / Near Black (#0E1E14), White (#FFFFFF)
Supporting: Mint (#E3F1E7), Light Mint (#BAE8CB)
Energy accents: Yellow (#FFC42C), Warm Yellow (#FCC038), Orange (#FC712B)
Dominant combination: green + white. Dark green for major visual sections. Clean white background predominantly.

TYPOGRAPHY:
Bold modern sans-serif display font for BRIGHT BATTLE ROYALE, titles, sport names, large numbers, dates.
Clean sans-serif for descriptions, navigation, match info. Strong contrast between big display type and small information type.

LAYOUT & SECTIONS:
1. Navigation (minimal, Bright logo, Battle Royale, Points, Schedule, Sports, Live indicator; mobile optimized)
2. Championship introduction (bold editorial intro: BRIGHT BATTLE ROYALE 2026, FOUR HOUSES. ELEVEN SPORTS. ONE CHAMPION. 06—17 OCTOBER 2026)
3. Next Up / countdown (CARROM SINGLES, 06 OCT, BRIGHT OFFICE)
4. Championship standings (THE CHAMPIONSHIP, 4 houses: House A, House B, House C, House D with ranks, points, medals, points gap, LEADING badge, horizontal championship race bars / typography-driven rows)
5. The Games (numbered sports list: Cricket, Football, Badminton, Table Tennis, Carrom, Chess, etc. with hover effects and links to tournament views)
6. Schedule timeline (date-anchored editorial timeline from 06 Oct to 17 Oct finale)
7. Recent results / podium winners
8. Dedicated Sport / Tournament views with fixtures, knockout brackets, results, and podiums
9. Points Table page with detailed breakdown and championship progress
10. Footer

DATA ARCHITECTURE:
Centralized mock data in src/data/mockData.ts for houses, points, medals, sports, schedule, venues, fixtures, brackets, results, and podiums so it can easily connect to Google Sheets later.

Mobile-first design with large touch targets, no horizontal overflow, and deliberate layouts for both mobile and desktop.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/d647d8db-861e-4a83-9f7b-96369caf49d2).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
