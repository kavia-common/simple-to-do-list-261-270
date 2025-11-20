#!/bin/bash
cd /tmp/kavia/workspace/code-generation/simple-to-do-list-261-270/frontend_react
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

