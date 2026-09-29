# Flower Battle

Flower Battle is a 2 player strategy deck-building game I've been developping lately.  
Each player can construct a bouquet comprised of 6 flowers from a given roster.  
Each flower contributes a set amount of BSP (Base Style Points) to the bouquet each turn, while also triggering a special effect unique to the flower.  

## Game Mechanics

### Day-Night Cycle

The game features a Day and Night cycle. Each match starts with 5 turns of day, followed by 5 turns of night, etc.  
This cycle can  
  * influence certain flower abilities
  * be influenced by certain flower abilities

### Weather cycle

The game also features a dedicated weather system/cycle.  
This system is controlled by a weather pointer, starting at 0.  
The weather drifts towards positives (hotter) at day, and towards negatives (colder) at night.  
A "drift" means a 1-point change.  
This cycle can  
  * influence certain flower abilities
  * be influenced by certain flower abilities

### Reserve Bouquets

Each player has an active and a reserve bouquet.  
At the end of every turn, the players get to choose if they want to switch exactly 1 flower between the bouquets.  
Only the active bouquet flowers provide SP to the bouquet and activate their special effects.  

### Priority system

Each flower ability has a priority. Abilities with negative priority execute first, starting from -inf and working towards -1.  
Then, the added SP to each bouquet is calculated.  
Then, abilities with positive priority start executing, starting from +1 and working towards +inf.  

## Flowers

The game currently has 13 different flower types:  
1. Rose  
  The Rose is a 30BSP (Base Style Points) flower, with no special ability.  
2. Lily  
  The Lily is a 10BSP flower. It gains 5 permanent BSP every turn, with priority +1.  
3. Nightflower  
  The Nightflower is a 20BSP flower. Its BSP quadruples at night (80BSP), with priority -4.  
4. NightExtender  
  The NightExtender is a 10BSP flower. Once every night, it extends the night by 3 turns, with priority -5.  
5. Thornbush  
  The Thornbush is a 15BSP flower. It removes 4SP from every non-immune flower temporarily every turn, with priority -2.  
  Immune flowers: PoisonIvy  
6. Coldflower  
  The Coldflower is a 15BSP flower. Its SP increases with colder weather, up to a theoretical maximum of 65, with priority -4.  
7. Coldsetter  
  The Coldsetter is a 5BSP flower. It changes the weather pointer by -3 every turn, with priority -5.  
8. Warmflower  
  The Warmflower is a 15BSP flower. Its SP increases with hotter weather, up to a theoretical maximum of 65, with priority -4.  
9. Warmsetter  
  The Warmsetter is a 5BSP flower. It changes the weather pointer by +3 every turn, with priority -5.  
10. Leechflower  
  The Leechflower is a 15BSP flower. It steals 10% of every opponent flower's SP, keeping half, except for immune flowers, with priority -3.  
  Immune flowers: PoisonIvy  
11. PoisonIvy  
  The PoisonIvy is a 15BSP flower. It badly poisons opponent contact flowers, with priority -1.  
  Contact flowers: Thornbush, Leechflower.  
12. Monkshood  
  The Monkshood is a 15BSP flower. It poisons a random opponent flower every turn, with a 50% chance, with priority +1.  
13. Stunflower  
  The Stunflower is a 15BSP flower. It stuns a random opponent flower every turn, with a 30% chance, with priority +2.

## Statuses

There are currently 3 Statuses in the game.  

1. Toxic (Bad Poison)  
  Flower loses 4 permanent BSP every turn for 3 turns. Has a 2 turn cooldown per source.  
2. Poison  
  Flower loses 2 permanent BSP every turn for 5 turns. Has a 1 turn cooldown per source.
3. Stun  
  Flower can't activate its special effect for 3 turns. Has a 1 turn cooldown (source independent).
