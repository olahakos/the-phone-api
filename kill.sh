#!/bin/sh

PID=$1
PGID=$(ps opgid= "$PID")
kill -QUIT -"$PGID"
