# linkshell-dump

## Legal mumbo jumbo
This script is distributed under the "Have fun with it, but don't blame me" license. 
You are free to use, change, distribute or do whatever with it as long as you don't
blame me if stuff breaks or you get banned from FFXIV for using it.

### What it is
**linkshell-dump** queries the FFXIV Lodestone server to search and dump link shells.
Consider it more as a proof-of-concept then a finished tool. Also keep in mind
that excessive searches can cause some serious stress to the Lodestone servers which 
SE probably won't appreciate. So be sane and don't overuse it. The more specific
your search term is, the less stress it causes for the server.

### Installation
You will need [node.js](https://nodejs.com) to run the script.
After cloning the repository run `npm install` from the project root to download the
dependencies. Then run it with `npm start {your searchterm}`". This will create a log 
file and a CSV with the name specified in the code.


