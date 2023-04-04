# Chess.com Redesign of Nibbler GUI
This is a redesign of the Nibbler Chess GUI (https://github.com/rooklift/nibbler), creating a similar look and feel as Chess.com (only tested for Stockfish). 

## How to install?

Under Code - Download ZIP. Extract and replace all in nibbler-folder/resources/app/.

## What is changed?

Mainly the layout and graphics have been changed. The pieces are now sliding instead of teleporting, sounds have been added and themes (e.g. lichess board and pieces) can be selected.

Additionally, each move shows an evaluation icon similar to Chess.com and accuracy is also calculated.

<img src="https://user-images.githubusercontent.com/23149790/225937986-878f33f2-9f35-49c1-8390-b99f4e68170c.png" width=90% height=90%>

## How is win percentage and accuracy calculated?

Both calculations are directly taken from lichess: https://lichess.org/page/accuracy.

## How does this differ to Chess.com's evaluation?

The win percentage is the exact same, where only the engine and depth create differences. 

To calculate if a blunder or better moves occured, Chess.com's table providing the win percentage difference for each classification is used: https://support.chess.com/article/2965-how-are-moves-classified-what-is-a-blunder-or-brilliant-and-etc.

However, it is also stated that they are not using as strict of a model anymore (e.g. less blunders for lower rated players) and therefore the number of blunders can be different. From comparing some games, it is practically the same, but with more blunders.

## How does accuracy differ to Chess.com's calculation?

Since lichess' calculation is very strict, you will see quite high accuracies displayed. Chess.com is using a newer model that takes some context into account and is also aiming for a general evaluation that tells you if you played good or not, which means it is generally lower than the strict model. More about it: https://support.chess.com/article/1135-what-is-accuracy-in-analysis-how-is-it-measured.

## Credits

Credit to https://github.com/Aldruun for creating chess move sounds.

Chess pieces are taken from: https://github.com/lichess-org/lila/tree/master/public.
