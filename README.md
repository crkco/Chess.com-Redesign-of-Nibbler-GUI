# Chess.com Redesign of Nibbler GUI
I remodel the Nibbler GUI to look and act like chess.com. However, Nibbler allows for higher depth, faster analyses and better engine. I use Stockfish 15.1. By selecting upper node limit for auto-eval you can run an analysis that will then show similar game review stats as chess.com does.

Here is the required Nibbler GUI https://github.com/rooklift/nibbler/releases.
For Stockfish (don't know if lc0 would work): https://stockfishchess.org/download/.

Then download code as zip and paste into Nibblers folder resources/app/ and replace.

The Graph is very accurate and can be trusted.

The implementation of when Brilliant Move/Great Move occur needs to be added.

The implementation for Best moves needs to be optimized, since right now everything is a best move if evaluation doesn't change (For example M5 -> M6 is 0% difference in eval since it is completly winning, however Chess.com wouldn't call that the best move since there is a faster mate).

For comparison a screenshot of the Nibbler GUI:

[<img src="/eBiOTGc.png">](https://i.imgur.com)

And here the same game in Chess.com:

![alt text]([https://i.imgur.com/jod3ZBP.png])
![alt text]([https://i.imgur.com/uybSqIu.png])

Move List is the same, colors will be added.
Wether it was best move and alternative move like in chess.com will be added.
Graph needs optimisation.
GUI will be increased in size, maybe dynamic sizes.
