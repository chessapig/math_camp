---
title: Boids
summary: Each person moves according to simple rules, making the crowd shimmer like a flock of birds.
duration: 40-60 min
ages: 8–14
group_size: 10+
location: Outdoors
topics:
  - emergent phemomena
---

## Games
Each of these games is built upon these basic rules.
> [!rules] Basic rules
> 1. Meander randomly around the playing field.
> 2. Select one or two other campers without saying anything acknowledging them. 
> 3. arrange yourself relative to your chosen campers.

As you move to arrange yourself properly, your chosen campers also moves. You can never stay put. Here are several options for rule 3. For each of these rules, think about how the rules movement of each person comes together to create the movement of the crowd. 

> [!facilitation] Introductory discussion
> Show a [video of a murmuration of starlings](https://www.youtube.com/watch?v=V4f_1_r80RY) and discuss the following
> - *How does each bird know where to go?*
> - *Where does the pattern come from?*
>   
> Describe how each bird only needs to follow simple rules, and the pattern can emerge. Today, the campers will be the birds. After each game, ask campers what patterns they noticed, and why those patterns occurred. Ask if the movement of the flock is one of the following.
> - Stationary
> - Stable motion
> - Chaotic

Here are simulations of the various games (coded by claude).
<iframe src="/sketches/boids/" title="Boids simulation" width="100%" height="420" style="border: 1px solid var(--bs-border-color); border-radius: .375rem;"></iframe>

[Open the simulation full screen](/sketches/boids/)

### Secret leader
Choose one camper to be your secret leader, and follow behind them.
> [!figure] **Secret leader** 
> ![A cloud of points, starting randomly and then moving together into cycles.](boids/secret_leader_2.gif)

> [!facilitation] Facilitating questions
> - *How does the density of the flock change over time? does the flock expand or contract? Why?* (It should contract at the start)

### Secret Planet 
Choose one other camper to be your secret planet, and walk in a circle around them.
> [!figure] **Secret Planet** 
> ![A cloud of points, starting randomly and then slowly moving into a whirlpool. One point moves towards a circle around another](boids/secret_planet.gif)

> [!tip] Extension
> - Play another round with everyone orbiting clockwise. When the facilitator yells "SWITCH", everyone swaps the direction of their orbit.  
> - pair the campers up, and have one of each pair orbit clockwise and the other orbit counterclockwise. This makes a fun but rowdy game

> [!facilitation] Facilitating questions
> Start by playing the game. Then play both extensions, to get a sense of the structures that can arise. Finally, play the game again, and try to identify those structures
> - *How does the density of the flock change over time? does the flock expand or contract? Why?* (It should stay roughly the same size)
> - *When everyone orbits the same direction, how does the movement of the flock relate to your motion?* (If you orbit CW / CCW, then the flock rotates CW / CCW). *What is the center of the whirlpool?*
> - *When you paired up, what was the emergent motion?* (Each pair moved along a fixed direction). *How did the rotational motion of orbits cause linear motion of the pair?*

### Secret Spooky 
Choose one camper to be your secret spooky, and walk directly away from them.
> [!figure] **Secret Spooky** 
> ![a cloud of points, which all move outwards to the edge of the screen](boids/secret_spooks.gif)

> [!facilitation]
> - *How does the density of the flock change over time? does the flock expand or contract? Why?* (It should expand quickly)


### Secret admirer 
Choose one camper to be your secret admiree, and move until you have an unobstructed view of them. 
> [!figure] **Secret admirer** 
> ![a cloud of points, some of which occassionally osscilate. One is highlighted with a line drawn towards the target. When this goes near another point, the first point rearranges.](boids/secret_admirer.gif)

> [!facilitation] Facilitating questions
> - *How does the density of the flock change over time? does the flock expand or contract? Why?* (It should stay the same)
> - *How much of the time were you moving?* (A lot of the time) *How come you can be still so often?* (everyone is required to move in the above three games, but here there are conditions where you can stand still.)


### Equilateral Triangles
Choose two other campers. Place yourself at the vertex of an equilateral triangle, with the other two campers at the base
> [!figure] **Equilateral Triangles** 
> ![a cloud of points, expanding out and drifting around chaotically.](boids/equilateral.gif)


> [!facilitation] Facilitating questions
> - For younger crowds, which are not so familiar with equilateral triangles, first practice finding equilateral triangle point from the base in a non-stressful setting.


### Isosceles Triangles
*The Isosceles triangle is named after the ancient greek warrior "Isosceles", famous for having two legs of equal length*

Choose two other campers. Place yourself equidistant from these two campers. See the first segment of [this video](https://www.youtube.com/watch?v=yTalCCdXeiE) for an example
> [!figure] **Isosceles Triangles** 
> ![a cloud of points, staying near the center of the screen and rotating around smoothly. this settles to a stable state by the end of the gif](boids/isocoles.gif)

> [!facilitation] Facilitating questions
> - *The isosceles rules is much more stable then the equilateral rules. Why is that?* (Answer: in the equilateral triangle rule, you have to stand at a specific point. In the isosceles rule, you can stand on a whole line. The second rule is less restrictive. Connect to geometry: every equilateral triangle is isosceles, but not vice versa.)



### Bomb and Shield
Choose one camper to be a bomb, and another to be your shield. Arrange yourself so that the shield is between you and the bomb. See [this video](https://www.youtube.com/watch?v=zu31ZWtTRdw)

> [!figure] **Bomb and shield** 
> ![a cloud of points, quickly forming a central core and a perifery that contorts around. a point is labeled, in line with a shield point and a bomb point](boids/bomb_and_sheild.gif)


### Clumps
 At all times, move towards the center of your three closest neighbors.

> [!figure] **Clumps** 
> ![a cloud of points, quickly forming a few clups. One point is labeled pink, with lines drawn to the three nearest points (blue). The pink moves towards the center of the 3 blue dots.](boids/clumping_boids.gif)

### Boids
 At all times, move towards the center of your two closest neighbors, and walk in the same direction as your neighbors. You must always be walking. (This is a human implementation of the classic [Boids alogrithm](https://en.wikipedia.org/wiki/Boids))
> [!figure] **Boids** 
> ![a cloud of points, coalescing into clumps which meander around, like a flock of birds. one point is highlighed, with lines towards its two closest neighbors. It tries to move towards the center of those neighbors. ](boids/boids.gif)

Notice the meso-scale structure, where the flock seems to be made out of smaller flocks. The flock first splits into clumps, like the clumping rule above. Then, the clump move coherently, and split and merge freely.

## Make your own rules

> [!facilitation] Discussion
> Identify the mathematical themes.
> - Easier to satisfy rules -> more stable patterns
> - Classify end result according to amount of order. *Can you tell which rules create order and which create chaos?*
> 	- unordered (secret spooky, triangles, biggest fan),
> 	- Strongly ordered (secret planet, secret leader), and 
> 	- local order but not global order (clumps, Boids).



Separate into groups of four. (To do this, have everyone meander around, then walk towards the nearest clump of people with less than 4 people in it. when they reach a clump, they add themselves to it.) Each group will come up with a rule for the flock. Assign each group a target behavior for the flock. 
- Pulsating
- Dense
- Sparse
- Chaotic
- Ordered
- Linear

After 5 minutes, bring the class together. Go through each group, and have them present their rule. Then, have the flock implement it. Decide as a group if the flock behaved like the target behavior.  



## Inspiration
Triangles and Bomb-and-Sheild are classic games for dance or drama warmup. See, for example, [this page](https://www.hooplaimpro.com/resource/triangles). Thanks to Frann Herr for suggesting this. 