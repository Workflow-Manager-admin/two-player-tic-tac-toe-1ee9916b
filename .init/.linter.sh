#!/bin/bash
cd /home/kavia/workspace/code-generation/two-player-tic-tac-toe-1ee9916b/tic_tac_toe_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

