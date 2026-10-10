---
title: "Pig: A Dice Game of Risk"
summary: Roll as long as you dare. A one wipes out your turn. Campers discover when to stop by collecting data.
duration: 30 min
ages: 7–14
group_size: Groups of 2–4
location: Anywhere
topics: [probability, expected value, data]
materials:
  - item: Dice
    qty: 20
    cost: 0.25
  - item: Score sheets
    qty: 30
    cost: 0.05
    consumable: true
  - item: Pencils
    qty: 30
    cost: 0.20
---

## Rules

> [!rules]
> 1. On your turn, roll one die as many times as you like, adding up the numbers.
> 2. If you roll a **1**, your turn ends and you score **nothing** for that turn.
> 3. Say **"hold"** to stop and add your turn total to your score.
> 4. The first player to reach **100** wins.

> [!facilitation]
> Play one demo round against a volunteer in front of the group. Lose on purpose by pushing your luck too far.

## Play

Groups play two full games. Each player writes down every turn total and whether they held or "pigged out."

> [!facilitation] Collecting data
> Hand out score sheets with columns for *turn total* and *held / rolled a 1*. Afterwards, combine everyone's sheets on the board.

## Discuss

Is there a turn total where you should always hold? Have groups propose a strategy ("hold at 20") and play it against another group's strategy.

After the groups have shared their guesses, show the simulation. It plays thousands of turns for every "hold at" number and plots the average score per turn.

<iframe src="/sketches/pig-strategy/" title="Pig strategy simulation" width="100%" height="420" style="border: 1px solid var(--bs-border-color); border-radius: .375rem;"></iframe>

[Open the simulation full screen](/sketches/pig-strategy/)

> [!facilitation]
> For older campers: the chance of not rolling a 1 is $\frac{5}{6}$, and the average of the other faces is $4$. With a turn total of $T$, one more roll gains about $\frac{5}{6} \cdot 4$ points and risks losing $\frac{1}{6} \cdot T$, so keep rolling while
>
> $$\frac{5}{6} \cdot 4 > \frac{1}{6} \cdot T \quad\Longleftrightarrow\quad T < 20.$$
