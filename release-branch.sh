#!/usr/bin/env bash

if [[ $(git branch --show-current) == "master" ]]; then
    git checkout -B release
    git push -u origin release
fi