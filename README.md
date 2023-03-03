# Chess.com Redesign of Nibbler GUI
I remodel the Nibbler GUI to look and act like chess.com. However, Nibbler allows for higher depth, (unlimted, free) faster analyses and better engine. I use Stockfish 15.1. By selecting upper node limit for auto-eval you can run an analysis that will then show similar game review stats as chess.com does.

Here is the required Nibbler GUI https://github.com/rooklift/nibbler/releases.

For Stockfish (don't know if lc0 would work): https://stockfishchess.org/download/.

Then download code as zip and paste into Nibblers folder resources/app/ and replace.

The Graph is very accurate.

The implementation of when Brilliant Move/Great Move occur needs to be added.

The implementation for Best moves needs to be optimized, since right now everything is a best move if evaluation doesn't change (For example M5 -> M6 is 0% difference in eval since it is completly winning, however Chess.com wouldn't call that the best move since there is a faster mate).

For comparison a screenshot of the Nibbler GUI:

<img src="https://user-images.githubusercontent.com/23149790/222598033-5ed89b16-93b7-4fc1-a47f-4fa8b2d10a45.png" width=90% height=90%>

And here the same game in Chess.com:
Game Review             |  Analysis
:-------------------------:|:-------------------------:
<img src="https://user-images.githubusercontent.com/23149790/222598061-c2799192-8289-4cea-bf4a-872f36135c0f.png" width=70% height=70%>  |  <img src="https://user-images.githubusercontent.com/23149790/222598082-6810fa0d-4dc4-4f0e-bf6d-5592f4a09818.png" width=70% height=70%>

Move List is the same, colors will be added.

Wether it was best move and alternative move like in chess.com will be added.

Graph needs optimisation.

GUI will be increased in size, maybe dynamic sizes.

Play button doesn't have a function yet.

You can't jump to a node that hasn't been analysed yet (crash). Make sure to analyse everything first or play one move after another. 

Win% and Accuracy% is calculated by https://lichess.org/page/accuracy.

Win% is very compatible with chess.com however Accuracy seems to be calculated different according to https://support.chess.com/article/1135-what-is-accuracy-in-analysis-how-is-it-measured. May investigate in future.
